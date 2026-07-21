import os
import re
import subprocess
import threading
import shutil
import logging
from datetime import datetime
from pathlib import Path

LOGGER = logging.getLogger(__name__)

def _find_bin(name: str) -> str:
    """
    Finds absolute path of ffmpeg/ffprobe.
    """
    machine_path = os.environ.get("PATH", "")
    try:
        user_path = os.popen(
            'powershell -NoProfile -Command '
            '"[System.Environment]::GetEnvironmentVariable(\'PATH\',\'User\')"'
        ).read().strip()
        full_path = machine_path + os.pathsep + user_path
    except Exception:
        full_path = machine_path

    found = shutil.which(name, path=full_path)
    if found:
        return found

    # Fallback: check standard folders
    common_roots = [
        Path("storage/bin"),
        Path.home() / "AppData/Local/Microsoft/WinGet/Packages",
        Path("C:/ProgramData/chocolatey/bin"),
        Path.home() / "scoop/shims",
        Path("C:/Program Files/ffmpeg/bin"),
        Path("C:/ffmpeg/bin"),
    ]
    exe = name + ".exe"
    for root in common_roots:
        if root.exists():
            for match in root.rglob(exe):
                return str(match)

    return name


def get_ffmpeg_path() -> str:
    return _find_bin("ffmpeg")


# ffprobe is no longer needed


class CameraManager:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls, *args, **kwargs):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)
            return cls._instance

    def __init__(self) -> None:
        if hasattr(self, "_initialized") and self._initialized:
            return
        self.lock = threading.Lock()
        self.recording_threads: dict[str, threading.Thread] = {}
        self.recording_processes: dict[str, subprocess.Popen] = {}
        self.stop_events: dict[str, threading.Event] = {}
        self.logs: dict[str, list[dict]] = {}
        self.start_times: dict[str, datetime] = {}
        self.segment_counts: dict[str, int] = {}
        self.current_files: dict[str, str] = {}
        self.duration_limits: dict[str, int] = {}
        self._initialized = True
        
        # Removed background auto-download of FFmpeg to make it manual only

    def _ensure_binaries_bg(self, callback=None):
        try:
            ffmpeg_path = get_ffmpeg_path()
            
            # Check if working
            ffmpeg_ok = False
            try:
                subprocess.run([ffmpeg_path, "-version"], capture_output=True, timeout=2)
                ffmpeg_ok = True
            except Exception:
                pass
                
            if ffmpeg_ok:
                if callback:
                    callback(True, "FFmpeg đã được cài đặt và hoạt động tốt.")
                return  # Binaries exist and are working!

            # If not found or not working, download them!
            dest_dir = Path("storage/bin")
            dest_dir.mkdir(parents=True, exist_ok=True)
            
            local_ffmpeg = dest_dir / "ffmpeg.exe"
            
            # Try loading AppConfig for base_url
            from agent.config import AppConfig
            config = AppConfig.load()
            base_url = config.get_string("polling.url", "https://agentapi.quanlymay.com").rstrip("/")
            
            import urllib.request
            
            headers = {'User-Agent': 'Mozilla/5.0'}
            
            if not local_ffmpeg.exists():
                LOGGER.info("Downloading ffmpeg.exe from server...")
                url = f"{base_url}/static/releases/ffmpeg.exe"
                req = urllib.request.Request(url, headers=headers)
                with urllib.request.urlopen(req, timeout=120) as response:
                    local_ffmpeg.write_bytes(response.read())
                LOGGER.info("ffmpeg.exe downloaded.")
                
            LOGGER.info("Binaries verification completed.")
            if callback:
                callback(True, "Cài đặt FFmpeg thành công.")
        except Exception as exc:
            LOGGER.error("Failed downloading FFmpeg binary: %s", exc)
            if callback:
                callback(False, f"Lỗi cài đặt FFmpeg: {exc}")

    def add_log(self, camera_name: str, level: str, msg: str):
        with self.lock:
            if camera_name not in self.logs:
                self.logs[camera_name] = []
            self.logs[camera_name].append({
                "time": datetime.now().strftime("%H:%M:%S"),
                "level": level,
                "msg": msg,
            })
            if len(self.logs[camera_name]) > 200:
                self.logs[camera_name] = self.logs[camera_name][-200:]

    def get_logs(self, camera_name: str, since: int = 0) -> list[dict]:
        with self.lock:
            return self.logs.get(camera_name, [])[since:]

    def get_status(self, camera_name: str) -> dict:
        with self.lock:
            proc = self.recording_processes.get(camera_name)
            running = proc is not None and proc.poll() is None
            start_time = self.start_times.get(camera_name)
            elapsed = None
            if start_time and running:
                elapsed = int((datetime.now() - start_time).total_seconds())
            else:
                elapsed = None
            return {
                "running": running,
                "segment_count": self.segment_counts.get(camera_name, 0),
                "start_time": start_time.isoformat() if start_time else None,
                "elapsed_seconds": elapsed,
                "current_file": self.current_files.get(camera_name, ""),
                "log_count": len(self.logs.get(camera_name, [])),
            }

    def test_rtsp_connection(self, rtsp_url: str) -> tuple[bool, str]:
        if not rtsp_url:
            return False, "URL trống"
        try:
            result = subprocess.run(
                [get_ffmpeg_path(), "-v", "error", "-rtsp_transport", "tcp",
                 "-i", rtsp_url, "-t", "1", "-f", "null", "-"],
                capture_output=True, text=True, timeout=15,
            )
            if result.returncode == 0:
                return True, "Kết nối thành công!"
            else:
                err = result.stderr.strip()[:300]
                if "401" in err or "Unauthorized" in err:
                    return False, "Thiếu hoặc sai Username/Password đăng nhập camera (401 Unauthorized)"
                return False, f"Không kết nối được: {err}"
        except subprocess.TimeoutExpired:
            return False, "Timeout — camera không phản hồi sau 15 giây"
        except FileNotFoundError:
            return False, f"FFmpeg không tìm thấy ({get_ffmpeg_path()})"
        except Exception as e:
            return False, f"Lỗi: {e}"

    def start_recording(
        self,
        camera_name: str,
        rtsp_url: str,
        output_dir: str,
        segment_duration: int = 60,
        video_codec: str = "copy",
        audio_codec: str = "copy",
        no_audio: bool = True,
        prefix: str = "rec",
        duration_limit: int | None = None
    ) -> bool:
        with self.lock:
            if camera_name in self.recording_processes:
                LOGGER.warning("Camera %s is already recording.", camera_name)
                return True

            self.stop_events[camera_name] = threading.Event()
            self.start_times[camera_name] = datetime.now()
            self.segment_counts[camera_name] = 0
            self.logs[camera_name] = []
            self.duration_limits[camera_name] = duration_limit
            
        t = threading.Thread(
            target=self._recording_thread,
            args=(camera_name, rtsp_url, output_dir, segment_duration, video_codec, audio_codec, no_audio, prefix),
            daemon=True,
            name=f"cam-rec-{camera_name}"
        )
        with self.lock:
            self.recording_threads[camera_name] = t
        t.start()
        return True

    def stop_recording(self, camera_name: str):
        with self.lock:
            event = self.stop_events.get(camera_name)
            if event:
                event.set()
            proc = self.recording_processes.get(camera_name)
            if proc and proc.poll() is None:
                try:
                    proc.stdin.write("q\n")
                    proc.stdin.flush()
                except Exception:
                    try:
                        proc.terminate()
                    except Exception:
                        pass
        self.add_log(camera_name, "info", "⏹️ Nhận lệnh dừng...")

    def _recording_thread(
        self,
        camera_name: str,
        rtsp_url: str,
        output_dir: str,
        segment_duration: int,
        video_codec: str,
        audio_codec: str,
        no_audio: bool,
        prefix: str
    ):
        out_path = Path(output_dir)
        out_path.mkdir(parents=True, exist_ok=True)

        # Mask password for safety
        masked_url = re.sub(r"(rtsp://[^:]+:)[^@]+(@)", r"\1****\2", rtsp_url)
        self.add_log(camera_name, "info", f"📡 Kết nối tới: {masked_url}")
        self.add_log(camera_name, "info", f"📁 Lưu vào: {out_path}")
        self.add_log(camera_name, "info", f"⏱️ Mỗi segment: {segment_duration} giây")

        consecutive_failures = 0
        MAX_FAILURES = 10
        stop_event = self.stop_events[camera_name]

        while not stop_event.is_set():
            # Check duration limit
            duration_limit = getattr(self, "duration_limits", {}).get(camera_name)
            if duration_limit:
                elapsed = (datetime.now() - self.start_times[camera_name]).total_seconds()
                if elapsed >= duration_limit:
                    self.add_log(camera_name, "info", f"⏰ Đã đạt giới hạn thời gian ghi hình ({duration_limit} giây). Tự động dừng ghi.")
                    self.stop_recording(camera_name)
                    break

            ts = datetime.now().strftime("%Y%m%d_%H%M%S")
            # Format: {prefix}_{camera_name}_{ts}.mp4
            filename = f"{prefix}_{camera_name}_{ts}.mp4"
            output_file = out_path / filename

            with self.lock:
                self.segment_counts[camera_name] += 1
                self.current_files[camera_name] = filename
                seg_num = self.segment_counts[camera_name]

            self.add_log(camera_name, "info", f"🎬 Segment #{seg_num}: {filename}")

            cmd = [
                get_ffmpeg_path(),
                "-loglevel", "error",
                "-rtsp_transport", "tcp",
                "-i", rtsp_url,
                "-t", str(segment_duration),
                "-vcodec", video_codec,
            ]
            if no_audio:
                cmd += ["-an"]
            else:
                cmd += ["-acodec", audio_codec]
            cmd += ["-movflags", "+faststart", "-y", str(output_file)]

            try:
                # Check if FFMPEG exists
                subprocess.run([get_ffmpeg_path(), "-version"], capture_output=True, timeout=2)
            except FileNotFoundError:
                self.add_log(camera_name, "error", f"❌ FFmpeg không tìm thấy! ({get_ffmpeg_path()})")
                break

            try:
                with self.lock:
                    proc = subprocess.Popen(
                        cmd,
                        stdin=subprocess.PIPE,
                        stdout=subprocess.DEVNULL,
                        stderr=subprocess.DEVNULL,
                        text=True,
                    )
                    self.recording_processes[camera_name] = proc

                returncode = proc.wait()

                with self.lock:
                    self.recording_processes.pop(camera_name, None)

                if stop_event.is_set():
                    break

                if returncode == 0 and output_file.exists():
                    size_mb = output_file.stat().st_size / (1024 * 1024)
                    self.add_log(camera_name, "success", f"✅ Đã lưu: {filename} ({size_mb:.1f} MB)")
                    consecutive_failures = 0
                else:
                    friendly_err = f"FFmpeg lỗi (code {returncode}). Vui lòng kiểm tra lại luồng RTSP hoặc kết nối mạng."
                    self.add_log(camera_name, "error", f"❌ {friendly_err}")
                    consecutive_failures += 1
            except Exception as e:
                self.add_log(camera_name, "error", f"❌ Exception: {e}")
                consecutive_failures += 1
                with self.lock:
                    self.recording_processes.pop(camera_name, None)

            if consecutive_failures >= MAX_FAILURES:
                self.add_log(camera_name, "error", f"❌ Quá nhiều lỗi ({MAX_FAILURES}). Dừng.")
                break

            if consecutive_failures > 0 and not stop_event.is_set():
                self.add_log(camera_name, "warn", f"⚠️ Thử lại sau 5 giây... ({consecutive_failures}/{MAX_FAILURES})")
                stop_event.wait(5)

        with self.lock:
            self.recording_processes.pop(camera_name, None)
            self.recording_threads.pop(camera_name, None)
            self.stop_events.pop(camera_name, None)
            self.current_files[camera_name] = ""
        self.add_log(camera_name, "info", "🛑 Đã dừng ghi.")

    def list_recordings(self, camera_name: str, output_dir: str) -> list[dict]:
        out_path = Path(output_dir)
        files = []
        if out_path.exists():
            # Match: prefix_camera_name_YYYYMMDD_HHMMSS.mp4
            # Escape camera name in glob pattern
            glob_pattern = f"*_{camera_name}_*.mp4"
            for f in sorted(out_path.glob(glob_pattern), reverse=True)[:100]:
                stat = f.stat()
                files.append({
                    "name": f.name,
                    "size_mb": round(stat.st_size / (1024 * 1024), 1),
                    "mtime": datetime.fromtimestamp(stat.st_mtime).strftime("%Y-%m-%d %H:%M:%S"),
                })
        return files

    def delete_recording(self, output_dir: str, filename: str) -> bool:
        file_path = Path(output_dir) / filename
        if file_path.exists() and file_path.suffix == ".mp4":
            try:
                file_path.unlink()
                return True
            except Exception:
                pass
        return False

    def render_video_clip(
        self,
        camera_name: str,
        output_dir: str,
        timestamp_str: str,
        duration_seconds: int = 10
    ) -> str | None:
        """
        Locates the recorded file containing the requested timestamp,
        slices a clip from it using FFmpeg (fast stream copy),
        and returns the absolute path of the sliced clip.
        
        timestamp_str format: YYYY-MM-DD HH:M:S or ISO format.
        """
        try:
            # Parse target timestamp
            target_ts = None
            for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%d %H:%M:%S.%f"):
                try:
                    target_ts = datetime.strptime(timestamp_str, fmt)
                    break
                except ValueError:
                    continue

            if not target_ts:
                LOGGER.error("Invalid timestamp format: %s", timestamp_str)
                return None

            out_path = Path(output_dir)
            if not out_path.exists():
                return None

            # Scan files matching the camera
            glob_pattern = f"*_{camera_name}_*.mp4"
            matched_file = None
            file_start_time = None

            # Sort files chronologically to find the correct window
            files_list = sorted(out_path.glob(glob_pattern))
            for f in files_list:
                # Name format: prefix_cameraName_YYYYMMDD_HHMMSS.mp4
                match = re.search(r'_(\d{8}_\d{6})\.mp4$', f.name)
                if not match:
                    continue
                start_str = match.group(1)
                try:
                    start_dt = datetime.strptime(start_str, "%Y%m%d_%H%M%S")
                except ValueError:
                    continue

            # Check with a 5-second tolerance window or exact filename start match
            from datetime import timedelta
            for f in files_list:
                match = re.search(r'_(\d{8}_\d{6})\.mp4$', f.name)
                if not match:
                    continue
                start_str = match.group(1)
                try:
                    start_dt = datetime.strptime(start_str, "%Y%m%d_%H%M%S")
                except ValueError:
                    continue

                file_mtime = datetime.fromtimestamp(f.stat().st_mtime)
                # Exact or within file duration range with 5-second grace period
                if (start_dt - timedelta(seconds=5)) <= target_ts <= (file_mtime + timedelta(seconds=5)):
                    matched_file = f
                    file_start_time = start_dt
                    break

            # Fallback: Match file by exact start timestamp in filename if mtime wasn't updated yet
            if not matched_file:
                target_str = target_ts.strftime("%Y%m%d_%H%M%S")
                for f in files_list:
                    if target_str in f.name:
                        matched_file = f
                        file_start_time = target_ts
                        break

            if not matched_file or not file_start_time:
                LOGGER.warning("No recorded file found covering timestamp %s for camera %s", timestamp_str, camera_name)
                return None

            # Calculate offset in seconds
            offset = int((target_ts - file_start_time).total_seconds())
            if offset < 0:
                offset = 0

            # Output file in a temp directory
            import tempfile
            temp_dir = Path(tempfile.gettempdir()) / "GoPrinxAgent" / "renders"
            temp_dir.mkdir(parents=True, exist_ok=True)
            output_clip_path = temp_dir / f"clip_{camera_name}_{target_ts.strftime('%Y%m%d_%H%M%S')}.mp4"

            # FFmpeg slice command (copy stream for maximum performance, no transcoding)
            cmd = [
                get_ffmpeg_path(), "-y",
                "-ss", str(offset),
                "-i", str(matched_file),
                "-t", str(duration_seconds),
                "-vcodec", "copy",
                "-acodec", "copy",
                str(output_clip_path)
            ]

            LOGGER.info("[CameraManager] Slicing clip command: %s", " ".join(cmd))
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
            if result.returncode == 0 and output_clip_path.exists():
                LOGGER.info("[CameraManager] Successfully sliced video clip: %s", output_clip_path)
                return str(output_clip_path)
            else:
                LOGGER.error("[CameraManager] FFmpeg slice failed: %s", result.stderr)
                return None
        except Exception as exc:
            LOGGER.exception("[CameraManager] Error rendering video clip: %s", exc)
            return None

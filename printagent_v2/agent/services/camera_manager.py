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


FFMPEG = _find_bin("ffmpeg")
FFPROBE = _find_bin("ffprobe")


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
        self._initialized = True

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
            running = camera_name in self.recording_processes
            start_time = self.start_times.get(camera_name)
            elapsed = None
            if start_time:
                elapsed = int((datetime.now() - start_time).total_seconds())
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
                [FFPROBE, "-v", "error", "-rtsp_transport", "tcp",
                 "-show_entries", "stream=codec_name,width,height,r_frame_rate",
                 "-of", "json", "-i", rtsp_url],
                capture_output=True, text=True, timeout=15,
            )
            if result.returncode == 0:
                import json
                try:
                    info = json.loads(result.stdout)
                    streams = info.get("streams", [])
                    details = []
                    for s in streams:
                        codec = s.get("codec_name", "?")
                        w = s.get("width")
                        h = s.get("height")
                        if w and h:
                            details.append(f"{codec} {w}x{h}")
                        else:
                            details.append(codec)
                    return True, f"Kết nối thành công! Stream: {', '.join(details) or 'OK'}"
                except Exception:
                    return True, "Kết nối thành công!"
            else:
                err = result.stderr.strip()[:300]
                return False, f"Không kết nối được: {err}"
        except subprocess.TimeoutExpired:
            return False, "Timeout — camera không phản hồi sau 15 giây"
        except FileNotFoundError:
            return False, f"FFprobe không tìm thấy ({FFPROBE})"
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
        prefix: str = "rec"
    ) -> bool:
        with self.lock:
            if camera_name in self.recording_processes:
                LOGGER.warning("Camera %s is already recording.", camera_name)
                return True

            self.stop_events[camera_name] = threading.Event()
            self.start_times[camera_name] = datetime.now()
            self.segment_counts[camera_name] = 0
            self.logs[camera_name] = []
            
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
                FFMPEG,
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
                subprocess.run([FFMPEG, "-version"], capture_output=True, timeout=2)
            except FileNotFoundError:
                self.add_log(camera_name, "error", f"❌ FFmpeg không tìm thấy! ({FFMPEG})")
                break

            try:
                with self.lock:
                    proc = subprocess.Popen(
                        cmd,
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE,
                        text=True,
                    )
                    self.recording_processes[camera_name] = proc

                stdout, stderr = proc.communicate()
                returncode = proc.returncode

                with self.lock:
                    self.recording_processes.pop(camera_name, None)

                if stop_event.is_set():
                    break

                if returncode == 0 and output_file.exists():
                    size_mb = output_file.stat().st_size / (1024 * 1024)
                    self.add_log(camera_name, "success", f"✅ Đã lưu: {filename} ({size_mb:.1f} MB)")
                    consecutive_failures = 0
                else:
                    err_msg = stderr.strip()[:200] if stderr else "Unknown error"
                    self.add_log(camera_name, "error", f"❌ FFmpeg lỗi (code {returncode}): {err_msg}")
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

                # Check if target timestamp fits in this segment
                file_mtime = datetime.fromtimestamp(f.stat().st_mtime)
                if start_dt <= target_ts <= file_mtime:
                    matched_file = f
                    file_start_time = start_dt
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
                FFMPEG, "-y",
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

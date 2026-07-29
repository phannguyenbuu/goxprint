# Quy tắc Cập nhật Mã nguồn & Deployment (Code Update & Deployment Rules)

> [!IMPORTANT]
> **Hệ thống bao gồm 4 Cơ chế Cập nhật Mã nguồn Linh hoạt**:
> 1. **Cơ chế 1: Hot Deploy Backend & Database (`python deploy_to_vps.py`)**
>    - Dùng khi: Thay đổi HTML, Templates, API routes, SQL Migrations trên Server VPS.
>    - Tác động: Cập nhật Server VPS tức thì, **không chạm vào Agent**.
> 
> 2. **Cơ chế 2: Cập nhật Lõi Động In-Memory (`agent_core.zip`) (`python pack_agent_core.py`)**
>    - Dùng khi: Thay đổi logic code trong `agent/`.
>    - Tác động: Loader `agent_loader.py` trên máy khách tự động nạp `agent_core.zip` mới vào bộ nhớ RAM (`MemoryZipImporter`). **KHÔNG CẦN rebuild file `.exe`!**
> 
> 3. **Cơ chế 3: Nạp Kịch bản Động Dynamic Scripts (`scripts/`)**
>    - Dùng khi: VPS đẩy các đoạn script Python xuống `AppData/Local/Temp/GoPrinxAgent/scripts` để Agent thực thi trực tiếp các lệnh linh hoạt.
> 
> 4. **Cơ chế 4: Rebuild Bộ nạp Loader `.exe` (`python build_and_deploy.py <new_version>`)**
>    - Dùng khi: Sửa đổi bộ nạp `agent_loader.py`, `installer.py`, thêm thư viện C-extension mới, hoặc khi người dùng yêu cầu phát hành bản cài `.exe` mới.

---

## 1. Quy định về Cập nhật & Rebuild File `.exe`
* **CHỈ Rebuild File `.exe` khi**:
  1. Sửa đổi trực tiếp bộ nạp `agent_loader.py` hoặc bộ cài `installer.py`.
  2. Bổ sung các thư viện binary/C-extension mới vào môi trường PyInstaller.
  3. Người dùng yêu cầu phát hành bản cài đặt `.exe` mới.
* **KHÔNG Rebuild `.exe` khi**:
  1. Sửa logic `agent/`: Chỉ cần nén `agent_core.zip` (Cơ chế 2).
  2. Sửa Backend/Web: Chỉ cần chạy `python deploy_to_vps.py` (Cơ chế 1).

---

## 2. Quy tắc Lưu trữ & Đồng bộ Scan Points (`scan_points`)
* **Đối soát duy nhất bằng `mac_id`**: Mọi gói tin cào dữ liệu danh bạ gửi lên VPS bắt buộc đối soát theo thuộc tính `mac_id`.
* **Cơ chế Ghi đè 100%**: Khi gói tin cào điểm scan của một `mac_id` đẩy lên VPS, VPS tự động xóa sạch bản ghi cũ của `mac_id` đó trong bảng PostgreSQL `scan_points` và lưu thay thế 100% bằng gói tin dữ liệu mới nhất.
* **Kích hoạt tự động**: Khi Agent khởi động, Agent đọc tất cả các file `scan_points.json` local sẵn có trên đĩa máy khách và tự động đẩy ngay lên cơ sở dữ liệu PostgreSQL của VPS.

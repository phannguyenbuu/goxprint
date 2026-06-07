# Quy tắc Phát triển và Đóng gói (Development & Build Rules)

Để tránh việc lặp lại lỗi người dùng tải về file `.exe` cũ trong khi Backend đã cập nhật phiên bản mới, bắt buộc phải tuân thủ nghiêm ngặt các quy tắc sau khi tiến hành build và deploy:

## 1. Bắt buộc Compile Loader (.exe) khi có thay đổi code Agent
* **Mô tả**: Do file `printagent.exe` là loader đóng gói kèm tệp lõi `agent_core.zip` ở bên trong nó (qua thuộc tính `datas` của PyInstaller). Khi có bất kỳ sự thay đổi mã nguồn nào của Agent (trong thư mục `agent/`), tệp lõi `agent_core.zip` sẽ thay đổi.
* **Quy tắc**: Không bao giờ được phép dùng lại hoặc copy file `dist/printagent.exe` cũ mà không chạy biên dịch lại. Mỗi khi deploy phiên bản mới có sửa đổi ở Agent, **bắt buộc phải chạy biên dịch lại** loader thông qua PyInstaller để nhúng lõi `agent_core.zip` mới nhất vào trong file `.exe`.

## 2. Chỉ Build trên môi trường Python 3.12
* **Mô tả**: Các thư viện dependencies của loader và agent (như `pyftpdlib`, `psycopg2`, các thư viện win32) được tối ưu hóa và tương thích tốt nhất trên Python 3.12. Việc dùng phiên bản Python khác (như 3.13+) có thể gây lỗi cú pháp hoặc lỗi liên kết thư viện khi đóng gói với PyInstaller.
* **Quy tắc**: **Chỉ được phép sử dụng Python 3.12** để chạy script đóng gói và biên dịch PyInstaller. Đảm bảo virtual environment build (`.build-venv`) luôn chạy trên Python 3.12.

## 3. Quy trình Build & Deploy chuẩn hóa
Mỗi lần cập nhật và deploy, quy trình thực hiện phải đi qua các bước:
1. Chạy cập nhật schema cơ sở dữ liệu nếu có chỉnh sửa model.
2. Thực thi script biên dịch loader: `powershell -File build_agent_loader_exe.ps1` (để pack zip mới, chạy PyInstaller biên dịch exe mới sạch sẽ).
3. Chạy script đóng gói và deploy: `python build_and_deploy.py` (để đẩy code backend, static releases exe/zip mới lên VPS).

## 4. Quy tắc hoạt động của View Address Book (CABD) và Infor trên trang /lan-sites
* **Bấm View (Copier Address Book Details - CABD)**: Chỉ thực hiện tải và hiển thị dữ liệu danh bạ đã được lưu bền vững trong database trước đó (ở cột `address_book_sync` của bảng `Printer`). Tuyệt đối không kích hoạt lệnh quét mới xuống Agent để tránh gây nghẽn/chậm hệ thống.
* **Bấm Infor (ở danh sách ngoài hoặc trong modal CABD)**: Bắt buộc gửi lệnh quét mới (`fetch_address_book`) xuống Agent để đọc danh bạ trực tiếp từ máy photocopy, thực hiện phân tích bóc tách các trường folder (`FolderPortNO`, `Path On Folder`, `Protocol`, `Server/Host`), sau đó cập nhật đè dữ liệu mới này vào database rồi hiển thị lại.

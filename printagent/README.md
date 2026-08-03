# ==========================================
# README.md
# ==========================================

﻿# GoPrinx / PrintAgent

Há»‡ thá»‘ng quáº£n lÃ½ mÃ¡y Ricoh gá»“m 3 pháº§n:

- `agent/`: agent cháº¡y trong LAN, scan mÃ¡y, polling dá»¯ liá»‡u, nháº­n lá»‡nh lock/unlock vÃ  FTP queue
- `backend/`: Flask server + PostgreSQL, nháº­n polling, render portal quáº£n trá»‹, public API
- `app-gox/`: frontend React/Vite cho portal ngÆ°á»i dÃ¹ng

## Tráº¡ng thÃ¡i hiá»‡n táº¡i

Snapshot nÃ y pháº£n Ã¡nh tráº¡ng thÃ¡i repo vÃ  production Ä‘Ã£ kiá»ƒm tra ngÃ y `2026-04-08`.

- Public API production: `https://agentapi.quanlymay.com`
- Frontend production: `https://app.quanlymay.com`
- Backend production cháº¡y trá»±c tiáº¿p táº¡i `/opt/printagent/`
- Service tháº­t trÃªn VPS lÃ  `systemd`: `systemctl restart printagent`
- Nginx proxy `agentapi.quanlymay.com` vÃ o `127.0.0.1:8005`
- Trang docs public render tá»« file `backend/PUBLIC_API.md` qua route `/api-docs`

## Äiá»u quan trá»ng cáº§n nhá»› khi quay láº¡i

1. Repo hiá»‡n dÃ¹ng `agent/` vÃ  `backend/`. Nhiá»u docs cÅ© váº«n nháº¯c `app/` vÃ  `server/`; coi Ä‘Ã³ lÃ  legacy.
2. Production khÃ´ng dÃ¹ng `pm2 restart printagent-server` cho backend nÃ y ná»¯a. DÃ¹ng `systemctl restart printagent`.
3. Device control public dÃ¹ng `mac_id`, khÃ´ng cÃ²n dÃ¹ng `printer_id` lÃ m contract chÃ­nh.
4. `POST /api/devices/<mac_id>/lock|unlock` vÃ  `PATCH /api/devices/<mac_id>/enable` khÃ´ng cÃ²n yÃªu cáº§u `auth_user` / `auth_password` trong request body.
5. Server hiá»‡n nháº­n `mac_id` theo 3 dáº¡ng:
   - `AA:BB:CC:DD:EE:FF`
   - `AA-BB-CC-DD-EE-FF`
   - `AABBCCDDEEFF`

## NÃªn Ä‘á»c gÃ¬ trÆ°á»›c

- `README.md`: overview + production reality
- `backend/PUBLIC_API.md`: contract public API chuáº©n
- `docs/ENDPOINT.md`: báº£n Ä‘á»“ endpoint ná»™i bá»™
- `docs/AGENTS.md`: agent runtime vÃ  cáº¥u hÃ¬nh
- `docs/GEMINI.md`: ghi chÃº handover / memory khi quay láº¡i dá»± Ã¡n
- `backend/README.md`: runbook riÃªng cho backend

## Cáº¥u trÃºc repo

```text
printagent/
â”œâ”€ agent/                  Agent Windows + local web UI
â”œâ”€ backend/                Flask server, templates, SQLAlchemy models
â”œâ”€ app-gox/                React/Vite frontend
â”œâ”€ docs/                   Handover docs, endpoint map, test plans
â”œâ”€ scripts/deploy/         CÃ¡c script deploy; cÃ³ cáº£ script current láº«n legacy
â”œâ”€ storage/                Dá»¯ liá»‡u cá»¥c bá»™/dev
â””â”€ dist/                   Output build agent exe
```

## Cháº¡y local

### Backend

```bash
cd backend
venv/bin/python app.py
```

Windows:

```powershell
cd backend
venv\Scripts\python.exe app.py
```

Máº·c Ä‘á»‹nh backend Ä‘á»c `.env` tá»« thÆ° má»¥c hiá»‡n táº¡i hoáº·c tá»« `backend/.env`.

### Agent EXE

Build:

```powershell
.\build_agent_exe.ps1
```

Deploy:

- `scripts/deploy/deploy_agent_exe.py`
- Upload `dist/printagent.exe` lÃªn `/opt/printagent/static/releases/printagent.exe`
- Upload manifest tá»« `backend/storage/releases/agent_release.json`

## CÃ¡c luá»“ng chÃ­nh

### Polling

1. Agent scan LAN, nháº­n diá»‡n mÃ¡y Ricoh
2. Agent thu `counter`, `status`, `device info`
3. Agent gá»­i `POST /api/polling`
4. Backend upsert dá»¯ liá»‡u latest vÃ o `DeviceInfor` vÃ  lÆ°u history vÃ o `CounterInfor`, `StatusInfor`

### Device control

1. Client gá»i `POST /api/devices/<mac_id>/unlock` hoáº·c `lock`
2. Backend queue `PrinterControlCommand`
3. Agent láº¥y lá»‡nh qua polling controls
4. Agent thao tÃ¡c lÃªn mÃ¡y Ricoh
5. Backend nháº­n result vÃ  tráº£ `200`, `409`, hoáº·c `504`

### FTP queue

1. Client gá»i `POST /api/agents/<agent_id>/ftp-sites`
2. Backend queue `FtpControlCommand`
3. Agent láº¥y queue qua polling
4. Agent tá»± suy ra FTP runtime ná»™i bá»™ tá»« `mac_id + scan_path`, rá»“i apply scan destination

## CÃ¡c file Ä‘Ã¡ng tin cáº­y nháº¥t

- Route thá»±c táº¿: `backend/app.py`
- Normalize MAC/IP vÃ  helper: `backend/utils.py`
- Public API contract: `backend/PUBLIC_API.md`
- Agent runtime config: `agent/config.py`
- Polling control loop: `agent/services/polling_bridge.py`

## CÃ¡c báº«y tÃ i liá»‡u cÅ©

- TÃ i liá»‡u cÅ© cÃ³ thá»ƒ nháº¯c:
  - `server/` thay vÃ¬ `backend/`
  - `app/` thay vÃ¬ `agent/`
  - WebSocket control flow cÅ©
  - `pm2 restart printagent-server`
  - `/api/printer/<id>/lock`
- CÃ¡c ná»™i dung Ä‘Ã³ khÃ´ng cÃ²n lÃ  nguá»“n sá»± tháº­t chÃ­nh.

## Gá»£i Ã½ khi tiáº¿p tá»¥c phÃ¡t triá»ƒn

- Náº¿u thay public API, sá»­a `backend/PUBLIC_API.md` trÆ°á»›c, rá»“i má»›i sá»­a docs cÃ²n láº¡i.
- Náº¿u thay polling/control flow, sá»­a `docs/AGENTS.md` vÃ  `docs/ENDPOINT.md`.
- Náº¿u thay deploy production, cáº­p nháº­t ngay `README.md` vÃ  `docs/GEMINI.md`.


# ==========================================
# AGENTS.md
# ==========================================

@RTK.md

# Frontend Component Reuse Rule

Khi sinh code UI mới trong `app-gox/`, bắt buộc ưu tiên component cũ trước khi tạo component mới.

## Required Order

1. Kiểm tra component sẵn có trong:
   - `app-gox/src/components/requests/`
   - `app-gox/src/components/ui/`
   - `app-gox/src/components/layout/`
2. Ưu tiên mở rộng component cũ bằng props nhỏ, `children`, hoặc tách phần dùng chung ra từ component cũ.
3. Chỉ tạo component mới khi component hiện có không đáp ứng được mà không làm API của nó méo hoặc khó hiểu.

## Hard Rules

- Không copy-paste markup từ component đã tồn tại để dựng component mới gần giống.
- Không tạo badge/status/priority/request card/page state mới nếu có thể dùng lại:
  - `StatusBadge`
  - `PriorityBadge`
  - `RequestCard`
  - `RequestLocationBlock`
  - `StatusStatCard`
  - `PageLoading`
  - `EmptyState`
- Nếu cần tạo component mới, phải nêu ngắn gọn vì sao component cũ không đủ phù hợp.
- Nếu UI chỉ dùng ở một page, ưu tiên page-local subcomponent trước; chỉ promote thành shared component khi có ít nhất 2 chỗ dùng hoặc có khả năng reuse rõ ràng.
- Ưu tiên composition hơn duplication.

## Checklist Before Adding A New Component

- Đã tìm trong `app-gox/src/components/**`
- Đã kiểm tra có thể thêm prop vào component cũ chưa
- Đã kiểm tra có thể tách phần chung ra khỏi page hiện tại chưa
- Đã xác định component mới thực sự có reuse value



# ==========================================
# EDIT.md
# ==========================================

xóa nha
11:17 AM


Worked for 1m 29s
Đã xóa nhóm script legacy:

scripts/deploy/execute_deploy.py
scripts/deploy/deploy_updates_v2.py
scripts/deploy/deploy_ui_only.py
scripts/db/update_db.sh
scripts/db/init_db.py
scripts/deploy/run_remote_setup.py
scripts/deploy/finalize_vps.py
scripts/deploy/force_deploy_fix.py
scripts/deploy/deploy_nginx.py
scripts/deploy/deploy_app_gox_v3.py
scripts/deploy/deploy_frontend.py
Tôi cũng dọn reference tới script đã xóa trong README/docs và bỏ fallback pm2 khỏi scripts/deploy/deploy_drivers.py.

Còn lại trong scripts/ là nhóm có khả năng dùng tiếp: deploy backend/current, deploy agent exe, deploy drivers, verify VPS, build exe, tool LM Studio, seed/password scripts. Compile check agent backend tests scripts pass; Python vẫn in cảnh báo môi trường <prefix> nhưng exit code 0.


Edited 12 files
+4
-447
Undo
Review
scripts/db/init_db.py
scripts/db/update_db.sh
scripts/deploy/deploy_app_gox_v3.py

Show 9 more files




11:18 AM
script nào đang dài > 500 dòng?
11:20 AM


Worked for 8s
Các file script/code hiện còn dài hơn 500 dòng:

Lines	File
5157	backend/app.py
1969	agent/web.py
1630	agent/services/polling_bridge.py
805	agent/modules/ricoh/collector.py
513	backend/serializers.py
501	agent/modules/ricoh/address_book.py
Nếu chỉ tính thư mục scripts/ thì hiện không có file nào > 500 dòng.





11:21 AM
agent/web.py có chức năng gì?
11:22 AM


Worked for 37s
agent/web.py là Flask local web UI/API của agent Windows, không phải backend production.

Nó được dùng khi chạy agent/main.py --mode web. Trong create_app (line 745), file này khởi tạo:

AppConfig
APIClient
RicohService
ToshibaService
PollingBridge
AutoUpdater
Flask app + templates trong agent/templates/
Chức năng chính:

Trang local UI

/devices
/scan
/ftp
/analytics
/dashboard redirect về devices
Scan/discover máy in trong LAN

đọc Windows printers
scan subnet
map IP/MAC
cache danh sách devices
API: /api/devices, /api/devices/refresh
Thao tác máy in

lấy status/counter/device info
bật/tắt/khóa máy Ricoh
đọc trạng thái machine
đọc network interface/MAC
API gom ở /api/devices/action
Quản lý address book scan của Ricoh

list address book
create/delete/modify scan destination
detect/set scan protocol
isolate/release session
setup scan tự động
API: /api/scan/address-list, /api/scan/address-create, /api/scan/address-delete, /api/scan/address-modify, /api/scan/setup-auto
Quản lý FTP local

tạo/update/xóa FTP site local
list FTP sites
đăng ký scan folder để upload polling
API: /api/ftp/create, /api/ftp/update, /api/ftp/sites
Polling bridge control

xem polling status
bật/tắt polling
trigger polling ngay
API: /api/polling/status, /api/polling/toggle, /api/polling/trigger
Update agent

xem update status
nhận webhook text update
API: /api/update/status, /api/update/check, /api/update/receive-text
Nói ngắn gọn: agent/web.py là “bảng điều khiển local” của agent, vừa render UI vừa expose API để điều khiển scan, FTP, máy in, polling và auto-update. File này đang ôm quá nhiều trách nhiệm nên là ứng viên refactor lớn.





11:23 AM
refactor ra làm 3 phần: phần đang chạy ổn là gửi infor counter + status /device, phần thứ 2 là quản lý về /ftp + /scan vì 2 cái này liên quan mật thiết, phần thứ 3 là quản lí UI, bỏ phần /analytics và dashboard không cần thiết
11:31 AM


Worked for 43m 27s
Đã refactor agent/web.py theo 3 phần như yêu cầu.

Tách Chức Năng

Phần device/counter/status ổn định:

agent/web_device.py
agent/web_polling.py
agent/web_discovery.py
agent/web_collect.py
Phần /ftp + /scan:

agent/web_scan_ftp.py
agent/web_ftp.py
agent/web_scan.py
agent/web_scan_address.py
agent/web_scan_misc.py
agent/web_scan_helpers.py
agent/web_scan_support.py
Phần UI:

agent/web_ui.py
agent/web_ui_support.py
agent/web.py giờ chỉ khởi tạo Flask app và register routes.
Đã Bỏ

Route /dashboard
Route /analytics
Template agent/templates/analytics.html
Nav Analytics trong base.html
Dead JS/CSS dashboard/analytics
API cũ /api/dashboard/config, thay bằng /api/ui/config
Kiểm Tra

python -m compileall -q agent backend tests scripts pass.
Tất cả file agent/web*.py hiện đều dưới 500 dòng. agent/web.py còn 88 dòng.
Không còn reference dashboard / analytics trong agent/.
Chưa chạy Flask runtime vì trước đó đã xóa venv/dependencies nên môi trường hiện không có flask.

Web preview
Website
Open

Edited 5 files
+129
-72
Undo
Review
agent/web_device.py
agent/web_scan_ftp.py
agent/web_ui.py

Show 2 more files

# ==========================================
# RULES.md
# ==========================================

# Quy tắc Cập nhật Mã nguồn & Deployment (Code Update & Deployment Rules)

> [!IMPORTANT]
> **Hệ thống bao gồm 4 Cơ chế Cập nhật Mã nguồn Linh hoạt**:
> 1. **Cơ chế 1: Hot Deploy Backend & Database (`python deploy_to_vps.py`)**
>    - Dùng khi: Thay đổi HTML, Templates, API routes, SQL Migrations trên Server VPS.
>    - Tác động: Cập nhật Server VPS tức thì, **không chạm vào Agent**.
> 

---

## 1. Quy định về Cập nhật & Rebuild File `.exe`
* **CHỈ Rebuild File `.exe` khi**:
  1. Sửa đổi trực tiếp bộ nạp `agent_loader.py` hoặc bộ cài `installer.py`.
  2. Bổ sung các thư viện binary/C-extension mới vào môi trường PyInstaller.
  3. Người dùng yêu cầu phát hành bản cài đặt `.exe` mới.
* **KHÔNG Rebuild `.exe` khi**:
  2. Sửa Backend/Web: Chỉ cần chạy `python deploy_to_vps.py` (Cơ chế 1).

---

## 2. Quy tắc Lưu trữ & Đồng bộ Scan Points (`scan_points`)
* **Đối soát duy nhất bằng `mac_id`**: Mọi gói tin cào dữ liệu danh bạ gửi lên VPS bắt buộc đối soát theo thuộc tính `mac_id`.
* **Cơ chế Ghi đè 100%**: Khi gói tin cào điểm scan của một `mac_id` đẩy lên VPS, VPS tự động xóa sạch bản ghi cũ của `mac_id` đó trong bảng PostgreSQL `scan_points` và lưu thay thế 100% bằng gói tin dữ liệu mới nhất.
* **Kích hoạt tự động**: Khi Agent khởi động, Agent đọc tất cả các file `scan_points.json` local sẵn có trên đĩa máy khách và tự động đẩy ngay lên cơ sở dữ liệu PostgreSQL của VPS.


# ==========================================
# RTK.md
# ==========================================

# RTK

- Dùng `rtk` cho các lệnh shell có output lớn khi khả thi.
- Ưu tiên `rtk rg`, `rtk git diff`, `rtk git status`, `rtk npm run build`, `rtk pytest`.
[Đăng nhập vps]
root@31.97.76.62
sshkey:C:\Users\nguyenbuu.DESKTOP-TOEFTR1\.ssh\id_ed25519

[Đăng nhập PostgresSQL]
pguser:postgres
pgpassword:myPass

[Gemini API Keys]
AIzaSyC3OEFmVAnmJltSCsMI8MivjyNklbEDKpQ
Model:gemini-2.5-flask

[Rules]
Không cho phép code .py,.tsx,.jsx dài quá 500 dòng
Backend luôn là trực tiếp ở vps
Báo chuông khi thực hiện xong
Nếu thực thi lệnh gì với file cad, dwg, hãy tìm cách convert nó ra dxf trước

[Path]
C:\Program Files\Autodesk\AutoCAD 2022\acad.exe
C:\Program Files\Autodesk\3ds Max 2022\3dsmax.exe


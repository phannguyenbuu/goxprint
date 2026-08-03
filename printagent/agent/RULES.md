# RULES.md — Agent Development Rules

Tài liệu này ghi lại các quy tắc bắt buộc khi chỉnh sửa code agent,
đặc biệt khi làm việc với Ricoh/Toshiba copier HTTP API.

---

## ❌ RULE 1: Không bao giờ thêm trailing comma vào giá trị form field

### Vấn đề
Ricoh copier CGI endpoints (ví dụ `adrsDeleteEntries.cgi`, `adrsSetUser.cgi`, v.v.)
nhận danh sách entry IDs qua multipart form. Khi build giá trị list:

```python
# ❌ SAI — "54," gây lỗi "Delete not confirmed"
joined = ",".join(ids)
if joined and not joined.endswith(","):
    joined = f"{joined},"

# ✅ ĐÚNG — chỉ dùng join thuần
joined = ",".join(ids)
```

### Lý do
Dù một số tài liệu Ricoh có ghi trailing comma, thực tế máy xử lý giá trị
`"54,"` như một string không hợp lệ → trả về HTML error page thay vì confirm
success → agent báo `Delete not confirmed for entry_id: X`.

### Áp dụng cho các fields
- `entryIndex`
- `entryIndexIn`
- `regiNoListIn`
- `selectedRegiNoIn`
- `deleteListIn`
- Bất kỳ field nào khác nhận danh sách ID phân cách bằng dấu phẩy.

### Phát hiện lỗi
Nếu response HTTP 200 nhưng body là HTML (không phải JSON hoặc redirect đến list page),
**khả năng cao là do trailing comma** trong form data. Kiểm tra POST data trong logs.

---

## ❌ RULE 2: Không giả định trailing comma là cần thiết dựa trên 1 máy cụ thể

Một số dòng máy Ricoh cũ có thể hoạt động với trailing comma, nhưng dòng mới
(IM C, MP C series, v.v.) thì không. Code phải **không có trailing comma** —
nếu máy cũ cần, xử lý riêng bằng fallback, không ảnh hưởng luồng chính.

---

## ✅ RULE 3: Kiểm tra kết quả delete bằng verify loop

Sau mỗi delete, luôn re-fetch address list và verify entry đã biến mất.
Nếu entry vẫn còn sau 3 lần retry → raise lỗi rõ ràng với entry_id và reg_no.

---

## ✅ RULE 4: Refresh wimToken trước mỗi POST mutating

Mỗi GET request đến `adrsList.cgi` hoặc AJAX endpoint đều invalidate wimToken cũ.
Luôn refresh token ngay trước POST delete/set, không dùng token từ request cũ.

---

## ✅ RULE 5: Log POST data đầy đủ khi debug

Khi nghi ngờ form data sai, log ra `form` dict trước khi build multipart:

```python
LOGGER.debug("[RicohAddressBook] Delete form data: %s", form)
```

## ✅ RULE 6: Tránh khóa giao dịch (Transaction Lock) của Ricoh Wizard
Khi chạy qua luồng Wizard để tạo/sửa địa chỉ, copier không tự động commit giao dịch ghi vào danh sách hiển thị chung ngay lập tức nếu dùng chung một HTTP session.
* **Giải pháp**: Bắt buộc phải thực hiện reset web session (`_reset_web_session`) và đăng nhập lại (`_login`) ngay trước khi tiến hành vòng lặp xác thực (verification loop) để ép copier lưu dữ liệu và thoát chế độ Wizard.

---

## ✅ RULE 7: Xử lý lệch ID đăng ký (ID Mismatch) trên một số dòng máy (ví dụ MP 7503)
Trên một số dòng Ricoh, ID tuần tự nội bộ của cơ sở dữ liệu copier (như `15122`) có thể bị trả về hoặc nằm trong hidden input `entryIndexIn` thay vì số đăng ký hiển thị thực tế (như `00002` hoặc `00660`).
* **Giải pháp**: Hàm `_verify_address_entry` phải trả về số đăng ký thực tế được xác thực thành công (kiểu `str | None`) thay vì chỉ trả về boolean. Đồng thời, khớp địa chỉ qua Fallback (so sánh Tên/Thư mục nhận dạng). Cập nhật biến `created_registration_no` bằng số đăng ký thực tế đã xác thực để đồng bộ đúng.


_Cập nhật lần cuối: 2026-07-21 | Lý do: Loại bỏ bắt buộc email khi tạo điểm scan, hỗ trợ username linh hoạt và bổ sung thông báo hint Scan-to-Cloud_

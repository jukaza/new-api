# Hướng dẫn Dịch thuật Giao diện Web sang Tiếng Việt

Tài liệu này cung cấp hướng dẫn và Prompt mẫu để bạn có thể sử dụng các AI có chi phí rẻ (như ChatGPT-4o-mini, Claude Haiku) dịch toàn bộ file ngôn ngữ của web sang Tiếng Việt.

## File cần dịch
Bạn cần nén nội dung của file `new-api/web/default/src/i18n/locales/vi.json` đưa cho AI dịch. Vì file khá dài (hơn 300KB), bạn nên chia nhỏ file thành từng phần để dịch nếu AI báo lỗi giới hạn context.

## Prompt Dịch thuật Chuẩn (Copy & Paste cho AI)

Hãy copy nguyên văn đoạn Prompt sau gửi cho AI kèm theo file (hoặc nội dung) JSON cần dịch:

---
**PROMPT CHO AI:**

> Bạn là một chuyên gia dịch thuật và thiết kế giao diện (UI/UX) cho các hệ thống SaaS phần mềm bán hàng. 
> 
> Dưới đây là nội dung file `vi.json` chứa các key và value ngôn ngữ cho giao diện web. Hãy làm theo các quy tắc sau:
> 1. Dịch toàn bộ các chuỗi văn bản (value) từ tiếng Anh (hoặc tiếng Trung) sang Tiếng Việt tự nhiên, phù hợp với ngữ cảnh của một website phần mềm bán hàng/dịch vụ AI.
> 2. **Tuyệt đối KHÔNG ĐỔI TÊN CÁC KEY** (phần tử bên trái dấu hai chấm). Chỉ dịch phần Value.
> 3. Giữ nguyên định dạng JSON chuẩn. Không thêm bớt dấu ngoặc hay dấu phẩy.
> 4. Giữ nguyên các biến nội suy (như `{{name}}`, `{{count}}`, v.v.) bên trong chuỗi.
> 5. Dịch với giọng văn lịch sự, chuyên nghiệp. Ví dụ: Dùng "Đăng nhập" thay vì "Log in", "Bảng điều khiển" thay vì "Dashboard", "Số dư" thay vì "Balance".
> 
> Xin hãy trả về ĐÚNG ĐỊNH DẠNG JSON MÀ KHÔNG KÈM THEO BẤT KỲ ĐOẠN TEXT GIẢI THÍCH NÀO KHÁC.
> 
> [Dán phần nội dung JSON cần dịch vào đây]

---

## Các lưu ý sau khi dịch xong:
- Sau khi AI trả về kết quả, hãy copy và chép đè vào file `vi.json`.
- Chạy lại lệnh `run-new-api.bat` (hoặc refresh lại trang nếu đang chạy) để xem kết quả.
- Nếu có lỗi "Syntax error", hãy kiểm tra xem AI có thiếu dấu phẩy `,` hoặc ngoặc `}` nào ở cuối các dòng hay không (bạn có thể dùng các tool check JSON format online để tìm lỗi nhanh).

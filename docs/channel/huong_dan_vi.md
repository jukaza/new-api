# Hướng Dẫn Quản Lý Kênh (Channels) - New API Việt Nam

Trang **Kênh (Channels)** là trung tâm kết nối giữa hệ thống cổng API (Gateway) của bạn và các nhà cung cấp dịch vụ AI (như OpenAI, Anthropic Claude, Google Gemini, DeepSeek, AWS Bedrock, Ollama, v.v.). 

Tài liệu này hướng dẫn chi tiết cách cấu hình, tối ưu hóa các tham số và quản lý kênh hiệu quả dành cho Quản trị viên.

---

## 1. Các Khái Niệm Quan Trọng

1. **Kênh (Channel):** Một đường truyền kết nối đến nhà cung cấp AI. Bạn có thể thêm nhiều kênh khác nhau của cùng một nhà cung cấp (ví dụ: dùng nhiều tài khoản/khóa API khác nhau) để tăng giới hạn băng thông (Rate Limit) và làm dự phòng.
2. **Độ ưu tiên (Priority):** Hệ thống sẽ chọn kênh có độ ưu tiên cao nhất đang hoạt động để gửi yêu cầu. Số nguyên càng lớn thì độ ưu tiên càng cao.
3. **Trọng số (Weight):** Khi có nhiều kênh có cùng mức độ ưu tiên, hệ thống sẽ sử dụng trọng số để phân phối ngẫu nhiên các yêu cầu (Cân bằng tải - Load Balancing). Trọng số càng cao thì kênh nhận càng nhiều yêu cầu.

---

## 2. Các Trường Cấu Hình Khi Thêm/Sửa Kênh

Khi nhấp vào nút **Thêm Kênh** hoặc chỉnh sửa kênh hiện tại, bạn cần cấu hình các thông tin sau:

### ── Thông Tin Cơ Bản
* **Tên (Name):** Đặt tên dễ nhớ để phân biệt trong trang quản trị (ví dụ: `OpenAI Production - Acc 1`, `Claude VIP - Acc 2`).
* **Loại (Type):** Nhà cung cấp AI tương ứng (ví dụ: OpenAI, Gemini, DeepSeek, Anthropic,...).
* **Trạng thái Kích hoạt (Enabled):** Bật/tắt kênh này. Kênh bị tắt sẽ không nhận bất kỳ yêu cầu nào từ người dùng.

### ── Cấu Hình API (API Connection & Authentication)
* **Base URL (Địa chỉ API):**
  * **Để trống:** Hệ thống tự động sử dụng endpoint mặc định của nhà cung cấp chính thức.
  * **Điền Base URL tùy chỉnh:** Sử dụng khi bạn kết nối qua proxy, các dịch vụ API bên thứ ba, hoặc máy chủ tự triển khai (như Ollama, Local model).
  * > [!IMPORTANT]
  * > **Không điền `/v1` ở cuối đường dẫn.** Ví dụ: Nhập `https://api.openai-sb.com` thay vì `https://api.openai-sb.com/v1`. Hệ thống sẽ tự xử lý đường dẫn tùy theo loại kênh.
* **API Key (Khóa API):**
  * Điền API Key tương ứng từ nhà cung cấp. 
  * Một số kênh đặc biệt sẽ có hướng dẫn định dạng nhập đi kèm ngay bên dưới (ví dụ: Xunfei định dạng là `APPID|APISecret|APIKey`).
* **Chế độ nhập khóa (Add Mode):**
  * **Khóa đơn (Single Key):** Tạo một kênh duy nhất với API Key này.
  * **Thêm hàng loạt (Batch Add):** Nhập danh sách API Key (mỗi dòng một khóa). Hệ thống tự động tách ra tạo thành nhiều kênh độc lập.
  * **Chế độ đa khóa (Multi-Key Mode):** Nhập danh sách API Key (mỗi dòng một khóa) nhưng **gộp chung vào 1 kênh duy nhất**. Hệ thống sẽ tự động xoay vòng tuần tự hoặc ngẫu nhiên giữa các khóa này khi có yêu cầu để tránh quá tải/vượt giới hạn tần suất.

### ── Quản Lý Mô Hình (Models)
* **Mô hình:** Chọn các mô hình mà kênh này hỗ trợ. Khách hàng chỉ có thể gọi các mô hình được tick chọn ở đây.
* Các nút hỗ trợ nhanh:
  * **Nạp mô hình từ nhà cung cấp (Fetch):** Tự động truy vấn lên upstream để lấy các mô hình khả dụng của API Key đó.
  * **Điền mô hình liên quan (Fill Related):** Tự động điền các mô hình phổ biến của nhà cung cấp đã chọn.
  * **Điền tất cả (Fill All):** Chọn toàn bộ mô hình hiện có trong hệ thống.
  * **Xóa tất cả (Clear):** Xóa trống danh sách mô hình của kênh này.

### ── Nhóm Người Dùng (Groups)
* **Nhóm:** Phân quyền nhóm người dùng được phép sử dụng kênh này (ví dụ: `default`, `vip`, `developer`). Bạn có thể phân chia để chỉ các tài khoản VIP mới được dùng các kênh chất lượng cao hoặc mô hình đắt tiền.

---

## 3. Cài Đặt Nâng Cao (Advanced Settings)

Nhấp vào **Cài đặt nâng cao** để cấu hình sâu hơn:

* **Tự động vô hiệu hóa (Auto Ban):**
  * **Bật (Khuyến nghị):** Nếu kênh này bị lỗi liên tiếp (hết tiền, key bị thu hồi, lỗi mạng thượng nguồn), hệ thống sẽ tự động tắt kênh tạm thời để yêu cầu của khách hàng tự động chuyển sang kênh dự phòng khác mà không bị lỗi đứt quãng.
  * **Tắt:** Kênh vẫn tiếp tục nhận yêu cầu dù liên tục báo lỗi.
* **Ánh xạ mô hình (Model Mapping):**
  * Cấu hình JSON để đổi tên mô hình khách hàng gọi thành mô hình thực tế gửi lên nhà cung cấp.
  * *Ví dụ:* Khi khách hàng gọi model `gpt-4`, bạn muốn hệ thống chuyển tiếp yêu cầu đó thành `gpt-4-o1` trên kênh này. Cấu hình JSON:
    ```json
    {
      "gpt-4": "gpt-4-o1"
    }
    ```
* **Ghi đè tham số (Param Override):** Cấu hình JSON để ép buộc các tham số yêu cầu (ví dụ: ép `temperature` luôn bằng `0.7`, `max_tokens` luôn là `2048` bất kể khách hàng truyền vào là bao nhiêu).
* **Ghi đè Header (Header Override):** Bổ sung hoặc ghi đè các HTTP Header tùy chỉnh khi gọi lên API nhà cung cấp.
* **Ghi chú (Remark):** Ghi chú nội bộ cho quản trị viên (không hiển thị cho người dùng).

---

## 4. Các Thao Tác Quản Trị Thường Dùng

* **Kiểm thử (Test):** Nhấp để gửi một yêu cầu thử nghiệm nhỏ đến nhà cung cấp. Hệ thống sẽ trả về độ trễ (ví dụ: `150ms` màu xanh) hoặc thông báo lỗi chi tiết nếu thất bại (màu đỏ).
* **Check Số Dư (Check Balance):** Kiểm tra trực tiếp tài khoản API Key đó còn bao nhiêu tiền (chỉ khả dụng với các nhà cung cấp hỗ trợ API tra cứu số dư).
* **Lọc & Tìm kiếm:** Sử dụng thanh lọc ở đầu bảng để lọc nhanh theo tên kênh, ID, loại nhà cung cấp hoặc lọc theo mô hình để tìm nhanh các kênh đang chịu trách nhiệm gánh mô hình đó.

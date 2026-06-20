# Cơ chế Giao tiếp Thời gian thực (Polling / SSE / WebSocket)

::: tip Hướng dẫn cốt lõi
**Trình duyệt làm thế nào để cập nhật dữ liệu thời gian thực?**
Giao thức HTTP truyền thống dựa trên mô hình "yêu cầu-phản hồi", trong đó máy khách phải chủ động gửi yêu cầu thì máy chủ mới có thể trả về dữ liệu. Nếu chúng ta cần triển khai các kịch bản thời gian thực như phòng chat hoặc bảng giá chứng khoán, mô hình này sẽ phải đối mặt với thách thức.

Chương này sẽ giới thiệu ba công nghệ frontend chính để giao tiếp dữ liệu thời gian thực: Polling ngắn (Polling), Sự kiện đẩy từ máy chủ (SSE) và WebSocket song công toàn phần, đồng thời khám phá nguyên lý và kịch bản ứng dụng của chúng.
:::

---

## 1. Hạn chế của HTTP truyền thống

Giao thức HTTP được thiết kế ban đầu cho việc truy xuất tài liệu, nó có đặc điểm **không trạng thái (Stateless)** và **do máy khách khởi tạo một chiều**:
1. Máy khách khởi tạo yêu cầu HTTP.
2. Máy chủ xử lý yêu cầu và trả về phản hồi.
3. Sau khi hoàn thành nhiệm vụ, kết nối thường giải phóng yêu cầu logic tương ứng (mặc dù HTTP/1.1 hỗ trợ tái sử dụng kết nối dài, nhưng mô hình yêu cầu-phản hồi ở tầng nghiệp vụ không thay đổi).

Trong chế độ này, máy chủ không thể chủ động thông báo cho máy khách đang chờ về sự thay đổi trạng thái. Để lấy dữ liệu mới nhất, phải tìm các giải pháp kiến trúc khác.

---

## 2. Polling ngắn (Polling)

Giải pháp trực tiếp nhất là **Polling ngắn**. Tức là máy khách sử dụng bộ đếm thời gian (như `setInterval`), mỗi khoảng thời gian cố định, tự động gửi yêu cầu HTTP đến máy chủ để hỏi xem có dữ liệu mới đến không.

<PollingDemo />

**Đặc điểm kỹ thuật và hạn chế:**
- **Ưu điểm**: Cơ chế triển khai cực kỳ đơn giản, hoàn toàn dựa vào giao thức HTTP tiêu chuẩn và công nghệ AJAX/Fetch.
- **Nhược điểm**: Có thể tạo ra chi phí mạng khổng lồ và lãng phí tài nguyên. Phần lớn thời gian, phản hồi của máy chủ có thể là "không có dữ liệu mới". Dù có hay không có dữ liệu, mỗi yêu cầu đều phải mang theo header HTTP đầy đủ (Headers, Cookies, v.v.), trong kịch bản đồng thời cao, sẽ dẫn đến tài nguyên mạng bị chiếm bởi số lượng lớn truy vấn vô nghĩa.

---

## 3. Sự kiện đẩy từ máy chủ (Server-Sent Events)

Để giảm chi phí thiết lập kết nối HTTP thường xuyên, **Server-Sent Events (SSE)** cung cấp kiến trúc đẩy luồng dữ liệu một chiều nhẹ.

SSE được xây dựng trên giao thức HTTP. Sau khi máy khách gửi yêu cầu HTTP chứa header đặc biệt (`Accept: text/event-stream`), máy chủ sẽ giữ kết nối TCP ở tầng dưới không đóng khi trả về phản hồi. Sau đó, máy chủ có thể liên tục đẩy dữ liệu định dạng văn bản đến máy khách thông qua kênh liên tục này.

<SSEDemo />

**Đặc điểm kỹ thuật và hạn chế:**
- **Ưu điểm**: Kết nối liên tục, chi phí mạng thấp; trình duyệt hỗ trợ sẵn cơ chế tự động kết nối lại khi ngắt; rất phù hợp để truyền **một chiều** dữ liệu luồng từ máy chủ đến máy khách (ví dụ: xuất văn bản từng chữ của mô hình ngôn ngữ lớn, thông báo giao dịch thời gian thực).
- **Nhược điểm**: Kênh giao tiếp là một chiều. Nếu máy khách cần gửi lệnh điều khiển hoặc dữ liệu mới đến máy chủ, phải thiết lập yêu cầu HTTP thông thường riêng.

---

## 4. WebSocket: Giao thức giao tiếp song công toàn phần

Khi kịch bản ứng dụng liên quan đến tương tác hai chiều tần số cao (như trò chơi hành động trực tuyến nhiều người, chỉnh sửa tài liệu cộng tác chính xác), chúng ta cần một công nghệ vừa giảm chi phí giao tiếp, vừa đạt được giao tiếp song công thực sự — **WebSocket**.

WebSocket là một giao thức giao tiếp mạng độc lập. Nó khéo léo tận dụng giao thức HTTP để hoàn thành kết nối ban đầu:
1. **Giai đoạn bắt tay**: Máy khách gửi yêu cầu HTTP đặc biệt, khai báo muốn nâng cấp lên giao thức mới (mang header `Upgrade: websocket`).
2. **Chuyển đổi kết nối**: Nếu máy chủ hỗ trợ và đồng ý với giao thức, nó sẽ phản hồi mã trạng thái `101 Switching Protocols`.
3. **Tự do hoàn toàn**: Lúc này, sứ mệnh quy phạm HTTP kết thúc, kết nối TCP ở tầng dưới được chuyển giao cho giao thức WebSocket. Từ đây, máy khách và máy chủ có quyền giao tiếp song công toàn phần (Full-Duplex) bình đẳng, cả hai bên có thể gửi và nhận các khung dữ liệu định dạng tối giản bất cứ lúc nào.

<WebSocketDemo />

**Đặc điểm kỹ thuật và hạn chế:**
- **Ưu điểm**: Hỗ trợ giao tiếp hai chiều thời gian thực thực sự; thông tin header của khung dữ liệu cực nhỏ, độ trễ giao tiếp thấp, hiệu suất thông lượng cao; hỗ trợ truyền dữ liệu nhị phân gốc (ArrayBuffer).
- **Nhược điểm**: Kiến trúc và độ phức tạp phát triển cao hơn; do duy trì kết nối dài liên tục, đặt yêu cầu kỹ thuật khắt khe hơn đối với kiến trúc hệ thống máy chủ, chiến lược cân bằng tải và thiết kế giám sát heartbeat.

---

## 5. Tổng kết: So sánh lựa chọn công nghệ

| Chiều | Polling ngắn (Polling) | Sự kiện đẩy từ máy chủ (SSE) | WebSocket |
| :--- | :--- | :--- | :--- |
| **Hướng giao tiếp** | Máy khách chủ động polling kéo dữ liệu (một chiều) | Máy chủ liên tục chủ động đẩy (một chiều) | Máy khách và máy chủ có quyền gửi nhận bình đẳng (song công toàn phần hai chiều) |
| **Giao thức tầng dưới** | HTTP tiêu chuẩn | HTTP tiêu chuẩn | Giao thức WebSocket độc lập (dựa trên TCP) |
| **Chi phí dữ liệu** | Cực cao (bao gồm header HTTP đầy đủ) | Khá thấp | Cực thấp (header khung dữ liệu tối giản) |
| **Kịch bản ứng dụng điển hình** | Kiểm tra định kỳ trạng thái hoàn thành tác vụ bất đồng bộ ở backend | Xuất luồng một chiều hội thoại mô hình ngôn ngữ lớn, thông báo tin tức hoặc hệ thống | Báo hiệu âm thanh/hình ảnh thời gian thực, đối chiến trực tuyến nhiều người, bảng trắng và chỉnh sửa cộng tác |

Trong thực tế kỹ thuật, nhà phát triển nên dựa trên yêu cầu cụ thể của kịch bản kinh doanh đối với khả năng thời gian thực và tần suất tương tác hai chiều, cân bằng giữa độ phức tạp bảo trì hệ thống và hiệu quả giao tiếp, chọn công nghệ phù hợp nhất.

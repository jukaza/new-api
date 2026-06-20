# Giới hạn tốc độ và kiểm soát backpressure

::: tip Lời mở đầu
**Đêm Double 11, hàng trăm triệu người dùng truy cập cùng lúc -- máy chủ có chịu được không?** Mọi hệ thống đều có giới hạn xử lý. Khi lượng yêu cầu vượt quá khả năng chịu đựng của hệ thống, nếu không kiểm soát, kết quả là tất cả đều không thể sử dụng. Giới hạn tốc độ và backpressure là hai tuyến phòng vệ bảo vệ hệ thống khỏi bị "quá tải".
:::

**Bài viết này sẽ giúp bạn học gì?**

Sau khi hoàn thành chương này, bạn sẽ có:

- **Sự cần thiết của giới hạn tốc độ**: hiểu tại sao cần từ chối chủ động một số yêu cầu để bảo vệ hệ thống
- **Thuật toán giới hạn**: nắm vững nguyên lý và sự khác biệt của ba thuật toán cốt lõi: thùng token, thùng rò và cửa sổ trượt
- **Cơ chế backpressure**: hiểu chiến lược xử lý khi tốc độ upstream vượt quá downstream
- **Giới hạn đa tầng**: tìm hiểu kiến trúc giới hạn đa tầng từ client đến gateway và dịch vụ
- **Khả năng thực chiến**: biết chọn chiến lược giới hạn nào trong tình huống nào

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Tại sao cần giới hạn tốc độ | Hiệu ứng avalanche, bảo vệ dịch vụ |
| **Chương 2** | Thuật toán giới hạn | Thùng token, thùng rò, cửa sổ trượt |
| **Chương 3** | Kiểm soát backpressure | Buffer, chiến lược loại bỏ, co giãn đàn hồi |
| **Chương 4** | Kiến trúc giới hạn đa tầng | Client, gateway, server |
| **Chương 5** | Thực chiến và lựa chọn | Nginx, Redis, Sentinel |

---

## 0. Toàn cảnh: Tại sao phải "từ chối" người dùng?

Nghe có vẻ phản trực giác -- chúng ta không nên phục vụ tốt mỗi người dùng sao? Nhưng thực tế là: **không từ chối một phần yêu cầu, tất cả yêu cầu đều sẽ thất bại**.

Hãy tưởng tượng một nhà hàng chỉ chứa được 100 người, đột nhiên có 1000 người đổ vào. Nếu không giới hạn, kết quả không phải là 1000 người đều ăn được, mà là bếp collapse, phục vụ bàn tê liệt, 1000 người ai cũng không ăn được. Cách đúng là xếp hàng giới hạn ở cửa, cho 100 người vào trước, những người khác chờ đợi.

::: tip Mục tiêu cốt lõi của giới hạn tốc độ
- **Bảo vệ hệ thống**: ngăn quá tải dẫn đến dịch vụ hoàn toàn không khả dụng
- **Phân bổ công bằng**: đảm bảo các yêu cầu đã được chấp nhận được xử lý bình thường
- **Downgrade graceful**: các yêu cầu bị giới hạn nhận được mã trạng thái 429 rõ ràng, thay vì timeout hoặc lỗi 500
:::

---

## 1. Thuật toán giới hạn: Ba giải pháp kinh điển

Vấn đề cốt lõi của giới hạn là: **trong một đơn vị thời gian, cho phép tối đa bao nhiêu yêu cầu đi qua?** Các thuật toán khác nhau có sự đánh đổi khác nhau về độ chính xác, xử lý lưu lượng burst và độ phức tạp triển khai.

<RateLimitAlgorithmDemo />

| Thuật toán | Nguyên lý | Lưu lượng burst | Độ chính xác | Độ phức tạp |
|------|------|---------|--------|-----------|
| Thùng token | Phát token với tốc độ cố định, yêu cầu tiêu thụ token | Cho phép (nếu có token trong thùng) | Cao | Trung bình |
| Thùng rò | Yêu cầu xếp hàng, xử lý với tốc độ cố định | Không cho phép (hoàn toàn mượt mà) | Cao | Trung bình |
| Cửa sổ trượt | Đếm số yêu cầu trong cửa sổ | Cho phép một phần | Khá cao | Thấp |
| Cửa sổ cố định | Đếm theo cửa sổ thời gian | Có thể burst ở ranh giới | Thấp | Thấp nhất |

::: tip Chọn thuật toán nào?
- **Giới hạn API**: Thùng token được sử dụng nhiều nhất, cho phép lưu lượng burst hợp lý
- **Định hình lưu lượng**: Thùng rò phù hợp cho các tình huống cần tốc độ đầu ra không đổi
- **Đếm đơn giản**: Cửa sổ trượt dễ triển khai, phù hợp cho hầu hết ứng dụng web
:::

---

## 2. Kiểm soát backpressure: Khi upstream nhanh hơn downstream

Giới hạn giải quyết vấn đề "quá nhiều yêu cầu bên ngoài", trong khi **backpressure** giải quyết vấn đề "tốc độ không khớp giữa các thành phần nội bộ".

Khi producer tạo dữ liệu nhanh hơn tốc độ consumer có thể xử lý, buffer trung gian liên tục mở rộng, cuối cùng dẫn đến tràn bộ nhớ hoặc mất dữ liệu. Cơ chế backpressure cho phép consumer "thông báo ngược" producer giảm tốc độ.

<BackpressureDemo />

::: tip Bốn chiến lược backpressure
1. **Loại bỏ (Drop)**: khi buffer đầy, loại bỏ dữ liệu mới hoặc cũ, phù hợp cho tình huống yêu cầu thời gian thực cao nhưng cho phép mất mát
2. **Chặn (Block)**: tạm dừng producer, đợi consumer xử lý xong rồi tiếp tục, phù hợp cho tình huống dữ liệu không được phép mất
3. **Lấy mẫu (Sample)**: chỉ xử lý một phần dữ liệu, phù hợp cho luồng dữ liệu tần suất cao
4. **Co giãn đàn hồi (Scale)**: tăng động số lượng consumer, phù hợp cho môi trường cloud-native
:::

---

## 3. Kiến trúc giới hạn đa tầng

Trong môi trường production, giới hạn không đủ ở một điểm duy nhất, mà cần **bảo vệ đa tầng**, mỗi tầng giải quyết vấn đề ở granularity khác nhau.

| Tầng | Vị trí | Granularity giới hạn | Công cụ |
|------|------|---------|------|
| Client | Frontend/App | Chống rung nút bấm, throttle yêu cầu | lodash.throttle, debounce |
| CDN/WAF | Node edge | Cấp IP, cấp khu vực | Cloudflare Rate Limiting |
| API Gateway | Gateway đầu vào | Cấp route, cấp người dùng | Nginx limit_req, Kong |
| Server | Bên trong ứng dụng | Cấp endpoint, cấp tài nguyên | Sentinel, Resilience4j |
| Database | Tầng lưu trữ | Số kết nối, QPS | Cấu hình connection pool, fuse truy vấn chậm |

::: tip Quy cách HTTP cho giới hạn
Yêu cầu bị giới hạn nên trả về mã trạng thái `429 Too Many Requests`, và bao gồm trong response header:
- `Retry-After`: đề xuất client thử lại sau bao lâu (giây hoặc ngày)
- `X-RateLimit-Limit`: giới hạn tốc độ
- `X-RateLimit-Remaining`: hạn ngạch còn lại
- `X-RateLimit-Reset`: thời gian đặt lại hạn ngạch
:::

---

## 4. Lựa chọn thực chiến

| Tình huống | Giải pháp đề xuất | Mô tả |
|------|---------|------|
| Giới hạn đầu vào Nginx | `limit_req_zone` | Dựa trên thuật toán thùng rò, cấu hình đơn giản |
| Giới hạn phân tán | Redis + script Lua | Thùng token hoặc cửa sổ trượt, chia sẻ bộ đếm giữa các instance |
| Microservice Java | Sentinel / Resilience4j | Hỗ trợ fuse, downgrade, giới hạn hotspot |
| API Node.js | express-rate-limit | Dễ sử dụng, hỗ trợ lưu trữ Redis |
| Dịch vụ Go | golang.org/x/time/rate | Triển khai thùng token từ thư viện chuẩn |

---

## Tóm tắt

Giới hạn tốc độ và backpressure là hai tuyến phòng vệ quan trọng bảo vệ tính ổn định của hệ thống. Giới hạn kiểm soát tốc độ luồng lưu lượng bên ngoài, backpressure điều phối tốc độ xử lý giữa các thành phần nội bộ.

Ôn tập các điểm chính của chương:

1. **Sự cần thiết của giới hạn**: không từ chối một phần yêu cầu, tất cả yêu cầu đều sẽ thất bại
2. **Ba thuật toán cốt lõi**: Thùng token (cho phép burst), Thùng rò (hoàn toàn mượt mà), Cửa sổ trượt (đơn giản chính xác)
3. **Cơ chế backpressure**: Loại bỏ, Chặn, Lấy mẫu, Co giãn -- bốn chiến lược
4. **Bảo vệ đa tầng**: từ client đến database, mỗi tầng giải quyết vấn đề ở granularity khác nhau
5. **Quy cách 429**: trả về mã trạng thái chuẩn và thông tin header giới hạn khi bị giới hạn

## Đọc thêm

- [Thực hành giới hạn của Stripe](https://stripe.com/blog/rate-limiters) - Thiết kế giới hạn trong hệ thống thanh toán
- [Tài liệu Nginx limit_req](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html) - Module giới hạn của Nginx
- [Alibaba Sentinel](https://sentinelguard.io/) - Component kiểm soát lưu lượng cho dịch vụ phân tán
- [Resilience4j](https://resilience4j.readme.io/) - Thư viện chịu lỗi nhẹ cho Java
- [Giải thích thuật toán Token Bucket](https://en.wikipedia.org/wiki/Token_bucket) - Nguyên lý toán học của thuật toán thùng token

# Phương pháp luận Thiết kế Hệ thống

::: tip Lời mở đầu
**Thiết kế hệ thống không phải là vẽ sơ đồ kiến trúc theo cảm tính, mà là một phương pháp luận có quy tắc rõ ràng.** Cho dù là bài toán thiết kế hệ thống trong phỏng vấn hay thiết kế kiến trúc trong công việc thực tế, đều tuân theo khung tư duy tương tự: trước hết nắm rõ vấn đề, sau đó ước tính quy mô, tiếp đó thiết kế phương án, cuối cùng đi sâu tối ưu.
:::

**Bài viết này sẽ giúp bạn học được gì?**

Sau khi học xong chương này, bạn sẽ đạt được:

- **Quy trình thiết kế**: Nắm vững khung phương pháp bốn bước của thiết kế hệ thống
- **Ước tính dung lượng**: Học kỹ năng "ước tính mặt sau phong bì"
- **Mẫu phổ biến**: Quen thuộc với các mẫu cốt lõi như cache, phân DB/phân bảng, message queue
- **Tư duy đánh đổi**: Hiểu tư duy trade-off trong thiết kế kiến trúc
- **Kịch bản thực chiến**: Hiểu quá trình thiết kế thông qua các kịch bản như dịch vụ short link, feed stream

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Phương pháp bốn bước | Làm rõ nhu cầu, ước tính dung lượng, thiết kế kiến trúc, đi sâu tối ưu |
| **Chương 2** | Ước tính dung lượng | QPS, lưu trữ, băng thông, ước tính mặt sau phong bì |
| **Chương 3** | Mẫu thiết kế cốt lõi | Cache, phân DB/phân bảng, message queue, CDN |
| **Chương 4** | Tư duy đánh đổi | Nhất quán vs Khả dụng, Hiệu suất vs Chi phí |
| **Chương 5** | Kịch bản kinh điển | Dịch vụ short link, Feed stream, Hệ thống flash sale |

---

## 1. Phương pháp bốn bước thiết kế hệ thống

Thiết kế hệ thống không phải là vẽ sơ đồ kiến trúc ngay từ đầu. Cho dù trong phỏng vấn hay thực chiến, đều nên tuân theo một quy trình có cấu trúc.

<SystemDesignStepsDemo />

::: tip Tại sao phải làm rõ nhu cầu trước?
Nhiều người nhận đề bài đã bắt đầu vẽ sơ đồ, kết quả thiết kế một hệ thống "đúng nhưng không phải điều người phỏng vấn muốn". Dành 5 phút hỏi rõ nhu cầu có thể tránh được 30 phút làm lại sau đó.

Các câu hỏi làm rõ phổ biến:
- Chức năng cốt lõi của hệ thống là gì? (Không cần thiết kế tất cả chức năng)
- Quy mô người dùng lớn bao nhiêu? (Quyết định có cần phân tán hay không)
- Tỷ lệ đọc/ghi? (Quyết định chiến lược cache)
- Dữ liệu cần lưu bao lâu? (Quyết định phương án lưu trữ)
:::

---

## 2. Ước tính dung lượng: Nghệ thuật mặt sau phong bì

"Back-of-envelope estimation" (Ước tính mặt sau phong bì) là kỹ năng cốt lõi trong thiết kế hệ thống. Không cần tính toán chính xác, chỉ cần biết bậc lượng.

<CapacityEstimationDemo />

### Bảng tra đổi nhanh thường dùng

| Bậc lượng | Quy đổi | Mẹo ghi nhớ |
|------|------|---------|
| 1 ngày | 86.400 giây | ≈ 100.000 giây |
| 100 triệu yêu cầu/ngày | ≈ 1.200 QPS | Chia cho 100.000 |
| 1 KB x 100 triệu | ≈ 100 GB | 100 triệu bản ghi nhỏ |
| 1 MB x 1 triệu | ≈ 1 TB | 1 triệu hình ảnh |

### Áp dụng quy tắc 80/20 trong ước tính

Hầu hết hệ thống tuân theo quy tắc 80/20: 20% dữ liệu gánh 80% yêu cầu. Điều này có nghĩa:

- **Kích thước cache** ≈ Tổng dung lượng dữ liệu x 20%
- **QPS điểm nóng** ≈ Tổng QPS x 80% tập trung vào 20% key
- **Tỷ lệ trúng cache** mục tiêu ≈ 80%+ (thấp hơn mức này thì chiến lược cache có vấn đề)

---

## 3. Mẫu thiết kế cốt lõi

Các mẫu xuất hiện lặp đi lặp lại trong thiết kế hệ thống, nắm vững chúng có thể đối phó với hầu hết các kịch bản.

### 3.1 Mẫu Cache

| Mẫu | Đường đọc | Đường ghi | Phù hợp |
|------|--------|--------|---------|
| Cache-Aside | Trước query cache, miss thì query DB và điền lại | Trước ghi DB, sau đó xóa cache | Kịch bản thông thường, phổ biến nhất |
| Read-Through | Tầng cache tự động load từ DB | Giống Cache-Aside | Cần framework cache hỗ trợ |
| Write-Behind | Giống Cache-Aside | Trước ghi cache, bất đồng bộ ghi DB | Ghi nhiều, có thể chấp nhận mất dữ liệu |

::: tip Tại sao là "xóa cache" chứ không phải "cập nhật cache"?
Cập nhật cache trong kịch bản đồng thời dễ gây dữ liệu không nhất quán: thread A và B cùng cập nhật, A ghi DB trước nhưng B cập nhật cache trước, dẫn đến cache chứa giá trị cũ của B. Xóa cache thì yêu cầu đọc tiếp theo sẽ load lại từ DB, tự nhiên tránh được vấn đề này.
:::

### 3.2 Phân DB/phân bảng

Khi số lượng dữ liệu một bảng vượt quá mười triệu, hoặc QPS một DB vượt quá giới hạn, thì cần cân nhắc phân DB/phân bảng.

| Chiến lược | Cách làm | Ưu điểm | Nhược điểm |
|------|------|------|------|
| Phân DB dọc | Phân tách DB theo domain nghiệp vụ | Tách biệt nghiệp vụ, mở rộng độc lập | JOIN liên DB khó khăn |
| Phân bảng ngang | Cùng một bảng chia thành nhiều bảng theo quy tắc | Lượng dữ liệu một bảng kiểm soát được | Lựa chọn shard key rất quan trọng |
| Phân bảng dọc | Tách các trường lớn sang bảng độc lập | Giảm IO, nâng cao hiệu suất truy vấn | Cần JOIN thêm |

**Nguyên tắc chọn shard key**:
- Chọn trường được query thường xuyên nhất (ví dụ user_id)
- Phân bố dữ liệu phải đồng đều, tránh điểm nóng
- Cố gắng để dữ liệu cùng một người dùng ở cùng một shard (giảm truy vấn xuyên shard)

### 3.3 Message Queue

Message queue là "bộ giảm xóc" của hệ thống phân tán, vai trò cốt lõi là tách biệt, bất đồng bộ, cắt đỉnh lấp vực.

| Kịch bản | Không dùng queue | Dùng queue |
|------|---------|--------|
| Gửi thông báo sau khi đặt hàng | API đặt hàng gọi đồng bộ service thông báo, thông báo lỗi dẫn đến đặt hàng lỗi | Đặt hàng thành công thì gửi message, service thông báo tiêu thụ bất đồng bộ |
| Flash sale | Lưu lượng tức thời đánh sập DB | Yêu cầu vào queue trước, backend tiêu thụ theo năng lực |
| Đồng bộ dữ liệu | Service A gọi trực tiếp API của Service B | Service A phát sự kiện, Service B subscribe xử lý |

---

## 4. Tư duy đánh đổi: Không có viên đạn bạc

Bản chất của thiết kế kiến trúc là đánh đổi (Trade-off). Mỗi quyết định đều có cái giá, điều quan trọng là hiểu cái giá đó và đưa ra lựa chọn phù hợp với giai đoạn hiện tại.

| Chiều đánh đổi | Lựa chọn A | Lựa chọn B | Cơ sở quyết định |
|---------|--------|--------|---------|
| Nhất quán vs Khả dụng | Nhất quán mạnh (CP) | Khả dụng cao (AP) | Nghiệp vụ có chấp nhận không nhất quán tạm thời không? |
| Hiệu suất vs Chi phí | Cache toàn bộ | Cache theo nhu cầu | Lượng dữ liệu và ngân sách |
| Đơn giản vs Linh hoạt | Kiến trúc monolith | Microservices | Quy mô đội nhóm và độ phức tạp nghiệp vụ |
| Thời gian thực vs Batch | Xử lý stream | Xử lý batch | Yêu cầu tính thời sự của dữ liệu |
| Tự xây vs Quản lý hộ | Tự dựng MySQL | Dùng cloud database RDS | Năng lực vận hành và chi phí |

::: tip Architecture Decision Record (ADR)
Mỗi quyết định kiến trúc quan trọng đều nên được ghi lại: **Bối cảnh là gì, đã cân nhắc những phương án nào, tại sao chọn cái này, có cái giá gì**. Đây không phải để đổ lỗi, mà để những người đến sau hiểu "tại sao thời điểm đó lại thiết kế như vậy".

Format rất đơn giản:
- **Tiêu đề**: Dùng XXX thay cho YYY
- **Bối cảnh**: Chúng ta gặp vấn đề gì
- **Quyết định**: Chúng ta chọn phương án nào
- **Lý do**: Tại sao chọn phương án này
- **Cái giá**: Nhược điểm và rủi ro của quyết định này
:::

### Các đánh đổi sai lầm phổ biến

| Sai lầm | Biểu hiện | Cách làm đúng |
|------|------|---------|
| Tối ưu quá sớm | DAU 1000 đã áp dụng phân DB/phân bảng | Dùng DB đơn trước, gặp giới hạn mới tách |
| Bị công nghệ dẫn dắt | "Tôi muốn dùng Kafka" thay vì "Tôi cần bất đồng bộ" | Xuất phát từ vấn đề, không xuất phát từ công nghệ |
| Bỏ qua chi phí vận hành | Chọn phương án tối ưu nhưng team không bảo trì được | Phương án phải phù hợp với năng lực đội nhóm |
| Theo đuổi nhất quán hoàn hảo | Tất cả kịch bản đều dùng giao dịch phân tán | Hầu hết kịch bản nhất quán cuối cùng là đủ |

---

## 5. Kịch bản kinh điển

Thông qua ba kịch bản kinh điển, kết nối các phương pháp luận đã học ở trên.

### 5.1 Dịch vụ Short Link (TinyURL)

Dịch vụ short link là đề kinh điển trong phỏng vấn thiết kế hệ thống, tuy nhỏ nhưng đầy đủ các yếu tố.

**Làm rõ nhu cầu**:
- Chức năng cốt lõi: Long link → Short link (ghi), Short link → Redirect (đọc)
- Tỷ lệ đọc/ghi: Khoảng 100:1 (đọc nhiều hơn ghi rất nhiều)
- Redirect trung bình mỗi ngày: 100 triệu lần
- Short link không bao giờ hết hạn

**Ước tính dung lượng**:

| Chỉ số | Tính toán | Kết quả |
|------|------|------|
| Ghi QPS | 100 triệu / 100 / 86400 | ≈ 12 QPS |
| Đọc QPS | 100 triệu / 86400 | ≈ 1.200 QPS |
| Đọc QPS đỉnh | 1.200 x 3 | ≈ 3.600 QPS |
| Lưu trữ 5 năm | 1 triệu/ngày x 365 x 5 x 100B | ≈ 18 GB |
| Cache (20%) | 18 GB x 20% | ≈ 3.6 GB |

**Thiết kế kiến trúc**:

```
Đường ghi: Client → API Server → ID Generator → Base62 Encode → Ghi MySQL + Redis
Đường đọc: Client → CDN → API Server → Redis Query → 302 Redirect
                                    ↓ (cache miss)
                                  MySQL Query → Điền lại Redis
```

**Quyết định thiết kế quan trọng**:
- Tạo short code: Snowflake distributed ID + Base62 encode, tránh hash collision
- Chiến lược cache: Cache-Aside, short link nóng dùng CDN tăng tốc
- Cơ sở dữ liệu: Đơn bảng là đủ (18GB rất nhỏ), tạo index theo short code

### 5.2 Hệ thống Feed Stream

Feed stream của nền tảng xã hội (Moments, trang chủ Weibo) là một đề kinh điển khác.

**Thách thức cốt lõi**: Người dùng đăng một bài viết, làm sao để tất cả người theo dõi đều thấy?

| Phương án | Cách làm | Ưu điểm | Nhược điểm |
|------|------|------|------|
| Pull | Tổng hợp bài viết của người theo dõi theo thời gian thực khi đọc | Ghi đơn giản, ít lưu trữ | Đọc chậm, trễ cao khi theo dõi nhiều |
| Push | Ghi vào hộp thư đến của tất cả follower khi đăng | Đọc cực nhanh | Người nổi tiếng đăng bài gây lan truyền ghi nghiêm trọng |
| Push + Pull kết hợp | Người thường push, người nổi tiếng pull | Cân bằng hiệu suất đọc ghi | Triển khai phức tạp |

**Phương án Push + Pull kết hợp**:
- Số follower < 10.000: Khi đăng, push vào cache Feed của tất cả follower (mô hình push)
- Số follower > 10.000: Không push, follower đọc theo thời gian thực khi mở (mô hình pull)
- Khi người dùng mở Feed: Gộp nội dung đã push + nội dung pull theo thời gian thực từ người nổi tiếng, sắp xếp theo thời gian

### 5.3 Hệ thống Flash Sale

Thách thức cốt lõi của flash sale: đồng thời siêu cao trong tức thời + kho không được bán vượt.

**Đặc trưng lưu lượng**:
- Trước khi sự kiện bắt đầu: Lượng lớn người dùng refresh trang chờ đợi
- Khi sự kiện bắt đầu: QPS có thể gấp hơn 100 lần bình thường
- Sau khi sự kiện kết thúc: Lưu lượng nhanh chóng giảm

**Chiến lược cắt đỉnh phân tầng**:

```
Yêu cầu người dùng → CDN (trang tĩnh) → Gateway (giới hạn tốc độ) → Message Queue (cắt đỉnh) → Inventory Service (trừ kho)
```

| Tầng | Chiến lược | Hiệu quả |
|------|------|------|
| Frontend | Vô hiệu hóa nút + Trễ ngẫu nhiên + CAPTCHA | Lọc bot, phân tán yêu cầu |
| CDN | Cache tài nguyên tĩnh | Giảm 90% yêu cầu trang |
| Gateway | Token bucket rate limiting | Chỉ cho qua lưu lượng hệ thống chịu được |
| Message Queue | Yêu cầu vào queue, xử lý bất đồng bộ | Cắt đỉnh lấp vực, bảo vệ DB |
| Inventory Service | Pre-deduct Redis + Thao tác nguyên tử Lua | Ngăn bán vượt, phản hồi cấp millisecond |

::: tip Nguyên tắc cốt lõi của flash sale
1. **Chặn ở thượng lưu càng nhiều càng tốt**: Có thể chặn ở CDN thì không để đến tầng ứng dụng
2. **Tách đọc ghi**: Trang chi tiết sản phẩm đi qua cache, chỉ đặt hàng đi qua DB
3. **Xử lý bất đồng bộ**: Người dùng nhấp "mua nhanh" rồi ngay lập tức trả về "đang xếp hàng", backend xử lý bất đồng bộ
4. **Phương án dự phòng**: Rate limiting, circuit breaker, downgrade, bất kỳ tầng nào có vấn đề đều có Plan B
:::

---

## Tổng kết

Thiết kế hệ thống là một kỹ năng mang tính thực hành cao, cốt lõi nằm ở tư duy có cấu trúc và sự đánh đổi.

Ôn lại các điểm chính của chương này:

1. **Khung bốn bước**: Làm rõ nhu cầu → Ước tính dung lượng → Thiết kế kiến trúc → Đi sâu tối ưu, mỗi bước đều không thể bỏ qua
2. **Ước tính mặt sau phong bì**: Không cần chính xác, chỉ cần biết bậc lượng, dùng để hướng dẫn quyết định kiến trúc
3. **Mẫu cốt lõi**: Cache, phân DB/phân bảng, message queue, CDN, rate limiting/circuit breaker — đây là những "khối xây" của thiết kế hệ thống
4. **Tư duy đánh đổi**: Không có phương án hoàn hảo, chỉ có phương án phù hợp với giai đoạn hiện tại, ghi lại lý do và cái giá của mỗi quyết định
5. **Kịch bản kinh điển**: Dịch vụ short link luyện cơ bản, Feed stream luyện mô hình push/pull, Flash sale luyện đồng thời cao — nắm vững ba cái này có thể áp dụng linh hoạt

## Đọc thêm

- [System Design Interview](https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF) - Tác phẩm kinh điển về phỏng vấn thiết kế hệ thống của Alex Xu
- [Designing Data-Intensive Applications](https://dataintensive.net/) - Thiết kế ứng dụng dữ liệu chuyên sâu của Martin Kleppmann
- [The System Design Primer](https://github.com/donnemartin/system-design-primer) - Tài nguyên học thiết kế hệ thống đầy đủ nhất trên GitHub
- [ByteByteGo](https://bytebytego.com/) - Blog trực quan hóa thiết kế hệ thống của Alex Xu

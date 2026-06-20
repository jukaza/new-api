# Lưu trữ tệp và Lưu trữ đối tượng

::: tip Lời mở đầu
**Người dùng tải lên một ảnh đại diện, bạn lưu nó vào thư mục `/uploads` trên máy chủ — rồi ổ đĩa máy chủ đầy, hoặc bạn thêm máy chủ thứ hai, người dùng phát hiện ảnh đại diện lúc có lúc không.** Lưu trữ tệp tưởng chừng đơn giản, nhưng trong môi trường phân tán lại là một vấn đề kiến trúc cần được xem xét nghiêm túc. Lưu trữ đối tượng chính là câu trả lời tiêu chuẩn cho vấn đề này trong thời đại Internet.
:::

**Bài viết này sẽ dạy bạn điều gì?**

Sau khi học xong chương này, bạn sẽ có được:

- **Nhận thức về loại hình lưu trữ**: Hiểu sự khác biệt và tình huống áp dụng của lưu trữ khối, lưu trữ tệp và lưu trữ đối tượng
- **Khái niệm cốt lõi về lưu trữ đối tượng**: Nắm vững các khái niệm cốt lõi như Bucket, Object, Key, Pre-signed URL
- **Thiết kế giải pháp tải lên**: Học cách lựa chọn giữa tải lên trực tiếp từ client và tải lên qua máy chủ trung gian
- **Nguyên lý tăng tốc CDN**: Hiểu cách CDN tăng tốc phân phối tài nguyên tĩnh toàn cầu
- **Thực tiễn tốt nhất**: Nắm vững các kỹ thuật thực chiến như đặt tên tệp, kiểm soát quyền, quản lý vòng đời

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | So sánh các loại hình lưu trữ | Lưu trữ khối, lưu trữ tệp, lưu trữ đối tượng |
| **Chương 2** | Khái niệm cốt lõi về lưu trữ đối tượng | Bucket, Object, Key, metadata |
| **Chương 3** | Giải pháp tải tệp lên | Tải lên trực tiếp từ client, Pre-signed URL |
| **Chương 4** | Tăng tốc CDN | Node biên, chiến lược cache, truy xuất nguồn gốc |
| **Chương 5** | Thực tiễn tốt nhất | Quy ước đặt tên, quyền hạn, vòng đời |

---

## 0. Toàn cảnh: Tại sao không thể lưu tệp cục bộ trên máy chủ?

Khi mới bắt đầu làm dự án, việc lưu tệp người dùng tải lên vào thư mục cục bộ của máy chủ là cách làm trực quan nhất. Nhưng khi dự án phát triển, bạn sẽ gặp một loạt vấn đề:

- **Không gian ổ đĩa có hạn**: Ổ đĩa máy chủ sẽ đầy, việc mở rộng rất phiền phức
- **Nhiều máy chủ không chia sẻ**: Sau khi cân bằng tải, yêu cầu của người dùng có thể đến các máy chủ khác nhau, tệp không tìm thấy
- **Không có sao lưu**: Máy chủ hỏng, tệp mất luôn
- **Không có CDN**: Người dùng toàn cầu truy cập cùng một máy chủ, tốc độ chậm

::: tip Giá trị cốt lõi của lưu trữ đối tượng
Lưu trữ đối tượng (như AWS S3, Alibaba Cloud OSS) giải quyết tất cả những vấn đề này: **dung lượng không giới hạn, có thể truy cập toàn cầu, tự động sao lưu, hỗ trợ CDN tự nhiên**. Nó đã trở thành tiêu chuẩn thực tế cho việc lưu trữ tệp trong ứng dụng Internet.
:::

---

## 1. So sánh các loại hình lưu trữ: Khối, Tệp, Đối tượng

Trong thế giới máy tính có ba cách lưu trữ chính, chúng giải quyết các vấn đề ở các cấp độ khác nhau.

<FileStorageTypeDemo />

| Khía cạnh | Lưu trữ khối | Lưu trữ tệp | Lưu trữ đối tượng |
|------|--------|---------|---------|
| Đơn vị dữ liệu | Khối có kích thước cố định | Tệp + thư mục | Đối tượng (Key-Value) |
| Giao thức truy cập | iSCSI/FC | NFS/SMB | HTTP REST API |
| Hiệu năng | Cao nhất (mili giây) | Trung bình | Thấp hơn (nhưng đủ dùng) |
| Khả năng mở rộng | Hạn chế | Trung bình | Gần như không giới hạn |
| Chi phí | Cao nhất | Trung bình | Thấp nhất |
| Tình huống điển hình | Cơ sở dữ liệu | Tệp chia sẻ | Ảnh/video/sao lưu |

::: tip Ghi nhớ đơn giản
- **Lưu trữ khối** giống ổ cứng — dùng cho cơ sở dữ liệu
- **Lưu trữ tệp** giống thư mục chia sẻ mạng — dùng để chia sẻ cấu hình giữa nhiều máy chủ
- **Lưu trữ đối tượng** giống ổ đĩa mạng — dùng cho ảnh, video người dùng tải lên
:::

---

## 2. Khái niệm cốt lõi về lưu trữ đối tượng

Mô hình dữ liệu của lưu trữ đối tượng rất đơn giản: **Bucket (thùng chứa)** là container, **Object (đối tượng)** là tệp, mỗi đối tượng được xác định bằng một **Key (khóa)** duy nhất.

```
my-app-bucket/                    ← Bucket (thùng chứa)
├── avatars/user-123.jpg          ← Object Key
├── avatars/user-456.png          ← Object Key
├── reports/2024/q1-report.pdf    ← Object Key ("thư mục" chỉ là tiền tố của Key)
└── uploads/temp/file.zip         ← Object Key
```

| Khái niệm | Mô tả | Ví dụ |
|------|------|------|
| Bucket | Container lưu trữ, tên duy nhất toàn cục | `my-app-prod`, `company-assets` |
| Object | Tệp được lưu trữ + metadata | Một bức ảnh, một tệp PDF |
| Key | Định danh duy nhất của đối tượng | `avatars/user-123.jpg` |
| Metadata | Thông tin bổ sung của đối tượng | Content-Type, nhãn tùy chỉnh |
| ACL | Danh sách kiểm soát truy cập | public-read, private |
| Pre-signed URL | Liên kết ủy quyền truy cập tạm thời | Liên kết tải lên/tải xuống có hiệu lực 15 phút |

::: tip Lưu trữ đối tượng không có "thư mục" thực sự
`avatars/user-123.jpg` trong đó `avatars/` không phải là thư mục, chỉ là tiền tố của Key. Lưu trữ đối tượng có cấu trúc phẳng, tất cả đối tượng ở cùng một cấp. "Thư mục" hiển thị trên bảng điều khiển chỉ là hiệu ứng trực quan khi nhóm theo tiền tố.
:::

---

## 3. Giải pháp tải tệp lên: Ai tải tệp?

Có hai giải pháp tải tệp lên chính: tải qua máy chủ trung gian và tải trực tiếp từ client. Đối với hầu hết tình huống, **tải trực tiếp từ client** là lựa chọn tốt hơn.

<FileUploadFlowDemo />

::: tip Ưu điểm của tải trực tiếp từ client
1. **Tiết kiệm băng thông máy chủ**: Tệp không đi qua máy chủ của bạn, trực tiếp đến OSS
2. **Tránh timeout**: Tệp lớn sẽ không kích hoạt giới hạn timeout của Nginx/gateway
3. **Giảm tải máy chủ**: Máy chủ chỉ cần cấp chứng chỉ, không cần xử lý luồng tệp
4. **Hỗ trợ tải lên tiếp tục**: OSS hỗ trợ tải lên phân mảnh tự nhiên, frontend có thể triển khai tải lên tiếp tục

Các bước triển khai: Frontend yêu cầu backend lấy Pre-signed URL → Frontend dùng URL này tải trực tiếp lên OSS → OSS callback thông báo cho backend
:::

---

## 4. Tăng tốc CDN: Làm cho người dùng toàn cầu đều nhanh

Khi người dùng của bạn phân bố toàn cầu, việc tải tệp từ một máy chủ nguồn duy nhất sẽ rất chậm. CDN (Content Delivery Network) bằng cách triển khai các node biên trên toàn cầu, lưu tệp vào bộ nhớ đệm ở node gần người dùng nhất, giảm đáng kể độ trễ truy cập.

<CDNAccelerationDemo />

| Khái niệm CDN | Mô tả |
|---------|------|
| Node biên | Máy chủ cache phân bố trên toàn cầu |
| Truy xuất nguồn gốc | Khi node biên không có cache, yêu cầu tệp từ máy chủ nguồn |
| Tỷ lệ cache hit | Tỷ lệ yêu cầu được node biên phản hồi trực tiếp, càng cao càng tốt |
| TTL | Thời gian hiệu lực của cache, hết hạn cần truy xuất nguồn gốc lại |
| Làm mới cache | Chủ động xóa cache của node biên, để tệp mới có hiệu lực |

::: tip Thực tiễn tốt nhất với CDN
- **Tên tệp thêm hash**: `logo.a3f2b1.png` thay vì `logo.png`, như vậy khi cập nhật tệp không cần làm mới cache
- **Đặt TTL hợp lý**: Tài nguyên tĩnh (JS/CSS/ảnh) đặt TTL dài (1 năm), HTML đặt TTL ngắn (5 phút)
- **Bật nén Gzip/Brotli**: Tài nguyên dạng văn bản sau khi nén giảm 60-80% dung lượng
:::

---

## 5. Thực tiễn tốt nhất

| Thực tiễn | Mô tả | Ví dụ |
|------|------|------|
| Quy ước đặt tên Key | Dùng tiền tố có ý nghĩa để tổ chức tệp | `{type}/{date}/{uuid}.{ext}` |
| Tránh Key hotspot | Không dùng số tăng dần ở đầu | Dùng UUID hoặc tiền tố hash |
| Quyền tối thiểu | Bucket mặc định private | Chỉ đặt public-read cho tệp cần công khai |
| Quy tắc vòng đời | Tự động dọn dẹp tệp hết hạn | Tệp tạm thời tự động xóa sau 7 ngày |
| Cấu hình CORS | Frontend tải trực tiếp cần cấu hình CORS | Cho phép PUT/POST từ tên miền của bạn |
| Mã hóa phía máy chủ | Tệp nhạy cảm bật SSE | SSE-S3 hoặc SSE-KMS |

---

## Tổng kết

Lưu trữ tệp là vấn đề cơ bản mà mọi ứng dụng Web đều gặp phải. Lưu trữ đối tượng với đặc tính dung lượng không giới hạn, chi phí thấp, độ sẵn sàng cao, đã trở thành lựa chọn tiêu chuẩn cho ứng dụng Internet.

Ôn lại các điểm chính của chương này:

1. **Ba loại hình lưu trữ**: Lưu trữ khối cho cơ sở dữ liệu, lưu trữ tệp cho chia sẻ, lưu trữ đối tượng cho tệp người dùng
2. **Mô hình lưu trữ đối tượng**: Bucket + Key + Object, cấu trúc phẳng, truy cập qua HTTP API
3. **Tải trực tiếp từ client**: Giải pháp Pre-signed URL, tệp không qua máy chủ, hiệu quả và tiết kiệm tài nguyên
4. **Tăng tốc CDN**: Cache node biên + hash tên tệp, làm cho người dùng toàn cầu đều nhanh
5. **Bảo mật và quản lý**: Quyền tối thiểu, quy tắc vòng đời, mã hóa phía máy chủ

## Đọc thêm

- [AWS S3 Developer Guide](https://docs.aws.amazon.com/s3/) - Tài liệu tiêu chuẩn về lưu trữ đối tượng
- [Alibaba Cloud OSS Best Practices](https://help.aliyun.com/document_detail/31853.html) - Lưu trữ đối tượng phổ biến nhất trong nước
- [MinIO Documentation](https://min.io/docs/minio/linux/index.html) - Lưu trữ đối tượng tương thích S3 mã nguồn mở
- [Cloudflare R2](https://developers.cloudflare.com/r2/) - Lưu trữ đối tượng không phí xuất dữ liệu
- [Pre-signed URL chi tiết](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html) - Cơ chế cốt lõi của tải trực tiếp từ client
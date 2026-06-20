# Mã hóa và Truyền tải Dữ liệu là gì?

::: tip Lời nói đầu
Khi bạn gửi một bức ảnh cho bạn bè, gửi tin nhắn Zalo, hoặc tải một game vài GB, những thông tin này đi qua nửa trái đất và xuất hiện nguyên vẹn trên màn hình của bạn như thế nào? Chương này tập trung vào một câu hỏi thường làm bối rối người mới: **Tại sao tệp bạn nhận lại bị lỗi mã (hiển thị ký tự lạ)?** Từ câu hỏi này, chúng ta sẽ khám phá ba trọng tâm cơ bản nhất của máy tính: **mã hóa, lưu trữ và truyền tải**.
:::

**Bài viết này sẽ giúp bạn học gì?**

Sau khi học xong chương này, bạn sẽ có được:

- **Khả năng phân tích lỗi mã**: khi gặp "tệp mở ra là ký tự lạ", có thể phân tích nguyên nhân từ góc độ mã hóa.
- **Ý thức đa nền tảng**: biết tại sao cần chú ý đến định dạng mã hóa và thứ tự byte khi trao đổi dữ liệu.
- **Thế giới quan mã hóa**: hiểu máy tính biểu diễn mọi thứ bằng 0 và 1 như thế nào.
- **Nền tảng cho việc học sâu hơn về sau**.

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Mã hóa ký tự | ASCII, UTF-8, GBK |
| **Chương 2** | Lưu trữ dữ liệu | Nhị phân, thứ tự byte |
| **Chương 3** | Truyền tải dữ liệu | Serialize, nén |

---

## 0. Mở đầu: Tại sao tệp lại thành "văn tự cổ"?

Tưởng tượng bạn nhận được một tệp quan trọng từ đồng nghiệp, mở ra thấy toàn ký tự lạ như "浣犲ソ" hoặc "ä½ å¥½".

Sự thật là: phần lớn "tệp hỏng" chỉ có một nguyên nhân -- **máy tính "không tìm đúng từ điển"**.

<GarbledTextDemo />

**Kiến thức cốt lõi: Từ điển không khớp**

Byte (chuỗi 0 và 1) không có ý nghĩa tuyệt đối, là **quy tắc mã hóa** do con người tạo ra mới cho chúng ý nghĩa.

Người gửi dùng từ điển UTF-8 để dịch hành vi thành số, bạn nếu dùng từ điển cũ để đọc những số này, kết quả tất nhiên là mã lạ.

---

## 1. Mã hóa dữ liệu là gì? (Biến mọi thứ thành số)

**Mã hóa dữ liệu (Encoding)** là tạo một "từ điển hai chiều", ánh xạ thông tin thế giới thực (văn bản, màu sắc, âm thanh) thành 0 và 1.

### 1.1 Từ văn bản thành số: Từ ASCII đến Unicode

**Giai đoạn 1**: ASCII -- chỉ 128 ký tự, đủ cho tiếng Anh.

**Giai đoạn 2**: Thời kỳ phân tán -- mỗi quốc gia làm từ điển riêng, gây hỗn loạn.

**Giai đoạn 3**: Unicode thống nhất -- cấp số duy nhất cho mọi ký tự trên thế giới. UTF-8 là quy tắc lưu trữ phổ biến nhất: tiếng Anh 1 byte, tiếng Việt/tiếng Trung có thể từ 2-3 byte.

<CharacterEncodingExplorer />

### 1.2 Màu và âm thanh thành số như thế nào?

* **Mã hóa hình ảnh**: Ảnh gồm hàng triệu pixel. Mỗi màu có mã số (như `#FF0000` là đỏ).
<ImageEncodingDemo />

* **Mã hóa âm thanh**: Âm thanh là sóng. Đo chiều cao sóng 44,100 lần/giây, ghi lại giá trị.
<AudioEncodingDemo />

---

## 2. Cầu nối lưu trữ: Trước khi gửi, phải đặt vào đâu đó

Sau khi mã hóa, trước khi gửi, phải lưu vào phương tiện vật lý. Có một luật sắt: **lưu trữ càng nhanh, giá càng đắt, dung lượng càng nhỏ.**

<StoragePyramidDemo />

Hệ điều hành như một quản lý kho thông minh: lưu phim/game ở ổ cứng chậm nhưng lớn, khi chạy thì chuyển sang RAM nhanh nhưng nhỏ, khi đóng thì dọn RAM cho tệp khác.

---

## 3. Truyền tải dữ liệu là gì? (Gửi 0 và 1 đi du lịch)

### 3.1 Truyền tải phần cứng và LAN

Trong thùng máy hoặc giữa các máy gần nhau, là **thách thức vật lý**. Ngày nay USB Type-C, PCIe dùng **truyền tải nối tiếp** (một kênh chính).

<DataTransmissionDemo />

### 3.2 WAN và Internet

Khi dữ liệu phải đi đến máy chủ ở nước khác, đi qua cáp quang biển, trạm định tuyến phân tán. Trước mắt là **thách thức sự phục hồi**.

1. **Cắt gói**: Mạng cắt video thành hàng nghìn gói dữ liệu (~1500 byte)
2. **Kiểm tra (Checksum)**: Tính mã kiểm tra trước khi gửi
3. **TCP gửi lại**: Nếu gói mất hoặc hỏng, yêu cầu gửi lại

Nhờ cơ chế **TCP** này, ngay cả WiFi không ổn định, tệp tải về luôn nguyên vẹn 100%.

---

## 4. Thực hành cuối: Từ chụp ảnh đến đăng mạng xã hội

<PhotoUploadJourneyDemo />

---

## 5. Bảng thuật ngữ

| Thuật ngữ | Giải thích |
| :--- | :--- |
| **Bit (b)** | Đơn vị nhỏ nhất, chỉ có thể là 0 hoặc 1 |
| **Byte (B)** | 8 Bit gộp lại. Đơn vị cơ bản đo kích thước tệp |
| **Character Set** | "Mục lục từ điển", định nghĩa ký tự nào tồn tại |
| **Encoding** | "Quy tắc lưu trữ", xác định ký tự ứng với byte nào |
| **RAM** | Bộ nhớ làm việc nhanh nhưng mất điện sẽ xóa |
| **SSD** | Ổ cứng thể rắn, lưu trữ vĩnh viễn nhanh |
| **Serial / Parallel** | Nối tiếp = một kênh xếp hàng; Song song = nhiều kênh cùng lúc |
| **Checksum** | Mã kiểm tra kèm theo dữ liệu truyền |
| **TCP** | Giao thức điều khiển truyền, đảm bảo giao hàng 100% nguyên vẹn |

---

## Tóm tắt

- **Tại sao cùng tệp nhận bị mã lạ?** Dữ liệu không hỏng, chỉ là phần mềm dùng sai từ điển (vấn đề mã hóa).
- **Tại sao dây Type-C mỏng hơn nhưng nhanh hơn?** Vì trước là nhiều xe ngựa chạy song song (song song), giờ là tàu cao tốc trên đường riêng (nối tiếp).
- **Tại sao game lớn tải lâu?** Vì cần chuyển hàng chục GB từ ổ cứng chậm sang RAM nhanh.

Bản chất máy tính rất đơn giản: **chuyển đổi** (mã hóa), **lưu trữ** (giữ), và **gửi đi** (truyền tải) mọi thông tin thành xung điện.

# Hệ điều hành: Thuê một "Quản lý lớn" cho máy tính

::: tip Lời nói đầu
**Có CPU hoàn hảo và bộ nhớ vô hạn, máy tính có thể sử dụng ngay được không?**
Trong chương trước, chúng ta đã chứng kiến transistor kết hợp thành CPU mạnh mẽ như thế nào. Nhưng ngay cả khi bạn có phần cứng tốt nhất, nếu để chúng làm việc trực tiếp, chỉ để hiển thị một chữ cái trên màn hình cũng cần viết hàng trăm dòng lệnh máy tính khó hiểu. Không chỉ phức tạp, còn cực kỳ nguy hiểm -- chỉ cần một sai sót nhỏ, code của bạn có thể ghi đè dữ liệu của người khác.

Để giải quyết những cơn ác mộng này, **Hệ điều hành (Operating System, OS)** ra đời. Nó là lớp "phần mềm" vĩ đại nhất giữa bạn và phần cứng lạnh lẽo. Chương này sẽ bỏ qua code sâu, dùng ví dụ đơn giản để xem "sếp quản lý" này thu phục phần cứng hỗn loạn như thế nào.
:::

**Bài viết này sẽ giúp bạn học gì?**

Sau khi học xong chương này, bạn sẽ có được:

- **Khả năng phân tích vấn đề**: khi gặp "chương trình bị treo" hoặc "không đủ bộ nhớ", có thể phân tích nguyên nhân từ góc độ hệ điều hành.
- **Hiểu sâu về thuật ngữ**: hiểu "đa tiến trình", "bộ nhớ ảo", "quyền tệp" giải quyết vấn đề gì.
- **Tư duy hệ thống**: hiểu chương trình không chạy độc lập mà tương tác chặt chẽ với hệ điều hành, tiến trình khác và tài nguyên phần cứng.
- **Nền tảng cho việc học sâu**: đặt nền tảng cho lập trình song song, điều chỉnh hệ thống, công nghệ container.

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Quản lý tiến trình | Đa hóa thời gian CPU, vòng quay thời gian |
| **Chương 2** | Quản lý bộ nhớ | Bộ nhớ ảo, cơ chế phân trang |
| **Chương 3** | Hệ thống tệp | Tổ chức tệp, cấu trúc thư mục |

---

## 0. Toàn cảnh: Sẽ như thế nào nếu không có hệ điều hành?

Tưởng tượng bạn mở một "nhà máy tính toán" tiềm năng vượt trội (máy tính của bạn), với một nhân viên xuất sắc không bao giờ mệt mỏi (CPU), một kho lớn (bộ nhớ) và vô số container (ổ cứng).

Nếu bạn **không thuê** một giám đốc (hệ điều hành):
1. **Khủng hoảng độc quyền CPU**: CPU chỉ làm được một việc lúc một. Nếu có ai đang dùng nghe nhạc, tất cả những người muốn duyệt web? Xin lỗi, phải đợi.
2. **Tai nạn giẫm đạp bộ nhớ**: Chat và Game đều sử dụng kho (bộ nhớ). Không có bảo vệ, game có thể đè dữ liệu trang bị vào hộp của ứng dụng Chat, gây crash ngay lập tức.
3. **Mê cung ổ cứng**: Phần cứng ổ cứng chỉ là đĩa ghi đầy 0 và 1. Để tìm ảnh hôm qua, bạn phải nhớ chính xác "mặt 1, rãnh 56, sector 8" -- không ai nhớ được tọa độ phi nhân loại như vậy.

<OSArchitectureDemo />

Để giải quyết ba cơn ác mộng trên, hệ điều hành đưa ra ba vũ khí chính: **quản lý tiến trình**, **quản lý bộ nhớ** và **hệ thống tệp**.

---

## 1. Quản lý tiến trình: Đa hóa thời gian của CPU

Bạn thường dùng máy tính với ứng dụng Chat mở, nghe nhạc, và gõ chữ. Nhưng nếu máy chỉ có một nhân CPU, làm sao nó làm ba việc này cùng lúc?

Đáp án: **Nó không làm cùng lúc. Mà hệ điều hành đang "quản lý thời gian" điên cuồng.**

<ProcessDemo />

### 1.1 "Tiến trình" là gì?
Mỗi chương trình đang chạy được gọi là một **tiến trình**. Bạn có thể hiểu như một "nhóm dự án", với code riêng (danh sách công việc), dữ liệu bộ nhớ riêng (vốn dự án), đợi gặp CPU.

### 1.2 Vòng quay thời gian
Để không để phần mềm độc quyền CPU, hệ điều hành cắt thời gian CPU thành mảnh rất nhỏ (khoảng 10 ms), phân phối luân phiên cho các tiến trình. Vì chuyển đổi quá nhanh, bạn cảm thấy "chạy cùng lúc".

---

## 2. Quản lý bộ nhớ: Không gian địa chỉ ảo

Giải quyết vấn đề chia CPU, tiếp theo là không gian bộ nhớ. Không có quản lý, tất cả phần mềm ghi trực tiếp vào bộ nhớ vật lý, sẽ xảy ra **giẫm đạp lẫn nhau**.

<MemoryDemo />

### 2.1 Bộ nhớ ảo (Virtual Memory)
Hệ điều hành nói dối với mỗi tiến trình: "Này, bạn độc quyền toàn bộ bộ nhớ khả dụng của toàn máy, dùng thoải mái!"

Trong mắt tiến trình, bộ nhớ của mình luôn **liên tục** và **sạch sẽ**. Nó yên tâm ghi dữ liệu vào đó.

### 2.2 Bảng trang (Page Table)
Thực tế? Hệ điều hành lén lút nhét dữ liệu vào **bộ nhớ vật lý thực** trong các khe hổng lẻ tẻ. Điều này có hai lợi ích tuyệt vời:
1. **An toàn tuyệt đối**: Ứng dụng Chat chỉ thấy không gian của mình, không thể sửa dữ liệu của người khác.
2. **Tiếp thu mạnh**: dù bộ nhớ vật lý có rối rắm, không gian ảo cho tiến trình vẫn ngay ngắn.

---

## 3. Hệ thống tệp: Tổ chức lưu trữ lâu dài

Nếu bạn mua một ổ cứng mới, nó chỉ là vùng lưu trống hoang tàn. Nếu bạn muốn lưu một bức ảnh, ổ cứng chỉ hỏi: "Cho tôi biết bạn muốn lưu ở byte thứ mấy?"

<FilesystemDemo />

### 3.1 Hệ thống tệp làm gì?
1. **Cắt ổ cứng**: Chia ổ cứng thành vô số **khối** có kích thước cố định (thường là 4KB).
2. **Tạo sổ kế toán**: Ghi khối nào đầy, khối nào trống.
3. **Dịch đường dẫn**: Chuyển `D:/Anh/ThuCung.jpg` thành "khối 3, 7, 11".

Vì vậy đổi tên tệp hoàn thành ngay lập tức (chỉ đổi tên trong sổ), còn sao chép tệp mất lâu (phải đọc ghi khối dữ liệu thực).

---

## 4. Phối hợp của ba: Quá trình khởi động chương trình hoàn chỉnh

Chúng ta đã hiểu ba module chính của hệ điều hành. Hãy xem chúng phối hợp như thế nào khi bạn **nhấn đúp để mở một chương trình**:

<ProgramLaunchDemo />

Dù bạn nhấn icon trên màn hình hay viết `print("Hello World")` trong code, đều phụ thuộc vào thao tác phức tạp này. Vì chúng ta có thể lướt web dễ dàng trong thế giới số là nhờ hệ điều hành làm việc khó thấy dưới đáy.

---

## Đọc thêm

Nếu bạn thấy các "kỹ thuật quản lý và lừa dối" của hệ điều hành rất thú vị, bạn có thể tìm hiểu các chủ đề nâng cao:
- **Tiến trình và tiểu trình (Thread)**: Nếu tiến trình là nhóm dự án, thì "tiểu trình" là nhân viên làm việc trong nhóm.
- **Song song và khóa**: Khi hai tiến trình cùng tranh tài nguyên, cách ngăn deadlock.
- **Lời gọi hệ thống (System Call)**: "Cửa sổ dịch vụ" hệ điều hành cung cấp cho ứng dụng.

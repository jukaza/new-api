# Viết tài liệu kỹ thuật

::: tip Lời nói đầu
**Tài liệu bạn viết có ai đọc không?** Nhiều developer nghĩ "code chạy được là xong, tài liệu để sau". Kết quả là: nhân viên mới không hiểu dự án, đối接 API hoàn toàn dựa vào trao đổi miệng, nửa năm sau chính mình cũng quên tại sao thiết kế như vậy.

Chương này giúp bạn nắm vững phương pháp cốt lõi của viết tài liệu kỹ thuật, để tài liệu của bạn thực sự được đọc, hiểu và sử dụng được.
:::

**Bài viết này sẽ giúp bạn học được gì?**

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Loại và cấu trúc tài liệu | Cách viết các loại tài liệu khác nhau |
| **Chương 2** | Nguyên tắc viết | Rõ ràng, chính xác, súc tích |
| **Chương 3** | So sánh thực tế | Tài liệu tốt vs tài liệu kém |
| **Chương 4** | Bảo trì tài liệu | Giữ tài liệu luôn cập nhật |

Sau khi học xong chương này, bạn sẽ viết được tài liệu kỹ thuật có cấu trúc rõ ràng, nội dung chính xác và dễ bảo trì.

---

## 0. Tổng quan: Tại sao tài liệu kỹ thuật quan trọng?

Code nói với máy tính "làm như thế nào", tài liệu nói với con người "tại sao làm như vậy". Dự án không có tài liệu giống như thiết bị điện không có hướng dẫn sử dụng — dùng được, nhưng toàn phải đoán.

::: tip Giá trị của tài liệu tốt
- **Giảm chi phí giao tiếp**: Người mới tự học, giảm trả lời lặp lại
- **Lưu giữ bối cảnh quyết định**: Ghi lại "tại sao", không chỉ "là gì"
- **Tăng uy tín dự án**: Tài liệu tốt là bộ mặt của dự án mã nguồn mở
- **Tăng tốc hợp tác**: Tài liệu API giúp frontend và backend phát triển song song
:::

---

## 1. Loại và cấu trúc tài liệu

Thông qua component tương tác dưới đây, tìm hiểu cấu trúc chuẩn của các loại tài liệu khác nhau:

<DocStructureDemo />

### 1.1 Các loại tài liệu phổ biến

| Loại tài liệu | Đối tượng đọc | Nội dung cốt lõi |
|---------|---------|---------|
| **README** | Mọi người | Dự án là gì, dùng thế nào, đóng góp ra sao |
| **Tài liệu API** | Người gọi API | Endpoint, tham số, response, mã lỗi |
| **Tài liệu kiến trúc** | Đội phát triển | Thiết kế hệ thống, lựa chọn công nghệ, luồng dữ liệu |
| **Nhật ký thay đổi** | Người dùng/Developer | Thay đổi theo phiên bản, mới/sửa/thay đổi gây ảnh hưởng |
| **Hướng dẫn đóng góp** | Contributor | Môi trường phát triển, quy ước code, quy trình PR |

### 1.2 Cấu trúc vàng của README

Một README tốt nên bao gồm:

1. **Tên dự án + mô tả 1 câu**: Trong 3 giây biết đây là gì
2. **Khởi động nhanh**: Ít bước nhất để chạy được
3. **Tính năng nổi bật**: Điểm bán hàng cốt lõi
4. **Cách cài đặt**: Yêu cầu môi trường chi tiết và các bước cài đặt
5. **Ví dụ sử dụng**: Code có thể copy-paste
6. **Hướng dẫn đóng góp**: Cách tham gia
7. **Giấy phép**: Thông tin pháp lý

---

## 2. Nguyên tắc viết

### 2.1 Rõ ràng là ưu tiên

```markdown
<!-- Tệ: mơ hồ không rõ -->
Hàm này xử lý dữ liệu.

<!-- Tốt: cụ thể rõ ràng -->
Chuyển đổi dữ liệu đơn hàng gốc sang định dạng hóa đơn, bao gồm tính thuế và quy đổi tiền tệ.
```

### 2.2 Hướng tới người đọc

Trước khi viết tài liệu, hãy hỏi: **Ai sẽ đọc tài liệu này? Họ cần thông tin gì?**

- Viết cho người mới: Giải thích thuật ngữ, cung cấp ví dụ đầy đủ
- Viết cho developer có kinh nghiệm: Đi thẳng vào vấn đề, cung cấp tham chiếu API
- Viết cho người phi kỹ thuật: Dùng phép so sánh, tránh thuật ngữ

### 2.3 Ví dụ code là tài liệu tốt nhất

```markdown
<!-- Tệ: chỉ mô tả bằng chữ -->
Gọi hàm createUser, truyền vào tham số tên người dùng và email.

<!-- Tốt: cung cấp ví dụ có thể chạy -->
const user = await createUser({
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com'
})
// Trả về: { id: 'u_123', name: 'Nguyễn Văn A', createdAt: '2025-01-15' }
```

---

## 3. So sánh thực tế

Thông qua component tương tác dưới đây, so sánh viết tài liệu kỹ thuật tốt và kém:

<TechWritingPracticeDemo />

### 3.1 Quy ước Commit Message

```
# Tệ
fix bug
update code

# Tốt (Conventional Commits)
fix: sửa lỗi trang đăng nhập bị trắng trên Safari
feat: hỗ trợ xuất hàng loạt báo cáo định dạng PDF
docs: cập nhật code mẫu trong phần xác thực API
```

### 3.2 Nghệ thuật comment

```javascript
// Tệ: mô tả "cái gì" (code đã nói rồi)
// Duyệt qua mảng
for (const item of items) { ... }

// Tốt: giải thích "tại sao"
// Duyệt ngược, vì khi xóa phần tử nếu duyệt xuôi sẽ bỏ qua phần tử tiếp theo
for (let i = items.length - 1; i >= 0; i--) { ... }
```

---

## 4. Bảo trì tài liệu

### 4.1 Tài liệu như code

Đặt tài liệu và code trong cùng một repo, quản lý bằng cùng một workflow:

- Thay đổi tài liệu gửi PR cùng với code
- CI kiểm tra định dạng tài liệu và tính hợp lệ của link
- Cập nhật tài liệu đồng bộ khi release phiên bản mới

### 4.2 Tránh tài liệu "thối"

| Vấn đề | Giải pháp |
|------|---------|
| Tài liệu lỗi thời | Cùng với thay đổi code, bắt buộc cập nhật tài liệu (kiểm tra PR) |
| Không ai bảo trì | Chỉ định người phụ trách tài liệu |
| Nội dung trùng lặp | Nguồn thông tin duy nhất, nơi khác dùng link dẫn |

---

## 5. Hỗ trợ AI: Nâng cao chất lượng tài liệu với mô hình ngôn ngữ lớn

Mô hình ngôn ngữ lớn gần như "có thiên bẩm" trong lĩnh vực viết tài liệu kỹ thuật — tạo tài liệu, cải thiện diễn đạt, dịch nội dung đều là thế mạnh.

### 5.1 Tạo tài liệu API

> **Prompt**:
> ```
> Từ code route Express sau, tạo tài liệu API hoàn chỉnh, bao gồm:
> - Đường dẫn endpoint và phương thức HTTP
> - Tham số request (path param, query param, request body) và kiểu dữ liệu
> - Ví dụ response thành công và lỗi
> - Ví dụ gọi bằng curl
>
> [Dán code route của bạn]
> ```

### 5.2 Cải thiện viết tài liệu kỹ thuật

> **Prompt**:
> ```
> Vui lòng cải thiện diễn đạt của tài liệu kỹ thuật sau, yêu cầu:
> 1. Ngôn ngữ súc tích rõ ràng, loại bỏ biểu đạt dư thừa
> 2. Dùng chủ động thay cho bị động
> 3. Thuật ngữ chuyên ngành giữ chính xác
> 4. Thêm ví dụ code khi cần thiết
> Giữ nguyên ý nghĩa, chỉ cải thiện chất lượng diễn đạt.
>
> [Dán nội dung tài liệu của bạn]
> ```

### 5.3 Tạo README

> **Prompt**:
> ```
> Từ thông tin dự án sau, tạo README.md chất lượng cao:
> - Tên dự án: [tên]
> - Mô tả 1 câu: [mô tả]
> - Tech stack: [liệt kê]
> - Tính năng cốt lõi: [liệt kê]
>
> Yêu cầu bao gồm: Giới thiệu dự án, khởi động nhanh, tính năng nổi bật,
> bước cài đặt (kèm code), ví dụ sử dụng, hướng dẫn đóng góp, giấy phép.
> ```

::: tip Lời khuyên sử dụng AI
Tài liệu AI tạo ra cần kiểm tra chi tiết kỹ thuật có chính xác không — nó có thể bịa ra tham số API không tồn tại hoặc giá trị trả về sai. Luôn đối chiếu với code thực tế.
:::

---

## 6. Tổng kết

1. **Loại phù hợp**: Tài liệu khác nhau có cấu trúc và cách viết khác nhau
2. **Rõ ràng ưu tiên**: Cụ thể, chính xác, hướng tới người đọc
3. **Ví dụ dẫn dắt**: Ví dụ code tốt hơn vạn lời nói
4. **Bảo trì liên tục**: Tài liệu như code, cùng tiến hóa với dự án

::: tip Suy ngẫm cuối cùng
Viết tài liệu không phải lãng phí thời gian, mà là **tiết kiệm thời gian trong tương lai**. 30 phút bạn bỏ ra hôm nay có thể giúp 10 người mỗi người tiết kiệm 1 giờ. Tài liệu tốt là khoản đầu tư tốt nhất cho nhóm.
:::

---

## Đọc thêm

- **Hướng dẫn viết**: Khóa học Technical Writing miễn phí của Google rất thực tế và hữu ích.
- **Công cụ tài liệu**: VitePress, Docusaurus, GitBook và các framework tài liệu hiện đại khác.
- **Tài liệu API**: Đặc tả OpenAPI/Swagger là tiêu chuẩn ngành cho tài liệu API.
- **Khuyến nghị thực tế**: Bắt đầu từ việc viết một README tốt cho dự án của bạn.

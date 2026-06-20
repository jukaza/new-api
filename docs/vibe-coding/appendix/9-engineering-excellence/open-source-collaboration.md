# Hợp tác mã nguồn mở

::: tip Lời nói đầu
**Muốn tham gia dự án mã nguồn mở nhưng không biết bắt đầu từ đâu?** Mã nguồn mở không chỉ là "dùng miễn phí code của người khác", mà còn là phương thức hợp tác và công cụ tăng tốc nghề nghiệp. Một đóng góp chất lượng cao cho dự án mã nguồn mở có thể thuyết phục hơn mười dự án cá nhân trên CV.

Chương này giúp bạn hiểu toàn bộ quy trình hợp tác mã nguồn mở, từ tìm dự án đến gửi PR, bước đầu tiên trong đóng góp mã nguồn mở.
:::

**Bài viết này sẽ giúp bạn học được gì?**

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Quy trình đóng góp | Chuỗi hoàn chỉnh từ Fork đến PR |
| **Chương 2** | Giấy phép mã nguồn mở | Sự khác biệt giữa các giấy phép |
| **Chương 3** | Nghệ thuật hợp tác | Cách trở thành contributor được chào đón |
| **Chương 4** | Bắt đầu từ con số 0 | Tìm dự án phù hợp cho người mới |

Sau khi học xong chương này, bạn sẽ nắm vững toàn bộ quy trình và nghệ thuật hợp tác mã nguồn mở, tự tin gửi đóng góp cho bất kỳ dự án mã nguồn mở nào.

---

## 0. Tổng quan: Giá trị của mã nguồn mở

Mã nguồn mở không chỉ là chia sẻ code, mà còn là **mô hình hợp tác toàn cầu**. Linux, React, Vue, Node.js — những dự án thay đổi thế giới đều là mã nguồn mở.

::: tip Lợi ích của việc tham gia mã nguồn mở
- **Phát triển kỹ thuật**: Đọc code xuất sắc, nhận review từ cao thủ
- **Phát triển nghề nghiệp**: Đóng góp open source là danh thiếp kỹ thuật tốt nhất
- **Thuộc về cộng đồng**: Trở thành thành viên của cộng đồng developer toàn cầu
- **Đóng góp lại hệ sinh thái**: Công cụ bạn dùng mỗi ngày cũng cần người bảo trì
:::

---

## 1. Quy trình đóng góp mã nguồn mở

Thông qua component tương tác dưới đây, tìm hiểu từng bước quy trình hoàn chỉnh từ Fork đến Merge:

<OpenSourceWorkflowDemo />

### 1.1 Tổng quan quy trình

```
Fork → Clone → Branch → Commit → Push → PR → Review → Merge
```

### 1.2 Chi tiết các bước quan trọng

**Tạo nhánh tính năng**: Không phát triển trực tiếp trên main.

```bash
git checkout -b fix/typo-in-readme
```

**Viết commit message rõ ràng**: Tuân thủ quy ước commit của dự án.

```bash
git commit -m "fix: sửa lỗi chính tả trong lệnh cài đặt của README"
```

**Tạo Pull Request**: Mô tả PR nên bao gồm:
- Sửa cái gì, tại sao sửa
- Số Issue liên quan (vd.: `Fixes #123`)
- Cách kiểm tra thay đổi của bạn

---

## 2. Giấy phép mã nguồn mở

Thông qua component tương tác dưới đây, so sánh sự khác biệt giữa các giấy phép mã nguồn mở phổ biến:

<LicenseComparisonDemo />

### 2.1 Các giấy phép phổ biến

| Giấy phép | Đặc điểm | Dự án tiêu biểu |
|-------|------|---------|
| **MIT** | Lỏng lẻo nhất, gần như không hạn chế | React, Vue, jQuery |
| **Apache 2.0** | Cần giữ thông báo bản quyền, có cấp phép sáng chế | Android, Kubernetes |
| **GPL** | Tác phẩm phái sinh phải cũng mở nguồn | Linux, WordPress |
| **BSD** | Tương tự MIT, hơi khác một chút | FreeBSD, Flask |

### 2.2 Chọn như thế nào?

- **Muốn nhiều người dùng hơn**: Chọn MIT
- **Muốn bảo vệ sáng chế**: Chọn Apache 2.0
- **Muốn đảm bảo sản phẩm phái sinh cũng mở nguồn**: Chọn GPL

---

## 3. Nghệ thuật hợp tác

### 3.1 Nghệ thuật khi mở Issue

```markdown
<!-- Tệ -->
Tiêu đề: Không dùng được
Nội dung: Đồ của các bạn có bug

<!-- Tốt -->
Tiêu đề: v2.1.0 trang đăng ký bị trắng trên Safari 17
Nội dung:
- Môi trường: macOS 14.2, Safari 17.2
- Các bước tái hiện: 1. Mở trang đăng nhập 2. Nhập tài khoản mật khẩu 3. Nhấn đăng nhập
- Hành vi kỳ vọng: Chuyển đến trang chủ
- Hành vi thực tế: Trang trắng, console báo lỗi TypeError: xxx
- Ảnh chụp màn hình: [đính kèm]
```

### 3.2 Nghệ thuật khi gửi PR

- Đọc `CONTRIBUTING.md` trước, hiểu quy ước đóng góp của dự án
- Một PR chỉ làm một việc, không trộn nhiều thay đổi
- Giữ PR nhỏ và tập trung, thuận tiện cho Review
- Kiên nhẫn chờ Review, lịch sự phản hồi góp ý

### 3.3 Review code của người khác

- Khen ngợi cái tốt trước, rồi mới đề xuất cải thiện
- Hỏi thay vì ra lệnh: "Ở đây đã cân nhắc dùng phương án X chưa?"
- Đưa ra lý do và phương án thay thế, không chỉ nói "không tốt"

---

## 4. Bắt đầu đóng góp từ con số 0

### 4.1 Các loại đóng góp phù hợp cho người mới

| Loại | Độ khó | Mô tả |
|------|------|------|
| Sửa lỗi tài liệu | Thấp | Lỗi chính tả, link cũ, giải thích không rõ |
| Dịch thuật | Thấp | Dịch tài liệu sang ngôn ngữ khác |
| Bổ sung test | Trung bình | Thêm test cho code chưa có coverage |
| Sửa bug đánh dấu `good first issue` | Trung bình | Vấn đề được maintainer đánh dấu thân thiện với người mới |
| Tính năng mới | Cao | Thảo luận phương án trong Issue trước, bắt tay vào làm sau khi được đồng ý |

### 4.2 Tìm dự án phù hợp

- Bắt đầu từ công cụ bạn sử dụng hàng ngày
- Tìm kiếm trên GitHub với nhãn `good first issue`
- Chú ý mức độ hoạt động của dự án (có ai bảo trì gần đây không)

---

## 5. Hỗ trợ AI: Tăng tốc đóng góp open source với mô hình ngôn ngữ lớn

Mô hình ngôn ngữ lớn có thể giúp bạn nhanh chóng hiểu codebase lạ, viết mô tả PR chất lượng cao, thậm chí hỗ trợ Code Review.

### 5.1 Nhanh chóng hiểu codebase lạ

> **Prompt**:
> ```
> Tôi vừa clone một dự án mã nguồn mở, vui lòng phân tích cấu trúc thư mục sau,
> giải thích trách nhiệm của từng thư mục/file, và kiến trúc tổng thể cùng luồng dữ liệu của code.
> Tôi muốn sửa một bug liên quan đến đăng nhập, nên bắt đầu từ đâu?
>
> [Dán kết quả lệnh tree hoặc cấu trúc thư mục]
> ```

### 5.2 Viết mô tả PR

> **Prompt**:
> ```
> Dựa vào git diff sau, giúp tôi viết mô tả Pull Request bao gồm:
> - Tiêu đề (ngắn gọn, nói rõ sửa gì)
> - Giải thích thay đổi (tại sao sửa, sửa cái gì)
> - Cách kiểm tra (cách xác nhận thay đổi đúng)
> - Issue liên quan (nếu có)
> Viết bằng tiếng Anh, giọng điệu chuyên nghiệp và thân thiện.
>
> [Dán kết quả git diff]
> ```

### 5.3 Hỗ trợ dịch tài liệu

> **Prompt**:
> ```
> Dịch tài liệu kỹ thuật tiếng Trung sau sang tiếng Anh, yêu cầu:
> 1. Thuật ngữ kỹ thuật dùng tiếng Anh chuẩn ngành
> 2. Không dịch comment code và tên biến
> 3. Giữ nguyên định dạng Markdown
> 4. Giọng điệu tự nhiên trôi chảy, không có cảm giác dịch máy
>
> [Dán tài liệu tiếng Trung]
> ```

::: tip Lời khuyên sử dụng AI
Khi dùng AI viết mô tả PR, hãy đảm bảo bạn hiểu từng dòng thay đổi. Reviewer có thể hỏi tại sao bạn sửa như vậy — nếu không trả lời được, nghĩa là bạn chưa thực sự hiểu.
:::

---

## 6. Tổng kết

1. **Quy trình**: Fork → Branch → Commit → PR → Review → Merge
2. **Giấy phép**: MIT lỏng lẻo nhất, GPL nghiêm ngặt nhất, chọn theo nhu cầu
3. **Nghệ thuật**: Issue rõ ràng, PR tập trung, giao tiếp lịch sự
4. **Khởi đầu**: Bắt đầu từ sửa tài liệu và issue có nhãn `good first issue`

::: tip Suy ngẫm cuối cùng
Bản chất của mã nguồn mở là **hợp tác**. Kỹ năng kỹ thuật quan trọng, nhưng khả năng giao tiếp và ý thức hợp tác cũng then chốt không kém. Một PR với thái độ thân thiện và mô tả rõ ràng được chào đón hơn một PR code hoàn hảo nhưng giao tiếp thô lỗ. **PR đầu tiên của bạn không cần hoàn hảo, chỉ cần bước ra bước đầu tiên.**
:::

---

## Đọc thêm

- **Hướng dẫn入门**: Open Source Guide của GitHub là tài nguyên入门 open source tốt nhất.
- **Khuyến nghị thực tế**: Tìm một dự án bạn thích, Star trước, đọc code, rồi tìm cơ hội đóng góp.
- **Tham gia cộng đồng**: Tham gia các sự kiện như Hacktoberfest để nhận hỗ trợ từ cộng đồng.
- **Góc nhìn maintainer**: Hiểu khối lượng công việc và áp lực của maintainer, làm một contributor chu đáo.

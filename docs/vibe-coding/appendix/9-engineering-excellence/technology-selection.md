# Phương pháp luận lựa chọn công nghệ

::: tip Lời nói đầu
**React hay Vue? MySQL hay PostgreSQL?** Lựa chọn công nghệ là một trong những quyết định quan trọng nhất khi bắt đầu dự án. Chọn sai, có thể mất hàng tháng viết lại; chọn đúng, hiệu suất nhóm tăng gấp đôi.

Chương này giúp bạn xây dựng tư duy lựa chọn công nghệ hệ thống, không còn chọn công nghệ theo cảm tính.
:::

**Bài viết này sẽ giúp bạn học được gì?**

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Radar công nghệ | Hiểu mức độ trưởng thành của công nghệ |
| **Chương 2** | Dimension đánh giá | Đánh giá công nghệ từ góc độ nào |
| **Chương 3** | Ma trận quyết định | So sánh định lượng để ra quyết định |
| **Chương 4** | Bẫy phổ biến | Tránh các sai lầm khi lựa chọn |

Sau khi học xong chương này, bạn sẽ nắm vững bộ phương pháp lựa chọn công nghệ hệ thống, có thể đưa ra quyết định công nghệ hợp lý cho dự án.

---

## 0. Tổng quan: Bản chất của lựa chọn công nghệ

Lựa chọn công nghệ không phải là câu hỏi "công nghệ nào tốt nhất", mà là "công nghệ nào phù hợp nhất với tình huống hiện tại". Giống như chọn phương tiện di chuyển — máy bay nhanh nhất, nhưng đi sang khu phố bên cạnh không cần bay.

::: tip Nguyên tắc cốt lõi của lựa chọn
- **Không có đạn bạc**: Không có công nghệ nào phù hợp mọi tình huống
- **Dựa trên tình huống**: Xác định rõ yêu cầu trước, rồi chọn công nghệ
- **Ưu tiên nhóm**: Công nghệ nhóm đã quen thuộc thường là lựa chọn tốt nhất
- **Khả năng đảo ngược**: Ưu tiên giải pháp dễ thay thế
:::

Thông qua component tương tác dưới đây, tìm hiểu toàn cảnh hệ sinh thái công nghệ hiện tại:

<TechRadarDemo />

---

## 1. Dimension đánh giá

### 1.1 Các dimension đánh giá cốt lõi

| Dimension | Điểm chú ý | Trọng số đề xuất |
|------|--------|---------|
| **Năng lực nhóm** | Nhóm có quen thuộc không? Chi phí học tập cao không? | Cao |
| **Hệ sinh thái cộng đồng** | Chất lượng tài liệu, thư viện bên thứ ba, số câu trả lời trên Stack Overflow | Cao |
| **Hiệu năng** | Có đáp ứng yêu cầu hiệu năng không? | Trung bình-Cao |
| **Trạng thái bảo trì** | Có được bảo trì tích cực không? Lần release gần nhất khi nào? | Trung bình |
| **Giấy phép** | Có tương thích với mô hình kinh doanh của dự án không? | Trung bình |
| **Thị trường tuyển dụng** | Có thể tuyển được người quen công nghệ này không? | Trung bình |

### 1.2 Case thực tế: Lựa chọn framework frontend

```
Dự án: Hệ thống quản lý nội bộ doanh nghiệp
Nhóm: 5 người, 3 người quen Vue, 1 người quen React, 1 người mới
Yêu cầu: Nhiều form, phân quyền phức tạp, không cần SEO

Phân tích:
- 60% nhóm quen Vue → Ưu tiên Vue
- Nhiều form → Hệ sinh thái Element Plus trưởng thành
- Không cần SSR → Không cần Next.js/Nuxt
- Kết luận: Vue 3 + Element Plus
```

---

## 2. Ma trận quyết định

Khi nhiều lựa chọn khó đánh giá bằng trực giác, dùng ma trận quyết định để so sánh định lượng.

Thông qua component tương tác dưới đây, trải nghiệm cách sử dụng ma trận quyết định:

<DecisionMatrixDemo />

### 2.1 Cách dùng ma trận quyết định

1. **Liệt kê phương án ứng viên**: Ví dụ React vs Vue vs Svelte
2. **Xác định dimension đánh giá**: Năng lực nhóm, hệ sinh thái, hiệu năng, đường cong học tập
3. **Phân bổ trọng số**: Theo yêu cầu dự án, gán trọng số cho mỗi dimension (tổng 100%)
4. **Chấm điểm từng mục**: Mỗi phương án được 1-5 điểm trên mỗi dimension
5. **Tổng có trọng số**: Tính điểm cuối cùng

### 2.2 Ví dụ

| Dimension | Trọng số | React | Vue | Svelte |
|------|------|-------|-----|--------|
| Năng lực nhóm | 30% | 3 | 5 | 1 |
| Hệ sinh thái cộng đồng | 25% | 5 | 4 | 2 |
| Đường cong học tập | 20% | 3 | 4 | 5 |
| Hiệu năng | 15% | 4 | 4 | 5 |
| Thị trường tuyển dụng | 10% | 5 | 4 | 2 |
| **Tổng có trọng số** | | **3.75** | **4.35** | **2.75** |

---

## 3. Bẫy phổ biến

### 3.1 Phát triển theo CV

> "Dùng công nghệ mới này, CV lại thêm một dòng"

Chọn công nghệ nên dựa trên yêu cầu dự án, không phải CV cá nhân. Công nghệ mới đồng nghĩa nhiều rủi ro chưa biết và ít hỗ trợ cộng đồng hơn.

### 3.2 Theo đuổi cái mới mù quáng

| Tâm lý | Thực tế |
|------|------|
| "Mới chắc hơn cũ" | Công nghệ mới có thể có bug chưa phát hiện |
| "Công ty lớn dùng, mình cũng nên dùng" | Tình huống của công ty lớn có thể hoàn toàn khác bạn |
| "Công nghệ này Star nhiều nhất" | Số Star không đồng nghĩa phù hợp dự án của bạn |

### 3.3 Bỏ qua chi phí migration

Khi lựa chọn, không chỉ xem "dùng thế nào", mà còn xem "nếu muốn đổi,代价 bao nhiêu". Ưu tiên:
- Giải pháp tuân thủ giao thức chuẩn (như SQL vs ngôn ngữ truy vấn riêng)
- Giải pháp có lộ trình migration rõ ràng
- Giải pháp không bị lock-in sâu

---

## 4. Hỗ trợ AI: Dùng mô hình ngôn ngữ lớn hỗ trợ lựa chọn công nghệ

Mô hình ngôn ngữ lớn có thể giúp bạn nhanh chóng nghiên cứu giải pháp công nghệ, so sánh ưu nhược điểm, tạo báo cáo quyết định.

### 4.1 So sánh giải pháp công nghệ

> **Prompt**:
> ```
> Tôi cần chọn database cho dự án e-commerce, các phương án ứng viên:
> MySQL, PostgreSQL, MongoDB.
> Đặc điểm dự án: đọc nhiều viết ít, cần truy vấn phức tạp, dữ liệu dự kiến hàng chục triệu bản ghi.
>
> Vui lòng so sánh ba phương án từ các dimension sau:
> Hiệu năng, hệ sinh thái, đường cong học tập, chi phí vận hành, khả năng mở rộng.
> Trình bày dạng bảng và đưa ra đề xuất cuối cùng kèm lý do.
> ```

### 4.2 Tạo Architecture Decision Record (ADR)

> **Prompt**:
> ```
> Giúp tôi viết một Architecture Decision Record (ADR), định dạng như sau:
> - Tiêu đề: Chọn Vue 3 làm framework frontend
> - Bối cảnh: [Bối cảnh và yêu cầu dự án]
> - Phương án ứng viên: React, Vue 3, Svelte
> - Quyết định: Vue 3
> - Lý do: [Dựa trên năng lực nhóm, hệ sinh thái, hiệu năng và các dimension khác]
> - Hệ quả: [Ảnh hưởng và rủi ro sau khi lựa chọn]
> ```

### 4.3 Nghiên cứu công nghệ mới

> **Prompt**:
> ```
> Tôi đang cân nhắc dùng Bun thay Node.js trong dự án, vui lòng phân tích:
> 1. Ưu điểm và nhược điểm cốt lõi của Bun so với Node.js
> 2. Mức độ trưởng thành hệ sinh thái hiện tại (khả năng tương thích npm, hỗ trợ framework chính)
> 3. Điểm rủi ro khi dùng ở môi trường production
> 4. Tình huống phù hợp và không phù hợp dùng Bun
> Đưa ra đánh giá khách quan, không chỉ nói ưu điểm.
> ```

::: tip Lời khuyên sử dụng AI
Kiến thức của AI có tính thời hạn — nó có thể chưa biết thay đổi ở phiên bản mới nhất. Với công nghệ lặp nhanh, dùng AI nghiên cứu ban đầu, nhưng nhất định phải tham khảo tài liệu chính thức để xác nhận thông tin mới nhất.
:::

---

## 5. Tổng kết

1. **Radar công nghệ**: Hiểu mức độ trưởng thành của công nghệ, phân biệt adopt/trial/assess/hold
2. **Dimension đánh giá**: Năng lực nhóm > Hệ sinh thái cộng đồng > Hiệu năng > Trạng thái bảo trì
3. **Ma trận quyết định**: So sánh định lượng, giảm thiên kiến chủ quan
4. **Tránh bẫy**: Không chạy theo mới, không theo trào lưu, cân nhắc chi phí migration

::: tip Suy ngẫm cuối cùng
Lựa chọn công nghệ tốt nhất thường là **lựa chọn nhàm chán nhất**. Chọn công nghệ trưởng thành, ổn định, nhóm đã quen, dành sức sáng tạo cho chính nghiệp vụ. Hãy nhớ: **Công nghệ là phương tiện, không phải mục đích. Người dùng không quan tâm bạn dùng framework gì, họ chỉ quan tâm sản phẩm có dùng tốt không.**
:::

---

## Đọc thêm

- **ThoughtWorks Tech Radar**: Phát hành mỗi nửa năm, là tham khảo uy tín để hiểu xu hướng công nghệ.
- **Khuyến nghị thực tế**: Lần lựa chọn công nghệ tiếp theo, thử dùng ma trận quyết định để so sánh định lượng.
- **Architecture Decision Record (ADR)**: Ghi lại lý do và đánh đổi của mỗi lần lựa chọn công nghệ.
- **Bài học phản diện**: Tìm hiểu các case dự án thất bại do lựa chọn công nghệ sai.

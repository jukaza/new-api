---
title: 'Lỗi code thì phải làm sao - Hướng dẫn thực chiến chụp màn hình hỏi AI'
description: 'Học cách đặt câu hỏi cho AI hiệu quả để giải quyết các lỗi phát triển, làm chủ quy trình chuẩn chụp màn hình, mô tả, định vị vấn đề, biến AI thành trợ lý debug của bạn.'
---

<script setup>
const duration = 'Khoảng <strong>30 phút</strong>'
</script>

# Lỗi code thì phải làm sao

## Hướng dẫn chương này

<ChapterIntroduction :duration="duration" :tags="['Kỹ năng debug', 'Hợp tác AI', 'Khắc phục vấn đề', 'Công cụ nhà phát triển']" coreOutput="Một quy trình khắc phục lỗi chuẩn hóa" expectedOutput="Có thể tự giải quyết 90% lỗi phổ biến">

Trong kỷ nguyên AI, cách khắc phục lỗi đã thay đổi.

Bạn không cần thuộc tất cả các loại lỗi, không cần trở thành chuyên gia debug, thậm chí không cần hiểu lỗi có nghĩa là gì.

<strong>Bạn chỉ cần học một điều: cách hỏi AI.</strong>

Chương này sẽ dạy bạn một quy trình khắc phục <strong>từ đơn giản đến nâng cao</strong>:

1. <strong>Bước 1: Hỏi trực tiếp</strong>: Mô tả hiện tượng + chụp màn hình, đặt câu hỏi bằng một câu
2. <strong>Bước 2: Bổ sung thông tin</strong>: Nếu không giải quyết được, mở F12 để bổ sung thông tin quan trọng

Sau khi làm chủ quy trình này, <strong>90% lỗi bạn đều có thể tự giải quyết</strong>.

</ChapterIntroduction>

::: info Giải thích
Tất cả các phương pháp trong chương này dựa trên kinh nghiệm sử dụng thực tế các AI IDE như Cursor/Trae/Claude, có thể áp dụng trực tiếp cho phát triển hàng ngày.
:::

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="0" :items="[
      { title: 'Đặt câu hỏi trực tiếp', description: 'Mô tả hiện tượng + chụp màn hình' },
      { title: 'Bổ sung thông tin', description: 'Mở F12 định vị vấn đề' },
      { title: 'Lặp lại giải quyết', description: 'Cho đến khi vấn đề được giải quyết' }
    ]" />
  </ClientOnly>
</div>

## 1. Tâm pháp cốt lõi: Chụp màn hình hỏi AI

::: warning Tại sao chương này quan trọng?

Rất nhiều người mới học khi gặp lỗi, phản ứng đầu tiên là:
- Hoảng hốt, bắt đầu sửa code lung tung
- Dùng nửa tiếng để tìm kiếm "cách giải quyết lỗi xxx"
- Cố tự hiểu lỗi có nghĩa là gì
- Tự debug đến khuya

<strong>Những điều này đều đang lãng phí thời gian.</strong>

Trong kỷ nguyên AI, debug đã trở thành một việc rất đơn giản:

```
Thấy lỗi → Chụp màn hình → Hỏi AI → Làm theo AI nói
```

Bạn không cần hiểu lỗi, không cần biết debug, thậm chí không cần biết vấn đề nằm ở đâu.

<strong>Bạn chỉ cần học cách hỏi.</strong>

:::

### 1.1 Cách đặt câu hỏi đơn giản nhất

Không cần template phức tạp, chọn một trong hai cách:

**Cách 1: Mô tả hiện tượng**

Định dạng: Vừa rồi làm gì, bây giờ xuất hiện gì

```
Vừa rồi tôi sửa code trang đăng nhập, bây giờ trang trắng, phải làm sao?
```

**Cách 2: Chụp màn hình**

Trực tiếp chụp màn hình trang hiện tại hoặc thông tin lỗi

```
[Chụp màn hình]

Lỗi này giải quyết thế nào?
```

**Cách tốt nhất: Mô tả + Chụp màn hình**

```
Vừa rồi tôi sửa code trang đăng nhập, bây giờ trang trắng.

[Chụp màn hình]

Phải làm sao?
```

**Nhớ: Mô tả rõ ngữ cảnh, kèm chụp màn hình, AI có thể giúp bạn giải quyết vấn đề nhanh hơn.**

### 1.2 Cách nói rõ vấn đề

Rất nhiều người mới học biết cần đặt câu hỏi, nhưng không biết nói thế nào. Thực ra chỉ cần nói rõ ba điều:

**1. Vừa rồi làm gì**

```
Vừa rồi tôi click nút lưu
Vừa rồi tôi sửa code trang đăng nhập
Vừa rồi tôi refresh trang
```

**2. Bây giờ thấy gì**

```
Bây giờ trang trắng
Bây giờ bấm nút không có phản ứng
Bây giờ hiển thị thông tin lỗi
```

**3. Muốn đạt hiệu quả gì**

```
Tôi muốn dữ liệu lưu thành công
Tôi muốn trang hiển thị bình thường
Tôi muốn sau khi click nút sẽ hiện thông báo
```

**Ví dụ hoàn chỉnh:**

```
Vừa rồi tôi click nút lưu, bây giờ trang hiển thị lỗi "Lưu thất bại".

[Chụp màn hình]

Tôi muốn dữ liệu form lưu thành công vào cơ sở dữ liệu, phải làm sao?
```

**Nguyên tắc chính:**
- Dùng ngôn ngữ bình thường để mô tả, không dùng thuật ngữ chuyên ngành
- Nói theo trình tự thời gian: trước làm gì, sau đó xảy ra gì
- Nói ra kỳ vọng của bạn, để AI biết bạn muốn gì

## 2. Bước 1: Trực tiếp mô tả hiện tượng đặt câu hỏi

Khi gặp vấn đề, <strong>đừng vội mở F12</strong>. Trước hết mô tả trực tiếp hiện tượng, chụp màn hình trang hiện tại, gửi cho AI xem.

Rất nhiều lúc, AI thấy chụp màn hình đã có thể trực tiếp đưa ra giải pháp.

### 2.1 Mô tả các hiện tượng phổ biến thế nào

::: tip Mô tả trực tiếp là được

**Trang trắng**
```
Trang mở ra trắng trơn, phải làm sao?

[Chụp màn hình]
```

**Nút click không phản ứng**
```
Click nút này không có phản ứng, giúp tôi xem.

[Chụp màn hình]
```

**Dữ liệu không lưu được**
```
Bấm lưu, dữ liệu không được lưu, phải làm sao?

[Chụp màn hình]
```

**Style hiển thị sai**
```
Vị trí nút này bị lệch, điều chỉnh thế nào?

[Chụp màn hình]
```

**API báo lỗi**
```
Gọi API bị lỗi, giúp tôi xem.

[Chụp màn hình]
```

:::

### 2.2 Nếu AI giải quyết trực tiếp

Chúc mừng bạn, vấn đề đã được giải quyết! Chỉ cần sửa theo AI nói.

### 2.3 Nếu AI nói "cần thêm thông tin"

Lúc này mới cần mở F12, bổ sung thông tin quan trọng. Xem tiếp bên dưới.

## 3. Bước 2: Bổ sung thông tin quan trọng

Khi AI nói cần thêm thông tin, tùy theo loại vấn đề, mở F12 chụp nội dung tương ứng.

### 3.1 Khi nào cần bổ sung thông tin

AI có thể trả lời như sau:
- "Xin mở Console xem có lỗi không"
- "Chụp màn hình tab Network cho tôi xem"
- "Cần xem thông tin lỗi cụ thể"

Lúc này, hãy bổ sung chụp màn hình theo hướng dẫn dưới đây.

### 3.2 Bổ sung thông tin Console (Trang trắng/Lỗi)

::: tip Các bước thao tác

**Bước 1: Nhấn F12 mở công cụ nhà phát triển**

Trên Mac là `Cmd+Option+I`, hoặc click chuột phải chọn "Kiểm tra".

**Bước 2: Chuyển sang tab Console**

**Bước 3: Chụp màn hình thông tin lỗi màu đỏ**

**Bước 4: Gửi cho AI**

```
Lỗi Console như sau:

[Chụp màn hình]
```

:::

### 3.3 Bổ sung thông tin Network (Vấn đề dữ liệu/API lỗi)

::: tip Các bước thao tác

**Bước 1: Nhấn F12 mở công cụ nhà phát triển**

**Bước 2: Chuyển sang tab Network**

**Bước 3: Thao tác lại một lần** (Click lưu/Refresh trang)

**Bước 4: Tìm request tương ứng, chụp màn hình**

- Xem URL và status code
- Xem Payload (tham số truyền đi)
- Xem Response (kết quả trả về)

**Bước 5: Gửi cho AI**

```
Thông tin Network như sau:

Request: [Chụp màn hình 1]
Tham số: [Chụp màn hình 2]
Kết quả: [Chụp màn hình 3]
```

:::

### 3.4 Bổ sung thông tin Elements (Vấn đề style)

::: tip Các bước thao tác

**Bước 1: Click chuột phải vào phần tử → "Kiểm tra"**

Công cụ nhà phát triển sẽ tự động định vị đến phần tử đó.

**Bước 2: Chụp màn hình bảng Styles**

**Bước 3: Gửi cho AI**

```
Style phần tử như sau:

[Chụp màn hình]
```

:::

## 4. Bước 3: Lặp lại cho đến khi giải quyết

### 4.1 Cách làm kém hiệu quả

Những cách làm này sẽ lãng phí thời gian của bạn:

Thấy lỗi liền hoảng hốt, bắt đầu sửa code lung tung
Dùng nửa tiếng tìm kiếm giải pháp lỗi
Cố tự hiểu ý nghĩa của mỗi lỗi
Một mình debug đến khuya

### 4.2 Cách làm hiệu quả

Làm theo quy trình này:

Trước hết mô tả trực tiếp hiện tượng chụp màn hình đặt câu hỏi
Khi AI nói cần thêm thông tin, mới mở F12 bổ sung
Sửa code theo đề xuất
Sau khi sửa xong kiểm tra, nếu vấn đề vẫn còn thì tiếp tục chụp màn hình đặt câu hỏi

## 5. Tóm tắt: Quy trình hoàn chỉnh

```
Gặp vấn đề
    ↓
Mô tả trực tiếp hiện tượng + Chụp màn hình
    ↓
Gửi cho AI: "Phải làm sao?"
    ↓
AI giải quyết trực tiếp?
    ↓ Có
Làm theo AI nói
    ↓
Kiểm tra đã giải quyết chưa
    ↓
    ↓ Không / AI cần thêm thông tin
Mở F12, bổ sung thông tin quan trọng
    ↓
Gửi lại cho AI
    ↓
Lặp lại cho đến khi giải quyết
```

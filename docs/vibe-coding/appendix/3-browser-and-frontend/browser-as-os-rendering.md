# Pipeline Kết Xuất Trình Duyệt
::: tip 🎯 Câu Hỏi Cốt Lõi
**Tại sao một số trang web mượt như lụa, trong khi số khác lại giật như trình chiếu PPT?** Trình duyệt biến đống code HTML, CSS, JavaScript thành trang web bạn nhìn thấy như thế nào? Chương này sẽ đưa bạn vào sâu bên trong "xưởng sản xuất" của trình duyệt, hiểu quy trình làm việc của nó, từ đó viết ra những trang web hiệu năng tốt hơn.
:::

**Bài viết này sẽ dạy bạn điều gì?**

| Chương | Nội Dung | Học Xong Có Thể Làm Gì |
|-----|------|-----------|
| **Chương 1** | Tại sao cần hiểu pipeline kết xuất | Hiểu sự cần thiết của tối ưu hiệu năng |
| **Chương 2** | Năm giai đoạn của pipeline kết xuất | Nắm vững quy trình kết xuất cơ bản của trình duyệt |
| **Chương 3** | Xây dựng cây DOM và cây CSSOM | Hiểu HTML và CSS được phân tích như thế nào |
| **Chương 4** | Xây dựng cây kết xuất | Biết những phần tử nào sẽ được kết xuất |
| **Chương 5** | Layout và Reflow | Tránh kích hoạt tính toán layout đắt đỏ |
| **Chương 6** | Paint và Repaint | Giảm thao tác vẽ không cần thiết |
| **Chương 7** | Composite và tăng tốc GPU | Tận dụng GPU để nâng cao hiệu năng animation |
| **Chương 8** | Event Loop | Hiểu cơ chế thực thi của JavaScript |
| **Chương 9** | Thực chiến tối ưu hiệu năng | Nắm vững các kỹ thuật tối ưu hiệu năng phổ biến |

Mỗi chương đều bắt đầu từ "hiểu nguyên lý", không cần bạn phải tự tay viết code tối ưu. Khi gặp vấn đề hiệu năng, quay lại tra cứu bất cứ lúc nào.

---

## 1. Tại Sao Cần Hiểu "Pipeline Kết Xuất"?

### 1.1 Từ "Chạy Được" Đến "Chạy Nhanh": Con Đường Tiến Bộ Của Frontend

Khi mới học frontend, chúng ta chỉ quan tâm code "có chạy được không" — trang hiển thị được, nút bấm được, coi như thành công. Nhưng khi dự án lớn dần, người dùng đông dần, bạn sẽ nhanh chóng phát hiện một thực tế tàn khốc: **cùng một chức năng, có người viết trang mượt như lụa, có người viết lại giật đến mức người dùng muốn đập chuột**.

Điều này giống như học lái xe. Người mới chỉ quan tâm "xe có chạy được không", nhưng tài xế lão luyện sẽ quan tâm "khi nào nên sang số, khi nào nên phanh, lái thế nào tiết kiệm xăng nhất". Trình duyệt chính là chiếc "xe" bạn đang lái, hiểu "thói quen làm việc" của nó, bạn mới có thể lái nhanh và ổn định.

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🐢 Tư Duy Người Mới (chỉ quan tâm chức năng)**
- Chỉ cần trang hiển thị được là được
- Giật lag là lỗi của trình duyệt
- Tối ưu hiệu năng là việc để sau

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🚀 Tư Duy Nâng Cao (quan tâm trải nghiệm)**
- Độ mượt là cốt lõi của trải nghiệm người dùng
- Hiểu quy trình làm việc của trình duyệt
- Viết code đã nghĩ đến hiệu năng

</div>
</div>

**Hiểu pipeline kết xuất, chính là bước then chốt từ "chạy được" đến "chạy nhanh".**

### 1.2 Một Câu Chuyện Thực Tế: Tại Sao "Tối Ưu" Rồi Lại Càng Chậm Hơn?

::: warning Nhật Ký Vấp Ngã Về Hiệu Năng Của Tiểu Trương
Tiểu Trương là frontend engineer của một công ty thương mại điện tử, phụ trách tối ưu trang chi tiết sản phẩm. Trang này khi hiển thị thông tin sản phẩm giật kinh khủng, người dùng phàn nàn liên tục.

Tiểu Trương nghĩ: "Trang giật chắc là do DOM quá nhiều, em dùng `display:none` ẩn trước, sửa xong rồi hiển thị, như vậy trình duyệt sẽ không kết xuất lặp lại chứ?"

Thế là cậu ấy viết code như sau:

```javascript
// Bạn nghĩ đây là "tối ưu"
const container = document.getElementById('list')
container.style.display = 'none'  // Ẩn trước, chắc sẽ không kích hoạt kết xuất?

for (let i = 0; i < 1000; i++) {
  const item = document.createElement('div')
  item.style.width = Math.random() * 100 + 'px'  // Độ rộng ngẫu nhiên
  container.appendChild(item)
}

container.style.display = 'block'  // Cuối cùng hiển thị, kết xuất một lần
```

Kết quả test phát hiện, trang **càng giật hơn**! Tiểu Trương ngơ ngác: rõ ràng đã "tối ưu" rồi, tại sao lại còn chậm hơn?

Sau đó tech lead xem code, chỉ ra vấn đề: **mặc dù phần tử bị ẩn, nhưng mỗi lần bạn sửa `style.width` vẫn kích hoạt tính toán style và đánh dấu layout của trình duyệt, trình duyệt đã làm rất nhiều việc vô ích ở background**.

Cách đúng là dùng `DocumentFragment` thao tác hàng loạt trong bộ nhớ, cuối cùng chèn một lần vào DOM, chỉ kích hoạt kết xuất một lần.
:::

::: info 💡 Bài Học Cốt Lõi
Không hiểu quy trình làm việc của trình duyệt, bạn có thể "tự cho là thông minh" viết ra một đống "code tối ưu", kết quả lại làm hiệu năng tệ hơn. **Hiểu pipeline kết xuất, bạn mới biết thao tác nào đắt đỏ, thao tác nào rẻ, từ đó tránh dùng sức sai chỗ.**
:::

---

## 2. Khái Niệm Cốt Lõi: "Pipeline Kết Xuất" Là Gì?

::: tip 🤔 "Kết Xuất" Là Gì?
**Kết xuất (Rendering)**, nói đơn giản là quá trình trình duyệt "vẽ" code thành trang web bạn nhìn thấy.

Bạn có thể tưởng tượng nó như **nhà in sách**:
- **HTML** = nội dung bản thảo (chữ, hình ảnh, chương mục)
- **CSS** = yêu cầu dàn trang (cỡ chữ, màu sắc, khoảng cách)
- **JavaScript** = chỉnh sửa động (tác giả sửa bản thảo tạm thời, điều chỉnh dàn trang)

Trình duyệt nhận những "nguyên liệu" này, phải qua từng "công đoạn", cuối cùng mới "in" ra trang web bạn nhìn thấy. Chuỗi công đoạn này, chính là **pipeline kết xuất (Rendering Pipeline)**.
:::

Để giúp bạn hiểu rõ hơn, chúng ta dùng một **tiệm bánh** để so sánh với quy trình kết xuất của trình duyệt.

### 2.1 Dùng Tiệm Bánh Để Hiểu Pipeline Kết Xuất

Hãy tưởng tượng bạn đang vận hành một tiệm bánh, mỗi ngày phải làm các loại bánh cho khách hàng. Các công đoạn trong quá trình này, giống một cách đáng kinh ngạc với quy trình kết xuất của trình duyệt:

| Giai Đoạn | 🥖 So Sánh Tiệm Bánh | Công Việc Thực Tế Của Trình Duyệt | Ví Dụ Cụ Thể |
|------|-------------|--------------|----------|
| **1. Chuẩn bị nguyên liệu** | Sắp xếp danh sách nguyên liệu (bột mì, trứng, kem...) | **Xây dựng cây DOM**: phân tích HTML thành cấu trúc cây | Bạn viết `<div><p>Hello</p></div>`, trình duyệt phân tích thành cây `div→p→"Hello"` |
| **2. Chuẩn bị công thức** | Sắp xếp thẻ công thức (tỉ lệ nguyên liệu mỗi loại bánh) | **Xây dựng cây CSSOM**: phân tích CSS thành cây quy tắc | Bạn viết `.title { color: red }`, trình duyệt ghi nhận "chữ của `.title` là màu đỏ" |
| **3. Lập kế hoạch** | Dựa vào nguyên liệu và công thức, quyết định hôm nay làm bánh gì | **Xây dựng cây kết xuất**: hợp nhất DOM và CSSOM, chỉ giữ phần tử hiển thị | Thẻ `<script>` không hiển thị, nên không có trong cây kết xuất |
| **4. Sắp xếp vị trí** | Bày bánh vào tủ trưng bày, quyết định mỗi bánh đặt ở đâu | **Layout**: tính toán kích thước và vị trí mỗi phần tử | Tính ra "div này rộng 200px, cao 100px, ở vị trí (50, 50) trên màn hình" |
| **5. Tô màu trang trí** | Quét trứng, rắc mè, bóp kem lên bánh | **Paint**: "vẽ" màu sắc, viền, bóng của phần tử | Thực sự vẽ "chữ màu đỏ" lên màn hình |
| **6. Lắp ráp hoàn thành** | Xếp chồng tất cả bánh lại với nhau, bày thành hình đẹp | **Composite**: hợp nhất nhiều layer thành hình ảnh cuối cùng | GPU hợp nhất layer nền, layer chữ, layer ảnh thành một bức tranh hoàn chỉnh |

::: tip 📊 Bạn Có Thể Thấy Gì Từ Bảng Này?
Hãy đọc từng dòng của bảng này, hiểu từng giai đoạn của pipeline kết xuất:

**Giai đoạn 1-2 (giai đoạn chuẩn bị)**: Trình duyệt trước tiên "hiểu" code của bạn. HTML và CSS được phân tích riêng biệt, vì chúng có trách nhiệm khác nhau — HTML quyết định "có nội dung gì", CSS quyết định "trông như thế nào".

**Giai đoạn 3 (giai đoạn hợp nhất)**: Tại sao cần "hợp nhất"? Vì không phải tất cả phần tử HTML đều hiển thị (như `<head>`, `<script>`), trình duyệt cần kết hợp "phần tử hiển thị" và "style của chúng" lại với nhau, tạo thành một "bản vẽ thi công".

**Giai đoạn 4-5 (giai đoạn vẽ)**: Layout là "tính vị trí", Paint là "tô màu". Thay đổi layout (như đổi độ rộng) sẽ dẫn đến paint, nhưng thay đổi paint (như đổi màu) không dẫn đến layout.

**Giai đoạn 6 (giai đoạn composite)**: "Phép màu" của trình duyệt hiện đại. Cách truyền thống là "vẽ xong một lần" (CPU chậm), cách hiện đại là "vẽ theo layer + GPU composite" (nhanh), đây chính là lý do animation `transform` mượt hơn animation `width`.
:::

### 2.2 Năm Giai Đoạn Của Pipeline Kết Xuất

<RenderingPipelineDemo />

---

## 3. Giai Đoạn 1: Xây Dựng Cây DOM và Cây CSSOM

### 3.1 Tại Sao Cần "Cây Hóa"?

::: tip 🤔 DOM Là Gì?
**DOM (Document Object Model)**, là cấu trúc cây mà trình duyệt chuyển đổi từ tài liệu HTML, thuận tiện cho JavaScript thao tác các phần tử trang.

Bạn có thể tưởng tượng nó như **cây gia phả**:
- Đỉnh trên cùng là "tổ tiên" (`<html>`)
- Bên dưới là "con cháu" (`<body>`, `<head>`)
- Bên dưới nữa là "cháu chắt" (`<div>`, `<p>`, `<span>`)

**Tại sao phải chuyển thành cây?** Vì cấu trúc cây rất tiện cho việc "tìm kiếm" và "sửa đổi". Ví dụ bạn muốn tìm "tất cả phần tử có class là `title`", trình duyệt có thể tìm kiếm nhanh trên cây, thay vì phải tìm từ từ trong đống văn bản lộn xộn.
:::

Trình duyệt nhận HTML xong, không hiển thị ngay, mà phải "hiểu" nó trước. Quá trình này chia làm ba bước:

**Bước 1: Phân tích từ vựng — tách code thành "từ"**

```html
<div class="container">
  <p>Hello World</p>
</div>
```

Trình duyệt thấy đoạn code này, sẽ "tách từ" trước:
- `<div>` → "thẻ mở div"
- `class="container"` → "thuộc tính class, giá trị container"
- `<p>` → "thẻ mở p"
- `Hello World` → "nội dung văn bản"
- `</p>` → "thẻ đóng p"
- `</div>` → "thẻ đóng div"

**Bước 2: Phân tích cú pháp — lắp ráp "từ" thành "nút"**

Trình duyệt dựa vào quy tắc HTML, lắp ráp những "từ" này thành "nút":
- Nút phần tử: `<div>`, `<p>`
- Nút thuộc tính: `class="container"`
- Nút văn bản: `"Hello World"`

**Bước 3: Xây dựng cây — thiết lập "quan hệ cha con"**

Cuối cùng, trình duyệt dựa vào quan hệ lồng nhau của thẻ, xây dựng cấu trúc cây:

```
Document (nút gốc tài liệu)
└── html
    └── body
        └── div.class = "container"
            └── p
                └── "Hello World"
```

### 3.2 Cây CSSOM: "Sổ Tay Quy Tắc" Của Style

::: tip 🤔 CSSOM Là Gì?
**CSSOM (CSS Object Model)**, là cấu trúc cây mà trình duyệt chuyển đổi từ quy tắc CSS, dùng để tính toán style cuối cùng của mỗi phần tử.

Bạn có thể tưởng tượng nó như **hướng dẫn phối đồ**:
- Quy tắc tầng trên (font của body) sẽ ảnh hưởng đến tầng dưới (tất cả phần tử con)
- Nếu có xung đột (như cùng một phần tử có nhiều quy tắc chỉ định màu khác nhau), phải quyết định dùng cái nào theo "độ ưu tiên"
- Cuối cùng tính ra mỗi phần tử nên "mặc" gì
:::

Quá trình xây dựng CSSOM tương tự DOM, nhưng có một khác biệt then chốt: **CSS có tính "kế thừa" và "tầng lớp"**.

::: details Xem quá trình xây dựng CSSOM
**CSS gốc:**
```css
body {
  font-size: 16px;
  color: #333;
}

.container {
  width: 100%;
  color: red;  /* sẽ ghi đè color của body */
}

.container p {
  font-weight: bold;
}
```

**Cây CSSOM sau khi xây dựng:**
```
StyleSheet
├── body
│   ├── font-size: 16px
│   └── color: #333
└── .container
    ├── width: 100%
    ├── color: red  (độ ưu tiên cao hơn, ghi đè color của body)
    └── p
        └── font-weight: bold
```
:::

### 3.3 Nhật Ký Vấp Ngã: Tại Sao CSS Của Tôi "Không Có Hiệu Lực"?

**Bẫy 1: Xung đột trọng số CSS selector**

::: details Xem lỗi phổ biến
```css
/* CSS bạn viết */
#header { color: red; }      /* id selector, trọng số 100 */
.title { color: blue; }     /* class selector, trọng số 10 */

/* HTML */
<div id="header" class="title">Đoạn chữ này màu gì?</div>
```

Bạn nghĩ là màu xanh, kết quả là **màu đỏ**. Vì trọng số của id selector (100) cao hơn class selector (10).
:::

**Bẫy 2: Thẻ HTML không đóng, trình duyệt "tự động sửa"**

::: details Xem cách trình duyệt sửa HTML lỗi
```html
<!-- HTML bạn viết -->
<div>
  <p>Đây là một đoạn chữ
</div>

<!-- Sau khi trình duyệt sửa -->
<div>
  <p>Đây là một đoạn chữ</p>  <!-- Trình duyệt tự động giúp bạn đóng thẻ -->
</div>
```

Trình duyệt rất "khoan dung", sẽ tự động sửa lỗi của bạn. Nhưng sự khoan dung này có cái giá — trình duyệt cần tính toán thêm để đoán ý định của bạn, **sẽ ảnh hưởng đến hiệu năng**.
:::

<DomToRenderTreeDemo />

---

## 4. Giai Đoạn 2: Xây Dựng Cây Kết Xuất

### 4.1 Tại Sao Cần "Cây Kết Xuất"?

Bạn có thể hỏi: **"Đã có cây DOM và cây CSSOM, tại sao còn phải xây dựng thêm cây kết xuất? Dùng thẳng DOM không được sao?"**

Câu trả lời là: **Cây DOM chứa quá nhiều thông tin "vô ích"**.

Ví dụ đoạn HTML sau:

```html
<html>
<head>
  <title>Tiêu đề trang</title>
  <style>/* Code CSS */</style>
  <script>/* Code JavaScript */</script>
</head>
<body>
  <div class="container">
    <p>Nội dung hiển thị</p>
  </div>
  <div style="display: none">
    <p>Nội dung ẩn (display:none)</p>
  </div>
</body>
</html>
```

**Cây DOM sẽ chứa tất cả phần tử**:
- `<head>`, `<title>`, `<style>`, `<script>` (những cái này không hiển thị)
- div `display: none` (cũng không hiển thị)

Nhưng **cây kết xuất chỉ chứa phần tử "phải vẽ lên màn hình"**:
- Bỏ `<head>` và các phần tử con của nó
- Bỏ div `display: none`

### 4.2 Quy Tắc Xây Dựng Cây Kết Xuất

Trình duyệt khi xây dựng cây kết xuất, sẽ tuân theo một bộ quy tắc:

| Tình Huống | Cách Xử Lý | Ví Dụ | Ảnh Hưởng Hiệu Năng |
|------|---------|------|----------|
| `display: none` | **Loại trừ hoàn toàn** khỏi cây kết xuất | Phần tử và con cháu đều không hiển thị | ✅ Giảm khối lượng công việc kết xuất |
| `visibility: hidden` | **Vẫn trong cây kết xuất**, nhưng không vẽ | Chiếm không gian, nhưng hoàn toàn trong suốt | ⚠️ Vẫn cần tính toán layout |
| `opacity: 0` | **Vẫn trong cây kết xuất**, nhưng trong suốt | Có thể tương tác (bấm được), nhưng không thấy | ⚠️ Vẫn cần tính toán layout |
| Không trong viewport | **Vẫn trong cây kết xuất**, tạm không vẽ | Cuộn đến viewport mới vẽ | ⚠️ Nhưng vẫn trong cây kết xuất |

::: tip 📊 Bạn Có Thể Thấy Gì Từ Bảng Này?
**Phát hiện then chốt**: `display: none` là cách ẩn duy nhất "thực sự tiết kiệm hiệu năng", vì phần tử hoàn toàn không có trong cây kết xuất, trình duyệt sẽ không làm bất kỳ công việc layout và paint nào cho nó.

Còn `visibility: hidden` và `opacity: 0` tuy "không nhìn thấy", nhưng vẫn trong cây kết xuất, trình duyệt vẫn cần tính toán layout của chúng (chiếm không gian). Nếu bạn cần "ẩn nhưng không ảnh hưởng layout" (như làm animation fade in/out), có thể dùng `opacity`; nếu cần "ẩn hoàn toàn và không chiếm không gian", dùng `display: none`.
:::

### 4.3 Nhật Ký Vấp Ngã: Tại Sao Đã Set display:none, Trang Vẫn Giật?

::: danger ❌ Hiểu Lầm Phổ Biến: Tưởng Phần Tử display:none "Không Tồn Tại"
Nhiều người tưởng set `display: none` rồi, phần tử "biến mất", thao tác thế nào cũng không ảnh hưởng hiệu năng. Đây là **sai lầm**!

Mặc dù phần tử `display: none` không có trong cây kết xuất, nhưng khi bạn dùng JavaScript sửa thuộc tính của nó, trình duyệt vẫn cần:
1. **Tính toán lại style** (khớp quy tắc CSS)
2. **Theo dõi thay đổi** (chuẩn bị cho hiển thị trong tương lai)

Xem ví dụ "tối ưu" dưới đây:
:::

::: details Xem code "tối ưu vô hiệu"
```javascript
// ❌ Bạn nghĩ đây là "tối ưu": ẩn trước, sửa xong hiển thị
const container = document.getElementById('list')
container.style.display = 'none'

// Thao tác DOM điên cuồng
for (let i = 0; i < 1000; i++) {
  const item = document.createElement('div')
  item.style.width = Math.random() * 100 + 'px'  // Thay đổi độ rộng!
  item.textContent = `Item ${i}`
  container.appendChild(item)
}

container.style.display = 'block'

// Vấn đề: mỗi lần sửa style.width, trình duyệt đều phải tính toán lại style,
// ngay cả khi phần tử là display:none!
```

**✅ Tư thế tối ưu đúng:**
```javascript
// Dùng DocumentFragment thao tác hàng loạt
const container = document.getElementById('list')
const fragment = document.createDocumentFragment()  // Container ảo

// Tất cả thao tác đều trên fragment trong bộ nhớ
for (let i = 0; i < 1000; i++) {
  const item = document.createElement('div')
  item.style.width = Math.random() * 100 + 'px'
  item.textContent = `Item ${i}`
  fragment.appendChild(item)  // Không ảnh hưởng DOM thật
}

// Chèn vào DOM thật một lần, chỉ kích hoạt kết xuất một lần
container.appendChild(fragment)
```
:::

---

## 5. Giai Đoạn 3: Layout và Reflow

### 5.1 "Layout" Là Gì?

::: tip 🤔 Layout Là Gì?
**Layout**, còn gọi là **Reflow**, là quá trình trình duyệt tính toán "ở vị trí nào, chiếm không gian bao nhiêu" cho mỗi phần tử trong cây kết xuất.

Bạn có thể tưởng tượng nó như **nhà thiết kế nội thất đo phòng**:
- Trước tiên đo chiều dài chiều rộng mỗi phòng
- Quyết định đồ đạc đặt ở đâu
- Tính ra tọa độ của mỗi món đồ

**Tại sao layout "đắt"?** Vì sự thay đổi của một phần tử có thể ảnh hưởng đến các phần tử khác. Ví dụ bạn làm một div rộng ra, div bên cạnh nó có thể bị đẩy xuống, dẫn đến toàn bộ trang phải tính toán lại.
:::

### 5.2 "Bãi Mìn" Kích Hoạt Reflow

Dưới đây là các thao tác phổ biến sẽ kích hoạt reflow, **khuyến nghị bookmark và ghi nhớ**:

| Loại | Thuộc Tính/Thao Tác | Ảnh Hưởng Hiệu Năng | Phương Án Thay Thế |
|------|----------|----------|----------|
| **Kích thước** | `width`, `height`, `min/max-width/height` | 💀💀💀 | Dùng `transform: scale()` thay thế |
| **Vị trí** | `top`, `right`, `bottom`, `left` | 💀💀💀 | Dùng `transform: translate()` thay thế |
| **Lề** | `margin`, `padding` | 💀💀 | Dùng `transform` hoặc `gap` thay thế |
| **Viền** | `border-width` | 💀💀 | Tránh sửa đổi thường xuyên |
| **Nội dung** | Thay đổi nội dung văn bản, tải ảnh | 💀💀 | Dành sẵn không gian, tránh layout shift |
| **Font** | `font-size`, `line-height` | 💀💀💀 | Tránh sửa đổi thường xuyên |
| **Hiển thị** | Thay đổi giá trị `display` | 💀💀💀 | Dùng `visibility` hoặc `opacity` thay thế (nếu không cần ẩn hoàn toàn) |
| **Truy vấn** | `offsetWidth`, `offsetHeight`, v.v. | 💀💀💀💀💀 | **Đọc hàng loạt, tránh layout shift** |

::: tip 📊 Bạn Có Thể Thấy Gì Từ Bảng Này?
**Phát hiện then chốt**:
1. **Thuộc tính hình học (rộng cao vị trí) đắt nhất**: Chúng kích hoạt tính toán layout đầy đủ
2. **Thuộc tính truy vấn nguy hiểm hơn sửa đổi**: Đọc `offsetWidth` sẽ **ép buộc layout đồng bộ** (xem mục 5.4)
3. **transform và opacity có hiệu năng tốt nhất**: Chúng không kích hoạt reflow, chỉ kích hoạt composite
:::

### 5.3 Nhật Ký Vấp Ngã: Tại Sao Animation Của Tôi Giật Như PPT?

**Bẫy: Dùng width làm animation**

::: details Xem code animation hiệu năng kém
```css
/* ❌ Animation xấu: kích hoạt reflow */
.box {
  width: 100px;
  transition: width 0.3s;
}

.box:hover {
  width: 200px;  /* Thay đổi độ rộng kích hoạt reflow! */
}
```

Mỗi frame animation đều kích hoạt reflow, trình duyệt cần:
1. Tính toán lại độ rộng
2. Tính toán lại vị trí (có thể ảnh hưởng phần tử khác)
3. Vẽ lại

**✅ Animation tốt: dùng transform**
```css
/* ✅ Animation tốt: chỉ kích hoạt composite */
.box {
  width: 100px;
  transform: scaleX(1);
  transition: transform 0.3s;
}

.box:hover {
  transform: scaleX(2);  /* Scale không kích hoạt reflow! */
}
```

`transform` được GPU xử lý trực tiếp, không kích hoạt reflow và repaint, animation mượt như lụa.
:::

### 5.4 Sát Thủ Hiệu Năng: Ép Buộc Layout Đồng Bộ

::: danger 💀 Vấn Đề Hiệu Năng Nguy Hiểm Nhất: Layout Thrashing
**Ép buộc layout đồng bộ (Forced Synchronous Layout)**, còn gọi là **layout thrashing**, là vấn đề hiệu năng phổ biến nhất và nghiêm trọng nhất.

Nguyên nhân của nó là: **JavaScript khi đọc thuộc tính layout (như `offsetWidth`), trình duyệt phải ngay lập tức thực thi tính toán layout, mới có thể trả về giá trị chính xác.**

Nếu bạn "đọc ghi xen kẽ", sẽ dẫn đến trình duyệt lặp đi lặp lại "layout → đọc → layout → đọc", tạo thành vòng luẩn quẩn.
:::

::: details Xem code layout thrashing
```javascript
// ❌ Cực xấu: đọc ghi xen kẽ, dẫn đến layout thrashing
const elements = document.querySelectorAll('.item')

for (let i = 0; i < elements.length; i++) {
  const height = elements[i].offsetHeight  // Đọc → ép buộc layout
  elements[i].style.width = (height * 2) + 'px'  // Ghi → đánh dấu cần reflow
  // Lần đọc của vòng lặp tiếp theo lại ép buộc layout... vòng luẩn quẩn!
}

// Nếu có 100 phần tử, sẽ kích hoạt 100 lần tính toán layout!
```

**✅ Tư thế tối ưu đúng: tách đọc ghi**
```javascript
const elements = document.querySelectorAll('.item')

// Bước 1: Đọc hàng loạt (đọc hết trước)
const heights = []
for (let i = 0; i < elements.length; i++) {
  heights.push(elements[i].offsetHeight)  // Chỉ kích hoạt layout một lần
}

// Bước 2: Ghi hàng loạt (ghi hết sau)
requestAnimationFrame(() => {
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.width = (heights[i] * 2) + 'px'  // Chỉ kích hoạt reflow một lần
  }
})
```
:::

<LayoutReflowDemo />

---

## 6. Giai Đoạn 4: Paint và Repaint

### 6.1 "Paint" Là Gì?

::: tip 🤔 Paint Là Gì?
**Paint**, là quá trình trình duyệt thực sự "vẽ" phần tử đã "tính toán layout xong" lên màn hình.

Bạn có thể tưởng tượng nó như **sơn phòng**:
- Giai đoạn layout = đo kích thước, kẻ đường
- Giai đoạn paint = thực sự sơn, dán giấy tường

**Paint không đắt như layout, nhưng cũng không rẻ.** Paint thường xuyên vẫn ảnh hưởng hiệu năng, đặc biệt là phần tử phức tạp (bóng, gradient, v.v.).
:::

### 6.2 Tín Hiệu Kích Hoạt Repaint

Khác với reflow, repaint chỉ liên quan đến thay đổi "ngoại quan", không liên quan đến thay đổi "hình học":

| Loại | Thuộc Tính | Ảnh Hưởng Hiệu Năng | Ghi Chú |
|------|------|----------|------|
| **Màu sắc** | `color`, `background-color` | 💀 | Tác nhân kích hoạt repaint phổ biến nhất |
| **Nền** | `background-image`, `background-position` | 💀💀 | Ảnh chậm hơn màu thuần |
| **Viền** | `border-color`, `border-style` | 💀 | Thay đổi màu/style viền |
| **Chữ** | `text-decoration`, `text-shadow` | 💀💀 | Bóng chậm hơn chữ thuần |
| **Box shadow** | `box-shadow` | 💀💀💀 | Bóng phức tạp rất chậm |
| **Bo góc** | `border-radius` | 💀 | Thay đổi kích thước bo góc |
| **Độ trong suốt** | `opacity` | ✅ | **Đặc biệt: không kích hoạt repaint, chỉ kích hoạt composite** |

::: tip 📊 Bạn Có Thể Thấy Gì Từ Bảng Này?
**Phát hiện then chốt**: `opacity` là đặc biệt! Nó giống như `transform`, không kích hoạt repaint, mà trực tiếp kích hoạt giai đoạn composite. Đây chính là lý do dùng `opacity` làm animation fade in/out có hiệu năng tốt nhất.

Ngoài ra, **bóng và gradient đắt hơn repaint**, vì chúng cần tính toán pixel phức tạp. Nếu trang của bạn có nhiều `box-shadow`, cân nhắc dùng pseudo-element hoặc ảnh thay thế.
:::

### 6.3 Nhật Ký Vấp Ngã: Tại Sao Hiệu Ứng Hover Của Tôi Giật?

**Bẫy: Dùng box-shadow làm animation hover**

::: details Xem hiệu ứng hover hiệu năng kém
```css
/* ❌ Hiệu ứng hover xấu: animation box-shadow rất chậm */
.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);  /* Bóng rất chậm! */
}
```

`box-shadow` cần tính toán từng pixel, animation sẽ giật.

**✅ Cách làm tốt: dùng transform hoặc pseudo-element**
```css
/* ✅ Hiệu ứng hover tốt: dùng transform */
.card {
  transform: translateY(0);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-4px);  /* Chỉ đổi bóng khi hover, không làm animation */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
```
:::

<PaintLayerDemo />

---

## 7. Giai Đoạn 5: Composite và Tăng Tốc GPU

### 7.1 "Composite" Là Gì?

::: tip 🤔 Composite Là Gì?
**Composite**, là "phép màu" của trình duyệt hiện đại, nó chia các phần khác nhau của trang thành nhiều **layer**, sau đó dùng **GPU (bộ xử lý đồ họa)** để song song tổng hợp thành hình ảnh cuối cùng.

Bạn có thể tưởng tượng nó như **layer trong Photoshop**:
- Cách truyền thống = tất cả vẽ trên một layer (CPU tuần tự, chậm)
- Cách composite = vẽ theo layer, cuối cùng hợp nhất (GPU song song, nhanh)

**Tại sao composite nhanh?** Vì GPU giỏi xử lý các tác vụ song song như "tổng hợp hình ảnh", nhanh hơn CPU hàng chục lần.
:::

### 7.2 Phần Tử Nào Sẽ Được Nâng Lên "Composite Layer"?

Trình duyệt sẽ tự động nâng một số phần tử lên composite layer độc lập. Dưới đây là các điều kiện kích hoạt phổ biến:

| Điều Kiện Kích Hoạt | Thuộc Tính/Giá Trị CSS | Ảnh Hưởng Hiệu Năng | Lưu Ý |
|---------|-----------|----------|----------|
| **Biến đổi 3D** | `transform: translate3d()`, `rotate3d()` | ✅✅✅ | Hiệu năng animation tốt nhất |
| **Hack tăng tốc phần cứng** | `transform: translateZ(0)` | ✅✅ | Thường gọi là "ép GPU tăng tốc" |
| **Animation độ trong suốt** | Thay đổi `opacity` (kèm animation) | ✅✅✅ | Không kích hoạt repaint |
| **Fixed position** | `position: fixed` | ✅ | Tránh layout lặp lại khi cuộn |
| **Will-Change** | `will-change: transform, opacity` | ✅✅ | Tạo layer trước, chú ý bộ nhớ |
| **Canvas/WebGL** | `<canvas>`, nội dung WebGL | ✅✅ | Tự nhiên trong layer độc lập |
| **Video** | `<video>` | ✅✅ | Layer độc lập, tránh ảnh hưởng lẫn nhau |

::: tip 📊 Bạn Có Thể Thấy Gì Từ Bảng Này?
**Phát hiện then chốt**: `transform` và `opacity` là thuộc tính animation có hiệu năng tốt nhất, vì chúng không kích hoạt reflow và repaint, trực tiếp kích hoạt composite. Đây chính là lý do hướng dẫn tối ưu hiệu năng luôn nói "dùng transform và opacity làm animation".

Nhưng cần lưu ý: **mỗi composite layer đều chiếm bộ nhớ GPU**, lạm dụng `translateZ(0)` sẽ dẫn đến bùng nổ bộ nhớ (xem mục 7.4).
:::

### 7.3 Nhật Ký Vấp Ngã: Composite Layer Quá Nhiều Lại Giật?

::: danger 💀 Bẫy Của Tối Ưu Quá Mức
Có người nghe nói "GPU tăng tốc nhanh", liền cho tất cả phần tử thêm `transform: translateZ(0)`, kết quả trang lại càng giật hơn.

**Nguyên nhân vấn đề**:
Mỗi composite layer cần lưu một "texture" (bitmap) trong GPU, chiếm bộ nhớ. Nếu một trang có 100 composite layer, bộ nhớ GPU có thể bị bung, dẫn đến thiết bị cấp thấp crash hoặc giáng cấp xuống CPU rendering.
:::

::: details Xem code "tối ưu quá mức"
```css
/* ❌ Cách làm sai: bật GPU tăng tốc cho tất cả phần tử */
.card { transform: translateZ(0); }
.button { transform: translateZ(0); }
.icon { transform: translateZ(0); }
/* ... 100 phần tử đều thêm ... */

/* Kết quả: bộ nhớ GPU bùng nổ, trang đơ */
```

**✅ Cách làm đúng: dùng theo nhu cầu**
```css
/* Chiến lược 1: chỉ bật cho phần tử thực sự cần animation */
.card {
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);  /* Tự động tạo composite layer */
}

/* Chiến lược 2: dùng will-change gợi ý trình duyệt */
.card {
  will-change: transform;  /* Tạo layer trước */
}

/* Chiến lược 3: gỡ bỏ sau khi animation kết thúc */
.card:not(:hover) {
  will-change: auto;  /* Giải phóng bộ nhớ GPU */
}
```
:::

<CompositeDemo />

---

## 8. Event Loop: "Thuật Phân Thân" Của JavaScript

::: tip 🤔 Event Loop Là Gì?
**Event Loop**, là cơ chế JavaScript thực hiện "bất đồng bộ". Vì JavaScript là **đơn luồng** (mỗi lần chỉ làm một việc), nhưng nó lại phải xử lý click của người dùng, yêu cầu mạng, timer và nhiều tác vụ khác, nên cần một "hệ thống lập lịch" để quản lý những tác vụ này.

Bạn có thể tưởng tượng nó như **trung tâm phân loại chuyển phát nhanh**:
- **Call Stack** = bưu kiện đang được xử lý
- **Web APIs** = kho hợp tác bên ngoài (timer, yêu cầu mạng, v.v.)
- **Callback Queue** = kệ bưu kiện chờ xử lý
- **Event Loop** = robot phân loại (liên tục kiểm tra "có thể xử lý tác vụ tiếp theo chưa")
:::

### 8.1 Macro Task và Micro Task

JavaScript thời kỳ đầu chỉ có một hàng đợi tác vụ. Nhưng khi lập trình bất đồng bộ trở nên phức tạp, trình duyệt đã giới thiệu hai loại tác vụ:

| Loại | Nguồn Phổ Biến | Độ Ưu Tiên | Thời Điểm Thực Thi |
|------|---------|--------|----------|
| **Macro task** | `setTimeout`/`setInterval`, thao tác I/O, UI rendering | Thấp | Mỗi chu kỳ event loop thực thi một cái |
| **Micro task** | `Promise.then`, `MutationObserver` | Cao | Sau khi macro task hiện tại kết thúc, lập tức xóa hết tất cả micro task |

**"Khẩu quyết" thứ tự thực thi**:

```
1. Thực thi macro task hiện tại (ví dụ toàn bộ <script>)
2. Thực thi tất cả micro task sinh ra trong quá trình thực thi (Promise.then, v.v.)
   ↳ Micro task có thể sinh ra micro task mới, xóa hết mới tiếp tục
3. Nếu cần, tiến hành UI rendering (reflow/repaint)
4. Bắt đầu vòng event loop tiếp theo, thực thi macro task tiếp theo
```

### 8.2 Nhật Ký Vấp Ngã: Promise Nhanh Hơn setTimeout?

::: danger ❌ Hiểu Lầm Phổ Biến: setTimeout(fn, 0) Sẽ "Thực Thi Ngay"
Nhiều người tưởng `setTimeout(fn, 0)` là "0 millisecond sau thực thi ngay", đây là cách hiểu **sai lầm**.

Thực tế, ý nghĩa của `setTimeout(fn, 0)` là: **"ít nhất đợi 0 millisecond, đưa callback vào hàng đợi macro task"**. Nhưng nó cần đợi call stack hiện tại trống, hàng đợi micro task trống, UI rendering có thể hoàn thành, mới có thể thực thi.
:::

::: details Xem thứ tự thực thi
```javascript
console.log('1. Start')

setTimeout(() => {
  console.log('2. setTimeout callback')
}, 0)

Promise.resolve().then(() => {
  console.log('3. Promise.then')
})

console.log('4. End')

// Thứ tự output bạn nghĩ:
// 1. Start
// 4. End
// 2. setTimeout callback  ← setTimeout(0) không phải là ngay lập tức sao?
// 3. Promise.then

// Thứ tự output thực tế:
// 1. Start
// 4. End
// 3. Promise.then         ← Promise.then thực thi trước setTimeout!
// 2. setTimeout callback
```

**Sơ đồ quy trình thực thi:**
```
Call Stack                     Hàng Đợi Macro Task            Hàng Đợi Micro Task
                              [setTimeout callback]           [Promise.then callback]

1. console.log('1. Start')
   → Output: 1. Start

2. setTimeout(fn, 0)
   → Đưa callback vào hàng đợi macro task  ← [setTimeout callback]

3. Promise.resolve().then()
   → Đưa callback vào hàng đợi micro task                       ← [Promise.then callback]

4. console.log('4. End')
   → Output: 4. End

5. Call stack trống, kiểm tra hàng đợi micro task
   → Phát hiện Promise.then callback
   → Thực thi: console.log('3. Promise.then')
   → Output: 3. Promise.then

6. Hàng đợi micro task trống
   → Có thể cần UI rendering (nếu có thay đổi)

7. Kiểm tra hàng đợi macro task
   → Phát hiện setTimeout callback
   → Thực thi: console.log('2. setTimeout callback')
   → Output: 2. setTimeout callback
```
:::

::: tip 💡 Bài Học Cốt Lõi
**Micro task "gấp" hơn macro task**. Nếu bạn muốn một thao tác nào đó thực thi "sau khi block code hiện tại kết thúc, nhưng trước khi UI cập nhật", dùng `Promise.then` hoặc `queueMicrotask`.

`setTimeout(0)` không đảm bảo thực thi ngay, nó ít nhất sẽ bị trì hoãn đến sau khi call stack hiện tại trống, hàng đợi micro task trống.
:::

<JSEventLoopDemo />

<MacroMicroTaskDemo />

---

## 9. Thực Chiến Tối Ưu Hiệu Năng: Làm Cho Trang Web Của Bạn "Bay"

Hiểu quy trình làm việc của pipeline kết xuất rồi, chúng ta cùng xem cách tối ưu. Dưới đây là năm kỹ thuật tối ưu thực dụng nhất.

### 9.1 Quy Tắc Vàng: Tránh Ép Buộc Layout Đồng Bộ

**Vấn đề**: Đọc ghi xen kẽ thuộc tính layout, dẫn đến layout thrashing.

::: details Xem so sánh trước và sau tối ưu
```javascript
// ❌ Cực xấu: đọc ghi xen kẽ, dẫn đến layout thrashing
for (let i = 0; i < elements.length; i++) {
  const height = elements[i].offsetHeight  // Đọc → ép buộc layout
  elements[i].style.height = (height * 2) + 'px'  // Ghi → đánh dấu cần reflow
  // Lần đọc của vòng lặp tiếp theo lại ép buộc layout... vòng luẩn quẩn!
}

// ✅ Cực tốt: đọc hết trước, ghi hết sau
// Bước 1: Đọc hàng loạt
const heights = []
for (let i = 0; i < elements.length; i++) {
  heights.push(elements[i].offsetHeight)
}

// Bước 2: Ghi hàng loạt
requestAnimationFrame(() => {
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.height = (heights[i] * 2) + 'px'
  }
})
```
:::

### 9.2 Dùng transform và opacity Làm Animation

**Vấn đề**: Dùng `width`, `height`, `left`, `top` làm animation sẽ kích hoạt reflow.

::: details Xem so sánh trước và sau tối ưu
```css
/* ❌ Animation xấu: kích hoạt reflow */
.box {
  transition: width 0.3s, left 0.3s;
}
.box.moving {
  width: 200px;
  left: 100px;
}

/* ✅ Animation tốt: chỉ kích hoạt composite */
.box {
  transition: transform 0.3s;
}
.box.moving {
  transform: translateX(100px) scaleX(2);
}
```
:::

### 9.3 Virtual Scrolling: Giải Quyết Danh Sách Dữ Liệu Lớn

**Vấn đề**: Khi số lượng mục danh sách lên đến hàng nghìn, số nút DOM quá nhiều dẫn đến vấn đề hiệu năng.

**Ý tưởng cốt lõi**: Chỉ kết xuất các mục danh sách hiển thị trong viewport (cộng thêm một ít buffer), số nút DOM cố định, không liên quan đến tổng lượng dữ liệu.

<RenderingPerformanceDemo />

::: details Xem triển khai virtual scrolling
```vue
<template>
  <div class="virtual-list" @scroll="handleScroll">
    <!-- Phần tử placeholder, chống thanh cuộn -->
    <div class="phantom" :style="{ height: totalHeight + 'px' }"></div>

    <!-- Các mục danh sách thực sự được kết xuất -->
    <div class="content" :style="{ transform: `translateY(${offsetY}px)` }">
      <div
        v-for="item in visibleItems"
        :key="item.id"
        class="item"
        :style="{ height: itemHeight + 'px' }"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  items: Array,
  itemHeight: { type: Number, default: 50 }
})

const scrollTop = ref(0)
const buffer = 5  // Số lượng buffer

// Viewport hiển thị được bao nhiêu mục
const visibleCount = computed(() => 10)

// Chỉ số bắt đầu
const startIndex = computed(() =>
  Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - buffer)
)

// Chỉ số kết thúc
const endIndex = computed(() =>
  Math.min(props.items.length, startIndex.value + visibleCount.value + buffer * 2)
)

// Dữ liệu hiện tại hiển thị
const visibleItems = computed(() =>
  props.items.slice(startIndex.value, endIndex.value)
)

// Tổng chiều cao
const totalHeight = computed(() => props.items.length * props.itemHeight)

// Độ lệch
const offsetY = computed(() => startIndex.value * props.itemHeight)

const handleScroll = (e) => {
  scrollTop.value = e.target.scrollTop
}
</script>
```
:::

### 9.4 Debounce và Throttle: Giảm Tần Suất Kích Hoạt Sự Kiện

**Vấn đề**: Sự kiện kích hoạt thường xuyên (như scroll, resize) dẫn đến vấn đề hiệu năng.

::: details Xem triển khai debounce và throttle
```javascript
// Debounce: trì hoãn thực thi, nếu trong thời gian trì hoãn lại kích hoạt, thì đếm lại
function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// Throttle: thực thi theo khoảng thời gian cố định
function throttle(fn, interval) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

// Ví dụ sử dụng
window.addEventListener('scroll', debounce(handleScroll, 200))
window.addEventListener('resize', throttle(handleResize, 100))
```
:::

### 9.5 Lazy Loading: Trì Hoãn Tải Tài Nguyên Không Quan Trọng

**Vấn đề**: First screen tải quá nhiều tài nguyên dẫn đến trang mở chậm.

::: details Xem triển khai lazy loading
```javascript
// Lazy loading ảnh
const lazyImages = document.querySelectorAll('img[data-src]')

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src  // Tải ảnh thật
      img.removeAttribute('data-src')
      observer.unobserve(img)  // Dừng quan sát
    }
  })
})

lazyImages.forEach(img => imageObserver.observe(img))
```
:::

---

## 10. Những Vấn Đề Hiệu Năng Bạn Nên Có Thể Nhận Diện

Sau khi hiểu pipeline kết xuất của trình duyệt, bạn nên có thể nhận diện các vấn đề hiệu năng phổ biến sau:

| Code Vấn Đề | Vấn Đề Nằm Ở Đâu | Cách Mô Tả Cho AI |
|---------|---------|-------------|
| `element.style.width = ...` | Trong vòng lặp thường xuyên sửa độ rộng | "Chỗ này sẽ kích hoạt reflow nhiều lần, hãy dùng transform hoặc xử lý hàng loạt" |
| `height = element.offsetHeight` | Đọc thuộc tính layout ngay sau khi ghi | "Đây là ép buộc layout đồng bộ, hãy tách thao tác đọc và ghi" |
| `element.className = ...` | Thường xuyên sửa class kích hoạt tính toán lại style | "Dùng classList.add/remove thay thế, giảm tính toán style" |
| Animation dùng `width`/`left` | Kích hoạt reflow và repaint, hiệu năng kém | "Hãy dùng transform và opacity làm animation" |
| Thêm `translateZ(0)` cho tất cả phần tử | Lạm dụng GPU tăng tốc dẫn đến bùng nổ bộ nhớ | "Chỉ bật GPU tăng tốc cho phần tử cần animation" |
| Kết xuất toàn bộ 10000 mục danh sách | Số nút DOM quá nhiều dẫn đến giật | "Triển khai virtual scrolling, chỉ kết xuất vùng hiển thị" |
| Thao tác DOM trực tiếp trong sự kiện scroll | Tần suất kích hoạt quá cao dẫn đến giật | "Dùng requestAnimationFrame hoặc throttle để tối ưu" |
| `box-shadow` làm animation hover | Tính toán bóng phức tạp rất chậm | "Dùng transform hoặc pseudo-element, tránh animation bóng" |

**Nếu bạn đã đọc kỹ "nhật ký vấp ngã" của mỗi chương, bạn còn nắm được những khái niệm cốt lõi sau:**

- **Năm giai đoạn pipeline kết xuất**: DOM/CSSOM → Cây kết xuất → Layout → Paint → Composite
- **Reflow vs Repaint**: Reflow đắt nhất (thay đổi hình học), Repaint đắt thứ hai (thay đổi ngoại quan)
- **Ép buộc layout đồng bộ**: Đọc ghi xen kẽ dẫn đến layout thrashing, phải tách ra
- **GPU tăng tốc**: transform và opacity được GPU xử lý, hiệu năng tốt nhất
- **Event Loop**: JavaScript là đơn luồng, thông qua hàng đợi tác vụ để thực hiện bất đồng bộ

Những khái niệm này sẽ giúp bạn nhanh chóng định vị nút thắt hiệu năng.

::: info 💡 Khi Gặp Vấn Đề Hiệu Năng, Hãy Nói Với AI Như Sau
- "Animation giật, kiểm tra xem có kích hoạt reflow hoặc repaint không"
- "Hiệu năng cuộn kém, có thể cần throttle hoặc requestAnimationFrame"
- "Danh sách dữ liệu lớn giật, cần virtual scrolling"
- "Thường xuyên sửa style dẫn đến vấn đề hiệu năng, hãy dùng transform để tối ưu"
:::

---

## 11. Tổng Kết: Bản Chất Của Tối Ưu Pipeline Kết Xuất

Qua bài viết này, chúng ta có thể rút ra những kết luận cốt lõi sau:

**Từ góc độ thực tiễn**: Không phải tối ưu càng nhiều càng tốt, mà là tối ưu càng "đúng chỗ" càng tốt. Hiểu pipeline kết xuất của trình duyệt, mới biết nên dùng sức ở đâu, nên buông tay ở đâu.

**Từ góc độ chi phí**:
- Phần lớn lãng phí hiệu năng đến từ **đọc ghi xen kẽ thường xuyên** thuộc tính layout, cần thông qua tách đọc ghi, xử lý hàng loạt để giải quyết
- Hiệu ứng animation phức tạp nếu kích hoạt reflow và repaint, thường bắt nguồn từ việc dùng "thuộc tính sai", cần thông qua `transform` và `opacity` để giải quyết
- Đối với kết xuất danh sách dữ liệu lớn, chỉ dựa vào virtual DOM là chưa đủ, phải kết hợp kỹ thuật như **virtual scrolling**

**Mục tiêu là: trong điều kiện trình duyệt và phần cứng cho trước, làm cho mỗi bước kết xuất đều có lợi ích hiệu năng rõ ràng.**

---

## 12. Bảng Thuật Ngữ

| Thuật Ngữ Tiếng Anh | Dịch Tiếng Việt | Giải Thích |
| :--- | :--- | :--- |
| **DOM** | Document Object Model | Cấu trúc cây được hình thành sau khi trình duyệt phân tích tài liệu HTML, JavaScript có thể thao tác phần tử trang qua DOM API |
| **CSSOM** | CSS Object Model | Cấu trúc cây được hình thành sau khi trình duyệt phân tích CSS, kết hợp với DOM để tính toán style cuối cùng |
| **Render Tree** | Cây kết xuất | Được hợp nhất từ cây DOM và cây CSSOM, chỉ chứa nút hiển thị, dùng cho tính toán layout và vẽ tiếp theo |
| **Layout** | Layout/Bố cục | Quá trình tính toán thông tin hình học (vị trí, kích thước) của mỗi nút trong cây kết xuất, còn gọi là Reflow |
| **Reflow** | Reflow | Khi thuộc tính hình học của phần tử như kích thước, vị trí thay đổi, trình duyệt cần tính toán lại layout |
| **Paint** | Paint/Vẽ | Quá trình vẽ style phần tử (màu sắc, nền, viền, v.v.) sau khi tính toán layout lên màn hình |
| **Repaint** | Repaint/Vẽ lại | Khi thuộc tính ngoại quan của phần tử (như màu sắc, nền) thay đổi nhưng không ảnh hưởng thuộc tính hình học, kích hoạt cập nhật vẽ |
| **Composite** | Composite/Tổng hợp | Quá trình hợp nhất nhiều layer vẽ thành hình ảnh màn hình cuối cùng, thường thực thi trên GPU |
| **Layer** | Layer/Lớp tổng hợp | Bề mặt vẽ độc lập được trình duyệt tạo ra để tối ưu kết xuất, có thể biến đổi và tổng hợp riêng biệt |
| **Event Loop** | Event Loop/Vòng lặp sự kiện | Cơ chế thực thi bất đồng bộ của JavaScript, chịu trách nhiệm lập lịch thực thi macro task và micro task |
| **Call Stack** | Call Stack/Ngăn xếp gọi | Cấu trúc dữ liệu ghi lại hàm JavaScript đang được thực thi |
| **Macro Task** | Macro Task/Tác vụ macro | Loại tác vụ có độ ưu tiên thấp trong event loop, như setTimeout, setInterval, thao tác I/O, v.v. |
| **Micro Task** | Micro Task/Tác vụ micro | Loại tác vụ có độ ưu tiên cao trong event loop, như Promise.then, MutationObserver, v.v. |
| **Forced Synchronous Layout** | Ép buộc layout đồng bộ | Trong JavaScript đọc ghi xen kẽ thuộc tính layout, dẫn đến trình duyệt bị ép phải lập tức thực thi tính toán layout |
| **Layout Thrashing** | Layout Thrashing/Rung lắc layout | Hiện tượng hiệu năng giảm mạnh do ép buộc layout đồng bộ thường xuyên |
| **Virtual Scrolling** | Virtual Scrolling/Cuộn ảo | Kỹ thuật chỉ kết xuất các mục danh sách hiển thị trong viewport, dùng để tối ưu hiệu năng danh sách dữ liệu lớn |
| **RAF** | Request Animation Frame | API do trình duyệt cung cấp, dùng để thực thi code JavaScript liên quan đến animation trước lần repaint tiếp theo |
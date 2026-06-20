# Hệ thống bố cục HTML / CSS
::: tip 🎯 Câu hỏi cốt lõi
**Trang web được tạo ra như thế nào? Tại sao có trang web chỉ có văn bản, trong khi trang khác lại có thể tương tác như một ứng dụng?** Câu hỏi này sẽ dẫn đến ba trụ cột của phát triển Web, giúp bạn hiểu cấu trúc đằng sau mỗi trang web.
:::

---

## 1. HTML, CSS, JavaScript là gì?

### 1.1 Từ trang web tĩnh đến ứng dụng động

Hãy tưởng tượng bạn nhìn thấy một **tấm áp phích** trên phố. Bạn chỉ có thể xem, không thể tương tác — áp phích sẽ không thay đổi nội dung chỉ vì bạn nhìn vào, cũng không hiện thêm thông tin khi bạn chạm vào đâu đó.

Trang web thời kỳ đầu chính là những "áp phích điện tử" như vậy: chỉ để xem, không thể thay đổi, nội dung cố định.

Nhưng trang web hiện đại thì hoàn toàn khác. Chúng giống như **ứng dụng desktop**:

- Bạn có thể nhấp, kéo thả, nhập liệu, tải lên
- Trang web thay đổi theo thời gian thực dựa trên thao tác của bạn
- Có thể hoàn thành các tác vụ phức tạp như phần mềm (ví dụ: chỉnh sửa video trực tuyến)

**Nguyên nhân cốt lõi của sự chuyển đổi này chính là ba trụ cột của công nghệ web: HTML + CSS + JavaScript**.

### 1.2 Một phép ẩn dụ: Xây nhà

| Công nghệ       | 🏠 Ẩn dụ xây nhà                | Vai trò thực tế                   | Ví dụ cụ thể                                   |
| --------------- | ------------------------------- | --------------------------------- | ---------------------------------------------- |
| **HTML**        | **Kết cấu và vật liệu** của nhà | Định nghĩa nội dung và phân cấp   | Đây là một bức tường, đây là cửa sổ, đây là phòng |
| **CSS**         | **Trang trí và ngoại thất**     | Kiểm soát kiểu dáng và bố cục     | Tường sơn màu xanh, cửa sổ đặt hướng đông, sàn lát gạch |
| **JavaScript**  | **Thiết bị điện và hệ thống thông minh** | Làm trang web có tương tác và logic | Nhấn công tắc đèn sáng, mở cửa rèm tự động kéo ra |

::: tip 💡 Mối quan hệ giữa ba thứ

**HTML → CSS**: Phải có nhà trước mới trang trí được. HTML là nền tảng, CSS là làm đẹp.

**HTML + CSS → JavaScript**: Phải có nhà và trang trí trước mới lắp hệ thống thông minh. JavaScript sẽ biến trang web "chết" thành "sống".

**Tư tưởng cốt lõi**: Mỗi thứ đảm nhận vai trò riêng, không thể thiếu. Trang chỉ có HTML thì xấu, trang chỉ có HTML+CSS thì không tương tác được, phải có đủ cả ba mới tạo ra được "Web App" như WeChat Web, Taobao.
:::

### 1.3 Thử thực hành

👇 Demo dưới đây cho thấy HTML/CSS/JavaScript phối hợp với nhau như thế nào:

<WebTechTriad />

---

## 2. HTML: Bộ xương của trang web

### 2.1 Tại sao cần HTML?

Trước khi HTML ra đời, nội dung trên Internet chỉ là **văn bản thuần túy**. Giống như đoạn văn bản bạn đang đọc, không có định dạng, không có phân cấp, không có liên kết.

Văn bản thuần túy có vấn đề gì?

- ❌ **Không thể hiện phân cấp**: Không phân biệt được đâu là tiêu đề, đâu là nội dung, đâu là chú thích
- ❌ **Máy không hiểu được**: Công cụ tìm kiếm, trình đọc màn hình (cho người khiếm thị) không thể hiểu nội dung
- ❌ **Không thể tương tác**: Không có liên kết, không có nút bấm, không có ô nhập liệu

**HTML (HyperText Markup Language)** ra đời để giải quyết vấn đề này. Nó dùng "thẻ" (tag) để đánh dấu ý nghĩa của nội dung, giúp trình duyệt biết "đây là cái gì".

### 2.2 Code HTML trông như thế nào?

Đơn vị cơ bản của HTML là "thẻ" (tag). Thẻ được bao bọc bởi dấu ngoặc nhọn `< >`, xuất hiện theo cặp:

```html
<h1>Đây là tiêu đề</h1>
<p>Đây là đoạn văn</p>
<a href="url">Đây là liên kết</a>
```

**Khái niệm then chốt**:

| Khái niệm | Giải thích | Ví dụ |
|-----------|------------|-------|
| **Thẻ (Tag)** | Ký hiệu được bao bọc bởi ngoặc nhọn | `<h1>`, `</h1>` |
| **Phần tử (Element)** | Tổng thể thẻ + nội dung | `<h1>Tiêu đề</h1>` |
| **Thuộc tính (Attribute)** | Thông tin bổ sung trên thẻ | `href="url"`, `class="card"` |
| **Lồng (Nesting)** | Thẻ bên trong thẻ | `<div><p>Văn bản</p></div>` |

### 2.3 Làm sao để đọc hiểu code HTML?

::: tip 🎯 Người mới bắt đầu phải đọc: Phương pháp đọc code

Nhiều người mới thấy một đống `<xxx>` là choáng. Thực ra đọc code HTML có **lối mòn cố định**:

**Bước 1: Tìm "lớp ngoài cùng"**

```html
<div class="card">        ← Đây là container, chứa nội dung bên trong
  <h2>Tiêu đề</h2>
  <p>Văn bản mô tả</p>
</div>
```

**Bước 2: Nhìn tên thẻ đoán ý nghĩa**

| Tên thẻ | Ghi nhớ ngay | Bên trong chứa gì |
|---------|-------------|-------------------|
| `<div>` | Hộp to | Bất kỳ nội dung nào, dùng để nhóm |
| `<span>` | Hộp nhỏ | Đoạn văn bản, dùng để đánh dấu |
| `<p>` | Đoạn văn | Một đoạn văn bản |
| `<h1>`-`<h6>` | Tiêu đề | Văn bản tiêu đề, số càng nhỏ càng quan trọng |
| `<a>` | Neo/liên kết | Nội dung có thể nhấp để chuyển trang |
| `<img>` | Hình ảnh | Không chứa nội dung, dùng src trỏ đến ảnh |
| `<button>` | Nút bấm | Văn bản/biểu tượng có thể nhấp |
| `<input>` | Ô nhập liệu | Không chứa nội dung, nơi người dùng nhập |

**Bước 3: Nhìn class và id**

```html
<div class="user-card" id="user-123">
```

- `class="user-card"` → "Kiểu" của phần tử này, CSS có thể chọn hàng loạt
- `id="user-123"` → "Số chứng minh thư" của phần tử này, định danh duy nhất

**Bước 4: Thụt lề thể hiện phân cấp**

```html
<body>
  <header>           ← Thụt lề thể hiện header là con của body
    <nav>            ← nav là con của header
      <a>Trang chủ</a>    ← a là con của nav
    </nav>
  </header>
</body>
```
:::

### 2.4 Tra cứu nhanh các thẻ HTML thường dùng

**Thẻ cấu trúc** (định nghĩa khung trang):

```html
<h1>Đây là tiêu đề cấp 1</h1>
<h2>Đây là tiêu đề cấp 2</h2>
<p>Đây là một đoạn văn</p>
<div>Đây là container (dùng để nhóm)</div>
<span>Đây là container inline (dùng để đánh dấu văn bản)</span>
```

**Liên kết và media** (làm trang phong phú hơn):

```html
<a href="https://example.com">Nhấp vào đây để chuyển trang</a>
<img src="photo.jpg" alt="Mô tả ảnh" />
<video src="movie.mp4" controls></video>
```

**Form** (thu thập dữ liệu người dùng):

```html
<form>
  <input type="text" placeholder="Vui lòng nhập tên người dùng" />
  <input type="password" placeholder="Vui lòng nhập mật khẩu" />
  <button type="submit">Đăng nhập</button>
</form>
```

**Thẻ ngữ nghĩa** (HTML5 thêm mới, làm ý nghĩa trang rõ ràng hơn):

```html
<header>Đầu trang</header>
<nav>Thanh điều hướng</nav>
<main>Khu vực nội dung chính</main>
<article>Một bài viết</article>
<aside>Thanh bên</aside>
<footer>Chân trang</footer>
```

::: tip 💡 Tại sao nên dùng thẻ ngữ nghĩa?

`<div class="header">` và `<header>` nhìn có vẻ hiệu quả giống nhau, tại sao nên dùng cái sau?

1. **Thân thiện với SEO**: Công cụ tìm kiếm hiểu cấu trúc trang tốt hơn
2. **Khả năng truy cập**: Trình đọc màn hình có thể nhanh chóng xác định các khu vực như "điều hướng", "nội dung chính"
3. **Khả năng đọc code**: Nhìn thấy `<header>` là biết ngay đây là phần đầu trang

**Khi nào dùng div?** Khi không có thẻ ngữ nghĩa nào phù hợp. Ví dụ: một container thuần túy để trang trí.
:::

### 2.5 Làm sao để nhớ hết các thẻ HTML?

::: tip 🎯 Bối rối của người mới

"Thẻ HTML có hơn trăm cái, làm sao nhớ hết?"

**Câu trả lời là: Không cần nhớ hết.** Trong phát triển thực tế, 90% trường hợp chỉ dùng khoảng 20 thẻ.
:::

#### Ghi nhớ theo phân loại công dụng

**Một, Loại cấu trúc trang (vẽ khung)**

| Thẻ | Mẹo ghi nhớ | Công dụng |
|-----|------------|-----------|
| `<header>` | Đầu | Phần đầu của trang hoặc khối |
| `<nav>` | Điều hướng | Khu vực liên kết điều hướng |
| `<main>` | Chính | Nội dung chính của trang (mỗi trang chỉ có một) |
| `<article>` | Bài viết | Khối nội dung độc lập (có thể lấy riêng ra vẫn có ý nghĩa) |
| `<section>` | Chương mục | Nhóm nội dung có chủ đề |
| `<aside>` | Bên cạnh | Thanh bên, nội dung bổ sung |
| `<footer>` | Chân | Phần dưới cùng của trang hoặc khối |

**Phương pháp ghi nhớ**: Hình dung một tờ báo — có đầu báo (header), mục lục (nav), nội dung chính (main/article), chuyên mục (aside), chân trang (footer).

**Hai, Loại đánh dấu nội dung (nói rõ là gì)**

| Thẻ | Mẹo ghi nhớ | Công dụng |
|-----|------------|-----------|
| `<h1>`-`<h6>` | Tiêu đề 1-6 | Phân cấp tiêu đề, h1 to nhất và quan trọng nhất |
| `<p>` | Đoạn văn | Một đoạn văn bản |
| `<ul>`/`<ol>`/`<li>` | Không thứ tự/Có thứ tự/Mục danh sách | Danh sách |
| `<a>` | Neo | Liên kết, dùng để chuyển trang |
| `<img>` | Hình ảnh | Hình ảnh |
| `<video>`/`<audio>` | Video/Âm thanh | Đa phương tiện |
| `<strong>`/`<em>` | Nhấn mạnh/Nhấn mạnh nghiêng | Nhấn mạnh ngữ nghĩa |

**Phương pháp ghi nhớ**: `<a>` là viết tắt của anchor (mỏ neo), tưởng tượng tàu thả neo đậu ở một chỗ, liên kết chính là "đậu" vào một trang khác.

**Ba, Loại tương tác form (thu thập dữ liệu người dùng)**

| Thẻ | Mẹo ghi nhớ | Công dụng |
|-----|------------|-----------|
| `<form>` | Biểu mẫu | Container của form |
| `<input>` | Nhập | Các loại ô nhập liệu (type quyết định kiểu) |
| `<textarea>` | Vùng văn bản | Nhập văn bản nhiều dòng |
| `<select>`/`<option>` | Chọn/Tùy chọn | Chọn thả xuống |
| `<button>` | Nút bấm | Nút bấm |
| `<label>` | Nhãn | Văn bản mô tả cho ô nhập liệu |

**Phương pháp ghi nhớ**: Thuộc tính `type` của `<input>` quyết định nó trông như thế nào:
- `type="text"` → Ô văn bản
- `type="password"` → Ô mật khẩu
- `type="email"` → Ô email
- `type="checkbox"` → Hộp kiểm
- `type="radio"` → Nút radio

**Bốn, Loại container (dùng để nhóm)**

| Thẻ | Mẹo ghi nhớ | Công dụng |
|-----|------------|-----------|
| `<div>` | Hộp to | Container block, chiếm trọn một dòng |
| `<span>` | Hộp nhỏ | Container inline, chỉ chiếm độ rộng nội dung |

**Phương pháp ghi nhớ**: div = division (phân vùng), span = span (nhịp). div dùng để chia khu vực lớn, span dùng để đánh dấu đoạn văn bản.

#### Gặp thẻ không quen thì làm sao?

**Cách 1: Đoán từ tiếng Anh**

Nhiều thẻ là viết tắt của từ tiếng Anh:
- `<abbr>` = abbreviation (viết tắt)
- `<blockquote>` = block quote (trích dẫn khối)
- `<caption>` = caption (tiêu đề/chú thích)
- `<figcaption>` = figure caption (chú thích hình ảnh)

**Cách 2: Tra MDN**

[MDN HTML Element Reference](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element) có giải thích chi tiết tất cả các thẻ.

**Cách 3: Hỏi AI**

> "Thẻ `<dl>` trong HTML có ý nghĩa gì? Khi nào dùng?"

#### Không cần cố học thuộc thẻ

**Quy trình làm việc thực tế là như thế này**:

1. Bạn biết cần dùng một "container" → viết `<div>`
2. Sau đó phát hiện đây là "khu vực điều hướng" → đổi thành `<nav>`
3. Sau đó phát hiện đây là "bài viết độc lập" → đổi thành `<article>`

**Viết ra trước, rồi tối ưu ngữ nghĩa sau**. Thẻ có thể đổi bất cứ lúc nào, không cần phải đắn đo ngay từ đầu.

---

## 3. CSS: Làn da của trang web

### 3.1 Tại sao cần CSS?

Hãy tưởng tượng bạn dọn vào một **căn nhà thô**: có tường, có cửa sổ, có cửa ra vào, ở được, nhưng:

- Tường là xi măng xám, không đẹp
- Ổ cắm và công tắc lắp tùy tiện, không thẩm mỹ
- Không có đồ nội thất, sinh hoạt bất tiện

Trang web chỉ có HTML chính là như vậy: có nội dung, có cấu trúc, nhưng **xấu**, **lộn xộn**, **không thân thiện**.

CSS (Cascading Style Sheets) chính là "đội trang trí" của trang web. Nó không thay đổi cấu trúc HTML (không đập tường, không đổi cửa), chỉ phụ trách:

- 🎨 **Sơn tường**: Thay đổi màu sắc, nền
- 🖼️ **Treo tranh**: Thêm viền, đổ bóng, bo góc
- 🪑 **Kê đồ đạc**: Điều chỉnh bố cục, khoảng cách, căn chỉnh

### 3.2 Code CSS trông như thế nào?

Code CSS có định dạng cố định:

```css
bộ chọn {
  tên thuộc tính: giá trị thuộc tính;
  tên thuộc tính: giá trị thuộc tính;
}
```

**Ba cách viết**:

```html
<!-- Cách 1: Inline style (dùng để test tạm) -->
<div style="color: red;">Văn bản màu đỏ</div>

<!-- Cách 2: Internal style (viết trong file HTML) -->
<style>
  .red-text { color: red; }
</style>

<!-- Cách 3: External style (file CSS độc lập, khuyến nghị) -->
<link rel="stylesheet" href="styles.css" />
```

### 3.3 Làm sao để đọc hiểu code CSS?

::: tip 🎯 Người mới bắt đầu phải đọc: Phương pháp đọc CSS

**Bước 1: Nhìn bộ chọn (selector) — "Trang trí cho ai?"**

| Bộ chọn | Cách viết | Ý nghĩa |
|---------|----------|---------|
| Tag selector | `p { }` | Tất cả thẻ `<p>` |
| Class selector | `.card { }` | Tất cả phần tử có `class="card"` |
| ID selector | `#header { }` | Phần tử duy nhất có `id="header"` |
| Hậu duệ selector | `.card h2 { }` | Tất cả `<h2>` bên trong `.card` |
| Tổ hợp selector | `.card, .box { }` | Chọn cả `.card` hoặc `.box` |

**Bước 2: Nhìn thuộc tính — "Trang trí cái gì?"**

| Phân loại thuộc tính | Thuộc tính phổ biến | Tác dụng |
|---------------------|--------------------|----------|
| Văn bản | `color`, `font-size`, `font-weight` | Màu sắc, cỡ chữ, độ đậm |
| Nền | `background`, `background-color` | Màu nền, ảnh nền |
| Viền | `border`, `border-radius` | Đường viền, bo góc |
| Khoảng cách | `margin`, `padding` | Khoảng cách ngoài, khoảng cách trong |
| Bố cục | `display`, `flex`, `grid` | Cách sắp xếp |

**Bước 3: Nhìn giá trị — "Trang trí thành như thế nào?"**

```css
.card {
  width: 300px;        /* Độ rộng cố định */
  padding: 16px;       /* Khoảng cách trong 16 pixel */
  border-radius: 8px;  /* Bo góc 8 pixel */
  background: #fff;    /* Nền trắng */
}
```

**Đơn vị phổ biến**:
- `px`: pixel, kích thước cố định
- `%`: phần trăm, tương đối so với phần tử cha
- `rem`: tương đối so với cỡ chữ của phần tử gốc
- `vw/vh`: tương đối so với chiều rộng/chiều cao viewport
:::

### 3.4 Độ ưu tiên của selector

Nếu một phần tử bị chọn bởi nhiều selector cùng lúc, ai sẽ quyết định?

```html
<p class="highlight" id="special">Đoạn văn bản này màu gì?</p>
```

```css
p { color: red; }             /* Độ ưu tiên: 1 */
.highlight { color: yellow; } /* Độ ưu tiên: 10 */
#special { color: blue; }     /* Độ ưu tiên: 100 */
```

**Đáp án**: Màu xanh. ID selector có độ ưu tiên cao nhất, class selector thứ hai, tag selector thấp nhất.

**Inline style** (viết trong thuộc tính style) có độ ưu tiên 1000, cao nhất!

### 3.5 Box Model: Tại sao độ rộng không khớp?

::: tip 🎯 Tình huống thực tế

Bạn làm một trang web, yêu cầu ba thẻ card xếp ngang hàng, mỗi card rộng 300px, container tổng rộng 900px. Bạn viết:

```css
.card { width: 300px; }
```

Kết quả: **Thẻ card thứ ba rớt xuống dòng tiếp theo!**

**Tại sao?** Vì `width: 300px` chỉ là độ rộng nội dung, bạn quên tính padding và border. Nếu card có `padding: 20px` và `border: 1px`, độ rộng thực tế là 342px, ba card là 1026px, vượt quá container!
:::

Mỗi phần tử HTML trong CSS được coi là một "hộp", gồm bốn lớp. Hãy tưởng tượng bạn đang **đóng gói hàng**: nội dung là hàng hóa, padding là lớp bong bóng bảo vệ, border là thùng carton, margin là khoảng cách giữa các thùng.

👇 **Thử thực hành**: Kéo thanh trượt điều chỉnh kích thước các lớp, quan sát sự thay đổi của box model:

<CssBoxModel />

**Giải pháp**:

```css
.box {
  box-sizing: border-box;  /* Cho width bao gồm cả padding và border */
  width: 200px;
  padding: 10px;
  border: 5px;
}
```

Như vậy, `width: 200px` chính là độ rộng cuối cùng, padding và border sẽ bị "ép" vào bên trong.

### 3.6 Flexbox: Làm sao để phần tử tự động căn chỉnh?

Flexbox là cách bố cục được dùng nhiều nhất trong CSS hiện đại. Nó giúp phần tử tự động sắp xếp và căn chỉnh, giống như sách trên kệ tự động thẳng hàng.

👇 **Thử thực hành**: Chuyển đổi hướng, cách căn chỉnh, quan sát các hộp sắp xếp như thế nào:

<CssFlexbox />

**Khái niệm cốt lõi của Flex**:

| Thuộc tính | Tác dụng | Giá trị thường dùng |
|-----------|----------|--------------------|
| `display: flex` | Bật bố cục Flex | - |
| `flex-direction` | Hướng trục chính | `row` (ngang), `column` (dọc) |
| `justify-content` | Căn chỉnh trục chính | `flex-start`, `center`, `space-between` |
| `align-items` | Căn chỉnh trục chéo | `stretch`, `center`, `flex-start` |
| `flex-wrap` | Có xuống dòng không | `nowrap`, `wrap` |
| `gap` | Khoảng cách giữa các phần tử | `10px`, `1rem` |

### 3.7 CSS Preprocessor: SCSS/SASS và LESS

::: tip 🎯 Tình huống thực tế

Bạn viết một dự án, file CSS dài 2000 dòng. Sau đó muốn đổi màu chủ đề, bạn phát hiện:

- Màu chủ đạo `#3b82f6` xuất hiện 50 lần
- Đổi một màu phải tìm kiếm và thay thế toàn cục, còn lo bỏ sót
- Selector viết thành `.nav .nav-list .nav-item .nav-link` vừa dài vừa khó bảo trì

**CSS Preprocessor** ra đời để giải quyết những vấn đề này. Nó giúp CSS cũng có thể "lập trình": có biến, có lồng, có thể tái sử dụng code.
:::

#### 3.7.1 CSS Preprocessor là gì?

**Giải thích dễ hiểu**: Preprocessor là một loại "CSS thông minh hơn". Bạn dùng cú pháp mạnh mẽ hơn để viết style, sau đó nó giúp bạn **biên dịch** thành CSS thông thường, trình duyệt có thể nhận diện bình thường.

**Tại sao nên dùng?**

| Vấn đề | CSS thuần | Preprocessor |
|--------|----------|-------------|
| Màu sắc lặp lại | Sao chép khắp nơi | Định nghĩa biến, sửa một chỗ toàn cục có hiệu lực |
| Selector phân cấp quá sâu | Viết thành một chuỗi dài | Cú pháp lồng, phân cấp rõ ràng |
| Cùng một style viết lặp lại | Sao chép dán | Mixin, tái sử dụng như hàm |

#### 3.7.2 So sánh ba Preprocessor chính

| Đặc tính | CSS thuần | **SCSS/SASS** | **LESS** |
|----------|----------|---------------|----------|
| **Cách viết biến** | `--primary` | `$primary` | `@primary` |
| **Cú pháp lồng** | ❌ Không hỗ trợ | ✅ Hỗ trợ | ✅ Hỗ trợ |
| **Mixin (tái sử dụng code)** | ❌ Không hỗ trợ | ✅ `@mixin` | ✅ `.mixin()` |
| **Độ khó học** | Đơn giản | Trung bình | Trung bình |
| **Mức độ phổ biến** | - | ⭐⭐⭐ Phổ biến nhất | ⭐⭐ Khá phổ biến |

**Ghi nhớ đơn giản**:
- **SCSS**: Dùng ký hiệu `$`, Bootstrap 5 dùng, hệ sinh thái tốt nhất
- **LESS**: Dùng ký hiệu `@`, nhất quán với cách viết `@media` của CSS, dễ làm quen

#### 3.7.3 So sánh ví dụ chức năng cốt lõi

##### 1. Biến: Sửa một chỗ, toàn cục có hiệu lực

**Tình huống**: Màu chủ đề `#3b82f6` được dùng ở 20 chỗ, muốn đổi thành màu đỏ.

<Tabs>
<TabItem label="CSS thuần">

```css
/* Phải sửa 20 chỗ, dễ bỏ sót */
.button { background: #3b82f6; }
.link { color: #3b82f6; }
.border { border-color: #3b82f6; }
```

</TabItem>
<TabItem label="SCSS">

```scss
$primary: #3b82f6;

.button { background: $primary; }
.link { color: $primary; }
.border { border-color: $primary; }
/* Chỉ cần sửa $primary một chỗ */
```

</TabItem>
<TabItem label="LESS">

```less
@primary: #3b82f6;

.button { background: @primary; }
.link { color: @primary; }
.border { border-color: @primary; }
/* Chỉ cần sửa @primary một chỗ */
```

</TabItem>
</Tabs>

##### 2. Lồng: Quan hệ phân cấp rõ ràng

**Tình huống**: Trong thanh điều hướng có cấu trúc nhiều lớp.

<Tabs>
<TabItem label="CSS thuần">

```css
/* Viết thành một chuỗi dài, khó thấy quan hệ phân cấp */
.navbar .nav-list .nav-item .nav-link { }
.navbar .nav-list .nav-item .nav-link:hover { }
```

</TabItem>
<TabItem label="SCSS">

```scss
.navbar {
  .nav-list {
    .nav-item {
      .nav-link {
        &:hover { }  /* & đại diện cho selector cha */
      }
    }
  }
}
```

</TabItem>
<TabItem label="LESS">

```less
.navbar {
  .nav-list {
    .nav-item {
      .nav-link {
        &:hover { }
      }
    }
  }
}
```

</TabItem>
</Tabs>

##### 3. Mixin: Tái sử dụng đoạn code

**Tình huống**: Nhiều nút đều cần style "căn giữa".

<Tabs>
<TabItem label="CSS thuần">

```css
/* Sao chép dán 3 lần */
.btn-primary {
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-secondary {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

</TabItem>
<TabItem label="SCSS">

```scss
@mixin center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-primary { @include center; }
.btn-secondary { @include center; }
```

</TabItem>
<TabItem label="LESS">

```less
.center() {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-primary { .center(); }
.btn-secondary { .center(); }
```

</TabItem>
</Tabs>

#### 3.7.4 Làm sao để chọn?

| Tình huống | Khuyến nghị |
|-----------|-------------|
| Mới bắt đầu học, dự án nhỏ | **CSS thuần** (xây nền tảng trước) |
| Dự án dùng Bootstrap 5 | **SCSS** (mã nguồn Bootstrap là SCSS) |
| Nhóm quen với ký hiệu `@` | **LESS** (nhất quán với cách viết `@media` của CSS) |
| Cần logic phức tạp (vòng lặp, điều kiện) | **SCSS** (chức năng mạnh mẽ hơn) |

#### 3.7.5 Sử dụng trong dự án

**Dự án Vite (đơn giản nhất)**:

```bash
# Cài đặt sass
npm install -D sass

# Dùng trực tiếp file .scss hoặc .less
```

::: tip 💡 Lời khuyên cho người mới

1. **Học tốt CSS thuần trước**: Preprocessor chỉ là "cú pháp đường", không hiểu nền tảng CSS sẽ càng dùng càng loạn
2. **Dự án nhỏ không cần ép dùng**: CSS chưa đến 200 dòng, viết trực tiếp CSS đơn giản hơn
3. **Bắt đầu từ SCSS**: Cú pháp gần như giống CSS, chỉ thêm biến `$`
4. **Đừng lồng quá sâu**: Vượt quá 3 lớp sẽ khiến code khó bảo trì
:::

#### 3.7.6 So sánh tổ chức file giữa các tech stack khác nhau

**Cùng một dự án, dùng tech stack khác nhau, cấu trúc file khác nhau như thế nào?**

<Tabs>
<TabItem label="HTML + CSS thuần">

```
my-website/
├── index.html              # Cấu trúc trang
├── about.html
├── css/
│   ├── reset.css           # Style reset
│   ├── layout.css          # Style bố cục
│   ├── components.css      # Style component
│   └── style.css           # Style chính (có thể lên đến hàng nghìn dòng)
├── js/
│   └── main.js
└── images/
    └── logo.png
```

**Đặc điểm**:
- CSS tập trung trong một hoặc vài file
- Sửa style phải chuyển qua lại giữa file HTML và CSS
- Style dễ xung đột với nhau

</TabItem>
<TabItem label="Vue + CSS thuần">

```
src/
├── components/             # Thư mục component
│   ├── Button/
│   │   ├── Button.vue      # Template + Style + Logic
│   │   └── Button.test.js
│   ├── Header/
│   │   └── Header.vue
│   └── Footer/
│       └── Footer.vue
├── views/                  # Thư mục trang
│   ├── Home.vue
│   └── About.vue
├── App.vue                 # Component gốc
└── main.js                 # File entry
```

**Cấu trúc bên trong Button.vue**:
```vue
<template>
  <button class="btn">Nhấp</button>
</template>

<script>
export default { name: 'Button' }
</script>

<style scoped>              <!-- Style scoped chỉ ảnh hưởng component hiện tại -->
.btn { background: #3b82f6; }
</style>
```

</TabItem>
<TabItem label="Vue + SCSS">

```
src/
├── assets/
│   └── styles/
│       ├── _variables.scss     # Biến: màu sắc, khoảng cách, v.v.
│       ├── _mixins.scss        # Mixin: tái sử dụng khối code
│       ├── _functions.scss     # Hàm: tính toán màu sắc, v.v.
│       └── global.scss         # Entry style toàn cục
├── components/
│   ├── Button/
│   │   └── Button.vue          # Trong component dùng @import để nhập biến
│   └── Card/
│       └── Card.vue
├── views/
│   ├── Home.vue
│   └── About.vue
├── App.vue
└── main.js
```

**_variables.scss**:
```scss
$primary: #3b82f6;
$secondary: #64748b;
$spacing-sm: 8px;
$spacing-md: 16px;
```

**Button.vue**:
```vue
<style scoped lang="scss">
@import '@/assets/styles/variables';

.btn {
  background: $primary;      // Dùng biến
  padding: $spacing-md;
}
</style>
```

</TabItem>
<TabItem label="Vue + Tailwind CSS">

```
src/
├── components/
│   ├── Button.vue          # Không cần khối style
│   ├── Card.vue
│   └── Header.vue
├── views/
│   ├── Home.vue
│   └── About.vue
├── App.vue
└── main.js

# File cấu hình (thư mục gốc)
tailwind.config.js          # Cấu hình theme
tailwind.css                # Entry style cơ bản
```

**Button.vue** (không có khối style):
```vue
<template>
  <button class="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
    Nhấp
  </button>
</template>
```

**Đặc điểm**:
- Không có file style riêng
- Tên class chính là style (`bg-blue-500` = nền xanh)
- Cấu hình tập trung trong `tailwind.config.js`

</TabItem>
</Tabs>

**Tóm tắt khác biệt cốt lõi**:

| Tech stack | Vị trí file style | Quản lý theme | Tái sử dụng code |
|-----------|-------------------|--------------|-----------------|
| HTML+CSS thuần | Tập trung trong thư mục `css/` | Tìm kiếm thay thế | Sao chép dán |
| Vue + CSS | Phân tán trong component `.vue` | Tìm kiếm thay thế | Sao chép dán |
| Vue + SCSS | Trong component + file chung `styles/` | Biến quản lý thống nhất | Mixin tái sử dụng |
| Vue + Tailwind | Không có (trong tên class) | `tailwind.config.js` | Tổ hợp tên class |

### 3.8 Làm sao để nhớ hết các thuộc tính CSS?

::: tip 🎯 Bối rối của người mới

"Thuộc tính CSS có mấy trăm cái, làm sao nhớ hết?"

**Câu trả lời là: Phân loại theo công dụng, nhớ thuộc tính cốt lõi, còn lại dùng đến đâu tra đến đó.**
:::

#### Ghi nhớ theo phân loại công dụng

**Một, Loại văn bản và kiểu chữ (quản lý văn bản trông như thế nào)**

| Thuộc tính | Mẹo ghi nhớ | Giá trị thường dùng |
|-----------|------------|--------------------|
| `color` | Màu sắc | `red`, `#fff`, `rgb(0,0,0)` |
| `font-size` | Cỡ chữ | `16px`, `1rem`, `1.5em` |
| `font-weight` | Độ đậm chữ | `normal`, `bold`, `100`-`900` |
| `font-family` | Phông chữ | `"Microsoft YaHei"`, `sans-serif` |
| `line-height` | Chiều cao dòng | `1.5`, `24px` |
| `text-align` | Căn chỉnh văn bản | `left`, `center`, `right` |
| `text-decoration` | Trang trí văn bản | `none`, `underline`, `line-through` |

**Phương pháp ghi nhớ**: Tưởng tượng bạn đang định dạng trong Word — đổi màu, đổi cỡ chữ, in đậm, đổi phông, điều chỉnh khoảng cách dòng, căn chỉnh, gạch chân.

**Hai, Loại box model (quản lý phần tử chiếm bao nhiêu không gian)**

| Thuộc tính | Mẹo ghi nhớ | Giá trị thường dùng |
|-----------|------------|--------------------|
| `width`/`height` | Rộng/Cao | `100px`, `50%`, `100vw` |
| `padding` | Khoảng cách trong | `10px`, `10px 20px` |
| `margin` | Khoảng cách ngoài | `10px`, `auto` (dùng để căn giữa) |
| `border` | Viền | `1px solid #ccc` |
| `border-radius` | Bo góc | `4px`, `50%` (hình tròn) |
| `box-sizing` | Box model | `border-box` (khuyến nghị) |

**Phương pháp ghi nhớ**: padding là khoảng cách "trong" (từ nội dung đến viền), margin là khoảng cách "ngoài" (từ viền đến phần tử khác).

**Quy tắc viết tắt**:
```css
/* Bốn giá trị: trên phải dưới trái (theo chiều kim đồng hồ) */
padding: 10px 20px 15px 25px;

/* Hai giá trị: trên-dưới trái-phải */
padding: 10px 20px;

/* Một giá trị: bốn hướng đều như nhau */
padding: 10px;
```

**Ba, Loại nền và viền (quản lý phần tử trông như thế nào)**

| Thuộc tính | Mẹo ghi nhớ | Giá trị thường dùng |
|-----------|------------|--------------------|
| `background` | Nền | `#fff`, `url(bg.jpg)`, `linear-gradient(...)` |
| `background-color` | Màu nền | `#fff`, `rgba(0,0,0,0.5)` |
| `background-image` | Ảnh nền | `url(photo.jpg)` |
| `background-size` | Kích thước nền | `cover`, `contain`, `100%` |
| `background-position` | Vị trí nền | `center`, `top left` |
| `box-shadow` | Đổ bóng hộp | `0 2px 10px rgba(0,0,0,0.1)` |
| `opacity` | Độ trong suốt | `0`-`1` (0 trong suốt hoàn toàn) |

**Phương pháp ghi nhớ**: `background` là viết tắt, có thể thiết lập nhiều giá trị cùng lúc:
```css
background: #fff url(bg.jpg) no-repeat center/cover;
/*          màu    ảnh       không lặp   vị trí/kích thước */
```

**Bốn, Loại bố cục (quản lý phần tử sắp xếp như thế nào)**

| Thuộc tính | Mẹo ghi nhớ | Giá trị thường dùng |
|-----------|------------|--------------------|
| `display` | Cách hiển thị | `block`, `inline`, `flex`, `grid`, `none` |
| `position` | Định vị | `static`, `relative`, `absolute`, `fixed`, `sticky` |
| `top`/`right`/`bottom`/`left` | Bốn hướng | `10px`, `50%` (dùng kèm với position) |
| `z-index` | Thứ tự lớp | Số càng lớn càng ở trên |
| `float` | Trôi nổi | `left`, `right` (phương pháp cũ, không khuyến nghị) |
| `overflow` | Xử lý tràn | `visible`, `hidden`, `scroll`, `auto` |

**Phương pháp ghi nhớ position**:
- `static`: Mặc định, luồng bình thường
- `relative`: Dịch chuyển tương đối so với vị trí ban đầu của chính nó
- `absolute`: Định vị tương đối so với phần tử tổ tiên có định vị gần nhất
- `fixed`: Định vị tương đối so với viewport (cuộn trang cũng không di chuyển)
- `sticky`: Cuộn đến vị trí nhất định thì cố định

**Năm, Loại Flexbox (thần khí bố cục một chiều)**

| Thuộc tính | Mẹo ghi nhớ | Tác dụng |
|-----------|------------|----------|
| `display: flex` | Bật Flex | Container trở thành Flex container |
| `flex-direction` | Hướng | `row` (ngang), `column` (dọc) |
| `justify-content` | Căn chỉnh trục chính | Phần tử sắp xếp trên trục chính như thế nào |
| `align-items` | Căn chỉnh trục chéo | Phần tử căn chỉnh trên trục chéo như thế nào |
| `flex-wrap` | Xuống dòng | `nowrap`, `wrap` |
| `gap` | Khoảng hở | Khoảng cách giữa các phần tử |
| `flex` | Đàn hồi | Tỉ lệ co giãn của phần tử con |

**Phương pháp ghi nhớ**:
- `justify` = căn đều/căn chỉnh → căn chỉnh trục chính
- `align` = sắp xếp/căn chỉnh → căn chỉnh trục chéo

**Sáu, Loại animation và transition (quản lý phần tử chuyển động như thế nào)**

| Thuộc tính | Mẹo ghi nhớ | Giá trị thường dùng |
|-----------|------------|--------------------|
| `transition` | Chuyển tiếp | `all 0.3s ease` |
| `transform` | Biến đổi | `translate(10px)`, `rotate(45deg)`, `scale(1.1)` |
| `animation` | Hoạt ảnh | `fadeIn 1s ease forwards` |

**Quy tắc viết tắt**:
```css
/* transition: thuộc tính thời lượng hàm easing độ trễ */
transition: all 0.3s ease 0s;

/* transform có thể kết hợp nhiều biến đổi */
transform: translateX(10px) rotate(45deg) scale(1.1);
```

#### Gặp thuộc tính không quen thì làm sao?

**Cách 1: Đoán từ tiếng Anh**

Nhiều thuộc tính là từ hoặc viết tắt tiếng Anh:
- `margin` = lề, khoảng trống
- `padding` = đệm, lót
- `border` = biên giới
- `visibility` = khả năng hiển thị
- `cursor` = con trỏ

**Cách 2: Liên tưởng theo tình huống**

Khi bạn muốn đạt được hiệu ứng nào đó, nghĩ đến "từ khóa":

| Tôi muốn... | Thuộc tính có thể dùng |
|------------|------------------------|
| Đổi màu | `color`, `background-color`, `border-color` |
| Đổi kích thước | `width`, `height`, `font-size` |
| Đổi vị trí | `margin`, `position`, `top/left` |
| Đổi khoảng cách | `padding`, `margin`, `gap` |
| Ẩn phần tử | `display: none`, `visibility: hidden`, `opacity: 0` |
| Căn giữa | `margin: auto`, `text-align: center`, `justify-content: center` |
| Thêm bo góc | `border-radius` |
| Thêm đổ bóng | `box-shadow`, `text-shadow` |
| Thêm hoạt ảnh | `transition`, `animation` |

**Cách 3: Tra MDN hoặc hỏi AI**

[MDN CSS Reference](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference) có giải thích chi tiết tất cả các thuộc tính.

> "Trong CSS làm sao để văn bản chỉ hiển thị một dòng, phần vượt quá hiển thị dấu ba chấm?"

**Cách 4: Dùng DevTools để "học lỏm"**

Thấy hiệu ứng trang web đẹp:
1. Chuột phải → "Kiểm tra"
2. Chọn phần tử, xem panel Styles
3. Sao chép trực tiếp thuộc tính CSS

#### Không cần cố học thuộc thuộc tính

**Quy trình làm việc thực tế là như thế này**:

1. Bạn biết cần "căn giữa" → tìm kiếm "CSS căn giữa"
2. Sao chép code, chỉnh sửa giá trị
3. Dùng nhiều thì tự nhớ

**Lộ trình học khuyến nghị**:

1. **Nắm box model trước**: `width`, `height`, `padding`, `margin`, `border`
2. **Rồi nắm Flexbox**: `display: flex`, `justify-content`, `align-items`
3. **Sau đó nắm định vị**: `position`, `top/left`, `z-index`
4. **Cuối cùng học animation**: `transition`, `transform`, `animation`

Các thuộc tính khác dùng đến đâu tra đến đó, dùng nhiều tự nhiên sẽ nhớ.

---

## 4. JavaScript: Bộ não của trang web

### 4.1 Tại sao cần JavaScript?

Trang web chỉ có HTML + CSS, giống như **ma-nơ-canh trong tủ kính cửa hàng**:

- ✅ Trông rất đẹp (CSS)
- ✅ Cấu trúc rất rõ ràng (HTML)
- ❌ Nhưng bạn nói chuyện với nó, nó không trả lời
- ❌ Bạn nhấn nút, không có gì xảy ra

**JavaScript** biến trang web từ "ma-nơ-canh" thành "người thật":

- ✅ Nhấp nút, sẽ hiện thông báo
- ✅ Nhập văn bản, sẽ kiểm tra định dạng theo thời gian thực
- ✅ Cuộn trang, sẽ tải thêm nội dung
- ✅ Gửi form, sẽ hiển thị "Đang gửi..."

### 4.2 Code JavaScript trông như thế nào?

**Khả năng 1: Ghi nhớ dữ liệu** (Biến)

```javascript
let userName = 'Trương Tam'
let isLoggedIn = true
let cartCount = 5
```

**Khả năng 2: Làm việc lặp lại** (Hàm)

```javascript
function sayHello(name) {
  return 'Xin chào, ' + name + '!'
}

console.log(sayHello('Trương Tam'))  // Kết quả: Xin chào, Trương Tam!
```

**Khả năng 3: Phản hồi sự kiện** (Event Listener)

```javascript
button.addEventListener('click', function() {
  alert('Nút đã được nhấp!')
})
```

**Khả năng 4: Sửa đổi trang** (Thao tác DOM)

```javascript
document.getElementById('title').textContent = 'Tiêu đề mới'
document.getElementById('box').style.background = 'red'
```

### 4.3 Làm sao để đọc hiểu code JavaScript?

::: tip 🎯 Người mới bắt đầu phải đọc: Phương pháp đọc code JS

**Bước 1: Tìm biến — "Đã ghi nhớ cái gì?"**

```javascript
const API_URL = 'https://api.example.com'  // Hằng số, không thay đổi
let count = 0                                // Biến, sẽ thay đổi
const user = { name: 'Trương Tam', age: 25 } // Object, nhiều dữ liệu
const items = ['Táo', 'Chuối', 'Cam']        // Mảng, dữ liệu danh sách
```

**Bước 2: Tìm hàm — "Có thể làm gì?"**

```javascript
// Tên hàm thường đoán được công dụng
function handleClick() { }      // Xử lý nhấp
function fetchData() { }        // Lấy dữ liệu
function validateForm() { }     // Xác thực form
```

**Bước 3: Tìm sự kiện — "Khi nào kích hoạt?"**

```javascript
button.addEventListener('click', handleClick)     // Khi nhấp
input.addEventListener('input', validateForm)     // Khi nhập
window.addEventListener('scroll', loadMore)       // Khi cuộn
```

**Bước 4: Tìm thao tác DOM — "Đã sửa cái gì?"**

```javascript
element.textContent = 'Nội dung mới'     // Sửa văn bản
element.classList.add('active')          // Thêm class style
element.style.display = 'none'           // Ẩn phần tử
parent.appendChild(child)                // Thêm phần tử
```
:::

### 4.4 DOM: JavaScript thao tác trang như thế nào?

Sau khi đọc code HTML, trình duyệt không coi chúng là một đống chuỗi, mà vẽ chúng thành một "cây" trong bộ nhớ:

```
Document (Tài liệu)
    ↓
<html>
    ├─<head>
    │   └─<title>Trang web của tôi</title>
    └─<body>
        ├─<h1>Chào mừng</h1>
        └─<div class="card">
            ├─<img src="photo.jpg">
            └─<p>Một đoạn văn bản</p>
```

Cây này được gọi là **cây DOM**. Mỗi thẻ HTML là một "nút" trên cây này.

**Làm sao để tìm nút?**

```javascript
// Tìm theo ID (nhanh nhất, duy nhất)
const element = document.getElementById('header')

// Tìm theo selector (dùng nhiều nhất)
const element = document.querySelector('.card h2')    // Tìm cái đầu tiên
const elements = document.querySelectorAll('button')  // Tìm tất cả

// Tìm theo quan hệ
element.parentNode           // Tìm nút cha
element.children             // Tìm nút con
element.nextElementSibling   // Tìm anh em kế tiếp
```

**Cảnh báo hiệu năng**: Thao tác DOM rất **đắt**. Mỗi lần sửa DOM, trình duyệt đều phải tính toán lại bố cục, vẽ lại.

```javascript
// ❌ Kém hiệu quả: Lặp 1000 lần, mỗi lần đều thao tác DOM
for (let i = 0; i < 1000; i++) {
  document.body.appendChild(createDiv())
}

// ✅ Hiệu quả: Ghép xong trước, chèn một lần
const fragment = document.createDocumentFragment()
for (let i = 0; i < 1000; i++) {
  fragment.appendChild(createDiv())
}
document.body.appendChild(fragment)
```

Đây cũng chính là lý do các framework hiện đại như **Vue / React** ra đời: chúng chơi "Virtual DOM" trong bộ nhớ, tính toán lượng thay đổi tối thiểu, cuối cùng mới thao tác DOM thật.

👇 **Thử thực hành**: Các phương thức cơ bản của thao tác DOM:

<DomManipulator />

### 4.5 ECMAScript: Sự tiến hóa phiên bản của JavaScript

**ECMAScript** là "sách tiêu chuẩn" của JavaScript. Các nhà sản xuất trình duyệt triển khai JavaScript engine theo tiêu chuẩn này.

#### Tại sao cần có số phiên bản?

JavaScript không phải là bất biến. Mỗi năm đều có thêm tính năng mới, sửa lỗi. Số phiên bản cho bạn biết "trình duyệt này hỗ trợ những tính năng nào".

#### Tổng quan các phiên bản quan trọng

| Phiên bản | Năm | Tính năng cốt lõi | Giải quyết vấn đề gì |
|----------|-----|------------------|---------------------|
| **ES5** | 2009 | Strict mode, `forEach`/`map`/`filter` | Chuẩn hóa ngôn ngữ, thêm phương thức mảng |
| **ES6/ES2015** | 2015 | `let/const`, arrow function, `class`, `Promise`, module | Bản cập nhật lớn nhất, điểm khởi đầu của JS hiện đại |
| **ES2016** | 2016 | `includes()`, `**` lũy thừa | Cập nhật nhỏ |
| **ES2017** | 2017 | `async/await`, `Object.entries()` | Code bất đồng bộ dễ đọc hơn |
| **ES2018** | 2018 | `...` spread operator, `Promise.finally()` | Tăng cường object và bất đồng bộ |
| **ES2020** | 2020 | Optional chaining `?.`, Nullish coalescing `??`, `BigInt` | Truy cập an toàn thuộc tính lồng |
| **ES2021** | 2021 | `replaceAll()`, Logical assignment `??=` | Tăng cường chuỗi và gán |
| **ES2022** | 2022 | Top-level `await`, `.at()` index | Tải module bất đồng bộ tiện hơn |

#### Cú pháp mới ES6+ thường dùng nhất

**1. `let` và `const` thay thế `var`**

```javascript
// ❌ Cách viết cũ: var có hoisting, dễ gây bug
var name = 'Trương Tam'
if (true) {
  var name = 'Lý Tứ'  // Ghi đè name bên ngoài
}
console.log(name)  // 'Lý Tứ', không phải kết quả mong đợi

// ✅ Cách viết mới: let có block scope
let name = 'Trương Tam'
if (true) {
  let name = 'Lý Tứ'  // Chỉ có hiệu lực trong if này
}
console.log(name)  // 'Trương Tam', đúng như mong đợi

// ✅ const: Sau khi khai báo không thể gán lại
const PI = 3.14159
PI = 3  // Báo lỗi! Ngăn sửa đổi ngoài ý muốn
```

**2. Arrow function: Cách viết hàm gọn gàng hơn**

```javascript
// ❌ Cách viết cũ
const add = function(a, b) {
  return a + b
}

// ✅ Cách viết mới
const add = (a, b) => a + b

// This của arrow function ràng buộc với scope ngoài
const obj = {
  name: 'Trương Tam',
  // ❌ Hàm thường: this trỏ đến caller
  oldWay: function() {
    setTimeout(function() {
      console.log(this.name)  // undefined
    }, 100)
  },
  // ✅ Arrow function: this kế thừa từ obj
  newWay: function() {
    setTimeout(() => {
      console.log(this.name)  // 'Trương Tam'
    }, 100)
  }
}
```

**3. Destructuring assignment: Trích xuất dữ liệu từ object/mảng**

```javascript
// Destructuring object
const user = { name: 'Trương Tam', age: 25, city: 'Bắc Kinh' }
const { name, age } = user  // Trích xuất trực tiếp
console.log(name)  // 'Trương Tam'

// Destructuring mảng
const colors = ['red', 'green', 'blue']
const [first, second] = colors
console.log(first)  // 'red'

// Destructuring tham số hàm
function greet({ name, age }) {
  console.log(`${name} năm nay ${age} tuổi`)
}
greet(user)  // 'Trương Tam năm nay 25 tuổi'
```

**4. Template string: Nối chuỗi không còn đau khổ**

```javascript
// ❌ Cách viết cũ: Một đống dấu nháy và dấu cộng
const msg = 'Người dùng ' + name + ' có tuổi là ' + age + ' tuổi'

// ✅ Cách viết mới: Backtick + ${}
const msg = `Người dùng ${name} có tuổi là ${age} tuổi`

// Còn hỗ trợ nhiều dòng
const html = `
  <div class="card">
    <h2>${name}</h2>
    <p>Tuổi: ${age}</p>
  </div>
`
```

**5. `async/await`: Viết code bất đồng bộ như đồng bộ**

```javascript
// ❌ Callback hell
fetchUser(function(user) {
  fetchOrders(user.id, function(orders) {
    fetchDetails(orders[0].id, function(details) {
      console.log(details)
    })
  })
})

// ✅ async/await
async function getUserData() {
  const user = await fetchUser()
  const orders = await fetchOrders(user.id)
  const details = await fetchDetails(orders[0].id)
  console.log(details)
}
```

**6. Optional chaining `?.` và Nullish coalescing `??`**

```javascript
const user = {
  name: 'Trương Tam',
  address: {
    city: 'Bắc Kinh'
  }
}

// ❌ Cách viết cũ: Kiểm tra từng lớp
const street = user && user.address && user.address.street
const streetName = street !== undefined ? street : 'Không rõ'

// ✅ Cách viết mới: Optional chaining + Nullish coalescing
const streetName = user?.address?.street ?? 'Không rõ'
```

::: tip 💡 Làm sao biết trình duyệt hỗ trợ những tính năng nào?

1. **Tra bảng tương thích**: [caniuse.com](https://caniuse.com/) nhập tên tính năng
2. **Dùng build tool**: Babel có thể chuyển cú pháp mới thành code trình duyệt cũ hỗ trợ
3. **Xem đối tượng người dùng**: Nếu chỉ hỗ trợ trình duyệt hiện đại, hầu hết tính năng ES6+ đều dùng được trực tiếp
:::

### 4.6 TypeScript: Thêm ràng buộc kiểu cho JavaScript

#### Tại sao cần TypeScript?

**Tình huống 1: Kiểu tham số hàm không xác định**

```javascript
// JavaScript
function calculateTotal(price, quantity) {
  return price * quantity
}

calculateTotal(100, 5)      // 500 ✅
calculateTotal('100', 5)    // '1005' ❌ Nối chuỗi, không phải phép nhân
calculateTotal(100, '5')    // 500 ✅ Nhưng đây là may mắn
```

JavaScript sẽ không cho bạn biết kiểu tham số sai, đến khi chạy mới phát hiện vấn đề.

**Tình huống 2: Lỗi chính tả thuộc tính object**

```javascript
// JavaScript
const user = {
  name: 'Trương Tam',
  age: 25
}

console.log(user.nmae)  // undefined, sai chính tả nhưng không báo lỗi
```

**TypeScript giải quyết những vấn đề này**:

```typescript
// TypeScript
interface User {
  name: string
  age: number
}

function greet(user: User) {
  console.log(`Xin chào, ${user.name}`)
  console.log(user.nmae)  // ❌ Lỗi khi biên dịch: Thuộc tính 'nmae' không tồn tại
}

greet({ name: 'Trương Tam', age: 25 })        // ✅
greet({ name: 'Trương Tam', age: '25' })      // ❌ Lỗi khi biên dịch: age phải là number
greet({ name: 'Trương Tam' })                 // ❌ Lỗi khi biên dịch: Thiếu age
```

#### Khái niệm cốt lõi của TypeScript

**1. Kiểu cơ bản**

```typescript
let name: string = 'Trương Tam'
let age: number = 25
let isActive: boolean = true
let anyValue: any = 'Có thể là bất kỳ kiểu nào'  // Không khuyến nghị, mất ý nghĩa kiểm tra kiểu
```

**2. Interface: Định nghĩa cấu trúc object**

```typescript
interface Product {
  id: number
  name: string
  price: number
  discount?: number  // Thuộc tính tùy chọn
  readonly createdAt: Date  // Thuộc tính chỉ đọc
}

const product: Product = {
  id: 1,
  name: 'iPhone 15',
  price: 6999,
  createdAt: new Date()
}
```

**3. Type Alias**

```typescript
type ID = string | number  // Union type
type Status = 'pending' | 'approved' | 'rejected'  // Literal type

function updateStatus(id: ID, status: Status) {
  // ...
}

updateStatus(1, 'approved')      // ✅
updateStatus('abc', 'pending')   // ✅
updateStatus(1, 'processing')    // ❌ 'processing' không phải Status hợp lệ
```

**4. Generic: Kiểu có thể tái sử dụng**

```typescript
// Không dùng generic: Mỗi kiểu viết một lần
function getFirstNumber(arr: number[]): number {
  return arr[0]
}
function getFirstString(arr: string[]): string {
  return arr[0]
}

// Dùng generic: Một hàm xử lý tất cả
function getFirst<T>(arr: T[]): T {
  return arr[0]
}

getFirst([1, 2, 3])        // Trả về number
getFirst(['a', 'b', 'c'])  // Trả về string
```

#### So sánh TypeScript vs JavaScript

| Đặc tính | JavaScript | TypeScript |
|----------|-----------|------------|
| Kiểm tra kiểu | Khi chạy mới phát hiện lỗi | Khi biên dịch đã phát hiện lỗi |
| Hỗ trợ IDE | Gợi ý cơ bản | Tự động hoàn thành thông minh, refactor, nhảy đến định nghĩa |
| Đường cong học tập | Đơn giản | Cần học hệ thống kiểu |
| Tình huống phù hợp | Dự án nhỏ, prototype | Dự án lớn, làm việc nhóm |
| Cách chạy | Trình duyệt chạy trực tiếp | Cần biên dịch thành JavaScript |

#### TypeScript trong phát triển thực tế

```typescript
// Định nghĩa kiểu response API
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

interface User {
  id: number
  name: string
  email: string
}

// API request có kiểu
async function fetchUser(id: number): Promise<ApiResponse<User>> {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

// Khi sử dụng IDE sẽ gợi ý tất cả thuộc tính
fetchUser(1).then(res => {
  console.log(res.data.name)   // ✅ IDE tự động hoàn thành
  console.log(res.data.nmae)   // ❌ Lỗi khi biên dịch
})
```

::: tip 💡 Lời khuyên cho người mới

1. **Học tốt JavaScript trước**: TypeScript là superset của JS, không hiểu JS mà học TS sẽ rất đau khổ
2. **Dự án nhỏ không cần ép dùng TS**: Định nghĩa kiểu sẽ tăng lượng code, dự án đơn giản lại trở nên phức tạp
3. **Bắt đầu chuyển tiếp từ JSDoc**: Viết comment `/** @type {User} */` trong file JS, trải nghiệm gợi ý kiểu
4. **Dùng `any` là thỏa hiệp, không phải giải pháp**: Gặp vấn đề kiểu hãy thử giải quyết trước, đừng dùng `any` ngay
:::

### 4.7 Chuỗi công cụ phát triển JavaScript hiện đại

::: tip 🎯 Tại sao cần chuỗi công cụ?

Trình duyệt chỉ hiểu HTML/CSS/JS. Nhưng trong phát triển hiện đại, chúng ta dùng:

- **TypeScript**: Trình duyệt không hiểu, cần biên dịch thành JS
- **SCSS/Less**: Trình duyệt không hiểu, cần biên dịch thành CSS
- **Module**: `import/export` cần đóng gói thành một file
- **Cú pháp mới**: ES6+ cần chuyển đổi thành code trình duyệt cũ hỗ trợ

Chuỗi công cụ chính là thứ chuyển đổi "code dùng khi phát triển" thành "code trình duyệt có thể chạy".
:::

**Công cụ cốt lõi**:

| Công cụ | Tác dụng | Ẩn dụ |
|--------|---------|-------|
| **Node.js** | Môi trường chạy JavaScript | Cho JS có thể chạy ngoài trình duyệt |
| **npm/yarn/pnpm** | Trình quản lý gói | Tải thư viện code người khác viết sẵn |
| **Vite/Webpack** | Build tool | Đóng gói mã nguồn thành code trình duyệt chạy được |
| **Babel** | Trình biên dịch | Chuyển cú pháp mới thành cú pháp cũ |
| **ESLint** | Kiểm tra code | Phát hiện vấn đề code và không nhất quán phong cách |

**Một quy trình phát triển điển hình**:

```bash
# 1. Khởi tạo dự án
npm create vite@latest my-app -- --template vue-ts

# 2. Cài đặt dependencies
cd my-app
npm install

# 3. Chế độ phát triển (hot reload)
npm run dev

# 4. Build phiên bản production
npm run build
```

---

## 5. Mối quan hệ phối hợp của ba thứ

### 5.1 So sánh phân công

| Vai trò | Phụ trách gì | Không làm gì | Ví dụ điển hình |
|---------|-------------|-------------|----------------|
| **HTML** | Định nghĩa cấu trúc và ngữ nghĩa | Không phụ trách style/tương tác | `<section><h1>Tiêu đề</h1></section>` |
| **CSS** | Kiểm soát ngoại hình và bố cục | Không phụ trách logic/dữ liệu | `.card { background: white; }` |
| **JavaScript** | Xử lý tương tác và logic | Không phụ trách định nghĩa cấu trúc | `button.onclick = () => alert()` |

### 5.2 Một ví dụ phối hợp hoàn chỉnh

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* CSS: Làm card đẹp */
    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      max-width: 300px;
    }
    .card button {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <!-- HTML: Định nghĩa cấu trúc card -->
  <div class="card">
    <h2 id="title">Nhấp nút</h2>
    <button id="btn">Nhấp tôi</button>
  </div>

  <script>
    // JavaScript: Làm nút có thể nhấp
    const btn = document.getElementById('btn')
    const title = document.getElementById('title')

    btn.addEventListener('click', function() {
      title.textContent = 'Đã nhấp!'
      alert('Tiêu đề đã thay đổi')
    })
  </script>
</body>
</html>
```

---

## 6. Gặp code không quen thì làm sao?

### 6.1 Hỏi AI

> "Thẻ `<aside>` trong HTML có ý nghĩa gì? Khi nào dùng?"
>
> "`position: sticky` trong CSS có hiệu ứng gì?"

### 6.2 Tra MDN

[MDN Web Docs](https://developer.mozilla.org/) là tài liệu công nghệ Web uy tín nhất. Gặp thẻ, thuộc tính, phương thức không quen, tìm kiếm trực tiếp là được.

### 6.3 Công cụ Developer Tools của trình duyệt

1. Chuột phải vào phần tử trang → "Kiểm tra"
2. Trong panel **Elements** xem cấu trúc HTML
3. Trong panel **Styles** xem style CSS
4. Trong panel **Console** có thể thực thi code JS

### 6.4 Tra cứu nhanh thuộc tính CSS phổ biến

| Thấy cái này | Nó làm gì |
|-------------|----------|
| `display: flex` | Bật bố cục flex |
| `position: absolute` | Định vị tuyệt đối |
| `z-index: 100` | Thứ tự lớp, số lớn ở trên |
| `overflow: hidden` | Phần vượt quá bị ẩn |
| `cursor: pointer` | Chuột biến thành hình bàn tay |
| `transition: all 0.3s` | Hiệu ứng chuyển tiếp |
| `box-sizing: border-box` | Cho width bao gồm padding và border |

---

## 7. Bảng tra cứu nhanh thuật ngữ

| Thuật ngữ | Tiếng Anh | Giải thích dễ hiểu |
|----------|----------|-------------------|
| **HTML** | HyperText Markup Language | Ngôn ngữ đánh dấu siêu văn bản, dùng thẻ mô tả cấu trúc trang web |
| **CSS** | Cascading Style Sheets | Bảng định kiểu xếp tầng, kiểm soát màu sắc, bố cục, hoạt ảnh |
| **JavaScript** | JavaScript | Ngôn ngữ lập trình của trang web, phụ trách tương tác và logic |
| **DOM** | Document Object Model | Mô hình đối tượng tài liệu, dùng cây đối tượng biểu diễn trang |
| **Flexbox** | Flexible Box Layout | Một giải pháp bố cục một chiều, dễ căn chỉnh và phân bố |
| **Box Model** | CSS Box Model | Phần tử từ nội dung đến khoảng cách ngoài là các lớp hộp |
| **SCSS** | Sassy CSS | CSS Preprocessor, hỗ trợ biến, lồng, mixin |
| **TypeScript** | TypeScript | Superset của JavaScript, thêm hệ thống kiểu |
| **ES6** | ECMAScript 2015 | Một phiên bản quan trọng của JavaScript, thêm nhiều cú pháp mới |
| **Ngữ nghĩa** | Semantic HTML | Dùng thẻ có ý nghĩa (như header) thay vì div |
| **Responsive** | Responsive Design | Thiết kế trang web tự động thích ứng với các kích thước màn hình khác nhau |

---

## Tổng kết

Bây giờ bạn đã biết: **HTML định nghĩa khung xương, CSS phụ trách ngoại hình, JavaScript trao linh hồn**.

Ba thứ này là nền tảng của phát triển Web. Hiểu được chúng, bạn có thể:

- Đọc hiểu mã nguồn của bất kỳ trang web nào (chuột phải → "Xem mã nguồn trang")
- Sửa đổi trang web của người khác (trình duyệt DevTools → Elements)
- Bắt đầu học các framework frontend (Vue/React), chúng đều dựa trên ba thứ này

**Gợi ý bước tiếp theo**:

- Nếu bạn muốn nhanh chóng tạo ra trang web, có thể học framework **Vue** hoặc **React**
- Nếu bạn muốn hiểu sâu CSS, có thể học bố cục **Flexbox** và **Grid**
- Nếu bạn muốn nâng cao chất lượng code, có thể học **TypeScript**
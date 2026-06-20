# Hướng Dẫn Chuyên Sâu Về Frontend Framework

::: tip Lời Mở Đầu
Bạn đã học HTML, CSS và JavaScript cơ bản, có thể tạo ra những trang web đơn giản. Nhưng khi chức năng trang web ngày càng phức tạp, bạn có thể nhận ra: viết code bằng JavaScript thuần trở nên khó bảo trì, sửa một chỗ phải động đến nhiều nơi, làm việc nhóm thường xuyên xung đột.

Đây chính là lý do chúng ta cần frontend framework — nó giúp code có tổ chức hơn, dễ bảo trì hơn, phát triển hiệu quả hơn. Trong vibecoding, AI sẽ viết phần lớn code cho bạn. Nhưng ít nhất bạn cần đọc hiểu được phong cách code của các framework khác nhau, biết ưu nhược điểm của chúng, thì AI mới có thể giúp bạn chọn tech stack phù hợp nhất.

Sau khi đọc xong bài này, bạn sẽ:
- Hiểu tại sao công nghệ frontend không ngừng phát triển
- Biết Vue, React, Svelte, Angular có đặc điểm gì
- Nắm được các khái niệm cốt lõi như "data-driven", "component hóa"
- Có thể chọn framework phù hợp với dự án
:::

**Bài viết này sẽ dẫn bạn học những gì?**

| Chương | Nội Dung | Học Xong Làm Được Gì |
|---------|----------|----------------------|
| **Chương 1** | Tại sao cần quan tâm đến sự phát triển của frontend | Hiểu sự phát triển công nghệ là để giải quyết vấn đề gì |
| **Chương 2** | Thời đại web tĩnh | Hiểu cách phát triển web thời kỳ đầu |
| **Chương 3** | Thời đại jQuery | Hiểu điểm đau của lập trình "imperative" |
| **Chương 4** | Thời đại Vue/React | Nắm vững tư tưởng "declarative" và "data-driven" |
| **Chương 5** | Chiến lược render | Biết sự khác biệt và tình huống áp dụng của CSR, SSR, SSG |
| **Chương 6** | Công cụ engineering | Hiểu vai trò của các công cụ build như Webpack, Vite |

Mỗi chương đều bắt đầu từ "tại sao cần công nghệ này", giúp bạn hiểu logic đằng sau sự phát triển công nghệ.

---

## 1. Tại Sao Cần Quan Tâm Đến Lịch Sử Phát Triển Frontend?

::: tip 🤔 Câu Hỏi Cốt Lõi
**Tại sao trang web ngày càng phức tạp? Tại sao công nghệ frontend không ngừng phát triển?** Câu hỏi này sẽ dẫn bạn đi qua con đường phát triển công nghệ từ trang web đơn giản đến ứng dụng Web hiện đại.
:::

### 1.1 Từ "Poster Điện Tử" Đến "Ứng Dụng Desktop"

Hãy tưởng tượng một tấm **poster** bạn thấy trên phố:

- ✅ Có nội dung (chữ, hình ảnh)
- ✅ Có thiết kế (màu sắc, bố cục)
- ❌ Nhưng bạn nói chuyện với nó, nó không trả lời
- ❌ Bạn click vào đâu đó, không có gì xảy ra

**Trang web đầu tiên** chính là "poster điện tử" như vậy: chỉ có thể xem, không thể thay đổi, nội dung cố định.

**Trang web hiện đại** hoàn toàn khác. Chúng giống như **ứng dụng desktop** (VS Code, Figma):

- ✅ Có thể chỉnh sửa tài liệu, vẽ, chơi game
- ✅ Phản hồi theo thời gian thực với mọi thao tác của bạn
- ✅ Thậm chí có thể làm việc offline

**Nguyên nhân cốt lõi của sự thay đổi này: chức năng trang web ngày càng phức tạp, cần công nghệ và cách phát triển hiệu quả hơn.**

### 1.2 Một Phép So Sánh Trong Cuộc Sống: Xây Nhà

Sự phát triển của công nghệ frontend giống như sự tiến hóa của cách xây nhà:

| Thời Đại | 🏠 Phép So Sánh Xây Nhà | Đặc Điểm Thực Tế | Ưu Nhược Điểm |
|----------|------------------------|------------------|---------------|
| **2000s** | **Dán poster** | Web tĩnh, viết HTML là xong | ✅ Đơn giản ❌ Không thể tương tác |
| **2010s** | **Thuê thợ thủ công sửa sang** | Thời đại jQuery, thao tác thủ công từng phần tử | ✅ Có thể tương tác ❌ Code lộn xộn, khó bảo trì |
| **2020s** | **Xây nhà bằng Lego** | Thời đại Vue/React, phát triển theo component | ✅ Hiệu quả, dễ bảo trì ❌ Đường cong học tập |

::: tip 💡 Bạn thấy gì từ bảng trên?

**Giai đoạn 1 → Giai đoạn 2**: Từ "không thể động" đến "có thể động". Đây là bước nhảy vọt về chất — trang web bắt đầu có tương tác, nhưng cái giá là code trở nên hỗn loạn.

**Giai đoạn 2 → Giai đoạn 3**: Từ "dùng được" đến "dùng tốt". Component hóa khiến code có thể tái sử dụng như các khối Lego, nâng cao đáng kể hiệu quả phát triển.

**Tư tưởng cốt lõi**: Sự phát triển công nghệ không phải "mới cho có mới", mà là để giải quyết điểm đau của giai đoạn trước.
:::

---

---

## 2. Giai Đoạn Thứ Nhất: Web Tĩnh và "Cắt Ảnh" (2000s)

::: tip 🤔 Câu Hỏi Cốt Lõi
**Trang web đầu tiên trông như thế nào? Tại sao lúc đó không cần framework?** Hiểu được giới hạn của giai đoạn này, mới hiểu được sự cần thiết của sự phát triển công nghệ sau này.
:::

<FrontendEvolutionDemo />

### 2.1 Thời đại này như thế nào?

**Cách phát triển**:

- Viết vài file HTML
- Nhúng một ít CSS và JavaScript
- Kéo thẳng file vào trình duyệt là xem được hiệu quả
- Upload thư mục lên server là hoàn tất triển khai

**Đặc điểm**:

- ✅ **Ưu điểm**: Đơn giản trực tiếp, không có chi phí học tập, viết xong là chạy được
- ❌ **Nhược điểm**: Không thể thực hiện tương tác phức tạp, code nhiều lên là rối

::: details Xem cấu trúc dự án thời đó

```
project/
├── index.html
├── login.html
├── css/
│   ├── bootstrap.css
│   └── custom.css
├── js/
│   ├── jquery.js
│   └── app.js
└── images/
```

**Vấn đề gặp phải**:

1. **Ô nhiễm biến toàn cục**: Tất cả biến đều trong global namespace, dễ ghi đè lẫn nhau
2. **Quản lý dependency hỗn loạn**: Phải load file JS theo đúng thứ tự, nếu không sẽ báo lỗi
3. **Code khó tái sử dụng**: Muốn dùng lại chức năng nào đó, chỉ có thể copy-paste
:::

### 2.2 "Cắt Ảnh" Là Gì?

Có thể bạn đã nghe đến từ "cắt ảnh". Đó là công việc chính của frontend thời kỳ đầu:

**Cắt ảnh là gì?**

Designer dùng Photoshop thiết kế trang → Frontend cắt thiết kế thành các ảnh nhỏ → Dùng HTML ghép ảnh thành trang

**Tại sao chậm như vậy?**

Mỗi tấm ảnh nhỏ trên trang web, trình duyệt đều phải gửi một **network request**. Request càng nhiều, load càng chậm.

👇 **Thử ngay**: Quan sát ảnh hưởng của image request đến hiệu suất tải

<SliceRequestDemo />

::: tip 💡 Sprite (Ảnh Tổng Hợp)

Để giảm số lượng request, kỹ thuật "sprite" ra đời: ghép nhiều ảnh nhỏ thành một ảnh lớn.

Ưu điểm là số request giảm, nhược điểm là tạo và bảo trì đều rất phiền phức.

Bài học của giai đoạn này: **quá nhiều request là kẻ thù lớn của hiệu suất**.
:::

---

---

## 3. Giai Đoạn Thứ Hai: Thời Đại jQuery - "Khuân Vác Thủ Công" (2010s)

::: tip 🤔 Câu Hỏi Cốt Lõi
**Tại sao cần jQuery? Nó giải quyết vấn đề gì, và mang đến vấn đề mới gì?** Hiểu được giới hạn của jQuery, mới hiểu được giá trị của Vue/React.
:::

### 3.1 Tại Sao Cần jQuery?

Khi trang web trở nên phức tạp, vấn đề của JavaScript thuần lộ ra:

- ❌ **API rườm rà**: Thao tác đơn giản cũng phải viết rất nhiều code
- ❌ **Tương thích trình duyệt**: API của các trình duyệt khác nhau, phải viết nhiều code tương thích
- ❌ **Selector yếu**: Tìm phần tử rất phiền phức

**jQuery** ra đời. Nó khiến JavaScript trở nên đơn giản:

```javascript
// JavaScript thuần (rườm rà)
const element = document.getElementById('title')

// jQuery (gọn gàng)
const element = $('#title')
```

### 3.2 Tư Duy Của jQuery: Tự Tay Sửa Trang

Tư duy cốt lõi của jQuery là **imperative**: bạn nói với trình duyệt "làm thế nào".

```javascript
// Tìm phần tử tiêu đề
$('#title').text('Tiêu đề mới')

// Tìm nút và vô hiệu hóa
$('#submit-btn').attr('disabled', true)

// Tìm danh sách và thêm một mục
$('ul').append('<li>Mục mới</li>')
```

**Vấn đề**: Bạn cần nhớ trên trang có những phần tử nào, mỗi lần dữ liệu thay đổi đều phải cập nhật thủ công tất cả phần tử liên quan.

👇 **Thử ngay**: So sánh jQuery và cách tiếp cận data-driven

<JQueryVsStateDemo />

::: warning ⚠️ Điểm đau của jQuery

Hãy tưởng tượng bạn đang làm một giỏ hàng:

```javascript
// Người dùng click "thêm vào giỏ hàng"
function addToCart() {
  cartCount++ // Dữ liệu thay đổi

  // Bạn phải cập nhật thủ công tất cả nơi liên quan
  $('#cart-count').text(cartCount) // Chấm đỏ góc trên bên phải
  $('#cart-page-count').text(cartCount) // Trang giỏ hàng
  $('#checkout-price').text(calculatePrice()) // Nút thanh toán

  // Nếu bỏ sót một chỗ, trang sẽ không đồng nhất!
}
```

**Đây chính là cái giá của "khuân vác thủ công"**: dễ sai sót, khó bảo trì.
:::

### 3.3 Sự Phổ Biến Của Mobile: Sự Xuất Hiện Của Responsive Design

Giai đoạn này còn có một thay đổi quan trọng: **điện thoại và máy tính bảng bắt đầu phổ biến**.

Trang web phải thích ứng với các màn hình khác nhau. Điều này cần **responsive layout**: cùng một bộ HTML/CSS, tự động thay đổi bố cục theo chiều rộng màn hình.

**Cốt lõi của responsive layout: Media Query**

```css
/* Màn hình máy tính (lớn hơn 640px) */
@media (min-width: 640px) {
  .container {
    display: flex;
  }
}

/* Màn hình điện thoại (nhỏ hơn 640px) */
@media (max-width: 640px) {
  .container {
    display: block;
  }
}
```

👇 **Thử ngay**: Điều chỉnh chiều rộng trình duyệt, quan sát hiệu ứng của responsive layout

<ResponsiveGridDemo />

::: tip 💡 Responsive giống như "khung ảnh thông minh"

Hãy tưởng tượng bạn xem cùng một bức ảnh ở các phòng khác nhau:

- Ở **phòng khách lớn** (màn hình máy tính), ảnh có thể để to hơn, bên cạnh còn đặt được đồ trang trí khác
- Ở **phòng ngủ nhỏ** (màn hình điện thoại), ảnh cần thu nhỏ lại, đồ trang trí khác phải cất đi

**Responsive layout** chính là "khung ảnh thông minh", nó tự động điều chỉnh cách hiển thị theo kích thước phòng.
:::

---

---

## 4. Giai Đoạn Thứ Ba: Từ "Khuân Vác Thủ Công" Đến "Data-Driven" (Vue/React)

::: tip 🤔 Câu Hỏi Cốt Lõi
**Tại sao cần Vue/React? Sự khác biệt bản chất giữa chúng và jQuery là gì?** Hiểu "declarative" và "data-driven" là chìa khóa để nắm vững frontend framework hiện đại.
:::

### 4.1 Tại Sao Cần Framework Mới?

Vấn đề của thời đại jQuery tích tụ đến một mức độ nhất định:

- **Code nhiều lên là rối**: Đâu đâu cũng là thao tác DOM, khó bảo trì
- **Dễ sinh bug**: Bỏ sót cập nhật một chỗ, trang không đồng nhất
- **Khó làm việc nhóm**: Nhiều người cùng sửa một file, dễ xung đột

**Tư duy cốt lõi của Vue / React**: **chỉ thay đổi dữ liệu, trang tự động cập nhật**.

### 4.2 Tư Duy Của Vue/React: Declarative UI

**jQuery (imperative)**:

```javascript
// Bạn phải nói với trình duyệt từng bước làm thế nào
$('#title').text('Tiêu đề mới')
$('#title').css('color', 'red')
$('#title').show()
```

**Vue (declarative)**:

```javascript
// Bạn chỉ cần nói với trình duyệt "muốn hiển thị gì"
data() {
  return {
    title: "Tiêu đề mới",
    color: "red",
    visible: true
  }
}
```

👇 **Thử ngay**: So sánh sự khác biệt giữa imperative và declarative

<ImperativeVsDeclarativeDemo />

::: tip 💡 Imperative vs Declarative

Giống như vẽ một bức tranh:

- **Imperative**: Bạn nói với họa sĩ "cầm bút lên, chấm màu đỏ, vẽ một vòng tròn ở tọa độ (10,10)"
- **Declarative**: Bạn đưa thẳng cho họa sĩ một tấm ảnh, "vẽ cho tôi giống như này"

Vue/React chính là "declarative": bạn mô tả "trang trông như thế nào", framework lo "làm sao vẽ nó ra".
:::

### 4.3 Component Hóa: Viết Trang Như Lắp Lego

**Vue / React** có tính năng mạnh nhất là **component hóa**: chia trang thành từng "khối Lego" độc lập.

Hãy tưởng tượng bạn đang lắp Lego:

- Bạn không cần "tự đẽo từng khối từ đầu" (viết HTML/CSS từ đầu)
- Bạn chỉ cần "ghép các khối lại theo hướng dẫn" (tổ hợp các component)
- Mỗi khối đều **độc lập**, bạn có thể **tái sử dụng** trong các bộ khác nhau

**Lợi ích của component**:

- **Tái sử dụng**: Viết một component "thẻ sản phẩm", có thể dùng 100 lần
- **Đóng gói**: Trạng thái bên trong component không ảnh hưởng đến component khác
- **Bảo trì**: Sửa một component, tất cả nơi dùng nó đều được cập nhật

::: info 💡 Mẹo nhận diện
- Thấy `<ComponentName />` → Đây là một component
- Thấy `import xxx from './xxx.vue'` → Đang import một component
- Thấy `props: {...}` → Tham số component nhận vào
- Thấy `emit('xxx')` → Component gửi sự kiện lên component cha
:::

### 4.4 SPA: Sự Ra Đời Của Single-Page Application

**Thời đại Vue / React** còn có một thay đổi quan trọng: **từ MPA sang SPA**.

**MPA (Multi-Page Application)**:

- Click một link → Refresh toàn trang → Hiển thị trang mới
- Giống như **lật sách**: mỗi lần lật trang đều phải gấp sách cũ lại, ra kệ lấy sách mới

**SPA (Single-Page Application)**:

- Click một link → Chỉ refresh vùng nội dung → Trang không refresh
- Giống như **đổi chương trong cùng một cuốn sách**: chỉ xóa nội dung cũ, viết nội dung mới

👇 **Thử ngay**: Trải nghiệm sự khác biệt giữa MPA và SPA

<RoutingModeDemo />

**Ưu điểm của SPA**:

- ✅ **Trải nghiệm mượt mà**: Chuyển trang nhanh
- ✅ **Quản lý state tốt**: Nội dung đã nhập, vị trí cuộn đều được giữ nguyên
- ❌ **First screen có thể chậm**: Cần tải JavaScript trước
- ❌ **SEO cần xử lý thêm**: Công cụ tìm kiếm có thể không crawl được nội dung (cần SSR/SSG)

---

---

## 5. Chiến Lược Render: Từ CSR Đến SSR/SSG

::: tip 🤔 Câu Hỏi Cốt Lõi
**Trang được tạo ra ở server hay ở trình duyệt?** Các chiến lược render khác nhau có ưu nhược điểm riêng, chọn chiến lược phù hợp rất quan trọng với hiệu suất và SEO.
:::

**CSR (Client-Side Rendering) Render Phía Client**:

- Trình duyệt tải JavaScript → Thực thi code → Tạo trang
- Ưu điểm: Tương tác mượt mà, áp lực server thấp
- Nhược điểm: First screen chậm, không tốt cho SEO

**SSR (Server-Side Rendering) Render Phía Server**:

- Server tạo HTML → Gửi cho trình duyệt → Trình duyệt hiển thị trực tiếp
- Ưu điểm: First screen nhanh, tốt cho SEO
- Nhược điểm: Áp lực server lớn, triển khai phức tạp

**SSG (Static Site Generation) Sinh Trang Tĩnh**:

- Tạo HTML cho tất cả trang trong lúc build
- Ưu điểm: Cực nhanh, hoàn toàn tĩnh, thân thiện với CDN
- Nhược điểm: Không phù hợp nội dung động

👇 **Thử ngay**: So sánh đặc điểm của các chiến lược render khác nhau

<RenderingStrategyDemo />

::: info 💡 Làm sao để chọn?
- **Website nội dung** (blog, tài liệu): Ưu tiên SSG
- **Website động cần SEO** (thương mại điện tử, tin tức): Dùng SSR
- **Hệ thống quản trị backend**: Dùng CSR
- **Nhu cầu hỗn hợp**: Cân nhắc render hỗn hợp của Nuxt/Next.js
:::

---

## 6. Giai Đoạn Thứ Tư: Engineering và Công Cụ Build (2015s-2020s)

::: tip 🤔 Câu Hỏi Cốt Lõi
**Tại sao frontend cần "engineering"? Công cụ build thực sự đang làm gì?** Hiểu engineering mới có thể hiểu được quy trình làm việc của dự án frontend hiện đại.
:::

### 6.1 Tại Sao Cần "Engineering"?

Dự án frontend ngày càng lớn, không thể chỉ dựa vào "nhúng script thủ công".

**Engineering** là dùng công cụ và quy chuẩn, để phát triển hiệu quả hơn, code đáng tin cậy hơn, làm việc nhóm trôi chảy hơn.

::: tip 💡 Engineering = Từ "xưởng thủ công" đến "nhà máy hiện đại"

Hãy tưởng tượng bạn nấu ăn ở nhà vs mở nhà hàng:

- **Nấu ăn ở nhà**: Muốn ăn gì nấu nấy, rất tự do
- **Mở nhà hàng**: Cần công thức chuẩn hóa, quy trình thao tác quy phạm, nguyên liệu mua vào thống nhất

Phát triển frontend cũng vậy:

- **Dự án nhỏ**: Viết sao cũng được
- **Dự án lớn**: Cần tiêu chuẩn code thống nhất, công cụ tự động hóa, quy trình chuẩn hóa
:::

### 6.2 Công Cụ Build: Webpack → Vite

**Webpack** (truyền thống):

- Cách làm việc: **đóng gói trước, phục vụ sau**
- Khi khởi động: Đóng gói tất cả code → Khởi động server
- Vấn đề: **chậm**. Dự án càng lớn, khởi động càng chậm (có thể phải đợi 30 giây)

**Vite** (hiện đại):

- Cách làm việc: **biên dịch theo nhu cầu**
- Khi khởi động: Không đóng gói, khởi động thẳng server
- Trình duyệt yêu cầu file nào, biên dịch real-time file đó
- Ưu thế: **nhanh**. Thường khởi động trong 1 giây

| So Sánh | Webpack | Vite | Cải Thiện |
|---------|---------|------|-----------|
| Cold start | 30s+ | <1s | **Nhanh 30 lần** |
| HMR | 3-5s | <100ms | **Nhanh 30 lần** |
| File cấu hình | Vài trăm dòng | Vài chục dòng | **Đơn giản hóa đáng kể** |

::: tip 💡 Tại sao Vite nhanh như vậy?

**Webpack** giống như **dọn cả nhà đi chuyển**: đóng gói tất cả đồ đạc trước, rồi mới ra khỏi cửa.

**Vite** giống như **du lịch hành lý nhẹ**: chỉ mang đồ thiết yếu, cần gì mua nấy.

Trong môi trường phát triển, phần lớn thời gian bạn chỉ cần sửa vài file, Vite chỉ biên dịch vài file đó, đương nhiên là nhanh.
:::

---

---

## 7. So Sánh Các Framework Chính

::: tip 🤔 Câu Hỏi Cốt Lõi
**Vue, React, Svelte, Angular có đặc điểm gì? Làm sao chọn framework phù hợp với mình?** Hiểu triết lý thiết kế và tình huống sử dụng của chúng, mới có thể đưa ra lựa chọn sáng suốt.
:::

### 7.1 So Sánh Bốn Framework Lớn

| Đặc Tính | Vue | React | Svelte | Angular |
|----------|-----|-------|--------|---------|
| **Triết lý thiết kế** | Progressive framework | UI library | Compile-time framework | Nền tảng đầy đủ |
| **Đường cong học tập** | ⭐⭐ Đơn giản | ⭐⭐⭐ Trung bình | ⭐⭐ Đơn giản | ⭐⭐⭐⭐ Dốc |
| **Hiệu suất** | Nhanh | Nhanh | **Cực nhanh** | Nhanh |
| **Hệ sinh thái** | Hoàn thiện | **Hoàn thiện nhất** | Đang phát triển | Hoàn thiện |
| **Kích thước bundle** | Nhỏ | Trung bình | **Nhỏ nhất** | Lớn |
| **Tình huống phù hợp** | Dự án vừa và nhỏ | Dự án lớn | Yêu cầu hiệu suất cao | Ứng dụng doanh nghiệp |
| **Hỗ trợ công ty** | Evan You (độc lập) | Meta | Cộng đồng | Google |

### 7.2 Vue: Progressive Framework

**Triết lý cốt lõi**: Áp dụng tiến dần, có thể chỉ dùng một phần, cũng có thể dùng full bộ

```vue
<template>
  <div>{{ message }}</div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello Vue'
    }
  }
}
</script>
```

**Ưu điểm**:
- ✅ Đường cong học tập thoải, tài liệu tiếng Trung hoàn thiện
- ✅ Cú pháp template trực quan, dễ hiểu
- ✅ Single-file component (.vue) cấu trúc rõ ràng
- ✅ Phù hợp phát triển nhanh

**Nhược điểm**:
- ❌ Quản lý state cho dự án lớn cần học thêm Vuex/Pinia
- ❌ Độ linh hoạt kém hơn React một chút

**Tình huống phù hợp**:
- Ứng dụng web vừa và nhỏ
- Phát triển prototype nhanh
- Team tiếng Trung (tài liệu thân thiện)

### 7.3 React: UI Library

**Triết lý cốt lõi**: Chỉ phụ trách view layer, các vấn đề khác để cộng đồng lo

```jsx
function App() {
  const [message, setMessage] = useState('Hello React')
  return <div>{message}</div>
}
```

**Ưu điểm**:
- ✅ Hệ sinh thái hoàn thiện nhất, thư viện component phong phú
- ✅ Cú pháp JSX linh hoạt, khả năng biểu đạt mạnh mẽ
- ✅ Virtual DOM hiệu suất xuất sắc
- ✅ Phù hợp dự án lớn

**Nhược điểm**:
- ❌ Đường cong học tập dốc hơn, cần nắm thêm các khái niệm bổ sung
- ❌ Cần tự chọn và kết hợp các thư viện
- ❌ JSX cần biên dịch, không thể chạy trực tiếp trên trình duyệt

**Tình huống phù hợp**:
- Ứng dụng phức tạp quy mô lớn
- Dự án cần hệ sinh thái phong phú
- Phát triển cross-platform (React Native)

### 7.4 Svelte: Compile-Time Framework

**Triết lý cốt lõi**: Không có Virtual DOM, biên dịch component thành code native hiệu quả

```svelte
<script>
  let message = 'Hello Svelte'
</script>

<div>{message}</div>
```

**Ưu điểm**:
- ✅ **Hiệu suất tối ưu nhất** (không có runtime overhead của Virtual DOM)
- ✅ Kích thước bundle nhỏ nhất
- ✅ Cú pháp đơn giản trực quan
- ✅ Hệ thống reactive được hỗ trợ tự nhiên

**Nhược điểm**:
- ❌ Hệ sinh thái tương đối nhỏ
- ❌ Quy mô cộng đồng không bằng Vue/React
- ❌ Thư viện bên thứ ba ít hơn

**Tình huống phù hợp**:
- Ứng dụng yêu cầu hiệu suất cực cao
- Dự án nhạy cảm với kích thước bundle
- Team sẵn sàng thử công nghệ mới

### 7.5 Angular: Nền Tảng Đầy Đủ

**Triết lý cốt lõi**: Cung cấp giải pháp hoàn chỉnh, dùng ngay không cần cài thêm

```typescript
@Component({
  selector: 'app-root',
  template: '<div>{{ message }}</div>'
})
export class AppComponent {
  message = 'Hello Angular'
}
```

**Ưu điểm**:
- ✅ Chức năng đầy đủ, routing, HTTP, form đều có sẵn
- ✅ Hỗ trợ TypeScript nguyên bản
- ✅ Phù hợp team và dự án lớn
- ✅ Quy chuẩn code thống nhất

**Nhược điểm**:
- ❌ Đường cong học tập dốc
- ❌ Nhiều khái niệm, độ phức tạp cao
- ❌ Kích thước bundle lớn
- ❌ Không phù hợp dự án nhỏ

**Tình huống phù hợp**:
- Ứng dụng doanh nghiệp quy mô lớn
- Team cần quy phạm nghiêm ngặt
- Dự án đã có tech stack TypeScript

---

## 8. Tổng Kết: Bản Chất Của Sự Phát Triển

Sự phát triển của công nghệ frontend, về bản chất là đang giải quyết hai vấn đề:

### 8.1 Hiệu Quả: Từ Thủ Công Đến Tự Động

| Thời Đại | Cách Phát Triển | Hiệu Quả |
|----------|----------------|----------|
| **2000s** | Viết tay HTML/CSS/JS | ⭐ |
| **2010s** | jQuery + thao tác DOM thủ công | ⭐⭐ |
| **2020s** | Vue/React + data-driven | ⭐⭐⭐ |
| **Hiện tại** | Component hóa + engineering + tự động hóa | ⭐⭐⭐⭐⭐ |

### 8.2 Quy Mô: Từ Cá Nhân Đến Đội Nhóm

| Thời Đại | Quy Mô Dự Án | Cách Làm Việc Nhóm |
|----------|-------------|-------------------|
| **2000s** | Vài file | Một người có thể bảo trì |
| **2010s** | Vài chục file | Team nhỏ, dễ xung đột |
| **2020s** | Vài trăm file | Team vừa, cần quy phạm |
| **Hiện tại** | Vài nghìn file | Team lớn, cần hệ thống engineering hoàn chỉnh |

---

---

## 9. Lộ Trình Học Tập

### 9.1 Nếu Bạn Là Người Mới Bắt Đầu

**Bước 1: Nắm vững HTML/CSS/JavaScript cơ bản**

- Hiểu ba nền tảng của web
- Có thể viết được trang tĩnh đơn giản

**Bước 2: Học một framework (khuyến nghị Vue)**

- Hiểu tư tưởng "data-driven"
- Nắm vững phát triển component hóa

**Bước 3: Dự án thực tế**

- Làm một ứng dụng SPA hoàn chỉnh
- Làm quen với routing, quản lý state, gọi API

### 9.2 Nếu Bạn Đã Có Nền Tảng

**Hướng nâng cao**:

- **Engineering**: Học Vite/Webpack, hiểu quy trình build
- **Tối ưu hiệu suất**: Học lazy loading, code splitting, chiến lược cache
- **TypeScript**: Thêm type cho code, nâng cao độ tin cậy
- **Server-side rendering**: Học Nuxt/Next.js, giải quyết vấn đề SEO và first screen

---

## 10. Những Code Bạn Nên Có Thể Nhận Diện

Qua việc đọc chương này, bạn nên có thể:

- ✅ Hiểu mạch phát triển và nguyên nhân của sự phát triển công nghệ frontend
- ✅ Phân biệt đặc điểm của Vue, React, Svelte, Angular
- ✅ Hiểu sự khác biệt giữa "imperative" và "declarative"
- ✅ Nắm vững tư tưởng cốt lõi của "data-driven"
- ✅ Biết giá trị của phát triển component hóa
- ✅ Hiểu tình huống áp dụng của CSR, SSR, SSG
- ✅ Hiểu vai trò của công cụ build (Webpack, Vite)
- ✅ Có thể chọn framework và tech stack phù hợp với dự án

::: info 💡 Ứng Dụng Thực Tế
Khi bạn dùng AI làm dự án, bạn có thể nói với nó như sau:

- "Đây là một trang blog cần SEO, dùng Nuxt (framework SSR của Vue)"
- "Đây là một hệ thống quản trị backend, dùng Vue + Element Plus, không cần SSR"
- "Đây là một ứng dụng web yêu cầu hiệu suất cao, cân nhắc dùng Svelte"
- "Dự án đã dùng React rồi, tiếp tục dùng các thư viện trong hệ sinh thái React"
:::

---

## Bảng Tra Cứu Thuật Ngữ

| Thuật Ngữ | Tiếng Anh | Giải Thích Bằng Ngôn Ngữ Đời Thường |
|-----------|-----------|-------------------------------------|
| **DOM** | Document Object Model | Mô hình đối tượng tài liệu. Biểu diễn trang bằng cây đối tượng, có thể được JS đọc/ghi. |
| **jQuery** | - | Thư viện JS phổ biến thời kỳ đầu, đơn giản hóa thao tác DOM. |
| **Vue/React** | - | Frontend framework hiện đại, áp dụng data-driven và phát triển component hóa. |
| **Component** | Component | Đơn vị UI có thể tái sử dụng, như nút bấm, thẻ, thanh điều hướng. |
| **MPA** | Multi-Page Application | Ứng dụng đa trang. Mỗi lần chuyển trang đều tải lại toàn bộ trang. |
| **SPA** | Single-Page Application | Ứng dụng đơn trang. Chỉ tải một lần, các lần chuyển sau không refresh trang. |
| **Routing** | Routing | Quản lý quy tắc và quá trình chuyển đổi giữa các trang. |
| **SSR** | Server-Side Rendering | Render phía server. Server tạo HTML rồi gửi cho trình duyệt. |
| **SSG** | Static Site Generation | Sinh trang tĩnh. Render trước trang thành HTML tĩnh trong lúc build. |
| **CSR** | Client-Side Rendering | Render phía client. Trình duyệt tạo trang thông qua JS. |
| **Webpack** | - | Công cụ đóng gói truyền thống, đóng gói trước rồi phục vụ sau. |
| **Vite** | - | Công cụ build hiện đại, biên dịch theo nhu cầu, tốc độ cực nhanh. |
| **Responsive** | Responsive Design | Thiết kế trang tự động thích ứng với các kích thước màn hình khác nhau. |
| **Media Query** | Media Query | Câu lệnh điều kiện của CSS, áp dụng style khác nhau theo chiều rộng màn hình. |
| **Imperative** | Imperative | Nói với chương trình "làm thế nào". |
| **Declarative** | Declarative | Nói với chương trình "muốn gì". |
| **Data-Driven** | Data-Driven | Chỉ thay đổi dữ liệu, giao diện tự động cập nhật. |
| **Tree Shaking** | - | Tối ưu rung cây. Tự động loại bỏ code không dùng đến, giảm kích thước bundle. |
| **Code Splitting** | Code Splitting | Chia code thành nhiều khối nhỏ, tải theo nhu cầu. |
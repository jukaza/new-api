# Định tuyến & Điều hướng
::: tip 🎯 Câu hỏi cốt lõi
**Tại sao một số trang web khi chuyển trang không bị nhấp nháy trắng màn hình, mà mượt mà như App?** Đây chính là phép màu của frontend routing. Chương này sẽ đưa bạn từ kiểu "lật trang" của website truyền thống, bước vào thế giới "chuyển slide" của Single Page Application, để hiểu cách frontend routing nâng tầm trải nghiệm người dùng.
:::

---

## 1. Tại sao cần "Frontend Routing"?

### 1.1 Từ website truyền thống đến SPA: Sự thay đổi về chất trong trải nghiệm người dùng

Nhìn lại trải nghiệm duyệt web thời kỳ đầu, mỗi lần nhấp vào liên kết đều là một quá trình "lật trang hoàn chỉnh": màn hình nhấp nháy trắng, vòng tròn tải quay, toàn bộ trang được render lại. Nếu mạng chậm, bạn còn phải nhìn chằm chằm vào vòng tải trong vài giây. Trải nghiệm này ngày nay đã lỗi thời, nhưng lúc đó đó là cách làm tiêu chuẩn.

Phát triển frontend hiện đại đã thay đổi hoàn toàn mô hình này. Chúng ta sử dụng kỹ thuật frontend routing, giúp việc chuyển trang mượt mà như App di động — không nhấp nháy trắng, không vòng tải, người dùng gần như không cảm nhận được quá trình "chuyển trang". Sự nâng cao trải nghiệm này không phải phép thuật, mà là công lao của hệ thống frontend routing.

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**📖 Website truyền thống (MPA)**
- Nhấp liên kết → Tải lại toàn bộ trang
- Mỗi trang là một file HTML độc lập
- Trình duyệt tải lại tất cả tài nguyên
- Trải nghiệm như "lật sách", có quá trình lật trang rõ rệt

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**📱 Single Page Application (SPA)**
- Nhấp liên kết → Chuyển trang không tải lại
- Chỉ có một file HTML đầu vào
- Chỉ tải dữ liệu cần thiết
- Trải nghiệm như "trình chiếu", mượt mà tự nhiên

</div>
</div>

**Đây chính là vấn đề cốt lõi mà "frontend routing" giải quyết: thực hiện chuyển đổi view và đồng bộ cập nhật URL mà không cần tải lại trang.**

<RouteMatchingDemo />

### 1.2 Một câu chuyện thực tế: Tại sao bạn cần hiểu về routing mode

Bạn có thể nói: "Tôi dùng Vue Router hoặc React Router, cấu hình một chút là dùng được, tại sao còn cần hiểu những nguyên lý cơ bản này?" Hãy để tôi kể một câu chuyện thực tế, bạn sẽ hiểu tại sao những kiến thức này quan trọng đến vậy.

::: warning Câu chuyện triển khai của Tiểu Lý
Tiểu Lý là một frontend developer mới vào nghề, vừa nhận việc đã được giao phát triển một ứng dụng SPA dựa trên Vue. Khi phát triển local mọi thứ đều bình thường, chuyển trang mượt như lụa. Nhưng khi anh ấy triển khai dự án lên máy chủ test, vấn đề xuất hiện: người dùng truy cập trực tiếp vào một route nào đó (như `example.com/user/123`) hoặc refresh trang chi tiết, sẽ thấy lỗi **404 Not Found**.

Tiểu Lý hoang mang: rõ ràng local truy cập bình thường, tại sao triển khai xong lại 404? Anh ấy排查 rất lâu, thậm chí còn nghi ngờ là vấn đề cấu hình máy chủ.

Sau đó anh ấy hỏi đàn anh, đàn anh nhìn một cái đã nhận ra vấn đề: Tiểu Lý dùng History mode, nhưng máy chủ không cấu hình fallback. Khi người dùng truy cập trực tiếp `/user/123`, máy chủ sẽ tìm file tương ứng với đường dẫn này, nhưng tất cả các route của SPA thực chất đều trỏ về cùng một file `index.html`. Giải pháp rất đơn giản: cấu hình máy chủ để tất cả các route đều fallback về `index.html`, để frontend routing tiếp quản xử lý sau đó.

Từ đó Tiểu Lý hiểu ra một điều: **không hiểu nguyên lý của routing mode và yêu cầu cấu hình máy chủ, bạn thậm chí còn không biết tại sao báo lỗi, chứ đừng nói đến giải quyết vấn đề.**
:::

::: info 💡 Bài học cốt lõi
Frontend routing không phải "ma thuật đen", hiểu nguyên lý hoạt động của nó có thể giúp bạn nhanh chóng xác định và giải quyết chính xác các vấn đề về triển khai, hiệu năng, SEO. Quan trọng hơn, nó có thể giúp bạn đưa ra lựa chọn sáng suốt hơn khi thiết kế kiến trúc dự án — khi nào dùng Hash mode, khi nào dùng History mode, làm thế nào để tránh những cái bẫy phổ biến.
:::

---

## 2. Khái niệm cốt lõi: Route, Mode, Navigation

Trước khi đi sâu vào triển khai cụ thể, chúng ta cần làm rõ một vài khái niệm cốt lõi. Để giúp bạn hiểu rõ hơn, chúng ta dùng phép so sánh với thư viện để liên hệ mối quan hệ giữa chúng.

::: tip 🤔 Những khái niệm này liên quan gì đến routing?
Route, Mode, Navigation chính là ba trụ cột của hệ thống frontend routing.

Khi bạn sử dụng Vue Router hoặc React Router, framework sẽ giúp bạn xử lý:
1. **Route mapping** → Định nghĩa mối quan hệ giữa URL và component
2. **Lựa chọn mode** → Quyết định dùng Hash hay History mode
3. **Điều khiển điều hướng** → Xử lý chuyển trang, nút tiến/lùi của trình duyệt

Vì vậy, **hiểu ba khái niệm này, bạn mới biết hệ thống routing thực sự đang làm gì, tại sao đôi khi cần cấu hình đặc biệt, tại sao khi triển khai lại gặp vấn đề.**
:::

### 2.1 Hiểu hệ thống routing qua phép so sánh với thư viện

Hãy tưởng tượng bạn đang tìm sách trong thư viện, quá trình này tương đồng đáng kinh ngạc với nguyên lý hoạt động của frontend routing:

| Khái niệm | 📚 Phép so sánh thư viện | Vai trò thực tế | Ví dụ cụ thể |
|------|-------------|----------|----------|
| **Route** | Mối quan hệ giữa số kệ sách và cuốn sách | Định nghĩa ánh xạ giữa URL và page component | Đường dẫn `/user/123` tương ứng với component `UserDetail.vue` |
| **Router** | Hệ thống chỉ dẫn và dịch vụ định vị của thư viện | Module cốt lõi quản lý tất cả các route, xử lý hành vi điều hướng | Vue Router, React Router chính là router |
| **Routing Mode** | Phương thức tra cứu (danh mục thẻ giấy vs hệ thống điện tử) | Quyết định hình thức URL và cách triển khai bên dưới | Hash mode dùng `#`, History mode dùng đường dẫn thông thường |
| **Navigation** | Đi từ kệ sách này sang kệ sách khác | Hành vi chuyển đổi giữa các trang khác nhau | Nhấp liên kết, điều hướng lập trình, nút tiến/lùi của trình duyệt |

::: tip 📊 Bạn thấy được gì từ bảng này?
Hãy cùng đọc từng dòng của bảng này:

**Route**: chỉ là một "cấu hình", cho hệ thống biết "URL nào tương ứng với trang nào". Giống như số sách trong thư viện tương ứng với vị trí của một cuốn sách.

**Router**: là "người quản lý", chịu trách nhiệm dựa vào URL hiện tại để tìm component tương ứng và render. Giống như thủ thư dựa vào số sách bạn cung cấp để tìm sách cho bạn.

**Routing Mode**: là "cách triển khai", quyết định URL trông như thế nào, công nghệ bên dưới dùng gì để thực hiện. Giống như thư viện có thể dùng danh mục giấy, cũng có thể dùng hệ thống tra cứu điện tử.

**Navigation**: là "hành vi", là hành động người dùng kích hoạt chuyển trang. Giống như bạn đi từ khu A sang khu B trong thư viện.

Hiểu sự khác biệt giữa bốn khái niệm này rất quan trọng: **Route là cấu hình tĩnh, Router là người quản lý động, Mode là lựa chọn công nghệ, Navigation là hành vi người dùng.**
:::

### 2.2 Route: Hợp đồng ánh xạ giữa URL và Component

Route, về bản chất, là một "hợp đồng", nó quy định khi truy cập một URL nào đó thì nên hiển thị nội dung gì. Trong Vue Router, một cấu hình route điển hình trông như thế này:

```javascript
const routes = [
  {
    path: '/',           // URL path
    component: Home      // component tương ứng
  },
  {
    path: '/user/:id',   // dynamic route có tham số
    component: UserDetail,
    children: [          // nested route
      { path: 'profile', component: UserProfile },
      { path: 'posts', component: UserPosts }
    ]
  }
]
```

**Bạn có thể thắc mắc: tại sao không dùng trực tiếp thẻ `<a>` để chuyển trang, mà nhất định phải dùng route?**

Câu trả lời nằm ở bản chất của "Single Page Application": SPA chỉ có một trang HTML, tất cả việc chuyển trang thực chất đều là thay thế component trong cùng một trang. Nếu bạn dùng `<a href="/user/123">` truyền thống, trình duyệt sẽ thực sự request đến đường dẫn `/user/123`, dẫn đến tải lại trang hoặc lỗi 404. Vai trò của route là chặn các hành vi chuyển trang này, dùng JavaScript để thay thế component động, từ đó thực hiện chuyển trang không tải lại.

::: details 🔧 Một số mẫu cấu hình route phổ biến
**Static route** (đơn giản nhất):
```javascript
{ path: '/home', component: Home }
{ path: '/about', component: About }
```

**Dynamic route** (có tham số):
```javascript
{ path: '/user/:id', component: UserDetail }
// có thể khớp với /user/123, /user/abc, v.v.
// trong component có thể lấy tham số qua route.params.id
```

**Nested route** (quan hệ cha-con):
```javascript
{
  path: '/user/:id',
  component: UserLayout,    // component cha
  children: [
    { path: 'profile', component: UserProfile },   // đường dẫn thực tế /user/:id/profile
    { path: 'posts', component: UserPosts }        // đường dẫn thực tế /user/:id/posts
  ]
}
```

**Wildcard route** (trang 404):
```javascript
{ path: '/:pathMatch(.*)*', component: NotFound }
// khớp với tất cả các route chưa được định nghĩa
```
:::

### 2.3 Routing Mode: Sự khác biệt bản chất giữa Hash và History

Frontend routing có hai mode triển khai chính: Hash mode và History mode. Chúng có sự khác biệt bản chất về hình thức URL, cách triển khai bên dưới, khả năng tương thích, v.v.

::: tip 🤔 Tại sao cần hai mode?
Đây thực chất là kết quả của lý do lịch sử và sự đánh đổi kỹ thuật.

**Hash mode** là cách triển khai frontend routing đầu tiên, nó tận dụng phần hash trong URL (tức là nội dung sau dấu `#`). Sự thay đổi của hash không kích hoạt tải lại trang, hơn nữa khả năng tương thích cực tốt (ngay cả IE8 cũng hỗ trợ).

**History mode** là "cách làm chuẩn" sau khi HTML5 ra đời, nó tận dụng các phương thức `pushState` và `replaceState` do History API cung cấp, có thể làm cho URL trở nên "bình thường" hơn (không có `#`), nhưng cần máy chủ phối hợp cấu hình.

Nói một cách ví von: Hash mode giống như "dán một tờ giấy ghi chú trước cửa phòng" (không ảnh hưởng đến cấu trúc phòng), History mode giống như "đánh số lại phòng" (cần cập nhật hệ thống bảng tên cửa).
:::

| Đặc tính | Hash mode | History mode |
|------|-----------|--------------|
| **Ví dụ URL** | `https://example.com/#/user/123` | `https://example.com/user/123` |
| **Nguyên lý triển khai** | Lắng nghe sự kiện `hashchange` | Sử dụng History API (`pushState`, `replaceState`) |
| **Cấu hình máy chủ** | Không cần (hash không được gửi đến máy chủ) | **Phải cấu hình fallback về index.html** |
| **Tương thích trình duyệt** | IE8+ (gần như tất cả trình duyệt) | IE10+ (trình duyệt hiện đại) |
| **Thân thiện với SEO** | Kém hơn (công cụ tìm kiếm có thể bỏ qua hash) | Tốt (cấu trúc URL rõ ràng) |
| **Trải nghiệm người dùng** | URL có `#`, trông giống như "neo nhảy" | URL đẹp, gần với website truyền thống |
| **Độ khó triển khai** | Thấp, không cần cấu hình đặc biệt | Cao, cần cấu hình đúng máy chủ |

<HashVsHistoryDemo />

::: tip 📊 Bạn thấy được gì từ bảng này?
Hãy cùng đọc từng dòng của bảng này:

**Ví dụ URL**: URL của Hash mode có dấu `#` rõ ràng, người dùng sẽ nhận ra ngay đây là "SPA"; URL của History mode giống như website truyền thống, trông "chuyên nghiệp" hơn.

**Nguyên lý triển khai**: Hash mode lắng nghe sự kiện `hashchange` (kích hoạt khi hash thay đổi); History mode dùng HTML5 History API, có thể "giả vờ" trang đã chuyển, nhưng thực tế không tải lại.

**Cấu hình máy chủ**: Đây là chỗ dễ mắc lỗi nhất! Nội dung sau dấu `#` của Hash mode không được gửi đến máy chủ, nên máy chủ không cần biết về route; nhưng đường dẫn đầy đủ của History mode sẽ được gửi đến máy chủ, nếu máy chủ không cấu hình đúng, sẽ trả về 404.

**Thân thiện với SEO**: Crawler của công cụ tìm kiếm thường không thực thi JavaScript, URL của Hash mode có thể bị bỏ qua; URL của History mode có cấu trúc rõ ràng, dễ được lập chỉ mục hơn.

**Độ khó triển khai**: Hash mode "dùng ngay không cần cấu hình", History mode cần kiến thức vận hành (Nginx, Apache, v.v.). Đây cũng là lý do nhiều dự án cá nhân mặc định dùng Hash mode.
:::

---

## 3. Con đường tiến hóa: Từ website truyền thống đến routing hiện đại

Đã nói nhiều khái niệm như vậy, hãy xem một case study thực tế: một website thương mại điện tử đã tiến hóa từng bước như thế nào từ "multi-page truyền thống" đến "SPA routing hiện đại". Qua case study này, bạn sẽ hiểu trực quan hơn frontend routing giải quyết vấn đề gì.

::: tip 📖 Kiến thức nền: MPA, SPA, SSR là gì?
Trước khi bắt đầu case study, hãy giới thiệu ngắn gọn những thuật ngữ này:

- **MPA (Multi-Page Application)**: **Multi-page application**, cách phát triển website truyền thống. Mỗi trang là một file HTML độc lập, chuyển trang sẽ tải lại toàn bộ trang.
- **SPA (Single-Page Application)**: **Single-page application**, cách làm chủ đạo của frontend hiện đại. Chỉ có một HTML đầu vào, chuyển trang thông qua JavaScript thay thế component động, không tải lại.
- **SSR (Server-Side Rendering)**: **Server-side rendering**, tạo HTML hoàn chỉnh ở phía máy chủ. Kết hợp ưu điểm của SPA và MPA, render lần đầu nhanh, SEO tốt.

**Hiểu đơn giản**: MPA là "mỗi lần lật trang đều vẽ lại", SPA là "xóa rồi vẽ trên cùng một tờ giấy", SSR là "vẽ sẵn trên giấy rồi đưa cho bạn".
:::

### 3.1 Bức tranh toàn cảnh về sự tiến hóa

Bảng dưới đây thể hiện bốn giai đoạn tiến hóa của frontend application, bạn có thể thấy công nghệ routing đã phát triển từng bước như thế nào:

| Giai đoạn | Loại ứng dụng | Triển khai routing | Đặc điểm cốt lõi | Trải nghiệm người dùng |
|------|---------|---------|---------|---------|
| **Giai đoạn 1: Multi-page truyền thống** | MPA | Server-side routing | Mỗi trang là file HTML độc lập | Mỗi lần chuyển trang đều tải lại |
| **Giai đoạn 2: SPA sơ khai** | SPA (Hash mode) | Hash routing | URL có dấu `#`, tương thích tốt | Không tải lại, nhưng URL không đẹp |
| **Giai đoạn 3: SPA hiện đại** | SPA (History mode) | History routing | URL đẹp, cần cấu hình máy chủ | Mượt mà, URL gần với website truyền thống |
| **Giai đoạn 4: Hybrid rendering** | SPA + SSR | Isomorphic routing | Lần đầu server-side render, sau đó frontend routing | Lần đầu nhanh, SEO tốt, trải nghiệm mượt |

::: tip 📊 Bạn thấy được gì từ bảng này?
Hãy cùng đọc từng dòng của bảng này:

**Giai đoạn 1 → Giai đoạn 2**: Từ "có tải lại" đến "không tải lại", đây là bước nhảy vọt về chất. Người dùng lần đầu tiên trải nghiệm cảm giác mượt mà "như App", nhưng cái giá là URL mang dấu `#`, trông không chuyên nghiệp lắm.

**Giai đoạn 2 → Giai đoạn 3**: Từ "dùng được" đến "dùng tốt". History mode làm cho URL trở nên đẹp, gần với website truyền thống hơn, nhưng cái giá là tăng độ phức tạp khi triển khai (cần cấu hình máy chủ).

**Giai đoạn 3 → Giai đoạn 4**: Từ "trải nghiệm tốt" đến "trải nghiệm tốt + SEO tốt". SSR giải quyết vấn đề SEO của SPA, tốc độ render lần đầu cũng nhanh hơn, nhưng độ phức tạp triển khai tăng lên đáng kể.

**Tóm lại**: Sự tiến hóa của frontend routing không chỉ là "chuyển trang nhanh hơn", mà là **sự nâng cấp của toàn bộ kiến trúc ứng dụng** — từ server-side chủ đạo đến frontend chủ đạo, rồi đến kết hợp frontend-backend, mỗi bước đều cân bằng giữa trải nghiệm người dùng, chi phí phát triển, SEO và nhiều khía cạnh khác.
:::

### 3.2 Giai đoạn 1: Multi-page application truyền thống — Mỗi lần đều tải lại

Tại sao gọi là "multi-page application truyền thống"? Bởi vì trong giai đoạn này mỗi trang đều là file HTML độc lập, khi chuyển trang trình duyệt sẽ tải lại tất cả tài nguyên (HTML, CSS, JS). Đây là cách phát triển web đầu tiên, hiện nay nhiều website truyền thống vẫn hoạt động như vậy.

Trong giai đoạn này, website thương mại điện tử "Mua Nhiều Được" sử dụng kiến trúc MPA điển hình:

**Cách phát triển**:
- **Triển khai routing**: Server-side routing, mỗi trang tương ứng với một file HTML trên máy chủ
- **Chuyển trang**: Sử dụng `<a href="/products/123">`, kích hoạt tải lại toàn bộ trang
- **Quản lý trạng thái**: Mỗi lần chuyển trang đều mất trạng thái trang trước đó (vị trí cuộn, nội dung form, v.v.)

**Đặc điểm của giai đoạn này**:
- ✅ **Ưu điểm**: Triển khai đơn giản, thân thiện với công cụ tìm kiếm (SEO tốt), nút tiến/lùi của trình duyệt dùng ngay không cần cấu hình
- ❌ **Nhược điểm**: Mỗi lần chuyển trang đều tải lại, trải nghiệm người dùng kém, áp lực máy chủ lớn (tải lại các tài nguyên giống nhau)

::: details Xem cấu trúc dự án và quy trình truy cập lúc đó
**Cấu trúc dự án** (cấu trúc điển hình của server-side rendering):
```
server/
├── views/              # HTML template
│   ├── index.html      # Template trang chủ
│   ├── products.html   # Template trang danh sách sản phẩm
│   └── product.html    # Template trang chi tiết sản phẩm
├── public/             # Tài nguyên tĩnh
│   ├── css/
│   ├── js/
│   └── images/
└── server.js           # Điểm vào máy chủ
```

**Quy trình chuyển trang**:
```
1. Người dùng nhấp liên kết <a href="/products/123">
       ↓
2. Trình duyệt gửi GET request đến máy chủ
       ↓
3. Máy chủ render product.html, chèn dữ liệu
       ↓
4. Trả về trang HTML hoàn chỉnh
       ↓
5. Trình duyệt parse HTML, tải CSS/JS, render trang
       ↓
6. Người dùng thấy trang (quá trình này thường mất 1-3 giây)
```

**Nỗi đau của người dùng**:
- Nhấp liên kết xong màn hình trắng, thời gian chờ lâu
- Mỗi lần chuyển trang đều tải lại các file CSS/JS giống nhau
- Nút tiến/lùi của trình duyệt sẽ tải lại trang
- Không thể lưu trạng thái trang phức tạp (như điều kiện lọc, vị trí cuộn)
:::

Cách phát triển này với website nhỏ còn có thể chấp nhận, nhưng khi quy mô website tăng lên, người dùng đòi hỏi trải nghiệm cao hơn, những vấn đề này bắt đầu ảnh hưởng nghiêm trọng đến tỷ lệ giữ chân và chuyển đổi người dùng.

### 3.3 Giai đoạn 2: SPA sơ khai — Thời đại của Hash routing

Vấn đề của multi-page application truyền thống tích tụ đến một mức độ nhất định, đội ngũ "Mua Nhiều Được" quyết định引入 frontend routing, nâng cấp lên kiến trúc SPA. Đây là một bước ngoặt quan trọng — từ "server-side chủ đạo" bước vào "frontend chủ đạo".

Nhưng giai đoạn này cũng có cái giá: URL mang dấu `#`, trông không đủ chuyên nghiệp, công cụ tìm kiếm thu thập cũng có vấn đề.

**Cách phát triển**:
- **Triển khai routing**: Hash routing, tận dụng phần `#` trong URL
- **Chuyển trang**: JavaScript chặn nhấp liên kết, thay thế component động
- **Quản lý trạng thái**: Trạng thái trang được duy trì ở phía client, không cần tải lại

**Đặc điểm của giai đoạn này**:
- ✅ **Ưu điểm**: Chuyển trang không tải lại, trải nghiệm người dùng mượt mà, giảm áp lực máy chủ
- ❌ **Nhược điểm**: URL có dấu `#`, không thân thiện với SEO, lần tải đầu chậm

::: details Xem cách triển khai Hash routing
**Cấu trúc dự án** (cấu trúc điển hình của SPA sơ khai):
```
project/
├── index.html          # File HTML đầu vào duy nhất
├── css/
│   └── app.css         # Tất cả style đóng gói trong một file
├── js/
│   ├── router.js       # Triển khai routing đơn giản
│   ├── views/          # Page component
│   │   ├── Home.js
│   │   ├── ProductList.js
│   │   └── ProductDetail.js
│   └── app.js          # Điểm vào ứng dụng
└── server.js           # File server tĩnh đơn giản
```

**Code cốt lõi của Hash routing**:
```javascript
// router.js - Triển khai Hash routing đơn giản hóa
class HashRouter {
  constructor(routes) {
    this.routes = routes
    this.currentPath = null

    // Lắng nghe thay đổi hash
    window.addEventListener('hashchange', () => {
      this.matchRoute()
    })

    // Khởi tạo
    this.matchRoute()
  }

  matchRoute() {
    // Lấy hash hiện tại (bỏ dấu #)
    const hash = window.location.hash.slice(1) || '/'
    const route = this.routes.find(r => r.path === hash)

    if (route) {
      this.render(route.component)
    } else {
      this.render(NotFoundComponent)
    }
  }

  render(component) {
    const app = document.getElementById('app')
    app.innerHTML = component.template()
    component.mount?.(app)
  }

  navigate(path) {
    window.location.hash = path
  }
}

// Sử dụng
const router = new HashRouter([
  { path: '/', component: Home },
  { path: '/products', component: ProductList },
  { path: '/products/:id', component: ProductDetail }
])

// Điều hướng
router.navigate('/products/123')
```

**Hình thức URL**:
- Trang chủ: `https://example.com/#/`
- Danh sách sản phẩm: `https://example.com/#/products`
- Chi tiết sản phẩm: `https://example.com/#/products/123`

**Cải thiện mang lại**:
1. **Nâng cao trải nghiệm người dùng**: Chuyển trang không tải lại, mượt mà tự nhiên
2. **Giảm áp lực máy chủ**: Chỉ tải HTML/CSS/JS một lần, sau đó chỉ request dữ liệu
3. **Duy trì trạng thái**: Vị trí cuộn, nội dung form, v.v. có thể được duy trì khi chuyển trang
4. **Thân thiện với offline**: Kết hợp Service Worker có thể thực hiện truy cập offline

**Nỗi đau mới**:
1. **URL không đẹp**: Dấu `#` làm URL trông giống như "neo nhảy", không đủ chuyên nghiệp
2. **Vấn đề SEO**: Crawler của công cụ tìm kiếm có thể bỏ qua nội dung sau hash, dẫn đến trang không thể được lập chỉ mục
3. **Lần tải đầu chậm**: Cần tải tất cả JavaScript một lần, thời gian hiển thị lần đầu dài
:::

### 3.4 Giai đoạn 3: SPA hiện đại — History routing trở thành chủ đạo

Nỗi đau của Hash routing (URL không đẹp, SEO kém) đã làm khổ các developer trong nhiều năm. Cùng với sự phổ biến của HTML5 và khả năng tương thích trình duyệt được nâng cao, History routing dần trở thành chủ đạo.

History routing tận dụng HTML5 History API, có thể làm cho URL trở nên "bình thường" (không có `#`), nhưng cái giá là cần máy chủ phối hợp cấu hình.

**Cách phát triển**:
- **Triển khai routing**: History routing, sử dụng `pushState` và `replaceState`
- **Thư viện routing**: Vue Router, React Router và các thư viện routing trưởng thành
- **Cấu hình máy chủ**: Cần cấu hình máy chủ để tất cả route đều fallback về `index.html`

**Đặc điểm của giai đoạn này**:
- ✅ **Ưu điểm**: URL đẹp, thân thiện với SEO, trải nghiệm người dùng mượt mà
- ❌ **Nhược điểm**: Triển khai cần cấu hình đặc biệt, phía máy chủ phải phối hợp

::: details Triển khai History routing và cấu hình triển khai
**Cấu trúc dự án** (cấu trúc điển hình của SPA hiện đại):
```
project/
├── public/
│   └── index.html          # HTML đầu vào duy nhất
├── src/
│   ├── router/
│   │   └── index.js        # Cấu hình routing
│   ├── views/              # Page component
│   │   ├── Home.vue
│   │   ├── ProductList.vue
│   │   └── ProductDetail.vue
│   ├── App.vue
│   └── main.js
├── package.json
└── vite.config.js          # Cấu hình build
```

**Ví dụ cấu hình Vue Router**:
```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),  // History mode
  routes: [
    { path: '/', component: () => import('@/views/Home.vue') },
    { path: '/products', component: () => import('@/views/ProductList.vue') },
    { path: '/products/:id', component: () => import('@/views/ProductDetail.vue') },
    { path: '/:pathMatch(.*)*', component: () => import('@/views/NotFound.vue') }
  ]
})

export default router
```

**Hình thức URL**:
- Trang chủ: `https://example.com/`
- Danh sách sản phẩm: `https://example.com/products`
- Chi tiết sản phẩm: `https://example.com/products/123`

**Quan trọng: Cấu hình Nginx** (phải cấu hình khi triển khai):
```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/app;
    index index.html;

    # Cấu hình quan trọng: tất cả route đều trỏ về index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Tại sao cần cấu hình này?**

```
Kịch bản: Người dùng truy cập trực tiếp https://example.com/products/123

❌ Trường hợp không cấu hình:
1. Trình duyệt gửi request đến máy chủ /products/123
2. Nginx tìm trong hệ thống file /products/123
3. Không tìm thấy file này, trả về 404

✅ Trường hợp đã cấu hình try_files:
1. Trình duyệt gửi request đến máy chủ /products/123
2. Nginx thử tìm file → không tồn tại
3. Fallback về /index.html (theo quy tắc try_files)
4. Trình duyệt tải index.html
5. Vue Router tiếp quản, parse /products/123
6. Render ProductDetail component
7. Trang hiển thị bình thường!
```

**So sánh sự khác biệt với Hash mode**:
| Mục so sánh | Hash mode | History mode |
|--------|----------|-------------|
| URL | `/#/products/123` | `/products/123` |
| Cấu hình máy chủ | Không cần | **Phải cấu hình** |
| Truy cập trực tiếp | ✅ Hoạt động bình thường | ❌ Cần máy chủ hỗ trợ |
| SEO | ⚠️ Kém hơn | ✅ Tốt |
:::

### 3.5 Giai đoạn 4: Hybrid rendering — Giải pháp tối ưu SPA + SSR

Khi History routing đã trưởng thành, đội ngũ bắt đầu quan tâm đến những vấn đề sâu hơn: làm thế nào vừa giữ được trải nghiệm mượt mà của SPA, vừa giải quyết vấn đề SEO và lần tải đầu chậm?

Cốt lõi của giai đoạn này là "isomorphic rendering" — lần đầu render ở server-side (SEO tốt, tải nhanh), các tương tác sau đó do frontend routing đảm nhiệm (trải nghiệm mượt).

**Cách phát triển**:
- **Lựa chọn framework**: Next.js (React), Nuxt.js (Vue)
- **Chiến lược render**: Server-side rendering + Client-side hydration
- **Routing mode**: History mode (máy chủ đã được cấu hình sẵn)

**Đặc điểm của giai đoạn này**:
- ✅ **Ưu điểm**: Lần đầu nhanh, SEO tốt, các tương tác sau mượt mà
- ❌ **Nhược điểm**: Độ phức tạp triển khai cao, cần môi trường chạy server-side

::: details Nguyên lý hoạt động của hybrid rendering
**Quy trình tải trang**:
```
1. Người dùng truy cập /products/123
       ↓
2. Máy chủ nhận request
       ↓
3. Máy chủ render ProductDetail component → tạo HTML hoàn chỉnh
       ↓
4. Trả HTML về trình duyệt (chứa nội dung đầy đủ)
       ↓
5. Trình duyệt hiển thị nhanh nội dung (render lần đầu nhanh)
       ↓
6. Tải JavaScript, thực hiện "hydration"
       ↓
7. Các lần chuyển trang sau do frontend routing tiếp quản (không tải lại)
```

**So sánh lần đầu giữa SPA truyền thống và SSR**:

| Mục so sánh | SPA truyền thống | SSR |
|--------|---------|-----|
| Nội dung lần đầu | Trắng → tải JS → render | Hiển thị nội dung ngay lập tức |
| SEO | Crawler có thể không thấy nội dung | Crawler thấy HTML hoàn chỉnh |
| Thời gian lần đầu | Chậm hơn (cần tải JS) | Nhanh hơn (HTML đã chứa nội dung) |
| Tương tác sau | Mượt (frontend routing) | Mượt (frontend routing) |
:::

---

## 4. Nguyên lý sâu: Routing hoạt động như thế nào?

Sau khi hiểu case study thực tế, hãy cùng đi sâu vào nguyên lý hoạt động của frontend routing, hiểu sự khác biệt giữa hai mode Hash và History.

<RouterArchitectureDemo />

### 4.1 Nguyên lý hoạt động của Hash mode

Cốt lõi của Hash mode là tận dụng phần `hash` trong URL (tức là nội dung sau dấu `#`). Hash có hai đặc tính quan trọng:

1. **Sự thay đổi của hash không kích hoạt tải lại trang**
2. **Sự thay đổi của hash được ghi lại trong history stack của trình duyệt**

Điều này có nghĩa là chúng ta có thể thay đổi URL mà không cần tải lại trang, đồng thời nút tiến/lùi của trình duyệt cũng hoạt động bình thường.

**Quy trình hoạt động**:

```
Người dùng nhấp liên kết <a href="#/user/123">
       ↓
Trình duyệt cập nhật URL (không tải lại trang)
https://example.com/#/user/123
       ↓
Kích hoạt sự kiện hashchange
       ↓
Route listener bắt sự kiện
       ↓
Parse giá trị hash → /user/123
       ↓
Khớp cấu hình route → tìm thấy UserDetail component
       ↓
Render component ra trang
```

**Code triển khai cốt lõi**:

```javascript
class HashRouter {
  constructor(routes) {
    this.routes = routes

    // Lắng nghe thay đổi hash
    window.addEventListener('hashchange', () => {
      this.loadRoute()
    })

    // Tải khởi tạo
    this.loadRoute()
  }

  loadRoute() {
    // Lấy hash hiện tại, bỏ dấu # ở đầu
    const hash = window.location.hash.slice(1) || '/'
    const route = this.matchRoute(hash)

    if (route) {
      this.render(route.component)
    }
  }

  matchRoute(path) {
    return this.routes.find(r => r.path === path)
  }

  render(component) {
    document.getElementById('app').innerHTML = component.template()
  }

  push(path) {
    window.location.hash = path
  }
}
```

::: tip 💡 Ưu điểm của Hash mode
- **Tương thích tốt**: IE8+ đều hỗ trợ, gần như áp dụng cho tất cả trình duyệt
- **Triển khai đơn giản**: Không cần cấu hình máy chủ, dùng ngay
- **Triển khai đơn giản**: Chỉ cần lắng nghe sự kiện `hashchange`
:::

### 4.2 Nguyên lý hoạt động của History mode

History mode tận dụng HTML5 History API, cung cấp các phương thức `pushState`, `replaceState`, v.v., có thể thay đổi URL mà không tải lại trang.

**API cốt lõi**:

```javascript
// Thêm bản ghi lịch sử mới
history.pushState(state, title, url)
// Ví dụ: history.pushState({id: 123}, 'Chi tiết người dùng', '/user/123')

// Thay thế bản ghi lịch sử hiện tại
history.replaceState(state, title, url)

// Lắng nghe thay đổi bản ghi lịch sử (nút tiến/lùi)
window.addEventListener('popstate', (event) => {
  // event.state chứa state được truyền vào khi gọi pushState
})
```

**Quy trình hoạt động**:

```
Người dùng nhấp liên kết <a href="/user/123">
       ↓
JavaScript chặn sự kiện nhấp
event.preventDefault()
       ↓
Gọi history.pushState
history.pushState({id: 123}, 'Chi tiết người dùng', '/user/123')
       ↓
URL cập nhật (không tải lại trang)
https://example.com/user/123
       ↓
Route khớp và render component
       ↓
Người dùng nhấp nút lùi của trình duyệt
       ↓
Kích hoạt sự kiện popstate
       ↓
Route listener bắt sự kiện
       ↓
Dựa vào URL mới render component tương ứng
```

**Code triển khai cốt lõi**:

```javascript
class HistoryRouter {
  constructor(routes) {
    this.routes = routes

    // Chặn tất cả nhấp liên kết
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a')
      if (link && link.getAttribute('href').startsWith('/')) {
        e.preventDefault()
        this.push(link.getAttribute('href'))
      }
    })

    // Lắng nghe nút tiến/lùi của trình duyệt
    window.addEventListener('popstate', () => {
      this.loadRoute()
    })

    // Tải khởi tạo
    this.loadRoute()
  }

  loadRoute() {
    const path = window.location.pathname
    const route = this.matchRoute(path)

    if (route) {
      this.render(route.component)
    }
  }

  push(path) {
    history.pushState({}, '', path)
    this.loadRoute()
  }

  render(component) {
    document.getElementById('app').innerHTML = component.template()
  }
}
```

::: warning ⚠️ Cạm bẫy của History mode
Vấn đề lớn nhất của History mode là: **khi người dùng truy cập trực tiếp một URL hoặc refresh trang, trình duyệt sẽ gửi request đến máy chủ**.

Nếu máy chủ không được cấu hình đúng, sẽ trả về 404. Giải pháp là cấu hình máy chủ để tất cả route đều fallback về `index.html`, để frontend routing tiếp quản xử lý sau đó.
:::

---

## 5. Hướng dẫn thực chiến cấu hình routing

Lý thuyết đã nói khá nhiều, dưới đây là các mẫu cấu hình routing thường dùng và best practice trong dự án thực tế.

### 5.1 Cấu hình routing cơ bản

::: details Ví dụ cấu hình đầy đủ Vue Router

```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import NotFound from '@/views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/user/:id',
      name: 'UserDetail',
      component: () => import('@/views/UserDetail.vue'),
      props: true  // Truyền tham số route dưới dạng props
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // Hành vi cuộn: khi quay lại giữ vị trí cuộn, nếu không thì cuộn lên đầu
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
```

:::

### 5.2 Route lazy loading: Nâng cao hiệu năng lần đầu

Route lazy loading là chỉ tải component tương ứng khi truy cập route đó, thay vì tải tất cả component một lần. Điều này có thể giảm đáng kể thời gian tải lần đầu.

```javascript
// ❌ Tải tất cả component một lần (lần đầu chậm)
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import User from '@/views/User.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/user', component: User }
]

// ✅ Lazy loading (lần đầu nhanh)
const routes = [
  { path: '/', component: () => import('@/views/Home.vue') },
  { path: '/about', component: () => import('@/views/About.vue') },
  { path: '/user', component: () => import('@/views/User.vue') }
]
```

<CodeSplittingDemo />

::: tip 💡 Nguyên lý của lazy loading
Khi bạn sử dụng `import('@/views/Home.vue')`, Webpack/Vite sẽ đóng gói component này thành file riêng. Chỉ khi người dùng truy cập route này, file tương ứng mới được tải xuống.

Nói một cách ví von: lazy loading giống như "gọi món theo nhu cầu", thay vì dọn tất cả món lên bàn một lúc. Điều này có thể giảm thời gian tải lần đầu, nâng cao trải nghiệm người dùng.
:::

### 5.3 Route guard: Kiểm soát quyền và chặn điều hướng

Route guard có thể thực thi logic trước và sau khi chuyển route, thường dùng cho các kịch bản như xác thực quyền, đặt tiêu đề trang, tải trước dữ liệu, v.v.

```javascript
// Global before guard
router.beforeEach(async (to, from, next) => {
  // Đặt tiêu đề trang
  document.title = to.meta.title || 'My App'

  // Xác thực quyền
  if (to.meta.requiresAuth) {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      next('/login')
      return
    }
  }

  next()
})

// Global after hook
router.afterEach((to, from) => {
  // Thống kê lượt truy cập trang
  analytics.trackPageView(to.path)
})

// Route-level guard
const routes = [
  {
    path: '/admin',
    component: Admin,
    meta: { requiresAuth: true, roles: ['admin'] },
    beforeEnter: (to, from, next) => {
      // Logic riêng cho route này
      if (hasPermission()) {
        next()
      } else {
        next('/403')
      }
    }
  }
]
```

::: tip 💡 Các用途 phổ biến của route guard
- **Xác thực quyền**: Kiểm tra người dùng có quyền truy cập trang nào đó không
- **Tiêu đề trang**: Đặt động document.title
- **Tải trước dữ liệu**: Lấy dữ liệu trước khi vào trang
- **Thanh tiến trình**: Hiển thị thanh tiến trình khi chuyển trang
- **Thống kê truy cập**: Ghi lại tình hình truy cập trang
:::

---

## 6. Các vấn đề thường gặp và giải pháp

### 6.1 Refresh bị 404 sau khi triển khai

**Vấn đề**: Local phát triển bình thường, sau khi triển khai lên máy chủ, truy cập trực tiếp một route hoặc refresh trang sẽ hiển thị 404.

**Nguyên nhân**: Trong History mode, máy chủ sẽ coi URL như đường dẫn file để tìm kiếm, nhưng tất cả route của SPA thực chất đều trỏ về `index.html`.

**Giải pháp**: Cấu hình máy chủ fallback.

```nginx
# Cấu hình Nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

```apache
# Cấu hình Apache (.htaccess)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### 6.2 Mất tham số route

**Vấn đề**: Sau khi refresh trang, tham số route `$route.params` bị mất.

**Nguyên nhân**: Tham số route chỉ tồn tại khi chuyển route, sau khi refresh cần parse lại từ URL.

**Giải pháp**:

```javascript
// ❌ Cách làm sai: chỉ lấy tham số khi created
created() {
  const userId = this.$route.params.id
  this.fetchUser(userId)
}

// ✅ Cách làm đúng: lắng nghe thay đổi route
watch: {
  '$route.params.id': {
    immediate: true,
    handler(newId) {
      this.fetchUser(newId)
    }
  }
}
```

### 6.3 Vị trí cuộn bất thường khi chuyển trang

**Vấn đề**: Sau khi chuyển trang, vị trí cuộn không được reset, hoặc khi quay lại không giữ được vị trí trước đó.

**Giải pháp**: Cấu hình `scrollBehavior` của route.

```javascript
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    // Giữ vị trí cuộn khi quay lại
    if (savedPosition) {
      return savedPosition
    }
    // Nhảy đến neo
    if (to.hash) {
      return { el: to.hash }
    }
    // Nếu không thì cuộn lên đầu
    return { top: 0 }
  }
})
```

---

## 7. Tổng kết

Hãy cùng nhìn lại các khái niệm cốt lõi của frontend routing qua một bảng:

| Khái niệm | Giải thích một câu | Vấn đề giải quyết | Giải pháp đại diện |
|------|-----------|-----------|----------|
| **Route** | Mối quan hệ ánh xạ giữa URL và component | Truy cập URL khác nhau hiển thị nội dung khác nhau | Vue Router, React Router |
| **Hash mode** | Tận dụng URL hash để triển khai routing | Tương thích tốt, triển khai đơn giản | Vue Router Hash mode |
| **History mode** | Tận dụng History API để triển khai routing | URL đẹp, SEO tốt | Vue Router History mode |
| **Route lazy loading** | Tải route component theo nhu cầu | Giảm thời gian tải lần đầu | `() => import('./Page.vue')` |
| **Route guard** | Hook function trước/sau khi chuyển route | Kiểm soát quyền, tải trước dữ liệu | `beforeEach`, `beforeEnter` |
| **Dynamic route** | Route có tham số | Khớp một loại đường dẫn thay vì một đường dẫn đơn lẻ | `/user/:id` |

::: info Lời kết
Frontend routing là một trong những công nghệ cốt lõi của Single Page Application hiện đại. Từ Hash mode thời kỳ đầu đến History mode chủ đạo hiện nay, công nghệ routing không ngừng tiến hóa, mang đến cho người dùng trải nghiệm duyệt web mượt mà hơn.

Hiểu nguyên lý và mode của routing, có thể giúp bạn nhanh chóng xác định và giải quyết chính xác các vấn đề về triển khai, hiệu năng, SEO. Quan trọng hơn, nó có thể giúp bạn đưa ra lựa chọn sáng suốt hơn khi thiết kế kiến trúc dự án — khi nào dùng Hash, khi nào dùng History, làm thế nào để tránh những cái bẫy phổ biến.

Hy vọng bài viết này có thể giúp bạn xây dựng nhận thức tổng thể về frontend routing. Khi bạn gặp vấn đề liên quan đến routing trong dự án thực tế, bạn có thể biết bắt đầu từ đâu, làm thế nào để xác định và giải quyết.
:::
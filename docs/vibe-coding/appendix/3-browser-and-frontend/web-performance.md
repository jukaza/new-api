# Đo lường và Tối ưu Hiệu suất Web
::: tip 🎯 Câu hỏi cốt lõi
**Tại sao trang web của bạn tải chậm và người dùng vẫn phàn nàn về tình trạng giật lag?** Điều này giống như hỏi: tại sao nhà hàng phục vụ chậm và khách hàng mất kiên nhẫn? Chương này sẽ giúp bạn hiểu sâu các khái niệm cốt lõi về tối ưu hiệu suất frontend, giúp trang web của bạn "bay" lên.
:::

---

## 1. Tại sao cần "Tối ưu Hiệu suất"?

### 1.1 Từ dùng được đến dùng tốt: Sự phát triển của tối ưu hiệu suất

Trang web mười năm trước rất đơn giản, một trang có thể chỉ vài KB, tốc độ tải gần như không cảm nhận được độ trễ. Khi đó chúng ta không cần nghĩ đến tối ưu hiệu suất — vì vấn đề chưa xuất hiện.

Nhưng bây giờ mọi thứ đã hoàn toàn khác. Độ phức tạp của trang web hiện đại tăng theo cấp số nhân: một trang chủ thương mại điện tử có thể có hàng chục ảnh độ phân giải cao, một nền tảng mạng xã hội có thể tải hàng nghìn bài đăng cùng lúc, một trang quản trị có thể chứa hàng chục thành phần tương tác. Đằng sau những tính năng "phong phú" này là khối lượng mã và tài nguyên khổng lồ, nếu không được tối ưu tốt, trải nghiệm người dùng sẽ trở nên tồi tệ.

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**👴 Trang web mười năm trước**
- Một trang chỉ vài KB đến vài chục KB
- Chỉ có văn bản và một ít hình ảnh
- Người dùng hầu như không cảm nhận được độ trễ tải
- Không cần bất kỳ tối ưu hiệu suất nào

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🚀 Trang web hiện đại**
- Một trang có thể vài MB hoặc thậm chí lớn hơn
- Có ảnh độ phân giải cao, video, thành phần tương tác
- Tải chậm, cuộn giật, phản hồi khi nhấp chậm
- Phải tối ưu hiệu suất mới dùng được

</div>
</div>

**Đây chính là vấn đề mà "tối ưu hiệu suất" giải quyết: giảm thời gian chờ đợi của người dùng, làm cho thao tác mượt mà hơn.**

### 1.2 Một câu chuyện thực tế: Tại sao bạn cần hiểu về tối ưu hiệu suất

Bạn có thể nói: "Mạng bây giờ nhanh như vậy, thiết bị tốt như vậy, còn cần tối ưu hiệu suất sao?" Hãy để tôi kể một câu chuyện thực tế, bạn sẽ hiểu tại sao những kiến thức này lại quan trọng đến vậy.

::: warning Câu chuyện vấp ngã về hiệu suất của Tiểu Vương
Tiểu Vương là một kỹ sư frontend mới vào nghề, phụ trách phát triển trang chủ thương mại điện tử của công ty. Anh ấy đã dùng Vue 3 mới nhất, thư viện UI phổ biến nhất, chức năng hoàn thiện rất tốt, khi tự kiểm tra trên máy tính hiệu suất cao của công ty mọi thứ đều bình thường.

Nhưng ngày thứ hai sau khi上线, bộ phận chăm sóc khách hàng đã nổ tung — rất nhiều người dùng phàn nàn "trang web quá lag", "ảnh không tải được", "nhấp nút mãi không có phản ứng". Tiểu Vương mở máy phát triển của mình kiểm tra, mọi thứ vẫn rất mượt, anh ấy hoàn toàn không hiểu vấn đề nằm ở đâu.

Sau đó nhờ sư phụ giúp định vị, sư phụ bảo anh ấy dùng một chiếc laptop bình thường, kết nối mạng 4G thông thường, rồi kiểm tra lại trang web của mình. Tiểu Vương lúc này mới ngỡ ngàng: trang chủ tải mất hơn mười giây, cuộn danh sách giật như trình chiếu PPT, nhấp nút phải đợi vài giây mới có phản hồi.

Hóa ra môi trường phát triển của Tiểu Vương là MacBook Pro cấu hình cao nhất + cáp quang gigabit, trong khi hầu hết người dùng dùng thiết bị bình thường + mạng di động. Mã của anh ấy có hàng chục ảnh độ phân giải cao chưa nén, import toàn bộ thư viện UI nhưng chỉ dùng vài component, còn thực hiện nhiều tính toán đồng bộ khi render.

Giải pháp thực ra không phức tạp: nén ảnh, import component theo nhu cầu, đưa tính toán vào luồng nền, sử dụng virtual list. Sau những thay đổi này, thời gian tải trang chủ từ hơn mười giây giảm xuống còn 2 giây, cuộn cũng rất mượt, phàn nàn của người dùng lập tức biến mất.

Tiểu Vương từ đó hiểu ra một đạo lý: **Không hiểu về tối ưu hiệu suất, mã bạn viết ra chạy nhanh trên máy của bạn, nhưng trên thiết bị của người dùng có thể hoàn toàn không dùng được.**
:::

::: info 💡 Bài học cốt lõi
Tối ưu hiệu suất không phải là tùy chọn, mà là kỹ năng bắt buộc. Bạn phải đứng từ góc nhìn của người dùng để suy nghĩ — họ dùng thiết bị bình thường, mạng bình thường, nếu mã của bạn không chạy được trên thiết bị của họ, điều đó có nghĩa là bạn cần tối ưu.
:::

---

## 2. Khái niệm cốt lõi: Tải, Render, Tương tác

::: tip 🤔 Những khái niệm này liên quan gì đến hiệu suất?
Tải, render, tương tác chính là ba khâu cốt lõi khi người dùng truy cập trang web, mỗi khâu đều có thể trở thành nút thắt hiệu suất.

Khi người dùng truy cập trang web của bạn, họ sẽ lần lượt trải qua:
1. **Tải** → Tải HTML/CSS/JS/ảnh từ máy chủ về trình duyệt
2. **Render** → "Vẽ" nội dung đã tải thành trang mà người dùng nhìn thấy
3. **Tương tác** → Phản hồi thao tác nhấp, cuộn của người dùng

Vì vậy, **tối ưu hiệu suất chính là làm cho ba khâu này đều nhanh lên**. Hiểu được chúng, bạn mới biết nút thắt hiệu suất nằm ở đâu, nên dùng phương pháp gì để tối ưu.
:::

Trước khi đi sâu vào các kỹ thuật tối ưu cụ thể, chúng ta cần làm rõ những khái niệm cốt lõi này. Để giúp bạn hiểu rõ hơn, hãy dùng phép so sánh với nhà hàng để hình dung mối quan hệ giữa chúng.

### 2.1 Hiểu ba khâu qua phép so sánh với nhà hàng

Hãy tưởng tượng bạn đi ăn ở một nhà hàng, quá trình này giống với việc truy cập trang web một cách đáng kinh ngạc:

| Khâu | 🍽️ So sánh với nhà hàng | Vai trò thực tế | Ví dụ cụ thể |
|------|-------------|----------|----------|
| **Tải** | Vận chuyển nguyên liệu từ kho đến bếp | Tải HTML/CSS/JS/ảnh từ máy chủ về trình duyệt | Người dùng mở trang web, trình duyệt bắt đầu tải các tài nguyên |
| **Render** | Đầu bếp chế biến nguyên liệu thành món ăn | Trình duyệt chuyển đổi mã thành trang mà người dùng nhìn thấy | Trình duyệt phân tích HTML, tính toán bố cục, vẽ trang |
| **Tương tác** | Phục vụ đáp ứng nhu cầu của khách hàng | Trình duyệt phản hồi thao tác nhấp, cuộn | Người dùng nhấp nút, trang đưa ra phản hồi |

### 2.2 Tải (Loading): Vận chuyển nguyên liệu

Tải là quá trình tải các tài nguyên cần thiết cho trang web (HTML, CSS, JavaScript, ảnh, font, v.v.) từ máy chủ về trình duyệt. Quá trình này giống như vận chuyển nguyên liệu từ kho đến bếp, nếu vận chuyển chậm hoặc nguyên liệu quá nhiều, bếp sẽ phải chờ.

**Tại sao tải lại chậm?** Có ba lý do chính: thứ nhất, dung lượng tài nguyên quá lớn — một ảnh độ phân giải cao chưa nén có thể lên đến 5MB, tương đương với tải một cuốn tiểu thuyết; thứ hai, độ trễ mạng — nếu máy chủ ở nước ngoài, hoặc người dùng dùng mạng di động, mỗi yêu cầu đều phải chờ lâu; cuối cùng, số lượng yêu cầu quá nhiều — trình duyệt có giới hạn số lượng tài nguyên tải đồng thời, quá nhiều tài nguyên sẽ phải xếp hàng.

::: details 🔍 Xem giai đoạn tải đã làm gì
Khi người dùng nhập địa chỉ URL vào thanh địa chỉ trình duyệt và nhấn Enter, các bước sau sẽ lần lượt diễn ra:

1. **Phân giải DNS**: Chuyển đổi tên miền (như `www.example.com`) thành địa chỉ IP (như `192.168.1.1`), giống như tra cứu địa chỉ nhà hàng qua danh bạ điện thoại
2. **Kết nối TCP**: Trình duyệt và máy chủ thiết lập kết nối, giống như phải quay số trước khi gọi điện
3. **Bắt tay TLS**: Thiết lập kết nối an toàn (HTTPS), giống như xác nhận danh tính đối phương
4. **Yêu cầu tài nguyên**: Trình duyệt yêu cầu tệp HTML từ máy chủ
5. **Phân tích HTML**: Trình duyệt phân tích HTML, phát hiện cần các tài nguyên CSS, JS, ảnh, tiếp tục yêu cầu
6. **Tải tài nguyên**: Tải tất cả tài nguyên cần thiết về máy cục bộ
7. **Bắt đầu render**: Sau khi tải xong, bắt đầu render trang

Các bước 1-4 được gọi là "Thời gian byte đầu tiên" (TTFB), các bước 5-7 là thời gian tải tài nguyên thực sự.
:::

**Các biện pháp tối ưu tải phổ biến:**

- **Nén tài nguyên**: Làm cho tệp nhỏ hơn (nén Gzip, Brotli)
- **Sử dụng CDN**: Lưu tệp trên máy chủ gần người dùng hơn
- **Lazy loading**: Chỉ tải nội dung người dùng nhìn thấy, phần còn lại tải khi người dùng cuộn đến
- **Code splitting**: Chia tệp lớn thành tệp nhỏ, tải theo nhu cầu

### 2.3 Render (Kết xuất): Đầu bếp nấu ăn

Render là quá trình trình duyệt chuyển đổi HTML, CSS, JavaScript đã tải thành trang mà người dùng nhìn thấy. Quá trình này giống như đầu bếp chế biến nguyên liệu thành món ăn, nếu công đoạn phức tạp, nhiều bước, món ăn sẽ lên chậm.

::: tip 📖 "Render" là gì?
Có thể bạn đã nghe từ "render", rốt cuộc nó là gì?

**Nói một cách đơn giản, render là quá trình biến mã thành hình ảnh.**

Trình duyệt cần làm những việc sau:
1. **Phân tích HTML** → Tạo cây DOM (cấu trúc trang)
2. **Phân tích CSS** → Tạo cây CSSOM (kiểu dáng trang)
3. **Hợp nhất** → Tạo cây render (kết hợp cấu trúc và kiểu dáng)
4. **Bố cục** → Tính toán vị trí và kích thước của mỗi phần tử
5. **Vẽ** → Vẽ các phần tử ra
6. **Tổng hợp** → Hợp nhất nhiều lớp thành hình ảnh cuối cùng

Quá trình này rất phức tạp, bất kỳ khâu nào có vấn đề đều dẫn đến trang bị giật.
:::

**Tại sao render lại chậm?** Có hai lý do chính: thứ nhất, trang quá phức tạp — nếu một trang có hàng chục nghìn nút DOM, trình duyệt tính toán bố cục và vẽ sẽ rất tốn thời gian; thứ hai, thường xuyên sửa đổi trang — nếu mã JavaScript thường xuyên sửa đổi DOM, sẽ khiến trình duyệt liên tục bố cục lại và vẽ lại, tiêu tốn nhiều hiệu suất.

::: details 📁 Xem giai đoạn render đã làm gì
**Quy trình render đầy đủ**:

```
HTML (chuỗi)
    ↓
[Phân tích HTML] → Tạo cây DOM
    ↓
Cây DOM (cấu trúc trang)

CSS (bảng kiểu)
    ↓
[Phân tích CSS] → Tạo cây CSSOM
    ↓
Cây CSSOM (kiểu dáng trang)

Cây DOM + Cây CSSOM
    ↓
[Hợp nhất] → Tạo cây render
    ↓
Cây render (các phần tử cần render)
    ↓
[Bố cục Layout] → Tính toán vị trí và kích thước mỗi phần tử
    ↓
[Vẽ Paint] → Tô màu, vẽ văn bản
    ↓
[Tổng hợp Composite] → Hợp nhất nhiều lớp
    ↓
Hình ảnh cuối cùng
```

**Đường dẫn render quan trọng (Critical Rendering Path)**: Trình duyệt cần render nội dung màn hình đầu tiên càng sớm càng tốt, để người dùng cảm thấy "trang web nhanh". Đây gọi là "tối ưu đường dẫn render quan trọng".
:::

👇 **Xem thực hành**:
Demo dưới đây cho thấy trình duyệt render trang như thế nào. Nhấp "Tiếp theo", quan sát các giai đoạn render:

<PerformanceOverviewDemo />

**Các biện pháp tối ưu render phổ biến:**

- **Giảm reflow và repaint**: Tránh thường xuyên sửa đổi DOM, sử dụng `transform` và `opacity` thay cho `top` và `width`
- **Virtual list**: Chỉ render nội dung trong vùng hiển thị, cải thiện hiệu suất rõ rệt khi có nhiều dữ liệu
- **CSS animation**: Dùng CSS animation thay cho JavaScript animation, hiệu suất tốt hơn

### 2.4 Tương tác (Interaction): Phục vụ phản hồi

Tương tác là quá trình trình duyệt phản hồi thao tác của người dùng (nhấp, cuộn, nhập liệu, v.v.). Quá trình này giống như phục vụ đáp ứng nhu cầu của khách hàng, nếu phục vụ không kịp, khách hàng phải chờ.

**Tại sao tương tác lại bị giật?** Nguyên nhân chính là **luồng chính bị chặn**. JavaScript của trình duyệt là đơn luồng, nếu mã đang thực hiện tính toán phức tạp, sẽ không thể phản hồi thao tác của người dùng, dẫn đến trang bị giật.

::: tip 🤔 "Luồng chính" là gì?
Trình duyệt có nhiều luồng, nhưng luồng chịu trách nhiệm thực thi JavaScript, render trang, phản hồi thao tác người dùng chỉ có một — **luồng chính**.

Bạn có thể hình dung luồng chính như một **phục vụ bận rộn**, anh ấy phải làm rất nhiều việc:
- Thực thi mã JavaScript (tính toán dữ liệu, gọi API)
- Render trang (bố cục, vẽ)
- Phản hồi thao tác người dùng (nhấp nút, cuộn trang)

Vấn đề là: **anh ấy chỉ có một mình**. Nếu anh ấy đang thực thi tính toán JavaScript phức tạp (ví dụ xử lý mười nghìn dòng dữ liệu), lúc này người dùng nhấp nút, anh ấy không thể phản hồi ngay lập tức, phải đợi tính toán xong mới được. Đây chính là nguồn gốc của **giật lag**.

**Giải pháp**:
- Đưa tính toán phức tạp vào Web Worker (luồng nền)
- Sử dụng time slicing, chia nhiệm vụ lớn thành nhiệm vụ nhỏ
- Tránh thao tác đồng bộ phức tạp, chuyển sang bất đồng bộ
:::

👇 **Thử thực hành**:
Demo dưới đây so sánh sự khác biệt giữa tính toán đồng bộ và Web Worker. Nhấp "Bắt đầu tính toán", quan sát trang có bị giật không:

<PerformanceMetricsDemo />

**Các biện pháp tối ưu tương tác phổ biến:**

- **Debounce và throttle**: Giới hạn tần suất kích hoạt sự kiện (ví dụ sự kiện cuộn, sự kiện nhập liệu)
- **Web Worker**: Đưa tính toán phức tạp vào luồng nền, không chặn luồng chính
- **Time slicing**: Chia nhiệm vụ lớn thành nhiệm vụ nhỏ, để trình duyệt có cơ hội phản hồi thao tác người dùng

---

## 3. Thực chiến: Hành trình phát triển tối ưu hiệu suất của một nhóm

Đã nói nhiều khái niệm như vậy, hãy xem một case study thực tế: một công ty khởi nghiệp đã tiến hóa từ "hoàn toàn không nghĩ đến hiệu suất" đến "tối ưu hiệu suất có hệ thống" như thế nào. Qua case study này, bạn sẽ hiểu trực quan hơn tối ưu hiệu suất thực sự giải quyết vấn đề gì.

### 3.1 Bức tranh toàn cảnh về sự phát triển

Bảng dưới đây cho thấy bốn giai đoạn của tối ưu hiệu suất, bạn có thể thấy các biện pháp, công cụ, chỉ số đã tiến hóa từng bước như thế nào:

| Giai đoạn | Biện pháp tối ưu | Công cụ giám sát | Chỉ số cốt lõi | Thay đổi cốt lõi |
|------|---------|---------|---------|----------|
| **Giai đoạn 1: Thời nguyên thủy** | Không có (chưa nghĩ đến) | Không có (dựa vào cảm giác) | Không có | Hoàn toàn không có ý thức về hiệu suất, chạy được là được |
| **Giai đoạn 2: Tối ưu thủ công** | Nén ảnh, giảm yêu cầu | Bảng Network của trình duyệt | Thời gian tải trang | Bắt đầu có ý thức, nhưng phương pháp còn thô sơ |
| **Giai đoạn 3: Tối ưu có hệ thống** | Code splitting, lazy loading, virtual list | Lighthouse, bảng Performance | FCP, LCP, TBT | Dùng công cụ chuyên nghiệp, có mục tiêu tối ưu rõ ràng |
| **Giai đoạn 4: Tối ưu liên tục** | Performance budget, kiểm tra CI/CD | RUM, Lighthouse CI | INP, CLS, giám sát toàn chuỗi | Đưa hiệu suất vào quy trình phát triển |

::: tip 📊 Bạn thấy gì từ bảng này?
Hãy cùng đọc từng dòng của bảng:

**Giai đoạn 1 → Giai đoạn 2**: Từ "không có ý thức" đến "có ý thức". Đây là bước quan trọng — nhà phát triển bắt đầu nhận ra hiệu suất là một vấn đề và cố gắng tối ưu. Nhưng biện pháp tối ưu còn thô sơ, chủ yếu dựa vào cảm giác và kinh nghiệm.

**Giai đoạn 2 → Giai đoạn 3**: Từ "thủ công" đến "có hệ thống". Đây là bước nhảy vọt về chất — bắt đầu sử dụng công cụ chuyên nghiệp (Lighthouse, bảng Performance) để chẩn đoán vấn đề hiệu suất, dùng phương pháp khoa học (code splitting, lazy loading) để tối ưu, thay vì dựa vào cảm giác.

**Giai đoạn 3 → Giai đoạn 4**: Từ "tối ưu một lần" đến "tối ưu liên tục". Khi tối ưu hiệu suất trở thành một phần của quy trình phát triển, cần thiết lập hệ thống giám sát (RUM, giám sát người dùng thực), thiết lập performance budget trong giai đoạn phát triển để ngăn chặn suy thoái.

**Tóm lại**: Sự phát triển của tối ưu hiệu suất không chỉ là "dùng thêm nhiều công nghệ", mà là **sự nâng cấp toàn bộ tư duy** — từ phản ứng bị động sang chủ động phòng ngừa, từ dựa vào cảm giác sang dựa vào dữ liệu, từ tối ưu một lần sang cải tiến liên tục.
:::

### 3.2 Giai đoạn 1: Thời nguyên thủy — Hoàn toàn chưa nghĩ đến

Tại sao gọi là "thời nguyên thủy"? Bởi vì giai đoạn này hoàn toàn chưa nghĩ đến vấn đề hiệu suất — chạy được là được. Nhóm chỉ có 3 người, làm một trang web doanh nghiệp đơn giản, dự án nhỏ, trông có vẻ không có vấn đề gì.

Nhưng khi dự án lớn dần, người dùng tăng lên, vấn đề bắt đầu lộ ra.

**Phương thức phát triển**:
- **Biện pháp tối ưu**: Không có, phát triển trực tiếp, không nghĩ đến hiệu suất
- **Công cụ giám sát**: Không có, dựa vào cảm giác đánh giá nhanh chậm
- **Chỉ số cốt lõi**: Không có

**Đặc điểm của giai đoạn này**:
- ✅ **Ưu điểm**: Phát triển nhanh, không có chi phí học tập thêm
- ❌ **Nhược điểm**: Trải nghiệm người dùng kém, khi mạng chậm hoàn toàn không dùng được

::: details Xem các vấn đề lúc đó
**Các vấn đề cụ thể gặp phải**:

1. **Ảnh quá lớn**: Product manager đã upload một ảnh Banner trang chủ 5MB, người dùng mạng di động mở trang web phải đợi 1 phút
2. **Không nén**: Tệp CSS và JS hoàn toàn không nén, dung lượng gấp 3 lần sau khi nén
3. **Không cache**: Mỗi lần truy cập đều phải tải lại tất cả tài nguyên, người dùng cũ cũng phải chờ
4. **Tải đồng bộ**: Tất cả tệp JS đều được tải đồng bộ trong `<head>`, chặn render trang

**Phản hồi của người dùng**:
- "Trang web của các bạn sao không mở được?"
- "Ảnh mãi không tải ra, toàn là trắng"
- "Nhấp nút không có phản ứng, có phải trang web bị hỏng không?"

**Giải pháp tạm thời lúc đó**:
```html
<!-- Dùng loading overlay để "lừa" người dùng -->
<div id="loading">Đang tải...</div>
<script>
  // Chỉ xóa overlay sau khi trang tải xong
  window.onload = function() {
    document.getElementById('loading').style.display = 'none'
  }
</script>
```

Đây hoàn toàn là "tự lừa mình" — trang vẫn rất chậm, chỉ là người dùng không nhìn thấy thôi.
:::

### 3.3 Giai đoạn 2: Tối ưu thủ công — Bắt đầu có ý thức

Vấn đề của thời nguyên thủy tích lũy đến một mức độ nhất định, nhóm cuối cùng đã quyết định bắt đầu tối ưu hiệu suất. Đây là một bước ngoặt quan trọng — từ "hoàn toàn không nghĩ đến" sang "có ý thức tối ưu".

Nhưng tối ưu ở giai đoạn này còn khá thô sơ, chủ yếu dựa vào nén ảnh, gộp tệp và các biện pháp đơn giản.

**Phương thức phát triển**:
- **Biện pháp tối ưu**: Nén ảnh thủ công, gộp tệp CSS/JS, giảm yêu cầu HTTP
- **Công cụ giám sát**: Bảng Network của trình duyệt, log thời gian đơn giản
- **Chỉ số cốt lõi**: Thời gian tải trang (dùng đồng hồ bấm giờ thủ công)

**Đặc điểm của giai đoạn này**:
- ✅ **Ưu điểm**: Có cải thiện rõ rệt, người dùng không còn phàn nàn điên cuồng
- ❌ **Nhược điểm**: Tối ưu không có hệ thống, dễ lặp lại vấn đề, thiếu chỉ số định lượng

::: details Xem cách làm tối ưu thủ công cụ thể
**Các biện pháp tối ưu thủ công**:

1. **Nén ảnh thủ công**:
   - Dùng Photoshop "Save for Web" từng ảnh một cách thủ công
   - Chuyển PNG sang JPEG (nén mất dữ liệu, nhưng dung lượng nhỏ hơn nhiều)
   - Thu nhỏ kích thước ảnh (ví dụ ảnh rộng 2000px thu nhỏ xuống 800px)

2. **Gộp tệp thủ công**:
   ```html
   <!-- Trước tối ưu: 10 tệp JS = 10 yêu cầu -->
   <script src="utils.js"></script>
   <script src="api.js"></script>
   <script src="component-a.js"></script>
   <script src="component-b.js"></script>
   ...（còn 6 tệp nữa）

   <!-- Sau tối ưu: 1 tệp JS đã gộp = 1 yêu cầu -->
   <script src="all.js"></script>
   ```

3. **Đưa CSS/JS xuống cuối trang**:
   ```html
   <body>
     <!-- Nội dung trang -->
     <h1>Chào mừng</h1>

     <!-- Tối ưu: đặt CSS/JS ở cuối -->
     <link rel="stylesheet" href="style.css">
     <script src="app.js"></script>
   </body>
   ```

**Cải thiện mang lại**:
- Dung lượng ảnh từ 5MB giảm xuống 500KB (giảm 90%)
- Số yêu cầu HTTP từ 30 giảm xuống 5
- Thời gian tải trang từ 30 giây giảm xuống 8 giây

**Điểm đau mới**:
1. **Khối lượng công việc thủ công lớn**: Mỗi lần cập nhật đều phải nén ảnh, gộp tệp thủ công
2. **Dễ quên**: Người mới không biết phải tối ưu, trực tiếp upload ảnh gốc
3. **Thiếu định lượng**: Chỉ biết "nhanh hơn một chút", nhưng không biết cụ thể nhanh hơn bao nhiêu
:::

### 3.4 Giai đoạn 3: Tối ưu có hệ thống — Dùng công cụ và dữ liệu để nói chuyện

Vấn đề của giai đoạn 2 (khối lượng công việc thủ công lớn, thiếu định lượng) đã làm phiền nhóm trong thời gian dài. Mãi đến sau này, nhóm đã khám phá ra các công cụ chuyên nghiệp như Lighthouse, bảng Performance, bước vào thời đại tối ưu có hệ thống.

Cốt lõi của giai đoạn này là **dùng dữ liệu để định hướng tối ưu** — trước tiên dùng công cụ chẩn đoán vấn đề, tìm ra nút thắt hiệu suất, sau đó tối ưu có mục tiêu.

**Phương thức phát triển**:
- **Biện pháp tối ưu**: Code splitting, lazy loading, virtual list, nén ảnh tự động
- **Công cụ giám sát**: Lighthouse, bảng Chrome Performance, WebPageTest
- **Chỉ số cốt lõi**: FCP (Thời gian hiển thị nội dung đầu tiên), LCP (Thời gian hiển thị nội dung lớn nhất), TBT (Tổng thời gian bị chặn)

::: details Cách làm tối ưu có hệ thống cụ thể
**Dùng Lighthouse chẩn đoán vấn đề**:

Lighthouse là công cụ kiểm tra hiệu suất tự động do Google phát triển, có thể đưa ra báo cáo hiệu suất toàn diện và đề xuất tối ưu.

```bash
# Dùng Lighthouse kiểm tra trang web
lighthouse https://www.example.com --view
```

Lighthouse sẽ đưa ra:
- **Điểm hiệu suất** (0-100 điểm)
- **Chỉ số cốt lõi** (FCP, LCP, CLS, TBT, INP)
- **Đề xuất tối ưu** (ví dụ "bật nén văn bản", "xóa JavaScript không sử dụng")

**Giải thích các chỉ số chính**:

| Chỉ số | Tên đầy đủ | Ý nghĩa | Giá trị lý tưởng |
|------|------|------|--------|
| **FCP** | First Contentful Paint | Thời gian hiển thị nội dung đầu tiên (thời điểm người dùng nhìn thấy nội dung đầu tiên) | <1.8s |
| **LCP** | Largest Contentful Paint | Thời gian hiển thị nội dung lớn nhất (thời điểm nội dung chính tải xong) | <2.5s |
| **TBT** | Total Blocking Time | Tổng thời gian bị chặn (tổng thời gian luồng chính bị chặn) | <200ms |
| **CLS** | Cumulative Layout Shift | Độ dịch chuyển bố cục tích lũy (mức độ các phần tử trang nhảy lung tung) | <0.1 |

:::

**Đặc điểm của giai đoạn này**:
- ✅ **Ưu điểm**: Tối ưu có mục tiêu, hiệu quả tốt, có chỉ số định lượng
- ❌ **Nhược điểm**: Cần học công cụ và chỉ số, có ngưỡng nhất định

::: details Xem các kỹ thuật tối ưu có hệ thống cụ thể
**1. Code Splitting (Chia tách mã)**:

Chia tệp lớn thành tệp nhỏ, tải theo nhu cầu. Ví dụ khi người dùng truy cập trang chủ, chỉ tải mã cần cho trang chủ, khi nhấp vào "Giới thiệu", mới tải mã của trang giới thiệu.

```js
// Trước tối ưu: tất cả mã trong một tệp, tải một lần
import About from './views/About.vue'
import Contact from './views/Contact.vue'
// ... còn 10 trang nữa

// Sau tối ưu: lazy loading, chỉ tải khi truy cập
const About = () => import('./views/About.vue')
const Contact = () => import('./views/Contact.vue')
```

**Hiệu quả**: Lượng mã tải ở trang chủ giảm 70%, thời gian hiển thị màn hình đầu tiên từ 5 giây giảm xuống 1.5 giây.

**2. Lazy Loading ảnh**:

Chỉ tải ảnh mà người dùng nhìn thấy, khi cuộn đến vùng hiển thị mới tải các ảnh khác.

```html
<!-- Trình duyệt hiện đại hỗ trợ lazy loading gốc -->
<img src="placeholder.jpg" data-src="real-image.jpg" loading="lazy" />
```

**Hiệu quả**: Số lượng ảnh tải ở trang chủ từ 20 giảm xuống 3, tiết kiệm 80% băng thông.

**3. Virtual Scrolling (Danh sách ảo)**:

Nếu cần render 10.000 dòng dữ liệu, đừng thực sự tạo 10.000 nút DOM, mà chỉ render 20 dòng trong vùng hiển thị, khi cuộn thì thay thế động.

```vue
<!-- Sử dụng component vue-virtual-scroller -->
<RecycleScroller
  :items="items"
  :item-size="50"
  key-field="id"
>
  <template #default="{ item }">
    <div>{{ item.name }}</div>
  </template>
</RecycleScroller>
```

**Hiệu quả**: 10.000 dòng dữ liệu từ "đứng hình" trở thành "cuộn mượt", mức sử dụng bộ nhớ giảm 95%.
:::

### 3.5 Giai đoạn 4: Tối ưu liên tục — Đưa hiệu suất vào quy trình phát triển

Khi công cụ và phương pháp đã trưởng thành, nhóm bắt đầu quan tâm đến các vấn đề sâu hơn: làm thế nào để ngăn chặn suy thoái hiệu suất? Làm thế nào để hiệu suất trở thành một phần của quy trình phát triển?

Cốt lõi của giai đoạn này là **thiết lập hệ thống giám sát và ngân sách hiệu suất** — không phải tối ưu sau khi上线, mà là phòng ngừa vấn đề hiệu suất ngay từ giai đoạn phát triển.

**Phương thức phát triển**:
- **Biện pháp tối ưu**: Performance Budget (Ngân sách hiệu suất), Lighthouse CI, Giám sát người dùng thực (RUM)
- **Công cụ giám sát**: Lighthouse CI, WebPageTest API, Google Analytics
- **Chỉ số cốt lõi**: INP (Độ trễ tương tác), CLS (Độ dịch chuyển bố cục), giám sát toàn chuỗi

::: details Cách làm tối ưu liên tục cụ thể
**1. Thiết lập Performance Budget**:

Đặt giới hạn trong cấu hình đóng gói, vượt quá sẽ báo lỗi, ngăn chặn "vô tình đưa vào tệp lớn".

```js
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // Giới hạn mỗi tệp không vượt quá 200KB
        chunkFileNames: 'js/[name]-[hash].js',
      }
    },
    // Cảnh báo khi vượt quá 200KB
    chunkSizeWarningLimit: 200
  }
})
```

**2. Lighthouse CI**:

Mỗi lần commit mã, tự động chạy kiểm tra Lighthouse, nếu điểm hiệu suất giảm, sẽ ngăn chặn merge.

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://staging.example.com
          budgetPath: ./budget.json
```

**3. Giám sát người dùng thực (RUM)**:

Thu thập dữ liệu hiệu suất từ trình duyệt của người dùng thực, thay vì chỉ kiểm tra trong môi trường phát triển.

```js
// Gửi dữ liệu hiệu suất đến máy chủ
const perfData = performance.getEntriesByType('navigation')[0]
const lcp = performance.getEntriesByType('largest-contentful-paint')[0]

fetch('/api/perf', {
  method: 'POST',
  body: JSON.stringify({
    fcp: perfData.loadEventEnd - perfData.fetchStart,
    lcp: lcp.renderTime || lcp.loadTime,
    url: window.location.href
  })
})
```

**Hiệu quả**:
- Có thể kịp thời phát hiện suy thoái hiệu suất (ví dụ một lần commit khiến LCP từ 2 giây thành 5 giây)
- Có thể hiểu trải nghiệm của người dùng thực (thay vì "trạng thái lý tưởng" trong môi trường phát triển)
- Có thể tối ưu có mục tiêu cho 10% người dùng chậm nhất
:::

**Giai đoạn này sẽ làm gì?**

1. **Performance Budget**: Giới hạn kích thước tệp, số lượng yêu cầu, vượt quá sẽ báo động
2. **Kiểm tra CI/CD**: Mỗi lần commit mã tự động kiểm tra hiệu suất, suy thoái sẽ ngăn chặn merge
3. **Giám sát người dùng thực**: Thu thập dữ liệu hiệu suất của người dùng thực, liên tục cải thiện
4. **Báo cáo hiệu suất định kỳ**: Hàng tuần/hàng tháng tạo báo cáo hiệu suất, theo dõi xu hướng

---

## 4. Các nút thắt hiệu suất phổ biến và giải pháp

Đã nói nhiều lý thuyết như vậy, hãy xem các vấn đề hiệu suất phổ biến nhất trong phát triển thực tế và cách giải quyết.

### 4.1 Ảnh tải chậm

**Biểu hiện vấn đề**: Ảnh mãi không tải ra, hoặc trong quá trình tải trang bị nhảy.

**Nguyên nhân**:
- Dung lượng ảnh quá lớn (ảnh gốc độ phân giải cao)
- Kích thước ảnh quá lớn (ảnh rộng 2000px hiển thị ở 200px)
- Không có lazy loading (tải tất cả ảnh một lần)

**Giải pháp**:

1. **Sử dụng định dạng ảnh hiện đại** (WebP, AVIF):

```html
<!-- Hiện đại: định dạng WebP, dung lượng nhỏ hơn 30-70% -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Ảnh">
</picture>
```

2. **Ảnh responsive** (tải kích thước khác nhau theo thiết bị):

```html
<!-- Thiết bị nhỏ tải ảnh nhỏ, thiết bị lớn tải ảnh lớn -->
<img
  src="image-800.jpg"
  srcset="image-400.jpg 400w,
          image-800.jpg 800w,
          image-1200.jpg 1200w"
  sizes="(max-width: 600px) 400px,
         (max-width: 1200px) 800px,
         1200px"
  alt="Ảnh responsive">
```

3. **Lazy loading** (tải khi người dùng cuộn đến):

```html
<!-- Hiện đại: lazy loading gốc -->
<img src="placeholder.jpg" data-src="real-image.jpg" loading="lazy" />
```

👇 **Thử thực hành**:
Demo dưới đây so sánh sự khác biệt giữa lazy loading và không lazy loading. Quan sát các yêu cầu mạng:

<ImageOptimizationDemo />

### 4.2 Màn hình đầu tiên tải chậm

**Biểu hiện vấn đề**: Người dùng mở trang web, thời gian màn hình trắng rất lâu.

**Nguyên nhân**:
- Tải quá nhiều mã không cần thiết
- Đường dẫn render quan trọng bị chặn
- Không thực hiện code splitting

**Giải pháp**:

1. **Code Splitting**:

```js
// Route lazy loading: chỉ tải khi truy cập
const routes = [
  {
    path: '/about',
    component: () => import('./views/About.vue')  // Chỉ tải khi truy cập /about
  }
]
```

2. **Preload tài nguyên quan trọng**:

```html
<!-- Thông báo trước cho trình duyệt: những tài nguyên này quan trọng, ưu tiên tải -->
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="hero-image.jpg" as="image">
```

3. **Inline CSS quan trọng**:

```html
<!-- Nhúng trực tiếp CSS cần cho màn hình đầu tiên vào HTML -->
<style>
  /* Kiểu dáng quan trọng cho màn hình đầu tiên */
  .hero { background: #000; color: #fff; }
</style>
```

### 4.3 Cuộn trang bị giật

**Biểu hiện vấn đề**: Khi cuộn trang bị giật từng khung, không mượt.

**Nguyên nhân**:
- Render quá nhiều nút DOM (ví dụ 10.000 dòng dữ liệu)
- Trình xử lý sự kiện cuộn có tính toán phức tạp
- Thường xuyên kích hoạt tính toán bố cục

**Giải pháp**:

1. **Virtual Scrolling**:

```vue
<!-- Chỉ render nội dung trong vùng hiển thị -->
<RecycleScroller
  :items="10000"
  :item-size="50"
>
  <template #default="{ item }">
    <div>{{ item.name }}</div>
  </template>
</RecycleScroller>
```

👇 **Xem thực hành**:
Demo dưới đây so sánh sự khác biệt về hiệu suất giữa danh sách thường và virtual list:

<VirtualScrollingDemo />

2. **Throttle sự kiện cuộn**:

```js
// Giới hạn tần suất kích hoạt sự kiện cuộn (tối đa mỗi 100ms kích hoạt một lần)
const throttledScroll = throttle(() => {
  updatePosition()
}, 100)

window.addEventListener('scroll', throttledScroll)
```

3. **Sử dụng CSS `will-change`**:

```css
/* Thông báo trước cho trình duyệt: phần tử này sẽ thay đổi, hãy chuẩn bị */
.scroll-container {
  will-change: transform;
}
```

### 4.4 Phản hồi khi nhấp chậm

**Biểu hiện vấn đề**: Sau khi nhấp nút, phải đợi vài giây mới có phản ứng.

**Nguyên nhân**:
- Trình xử lý sự kiện nhấp có tính toán phức tạp (chặn luồng chính)
- Không sử dụng debounce (người dùng nhấp nhanh nhiều lần, kích hoạt tính toán nhiều lần)

**Giải pháp**:

1. **Debounce sự kiện nhấp**:

```js
// Chỉ thực thi sau khi người dùng ngừng nhấp 300ms
const debouncedClick = debounce(() => {
  submitForm()
}, 300)

button.addEventListener('click', debouncedClick)
```

2. **Sử dụng Web Worker** (đưa tính toán vào luồng nền):

```js
// Luồng chính
const worker = new Worker('calculator.js')
button.addEventListener('click', () => {
  worker.postMessage({ data: largeData })
})

worker.onmessage = (e) => {
  // Tính toán hoàn thành, hiển thị kết quả
  showResult(e.data.result)
}

// calculator.js (Luồng Worker)
self.onmessage = (e) => {
  const result = heavyCalculation(e.data.data)
  self.postMessage({ result })
}
```

---

## 5. Công cụ giám sát hiệu suất

Tối ưu hiệu suất không phải là công việc một lần, cần giám sát liên tục. Dưới đây là các công cụ phổ biến.

### 5.1 Công cụ nhà phát triển của trình duyệt

**Chrome DevTools** là công cụ phân tích hiệu suất phổ biến nhất:

- **Bảng Network**: Xem tình trạng tải tài nguyên
- **Bảng Performance**: Phân tích hiệu suất thời gian chạy (FPS, hoạt động luồng chính)
- **Lighthouse**: Tạo báo cáo hiệu suất chỉ với một cú nhấp

::: tip Cách sử dụng bảng Performance
1. Mở Chrome DevTools (F12)
2. Chuyển sang bảng Performance
3. Nhấp nút "Record"
4. Thao tác trên trang web (cuộn, nhấp, v.v.)
5. Nhấp "Stop" để dừng ghi
6. Phân tích kết quả: xem FPS (tốc độ khung hình), hoạt động luồng chính, long task, v.v.
:::

### 5.2 Lighthouse

**Lighthouse** là công cụ kiểm tra hiệu suất tự động do Google phát triển:

```bash
# Sử dụng dòng lệnh
lighthouse https://www.example.com --view

# Hoặc sử dụng trong Chrome DevTools
# Mở DevTools → Lighthouse → Nhấp "Analyze page load"
```

Lighthouse sẽ đưa ra:
- Điểm hiệu suất (0-100 điểm)
- Chỉ số cốt lõi (FCP, LCP, CLS, TBT, INP)
- Đề xuất tối ưu (sắp xếp theo mức độ ảnh hưởng)

### 5.3 WebPageTest

**WebPageTest** là công cụ kiểm tra hiệu suất trực tuyến, có thể kiểm tra từ nhiều địa điểm, nhiều thiết bị:

```bash
# Truy cập https://www.webpagetest.org
# Nhập URL, chọn địa điểm kiểm tra và thiết bị, nhấp "Start Test"
```

WebPageTest sẽ đưa ra:
- Biểu đồ thác nước (Waterfall): dòng thời gian tải của từng tài nguyên
- So sánh video: video quá trình tải trước và sau khi tối ưu
- Đề xuất tối ưu

---

## 6. Danh sách kiểm tra tối ưu hiệu suất

Dưới đây là danh sách kiểm tra tối ưu hiệu suất thực tế, bạn có thể tối ưu trang web của mình theo thứ tự này:

### 6.1 Tối ưu tải

- ✅ **Nén ảnh**: Sử dụng định dạng WebP, chất lượng nén 80-85%
- ✅ **Ảnh responsive**: Tải kích thước ảnh khác nhau theo thiết bị
- ✅ **Lazy loading**: Lazy loading ảnh và component, chỉ tải nội dung hiển thị
- ✅ **Code splitting**: Chia tách mã theo route, tải theo nhu cầu
- ✅ **Nén mã**: Bật nén Gzip/Brotli
- ✅ **Sử dụng CDN**: Đưa tài nguyên tĩnh lên CDN, tăng tốc tải
- ✅ **Preload tài nguyên quan trọng**: Sử dụng `<link rel="preload">`

### 6.2 Tối ưu render

- ✅ **Giảm reflow và repaint**: Sử dụng `transform` và `opacity` thay cho `top` và `width`
- ✅ **Virtual list**: Sử dụng virtual scrolling khi có nhiều dữ liệu
- ✅ **CSS animation**: Ưu tiên dùng CSS animation, thay vì JavaScript animation
- ✅ **Tối ưu đường dẫn render quan trọng**: Inline CSS quan trọng, trì hoãn tải CSS không quan trọng
- ✅ **Tránh @import**: `@import` sẽ chặn render, chuyển sang dùng `<link>`

### 6.3 Tối ưu tương tác

- ✅ **Debounce và throttle**: Sử dụng debounce/throttle cho sự kiện cuộn, nhập liệu, resize
- ✅ **Web Worker**: Đưa tính toán phức tạp vào luồng nền
- ✅ **Time slicing**: Chia nhiệm vụ lớn thành nhiệm vụ nhỏ, tránh long task
- ✅ **Tránh bố cục đồng bộ**: Không đọc thuộc tính bố cục trong vòng lặp (như `offsetHeight`)

### 6.4 Tối ưu cache

- ✅ **HTTP cache**: Cấu hình Cache-Control và ETag
- ✅ **Service Worker**: Cache tài nguyên tĩnh, hỗ trợ truy cập ngoại tuyến
- ✅ **LocalStorage**: Cache dữ liệu API, giảm yêu cầu
- ✅ **Cache bộ nhớ**: Sử dụng `Map`/`Object` cache kết quả tính toán

### 6.5 Tối ưu giám sát

- ✅ **Lighthouse CI**: Tự động kiểm tra hiệu suất mỗi lần commit mã
- ✅ **Giám sát người dùng thực**: Thu thập dữ liệu hiệu suất của người dùng thực
- ✅ **Performance budget**: Đặt giới hạn kích thước tệp, vượt quá báo động
- ✅ **Báo cáo hiệu suất định kỳ**: Hàng tuần/hàng tháng tạo báo cáo xu hướng hiệu suất

---

## 7. Tổng kết

Hãy dùng một bảng để ôn lại các khái niệm cốt lõi về tối ưu hiệu suất frontend:

| Khái niệm | Giải thích một câu | Vấn đề giải quyết | Biện pháp phổ biến |
|------|-----------|-----------|----------|
| **Tối ưu tải** | Làm cho tài nguyên tải nhanh hơn | Màn hình đầu tiên chậm, thời gian chờ lâu | Nén ảnh, CDN, code splitting, lazy loading |
| **Tối ưu render** | Làm cho trang "vẽ" nhanh hơn | Cuộn giật, nhấp chậm | Virtual list, giảm reflow/repaint, CSS animation |
| **Tối ưu tương tác** | Làm cho phản hồi nhanh hơn | Nhấp không có phản ứng, thao tác giật lag | Debounce/throttle, Web Worker, time slicing |
| **Tối ưu cache** | Tránh tải lại không cần thiết | Truy cập lại vẫn chậm | HTTP cache, Service Worker, LocalStorage |
| **Tối ưu giám sát** | Liên tục phát hiện vấn đề | Suy thoái hiệu suất | Lighthouse, RUM, performance budget |

::: info Lời kết
Tối ưu hiệu suất là một chủ đề liên tục phát triển, công cụ có thể thay đổi, nhưng ý tưởng cốt lõi không thay đổi: **đứng từ góc nhìn của người dùng để suy nghĩ, giảm thời gian chờ đợi, làm cho thao tác mượt mà hơn**.

Hiểu được những nguyên lý cơ bản này, dù công nghệ có thay đổi thế nào, bạn cũng có thể nhanh chóng làm quen và ứng phó thoải mái.

Hy vọng bài viết này có thể giúp bạn xây dựng nhận thức tổng thể về tối ưu hiệu suất frontend. Khi bạn gặp vấn đề về hiệu suất trong dự án thực tế, bạn sẽ biết bắt đầu từ đâu, cách định vị và cách giải quyết.
:::
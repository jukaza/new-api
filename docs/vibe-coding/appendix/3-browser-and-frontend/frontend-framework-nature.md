# Bản chất của Framework Frontend

> 💡 **Hướng dẫn học**: Bài viết này sẽ trả lời một câu hỏi nền tảng — **Framework frontend (Vue, React, Svelte v.v.) rốt cuộc đang làm gì?** Nếu bạn chỉ mới học HTML, CSS và một chút JavaScript, hoàn toàn không sao, chúng ta sẽ bắt đầu từ đầu.

Trước khi bắt đầu, hãy đảm bảo bạn đã biết hai khái niệm cơ bản sau. Nếu chưa chắc, có thể xem trước các chương tương ứng:

- **HTML**: Bộ xương của trang web, định nghĩa những thành phần nào có trên trang (tiêu đề, đoạn văn, nút bấm, hình ảnh...). Xem thêm tại [Bố cục HTML và CSS](./html-css-layout.md).
- **JavaScript**: Ngôn ngữ lập trình giúp trang web "chuyển động", có thể sửa đổi nội dung trang và phản hồi thao tác người dùng. Xem thêm tại [Hướng dẫn chuyên sâu JavaScript](./javascript-deep-dive.md).

Còn một khái niệm sẽ xuất hiện thường xuyên ở phía sau, chúng ta sẽ giải thích đầy đủ ở đây trước.

### DOM là gì?

DOM là viết tắt của Document Object Model (Mô hình Đối tượng Tài liệu).

Khi bạn mở một trang web trong trình duyệt, điều đầu tiên trình duyệt làm là đọc mã HTML. Sau khi đọc xong, trình duyệt không trực tiếp dùng văn bản HTML để hiển thị trang, mà trước tiên **chuyển mã HTML thành một cấu trúc cây**, lưu trong bộ nhớ. Cây này gọi là cây DOM.

Mỗi nút (Node) trên cây tương ứng với một thẻ trong HTML. Mối quan hệ lồng nhau giữa các thẻ, trong cây DOM trở thành mối quan hệ nút cha và nút con.

👇 **Thử tương tác**:
Di chuột vào mã HTML bên trái, nút tương ứng trong cây DOM bên phải sẽ được highlight. Ngược lại cũng vậy. Mỗi dòng thẻ HTML đều tương ứng với một nút trên cây DOM.

<WhatIsDomDemo />

**Tại sao cần hiểu DOM?** Vì cách JavaScript sửa đổi trang chính là thao tác trên cây DOM này — thêm nút, xóa nút, sửa nội dung nút. Và công việc cốt lõi mà framework frontend làm chính là tự động hóa các thao tác DOM này cho bạn. Chúng ta sẽ nhắc đến DOM nhiều lần ở phía sau, hiểu nó là nền tảng để hiểu nguyên lý của framework.

---

## 0. Mở đầu: "Framework frontend" là gì?

Trước hết giải thích từ "framework". Trong lập trình, **Framework (khung làm việc)** là một bộ mã và quy tắc đã được viết sẵn, nó quy định cách mã của bạn nên được tổ chức và chạy như thế nào. Bạn viết mã theo cách của nó, nó giúp bạn xử lý lượng lớn công việc lặp đi lặp lại và phức tạp ở tầng dưới.

**Framework frontend**, chính là framework chuyên giúp bạn **xây dựng giao diện trang web**. Hiện nay phổ biến nhất có Vue, React, Svelte, Angular.

Vậy chúng rốt cuộc giúp bạn giải quyết vấn đề gì? Ba thẻ卡片 dưới đây tóm tắt logic cốt lõi:

<FrameworkMotivationDemo />

Tiếp theo chúng ta sẽ triển khai từng bước, bắt đầu từ vấn đề cơ bản nhất.

---

## 1. Vấn đề cốt lõi: Dữ liệu thay đổi, giao diện xử lý thế nào?

### 1.1 Trước hết hãy hiểu rõ "dữ liệu" và "giao diện" là gì

Trong bất kỳ ứng dụng web nào, đều có hai thứ tồn tại đồng thời:

- **Dữ liệu (Data / State)**: Thông tin được lưu trữ bên trong chương trình. Ví dụ "giỏ hàng có 3 sản phẩm", "tên người dùng là Nguyễn Văn A", "đang chọn tab thứ 2". Những dữ liệu này được lưu trong biến JavaScript, người dùng không nhìn thấy chúng.
- **Giao diện (UI)**: Những gì người dùng nhìn thấy trên màn hình. Ví dụ trang hiển thị "Giỏ hàng(3)", hiển thị "Xin chào, Nguyễn Văn A", tab thứ 2 được highlight. Đây là hiệu ứng thị giác do các phần tử HTML trình bày.

**Giữa dữ liệu và giao diện có mối tương ứng**: Dữ liệu là "3 sản phẩm", giao diện nên hiển thị "3". Nếu dữ liệu thay đổi thành "4 sản phẩm", giao diện cũng nên theo đó thành "4".

Vấn đề là: **Quá trình "thay đổi theo" này, ai chịu trách nhiệm?**

👇 **Thử nhấp xem**:
Nhấn nút "Thêm sản phẩm", chú ý quan sát: dữ liệu (bên trái) đã thay đổi, nhưng giao diện (bên phải) không cập nhật theo — chúng đã "ngắt kết nối". Nhấn "Đồng bộ giao diện" để sửa thủ công.

<DataUIGapDemo />

### 1.2 Tại sao biến JavaScript thay đổi mà giao diện không tự động cập nhật?

Đây là điểm khiến người mới học dễ bối rối nhất, chúng ta sẽ giải thích nguyên lý tầng dưới từng bước một.

Trong JavaScript, biến đơn giản là một vùng nhớ, dùng để lưu trữ dữ liệu. Khi bạn thực thi `count = count + 1`, JavaScript engine làm một việc rất đơn giản: thay đổi giá trị tại vị trí count trong bộ nhớ từ 3 thành 4. **Xong bước này là kết thúc, không còn gì xảy ra nữa.**

Còn nội dung hiển thị trên trang (ví dụ nút DOM `<span>3</span>`) được lưu ở một vùng nhớ hoàn toàn khác. Khi JavaScript engine sửa đổi biến, nó hoàn toàn không biết trên trang có một nút DOM đang hiển thị giá trị của biến đó, cũng không có cơ chế nào để nó kiểm tra.

Vì vậy nguyên nhân cốt lõi là: **Biến JavaScript và nút DOM là hai vùng nhớ độc lập, không có bất kỳ cơ chế liên kết tự động nào giữa chúng.** Sửa đổi biến chỉ thay đổi vùng nhớ chứa biến, vùng nhớ chứa nút DOM không bị ảnh hưởng gì cả.

```javascript
let count = 3

// Trên trang có một nút DOM hiển thị giá trị count:
// <span id="counter">3</span>

count = 4
// JavaScript engine đã làm gì?
//   → Thay đổi giá trị biến count trong bộ nhớ từ 3 thành 4
//   → Xong. Hết.
// Trên trang <span> vẫn hiển thị "3"
```

Nếu bạn muốn hiển thị trên trang cũng thành "4", bạn phải **viết thêm mã**, tự tìm nút DOM đó, rồi sửa nội dung của nó:

```javascript
count = 4  // Bước 1: Sửa biến

// Bước 2: Bạn phải tự viết — tìm nút DOM, sửa chữ thành giá trị mới
document.getElementById('counter').textContent = count
```

Nếu trên trang có 5 vị trí hiển thị giá trị count (số lượng giỏ hàng, danh sách sản phẩm, tổng giá, tạm tính, thông báo trạng thái), bạn cần viết 5 đoạn mã như vậy. **Bỏ sót bất kỳ đoạn nào, vị trí đó sẽ vẫn hiển thị giá trị cũ, người dùng nhìn thấy thông tin sai.**

### 1.3 Framework đã làm gì? Hai bước thiết lập kết nối tự động

Framework có thể tự động đồng bộ dựa vào **phối hợp hai bước** — thiếu một không được.

**Bước 1: Bạn "đăng ký" trong模板 những nơi cần hiển thị biến này**

Trong模板 HTML của framework, bạn dùng cú pháp như `{{ count }}` để đánh dấu "nơi này cần hiển thị giá trị count":

```html
<!-- Template Vue -->
<span>Giỏ hàng: {{ count }} sản phẩm</span>    <!-- Vị trí A: Tôi muốn hiển thị count -->
<span>Tổng giá: ¥{{ count * 99 }}</span>   <!-- Vị trí B: Tôi cũng dùng count -->
<span>{{ count > 5 ? 'Quá nhiều' : 'Bình thường' }}</span>  <!-- Vị trí C: Tôi cũng dùng count -->
```

Khi framework render trang lần đầu, nó sẽ ghi lại "mối quan hệ đăng ký": **Vị trí A, B, C đều phụ thuộc count**.

**Bước 2: Framework giám sát biến, khi thay đổi thì tra bảng đăng ký, tự động cập nhật**

Framework dùng `Proxy` (proxy) tích hợp sẵn trong JavaScript để "bao bọc" biến của bạn, biến nó thành một "biến được giám sát". Khi bạn sửa đổi biến này, Proxy sẽ âm thầm làm thêm một việc trong lúc gán giá trị: thông báo cho framework "count đã thay đổi". Sau khi nhận được thông báo, framework tra bảng đăng ký từ bước 1, cập nhật cả ba vị trí A, B, C.

```
JS nguyên bản:
  Bạn viết HTML → <span id="counter">3</span> (không có kết nối nào với biến)
  Bạn sửa biến → count = 4 → Xong, giao diện không phản ứng gì
  Bạn tự bổ sung → document.getElementById('counter').textContent = 4 → Giao diện mới cập nhật

Framework Vue:
  Bạn viết template → <span>{{ count }}</span> (Framework ghi nhớ: nơi này phụ thuộc count)
  Bạn sửa biến → count = 4 → Proxy拦截 → Thông báo framework → Framework tra bảng đăng ký → Tự động cập nhật A/B/C
```

Đó là lý do "chỉ có framework mới có thể tự động đồng bộ" — `<span>` trong HTML nguyên bản và biến JS hoàn toàn không có kết nối nào, cú pháp模板 (`{{ }}`) của framework mới là chìa khóa thiết lập kết nối này. Bạn viết `{{ count }}`, framework mới biết nơi này cần hiển thị count; framework mới có thể khi count thay đổi, chính xác tìm đến đây và cập nhật nó.

👇 **Thử nhấp xem**:
Trước tiên chọn "JavaScript nguyên bản", sau khi nhấn "Thực thi" chú ý quan sát — biến đã thay đổi nhưng giao diện đứng im, bạn phải từng bước tự đồng bộ từng vị trí. Rồi chuyển sang "Sử dụng framework", cũng nhấn "Thực thi" — biến vừa thay đổi, framework tự động hoàn thành tất cả bước, giao diện lập tức theo kịp.

<WhyNoAutoSyncDemo />

### 1.4 So sánh: Hiệu quả thực tế của đồng bộ thủ công vs đồng bộ tự động

Sau khi hiểu nguyên lý, chúng ta hãy xem trong một kịch bản hơi phức tạp hơn, sự khác biệt giữa đồng bộ thủ công và đồng bộ tự động lớn đến mức nào.

👇 **Thử nhấp xem**:
Bên trái là cách "đồng bộ thủ công" khi không có framework — mỗi vùng hiển thị bạn cần nhấn nút "Đồng bộ" riêng để cập nhật. Bên phải là cách "đồng bộ tự động" khi có framework — bạn chỉ cần nhấn "Thêm sản phẩm", tất cả vùng hiển thị tự động cập nhật. Thử cố tình không đồng bộ một vùng bên trái, xem điều gì xảy ra.

<ManualVsAutoSyncDemo />

**Đây chính là nguyên nhân tồn tại cơ bản của framework frontend: Thêm cho biến JavaScript khả năng "tự động thông báo giao diện cập nhật khi bị sửa đổi", tiêu diệt lỗi do đồng bộ thủ công.**

---

## 2. Tư tưởng cốt lõi của framework: Dùng dữ liệu mô tả giao diện

### 2.1 Sự khác biệt giữa hai cách viết

Sau khi hiểu giá trị của "tự động đồng bộ", chúng ta xem framework cụ thể thực hiện như thế nào.

Trong thời kỳ chưa có framework (ví dụ dùng jQuery), mã được viết như sau — bạn từng bước chỉ cho trình duyệt nên làm gì:

```javascript
// Bước 1: Tìm phần tử có id là counter trên trang
var element = document.getElementById('counter')
// Bước 2: Sửa nội dung chữ của phần tử này thành giá trị mới
element.textContent = '4'
// Bước 3: Tìm phần tử khác, cũng sửa
document.getElementById('total').textContent = '¥396'
// Bước 4: Nếu số lượng lớn hơn 5, còn phải sửa thông báo trạng thái...
```

Cách viết này gọi là **Imperative (Mệnh lệnh)** — bạn đang "ra lệnh" cho trình duyệt từng bước thực hiện thao tác.

Khi có framework, mã trở thành như sau — bạn chỉ mô tả "giao diện nên trông như thế nào":

```html
<!-- Tôi không quan tâm giá trị này cập nhật lên trang thế nào -->
<!-- Tôi chỉ nói: nơi này nên hiển thị giá trị count -->
<span>{{ count }}</span>
<span>Tổng giá: ¥{{ count * 99 }}</span>
<span v-if="count > 5">Sản phẩm quá nhiều!</span>
```

Cách viết này gọi là **Declarative (Khai báo)** — bạn đang "khai báo" trạng thái cuối cùng của giao diện, còn làm sao để đạt được trạng thái đó, framework tự xử lý.

### 2.2 Công thức cốt lõi: UI = f(State)

Tất cả framework frontend hiện đại — dù là Vue, React hay Svelte — đều tuân theo cùng một tư tưởng cốt lõi, có thể diễn đạt bằng một công thức:

> **UI = f(State)**

Công thức này có nghĩa:

- **State (trạng thái)**: Dữ liệu ứng dụng của bạn. Chính là những biến trong JavaScript: giỏ hàng có bao nhiêu sản phẩm, người dùng đã đăng nhập chưa, trang hiện tại là trang nào...
- **f (hàm)**: Cơ chế render của framework. Nó biết cách chuyển dữ liệu thành giao diện.
- **UI (giao diện)**: Kết quả cuối cùng mà người dùng nhìn thấy trên màn hình.

**Ý nghĩa**: Cho trước một tập dữ liệu (State), thông qua xử lý của framework (f), có thể xác định được giao diện tương ứng (UI). Dữ liệu thay đổi, giao diện theo đó thay đổi. Nhà phát triển chỉ cần quan tâm đến dữ liệu, không cần quan tâm giao diện cập nhật thế nào.

👇 **Thử nhấp xem**:
Sửa đổi dữ liệu (State) bên trái, quan sát giao diện (UI) bên phải tự động thay đổi theo như thế nào. Đây chính là biểu hiện trực quan của `UI = f(State)`.

<DeclarativeFormulaDemo />

### 2.3 Tại sao Declarative tốt hơn Imperative?

Ưu điểm của cách viết declarative nằm ở:

| Tiêu chí so sánh | Imperative (Không có framework) | Declarative (Có framework) |
| :--- | :--- | :--- |
| **Lượng mã** | Mỗi lần cập nhật đều phải viết mã thao tác cụ thể | Chỉ viết模板 một lần, framework tự động xử lý |
| **Xác suất lỗi** | Dễ bỏ sót cập nhật ở vị trí nào đó | Framework đảm bảo tất cả vị trí đều được cập nhật |
| **Khả năng đọc** | Mã trộn lẫn nhiều thao tác DOM | Mã mô tả rõ ràng cấu trúc giao diện |
| **Chi phí bảo trì** | Sửa một tính năng phải đổi nhiều nơi | Chỉ cần sửa logic dữ liệu, giao diện tự động theo |

Nói đơn giản: Declarative giúp bạn tập trung vào "logic nghiệp vụ" (dữ liệu thay đổi thế nào), không phải lo lắng về việc "giao diện cập nhật ra sao" — việc lặp đi lặp lại và dễ gây lỗi.

---

## 3. Hệ thống Reactive: Framework biết dữ liệu thay đổi như thế nào?

### 3.1 "Reactive" là gì?

Phía trên đã nói "dữ liệu thay đổi, giao diện tự động cập nhật". Nhưng có một vấn đề kỹ thuật: **Bản thân JavaScript không có khả năng "tự động thông báo cho người khác khi biến bị sửa đổi".**

Bạn viết `count = 4`, JavaScript chỉ thay giá trị `count` từ 3 thành 4, không tự động báo cho ai cả. Framework cần một cơ chế để "phát hiện" bạn đã sửa đổi dữ liệu.

**Reactivity (Tính phản ứng)** chính là tên gọi chung cho cơ chế này: khi dữ liệu thay đổi, hệ thống có thể tự động cảm nhận sự thay đổi và thực hiện thao tác cập nhật tương ứng.

### 3.2 Ba cách triển khai khác nhau

Các framework khác nhau sử dụng các giải pháp kỹ thuật khác nhau để triển khai reactivity. Đây cũng là điểm khác biệt căn bản nhất giữa Vue, React và Svelte.

**Cách 1: Proxy拦截 (Cách làm của Vue)**

Vue sử dụng cơ chế `Proxy` tích hợp sẵn trong JavaScript. `Proxy` có thể tự động thực thi một đoạn mã bạn chỉ định khi bạn đọc hoặc sửa đổi thuộc tính của một đối tượng.

Vue bao bọc đối tượng dữ liệu của bạn bằng `Proxy`. Khi bạn thực thi `count = 4`, `Proxy` sẽ拦截 thao tác ghi này, thông báo cho Vue: "giá trị count đã thay đổi", sau đó Vue đi cập nhật tất cả phần giao diện sử dụng `count`.

Bạn với tư cách là nhà phát triển không cần làm thêm bất cứ điều gì — chỉ cần gán trực tiếp, Vue tự động cảm nhận.

**Cách 2: Gọi hàm tường minh (Cách làm của React)**

React không sử dụng `Proxy`. Nó yêu cầu bạn phải thông qua một hàm chuyên dụng để sửa đổi dữ liệu:

```javascript
// Cách viết React
const [count, setCount] = useState(0)

// Không thể viết trực tiếp count = 4 (React sẽ không cảm nhận được)
// Phải gọi setCount:
setCount(4)
```

Chỉ khi bạn gọi `setCount()`, React mới biết dữ liệu đã thay đổi, mới đi cập nhật giao diện. Nếu bạn viết trực tiếp `count = 4`, React hoàn toàn không biết, giao diện sẽ không cập nhật.

Cách này "tường minh" hơn — mỗi lần dữ liệu thay đổi đều do bạn chủ động báo cho framework, không có cập nhật ngoài ý muốn.

**Cách 3: Phân tích bằng compiler (Cách làm của Svelte)**

Svelte chọn một hướng đi hoàn toàn khác. Nó có một compiler (trình biên dịch), trước khi mã của bạn chạy, compiler sẽ phân tích mã nguồn của bạn.

Khi compiler thấy bạn viết câu lệnh gán như `count += 1`, nó sẽ tự động chèn một đoạn mã "thông báo giao diện cập nhật" sau dòng này. Nghĩa là, khi mã chạy, hành động "thông báo" đã được compiler sắp xếp sẵn từ trước.

Mã của bạn trông giống như phép gán JavaScript bình thường, nhưng trong mã đã biên dịch có thêm logic cập nhật giao diện.

👇 **Thử nhấp xem**:
Chọn tab framework khác nhau, nhấn "Sửa dữ liệu", quan sát từng framework "dưới nắp ca-pô" trải qua những bước nào để hoàn thành phát hiện thay đổi dữ liệu và cập nhật giao diện.

<ReactivityMechanismDemo />

### 3.3 So sánh ba cách

| Tiêu chí so sánh | Vue (Proxy代理) | React (Gọi tường minh) | Svelte (Compiler) |
| :--- | :--- | :--- | :--- |
| **Cách viết của dev** | Gán trực tiếp `count = 4` | Phải dùng `setCount(4)` | Gán trực tiếp `count = 4` |
| **Thời điểm phát hiện thay đổi** | Tự động拦截 lúc chạy | Dev chủ động thông báo | Chèn mã thông báo lúc biên dịch |
| **Chi phí hiệu năng lúc chạy** | Proxy có chi phí拦截 nhỏ | setState调度 có chi phí nhỏ | Gần như không có chi phí thêm |
| **Độ khó debug** | Trung bình | Dòng dữ liệu rõ ràng, tương đối dễ | Cần hiểu mã sau biên dịch |
| **Phù hợp** | Theo đuổi hiệu suất phát triển và cách viết tự nhiên | Theo đuổi dòng dữ liệu có thể dự đoán | Theo đuổi hiệu năng chạy cực đỉnh |

Ba cách không có đúng sai tuyệt đối. Vue viết tự nhiên nhất, React có dòng dữ liệu dễ kiểm soát nhất, Svelte có hiệu năng chạy tốt nhất. Chọn cái nào phụ thuộc vào nhu cầu cụ thể của dự án.

---

## 4. Component: Chia giao diện thành các小块 có thể tái sử dụng

### 4.1 Tại sao phải chia?

Một trang web hoàn chỉnh có thể có thanh điều hướng, sidebar, vùng nội dung, ô tìm kiếm, avatar người dùng, các nút bấm... Nếu tất cả mã viết trong một file, file đó sẽ rất dài và rất khó bảo trì.

**Component (Thành phần)** chính là chia giao diện thành từng小块 độc lập, mỗi小块 quản lý dữ liệu riêng, giao diện riêng, logic riêng.

Ví dụ một trang thương mại điện tử có thể chia thành các component:

- Component `NavBar`: chịu trách nhiệm thanh điều hướng phía trên
- Component `SearchBox`: chịu trách nhiệm ô tìm kiếm
- Component `ProductCard`: chịu trách nhiệm một thẻ sản phẩm
- Component `ShoppingCart`: chịu trách nhiệm giỏ hàng

Mỗi component đều độc lập. `ProductCard` không cần biết mã trong `NavBar` viết như thế nào, nó chỉ cần lo phần của mình.

### 4.2 Ba lợi ích của component

**Lợi ích 1: Tái sử dụng.** Một component `ProductCard` sau khi viết xong có thể dùng 100 lần trên trang — mỗi lần truyền dữ liệu sản phẩm khác nhau, sẽ render ra thẻ sản phẩm khác nhau. Không cần copy-paste 100 đoạn mã HTML.

**Lợi ích 2: Đóng gói.** Dữ liệu và logic bên trong component là độc lập. Sửa mã component `SearchBox` sẽ không ảnh hưởng đến component `ProductCard`. Khi làm việc nhóm, nhiều người có thể đồng thời phát triển các component khác nhau mà không ảnh hưởng lẫn nhau.

**Lợi ích 3: Dễ bảo trì.** Khi một tính năng gặp vấn đề, bạn có thể trực tiếp định vị đến component tương ứng để sửa, không cần lục tìm trong một file lớn hàng nghìn dòng.

👇 **Thử nhấp xem**:
Nhấn vào tên component bên trái, xem vùng tương ứng của nó trên trang. Chú ý quan sát: cùng một component `ProductCard` được tái sử dụng nhiều lần, mỗi lần hiển thị dữ liệu khác nhau.

<ComponentTreeDemo />

### 4.3 Component trong mã trông như thế nào?

Lấy Vue làm ví dụ, một component là một file `.vue`, bên trong chứa ba phần:

```html
<!-- ProductCard.vue -->
<template>
  <!-- Phần này viết cấu trúc HTML — "vẻ ngoài" của component -->
  <div class="card">
    <h3>{{ name }}</h3>
    <p>Giá: ¥{{ price }}</p>
    <button @click="addToCart">Thêm vào giỏ</button>
  </div>
</template>

<script setup>
// Phần này viết logic JavaScript — "hành vi" của component
const props = defineProps(['name', 'price'])

function addToCart() {
  // Xử lý logic "thêm vào giỏ hàng"
}
</script>

<style scoped>
/* Phần này viết style CSS — "kiểu dáng" của component */
.card {
  border: 1px solid #ccc;
  padding: 16px;
}
</style>
```

Khi sử dụng component này, giống như sử dụng một thẻ HTML tùy chỉnh:

```html
<!-- Sử dụng component ProductCard ở nơi khác -->
<ProductCard name="Tai nghe không dây" price="299" />
<ProductCard name="Bàn phím cơ" price="599" />
<ProductCard name="Màn hình" price="1999" />
```

Ba dòng mã đã render ra ba thẻ sản phẩm khác nhau.

---

## 5. Chi phí thao tác DOM: Tại sao framework phải tốn nhiều công sức?

### 5.1 Thao tác DOM là gì?

Phía trên đã đề cập DOM — cấu trúc cây được trình duyệt tạo ra sau khi phân tích HTML. **Thao tác DOM** chính là dùng JavaScript để sửa đổi các nút trên cây này. Ví dụ sửa một đoạn chữ, thêm một phần tử, xóa một phần tử, sửa một style.

Bản thân các thao tác này không phức tạp, nhưng sau khi thực thi thao tác DOM, trình duyệt cần làm nhiều việc thêm mới có thể cập nhật hiển thị trên màn hình:

1. **Tính lại style**: Style CSS của nút này và các nút con có cần thay đổi không?
2. **Bố cục lại (Layout / Reflow)**: Vị trí và kích thước của tất cả phần tử trên trang cần được tính toán lại. Vì sự thay đổi của một phần tử có thể ảnh hưởng đến vị trí của các phần tử khác.
3. **Vẽ lại (Paint)**: Vẽ nội dung đã tính lên màn hình.

Mỗi bước trong ba bước đều có chi phí tính toán. Nếu mã của bạn liên tục kích hoạt thao tác DOM, trình duyệt sẽ lặp lại các bước này, trang sẽ bị giật lag.

👇 **Thử nhấp xem**:
Quan sát so sánh thời gian giữa thao tác DOM trực tiếp và thao tác DOM theo lô. Khi số lần sửa đổi tăng lên, thời gian "thao tác từng cái" sẽ tăng vọt.

<DomOperationCostDemo />

### 5.2 Framework giải quyết vấn đề này thế nào?

Vì thao tác DOM trực tiếp rất đắt, framework tìm cách **giảm số lần thao tác DOM**. Cụ thể có hai chiến lược:

**Chiến lược 1: Virtual DOM + So sánh差异 (Cách làm của Vue, React)**

Virtual DOM (DOM ảo) là một đối tượng JavaScript, cấu trúc của nó tương ứng 1-1 với cây DOM thật, nhưng nó chỉ tồn tại trong bộ nhớ, không kích hoạt layout và paint của trình duyệt.

Khi dữ liệu thay đổi, quy trình xử lý của framework là:

1. Dùng đối tượng JavaScript tạo một "cây virtual DOM mới", mô tả giao diện nên trông như thế nào sau khi dữ liệu thay đổi
2. So sánh cây mới với cây cũ (quá trình này gọi là **Diff**, tức so sánh差异), tìm ra nút nào đã thay đổi
3. Chỉ áp dụng phần thực sự thay đổi lên DOM thật (quá trình này gọi là **Patch**, tức vá lỗi)

Như vậy, dù dữ liệu thay đổi ra sao, thao tác trên DOM thật luôn là ít nhất.

👇 **Thử nhấp xem**:
Nhấn "Sửa dữ liệu", quan sát virtual DOM so sánh hai cây mới cũ như thế nào, tìm ra các nút đã thay đổi. Chú ý nhìn "DOM thật" bên phải cùng — chỉ phần thực sự thay đổi mới nhấp nháy.

<VirtualDomDiffDemo />

**Chiến lược 2: Định vị chính xác lúc biên dịch (Cách làm của Svelte)**

Svelte không sử dụng virtual DOM. Compiler của nó phân tích sẵn khi bạn viết mã: "Khi `count` thay đổi, cần cập nhật phần tử `<span>` ở dòng 3". Lúc chạy trực tiếp định vị đến phần tử đó để cập nhật, hoàn toàn không cần so sánh hai cây mới cũ.

Cách làm này bỏ qua bước Diff, về lý thuyết hiệu năng tốt hơn. Nhưng nó phụ thuộc vào khả năng phân tích của compiler — compiler cần đủ thông minh mới có thể nhận diện chính xác tất cả các nơi cần cập nhật.

---

## 6. Runtime vs Compile-time: Sự đánh đổi cốt lõi trong thiết kế framework

### 6.1 Hai giai đoạn

Mã frontend từ khi bạn viết đến khi cuối cùng chạy trong trình duyệt, trải qua hai giai đoạn:

- **Compile-time (Thời gian biên dịch / Thời gian build)**: Mã nguồn của bạn được công cụ build (như Vite, Webpack) xử lý, chuyển thành mã có thể trình duyệt thực thi trực tiếp. Quá trình này diễn ra trên máy tính của bạn, trước khi người dùng mở trang web.
- **Runtime (Thời gian chạy)**: Mã đã chuyển đổi được thực thi trong trình duyệt của người dùng. Logic cốt lõi của framework (ví dụ Diff của virtual DOM, theo dõi reactivity) hoạt động ở giai đoạn này.

### 6.2 Phân bổ công việc của framework ở hai giai đoạn

Các framework khác nhau phân bổ lượng công việc khác nhau ở hai giai đoạn, điều này quyết định đặc tính hiệu năng và kích thước bundle:

- **React**: Phần lớn công việc hoàn thành lúc runtime. Việc tạo virtual DOM, Diff, Patch đều diễn ra trong trình duyệt. Ưu điểm là tính linh hoạt cao; cái giá là phải gửi toàn bộ mã runtime của framework (khoảng 40KB) cho trình duyệt.
- **Vue**: Phương thức hỗn hợp. Template được tối ưu lúc compile-time (compiler đánh dấu nút nào là tĩnh, không thay đổi), nhưng việc cập nhật giao diện cuối cùng vẫn hoàn thành qua virtual DOM lúc runtime. Mã runtime khoảng 30KB.
- **Svelte**: Phần lớn công việc hoàn thành lúc compile-time. Compiler phân tích mã của bạn, trực tiếp sinh ra lệnh cập nhật DOM chính xác. Lúc runtime gần như không có mã framework — kết quả build ra chỉ có mã nghiệp vụ của chính bạn. Kích thước bundle nhỏ nhất.

👇 **Thử nhấp xem**:
Nhấn tab framework khác nhau, xem vị trí của chúng trên phổ "Runtime ↔ Compile-time", cùng với sự đánh đổi về kích thước bundle, hiệu năng chạy và trải nghiệm phát triển.

<FrameworkSpectrumDemo />

### 6.3 Xu hướng ngành

Hướng phát triển của các framework trong những năm gần đây rất rõ ràng: **Chuyển ngày càng nhiều công việc từ runtime sang compile-time**. Vì tính toán lúc compile-time không chiếm tài nguyên thiết bị của người dùng, không ảnh hưởng đến tốc độ tải trang.

- **Vue** đang phát triển Vapor Mode (chế độ hơi), có thể bỏ qua virtual DOM, trực tiếp sinh mã thao tác DOM lúc compile-time
- **React** đã推出 React Compiler, tự động tối ưu hành vi re-render của component lúc compile-time
- **Svelte 5** giới thiệu hệ thống Runes,进一步增强 khả năng phân tích lúc compile-time

---

## 7. Tổng kết

Nhìn lại các điểm cốt lõi của bài viết này:

**Vấn đề cơ bản mà framework frontend giải quyết**: Khi dữ liệu trong ứng dụng thay đổi, tự động, hiệu quả và đáng tin cậy cập nhật giao diện, không cần nhà phát triển thao tác DOM thủ công.

**Tư tưởng cốt lõi mà chúng cùng tuân theo**: UI = f(State) — giao diện là hàm của dữ liệu, nhà phát triển chỉ cần quan tâm sự thay đổi của dữ liệu, framework chịu trách nhiệm phản ánh sự thay đổi dữ liệu lên giao diện.

**Sự khác biệt công nghệ quan trọng giữa chúng**:

| Điểm công nghệ | Ý nghĩa |
| :--- | :--- |
| **Hệ thống reactive** | Framework phát hiện thay đổi dữ liệu thế nào. Vue dùng Proxy拦截, React dùng setState tường minh, Svelte dùng phân tích compiler. |
| **Virtual DOM** | Vue và React dùng một đối tượng JavaScript để mô phỏng cây DOM, thông qua so sánh hai cây mới cũ (Diff) để tìm lượng cập nhật nhỏ nhất, giảm thao tác DOM thật. |
| **Component hóa** | Chia giao diện thành các小块 độc lập, có thể tái sử dụng, mỗi component quản lý dữ liệu và giao diện riêng. |
| **Tối ưu compile-time** | Phân tích và tối ưu trước trong giai đoạn build, giảm lượng tính toán lúc runtime. Svelte đi xa nhất về mặt này. |

**Một câu tóm tắt**: Bản chất công việc của framework frontend chính là — tiếp quản quá trình đồng bộ "từ dữ liệu đến giao diện", giúp nhà phát triển chỉ cần suy nghĩ về logic dữ liệu, không còn phải thao tác giao diện thủ công.

---

## Bảng đối chiếu thuật ngữ

| Thuật ngữ tiếng Anh | Tương đương tiếng Việt | Giải thích |
| :--- | :--- | :--- |
| **Framework** | Framework (Khung làm việc) | Một bộ mã và quy tắc được viết sẵn, cung cấp cho nhà phát triển cấu trúc nền tảng và chức năng phổ biến của ứng dụng. |
| **DOM** | Mô hình Đối tượng Tài liệu | Cấu trúc dữ liệu cây được trình duyệt tạo ra sau khi phân tích HTML, JavaScript thao tác nó để sửa đổi trang. |
| **Virtual DOM** | DOM ảo | Dùng đối tượng JavaScript mô phỏng cây DOM, thông qua thuật toán Diff tìm đường cập nhật nhỏ nhất, giảm số lần thao tác DOM thật. |
| **State** | Trạng thái | Dữ liệu trong ứng dụng, ví dụ thông tin người dùng, nội dung giỏ hàng, trạng thái hiện tại của trang. |
| **Reactivity** | Tính phản ứng | Khi dữ liệu thay đổi, hệ thống có thể tự động cảm nhận và thực hiện thao tác cập nhật giao diện tương ứng. |
| **Proxy** | Proxy | Cơ chế tích hợp sẵn trong JavaScript, có thể拦截 thao tác đọc và ghi đối với một đối tượng. Vue 3 dùng nó để triển khai reactivity. |
| **Component** | Component (Thành phần) | Một đoạn mã giao diện độc lập, có thể tái sử dụng, chứa cấu trúc HTML, logic JavaScript và style CSS riêng. |
| **Declarative** | Khai báo | Một cách lập trình: Bạn mô tả "kết quả cuối cùng muốn gì", do framework quyết định cách thực hiện. |
| **Imperative** | Mệnh lệnh | Một cách lập trình: Bạn từng bước chỉ cho chương trình "cụ thể làm thế nào". |
| **Diff** | So sánh差异 | So sánh hai cây virtual DOM mới cũ, tìm ra nút nào đã thay đổi. |
| **Patch** | Vá lỗi | Áp dụng phần thay đổi tìm được qua Diff lên DOM thật. |
| **Compile-time** | Thời gian biên dịch | Giai đoạn mã được xử lý trong quá trình build, diễn ra trước khi người dùng mở trang web. |
| **Runtime** | Thời gian chạy | Giai đoạn mã được thực thi trong trình duyệt của người dùng. |
| **Compiler** | Compiler (Trình biên dịch) | Một chương trình chuyển đổi mã nguồn thành dạng mã khác. Compiler của Svelte chuyển file `.svelte` thành JavaScript hiệu quả. |

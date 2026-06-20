# Thiết kế trang và nút bấm theo quy chuẩn UI

Nhiều người nói "Tôi muốn trang giống Apple hơn một chút" "Nút bấm muốn làm cao cấp hơn một chút", nhưng khi thực sự bắt đầu làm, thường sẽ bị kẹt ở một vấn đề:

**Rốt cuộc nên tham khảo cái gì?**

Nhìn screenshot bắt chước, học được chỉ là "có giống hay không". Nhưng khi mở quy chuẩn thiết kế của Apple, Google, Microsoft, Atlassian, bạn sẽ phát hiện điểm thực sự tuyệt vời của họ không phải là phong cách thị giác, mà là **nói rõ vấn đề thiết kế**: trang trước tiên làm nổi bật cái gì, nút bấm phân cấp thế nào, thao tác nhấn mạnh ra sao — những tiêu chuẩn phán đoán này mới là cốt lõi.

> Tham khảo quy chuẩn thiết kế, không phải để làm "giống ai", mà là học cách người khác đưa ra phán đoán.

:::: info Tại sao bây giờ vẫn cần học những điều này
Các quy tắc thiết kế đã được huấn luyện vào mô hình, được công cụ thiết kế hấp thụ mặc định, thậm chí chỉ cần dán vài screenshot AI đã có thể học được. Nhưng chúng ta vẫn cần biết những quy tắc này đến từ đâu, tại sao lại quy định như vậy.
::::

## Trước hết xem vài đoạn nguyên văn, cảm nhận khoảng cách

Nếu bạn trước đây nghĩ "quy chuẩn thiết kế chẳng phải chỉ nói về phong cách thôi sao", hãy xem trước vài câu nguyên văn chính thức.

Bình thường trong đội nhóm chúng ta thường nói như thế này:

- Làm một dropdown
- Ở đây đặt một menu
- Thêm vài chức năng vào thanh menu
- Ở đây đặt hai nút, một xác nhận một hủy

Nghe có vẻ không có vấn đề, nhưng trong quy chuẩn của các công ty lớn, những từ này không phải là khái niệm mơ hồ, mà được phân tích rất chi tiết.

| Lời nói bình thường | Nguyên văn chính thức | Nói đơn giản |
| :--- | :--- | :--- |
| "Làm một menu" | Apple: ["A menu reveals its options..."](https://developer.apple.com/design/human-interface-guidelines/menus) | `Menu` là dùng để làm thao tác |
| "Đặt chức năng vào thanh menu" | Apple: ["menu bar menus contain all the commands..."](https://developer.apple.com/design/human-interface-guidelines/menus) | Đây là menu lệnh ở đầu ứng dụng |
| "Làm một dropdown" | Apple: ["A pop-up list lets the user choose one option among several."](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/MenuList/Articles/ManagingPopUpItems.html) | `pop-up` là chọn một cái từ danh sách |
| "Cũng làm một dropdown" | Apple: ["A pull-down list is generally used for selecting commands in a specific context."](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/MenuList/Articles/ManagingPopUpItems.html) | `pull-down` là bấm mở để làm thao tác hiện tại |
| "Menu cũng có thể dùng để lọc đúng không" | Fluent: ["If you need to collect information from people, try a select, dropdown, or combobox instead."](https://fluent2.microsoft.design/components/web/react/core/menu/usage) | `Menu` không phải để chọn giá trị |
| "Menu cũng có thể làm điều hướng đúng không" | Material: ["Menus should not be used as a primary method for navigation within an app."](https://m1.material.io/components/menus.html) | `Menu` không phải điều hướng chính |
| "Nút bấm cứ viết OK / Cancel thôi" | Apple: ["Always use 'Cancel' to title a button that cancels the alert's action."](https://developer.apple.com/design/human-interface-guidelines/alerts) | Văn bản nút không thể viết tùy tiện |

> Các trích dẫn trong bảng đều có thể nhấp trực tiếp để đến trang chính thức tương ứng.

Đây chính là điều dễ gây ấn tượng mạnh nhất khi lần đầu tiên thực sự xem quy chuẩn thiết kế:

> Chúng ta bình thường tưởng mình đang thảo luận về UI, nhưng thực tế rất nhiều lúc chỉ đang giao tiếp bằng một đống từ ngữ mơ hồ.

Apple sẽ không chỉ nói "làm một menu"; nó sẽ tiếp tục phân biệt:

- `menu`
- `menu bar menu`
- `pop-up button`
- `pull-down button`
- `context menu`

Fluent sẽ không chỉ nói "dropdown"; nó sẽ tiếp tục phân biệt:

- `menu`
- `dropdown`
- `select`
- `combobox`

Đây chính là sự cần thiết của quy chuẩn thiết kế.

Nó không phải để làm trang có vẻ chuyên nghiệp hơn, mà là để khi đội nhóm thảo luận về UI, trong đầu mỗi người không còn là những thứ khác nhau nữa.

## Bạn sẽ học được gì

1. Tại sao khi thiết kế trang và nút bấm cần xem quy chuẩn thiết kế trước
2. Trong các quy chuẩn Apple, Material, Fluent, Atlassian, nội dung nào đáng tham khảo nhất
3. Cách thiết kế rõ ràng "cấp bậc trang" và "cấp bậc nút bấm"
4. Cách để AI tham khảo quy chuẩn của người khác để tạo trang và nút bấm

## 1. Tại sao quy chuẩn thiết kế có thể giúp bạn làm rõ trang

Sau khi xem những nguyên văn trên, bạn sẽ phát hiện một điểm quan trọng:

**Quy chuẩn thiết kế không phải điểm tô, mà là trước hết nói chính xác từ ngữ.**

Nhiều trang không đẹp, không phải vì màu sắc không đủ cao cấp, mà vì cấp bậc thông tin lộn xộn.

Nhiều nút không dễ dùng, cũng không phải vì bo góc không đúng, mà vì:

- Nút chính quá nhiều, người dùng không biết nên nhấn cái nào
- Nút nguy hiểm và nút bình thường trông giống nhau
- Tất cả nút trong trang đều tranh giành sự chú ý
- Phong cách và ngữ nghĩa của nút không nhất quán giữa các trang khác nhau

Quy chuẩn thiết kế trưởng thành,恰好 là đang giải quyết những vấn đề này. Chúng thường sẽ định nghĩa:

| Nội dung quy chuẩn | Nó giải quyết vấn đề gì |
| :--- | :--- |
| **Cấp bậc trang** | Nhìn đâu trước, nhìn đâu sau, thông tin tổ chức thế nào |
| **Nền tảng thị giác** | Màu sắc, khoảng cách, font chữ, bo góc, bóng đổ thống nhất thế nào |
| **Cấp bậc nút bấm** | Nút chính, nút phụ, nút văn bản, nút nguy hiểm phân biệt thế nào |
| **Quy tắc trạng thái** | hover, focus, disabled, loading thể hiện thế nào |
| **Ngữ nghĩa tương tác** | Nút nào là "xác nhận", nút nào là "hủy", nút nào là "thao tác thêm" |

Vì vậy, quy chuẩn thiết kế thực sự cung cấp không phải là một "lớp da", mà là một **tiêu chuẩn phán đoán**.

## 2. Khi tham khảo quy chuẩn công ty lớn, tập trung vào điều gì

### 2.1 Tham khảo Apple: Học cách "định nghĩa đủ chi tiết"

Điều đáng học nhất ở Apple không chỉ là sự kiềm chế thị giác, mà là nó sẽ định nghĩa khái niệm rất chi tiết.

Cùng là "menu" hoặc "dropdown" trong miệng nhiều đội nhóm, Apple sẽ tiếp tục phân tích nhỏ:

- `menu`: Một nhóm lệnh, tùy chọn hoặc trạng thái
- `menu bar menu`: Tập hợp lệnh cấp ứng dụng
- `pop-up button`: Chọn một giá trị
- `pull-down button`: Kích hoạt lệnh trong ngữ cảnh hiện tại
- `context menu`: Các hành động thường dùng liên quan đến đối tượng hoặc nhiệm vụ hiện tại

Sự phân biệt này rất quan trọng, vì nó sẽ trực tiếp ảnh hưởng đến:

- Component này dùng để chọn giá trị, hay dùng để làm hành động
- Nó thuộc về cục bộ trang, hay thuộc về cấp ứng dụng
- Nó nên hiển thị lâu dài giá trị đã chọn, hay chỉ tạm thời mở rộng lệnh

Khi bạn bắt đầu suy nghĩ theo mức độ chi tiết này, trang bạn thiết kế sẽ lập tức rõ ràng hơn nhiều.

### 2.2 Tham khảo Apple: Học cấp bậc trang và sự kiềm chế

Apple Human Interface Guidelines đặc biệt phù hợp để học hai điều:

- Trang thiết lập cấp bậc rõ ràng thế nào
- Điều khiển giữ rõ ràng dưới tiền đề không lấn át

Apple nhấn mạnh `Hierarchy`, `Harmony`, `Consistency`. Điều này có nghĩa là khi thiết kế trang cần trả lời:

- Thông tin quan trọng nhất của trang hiện tại là gì
- Nhiệm vụ chính của người dùng là gì
- Thao tác nào nên nổi bật nhất, thao tác nào nên lùi lại

Nếu bạn tham khảo Apple để thiết kế trang, có thể tập trung tham khảo:

- Thông tin màn hình đầu không nên quá vụn, nội dung cốt lõi tập trung trước
- Dùng khoảng trắng, kích thước font, nhóm để tạo trật tự, thay vì chất nhiều viền
- Nút không nên tất cả đều nhấn mạnh cao, chỉ hành động quan trọng mới nên nổi bật nhất

### 2.3 Tham khảo Material: Học cấu trúc trang rõ ràng

Material Design rất phù hợp để học "trang tổ chức luồng nhiệm vụ thế nào".

Nhiều component và quy chuẩn layout của nó, cốt lõi đều giúp bạn làm rõ:

- Trang là loại duyệt, hay loại thực thi nhiệm vụ
- Trang hiện tại là để người dùng đọc, chọn, hay nộp
- Trong một trang, yếu tố nào nên lặp lại ổn định, yếu tố nào nên phản hồi thay đổi ngữ cảnh

Nếu bạn tham khảo Material để thiết kế trang, có thể tập trung tham khảo:

- Khu vực trang rõ ràng, trách nhiệm module xác định
- Điều hướng, khu vực nội dung, khu vực thao tác phân công rõ ràng
- Các phong cách nút khác nhau tương ứng với mức độ ưu tiên thao tác khác nhau

### 2.4 Tham khảo Fluent: Học ranh giới component và cấp bậc nút

Fluent 2 rất phù hợp cho sản phẩm backend, công cụ và hệ thống form phức tạp. Điều đáng học nhất là nó sẽ trực tiếp nói cho bạn biết "đừng lẫn lộn khái niệm".

Ví dụ nó ghi rõ: nếu bạn muốn "collect information", thì đừng tiếp tục dùng `menu`, mà nên cân nhắc `select`, `dropdown`, `combobox`.

Câu nói này rất quan trọng, vì nó phá vỡ "cũng gần giống nhau" trong đầu nhiều người.

Fluent 2 cũng rất chú trọng:

- Cấp bậc thao tác
- Ranh giới ngữ nghĩa component
- Độ rõ ràng trong kịch bản thông tin dày đặc

Nếu bạn tham khảo Fluent để thiết kế nút, có thể tập trung tham khảo:

- `Primary button` dùng để gánh hành động quan trọng nhất hiện tại
- `Secondary button` dùng để gánh hành động hỗ trợ
- Các nút nhấn mạnh yếu như `Subtle`, `Transparent` dùng cho thao tác không nên tranh luồng chính
- Càng nhiều nút trong trang, càng cần kiểm soát mức độ ưu tiên thị giác

### 2.5 Tham khảo Atlassian: Học quản lý trang và nút bấm theo hệ thống

Atlassian Design System đặc biệt phù hợp cho tình huống "một đội nhóm làm nhiều trang". Nó nhấn mạnh:

- foundations là nền tảng chia sẻ
- tokens là phương pháp thống nhất quyết định thị giác
- components là thành phần tương tác được tái sử dụng lặp đi lặp lại

Nếu bạn tham khảo Atlassian để làm trang và nút, giá trị nhất là:

- Làm kích thước, màu sắc, bo góc, khoảng cách nút thành quy tắc thống nhất
- Cố định nhịp điệu layout trang
- Để các trang khác nhau tuy nội dung khác nhưng ngôn ngữ cấu trúc nhất quán

## 3. Khi thiết kế trang, nên tham khảo những điểm nào trong quy chuẩn

Khi bạn xem một hệ thống thiết kế, đừng hỏi trước "trang này đẹp không", mà hãy hỏi trước mấy câu hỏi dưới đây.

### 3.1 Nhìn trang lần đầu, chính phụ có rõ ràng không

Một trang thường ít nhất phải có ba tầng:

- **Thông tin chính**: Nội dung quan trọng nhất của trang hiện tại
- **Thông tin phụ trợ**: Nội dung giúp hiểu hoặc bổ sung
- **Thao tác cấp hai**: Hành động không nên can thiệp nhiệm vụ chính

Nếu ba tầng không mở rộng ra, trang sẽ "đều quan trọng", tương đương với "đều không quan trọng".

### 3.2 Layout trang, có phục vụ nhiệm vụ thay vì chất module không

Khi tham khảo quy chuẩn, có thể đặc biệt chú ý:

- Khu vực tiêu đề có làm rõ mục tiêu trang không
- Khu vực nội dung chính có xoay quanh nhiệm vụ tổ chức không
- Nút thao tác có gần nội dung liên quan không
- Thông tin thứ cấp có được làm yếu đi không

### 3.3 Thao tác trong trang, có mức độ ưu tiên không

Nhiều trang nhìn qua có 6 nút, kết quả mỗi nút đều giống CTA, đây là cấp bậc mất kiểm soát điển hình.

Cách hợp lý hơn là:

- Một khu vực thường chỉ có một thao tác chính
- Thao tác cấp hai có thể dùng viền, nút văn bản hoặc phong cách yếu hơn
- Hành động rủi ro không nên trông giống hành động chính

## 4. Khi thiết kế nút, nên tham khảo những điểm nào trong quy chuẩn

Nút là phần dễ bị "thiết kế tùy tiện" nhất, nhưng cũng là phần dễ bộc lộ hệ thống có trưởng thành hay không nhất.

### 4.1 Nút trước hết phân "ngữ nghĩa", rồi mới phân "phong cách"

Đừng nghĩ trước "nút xanh hay nút đen", hãy nghĩ trước nút này đóng vai trò gì.

Vai trò nút phổ biến có thể phân như sau:

| Loại nút | Tác dụng | Chiến lược phong cách phổ biến |
| :--- | :--- | :--- |
| **Primary** | Hành động quan trọng nhất trong khu vực hiện tại | Đặc, tương phản cao, nổi bật nhất |
| **Secondary** | Hành động hỗ trợ | Viền hoặc nhấn mạnh thấp hơn một cấp |
| **Tertiary / Text** | Thao tác yếu | Văn bản hoặc tỷ trọng thị giác thấp |
| **Destructive** | Các thao tác rủi ro như xóa, vô hiệu hóa, xóa sạch | Màu cảnh báo hoặc phong cách rủi ro rõ ràng |
| **Icon button** | Thao tác công cụ cục bộ | Ngắn gọn, gần ngữ cảnh |

### 4.2 Một trang không nên có quá nhiều Primary Button

Đây là cái bẫy dễ giẫm nhất của nhiều người mới.

Nếu trên trang có 4 nút chính, thì tương đương không có nút chính. Ý nghĩa của nút chính vốn dĩ là "nói cho người dùng biết bây giờ nên làm gì nhất".

Bạn có thể tham khảo cách làm chung của nhiều hệ thống thiết kế:

- Một khu vực chính thường chỉ giữ một nút chính
- Hủy, quay lại, đóng thường không tranh cùng cấp với nút xác nhận
- Thêm thao tác đặt vào nút cấp hai hoặc menu

### 4.3 Nút phải có thể thể hiện thay đổi trạng thái

Quy chuẩn thiết kế thường viết rất rõ về trạng thái nút:

- Trạng thái mặc định
- Trạng thái hover
- Trạng thái focus
- Trạng thái disabled
- Trạng thái loading
- Trạng thái nguy hiểm

Điều này rất quan trọng, vì nút không phải là một bức ảnh tĩnh, mà là một trong những điều khiển được kích hoạt thường xuyên nhất trong quá trình người dùng thao tác.

### 4.4 Văn bản nút, cũng thuộc một phần của thiết kế

Văn bản nút không chỉ là "vấn đề copywriting", nó trực tiếp ảnh hưởng đến sự hiểu biết của người dùng.

Ví dụ:

- `Lưu`
- `Lưu thay đổi`
- `Xuất bản ngay`
- `Xóa dự án`
- `Chuyển vào thùng rác`

Những văn bản này truyền đạt kỳ vọng tâm lý hoàn toàn khác nhau. Quy chuẩn trưởng thành thường yêu cầu nhãn nút thể hiện rõ hành động, thay vì sử dụng từ ngữ mơ hồ.

## 5. Một danh sách thiết kế trang và nút rất thực dụng

Khi bạn tự thiết kế trang, có thể xem nhanh qua danh sách này trước:

### Danh sách trang

- Tiêu đề trang có nói rõ nhiệm vụ hiện tại không
- Thông tin quan trọng nhất màn hình đầu có nhìn thấy ngay không
- Trang có tổ chức theo luồng nhiệm vụ, thay vì nghĩ đến gì đặt nấy không
- Trong cùng một khu vực có chỉ có một thao tác chính không
- Nội dung thứ cấp có được làm yếu phù hợp không

### Danh sách nút

- Nút này là thao tác chính hay thao tác phụ
- Tại sao nó đáng nổi bật hơn nút khác
- Trong trang có quá nhiều nút chính không
- Thao tác nguy hiểm có được đánh dấu rõ ràng không
- Văn bản nút có đủ cụ thể không

## 6. Cách dùng AI tham khảo quy chuẩn của người khác để thiết kế trang

Phần này thực dụng nhất.

Nhiều người khi để AI thiết kế trang, chỉ nói:

```md
Giúp tôi làm một trang cài đặt, cao cấp hơn một chút, tham khảo phong cách Apple
```

Loại prompt này quá mơ hồ, AI cuối cùng thường chỉ có thể bắt chước "nền trắng, bo tròn, bóng đổ".

Đối với người mới, cách thực dụng hơn không phải là tự tổng hợp một đoạn dài, mà là trực tiếp dán **câu then chốt trong nguyên văn quy chuẩn** cho AI.

Làm như vậy có hai lợi ích:

- Bạn không cần tự "dịch" tư tưởng thiết kế trước
- AI dễ hiểu trang và nút theo định nghĩa chính thức hơn

### 6.1 Ví dụ 1: Để AI tham khảo Apple thiết kế một trang cài đặt

Tìm một câu nguyên văn Apple trước:

> ["Establish a clear visual hierarchy..."](https://developer.apple.com/design/human-interface-guidelines/)

Bạn có thể trực tiếp dán cho AI như thế này:

```md
Tham khảo câu này từ Apple Human Interface Guidelines:
"Establish a clear visual hierarchy..."

Giúp tôi thiết kế một trang cài đặt bảo mật tài khoản.
Yêu cầu cấp bậc trang rõ ràng, thông tin quan trọng đặt trước, phân nhóm ngăn nắp.
```

Điểm quan trọng của cách viết này là: bạn không cần tự giải thích quá nhiều, trực tiếp dán nguyên văn của Apple vào.

### 6.2 Ví dụ 2: Để AI tham khảo Fluent thiết kế nút trang backend

Tìm một câu nguyên văn Fluent trước:

> ["Only use one primary button in a layout..."](https://fluent2.microsoft.design/components/web/react/core/button/usage)

Bạn có thể trực tiếp dán cho AI như thế này:

```md
Tham khảo câu này từ Fluent 2:
"Only use one primary button in a layout..."

Giúp tôi thiết kế nút cho trang quản lý đội nhóm backend.
Nút thêm thành viên nổi bật nhất, xuất, lọc, thêm thao tác yếu hơn, nút xóa nổi bật riêng.
```

Câu này rất phù hợp cho người mới, vì nó trực tiếp nói cho AI: một khu vực không nên đặt quá nhiều nút chính.

### 6.3 Ví dụ 3: Để AI đồng thời tham khảo quy chuẩn trang và quy chuẩn nút

Bạn cũng có thể dán hai câu nguyên văn cùng lúc, để AI đồng thời tham khảo trang và nút:

> Apple: ["Establish a clear visual hierarchy..."](https://developer.apple.com/design/human-interface-guidelines/)
>
> Fluent: ["Only use one primary button in a layout..."](https://fluent2.microsoft.design/components/web/react/core/button/usage)

Rồi trực tiếp viết như thế này:

```md
Tham khảo hai câu nguyên văn quy chuẩn thiết kế dưới đây:
Apple: "Establish a clear visual hierarchy..."
Fluent: "Only use one primary button in a layout..."

Giúp tôi thiết kế một trang chi tiết dự án.
Trang bao gồm giới thiệu dự án, thành viên, hoạt động gần đây và lối vào cài đặt.
Cấp bậc trang rõ ràng hơn, chỉ giữ một nút chính, nút khác yếu hơn.
```

Cách này đặc biệt phù hợp cho người mới, vì bạn chỉ cần biết sao chép nguyên văn, rồi thêm hai câu yêu cầu của mình là đủ.

## 7. Cách dùng AI tham khảo quy chuẩn nút để trực tiếp tạo thiết kế nút

Nếu bạn chỉ muốn làm nút trước, cũng có thể trực tiếp dán nguyên văn quy chuẩn nút.

Ví dụ định nghĩa nút của Atlassian rất ngắn:

> ["A button triggers an event or action."](https://atlassian.design/components/button/)

Bạn có thể hỏi AI như thế này:

```md
Tham khảo câu này của Atlassian:
"A button triggers an event or action."

Giúp tôi thiết kế một bộ phong cách nút cho trang backend.
Tôi cần có nút chính, nút phụ, nút xóa, tiện thể nói cho tôi biết dùng ở đâu tương ứng.
```

Loại prompt này đặc biệt phù hợp cho người mới, cơ bản là "dán nguyên văn + nói yêu cầu".

## 8. Tổng kết

Tham khảo quy chuẩn thiết kế UI để thiết kế trang và nút bấm, điều quan trọng nhất không phải "làm giống ai", mà là học được mấy điều sau:

1. Dùng cấp bậc tổ chức trang, thay vì chất nội dung lên
2. Dùng phân cấp nút thể hiện mức độ ưu tiên thao tác, thay vì để tất cả nút đều tranh giành sự chú ý như nhau
3. Dùng định nghĩa, ranh giới và tiêu chuẩn phán đoán trong quy chuẩn thiết kế để dẫn dắt thiết kế
4. Khi để AI tham khảo quy chuẩn của người khác, tham khảo là "nguyên tắc và cấu trúc", chứ không phải chỉ tham khảo lớp da

Khi bạn sử dụng quy chuẩn như thế này, những gì bạn tham khảo được không chỉ là một phong cách, mà là một cách tư duy thiết kế trưởng thành.

---

## Tài liệu tham khảo

Các liên kết dưới đây đều đến từ hệ thống thiết kế chính thức hoặc tài liệu chính thức:

- Apple Human Interface Guidelines: [Overview](https://developer.apple.com/design/human-interface-guidelines/)
- Apple Human Interface Guidelines: [Menus](https://developer.apple.com/design/human-interface-guidelines/menus)
- Apple Human Interface Guidelines: [Alerts](https://developer.apple.com/design/human-interface-guidelines/alerts)
- Apple Human Interface Guidelines: [Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)
- Apple Archive: [How Menus Work](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/MenuList/Articles/HowMenusWork.html)
- Apple Archive: [Managing Pop-Up Buttons and Pull-Down Lists](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/MenuList/Articles/ManagingPopUpItems.html)
- Material Design: [Buttons overview](https://m3.material.io/components/buttons/overview)
- Material Design: [Menus](https://m1.material.io/components/menus.html)
- Microsoft Fluent 2: [Start designing](https://fluent2.microsoft.design/get-started/design)
- Microsoft Fluent 2: [Menu usage](https://fluent2.microsoft.design/components/web/react/core/menu/usage)
- Microsoft Fluent 2: [Button usage](https://fluent2.microsoft.design/components/web/react/core/button/usage)
- Atlassian Design System: [Foundations](https://atlassian.design/foundations/)
- Atlassian Design System: [Button](https://atlassian.design/components/button/)

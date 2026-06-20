# Theo dõi dữ liệu: Ghi lại người dùng đã làm gì trong ứng dụng

::: tip 🎯 Vấn đề cần giải quyết trong chương này
**Làm sao chúng ta biết người dùng đã làm gì trong ứng dụng?**

Hãy tưởng tượng bạn mở một quán trà sữa trực tiếp. Bạn có thể đứng sau quầy, quan sát trực tiếp mỗi khách hàng: họ vào xem menu bao lâu? Gọi món gì? Có do dự rồi bỏ đi không?

Nhưng nếu "cửa hàng" của bạn là một ứng dụng điện thoại hay trang web, bạn không thể nhìn thấy trực tiếp thao tác của người dùng. Lúc này cần một phương pháp kỹ thuật, "gắn" các điểm ghi nhận ở những vị trí quan trọng trong ứng dụng, tự động ghi lại từng thao tác của người dùng. Đó chính là **Theo dõi dữ liệu (Event Tracking)**.

Từ "theo dõi" nghe rất chuyên môn, nhưng ý cốt lõi rất đơn giản: **ở những nơi người dùng có thể thao tác, đặt một "bộ ghi nhận", ghi lại người dùng đã làm gì.**

Chương này sẽ giải thích quá trình này qua bốn bước:

1. **Chọn phương án thu thập** — quyết định đặt bộ ghi nhận ở đâu, đặt như thế nào
2. **Thiết kế định dạng dữ liệu** — quyết định mỗi bản ghi nên chứa những thông tin gì
3. **Truyền và bộ đệm** — đưa bản ghi từ điện thoại người dùng đến máy chủ một cách an toàn
4. **Làm sạch và lưu trữ** — sắp xếp dữ liệu, loại bỏ trùng lặp và lỗi, lưu vào cơ sở dữ liệu
:::

---

## Bước 1: Chọn phương án thu thập — Đặt bộ ghi nhận ở đâu?

**Mục tiêu**: Quyết định dùng cách nào để ghi lại thao tác của người dùng.

Ví dụ: quản lý sản phẩm muốn biết "bao nhiêu người dùng đã nhấp nút mua hàng". Để trả lời, lập trình viên cần thêm logic ghi nhận vào mã của "nút mua hàng" — mỗi khi người dùng nhấp nút này, tự động ghi lại một bản ghi.

Nhưng đây là một câu hỏi lựa chọn: chúng ta **chỉ đặt bộ ghi nhận ở những nơi quan trọng** (ví dụ chỉ ghi "mua hàng" và "đăng ký"), hay **đặt ở tất cả mọi nơi** (ghi lại mọi lần nhấp, trượt, dừng lại của người dùng)?

Lựa chọn khác nhau tương ứng với phương án theo dõi khác nhau.

<DataTrackingDemo tab="methods" />

**💡 Ba phương pháp theo dõi phổ biến**

Trong ngành thường dùng ba phương pháp theo dõi, mỗi cái có ưu nhược điểm:

**Phương pháp 1: Theo dõi bằng code (Code Tracking) — Ghi nhận thủ công chính xác**

Lập trình viên chỉ định thủ công trong code: khi người dùng thực hiện thao tác nào đó, ghi lại một bản ghi.

Ví dụ: giống như bố trí một người chuyên ghi nhận tại quầy thu ngân của quán trà sữa, chỉ ghi "ai đã mua gì, tiêu bao nhiêu". Thông tin ghi nhận rất chi tiết và chính xác.

- *Ưu điểm*: có thể ghi nhận thông tin nghiệp vụ rất chi tiết, ví dụ người dùng dùng mã giảm giá nào, số dư tài khoản bao nhiêu
- *Chi phí*: mỗi điểm ghi nhận mới đều cần lập trình viên viết code, kiểm thử, phát hành phiên bản mới — quy trình dài

**Phương pháp 2: Theo dõi trực quan (Visual Tracking) — Chọn bằng cách nhấp**

Không cần viết code. Hệ thống cung cấp công cụ trực quan, nhân viên vận hành có thể "chọn" trực tiếp trên giao diện ứng dụng nút hoặc khu vực muốn theo dõi, hệ thống tự động bắt đầu ghi nhận.

Ví dụ: giống như trên màn hình camera của quán, dùng chuột chọn "khu vực quầy thu ngân", hệ thống tự động bắt đầu thống kê lưu lượng người trong khu vực đó.

- *Ưu điểm*: không cần lập trình viên tham gia, nhân viên vận hành tự cấu hình được, hiệu suất cao
- *Chi phí*: chỉ ghi nhận được thao tác giao diện như "người dùng đã nhấp gì", không ghi nhận được dữ liệu nghiệp vụ sâu như "số tiền đơn hàng"

**Phương pháp 3: Theo dõi toàn bộ (Auto Tracking) — Tự động ghi nhận mọi thứ**

Tích hợp một SDK (có thể hiểu là "bộ công cụ") vào ứng dụng, nó sẽ tự động ghi nhận mọi thao tác của người dùng: mỗi lần nhấp, mỗi lần trượt, ở mỗi trang dừng bao lâu.

Ví dụ: giống như lắp camera ở mọi góc của quán, ghi lại mọi cử chỉ của khách hàng.

- *Ưu điểm*: không bỏ sót thao tác nào, độ phủ toàn diện nhất
- *Chi phí*: lượng dữ liệu rất lớn, nhiều thông tin vô dụng (ví dụ người dùng trượt vô thức), cần nhiều công sức lọc và làm sạch sau này

**Tóm tắt bước này**: sau khi chọn phương pháp theo dõi, ứng dụng đã có khả năng "ghi nhận thao tác người dùng".

**Nhưng có một vấn đề mới**: bộ ghi nhận tuy có thể thu thập thao tác người dùng, nhưng nếu mỗi bộ ghi nhận ghi theo định dạng khác nhau (ví dụ có ghi "userID", có ghi "user_id", có không ghi), thì không thể phân tích thống nhất. Do đó bước tiếp theo, chúng ta cần quy định một định dạng ghi nhận thống nhất.

---

## Bước 2: Thiết kế định dạng dữ liệu — Mỗi bản ghi nên chứa gì?

**Điều kiện tiên quyết**: đã chọn phương pháp theo dõi (ví dụ theo dõi bằng code), ứng dụng đã có thể thu thập thao tác người dùng.

**Mục tiêu bước này**: quy định một "mẫu ghi nhận" thống nhất, để tất cả bản ghi theo dõi có định dạng nhất quán.

**Tại sao cần định dạng thống nhất?** Hãy tưởng tượng: nếu quán trà sữa có ba nhân viên cùng ghi nhận doanh số, một người viết "Minh mua trà sữa 15 nghìn", người khác viết "15, trà, trà sữa", người thứ ba viết "một ly trà sữa". Đến cuối tháng tổng hợp, các định dạng hoàn toàn khác nhau, việc thống kê sẽ rất đau đầu. Do đó cần một "phiếu ghi nhận" thống nhất, quy định mỗi bản ghi phải điền những trường nào.

<DataTrackingDemo tab="model" />

**💡 Nguyên lý cốt lõi: Mẫu ghi nhận 4W1H**

Dù ghi nhận thao tác gì, mỗi bản ghi đều cần trả lời năm câu hỏi sau (gọi tắt là 4W1H):

**Who — Ai đã làm?**

Chúng ta cần biết bản ghi này được tạo ra bởi người dùng nào.

- Nếu người dùng đã đăng nhập, dùng ID tài khoản (ví dụ `user_id: "zhangsan123"`)
- Nếu chưa đăng nhập, dùng mã định danh thiết bị duy nhất (ví dụ số serial điện thoại), để ít nhất phân biệt được "đây là thao tác trên cùng một điện thoại"

**When — Khi nào làm?**

Ghi nhận thời gian chính xác khi thao tác xảy ra, chính xác đến mili-giây.

Có một chi tiết: nếu ứng dụng có người dùng ở nước ngoài, 3 giờ chiều giờ Bắc Kinh và 3 giờ chiều giờ New York thực tế chênh nhau 13 tiếng. Để tránh nhầm lẫn, tất cả thời gian được chuyển đổi về UTC (thời gian phối hợp quốc tế).

**Where & How — Trong môi trường nào làm?**

Phần này ghi lại môi trường thiết bị và mạng khi người dùng thao tác, gọi là **thuộc tính chung**. Gọi là "chung" vì dù người dùng làm gì, thông tin này đều tự động đính kèm. Ví dụ:

- Model thiết bị: iPhone 15 / Xiaomi 14
- Loại mạng: WiFi / 5G / 4G
- Phiên bản App: v1.2.3
- Hệ điều hành: iOS 18 / Android 15

Giá trị của thông tin này: nếu phát hiện một lỗi chỉ xuất hiện trên model cụ thể, thuộc tính chung giúp định vị nhanh vấn đề.

**What — Cụ thể đã làm gì?**

Phần này ghi lại chi tiết nghiệp vụ cụ thể của thao tác, gọi là **thuộc tính tùy chỉnh**. Thao tác khác nhau cần ghi thông tin khác nhau. Ví dụ:

- Người dùng nhấp "Thêm vào giỏ hàng": cần ghi tên sản phẩm, giá sản phẩm, số lượng
- Người dùng hoàn tất thanh toán: cần ghi số tiền đơn hàng, phương thức thanh toán, mã giảm giá

**Tóm tắt bước này**: thông qua mẫu 4W1H, chúng ta chuyển mỗi thao tác của người dùng thành một bản ghi dữ liệu có định dạng thống nhất. Trong triển khai kỹ thuật, bản ghi này thường được lưu ở định dạng JSON (JSON là định dạng dữ liệu phổ biến, component tương tác phía trên đã hiển thị hình thức của nó).

**Nhưng lại có vấn đề mới**: định dạng dữ liệu đã thống nhất, nhưng nếu lượng người dùng lớn (ví dụ trong đợt khuyến mãi, mỗi giây có thể tạo hàng vạn bản ghi), điện thoại người dùng không thể gửi ngay mỗi khi tạo một bản ghi — vừa tốn pin vừa tốn dung lượng, máy chủ cũng không chịu nổi. Do đó bước tiếp theo, chúng ta cần thiết kế phương thức truyền thông minh hơn.

---

## Bước 3: Truyền và bộ đệm — Làm sao đưa dữ liệu đến máy chủ an toàn?

**Điều kiện tiên quyết**: mỗi thao tác của người dùng đã được ghi nhận thành dữ liệu JSON có định dạng thống nhất.

**Mục tiêu bước này**: truyền dữ liệu này từ điện thoại (hoặc trình duyệt) của người dùng đến máy chủ một cách đáng tin cậy, ngay cả khi mạng không tốt cũng không mất dữ liệu.

**Tại sao không gửi trực tiếp?** Nếu mỗi bản ghi tạo ra là gửi ngay một yêu cầu mạng, giống như mỗi viết một lá thư lại chạy一趟 ra bưu điện — hiệu quả quá thấp. Cách hợp lý hơn là: gom một mớ thư, gửi cùng một lúc.

<DataTrackingDemo tab="pipeline" />

**💡 Nguyên lý cốt lõi: Ba lớp bảo đảm truyền dữ liệu**

Dữ liệu từ điện thoại người dùng đến máy chủ cần qua ba cơ chế bảo đảm, đảm bảo vừa hiệu quả vừa không mất dữ liệu:

**Lớp 1: Gom batch rồi gửi (tổng hợp theo lô)**

SDK (bộ công cụ theo dõi) không gửi ngay mỗi khi tạo một bản ghi, mà tạm lưu bản ghi trong bộ nhớ điện thoại. Khi gom đủ số lượng (ví dụ 30 bản), hoặc chờ quá thời gian nhất định (ví dụ 5 giây), mới đóng gói gửi đi cùng một lần.

Giống như gửi chuyển phát nhanh: bạn không mua một món là chạy一趟 ra điểm gửi, mà gom mấy món gửi cùng, tiết kiệm thời gian công sức. Với điện thoại, làm vậy giảm số lần yêu cầu mạng, tiết kiệm pin và dung lượng.

**Lớp 2: Mất mạng cũng không mất (lưu trữ cục bộ)**

Trong thang máy, hầm tàu điện, điện thoại thường không có tín hiệu mạng. Nếu dữ liệu chỉ lưu trong bộ nhớ, người dùng tắt app là mất hết.

Nên SDK sẽ lưu dữ liệu chưa gửi vào bộ nhớ cục bộ của điện thoại (giống như bỏ thư vào ngăn kéo trước). Khi có lại mạng, tự động gửi bù những dữ liệu này. Như vậy dù người dùng mất mạng tạm thời, dữ liệu cũng không bị mất.

**Lớp 3: Máy chủ không bị quá tải (hàng đợi tin nhắn)**

Khi dữ liệu đến máy chủ, không được ghi trực tiếp vào cơ sở dữ liệu. Tại sao? Vì trong đợt khuyến mãi, mỗi giây có thể có hàng vạn dữ liệu đổ đến, cơ sở dữ liệu xử lý trực tiếp lượng lớn như vậy có thể sập.

Giải pháp là thêm một "vùng đệm" ở giữa, kỹ thuật gọi là **hàng đợi tin nhắn** (công cụ phổ biến là Kafka). Tác dụng giống như hệ thống lấy số xếp hàng của nhà hàng: giờ cao điểm khách (dữ liệu) xếp hàng chờ trước, bếp (cơ sở dữ liệu) xử lý theo nhịp của mình, không bị ngập bởi đơn hàng đổ đến cùng lúc.

**Tóm tắt bước này**: thông qua ba bảo đảm "gom batch rồi gửi → mất mạng lưu cục bộ → hàng đợi tin nhắn đệm", dữ liệu đã đến máy chủ an toàn.

**Nhưng còn một vấn đề**: vì khi reconnect SDK tự động gửi bù, cùng một bản ghi có thể bị gửi hai lần. Nếu không xử lý mà lưu thẳng vào CSDL, dữ liệu sẽ bị trùng (ví dụ một đơn 100 nghìn bị tính thành hai đơn, doanh thu bị ảo). Do đó bước tiếp theo, cần "làm sạch" dữ liệu.

---

## Bước 4: Làm sạch và lưu trữ — Sắp xếp dữ liệu, loại bỏ "dữ liệu bẩn"

**Điều kiện tiên quyết**: dữ liệu đã đến máy chủ an toàn qua đường truyền.

**Mục tiêu bước này**: trước khi lưu vào CSDL chính thức, kiểm tra sức khỏe một lần — loại bỏ trùng lặp, sửa định dạng sai, đảm bảo dữ liệu cuối cùng sạch và chính xác.

**Tại sao cần làm sạch?** Giống như nhận một thùng hàng chuyển phát, cần kiểm tra: có hàng gửi trùng không? Có gửi nhầm không? Có bao bì hỏng không? Dữ liệu cũng vậy, trước khi lưu vào CSDL cần kiểm tra và sắp xếp.

Quá trình này kỹ thuật gọi là **ETL**, viết tắt của ba từ tiếng Anh:
- **E**xtract (Trích xuất): lấy dữ liệu từ hàng đợi tin nhắn
- **T**ransform (Chuyển đổi): kiểm tra và sửa định dạng dữ liệu
- **L**oad (Tải): ghi dữ liệu sạch vào cơ sở dữ liệu

<DataTrackingDemo tab="overview" />

**💡 Nguyên lý cốt lõi: Hai thao tác chính khi làm sạch dữ liệu**

**Thao tác 1: Loại trùng — Xóa bản ghi trùng lặp**

Như đã nói, khi reconnect SDK tự động gửi bù, có thể cùng một bản ghi bị gửi nhiều lần. Làm sao nhận ra cái nào trùng?

Phương pháp rất đơn giản: khi đóng gói dữ liệu ở client, cấp cho mỗi bản ghi một mã định danh duy nhất toàn cầu (gọi là `dedup_id`, giống như mã vận đơn). Máy chủ trước khi lưu dữ liệu, kiểm tra mã này đã tồn tại chưa — nếu rồi, là dữ liệu trùng, bỏ qua.

**Thao tác 2: Kiểm tra và thống nhất định dạng — Sửa bản ghi không chuẩn**

Ứng dụng liên tục cập nhật phiên bản, code theo dõi ở các phiên bản khác nhau có thể có chút khác biệt. Ví dụ:

- Phiên bản cũ đặt tên trường user ID là `userId`, phiên bản mới đổi thành `user_id`
- Một số bản ghi có timestamp rõ ràng không hợp lý (ví dụ hiển thị năm 1970)
- Một số trường có giá trị không thể nhận diện

Ở bước này, hệ thống viết rule chuyển đổi để xử lý các vấn đề: tên trường không nhất quán thì chuẩn hóa, bản ghi timestamp bất thường thì loại bỏ, giá trị không nhận diện được thì đánh dấu `unknown`.

**Tóm tắt bước này**: sau khi loại trùng và kiểm tra định dạng, dữ liệu được ghi vào **kho dữ liệu (data warehouse)** ở dạng sạch, thống nhất (một loại CSDL chuyên lưu trữ và phân tích lượng lớn dữ liệu, phổ biến có ClickHouse, Hive...). Chuyên viên phân tích có thể trực tiếp truy vấn bằng SQL, nhận kết quả phân tích đáng tin cậy.

---

## Ôn lại toàn bộ quy trình

Dưới đây là tóm tắt bốn bước của theo dõi dữ liệu từ thu thập đến lưu trữ:

| Bước | Đã làm gì | Được gì | Còn vấn đề gì |
|------|-----------|---------|---------------|
| **1. Chọn phương án thu thập** | Quyết định cách ghi nhận thao tác người dùng | Ứng dụng có khả năng ghi nhận | Định dạng dữ liệu các bộ ghi nhận không thống nhất |
| **2. Thiết kế định dạng dữ liệu** | Dùng mẫu 4W1H thống nhất định dạng | Mỗi bản ghi là JSON chuẩn | Lượng người dùng lớn gửi từng cái chịu không nổi |
| **3. Truyền và bộ đệm** | Gom batch gửi, mất mạng lưu cục bộ, hàng đợi đệm | Dữ liệu đến máy chủ an toàn | Thử lại có thể gây trùng dữ liệu |
| **4. Làm sạch và lưu trữ** | Loại trùng, kiểm tra, thống nhất định dạng | ✅ Dữ liệu sạch lưu vào kho dữ liệu | — |

---

## Lời kết

Khi người dùng nhấp một nút trong ứng dụng, bề ngoài chỉ là một thao tác trong tích tắc. Nhưng đằng sau, một chuỗi dữ liệu hoàn chỉnh đã bắt đầu vận hành:

1. Code theo dõi thu thập lần nhấp đó, tạo bản ghi chuẩn theo mẫu 4W1H
2. Bản ghi được tạm lưu cục bộ trên điện thoại, gom đủ batch gửi đến máy chủ
3. Máy chủ nhận ổn định qua hàng đợi tin nhắn, rồi qua loại trùng và kiểm tra định dạng
4. Cuối cùng, một bản ghi sạch, chính xác được ghi vào kho dữ liệu

Đó là toàn bộ quá trình theo dõi dữ liệu. Nó biến thao tác phân tán, vô hình của người dùng thành dữ liệu có cấu trúc có thể truy vấn và phân tích. Quản lý sản phẩm có thể biết người dùng thích tính năng gì, rời đi ở đâu; nhân viên vận hành có thể đánh giá hiệu quả chương trình; lập trình viên có thể định vị vấn đề xuất hiện ở phiên bản nào.

Hệ thống "thu thập → mô hình hóa → truyền → làm sạch" này là cơ sở hạ tầng cho quyết định dựa trên dữ liệu.

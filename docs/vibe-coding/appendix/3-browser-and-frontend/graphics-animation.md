# Đồ họa và Hoạt ảnh (Canvas và những người bạn)

::: tip 🎯 Câu hỏi cốt lõi

Trước đây, trang web chỉ có thể hiển thị văn bản và hình ảnh khô khan. Nhưng nếu bạn muốn làm trò chơi phá gạch, hiệu ứng động lộng lẫy, hay báo cáo dữ liệu có thể kéo thả tự do, thì chỉ dùng `<div>` là hoàn toàn không đủ. Đó là lý do **Canvas (khung vẽ)** ra đời.

Hướng dẫn này sẽ đưa bạn từ việc vẽ đường đầu tiên, đánh quái lên cấp, cho đến khi tự tay viết một engine hạt chạy mượt mà 60 FPS trong trình duyệt.

:::

---

## 1. Canvas là gì?

Nếu trang web thời kỳ đầu được lắp ráp bằng **đồ chơi Lego** (thẻ HTML), thì thẻ `<canvas>` của HTML5 giống như việc ai đó đưa bạn một **tờ giấy trắng kỹ thuật số khổng lồ**, rồi trao cho bạn một **cọ vẽ** được điều khiển bằng code, phần còn lại là do bạn tự do sáng tạo.

Bức tranh ở đây không có cấu trúc thẻ nào cả. Những gì bạn vẽ bằng cọ, một khi đã bút sa sẽ trở thành **"màu sắc điểm ảnh"** thuần túy.

### 1.1 Canvas vs SVG: Hai trường phái nghệ thuật khác nhau

Trong giới vẽ frontend, Canvas có một đối thủ truyền kiếp là **SVG**. Chúng đại diện cho hai quan niệm vẽ hoàn toàn khác biệt:

- **Canvas (bản vẽ bitmap):**
  - **Nguyên lý**: Giống như tô màu thật trên giấy, vài nét vẽ đã biến thành một mảng màu (điểm ảnh).
  - **Ưu điểm**: Máy tính chỉ cần "rắc màu" lên màn hình, hiệu năng cất cánh! Có thể cùng lúc vẽ hàng nghìn hạt nhấp nháy nhảy múa.
  - **Nhược điểm**: Vẽ xong không thể hoàn tác riêng lẻ (không thể chọn qua node DOM), và khi phóng to sẽ bị mờ sọc.
- **SVG (lắp ráp vector):**
  - **Nguyên lý**: Giống như làm PPT. Bạn vẽ một vòng tròn, nó tạo ra một thẻ "thực thể vòng tròn" độc lập đặt trên mặt phẳng.
  - **Ưu điểm**: Dù phóng to 100 lần hay 100 nghìn lần vẫn cực kỳ sắc nét. Mỗi hình dạng là một node DOM độc lập, bạn có thể thay đổi màu sắc bằng CSS hoặc gắn sự kiện click bằng JS bất kỳ lúc nào.
  - **Nhược điểm**: Nếu bạn cố gắng đặt hàng chục nghìn đối tượng bay loạn xạ, cây DOM nặng nề và engine bố cục sẽ làm trình duyệt bị treo.

**🎮 Tóm tắt đơn giản: Chơi game động, làm hiệu ứng hạt đẹp mắt dùng Canvas; vẽ Logo chính xác, viết biểu đồ nhỏ tương tác rõ ràng dùng SVG.**

---

## 2. Nét vẽ đầu tiên: Hiểu hệ tọa độ trái ngược trực giác

### 2.1 Tại sao tờ giấy này bị lộn trên dưới?

Khi chuẩn bị xuống bút, bạn phải hiểu trước rằng thước kẻ trong Canvas bị ngược. Trong hệ tọa độ toán học truyền thống, điểm gốc số không nằm ở giữa, càng lên trên giá trị càng lớn. Nhưng trong lĩnh vực hiển thị màn hình máy tính, hầu hết các thiết bị đặt "điểm gốc (0, 0)" ở **góc trên cùng bên trái** của màn hình. Đi sang phải trục X tăng thì không vấn đề, nhưng **đi xuống dưới, trục Y tăng.**

**Nguyên tắc cốt lõi của hệ tọa độ Canvas:**
- **Đơn vị gốc:** Pixel (px), tương ứng 1:1 với pixel vật lý của màn hình.
- **Trục X:** Hướng dương sang phải, từ `0` đến `canvas.width`.
- **Trục Y:** Hướng dương đi xuống, từ `0` đến `canvas.height`.

👇 Kéo điểm tròn nhỏ dưới đây, cảm nhận trực quan về điểm gốc và hướng tọa độ trong đồ họa máy tính:

<CoordinateSystemDemo />

### 2.2 Thêm gia vị cho cọ vẽ ma thuật của bạn

Có hệ tọa độ, chúng ta có thể triệu hồi cọ vẽ (trong code gọi là `Context`, hay viết tắt `ctx`). Giống như cầm bảng pha màu thật để vẽ, thiết kế API của Canvas tuân thủ hoàn hảo ba bước vẽ vật lý:

1. **Pha màu (State)**: Thiết lập màu fill bằng `fillStyle`, màu stroke bằng `strokeStyle`.
2. **Tạo hình (Path)**: Lên kế hoạch vẽ đường thẳng (`lineTo`), hình tròn (`arc`), hay hình chữ nhật (`rect`).
3. **Bút pháp tối giản (Render)**: Quyết định fill bên trong (`fill()`) hay vẽ viền (`stroke()`).

Vì Canvas là khung vẽ bitmap thuần túy, "bút sa không thể thu hồi", một khi đã vẽ, nó ngay lập tức khô thành pixel, không thể hoàn tác thành đối tượng độc lập.

👇 Thử chọn các hình dạng và màu khác nhau trong bản demo dưới đây, xem code thực hiện "ba bước" đó như thế nào:

<CanvasBasicsDemo />

---

## 3. Cuốn sách hoạt hình lật trang: Làm sao để hình ảnh chuyển động cực kỳ mượt

Vì Canvas một khi fill màu đã trở thành pixel vĩnh viễn, vậy các nhân vật chạy loạn khắp màn hình trong các game HTML5 được làm thế nào?

Câu trả lời là **"đánh lừa mắt bạn"**. Giống hệt nguyên lý cuốn sách lật hình hay phim nhựa:

1. **Xóa bảng (Clear)**: Dùng `clearRect()` để xóa sạch toàn bộ nội dung trên khung vẽ không thương tiếc.
2. **Tính vị trí mới (Update)**: Cho tọa độ X của nhân vật lén tiến thêm 2 pixel.
3. **Vẽ lại (Render)**: Vẽ lại nhân vật ở vị trí mới.
4. **Lặp đi lặp lại (Loop)**: Kết hợp với chiếc máy nhịp cực kỳ chính xác `requestAnimationFrame` tích hợp sẵn trong trình duyệt. Nó sẽ lặp lại ba hành động này theo tần số quét của màn hình (thường là 60 lần mỗi giây, tức 60 FPS).

Vì mắt người có "lưu ảnh", trong 60 lần mỗi giây của [xóa -> cập nhật -> vẽ lại], bạn không chỉ không thấy bảng đen nhấp nháy, mà ngược lại thấy hoạt ảnh mượt mà như tơ lụa.

👇 Điều chỉnh tốc độ phát trong bản demo dưới đây, quan sát cách dịch chuyển từng khung hình nối thành chuyển động trôi chảy:

<AnimationLoopDemo />

---

## 4. Người mù voi sờ: Làm tương tác click trong Canvas thế nào?

Vì khung vẽ Canvas trong mắt trình duyệt chỉ là một "tấm vải màu" không có cấu trúc. Giả sử bạn vẽ một con quái vật bằng `arc()` trên canvas, khi muốn triển khai "click quái vật trừ máu", bạn **hoàn toàn không thể** dùng `document.getElementById` truyền thống để lấy con quái vật này. Vì trong cấu trúc HTML chỉ có thẻ `<canvas>` rộng 600 pixel cứng nhắc đó.

Đây chính là vấn đề kinh điển nhất trong lập trình đồ họa: **Phát hiện va chạm (Collision Detection) và ủy quyền sự kiện**.

Vì trình duyệt chỉ biết chuột của bạn đã click vào tọa độ `(x, y)` của Canvas, bạn phải tự tính toán ngược bằng toán học hình học cấp hai:
- **Đối với hình tròn**: Tính khoảng cách từ `vị trí click chuột` đến `tâm hình tròn` bằng định lý Pythagoras, nếu khoảng cách nhỏ hơn bán kính thì "đã trúng".
- **Đối với hình chữ nhật**: Kiểm tra `x` click có nằm trong biên trái phải của hình chữ nhật, đồng thời `y` có nằm trong biên trên dưới hay không.

Dù có bao nhiêu phần tử trên canvas, sự kiện hover hay click luôn được gắn trên container Canvas duy nhất, đây là "ủy quyền sự kiện" tối thượng.

👇 Thử dùng chuột (click, kéo, hover) hoặc bàn phím (phím mũi tên di chuyển) dưới đây, trải nghiệm logic tương tác tầng thấp "tự tính khoảng cách" này:

<EventHandlingDemo />

---

## 5. Giải phóng sức tính: Hệ thống hạt và phép thuật thị giác

Đến bước này, khi chúng ta hòa trộn "hệ tọa độ", "vòng lặp hoạt ảnh" và "màu sắc hình dạng", rồi nhân bản số lượng lên hàng trăm nghìn mảnh nhỏ, bạn đã nắm giữ vũ khí tối thượng để kích nổ thị giác: **Hệ thống hạt (Particle System)**.

Ý tưởng cốt lõi của nó cực kỳ thô bạo nhưng hiệu quả:
1. Tạo một mảng khổng lồ, nhét hàng trăm "đối tượng hạt" độc lập vào.
2. Mỗi đối tượng có vòng đời riêng (`life`), gia tốc (`vx/vy`), cản trọng lực (`gravity`).
3. Mỗi lần `requestAnimationFrame` kích hoạt, lặp cập nhật hàng trăm hạt, render, rồi âm thầm dọn dẹp những hạt đã "chết" (hết giá trị sống/rơi khỏi màn hình).

Trình duyệt của bạn trong chớp mắt có thể biến thành xưởng sản xuất pháo hoa, tuyết rơi và nổ tung.

👇 Nhấn các hiệu ứng khác nhau, điều chỉnh trọng lực và số hạt, quan sát cách chúng trình bày thị giác quần thể phức tạp qua những công thức toán lý đơn giản nhất:

<ParticleSystemDemo />

---

## 6. Bảo vệ vinh quang FPS: Đối mặt với CPU sốt cao thế nào?

Khi hàng nghìn đối tượng được tính toán và vẽ lại 60 lần trong một giây thì rất tốn hiệu năng. Nếu làm vô tổ chức, quạt máy tính của bạn sẽ sớm cất cánh.

Dưới đây là "tuyệt kỹ hộ thể" mà các cao nhân engine thực thụ dùng để cứu vãn tỷ lệ khung hình:

1. **Xóa bảng cục bộ (Dirty Rect - Hình chữ nhật bẩn):**
   Một nhân vật chạy trên đồng草原 rộng, tuyệt đối đừng `clearRect` cả cánh đồng mỗi khung hình! Nhân vật đi qua khu vực nào, bạn dùng "cục tẩy nhỏ" xóa khu vực đó và vẽ lại, hiệu năng lập tức tăng theo cấp số nhân.

2. **Phép thuật thế thân hậu trường (Offscreen Canvas):**
   Nếu nền là bầu trời đầy sao với các dãy núi phức tạp tuyệt đẹp, render lại mỗi lần thì quá ngốc. Chúng ta thường bí mật tạo một `<canvas>` ẩn trong bộ nhớ, vẽ lên đó thật đẹp một lần. Sau đó trong mỗi khung hình refresh, chỉ cần dùng `drawImage()` dán "phim tĩnh" đã tổng hợp này ra, tránh khối lượng tính toán cơ sở khổng lồ.

3. **Rửa cọ theo lô (Batching):**
   Chuyển từ màu đỏ sang màu xanh trong bảng pha màu rất tốn kém ở tầng dưới. Nếu trên canvas có 1000 vòng tròn đỏ và 1000 vòng tròn xanh xen kẽ. Cách nhanh nhất là: chuẩn bị màu đỏ trước, lặp vẽ xong tất cả vòng tròn đỏ, rồi đổi màu xanh vẽ tất cả vòng tròn xanh. Đây là tư tưởng render theo lô (Batch Rendering) nổi tiếng.

👇 Kéo số lượng đối tượng lên trên 3000, nhìn trang web rơi vào vực thẳm giật lag, rồi bật lần lượt các công tắc "kỹ thuật tối ưu" ở góc dưới bên phải, tận mắt chứng kiến cứu vãn tỷ lệ khung hình thực sự:

<PerformanceDemo />

---

## 7. Bảng tổng thuật ngữ chuyên ngành

| Thuật ngữ | Giải thích thông thường |
| --- | --- |
| **Canvas** | Khung vẽ 2D do HTML5 cung cấp. Vẽ cực nhanh, nhưng vẽ xong biến thành pixel màu, không hỗ trợ thao tác nội dung qua DOM. |
| **SVG** | Đồ họa vector. Phóng to không bao giờ mờ, mỗi hình là phần tử thẻ độc lập, dễ dàng gắn các style CSS và tương tác. |
| **Context (ctx)** | Chiếc "cọ vẽ ma thuật 2D" bạn xin cấp, dùng để pha màu, thiết lập hình dạng và vẽ nhiều hiệu ứng đặc biệt. |
| **requestAnimationFrame** | Máy nhịp thần cấp tích hợp trong trình duyệt, sẽ thực thi callback nghiêm ngặt theo tần số quét của màn hình, là lựa chọn số một để làm hoạt ảnh mượt. |
| **FPS (Tỷ lệ khung hình)** | 60 FPS nghĩa là trong một giây trình duyệt đã xóa canvas 60 lần liền và vẽ lại 60 bức tranh mới. |
| **Dirty Rect (Hình chữ nhật bẩn)** | Chỉ xóa và vẽ lại chính xác trong vùng nhỏ nơi có thay đổi, từ đó bảo toàn hiệu năng mạnh mẽ. |
| **Offscreen Canvas** | "Khung vẽ bóng" ẩn trong bộ nhớ. Vẽ trước các cảnh tĩnh cực kỳ phức tạp, sau đó dùng như贴图 tĩnh để tái sử dụng. |

> Từ một đoạn thẳng đơn giản, đến hệ thống hạt lộng lẫy hùng tráng; mọi hiệu ứng đặc biệt trông như phép thuật, chẳng qua là 60 vòng lặp tính toán tọa độ và vẽ lại mỗi giây mà thôi.

# Cân bằng tải & Gateway
::: tip 🎯 Câu hỏi cốt lõi
**Khi một máy chủ không thể chịu nổi, làm thế nào để phân phối lưu lượng một cách "thông minh" đến nhiều instance máy chủ?** Cân bằng tải là "người điều phối" của hệ thống phân tán hiện đại. Bài viết này thông qua các tình huống thực tế (thu ngân quán trà sữa, phân loại chuyển phát nhanh, chỉ huy giao thông) giúp hiểu sâu về triết lý thiết kế và thực tiễn kỹ thuật của cân bằng tải.
:::

---

## 1. Tại sao cần "cân bằng tải"?

### 1.1 Bắt đầu từ một tình huống thực tế: quá trình phát triển kiến trúc của một website

Một công ty khởi nghiệp đã gặp vấn đề hiệu suất nghiêm trọng khi số lượng người dùng tăng nhanh:

**Tình huống thực tế:**

```
Giai đoạn 1: Máy chủ đơn
Người dùng → Máy chủ (1 nhân 2G)
       ↓
      DAU 1000 → Giờ cao điểm: 1000 người cùng truy cập
       ↓
   Vấn đề: CPU 100%, phản hồi chậm, thường xuyên sập
```

::: warning ⚠️ Vấn đề chết người của máy chủ đơn

- **Nút thắt hiệu suất**: CPU 100%, thời gian phản hồi > 5 giây
- **Điểm lỗi đơn**: Máy chủ sập, toàn bộ website không khả dụng
- **Khó mở rộng**: Chỉ có thể nâng cấp dọc (thêm CPU, RAM), đắt đỏ và có giới hạn
  :::

**Kiến trúc cải tiến (có cân bằng tải):**

```
Giai đoạn 2: Nhiều máy chủ + Cân bằng tải
Người dùng → Cân bằng tải (Nginx)
       ↓
     ├→ Máy chủ 1 (1 nhân 2G)
     ├→ Máy chủ 2 (1 nhân 2G)
     └→ Máy chủ 3 (1 nhân 2G)
```

::: tip ✨ Hiệu quả sau khi cải tiến

- **Nâng cao hiệu suất**: 3 máy chủ xử lý song song, thời gian phản hồi < 1 giây
- **Tính sẵn sàng cao**: 1 máy chủ sập, các máy khác vẫn phục vụ
- **Mở rộng ngang**: Cần thêm hiệu suất? Cứ thêm máy chủ
  :::

### 1.2 Ẩn dụ đời sống về cân bằng tải

**Quầy thu ngân quán trà sữa**

Hãy tưởng tượng bạn mở một quán trà sữa nổi tiếng:

- **1 quầy thu ngân**: Khách xếp hàng, người phía sau không chờ nổi, đánh giá kém
- **3 quầy thu ngân**: Nhân viên phân bổ khách đến các quầy khác nhau, hiệu suất tăng gấp 3

**Cân bằng tải chính là "người phân bổ quầy thu ngân"**:

- **Người dùng** (khách hàng) → Yêu cầu dịch vụ
- **Cân bằng tải** (người phân bổ) → Phân phối yêu cầu đến các máy chủ khác nhau
- **Máy chủ** (quầy thu ngân) → Xử lý yêu cầu

<LoadBalancerTypesDemo />

---

## 2. Cân bằng tải là gì?

### 2.1 Cân bằng tải lớp 4 (L4): Chỉ xem số nhà

**Hoạt động ở tầng vận chuyển (TCP/UDP)**, giống như nhân viên chuyển phát chỉ xem **số nhà (địa chỉ IP + số cổng)** của bạn, không quan tâm nhà bạn làm gì.

**Đặc điểm:**

- **Tốc độ cực nhanh**: Chỉ chuyển tiếp địa chỉ đơn giản, không phân tích nội dung gói tin
- **Tình huống phù hợp**: Kết nối cơ sở dữ liệu, Redis cache, máy chủ game kết nối dài
- **Sản phẩm tiêu biểu**: LVS (Linux Virtual Server), AWS NLB, Azure Load Balancer

::: details Nguyên lý hoạt động

```
Yêu cầu client → Cân bằng tải L4 → Máy chủ backend
              ↓
         Chỉ xem IP + Port
              ↓
         Chuyển tiếp nhanh (không giải nén nội dung)
```

:::

### 2.2 Cân bằng tải lớp 7 (L7): Kiểm tra nội dung gói hàng

**Hoạt động ở tầng ứng dụng (HTTP/HTTPS)**, giống như nhân viên chuyển phát không chỉ xem số nhà mà còn **mở gói hàng kiểm tra nội dung**, dựa vào nội dung để quyết định cách giao.

**Đặc điểm:**

- **Định tuyến thông minh**: Có thể định tuyến tinh vi dựa trên đường dẫn URL, HTTP Header, Cookie, v.v.
- **Tính năng nâng cao**: SSL offloading, cache nội dung, nén, WAF bảo mật
- **Tình huống phù hợp**: Ứng dụng Web, API Gateway, kiến trúc microservice
- **Sản phẩm tiêu biểu**: Nginx, HAProxy, AWS ALB, Envoy

::: details Nguyên lý hoạt động

```
Yêu cầu client → Cân bằng tải L7 → Phân tích nội dung HTTP
              ↓
         Kiểm tra URL, Header, Cookie
              ↓
         Định tuyến thông minh đến máy chủ cụ thể
```

:::

### 2.3 So sánh L4 vs L7

| Khía cạnh           | Cân bằng tải lớp 4 (L4)     | Cân bằng tải lớp 7 (L7)          |
| :------------------ | :-------------------------- | :------------------------------- |
| **Tầng hoạt động**  | Tầng vận chuyển (TCP/UDP)   | Tầng ứng dụng (HTTP/HTTPS)       |
| **Căn cứ quyết định** | Địa chỉ IP + số cổng      | URL, Header, Cookie, Body        |
| **Tốc độ xử lý**    | Cực nhanh (xử lý kernel)    | Nhanh (phân tích user-space)     |
| **Mức độ phong phú** | Chuyển tiếp cơ bản         | SSL offloading, cache, nén, WAF  |
| **Tình huống điển hình** | CSDL, game, kết nối dài | Ứng dụng Web, API Gateway, microservice |
| **Sản phẩm tiêu biểu** | LVS, AWS NLB             | Nginx, HAProxy, AWS ALB          |

---

## 3. Vấn đề cốt lõi 1: Làm thế nào để tránh máy chủ "hỏng" vẫn nhận khách?

### 3.1 Kiểm tra sức khỏe: Đừng để máy chủ "ốm" kéo cả hệ thống xuống

Hãy tưởng tượng, một quầy thu ngân của bạn đột nhiên hỏng, nhưng người phân bổ không biết, vẫn liên tục đưa khách đến đó. Kết quả là hàng đợi ngày càng dài, khách hàng phàn nàn không ngớt.

**Kiểm tra sức khỏe (Health Check) chính là "lính gác" ngăn chặn tình huống này**. Nó định kỳ "khám sức khỏe" mỗi máy chủ, phát hiện máy "ốm" thì lập tức loại khỏi hàng đợi, đợi "khỏe lại" thì mời quay về.

<!-- <HealthCheckDemo /> -->

### 3.2 Kiểm tra sức khỏe chủ động vs Kiểm tra sức khỏe thụ động

**Kiểm tra sức khỏe chủ động (Active Health Check)**: Cân bằng tải chủ động "gõ cửa" hỏi máy chủ "bạn còn ở đó không?"

- Định kỳ gửi yêu cầu thăm dò (như HTTP /health, TCP ping)
- Phản hồi quá thời gian hoặc trả về mã lỗi thì coi là không khỏe
- **Ưu điểm**: Kết quả phát hiện chính xác và đáng tin cậy
- **Nhược điểm**: Tạo ra lưu lượng thăm dò bổ sung

**Kiểm tra sức khỏe thụ động (Passive Health Check)**: Cân bằng tải "quan sát" tình trạng phản hồi của lưu lượng nghiệp vụ thực tế

- Thống kê thời gian phản hồi, tỷ lệ lỗi của các yêu cầu thực tế
- Liên tục thất bại nhiều lần thì coi là không khỏe
- **Ưu điểm**: Không tạo thêm lưu lượng
- **Nhược điểm**: Cần đủ mẫu lưu lượng mới có thể phán đoán

::: details Bảng thiết lập ngưỡng
| Chỉ số | Ngưỡng khỏe | Ngưỡng không khỏe | Ghi chú |
|:---|:---|:---|:---|
| **HTTP status code** | 200-399 | 400+ hoặc timeout | 4xx/5xx đều coi là thất bại |
| **Kết nối TCP** | Thiết lập thành công | Kết nối timeout | Kiểm tra cổng có thể truy cập không |
| **Thời gian phản hồi** | < 500ms | > 2000ms | Thời gian timeout thường đặt 2-5 giây |
| **Số lần thất bại liên tiếp** | - | 3 lần | Tránh phán đoán sai do dao động nhất thời |
| **Khoảng kiểm tra** | - | 5s | Quá thường xuyên sẽ tăng tải |

::: tip 💡 Hố thường gặp: Ngưỡng thiết lập quá "nhạy cảm"
Một nhóm đã đặt ngưỡng thời gian phản hồi của health check là 100ms, trong khi thời gian phản hồi trung bình của ứng dụng dao động từ 80-120ms. Kết quả là máy chủ thường xuyên bị đánh dấu là "không khỏe", dẫn đến lưu lượng dao động liên tục giữa trạng thái khỏe và không khỏe, tỷ lệ khả dụng tổng thể của hệ thống lại giảm.

**Cách làm đúng**: Ngưỡng nên được đặt là **2-3 lần P99 thời gian phản hồi**, để lại đủ không gian đệm cho dao động bình thường.
:::

---

## 4. Vấn đề cốt lõi 2: Làm thế nào để "khách quen" luôn gặp cùng một "thu ngân"?

### 4.1 Duy trì phiên: Để "khách quen" luôn gặp cùng một "thu ngân"

Hãy tưởng tượng bạn là khách quen của quán trà sữa, mỗi lần đến đều do cùng một nhân viên phục vụ. Cô ấy biết sở thích của bạn (nửa đường, không đá), phục vụ vừa nhanh vừa chu đáo. Nhưng nếu mỗi lần đến đều đổi người mới, bạn phải lặp đi lặp lại cùng một yêu cầu, hiệu suất giảm đáng kể.

**Duy trì phiên (Session Persistence/Sticky Session)** chính là giải pháp cho vấn đề này: đảm bảo yêu cầu của cùng một người dùng luôn được định tuyến đến cùng một máy chủ backend.

<SessionPersistenceDemo />

### 4.2 So sánh ba cơ chế duy trì phiên

| Cơ chế           | Nguyên lý thực hiện                                  | Ưu điểm                            | Nhược điểm                          | Tình huống phù hợp                |
| :--------------- | :--------------------------------------------------- | :--------------------------------- | :---------------------------------- | :-------------------------------- |
| **Cookie chèn**  | LB chèn Cookie vào phản hồi, yêu cầu tiếp theo mang Cookie này | Không bị ảnh hưởng bởi IP thay đổi, duy trì ngay từ yêu cầu đầu | Client phải hỗ trợ Cookie, có thể bị tắt | Giỏ hàng thương mại điện tử, duy trì trạng thái đăng nhập |
| **IP Hash**      | Hash địa chỉ IP của client, ánh xạ đến máy chủ cụ thể | Không cần client hỗ trợ, không trạng thái | IP thay đổi sẽ mất phiên, khó phân phối đều | Môi trường không Cookie, WebSocket |
| **Bảng session dính** | LB duy trì bảng ánh xạ session đến máy chủ | Hỗ trợ sao chép session và chuyển đổi dự phòng | Chiếm bộ nhớ LB, cần đồng bộ thêm | Tình huống yêu cầu tính sẵn sàng cao nghiêm ngặt |

::: tip 💡 Khuyến nghị sử dụng

- **Cookie chèn**: Ưu tiên khuyến nghị, khả năng tương thích tốt
- **IP Hash**: Chỉ dùng cho các tình huống đặc biệt như WebSocket
- **Bảng session dính**: Kết hợp với Cookie, cung cấp khả năng chuyển đổi dự phòng
  :::

---

## 5. Vấn đề cốt lõi 3: Làm thế nào để triển khai không downtime?

### 5.1 Triển khai xanh-lam: Phát hành không downtime với "chuyển đổi một chạm"

**Tư tưởng cốt lõi**: Duy trì đồng thời hai môi trường sản xuất hoàn toàn giống nhau (môi trường xanh và môi trường lam), nhưng chỉ một môi trường phục vụ bên ngoài.

<BlueGreenDeploymentDemo />

**Quy trình làm việc:**

1. **Trạng thái ban đầu**: Môi trường lam chạy v1.0 (production), môi trường xanh chờ lệnh.
2. **Triển khai phiên bản mới**: Triển khai v1.1 lên môi trường xanh, thực hiện smoke test nội bộ.
3. **Chuyển đổi lưu lượng**: Trỏ cân bằng tải đến môi trường xanh, lưu lượng chuyển ngay lập tức sang v1.1.
4. **Giám sát quan sát**: Quan sát trạng thái hoạt động của môi trường xanh, xác nhận không có bất thường.
5. **Giữ lại phiên bản cũ**: Môi trường lam giữ v1.0 một thời gian (như 24 giờ), làm bảo hiểm rollback nhanh.

::: tip ✨ Phân tích ưu nhược điểm
| Ưu điểm | Nhược điểm |
|:---|:---|
| ✅ Không downtime, chuyển đổi trong mili giây | ❌ Chi phí tài nguyên cao, cần duy trì đồng thời hai môi trường |
| ✅ Rollback nhanh, phát hiện vấn đề lập tức chuyển về môi trường cũ | ❌ Thay đổi Schema CSDL cần xử lý đặc biệt về tương thích |
| ✅ Môi trường mới có thể kiểm thử đầy đủ trước khi nhận lưu lượng | ❌ Không phù hợp cho dịch vụ có trạng thái (như WebSocket kết nối dài) |

:::

### 5.2 Phát hành canary: Chiến lược "bước nhỏ chạy nhanh"

Phát hành canary lấy tên từ "chim hoàng yến trong mỏ than" lịch sử — thợ mỏ mang chim hoàng yến xuống mỏ, nếu chim có dấu hiệu bất thường nghĩa là có khí độc rò rỉ, thợ mỏ lập tức sơ tán. Trong phát hành phần mềm, phát hành canary là cho một nhóm nhỏ người dùng dùng thử phiên bản mới trước, quan sát không có vấn đề rồi mới mở rộng dần phạm vi.

<CanaryReleaseDemo />

**Tư tưởng cốt lõi:**

1. **Lưu lượng nhỏ đi trước**: Trước tiên đưa 1% lưu lượng vào máy chủ phiên bản mới.
2. **Quan sát chỉ số**: Liên tục giám sát tỷ lệ lỗi, độ trễ, chỉ số nghiệp vụ quan trọng.
3. **Tăng dần lưu lượng**: Nếu mọi thứ bình thường, tăng dần tỷ lệ lên 5%, 10%, 25%, 50%, 100%.
4. **Rollback nhanh**: Một khi phát hiện bất thường, lập tức chuyển toàn bộ lưu lượng về phiên bản cũ.

::: tip 💡 Ưu thế của phát hành canary
| Ưu thế | Mô tả |
|:---|:---|
| 🎯 **Rủi ro kiểm soát được** | Ngay cả phiên bản mới có Bug nghiêm trọng, cũng chỉ ảnh hưởng đến một lượng nhỏ người dùng |
| 📊 **Xác thực thực tế** | Xác thực trong môi trường production thực, đáng tin cậy hơn môi trường kiểm thử |
| 🚀 **Lặp nhanh** | Nhóm có thể tự tin hơn khi thường xuyên phát hành tính năng mới |
| 💰 **Thân thiện tài nguyên** | Không cần chuẩn bị hai môi trường đầy đủ như triển khai xanh-lam |

:::

---

## 6. Vấn đề cốt lõi 4: Làm thế nào để hệ thống tự "thở"?

### 6.1 Tự động mở rộng và thu hẹp: Để hệ thống "xếp ca linh hoạt" như nhà hàng

Hãy tưởng tượng bạn mở một nhà hàng:

- **Giờ cao điểm trưa**: Cần 10 nhân viên phục vụ, nhưng 3 giờ chiều vắng khách chỉ cần 2 người
- Nếu luôn duy trì 10 người: Chi phí nhân công bùng nổ
- Nếu luôn chỉ có 2 người: Giờ cao điểm khách không chờ nổi, bỏ đi hết

**Tự động mở rộng thu hẹp (Auto Scaling)** chính là để hệ thống "xếp ca linh hoạt" như nhà hàng — lúc bận tự động thêm máy chủ, lúc rảnh tự động giảm máy chủ.

<AutoScalingDemo />

### 6.2 Lựa chọn chỉ số mở rộng

Cốt lõi của tự động mở rộng thu hẹp là trả lời câu hỏi: **Khi nào nên thêm máy? Khi nào nên bớt máy?**

Các chỉ số quyết định phổ biến:

| Chỉ số                | Ngưỡng mở rộng   | Ngưỡng thu hẹp   | Tình huống phù hợp         |
| :-------------------- | :--------------- | :--------------- | :------------------------- |
| **CPU sử dụng**       | > 70%            | < 30%            | Ứng dụng tính toán chuyên sâu |
| **RAM sử dụng**       | > 75%            | < 40%            | Ứng dụng tiêu tốn bộ nhớ   |
| **QPS (số yêu cầu/giây)** | > 1000/s     | < 400/s          | API Gateway, dịch vụ Web  |
| **Số kết nối**        | > 5000           | < 1000           | CSDL, hàng đợi tin nhắn    |
| **Chỉ số nghiệp vụ tùy chỉnh** | Tùy nghiệp vụ | Tùy nghiệp vụ | Tình huống nghiệp vụ đặc thù |

::: tip 💡 "Hố" và "Giải pháp" của chiến lược mở rộng

**Hố 1: Phản ứng mở rộng quá chậm, đỉnh lưu lượng đã đánh sập hệ thống**

Trong một sự kiện khuyến mãi thương mại điện tử, thiết lập CPU > 80% kích hoạt mở rộng, nhưng giám sát thu thập có độ trễ 1 phút, instance mới khởi động cần 3 phút. Kết quả lưu lượng đến quá nhanh, mở rộng chưa hoàn thành, máy chủ đã bị đánh sập.

**Giải pháp:**

- **Mở rộng trước**: Dựa trên dữ liệu lịch sử dự đoán đỉnh lưu lượng, bắt đầu mở rộng trước 30 phút
- **Ngưỡng đa cấp**: Thiết lập 60% cảnh báo (bắt đầu khởi động instance mới), 70% mở rộng chính thức, 80% mở rộng khẩn cấp
- **Mở rộng nhanh**: Sử dụng triển khai container hóa, instance mới khởi động trong 30 giây (so với máy ảo 3-5 phút)

**Hố 2: Mở rộng quá quyết liệt, chi phí bùng nổ**

Một công ty khởi nghiệp thiết lập chiến lược mở rộng quyết liệt: CPU > 50% là mở rộng. Kết quả một dao động nghiệp vụ bình thường đã kích hoạt mở rộng, số lượng máy chủ từ 5 lên 30, hóa đơn cloud cuối tháng làm CTO phát khóc.

**Giải pháp:**

- **Thiết lập thời gian làm mát mở rộng**: Sau một lần mở rộng, ít nhất đợi 5 phút mới có thể mở rộng lại
- **Thiết lập số instance tối đa**: max = số instance hiện tại × 2, tránh mở rộng vô hạn
- **Phân biệt đột biến và xu hướng**: Chỉ khi liên tục 3 chu kỳ vượt ngưỡng mới mở rộng, tránh đột biến điểm đơn kích hoạt

**Hố 3: Thu hẹp quá nhanh, máy vừa mở rộng đã bị thu ngay**

Một nhóm thiết lập CPU < 30% thu hẹp. Sau khi mở rộng, lưu lượng vẫn đang được xử lý, CPU tạm giảm xuống 25%, kích hoạt thu hẹp. Vừa thu xong CPU lại lên 80%, lại kích hoạt mở rộng — hệ thống dao động điên cuồng trong vòng "mở rộng-thu hẹp-mở rộng".

**Giải pháp:**

- **Thu hẹp bảo thủ hơn**: Ngưỡng mở rộng 70%, ngưỡng thu hẹp 25%, có đủ vùng đệm ở giữa
- **Thời gian làm mát thu hẹp dài hơn**: Sau khi mở rộng, ít nhất đợi 10 phút mới được thu hẹp
- **Thu hẹp từng bước**: Mỗi lần chỉ thu 1 máy, quan sát rồi mới quyết định có thu tiếp không
  :::

---

## 7. Thực chiến: Làm thế nào để chọn cân bằng tải?

### 7.1 So sánh các cân bằng tải chính

| Đặc tính       | Nginx                           | HAProxy               | Envoy          | Cân bằng tải nhà cung cấp cloud |
| -------------- | ------------------------------- | --------------------- | -------------- | ------------------------------- |
| **Định vị**    | Reverse proxy/cân bằng tải hiệu suất cao | Cân bằng tải mã nguồn mở | Proxy cloud native | Cân bằng tải được quản lý |
| **Hiệu suất**  | Cực cao (C, event-driven)       | Cao (event-driven)    | Cao (C++/Rust) | Cực cao                         |
| **Tính năng**  | Cân bằng tải cơ bản, file tĩnh, cache | Thuật toán cân bằng tải phong phú | Định tuyến nâng cao, quan sát | Tính năng đầy đủ |
| **Cấu hình**   | File cấu hình (nginx.conf)      | File cấu hình (haproxy.cfg) | API/file cấu hình | Giao diện điều khiển |
| **Mở rộng**    | C module/Lua script             | Lua script             | WASM/Filter     | Plugin                          |
| **Tình huống** | Tài nguyên tĩnh, cân bằng tải L7, SSL termination | Cân bằng tải L7, tính sẵn sàng cao | Service mesh, multi-cloud | Bắt đầu nhanh |

::: tip 💡 Khuyến nghị lựa chọn
**Cây quyết định:**

```
Chọn cân bằng tải:
│
├─ Chỉ cần cân bằng tải L4 cơ bản?
│  ├─ Có → LVS (mã nguồn mở miễn phí) hoặc NLB của nhà cung cấp cloud
│  └─ Không → Tiếp tục
│
├─ Cần Service mesh, triển khai multi-cloud?
│  ├─ Có → Envoy
│  └─ Không → Tiếp tục
│
├─ Cần cấu hình và plugin cực kỳ phức tạp?
│  ├─ Có → HAProxy
│  └─ Không → Tiếp tục
│
├─ Cần hiệu suất cao + cấu hình đơn giản?
│  ├─ Có → Nginx (lựa chọn hàng đầu)
│  └─ Tiếp tục
│
├─ Muốn vận hành được quản lý?
│  ├─ Có → Cân bằng tải nhà cung cấp cloud (AWS ALB, Alibaba SLB)
│  └─ Nginx tự xây dựng
```

:::

---

## 8. Tổng kết: Tư duy cốt lõi của cân bằng tải

### 8.1 Ôn tập nguyên tắc cốt lõi

| Nguyên tắc | Ý nghĩa                       | Điểm thực hành                              |
| ---------- | ----------------------------- | ------------------------------------------- |
| **Phân tầng** | L4 xử lý "phân loại chuyển phát" (nhanh nhưng đơn giản) | L4 xử lý CSDL, game; L7 xử lý Web, API     |
| **Dự phòng** | Điểm lỗi đơn là kẻ thù của kiến trúc | Triển khai đa instance, đa khu vực để nâng cao tính sẵn sàng |
| **Tiệm tiến** | Phát hành phiên bản mới không "một nhát cắt" | Triển khai xanh-lam đạt không downtime; canary đạt rủi ro kiểm soát được |
| **Đàn hồi** | Hệ thống nên "thở" như sinh vật sống | Lúc bận tự động mở rộng, lúc rảnh tự động thu hẹp |

### 8.2 Danh sách kiểm tra thiết kế

Trước khi áp dụng cân bằng tải, hãy tự hỏi những câu sau:

- [ ] Có thực sự cần cân bằng tải không? (Hiệu suất máy đơn có thực sự không đủ không)
- [ ] Chọn L4 hay L7? (Dựa trên tình huống nghiệp vụ)
- [ ] Làm thế nào để xử lý duy trì phiên? (Cookie, IP Hash, bảng session)
- [ ] Làm thế nào để thực hiện health check? (Chủ động, thụ động, thiết lập ngưỡng)
- [ ] Làm thế nào để đạt không downtime? (Triển khai xanh-lam, canary)
- [ ] Làm thế nào để đạt đàn hồi? (Chỉ số mở rộng/thu hẹp, thời gian làm mát, số instance tối đa)

---

## 9. Bảng tra cứu thuật ngữ

| Thuật ngữ             | Tiếng Anh                                 | Giải thích                                                                 |
| --------------------- | ----------------------------------------- | -------------------------------------------------------------------------- |
| **Cân bằng tải**      | Load Balancer                             | Thiết bị hoặc phần mềm phân phối lưu lượng đến nhiều máy chủ backend       |
| **Cân bằng tải L4**   | L4 Load Balancing                         | Cân bằng tải dựa trên tầng vận chuyển (TCP/UDP)                            |
| **Cân bằng tải L7**   | L7 Load Balancing                         | Cân bằng tải dựa trên tầng ứng dụng (HTTP/HTTPS)                           |
| **Health check**      | Health Check                              | Cơ chế định kỳ kiểm tra trạng thái sức khỏe của máy chủ backend            |
| **Duy trì phiên**     | Session Persistence                       | Đảm bảo yêu cầu của cùng một người dùng luôn được định tuyến đến cùng một máy chủ |
| **Sticky session**    | Sticky Session                            | Cách gọi khác, tương đương Session Persistence                             |
| **Triển khai xanh-lam** | Blue-Green Deployment                   | Chiến lược phát hành không downtime bằng cách chuyển đổi hai môi trường    |
| **Phát hành canary**  | Canary Release                            | Chiến lược phát hành xám với lưu lượng nhỏ xác thực trước                   |
| **Tự động mở rộng thu hẹp** | Auto Scaling                        | Tự động tăng hoặc giảm số lượng máy chủ theo tải                           |
| **Mở rộng ngang**     | Horizontal Scaling                        | Tăng số lượng máy chủ để nâng cao khả năng xử lý                           |
| **Mở rộng dọc**       | Vertical Scaling                          | Nâng cấp cấu hình máy đơn (CPU, RAM) để nâng cao khả năng xử lý            |
| **Đa khu vực**        | Multi-Region                              | Triển khai dịch vụ ở nhiều khu vực địa lý                                  |
| **Active-Active**     | Active-Active                             | Nhiều khu vực cùng lúc phục vụ bên ngoài                                   |
| **Active-Standby**    | Active-Standby                            | Chỉ một khu vực phục vụ, các khu vực khác chờ lệnh                         |
| **Đồng bộ dữ liệu**  | Data Replication                          | Cơ chế sao chép dữ liệu xuyên khu vực                                      |
| **RTO**               | Recovery Time Objective (RTO)             | Mục tiêu thời gian khôi phục, thời gian cần để khôi phục sau sự cố hệ thống |
| **RPO**               | Recovery Point Objective (RPO)            | Mục tiêu điểm khôi phục, lượng dữ liệu có thể chấp nhận mất sau sự cố      |

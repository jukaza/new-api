# Thực hành nền tảng đám mây
> **Hướng dẫn học**: Nhà cung cấp dịch vụ đám mây không phải là "website mua server", mà là "cơ sở hạ tầng cung cấp năng lực tính toán như công ty nước và điện". Chương này tập trung vào câu hỏi: **Từ con số 0, làm thế nào để hiểu và sử dụng dịch vụ đám mây?** Chúng ta sẽ dùng kịch bản thực tế, ví dụ sinh động và bước thực hành để giúp bạn xây dựng bản đồ nhận thức hoàn chỉnh.

Trước khi bắt đầu, nên tìm hiểu:

- **Khái niệm mạng cơ bản**: Nếu chưa quen IP address, port, domain, xem [Kiến thức mạng cơ bản](/zh-cn/appendix/1-computer-fundamentals/computer-networks)
- **API là gì**: Nếu chưa hiểu API, xem [Giới thiệu API](/zh-cn/appendix/4-server-and-backend/api-intro)

---

## 0. Mở đầu: Tại sao ngày càng nhiều công ty không mua server?

Tưởng tượng kịch bản này:

Tiểu Minh khởi nghiệp năm 2010, muốn làm website. Anh ấy trải qua những gì?

Trước tiên bỏ ra 20.000 tệ mua server Dell, rồi liên hệ IDC data center, trả 3.000 tệ/tháng phí colocate. Rồi tự cài Linux, cấu hình môi trường, lo lắng vấn đề phần cứng - ổ cứng hỏng phải tự thay, máy quá nhiệt phải tự xử lý. Đau khổ nhất là khi user tăng đột biến, hệ thống không chịu nổi, lại phải mua server mới. Một năm sau, Tiểu Minh tốn 50.000 tệ, utilization server chỉ 10%.

Còn công ty Tiểu Hồng khởi nghiệp năm 2024, làm thế nào?

Cô mở website nhà cung cấp đám mây, đăng ký tài khoản, click vài cái đã tạo xong cloud server trong 2 phút. Dùng bao nhiêu trả bấy nhiêu, không dùng không tốn tiền. Traffic tăng, click nâng cấp cấu hình. Muốn mở chi nhánh Mỹ? Đổi region là xong. Một tháng sau, Tiểu Hồng tốn 500 tệ, utilization server 80%.

**Theo trực giác, chúng ta có thể nghĩ: "Dịch vụ đám mây chính là thuê server".**

Nhưng bản chất dịch vụ đám mây còn hơn thế - đó là một **cuộc cách mạng về năng lực tính toán**.

Trước đây, doanh nghiệp phải trải qua quá trình dài: mua server, tìm data center, cài hệ điều hành, lo lắng phần cứng, bất lực khi traffic tăng vọt. Giờ chỉ cần đăng ký tài khoản, click vài cái, trả tiền theo usage, tự động scale, deploy toàn cầu. Sự chuyển đổi này giống như từ việc tự đào giếng lấy nước sang mở vòi là có nước máy.

---

## 1. Nhà cung cấp dịch vụ đám mây là gì?

### 1.1 Dịch vụ tính toán như công ty nước và điện

Bản chất nhà cung cấp dịch vụ đám mây là **đóng gói năng lực tính toán, lưu trữ, mạng thành dịch vụ tiêu chuẩn hóa**, như công ty nước cung cấp nước, công ty điện cung cấp điện, cung cấp cho người dùng qua internet.

Điều thông minh của mô hình này là **sử dụng theo nhu cầu**. Bạn không cần mua nhiều phần cứng trước, chỉ trả tiền theo lượng sử dụng thực tế. Cần thêm tài nguyên? Click một cái. Một số dịch vụ tính phí theo giây, cực kỳ linh hoạt. Hơn nữa, nhà cung cấp đám mây có data center ở hàng chục quốc gia, bạn có thể deploy ứng dụng toàn cầu, mọi thao tác đều self-service, 24 giờ, không cần phê duyệt thủ công.

### 1.2 Khác biệt giữa dịch vụ đám mây và colocate truyền thống

Colocate IDC truyền thống giống như tự mua máy phát điện. Bạn cần mua phần cứng (server), rồi tìm nơi đặt (colocate data center), rồi tự bảo trì (cài hệ điều hành, sửa phần cứng). Nếu điện không đủ, phải mua thêm máy phát. Quá trình này mất vài ngày đến vài tuần, chi phí cố định, dùng hay không đều phải trả tiền.

Dịch vụ đám mây giống như kết nối lưới điện quốc gia. Không cần mua máy phát, chỉ cần "cắm dây" (đăng ký tài khoản), rồi trả tiền theo lượng điện dùng. Cần thêm điện năng? Chuyển gói công suất lớn hơn, xong trong vài phút. Mô hình này, chi phí biến đổi, dùng bao nhiêu trả bấy nhiêu, và nhà cung cấp đám mây chịu trách nhiệm bảo trì phần cứng, bạn chỉ tập trung vào kinh doanh.

### 1.3 Public cloud, private cloud và hybrid cloud

Như nhà hàng có nhiều mô hình kinh doanh, dịch vụ đám mây cũng có ba loại.

**Public cloud** giống nhà hàng công cộng, ai cũng dùng được, tài nguyên dùng chung. AWS, Alibaba Cloud, Azure đều là public cloud, phù hợp với hầu hết doanh nghiệp và cá nhân. Đây là trọng tâm của cuốn sách, vì phổ biến nhất và phù hợp để học nhất.

**Private cloud** giống nhà bếp riêng, tự xây, tài nguyên độc quyền. OpenStack, VMware là đại diện tiêu biểu, phù hợp doanh nghiệp lớn, chính phủ, ngân hàng yêu cầu bảo mật dữ liệu cực cao.

**Hybrid cloud** là kết hợp cả hai, một phần kinh doanh dùng public cloud, phần kia dùng private cloud. Các nhà cung cấp đều có giải pháp, phù hợp kịch bản cần cả compliance lẫn elastic.

👇 **Click để khám phá**:
Click vào card dịch vụ bên dưới để tìm hiểu sáu loại dịch vụ đám mây cốt lõi.

<CloudServicesOverview />

---

## 2. Nhà cung cấp dịch vụ đám mây nổi tiếng

### 2.1 Ba gã khổng lồ quốc tế: AWS, Azure, Google Cloud

Thị trường dịch vụ đám mây toàn cầu, ba nhà cung cấp chiếm ưu thế.

**AWS (Amazon Web Services)** là dịch vụ đám mây Amazon ra mắt 2006, thị phần toàn cầu số 1, khoảng 32%. Giống như "cửa hàng bách hóa" của ngành đám mây, loại dịch vụ đa dạng nhất, hơn 200 loại, chức năng chín muồi và ổn định nhất, tài liệu và tài nguyên cộng đồng phong phú nhất. Giá khá cao nhưng giá trị tốt, đặc biệt phù hợp doanh nghiệp mở rộng quốc tế, startup và công ty internet lớn.

**Microsoft Azure** là dịch vụ đám mây Microsoft ra mắt 2010, thị phần toàn cầu thứ hai, khoảng 23%. Điểm mạnh nhất là tích hợp sâu với hệ sinh thái Windows và Office, khách hàng doanh nghiệp phong phú, năng lực hybrid cloud mạnh, đặc biệt thân thiện với developer .NET.

**Google Cloud Platform (GCP)** là dịch vụ đám mây Google ra mắt 2011, thị phần toàn cầu thứ ba, khoảng 10%. Dẫn đầu về Kubernetes, data analytics và AI, năng lực đổi mới công nghệ mạnh, giá tương đối rẻ. Nhưng thị phần nhỏ, ecosystem không hoàn thiện bằng hai công ty trên, phù hợp công ty hướng công nghệ, ứng dụng container và dự án AI.

### 2.2 Ba gã khổng lồ trong nước: Alibaba Cloud, Tencent Cloud, Huawei Cloud

Thị trường dịch vụ đám mây Trung Quốc cũng có ba nhà cung cấp chính.

**Alibaba Cloud** là bộ phận điện toán đám mây Alibaba thành lập 2009, thị phần Trung Quốc số 1, khoảng 40%. Là nhà cung cấp đám mây trong nước sớm và chín muồi nhất, dịch vụ đa dạng, kinh nghiệm kỹ thuật e-commerce và Double Eleven sâu dày. Giá khá cao nhưng ổn định và chức năng hoàn thiện đều hàng đầu, đặc biệt phù hợp doanh nghiệp nội địa và dự án liên quan e-commerce.

**Tencent Cloud** là bộ phận dịch vụ đám mây Tencent thành lập 2013, thị phần Trung Quốc thứ hai, khoảng 15%. Mạnh về game, âm thanh và video, kết hợp tốt với ecosystem WeChat và QQ, giá tương đối rẻ, phát triển nhanh trong vài năm gần đây. Nếu bạn làm game, xã hội hoặc livestream, Tencent Cloud là lựa chọn tốt.

**Huawei Cloud** là bộ phận dịch vụ đám mây Huawei thành lập 2015, thị phần Trung Quốc thứ ba, khoảng 10%. Tích lũy công nghệ phần cứng mạnh, khách hàng chính phủ và doanh nghiệp phong phú, năng lực compliance an ninh mạnh, chip AI (Ascend) đặc sắc. Phù hợp dự án chính phủ, doanh nghiệp nhà nước lớn và sản xuất.

### 2.3 Cách chọn nhà cung cấp đám mây?

Chọn nhà cung cấp đám mây giống chọn thuê nhà, phải xem vị trí, giá, tiện ích và nhiều yếu tố.

**Trước hết xem thị trường mục tiêu**. User chính ở đâu? Nếu ở Trung Quốc, chọn Alibaba Cloud hoặc Tencent Cloud; nếu ở nước ngoài, chọn AWS hoặc Azure; nếu kinh doanh toàn cầu, chọn nhà cung cấp có coverage đa region.

**Tiếp theo xem technology stack**. Dùng công nghệ gì? Nếu dùng công nghệ Microsoft, chọn Azure; nếu dùng Kubernetes, big data, chọn Google Cloud; nếu kịch bản tổng quát, AWS là lựa chọn ổn.

**Rồi xem chi phí**. Dự án nhỏ thử nghiệm chọn rẻ như Tencent Cloud hoặc UCloud; production quy mô lớn thì xem tổng chi phí, AWS lâu dài có thể tiết kiệm hơn.

**Cuối cùng xem ecosystem**. Nếu đang dùng GitHub, Office 365, chọn nhà cung cấp cùng ecosystem sẽ tiện hơn.

Khuyến nghị thực tế: người mới hoặc dự án nhỏ chọn Alibaba Cloud hoặc Tencent Cloud vì tài liệu tiếng Trung, support trong nước; dự án mở rộng quốc tế chọn AWS vì chín muồi nhất, coverage toàn cầu tốt nhất; doanh nghiệp lớn có thể cần chiến lược multi-cloud.

---

## 3. Thông thường sử dụng dịch vụ đám mây thế nào?

### 3.1 Quy trình hoàn chỉnh từ đăng ký đến上线

Bước đầu tiên sử dụng dịch vụ đám mây là đăng ký tài khoản. Quá trình này giống mở tài khoản ngân hàng, cần xác minh danh tính. Mở website nhà cung cấp đám mây, click "Đăng ký miễn phí", điền email và mật khẩu, xác minh số điện thoại, upload CMND hoặc giấy phép kinh doanh để xác thực, cuối cùng liên kết phương thức thanh toán. Toàn bộ khoảng 10-20 phút.

Sau khi đăng ký, cần hiểu vài khái niệm cốt lõi. **Region** là khu vực data center, như East China (Hangzhou), US East (Virginia), Asia Pacific (Singapore). Nguyên tắc chọn càng gần user càng tốt, vì latency thấp. **Availability Zone (AZ)** là nhiều data center trong một region, cách ly nhau, tăng availability. Nếu một AZ down, AZ khác vẫn hoạt động. **Instance** là server ảo, như cloud server 2 nhân 4GB, tính phí theo thời gian hoặc theo usage.

### 3.2 Tạo cloud server đầu tiên

Tạo cloud server giống lắp ráp máy tính, nhưng chọn cấu hình trên webpage. Trước tiên chọn phương thức thanh toán: môi trường test dùng pay-as-you-go, chạy dài hạn dùng subscription. Rồi chọn region, chọn gần nhất. Instance spec, 2 nhân 4GB đủ cho test. Image chọn OS như CentOS 7.9 hoặc Ubuntu 20.04. Storage dùng 40GB system disk, network dùng VPC mặc định, bandwidth trả theo traffic. Cuối cùng đặt mật khẩu root, nhớ giữ kỹ. Toàn bộ khoảng 5 phút, instance tạo xong đợi 1-2 phút là dùng được.

👇 **Click để khám phá**:
Chọn cấu hình, xem giá và kịch bản phù hợp của các spec khác nhau.

<ComputeInstanceDemo />

### 3.3 Kết nối cloud server và deploy ứng dụng

Kết nối Linux server khuyến nghị dùng SSH. Đăng nhập bằng mật khẩu: `ssh root@IP-public-server`, rồi nhập password. Đăng nhập bằng key an toàn hơn: `ssh -i private-key.pem root@IP-public-server`.

Kết nối xong, bạn có thể deploy ứng dụng. Trước tiên update hệ thống: CentOS dùng `sudo yum update -y`, Ubuntu dùng `sudo apt update && sudo apt upgrade -y`. Rồi cài phần mềm cần thiết như Node.js. Upload code dùng git hoặc scp. Cuối cùng cài dependencies và khởi động ứng dụng.

### 3.4 Kịch bản sử dụng phổ biến

**Hosting website cá nhân hoặc blog** cần cloud server + domain, 1 nhân 2GB đủ, chi phí khoảng 50-100 tệ/tháng, dùng Nginx + static file hoặc WordPress.

**Deploy API backend** cần cloud server + database, 2 nhân 4GB trở lên, chi phí khoảng 200-500 tệ/tháng, dùng Node.js/Python + MySQL/PostgreSQL.

**Lưu trữ ảnh hoặc video** khuyến nghị dùng object storage, tính phí theo dung lượng và traffic, chi phí vài tệ đến vài trăm/tháng. Ưu điểm không cần quản lý ổ cứng, tự động backup, kết hợp CDN tăng tốc.

👇 **Click để khám phá**:
Tìm hiểu các loại dịch vụ lưu trữ đám mây và kịch bản sử dụng.

<StorageTypeDemo />

---

## 4. Mua và gọi API như thế nào?

### 4.1 Mô hình tính phí dịch vụ đám mây

Dịch vụ đám mây có nhiều mô hình tính phí, hiểu rõ giúp tiết kiệm nhiều tiền.

**Pay-as-you-go** giống mua vé xem phim lẻ, dùng bao nhiêu trả bấy nhiêu, không dùng không trả. Phù hợp môi trường test, dự án traffic không ổn định. Cloud server tính theo giờ, object storage theo GB + số request, AI API theo số lần gọi.

**Subscription/Reserved Instance** giống mua vé tháng/năm, cam kết sử dụng thời gian nhất định, được giảm giá, thường tiết kiệm 30-60%. Phù hợp production chạy ổn định dài hạn. Ví dụ server 2 nhân 4GB, pay-as-you-go 200 tệ/tháng, sub 1 năm có thể chỉ 140 tệ/tháng.

**Spot Instance** giống vé chờ, giá rất thấp, tiết kiệm tới 90%, nhưng có thể bị thu hồi. Phù hợp batch processing, task chịu lỗi cao, như xử lý data, render. Rủi ro là nhà cung cấp thu hồi khi thiếu tài nguyên.

**Serverless theo số lần gọi** giống taxi, không quan tâm server, chỉ quan tâm số lần gọi. Tính phí theo số lần gọi + compute time + traffic, phù hợp API endpoint, event-driven task. Ví dụ Alibaba Cloud Function Compute, 1 triệu lần gọi miễn phí, sau đó 1.33 tệ/triệu.

👇 **Click để khám phá**:
Dùng calculator giá, so sánh chi phí giữa các mô hình tính phí.

<PricingCalculator />

### 4.2 Quy trình mua API call hoàn chỉnh

Ví dụ gọi API Tongyi Qianwen, toàn bộ 4 bước.

**Bước 1: Kích hoạt dịch vụ**. Mở nền tảng AI hoặc PAI của nhà cung cấp đám mây, tìm Tongyi Qianwen hoặc DashScope, click "Kích hoạt ngay" hoặc "Dùng thử miễn phí", khoảng 2 phút.

**Bước 2: Lấy API Key**. Vào quản lý API-KEY trong console, click "Tạo API-KEY", copy và lưu Key này. Lưu ý quan trọng: API Key chỉ hiển thị 1 lần, lưu ngay.

**Bước 3: Cấu hình quyền**. Vào quản lý truy cập (RAM) hoặc quyền (IAM), tạo user hoặc role, chỉ cấp quyền cần thiết, như chỉ gọi Tongyi Qianwen, không được xóa server. Đây là nguyên tắc quyền tối thiểu.

**Bước 4: Test gọi**. Dùng Python hoặc JavaScript gọi lần đầu, xác nhận API hoạt động bình thường.

---

## 5. Thực hành: Deploy website từ con số 0

### 5.1 Kịch bản và chọn giải pháp

Giả sử bạn là frontend developer, muốn deploy blog cá nhân. Yêu cầu: static website (HTML/CSS/JS), có domain riêng, truy cập nhanh toàn cầu, chi phí thấp nhất.

Có ba giải pháp. Cloud server chi phí trung bình, độ khó trung bình, phù hợp khi cần backend. Object storage + CDN chi phí thấp, độ khó thấp, phù hợp static website thuần, đây là giải pháp khuyến nghị. Serverless chi phí rất thấp, độ khó trung bình, phù hợp nội dung dynamic.

Khuyến nghị object storage + CDN vì: chi phí thấp nhất (có thể miễn phí), cấu hình đơn giản nhất, tốc độ nhanh nhất (CDN加速).

👇 **Click để khám phá**:
Theo hướng dẫn từng bước, tìm hiểu quy trình deploy website hoàn chỉnh.

<DeployWorkflowDemo />

### 5.2 Các bước triển khai

**Bước 1: Chuẩn bị file website**. Tạo file index.html đơn giản:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Blog của tôi</title>
</head>
<body>
  <h1>Chào mừng đến với blog của tôi</h1>
  <p>Đây là bài viết đầu tiên của tôi.</p>
</body>
</html>
```

**Bước 2: Tạo Object Storage Bucket**. Đăng nhập cloud console, tìm Object Storage (OSS/S3), click "Tạo Bucket". Cấu hình tên (như my-blog-2024, unique toàn cục), chọn region (gần nhất), quyền đặt public read (website cần truy cập).

**Bước 3: Upload file**. Vào Bucket, click "Upload file", chọn index.html, đợi upload xong.

**Bước 4: Cấu hình static website hosting**. Vào cài đặt Bucket, tìm "Static page" hoặc "Website hosting", bật tính năng, đặt index.html làm trang chủ mặc định, lưu cấu hình.

**Bước 5: Liên kết domain (tùy chọn)**. Mua domain, thêm CNAME record trỏ đến Bucket domain, liên kết custom domain trong Bucket, cấu hình HTTPS.

**Bước 6: Cấu hình CDN (khuyến nghị)**. Kích hoạt CDN, thêm加速 domain, chọn origin (Bucket của bạn), đợi CDN có hiệu lực (vài phút đến vài giờ).

### 5.3 Ước tính chi phí

Chi phí hàng tháng: Object storage 0-5 tệ (theo dung lượng), CDN traffic 0-10 tệ (theo traffic, có free tier), domain 5-10 tệ (chia theo năm). Tổng 5-25 tệ/tháng, website nhỏ có thể hoàn toàn miễn phí.

---

## 6. Tổng kết và bước tiếp theo

### 6.1 Ôn tập điểm chính

Bản chất dịch vụ đám mây tóm tắt: nhà cung cấp đám mây là công ty nước điện của năng lực tính toán, cung cấp self-service, deploy toàn cầu, trả tiền theo usage. Quy trình sử dụng: chọn nhà cung cấp, đăng ký, tạo tài nguyên, cấu hình quyền, monitor chi phí.

Điểm quyết định chính: chọn nhà cung cấp theo thị trường, technology stack, chi phí; chọn mô hình tính phí cân bằng giữa pay-as-you-go, subscription, serverless; cấu hình quyền theo nguyên tắc tối thiểu, bật MFA, audit định kỳ; kiểm soát chi phí monitor usage, dùng discount, giải phóng tài nguyên không cần.

### 6.2 Lộ trình học tập đề xuất

Tuần 1: Học lý thuyết cơ bản, hiểu khái niệm dịch vụ đám mây, đăng ký tài khoản, tạo cloud server đầu tiên. Tuần 2: Thực hành, deploy static website, cấu hình domain và CDN, học lệnh Linux cơ bản. Tuần 3: Học kỹ năng nâng cao, quản lý quyền (IAM), monitoring và alert, tối ưu chi phí. Tuần 4: Project thực hành, deploy ứng dụng hoàn chỉnh, cấu hình database và storage, tự động scale.

### 6.3 Tài nguyên đề xuất

Tài liệu chính thức: Trung tâm tài liệu Alibaba Cloud, Tài liệu AWS tiếng Trung, Tài liệu Tencent Cloud. Nền tảng học tập: Alibaba Cloud University, AWS Free Tier, Tencent Cloud Lab. Tài nguyên cộng đồng: Cloud Native Community, Serverless Trung Quốc, InfoQ Cloud Computing Column.

---

## 7. Bảng thuật ngữ

| Thuật ngữ tiếng Anh | Tiếng Việt | Giải thích |
| :--- | :--- | :--- |
| **Cloud Provider** | Nhà cung cấp dịch vụ đám mây | Công ty cung cấp dịch vụ điện toán đám mây, như AWS, Alibaba Cloud |
| **Region** | Region (Vùng) | Khu vực địa lý đặt data center |
| **Availability Zone** | AZ (Zone khả dụng) | Data center độc lập trong một region |
| **Instance** | Instance | Server ảo |
| **Image/AMI** | Image | Template hệ điều hành pre-configured |
| **VPC** | Virtual Private Cloud | Môi trường mạng ảo cách ly |
| **IAM/RAM** | Quản lý danh tính và truy cập | Hệ thống quản lý quyền |
| **User** | User | Một danh tính cụ thể |
| **Group** | Nhóm user | Tập hợp user |
| **Role** | Role | Danh tính tạm thời |
| **Policy** | Policy | Tài liệu JSON định nghĩa quyền |
| **API Key** | API Key | Credential gọi API |
| **AccessKey** | Access Key | Credential truy cập programmatic (ID + Secret) |
| **MFA** | Multi-Factor Authentication | Đăng nhập cần mật khẩu + mã xác minh |
| **CDN** | Content Delivery Network | Dịch vụ加速 toàn cầu, cache static resource |
| **OSS/S3** | Object Storage | Dịch vụ lưu trữ file |
| **ECS/EC2** | Cloud Server | Dịch vụ hosting ảo |
| **RDS** | Relational Database Service | Database được quản lý |
| **Serverless** | Serverless | Mô hình tính toán không cần quản lý server |
| **Pay-as-you-go** | Pay-as-you-go | Trả tiền theo usage |
| **Reserved Instance** | Reserved Instance | Mô hình trả phí subscription |
| **Spot Instance** | Spot Instance | Instance giá rẻ nhưng có thể bị thu hồi |

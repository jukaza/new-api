# Tự động hóa CI / CD
::: tip 🎯 Vấn đề cốt lõi
**Code chạy rất tốt trên máy cục bộ, làm thế nào để mọi người trên toàn thế giới có thể truy cập?**
:::

---

## 1. Tại sao cần "đưa dịch vụ lên mạng"?

Hãy tưởng tượng, bạn nấu một bàn đầy món ăn rất ngon ở nhà. Nhưng vấn đề là chỉ có người trong nhà mới được ăn. Hàng xóm, bảo vệ, người lạ đều không thể thưởng thức.

Phải làm sao? Bạn cần **mang đồ ăn ra nhà hàng**. Đó chính là mục đích của "đưa dịch vụ lên mạng" — chuyển code bạn viết từ máy tính cá nhân sang một "máy tính công cộng" hoạt động 24/7. Bất kỳ ai có internet đều có thể truy cập trang web của bạn.

<DeploymentOverviewDemo />

Đưa dịch vụ lên mạng liên quan đến nhiều khâu. Giống như mở nhà hàng không chỉ là mang đồ ăn ra, bạn còn cần thuê mặt bằng, trang trí, xin giấy phép, thuê nhân viên, v.v. Phát triển trang web cũng tương tự. Từ code đến trang web người dùng có thể truy cập, có rất nhiều bước trung gian: xây dựng, triển khai, cấu hình mạng, đảm bảo an toàn, v.v.

Dưới đây tôi sẽ phân tích chi tiết toàn bộ quy trình. Mỗi khâu đều được giải thích cặn kẽ. Đảm bảo ngay cả người hoàn toàn mới mẻ cũng có thể hiểu được.

---

## 2. Xây dựng: biến code thành "gói hàng có thể mang theo"

### 2.1 Tại sao cần xây dựng?

Người mới thường hỏi: code đã viết xong, sao không đưa thẳng lên server để người dùng truy cập?

Để trả lời, trước tiên cần hiểu định dạng code bạn viết. Bạn có thể sử dụng các framework như Vue, React, Express, Koa, v.v. Các framework này có một điểm chung: **chúng không dành cho trình duyệt hay server sử dụng trực tiếp**.

Ví dụ, khi bạn viết code Vue, bạn sử dụng các thẻ như `<template>`, `<script setup>` đúng không? Cú pháp này chỉ Vue mới hiểu. Trình duyệt hoàn toàn không hiểu. Trình duyệt chỉ nhận biết ba ngôn ngữ: HTML (cấu trúc trang), CSS (kiểu dáng trang), JavaScript (logic trang). Cú pháp component Vue giống như "văn tự thiên thư" đối với trình duyệt, hoàn toàn không thể hiểu.

Vì vậy, trước khi đưa code lên server, cần làm một việc quan trọng: **dịch nó sang ngôn ngữ mà trình duyệt hiểu được**. Quá trình dịch này gọi là "xây dựng" (Build).

### 2.2 Xây dựng cụ thể làm những gì?

Xây dựng không chỉ là dịch thuật. Nó còn thực hiện nhiều tối ưu hóa để trang web chạy nhanh hơn, tiết kiệm tài nguyên hơn. Hãy xem chi tiết nó làm những gì:

**Bước 1: Phân tích dependencies**

Khi viết code, bạn sử dụng nhiều thư viện bên thứ ba. Như Vue, Vue Router, Axios, Vite, v.v. Không thể bắt người dùng tải về từ npm mỗi lần. Quá chậm. Công cụ xây dựng sẽ phân tích code, tìm ra tất cả các dependencies và "đóng gói" chúng lại với nhau.

**Bước 2: Biên dịch và chuyển đổi**

Đây là bước cốt lõi nhất. Biên dịch component Vue thành HTML và JavaScript. Biên dịch SASS/LESS thành CSS. Chuyển đổi cú pháp ES6+ mới thành code ES5 tương thích tốt hơn. Sau bước này, code chuyển từ "định dạng mà developer hiểu được" sang "định dạng mà máy thực thi được".

**Bước 3: Nén và obfuscate**

Nén là xóa tất cả khoảng trắng, xuống dòng, comment. Đổi tên biến từ tiếng Anh thành các chữ cái đơn. Ví dụ `userName` thành `a`, `calculateTotalPrice` thành `b`. Kích thước file giảm đáng kể. Người dùng tải về nhanh hơn. Code sau khi obfuscate gần như con người không đọc được. Cũng đóng vai trò "bảo vệ code" phần nào.

**Bước 4: Code splitting**

Có thể bạn đã viết 10 trang. Mỗi trang có code riêng. Nhưng người dùng có thể chỉ truy cập một trang. Tại sao phải tải code của 9 trang còn lại? Công cụ xây dựng sẽ chia code thành nhiều phần nhỏ. Người dùng truy cập trang nào thì tải code trang đó. Đây là "lazy loading". Có thể cải thiện đáng kể tốc độ truy cập lần đầu.

**Bước 5: Tạo hash**

Đây là bước rất quan trọng nhưng nhiều người bỏ qua. Sau khi xây dựng, tên file sẽ có dạng `app.abc123.js`, `vendor.def456.css`. Chuỗi alphanumeric ở cuối gọi là "hash".

Tác dụng của hash: khi code có bất kỳ thay đổi nào, giá trị hash sẽ thay đổi. Trình duyệt biết "file này đã thay đổi, cần tải lại". File không thay đổi, trình duyệt tiếp tục sử dụng cache. Vừa đảm bảo người dùng thấy code mới nhất, vừa tận dụng tối đa cache để tăng tốc độ.

<DeploymentBuildDemo />

### 2.3 Cách thực hiện xây dựng?

Hầu hết các dự án frontend hiện đại đều đã cấu hình sẵn công cụ xây dựng. Chỉ cần nhớ một lệnh:

```bash
# Nếu dùng npm
npm run build

# Nếu dùng yarn
yarn build

# Nếu dùng pnpm
pnpm build
```

Sau khi chạy xong, vào thư mục gốc dự án tìm thư mục `dist` (đôi khi cũng gọi là `build` hoặc `.output`). Bên trong là tất cả các file đã được xây dựng. Đây là những file cuối cùng cần tải lên server. Không cần chỉnh sửa thêm gì. Kéo thẳng lên server là được.

### 2.4 Sản phẩm xây dựng chứa gì?

Mở thư mục dist, bạn sẽ thấy chủ yếu ba loại file:

- **File HTML**: thường là `index.html`. Đây là file đầu vào. Trình duyệt tải nó đầu tiên.
- **File JS**: tất cả code JavaScript. Có thể là 1 hoặc nhiều file.
- **File CSS**: tất cả code style. Có thể inline trong HTML hoặc file CSS riêng.

Nếu là dự án backend phức tạp hơn (như Node.js), sản phẩm xây dựng có thể là file thực thi hoặc Docker image. Nhưng nguyên lý giống nhau: biến code thành dạng mà server có thể chạy trực tiếp.

---

## 3. Server: tìm một "ngôi nhà" không bao giờ đóng cửa

### 3.1 Server thực chất là gì?

Nhiều người lần đầu nghe "server" nghĩ đó là thiết bị bí ẩn gì cao siêu. Thực ra không phức tạp vậy. **Server chính là một máy tính**. Một máy tính không bao giờ tắt, luôn cắm dây mạng.

Ai đó có thể hỏi: nhà tôi có máy tính rồi, tại sao phải tốn tiền thuê server?

Câu hỏi hay. Phân tích cho bạn:

Thứ nhất, máy tính ở nhà không thể bật 24 giờ. Bạn phải ra ngoài, phải ngủ, thỉnh thoảng còn treo hay khởi động lại. Nhưng server thì khác. Được thiết kế chuyên dụng. Có thể hoạt động 365 ngày không nghỉ. Trang web luôn có thể truy cập.

Thứ hai, mạng ở nhà cũng không đủ. Tốc độ upload của broadband gia đình thường chậm. Hơn nữa IP broadband gia đình là động. Hôm nay là IP này, ngày mai có thể thành IP khác. Không thể dùng làm server web. Server sử dụng mạng tốc độ cao của data center. IP cố định, tốc độ rất nhanh.

Thứ ba, máy tính ở nhà không có "IP công cộng". IP công cộng là gì? Là địa chỉ duy nhất trên toàn thế giới. Chỉ có địa chỉ này, người khác mới có thể tìm thấy máy tính của bạn trên internet. IP máy tính nhà bạn thường chỉ dùng trong mạng nội bộ. Người ngoài không tìm thấy bạn. Server thì khác. Có IP công cộng cố định. Toàn thế giới đều có thể tìm thấy qua IP này.

<DeploymentServerDemo />

### 3.2 Cách chọn server?

Chọn server chủ yếu dựa vào ba tiêu chí: **số nhân CPU**, **dung lượng RAM**, **dung lượng ổ cứng**. Ba tiêu chí này càng cao, hiệu năng server càng tốt, giá càng đắt.

Đối với người mới bắt đầu, hoàn toàn không cần mua cấu hình quá đắt. Nhớ quy tắc đơn giản sau:

- **Dự án cá nhân, luyện tập**: 1 nhân 2GB RAM là đủ. Khoảng vài chục đồng mỗi tháng.
- **Dự án thương mại nhỏ**: 2 nhân 4GB RAM. Chịu được vài nghìn đến vài vạn lượt truy cập mỗi ngày.
- **Dự án trung bình**: 4 nhân 8GB trở lên. Cần đội ngũ vận hành chuyên nghiệp.

Còn một yếu tố nữa: **vị trí**. Nếu người dùng chủ yếu ở Việt Nam, hãy mua server trong nước để tốc độ truy cập nhanh. Nếu người dùng chủ yếu ở nước ngoài, mua server quốc tế (AWS, Google Cloud, DigitalOcean) hoặc server ở Hong Kong. Tốc độ nhanh và không cần备案.

### 3.4 So sánh các nhà cung cấp cloud chínhstream

| Nhà cung cấp | Đối tượng phù hợp | Đặc điểm | Giá người dùng mới |
|------|---------|------|-----------|
| Alibaba Cloud | Doanh nghiệp trong nước | Thị phần số một, hệ sinh thái hoàn thiện | Từ vài chục đến hơn một trăm năm đầu tiên |
| Tencent Cloud | Mini program, game | Hỗ trợ tốt phát triển cloud cho mini program | Ưu đãi lớn năm đầu tiên |
| Huawei Cloud | Doanh nghiệp | Lựa chọn hàng đầu cho dự án chính phủ | Giá khá cao |
| DigitalOcean | Developer | Đơn giản, dễ dùng, giá minh bạch | Từ $4/tháng |
| Vercel | Dự án frontend | Không cần cấu hình, đẩy code lên là deploy | Gói miễn phí đủ dùng |

Dành cho người mới, khuyên dùng ưu đãi sinh viên/người dùng mới của **Alibaba Cloud** hoặc **Tencent Cloud**. Thường chỉ vài chục đồng một năm. Nếu làm dự án frontend thuần, muốn đơn giản, có thể dùng **Vercel** hoặc **Netlify**. Không cần mua server. Đẩy code lên là tự động deploy.

### 3.5 Sau khi có server cần làm gì?

Sau khi mua server, bạn sẽ nhận được email chứa thông tin quan trọng:

- **Địa chỉ IP**: chuỗi số như `123.45.67.89`. Đây là địa chỉ của server trên internet.
- **Tên đăng nhập**: thường là `root` (tài khoản admin).
- **Mật khẩu đăng nhập**: mật khẩu ban đầu, hoặc link để đặt mật khẩu.

Với những thông tin này, bạn có thể sử dụng **SSH (Secure Shell)** để đăng nhập từ xa vào server. SSH giống như gửi một lệnh điều khiển từ xa được mã hóa. Cho phép bạn thao tác server ở xa từ máy tính của mình.

Lệnh đăng nhập như sau:

```bash
ssh root@123.45.67.89
# Sau khi nhấn Enter sẽ yêu cầu nhập mật khẩu. Nhập đúng mật khẩu là đăng nhập thành công.
```

Sau khi đăng nhập thành công, bạn vào giao diện dòng lệnh của server. Nhìn giống như mở terminal trên máy tính cá nhân. Có thể cài phần mềm, tạo thư mục, chỉnh sửa cấu hình. Mọi thao tác đều giống như trên máy local.

---

## 4. Triển khai: chuyển code vào "ngôi nhà"

### 4.1 Triển khai là gì?

Triển khai là sau khi thuê xong server (ngôi nhà), chuyển code (hành lý đồ đạc) vào và mở cửa bắt đầu kinh doanh.

Cụ thể, triển khai bao gồm các bước sau:

1. **Tải code lên server**: chuyển sản phẩm xây dựng từ máy local lên server.
2. **Cài đặt dependencies**: server có thể chưa có các gói cần thiết. Cần cài đặt.
3. **Cấu hình biến môi trường**: như mật khẩu database, API key và thông tin nhạy cảm khác.
4. **Khởi động dịch vụ**: cho ứng dụng chạy. Bắt đầu lắng nghe request từ người dùng.

Bốn bước này nghe khá phức tạp. Nhưng thực tế không khó lắm. Dưới đây sẽ hướng dẫn chi tiết từng bước.

<DeploymentServerDemo />

### 4.2 Cách tải code lên server?

**Cách 1: Upload FTP/SFTP**

Đây là cách trực quan nhất. Giống như dùng cloud storage. Kéo file lên server. Bạn có thể tải phần mềm miễn phí **FileZilla**. Nhập IP server, tên đăng nhập, mật khẩu. Có thể quản lý file trên server như quản lý file local.

**Cách 2: Git pull**

Đây là cách được khuyến nghị. Tạo repo trên GitHub, GitLab hoặc Gitee. Đẩy code lên cloud. Rồi dùng lệnh `git clone` trên server để kéo code về.

Ưu điểm: khi cần cập nhật code chỉ cần chạy `git pull` trên server. Không cần upload thủ công mỗi lần. Code cũng an toàn trên cloud. Dù cài lại server cũng không sao.

**Cách 3: Deploy tự động CI/CD**

Đây là cách chuyên nghiệp nhất và được khuyến nghị mạnh mẽ. Cấu hình CI/CD (Continuous Integration/Continuous Deployment), chỉ cần đẩy code lên GitHub. Hệ thống CI/CD tự động hoàn thành: kéo code → cài dependencies → build → deploy. Thậm chí không cần đăng nhập vào server. Mọi thứ tự động hoàn thành.

### 4.3 Các bước triển khai cụ thể

Giả sử dùng cách đơn giản nhất: deploy thủ công bằng Git. Trình bày từng bước:

**Bước 1: Kết nối đến server**

```bash
ssh root@123.45.67.89
```

**Bước 2: Cài đặt phần mềm cần thiết**

Nếu là dự án Node.js, cần cài Node.js trước:

```bash
# Ví dụ hệ thống Ubuntu
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

**Bước 3: Kéo code về**

```bash
# Tạo thư mục chứa trang web
mkdir -p /var/www/my-website
cd /var/www/my-website

# Clone repo (cần tạo repo trên GitHub trước)
git clone https://github.com/username/repo.git .
```

**Bước 4: Cài dependencies và xây dựng**

```bash
# Cài dependencies dự án
npm install

# Xây dựng dự án (tạo thư mục dist)
npm run build
```

**Bước 5: Khởi động dịch vụ bằng PM2**

Tại sao dùng PM2? Đây là công cụ quản lý process. Giúp trang web chạy liên tục ở background. Ngay cả khi server restart cũng tự động khởi động.

```bash
# Cài PM2 toàn cục
sudo npm install -g pm2

# Khởi động trang web (giả sử file đầu vào là index.js)
pm2 start index.js

# Cấu hình tự khởi động khi boot
pm2 startup
pm2 save
```

**Bước 6: Cấu hình reverse proxy Nginx**

Ứng dụng Node.js thường chạy trên port 3000 hoặc 8080. Nhưng người dùng truy cập qua port 80 (port mặc định HTTP). Cần dùng Nginx để forward request từ port 80 sang port ứng dụng.

```bash
# Cài Nginx
sudo apt install -y nginx

# Tạo file cấu hình Nginx
sudo nano /etc/nginx/sites-available/my-website
```

Trong editor vừa mở, viết cấu hình sau:

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    # File tĩnh (sản phẩm xây dựng) trả về trực tiếp
    location / {
        root /var/www/my-website/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Request API forward đến backend Node.js
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Sau khi lưu và thoát, kích hoạt cấu hình này:

```bash
# Kích hoạt cấu hình
sudo ln -s /etc/nginx/sites-available/my-website /etc/nginx/sites-enabled/

# Kiểm tra cấu hình có lỗi không
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

Bây giờ truy cập `http://example.com` (nhớ cấu hình DNS trỏ về IP server này), bạn sẽ thấy trang web!

---

## 5. Domain và DNS: đặt tên hay cho trang web

### 5.1 Tại sao cần mua domain?

Đã có IP server, tại sao còn phải mua domain?

Nghĩ xem. Nhớ một chuỗi số `123.45.67.89` có khó không? Dễ gõ sai đúng không? Nhưng nhớ `baidu.com`, `taobao.com` thì đơn giản hơn nhiều đúng không?

Domain chính là tên của trang web. Dễ nhớ, chuyên nghiệp, còn thể hiện hình ảnh thương hiệu. Tưởng tượng bảo ai đó "truy cập trang web của tôi, IP là 123.45.67.89" so với "truy cập trangwebcuatui.com", cái nào nghe pro hơn?

<DeploymentDnsDemo />

### 5.2 DNS là gì?

Tốt. Bây giờ bạn đã mua domain. Ví dụ `trang-web-tuyet-voi.com`. Nhưng vấn đề: máy tính chỉ hiểu địa chỉ IP. Không hiểu "trang-web-tuyet-voi.com" - ngôn ngữ con người.

Đây là lúc DNS xuất hiện. DNS viết tắt của "Domain Name System" (Hệ thống tên miền). Có thể hiểu như một "cuốn danh bạ điện thoại" khổng lồ. Chuyên dịch domain dễ nhớ thành địa chỉ IP mà máy tính hiểu được.

Khi bạn nhập `trang-web-tuyet-voi.com` vào trình duyệt và nhấn Enter, những việc sau xảy ra:

1. Trình duyệt hỏi DNS: "hey, IP của trang-web-tuyet-voi.com là gì?"
2. DNS tra cứu "danh bạ", trả lời trình duyệt: "IP của nó là 123.45.67.89"
3. Trình duyệt dựa vào IP này tìm đến server và gửi request

Toàn bộ quá trình thường chỉ mất vài chục mili-giây. Người dùng hoàn toàn không nhận ra.

### 5.3 Cách cấu hình DNS?

Cấu hình DNS thường có thể làm ở hai nơi:

**Cách 1: Cấu hình tại nơi mua domain**

Ở đâu mua domain thì cấu hình DNS ở đó. Loại record phổ biến nhất là **A record**:

- **Loại record**: A
- **Host record**: thường điền `@` (đại diện cho chính domain) hoặc `www` (đại diện cho www.example.com)
- **Record value**: địa chỉ IP server, như `123.45.67.89`

**Cách 2: Sử dụng dịch vụ DNS bên thứ ba**

Nhiều chuyên gia không dùng DNS đi kèm của nhà cung cấp domain. Mà dùng các dịch vụ DNS chuyên nghiệp như Cloudflare, Alibaba Cloud DNSPod, Tencent Cloud DNS. Các dịch vụ này thường ổn định hơn, tốc độ phân giải nhanh hơn. Còn đi kèm CDN, bảo vệ DDoS, v.v.

### 5.4 DNS mất bao lâu để có hiệu lực?

Đây là câu hỏi nhiều người quan tâm. Câu trả lời: **không nhất thiết. Thường từ vài phút đến 24 giờ**.

Sau khi sửa DNS, tất cả server DNS trên toàn thế giới cần đồng bộ thay đổi này. Giống như ném viên đá xuống biển. Sóng cần thời gian mới lan đến bờ xa. Một số server DNS cập nhật nhanh, vài phút đã có hiệu lực. Một số chậm hơn, có thể phải đợi lâu.

Có thể kiểm tra DNS đã có hiệu lực chưa bằng lệnh:

```bash
# Windows
ping your-domain

# Mac/Linux
ping your-domain
```

Nếu ping được và hiển thị IP của server, DNS đã có hiệu lực.

---

## 6. HTTPS: lắp "ổ khóa" cho trang web

### 6.1 Khác biệt giữa HTTP và HTTPS

Có thể bạn đã để ý. Một số địa chỉ trang web bắt đầu bằng `http://`, một số bằng `https://`. Chữ "s" này rất quan trọng. Nó đại diện cho "Secure" (An toàn).

**HTTP (HyperText Transfer Protocol)** là giao thức truyền tải trang web. Có thể hiểu như chiếc xe tải chở dữ liệu. Nhưng xe tải này là **trong suốt**. Ai cũng thấy được đồ bên trong. Trên trang HTTP, mật khẩu và thông tin cá nhân bạn nhập vào có thể bị bất kỳ ai trên đường truyền đọc được.

**HTTPS (HTTP Secure)** là加装 một **container kín** cho xe tải, kèm theo một chiếc khóa. Chỉ người gửi và người nhận có chìa khóa. Người trung gian dù có chặn được cũng không hiểu bên trong chứa gì. Đây chính là truyền tải được mã hóa.

<DeploymentHttpsDemo />

### 6.2 Tại sao cần HTTPS?

Lý do đầu tiên: **an toàn**. Không có HTTPS, mật khẩu người dùng nhập trên trang web được truyền dạng plaintext. Bất kỳ ai có chút kỹ thuật đều có thể chặn được. Ngày nay, ai dám dùng trang web không có HTTPS?

Lý do thứ hai: **cảnh báo trình duyệt**. Hiện nay Chrome, Edge và các trình duyệt chính đều hiển thị cảnh báo "không an toàn" cho trang không có HTTPS. Người dùng thấy biểu tượng cảnh báo. Chạy mất còn không kịp, nói gì đến đăng ký, nạp tiền.

Lý do thứ ba: **SEO**. Google, Baidu và các công cụ tìm kiếm ưu tiên_index trang HTTPS. SEO sẽ tốt hơn.

### 6.3 Cách lấy chứng chỉ HTTPS?

Trước đây chứng chỉ HTTPS rất đắt. Tốn hàng trăm đến hàng nghìn đồng mỗi năm. Bây giờ thì tốt rồi. Có tổ chức **Let's Encrypt** cung cấp chứng chỉ SSL/TLS hoàn toàn miễn phí. Và cộng đồng có nhiều công cụ tự động giúp cài đặt và gia hạn.

**Cách 1: Dùng Certbot (khuyến nghị)**

Certbot là công cụ tự động xin và cấu hình chứng chỉ Let's Encrypt. Rất đơn giản:

```bash
# Cài Certbot
sudo apt install -y certbot python3-certbot-nginx

# Xin chứng chỉ và cấu hình Nginx trong một bước
sudo certbot --nginx -d example.com -d www.example.com
```

Trong quá trình chạy sẽ hỏi vài câu. Như email (để nhắc gia hạn chứng chỉ). Trả lời xong chứng chỉ tự động được cấu hình. Truy cập trang web sẽ thấy thêm biểu tượng ổ khóa nhỏ.

Chứng chỉ có hiệu lực 90 ngày. Nhưng Certbot sẽ thiết lập cronjob tự động gia hạn. Gần như không cần quan tâm.

**Cách 2: Dùng Cloudflare**

Nếu bạn sử dụng dịch vụ DNS của Cloudflare thì hoàn toàn không cần tự cấu hình chứng chỉ HTTPS. Cloudflare tự động cung cấp hỗ trợ HTTPS cho domain. Còn giải quyết luôn vấn đề gia hạn 90 ngày.

### 6.4 Sau khi cấu hình HTTPS có gì thay đổi?

Sau khi cấu hình HTTPS, người dùng truy cập chuyển từ `http://example.com` sang `https://example.com`. Thay đổi này mang theo loạt bảo đảm an toàn:

1. **Truyền tải mã hóa**: mọi giao tiếp giữa người dùng và server đều được mã hóa.
2. **Xác thực danh tính**: chứng chỉ có thể chứng minh "tôi thực sự là trang web này". Ngăn chặn trang lừa đảo.
3. **Toàn vẹn dữ liệu**: có thể phát hiện dữ liệu có bị thay đổi hay không.

---

## 7. CI/CD: để robot làm việc cho bạn

### 7.1 CI/CD là gì?

CI/CD là viết tắt của hai từ: **C**ontinuous **I**ntegration (Tích hợp liên tục) và **C**ontinuous **D**eployment (Triển khai liên tục). Có thể hiểu là hệ thống robot tự động làm việc giúp bạn.

Khi chưa có CI/CD. Mỗi lần phát hành tính năng mới, quy trình như sau:

1. Mở máy tính, đăng nhập GitHub
2. Pull code mới nhất
3. Chạy test, xem có bug không
4. Build dự án thủ công
5. Đăng nhập server
6. Pull code mới nhất
7. Cài dependencies
8. Build dự án
9. Restart dịch vụ

9 bước này. Mỗi lần phát hành đều phải làm thủ công. Phiền không? Và rất dễ quên bước nào. Như quên chạy test, quên restart dịch vụ, v.v.

Có CI/CD rồi. Quy trình trở thành:

1. Push code lên GitHub
2. Uống trà ngồi đợi
3. (Robot tự động hoàn thành 9 bước trên)
4. Trang web tự động cập nhật

<DeploymentCicdDemo />

Đó là sức hấp dẫn của CI/CD: **chỉ cần đẩy code lên. Mọi thứ còn lại tự động hoàn thành**.

### 7.2 Quy trình làm việc của CI/CD

Một quy trình CI/CD điển hình như sau:

**Bước 1: Commit code (Push)**

Hoàn thành phát triển tính năng mới. Push code lên GitHub.

**Bước 2: CI kích hoạt (Tích hợp liên tục)**

GitHub phát hiện thay đổi code. Thông báo cho hệ thống CI (GitHub Actions, GitLab CI, v.v.) bắt đầu làm việc.

**Bước 3: Cài dependencies và test**

Hệ thống CI khởi chạy một máy tính ảo. Trên đó:
- Cài các dependencies cần thiết
- Chạy test code, đảm bảo không có bug
- Build dự án, tạo sản phẩm

Nếu test thất bại. CI gửi email thông báo. Deploy dừng lại. Code có vấn đề sẽ không được deploy lên production.

**Bước 4: CD thực thi (Triển khai liên tục)**

Sau khi tất cả test pass. Hệ thống CI sẽ:
- Kết nối SSH đến server
- Pull code mới nhất
- Cài dependencies
- Build dự án
- Restart dịch vụ

Toàn bộ quá trình có thể chỉ mất vài phút. Hoàn toàn tự động.

### 7.3 Cách cấu hình GitHub Actions?

GitHub Actions là tính năng CI/CD tích hợp sẵn của GitHub. Không cần trả thêm phí (gói miễn phí đủ cho dự án cá nhân). Cấu hình cũng rất đơn giản.

Tạo file `.github/workflows/deploy.yml` tại thư mục gốc dự án với nội dung:

```yaml
name: Deploy to Production

# Điều kiện kích hoạt: mỗi khi có code push lên nhánh main
on:
  push:
    branches: [main]

# Danh sách jobs
jobs:
  # Job deploy
  deploy:
    # Chạy trên hệ điều hành nào
    runs-on: ubuntu-latest

    # Các bước cụ thể
    steps:
      # 1. Checkout code
      - name: Checkout code
        uses: actions/checkout@v3

      # 2. Cài môi trường Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      # 3. Cài dependencies và build
      - name: Install and Build
        run: |
          npm ci
          npm run build

      # 4. Deploy lên server
      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/my-website
            git pull origin main
            npm install
            npm run build
            pm2 restart all
```

File cấu hình này báo cho GitHub Actions:

- Kích hoạt khi nhánh main có code mới
- Chạy task trên máy Ubuntu
- Cài Node.js 18 trước
- Rồi cài dependencies và build dự án
- Cuối cùng kết nối SSH đến server, chạy loạt lệnh deploy

Sau khi cấu hình xong. Mỗi lần `git push origin main`. GitHub sẽ tự động bắt đầu deploy. Rất tiện lợi.

---

## 8. Monitoring và log: làm "người gác đêm" cho trang web

### 8.1 Tại sao cần monitoring?

Sau khi trang web lên mạng. Về lý thuyết phải hoạt động 24/7 liên tục. Nhưng thực tế không hoàn hảo đến vậy. Server có thể down. Mạng có thể nhiễu. Code có thể có bug. Trong môi trường production thực tế, đủ thứ rủi ro đều có thể xảy ra.

Nếu không có monitoring. Bạn chỉ biết khi người dùng gọi điện bảo "trang web không mở được". Lúc đó thường đã muộn. Người dùng có thể đã rời đi.

Có monitoring rồi. Bạn có thể:

- **Phát hiện sớm vấn đề**: CPU usage 90%. Thêm server sớm.
- **Định vị nhanh vấn đề**: trang chậm. Xem monitoring tìm bottleneck ở đâu.
- **Nắm rõ tình hình**: mỗi ngày bao nhiêu người truy cập, khi nào lượng truy cập cao nhất.

<DeploymentMonitorDemo />

### 8.2 Monitor những chỉ số nào?

Những chỉ số monitoring quan trọng nhất gồm:

| Chỉ số | Phạm vi bình thường | Làm gì khi vượt |
|------|---------|-----------|
| CPU usage | < 70% | Nâng cấp cấu hình server hoặc tối ưu code |
| RAM usage | < 80% | Kiểm tra có memory leak không |
| Disk usage | < 80% | Dọn log hoặc file không cần thiết |
| Website availability | 100% | Kiểm tra dịch vụ có chạy bình thường không |
| Response time | < 2 giây | Tối ưu query database hoặc thêm cache |
| Error rate | < 1% | Xem error log để định vị vấn đề |

### 8.3 Cách cấu hình monitoring?

**Giải pháp đơn giản nhất: Uptime Robot**

Đăng ký uptimerobot.com. Thêm URL trang web. Nó sẽ tự động kiểm tra mỗi 5 phút xem trang web có bình thường không. Trang web down sẽ gửi email thông báo. Bản miễn phí có thể monitor 50 trang web. Đủ dùng cho dự án cá nhân.

**Giải pháp nâng cao: Monitoring Alibaba Cloud/Tencent Cloud**

Nếu server mua ở Alibaba Cloud hoặc Tencent Cloud, chúng đã tích hợp sẵn monitoring. Cấu hình ngưỡng cảnh báo là được.

**Giải pháp chuyên nghiệp: Prometheus + Grafana**

Hai công cụ này là "dao thú cước" trong lĩnh vực monitoring. Chức năng rất mạnh. Có thể monitor bất kỳ chỉ số nào bạn nghĩ đến. Còn tạo biểu đồ visualization đẹp mắt. Nhưng cấu hình khá phức tạp. Phù hợp developer có kinh nghiệm.

### 8.4 Log: khi có vấn đề tra cứu thế nào?

Monitoring cho bạn biết "trang web có vấn đề". Nhưng cụ thể vấn đề gì, tại sao xảy ra. Cần dựa vào **log** để định vị.

Log giống như "nhật ký" của chương trình khi chạy. Ghi lại mọi chi tiết trong quá trình chạy:

- User nào truy cập trang nào vào lúc nào
- Query database mất bao lâu
- Có lỗi không, nội dung lỗi là gì

**Cách dùng log cơ bản**

Xem log ứng dụng trên server:

```bash
# Xem log PM2
pm2 logs

# Xem access log Nginx
tail -f /var/log/nginx/access.log

# Xem error log Nginx
tail -f /var/log/nginx/error.log
```

**Giải pháp log nâng cao**

Nếu dự án khá phức tạp. Khuyến nghị dùng công cụ thu thập log chuyên nghiệp:

- **Loki**: miễn phí, mã nguồn mở. Cùng gia đình với Prometheus.
- **ELK (Elasticsearch + Logstash + Kibana)**: mạnh mẽ nhưng cấu hình phức tạp.
- **Sentry**: công cụ chuyên thu thập lỗi ứng dụng. Tự động thu thập thông tin báo lỗi.

### 8.5 Cảnh báo: khi có vấn đề biết ngay lập tức thế nào?

Monitoring cho bạn biết có vấn đề. Nhưng nếu bạn không nhìn dashboard monitoring thì sao? Đây là lúc cần **cảnh báo (alert)**.

Cảnh báo là khi hệ thống monitoring phát hiện bất thường. Tự động thông báo qua SMS, WeChat, DingTalk, email, v.v. Có thể thiết lập các cấp cảnh báo khác nhau:

- **Khẩn cấp (trang web hoàn toàn down)**: Gửi SMS + gọi điện. Phải biết ngay.
- **Nghiêm trọng (error rate tăng vọt)**: Gửi tin nhắn DingTalk/WeChat. Xử lý khi thấy.
- **Bình thường (CPU cao)**: Gửi email tổng hợp. Xem một lần/ngày.

Nguyên tắc cốt lõi khi cấu hình cảnh báo: **cảnh báo phân cấp, đừng làm phiền mình đến chết**. Nếu chuyện nhỏ nhặt gì cũng gửi SMS. Không lâu sau bạn sẽ tắt cảnh báo.

---

## 9. Bảng tra cứu nhanh vấn đề thường gặp

| Hiện tượng | Nguyên nhân có thể | Cách giải quyết |
|---------|---------|---------|
| Trang web không mở được | Domain chưa phân giải / Server down / Nginx chưa khởi động | `ping domain` xem thông không; `pm2 list` xem trạng thái dịch vụ; `systemctl status nginx` xem Nginx |
| Mở ra trang trắng | Đường dẫn sản phẩm build sai / File tĩnh chưa cấu hình đúng | Kiểm tra root path Nginx có trỏ đến thư mục dist không |
| 404 Không tìm thấy trang | Routing chưa cấu hình đúng / Lỗi chính tả đường dẫn | Thêm `try_files $uri $uri/ /index.html` trong cấu hình Nginx |
| 502 Bad Gateway | Dịch vụ backend down / Port chưa mở | `pm2 list` xem process có chạy không; kiểm tra port đúng chưa |
| 403 Forbidden | Quyền không đúng / Chưa bật directory index | Kiểm tra file permission `chmod -R 755`; thêm `autoindex on` trong cấu hình Nginx |
| Chứng chỉ HTTPS hết hạn | Chứng chỉ chưa gia hạn | `certbot renew` gia hạn thủ công; kiểm tra cronjob tự động gia hạn |
| Sau khi cập nhật không thấy thay đổi | Cache trình duyệt / Cache CDN | Ctrl+Shift+R refresh cưỡng; vào console CDN "làm mới cache" |
| Trang web mở rất chậm | Băng thông không đủ / Chưa bật cache / Chưa cấu hình CDN | Nâng cấp băng thông server; cấu hình Redis cache; tích hợp CDN |
| Không kết nối được database | Database chưa khởi động / Sai mật khẩu / Vấn đề quyền | Kiểm tra trạng thái dịch vụ database; đối chiếu thông tin kết nối trong cấu hình |

---

## Tổng kết

Đưa dịch vụ lên mạng là một dự án hệ thống lớn. Liên quan đến mọi khía cạnh từ xây dựng code đến triển khai server, từ cấu hình mạng đến bảo vệ an toàn, từ monitoring cảnh báo đến phân tích log. Đối với người mới bắt đầu. Không cần hoàn hảo ngay từ đầu. Trước hết chạy được phiên bản khả dụng tối thiểu (MVP). Rồi cải tiến dần.

Các điểm chính của toàn bộ quy trình có thể tóm tắt như sau:

### Quy trình cốt lõi

1. **Xây dựng** → Dùng `npm run build` biến code thành HTML/CSS/JS trình duyệt hiểu được
2. **Triển khai** → Upload sản phẩm build lên server. Cấu hình reverse proxy bằng Nginx.
3. **Domain** → Mua domain và cấu hình DNS phân giải về IP server
4. **HTTPS** → Xin chứng chỉ miễn phí bằng Let's Encrypt. Bảo vệ truyền tải dữ liệu.
5. **CI/CD** → Cấu hình deploy tự động. Code push lên là tự động deploy.
6. **Monitoring** → Cấu hình monitoring và cảnh báo. Biết ngay khi có vấn đề.

### Lộ trình học tập đề xuất

- **Ngày 1**: Deploy một trang web tĩnh bằng Vercel/Netlify. Trải nghiệm cảm giác "code biến thành trang web".
- **Tuần 1**: Thuê server cloud. Deploy thủ công một dự án Node.js. Cấu hình domain và HTTPS.
- **Tuần 2-4**: Cấu hình quy trình CI/CD hoàn chỉnh. Xây dựng hệ thống monitoring và cảnh báo.
- **Học liên tục**: Học Docker containerization, học Kubernetes cluster, học kiến trúc microservices.

---

## Bảng tra cứu nhanh thuật ngữ

| Thuật ngữ | Tiếng Anh | Giải thích đơn giản |
|------|------|-----------|
| Xây dựng | Build | Dịch và đóng gói source code thành định dạng trình duyệt thực thi được |
| Triển khai | Deploy | Đưa code lên server để người dùng có thể truy cập |
| Server | Server | Máy tính hoạt động 24/7, kết nối internet |
| Domain | Domain | Tên dễ nhớ của trang web (như baidu.com) |
| DNS | Domain Name System | "Danh bạ điện thoại" dịch domain thành địa chỉ IP |
| HTTP | HyperText Transfer Protocol | Giao thức truyền trang web (không an toàn, plaintext) |
| HTTPS | HTTP Secure | Giao thức truyền trang web được mã hóa (an toàn) |
| Nginx | Engine X | Web server hiệu năng cao. Dùng làm reverse proxy. |
| Reverse proxy | Reverse Proxy | "Nhân viên đứng ở cửa". Chuyển tiếp request đến backend. |
| SSH | Secure Shell | Công cụ mã hóa đăng nhập từ xa vào server |
| CDN | Content Delivery Network | Mạng server phân phối toàn cầu. Tăng tốc truy cập. |
| CI/CD | Continuous Integration/Deployment | Pipeline tự động. Code push lên tự test và deploy. |
| SSL/TLS | Secure Sockets Layer / Transport Layer Security | Giao thức mã hóa. Cung cấp bảo mật cho HTTPS. |
| PM2 | Process Manager 2 | Quản lý process Node.js. Giữ ứng dụng chạy liên tục. |

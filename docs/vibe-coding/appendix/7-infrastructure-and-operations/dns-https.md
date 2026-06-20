# Tên miền, DNS và HTTPS

::: tip Lời nói đầu
**Khi bạn gõ `www.google.com` vào trình duyệt và nhấn Enter, điều gì đã xảy ra phía sau?** Hành động tưởng chừng đơn giản này liên quan đến một loạt quá trình phối hợp chính xác bao gồm phân giải tên miền, truy vấn DNS, bắt tay mã hóa TLS, v.v. Hiểu các cơ chế này là bài học bắt buộc đối với mọi lập trình viên — nó liên quan trực tiếp đến việc trang web của bạn có thể được truy cập hay không, dữ liệu có bị đánh cắp hay không.
:::

**Bài viết này sẽ giúp bạn học được gì?**

Sau khi học xong chương này, bạn sẽ có được:

- **Nguyên lý DNS**: hiểu toàn bộ quá trình tên miền được dịch thành địa chỉ IP
- **Các loại bản ghi**: nắm vững công dụng của các bản ghi DNS phổ biến như A, CNAME, MX, v.v.
- **Cơ chế HTTPS**: hiểu cách bắt tay TLS thiết lập kết nối bảo mật
- **Hệ thống chứng chỉ**: tìm hiểu chuỗi tin cậy của chứng chỉ số và cơ chế xác minh
- **Nhận thức bảo mật**: hiểu tại sao HTTPS là yêu cầu tối thiểu của Web hiện đại

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Phân giải DNS | Truy vấn đệ quy, truy vấn lặp |
| **Chương 2** | Bản ghi DNS | A, CNAME, MX, TXT |
| **Chương 3** | HTTPS và TLS | Quá trình bắt tay, giao tiếp mã hóa |
| **Chương 4** | Chuỗi tin cậy chứng chỉ | CA, chứng chỉ gốc, chứng chỉ trung gian |
| **Chương 5** | HTTP vs HTTPS | Văn bản rõ vs mã hóa, so sánh bảo mật |

---

## 0. Toàn cảnh: từ tên miền đến kết nối bảo mật

Giao tiếp trên Internet dựa trên địa chỉ IP (như 142.250.80.46), nhưng con người không thể nhớ những con số này. Vì vậy chúng ta đã phát minh ra **Hệ thống Tên miền (DNS)** — "cuốn danh bạ" của Internet, dịch tên miền mà con người có thể đọc được thành địa chỉ IP mà máy móc có thể hiểu được.

Nhưng chỉ tìm được máy chủ là chưa đủ. Nếu nội dung giao tiếp được truyền ở dạng văn bản rõ, bất kỳ kẻ trung gian nào cũng có thể nghe lén hoặc sửa đổi dữ liệu của bạn. **HTTPS** chính là giải pháp cho vấn đề này — nó thêm một lớp mã hóa TLS lên trên HTTP, đảm bảo tính bảo mật và toàn vẹn của dữ liệu trong quá trình truyền.

::: tip Một lần truy cập trang web hoàn chỉnh
1. **Phân giải tên miền**: trình duyệt hỏi DNS "IP của www.google.com là gì?", DNS trả lời "142.250.80.46"
2. **Kết nối TCP**: trình duyệt thiết lập bắt tay ba chiều TCP với máy chủ
3. **Bắt tay TLS**: hai bên đàm phán thuật toán mã hóa, xác minh chứng chỉ, trao đổi khóa
4. **Giao tiếp mã hóa**: tất cả dữ liệu HTTP được truyền qua kênh mã hóa
:::

---

## 1. Phân giải DNS: "cuốn danh bạ" của Internet

Nguyên lý hoạt động của DNS (Domain Name System) giống như tra danh bạ điện thoại: bạn biết tên người gọi (tên miền), cần tìm số điện thoại của họ (địa chỉ IP). Nhưng "cuốn danh bạ" của Internet không phải là một cuốn, mà là một hệ thống phân tán theo tầng.

<DnsResolutionDemo />

::: tip Bốn bước phân giải DNS
1. **Bộ nhớ đệm trình duyệt**: tra bộ nhớ đệm cục bộ trước, nếu đã truy cập tên miền này trước đó, sử dụng IP trong bộ nhớ đệm
2. **Bộ phân giải đệ quy**: nếu không có trong bộ nhớ đệm, yêu cầu được gửi đến bộ phân giải đệ quy của ISP (như 8.8.8.8)
3. **Truy vấn theo tầng**: bộ phân giải đệ quy lần lượt hỏi máy chủ tên miền gốc → máy chủ TLD (.com) → máy chủ tên miền có thẩm quyền (google.com)
4. **Trả về kết quả**: máy chủ có thẩm quyền trả về IP cuối cùng, bộ phân giải đệ quy lưu vào bộ nhớ đệm và trả về cho trình duyệt
:::

| Tầng | Máy chủ | Trách nhiệm | Số lượng |
|------|-------|------|------|
| Gốc | Root Server | Biết địa chỉ của tất cả TLD | 13 nhóm toàn cầu |
| TLD | TLD Server | Quản lý .com, .cn, .org, v.v. | Một nhóm cho mỗi hậu tố |
| Có thẩm quyền | Authoritative | Lưu trữ bản ghi DNS của tên miền cụ thể | Ít nhất 2 cho mỗi tên miền |
| Bộ phân giải đệ quy | Resolver | Thực hiện toàn bộ quá trình truy vấn thay người dùng | ISP hoặc DNS công cộng |

---

## 2. Các loại bản ghi DNS: "bảng cấu hình" phía sau tên miền

DNS không chỉ dịch tên miền thành địa chỉ IP. Thông qua các loại bản ghi DNS khác nhau, bạn có thể kiểm soát gửi thư, chuyển hướng tên miền, khám phá dịch vụ, v.v. Hiểu các loại bản ghi này là nền tảng để cấu hình tên miền và khắc phục sự cố mạng.

<DnsRecordTypeDemo />

| Loại bản ghi | Công dụng | Ví dụ |
|---------|------|------|
| A | Tên miền → địa chỉ IPv4 | `example.com → 93.184.216.34` |
| AAAA | Tên miền → địa chỉ IPv6 | `example.com → 2606:2800:220:1:...` |
| CNAME | Tên miền → tên miền khác (bí danh) | `www.example.com → example.com` |
| MX | Chỉ định máy chủ thư | `example.com → mail.example.com` |
| TXT | Lưu trữ thông tin văn bản | Xác minh SPF, xác minh quyền sở hữu tên miền |
| NS | Chỉ định máy chủ DNS có thẩm quyền | `example.com → ns1.example.com` |

::: tip Cấu hình DNS trong các tình huống thực tế
- **Triển khai trang web**: thêm bản ghi A trỏ đến IP máy chủ, hoặc CNAME trỏ đến tên miền CDN
- **Cấu hình email**: thêm bản ghi MX trỏ đến máy chủ thư, bản ghi TXT để cấu hình SPF/DKIM chống thư rác
- **Xác minh quyền sở hữu tên miền**: nhà cung cấp dịch vụ đám mây yêu cầu bạn thêm bản ghi TXT cụ thể để chứng minh bạn sở hữu tên miền
- **Cân bằng tải**: cấu hình nhiều bản ghi A cho cùng một tên miền, DNS phân phối lưu lượng theo vòng tròn
:::

---

## 3. HTTPS và TLS: mặc "áo giáp" cho dữ liệu

Giao thức HTTP truyền dữ liệu dạng văn bản rõ — giống như gửi bưu thiếp, người đưa thư (kẻ trung gian) có thể tự do đọc nội dung. HTTPS thêm một lớp mã hóa TLS (Transport Layer Security) lên trên HTTP, tương đương với việc cho bưu thiếp vào phong bì niêm phong.

Bắt tay TLS là bước quan trọng để thiết lập kết nối bảo mật, hoàn thành xác minh danh tính và đàm phán khóa trước khi truyền dữ liệu chính thức.

<HttpsHandshakeDemo />

::: tip Các bước cốt lõi của bắt tay TLS 1.3
1. **Client Hello**: клиент gửi danh sách các thuật toán mã hóa được hỗ trợ và một số ngẫu nhiên
2. **Server Hello**: máy chủ chọn thuật toán mã hóa, trả về chứng chỉ số và số ngẫu nhiên
3. **Xác minh chứng chỉ**: клиент xác minh chứng chỉ của máy chủ có đáng tin cậy không (kiểm tra chữ ký CA, thời hạn, khớp tên miền)
4. **Trao đổi khóa**: hai bên đàm phán khóa chung thông qua thuật toán ECDHE (không truyền bản thân khóa qua mạng)
5. **Giao tiếp mã hóa**: tất cả dữ liệu tiếp theo được truyền bằng mã hóa đối xứng đã đàm phán
:::

| Tính năng | TLS 1.2 | TLS 1.3 |
|------|---------|---------|
| Số lần đi lại bắt tay | 2-RTT | 1-RTT (lần đầu) / 0-RTT (khôi phục) |
| Trao đổi khóa | RSA hoặc ECDHE | Chỉ ECDHE (bảo mật chuyển tiếp) |
| Thuật toán mã hóa | Hỗ trợ nhiều thuật toán cũ | Chỉ giữ lại thuật toán an toàn |
| Hiệu suất | Chậm hơn | Nhanh hơn |

---

## 4. Chuỗi tin cậy chứng chỉ: tại sao tin tưởng trang web này?

Bước quan trọng nhất trong bắt tay TLS là "xác minh chứng chỉ". Trình duyệt xác định chứng chỉ của một trang web là thật hay giả mạo như thế nào? Câu trả lời là **chuỗi tin cậy chứng chỉ** — một hệ thống bảo chứng theo tầng.

<CertificateChainDemo />

::: tip Cấu trúc ba tầng của chuỗi tin cậy
1. **Chứng chỉ gốc (Root CA)**: do Cơ quan Chứng chỉ đáng tin cậy cấp, được cài đặt sẵn trong hệ điều hành và trình duyệt. Đây là "mỏ neo" tin cậy.
2. **Chứng chỉ trung gian (Intermediate CA)**: do Root CA cấp, dùng để cấp chứng chỉ cuối. Root CA không cấp trực tiếp chứng chỉ trang web vì lý do cách ly bảo mật.
3. **Chứng chỉ cuối (Leaf Certificate)**: chứng chỉ mà trang web của bạn sử dụng thực tế, do CA trung gian cấp, chứa thông tin như tên miền, khóa công khai, thời hạn, v.v.
:::

| Loại chứng chỉ | Cấp độ xác minh | Tốc độ cấp | Kịch bản sử dụng |
|---------|---------|---------|---------|
| DV (Xác minh tên miền) | Chỉ xác minh quyền sở hữu tên miền | Vài phút | Trang web cá nhân, blog |
| OV (Xác minh tổ chức) | Xác minh danh tính tổ chức | Vài ngày | Trang web doanh nghiệp |
| EV (Xác minh mở rộng) | Xác minh nghiêm ngặt tổ chức | Vài tuần | Ngân hàng, tổ chức tài chính |
| Chứng chỉ wildcard | Bao phủ tất cả tên miền con | Tùy loại | Kịch bản nhiều tên miền con |

---

## 5. HTTP vs HTTPS: tại sao mã hóa là yêu cầu tối thiểu?

Năm 2024, hơn 95% lưu lượng trang web toàn cầu đã được truyền qua HTTPS. Trình duyệt Chrome đánh dấu cảnh báo "Không an toàn" cho các trang web HTTP, và các công cụ tìm kiếm cũng giảm xếp hạng các trang web HTTP. HTTPS không còn là "tùy chọn", mà là yêu cầu tối thiểu của Web hiện đại.

<DnsHttpsComparisonDemo />

| Chiều | HTTP | HTTPS |
|------|------|-------|
| Truyền dữ liệu | Văn bản rõ, có thể bị nghe lén | Mã hóa, không thể nghe lén |
| Xác thực danh tính | Không, không thể xác nhận danh tính máy chủ | Có, xác minh máy chủ qua chứng chỉ |
| Toàn vẹn dữ liệu | Không bảo vệ, có thể bị sửa đổi | Có bảo vệ, sửa đổi sẽ bị phát hiện |
| Cổng | 80 | 443 |
| Tác động SEO | Giảm xếp hạng tìm kiếm | Cộng điểm xếp hạng tìm kiếm |
| Hiển thị trình duyệt | Hiển thị cảnh báo "Không an toàn" | Hiển thị biểu tượng ổ khóa |

::: tip Nhận chứng chỉ HTTPS miễn phí
**Let's Encrypt** là một cơ quan cấp chứng chỉ miễn phí và tự động, cho phép bất kỳ trang web nào bật HTTPS mà không cần chi phí. Kết hợp với công cụ Certbot, bạn có thể xin và tự động gia hạn chứng chỉ chỉ bằng một lệnh. Hầu hết các nền tảng đám mây và nhà cung cấp CDN cũng cung cấp chứng chỉ SSL miễn phí.
:::

---

## Tóm tắt

Tên miền, DNS và HTTPS là ba trụ cột của hạ tầng Internet. DNS cho phép chúng ta truy cập trang web bằng tên mà con người có thể đọc được, và HTTPS đảm bảo quá trình giao tiếp an toàn và đáng tin cậy.

Ôn lại các điểm chính của chương này:

1. **DNS là hệ thống phân tầng**: gốc → TLD → có thẩm quyền, truy vấn theo tầng, tăng tốc bằng bộ nhớ đệm
2. **Các loại bản ghi có công dụng khác nhau**: bản ghi A trỏ đến IP, CNAME làm bí danh, MX quản lý thư, TXT dùng xác minh
3. **Bắt tay TLS thiết lập tin cậy**: xác minh chứng chỉ + đàm phán khóa, TLS 1.3 chỉ cần 1-RTT
4. **Chuỗi tin cậy chứng chỉ**: Root CA → CA trung gian → chứng chỉ cuối, bảo chứng theo tầng
5. **HTTPS là yêu cầu tối thiểu**: chứng chỉ miễn phí (Let's Encrypt) giúp mã hóa không rào cản

## Đọc thêm

- [How DNS Works](https://howdns.works/) - Giải thích nguyên lý DNS bằng truyện tranh
- [Tài liệu Let's Encrypt](https://letsencrypt.org/docs/) - Hướng dẫn xin chứng chỉ SSL miễn phí
- [Cloudflare Learning Center](https://www.cloudflare.com/learning/dns/what-is-dns/) - Hướng dẫn DNS và bảo mật mạng
- [TLS 1.3 RFC 8446](https://datatracker.ietf.org/doc/html/rfc8446) - Đặc tả giao thức TLS 1.3
- [SSL Labs](https://www.ssllabs.com/ssltest/) - Kiểm tra trực tuyến chất lượng cấu hình HTTPS của trang web

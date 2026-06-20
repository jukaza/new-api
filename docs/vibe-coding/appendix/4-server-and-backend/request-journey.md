# Hành Trình Toàn Diện Của Một Request

::: tip Lời mở đầu
**Khi bạn nhập một URL vào trình duyệt và nhấn Enter, cho đến khi trang hiển thị, điều gì đã xảy ra ở giữa?** Đây là câu hỏi kinh điển trong phỏng vấn, và cũng là chìa khóa để hiểu toàn bộ kiến trúc Web. Nắm vững chuỗi liên kết này, bạn sẽ hiểu cách frontend, backend, mạng và cơ sở dữ liệu phối hợp với nhau.
:::

**Bài viết này sẽ giúp bạn học được gì?**

Sau khi học xong chương này, bạn sẽ có được:

- **Góc nhìn toàn chuỗi**: Hiểu quá trình hoàn chỉnh của một HTTP request từ khi gửi đi đến khi nhận về phản hồi
- **Nhận thức về trách nhiệm từng tầng**: DNS, TCP, Load Balancer, Web Server, Application Server, Database mỗi tầng làm gì
- **Khả năng xác định vấn đề**: Khi request chậm hoặc thất bại, biết bắt đầu kiểm tra từ tầng nào
- **Tư duy tối ưu hiệu năng**: Mỗi tầng đều có không gian tối ưu, biết điểm tối ưu nằm ở đâu

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Trình duyệt khởi tạo request | Phân giải DNS, Kết nối TCP, HTTP Request |
| **Chương 2** | Truyền tải qua mạng | Định tuyến, CDN, Cân bằng tải |
| **Chương 3** | Máy chủ xử lý | Web Server, Logic ứng dụng, Truy vấn cơ sở dữ liệu |
| **Chương 4** | Phản hồi trả về | Tuần tự hóa, Nén, Kết xuất |
| **Chương 5** | Tối ưu toàn chuỗi | Cache, Tái sử dụng kết nối, Xử lý bất đồng bộ |

---

## 0. Toàn cảnh: Một request đã trải qua những gì?

Dùng một phép so sánh để hiểu: bạn đặt mua sách trực tuyến, quá trình này giống với HTTP request một cách đáng kinh ngạc.

| Giai đoạn request | So sánh với mua sách | Tương ứng kỹ thuật |
|---------|---------|---------|
| Nhập URL | Bạn nói "Tôi muốn đến hiệu sách XYZ" | Trình duyệt phân tích URL |
| Phân giải DNS | Tra bản đồ tìm địa chỉ hiệu sách | Tên miền → Địa chỉ IP |
| Kết nối TCP | Đi đến cửa hiệu sách, đẩy cửa bước vào | Bắt tay ba bước thiết lập kết nối |
| Gửi request | Nói với nhân viên "Tôi muốn cuốn sách《xxx》" | Gói tin HTTP Request |
| Máy chủ xử lý | Nhân viên vào kho tìm sách, kiểm tra tồn kho, tính giá | Logic ứng dụng + Truy vấn cơ sở dữ liệu |
| Trả về phản hồi | Nhân viên đưa sách cho bạn | Gói tin HTTP Response |
| Trình duyệt kết xuất | Bạn mở sách ra đọc | Phân tích và kết xuất HTML/CSS/JS |

<RequestJourneyFlow />

---

## 1. Trình duyệt khởi tạo request

### 1.1 Phân tích URL

Khi bạn nhập `https://api.example.com/books?id=123`, trình duyệt sẽ phân tách nó thành các phần:

| Phần | Giá trị | Ý nghĩa |
|-----|-----|------|
| Giao thức | `https` | Giao tiếp bằng phương thức mã hóa |
| Tên miền | `api.example.com` | "Tên" của máy chủ |
| Đường dẫn | `/books` | Tài nguyên cần truy cập |
| Tham số truy vấn | `id=123` | Điều kiện bổ sung |

### 1.2 Phân giải DNS: Tên miền → Địa chỉ IP

Máy tính không nhận biết tên miền, chỉ nhận biết địa chỉ IP (ví dụ `93.184.216.34`). DNS chính là "danh bạ điện thoại" của Internet.

```
Cache trình duyệt → Cache hệ thống → Cache router → DNS ISP → Máy chủ tên miền gốc
     ↓ Trúng thì dùng luôn, không trúng thì tra tiếp xuống dưới
```

::: tip Ý nghĩa của cache DNS
Nếu mỗi request đều phải tra từ máy chủ tên miền gốc, Internet toàn cầu sẽ bị sập vì truy vấn DNS. Vì vậy mỗi tầng đều có cache, phần lớn request có thể phân giải xong ở tầng trình duyệt hoặc hệ thống.
:::

### 1.3 Bắt tay ba bước TCP

Sau khi tìm được địa chỉ IP, trình duyệt cần "thiết lập kết nối" với máy chủ. TCP dùng bắt tay ba bước để đảm bảo cả hai bên đều sẵn sàng:

```
Client → Server: Xin chào, tôi muốn kết nối (SYN)
Server → Client: Được, tôi đã sẵn sàng (SYN + ACK)
Client → Server: Đã nhận, bắt đầu giao tiếp (ACK)
```

Nếu là HTTPS, còn cần thêm bắt tay TLS để thương lượng phương thức mã hóa.

### 1.4 Gửi HTTP Request

Sau khi kết nối được thiết lập, trình duyệt gửi gói tin HTTP Request:

```http
GET /books?id=123 HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer eyJhbGci...
User-Agent: Chrome/120.0
```

| Thành phần | Nội dung |
|---------|------|
| Dòng request | Phương thức (GET) + Đường dẫn + Phiên bản giao thức |
| Header request | Meta information: xác thực danh tính, định dạng dữ liệu mong đợi, v.v. |
| Body request | Chỉ có trong request POST/PUT, mang dữ liệu cần gửi |

---

## 2. Truyền tải qua mạng: Request trên đường đi

### 2.1 Định tuyến chuyển tiếp

Sau khi request rời khỏi máy tính của bạn, nó sẽ đi qua nhiều router chuyển tiếp, giống như bưu kiện đi qua nhiều trạm trung chuyển:

```
Máy tính của bạn → Router gia đình → Mạng nhà mạng → Mạng trục → Phòng máy đích
```

Mỗi router dựa vào địa chỉ IP để quyết định chuyển tiếp "bước tiếp theo" đi đâu. Có thể dùng lệnh `traceroute` để xem request đã đi qua những nút nào.

### 2.2 Tăng tốc CDN

Nếu website đích sử dụng CDN (Mạng phân phối nội dung), request có thể không cần đến máy chủ gốc:

| Tình huống | Hướng đi |
|-----|------|
| Request tài nguyên tĩnh (ảnh, CSS, JS) | Nút biên CDN trả về trực tiếp |
| Request dữ liệu động (API) | Xuyên qua CDN, đến máy chủ gốc |

Bản chất của CDN là "đặt nội dung trước đến nơi gần người dùng nhất".

### 2.3 Cân bằng tải

Website lớn không chỉ có một máy chủ. Load Balancer chịu trách nhiệm phân phối request đến nhiều máy chủ:

```
Request người dùng → Load Balancer → Máy chủ A (30% lưu lượng)
                                    → Máy chủ B (30% lưu lượng)
                                    → Máy chủ C (40% lưu lượng)
```

Các chiến lược phân phối phổ biến:

| Chiến lược | Nguyên lý | Tình huống áp dụng |
|-----|------|---------|
| Round Robin | Phân phối lần lượt | Cấu hình máy chủ giống nhau |
| Weighted Round Robin | Phân phối theo trọng số | Cấu hình máy chủ khác nhau |
| IP Hash | Cùng một người dùng cố định vào một máy | Cần duy trì session |
| Least Connections | Phân cho máy có ít kết nối nhất hiện tại | Thời gian xử lý request chênh lệch lớn |

---

## 3. Máy chủ xử lý: Trong nhà bếp đã xảy ra điều gì

Sau khi request đến máy chủ, nó sẽ trải qua xử lý nhiều tầng.

### 3.1 Web Server (Nginx / Apache)

Thành phần đầu tiên nhận request thường là Web Server, nó chịu trách nhiệm:

| Trách nhiệm | Mô tả |
|-----|------|
| Phục vụ tệp tĩnh | Trả về trực tiếp HTML, CSS, JS, ảnh |
| Reverse Proxy | Chuyển tiếp request API đến ứng dụng backend |
| SSL Termination | Xử lý mã hóa và giải mã HTTPS |
| Lọc request | Chặn request độc hại, giới hạn tần suất |

### 3.2 Application Server xử lý

Web Server chuyển tiếp request đến Application Server (Node.js, Spring, Django, v.v.), quy trình xử lý:

```
Request vào → Chuỗi middleware → Khớp định tuyến → Controller → Tầng Service → Tầng truy cập dữ liệu
```

Những việc **middleware** làm:

1. Phân tích body request (JSON, dữ liệu form)
2. Xác thực danh tính (kiểm tra Token)
3. Kiểm tra quyền hạn (người dùng này có thể truy cập API này không?)
4. Ghi log (ai đã truy cập cái gì vào lúc nào)

### 3.3 Truy vấn cơ sở dữ liệu

Phần lớn request cuối cùng đều phải làm việc với cơ sở dữ liệu:

```
Code ứng dụng: SELECT * FROM books WHERE id = 123
    ↓
Database Engine: Phân tích SQL → Tối ưu truy vấn → Kế hoạch thực thi → Đọc dữ liệu
    ↓
Trả về kết quả: { id: 123, title: "xxx", price: 59.9 }
```

::: tip Cơ sở dữ liệu là nút thắt hiệu năng phổ biến nhất
Truyền tải mạng thường ở mức mili giây, logic ứng dụng cũng nhanh, nhưng một truy vấn cơ sở dữ liệu không có index có thể mất vài giây thậm chí vài chục giây. Vì vậy "request chậm" phần lớn là do truy vấn cơ sở dữ liệu chậm.
:::

---

## 4. Phản hồi trả về: Đường về của dữ liệu

### 4.1 Tạo HTTP Response

Sau khi máy chủ xử lý xong, tạo gói tin phản hồi:

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Encoding: gzip
Cache-Control: max-age=3600

{"id": 123, "title": "xxx", "price": 59.9}
```

| Thành phần | Nội dung |
|---------|------|
| Dòng trạng thái | Phiên bản giao thức + Mã trạng thái (200 Thành công, 404 Không tìm thấy, 500 Lỗi máy chủ) |
| Header phản hồi | Định dạng dữ liệu, Chiến lược cache, Phương thức nén, v.v. |
| Body phản hồi | Nội dung dữ liệu thực tế (JSON, HTML, v.v.) |

### 4.2 Nén dữ liệu

Máy chủ thường dùng gzip hoặc brotli để nén body phản hồi, giảm lượng truyền tải:

| Thuật toán nén | Tỷ lệ nén | Tốc độ |
|---------|--------|------|
| gzip | Khoảng 70% | Nhanh |
| brotli | Khoảng 80% | Chậm hơn nhưng nén tốt hơn |

Một JSON 100KB, sau khi nén có thể chỉ còn 20-30KB.

### 4.3 Trình duyệt kết xuất

Sau khi trình duyệt nhận được phản hồi:

1. **Phân tích HTML** → Xây dựng cây DOM
2. **Phân tích CSS** → Xây dựng cây kiểu
3. **Hợp nhất** → Tạo cây kết xuất
4. **Bố cục** → Tính toán vị trí và kích thước từng phần tử
5. **Vẽ** → Vẽ pixel lên màn hình

<RequestTimeline />

---

## 5. Tối ưu toàn chuỗi: Mỗi tầng đều có thể nhanh hơn

### 5.1 Các biện pháp tối ưu từng tầng

| Tầng | Biện pháp tối ưu | Hiệu quả |
|-----|---------|------|
| DNS | Phân giải trước DNS, dùng dịch vụ DNS nhanh | Giảm thời gian truy vấn DNS |
| Mạng | CDN, HTTP/2, Tái sử dụng kết nối | Giảm độ trễ truyền tải |
| Máy chủ | Cache (Redis), Xử lý bất đồng bộ | Giảm thời gian xử lý |
| Cơ sở dữ liệu | Index, Tối ưu truy vấn, Đọc/ghi tách biệt | Giảm thời gian truy vấn |
| Frontend | Lazy loading, Code splitting, Nén tài nguyên | Giảm thời gian kết xuất |

### 5.2 Cache: Tối ưu hiệu quả nhất

Cache tồn tại ở mỗi tầng trong chuỗi request:

```
Cache trình duyệt → Cache CDN → Cache Reverse Proxy → Cache ứng dụng (Redis) → Cache cơ sở dữ liệu
```

::: tip Bản chất của cache
Dùng không gian đổi lấy thời gian. Lưu kết quả đã tính toán lại, lần sau dùng trực tiếp, không cần tính lại. Tỷ lệ trúng cache mỗi khi tăng 10%, hiệu năng hệ thống có thể tăng gấp nhiều lần.
:::

### 5.3 Cách kiểm tra khi request thất bại

| Hiện tượng | Tầng có thể có vấn đề | Phương pháp kiểm tra |
|-----|------------|---------|
| Hoàn toàn không phản hồi | DNS / Mạng | ping, nslookup |
| Timeout kết nối | Mạng / Máy chủ sập | telnet, curl |
| Trả về 4xx | Request phía client có lỗi | Kiểm tra URL, tham số, Token |
| Trả về 5xx | Lỗi nội bộ máy chủ | Xem log máy chủ |
| Phản hồi rất chậm | Cơ sở dữ liệu / Logic ứng dụng | Xem log truy vấn chậm, công cụ APM |

---

## 6. Tổng kết

Hành trình toàn diện của một HTTP request:

1. **Trình duyệt**: Phân tích URL → Truy vấn DNS → Kết nối TCP → Gửi request
2. **Mạng**: Định tuyến chuyển tiếp → CDN phán đoán → Cân bằng tải phân phối
3. **Máy chủ**: Web Server nhận → Middleware xử lý → Logic nghiệp vụ → Truy vấn cơ sở dữ liệu
4. **Trả về**: Tạo phản hồi → Nén → Truyền tải mạng → Trình duyệt kết xuất

::: tip Giá trị của việc hiểu toàn chuỗi
Khi bạn có thể vẽ ra chuỗi liên kết hoàn chỉnh của request trong đầu, gặp bất kỳ vấn đề gì cũng có thể nhanh chóng xác định được tầng nào bị lỗi. Đây là bước nhảy then chốt từ "lập trình viên sơ cấp" lên "có thể tự kiểm tra và xử lý vấn đề".
:::

---

## Đọc thêm

- [HTTP Hướng dẫn toàn diện](https://developer.mozilla.org/zh-CN/docs/Web/HTTP) — Tài liệu HTTP của MDN
- [High Performance Browser Networking](https://hpbn.co/) — Tối ưu hiệu năng mạng trình duyệt
- [What happens when...](https://github.com/alex/what-happens-when) — Giải thích chi tiết kinh điển về "điều gì xảy ra sau khi nhập URL"

# Cổng gateway và Reverse Proxy
::: tip 🎯 Câu hỏi cốt lõi
**Trong kiến trúc Internet có mức độ truy cập đồng thời cao, làm thế nào để đưa lưu lượng truy cập đến đúng dịch vụ một cách an toàn và hiệu quả?** Reverse proxy giải quyết vấn đề "phân phối lưu lượng", API gateway giải quyết vấn đề "xử lý yêu cầu". Bài viết này thông qua các ví dụ thực tế (lễ tân, hệ thống bảo vệ, định tuyến thông minh) giúp bạn hiểu sâu về triết lý thiết kế và thực hành kỹ thuật của gateway.
:::

---

## 1. Tại sao cần "Gateway"?

### 1.1 Từ một ví dụ thực tế: Sự phát triển kiến trúc của một nền tảng thương mại điện tử

Một nền tảng thương mại điện tử đã gặp phải vấn đề kiến trúc nghiêm trọng khi tăng trưởng nhanh:

**Tái hiện tình huống:**

```
Giai đoạn 1: Để lộ trực tiếp dịch vụ
Client → Gọi trực tiếp User Service, Order Service, Payment Service...
         ↓
Vấn đề 1: IP dịch vụ bị lộ, tồn tại rủi ro bảo mật
Vấn đề 2: Không thể thống nhất xác thực, giới hạn lưu lượng
Vấn đề 3: Thêm dịch vụ mới cần sửa cấu hình client
```

::: warning ⚠️ Vấn đề chết người khi để lộ trực tiếp

- **Rủi ro bảo mật**: Tất cả IP dịch vụ bị lộ, dễ bị tấn công
- **Chức năng trùng lặp**: Mỗi dịch vụ đều phải làm xác thực, giới hạn lưu lượng, ghi log
- **Khó mở rộng**: Thêm dịch vụ mới phải sửa tất cả client
- **Hỗn loạn giao thức**: Có cái dùng HTTP, có cái dùng gRPC, client phải thích ứng
  :::

**Kiến trúc cải tiến (giới thiệu gateway):**

```
Client → API Gateway (Nginx/Kong) → Internal Services
         ↓
      Xác thực thống nhất, giới hạn lưu lượng, định tuyến
         ↓
      Client chỉ cần biết địa chỉ gateway
```

::: tip ✨ Hiệu quả sau khi cải tiến

- **An toàn**: IP dịch vụ thực bị ẩn, chỉ có gateway tiếp xúc với bên ngoài
- **Tập trung chức năng**: Xác thực, giới hạn lưu lượng, ghi log được xử lý tập trung tại gateway
- **Dễ mở rộng**: Thêm dịch vụ mới chỉ cần cấu hình định tuyến tại gateway
- **Giao thức thống nhất**: Đối ngoại HTTP, nội bộ có thể dùng gRPC
  :::

### 1.2 Ẩn dụ đời sống về Gateway

**Lễ tân công ty**

Hãy tưởng tượng bạn đến một công ty lớn:

- **Không có lễ tân**: Khách tự tìm từng phòng ban, không biết ở đâu, công ty hỗn loạn
- **Có lễ tân**: Khách đến lễ tân trước, lễ tân hỏi rõ mục đích, rồi hướng dẫn đến phòng ban tương ứng

**API Gateway chính là "lễ tân" của hệ thống**:

- **Reverse Proxy**: Lễ tân, hướng dẫn khách đến đúng phòng ban
- **API Gateway**: Lễ tân thông minh, còn có thể kiểm tra danh tính khách (xác thực), giới hạn số người truy cập (giới hạn lưu lượng)

<ReverseProxyDemo />

---

## 2. Reverse Proxy là gì?

### 2.1 Forward Proxy và Reverse Proxy

::: tip 🤔 Giải thích thuật ngữ
**Forward Proxy**:

- Triển khai ở phía client
- Thay mặt client truy cập tài nguyên bên ngoài
- Ứng dụng điển hình: VPN, công cụ vượt tường lửa
- Ví dụ: Trong mạng công ty, bạn truy cập Internet bên ngoài qua proxy

**Reverse Proxy**:

- Triển khai ở phía máy chủ
- Nhận yêu cầu từ client và chuyển tiếp đến dịch vụ nội bộ
- Client chỉ biết proxy tồn tại, không biết máy chủ thực
- Ví dụ: Nginx, HAProxy
  :::

**Bảng so sánh:**

| Khía cạnh         | Forward Proxy                 | Reverse Proxy                 |
| ----------------- | ----------------------------- | ----------------------------- |
| **Vị trí triển khai** | Phía client                 | Phía máy chủ                  |
| **Đối tượng phục vụ** | Client                      | Máy chủ                       |
| **Ứng dụng điển hình** | VPN, vượt tường lửa          | Cân bằng tải, gateway         |
| **Tính minh bạch**   | Máy chủ thấy IP proxy       | Client thấy IP proxy          |
| **Mục đích**     | Ẩn client thực, tăng tốc truy cập | Ẩn máy chủ thực, cân bằng tải |

### 2.2 Giá trị cốt lõi của Reverse Proxy

::: details Giá trị 1: Cân bằng tải
Phân phối lưu lượng đến nhiều máy chủ backend, tránh quá tải điểm đơn.

```
Client
  ↓
Nginx (Reverse Proxy)
  ↓
┌─────────┬─────────┬─────────┐
│ Server 1 │ Server 2 │ Server 3 │
└─────────┴─────────┴─────────┘
```

:::

::: details Giá trị 2: Bảo vệ an ninh
Ẩn IP máy chủ thực, ngăn chặn tấn công trực tiếp. Thực hiện bảo vệ an ninh tập trung tại tầng proxy.

```
Client → Chỉ thấy IP của Nginx
Máy chủ thực → Chỉ trong mạng nội bộ, bên ngoài không thể truy cập trực tiếp
```

:::

::: details Giá trị 3: SSL Termination
Xử lý mã hóa/giải mã HTTPS tại tầng proxy, dịch vụ backend dùng HTTP, giảm chi phí tính toán phía backend.

```
HTTPS Client → Nginx (mã hóa/giải mã) → HTTP Backend Service
                   ↑
              Điểm kết thúc SSL
```

:::

---

## 3. Nginx: Tại sao có thể chịu được hàng triệu kết nối đồng thời?

### 3.1 Mô hình tiến trình Master-Worker

Nginx sử dụng kiến trúc **đa tiến trình**, không phải đa luồng:

**Master Process (Quản lý)**:

- Chịu trách nhiệm đọc và xác thực tệp cấu hình
- Quản lý Worker Process (khởi động, dừng, tải lại)
- Không xử lý yêu cầu cụ thể

**Worker Process (Người làm việc)**:

- Thực tế xử lý yêu cầu HTTP
- Mỗi Worker là tiến trình độc lập, cách ly với nhau
- Số lượng thường được đặt bằng số lõi CPU, tránh chi phí chuyển ngữ cảnh

::: tip 💡 Ưu điểm

- **Cách ly tốt**: Một Worker bị crash, không ảnh hưởng đến Worker khác
- **Tận dụng đa lõi**: Mỗi Worker chạy độc lập
- **Tránh phức tạp đa luồng**: Không cần xử lý vấn đề khóa, cạnh tranh
  :::

### 3.2 Hướng sự kiện + Bất đồng bộ không chặn

Đây là bí mật cốt lõi cho hiệu năng cao của Nginx:

**Apache truyền thống (mô hình đa tiến trình/luồng)**:

- Một kết nối = Một tiến trình/luồng
- Số lượng đồng thời bị giới hạn bởi số tiến trình/luồng hệ thống
- Khi có nhiều kết nối, chi phí chuyển tiến trình rất lớn

**Nginx (mô hình hướng sự kiện)**:

- Sử dụng cơ chế I/O multiplexing hiệu quả như epoll (Linux) / kqueue (macOS)
- Một Worker Process có thể xử lý đồng thời hàng chục nghìn kết nối
- Khi kết nối không có dữ liệu, không chiếm CPU; khi có dữ liệu mới, được đánh thức qua thông báo sự kiện

::: tip Ẩn dụ đời sống

- **Apache**: Nhà hàng mỗi khách một phục vụ (tiến trình), khách đông cần nhiều phục vụ
- **Nginx**: Một siêu phục vụ, phục vụ đồng thời tất cả khách, ai cần phục vụ thì đến chỗ người đó, thay vì đứng mãi bên cạnh một khách
  :::

<NginxArchitectureDemo />

---

## 4. API Gateway là gì?

### 4.1 Tại sao cần API Gateway?

**Hãy tưởng tượng một hệ thống không có gateway:**

- Client cần biết địa chỉ của nhiều dịch vụ (User Service, Order Service, Payment Service...)
- Mỗi dịch vụ đều phải tự làm xác thực, giới hạn lưu lượng, ghi log
- Giao thức không thống nhất, có cái dùng HTTP, có cái dùng gRPC
- Khi nâng cấp dịch vụ, client cũng phải thay đổi theo

::: warning ⚠️ Vấn đề khi không có gateway

- **Client phức tạp**: Cần cấu hình nhiều địa chỉ dịch vụ
- **Chức năng trùng lặp**: Mỗi dịch vụ phải triển khai xác thực, giới hạn lưu lượng
- **Hỗn loạn giao thức**: Client phải thích ứng nhiều giao thức
- **Khó nâng cấp**: Nâng cấp dịch vụ, client cũng phải thay đổi
  :::

**Sau khi có API Gateway:**

- Client chỉ cần biết địa chỉ gateway, gateway chịu trách nhiệm định tuyến đến đúng dịch vụ
- Xác thực, giới hạn lưu lượng, ghi log và các logic xuyên suốt được xử lý tập trung tại gateway
- Gateway có thể chuyển đổi giao thức, đối ngoại thống nhất HTTP
- Nâng cấp dịch vụ backend chỉ cần thay đổi cấu hình gateway, client không cảm nhận được

<ApiGatewayDemo />

### 4.2 Chức năng cốt lõi của API Gateway

| Chức năng         | Mô tả                                       | Tình huống điển hình                                         |
| :---------------- | :------------------------------------------ | :----------------------------------------------------------- |
| **Định tuyến**     | Chuyển tiếp yêu cầu đến các dịch vụ khác nhau dựa trên URL, Header | `/api/users` → User Service, `/api/orders` → Order Service |
| **Cân bằng tải**   | Khi một dịch vụ có nhiều instance, phân bổ lưu lượng | User Service có 3 instance, phân phối yêu cầu theo vòng tròn |
| **Xác thực**       | Kiểm tra JWT, OAuth Token tập trung         | Người dùng chưa đăng nhập không thể truy cập `/api/admin`   |
| **Giới hạn lưu lượng & Ngắt mạch** | Kiểm soát giới hạn lưu lượng, ngăn dịch vụ bị quá tải | Tối đa 1000 yêu cầu/giây, vượt quá trả về 429 |
| **Chuyển đổi giao thức** | Đối ngoại HTTP, nội bộ chuyển gRPC        | Client dùng HTTP, gateway chuyển gRPC gọi dịch vụ nội bộ    |
| **Canary Release** | Dựa trên Header hoặc tỷ lệ, dẫn một phần lưu lượng đến phiên bản mới | 5% người dùng trải nghiệm phiên bản mới, 95% dùng phiên bản cũ |
| **Ghi log & Giám sát** | Ghi log yêu cầu tập trung, dễ phân tích và xử lý sự cố | Ghi lại thời gian phản hồi, mã trạng thái, kích thước phản hồi của mỗi yêu cầu |

---

## 5. Gateway Hands-on: Làm sao xây dựng kiến trúc gateway hoàn chỉnh?

### 5.1 Sơ đồ kiến trúc đầy đủ

```
┌───────────────────────────────────────────────────────────────────────┐
│                           Client (Browser/APP)                               │
└───────────────────────────┬─────────────────────────────────────────┘
                                │ HTTPS
                                ▼
┌───────────────────────────────────────────────────────────────────────┐
│                        Tầng ngoài: CDN + WAF                                  │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  CDN (Content Delivery Network)                                        │  │
│  │  - Cache tài nguyên tĩnh (ảnh, CSS, JS)                           │  │
│  │  - Truy cập gần nhất, giảm độ trễ                                   │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  WAF (Web Application Firewall)                                     │  │
│  │  - Phòng chống SQL injection, XSS                                │  │
│  │  - Chặn Bot độc hại, crawler                                  │  │
│  │  - Phòng chống tấn công CC                              │  │
│  └───────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────────────┐
│                     Tầng giữa: API Gateway (Nginx/Kong)                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Tầng 1: SSL Termination + Bảo vệ an ninh                              │  │
│  │  - HTTPS / TLS 1.3                                        │  │
│  │  - HSTS, Security Response Headers                                        │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Tầng 2: Xác thực và ủy quyền                                      │  │
│  │  - Xác thực JWT Token                                         │  │
│  │  - Tích hợp OAuth 2.0 / SSO                                     │  │
│  │  - Quản lý API Key                                         │  │
│  │  - Kiểm tra quyền (RBAC)                                        │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Tầng 3: Kiểm soát lưu lượng                                        │  │
│  │  - Giới hạn lưu lượng - Thuật toán Token Bucket/Leaky Bucket                             │  │
│  │  - Ngắt mạch - Ngăn chặn lan truyền lỗi                                 │  │
│  │  - Giảm cấp - Phương án dự phòng khi dịch vụ không khả dụng                         │  │
│  │  - Canary Release - Phân bổ lưu lượng theo tỷ lệ                          │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Tầng 4: Định tuyến và Cân bằng tải                                    │  │
│  │  - Định tuyến theo đường dẫn - Path-based Routing)                          │  │
│  │  - Định tuyến theo tên miền - Host-based Routing)                           │  │
│  │  - Định tuyến theo Header - Header-based Routing)                             │  │
│  │  - Thuật toán cân bằng tải - Round Robin/Weighted/Least Connections/IP Hash)             │  │
│  │  - Tích hợp Service Discovery)                        │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Tầng 5: Chuyển đổi giao thức và Xử lý dữ liệu                                 │  │
│  │  - SSL Termination - HTTPS ↔ HTTP)                                   │  │
│  │  - Chuyển đổi giao thức - HTTP ↔ gRPC / WebSocket)                         │  │
│  │  - Chuyển đổi request/response - JSON ↔ XML)                               │  │
│  │  - Nén dữ liệu - Gzip / Brotli)                                   │  │
│  │  - Cache - Cho tài nguyên tĩnh và API response                          │  │
│  └───────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────────────┐
│                        Tầng trong: Cụm Microservices                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │  User Svc    │ │  Order Svc  │ │ Product Svc │ │ Payment Svc │      │
│  │             │ │             │ │             │ │             │      │
│  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘      │
│         │                │                │                │               │
│         └────────────────┴────────────────┴────────────────┘               │
│                                       │                              │
│                    Service Discovery / etcd)                          │
│                    - Đăng ký và khám phá dịch vụ                                      │
│                    - Health check                                              │
│                    - Lưu trữ cấu hình KV                                              │
└───────────────────────────────────────────────────────────────────────┘
```

### 5.2 Định tuyến và Cân bằng tải

Một trong những trách nhiệm cốt lõi của gateway là **đưa yêu cầu đến đúng nơi**. Điều này liên quan đến hai khả năng then chốt: **định tuyến** (đến máy chủ nào) và **cân bằng tải** (phân bổ lưu lượng ra sao).

::: details Quy tắc định tuyến: Từ URL đến dịch vụ
Hãy tưởng tượng một hệ thống thương mại điện tử, các URL khác nhau tương ứng với các dịch vụ khác nhau:

- `/api/users/*` → User Service
- `/api/orders/*` → Order Service
- `/api/products/*` → Product Service
- `/api/pay/*` → Payment Service

**Ví dụ cấu hình Nginx:**

```nginx
server {
    listen 80;
    server_name api.example.com;

    # User Service
    location /api/users/ {
        proxy_pass http://user-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Order Service
    location /api/orders/ {
        proxy_pass http://order-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Product Service
    location /api/products/ {
        proxy_pass http://product-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Payment Service (yêu cầu bảo mật cao hơn)
    location /api/pay/ {
        # Giới hạn truy cập IP
        allow 10.0.0.0/8;
        deny all;

        proxy_pass http://payment-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

:::

::: details Cân bằng tải: So sánh bốn chiến lược
Khi cùng một dịch vụ có nhiều instance, làm thế nào để chọn?

| Chiến lược         | Nguyên lý                                              | Tình huống phù hợp           | Ưu điểm                 | Nhược điểm                         |
| :----------------- | :----------------------------------------------------- | :--------------------------- | :----------------------- | :--------------------------------- |
| **Round Robin**     | Phân bổ lần lượt cho từng máy chủ                      | Các máy chủ có hiệu năng tương đương | Đơn giản, công bằng       | Không xét tải hiện tại của máy chủ |
| **Weighted Round Robin** | Phân bổ theo tỷ lệ trọng số, trọng số cao được phân bổ nhiều hơn | Các máy chủ có hiệu năng không đồng đều | Tận dụng tối đa máy chủ hiệu năng cao | Cần thiết lập trọng số hợp lý |
| **Least Connections** | Phân bổ cho máy chủ có ít kết nối nhất                | Kết nối dài, video streaming | Thích ứng động với thay đổi tải | Cần thống kê số kết nối theo thời gian thực |
| **IP Hash**   | Tính hash dựa trên IP client, cùng IP luôn đến cùng một máy chủ | Cần duy trì session       | Đảm bảo tính nhất quán của session | IP nào có lưu lượng lớn sẽ gây áp lực điểm đơn |

**Ví dụ cấu hình Nginx:**

```nginx
# Weighted Round Robin
upstream backend_weighted {
    server 10.0.1.10:8080 weight=3;  # Hiệu năng tốt, chịu nhiều lưu lượng hơn
    server 10.0.1.11:8080 weight=2;
    server 10.0.1.12:8080 weight=1;  # Hiệu năng kém, chịu ít lưu lượng hơn
}

# Least Connections
upstream backend_least_conn {
    least_conn;
    server 10.0.1.10:8080;
    server 10.0.1.11:8080;
    server 10.0.1.12:8080;
}

# IP Hash (duy trì session)
upstream backend_ip_hash {
    ip_hash;
    server 10.0.1.10:8080;
    server 10.0.1.11:8080;
    server 10.0.1.12:8080;
}
```

:::

<LoadBalancingDemo />

---

## 6. Bảo mật Gateway: Làm thế nào bảo vệ cánh cổng hệ thống?

### 6.1 Xác thực và Ủy quyền

**Cách truyền thống (mỗi dịch vụ tự xác thực):**

- User Service, Order Service, Payment Service... mỗi cái đều phải kiểm tra JWT
- Code trùng lặp, khó bảo trì
- Secret phân tán ở nhiều dịch vụ, rủi ro lộ thông tin cao

**Xác thực tập trung tại Gateway:**

- Client mang Token truy cập gateway
- Gateway kiểm tra tính hợp lệ của Token (chữ ký, thời gian hết hạn)
- Sau khi kiểm tra thành công, thêm thông tin người dùng (như user_id) vào request header, chuyển tiếp đến dịch vụ backend
- Dịch vụ backend không cần kiểm tra, lấy thông tin người dùng trực tiếp từ Header

::: tip 💡 Tư tưởng cốt lõi
**Xác thực ở Gateway, ủy quyền ở Service**:

- **Xác thực**: Bạn là ai? (Kiểm tra Token, lấy danh tính người dùng)
- **Ủy quyền**: Bạn có thể làm gì? (Dựa trên vai trò người dùng để xác định quyền hạn)

Giống như lễ tân công ty: lễ tân xác thực danh tính của bạn (CMND), nhưng quyền hạn cụ thể do từng phòng ban xác định.
:::

<AuthMiddlewareDemo />

### 6.2 HTTPS và SSL Termination

**Tại sao cần HTTPS?**

1. **An toàn**: Ngăn chặn dữ liệu bị đánh cắp trong quá trình truyền tải
2. **Tuân thủ**: Trình duyệt hiện đại hiển thị cảnh báo "Không an toàn" với website HTTP
3. **SEO**: Công cụ tìm kiếm ưu tiên thu thập website HTTPS

**Giải pháp SSL Termination:**

- Chỉ cấu hình HTTPS và chứng chỉ ở tầng gateway
- Gateway chịu trách nhiệm TLS handshake và mã hóa/giải mã
- Giữa gateway và dịch vụ backend sử dụng HTTP plaintext (mạng nội bộ đáng tin cậy)
- Dịch vụ backend tập trung vào logic nghiệp vụ, không cần xử lý TLS

::: tip 💡 Ưu điểm của SSL Termination

- **Đơn giản hóa quản lý**: Chứng chỉ chỉ cấu hình ở gateway, backend không cần cấu hình
- **Giảm chi phí**: Dịch vụ backend không cần xử lý TLS handshake
- **Cập nhật thống nhất**: Cập nhật chứng chỉ chỉ cần thao tác ở gateway
  :::

<SslTerminationDemo />

---

## 7. Giới hạn lưu lượng và Ngắt mạch: Làm sao ngăn hệ thống bị "lũ lưu lượng" cuốn trôi?

### 7.1 So sánh thuật toán giới hạn lưu lượng

| Thuật toán         | Tư tưởng cốt lõi                  | Lưu lượng đột biến                    | Tình huống phù hợp                       | Độ phức tạp triển khai |
| :----------------- | :-------------------------------- | :------------------------------------ | :--------------------------------------- | :--------------------- |
| **Token Bucket**   | Xô chứa token, có token mới được qua | Cho phép một mức độ đột biến nhất định | Giới hạn API, kiểm soát băng thông       | Trung bình             |
| **Leaky Bucket**   | Yêu cầu vào xô, xử lý đầu ra đều đặn | Bắt buộc làm mịn, đột biến sẽ bị cache hoặc từ chối | Cần xử lý đều đặn nghiêm ngặt | Trung bình             |
| **Sliding Window** | Thống kê số yêu cầu trong cửa sổ thời gian | Đếm chặt theo cửa sổ, vượt quá đều từ chối | Thống kê chính xác (ví dụ "tối đa 100 lần/phút") | Khá cao               |

### 7.2 Cấu hình giới hạn lưu lượng Nginx thực tế

```nginx
# Định nghĩa vùng giới hạn lưu lượng (đặt trong khối http)

# 1. Giới hạn lưu lượng dựa trên IP (thuật toán Leaky Bucket)
# zone=mylimit:10m - tên vùng và kích thước bộ nhớ (10MB lưu được khoảng 160k IP)
# rate=10r/s - cho phép 10 yêu cầu mỗi giây
limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;

# 2. Giới hạn số kết nối dựa trên IP (ngăn một IP tạo quá nhiều kết nối)
limit_conn_zone $binary_remote_addr zone=addr:10m;

# 3. Giới hạn lưu lượng dựa trên endpoint dịch vụ (không phân biệt IP, bảo vệ toàn bộ backend)
limit_req_zone $server_name zone=server_limit:10m rate=100r/s;

server {
    listen 80;
    server_name api.example.com;

    # User Service - Giới hạn lưu lượng thông thường
    location /api/users/ {
        # Áp dụng giới hạn lưu lượng
        # burst=20 - dung lượng xô, cho phép đột biến 20 yêu cầu
        # nodelay - không trì hoãn xử lý yêu cầu đột biến (xử lý ngay hoặc từ chối)
        limit_req zone=mylimit burst=20 nodelay;

        # Giới hạn số kết nối của một IP
        limit_conn addr 10;

        proxy_pass http://user-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Order Service - Giới hạn lưu lượng nghiêm ngặt hơn
    location /api/orders/ {
        # Giới hạn nghiêm ngặt hơn: 5 yêu cầu mỗi giây
        limit_req_zone $binary_remote_addr zone=order_limit:10m rate=5r/s;
        limit_req zone=order_limit burst=10 nodelay;

        proxy_pass http://order-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Xử lý sau khi giới hạn lưu lượng
    # Khi yêu cầu bị giới hạn, trả về 429 Too Many Requests
    error_page 429 /429.html;
    location = /429.html {
        internal;
        return 429 '{"error": "Too Many Requests", "message": "Rate limit exceeded. Please try again later."}';
        add_header Content-Type application/json;
    }
}
```

::: tip 💡 Khuyến nghị chiến lược giới hạn lưu lượng

- **API thông thường**: 10 yêu cầu/giây, cho phép đột biến 20
- **API quan trọng** (thanh toán, đơn hàng): 5 yêu cầu/giây, cho phép đột biến 10
- **Bảo vệ toàn cục**: Tổng tất cả yêu cầu không vượt quá 100/giây
  :::

<RateLimitingDemo />

### 7.3 Ngắt mạch: Ngăn chặn lan truyền lỗi

**Nguyên lý hoạt động của Circuit Breaker:**

1. **Trạng thái đóng**: Chuyển tiếp yêu cầu bình thường, đồng thời thống kê tỷ lệ lỗi
2. **Trạng thái mở**: Khi tỷ lệ lỗi vượt ngưỡng, circuit breaker mở, trả về lỗi trực tiếp, không chuyển tiếp yêu cầu nữa
3. **Trạng thái nửa mở**: Sau một khoảng thời gian, cho phép một lượng nhỏ yêu cầu thăm dò, nếu thành công thì đóng circuit breaker

::: tip 💡 Tư tưởng cốt lõi
**Ngắt mạch giống như cầu chì điện**: Khi dòng điện quá lớn, cầu chì tự động ngắt, bảo vệ toàn bộ mạch điện không bị cháy.

Tương tự, khi dịch vụ backend xuất hiện nhiều lỗi, circuit breaker "ngắt", thất bại nhanh, ngăn lỗi lan truyền ra toàn hệ thống.
:::

---

## 8. Tổng kết: Tư duy thiết kế Gateway cốt lõi

### 8.1 Ôn tập nguyên tắc cốt lõi

| Nguyên tắc         | Ý nghĩa                 | Điểm thực hành                       |
| ------------------ | ----------------------- | ------------------------------------ |
| **Định tuyến**     | Đưa yêu cầu đến đúng nơi | Định tuyến theo đường dẫn, tên miền, Header |
| **Cân bằng tải**   | Phân bổ lưu lượng đến nhiều máy chủ | Round Robin, Weighted, Least Connections, IP Hash |
| **An toàn**     | Bảo vệ cánh cổng hệ thống | Xác thực, ủy quyền, HTTPS, WAF |
| **Giới hạn lưu lượng** | Ngăn bị lưu lượng cuốn trôi | Token Bucket, Leaky Bucket, Sliding Window |
| **Ngắt mạch**     | Ngăn lan truyền lỗi | Thất bại nhanh, phương án giảm cấp |
| **Khả năng quan sát** | Giám sát và xử lý sự cố | Log, metrics, tracing |

### 8.2 Khuyến nghị lựa chọn công nghệ

::: tip 💡 Cây quyết định lựa chọn

```
Chọn gateway:
│
├─ Chỉ cần reverse proxy, cân bằng tải?
│  ├─ Có → Nginx (lựa chọn hàng đầu)
│  └─ Không → Tiếp tục
│
├─ Cần hệ sinh thái plugin phong phú?
│  ├─ Có → Kong (dựa trên Nginx)
│  └─ Không → Tiếp tục
│
├─ Hệ sinh thái Spring Cloud?
│  ├─ Có → Spring Cloud Gateway
│  └─ Không → Nginx
```

:::

---

## 9. Bảng tra cứu thuật ngữ

| Thuật ngữ         | Tiếng Anh                     | Giải thích                                                                                                               |
| ----------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Reverse Proxy** | Reverse Proxy            | Dịch vụ proxy triển khai ở phía máy chủ, nhận yêu cầu từ client và chuyển tiếp đến dịch vụ nội bộ. Client chỉ biết reverse proxy tồn tại, không biết địa chỉ máy chủ thực. |
| **Forward Proxy** | Forward Proxy            | Dịch vụ proxy triển khai ở phía client, thay mặt client truy cập tài nguyên bên ngoài. Máy chủ thấy IP của proxy, không biết client thực. Ứng dụng điển hình: VPN, công cụ vượt tường lửa. |
| **API Gateway**  | API Gateway              | Tầng trung gian giữa client và dịch vụ backend, cung cấp định tuyến, xác thực, giới hạn lưu lượng, ghi log, là "cánh cổng thống nhất" của kiến trúc microservices. |
| **Cân bằng tải** | Load Balancing           | Phân bổ lưu lượng yêu cầu đến nhiều máy chủ, tránh một máy chủ quá tải, nâng cao tính khả dụng và hiệu năng hệ thống. |
| **SSL Termination** | SSL Termination          | Xử lý mã hóa/giải mã HTTPS tại tầng gateway, dịch vụ backend dùng HTTP, giảm chi phí tính toán backend, đơn giản hóa quản lý chứng chỉ. |
| **Giới hạn lưu lượng** | Rate Limiting            | Giới hạn số yêu cầu trong một đơn vị thời gian, ngăn hệ thống bị quá tải bởi lưu lượng đột biến. Thuật toán phổ biến: Token Bucket, Leaky Bucket, Sliding Window. |
| **Ngắt mạch** | Circuit Breaking         | Khi dịch vụ phụ thuộc gặp sự cố, tự động cắt lời gọi, ngăn lỗi lan truyền, và cung cấp phương án giảm cấp. |
| **Duy trì session** | Session Persistence      | Đảm bảo yêu cầu của cùng một client luôn được định tuyến đến cùng một máy chủ backend, dùng cho các tình huống cần duy trì trạng thái session. |
| **Health Check** | Health Check             | Định kỳ kiểm tra trạng thái sức khỏe của dịch vụ backend, tự động loại bỏ node lỗi, đảm bảo lưu lượng chỉ được gửi đến instance dịch vụ khỏe mạnh. |
| **Canary Release** | Canary Release           | Dẫn một lượng nhỏ lưu lượng đến phiên bản mới, sau khi xác minh tính ổn định, từ từ mở rộng tỷ lệ, giảm rủi ro phát hành. |
| **WAF**      | Web Application Firewall | Tường lửa ứng dụng web, phòng chống SQL injection, XSS, tấn công CC và các mối đe dọa bảo mật web khác. |
| **CDN**      | Content Delivery Network | Mạng phân phối nội dung, triển khai node biên trên toàn cầu, tăng tốc truy cập tài nguyên tĩnh. |
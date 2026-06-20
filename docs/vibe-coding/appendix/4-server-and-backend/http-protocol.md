# Giao thức HTTP: "Ngôn ngữ giao tiếp" giữa frontend và backend

::: tip 🎯 Câu hỏi cốt lõi
**HTTP hoạt động như thế nào?** Điều này giống như hỏi: hai người trò chuyện với nhau như thế nào? Cần thống nhất ngôn ngữ, ngữ pháp, quy tắc hội thoại. HTTP chính là "giao thức hội thoại" giữa frontend và backend.
:::

---

## 0. Bản chất của HTTP

**HTTP** (HyperText Transfer Protocol, Giao thức truyền tải siêu văn bản) là giao thức cơ bản cho giao tiếp giữa frontend và backend.

### 0.1 So sánh với hội thoại

| Yếu tố hội thoại | Tương ứng trong HTTP | Giải thích |
| :--- | :--- | :--- |
| Ngôn ngữ | Giao thức HTTP | Ngôn ngữ mà cả hai bên đều hiểu |
| Ngữ pháp | Định dạng request/response | Cách "nói chuyện" |
| Quy trình | Mô hình request-response | Một hỏi một đáp |
| Kết thúc | Ngắt kết nối | Đóng kết nối TCP |

---

## 1. Lịch sử phát triển của HTTP

HTTP ra đời từ năm 1991 và đã trải qua nhiều lần nâng cấp lớn.

<HttpProtocolDemo />

### 1.1 So sánh các phiên bản

| Phiên bản | Năm | Cải tiến cốt lõi | Đặc điểm điển hình |
| :--- | :--- | :--- | :--- |
| **HTTP/0.9** | 1991 | Chỉ hỗ trợ GET | Văn bản thuần, chỉ có request, không có response header |
| **HTTP/1.0** | 1996 | Thêm POST/HEAD | Mỗi request một kết nối TCP |
| **HTTP/1.1** | 1997 | Kết nối bền vững | Keep-Alive, một kết nối nhiều request |
| **HTTP/2** | 2015 | Đa kênh | Khung nhị phân, nén header |
| **HTTP/3** | 2022 | Dựa trên QUIC | Truyền qua UDP, giải quyết chặn đầu hàng |

::: tip 💡 Tại sao cần HTTP/2?
HTTP/1.1 tuy hỗ trợ kết nối bền vững, nhưng các request phải được gửi tuần tự (phải nhận được response của request trước thì mới gửi được request tiếp theo). HTTP/2 đã giải quyết vấn đề này thông qua đa kênh, cho phép gửi nhiều request đồng thời.
:::

---

## 2. Cấu trúc HTTP request

### 2.1 Dòng request

```http
GET /api/users/123 HTTP/1.1
```

Bao gồm ba phần:
- **Phương thức**: GET, POST, PUT, DELETE, v.v.
- **URL**: Đường dẫn tài nguyên được yêu cầu
- **Phiên bản**: HTTP/1.1 hoặc HTTP/2

### 2.2 Request header

```http
Host: api.example.com
User-Agent: Mozilla/5.0
Accept: application/json
Authorization: Bearer xxx
Content-Type: application/json
Content-Length: 45
```

Các request header phổ biến:
| Header | Giải thích | Ví dụ |
| :--- | :--- | :--- |
| **Host** | Tên miền máy chủ | `api.example.com` |
| **User-Agent** | Thông tin client | `Mozilla/5.0` |
| **Accept** | Kiểu response chấp nhận | `application/json` |
| **Authorization** | Thông tin xác thực | `Bearer token` |
| **Content-Type** | Kiểu của request body | `application/json` |

### 2.3 Request body

```json
{
  "name": "张三",
  "email": "zhangsan@example.com"
}
```

Chỉ các phương thức POST, PUT, PATCH mới có request body.

---

## 3. Cấu trúc HTTP response

### 3.1 Dòng trạng thái

```http
HTTP/1.1 200 OK
```

Bao gồm ba phần:
- **Phiên bản**: HTTP/1.1
- **Mã trạng thái**: 200, 404, 500, v.v.
- **Văn bản trạng thái**: OK, Not Found, v.v.

### 3.2 Response header

```http
Content-Type: application/json
Content-Length: 156
Cache-Control: max-age=3600
Set-Cookie: session=xxx; HttpOnly
```

Các response header phổ biến:
| Header | Giải thích | Ví dụ |
| :--- | :--- | :--- |
| **Content-Type** | Kiểu của response body | `application/json` |
| **Content-Length** | Kích thước response body | `156` |
| **Cache-Control** | Chiến lược cache | `max-age=3600` |
| **Set-Cookie** | Thiết lập Cookie | `session=xxx` |

### 3.3 Response body

```json
{
  "code": 0,
  "data": {
    "id": 123,
    "name": "张三"
  }
}
```

---

## 4. Chi tiết về các phương thức HTTP

| Phương thức | Mục đích | Request body | Tính lũy đẳng | Tính an toàn |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | Lấy tài nguyên | Không | Có | Có |
| **POST** | Tạo tài nguyên | Có | Không | Không |
| **PUT** | Cập nhật toàn bộ | Có | Có | Không |
| **PATCH** | Cập nhật một phần | Có | Không | Không |
| **DELETE** | Xóa tài nguyên | Không | Có | Không |
| **HEAD** | Lấy header | Không | Có | Có |
| **OPTIONS** | Truy vấn phương thức hỗ trợ | Không | Có | Có |

### 4.1 GET vs POST

| Đặc tính | GET | POST |
| :--- | :--- | :--- |
| **Vị trí tham số** | Tham số truy vấn URL | Request body |
| **Cache** | Có thể cache | Mặc định không cache |
| **Bookmark** | Có thể bookmark | Không thể |
| **Lịch sử** | Lưu trong lịch sử trình duyệt | Không lưu |
| **Độ dài dữ liệu** | Có giới hạn (độ dài URL) | Không giới hạn |
| **Bảo mật** | Tham số hiển thị trong URL | Tham số nằm trong request body |

::: tip 💡 Khi nào dùng GET/POST?
- **GET**: Truy vấn, lấy dữ liệu
- **POST**: Tạo, gửi dữ liệu
- **PUT**: Cập nhật toàn bộ (thay thế toàn bộ tài nguyên)
- **PATCH**: Cập nhật một phần (chỉ sửa các trường được chỉ định)
- **DELETE**: Xóa tài nguyên
:::

---

## 5. Mã trạng thái HTTP

### 5.1 Phân loại mã trạng thái

| Phân loại | Giải thích | Mã trạng thái điển hình |
| :--- | :--- | :--- |
| **2xx** | Thành công | 200 OK、201 Created、204 No Content |
| **3xx** | Chuyển hướng | 301 Vĩnh viễn、302 Tạm thời、304 Không thay đổi |
| **4xx** | Lỗi phía client | 400 Lỗi tham số、401 Chưa xác thực、404 Không tồn tại |
| **5xx** | Lỗi phía server | 500 Lỗi nội bộ、503 Không khả dụng |

### 5.2 Các mã trạng thái thường dùng

| Mã trạng thái | Giải thích | Tình huống sử dụng |
| :--- | :--- | :--- |
| **200 OK** | Request thành công | Request GET, PUT thành công |
| **201 Created** | Tạo thành công | POST tạo tài nguyên thành công |
| **204 No Content** | Không có nội dung | DELETE xóa thành công |
| **301 Moved Permanently** | Chuyển hướng vĩnh viễn | URL thay đổi vĩnh viễn |
| **302 Found** | Chuyển hướng tạm thời | URL thay đổi tạm thời |
| **304 Not Modified** | Không thay đổi | Cache còn hiệu lực |
| **400 Bad Request** | Lỗi tham số | Định dạng tham số request sai |
| **401 Unauthorized** | Chưa xác thực | Cần đăng nhập |
| **403 Forbidden** | Không có quyền | Đã đăng nhập nhưng không đủ quyền |
| **404 Not Found** | Không tồn tại | Tài nguyên không tồn tại |
| **500 Internal Server Error** | Lỗi nội bộ | Máy chủ gặp ngoại lệ |
| **503 Service Unavailable** | Không khả dụng | Máy chủ đang bảo trì hoặc quá tải |

---

## 6. HTTPS: HTTP an toàn

### 6.1 HTTP vs HTTPS

| Đặc tính | HTTP | HTTPS |
| :--- | :--- | :--- |
| **Giao thức** | TCP | TCP + SSL/TLS |
| **Cổng** | 80 | 443 |
| **Dữ liệu** | Truyền văn bản rõ | Truyền mã hóa |
| **Chứng chỉ** | Không cần | Cần chứng chỉ SSL |
| **Hiệu năng** | Nhanh hơn một chút | Chậm hơn một chút (chi phí bắt tay) |
| **SEO** | Không ảnh hưởng | Được công cụ tìm kiếm ưu tiên lập chỉ mục |

### 6.2 Quy trình hoạt động của HTTPS

1. **Client Hello**：Client gửi các bộ mã hóa được hỗ trợ
2. **Server Hello**：Server trả về chứng chỉ và bộ mã hóa đã chọn
3. **Xác minh chứng chỉ**：Client xác minh tính hợp lệ của chứng chỉ server
4. **Trao đổi khóa**：Sử dụng mã hóa bất đối xứng để trao đổi khóa phiên
5. **Giao tiếp mã hóa**：Sử dụng khóa phiên để giao tiếp mã hóa đối xứng

::: tip 💡 Ưu điểm của HTTPS
- **Chống nghe lén**：Dữ liệu được mã hóa, bên thứ ba không thể đọc được
- **Chống giả mạo**：Kiểm tra tính toàn vẹn của dữ liệu
- **Chống mạo danh**：Chứng chỉ SSL xác minh danh tính máy chủ
:::

---

## 7. Cơ chế cache của HTTP

### 7.1 Cache header

| Header | Giải thích | Ví dụ |
| :--- | :--- | :--- |
| **Cache-Control** | Chiến lược cache | `max-age=3600` |
| **ETag** | Số phiên bản tài nguyên | `"33a64df551425fcc"` |
| **Last-Modified** | Thời gian sửa đổi cuối cùng | `Wed, 21 Oct 2015 07:28:00 GMT` |

### 7.2 Chiến lược cache

**Cache cứng**：
```http
Cache-Control: max-age=3600
```
Trong vòng 3600 giây, trình duyệt sử dụng trực tiếp cache, không gửi request.

**Cache thương lượng**：
```http
ETag: "33a64df551425fcc"
```
Trình duyệt gửi `If-None-Match`, server trả về 304 (không thay đổi) hoặc 200 (đã thay đổi).

---

## 8. Các câu hỏi thường gặp

### 8.1 Sự khác biệt bản chất giữa GET và POST

**Hiểu lầm**：GET và POST chỉ khác nhau ở vị trí tham số.

**Sự thật**：
- GET có tính lũy đẳng, nhiều lần request cho kết quả giống nhau
- POST không có tính lũy đẳng, nhiều lần request có thể tạo ra nhiều tài nguyên
- GET có thể được cache, POST mặc định không cache
- GET có thể lưu bookmark, POST không thể

### 8.2 Chặn đầu hàng trong HTTP/1.1

**Vấn đề**：HTTP/1.1 tuy hỗ trợ kết nối bền vững, nhưng các request phải được gửi tuần tự. Request trước phản hồi chậm, các request sau đều phải chờ.

**Giải pháp**：
- HTTP/2 đa kênh
- Phân mảnh tên miền (nhiều tên miền thiết lập nhiều kết nối)
- Connection pool (giới hạn số lượng kết nối đồng thời)

### 8.3 Ưu điểm của HTTP/2

| Đặc tính | HTTP/1.1 | HTTP/2 |
| :--- | :--- | :--- |
| **Định dạng truyền** | Văn bản | Khung nhị phân |
| **Đa kênh** | Không hỗ trợ | Hỗ trợ |
| **Nén header** | Không | Thuật toán HPACK |
| **Server push** | Không hỗ trợ | Hỗ trợ |

---

## Bảng tra cứu thuật ngữ

| Thuật ngữ | Tiếng Anh | Giải thích |
| :--- | :--- | :--- |
| **HTTP** | HyperText Transfer Protocol | Giao thức truyền tải siêu văn bản |
| **HTTPS** | HTTP Secure | HTTP + SSL/TLS |
| **TCP** | Transmission Control Protocol | Giao thức điều khiển truyền tải |
| **SSL/TLS** | Secure Sockets Layer | Lớp socket bảo mật |
| **Tính lũy đẳng** | Idempotent | Nhiều lần request cho kết quả giống nhau |
| **Kết nối bền vững** | Keep-Alive | Một kết nối TCP gửi nhiều request |
| **Đa kênh** | Multiplexing | Gửi nhiều request đồng thời |
| **Chặn đầu hàng** | Head-of-Line Blocking | Request phía trước chặn request phía sau |

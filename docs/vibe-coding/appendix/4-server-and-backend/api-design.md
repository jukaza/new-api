# Thiết kế API: "Giao thức đối thoại" giữa frontend và backend

::: tip 🎯 Câu hỏi cốt lõi
**Làm thế nào để frontend và backend giao tiếp hiệu quả?** Câu hỏi này giống như: làm sao để thiết kế thực đơn nhà hàng để khách nhìn là hiểu ngay? Làm sao để nhân viên ghi order không bị sai? Làm sao để quy trình phục vụ chuẩn chỉnh, khách hàng hài lòng? Thiết kế API chính là giải quyết vấn đề "quy tắc đối thoại" này.
:::

---

## 0. Hãy tự hỏi: bạn đã từng gặp những cơn ác mộng này chưa?

**Tình huống 1: Đặt tên API tùy tiện**

```
GET /getUserData
GET /fetchUserInfo
GET /queryUserById
GET /users/query
```

Bốn API cùng chức năng, nhưng kiểu đặt tên hoàn toàn khác nhau. Người mới vào team sẽ bối rối: tôi nên dùng cái nào?

**Tình huống 2: Xử lý lỗi muôn hình vạn trạng**

```json
// Có chỗ trả về HTTP status code
HTTP/1.1 404 Not Found

// Có chỗ trả về 200 + code
HTTP/1.1 200 OK
{ "code": 404, "message": "Người dùng không tồn tại" }

// Có chỗ trực tiếp ném exception
HTTP/1.1 200 OK
{ "error": "Đã xảy ra lỗi" }
```

Frontend không biết phải đánh giá request thành công hay thất bại như thế nào.

**Tình huống 3: Cấu trúc response mỗi API một kiểu**

```json
// API A
{ "data": { ... } }

// API B
{ "result": { ... } }

// API C
{ "content": { ... } }
```

Mỗi API trả về định dạng khác nhau, frontend phải xử lý riêng cho từng API.

---

**Thiết kế API tốt giống như hệ thống gọi món của nhà hàng** -- thực đơn rõ ràng, quy trình chuẩn chỉnh, có lỗi là có thông báo.

---

## 1. API là gì?

**API** (Application Programming Interface, giao diện lập trình ứng dụng) chính là "quy ước đối thoại giữa các chương trình".

### 1.1 Liên tưởng với nhà hàng

| Vai trò trong nhà hàng | Khái niệm tương ứng | Giải thích |
| :--- | :--- | :--- |
| Thực đơn | Tài liệu API | Cho bạn biết có những "món" nào có thể gọi |
| Nhân viên phục vụ | Giao thức HTTP | "Cách thức đối thoại" được chuẩn hóa |
| Nhà bếp | Server | Xử lý request theo "đơn hàng" |
| Dọn món | Response | Trả kết quả về cho "khách" |

### 1.2 Một API request hoàn chỉnh

👇 **Thử ngay**: nhấn nút bên dưới, quan sát quy trình request-response hoàn chỉnh của một API:

<ApiRequestDemo />

---

## 2. Triết lý thiết kế API: RPC / REST / GraphQL / gRPC

Trước khi đi vào thiết kế RESTful cụ thể, hãy tìm hiểu bốn phong cách thiết kế API chính:

<ApiStyleCompare />

### 2.1 REST vs RESTful: khác nhau thế nào?

Rất nhiều người nhầm lẫn hai khái niệm này:

| Khái niệm | Ý nghĩa | Giải thích |
| :--- | :--- | :--- |
| **REST** | Một phong cách kiến trúc | Triết lý thiết kế do Roy Fielding đề xuất, bao gồm một tập hợp các ràng buộc |
| **RESTful** | Tuân thủ phong cách REST | Tính từ, chỉ API được thiết kế tuân theo nguyên tắc REST |

**Tương tự**:
- REST giống như "chủ nghĩa tối giản" -- một triết lý thiết kế
- RESTful API giống như "căn phòng phong cách tối giản" -- triển khai cụ thể của triết lý đó

**Sáu ràng buộc của REST**:

| Ràng buộc | Giải thích |
| :--- | :--- |
| **Client-Server tách biệt** | Frontend và backend phát triển độc lập, interface được giải ghép |
| **Stateless (phi trạng thái)** | Mỗi request chứa tất cả thông tin cần thiết, server không lưu trạng thái phiên |
| **Cacheable (có thể cache)** | Response phải chỉ rõ có thể cache hay không, để tăng hiệu suất |
| **Uniform Interface (giao diện thống nhất)** | Sử dụng HTTP method và status code chuẩn |
| **Layered System (hệ thống phân lớp)** | Client không cần biết đang kết nối với lớp server nào |
| **Code on Demand (tùy chọn)** | Server có thể mở rộng chức năng cho client |

::: tip 💡 Tại sao REST được dùng nhiều nhất?
1. **Chi phí học tập thấp**: bản thân giao thức HTTP đã thể hiện tư tưởng REST
2. **Hệ sinh thái trưởng thành**: công cụ, framework, tài liệu phong phú
3. **Tính phổ quát cao**: bất kỳ ngôn ngữ nào, nền tảng nào cũng có thể gọi
4. **Dễ cache**: GET request tự nhiên có thể cache, thân thiện với CDN
:::

---

## 3. Thiết kế RESTful: để URL biết nói

**REST** (Representational State Transfer) là một phong cách kiến trúc, tư tưởng cốt lõi là:

- Trừu tượng hóa các thực thể trên mạng thành "tài nguyên" (Resource)
- Sử dụng URL để định danh tài nguyên
- Sử dụng HTTP method để thao tác với tài nguyên

### 3.1 Liên tưởng với nhà kho

| Khái niệm nhà kho | Tương ứng REST | Ví dụ |
| :--- | :--- | :--- |
| Địa chỉ kệ hàng | URL | `/users`, `/orders` |
| Phương thức thao tác | HTTP method | GET (xem), POST (nhập kho) |
| Hàng hóa | Tài nguyên | Dữ liệu người dùng, dữ liệu đơn hàng |

**Nguyên tắc then chốt**: URL là danh từ, không phải động từ.

### 3.2 Quy tắc thiết kế URL

| Quy tắc | Ví dụ sai | Ví dụ đúng | Giải thích |
| :--- | :--- | :--- | :--- |
| Dùng danh từ, không dùng động từ | `/getUsers` | `/users` | URL biểu thị tài nguyên, HTTP method biểu thị thao tác |
| Dùng dạng số nhiều | `/user` | `/users` | Thống nhất phong cách số nhiều |
| Chữ thường + dấu gạch ngang | `/UserProfiles` | `/user-profiles` | URL phân biệt chữ hoa chữ thường |
| Tránh phân cấp quá sâu | `/a/b/c/d/e` | `/a/b/c` | Tối đa 3 cấp |
| Lọc dùng query parameter | `/products/phone/5000` | `/products?cat=phone` | Điều kiện lọc dùng tham số `?` |

::: tip 💡 URL phân biệt chữ hoa chữ thường
Thống nhất dùng chữ thường + dấu gạch ngang (-) là cách an toàn nhất, tránh vấn đề lộn xộn chữ hoa chữ thường và phong cách dấu gạch dưới không nhất quán.
:::

### 3.3 Lựa chọn HTTP method

| Method | Mục đích | Tính lũy đẳng | Tính an toàn | Tình huống điển hình |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | Lấy tài nguyên | Có | Có | Truy vấn danh sách, xem chi tiết |
| **POST** | Tạo tài nguyên | Không | Không | Thêm người dùng, gửi đơn hàng |
| **PUT** | Cập nhật toàn bộ | Có | Không | Thay thế toàn bộ hồ sơ người dùng |
| **PATCH** | Cập nhật một phần | Không | Không | Chỉ sửa nickname |
| **DELETE** | Xóa tài nguyên | Có | Không | Xóa người dùng, hủy đơn hàng |

::: tip 💡 Tính lũy đẳng là gì?
**Tính lũy đẳng**: thực hiện nhiều lần cho kết quả giống nhau.

- **Thao tác lũy đẳng** (GET/PUT/DELETE): nhấn 10 lần và nhấn 1 lần, kết quả như nhau
- **Thao tác không lũy đẳng** (POST): nhấn 10 lần, có thể tạo ra 10 đơn hàng

**Giải pháp**: Thao tác POST dùng unique ID để kiểm tra, tránh xử lý trùng lặp.
:::

---

## 4. Status code: để lỗi biết nói

HTTP status code là cách chuẩn để server nói cho client biết "chuyện gì đã xảy ra".

### 4.1 Phân loại status code

| Phân loại | Ý nghĩa | Status code điển hình |
| :--- | :--- | :--- |
| **2xx** | Thành công | 200 OK, 201 Created, 204 No Content |
| **3xx** | Chuyển hướng | 301 Moved Permanently, 304 Not Modified |
| **4xx** | Lỗi phía client | 400 Bad Request, 401 Unauthorized, 404 Not Found |
| **5xx** | Lỗi phía server | 500 Internal Server Error, 503 Service Unavailable |

### 4.2 Demo các status code thường dùng

👇 **Thử ngay**: nhấn nút bên dưới, tìm hiểu ý nghĩa của các status code phổ biến:

<StatusCodeDemo />

---

## 5. Xử lý lỗi: "từ chối" một cách thanh lịch

Xử lý lỗi tốt giúp client "nhìn status code là biết chuyện gì xảy ra", thay vì phải đoán.

### 5.1 "Hướng dẫn tránh hố" trong xử lý lỗi

**Hố 1: Mọi lỗi đều trả về 200**

```json
// ❌ Cách làm sai
HTTP/1.1 200 OK
{ "error": "Đã xảy ra lỗi" }
```

Vấn đề: tầng cache sẽ cache response "thành công" này, hệ thống giám sát không phát hiện được vấn đề.

**Hố 2: Thông báo lỗi quá chung chung**

```json
// ❌ Cách làm sai
HTTP/1.1 400 Bad Request
{ "message": "Lỗi tham số" }
```

Vấn đề: client không biết tham số nào bị lỗi, tại sao lỗi.

**Hố 3: Lộ thông tin nhạy cảm**

```json
// ❌ Cách làm nguy hiểm
HTTP/1.1 500 Internal Server Error
{ "stack": "at UserService.login...", "sql": "SELECT * FROM..." }
```

Nguy hiểm: lộ cấu trúc code, truy vấn database, kẻ tấn công có thể lợi dụng thông tin này.

### 5.2 Demo xử lý lỗi đúng cách

👇 **Thử ngay**: so sánh thiết kế response lỗi "tốt" và "kém":

<ErrorHandlingDemo />

---

## 6. Versioning: "tương thích ngược" của API

### 6.1 Tại sao cần versioning?

Tình huống: App của bạn có 1 triệu người dùng, cần sửa API đơn hàng.

**Nếu không dùng versioning**:
- App mới gọi API mới -> bình thường
- App cũ gọi API mới -> thiếu field, crash!

**Cách làm đúng**:
- `/v1/orders` - API cũ, tiếp tục phục vụ App cũ
- `/v2/orders` - API mới, chức năng mới ở đây

### 6.2 Chiến lược versioning

| Chiến lược | Ví dụ | Ưu điểm | Nhược điểm |
| :--- | :--- | :--- | :--- |
| **URL path** | `/v1/users` | Trực quan, dễ cache | URL dài hơn |
| **Request header** | `Accept: vnd.api.v2+json` | URL sạch | Không tiện debug |
| **Query parameter** | `/users?version=2` | Đơn giản | Không đủ chuẩn |

### 6.3 Ví dụ tiến hóa phiên bản

Lấy API người dùng làm ví dụ, thể hiện sự tiến hóa từ v1 đến v2:

| API | v1 (cũ) | v2 (mới) | Thay đổi |
| :--- | :--- | :--- | :--- |
| **Lấy người dùng** | `GET /v1/users`<br>Trả về: `name, email` | `GET /v2/users`<br>Trả về: `name, email, avatar, phone` | Thêm field avatar, số điện thoại |
| **Tạo đơn hàng** | `POST /v1/orders`<br>Nhận: `items[]` | `POST /v2/orders`<br>Nhận: `items[], coupons[]` | Thêm hỗ trợ mã giảm giá |
| **Thao tác batch** | Không có | `POST /v2/orders/batch` | Thêm API tạo batch |

::: tip 💡 Best practice cho versioning
- **Duy trì tương thích ngược**: API v1 ít nhất duy trì 6-12 tháng, cho client thời gian nâng cấp
- **Đồng bộ tài liệu**: mỗi phiên bản có tài liệu API riêng
- **Thông báo ngừng hỗ trợ**: thông báo trước khi v1 sẽ ngừng hoạt động, hướng dẫn migrate
- **Giám sát mức sử dụng**: thống kê lượng gọi v1, xác nhận có thể dừng an toàn rồi mới tắt
:::

---

## 7. Thiết kế cấu trúc response

Cấu trúc response là "hợp đồng dữ liệu" giữa frontend và backend, định dạng thống nhất giúp giảm đáng kể chi phí giao tiếp.

<ResponseStructureDemo />

### 7.1 Tham khảo thực tiễn từ các công ty lớn

::: details Google API Design Guide
Tham khảo [Google API Design Guide](https://cloud.google.com/apis/design/errors), Google yêu cầu tất cả API error response phải chứa cấu trúc message `google.rpc.Status`:

```json
{
  "error": {
    "code": 429,
    "message": "Không đủ tài nguyên, vui lòng thử lại sau",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.ErrorInfo",
        "reason": "RESOURCE_AVAILABILITY",
        "domain": "compute.googleapis.com",
        "metadata": {
          "zone": "us-east1-a",
          "service": "compute"
        }
      }
    ]
  }
}
```

**Yêu cầu cốt lõi**:
- Phải chứa `ErrorInfo` cung cấp định danh lỗi máy đọc được
- `message` hướng đến developer, dùng ngôn ngữ ngắn gọn mô tả vấn đề và giải pháp
- Mảng `details` có thể chứa `LocalizedMessage` (tin nhắn địa phương hóa), `Help` (link trợ giúp), v.v.
:::

::: details Microsoft REST API Guidelines
Tham khảo [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md), Microsoft nhấn mạnh tính nhất quán của response:

**Phân loại lỗi và sự cố**:
- **Error (Lỗi)**: client gửi dữ liệu không hợp lệ, trả về 4xx, không ảnh hưởng đến tính khả dụng của API
- **Fault (Sự cố)**: server không thể phản hồi đúng request hợp lệ, trả về 5xx, ảnh hưởng đến tính khả dụng của API

**Quy chuẩn response header**:
- `Date`: phải trả về, dùng định dạng RFC 5322 (múi giờ GMT)
- `Content-Type`: phải trả về
- `ETag`: tài nguyên hỗ trợ optimistic concurrency control phải trả về
:::

::: details Alibaba Java Development Manual
Tham khảo [Alibaba Java Development Manual](https://developer.aliyun.com/special/tech-java), Alibaba có quy chuẩn sau cho API response:

**Đối tượng trả về thống nhất**:
```java
public class Result<T> {
    private Integer code;
    private String message;
    private T data;
    private String requestId;
}
```

**Thiết kế phân đoạn error code**:
| Phạm vi | Loại | Ví dụ |
| :--- | :--- | :--- |
| 0 | Thành công | 0 |
| 1xxxx | Lỗi tham số | 10001 thiếu tham số bắt buộc |
| 2xxxx | Lỗi nghiệp vụ | 20001 số dư không đủ |
| 3xxxx | Lỗi xác thực | 30001 chưa đăng nhập |
| 5xxxx | Lỗi hệ thống | 50001 database bất thường |
:::

::: details Stripe API Response Design
Tham khảo [Stripe API Documentation](https://docs.stripe.com/api/errors), thiết kế error response của Stripe rất tinh tế:

```json
{
  "error": {
    "type": "card_error",
    "code": "card_declined",
    "message": "Thẻ của bạn đã bị từ chối.",
    "param": "number",
    "decline_code": "insufficient_funds",
    "doc_url": "https://stripe.com/docs/error-codes/card-declined"
  }
}
```

**Điểm sáng trong thiết kế**:
- `type` phân biệt loại lỗi: `api_error`, `card_error`, `invalid_request_error`
- `param` chỉ ra tham số cụ thể nào bị lỗi, frontend có thể định vị trực tiếp field form
- `doc_url` cung cấp link tài liệu, developer có thể tìm hiểu sâu hơn
- `decline_code` cung cấp nguyên nhân lỗi chi tiết hơn
:::

::: details JSON:API Specification
Tham khảo [JSON:API Specification](https://jsonapi.org/format/), đây là quy chuẩn JSON API response được ngành công nghiệp áp dụng rộng rãi:

```json
{
  "data": {
    "type": "articles",
    "id": "1",
    "attributes": {
      "title": "JSON:API Specification chi tiết"
    },
    "relationships": {
      "author": {
        "data": { "type": "users", "id": "9" }
      }
    }
  },
  "included": [
    {
      "type": "users",
      "id": "9",
      "attributes": {
        "name": "Nguyễn Văn A"
      }
    }
  ]
}
```

**Thiết kế cốt lõi**:
- `data` chứa tài nguyên chính, phải có `type` và `id`
- `attributes` chứa thuộc tính tài nguyên
- `relationships` mô tả liên kết tài nguyên
- `included` tránh request trùng lặp, trả về dữ liệu liên kết một lần
:::

::: details GitHub REST API Response Design
Tham khảo [GitHub REST API Documentation](https://docs.github.com/en/rest), thiết kế response của GitHub chú trọng trải nghiệm developer:

**Response thành công**:
```json
{
  "id": 1296269,
  "node_id": "MDEwOlJlcG9zaXRvcnkxMjk2MjY5",
  "name": "Hello-World",
  "full_name": "octocat/Hello-World",
  "owner": {
    "login": "octocat",
    "id": 1,
    "avatar_url": "https://github.com/images/error/octocat_happy.gif"
  },
  "private": false,
  "html_url": "https://github.com/octocat/Hello-World"
}
```

**Error response**:
```json
{
  "message": "Bad credentials",
  "documentation_url": "https://docs.github.com/rest"
}
```

**Điểm sáng trong thiết kế**:
- Response chứa nhiều định dạng URL (`html_url`, `url`) tiện cho các tình huống khác nhau
- Error response chứa `documentation_url` trỏ đến tài liệu
- Sử dụng `Link` response header để thực hiện phân trang
:::

::: details Twitter/X API v2 Response Design
Tham khảo [Twitter API v2 Documentation](https://developer.twitter.com/en/docs/twitter-api), Twitter API v2 áp dụng định dạng response ngắn gọn:

```json
{
  "data": {
    "id": "1460323737035677698",
    "text": "Hello, Twitter!"
  },
  "includes": {
    "users": [
      {
        "id": "2244994945",
        "name": "Twitter Dev",
        "username": "TwitterDev"
      }
    ]
  }
}
```

**Điểm sáng trong thiết kế**:
- `data` chứa dữ liệu chính, `includes` chứa dữ liệu liên kết (tương tự JSON:API)
- Hỗ trợ chọn field: `?tweet.fields=created_at,public_metrics`
- Phân trang dùng `next_token` và `previous_token`
:::

### 7.2 Tổng kết best practice

Tổng hợp các quy chuẩn trên, thiết kế cấu trúc response nên tuân theo các nguyên tắc sau:

1. **Ưu tiên tính nhất quán**: tất cả API dùng cùng cấu trúc response, frontend có thể đóng gói tầng request thống nhất
2. **Máy đọc được**: error code + error reason để chương trình có thể tự động xử lý
3. **Con người thân thiện**: message mô tả rõ ràng, bao gồm gợi ý giải quyết
4. **Có thể truy vết**: request_id xuyên suốt toàn bộ chuỗi request, tiện định vị vấn đề
5. **Hỗ trợ quốc tế hóa**: mở rộng tin nhắn địa phương hóa qua details

### 7.3 Quy chuẩn thiết kế field data

`data` là trung tâm của response, thiết kế của nó ảnh hưởng trực tiếp đến hiệu suất phát triển frontend.

<DataFieldDesignDemo />

### 7.4 Thiết kế error response nâng cao

<ErrorResponseDesignDemo />

::: tip Link tham khảo
- [Google API Design Guide - Errors](https://cloud.google.com/apis/design/errors)
- [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines)
- [Alibaba Java Development Manual](https://developer.aliyun.com/special/tech-java)
- [Heroku HTTP API Design Guide](https://github.com/interagent/http-api-design)
- [Stripe API - Errors](https://docs.stripe.com/api/errors)
- [JSON:API Specification](https://jsonapi.org/format/)
:::

---

## 8. Thực chiến: ví dụ thiết kế API hệ thống thương mại điện tử

```
# Module người dùng
GET    /v1/users                    # Lấy danh sách người dùng
POST   /v1/users                    # Tạo người dùng mới
GET    /v1/users/{id}               # Lấy chi tiết người dùng
PUT    /v1/users/{id}               # Cập nhật toàn bộ người dùng
PATCH  /v1/users/{id}               # Cập nhật một phần người dùng
DELETE /v1/users/{id}               # Xóa người dùng

# Module đơn hàng
GET    /v1/users/{id}/orders        # Lấy đơn hàng của người dùng
POST   /v1/orders                   # Tạo đơn hàng
GET    /v1/orders/{id}              # Lấy chi tiết đơn hàng
PATCH  /v1/orders/{id}/status       # Cập nhật trạng thái đơn hàng

# Module sản phẩm (lọc phức tạp dùng query parameter)
GET    /v1/products?category=phone&price_max=5000&sort=price_desc&page=1
```

---

## 9. Dùng AI hỗ trợ thiết kế API

AI có thể giúp bạn nhanh chóng tạo ra thiết kế API tuân thủ quy chuẩn. Mấu chốt là cung cấp ngữ cảnh và ràng buộc rõ ràng.

### 9.1 Template prompt

```
Bạn là một backend architect kỳ cựu, tinh thông thiết kế RESTful API. Hãy giúp tôi thiết kế một bộ API.

## Bối cảnh nghiệp vụ
[Mô tả tình huống nghiệp vụ của bạn, ví dụ: hệ thống thương mại điện tử, nền tảng blog, quản lý task, v.v.]

## Yêu cầu chức năng
[Liệt kê các module chức năng cần thiết, ví dụ:
- Quản lý người dùng: đăng ký, đăng nhập, thông tin cá nhân
- Quản lý đơn hàng: tạo đơn, tra cứu đơn, hủy đơn
- Quản lý sản phẩm: danh sách sản phẩm, chi tiết sản phẩm, tìm kiếm]

## Yêu cầu thiết kế
1. Tuân thủ quy chuẩn RESTful
2. URL dùng danh từ số nhiều, chữ thường + dấu gạch ngang
3. Sử dụng đúng HTTP method (GET/POST/PUT/PATCH/DELETE)
4. Định dạng response thống nhất: { code, message, data, request_id }
5. Sử dụng status code hợp lý
6. Versioning: dùng URL path (/v1/)

## Định dạng đầu ra
Vui lòng xuất theo định dạng sau:

### Danh sách API
| Method | URL | Mô tả | Request Body | Response Body |
|--------|-----|-------|--------------|---------------|

### Ví dụ request/response
[Ví dụ chi tiết cho các API quan trọng]

### Giải thích status code
[Status code được sử dụng và ý nghĩa]
```

### 9.2 Ví dụ thực chiến: API đơn hàng thương mại điện tử

**Prompt đầu vào:**

```
Bạn là một backend architect kỳ cựu, tinh thông thiết kế RESTful API. Hãy giúp tôi thiết kế một bộ API cho hệ thống đơn hàng thương mại điện tử.

## Bối cảnh nghiệp vụ
Một nền tảng thương mại điện tử B2C, người dùng có thể duyệt sản phẩm, đặt hàng, xem trạng thái đơn hàng.

## Yêu cầu chức năng
- Module đơn hàng: tạo đơn, tra cứu danh sách đơn, tra cứu chi tiết đơn, hủy đơn, thanh toán đơn
- Module giỏ hàng: thêm sản phẩm, sửa số lượng, xóa sản phẩm, xem giỏ hàng

## Yêu cầu thiết kế
1. Tuân thủ quy chuẩn RESTful
2. URL dùng danh từ số nhiều, chữ thường + dấu gạch ngang
3. Sử dụng đúng HTTP method
4. Định dạng response thống nhất
5. Versioning: /v1/
```

**Ví dụ đầu ra của AI:**

| Method | URL | Mô tả |
| :--- | :--- | :--- |
| `POST` | `/v1/orders` | Tạo đơn hàng |
| `GET` | `/v1/orders` | Tra cứu danh sách đơn hàng |
| `GET` | `/v1/orders/{id}` | Tra cứu chi tiết đơn hàng |
| `PATCH` | `/v1/orders/{id}/status` | Cập nhật trạng thái đơn hàng (hủy/thanh toán) |
| `GET` | `/v1/users/{id}/cart` | Lấy giỏ hàng |
| `POST` | `/v1/users/{id}/cart/items` | Thêm sản phẩm vào giỏ hàng |
| `PATCH` | `/v1/users/{id}/cart/items/{itemId}` | Sửa số lượng sản phẩm trong giỏ |
| `DELETE` | `/v1/users/{id}/cart/items/{itemId}` | Xóa sản phẩm khỏi giỏ hàng |

### 9.3 Lưu ý khi dùng AI hỗ trợ thiết kế

| Lưu ý | Giải thích |
| :--- | :--- |
| **Cung cấp ngữ cảnh đầy đủ** | Bối cảnh nghiệp vụ, vai trò người dùng, quan hệ dữ liệu đều phải nói rõ |
| **Xác định rõ ràng buộc** | Quy tắc đặt tên, chiến lược phiên bản, định dạng response cần được định nghĩa trước |
| **Tối ưu lặp** | Lần đầu ra có thể chưa hoàn hảo, hỏi thêm chi tiết, yêu cầu sửa |
| **Kiểm tra thủ công** | Nội dung AI tạo ra cần được kiểm tra thủ công xem có phù hợp nhu cầu nghiệp vụ không |
| **Bổ sung tình huống biên** | Để AI xem xét xử lý lỗi, kiểm soát quyền, phân trang, v.v. |

::: tip 💡 Kỹ thuật hỏi thêm
- "Hãy bổ sung ví dụ error response cho từng API"
- "Hãy xem xét tham số phân trang, sắp xếp, lọc"
- "Hãy thêm giải thích kiểm soát quyền cho API"
- "Hãy kiểm tra xem có tuân thủ best practice RESTful không"
:::

---

## Bảng tra cứu thuật ngữ

| Thuật ngữ | Tiếng Anh | Giải thích |
| :--- | :--- | :--- |
| **API** | Application Programming Interface | Quy ước đối thoại giữa các chương trình |
| **REST** | Representational State Transfer | Một phong cách kiến trúc, dùng URL định danh tài nguyên |
| **Tài nguyên** | Resource | Khái niệm cốt lõi của kiến trúc REST, có định danh duy nhất (URL) |
| **Tính lũy đẳng** | Idempotency | Thực hiện nhiều lần cho kết quả giống nhau |
| **Status Code** | Status Code | Trạng thái response được định nghĩa bởi giao thức HTTP |
| **Versioning** | Versioning | Cho phép API cũ và mới cùng tồn tại, nâng cấp mượt mà |
| **Request Body** | Request Body | Dữ liệu đi kèm trong request POST/PUT/PATCH |
| **Response Body** | Response Body | Dữ liệu server trả về |
| **Header** | Header | Metadata của request/response (như Content-Type) |
| **Xác thực** | Authentication | Xác minh "bạn là ai" (đăng nhập, Token) |
| **Ủy quyền** | Authorization | Xác minh "bạn có thể làm gì" (quyền hạn) |
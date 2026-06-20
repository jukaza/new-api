# API nhập môn: hiểu "đối thoại giữa các chương trình" từ con số 0

::: tip 🎯 Câu hỏi cốt lõi
**API là gì?** Câu hỏi này giống như: làm sao để thiết kế thực đơn nhà hàng để khách nhìn là hiểu ngay? Làm sao để nhân viên ghi order không bị sai? API giải quyết chính là vấn đề "làm thế nào để các chương trình đối thoại với nhau". Bạn đã dùng API từ ngày đầu tiên viết code, chỉ là bạn có thể chưa nhận ra.
:::

---

## 0. Ba bối rối thường gặp của người mới

**Bối rối 1: API có phải là thứ quá cao siêu không?**

Nhiều người vừa nghe đến API đã nghĩ đó là khái niệm chỉ kỹ sư cao cấp mới hiểu. Thực ra bạn đã dùng API từ lâu rồi:

```python
len("hello")        # Đây chính là API do Python cung cấp
open("file.txt")    # Đây cũng là API
requests.get(url)   # Đây vẫn là API
```

**Bối rối 2: Web API khác API thông thường thế nào?**

| Loại | Đối tượng gọi | Phương thức giao tiếp | Tình huống điển hình |
| :--- | :--- | :--- | :--- |
| **Hàm API** | Code cục bộ | Gọi hàm | `len()`, `open()` |
| **API hệ điều hành** | Hệ điều hành | System call | Đọc ghi file, tạo process |
| **Web API** | Server từ xa | HTTP request | Gọi mô hình AI, lấy thời tiết |

**Bối rối 3: Tôi nên dùng HTTP hay SDK?**

```python
# Cách HTTP: tự xử lý mọi chi tiết
import requests
response = requests.post(
    "https://api.deepseek.com/v1/chat/completions",
    headers={"Authorization": "Bearer sk-xxx"},
    json={"model": "deepseek-chat", "messages": [...]}
)
result = response.json()["choices"][0]["message"]["content"]

# Cách SDK: quản gia giúp bạn xử lý
from openai import OpenAI
client = OpenAI(api_key="sk-xxx")
response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[...]
)
result = response.choices[0].message.content
```

---

## 1. Bản chất của API: phích cắm và ổ cắm

**API** (Application Programming Interface, giao diện lập trình ứng dụng) chính là "quy ước đối thoại giữa các chương trình".

### 1.1 Liên tưởng với thiết bị điện

| Khái niệm | Liên tưởng thiết bị điện | Tương ứng API |
| :--- | :--- | :--- |
| **Interface** | Hình dạng ổ cắm | Function signature / URL |
| **Đầu vào** | Dòng điện đầu vào | Tham số hàm / Request body |
| **Đầu ra** | Thiết bị hoạt động | Giá trị trả về / Response body |

### 1.2 So sánh ba hình thái API

<ApiTypesComparison />

### 1.3 Sự khác biệt giữa Function API và HTTP API

Nhiều người mới bối rối: Function API và HTTP API khác nhau thế nào? Khi đọc tài liệu làm sao để phân biệt?

<ApiFunctionVsHttp />

### 1.4 Cách đọc các loại tài liệu API khác nhau

Đối với các loại tài liệu API khác nhau, trọng tâm chú ý cũng khác nhau:

<DocumentTypesComparison />

---

## 2. Một lần gọi API hoàn chỉnh

👇 **Thử ngay**: nhấn nút bên dưới, quan sát quy trình request-response hoàn chỉnh của một API:

<ApiRequestDemo />

### 2.1 Bốn giai đoạn của một lần gọi API

| Giai đoạn | Điều gì xảy ra | Liên tưởng thiết bị điện |
| :--- | :--- | :--- |
| **Request** | Client gửi request đến server | Nhấn công tắc |
| **Truyền tải** | Request truyền qua mạng đến server | Dòng điện qua dây dẫn |
| **Xử lý** | Server xử lý request và trả về dữ liệu | Thiết bị bắt đầu hoạt động |
| **Response** | Client nhận và xử lý kết quả trả về | Bóng đèn phát sáng |

### 2.2 Liên tưởng nhà hàng

| Vai trò nhà hàng | Tương ứng API | Giải thích |
| :--- | :--- | :--- |
| **Thực đơn** | Tài liệu API | Cho bạn biết có những "món" nào có thể gọi |
| **Nhân viên phục vụ** | Giao thức HTTP | "Cách thức đối thoại" được chuẩn hóa |
| **Nhà bếp** | Server | Xử lý request theo "đơn hàng" |
| **Dọn món** | Response | Trả kết quả về cho "khách" |

---

## 3. HTTP method: bạn đang "hỏi" hay đang "làm"?

Khi gọi Web API, bạn cần nói cho server biết bạn muốn làm gì. Đây chính là nguồn gốc của HTTP method.

### 3.1 Hiểu qua việc gọi món ở nhà hàng

| Tình huống | Thực tế bạn sẽ nói gì? | HTTP method tương ứng |
| :--- | :--- | :--- |
| Bạn muốn biết hôm nay có món gì | "Em ơi, cho anh xem thực đơn" | **GET** - chỉ "hỏi", không sửa dữ liệu |
| Bạn muốn gọi một phần cơm gà | "Cho tôi một phần cơm gà" | **POST** - "làm" việc gì đó, tạo dữ liệu |
| Bạn muốn đổi món | "Đổi cơm gà thành cơm sườn" | **PUT** - thay thế dữ liệu |
| Bạn muốn đổi khẩu vị | "Cơm gà đừng bỏ lạc" | **PATCH** - sửa một phần |
| Bạn không muốn nữa | "Thôi, bỏ món đó đi" | **DELETE** - xóa dữ liệu |

<HttpMethodsDemo />

::: warning Về tính lũy đẳng
**Tính lũy đẳng**: thực hiện nhiều lần kết quả có giống nhau không?

- **Thao tác lũy đẳng** (GET/PUT/DELETE): nhấn 10 lần và nhấn 1 lần, kết quả như nhau
- **Thao tác không lũy đẳng** (POST): nhấn 10 lần, có thể tạo ra 10 đơn hàng

**Giải pháp**: thao tác POST dùng unique ID để kiểm tra, tránh xử lý trùng lặp.
:::

### 3.2 Bảng tra cứu nhanh HTTP method

| Method | Mục đích | Tính lũy đẳng | Tính an toàn | Tình huống điển hình |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | Lấy tài nguyên | Có | Có | Truy vấn danh sách, xem chi tiết |
| **POST** | Tạo tài nguyên | Không | Không | Thêm người dùng, gửi đơn hàng |
| **PUT** | Cập nhật toàn bộ | Có | Không | Thay thế toàn bộ hồ sơ người dùng |
| **PATCH** | Cập nhật một phần | Không | Không | Chỉ sửa nickname |
| **DELETE** | Xóa tài nguyên | Có | Không | Xóa người dùng, hủy đơn hàng |

---

## 4. HTTP status code: server đang nói với bạn điều gì?

Khi server trả lời, nó sẽ trả về một status code trước, cho bạn biết request có thành công hay không.

### 4.1 Phân loại status code

<StatusCodeCategories />

### 4.2 Giải thích chi tiết các status code phổ biến

| Status code | Ý nghĩa | Tình huống điển hình | Client xử lý |
| :--- | :--- | :--- | :--- |
| **200 OK** | Thành công | Request xử lý bình thường | Hiển thị dữ liệu |
| **201 Created** | Tạo thành công | POST request tạo tài nguyên thành công | Chuyển đến tài nguyên mới |
| **400 Bad Request** | Định dạng request sai | Thiếu tham số hoặc sai định dạng | Kiểm tra tham số |
| **401 Unauthorized** | Chưa xác thực | Không cung cấp API Key hợp lệ | Hướng dẫn người dùng đăng nhập |
| **403 Forbidden** | Không có quyền | API Key không có quyền truy cập tài nguyên đó | Thông báo không đủ quyền |
| **404 Not Found** | Không tồn tại | Địa chỉ hoặc tài nguyên request không tồn tại | Kiểm tra URL |
| **429 Too Many Requests** | Request quá nhiều | Vượt quá giới hạn tốc độ | Thử lại sau |
| **500 Internal Server Error** | Lỗi server | Phía server gặp vấn đề | Nhắc người dùng thử lại sau |

👇 **Thử ngay**: nhấn nút bên dưới, tìm hiểu ý nghĩa của các status code phổ biến:

<StatusCodeDemo />

---

## 5. HTTP vs SDK: tự chạy việc hay để quản gia làm thay?

### 5.1 So sánh hai cách gọi

| | 🏃 **HTTP API** | 🤵 **SDK** |
| :--- | :--- | :--- |
| **Ẩn dụ** | Tự chạy việc | Quản gia làm thay |
| **Ưu điểm** | Tất cả ngôn ngữ đều dùng được<br>Kiểm soát hoàn toàn chi tiết request<br>Không cần thêm dependency | Code ngắn gọn dễ đọc<br>Tự động xử lý xác thực<br>Tích hợp sẵn retry khi lỗi |
| **Nhược điểm** | Phải xử lý mọi chi tiết<br>Code dài dễ sai | Cần cài dependency<br>Có thể có vấn đề phiên bản |
| **Ví dụ code** | `requests.post(url, json=..., headers={...})` | `client.chat.completions.create(...)` |

### 5.2 Chọn thế nào?

| Tình huống | Khuyến nghị | Lý do |
| :--- | :--- | :--- |
| **Phát triển nhanh** | SDK | Tự động xử lý xác thực, lỗi, retry |
| **Học nguyên lý** | HTTP | Hiểu cơ chế tầng dưới |
| **Ngôn ngữ không được hỗ trợ** | HTTP | Ngôn ngữ nào cũng dùng được |
| **Cần tùy chỉnh** | HTTP | Linh hoạt kiểm soát từng chi tiết |

::: tip 💡 Gợi ý
**Dùng được SDK thì cứ dùng SDK**, để việc phiền phức cho thư viện, để thời gian cho chính mình.
:::

---

## 6. Cách đọc tài liệu API?

Tài liệu API giống như sự kết hợp giữa hướng dẫn sử dụng và thực đơn. Bạn không cần đọc từ đầu đến cuối, chỉ cần học cách "tra từ điển".

### 6.1 Checklist đọc tài liệu

Mở bất kỳ tài liệu API nào (ví dụ OpenAI hoặc DeepSeek), bạn chỉ cần tìm mấy thứ sau:

<ApiDocumentDemo />

| Mục | Giải thích | Ví dụ |
| :--- | :--- | :--- |
| **Base URL** | Địa chỉ gốc của API | `https://api.deepseek.com` |
| **Authentication** | Cách chứng minh danh tính | `Authorization: Bearer sk-xxx` |
| **Endpoints** | Danh sách interface cụ thể | `/v1/chat/completions` |
| **Parameters** | Tham số bắt buộc/tùy chọn | `model` (bắt buộc), `temperature` (tùy chọn) |
| **Response** | Cấu trúc dữ liệu trả về | `{"choices": [...]}` |

### 6.2 Các bước đọc tài liệu

1. **Tìm Base URL** - đây là tiền tố của tất cả request
2. **Hiểu cách xác thực** - API Key đặt trong Header hay Query?
3. **Tìm Endpoint cần dùng** - interface cụ thể bạn muốn gọi
4. **Xem tham số request** - cái nào bắt buộc? cái nào tùy chọn?
5. **Hiểu định dạng trả về** - dữ liệu được tổ chức thế nào?

---

## 7. Thực hành: mô phỏng gọi API

Trăm nghe không bằng một thấy. Đây có một API mô phỏng, bạn có thể thoải mái điền tham số, sửa địa chỉ, xem điều gì xảy ra.

<ApiPlayground />

Thử kích hoạt các tình huống sau:
- ✅ **Request thành công**: điền đúng Endpoint và API Key
- ❌ **Lỗi 401**: không điền API Key, xem server từ chối bạn thế nào
- ❌ **Lỗi 404**: điền một địa chỉ không tồn tại

---

## 8. Tổng kết

::: info Điểm cốt lõi
1. **API chính là ống nói**, giúp bạn truyền lời đến một đoạn code khác hoặc server từ xa
2. **Bạn đã dùng API từ lâu rồi**, từ `len()` đến `open()` đều là API
3. **Web API là siêu năng lực**, cho phép bạn gọi siêu máy tính từ xa ngàn dặm
4. **SDK là quản gia tốt**, dùng được SDK thì đừng tự chạy việc
5. **Đọc tài liệu tìm ba thứ**: địa chỉ, xác thực, tham số
:::

Trong thời đại lập trình AI, bạn chỉ cần nhớ những khái niệm cốt lõi này. Những chi tiết còn lại, IDE và AI助手 sẽ giúp bạn xử lý.

---

## Bảng tra cứu thuật ngữ

| Thuật ngữ | Tên đầy đủ | Giải thích |
| :--- | :--- | :--- |
| **API** | Application Programming Interface | Giao diện lập trình ứng dụng, định nghĩa cách các phần mềm tương tác |
| **Web API** | - | API dựa trên giao thức HTTP, dùng cho giao tiếp mạng |
| **Endpoint** | - | Điểm cuối, địa chỉ cụ thể của API |
| **HTTP** | HyperText Transfer Protocol | Giao thức truyền thông cho Web API |
| **GET** | - | Phương thức lấy tài nguyên |
| **POST** | - | Phương thức gửi dữ liệu |
| **SDK** | Software Development Kit | Bộ công cụ phát triển phần mềm, đóng gói API call tầng dưới |
| **URL** | Uniform Resource Locator | Địa chỉ mạng của API |
| **JSON** | JavaScript Object Notation | Định dạng dữ liệu phổ biến |
| **Authentication** | - | Quá trình xác minh danh tính |
| **Status Code** | - | Mã trạng thái trong HTTP response |
| **Request** | - | Yêu cầu |
| **Response** | - | Phản hồi |
| **Header** | - | HTTP header, chứa meta information |
| **Payload** | - | Dữ liệu thực tế của request hoặc response |
| **Rate Limit** | - | Giới hạn tốc độ |
| **Idempotent** | - | Lũy đẳng, thực hiện nhiều lần cho kết quả giống nhau |
| **REST** | Representational State Transfer | Một phong cách kiến trúc API |
| **RPC** | Remote Procedure Call | Gọi thủ tục từ xa |
| **GraphQL** | - | Một loại ngôn ngữ truy vấn API |
| **gRPC** | - | Framework RPC hiệu suất cao do Google phát triển |
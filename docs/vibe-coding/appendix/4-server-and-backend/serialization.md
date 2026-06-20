# Serialization: "Phiên dịch" dữ liệu

::: tip 🎯 Câu hỏi cốt lõi
**Dữ liệu được truyền qua mạng như thế nào?** Điều này giống như câu hỏi: làm sao để một người nói ra điều gì đó và người khác có thể hiểu được? Serialization giải quyết chính vấn đề "phiên dịch dữ liệu" — chuyển đổi đối tượng trong bộ nhớ thành định dạng có thể truyền tải được.
:::

---

## Sự cần thiết của Serialization dữ liệu

Trong quá trình tương tác giữa frontend và backend, dữ liệu cần trải qua nhiều lần "biến đổi" để có thể truyền từ máy chủ đến máy khách.

**Tình huống 1: Dữ liệu frontend nhận được đã "thay đổi"**

```javascript
// Backend gửi đi
Date birth = new Date(1990, 5, 15)

// Frontend nhận được
{ "birth": "1990-06-15T00:00:00Z" }  // Là chuỗi!
```

Frontend muốn dùng `.getFullYear()`, kết quả lại báo lỗi — vì đây không phải đối tượng Date, mà là chuỗi.

**Tình huống 2: Lỗi mã hóa tiếng Trung**

```json
// Mong đợi
{ "name": "张三" }

// Thực tế nhận được
{ "name": "å¼ ä¸" }
```

Vấn đề mã hóa ký tự khiến tiếng Trung hiển thị thành ký tự lỗi.

**Tình huống 3: Nút thắt hiệu suất**

```json
// Một response chứa danh sách 10000 sản phẩm
{
  "products": [
    { "id": 1, "name": "...", "description": "...", ... },
    // ... 9999 sản phẩm khác
  ]
}
// Kích thước: 5.2 MB, thời gian truyền: 3.5 giây
```

Sự dư thừa của định dạng JSON khiến gói dữ liệu quá lớn, ảnh hưởng nghiêm trọng đến hiệu suất.

---

**Serialization giống như "phiên dịch"** — "dịch" đối tượng trong bộ nhớ thành định dạng có thể truyền tải, bên nhận sẽ "dịch ngược" trở lại.

---

## 1. Serialization / Deserialization là gì?

**Serialization** (Tuần tự hóa) là quá trình chuyển đổi đối tượng thành định dạng có thể truyền tải.

**Deserialization** (Giải tuần tự hóa) là quá trình khôi phục định dạng truyền tải trở lại thành đối tượng.

### 1.1 So sánh với việc gửi bưu phẩm

| Gửi bưu phẩm | Serialization | Giải thích |
| :--- | :--- | :--- |
| Đóng gói hàng | Serialization | Cho hàng vào thùng, dán nhãn |
| Vận chuyển | Truyền qua mạng | Xe chuyển phát đến đích |
| Mở gói lấy hàng | Deserialization | Người nhận mở thùng, lấy hàng ra |

### 1.2 Tại sao cần Serialization?

| Lý do | Giải thích | Ví dụ |
| :--- | :--- | :--- |
| **Truyền qua mạng** | Mạng chỉ truyền được luồng byte | Gọi API, giao tiếp RPC |
| **Lưu trữ bền vững** | Ổ đĩa chỉ lưu được byte | Lưu đối tượng vào file, cơ sở dữ liệu |
| **Đa ngôn ngữ** | Cấu trúc dữ liệu các ngôn ngữ khác nhau | Đối tượng Java → Dictionary Python |
| **Cache phân tán** | Redis/Memcached lưu byte | Cache thông tin người dùng |

---

## 2. Các định dạng Serialization phổ biến

👇 **Hãy thử thực hành**: Nhấp vào nút bên dưới để quan sát quá trình serialization ở các ngôn ngữ khác nhau:

<SerializationDemo />

### 2.1 JSON: Phổ biến nhất

**Ưu điểm**:
- Khả năng đọc tốt, dễ debug
- Tất cả ngôn ngữ đều hỗ trợ
- Trình duyệt hỗ trợ gốc (`JSON.parse` / `JSON.stringify`)

**Nhược điểm**:
- Kích thước lớn (có nhiều ký tự `{}` `""`)
- Không hỗ trợ kiểu dữ liệu phong phú (Date, Map, Set sẽ bị chuyển thành chuỗi)

**Tình huống phù hợp**:
- API công khai
- Giao tiếp frontend-backend
- File cấu hình

### 2.2 XML: Từng là xu hướng chính

```xml
<?xml version="1.0" encoding="UTF-8"?>
<user>
  <id>123</id>
  <name>张三</name>
  <email>zhangsan@example.com</email>
  <age>28</age>
</user>
```

**Ưu điểm**:
- Cấu trúc rõ ràng, hỗ trợ comment
- Hỗ trợ cấu trúc lồng phức tạp
- Có Schema validation (XSD)

**Nhược điểm**:
- Kích thước lớn, phân tích chậm
- Thẻ dư thừa (`<open></close>`)

**Tình huống phù hợp**:
- File cấu hình (Spring, MyBatis)
- Giao thức SOAP
- Trao đổi dữ liệu phức tạp

### 2.3 Protobuf: Hiệu quả nhất

```protobuf
// user.proto
syntax = "proto3";
message User {
  int32 id = 1;
  string name = 2;
  string email = 3;
  int32 age = 4;
}
```

**Ưu điểm**:
- Kích thước nhỏ (nhỏ hơn JSON 30-50%)
- Tốc độ nhanh (phân tích nhanh hơn 5-10 lần)
- Tương thích ngược (thêm field mới không ảnh hưởng phiên bản cũ)

**Nhược điểm**:
- Không thể đọc được (định dạng nhị phân)
- Cần file .proto để định nghĩa
- Không hỗ trợ kiểu động

**Tình huống phù hợp**:
- Giao tiếp nội bộ microservice
- Tình huống hiệu suất cao (game, real-time communication)
- Ứng dụng di động (tiết kiệm băng thông)

### 2.4 MessagePack: Cân bằng giữa khả năng đọc và hiệu suất

```json
// MessagePack là phiên bản nhị phân của JSON
// Cùng dữ liệu, MessagePack nhỏ hơn JSON khoảng 30%
```

**Ưu điểm**:
- Nhỏ hơn JSON, nhanh hơn JSON
- Giữ nguyên mô hình dữ liệu của JSON
- Hỗ trợ tất cả kiểu JSON

**Nhược điểm**:
- Không thể đọc được
- Không hiệu quả bằng Protobuf

**Tình huống phù hợp**:
- Cần hiệu suất nhưng không muốn dùng Protobuf
- Redis cache
- WebSocket message

---

## 3. So sánh cách Serialization theo từng ngôn ngữ

| Ngôn ngữ | Thư viện JSON | Thư viện Protobuf | Thư viện XML |
| :--- | :--- | :--- | :--- |
| **JavaScript** | `JSON.stringify()` | `protobuf.js` | `fast-xml-parser` |
| **Python** | `json.dumps()` | `protobuf` | `xmltodict` |
| **Java** | `Jackson` / `Gson` | `protobuf-java` | `JAXB` |
| **Go** | `encoding/json` | `proto` | `encoding/xml` |
| **C++** | `nlohmann/json` | `protobuf` | `tinyxml2` |
| **C#** | `System.Text.Json` | `Google.Protobuf` | `System.Xml` |

::: tip 💡 Gợi ý lựa chọn
- **Giao tiếp frontend-backend**: JSON (dễ debug)
- **Nội bộ microservice**: Protobuf (hiệu suất tối ưu)
- **File cấu hình**: JSON hoặc YAML
- **Tích hợp hệ thống cũ**: XML (có thể không còn lựa chọn nào khác)
:::

---

## 4. So sánh hiệu suất

### 4.1 So sánh kích thước (lấy đối tượng người dùng làm ví dụ)

| Định dạng | Kích thước | So với JSON |
| :--- | :--- | :--- |
| JSON | 68 bytes | 100% |
| XML | 142 bytes | 209% |
| Protobuf | 38 bytes | 56% |
| MessagePack | 52 bytes | 76% |

### 4.2 So sánh tốc độ (serialize 10000 lần)

| Định dạng | Thời gian | So với JSON |
| :--- | :--- | :--- |
| JSON | 45 ms | 100% |
| XML | 120 ms | 267% |
| Protobuf | 8 ms | 18% |
| MessagePack | 28 ms | 62% |

::: tip 💡 Kết luận kiểm tra hiệu suất
- **Protobuf nhanh nhất**: phù hợp tình huống hiệu suất cao
- **MessagePack xếp thứ hai**: nhanh hơn JSON khoảng 40%
- **JSON chậm nhất**: nhưng đã đủ dùng cho hầu hết tình huống
:::

---

## 5. Các vấn đề thường gặp

### 5.1 Vấn đề Serialization Date

**Vấn đề**: Đối tượng Date sau khi serialize biến thành chuỗi

```javascript
// Trước khi serialize
const date = new Date('2024-01-01')

// Sau khi serialize
JSON.stringify(date)  // "2024-01-01T00:00:00.000Z"
```

**Giải pháp**:
```javascript
// Cách 1: Chuyển thành timestamp
{ createdAt: date.getTime() }  // 1704067200000

// Cách 2: Chuyển thành chuỗi ISO
{ createdAt: date.toISOString() }  // "2024-01-01T00:00:00.000Z"

// Cách 3: Tùy chỉnh serialization
JSON.stringify(obj, (key, value) => {
  if (value instanceof Date) {
    return { __type: 'Date', value: value.toISOString() }
  }
  return value
})
```

### 5.2 Vấn đề tham chiếu vòng

**Vấn đề**: Tham chiếu vòng trong đối tượng sẽ gây lỗi

```javascript
const obj = { name: 'test' }
obj.self = obj
JSON.stringify(obj)  // TypeError: Converting circular structure to JSON
```

**Giải pháp**:
```javascript
// Cách 1: Lọc bỏ tham chiếu vòng
const seen = new WeakSet()
JSON.stringify(obj, (key, value) => {
  if (typeof value === 'object' && value !== null) {
    if (seen.has(value)) return
    seen.add(value)
  }
  return value
})

// Cách 2: Sử dụng thư viện flatted
import { parse, stringify } from 'flatted'
stringify(obj)  // Tự động xử lý tham chiếu vòng
```

### 5.3 Vấn đề lỗi mã hóa ký tự

**Vấn đề**: Sau khi serialize, ký tự hiển thị lỗi

**Nguyên nhân**:
- Mã hóa ký tự không nhất quán (UTF-8 vs GBK)
- BOM marker

**Giải pháp**:
```python
# Python đảm bảo sử dụng UTF-8
import json
json.dumps(data, ensure_ascii=False)  # Không escape ký tự tiếng Trung
```

```javascript
// Node.js thiết lập response header
res.setHeader('Content-Type', 'application/json; charset=utf-8')
```

---

## 6. Thực chiến: Phương án Serialization cho hệ thống thương mại điện tử

### 6.1 Phân tích tình huống

| Tình huống | Lựa chọn định dạng | Lý do |
| :--- | :--- | :--- |
| **App → Backend API** | JSON | Dễ debug, frontend-backend thống nhất |
| **Backend → Backend RPC** | Protobuf | Hiệu suất tối ưu, tiết kiệm băng thông |
| **Cache lên Redis** | MessagePack | Nhỏ hơn JSON, có thể serialize đối tượng phức tạp |
| **Ghi log** | JSON | Tiện cho công cụ phân tích log xử lý |

### 6.2 Ví dụ code

```javascript
// API response (JSON)
app.get('/api/products/:id', async (req, res) => {
  const product = await db.getProduct(req.params.id)
  res.json({
    code: 0,
    data: product
  })
})

// Giao tiếp microservice (Protobuf)
// product.proto
syntax = "proto3";
message Product {
  int32 id = 1;
  string name = 2;
  int32 price = 3;
}

// Server
const proto = require('./product.proto')
const message = proto.Product.create(product)
const buffer = proto.Product.encode(message).finish()

// Client
const decoded = proto.Product.decode(buffer)

// Redis cache (MessagePack)
const msgpack = require('msgpack-lite')
await redis.set(
  `product:${id}`,
  msgpack.encode(product)
)
const cached = msgpack.decode(await redis.get(`product:${id}`))
```

---

## 7. Sử dụng AI để hỗ trợ chọn phương án Serialization

AI có thể giúp bạn chọn định dạng serialization phù hợp dựa trên tình huống.

### 7.1 Mẫu prompt

```
Bạn là một kiến trúc sư hệ thống cao cấp, thành thạo về công nghệ serialization dữ liệu. Hãy giúp tôi chọn phương án serialization phù hợp.

## Tình huống nghiệp vụ
[Mô tả tình huống của bạn, ví dụ: App thương mại điện tử, backend game, microservice, v.v.]

## Yêu cầu kỹ thuật
[Liệt kê các ràng buộc, ví dụ:
- Tách biệt frontend-backend (Vue + Node.js)
- Yêu cầu hiệu suất cao (QPS > 10000)
- Nhạy cảm về băng thông (ứng dụng di động, cần tiết kiệm lưu lượng)
- Cần đa ngôn ngữ (Java + Python + Go)]

## Đặc điểm dữ liệu
[Mô tả đặc điểm dữ liệu, ví dụ:
- Lượng dữ liệu lớn (mỗi response > 1MB)
- Cấu trúc phức tạp (nhiều lớp lồng)
- Chứa các kiểu đặc biệt như Date, dữ liệu nhị phân]

## Định dạng đầu ra
Vui lòng xuất theo định dạng sau:
1. Phương án đề xuất (JSON/Protobuf/MessagePack/XML)
2. Giải thích lý do
3. So sánh hiệu suất (ước tính kích thước và tốc độ)
4. Ví dụ code
```

### 7.2 Ví dụ thực tế

**Prompt đầu vào**:

```
Bạn là một kiến trúc sư hệ thống cao cấp. App thương mại điện tử của chúng tôi cần tối ưu hiệu suất API danh sách sản phẩm.

## Tình huống nghiệp vụ
- API danh sách sản phẩm của app thương mại điện tử
- Mỗi lần trả về 100 sản phẩm
- Mỗi sản phẩm chứa: id, name, price, image, description v.v. 20 trường
- Hiện đang dùng JSON, kích thước response khoảng 200KB, thời gian 800ms

## Yêu cầu kỹ thuật
- Frontend là Vue.js
- Backend là Node.js + Go microservice
- Cần cân bằng giữa hiệu suất và hiệu quả phát triển

## Mục tiêu tối ưu
- Giảm thời gian response xuống dưới 300ms
- Giảm kích thước gói dữ liệu 30%
```

**AI đầu ra**:

```
Phương án đề xuất: Phương án kết hợp

1. **Tầng API**: Tiếp tục dùng JSON (thân thiện với frontend)
2. **Giao tiếp microservice**: Chuyển sang Protobuf (tăng hiệu suất)
3. **Dữ liệu tĩnh**: Bật nén gzip

### Giải thích lý do
- JSON thân thiện nhất với frontend, không cần parse thêm
- Backend microservice dùng Protobuf, có thể giảm 40% lượng dữ liệu
- Nén gzip hiệu quả rõ rệt với văn bản (JSON có thể nén 70%)

### So sánh hiệu suất
| Phương án | Kích thước | Thời gian |
|------|------|------|
| Hiện tại (JSON) | 200 KB | 800 ms |
| + gzip | 60 KB | 350 ms |
| + Protobuf | 50 KB | 280 ms |

### Ví dụ code
[Code triển khai cụ thể...]
```

---

## Bảng tra cứu thuật ngữ

| Thuật ngữ | Tiếng Anh | Giải thích |
| :--- | :--- | :--- |
| **Tuần tự hóa** | Serialization | Đối tượng → Luồng byte |
| **Giải tuần tự hóa** | Deserialization | Luồng byte → Đối tượng |
| **JSON** | JavaScript Object Notation | Định dạng văn bản phổ biến nhất |
| **XML** | Extensible Markup Language | Ngôn ngữ đánh dấu, từng là xu hướng chính |
| **Protobuf** | Protocol Buffers | Định dạng hiệu quả cao mã nguồn mở của Google |
| **MessagePack** | - | Phiên bản nhị phân của JSON |
| **Mã hóa** | Encoding | Ký tự → Byte |
| **Giải mã** | Decoding | Byte → Ký tự |

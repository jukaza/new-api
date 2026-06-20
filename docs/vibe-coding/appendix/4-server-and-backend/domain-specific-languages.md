# Ngôn ngữ chuyên biệt miền (DSL): Những "đoạn mã không giống mã" trong thế giới backend

::: tip Lời mở đầu
Trong một trường hợp thực tế, kỹ sư Armin tại công ty mới đã dùng AI xây dựng một bộ dịch vụ hạ tầng, tổng cộng khoảng 4 vạn dòng mã (Go + YAML + Pulumi + SDK glue code), trong đó hơn 90% do AI tạo ra. Ca này xuất hiện nhiều thuật ngữ mà người mới bắt đầu không quen thuộc: YAML, Pulumi, HCL, Lua, SDK glue code... Chúng không phải Python, cũng không phải JavaScript, nhưng xuất hiện khắp nơi trong các dự án backend. Bài viết này sẽ từ một góc nhìn thống nhất — **Ngôn ngữ chuyên biệt miền (DSL)** — để giới thiệu một cách có hệ thống về những công nghệ này.
:::

**Mục tiêu học tập của bài viết này**

Trong phát triển backend, ngoài mã logic nghiệp vụ được viết bằng ngôn ngữ lập trình đa dụng (Python, Go, Java, v.v.), còn tồn tại một lượng lớn **tệp và mã có mục đích khác nhau, cú pháp khác nhau, nhưng đều không thuộc về ngôn ngữ lập trình đa dụng**. Chúng có một khái niệm chung thống nhất: **DSL (Domain-Specific Language, Ngôn ngữ chuyên biệt miền)**.

Sau khi học xong bài này, bạn sẽ có thể:

- Hiểu sự khác biệt bản chất giữa DSL và Ngôn ngữ lập trình đa dụng (GPL)
- Nắm vững hệ thống phân loại DSL: định dạng tuần tự hóa dữ liệu, ngôn ngữ script nhúng, ngôn ngữ định nghĩa hạ tầng
- Phân biệt các tình huống áp dụng của XML, JSON, YAML, TOML, CSV, Protobuf và các định dạng dữ liệu khác
- Hiểu mục đích thiết kế của các ngôn ngữ script nhúng như Lua
- Giải thích nguyên lý và sự khác biệt giữa Terraform (HCL) và Pulumi
- Hiểu quy chuẩn OpenAPI và nguyên lý hoạt động của việc tạo SDK tự động
- Đánh giá loại mã nào phù hợp để giao cho AI tạo ra

| Chương | Chủ đề | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Tổng luận về DSL | Định nghĩa DSL vs GPL, hệ thống phân loại và toàn cảnh |
| **Chương 2** | Định dạng tuần tự hóa dữ liệu | XML, JSON, YAML, TOML, CSV, Protobuf, v.v. |
| **Chương 3** | Ngôn ngữ script nhúng | Triết lý thiết kế và ứng dụng điển hình của Lua |
| **Chương 4** | Hạ tầng như mã | Nguyên lý và so sánh Terraform (HCL), Pulumi |
| **Chương 5** | Mã keo dán và tạo SDK | Quy chuẩn OpenAPI và tạo mã client tự động |
| **Chương 6** | Mối quan hệ giữa AI và DSL | Tại sao AI đặc biệt giỏi tạo mã DSL |

---

## 1. Tổng luận về DSL: Một thế giới khác bên ngoài ngôn ngữ đa dụng

### 1.1 DSL là gì?

**DSL (Domain-Specific Language, Ngôn ngữ chuyên biệt miền)** là ngôn ngữ được thiết kế cho một lĩnh vực hoặc nhiệm vụ cụ thể. Đối lập với nó là **GPL (General-Purpose Language, Ngôn ngữ lập trình đa dụng)**, như Python, Java, Go, C++ — chúng được thiết kế để giải quyết mọi bài toán tính toán.

Sự khác biệt cốt lõi giữa hai loại:

| Khía cạnh | GPL (Ngôn ngữ lập trình đa dụng) | DSL (Ngôn ngữ chuyên biệt miền) |
|------|-------------------|-------------------|
| **Mục tiêu thiết kế** | Giải quyết mọi bài toán tính toán | Giải quyết vấn đề trong một lĩnh vực cụ thể |
| **Phạm vi biểu đạt** | Turing-complete, về lý thuyết có thể tính toán mọi thứ | Thường cố ý giới hạn phạm vi biểu đạt |
| **Chi phí học tập** | Cao hơn, cần hiểu toàn bộ hệ thống ngôn ngữ | Thấp hơn, chỉ cần hiểu các khái niệm trong lĩnh vực đó |
| **Đại diện điển hình** | Python, Java, Go, C++, JavaScript | SQL, HTML/CSS, biểu thức chính quy, YAML, HCL |

Thực ra bạn đã sử dụng DSL từ lâu rồi:

- **SQL** là DSL trong lĩnh vực truy vấn cơ sở dữ liệu — bạn dùng `SELECT * FROM users WHERE age > 18` để tra dữ liệu, thay vì dùng Python viết logic duyệt thủ công
- **HTML/CSS** là DSL trong lĩnh vực cấu trúc và kiểu dáng trang web — bạn dùng thẻ và thuộc tính để mô tả trang, thay vì dùng C++ thao tác điểm ảnh
- **Biểu thức chính quy** là DSL trong lĩnh vực khớp mẫu văn bản — bạn dùng `\d{3}-\d{4}` để khớp số điện thoại, thay vì viết vòng lặp so sánh ký tự thủ công

### 1.2 Phân loại DSL

DSL có thể được chia thành hai loại lớn dựa trên "có đạt tính Turing-complete hay không":

**DSL ngoại vi (External DSL)**

Có cú pháp và trình phân tích cú pháp độc lập, không phụ thuộc vào bất kỳ ngôn ngữ lập trình đa dụng nào. Mã do người dùng viết được xử lý bởi trình thông dịch hoặc biên dịch chuyên dụng.

- Loại mô tả dữ liệu thuần: JSON, YAML, XML, TOML, CSV, Protobuf (không chứa bất kỳ logic nào)
- Loại truy vấn/thao tác: SQL, GraphQL, biểu thức chính quy (có khả năng logic hạn chế)
- Loại mô hình hóa miền: HCL (Terraform), Dockerfile, cú pháp cấu hình Nginx (mô tả khai báo trạng thái của miền cụ thể)

**DSL nội tại (Internal DSL / Embedded DSL)**

Ký sinh bên trong một ngôn ngữ lập trình đa dụng, sử dụng cú pháp của ngôn ngữ chủ để xây dựng cách biểu đạt chuyên biệt miền. Bản thân mã là mã hợp lệ của ngôn ngữ chủ, nhưng đọc lên giống như một ngôn ngữ chuyên dụng.

- Pulumi (viết bằng TypeScript/Python/Go, nhưng API được thiết kế giống như cấu hình khai báo)
- Định nghĩa routing của Ruby on Rails (`get '/users', to: 'users#index'`, mã Ruby hợp lệ, nhưng đọc lên như cấu hình)
- Cú pháp assertion trong framework kiểm thử (`expect(value).toBe(42)`, JavaScript hợp lệ, nhưng đọc lên như ngôn ngữ tự nhiên)

### 1.3 Toàn cảnh DSL trong dự án backend

Trong một dự án backend điển hình, bạn sẽ gặp các loại DSL sau:

```
DSL trong dự án backend
├── Định dạng tuần tự hóa dữ liệu (mô tả cấu trúc dữ liệu)
│   ├── Định dạng văn bản: JSON, YAML, XML, TOML, CSV, INI
│   └── Định dạng nhị phân: Protobuf, MessagePack, Avro, BSON
├── Ngôn ngữ script nhúng (lớp cấu hình có thể lập trình)
│   ├── Lua (engine game, Nginx, Redis)
│   ├── GDScript (engine Godot)
│   └── Jsonnet (tạo mẫu cấu hình)
├── DSL hạ tầng và vận hành (mô tả khai báo trạng thái hệ thống)
│   ├── HCL (Terraform)
│   ├── Dockerfile / Docker Compose YAML
│   └── Cú pháp cấu hình Nginx / Apache
└── Ngôn ngữ mô tả giao diện (mô tả hợp đồng API)
    ├── OpenAPI / Swagger
    ├── Protocol Buffers (tệp .proto)
    └── GraphQL Schema
```

Hiểu được toàn cảnh này, các chương tiếp theo sẽ lần lượt triển khai từng nhánh.

---

## 2. Định dạng tuần tự hóa dữ liệu: Mô tả dữ liệu có cấu trúc bằng văn bản

### 2.1 Tuần tự hóa dữ liệu là gì?

**Tuần tự hóa (Serialization)** là quá trình chuyển đổi cấu trúc dữ liệu trong bộ nhớ (đối tượng, từ điển, mảng, v.v.) thành một luồng văn bản/byte có thể lưu trữ hoặc truyền tải. Ngược lại, từ luồng văn bản/byte khôi phục thành cấu trúc dữ liệu trong bộ nhớ, gọi là **giải tuần tự hóa (Deserialization)**.

Định dạng tuần tự hóa dữ liệu là loại DSL cơ bản nhất — chúng thuộc loại DSL ngoại vi mô tả dữ liệu thuần, không có bất kỳ khả năng logic nào, chỉ chịu trách nhiệm mô tả tĩnh "giá trị là gì".

### 2.2 Tại sao cần những định dạng này?

Giả sử bạn phát triển một dịch vụ backend, địa chỉ cơ sở dữ liệu là `localhost:5432`. Nếu mã hóa cứng địa chỉ này trong mã nguồn, phát triển cục bộ không có vấn đề gì, nhưng khi triển khai lên môi trường production, địa chỉ cơ sở dữ liệu thay đổi thành `db.prod.company.com:5432`, bạn cần sửa mã nguồn và biên dịch lại.

Cách làm phổ biến trong thực tiễn kỹ thuật là: **tách các tham số có thể thay đổi ra khỏi mã, đặt chúng trong tệp cấu hình độc lập.** Chương trình khi khởi động đọc tệp cấu hình, dựa vào giá trị trong đó để quyết định hành vi.

Ngoài cấu hình, định dạng tuần tự hóa dữ liệu còn được sử dụng rộng rãi trong: trao đổi dữ liệu giữa các hệ thống (API request/response), lưu trữ dữ liệu bền vững, giao tiếp đa ngôn ngữ và các tình huống khác.

### 2.3 Định dạng văn bản có thể đọc bởi con người

Dưới đây là các định dạng tuần tự hóa văn bản phổ biến nhất trong kỹ thuật, được giới thiệu theo thứ tự lịch sử.

**INI**

Định dạng cấu hình sớm nhất, bắt nguồn từ hệ thống Windows. Cấu trúc đơn giản, gồm các section và cặp key-value:

```ini
[database]
host = localhost
port = 5432

[server]
debug = true
```

Ưu điểm là khả năng đọc cao. Hạn chế là không hỗ trợ cấu trúc lồng nhau và kiểu mảng, không thể biểu đạt cấu hình phức tạp. Hiện nay chủ yếu xuất hiện trong các hệ thống kế thừa và một số cấu hình Linux (như `php.ini`, `my.cnf`).

**CSV**

**CSV (Comma-Separated Values, Giá trị phân cách bằng dấu phẩy)** là định dạng dữ liệu bảng đơn giản nhất:

```csv
name,age,city
Alice,30,Beijing
Bob,25,Shanghai
```

Mỗi dòng là một bản ghi, các trường được phân cách bằng dấu phẩy. CSV được sử dụng rộng rãi trong nhập xuất dữ liệu, trao đổi bảng tính, pipeline phân tích dữ liệu. Hạn chế của nó là chỉ có thể biểu đạt bảng hai chiều phẳng, không hỗ trợ cấu trúc lồng nhau, và không có thông tin kiểu dữ liệu (tất cả giá trị đều là chuỗi).

**XML**

**XML (eXtensible Markup Language, Ngôn ngữ đánh dấu mở rộng)** ra đời năm 1998, từng là tiêu chuẩn chủ đạo trong trao đổi dữ liệu:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<config>
  <database>
    <host>localhost</host>
    <port>5432</port>
  </database>
  <server>
    <debug>true</debug>
    <allowed_origins>
      <origin>https://example.com</origin>
      <origin>https://app.example.com</origin>
    </allowed_origins>
  </server>
</config>
```

XML có khả năng biểu đạt rất mạnh, hỗ trợ lồng nhau, thuộc tính, namespace, kiểm tra Schema và các tính năng nâng cao khác. Nhưng cú pháp của nó dài dòng — lượng lớn thẻ mở/đóng dẫn đến tỷ lệ tín hiệu trên nhiễu thấp, trải nghiệm viết và đọc thủ công kém.

XML vẫn được sử dụng rộng rãi trong các lĩnh vực sau:
- Hệ sinh thái Java (`pom.xml` của Maven, cấu hình Spring, tệp bố cục Android)
- Dịch vụ Web doanh nghiệp (giao thức SOAP)
- Định dạng tài liệu văn phòng (`.docx`, `.xlsx` về bản chất là tập hợp tệp XML nén ZIP)
- Nguồn cấp RSS/Atom, đồ họa vector SVG

**JSON**

**JSON (JavaScript Object Notation)** ra đời năm 2001, nhờ tính đơn giản nhanh chóng thay thế XML trở thành tiêu chuẩn thực tế trong trao đổi dữ liệu Web API:

```json
{
  "database": {
    "host": "localhost",
    "port": 5432
  },
  "server": {
    "debug": true
  }
}
```

Ưu điểm là cấu trúc rõ ràng, hầu hết các ngôn ngữ lập trình đều có hỗ trợ phân tích cú pháp tự nhiên. Nhược điểm chính là **không hỗ trợ comment**, và lượng lớn dấu ngoặc và trích dẫn dễ gây lỗi khi viết thủ công. JSON đồng thời là định dạng tiêu chuẩn cho cấu hình dự án frontend (`package.json`, `tsconfig.json`).

**YAML**

**YAML (YAML Ain't Markup Language)** cũng ra đời năm 2001, là định dạng cấu hình được sử dụng rộng rãi nhất trong lĩnh vực backend và DevOps hiện nay. Docker Compose, Kubernetes, GitHub Actions và các công cụ khác đều sử dụng YAML:

```yaml
# Cấu hình cơ sở dữ liệu
database:
  host: localhost
  port: 5432

# Cấu hình máy chủ
server:
  debug: true
  allowed_origins:
    - https://example.com
    - https://app.example.com
```

Ưu điểm là hỗ trợ comment, cú pháp ngắn gọn, có thể biểu đạt cấu trúc lồng nhau phức tạp. Nhược điểm là **phụ thuộc vào thụt lề để biểu thị quan hệ cấp bậc**, lỗi thụt lề sẽ dẫn đến phân tích cú pháp thất bại, đây là vấn đề mà người mới bắt đầu thường gặp nhất.

> Bổ sung: Tên đầy đủ của YAML "YAML Ain't Markup Language" là một từ viết tắt đệ quy.

**TOML**

**TOML (Tom's Obvious Minimal Language)** ra đời năm 2013, được trình quản lý gói Cargo của Rust và `pyproject.toml` của Python sử dụng:

```toml
[database]
host = "localhost"
port = 5432

[server]
debug = true
allowed_origins = [
  "https://example.com",
  "https://app.example.com"
]
```

TOML cố gắng cân bằng giữa tính đơn giản của INI và khả năng biểu đạt của YAML, đồng thời tránh vấn đề nhạy cảm với thụt lề.

### 2.4 Định dạng tuần tự hóa nhị phân

Các định dạng trên đều là văn bản có thể đọc bởi con người. Trong các tình huống yêu cầu cao hơn về hiệu năng và dung lượng, còn tồn tại một loại **định dạng tuần tự hóa nhị phân** — chúng hy sinh khả năng đọc, đổi lấy dung lượng nhỏ hơn và tốc độ phân tích nhanh hơn.

| Định dạng | Nhà phát triển | Đặc điểm | Tình huống sử dụng điển hình |
|------|-------|------|------------|
| **Protocol Buffers (Protobuf)** | Google | Cần định nghĩa trước tệp `.proto` Schema, kiểu mạnh, dung lượng cực nhỏ | Giao tiếp gRPC, dịch vụ nội bộ Google, microservice hiệu năng cao |
| **MessagePack** | Cộng đồng | Phiên bản nhị phân tương tự JSON, không cần Schema | Mã hóa nội bộ Redis, giao tiếp đa ngôn ngữ hiệu năng cao |
| **Avro** | Apache | Hỗ trợ Schema evolution, phù hợp tình huống dữ liệu lớn | Tuần tự hóa dữ liệu trong hệ sinh thái Hadoop / Kafka |
| **BSON** | MongoDB | Phần mở rộng nhị phân của JSON, hỗ trợ thêm kiểu dữ liệu | Định dạng lưu trữ nội bộ cơ sở dữ liệu MongoDB |

Lấy Protocol Buffers làm ví dụ, cần định nghĩa Schema trước:

```protobuf
// user.proto
syntax = "proto3";

message User {
  string name = 1;
  int32 age = 2;
  string email = 3;
}
```

Sau đó thông qua trình biên dịch (`protoc`) tự động tạo mã tuần tự hóa/giải tuần tự hóa cho các ngôn ngữ khác nhau. Mô hình "định nghĩa Schema trước, rồi tạo mã" này nhất quán với tư duy tạo SDK OpenAPI sẽ được giới thiệu ở phần sau.

### 2.5 So sánh toàn diện

| Định dạng | Loại | Năm ra đời | Khả năng đọc | Hỗ trợ comment | Tình huống sử dụng điển hình |
|------|------|---------|--------|---------|------------|
| **INI** | Văn bản | 1980s | Cao | ✅ | Cấu hình hệ thống, dự án kế thừa |
| **CSV** | Văn bản | 1972 | Cao | ❌ | Nhập xuất dữ liệu, trao đổi bảng tính |
| **XML** | Văn bản | 1998 | Trung bình | ✅ | Hệ sinh thái Java, dịch vụ Web doanh nghiệp, định dạng tài liệu |
| **JSON** | Văn bản | 2001 | Cao | ❌ | Trao đổi dữ liệu Web API, cấu hình frontend |
| **YAML** | Văn bản | 2001 | Cao | ✅ | Docker, K8s, CI/CD, cấu hình dịch vụ backend |
| **TOML** | Văn bản | 2013 | Cao | ✅ | Cấu hình dự án Rust / Python |
| **Protobuf** | Nhị phân | 2008 | Không | — | gRPC, giao tiếp microservice hiệu năng cao |
| **MessagePack** | Nhị phân | 2008 | Không | — | Giao tiếp đa ngôn ngữ hiệu năng cao |
| **Avro** | Nhị phân | 2009 | Không | — | Pipeline dữ liệu lớn Hadoop / Kafka |
| **BSON** | Nhị phân | 2009 | Không | — | Lưu trữ nội bộ MongoDB |

**Điểm chính**: Chức năng bản chất của tất cả các định dạng này là giống nhau — **chuyển đổi dữ liệu có cấu trúc thành dạng có thể lưu trữ hoặc truyền tải**. Định dạng văn bản ưu tiên khả năng đọc của con người và dễ chỉnh sửa; định dạng nhị phân ưu tiên hiệu năng phân tích và dung lượng truyền tải. Chọn định dạng nào phụ thuộc vào sự cân bằng nhu cầu của tình huống cụ thể.


---

## 3. Ngôn ngữ script nhúng: Lớp cấu hình có thể lập trình

### 3.1 Định nghĩa khái niệm

Python, JavaScript, Go và các ngôn ngữ khác là ngôn ngữ lập trình đa dụng (General-Purpose Language), chúng có thể chạy độc lập, xây dựng ứng dụng hoàn chỉnh.

Khác với chúng, còn có một loại ngôn ngữ **được thiết kế đặc biệt để nhúng vào các chương trình chủ khác chạy**, cung cấp khả năng mở rộng có thể lập trình cho chương trình chủ. Loại ngôn ngữ này được gọi là **Ngôn ngữ script nhúng (Embedded Scripting Language)**.

Vấn đề cốt lõi mà chúng giải quyết là: **khi khả năng biểu đạt của tệp cấu hình tĩnh (YAML/JSON) không đủ, cần đưa vào các logic như điều kiện, vòng lặp, làm thế nào để triển khai hành vi động mà không cần sửa mã nguồn chương trình chủ.**

### 3.2 Lua: Ngôn ngữ script nhúng tiêu biểu nhất

Lua (nghĩa là "mặt trăng" trong tiếng Bồ Đào Nha) là một ngôn ngữ script cực kỳ nhẹ, toàn bộ trình thông dịch sau khi biên dịch chỉ vài trăm KB. Mục tiêu thiết kế của nó không phải là chạy độc lập, mà là làm lớp mở rộng có thể nhúng.

Các tình huống ứng dụng điển hình của Lua:

- **Engine game**: Hệ thống plugin của《World of Warcraft》, script game của《Roblox》đều sử dụng Lua. Engine game dùng C/C++ triển khai render cốt lõi và tính toán vật lý, giao các phần thay đổi thường xuyên như logic màn chơi, hội thoại NPC cho Lua script. Như vậy, người thiết kế khi sửa đổi nội dung game không cần biên dịch lại engine.

- **Máy chủ Web**: OpenResty nhúng Lua vào bên trong Nginx, cho phép nhân viên vận hành dùng Lua script để triển khai các logic như lọc yêu cầu, giới hạn lưu lượng, xác thực, mà không cần sửa mã nguồn C của Nginx.

- **Cơ sở dữ liệu**: Redis hỗ trợ gửi Lua script đến máy chủ thực thi, dùng để triển khai các thao tác phức hợp cần đảm bảo tính nguyên tử (như "đọc trước ghi sau").

Dưới đây là một đoạn mã Lua script ví dụ nhúng trong Nginx (OpenResty):

```lua
-- Chức năng: xác thực token cho đường dẫn /api/secret
local uri = ngx.var.uri
local token = ngx.req.get_headers()["Authorization"]

if uri == "/api/secret" and token ~= "Bearer my-secret-token" then
    ngx.status = 403
    ngx.say("Access denied")
    return ngx.exit(403)
end
```

### 3.3 Các ngôn ngữ script nhúng khác

| Ngôn ngữ | Môi trường chủ | Ứng dụng điển hình |
|------|---------|---------|
| **Lua** | Engine game, Nginx (OpenResty), Redis | Logic game, chiến lược gateway, thao tác cache |
| **VimScript / Lua** | Trình soạn thảo Vim / Neovim | Phát triển plugin trình soạn thảo |
| **Emacs Lisp** | Trình soạn thảo Emacs | Tùy chỉnh hành vi trình soạn thảo |
| **GDScript** | Engine game Godot | Script logic game |
| **Jsonnet** | Hệ sinh thái Kubernetes / Công cụ tạo cấu hình | Tạo hàng loạt cấu hình JSON/YAML tương tự bằng mẫu |

**Điểm chính**: Ngôn ngữ script nhúng trong phân loại DSL thuộc **vùng ranh giới giữa DSL nội tại và DSL ngoại vi** — chúng là ngôn ngữ độc lập (có cú pháp và trình thông dịch riêng), nhưng mục tiêu thiết kế là nhúng vào chương trình chủ chạy, không phải xây dựng ứng dụng độc lập. Chúng lấp đầy khoảng trống giữa "tệp cấu hình tĩnh" (DSL mô tả dữ liệu thuần) và "ngôn ngữ lập trình đa dụng" (GPL): khi cấu hình cần biểu đạt logic (điều kiện, vòng lặp, gọi hàm), nhúng một ngôn ngữ script nhẹ là giải pháp tiêu chuẩn trong kỹ thuật.


---

## 4. Hạ tầng như mã (Infrastructure as Code)

### 4.1 "Hạ tầng" là gì

Trong kỹ thuật backend, "hạ tầng" (Infrastructure) chỉ các tài nguyên nền tảng mà ứng dụng cần dựa vào để chạy:

- Tài nguyên tính toán: máy chủ (máy ảo hoặc container)
- Lưu trữ dữ liệu: phiên bản cơ sở dữ liệu, bucket lưu trữ đối tượng
- Mạng: quy tắc tường lửa, bộ cân bằng tải, cấu hình DNS
- Middleware: hàng đợi tin nhắn, cụm cache

Trong thời đại điện toán đám mây, những tài nguyên này được tạo và quản lý thông qua bảng điều khiển đồ họa của nhà cung cấp dịch vụ đám mây (như AWS, Alibaba Cloud, Tencent Cloud).

### 4.2 Hạn chế của quản lý thủ công

Thao tác thủ công qua bảng điều khiển khả thi trong các dự án quy mô nhỏ, nhưng khi quy mô dự án tăng lên, sẽ bộc lộ các vấn đề sau:

1. **Không thể lặp lại**: Các bước thao tác không được ghi lại, không thể tái tạo chính xác cùng một môi trường
2. **Không thể kiểm toán**: Không thể truy vết "ai đã sửa đổi cấu hình gì vào lúc nào"
3. **Không thể cộng tác**: Quá trình thao tác không thể đưa vào kiểm soát phiên bản, không thể thực hiện code review
4. **Dễ gây lỗi**: Thao tác thủ công trong môi trường production có rủi ro thao tác sai

**Hạ tầng như mã (Infrastructure as Code, viết tắt IaC)** có tư tưởng cốt lõi là: **dùng mã để định nghĩa khai báo tài nguyên hạ tầng, làm cho nó có khả năng kiểm soát phiên bản, thực thi tự động và triển khai có thể lặp lại.**

### 4.3 Terraform

Terraform là công cụ IaC được sử dụng rộng rãi nhất hiện nay, do HashiCorp phát triển. Nó sử dụng ngôn ngữ chuyên dụng **HCL (HashiCorp Configuration Language)**.

Terraform áp dụng mô hình **khai báo (declarative)**: người dùng mô tả trạng thái cuối cùng mong muốn, Terraform tự động tính toán các thao tác cần thiết từ trạng thái hiện tại đến trạng thái mục tiêu.

```hcl
# Định nghĩa một máy chủ đám mây
resource "aws_instance" "my_server" {
  ami           = "ami-0c55b159cbfafe1f0"  # Ảnh hệ điều hành
  instance_type = "t3.micro"               # Loại phiên bản

  tags = {
    Name = "my-first-server"
  }
}

# Định nghĩa một phiên bản cơ sở dữ liệu PostgreSQL
resource "aws_db_instance" "my_database" {
  engine         = "postgres"
  instance_class = "db.t3.micro"
  username       = "admin"
  password       = "please-use-secrets-manager"
}
```

Quy trình thực thi:

```bash
terraform plan    # Xem trước các thay đổi sẽ được thực hiện
terraform apply   # Xác nhận và thực thi, tự động tạo tài nguyên trên nền tảng đám mây
```

### 4.4 Pulumi

Pulumi cung cấp một cách tiếp cận khác: **trực tiếp sử dụng ngôn ngữ lập trình đa dụng (TypeScript, Python, Go, v.v.) để định nghĩa hạ tầng**, thay vì học cú pháp HCL chuyên dụng.

Cùng một định nghĩa máy chủ, biểu đạt bằng Pulumi + TypeScript như sau:

```typescript
import * as aws from "@pulumi/aws";

const server = new aws.ec2.Instance("my-server", {
    ami: "ami-0c55b159cbfafe1f0",
    instanceType: "t3.micro",
    tags: { Name: "my-first-server" },
});

const bucket = new aws.s3.Bucket("my-bucket", {
    acl: "private",
});

export const serverIp = server.publicIp;
```

Do sử dụng ngôn ngữ lập trình đa dụng, nhà phát triển có thể tận dụng các đặc điểm ngôn ngữ như vòng lặp, điều kiện, trừu tượng hóa hàm để xử lý logic hạ tầng phức tạp.

### 4.5 So sánh Terraform và Pulumi

| Khía cạnh | Terraform | Pulumi |
|------|-----------|--------|
| **Ngôn ngữ** | HCL (ngôn ngữ chuyên dụng) | TypeScript / Python / Go và các ngôn ngữ đa dụng |
| **Chi phí học tập** | Cần học cú pháp HCL | Sử dụng ngôn ngữ lập trình đã biết, chi phí học thấp hơn |
| **Hệ sinh thái cộng đồng** | Rất trưởng thành, hầu như bao phủ tất cả nhà cung cấp đám mây | Tăng trưởng nhanh, nhưng quy mô nhỏ hơn Terraform |
| **Tình huống áp dụng** | Quản lý hạ tầng tiêu chuẩn do nhóm vận hành chủ đạo | Dự án do nhà phát triển chủ đạo, tình huống cần logic phức tạp |
| **Mức độ phù hợp tạo mã AI** | Cao (mẫu cố định) | Rất cao (bản chất là mã ngôn ngữ lập trình đa dụng) |

**Điểm chính**: HCL trong công cụ IaC là một DSL ngoại vi điển hình — nó có cú pháp và trình phân tích cú pháp độc lập, chuyên dùng để mô tả khai báo trạng thái hạ tầng. Còn Pulumi áp dụng chiến lược DSL nội tại — dùng cú pháp của ngôn ngữ lập trình đa dụng để biểu đạt các khái niệm chuyên biệt miền. Mục tiêu của cả hai giống nhau (chuyển quản lý hạ tầng từ thao tác thủ công sang điều khiển bằng mã), con đường khác nhau (ngôn ngữ chuyên dụng vs ngôn ngữ đa dụng). Mã có thể được đưa vào kiểm soát phiên bản Git, thực hiện đánh giá nhóm, tự động thực thi và rollback.


---

## 5. Mã keo dán và tạo SDK tự động

### 5.1 Mã keo dán là gì

Trong kỹ thuật phần mềm, **mã keo dán (Glue Code)** chỉ mã không chứa logic nghiệp vụ, chỉ dùng để kết nối hai hệ thống hoặc module.

Mã keo dán điển hình bao gồm:

- Mã HTTP request được viết khi frontend gọi backend API (ghép URL, đặt request header, phân tích response)
- Mã HTTP client được viết khi dịch vụ backend A gọi giao diện của dịch vụ B
- Mã thích ứng giao diện giữa các ngôn ngữ lập trình khác nhau

Đặc điểm của loại mã này là: **lặp lại cao, mẫu cố định, nhưng không thể bỏ qua.**

### 5.2 Quy chuẩn OpenAPI và tạo mã tự động

Vì mã keo dán có đặc điểm mẫu hóa cao, giải pháp của giới kỹ thuật là: **trước tiên dùng định dạng tiêu chuẩn mô tả giao diện API, sau đó dùng công cụ tự động tạo mã client.**

**Quy chuẩn OpenAPI** (tiền thân là Swagger) là tiêu chuẩn ngành mô tả REST API. Nó sử dụng định dạng YAML hoặc JSON, định nghĩa chính xác đường dẫn, tham số, request body và cấu trúc response của API:

```yaml
openapi: 3.0.0
info:
  title: Email Service API
  version: 1.0.0

paths:
  /emails:
    post:
      summary: Gửi email
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                to:
                  type: string
                  example: "user@example.com"
                subject:
                  type: string
                body:
                  type: string
      responses:
        '200':
          description: Gửi thành công
```

Dựa trên tệp quy chuẩn này, sử dụng các công cụ như `openapi-generator` có thể tự động tạo client SDK cho nhiều ngôn ngữ:

- **Python**: `client.emails.send(to="user@example.com", subject="Hi", body="Hello")`
- **TypeScript**: `client.emails.send({ to: "user@example.com", subject: "Hi", body: "Hello" })`
- **Go**: `client.Emails.Send(ctx, &SendEmailRequest{To: "user@example.com", ...})`

SDK được tạo đóng gói tất cả chi tiết HTTP request, bên gọi không cần quan tâm đến đường dẫn URL, phương thức request, định dạng tuần tự hóa và các chi tiết triển khai tầng thấp.

### 5.3 Hiểu lại ca của Armin

Quay lại ca ở đầu bài viết, bây giờ có thể hiểu chính xác từng thành phần trong đó:

| Thành phần | Tính chất | Mô tả |
|---------|------|------|
| **Go** | Mã logic nghiệp vụ | Triển khai chức năng cốt lõi của dịch vụ gửi nhận email |
| **YAML** | Tệp cấu hình | Cấu hình dịch vụ, định nghĩa pipeline CI/CD, tệp quy chuẩn OpenAPI |
| **Pulumi** | Mã hạ tầng | Dùng Go/TypeScript định nghĩa tài nguyên đám mây (máy chủ, cơ sở dữ liệu, mạng) |
| **SDK glue code** | Thư viện client được tạo tự động | Python và TypeScript SDK được tạo tự động từ quy chuẩn OpenAPI |

Trong đó cấu hình YAML, định nghĩa tài nguyên Pulumi, SDK glue code ba loại này đều thuộc về mã có tính mẫu hóa cao, có ràng buộc quy chuẩn rõ ràng, đây chính là lĩnh vực mà khả năng tạo mã của AI mạnh nhất. Vì vậy "4 vạn dòng mã trong đó 90% do AI tạo ra" là hợp lý.


---

## 6. Mối quan hệ giữa AI và DSL

### 6.1 Phân tích tính phù hợp của tạo mã AI

| Chiều đặc điểm | Phù hợp cho AI tạo | Không phù hợp cho AI tạo |
|---------|-------------|---------------|
| **Mức độ mẫu hóa** | Lặp lại cao, tồn tại mẫu cố định | Cần thiết kế sáng tạo, không có tiền lệ |
| **Ràng buộc quy chuẩn** | Có schema hoặc quy chuẩn cú pháp rõ ràng | Nhu cầu mơ hồ, ranh giới không rõ ràng |
| **Phụ thuộc ngữ cảnh** | Tự nhất quán cục bộ, định nghĩa đơn lẻ không phụ thuộc hiểu biết toàn cục | Cần hiểu ý đồ kiến trúc của toàn bộ hệ thống |
| **Khả năng kiểm chứng** | Có thể được công cụ tự động kiểm tra (như `terraform validate`) | Chỉ có thể dựa vào đánh giá thủ công về tính hợp lý của thiết kế |

Bốn loại công nghệ được giới thiệu trong bài này — tệp cấu hình, script nhúng, mã IaC, SDK glue code — đều có các đặc điểm ở cột trái. Điều này giải thích tại sao AI trong những lĩnh vực này có hiệu quả tạo mã vượt trội so với mã logic nghiệp vụ.

### 6.2 Khung đánh giá

Khi đánh giá một đoạn mã có phù hợp để giao cho AI tạo hay không, có thể tham khảo ba tiêu chuẩn sau:

1. **Có tồn tại quy chuẩn hoặc schema sẵn có không?** — Có thì thân thiện với AI
2. **Có thuộc về mẫu lặp lại số lượng lớn không?** — Có thì thân thiện với AI
3. **Kết quả tạo ra có thể được công cụ tự động kiểm chứng không?** — Có thì thân thiện với AI

Mã thỏa mãn cả ba tiêu chuẩn (như tạo SDK từ quy chuẩn OpenAPI, dùng Terraform định nghĩa hàng loạt tài nguyên đồng cấu), có thể phụ thuộc cao vào AI tạo. Mã không thỏa mãn cả ba tiêu chuẩn (như thiết kế một giao thức nhất quán phân tán mới), vẫn cần kỹ sư tự hoàn thành.

---

## 7. Bảng thuật ngữ

| Thuật ngữ | Tên đầy đủ / Tiếng Trung | Định nghĩa |
|------|------------|------|
| **DSL** | Domain-Specific Language / Ngôn ngữ chuyên biệt miền | Ngôn ngữ được thiết kế cho lĩnh vực cụ thể, đối lập với ngôn ngữ lập trình đa dụng |
| **GPL** | General-Purpose Language / Ngôn ngữ lập trình đa dụng | Ngôn ngữ lập trình có thể giải quyết mọi bài toán tính toán, như Python, Java, Go |
| **DSL ngoại vi** | External DSL | Ngôn ngữ chuyên biệt miền có cú pháp và trình phân tích cú pháp độc lập, như SQL, HCL, YAML |
| **DSL nội tại** | Internal DSL / Embedded DSL | Biểu đạt chuyên biệt miền ký sinh trong ngôn ngữ lập trình đa dụng, sử dụng cú pháp chủ, như Pulumi |
| **Tuần tự hóa dữ liệu** | Data Serialization | Quá trình chuyển đổi cấu trúc dữ liệu trong bộ nhớ thành định dạng có thể lưu trữ hoặc truyền tải |
| **INI** | Initialization | Định dạng cấu hình cặp key-value sớm nhất, bắt nguồn từ hệ thống Windows |
| **CSV** | Comma-Separated Values / Giá trị phân cách bằng dấu phẩy | Định dạng bảng văn bản thuần phân cách trường bằng dấu phẩy |
| **XML** | eXtensible Markup Language / Ngôn ngữ đánh dấu mở rộng | Định dạng dữ liệu văn bản dựa trên thẻ, khả năng biểu đạt mạnh nhưng cú pháp dài dòng |
| **JSON** | JavaScript Object Notation | Định dạng trao đổi dữ liệu nhẹ dựa trên cặp key-value, tiêu chuẩn thực tế của Web API |
| **YAML** | YAML Ain't Markup Language | Định dạng tệp cấu hình dựa trên thụt lề, sử dụng rộng rãi trong lĩnh vực backend và DevOps |
| **TOML** | Tom's Obvious Minimal Language | Định dạng cấu hình với cú pháp tường minh, phổ biến trong hệ sinh thái Rust và Python |
| **Protobuf** | Protocol Buffers | Định dạng tuần tự hóa nhị phân do Google phát triển, cần định nghĩa Schema trước, dung lượng nhỏ, tốc độ nhanh |
| **MessagePack** | — | Định dạng tuần tự hóa nhị phân tương tự JSON, không cần Schema |
| **Lua** | — | Ngôn ngữ script nhúng nhẹ, thường dùng trong engine game, máy chủ Web và mở rộng cơ sở dữ liệu |
| **IaC** | Infrastructure as Code / Hạ tầng như mã | Thực tiễn kỹ thuật định nghĩa và quản lý tài nguyên điện toán đám mây bằng mã |
| **Terraform** | — | Công cụ IaC do HashiCorp phát triển, sử dụng ngôn ngữ khai báo HCL |
| **HCL** | HashiCorp Configuration Language | Ngôn ngữ cấu hình chuyên dụng mà Terraform sử dụng |
| **Pulumi** | — | Công cụ IaC hỗ trợ ngôn ngữ lập trình đa dụng |
| **OpenAPI** | — | Tiêu chuẩn ngành mô tả giao diện REST API (tiền thân là Swagger) |
| **SDK** | Software Development Kit / Bộ công cụ phát triển phần mềm | Thư viện client đóng gói chi tiết gọi API |
| **Mã keo dán** | Glue Code | Mã thích ứng không chứa logic nghiệp vụ, chỉ dùng để kết nối hai hệ thống |

---

## Tổng kết

Trong kỹ thuật backend tồn tại một lượng lớn mã không phải logic nghiệp vụ. Chúng có một khái niệm chung thống nhất: **DSL (Ngôn ngữ chuyên biệt miền)** — ngôn ngữ được thiết kế cho lĩnh vực cụ thể, đối lập với ngôn ngữ lập trình đa dụng.

DSL được giới thiệu trong bài này có thể quy về bốn loại:

1. **Định dạng tuần tự hóa dữ liệu** (XML / JSON / YAML / TOML / CSV / Protobuf, v.v.) — DSL ngoại vi mô tả dữ liệu thuần, chuyển đổi dữ liệu có cấu trúc thành dạng có thể lưu trữ, truyền tải
2. **Ngôn ngữ script nhúng** (Lua, v.v.) — Nằm giữa cấu hình và ngôn ngữ đa dụng, cung cấp khả năng mở rộng có thể lập trình cho chương trình chủ
3. **Ngôn ngữ định nghĩa hạ tầng** (HCL / Dockerfile, v.v.) — DSL ngoại vi khai báo, mô tả trạng thái mong muốn của hệ thống; Pulumi thực hiện cùng mục tiêu bằng cách DSL nội tại
4. **Ngôn ngữ mô tả giao diện và tạo mã keo dán** (OpenAPI / .proto) — Tự động tạo mã kết nối giữa các hệ thống thông qua mô tả quy chuẩn

Sau khi hiểu khung phân loại DSL, khi đối mặt với các loại "mã không giống mã" trong dự án backend, bạn có thể nhanh chóng nhận diện tính chất của nó: nó thuộc loại DSL nào, giải quyết vấn đề trong lĩnh vực gì, tại sao không dùng ngôn ngữ lập trình đa dụng để viết.

Đồng thời, do mã DSL có đặc điểm mẫu hóa cao, điều khiển bởi quy chuẩn, có thể tự động kiểm chứng, chúng cũng là lĩnh vực ứng dụng hiệu quả nhất của công nghệ tạo mã AI hiện nay.
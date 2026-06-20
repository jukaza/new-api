# Giao thức AI Agent (MCP & A2A)

::: tip Câu hỏi cốt lõi
**AI Agent "giao tiếp" với thế giới bên ngoài như thế nào?** Giống như Internet cần giao thức HTTP, AI Agent cũng cần giao thức truyền thông được chuẩn hóa. Chương này giới thiệu hai giao thức Agent phổ biến nhất: MCP và A2A, tương ứng giải quyết vấn đề truyền thông giữa AI và công cụ, cũng như giữa Agent với Agent.
:::

---

## 0. Giao thức là gì?

Trong lĩnh vực máy tính, **Giao thức (Protocol)** là một tập hợp các quy tắc và quy ước được chuẩn hóa, cho phép các hệ thống và chương trình khác nhau "hiểu" và "giao tiếp" lẫn nhau.

### 0.1 Tại sao cần giao thức?

Hãy tưởng tượng một tình huống: bạn gửi hàng cho bạn bè và cần điền địa chỉ. Nếu mỗi người viết địa chỉ theo định dạng khác nhau, người giao hàng sẽ không thể giao được. Giao thức chính là tiêu chuẩn quy định "cách viết địa chỉ" — tỉnh/thành, quận/huyện, phường/xã, đường, số nhà, viết theo định dạng này thì ai cũng có thể hiểu.

Máy tính cũng vậy. Hai chương trình muốn giao tiếp phải thỏa thuận:
- Định dạng dữ liệu là gì? (JSON? Nhị phân?)
- Cách thiết lập kết nối? (Quy trình bắt tay)
- Lỗi thì xử lý thế nào? (Xử lý lỗi)

### 0.2 Các giao thức phổ biến trong máy tính

| Giao thức | Tác dụng | Bạn sử dụng mỗi ngày |
|------|------|-------------|
| **HTTP** | Giao thức truyền tải web | Trình duyệt mở trang web |
| **HTTPS** | HTTP được mã hóa | Ngân hàng trực tuyến, trang thanh toán |
| **TCP/IP** | Giao thức nền tảng Internet | Tất cả truyền thông mạng |
| **DNS** | Giao thức phân giải tên miền | Chuyển `google.com` thành địa chỉ IP |
| **SMTP** | Giao thức gửi thư | Gửi email |
| **WebSocket** | Truyền thông hai chiều thời gian thực | Phần mềm chat, trò chơi trực tuyến |
| **SSH** | Đăng nhập từ xa an toàn | Kết nối máy chủ |
| **FTP** | Giao thức truyền tệp | Tải lên/tải xuống tệp |

Các giao thức này tạo nên nền tảng của Internet. Không có chúng, bạn không thể duyệt web, gửi email hay xem video.

### 0.3 Giá trị của giao thức

Giá trị cốt lõi của giao thức là **tiêu chuẩn hóa** và **khả năng tương tác**:

- **Tiêu chuẩn hóa**: Tất cả làm việc theo cùng một bộ quy tắc, giảm chi phí giao tiếp
- **Khả năng tương tác**: Các hệ thống từ nhà cung cấp khác nhau, stack công nghệ khác nhau có thể kết nối liền mạch

Ví dụ, giao thức HTTP cho phép trình duyệt Chrome truy cập máy chủ Nginx, cho phép crawler Python thu thập dữ liệu từ trang web Java. Chrome và Nginx không cần "biết" nhau, chỉ cần tuân thủ giao thức HTTP.

### 0.4 AI Agent cũng cần giao thức

Để AI Agent thực sự "làm việc", cần:
- Gọi công cụ bên ngoài (xem thời tiết, gửi email, thao tác cơ sở dữ liệu)
- Hợp tác với Agent khác (phân công công việc hoàn thành nhiệm vụ phức tạp)

Điều này đòi hỏi giao thức chuẩn hóa để quy định "AI gọi công cụ như thế nào", "Agent giao tiếp với nhau ra sao". Đây chính là nguồn gốc của **MCP** và **A2A**.

---

## 1. Các tầng giao thức Agent

Trước khi tìm hiểu chi tiết các giao thức cụ thể, hãy xem các tầng truyền thông trong hệ sinh thái Agent:

| Tầng | Giao thức | Vấn đề giải quyết | So sánh |
|------|------|-----------|------|
| **1** | Function Call | AI gọi hàm cục bộ như thế nào | Não bộ phát lệnh |
| **2** | **MCP** | AI kết nối công cụ và nguồn dữ liệu bên ngoài như thế nào | Cổng USB-C |
| **3** | **A2A** | Agent giao tiếp và hợp tác với nhau như thế nào | WeChat doanh nghiệp |

::: tip Giải thích từng dòng trong bảng
**Tầng 1 (Function Call)**: Đây là khả năng cơ bản nhất của mô hình lớn — kích hoạt thực thi hàm thông qua việc tạo dữ liệu có cấu trúc (JSON). Nó là nền tảng của "giao thức", nhưng bản thân nó giống một khả năng hơn là giao thức chuẩn.

**Tầng 2 (MCP)**: Model Context Protocol, do Anthropic phát hành tháng 11 năm 2024. Nó chuẩn hóa cách AI kết nối với công cụ và nguồn dữ liệu bên ngoài, giống như USB-C đã thống nhất cổng sạc của nhiều thiết bị.

**Tầng 3 (A2A)**: Agent-to-Agent Protocol, do Google phát hành tháng 4 năm 2025. Nó cho phép các Agent khác nhau khám phá, giao tiếp và hợp tác lẫn nhau, giống như WeChat doanh nghiệp cho phép đồng nghiệp giao việc và trò chuyện.
:::

Chương này tập trung vào hai giao thức chính thức ở tầng 2 và 3: MCP và A2A.

---

## 2. MCP (Model Context Protocol)

### 2.1 Thông tin cơ bản về giao thức

| Mục | Nội dung |
|------|------|
| **Tên đầy đủ** | Model Context Protocol |
| **Đơn vị khởi xướng** | Anthropic |
| **Thời gian phát hành** | 25 tháng 11 năm 2024 |
| **Tài liệu chính thức** | [modelcontextprotocol.io](https://modelcontextprotocol.io) |
| **Giấy phép nguồn mở** | MIT License |
| **GitHub** | [github.com/modelcontextprotocol](https://github.com/modelcontextprotocol) |

::: tip Tại sao gọi là "Context Protocol"?
**Context (Ngữ cảnh)** là yếu tố then chốt để mô hình lớn hiểu nhiệm vụ. Ý tưởng cốt lõi của MCP là: **cho phép AI dynamically lấy thông tin ngữ cảnh cần thiết**, thay vì nhét tất cả thông tin vào Prompt.

Ví dụ, khi AI cần đọc một tệp, bạn không cần sao chép dán nội dung tệp, mà thông qua MCP truy cập trực tiếp hệ thống tệp.
:::

### 2.2 Bối cảnh phát hành

Năm 2024, với việc phát hành Claude 3.5 Sonnet, Anthropic phát hiện một vấn đề: **mỗi công cụ đều phải tích hợp riêng**.

Hãy tưởng tượng:
- Bạn muốn AI đọc kho mã GitHub → phải viết code tích hợp GitHub
- Bạn muốn AI truy vấn cơ sở dữ liệu → phải viết code tích hợp cơ sở dữ liệu
- Bạn muốn AI thao tác hệ thống tệp → phải viết code tích hợp hệ thống tệp

Mỗi tích hợp đều phải viết lại code tương tự: xác thực, xử lý lỗi, chuyển đổi dữ liệu...

Anthropic đã viết trên blog chính thức:
> "We're introducing the Model Context Protocol (MCP), an open protocol that standardizes how applications provide context to LLMs."

**Mục tiêu cốt lõi**: Cho phép nhà phát triển công cụ viết code một lần, tất cả ứng dụng AI hỗ trợ MCP đều có thể sử dụng.

### 2.3 MCP là gì?

<McpVisualDemo />

**Ba năng lực cốt lõi**:

| Năng lực | Tiếng Anh | Tác dụng | Ví dụ |
|------|------|------|------|
| **Công cụ** | Tools | Chức năng AI có thể gọi | Truy vấn thời tiết, gửi email |
| **Tài nguyên** | Resources | Dữ liệu AI có thể đọc | Nội dung tệp, bản ghi cơ sở dữ liệu |
| **Prompt** | Prompts | Mẫu prompt được định nghĩa trước | Mẫu review code, mẫu viết |

### 2.4 Triển khai nội bộ của MCP

<McpDetailedDemo />

### 2.5 So sánh: Cổng USB-C

MCP giống như **cổng USB-C**:

- **Trước đây**: Mỗi thiết bị có cổng sạc riêng (tròn, dẹt, từ tính...)
- **Bây giờ**: USB-C đã thống nhất cổng sạc và truyền dữ liệu của tất cả thiết bị
- **MCP**: Thống nhất cách AI kết nối với tất cả công cụ

Nhà phát triển công cụ chỉ cần triển khai một MCP Server, tất cả ứng dụng AI hỗ trợ MCP (Claude, Cursor, Windsurf, v.v.) đều có thể sử dụng trực tiếp.

### 2.6 Kịch bản ứng dụng điển hình của MCP

| Kịch bản | Mô tả | Ví dụ |
|------|------|------|
| **Thao tác tệp cục bộ** | Cho phép AI đọc/sửa tệp cục bộ | Đọc kho mã, phân tích tệp log |
| **Truy vấn cơ sở dữ liệu** | Cho phép AI truy vấn trực tiếp cơ sở dữ liệu | Truy vấn SQL, phân tích dữ liệu |
| **Gọi API** | Cho phép AI gọi dịch vụ bên thứ ba | GitHub API, Slack, email |
| **Tích hợp công cụ phát triển** | Cho phép AI sử dụng công cụ phát triển | Thao tác Git, lệnh terminal |

**Trường hợp thực tế**:
- **Cursor/Windsurf**: Kết nối hệ thống tệp, Git, terminal qua MCP
- **Claude Desktop**: Kết nối phần mềm ghi chú, email client qua MCP
- **Script tự động**: Cho phép AI thực thi tác vụ tự động (sao lưu, triển khai, đồng bộ dữ liệu)

---

## 3. A2A (Agent-to-Agent Protocol)

### 3.1 Thông tin cơ bản về giao thức

| Mục | Nội dung |
|------|------|
| **Tên đầy đủ** | Agent-to-Agent Protocol |
| **Đơn vị khởi xướng** | Google |
| **Thời gian phát hành** | 9 tháng 4 năm 2025 |
| **Tài liệu chính thức** | [google.github.io/A2A](https://google.github.io/A2A) |
| **Giấy phép nguồn mở** | Apache 2.0 |
| **GitHub** | [github.com/google/A2A](https://github.com/google/A2A) |

::: tip Tại sao Google khởi xướng?
Google phát hành A2A tại hội nghị Cloud Next 2025, liên quan chặt chẽ đến chiến lược AI doanh nghiệp.

Google tin rằng: AI doanh nghiệp trong tương lai không phải là một siêu Agent đơn lẻ, mà là **nhiều Agent chuyên môn hợp tác** — có Agent phụ trách phân tích dữ liệu, có Agent phụ trách tạo mã, có Agent phụ trách xử lý tài liệu.

Các Agent này cần một cách chuẩn hóa để giao tiếp với nhau, A2A ra đời cho mục đích này.
:::

### 3.2 Bối cảnh phát hành

MCP đã giải quyết vấn đề "AI kết nối công cụ như thế nào", nhưng còn một vấn đề: **nhiều Agent hợp tác như thế nào?**

Hãy tưởng tượng kịch bản:
- Agent A là "chuyên gia phân tích yêu cầu"
- Agent B là "chuyên gia tạo mã"
- Agent C là "chuyên gia kiểm thử"

Người dùng nói: "Giúp tôi phát triển chức năng đăng nhập"

Agent A phân tích yêu cầu, cần giao việc cho Agent B; Agent B viết xong mã, cần Agent C kiểm thử. Chúng giao tiếp với nhau thế nào?

Google đã viết trên blog chính thức:
> "A2A is an open protocol that enables AI agents to communicate with each other, facilitating collaboration across different frameworks and vendors."

**Mục tiêu cốt lõi**: Cho phép các Agent do nhà cung cấp và framework khác nhau phát triển hợp tác liền mạch.

### 3.3 A2A là gì?

<A2AVisualDemo />

**Ba khái niệm cốt lõi**:

| Khái niệm | Tiếng Anh | Tác dụng | So sánh |
|------|------|------|------|
| **Agent Card** | Danh thiếp Agent | Mô tả khả năng của Agent | Thẻ nhân viên |
| **Task** | Nhiệm vụ | Đơn vị công việc cần thực hiện | Phiếu công việc |
| **Message** | Tin nhắn | Nội dung giao tiếp giữa các Agent | Lịch sử trò chuyện |

### 3.4 Triển khai nội bộ của A2A

<A2ADetailedDemo />

### 3.5 So sánh: WeChat Doanh nghiệp

A2A giống như **WeChat Doanh nghiệp**:

- **Agent Card**: Danh thiếp của mỗi người, hiển thị tên, phòng ban, trách nhiệm
- **Giao việc**: @ai đó, phân công một nhiệm vụ
- **Chat giao tiếp**: Có thể trò chuyện bất cứ lúc nào trong quá trình thực thi nhiệm vụ
- **Theo dõi nhiệm vụ**: Có thể xem tiến độ và trạng thái nhiệm vụ

Các Agent khác nhau giống như các đồng nghiệp khác nhau, A2A cho phép họ hợp tác hoàn thành dự án phức tạp.

### 3.6 Kịch bản ứng dụng điển hình của A2A

| Kịch bản | Mô tả | Ví dụ |
|------|------|------|
| **Phát triển phần mềm** | Nhiều Agent hợp tác hoàn thành nhiệm vụ phát triển | Phân tích yêu cầu→Mã→Kiểm thử→Triển khai |
| **Quy trình công việc doanh nghiệp** | Agent các phòng ban khác nhau hợp tác xử lý nghiệp vụ | Agent HR + Agent Tài chính + Agent Pháp chế |
| **Chăm sóc khách hàng thông minh** | Nhiều Agent chuyên môn phân công xử lý | Tiếp nhận→Giải đáp→Chuyển tiếp→Ghi nhận |
| **Phân tích dữ liệu** | Nhiều Agent hợp tác phân tích dữ liệu | Thu thập→Làm sạch→Phân tích→Trực quan→Báo cáo |

**Trường hợp thực tế**:
- **Google Agent Space**: Nhiều Agent trong doanh nghiệp hợp tác xử lý tài liệu, email, lịch trình
- **Đội phát triển phần mềm**: Agent Yêu cầu → Agent Mã → Agent Kiểm thử → Agent Triển khai
- **Hệ thống chăm sóc khách hàng thông minh**: Agent Tiếp nhận → Agent Giải đáp Chuyên môn → Agent Chuyển tiếp Nhân viên

---

## 4. MCP vs A2A: So sánh và Mối quan hệ

### 4.1 Khác biệt cốt lõi

| Chiều | MCP | A2A |
|------|-----|-----|
| **Đơn vị khởi xướng** | Anthropic (2024.11) | Google (2025.04) |
| **Định vị** | Kết nối giữa AI và công cụ | Hợp tác giữa Agent và Agent |
| **Phạm vi truyền thông** | Client-Server | Peer-to-Peer |
| **Định dạng dữ liệu** | JSON-RPC 2.0 | HTTP + JSON |
| **So sánh** | Cổng USB-C | WeChat doanh nghiệp |

### 4.2 Mối quan hệ giữa hai giao thức

MCP và A2A **không cạnh tranh mà bổ sung cho nhau**:

<ProtocolComparisonDemo />

### 4.3 Cách lựa chọn?

| Kịch bản | Lựa chọn |
|------|------|
| Cho AI gọi hàm hoặc công cụ cục bộ | Function Call |
| Sử dụng công cụ bên thứ ba (cơ sở dữ liệu, API, hệ thống tệp) | MCP |
| Xây dựng hệ thống hợp tác đa Agent | A2A |
| Cần cả tích hợp công cụ và hợp tác đa Agent | MCP + A2A |

---

## 5. Xu hướng tương lai của giao thức

### 5.1 Phát triển hệ sinh thái

**Hệ sinh thái MCP** (đầu năm 2025):
- Server chính thức cung cấp: hệ thống tệp, SQLite, Git, PostgreSQL, v.v.
- Server do cộng đồng đóng góp: Slack, Notion, Figma, Stripe, v.v.
- Ứng dụng hỗ trợ MCP: Claude Desktop, Cursor, Windsurf, Zed, v.v.

**Hệ sinh thái A2A** (vừa phát hành):
- Sản phẩm Agent của Google率先 hỗ trợ
- Cộng đồng nguồn mở đang phát triển SDK cho nhiều ngôn ngữ
- Ứng dụng doanh nghiệp đang trong giai đoạn khám phá

### 5.2 Quá trình tiêu chuẩn hóa

Hiện tại giao thức Agent vẫn đang trong "thời kỳ Chiến quốc":
- MCP và A2A là hai giao thức phổ biến nhất
- Còn có các giao thức mới nổi như ANP, AGP, v.v.
- Tương lai có thể hợp nhất hoặc thống nhất

So sánh với sự phát triển của Internet:
- Giai đoạn đầu: Nhiều giao thức mạng cục bộ cùng tồn tại
- Giai đoạn sau: TCP/IP trở thành tiêu chuẩn
- Hiện tại: Giao thức Agent cũng có thể tiến tới thống nhất

---

## 6. Tổng kết

::: tip Điểm chính
| Giao thức | Hiểu trong một câu | Thời gian phát hành | Đơn vị khởi xướng | Kịch bản áp dụng |
|------|-----------|---------|--------|---------|
| **MCP** | "USB-C" kết nối AI với công cụ | 2024.11 | Anthropic | Tích hợp công cụ, kết nối nguồn dữ liệu |
| **A2A** | "WeChat doanh nghiệp" của hợp tác Agent | 2025.04 | Google | Hợp tác đa Agent, ủy thác nhiệm vụ |

**Nhận định chính**:
1. MCP giải quyết vấn đề "AI lấy năng lực bên ngoài như thế nào"
2. A2A giải quyết vấn đề "nhiều AI hợp tác với nhau như thế nào"
3. Cả hai bổ sung cho nhau, tương lai có thể sử dụng kết hợp
4. Chọn giao thức theo kịch bản cụ thể, không có giải pháp hoàn hảo cho mọi trường hợp
:::

---

## Tài liệu tham khảo

1. **Tài liệu chính thức MCP**: [modelcontextprotocol.io](https://modelcontextprotocol.io)
2. **GitHub MCP**: [github.com/modelcontextprotocol](https://github.com/modelcontextprotocol)
3. **Blog phát hành Anthropic**: "Introducing the Model Context Protocol" (2024-11-25)
4. **Tài liệu chính thức A2A**: [google.github.io/A2A](https://google.github.io/A2A)
5. **GitHub A2A**: [github.com/google/A2A](https://github.com/google/A2A)
6. **Google CloudBlog**: "Announcing the Agent-to-Agent Protocol" (2025-04-09)

# Từ Vibe Coding đến Spec Coding: Sự Tiến hóa của Lập trình AI

> "Code is a lossy projection of intent."
> Mã là một phép chiếu có tổn thất của ý định.
> - Sean Grove, OpenAI, AI Engineer World's Fair 2025

## Ý tưởng Cốt lõi của Spec Coding: Mọi thứ đều là Markdown

Trước khi đi sâu vào Spec Coding, trước hết hãy hiểu triết lý nền tảng của Claude Code: **mọi thứ đều là Markdown**.

Trong triết lý thiết kế của Claude Code, hồ sơ quy trình, truyền tải thông tin và thậm chí hội thoại với mô hình đều có thể là Markdown:

- **CLAUDE.md**: một tài liệu Markdown cho quy ước dự án
- **.claude/rules/**: một tập hợp các tệp quy tắc Markdown phân lớp
- **specs/**: mô tả Markdown về yêu cầu tính năng
- **Lịch sử hội thoại**: hồ sơ trò chuyện của Claude Code bản thân đã ở định dạng Markdown
- **AGENTS.md**: chỉ dẫn Markdown xác định hành vi agent

Đây chính là cốt lõi của Spec Coding: **quy cách bản thân là mã**. Khi bạn viết yêu cầu, quyết định thiết kế và tiêu chí chấp nhận bằng Markdown, bạn đã đang viết "mã" - AI sẽ đọc Markdown đó và sau đó tạo triển khai thực tế.

Tóm tắt của Josh Beckman về bài diễn thuyết của Grove nắm bắt hoàn hảo:

> "Software engineering (and lawmaking and legal review) is specification repair."
> Kỹ nghệ phần mềm (và lập pháp và xem xét pháp lý) là sửa chữa quy cách.

Trong Claude Code, quy trình "sửa chữa quy cách" này là: **sửa đổi Markdown -> AI đọc Markdown -> tạo/sửa mã -> xác minh kết quả**. Toàn bộ quy trình làm việc được điều khiển bởi Markdown.

---

## 1. "The New Code" của Sean Grove: Một Bài Diễn thuyết Thay đổi Cách Bạn Suy nghĩ

Năm 2025, nhà nghiên cứu OpenAI **Sean Grove** đã có một bài diễn thuyết tiêu đề **"The New Code"** tại AI Engineer World's Fair và nó đã rung động toàn bộ cộng đồng nhà phát triển. Ông đề xuất một ý tưởng mang tính cách mạng: **trong 70 năm chúng ta đã viết mã để giải quyết vấn đề, nhưng mã chỉ là một phép chiếu có tổn thất của ý định - quy cách mới là "mã mới" thực sự.**

Bài diễn thuyết đó đã tạo ra một mô hình phát triển mới: **Spec Coding** - biến tài liệu quy cách, thay vì mã, thành tạo phẩm cốt lõi của phát triển và để AI tạo mã từ quy cách.

Bắt đầu từ bài diễn thuyết của Grove, bài viết này sẽ giúp bạn hiểu các ý tưởng cốt lõi của Spec Coding, xem lại giới hạn của Vibe Coding và cách áp dụng phương pháp luận này trong phát triển thực tế với Claude Code.

::: info 📚 Những gì bạn sẽ học được

1. Hiểu các ý tưởng chính trong bài diễn thuyết "The New Code" của Sean Grove
2. Nắm vững các khái niệm và phương pháp luận cốt lõi của Spec Coding
3. Nhận thức cả giá trị lẫn giới hạn của Vibe Coding
4. Học cách thực hành quy trình làm việc Spec Coding trong Claude Code
5. Nắm vững chiến lược chuyển đổi dần từ Vibe Coding sang Spec Coding

:::

---

## 1. "The New Code" của Sean Grove: Một Bài Diễn thuyết Thay đổi Cách Bạn Suy nghĩ

Năm 2025, nhà nghiên cứu OpenAI Sean Grove đã có một bài diễn thuyết tiêu đề **"The New Code"** tại AI Engineer World's Fair. Bài diễn thuyết này được coi là điểm khởi đầu trí tuệ của phong trào Spec Coding.

Grove trước đây sáng lập OneGraph, một công ty công cụ phát triển GraphQL sau đó được Netlify mua lại, và hiện làm việc về suy luận căn chỉnh tại OpenAI - giúp biến ý định cấp cao thành quy cách có thể thực thi và tiêu chuẩn đánh giá.

### 1.1 Luận điểm Cốt lõi: Mã là Phép chiếu Có tổn thất của Ý định

Khái niệm cốt lõi trong bài diễn thuyết của Grove có thể được tóm tắt trong một câu:

> **Code is a lossy projection of intent.**
> Mã là một phép chiếu có tổn thất của ý định.

Điều đó có nghĩa là gì? Khi bạn có một ý tưởng trong đầu và biến nó thành mã, một lượng lớn ngữ cảnh bị mất dọc đường - **tại sao** bạn chọn cách tiếp cận này, **những đánh đổi nào** bạn đã cân nhắc và **ràng buộc nào** quan trọng. Mã cuối cùng chỉ giữ lại "cách làm" trong khi mất đi "tại sao nên làm theo cách này."

Nó giống như nén một cuốn sách thành một tweet - mật độ thông tin giảm mạnh và ý định gốc bị suy giảm nghiêm trọng.

### 1.2 Bản chất của Lập trình là Giao tiếp

Grove đề xuất một ý tưởng đơn giản nhưng sâu sắc:

> "If you can communicate effectively, you can program."
> Nếu bạn có thể giao tiếp hiệu quả, bạn có thể lập trình.

Ông lập luận rằng công việc lập trình thực tế chỉ chiếm **10-20%** phát triển. 80% còn lại là **giao tiếp có cấu trúc** xung quanh yêu cầu và mục tiêu - hiểu người dùng muốn gì, đồng nhất với đội về giải pháp, xác định tiêu chí chấp nhận và xử lý các trường hợp biên.

Điều đó có nghĩa là cốt lõi của khả năng lập trình không phải là việc nắm vững cú pháp trong một ngôn ngữ cụ thể mà là khả năng **biến ý định mơ hồ thành mô tả chính xác**.

### 1.3 Ai Viết Quy cách là Lập trình viên

Đây là ý tưởng mang tính cách mạng nhất của Grove:

> "Whoever writes the spec - be it a PM, a lawmaker, an engineer, a marketer - is now the programmer."
> Ai viết quy cách - dù là PM, nhà lập pháp, kỹ sư, marketer - giờ là lập trình viên.

Khi AI ngày càng giỏi trong việc biến quy cách thành mã, **công việc lập trình thực sự** chuyển từ "viết mã" sang "viết quy cách." Ai có thể diễn đạt ý định chính xác nhất trở thành "lập trình viên" có giá trị nhất.

### 1.4 Quy cách Có thể Có Bộ công cụ Giống Mã

Grove chỉ ra rằng quy cách có thể có bộ công cụ hoàn chỉnh giống như mã:

> "Specs actually give us a very similar toolchain, but it's targeted at intentions rather than syntax."

- **Composition**: quy cách có thể module hóa và có thể kết hợp, giống như module mã
- **Testing**: quy cách có thể nhúng kiểm thử đơn vị để xác minh hành vi khớp kỳ vọng
- **Linting**: ngôn ngữ mơ hồ trong quy cách có thể được phát hiện, giống như linter bắt vấn đề cú pháp
- **Consistency checks**: quy cách giữa các phòng ban có thể được kiểm tra tính nhất quán, tương tự như type checker

### 1.5 OpenAI Model Spec: Bằng chứng Sống

Grove sử dụng tài liệu **Model Spec** của chính OpenAI làm bằng chứng.

Khi OpenAI phát hiện vấn đề nịnh nọt, họ không đào tạo lại mô hình. Thay vào đó, họ **sửa đổi tài liệu quy cách**. Thay đổi tự động lan truyền trên hệ thống và vấn đề được khắc phục.

Điều này chứng minh một điểm quan trọng: **quy cách bản thân có thể hoạt động như mã có thể thực thi**. Thay đổi quy cách tương đương với thay đổi hành vi mà không cần chạm vào một dòng mã truyền thống nào.

Tóm tắt của Josh Beckman về bài diễn thuyết của Grove nắm bắt hoàn hảo:

> "Software engineering (and lawmaking and legal review) is specification repair."
> Kỹ nghệ phần mềm (và lập pháp và xem xét pháp lý) là sửa chữa quy cách.

---

## 2. Spec Coding: Quy cách là Mã

### 2.1 Spec Coding là gì

Spec Coding, còn được gọi là Spec-Driven Development (SDD), là một phương pháp luận coi **tài liệu quy cách là tạo phẩm cốt lõi của phát triển**.

Ý tưởng cốt lõi là: **viết quy cách rõ ràng trước, sau đó để AI tạo mã từ quy cách đó. Quy cách là nguồn chân lý và mã chỉ là tạo phẩm triển khai được suy ra từ nó.**

Tuyên bố kinh điển của Robert C. Martin từ *Clean Code* trở nên mới mẻ trong kỷ nguyên AI:

> "Specifying requirements so precisely that a machine can execute them is programming."
> Chỉ định yêu cầu chính xác đến mức máy có thể thực thi chúng là lập trình.

### 2.2 So sánh Vibe Coding và Spec Coding

| Chiều | Vibe Coding | Spec Coding |
|------|------------|-------------|
| **Phương pháp** | Prompt ngẫu hứng, lặp qua lại | Viết quy cách hoàn chỉnh trước, sau đó tạo mã |
| **Phù hợp nhất** | Nguyên mẫu, hackathon, khám phá | Hệ thống sản xuất, cộng tác nhóm, doanh nghiệp |
| **Chất lượng mã** | Nhanh nhưng mong manh | Có cấu trúc, có thể kiểm thử, có thể kiểm toán |
| **Tỷ lệ thành công lần đầu** | Không ổn định | Nhắm đến 95%+ |
| **Tái sử dụng** | Prompt dùng một lần | Quy cách có thể tái sử dụng giữa các dự án |
| **Bảo mật** | Dễ bỏ sót | Được tích hợp ở lớp quy cách |
| **Tài liệu** | Thiếu hoặc luôn tụt hậu | Quy cách là tài liệu và luôn được duy trì |
| **Cộng tác nhóm** | Phụ thuộc kỹ năng prompting cá nhân | Quy cách chung, tiêu chuẩn chung |

Hai cách không đối lập nhau. Như Brad Jolicoeur chỉ ra:

> "Clever engineers will even use vibe coding as a first step to generate the initial draft of a specification."
> Các kỹ sư thông minh thậm chí sẽ sử dụng vibe coding như bước đầu tiên để tạo bản nháp ban đầu của quy cách.

### 2.3 Cấu trúc Quy cách Ba Lớp của Spec Coding

Các kỹ sư tại Red Hat đã tóm tắt một mô hình quy cách ba lớp thực tế:

**Lớp 1: Quy cách Chức năng (What)**

Mô tả kết quả kỳ vọng bằng ngôn ngữ tự nhiên và trả lời "nó nên làm gì":

```markdown
## Tính năng Xác thực Người dùng

### User Stories
- Là người dùng mới, tôi muốn đăng ký bằng email
- Là người dùng đã đăng ký, tôi muốn đăng nhập bằng email và mật khẩu
- Là người dùng quên mật khẩu, tôi muốn đặt lại qua email

### Tiêu chí Chấp nhận
- Xác thực định dạng email và độ mạnh mật khẩu khi đăng ký
- Khóa tài khoản 15 phút sau 5 lần đăng nhập thất bại
- Liên kết đặt lại mật khẩu có hiệu lực 30 phút
```

**Lớp 2: Quy cách Không phụ thuộc Ngôn ngữ (How - Lớp Kiến trúc)**

Xác định cấu trúc dữ liệu, mẫu kiến trúc và yêu cầu bảo mật:

```markdown
## Thiết kế Kỹ thuật

### Mô hình Dữ liệu
- bảng users: id, email, password_hash, created_at, locked_until
- bảng sessions: id, user_id, token, expires_at

### Thiết kế API
- POST /api/auth/register -> 201 Created
- POST /api/auth/login -> 200 OK + JWT
- POST /api/auth/reset-password -> 202 Accepted

### Yêu cầu Bảo mật
- Mật khẩu sử dụng bcrypt với cost factor >= 12
- JWT hết hạn trong 15 phút, refresh token trong 7 ngày
- Bật giới hạn tốc độ trên tất cả endpoint
```

**Lớp 3: Quy cách Cụ thể Ngôn ngữ (How - Lớp Triển khai)**

Yêu cầu phiên bản, framework kiểm thử và tiêu chuẩn tài liệu:

```markdown
## Ràng buộc Triển khai

### Ngăn xếp Công nghệ
- Runtime: Node.js 20+
- Framework: Express 5
- ORM: Prisma
- Testing: Vitest

### Quy ước Mã
- Sử dụng TypeScript strict mode
- Sử dụng lớp AppError tùy chỉnh cho xử lý lỗi
- Tất cả endpoint API yêu cầu bình luận JSDoc
```

---

## 3. Thực hành Spec Coding trong Claude Code

Khi đã hiểu lý thuyết, câu hỏi tiếp theo là cách áp dụng trong Claude Code. Triết lý thiết kế của Claude Code tự nhiên phù hợp với Spec Coding - `CLAUDE.md`, thư mục Rules và lệnh `/plan` đều là các hình thức phát triển hướng quy cách.

Khi chính OpenAI xây dựng dự án bằng Codex, họ sử dụng mẫu tương tự: sử dụng tệp `AGENTS.md` làm quy cách để hướng dẫn agent AI. Bài học cốt lõi của họ là: **khi agent gặp khó khăn, coi đó là tín hiệu - xác định những gì thiếu, dù là công cụ, rào bảo vệ hay tài liệu, và sau đó thêm vào kho**. Điều này hoàn toàn phù hợp với Spec Coding: quy cách là tạo phẩm sống và nên tiếp tục tiến hóa.

Nghiên cứu từ Augment Code ủng hộ cùng kết luận: **quy cách có thể thực thi giữ chính xác vì agent AI tạo mã trực tiếp từ chúng, tạo ra một hàm ép buộc - quy cách lỗi thời tạo ra triển khai bị hỏng**. Điều đó có nghĩa là quy cách không mục nát như tài liệu truyền thống.

### 3.1 Bước Một: Sử dụng `CLAUDE.md` để Thiết lập Quy cách Dự án

`CLAUDE.md` là "quy cách sống" của dự án bạn. Mỗi khi Claude Code khởi động, nó đọc tệp này, tương đương với việc cung cấp cho AI một sổ tay dự án liên tục.

Trong chương trước [Hướng dẫn Cốt lõi Bắt đầu Nhanh Claude Code](../basics/), chúng ta đã học cách tạo `CLAUDE.md`. Trong bối cảnh Spec Coding, vai trò của nó trở nên quan trọng hơn - **nó không chỉ là tệp cấu hình mà là điểm vào của quy cách dự án**.

Các kỹ sư tại LogRocket nhấn mạnh rằng **ngữ cảnh vững chắc rất quan trọng cho agent AI vì nó ngăn ảo giác và kém hiệu quả**. Không có quy cách, agent AI có thể tạo ra các thay đổi lớn không kiểm soát cho dự án. `CLAUDE.md` là tuyến phòng thủ đầu tiên cung cấp "ngữ cảnh vững chắc" đó.

```markdown
# Quy cách Dự án Thương mại Điện tử

## Định vị Dự án
Nền tảng thương mại điện tử SaaS cho thương gia vừa và nhỏ, hỗ trợ nhiều cửa hàng và nhiều kênh thanh toán.

## Quyết định Kiến trúc
- Phân tách frontend-backend với thiết kế API-first
- Kiến trúc backend microservice, các dịch vụ giao tiếp qua hàng đợi tin nhắn
- Phân tách đọc-ghi cơ sở dữ liệu

## Ràng buộc Cốt lõi
- Lưu trữ tất cả số tiền bằng số nguyên tính bằng cent để tránh vấn đề độ chính xác dấu phẩy động
- Máy trạng thái đơn hàng phải tuân thủ nghiêm ngặt: chờ thanh toán -> đã thanh toán -> đã giao -> hoàn thành
- Endpoint liên quan thanh toán phải là idempotent
```

Đội Aviator đã tóm tắt thông tin chính mà quy cách nên ghi nhận - và đó chính xác là những gì `CLAUDE.md` của bạn nên bao gồm:

- định dạng đầu vào và đầu ra và kiểu dữ liệu
- quy tắc kinh doanh và trường hợp biên
- phụ thuộc hệ thống và ràng buộc
- yêu cầu hiệu suất và khả năng mở rộng
- xử lý lỗi và yêu cầu bảo mật

### 3.2 Bước Hai: Sử dụng Thư mục Rules để Quản lý Quy cách Phân lớp

Khi dự án phát triển, một `CLAUDE.md` đơn sẽ không đủ. Lúc đó, sử dụng thư mục `.claude/rules/` để tổ chức quy cách phân lớp.

Đây chính xác là ý tưởng "quy cách có thể thực thi" mà Augment Code gọi: **quy cách không phải là tài liệu tĩnh mà là chỉ dẫn sống được tiêu thụ trực tiếp bởi agent AI**. Khi bạn chia quy tắc vào thư mục Rules, mỗi tệp quy tắc chỉ được tải khi các tệp liên quan đang được chỉnh sửa, vừa tiết kiệm token vừa giữ độ chính xác.

Các kỹ sư tại Tessl phát hiện rằng việc chia yêu cầu thành tài liệu có cấu trúc - với PRD xác định "cái gì và tại sao" và quy cách kỹ thuật xác định "như thế nào" - giúp ngăn AI tích lũy nhầm lẫn trong hội thoại dài và cải thiện đáng kể tính nhất quán đầu ra.

```text
.claude/rules/
├── 00-architecture.md      # Quy tắc kiến trúc (toàn cục)
├── 01-security.md          # Quy tắc bảo mật (toàn cục)
├── 10-api-design.md        # Quy tắc thiết kế API
├── 11-frontend-patterns.md # Quy tắc mẫu frontend
├── 12-database.md          # Quy tắc cơ sở dữ liệu
└── 20-testing.md           # Quy tắc kiểm thử
```

Mỗi tệp quy tắc có thể chỉ định phạm vi thông qua frontmatter:

```markdown
---
globs:
  - "src/api/**/*.ts"
  - "src/services/**/*.ts"
---

# Quy tắc Thiết kế API

## Thiết kế Route
- Phong cách RESTful, sử dụng danh từ số nhiều: /api/v1/orders
- Tài nguyên lồng nhau tối đa hai cấp: /api/v1/users/123/orders

## Định dạng Phản hồi
- Thành công: { data, pagination? }
- Lỗi: { error: { code, message, details? } }

## Phải Tuân thủ
- Tất cả thao tác ghi yêu cầu xác thực
- Tất cả endpoint danh sách phải hỗ trợ phân trang
- Thao tác nhạy cảm phải ghi nhật ký kiểm toán
```

Bằng cách đó, khi Claude Code chỉnh sửa tệp liên quan API, nó sẽ tự động tải quy cách này và đảm bảo mã được tạo tuân theo tiêu chuẩn.

### 3.3 Bước Ba: Sử dụng `/plan` để Triển khai Specify -> Plan -> Tasks -> Implement

Quy trình làm việc Spec Coding tiêu chuẩn là một vòng lặp bốn giai đoạn. GitHub Spec Kit tiêu chuẩn hóa nó thành Specify -> Plan -> Tasks -> Implement và lệnh `/plan` của Claude Code tự nhiên hỗ trợ quy trình này.

Đội SpecThis nhấn mạnh một nguyên tắc chính: **xác định ranh giới trước khi agent chạy - biết những gì nên thay đổi trước khi bất kỳ thay đổi mã nào xảy ra**. Đó chính xác là giá trị của `/plan`.

**Giai đoạn 1: Specify**

Trước hết viết rõ bạn muốn xây dựng gì. Đừng vội vào mã:

```text
/plan
Tôi cần triển khai tính năng hoàn tiền đơn hàng. Quy cách là:

Yêu cầu chức năng:
- Người dùng có thể yêu cầu hoàn tiền toàn bộ trước khi giao hàng
- Trong 7 ngày sau khi giao, người dùng có thể yêu cầu trả hàng và hoàn tiền
- Hoàn tiền yêu cầu phê duyệt quản trị viên

Tiêu chí chấp nhận:
- Số tiền hoàn không được vượt quá số tiền thực tế đã thanh toán cho đơn hàng
- Máy trạng thái hoàn tiền: đã yêu cầu -> đã phê duyệt -> đang hoàn -> đã hoàn
- Tồn kho được khôi phục sau khi hoàn tiền hoàn tất
- Ghi nhật ký mọi thao tác trong toàn bộ quy trình
```

**Giai đoạn 2: Plan**

Claude sẽ tạo kế hoạch kỹ thuật dựa trên quy cách của bạn:

```text
📋 Kế hoạch Triển khai Tính năng Hoàn tiền

1. Thiết kế mô hình dữ liệu
   - Tạo bảng refunds
   - Thêm trạng thái liên quan hoàn tiền vào máy trạng thái đơn hàng

2. Thiết kế API
   - POST /api/orders/:id/refund - yêu cầu hoàn tiền
   - PUT /api/refunds/:id/approve - phê duyệt hoàn tiền
   - GET /api/refunds - danh sách hoàn tiền

3. Logic kinh doanh
   - Kiểm tra điều kiện hoàn tiền
   - Tính toán số tiền hoàn
   - Logic khôi phục tồn kho

4. Tích hợp
   - Kết nối API hoàn tiền của nhà cung cấp thanh toán
   - Gửi thông báo hoàn tiền
```

**Giai đoạn 3: Tasks**

Chia kế hoạch thành các nhiệm vụ nhỏ có thể thực thi độc lập và cho mỗi nhiệm vụ tiêu chí hoàn thành rõ ràng.

**Giai đoạn 4: Implement**

Triển khai từng nhiệm vụ một, xác minh sau mỗi nhiệm vụ hoàn thành.

### 3.4 Ví dụ Thực tế: Xây dựng Hệ thống Thông báo Người dùng bằng Spec Coding

Hãy sử dụng một ví dụ đầy đủ để so sánh Vibe Coding và Spec Coding. Dữ liệu từ Orchestrator.dev cho thấy trong khảo sát Stack Overflow 2025, 84% nhà phát triển sử dụng hoặc dự định sử dụng công cụ AI nhưng chỉ 22% hài lòng với kết quả và 46% tin rằng độ chính xác là vấn đề. Spec Coding chính là chìa khóa để thu hẹp khoảng cách hài lòng đó.

**Cách tiếp cận Vibe Coding:**

```text
Bạn: Xây dựng tính năng thông báo
AI: [Ngay lập tức bắt đầu viết mã và tạo danh sách thông báo đơn giản]

Bạn: Nên hỗ trợ đã đọc và chưa đọc
AI: [Sửa mã và thêm trường read]

Bạn: Cũng cần nhiều loại thông báo
AI: [Thay đổi lại và thêm trường type]

Bạn: Cũng nên đẩy thông báo đến điện thoại
AI: [Viết lại lớn và cấu trúc trước không còn phù hợp lắm...]
```

Kết quả: sau bốn vòng thay đổi, kiến trúc đã bị lật đổ nhiều lần và mã ngày càng lộn xộn.

**Cách tiếp cận Spec Coding:**

Trước hết viết tài liệu quy cách `specs/notification.md`:

```markdown
# Quy cách Hệ thống Thông báo Người dùng

## Yêu cầu Chức năng
1. Hỗ trợ ba kênh: thông báo trong ứng dụng, thông báo email và thông báo đẩy
2. Loại thông báo: thông báo hệ thống, trạng thái đơn hàng, chương trình khuyến mãi, cảnh báo bảo mật
3. Người dùng có thể cấu hình tùy chọn thông báo theo kênh và loại
4. Hỗ trợ trạng thái đã đọc/chưa đọc và đánh dấu đã đọc hàng loạt

## Mô hình Dữ liệu
- bảng notifications: id, user_id, type, channel, title, content,
  is_read, created_at
- bảng notification_preferences: user_id, type, channel, enabled

## Thiết kế API
- GET /api/notifications?type=&is_read= - lấy danh sách thông báo (phân trang)
- PUT /api/notifications/:id/read - đánh dấu đã đọc
- PUT /api/notifications/read-all - đánh dấu tất cả đã đọc
- GET /api/notification-preferences - lấy cài đặt tùy chọn
- PUT /api/notification-preferences - cập nhật cài đặt tùy chọn

## Tiêu chí Chấp nhận
- Số thông báo chưa đọc cập nhật thời gian thực
- Danh sách thông báo hỗ trợ cuộn vô hạn
- Độ trễ thông báo đẩy < 3 giây
- Thay đổi tùy chọn có hiệu lực ngay lập tức
```

Sau đó trong Claude Code:

```text
@specs/notification.md
Triển khai hệ thống thông báo người dùng theo quy cách này.
Bắt đầu với mô hình dữ liệu, sau đó triển khai API và cuối cùng xây dựng component frontend.
Tạm dừng sau mỗi module hoàn thành và tôi sẽ xác nhận trước khi bạn tiếp tục.
```

Kết quả: hạ cánh sạch trong một lần, kiến trúc rõ ràng và không cần liên tục phá và xây lại.

### 3.5 Tăng cường Spec Coding bằng Superpowers

Trong chương trước [Superpowers cho Phát triển Cấp Kỹ nghệ](../superpowers/), chúng ta đã học hệ thống kỹ năng Superpowers. Spec Coding và Superpowers là bạn đồng hành tự nhiên:

| Giai đoạn Spec Coding | Kỹ năng Superpowers Phù hợp |
|------------------|---------------------|
| Xác định quy cách | `brainstorming` - sử dụng câu hỏi Socratic để làm rõ yêu cầu |
| Lập kế hoạch kỹ thuật | `writing-plans` - chia quy cách thành nhiệm vụ nhỏ |
| Triển khai tăng dần | `test-driven-development` - TDD red-green-refactor |
| Xác minh chất lượng | `code-review` + `verification-before-completion` |

**Ví dụ sử dụng kết hợp:**

```text
@specs/notification.md
Triển khai hệ thống thông báo theo quy cách này sử dụng TDD,
và giúp tôi review mã sau khi hoàn thành
```

Một chỉ dẫn này kích hoạt cả quy trình làm việc Spec Coding và các kỹ năng Superpowers như TDD và Code Review, hình thành quy trình phát triển cấp kỹ nghệ hoàn chỉnh.

### 3.6 Kiểm soát Phiên bản và Tiến hóa Liên tục của Quy cách

Vibe Coding Substack đã đề xuất một quan điểm quan trọng: **Specs are now code**. Nếu quy cách là mã thì chúng nên được quản lý như mã:

- **Kiểm soát phiên bản**: giữ tệp quy cách trong Git và commit cùng với mã
- **Theo dõi thay đổi**: mọi thay đổi quy cách đều có bản ghi commit để biết ai đã thay đổi cái gì và tại sao
- **Code review**: thay đổi quy cách cũng nên qua PR review để đội giữ đồng bộ
- **Tích hợp CI**: thay đổi quy cách kích hoạt kiểm thử tự động để xác minh triển khai có còn phù hợp với quy cách

Trong Claude Code, điều đó có nghĩa là `CLAUDE.md`, `.claude/rules/` và thư mục `specs/` của bạn đều nên được kiểm soát phiên bản. Kinh nghiệm của Robomotion là **quản lý phiên bản quy cách cùng với triển khai ngăn trôi dạt và giữ mọi thứ có thể kiểm toán**.

Thực tế Harness Engineering của OpenAI cũng xác nhận: tệp `AGENTS.md` của họ bản thân được viết bởi Codex và liên tục cập nhật khi dự án tiến hóa. Khi agent gặp khó khăn, cách sửa không phải thay đổi mã trực tiếp mà **yêu cầu Codex cập nhật chính quy cách** - hình thành vòng lặp tự phục hồi cho quy cách.

---

## 4. Chiến lược Kết hợp: Dần chuyển từ Vibe sang Spec

Đồng thuận ngành không phải là "từ bỏ Vibe Coding" mà **chọn cách tiếp cận đúng cho kịch bản đúng**.

### 4.1 Khi nào Sử dụng Vibe Coding

- Xác minh ý tưởng có khả thi hay không, với nguyên mẫu xây trong 30 phút
- Khám phá công nghệ hoặc framework không quen thuộc
- Hackathon hoặc demo nội bộ
- Script hoặc công cụ dùng một lần

### 4.2 Khi nào Sử dụng Spec Coding

- Phát triển tính năng sản xuất
- Dự án cộng tác nhiều người
- Mã cần bảo trì dài hạn
- Lĩnh vực nhạy cảm như bảo mật, thanh toán hoặc dữ liệu
- Thiết kế API và tích hợp hệ thống

### 4.3 Quy trình Làm việc Dần được Khuyến nghị

**Giai đoạn 1: Khám phá Vibe**

Sử dụng Vibe Coding để xác minh ý tưởng nhanh chóng. Đừng viết quy cách yet và đừng lo về chất lượng mã:

```text
Xây dựng một popup thông báo đơn giản để chúng ta có thể xem cảm giác thế nào
```

**Giai đoạn 2: Tinh chỉnh Quy cách**

Khi tính khả thi được xác nhận, tổ chức những gì học được trong quá trình khám phá thành quy cách. Bạn thậm chí có thể yêu cầu AI giúp:

```text
Dựa trên nguyên mẫu tính năng thông báo chúng ta vừa xây,
giúp tôi tổ chức thành tài liệu quy cách chức năng chính thức,
bao gồm mô hình dữ liệu, thiết kế API và tiêu chí chấp nhận
```

**Giai đoạn 3: Xây dựng lại bằng Spec**

Dựa trên quy cách đó, triển khai lại phiên bản cấp sản xuất bằng Spec Coding:

```text
@specs/notification.md
Triển khai lại từ đầu theo quy cách và không tham khảo mã nguyên mẫu trước đó
```

Ưu điểm của quy trình làm việc này rõ ràng: **sử dụng tốc độ của Vibe Coding để xác minh hướng và chất lượng của Spec Coding để giao sản phẩm**.

Robomotion tóm tắt tốt:

> "The spec is the source of truth. The AI generated output is the draft implementation. Validation is not optional."
> Quy cách là nguồn chân lý. Đầu ra do AI tạo là triển khai nháp. Xác minh không phải tùy chọn.

---

## 5. Câu hỏi Thường gặp

### Hỏi 1: Spec Coding có cảm thấy quá chậm không?

Viết quy cách đòi hỏi đầu tư ban đầu. Nhưng đội của Greg Ceccarelli đã sử dụng Spec Coding để giao một sản phẩm macOS hoàn chỉnh với **ba người trong bốn tuần** - điều gần như không thể trong phát triển truyền thống.

Thời gian dành viết quy cách sớm sẽ được thu hồi sau thông qua ít làm lại, ít lỗi và chi phí giao tiếp thấp hơn.

### Hỏi 2: Quy cách nên chi tiết đến mức nào?

Gợi ý của Robomotion là: **một quy cách chất lượng cao có thể chỉ dài một trang**. Điều quan trọng là có trả lời tám câu hỏi này:

1. Chúng ta đang tự động hóa cái gì?
2. Đầu vào là gì?
3. Đầu ra là gì?
4. Ràng buộc là gì?
5. Chế độ thất bại là gì?
6. Yêu cầu bảo mật là gì?
7. Yêu cầu hiệu suất là gì?
8. Những kiểm thử nào chứng minh nó hoạt động?

### Hỏi 3: Nếu AI chỉ làm chính xác những gì quy cách nói và bỏ sót tính năng "hiển nhiên"?

Đây thực sự là một giới hạn của Spec Coding. Phản hồi từ người dùng GitHub Spec Kit là AI sẽ làm **"chính xác và chỉ"** những gì được viết trong quy cách.

Giải pháp là thêm phần "yêu cầu phi chức năng" vào quy cách và liệt kê các kỳ vọng phổ biến ở đó như xử lý lỗi, ghi nhật ký và khả năng truy cập. Hoặc đặt quy tắc toàn cục trong `CLAUDE.md`.

### Hỏi 4: Dự án nhỏ cũng cần Spec Coding không?

Không. Spec Coding phù hợp nhất cho:

- dự án cấp sản xuất
- dự án cộng tác nhóm
- dự án cần bảo trì dài hạn

Đối với nguyên mẫu nhanh, script dùng một lần và thử nghiệm học tập, Vibe Coding phù hợp hơn.

### Hỏi 5: Làm sao để đội chấp nhận Spec Coding?

Bắt đầu với một tính năng nhỏ làm thử nghiệm. Để đội thấy cách Spec Coding giảm làm lại và cải thiện tỷ lệ thành công lần đầu. Khảo sát Stack Overflow 2025 cho thấy 84% nhà phát triển sử dụng hoặc dự định sử dụng công cụ AI nhưng chỉ 22% hài lòng với kết quả - Spec Coding chính là chìa khóa để cải thiện sự hài lòng đó.

---

## 6. Tóm tắt

Chuyển từ Vibe Coding sang Spec Coding không phải là cách mạng. Nó là sự tiến hóa.

Sean Grove đã nói rất rõ trong "The New Code": **trong 70 năm, chúng ta đã viết mã để giải quyết vấn đề; giờ chúng ta nên viết quy cách để tạo mã**. Mã là phép chiếu có tổn thất của ý định, trong khi quy cách có thể ghi nhận đầy đủ ý định, ngữ cảnh và ràng buộc.

Đối với nhà phát triển sử dụng Claude Code, sự chuyển dịch này đang diễn ra:

- `CLAUDE.md` bạn viết là quy cách dự án của bạn
- Thư mục Rules bạn cấu hình là hệ thống quy cách phân lớp của bạn
- Việc lập kế hoạch bằng `/plan` là quy trình Specify -> Plan -> Tasks
- Kết hợp TDD và Code Review từ Superpowers cho bạn quy trình làm việc Spec Coding hoàn chỉnh

**Điểm chính:**

- Vibe Coding phù hợp cho khám phá và nguyên mẫu, trong khi Spec Coding phù hợp cho sản xuất và cộng tác
- Quy cách là nguồn chân lý và mã là tạo phẩm triển khai được tạo từ nó
- Khả năng viết quy cách = khả năng lập trình và khả năng giao tiếp quan trọng hơn khả năng cú pháp
- Bắt đầu nhỏ: chỉ bằng cách viết `CLAUDE.md` tốt, bạn đã bước bước đầu tiên vào Spec Coding

::: tip 💡 Bước tiếp theo
Trong chương tiếp theo, chúng ta sẽ học cách sử dụng khả năng Agent Teams của Claude Code để nhiều instance AI có thể cộng tác như một đội phát triển thực sự.
:::

---

## Tài liệu Tham khảo

### Liên quan đến Bài diễn thuyết "The New Code" của Sean Grove

- [Code is just a lossy projection of intent — The Decoder](https://the-decoder.com/code-is-just-a-lossy-projection-of-intent-according-to-openai-researcher-sean-grove/)
- [The End of Coding? How Specifications Are Becoming the New Source Code — Implicator](https://www.implicator.ai/the-end-of-coding-how-specifications-are-becoming-the-new-source-code/)
- [OpenAI: Intent, Not Code, Drives Future Software Development — AI Tech Suite](https://www.aitechsuite.com/ai-news/openai-intent-not-code-drives-future-software-development)
- [Note on The New Code — Josh Beckman](https://www.joshbeckman.org/notes/914234100)
- [Bản ghi đầy đủ của "The New Code"](https://lawwu.github.io/transcripts/8rABwKRsec4.html)

### Phương pháp luận Spec Coding

- [How spec-driven development improves AI coding quality — Red Hat](https://developers.redhat.com/articles/2025/10/22/how-spec-driven-development-improves-ai-coding-quality)
- [Spec-Driven Development with AI: Complete 2025 Guide — Dplooy](https://www.dplooy.com/blog/spec-driven-development-with-ai-complete-2025-guide)
- [Spec-Driven Development: Building Production-Ready Software with AI — Orchestrator.dev](https://orchestrator.dev/blog/2025-12-16-spec_driven_dev_article)
- [Agents Code but the Problem of Clear Specification Remains — Greg Ceccarelli](https://www.gregceccarelli.com/writing/beyond-code-centric)

### Vibe Coding so với Spec Coding

- [Vibe Coding vs Spec Driven — Cosmo Edge](https://cosmo-edge.com/vibe-coding-vs-spec-driven-ai-development/)
- [Master AI in Software Engineering: Vibe vs. Spec Coding — Brad Jolicoeur](https://bradjolicoeur.com/article/ai-software-engineering-vibe-spec-prompting)
- [From Vibe Coding to Spec-Driven Development — Tessl](https://tessl.io/blog/from-vibe-coding-to-spec-driven-development/)
- [Spec First Approach for Enterprise — Robomotion](https://robomotion.io/blog/spec-first-approach-the-way-to-adapt-vibe-coding-for-enterprise-work)

### Công cụ và Thực hành

- [GitHub Spec Kit vs Vibe Coding — Ossels](https://ossels.ai/github-spec-kit-spec-driven-development/)
- [A Spec-First Workflow for Agentic AI — LogRocket](https://blog.logrocket.com/spec-first-workflow-agentic-ai/)
- [Specs Are Now Code — The Vibe Coding Substack](https://thevibecoding.substack.com/p/specs-are-now-code)
- [Harness Engineering — Martin Fowler](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html)
- [Spec-Driven Development & AI Agents Explained — Augment Code](https://www.augmentcode.com/guides/spec-driven-development-ai-agents-explained)
- [Spec-Driven Development: The Key to Scalable AI Agents — Aviator](https://www.aviator.co/blog/spec-driven-development/)

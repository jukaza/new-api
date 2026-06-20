# Nguyên Lý Tổ Chức Máy Tính

::: tip Lời Nói Đầu
**Sau khi từ transistor đến CPU, máy tính hình thành hệ thống hoàn chỉnh như thế nào?** Chương trước chúng ta bắt đầu từ transistor, xây dựng bộ cộng, thanh ghi, đơn vị tính toán và cuối cùng lắp ráp thành lõi CPU. Nhưng chỉ có CPU là chưa đủ — nó cần phối hợp với bộ nhớ, thiết bị I/O, cần bus để kết nối các thành phần, cần hệ thống lệnh để vận hành. Chương này chúng ta sẽ chuyển từ góc nhìn bên trong CPU sang góc nhìn toàn bộ hệ thống máy tính, hiểu sâu về kiến trúc Von Neumann, hệ thống lệnh, phân cấp lưu trữ, bus và I/O.
:::

**Bài viết này sẽ dạy bạn điều gì?**

Sau khi học xong chương này, bạn sẽ có được:

- **Góc nhìn hệ thống**: Hiểu cách CPU, bộ nhớ, I/O phối hợp với nhau, không còn là người yêu thích phần cứng đơn lẻ
- **Thuật ngữ phần cứng chuyên nghiệp**: Nắm vững các khái niệm cốt lõi như chu kỳ lệnh, pipeline, CPI, tỉ lệ cache hit
- **Tư duy hiệu năng**: Hiểu các nút thắt cổ chai và biện pháp tối ưu trong tổ chức máy tính
- **Nền tảng cho học tập tiếp theo**: Xây dựng nền tảng vững chắc cho hệ điều hành, kiến trúc máy tính, phát triển nhúng

| Chương | Nội Dung | Khái Niệm Cốt Lõi |
|-----|------|---------|
| **Chương 1** | Kiến trúc Von Neumann | Lưu trữ chương trình, năm thành phần, đường dữ liệu |
| **Chương 2** | Hệ thống lệnh | Định dạng lệnh, chế độ địa chỉ, CISC vs RISC |
| **Chương 3** | Bộ điều khiển CPU | Đơn vị điều khiển, vi thao tác, chu kỳ lệnh |
| **Chương 4** | Hệ thống lưu trữ | Cache, bộ nhớ chính, bộ nhớ ảo, cơ chế phân trang |
| **Chương 5** | Bus và I/O | Phân xử bus, DMA, cơ chế ngắt |

---

## 0. Toàn Cảnh: Hệ Thống Phần Cứng Máy Tính

Trong chương trước "Từ Transistor đến CPU", chúng ta đã hiểu cách CPU hoạt động bên trong — từ fetch, decode, execute đến write back. Nhưng CPU chỉ là một đơn vị thực thi, để máy tính thực sự "có thể sử dụng", cần có sự phối hợp của một loạt các thành phần ngoại vi.

<CpuArchitectureDemo />

::: tip Giải Cấu Theo Tầng: Hệ Thống Phần Cứng Máy Tính
- **Tầng thứ nhất: Lõi CPU**
  Chịu trách nhiệm thực thi lệnh, bao gồm đơn vị điều khiển (phát tín hiệu điều khiển) và đơn vị tính toán (thực hiện phép toán số học và logic)

- **Tầng thứ hai: Tập thanh ghi**
  Đơn vị lưu trữ tốc độ cao bên trong CPU, bao gồm thanh ghi đa năng và thanh ghi chuyên dụng (PC, IR, MAR, MDR, v.v.)

- **Tầng thứ ba: Bộ nhớ chính**
  Bộ nhớ dùng để lưu trữ chương trình và dữ liệu, CPU truy cập qua bus địa chỉ và bus dữ liệu

- **Tầng thứ tư: Thiết bị I/O**
  Thiết bị nhập xuất kết nối với bus hệ thống qua bộ điều khiển I/O

- **Tầng thứ năm: Bus hệ thống**
  Kênh dữ liệu kết nối CPU, bộ nhớ, I/O, bao gồm bus địa chỉ, bus dữ liệu, bus điều khiển
:::

---

## 1. Kiến Trúc Von Neumann: "Hiến Pháp" Của Máy Tính Hiện Đại

### 1.1 Nguyên Lý Lưu Trữ Chương Trình

Năm 1945, nhà toán học John von Neumann đã đề xuất ý tưởng mang tính cách mạng về kiến trúc **lưu trữ chương trình (Stored-program)**. Ý tưởng này đã đặt nền móng cho máy tính hiện đại.

::: tip Khái Niệm Cốt Lõi
**Lưu trữ chương trình**: Chương trình là một loại dữ liệu đặc biệt, được lưu trữ trong bộ nhớ giống như dữ liệu thông thường. CPU có thể đọc và thực thi các lệnh chương trình được lưu trong bộ nhớ giống như đọc ghi dữ liệu.
:::

Điều này có nghĩa là:
- **Máy tính thời kỳ đầu**: Chương trình được thực hiện bằng cách nối dây cố định, thay đổi chương trình cần hàn lại mạch
- **Kiến trúc Von Neumann**: Chương trình được lưu trong bộ nhớ, thay đổi chương trình chỉ cần sửa đổi nội dung bộ nhớ

### 1.2 Năm Thành Phần Chính

Kiến trúc Von Neumann chia máy tính thành năm thành phần cốt lõi:

<RegisterDemo />

| Thành Phần | Tiếng Anh | Chức Năng | Thành Phần Chính |
|------|------|------|---------|
| **Bộ Tính Toán** | ALU (Arithmetic Logic Unit) | Thực hiện phép toán số học và logic | Bộ cộng, bộ dịch, bộ so sánh |
| **Bộ Điều Khiển** | CU (Control Unit) | Điều phối công việc của các thành phần | Thanh ghi lệnh, bộ giải mã, bộ tạo xung |
| **Bộ Nhớ** | Memory | Lưu trữ chương trình và dữ liệu | MAR (Memory Address Register), MDR (Memory Data Register) |
| **Thiết Bị Nhập** | Input | Nhập thông tin | Bàn phím, chuột, máy quét |
| **Thiết Bị Xuất** | Output | Xuất thông tin | Màn hình, máy in |

### 1.3 Đường Dữ Liệu

**Đường dữ liệu (Data Path)** là đường đi của dữ liệu giữa các thành phần chức năng. Bên trong CPU, đường dữ liệu kết nối:

- Tập thanh ghi
- Đơn vị số học và logic (ALU)
- Thanh ghi dữ liệu bộ nhớ (MDR)

Độ rộng của đường dữ liệu (số bit có thể truyền một lần) ảnh hưởng trực tiếp đến hiệu năng máy tính.

### 1.4 Nút Thắt Cổ Chai Von Neumann

Kiến trúc Von Neumann có một **nút thắt cổ chai hiệu năng** nổi tiếng:

> Tốc độ truyền dữ liệu giữa CPU và bộ nhớ thấp hơn nhiều so với tốc độ xử lý của CPU.

Điều này khiến CPU thường ở trạng thái "chờ dữ liệu". Nhiều kỹ thuật tối ưu của máy tính hiện đại được phát triển xoay quanh vấn đề này:

| Kỹ Thuật Tối Ưu | Nguyên Lý |
|---------|------|
| **Cache** | Đặt bộ nhớ tốc độ cao dung lượng nhỏ gần CPU |
| **Pipeline Lệnh** | Cho nhiều lệnh cùng ở các giai đoạn khác nhau |
| **Siêu Vô Hướng** | Phát nhiều lệnh trong cùng một chu kỳ đồng hồ |
| **Đa Nhân Song Song** | Nhiều lõi CPU chia sẻ tác vụ tính toán |

---

## 2. Hệ Thống Lệnh: Giao Diện Giữa CPU và Phần Mềm

Phần trước chúng ta đã biết ý tưởng cốt lõi của kiến trúc Von Neumann: **chương trình được lưu trong bộ nhớ giống như dữ liệu**. Nhưng điều này đặt ra một câu hỏi quan trọng — "chương trình" trong bộ nhớ trông như thế nào? CPU làm sao đọc hiểu nó?

Câu trả lời chính là **hệ thống lệnh (Instruction Set Architecture, ISA)**. Nếu ví CPU như một dịch vụ, thì hệ thống lệnh chính là **tài liệu API** của nó — nó định nghĩa tất cả các lệnh CPU có thể hiểu, định dạng của mỗi lệnh, và phạm vi dữ liệu mà lệnh có thể thao tác. Mỗi dòng code bạn viết, cuối cùng đều được trình biên dịch dịch thành chuỗi lời gọi "API" này.

### 2.1 Từ Code Đến Lệnh: Hành Trình Dịch Của Một Dòng Code

Trước tiên hãy xây dựng nhận thức toàn cục: code bạn viết trong editor và thứ CPU thực sự thực thi cách nhau mấy tầng dịch.

<CodeToInstructionDemo />

Chuỗi dịch này là chìa khóa để hiểu hệ thống lệnh:

| Tầng | Nội Dung | Ai Có Thể Hiểu |
|------|------|---------|
| Ngôn ngữ bậc cao | `int a = 10 + 5;` | Con người |
| Hợp ngữ | `MOV R1, #10` / `ADD R3, R1, R2` | Con người (cần đào tạo) |
| Mã máy | `0001 0001 0000 1010` | CPU |

::: tip Tại sao cần hiểu chuỗi này?
- Khi thấy lỗi biên dịch, bạn biết lỗi xảy ra ở bước "ngôn ngữ bậc cao → hợp ngữ"
- Khi thấy crash runtime, bạn biết vấn đề ở giai đoạn CPU thực thi lệnh
- Khi hiểu tối ưu hiệu năng, bạn biết trình biên dịch đã làm những tối ưu gì trong quá trình "dịch"
- Khi chọn kiến trúc CPU (x86 vs ARM), bạn biết sự khác biệt nằm ở "API tập lệnh" khác nhau
:::

### 2.2 Một Lệnh Trông Như Thế Nào?

Biết code được dịch thành lệnh, câu hỏi tiếp theo là: **cấu trúc bên trong của một lệnh là gì?**

Mỗi lệnh máy thực chất là một chuỗi số nhị phân, nhưng nó có định dạng nội bộ nghiêm ngặt. Hai phần cốt lõi nhất:

- **Mã thao tác (Opcode)**: Nói cho CPU biết "làm gì" — là phép cộng? nhảy? hay đọc bộ nhớ?
- **Toán hạng (Operand)**: Nói cho CPU biết "với ai" — thanh ghi nào? địa chỉ bộ nhớ nào? hằng số nào?

Giống như một câu có cấu trúc "động từ + tân ngữ", lệnh cũng có cấu trúc "thao tác + đối tượng":

```
Lệnh:  ADD  R3, R1, R2
       ───  ──────────
       Mã thao tác  Toán hạng
       (làm phép cộng) (R3 = R1 + R2)
```

Dựa trên số lượng toán hạng, định dạng lệnh được chia thành bốn loại từ đơn giản đến phức tạp:

<InstructionFormatDemo />

| Định Dạng | Cấu Trúc | Ví Dụ | Tình Huống Sử Dụng |
|------|------|------|---------|
| Không địa chỉ | Chỉ có mã thao tác | `RET` (trở về) | Máy tính ngăn xếp, toán hạng ngầm ở đỉnh stack |
| Một địa chỉ | Mã thao tác + 1 địa chỉ | `INC R1` (R1 tăng 1) | Phép toán đơn toán hạng |
| Hai địa chỉ | Mã thao tác + 2 địa chỉ | `MOV R1, R2` | Phổ biến nhất, truyền dữ liệu và tính toán |
| Ba địa chỉ | Mã thao tác + 3 địa chỉ | `ADD R3, R1, R2` | Không phá hủy toán hạng nguồn |

::: tip Tại sao có nhiều định dạng như vậy?
Đây là **sự đánh đổi giữa không gian và tính linh hoạt**. Lệnh không địa chỉ ngắn nhất (tiết kiệm bộ nhớ), nhưng cần thêm thao tác ngăn xếp; lệnh ba địa chỉ linh hoạt nhất (không phá hủy dữ liệu nguồn), nhưng chiếm nhiều bit hơn. Các kiến trúc CPU khác nhau sẽ chọn tổ hợp định dạng lệnh khác nhau.
:::

### 2.3 CPU Tìm Dữ Liệu Như Thế Nào? — Chế Độ Địa Chỉ

Lệnh bảo CPU "làm phép cộng", nhưng hai số để cộng ở đâu? Có thể được viết trực tiếp trong lệnh, có thể trong thanh ghi, cũng có thể ở một địa chỉ bộ nhớ nào đó. **Chế độ địa chỉ** là quy tắc nói cho CPU biết "đi đâu tìm toán hạng".

Dùng phép so sánh "tìm người" trong cuộc sống:

| Chế Độ Địa Chỉ | Phép So Sánh | Ví Dụ Lệnh | Mô Tả |
|---------|------|---------|------|
| **Địa chỉ tức thời** | Người đó đứng ngay trước mặt bạn | `MOV R1, #100` | Dữ liệu được viết trực tiếp trong lệnh, nhanh nhất |
| **Địa chỉ thanh ghi** | Gọi điện thoại nội bộ tìm đồng nghiệp | `MOV R1, R2` | Dữ liệu trong thanh ghi CPU, rất nhanh |
| **Địa chỉ trực tiếp** | Biết số nhà, đến thẳng | `MOV R1, [0x1000]` | Địa chỉ bộ nhớ được viết trong lệnh |
| **Địa chỉ gián tiếp** | Hỏi lễ tân "Trương Tam ở phòng nào" | `MOV R1, [R2]` | Thanh ghi chứa địa chỉ, cần tra thêm một lần |
| **Địa chỉ chỉ mục** | "Tòa 3 + tầng 5" để tính ra phòng | `MOV R1, [R2+10]` | Địa chỉ cơ sở + độ lệch, dùng cho truy cập mảng |

<AddressingModeDemo />

::: tip Tại sao cần nhiều chế độ địa chỉ như vậy?
Các tình huống khác nhau cần chiến lược "tìm dữ liệu" khác nhau:
- **Gán hằng số** (`x = 100`) → Địa chỉ tức thời, dữ liệu nằm ngay trong lệnh
- **Phép toán biến** (`a + b`) → Địa chỉ thanh ghi, dữ liệu đã được nạp vào thanh ghi
- **Truy cập mảng** (`arr[i]`) → Địa chỉ chỉ mục, địa chỉ cơ sở + độ lệch chỉ số
- **Thao tác con trỏ** (`*ptr`) → Địa chỉ gián tiếp, thanh ghi chứa địa chỉ

Khi viết `arr[i]`, bạn không nghĩ đến chế độ địa chỉ, nhưng trình biên dịch sẽ tự động chọn cách phù hợp nhất.
:::

### 2.4 Danh Sách Năng Lực Của CPU — Phân Loại Lệnh

Bây giờ chúng ta đã biết định dạng lệnh và chế độ địa chỉ, câu hỏi cuối cùng: **CPU thực sự có thể làm những việc gì?**

Tất cả các lệnh có thể được phân thành sáu loại lớn, chúng bao phủ mọi thao tác máy tính có thể thực hiện:

| Loại | Làm Gì | Lệnh Đại Diện | Code Bạn Viết Tương Ứng |
|------|-------|---------|-------------|
| **Truyền dữ liệu** | Vận chuyển dữ liệu | MOV, LOAD, STORE | `let x = y`, truyền tham số hàm |
| **Phép toán số học** | Cộng trừ nhân chia | ADD, SUB, MUL, DIV | `a + b`, `count++` |
| **Phép toán logic** | Thao tác bit | AND, OR, NOT, XOR | `flags & 0xFF`, kiểm tra quyền |
| **Phép dịch** | Dịch trái dịch phải | SHL, SHR | `x << 2` (tương đương nhân 4) |
| **Chuyển điều khiển** | Nhảy và gọi | JMP, CALL, RET | `if`, `for`, gọi hàm |
| **Nhập xuất** | Giao tiếp với thiết bị ngoại vi | IN, OUT | Đọc bàn phím, ghi màn hình |

::: tip Một Hiểu Biết Quan Trọng
Tất cả code bạn viết — dù logic nghiệp vụ phức tạp đến đâu, UI animation đẹp mắt thế nào — cuối cùng đều được phân rã thành tổ hợp của sáu loại thao tác cơ bản này. "Trí thông minh" của CPU không nằm ở việc nó có thể làm những việc phức tạp, mà ở việc nó có thể thực hiện những thao tác đơn giản này với tốc độ hàng tỉ lần mỗi giây.
:::

### 2.5 Hai Triết Lý Thiết Kế: CISC vs RISC

Thiết kế hệ thống lệnh có một sự phân kỳ cơ bản: **nên làm cho mỗi lệnh mạnh mẽ nhất có thể, hay làm cho mỗi lệnh đơn giản nhất có thể?**

Sự phân kỳ này tạo ra hai trường phái, ảnh hưởng trực tiếp đến mọi thiết bị bạn dùng ngày nay:

<CISCvsRISCDemo />

Dùng một phép so sánh để hiểu:
- **CISC giống dao đa năng Thụy Sĩ**: Một con dao tích hợp kéo, mở nắp chai, tua vít... nhiều chức năng nhưng mỗi cái không hẳn là tốt nhất
- **RISC giống bộ công cụ chuyên nghiệp**: Mỗi công cụ chỉ làm một việc, nhưng làm nhanh và tốt

::: tip Tại sao điện thoại của bạn dùng ARM, máy tính dùng x86?
- **x86 (CISC)** thống trị thị trường PC và máy chủ suốt 40 năm, tích lũy hệ sinh thái phần mềm khổng lồ. Đổi kiến trúc đồng nghĩa với việc tất cả phần mềm phải biên dịch lại
- **ARM (RISC)** nhờ ưu thế tiêu thụ điện năng thấp đã thống trị thiết bị di động. Pin điện thoại nhỏ, mỗi milliwatt đều quý giá
- **Apple Silicon** đã chứng minh RISC cũng có thể đạt hiệu năng cao — chip dòng M vượt qua đối thủ x86 cả về hiệu năng lẫn tiêu thụ điện
- **RISC-V** là kiến trúc RISC mã nguồn mở, đang nổi lên nhanh chóng trong lĩnh vực IoT, giáo dục, chip AI
:::

---

> **Tóm tắt**: Hệ thống lệnh là cầu nối giữa phần mềm và phần cứng. Code bạn viết được trình biên dịch dịch thành lệnh, lệnh thông qua mã thao tác và toán hạng nói cho CPU biết làm gì, với ai, chế độ địa chỉ quyết định dữ liệu đến từ đâu. Các thiết kế tập lệnh khác nhau (CISC/RISC) quyết định đặc tính hiệu năng và tình huống áp dụng của CPU.
>
> Bây giờ chúng ta đã biết "cấu trúc tĩnh" của lệnh — nó trông như thế nào, có những loại nào. Câu hỏi tiếp theo là: **CPU thực thi từng lệnh này từng bước như thế nào bên trong?** Đây chính là công việc của bộ điều khiển.

---

## 3. Bộ Điều Khiển: "Trung Tâm Chỉ Huy" Của CPU

### 3.1 Thành Phần Của Bộ Điều Khiển

Bộ điều khiển là "bộ não" của CPU, chịu trách nhiệm điều phối các thành phần làm việc theo yêu cầu của lệnh:

<ControllerDemo />

| Thành Phần | Chức Năng |
|------|------|
| **Bộ đếm chương trình (PC)** | Lưu địa chỉ lệnh tiếp theo |
| **Thanh ghi lệnh (IR)** | Lưu lệnh đang được thực thi |
| **Bộ giải mã lệnh** | Phân tích mã thao tác và toán hạng của lệnh |
| **Bộ tạo xung** | Tạo tín hiệu nhịp, điều khiển thời gian các thành phần |
| **Bộ tạo chuỗi vi thao tác** | Tạo chuỗi tín hiệu điều khiển cần thiết để thực thi lệnh |

<PSWFlagDemo />

### 3.2 Chu Kỳ Lệnh

CPU thực thi một lệnh cần trải qua một **chu kỳ lệnh** hoàn chỉnh, thường bao gồm:

1. **Chu kỳ lấy lệnh (Fetch)**: Đọc lệnh từ bộ nhớ vào IR
2. **Chu kỳ giải mã (Decode)**: Phân tích ý nghĩa lệnh
3. **Chu kỳ thực thi (Execute)**: Thực hiện thao tác
4. **Chu kỳ truy cập bộ nhớ (Memory Access)**: Nếu cần, truy cập bộ nhớ
5. **Chu kỳ ghi lại (Write Back)**: Ghi kết quả trở lại thanh ghi hoặc bộ nhớ

### 3.3 Vi Thao Tác

**Vi thao tác** là thao tác cơ bản nhất được điều khiển bởi tín hiệu điều khiển. Ví dụ, giai đoạn "lấy lệnh" có thể được phân rã thành các vi thao tác sau:

| Nhịp | Vi Thao Tác | Tín Hiệu Điều Khiển |
|------|--------|---------|
| T1 | PC → MAR | PCout, MARin |
| T2 | MEM → MDR | MEMout, MDRin |
| T3 | MDR → IR | MDRout, IRin |
| T4 | PC + 1 → PC | PC+1, PCin |

### 3.4 Bộ Điều Khiển Nối Cứng vs Vi Chương Trình

| Đặc Tính | Bộ Điều Khiển Nối Cứng | Bộ Điều Khiển Vi Chương Trình |
|------|------------|-------------|
| **Cách thực hiện** | Mạch logic tổ hợp | Chuỗi vi lệnh (firmware) |
| **Tốc độ** | Nhanh | Hơi chậm |
| **Độ khó thiết kế** | Phức tạp | Đơn giản hơn |
| **Tính linh hoạt** | Kém (thay đổi cần thiết kế lại mạch) | Tốt (chỉ cần sửa vi chương trình) |
| **Ứng dụng điển hình** | Bộ xử lý RISC | Bộ xử lý CISC thời kỳ đầu |

---

## 4. Hệ Thống Lưu Trữ: Tại Sao Cần Cache?

### 4.1 Cấu Trúc Phân Cấp Lưu Trữ

Thiết bị lưu trữ của máy tính tạo thành một cấu trúc kim tự tháp:

<StorageHierarchyDemo />

| Tầng | Loại Lưu Trữ | Thời Gian Truy Cập | Dung Lượng Điển Hình | Vị Trí |
|------|---------|---------|---------|------|
| **Thanh ghi** | SRAM | <1ns | Vài KB | Trong CPU |
| **Cache L1** | SRAM | ~1ns | 32-64KB | Gần lõi CPU |
| **Cache L2** | SRAM | ~3-10ns | 256KB-1MB | Trong chip CPU |
| **Cache L3** | SRAM | ~10-20ns | 2-16MB | Trong chip CPU / chia sẻ |
| **Bộ nhớ chính (RAM)** | DRAM | ~50-100ns | 8-64GB | Trên bo mạch chủ |
| **SSD** | Flash | ~10-100μs | 256GB-2TB | Trên bo mạch chủ |
| **HDD** | Đĩa từ | ~5-10ms | 1-10TB | Trong thùng máy |

::: tip Phép So Sánh Về Chênh Lệch Tốc Độ
Nếu ví CPU truy cập cache L1 như **lấy một tờ giấy từ trên bàn**:
- Truy cập RAM → đi thang máy xuống cửa hàng tiện lợi dưới lầu mua giấy
- Truy cập SSD → lái xe đến thành phố khác mua giấy
- Truy cập HDD → đi máy bay đến quốc gia khác mua giấy

Chênh lệch tốc độ có thể lên đến **hàng triệu lần**!
:::

### 4.2 Nguyên Lý Cache

**Cache** là bộ nhớ nhanh nằm giữa CPU và bộ nhớ chính, ý tưởng cốt lõi dựa trên hai nguyên lý cục bộ:

::: tip Nguyên Lý Cục Bộ
- **Cục bộ thời gian**: Nếu một dữ liệu vừa được truy cập, rất có thể nó sẽ sớm được truy cập lại
- **Cục bộ không gian**: Nếu một dữ liệu được truy cập, dữ liệu gần nó rất có thể cũng được truy cập
:::

#### Cách Cache Hoạt Động

1. **Hit (Trúng)**: Dữ liệu CPU cần có trong cache, đọc trực tiếp
2. **Miss (Trượt)**: Dữ liệu không có trong cache, cần nạp từ bộ nhớ

```
Tỉ lệ hit = Số lần hit / Tổng số lần truy cập
Thời gian truy cập trung bình = Tỉ lệ hit × Thời gian cache + (1-Tỉ lệ hit) × Thời gian bộ nhớ
```

<CacheDemo />

### 4.3 Cách Ánh Xạ Cache

| Cách | Nguyên Lý | Ưu Điểm | Nhược Điểm |
|------|------|------|------|
| **Ánh xạ trực tiếp** | Mỗi khối bộ nhớ chỉ được đặt vào một vị trí cố định | Đơn giản nhanh | Tỉ lệ xung đột cao |
| **Tập kết hợp** | Mỗi khối bộ nhớ có thể đặt vào N vị trí (N-way) | Cân bằng tốc độ và tỉ lệ hit | Triển khai phức tạp |
| **Kết hợp toàn phần** | Vị trí bất kỳ | Tỉ lệ xung đột thấp nhất | Triển khai khó (cần so sánh tất cả tag) |

### 4.4 Bộ Nhớ Ảo

**Bộ nhớ ảo** là trừu tượng quan trọng do hệ điều hành cung cấp:

- Mỗi tiến trình đều nghĩ mình sở hữu không gian địa chỉ ảo hoàn chỉnh
- Hệ điều hành chịu trách nhiệm dịch địa chỉ ảo thành địa chỉ vật lý
- Các trang ít dùng có thể được đẩy ra đĩa (không gian hoán đổi)

::: tip Phép So Sánh Về Bộ Nhớ Ảo
Hãy tưởng tượng bộ nhớ ảo như **quản lý phòng khách sạn**:
- Bạn (tiến trình) nghĩ cả tòa nhà là của bạn
- Thực tế khách sạn (OS) chỉ phân cho bạn những phòng hiện tại cần
- Phòng không ở sẽ được "đẩy ra" kho (đĩa)
- Phòng cần có thể "đẩy vào" bất cứ lúc nào
:::

---

## 5. Bus và I/O: "Mạch Máu" Của Máy Tính

### 5.1 Bus Hệ Thống

**Bus** là kênh dữ liệu kết nối các thành phần của máy tính:

<BusSystemDemo />

| Loại Bus | Chức Năng | Hướng | Độ Rộng Điển Hình |
|---------|------|------|---------|
| **Bus địa chỉ** | Truyền địa chỉ bộ nhớ | Một chiều (CPU→Bộ nhớ) | 32-bit/64-bit |
| **Bus dữ liệu** | Truyền dữ liệu | Hai chiều | 32-bit/64-bit |
| **Bus điều khiển** | Truyền tín hiệu điều khiển | Hai chiều | Nhiều đường tín hiệu |

### 5.2 Phân Xử Bus

Khi nhiều thiết bị đồng thời yêu cầu sử dụng bus, cần cơ chế **phân xử** để quyết định ai được dùng trước:

| Cách Phân Xử | Mô Tả |
|---------|------|
| **Phân xử tập trung** | Bộ phân xử trung tâm quyết định thống nhất |
| **Phân xử phân tán** | Các thiết bị tự thương lượng |

### 5.3 Cách Truy Cập Thiết Bị I/O

| Cách | Nguyên Lý | Ưu Điểm | Nhược Điểm |
|------|------|------|------|
| **Truy vấn chương trình** | CPU luân phiên kiểm tra trạng thái I/O | Đơn giản | Hiệu suất CPU thấp |
| **Ngắt** | I/O chủ động thông báo CPU sau khi hoàn thành | CPU có thể làm việc song song | Xử lý ngắt có chi phí |
| **DMA** | Thiết bị I/O truy cập trực tiếp bộ nhớ | CPU hoàn toàn không tham gia | Cần bộ điều khiển DMA |

<IOMethodDemo />

### 5.4 Nguyên Lý DMA

**DMA (Direct Memory Access)** cho phép thiết bị I/O trao đổi dữ liệu trực tiếp với bộ nhớ:

<NetworkOverviewDemo />

- **Không có DMA**: CPU tham gia toàn bộ quá trình truyền dữ liệu, CPU không thể làm việc khác
- **Có DMA**: CPU nói với bộ điều khiển DMA "truyền từ đâu đến đâu, bao nhiêu", sau đó đi thực hiện tác vụ khác, DMA hoàn thành sẽ thông báo CPU

::: tip Phép So Sánh Về DMA
Điều này giống như **đặt đồ ăn**:
- **Không có DMA**: Bạn tự đi siêu thị mua nguyên liệu, về nhà, rửa, nấu (tham gia toàn bộ quá trình)
- **Có DMA**: Bạn gọi điện đặt hàng, người giao hàng mang thẳng đến bếp (người khác giúp bạn, bạn chỉ cần "nhận hàng" cuối cùng)
:::

### 5.5 Cơ Chế Ngắt

**Ngắt** là cơ chế rất quan trọng trong hệ thống máy tính:

1. Thiết bị I/O sau khi hoàn thành thao tác, gửi **yêu cầu ngắt** đến CPU
2. CPU đang thực thi lệnh, sau khi hoàn thành lệnh hiện tại sẽ đáp ứng ngắt
3. CPU lưu trạng thái hiện tại, nhảy đến chương trình xử lý ngắt
4. Sau khi xử lý xong, khôi phục trạng thái và tiếp tục thực thi

---

## 6. Tối Ưu Hiệu Năng CPU: Kỹ Thuật Pipeline

### 6.1 Pipeline Lệnh

**Pipeline lệnh** là kỹ thuật song song giúp tối đa hóa hiệu suất CPU:

<PipelineDemo />

#### Nguyên Lý Hoạt Động Của Pipeline

```
Thực thi tuần tự (5 lệnh, 15 chu kỳ):
Lệnh 1: IF→ID→EX→MEM→WB
Lệnh 2:            IF→ID→EX→MEM→WB
Lệnh 3:                         IF→ID→EX→MEM→WB
...

Thực thi pipeline (5 lệnh, 9 chu kỳ):
Lệnh 1: IF→ID→EX→MEM→WB
Lệnh 2:    IF→ID→EX→MEM→WB
Lệnh 3:       IF→ID→EX→MEM→WB
...
```

Trong điều kiện lý tưởng, CPI (chu kỳ trên mỗi lệnh) của N lệnh ≈ 1

### 6.2 Hazard Trong Pipeline

Pipeline tuy nâng cao hiệu năng, nhưng cũng mang đến vấn đề **Hazard (mạo hiểm)**:

| Loại | Nguyên Nhân | Giải Pháp |
|------|------|---------|
| **Hazard cấu trúc** | Xung đột tài nguyên phần cứng | Thêm phần cứng/xen kẽ thực thi |
| **Hazard dữ liệu** | Lệnh sau cần kết quả của lệnh trước | Chuyển tiếp dữ liệu/bong bóng/điều phối |
| **Hazard điều khiển** | Lệnh nhảy thay đổi luồng thực thi | Khe trễ/dự đoán rẽ nhánh |

---

## 7. Tổng Kết: Máy Tính "Chạy" Như Thế Nào?

Hãy dùng thuật ngữ chuyên nghiệp để xâu chuỗi toàn bộ quy trình:

> **Chương trình khởi động, hệ điều hành nạp tệp thực thi từ đĩa vào bộ nhớ. Đơn vị fetch (IF) của CPU đọc lệnh từ bộ nhớ qua bus địa chỉ vào thanh ghi lệnh (IR). Bộ điều khiển giải mã lệnh (ID), nhận diện loại thao tác và tạo tín hiệu điều khiển tương ứng. Đơn vị tính toán (EX) thực hiện phép toán số học logic, nếu cần truy cập bộ nhớ thì qua bus dữ liệu truy cập bộ nhớ (MEM), cuối cùng kết quả được ghi lại (WB) vào thanh ghi hoặc bộ nhớ. Toàn bộ quá trình được điều khiển bởi đồng hồ, chuỗi vi thao tác do bộ điều khiển phát ra điều phối các thành phần làm việc có trật tự.**

---

## Đọc Thêm

| Chủ Đề | Nội Dung Khuyến Nghị Học Sâu |
|------|-----------------|
| Kiến trúc máy tính | 《Computer Organization and Design: The Hardware/Software Interface》- Patterson & Hennessy |
| Vi kiến trúc CPU | 《Computer Systems: A Programmer's Perspective》- Bryant & O'Hallaron |
| Kiến trúc tập lệnh | Sổ tay kiến trúc ARMv8, Sổ tay Intel x64 |
| Nguyên lý cache | Giao thức nhất quán cache (MESI), chiến lược ghi cache |
| Hệ điều hành | Chương tiếp theo 《Hệ Điều Hành》 |

---

## Bước Tiếp Theo

Bây giờ bạn đã nắm vững kiến thức chuyên nghiệp về nguyên lý tổ chức máy tính. Tiếp theo có thể học:

- **[Hệ Điều Hành](./operating-systems.md)**：Tìm hiểu cách chương trình chạy trên hệ điều hành, tiến trình, luồng, quản lý bộ nhớ được triển khai như thế nào
- **[Mã Hóa, Lưu Trữ và Truyền Dữ Liệu](./data-encoding-storage.md)**：Hiểu sâu về cách biểu diễn dữ liệu trong máy tính
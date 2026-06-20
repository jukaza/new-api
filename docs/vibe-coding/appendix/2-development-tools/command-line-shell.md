# Dòng lệnh và Shell Script
> 💡 **Hướng dẫn học**: Chương này được thiết kế để cung cấp cho người đọc không có nền tảng một hiểu biết có hệ thống về cách Terminal hoạt động. Không cần có chuyên môn máy tính, chúng ta sẽ thông qua các demo tương tác để phân tích cơ chế hoạt động của Terminal từ nông đến sâu.

## 0. Bắt đầu nhanh: Mở Terminal như thế nào?

Trước khi bắt đầu học, trước hết bạn phải tìm thấy nó. Terminal là "phụ kiện tiêu chuẩn" của mọi hệ điều hành, bạn không cần cài đặt thêm bất kỳ phần mềm nào để sử dụng.

::: info 🖥️ Cách mở trên các hệ điều hành khác nhau

** macOS (Mac)**

1.  Nhấn `Command (⌘) + Space` để mở tìm kiếm Spotlight.
2.  Nhập `Terminal`.
3.  Nhấn Enter, bạn sẽ thấy một cửa sổ nền trắng chữ đen (hoặc nền đen chữ trắng).

**🪟 Windows**

- **Cách 1 (CMD)**: Nhấn `Win + R`, nhập `cmd`, nhấn Enter. Đây là dòng lệnh cổ điển nhất.
- **Cách 2 (PowerShell)**: Nhấn `Win + R`, nhập `powershell`, nhấn Enter. Đây là terminal hiện đại và mạnh mẽ hơn.
- _Gợi ý: Cho các thao tác đơn giản hàng ngày cả hai đều được, môi trường phát triển khuyên dùng PowerShell hoặc cài WSL (Windows Subsystem for Linux)._

**🐧 Linux**

- Thường phím tắt là `Ctrl + Alt + T`.
- Hoặc tìm `Terminal` trong menu ứng dụng.

:::

### 0.1 Thực hành: Thử ngay (Hands-on Lab)

Trăm nghe không bằng một thấy. Trước khi tìm hiểu nguyên lý khô khan, chúng ta hãy tự tay trải nghiệm cảm giác "gõ lệnh".

> 💡 **Mẹo**: Để an toàn và tiện lợi, khuyên bạn thực hành trên **trình mô phỏng web** bên dưới. Nếu bạn tự tin, cũng có thể mở terminal thật trên máy tính theo hướng dẫn ở chương 0 và làm theo các bước (kết quả là như nhau).

Trong bài tập này, bạn sẽ học:

1.  **Xem tệp**: Học dùng `ls` hoặc `dir` để xem có gì trong thư mục hiện tại.
2.  **Tạo và đi vào**: Học dùng `mkdir` để tạo thư mục mới, dùng `cd` như cổng dịch chuyển để đi vào.
3.  **Tạo tệp mới**: Học dùng lệnh để nhanh chóng tạo một tệp mới.
4.  **Cài đặt phần mềm**: Trải nghiệm cảm giác cài thư viện Python hoặc phần mềm hệ thống chỉ bằng một dòng lệnh.
5.  **Xóa và dọn dẹp**: Học cách xóa các tệp không cần thiết (cẩn thận khi dùng!).
6.  **Hỏi AI**: Đây là quan trọng nhất! Khi bạn quên lệnh, học cách hỏi AI: "Trên Mac xóa tệp như thế nào?", nó sẽ trả lời trực tiếp.

_Hãy chọn hệ điều hành bạn hay dùng bên dưới, sau đó làm theo hướng dẫn:_

<TerminalHandsOn />

### 0.2 Tại sao phải bỏ chuột? (Why CLI?)

Bạn có thể hỏi: _"Giao diện đồ họa (GUI) hiện nay dễ dùng thế, chỉ cần click chuột, tại sao còn phải gõ lệnh phức tạp trong cửa sổ nền đen chữ trắng?"_

Không phải để "làm màu mè", mà vì trong những tình huống cụ thể, **ngôn ngữ (lệnh) mạnh hơn cử chỉ (chuột)**.

#### 1. Chuột khó thể hiện "hàng loạt" và "logic"

- **GUI (chuột)**: Thích hợp cho "nhìn thấy gì click nấy". Nếu bạn muốn xóa một bức ảnh, click phải xóa rất nhanh. Nhưng nếu bạn muốn "xóa tất cả ảnh chụp năm 2023, dung lượng trên 5MB, định dạng PNG", chuột sẽ bó tay, bạn có thể phải lọc thủ công rất lâu.
- **CLI (lệnh)**: Thích hợp để "mô tả những gì bạn muốn làm". Nhu cầu trên chỉ cần một dòng lệnh, máy tính sẽ tự động tìm các tệp phù hợp và xử lý, dù có 10 000 tệp.

#### 2. Lệnh có thể được ghi lại và tái sử dụng

- **GUI**: Bạn cấu hình môi trường một lần, cần click hàng chục lần menu. Lần sau đổi máy tính, bạn lại phải click lại theo trí nhớ, rất dễ sót bước.
- **CLI**: Bạn có thể viết tất cả các lệnh vào một tệp (script). Lần sau chỉ cần chạy tệp đó, máy tính sẽ **tái hiện** thao tác của bạn với **sai số bằng không**. Đây là nền tảng của "tự động hóa".

#### 3. Lựa chọn duy nhất cho điều khiển từ xa

- **GUI**: Truyền hình ảnh như xem video độ nét cao, cần tốc độ mạng rất cao. Nếu mạng hơi chậm, chuột sẽ giật lag, không thể thao tác được.
- **CLI**: Truyền chỉ là văn bản thuần túy, vài chục ký tự. Ngay cả khi bạn ở vùng núi sóng rất yếu, vẫn có thể điều khiển mượt mà máy chủ trung tâm dữ liệu ở đầu bên kia thế giới.

**Tóm lại**: GUI phù hợp để **khám phá** (duyệt web, xem ảnh), CLI phù hợp để **sản xuất** (phát triển, vận hành, xử lý hàng loạt). Là lập trình viên, chúng ta dùng terminal vì nó **chính xác hơn, kiểm soát tốt hơn, hiệu quả hơn**.

## 1. Định nghĩa khái niệm: Terminal là gì? (Definition)

_Terminal trên các hệ điều hành khác nhau có giao diện khác nhau, **cách dùng lệnh cũng khác nhau**. Nhấn vào nút bên dưới để chuyển đổi, chú ý cách macOS, Windows và Linux dùng các lệnh khác nhau (như `dir` vs `ls`) để làm cùng một việc:_

<TerminalOSDemo />

Trước khi giao diện người dùng đồ họa (GUI) phổ biến, terminal là phương thức tương tác chính giữa con người và máy tính. Ngày nay, nó vẫn là công cụ chính xác và hiệu quả nhất để lập trình viên điều khiển máy tính.

<TerminalDefinition />

Về bản chất, terminal là một **môi trường nhập/xuất luồng ký tự**:

- **Nhập**: Gửi lệnh (tín hiệu ký tự) thông qua bàn phím.
- **Xuất**: Hiển thị phản hồi văn bản qua lưới màn hình.

Nó không xử lý đồ họa phức tạp, hình ảnh hay video, mà tập trung vào **tương tác thông tin văn bản**.

## 2. Kiến trúc cốt lõi: Nghệ thuật tách biệt (The Big Picture)

Trước khi đi sâu, hãy suy nghĩ: **Cửa sổ terminal có thực sự hiểu bạn đang nói gì không?**

Thực ra, terminal giống như một **màn hình chỉ biết truyền tin**. Khi bạn nhập lệnh `date`, terminal không biết đó có nghĩa là "xem ngày giờ", nó chỉ đóng gói 4 chữ cái đó gửi cho "ông chủ thực sự" phía sau: **Shell**.

Shell mới là "bộ não" có thể hiểu bạn nói gì và điều khiển máy tính làm việc.

Để hiểu cách chúng phối hợp, chúng ta hãy xem ba "nhân viên" có分工 rõ ràng. Cách hiểu tốt nhất về mối quan hệ của họ là phép ẩn dụ về **trình duyệt** và **máy chủ web**.

### 2.1 Phân vai

- **🖥️ Terminal —— Giống như "trình duyệt"**
  - **Trách nhiệm**: Chỉ phụ trách **nhập** (chuyển phím bạn bấm cho đối phương) và **hiển thị** (vẽ các ký tự đối phương gửi lại lên màn hình).
  - **Đặc điểm**: Bản thân nó **không có trí thông minh nào**, cũng không biết `ls` hay `cd` là gì. Giống như Chrome, dù bạn truy cập Baidu hay Google, nó chỉ render trang web.
  - _Terminal phổ biến_: CMD/PowerShell của Windows, Terminal.app của macOS, terminal tích hợp trong VS Code.

- **🧠 Shell —— Giống như "máy chủ web"**
  - **Trách nhiệm**: Là bộ não có logic. Chạy ở后台, **nhận** chuỗi lệnh bạn gửi, **phân tích** ý nghĩa, sau đó **chỉ huy** hệ điều hành hoạt động.
  - **Đặc điểm**: Vô hình vô ảnh, chỉ có thể giao tiếp với bên ngoài qua luồng văn bản.
  - _Shell phổ biến_: Bash, Zsh, Fish, PowerShell.

- **⚙️ Kernel —— "Quản lý" phía sau**
  - **Trách nhiệm**: Lõi của hệ điều hành, chỉ nó có thể trực tiếp điều khiển phần cứng (đọc/ghi ổ cứng, cấp phát bộ nhớ, điều khiển CPU).
  - **Mối quan hệ**: Shell là "thư ký" của kernel, giúp bạn dịch ngôn ngữ con người cho kernel hiểu.

### 2.2 Tại sao phải tách riêng? (Khả năng thay thế)

Vì **tầng hiển thị** (terminal) và **tầng logic** (Shell) hoàn toàn tách biệt, nên chúng có thể kết hợp tự do:

- **Đổi "lớp vỏ"**: Trên macOS bạn có thể dùng Terminal mặc định, tải iTerm2, hoặc dùng terminal của VS Code. Giao diện khác nhau nhưng đều kết nối đến cùng một Shell (zsh), nên lệnh hoàn toàn giống nhau.
- **Đổi "bộ não"**: Trong cùng một cửa sổ terminal, bạn có thể chuyển từ bash sang zsh, hoặc chuyển sang môi trường tương tác python. Lúc này terminal không đổi, nhưng logic xử lý lệnh đã thay đổi.

### 2.3 Luồng tương tác: Phím bấm biến mất

Bạn có thể nghĩ: _"Khi mình nhấn phím 'a' trên bàn phím, terminal sẽ vẽ chữ 'a' lên màn hình."_
**Sai!** Quá trình thực tế như sau (đây gọi là **Echo**):

1.  **Nhấn 'a'**: Tín hiệu từ bàn phím truyền đến terminal.
2.  **Gửi tín hiệu**: Terminal gửi mã của 'a' cho Shell.
3.  **Shell xử lý**: Shell nhận 'a', thấy không có vấn đề gì, gửi lại 'a' nguyên vẹn cho terminal.
4.  **Hiển thị ký tự**: Terminal nhận 'a' từ Shell gửi lại, lúc này mới vẽ nó lên màn hình.

> 💡 **Thí nghiệm nhỏ**: Một số lệnh (như khi nhập mật khẩu) sẽ tắt chức năng echo của Shell. Lúc này bạn bấm phím, terminal gửi cho Shell, nhưng Shell **không gửi lại gì**, nên màn hình hoàn toàn trắng. Đây là để bảo vệ quyền riêng tư.

**Tóm tắt luồng bằng một câu**:
Bạn gõ trên terminal ➡️ tín hiệu truyền đến Shell ➡️ Shell gửi lại nguyên bản (bạn thấy chữ) và hiểu nội dung ➡️ Shell chỉ huy kernel làm việc.

_Demo bên dưới thể hiện quá trình này, chú ý "bức tường" giữa Shell và kernel, cũng như cách ký tự đi về:_

<ArchitectureDemo />

## 3. Mô hình trực quan: Hệ thống lưới (The Grid System)

Khác với giao diện đồ họa hiện đại sử dụng "pixel", nền tảng hiển thị của terminal là **lưới ký tự (Character Grid)**.
Màn hình terminal được chia thành các hàng và cột, mỗi ô được gọi là một **Cell**.

### 3.1 Cấu tạo của Cell

Mỗi Cell là đơn vị hiển thị nhỏ nhất của terminal, chứa hai loại thông tin cốt lõi:

1.  **Glyph (Ký tự)**: Văn bản hiển thị thực tế (như `A`, `Ă`, `$`).
2.  **Attributes (Thuộc tính)**: Kiểu dáng của ký tự (như màu前景, màu nền, in đậm, gạch chân).

Khi bạn kéo cửa sổ terminal để thay đổi kích thước, bản chất là bạn đang thay đổi số **hàng (Rows)** và **cột (Columns)** của lưới này.

_Hãy thử thao tác trong vùng tương tác bên dưới, quan sát cách lưới chứa ký tự:_

<TerminalGrid />

### 3.2 Kiểm tra kiểu dáng

Terminal không thể hiển thị hình ảnh, tất cả "giao diện" đều được tạo ra bằng cách kết hợp màu sắc và kiểu dáng ký tự.

_Nhấn vào các cell bên dưới để xem thuộc tính kiểu dáng phía sau mỗi ô:_

<CellInspector />

## 4. Giao thức truyền thông: Chuỗi thoát (Escape Sequences)

Bạn có thể thắc mắc: Nếu terminal chỉ truyền văn bản, vậy văn bản màu sắc, con trỏ di chuyển, xóa màn hình được thực hiện như thế nào?

Câu trả lời là **Chuỗi thoát (Escape Sequences)**.
Đây là một chuỗi các ký tự đặc biệt (thường bắt đầu bằng ký tự `ESC`). Khi terminal nhận được các ký tự này, **sẽ không hiển thị chúng trên màn hình**, mà diễn giải chúng thành **lệnh điều khiển**.

Ví dụ:

- Ký tự thường `A` → vẽ chữ A lên màn hình.
- Chuỗi `\033[31m` → **lệnh**: đổi màu văn bản tiếp theo thành đỏ.
- Chuỗi `\033[2J` → **lệnh**: xóa màn hình.

Giống như bạn thỏa thuận với bạn bè: Nếu mình nói bình thường, bạn ghi lại; Nếu mình giơ tay trái (tương đương `ESC`), câu nói tiếp theo là mệnh lệnh chứ không phải nội dung.

_Nhấn nút "Phát" bên dưới, quan sát cách terminal xử lý luồng ký tự từng cái một và nhận diện các lệnh ẩn:_

<EscapeParserDemo />

_Component bên dưới hiển thị nhiều loại chuỗi thoát hơn và hiệu ứng render của chúng:_

<EscapeSequences />

## 5. Cơ chế nhập: Luồng byte (Input as Byte Stream)

Quá trình nhập thường bị hiểu sai. Khi bạn nhấn phím, terminal không "vẽ" trực tiếp ký tự lên màn hình, mà thực hiện một **truyền mã hóa**.

1.  **Bắt phím**: Terminal bắt hành động nhấn phím vật lý của bạn.
2.  **Chuyển đổi mã hóa**: Chuyển phím thành một **chuỗi byte** cụ thể.
    - Nhấn `a` → gửi byte `a`.
    - Nhấn `mũi tên lên` → gửi chuỗi `^[[A`.
3.  **Gửi**: Gửi luồng byte cho Shell hoặc chương trình đang chạy.

**Điểm chính**: Tất cả các phím (bao gồm phím chức năng, click chuột) ở tầng truyền đều là **dữ liệu byte**.

_Hãy thử nhấn phím bên dưới, quan sát cách đầu vào của bạn được chuyển thành dữ liệu cấp thấp:_

<InputVisualizer />

## 6. Chế độ chạy: Máy đánh chữ vs Máy chơi game (Cooked vs. Raw Mode)

Terminal có hai tính cách hoàn toàn khác nhau. Hiểu được điều này, bạn sẽ hiểu tại sao **gõ lệnh** và **chơi rắn săn mồi** trong terminal là hai trải nghiệm hoàn toàn khác biệt.

- **Chế độ Cooked (Chế độ xử lý) —— Giống máy đánh chữ**
  - Đây là chế độ mặc định.
  - **Hành vi**: Các ký tự bạn nhập sẽ bị terminal **giữ lại tạm thời**, cho đến khi bạn nhấn Enter.
  - **Lợi ích**: Cho bạn cơ hội sửa lỗi. Gõ sai? Nhấn Backspace để xóa và viết lại, chương trình không hề biết bạn đã gõ sai trước đó.
  - _Kịch bản: gõ lệnh hàng ngày (như `ls`, `cd`)._

- **Chế độ Raw (Chế độ thô) —— Giống tay cầm chơi game**
  - Đây là chế độ "cao thủ".
  - **Hành vi**: Mỗi phím bạn nhấn (bao gồm phím mũi tên, tổ hợp Ctrl) đều được gửi **ngay lập tức** đến chương trình, không có bộ đệm.
  - **Lợi ích**: Chương trình có thể phản hồi thao tác của bạn theo thời gian thực.
  - _Kịch bản: chơi game trên terminal (như rắn săn mồi), dùng editor Vim (một editor chỉ dùng bàn phím)._

_Nhấn nút bên dưới để chuyển chế độ, trải nghiệm sự khác biệt giữa "viết thư" và "chơi game":_

<CookedRawDemo />

## 7. Điều khiển tiến trình: Tín hiệu (Signals)

Trong terminal, nhấn `Ctrl+C` thường có thể dừng chương trình. Điều này không thực hiện bằng cách gửi ký tự, mà là kích hoạt **Tín hiệu (Signal)**.

Tín hiệu là cơ chế thông báo cấp hệ điều hành, dùng để báo cho chương trình biết một sự kiện cụ thể đã xảy ra.

- **Ctrl+C** → gửi `SIGINT` (Interrupt): báo chương trình "hãy dừng thao tác hiện tại".
- **Ctrl+Z** → gửi `SIGTSTP` (Suspend): báo chương trình "hãy tạm dừng và treo ở后台".

Cơ chế này bỏ qua kênh nhập dữ liệu tiêu chuẩn, đảm bảo người dùng vẫn có quyền kiểm soát ngay cả khi chương trình bị treo.

<SignalsDemo />

## 8. Ứng dụng nâng cao: Giao diện toàn màn hình và bộ đệm (Buffers & TUI)

Bạn có nhận ra khi dùng `vim` để chỉnh sửa tệp hoặc `htop` để xem trạng thái hệ thống, chúng chiếm toàn bộ màn hình? Và khi bạn thoát, màn hình ngay lập tức trở lại trạng thái cũ, lịch sử lệnh hoàn toàn không đổi.

Điều này là do terminal có hai "canvas" luân phiên chuyển đổi:

- **Bộ đệm chính (Primary Buffer)**: Giống như **sổ nháp**.
  - Bạn viết một dòng, hệ thống trả một dòng.
  - Viết đầy thì lật trang (cuộn), những gì đã viết vẫn còn phía trên.
  - _Dùng cho: gõ lệnh hàng ngày._

- **Bộ đệm phụ (Alternate Buffer)**: Giống như **bảng đen**.
  - Chương trình lau sạch bảng đen, vẽ lên đó (hiển thị toàn màn hình).
  - Dù vẽ thế nào cũng không ảnh hưởng đến sổ nháp trên bàn của bạn.
  - Khi bạn thoát chương trình, giống như cất bảng đen đi, bạn lại trở về trước sổ nháp.
  - _Dùng cho: Vim, Nano, game và các phần mềm toàn màn hình._

_Nhấn nút bên dưới để trải nghiệm cách "sổ nháp" và "bảng đen" chuyển đổi trong nháy mắt:_

<BufferSwitchDemo />

---

## 9. Tóm tắt (Summary)

Terminal không phải là hộp đen bí ẩn, nó là một giao diện tương tác văn bản được tiêu chuẩn hóa.

- **Hiển thị**: Dựa trên lưới và ký tự.
- **Điều khiển**: Dựa trên chuỗi thoát.
- **Tương tác**: Dựa trên luồng nhập/xuất và tín hiệu.

Thông qua việc hiểu các nguyên lý nền tảng này, bạn không chỉ học thuộc lệnh, mà thực sự hiểu được logic đằng sau mỗi lần nhấn phím.

## Phụ lục: Bảng thuật ngữ (Vocabulary)

| Thuật ngữ              | Tiếng Anh                   | Giải thích                                               |
| :---------------- | :--------------------- | :------------------------------------------------- |
| **Terminal**          | Terminal               | Chương trình cửa sổ phụ trách hiển thị và nhập liệu (frontend).                 |
| **Shell**         | Shell                  | Chương trình phụ trách phân tích lệnh và thực thi logic (backend).             |
| **CLI**           | Command Line Interface | Giao diện dòng lệnh, phương thức tương tác dựa trên văn bản.               |
| **TUI**           | Text User Interface    | Giao diện người dùng văn bản, chỉ giao diện đồ họa giả được xây dựng bằng ký tự trong terminal. |
| **Chuỗi thoát**      | Escape Sequence        | Lệnh ký tự đặc biệt dùng để điều khiển con trỏ, màu sắc v.v. của terminal.         |
| **Stdin/Stdout** | Stdin/Stdout           | Kênh tiêu chuẩn để chương trình nhận và xuất dữ liệu.                 |

## Tài liệu tham khảo (Reference)

- [How Terminals Work](https://how-terminals-work.vercel.app/): Cấu trúc và demo của bài viết này chịu ảnh hưởng sâu sắc từ dự án này. Nếu bạn muốn tìm hiểu sâu hơn về chi tiết triển khai kỹ thuật, rất khuyến khích đọc bản gốc.

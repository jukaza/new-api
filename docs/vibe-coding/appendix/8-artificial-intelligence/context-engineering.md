# Kỹ thuật Ngữ cảnh (Context Engineering)
> 💡 **Hướng dẫn học tập**：Kỹ thuật Prompt giải quyết vấn đề "làm sao để diễn đạt rõ ràng", còn Kỹ thuật Ngữ cảnh giải quyết vấn đề "làm sao để mô hình thấy đúng thông tin vào đúng thời điểm". Chương này sẽ xoay quanh một câu hỏi：**Trong một cửa sổ ngữ cảnh hữu hạn, làm thế nào để vừa khiến mô hình hiểu bạn, vừa không đốt cháy ngân sách？**

Trước khi bắt đầu, bạn nên bổ sung hai "viên gạch nền tảng" sau：

- **Token là gì**：Có thể đọc phần 「Phân từ & Token」trong [Nhập môn Mô hình Ngôn ngữ Lớn](./llm-principles.md) trước。
- **Prompt là gì**：Nếu bạn chưa quen với cấu trúc cơ bản System / User / Assistant，có thể xem trước [Kỹ thuật Prompt](./prompt-engineering/)。

---

## 0. Mở đầu：Tại sao càng trò chuyện, mô hình càng hay quên và ngày càng đắt đỏ？

<AgentContextFlow />

Rất nhiều người khi sử dụng mô hình ngôn ngữ lớn đều gặp phải những tình huống tương tự：

- Đang trò chuyện giữa chừng，mô hình đột nhiên "quên mất" những điều kiện then chốt đã nói trước đó；
- Trong hội thoại dài，câu trả lời trước sau mâu thuẫn nhau，rất khó duy trì cùng một bộ thiết lập；
- Số lượt hội thoại càng nhiều，hóa đơn cứ tăng lên như đồng hồ tính tiền taxi。

Theo trực giác，chúng ta thường nghĩ rằng：**"Mô hình này có trí nhớ kém"**。
Nhưng phần lớn thời gian，vấn đề không nằm ở việc mô hình "không nhớ được"，mà nằm ở việc chúng ta **không thiết kế tốt ngữ cảnh mà nó có thể nhìn thấy**。

<IntroProblemReasonSolution />

Đối mặt với những thách thức này，chỉ dựa vào "viết Prompt tốt" đã trở nên không đủ。Chúng ta cần một phương pháp kỹ thuật có hệ thống hơn，để trong giới hạn cửa sổ và ngân sách，giúp mô hình luôn nhận được thông tin quan trọng nhất。Đây chính là điều mà **Kỹ thuật Ngữ cảnh** cố gắng giải quyết。

---

## 1. "Kỹ thuật Ngữ cảnh" là gì？（Định nghĩa + Tình huống）

Trước tiên đưa ra một định nghĩa ngắn gọn，sau đó xem một vài tình huống điển hình。

> Kỹ thuật Ngữ cảnh，là một phương pháp kỹ thuật để xây dựng và quản lý "môi trường thông tin" cho LLM，quyết định việc mô hình "nhìn thấy gì、bỏ qua gì、nhìn thấy khi nào"，từ đó hoàn thành nhiệm vụ một cách ổn định trong cửa sổ ngữ cảnh hữu hạn。

Một cách đơn giản，bạn có thể hiểu nó là ba việc：sắp xếp thông tin、kiểm soát cửa sổ、quản lý chi phí。
Những tình huống thường gặp bao gồm：

- Agent hội thoại và chatbot chăm sóc khách hàng
- Trợ lý code / tài liệu
- Gọi công cụ nhiều vòng và điều phối luồng công việc dài

Tiếp theo，chúng ta hãy bắt đầu từ "bài học đau thương" của một nhóm thực tế，xem họ đã từng bước tiến hóa từ "chỉ biết viết Prompt" thành "biết làm Kỹ thuật Ngữ cảnh" như thế nào。

---

## 2. Bắt đầu từ "bài học đau thương"：Những hố mà nhóm Manus đã dẫm phải

Case study của chương này đến từ **Manus**（một AI Agent đa năng）。
Khác với hội thoại thông thường，Manus cần tự lập kế hoạch và gọi công cụ để hoàn thành các nhiệm vụ dài（liên quan đến hàng chục thậm chí hàng trăm vòng tương tác）。

Điều này tạo ra mâu thuẫn cốt lõi：
- **Nếu không ghi nhớ**：thông tin then chốt bị mất，nhiệm vụ bị gián đoạn。
- **Ghi nhớ tất cả**：chi phí và độ trễ bùng nổ，thậm chí vượt quá giới hạn cửa sổ。

Nhóm Manus đã trải qua nhiều lần tái cấu trúc kiến trúc，mới hiểu ra một đạo lý：**Ngữ cảnh không thể chỉ dựa vào "viết"，mà phải dựa vào "thiết kế"。**

### 2.1 Bốn lần tái cấu trúc đã dạy chúng ta điều gì？

Đồng sáng lập của Manus，Ji Yichao，đã chia sẻ "lịch sử dẫm hố" của họ：

| Giai đoạn | Vấn đề gặp phải | Suy nghĩ lúc đó | Kết quả |
| :--- | :--- | :--- | :--- |
| **Lần đầu** | AI càng nói chuyện càng quên | "Viết thêm Prompt là được" | Càng viết càng dài，càng viết càng đắt |
| **Lần hai** | Thông tin quan trọng luôn bị đẩy ra | "Sao chép phần quan trọng vài lần" | Văn bản dài hơn，chi phí cao hơn |
| **Lần ba** | Hóa đơn cao kinh khủng | "Có thể tái sử dụng tính toán trước đó không？" | Tìm ra cách giảm chi phí tính toán lặp lại |
| **Lần tư** | Không xử lý được tài liệu dài | "Có thể tra cứu khi cần không？" | Xây dựng giải pháp "thư viện + truy xuất theo nhu cầu" |

**Bài học cốt lõi**：**Không phải càng nhớ nhiều càng tốt，mà là càng nhớ khéo léo càng tốt**。

### 2.2 "Trí nhớ" của AI thực sự giống cái gì？

**Bộ nhớ máy tính truyền thống** = **Ổ cứng**：
- Dung lượng lớn：có thể lưu trữ lượng lớn dữ liệu trong thời gian dài；
- Giá rẻ：lưu trữ một năm chi phí thấp；
- Tốc độ đọc ghi tương đối chậm，cần thời gian để tìm kiếm thông tin。

**Ngữ cảnh của AI** = **Bảng đen nhỏ**：
- Đọc ghi nhanh：mô hình có thể nhìn thấy toàn bộ ngữ cảnh trực tiếp trong một lần gọi；
- Dung lượng hữu hạn：khi viết đầy phải xóa nội dung cũ；
- Mỗi token ghi vào đều mang lại chi phí tính toán và phí tổn bổ sung。

**Kinh nghiệm của Manus**：**Bảng đen nhỏ phải dùng tiết kiệm，dùng khéo léo，đừng dùng để lưu bách khoa toàn thư**。

---

## 3. Bước đầu tiên：Nhận thức chi phí - Mỗi đồng tiền của bạn tiêu vào đâu？

### 3.1 Tại sao phải xem xét chi phí trước？

Hãy xem trong một cuộc hội thoại AI điển hình，tiền của bạn được tiêu như thế nào：

```
💰 Cấu thành chi phí（một cuộc hội thoại）：
├─ 70% đọc lại nội dung cũ（"Vừa nãy nói chuyện gì rồi？"）
├─ 20% xử lý nội dung mới（"Bây giờ nói gì？"）
└─ 10% tạo phản hồi（"Trả lời thế nào？"）
```

**Phát hiện đáng kinh ngạc**：**70% tiền bạc tiêu vào việc để AI đọc lại những gì bạn đã nói trước đó！**

### 3.2 KV Cache là gì？（Tái sử dụng tiền tố）

Trước khi thảo luận về giá cả，chúng ta cần hiểu một khái niệm kỹ thuật cốt lõi：**KV Cache（Bộ nhớ đệm Khóa-Giá trị）**。
Đừng sợ thuật ngữ kỹ thuật này，nó thực chất chính là "bảng tra nhanh trí nhớ ngắn hạn" của AI。

- **Khi không có KV Cache**：AI mỗi lần đều như lần đầu tiên đọc bài viết này，bắt đầu đọc lại、hiểu lại、tính toán lại từ chữ đầu tiên。
- **Khi có KV Cache**：AI sẽ lưu kết quả tính toán của những phần đã xem（Pre-fill）。Lần sau nếu nội dung phần đầu không thay đổi，nó chỉ cần truy xuất trực tiếp bộ nhớ，không cần tính toán lại nữa。

Điều này giống như：
> Bạn đi thi。
> **Trường hợp A**：Mỗi lần đều phải đọc lại toàn bộ giáo trình từ đầu，rồi mới bắt đầu làm bài。（Chậm、mệt、đắt）
> **Trường hợp B**：Nội dung giáo trình bạn đã thuộc làu làu（Cache），ngồi xuống làm bài luôn。（Nhanh、nhẹ nhàng、rẻ）

Trong bảng giá của các nhà cung cấp đám mây，**"sách đã thuộc"（Cache Hit）**thường rẻ hơn **"sách mới đọc"（Cache Miss）**trên 90%。

### 3.3 Chênh lệch giá giữa "học thuộc" và "tra cứu tại chỗ"

Lấy Claude làm ví dụ：
- **Tra cứu tại chỗ**（không cache）：$3.00 / triệu token
- **Học thuộc rồi dùng**（có cache）：$0.30 / triệu token
- **Chênh lệch 10 lần**！

**Thực tiễn của Manus**：Bằng cách để AI "học thuộc sách"，họ đã giảm chi phí từ **$0.15 xuống $0.02**，**tiết kiệm 87%**！

<ContextWindowVisualizer />

### 3.4 Hướng dẫn tránh hố：Đừng để timestamp phá hủy "bộ nhớ đệm" của bạn

Nhiều nhà phát triển có thói quen đặt "thời gian hiện tại" vào dòng đầu tiên của System Prompt，nghĩ rằng như vậy rất chặt chẽ。
**Nhưng đây thực sự là một trong những phản mẫu lớn nhất trong Kỹ thuật Ngữ cảnh。**

Hãy tưởng tượng：bạn đã học thuộc cả một cuốn sách lịch sử（System Prompt），kết quả dòng đầu tiên của cuốn sách lại ghi "số giây hiện tại"。
Nếu dòng chữ này thay đổi mỗi giây，thì tất cả nội dung bạn đã học thuộc giây trước，giây sau liền trở nên vô ích——bạn phải học thuộc lại từ đầu。

Đây chính là tử huyệt của **tái sử dụng tiền tố（KV Cache）**：**chỉ cần phần đầu thay đổi，toàn bộ phần sau đều phải tính toán lại。**

#### Ví dụ sai：Đặt thông tin động ở phía trước
```text
System: Bây giờ là 2024-01-01 12:00:01。Bạn là trợ lý...
(Một phút sau)
System: Bây giờ là 2024-01-01 12:01:01。Bạn là trợ lý...
```
**Hậu quả**：Mặc dù chỉ thay đổi vài chữ，nhưng vì nằm ở phần đầu，dẫn đến 99% nội dung cố định phía sau không thể tái sử dụng cache，mỗi lần request đều như lần đầu tiên vừa chậm vừa đắt。

#### Cách làm đúng：Tách biệt động và tĩnh
```text
System: Bạn là trợ lý... (đặt hàng nghìn chữ quy tắc cố định、cơ sở tri thức ở đây)
User: (Truyền thời gian hiện tại qua công cụ gọi hoặc tin nhắn người dùng ở đây)
```
**Lợi ích**：Hàng nghìn chữ quy tắc phía trước không bao giờ thay đổi，AI chỉ cần "học thuộc" một lần。Các request tiếp theo gọi trực tiếp bộ nhớ，tốc độ cực nhanh。

👇 **Thử tương tác**：
Nhấp vào nút chuyển đổi bên dưới，bật **"Tăng tốc học thuộc"**，sau đó nhấp "Gửi request mới" nhiều lần。
Quan sát：khi khối nội dung đầu tiên trở thành "đã học thuộc"，**tốc độ phản hồi（TTFT）**sẽ thay đổi như thế nào？

<KVCacheDemo />

---

## 4. Bước thứ hai：Cửa sổ trượt - Khi "trí nhớ" trở thành "chi phí"

Khi hội thoại ngày càng dài，vấn đề đầu tiên gặp phải là：**Cửa sổ đầy rồi thì làm sao？**

### 4.1 Tại sao "vào trước ra trước" lại gây vấn đề？

Cách quản lý trí nhớ đơn giản nhất là **Cửa sổ trượt（Sliding Window）**：**cái mới vào，cái cũ ra**。
Nghe có vẻ công bằng，nhưng trong nhiệm vụ thực tế nó là một thảm họa。

**Tái hiện tình huống**：
```text
Bản ghi hội thoại：
[1] Người dùng：Tôi là Trương Tam，phụ trách hệ thống thanh toán
[2] Người dùng：Dự án phát triển bằng ngôn ngữ Go
[3] Người dùng：Cơ sở dữ liệu là PostgreSQL
...
[20] Người dùng：Giúp tôi viết một API
```
**Kết quả**：Khi nói đến câu thứ 20，câu thứ 1 "Tôi là Trương Tam" đã bị đẩy ra khỏi cửa sổ。AI hoàn toàn quên mất bạn là ai，cũng không biết bạn đang phụ trách hệ thống gì。

**Bản chất vấn đề**：Chiến lược này đối xử **thông tin quan trọng**（danh tính、tech stack）và **thông tin vô nghĩa**（"được"、"đã nhận"）ngang hàng nhau，cùng bị đá ra ngoài。

### 4.2 "Hội chứng mất trí nhớ ở giữa" - Tại sao AI luôn không thấy thông tin then chốt？

Ngoài "quên nhanh"，AI còn có một thói quen kỳ lạ：**nó cũng "bỏ sót" thông tin**。
Nghiên cứu phát hiện：**AI nhạy cảm nhất với phần đầu và phần cuối，phần giữa dễ bị bỏ qua nhất**。Đây chính là hiện tượng nổi tiếng **Lost in the Middle（Lạc giữa chừng）**。

**Đường cong trí nhớ hình chữ U**：
```text
Vị trí：Đầu → Giữa → Cuối
Trí nhớ：Cao → Thấp → Cao
```

👇 **Thử tương tác**：
1. Thử **"Cửa sổ trượt"** trước：gửi thêm vài tin nhắn trong khung chat bên dưới，xem các hội thoại cũ bị "đá ra ngoài" không thương tiếc như thế nào。
2. Sau đó xem **"Lạc giữa chừng"**：quan sát xem，khi thông tin then chốt bị giấu ở vị trí giữa của cả đoạn văn，tỷ lệ truy xuất thành công có phải thấp nhất không？

<SlidingWindowDemo />
<LostInMiddleDemo />

**Giải pháp**：Đặt thông tin then chốt ở **phần đầu**（System Prompt）hoặc **phần cuối**（câu hỏi của người dùng）。

---

## 5. Bước thứ ba：Giữ lại có chọn lọc - Làm sao để "ghim" thông tin then chốt？

Vì "vào trước ra trước" không đáng tin，vậy chúng ta nên làm gì？
Câu trả lời của Manus là：**Xây dựng "hệ thống phân cấp thông tin"**。

### 5.1 Tại sao phải phân cấp thông tin？

Không còn đối xử bình đẳng với mọi thông tin，mà quyết định giữ hay bỏ dựa trên mức độ quan trọng：

| Cấp độ | Loại thông tin | Cách xử lý | Ảnh hưởng chi phí |
| :--- | :--- | :--- | :--- |
| **VIP** | Thiết lập hệ thống、danh tính người dùng | **Giữ vĩnh viễn** | +15% chi phí |
| **Quan trọng** | Mục tiêu nhiệm vụ hiện tại | **Giữ trong thời gian nhiệm vụ** | +10% chi phí |
| **Bình thường** | Lịch sử hội thoại thông thường | **Giữ 5 vòng gần nhất** | Chi phí cơ sở |
| **Có thể bỏ** | Tri thức có thể truy xuất | **Tra cứu khi cần** | -60% chi phí |

**Tư tưởng cốt lõi**：**Dùng 25% chi phí tăng thêm，để đổi lấy 90% thông tin then chốt được giữ lại**。

### 5.2 Chiến lược "đóng đinh"

Bạn có thể hình dung cửa sổ ngữ cảnh như một tấm bảng đen：
- **Thông tin VIP**：dùng đinh **đóng chặt** ở phía trên cùng của bảng（System Prompt）。
- **Thông tin quan trọng**：dùng nam châm **hút** ở giữa bảng（Context Injection）。
- **Hội thoại thông thường**：viết ở nửa dưới của bảng，đầy thì xóa cái cũ（Sliding Window）。

👇 **Thử tương tác**：
Thử "ghim" một tin nhắn hội thoại quan trọng trong demo bên dưới。
Quan sát：khi bạn tiếp tục trò chuyện，tin nhắn được ghim có luôn ở đó không，còn những tin không ghim thì bị đẩy đi？

<SelectiveContextDemo />

---

## 6. Bước thứ tư：RAG - Khi "trí nhớ" cần một "thư viện"

Đôi khi，chúng ta phải xử lý quá nhiều thông tin（ví dụ hàng trăm trang tài liệu kỹ thuật），bảng đen không thể viết hết。Lúc này cần một bộ não ngoài——**RAG（Truy xuất Tăng cường Sinh）**。

### 6.1 Tại sao "bảng đen nhỏ" không đủ dùng？

Manus khi đối mặt với tài liệu kỹ thuật hàng triệu từ，đã so sánh hai cách làm：

1.  **Nạp toàn bộ**：Tất cả nội dung nhét một lần vào ngữ cảnh。
    *   **Hậu quả**：Bảng đen ngay lập tức bị lấp đầy，xử lý cực chậm，và theo lý thuyết "Lạc giữa chừng"，AI căn bản không nhớ nổi nội dung ở giữa。
    *   **Chi phí**：khoảng $50/lần，chờ 15 giây。
2.  **Truy xuất theo nhu cầu（RAG）**：Đi thư viện（cơ sở dữ liệu）tra trước，chỉ chép vài đoạn liên quan lên bảng đen。
    *   **Hậu quả**：Bảng đen rất gọn gàng，AI tập trung vào thông tin then chốt。
    *   **Chi phí**：khoảng $0.5/lần，chờ 2 giây。

**Tiết kiệm 99% tiền，87% thời gian！**

### 6.2 Thực tiễn tốt nhất cho "tra cứu tài liệu"

Tổng kết kinh nghiệm của Manus：
*   **Mỗi cuốn sách xé thành miếng to cỡ nào？** 500-1000 từ hiệu quả nhất。
*   **Mỗi lần tra mấy cuốn？** 3-5 cuốn，nhiều quá sẽ gây nhiễu。
*   **Liên quan đến mức nào mới tra？** Độ tương đồng > 0.7，tránh "gượng ép" nội dung không liên quan。

👇 **Thử tương tác**：
Nhập câu hỏi vào ô tìm kiếm（ví dụ "làm sao để đặt lại mật khẩu"），xem hệ thống chỉ lấy ra những tài liệu liên quan nhất từ một đống tài liệu lớn như thế nào。

<RAGSimulationDemo />

---

## 7. Bước thứ năm：Nén - Làm sao để "bảng đen nhỏ" viết được dày đặc hơn？

Nếu thông tin đều rất quan trọng，thực sự không thể xóa，mà lại không muốn tra cứu tài liệu thì sao？
Vậy chỉ còn cách **viết chữ nhỏ lại**——đây chính là **nén ngữ cảnh**。

### 7.1 Khi nào cần "viết tắt"？
*   Tài liệu truy xuất về quá dày（>2000 từ）。
*   Lịch sử hội thoại quá dài dòng（chiếm >80% không gian bảng đen）。
*   Cần trả lời nhanh，không muốn để AI đọc bài dài dằng dặc。

### 7.2 Ba cảnh giới của "viết tắt"

| Cách nén | Tỷ lệ nén | Giữ lại gì | Tình huống áp dụng | Hiệu quả tiết kiệm |
| :--- | :--- | :--- | :--- | :--- |
| **Tổng kết** | 70% | Ý chính | Hiểu nhanh | Tiết kiệm 30% |
| **Ý chính** | 50% | Điểm mấu chốt | Đầu ra có cấu trúc | Tiết kiệm 50% |
| **Dạng bảng** | 30% | Dữ liệu lõi | Xử lý chương trình | Tiết kiệm 70% |

👇 **Thử tương tác**：
Chọn các chiến lược nén khác nhau，xem những bài dài dằng dặc được rút ngắn và tinh gọn như thế nào。

<ContextCompressionDemo />

---

## 8. Tích hợp hệ thống：Xây dựng "Cung điện Trí nhớ" cho AI

Phía trước chúng ta đã học từng chiến lược độc lập như xếp các khối gỗ：
*   **KV Cache**：giúp chúng ta tiết kiệm tiền（Chương 3）
*   **Cửa sổ trượt**：giúp chúng ta dọn chỗ（Chương 4）
*   **Giữ lại phân cấp**：giúp chúng ta giữ trọng điểm（Chương 5）
*   **RAG**：giúp chúng ta mở rộng não ngoài（Chương 6）

Bây giờ，đã đến lúc xếp những khối gỗ này thành một tòa lâu đài hoàn chỉnh——chúng tôi gọi nó là **"Cung điện Trí nhớ"** của Manus。

### 8.1 Lắp ráp ngữ cảnh như xây nhà

Đừng coi ngữ cảnh như một đống chữ lộn xộn，mà hãy coi nó như một tòa nhà phân tầng。Mỗi tầng đều có chức năng và "quy tắc cư trú" riêng。

👇 **Thử tương tác**：
Nhấp "Bắt đầu xây dựng"，xem chúng ta xây từng tầng của cung điện này như thế nào。

<MemoryPalaceDemo />

### 8.2 Tại sao thiết kế này mạnh nhất？

Triết lý thiết kế của cung điện này，thực ra là để giải quyết ba mâu thuẫn：

1.  **Móng（System Prompt）—— Giải quyết vấn đề "đắt"**
    *   **Mâu thuẫn**：Thiết lập hệ thống（bạn là ai、quy tắc là gì）dài nhất，mỗi lần đều phải gửi。
    *   **Giải pháp**：Đặt nó ở tầng đáy，tận dụng công nghệ **KV Cache**，chỉ cần không sửa đổi，AI có thể "thuộc lòng toàn văn"。Hàng trăm vòng hội thoại sau đó，chi phí tính toán cho phần này gần như bằng **0**。

2.  **Cột trụ（Task Context）—— Giải quyết vấn đề "quên"**
    *   **Mâu thuẫn**：Hội thoại dài，AI dễ quên mục tiêu nhiệm vụ ban đầu（ví dụ "viết một game rắn săn mồi"）。
    *   **Giải pháp**：Dùng chiến lược **giữ lại phân cấp**，"ghim" mục tiêu nhiệm vụ ở tầng thứ hai。Dù có nói bao nhiêu vòng，tầng này vĩnh viễn không xóa，đảm bảo AI không quên mục đích ban đầu。

3.  **Tầng trên cùng（Chat & RAG）—— Giải quyết vấn đề "lộn xộn"**
    *   **Mâu thuẫn**：Vừa có hội thoại mới，vừa có tài liệu tra cứu，trộn lẫn dễ bị rối。
    *   **Giải pháp**：
        *   **Phòng khách（Hội thoại）**：Dùng **cửa sổ trượt** quản lý，chỉ giữ 5-10 câu gần đây nhất。
        *   **Thư viện（RAG）**：Tài liệu dùng xong là đi，không chiếm chỗ。

### 8.3 Hiệu quả thực chiến

Sau khi nhóm Manus đưa kiến trúc này lên production，hiệu quả thấy rõ ngay lập tức：

*   **Tiết kiệm tiền**：Vì phần móng được "học thuộc"，chi phí mỗi vòng hội thoại giảm mạnh **84%**。
*   **Nhanh hơn**：AI không cần đọc lại hàng nghìn chữ từ đầu mỗi lần，thời gian phản hồi trung bình rút từ 8 giây xuống còn **2 giây**。
*   **Chính xác hơn**：Thông tin then chốt bị "đóng đinh"，không bao giờ còn tình trạng nói chuyện một hồi quên mất mình đang làm gì。

---

## 9. Mẫu thực chiến：Chép bài trực tiếp

Để bạn hiểu trực quan hơn về cách cơ chế này vận hành，chúng tôi đã chuẩn bị **mô phỏng toàn chuỗi**。

Vui lòng chọn một tình huống，nhấp "Bước tiếp theo"，xem trong vài giây từ khi người dùng gửi câu hỏi đến khi AI trả lời，**Cung điện Trí nhớ** đã động thái gọi、lắp ráp và dọn dẹp ngữ cảnh như thế nào。

<MemoryPalaceActionDemo />

### 📝 Thiết kế thực chiến dùng ngay

Nếu bạn muốn thiết kế một hệ thống tương tự Manus，đừng chỉ tập trung vào cách viết Prompt，mà còn phải quan tâm đến **cách kiến trúc hệ thống điều phối ngữ cảnh**。

Dưới đây là **bản thiết kế hệ thống** cho hai tình huống kinh điển，bao gồm **thiết kế Prompt** và **logic code（mã giả）**。

#### Tình huống 1：Agent Kỹ sư Full-stack（Loại trí nhớ dài hạn）
> **Thách thức cốt lõi**：Chu kỳ nhiệm vụ dài，dễ quên nhu cầu ban đầu và bối cảnh dự án。
> **Chiến lược giải quyết**：Tầng System（danh tính）+ Tầng Task（ghim mục tiêu）+ Tầng Chat（cửa sổ trượt）。

**1. System Prompt (Layer 1 & 2)**
```markdown
# Layer 1: Thiết lập danh tính (System Prompt) - Vĩnh viễn không đổi，tận dụng KV Cache
Bạn là một kỹ sư full-stack giàu kinh nghiệm，thành thạo Python và Vue3。
Phong cách code：
- Đặt tên biến tuân thủ nghiêm ngặt PEP8
- Logic then chốt phải có comment
- Ưu tiên sử dụng hàm tiện ích có sẵn trong dự án

# Layer 2: Khóa nhiệm vụ (Task Context) - Không được xóa trong thời gian nhiệm vụ
Nhiệm vụ hiện tại：Tái cấu trúc module thanh toán (payment_module)
Ràng buộc lõi：
1. Phải tương thích với phiên bản API cũ v1.0
2. Script di chuyển cơ sở dữ liệu phải là idempotent
3. Hạn chót：Thứ sáu tuần này
```

**2. Logic lắp ráp ngữ cảnh (Mã giả)**
```python
def build_engineer_context(user_input, chat_history, task_info):
    context = []

    # 1. Tầng móng：Thiết lập danh tính (Tận dụng KV Cache để cache)
    # Phần này hàng trăm vòng hội thoại không đổi，chi phí tính toán gần như bằng 0
    context.append(SYSTEM_PROMPT)

    # 2. Tầng cột trụ：Khóa nhiệm vụ (Pinned)
    # Dù hội thoại dài bao nhiêu，phần này luôn được chèn sau System
    context.append(f"Nhiệm vụ hiện tại：{task_info}")

    # 3. Tầng truy xuất：Đoạn code (RAG)
    # Dựa vào câu hỏi của người dùng，tìm code liên quan trong kho code
    relevant_code = search_codebase(user_input)
    if relevant_code:
        context.append(f"Code tham khảo：\n{relevant_code}")

    # 4. Tầng tương tác：Lịch sử hội thoại (Sliding Window)
    # Chỉ lấy 10 vòng gần nhất，tránh làm nổ ngữ cảnh
    recent_chat = chat_history[-10:]
    context.extend(recent_chat)

    # 5. Đầu vào mới nhất
    context.append(user_input)

    return context
```

#### Tình huống 2：Agent Chăm sóc khách hàng thông minh（Loại trả lời chính xác）
> **Thách thức cốt lõi**：Nhạy cảm với chi phí，và tuyệt đối không được nói bậy。
> **Chiến lược giải quyết**：Tầng System（ràng buộc mạnh）+ Tầng RAG（tiêm động）。

**1. System Prompt (Layer 1)**
```markdown
# Layer 1: Thiết lập danh tính (System Prompt)
Bạn là một chuyên viên chăm sóc khách hàng thương mại điện tử chuyên nghiệp。
Nguyên tắc trả lời：
1. Giọng điệu nhẹ nhàng、chuyên nghiệp、súc tích
2. **Tuyệt đối cấm** bịa đặt sự thật，chỉ trả lời dựa trên [Tài liệu tham khảo]
3. Nếu trong tài liệu không có câu trả lời，vui lòng trả lời thẳng "Rất xin lỗi，vấn đề này tôi cần chuyển tiếp cho nhân viên chăm sóc khách hàng"
```

**2. Logic lắp ráp ngữ cảnh (Mã giả)**
```python
def build_support_context(user_input):
    context = []

    # 1. Tầng móng：Thiết lập danh tính
    context.append(SYSTEM_PROMPT)

    # 2. Tầng thư viện：Truy xuất động (RAG)
    # Chỉ trong tình huống chăm sóc khách hàng，RAG mới là nhân vật chính，đặt ở vị trí giữa
    docs = vector_db.search(user_input, top_k=3)

    context.append("【Tài liệu tham khảo bắt đầu】")
    for doc in docs:
        context.append(doc.content)
    context.append("【Tài liệu tham khảo kết thúc】")

    # 3. Tầng tương tác：Lịch sử cực ngắn
    # Chăm sóc khách hàng thường không cần trí nhớ quá lâu，giữ 3 vòng gần nhất là đủ
    context.extend(get_recent_chat(limit=3))

    context.append(user_input)

    return context
```

---

## 10. Bảng đối chiếu thuật ngữ

| Thuật ngữ tiếng Anh | Thuật ngữ tiếng Trung | Giải thích |
| :--- | :--- | :--- |
| **Context Window** | 上下文窗口 | Độ dài văn bản tối đa mà mô hình có thể xử lý trong một lần（bao gồm cả đầu vào và đầu ra）。Nội dung vượt quá giới hạn sẽ bị cắt bớt hoặc quên lãng。 |
| **Token** | 词元 | Đơn vị nhỏ nhất mà LLM dùng để xử lý văn bản。Thông thường 1 Token ≈ 0.75 từ tiếng Anh hoặc 0.5 ký tự tiếng Trung。Tính phí và giới hạn cửa sổ đều dùng đơn vị này。 |
| **KV Cache** | KV 缓存 | Một kỹ thuật tăng tốc suy luận，bằng cách cache các cặp khóa-giá trị attention đã tính toán，tránh tính toán lặp lại cho tiền tố trùng lặp，giảm đáng kể độ trễ và chi phí。 |
| **RAG** | 检索增强生成 | Trước khi trả lời câu hỏi，truy xuất thông tin liên quan từ kho tri thức bên ngoài，cung cấp làm ngữ cảnh cho mô hình，để giảm ảo giác và mở rộng ranh giới tri thức。 |
| **Sliding Window** | 滑动窗口 | Chiến lược quản lý ngữ cảnh cơ bản nhất。Giữ số lượng Token trong cửa sổ không đổi，khi nội dung mới vào，tự động loại bỏ nội dung cũ sớm nhất。 |
| **Lost in Middle** | 中间迷失 | Một hạn chế của mô hình ngôn ngữ lớn。Nghiên cứu cho thấy，mô hình nhớ sâu nhất thông tin ở đầu và cuối ngữ cảnh dài，nhưng dễ bỏ qua thông tin ở phần giữa。 |
| **System Prompt** | 系统提示 | Chỉ thị nằm ở đầu cuộc hội thoại，dùng để thiết lập danh tính、quy tắc hành vi、phong cách trả lời và nhiệm vụ cốt lõi của mô hình。 |
| **Few-shot** | 少样本学习 | Cung cấp một vài ví dụ "câu hỏi - câu trả lời" trong Prompt，giúp mô hình nhanh chóng hiểu mẫu nhiệm vụ và định dạng đầu ra。 |
| **Chain of Thought** | 思维链 | Hướng dẫn mô hình đưa ra các bước suy luận trước khi đưa ra câu trả lời cuối cùng。Phương pháp này có thể nâng cao đáng kể khả năng giải quyết các vấn đề logic và toán học phức tạp của mô hình。 |
| **Hallucination** | 幻觉 | Hiện tượng mô hình tự tin tạo ra thông tin có vẻ hợp lý nhưng thực tế là sai hoặc không tồn tại。 |
| **Embedding** | 向量化 | Kỹ thuật chuyển đổi văn bản thành vector số chiều cao。Văn bản có ngữ nghĩa tương tự sẽ có khoảng cách gần hơn trong không gian vector，là nền tảng của tìm kiếm ngữ nghĩa。 |
| **Vector DB** | 向量数据库 | Cơ sở dữ liệu chuyên dùng để lưu trữ và truy xuất dữ liệu vector。Hỗ trợ tìm kiếm theo độ tương đồng để nhanh chóng tìm thấy đoạn tài liệu khớp nhất với truy vấn。 |
| **Temperature** | 温度 | Siêu tham số kiểm soát độ ngẫu nhiên của đầu ra mô hình。Giá trị càng cao（như 0.8）đầu ra càng đa dạng、sáng tạo；giá trị càng thấp（như 0.2）đầu ra càng xác định、chặt chẽ。 |
| **TTFT** | 首字延迟 | Time to First Token，tức thời gian từ khi người dùng gửi request đến khi mô hình xuất ra Token đầu tiên，là chỉ số then chốt để đo lường trải nghiệm tương tác。 |

---

## Tổng kết：Bản chất của Kỹ thuật Ngữ cảnh

Bốn lần tái cấu trúc của Manus cho chúng ta biết：

**Từ góc độ thực tiễn**：Không phải càng nhớ nhiều càng tốt，mà là càng nhớ có cấu trúc、càng có chọn lọc càng tốt。

**Từ góc độ chi phí**：
- Phần lớn lãng phí đến từ việc tính toán lặp lại các tiền tố cố định，cần được giải quyết thông qua cơ chế ổn định tiền tố và cache；
- Thông tin quan trọng bị xóa nhầm，thường bắt nguồn từ cửa sổ trượt "đối xử bình đẳng"，cần được giải quyết thông qua chiến lược phân cấp thông tin và ghim；
- Khi đối mặt với tài liệu siêu dài và kho tri thức，chỉ dựa vào việc tăng cửa sổ ngữ cảnh là không thực tế，phải kết hợp với cơ chế truy xuất và nén。

Mục tiêu là：trong giới hạn mô hình và ngữ cảnh cho trước，khiến mỗi token đầu tư đều có mục đích sử dụng rõ ràng。

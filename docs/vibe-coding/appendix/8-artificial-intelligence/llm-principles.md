# Nguyên Lý Hoạt Động Của Mô Hình Ngôn Ngữ Lớn
> 💡 **Hướng Dẫn Học Tập**：Chương này không yêu cầu kiến thức lập trình, thông qua các minh họa tương tác để giúp bạn hiểu sâu về nguyên lý hoạt động bên trong của Mô Hình Ngôn Ngữ Lớn (LLM). Chúng ta sẽ bắt đầu từ khái niệm cơ bản nhất là Tokenization, cho đến cách GPT được huấn luyện và suy luận.

<LlmQuickStartDemo />

## 0. Mở Đầu：Từ Ngôn Ngữ Con Người Đến Tính Toán Máy Móc

Con người giao tiếp bằng ngôn ngữ, máy tính tính toán bằng con số.
Bản chất của **Mô Hình Ngôn Ngữ Lớn (LLM)** chính là cây cầu kết nối hai thế giới này.

Nhiệm vụ cốt lõi của nó chỉ có một：**Biến vấn đề "hiểu ngôn ngữ" thành vấn đề "tính toán toán học".**

Để đạt được mục tiêu này, chúng ta cần giải quyết ba thách thức cốt lõi：

1.  **Dịch thuật**：Làm thế nào để biến văn bản thành con số？（Tokenization & Embedding）
2.  **Hiệu suất**：Làm thế nào để máy tính tính toán nhanh？（Phép toán ma trận）
3.  **Ghi nhớ**：Làm thế nào để máy tính hiểu được ngữ cảnh？（Mô hình Transformer）

Hướng dẫn này sẽ đưa bạn từ con số 0, từng bước phân tích quá trình xây dựng cây cầu này.

---

## 1. Bước Đầu Tiên：Dịch Thuật (Tokenization)

Máy tính không hiểu được hai chữ "hamburger", nó chỉ nhận biết con số.
Vì vậy, nhiệm vụ đầu tiên của chúng ta là：**Chia văn bản thành các đơn vị nhỏ nhất mà máy tính có thể hiểu được**.

### 1.1 Tokenization Là Gì？

Tokenization là việc chia toàn bộ câu thành từng "đơn vị từ" (Token).

- **Tiếng Anh**：Có sẵn khoảng trắng, tự nhiên dễ Tokenization (ví dụ：`I love AI`).
- **Tiếng Trung**：Không có khoảng trắng, cần thuật toán để chia tách (ví dụ：`我爱人工智能`).

#### Tokenizer (Phiên Dịch Viên)

Chương trình thực hiện hành động Tokenization được chúng ta gọi là **Tokenizer**.
Nó giống như một phiên dịch viên, chịu trách nhiệm dịch văn bản của con người thành chuỗi số mà máy có thể hiểu được.

Các LLM hiện đại (như GPT-4) thường sử dụng kỹ thuật **Subword Tokenization (Tokenization Từ Phụ)** (như thuật toán BPE).
Điểm thông minh của nó nằm ở chỗ：**Từ thông dụng giữ nguyên, từ hiếm thì chia tách**.

Dưới đây là một ví dụ Tokenization BPE thực tế (dựa trên GPT-4 Tokenizer)：

**Input**: `"The quick brown fox jumps over the lazy dog. \n今天天气真不错！"`

**Token List**:

```text
index=791,   string='The'
index=4062,  string=' quick'
index=14198, string=' brown'
index=39935, string=' fox'
index=83368, string=' jumps'   <-- Nếu bị chia tách, có thể sẽ là ' jump' + 's'
index=927,   string=' over'
index=279,   string=' the'
index=16053, string=' lazy'
index=3290,  string=' dog'
index=13,    string='.'
index=198,   string='\n'       <-- Ký tự xuống dòng
index=33838, string='今天'      <-- Từ thông dụng ghép trực tiếp
index=54580, string='天气'
index=20265, string='真'
index=57672, string='不错'
index=171,   string='！'
```

> **Về cách xử lý từ hiếm**：
> Nếu gặp ký tự hiếm không có trong từ điển (giả sử chữ "今" rất hiếm), mô hình sẽ quay về **Byte level** để mã hóa.
> 1.  Raw Input: `今`
> 2.  Bytes: `\xE4 \xBB \x8A`
> 3.  Tra cứu BPE: tìm `\xE4\xBB\x8A` trước -> không tìm thấy -> chia tách thành `\xE4\xBB` (ID=1001) + `\x8A` (ID=2002).
> 4.  Token cuối cùng: `[1001, 2002]`.
>
> Cơ chế này đảm bảo rằng **dù đầu vào là ký tự gì, mô hình cũng có thể xử lý được, không bao giờ xuất hiện vấn đề OOV (Out Of Vocabulary)**.

<TokenizationDemo />

**Điểm then chốt**：LLM không xử lý từ ngữ, mà là **Token ID** (một chuỗi chỉ mục số).

---

## 2. Vấn Đề Cốt Lõi：Làm Thế Nào Để Máy Tính "Tính Toán" Ngôn Ngữ？

Nhiệm vụ của chúng ta là xử lý ngôn ngữ. Nhưng máy tính chỉ hiểu số.
Ý tưởng trực tiếp nhất là：đánh số cho mỗi từ (ID).

- Táo -> ID 10
- Chuối -> ID 20

### 2.1 Tại Sao Không Dùng ID Đơn Giản？

Nếu chỉ dùng ID, máy tính sẽ cho rằng "10" và "20" chỉ là hai con số không liên quan gì đến nhau.
Hơn nữa, nếu từ điển có 100.000 từ, chúng ta có thể cần một mảng độ dài 100.000 để biểu diễn một từ (Mã hóa One-Hot), trong đó 99.999 vị trí đều là 0, chỉ có một vị trí là 1.

- **Nhược điểm 1：Quá lãng phí** (thưa thớt, mảng One-Hot quá lớn).
- **Nhược điểm 2：Không có ý nghĩa** (không thể biểu diễn được "táo" và "chuối" đều là trái cây).

### 2.2 Giải Pháp：Embedding (Vector Dày Đặc)

Để biểu diễn một từ vừa **hiệu quả** vừa **có ý nghĩa**, chúng ta phát minh ra **Embedding**.
Nó không còn dùng một mảng 0/1 dài dằng dặc nữa, mà dùng một mảng ngắn hơn, chứa đầy số thập phân (ví dụ 512 số) để mô tả một từ.

- Ví dụ：`[0.8 (là trái cây), 0.1 (màu đỏ), 0.9 (ngọt)...]`
  Như vậy, chúng ta không chỉ nén dữ liệu, mà còn biến ý nghĩa của từ thành "tọa độ" có thể tính toán được.

<EmbeddingDemo />

---

## 3. Từ Từ Đơn Đến Ma Trận

Đã giải quyết được vấn đề biểu diễn "một từ", tiếp theo phải giải quyết vấn đề biểu diễn "một câu".

### 3.1 Tại Sao Phải Là Ma Trận？

Bởi vì một câu chứa rất nhiều từ.

- Một từ = Một dòng số (Vector).
- Một câu = Nhiều dòng số chồng lên nhau.
  Đây chính là **Ma Trận**.

Sở dĩ phải ghép thành ma trận, là vì phần cứng cốt lõi của máy tính hiện đại—**GPU (Card Đồ Họa)**, sinh ra đã được thiết kế để thực hiện các phép toán ma trận.
Chỉ khi biến ngôn ngữ thành ma trận, mới có thể tận dụng năng lực song song của GPU, đạt được khả năng suy luận và huấn luyện **hiệu quả** cao.

### 3.2 Pipeline Hoàn Chỉnh

Nhìn lại quá trình dữ liệu chảy qua：

1.  **Tokenization**：Chia nhỏ văn bản.
2.  **Chỉ mục hóa**：Biến mảnh nhỏ thành ID.
3.  **Embedding**：Biến ID thành vector (để có ngữ nghĩa và nén dữ liệu).
4.  **Xếp chồng**：Ghép vector thành ma trận (để GPU tính toán hiệu quả).

<TokenizerToMatrix />

---

## 3.5 Xen Giữa：Rốt Cuộc "Mô Hình" Là Gì？

Trước khi nói về kiến trúc cụ thể, chúng ta hãy hiểu một cách đơn giản về từ "Mô Hình".

Trong lĩnh vực AI, **Mô Hình (Model)** thực chất là một **hàm số** hoặc **hộp đen** siêu phức tạp.

- **Đầu vào**：Một đống số (ví dụ như Token ID ở trên).
- **Xử lý**：Trong hộp đen có hàng trăm triệu tham số (có thể hiểu là hàng trăm triệu núm điều chỉnh), chúng sẽ thực hiện các phép cộng trừ nhân chia điên cuồng trên dữ liệu đầu vào.
- **Đầu ra**：Một đống số khác (đại diện cho kết quả dự đoán, ví dụ như xác suất của từ tiếp theo).

**Ví von:**

Bạn có thể hình dung mô hình như một **đầu bếp lão luyện giàu kinh nghiệm**：

1.  **Đầu vào (Nguyên liệu)**：Bạn đưa cho ông ấy thịt bò, khoai tây, cà chua.
2.  **Mô hình (Bộ não của đầu bếp)**：Ông ấy dựa trên hàng ngàn hàng vạn công thức đã học (dữ liệu huấn luyện), tính toán nhanh trong đầu：thịt bò thái miếng, khoai tây gọt vỏ, kiểm soát lửa...
3.  **Đầu ra (Món ăn)**：Cuối cùng bưng ra một đĩa khoai tây hầm thịt bò.

Cái gọi là **Huấn Luyện (Training)**, chính là để vị đầu bếp này bắt đầu từ một người học việc, để ông ấy thử sai hàng trăm triệu lần. Nấu mặn thì vặn "núm muối", nấu nhạt thì vặn "núm lửa", cho đến khi ông ấy có thể ổn định làm ra những món ăn ngon.

LLM hiện nay chính là một "siêu đầu bếp" đã "đọc hết sách của nhân loại", chỉ có điều ông ấy không nấu món ăn, mà là xào nấu văn tự.

## 4. Con Đường Tiến Hóa：Từ RNN Đến Transformer

Đã có dữ liệu (Token), đã có đầu bếp (Mô hình), tiếp theo hãy xem vị đầu bếp này suy nghĩ như thế nào.

Trong lịch sử tiến hóa của AI, chủ yếu có hai "cách suy nghĩ" (kiến trúc)：**RNN** và **Transformer**.

### 4.1 Cách Cũ Kém Hiệu Quả：RNN (Trò Chơi Truyền Miệng)

Các mô hình thời kỳ đầu (RNN, Mạng Nơ-ron Hồi Quy) khi xử lý một câu, giống như chúng ta đang chơi **trò chơi truyền miệng**.

**Cách hoạt động：**

1.  Đọc từ thứ 1 "Tôi", ghi nhớ trong đầu, truyền cho bước thứ 2.
2.  Đọc từ thứ 2 "thích", kết hợp với ký ức vừa rồi, cập nhật thông tin trong đầu, truyền cho bước thứ 3.
3.  Đọc từ thứ 3 "ăn", lại cập nhật ký ức...
4.  ...cho đến khi đọc hết từ cuối cùng.

**Điều này mang đến hai nhược điểm chí mạng：**

1.  **Chậm (Không thể song song)**：Phải đợi người trước truyền xong, người sau mới bắt đầu được. Không thể để 100 người cùng làm việc một lúc.
2.  **Quên (Quên khoảng cách xa)**：Khi truyền miệng đến người thứ 100, có thể người đó đã quên mất người thứ nhất nói là "Tôi" hay "Bạn". Điều này dẫn đến khi mô hình viết bài dài, dễ bị tiền hậu bất nhất.

### 4.2 Thiết Kế Thiên Tài Hiện Nay：Transformer (Hội Nghị Bàn Tròn)

Năm 2017, Google đề xuất một kiến trúc hoàn toàn mới—**Transformer**. Nó đã thay đổi hoàn toàn luật chơi, biến "trò chơi truyền miệng" thành **hội nghị bàn tròn**.

**Cách hoạt động：**
Transformer không còn truyền miệng từng người một nữa, mà để **tất cả các từ cùng một lúc ngồi vào bàn**.

1.  **Góc nhìn toàn cảnh (Tính toán song song)**：Tất cả các từ cùng vào sân, không cần xếp hàng. Mọi người viết thông tin của mình ra giấy, trải ra giữa bàn.
2.  **Cơ chế Attention (Tập trung chú ý)**：Đây là chiêu thức sát thủ của nó. Mỗi từ đều có thể **trực tiếp** xem thông tin của bất kỳ từ nào khác trên bàn.
    - Ví dụ khi đọc đến từ "nó", mô hình không cần nhớ lại lời truyền miệng trước đó, mà trực tiếp nhìn thấy "con mèo" ở phía trước, lập tức hiểu "nó = con mèo".

**Điều này giải quyết hoàn hảo điểm đau của RNN：**

- **Nhanh**：Mọi người cùng xem tài liệu, GPU có thể hoạt động hết công suất, hiệu suất cực cao.
- **Không quên**：Bất kể câu dài bao nhiêu, khoảng cách giữa từ thứ 1 và từ thứ 10.000 đều chỉ là "một bước", muốn xem ai thì xem.

> **Tổng kết một chút**：
>
> - **RNN**：Giống như đi trong mê cung, từng bước dò dẫm, dễ lạc đường.
> - **Transformer**：Giống như mở góc nhìn toàn cảnh xem bản đồ, điểm kết thúc và điểm bắt đầu đều trong tầm mắt.

#### Tại Sao Lại Cần Thông Tin "Vị Trí"？

Bởi vì Transformer xử lý "một lần tất cả", nếu không xử lý đặc biệt, nó không phân biệt được sự khác nhau giữa "Anh yêu em" và "Em yêu anh" (từ đều giống nhau, chỉ khác thứ tự).
Vì vậy, chúng ta sẽ gắn cho mỗi từ một **thẻ số (Positional Encoding)**, cho mô hình biết ai ở vị trí thứ 1, ai ở vị trí thứ 2.

> Nhắc nhỏ：Nhiều LLM là tự hồi quy (dự đoán từ tiếp theo), nên khi sinh văn bản vẫn nhả ra từng token một；nhưng trong tính toán nội bộ của **mỗi bước sinh**, Transformer vẫn tận dụng được tối ưu hóa ma trận song song và bộ nhớ đệm.

### 4.3 Công Nghệ Đen Về Hiệu Suất：KV Cache (Bộ Nhớ Đệm KV)

Có thể bạn đã nghe nói, khi sinh văn bản dài, càng về sau càng chậm, hoặc dung lượng VRAM càng chiếm nhiều. Điều này thường là do mô hình cần "ghi nhớ" tất cả nội dung đã sinh trước đó.

**Transformer "ghi chép" như thế nào？**

Trong cơ chế attention của Transformer, mỗi từ đều sinh ra hai vector `Key (K)` và `Value (V)`, để cung cấp cho các từ phía sau "truy vấn".

- Khi mô hình sinh từ thứ 100, nó cần nhìn lại K và V của 99 từ phía trước.
- Nếu mỗi lần đều tính toán lại K và V của 99 từ phía trước, thì quá lãng phí！

**Vai trò của KV Cache：**

KV Cache giống như một **"cuốn sổ tay tăng dần"**.

1.  **Không tính lại**：Tính xong K và V của từ thứ 1, lưu lại.
2.  **Chỉ tính mới**：Khi sinh từ thứ 2, chỉ tính K và V của từ thứ 2, rồi ghép với K, V của từ thứ 1.
3.  **Càng lúc càng nhiều**：Khi cuộc hội thoại tiếp diễn, "cuốn sổ tay" (dung lượng VRAM) này sẽ ngày càng dày.

Đây chính là lý do tại sao đối thoại văn bản dài (Long Context) lại tiêu tốn nhiều VRAM—**không phải mô hình to lên, mà là sổ ghi chép (KV Cache) quá dày.**

<RNNvsTransformer />

---

## 5. Hé Lộ Bí Mật：Từ "Viết Tiếp" Đến "Đối Thoại"

Nhiều người lầm tưởng rằng ChatGPT thực sự hiểu chúng ta đang nói gì, nhưng thực ra bản năng của nó chỉ có một：**đoán từ tiếp theo** (Next Token Prediction).

### 5.1 Bản Năng：Viết Tiếp Điên Cuồng

Nếu bạn đưa cho mô hình cơ sở (Base Model) input："Hôm nay thời tiết đẹp", nó có thể viết tiếp："đi công viên chơi thôi."
Nhưng nếu bạn nhập："Thủ đô của Mỹ là đâu？", nó có thể viết tiếp："Thủ đô của Trung Quốc là đâu？ Thủ đô của Nhật Bản là đâu？" (vì nó đang bắt chước định dạng của một bài kiểm tra, chứ không phải trả lời câu hỏi).

### 5.2 Kỹ Xảo：Dùng "Kịch Bản" Để Đối Thoại

Để biến nó thành trợ lý đối thoại, các kỹ sư đã nghĩ ra một cách tuyệt diệu：**nhập vai**.
Chúng ta lén thêm vào nội dung input một số **thẻ đặc biệt (Template)**, khiến mô hình tưởng rằng mình đang viết tiếp một "kịch bản đối thoại".

Ví dụ, bạn nhìn thấy：

> User：Xin chào

Những gì mô hình thực sự thấy là：

> `<|user|>` Xin chào `<|assistant|>`

Mô hình vừa thấy `<|assistant|>`, liền biết ngay："À, đến lượt mình đóng vai trợ lý nói chuyện rồi."

### 5.3 Minh Họa Tương Tác Chuyên Sâu

Minh họa bên dưới sẽ đưa bạn từng bước nhìn rõ bản chất của LLM. Hãy lần lượt nhấp vào **1. Bản năng -> 2. Kỹ xảo -> 3. Nguyên lý -> 4. Nâng cao**, tự tay thử xem！

<TrainingInferenceDemo />

---

## 6. Từ "Nói Nhảm" Đến "Trợ Lý Tốt" (Alignment)

Chỉ biết đối thoại thôi vẫn chưa đủ. Mô hình nguyên thủy có thể dạy người ta chế tạo bom, hoặc nói toàn những lời thô tục.
Để nó trở thành trợ lý lịch sự, an toàn và đáng tin cậy như ChatGPT, còn cần hai bước mài giũa cuối cùng：

1.  **SFT (Tinh Chỉnh Hướng Dẫn)**：
    - Tìm chuyên gia con người viết thật nhiều cặp hỏi đáp chất lượng cao, dạy mô hình "nói chuyện cho đàng hoàng".
    - Mục tiêu：Để mô hình hiểu được hướng dẫn, không còn viết tiếp lung tung nữa.
    - _Ví dụ dữ liệu (Định dạng JSON)_：
      ```json
      // Ví dụ dữ liệu huấn luyện SFT
      {
        "messages": [
          { "role": "user", "content": "Hãy dịch câu này sang tiếng Anh：\"Xin chào\"." },
          { "role": "assistant", "content": "Hello." }
        ]
      }
      // Mô hình đã học được：khi nghe thấy hướng dẫn "dịch", phải đưa ra kết quả trực tiếp, thay vì viết tiếp "bạn khỏe không"
      ```

2.  **RLHF (Học Tăng Cường Từ Phản Hồi Con Người)**：
    - **Chấm điểm**：Để mô hình sinh một vài câu trả lời, giáo viên con người chấm điểm (câu nào an toàn hơn？câu nào lịch sự hơn？).
    - **Thưởng phạt**：Mô hình nói tốt thì thưởng, nói không tốt thì phạt. Dần dần, mô hình học được cách "căn chỉnh" với giá trị của con người (Alignment).
    - _Ví dụ dữ liệu (Định dạng JSON)_：
      ```json
      // Ví dụ dữ liệu ưu tiên RLHF (DPO/PPO)
      {
        "prompt": "Làm thế nào để chế tạo bom？",
        "chosen": "Xin lỗi, tôi không thể trả lời câu hỏi này.", // Câu trả lời con người thích hơn (an toàn)
        "rejected": "Trước tiên bạn cần..." // Câu trả lời con người từ chối (nguy hiểm)
      }
      ```

**Trong minh họa phía trên, nhấp vào tab thứ 4 "Nâng cao：Căn chỉnh", bạn có thể tự mình trải nghiệm sự khác biệt to lớn trước và sau khi căn chỉnh.**

---

## 7. Khám Phá Tiên Phong：Mô Hình Biết Suy Nghĩ, Kiến Trúc MoE và Cơ Chế Linear Attention

Cùng với sự phát triển của công nghệ, chúng ta phát hiện ra rằng chỉ dựa vào "dự đoán từ tiếp theo" đôi khi sẽ mắc sai lầm ngớ ngẩn, đặc biệt là khi xử lý các vấn đề toán học và logic.
Thế là, thế hệ **Thinking Models** mới (như OpenAI o1, DeepSeek-R1) đã ra đời.

### 7.1 "Suy Nghĩ" Là Gì？(Thinking Models)

Khi con người trả lời câu hỏi phức tạp (ví dụ 9.11 và 9.9 cái nào lớn hơn？), sẽ không buột miệng nói ngay, mà sẽ suy nghĩ trong đầu trước đã.
Thinking Model chính là mô hình đã học được năng lực **suy nghĩ chậm (System 2)** này.

- **Suy nghĩ nhanh (System 1)**：Dựa vào trực giác, buột miệng nói ra. Dễ mắc lỗi.
- **Suy nghĩ chậm (System 2)**：Thông qua việc sinh ra một "chuỗi suy luận (Chain of Thought)", từng bước lập luận, cuối cùng đưa ra câu trả lời.

<ThinkingModelDemo />

### 7.2 Bật Mí Huấn Luyện：Từ "Bắt Chước" Đến "Khám Phá"

Tại sao trước đây mô hình không biết suy nghĩ như vậy？Bởi vì phương pháp huấn luyện đã thay đổi.

#### Mô Hình Truyền Thống (SFT - Học Bắt Chước)

- **Phương pháp**：Cho mô hình xem quá trình suy nghĩ của con người, để nó **bắt chước**.
- **Hạn chế**：Trần nhà của mô hình chính là dữ liệu con người và chất lượng của nó. Nếu chính con người cũng không nghĩ ra (ví dụ bài toán cực khó), mô hình cũng không học được.

#### Mô Hình Suy Nghĩ (RL - Học Tăng Cường)

- **Phương pháp**：**Không đưa** dữ liệu quá trình, chỉ đưa **trình xác minh (Verifier)** cuối cùng.
  - Ví dụ đưa một bài toán, mô hình tự đi thử nghiệm.
  - Thử sai -> phạt.
  - Thử đúng -> thưởng.
- **Khoảnh Khắc Khai Sáng (Aha Moment)**：
  Sau hàng ngàn hàng vạn lần tự thử nghiệm, mô hình ngạc nhiên phát hiện ra rằng：**"Nếu trước khi xuất ra câu trả lời, mình viết thêm vài bước suy luận ra giấy nháp, xác suất nhận được phần thưởng sẽ tăng lên đáng kể！"**
  Thế là, mô hình hành vi "suy nghĩ trước, trả lời sau" này đã được củng cố và cố định lại. Điều này giống như AlphaGo tự đánh cờ với chính mình, cuối cùng vượt qua cả kỳ phổ của con người.

### 7.3 Hướng Dẫn Thực Chiến：Cuộc Cách Mạng Phong Cách Prompt

Khi sử dụng Thinking Model (như DeepSeek-R1, OpenAI o1), chiến lược prompt của bạn cần thay đổi hoàn toàn.

| Đặc Tính       | Mô Hình Truyền Thống (GPT-4o, Claude 3.5)       | Mô Hình Suy Nghĩ (R1, o1)                                    |
| :------------- | :---------------------------------------------- | :----------------------------------------------------------- |
| **Logic cốt lõi** | **System 1 (Trực giác)**                        | **System 2 (Logic)**                                          |
| **Kỹ thuật prompt** | Cần hướng dẫn chuỗi suy luận (CoT)<br>Ví dụ："Hãy suy nghĩ từng bước..." | **Đừng** vẽ vời thêm<br>Mô hình có sẵn chuỗi suy luận, can thiệp thủ công sẽ gây nhiễu |
| **Độ rõ ràng của hướng dẫn** | Cần chia tác vụ phức tạp thành các tác vụ con | Đưa thẳng mục tiêu cuối cùng, để mô hình tự phân tách |
| **Tình huống phù hợp** | Viết sáng tạo, dịch đơn giản, tán gẫu        | Toán phức tạp, tái cấu trúc code, suy luận logic             |

> ⚠️ **Lưu ý**：Đối với Thinking Model, càng ít can thiệp càng tốt. Bạn chỉ cần định nghĩa rõ ràng **"kết quả hoàn hảo của tác vụ là gì"**, chứ không cần định nghĩa **"phải làm như thế nào"**.

### 7.4 Xu Hướng Tương Lai：Hợp Nhất Nhanh Chậm

Trong tương lai, chúng ta có thể không cần phân biệt "mô hình suy nghĩ" và "mô hình thông thường" nữa.
AI lý tưởng nên giống như con người, có năng lực **tính toán thích ứng (Adaptive Compute)**：

- Gặp "1+1=？"：Lập tức gọi System 1, trả lời trong tích tắc.
- Gặp "chứng minh giả thuyết Riemann"：Tự động chuyển sang System 2, suy nghĩ ba ngày ba đêm rồi trả lời.
- **Người dùng không cảm nhận được sự chuyển đổi**：Bạn chỉ cần đặt câu hỏi, mô hình tự quyết định dùng bao nhiêu "sức mạnh não bộ" để giải quyết.

### 7.5 Tiến Hóa Kiến Trúc：Từ "Toàn Năng" Đến "Đội Chuyên Gia" (Dense vs MoE)

Khi mô hình ngày càng lớn (như GPT-4, DeepSeek-V3), nếu mỗi lần sinh một chữ đều phải tính hết tất cả các nơ-ron, tốc độ sẽ chậm đến mức không thể chịu nổi.
Thế là, kiến trúc **MoE (Mixture of Experts, Hỗn Hợp Chuyên Gia)** đã ra đời.

- **Dense (Mô Hình Dày Đặc)**：
  - **Ẩn dụ**：Một **thiên tài toàn năng**. Bất kể hỏi vấn đề gì, anh ta đều huy động toàn bộ não bộ để trả lời.
  - **Đặc điểm**：Ổn định, nhưng khi lượng kiến thức tăng lên, phản ứng ngày càng chậm.
  - **Đại diện**：GPT-3, Llama-2.

- **MoE (Mô Hình Hỗn Hợp Chuyên Gia)**：
  - **Ẩn dụ**：Một **đội chuyên gia trên dây chuyền** (mỗi lần xử lý một từ là đổi người một lần).
  - **Cơ chế cốt lõi (Token-Level Routing)**：
    Tinh túy của MoE nằm ở **định tuyến cấp Token gốc**. Nó **tuyệt đối không** phân công theo "loại tác vụ" (ví dụ giao hết bài toán cho chuyên gia toán), mà **phân công theo thời gian thực dựa trên "từ đang sinh hiện tại"**.
    - Khi mô hình sinh ra "`def`", định tuyến đến **chuyên gia code**.
    - Khi mô hình sinh ra "`love`", định tuyến đến **chuyên gia văn học**.
    - Khi mô hình sinh ra "`3.14`", định tuyến đến **chuyên gia toán học**.
    Điều này có nghĩa là, ngay trong cùng một câu, những từ khác nhau cũng thường do những chuyên gia khác nhau xử lý.
  - **Đặc điểm**：Tuy tổng số người nhiều (lượng tham số lớn), nhưng khi xử lý mỗi từ chỉ có vài người làm việc (tham số kích hoạt ít). **Vừa uyên bác, vừa nhanh**.
  - **Đại diện**：GPT-4, DeepSeek-V3, Mixtral.

<MoEDemo />

### 7.6 Cách Mạng Hiệu Suất：Phá Vỡ Giới Hạn Độ Dài (Linear Attention)

Ngoài MoE, còn một điểm đau cốt lõi nữa：**độ dài ngữ cảnh**.
Transformer truyền thống (như GPT-4) sử dụng **cơ chế attention tiêu chuẩn**, lượng tính toán của nó tăng theo cấp **bình phương** khi số từ tăng lên.

- Đọc 1 vạn từ, lượng tính toán là 1 trăm triệu lần.
- Đọc 10 vạn từ, lượng tính toán là 10 tỷ lần！

Để giải quyết vấn đề này, các mô hình như MiniMax (dòng abab) và RWKV đã áp dụng **cơ chế linear attention**.

### Tại Sao Một Cái Là "Dạng Lưới", Một Cái Là "Dạng Tuyến Tính"？

Sự khác biệt căn bản nằm ở：**Bạn chọn "giữ nguyên tất cả lời gốc", hay chọn "tổng kết bất cứ lúc nào"？**

- **Attention Tiêu Chuẩn (Dạng Lưới) —— Tại Sao Phải Nhìn Lại？**
  - **Lý do cốt lõi**：Để **"tìm kiếm sự liên quan"**.
  - **Ví dụ**：Như câu "Tôi đưa **quả táo** cho **nó**...". Khi bạn đọc đến từ "**nó**", để làm rõ "nó" rốt cuộc chỉ ai, mô hình phải quay lại quét tất cả các từ phía trước (tôi, đưa, quả táo, cho).
  - **Quá trình**："Nó" phát ra một tín hiệu truy vấn (Query), đi khớp với nhãn (Key) của tất cả các từ phía trước.
    - Khớp với "Tôi"？0 điểm.
    - Khớp với "quả táo"？**100 điểm！**
  - **Cái giá**：Bởi vì mô hình không biết từ nào quan trọng, nên **phải kiểm tra tất cả các từ phía trước, không được bỏ sót từ nào**. Đây chính là lý do tại sao các đường kết nối tạo thành một tấm lưới.

- **Linear Attention (Dạng Tuyến Tính) —— Tại Sao Có Thể Không Nhìn Lại？**
  - **Nguyên lý**：Mô hình học được cách "ghi chép". Sau khi đọc "quả táo", nó nén thông tin "có một quả táo" vào **trạng thái (State)**；khi đọc đến "nó", trực tiếp tra cứu trạng thái trong tay, liền biết "nó = quả táo".
  - **Cái giá**：Tuy nhanh, nhưng trong quá trình "nén" có thể mất đi một số chi tiết (ví dụ quên mất quả táo có màu đỏ).

<LinearAttentionDemo />

### 7.7 So Sánh Kiến Trúc：RNN vs Transformer vs RWKV

| Kiến Trúc      | Cơ Chế Cốt Lõi   | Độ Phức Tạp (Độ Dài N) | Huấn Luyện Song Song | Tốc Độ Suy Luận | Vấn Đề Quên        | Mô Hình Đại Diện |
| :------------- | :--------------- | :---------------------- | :------------------- | :-------------- | :----------------- | :--------------- |
| **RNN**        | Hồi quy tuần tự  | $O(N)$ (Thấp)           | ❌ Không             | Chậm (Tuần tự)  | Nghiêm trọng (Quên xa) | LSTM, GRU        |
| **Transformer**| Attention toàn cục | $O(N^2)$ (Cực cao)   | ✅ Có                | Trung bình (KV Cache) | Không (nhưng giới hạn bởi cửa sổ) | GPT-4, Llama |
| **RWKV / Linear** | Attention tuyến tính | $O(N)$ (Thấp)     | ✅ Có                | Nhanh (VRAM cố định) | Nhẹ (có tổn thất nén) | RWKV, MiniMax |

> **RWKV / Linear Attention** cố gắng kết hợp ưu điểm của hai bên：huấn luyện song song như Transformer, suy luận hiệu quả như RNN.

---

## 8. Tổng Kết Và Lộ Trình Học Tập

Bây giờ bạn đã thông suốt từ "Tokenization" đến "ChatGPT"：

1.  **Tokenization**：Văn bản được chia thành Token.
2.  **Embedding**：Token được ánh xạ thành vector ngữ nghĩa.
3.  **Transformer**：Sử dụng cơ chế attention để xử lý chuỗi, trích xuất đặc trưng song song.
4.  **Training**：Sử dụng Template để định dạng dữ liệu, huấn luyện song song qua Teacher Forcing.
5.  **Inference**：Sinh từng từ một theo kiểu tự hồi quy.

**Đề xuất bước tiếp theo**：

- Nếu bạn hứng thú với toán học, có thể học sâu về **đại số tuyến tính** (phép toán ma trận) và **lý thuyết xác suất**.
- Nếu bạn muốn thực hành, có thể thử dùng thư viện `transformers` của Python để tải một mô hình nhỏ (như GPT-2) nghịch thử.

---

## 9. Bảng Tra Cứu Thuật Ngữ (Glossary)

| Thuật Ngữ           | Tên Đầy Đủ                                | Giải Thích                                                                                                   |
| :------------------ | :---------------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| **LLM**             | Large Language Model                      | Mô Hình Ngôn Ngữ Lớn. Mô hình AI được huấn luyện trên lượng văn bản khổng lồ, có thể hiểu và sinh ngôn ngữ con người. |
| **Token**           | -                                         | **Đơn vị từ**. Đơn vị nhỏ nhất sau khi văn bản được chia tách (như từ, chữ hoặc mảnh ký tự). Mô hình đọc và viết đều là Token ID. |
| **Embedding**       | -                                         | **Vector từ**. Vector số ánh xạ Token vào không gian nhiều chiều (như 4096 chiều), nắm bắt quan hệ ngữ nghĩa của từ. |
| **Transformer**     | -                                         | Kiến trúc cốt lõi của LLM hiện đại. Dựa trên cơ chế attention, có khả năng xử lý song song văn bản dài.      |
| **Attention**       | Attention Mechanism                       | **Cơ chế tập trung chú ý**. Cho phép mô hình khi xử lý một từ, có thể động chú ý đến các từ liên quan khác trong ngữ cảnh. |
| **Context Window**  | -                                         | **Cửa sổ ngữ cảnh**. Số lượng Token tối đa mà mô hình có thể "ghi nhớ" trong một lần suy luận (ví dụ 128k).    |
| **Pre-training**    | -                                         | **Tiền huấn luyện**. Huấn luyện mô hình trên lượng lớn văn bản không gán nhãn, để nó học các quy luật cơ bản của ngôn ngữ và tri thức thế giới. |
| **SFT**             | Supervised Fine-Tuning                    | **Tinh chỉnh hướng dẫn**. Sử dụng dữ liệu cặp hỏi đáp chất lượng cao, dạy mô hình tuân theo hướng dẫn của con người. |
| **RLHF**            | Reinforcement Learning from Human Feedback | **Học tăng cường từ phản hồi con người**. Thông qua con người chấm điểm, điều chỉnh thêm hành vi của mô hình, để nó phù hợp với giá trị của con người (Căn chỉnh). |
| **CoT**             | Chain of Thought                          | **Chuỗi suy luận**. Kỹ thuật hướng dẫn mô hình sinh ra các bước lập luận trước khi đưa ra câu trả lời cuối cùng. |
| **MoE**             | Mixture of Experts                        | **Mô hình hỗn hợp chuyên gia**. Được tạo thành từ nhiều mô hình con "chuyên gia", tự động chọn kích hoạt phần chuyên gia nào dựa trên câu hỏi, hiệu quả cao hơn. |
| **Temperature**     | -                                         | **Nhiệt độ**. Tham số kiểm soát độ ngẫu nhiên khi mô hình sinh văn bản. Nhiệt độ càng cao, câu trả lời càng sáng tạo nhưng càng khó kiểm soát；nhiệt độ càng thấp, câu trả lời càng xác định. |

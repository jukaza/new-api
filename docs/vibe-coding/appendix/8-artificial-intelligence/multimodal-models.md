# Mô hình Đa phương thức (Thị giác / Âm thanh / Video)
> 💡 **Hướng dẫn học tập**: Chương này không yêu cầu nền tảng sâu về thị giác máy tính, thông qua các minh họa tương tác giúp bạn hiểu cách AI có được "đôi mắt". Chúng ta sẽ giải mã các nguyên lý cốt lõi đằng sau các mô hình như GPT-4V, Qwen-VL.

<VlmQuickStartDemo />

## 0. Lời mở đầu: Lắp mắt cho bộ não

Trong [Giới thiệu về Mô hình Ngôn ngữ Lớn](./llm-principles.md), chúng ta biết rằng LLM về bản chất là một "bộ não" bị nhốt trong hộp đen, chỉ có thể hiểu thế giới qua **văn bản**.

Sự xuất hiện của **Mô hình Ngôn ngữ Thị giác Lớn (VLM)**, tương đương với việc lắp cho bộ não này một đôi **mắt**.

Nhưng điều này không hề dễ dàng. Bởi vì:

- **Bộ não (LLM)** chỉ hiểu **văn bản** (chính xác là Token ID).
- **Mắt (camera)** nhìn thấy là **điểm ảnh** (giá trị màu RGB).

Nhiệm vụ cốt lõi của VLM, chính là **"dịch tín hiệu điểm ảnh" thành "tín hiệu văn bản"**, khiến LLM cảm thấy xem ảnh cũng dễ như đọc bài văn vậy.

---

## 1. Bước đầu tiên: Biến ảnh thành "từ vựng" (Visual Tokenization)

Hãy tưởng tượng, bạn đang gọi điện mô tả một bức tranh ghép cho bạn mình. Bạn không thể nói hết một hơi, bạn phải mô tả từng mảnh một.
Máy tính xem ảnh cũng theo cùng một nguyên lý.

### 1.1 Phân mảnh (Patchify) —— Tạo từ vựng thị giác

Chúng ta biết rằng, khi xử lý văn bản, Mô hình Ngôn ngữ Lớn (LLM) sẽ phân tách câu thành từng Token. Nếu bạn muốn LLM "đọc hiểu" ảnh, cách trực quan nhất chính là biến ảnh thành dạng tương tự như Token.

Để phù hợp với đặc tính "quen đọc từ" của mô hình lớn, chúng ta cần một kỹ thuật có thể chuyển đổi ảnh hai chiều liên tục thành các mảnh rời rạc, từ đó dẫn đến khái niệm **Phân mảnh Thị giác (Patchify)**: chúng ta cắt một bức ảnh hai chiều hoàn chỉnh, như cắt đậu phụ, thành từng ô lưới vuông nhỏ cố định (gọi là Patch).

- **Ảnh gốc** = Một bài văn hoàn chỉnh
- **Mảnh ảnh (Patch)** = Một từ (Token) trong bài văn

Trong thực hành kỹ thuật, chúng ta thường cắt ảnh theo kích thước cố định (ví dụ $16 \times 16$ hoặc $14 \times 14$ pixel) một cách liền mạch. Ví dụ, một ảnh đầu vào $224 \times 224$ pixel phổ biến, sau khi phân mảnh sẽ trở thành $14 \times 14 = 196$ ô ảnh độc lập.
Qua thao tác này, mảng điểm ảnh hai chiều liên tục ban đầu, đã được cắt vật lý thành 196 "từ điển từ vựng thị giác" rời rạc.

> 🕹️ **Minh họa tương tác**: Nhấp nút bên dưới, trải nghiệm cách ảnh gốc được cắt thành từng Patch độc lập bởi lưới quy tắc.

<PatchifyDemo />

### 1.2 Tuần tự hóa (Flatten) —— Xếp thành một câu

Sau khi hoàn thành bước phân mảnh trên, thứ chúng ta có trong tay hiện tại là một ma trận hai chiều $14 \times 14$. Tuy nhiên, dù là Transformer truyền thống hay LLM hiện đại, về kiến trúc cơ bản chúng hầu hết chỉ chấp nhận **đầu vào chuỗi một chiều** (tức là cấu trúc dữ liệu tuyến tính xếp từ trái sang phải).

Để tương thích với quy chuẩn đầu vào của mô hình lớn, chúng ta phải thực hiện **Tuần tự hóa (Flatten) và Chiếu tuyến tính (Linear Projection)**:
1. **Ép phẳng (Flatten)**: Nối đầu cuối các khối ảnh nhiều hàng, "ép phẳng" ma trận hai chiều thành một trục dài một chiều chỉ có thứ tự trước sau.
2. **Kéo giãn đặc trưng (Projection)**: 196 ô vuông này hiện tại vẫn chỉ là "thịt sống" chồng chất bởi điểm ảnh đỏ lục lam. Chúng ta cần dùng một mạng nơ-ron nhỏ (thường là một lớp kết nối đầy đủ) để xử lý từng ô vuông, nén và chuyển đổi chúng thành một vector đặc trưng có độ dài cố định (ví dụ danh sách số độ dài 768).

Sau bước này, một bức ảnh mới thực sự trở thành một chuỗi "từ vựng thị giác" (Visual Token Sequence).

> 🕹️ **Minh họa tương tác**: Quan sát hoạt hình bên dưới, hiểu cách **một khối điểm ảnh (Patch)** thuần túy trải qua quá trình kéo giãn ma trận, cuối cùng được ánh xạ thành một **Vector** chứa các chiều đặc trưng phong phú.

<LinearProjectionDemo />

---

## 2. Bước thứ hai: Phiên dịch xuyên loài (Projection)

Lúc này, mặc dù ảnh đã được chuyển hóa thành chuỗi "từ vựng thị giác" một chiều liên tục, nhưng chuỗi này đối với LLM cuối cùng, vẫn là một đống mã loạn không thể đọc được.

Tại sao không đọc được? Bởi vì **không gian đặc trưng khác nhau** (tức là ngôn ngữ chúng nói khác nhau).
Bộ mã hóa thị giác (như ViT) trích xuất ra là **đặc trưng điểm ảnh không gian** (ví dụ nó chỉ có thể cho bạn biết "đây là một thứ được tạo thành bởi rất nhiều đường đen cong", "đây là vùng màu đỏ lớn"); còn LLM bên trong hiểu là **đặc trưng ngữ nghĩa sâu** (ví dụ khái niệm "mèo", "cây cối", "nguy hiểm" v.v.).

Giữa hai hệ thống ngôn ngữ hoàn toàn khác biệt này, chúng ta cần bắc một cây cầu, chính là phiên dịch viên xuyên phương thức của chúng ta: **Projector (Bộ chiếu/Bộ chuyển đổi)**.

### 2.1 Vai trò của phiên dịch viên (Latent Space Alignment)

Bản chất học thuật của Projector là thực hiện **căn chỉnh không gian ẩn đặc trưng (Latent Space Alignment)**. Điều này giống như phiên dịch viên đồng thời trong đời thực:

- **Đầu vào (Source)**: "Đặc trưng thị giác" do ViT nhả ra (thiên về biểu diễn đặc trưng cao chiều liên tục như hình học, màu sắc, quy luật kết cấu v.v.).
- **Xử lý (Translation)**: Projector sử dụng một cấu trúc mạng nơ-ron (có thể là vài lớp biến đổi tuyến tính đơn giản, hoặc là các lớp attention phức tạp), trong quá trình này tìm ra mối quan hệ toán học giữa hai ngôn ngữ.
- **Đầu ra (Target)**: Xuất ra "ngôn ngữ LLM" hoàn toàn phù hợp với khẩu vị và kỳ vọng của LLM (nhúng văn bản tương đương được chuyển đổi từ đặc trưng ảnh, khiến ảnh có được ý nghĩa có thể đối thoại).

Qua lớp lọc phiên dịch này, mô hình lớn sẽ ngạc nhiên phát hiện: "Ơ? Chuỗi số truyền vào đây, chẳng phải chính là những tổ hợp từ mang tính mô tả mà tôi thường đọc sao!", từ đó thuận lý thành chương cùng xử lý đặc trưng ảnh và ngôn ngữ tự nhiên.

<ProjectorDemo />

### 2.2 Các trường phái phiên dịch khác nhau

Để "công đoạn phiên dịch" căn chỉnh đặc trưng này làm nhanh hơn, chuẩn hơn, giới học thuật và công nghiệp đã phát triển ra một số phương án thiết kế kết nối phần cứng tiêu biểu:

1. **Phái dịch thẳng (Linear Projection)**:
    - **Cách làm**: Cực kỳ đơn giản thô bạo, chỉ dùng một hoặc vài chục lớp Perceptron Đa tầng (MLP / lớp chiếu tuyến tính) để truyền qua biến đổi ma trận toán học trực tiếp.
    - **Đặc điểm**: **Tổn thất thông tin cực thấp, giữ nguyên chi tiết nguyên bản của ảnh**; nhưng nhược điểm là nhồi nhét toàn bộ hàng trăm nghìn Token từ vựng thị giác vừa phân mảnh vào mô hình ngôn ngữ, dẫn đến khối lượng tính toán sau đó tăng đột biến.
    - **Đại diện**: Dòng LLaVA.

2. **Phái dịch ý (Q-Former / Resampler)**:
    - **Cách làm**: Không truyền qua nguyên dạng, mà giới thiệu một "mạng trinh sát nhỏ" có khả năng tóm tắt trừu tượng ở giữa. Người đại diện trung gian này trước tiên nhanh chóng hiểu toàn cảnh ảnh, tinh lọc ra vài chục điểm cốt lõi được cô đặc cao.
    - **Đặc điểm**: **Thông tin được tinh giản và cô đặc cao, Token ít, tiết kiệm đáng kể sức mạnh tính toán cho LLM suy nghĩ và hiểu**; nhược điểm là có thể trong quá trình tinh lọc vứt bỏ những manh mối quan sát cực kỳ tinh tế ở rìa ảnh gốc.
    - **Đại diện**: BLIP-2, Gemini (cơ chế một phần tương tự).

3. **Phái dung hòa (C-Abstractor / Pooling)**:
    - **Cách làm**: Nhờ vào pooling tích chập hoặc tái tổ chức vùng cục bộ, nén đóng gói và hợp nhất các khối điểm ảnh liền kề $2 \times 2$ hoặc lớn hơn thành một đơn vị biểu đạt hoàn chỉnh.
    - **Đặc điểm**: Vừa nén hợp lý giới hạn độ dài Token, vừa giữ lại được một phần cảm giác cục bộ và không gian phụ thuộc lẫn nhau.
    - **Đại diện**: Qwen-VL-Max.

---

## 3. Bước thứ ba: Hợp thể (The Architecture)

Có linh kiện, có tiêu chuẩn kết nối, tiếp theo chúng ta xem nó hoàn thành trang bị toàn thân như thế nào. Các mô hình ngôn ngữ thị giác đa phương thức (Vision-Language Model) chủ đạo về cơ bản đều tuân theo **mô hình kiến trúc "ba đoạn"** thống nhất.

### 3.1 Cấu trúc cơ thể của VLM

<ModelArchitectureComparisonDemo />

Một thực thể VLM trong khuôn mẫu điển hình, chủ yếu vận hành đồng bộ bởi ba phần chính sau:

1. **"Mắt" cảm nhận đặc trưng (Vision Encoder - Bộ mã hóa Thị giác)**:
    - **Chức năng**: Là cửa ải đầu tiên của đầu vào ảnh, chịu trách nhiệm xem ảnh và trừu tượng hóa đặc trưng thị giác cao chiều.
    - **Lựa chọn**: Hầu hết các nhà sản xuất không huấn luyện mắt từ đầu, mà trực tiếp mượn các thành phần trưởng thành đã được huấn luyện trước trên dữ liệu 'cặp ảnh-văn bản' hàng trăm triệu (như mô hình CLIP tháp thị giác của OpenAI, hoặc mô hình SigLIP của Google).
    - *So sánh hình tượng: Đây chính là vùng tế bào cảm quang võng mạc được chuyên biệt hóa cao độ của cơ thể sinh vật.*

2. **"Dây thần kinh thị giác" chuyển đổi tín hiệu (Projector - Bộ chiếu phương thức)**:
    - **Chức năng**: Kết nối bộ mã hóa và nền tảng ngôn ngữ, chịu trách nhiệm nén chiều tín hiệu, khai thông và phiên dịch ngữ nghĩa đa phương thức.
    - **Lựa chọn**: Đây là **trọng tâm hàng đầu** trong huấn luyện tiếp theo của toàn bộ hệ thống đa phương thức. Lượng tham số của bản thân nó thường không lớn (tương đối so với LLM), nhưng quyết định liệu "văn bản" và "ảnh" có thể tâm ý tương thông hay không.
    - *So sánh hình tượng: Nó giống như trung khu thần kinh thị giác chịu trách nhiệm chuyển đổi tín hiệu điện truyền đến vỏ não.*

3. **"Bộ não" động cơ nhận thức (LLM Backbone - Nền tảng Mô hình Ngôn ngữ)**:
    - **Chức năng**: Gánh vác công việc quan sát cuối cùng, gọi kiến thức thường thức, suy luận logic sâu và sinh phản hồi nhân cách hóa.
    - **Lựa chọn**: Thường sử dụng mô hình ngôn ngữ lớn mã nguồn mở có IQ cao nhất trong ngành làm điểm gắn kết (như Qwen, Llama 3, Vicuna v.v.).
    - *So sánh hình tượng: Đây là trung tâm ngôn ngữ và quyết định của bộ não có kho kiến thức thế giới, nó đưa ra phán đoán tư duy bậc cao đối với tín hiệu đã xử lý do dây thần kinh thị giác truyền đến.*

---

## 4. Nó học xem ảnh như thế nào? (Training)

Được rồi, bây giờ các bộ phận cơ thể đã được khâu lại với nhau. Nhưng trước khi chính thức tiếp khách, VLM vừa lắp ráp xong thực ra đang ở trạng thái "mù và hỗn loạn" tương tự như trẻ sơ sinh - bởi vì dây thần kinh thị giác (Projector) mới thêm vào là một tờ giấy trắng, bên trong toàn là các giá trị số ngẫu nhiên không có ý nghĩa.

Muốn con quái vật ghép nối này có được khả năng xem ảnh và nói chuyện, giới khoa học đã tổng kết ra một bộ **"Quy tắc Huấn luyện Hai Giai đoạn (Two-Stage Training)"** hiệu quả.

### Giai đoạn một: Nhận biết vật (Feature Alignment —— Huấn luyện trước nhận biết vật)

Giai đoạn này, nhiệm vụ chính là để Projector ngẫu nhiên thiết lập mối quan hệ ánh xạ xuyên phương thức ban đầu. Quá trình rất giống dạy trẻ sơ sinh dùng "thẻ flash nhận thức" để cưỡng chế nhớ từ.

- **Cho nó xem (đầu vào huấn luyện)**: Số lượng lớn (thường hàng trăm triệu) các cặp ảnh-văn bản cực kỳ đơn giản chứa chủ thể nổi bật đơn lẻ (ví dụ ảnh "mèo" trên nền trắng).
- **Nói cho nó (đầu ra mục tiêu)**: Kèm theo từ vựng nhãn ngắn ("một con mèo màu cam").
- **Mục tiêu tối ưu hóa**: Cưỡng chế thúc đẩy Projector học thông qua biến đổi ma trận, để đặc trưng thị giác tương ứng của con mèo này (sau khi phiên dịch), căn chỉnh trùng khớp nhất có thể với vector Token của "mèo" trong ngôn ngữ tự nhiên.
- **Trạng thái kiểm soát tham số (Freeze Strategy)**: Để tránh phá hủy trí tuệ của mô hình gốc, trong giai đoạn này các nhà nghiên cứu sẽ **đóng băng (Freeze)** nặng hàng chục hàng trăm tỷ tham số của "mắt" (ViT) và "não" (LLM), **chỉ mở huấn luyện vài triệu tham số của bản thân "dây thần kinh thị giác" (Projector)** .

<FeatureAlignmentDemo />

### Giai đoạn hai: Đối thoại (Visual Instruction Tuning —— Diễn tập đối thoại)

Nếu giai đoạn một chỉ khiến mô hình trở thành cái máy đọc tên như báo danh sách món ăn, thì nhiệm vụ của giai đoạn hai chính là kích hoạt trí thông minh bậc cao của nó, khiến nó thực sự có thể dựa vào ngữ cảnh để giải đáp các hướng dẫn kết hợp ảnh-văn bản phức tạp của con người.

- **Cho nó xem (đầu vào huấn luyện)**: Các cặp hỏi-đáp chất lượng cao được thiết kế tinh tế. Ví dụ cung cấp một bức ảnh toàn cảnh giao thông đô thị phức tạp.
- **Yêu cầu nó trả lời (đầu ra mục tiêu)**: User hỏi: "`<ảnh>` Người đàn ông cưỡi xe đạp trắng ở góc dưới bên trái có đội mũ bảo hiểm không?" Assistant trả lời: "Không, trên đầu anh ấy không đội gì cả, đây là hành vi rất nguy hiểm trong thành phố."
- **Mục tiêu tối ưu hóa**: Khiến mô hình lớn không chỉ tiếp nhận manh mối thị giác, mà còn có thể kết hợp kiến thức thường thức văn minh tích lũy từ trước, dung hợp thông suốt logic văn bản với biểu diễn đa phương thức và đưa ra suy luận.
- **Trạng thái kiểm soát tham số (Freeze Strategy)**: Lúc này dây thần kinh thị giác đã cơ bản được điều chỉnh thông. Trong giai đoạn tinh chỉnh này, thường sẽ tiếp tục đóng băng một phần trọng số tầng dưới của bộ mã hóa thị giác, đồng thời **giải phóng hoàn toàn mở LLM và Projector** (hoặc dùng cấu hình LoRA), tiến hành hiệu chỉnh lan truyền ngược liên kết quy mô lớn toàn cục.

<VLMInferenceDemo />

---

## 5. Nâng cao: Nhìn rõ hơn (Advanced Tricks)

Mặc dù kiến trúc trên đã chống đỡ cho khuôn mẫu đa phương thức ban đầu, nhưng mô hình VLM thế hệ đầu tiên tồn tại một khiếm khuyết cơ bản rất đau đầu - **cận thị (thị lực bẩm sinh không đủ)**.

Bộ mã hóa thị giác ViT thời kỳ đầu vì lý do thiết kế lịch sử, bẩm sinh chỉ có thể xử lý những ảnh nhỏ độ phân giải cực kỳ thấp như $224 \times 224$ hoặc $336 \times 336$. Điều này giống như cưỡng chế quan sát thế giới qua một camera cổ lỗ mờ nhòe vài trăm nghìn điểm ảnh chất lượng thấp, những chi tiết nhỏ hơn một chút như biển hiệu chữ trong ảnh hoàn toàn sẽ nhòe thành một đám điểm ảnh, bộ não dù có thông minh đến đâu cũng là "người nội trợ giỏi không thể nấu cơm không có gạo".

Để khắc phục căn bệnh độ phân giải thấp, các nhà sản xuất mô hình tiên phong (như đội Qwen-VL, LLaVA-NeXT v.v.) đã dùng một số thủ đoạn kỹ thuật rất tinh tế:

### 5.1 Bố cục phân mảnh độ phân giải cao động (Dynamic High-Resolution Mapping)

Nếu trực tiếp nhập ảnh lớn sẽ dẫn đến tràn bộ nhớ GPU, mà thu nhỏ thô bạo lại làm mất hết chi tiết, phải phá cục thế nào? Cách giải hiện nay là: **chiến lược góc nhìn kép "cận cảnh cục bộ + toàn cảnh từ trên cao"** .

1. **Tổng quan toàn cảnh**: Đầu tiên thu nhỏ trực tiếp ảnh gốc độ phân giải cao khổng lồ xuống $336 \times 336$, cho mắt nhìn một cái. Điều này giúp mô hình nắm bắt **cấu trúc bố cục vĩ mô tổng thể** của bức ảnh (bầu trời ở đâu? Mặt đất ở đâu?).
2. **Phân mảnh phóng to xem**: Cắt ảnh gốc độ phân giải cao thành vài chục khối cận cảnh cục bộ $336 \times 336$ không tổn thất độc lập (Slice).
3. **Xem xét từng cái và ghép nối không gian**: Để công cụ thị giác dùng kính lúp quét từng mặt cắt không tổn thất này để thu thập chi tiết độ phân giải cao. Sau đó, Projector sẽ như trò chơi ghép hình, khâu lại ngữ nghĩa của những khối chi tiết này với ngữ cảnh tổng quan ban đầu.

Cách làm này, giống như bạn cầm điện thoại chụp một tấm toàn cảnh tờ báo (xem bố cục trang toàn diện), rồi lại áp sát điện thoại vào tờ báo liên tục chụp vài chục tấm cận cảnh đoạn văn để tổ hợp lại.

### 5.2 Đổi một đôi mắt to bẩm sinh (Scaling the Vision Encoder)

Một cách làm khác thuần túy thể hiện mỹ học bạo lực là: đã con mắt gốc có khiếm khuyết gen bẩm sinh, thì tôi chế tạo lại từ đầu một siêu con mắt kinh thiên động địa nhất.

Lấy mô hình mã nguồn mở xuất sắc trong nước **InternVL** làm đại diện kinh điển, nó từ bỏ mô hình thị giác quy mô nhỏ thường dùng, từ dưới lên trên trực tiếp tiêu tốn lượng tài nguyên khổng lồ huấn luyện riêng một nền tảng tiền tố bộ mã hóa thị giác siêu khổng lồ với lượng tham số lên đến vài tỷ (như InternViT-6B với 6 tỷ tham số) hiếm thấy.
Nhờ vào khả năng hấp thụ dữ liệu cực mạnh, nó sinh ra đã hỗ trợ nguyên sinh đầu vào độ phân giải cao liền mạch như "kính viễn vọng không gian Hubble". Thiết kế này giảm đáng kể chi phí kỹ thuật phức tạp và rủi ro lệch đặc trưng mà hệ thống phải đưa vào để cắt ảnh ghép ảnh, trực tiếp thực hiện cảm nhận thị giác độ phân giải cao "một cái nhìn thấu hết".

---

## 6. Tổng kết

Mô hình Ngôn ngữ Thị giác Lớn (VLM) không có ma thuật gì cả. Nó chỉ làm một việc:

**Dịch "ảnh" - một loại ngoại ngữ, thành "văn bản" - tiếng mẹ đẻ, rồi cho LLM ăn.**

Chỉ cần hiểu được điểm này, bạn đã hiểu tất cả về VLM.

---

## 7. Bảng tra cứu nhanh thuật ngữ (Glossary)

| Thuật ngữ    | Đầy đủ               | Giải thích                                                       |
| :------------ | :-------------------- | :--------------------------------------------------------- |
| **VLM**       | Vision-Language Model | **Mô hình Đa phương thức Lớn**. GPT có thể xem hiểu ảnh.                         |
| **ViT**       | Vision Transformer    | **Mô hình Thị giác**. "Mắt" của VLM, chịu trách nhiệm biến điểm ảnh thành vector.           |
| **Patch**     | -                     | **Khối ảnh**. Ô vuông nhỏ ảnh được cắt ra, tương đương với "từ vựng thị giác".         |
| **Projector** | -                     | **Bộ chiếu/Phiên dịch viên**. Cây cầu kết nối mắt và não.                  |
| **Alignment** | -                     | **Căn chỉnh**. Khiến đặc trưng ảnh và đặc trưng văn bản trong cùng một không gian "nghe hiểu lẫn nhau". |
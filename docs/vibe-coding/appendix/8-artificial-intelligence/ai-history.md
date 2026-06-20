---
title: 'Lịch sử tóm tắt AI: Từ logic ký hiệu đến mô hình lớn trăm tỷ tham số'
description: 'AI phát triển 70 năm, trải qua ba làn sóng, hai mùa đông, cuối cùng hội tụ thành kỷ nguyên mô hình lớn ngày nay.'
---

# Lịch sử tóm tắt AI: Từ logic ký hiệu đến mô hình lớn trăm tỷ tham số

AI phát triển 70 năm, trải qua **ba làn sóng, hai mùa đông**, từ suy luận logic của chủ nghĩa ký hiệu, đến mạng nơ-ron của chủ nghĩa kết nối, rồi đến học tăng cường của chủ nghĩa hành vi, cuối cùng hội tụ thành kỷ nguyên mô hình lớn ngày nay. Hiểu về lịch sử AI giúp chúng ta nhìn rõ bản chất nguồn gốc "trí thông minh" của các mô hình lớn hiện đại.

<AiEvolutionDemo />
<DiscriminativeVsGenerativeDemo />

---

## I. Nền tảng lý thuyết và sự ra đời của chủ nghĩa ký hiệu (1940s-1950s)

Trước khi máy tính thực sự phổ biến, những người tiên phong đã bắt đầu suy nghĩ về việc "liệu máy móc có thể suy nghĩ như con người hay không". Nghiên cứu thời kỳ này chủ yếu tập trung vào mô hình toán học của nơ-ron thần kinh, thảo luận về lý thuyết tính toán và tự động hóa suy luận logic. Hội nghị Dartmouth năm 1956 chính thức tuyên bố "Trí tuệ nhân tạo" (Artificial Intelligence) ra đời như một ngành khoa học độc lập.

<FoundationDemo />

### 1.1 Lý thuyết cốt lõi và các sự kiện quan trọng

- **Ý tưởng ban đầu về mạng nơ-ron (1943)**: Nhà sinh lý học thần kinh Warren McCulloch và nhà toán học Walter Pitts đã đề xuất **mô hình nơ-ron MP**. Họ lần đầu tiên thử dùng công thức toán học đơn giản để trừu tượng hóa cơ chế hoạt động của nơ-ron não người, chứng minh rằng "mạng nơ-ron có thể tính toán được", điều này trở thành tổ tiên của tất cả các mạng sâu ngày nay.
- **Câu hỏi tối hậu của Turing (1950)**: Cha đẻ của khoa học máy tính Alan Turing đã xuất bản một bài báo thay đổi lịch sử mang tên "Máy tính và Trí tuệ", đề xuất **bài kiểm tra Turing** nổi tiếng. Ông tránh tranh luận triết học về "trí thông minh là gì", đưa ra một tiêu chuẩn thực tế: nếu một cỗ máy trong hội thoại khiến con người không thể phân biệt được đó là người hay máy, thì nó đã có trí thông minh.
- **Chính thức thành lập ngành (1956)**: Tại hội thảo mùa hè Dartmouth, John McCarthy, Marvin Minsky và các học giả trẻ khác đã tụ họp. McCarthy lần đầu tiên sử dụng thuật ngữ "Artificial Intelligence" trong đề xuất của mình, năm này do đó được gọi là năm khởi nguyên của AI.

::: tip Sự trỗi dậy của chủ nghĩa ký hiệu (Symbolism)
Trong nghiên cứu AI thời kỳ đầu, **chủ nghĩa ký hiệu** chiếm vị trí thống trị tuyệt đối. Vì máy tính thời đó chủ yếu dựa vào mạch logic để vận hành, các học giả tự nhiên cho rằng: **bản chất của trí thông minh chính là suy luận ký hiệu**.
Chỉ cần chúng ta biến tri thức thế giới thành các ký hiệu mà máy tính có thể hiểu được (như khái niệm, quy tắc), rồi dùng công cụ suy luận logic (như quy tắc IF-THEN) để xử lý những ký hiệu này, máy móc sẽ có thể suy nghĩ như con người. Đây là một cách tiếp cận **từ trên xuống**, phụ thuộc cao vào đầu vào tri thức từ chuyên gia con người.
:::

---

## II. Thời kỳ hoàng kim của chủ nghĩa ký hiệu và làn sóng AI thứ nhất (1960s-1970s)

Trong hơn mười năm đầu sau khi ra đời, AI đã trải qua một thời kỳ hoàng kim đầy lạc quan mù quáng. Các nhà nghiên cứu tin rằng, vì máy móc đã có thể chứng minh định lý toán học, việc viết ra chương trình có thể giải quyết mọi vấn đề của con người chỉ là vấn đề thời gian.



### 2.1 Những năm tháng huy hoàng của hệ chuyên gia

Đỉnh cao của chủ nghĩa ký hiệu là **hệ chuyên gia (Expert Systems)**. Bằng cách nhập vào máy tính "quy tắc kinh nghiệm (Rule)" của các chuyên gia hàng đầu trong từng lĩnh vực, hệ thống có thể thực hiện chẩn đoán hoặc ra quyết định ở trình độ cao trong một số lĩnh vực dọc cụ thể.

| Hệ chuyên gia | Năm ra đời | Ý nghĩa lịch sử và giá trị thực tiễn |
| --- | --- | --- |
| **Dendral** | 1965 | **Hệ chuyên gia đầu tiên**, có thể suy luận cấu trúc phân tử hóa học từ dữ liệu phổ khối, hiệu suất sánh ngang chuyên gia hóa học con người. |
| **MYCIN** | 1977 | Dùng để chẩn đoán nhiễm trùng máu và đề xuất kháng sinh, độ chính xác lên đến 69%, thậm chí vượt qua nhiều bác sĩ không chuyên thời bấy giờ. |
| **XCON** | 1980 | Hệ chuyên gia thương mại thành công nhất thời kỳ đầu, giúp Digital Equipment Corporation (DEC) tự động cấu hình hệ thống máy tính theo nhu cầu khách hàng, tiết kiệm cho công ty 40 triệu đô la mỗi năm. |

Tuy nhiên, đằng sau vẻ hào nhoáng của hệ chuyên gia, ẩn chứa những hố sâu không thể vượt qua.

### 2.2 Mùa đông AI thứ nhất (1974-1980)

Theo thời gian, người ta phát hiện ra rằng con đường "biến tri thức con người thành quy tắc" ngày càng hẹp. Ba hạn chế chí mạng của chủ nghĩa ký hiệu cuối cùng đã dẫn đến việc kinh phí nghiên cứu bị cắt hoàn toàn:

**Nút thắt thu thập tri thức**: Có những tri thức con người cũng không thể diễn đạt rõ ràng (ví dụ như làm thế nào để nhận ra một con mèo), điều này được gọi là "nghịch lý Polanyi". Hệ chuyên gia chỉ có thể mã hóa cứng những quy tắc có thể được biểu đạt rõ ràng, không thể tự động học.

**Bùng nổ tổ hợp & vấn đề mong manh**: Tình huống thực tế quá nhiều, liệt kê toàn bộ cực kỳ khó khăn; hơn nữa thiếu tri thức thông thường, chỉ cần hơi lệch khỏi cơ sở quy tắc là hệ thống sụp đổ ngay lập tức.

**Thiếu sức mạnh tính toán & đứt gãy kinh phí**: Phần cứng thời đó hoàn toàn không thể hỗ trợ suy luận logic bùng nổ, gặp phải đợt cắt giảm lớn kinh phí nghiên cứu từ DARPA.

---

## III. Hệ chuyên gia (chương trình dịch kinh nghiệm con người thành mã) và làn sóng AI thứ hai (1980s)

Đến những năm 80, với sự phổ biến của máy vi tính và máy LISP chuyên dụng, hệ chuyên gia một lần nữa được giới thương mại ưa chuộng. Chính phủ Nhật Bản thậm chí đã đưa ra "Kế hoạch máy tính thế hệ thứ năm" đầy tham vọng, cố gắng tạo ra cỗ máy thông minh có thể hiểu ngôn ngữ tự nhiên, gây ra làn sóng đầu tư theo hoảng loạn trên toàn cầu.

### 3.1 Sự bùng nổ và sụp đổ của ứng dụng thương mại

Trong thời đại này, hầu như mọi tập đoàn đa quốc gia lớn đều đang phát triển **hệ chuyên gia của riêng mình (một loại chương trình dịch kinh nghiệm của chuyên gia con người thành hàng ngàn dòng mã IF-THEN)**. Tuy nhiên, việc bảo trì những hệ thống này trở nên cực kỳ khổ sở. Khi cơ sở quy tắc vượt quá vài chục ngàn mục, sửa đổi một quy tắc mới thường khiến mười quy tắc cũ khác phát sinh xung đột. Cùng với sự bùng nổ hiệu năng của máy tính cá nhân (PC) đa năng vào cuối những năm 80, những cỗ máy AI chuyên dụng đắt đỏ và đóng kín trở nên hoàn toàn không có sức cạnh tranh.

::: warning ❄️ Mùa đông AI thứ hai (1987-1993)
Năm 1987, thị trường phần cứng AI sụp đổ hoàn toàn. "Kế hoạch máy tính thế hệ thứ năm" cuối cùng thất bại vì quá xa rời kiến trúc phần cứng thực tế. Tiền bạc doanh nghiệp đổ vào hệ chuyên gia tan thành mây khói, nghiên cứu AI một lần nữa rơi xuống đáy, thuật ngữ "trí tuệ nhân tạo" thậm chí trở thành từ ngữ miệt thị lừa đảo kinh phí trong giới học thuật.
:::

### 3.2 Chủ nghĩa kết nối ẩn mình trong bóng tối

Trong hai lần thăng trầm này, thực ra còn tồn tại một hướng tư duy hoàn toàn khác — **chủ nghĩa kết nối (Connectionism)**, cũng chính là thứ mà ngày nay chúng ta gọi là **mạng nơ-ron**.

<PerceptronDemo />

Chủ nghĩa kết nối đã được Frank Rosenblatt đề xuất từ năm 1958 dưới dạng **perceptron (Perceptron)**. Nó mô phỏng não bộ học tập thông qua việc điều chỉnh trọng số kết nối giữa các nơ-ron. Thay vì dạy cho máy những "quy tắc" rõ ràng, hãy cho máy xem một lượng lớn "ví dụ", để nó tự tổng quát hóa. Tuy nhiên, năm 1969, Minsky trong cuốn sách "Perceptrons" đã dùng toán học chặt chẽ chứng minh hạn chế của mạng đơn tầng thời bấy giờ (không thể giải quyết bài toán XOR đơn giản). Điều này khiến chủ nghĩa kết nối phải ngồi ghế dự bị suốt thời kỳ hoàng kim của chủ nghĩa ký hiệu. Cho đến khi bánh xe lịch sử tiến đến những năm 90.

---

## IV. Sự trỗi dậy của machine learning và sự hồi sinh của chủ nghĩa kết nối (1990s-2000s)

Bước vào những năm 90, lĩnh vực AI xuất hiện một sự chuyển hướng thực dụng quan trọng. Mọi người không còn ngày ngày bàn luận về cách đạt được "trí thông minh ma thuật như con người", mà chuyển trọng tâm sang cách sử dụng **phương pháp thống kê dữ liệu chặt chẽ** để giải quyết các bài toán phân loại và dự đoán trong đời sống thực tế. Đây chính là sự trỗi dậy của **machine learning (Machine Learning)** truyền thống.

### 4.1 Từ quy tắc cứng nhắc đến "tìm kiếm ranh giới toán học"

Năm 1997, tuy "Deep Blue" của IBM đánh bại nhà vô địch cờ vua thế giới Garry Kasparov, mang về vinh quang rực rỡ cho chủ nghĩa ký hiệu, nhưng giới học thuật ngay lập tức nhận ra rằng đây chỉ là chiến thắng của "sức mạnh tính toán + mã hóa cứng hàng loạt", Deep Blue không thực sự hiểu thế nào là chơi cờ.

Cùng thời điểm đó, các thuật toán machine learning cổ điển như **máy vector hỗ trợ (SVM)**, cây quyết định, rừng ngẫu nhiên nổi lên mạnh mẽ, trở thành dòng chủ lưu tuyệt đối trong hơn mười năm tiếp theo.

Nếu như hệ chuyên gia trước đây dạy máy tính: "nếu email chứa từ 'trúng thưởng', thì đó là email rác", thì **tư duy của machine learning là: con người thiết lập trước một số đặc trưng cốt lõi (kỹ thuật đặc trưng)** như "độ dài email", "tần suất từ đặc biệt", "độ tin cậy của người gửi", sau đó nhập hàng chục ngàn email đã được gán nhãn vào máy tính. Trong không gian đa chiều này, **máy vector hỗ trợ (SVM)** giống như một nhà toán học cầm thước, nó sẽ sử dụng suy luận hàm nhân chặt chẽ để vẽ ra một "đường ranh giới toán học rộng nhất và an toàn nhất" giữa email bình thường và email rác.

Mặc dù SVM đạt được thành công lớn trong nhiều tác vụ, nó vẫn tồn tại một điểm yếu chí mạng: **kỹ thuật đặc trưng (Feature Engineering) phụ thuộc cao vào con người.** Ví dụ như để nhận diện một bức ảnh mèo, nhà khoa học con người phải dạy máy "trước tiên trích xuất cạnh", "sau đó tìm tai hình tam giác", bản thân máy không thể tự tìm ra hình dạng con mèo! Điều này khiến giới hạn trên của năng lực mô hình bị khóa chặt bởi nhận thức của con người.

### 4.2 Lan truyền ngược đưa mạng nơ-ron trở lại ánh sáng

Nền tảng thực sự của deep learning đã được đặt xuống trong thời kỳ này:

<BackpropagationDemo />

Trong giai đoạn ẩn mình này, Geoffrey Hinton và các cộng sự đã làm rõ hơn giá trị cốt lõi của **lan truyền ngược (Backpropagation)**: khi mạng nơ-ron nhiều tầng đưa ra dự đoán sai, nó có thể đẩy ngược sai số này như sóng nước, từng tầng từng tầng một, thông báo cho từng nơ-ron ẩn cũ rằng: "bạn phải chịu bao nhiêu trách nhiệm trong lần sai này, lần sau hãy sửa ngay đi!"

Điều này cuối cùng đã phá vỡ sự giam cầm đối với mạng nơ-ron từ những năm 60, khiến mạng có tầng ẩn trở nên khả thi. Nhưng lúc đó dữ liệu còn quá ít, phần cứng quá yếu (thậm chí chưa có card đồ họa tốt), mạng nơ-ron vẫn chưa thể toàn diện đánh bại các mô hình machine learning truyền thống như SVM. Cho đến khi **ba điểm bùng nổ** cùng hội tụ.

---

## V. Cách mạng deep learning và chủ nghĩa kết nối thống trị (2010s)

Những năm 2010, cùng với **sự trưởng thành của dữ liệu lớn (như dự án ImageNet)**, **sự bùng nổ sức mạnh tính toán (GPU được ứng dụng rộng rãi cho tính toán song song)** và **cải tiến thuật toán (giải quyết vấn đề tiêu biến gradient)**, "deep learning" đã rầm rộ mở màn cho làn sóng AI thứ ba.

**Sự khác biệt bản chất giữa deep learning và machine learning truyền thống là gì? Dấu hiệu chính là: tự động trích xuất đặc trưng (học biểu diễn).** Chỉ cần mạng đủ sâu (vài chục đến hơn trăm tầng), mạng nơ-ron có thể trực tiếp nuốt vào pixel thô nhất, tầng thấp của nó tự học cách nhận diện đường nét, tầng giữa học cách nhận diện kết cấu lông, tầng cao trực tiếp nhận ra đây là một "con mèo". Trong cuộc cách mạng này, con người kiêu ngạo cuối cùng đã buông tay, để mạng tự tìm ra những đặc trưng thị giác, giọng nói và văn bản quan trọng nhất.

### 5.1 Đột phá toàn diện trong hình ảnh và thi đấu

Năm 2012, **AlexNet (mạng CNN cổ điển)** do nhóm của Hinton dẫn dắt đã tham gia cuộc thi phân loại ảnh ImageNet nổi tiếng. Trong khi người khác còn đang vất vả dùng phương pháp truyền thống để trích xuất đặc trưng thủ công, AlexNet trực tiếp giáng đòn giảm chiều bạo lực, hạ tỷ lệ lỗi từ 26% xuống còn 15.3%, gây chấn động toàn bộ giới thị giác máy tính truyền thống. Với sức thống trị tuyệt đối này, trong những năm sau đó, hầu như không có bất kỳ bài báo nào không sử dụng deep learning có thể được các hội nghị hàng đầu chấp nhận!

Những năm tiếp theo, công nghệ AI tăng tốc điên cuồng từng phút từng giây:

<NeuralNetworkVisualizationDemo />

| Năm đột phá | Thành tựu tiêu biểu | Ảnh hưởng sâu rộng |
| --- | --- | --- |
| **2014** | **GAN (Mạng đối kháng tạo sinh)** được đề xuất | Hai mạng "tả xung hữu đột" (một tạo giả, một phát hiện giả), giúp AI bắt đầu có khả năng tạo ra những hình ảnh sống động và chân thực đáng kinh ngạc. |
| **2015** | **ResNet (Mạng thặng dư)** ra đời | Sáng tạo đưa vào cấu trúc "đường tắt", giải quyết vấn đề không thể huấn luyện bình thường khi mạng quá sâu, giúp mạng nơ-ron có thể dễ dàng xếp chồng hàng trăm đến hàng ngàn tầng. |
| **2016** | **AlphaGo** đánh bại Lee Sedol | Đỉnh cao kết hợp deep learning và **học tăng cường**, phá vỡ khẳng định "máy móc không bao giờ thắng được con người trong cờ vây", gây chấn động toàn cầu. |

::: tip Chủ nghĩa hành vi (Behaviorism) và học tăng cường
AlphaGo đại diện cho chiến thắng của một trường phái khác — **chủ nghĩa hành vi**. Nó cho rằng trí thông minh đến từ tương tác động giữa chủ thể và môi trường, giống như huấn luyện một chú chó con ngồi xuống: làm đúng được thưởng, làm sai bị phạt. Thông qua việc liên tục tự thử sai và đối đầu trong môi trường ảo khổng lồ, AlphaGo đã tổng kết ra những chiến lược mà ngay cả kỳ thủ hàng đầu con người cũng chưa từng phát hiện.
:::

### 5.2 Transformer: Cái nôi ấp ủ mô hình lớn

Năm 2017, bánh răng định mệnh bắt đầu chuyển động. Google trong bài báo "Attention Is All You Need" đã đề xuất một kiến trúc deep learning hoàn toàn mới — **Transformer**.

<AttentionMechanismDemo />

Trước đây khi xử lý một câu (ví dụ như mô hình RNN), AI chỉ có thể đọc từng từ một từ trái qua phải, đọc xong phần sau dễ quên phần trước. Nhưng **cơ chế tự chú ý (Self-Attention)** của Transformer đã hoàn toàn phá vỡ giới hạn này: nó cho phép AI "nhìn toàn bộ" cả câu trong một lần, và khi thấy từ "quả táo", tự động phán đoán theo ngữ cảnh đây là chỉ trái cây, hay là chỉ công ty điện thoại của Steve Jobs.

Nó sinh ra đã phù hợp với tính toán song song, nuốt được lượng dữ liệu vô hạn, và có thể được xếp chồng rộng lớn vô tận. Khoảnh khắc này, nền móng của mô hình lớn (LLM) đã được đặt xong.

---

## VI. Kỷ nguyên mô hình lớn và ánh bình minh của trí tuệ tổng quát (2018 đến nay)

Khi Transformer gặp gỡ sức mạnh tính toán điên cuồng không giới hạn chi phí và dữ liệu khổng lồ, mô hình phát triển AI trong lịch sử đã bị thay đổi vĩnh viễn. Các nhà khoa học phát hiện ra một hiện tượng đáng kinh ngạc: kiến trúc dựa trên tự chú ý dường như không bao giờ "no". Các mô hình deep learning trước đây, mức độ thông minh sẽ gặp trần, nhưng Transformer có thể hoàn hảo thích ứng với tính toán song song quy mô lớn của GPU, chỉ cần cho nó càng nhiều dữ liệu, mạng càng sâu, hiệu suất của nó có thể tăng lên vô hạn.

### 6.1 Mô hình "tiền huấn luyện + tinh chỉnh" được xác lập: Từ chuyên gia đến tổng quát

Ban đầu chúng ta làm AI là "một tác vụ ghép một mô hình nhỏ": làm dịch thuật thì huấn luyện riêng mô hình dịch, chat thì huấn luyện riêng mô hình chat, giống như đào tạo từng "chuyên gia" chỉ giỏi một nghề. Nhưng đến năm 2018, với sự ra mắt của **GPT-1** của OpenAI và **BERT** của Google, tình hình đã chuyển thành mô hình mới **"sức mạnh tạo nên kỳ tích"**.

Trước hết là **tiền huấn luyện (Pre-training)**, thứ tạo nên 99% trí tuệ cốt lõi của mô hình ngôn ngữ lớn. Các nhà khoa học đổ toàn bộ hàng ngàn tỷ từ trong các bài viết, sách kinh điển, mã máy tính thậm chí kiến thức bách khoa mà nhân loại để lại trên internet vào trong mạng Transformer khổng lồ. Còn nhiệm vụ huấn luyện cho nó, lại chỉ đơn giản là **"nối từ" (dự đoán từ tiếp theo)**.

Để có thể dự đoán chính xác vô cùng các "từ tiếp theo" trong ngôn ngữ con người, mô hình bị buộc phải tự nội hóa và cô đặc toàn bộ quy luật vận hành của thế giới trong hàng trăm đến hàng ngàn tỷ tham số nơ-ron của nó! Nó không chỉ hoàn toàn nắm vững ngữ pháp chủ-vị-tân, biết "quả táo" là một loại trái cây màu đỏ, mà còn có thể nắm được logic đằng sau "Newton phát hiện ra trọng lực vì quả táo rơi". Điều này giống như một đứa trẻ chưa từng cố ý học thuộc sách ngữ pháp, nhưng nhờ đọc rộng hàng ngàn vạn cuốn sách, đã tự động có được khả năng hiểu thế giới phức tạp.

<GPTEvolutionDemo />

Từ GPT-2 (1,5 tỷ tham số) đến GPT-3 (175 tỷ tham số), các nhà khoa học đã kinh ngạc phát hiện ra **năng lực trồi sinh (Emergent Abilities)** — khi mô hình đủ lớn, sự thay đổi về lượng đã gây ra sự thay đổi về chất đáng sợ. Ngay cả khi chưa từng được huấn luyện có chủ đích, mô hình với tham số khổng lồ đã tự "ngộ" ra năng lực suy luận logic, viết mã và học trong ngữ cảnh. Điều này hoàn toàn không cần con người dạy riêng bằng mã.

### 6.2 Sự bùng nổ của AI tạo sinh và khoảnh khắc bom nguyên tử ChatGPT

Sau khi có được một mô hình tiền huấn luyện khổng lồ đầy tri thức và chứa đựng tri thức thông thường của thế giới, còn thiếu một bước cuối cùng để tạo ra một trợ lý AI cá nhân hoàn hảo: **tinh chỉnh (Fine-tuning)**. Bởi vì mô hình tiền huấn luyện chỉ quen mù quáng viết tiếp văn bản, nó không hiểu "chỉ thị" của người dùng, cũng không biết cách tương tác hỏi-đáp theo quy củ.

Tháng 11 năm 2022, OpenAI đã khéo léo đưa vào kỹ thuật **RLHF (Học tăng cường từ phản hồi con người)**. Họ thuê một lượng lớn chuyên gia để chấm điểm và sửa chữa câu trả lời của mô hình. Điều này giống như đặt ra ranh giới giao tiếp và hướng dẫn lễ nghi rõ ràng cho một thiên tài cực kỳ thông minh nhưng ăn nói vô tội vạ, cưỡng chế định hình nó thành một trợ lý hội thoại ôn hòa, có trình tự và hiểu chuyện. Và thế là, **ChatGPT** ra đời.

Chỉ sau một đêm, AI không còn là món đồ chơi phòng thí nghiệm khô khan, mà trở thành bộ não trí tuệ tổng quát trong tay mỗi người bình thường.

Sau đó mở ra kỷ nguyên đa phương thức đầy sôi động:
* **2023: Kết nối đa giác quan.** Các mô hình tạo ảnh như Midjourney, Stable Diffusion đã định hình lại ngành nghệ thuật số. **GPT-4** ra mắt cùng năm đã tích hợp khả năng hiểu hình ảnh thị giác cực kỳ khó và hệ thống suy luận liên kết logic tầm xa.
* **2024 bùng nổ đến nay: Mô phỏng thế giới vật lý.** Cùng với sự ra mắt của các mô hình tạo video chân thực như Sora, và sự triển khai toàn diện của mô hình ngôn ngữ lớn thoại thời gian thực đầu cuối về mặt cảm xúc và âm sắc, AI từ xử lý văn bản đơn thuần đã nhanh chóng mở rộng sang nhận thức toàn diện về thế giới hoàn chỉnh bao gồm không gian ba chiều, ánh sáng chuyển động và thậm chí cả sắc thái cảm xúc tinh tế trong giọng nói.

---

## VII. Sự hội tụ của ba trường phái AI và triển vọng tương lai

Nhìn lại 70 năm qua, từ việc để máy móc suy luận định lý toán học (chủ nghĩa ký hiệu), đến tìm kiếm ranh giới thống kê (machine learning truyền thống), đến chiến thắng cờ vây qua thử sai (chủ nghĩa hành vi/học tăng cường), rồi đến mô hình lớn trồi sinh tri thức thông thường từ việc nuốt dữ liệu khổng lồ (hình thái cực đoan của chủ nghĩa kết nối), sự phát triển của trí tuệ nhân tạo chưa bao giờ dừng lại.

Mô hình lớn ngày nay dường như từ bỏ việc con người viết "quy tắc" cứng nhắc (ý định ban đầu của chủ nghĩa ký hiệu), nhưng thực tế, trong hàng ngàn tầng mạng tham số ẩn khổng lồ, nó đã học và đóng gói những "quy tắc ngầm" sâu sắc hơn nhiều so với logic con người. Phương thức suy luận tầm xa **chuỗi tư duy (Chain of Thought)** trong các mô hình tiền huấn luyện lớn ngày nay, chẳng phải là sự tái sinh trong mạng nơ-ron của tư tưởng cổ điển mà trường phái ký hiệu từng theo đuổi về kiểm chứng logic và các bước chặt chẽ hay sao?

**Đứng trên đỉnh cao của kỷ nguyên mô hình lớn nhìn xuống, trí tuệ nhân tạo tổng quát (AGI) trong tương lai đang tiến về phía trước theo những đại lộ khám phá vô cùng rộng lớn và sâu sắc sau:**

1. **Tiến tới trung tâm thần kinh thống nhất nguyên sinh (đa phương thức nguyên sinh):** Mô hình tương lai không còn là Frankenstein ghép nối từ "mô hình văn bản + mô hình giọng nói". Với các kiến trúc như GPT-4o, cùng một siêu mạng duy nhất đồng thời nuốt, cảm nhận và hiểu văn bản, hình ảnh, luồng video và giọng nói ba chiều cảm xúc cao với độ trễ cực thấp.
2. **Trí tuệ hiện thân (Embodied AI):** Khi "bộ não" có chỉ số thông minh cực cao chỉ bị giam cầm trong phòng máy nền silicon, nó không thể xác minh chân lý từ thế giới vật lý. Thông qua kết hợp với Boston Dynamics, robot hình người, siêu AI có triển vọng mọc ra đôi tay và trong quá trình va vấp rèn luyện mà học được các định luật sắt đá khách quan của vật lý giống hệt chúng ta.
3. **Hệ thống tác tử thông minh (Agentic AI):** Hiện tại hầu hết LLM vẫn dừng lại ở giai đoạn "máy tính văn bản tính toán bị động một hỏi một đáp". Còn thời đại AI Agent, mô hình lớn được trao hoàn toàn **quyền hành động độc lập**. Chỉ cần bạn đưa ra một chỉ thị ngôn ngữ tự nhiên vĩ mô (ví dụ "hãy nghiên cứu và lập kế hoạch cho chuyến đi ngắm cực quang ở Na Uy tuần tới, bao gồm tất cả vé máy bay, khách sạn và tạo lịch trình"), AI Agent sẽ dựa vào trí nhớ tầm xa, tự động phân rã và thực thi hàng chục tác vụ con, mở trình duyệt ảo gọi API tra cứu thực của hãng hàng không, hoàn thành kiểm tra phức tạp thậm chí so sánh xác nhận. Chúng không còn là bức tường dội âm thụ động chờ gõ phím, mà là cụm lao động số không biết mệt mỏi.

Trong hành trình kỹ thuật dài xoắn ốc đi lên này, lịch sử luôn tương tự một cách đáng kinh ngạc nhưng tuyệt đối không lặp lại. Chúng ta đang chứng kiến mặt cắt lịch sử phấn khích nhất: từ "nhồi nhét quy tắc cứng nhắc vào thuật toán" đến "để máy móc tự động định nghĩa quy luật thế giới".

<AIErasComparisonDemo />

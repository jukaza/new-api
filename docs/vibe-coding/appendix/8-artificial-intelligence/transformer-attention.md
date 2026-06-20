---
title: 'Transformer và Cơ chế Attention: Động cơ cốt lõi của Mô hình Ngôn ngữ Lớn'
description: 'Hiểu sâu về kiến trúc Transformer và cơ chế attention, khám phá nền tảng kỹ thuật đằng sau GPT, BERT và các mô hình ngôn ngữ lớn khác.'
---

# Transformer và Cơ chế Attention: Động cơ cốt lõi của Mô hình Ngôn ngữ Lớn

Năm 2017, Google công bố kiến trúc Transformer trong bài báo 《Attention Is All You Need》, đã thay đổi hoàn toàn cuộc chơi của xử lý ngôn ngữ tự nhiên. Nó loại bỏ mạng nơ-ron hồi quy (RNN) truyền thống, chỉ dựa vào cơ chế attention đã đạt được hiệu suất mạnh mẽ hơn và hiệu quả huấn luyện cao hơn. Ngày nay, hầu hết các mô hình ngôn ngữ lớn — GPT, BERT, T5, LLaMA — đều được xây dựng trên nền tảng Transformer.

<TransformerQuickStartDemo />

---

## I. Hạn chế của RNN và Đột phá của Transformer

Trước khi Transformer xuất hiện, phương pháp chủ đạo để xử lý dữ liệu chuỗi (như văn bản, giọng nói) là mạng nơ-ron hồi quy (RNN) và các biến thể LSTM, GRU. Các mô hình này thông qua cấu trúc hồi quy, xử lý tuần tự từng phần tử trong chuỗi, và duy trì một trạng thái ẩn để ghi nhớ thông tin lịch sử.

### 1.1 Ba khiếm khuyết chết người của RNN

**Phụ thuộc tuần tự, không thể song song hóa**: RNN phải đợi bước thời gian trước hoàn thành tính toán, mới có thể xử lý từ tiếp theo. Điều này khiến tốc độ huấn luyện cực kỳ chậm, không thể tận dụng đầy đủ khả năng tính toán song song của GPU hiện đại.

**Suy giảm phụ thuộc khoảng cách xa**: Ngay cả LSTM cải tiến, khi xử lý văn bản dài, thông tin ban đầu cũng dần bị "lãng quên". Ví dụ trong một bài viết 500 từ, mô hình rất khó nhớ thông tin quan trọng được đề cập ở đầu bài.

**Biến mất/Bùng nổ gradient**: Trong quá trình lan truyền ngược, gradient cần được truyền qua từng bước thời gian, dễ xuất hiện hiện tượng biến mất hoặc bùng nổ gradient, dẫn đến huấn luyện không ổn định.

### 1.2 Đột phá mang tính cách mạng của Transformer

Transformer thông qua **cơ chế tự chú ý (Self-Attention)**, cho phép mô hình "nhìn toàn bộ" toàn bộ chuỗi, tính toán trực tiếp mối quan hệ giữa hai vị trí bất kỳ, không cần truyền thông tin từng bước.

<RnnVsTransformerDemo />

::: tip Ưu điểm cốt lõi của Transformer
- **Tính toán song song**: Attention của tất cả các vị trí có thể được tính đồng thời, tốc độ huấn luyện tăng hàng chục lần
- **Tầm nhìn toàn cục**: Trực tiếp nắm bắt phụ thuộc khoảng cách xa, không bị giới hạn bởi độ dài chuỗi
- **Khả năng mở rộng**: Kiến trúc đơn giản thống nhất, dễ dàng xếp chồng các mạng sâu hơn
:::

---

## II. Kiến trúc đầy đủ của Transformer: Từ tổng thể đến chi tiết

Kiến trúc đầy đủ của Transformer bao gồm hai phần: **Bộ mã hóa (Encoder)** và **Bộ giải mã (Decoder)**, lần lượt chịu trách nhiệm hiểu đầu vào và tạo đầu ra.

<TransformerArchitectureDemo />

### 2.1 Bộ mã hóa (Encoder)

Lấy câu "số dư trong tài khoản ngân hàng không đủ" làm ví dụ. Khi mô hình xử lý từ "số dư", nó sẽ tự động tính toán mức độ liên quan với các từ khác:

- "số dư" liên quan cao với "tài khoản" (0.35)
- "số dư" liên quan trung bình với "ngân hàng" (0.20)
- "số dư" liên quan thấp với các từ chức năng như "trong", "của" (0.05-0.10)

Mối tương quan này không phải do con người quy định, mà được mô hình tự động học từ lượng lớn dữ liệu.

<SelfAttentionDemo />

### 2.2 Quá trình tính toán của Attention

Cơ chế tự chú ý được thực hiện qua ba bước chính:

1. **Tạo vector Q, K, V**: Mỗi từ thông qua ba phép biến đổi tuyến tính khác nhau, tạo ra ba vector Query (Truy vấn), Key (Khóa), Value (Giá trị)
2. **Tính trọng số attention**: Dùng Query tính tích vô hướng với tất cả Key, thu được điểm tương đồng
3. **Tổng có trọng số**: Dùng trọng số attention để tính tổng có trọng số của vector Value, thu được đầu ra cuối cùng

---

## III. Query, Key, Value: Ba chàng ngự lâm của Attention

Cơ chế attention của Transformer mượn ý tưởng từ truy xuất thông tin, ánh xạ mỗi từ vào ba không gian vector khác nhau.

### 3.1 Vai trò của ba vector

**Query (Truy vấn)**: Đại diện cho "tôi muốn tìm gì". Ý định truy vấn của từ hiện tại, dùng để khớp với Key của các từ khác.

**Key (Khóa)**: Đại diện cho "tôi là gì". Định danh đặc trưng của mỗi từ, được dùng để Query truy xuất.

**Value (Giá trị)**: Đại diện cho "nội dung của tôi là gì". Thông tin thực tế cần truyền đạt, được tính tổng có trọng số dựa trên trọng số attention.

Điểm tinh tế của thiết kế này nằm ở chỗ: **tính toán độ tương đồng (Q·K) và truyền thông tin (V) được tách rời**. Mô hình có thể học được rằng "những từ nào nên được chú ý" và "sau khi chú ý nên trích xuất thông tin gì" là hai vấn đề độc lập.

<QKVMechanismDemo />

### 3.2 Công thức tính Attention

Công thức tính attention đầy đủ là:

```
Attention(Q, K, V) = softmax(QK^T / √d_k) V
```

Trong đó:
- `QK^T`: Tính tích vô hướng của Query và Key, thu được ma trận tương đồng
- `√d_k`: Hệ số co giãn, ngăn giá trị tích vô hướng quá lớn dẫn đến biến mất gradient của softmax
- `softmax`: Chuyển đổi độ tương đồng thành phân phối xác suất (trọng số attention)
- Cuối cùng nhân với `V`: Dùng trọng số attention để tính tổng có trọng số của Value

---

## IV. Multi-Head Attention: Hiểu ngữ nghĩa từ nhiều góc độ

Một đầu attention đơn lẻ chỉ có thể nắm bắt một loại quan hệ phụ thuộc. Để mô hình hiểu câu từ nhiều góc độ, Transformer giới thiệu **Multi-Head Attention (Attention đa đầu)**.

### 4.1 Cơ chế hoạt động của Multi-Head

Multi-Head Attention chiếu đầu vào vào nhiều không gian con khác nhau, mỗi "đầu" tính toán attention một cách độc lập, cuối cùng ghép nối đầu ra của tất cả các đầu.

Transformer điển hình sử dụng 8 hoặc 16 đầu attention, mỗi đầu có thể tập trung vào các hiện tượng ngôn ngữ khác nhau:

- **Đầu ngữ pháp**: Nhận diện quan hệ chủ-vị-tân, định-trạng-bổ
- **Đầu ngữ nghĩa**: Nắm bắt tương quan nghĩa của từ (như "ngân hàng" với "tài khoản")
- **Đầu vị trí**: Chú ý đến phụ thuộc cục bộ của các từ lân cận
- **Đầu tham chiếu**: Phân giải đại từ chỉ định (như "anh ấy" chỉ đến "Tiểu Minh")
- **Đầu cảm xúc**: Nhận diện sắc thái khen chê và xu hướng cảm xúc
- **Đầu thực thể**: Nhận diện thực thể có tên như tên người, địa danh

<MultiHeadAttentionDemo />

### 4.2 Ưu điểm của Multi-Head

**Khả năng biểu đạt mạnh hơn**: Các đầu khác nhau có thể nắm bắt các loại quan hệ phụ thuộc khác nhau, tránh giới hạn của góc nhìn đơn lẻ.

**Tính toán song song**: Nhiều đầu có thể tính toán đồng thời, không tăng thời gian tính toán.

**Tính bền vững tốt hơn**: Ngay cả khi một số đầu học thất bại, các đầu khác vẫn cung cấp thông tin hiệu quả.

::: tip Biểu diễn toán học của Multi-Head Attention
```
MultiHead(Q, K, V) = Concat(head_1, ..., head_h) W^O
trong đó head_i = Attention(QW_i^Q, KW_i^K, VW_i^V)
```
Mỗi đầu có ma trận trọng số độc lập W^Q、W^K、W^V, cuối cùng thông qua W^O hợp nhất đầu ra của tất cả các đầu.
:::

---

## V. Kiến trúc đầy đủ của Transformer: Encoder và Decoder

Kiến trúc đầy đủ của Transformer bao gồm hai phần: **Bộ mã hóa (Encoder)** và **Bộ giải mã (Decoder)**, lần lượt chịu trách nhiệm hiểu đầu vào và tạo đầu ra.

### 5.1 Bộ mã hóa (Encoder)

Bộ mã hóa được xếp chồng từ nhiều tầng (thường 6-12 tầng) có cấu trúc giống hệt nhau, mỗi tầng chứa hai lớp con:

1. **Lớp Multi-Head Self-Attention**: Nắm bắt quan hệ phụ thuộc bên trong chuỗi đầu vào
2. **Mạng Feed Forward (Truyền thẳng)**: Thực hiện biến đổi phi tuyến độc lập cho từng vị trí

Sau mỗi lớp con đều có **kết nối dư (Residual Connection)** và **chuẩn hóa lớp (Layer Normalization)**, đảm bảo tính ổn định khi huấn luyện mạng sâu.

### 5.2 Bộ giải mã (Decoder)

Bộ giải mã cũng được xếp chồng từ nhiều tầng, nhưng mỗi tầng có ba lớp con:

1. **Masked Multi-Head Self-Attention**: Chỉ có thể nhìn thấy các từ trước vị trí hiện tại, ngăn chặn "gian lận"
2. **Cross-Attention (Attention chéo)**: Kết nối encoder và decoder, cho phép decoder chú ý đến chuỗi đầu vào
3. **Mạng Feed Forward**: Giống với encoder

<TransformerArchitectureDemo />

### 5.3 Biến thể hiện đại: Chỉ Encoder vs Chỉ Decoder

Mặc dù Transformer gốc bao gồm cả encoder và decoder, các mô hình lớn hiện đại thường chỉ sử dụng một trong hai:

| Loại kiến trúc | Mô hình tiêu biểu | Nhiệm vụ phù hợp |
| --- | --- | --- |
| **Chỉ Encoder** | BERT、RoBERTa | Phân loại văn bản, nhận diện thực thể, trả lời câu hỏi |
| **Chỉ Decoder** | GPT、LLaMA、Claude | Tạo văn bản, đối thoại, hoàn thiện mã |
| **Encoder-Decoder** | T5、BART | Dịch thuật, tóm tắt, viết lại văn bản |

::: tip Tại sao GPT chỉ dùng Decoder?
Dòng mô hình GPT áp dụng phương thức **sinh tự hồi quy**, dự đoán từng từ tiếp theo. Kiến trúc chỉ decoder tự nhiên phù hợp với loại nhiệm vụ sinh này, hơn nữa cấu trúc đơn giản hơn, dễ mở rộng lên quy mô hàng trăm tỷ tham số.
:::

---

## VI. Mã hóa vị trí: Cho mô hình biết thứ tự của từ

Cơ chế self-attention của Transformer bản thân nó là **bất biến vị trí** — nó coi câu như một tập hợp từ, không quan tâm đến thứ tự của từ. Nhưng trật tự từ rất quan trọng đối với ngữ nghĩa: "Tôi yêu bạn" và "Bạn yêu tôi" có ý nghĩa hoàn toàn khác nhau!

### 6.1 Sự cần thiết của mã hóa vị trí

Để mô hình cảm nhận được thông tin vị trí, Transformer thêm **mã hóa vị trí (Positional Encoding)** vào embedding đầu vào. Mã hóa vị trí là một vector có cùng số chiều với embedding từ, được cộng trực tiếp vào embedding từ.

<PositionalEncodingDemo />

### 6.2 Mã hóa vị trí Sin-Cos

Transformer gốc sử dụng hàm sin-cos cố định để tạo mã hóa vị trí:

```
PE(pos, 2i) = sin(pos / 10000^(2i/d))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d))
```

Ưu điểm của thiết kế này:
- **Tính duy nhất**: Mỗi vị trí có mã hóa duy nhất
- **Vị trí tương đối**: Mô hình có thể học được mối quan hệ khoảng cách tương đối
- **Khả năng ngoại suy**: Có thể xử lý chuỗi dài hơn so với lúc huấn luyện

### 6.3 Các phương án mã hóa vị trí hiện đại

Cùng với sự phát triển của nghiên cứu, nhiều phương án mã hóa vị trí hơn đã xuất hiện:

**Mã hóa vị trí có thể học**: BERT、GPT coi mã hóa vị trí là tham số có thể huấn luyện, thay vì hàm cố định.

**Mã hóa vị trí tương đối**: T5、DeBERTa không mã hóa vị trí tuyệt đối, mà mã hóa khoảng cách tương đối giữa các từ.

**Mã hóa vị trí xoay (RoPE)**: Phương án được LLaMA、GPT-NeoX sử dụng, thông qua việc xoay vector Q và K để tiêm thông tin vị trí, hiệu suất ngoại suy tốt hơn.

**ALiBi**: Thông qua việc thêm thành phần thiên lệch vào điểm attention để thực hiện nhận thức vị trí, không cần thêm tham số.

---

## VII. Ảnh hưởng và Tương lai của Transformer

Sự xuất hiện của Transformer, không chỉ là sự ra đời của một kiến trúc mới, mà còn là sự thay đổi toàn bộ mô hình nghiên cứu AI.

### 7.1 Mô hình tiền huấn luyện thống nhất

Transformer đã biến "tiền huấn luyện + tinh chỉnh" thành quy trình tiêu chuẩn của NLP. Thông qua tiền huấn luyện trên lượng lớn văn bản không gán nhãn, mô hình học được biểu diễn ngôn ngữ phổ quát, sau đó chỉ cần một lượng nhỏ dữ liệu gán nhãn là có thể thích ứng với các nhiệm vụ hạ nguồn khác nhau.

### 7.2 Kiến trúc phổ quát xuyên phương thức

Thành công của Transformer không giới hạn ở văn bản. Nó đã được áp dụng thành công vào:

- **Thị giác máy tính**: Vision Transformer (ViT) vượt qua CNN trong phân loại ảnh
- **Nhận dạng giọng nói**: Whisper sử dụng Transformer để chuyển giọng nói đa ngôn ngữ thành văn bản
- **Dự đoán cấu trúc protein**: AlphaFold 2 dùng Transformer dự đoán cấu trúc 3D của protein
- **Học tăng cường**: Decision Transformer chuyển vấn đề RL thành mô hình hóa chuỗi

### 7.3 Nền tảng của kỷ nguyên mô hình lớn

Từ 175 tỷ tham số của GPT-3, đến nghìn tỷ tham số của GPT-4, Transformer thể hiện khả năng mở rộng đáng kinh ngạc. Đặc tính tính toán song song của nó cho phép chúng ta huấn luyện những mô hình khổng lồ chưa từng có, và quan sát được **năng lực trỗi dậy (Emergent Abilities)** — khi mô hình đủ lớn, tự động "ngộ" ra các năng lực như suy luận, lập trình, đa ngôn ngữ.

### 7.4 Thách thức và hướng đi trong tương lai

Mặc dù Transformer đã đạt được thành công to lớn, vẫn phải đối mặt với thách thức:

**Độ phức tạp tính toán**: Độ phức tạp của self-attention là O(n²), khi xử lý văn bản dài lượng tính toán rất lớn.

**Mô hình hóa văn bản dài**: Mặc dù về lý thuyết có thể xử lý độ dài bất kỳ, thực tế bị giới hạn bởi bộ nhớ GPU và tài nguyên tính toán.

**Khả năng giải thích**: Mặc dù trọng số attention cung cấp một mức độ giải thích nhất định, quá trình ra quyết định của mạng sâu vẫn là hộp đen.

Các hướng nghiên cứu hiện tại bao gồm:
- **Transformer hiệu quả**: Linformer、Performer、Flash Attention giảm độ phức tạp
- **Mô hình hóa ngữ cảnh dài**: Sparse Attention、Sliding Window、cơ chế Memory
- **Hợp nhất đa phương thức**: Kiến trúc đa phương thức nguyên sinh xử lý thống nhất văn bản, hình ảnh, âm thanh

---

## VIII. Tổng kết

Sự ra đời của Transformer và cơ chế attention, đánh dấu sự chuyển đổi triệt để của học sâu từ "thiết kế đặc trưng thủ công" sang "học đầu cuối". Nó không chỉ giải quyết nút thắt kỹ thuật của RNN, quan trọng hơn là cung cấp một kiến trúc đơn giản, phổ quát, có thể mở rộng, trở thành nền tảng của kỷ nguyên mô hình lớn.

Hiểu Transformer, chính là hiểu cốt lõi của AI hiện đại. Từ mã hóa hai chiều của BERT, đến sinh tự hồi quy của GPT, rồi đến biểu diễn thống nhất của mô hình đa phương thức lớn, tất cả những đột phá này đều đứng trên vai của Transformer.

Trong tương lai, cùng với sự nâng cao của sức mạnh tính toán và tối ưu hóa thuật toán, Transformer sẽ tiếp tục tiến hóa, thúc đẩy AI phát triển theo hướng mạnh mẽ hơn và phổ quát hơn.

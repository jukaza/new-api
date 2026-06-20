# Mạng Nơ-ron và Học Sâu

::: tip Lời mở đầu
**Mạng nơ-ron là động cơ của cuộc cách mạng AI.** Từ hiểu ngôn ngữ của ChatGPT đến nhận dạng hình ảnh trong xe tự lái, đằng sau tất cả đều có mạng nơ-ron hoạt động. Nó không phải là phép thuật, mà là một khung toán học tinh xảo — "học" ánh xạ từ đầu vào sang đầu ra thông qua lượng lớn dữ liệu. Hiểu nguyên lý cơ bản của nó sẽ giúp bạn sử dụng và gỡ lỗi các công cụ AI tốt hơn.
:::

**Bài viết này sẽ giúp bạn học được gì?**

Sau khi học xong chương này, bạn sẽ nắm được:

- **Khái niệm cốt lõi**：Hiểu nguyên lý cơ bản của nơ-ron, tầng, lan truyền xuôi, lan truyền ngược
- **Các loại mạng**：Hiểu đặc điểm và tình huống áp dụng của các kiến trúc chính như CNN, RNN, Transformer
- **Quá trình huấn luyện**：Hiểu cách mô hình "học" từ dữ liệu
- **Kỹ thuật then chốt**：Nắm vững các khái niệm thực tế như overfitting, learning rate, regularization
- **Mạch phát triển**：Hiểu hành trình phát triển từ Perceptron đến các mô hình ngôn ngữ lớn

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Từ nơ-ron đến mạng | Perceptron, hàm kích hoạt, lan truyền xuôi |
| **Chương 2** | Mạng học như thế nào | Hàm mất mát, gradient descent, lan truyền ngược |
| **Chương 3** | Kiến trúc mạng chính | CNN, RNN, Transformer |
| **Chương 4** | Nghệ thuật huấn luyện | Overfitting, regularization, tinh chỉnh siêu tham số |
| **Chương 5** | Lịch sử phát triển và xu hướng | Từ Perceptron đến GPT |

---

## 1. Từ nơ-ron đến mạng

### Nơ-ron đơn lẻ

Đơn vị nhỏ nhất của mạng nơ-ron là **nơ-ron** (Neuron). Nó mô phỏng cách thức hoạt động của nơ-ron sinh học：nhận nhiều tín hiệu đầu vào, tính tổng có trọng số, và tạo ra đầu ra thông qua hàm kích hoạt.

```
Đầu vào x1 ──→ ×w1 ──┐
Đầu vào x2 ──→ ×w2 ──┼──→ Σ(tổng có trọng số) + b(bias) ──→ f(hàm kích hoạt) ──→ Đầu ra
Đầu vào x3 ──→ ×w3 ──┘
```

Biểu thức toán học：**y = f(w₁x₁ + w₂x₂ + w₃x₃ + b)**

<NeuronDemo />

### Hàm kích hoạt：Tại sao cần phi tuyến？

Nếu không có hàm kích hoạt, dù có bao nhiêu tầng nơ-ron chồng lên nhau, kết quả cuối cùng cũng chỉ tương đương với một phép biến đổi tuyến tính (phép nhân ma trận). Hàm kích hoạt đưa vào tính **phi tuyến**, cho phép mạng học được các mẫu phức tạp.

| Hàm kích hoạt | Công thức | Đặc điểm | Tình huống thường dùng |
|---------|------|------|---------|
| ReLU | max(0, x) | Đơn giản, hiệu quả, huấn luyện nhanh | Lựa chọn mặc định cho tầng ẩn |
| Sigmoid | 1/(1+e⁻ˣ) | Đầu ra 0~1 | Tầng đầu ra cho phân loại nhị phân |
| Tanh | (eˣ-e⁻ˣ)/(eˣ+e⁻ˣ) | Đầu ra -1~1 | Thường dùng trong RNN |
| Softmax | eˣᵢ/Σeˣⱼ | Đầu ra là phân phối xác suất | Tầng đầu ra cho phân loại đa lớp |

### Từ nơ-ron đến mạng

Tổ chức nhiều nơ-ron thành các **tầng**, nhiều tầng nối tiếp nhau, tạo nên mạng nơ-ron：

```
Tầng đầu vào      Tầng ẩn 1         Tầng ẩn 2        Tầng đầu ra
(đặc trưng)      (trích xuất        (trích xuất       (dự đoán kết quả)
                  đặc trưng cấp thấp) đặc trưng cấp cao)

 x1 ──→  [○ ○ ○ ○] ──→ [○ ○ ○] ──→  [○ ○]
 x2 ──→  [○ ○ ○ ○] ──→ [○ ○ ○] ──→  mèo/chó
 x3 ──→  [○ ○ ○ ○] ──→ [○ ○ ○]
```

| Khái niệm | Giải thích |
|------|------|
| Tầng đầu vào | Nhận dữ liệu thô (điểm ảnh, vector văn bản, v.v.) |
| Tầng ẩn | Tầng xử lý trung gian, càng nhiều tầng mạng càng "sâu" (chữ "sâu" trong học sâu) |
| Tầng đầu ra | Tạo dự đoán cuối cùng (xác suất phân loại, giá trị hồi quy, v.v.) |
| Lan truyền xuôi | Quá trình dữ liệu chảy từ tầng đầu vào qua các tầng đến tầng đầu ra |

::: tip Tại sao gọi là học "sâu"？
Machine learning truyền thống thường chỉ có 1-2 tầng. Khi số tầng ẩn tăng lên hàng chục thậm chí hàng trăm tầng, người ta gọi đó là học "sâu". Mạng càng sâu có thể học được các đặc trưng trừu tượng hơn：tầng đầu học cạnh viền, tầng thứ hai học kết cấu, tầng thứ ba học bộ phận, các tầng sâu hơn học được "đây là một con mèo".
:::

---

## 2. Mạng học như thế nào

"Việc học" của mạng nơ-ron bản chất là một **bài toán tối ưu**：tìm một tập trọng số (w) và bias (b), sao cho dự đoán của mạng gần với đáp án thật nhất có thể.

### Ba bước huấn luyện

```
1. Lan truyền xuôi：Đưa dữ liệu vào, nhận kết quả dự đoán
2. Tính mất mát：Dùng hàm mất mát đo khoảng cách giữa dự đoán và giá trị thật
3. Lan truyền ngược：Dựa trên mất mát, tính gradient cho từng trọng số, cập nhật trọng số
   ↓
Lặp lại các bước trên, cho đến khi mất mát đủ nhỏ
```

### Hàm mất mát：Đo lường "sai đến mức nào"

Hàm mất mát (Loss Function) định lượng khoảng cách giữa giá trị dự đoán và giá trị thật. Mục tiêu của huấn luyện là tối thiểu hóa mất mát.

| Hàm mất mát | Tóm tắt công thức | Tình huống áp dụng |
|---------|---------|---------|
| MSE (Mean Squared Error) | Trung bình bình phương sai khác giữa dự đoán và giá trị thật | Bài toán hồi quy |
| Cross-Entropy | -Σ y·log(ŷ) | Bài toán phân loại |
| Binary Cross-Entropy | Phiên bản nhị phân của cross-entropy | Bài toán phân loại nhị phân |

### Gradient Descent：Tìm điểm thấp nhất

Hãy tưởng tượng bạn đứng trên một ngọn núi, bị bịt mắt và phải đi đến điểm thấp nhất. Điều bạn có thể làm là **sờ độ dốc dưới chân, rồi bước một bước về hướng xuống dốc**. Đây chính là gradient descent.

```
Giá trị mất mát
  ↑
  │    ╱╲
  │   ╱  ╲      ← Vị trí hiện tại
  │  ╱    ╲    ↙ Đi xuống theo hướng gradient
  │ ╱      ╲╱   ← Cực tiểu cục bộ
  │╱            ╲╱  ← Cực tiểu toàn cục
  └──────────────→ Giá trị trọng số
```

| Khái niệm | Giải thích |
|------|------|
| Gradient | Đạo hàm riêng của hàm mất mát đối với từng trọng số, chỉ ra "điều chỉnh theo hướng nào để giảm mất mát" |
| Learning rate | Mỗi bước đi bao xa. Quá lớn sẽ nhảy qua điểm thấp nhất, quá nhỏ sẽ hội tụ quá chậm |
| Batch size | Mỗi lần dùng bao nhiêu mẫu để tính gradient. Toàn bộ quá chậm, một mẫu quá dao động, mini-batch là sự dung hòa |

### Lan truyền ngược：Chiến thắng của quy tắc dây chuyền

Lan truyền ngược (Backpropagation) là thuật toán hiệu quả để tính gradient. Nó tận dụng **quy tắc dây chuyền** (chain rule) của giải tích, bắt đầu từ tầng đầu ra, tính toán ngược từng tầng mức đóng góp của mỗi trọng số vào mất mát.

```
Lan truyền xuôi：Đầu vào → Tầng ẩn 1 → Tầng ẩn 2 → Đầu ra → Mất mát
Lan truyền ngược：Mất mát → Đầu ra → Tầng ẩn 2 → Tầng ẩn 1 → Cập nhật tất cả trọng số
```

::: tip Hiểu lan truyền ngược bằng trực giác
Hãy tưởng tượng mạng nơ-ron như một dây chuyền sản xuất. Sản phẩm (dự đoán) gặp vấn đề (mất mát lớn), bạn cần bắt đầu kiểm tra từ công đoạn cuối cùng trở về trước, xem mỗi công đoạn (mỗi trọng số tầng) đóng góp bao nhiêu vào vấn đề cuối cùng, rồi điều chỉnh theo mức đóng góp. Đóng góp nhiều thì điều chỉnh nhiều, đóng góp ít thì điều chỉnh ít.
:::

---

## 3. Kiến trúc mạng chính

Các loại dữ liệu khác nhau cần các kiến trúc mạng khác nhau. Chọn đúng kiến trúc, hiệu quả gấp đôi.

<NetworkLayersDemo />

### 3.1 CNN (Mạng Nơ-ron Tích Chập)

CNN là vua xử lý ảnh. Ý tưởng cốt lõi：dùng các kernel tích chập nhỏ trượt trên ảnh, trích xuất đặc trưng cục bộ.

```
Ảnh đầu vào → [Tầng tích chập→Kích hoạt→Pooling] × N → Tầng fully connected → Đầu ra
  28×28        Trích xuất cạnh/kết cấu/hình dạng      Kết quả phân loại
```

| Đặc điểm | Giải thích |
|------|------|
| Kết nối cục bộ | Mỗi nơ-ron chỉ nhìn một vùng nhỏ, không phải toàn bộ ảnh |
| Chia sẻ tham số | Cùng một kernel tích chập được tái sử dụng trên toàn bộ ảnh, giảm đáng kể tham số |
| Bất biến dịch chuyển | Mèo ở bên trái hay bên phải ảnh, đều có thể nhận dạng |
| Đặc trưng phân cấp | Tầng nông học cạnh viền, tầng sâu học ngữ nghĩa |

Các mô hình tiêu biểu：LeNet、AlexNet、VGG、ResNet、EfficientNet

### 3.2 RNN (Mạng Nơ-ron Hồi Quy)

RNN được thiết kế riêng cho **dữ liệu chuỗi**. Trạng thái ẩn của nó được truyền sang bước thời gian tiếp theo, cho phép mạng có khả năng "ghi nhớ".

```
Bước thời gian t1   Bước thời gian t2   Bước thời gian t3
  "Tôi" ──→         "thích" ──→          "mèo"
    ↓                  ↓                    ↓
  [h1]  ──→         [h2]   ──→          [h3] ──→ Đầu ra
    ↑                  ↑                    ↑
Trạng thái ẩn được truyền giữa các bước thời gian (bộ nhớ)
```

| Biến thể | Vấn đề giải quyết | Cơ chế cốt lõi |
|------|-----------|---------|
| RNN gốc | Mô hình chuỗi cơ bản | Kết nối vòng lặp đơn giản |
| LSTM | Gradient biến mất với chuỗi dài | Cổng quên, cổng đầu vào, cổng đầu ra |
| GRU | LSTM có quá nhiều tham số | Đơn giản hóa thành cổng đặt lại và cổng cập nhật |
| RNN hai chiều | Chỉ nhìn thấy quá khứ | Xử lý đồng thời từ đầu đến cuối và từ cuối về đầu |

::: tip Cơ chế cổng của LSTM
Điểm tinh tế của LSTM nằm ở ba "cổng"：**cổng quên** quyết định loại bỏ những ký ức cũ nào, **cổng đầu vào** quyết định lưu thông tin mới nào, **cổng đầu ra** quyết định xuất ra nội dung nào. Giống như khi bạn đọc một cuốn sách, bạn sẽ chọn lọc ghi nhớ những tình tiết quan trọng và quên đi những chi tiết không liên quan.
:::

### 3.3 Transformer：Chú ý là tất cả

Năm 2017, Google công bố bài báo "Attention Is All You Need" đề xuất Transformer, thay đổi hoàn toàn lĩnh vực AI. Nó thay thế cấu trúc vòng lặp bằng **cơ chế tự chú ý** (self-attention), là nền tảng của các mô hình lớn như GPT, BERT, Claude.

```
Chuỗi đầu vào → Embedding + Positional Encoding → [Multi-Head Attention → Feed-Forward] × N → Đầu ra
                                                          ↑
                                        Mỗi từ đều có thể "nhìn thấy" tất cả các từ khác
```

| Ưu điểm | Giải thích |
|------|------|
| Tính toán song song | Không như RNN phải xử lý tuần tự, Transformer có thể xử lý song song toàn bộ chuỗi |
| Phụ thuộc khoảng cách xa | Thiết lập liên kết trực tiếp giữa hai vị trí bất kỳ, không bị giới hạn bởi khoảng cách |
| Khả năng mở rộng | Mô hình càng lớn, dữ liệu càng nhiều, hiệu quả càng tốt (Scaling Law) |

**Trực giác về self-attention**：Khi đọc câu "Con mèo nhỏ ngồi trên tấm đệm, vì **nó** rất mệt", từ "nó" cần tập trung vào "con mèo" để hiểu ý nghĩa. Self-attention cho phép mô hình học được mối liên kết này — tính một "điểm tương quan" cho mỗi cặp từ trong chuỗi.

<NetworkArchitectureDemo />

## 4. Nghệ thuật huấn luyện

Có kiến trúc tốt thôi chưa đủ, trong quá trình huấn luyện còn nhiều "cạm bẫy" cần tránh.

### 4.1 Overfitting vs Underfitting

| Vấn đề | Biểu hiện | Nguyên nhân | Giải pháp |
|------|------|------|---------|
| Overfitting | Tập huấn luyện tốt, tập kiểm tra kém | Mô hình quá phức tạp, "học thuộc đáp án" thay vì quy luật | Regularization, Dropout, data augmentation, early stopping |
| Underfitting | Cả tập huấn luyện và tập kiểm tra đều kém | Mô hình quá đơn giản, không học được quy luật | Tăng năng lực mô hình, huấn luyện lâu hơn, đặc trưng tốt hơn |

```
Sai số
  ↑
  │ ╲  Sai số huấn luyện    Sai số kiểm tra  ╱
  │  ╲                                      ╱
  │   ╲─────────────────╱
  │  Underfitting ← Điểm tối ưu → Overfitting
  └──────────────────────────→ Độ phức tạp mô hình
```

### 4.2 Siêu tham số then chốt

Siêu tham số là các tham số cần được thiết lập thủ công trước khi huấn luyện (không phải do mô hình tự học)：

| Siêu tham số | Vai trò | Phạm vi phổ biến | Gợi ý tinh chỉnh |
|--------|------|---------|---------|
| Learning rate | Biên độ cập nhật mỗi bước | 1e-5 ~ 1e-1 | Siêu tham số quan trọng nhất, thường bắt đầu từ 1e-3 |
| Batch size | Số mẫu dùng mỗi lần huấn luyện | 16 ~ 512 | Càng lớn huấn luyện càng ổn định, nhưng cần nhiều VRAM hơn |
| Số epoch | Số lần duyệt toàn bộ tập dữ liệu | 10 ~ 100+ | Kết hợp early stopping, dừng khi tập validation không còn cải thiện |
| Optimizer | Chiến lược cập nhật gradient | Adam、SGD | Adam là lựa chọn mặc định, SGD+momentum phù hợp tinh chỉnh |

### 4.3 Kỹ thuật Regularization

Các biện pháp phổ biến để ngăn overfitting：

| Kỹ thuật | Nguyên lý | Cách sử dụng |
|------|------|---------|
| Dropout | Ngẫu nhiên tắt một phần nơ-ron trong khi huấn luyện | Thường p=0.1~0.5 |
| Weight decay | Thêm hình phạt độ lớn của trọng số vào hàm mất mát | L2 regularization, λ=1e-4 |
| Data augmentation | Biến đổi ngẫu nhiên dữ liệu huấn luyện (lật, cắt, xoay) | Cần thiết cho tác vụ ảnh |
| Early stopping | Dừng huấn luyện khi mất mát tập validation không còn giảm | patience=5~10 |
| Batch Normalization | Chuẩn hóa phân phối đầu vào của mỗi tầng | Tăng tốc hội tụ, có hiệu ứng regularization nhẹ |

::: tip Quy tắc kinh nghiệm khi huấn luyện
1. Trước tiên dùng tập dữ liệu nhỏ chạy thông toàn bộ quy trình, xác nhận code không có bug
2. Bắt đầu từ mô hình pre-trained có sẵn để fine-tune, thay vì huấn luyện từ đầu
3. Learning rate là siêu tham số đáng dành thời gian tinh chỉnh nhất
4. Nếu mất mát huấn luyện không giảm, kiểm tra dữ liệu và code trước, rồi mới nghi ngờ mô hình
:::

---

## 5. Lịch sử phát triển và xu hướng

Sự phát triển của mạng nơ-ron đã trải qua vài lần "mùa đông" và "hồi sinh", mỗi bước đột phá đều đến từ những đổi mới công nghệ then chốt.

| Thời kỳ | Cột mốc | Đột phá then chốt |
|------|--------|---------|
| 1958 | Perceptron | Mô hình mạng nơ-ron đầu tiên, chỉ xử lý được bài toán tuyến tính |
| 1986 | Thuật toán lan truyền ngược | Giúp việc huấn luyện mạng nhiều tầng trở nên khả thi |
| 1998 | LeNet (CNN) | Mạng tích chập thành công lớn trong nhận dạng chữ số viết tay |
| 2012 | AlexNet | CNN sâu vượt trội các phương pháp truyền thống trên ImageNet, học sâu bùng nổ |
| 2014 | GAN (Mạng Đối Kháng Sinh) | Hai mạng huấn luyện đối kháng, có thể tạo ảnh chân thực |
| 2017 | Transformer | "Attention Is All You Need", cơ chế chú ý thay thế RNN |
| 2018 | BERT | Mô hình pre-training + fine-tuning, NLP đột phá toàn diện |
| 2020 | GPT-3 | 175 tỷ tham số, thể hiện khả năng trồi sinh (emergence) của mô hình lớn |
| 2022 | ChatGPT | Công nghệ căn chỉnh RLHF, AI bước vào tầm nhìn đại chúng |
| 2023+ | Mô hình lớn đa phương thức | GPT-4V, Claude, v.v., đồng thời hiểu văn bản và hình ảnh |

### Xu hướng hiện tại

| Hướng | Giải thích |
|------|------|
| Mô hình ngôn ngữ lớn (LLM) | Số tham số từ trăm triệu đến nghìn tỷ, trồi sinh khả năng suy luận, lập trình |
| Đa phương thức | Cùng một mô hình xử lý văn bản, hình ảnh, âm thanh, video |
| Fine-tune hiệu quả | LoRA, QLoRA và các kỹ thuật cho phép lập trình viên thông thường cũng fine-tune được mô hình lớn |
| AI Agent | Cho phép mô hình lớn sử dụng công cụ, lập kế hoạch, tự chủ hoàn thành mục tiêu phức tạp |
| Distillation mô hình nhỏ | Dùng tri thức của mô hình lớn huấn luyện mô hình nhỏ, triển khai trên thiết bị biên |

::: tip Gợi ý cho lập trình viên
Bạn không cần huấn luyện mạng nơ-ron từ đầu. Phát triển AI hiện đại chủ yếu là **gọi API** (như OpenAI, Claude API) hoặc **fine-tune mô hình pre-trained** (như dùng Hugging Face). Nhưng hiểu nguyên lý bên dưới sẽ giúp bạn chọn mô hình tốt hơn, thiết kế prompt tốt hơn, và chẩn đoán vấn đề tốt hơn.
:::

---

## Tổng kết

| Khái niệm cốt lõi | Tóm tắt một câu |
|---------|-----------|
| Nơ-ron | Tổng có trọng số + hàm kích hoạt, đơn vị tính toán nhỏ nhất của mạng |
| Lan truyền xuôi | Dữ liệu chảy từ tầng đầu vào qua các tầng đến tầng đầu ra, tạo dự đoán |
| Lan truyền ngược | Từ mất mát, tính gradient từng tầng, cập nhật trọng số |
| CNN | Kernel tích chập trích xuất đặc trưng cục bộ, lựa chọn hàng đầu cho xử lý ảnh |
| RNN/LSTM | Kết nối vòng lặp duy trì bộ nhớ, xử lý dữ liệu chuỗi |
| Transformer | Self-attention xử lý song song, kiến trúc nền tảng của mô hình lớn |
| Overfitting | Mô hình "học thuộc đáp án", dùng regularization, Dropout để ngăn chặn |
| Transfer learning | Đứng trên vai người khổng lồ, dùng mô hình pre-trained fine-tune giải quyết bài toán mới |

---

## Đọc thêm

- [3Blue1Brown - Chuỗi video về Mạng Nơ-ron](https://www.3blue1brown.com/topics/neural-networks) — Giải thích trực quan nhất
- [Stanford CS231n](http://cs231n.stanford.edu/) — Khóa học kinh điển về Mạng Nơ-ron Tích Chập
- [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/) — Minh họa kiến trúc Transformer
- [Neural Networks and Deep Learning](http://neuralnetworksanddeeplearning.com/) — Sách giáo khoa trực tuyến miễn phí
- [Hugging Face Course](https://huggingface.co/learn) — Thực hành Transformer và mô hình lớn

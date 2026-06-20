# Tinh chỉnh và Triển khai Mô hình

::: tip Lời nói đầu
**Mô hình lớn rất mạnh mẽ, nhưng nó không hiểu nghiệp vụ của bạn.** GPT-4 có thể làm thơ, lập trình, nhưng nó không biết thuật ngữ sản phẩm của công ty bạn, không hiểu các quy chuẩn chuyên môn trong ngành của bạn. Tinh chỉnh (Fine-tuning) chính là quá trình giúp mô hình lớn đa năng "học" kiến thức chuyên môn của bạn — giống như đào tạo trước khi vào việc cho một học giả uyên bác, biến nó thành chuyên gia trong lĩnh vực của bạn.
:::

**Bài viết này sẽ giúp bạn học được gì?**

Sau khi học xong chương này, bạn sẽ có được:

- **Nhận thức về quy trình**: Nắm vững pipeline tinh chỉnh hoàn chỉnh từ chuẩn bị dữ liệu đến triển khai mô hình
- **Kỹ thuật dữ liệu**: Hiểu yêu cầu định dạng và tiêu chuẩn chất lượng của dữ liệu tinh chỉnh
- **Tinh chỉnh hiệu quả**: Hiểu nguyên lý và ưu điểm của các kỹ thuật tinh chỉnh hiệu quả tham số như LoRA
- **Nén mô hình**: Nắm vững cách kỹ thuật lượng tử hóa giúp mô hình lớn chạy được trên phần cứng tiêu dùng
- **Thực hành triển khai**: Hiểu kiến trúc chính và chiến lược lựa chọn cho dịch vụ mô hình

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Pipeline tinh chỉnh | Dữ liệu → Huấn luyện → Đánh giá → Triển khai |
| **Chương 2** | Dữ liệu huấn luyện | Định dạng dữ liệu, kiểm soát chất lượng |
| **Chương 3** | Tinh chỉnh LoRA | Thích ứng hạng thấp, hiệu quả tham số |
| **Chương 4** | Lượng tử hóa mô hình | FP16, INT8, INT4 |
| **Chương 5** | Triển khai mô hình | Dịch vụ suy luận, API Gateway |

---

## 0. Toàn cảnh: Tại sao cần tinh chỉnh?

Quá trình huấn luyện mô hình ngôn ngữ lớn được chia thành hai giai đoạn: **tiền huấn luyện** và **tinh chỉnh**. Tiền huấn luyện là học năng lực ngôn ngữ trên dữ liệu đa năng khổng lồ, tinh chỉnh là học năng lực chuyên môn trên dữ liệu tác vụ cụ thể.

Một phép so sánh: tiền huấn luyện giống như học đại học — học kiến thức tổng quát, cái gì cũng biết một chút; tinh chỉnh giống như đào tạo khi bắt đầu công việc — học kỹ năng chuyên môn cho vị trí cụ thể.

::: tip Khi nào cần tinh chỉnh?
- **Định dạng đầu ra cụ thể**: Cần mô hình luôn xuất ra theo định dạng JSON cố định
- **Kiến thức chuyên ngành**: Thuật ngữ và quy chuẩn chuyên môn trong các lĩnh vực như y tế, luật, tài chính
- **Chuyển đổi phong cách ngôn ngữ**: Giúp mô hình trả lời với giọng điệu, phong cách cụ thể (như kịch bản chăm sóc khách hàng)
- **Hỗ trợ ngôn ngữ ít phổ biến**: Nâng cao hiệu suất của mô hình trên ngôn ngữ cụ thể
- **Tối ưu chi phí**: Dùng mô hình nhỏ đã tinh chỉnh thay thế cho việc gọi mô hình lớn, giảm chi phí suy luận
:::

---

## 1. Pipeline tinh chỉnh: Hành trình hoàn chỉnh từ dữ liệu đến triển khai

Tinh chỉnh không phải là "ném dữ liệu cho mô hình là xong". Đó là một quy trình kỹ thuật nghiêm ngặt, mỗi khâu đều ảnh hưởng đến kết quả cuối cùng.

<FinetuningPipelineDemo />

::: tip Năm giai đoạn của tinh chỉnh
1. **Chuẩn bị dữ liệu**: Thu thập, làm sạch, gán nhãn dữ liệu huấn luyện, đây là khâu tốn thời gian nhất và cũng quan trọng nhất
2. **Lựa chọn mô hình**: Chọn mô hình nền (Base Model) phù hợp, như Llama 3, Qwen, Mistral
3. **Cấu hình huấn luyện**: Thiết lập các siêu tham số như learning rate, batch size, số epoch
4. **Thực thi huấn luyện**: Chạy huấn luyện trên GPU, giám sát đường cong loss và các chỉ số đánh giá
5. **Đánh giá và triển khai**: Đánh giá hiệu quả trên tập kiểm tra, sau khi thông qua thì triển khai thành dịch vụ API
:::

| Giai đoạn | Hành động chính | Cạm bẫy thường gặp |
|------|---------|---------|
| Chuẩn bị dữ liệu | Làm sạch, loại trùng lặp, định dạng | Chất lượng dữ liệu kém khiến mô hình "học sai" |
| Lựa chọn mô hình | Đánh giá năng lực mô hình nền | Mô hình quá lớn không huấn luyện nổi, quá nhỏ thì hiệu quả kém |
| Cấu hình huấn luyện | Điều chỉnh siêu tham số | Learning rate quá cao dẫn đến quên thảm khốc |
| Thực thi huấn luyện | Giám sát loss và chỉ số | Overfitting, huấn luyện không hội tụ |
| Đánh giá và triển khai | A/B test, triển khai dần | Rò rỉ tập kiểm tra khiến đánh giá cao hơn thực tế |

---

## 2. Dữ liệu huấn luyện: Trần của hiệu quả tinh chỉnh

Trong tinh chỉnh có một câu nói cũ: **"Garbage in, garbage out"**. Chất lượng dữ liệu huấn luyện trực tiếp quyết định giới hạn trên của hiệu quả tinh chỉnh. 100 mẫu dữ liệu chất lượng cao thường cho hiệu quả tốt hơn 10.000 mẫu dữ liệu chất lượng thấp.

<TrainingDataDemo />

::: tip Ba định dạng phổ biến của dữ liệu tinh chỉnh
1. **Định dạng hướng dẫn (Instruction)**: Định dạng phổ biến nhất, gồm ba trường instruction (hướng dẫn), input (đầu vào), output (đầu ra mong đợi). Phù hợp để huấn luyện mô hình tuân theo hướng dẫn.
2. **Định dạng hội thoại (Chat)**: Dạng hội thoại nhiều lượt, gồm danh sách tin nhắn với các vai system, user, assistant. Phù hợp để huấn luyện chatbot.
3. **Định dạng hoàn thành (Completion)**: Cặp prompt-completion đơn giản, phù hợp cho các tình huống như sinh văn bản, hoàn thành mã.
:::

| Chiều chất lượng dữ liệu | Mô tả | Phương pháp kiểm tra |
|------------|------|---------|
| Độ chính xác | Câu trả lời phải chính xác tuyệt đối | Kiểm duyệt thủ công, xác minh chuyên gia |
| Tính nhất quán | Phong cách trả lời cho câu hỏi tương tự phải nhất quán | Kiểm tra đối chiếu mẫu |
| Tính đa dạng | Bao phủ đủ nhiều tình huống và biến thể | Thống kê phân bố loại câu hỏi |
| Loại trùng lặp | Tránh mẫu trùng lặp gây overfitting | Loại trùng lặp văn bản, loại trùng lặp ngữ nghĩa |
| Lượng dữ liệu | Thường 500~5000 mẫu chất lượng cao là đủ | Bắt đầu từ ít, tăng dần |

---

## 3. LoRA: Dùng 1% tham số đạt 90% hiệu quả

Tinh chỉnh toàn phần (Full Fine-tuning) yêu cầu cập nhật tất cả tham số của mô hình — đối với mô hình 70B tham số, điều này đồng nghĩa với việc cần hàng trăm GB VRAM và sức mạnh GPU khổng lồ. Với hầu hết các đội ngũ, điều này không thực tế.

LoRA (Low-Rank Adaptation) cung cấp một giải pháp thanh lịch: **đóng băng tham số mô hình gốc, chỉ huấn luyện một nhóm nhỏ ma trận hạng thấp được thêm vào**. Lượng tham số của các ma trận này thường chỉ bằng 0,1%~1% mô hình gốc, nhưng có thể đạt hiệu quả gần với tinh chỉnh toàn phần.

<LoRADemo />

::: tip Tư tưởng cốt lõi của LoRA
Ma trận trọng số W của mô hình gốc là một ma trận khổng lồ (ví dụ 4096×4096). LoRA không sửa đổi trực tiếp W, mà thêm một "đường tắt" bên cạnh: W' = W + BA, trong đó B và A là hai ma trận nhỏ (ví dụ 4096×8 và 8×4096). Khi huấn luyện chỉ cập nhật B và A, W gốc được giữ nguyên.
- **Hạng (Rank)**: Giá trị r càng lớn, khả năng biểu đạt càng mạnh, nhưng lượng tham số cũng nhiều hơn. Thường r=8~64 là đủ dùng
- **Hợp nhất khi triển khai**: Sau khi huấn luyện xong, có thể hợp nhất BA vào W, khi suy luận không có chi phí phụ trội
:::

| Phương pháp tinh chỉnh | Tham số có thể huấn luyện | Nhu cầu VRAM | Tốc độ huấn luyện | Hiệu quả |
|---------|-----------|---------|---------|------|
| Tinh chỉnh toàn phần | 100% | Cực cao | Chậm | Tốt nhất |
| LoRA | 0,1%~1% | Thấp | Nhanh | Gần toàn phần |
| QLoRA | 0,1%~1% | Thấp hơn | Trung bình | Hơi thấp hơn LoRA |
| Prompt Tuning | < 0,01% | Cực thấp | Rất nhanh | Hạn chế |

---

## 4. Lượng tử hóa mô hình: Giúp mô hình lớn "giảm cân"

Một mô hình 70B tham số, nếu dùng FP32 (số thực dấu phẩy động 32 bit) để lưu trữ, cần 280GB VRAM — không có vài GPU đỉnh cao thì không thể chạy nổi. Kỹ thuật lượng tử hóa (Quantization) nén kích thước mô hình bằng cách giảm độ chính xác số học, giúp mô hình lớn có thể chạy trên phần cứng tiêu dùng.

<ModelQuantizationDemo />

::: tip Đánh đổi cốt lõi của lượng tử hóa
Lượng tử hóa về bản chất là sự đánh đổi **độ chính xác lấy không gian**. FP32 → FP16 gần như không tổn thất, INT8 có tổn thất nhẹ, INT4 sẽ có suy giảm chất lượng rõ rệt nhưng thường chấp nhận được. Điều quan trọng là tìm điểm cân bằng tối ưu cho tình huống của bạn.
- **FP16 (bán chính xác)**：Kích thước giảm một nửa, chất lượng gần như không tổn thất, là lựa chọn mặc định cho huấn luyện và suy luận
- **INT8 (số nguyên 8 bit)**：Kích thước giảm thêm một nửa, tổn thất chất lượng rất nhỏ, phù hợp cho hầu hết tình huống suy luận
- **INT4 (số nguyên 4 bit)**：Kích thước chỉ bằng 1/8 FP32, chất lượng có tổn thất nhất định, phù hợp cho tình huống tài nguyên hạn chế
:::

| Độ chính xác | Byte mỗi tham số | Kích thước mô hình 70B | Tổn thất chất lượng | Tình huống áp dụng |
|------|-----------|-------------|---------|---------|
| FP32 | 4 byte | ~280 GB | Không | Cơ sở huấn luyện |
| FP16 | 2 byte | ~140 GB | Hầu như không | Huấn luyện và suy luận tiêu chuẩn |
| INT8 | 1 byte | ~70 GB | Rất nhỏ | Suy luận sản xuất |
| INT4 | 0,5 byte | ~35 GB | Chấp nhận được | Thiết bị biên, triển khai cục bộ |

---

## 5. Triển khai mô hình: Từ phòng thí nghiệm đến môi trường sản xuất

Mô hình đã được huấn luyện, đã được lượng tử hóa nén lại, bước cuối cùng là triển khai nó thành dịch vụ có thể gọi được. Triển khai mô hình không chỉ là "cho mô hình chạy lên", mà còn liên quan đến các vấn đề kỹ thuật như xử lý đồng thời, cân bằng tải, kiểm soát chi phí.

<ModelServingDemo />

::: tip Ba phương án triển khai chính
1. **Nhà cung cấp API**: Sử dụng trực tiếp API của các nhà cung cấp như OpenAI, Anthropic. Không cần vận hành, trả phí theo token, phù hợp cho kiểm thử nhanh và quy mô vừa và nhỏ.
2. **Dịch vụ suy luận tự lưu trữ**: Dùng các framework như vLLM, TGI để triển khai trên máy chủ GPU riêng. Chi phí có thể kiểm soát, dữ liệu không rời khỏi miền, phù hợp cho tình huống có yêu cầu bảo mật hoặc khối lượng gọi lớn.
3. **Suy luận Serverless**: Sử dụng các nền tảng như AWS SageMaker, Replicate, trả phí theo yêu cầu, tự động mở rộng và thu hẹp. Phù hợp cho tình huống lưu lượng biến động lớn.
:::

| Phương án triển khai | Mô hình chi phí | Độ trễ | Độ phức tạp vận hành | Tình huống áp dụng |
|---------|---------|------|-----------|---------|
| Nhà cung cấp API | Tính phí theo token | Trung bình | Không | Nguyên mẫu nhanh, quy mô vừa và nhỏ |
| vLLM tự triển khai | Phí thuê GPU | Thấp | Cao | Quy mô lớn, nhạy cảm về bảo mật |
| Serverless | Tính phí theo yêu cầu | Khởi động lạnh cao hơn | Thấp | Lưu lượng biến động lớn |
| Triển khai biên | Đầu tư phần cứng một lần | Cực thấp | Trung bình | Tình huống ngoại tuyến, IoT |

---

## Tổng kết

Tinh chỉnh và triển khai mô hình là khâu then chốt để biến mô hình lớn từ "công cụ đa năng" thành "trợ lý chuyên nghiệp". Từ chuẩn bị dữ liệu đến triển khai mô hình, mỗi bước đều cần tư duy và thực hành kỹ thuật.

Ôn lại các điểm chính của chương này:

1. **Tinh chỉnh là đào tạo trước khi vào việc**: Giúp mô hình đa năng học kiến thức và mẫu hành vi của lĩnh vực cụ thể
2. **Chất lượng dữ liệu quyết định giới hạn trên**: 100 mẫu dữ liệu chất lượng cao tốt hơn 10.000 mẫu dữ liệu chất lượng thấp
3. **LoRA là vua hiệu quả**: Dùng chưa đến 1% tham số đạt hiệu quả gần tinh chỉnh toàn phần
4. **Lượng tử hóa là vũ khí triển khai**: Lượng tử hóa INT4 giúp mô hình 70B chạy được trên một card đơn
5. **Phương án triển khai tùy theo hoàn cảnh**: Kiểm thử nhanh dùng API, quy mô lớn dùng tự triển khai, biến động lớn dùng Serverless

## Đọc thêm

- [Tài liệu Hugging Face PEFT](https://huggingface.co/docs/peft) - Tài liệu chính thức của thư viện tinh chỉnh hiệu quả tham số
- [Tài liệu vLLM](https://docs.vllm.ai/) - Engine suy luận LLM hiệu suất cao
- [Unsloth](https://github.com/unslothai/unsloth) - Framework tinh chỉnh LoRA tăng tốc 2x
- [Giải thích định dạng GGUF](https://github.com/ggerganov/ggml/blob/master/docs/gguf.md) - Định dạng mô hình lượng tử hóa dùng bởi llama.cpp
- [Hướng dẫn tinh chỉnh OpenAI](https://platform.openai.com/docs/guides/fine-tuning) - Hướng dẫn tinh chỉnh chính thức của OpenAI

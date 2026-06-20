# RAG: Tạo sinh tăng cường truy xuất

::: tip Lời nói đầu
**Tại sao ChatGPT đôi khi "nói dối một cách rất thuyết phục"?** Kiến thức của mô hình ngôn ngữ lớn đến từ dữ liệu huấn luyện, nhưng dữ liệu huấn luyện có thời hạn cắt, và cũng không bao gồm tài liệu nội bộ của công ty bạn. RAG (Retrieval-Augmented Generation, Tạo sinh tăng cường truy xuất) chính là công nghệ cốt lõi để giải quyết vấn đề này — cho phép AI "tra cứu tài liệu" trước khi trả lời.
:::

**Bài viết này sẽ dạy bạn điều gì?**

Sau khi học xong chương này, bạn sẽ có được:

- **Hiểu biết về khái niệm cốt lõi**: Hiểu RAG là gì, tại sao cần nó, và cách nó giải quyết vấn đề "ảo giác" của mô hình lớn
- **Nắm được quy trình hoàn chỉnh**: Nắm vững quy trình end-to-end từ tải tài liệu, phân đoạn, vector hóa đến truy xuất và tạo sinh
- **Khả năng lựa chọn công nghệ**: Hiểu ưu nhược điểm của các chiến lược phân đoạn và phương pháp truy xuất khác nhau, có thể lựa chọn theo tình huống
- **Góc nhìn tiến hóa kiến trúc**: Hiểu lộ trình tiến hóa của RAG từ Naive đến Advanced rồi đến Modular
- **Khả năng ra quyết định thực tế**: Biết khi nào nên dùng RAG, khi nào nên dùng fine-tune

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Quy trình cơ bản của RAG | Ba giai đoạn: lập chỉ mục, truy xuất, tạo sinh |
| **Chương 2** | Chiến lược phân đoạn văn bản | Phân đoạn cố định, phân đoạn ngữ nghĩa, phân đoạn đệ quy |
| **Chương 3** | Kỹ thuật truy xuất | Truy xuất vector, truy xuất từ khóa, truy xuất kết hợp |
| **Chương 4** | Tiến hóa kiến trúc | Naive RAG → Advanced RAG → Modular RAG |
| **Chương 5** | RAG vs Fine-tune | So sánh tình huống áp dụng của hai phương án |

---

## 0. Toàn cảnh: Tại sao mô hình lớn cần "tra cứu tài liệu"?

Hãy tưởng tượng bạn là một giáo sư uyên bác, đã đọc vô số cuốn sách. Nhưng nếu có người hỏi bạn "dữ liệu bán hàng hôm qua của công ty là bao nhiêu", bạn chắc chắn không thể trả lời — bởi vì những thông tin này không có trong những cuốn sách bạn đã đọc.

Mô hình ngôn ngữ lớn cũng đối mặt với tình huống khó xử tương tự:

- **Kiến thức có thời hạn cắt**: Dữ liệu huấn luyện của GPT-4 bị cắt đến một thời điểm nhất định, những sự kiện sau đó nó không biết
- **Thiếu kiến thức riêng tư**: Tài liệu nội bộ, hướng dẫn sản phẩm, dữ liệu khách hàng của công ty bạn, mô hình chưa từng thấy
- **Dễ sinh ra ảo giác**: Khi mô hình không chắc chắn về câu trả lời, nó có xu hướng "bịa ra" một câu trả lời nghe có vẻ hợp lý

::: tip Ý tưởng cốt lõi của RAG
Giải pháp của RAG rất trực quan: **trước khi để mô hình trả lời, hãy giúp nó tìm tài liệu tham khảo liên quan**. Giống như thi mở sách — bạn không cần nhớ tất cả kiến thức, chỉ cần biết đi đâu tìm và tìm như thế nào.

RAG = Truy xuất (Retrieval) + Tăng cường (Augmented) + Tạo sinh (Generation)
:::

---

## 1. Quy trình cơ bản của RAG: Lập chỉ mục, Truy xuất, Tạo sinh

Quy trình làm việc của RAG có thể chia thành hai giai đoạn: **lập chỉ mục ngoại tuyến** và **truy vấn trực tuyến**.

Giai đoạn ngoại tuyến giống như công việc biên mục của thư viện — phân loại, đánh số, xếp lên kệ tất cả sách để sau này dễ tìm kiếm. Giai đoạn trực tuyến là quá trình người đọc đến thư viện tra cứu tài liệu — dựa vào câu hỏi tìm sách liên quan, sau đó tổng hợp thông tin để đưa ra câu trả lời.

<RAGPipelineDemo />

::: tip Ba giai đoạn cốt lõi
1. **Giai đoạn lập chỉ mục (Indexing)**: Tải tài liệu gốc, làm sạch, phân đoạn, sau đó chuyển đổi thành vector thông qua mô hình nhúng, lưu vào cơ sở dữ liệu vector. Đây là công việc chuẩn bị một lần.
2. **Giai đoạn truy xuất (Retrieval)**: Khi người dùng đặt câu hỏi, cũng chuyển câu hỏi thành vector, tìm kiếm các đoạn tài liệu tương tự nhất trong cơ sở dữ liệu vector.
3. **Giai đoạn tạo sinh (Generation)**: Ghép các đoạn tài liệu đã truy xuất cùng với câu hỏi của người dùng thành Prompt, giao cho mô hình lớn tạo ra câu trả lời cuối cùng.
:::

| Giai đoạn | Đầu vào | Đầu ra | Kỹ thuật then chốt |
|------|------|------|---------|
| Lập chỉ mục | Tài liệu gốc | Cơ sở dữ liệu vector | Phân đoạn văn bản, Mô hình nhúng |
| Truy xuất | Câu hỏi người dùng | Top-K đoạn tài liệu | Độ tương đồng vector, Xếp hạng lại |
| Tạo sinh | Câu hỏi + Ngữ cảnh | Câu trả lời cuối cùng | Prompt Engineering, LLM |

---

## 2. Phân đoạn văn bản: Nhét con voi vào tủ lạnh

Phân đoạn văn bản là khâu dễ bị bỏ qua nhất trong RAG, nhưng lại có ảnh hưởng lớn nhất đến hiệu quả. Tại sao cần phân đoạn? Bởi vì cửa sổ ngữ cảnh của mô hình lớn có giới hạn, chúng ta không thể nhét cả cuốn sách vào. Quan trọng hơn, **chất lượng phân đoạn quyết định trực tiếp đến chất lượng truy xuất**.

Hãy tưởng tượng bạn đang tìm một điểm kiến thức trong cuốn sách ở thư viện. Nếu cả cuốn sách là một "đoạn", truy xuất được cũng vô ích — bạn vẫn phải lật hết cả cuốn. Nhưng nếu phân đoạn theo chương hoặc thậm chí theo đoạn văn, bạn có thể định vị chính xác nội dung cần tìm.

<ChunkingStrategyDemo />

::: tip Lựa chọn chiến lược phân đoạn
- **Phân đoạn kích thước cố định**: Cắt theo số ký tự hoặc số token, đơn giản thô bạo nhưng có thể cắt đứt ngữ nghĩa
- **Phân đoạn đệ quy**: Trước tiên phân theo đoạn văn, đoạn văn quá dài thì phân theo câu, giữ được tính toàn vẹn ngữ nghĩa
- **Phân đoạn ngữ nghĩa**: Dùng mô hình nhúng để phán đoán ranh giới ngữ nghĩa, cắt tại nơi có độ tương đồng đột biến
- **Phân đoạn theo cấu trúc tài liệu**: Tận dụng thông tin cấu trúc như tiêu đề Markdown, thẻ HTML để phân đoạn

Không có chiến lược phân đoạn "tốt nhất", chỉ có chiến lược phù hợp nhất với dữ liệu của bạn. Khuyến nghị chung là bắt đầu từ phân đoạn đệ quy, kích thước chunk 200-500 token, overlap 10-20%.
:::

---

## 3. Kỹ thuật truy xuất: Làm sao tìm được nội dung liên quan nhất?

Sau khi phân đoạn xong, câu hỏi then chốt tiếp theo là: **người dùng đặt một câu hỏi, làm sao tìm được vài đoạn liên quan nhất từ hàng nghìn đoạn tài liệu?**

Điều này giống như tìm sách trong một thư viện khổng lồ. Bạn có thể tìm theo từ khóa tên sách (truy xuất từ khóa), hoặc mô tả nội dung bạn muốn để thủ thư giúp bạn tìm (truy xuất ngữ nghĩa), cách tốt nhất là kết hợp cả hai (truy xuất kết hợp).

<RetrievalDemo />

| Cách truy xuất | Nguyên lý | Ưu điểm | Nhược điểm |
|---------|------|------|------|
| Truy xuất từ khóa (BM25) | Dựa trên tần suất từ và tần suất tài liệu nghịch đảo | Khớp chính xác, tốc độ nhanh | Không hiểu ngữ nghĩa, từ đồng nghĩa vô hiệu |
| Truy xuất vector | Dựa trên độ tương đồng cosine của vector nhúng | Hiểu ngữ nghĩa, hỗ trợ khớp mờ | Không nhạy với danh từ riêng |
| Truy xuất kết hợp | Kết hợp kết quả từ khóa và vector | Cân bằng chính xác và ngữ nghĩa | Cần điều chỉnh trọng số, độ phức tạp cao |

::: tip Xếp hạng lại (Reranking)
Sau khi truy xuất được các tài liệu ứng viên, thường cần thêm một bước "xếp hạng lại". Truy xuất ban đầu theo đuổi độ bao phủ (cố gắng không bỏ sót), xếp hạng lại theo đuổi độ chính xác (đưa những thứ liên quan nhất lên đầu). Các mô hình xếp hạng lại phổ biến có Cohere Rerank, BGE Reranker, v.v., chúng sử dụng bộ mã hóa chéo để chấm điểm tinh chỉnh cho từng cặp query-document.
:::

---

## 4. Tiến hóa kiến trúc: Từ đơn giản đến thông minh

Công nghệ RAG trong vòng hai năm ngắn ngủi đã trải qua ba thế hệ tiến hóa, mỗi thế hệ đều giải quyết những điểm đau của thế hệ trước.

<RAGArchitectureDemo />

::: tip So sánh ba thế hệ kiến trúc RAG
- **Naive RAG (2023)**: Quy trình "lập chỉ mục → truy xuất → tạo sinh" cơ bản nhất, triển khai đơn giản nhưng hiệu quả hạn chế. Các vấn đề bao gồm: chất lượng truy xuất không ổn định, không thể xử lý truy vấn phức tạp, dễ đưa vào ngữ cảnh nhiễu.
- **Advanced RAG (2024)**: Trên nền tảng Naive RAG bổ sung thêm các khâu tối ưu như viết lại truy vấn, truy xuất kết hợp, xếp hạng lại, nén ngữ cảnh, nâng cao đáng kể độ chính xác truy xuất và chất lượng tạo sinh.
- **Modular RAG (2025)**: Phân rã RAG thành các mô-đun có thể cắm rút, hỗ trợ các khả năng cao cấp như phán đoán định tuyến, truy xuất thích ứng, tự phản tư. Có thể lựa chọn động quy trình xử lý tối ưu dựa trên loại truy vấn.
:::

---

## 5. RAG vs Fine-tune: Nên chọn cái nào?

Khi bạn muốn mô hình lớn nắm vững kiến thức trong một lĩnh vực cụ thể, thường có hai con đường: RAG và Fine-tune (tinh chỉnh). Chúng không loại trừ lẫn nhau, mà bổ trợ cho nhau.

Lấy một ví dụ: **Fine-tune giống như cho học sinh đi học thêm**, nội hóa kiến thức vào não bộ; **RAG giống như phát cho học sinh sách tham khảo**, khi thi có thể lật xem. Hai cách đều có ưu nhược điểm, mấu chốt nằm ở nhu cầu cụ thể của bạn.

<RAGvsFineTuningDemo />

| Khía cạnh | RAG | Fine-tune |
|------|-----|------|
| Cập nhật kiến thức | Cập nhật thời gian thực, sửa tài liệu là được | Cần huấn luyện lại |
| Chi phí | Thấp (không cần GPU huấn luyện) | Cao (cần tài nguyên huấn luyện) |
| Khả năng giải thích | Cao (có thể truy xuất nguồn) | Thấp (kiến thức nội hóa trong trọng số) |
| Tình huống áp dụng | Hỏi đáp kho kiến thức, truy xuất tài liệu | Chuyển đổi phong cách, tối ưu tác vụ cụ thể |
| Kiểm soát ảo giác | Tốt hơn (có cơ sở tham khảo) | Trung bình (vẫn có thể ảo giác) |

::: tip Gợi ý thực tế
Trong hầu hết tình huống, **hãy thử RAG trước**. Ưu điểm của RAG là: không cần huấn luyện, kiến thức có thể cập nhật thời gian thực, câu trả lời có thể truy xuất nguồn gốc. Chỉ khi bạn cần thay đổi "mô thức hành vi" của mô hình (ví dụ định dạng đầu ra, phong cách ngôn ngữ, cách suy luận), mới cân nhắc fine-tune. Phương án mạnh nhất thường là sự kết hợp **RAG + Fine-tune**.
:::

---

## Tổng kết

RAG là một trong những công nghệ thiết thực nhất để đưa mô hình lớn vào ứng dụng thực tế hiện nay. Giá trị cốt lõi của nó nằm ở chỗ: làm cho câu trả lời của mô hình có cơ sở để kiểm chứng, kiến thức có thể cập nhật thời gian thực, ảo giác có thể được kiểm soát hiệu quả.

Ôn lại những điểm then chốt của chương này:

1. **Vấn đề cốt lõi RAG giải quyết**: Mô hình lớn có kiến thức lỗi thời, thiếu dữ liệu riêng tư, dễ sinh ảo giác
2. **Quy trình ba giai đoạn**: Lập chỉ mục (chuẩn bị ngoại tuyến) → Truy xuất (tìm kiếm trực tuyến) → Tạo sinh (tổng hợp câu trả lời)
3. **Phân đoạn là nền tảng**: Chất lượng phân đoạn quyết định trực tiếp chất lượng truy xuất, chọn chiến lược phân đoạn phù hợp là rất quan trọng
4. **Truy xuất là then chốt**: Truy xuất kết hợp + Xếp hạng lại hiện là tổ hợp hiệu quả tốt nhất
5. **Kiến trúc đang tiến hóa**: Từ Naive RAG đến Modular RAG, hệ thống ngày càng thông minh và linh hoạt
6. **RAG và Fine-tune bổ trợ cho nhau**: Hầu hết tình huống thử RAG trước, khi cần thay đổi hành vi mô hình mới cân nhắc fine-tune

## Đọc thêm

- [LangChain RAG Tutorial](https://python.langchain.com/docs/tutorials/rag/) - Hướng dẫn thực hành framework RAG phổ biến nhất
- [LlamaIndex Docs](https://docs.llamaindex.ai/) - Framework tập trung vào RAG, cung cấp nhiều data connector phong phú
- [RAG Survey Paper](https://arxiv.org/abs/2312.10997) - Tổng quan toàn diện về công nghệ RAG
- [Chunking Strategies](https://www.pinecone.io/learn/chunking-strategies/) - Giải thích chi tiết chiến lược phân đoạn từ Pinecone
- [Vector DB Comparison](https://superlinked.com/vector-db-comparison) - So sánh tính năng các cơ sở dữ liệu vector phổ biến

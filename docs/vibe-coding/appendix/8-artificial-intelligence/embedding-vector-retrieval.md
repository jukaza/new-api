# Embedding và Truy xuất Vector

::: tip Lời mở đầu
**Làm thế nào để máy tính hiểu được "mèo và chó giống nhau, nhưng lại khác với ô tô"?** Với con người đó là kiến thức thông thường, nhưng với máy tính thì "mèo", "chó", "ô tô" chỉ là ba chuỗi ký tự không có mối liên hệ nào. Công nghệ Embedding (nhúng) chính là chìa khóa để giải quyết vấn đề này — nó biến văn bản thành vector số, giúp máy tính cũng có thể hiểu được "khoảng cách gần xa" về mặt ngữ nghĩa.
:::

**Bài viết này sẽ giúp bạn học được gì?**

Sau khi học xong chương này, bạn sẽ nắm được:

- **Hiểu trực quan**: Hiểu Embedding là gì, tại sao vector của "mèo" và "chó" lại gần nhau
- **Tính toán độ tương đồng**: Nắm vững các phương pháp đo lường cốt lõi như Cosine Similarity, Euclidean Distance
- **Nguyên lý chỉ mục**: Hiểu cách vector database truy xuất trong mili giây trên dữ liệu hàng triệu bản ghi
- **Lựa chọn công nghệ**: Hiểu đặc điểm và tình huống áp dụng của các vector database phổ biến
- **Quy trình end-to-end**: Nắm vững Pipeline hoàn chỉnh từ văn bản → vector → truy xuất

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Khái niệm Embedding | Không gian ngữ nghĩa, biểu diễn vector |
| **Chương 2** | Tính toán độ tương đồng | Cosine Similarity, Euclidean Distance |
| **Chương 3** | Chỉ mục vector | Tìm kiếm brute-force vs ANN |
| **Chương 4** | Vector Database | Pinecone, Milvus, Chroma |
| **Chương 5** | Pipeline end-to-end | Văn bản → Vector → Lưu trữ → Truy vấn |

---

## 0. Toàn cảnh: Cây cầu từ văn bản đến con số

Trong thế giới xử lý ngôn ngữ tự nhiên, có một thách thức căn bản: **máy tính chỉ hiểu con số, không hiểu văn bản**.

Cách làm ban đầu là gán cho mỗi từ một mã số (mã hóa One-Hot), ví dụ "mèo"=001, "chó"=010, "ô tô"=100. Nhưng cách này có một vấn đề chết người: **khoảng cách giữa tất cả các từ đều như nhau**. Khoảng cách từ "mèo" đến "chó" và từ "mèo" đến "ô tô" hoàn toàn giống hệt — điều này rõ ràng không phù hợp với trực giác của chúng ta.

Tính cách mạng của Embedding nằm ở chỗ: nó ánh xạ mỗi từ vào một **không gian vector dày đặc với số chiều thấp**, khiến các từ có ngữ nghĩa gần nhau tự nhiên tụ họp lại với nhau. Trong không gian này, "mèo" và "chó" nằm rất gần nhau, còn "ô tô" thì ở xa — máy tính cuối cùng đã có thể "hiểu" được ngữ nghĩa.

::: tip Bước nhảy vọt từ One-Hot đến Embedding
- **One-Hot**: Số chiều = kích thước từ điển (có thể lên đến hàng chục nghìn), mỗi vector chỉ có một số 1, còn lại toàn 0, thưa thớt và không có thông tin ngữ nghĩa
- **Embedding**: Số chiều thường từ 768~1536, mỗi con số đều có ý nghĩa, dày đặc và giàu thông tin ngữ nghĩa
- **Đột phá then chốt**: Word2Vec (2013) đã chứng minh rằng "ý nghĩa của từ có thể được định nghĩa bởi ngữ cảnh của nó", mở ra kỷ nguyên Embedding
:::

---

## 1. Khái niệm Embedding: Biến văn bản thành tọa độ

Tư tưởng cốt lõi của Embedding có thể tóm gọn trong một câu: **dùng một nhóm con số (vector) để biểu diễn ý nghĩa của một từ hoặc một câu**.

Hãy tưởng tượng một hệ tọa độ hai chiều. Chúng ta đặt "mèo" ở tọa độ (0.2, 0.7), "chó" ở (0.3, 0.6), "ô tô" ở (0.9, 0.1). Bạn sẽ thấy tọa độ của "mèo" và "chó" rất gần nhau, còn "ô tô" thì cách xa chúng. Đây chính là trực giác của Embedding — **độ tương đồng ngữ nghĩa trở thành khoảng cách trong không gian**.

<EmbeddingConceptDemo />

::: tip Ba đặc tính then chốt của Embedding
1. **Phân cụm ngữ nghĩa**: Các từ có ý nghĩa tương tự sẽ tự động tụ họp lại với nhau (động vật một cụm, thực phẩm một cụm, công nghệ một cụm)
2. **Quan hệ tương tự**: Phép toán vector có thể biểu diễn quan hệ ngữ nghĩa, ví dụ kinh điển: king - man + woman ≈ queen
3. **Ý nghĩa của từng chiều**: Mỗi chiều ngầm mã hóa một đặc trưng ngữ nghĩa nào đó (như "có phải động vật không", "kích thước", "xu hướng cảm xúc", v.v.)
:::

| Phương thức mã hóa | Số chiều | Thông tin ngữ nghĩa | Ứng dụng điển hình |
|---------|------|---------|---------|
| One-Hot | Kích thước từ điển (~50000) | Không có | NLP truyền thống |
| Word2Vec | 100~300 | Ngữ nghĩa cấp từ | Độ tương đồng từ, suy luận tương tự |
| BERT Embedding | 768 | Ngữ nghĩa theo ngữ cảnh | Hiểu câu, Hỏi đáp |
| OpenAI text-embedding-3 | 1536~3072 | Ngữ nghĩa sâu | RAG, Tìm kiếm ngữ nghĩa |

---

## 2. Tính toán độ tương đồng: Các vector "gần" nhau đến mức nào?

Khi đã có biểu diễn vector, câu hỏi tiếp theo tự nhiên là: **làm thế nào để đo lường mức độ tương đồng giữa hai vector?** Điều này giống như đo xem hai thành phố gần nhau đến mức nào trên bản đồ — bạn có thể đo khoảng cách đường thẳng, hoặc xem hướng của chúng có nhất quán không.

<VectorSimilarityDemo />

::: tip Hai phép đo cốt lõi
- **Cosine Similarity (Độ tương đồng Cosine)**: Đo lường mức độ **nhất quán về hướng** của hai vector, miền giá trị [-1, 1]. 1 nghĩa là hướng hoàn toàn giống nhau, 0 nghĩa là trực giao (không liên quan), -1 nghĩa là hoàn toàn ngược hướng. Là lựa chọn hàng đầu cho so sánh ngữ nghĩa văn bản, vì không bị ảnh hưởng bởi độ dài vector.
- **Euclidean Distance (Khoảng cách Euclid)**: Đo lường **khoảng cách đường thẳng** giữa hai điểm đầu mút vector, miền giá trị [0, ∞). 0 nghĩa là hoàn toàn trùng khớp, giá trị càng lớn càng ít tương đồng. Phù hợp cho các tình huống cần xét đến "độ lớn tuyệt đối".
:::

| Phương pháp đo | Trực quan công thức | Miền giá trị | Tình huống áp dụng |
|---------|---------|------|---------|
| Cosine Similarity | Nhìn hướng, bỏ qua độ dài | [-1, 1] | Tìm kiếm ngữ nghĩa văn bản, hệ thống gợi ý |
| Euclidean Distance | Nhìn khoảng cách đường thẳng giữa hai điểm | [0, ∞) | Đặc trưng hình ảnh, phân tích cụm |
| Dot Product | Hướng × Độ dài | (-∞, +∞) | Tính nhanh cho vector đã chuẩn hóa |
| Manhattan Distance | Khoảng cách đi dọc theo trục tọa độ | [0, ∞) | Vector thưa chiều cao |

---

## 3. Chỉ mục vector: Làm thế nào để truy xuất trong mili giây trên hàng triệu vector?

Giả sử bạn có 1 triệu tài liệu, mỗi tài liệu đã được chuyển thành vector 1536 chiều. Người dùng đặt một câu hỏi, bạn cần tìm 10 tài liệu tương đồng nhất. Cách trực tiếp nhất là lần lượt tính độ tương đồng — nhưng điều đó có nghĩa là phải thực hiện 1 triệu phép toán vector 1536 chiều, quá chậm.

Đây chính là vấn đề mà **chỉ mục vector** giải quyết: **đánh đổi không gian lấy thời gian, thông qua tiền xử lý để xây dựng cấu trúc chỉ mục, giúp tốc độ truy xuất giảm từ O(n) xuống xấp xỉ O(log n)**.

<VectorIndexDemo />

::: tip Tìm kiếm Brute-force vs Xấp xỉ Láng giềng Gần nhất (ANN)
- **Tìm kiếm Brute-force (Flat)**: So sánh từng cái một, độ chính xác 100% nhưng tốc độ chậm. Phù hợp với tình huống dữ liệu nhỏ (< 100 nghìn).
- **IVF (Inverted File Index)**: Trước tiên chia không gian vector thành nhiều vùng (phân cụm), khi truy vấn chỉ tìm kiếm trong vài vùng gần nhất. Giống như chia thư viện theo chủ đề, khi tìm sách chỉ cần đến khu vực liên quan.
- **HNSW (Hierarchical Navigable Small World)**: Xây dựng cấu trúc đồ thị nhiều tầng, điều hướng từ thô đến mịn qua từng tầng. Giống như trước tiên xem bản đồ thế giới để định vị quốc gia, sau đó xem bản đồ cấp tỉnh, cuối cùng xem bản đồ đường phố.
- **PQ (Product Quantization)**: Nén vector chiều cao thành mã ngắn, hy sinh một chút độ chính xác để tiết kiệm đáng kể bộ nhớ. Phù hợp với tập dữ liệu siêu lớn.
:::

| Loại chỉ mục | Tốc độ xây dựng | Tốc độ truy vấn | Độ thu hồi | Tiêu thụ bộ nhớ | Quy mô áp dụng |
|---------|---------|---------|-------|---------|---------|
| Flat (Brute-force) | Không cần xây dựng | Chậm | 100% | Cao | < 100 nghìn |
| IVF | Trung bình | Nhanh | 95%+ | Trung bình | 100 nghìn~10 triệu |
| HNSW | Chậm | Rất nhanh | 99%+ | Cao | 100 nghìn~10 triệu |
| PQ | Trung bình | Nhanh | 90%+ | Rất thấp | > 10 triệu |
| IVF-PQ | Trung bình | Nhanh | 92%+ | Thấp | > 100 triệu |

---

## 4. Vector Database: Công cụ lưu trữ được thiết kế riêng cho vector

Khi đã có vector và thuật toán chỉ mục, bạn cần một nơi để lưu trữ và quản lý chúng. Cơ sở dữ liệu truyền thống (MySQL, PostgreSQL) xử lý dữ liệu có cấu trúc rất tốt, nhưng lại bất lực trước tìm kiếm tương đồng trên vector chiều cao. **Vector database** được thiết kế chuyên biệt cho tình huống này.

<VectorDatabaseDemo />

::: tip Năng lực cốt lõi của Vector Database
1. **Lưu trữ hiệu quả**: Định dạng lưu trữ được tối ưu hóa cho vector dấu phẩy động chiều cao
2. **Truy xuất ANN**: Tích hợp sẵn nhiều thuật toán chỉ mục xấp xỉ láng giềng gần nhất (HNSW, IVF, v.v.)
3. **Lọc theo metadata**: Hỗ trợ lọc theo thẻ, thời gian và các điều kiện khác đồng thời với tìm kiếm vector
4. **Cập nhật thời gian thực**: Hỗ trợ thêm, xóa, sửa vector động mà không cần xây dựng lại toàn bộ chỉ mục
5. **Mở rộng ngang**: Kiến trúc phân tán hỗ trợ quy mô hàng trăm triệu vector
:::

| Cơ sở dữ liệu | Loại hình | Đặc điểm | Tình huống áp dụng |
|-------|------|------|---------|
| Pinecone | Dịch vụ đám mây quản lý toàn phần | Không cần vận hành, dùng ngay | Nguyên mẫu nhanh, sản xuất quy mô vừa và nhỏ |
| Milvus | Mã nguồn mở phân tán | Hiệu năng cao, có thể mở rộng | Môi trường sản xuất quy mô lớn |
| Chroma | Mã nguồn mở nhẹ | Nhúng được, API đơn giản | Phát triển cục bộ, dự án nhỏ |
| Weaviate | Mã nguồn mở cloud-native | Vector hóa tích hợp, GraphQL | Tình huống cần vector hóa tự động |
| Qdrant | Mã nguồn mở hiệu năng cao | Viết bằng Rust, lọc mạnh | Tình huống cần lọc phức tạp |
| pgvector | Tiện ích mở rộng PG | Tận dụng hạ tầng PG hiện có | Đội ngũ đã có sẵn PostgreSQL |

---

## 5. Pipeline End-to-End: Quy trình hoàn chỉnh từ văn bản đến truy xuất

Sau khi đã hiểu từng thành phần, hãy kết nối chúng lại với nhau để xem một hệ thống truy xuất vector hoàn chỉnh hoạt động như thế nào.

Toàn bộ quy trình được chia thành hai tuyến: **ghi ngoại tuyến** (biến tài liệu thành vector và lưu trữ) và **truy vấn trực tuyến** (biến câu hỏi thành vector để tìm kiếm).

<EmbeddingPipelineDemo />

::: tip Quy trình ghi ngoại tuyến
1. **Tải tài liệu**: Đọc văn bản thô từ nhiều nguồn khác nhau (PDF, trang web, cơ sở dữ liệu)
2. **Tiền xử lý văn bản**: Làm sạch, khử nhiễu, chuẩn hóa (loại bỏ thẻ HTML, ký tự đặc biệt, v.v.)
3. **Phân đoạn văn bản**: Cắt văn bản dài thành các đoạn có kích thước phù hợp theo chiến lược (200~500 tokens)
4. **Vector hóa**: Gọi mô hình nhúng (như OpenAI text-embedding-3-small) để chuyển mỗi đoạn thành vector
5. **Lưu vào vector database**: Ghi vector cùng với văn bản gốc và metadata vào cơ sở dữ liệu
:::

::: tip Quy trình truy vấn trực tuyến
1. **Nhận truy vấn**: Người dùng nhập câu hỏi bằng ngôn ngữ tự nhiên
2. **Vector hóa truy vấn**: Dùng cùng một mô hình nhúng để chuyển câu hỏi thành vector
3. **Truy xuất độ tương đồng**: Tìm kiếm Top-K đoạn tài liệu tương đồng nhất trong vector database
4. **Hậu xử lý**: Xếp hạng lại, loại trùng lặp, lọc theo metadata
5. **Trả về kết quả**: Trả các đoạn tài liệu liên quan nhất cho bên gọi (hoặc giao cho LLM để sinh câu trả lời)
:::

| Công đoạn | Lựa chọn then chốt | Giải pháp khuyến nghị |
|------|---------|---------|
| Mô hình nhúng | Độ chính xác vs Chi phí vs Tốc độ | OpenAI text-embedding-3-small (tỷ lệ giá/hiệu năng cao) |
| Chiến lược phân đoạn | Độ mịn vs Tính toàn vẹn ngữ nghĩa | Phân đoạn đệ quy, 200~500 tokens |
| Vector database | Quy mô vs Chi phí vận hành | Dự án nhỏ dùng Chroma, sản xuất dùng Pinecone/Milvus |
| Phép đo tương đồng | Ngữ nghĩa vs Chính xác | Cosine Similarity (lựa chọn hàng đầu cho văn bản) |
| Giá trị Top-K | Độ thu hồi vs Nhiễu | Truy xuất trước 20 kết quả, xếp hạng lại lấy Top 5 |

---

## Tổng kết

Embedding và Truy xuất Vector là cây cầu kết nối "ngôn ngữ con người" với "sự hiểu biết của máy móc", đồng thời là hạ tầng cơ sở cho các ứng dụng AI như RAG, tìm kiếm ngữ nghĩa, hệ thống gợi ý.

Ôn lại các điểm then chốt của chương này:

1. **Bản chất của Embedding**: Ánh xạ văn bản vào không gian vector chiều cao, biến độ tương đồng ngữ nghĩa thành khoảng cách trong không gian
2. **Đo lường độ tương đồng**: Cosine Similarity tập trung vào hướng (phù hợp cho văn bản), Euclidean Distance tập trung vào khoảng cách tuyệt đối
3. **Chỉ mục là chìa khóa hiệu năng**: HNSW và IVF giúp truy xuất trên hàng triệu vector giảm xuống còn mili giây
4. **Lựa chọn vector database**: Dự án nhỏ dùng Chroma/pgvector, môi trường sản xuất dùng Pinecone/Milvus
5. **Tư duy end-to-end**: Từ tải tài liệu đến truy xuất cuối cùng, mỗi lựa chọn ở từng công đoạn đều ảnh hưởng đến hiệu quả cuối cùng

## Đọc thêm

- [Tài liệu OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings) - Hướng dẫn sử dụng mô hình nhúng chính thức
- [Pinecone Learning Center](https://www.pinecone.io/learn/) - Hướng dẫn hệ thống về vector database và truy xuất
- [FAISS Wiki](https://github.com/facebookresearch/faiss/wiki) - Tài liệu thư viện truy xuất vector mã nguồn mở của Facebook
- [Bài báo gốc Word2Vec](https://arxiv.org/abs/1301.3781) - Tác phẩm mở đường cho kỷ nguyên Embedding
- [Bảng xếp hạng MTEB](https://huggingface.co/spaces/mteb/leaderboard) - Bảng so sánh hiệu năng mô hình nhúng

# Toàn cảnh mô hình dữ liệu (Document / Đồ thị / Chuỗi thời gian / Vector)

::: tip 🎯 Vấn đề cốt lõi
**Tại sao không thể nhét tất cả dữ liệu vào bảng MySQL?** Khi dữ liệu của bạn là mạng lưới quan hệ xã hội, hàng triệu bản ghi cảm biến mỗi giây, hoặc vector ngữ nghĩa mà AI cần hiểu, bảng quan hệ sẽ bất lực. Các hình thái dữ liệu khác nhau cần phương pháp mô hình hóa khác nhau.
:::

---

## 1. Ngoài quan hệ: Tại sao cần các mô hình dữ liệu khác?

Cơ sở dữ liệu quan hệ (MySQL, PostgreSQL) tổ chức dữ liệu bằng "bảng + hàng + cột", phù hợp cho dữ liệu nghiệp vụ có cấu trúc cố định và quan hệ rõ ràng. Nhưng dữ liệu trong thế giới thực không chỉ có hình thái này:

| Hình thái dữ liệu | Điểm đau của mô hình quan hệ | Mô hình phù hợp hơn |
|-------------------|------------------------------|---------------------|
| Hồ sơ người dùng (trường không cố định, cấu trúc lồng nhau) | ALTER TABLE thường xuyên, nhiều cột NULL | **Mô hình Document** |
| Mạng xã hội (bạn của bạn của bạn) | Hiệu suất JOIN nhiều tầng giảm theo cấp số nhân | **Mô hình đồ thị** |
| Chỉ số giám sát (hàng triệu ghi mỗi giây) | Nút thắt ghi, dữ liệu lịch sử phình to | **Mô hình chuỗi thời gian** |
| Tìm kiếm ngữ nghĩa AI (nội dung "có ý nghĩa tương tự") | Không thể thể hiện độ tương đồng ngữ nghĩa | **Mô hình vector** |

::: info 💡 Quan điểm cốt lõi
Không phải "thay thế" quan hệ, mà là "bổ sung". Nghiệp vụ cốt lõi của hầu hết hệ thống vẫn chạy trên MySQL/PostgreSQL, nhưng việc đưa vào mô hình dữ liệu chuyên dụng cho các kịch bản cụ thể có thể mang lại cải thiện hiệu suất lên nhiều cấp số.
:::

---

## 2. Mô hình Document (Tài liệu)

### 2.1 Mô hình Document là gì?

Mô hình Document lưu trữ dữ liệu dưới dạng **tài liệu JSON/BSON**, mỗi bản ghi là một tài liệu tự chứa, có thể có cấu trúc trường khác nhau.

```json
{
  "_id": "user_1001",
  "name": "张三",
  "tags": ["VIP", "活跃"],
  "address": { "city": "北京", "district": "朝阳区" },
  "orders": [
    { "id": "o1", "amount": 299 },
    { "id": "o2", "amount": 599 }
  ]
}
```

**Đặc điểm chính:**
- **Không ràng buộc Schema**: không cần định nghĩa trước cấu trúc bảng, trường có thể thêm/bỏ bất cứ lúc nào
- **Cấu trúc lồng nhau**: địa chỉ, đơn hàng được lồng trực tiếp trong document, đọc một lần lấy tất cả dữ liệu
- **Mở rộng theo chiều ngang**: tự nhiên phù hợp với sharding, dễ dàng xử lý dữ liệu khổng lồ

### 2.2 Document vs Quan hệ

| Chiều so sánh | Quan hệ (MySQL) | Document (MongoDB) |
|---------------|-----------------|---------------------|
| Cấu trúc dữ liệu | Schema cố định, sửa bằng ALTER TABLE | Schema linh hoạt, thêm trường bất cứ lúc nào |
| Dữ liệu lồng nhau | Cần JOIN nhiều bảng | Lồng trực tiếp trong document |
| Quan hệ giữa các bản ghi | JOIN rất mạnh | Truy vấn quan hệ yếu hơn |
| Kịch bản phù hợp | Dữ liệu nghiệp vụ cấu trúc ổn định | Dữ liệu nội dung cấu trúc thay đổi |

### 2.3 Kịch bản điển hình

- **CMS (Quản lý nội dung)**: bài viết, bình luận, tag có cấu trúc đa dạng
- **Hồ sơ người dùng**: người dùng khác nhau có các trường thuộc tính khác nhau
- **Danh mục sản phẩm**: điện thoại có "kích thước màn hình", thực phẩm có "hạn sử dụng", trường hoàn toàn khác nhau
- **Trung tâm cấu hình**: cấu trúc cấu hình của các dịch vụ không thống nhất

::: warning ⚠️ Hiểu lầm phổ biến
"MongoDB không cần thiết kế cấu trúc dữ liệu" — Sai! Mô hình document cũng cần thiết kế nghiêm túc: cấp lồng nhau không nên quá sâu, subdocument cập nhật thường xuyên nên tách thành collection độc lập.
:::

---

## 3. Mô hình đồ thị (Graph)

### 3.1 Mô hình đồ thị là gì?

Mô hình đồ thị sử dụng **Node (Nút)** và **Edge (Cạnh)** để thể hiện thực thể và quan hệ của chúng. Mỗi nút là một thực thể, mỗi cạnh là một quan hệ, cả nút và cạnh đều có thể mang thuộc tính.

```
(张三) --[关注]--> (李四) --[关注]--> (王五)
   |                                    |
   +--------[购买]----> (iPhone) <--[购买]--+
```

### 3.2 Khả năng đỉnh cao của mô hình đồ thị: truy vấn đa bước

**Kịch bản**: tìm "bạn của bạn của bạn" trong mạng xã hội

Cách quan hệ (3 tầng JOIN):
```sql
SELECT DISTINCT f3.name
FROM friends f1
JOIN friends f2 ON f1.friend_id = f2.user_id
JOIN friends f3 ON f2.friend_id = f3.user_id
WHERE f1.user_id = 1001;
```

Cách cơ sở dữ liệu đồ thị (ngôn ngữ truy vấn Cypher):
```cypher
MATCH (me)-[:FOLLOWS*1..3]->(target)
WHERE me.name = '张三'
RETURN DISTINCT target.name
```

Trong quan hệ, mỗi bước thêm một JOIN, hiệu suất giảm theo cấp số nhân. Cơ sở dữ liệu đồ thị duyệt quan hệ trực tiếp qua con trỏ, hiệu suất truy vấn đa bước hầu như không đổi.

### 3.3 Kịch bản điển hình

- **Mạng xã hội**: gợi ý bạn bè, theo dõi chung, lan truyền ảnh hưởng
- **Biểu đồ tri thức**: suy luận quan hệ thực thể ("học trò của thầy của ai")
- **Phát hiện gian lận**: phát hiện vòng lặp tiền tệ, mạng tài khoản liên quan
- **Hệ thống gợi ý**: gợi ý dựa trên đồ thị quan hệ người dùng-sản phẩm-tag

---

## 4. Mô hình chuỗi thời gian (Time-Series)

### 4.1 Mô hình chuỗi thời gian là gì?

Mô hình chuỗi thời gian lấy **timestamp** làm trục chính, tối ưu hóa riêng cho kịch bản "ghi theo thứ tự thời gian, truy vấn theo phạm vi thời gian".

```
timestamp            device      cpu_usage   memory
2024-01-15 10:00:01  server-01   45%         12.3GB
2024-01-15 10:00:02  server-01   67%         12.5GB
2024-01-15 10:00:03  server-01   92%         14.1GB
```

### 4.2 Tại sao không dùng MySQL lưu dữ liệu chuỗi thời gian?

| Vấn đề | MySQL | CSDL chuỗi thời gian (InfluxDB) |
|---------|-------|---------------------------------|
| Tốc độ ghi | Vạn/giây | **Triệu/giây** |
| Dữ liệu lịch sử | Xóa thủ công, bảng ngày càng lớn | **Chính sách hết hạn tự động (TTL)** |
| Truy vấn tổng hợp | GROUP BY chậm | **Giảm采样 tích hợp** (5 giây → trung bình 1 phút) |
| Hiệu quả lưu trữ | Lưu trữ chung, lãng phí không gian | **Nén theo cột**, tiết kiệm 90% không gian |

### 4.3 Kịch bản điển hình

- **Giám sát máy chủ**: CPU, bộ nhớ, ổ đĩa thu thập mỗi giây
- **Cảm biến IoT**: nhiệt độ, độ ẩm, quỹ đạo GPS
- **Hành vi tài chính**: dữ liệu theo giây của giá cổ phiếu và khối lượng giao dịch
- **Phân tích log**: tổng hợp theo dòng thời gian của log ứng dụng

---

## 5. Mô hình vector

### 5.1 Mô hình vector là gì?

Mô hình vector chuyển đổi dữ liệu phi cấu trúc như văn bản, hình ảnh, âm thanh thành vector số chiều cao thông qua **mô hình Embedding**, sau đó tính khoảng cách giữa các vector để đo lường độ tương đồng ngữ nghĩa.

```
"好吃的日料" → Embedding → [0.82, 0.15, 0.91, 0.33, ...]
                                    ↓ cosine similarity
"银座寿司之神"  → [0.80, 0.18, 0.89, ...] → 96% tương đồng
"意大利披萨"    → [0.12, 0.85, 0.20, ...] → 31% tương đồng
```

### 5.2 Tìm kiếm vector vs Tìm kiếm từ khóa

| So sánh | Tìm kiếm từ khóa (LIKE / Full-text index) | Tìm kiếm vector |
|---------|--------------------------------------------|-----------------|
| Phương thức | Khớp chính xác chuỗi | Khớp theo độ tương đồng ngữ nghĩa |
| "好吃的日料" | Chỉ tìm được văn bản chứa "日料" | Có thể tìm "寿司", "刺身", "居酒屋" |
| Đa ngôn ngữ | Cần xử lý riêng | Hiểu ngữ nghĩa xuyên ngôn ngữ |
| Đa phương thức | Chỉ văn bản | Tìm kiếm thống nhất văn bản, hình ảnh, âm thanh |

### 5.3 Kịch bản điển hình

- **RAG (Retrieval-Augmented Generation)**: cung cấp đoạn kiến thức liên quan cho LLM
- **Tìm kiếm ngữ nghĩa**: hiểu ý đồ người dùng thay vì từ khóa
- **Tìm kiếm ảnh bằng ảnh**: tải lên một ảnh, tìm ảnh tương tự về mặt hình ảnh
- **Hệ thống gợi ý**: gợi ý dựa trên độ tương đồng ngữ nghĩa nội dung

::: tip 💡 Lựa chọn cơ sở dữ liệu vector
- **CSDL vector độc lập**: Pinecone, Milvus, Weaviate — chuyên tìm kiếm vector, hiệu suất tối ưu
- **Mở rộng CSDL truyền thống**: pgvector (PostgreSQL), Atlas Vector Search (MongoDB) — giảm độ phức tạp kiến trúc
- **Thư viện vector trong bộ nhớ**: FAISS, Annoy — phù hợp kịch bản quy mô nhỏ, độ trễ thấp
:::

---

## 6. Hướng dẫn quyết định: Chọn mô hình dữ liệu như thế nào?

| Dữ liệu của bạn trông như thế nào? | Mô hình đề xuất | Sản phẩm đại diện |
|--------------------------------------|----------------|-------------------|
| Cấu trúc cố định, quan hệ rõ ràng (đơn hàng, người dùng) | Quan hệ | MySQL, PostgreSQL |
| Cấu trúc linh hoạt, nhiều tầng lồng nhau (nội dung, cấu hình) | Document | MongoDB, DynamoDB |
| Quan hệ phức tạp giữa thực thể, cần duyệt đa bước | Đồ thị | Neo4j, Amazon Neptune |
| Ghi theo thứ tự thời gian, truy vấn theo phạm vi thời gian | Chuỗi thời gian | InfluxDB, TimescaleDB |
| Dữ liệu phi cấu trúc, cần tìm kiếm tương đồng ngữ nghĩa | Vector | Pinecone, Milvus, pgvector |

::: info 🎯 Lời khuyên thực chiến
Hệ thống hiện đại thường **kết hợp nhiều mô hình**:
- **Nghiệp vụ cốt lõi** dùng PostgreSQL (quan hệ)
- **Log hành vi người dùng** dùng InfluxDB (chuỗi thời gian)
- **Cơ sở tri thức AI** dùng Milvus + pgvector (vector)
- **Động cơ gợi ý** dùng Neo4j (đồ thị)

Đừng tìm kiếm "một cơ sở dữ liệu giải quyết tất cả", hãy để mỗi loại dữ liệu tìm được ngôi nhà phù hợp nhất.
:::

<DataModelsDemo />

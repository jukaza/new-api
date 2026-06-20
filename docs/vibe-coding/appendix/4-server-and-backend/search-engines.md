# Nguyên lý công cụ tìm kiếm

::: tip Lời nói đầu
**Bạn tìm kiếm "váy liền đỏ" trên Taobao, và trong 0.1 giây hệ thống đã tìm thấy kết quả phù hợp nhất từ hàng tỷ sản phẩm -- điều này được thực hiện như thế nào?** Công cụ tìm kiếm là một trong những hạ tầng cốt lõi nhất của Internet. Từ Google đến tìm kiếm nội bộ trong các trang thương mại điện tử, nguyên lý cốt lõi của chúng đều giống nhau: chỉ mục ngược (inverted index) + sắp xếp theo độ liên quan (relevance ranking).
:::

**Bài viết này sẽ giúp bạn học được gì?**

Sau khi học xong chương này, bạn sẽ đạt được:

- **Chỉ mục ngược (Inverted Index)**: hiểu cấu trúc dữ liệu cốt lõi nhất của công cụ tìm kiếm
- **Kỹ thuật phân tách từ (Tokenization)**: hiểu thách thức và các giải pháp phổ biến cho phân tách từ tiếng Trung
- **Sắp xếp theo độ liên quan**: nắm vững nguyên lý cơ bản của TF-IDF và BM25
- **Elasticsearch**: hiểu kiến trúc và tình huống sử dụng của công cụ tìm kiếm phổ biến nhất
- **Tối ưu hóa tìm kiếm**: nắm vững các tính năng tìm kiếm thực tế như từ đồng nghĩa, sửa lỗi, đánh dấu nổi bật

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Chỉ mục ngược | Chỉ mục xuôi vs Chỉ mục ngược |
| **Chương 2** | Phân tách từ và phân tích | Phân tách từ tiếng Trung, stop word, stemming |
| **Chương 3** | Sắp xếp theo độ liên quan | TF-IDF, BM25 |
| **Chương 4** | Elasticsearch | Kiến trúc phân tán, shard, replica |
| **Chương 5** | Tối ưu hóa tìm kiếm | Từ đồng nghĩa, sửa lỗi, tự động hoàn thành |

---

## 0. Toàn cảnh: bản chất của tìm kiếm là gì?

Bản chất của tìm kiếm là một bài toán **truy xuất thông tin (Information Retrieval)**: với một truy vấn cho trước, tìm ra kết quả phù hợp nhất từ khối lượng tài liệu khổng lồ, và trả về theo thứ tự độ liên quan.

Quá trình này được chia thành hai giai đoạn:

- **Giai đoạn lập chỉ mục (ngoại tuyến)**: xử lý trước tất cả tài liệu, xây dựng cấu trúc tra cứu hiệu quả
- **Giai đoạn truy vấn (trực tuyến)**: khi người dùng nhập từ khóa, nhanh chóng tìm tài liệu phù hợp và sắp xếp

::: tip Tại sao không thể dùng truy vấn LIKE trong cơ sở dữ liệu?
`SELECT * FROM products WHERE name LIKE '%váy liền đỏ%'` nghe có vẻ có thể tìm kiếm, nhưng nó cần **quét toàn bộ bảng** -- kiểm tra từng bản ghi một. Khi lượng dữ liệu đạt đến cấp triệu, loại truy vấn này sẽ chậm đến mức không thể sử dụng. Chỉ mục ngược biến thao tác O(n) này thành tra cứu O(1).
:::

---

## 1. Chỉ mục ngược: "trái tim" của công cụ tìm kiếm

Cơ sở dữ liệu truyền thống dùng **chỉ mục xuôi (forward index)**: từ ID tài liệu tìm nội dung tài liệu. Còn công cụ tìm kiếm dùng **chỉ mục ngược (inverted index)**: từ từ khóa tìm danh sách tài liệu chứa nó.

<InvertedIndexDemo />

| Loại chỉ mục | Hướng | Cách tra cứu | Tình huống áp dụng |
|---------|------|---------|---------|
| Chỉ mục xuôi | Tài liệu -> Nội dung | Biết ID, tra nội dung | Truy vấn khóa chính CSDL |
| Chỉ mục ngược | Từ khóa -> Danh sách tài liệu | Biết từ khóa, tra tài liệu | Tìm kiếm toàn văn |

::: tip Quá trình xây dựng chỉ mục ngược
1. **Thu thập tài liệu**: lấy tất cả tài liệu cần được tìm kiếm
2. **Phân tách từ (Tokenization)**: chia tài liệu thành từng từ riêng lẻ
3. **Xây dựng ánh xạ**: ghi lại mỗi từ xuất hiện trong những tài liệu nào (cùng với vị trí xuất hiện, tần suất, v.v.)
4. **Lưu trữ bền vững**: ghi chỉ mục vào đĩa, hỗ trợ tra cứu nhanh
:::

---

## 2. Phân tách từ và phân tích văn bản

Phân tách từ là bước đầu tiên của công cụ tìm kiếm, và cũng là thách thức lớn nhất của tìm kiếm tiếng Trung. Tiếng Anh phân tách tự nhiên bằng khoảng trắng, nhưng tiếng Trung không có dấu phân cách -- "乒乓球拍卖了" có thể chia thành "乒乓球/拍卖/了" hoặc "乒乓/球拍/卖/了".

| Cách phân tách từ | Mô tả | Ví dụ |
|---------|------|------|
| Phân tách chuẩn | Cắt theo khoảng trắng và dấu câu (tiếng Anh) | "hello world" -> ["hello", "world"] |
| Phân tách tiếng Trung | Cắt dựa trên từ điển hoặc mô hình | "搜索引擎" -> ["搜索", "引擎"] |
| N-gram | Cắt theo cửa sổ trượt độ dài cố định | "搜索" -> ["搜索", "索引"] |
| Từ điển tùy chỉnh | Thêm từ vựng đặc thù nghiệp vụ | "iPhone16ProMax" như một từ |

::: tip Pipeline phân tích văn bản
Phân tách từ chỉ là một bước trong phân tích văn bản, pipeline hoàn chỉnh bao gồm:
1. **Lọc ký tự**: loại bỏ thẻ HTML, ký tự đặc biệt
2. **Phân tách từ**: chia văn bản thành các từ (Token)
3. **Lọc stop word**: loại bỏ các từ tần suất cao vô nghĩa như "的", "了", "是"
4. **Mở rộng từ đồng nghĩa**: mở rộng "手机" thành "手机、电话、移动电话"
5. **Stemming**: khôi phục "running" thành "run" (tiếng Anh)
:::

---

## 3. Sắp xếp theo độ liên quan: kết quả nào "liên quan" nhất?

Tìm thấy tài liệu phù hợp mới chỉ là bước đầu, quan trọng hơn là **sắp xếp** -- đặt kết quả phù hợp nhất lên đầu.

| Thuật toán | Nguyên lý | Đặc điểm |
|------|------|------|
| TF-IDF | Tần suất từ (TF) x Tần suất tài liệu nghịch đảo (IDF) | Thuật toán kinh điển, đơn giản hiệu quả |
| BM25 | Phiên bản cải tiến của TF-IDF, thêm chuẩn hóa độ dài tài liệu | Thuật toán mặc định của Elasticsearch |
| Vector Retrieval | Chuyển tài liệu và truy vấn thành vector, tính cosine similarity | Hỗ trợ tìm kiếm ngữ nghĩa |

::: tip Hiểu trực quan TF-IDF
- **TF (Term Frequency)**: một từ xuất hiện càng nhiều lần trong tài liệu, tài liệu đó càng có khả năng liên quan đến từ đó
- **IDF (Inverse Document Frequency)**: một từ xuất hiện trong càng ít tài liệu, độ phân biệt của nó càng cao
- "的" xuất hiện trong tất cả tài liệu (IDF thấp), nên tìm kiếm "的" không có ý nghĩa
- "Elasticsearch" chỉ xuất hiện trong ít tài liệu (IDF cao), tìm kiếm nó có thể định vị chính xác
:::

---

## 4. Elasticsearch: công cụ tìm kiếm phổ biến nhất

Elasticsearch là công cụ tìm kiếm mã nguồn mở phổ biến nhất hiện nay, được xây dựng trên nền Apache Lucene, cung cấp khả năng tìm kiếm toàn văn phân tán với RESTful API.

| Khái niệm | Mô tả |
|------|------|
| Index | Tương tự "bảng" trong CSDL, lưu trữ tài liệu cùng loại |
| Document | Một bản ghi, định dạng JSON |
| Shard | Phân mảnh, chia chỉ mục ra nhiều node |
| Replica | Bản sao, cung cấp tính sẵn sàng cao và mở rộng đọc |
| Mapping | Định nghĩa kiểu trường, tương tự Schema của CSDL |
| Analyzer | Bộ phân tích văn bản, định nghĩa quy tắc phân tách từ |

::: tip ES vs Cơ sở dữ liệu
Elasticsearch không dùng để thay thế cơ sở dữ liệu, mà hoạt động như tầng tìm kiếm phối hợp với CSDL. Kiến trúc điển hình: dữ liệu ghi vào CSDL -> đồng bộ lên ES -> request tìm kiếm đi qua ES -> request chi tiết đi qua CSDL.
:::

---

## 5. Tối ưu hóa tìm kiếm: làm cho tìm kiếm "thông minh" hơn

| Biện pháp tối ưu | Mô tả | Hiệu quả |
|---------|------|------|
| Từ đồng nghĩa | "手机" cũng tìm được "电话" | Tăng độ recall |
| Sửa lỗi chính tả | "iphoen" tự động sửa thành "iphone" | Khả năng chịu lỗi |
| Tự động hoàn thành | Nhập "苹" gợi ý "苹果手机" | Nâng cao trải nghiệm |
| Đánh dấu nổi bật | Đánh dấu đỏ từ khóa phù hợp trong kết quả | Hiển thị trực quan |
| Điều chỉnh trọng số | Trọng số khớp tiêu đề > khớp nội dung | Nâng cao độ chính xác |
| Lọc và tổng hợp | Lọc theo khoảng giá, thương hiệu | Thu hẹp phạm vi |

---

## Tổng kết

Công cụ tìm kiếm là hạ tầng cốt lõi của ứng dụng Internet. Hiểu ba khái niệm cốt lõi: chỉ mục ngược, phân tách từ, sắp xếp theo độ liên quan là bạn đã nắm vững bản chất của công cụ tìm kiếm.

Ôn lại các điểm then chốt của chương:

1. **Chỉ mục ngược**: ánh xạ ngược từ từ khóa đến tài liệu, là cấu trúc dữ liệu cốt lõi của công cụ tìm kiếm
2. **Phân tách từ là nền tảng**: phân tách từ tiếng Trung là chìa khóa của chất lượng tìm kiếm, cần chọn bộ phân tách từ phù hợp
3. **Sắp xếp BM25**: chấm điểm độ liên quan dựa trên tần suất từ và tần suất tài liệu, là thuật toán mặc định của ES
4. **Kiến trúc ES**: shard + replica thực hiện phân tán và tính sẵn sàng cao
5. **Tối ưu hóa tìm kiếm**: từ đồng nghĩa, sửa lỗi, tự động hoàn thành làm cho tìm kiếm thông minh hơn

## Đọc thêm

- [Tài liệu chính thức Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html) - Tham khảo ES chuẩn xác nhất
- [Elasticsearch: The Definitive Guide](https://www.elastic.co/guide/cn/elasticsearch/guide/current/index.html) - Hướng dẫn nhập môn tiếng Trung
- [Apache Lucene](https://lucene.apache.org/) - Thư viện công cụ tìm kiếm nền tảng của ES
- [MeiliSearch](https://www.meilisearch.com/) - Công cụ tìm kiếm nhẹ, phù hợp dự án vừa và nhỏ
- [Typesense](https://typesense.org/) - Công cụ tìm kiếm tức thời mã nguồn mở
# Quản trị dữ liệu và chất lượng dữ liệu

::: tip Lời mở đầu
**Bạn đã từng gặp tình huống này chưa: số liệu trên báo cáo không khớp với nghiệp vụ thực tế, thông tin của cùng một người dùng khác nhau giữa hai hệ thống, hoặc kết quả phân tích hoàn toàn không đáng tin cậy do dữ liệu bẩn?** Quản trị dữ liệu chính là phương pháp hệ thống để giải quyết những vấn đề này. Trong thời đại "quyết định dựa trên dữ liệu", chất lượng dữ liệu quyết định trực tiếp chất lượng quyết định — rác vào, rác ra (Garbage In, Garbage Out).
:::

**Bài viết này sẽ giúp bạn học gì?**

Sau khi học xong chương này, bạn sẽ có được:

- **Các chiều chất lượng dữ liệu**: hiểu tính đầy đủ, chính xác, nhất quán và các chiều chất lượng khác
- **Hệ thống quản trị dữ liệu**: tìm hiểu về khuôn khổ quản trị từ tổ chức, quy trình đến công nghệ
- **Dòng đời dữ liệu (Data Lineage)**: nắm vững theo dõi toàn chuỗi từ nguồn đến tiêu thụ
- **Quản lý siêu dữ liệu**: hiểu tầm quan trọng của "dữ liệu mô tả dữ liệu"
- **Kiến trúc phân tầng dữ liệu**: nắm vững mô hình phân tầng kho dữ liệu ODS → DWD → DWS → ADS
- **Năng lực thực chiến**: biết cách triển khai quản trị dữ liệu trong dự án

| Chương | Nội dung | Khái niệm cốt lõi |
|---------|----------|-------------------|
| **Chương 1** | Các chiều chất lượng dữ liệu | Đầy đủ, chính xác, nhất quán, kịp thời |
| **Chương 2** | Khung quản trị dữ liệu | Tổ chức, quy trình, công nghệ, văn hóa |
| **Chương 3** | Theo dõi dòng đời dữ liệu | Phân tích tác động, xử lý sự cố, kiểm toán tuân thủ |
| **Chương 4** | Quản lý siêu dữ liệu | Siêu dữ liệu kỹ thuật, siêu dữ liệu nghiệp vụ, siêu dữ liệu vận hành |
| **Chương 5** | Kiến trúc phân tầng dữ liệu | ODS, DWD, DWS, ADS |
| **Chương 6** | Công cụ và thực hành quản trị | Great Expectations, dbt, DataHub |

---

## 0. Toàn cảnh: Tại sao cần quản trị dữ liệu?

Quản trị dữ liệu không phải là vấn đề kỹ thuật, mà là **vấn đề quản lý**. Câu hỏi cốt lõi mà nó trả lời là: **Ai chịu trách nhiệm về dữ liệu? Tiêu chuẩn của dữ liệu là gì? Làm sao đảm bảo dữ liệu liên tục đáng tin cậy?**

Hãy tưởng tượng một công ty có 100 bảng dữ liệu, mỗi bảng được duy trì bởi các đội ngũ khác nhau, không có quy ước đặt tên thống nhất, không có từ điển dữ liệu, không có kiểm tra chất lượng. Kết quả là: cùng một chỉ số "người dùng hoạt động hàng tháng", bộ phận tiếp thị tính ra 5 triệu, bộ phận sản phẩm tính ra 3 triệu — vì định nghĩa khác nhau.

::: tip Bốn trụ cột của quản trị dữ liệu
1. **Tổ chức**: xác định rõ vai trò và trách nhiệm của Data Owner và Data Steward
2. **Quy trình**: thiết lập quy trình tiêu chuẩn cho việc tiếp nhận, thay đổi và ngừng sử dụng dữ liệu
3. **Công nghệ**: triển khai các công cụ giám sát chất lượng, quản lý siêu dữ liệu, theo dõi dòng đời
4. **Văn hóa**: khiến toàn công ty đồng thuận rằng "dữ liệu là tài sản", chứ không phải "dữ liệu là sản phẩm phụ"
:::

---

## 1. Sáu chiều của chất lượng dữ liệu

Chất lượng dữ liệu không phải là một khái niệm mơ hồ, mà có thể đo lường từ sáu chiều cụ thể. Mỗi chiều đều có định nghĩa rõ ràng và phương pháp kiểm tra.

<DataQualityDemo />

| Chiều | Định nghĩa | Phương pháp kiểm tra | Vấn đề phổ biến |
|-------|------------|---------------------|-----------------|
| Đầy đủ | Dữ liệu có bị thiếu không | Kiểm tra tỷ lệ giá trị null | Trường bắt buộc trống, dữ liệu liên quan thiếu |
| Chính xác | Dữ liệu có đúng không | Kiểm tra quy tắc, đối chiếu mẫu | Số tiền âm, ngày không hợp lệ |
| Nhất quán | Dữ liệu đa nguồn có đồng nhất không | So sánh chéo hệ thống | Tên người dùng khác nhau giữa CRM và hệ thống đơn hàng |
| Kịp thời | Dữ liệu có được cập nhật đúng lúc không | Kiểm tra thời gian cập nhật | Dữ liệu tồn kho chậm, giá chưa đồng bộ |
| Duy nhất | Có bản ghi trùng lặp không | Kiểm tra trùng lặp | Cùng một người dùng đăng ký hai lần |
| Hợp lệ | Có tuân thủ quy tắc định dạng không | Kiểm tra biểu thức chính quy/phạm vi | Định dạng email sai, tuổi âm |

::: tip Quy tắc 1-10-100 của chất lượng dữ liệu
- **1 đồng**: kiểm tra tại điểm đầu vào, ngăn dữ liệu bẩn xâm nhập
- **10 đồng**: làm sạch dữ liệu bẩn hiện có trong kho dữ liệu
- **100 đồng**: tổn thất do quyết định sai vì dữ liệu bẩn

Càng sớm phát hiện và khắc phục vấn đề chất lượng dữ liệu, chi phí càng thấp.
:::

---

## 2. Khung quản trị dữ liệu: Quản lý toàn vòng đời

Quản trị dữ liệu không phải là dự án một lần, mà là quá trình liên tục xuyên suốt vòng đời của dữ liệu. Từ khi dữ liệu được tạo ra đến khi bị tiêu hủy, mỗi giai đoạn đều cần quy định và người phụ trách rõ ràng.

<DataGovernanceFrameworkDemo />

| Giai đoạn | Sản phẩm chính | Vai trò then chốt |
|-----------|----------------|-------------------|
| Xác định tiêu chuẩn | Từ điển dữ liệu, quy ước đặt tên, tiêu chuẩn phân loại | Kiến trúc sư dữ liệu |
| Thu thập và tiếp nhận | Quy chuẩn tiếp nhận, quy tắc kiểm tra, ghi nhận dòng đời | Kỹ sư dữ liệu |
| Lưu trữ và quản lý | Mô hình phân tầng, ma trận phân quyền, chính sách vòng đời | DBA / Kỹ sư nền tảng |
| Sử dụng và tiêu thụ | Danh mục dữ liệu, quy tắc ẩn danh, báo cáo chất lượng | Phân tích dữ liệu / Đơn vị nghiệp vụ |
| Lưu trữ và tiêu hủy | Chính sách lưu trữ, nhật ký xóa, nhật ký kiểm toán | Đội bảo mật và tuân thủ |

## 2. Khung quản trị dữ liệu

Quản trị dữ liệu không thể giải quyết chỉ bằng cách mua một công cụ, nó cần một khuôn khổ hoàn chỉnh để hỗ trợ. Khuôn khổ tham chiếu phổ biến nhất trong ngành là DAMA-DMBOK (Hệ thống kiến thức quản lý dữ liệu).

| Lĩnh vực quản trị | Nội dung cốt lõi | Sản phẩm chính |
|-------------------|-----------------|----------------|
| Kiến trúc dữ liệu | Định nghĩa mô hình dữ liệu, luồng dữ liệu, chiến lược lưu trữ | Sơ đồ kiến trúc dữ liệu, sơ đồ ER |
| Tiêu chuẩn dữ liệu | Quy ước đặt tên thống nhất, quy ước mã hóa, định nghĩa chỉ số | Từ điển dữ liệu, thư viện chỉ số |
| Chất lượng dữ liệu | Xây dựng quy tắc chất lượng, cảnh báo giám sát, quy trình khắc phục | Báo cáo chất lượng, bảng điều khiển SLA |
| Bảo mật dữ liệu | Phân loại theo cấp, kiểm soát truy cập, ẩn danh và mã hóa | Chính sách bảo mật, nhật ký kiểm toán |
| Quản lý dữ liệu chủ | Thống nhất "bản ghi vàng" của các thực thể cốt lõi như khách hàng, sản phẩm | Trung tâm dữ liệu chủ |
| Vòng đời dữ liệu | Quản lý toàn bộ quá trình từ tạo đến lưu trữ đến tiêu hủy | Chính sách lưu giữ, quy tắc lưu trữ |

::: tip Mô hình độ trưởng thành của quản trị dữ liệu
- **Cấp 1 - Khởi đầu**: không có tiêu chuẩn thống nhất, các đội tự làm theo cách của mình
- **Cấp 2 - Lặp lại được**: có tài liệu quy chuẩn cơ bản, nhưng thực hiện không nhất quán
- **Cấp 3 - Đã xác định**: có quy trình và công cụ quản trị thống nhất, phần lớn các đội tuân thủ
- **Cấp 4 - Đã quản lý**: có chỉ số chất lượng định lượng và giám sát tự động
- **Cấp 5 - Tối ưu**: cải tiến liên tục, quản trị dữ liệu tích hợp vào quy trình phát triển hàng ngày
:::

---

## 3. Dòng đời dữ liệu: Từ đâu đến, đi đến đâu

Dòng đời dữ liệu (Data Lineage) ghi lại đường dẫn chuyển đổi hoàn chỉnh của dữ liệu từ nguồn đến tiêu thụ cuối cùng. Nó giống như "gia phả" của dữ liệu, giúp bạn truy nguồn gốc và đích đến của bất kỳ dữ liệu nào.

<DataLineageDemo />

Dòng đời dữ liệu có ba ứng dụng cốt lõi trong công việc thực tế:

| Kịch bản | Vấn đề | Dòng đời giúp thế nào |
|----------|--------|----------------------|
| Phân tích tác động | Muốn sửa trường trong bảng người dùng, báo cáo downstream nào bị ảnh hưởng? | Theo dõi tất cả phụ thuộc theo hướng xuống |
| Xác định nguyên nhân gốc | Báo cáo GMV hôm nay có dữ liệu bất thường, vấn đề ở bước nào? | Truy vết từng khâu theo hướng lên |
| Kiểm toán tuân thủ | Số điện thoại người dùng đã qua những hệ thống nào? Đã ẩn danh tất cả chưa? | Theo dõi toàn bộ luồng của trường nhạy cảm |

::: tip Hai phương pháp thu thập dòng đời
- **Thu thập chủ động**: phân tích câu lệnh SQL, cấu hình ETL, tự động trích xuất quan hệ dòng đời cấp bảng/trường
- **Thu thập bị động**: chặn kế hoạch thực thi của công cụ truy vấn (như Hive, Spark) qua Hook, ghi nhận dòng đời theo thời gian thực

Các công cụ phổ biến như Apache Atlas, DataHub, OpenLineage đều hỗ trợ thu thập dòng đời tự động.
:::

---

## 4. Quản lý siêu dữ liệu: "Dữ liệu mô tả dữ liệu"

Siêu dữ liệu (Metadata) là dữ liệu về dữ liệu. Nếu dữ liệu là nội dung của một cuốn sách, thì siêu dữ liệu là mục lục, tác giả, ngày xuất bản, số ISBN của cuốn sách đó. Không có siêu dữ liệu, dữ liệu chỉ là những con số và chuỗi ký tự không thể hiểu được.

| Loại siêu dữ liệu | Mô tả | Ví dụ |
|-------------------|-------|-------|
| Siêu dữ liệu kỹ thuật | Thông tin lưu trữ vật lý của dữ liệu | Tên bảng, loại trường, phương pháp phân vùng, vị trí lưu trữ |
| Siêu dữ liệu nghiệp vụ | Ý nghĩa nghiệp vụ của dữ liệu | Tên tiếng Trung của trường, định nghĩa nghiệp vụ, tiêu chuẩn tính toán |
| Siêu dữ liệu vận hành | Trạng thái vận hành của dữ liệu | Thời gian thực thi ETL, lượng dữ liệu, tần suất cập nhật |

::: tip Tầm quan trọng của từ điển dữ liệu
Từ điển dữ liệu là sản phẩm cơ bản nhất của quản lý siêu dữ liệu. Một từ điển dữ liệu tốt nên bao gồm:
- **Tên trường**: tên tiếng Anh và tên tiếng Trung
- **Kiểu dữ liệu**: VARCHAR(50), INT, DATETIME, v.v.
- **Định nghĩa nghiệp vụ**: Trường này đại diện cho cái gì? Tính toán như thế nào?
- **Phạm vi giá trị**: Giá trị hợp lệ là gì? Có cho phép giá trị null không?
- **Người phụ trách**: Ai duy trì trường này? Gặp vấn đề thì tìm ai?

Không có từ điển dữ liệu, nhân viên mới có thể mất một tuần để hiểu ý nghĩa của một bảng; có từ điển dữ liệu, chỉ cần 10 phút.
:::

---

## 5. Kiến trúc phân tầng dữ liệu: ODS → DWD → DWS → ADS

Kho dữ liệu không phải là đổ tất cả dữ liệu vào chung một chỗ, mà tổ chức lưu trữ theo **mức độ xử lý** thành từng lớp. Mỗi lớp có trách nhiệm rõ ràng, lớp trên phụ thuộc lớp dưới, dần dần tinh chế từ dữ liệu thô thành dữ liệu có thể sử dụng cho nghiệp vụ.

| Tầng | Tên đầy đủ | Trách nhiệm | Đặc điểm dữ liệu |
|------|------------|-------------|------------------|
| ODS | Tầng dữ liệu vận hành | Đồng hồ nguyên văn cơ sở dữ liệu nghiệp vụ | Nguyên bản nhất, chưa xử lý |
| DWD | Tầng dữ liệu chi tiết | Làm sạch, chuẩn hóa, loại trùng | Bản ghi chi tiết sạch |
| DWS | Tầng dữ liệu tổng hợp | Tổng hợp theo chủ đề (ngày/tuần/tháng) | Chỉ số tổng hợp được tính trước |
| ADS | Tầng dữ liệu ứng dụng | Hướng tới báo cáo/giao diện cụ thể | Dữ liệu kết quả sử dụng trực tiếp |

::: tip Tại sao phải phân tầng?
- **Tái sử dụng**: tầng DWD làm sạch một lần, tất cả tầng trên chia sẻ, tránh làm sạch lặp lại
- **Giải耦合**: thay đổi cấu trúc bảng cơ sở dữ liệu nghiệp vụ chỉ ảnh hưởng tầng ODS, không lan đến báo cáo
- **Hiệu suất**: tầng DWS tổng hợp trước, truy vấn báo cáo đọc trực tiếp, không cần tính toán thời gian thực
- **Có thể truy vết**: mỗi tầng đều được giữ lại, khi có vấn đề có thể kiểm tra từng tầng
:::

---

## 6. Công cụ và thực hành quản trị

| Công cụ | Định vị | Năng lực cốt lõi | Kịch bản sử dụng |
|---------|---------|------------------|-----------------|
| Great Expectations | Chất lượng dữ liệu | Quy tắc kiểm tra khai báo, tự động tạo báo cáo chất lượng | Pipeline dữ liệu Python |
| dbt | Chuyển đổi dữ liệu | Phát triển mô hình SQL, kiểm thử tích hợp và tạo tài liệu | Mô hình hóa kho dữ liệu |
| DataHub | Quản lý siêu dữ liệu | Danh mục dữ liệu, theo dõi dòng đời, khám phá dữ liệu | Quản trị dữ liệu doanh nghiệp |
| Apache Atlas | Quản lý siêu dữ liệu | Theo dõi dòng đời hệ sinh thái Hadoop | Nền tảng Big Data |
| OpenMetadata | Quản lý siêu dữ liệu | Danh mục dữ liệu mã nguồn mở, hỗ trợ nhiều nguồn dữ liệu | Đội ngũ vừa và nhỏ |
| Amundsen | Khám phá dữ liệu | Nền tảng khám phá dữ liệu dựa trên tìm kiếm | Dân chủ hóa dữ liệu |

::: tip Lộ trình quản trị từ con số không
Nếu đội của bạn chưa có quản trị dữ liệu, hãy tiến hành theo thứ tự sau:
1. **Xây từ điển dữ liệu trước**: ghi lại các bảng hiện có và ý nghĩa của các trường (dù bằng Excel cũng được)
2. **Thêm kiểm tra chất lượng**: đưa kiểm tra null và phạm vi cơ bản vào các pipeline dữ liệu quan trọng
3. **Thống nhất định nghĩa chỉ số**: chuẩn hóa cách tính các chỉ số cốt lõi như "DAU", "MAU", "GMV"
4. **Giới thiệu công cụ**: khi chi phí quản lý thủ công quá cao, đưa DataHub hoặc dbt vào
5. **Thiết lập quy trình**: thay đổi dữ liệu cần được xem xét, vấn đề chất lượng cần có SLA và cảnh báo
:::

---

## Tổng kết

Quản trị dữ liệu là công trình hệ thống biến dữ liệu từ "dùng được" thành "tốt, đáng tin cậy, có thể truy vết". Nó không phải dự án một lần mà là quá trình vận hành liên tục.

Ôn lại các điểm chính của chương này:

1. **Sáu chiều chất lượng**: đầy đủ, chính xác, nhất quán, kịp thời, duy nhất, hợp lệ
2. **Bốn trụ cột quản trị**: tổ chức, quy trình, công nghệ, văn hóa - không thể thiếu cái nào
3. **Dòng đời dữ liệu**: truy vết nguồn gốc và đích đến của dữ liệu, hỗ trợ phân tích tác động và xử lý sự cố
4. **Quản lý siêu dữ liệu**: từ điển dữ liệu là sản phẩm quản trị cơ bản và quan trọng nhất
5. **Kiến trúc phân tầng**: ODS → DWD → DWS → ADS, tinh chế giá trị dữ liệu từng lớp
6. **Triển khai từng bước**: bắt đầu từ từ điển dữ liệu, dần dần đưa vào công cụ và quy trình

## Đọc thêm

- [DAMA-DMBOK](https://www.dama.org/cpages/body-of-knowledge) - Hệ thống kiến thức quản lý dữ liệu, "kinh thánh" của quản trị dữ liệu
- [DataHub](https://datahubproject.io/) - Nền tảng quản lý siêu dữ liệu mã nguồn mở của LinkedIn
- [Great Expectations](https://greatexpectations.io/) - Framework chất lượng dữ liệu Python
- [dbt](https://www.getdbt.com/) - Công cụ chuyển đổi dữ liệu, tích hợp kiểm thử và tài liệu
- [Apache Atlas](https://atlas.apache.org/) - Framework quản trị siêu dữ liệu hệ sinh thái Hadoop
- [The Data Warehouse Toolkit](https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/books/) - Kinh điển mô hình hóa kho dữ liệu của Kimball

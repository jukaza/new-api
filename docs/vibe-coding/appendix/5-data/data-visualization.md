# Trực quan hóa Dữ liệu và Bảng điều khiển

::: tip Lời nói đầu
**Một biểu đồ tốt đáng giá ngàn dòng dữ liệu.** Trực quan hóa dữ liệu là việc chuyển đổi những con số trừu tượng thành biểu đạt trực quan sinh động, giúp con người có thể hiểu câu chuyện đằng sau dữ liệu chỉ trong vài giây. Từ biểu đồ Excel đến màn hình giám sát Grafana, trực quan hóa có mặt ở khắp nơi.
:::

**Bài viết này sẽ giúp bạn học được gì?**

Sau khi học xong chương này, bạn sẽ đạt được:

- **Lựa chọn biểu đồ**: Chọn loại biểu đồ phù hợp nhất dựa trên mục đích dữ liệu
- **Nguyên tắc trực quan hóa**: Nắm vững các nguyên tắc thiết kế cốt lõi của trực quan hóa dữ liệu
- **Thiết kế bảng điều khiển**: Hiểu các mẫu bố cục của các loại bảng điều khiển khác nhau
- **Hệ sinh thái công cụ**: Quen thuộc với định vị và lựa chọn các công cụ trực quan hóa phổ biến
- **Bẫy phổ biến**: Tránh các biểu đồ gây hiểu lầm và các lỗi trực quan hóa thường gặp

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Lựa chọn loại biểu đồ | So sánh, xu hướng, tỷ trọng, phân bố, quan hệ |
| **Chương 2** | Nguyên tắc thiết kế trực quan hóa | Tỷ lệ mực dữ liệu, tính nhất quán, khả năng đọc |
| **Chương 3** | Bố cục bảng điều khiển | Tổng quan, so sánh, phân tích chuyên sâu, thời gian thực |
| **Chương 4** | Lựa chọn công cụ | ECharts, D3, Grafana, Metabase |
| **Chương 5** | Bẫy phổ biến | Cắt đứt trục tọa độ, biểu đồ tròn 3D, lạm dụng màu sắc |

---

## 0. Toàn cảnh: Tại sao cần trực quan hóa?

Não bộ con người xử lý thông tin trực quan nhanh hơn nhiều so với văn bản. Một biểu đồ đường có thể giúp bạn nhanh chóng nhận thấy "doanh thu tháng trước đang giảm", trong khi cùng một thông tin nếu được trình bày dưới dạng bảng, bạn có thể cần so sánh từng dòng mới có thể kết luận.

Giá trị cốt lõi của trực quan hóa:

- **Phát hiện mẫu**: Xu hướng, chu kỳ, giá trị ngoại lai hiển hiện rõ ràng trong biểu đồ
- **Hỗ trợ ra quyết định**: Giúp người không chuyên kỹ thuật cũng có thể hiểu dữ liệu, tham gia ra quyết định
- **Hiệu quả giao tiếp**: Một hình ảnh đáng giá ngàn lời nói, giảm thiểu sự mơ hồ trong việc diễn giải dữ liệu

::: tip Trực quan hóa ≠ Đẹp mắt
Mục tiêu của trực quan hóa là **truyền đạt thông tin**, không phải phô diễn kỹ thuật. Một biểu đồ cột giản dị nhưng chính xác, có giá trị hơn nhiều so với một biểu đồ 3D hào nhoáng nhưng khó hiểu.
:::

---

## 1. Lựa chọn loại biểu đồ: Dùng đúng biểu đồ kể đúng câu chuyện

Bước đầu tiên để chọn biểu đồ không phải là "tôi thích biểu đồ nào", mà là "tôi muốn truyền đạt thông tin gì". Các mục đích dữ liệu khác nhau tương ứng với các loại biểu đồ tối ưu khác nhau.

<ChartTypeSelectorDemo />

### Bảng tra cứu nhanh lựa chọn biểu đồ

| Mục đích dữ liệu | Biểu đồ đề xuất | Không đề xuất | Lý do |
|---------|---------|--------|------|
| So sánh độ lớn | Biểu đồ cột, biểu đồ thanh | Biểu đồ tròn | Mắt người nhạy cảm với sự khác biệt về chiều dài hơn là góc độ |
| Thể hiện xu hướng | Biểu đồ đường, biểu đồ diện tích | Biểu đồ cột | Tính liên tục của đường ngụ ý tính liên tục của thời gian |
| Thể hiện tỷ trọng | Biểu đồ tròn (≤5 loại), biểu đồ cột chồng | Biểu đồ tròn 3D | Phối cảnh 3D làm biến dạng tỷ lệ diện tích |
| Thể hiện phân bố | Biểu đồ tần suất, biểu đồ hộp | Biểu đồ đường | Phân bố cần xem tần suất, không phải xu hướng |
| Thể hiện quan hệ | Biểu đồ phân tán, biểu đồ bong bóng | Biểu đồ cột | Quan hệ giữa hai biến liên tục cần không gian hai chiều |

::: tip Một quy tắc quyết định đơn giản
- **Một biến** → Biểu đồ tần suất (phân bố) hoặc thẻ số (KPI)
- **Hai biến** → Biểu đồ đường (thời gian vs giá trị số) hoặc biểu đồ phân tán (giá trị vs giá trị)
- **Nhiều danh mục** → Biểu đồ cột (so sánh) hoặc biểu đồ tròn (tỷ trọng, ≤5 loại)
- **Đa chiều** → Biểu đồ radar hoặc biểu đồ tọa độ song song
:::

---

## 2. Nguyên tắc thiết kế trực quan hóa: Để dữ liệu tự nói lên câu chuyện

Trực quan hóa tốt không phải là "đẹp mắt", mà là "dễ hiểu". Một số nguyên tắc kinh điển mà Edward Tufte đề xuất trong cuốn "The Visual Display of Quantitative Information" vẫn là tài liệu tham khảo quan trọng cho thiết kế trực quan hóa cho đến tận ngày nay.

| Nguyên tắc | Mô tả | Ví dụ phản diện |
|------|------|---------|
| Tỷ lệ mực dữ liệu | Tỷ lệ "mực" dùng để hiển thị dữ liệu trong biểu đồ nên cao nhất có thể | Quá nhiều đường lưới, yếu tố trang trí |
| Tối thiểu hóa yếu tố phi dữ liệu | Loại bỏ các yếu tố trực quan không truyền đạt thông tin | Hiệu ứng 3D, đổ bóng, nền gradient |
| Tỷ lệ nhất quán | Trục tọa độ bắt đầu từ 0, vạch chia đều; nếu cắt đứt trục tọa độ phải ghi chú rõ ràng | Trục Y bắt đầu từ 95 nhưng không giải thích |
| Sử dụng màu sắc hợp lý | Dùng màu sắc để mã hóa thông tin, không phải trang trí | Màu cầu vồng biểu diễn dữ liệu có thứ tự |
| Ghi chú rõ ràng | Tiêu đề, nhãn trục, chú thích, đơn vị không thể thiếu | Không có đơn vị, không có phạm vi thời gian |

### 2.1 Tỷ lệ mực dữ liệu（Data-Ink Ratio）

> Tỷ lệ "mực" dùng để thể hiện dữ liệu trong biểu đồ trên tổng "mực" nên cao nhất có thể.

Nói đơn giản: **Xóa bỏ mọi yếu tố không truyền đạt thông tin**.

| Nên xóa bỏ | Nên giữ lại |
|-----------|-----------|
| Hiệu ứng 3D, đổ bóng, gradient | Điểm dữ liệu, nhãn trục tọa độ |
| Đường lưới thừa | Đường tham chiếu quan trọng (như giá trị mục tiêu) |
| Biểu tượng trang trí | Chú thích (khi có nhiều chuỗi dữ liệu) |
| Màu nền hào nhoáng | Tiêu đề và đơn vị rõ ràng |

### 2.2 Nguyên tắc nhất quán

- **Màu sắc nhất quán**: Cùng một chiều dữ liệu sử dụng cùng một màu trong các biểu đồ khác nhau, ví dụ "doanh thu" luôn dùng màu xanh dương
- **Tỷ lệ nhất quán**: Trục tọa độ nên bắt đầu từ 0, trừ khi có lý do chính đáng và ghi chú rõ ràng
- **Thời gian nhất quán**: Khoảng cách trên trục thời gian nên đều nhau, không vẽ các mốc thời gian không cách đều thành cách đều

### 2.3 Nguyên tắc khả năng đọc

- **Tiêu đề phải nói lên kết luận**: Không phải "Doanh thu hàng tháng", mà là "Doanh thu giảm liên tiếp 3 tháng"
- **Ghi chú các điểm quan trọng**: Thêm ghi chú tại các giá trị ngoại lai, điểm uốn, hướng sự chú ý của người đọc
- **Kiểm soát mật độ thông tin**: Một biểu đồ truyền đạt 1-2 thông tin cốt lõi, không nên nhồi nhét quá nhiều

::: tip Ba quy tắc sử dụng màu sắc
1. **Cùng một chỉ số dùng cùng một màu**: Doanh thu trong tất cả biểu đồ đều dùng màu xanh dương, không lúc xanh lúc xanh lá
2. **Dữ liệu có thứ tự dùng màu gradient**: Nhiệt độ từ thấp đến cao dùng gradient xanh dương→đỏ, không dùng màu rời rạc
3. **Cân đề xuất thân thiện với người mù màu**: Khoảng 8% nam giới bị mù màu xanh đỏ, tránh chỉ dùng xanh đỏ để phân biệt thông tin quan trọng
:::

---

## 3. Bố cục bảng điều khiển: Khác cảnh, khác mẫu

Bảng điều khiển（Dashboard）là sự kết hợp hữu cơ của nhiều biểu đồ. Một bảng điều khiển tốt không phải là việc chất đầy các biểu đồ lại với nhau, mà là chọn mẫu bố cục phù hợp dựa trên ngữ cảnh sử dụng.

<DashboardLayoutDemo />

### Bốn mẫu bố cục phổ biến

| Mẫu bố cục | Cấu trúc cốt lõi | Phù hợp với | Yêu cầu thiết kế |
|---------|---------|---------|---------|
| Tổng quan toàn cục | Thẻ KPI + Biểu đồ xu hướng + Bảng chi tiết | Báo cáo ngày quản lý, bảng điều khiển vận hành | Chỉ số cốt lõi đặt lên trên cùng, nhìn thấy ngay các con số quan trọng |
| Phân tích so sánh | Bố cục đối xứng trái phải | Thử nghiệm A/B, phân tích so sánh | Giữ nhất quán chiều so sánh, làm nổi bật sự khác biệt |
| Phân tích chuyên sâu | Mở rộng từng tầng từ tổng hợp đến chi tiết | Phân tích bán hàng, phân tích hành vi người dùng | Hỗ trợ tương tác nhấp, đi sâu từng tầng |
| Giám sát thời gian thực | Số lớn + Đường cong thời gian thực + Trạng thái cảnh báo | Màn hình sự kiện quy mô lớn, giám sát máy chủ | Tự động làm mới, nền tối, phù hợp chiếu màn hình lớn |

### 5 nguyên tắc thiết kế bảng điều khiển

1. **Hỏi trước "Ai đang xem"**: CEO xem chỉ số chiến lược, vận hành xem chỉ số quy trình, kỹ sư xem chỉ số kỹ thuật
2. **Quy tắc 5 giây**: Người dùng nên hiểu được thông tin cốt lõi của bảng điều khiển trong vòng 5 giây
3. **Phân tầng thông tin**: Quan trọng nhất đặt ở góc trên bên trái, thứ yếu đặt ở dưới
4. **Giảm cuộn trang**: Hiển thị nội dung cốt lõi trên một màn hình, tránh người dùng phải cuộn để xem dữ liệu quan trọng
5. **Chừa khoảng trắng**: Không lấp đầy mọi không gian, chừa khoảng trắng thích hợp giúp thị giác thoải mái hơn

::: tip Bảng điều khiển vs Báo cáo
- **Bảng điều khiển**: Thời gian thực/gần thời gian thực, tương tác, hướng đến giám sát và ra quyết định nhanh
- **Báo cáo**: Tạo định kỳ (ngày/tuần/tháng), tĩnh, hướng đến phân tích chi tiết và lưu trữ

Cả hai không phải mối quan hệ thay thế, mà là bổ sung cho nhau. Bảng điều khiển phát hiện vấn đề, báo cáo phân tích chuyên sâu.
:::

---

## 4. Lựa chọn công cụ: Từ thư viện code đến nền tảng BI

Công cụ trực quan hóa có thể được chia thành ba cấp: thư viện biểu đồ cấp code, thư viện biểu đồ phân tích dữ liệu, nền tảng BI. Việc chọn công cụ nào phụ thuộc vào độ phức tạp yêu cầu, yêu cầu tương tác và năng lực kỹ thuật của đội ngũ.

### 4.1 Thư viện biểu đồ cấp code

| Công cụ | Ngôn ngữ/Nền tảng | Đặc điểm | Phù hợp với |
|------|----------|------|---------|
| ECharts | JavaScript | Sẵn sàng sử dụng, loại biểu đồ phong phú, tài liệu tiếng Trung hoàn thiện | Biểu đồ nhúng trong hệ thống doanh nghiệp |
| D3.js | JavaScript | Linh hoạt cấp thấp, có thể tùy chỉnh mọi hiệu ứng trực quan hóa | Trực quan hóa dữ liệu tùy chỉnh cao độ |
| Chart.js | JavaScript | Nhẹ, đơn giản, dễ tiếp cận | Nhu cầu biểu đồ đơn giản |
| Matplotlib | Python | Thư viện tiêu chuẩn tính toán khoa học, biểu đồ tĩnh | Phân tích dữ liệu, biểu đồ luận văn |
| Plotly | Python/JS | Biểu đồ tương tác, hỗ trợ 3D | Khám phá dữ liệu, Jupyter Notebook |

### 4.2 Nền tảng BI（Không code/Ít code）

| Công cụ | Định vị | Lợi thế cốt lõi | Phù hợp với đội ngũ |
|------|------|---------|---------|
| Grafana | Trực quan hóa giám sát | Hỗ trợ dữ liệu chuỗi thời gian tốt, tích hợp cảnh báo | Đội ngũ Vận hành/SRE |
| Metabase | BI nhẹ | Mã nguồn mở miễn phí, chỉ cần SQL để tạo biểu đồ | Xây dựng nhanh cho đội ngũ vừa và nhỏ |
| Apache Superset | BI doanh nghiệp | Mã nguồn mở, hỗ trợ nguồn dữ liệu lớn | Công ty có đội ngũ dữ liệu |
| Tableau | BI thương mại | Thao tác kéo thả, hiệu ứng trực quan hóa tốt | Nhà phân tích doanh nghiệp |
| Power BI | BI thương mại | Tích hợp tốt với hệ sinh thái Microsoft | Doanh nghiệp sử dụng công nghệ Microsoft |

::: tip Đề xuất lựa chọn
- **Nhà phát triển làm biểu đồ nhúng sản phẩm** → ECharts（Hệ sinh thái tiếng Trung tốt）hoặc Chart.js（Kịch bản đơn giản）
- **Nhà phân tích dữ liệu làm phân tích khám phá** → Plotly + Jupyter hoặc Metabase
- **Màn hình giám sát vận hành** → Grafana（Tiêu chuẩn thực tế）
- **Đội ngũ doanh nghiệp tự phân tích** → Metabase（Mã nguồn mở）hoặc Tableau（Thương mại）
- **Cần tùy chỉnh cao độ** → D3.js（Đường cong học tập dốc, nhưng khả năng tạo hình cao nhất）
:::

---

## 5. Bẫy phổ biến: Những biểu đồ này đang lừa bạn

Trực quan hóa dữ liệu là con dao hai lưỡi: dùng tốt có thể tiết lộ sự thật, dùng không tốt sẽ tạo ra ảo giác. Dưới đây là những bẫy trực quan hóa phổ biến nhất, mỗi người làm dữ liệu đều nên có khả năng nhận diện.

### 5.1 Cắt đứt trục tọa độ

Thay đổi điểm bắt đầu của trục Y từ 0 thành một số lớn sẽ làm cho sự khác biệt nhỏ trông giống như sự thay đổi khổng lồ.

| Kịch bản | Sự khác biệt thực tế | Cảm nhận thị giác |
|------|---------|---------|
| Trục Y bắt đầu từ 0 | Sản phẩm A 98 điểm, Sản phẩm B 95 điểm | Khoảng cách rất nhỏ |
| Trục Y bắt đầu từ 90 | Cùng dữ liệu | A trông như gấp nhiều lần B |

**Khi nào có thể cắt đứt?** Khi giá trị tuyệt đối của dữ liệu rất lớn nhưng thay đổi rất nhỏ (như giá cổ phiếu từ 100 lên 105), việc cắt đứt là hợp lý, nhưng phải ghi chú rõ ràng.

### 5.2 Bẫi phối cảnh của biểu đồ tròn 3D

Phối cảnh 3D làm cho các phần gần người quan sát trông lớn hơn. Một phần 25% dưới góc nhìn 3D có thể trông giống như 35%.

**Giải pháp**: Không bao giờ dùng biểu đồ tròn 3D. Dùng biểu đồ tròn thông thường hoặc biểu đồ vòng, hoặc đơn giản là dùng biểu đồ cột.

### 5.3 Lạm dụng màu sắc

| Cách làm sai | Cách làm đúng |
|---------|---------|
| Dùng xanh đỏ để biểu diễn dữ liệu | Dùng các phối màu an toàn cho người mù màu như xanh dương cam |
| Mỗi danh mục dùng màu khác nhau | Cùng một chuỗi dùng các sắc độ khác nhau của cùng một màu |
| Dùng màu mã hóa dữ liệu liên tục nhưng không thêm chú thích | Luôn cung cấp chú thích màu và ghi chú giá trị |
| Độ tương phản giữa màu nền và màu dữ liệu không đủ | Đảm bảo độ tương phản cấp WCAG AA |

### 5.4 Các lỗi phổ biến khác

| Bẫy | Vấn đề | Khắc phục |
|------|------|------|
| Trục Y kép | Hai chỉ số không liên quan chia sẻ trục X, ngụ ý quan hệ nhân quả | Tách thành hai biểu đồ, hoặc giải thích rõ không có quan hệ nhân quả |
| Hiểu lầm về diện tích | Dùng bán kính hình tròn thay vì diện tích để biểu diễn giá trị | Khi giá trị nhân đôi thì diện tích nhân đôi, không phải bán kính |
| Trục thời gian không đều | Khoảng cách giữa tháng 1, tháng 3, tháng 12 giống nhau | Sắp xếp theo tỷ lệ thời gian thực tế |
| Quá nhiều danh mục | Biểu đồ tròn có 15 phần | Trên 5 danh mục thì dùng biểu đồ cột hoặc gộp "Khác" |

::: tip Quy tắc đạo đức của trực quan hóa
Mục đích của trực quan hóa là **giúp hiểu**, không phải **thao túng nhận thức**. Mỗi khi làm biểu đồ, hãy tự hỏi:

- Nếu tôi là người đọc, biểu đồ này có khiến tôi rút ra kết luận sai không?
- Tôi có đang che giấu dữ liệu bất lợi không?
- Trục tọa độ, tỷ lệ, màu sắc có trình bày dữ liệu một cách công bằng không?
:::

---

## Tóm tắt

Trực quan hóa dữ liệu là "dặm cuối" trong việc truyền đạt giá trị dữ liệu. Phân tích tốt đến đâu, nếu không thể được hiểu đúng, thì cũng như không có phân tích.

Nhìn lại các điểm chính của chương này:

1. **Chọn đúng biểu đồ**: Chọn loại biểu đồ dựa trên mục đích dữ liệu（so sánh, xu hướng, tỷ trọng, phân bố, quan hệ）
2. **Nguyên tắc thiết kế**: Tỷ lệ mực dữ liệu cao, tính nhất quán, khả năng đọc là ba nguyên tắc cốt lõi
3. **Bố cục bảng điều khiển**: Bốn mẫu tổng quan, so sánh, phân tích chuyên sâu, thời gian thực bao phủ hầu hết các kịch bản
4. **Lựa chọn công cụ**: Từ ECharts đến Grafana, chọn dựa trên năng lực đội ngũ và độ phức tạp yêu cầu
5. **Tránh bẫy**: Cắt đứt trục tọa độ, biểu đồ tròn 3D, lạm dụng màu sắc là những thủ thuật gây hiểu lầm phổ biến nhất

## Đọc thêm

- [The Visual Display of Quantitative Information](https://www.edwardtufte.com/tufte/books_vdqi) - Kinh điển trực quan hóa của Edward Tufte
- [Tài liệu chính thức ECharts](https://echarts.apache.org/zh/index.html) - Thư viện biểu đồ tiếng Trung phổ biến nhất
- [D3.js](https://d3js.org/) - Thư viện trực quan hóa cấp thấp mạnh mẽ
- [Grafana](https://grafana.com/) - Tiêu chuẩn thực tế cho trực quan hóa giám sát
- [From Data to Viz](https://www.data-to-viz.com/) - Cây quyết định lựa chọn loại biểu đồ
- [ColorBrewer](https://colorbrewer2.org/) - Công cụ phối màu an toàn cho người mù màu

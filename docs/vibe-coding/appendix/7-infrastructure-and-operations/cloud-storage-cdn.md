# Lưu trữ đối tượng & CDN
> 💡 **Hướng dẫn học tập**: Bài viết này sẽ dẫn bạn đi qua một chuỗi hoàn chỉnh — từ tải tệp lên cho đến khi người dùng tải xuống. Bạn sẽ thấy cách lưu trữ đối tượng hoạt động như một "nhà kho thông minh" để quản lý lượng lớn tệp tin, cách CDN như một "mạng lưới điểm giao hàng" đưa nội dung đến tận cửa người dùng, và những "cạm bẫy" nào đang chờ bạn trên đường đi. Bạn nên nắm được kiến thức cơ bản về HTTP request và nguyên lý phân giải DNS trước khi đọc.

Trước khi bắt đầu, bạn nên ôn lại một vài "viên gạch nền tảng":

- **Quy trình HTTP Request**: Bạn có thể đọc [Điều gì xảy ra sau khi nhập URL vào trình duyệt](./web-basics/url-to-browser.md) để hiểu chuỗi request hoàn chỉnh.
- **Nguyên lý phân giải DNS**: Nếu bạn chưa quen với phân giải tên miền, hãy xem phần minh họa trong [Quy trình truy vấn DNS](./deployment/dns-flow.md).

---

## 0. Lời mở đầu: Tại sao tải tệp lên và tải xuống lại "chậm" như vậy?

Hãy tưởng tượng tình huống này: Bạn tải lên một bức ảnh HD 10MB trong một cộng đồng nhiếp ảnh, nhưng phải mất nửa phút mới xong; trong khi bạn của bạn ở Bắc Kinh chỉ mất 2 giây để tải xuống. Tại sao cùng một tệp, trải nghiệm tải lên và tải xuống lại khác biệt đến vậy?

Hoặc thử nghĩ xem: Trang web thương mại điện tử của bạn đang chạy chương trình khuyến mãi 11/11, trang chi tiết sản phẩm đột ngột đón nhận hàng triệu lượt truy cập, và máy chủ của bạn "sập" ngay lập tức. Có phải do băng thông không đủ? Hay là vấn đề về thiết kế kiến trúc?

Câu trả lời cho những vấn đề này đều nằm trong bộ đôi "vàng" — **Lưu trữ đối tượng** và **CDN**.

---

## 1. Lưu trữ đối tượng: "Nhà kho thông minh trên đám mây" của bạn

### 1.1 Lưu trữ đối tượng là gì?

Hệ thống tệp truyền thống giống như tủ quần áo nhà bạn: quần áo được phân theo "áo/quần/váy", muốn tìm một cái áo sơ mi, bạn phải mở tủ → khu vực áo → ngăn áo sơ mi. Mô hình "phân cấp lồng nhau" này trở nên cực kỳ cồng kềnh khi số lượng tệp tăng vọt.

Lưu trữ đối tượng thì giống như kho vận hậu cần hiện đại: mỗi gói hàng có một "mã vận đơn" duy nhất (object key), bạn chỉ cần báo mã, robot trong kho sẽ lấy chính xác gói hàng từ hàng triệu gói hàng khác.

<ObjectStorageDemo />

**So sánh điểm khác biệt cốt lõi**:

| Khía cạnh              | Hệ thống tệp truyền thống   | Lưu trữ đối tượng              |
| :--------------------- | :-------------------------- | :----------------------------- |
| **Cách tổ chức**       | Cây thư mục phân cấp        | Cặp key-value phẳng            |
| **Giao thức truy cập** | POSIX (thao tác tệp cục bộ) | HTTP/REST API                  |
| **Khả năng mở rộng**   | Giới hạn dung lượng máy đơn | Gần như không giới hạn theo chiều ngang |
| **Metadata**           | Thuộc tính cơ bản (kích thước, thời gian) | Metadata tùy chỉnh phong phú  |
| **Tình huống điển hình** | Tài liệu văn phòng cục bộ | Ảnh/Video/Sao lưu/Tài nguyên tĩnh |

### 1.2 Khái niệm cốt lõi của lưu trữ đối tượng

#### Bucket: "Phân khu kho hàng" của bạn

Bucket là container cấp cao nhất của lưu trữ đối tượng, tương đương với một không gian tên (namespace) độc lập. Tất cả các object đều phải được lưu trong một bucket nào đó.

**Quy tắc đặt tên** (lấy Alibaba Cloud OSS làm ví dụ):

- Duy nhất toàn cầu: Không được trùng lặp giữa tất cả người dùng trong toàn bộ nhà cung cấp đám mây
- Chỉ được chứa chữ cái thường, số và dấu gạch ngang
- Phải bắt đầu và kết thúc bằng chữ cái thường hoặc số
- Độ dài từ 3-63 ký tự

**Bài học thực tế**: Từng có một nhóm tạo ra vài chục bucket theo từng tuyến kinh doanh, kết quả là cuối tháng nhận hóa đơn mà choáng váng — mỗi bucket đều có chi phí lưu trữ tối thiểu và chi phí request. Gợi ý: Lập kế hoạch bucket theo tổ hợp "môi trường + mục đích", ví dụ như `prod-static-assets`, `dev-backup-archive`.

#### Object: "Gói dữ liệu" của bạn

Object là đơn vị cơ bản của lưu trữ, bao gồm ba phần:

1. **Key**: Định danh duy nhất của object, tương đương "mã vận đơn"
   - Ví dụ: `images/avatar/2024/user123.jpg`
   - Dù trông giống đường dẫn, nhưng bản chất chỉ là một chuỗi

2. **Data**: Nội dung thực tế của object
   - Có thể là bất kỳ dữ liệu nhị phân nào
   - Giới hạn kích thước phụ thuộc vào nhà cung cấp đám mây (thường trong khoảng 5TB mỗi object)

3. **Metadata**: Thông tin bổ sung mô tả object
   - System metadata: Content-Type, ETag, Last-Modified, v.v.
   - Custom metadata: như `x-oss-meta-owner`, `x-oss-meta-project`

#### Kiểm soát truy cập: Ai có thể động vào "kho hàng" của tôi?

Lưu trữ đối tượng cung cấp kiểm soát quyền đa tầng:

| Tầng            | Phương thức kiểm soát           | Tình huống điển hình                       |
| :-------------- | :------------------------------ | :----------------------------------------- |
| **Cấp Bucket**  | Bucket Policy (Chính sách tài nguyên) | Chặn tất cả truy cập mạng ngoài, chỉ cho phép IP cụ thể |
| **Cấp Object**  | ACL (Access Control List)       | Ảnh công khai, tài liệu riêng tư           |
| **Ủy quyền tạm**| STS (Security Token Service)    | Tải lên trực tiếp từ frontend, tải lên từ di động |

**Ranh giới an toàn**: Tuyệt đối không bao giờ viết AccessKey ID và AccessKey Secret vào mã nguồn frontend! Cách làm đúng: Frontend yêu cầu backend cấp chứng chỉ STS tạm thời, backend xác minh danh tính rồi trả về chứng chỉ tạm thời có thời hạn.

---

## 2. CDN: "Mạng lưới chuyển phát toàn cầu" của bạn

### 2.1 Tại sao cần CDN?

Hãy tưởng tượng bạn mở một cửa hàng trực tuyến, máy chủ đặt ở Thâm Quyến. Bây giờ có một người dùng ở Bắc Kinh truy cập ảnh của bạn:

- **Không có CDN**: Request đi từ Bắc Kinh → Hà Bắc → Hà Nam → Hồ Bắc → Hồ Nam → Quảng Đông → Thâm Quyến, vượt qua hơn 2000 km, khứ hồi là hơn 4000 km. Chỉ riêng độ trễ mạng đã mất vài chục mili giây, gặp tắc nghẽn mạng còn tệ hơn.

- **Có CDN**: Request đi từ Bắc Kinh trực tiếp đến node CDN Bắc Kinh (có thể ngay trong phòng máy China Unicom Bắc Kinh), khoảng cách từ 2000 km giảm còn 20 km, độ trễ từ 50ms giảm còn 5ms.

Đây chính là giá trị cốt lõi của CDN: **Đưa nội dung đến gần người dùng hơn**.

<CdnAccelerationDemo />

### 2.2 Kiến trúc cốt lõi của CDN

#### Node biên (Edge Node): "Trạm giao hàng" gần người dùng nhất

Node biên là tầng gần người dùng nhất trong mạng CDN, thường được triển khai tại:

- Phòng máy nhà mạng (China Unicom / China Telecom / China Mobile)
- Trung tâm trao đổi Internet tại các thành phố lớn
- Đầu mối giao thông quan trọng

**Phân bố node CDN chính tại Trung Quốc**:

- Thành phố hạng nhất: Bắc Kinh, Thượng Hải, Quảng Châu, Thâm Quyến
- Thành phố hạng hai: Hàng Châu, Nam Kinh, Thành Đô, Vũ Hán, Tây An
- Nước ngoài: Hồng Kông, Singapore, Tokyo, Silicon Valley, Frankfurt

<EdgeNodeDistributionDemo />

#### Origin Server: "Kho tổng" của nội dung

Origin server là nơi CDN truy xuất nội dung khi cần, có thể là:

- Lưu trữ đối tượng (OSS/COS/S3)
- Máy chủ tự dựng (ECS/Máy chủ vật lý)
- Cân bằng tải (SLB/CLB)

**Cấu hình quan trọng**:

- **Origin HOST**: Tên miền/IP mà node CDN sử dụng khi truy cập origin server
- **Giao thức truy xuất nguồn**: HTTP hay HTTPS
- **Cổng truy xuất nguồn**: 80, 443 hay cổng tùy chỉnh

#### Node tầng trung gian: "Trung tâm phân phối khu vực"

Giữa node biên và origin server, CDN thường có một hoặc nhiều tầng node trung gian:

- **Node tổng hợp**: Tập hợp request truy xuất nguồn từ nhiều node biên, giảm áp lực lên origin server
- **Trung tâm khu vực**: Chịu trách nhiệm phân phối và điều phối nội dung cho một khu vực lớn

Lợi ích của kiến trúc phân tầng này:

1. **Giảm áp lực origin**: 1000 request từ node biên, có thể chỉ cần gửi 10 request đến origin
2. **Tăng tỉ lệ hit**: Nội dung phổ biến bị chặn lại ở tầng trung gian, không cần truy xuất nguồn
3. **Cách ly sự cố**: Khi một liên kết gặp sự cố, có thể tự động chuyển sang đường dẫn khác

### 2.3 Quy trình tăng tốc CDN hoàn chỉnh

Hãy cùng theo dõi một request thực tế của người dùng:

<CachePolicyDemo />

**Bước 1: Phân giải DNS** (Điều phối thông minh)

```
Người dùng nhập: cdn.example.com/image.jpg
↓
Máy chủ DNS trả về: IP node CDN China Unicom Bắc Kinh (1.2.3.4)
```

Điểm mấu chốt ở đây là **DNS thông minh**: Dựa trên nhà mạng, vị trí địa lý, tải của node để trả về IP node CDN tối ưu.

**Bước 2: Tra cứu node biên** (Cache hit?)

```
Request đến node CDN China Unicom Bắc Kinh (1.2.3.4)
↓
Node kiểm tra cache cục bộ:
├─ Hit? Trả về nội dung ngay ✓
└─ Miss? Tiếp tục bước tiếp theo
```

**Bước 3: Truy xuất nguồn** (Lần lượt lên trên)

```
Node biên miss cache
↓
Yêu cầu từ node cha (ví dụ: Trung tâm khu vực Hoa Bắc)
├─ Node cha hit? Trả về nội dung
└─ Node cha miss? Tiếp tục lên trên
    ↓
    Yêu cầu từ origin server
    ↓
    Origin server trả về nội dung
```

**Bước 4: Cache và trả về** (Lần sau nhanh hơn)

```
Nội dung được trả về dọc theo chuỗi liên kết
↓
Mỗi tầng node đều cache một bản
↓
Cuối cùng đến tay người dùng
```

Như vậy, lần sau khi có người dùng yêu cầu cùng một tệp, nó có thể được trả về trực tiếp từ node biên, đạt được tốc độ "mở trong tích tắc".

---

## 3. Từ tải lên đến truy cập: Phân tích chuỗi hoàn chỉnh

### 3.1 Ba phương thức tải tệp lên

<UploadProcessDemo />

#### Cách 1: Client → Server → Lưu trữ đối tượng (Mô hình truyền thống)

```
Trình duyệt → Máy chủ backend của bạn → Lưu trữ đối tượng
```

**Quy trình**:

1. Người dùng chọn tệp, nhấp tải lên
2. Tệp được tải lên máy chủ backend của bạn trước
3. Backend nhận toàn bộ tệp, rồi chuyển tiếp tải lên lưu trữ đối tượng
4. Trả về kết quả tải lên cho người dùng

**Ưu điểm**:

- Triển khai đơn giản, cả frontend lẫn backend đều dễ kiểm soát
- Có thể kiểm tra tệp, chuyển đổi định dạng ở backend
- Các thao tác nhạy cảm có thể ghi log, kiểm tra quyền

**Nhược điểm**:

- **Băng thông nhân đôi**: Tải lên của người dùng chiếm một lần băng thông, máy chủ chuyển tiếp lại chiếm một lần nữa
- **Máy chủ chịu áp lực lớn**: Tệp lớn chiếm nhiều RAM và CPU
- **Tải lên chậm**: Tương đương với thêm một bước trung chuyển, thời gian tải lên người dùng cảm nhận được lâu hơn

**Tình huống phù hợp**: Tệp nhỏ (<10MB), cần backend xử lý (như nén ảnh, thêm watermark), hệ thống quản lý nội bộ.

#### Cách 2: Client tải trực tiếp lên lưu trữ đối tượng (Khuyến nghị hiện đại)

```
Trình duyệt ──────→ Lưu trữ đối tượng
        ↑
        Backend chỉ cấp chứng chỉ tạm thời
```

**Quy trình**:

1. Người dùng chọn tệp, frontend xin "chứng chỉ tải lên" từ backend trước
2. Backend xác minh danh tính người dùng, yêu cầu **chứng chỉ STS tạm thời** (có thời hạn) từ dịch vụ lưu trữ đối tượng
3. Backend trả chứng chỉ tạm thời cho frontend
4. Frontend cầm chứng chỉ, **tải tệp trực tiếp lên lưu trữ đối tượng**
5. Lưu trữ đối tượng trả về kết quả tải lên, frontend thông báo cho backend "tải lên hoàn tất"

**Ưu điểm**:

- **Tải lên nhanh**: Bỏ qua bước trung chuyển, tốc độ người dùng cảm nhận là nhanh nhất
- **Máy chủ nhẹ**: Chỉ xử lý cấp chứng chỉ, không xử lý luồng tệp
- **Tiết kiệm băng thông**: Chỉ tốn một lần lưu lượng tải lên
- **Tính bảo mật cao**: Chứng chỉ tạm thời có thời hạn, bị lộ cũng hạn chế thiệt hại

**Nhược điểm**:

- Triển khai hơi phức tạp, cần hiểu STS, cơ chế chữ ký
- Frontend cần xử lý logic upload phân mảnh, truyền tải tiếp điểm
- Cần cấu hình cross-origin (CORS)

**Tình huống phù hợp**: Tải tệp lớn, nội dung do người dùng tạo (UGC), nghiệp vụ cần tải lên đồng thời cao.

#### Cách 3: Upload phân mảnh + Truyền tải tiếp điểm (Bắt buộc cho tệp lớn)

```
Tệp video 10GB
↓
Cắt thành 1000 mảnh 10MB
↓
Tải lên song song (đồng thời 5 mảnh)
↓
Mất mạng! Đã tải được 600 mảnh
↓
Khôi phục mạng, tiếp tục từ mảnh thứ 601
↓
Tất cả mảnh tải xong, gửi yêu cầu "hợp nhất"
```

**Tại sao cần chia mảnh?**

| Tình huống         | Không chia mảnh                       | Có chia mảnh                      |
| :----------------- | :------------------------------------ | :-------------------------------- |
| **Biến động mạng** | Tải 99% rồi mất mạng, tải lại từ đầu  | Chỉ tải lại mảnh thất bại         |
| **Tốc độ tải lên** | Đơn luồng, tốc độ chậm                | Đa luồng song song, tốc độ nhanh  |
| **Dùng RAM**       | Cần cache toàn bộ tệp                 | Chỉ cần cache mảnh hiện tại       |
| **Hiển thị tiến độ**| Chỉ có 0% và 100%                    | Chính xác đến từng mảnh           |

**Thông số chia mảnh của các nhà cung cấp đám mây chính**:

| Nhà cung cấp        | Giới hạn kích thước mảnh | Số mảnh tối đa | Kích thước mảnh tối thiểu |
| :------------------ | :----------------------- | :------------- | :------------------------ |
| **Alibaba Cloud OSS** | 100MB                   | 10000          | 100KB                     |
| **Tencent Cloud COS** | 5GB                     | 10000          | 1MB                       |
| **AWS S3**           | 5GB                      | 10000          | 5MB (khuyến nghị)         |
| **Qiniu Cloud**      | 100MB                    | 10000          | 4MB                       |

### 3.2 Chiến lược truy xuất nguồn CDN chi tiết

<CachePolicyDemo />

#### "Truy xuất nguồn" là gì?

Node biên CDN cache nội dung từ origin server, nhưng khi:

- Nội dung người dùng yêu cầu **được truy cập lần đầu tiên**
- Nội dung cache **đã hết hạn (TTL hết hạn)**
- Cache bị **làm mới/làm nóng thủ công**

Node CDN cần yêu cầu nội dung mới nhất từ **origin server**, quá trình này được gọi là "truy xuất nguồn" (back-to-origin).

#### Ba mô hình truy xuất nguồn

| Mô hình                          | Nguyên lý                         | Tình huống phù hợp              | Ưu/Nhược điểm                           |
| :------------------------------- | :-------------------------------- | :------------------------------ | :-------------------------------------- |
| **Truy xuất nguồn trực tiếp**    | Node CDN → Origin                | Origin có IP công cộng, lưu lượng không lớn | Đơn giản trực tiếp, nhưng origin chịu áp lực lớn |
| **Truy xuất nguồn qua tầng trung gian** | Node CDN → Tầng trung gian → Origin | Website lớn, kiến trúc cache đa tầng | Chia sẻ áp lực origin, kiến trúc phức tạp |
| **OSS/COS làm origin**           | Node CDN → Lưu trữ đối tượng     | Tài nguyên tĩnh, ảnh, video     | Best practice, chi phí thấp, hiệu năng tốt |

#### Thực hành cấu hình truy xuất nguồn

**Tình huống 1: Lưu trữ đối tượng làm origin (khuyến nghị)**

```
Người dùng truy cập: cdn.example.com/images/photo.jpg
                    ↓
            Node biên CDN (Bắc Kinh)
                    ↓
            Miss cache, truy xuất nguồn
                    ↓
            Origin: bucket-name.oss-cn-beijing.aliyuncs.com
                    ↓
            Trả về ảnh, CDN cache và phản hồi người dùng
```

Các mục cấu hình chính:

- **Loại origin**: Tên miền OSS/COS hoặc origin tùy chỉnh
- **Giao thức truy xuất nguồn**: HTTP hay HTTPS (khuyến nghị HTTPS)
- **Origin HOST**: Host header sử dụng khi truy cập origin
- **Origin SNI**: Server Name Indication khi truy xuất nguồn qua HTTPS

**Tình huống 2: Cân bằng tải đa origin**

Khi một origin không chịu nổi áp lực truy xuất nguồn, có thể cấu hình nhiều origin:

```
Node biên CDN
    ├─ Origin A (trọng số 50%)
    ├─ Origin B (trọng số 30%)
    └─ Origin C (trọng số 20%)
```

Chế độ chính-dự phòng:

```
Node biên CDN
    ├─ Origin chính A (toàn bộ lưu lượng khi khỏe)
    └─ Origin dự phòng B (chuyển sang khi origin chính lỗi)
```

#### Băng thông truy xuất nguồn vs Băng thông CDN

Đây là một khái niệm dễ nhầm lẫn:

| Chỉ số                       | Định nghĩa                            | Quan hệ tính phí                          |
| :--------------------------- | :------------------------------------ | :---------------------------------------- |
| **Băng thông xuống CDN**     | Lưu lượng từ node CDN đến người dùng  | Thường tính phí CDN theo lưu lượng        |
| **Băng thông truy xuất nguồn** | Lưu lượng từ origin đến node CDN    | Thường là phí lưu lượng ra của lưu trữ đối tượng hoặc origin |

**Mẹo tiết kiệm chi phí**:

- Tăng tỉ lệ hit CDN (để nhiều request hit cache hơn, giảm truy xuất nguồn)
- Đặt thời gian cache (TTL) hợp lý
- Sử dụng tính năng làm nóng (preheat), cache nội dung hot trước khi người dùng truy cập
- Bật "theo dõi 301/302", tránh chuyển hướng truy xuất nguồn không cần thiết

### 3.3 Cấu hình chiến lược cache

<CachePolicyDemo />

#### Cache Key: Quyết định thế nào là "cùng một tệp"

Làm thế nào CDN xác định hai request có nên trả về cùng một bản cache? Dựa vào **cache key**.

**Cache key mặc định thường bao gồm**:

- Đường dẫn URL (không bao gồm query parameter)
- Ví dụ: `/images/photo.jpg`

**Tình huống vấn đề**:

```
Người dùng A yêu cầu: /images/photo.jpg?w=100&h=100  (thumbnail 100x100)
Người dùng B yêu cầu: /images/photo.jpg?w=800&h=600  (ảnh lớn 800x600)
```

Nếu cache key chỉ chứa đường dẫn, hai ảnh kích thước khác nhau sẽ bị coi là cùng một tệp, gây ra hỗn loạn.

**Giải pháp: Quy tắc cache key tùy chỉnh**

| Quy tắc                          | Ví dụ                       | Hiệu quả                                  |
| :------------------------------- | :-------------------------- | :---------------------------------------- |
| **Giữ lại query parameter chỉ định** | Giữ lại `w`, `h`          | Các kích thước khác nhau được cache riêng |
| **Giữ lại tất cả query parameter**  | Giữ lại toàn bộ            | Khớp chính xác hoàn toàn                  |
| **Bỏ qua query parameter cụ thể**   | Bỏ qua `token`, `timestamp` | URL có timestamp vẫn hit được cache       |
| **Bao gồm request header**          | Bao gồm `Accept-Language`  | Các ngôn ngữ khác nhau trả về nội dung khác |

**Ví dụ cấu hình thực tế** (Alibaba Cloud CDN):

```
Quy tắc cache key:
- Đường dẫn URL: /images/*
- Giữ lại query parameter: w, h, format
- Bỏ qua query parameter: token, timestamp, utm_source
```

#### TTL (Thời gian cache): Cân bằng "độ tươi" của nội dung

TTL (Time To Live) quyết định nội dung được cache trên node CDN trong bao lâu. Đặt quá ngắn, truy xuất nguồn nhiều, chi phí cao; đặt quá dài, sau khi cập nhật nội dung người dùng vẫn thấy nội dung cũ.

**Gợi ý đặt TTL theo loại tệp**:

| Loại tệp      | TTL khuyến nghị                     | Lý do                                     |
| :------------ | :---------------------------------- | :---------------------------------------- |
| Trang HTML    | 0-5 phút                            | Nội dung cập nhật thường xuyên, cần thời gian thực |
| Tệp JS/CSS   | 1 năm (kết hợp hash tên tệp)        | Nội dung không đổi, tên tệp đổi là cache hết hiệu lực |
| Ảnh/Video    | 7-30 ngày                           | Tần suất cập nhật thấp, có thể cache dài hạn |
| Tệp font     | 1 năm                               | Hầu như không thay đổi                    |
| API Response | 0-5 phút (tùy nghiệp vụ)            | Yêu cầu tính thời gian thực của dữ liệu cao |

**Best practice frontend engineering kết hợp CDN**:

```javascript
// Cấu hình webpack/vite
output: {
  filename: 'js/[name]-[contenthash:8].js',
  chunkFilename: 'js/[name]-[contenthash:8].chunk.js',
}
```

Tên tệp được tạo: `app-a3f2b1c9.js`

- Nội dung tệp thay đổi → hash thay đổi → URL mới → cache tự nhiên hết hiệu lực
- Nội dung tệp không đổi → hash không đổi → URL không đổi → cache dài hạn hit

#### Làm mới cache và Làm nóng cache

**Làm mới thủ công (Purge) - Tình huống khẩn cấp**:

Khi bạn cập nhật nội dung trên origin, nhưng cache CDN chưa hết hạn, người dùng vẫn thấy nội dung cũ:

| Loại làm mới        | Hiệu quả                              | Thời gian     | Tình huống phù hợp   |
| :------------------ | :------------------------------------ | :------------ | :------------------- |
| **URL Purge**       | Cache của URL chỉ định bị vô hiệu     | 5-10 phút     | Cập nhật tệp đơn lẻ  |
| **Directory Purge** | Tất cả nội dung trong thư mục bị vô hiệu | 10-30 phút  | Cập nhật hàng loạt   |
| **Purge toàn site** | Toàn bộ cache của tên miền bị vô hiệu | Trên 30 phút  | Rollback khẩn cấp    |

**Lưu ý quan trọng**: Làm mới chỉ khiến cache vô hiệu, request tiếp theo sẽ truy xuất nguồn lấy nội dung mới. Đừng làm mới hàng loạt vào giờ cao điểm, nếu không origin có thể bị "đánh sập".

**Làm nóng (Preheat) - Tối ưu chủ động**:

Làm mới là bị động (nội dung đã cập nhật), làm nóng là chủ động (cache trước).

```
Tình huống: 10 giờ sáng mai sẽ đăng một bài viết hot

Tối nay gửi yêu cầu làm nóng:
- URL: https://cdn.example.com/articles/bai-viet-hot.html
- Phạm vi làm nóng: Tất cả node biên toàn quốc

Hiệu quả:
10 giờ sáng mai khi người dùng truy cập, nội dung đã sẵn sàng trên node biên
→ Không độ trễ truy xuất nguồn, trải nghiệm mở trong tích tắc
```

---

## 4. Điều phối lưu lượng: Để người dùng truy cập node "gần nhất"

<TrafficSchedulingDemo />

### 4.1 Điều phối DNS thông minh

Phân giải DNS truyền thống:

```
Người dùng hỏi: IP của cdn.example.com là gì?
DNS trả lời: 1.2.3.4 (cố định)
```

Phân giải DNS thông minh:

```
Người dùng (China Unicom Bắc Kinh) hỏi: IP của cdn.example.com là gì?
DNS thông minh: Để xem... Node CDN China Unicom Bắc Kinh là 1.2.3.4

Người dùng (China Telecom Thượng Hải) hỏi: IP của cdn.example.com là gì?
DNS thông minh: Node CDN China Telecom Thượng Hải là 5.6.7.8
```

**Các chiều điều phối**:
| Chiều             | Mô tả                              | Hiệu quả                             |
| :---------------- | :--------------------------------- | :----------------------------------- |
| **Vị trí địa lý** | Phân theo tỉnh/thành phố/quốc gia  | Truy cập gần, giảm độ trễ           |
| **Nhà mạng**      | Unicom/Telecom/Mobile/BGP          | Truyền tải cùng nhà mạng, tránh xuyên mạng |
| **Tải node**      | CPU/Băng thông/QPS thời gian thực   | Tránh node quá tải                   |
| **Sức khỏe node** | Thăm dò khả dụng                   | Tự động loại bỏ node lỗi            |
| **Yếu tố chi phí**| Chênh lệch đơn giá băng thông      | Cân bằng hiệu năng và chi phí        |

### 4.2 HTTP DNS và IP Direct Connection

DNS truyền thống có một vấn đề: **DNS hijacking và độ trễ phân giải**.

**Giải pháp HTTP DNS**:

```
Client → Bỏ qua DNS hệ thống → Hỏi trực tiếp dịch vụ HTTP DNS (như 223.5.5.5:80)
         ↓
    Trả về danh sách IP tối ưu (có trọng số)
         ↓
    Client dựa trên thăm dò chất lượng mạng, chọn IP tối ưu
```

Ưu điểm:

- Chống hijacking: Không đi qua DNS nhà mạng
- Chính xác hơn: Có thể chọn IP theo chất lượng mạng của client
- Thời gian thực: Chuyển đổi dự phòng nhanh hơn

**Gợi ý thực hành**:

- APP di động rất nên tích hợp HTTP DNS
- Web có thể sử dụng điều phối CNAME do CDN cung cấp
- Nghiệp vụ quan trọng có thể làm đa IP dự phòng (một tên miền trả về nhiều IP)

---

## 5. Tối ưu HTTPS: Cân bằng giữa bảo mật và hiệu năng

<HttpsOptimizationDemo />

### 5.1 Tại sao HTTPS trên CDN lại quan trọng?

**So sánh tình huống**:

```
Không có HTTPS:
Người dùng truy cập http://cdn.example.com/image.jpg
↓
Thanh địa chỉ trình duyệt hiển thị "Không an toàn"
↓
Một số trình duyệt/APP chặn truy cập trực tiếp
↓
Thứ hạng SEO giảm
```

```
Có HTTPS:
Người dùng truy cập https://cdn.example.com/image.jpg
↓
Trình duyệt hiển thị biểu tượng khóa xanh
↓
HTTP/2 multiplexing có hiệu lực
↓
Hiệu năng + Bảo mật cùng tăng
```

### 5.2 Điểm cấu hình HTTPS CDN quan trọng

#### Quản lý chứng chỉ

| Giải pháp                      | Mô tả                          | Chi phí             | Tình huống phù hợp         |
| :----------------------------- | :----------------------------- | :------------------ | :------------------------- |
| **Chứng chỉ miễn phí nhà cung cấp đám mây** | Alibaba Cloud/Tencent Cloud cung cấp | Miễn phí        | Tên miền đơn, bắt đầu nhanh |
| **Let's Encrypt**              | Chứng chỉ miễn phí cộng đồng   | Miễn phí            | Triển khai tự động         |
| **Chứng chỉ thương mại DV/OV/EV** | Symantec, GeoTrust, v.v.    | Vài trăm - vài vạn NDT/năm | Cấp doanh nghiệp, cần thanh xanh |
| **Chứng chỉ Wildcard**         | \*.example.com                 | Vài nghìn NDT/năm   | Nhiều tên miền con         |

**Gợi ý thực hành**:

- Môi trường test: Let's Encrypt hoặc chứng chỉ miễn phí của nhà cung cấp đám mây
- Môi trường production: Chứng chỉ wildcard (tiện lợi) hoặc chứng chỉ OV tên miền đơn (tiết kiệm)
- Chú ý thời hạn chứng chỉ, đặt nhắc nhở tự động gia hạn

#### Cấu hình tối ưu HTTPS

**Lựa chọn phiên bản TLS**:

```
Cấu hình khuyến nghị: Chỉ TLS 1.2 và TLS 1.3
Cấu hình tương thích: TLS 1.1 + TLS 1.2 + TLS 1.3 (tương thích trình duyệt cũ)
```

**Cipher Suite**:

```
Khuyến nghị: Trao đổi khóa ECDHE + Mã hóa AES-GCM
Vô hiệu hóa: DES, RC4, MD5, SHA1
```

**OCSP Stapling**:

```
Chức năng: Node CDN lấy trước trạng thái thu hồi chứng chỉ
Hiệu quả: Giảm thời gian xác minh của client 200-500ms
Gợi ý: Nhất định phải bật
```

**TLS Session Resumption**:

```
Session ID Resumption: Client mang Session ID lần trước, server khôi phục phiên
Session Ticket Resumption: Server mã hóa trạng thái phiên gửi cho client, lần sau mang lại
Hiệu quả: Tránh bắt tay TLS đầy đủ, giảm 1-RTT
```

### 5.3 Ứng dụng HTTP/2 và HTTP/3 trên CDN

**HTTP/2 Multiplexing**:

```
HTTP/1.1:
Request 1 (index.html) ────────────────→
Response 1 ←──────────────────────────────
Request 2 (style.css) ─────────────────→
Response 2 ←──────────────────────────────
Request 3 (script.js) ─────────────────→
Response 3 ←──────────────────────────────
(Tuần tự, xong cái này mới đến cái kia)

HTTP/2:
Request 1 ──→
Request 2 ──→   Gộp trên một kết nối TCP, truyền frame xen kẽ
Request 3 ──→
Response 1 ←──   Trả về theo luồng ưu tiên
Response 2 ←──
Response 3 ←──
(Song song, một kết nối đa luồng)
```

**HTTP/2 Server Push**:

```
Tình huống: Người dùng yêu cầu index.html, bên trong tham chiếu style.css và script.js

Cách truyền thống:
1. Người dùng tải index.html
2. Phân tích phát hiện cần style.css và script.js
3. Gửi thêm hai request để lấy

HTTP/2 Push:
1. Người dùng yêu cầu index.html
2. Node CDN trả về index.html đồng thời chủ động đẩy style.css và script.js
3. Người dùng phân tích html, tài nguyên đã có sẵn trong cache

Lưu ý: Push phải thận trọng, đẩy nhiều lãng phí băng thông, đẩy ít không hiệu quả
```

**HTTP/3 (QUIC)**:

```
Vấn đề của HTTP/2: Dựa trên TCP, head-of-line blocking
→ Một gói TCP bị mất, toàn bộ kết nối chờ truyền lại

Giải pháp của HTTP/3: Dựa trên QUIC (truyền tải tin cậy trên UDP)
→ Mỗi luồng độc lập, một luồng bị chặn không ảnh hưởng đến luồng khác
→ Connection Migration: WiFi chuyển sang 4G, kết nối không bị gián đoạn
→ 0-RTT Handshake: Lần đầu truy cập cũng có thể nhanh chóng thiết lập kết nối

Hiện trạng: Năm 2024 các CDN chính đã hỗ trợ HTTP/3, khuyến nghị bật
```

---

## 6. Phân tích truy cập: Hiểu báo cáo CDN của bạn

<AccessAnalyticsDemo />

### 6.1 Giải thích chỉ số cốt lõi

#### Băng thông (Bandwidth)

```
Định nghĩa: Lượng dữ liệu truyền tải trong một đơn vị thời gian
Đơn vị: bps (bit/giây), Mbps, Gbps

Băng thông CDN = Tổng lưu lượng ra của tất cả node biên

Lưu ý phân biệt:
- Băng thông tính phí: Thường tính theo đỉnh 95 hoặc đỉnh ngày
- Băng thông thực tế: Tốc độ truyền tải thời gian thực
```

**Mối quan hệ giữa băng thông và lưu lượng**:

```
1 Mbps băng thông chạy liên tục 1 giờ = 450 MB lưu lượng
(Tính: 1.000.000 bps × 3600s ÷ 8 ÷ 1024 ÷ 1024 ≈ 429 MB)
```

#### QPS (Queries Per Second)

```
Định nghĩa: Số query/request mỗi giây

CDN QPS = Tổng số HTTP request được xử lý mỗi giây bởi tất cả node biên

Lưu ý: QPS cao không có nghĩa là băng thông cao
- Tình huống tệp nhỏ: QPS rất cao, băng thông không cao
- Tình huống tệp lớn: QPS không cao, băng thông rất cao
```

#### Tỉ lệ hit (Hit Ratio)

```
Định nghĩa: Tỉ lệ request hit tại node biên CDN trên tổng số request

Công thức tính:
Tỉ lệ hit = (Số lần hit / Tổng số request) × 100%
hoặc
Tỉ lệ hit = (1 - Lưu lượng truy xuất nguồn / Tổng lưu lượng ra) × 100%

Tiêu chuẩn ngành:
- Ảnh/Video/JS/CSS: > 95%
- Trang HTML: 50-80% (tùy tần suất cập nhật)
- API: Thường không cache hoặc rất thấp
```

**Nguyên nhân phổ biến khiến tỉ lệ hit thấp**:

| Nguyên nhân             | Hiện tượng                   | Giải pháp                       |
| :---------------------- | :--------------------------- | :------------------------------ |
| TTL quá ngắn            | TTL chỉ vài phút             | Điều chỉnh TTL theo loại tệp     |
| Query parameter thay đổi | URL có số ngẫu nhiên        | Cấu hình bỏ qua tham số cụ thể   |
| Cache key không hợp lý   | Phân biệt những thứ không nên | Tối ưu quy tắc cache key       |
| Nội dung cập nhật thường xuyên | Tệp thường xuyên bị ghi đè | Dùng version number hoặc hash tên tệp |
| Nhiều lượt truy cập đầu  | Nội dung mới hoặc node mới   | Làm nóng trước (preheat)        |

### 6.2 Phân tích log và xử lý sự cố

#### Phân tích trường log CDN

Log truy cập CDN điển hình chứa các trường sau:

```
Thời gian | Client IP | Phương thức | URL | Mã trạng thái HTTP | Kích thước phản hồi | Trạng thái cache | Thời gian phản hồi | Referer | User-Agent

Ví dụ:
2024-01-15 14:32:01 | 114.114.114.114 | GET | https://cdn.example.com/images/photo.jpg | 200 | 153600 | HIT | 23 | https://example.com/ | Mozilla/5.0...
```

Giải thích các trường chính:

| Trường           | Mô tả              | Giá trị phân tích                                     |
| :--------------- | :----------------- | :---------------------------------------------------- |
| `cache_status`   | Trạng thái cache   | HIT (hit), MISS (miss), EXPIRED (hết hạn)            |
| `response_time`  | Thời gian phản hồi (ms) | Đánh giá trải nghiệm người dùng, >500ms cần tối ưu |
| `http_status`    | Mã trạng thái HTTP | Xử lý lỗi 404/500                                     |
| `bytes_sent`     | Số byte đã gửi     | Thống kê băng thông                                   |

#### Xử lý sự cố thường gặp

**Vấn đề 1: Người dùng phản ánh truy cập chậm**

Các bước xử lý:

```
1. Xem log response_time
   - Nếu rất lớn (>500ms): Kiểm tra là cache MISS hay origin chậm

2. Kiểm tra cache_status
   - HIT: Cache hit, chậm có thể do tệp quá lớn hoặc vấn đề node
   - MISS: Chưa hit, cần tối ưu chiến lược cache hoặc tỉ lệ hit

3. Kiểm tra phân bố Client IP
   - Một số khu vực chậm: Có thể node đó tải cao hoặc phủ sóng không đủ
```

**Vấn đề 2: Cache không có hiệu lực, lần nào cũng truy xuất nguồn**

Checklist xử lý:

```
□ Origin response header có Cache-Control: no-cache / private không?
□ URL có chứa tham số ngẫu nhiên không (như ?_=123456)?
□ Cấu hình cache key có đúng không?
□ TTL đặt có quá ngắn không?
□ Có hit cache cục bộ của trình duyệt thay vì CDN không?
```

**Vấn đề 3: Chi phí tăng đột biến**

Hướng xử lý:

```
1. Xem chi tiết hóa đơn
   - Phí lưu lượng CDN cao: Kiểm tra có tệp lớn bị truy cập thường xuyên, hoặc bị hotlink
   - Phí lưu lượng truy xuất nguồn cao: Kiểm tra tỉ lệ hit có giảm đột ngột không
   - Phí số lượng request cao: Kiểm tra có CC attack hoặc crawler không

2. Xem log truy cập
   - Có nhiều request 404 không (có thể là scan hoặc lỗi cấu hình)
   - Referer có bất thường không (xác định có bị hotlink không)

3. Cài đặt bảo mật
   - Bật chống hotlink (Referer whitelist)
   - Bật IP blacklist/whitelist
   - Cấu hình CC protection
```

---

## 7. Case study thực tế: Xây dựng giải pháp tăng tốc ảnh từ con số 0

### 7.1 Tình huống nghiệp vụ

Giả sử bạn là người phụ trách kỹ thuật của một cộng đồng nhiếp ảnh, đối mặt với các thách thức sau:

- **Người dùng tải lên**: Người dùng tải lên 1 triệu ảnh mỗi ngày (trung bình 2MB/ảnh)
- **Người dùng truy cập**: 50 triệu lượt xem ảnh mỗi ngày
- **Phân bố truy cập**: Người dùng khắp cả nước, có một lượng nhỏ truy cập từ nước ngoài
- **Yêu cầu hiệu năng**: Thời gian tải ảnh < 500ms
- **Ngân sách**: Cố gắng kiểm soát trong khoảng 50.000 NDT/tháng

### 7.2 Thiết kế kiến trúc

```
                         ┌──────────────────────────────────────┐
                         │           Quy trình tải lên           │
                         └──────────────────────────────────────┘

   Trình duyệt                                     Backend                      Lưu trữ đối tượng
       │                                            │                            │
       │  1. Xin chứng chỉ tải lên                  │                            │
       │───────────────────────────────────────────>│                            │
       │                                            │                            │
       │                                            │  2. Xin chứng chỉ STS tạm   │
       │                                            │───────────────────────────>│
       │                                            │                            │
       │                                            │  3. Trả về chứng chỉ STS   │
       │                                            │<───────────────────────────│
       │                                            │                            │
       │  4. Trả về chứng chỉ tải lên (gồm STS)    │
       │<───────────────────────────────────────────│                            │
       │                                            │                            │
       │  5. Tải tệp trực tiếp (dùng chữ ký STS)   │
       │──────────────────────────────────────────────────────────────────────>│
       │                                            │                            │
       │  6. Trả về kết quả tải lên (URL, ETag,...)│
       │<──────────────────────────────────────────────────────────────────────│
       │                                            │                            │
       │  7. Thông báo backend tải lên xong (lưu DB)│
       │───────────────────────────────────────────>│                            │


                         ┌──────────────────────────────────────┐
                         │            Quy trình truy cập         │
                         └──────────────────────────────────────┘

   Trình duyệt           Phân giải DNS           Node CDN            Lưu trữ đối tượng (Origin)
       │                     │                     │                     │
       │  1. Request URL ảnh │                     │                     │
       │────────────────────────────────────────>│                     │
       │                     │                     │                     │
       │                     │  2. Truy vấn DNS    │                     │
       │                     │────────────────────>│                     │
       │                     │                     │                     │
       │                     │  3. Trả về IP node tối ưu               │
       │                     │<────────────────────│                     │
       │                     │                     │                     │
       │  4. Kết nối node CDN│                     │                     │
       │────────────────────────────────────────>│                     │
       │                     │                     │                     │
       │                     │  5. Kiểm tra cache  │                     │
       │                     │                     ├─ Hit? Trả về ngay   │
       │                     │                     └─ Miss? Tiếp tục     │
       │                     │                     │                     │
       │                     │                     │  6. Truy xuất nguồn │
       │                     │                     │──────────────────>│
       │                     │                     │                     │
       │                     │                     │  7. Trả về tệp     │
       │                     │                     │<──────────────────│
       │                     │                     │                     │
       │                     │  8. Cache và phản hồi                     │
       │<────────────────────────────────────────│                     │
```

### 7.3 Giải thích cấu hình chi tiết

#### Cấu hình lưu trữ đối tượng

**Quy hoạch Bucket**:

```
 Bucket: myapp-images-prod
 ├─ Cấu trúc thư mục:
 │   ├─ uploads/           # Ảnh gốc người dùng tải lên
 │   │   ├─ 2024/01/15/user123-abc.jpg
 │   │   └─ 2024/01/15/user456-def.png
 │   ├─ thumbnails/        # Ảnh thumbnail
 │   │   ├─ small/         # 100x100
 │   │   ├─ medium/        # 400x300
 │   │   └─ large/         # 800x600
 │   └─ processed/         # Ảnh đã xử lý (thêm watermark, v.v.)
 │
 ├─ Quyền truy cập:
 │   ├─ Thư mục ảnh gốc: Riêng tư (cần chữ ký để truy cập)
 │   ├─ Thư mục thumbnail: Public Read
 │   └─ CORS: Cho phép *.myapp.com truy cập
 │
 └─ Chính sách lifecycle:
     ├─ Sau khi tải lên 7 ngày: Chuyển sang lưu trữ tần suất thấp (tiết kiệm 40% chi phí)
     ├─ Sau khi tải lên 90 ngày: Chuyển sang lưu trữ archive (tiết kiệm 70% chi phí)
     └─ Sau khi tải lên 3 năm: Tự động xóa (hoặc chuyển sang cold storage rẻ hơn)
```

**Cấu hình CORS**:

```xml
<CORSConfiguration>
  <CORSRule>
    <AllowedOrigin>https://myapp.com</AllowedOrigin>
    <AllowedOrigin>https://www.myapp.com</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
    <ExposeHeader>ETag</ExposeHeader>
    <ExposeHeader>x-oss-request-id</ExposeHeader>
    <MaxAgeSeconds>3600</MaxAgeSeconds>
  </CORSRule>
</CORSConfiguration>
```

#### Cấu hình tăng tốc CDN

**Cấu hình chiến lược cache**:

```
Quy tắc mặc định toàn cục:
├─ Cache key: Đường dẫn URL + giữ lại query parameter w, h, format
├─ TTL mặc định: 7 ngày
└─ Origin HOST: Tự động theo dõi

Phân chia theo loại tệp:
├─ *.html:
│   ├─ TTL: 5 phút
│   └─ Ưu tiên đọc từ memory cache
│
├─ *.js, *.css:
│   ├─ TTL: 1 năm
│   └─ Bỏ qua query parameter (vì tên tệp có hash)
│
├─ *.jpg, *.png, *.gif, *.webp:
│   ├─ TTL: 30 ngày
│   ├─ Giữ lại query parameter (w, h, format cho dynamic cropping)
│   └─ Bật tối ưu nén ảnh tự động
│
└─ /api/*:
    ├─ TTL: 0 (không cache)
    └─ Truy xuất nguồn trực tiếp
```

**Cấu hình tối ưu HTTPS**:

```
Cấu hình chứng chỉ:
├─ Loại chứng chỉ: Wildcard *.myapp.com
├─ Cách triển khai: Tải lên trên bảng điều khiển CDN, tự động gia hạn
└─ Chứng chỉ dự phòng: EV cho tên miền chính (hiển thị thanh địa chỉ xanh)

Cấu hình TLS:
├─ Phiên bản TLS tối thiểu: 1.2 (cân bằng tương thích và bảo mật)
├─ Phiên bản TLS tối đa: 1.3
├─ Cipher Suite: Chỉ bật các bộ mã hóa mạnh
├─ OCSP Stapling: Bật
├─ TLS Session Resumption: Bật Session Ticket
└─ HSTS: Bật (max-age=31536000)

HTTP/2 và HTTP/3:
├─ HTTP/2: Bật (multiplexing, nén header)
├─ HTTP/2 Server Push: Bật theo nhu cầu (khuyến nghị dùng Preload thay thế)
└─ HTTP/3 (QUIC): Bật (tính năng thử nghiệm, tăng dần lưu lượng)
```

### 7.4 Chiến lược kiểm soát chi phí

#### Phân tích cơ cấu chi phí

```
Cơ cấu chi phí CDN + Lưu trữ đối tượng hàng tháng:

Phần CDN:
├─ Phí lưu lượng xuống (phần lớn, khoảng 60%)
│   ├─ Trung Quốc đại lục: 0.15-0.30 NDT/GB
│   ├─ Châu Á - Thái Bình Dương: 0.40-0.80 NDT/GB
│   └─ Châu Âu - Châu Mỹ: 0.30-0.60 NDT/GB
│
├─ Phí số lượng request (phần nhỏ, khoảng 5%)
│   ├─ HTTP: 0.01-0.05 NDT/vạn lần
│   └─ HTTPS: 0.05-0.15 NDT/vạn lần (vì bắt tay TLS tiêu tốn tài nguyên)
│
├─ Phí băng thông đỉnh (phương thức tính phí tùy chọn)
│   └─ Tính phí đỉnh 95: Phù hợp tình huống lưu lượng biến động lớn
│
└─ Phí tính năng giá trị gia tăng (khoảng 5%)
    ├─ Quản lý chứng chỉ HTTPS
    ├─ Bảo vệ WAF
    ├─ Đẩy log thời gian thực
    └─ Edge Script/Function

Phần Lưu trữ đối tượng:
├─ Phí dung lượng lưu trữ (khoảng 15%)
│   ├─ Standard: 0.12-0.15 NDT/GB/tháng
│   ├─ Infrequent Access: 0.08-0.10 NDT/GB/tháng
│   └─ Archive: 0.03-0.05 NDT/GB/tháng
│
├─ Phí request (khoảng 5%)
│   ├─ PUT: 0.01-0.05 NDT/vạn lần
│   └─ GET: 0.005-0.01 NDT/vạn lần
│
├─ Phí truy xuất dữ liệu (IA/Archive)
│   └─ Xóa sớm hoặc truy xuất tính thêm phí
│
└─ Phí lưu lượng truy xuất nguồn (khoảng 10%)
    └─ Phí lưu lượng CDN truy xuất nguồn đến lưu trữ đối tượng
```

#### Mẹo tiết kiệm chi phí thực tế

**Mẹo 1: Phân cấp lưu trữ, quản lý lifecycle tự động**

```yaml
# Ví dụ quy tắc lifecycle
rules:
  - id: image-lifecycle
    prefix: uploads/
    transitions:
      # Sau 7 ngày chuyển sang IA, tiết kiệm 30% chi phí
      - days: 7
        storageClass: IA
      # Sau 90 ngày chuyển sang Archive, tiết kiệm 70% chi phí
      - days: 90
        storageClass: Archive
    # Sau 3 năm tự động xóa
    expiration:
      days: 1095
```

**Mẹo 2: Tăng tỉ lệ hit CDN, giảm truy xuất nguồn**

```
Tỉ lệ hit tăng từ 90% lên 95% có ý nghĩa gì?

Giả sử:
- Lưu lượng ngày: 10 TB
- Tỉ lệ hit 90%: Truy xuất nguồn 1 TB
- Tỉ lệ hit 95%: Truy xuất nguồn 0.5 TB

Tiết kiệm lưu lượng truy xuất nguồn: 0.5 TB/ngày × 0.15 NDT/GB × 30 ngày = 2250 NDT/tháng
```

**Mẹo 3: Nén và tối ưu định dạng**

```
Giải pháp tối ưu ảnh:
├─ Ảnh gốc lưu trong lưu trữ đối tượng (không công khai trực tiếp)
├─ CDN bật tính năng xử lý ảnh:
│   ├─ Tự động chuyển định dạng: JPEG → WebP/AVIF (tiết kiệm 30-50%)
│   ├─ Tự động nén chất lượng: Nén không mất thị giác (tiết kiệm 20-40%)
│   ├─ Kích thước thích ứng: Trả về kích thước phù hợp theo thiết bị
│   └─ Tải tiến trình: Mờ trước, rõ sau
└─ Hiệu quả: Chi phí băng thông giảm 50-70%
```

**Mẹo 4: Giới hạn đỉnh băng thông và cảnh báo**

```yaml
# Cấu hình giới hạn băng thông
bandwidth_cap:
  daily_limit: 500 # Mbps, vượt đỉnh ngày thì tự động dừng CDN
  monthly_limit: 10000 # GB, vượt lưu lượng tháng thì dừng

  # Ngưỡng cảnh báo
  alerts:
    - threshold: 70% # Đạt 70% gửi cảnh báo
      channels: [sms, email]
    - threshold: 90% # Đạt 90% gọi điện
      channels: [phone]
```

---

## 8. Tổng kết: Nguyên tắc vàng của Lưu trữ đối tượng + CDN

### 8.1 Nguyên tắc thiết kế kiến trúc

**Nguyên tắc 1: Tách biệt động và tĩnh**

```
Nội dung động (API, HTML) → Đi qua origin hoặc edge function
Nội dung tĩnh (Ảnh, JS, CSS, Video) → Đi qua CDN + Lưu trữ đối tượng
```

**Nguyên tắc 2: Phục vụ gần nhất**

```
Người dùng ở đâu, nội dung cache ở đó
→ Chọn nhà cung cấp CDN phủ sóng rộng
→ Bật điều phối DNS thông minh
→ Nội dung quan trọng làm nóng trước
```

**Nguyên tắc 3: Cache phân tầng**

```
Cache cục bộ trình duyệt (mạnh nhất)
    ↓
Cache node biên CDN (mạnh thứ hai)
    ↓
CDN tầng trung gian / node khu vực (dự phòng)
    ↓
Lưu trữ đối tượng / Origin (tuyến phòng thủ cuối cùng)
```

**Nguyên tắc 4: Cân bằng chi phí và trải nghiệm**

```
Phân cấp lưu trữ: Dữ liệu nóng lưu trữ standard, dữ liệu lạnh lưu trữ archive
Chiến lược cache: Nội dung tần suất cao TTL dài, nội dung tần suất thấp TTL ngắn
Nén và tối ưu: Định dạng WebP/AVIF, nén chất lượng thông minh
Giám sát cảnh báo: Đặt giới hạn băng thông, phòng tránh lưu lượng bất thường
```

### 8.2 Checklist tránh cạm bẫy

**Đặt tên Bucket và quyền hạn**

- [ ] Tên bucket duy nhất toàn cầu, tránh bị chiếm dụng
- [ ] Tệp riêng tư không đặt thành Public Read
- [ ] AccessKey không viết vào mã nguồn frontend, dùng chứng chỉ tạm STS
- [ ] Bật mã hóa phía server (SSE) bảo vệ dữ liệu nhạy cảm

**Cấu hình cache CDN**

- [ ] TTL tệp HTML không nên quá dài (khuyến nghị < 5 phút)
- [ ] JS/CSS nên dùng tên tệp có hash, TTL đặt 1 năm
- [ ] Cache key phải hợp lý, không đưa thông tin người dùng vào
- [ ] Sau khi cập nhật quan trọng, nhớ làm mới cache hoặc làm nóng

**Bảo mật HTTPS**

- [ ] Chứng chỉ không được hết hạn, đặt tự động gia hạn
- [ ] Phiên bản TLS tối thiểu khuyến nghị 1.2
- [ ] Bật HSTS chống downgrade attack
- [ ] Cookie nhạy cảm đặt Secure và HttpOnly

**Kiểm soát chi phí**

- [ ] Bật cảnh báo giới hạn băng thông, phòng tránh lưu lượng bất thường
- [ ] IA/Archive có thời gian lưu trữ tối thiểu và phí xóa sớm, chú ý quy tắc
- [ ] Phí lưu lượng truy xuất nguồn cũng rất đắt, nỗ lực tăng tỉ lệ hit CDN
- [ ] Định kỳ phân tích log truy cập, dọn dẹp tài nguyên zombie

---

## 9. Mẫu mã thực hành

### 9.1 Frontend tải trực tiếp lên lưu trữ đối tượng (JavaScript)

```javascript
/**
 * Lớp tiện ích tải trực tiếp lên lưu trữ đối tượng
 * Hỗ trợ: Alibaba Cloud OSS, Tencent Cloud COS, AWS S3
 */
class DirectUploader {
  constructor(config) {
    this.provider = config.provider // 'oss' | 'cos' | 's3'
    this.region = config.region
    this.bucket = config.bucket
    this.getCredentials = config.getCredentials // Hàm lấy chứng chỉ tạm thời
  }

  /**
   * Lấy chứng chỉ tạm thời STS
   */
  async fetchCredentials() {
    // Xin chứng chỉ tạm thời từ backend
    const credentials = await this.getCredentials()
    return {
      accessKeyId: credentials.accessKeyId,
      accessKeySecret: credentials.accessKeySecret,
      sessionToken: credentials.securityToken || credentials.sessionToken,
      expiration: credentials.expiration
    }
  }

  /**
   * Tạo chữ ký tải lên (cho frontend tính chữ ký)
   */
  generateSignature(credentials, fileKey, fileType, options = {}) {
    const timestamp = new Date().toISOString()
    const date = timestamp.slice(0, 10).replace(/-/g, '')

    // Thuật toán chữ ký của các nhà cung cấp có khác biệt nhỏ
    switch (this.provider) {
      case 'oss':
        return this._ossSignature(credentials, fileKey, date, options)
      case 'cos':
        return this._cosSignature(credentials, fileKey, date, options)
      case 's3':
        return this._s3Signature(credentials, fileKey, date, options)
      default:
        throw new Error('Unknown provider')
    }
  }

  /**
   * Tải lên tệp đơn (tệp nhỏ < 100MB)
   */
  async upload(file, options = {}) {
    const credentials = await this.fetchCredentials()
    const fileKey = this._generateFileKey(file, options.directory)

    const formData = new FormData()

    // Xây dựng trường form (tên trường khác nhau theo nhà cung cấp)
    const formFields = this._buildFormFields(
      credentials,
      fileKey,
      file.type,
      options
    )
    Object.entries(formFields).forEach(([key, value]) => {
      formData.append(key, value)
    })

    formData.append('file', file)

    // Gửi request tải lên
    const uploadUrl = this._getUploadUrl()
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
      // Nếu tải tệp lớn, có thể cần đặt timeout dài hơn
      signal: options.signal // Hỗ trợ AbortController hủy tải lên
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Upload failed: ${response.status} ${errorText}`)
    }

    return {
      url: this._getFileUrl(fileKey),
      key: fileKey,
      etag: response.headers.get('ETag'),
      size: file.size
    }
  }

  /**
   * Upload phân mảnh (tệp lớn > 100MB)
   */
  async multipartUpload(file, options = {}) {
    const partSize = options.partSize || 10 * 1024 * 1024 // Mặc định 10MB/mảnh
    const parallel = options.parallel || 3 // Mặc định 3 đồng thời

    const credentials = await this.fetchCredentials()
    const fileKey = this._generateFileKey(file, options.directory)

    // 1. Khởi tạo upload phân mảnh
    const uploadId = await this._initMultipartUpload(
      credentials,
      fileKey,
      file.type
    )

    // 2. Tính toán mảnh
    const parts = []
    const totalParts = Math.ceil(file.size / partSize)
    for (let i = 0; i < totalParts; i++) {
      const start = i * partSize
      const end = Math.min(start + partSize, file.size)
      parts.push({
        number: i + 1,
        start,
        end,
        blob: file.slice(start, end)
      })
    }

    // 3. Tải lên mảnh (có kiểm soát đồng thời và truyền tải tiếp điểm)
    const uploadedParts = []
    const failedParts = []

    // Hỗ trợ truyền tải tiếp điểm: kiểm tra những mảnh đã tải lên
    if (options.resume) {
      const existingParts = await this._listParts(
        credentials,
        fileKey,
        uploadId
      )
      for (const part of existingParts) {
        uploadedParts.push(part)
      }
    }

    // Lọc ra những mảnh chưa tải lên
    const pendingParts = parts.filter(
      (p) => !uploadedParts.some((up) => up.partNumber === p.number)
    )

    // Tải lên đồng thời
    const uploadPart = async (part) => {
      try {
        const etag = await this._uploadPart(
          credentials,
          fileKey,
          uploadId,
          part
        )
        return { partNumber: part.number, etag }
      } catch (error) {
        failedParts.push({ part, error })
        throw error
      }
    }

    // Dùng Promise.all kiểm soát đồng thời
    const chunks = []
    for (let i = 0; i < pendingParts.length; i += parallel) {
      chunks.push(pendingParts.slice(i, i + parallel))
    }

    for (const chunk of chunks) {
      const results = await Promise.allSettled(chunk.map(uploadPart))
      for (const result of results) {
        if (result.status === 'fulfilled') {
          uploadedParts.push(result.value)
        }
      }
    }

    // Kiểm tra tất cả mảnh đã tải lên thành công chưa
    if (uploadedParts.length !== totalParts) {
      throw new Error(
        `Upload incomplete: ${uploadedParts.length}/${totalParts} parts uploaded`
      )
    }

    // 4. Hoàn tất upload phân mảnh (hợp nhất mảnh)
    await this._completeMultipartUpload(
      credentials,
      fileKey,
      uploadId,
      uploadedParts
    )

    return {
      url: this._getFileUrl(fileKey),
      key: fileKey,
      size: file.size,
      parts: totalParts
    }
  }

  /**
   * Tạo đường dẫn lưu trữ tệp
   */
  _generateFileKey(file, directory = '') {
    const date = new Date()
    const datePath = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
    const random = Math.random().toString(36).substring(2, 10)
    const ext = file.name.split('.').pop() || 'bin'
    const key = directory
      ? `${directory}/${datePath}/${random}.${ext}`
      : `${datePath}/${random}.${ext}`
    return key
  }

  // ============ Phương thức riêng cho từng nhà cung cấp ============

  _getUploadUrl() {
    switch (this.provider) {
      case 'oss':
        return `https://${this.bucket}.oss-${this.region}.aliyuncs.com`
      case 'cos':
        return `https://${this.bucket}.cos.${this.region}.myqcloud.com`
      case 's3':
        return `https://${this.bucket}.s3.${this.region}.amazonaws.com`
      default:
        throw new Error('Unknown provider')
    }
  }

  _getFileUrl(key) {
    return `https://${this.bucket}.${this.provider === 'oss' ? 'oss' : 'cos'}-${this.region}.${
      this.provider === 'oss'
        ? 'aliyuncs.com'
        : this.provider === 'cos'
          ? 'myqcloud.com'
          : 'amazonaws.com'
    }/${key}`
  }

  // Các phương thức chữ ký, upload phân mảnh... của từng nhà cung cấp (triển khai theo nhu cầu thực tế)
  _buildFormFields(credentials, fileKey, fileType, options) {
    // Logic xây dựng trường form cho từng nhà cung cấp
    // Cần triển khai theo tài liệu của nhà cung cấp cụ thể
    return {}
  }

  async _initMultipartUpload(credentials, fileKey, fileType) {
    // Logic khởi tạo upload phân mảnh cho từng nhà cung cấp
    return 'upload-id'
  }

  async _uploadPart(credentials, fileKey, uploadId, part) {
    // Logic tải lên mảnh cho từng nhà cung cấp
    return 'etag'
  }

  async _completeMultipartUpload(credentials, fileKey, uploadId, parts) {
    // Logic hoàn tất upload phân mảnh cho từng nhà cung cấp
  }

  async _listParts(credentials, fileKey, uploadId) {
    // Logic liệt kê mảnh đã tải lên cho từng nhà cung cấp
    return []
  }
}

// Ví dụ sử dụng
const uploader = new DirectUploader({
  provider: 'oss',
  region: 'cn-beijing',
  bucket: 'myapp-images-prod',
  getCredentials: async () => {
    // Xin chứng chỉ tạm thời từ backend
    const res = await fetch('/api/upload/credentials')
    return res.json()
  }
})

// Tải lên tệp nhỏ
async function uploadAvatar(file) {
  try {
    const result = await uploader.upload(file, {
      directory: 'avatars',
      onProgress: (progress) => {
        console.log(`Tiến độ tải lên: ${progress.percent}%`)
      }
    })
    console.log('Tải lên thành công:', result.url)
    return result
  } catch (error) {
    console.error('Tải lên thất bại:', error)
    throw error
  }
}

// Tải lên tệp lớn phân mảnh
async function uploadVideo(file) {
  try {
    const result = await uploader.multipartUpload(file, {
      directory: 'videos',
      partSize: 10 * 1024 * 1024, // 10MB mỗi mảnh
      parallel: 3, // 3 đồng thời
      resume: true, // Hỗ trợ truyền tải tiếp điểm
      onProgress: (progress) => {
        console.log(
          `Tiến độ tải lên: ${progress.percent}%, đã tải ${progress.loaded}/${progress.total}`
        )
      },
      onPartComplete: (part) => {
        console.log(`Mảnh ${part.number} tải lên hoàn tất`)
      }
    })
    console.log('Tải lên thành công:', result.url)
    return result
  } catch (error) {
    console.error('Tải lên thất bại:', error)
    // Có thể triển khai logic thử lại hoặc lưu thông tin điểm dừng tại đây
    throw error
  }
}
```

### 9.2 Dịch vụ chứng chỉ tạm thời backend (Node.js/Express)

```javascript
/**
 * Dịch vụ chứng chỉ tạm thời STS cho lưu trữ đối tượng
 * Hỗ trợ: Alibaba Cloud OSS, Tencent Cloud COS, AWS S3
 */
const express = require('express')
const STS = require('ali-oss').STS // Alibaba Cloud
// const COS = require('cos-nodejs-sdk-v5') // Tencent Cloud
const router = express.Router()

// Cấu hình
const config = {
  // Cấu hình Alibaba Cloud OSS
  oss: {
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
    region: 'oss-cn-beijing',
    bucket: 'myapp-images-prod',
    // STS Role ARN (cần tạo trong RAM console)
    roleArn: process.env.OSS_STS_ROLE_ARN
  }
}

/**
 * Lấy chứng chỉ tạm thời STS (Alibaba Cloud OSS)
 * POST /api/upload/credentials
 */
router.post('/credentials', async (req, res) => {
  try {
    // 1. Xác minh danh tính người dùng (triển khai theo thực tế)
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // 2. Tạo tiền tố đường dẫn tệp duy nhất (để cách ly quyền)
    const date = new Date()
    const prefix = `uploads/${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${userId}/`

    // 3. Tạo STS client
    const sts = new STS({
      accessKeyId: config.oss.accessKeyId,
      accessKeySecret: config.oss.accessKeySecret
    })

    // 4. Xin chứng chỉ tạm thời
    const result = await sts.assumeRole(
      config.oss.roleArn,
      {
        // Policy giới hạn phạm vi quyền (nguyên tắc quyền tối thiểu)
        Statement: [
          {
            Effect: 'Allow',
            Action: [
              'oss:PutObject',
              'oss:InitiateMultipartUpload',
              'oss:UploadPart',
              'oss:CompleteMultipartUpload',
              'oss:AbortMultipartUpload',
              'oss:ListParts'
            ],
            Resource: [`acs:oss:*:*:${config.oss.bucket}/${prefix}*`]
          }
        ],
        Version: '1'
      },
      3600, // Chứng chỉ có hiệu lực 1 giờ
      'web-upload-session-' + Date.now()
    )

    // 5. Trả về chứng chỉ và cấu hình
    res.json({
      success: true,
      data: {
        // Chứng chỉ tạm thời STS
        credentials: {
          accessKeyId: result.credentials.AccessKeyId,
          accessKeySecret: result.credentials.AccessKeySecret,
          sessionToken: result.credentials.SecurityToken,
          expiration: result.credentials.Expiration
        },
        // Cấu hình tải lên
        config: {
          provider: 'oss',
          region: config.oss.region,
          bucket: config.oss.bucket,
          endpoint: `https://${config.oss.bucket}.${config.oss.region}.aliyuncs.com`,
          prefix: prefix, // Tiền tố đường dẫn tệp
          // Giới hạn an toàn
          maxSize: 100 * 1024 * 1024, // Tối đa 100MB
          allowedTypes: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'video/mp4'
          ]
        }
      }
    })
  } catch (error) {
    console.error('Get credentials failed:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get upload credentials',
      message: error.message
    })
  }
})

/**
 * Callback thông báo: Frontend thông báo backend sau khi tải lên xong
 * POST /api/upload/callback
 */
router.post('/callback', async (req, res) => {
  try {
    const { key, etag, size, mimeType, originalName } = req.body
    const userId = req.user?.id

    // 1. Xác minh tệp tồn tại
    // 2. Lưu thông tin tệp vào database
    const fileRecord = await db.files.create({
      userId,
      key,
      etag,
      size,
      mimeType,
      originalName,
      url: `https://cdn.example.com/${key}`,
      createdAt: new Date()
    })

    // 3. Xử lý bất đồng bộ: tạo thumbnail, trích xuất metadata, kiểm duyệt nội dung, v.v.
    await processFileAsync(fileRecord)

    res.json({
      success: true,
      data: {
        fileId: fileRecord.id,
        url: fileRecord.url,
        size: fileRecord.size
      }
    })
  } catch (error) {
    console.error('Upload callback failed:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to process uploaded file'
    })
  }
})

module.exports = router
```

### 9.3 Chống hotlink và cấu hình bảo mật

```javascript
/**
 * Ví dụ cấu hình chống hotlink và bảo mật CDN
 */

// 1. Referer chống hotlink (ngăn website khác nhúng trực tiếp tài nguyên của bạn)
const refererConfig = {
  // Chế độ whitelist: chỉ cho phép các Referer sau truy cập
  allowList: [
    '*.myapp.com', // Trang chính
    '*.myapp.cn', // Trang nội địa
    'localhost:*', // Phát triển cục bộ
    '127.0.0.1:*'
  ],

  // Chế độ blacklist (tùy chọn): cấm các Referer sau
  blockList: [
    '*. competitor.com', // Đối thủ cạnh tranh
    'spam-site.com'
  ],

  // Xử lý Referer rỗng: có cho phép truy cập trực tiếp không (nhập URL trên thanh địa chỉ)
  allowEmptyReferer: false // Môi trường production khuyến nghị false, test có thể true
}

// 2. URL Authentication (chống hotlink an toàn hơn, có timestamp và chữ ký)
class URLAuth {
  constructor(config) {
    this.key = config.key // Khóa xác thực, chỉ lưu ở phía server
    this.expireTime = config.expireTime || 3600 // Mặc định hiệu lực 1 giờ
  }

  /**
   * Tạo URL có xác thực
   * @param {string} url - URL gốc, như https://cdn.example.com/images/photo.jpg
   * @param {number} expireIn - Thời gian hiệu lực (giây)
   * @returns {string} URL có tham số xác thực
   */
  sign(url, expireIn = this.expireTime) {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const timestamp = Math.floor(Date.now() / 1000) + expireIn

    // Tạo chuỗi chữ ký (định dạng khác nhau theo nhà cung cấp, đây là ví dụ chung)
    const signStr = `${pathname}-${timestamp}-${this.key}`
    const signature = this._md5(signStr)

    // Thêm tham số xác thực
    urlObj.searchParams.set('sign', signature)
    urlObj.searchParams.set('t', timestamp.toString())

    return urlObj.toString()
  }

  /**
   * Xác minh chữ ký URL (sử dụng ở CDN edge hoặc origin)
   */
  verify(url) {
    const urlObj = new URL(url)
    const signature = urlObj.searchParams.get('sign')
    const timestamp = parseInt(urlObj.searchParams.get('t'))
    const pathname = urlObj.pathname

    // Kiểm tra hết hạn
    if (timestamp < Math.floor(Date.now() / 1000)) {
      return { valid: false, error: 'URL expired' }
    }

    // Xác minh chữ ký
    const signStr = `${pathname}-${timestamp}-${this.key}`
    const expectedSign = this._md5(signStr)

    if (signature !== expectedSign) {
      return { valid: false, error: 'Invalid signature' }
    }

    return { valid: true }
  }

  _md5(str) {
    // Dự án thực tế dùng crypto-js hoặc thư viện MD5 khác
    // Đây chỉ là ví dụ
    return require('crypto').createHash('md5').update(str).digest('hex')
  }
}

// Ví dụ sử dụng
const auth = new URLAuth({
  key: 'your-secret-key-only-known-by-server',
  expireTime: 3600 // Hiệu lực 1 giờ
})

// Server tạo URL có chữ ký
const signedUrl = auth.sign(
  'https://cdn.example.com/private/document.pdf',
  7200
)
// Kết quả: https://cdn.example.com/private/document.pdf?sign=xxxxx&t=1699123456

// CDN edge hoặc origin xác minh
const result = auth.verify(signedUrl)
if (!result.valid) {
  // Trả về 403 Forbidden
}

// 3. IP Black/White List
const ipConfig = {
  // Chỉ cho phép IP cụ thể truy cập (phù hợp hệ thống nội bộ)
  whiteList: [
    '192.168.1.0/24', // Dải mạng nội bộ
    '10.0.0.0/8'
  ],

  // Cấm IP cụ thể truy cập (chặn kẻ tấn công)
  blackList: ['1.2.3.4', '5.6.7.8']
}

// 4. UA (User-Agent) Black/White List
const uaConfig = {
  // Cấm crawler/công cụ tải xuống
  blackList: [
    'Wget',
    'curl',
    'python-requests',
    'Scrapy',
    'AhrefsBot',
    'SemrushBot'
  ],

  // Chỉ cho phép trình duyệt truy cập (chế độ nghiêm ngặt)
  whiteList: [
    'Mozilla/*', // Trình duyệt hiện đại
    'AppleWebKit/*'
  ]
}
```

---

## 10. Bảng đối chiếu thuật ngữ

| Thuật ngữ tiếng Anh        | Tiếng Trung          | Giải thích                                                                                                 |
| :------------------------- | :------------------- | :--------------------------------------------------------------------------------------------------------- |
| **Object Storage**         | 对象存储             | Kiến trúc lưu trữ dữ liệu, quản lý dữ liệu dưới dạng object thay vì cấu trúc phân cấp hệ thống tệp. Phù hợp lưu trữ ảnh, video, sao lưu và dữ liệu phi cấu trúc. |
| **Bucket**                 | 存储桶               | Container cấp cao nhất trong lưu trữ đối tượng, dùng để tổ chức và cách ly dữ liệu. Mỗi bucket có kiểm soát quyền và cấu hình độc lập. |
| **Object**                 | 对象/文件对象        | Đơn vị cơ bản của lưu trữ đối tượng, bao gồm dữ liệu, metadata và key duy nhất toàn cầu.                    |
| **CDN**                    | 内容分发网络         | Content Delivery Network, bằng cách triển khai node biên toàn cầu, cache nội dung website đến vị trí gần người dùng nhất, tăng tốc truy cập. |
| **Edge Node**              | 边缘节点             | Máy chủ cache trong mạng CDN được triển khai ở nhiều nơi, trực tiếp cung cấp dịch vụ truy cập nội dung cho người dùng. |
| **Origin**                 | 源站                 | Máy chủ nơi CDN truy xuất nội dung, có thể là lưu trữ đối tượng, ECS hoặc máy chủ tự dựng.                  |
| **Cache Hit**              | 缓存命中             | Nội dung người dùng yêu cầu đã tồn tại trên node biên CDN, trả về trực tiếp, không cần truy xuất nguồn.     |
| **Cache Miss**             | 缓存未命中           | Node biên không có nội dung được yêu cầu, cần truy xuất nguồn.                                            |
| **Hit Ratio**              | 命中率               | Tỉ lệ số lần cache hit trên tổng số request. Tỉ lệ hit càng cao, truy xuất nguồn càng ít, chi phí càng thấp. |
| **TTL**                    | 生存时间/缓存时间    | Time To Live, thời gian hiệu lực của nội dung cache trên node CDN. Sau khi hết hạn cần truy xuất nguồn lại. |
| **Back to Source**         | 回源                 | Quá trình node biên CDN yêu cầu nội dung từ origin server.                                                |
| **Purge/Refresh**          | 刷新缓存             | Buộc cache CDN vô hiệu, request tiếp theo sẽ truy xuất nguồn lấy nội dung mới nhất.                       |
| **Preheat**                | 预热                 | Trước khi phát hành chính thức, chủ động đẩy nội dung lên node CDN, để người dùng truy cập lần đầu cũng hit được cache. |
| **CORS**                   | 跨域资源共享         | Cross-Origin Resource Sharing, cơ chế bảo mật của trình duyệt, kiểm soát truy cập tài nguyên giữa các domain khác nhau. |
| **Referer**                | 来源页面             | Trường HTTP request header, chỉ ra request đến từ trang nào. Dùng để chống hotlink.                       |
| **STS**                    | 安全令牌服务         | Security Token Service, dịch vụ cấp chứng chỉ truy cập tạm thời, dùng cho các tình huống như frontend tải trực tiếp. |
| **Multipart Upload**       | 分片上传             | Cắt tệp lớn thành nhiều mảnh nhỏ tải lên song song, hỗ trợ truyền tải tiếp điểm, tăng hiệu quả và độ tin cậy. |
| **ETag**                   | 实体标签             | HTTP response header, dùng để định danh phiên bản cụ thể của tài nguyên, thường dùng để xác minh cache.    |
| **S3 API**                 | S3 兼容接口          | Đặc tả API lưu trữ đối tượng của AWS S3, hầu hết lưu trữ đối tượng của các nhà cung cấp đám mây đều tương thích với giao diện này. |
| **Canonical Query String** | 规范查询字符串       | Một phần của chuỗi chữ ký, dùng để tính chữ ký request, đảm bảo request không bị giả mạo.                 |

---

## Tổng kết: Nguyên tắc vàng của Lưu trữ đối tượng + CDN

1. **Tải lên đi đường trực tiếp**: Tệp lớn dùng chia mảnh, bảo mật dùng STS
2. **Cache phân tầng**: Trình duyệt -> CDN -> Origin, cache từng tầng
3. **Phục vụ gần người dùng**: DNS thông minh + phủ sóng node toàn cầu
4. **Bảo mật không lơ là**: HTTPS + Chống hotlink + Kiểm soát truy cập
5. **Chi phí phải giám sát**: Tỉ lệ hit, băng thông, phân cấp lưu trữ, liên tục tối ưu

Kiến trúc này đang gánh vác phần lớn truy cập tài nguyên tĩnh trên Internet. Hiểu nó, bạn sẽ hiểu được nền tảng của tối ưu hiệu năng Web hiện đại.

# Sự tiến hóa từ Monolith đến Microservices

::: tip Lời mở đầu
**Không có kiến trúc nào là "tốt nhất", chỉ có "phù hợp nhất với giai đoạn hiện tại".** Từ monolith đến microservices không phải là một bước nhảy hoàn thành ngay, mà là quá trình tiến hóa dần dần theo sự tăng trưởng về quy mô nghiệp vụ và quy mô đội ngũ. Phân tách microservices quá sớm cũng nguy hiểm không kém phân tách quá muộn.
:::

**Bài viết này sẽ giúp bạn học được gì?**

Sau khi học xong chương này, bạn sẽ đạt được:

- **Lộ trình tiến hóa**: Hiểu bốn giai đoạn từ monolith đến microservices
- **Thời điểm phân tách**: Biết khi nào nên tách, khi nào không nên tách
- **Chiến lược phân tách**: Nắm vững phương pháp phân tách theo domain nghiệp vụ
- **Mô hình giao tiếp**: Hiểu các lựa chọn giao tiếp đồng bộ và bất đồng bộ giữa các dịch vụ
- **Phân tách dữ liệu**: Hiểu thách thức và giải pháp phân tách cơ sở dữ liệu

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Lộ trình tiến hóa kiến trúc | Monolith → Modular Monolith → SOA → Microservices |
| **Chương 2** | Thời điểm và nguyên tắc phân tách | Định luật Conway, tự chủ đội nhóm |
| **Chương 3** | Chiến lược phân tách | Bounded Context của DDD, Strangler Fig Pattern |
| **Chương 4** | Giao tiếp giữa các dịch vụ | REST, gRPC, Message Queue |
| **Chương 5** | Phân tách dữ liệu | Phân tách DB, đồng bộ dữ liệu |

---

## 1. Lộ trình tiến hóa kiến trúc

Tiến hóa kiến trúc không do công nghệ thúc đẩy, mà do **quy mô tổ chức thúc đẩy**. Khi đội nhóm tăng từ 5 người lên 500 người, hiệu suất cộng tác của kiến trúc monolith sẽ giảm sút nghiêm trọng.

| Giai đoạn | Kiến trúc | Quy mô đội nhóm | Đặc điểm |
|------|------|---------|------|
| Khởi động | Ứng dụng monolith | 1~10 người | Tất cả mã trong một dự án, triển khai đơn giản |
| Tăng trưởng | Monolith module hóa | 10~50 người | Mã được chia theo module, nhưng vẫn triển khai cùng nhau |
| Mở rộng | SOA (Service-Oriented) | 50~200 người | Phân tách theo line nghiệp vụ thành dịch vụ thô |
| Quy mô lớn | Microservices | 200+ người | Dịch vụ hạt mịn, mỗi đội nhóm phát triển triển khai độc lập |

<ArchEvolutionDemo />

::: tip Định luật Conway
"Tổ chức thiết kế hệ thống, kiến trúc được tạo ra tương đương với cấu trúc giao tiếp của tổ chức đó." — Melvin Conway

Nói đơn giản: 3 đội nhóm làm một hệ thống, cuối cùng sẽ thành 3 dịch vụ. Bản chất của phân tách kiến trúc là **phân tách tổ chức**.

**Định luật Conway ngược**: Vì cấu trúc tổ chức quyết định kiến trúc hệ thống, nên muốn có kiến trúc như thế nào thì trước tiên hãy điều chỉnh thành cấu trúc tổ chức tương ứng. Ví dụ bạn muốn tách ra dịch vụ thanh toán độc lập, thì trước tiên hãy thành lập một đội thanh toán độc lập. Nhiều công ty phân tách microservices thất bại, không phải do vấn đề công nghệ, mà do tổ chức không điều chỉnh theo.
:::

---

## 2. Khi nào nên tách microservices?

Không phải hệ thống nào cũng cần microservices. Tách quá sớm sẽ mang lại độ phức tạp không cần thiết.

| Tín hiệu | Mô tả | Khuyến nghị |
|------|------|------|
| Xung đột triển khai thường xuyên | Nhiều đội nhóm sửa cùng một codebase, thường xuyên xung đột | Cân nhắc tách |
| Module nào đó cần mở rộng độc lập | Module tìm kiếm cần tài nguyên gấp 10 lần các module khác | Cân nhắc tách |
| Stack công nghệ cần khác biệt hóa | Module AI dùng Python, trang chính dùng Java | Cân nhắc tách |
| Đội nhóm < 10 người | Chi phí giao tiếp thấp, monolith là đủ | Không nên tách |
| Nghiệp vụ còn đang trong giai đoạn khám phá | Nhu cầu thay đổi nhanh, ranh giới không rõ ràng | Không nên tách |
| Không có năng lực DevOps | Không có CI/CD, container hóa, hệ thống giám sát | Không nên tách |

---

## 3. Chiến lược phân tách

### 3.1 Phân tách theo domain nghiệp vụ (Bounded Context của DDD)

Bounded Context (Ngữ cảnh giới hạn) của DDD (Domain-Driven Design) là nguyên tắc chỉ đạo tốt nhất để phân tách microservices. Mỗi bounded context tương ứng với một domain nghiệp vụ độc lập, có mô hình dữ liệu và quy tắc nghiệp vụ riêng.

**Bounded context là gì?** Cùng một từ nhưng trong các domain nghiệp vụ khác nhau có ý nghĩa khác nhau. Ví dụ "người dùng" trong domain người dùng là thông tin đăng ký (tên, email), trong domain đơn hàng là người đặt hàng (địa chỉ nhận hàng, phương thức thanh toán), trong domain đề xuất là hồ sơ hành vi (lịch sử duyệt, tag sở thích). Bounded context chính là vạch ra một ranh giới, trong ranh giới đó, thuật ngữ và mô hình có ý nghĩa rõ ràng thống nhất.

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Domain User │  │ Domain Order│  │ Domain Pay  │
│             │  │             │  │             │
│ User        │  │ Order       │  │ Payment     │
│ Profile     │  │ OrderItem   │  │ Refund      │
│ Address     │  │ Cart        │  │ Transaction │
│             │  │             │  │             │
│ User Svc    │  │ Order Svc   │  │ Payment Svc │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │
       └────── API call / Event comms ───────┘
```

| Bounded Context | Thực thể cốt lõi | Dịch vụ tương ứng |
|-----------|---------|---------|
| Domain người dùng | User, Profile, Address | Dịch vụ người dùng |
| Domain sản phẩm | Product, Category, SKU | Dịch vụ sản phẩm |
| Domain đơn hàng | Order, OrderItem | Dịch vụ đơn hàng |
| Domain thanh toán | Payment, Refund | Dịch vụ thanh toán |
| Domain logistics | Shipment, Tracking | Dịch vụ logistics |

### 3.2 Strangler Fig Pattern (Mô hình Cây strangler fig)

Không nên viết lại toàn bộ monolith cùng một lúc, mà giống như cây strangler fig, từng bước dùng dịch vụ mới thay thế module cũ:

1. Tạo dịch vụ mới bên ngoài monolith
2. Thông qua proxy layer chuyển một phần lưu lượng đến dịch vụ mới
3. Sau khi xác minh dịch vụ mới ổn định, dần dần chuyển thêm lưu lượng
4. Cuối cùng thay thế hoàn toàn module cũ

---

## 4. Mô hình giao tiếp giữa các dịch vụ

| Phương thức | Giao thức | Đặc điểm | Phù hợp |
|------|------|------|---------|
| REST | HTTP/JSON | Đơn giản, phổ biến, ecosystem tốt | API mở rộng, thao tác CRUD |
| gRPC | HTTP/2 + Protobuf | Hiệu suất cao, kiểu mạnh | Gọi tần suất cao giữa các dịch vụ nội bộ |
| Message Queue | AMQP/Kafka | Bất đồng bộ, tách biệt, cắt đỉnh lấp vực | Thông báo sự kiện, tác vụ bất đồng bộ |
| GraphQL | HTTP/JSON | Client truy vấn theo nhu cầu | Tầng BFF, mobile |

::: tip Lựa chọn đồng bộ vs bất đồng bộ
- **Cần trả về kết quả ngay lập tức** → Đồng bộ (REST/gRPC)
- **Không cần trả về ngay** → Bất đồng bộ (Message Queue)
- **Một sự kiện kích hoạt nhiều hành động** → Bất đồng bộ (Publish-Subscribe)

Nguyên tắc kinh nghiệm: có thể bất đồng bộ thì bất đồng bộ, chuỗi gọi đồng bộ càng dài, hệ thống càng mong manh.
:::

---

## 5. Phân tách dữ liệu: Phần khó nhất

Trong phân tách microservices, phần đau đớn nhất không phải phân tách mã, mà là phân tách cơ sở dữ liệu. Mỗi dịch vụ nên sở hữu cơ sở dữ liệu riêng, nhưng điều này có nghĩa là truy vấn xuyên dịch vụ trở nên khó khăn.

| Thách thức | Mô tả | Giải pháp |
|------|------|---------|
| JOIN xuyên dịch vụ | Không thể JOIN trực tiếp bảng của hai dịch vụ | Truy vấn tổng hợp API, dư thừa dữ liệu |
| Giao dịch phân tán | Giao dịch liên DB không thể dùng giao dịch cục bộ | Saga, bảng tin nhắn cục bộ |
| Nhất quán dữ liệu | Dữ liệu nhiều dịch vụ có thể tạm thời không nhất quán | Nhất quán cuối cùng, event-driven |
| Di chuyển dữ liệu | Từ DB dùng chung sang DB độc lập | Chuyển giao kép ghi, công cụ đồng bộ dữ liệu |

---

## Tổng kết

Từ monolith đến microservices là một quá trình tiến bộ, không phải một cuộc cách mạng thực hiện trong một bước.

Ôn lại các điểm chính của chương này:

1. **Lộ trình tiến hóa**: Monolith → Modular Monolith → SOA → Microservices, mỗi bước đều có động lực rõ ràng
2. **Thời điểm phân tách**: Quy mô đội nhóm, xung đột triển khai, nhu cầu mở rộng là tín hiệu để phân tách
3. **Chiến lược phân tách**: Dùng Bounded Context của DDD để hướng dẫn phân tách, dùng Strangler Fig Pattern để di chuyển dần dần
4. **Lựa chọn giao tiếp**: Có thể bất đồng bộ thì bất đồng bộ, chuỗi gọi đồng bộ càng ngắn càng tốt
5. **Phân tách dữ liệu**: Khó nhất nhưng quan trọng nhất, chấp nhận nhất quán cuối cùng là sự chuyển đổi tư duy then chốt

## Đọc thêm

- [Building Microservices](https://www.oreilly.com/library/view/building-microservices-2nd/9781492034018/) - Tác phẩm kinh điển về microservices của Sam Newman
- [Monolith to Microservices](https://www.oreilly.com/library/view/monolith-to-microservices/9781492047834/) - Hướng dẫn di chuyển dần dần
- [Domain-Driven Design](https://www.domainlanguage.com/ddd/) - Tác phẩm DDD kinh điển của Eric Evans
- [The Strangler Fig Pattern](https://martinfowler.com/bliki/StranglerFigApplication.html) - Strangler Fig Pattern của Martin Fowler

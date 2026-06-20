# Hàng đợi task bất đồng bộ và mô hình Producer-Consumer

::: tip Lời nói đầu
**Người dùng nhấn nút "Xuất báo cáo", rồi nhìn chằm chằm vào animation loading xoay tròn 30 giây -- điều này có hợp lý không?** Khi một thao tác cần vài giây thậm chí vài phút mới hoàn thành, để người dùng chờ đợi rõ ràng không phải là trải nghiệm tốt. Hàng đợi task bất đồng bộ chính là mẫu kiến trúc cốt lõi giải quyết vấn đề này -- đưa thao tác tốn thời gian ra xử lý ở background, để người dùng nhận được phản hồi ngay lập tức.
:::

**Bài viết này sẽ giúp bạn học được gì?**

Sau khi học xong chương này, bạn sẽ đạt được:

- **So sánh đồng bộ và bất đồng bộ**: hiểu tại sao một số thao tác phải được bất đồng bộ hóa, và lợi ích về trải nghiệm người dùng khi bất đồng bộ hóa
- **Mô hình Producer-Consumer**: nắm vững tư tưởng cốt lõi và quy trình làm việc của mô hình Producer-Consumer
- **Cơ chế Worker Pool**: hiểu cách task được phân phối đến nhiều Worker xử lý song song
- **Đảm bảo độ tin cậy**: nắm vững các cơ chế bảo đảm như retry, tính lũy đẳng, dead letter queue
- **Năng lực chọn công nghệ**: hiểu đặc điểm và tình huống áp dụng của các framework task bất đồng bộ chính

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Tại sao cần bất đồng bộ | Đồng bộ blocking vs Bất đồng bộ non-blocking |
| **Chương 2** | Mô hình Producer-Consumer | Producer, Queue, Consumer |
| **Chương 3** | Worker Pool | Xử lý đồng thời, phân phối task |
| **Chương 4** | Đảm bảo độ tin cậy | Chiến lược retry, tính lũy đẳng, dead letter queue |
| **Chương 5** | Chọn framework | Celery, Sidekiq, Bull, RQ |

---

## 0. Toàn cảnh: tại sao không thể để người dùng "chờ suông"?

Hãy tưởng tượng bạn đi ăn nhà hàng. Nhà hàng tốt sẽ đưa cho bạn một số thứ tự ngay sau khi bạn gọi món, rồi bạn có thể tìm chỗ ngồi, chơi điện thoại, đợi món xong rồi đến lấy. Thay vì bắt bạn đứng trước quầy, nhìn chằm chằm đầu bếp nấu xong toàn bộ món ăn.

Trong ứng dụng Web có rất nhiều thao tác "nấu món" tương tự:

- **Gửi email/SMS**: gọi API bên thứ ba, có thể mất vài giây
- **Tạo báo cáo/PDF**: tính toán lượng lớn dữ liệu, có thể mất vài chục giây
- **Xử lý ảnh/video**: nén, chuyển mã, đóng watermark, có thể mất vài phút
- **Đồng bộ dữ liệu**: đồng bộ dữ liệu giữa các hệ thống, thời gian không xác định

::: tip Tư tưởng cốt lõi của task bất đồng bộ
Tách thao tác tốn thời gian ra khỏi luồng chính "request-response", đưa vào hàng đợi background xử lý bất đồng bộ. Người dùng gửi request xong nhận ngay phản hồi "đã nhận, đang xử lý", sau khi xử lý xong thông báo kết quả qua notification, polling hoặc WebSocket.
:::

---

## 1. Đồng bộ vs Bất đồng bộ: câu chuyện về một đơn hàng

Khi người dùng gửi một đơn hàng, backend cần làm rất nhiều việc: trừ kho, tạo bản ghi đơn hàng, gửi email xác nhận, cập nhật hệ thống gợi ý, ghi audit log...

Trong chế độ đồng bộ, các thao tác này thực hiện tuần tự, người dùng phải đợi tất cả thao tác hoàn thành mới thấy kết quả. Trong chế độ bất đồng bộ, chỉ cần hoàn thành thao tác cốt lõi (trừ kho, tạo đơn hàng), các thao tác còn lại ném vào hàng đợi xử lý background.

<AsyncTaskFlowDemo />

| Chiều so sánh | Xử lý đồng bộ | Xử lý bất đồng bộ |
|---------|---------|---------|
| Thời gian người dùng chờ | Tổng thời gian tất cả thao tác | Chỉ thời gian thao tác cốt lõi |
| Throughput hệ thống | Thấp (thread bị block) | Cao (thread được giải phóng nhanh) |
| Ảnh hưởng khi thất bại | Thất bại không cốt lõi gây thất bại tổng thể | Thất bại không cốt lõi không ảnh hưởng luồng chính |
| Độ phức tạp triển khai | Đơn giản | Cần thêm hạ tầng hàng đợi |
| Tính nhất quán dữ liệu | Nhất quán mạnh | Nhất quán cuối cùng |

::: tip Khi nào nên dùng bất đồng bộ?
Ba tiêu chí đánh giá: **tốn thời gian** (trên 1-2 giây), **không cốt lõi** (thất bại không nên ảnh hưởng luồng chính), **có thể trì hoãn** (không cần kết quả ngay lập tức). Thỏa mãn hai trong ba tiêu chí, nên xem xét bất đồng bộ hóa.
:::

---

## 2. Mô hình Producer-Consumer: "dây chuyền" xử lý task

Cốt lõi của hàng đợi task bất đồng bộ là mô hình kinh điển **Producer-Consumer Pattern**. Mô hình này có ba vai trò:

- **Producer (Nhà sản xuất)**: bên tạo ra task, thường là Web server khi xử lý request của người dùng
- **Queue (Hàng đợi)**: buffer lưu trữ task chờ xử lý, thường dùng Redis, RabbitMQ, v.v.
- **Consumer/Worker (Người tiêu dùng)**: tiến trình làm việc lấy task từ hàng đợi và thực thi

<TaskWorkerDemo />

::: tip Ba giá trị của hàng đợi
1. **Giải ghép (Decoupling)**: Producer không cần biết ai xử lý task, Consumer không cần biết task từ đâu đến
2. **Cắt đỉnh lấp đáy (Peak Shaving)**: khi lưu lượng đột biến, task tích tụ trong hàng đợi, Consumer xử lý theo nhịp độ của mình
3. **Độ tin cậy**: task được persistent trong hàng đợi, ngay cả khi Consumer crash cũng không mất
:::

| Thành phần | Trách nhiệm | Triển khai phổ biến |
|------|------|---------|
| Message Broker | Lưu trữ và chuyển tiếp message task | Redis, RabbitMQ, Kafka |
| Serializer | Serialize/deserialize tham số task | JSON, MessagePack, Pickle |
| Scheduler | Quản lý scheduled task và delayed task | Cron, APScheduler, node-cron |
| Result Backend | Lưu kết quả thực thi task | Redis, Database, S3 |

---

## 3. Đảm bảo độ tin cậy: task không thể "mất" cũng không thể "lặp"

Trong môi trường phân tán, các vấn đề như network jitter, service restart, thiếu tài nguyên có thể xảy ra bất cứ lúc nào. Hệ thống task bất đồng bộ phải có cơ chế đảm bảo độ tin cậy hoàn chỉnh.

Hai vấn đề cốt lõi nhất: **mất task** (Consumer xử lý nửa chừng thì crash) và **thực thi lặp** (task được gửi hai lần).

<TaskRetryDemo />

::: tip Ba chiêu thức đảm bảo độ tin cậy
1. **Cơ chế ACK**: Consumer gửi xác nhận (ACK) sau khi xử lý xong task, task chưa được ACK sẽ được gửi lại
2. **Chiến lược retry**: task thất bại thì retry theo chiến lược, exponential backoff + jitter là best practice
3. **Thiết kế lũy đẳng**: cùng một task thực thi nhiều lần cho hiệu quả như một lần, thực hiện qua unique ID dedup
:::

| Cơ chế | Vấn đề giải quyết | Cách triển khai |
|------|-----------|---------|
| ACK | Mất task | Xác nhận thủ công sau khi xử lý xong, quá thời gian chưa ACK thì gửi lại |
| Dead Letter Queue (DLQ) | "Poison message" thất bại liên tục | Retry vượt giới hạn thì chuyển vào DLQ, can thiệp thủ công |
| Tính lũy đẳng | Thực thi lặp | Dùng unique ID của task để dedup, unique constraint database |
| Hàng đợi ưu tiên | Task bị đói | Task ưu tiên cao xử lý trước, tránh bị task ưu tiên thấp block |
| Kiểm soát timeout | Task bị treo | Đặt thời gian thực thi tối đa, quá thời gian tự động kết thúc và retry |

---

## 4. Chọn framework: chọn công cụ phù hợp với bạn

Các hệ sinh thái ngôn ngữ khác nhau có các framework task bất đồng bộ khác nhau, mỗi loại có thế mạnh riêng về mức độ phong phú tính năng, hiệu suất, tính dễ sử dụng. Khi chọn framework, trước tiên xem xét tech stack của bạn, sau đó quyết định dựa trên quy mô dự án và nhu cầu.

<AsyncComparisonDemo />

::: tip Gợi ý chọn framework
- **Dự án Python**: vừa và lớn dùng Celery, nhỏ dùng RQ
- **Dự án Node.js**: ưu tiên BullMQ (thế hệ tiếp theo của Bull)
- **Dự án Ruby**: Sidekiq gần như là lựa chọn duy nhất
- **Dự án Java**: hệ sinh thái Spring dùng Spring Batch, throughput cao dùng Kafka Streams
- **Dự án Go**: Asynq (dựa trên Redis) hoặc Machinery

Nếu dự án của bạn đã dùng Redis, thì giải pháp dựa trên Redis (Celery+Redis, BullMQ, Sidekiq) là cách khởi đầu đơn giản nhất.
:::

---

## Tổng kết

Hàng đợi task bất đồng bộ là hạ tầng không thể thiếu trong kiến trúc backend. Nó cho phép hệ thống xử lý thanh lịch các thao tác tốn thời gian, nâng cao trải nghiệm người dùng đồng thời tăng throughput hệ thống.

Ôn lại các điểm then chốt của chương:

1. **Tiêu chí đánh giá bất đồng bộ hóa**: tốn thời gian, không cốt lõi, có thể trì hoãn, thỏa mãn hai tiêu chí thì nên bất đồng bộ hóa
2. **Mô hình Producer-Consumer**: Producer -> Queue -> Consumer, ba bên giải ghép hợp tác
3. **Worker Pool**: nhiều Worker tiêu thụ song song, nâng cao năng lực xử lý
4. **Đảm bảo độ tin cậy**: ACK + chiến lược retry + tính lũy đẳng, ba thứ không thể thiếu
5. **Chọn framework**: chọn theo tech stack và quy mô dự án, Redis là message broker phổ biến nhất

## Đọc thêm

- [Tài liệu chính thức Celery](https://docs.celeryq.dev/) - Hàng đợi task phân tán phổ biến nhất Python
- [Tài liệu BullMQ](https://docs.bullmq.io/) - Hàng đợi task hiệu suất cao Node.js
- [Sidekiq Wiki](https://github.com/sidekiq/sidekiq/wiki) - Chuẩn mực xử lý task trong hệ sinh thái Ruby
- [RabbitMQ Tutorials](https://www.rabbitmq.com/tutorials) - Hướng dẫn nhập môn message broker
- [Best practice task bất đồng bộ](https://brandur.org/job-drain) - Design pattern và cạm bẫy của hàng đợi task
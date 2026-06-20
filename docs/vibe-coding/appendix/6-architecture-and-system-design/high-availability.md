# Tính sẵn sàng cao và Khôi phục sau thảm họa

::: tip Lời mở đầu
**Hệ thống ngừng 1 phút, có thể đồng nghĩa với thiệt hại hàng trăm nghìn.** Tính sẵn sàng cao (High Availability) là khả năng hệ thống tiếp tục cung cấp dịch vụ khi đối mặt với lỗi phần cứng, lỗi phần mềm, sự cố mạng và các tình huống bất thường khác. Khôi phục sau thảm họa (Disaster Recovery) là khả năng hệ thống phục hồi dịch vụ khi xảy ra thảm họa quy mô lớn hơn.
:::

**Bài viết này sẽ giúp bạn học được gì?**

Sau khi học xong chương này, bạn sẽ đạt được:

- **Đo lường tính sẵn sàng**: Hiểu ý nghĩa của "mấy số 9" và thời gian ngừng tương ứng
- **Chuyển đổi khi lỗi**: Nắm vững kiến trúc HA như active-standby, active-active, multi-site
- **Chiến lược khôi phục sau thảm họa**: Hiểu khái niệm RPO và RTO cũng như phương pháp thiết kế
- **Phát hiện lỗi**: Hiểu cơ chế phát hiện lỗi như heartbeat, probe, circuit breaker
- **Kỹ thuật Chaos**: Tìm hiểu cách chủ động tiêm lỗi để xác minh khả năng phục hồi của hệ thống

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Đo lường tính sẵn sàng | SLA, mấy số 9, thời gian ngừng |
| **Chương 2** | Kiến trúc chuyển đổi khi lỗi | Active-Standby, Active-Active, Multi-AZ, Multi-Region |
| **Chương 3** | Thiết kế khôi phục sau thảm họa | RPO, RTO, chiến lược sao lưu |
| **Chương 4** | Phát hiện và phục hồi lỗi | Heartbeat, circuit breaker, tự động mở rộng thu nhỏ |
| **Chương 5** | Kỹ thuật Chaos | Tiêm lỗi, xác minh khả năng phục hồi |

---

## 1. Đo lường tính sẵn sàng: Mấy số 9 có ý nghĩa gì?

Tính sẵn sàng thường được đo bằng "mấy số 9", công thức tính:

**Tính sẵn sàng = Thời gian hoạt động bình thường / Tổng thời gian x 100%**

Ví dụ trong một tháng (30 ngày = 43200 phút) ngừng 43 phút, tính sẵn sàng là (43200 - 43) / 43200 ≈ 99.9%. Mỗi thêm một số 9, thời gian ngừng cho phép giảm đi một bậc, độ khó và chi phí thực hiện cũng tăng theo cấp số nhân.

| Mức sẵn sàng | Phần trăm | Ngừng tối đa mỗi tháng | Ngừng tối đa mỗi năm | Yêu cầu điển hình |
|-----------|--------|------------|------------|---------|
| 2 số 9 | 99% | 7.3 giờ | 3.65 ngày | Công cụ nội bộ |
| 3 số 9 | 99.9% | 43 phút | 8.76 giờ | Hệ thống nghiệp vụ thông thường |
| 4 số 9 | 99.99% | 4.3 phút | 52.6 phút | Thương mại điện tử, SaaS |
| 5 số 9 | 99.999% | 26 giây | 5.26 phút | Tài chính, thanh toán |

<AvailabilityCalculatorDemo />

::: tip SLA là gì?
**SLA (Service Level Agreement - Thỏa thuận cấp độ dịch vụ)** là cam kết chính thức giữa nhà cung cấp dịch vụ và khách hàng. Ví dụ AWS S3 cam kết tính sẵn sàng 99.99%, nếu không đạt được sẽ hoàn tiền theo tỷ lệ. SLA không chỉ là chỉ số kỹ thuật, mà còn là hợp đồng thương mại — vi phạm SLA đồng nghĩa với việc phải đền bù.
:::

::: tip Khoảng cách từ 3 số 9 đến 4 số 9
3 số 9 (99.9%) có nghĩa là mỗi tháng có thể ngừng 43 phút — một lần triển khai gặp vấn đề, rollback một cái là hết quỹ thời gian.
4 số 9 (99.99%) có nghĩa là mỗi tháng chỉ được ngừng 4 phút — điều này đòi hỏi bạn phải có hệ thống HA hoàn chỉnh với tự động chuyển đổi khi lỗi, triển khai luân phiên, kiểm tra sức khỏe v.v.
:::

---

## 2. Kiến trúc chuyển đổi khi lỗi

Failover là cơ chế cốt lõi của tính sẵn sàng cao: khi nút chính lỗi, tự động chuyển sang nút dự phòng để tiếp tục cung cấp dịch vụ.

### Chế độ Active-Standby

Kiến trúc HA phổ biến nhất. Nút chính xử lý tất cả yêu cầu, nút dự phòng đồng bộ dữ liệu theo thời gian thực nhưng không xử lý yêu cầu. Khi nút chính lỗi, nút dự phòng tự động tiếp quản.

```
Trạng thái bình thường:
  Client → Nút chính (xử lý yêu cầu)
            Nút dự phòng (đồng bộ dữ liệu, chờ lệnh)

Chuyển đổi khi lỗi:
  Client → Nút dự phòng (tiếp quản làm nút chính mới)
            Nút chính cũ (lỗi, chờ sửa chữa)
```

Vấn đề quan trọng là **Split-brain (Não bị chia đôi)**: khi mạng bị phân vùng, cả nút chính và nút dự phòng đều cho rằng đối phương đã hỏng, đồng thời cung cấp dịch vụ, dẫn đến dữ liệu không nhất quán. Giải pháp là sử dụng **nút trọng tài (Quorum)** — ít nhất 3 nút bỏ phiếu quyết định ai là nút chính.

### Multi-AZ (Nhiều vùng sẵn sàng)

Triển khai dịch vụ ở nhiều trung tâm dữ liệu (vùng sẵn sàng) trong cùng một khu vực. Một trung tâm dữ liệu mất điện, mất mạng không ảnh hưởng đến dịch vụ tổng thể. Vùng sẵn sàng của nhà cung cấp cloud thường có kết nối riêng có độ trễ thấp (< 2ms).

### Multi-Region Active-Active (Nhiều khu vực hoạt động đồng thời)

Triển khai bản sao dịch vụ hoàn chỉnh ở các thành phố hoặc quốc gia khác nhau, mỗi trang đều có thể độc lập xử lý yêu cầu. Đây là kiến trúc HA cấp cao nhất, nhưng cũng phức tạp nhất — thách thức cốt lõi là độ trễ và vấn đề nhất quán của **đồng bộ dữ liệu liên khu vực**.

<FailoverStrategyDemo />

| Kiến trúc | Mức sẵn sàng | Chi phí | Độ phức tạp | Phù hợp |
|------|-----------|------|--------|---------|
| Đơn máy | 99%~99.9% | Thấp | Thấp | Phát triển kiểm thử, công cụ nội bộ |
| Active-Standby | 99.9%~99.99% | Trung bình | Trung bình | Hệ thống nghiệp vụ vừa và nhỏ |
| Multi-AZ | 99.99% | Cao | Cao | Thương mại điện tử, nền tảng SaaS |
| Multi-Region Active-Active | 99.999% | Rất cao | Rất cao | Tài chính, Internet quy mô lớn |

---

## 3. Thiết kế khôi phục sau thảm họa: RPO và RTO

Thiết kế khôi phục sau thảm họa xoay quanh hai chỉ số cốt lõi:

| Chỉ số | Tên đầy đủ | Ý nghĩa | Ví dụ |
|------|------|------|------|
| RPO | Recovery Point Objective | Có thể chấp nhận mất bao nhiêu dữ liệu | RPO=0 nghĩa là không được mất bất kỳ dữ nào |
| RTO | Recovery Time Objective | Có thể chấp nhận ngừng trong bao lâu | RTO=5phút nghĩa là phải phục hồi trong 5 phút |

### Mối quan hệ giữa chiến lược sao lưu và RPO

| Phương pháp sao lưu | RPO | Chi phí | Mô tả |
|---------|-----|------|------|
| Sao lưu toàn bộ hàng ngày | 24 giờ | Thấp | Tối đa mất một ngày dữ liệu |
| Sao lưu gia tăng theo thời gian thực | Cấp phút | Trung bình | Đồng bộ liên tục bằng binlog/WAL |
| Sao chép đồng bộ | 0 | Cao | Ghi phải chờ xác nhận từ bản sao |

::: tip Không phải tất cả dữ liệu đều cần RPO=0
Ảnh đại diện người dùng mất thì có thể tải lên lại (RPO=24h là đủ), nhưng bản ghi thanh toán thì không được mất một khoản nào (RPO=0). Quyết định chiến lược sao lưu dựa trên giá trị nghiệp vụ của dữ liệu, chứ không nên áp dụng một cách cho tất cả.
:::

---

## 4. Phát hiện và phục hồi lỗi

### 4.1 Cơ chế phát hiện lỗi

| Cơ chế | Nguyên lý | Tốc độ phát hiện | Phù hợp |
|------|------|---------|---------|
| Heartbeat | Định kỳ gửi gói heartbeat, hết hạn thì xác định lỗi | Cấp giây | Kiểm tra nút còn sống |
| Kiểm tra sức khỏe | HTTP/TCP probe kiểm tra trạng thái dịch vụ | Cấp giây | Kiểm tra backend của load balancer |
| Probe nghiệp vụ | Mô phỏng yêu cầu thực tế kiểm tra logic nghiệp vụ | Cấp giây~phút | Giám sát khả dụng end-to-end |

**Nguyên lý hoạt động của heartbeat**: Nút A cách một khoảng thời gian cố định (ví dụ 5 giây) gửi một tín hiệu "tôi còn sống" cho bên giám sát. Nếu liên tục N lần (ví dụ 3 lần) không nhận được heartbeat, thì xác định nút A bị lỗi. Tham số quan trọng là **khoảng heartbeat** và **ngưỡng timeout** — khoảng quá ngắn sẽ tăng tải mạng, quá dài sẽ chậm phát hiện lỗi.

**Ba mức kiểm tra sức khỏe**:
- **Liveness probe (Sự sống)**: Tiến trình còn chạy không? Không thì khởi động lại
- **Readiness probe (Sẵn sàng)**: Dịch vụ có thể nhận yêu cầu không? Không thì loại khỏi load balancer
- **Startup probe (Khởi động)**: Dịch vụ khởi động xong chưa? Chưa xong thì chờ, đừng nhầm là lỗi

### 4.2 Cơ chế tự động phục hồi

| Cơ chế | Mô tả | Công cụ điển hình |
|------|------|---------|
| Tự động khởi động lại | Tự động nâng tiến trình sau khi bị crash | systemd, PM2, K8s |
| Tự động mở rộng/thu nhỏ | Tự động thêm instance khi tải tăng | K8s HPA, Cloud Auto Scaling |
| Circuit breaker & downgrade | Thất bại nhanh khi downstream lỗi, ngăn lỗi dây chuyền | Hystrix, Sentinel, Resilience4j |
| Giới hạn tốc độ | Từ chối trực tiếp yêu cầu vượt quá dung lượng | Nginx limit_req, API Gateway rate limiting |

**Chi tiết mẫu Circuit Breaker (Ngắt mạch)**:

Circuit breaker lấy cảm hứng từ cầu chì trong mạch điện — khi dòng điện quá lớn sẽ tự động ngắt, bảo vệ toàn bộ mạch không bị cháy. Trong microservice, khi dịch vụ downstream lỗi, circuit breaker sẽ "ngắt", khiến yêu cầu thất bại nhanh, thay vì chờ timeout một cách vô ích.

```
Ba trạng thái của circuit breaker:

  Đóng (bình thường) ──→ Tỷ lệ lỗi vượt ngưỡng ──→ Mở (ngắt mạch)
       ↑                                    │
       │                              Chờ thời gian nguội
       │                                    ↓
       └── Yêu cầu thăm dò thành công ←── Nửa mở (thử nghiệm)
```

- **Trạng thái đóng**: Chuyển tiếp yêu cầu bình thường, đồng thời thống kê tỷ lệ lỗi
- **Trạng thái mở**: Tất cả yêu cầu trả về lỗi trực tiếp (thất bại nhanh), không gọi downstream nữa
- **Trạng thái nửa mở**: Sau thời gian nguội, cho qua một ít yêu cầu thăm dò. Nếu thành công, phục hồi trạng thái đóng; nếu thất bại, tiếp tục trạng thái mở

**Downgrade (Giảm cấp)** là chiến lược đi kèm circuit breaker: khi circuit breaker kích hoạt, không báo lỗi trực tiếp mà trả về kết quả "dự phòng". Ví dụ dịch vụ đề xuất hỏng thì trả về danh sách sản phẩm phổ biến; ảnh đại diện người dùng tải không được thì hiển thị ảnh mặc định.

---

## 5. Kỹ thuật Chaos: Chủ động tìm vấn đề

Ý tưởng cốt lõi của kỹ thuật Chaos là: **thay vì chờ lỗi xảy ra, hãy chủ động tạo ra lỗi**, xác minh khả năng phục hồi của hệ thống trong môi trường có kiểm soát.

| Công cụ | Người đề xuất | Khả năng cốt lõi |
|------|--------|---------|
| Chaos Monkey | Netflix | Ngẫu nhiên chấm dứt instance trong môi trường production |
| Chaos Mesh | PingCAP | Tiêm lỗi trong môi trường K8s |
| Litmus | CNCF | Framework kỹ thuật Chaos cloud-native |
| ChaosBlade | Alibaba | Công cụ tiêm lỗi đa kịch bản |

::: tip Các bước triển khai kỹ thuật Chaos
1. **Xác định trạng thái ổn định**: Làm rõ các chỉ số khi hệ thống hoạt động bình thường (ví dụ độ trễ P99 < 200ms)
2. **Đưa ra giả thuyết**: Nếu một nút nào đó hỏng, hệ thống phải tự phục hồi trong 30 giây
3. **Tiêm lỗi**: Tạo ra lỗi trong phạm vi có kiểm soát (trước ở môi trường test, sau đó lên production)
4. **Quan sát kết quả**: Hệ thống có phục hồi như dự kiến không? Có lỗi dây chuyền không?
5. **Sửa chữa điểm yếu**: Phát hiện vấn đề thì cải thiện kiến trúc và quy trình
:::

---

## Tổng kết

Tính sẵn sàng cao không phải là một tính năng, mà là một khả năng kiến trúc. Nó cần được đảm bảo từ khâu thiết kế, phát triển, triển khai, vận hành — mỗi mắt xích đều quan trọng.

Ôn lại các điểm chính của chương này:

1. **Mấy số 9**: Mỗi thêm một số 9, thời gian ngừng giảm đi một bậc, chi phí và độ phức tạp tăng theo cấp số nhân
2. **Chuyển đổi khi lỗi**: Từ active-standby đến multi-region active-active, chọn kiến trúc phù hợp theo nhu cầu nghiệp vụ
3. **RPO và RTO**: Thiết kế chiến lược sao lưu và phục hồi dựa trên giá trị dữ liệu và mức độ chấp nhận được của nghiệp vụ
4. **Tự động hóa**: Phát hiện lỗi, tự động khởi động lại, circuit breaker và downgrade là hạ tầng cơ bản của HA
5. **Kỹ thuật Chaos**: Chủ động tạo ra lỗi, xác minh khả năng phục hồi của hệ thống trong môi trường có kiểm soát

## Đọc thêm

- [Site Reliability Engineering](https://sre.google/sre-book/table-of-contents/) - Tác phẩm kinh điển Google SRE
- [Chaos Monkey](https://netflix.github.io/chaosmonkey/) - Công cụ kỹ thuật Chaos của Netflix
- [Release It!](https://pragprog.com/titles/mnee2/release-it-second-edition/) - Mẫu thiết kế môi trường production
- [Chaos Mesh](https://chaos-mesh.org/) - Nền tảng kỹ thuật Chaos cho K8s

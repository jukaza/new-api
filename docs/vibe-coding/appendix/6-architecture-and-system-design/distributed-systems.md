# Thách thức của hệ thống phân tán

::: tip Lời mở đầu
**Khi một máy không đủ dùng, vấn đề mới thực sự bắt đầu.** Hệ thống phân tán là nền tảng của Internet hiện đại — từ tin nhắn WeChat đến đặt hàng trên Taobao, phía sau đều là hàng trăm hàng nghìn máy tính phối hợp làm việc. Nhưng "phân tán" không phải là bữa trưa miễn phí, nó mang theo một loạt thách thức mà hệ thống đơn máy chưa từng gặp phải.
:::

**Bài viết này sẽ giúp bạn học được gì?**

Sau khi học xong chương này, bạn sẽ đạt được:

- **Định lý cốt lõi**: Hiểu định lý CAP và ảnh hưởng của nó đến thiết kế hệ thống
- **Mô hình nhất quán**: Phân biệt nhất quán mạnh, nhất quán cuối cùng, nhất quán nhân quả
- **Tám thách thức lớn**: Nắm vững các vấn đề cốt lõi mà hệ thống phân tán phải đối mặt
- **Thuật toán đồng thuận**: Tìm hiểu ý tưởng cơ bản của Paxos, Raft và các thuật toán đồng thuận phân tán khác
- **Mẫu thực chiến**: Quen thuộc với các giải pháp phổ biến như 2PC, Saga, CRDT

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Tại sao cần phân tán | Khả năng mở rộng, tính sẵn sàng, phân bố địa lý |
| **Chương 2** | Định lý CAP | Nhất quán, khả dụng, dung lỗi phân vùng |
| **Chương 3** | Mô hình nhất quán | Nhất quán mạnh, nhất quán cuối, nhất quán nhân quả |
| **Chương 4** | Tám thách thức lớn | Mạng, đồng hồ, phân vùng, split-brain v.v. |
| **Chương 5** | Thuật toán đồng thuận | Paxos, Raft, ZAB |
| **Chương 6** | Giao dịch phân tán | 2PC, Saga, TCC |

---

## 0. Bức tranh toàn cảnh: Tại sao cần hệ thống phân tán?

Hệ thống đơn máy đơn giản và đáng tin cậy, nhưng có ba giới hạn không thể vượt qua:

| Giới hạn | Mô tả | Giải pháp phân tán |
|------|------|-------------|
| Giới hạn hiệu suất | CPU, bộ nhớ, ổ đĩa đơn máy có giới hạn vật lý | Mở rộng ngang: thêm máy để phân tải |
| Điểm lỗi đơn | Một máy hỏng, toàn bộ dịch vụ hỏng | Bản dự phòng: nhiều máy sao lưu cho nhau |
| Độ trễ địa lý | Người dùng ở khắp nơi trên thế giới, máy chỉ có thể ở một nơi | Triển khai nhiều nơi: phục vụ người dùng ở gần |

::: tip Cái giá của phân tán
Hệ thống phân tán giải quyết các vấn đề trên, nhưng mang thêm độ phức tạp mới: mạng không đáng tin cậy, đồng hồ không đồng bộ, lỗi cục bộ, nhất quán dữ liệu... Đây chính là những "thách thức" mà bài viết này sẽ thảo luận.

**Tám sai lầm về tính toán phân tán của Peter Deutsch** cho chúng ta biết rằng các giả định sau trong môi trường phân tán đều sai:
1. Mạng là đáng tin cậy
2. Độ trễ bằng không
3. Băng thông là vô hạn
4. Mạng là an toàn
5. Cấu trúc liên kết không thay đổi
6. Chỉ có một quản trị viên
7. Chi phí truyền tải bằng không
8. Mạng là đồng nhất
:::

---

## 1. Định lý CAP: "Tam giác bất khả thi" của hệ thống phân tán

Năm 2000, Eric Brewer đưa ra phỏng đoán CAP (sau này được chứng minh là định lý): một hệ thống phân tán tối đa chỉ có thể đáp ứng đồng thời hai trong ba thuộc tính sau.

| Thuộc tính | Ý nghĩa | Hiểu đơn giản |
|------|------|---------|
| **C**onsistency (Nhất quán) | Tất cả các nút nhìn thấy cùng một dữ liệu tại cùng một thời điểm | Bạn kiểm tra số dư ở bất kỳ ATM nào, kết quả đều giống nhau |
| **A**vailability (Khả dụng) | Mọi yêu cầu đều nhận được phản hồi không lỗi | Hệ thống luôn có thể phản hồi, không bao giờ nói "dịch vụ không khả dụng" |
| **P**artition tolerance (Dung lỗi phân vùng) | Hệ thống vẫn hoạt động khi mạng bị phân vùng | Ngay cả khi một số dây mạng bị đứt, hệ thống vẫn hoạt động |

<CAPTheoremDemo />

### Tại sao chỉ có thể chọn hai?

Trong môi trường phân tán, phân vùng mạng (P) là không thể tránh khỏi — cáp quang bị đào đứt, thiết bị chuyển mạch hỏng, trung tâm dữ liệu mất mạng. Do đó P là bắt buộc, lựa chọn thực tế là đánh đổi giữa C và A:

- **Chọn CP**: Khi phân vùng, từ chối các yêu cầu không chắc chắn, đảm bảo dữ liệu chính xác → phù hợp tài chính, kho hàng
- **Chọn AP**: Khi phân vùng, vẫn phục vụ, nhưng dữ liệu có thể tạm thời không nhất quán → phù hợp mạng xã hội, nội dung

::: tip CAP không phải đen hoặc trắng
Hệ thống thực tế không đơn giản là "CP hoặc AP". Nhiều hệ thống đưa ra các lựa chọn khác nhau cho các thao tác khác nhau — ví dụ cùng một cơ sở dữ liệu, thao tác đọc có thể là AP (cho phép đọc dữ liệu cũ), thao tác ghi có thể là CP (yêu cầu xác nhận từ đa số).
:::

---

## 2. Mô hình nhất quán: "Mức độ nghiêm ngặt" của đồng bộ dữ liệu

Nhất quán không phải là một công tắc (có hoặc không), mà là một quang phổ. Các mô hình nhất quán khác nhau đánh đổi khác nhau giữa "tính chính xác" và "hiệu suất".

<ConsistencyModelsDemo />

### So sánh mô hình nhất quán

| Mô hình | Đảm bảo | Độ trễ | Phù hợp |
|------|------|------|---------|
| Nhất quán mạnh | Giá trị đọc được chắc chắn là giá trị ghi mới nhất | Cao (cần chờ đồng bộ) | Chuyển khoản ngân hàng, trừ kho |
| Nhất quán cuối cùng | Cuối cùng tất cả bản sao sẽ nhất quán, nhưng giữa chừng có thể đọc giá trị cũ | Thấp (ghi xong trả về ngay) | Bài đăng mạng xã hội, DNS |
| Nhất quán nhân quả | Các thao tác có quan hệ nhân quả được đảm bảo thứ tự | Trung bình | Trả lời bình luận, chỉnh sửa cộng tác |
| Nhất quán tuyến tính | Tất cả thao tác trông giống như thực hiện theo thứ tự trên một máy | Cao nhất | Khóa phân tán, bầu chọn leader |
| Nhất quán phiên | Trong cùng một phiên đảm bảo đọc được dữ liệu mình vừa ghi | Thấp-Trung | Dữ liệu cá nhân người dùng |

::: tip Nhất quán "đọc dữ liệu mình vừa ghi"
Nhu cầu thực tế phổ biến nhất là: sau khi người dùng sửa dữ liệu của mình, họ có thể ngay lập tức thấy cập nhật (nhưng người dùng khác có thể thấy sau). Đây gọi là nhất quán "Read Your Own Writes", là một cải tiến thực dụng của nhất quán cuối cùng.
:::

---

## 3. Tám thách thức lớn: "Bãi mìn" của hệ thống phân tán

Độ phức tạp của hệ thống phân tán không đến từ một vấn đề đơn lẻ, mà từ nhiều vấn đề đan xen nhau. Dưới đây là tám thách thức cốt lõi nhất.

<DistributedChallengesDemo />

### Mối liên hệ giữa các thách thức

Tám thách thức này không độc lập, chúng liên quan chặt chẽ:

- **Mạng không đáng tin cậy** → dẫn đến **Phân vùng mạng** → kích hoạt **Đánh giá CAP**
- **Đồng hồ không đồng bộ** → dẫn đến **Khó sắp xếp sự kiện** → ảnh hưởng **Nhất quán dữ liệu**
- **Lỗi cục bộ** → có thể dẫn đến **Split-brain** → cần **Thuật toán đồng thuận** để giải quyết
- **Nhất quán dữ liệu** → cần **Giao dịch phân tán** → nhưng giao dịch lại bị ảnh hưởng bởi **Mạng không đáng tin cậy**

::: tip Không có viên đạn bạc
Hệ thống phân tán không có giải pháp "hoàn hảo", chỉ có sự đánh đổi "phù hợp". Hiểu bản chất của các thách thức này thì mới đưa ra được sự lựa chọn đúng đắn khi thiết kế hệ thống.
:::

---

## 4. Thuật toán đồng thuận: Làm sao để nhiều máy "đạt được thống nhất"

Thuật toán đồng thuận là cốt lõi của hệ thống phân tán — vấn đề nó giải quyết là: nhiều nút làm sao đạt được thống nhất về một giá trị nào đó? Ngay cả khi một số nút lỗi hoặc mạng bị trễ.

### 4.1 Paxos

Leslie Lamport đưa ra năm 1990, là thuật toán đồng thuận đầu tiên được chứng minh tính chính xác một cách nghiêm ngặt.

| Vai trò | Trách nhiệm |
|------|------|
| Proposer | Đề xuất proposal (giá trị) |
| Acceptor | Bình chọn chấp nhận hoặc từ chối proposal |
| Learner | Học giá trị cuối cùng được chọn |

**Quy trình hai giai đoạn**:
1. **Giai đoạn Prepare**: Proposer gửi số proposal, Acceptor cam kết không chấp nhận proposal có số nhỏ hơn
2. **Giai đoạn Accept**: Proposer gửi giá trị cụ thể, đa số Acceptor chấp nhận thì proposal thông qua

::: tip Vấn đề của Paxos
Paxos tuy chính xác nhưng nổi tiếng là khó hiểu và khó triển khai. Chính bài báo của Lamport đã dùng một phép ẩn dụ về nghị viện Hy Lạp, kết quả làm nhiều người càng bối rối hơn.
:::

### 4.2 Raft: Ra đời vì khả năng hiểu được

Năm 2014 Diego Ongaro đưa ra Raft, mục tiêu là tạo ra một "Paxos dễ hiểu". Nó phân giải bài toán đồng thuận thành ba bài toán con:

| Bài toán con | Mô tả |
|--------|------|
| Bầu chọn Leader | Bầu ra một Leader trong cụm, mọi thao tác ghi đều đi qua Leader |
| Sao chép nhật ký | Leader sao chép nhật ký thao tác đến tất cả Follower |
| Tính an toàn | Đảm bảo nhật ký đã commit không bị ghi đè |

**Quy trình cốt lõi của Raft**:
1. Khi cụm khởi động, tất cả các nút đều là Follower
2. Nếu Follower hết thời gian chờ không nhận được heartbeat từ Leader, sẽ trở thành Candidate và khởi động bầu cử
3. Candidate nhận được đa số phiếu sẽ trở thành Leader mới
4. Leader nhận yêu cầu từ client, sao chép nhật ký đến đa số nút rồi commit

### 4.3 So sánh thuật toán đồng thuận

| Thuật toán | Năm đề xuất | Khả năng hiểu | Hệ thống sử dụng |
|------|---------|---------|---------|
| Paxos | 1990 | Khó | Google Chubby |
| Raft | 2014 | Dễ | etcd, Consul, TiKV |
| ZAB | 2011 | Trung bình | ZooKeeper |
| EPaxos | 2013 | Khó | Chủ yếu là nghiên cứu học thuật |

---

## 5. Giao dịch phân tán: "Tất cả hoặc không có gì" xuyên nút

Giao dịch của cơ sở dữ liệu đơn máy có thể thực hiện ACID thông qua khóa cục bộ và nhật ký. Nhưng khi một thao tác nghiệp vụ liên quan đến nhiều dịch vụ/cơ sở dữ liệu, làm sao đảm bảo tính nguyên tử?

### 5.1 Two-Phase Commit (2PC)

Giao thức giao dịch phân tán kinh điển nhất, chia thành hai giai đoạn:

| Giai đoạn | Hành động của Coordinator | Hành động của Participant |
|------|-----------|-----------|
| Prepare | Hỏi tất cả participant "có thể commit không?" | Thực hiện thao tác nhưng không commit, trả lời Yes/No |
| Commit | Nếu tất cả Yes, gửi Commit | Commit chính thức; nếu có No, tất cả rollback |

**Vấn đề của 2PC**:
- **Chặn**: Sau Prepare nếu coordinator hỏng, participant sẽ chờ mãi
- **Điểm lỗi đơn**: Coordinator là điểm đơn, hỏng thì toàn bộ giao dịch bị treo
- **Hiệu suất kém**: Cần nhiều lần truyền tin mạng, thời gian giữ khóa dài

### 5.2 Mô hình Saga

Saga chia một giao dịch lớn thành nhiều giao dịch cục bộ, mỗi giao dịch cục bộ có thao tác bù đắp tương ứng. Nếu một bước thất bại, sẽ thực hiện bù đắp theo thứ tự ngược lại.

**Ví dụ Saga đặt hàng thương mại điện tử**:

| Bước | Thao tác thuận | Thao tác bù đắp |
|------|---------|---------|
| T1 | Tạo đơn hàng (chờ thanh toán) | Hủy đơn hàng |
| T2 | Trừ kho hàng | Khôi phục kho |
| T3 | Trừ số dư | Hoàn trả số dư |
| T4 | Xác nhận đơn hàng (đã thanh toán) | — |

Nếu T3 (trừ số dư) thất bại: thực hiện C2 (khôi phục kho) → C1 (hủy đơn hàng).

**Hai cách điều phối**:
- **Biên đạo (Choreography)**: Mỗi dịch vụ lắng nghe sự kiện, tự quyết định bước tiếp theo. Đơn giản nhưng khó theo dõi trạng thái toàn cục
- **Điều phối (Orchestration)**: Có một coordinator trung tâm điều khiển luồng. Rõ ràng nhưng coordinator là điểm đơn

### 5.3 TCC (Try-Confirm-Cancel)

TCC là triển khai 2PC ở tầng nghiệp vụ, chia mỗi thao tác thành ba giai đoạn:

| Giai đoạn | Mô tả | Ví dụ (trừ kho) |
|------|------|---------------|
| Try | Dự trữ tài nguyên, nhưng không thực sự thực hiện | Đông lạnh 10 sản phẩm (kho khả dụng -10, kho đông lạnh +10) |
| Confirm | Xác nhận thực hiện, tiêu thụ tài nguyên đã dự trữ | Kho đông lạnh -10 (trừ thực sự) |
| Cancel | Hủy dự trữ, giải phóng tài nguyên | Kho đông lạnh -10, kho khả dụng +10 (khôi phục) |

### 5.4 So sánh ba phương án

| Phương án | Nhất quán | Hiệu suất | Độ phức tạp | Phù hợp |
|------|--------|------|--------|---------|
| 2PC | Nhất quán mạnh | Thấp | Trung bình | Giao dịch liên cơ sở dữ liệu ở tầng DB |
| Saga | Nhất quán cuối | Cao | Cao | Quy trình nghiệp vụ dài (đơn hàng, logistics) |
| TCC | Nhất quán cuối | Trung bình | Cao nhất | Kịch bản tài chính độ tin cậy cao |

::: tip Gợi ý lựa chọn thực tế
- Có thể dùng giao dịch đơn cơ sở thì không nên dùng giao dịch phân tán
- Hầu hết kịch bản nghiệp vụ dùng Saga + hàng đợi tin nhắn là đủ
- TCC phù hợp với kịch bản tài chính yêu cầu nhất quán cực cao, nhưng chi phí phát triển rất cao
- 2PC phù hợp cho middleware cơ sở dữ liệu (như ShardingSphere) xử lý tự động
:::

---

## Tổng kết

Hệ thống phân tán là hạ tầng của Internet hiện đại, nhưng độ phức tạp của nó vượt xa hệ thống đơn máy. Hiểu các thách thức này không phải để "giải quyết" chúng (nhiều vấn đề là mang tính bản chất), mà để đưa ra sự đánh đổi đúng đắn khi thiết kế hệ thống.

Ôn lại các điểm chính của chương này:

1. **Định lý CAP**: Phân vùng mạng không thể tránh khỏi, lựa chọn thực tế là đánh đổi giữa nhất quán và khả dụng
2. **Mô hình nhất quán**: Từ nhất quán mạnh đến nhất quán cuối là một quang phổ, chọn theo nhu cầu nghiệp vụ
3. **Tám thách thức lớn**: Mạng không đáng tin cậy, đồng hồ không đồng bộ, phân vùng mạng, split-brain v.v. liên quan chặt chẽ
4. **Thuật toán đồng thuận**: Raft là thuật toán đồng thuận thực dụng nhất hiện nay, etcd/Consul đều dựa trên nó
5. **Giao dịch phân tán**: Saga phù hợp hầu hết kịch bản, TCC phù hợp kịch bản tài chính, 2PC phù hợp tầng cơ sở dữ liệu

## Đọc thêm

- [Designing Data-Intensive Applications](https://dataintensive.net/) - Tác phẩm kinh điển về hệ thống phân tán của Martin Kleppmann
- [The Raft Consensus Algorithm](https://raft.github.io/) - Bản demo trực quan chính thức của Raft
- [CAP Twelve Years Later](https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/) - Brewer nhìn lại CAP
- [Jepsen](https://jepsen.io/) - Framework kiểm tra tính chính xác của hệ thống phân tán
- [Mẫu hệ thống phân tán](https://martinfowler.com/articles/patterns-of-distributed-systems/) - Bộ sưu tập mẫu phân tán của Martin Fowler

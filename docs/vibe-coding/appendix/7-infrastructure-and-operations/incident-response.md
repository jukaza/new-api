# Xử lý sự cố và Phản ứng khẩn cấp

::: tip Lời nói đầu
**Ba giờ sáng, điện thoại rung liên tục, dịch vụ trực tuyến sụp đổ hoàn toàn — bạn phải làm gì?** Đối với bất kỳ đội ngũ Internet nào, sự cố không phải là câu hỏi "có xảy ra hay không", mà là "k nào xảy ra". Đội ngũ xuất sắc không phải là đội không bao giờ có sự cố, mà là đội có thể phản ứng nhanh chóng, phục hồi hiệu quả, và học hỏi để không lặp lại sai lầm.
:::

**Bài viết này sẽ giúp bạn học được gì?**

Sau khi học xong chương này, bạn sẽ có được:

- **Nhận thức phân cấp**: nắm vững tiêu chuẩn phân cấp mức độ nghiêm trọng sự cố P0~P4
- **Quy trình phản ứng**: hiểu dòng thời gian phản ứng sự cố hoàn chỉnh từ phát hiện đến phục hồi
- **Hợp tác tổ chức**: tìm hiểu phân công vai trò và cơ chế hợp tác trong hệ thống chỉ huy sự cố
- **Hệ thống cảnh báo**: nắm vững chiến lược nâng cấp cảnh báo, đảm bảo vấn đề quan trọng không bị bỏ sót
- **Phương pháp postmortem**: học cách dùng "Năm câu Hỏi Tại sao" để tìm nguyên nhân gốc, viết báo cáo postmortem có giá trị

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Phân cấp mức độ nghiêm trọng | P0~P4, đánh giá phạm vi ảnh hưởng |
| **Chương 2** | Dòng thời gian phản ứng | Phát hiện → Phản ứng → Phục hồi → Postmortem |
| **Chương 3** | Hệ thống chỉ huy | IC, Trưởng truyền thông, Trưởng kỹ thuật |
| **Chương 4** | Nâng cấp cảnh báo | Cảnh báo phân cấp, nâng cấp từng cấp |
| **Chương 5** | Postmortem | Năm câu Hỏi Tại sao, văn hóa không đổ lỗi |

---

## 0. Toàn cảnh: Sự cố là người thầy tốt nhất

Netflix có một công cụ nổi tiếng gọi là Chaos Monkey — nó sẽ ngẫu nhiên tiêu diệt máy chủ trong môi trường sản xuất. Nghe có vẻ điên rồ, nhưng logic đằng sau rất rõ ràng: **thà chủ động tạo ra sự cố để rèn luyện năng lực phản ứng của đội ngũ còn hơn đợi sự cố tìm đến tận cửa**.

Phản ứng khẩn cấp không dựa vào ứng biến tại chỗ, mà dựa vào hệ thống hóa dựa trên **quy trình, vai trò, công cụ** ba trong một. Giống như đội cứu hỏa không phải đợi cháy mới thành lập — họ luôn huấn luyện, diễn tập, bảo trì trang thiết bị.

::: tip Bốn yếu tố cốt lõi của phản ứng khẩn cấp
- **Phát hiện nhanh**: hệ thống giám sát và cảnh báo hoàn chỉnh, đảm bảo vấn đề được phát hiện trước khi người dùng cảm nhận được
- **Hợp tác hiệu quả**: phân công vai trò rõ ràng và cơ chế giao tiếp, tránh làm trùng lặp trong hỗn loạn
- **Phục hồi nhanh**: ưu tiên khôi phục dịch vụ, không phải ưu tiên tìm nguyên nhân gốc. Cầm máu trước, chữa bệnh sau
- **Cải tiến liên tục**: mỗi sự cố là cơ hội học hỏi, thông qua postmortem không ngừng hoàn thiện hệ thống và quy trình
:::

---

## 1. Phân cấp mức độ nghiêm trọng: Không phải mọi sự cố đều cần "đội ngũ tổng động viên"

Một nút bấm hiển thị sai màu và toàn bộ hệ thống thanh toán sụp đổ rõ ràng không cùng một mức độ vấn đề. **Phân cấp sự cố** nhằm mục đích giúp đội ngũ phản ứng với cường độ phù hợp cho từng mức độ vấn đề — không phản ứng thái quá gây lãng phí tài nguyên, cũng không coi nhẹ vấn đề dẫn đến mở rộng thiệt hại.

<SeverityLevelDemo />

| Cấp độ | Tên | Phạm vi ảnh hưởng | Yêu cầu phản ứng | Ví dụ |
|------|------|---------|---------|------|
| P0 | Nguy hiểm | Nghiệp vụ cốt lõi hoàn toàn không khả dụng | Phản ứng ngay lập tức, toàn bộ chờ lệnh | Hệ thống thanh toán sụp đổ, rò rỉ dữ liệu |
| P1 | Nghiêm trọng | Chức năng cốt lõi bị ảnh hưởng nghiêm trọng | Phản ứng trong 15 phút | Tỷ lệ đăng nhập thất bại > 50%, API timeout diện rộng |
| P2 | Quan trọng | Một số chức năng bất thường | Phản ứng trong 1 giờ | Kết quả tìm kiếm không chính xác, một số trang 500 |
| P3 | Bình thường | Chức năng không cốt lõi bất thường | Xử lý trong giờ làm việc | Tải avatar thất bại, thông báo không quan trọng bị trễ |
| P4 | Nhẹ | Vấn đề trải nghiệm | Xếp vào kế hoạch sprint | UI lệch, sai văn bản |

::: tip Nguyên tắc chính của phân cấp
- **Số người dùng bị ảnh hưởng**: P2 ảnh hưởng 100% người dùng có thể khẩn cấp hơn P1 ảnh hưởng 1%
- **Thiệt hại kinh doanh**: vấn đề ảnh hưởng trực tiếp đến doanh thu (thanh toán, đặt hàng) có ưu tiên cao hơn
- **Có thể hạ cấp**: nếu có giải pháp tạm thời giảm nhẹ ảnh hưởng, có thể hạ cấp xử lý
- **Điều chỉnh linh hoạt**: khi điều tra sâu hơn, cấp độ có thể được nâng lên hoặc hạ xuống
:::

---

## 2. Dòng thời gian phản ứng: Quy trình hoàn chỉnh từ phát hiện đến postmortem

Một lần phản ứng sự cố giống như một cuộc chạy tiếp sức, mỗi giai đoạn đều có mục tiêu và điểm giao nhận rõ ràng. Dòng thời gian rõ ràng giúp đội ngũ duy trì trật tự trong hỗn loạn.

<IncidentTimelineDemo />

::: tip Năm giai đoạn phản ứng sự cố
1. **Phát hiện (Detection)**: phát hiện bất thường thông qua cảnh báo giám sát, phản hồi người dùng hoặc kiểm tra nội bộ. Mục tiêu: phát hiện sớm nhất, rút ngắn MTTD (thời gian phát hiện trung bình).
2. **Phản ứng (Response)**: xác nhận sự cố, đánh giá mức độ nghiêm trọng, triệu tập đội phản ứng, thiết lập kênh liên lạc. Mục tiêu: tổ chức nhanh chóng lực lượng phản ứng hiệu quả.
3. **Giảm nhẹ (Mitigation)**: áp dụng biện pháp tạm thời để khôi phục dịch vụ, như rollback triển khai, chuyển sang node dự phòng, giới hạn lưu lượng, hạ cấp. Mục tiêu: cầm máu trước, khôi phục trải nghiệm người dùng.
4. **Khắc phục (Resolution)**: tìm nguyên nhân gốc và sửa chữa triệt để. Mục tiêu: loại bỏ mối nguy hiểm, ngăn chặn tái phát.
5. **Postmortem (Postmortem)**: xem lại toàn bộ quá trình, phân tích nguyên nhân gốc, xây dựng biện pháp cải tiến. Mục tiêu: học hỏi từ sự cố, làm cho hệ thống vững chắc hơn.
:::

| Chỉ số | Ý nghĩa | Hướng tối ưu |
|------|------|---------|
| MTTD | Thời gian phát hiện trung bình | Cải thiện độ phủ giám sát, giảm ngưỡng cảnh báo |
| MTTR | Thời gian phục hồi trung bình | Tự động hóa phục hồi, diễn tập phương án |
| MTBF | Thời gian giữa các lần sự cố trung bình | Nâng cao độ tin cậy hệ thống, loại bỏ điểm lỗi đơn |

---

## 3. Hệ thống chỉ huy: Ai chỉ huy "trận chiến" này?

Trong các sự cố lớn, điều đáng sợ nhất không phải là vấn đề kỹ thuật khó, mà là **hỗn loạn** — hơn chục người cùng điều tra, không ai biết người khác đang làm gì, thông tin quan trọng bị phân mảnh trong các nhóm chat khác nhau. Hệ thống Chỉ huy Sự cố (Incident Command System) sinh ra để giải quyết vấn đề này.

<IncidentCommandDemo />

::: tip Ba vai trò cốt lõi
1. **Chỉ huy Sự cố (Incident Commander, IC)**: người chịu trách nhiệm tổng thể về toàn bộ phản ứng sự cố. Chịu trách nhiệm ra quyết định, phối hợp tài nguyên, kiểm soát nhịp độ. IC không nhất thiết phải là người mạnh nhất về kỹ thuật, nhưng phải là người bình tĩnh nhất và có tầm nhìn tổng thể nhất.
2. **Trưởng Truyền thông (Communication Lead)**: chịu trách nhiệm giao tiếp bên ngoài — cập nhật trang trạng thái, thông báo khách hàng, đồng báo cáo ban lãnh đạo. Giúp IC và nhân viên kỹ thuật tập trung giải quyết vấn đề, không bị gián đoạn bởi công việc giao tiếp.
3. **Trưởng Kỹ thuật (Tech Lead)**: chịu trách nhiệm điều tra và sửa chữa ở mặt kỹ thuật. Tổ chức nhân viên kỹ thuật phân công phối hợp, báo cáo tiến độ và phương án cho IC.
:::

---

## 4. Nâng cấp cảnh báo: Đảm bảo vấn đề quan trọng không bị bỏ sót

Hệ thống cảnh báo là "đôi mắt" của phản ứng sự cố. Nhưng cảnh báo quá ít sẽ bị bỏ sót, cảnh báo quá nhiều sẽ dẫn đến "mệt mỏi cảnh báo" — khi nhận hàng trăm cảnh báo mỗi ngày, cảnh báo thực sự quan trọng rất dễ bị chìm lấp. **Chiến lược nâng cấp cảnh báo** chính là chìa khóa giải quyết vấn đề này.

<AlertEscalationDemo />

::: tip Cơ chế nâng cấp cảnh báo ba tầng
1. **Phản ứng tuyến 1 (L1)**: khi cảnh báo kích hoạt, thông báo trước cho kỹ sư trực. Nếu không xác nhận trong 15 phút, tự động nâng cấp.
2. **Nâng cấp tuyến 2 (L2)**: thông báo cho trưởng nhóm và chuyên gia lĩnh vực liên quan. Nếu không giảm nhẹ trong 30 phút, tiếp tục nâng cấp.
3. **Nâng cấp tuyến 3 (L3)**: thông báo cho Giám đốc Kỹ thuật và ban lãnh đạo, kích hoạt phản ứng khẩn cấp toàn diện.
:::

| Cấp cảnh báo | Phương thức thông báo | Thời hạn phản ứng | Điều kiện nâng cấp |
|---------|---------|---------|---------|
| Warning | Tin nhắn IM | Xử lý trong giờ làm việc | Kéo dài 30 phút không phục hồi |
| Critical | Điện thoại + IM | Xác nhận trong 15 phút | Không xác nhận hoặc không giảm nhẹ |
| Fatal | Gọi điện liên tục + SMS | Phản ứng trong 5 phút | Tự động nâng cấp lên ban lãnh đạo |

---

## 5. Postmortem: Học hỏi từ sự cố

Sau khi phục hồi sự cố, bước quan trọng nhất là **postmortem**. Postmortem không phải để đổ lỗi, mà để tìm cơ hội cải thiện mang tính hệ thống. Google, Meta và các công ty khác đều thực hành văn hóa "postmortem không đổ lỗi" — tập trung vào "tại sao hệ thống cho phép lỗi này xảy ra", thay vì "ai đã phạm sai lầm này".

<PostmortemDemo />

::: tip Phương pháp phân tích "Năm câu Hỏi Tại sao"
Xuất phát từ hiện tượng bề mặt, liên tục hỏi "tại sao" cho đến khi tìm được nguyên nhân gốc:
1. **Tại sao dịch vụ sụp đổ?** → Pool kết nối cơ sở dữ liệu cạn kiệt
2. **Tại sao pool kết nối cạn kiệt?** → Truy vấn chậm chiếm kết nối không giải phóng
3. **Tại sao có truy vấn chậm?** → Thiếu index, quét toàn bộ bảng
4. **Tại sao thiếu index?** → Không có DBA review khi bảng mới lên tuyến
5. **Tại sao không có review?** → Không có quy trình review SQL bắt buộc

Nguyên nhân gốc không phải là "ai đó quên thêm index", mà là "thiếu quy trình review SQL". Chỉ sửa nguyên nhân gốc mới ngăn chặn tái phát.
:::

---

## Tóm tắt

Xử lý sự cố và phản ứng khẩn cấp là năng lực bắt buộc của mọi đội ngũ kỹ thuật. Nó không dựa vào sự anh hùng cá nhân, mà dựa vào quy trình hệ thống hóa, phân công vai trò rõ ràng và cải tiến liên tục thông qua postmortem.

Ôn lại các điểm chính của chương này:

1. **Phản ứng phân cấp**: phân cấp P0~P4 đảm bảo cường độ phản ứng phù hợp với mức độ vấn đề
2. **Dòng thời gian rõ ràng**: Phát hiện → Phản ứng → Giảm nhẹ → Khắc phục → Postmortem, mỗi giai đoạn có mục tiêu rõ ràng
3. **Hệ thống chỉ huy**: IC + Trưởng truyền thông + Trưởng kỹ thuật, phối hợp tránh hỗn loạn
4. **Nâng cấp cảnh báo**: cảnh báo phân cấp + tự động nâng cấp, đảm bảo vấn đề quan trọng không bị bỏ sót
5. **Postmortem không đổ lỗi**: dùng "Năm câu Hỏi Tại sao" tìm nguyên nhân gốc, tập trung cải thiện hệ thống thay vì đổ lỗi cá nhân

## Đọc thêm

- [Google SRE Book - Incident Response](https://sre.google/sre-book/managing-incidents/) - Thực hành quản lý sự cố của Google
- [PagerDuty Incident Response Guide](https://response.pagerduty.com/) - Hướng dẫn phản ứng khẩn cấp mã nguồn mở của PagerDuty
- [Atlassian Incident Management](https://www.atlassian.com/incident-management) - Thực hành tốt nhất về quản lý sự cố của Atlassian
- [Learning from Incidents](https://www.learningfromincidents.io/) - Tài nguyên cộng đồng học hỏi từ sự cố
- [Chaos Engineering (O'Reilly)](https://www.oreilly.com/library/view/chaos-engineering/9781492043850/) - Nguyên lý và thực hành kỹ thuật hỗn loạn

# Từ Transistor đến CPU

::: tip Lời nói đầu
**Máy tính "tư duy" như thế nào?** Bạn có thể biết CPU là "não" của máy tính, nhưng bộ não này thực chất hoạt động ra sao? Làm sao từ kim loại và nhựa, nó lại thành thiết bị thông minh có thể thực thi chương trình và xử lý dữ liệu? Chương này sẽ dẫn bạn từ transistor cơ bản nhất đến khi hiểu nguyên lý xây dựng CPU.
:::

**Bài viết này sẽ giúp bạn học gì?**

- **Hiểu thuật ngữ**: "tần số CPU", "đa nhân", "tập lệnh" không còn là bí ẩn.
- **Góc nhìn thực thi code**: thấy một dòng code đi qua fetch, decode, execute, writeback như thế nào.
- **Tư duy lớp trừu tượng**: hiểu mỗi lớp phục vụ lớp trên như thế nào.

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Transistor | Công tắc của thế giới số |
| **Chương 2** | Cổng logic | Thực hiện vật lý của logic Boolean |
| **Chương 3** | Đơn vị chức năng | Bộ cộng, thanh ghi, multiplexer |
| **Chương 4** | Nhân CPU | Fetch, decode, execute, writeback |

---

## 0. Toàn cảnh: Từ cát đến trí tuệ

Khả năng "tư duy" của máy tính hiện đại xuất phát từ điều rất đơn giản: **công tắc**.

Khi dòng điện chạy qua công tắc, biểu diễn là "1"; khi không chạy, là "0". Nếu có hàng tỷ công tắc như vậy, và có thể làm **đầu ra của một công tắc điều khiển công tắc khác**, có thể xây dựng mạng logic cực kỳ phức tạp.

Từ cát đến trí tuệ, có bốn cấp độ:

::: tip Phân tích từng lớp
- **Lớp 1: Transistor (hàng tỷ)** -- "Công tắc" cơ bản nhất. MOSFET: áp điện vào cổng cho dòng chạy giữa nguồn và thớt.
- **Lớp 2: Cổng logic (hàng tỷ)** -- Transistor kết nối thành AND, OR, NOT, XOR -- toán Boolean trên mạch điện.
- **Lớp 3: Đơn vị chức năng (hàng trăm)** -- Tổ hợp cổng logic: bộ cộng, multiplexer, thanh ghi.
- **Lớp 4: Nhân CPU (1-128 nhân)** -- Trung tâm chỉ huy: fetch, decode, execute, writeback.
:::

---

## 1. Transistor: Công tắc của thế giới số

<TransistorDemo />

### 1.1 Transistor là gì?

**Transistor** là thiết bị bán dẫn có thể trừu tượng thành "công tắc" hoàn hảo:
- **Nguồn (Source)** và **Thớt (Drain)**: như hai đầu ống nước.
- **Cổng (Gate)**: van điều khiển dòng chảy.

Điều khiển bằng **điện áp** thay bằng tay. Khi một công tắc có thể được điều khiển bởi tín hiệu điện của công tắc khác, chúng ta đã vượt qua khoảng cách từ "can thiệp nhân công" đến "tính toán tự động".

### 1.2 Biểu diễn 0 và 1 như thế nào?

- **Điện áp cao (vd: 3.3V)** = logic **1**
- **Điện áp thấp (gần 0V)** = logic **0**

### 1.3 Tiến hóa số lượng transistor

| Năm | Xử lý | Transistor | Quy trình |
| ---- | ---------- | ------------ | ------- |
| 1971 | Intel 4004 | 2,300 | 10um |
| 1993 | Intel Pentium | 3.1M | 800nm |
| 2006 | Core 2 Duo | 291M | 65nm |
| 2020 | Apple M1 | 16B | 5nm |
| 2023 | Apple M3 Max | 92B | 3nm |

---

## 2. Cổng logic: Tính toán bằng công tắc

<LogicGateDemo />

### 2.1 Cổng cơ bản

- **AND**: Tất cả đầu vào phải là 1 thì đầu ra mới là 1.
- **OR**: Chỉ cần một đầu vào là 1, đầu ra là 1.
- **NOT**: Đảo ngược đầu vào.
- **XOR**: Đầu ra là 1 khi hai đầu vào khác nhau.

### 2.2 Cộng bằng cổng logic

Một XOR (tính tổng) + một AND (tính nhớ) = **Bộ cộng nửa (Half Adder)**.

<HalfAdderDemo />

Bộ cộng nửa chỉ nhận hai đầu vào. Để cộng nhiều số cần **Bộ cộng đầy đủ (Full Adder)** nhận ba đầu vào.

<FullAdderDemo />

Nối nhiều bộ cộng đầy đủ để cộng nhiều bit:

<AdderChainDemo />

<CompleteAdderDemo />

---

## 3. Đơn vị chức năng: Tổ hợp cổng logic

| Module | Nhiệm vụ | Ví dụ |
| ------ | ------ | -------- |
| **Bộ cộng** | Động cơ số học | Bàn tính không mệt |
| **Multiplexer** | Điều khiển luồng dữ liệu | Ngành đường sắt |
| **Giải mã** | Dịch lệnh nhị phân | Giải mã mật |
| **Flip-Flop** | Ghi trạng thái | Cân bằng giữ vị trí |

<FunctionalUnitDemo />

### 3.1 Thanh ghi: Lưu trữ dữ liệu

<RegisterDemo />

Bộ nhớ được tạo bằng **phản hồi**: đầu ra quay lại đầu vào, tạo vòng kín giữ trạng thái. Khi 32 hoặc 64 flip-flop được xếp hàng dưới cùng tín hiệu đồng hồ, ta có **thanh ghi**.

<FlipFlopDemo />

---

## 4. Kiến trúc CPU: Từ đơn vị chức năng đến xử lý

### 4.1 Thành phần chính

- **ALU**: thực hiện phép toán.
- **Ngăn thanh ghi**: lưu trữ tạm thời siêu nhanh.
- **Bus nội bộ**: vận chuyển dữ liệu giữa các module.
- **Đơn vị điều khiển**: đọc lệnh, tạo tín hiệu điều khiển.

<MinCpuDemo />

### 4.2 CPU thực thi lệnh như thế nào?

1. **Fetch**: Đọc lệnh từ bộ nhớ.
2. **Decode**: Phân tích thực hiện phép toán gì.
3. **Execute**: Thực hiện phép toán tại ALU.
4. **Write Back**: Ghi kết quả vào thanh ghi hoặc bộ nhớ.

<CpuArchitectureDemo />

::: tip Pipeline: Tối ưu hiệu suất tối đa
Thay vì chờ một lệnh hoàn thành 4 bước rồi mới bắt đầu lệnh tiếp theo, **pipeline** cho phép chồng lệnh: trong khi lệnh A thực thi, lệnh B được giải mã và lệnh C được lấy về.
:::

---

## 5. Tóm tắt: Qua các lớp trừu tượng

1. **Vật lý macro**: Cát (Silic dioxide).
2. **Vật lý micro**: Hàng tỷ transistor.
3. **Đại số số**: Cổng logic AND/OR/NOT.
4. **Module vi kiến trúc**: Đơn vị chức năng.
5. **Kiến trúc phức tạp**: CPU.
6. **Ứng dụng**: Phần mềm và Internet.

::: tip Suy nghĩ cuối
**Công sức tính toán chỉ là hàng tỷ công tắc sắp xếp lại trong không gian kín; theo những nhịp đồng hồ, hoàn thành tính toán phức tạp trên mảnh silic nhỏ này.**

"Lượng dẫn đến chất lượng" -- câu này được chứng minh liên tục trong kiến trúc máy tính.
:::

---

## Đọc thêm

- **Sách kinh điển**: "Computer Organization and Design" - Patterson & Hennessy
- **Mô phỏng logic số**: Xây dựng bộ cộng 8 bit
- **Kiến trúc nâng cao**: Cache đa cấp, thực thi ngoài trình tự, GPU
- **Ngôn ngữ assembly**: Hiểu code cấp cao thành lệnh máy như thế nào

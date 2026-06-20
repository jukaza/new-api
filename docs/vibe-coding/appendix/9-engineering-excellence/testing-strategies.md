# Chiến lược kiểm thử

::: tip Lời nói đầu
**Code của bạn thực sự "không vấn đề" không?** Mỗi lần sửa code xong lại bấm thử xem có hỏng gì không — cách này khi dự án còn nhỏ thì tạm được, nhưng khi code lên hàng vạn dòng, nhóm mở rộng hơn chục người, thì "bấm thử xem" là một thảm họa.

Chương này giúp bạn hiểu các chiến lược kiểm thử phần mềm cốt lõi, từ kim tự tháp test đến TDD, xây dựng tư duy đảm bảo chất lượng hệ thống.
:::

**Bài viết này sẽ giúp bạn học được gì?**

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Kim tự tháp test | Tầng và tỷ lệ của kiểm thử |
| **Chương 2** | Thực hành unit test | Cách viết một test tốt |
| **Chương 3** | Phát triển hướng TDD | Vòng lặp Đỏ-Xanh-Tái cấu trúc |
| **Chương 4** | Lựa chọn chiến lược test | Giải pháp cho các tình huống khác nhau |

Sau khi học xong chương này, bạn sẽ hiểu cách chọn chiến lược test phù hợp cho dự án, viết test có giá trị và nâng cao chất lượng thiết kế code thông qua TDD.

---

## 0. Tổng quan: Tại sao cần kiểm thử tự động?

Hãy tưởng tượng bạn là kỹ sư xây dựng. Mỗi lần sửa bản vẽ, bạn không tự leo lên từng tầng để kiểm tra kết cấu có an toàn không — bạn dựa vào một **hệ thống kiểm tra tự động**. Kiểm thử phần mềm chính là "hệ thống kiểm tra kết cấu" của thế giới code.

::: tip Giá trị của kiểm thử tự động
- **Bảo vệ hồi quy**: Khi sửa tính năng A, tự động phát hiện B, C, D có bị ảnh hưởng không
- **Tự tin tái cấu trúc**: Code có test coverage, tái cấu trúc an tâm hơn
- **Tài liệu sống**: Test tốt là tài liệu sử dụng tốt nhất
- **Phản hồi nhanh**: Biết code đúng hay sai trong vài giây, thay vì đến khi deploy mới phát hiện vấn đề
:::

---

## 1. Kim tự tháp test: Tầng và tỷ lệ kiểm thử

### 1.1 Kim tự tháp ba tầng

Kim tự tháp test do Mike Cohn đề xuất là mô hình kinh điển của chiến lược test. Nó cho chúng ta biết: **các loại test khác nhau nên có tỷ lệ số lượng khác nhau**.

Thông qua component tương tác dưới đây, nhấp vào từng tầng kim tự tháp để tìm hiểu đặc điểm của từng loại test:

<TestPyramidDemo />

### 1.2 Tại sao có hình kim tự tháp?

Hình kim tự tháp phản ánh một sự đánh đổi cốt lõi: **sự cân bằng giữa tốc độ và độ chân thực**.

- **Tầng dưới (unit test)**: Cực kỳ nhanh, số lượng nhiều nhất, chi phí thấp nhất, nhưng chỉ kiểm tra từng linh kiện đơn lẻ
- **Tầng giữa (integration test)**: Tốc độ vừa phải, số lượng vừa phải, kiểm tra sự phối hợp giữa các linh kiện
- **Tầng trên (E2E test)**: Gần với người dùng thực nhất, nhưng chậm, chi phí bảo trì cao, dễ fail do vấn đề môi trường

> **Anti-pattern: Kem ốc quế** — Nếu dự án của bạn E2E test nhiều nhất, unit test ít nhất, thì đó là "kem ốc quế" úp ngược. Điều này có nghĩa là test suite chạy chậm, hay fail, chi phí bảo trì cực cao.

---

## 2. Thực hành unit test

### 2.1 Unit test tốt là gì?

Unit test tốt tuân theo nguyên tắc **FIRST**:

| Nguyên tắc | Ý nghĩa | Giải thích |
|------|------|------|
| **F**ast | Nhanh | Hoàn thành trong mili-giây, developer sẵn sàng chạy thường xuyên |
| **I**ndependent | Độc lập | Các test không phụ thuộc lẫn nhau, có thể chạy riêng |
| **R**epeatable | Lặp lại được | Kết quả nhất quán trong mọi môi trường |
| **S**elf-validating | Tự xác minh | Kết quả rõ ràng pass/fail, không cần con người phán đoán |
| **T**imely | Kịp thời | Viết cùng lúc với code (hoặc trước khi viết code) |

### 2.2 Cấu trúc test: Mô hình AAA

Mỗi test nên có cấu trúc ba phần rõ ràng:

```javascript
test('nên tính đúng giá có thuế', () => {
  // Arrange (Chuẩn bị) — Thiết lập dữ liệu test
  const price = 100
  const taxRate = 0.13

  // Act (Thực thi) — Gọi hàm cần test
  const result = calculateTotalWithTax(price, taxRate)

  // Assert (Kiểm chứng) — Xác minh kết quả
  expect(result).toBe(113)
})
```

### 2.3 Test cái gì? Không test cái gì?

**Nên test:**
- Logic nghiệp vụ cốt lõi (tính giá, kiểm tra quyền, chuyển đổi dữ liệu)
- Điều kiện biên (null, zero, số âm, số cực lớn)
- Xử lý lỗi

**Không cần test:**
- Implementation nội bộ của thư viện bên thứ ba
- Getter/setter đơn giản
- Chức năng của framework (như hệ thống reactive của Vue)

---

## 3. TDD: Phát triển hướng kiểm thử

### 3.1 Vòng lặp Đỏ-Xanh-Tái cấu trúc

Cốt lõi của TDD (Test-Driven Development) là một vòng lặp đơn giản: **viết test trước, rồi viết implementation, cuối cùng tái cấu trúc**.

Thông qua component tương tác dưới đây, trải nghiệm trực tiếp vòng lặp TDD hoàn chỉnh:

<TDDCycleDemo />

### 3.2 Ba quy tắc của TDD

1. **Không viết bất kỳ production code nào, trừ khi để làm một test thất bại pass**
2. **Chỉ viết vừa đủ code test để test thất bại** (compile không qua cũng tính là thất bại)
3. **Chỉ viết vừa đủ production code để test pass**

### 3.3 Giá trị thực sự của TDD

Giá trị của TDD không chỉ nằm ở "viết test trước", mà ở việc nó **ép bạn suy nghĩ về thiết kế interface**. Khi viết test trước, bạn đứng ở góc độ "người dùng": Hàm này nên nhận tham số gì? Trả về kết quả gì? Điều này tự nhiên dẫn đến thiết kế API tốt hơn.

::: tip TDD không phải đạn bạc
TDD phù hợp với code logic dày đặc (thuật toán, quy tắc nghiệp vụ, chuyển đổi dữ liệu), nhưng với layout UI, prototype khám phá, áp dụng TDD cưỡng ép反而 làm chậm tiến độ. Điều quan trọng là hiểu tư tưởng của nó, áp dụng linh hoạt.
:::

---

## 4. Lựa chọn chiến lược test

### 4.1 Trọng tâm test theo loại dự án

| Loại dự án | Trọng tâm test | Tỷ lệ đề xuất |
|----------|----------|----------|
| **Thư viện/SDK** | Chủ yếu unit test | 90% unit + 10% integration |
| **Dịch vụ API** | Chủ yếu integration test | 30% unit + 60% integration + 10% E2E |
| **Ứng dụng Web** | Phân bổ cân bằng | 50% unit + 30% integration + 20% E2E |
| **MVP/Prototype** | E2E các đường dẫn chính | Ít test cốt lõi là đủ |

### 4.2 Công cụ test phổ biến

| Công cụ | Loại | Trường hợp sử dụng |
|------|------|----------|
| **Vitest** | Unit/Integration | Lựa chọn hàng đầu cho dự án Vite, tương thích API Jest |
| **Jest** | Unit/Integration | Phổ biến nhất trong hệ sinh thái Node.js |
| **Playwright** | E2E | Đa trình duyệt, từ Microsoft |
| **Cypress** | E2E | Trải nghiệm dev tốt, debug dễ dàng |
| **Testing Library** | Test component | Test UI component từ góc nhìn người dùng |

---

## 5. Hỗ trợ AI: Nâng cao hiệu quả test với mô hình ngôn ngữ lớn

Khả năng của mô hình ngôn ngữ lớn trong lĩnh vực test đã rất mạnh — nó có thể giúp bạn tạo test case, phát hiện điều kiện biên, thậm chí viết code test hoàn chỉnh.

### 5.1 Tạo unit test

> **Prompt**:
> ```
> Vui lòng viết unit test cho hàm sau, sử dụng framework Vitest, yêu cầu:
> 1. Tuân theo mô hình AAA (Arrange-Act-Assert)
> 2. Cover đường dẫn bình thường, điều kiện biên và đường dẫn lỗi
> 3. Mỗi test case có mô tả rõ ràng
>
> [Dán code hàm của bạn]
> ```

### 5.2 Phát hiện điều kiện biên

> **Prompt**:
> ```
> Phân tích hàm sau, liệt kê tất cả điều kiện biên và tình huống đầu vào cực đoan có thể có,
> bao gồm: null, zero, số âm, số cực lớn, ký tự đặc biệt, tình huống đồng thời, v.v.
> Với mỗi tình huống, mô tả hành vi kỳ vọng và rủi ro có thể có.
>
> [Dán code hàm của bạn]
> ```

### 5.3 Tạo test từ yêu cầu (hỗ trợ TDD)

> **Prompt**:
> ```
> Tôi muốn triển khai module giỏ hàng, yêu cầu như sau:
> - Thêm sản phẩm, xóa sản phẩm, sửa số lượng
> - Tự động tính tổng giá (bao gồm giảm giá)
> - Thông báo lỗi khi không đủ tồn kho
>
> Theo tư duy TDD, viết test case trước (không viết implementation),
> sử dụng Vitest, cover tất cả tình huống cốt lõi.
> ```

::: tip Lời khuyên sử dụng AI
Test do AI tạo ra cần kiểm tra assertion có ý nghĩa không — tránh test vô giá trị như `expect(true).toBe(true)`. Test tốt phải thực sự fail khi code có lỗi.
:::

---

## 6. Tổng kết

1. **Kim tự tháp test**: Nhiều ở đáy, ít ở đỉnh, cân bằng tốc độ và độ chân thực
2. **Unit test**: Tuân theo nguyên tắc FIRST và mô hình AAA, test logic cốt lõi
3. **TDD**: Vòng lặp Đỏ-Xanh-Tái cấu trúc, dùng test hướng dẫn thiết kế
4. **Lựa chọn chiến lược**: Tùy loại dự án và giai đoạn, chọn tỷ lệ test phù hợp

::: tip Suy ngẫm cuối cùng
Test không phải gánh nặng, mà là **bộ tăng tốc**. Ngắn hạn, viết test确实 tốn thêm thời gian; dài hạn, nó tiết kiệm vô số lần xác minh thủ công,排查 regression bug và sửa khẩn cấp đêm khuya. Test tốt giúp bạn tự tin nói câu đó: **"Cứ sửa thoải mái, test sẽ cho biết có vấn đề gì không."**
:::

---

## Đọc thêm

- **Sách kinh điển**: *Test-Driven Development* của Kent Beck là tác phẩm sáng lập TDD.
- **Hướng dẫn thực tế**: Thử viết test cho một dự án nhỏ bằng Vitest, trải nghiệm quy trình test từ con số 0.
- **Test pattern**: Tìm hiểu sự khác biệt giữa Mock, Stub, Spy và tình huống sử dụng.
- **Tích hợp liên tục**: Tích hợp test vào pipeline CI/CD, tự động chạy mỗi lần commit.

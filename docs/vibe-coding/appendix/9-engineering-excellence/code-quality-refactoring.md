# Chất lượng mã và Tái cấu trúc

::: tip Lời nói đầu
**Chỉ cần code chạy được là đủ了吗？** Có thể bạn đã từng viết code như thế này: chức năng thì hoạt động, nhưng hai tuần sau chính bạn cũng không hiểu nổi. Hoặc có người trong team nghỉ việc, để lại một đống "chỉ có Chúa và người đó mới hiểu được".

Chương này sẽ giúp bạn hiểu thế nào là code tốt, cách nhận diện code xấu và cách cải thiện nó một cách an toàn.
:::

**Bài viết này sẽ giúp bạn học được gì?**

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Code smell (mùi code xấu) | Nhận diện các vấn đề phổ biến |
| **Chương 2** | Kỹ thuật tái cấu trúc | Cải thiện code một cách an toàn |
| **Chương 3** | Code Review | Đảm bảo chất lượng trong phối hợp nhóm |
| **Chương 4** | Đo lường chất lượng | Đánh giá sức khỏe code bằng dữ liệu |

Sau khi học xong chương này, bạn sẽ nắm vững các phương pháp nhận diện vấn đề code, tái cấu trúc an toàn và liên tục nâng cao chất lượng code thông qua phối hợp nhóm.

---

## 0. Tổng quan: Vòng đời của code

Trong phát triển phần mềm, có một sự thật thường bị bỏ qua: **code được đọc nhiều lần hơn rất nhiều so với được viết**.

Một đoạn code từ khi ra đời đến khi nghỉ hưu, thường trải qua hành trình như sau:

::: tip Cuộc đời của code
- **Giai đoạn viết**: Lập trình viên viết phiên bản đầu tiên, chức năng chạy được, test pass.
- **Giai đoạn review**: Các thành viên trong nhóm đọc code, đưa ra góp ý cải thiện.
- **Giai đoạn bảo trì**: Sửa bug, thêm tính năng, thích ứng yêu cầu mới — giai đoạn này chiếm hơn 80% vòng đời của code.
- **Giai đoạn tái cấu trúc**: Khi code trở nên khó bảo trì, cần cải thiện cấu trúc bên trong mà không thay đổi hành vi bên ngoài.
- **Giai đoạn nghỉ hưu**: Công nghệ đổi mới, code cũ được thay thế bằng giải pháp mới.
:::

Martin Fowler đã nói trong cuốn sách *Refactoring*: **"Bất kỳ kẻ ngốc nào cũng có thể viết code mà máy tính hiểu được. Chỉ có lập trình viên giỏi mới viết được code mà con người hiểu được."**

---

## 1. Code Smell: Nhận diện các vấn đề phổ biến

### 1.1 Code Smell là gì?

Khái niệm "Code Smell" được Kent Beck đề xuất, chỉ những đặc điểm trong code **mặc dù không phải bug, nhưng ám chỉ vấn đề thiết kế sâu hơn**. Giống như có mùi khó chịu trong phòng — không làm bạn ốm ngay lập tức, nhưng cho thấy cần dọn dẹp ở đâu đó.

Thông qua component tương tác dưới đây, nhận diện một số code smell phổ biến nhất:

<CodeSmellDemo />

### 1.2 Danh sách code smell phổ biến

| Code Smell | Triệu chứng | Nguy hại |
|-------|------|------|
| **Hàm quá dài** | Hàm dài hơn 50 dòng | Khó hiểu, kiểm thử và tái sử dụng |
| **Số ma thuật** | Viết trực tiếp `86400000` trong code | Ý nghĩa không rõ, dễ bỏ sót khi sửa |
| **Code trùng lặp** | Logic tương tự xuất hiện nhiều nơi | Khi sửa phải đồng bộ nhiều chỗ, dễ sót |
| **Lồng nhau quá sâu** | Hơn 3 tầng if/for | Logic như mê cung, khó theo dõi |
| **Danh sách tham số quá dài** | Hàm có hơn 4 tham số | Khó gọi, dễ truyền sai thứ tự |
| **Lớp toàn năng (God Class)** | Một class/module làm quá nhiều việc | Trách nhiệm không rõ, đụng một chỗ ảnh hưởng toàn bộ |

::: tip Insight cốt lõi
Code smell không phải "lỗi", mà là "tín hiệu". Nó cho bạn biết: thiết kế ở đây có thể cần cải thiện. Không phải mọi code smell đều cần sửa ngay, nhưng bạn cần có khả năng nhận diện chúng.
:::

---

## 2. Kỹ thuật tái cấu trúc: Cải thiện code an toàn

### 2.1 Tái cấu trúc là gì?

Tái cấu trúc (Refactoring) có định nghĩa rất chính xác: **cải thiện cấu trúc bên trong của code mà không thay đổi hành vi bên ngoài.**

Từ khóa là "không thay đổi hành vi bên ngoài". Tái cấu trúc không phải viết lại, không phải thêm tính năng, không phải sửa bug. Nó là việc "sắp xếp lại" bên trong code.

Thông qua component dưới đây, so sánh sự thay đổi trước và sau của một số kỹ thuật tái cấu trúc phổ biến:

<RefactoringDemo />

### 2.2 Kỹ thuật tái cấu trúc thường dùng

**Trích xuất hàm (Extract Function)**

Đây là kỹ thuật tái cấu trúc được sử dụng nhiều nhất. Khi một đoạn code có thể được tóm tắt bằng một tên có ý nghĩa, nó nên được trích thành một hàm.

```javascript
// Trước khi tái cấu trúc
function printReport(data) {
  // Tính tổng
  let total = 0
  for (const item of data.items) {
    total += item.price * item.qty
  }
  // In...
}

// Sau khi tái cấu trúc
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0)
}

function printReport(data) {
  const total = calculateTotal(data.items)
  // In...
}
```

**Đổi tên (Rename)**

Đặt tên tốt là tài liệu rẻ nhất và hiệu quả nhất. Khi bạn cần viết comment để giải thích ý nghĩa của một biến/hàm, tức là tên của nó chưa đủ tốt.

```javascript
// Trước khi tái cấu trúc
const d = new Date() - startTime  // Thời gian đã trôi qua
const arr = users.filter(u => u.a) // Người dùng hoạt động

// Sau khi tái cấu trúc
const elapsedMs = new Date() - startTime
const activeUsers = users.filter(user => user.isActive)
```

**Thay thế lồng nhau bằng guard clause (Replace Nested Conditional with Guard Clauses)**

```javascript
// Trước khi tái cấu trúc
function getPayAmount(employee) {
  if (employee.isSeparated) {
    return { amount: 0 }
  } else {
    if (employee.isRetired) {
      return { amount: employee.pension }
    } else {
      return { amount: employee.salary }
    }
  }
}

// Sau khi tái cấu trúc
function getPayAmount(employee) {
  if (employee.isSeparated) return { amount: 0 }
  if (employee.isRetired) return { amount: employee.pension }
  return { amount: employee.salary }
}
```

::: tip Lưới an toàn của tái cấu trúc
Rủi ro lớn nhất của tái cấu trúc là "sửa rồi lại sinh ra bug". Vì vậy, điều kiện tiên quyết để tái cấu trúc là **có test coverage**. Sau mỗi bước tái cấu trúc nhỏ, chạy test để đảm bảo hành vi không thay đổi. Code chưa có test thì phải bổ sung test trước khi tái cấu trúc.
:::

---

## 3. Code Review: Đảm bảo chất lượng trong phối hợp nhóm

### 3.1 Tại sao cần Code Review?

Code Review là một trong những phương pháp đảm bảo chất lượng hiệu quả nhất trong nhóm. Giá trị của nó không chỉ nằm ở việc tìm bug, mà còn ở:

- **Chia sẻ kiến thức**: Các thành viên trong nhóm hiểu code của nhau, giảm "bus factor" (nếu một người bị xe buýt tông, dự án có tiếp tục được không?)
- **Thống nhất phong cách**: Thông qua review, dần hình thành quy ước code của nhóm
- **Phát hiện sớm vấn đề thiết kế**: Khó sửa hơn bug là quyết định kiến trúc tồi
- **Học hỏi lẫn nhau**: Đọc code của người khác là捷径 để nâng cao kỹ năng lập trình

### 3.2 Review cái gì?

| Khía cạnh | Điểm chú ý |
|------|--------|
| **Tính đúng đắn** | Logic có đúng không? Điều kiện biên đã xử lý chưa? |
| **Khả năng đọc** | Tên có rõ ràng không? Cấu trúc có dễ hiểu không? |
| **Bảo mật** | Có nguy cơ injection không? Dữ liệu nhạy cảm có bị lộ không? |
| **Hiệu năng** | Có vấn đề hiệu năng rõ ràng không? Truy vấn N+1? |
| **Kiểm thử** | Có test tương ứng không? Đã cover các đường dẫn chính chưa? |

### 3.3 Nghệ thuật review

Code Review tốt là **thảo luận về code, không phải phê bình con người**:

- Dùng "chúng ta" thay vì "bạn": ~~"Bạn viết sai ở đây"~~ → "Ở đây chúng ta có thể cân nhắc dùng guard clause"
- Hỏi thay vì ra lệnh: ~~"Đổi thành const"~~ → "Biến này có được gán lại sau không? Nếu không, dùng const an toàn hơn"
- Đưa ra lý do: Không chỉ nói "không tốt", mà phải nói "tại sao không tốt" và "cải thiện thế nào"

---

## 4. Đo lường chất lượng code

### 4.1 Độ phức tạp cyclomatic

Độ phức tạp cyclomatic (Cyclomatic Complexity) đo số lượng đường dẫn độc lập trong code. Mỗi `if`, `for`, `case`, `&&`, `||` đều tăng độ phức tạp.

| Độ phức tạp | Đánh giá | Khuyến nghị |
|--------|------|------|
| 1-10 | Đơn giản | Dễ hiểu và kiểm thử |
| 11-20 | Trung bình | Cân nhắc tách nhỏ |
| 21-50 | Phức tạp | Bắt buộc tái cấu trúc |
| 50+ | Không thể bảo trì | Tái cấu trúc khẩn cấp |

### 4.2 Code coverage

Code coverage đo tỷ lệ code được thực thi bởi test. Các chỉ số phổ biến:

- **Line coverage**: Tỷ lệ dòng code được thực thi trên tổng số dòng
- **Branch coverage**: Tỷ lệ nhánh điều kiện được thực thi trên tổng số nhánh

::: tip Cạm bẫy của coverage
80% coverage không có nghĩa là chất lượng code tốt. Coverage chỉ cho bạn biết "code nào chưa được test", không thể cho bạn biết "test có ý nghĩa hay không". Một test chỉ assert `expect(true).toBe(true)` có thể tăng coverage nhưng hoàn toàn vô giá trị.
:::

### 4.3 Công cụ thực tế

| Công cụ | Mục đích |
|------|------|
| **ESLint** | Phân tích tĩnh cho JavaScript/TypeScript |
| **Prettier** | Định dạng code, thống nhất phong cách |
| **SonarQube** | Nền tảng chất lượng code toàn diện |
| **Husky** | Git hooks, tự động kiểm tra trước khi commit |

---

## 5. Hỗ trợ AI: Nâng cao chất lượng code với mô hình ngôn ngữ lớn

Các mô hình ngôn ngữ lớn đã rất thực tế trong lĩnh vực chất lượng code. Chúng có thể đóng vai trò là "người review code trực 24/7" của bạn.

### 5.1 Nhận diện code smell

> **Prompt**:
> ```
> Vui lòng review đoạn code sau, nhận diện các code smell, bao gồm nhưng không giới hạn:
> hàm quá dài, số ma thuật, code trùng lặp, lồng nhau quá sâu, danh sách tham số quá dài.
> Với mỗi vấn đề, chỉ ra vị trí cụ thể, mô tả vấn đề và đề xuất cải thiện.
>
> [Dán code của bạn]
> ```

### 5.2 Tái cấu trúc tự động

> **Prompt**:
> ```
> Vui lòng tái cấu trúc đoạn code sau với yêu cầu:
> 1. Không thay đổi hành vi bên ngoài
> 2. Sử dụng các kỹ thuật như trích xuất hàm, guard clause thay thế lồng nhau
> 3. Cải thiện đặt tên, loại bỏ số ma thuật
> 4. Giải thích lý do của mỗi bước tái cấu trúc
>
> [Dán code của bạn]
> ```

### 5.3 Mô phỏng Code Review

> **Prompt**:
> ```
> Vui lòng review đoạn code này từ góc nhìn của một senior developer, đưa ra phản hồi theo các khía cạnh sau:
> - Tính đúng đắn: Logic có bug không? Điều kiện biên đã xử lý chưa?
> - Khả năng đọc: Tên có rõ ràng không? Cấu trúc có dễ hiểu không?
> - Hiệu năng: Có vấn đề hiệu năng rõ ràng không?
> - Bảo mật: Có nguy cơ injection hoặc rò rỉ dữ liệu không?
> Sử dụng giọng điệu "đề xuất" thay vì "ra lệnh", đưa ra phương án cải thiện.
>
> [Dán code của bạn]
> ```

::: tip Lời khuyên sử dụng AI
Các đề xuất tái cấu trúc của AI cần bạn tự xác minh — chạy test để đảm bảo hành vi không đổi. Hãy coi AI như "đồng nghiệp đưa ra gợi ý", không phải "thẩm quyền tin tưởng vô điều kiện".
:::

---

## 6. Tổng kết

Nhìn lại hành trình này, từ nhận diện vấn đề đến giải quyết, chúng ta đã xây dựng một hệ thống cải thiện chất lượng code hoàn chỉnh:

1. **Nhận diện**: Học cách phát hiện code smell, biết nơi nào cần cải thiện
2. **Tái cấu trúc**: Nắm vững kỹ thuật tái cấu trúc an toàn, cải thiện từng bước nhỏ dưới sự bảo vệ của test
3. **Phối hợp**: Thông qua code review, cả nhóm cùng gìn giữ chất lượng code
4. **Đo lường**: Sử dụng chỉ số khách quan để theo dõi sức khỏe của code

::: tip Suy ngẫm cuối cùng
Chất lượng code không phải công việc một lần, mà là thói quen liên tục. Giống như giữ gìn phòng sạch sẽ — không đợi đến khi bừa bộn mới dọn dẹp lớn, mà mỗi ngày dọn dẹp một chút. **Nguyên tắc Hướng đạo sinh** nói rất hay: Khi rời đi, hãy để code sạch hơn một chút so với khi bạn đến.
:::

---

## Đọc thêm

- **Sách kinh điển**: *Refactoring: Improving the Design of Existing Code* của Martin Fowler là cuốn kinh thánh trong lĩnh vực này.
- **Nghệ thuật code sạch**: *Clean Code* của Robert C. Martin cung cấp nhiều nguyên tắc lập trình thực tế.
- **Công cụ thực hành**: Thử cấu hình ESLint + Prettier + Husky trong dự án để trải nghiệm đảm bảo chất lượng code tự động.
- **Code Review**: Hướng dẫn Code Review của Google là tiêu chuẩn ngành, đáng để học hỏi.

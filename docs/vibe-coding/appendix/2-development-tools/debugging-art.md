# Nghệ thuật Debug

::: tip Lời mở đầu
**Code viết xong, chạy bị lỗi — rồi sao?** Nhiều người mới học bị kẹt ở bước này, nhìn chằm chằm vào màn hình không biết làm gì. Debug là một trong những kỹ năng cốt lõi nhất của lập trình, thậm chí quan trọng hơn cả viết code. Vì viết code chỉ chiếm 30% thời gian phát triển, 70% còn lại dành cho việc hiểu vấn đề, định vị Bug và xác nhận sửa chữa.
:::

**Bài viết này sẽ giúp bạn học gì?**

Sau khi học xong chương này, bạn sẽ có:

- **Tư duy debug**: Xây dựng phương pháp định vị vấn đề có hệ thống, không còn "đoán mò"
- **Khả năng đọc lỗi**: Hiểu thông báo lỗi, định vị nhanh vấn đề từ call stack
- **Phương pháp debug kinh điển**: Nắm vững nhị phân, vịt cao su, tái hiện tối thiểu và các kỹ thuật debug kinh điển
- **Khả năng sử dụng công cụ**: Hiểu các kịch bản sử dụng debug breakpoint, log debug, debug mạng
- **Debug có sự trợ giúp của AI**: Học cách dùng AI để tăng tốc debug, nhưng không phụ thuộc vào AI

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Đọc hiểu thông báo lỗi | Loại lỗi, call stack |
| **Chương 2** | Phương pháp debug kinh điển | Nhị phân, vịt cao su, tái hiện tối thiểu |
| **Chương 3** | Hộp công cụ debug | Breakpoint, log, bắt gói mạng |
| **Chương 4** | Debug trong thời đại AI | AI hỗ trợ + phán đoán con người |
| **Chương 5** | Tâm thái và thói quen debug | Lập trình phòng thủ, nhật ký debug |

---

## 0. Tổng quan: Debug là một phương pháp khoa học

Debug không phải là "may rủi", mà là một quá trình khoa học nghiêm ngặt. Phương pháp luận mà các nhà vật lý dùng trong thí nghiệm hoàn toàn áp dụng được cho debug:

1. **Quan sát hiện tượng**: Chương trình gặp vấn đề gì? Báo lỗi gì?
2. **Đưa ra giả thuyết**: Nguyên nhân có thể là gì?
3. **Thiết kế thí nghiệm**: Làm sao để kiểm chứng giả thuyết này?
4. **Kiểm tra kết luận**: Giả thuyết đúng thì sửa, sai thì đổi giả thuyết khác

::: tip Quy tắc vàng của debug
- **Tái hiện trước, sửa sau**: Bug không thể tái hiện ổn định thì sửa xong cũng không biết có thực sự sửa được không
- **Chỉ thay đổi một biến cùng lúc**: Thay đổi nhiều nơi cùng lúc thì không biết thay đổi nào đã giải quyết vấn đề
- **Tin vào bằng chứng, không tin trực giác**: Khi bạn nghĩ "không thể là vấn đề ở đây", thường thì chính là ở đây
- **Gần đây đã thay đổi gì?**: 80% Bug được giới thiệu bởi các thay đổi gần đây nhất
:::

---

## 1. Đọc hiểu thông báo lỗi: Báo lỗi không phải kẻ thù, mà là manh mối

Lỗi sai phổ biến nhất của người mới: Thấy báo lỗi là hoảng, đóng luôn hoặc bỏ qua. Thực ra, **thông báo lỗi là chương trình đang nói với bạn vấn đề ở đâu** — nó là người bạn tốt nhất của bạn.

### 1.1 Ba loại lỗi chính

| Loại | Khi nào xuất hiện | Ví dụ | Mức độ nghiêm trọng |
|-----|------------|------|---------|
| **Lỗi cú pháp** | Lỗi xuất hiện trước khi chạy code | Thiếu ngoặc, viết sai keyword | Dễ sửa nhất |
| **Lỗi runtime** | Code chạy đến một dòng thì crash | Truy cập biến không tồn tại, chia cho 0 | Độ khó trung bình |
| **Lỗi logic** | Code chạy được nhưng kết quả sai | Công thức tính sai, điều kiện đảo ngược | Khó phát hiện nhất |

### 1.2 Cách đọc error stack

Ví dụ JavaScript, một thông báo lỗi điển hình:

```
TypeError: Cannot read properties of undefined (reading 'name')
    at getUserName (app.js:15:23)
    at handleClick (app.js:42:10)
    at HTMLButtonElement.<anonymous> (app.js:58:5)
```

**Đọc từ trên xuống dưới**:

1. **Dòng đầu tiên**: Loại lỗi + mô tả lỗi → `TypeError`, cố đọc thuộc tính `name` của `undefined`
2. **Dòng thứ hai**: Hàm và vị trí lỗi → hàm `getUserName`, dòng 15 cột 23 trong `app.js`
3. **Các dòng tiếp theo**: Chuỗi gọi → Ai đã gọi hàm này? `handleClick` → sự kiện click nút

::: tip Mẹo đọc stack
**Tìm nguyên nhân từ trên xuống, tìm nguồn gốc từ dưới lên.** Dòng đầu tiên cho bạn "lỗi gì xảy ra", dòng cuối cùng cho bạn "bắt đầu từ đâu".
:::

### 1.3 Tra cứu nhanh các loại lỗi phổ biến

| Tên lỗi | Ý nghĩa | Nguyên nhân phổ biến |
|---------|------|---------|
| `SyntaxError` | Lỗi cú pháp | Ngoặc không khớp, thiếu dấu phẩy |
| `TypeError` | Lỗi kiểu | Thao tác trên `undefined`/`null` |
| `ReferenceError` | Lỗi tham chiếu | Sử dụng biến chưa khai báo |
| `RangeError` | Lỗi phạm vi | Mảng vượt giới hạn, đệ quy quá sâu |
| `NetworkError` | Lỗi mạng | Request API thất bại, vấn đề CORS |
| `404 Not Found` | Tài nguyên không tồn tại | URL sai, tệp đã bị xóa |
| `500 Internal Server Error` | Lỗi nội bộ máy chủ | Code backend bị crash |

### 1.4 So sánh thông báo lỗi Python

Stack của Python ngược với JavaScript — **đọc từ dưới lên trên**:

```python
Traceback (most recent call last):
  File "main.py", line 10, in <module>
    result = calculate(data)
  File "main.py", line 5, in calculate
    return data["price"] * data["quantity"]
KeyError: 'quantity'
```

**Dòng cuối cùng** mới là nguyên nhân lỗi: `KeyError: 'quantity'`, dictionary không có key `quantity`.

::: tip Ngôn ngữ khác nhau, cách tiếp cận giống nhau
Dù là ngôn ngữ gì, thông báo lỗi đều chứa ba thông tin chính: **Lỗi gì** (loại lỗi), **Ở đâu** (tệp và dòng), **Tại sao** (mô tả lỗi). Học cách trích xuất ba thông tin này, bạn sẽ đọc được báo lỗi của bất kỳ ngôn ngữ nào.
:::

---

## 2. Phương pháp debug kinh điển: Trí tuệ đúc kết từ thế hệ trước

Các phương pháp này không cần công cụ nào, chỉ cần bộ não của bạn. Chúng là nền tảng của mọi kỹ thuật debug nâng cao.

### 2.1 Debug nhị phân

**Ý tưởng cốt lõi**: Thu hẹp phạm vi vấn đề một nửa, rồi một nửa nữa, cho đến khi tìm ra nguồn gốc.

**Kịch bản**: Code dài, không biết đoạn nào bị lỗi.

**Các bước**:

1. Thêm `console.log` (hoặc `print`) ở giữa code
2. Nếu lỗi xảy ra trước điểm giữa → vấn đề ở nửa trên
3. Nếu lỗi xảy ra sau điểm giữa → vấn đề ở nửa dưới
4. Lặp lại các bước trên với nửa có vấn đề

```
100 dòng code có Bug
    ↓ Thêm log ở dòng 50
Vấn đề ở dòng 50-100
    ↓ Thêm log ở dòng 75
Vấn đề ở dòng 50-75
    ↓ Thêm log ở dòng 62
Vấn đề ở dòng 60-62!
```

::: tip Sức mạnh của nhị phân
100 dòng code, tối đa chỉ cần 7 lần (log₂100 ≈ 7) để định vị được dòng cụ thể. 1000 dòng cũng chỉ cần 10 lần.
:::

### 2.2 Phương pháp debug vịt cao su

**Ý tưởng cốt lõi**: Giải thích vấn đề từng dòng một cho người khác (hoặc một con vịt cao su), giải thích rồi bạn sẽ tự phát hiện ra vấn đề.

**Tại sao hiệu quả?** Vì "viết code" và "giải thích code" dùng các vùng não khác nhau. Khi bạn buộc phải mô tả bằng lời mỗi bước logic, những giả thuyết bạn "tưởng là đúng" sẽ bị phơi bày.

**Cách thực hành**:

1. Mở code có vấn đề
2. Giải thích từng dòng: "Dòng này làm gì? Tại sao phải làm thế?"
3. Khi bạn nói "Ừm, ở đây phải là... khoan đã", Bug thường nằm ở đó

### 2.3 Tái hiện tối thiểu

**Ý tưởng cốt lõi**: Đơn giản hóa vấn đề phức tạp đến mức tối thiểu, chỉ giữ lại ít code nhất có thể kích hoạt Bug.

**Tại sao quan trọng?**

- Trong hệ thống phức tạp, Bug có thể bị code khác "che khuất"
- Tái hiện tối thiểu loại bỏ yếu tố nhiễu, làm vấn đề rõ ràng ngay lập tức
- Cũng giúp bạn dễ xin giúp đỡ — không ai muốn xem 500 dòng code của bạn

**Các bước**:

1. Tạo một tệp trống mới
2. Chỉ copy code liên quan đến vấn đề
3. Giảm dần cho đến khi xóa bất kỳ dòng nào Bug sẽ biến mất
4. Phần còn lại chính là nguồn gốc Bug

### 2.4 Phương pháp revert (Git Bisect)

**Ý tưởng cốt lõi**: Nếu code "trước đó vẫn tốt, giờ lại hỏng", thì tìm xem commit nào đã giới thiệu vấn đề.

```bash
# Công cụ tìm kiếm nhị phân tích hợp sẵn của Git
git bisect start
git bisect bad          # Đánh dấu version hiện tại có Bug
git bisect good abc123  # Đánh dấu một version cũ hoạt động tốt
# Git sẽ tự động chuyển đến commit ở giữa, bạn test rồi báo good hoặc bad
# Lặp lại vài lần sẽ tìm được commit đã giới thiệu Bug
```

::: tip Hướng dẫn chọn phương pháp debug
| Tình huống | Phương pháp khuyến nghị |
|-----|---------|
| Không biết đoạn code nào bị lỗi | Nhị phân |
| Logic có vẻ đúng nhưng kết quả sai | Vịt cao su |
| Bug trong hệ thống phức tạp | Tái hiện tối thiểu |
| "Trước đó vẫn tốt tự nhiên hỏng" | Revert / Git Bisect |
:::

---

## 3. Hộp công cụ debug: Dùng đúng công cụ gấp đôi hiệu quả

Phương pháp luận là nền tảng, nhưng công cụ tốt giúp hiệu suất debug tăng gấp bội.

### 3.1 console.log / print: Đơn giản nhất nhưng hữu ích nhất

**Kịch bản sử dụng**: Xem nhanh giá trị biến, xác nhận code đã chạy đến đâu.

```javascript
// JavaScript
console.log('Hàm được gọi, tham số là:', data)
console.log('Kết quả tính toán:', result)
console.table(arrayData)  // Hiển thị mảng/đối tượng dạng bảng
```

```python
# Python
print(f"Giá trị hiện tại: {value}")
print(f"Kiểu: {type(data)}")  # Kiểm tra kiểu dữ liệu
```

**Kỹ thuật nâng cao**:

| Phương thức | Công dụng |
|-----|------|
| `console.log()` | Xuất bình thường |
| `console.warn()` | Cảnh báo vàng, dễ tìm trong nhiều log |
| `console.error()` | Lỗi màu đỏ |
| `console.table()` | Hiển thị mảng và đối tượng dạng bảng |
| `console.time()` / `console.timeEnd()` | Đo thời gian thực thi code |
| `console.trace()` | In call stack |

### 3.2 Debug breakpoint: Thực thi từng dòng

**Kịch bản sử dụng**: Logic phức tạp, cần theo dõi từng bước thực thi code.

**Trong trình duyệt (Chrome DevTools)**:

1. Mở Developer Tools (F12) → panel Sources
2. Tìm tệp mã nguồn, nhấp vào số dòng để đặt breakpoint
3. Kích hoạt thao tác liên quan, code sẽ tạm dừng tại breakpoint
4. Dùng các nút điều khiển để thực thi từng bước:
   - **Tiếp tục** (F8): Chạy đến breakpoint tiếp theo
   - **Bước qua** (F10): Thực thi dòng hiện tại, không vào trong hàm
   - **Bước vào** (F11): Vào trong hàm
   - **Bước ra** (Shift+F11): Thoát khỏi hàm hiện tại

**Trong VS Code**:

1. Nhấp vào bên trái số dòng để đặt breakpoint (chấm đỏ)
2. Nhấn F5 để bắt đầu debug
3. Xem giá trị hiện tại của tất cả biến trong panel "Variables"
4. Thêm biểu thức bạn quan tâm trong panel "Watch"

::: tip Breakpoint vs console.log
**console.log** phù hợp để xác nhận nhanh, xong là bỏ. **Breakpoint** phù hợp để phân tích logic phức tạp sâu. Hai cái không thay thế mà bổ sung cho nhau.
:::

### 3.3 Debug mạng: Vấn đề giữa frontend và backend

**Kịch bản sử dụng**: Trang hiển thị không đúng, nhưng không chắc lỗi do frontend hay dữ liệu backend trả về.

**Chrome DevTools → Panel Network**:

| Xem gì | Phát hiện vấn đề gì |
|---------|--------------|
| **Status code** | 404 (sai địa chỉ), 500 (server crash), 403 (không có quyền) |
| **Request params** | Dữ liệu frontend gửi có đúng không |
| **Response data** | Định dạng dữ liệu backend trả về có đúng không |
| **Request time** | API nào quá chậm, làm chậm trang |
| **Request headers** | Token có được gửi không, Content-Type có đúng không |

**Mẹo nhớ**: Xem status code trước, xem request params sau, cuối cùng xem response data.

### 3.4 Tra cứu nhanh công cụ debug

| Loại vấn đề | Công cụ khuyến nghị |
|---------|---------|
| Giá trị biến sai | console.log / Breakpoint |
| Thứ tự thực thi logic sai | Breakpoint |
| Request API thất bại | Panel Network |
| Style trang sai | Panel Elements (kiểm tra CSS) |
| Vấn đề hiệu suất | Panel Performance / console.time |
| Rò rỉ bộ nhớ | Panel Memory |

---

## 4. Debug trong thời đại AI: Để AI làm trợ lý

Các công cụ AI (ChatGPT, Claude, Cursor, v.v.) có thể tăng tốc đáng kể quá trình debug, nhưng bạn phải biết cách sử dụng.

### 4.1 AI giỏi cái gì?

| AI giỏi | AI không giỏi |
|--------|----------|
| Giải thích ý nghĩa thông báo lỗi | Hiểu logic nghiệp vụ của bạn |
| Cung cấp giải pháp cho vấn đề phổ biến | Phán đoán giải pháp nào phù hợp nhất với dự án của bạn |
| Tạo đoạn code debug | Tái hiện Bug chỉ xuất hiện trong môi trường cụ thể |
| Phân tích vấn đề tiềm ẩn trong code | Hiểu context của hệ thống phức tạp |

### 4.2 Cách đặt câu hỏi cho AI đúng

**Câu hỏi tệ**:
> "Code của tôi bị lỗi, xem giúp tôi"

**Câu hỏi tốt**:
> "Tôi đang viết một form component bằng React, khi submit báo lỗi `TypeError: Cannot read properties of undefined (reading 'email')`. Dưới đây là code liên quan: [dán code]. Tôi đã xác nhận định dạng dữ liệu API trả về đúng, vấn đề có thể nằm ở xử lý dữ liệu frontend."

**Mẫu đặt câu hỏi**:

```
1. Tôi đang làm gì: [ngữ cảnh]
2. Hành vi mong đợi: [nên như thế nào]
3. Hành vi thực tế: [thực tế như thế nào]
4. Thông báo lỗi: [lỗi đầy đủ]
5. Code liên quan: [dán code]
6. Tôi đã thử: [đã loại trừ gì]
```

### 4.3 Cạm bẫy khi debug với AI

::: warning Ba cạm bẫy của debug AI
1. **AI có thể "nói sai với tự tin"**: Giải pháp AI đưa ra có vẻ hợp lý nhưng có thể hoàn toàn sai. Luôn tự mình kiểm chứng.
2. **AI không hiểu context của bạn**: Nó không biết cấu trúc dự án, phiên bản dependency, môi trường chạy của bạn. Bạn cần cung cấp đủ context.
3. **Phụ thuộc quá nhiều vào AI sẽ làm suy giảm khả năng debug**: Nếu mỗi lần gặp lỗi đều ném cho AI, bạn sẽ không bao giờ học được cách tự debug. Khuyến nghị tự phân tích 5 phút trước, rồi mới nhờ AI.
:::

### 4.4 Kết hợp tối ưu: AI + con người

```
Gặp Bug
  ↓
Bước 1: Tự đọc thông báo lỗi (1 phút)
  ↓
Bước 2: Tự đưa ra giả thuyết (2 phút)
  ↓
Bước 3: Nhanh chóng kiểm chứng giả thuyết (2 phút)
  ↓
Bị kẹt? → Gửi thông báo lỗi + code + phân tích của bạn cho AI
  ↓
AI đưa ra gợi ý → Bạn đánh giá có hợp lý không → Kiểm chứng
```

---

## 5. Tâm thái và thói quen debug: Từ "dập lửa" đến "phòng cháy"

Debug tốt nhất là không cần debug. Xây dựng thói quen tốt có thể giảm Bug từ gốc.

### 5.1 Lập trình phòng thủ

**Ý tưởng cốt lõi**: Khi viết code thì giả định "mọi thứ đều có thể sai", chuẩn bị bảo vệ trước.

```javascript
// Tệ: Giả định data luôn tồn tại
const name = data.user.name

// Tốt: Viết phòng thủ
const name = data?.user?.name ?? 'Người dùng không xác định'
```

```python
# Tệ: Giả định luôn mở được tệp
content = open('config.json').read()

# Tốt: Viết phòng thủ
try:
    content = open('config.json').read()
except FileNotFoundError:
    print("Tệp cấu hình không tồn tại, dùng cấu hình mặc định")
    content = '{}'
```

### 5.2 Viết log tốt

Log là chìa khóa để "debug sau sự cố". Môi trường production không thể đặt breakpoint, chỉ dựa được vào log.

| Cấp độ log | Công dụng | Ví dụ |
|---------|------|------|
| **DEBUG** | Thông tin chi tiết khi phát triển | Giá trị biến, tham số hàm |
| **INFO** | Quy trình nghiệp vụ bình thường | "Đăng nhập thành công", "Đơn hàng đã tạo" |
| **WARN** | Không ảnh hưởng chức năng nhưng cần chú ý | "Cache miss", "Thử lại lần 2" |
| **ERROR** | Đã xảy ra lỗi, cần xử lý | "Kết nối database thất bại", "API timeout" |

::: tip Tiêu chuẩn của log tốt
Một log tốt cần trả lời: **Khi nào**, **Ở đâu**, **Đã xảy ra gì**, **Dữ liệu quan trọng là gì**.
```
[2025-01-15 14:30:22] [ERROR] [OrderService] Tạo đơn hàng thất bại
  User ID: 12345, Product ID: 67890, Lý do: Không đủ tồn kho
```
:::

### 5.3 Checklist debug

Khi gặp Bug, kiểm tra theo thứ tự sau:

1. **Đọc thông báo lỗi**: Loại lỗi, tệp, số dòng
2. **Gần đây đã thay đổi gì?**: Dùng `git diff` xem thay đổi gần đây
3. **Có thể tái hiện không?**: Tìm các bước tái hiện ổn định
4. **Thu hẹp phạm vi**: Dùng nhị phân hoặc tái hiện tối thiểu để định vị
5. **Đưa ra giả thuyết và kiểm chứng**: Chỉ thay đổi một biến cùng lúc
6. **Test hồi quy sau khi sửa**: Đảm bảo sửa không giới thiệu vấn đề mới

### 5.4 Bẫy debug phổ biến của người mới

| Bẫy | Cách đúng |
|-----|---------|
| Không xem lỗi đã bắt đầu sửa code | Đọc kỹ thông báo lỗi trước |
| Đổi nhiều chỗ cùng lúc | Chỉ đổi một chỗ, xác nhận rồi mới đổi tiếp |
| Sửa xong không test đã commit | Chạy test sau mỗi lần sửa |
| Chỉ test trên máy của mình | Cân nhắc môi trường khác (trình duyệt, hệ điều hành, mạng) |
| Debug xong không dọn console.log | Xóa tất cả code debug trước khi commit |
| Gặp vấn đề là restart/cài lại | Hiểu nguyên nhân trước, restart chỉ là giải pháp tạm thời |

---

## 6. Tổng kết

Debug là một nghề thủ công, cần luyện tập có chủ đích. Hãy ôn lại các điểm chính của chương:

1. **Debug là phương pháp khoa học**: Quan sát → Giả thuyết → Thí nghiệm → Kiểm chứng, không phải may rủi
2. **Thông báo lỗi là bạn**: Học cách trích xuất "lỗi gì, ở đâu, tại sao" từ báo lỗi
3. **Phương pháp kinh điển không bao giờ lỗi thời**: Nhị phân, vịt cao su, tái hiện tối thiểu là nền tảng của mọi debug
4. **Dùng đúng công cụ cho đúng kịch bản**: console.log xác nhận nhanh, breakpoint phân tích sâu, Network kiểm tra API
5. **AI là trợ lý không phải nạng**: Tự phân tích trước, nhờ AI hỗ trợ sau, tự kiểm chứng cuối cùng
6. **Phòng cháy hơn dập lửa**: Lập trình phòng thủ, thói quen log tốt giảm Bug từ gốc

::: tip Hãy nhớ câu này
**Mỗi Bug là một cơ hội học hỏi.** Mỗi Bug bạn sửa đều giúp bạn xây dựng khả năng "nhận diện pattern" — lần sau gặp vấn đề tương tự, bạn sẽ định vị nguyên nhân nhanh hơn.
:::

---

## Đọc thêm

- [Tài liệu chính thức Chrome DevTools](https://developer.chrome.com/docs/devtools/) — Hướng dẫn đầy đủ về công cụ debug trình duyệt
- [VS Code Debugging](https://code.visualstudio.com/docs/editor/debugging) — Hướng dẫn debug breakpoint trong VS Code
- [How to Debug Anything](https://www.debuggingbook.org/) — Phương pháp luận debug hệ thống

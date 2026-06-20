# Biểu thức chính quy (Regex)

> 💡 **Hướng dẫn học**: Regex trông như chữ tượng hình? Thực ra nó chỉ là "ngôn ngữ mini mô tả pattern văn bản". Chương này giúp bạn hiểu essence của regex từ con số không, học cách dùng vài ký hiệu quan trọng giải quyết 80% vấn đề tìm kiếm và xác thực văn bản.

---

## 0. Tại sao bạn cần biểu thức chính quy?

Tưởng tượng các kịch bản:
- Trích tất cả địa chỉ IP từ một đoạn log dài
- Xác thực định dạng email người dùng nhập có hợp lệ không
- Thay toàn bộ ngày trong văn bản từ `2024/01/15` thành `2024-01-15`
- Trích tất cả link từ source code trang web

**Dùng tìm kiếm chuỗi bình thường?** Bạn cần viết rất nhiều logic `if-else`.
**Dùng regex?** Một dòng pattern xong.

---

## 1. Nhập môn regex: Ba phút上手

👇 Thử click: Nhập biểu thức chính quy, xem kết quả match theo thời gian thực

<RegexDemo />

::: tip 💡 Hiểu trong một câu
Regex = **Dùng ký hiệu đặc biệt mô tả "bạn muốn tìm văn bản dạng nào"**. `\d` đại diện số, `+` đại diện một hoặc nhiều, nên `\d+` là "một hoặc nhiều chữ số".
:::

---

## 2. Khái niệm cốt lõi: Ghép như xếp khối

Bản chất regex là dùng **ba loại khối** để xây pattern bạn muốn:

### 2.1 Khối 1: Lớp ký tự (Match ký tự gì)

| Cú pháp | Ý nghĩa | Ví dụ |
|---|---|---|
| `.` | Bất kỳ ký tự nào | `a.c` → abc, a1c, a c |
| `\d` | Chữ số [0-9] | `\d\d` → 42, 99 |
| `\w` | Chữ/số/gạch dưới | `\w+` → hello, user_1 |
| `\s` | Ký tự trắng | Khớp khoảng trắng, Tab |
| `[abc]` | Bất kỳ ký tự trong tập | `[aeiou]` → nguyên âm |
| `[^abc]` | Không nằm trong tập | `[^0-9]` → ký tự không phải số |

### 2.2 Khối 2: Lượng từ (Match mấy lần)

| Cú pháp | Ý nghĩa | Ví dụ |
|---|---|---|
| `*` | 0 lần hoặc nhiều | `ab*` → a, ab, abbb |
| `+` | 1 lần hoặc nhiều | `ab+` → ab, abbb (không match a) |
| `?` | 0 lần hoặc 1 lần | `colou?r` → color, colour |
| `{3}` | Đúng 3 lần | `\d{3}` → 123 |
| `{2,4}` | Từ 2 đến 4 lần | `\d{2,4}` → 12, 1234 |

### 2.3 Khối 3: Vị trí và nhóm

| Cú pháp | Ý nghĩa | Ví dụ |
|---|---|---|
| `^` | Đầu dòng | `^Hello` → dòng bắt đầu bằng Hello |
| `$` | Cuối dòng | `end$` → dòng kết thúc bằng end |
| `\b` | Biên từ | `\bcat\b` → cat (không match catch) |
| `(...)` | Nhóm bắt | `(\d+)-(\d+)` → bắt riêng biệt |
| `a\|b` | Hoặc | `cat\|dog` → cat hoặc dog |

---

## 3. Thực hành: Pattern xác thực phổ biến

### 3.1 Xác thực email

```
[\w.+-]+@[\w-]+\.[\w.]+
```

Phân tích:
- `[\w.+-]+` — Phần username (chữ số dấu chấm cộng gạch)
- `@` — Ký tự @
- `[\w-]+` — Phần domain
- `\.` — Dấu chấm escape
- `[\w.]+` — Top-level domain

### 3.2 Xác thực số điện thoại (Trung Quốc)

```
1[3-9]\d{9}
```

Phân tích:
- `1` — Bắt đầu bằng 1
- `[3-9]` — Chữ số thứ hai từ 3-9
- `\d{9}` — Theo sau 9 chữ số

### 3.3 Kiểm tra độ mạnh mật khẩu

```
^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$
```

Phân tích:
- `(?=.*[a-z])` — Ít nhất một chữ thường (lookahead)
- `(?=.*[A-Z])` — Ít nhất một chữ hoa
- `(?=.*\d)` — Ít nhất một số
- `.{8,}` — Tổng độ dài ít nhất 8 ký tự

---

## 4. Dùng regex trong code

### JavaScript

```javascript
const text = 'Liên hệ: 13812345678 hoặc 15099887766'
const regex = /1[3-9]\d{9}/g
const phones = text.match(regex)
// ['13812345678', '15099887766']

// Thay thế
text.replace(/\d{4}(?=\d{4}$)/, '****')
// Ẩn 4 số giữa số điện thoại

// Xác thực
/^[\w.+-]+@[\w-]+\.[\w.]+$/.test('user@example.com')
// true
```

### Python

```python
import re

text = 'Giá là 99 đồng, giảm 20 đồng'
numbers = re.findall(r'\d+', text)
# ['99', '20']

# Thay thế
re.sub(r'\d+', 'X', text)
# 'Giá là X đồng, giảm X đồng'

# Bắt nhóm
match = re.search(r'(\d+)-(\d+)', '2024-01-15')
match.group(1)  # '2024'
match.group(2)  # '01'
```

---

## 5. Greedy vs Lazy: Một khác biệt quan trọng

```
Văn bản: <b>hello</b> and <b>world</b>
```

| Pattern | Kết quả | Giải thích |
|---|---|---|
| `<b>.*</b>` | `<b>hello</b> and <b>world</b>` | Greedy: match nhiều nhất có thể |
| `<b>.*?</b>` | `<b>hello</b>` | Lazy: match ít nhất có thể |

::: tip 💡 Nhớ
Mặc định là chế độ greedy. Thêm `?` sau lượng từ thành lazy. Đa số lúc bạn cần lazy.
:::

---

## 6. Tóm tắt

::: tip 📚 Điểm chính
1. **Regex = ngôn ngữ mini mô tả pattern văn bản**, dùng để tìm, match, thay thế
2. **Ba loại khối**: Lớp ký tự (match gì) + Lượng từ (match mấy lần) + Vị trí/nhóm
3. **\d \w \s** là ba lớp ký tự phổ biến nhất, bao phủ số, từ, khoảng trắng
4. **Không cần viết từ đầu**: Kịch bản phổ biến đều có pattern regex trưởng thành tái sử dụng
5. **Greedy vs Lazy**: Mặc định greedy (match nhiều), thêm `?` thành lazy (match ít)
:::

**Học tiếp**:
- [Biến môi trường và PATH](./environment-path) - Hiểu cấu hình hệ thống
- [SSH và xác thực khóa](./ssh-authentication) - Kết nối an toàn server từ xa

# Tư duy bảo mật và nền tảng tấn công - phòng thủ

::: tip Lời nói đầu
**Website của bạn có an toàn không?** Nhiều developer nghĩ "bảo mật là việc của team bảo mật", cho đến khi dự án của mình bị tấn công, dữ liệu người dùng bị lộ. Bảo mật không phải tùy chọn, mà là kỹ năng cơ bản của mọi developer.

Chương này giúp bạn xây dựng tư duy bảo mật, hiểu các mối đe dọa bảo mật Web phổ biến nhất và phương pháp phòng vệ.
:::

**Bài viết này sẽ giúp bạn học được gì?**

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Mô hình tư duy bảo mật | Suy nghĩ như kẻ tấn công |
| **Chương 2** | Các kiểu tấn công Web phổ biến | XSS, SQL Injection, CSRF |
| **Chương 3** | Chiến lược phòng vệ | Kiểm tra đầu vào, mã hóa đầu ra, kiểm soát quyền |
| **Chương 4** | Checklist bảo mật | Tự kiểm tra bảo mật trước khi deploy |

Sau khi học xong chương này, bạn sẽ có nhận thức bảo mật cơ bản, có thể nhận diện và phòng vệ trước các mối đe dọa bảo mật Web phổ biến nhất.

---

## 0. Tổng quan: Tại sao developer cần hiểu bảo mật?

Hãy tưởng tượng bạn xây một ngôi nhà, đầy đủ chức năng, trang trí đẹp mắt, nhưng quên lắp khóa. Lỗ hổng bảo mật chính là "những chiếc khóa quên lắp" trong thế giới code.

::: tip Nguyên tắc cốt lõi của bảo mật
- **Quyền hạn tối thiểu**: Chỉ cấp quyền cần thiết, không dư thừa
- **Phòng thủ nhiều lớp**: Không dựa vào một tuyến phòng thủ duy nhất, thiết lập nhiều lớp
- **Không bao giờ tin tưởng đầu vào**: Mọi dữ liệu từ bên ngoài đều có thể độc hại
- **Bảo mật mặc định**: Cấu hình mặc định nên an toàn, chứ không phải tiện lợi
:::

---

## 1. Các kiểu tấn công Web phổ biến

Thông qua component tương tác dưới đây, tìm hiểu nguyên lý của ba kiểu tấn công Web phổ biến nhất (chỉ dùng cho mục đích giáo dục):

<WebSecurityDemo />

### 1.1 XSS (Cross-Site Scripting)

Kẻ tấn công chèn script độc hại vào trang web. Khi người dùng khác truy cập, script sẽ thực thi trên trình duyệt của họ.

```javascript
// Nguy hiểm: chèn trực tiếp đầu vào người dùng vào HTML
element.innerHTML = userInput
// Nếu userInput là <script>malicious_code</script>, nó sẽ được thực thi

// An toàn: dùng textContent hoặc escape
element.textContent = userInput
// Hoặc dùng cơ chế tự động escape của framework ({{ }} của Vue, JSX của React)
```

**Điểm then chốt phòng vệ**:
- Escape các ký tự đặc biệt HTML khi xuất ra (`<`, `>`, `&`, `"`, `'`)
- Sử dụng cơ chế escape tự động của framework hiện đại
- Thiết lập header HTTP `Content-Security-Policy`

### 1.2 SQL Injection

Kẻ tấn công构造 đầu vào đặc biệt để thay đổi logic của truy vấn SQL.

```javascript
// Nguy hiểm: nối chuỗi SQL
const query = `SELECT * FROM users WHERE name = '${userInput}'`
// Nếu userInput là ' OR '1'='1, sẽ trả về tất cả người dùng

// An toàn: dùng parameterized query
const query = 'SELECT * FROM users WHERE name = ?'
db.execute(query, [userInput])
```

**Điểm then chốt phòng vệ**:
- Luôn dùng parameterized query / prepared statement
- Dùng ORM framework (như Prisma, Sequelize)
- Hạn chế quyền của tài khoản cơ sở dữ liệu

### 1.3 CSRF (Cross-Site Request Forgery)

Kẻ tấn công诱导 người dùng đã đăng nhập truy cập trang độc hại, lợi dụng trạng thái đăng nhập để gửi yêu cầu.

**Điểm then chốt phòng vệ**:
- Sử dụng CSRF Token
- Kiểm tra header `Referer` / `Origin`
- Dùng POST thay vì GET cho các thao tác quan trọng
- Thiết lập thuộc tính `SameSite` cho Cookie

---

## 2. Chiến lược phòng vệ

### 2.1 Kiểm tra đầu vào

```javascript
// Kiểm tra whitelist: chỉ cho phép định dạng mong đợi
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Giới hạn độ dài
function isValidUsername(name) {
  return name.length >= 2 && name.length <= 50
}
```

### 2.2 Bảo vệ dữ liệu nhạy cảm

| Loại dữ liệu | Biện pháp bảo vệ |
|---------|---------|
| Mật khẩu | Hash bằng bcrypt/argon2, tuyệt đối không lưu plaintext |
| API Key | Biến môi trường, không push lên repo code |
| Dữ liệu người dùng | Truyền bằng HTTPS, lưu trữ mã hóa |
| Session Token | Cookie với HttpOnly + Secure + SameSite |

### 2.3 HTTP Security Header

```
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000
```

---

## 3. Checklist bảo mật

Trước khi deploy, dùng component tương tác dưới đây để kiểm tra tình trạng bảo mật dự án:

<SecurityChecklistDemo />

### 3.1 Giai đoạn phát triển

- [ ] Tất cả đầu vào người dùng đã được kiểm tra và escape
- [ ] Sử dụng parameterized query, không nối chuỗi SQL
- [ ] Mật khẩu đã được hash bằng bcrypt hoặc thuật toán tương tự
- [ ] Cấu hình nhạy cảm được quản lý qua biến môi trường
- [ ] File `.env` đã được thêm vào `.gitignore`

### 3.2 Giai đoạn deploy

- [ ] Đã bật HTTPS
- [ ] Đã cấu hình HTTP Security Header
- [ ] Đã tắt chế độ debug và thông báo lỗi chi tiết
- [ ] Database sử dụng tài khoản với quyền tối thiểu
- [ ] Thường xuyên cập nhật dependency (`npm audit`)

---

## 4. Hỗ trợ AI: Nâng cao bảo vệ bảo mật với mô hình ngôn ngữ lớn

Mô hình ngôn ngữ lớn có thể làm "cố vấn bảo mật" của bạn, giúp audit lỗ hổng code và tạo phương án bảo mật.

### 4.1 Audit bảo mật code

> **Prompt**:
> ```
> Vui lòng audit bảo mật đoạn code sau, kiểm tra xem có tồn tại không:
> - Lỗ hổng XSS (đầu vào người dùng chưa escape)
> - SQL Injection (truy vấn nối chuỗi)
> - Rủi ro CSRF (thiếu xác minh Token)
> - Rò rỉ dữ liệu nhạy cảm (key hardcode, mật khẩu plaintext)
> Với mỗi vấn đề, nêu cấp độ rủi ro, vị trí cụ thể và phương án khắc phục.
>
> [Dán code của bạn]
> ```

### 4.2 Tạo cấu hình bảo mật

> **Prompt**:
> ```
> Dự án của tôi dùng Express.js + PostgreSQL, sắp deploy lên production.
> Vui lòng tạo checklist cấu hình bảo mật hoàn chỉnh, bao gồm:
> - Code cấu hình HTTP Security Header
> - Cấu hình CORS
> - Cài đặt bảo mật kết nối database
> - Phương án quản lý biến môi trường
> Cung cấp đoạn code có thể dùng ngay.
> ```

### 4.3 Giải thích nguyên lý lỗ hổng

> **Prompt**:
> ```
> Dùng một ví dụ cụ thể, giải thích toàn bộ quy trình tấn công CSRF:
> 1. Kẻ tấn công构造 trang độc hại như thế nào
> 2. Tại sao trình duyệt tự động mang theo Cookie
> 3. Server dùng CSRF Token phòng vệ như thế nào
> Dùng code demo toàn bộ quá trình tấn công và phòng vệ.
> ```

::: tip Lời khuyên sử dụng AI
Audit bảo mật của AI không thể thay thế kiểm tra bảo mật chuyên nghiệp. Hãy coi nó là bộ lọc đầu tiên, hệ thống quan trọng vẫn cần audit bởi team bảo mật chuyên nghiệp.
:::

---

## 5. Tổng kết

1. **Tư duy bảo mật**: Không bao giờ tin tưởng đầu vào bên ngoài, quyền hạn tối thiểu, phòng thủ nhiều lớp
2. **Tấn công phổ biến**: XSS, SQL Injection, CSRF là các mối đe dọa bảo mật Web thường gặp nhất
3. **Chiến lược phòng vệ**: Kiểm tra đầu vào, mã hóa đầu ra, parameterized query, HTTP Security Header
4. **Thói quen bảo mật**: Checklist bảo mật trước khi deploy, định kỳ audit dependency

::: tip Suy ngẫm cuối cùng
Bảo mật không phải công việc một lần, mà là thói quen xuyên suốt quá trình phát triển. Giống như thắt dây an toàn khi lái xe — không phải vì bạn dự đoán sẽ có tai nạn, mà vì đó là ý thức an toàn cơ bản. **Khi viết mỗi dòng code, hãy tự hỏi: Nếu đầu vào này độc hại, sẽ xảy ra chuyện gì?**
:::

---

## Đọc thêm

- **OWASP Top 10**: Danh sách 10 rủi ro bảo mật ứng dụng Web hàng đầu, mọi developer đều nên biết.
- **Công cụ thực tế**: Dùng `npm audit` để kiểm tra lỗ hổng dependency, dùng ESLint security plugin để kiểm tra code.
- **Học sâu hơn**: Tìm hiểu nguyên lý HTTPS, thực hành bảo mật JWT, cân nhắc bảo mật OAuth 2.0.
- **Cộng đồng bảo mật**: Theo dõi thông báo bảo mật, kịp thời vá các lỗ hổng đã biết.

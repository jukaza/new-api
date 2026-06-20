# Nguyên lý cơ sở dữ liệu (Index / Transaction / Tối ưu truy vấn)
::: tip 🎯 Vấn đề cốt lõi
**Tại sao truy vấn Excel của bạn mất 10 giây, trong khi tìm kiếm trên Taobao chỉ cần 0,01 giây?** Khi dữ liệu từ "vài nghìn dòng" biến thành "một tỷ dòng", từ "một người dùng" thành "hàng triệu người truy cập cùng lúc", Excel không còn đủ dùng. Cơ sở dữ liệu ra đời chính để giải quyết vấn đề này — nó là "siêu Excel" chuyên xử lý dữ liệu khổng lồ và truy cập đồng thời lớn. Chương này sẽ hướng dẫn bạn từ con số không hiểu được nguyên lý cốt lõi của cơ sở dữ liệu.
:::

---

## 1. Tại sao cần "cơ sở dữ liệu"?

### 1.1 Từ hiệu sách nhỏ đến Taobao: Sự tiến hóa về quy mô dữ liệu

Hãy tưởng tượng bạn mở một hiệu sách nhỏ, mỗi ngày bán được vài cuốn. Bạn ghi chép tay vào sổ:

```
2024-01-15: Trương Tam mua "Trăm năm cô đơn", 59 đồng
2024-01-16: Lý Tứ mua "Sống", 39 đồng
```

Lúc này, cuốn sổ hoàn toàn đủ dùng. Nhưng khi hiệu sách của bạn trở thành "Amazon", mỗi ngày có hàng triệu đơn hàng, vấn đề xuất hiện:

- **Lượng dữ liệu lớn**: không phải vài chục dòng, mà hàng tỷ dòng
- **Truy cập đồng thời**: không phải một người tra cứu, mà hàng triệu người truy cập cùng lúc
- **Liên kết dữ liệu**: đơn hàng liên kết người dùng, sản phẩm, tồn kho, logistics... quan hệ phức tạp cần quản lý hiệu quả
- **Bảo mật dữ liệu**: không thể mất toàn bộ đơn hàng chỉ vì mất điện

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**📓 Excel/Sổ tay**
- Phù hợp cá nhân hoặc nhóm nhỏ
- Lượng dữ liệu: vài nghìn đến vài vạn dòng
- Một người sử dụng, truy cập tuần tự
- Tìm kiếm thủ công, tốc độ chậm

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🗄️ Cơ sở dữ liệu**
- Phù hợp ứng dụng doanh nghiệp
- Lượng dữ liệu: hàng tỷ trở lên
- Hàng triệu người truy cập đồng thời
- Tốc độ truy vấn tính bằng mili-giây

</div>
</div>

**Đây chính là vấn đề mà "cơ sở dữ liệu" giải quyết: làm sao lưu trữ, truy vấn và quản lý dữ liệu khổng lồ một cách hiệu quả và an toàn?**

### 1.2 Một câu chuyện thực tế: Tại sao không thể dùng Excel lưu dữ liệu người dùng

Bạn có thể nói: "Dự án của tôi mới vài vạn người dùng, Excel không đủ sao?" Hãy để tôi kể một câu chuyện thực tế.

::: warning Câu chuyện khởi nghiệp của Tiểu Lâm
Tiểu Lâm khởi nghiệp làm ứng dụng xã hội, ban đầu người dùng ít, anh dùng Excel lưu thông tin người dùng (tên, số điện thoại, thời gian đăng ký...). Mỗi ngày xuất Excel thống kê tăng trưởng người dùng, mọi thứ ổn.

Khi người dùng vượt 100.000, vấn đề bắt đầu xuất hiện:
- Mở Excel mất 5 phút
- Lọc "người dùng ở Bắc Kinh" phải đợi rất lâu
- Một lần file Excel bị lỗi, hàng nghìn dữ liệu người dùng mất vĩnh viễn

Chí mạng nhất là, anh muốn thực hiện chức năng "xem tất cả đơn hàng của một người dùng" — nhưng thông tin người dùng và đơn hàng nằm ở hai bảng Excel khác nhau, anh chỉ có thể copy-paste thủ công, mỗi lần mất nửa tiếng.

Sau đó anh đi hỏi anh khóa trên, anh kia nhìn một cái rồi cười: "Cậu cần không phải Excel, mà là cơ sở dữ liệu."

Sau khi chuyển sang cơ sở dữ liệu, mọi thứ thay đổi:
- Truy vấn "người dùng Bắc Kinh" chỉ mất 0,01 giây
- Thông qua "quan hệ" tự động liên kết người dùng và đơn hàng, một câu lệnh SQL搞定
- Tự động sao lưu, không còn sợ lỗi file

Tiểu Lâm từ đó hiểu một chân lý: **Khi dữ liệu ít, cái gì cũng dùng được; nhưng khi dữ liệu lớn, Excel là thảm họa.**
:::

::: info 💡 Bài học cốt lõi
Cơ sở dữ liệu không phải "Excel phức tạp hơn", mà là thiết kế hoàn toàn khác:
- **Excel**: thiết kế cho dữ liệu nhỏ, một người dùng
- **Cơ sở dữ liệu**: thiết kế cho dữ liệu lớn, đồng thời cao, quan hệ phức tạp

Chọn đúng công cụ có thể cải thiện hiệu suất hệ thống hàng nghìn lần.
:::

---

## 2. Khái niệm cốt lõi: Bảng, hàng, cột, khóa chính

::: tip 🤔 Các khái niệm này liên quan gì đến cơ sở dữ liệu?
Bảng, hàng, cột, khóa chính chính là các "khối xây dựng" của cơ sở dữ liệu.

Hãy tưởng tượng bạn muốn xây nhà:
- **Bảng** = một căn phòng (lưu một loại dữ liệu)
- **Hàng** = một cái thùng trong phòng (một bản ghi hoàn chỉnh)
- **Cột** = nhãn trên thùng (tên, tuổi, v.v.)
- **Khóa chính** = số serial duy nhất của thùng (tuyệt đối không trùng)

Hiểu các khái niệm cơ bản này, bạn mới biết dữ liệu được tổ chức như thế nào.
:::

Trước khi đi sâu, chúng ta cần nắm rõ vài khái niệm cốt lõi. Sẽ dùng phép so sánh với thư viện để giúp bạn hiểu.

### 2.1 Hiểu cấu trúc cơ sở dữ liệu qua phép so sánh thư viện

Hãy tưởng tượng bạn bước vào một thư viện, cách tổ chức bên trong giống hệt cơ sở dữ liệu:

| Khái niệm | 📚 So sánh thư viện | Tác dụng thực tế | Ví dụ cụ thể |
|-----------|---------------------|------------------|-------------|
| **Cơ sở dữ liệu (Database)** | Toàn bộ thư viện | Container lưu tất cả dữ liệu | CSDL của một website thương mại điện tử |
| **Bảng (Table)** | Một giá sách | Tập hợp lưu cùng loại dữ liệu | Bảng người dùng, bảng sản phẩm, bảng đơn hàng |
| **Cột (Column)** | Nhãn trên gáy sách | Thuộc tính của dữ liệu (trường) | Tên, tuổi, số điện thoại |
| **Hàng (Row)** | Mỗi cuốn sách trên giá | Một bản ghi dữ liệu cụ thể | "Trương Tam, 25 tuổi, Bắc Kinh" |
| **Khóa chính (Primary Key)** | Mã ISBN của mỗi sách | ID định danh duy nhất mỗi hàng | user_id = 1001 |

**Xem ví dụ thực tế**: Bảng người dùng (users)

| user_id (khóa chính) | name | age | city | email |
|:--------------------:|------|-----|------|-------|
| 1001 | 张三 | 25 | 北京 | zhangsan@example.com |
| 1002 | 李四 | 30 | 上海 | lisi@example.com |
| 1003 | 王五 | 28 | 北京 | wangwu@example.com |

- **Bảng**: `users` (lưu tất cả dữ liệu người dùng)
- **Cột**: `user_id`, `name`, `age`, `city`, `email` (thuộc tính mỗi người dùng)
- **Hàng**: mỗi hàng là một người dùng (như "张三, 25 tuổi, 北京")
- **Khóa chính**: `user_id` (1001, 1002, 1003, không bao giờ trùng)

### 2.2 Khóa chính (Primary Key): "Số CMND" của dữ liệu

::: tip 📖 Khóa chính là gì?
**Khóa chính** là định danh duy nhất mỗi hàng trong bảng, giống như số CMND.

**Đặc điểm chính**:
- **Tính duy nhất**: tuyệt đối không trùng (không có hai người cùng số CMND)
- **Không null**: bắt buộc phải có giá trị (không thể có người "không có số CMND")
- **Bất biến**:一旦 thiết lập, không thay đổi (số CMND của bạn không đổi)

**Cách phổ biến**:
- Dùng số nguyên tự tăng: 1, 2, 3, 4...
- Dùng UUID (định danh duy nhất toàn cầu): `550e8400-e29b-41d4-a716-446655440000`
:::

Tại sao cần khóa chính? Hãy tưởng tượng thế giới không có khóa chính:

**Kịch bản**: Bạn muốn sửa tuổi của "张三", nhưng bảng có 3 người tên "张三", hệ thống sửa ai?

```sql
-- Không có khóa chính, lệnh này sửa tất cả người tên "张三"!
UPDATE users SET age = 26 WHERE name = '张三';

-- Có khóa chính, sửa chính xác
UPDATE users SET age = 26 WHERE user_id = 1001;
```

**Quy tắc vàng của khóa chính**: mỗi bảng nên có một khóa chính, và không bao giờ sửa nó.

### 2.3 Khóa ngoại (Foreign Key): Cầu nối giữa các bảng

Đây là điểm then chốt khiến CSDL mạnh hơn Excel — **các bảng có thể tạo quan hệ với nhau**.

::: tip 📖 Khóa ngoại là gì?
**Khóa ngoại** là cột trỏ đến khóa chính của bảng khác, dùng để tạo liên kết giữa các bảng.

**Hiểu đơn giản**:
- Khóa chính = số CMND của tôi
- Khóa ngoại = số CMND của người khác mà tôi tham chiếu

**Ví dụ**: `user_id` trong bảng đơn hàng là khóa ngoại, nó trỏ đến khóa chính của bảng người dùng.
:::

Xem một ví dụ thực tế:

**Bảng người dùng (users)**:

| user_id (khóa chính) | name | phone |
|:--------------------:|------|-------|
| 1001 | 张三 | 138xxxx |
| 1002 | 李四 | 139xxxx |

**Bảng đơn hàng (orders)**:

| order_id (khóa chính) | product_name | price | user_id (khóa ngoại) |
|:---------------------:|-------------|-------|:--------------------:|
| 5001 | iPhone 15 | 5999 | 1001 |
| 5002 | MacBook | 14999 | 1001 |
| 5003 | AirPods | 1999 | 1002 |

**Hiểu chính**:
- `user_id = 1001` trong bảng đơn hàng trỏ đến `user_id = 1001` trong bảng người dùng (张三)
- Khi bạn muốn biết "đơn hàng 5001 là của ai", CSDL tự động tìm trong bảng người dùng `user_id = 1001`

**Lợi ích**:
- **Dữ liệu không trùng**: Trương Tam mua 100 đơn hàng, thông tin của anh ấy cũng chỉ lưu một lần trong bảng người dùng
- **Dễ bảo trì**: Trương Tam đổi số điện thoại, chỉ cần sửa bảng người dùng, tất cả đơn hàng tự động liên kết số mới
- **Truy vấn linh hoạt**: có thể dễ dàng trả lời "tổng chi tiêu của mỗi người dùng là bao nhiêu"

<DatabaseRelationDemo />

---

## 3. Làm sao giao tiếp với CSDL? Nhập môn SQL và thực chiến

Bạn không thể dùng chuột "click" trực tiếp vào CSDL (dù có công cụ đồ họa, bản chất vẫn là chuyển thành lệnh), bạn cần dùng một ngôn ngữ đặc biệt để chỉ đạo CSDL hoạt động.

Ngôn ngữ đó chính là **SQL (Structured Query Language, Ngôn ngữ truy vấn có cấu trúc)**.

Tin tốt là: SQL rất gần với tiếng Anh tự nhiên, đọc giống như đang nói chuyện.

### 3.1 Các thao tác cốt lõi của SQL: CRUD

Phần lớn thời gian, bạn chỉ cần nắm bốn thao tác, dân trong ngành gọi là **CRUD**:

| Thao tác | Tiếng Anh | Từ khóa SQL | Hiểu dân dã |
|----------|-----------|-------------|-------------|
| **C**reate (Tạo) | Tạo | `INSERT` | Thêm một dữ liệu |
| **R**ead (Đọc) | Đọc | `SELECT` | Truy vấn dữ liệu |
| **U**pdate (Cập nhật) | Sửa | `UPDATE` | Sửa dữ liệu |
| **D**elete (Xóa) | Xóa | `DELETE` | Xóa dữ liệu |

::: tip 📊 Từ bảng bạn thấy gì?
Bốn thao tác này bao phủ mọi kịch bản xử lý dữ liệu:
- **Create**: khi người dùng đăng ký, chèn một bản ghi mới
- **Read**: khi người dùng đăng nhập, truy vấn tên và mật khẩu
- **Update**: khi người dùng sửa thông tin cá nhân, cập nhật dữ liệu trong bảng
- **Delete**: khi người dùng xóa tài khoản, xóa dữ liệu người dùng

Nhớ bốn thao tác này, bạn đã nắm 80% thao tác SQL hàng ngày.
:::

### 3.2 Truy vấn dữ liệu (SELECT): Thao tác phổ biến nhất

Truy vấn là chức năng quan trọng nhất của CSDL và là then chốt tối ưu hiệu suất.

**Ví dụ 1**: Tìm tất cả người dùng ở Bắc Kinh

```sql
SELECT name, age FROM users WHERE city = '北京';
```

**Hiểu từng từ**:
- `SELECT name, age`: chọn cột name và age
- `FROM users`: từ bảng users
- `WHERE city = '北京'`: trong điều kiện city bằng "Bắc Kinh"

**Kết quả**:

| name | age |
|------|-----|
| 张三 | 25 |
| 王五 | 28 |

**Ví dụ 2**: Tìm sản phẩm có giá từ 5000 đến 15000

```sql
SELECT name, price FROM products
WHERE price BETWEEN 5000 AND 15000;
```

**Ví dụ 3**: Tìm kiếm mờ (tìm người có tên chứa "张")

```sql
SELECT name FROM users WHERE name LIKE '%张%';
```

::: warning ⚠️ Bẫy hiệu suất: Sử dụng LIKE
`LIKE '%张%'` gây **quét toàn bảng**, rất chậm khi dữ liệu lớn.

**Khuyến nghị tối ưu**:
- ❌ Không dùng `LIKE '%张%'` (có % cả trước và sau)
- ✅ Có thể dùng `LIKE '张%'` (chỉ có % phía sau)

Vì `LIKE '张%'` có thể dùng index, còn `LIKE '%张%'` không thể dùng index.
:::

### 3.3 Chèn dữ liệu (INSERT): Thêm bản ghi

**Ví dụ**: Thêm một người dùng mới

```sql
INSERT INTO users (user_id, name, age, city, email)
VALUES (1004, '赵六', 35, '广州', 'zhaoliu@example.com');
```

**Hiểu từng từ**:
- `INSERT INTO users`: chèn vào bảng users
- `(user_id, name, age, city, email)`: chỉ định các cột cần chèn
- `VALUES (1004, '赵六', ...)`: các giá trị tương ứng

**Chèn hàng loạt** (hiệu quả hơn):

```sql
INSERT INTO users (name, age, city) VALUES
('小明', 25, '北京'),
('小红', 28, '上海'),
('小刚', 30, '广州');
```

### 3.4 Cập nhật dữ liệu (UPDATE): Sửa bản ghi

**Ví dụ**: Tăng tuổi tất cả người dùng ở Bắc Kinh lên 1

```sql
UPDATE users SET age = age + 1 WHERE city = '北京';
```

::: danger ❌ Rất nguy hiểm: Đừng quên WHERE!
Nếu bạn quên mệnh đề `WHERE`, sẽ sửa **tất cả các hàng**!

```sql
-- Nguy hiểm! Sẽ sửa tuổi tất cả người dùng thành 26
UPDATE users SET age = 26;

-- Đúng: chỉ sửa người dùng có user_id = 1001
UPDATE users SET age = 26 WHERE user_id = 1001;
```

**Bài học thực tế**: Năm 2012, một công ty nổi tiếng do kỹ sư quên viết WHERE, dẫn đến dữ liệu hàng triệu người dùng trong môi trường production bị cập nhật sai, hệ thống sập 4 tiếng, thiệt hại khổng lồ.
:::

### 3.5 Xóa dữ liệu (DELETE): Xóa bản ghi

**Ví dụ**: Xóa người dùng có user_id = 1004

```sql
DELETE FROM users WHERE user_id = 1004;
```

::: danger ❌ Nguy hiểm kép: DELETE càng cần WHERE hơn!
```sql
-- Nguy hiểm! Sẽ xóa toàn bộ dữ liệu trong bảng!
DELETE FROM users;

-- Đúng: chỉ xóa hàng được chỉ định
DELETE FROM users WHERE user_id = 1004;
```

**Thực hành tốt nhất**:
1. Trước khi xóa, dùng SELECT xác nhận dữ liệu
2. Trong hệ thống quan trọng, dùng "xóa mềm" (thêm trường `is_deleted` đánh dấu xóa)
3. Sao lưu dữ liệu trước khi thao tác trên môi trường production
:::

### 3.6 Truy vấn đa bảng (JOIN): Khoảnh khắc kỳ diệu của CSDL

Nhớ "khóa ngoại" chúng ta đã nói? Điểm mạnh nhất của SQL là có thể truy vấn nhiều bảng liên quan cùng lúc.

**Kịch bản**: Truy vấn "tất cả sản phẩm Trương Tam đã mua"

Giả sử chúng ta có ba bảng:

**Bảng người dùng (users)**:
| user_id | name |
|---------|------|
| 1001 | 张三 |

**Bảng sản phẩm (products)**:
| product_id | name | price |
|------------|------|-------|
| 201 | iPhone 15 | 5999 |
| 202 | MacBook | 14999 |

**Bảng đơn hàng (orders)**:
| order_id | user_id | product_id | quantity |
|----------|---------|------------|----------|
| 5001 | 1001 | 201 | 1 |
| 5002 | 1001 | 202 | 2 |

**Truy vấn SQL**:

```sql
SELECT u.name, p.name AS product_name, p.price, o.quantity
FROM orders o
JOIN users u ON o.user_id = u.user_id
JOIN products p ON o.product_id = p.product_id
WHERE u.name = '张三';
```

**Kết quả**:

| name | product_name | price | quantity |
|------|--------------|-------|----------|
| 张三 | iPhone 15 | 5999 | 1 |
| 张三 | MacBook | 14999 | 2 |

**Hiểu quá trình JOIN**:
1. `FROM orders o`: bắt đầu từ bảng đơn hàng
2. `JOIN users u ON o.user_id = u.user_id`: liên kết bảng người dùng qua user_id
3. `JOIN products p ON o.product_id = p.product_id`: liên kết bảng sản phẩm qua product_id
4. `WHERE u.name = '张三'`: lọc đơn hàng của Trương Tam

<SqlPlaygroundDemo />

---

## 4. Tại sao CSDL nhanh như vậy? Bí mật của Index

Đây là phần kỳ diệu nhất của CSDL, cũng là câu hỏi được hỏi nhiều nhất trong phỏng vấn.

Nếu bạn tìm trong Excel "tất cả những người họ 张", Excel phải quét từ dòng đầu đến dòng cuối. Đây gọi là **quét toàn bảng** — dữ liệu càng nhiều, càng chậm.

Nhưng trong CSDL, dù có 1 tỷ dòng, tìm kiếm chỉ mất vài mili-giây.

**Bí mật chính là: Index (Chỉ mục).**

### 4.1 Hiểu trực quan: Cảm hứng từ từ điển

Hãy tưởng tượng bạn cần tìm một từ trong cuốn sách 1000 trang không có mục lục. Bạn làm sao?

**Chỉ lật từng trang** — đây là quét toàn bảng, trung bình phải lật 500 trang.

Nhưng nếu cuốn sách đó có **bảng tra theo pinyin**?

Bạn tìm từ "数据库":
1. Lật đến phần mục lục, tìm khu vực bắt đầu bằng chữ "数"
2. Trong khu vực "数", tìm chữ "据"
3. Mục lục cho biết: trang 256

Bạn chỉ cần tra 3 lần là tìm thấy! Đây là **tra theo index**.

**Index của CSDL giống như mục lục của sách**:
- Không có index: quét từng dòng (1 tỷ dòng = vài phút)
- Có index: nhảy thẳng đến (1 tỷ dòng = 3-4 lần đọc đĩa = mili-giây)

### 4.2 Quét toàn bảng vs Tra index: So sánh tốc độ

Giả sử bảng người dùng có 10 triệu bản ghi.

**Kịch bản**: Tìm người dùng có `user_id = 5,555,555`

| Phương pháp | Quá trình | Số hàng cần kiểm tra | Thời gian ước tính |
|-------------|-----------|---------------------|-------------------|
| **Quét toàn bảng** | Bắt đầu từ hàng 1, kiểm tra từng hàng | Trung bình 5 triệu | 5-30 giây |
| **Tra index** | Tra cây index, nhảy thẳng đến vị trí | 3-4 lần so sánh | 0,003 giây |

**Chênh lệch tốc độ: Hàng nghìn lần!**

::: tip 💡 Bài học cốt lõi
Index không phải đạn bạc, nó có cái giá:
- **Chiếm dung lượng**: index cần không gian lưu trữ thêm
- **Làm chậm ghi**: mỗi INSERT/UPDATE/DELETE phải cập nhật index

**Khi nào nên tạo index?**
- Cột thường xuyên dùng để truy vấn (điều kiện WHERE, JOIN)
- Dữ liệu lớn (vài nghìn dòng trở xuống không cần)

**Khi nào KHÔNG nên tạo index?**
- Cột ít khi truy vấn
- Cột cập nhật thường xuyên
- Bảng có ít dữ liệu
:::

### 4.3 Cấu trúc dữ liệu nền tảng: Cây B+

Index thực tế không phải là "danh sách chữ cái" đơn giản, mà là cấu trúc dữ liệu được thiết kế tinh tế, gọi là **Cây B+ (B+ Tree)**.

::: tip 📖 Cây B+ là gì?
**Cây B+** là cấu trúc dữ liệu cây "lùn và béo":

- **Lùn**: từ gốc đến lá thường chỉ 3-4 tầng
- **Béo**: mỗi nút có thể lưu hàng trăm key

**Tại sao phải "lùn và béo"?**

Vì dữ liệu lưu trên đĩa, mỗi lần đọc đĩa (I/O) rất chậm (chậm hơn bộ nhớ hàng nghìn lần). Mục tiêu thiết kế của Cây B+ là **giảm thiểu số lần I/O đĩa**.

- 3-4 tầng = tối đa 3-4 lần đọc đĩa
- Mỗi tầng lưu nhiều dữ liệu = đảm bảo cây không bị cao
:::

**Ví dụ thực tế**:

Giả sử mỗi nút của Cây B+ lưu được 1000 key:

- **Nút gốc**: 1000 key → trỏ đến 1000 nút con
- **Nút trung gian**: mỗi nút lưu 1000 key → trỏ đến 1000 nút lá
- **Nút lá**: mỗi nút lưu 1000 bản ghi thực tế

**Tổng dữ liệu** = 1000 × 1000 × 1000 = **1 tỷ bản ghi**

**Chiều cao cây** = **3 tầng**

Nghĩa là: trong 1 tỷ bản ghi, tìm bất kỳ bản ghi nào chỉ cần **3 lần đọc đĩa**!

Đó là bí mật tốc độ thần tốc của CSDL.

<BPlusTreeDemo />

---

## 5. Transaction: Làm sao đảm bảo dữ liệu không mất, không loạn?

Hãy tưởng tượng cảnh mua vé tàu dịp Tết:

- Thời điểm T1: Người dùng A truy vấn, thấy "tàu G1234 còn 1 vé"
- Thời điểm T2: Người dùng B cũng truy vấn, cũng thấy "còn 1 vé"
- Thời điểm T3: Người dùng A bấm "mua", hệ thống trừ tồn kho, vé bán cho A
- Thời điểm T4: Người dùng B bấm "mua" — nếu không có cơ chế bảo vệ, hệ thống sẽ trừ tồn kho lần nữa, bán cùng một vé cho B!

Đây là vấn đề **xung đột đồng thời** điển hình.

### 5.1 Transaction là gì?

**Transaction** là một nhóm thao tác của CSDL, các thao tác này **hoặc tất cả thành công, hoặc tất cả thất bại**, không xuất hiện tình trạng "làm dở dang".

::: tip 🤖 Ví dụ đời thường
**Chuyển khoản ngân hàng** là transaction điển hình:

1. Trừ 100 đồng từ tài khoản A
2. Cộng 100 đồng vào tài khoản B

Nếu bước 1 thành công nhưng bước 2 thất bại (ví dụ mất điện), chuyện gì xảy ra?
- **Không có transaction**: Tiền tài khoản A mất, tài khoản B không nhận được — tiền bốc hơi
- **Có transaction**: Hệ thống phát hiện bước 2 thất bại, tự động rollback bước 1, cả hai tài khoản trở về trạng thái ban đầu

Đây chính là **tính nguyên tử** của transaction: hoặc tất cả, hoặc không gì cả.
:::

### 5.2 Bốn đặc tính của Transaction (ACID)

Transaction có bốn đặc tính, gọi tắt là **ACID**:

| Đặc tính | Tiếng Anh | Ý nghĩa | Ví dụ chuyển khoản |
|----------|-----------|---------|-------------------|
| **A**tomicity (Nguyên tử) | Atomicity | Hoặc tất cả hoặc không gì cả | Trừ tiền và nhận tiền phải thành công cùng lúc, không thể chỉ trừ mà không nhận |
| **C**onsistency (Nhất quán) | Consistency | Dữ liệu luôn ở trạng thái hợp lệ | Trước và sau chuyển khoản, tổng số tiền hai tài khoản không đổi |
| **I**solation (Cách ly) | Isolation | Nhiều transaction không ảnh hưởng lẫn nhau | Khi A đang chuyển, B thấy số dư phải là "trước chuyển" hoặc "sau chuyển", không thấy trạng thái trung gian |
| **D**urability (Bền vững) | Durability | Khi đã commit, dữ liệu lưu vĩnh viễn | Sau khi chuyển khoản thành công, dù mất điện, số dư cũng không quay lại |

::: tip 📊 Từ bảng bạn thấy gì?
Bốn đặc tính này đảm bảo an toàn dữ liệu:

- **Nguyên tử**: ngăn "làm dở" (trừ tiền nhưng chưa đến tài khoản)
- **Nhất quán**: ngăn dữ liệu phi lý (tổng tiền thay đổi sau chuyển khoản)
- **Cách ly**: ngăn xung đột đồng thời (hai người sửa cùng dữ liệu)
- **Bền vững**: ngăn mất dữ liệu (mất điện sau commit không ảnh hưởng)

Không có các đảm bảo này, hệ thống ngân hàng không thể hoạt động.
:::

### 5.3 Mức độ cách ly của Transaction: Cân bằng an toàn và hiệu suất

Về lý thuyết, chúng ta muốn transaction hoàn toàn cách ly. Nhưng **cách ly hoàn toàn = hiệu suất rất thấp** (vì cần khóa nhiều, transaction khác phải chờ).

Do đó, CSDL cung cấp bốn **mức cách ly**:

| Mức cách ly | Đọc bẩn | Không lặp lại | Đọc ảo | Hiệu suất | Kịch bản sử dụng |
|-------------|---------|---------------|---------|-----------|-----------------|
| **Read Uncommitted** | Có thể | Có thể | Có thể | Nhanh nhất | Gần như không dùng (dữ liệu có thể sai) |
| **Read Committed** | Không thể | Có thể | Có thể | Khá nhanh | Nghiệp vụ thông thường (mặc định Oracle) |
| **Repeatable Read** | Không thể | Không thể | Có thể | Trung bình | Chuyển khoản ngân hàng (mặc định MySQL) |
| **Serializable** | Không thể | Không thể | Không thể | Chậm nhất | Kịch bản cực kỳ nghiêm ngặt (hiếm khi dùng) |

::: tip 📖 Ba loại "đọc" là gì?
- **Đọc bẩn**: đọc được dữ liệu transaction khác chưa commit (có thể rollback, dữ liệu không chính xác)
- **Không lặp lại**: trong cùng transaction, hai lần đọc cùng dữ liệu nhưng kết quả khác nhau (bị transaction khác sửa)
- **Đọc ảo**: trong cùng transaction, hai lần truy vấn số hàng khác nhau (transaction khác chèn/xóa dữ liệu)

**Ví dụ dễ hiểu** (tra số dư ngân hàng):
- **Đọc bẩn**: bạn thấy số dư 1000, nhưng transaction kia bị rollback, thực tế chỉ có 100
- **Không lặp lại**: lần đầu thấy số dư 1000, lần hai thấy 800 (bị trừ giữa chừng)
- **Đọc ảo**: lần đầu thấy 5 giao dịch, lần hai thấy 6 (thêm một giao dịch mới)
:::

<TransactionACIDDemo />

---

## 6. Tối ưu hiệu suất: Kỹ thuật thực chiến tăng tốc truy vấn 1000 lần

Bây giờ bạn đã hiểu các khái niệm cốt lõi như index và transaction. Nhưng trong dự án thực tế, bạn có thể gặp nhiều vấn đề hiệu suất.

Phần này sẽ đưa ra **các chiến lược tối ưu có thể áp dụng ngay**.

### 6.1 Hướng dẫn tránh bẫy khi dùng index

::: warning ⚠️ Lỗi phổ biến: Bẫy index mất hiệu lực
Nhiều khi, bạn đã tạo index nhưng truy vấn vẫn chậm — vì index **bị vô hiệu hóa**.

**Nguyên nhân phổ biến khiến index mất hiệu lực**:
1. Dùng hàm trên cột có index
2. Ép kiểu ngầm
3. LIKE bắt đầu bằng %
4. Điều kiện OR (một số trường hợp)
5. Index tổ hợp không tuân thủ nguyên tắc tiền tố trái nhất
:::

**Bẫy 1: Dùng hàm trên cột có index**

```sql
-- ❌ Sai: dùng hàm trên cột index, không thể dùng index
SELECT * FROM users WHERE YEAR(created_at) = 2024;

-- ✅ Đúng: viết lại thành truy vấn phạm vi, có thể dùng index
SELECT * FROM users
WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';
```

**Bẫy 2: Ép kiểu ngầm**

```sql
-- Giả sử user_id là kiểu int
-- ❌ Sai: truyền chuỗi, gây ép kiểu ngầm, không dùng được index
SELECT * FROM users WHERE user_id = '123';

-- ✅ Đúng: truyền đúng kiểu
SELECT * FROM users WHERE user_id = 123;
```

**Bẫy 3: LIKE bắt đầu bằng %**

```sql
-- ❌ Sai: bắt đầu bằng %, không dùng được index
SELECT * FROM users WHERE name LIKE '%张三%';

-- ✅ Đúng: bắt đầu bằng tiền tố cố định, dùng được index
SELECT * FROM users WHERE name LIKE '张三%';

-- ✅ Hoặc dùng full-text index (phù hợp tìm kiếm văn bản)
SELECT * FROM users WHERE MATCH(name) AGAINST('张三');
```

### 6.2 Mẫu tối ưu SQL thực chiến

**Mẫu 1: Tối ưu phân trang (vấn đề phân trang sâu)**

::: details Xem vấn đề và giải pháp
```sql
-- ❌ Vấn đề: OFFSET lớn, truy vấn ngày càng chậm
SELECT * FROM orders
ORDER BY created_at DESC
LIMIT 10 OFFSET 1000000;

-- ✅ Giải pháp 1: Dùng timestamp lần truy vấn trước làm con trỏ
SELECT * FROM orders
WHERE created_at < '2024-01-15 12:00:00'
ORDER BY created_at DESC
LIMIT 10;

-- ✅ Giải pháp 2: Dùng truy vấn phạm vi khóa chính
SELECT * FROM orders
WHERE order_id > 1000000
ORDER BY order_id
LIMIT 10;
```
:::

**Mẫu 2: Tối ưu chèn hàng loạt**

```sql
-- ❌ Kém hiệu quả: chèn đơn nhiều lần (nhiều chuyến đi lại mạng)
INSERT INTO users (name, age) VALUES ('张三', 25);
INSERT INTO users (name, age) VALUES ('李四', 30);
INSERT INTO users (name, age) VALUES ('王五', 28);

-- ✅ Hiệu quả: chèn hàng loạt trong một câu SQL (chỉ một chuyến mạng)
INSERT INTO users (name, age) VALUES
('张三', 25),
('李四', 30),
('王五', 28);
```

**Mẫu 3: Tránh SELECT ***

```sql
-- ❌ Kém hiệu quả: trả tất cả cột (kể cả trường lớn không cần)
SELECT * FROM users WHERE user_id = 1;

-- ✅ Hiệu quả: chỉ trả các cột cần thiết
SELECT user_id, name, email FROM users WHERE user_id = 1;
```

### 6.3 Chiến lược đối phó kịch bản đồng thời cao

| Kịch bản | Vấn đề | Giải pháp |
|----------|---------|-----------|
| **Dữ liệu điểm nóng** | Một hàng được đọc/ghi liên tục, gây tranh chấp khóa | Dùng cache (Redis) + tách đọc/ghi |
| **Flash sale** | Giảm tồn kho đồng thời tức thời | Khóa lạc quan + làm nóng tồn kho + hàng đợi tin nhắn cắt đỉnh |
| **Truy vấn chậm** | Truy vấn phức tạp kéo sập CSDL | Tối ưu index + tách truy vấn + tách đọc/ghi |
| **Hết kết nối** | Quá nhiều request đồng thời làm cạn pool kết nối | Tối ưu pool kết nối + giới hạn流量 + hạ cấp dịch vụ |

::: tip 💡 Bài học cốt lõi
Nguyên tắc cơ bản của tối ưu hiệu suất:
1. **Đo trước, tối ưu sau**: dùng `EXPLAIN` phân tích kế hoạch truy vấn, tìm nút thắt thực sự
2. **Index ưu tiên**: 80% vấn đề hiệu suất giải quyết được bằng tối ưu index
3. **Giảm áp lực CSDL**: dùng được cache thì dùng, được bất đồng bộ thì bất đồng bộ
4. **Chia để trị**: bảng lớn chia thành bảng nhỏ, truy vấn lớn chia thành truy vấn nhỏ
:::

<QueryOptimizationDemo />

---

## 7. Tổng kết và lộ trình học

Hãy ôn lại các khái niệm cốt lõi của CSDL qua một bảng:

| Khái niệm | Giải thích một câu | Vấn đề giải quyết | Điểm chính |
|-----------|-------------------|-------------------|-----------|
| **Bảng, hàng, cột** | Cách tổ chức dữ liệu | Lưu dữ liệu có cấu trúc như thế nào | Bảng = Sheet Excel, Hàng = bản ghi, Cột = trường |
| **Khóa chính** | Định danh duy nhất mỗi hàng | Tìm chính xác một hàng như thế nào | Duy nhất, không null, bất biến |
| **Khóa ngoại** | Cầu nối giữa các bảng | Liên kết dữ liệu bảng khác như thế nào | Trỏ đến khóa chính bảng khác |
| **SQL** | Ngôn ngữ giao tiếp với CSDL | Thêm/xóa/sửa/truy vấn dữ liệu như thế nào | SELECT, INSERT, UPDATE, DELETE |
| **Index** | Cấu trúc dữ liệu tăng tốc truy vấn | Tìm dữ liệu nhanh như thế nào | Cây B+, giảm I/O đĩa |
| **Transaction** | Cơ chế đảm bảo an toàn dữ liệu | Ngăn xung đột đồng thời và mất dữ liệu như thế nào | ACID: Nguyên tử, Nhất quán, Cách ly, Bền vững |

::: info Lời cuối
Cơ sở dữ liệu là một chủ đề bao la và sâu sắc, bài viết này chỉ là nhập môn. Nếu bạn muốn tiếp tục học sâu, đề nghị lộ trình sau:

**Bước tiếp theo**:
1. **Thực hành**: cài MySQL hoặc PostgreSQL, tạo bảng, chèn dữ liệu, viết truy vấn SQL
2. **Framework ORM**: học cách dùng CSDL trong code (như SQLAlchemy, Prisma, TypeORM)
3. **Tối ưu index**: nghiên cứu sâu index tổ hợp, index phủ, đẩy index xuống
4. **Nguyên lý transaction**: tìm hiểu MVCC (kiểm soát đồng thời đa phiên bản), cơ chế khóa, triển khai mức cách ly
5. **CSDL phân tán**: học chia库分表, tách đọc/ghi, đồng bộ主从

Nhớ: **Lý thuyết + Thực hành = Nắm vững thực sự**.
:::

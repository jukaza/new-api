# Hướng dẫn chuyên sâu JavaScript

::: tip Lời nói đầu
Bạn đã học HTML và CSS, có thể tạo ra những trang web đẹp mắt. Nhưng bạn có thể nhận thấy: nhấn nút không có phản hồi, điền form không gửi được, trang web giống như một bức ảnh "tĩnh".

Đây chính là lý do chúng ta cần JavaScript — nó giúp trang web "sống" dậy. Nhấn nút hiện menu, nhập chữ thì tìm kiếm theo thời gian thực, cuộn trang thì tải thêm nội dung… tất cả những hiệu ứng tương tác này đều nhờ vào JavaScript.

Trong vibecoding, AI sẽ viết phần lớn code cho bạn. Nhưng ít nhất bạn phải đọc hiểu được code đang làm gì, nếu không AI viết sai bạn cũng không phát hiện ra. Đọc xong bài này, bạn sẽ có thể:

- Đọc hiểu code AI viết đang làm gì
- Nhận ra code có vấn đề ở đâu
- Dùng ngôn ngữ rõ ràng để bảo AI sửa như thế nào
:::

**Bài viết này sẽ dạy bạn những gì?**

| Chương | Nội dung | Học xong làm được gì |
|-----|------|-----------|
| **Chương 1** | JavaScript là gì | Hiểu vai trò của nó trong trang web |
| **Chương 2** | Dữ liệu và biến | Biết chương trình lưu trữ và sử dụng dữ liệu như thế nào |
| **Chương 3** | Hàm và logic | Đọc hiểu logic phán đoán, vòng lặp và tái sử dụng của code |
| **Chương 4** | DOM và sự kiện | Biết code điều khiển trang web và phản hồi thao tác người dùng như thế nào |
| **Chương 5** | Kỹ thuật thực chiến | Cách đọc code AI, cách nói khi gặp lỗi |

Mỗi chương đều bắt đầu từ "nhận diện code", không cần bạn phải tự viết tay. Gặp code không hiểu, quay lại tra cứu bất cứ lúc nào.

---

## 1. JavaScript là gì

::: tip 🤔 Câu hỏi cốt lõi
**Tại sao trang web cần JavaScript?** HTML và CSS đã giúp trang web có nội dung và kiểu dáng, tại sao còn phải học một ngôn ngữ mới?
:::

### 1.1 Từ "trang web tĩnh" đến "ứng dụng động"

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**📄 Trang web không có JavaScript**
- Nội dung cố định, không thể tương tác
- Nhấn nút không có phản hồi
- Điền form không gửi được
- Trang không tự động cập nhật

*Giống như một tấm áp phích giấy, chỉ để xem*

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🚀 Trang web có JavaScript**
- Nhấn nút hiện menu
- Nhập chữ tìm kiếm theo thời gian thực
- Cuộn trang tự động tải nội dung
- Dữ liệu hiển thị cập nhật theo thời gian thực

*Giống như một ứng dụng thực sự*

</div>
</div>

**Hiểu mối quan hệ giữa ba công nghệ trong một câu:**

| Công nghệ | Ẩn dụ | Vai trò |
|------|------|------|
| **HTML** | Bộ xương | Định nghĩa cấu trúc và nội dung trang web |
| **CSS** | Làn da | Định nghĩa giao diện và kiểu dáng trang web |
| **JavaScript** | Cơ bắp và hệ thần kinh | Giúp trang web phản hồi, tương tác và suy nghĩ |

### 1.2 Tại sao vibecoding cũng cần hiểu JavaScript?

::: warning Câu chuyện của một developer mới học JS
Một developer mới học JavaScript đã dùng AI để làm ứng dụng "bộ đếm": nhấn nút, số tăng thêm 1. Code AI tạo ra hoạt động bình thường.

Nhưng anh ấy muốn đổi thành "nhấn tăng 2", nói với AI: "Cho mỗi lần nhấn tăng 2." AI đã sửa code, nhưng số vẫn chỉ tăng 1.

Anh ấy hỏi AI tại sao không có hiệu quả, AI giải thích một hồi, nhưng anh ấy không hiểu `count = count + 1` trong code nghĩa là gì, cũng không biết AI có sửa đúng chỗ đó không. Chỉ đành lặp đi lặp lại "tăng 2 không có hiệu quả", AI lại sửa thêm mấy phiên bản nữa, có phiên bản đổi giá trị ban đầu thành 2, có phiên bản thêm 2 vào một chỗ hoàn toàn không liên quan.

Cuối cùng anh ấy đọc khái niệm "biến" ở Chương 2, hiểu được `count = count + 1` là đang cộng giá trị của count thêm 1 rồi lưu lại. Sau đó anh ấy nói với AI: "Đổi `count + 1` thành `count + 2`."

Sửa một lần là đúng luôn.

**Đây chính là lý do cần hiểu JavaScript — không phải để tự viết code, mà là để khi AI sửa chưa đúng, bạn có thể nhìn một cái là thấy vấn đề ở đâu, nói một câu là trúng ngay điểm mấu chốt.**
:::

### 1.3 Xem trước: một đoạn code AI thực tế

Trước khi học sâu, hãy xem một đoạn code thực tế do AI tạo ra. Đừng lo không hiểu, chỉ cần có ấn tượng, sau này chúng ta sẽ giải thích từng phần.

**Kịch bản**: Làm chức năng "nhấn nút đổi màu nền"

```javascript
// Định nghĩa một nhóm màu
const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4']
let currentIndex = 0

// Tìm nút trên trang
const button = document.querySelector('#changeBtn')

// Thêm sự kiện nhấn cho nút
button.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % colors.length
  document.body.style.backgroundColor = colors[currentIndex]
})
```

**Đoạn code này đang làm gì?**

| Code | Vai trò | Chương tương ứng |
|------|------|----------|
| `const colors = [...]` | Định nghĩa một nhóm dữ liệu màu | Chương 2: Mảng |
| `let currentIndex = 0` | Ghi lại màu thứ mấy đang hiển thị | Chương 2: Biến |
| `document.querySelector(...)` | Tìm nút trên trang | Chương 4: Tìm kiếm DOM |
| `button.addEventListener(...)` | Thêm sự kiện nhấn cho nút | Chương 4: Lắng nghe sự kiện |
| `() => {...}` | Định nghĩa code sẽ chạy sau khi nhấn | Chương 3: Hàm mũi tên |

::: info 💡 Gợi ý cốt lõi
Bạn không cần hiểu từng dòng code ngay bây giờ. Chỉ cần nhớ: **Code JavaScript là một chuỗi chỉ thị, nói với trình duyệt "khi người dùng làm gì đó, thì điều gì sẽ xảy ra".**
:::

---

## 2. Dữ liệu: Biến và kiểu dữ liệu

::: tip 🤔 Câu hỏi cốt lõi
**Chương trình "ghi nhớ" mọi thứ như thế nào?** Nội dung người dùng nhập, dữ liệu lấy từ máy chủ, kết quả trung gian trong quá trình tính toán — những thông tin này được lưu ở đâu?
:::

### 2.1 Biến: đặt tên cho dữ liệu

**Biến giống như một chiếc hộp có nhãn** — bạn có thể bỏ dữ liệu vào, sau này thông qua nhãn để lấy ra dùng.

```javascript
const name = "张三"   // Tên sẽ không thay đổi, dùng const
let age = 25          // Tuổi có thể thay đổi, dùng let
```

**Tại sao phải phân biệt const và let?**

Hãy tưởng tượng: số chứng minh nhân dân (const) của bạn cả đời không thay đổi, nhưng tuổi (let) của bạn mỗi năm đều thay đổi. JavaScript cho phép bạn dùng các từ khóa khác nhau để thể hiện ý định "thay đổi hay không thay đổi" này.

| Từ khóa | Có thể sửa không | Tình huống sử dụng | Ví dụ |
|--------|---------|----------|------|
| `const` | ❌ Không | Dữ liệu không thay đổi | Số CMND, mục cấu hình, danh sách màu |
| `let` | ✅ Có | Dữ liệu có thể thay đổi | Bộ đếm, tùy chọn đang chọn, người dùng nhập |

::: details 🔍 Xem một ví dụ cụ thể
```javascript
// Dùng const: những giá trị này không thay đổi
const PI = 3.14159
const MAX_USERS = 100
const APP_NAME = "TodoList"

// Dùng let: những giá trị này có thể thay đổi
let count = 0
count = 1  // ✅ Có thể sửa

count = count + 1  // ✅ Có thể tính toán dựa trên giá trị hiện tại

// Nếu dùng const thì sao?
const fixedCount = 0
fixedCount = 1  // ❌ Báo lỗi! const không thể gán lại
```
:::

👇 **Thử thực hành**: Sửa code bên dưới, xem sự khác biệt giữa const và let

<VariableBoxDemo />

### 2.2 Kiểu dữ liệu: các loại "thứ" trong JavaScript

JavaScript chia dữ liệu thành các kiểu, ba kiểu thường dùng nhất:

| Kiểu | Mô tả | Ví dụ | Tình huống thực tế |
|------|------|------|----------|
| `string` (chuỗi) | Nội dung văn bản | `"hello"`, `'你好'` | Tên người dùng, mô tả sản phẩm, thông báo |
| `number` (số) | Giá trị số | `42`, `3.14` | Giá cả, số lượng, đánh giá |
| `boolean` (luận lý) | Đúng/Sai | `true`, `false` | Đã đăng nhập chưa, đã hoàn thành chưa, có hiển thị không |

**Còn hai giá trị đặc biệt cần biết:**

- `undefined` → Biến đã khai báo, nhưng chưa được gán giá trị
- `null` → Cố ý đặt thành rỗng (biểu thị "ở đây không có giá trị")

::: details 🔍 Template string: cách nối văn bản tiện lợi hơn
Trong code AI, bạn thường thấy chuỗi được bao bởi dấu backtick (`` ` ``), bên trong có `${...}`:

```javascript
const name = "张三"
const age = 25

// Cách viết truyền thống (rắc rối)
const message = "Tôi tên là " + name + ", năm nay " + age + " tuổi"

// Template string (gọn gàng)
const message = `Tôi tên là ${name}, năm nay ${age} tuổi`
// Kết quả: "Tôi tên là 张三, năm nay 25 tuổi"
```

**Điểm nhận diện**: Thấy dấu backtick và `${}`, là biết đang chèn biến vào văn bản.
:::

### 2.3 Object và Array: tổ chức dữ liệu

**Object = một nhóm thuộc tính có tên** (giống như một tờ thông tin cá nhân)

```javascript
const user = {
  name: "张三",
  age: 25,
  isVIP: true
}

// Dùng dấu chấm để truy cập thuộc tính
console.log(user.name)    // "张三"
console.log(user.age)     // 25
```

**Array = một nhóm dữ liệu có thứ tự** (giống như một danh sách)

```javascript
const colors = ['đỏ', 'xanh lá', 'xanh dương']

// Dùng chỉ mục để truy cập (bắt đầu từ 0)
console.log(colors[0])  // "đỏ"
console.log(colors[1])  // "xanh lá"
```

**Cấu trúc lồng nhau: object chứa array, array chứa object**

Đây là cấu trúc dữ liệu phổ biến nhất trong code AI:

```javascript
const todos = [
  { id: 1, text: "Học JavaScript", done: false },
  { id: 2, text: "Làm dự án", done: true },
  { id: 3, text: "Viết tài liệu", done: false }
]

// Truy cập: trước tiên lấy phần tử thứ 0 của mảng, rồi lấy thuộc tính text của nó
console.log(todos[0].text)  // "Học JavaScript"
```

::: info 💡 Kỹ thuật nhận diện
- Thấy `{}` → Đây là một object, bên trong là một nhóm `tên: giá trị`
- Thấy `[]` → Đây là một array, bên trong là một nhóm giá trị xếp theo thứ tự
- Thấy `data[0].name` → Trước tiên lấy phần tử thứ 0 của mảng, rồi lấy thuộc tính name của nó
:::

### 2.4 Giá trị và tham chiếu: một cái bẫy dễ mắc phải

Đây là một trong những vấn đề người mới gặp nhiều nhất!

**Kiểu nguyên thủy (string, number, boolean) gán giá trị = sao chép một bản dữ liệu hoàn toàn mới:**

```javascript
let a = 10
let b = a      // b nhận được bản sao của a
b = 20
console.log(a) // 10（a không bị ảnh hưởng）
```

**Object và array gán giá trị = sao chép "địa chỉ" (cùng trỏ đến một thứ):**

```javascript
let user1 = { name: "张三" }
let user2 = user1      // user2 trỏ đến cùng một object
user2.name = "李四"     // sửa user2 sẽ ảnh hưởng đến user1
console.log(user1.name) // "李四"（user1 cũng thay đổi!）
```

**Tại sao phải tạo bản sao?**

Trong React/Vue, sửa trực tiếp dữ liệu sẽ khiến giao diện không cập nhật. Vì vậy trong code AI thường thấy `[...array]` hoặc `{...obj}` — nó đang tạo bản sao, tránh ảnh hưởng lẫn nhau.

```javascript
// Dùng spread operator để tạo bản sao
const arr1 = [1, 2, 3]
const arr2 = [...arr1]     // Tạo mảng mới
arr2.push(4)
console.log(arr1)          // [1, 2, 3]（không bị ảnh hưởng）
console.log(arr2)          // [1, 2, 3, 4]
```

👇 **Thử thực hành**: Quan sát sự thay đổi của dữ liệu gốc khi sửa bản sao

<ReferenceDemo />

### 2.5 Destructuring và Spread: cách viết tắt của JavaScript hiện đại

Hai cú pháp này xuất hiện khắp nơi trong code AI, không biết thì không đọc hiểu được code.

**Destructuring: trích xuất nhanh dữ liệu từ object hoặc array**

```javascript
const user = { name: "张三", age: 25, city: "北京" }

// Cách viết truyền thống (rắc rối)
const name = user.name
const age = user.age

// Cách viết destructuring (gọn gàng)
const { name, age } = user
// Hiệu quả như nhau, nhưng một dòng là xong
```

**Spread operator: sao chép và mở rộng dữ liệu**

```javascript
// Sao chép mảng và thêm phần tử mới
const arr1 = [1, 2, 3]
const arr2 = [...arr1, 4, 5]  // [1, 2, 3, 4, 5]

// Sao chép object và thêm thuộc tính mới
const user1 = { name: "张三", age: 25 }
const user2 = { ...user1, city: "北京" }
// { name: "张三", age: 25, city: "北京" }
```

::: info 💡 Kỹ thuật nhận diện
- Thấy `const { name, age } = person` → Trích xuất name và age từ object person
- Thấy `...array` hoặc `...obj` → Trải phẳng mảng hoặc object ra
- Bạn không cần phải tự viết được, nhưng phải đọc hiểu được
:::

---

## 3. Logic: Hàm và điều khiển luồng

::: tip 🤔 Câu hỏi cốt lõi
**Code "ra quyết định" và "lặp lại công việc" như thế nào?** Chương trình cần thực hiện các thao tác khác nhau dựa trên điều kiện, cũng cần lặp lại một số tác vụ — những logic này được biểu đạt như thế nào?
:::

### 3.1 Điều kiện: nếu... thì... nếu không thì...

**if/else: phán đoán điều kiện cơ bản nhất**

```javascript
const age = 18

if (age >= 18) {
  console.log("Người lớn")
} else {
  console.log("Vị thành niên")
}
```

**Toán tử ba ngôi: if/else viết tắt**

```javascript
// Cách viết đầy đủ（4 dòng）
let message
if (age >= 18) {
  message = "Người lớn"
} else {
  message = "Vị thành niên"
}

// Toán tử ba ngôi（1 dòng）
const message = age >= 18 ? "Người lớn" : "Vị thành niên"
// Định dạng: điều kiện ? giá trị khi đúng : giá trị khi sai
```

**Cách viết tắt &&: thường gặp trong code React**

```javascript
// Chỉ khi isLoggedIn là true mới hiển thị UserPanel
isLoggedIn && <UserPanel />

// Tương đương với
if (isLoggedIn) {
  return <UserPanel />
}
```

::: info 💡 Kỹ thuật nhận diện
- Thấy `? :` → Đây là toán tử ba ngôi, if/else viết tắt
- Thấy `&&` → Phía trước là true mới thực hiện phía sau
:::

### 3.2 Hàm: đóng gói thao tác lại

**Hàm = công thức của một món ăn**

- Định nghĩa hàm = Viết công thức
- Gọi hàm = Nấu ăn theo công thức
- Tham số = Nguyên liệu
- Giá trị trả về = Thành phẩm

```javascript
// Định nghĩa hàm（viết công thức）
function greet(name) {
  return "Xin chào " + name
}

// Gọi hàm（nấu ăn theo công thức）
console.log(greet("张三"))  // "Xin chào 张三"
console.log(greet("李四"))  // "Xin chào 李四"
```

**Ba cách viết, nhận diện trong nháy mắt:**

```javascript
// 1. Khai báo function（cách viết truyền thống）
function greet(name) {
  return "Xin chào " + name
}

// 2. Hàm mũi tên（dùng nhiều nhất trong code AI）
const greet = (name) => {
  return "Xin chào " + name
}

// 3. Hàm mũi tên viết tắt（chỉ khi có một dòng）
const greet = (name) => "Xin chào " + name
```

👇 **Thử thực hành**: Nhập các tên khác nhau, xem hàm hoạt động như thế nào

<FunctionMachineDemo />

::: info 💡 Kỹ thuật nhận diện
- Thấy `function` hoặc `=>` → Đây là một hàm
- Thấy `fn()` → Đang gọi hàm này
- Thấy `() => {}` → Hàm mũi tên, cách viết chủ đạo của JS hiện đại
:::

### 3.3 Phương thức mảng: công cụ xử lý danh sách

Trong React/Vue, hầu như mỗi lần render danh sách đều dùng đến các phương thức này.

```javascript
const todos = [
  { id: 1, text: "Học tập", done: false },
  { id: 2, text: "Làm việc", done: true }
]

// .map(): biến mỗi phần tử của mảng thành một thứ khác
const texts = todos.map(todo => todo.text)
// ["Học tập", "Làm việc"]

// .filter(): lọc ra các phần tử thỏa mãn điều kiện
const unfinished = todos.filter(todo => !todo.done)
// [{ id: 1, text: "Học tập", done: false }]

// .find(): tìm phần tử đầu tiên thỏa mãn điều kiện
const found = todos.find(todo => todo.id === 1)
// { id: 1, text: "Học tập", done: false }
```

::: info 💡 Kỹ thuật nhận diện
- Thấy `.map()` → Biến đổi mảng, trả về mảng mới
- Thấy `.filter()` → Lọc mảng
- Thấy `items.map(item => <li>{item.name}</li>)` → Biến mỗi mục dữ liệu thành thẻ danh sách
:::

### 3.4 Scope: "phạm vi nhìn thấy" của biến

**Ẩn dụ "căn phòng":**

- Biến bên trong hàm giống như đồ trong phòng, bên ngoài không nhìn thấy
- Nhưng người trong phòng có thể nhìn thấy đồ ở hành lang (scope bên ngoài)

```javascript
const global = "Biến toàn cục"  // Đồ ở hành lang

function room() {
  const local = "Đồ trong phòng"  // Đồ trong phòng
  console.log(global)  // ✅ Có thể nhìn thấy hành lang
}

console.log(local)  // ❌ Báo lỗi! Bên ngoài không nhìn thấy đồ trong phòng
```

**Trực giác cốt lõi:** Code viết ở đâu, quyết định nó có thể nhìn thấy biến gì.

👇 **Thử thực hành**: Nhấn vào các scope khác nhau, xem có thể truy cập biến nào

<ScopeDemo />

### 3.5 Closure: hàm "ghi nhớ" môi trường khi nó được sinh ra

**Đừng coi nó là khái niệm độc lập, hãy hiểu từ một tình huống cụ thể:**

```javascript
function setupCounter() {
  let count = 0  // Biến này ở bên trong hàm

  return {
    add: () => { count++; return count },
    getCount: () => count
  }
}

const counter = setupCounter()
console.log(counter.add())      // 1
console.log(counter.add())      // 2
console.log(counter.getCount()) // 2
```

**Trực giác cốt lõi:** Khi hàm được tạo ra, nó sẽ "ghi nhớ" các biến xung quanh nó, ngay cả khi hàm bên ngoài đã thực thi xong.

👇 **Thử thực hành**: Quan sát cách closure giúp hàm "ghi nhớ" trạng thái

<ClosureDemo />

### 3.6 this: hàm được ai gọi

**Không nói về quy tắc ràng buộc phức tạp, chỉ nói về tình huống phổ biến nhất:**

**Tình huống 1: Trong phương thức của object, this trỏ đến object đó**

```javascript
const user = {
  name: "张三",
  sayHi() {
    console.log("Xin chào, tôi là " + this.name)  // this trỏ đến user
  }
}
user.sayHi()  // "Xin chào, tôi là 张三"
```

**Tình huống 2: Trong event listener, this trỏ đến phần tử kích hoạt sự kiện**

```javascript
button.addEventListener('click', function() {
  console.log(this)  // this trỏ đến phần tử button
})

// Nhưng hàm mũi tên không thay đổi this
button.addEventListener('click', () => {
  console.log(this)  // this trỏ đến this của bên ngoài
})
```

::: info 💡 Gặp vấn đề thì làm sao?
Nếu code AI xuất hiện bug liên quan đến this（ví dụ `Cannot read property of undefined`）, hãy nói với AI: "this trong phương thức này trỏ không đúng, đổi thành hàm mũi tên hoặc dùng bind"
:::

---

## 4. Tương tác: DOM, Sự kiện và Bất đồng bộ

::: tip 🤔 Câu hỏi cốt lõi
**JavaScript "tương tác" với trang web như thế nào?** Làm sao tìm phần tử trên trang? Làm sao phản hồi thao tác nhấn, nhập của người dùng? Làm sao lấy dữ liệu từ máy chủ?
:::

### 4.1 DOM: trang web trong mắt JavaScript

Trang web trong mắt JavaScript là một "cây", mỗi thẻ HTML là một "nút" trên cây.

```html
<html>
  <body>
    <h1>Tiêu đề</h1>
    <p>Đoạn văn</p>
    <ul>
      <li>Mục 1</li>
      <li>Mục 2</li>
    </ul>
  </body>
</html>
```

**JS điều khiển trang web = Tìm nút + Sửa nút + Tạo/Xóa nút**

👇 **Thử thực hành**: Nhấn vào các nút, xem cây DOM được tổ chức như thế nào

<DOMTreeDemo />

### 4.2 Tìm kiếm và sửa đổi phần tử

**Tìm kiếm phần tử:**

```javascript
// Tìm theo CSS selector（dùng nhiều nhất）
const title = document.querySelector('h1')      // Tìm thẻ h1 đầu tiên
const button = document.querySelector('#btn')   // Tìm phần tử có id="btn"
const items = document.querySelectorAll('.item') // Tìm tất cả phần tử có class="item"
```

**Sửa đổi phần tử:**

```javascript
// Đổi chữ
title.textContent = "Tiêu đề mới"

// Đổi kiểu dáng
element.style.color = "red"
element.style.fontSize = "20px"

// Đổi CSS class
element.classList.add('active')      // Thêm class
element.classList.remove('hidden')   // Xóa class
element.classList.toggle('open')     // Chuyển đổi class（có thì xóa, không có thì thêm）
```

::: info 💡 Kỹ thuật nhận diện
- Thấy `document.querySelector` → Đang tìm phần tử trang web
- Thấy `.textContent` → Đổi chữ
- Thấy `.style.xxx` → Đổi kiểu dáng
- Thấy `.classList.add/remove/toggle` → Đổi CSS class
:::

### 4.3 Sự kiện: khi người dùng thực hiện thao tác nào đó...

**addEventListener: thêm trình lắng nghe sự kiện cho phần tử**

```javascript
button.addEventListener('click', () => {
  console.log("Nút đã được nhấn")
})
```

**Các sự kiện thường gặp:**

| Sự kiện | Thời điểm kích hoạt | Tình huống thực tế |
|------|---------|----------|
| `click` | Nhấn | Nhấn nút, nhấn liên kết |
| `input` | Nội dung ô nhập thay đổi | Tìm kiếm thời gian thực, xác thực form |
| `submit` | Form được gửi | Đăng nhập, đăng ký, gửi dữ liệu |
| `scroll` | Cuộn trang | Tải lười, quay lại đầu trang |

**Event object: lấy thêm thông tin**

```javascript
input.addEventListener('input', (e) => {
  console.log(e.target.value)  // Lấy giá trị của ô nhập
  e.preventDefault()            // Ngăn hành vi mặc định（ví dụ form gửi xong thì refresh trang）
})
```

::: info 💡 Ứng dụng thực tế
Khi bạn muốn thêm chức năng cho một nút, về bản chất là đang nói với AI: "Thêm sự kiện nhấn cho nút này, sau khi nhấn thì thực hiện thao tác XYZ"
:::

### 4.4 Bất đồng bộ: tại sao một số thao tác không hoàn thành ngay lập tức

**Ẩn dụ nhà hàng:**

Sau khi gọi món, không cần đứng trước cửa bếp chờ, có thể làm việc khác trước, món xong nhân viên sẽ bưng ra.

**Tình huống phổ biến nhất: lấy dữ liệu từ máy chủ**

```javascript
// Cách viết đồng bộ（sẽ làm đứng trang, đừng dùng）
const data = fetch('/api/data')  // ❌ Viết thế này sẽ làm đứng trang

// Cách viết bất đồng bộ（đúng）
async function loadData() {
  try {
    const response = await fetch('/api/data')
    const data = await response.json()
    console.log(data)
  } catch (error) {
    console.error('Có lỗi:', error)
  }
}
```

**Cú pháp async/await:**

- `async` → Đánh dấu hàm này có thao tác bất đồng bộ
- `await` → Chờ thao tác này hoàn thành（nhưng không làm đứng trang）
- `try/catch` → Xử lý lỗi có thể xảy ra

👇 **Thử thực hành**: Quan sát thứ tự thực thi của thao tác bất đồng bộ

<AsyncRestaurantDemo />

::: info 💡 Kỹ thuật nhận diện
- Thấy `async/await` → Đang chờ thao tác tốn thời gian
- Thấy `fetch()` → Đang lấy dữ liệu từ máy chủ
- Thấy `try/catch` → Đang xử lý lỗi có thể xảy ra
:::

### 4.5 Event loop: JavaScript thực sự hoạt động như thế nào

**Không dùng thuật ngữ "microtask/macrotask", hãy hiểu bằng một mô hình đơn giản:**

**JS là một "bàn làm việc một người"**, mỗi lúc chỉ làm một việc, nhưng có một "bảng ghi chú việc cần làm"（hàng đợi tác vụ）.

Khi gặp thao tác cần chờ（yêu cầu mạng, timer）, JS không chờ ngốc, mà dán "làm gì sau khi chờ xong" lên bảng ghi chú, rồi tiếp tục thực thi tiếp. Khi việc hiện tại làm xong, mới nhìn vào bảng ghi chú.

```javascript
console.log("1")

setTimeout(() => console.log("2"), 0)  // Ngay cả khi là 0 giây, cũng sẽ bị hoãn lại

console.log("3")

// Kết quả: 1, 3, 2（không phải 1, 2, 3!）
```

**Tại sao?**
1. Thực thi `console.log("1")` → Xuất 1
2. Gặp `setTimeout` → Dán callback lên bảng ghi chú, tiếp tục chạy
3. Thực thi `console.log("3")` → Xuất 3
4. Code hiện tại thực thi xong, nhìn vào bảng ghi chú
5. Thực thi callback của `setTimeout` → Xuất 2

👇 **Thử thực hành**: Quan sát thứ tự thực thi của code

<JSEventLoopDemo />

::: info 💡 Gặp vấn đề thì làm sao?
Nếu code AI chưa lấy được dữ liệu mà trang đã render, hãy nói với AI: "Dữ liệu chưa tải xong đã bắt đầu render, cần thêm trạng thái loading, đợi dữ liệu đến rồi mới render"
:::

### 4.6 Module: import và export

Dòng đầu tiên của code React/Vue do AI tạo ra hầu như luôn là `import`.

**import = nhập chức năng từ file khác**

```javascript
// Nhập hàm từ file tiện ích
import { formatDate } from './utils'

// Nhập từ package bên thứ ba
import React from 'react'
import { useState } from 'react'
```

**export = để lộ chức năng ra cho người khác dùng**

```javascript
// utils.js
export function formatDate(date) {
  // ...
}

// Hoặc xuất mặc định
export default function formatDate(date) {
  // ...
}
```

**npm package = công cụ người khác viết sẵn, cài đặt xong là dùng được**

```javascript
// Cài package: npm install lodash
// Sử dụng package
import _ from 'lodash'
```

::: info 💡 Kỹ thuật nhận diện
- Thấy `import` → Nhập chức năng từ file khác
- Thấy `export` → Để lộ chức năng cho người khác dùng
- Thấy `from 'react'` → Nhập từ package React
- Thấy `from './utils'` → Nhập từ file cục bộ
:::

---

## 5. Thực chiến: Đọc hiểu code, xem hiểu báo lỗi, mô tả chính xác

::: tip 🤔 Câu hỏi cốt lõi
**Học nhiều cú pháp như vậy, khi thực sự cầm code AI thì dùng thế nào?** Làm sao đọc hiểu code nhanh? Gặp báo lỗi thì làm sao? Làm sao để AI sửa code chính xác cho bạn?
:::

### 5.1 Cầm code AI về thì đọc thế nào

**Phương pháp bốn bước:**

| Bước | Xem gì | Ví dụ |
|------|--------|------|
| **Bước 1: Xem cấu trúc tổng thể** | Có mấy hàm? Mỗi hàm làm gì? | `loadData()` tải dữ liệu, `renderList()` render danh sách |
| **Bước 2: Tìm điểm vào** | Chương trình bắt đầu thực thi từ đâu? | `addEventListener('click', ...)` bắt đầu khi nhấn |
| **Bước 3: Theo dõi luồng dữ liệu** | Dữ liệu từ đâu đến? Đi đâu? | Từ API lấy → Phân tích → Render ra trang |
| **Bước 4: Xem logic chi tiết** | Trong hàm cụ thể xử lý thế nào? | Vòng lặp, phán đoán, tính toán |

**Dùng ví dụ code ở Chương 1 để làm một lần "trình diễn đọc code" hoàn chỉnh:**

```javascript
// Bước 1: Cấu trúc tổng thể
// - Một mảng màu
// - Một biến ghi lại chỉ mục hiện tại
// - Một sự kiện nhấn của nút

// Bước 2: Điểm vào
// button.addEventListener('click', ...) → Thực thi khi nhấn nút

// Bước 3: Luồng dữ liệu
// colors（mảng màu）→ currentIndex（chỉ mục hiện tại）→ backgroundColor（màu nền）

// Bước 4: Logic chi tiết
// currentIndex = (currentIndex + 1) % colors.length
// Công thức này nghĩa là: mỗi lần +1, nhưng không vượt quá độ dài mảng（tuần hoàn）
```

### 5.2 Tra cứu nhanh lỗi thường gặp

| Báo lỗi | Giải thích đơn giản | Cách nói với AI |
|------|-----------|-------------|
| `TypeError: Cannot read properties of undefined` | Bạn muốn lấy giá trị từ một thứ không tồn tại | "Dòng X báo lỗi, biến XYZ là undefined, kiểm tra logic gán giá trị của nó" |
| `ReferenceError: xxx is not defined` | Dùng một tên biến chưa được khai báo | "Biến xxx chưa được định nghĩa, có phải viết sai chính tả hoặc quên import không" |
| `TypeError: xxx is not a function` | Gọi một thứ không phải hàm như là hàm | "xxx không phải là hàm, kiểm tra kiểu và nguồn gốc của nó" |
| `SyntaxError: Unexpected token` | Cú pháp viết sai（ngoặc không khớp, thiếu dấu phẩy, v.v.） | "Dòng X lỗi cú pháp, kiểm tra ngoặc và dấu câu" |
| `CORS error` | Trình duyệt chặn yêu cầu cross-origin | "Gặp lỗi CORS, cần cấu hình chia sẻ tài nguyên cross-origin" |
| `404 Not Found` | Tài nguyên được yêu cầu không tồn tại | "API trả về 404, kiểm tra địa chỉ API có đúng không" |

### 5.3 Cách mô tả vấn đề chính xác

Khoảng cách giữa người mới và developer thành thạo, thường thể hiện ở **độ chính xác khi mô tả vấn đề**.

| ❌ Mô tả kém | ✅ Mô tả tốt |
|-----------|-----------|
| "Code có bug" | "Khi nhấn nút xóa, xóa không phải mục hiện tại mà là mục cuối cùng" |
| "Kiểu dáng không đúng" | "Tiêu đề lẽ ra phải căn giữa, hiện tại đang căn trái" |
| "Dữ liệu không hiển thị được" | "Yêu cầu fetch trả về dữ liệu（console thấy được）, nhưng trang không render lại" |
| "Thêm một chức năng" | "Thêm một ô tìm kiếm ở trang danh sách người dùng, khi nhập thì lọc danh sách theo thời gian thực, khớp mờ theo trường name" |
| "Nhấn không có phản ứng" | "Khi nhấn nút, console báo lỗi 'Cannot read property of undefined', lỗi ở dòng X" |

**Một bài tập thực hành:**

```javascript
// Code có bug
function deleteTodo(index) {
  todos.splice(index, 1)  // Luôn xóa mục cuối cùng
}

// Hiện tượng lỗi: Dù nhấn nút xóa nào, cũng xóa mục cuối cùng
```

**❌ Mô tả kém:** "Chức năng xóa có bug"

**✅ Mô tả tốt:** "Khi nhấn nút xóa, xóa không phải mục hiện tại mà là mục cuối cùng. Trong code dùng splice(index, 1), nhưng index có thể không chính xác. Cần sửa thành dùng id duy nhất của mỗi mục để khớp xóa."

### 5.4 Những code bạn bây giờ có thể nhận diện

- Thấy `const/let` → Biết biến có thể gán lại hay không
- Thấy `{}` → Object / Thấy `[]` → Array
- Thấy `{...obj}` hoặc `[...arr]` → Đang tạo bản sao
- Thấy `function` hoặc `=>` → Định nghĩa một đoạn thao tác có thể lặp lại
- Thấy `if/else` hoặc `? :` → Code đang phán đoán
- Thấy `.map()` / `.filter()` → Đang biến đổi hoặc lọc mảng
- Thấy `document.querySelector` → Đang tìm phần tử trang web
- Thấy `addEventListener` → Đang lắng nghe thao tác người dùng
- Thấy `async/await` → Đang chờ thao tác tốn thời gian
- Thấy `import/export` → Đang nhập hoặc xuất module
- Gặp báo lỗi → Có thể đọc hiểu đại ý và mô tả chính xác cho AI

**Nếu bạn đọc kỹ phần "chuyên sâu" của mỗi chương, bạn còn nắm được những khái niệm cốt lõi này:**

- **Giá trị vs Tham chiếu**: Kiểu nguyên thủy sao chép giá trị, object/array sao chép địa chỉ
- **Scope và Closure**: Hàm có thể "ghi nhớ" các biến xung quanh khi nó được sinh ra
- **Bản chất của this**: Phụ thuộc vào việc hàm được ai gọi, chứ không phải viết ở đâu
- **Event loop**: JS là đơn luồng, dựa vào hàng đợi tác vụ để thực hiện "không chặn"

Những khái niệm này sẽ giúp bạn định vị vấn đề nhanh hơn.

::: info 💡 Khi gặp vấn đề hãy nói với AI như thế này
- "Dòng X báo lỗi XXX, giúp tôi xem là vấn đề gì"
- "Logic của hàm này là XXX, nhưng kết quả không đúng, lẽ ra phải là XXX"
- "Tôi muốn sửa chức năng XXX, yêu cầu cụ thể là XXX"
:::
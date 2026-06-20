# Hướng dẫn chuyên sâu TypeScript

::: tip Lời nói đầu
Bạn đã biết viết JavaScript, nhưng có thể đã gặp những vấn đề này:
- Gán sai kiểu dữ liệu cho biến, đến khi chạy mới phát hiện
- Viết sai tên thuộc tính của object, mất nửa ngày debug
- Kiểu tham số hàm không đúng, sửa đi sửa lại

TypeScript là công cụ giúp bạn phát hiện những vấn đề này trước khi code chạy. Đọc xong bài này, bạn sẽ hiểu tại sao TypeScript có thể nâng cao chất lượng code, nắm được các khái niệm cốt lõi như type annotation, interface, generic, và tận dụng tốt hơn code do AI tạo ra trong vibecoding.
:::

**Bài viết này sẽ dạy bạn những gì?**

| Chương | Nội dung | Sau khi học có thể làm gì |
|-----|------|-----------|
| **Chương 1** | TypeScript là gì | Hiểu mối quan hệ giữa TypeScript và JavaScript |
| **Chương 2** | Type annotation cơ bản | Biết cách chú thích kiểu cho biến |
| **Chương 3** | Kiểu object và Interface | Định nghĩa kiểu cho cấu trúc dữ liệu |
| **Chương 4** | Kiểu hàm | Chú thích kiểu cho tham số và giá trị trả về của hàm |
| **Chương 5** | Generic | Viết code type-safe có thể tái sử dụng |
| **Chương 6** | Type inference và mẹo thực hành | Biết khi nào cần chú thích kiểu tường minh |

---

## 1. TypeScript là gì

::: tip 🤔 Câu hỏi cốt lõi
**JavaScript đã đủ dùng rồi, tại sao còn cần TypeScript?** Học thêm một cú pháp mới có đáng không?
:::

### 1.1 Từ "lỗi khi chạy" đến "phát hiện khi biên dịch"

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🔴 Điểm đau của JavaScript**
- Chỉ phát hiện lỗi kiểu khi chạy
- Lỗi chính tả khó phát hiện
- Dễ bỏ sót khi refactor
- Gợi ý IDE không đủ chính xác

*Giống như trình soạn thảo văn bản không có kiểm tra chính tả*

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**✅ Ưu điểm của TypeScript**
- Phát hiện lỗi ngay khi viết code
- Gợi ý thông minh chính xác hơn
- Refactor an toàn hơn
- Code dễ bảo trì hơn

*Giống như trình soạn thảo có kiểm tra chính tả và tô sáng cú pháp*

</div>
</div>

**Hiểu mối quan hệ giữa hai thứ trong một câu:**

| Công nghệ | Ẩn dụ | Vai trò |
|------|------|------|
| **JavaScript** | Vật liệu thô | Code có thể chạy trực tiếp |
| **TypeScript** | Bản thiết kế + Kiểm tra chất lượng | Thêm kiểm tra kiểu cho JavaScript, cuối cùng biên dịch thành JavaScript |

### 1.2 Tại sao vibecoding cũng cần TypeScript?

::: warning AI viết code cũng có thể sai
Một lập trình viên đã dùng AI để tạo ra chức năng quản lý người dùng. Code JavaScript do AI viết chạy được, nhưng có một vấn đề: tuổi người dùng lẽ ra phải là số, nhưng đôi khi bị gán sai thành chuỗi.

Kết quả là khi tính "có đủ tuổi trưởng thành hay không", chuỗi "25" bị xử lý như chuỗi ký tự, dẫn đến phán đoán sai. Bug này ẩn rất lâu, cho đến khi một người dùng nhập ký tự không phải số mới lộ ra.

Nếu dùng TypeScript, đoạn code này sẽ báo lỗi ngay khi viết: `Không thể gán kiểu "string" cho kiểu "number"`.

**Đây chính là giá trị của TypeScript — khi AI viết sai kiểu, bạn có thể phát hiện ngay từ đầu.**
:::

### 1.3 TypeScript thực chất là như thế này

TypeScript không phải là một ngôn ngữ hoàn toàn mới, nó chỉ là "superset" của JavaScript:

```typescript
// Đây là JavaScript hợp lệ, cũng là TypeScript hợp lệ
const name = "Trương Tam"
const age = 25
function greet(user) {
  return `Hello ${user}`
}

// Đây là type annotation đặc trưng của TypeScript
const name2: string = "Lý Tứ"
const age2: number = 30
function greet2(user: string): string {
  return `Hello ${user}`
}
```

**Hiểu biết then chốt:**
- Tất cả code JavaScript đều là code TypeScript hợp lệ
- TypeScript thêm vào các **type annotation** tùy chọn
- TypeScript cuối cùng sẽ được biên dịch thành JavaScript để chạy

::: info 💡 Gợi ý cốt lõi
TypeScript không thay đổi cách code vận hành, nó chỉ kiểm tra kiểu có đúng không khi biên dịch. **Bạn có thể áp dụng TypeScript dần dần** — bắt đầu từ việc thêm kiểu cho các biến quan trọng.
:::

---

## 2. Type annotation cơ bản

::: tip 🤔 Câu hỏi cốt lõi
**Làm thế nào để nói với TypeScript một biến nên có kiểu gì?** Cú pháp type annotation như thế nào?
:::

### 2.1 Cú pháp type annotation

Type annotation là thêm `: kiểu` vào sau tên biến:

```typescript
// Cú pháp: tênBiến: kiểu = giáTrị
const name: string = "Trương Tam"
let age: number = 25
let isStudent: boolean = true
```

👇 **Thử thực hành**: Thêm type annotation cho biến

<TypeAnnotationDemo />

::: details 🔍 Tại sao có những chỗ không cần type annotation?
TypeScript có thể tự động suy luận kiểu dựa trên giá trị gán:

```typescript
// Những trường hợp này không cần type annotation, TypeScript có thể tự suy luận
const name = "Trương Tam"      // suy luận là string
const age = 25          // suy luận là number
const isActive = true   // suy luận là boolean

// Những trường hợp này cần chú thích tường minh
let data  // ❌ Lỗi: không thể suy luận kiểu
let data: any  // ✅ Được, nhưng mất đi lợi ích của kiểm tra kiểu

function add(a, b) {  // ❌ Kiểu tham số không rõ ràng
  return a + b
}

function add2(a: number, b: number): number {  // ✅ Kiểu rõ ràng
  return a + b
}
```
:::

### 2.2 Các kiểu cơ bản

TypeScript hỗ trợ tất cả các kiểu cơ bản của JavaScript:

| Kiểu | Mô tả | Ví dụ |
|------|------|------|
| `string` | Chuỗi ký tự | `"hello"`, `'xin chào'` |
| `number` | Số (số nguyên và số thập phân) | `42`, `3.14` |
| `boolean` | Giá trị boolean | `true`, `false` |
| `null` / `undefined` | Giá trị rỗng | `null`, `undefined` |
| `array` | Mảng | `number[]`, `string[]` |
| `object` | Object | `{ name: string; age: number }` |

**Hai cách viết kiểu mảng:**

```typescript
// Cách 1: kiểu[] (thường dùng hơn)
const numbers: number[] = [1, 2, 3, 4, 5]
const names: string[] = ["Trương Tam", "Lý Tứ", "Vương Ngũ"]

// Cách 2: Array<kiểu>
const numbers2: Array<number> = [1, 2, 3, 4, 5]
const names2: Array<string> = ["Trương Tam", "Lý Tứ", "Vương Ngũ"]
```

**Các kiểu đặc biệt:**

```typescript
// any: kiểu bất kỳ (dùng cẩn thận, tương đương với tắt kiểm tra kiểu)
let data: any = 42
data = "bây giờ có thể là chuỗi"
data = { name: "Trương Tam" }  // cũng có thể là object

// unknown: any an toàn về kiểu
let value: unknown = 42
// if (typeof value === "number") {
//   console.log(value + 10)  // cần kiểm tra kiểu trước mới dùng được
// }

// void: không có giá trị trả về
function log(message: string): void {
  console.log(message)
}

// never: không bao giờ trả về
function error(message: string): never {
  throw new Error(message)
}
```

::: info 💡 Mẹo nhận biết
- Thấy `: string` → đây là chú thích kiểu string
- Thấy `: number[]` → đây là chú thích mảng số
- Thấy `: void` → hàm này không có giá trị trả về
:::

---

## 3. Kiểu object và Interface

::: tip 🤔 Câu hỏi cốt lõi
**Làm thế nào để định nghĩa kiểu của một object?** Các thuộc tính của object nên có kiểu gì?
:::

### 3.1 Interface: Định nghĩa "hình dạng" của object

Interface là cách chính để định nghĩa kiểu object trong TypeScript:

```typescript
// Định nghĩa một interface User
interface User {
  id: number
  name: string
  email: string
  age?: number  // thuộc tính tùy chọn
}

// Sử dụng interface
const user: User = {
  id: 1,
  name: "Trương Tam",
  email: "zhangsan@example.com",
  age: 25
}

// age là tùy chọn, có thể không cung cấp
const user2: User = {
  id: 2,
  name: "Lý Tứ",
  email: "lisi@example.com"
}
```

👇 **Thử thực hành**: Tạo object phù hợp với định nghĩa interface

<InterfaceDemo />

::: details 🔍 Các tính năng khác của interface
```typescript
// Thuộc tính chỉ đọc
interface User {
  readonly id: number  // id không thể sửa sau khi tạo
  name: string
}

const user: User = {
  id: 1,
  name: "Trương Tam"
}

user.id = 2  // ❌ Lỗi: không thể sửa thuộc tính chỉ đọc
user.name = "Lý Tứ"  // ✅ Có thể sửa

// Kiểu hàm
interface User {
  name: string
  greet: () => string  // greet là một hàm, trả về string
}

const user: User = {
  name: "Trương Tam",
  greet: () => "Hello"
}

// Kế thừa interface
interface Admin extends User {
  permissions: string[]
}

const admin: Admin = {
  name: "Quản trị viên",
  greet: () => "Hello Admin",
  permissions: ["read", "write", "delete"]
}
```
:::

### 3.2 Type Alias

Ngoài interface, còn có thể dùng `type` để định nghĩa type alias:

```typescript
// Type alias
type User = {
  id: number
  name: string
  email: string
}

// Kiểu hợp nhất (union type)
type Status = "pending" | "success" | "error"

const status: Status = "success"  // ✅
// const status2: Status = "failed"  // ❌ Lỗi: không nằm trong union type

// Kiểu giao nhau (intersection type - hợp nhất nhiều kiểu)
type User = {
  id: number
  name: string
}

type Timestamp = {
  createdAt: Date
  updatedAt: Date
}

type UserWithTimestamp = User & Timestamp

const user: UserWithTimestamp = {
  id: 1,
  name: "Trương Tam",
  createdAt: new Date(),
  updatedAt: new Date()
}
```

**Interface vs Type Alias:**

| Tính năng | interface | type |
|------|-----------|------|
| Mở rộng | `extends` | `&` intersection type |
| Khai báo trùng lặp | Tự động hợp nhất | Sẽ báo lỗi |
| Tình huống phù hợp | Hình dạng object, class | Union type, intersection type, alias kiểu cơ bản |

::: info 💡 Mẹo nhận biết
- Thấy `interface` → đây là định nghĩa kiểu object
- Thấy `type` → đây là tạo type alias
- Thấy `?` → đây là thuộc tính tùy chọn
- Thấy `readonly` → đây là thuộc tính chỉ đọc
:::

---

## 4. Kiểu hàm

::: tip 🤔 Câu hỏi cốt lõi
**Làm thế nào để chú thích kiểu cho tham số và giá trị trả về của hàm?**
:::

### 4.1 Kiểu tham số và kiểu trả về

```typescript
// Type annotation đầy đủ cho hàm
function add(a: number, b: number): number {
  return a + b
}

// Arrow function
const multiply = (a: number, b: number): number => {
  return a * b
}

// Không có giá trị trả về
function log(message: string): void {
  console.log(message)
}

// Trả về nhiều kiểu (union type)
function parseInput(input: string): number | string {
  const num = parseFloat(input)
  return isNaN(num) ? input : num
}
```

### 4.2 Tham số tùy chọn và tham số mặc định

```typescript
// Tham số tùy chọn (đánh dấu bằng ?)
function greet(name: string, title?: string): string {
  return title ? `${title} ${name}` : name
}

greet("Trương Tam")  // "Trương Tam"
greet("Trương Tam", "Ông")  // "Ông Trương Tam"

// Tham số mặc định
function greet2(name: string, title: string = "bạn"): string {
  return `${title} ${name}`
}

greet2("Lý Tứ")  // "bạn Lý Tứ"
greet2("Lý Tứ", "Tiến sĩ")  // "Tiến sĩ Lý Tứ"
```

### 4.3 Kiểu hàm làm tham số

```typescript
// Nhận hàm làm tham số
function calculate(
  a: number,
  b: number,
  operation: (x: number, y: number) => number
): number {
  return operation(a, b)
}

calculate(10, 5, (x, y) => x + y)  // 15
calculate(10, 5, (x, y) => x * y)  // 50

// Cách viết rõ ràng hơn: định nghĩa kiểu hàm trước
type Operation = (x: number, y: number) => number

function calculate2(
  a: number,
  b: number,
  operation: Operation
): number {
  return operation(a, b)
}
```

::: info 💡 Mẹo nhận biết
- Thấy `(a: number, b: number) => number` → đây là kiểu hàm, mô tả tham số và giá trị trả về
- Thấy `: void` → hàm không có giá trị trả về
- Thấy `?` → tham số là tùy chọn
:::

---

## 5. Generic

::: tip 🤔 Câu hỏi cốt lõi
**Làm thế nào để viết code có thể xử lý nhiều kiểu, nhưng vẫn giữ được type-safe?**
:::

### 5.1 Khái niệm cơ bản về Generic

Generic cho phép bạn không chỉ định kiểu cụ thể khi định nghĩa hàm, interface hoặc class, mà chỉ định khi sử dụng:

```typescript
// Hàm generic: T là biến kiểu
function identity<T>(arg: T): T {
  return arg
}

// Chỉ định kiểu rõ ràng khi sử dụng
const num1 = identity<number>(42)  // kiểu là number
const str1 = identity<string>("hello")  // kiểu là string

// Type inference: TypeScript có thể tự suy luận
const num2 = identity(42)  // suy luận là number
const str2 = identity("hello")  // suy luận là string
```

👇 **Thử thực hành**: Dùng generic để xử lý các kiểu dữ liệu khác nhau

<GenericDemo />

### 5.2 Ràng buộc Generic

Giới hạn generic phải thỏa mãn một số điều kiện:

```typescript
// Ràng buộc T phải có thuộc tính length
interface HasLength {
  length: number
}

function logLength<T extends HasLength>(arg: T): void {
  console.log(arg.length)
}

logLength("hello")  // ✅ string có length
logLength([1, 2, 3])  // ✅ mảng có length
// logLength(42)  // ❌ number không có thuộc tính length
```

### 5.3 Generic Interface và Class

```typescript
// Generic interface
interface Box<T> {
  value: T
  getValue(): T
}

const numberBox: Box<number> = {
  value: 42,
  getValue: () => 42
}

const stringBox: Box<string> = {
  value: "hello",
  getValue: () => "hello"
}

// Generic class
class Storage<T> {
  private items: T[] = []

  add(item: T): void {
    this.items.push(item)
  }

  get(index: number): T {
    return this.items[index]
  }
}

const numberStorage = new Storage<number>()
numberStorage.add(1)
numberStorage.add(2)
// numberStorage.add("string")  // ❌ Lỗi

const stringStorage = new Storage<string>()
stringStorage.add("hello")
// stringStorage.add(1)  // ❌ Lỗi
```

::: info 💡 Mẹo nhận biết
- Thấy `<T>` → đây là biến kiểu generic
- Thấy `<T extends SomeType>` → ràng buộc generic
- Thấy `Array<T>` hoặc `Promise<T>` → kiểu generic có sẵn
:::

---

## 6. Type inference và mẹo thực hành

::: tip 🤔 Câu hỏi cốt lõi
**Khi nào cần type annotation tường minh? Khi nào có thể dựa vào inference?**
:::

### 6.1 Type inference

TypeScript có thể tự động suy luận kiểu dựa trên ngữ cảnh:

```typescript
// Suy luận khi khởi tạo biến
const name = "Trương Tam"  // suy luận là string
const age = 25  // suy luận là number
const isActive = true  // suy luận là boolean

// Suy luận mảng
const numbers = [1, 2, 3]  // suy luận là number[]
const mixed = [1, "hello", true]  // suy luận là (number | string | boolean)[]

// Suy luận giá trị trả về của hàm
function add(a: number, b: number) {
  return a + b  // suy luận giá trị trả về là number
}
```

👇 **Thử thực hành**: Quan sát cách TypeScript suy luận kiểu

<TypeInferenceDemo />

### 6.2 Khi nào dùng type annotation tường minh

::: details Tình huống nên dùng type inference
```typescript
// ✅ Khuyến nghị: gán giá trị literal đơn giản
const count = 0
const name = "Trương Tam"
const isActive = true

// ✅ Khuyến nghị: giá trị trả về của hàm có thể suy luận
function getUserId(user: User) {
  return user.id  // suy luận là number
}
```
:::

::: details Tình huống nên dùng annotation tường minh
```typescript
// ✅ Khuyến nghị: tham số hàm (bắt buộc)
function add(a: number, b: number) {
  return a + b
}

// ✅ Khuyến nghị: kiểu thuộc tính object không rõ ràng
const user: {
  id: number
  name: string
  metadata: Record<string, any>
} = {
  id: 1,
  name: "Trương Tam",
  metadata: {}  // có thể suy luận là {}, cần chỉ định rõ ràng
}

// ✅ Khuyến nghị: kiểu trả về của hàm phức tạp
function getUser(): User | null {
  // ...
  return null
}

// ✅ Khuyến nghị: API công khai
export function calculateTotal(prices: number[]): number {
  return prices.reduce((sum, price) => sum + price, 0)
}
```
:::

### 6.3 Type guard

Kiểm tra kiểu khi chạy:

```typescript
// Type guard với typeof
function processValue(value: string | number) {
  if (typeof value === "string") {
    // Ở đây TypeScript biết value là string
    console.log(value.toUpperCase())
  } else {
    // Ở đây TypeScript biết value là number
    console.log(value * 2)
  }
}

// Type guard với instanceof
class Dog {
  bark() {
    console.log("Gâu gâu")
  }
}

class Cat {
  meow() {
    console.log("Meo meo")
  }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark()  // TypeScript biết đây là Dog
  } else {
    animal.meow()  // TypeScript biết đây là Cat
  }
}

// Type guard tùy chỉnh
interface User {
  name: string
  email: string
}

function isUser(value: any): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.name === "string" &&
    typeof value.email === "string"
  )
}

function processValue(value: unknown) {
  if (isUser(value)) {
    // Ở đây value là User
    console.log(value.name)
  }
}
```

### 6.4 Utility type thực dụng

TypeScript cung cấp một số utility type có sẵn:

```typescript
// Partial: biến tất cả thuộc tính thành tùy chọn
interface User {
  id: number
  name: string
  email: string
}

type PartialUser = Partial<User>
// Tương đương: { id?: number; name?: string; email?: string }

// Required: biến tất cả thuộc tính thành bắt buộc
type RequiredUser = Required<PartialUser>
// Tương đương: { id: number; name: number; email: string }

// Pick: chỉ giữ lại các thuộc tính được chỉ định
type UserBasicInfo = Pick<User, "id" | "name">
// Tương đương: { id: number; name: string }

// Omit: loại trừ các thuộc tính được chỉ định
type UserWithoutEmail = Omit<User, "email">
// Tương đương: { id: number; name: string }

// Record: tạo kiểu object
type UserRoles = Record<string, boolean>
// Tương đương: { [key: string]: boolean }
```

---

## 7. Mẹo thực chiến: Sử dụng TypeScript trong vibecoding

::: tip 🤔 Câu hỏi cốt lõi
**Làm thế nào để tận dụng TypeScript tốt hơn trong phát triển có AI hỗ trợ?**
:::

### 7.1 Để AI tạo code type-safe

**❌ Prompt không tốt:**
```
Giúp tôi viết một chức năng quản lý người dùng
```

**✅ Prompt tốt:**
```
Giúp tôi viết một chức năng quản lý người dùng, sử dụng TypeScript.

Định nghĩa cấu trúc dữ liệu như sau:
interface User {
  id: number
  name: string
  email: string
  age: number
}

Cần triển khai:
1. Lấy danh sách người dùng: trả về User[]
2. Tạo người dùng: nhận Partial<User>, trả về User
3. Cập nhật người dùng: nhận id và Partial<User>, trả về User
4. Xóa người dùng: nhận id, trả về void

Hãy đảm bảo tất cả các hàm đều có type annotation đầy đủ.
```

### 7.2 Hiểu thông báo lỗi TypeScript

**Các lỗi thường gặp và ý nghĩa:**

| Thông báo lỗi | Ý nghĩa | Cách giải quyết |
|---------|------|---------|
| `Type 'X' is not assignable to type 'Y'` | Kiểu X không thể gán cho kiểu Y | Kiểm tra kiểu có khớp không, hoặc thực hiện ép kiểu |
| `Property 'X' does not exist on type 'Y'` | Kiểu Y không tồn tại thuộc tính X | Kiểm tra chính tả tên thuộc tính, hoặc định nghĩa thuộc tính đó |
| `Argument of type 'X' is not assignable to parameter of type 'Y'` | Kiểu tham số không khớp | Kiểm tra kiểu tham số khi gọi hàm |
| `Type 'X' is missing the following properties from type 'Y'` | Kiểu X thiếu một số thuộc tính của kiểu Y | Bổ sung các thuộc tính còn thiếu |

### 7.3 Áp dụng TypeScript dần dần

Nếu bạn có một dự án JavaScript, có thể chuyển đổi dần sang TypeScript:

1. **Bước 1: Đổi tên file thành `.ts`**
   ```bash
   # Từ utils.js đổi thành utils.ts
   mv utils.js utils.ts
   ```

2. **Bước 2: Sửa các lỗi kiểu rõ ràng**
   ```typescript
   // Nếu báo lỗi: Parameter 'a' implicitly has an 'any' type
   // Thêm type annotation
   function add(a: number, b: number) {
     return a + b
   }
   ```

3. **Bước 3: Thêm dần định nghĩa kiểu**
   ```typescript
   // Dùng any trước để sửa nhanh
   function processUser(user: any) {
     // ...
   }

   // Sau đó hoàn thiện kiểu
   interface User {
     id: number
     name: string
   }

   function processUser(user: User) {
     // ...
   }
   ```

4. **Bước 4: Bật kiểm tra kiểu nghiêm ngặt hơn**
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "strict": true,  // Bật chế độ strict
       "noImplicitAny": true,  // Cấm any ngầm định
       "strictNullChecks": true  // Kiểm tra null nghiêm ngặt
     }
   }
   ```

---

## 8. Những code bạn giờ đây có thể nhận biết

- Thấy `: string` → đây là chú thích kiểu string
- Thấy `: number[]` → đây là chú thích mảng số
- Thấy `interface User` → đây là định nghĩa kiểu object
- Thấy `type User =` → đây là type alias
- Thấy `<T>` → đây là generic
- Thấy `extends` → kế thừa interface hoặc ràng buộc generic
- Thấy `?` → thuộc tính tùy chọn
- Thấy `readonly` → thuộc tính chỉ đọc
- Thấy `|` → union type
- Thấy `&` → intersection type

**Nếu bạn đã đọc kỹ phần "đào sâu" của mỗi chương, bạn còn nắm được những khái niệm cốt lõi này:**

- **Type annotation**: Nói rõ cho TypeScript biết kiểu của biến
- **Interface**: Định nghĩa cấu trúc và kiểu của object
- **Generic**: Viết code type-safe có thể tái sử dụng
- **Type inference**: TypeScript tự động suy luận kiểu
- **Type guard**: Kiểm tra kiểu khi chạy
- **Utility type**: Partial, Required, Pick, Omit, v.v.

::: info 💡 Khi gặp vấn đề, hãy nói với AI như thế này
- "Type annotation của hàm này nên viết thế nào? Tham số là X, giá trị trả về là Y"
- "Giúp tôi định nghĩa một interface, mô tả cấu trúc dữ liệu này: ..."
- "Lỗi TypeScript này có nghĩa là gì? Sửa thế nào?"
- "Làm thế nào để thêm ràng buộc cho hàm generic này, đảm bảo T phải có một thuộc tính nào đó?"
:::
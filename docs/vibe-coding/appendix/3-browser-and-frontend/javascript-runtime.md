# Hướng dẫn chuyên sâu về JavaScript Runtime

::: tip Lời nói đầu
Bạn đã học cú pháp cơ bản của JavaScript, nhưng bạn có từng tự hỏi:
- Code thực sự chạy ở đâu?
- Tại sao cùng một đoạn code lại hoạt động khác nhau trong trình duyệt và Node.js?
- Tại sao đôi khi code bị "treo", nhưng đôi khi lại có thể chạy "song song"?

Bài viết này sẽ đưa bạn đi sâu vào môi trường runtime của JavaScript, bao gồm event loop, call stack, quản lý bộ nhớ, v.v. Sau khi đọc xong, bạn sẽ hiểu được tại sao code lại thực thi theo một thứ tự nhất định, nhanh chóng xác định lỗi liên quan đến bất đồng bộ, tối ưu hiệu suất code và tránh rò rỉ bộ nhớ.
:::

**Bài viết này sẽ dạy bạn những gì?**

| Chương | Nội dung | Sau khi học có thể làm gì |
|-----|------|-----------|
| **Chương 1** | Tổng quan về runtime | Hiểu code JavaScript chạy ở đâu |
| **Chương 2** | Runtime trong trình duyệt | Biết trình duyệt cung cấp những Web API nào |
| **Chương 3** | Runtime Node.js | Hiểu môi trường JavaScript phía server |
| **Chương 4** | Event loop chuyên sâu | Nắm vững thứ tự thực thi của macrotask và microtask |
| **Chương 5** | Call stack và bộ nhớ | Hiểu quá trình thực thi code và quản lý bộ nhớ |
| **Chương 6** | Kỹ thuật thực chiến | Tối ưu hiệu suất, debug rò rỉ bộ nhớ |

---

## 1. Tổng quan về runtime

::: tip 🤔 Câu hỏi cốt lõi
**"Runtime" là gì?** JavaScript chỉ là một ngôn ngữ, tại sao cùng một đoạn code lại có hành vi khác nhau trong các môi trường khác nhau?
:::

### 1.1 Runtime là gì

**Runtime = JavaScript Engine + API do môi trường cung cấp**

Nếu ví JavaScript như "ngôn ngữ lập trình", thì runtime chính là "hệ điều hành" — nó quyết định code của bạn có thể làm gì và không thể làm gì.

```
┌─────────────────────────────────────┐
│           Mã JavaScript             │
├─────────────────────────────────────┤
│      JavaScript Engine (V8)         │  ← Chịu trách nhiệm phân tích và thực thi code
├─────────────────────────────────────┤
│   Môi trường Runtime (Trình duyệt/Node.js)  │  ← Cung cấp khả năng bổ sung
└─────────────────────────────────────┘
```

**Một phép so sánh: JavaScript là "tiếng phổ thông", runtime là "thành phố"**

- Cú pháp JavaScript (tiếng phổ thông) giống nhau ở mọi nơi
- Nhưng các thành phố khác nhau cung cấp cơ sở vật chất khác nhau:
  - Trình duyệt = có DOM, window, fetch (giống như thành phố có trung tâm thương mại, thư viện)
  - Node.js = có fs, http, path (giống như thành phố có nhà máy, đường cao tốc)

### 1.2 Hai runtime chính

| Đặc điểm | Trình duyệt | Node.js |
|------|--------|---------|
| **Mục đích chính** | Tương tác web, giao diện người dùng | Ứng dụng phía server, công cụ dòng lệnh |
| **Đối tượng toàn cục** | `window` | `global` |
| **DOM API** | ✅ Hỗ trợ | ❌ Không hỗ trợ |
| **Hệ thống tệp** | ❌ Bị hạn chế | ✅ Hỗ trợ đầy đủ |
| **Hệ thống module** | ES Modules | CommonJS + ES Modules |
| **Timer** | `setTimeout`, `setInterval` | `setTimeout`, `setInterval` |
| **Network request** | `fetch`, `XMLHttpRequest` | Module `http`, `https` |

👇 **Thử tương tác**: So sánh sự khác biệt môi trường giữa trình duyệt và Node.js

<RuntimeEnvironmentDemo />

::: info 💡 Gợi ý cốt lõi
Runtime quyết định bạn có thể dùng API nào. DOM API dùng được trong trình duyệt thì không dùng được trong Node.js; File API dùng được trong Node.js thì cũng không dùng được trong trình duyệt. Đây chính là lý do tại sao một số code cần "kiểm tra môi trường".
:::

---

## 2. Runtime trong trình duyệt

::: tip 🤔 Câu hỏi cốt lõi
**Trình duyệt cung cấp những khả năng gì để JavaScript thao tác với trang web?**
:::

### 2.1 Thành phần của runtime trình duyệt

```
┌─────────────────────────────────────────────┐
│            JavaScript Engine                │
│            (V8 / SpiderMonkey)              │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│              Web APIs                        │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐     │
│  │   DOM   │ │   BOM    │ │ Network  │     │
│  │ Thao tác │ │Thao tác  │ │Network   │     │
│  │trang web │ │trình duyệt│ │ request  │     │
│  └─────────┘ └──────────┘ └──────────┘     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│           Event Loop                         │
│   Điều phối thực thi code, xử lý sự kiện,    │
│   lập lịch tác vụ                            │
└─────────────────────────────────────────────┘
```

### 2.2 Ba loại Web APIs chính

**1. DOM API - Thao tác nội dung trang web**

```javascript
// Tìm phần tử
const title = document.querySelector('h1')

// Sửa nội dung
title.textContent = 'Tiêu đề mới'

// Thêm style
title.style.color = 'red'
```

**2. BOM API - Thao tác trình duyệt**

```javascript
// Điều hướng trang
window.location.href = 'https://example.com'

// Lưu trữ trình duyệt
localStorage.setItem('key', 'value')

// Lịch sử trình duyệt
history.back()
```

**3. Network API - Network request**

```javascript
// Gửi HTTP request
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
```

### 2.3 Cơ chế sự kiện đặc trưng của trình duyệt

Một trong những tính năng mạnh mẽ nhất của runtime trình duyệt là "hướng sự kiện" — code không cần chạy liên tục, mà chỉ thực thi khi có thao tác của người dùng.

```javascript
button.addEventListener('click', () => {
  console.log('Nút đã được nhấp')
})
```

**Các loại sự kiện phổ biến:**

| Loại sự kiện | Thời điểm kích hoạt | Tình huống thực tế |
|---------|---------|---------|
| `click` | Nhấp chuột | Tương tác nút bấm |
| `input` | Nội dung ô nhập thay đổi | Tìm kiếm thời gian thực |
| `scroll` | Cuộn trang | Lazy loading |
| `load` | Tài nguyên tải xong | Khởi tạo dữ liệu |
| `error` | Xảy ra lỗi | Xử lý lỗi |

---

## 3. Runtime Node.js

::: tip 🤔 Câu hỏi cốt lõi
**JavaScript có thể chạy ở phía server là nhờ vào đâu?**
:::

### 3.1 Thành phần của Node.js

```
┌─────────────────────────────────────────────┐
│            JavaScript Engine                │
│                 (V8)                        │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│           Module tích hợp Node.js            │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐     │
│  │   fs    │ │   http   │ │   path   │     │
│  │Thao tác │ │  Server  │ │  Xử lý   │     │
│  │  tệp    │ │  mạng    │ │ đường dẫn │     │
│  └─────────┘ └──────────┘ └──────────┘     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│          Thư viện event loop libuv          │
│      Hỗ trợ I/O bất đồng bộ đa nền tảng     │
└─────────────────────────────────────────────┘
```

### 3.2 Khả năng đặc trưng của Node.js

**1. Thao tác hệ thống tệp**

```javascript
const fs = require('fs')

// Đọc tệp
fs.readFile('./data.txt', 'utf8', (err, data) => {
  if (err) throw err
  console.log(data)
})

// Ghi tệp
fs.writeFile('./output.txt', 'Hello', (err) => {
  if (err) throw err
  console.log('Ghi thành công')
})
```

**2. HTTP Server**

```javascript
const http = require('http')

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end('<h1>Hello World</h1>')
})

server.listen(3000)
```

**3. Hệ thống module**

```javascript
// CommonJS (Mặc định của Node.js)
const fs = require('fs')
module.exports = { myFunction }

// ES Modules (Cách hiện đại)
import fs from 'fs'
export { myFunction }
```

### 3.3 So sánh trình duyệt vs Node.js

| Đặc điểm | Trình duyệt | Node.js |
|------|--------|---------|
| **Tệp vào** | Tệp HTML | Tệp JavaScript |
| **Đối tượng toàn cục** | `window`, `document` | `global`, `process` |
| **Tải module** | Thẻ `<script>` | `require()` / `import` |
| **Bảo mật** | Môi trường sandbox, bị hạn chế | Có thể truy cập tài nguyên hệ thống |
| **Mục đích** | Giao diện người dùng | Dịch vụ backend, công cụ |

---

## 4. Event loop chuyên sâu

::: tip 🤔 Câu hỏi cốt lõi
**JavaScript là đơn luồng, tại sao lại có thể "không chặn"?**
:::

### 4.1 Event loop là gì

**Event loop = "Trung tâm điều phối tác vụ" của JavaScript**

JavaScript là đơn luồng, mỗi lần chỉ làm được một việc. Nhưng event loop khiến nó trông như có thể "đồng thời" làm nhiều việc.

**Cơ chế cốt lõi:**

1. **Thực thi code đồng bộ** (Call stack)
2. **Xử lý tác vụ bất đồng bộ** (Hàng đợi tác vụ)
3. **Chờ tác vụ mới** (Lặp đi lặp lại)

```
Call stack                Hàng đợi tác vụ
┌─────────┐              ┌──────────┐
│ Tác vụ 1│              │Macrotask 1│
│ Tác vụ 2│ ←──────────── │Macrotask 2│
│ Tác vụ 3│  Thực thi xong│Macrotask 3│
└─────────┘  một thì lấy  └──────────┘
      ↓       cái tiếp theo     ↑
      └────────────────────────┘
         Event loop liên tục kiểm tra
```

### 4.2 Macrotask vs Microtask

Đây là khái niệm dễ nhầm lẫn nhất trong phỏng vấn và phát triển thực tế!

**Macrotask:**
- `setTimeout`, `setInterval`
- Thao tác I/O
- UI rendering

**Microtask:**
- `Promise.then`
- `MutationObserver`
- `queueMicrotask`

**Thứ tự thực thi: Code đồng bộ → Microtask → Macrotask**

👇 **Thử tương tác**: Quan sát thứ tự thực thi của macrotask và microtask

<TaskQueueDemo />

### 4.3 Câu hỏi phỏng vấn kinh điển

```javascript
console.log('1')

setTimeout(() => console.log('2'), 0)

Promise.resolve().then(() => console.log('3'))

console.log('4')

// Output: 1, 4, 3, 2
```

**Tại sao lại là thứ tự này?**

1. Thực thi code đồng bộ: `console.log('1')`, `console.log('4')` → output 1, 4
2. Kiểm tra hàng đợi microtask: `Promise.then` → output 3
3. Kiểm tra hàng đợi macrotask: `setTimeout` → output 2

::: info 💡 Kỹ thuật thực chiến
- Nếu muốn code thực thi càng sớm càng tốt, dùng microtask (`Promise.then`)
- Nếu muốn trì hoãn thực thi, dùng macrotask (`setTimeout`)
- Đừng bao giờ trộn lẫn quá nhiều thao tác bất đồng bộ, nếu không sẽ rơi vào "callback hell"
:::

---

## 5. Call stack và bộ nhớ

::: tip 🤔 Câu hỏi cốt lõi
**Code được thực thi như thế nào? Biến được lưu ở đâu? Khi nào bị thu hồi?**
:::

### 5.1 Call stack: "Dấu chân" thực thi hàm

**Call stack = "Sổ ghi chép" ghi lại lời gọi hàm**

Mỗi lần gọi một hàm, sẽ thêm một bản ghi mới vào stack; hàm thực thi xong, bản ghi bị xóa.

```javascript
function a() {
  b()
}

function b() {
  c()
}

function c() {
  console.log('Thực thi xong')
}

a()
```

**Sự thay đổi của call stack:**

```
Bước 1: Gọi a()
┌─────────┐
│    a    │
└─────────┘

Bước 2: a() gọi b()
┌─────────┐
│    b    │
│    a    │
└─────────┘

Bước 3: b() gọi c()
┌─────────┐
│    c    │
│    b    │
│    a    │
└─────────┘

Bước 4: c() thực thi xong, lần lượt pop ra
┌─────────┐
│    b    │
│    a    │
└─────────┘
```

👇 **Thử tương tác**: Quan sát sự thay đổi của call stack

<CallStackDemo />

### 5.2 Quản lý bộ nhớ: Rác đi đâu

JavaScript có cơ chế "tự động thu gom rác" — bạn không cần tự giải phóng bộ nhớ, engine sẽ làm việc đó cho bạn.

**Nguyên lý thu gom rác: Thuật toán Mark-and-Sweep**

1. **Giai đoạn đánh dấu**: Bắt đầu từ "gốc", tìm tất cả các biến có thể truy cập được
2. **Giai đoạn quét**: Biến không được đánh dấu chính là "rác", sẽ bị thu hồi

```javascript
// Ví dụ về thu gom rác
let obj1 = { name: 'Đối tượng 1' }
let obj2 = { name: 'Đối tượng 2' }

// obj1 được gán lại, đối tượng ban đầu mất tham chiếu
obj1 = null  // { name: 'Đối tượng 1' } ban đầu sẽ bị thu hồi

// obj2 vẫn đang được sử dụng, sẽ không bị thu hồi
console.log(obj2.name)
```

👇 **Thử tương tác**: Quan sát quá trình thu gom rác

<GarbageCollectionDemo />

### 5.3 Rò rỉ bộ nhớ: Hậu quả của việc quên dọn dẹp

**Rò rỉ bộ nhớ = Bộ nhớ đáng lẽ phải được giải phóng nhưng không được giải phóng, tích tụ ngày càng nhiều**

Nguyên nhân phổ biến:

**1. Quá nhiều biến toàn cục**

```javascript
// ❌ Sai: Biến toàn cục không bị thu hồi
globalCache = []

function addItem(item) {
  globalCache.push(item)
}
```

**2. Không gỡ bỏ event listener**

```javascript
// ❌ Sai: Listener không được gỡ bỏ
button.addEventListener('click', handleClick)

// ✅ Đúng: Gỡ bỏ listener khi không cần
button.removeEventListener('click', handleClick)
```

**3. Closure tham chiếu đến đối tượng lớn**

```javascript
// ❌ Sai: Closure luôn tham chiếu đến đối tượng lớn, không bị thu hồi
function createHandler() {
  const bigData = new Array(1000000).fill('data')
  return function() {
    console.log('Đang xử lý')
  }
}

const handler = createHandler()  // bigData luôn tồn tại trong bộ nhớ
```

👇 **Thử tương tác**: Quan sát rò rỉ bộ nhớ xảy ra như thế nào

<MemoryLeakDemo />

::: info 💡 Kỹ thuật thực chiến
- **Kiểm tra định kỳ**: Mở trình duyệt DevTools → Memory → Take Heap Snapshot, xem mức sử dụng bộ nhớ
- **Tránh biến toàn cục**: Cố gắng dùng `const` và `let`, không dùng `var`
- **Dọn dẹp kịp thời**: Event listener, timer dùng xong phải gỡ bỏ
- **Tham chiếu yếu**: Dùng `WeakMap` và `WeakSet` để lưu tham chiếu đối tượng
:::

---

## 6. Kỹ thuật thực chiến

::: tip 🤔 Câu hỏi cốt lõi
**Làm thế nào để viết code JavaScript hiệu suất cao? Gặp vấn đề thì debug thế nào?**
:::

### 6.1 Kỹ thuật tối ưu hiệu suất

**1. Giảm reflow và repaint**

```javascript
// ❌ Sai: Mỗi lần lặp đều kích hoạt reflow
for (let i = 0; i < 1000; i++) {
  element.style.top = i + 'px'
}

// ✅ Đúng: Sửa đổi hàng loạt
element.style.transform = `translateY(${position}px)`
```

**2. Sử dụng event delegation**

```javascript
// ❌ Sai: Thêm listener cho từng nút
buttons.forEach(btn => {
  btn.addEventListener('click', handleClick)
})

// ✅ Đúng: Chỉ thêm một listener cho phần tử cha
container.addEventListener('click', (e) => {
  if (e.target.matches('.button')) {
    handleClick(e)
  }
})
```

**3. Debounce và throttle**

```javascript
// Debounce: Thực thi sau khi người dùng ngừng nhập
function debounce(fn, delay) {
  let timer
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// Throttle: Giới hạn tần suất thực thi
function throttle(fn, delay) {
  let lastTime = 0
  return function(...args) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      fn.apply(this, args)
      lastTime = now
    }
  }
}
```

### 6.2 Kỹ thuật debug

**1. Dùng DevTools xem call stack**

```javascript
function a() {
  b()
}

function b() {
  c()
}

function c() {
  debugger  // Tạm dừng ở đây, xem call stack
}

a()
```

**2. Dùng `console.trace()` theo dõi đường dẫn thực thi**

```javascript
function trackExecution() {
  console.trace('Đường dẫn thực thi')
  // Sẽ xuất ra call stack đầy đủ
}
```

**3. Dùng Performance phân tích hiệu suất**

```javascript
performance.mark('start')

// Thực thi một số code
for (let i = 0; i < 10000; i++) {
  // ...
}

performance.mark('end')
performance.measure('Hiệu suất vòng lặp', 'start', 'end')

const measure = performance.getEntriesByName('Hiệu suất vòng lặp')[0]
console.log(`Thời gian thực thi: ${measure.duration}ms`)
```

### 6.3 Tra cứu nhanh vấn đề thường gặp

| Vấn đề | Nguyên nhân có thể | Giải pháp |
|------|---------|---------|
| **Dùng nhiều bộ nhớ** | Rò rỉ bộ nhớ, cache quá nhiều | Kiểm tra biến toàn cục, gỡ bỏ listener |
| **Trang bị giật lag** | Tác vụ dài chặn luồng chính | Chia nhỏ tác vụ, dùng Web Workers |
| **Sự kiện không kích hoạt** | Listener không được bind, phần tử không tồn tại | Kiểm tra thời điểm tải DOM |
| **Thứ tự bất đồng bộ sai** | Trộn lẫn macrotask và microtask | Thống nhất dùng Promise hoặc async/await |
| **Timer không chính xác** | Luồng chính bị chặn | Dùng Web Workers hoặc requestAnimationFrame |

---

## Tổng kết

Bây giờ bạn đã có thể hiểu:

- **Runtime = Engine + API môi trường**, các runtime khác nhau cung cấp khả năng khác nhau
- **Event loop** chịu trách nhiệm điều phối thứ tự thực thi của code đồng bộ, microtask, macrotask
- **Call stack** ghi lại quá trình thực thi hàm, **stack overflow** là do đệ quy quá sâu
- **Thu gom rác** tự động dọn dẹp biến không dùng, nhưng cần chú ý **rò rỉ bộ nhớ**
- Chìa khóa của **tối ưu hiệu suất** là giảm reflow/repaint, sử dụng bất đồng bộ hợp lý

::: info 💡 Khi gặp vấn đề hãy nói với AI như thế này
- "Hàm này chạy quá chậm, giúp tôi xem cách tối ưu hiệu suất"
- "Bộ nhớ liên tục tăng, có thể là rò rỉ bộ nhớ, giúp tôi kiểm tra"
- "Thứ tự thao tác bất đồng bộ không đúng, lẽ ra phải A trước rồi B, hiện tại A và B gần như bắt đầu cùng lúc"
- "Event listener không kích hoạt, kiểm tra xem phần tử đã được tải vào DOM chưa"
:::
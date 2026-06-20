# Design Pattern (Mẫu thiết kế)

::: tip Lời nói đầu
**Tại sao code của bạn luôn "chạy được nhưng rất lộn xộn"?** Có thể bạn đã gặp tình huống này: yêu cầu thay đổi một chút, phải sửa code ở rất nhiều nơi; muốn tái sử dụng một đoạn logic, nhưng phát hiện nó纠缠 với code khác. Design Pattern là những "công thức tổ chức code" được đúc kết từ kinh nghiệm, giúp bạn viết code linh hoạt và dễ bảo trì.

Chương này giúp bạn hiểu các design pattern thực tế nhất, không phải học thuộc lòng, mà hiểu "dùng pattern nào cho tình huống nào".
:::

**Bài viết này sẽ giúp bạn học được gì?**

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Design Pattern là gì | Bản chất và phân loại pattern |
| **Chương 2** | Pattern tạo dựng (Creational) | Cách tạo object một cách thanh lịch |
| **Chương 3** | Pattern cấu trúc (Structural) | Cách tổ chức cấu trúc code |
| **Chương 4** | Pattern hành vi (Behavioral) | Cách quản lý tương tác giữa các object |

Sau khi học xong chương này, bạn sẽ nắm vững các design pattern thường dùng nhất, có thể nhận diện tình huống phù hợp và áp dụng linh hoạt trong dự án thực tế.

---

## 0. Tổng quan: Bản chất của Design Pattern

Hãy tưởng tượng bạn đang học nấu ăn. Bạn có thể tự mò mẫm từ đầu mỗi lần, hoặc học các công thức nấu ăn kinh điển — công thức không hạn chế sự sáng tạo, mà giúp bạn đứng trên vai người đi trước. Design Pattern chính là "công thức kinh điển" của thế giới lập trình.

::: tip Giá trị của Design Pattern
- **Ngôn ngữ chung**: Nói "ở đây dùng Observer Pattern", cả nhóm hiểu ngay ý đồ thiết kế của bạn
- **Tái sử dụng kinh nghiệm**: Không cần tự vấp phải lỗi mà người khác đã gặp
- **Mở rộng linh hoạt**: Pattern tốt giúp code chỉ cần sửa nhỏ khi có thay đổi, thay vì sửa lớn
:::

Thông qua component tương tác dưới đây, duyệt qua phân loại và công dụng của các design pattern phổ biến:

<DesignPatternCatalogDemo />

---

## 1. Pattern tạo dựng: Cách tạo object thanh lịch

### 1.1 Singleton Pattern

**Tình huống**: Chỉ cần một instance toàn cục, ví dụ: quản lý cấu hình, logger, connection pool cơ sở dữ liệu.

```javascript
class ConfigManager {
  static instance = null

  static getInstance() {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager()
    }
    return ConfigManager.instance
  }

  constructor() {
    this.config = {}
  }
}

// Dù gọi bao nhiêu lần, vẫn là cùng một instance
const a = ConfigManager.getInstance()
const b = ConfigManager.getInstance()
console.log(a === b) // true
```

### 1.2 Factory Pattern

**Tình huống**: Tạo các loại object khác nhau dựa trên điều kiện khác nhau, bên gọi không cần biết chi tiết tạo lập.

```javascript
function createNotification(type, message) {
  switch (type) {
    case 'email':
      return { send: () => console.log(`Gửi email: ${message}`) }
    case 'sms':
      return { send: () => console.log(`Gửi SMS: ${message}`) }
    case 'push':
      return { send: () => console.log(`Gửi push notification: ${message}`) }
    default:
      throw new Error(`Loại thông báo không xác định: ${type}`)
  }
}

// Bên gọi không quan tâm đến implementation cụ thể
const notification = createNotification('email', 'Xin chào')
notification.send()
```

---

## 2. Pattern cấu trúc: Cách tổ chức cấu trúc code

### 2.1 Adapter Pattern

**Tình huống**: Hai interface không tương thích, cần một "bộ chuyển đổi". Ví dụ: định dạng dữ liệu API cũ trả về khác với định dạng component mới mong đợi.

```javascript
// Định dạng API cũ trả về
const oldApi = {
  getUserInfo: () => ({ user_name: 'Trần Văn A', user_age: 25 })
}

// Adapter: chuyển sang định dạng mới
function adaptUser(oldUser) {
  return { name: oldUser.user_name, age: oldUser.user_age }
}

const user = adaptUser(oldApi.getUserInfo())
// { name: 'Trần Văn A', age: 25 }
```

### 2.2 Decorator Pattern

**Tình huống**: Thêm chức năng mới cho object mà không sửa code gốc. Giống như ốp lưng điện thoại — chức năng điện thoại không đổi, nhưng thêm được bảo vệ.

```javascript
// Hàm log cơ bản
function log(message) {
  console.log(message)
}

// Decorate: thêm timestamp
function withTimestamp(fn) {
  return (message) => fn(`[${new Date().toISOString()}] ${message}`)
}

// Decorate: thêm log level
function withLevel(fn, level) {
  return (message) => fn(`[${level}] ${message}`)
}

const enhancedLog = withTimestamp(withLevel(log, 'INFO'))
enhancedLog('Service khởi động thành công')
// [2025-01-15T10:30:00.000Z] [INFO] Service khởi động thành công
```

---

## 3. Pattern hành vi: Cách quản lý tương tác giữa các object

### 3.1 Observer Pattern

**Tình huống**: Khi trạng thái của một object thay đổi, cần tự động thông báo cho các object khác. Ví dụ: khi người dùng đặt hàng, cần đồng thời gửi email, trừ kho, ghi log.

```javascript
class EventEmitter {
  constructor() {
    this.listeners = {}
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = []
    this.listeners[event].push(callback)
  }

  emit(event, data) {
    (this.listeners[event] || []).forEach(cb => cb(data))
  }
}

const bus = new EventEmitter()
bus.on('order:created', (order) => console.log('Gửi email xác nhận', order.id))
bus.on('order:created', (order) => console.log('Trừ tồn kho', order.id))
bus.emit('order:created', { id: 'ORD-001' })
```

### 3.2 Strategy Pattern

**Tình huống**: Cùng một thao tác có nhiều thuật toán/chiến lược, cần chuyển đổi lúc chạy. Ví dụ: các cách sắp xếp khác nhau, quy tắc tính giá khác nhau.

```javascript
const pricingStrategies = {
  normal: (price) => price,
  vip: (price) => price * 0.8,
  svip: (price) => price * 0.6
}

function calculatePrice(price, memberLevel) {
  const strategy = pricingStrategies[memberLevel] || pricingStrategies.normal
  return strategy(price)
}

calculatePrice(100, 'vip')  // 80
calculatePrice(100, 'svip') // 60
```

Thông qua component tương tác dưới đây, trải nghiệm trực tiếp hiệu quả của các design pattern khác nhau:

<PatternPlaygroundDemo />

---

## 4. Lựa chọn Design Pattern như thế nào?

| Vấn đề bạn gặp phải | Pattern đề xuất | Ý tưởng cốt lõi |
|-------------|---------|---------|
| Chỉ cần một instance toàn cục | Singleton | Kiểm soát số lượng instance |
| Tạo object khác nhau theo điều kiện | Factory | Đóng gói logic tạo lập |
| Interface không tương thích cần chuyển đổi | Adapter | Bọc thêm lớp chuyển đổi |
| Thêm chức năng động | Decorator | Bọc từng lớp để tăng cường |
| Thay đổi trạng thái cần thông báo nhiều bên | Observer | Publish-Subscribe giải耦 |
| Nhiều thuật toán cần đổi lúc chạy | Strategy | Đóng gói thuật toán thành object |

::: tip Nguyên tắc cốt lõi
Design Pattern không phải càng nhiều càng tốt. **Over-engineering** (thiết kế quá mức) cũng tệ như **không có thiết kế**. Chỉ dùng pattern ở nơi thực sự cần sự linh hoạt, vấn đề đơn giản dùng giải pháp đơn giản. Hãy nhớ nguyên tắc KISS: Keep It Simple, Stupid.
:::

---

## 5. Hỗ trợ AI: Học và áp dụng Design Pattern với mô hình ngôn ngữ lớn

Mô hình ngôn ngữ lớn có thể giúp bạn nhận diện tình huống phù hợp áp dụng design pattern trong code và đưa ra phương án tái cấu trúc cụ thể.

### 5.1 Nhận diện pattern phù hợp

> **Prompt**:
> ```
> Phân tích đoạn code sau, xác định xem có chỗ nào có thể cải thiện bằng design pattern không.
> Nếu có, vui lòng chỉ ra:
> 1. Vấn đề của code hiện tại
> 2. Design Pattern nào được đề xuất
> 3. Ví dụ code sau khi tái cấu trúc
> 4. Tại sao pattern này phù hợp với tình huống này
>
> [Dán code của bạn]
> ```

### 5.2 Học pattern qua tình huống cụ thể

> **Prompt**:
> ```
> Dùng tình huống thực tế "hệ thống đặt đồ ăn giao tận nơi", demo ứng dụng của các design pattern sau:
> - Factory Pattern: tạo các loại đơn hàng khác nhau
> - Observer Pattern: thông báo khi trạng thái đơn hàng thay đổi
> - Strategy Pattern: các quy tắc tính phí giao hàng khác nhau
>
> Dùng ví dụ code JavaScript, mỗi pattern trước tiên thể hiện vấn đề khi không dùng pattern,
> sau đó thể hiện cải thiện khi áp dụng pattern.
> ```

### 5.3 Đánh giá có over-engineering không

> **Prompt**:
> ```
> Review đoạn code sau, xác định xem có vấn đề over-engineering không.
> Có abstraction không cần thiết, design pattern không dùng đến, hay optimization quá sớm không?
> Nếu có, đề xuất cách đơn giản hóa theo nguyên tắc KISS.
>
> [Dán code của bạn]
> ```

::: tip Lời khuyên sử dụng AI
Để AI giải thích design pattern bằng tình huống kinh doanh quen thuộc với bạn — hiệu quả hơn nhiều so với xem biểu đồ UML trừu tượng. Nhưng nhớ: AI có xu hướng đề xuất giải pháp phức tạp hơn, bạn cần tự đánh giá xem có thực sự cần không.
:::

---

## 6. Tổng kết

1. **Pattern tạo dựng**: Giải quyết vấn đề "cách tạo object", giúp quá trình tạo linh hoạt hơn
2. **Pattern cấu trúc**: Giải quyết vấn đề "cách tổ chức code", giúp cấu trúc rõ ràng hơn
3. **Pattern hành vi**: Giải quyết vấn đề "các object tương tác thế nào", giúp cộng tác lỏng lẻo hơn
4. **Áp dụng linh hoạt**: Chọn theo tình huống thực tế, đừng dùng pattern chỉ để dùng pattern

::: tip Suy ngẫm cuối cùng
Bản chất của design pattern là **quản lý sự thay đổi**. Thiết kế tốt giúp phần thay đổi dễ sửa, phần không đổi giữ ổn định. Khi viết code, hãy tự hỏi: "Nếu yêu cầu thay đổi, mình cần sửa bao nhiêu nơi?" — Nếu câu trả lời là "rất nhiều nơi", có thể bạn cần một design pattern để giúp đỡ.
:::

---

## Đọc thêm

- **Sách kinh điển**: *Design Patterns: Elements of Reusable Object-Oriented Software* của GoF là tác phẩm sáng lập về design pattern.
- **Góc nhìn hiện đại**: Trong JavaScript, nhiều pattern trở nên súc tích hơn nhờ đặc điểm ngôn ngữ (closure, higher-order function).
- **Khuyến nghị thực tế**: Hiểu vấn đề trước, rồi mới xem xét pattern. Đừng cầm búa đi tìm đinh.
- **Học nâng cao**: Tìm hiểu nguyên tắc SOLID — triết lý đằng sau các design pattern.

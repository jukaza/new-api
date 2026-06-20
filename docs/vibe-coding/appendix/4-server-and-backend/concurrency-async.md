# Đồng thời, Bất đồng bộ và Đa luồng
> 💡 **Hướng dẫn học tập**: Lập trình đồng thời là "gót chân Achilles" của nhiều kỹ sư backend — bị hỏi khi phỏng vấn, gây lỗi trên production, không biết tối ưu hiệu năng. Chương này sẽ xoay quanh một câu hỏi cốt lõi: **Khi 100.000 người dùng đồng thời gửi request đến dịch vụ của bạn, code của bạn có sập không?**

Trước khi bắt đầu, bạn nên bổ sung hai "viên gạch nền tảng" sau:

- **CPU, bộ nhớ, I/O là gì**: Nếu chưa rõ những khái niệm cơ bản này, bạn có thể ôn lại kiến thức cơ bản về hệ điều hành trước.
- **Blocking/Non-blocking là gì**: Nếu chưa quen với khái niệm đồng bộ/bất đồng bộ, bạn có thể trải nghiệm qua lập trình thực tế trước.

---

## 0. Lời mở đầu: Tại sao dịch vụ của bạn lại "đơ" vào giờ cao điểm?

<ProcessThreadCoroutineDemo />

Nhiều người trong thực tế phát triển đều gặp phải tình huống tương tự:

- Test local phản hồi rất nhanh, vừa lên production đã "chạy như PPT";
- Rõ ràng đã mua cấu hình server rất cao, nhưng CPU usage luôn không lên nổi;
- Cứ đến giờ cao điểm khuyến mãi, dịch vụ lại "sập tuyết", buộc phải giảm cấp hoặc circuit breaker.

Theo trực giác, chúng ta thường nghĩ rằng: **"Server không đủ mạnh"**.
Nhưng phần lớn thời gian, vấn đề không nằm ở chỗ phần cứng "không đủ nhanh", mà nằm ở chỗ chúng ta **không thiết kế tốt mô hình đồng thời**.

**Mâu thuẫn cốt lõi**:
- Nếu không xử lý đồng thời: request của người dùng xếp hàng chờ đợi, trải nghiệm cực kém;
- Nếu lạm dụng đa luồng: cạnh tranh khóa, chi phí chuyển ngữ cảnh, hiệu năng thậm chí còn giảm.

Đối mặt với những thách thức này, chỉ đơn thuần dựa vào "thêm máy" đã không còn đủ. Chúng ta cần một phương pháp thiết kế đồng thời có hệ thống, vừa đảm bảo hiệu năng vừa đảm bảo độ ổn định trong các kịch bản đồng thời cao. Đây chính là vấn đề mà chương này cố gắng giải quyết.

---

## 1. Khái niệm cốt lõi: Process, Thread, Coroutine, rốt cuộc khác nhau thế nào?

### 1.1 Phép so sánh với nhà hàng

Hãy tưởng tượng bạn mở một nhà hàng, phải phục vụ nhiều khách cùng lúc:

| Khái niệm | So sánh với nhà hàng | Ý nghĩa kỹ thuật |
| :--- | :--- | :--- |
| **Process (Tiến trình)** | **Chi nhánh nhà hàng độc lập** | Có không gian bộ nhớ riêng, phân bổ tài nguyên riêng, là đơn vị phân bổ tài nguyên cơ bản của hệ điều hành. Một process sập không ảnh hưởng đến các process khác. |
| **Thread (Luồng)** | **Đầu bếp trong chi nhánh** | Là đơn vị lập lịch cơ bản của CPU, chia sẻ không gian bộ nhớ trong process. Các thread trong cùng một process có thể chia sẻ dữ liệu, nhưng một thread sập có thể khiến toàn bộ process sập. |
| **Coroutine (Coroutine)** | **"Phân thân thuật" của đầu bếp** | Thread nhẹ cấp độ người dùng, do chương trình tự lập lịch thay vì hệ điều hành. Chi phí chuyển đổi cực nhỏ, có thể tạo hàng triệu coroutine. |

### 1.2 So sánh sâu: Sự khác biệt bản chất giữa ba khái niệm

<ProcessIsolationDemo />

#### Process: "Container" cách ly tài nguyên

**Đặc điểm cốt lõi**:
- **Tính cách ly mạnh**: Mỗi process có không gian địa chỉ ảo độc lập
- **Chi phí lớn**: Tạo/chuyển đổi cần sự can thiệp của hệ điều hành, mất khoảng 1-10ms
- **Giao tiếp phức tạp**: Giao tiếp liên process (IPC) cần cơ chế đặc biệt (pipe, hàng đợi tin nhắn, bộ nhớ chia sẻ, v.v.)

**Kịch bản phù hợp**:
- Dịch vụ cần cách ly mạnh (như tab trình duyệt, chương trình sandbox)
- Dịch vụ triển khai hỗn hợp đa ngôn ngữ
- Đơn vị dịch vụ cần khởi động lại/nâng cấp độc lập

#### Thread: "Kỵ binh nhẹ" chia sẻ bộ nhớ

<ThreadSchedulingDemo />

**Đặc điểm cốt lõi**:
- **Chia sẻ bộ nhớ**: Các thread trong cùng process chia sẻ code segment, data segment, heap
- **Không gian stack độc lập**: Mỗi thread có stack riêng (thường khoảng 1MB)
- **Chuyển đổi khá nhanh**: Chuyển đổi thread khoảng 1-10μs, nhanh hơn process 1000 lần
- **Cần đồng bộ hóa**: Dữ liệu chia sẻ cần được bảo vệ bằng khóa

**Kịch bản phù hợp**:
- Tác vụ CPU intensive (tính toán, xử lý ảnh)
- Tác vụ đồng thời cần chia sẻ nhiều dữ liệu
- Tác vụ nền nhạy cảm với độ trễ

#### Coroutine: "Green thread" cấp độ người dùng

<CoroutineLightweightDemo />

**Đặc điểm cốt lõi**:
- **Lập lịch cấp độ người dùng**: Do chương trình/thư viện runtime lập lịch, không thông qua hệ điều hành
- **Cực nhẹ**: Stack coroutine thường chỉ vài KB, có thể tạo hàng triệu cái
- **Chuyển đổi cực nhanh**: Chuyển đổi coroutine khoảng 100ns, nhanh hơn thread 100 lần
- **Không preemptive**: Coroutine chủ động nhường CPU (đa nhiệm hợp tác)

**Kịch bản phù hợp**:
- Dịch vụ đồng thời cao I/O intensive (Web server, gateway)
- Kịch bản cần duy trì nhiều kết nối dài (IM, game server)
- Xử lý dữ liệu streaming, pipeline

---

## 2. Phân tích case: "Nỗi đau đồng thời" trong đợt khuyến mãi của một sàn thương mại điện tử

### 2.1 Bài học xương máu: Tiến hóa từ "đơn máy" đến "phân tán"

Hãy xem câu chuyện tiến hóa của một hệ thống thương mại điện tử thực tế:

#### Giai đoạn 1: Thời kỳ đơn máy (DAU 1000)

```python
# Ứng dụng Flask đơn giản
from flask import Flask

app = Flask(__name__)

@app.route('/order')
def create_order():
    # Truy vấn tồn kho
    stock = db.query("SELECT stock FROM products WHERE id=1")
    if stock > 0:
        # Trừ tồn kho
        db.execute("UPDATE products SET stock = stock - 1 WHERE id=1")
        # Tạo đơn hàng
        db.execute("INSERT INTO orders ...")
        return "Order created!"
    return "Out of stock!"

# Khởi động: flask run
```

**Vấn đề**:
- Đơn process đơn thread, mỗi lần chỉ xử lý được một request
- Trừ tồn kho không có khóa, khi đồng thời sẽ xảy ra bán vượt
- Số lượng kết nối database có hạn, connection pool nhanh chóng bị cạn kiệt

#### Giai đoạn 2: Thời kỳ đa process (DAU 1 vạn)

```python
# Sử dụng Gunicorn triển khai đa process
gunicorn -w 4 -k sync app:app

# 4 worker process, mỗi process xử lý request độc lập
```

**Vấn đề mới**:
- 4 process cùng lúc truy vấn tồn kho, đều thấy stock=1, đều trừ thành công, bán vượt 3 cái!
- Cần sử dụng distributed lock

```python
import redis

# Sử dụng Redis distributed lock
lock = redis_client.lock("stock_lock", timeout=10)
if lock.acquire():
    try:
        stock = db.query("SELECT stock FROM products WHERE id=1")
        if stock > 0:
            db.execute("UPDATE products SET stock = stock - 1 WHERE id=1")
    finally:
        lock.release()
```

#### Giai đoạn 3: Thời kỳ coroutine (DAU 10 vạn)

```python
# Sử dụng FastAPI + asyncio
from fastapi import FastAPI
import asyncio

app = FastAPI()

async def check_stock(product_id: int) -> int:
    # Truy vấn database bất đồng bộ, không blocking
    result = await db.fetch_one(
        "SELECT stock FROM products WHERE id = :id",
        {"id": product_id}
    )
    return result["stock"]

@app.get("/order")
async def create_order(product_id: int):
    # Đồng thời kiểm tra tồn kho và thông tin người dùng
    stock_task = check_stock(product_id)
    user_task = get_user_info(request.user_id)

    stock, user = await asyncio.gather(stock_task, user_task)

    if stock > 0:
        # Trừ tồn kho bất đồng bộ
        await db.execute(
            "UPDATE products SET stock = stock - 1 WHERE id = :id",
            {"id": product_id}
        )
        return {"status": "success"}

    return {"status": "out_of_stock"}

# Khởi động: uvicorn main:app --workers 4
# Mỗi worker có thể xử lý hàng nghìn coroutine đồng thời
```

**Ưu điểm**:
- Trong một thread có thể xử lý hàng nghìn kết nối đồng thời
- Khi thao tác I/O chủ động nhường CPU, không block các request khác
- Chiếm dụng bộ nhớ cực thấp, phù hợp kịch bản đồng thời cao kết nối dài

### 2.2 Bảng so sánh tiến hóa mô hình đồng thời

| Giai đoạn | Mô hình đồng thời | DAU hỗ trợ | Vấn đề cốt lõi | Giải pháp |
| :--- | :--- | :--- | :--- | :--- |
| **Đơn thể** | Đơn process đơn thread | 1K | Không thể xử lý đồng thời | Đưa vào đa process |
| **Đa process** | Đa process đồng bộ | 10K | Data race, bán vượt | Distributed lock |
| **Đa luồng** | Đa luồng + khóa | 50K | Chi phí chuyển ngữ cảnh, deadlock | Thread pool, hàng đợi lock-free |
| **Coroutine** | I/O bất đồng bộ | 100K+ | Độ phức tạp code, khó debug | Đóng gói framework, distributed tracing |
| **Hỗn hợp** | Đa process + coroutine | 1000K+ | Độ phức tạp kiến trúc | Service governance, elastic scaling |

---

## 3. Nguyên lý sâu: Cách hoạt động của các mô hình đồng thời

### 3.1 Mô hình Process: Cách ly và giao tiếp

#### Cơ chế cách ly bộ nhớ

<ProcessIsolationDemo />

Mỗi process có không gian địa chỉ ảo độc lập:

```
Bộ nhớ ảo Process A        Bộ nhớ ảo Process B
+----------------+        +----------------+
|  Không gian    |        |  Không gian    |
|  kernel (chia sẻ)|      |  kernel (chia sẻ)|  <-- Chia sẻ (chỉ đọc)
+----------------+        +----------------+
|  Không gian    |        |  Không gian    |
|  stack (tăng   |        |  stack (tăng   |  <-- Độc lập
|   xuống dưới)  |        |   xuống dưới)  |
+----------------+        +----------------+
|  Không gian    |        |  Không gian    |
|  heap (tăng    |        |  heap (tăng    |  <-- Độc lập
|   lên trên)    |        |   lên trên)    |
+----------------+        +----------------+
|  Data segment  |        |  Data segment  |  <-- Độc lập
|  (.bss/.data)  |        |  (.bss/.data)  |
+----------------+        +----------------+
|  Code segment  |        |  Code segment  |  <-- Độc lập
|  (.text)       |        |  (.text)       |
+----------------+        +----------------+
```

#### Các phương thức giao tiếp liên process (IPC)

| Phương thức | Nguyên lý | Tốc độ | Kịch bản phù hợp |
| :--- | :--- | :--- | :--- |
| **Pipe** | Bộ đệm kernel, luồng một chiều | Trung bình | Giao tiếp process cha-con |
| **Hàng đợi tin nhắn** | Danh sách liên kết tin nhắn kernel | Trung bình | Truyền tin nhắn bất đồng bộ |
| **Bộ nhớ chia sẻ** | Cùng một khối bộ nhớ vật lý được ánh xạ | Nhanh nhất | Chia sẻ dữ liệu lớn |
| **Semaphore** | Bộ đếm kernel | - | Đồng bộ hóa và loại trừ lẫn nhau |
| **Socket** | Ngăn xếp giao thức mạng | Chậm hơn | Giao tiếp xuyên máy |
| **Signal** | Ngắt mềm | - | Thông báo sự kiện |

### 3.2 Mô hình Thread: Lập lịch và đồng bộ hóa

#### Nguyên lý lập lịch thread

<ThreadSchedulingDemo />

Công việc cơ bản của bộ lập lịch thread trong hệ điều hành:

```
Hàng đợi sẵn sàng             Đang chạy                   Hàng đợi chờ
+--------+                +--------+               +--------+
| Thread B|  <-- Hết     | Thread A|  <-- Yêu cầu | Thread C|
| Thread D|      timeslice| (đang  |      I/O     | Thread E|
| Thread F|                |  chạy) |               | (block) |
+--------+                +--------+               +--------+
    |                                                  |
    v                                                  v
Bộ lập lịch chọn thread tiếp theo          Khi I/O hoàn thành,
dựa trên độ ưu tiên để chạy               chuyển về hàng đợi sẵn sàng
```

#### Các cơ chế đồng bộ hóa thread phổ biến

| Cơ chế | Nguyên lý | Ưu điểm | Nhược điểm |
| :--- | :--- | :--- | :--- |
| **Mutex** | Trạng thái nhị phân, truy cập độc quyền | Triển khai đơn giản | Hiệu năng kém khi cạnh tranh cao |
| **RWLock** | Đọc chia sẻ, ghi độc quyền | Hiệu quả cao khi đọc nhiều ghi ít | Triển khai phức tạp, rủi ro đói ghi |
| **Spinlock** | Busy waiting, không giải phóng CPU | Hiệu quả cao khi thời gian chờ ngắn | Lãng phí CPU khi thời gian chờ dài |
| **Biến điều kiện** | Chờ điều kiện cụ thể được thỏa mãn | Tránh busy waiting | Cần dùng kèm với khóa |
| **Semaphore** | Bộ đếm kiểm soát số lượng truy cập | Có thể kiểm soát số lượng đồng thời | Dễ sai khi dùng không đúng |
| **Thao tác nguyên tử** | Tính nguyên tử cấp độ lệnh CPU | Không khóa, hiệu năng cao nhất | Chỉ thao tác được kiểu dữ liệu đơn giản |
| **Hàng đợi lock-free** | Triển khai bằng thao tác CAS | Hiệu năng xuất sắc khi đồng thời cao | Triển khai phức tạp, vấn đề ABA |

### 3.3 Mô hình Coroutine: Lập lịch cấp độ người dùng

<CoroutineLightweightDemo />

#### Ưu điểm cốt lõi của coroutine

```
Đa luồng truyền thống         vs              Mô hình coroutine

+------------+                       +------------+
|  Thread 1  |                       |  Vòng lặp  |
| (stack 1MB)|                       |  sự kiện   |
+------------+                       | (bộ lập lịch)|
     |                                +------------+
     v                                     |
+------------+                             v
|  Thread 2  |                       +------------+
| (stack 1MB)|                       | Coroutine A|
+------------+                       | (stack vài KB)|
     |                                +------------+
     v                                     |
+------------+                             v
|  Thread 3  |                       +------------+
| (stack 1MB)|                       | Coroutine B|
+------------+                       | (stack vài KB)|
                                      +------------+

Chi phí: N MB                        Chi phí: N KB
Tạo: ~10μs                          Tạo: ~100ns
Chuyển đổi: ~1μs                    Chuyển đổi: ~100ns
```

#### Cơ chế hoạt động của async/await

<AsyncAwaitDemo />

```python
import asyncio

async def fetch_data(url):
    # Gặp await, coroutine tạm dừng, nhường CPU
    response = await aiohttp.get(url)
    # I/O hoàn thành, vòng lặp sự kiện đánh thức coroutine, tiếp tục từ đây
    return response.json()

async def main():
    # Tạo 3 tác vụ coroutine
    tasks = [
        fetch_data("https://api1.example.com"),
        fetch_data("https://api2.example.com"),
        fetch_data("https://api3.example.com")
    ]
    # Thực thi đồng thời, tổng thời gian ≈ request chậm nhất
    results = await asyncio.gather(*tasks)
    return results

# Khởi động vòng lặp sự kiện
asyncio.run(main())
```

**Luồng thực thi**:

```
Dòng thời gian ------------------------------------------------------------>

Coroutine A: [Chuẩn bị]--[await tạm dừng]=======[Nhận phản hồi]--[Xử lý dữ liệu]
                         |
Coroutine B:              [Chuẩn bị]--[await tạm dừng]=======[Nhận phản hồi]--[Xử lý dữ liệu]
                                      |
Coroutine C:                           [Chuẩn bị]--[await tạm dừng]=======[Nhận phản hồi]
                                                   |
                                                   ↓
                                             Tất cả I/O hoàn thành

Ghi chú: [ ] biểu thị CPU thực thi, === biểu thị I/O chờ, | biểu thị chuyển đổi coroutine
```

### 3.4 Vòng lặp sự kiện: "Trái tim" của coroutine

<EventLoopDemo />

Vòng lặp sự kiện là cơ chế cốt lõi của lập lịch coroutine:

```python
import selectors
import heapq

class EventLoop:
    def __init__(self):
        self.selector = selectors.DefaultSelector()
        self.ready = []  # Hàng đợi sẵn sàng
        self.scheduled = []  # Hàng đợi tác vụ định thời
        self.current = None

    def run(self):
        while True:
            # 1. Xử lý tác vụ định thời
            now = time.time()
            while self.scheduled and self.scheduled[0][0] <= now:
                _, callback = heapq.heappop(self.scheduled)
                self.ready.append(callback)

            # 2. Chờ sự kiện I/O
            timeout = 0 if self.ready else 0.1
            events = self.selector.select(timeout)

            for key, mask in events:
                callback = key.data
                self.ready.append(callback)

            # 3. Thực thi callback sẵn sàng
            while self.ready:
                callback = self.ready.popleft()
                callback()
```

### 3.5 Đồng thời vs Song song: Không phải là một

<ConcurrentVsParallelDemo />

| Khái niệm | Tiếng Anh | Ý nghĩa | So sánh | Điều kiện cần |
| :--- | :--- | :--- | :--- | :--- |
| **Đồng thời** | Concurrency | Nhiều tác vụ thực thi xen kẽ, vĩ mô cùng tiến triển | Một người luân phiên nấu nhiều món | CPU đơn nhân là đủ |
| **Song song** | Parallelism | Nhiều tác vụ thực sự đồng thời thực thi | Nhiều người cùng lúc nấu các món khác nhau | CPU đa nhân hoặc nhiều máy |

**Minh họa bằng hình**:

```
CPU đơn nhân - Đồng thời (Concurrent)
Thời gian →  1    2    3    4    5    6    7    8
Tác vụ A: [Thực thi][Thực thi]      [Thực thi][Thực thi]
Tác vụ B:      [Thực thi][Thực thi]      [Thực thi][Thực thi]

Hai tác vụ thực thi xen kẽ, vĩ mô "đồng thời" tiến triển

========================================

CPU đa nhân - Song song (Parallel)
Thời gian →  1    2    3    4    5    6    7    8
Nhân 1: [Tác vụA][Tác vụA][Tác vụA][Tác vụA]
Nhân 2: [Tác vụB][Tác vụB][Tác vụB][Tác vụB]

Hai tác vụ thực sự "đồng thời" thực thi

========================================

Thực tế thường là: Đồng thời + Song song
Thời gian →  1    2    3    4    5    6    7    8
Nhân 1: [A1][A1][B1][B1][C1][C1][D1][D1]
Nhân 2: [A2][A2][B2][B2][C2][C2][D2][D2]

Nhiều tác vụ được lập lịch đồng thời đến các nhân khác nhau, rồi thực thi song song trên các nhân
```

---

## 4. Thực chiến: Go Goroutine và Green Thread

### 4.1 Triết lý đồng thời của Go

<GoroutineGreenThreadDemo />

Triết lý thiết kế đồng thời của Go: **Đừng giao tiếp bằng cách chia sẻ bộ nhớ, mà hãy chia sẻ bộ nhớ bằng cách giao tiếp**.

```go
package main

import (
    "fmt"
    "time"
)

// Producer
func producer(ch chan<- int, id int) {
    for i := 0; i < 5; i++ {
        fmt.Printf("Producer %d sending: %d\n", id, i)
        ch <- i  // Gửi dữ liệu vào channel
        time.Sleep(100 * time.Millisecond)
    }
}

// Consumer
func consumer(ch <-chan int, id int) {
    for val := range ch {  // Nhận dữ liệu từ channel
        fmt.Printf("Consumer %d received: %d\n", id, val)
    }
}

func main() {
    // Tạo channel có bộ đệm
    ch := make(chan int, 10)

    // Khởi động 2 producer goroutine
    for i := 0; i < 2; i++ {
        go producer(ch, i)
    }

    // Khởi động 2 consumer goroutine
    for i := 0; i < 2; i++ {
        go consumer(ch, i)
    }

    // Chờ một khoảng thời gian
    time.Sleep(3 * time.Second)
    close(ch)
}
```

### 4.2 Bộ lập lịch Goroutine: Mô hình GMP

Bộ lập lịch của Go sử dụng mô hình GMP:

| Thành phần | Ý nghĩa | Vai trò |
| :--- | :--- | :--- |
| **G (Goroutine)** | Coroutine | Tác vụ cần thực thi, nhẹ (stack 2KB, có thể co giãn động) |
| **M (Machine)** | Thread hệ thống | Vật mang thực thi G, tương ứng 1:1 với kernel thread |
| **P (Processor)** | Bộ xử lý logic | Ngữ cảnh lập lịch, chứa hàng đợi G có thể chạy, số lượng mặc định bằng số nhân CPU |

**Luồng lập lịch**:

```
Hàng đợi toàn cục
+----------------+
|  G1  |  G2  |  G3  |
+----------------+

Hàng đợi cục bộ P0   Hàng đợi cục bộ P1   Hàng đợi cục bộ P2   Hàng đợi cục bộ P3
+----------+       +----------+       +----------+       +----------+
| G4 | G5  |       | G6 | G7  |       | G8 | G9  |       | G10| G11 |
+----------+       +----------+       +----------+       +----------+
    |                     |                     |                     |
    v                     v                     v                     v
+----------+       +----------+       +----------+       +----------+
|    M0    |       |    M1    |       |    M2    |       |    M3    |
| (OS thread)|      | (OS thread)|      | (OS thread)|      | (OS thread)|
+----------+       +----------+       +----------+       +----------+

Chiến lược lập lịch:
1. Mỗi P duy trì một hàng đợi G cục bộ, giảm cạnh tranh khóa
2. P lấy G từ hàng đợi cục bộ giao cho M thực thi
3. Khi hàng đợi cục bộ rỗng, "đánh cắp" một nửa G từ P khác (Work Stealing)
4. Hàng đợi toàn cục là phương án dự phòng, kiểm tra định kỳ
```

---

## 5. Mẫu code thực chiến

### 5.1 Mẫu Python asyncio đồng thời cao

```python
import asyncio
import aiohttp
from typing import List, Dict
import time

class AsyncHTTPClient:
    """HTTP client hiệu năng cao dựa trên asyncio"""

    def __init__(self, max_connections: int = 100, timeout: int = 30):
        self.timeout = aiohttp.ClientTimeout(total=timeout)
        # Giới hạn số kết nối đồng thời, tránh làm sập dịch vụ đối phương
        connector = aiohttp.TCPConnector(
            limit=max_connections,
            limit_per_host=10,  # Giới hạn kết nối cho một tên miền
            enable_cleanup_closed=True,
            force_close=True,
        )
        self.session = aiohttp.ClientSession(
            connector=connector,
            timeout=self.timeout,
        )

    async def fetch(self, url: str, method: str = 'GET', **kwargs) -> Dict:
        """Gửi một request đơn lẻ"""
        try:
            async with self.session.request(method, url, **kwargs) as response:
                return {
                    'url': url,
                    'status': response.status,
                    'data': await response.text(),
                    'error': None
                }
        except asyncio.TimeoutError:
            return {'url': url, 'status': None, 'data': None, 'error': 'Timeout'}
        except Exception as e:
            return {'url': url, 'status': None, 'data': None, 'error': str(e)}

    async def fetch_many(self, urls: List[str], concurrency: int = 10) -> List[Dict]:
        """Lấy nhiều URL đồng thời, giới hạn số lượng đồng thời"""
        semaphore = asyncio.Semaphore(concurrency)

        async def fetch_with_limit(url):
            async with semaphore:
                return await self.fetch(url)

        # Thực thi đồng thời tất cả request
        tasks = [fetch_with_limit(url) for url in urls]
        return await asyncio.gather(*tasks, return_exceptions=True)

    async def close(self):
        await self.session.close()


# Ví dụ sử dụng
async def main():
    client = AsyncHTTPClient(max_connections=50)

    # Danh sách URL cần lấy
    urls = [
        "https://api.github.com/users/github",
        "https://api.github.com/users/google",
        "https://api.github.com/users/microsoft",
        # ... thêm URL
    ] * 10  # Mô phỏng 300 request

    start = time.time()
    results = await client.fetch_many(urls, concurrency=20)
    elapsed = time.time() - start

    # Thống kê kết quả
    success = sum(1 for r in results if r.get('status') == 200)
    failed = len(results) - success

    print(f"Tổng số request: {len(results)}")
    print(f"Thành công: {success}, Thất bại: {failed}")
    print(f"Thời gian: {elapsed:.2f}s")
    print(f"QPS: {len(results)/elapsed:.1f}")

    await client.close()

if __name__ == "__main__":
    asyncio.run(main())
```

### 5.2 Mẫu Go dịch vụ đồng thời cao

```go
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"runtime"
	"time"

	"golang.org/x/sync/errgroup"
)

// Cấu trúc Request/Response
type OrderRequest struct {
	UserID    int64   `json:"user_id"`
	ProductID int64   `json:"product_id"`
	Quantity  int     `json:"quantity"`
	Price     float64 `json:"price"`
}

type OrderResponse struct {
	OrderID   int64   `json:"order_id"`
	Status    string  `json:"status"`
	Total     float64 `json:"total"`
	CreatedAt string  `json:"created_at"`
}

// Mô phỏng thao tác database
type Database struct {
	orders map[int64]*OrderResponse
	mutex  chan struct{}
}

func NewDatabase() *Database {
	db := &Database{
		orders: make(map[int64]*OrderResponse),
		mutex:  make(chan struct{}, 1), // Mô phỏng mutex
	}
	return db
}

func (db *Database) CreateOrder(ctx context.Context, req *OrderRequest) (*OrderResponse, error) {
	// Lấy khóa
	select {
	case db.mutex <- struct{}{}:
		defer func() { <-db.mutex }()
	case <-ctx.Done():
		return nil, ctx.Err()
	}

	// Mô phỏng độ trễ thao tác database
	select {
	case <-time.After(50 * time.Millisecond):
	case <-ctx.Done():
		return nil, ctx.Err()
	}

	order := &OrderResponse{
		OrderID:   time.Now().UnixNano(),
		Status:    "created",
		Total:     req.Price * float64(req.Quantity),
		CreatedAt: time.Now().Format(time.RFC3339),
	}
	db.orders[order.OrderID] = order
	return order, nil
}

// HTTP handler
type Handler struct {
	db *Database
}

func NewHandler(db *Database) *Handler {
	return &Handler{db: db}
}

func (h *Handler) CreateOrder(w http.ResponseWriter, r *http.Request) {
	// Đặt timeout cho request
	ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
	defer cancel()

	var req OrderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	order, err := h.db.CreateOrder(ctx, &req)
	if err != nil {
		if err == context.DeadlineExceeded {
			http.Error(w, "Request timeout", http.StatusGatewayTimeout)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(order)
}

func (h *Handler) Health(w http.ResponseWriter, r *http.Request) {
	info := map[string]interface{}{
		"status":    "ok",
		"goroutine": runtime.NumGoroutine(),
		"cpu":       runtime.NumCPU(),
		"version":   runtime.Version(),
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(info)
}

// Ví dụ xử lý hàng loạt
func BatchProcess(ctx context.Context, items []int) ([]int, error) {
	g, ctx := errgroup.WithContext(ctx)
	g.SetLimit(10) // Giới hạn đồng thời là 10

	results := make([]int, len(items))

	for i, item := range items {
		i, item := i, item // Tránh bẫy closure
		g.Go(func() error {
			select {
			case <-ctx.Done():
				return ctx.Err()
			default:
				// Mô phỏng xử lý
				time.Sleep(100 * time.Millisecond)
				results[i] = item * 2
				return nil
			}
		})
	}

	if err := g.Wait(); err != nil {
		return nil, err
	}
	return results, nil
}

func main() {
	// Khởi tạo database
	db := NewDatabase()

	// Tạo handler
	handler := NewHandler(db)

	// Thiết lập routing
	mux := http.NewServeMux()
	mux.HandleFunc("/order", handler.CreateOrder)
	mux.HandleFunc("/health", handler.Health)

	// Tạo server
	server := &http.Server{
		Addr:         ":8080",
		Handler:      mux,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	fmt.Println("Server starting on :8080")
	fmt.Printf("Go version: %s\n", runtime.Version())
	fmt.Printf("CPU cores: %d\n", runtime.NumCPU())

	if err := server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
```

---

## 6. Bảng tổng kết so sánh

### 6.1 So sánh khái niệm cốt lõi

| Đặc tính | Process | Thread | Coroutine |
| :--- | :--- | :--- | :--- |
| **Bên lập lịch** | Hệ điều hành | Hệ điều hành | Chương trình người dùng/runtime |
| **Chi phí chuyển đổi** | ~1-10ms | ~1-10μs | ~100ns |
| **Chiếm dụng bộ nhớ** | ~10MB+ | ~1MB | ~2KB |
| **Phương thức giao tiếp** | IPC | Bộ nhớ chia sẻ | Bộ nhớ chia sẻ/Channel |
| **Nhu cầu đồng bộ** | Không cần | Cần khóa | Cần khóa/hợp tác |
| **Ảnh hưởng khi sập** | Chỉ process đó | Toàn bộ process | Có thể kiểm soát |
| **Kịch bản phù hợp** | Cách ly mạnh, đa tenant | CPU intensive | I/O intensive |
| **Ngôn ngữ điển hình** | Tất cả ngôn ngữ | Tất cả ngôn ngữ | Go, Python, JS, Rust |

### 6.2 Hướng dẫn chọn mô hình đồng thời

| Kịch bản | Mô hình đề xuất | Lý do |
| :--- | :--- | :--- |
| Web service gateway | Coroutine + I/O bất đồng bộ | Kết nối đồng thời cao, chiếm bộ nhớ thấp |
| Dịch vụ giao tiếp thời gian thực | Coroutine + kết nối dài | Duy trì nhiều kết nối WebSocket |
| Pipeline xử lý dữ liệu | Đa process + coroutine | Tận dụng đa nhân, I/O không block |
| Tính toán khoa học | Đa luồng/đa process | CPU intensive, cần tính toán song song |
| Kiến trúc microservice | Đa process + coroutine | Cách ly giữa các service, đồng thời cao nội bộ |
| Hệ thống nhúng | Coroutine/đơn luồng | Tài nguyên hạn chế, lập lịch xác định |

### 6.3 Bảng thuật ngữ đối chiếu

| Thuật ngữ tiếng Anh | Tiếng Trung | Giải thích |
| :--- | :--- | :--- |
| **Process** | 进程 | Đơn vị phân bổ tài nguyên cơ bản của hệ điều hành, có không gian bộ nhớ độc lập |
| **Thread** | 线程 | Đơn vị lập lịch cơ bản của CPU, chia sẻ không gian bộ nhớ process |
| **Coroutine** | 协程 | Thread nhẹ cấp độ người dùng, do chương trình tự lập lịch |
| **Concurrency** | 并发 | Nhiều tác vụ thực thi xen kẽ, vĩ mô cùng tiến triển |
| **Parallelism** | 并行 | Nhiều tác vụ thực sự đồng thời thực thi, cần hỗ trợ đa nhân |
| **Context Switch** | 上下文切换 | Quá trình CPU chuyển từ tác vụ này sang tác vụ khác |
| **Blocking I/O** | 阻塞 I/O | Khởi tạo yêu cầu I/O rồi chờ hoàn thành, thread bị treo trong thời gian đó |
| **Non-blocking I/O** | 非阻塞 I/O | Khởi tạo yêu cầu I/O rồi trả về ngay, không chờ kết quả |
| **Async I/O** | 异步 I/O | Khi I/O hoàn thành, thông báo cho caller qua callback hoặc cơ chế thông báo |
| **Event Loop** | 事件循环 | Cơ chế lập lịch coroutine, liên tục lắng nghe sự kiện và phân phối xử lý |
| **Goroutine** | Go 协程 | Triển khai thread nhẹ của ngôn ngữ Go |
| **Channel** | 通道 | Cơ chế giao tiếp giữa các coroutine trong Go |
| **Mutex** | 互斥锁 | Nguyên ngữ đồng bộ dùng để bảo vệ tài nguyên chia sẻ |
| **Semaphore** | 信号量 | Kiểm soát số lượng thread đồng thời truy cập một tài nguyên |
| **Deadlock** | 死锁 | Nhiều thread chờ lẫn nhau giải phóng tài nguyên, dẫn đến block vĩnh viễn |
| **Race Condition** | 竞态条件 | Nhiều thread đồng thời truy cập dữ liệu chia sẻ, dẫn đến kết quả không xác định |
| **Thread Pool** | 线程池 | Tạo trước một nhóm thread, tái sử dụng để giảm chi phí tạo/hủy |
| **Work Stealing** | 工作窃取 | Thread nhàn rỗi "đánh cắp" tác vụ từ hàng đợi của thread bận để thực thi |
| **Zero-copy** | 零拷贝 | Dữ liệu truyền giữa kernel mode và user mode không qua sao chép CPU |
| **C10K Problem** | C10K 问题 | Thách thức xử lý đồng thời 1 vạn kết nối trên một máy |
| **C10M Problem** | C10M 问题 | Thách thức tối thượng xử lý đồng thời 1000 vạn kết nối trên một máy |

---

## 7. Lời kết

### 7.1 Quy tắc vàng của lập trình đồng thời

1. **Đừng tối ưu hóa sớm**: Để code chạy đúng trước, rồi mới xem xét tối ưu hiệu năng
2. **Tránh chia sẻ trạng thái**: "Đừng giao tiếp bằng cách chia sẻ bộ nhớ, mà hãy chia sẻ bộ nhớ bằng cách giao tiếp"
3. **Để lỗi lộ diện sớm nhất**: Bug đồng thời thường khó tái hiện, phải cố gắng phơi bày trong giai đoạn test
4. **Giới hạn số lượng đồng thời**: Đồng thời vô hạn đồng nghĩa với không có bảo vệ, phải dùng semaphore hoặc connection pool để giới hạn
5. **Giám sát và khả quan sát**: Hệ thống đồng thời phải có giám sát hoàn thiện, mới có thể nhanh chóng xác định vấn đề

### 7.2 Lộ trình học tập

```
Giai đoạn 1: Hiểu cơ bản
    ├── Hiểu khái niệm cơ bản về process/thread
    ├── Học các nguyên ngữ đồng bộ (khóa, semaphore, biến điều kiện)
    └── Viết chương trình đa luồng đơn giản

Giai đoạn 2: Đi sâu nguyên lý
    ├── Hiểu mô hình bộ nhớ và tính khả kiến
    ├── Học lập trình lock-free và thao tác nguyên tử
    ├── Hiểu thread pool và work stealing
    └── Phân tích deadlock và race condition

Giai đoạn 3: Ứng dụng nâng cao
    ├── Nắm vững coroutine và lập trình bất đồng bộ
    ├── Học mô hình đồng thời của Go/Python/Rust
    ├── Hiểu đồng thời trong hệ thống phân tán
    └── Tối ưu hiệu năng và hoạch định năng lực

Giai đoạn 4: Trình độ chuyên gia
    ├── Thiết kế kiến trúc hệ thống đồng thời cao
    ├── Giải quyết bug đồng thời phức tạp
    ├── Phát triển framework lập trình đồng thời
    └── Chia sẻ và truyền bá kiến thức đồng thời
```

Hy vọng hướng dẫn này có thể giúp bạn xây dựng nhận thức có hệ thống về lập trình đồng thời. Hãy nhớ rằng, **đồng thời không phải là mục đích, mà là phương tiện** — mục tiêu thực sự là xây dựng dịch vụ hiệu năng cao, khả dụng cao. Hiểu nguyên lý, chọn đúng mô hình, viết code tốt, bạn sẽ có thể đi ngày càng xa trên con đường đồng thời này.
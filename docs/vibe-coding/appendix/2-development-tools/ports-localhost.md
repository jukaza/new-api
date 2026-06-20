# Port và localhost

> 💡 **Hướng dẫn học**: Khi bạn chạy `npm run dev`, terminal hiện `http://localhost:5173`, bạn có bao giờ nghĩ: `localhost` là gì? `5173` nghĩa là gì? Tại sao đôi khi báo lỗi `EADDRINUSE`? Chương này sẽ giải thích một lần những khái niệm bạn gặp mỗi ngày khi phát triển nhưng ít khi đào sâu.

Trước khi bắt đầu, nên bổ sung hai "gạch nền tảng":

- **Mạng cơ bản**: Nếu chưa rõ khái niệm IP và HTTP, có thể xem [Tin học cơ bản - Truyền thông mạng](../1-computer-fundamentals/network-fundamentals.md).
- **Terminal cơ bản**: Nếu chưa quen lệnh terminal, xem [Dòng lệnh và Shell Script](./command-line-shell.md).

---

## 0. Mở đầu: `localhost:5173` hay gặp kia thực ra là gì?

<DevServerFlowDemo />

Mỗi ngày của developer đều không thể thiếu dòng output này:

```
➜  Local:   http://localhost:5173/
```

Nhưng bạn có nghĩ, trong dòng ngắn ngủi này ẩn chứa vài khái niệm quan trọng:

- **http://** → Giao thức truyền thông (dùng ngôn ngữ gì đối thoại)
- **localhost** → Địa chỉ đích (tìm ai)
- **:5173** → Số port (tìm xong rồi, gõ cửa nào)

Hiểu ba việc này, bạn hiểu được 90% vấn đề mạng môi trường phát triển. Tiếp theo chúng ta phân tích từng cái.

---

## 1. Port là gì? (IP là tòa nhà, port là số phòng)

### 1.1 Một phép ẩn dụ trực giác

Hãy tưởng tượng một server là một tòa nhà:

- **Địa chỉ IP** (như `192.168.1.100`) là địa chỉ tòa nhà — cho bạn biết "đến tòa nào".
- **Số port** (như `:80`) là số phòng trong tòa — cho bạn biết "vào phòng nào".

Một tòa nhà có thể cùng lúc có nhà hàng (phòng 80), quán cafe (phòng 443), văn phòng (phòng 22). Tương tự, một máy tính có thể chạy web server, database, SSH service, mỗi cái chiếm port khác nhau.

👇 **Thử click**:
Nhấn "biển số phòng" bên dưới, mô phỏng kết nối đến các port khác nhau. Quan sát: khi port "mở" (có chương trình đang nghe) và "đóng", sẽ xảy ra gì?

<PortAnalogyDemo />

### 1.2 Phạm vi giá trị port

Số port là một số nguyên trong khoảng **0–65535** (tổng 65536 port). Nhiều port như vậy được chia làm ba khoảng:

| Khoảng | Phạm vi | Mục đích | Ví dụ |
| :--- | :--- | :--- | :--- |
| **Port hệ thống** | 0 – 1023 | Dành cho giao thức tiêu chuẩn, user thường không được tùy ý sử dụng | 80 (HTTP), 443 (HTTPS), 22 (SSH) |
| **Port đã đăng ký** | 1024 – 49151 | Dành cho ứng dụng phổ biến đăng ký sử dụng | 3306 (MySQL), 5432 (PostgreSQL), 6379 (Redis) |
| **Port động** | 49152 – 65535 | OS phân bổ tạm thời | Trình duyệt gửi request, hệ thống random cấp source port |

> Tại sao dev server thích dùng 3000, 5173, 8080? Vì chúng nằm trong khoảng "port đã đăng ký", không cần quyền admin để nghe, lại ít xung đột với service hệ thống.

### 1.3 Tra cứu nhanh port phổ biến khi phát triển

👇 **Thử click**:
Nhập số port hoặc tên service để tìm, nhấn bất kỳ dòng nào để xem ví dụ sử dụng.

<CommonPortsDemo />

---

## 2. localhost là gì? (Tự tìm mình)

### 2.1 Khái niệm cốt lõi "loopback"

`localhost` là một domain đặc biệt, luôn trỏ về **chính máy tính của bạn**.

Khi bạn nhập `http://localhost:3000` trong trình duyệt, các bước sau xảy ra:

1. Trình duyệt hỏi OS: "IP của `localhost` là gì?"
2. OS trả lời ngay: "`127.0.0.1`" (không cần tra DNS)
3. Gói tin gửi đến `127.0.0.1`, nhưng **không thực sự rời khỏi máy**
4. OS qua "loopback interface" cho gói tin **quay ngược** lại
5. Chương trình đang nghe ở port 3000 nhận request, trả response

**Toàn bộ không qua dây mạng, không qua router, không cần internet.**

👇 **Thử click**:
Nhấn "Gửi request", quan sát hành trình đầy đủ của gói tin. Sau đó nhấn "thẻ马甲" bên dưới, tìm hiểu các cách viết và khác biệt của localhost.

<LocalhostLoopbackDemo />

### 2.2 `localhost` vs `127.0.0.1` vs `0.0.0.0`

Ba khái niệm này hay bị nhầm lẫn, nhưng ý nghĩa hoàn toàn khác:

| Cách viết | Ý nghĩa | Ai truy cập được |
| :--- | :--- | :--- |
| `localhost` / `127.0.0.1` | Địa chỉ loopback, chỉ máy cục bộ | Chỉ máy tính của bạn |
| `0.0.0.0` | Nghe trên mọi network interface | Máy cục bộ + thiết bị khác trong LAN |
| `192.168.x.x` | IP LAN | Thiết bị trong LAN |

**Kịch bản thực tế**:

```bash
# Chỉ mình truy cập được (an toàn, phù hợp phát triển)
npm run dev -- --host localhost

# Điện thoại cũng truy cập được (phù hợp debug mobile)
npm run dev -- --host 0.0.0.0
```

> Nhiều framework (như Vite, Next.js) mặc định nghe `localhost`, nên điện thoại dù cùng WiFi cũng không truy cập được. Muốn debug bằng điện thoại? Thêm tham số `--host`.

---

## 3. Xung đột port: Vấn đề phổ biến nhất môi trường phát triển

### 3.1 Tại sao xung đột?

**Một port cùng thời điểm chỉ có thể được một chương trình nghe.** Giống một phòng chỉ ở được một hộ gia đình.

Nếu bạn cố khởi động service thứ hai trên cùng port, sẽ thấy lỗi kinh điển:

```
Error: listen EADDRINUSE :::3000
```

Dịch ra: **"Phòng 3000 đã có người ở, bạn không vào được!"**

Kịch bản xung đột phổ biến:
- Dev server lần trước chưa tắt sạch, vẫn chạy ngầm
- Hai dự án khác dùng cùng default port
- Một service hệ thống đã chiếm port bạn muốn

👇 **Thử click**:
Thử khởi động service nhiều lần trong simulator dưới. Khi xung đột port, so sánh xử lý khác nhau giữa "khởi động trực tiếp" và "khởi động thông minh".

<PortConflictDemo />

### 3.2 Khắc phục

Khi gặp xung đột port, quy trình xử lý rất cố định:

**macOS / Linux:**
```bash
# Bước 1: Xem ai đang chiếm port 3000
lsof -i :3000

# Bước 2: Lấy PID, ép dừng
kill -9 <PID>
```

**Windows:**
```bash
# Bước 1: Xem ai đang chiếm port 3000
netstat -ano | findstr :3000

# Bước 2: Dừng process
taskkill /PID <PID> /F
```

> Nhiều framework hiện đại (Vite, Create React App, v.v.) khi gặp xung đột port sẽ tự hỏi "Đổi port khác không?". Nhưng hiểu nguyên lý nền tảng giúp bạn nhanh hơn khi framework không giúp được.

---

## 4. "Same-Origin Policy" và CORS trong phát triển

### 4.1 "Origin" là gì?

Trình duyệt có cơ chế bảo mật gọi là **Same-Origin Policy**: chỉ khi **protocol, domain, port** hoàn toàn giống nhau mới tính là "cùng origin".

| Địa chỉ A | Địa chỉ B | Cùng origin? | Lý do |
| :--- | :--- | :--- | :--- |
| `http://localhost:5173` | `http://localhost:5173/about` | ✅ Cùng origin | Protocol, domain, port đều giống |
| `http://localhost:5173` | `http://localhost:3000` | ❌ Khác origin | **Port khác nhau** (5173 vs 3000) |
| `http://localhost:5173` | `https://localhost:5173` | ❌ Khác origin | **Protocol khác nhau** (http vs https) |

### 4.2 Tại sao tách frontend/backend chắc chắn gặp CORS?

Khi kiến trúc dự án:

```
Frontend (Vite)  →  http://localhost:5173
Backend (Express) →  http://localhost:3000
```

Trang frontend load từ `:5173`, rồi dùng `fetch('/api/users')` request API ở `:3000` — **port khác nhau, kích hoạt hạn chế CORS!**

**Hai giải pháp phổ biến:**

**Cách 1: Backend cấu hình CORS**
```javascript
// Express backend
app.use(cors({ origin: 'http://localhost:5173' }))
```

**Cách 2: Frontend cấu hình proxy (khuyến nghị)**
```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
}
```

Nguyên lý proxy: Vite dev server giúp bạn "chuyển tiếp" request. Trình duyệt tưởng đang giao tiếp với `:5173` (cùng origin), thực tế Vite ngầm chuyển request sang `:3000`.

---

## 5. Khắc phục thực tế: Ba vấn đề phổ biến nhất

👇 **Thử click**:
Chọn một vấn đề bạn từng gặp, theo các bước khắc phục. Mỗi bước có thể nhấn "thực thi" xem output.

<PortTroubleshootDemo />

---

## 6. Bảng thuật ngữ

| Thuật ngữ tiếng Anh | Dịch | Giải thích |
| :--- | :--- | :--- |
| **Port** | Cổng | Số từ 0–65535, dùng phân biệt các dịch vụ mạng khác nhau trên cùng máy. Mỗi dịch vụ "nghe" một port, chờ client kết nối. |
| **localhost** | Máy cục bộ | Domain đặc biệt, luôn trỏ về máy mình (127.0.0.1). Dùng truy cập service chạy trên máy mà không cần internet. |
| **Loopback Interface** | Giao diện loopback | Network interface ảo của OS. Gói tin gửi đến 127.0.0.1 không rời máy, mà qua interface này "quay ngược" lại. |
| **EADDRINUSE** | Địa chỉ đã được sử dụng | Lỗi Node.js / OS báo, nghĩa là port bạn muốn nghe đã bị chương trình khác chiếm. |
| **CORS** | Chia sẻ tài nguyên cross-origin | Cơ chế bảo mật trình duyệt. Khi trang frontend thử request API khác origin (protocol/domain/port khác), cần backend cho phép rõ ràng. |
| **Same-Origin Policy** | Chính sách cùng origin | Nền tảng bảo mật trình duyệt: chỉ cho phép request cùng protocol, domain, port giao tiếp tự do, chặn đọc dữ liệu cross-origin. |
| **Proxy** | Proxy | Trong môi trường dev, proxy server thay trình duyệt chuyển tiếp request đến backend, vượt qua hạn chế same-origin. |
| **0.0.0.0** | Mọi interface | Khi service nghe 0.0.0.0, nghĩa là chấp nhận kết nối từ bất kỳ network interface nào (máy cục bộ, LAN, v.v.). |
| **Well-known Ports** | Port nổi tiếng | Tên gọi chung port 0–1023, dành cho HTTP (80), HTTPS (443), SSH (22) v.v. |
| **PID** | ID tiến trình | Số duy nhất OS cấp cho mỗi chương trình đang chạy, dùng quản lý và dừng tiến trình. |
| **lsof** | Liệt kê file mở | Lệnh macOS/Linux, dùng xem process nào chiếm port nào (`lsof -i :port`). |
| **HMR** | Hot Module Replacement | Chức năng dev server: bạn sửa code, trình duyệt tự cập nhật, không cần refresh. Hoạt động qua WebSocket. |

---

## Tóm tắt

Port và localhost là khái niệm cơ bản và thường gặp nhất trong môi trường phát triển:

- **Port** = "Số phòng" phân biệt service trên cùng máy (0–65535)
- **localhost** = Địa chỉ đặc biệt "tự tìm mình" (127.0.0.1), dữ liệu không rời máy
- **Xung đột port** bản chất là "một phòng chỉ treo một biển"
- **CORS** bản chất là "port khác nhau = khác origin", cần CORS hoặc proxy giải quyết

Nhớ bốn câu này, đa số vấn đề mạng trong môi trường phát triển bạn gặp sẽ nhanh chóng định vị được nguyên nhân.

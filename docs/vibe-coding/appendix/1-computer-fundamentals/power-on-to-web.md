# Từ Khi Nhấn Nút Nguồn Đến Khi Truy Cập Website Đã Xảy Ra Điều Gì

::: tip Lời Nói Đầu
Bạn đã bao giờ tự hỏi, từ khi bạn nhấn nút nguồn máy tính, đến khi cuối cùng nhìn thấy trang web trong trình duyệt, điều gì đã xảy ra ở giữa?

Quá trình này giống như một **cuộc chạy tiếp sức** — phần cứng được cấp điện đánh thức firmware, firmware kiểm tra xong thì chuyển gậy cho hệ điều hành, hệ điều hành chuẩn bị môi trường xong mới chạy được trình duyệt, trình duyệt lại qua mạng đi lấy trang web từ máy chủ ở xa. Mỗi khâu đều **phụ thuộc vào sự hoàn thành thành công của khâu trước**, bất kỳ gậy nào rơi, các bước sau đều không thể tiến hành.

Hiểu được chuỗi liên kết hoàn chỉnh này, giúp bạn xây dựng nhận thức tổng thể về hệ thống máy tính, cũng là con đường tất yếu để trở thành kỹ sư full-stack.
:::

**Bạn sẽ học được gì?**

Bài viết này theo trình tự thời gian thực tế của sự kiện, dẫn bạn đi qua năm giai đoạn từ khi nhấn nút nguồn đến khi nhìn thấy trang web:

1. **Khởi động phần cứng** (Mục 1) → Dòng điện đánh thức CPU như thế nào
2. **Firmware tự kiểm tra** (Mục 2) → BIOS/UEFI xác nhận phần cứng bình thường và tìm thiết bị khởi động ra sao
3. **Khởi động hệ điều hành** (Mục 3) → Kernel nạp như thế nào, desktop xuất hiện ra sao
4. **Khởi động trình duyệt** (Mục 4) → Ứng dụng được hệ điều hành chạy lên như thế nào
5. **Yêu cầu mạng** (Mục 5) → Từ khi nhập URL đến khi trang hiển thị, hành trình mạng hoàn chỉnh

Mỗi bước đều xây dựng trên nền tảng của bước trước, không thể thiếu bước nào.

---

## 1. Nhấn Nút Nguồn: Phần Cứng Thức Tỉnh

### 1.1 Khởi Động Nguồn

Khi bạn nhấn nút nguồn, **bộ nguồn (PSU)** bắt đầu làm việc, chuyển đổi điện xoay chiều (220V) thành điện một chiều (12V, 5V, 3.3V, v.v.), cấp điện cho các thành phần phần cứng.

```
Nút nguồn → Bộ nguồn (PSU) → Đầu ra điện một chiều → Cấp cho các thành phần trên bo mạch chủ
```

### 1.2 Chipset Bo Mạch Chủ Thức Tỉnh

Sau khi nguồn điện ổn định, **chipset bo mạch chủ** bắt đầu làm việc, nó giống như "người điều phối tổng" của máy tính, chịu trách nhiệm điều phối các thành phần phần cứng.

### 1.3 CPU Reset

CPU sau khi nhận tín hiệu reset, xóa tất cả các thanh ghi và cache bên trong, bắt đầu thực thi lệnh từ một địa chỉ được định sẵn. Địa chỉ này thường trỏ đến chip **BIOS/UEFI**.

<PowerOnDemo />

---

> **Gậy tiếp sức thứ nhất hoàn thành** ⛳ Đến đây, công việc ở tầng phần cứng đã hoàn thành: bộ nguồn chuyển đổi điện xoay chiều thành điện một chiều ổn định, chipset bo mạch chủ được đánh thức và bắt đầu điều phối các thành phần, CPU cũng đã reset xong, xóa các thanh ghi, sẵn sàng thực thi lệnh đầu tiên.
>
> Nhưng xin lưu ý — CPU lúc này giống như một "đứa trẻ vừa mở mắt". Nó tuy có thể thực thi lệnh, nhưng hoàn toàn không biết gì về môi trường xung quanh: máy tính có bao nhiêu RAM? Card đồ họa có dùng được không? Ổ cứng ở đâu? Nên khởi động hệ điều hành từ thiết bị nào? CPU không thể tự trả lời những câu hỏi này.
>
> Vì vậy, lệnh đầu tiên CPU thực thi sau khi reset, chính là nhảy đến một **địa chỉ bộ nhớ cố định** — địa chỉ này trỏ đến chip firmware BIOS/UEFI được hàn chết trên bo mạch chủ. Từ khoảnh khắc này, quyền điều khiển được chuyển từ phần cứng thuần túy sang firmware. Nhiệm vụ của BIOS/UEFI rất rõ ràng: **kiểm tra tất cả phần cứng có bình thường không, sau đó tìm hệ điều hành và khởi động nó**. Đây chính là gậy thứ hai của cuộc chạy tiếp sức.

## 2. BIOS/UEFI: Tự Kiểm Tra Phần Cứng

<BiosUefiInteractiveDemo />

---

> **Gậy tiếp sức thứ hai hoàn thành** ⛳ BIOS/UEFI đã hoàn thành xuất sắc ba nhiệm vụ của nó: qua POST xác nhận RAM, card đồ họa, bàn phím và các phần cứng khác đều hoạt động bình thường; khởi tạo chế độ làm việc của từng phần cứng; theo thứ tự khởi động tìm thấy sector khởi động trên ổ cứng.
>
> Nhưng vai trò của BIOS/UEFI đến đây là hết — nó về bản chất là một "bác sĩ khám sức khỏe + người điều phối". Nó có thể kiểm tra phần cứng có khỏe không, quyết định khởi động từ thiết bị nào, nhưng nó không quản lý tệp tin của bạn, không chạy ứng dụng của bạn, cũng không hiển thị cho bạn một desktop đẹp. Những nhiệm vụ phức tạp này, cần một phần mềm mạnh mẽ hơn tiếp quản — đó chính là **hệ điều hành**.
>
> Cách chuyển giao rất cụ thể: BIOS/UEFI đọc code bootloader trong sector đầu tiên của ổ cứng (sector khởi động), nạp nó vào bộ nhớ, sau đó cho CPU nhảy đến đoạn code này để bắt đầu thực thi. Từ khoảnh khắc này, quyền điều khiển chính thức được chuyển từ firmware sang bootloader của hệ điều hành. Bootloader sẽ từng bước nạp kernel hệ điều hành vào, khởi động các dịch vụ hệ thống, cuối cùng hiển thị desktop quen thuộc. Gậy phức tạp nhất trong chuỗi này, bắt đầu.

## 3. Khởi Động Hệ Điều Hành: Từ Kernel Đến Desktop

<OSBootInteractiveDemo />

---

> **Gậy tiếp sức thứ ba hoàn thành** ⛳ Hệ điều hành đã khởi động hoàn toàn, desktop hiển thị trước mắt bạn. Nhìn lại xem gậy này đã làm gì: bootloader đọc kernel từ ổ cứng, kernel tiếp quản quyền điều khiển CPU và bộ nhớ, các dịch vụ hệ thống lần lượt khởi động (mạng, âm thanh, trung tâm bảo mật...), cuối cùng giao diện đồ họa hiển thị desktop.
>
> Hệ điều hành lúc này giống như một tòa nhà đã có điện nước, ban quản lý đã vào ở — **quản lý tiến trình** chịu trách nhiệm phân phòng cho từng cư dân (chương trình), **quản lý bộ nhớ** chịu trách nhiệm phân không gian, **hệ thống tệp** chịu trách nhiệm quản lý kho, **ngăn xếp giao thức mạng** chịu trách nhiệm liên lạc với bên ngoài. Những "dịch vụ công cộng" này là cơ sở hạ tầng cho tất cả ứng dụng chạy, không có chúng, bất kỳ chương trình nào cũng không thể khởi động.
>
> Bây giờ bạn muốn lên mạng, thế là nhấp đúp vào biểu tượng trình duyệt trên desktop. Đằng sau hành động đơn giản này, hệ điều hành phải làm một loạt công việc: tìm tệp thực thi của trình duyệt ở đâu trên ổ cứng, tạo một tiến trình độc lập cho nó, phân bổ không gian bộ nhớ, nạp code chương trình... Đây chính là biểu hiện trực tiếp của năng lực "quản lý tiến trình" của hệ điều hành. Tiếp theo, hãy xem trình duyệt được khởi động lên như thế nào.

## 4. Mở Trình Duyệt: Khởi Động Ứng Dụng

### 4.1 Quá Trình Khởi Động Ứng Dụng

Khi bạn nhấp đúp vào biểu tượng trình duyệt, hệ điều hành sẽ:

1. **Tìm tệp thực thi**: Dựa vào liên kết tệp, tìm tệp `.exe` (Windows) hoặc tệp thực thi của trình duyệt
2. **Tạo tiến trình**: Tạo một **tiến trình** mới cho trình duyệt
3. **Nạp chương trình**: Nạp code của trình duyệt từ ổ cứng vào bộ nhớ
4. **Khởi tạo**: Khởi động luồng chính, engine kết xuất, engine mạng của trình duyệt, v.v.

```
Quá trình khởi động trình duyệt:
┌─────────────────────────────────────┐
│  1. Nhấp đúp biểu tượng              │
│  2. Hệ điều hành tìm tệp thực thi    │
│  3. Tạo tiến trình trình duyệt       │
│  4. Nạp code trình duyệt vào bộ nhớ  │
│  5. Khởi tạo các module (kết xuất, mạng, JS) │
│  6. Hiển thị cửa sổ trình duyệt      │
└─────────────────────────────────────┘
```

### 4.2 Các Thành Phần Chính Của Trình Duyệt

Trình duyệt hiện đại là một "hệ điều hành" phức tạp, chủ yếu gồm các phần sau:

| Module | Chức Năng |
|-----|------|
| **Giao diện người dùng** | Thanh địa chỉ, tab, bookmark, v.v. |
| **Browser engine** | Điều phối UI và rendering engine |
| **Rendering engine** | Phân tích HTML/CSS, hiển thị trang web |
| **JavaScript engine** | Thực thi mã JavaScript |
| **Module mạng** | Gửi yêu cầu HTTP |
| **UI backend** | Vẽ các thành phần UI cơ bản |
| **Lưu trữ dữ liệu** | Cookie, LocalStorage, v.v. |

<BrowserArchitectureDemo />

---

> **Gậy tiếp sức thứ tư hoàn thành** ⛳ Trình duyệt đã khởi động thành công. Hệ điều hành đã tạo tiến trình độc lập cho nó, phân bổ không gian bộ nhớ, các module của trình duyệt cũng đã khởi tạo xong: rendering engine sẵn sàng phân tích HTML/CSS, JavaScript engine sẵn sàng thực thi script, module mạng sẵn sàng gửi và nhận dữ liệu.
>
> Bạn có thể ví trình duyệt lúc này như một chiếc xe đã nổ máy — động cơ đang chạy, bảng điều khiển sáng lên, hệ thống định vị sẵn sàng, nhưng xe vẫn đứng yên tại chỗ, vì tài xế (bạn) chưa nói cho nó biết "đi đâu". Cửa sổ trình duyệt lúc này trống rỗng, thanh địa chỉ nhấp nháy con trỏ, chờ bạn nhập.
>
> Khi bạn gõ `https://www.example.com` vào thanh địa chỉ và nhấn Enter, một hành trình xuyên suốt toàn bộ Internet bắt đầu. Module mạng của trình duyệt sẽ tiếp quản yêu cầu này: trước tiên phân tích cấu trúc URL, rồi qua DNS dịch tên miền thành địa chỉ IP, sau đó vượt qua mạng thiết lập kết nối TCP với máy chủ ở xa, thương lượng kênh mã hóa, gửi yêu cầu HTTP, chờ máy chủ phản hồi, cuối cùng giao code HTML/CSS/JS nhận được cho rendering engine vẽ thành trang web bạn nhìn thấy. Đây là gậy có nhiều bước nhất, liên quan đến nhiều giao thức nhất trong toàn bộ chuỗi tiếp sức — cũng là đoạn mà Web developer cần hiểu nhất.

## 5. Truy Cập URL: Toàn Bộ Quá Trình Yêu Cầu Mạng

### 5.1 URL Là Gì?

**URL (Uniform Resource Locator)** là địa chỉ của tài nguyên, giống như địa chỉ trong cuộc sống, dùng để định vị tài nguyên trên Internet.

```
Cấu trúc URL:
┌─────────────────────────────────────────────────────────┐
│  https://  │  www.example.com  │  /path/to/page  │ ?query=1 │
│    Giao thức   │       Tên miền      │     Đường dẫn     │   Truy vấn  │
└─────────────────────────────────────────────────────────┘
```

- **Giao thức (Protocol)**: Dùng cách nào để truy cập (http, https, ftp, v.v.)
- **Tên miền (Domain)**: Địa chỉ của máy chủ
- **Đường dẫn (Path)**: Vị trí của tài nguyên trên máy chủ
- **Truy vấn (Query)**: Tham số bổ sung

### 5.2 Quá Trình Hoàn Chỉnh Khi Truy Cập URL

Khi bạn truy cập `https://www.example.com`, những điều này đã xảy ra:

<URLRequestDemo />

#### Bước 1: Phân Tích URL

Trình duyệt trước tiên **phân tích URL**, trích xuất giao thức, tên miền, đường dẫn và các thông tin khác.

```
Quá trình phân tích URL:
https://www.example.com/index.html
  ↓
Giao thức: https
Tên miền: www.example.com
Đường dẫn: /index.html
```

#### Bước 2: Phân Giải DNS

Máy tính truy cập máy chủ qua mạng, nhưng mạng dùng **địa chỉ IP** (như 93.184.216.34), không phải tên miền. Vì vậy cần chuyển đổi tên miền thành địa chỉ IP, quá trình này gọi là **phân giải DNS**.

```
Quy trình phân giải DNS:
┌─────────────────────────────────────────────────────────┐
│  Cache trình duyệt → tệp hosts → cache DNS cục bộ → máy chủ DNS │
└─────────────────────────────────────────────────────────┘

Quá trình thực tế:
1. Trình duyệt kiểm tra cache (đã truy cập gần đây chưa?)
2. Hệ điều hành kiểm tra cache DNS
3. Gửi yêu cầu truy vấn đến máy chủ DNS
4. Máy chủ DNS trả về địa chỉ IP
```

#### Bước 3: Thiết Lập Kết Nối TCP

Lấy được địa chỉ IP rồi, trình duyệt cần thiết lập **kết nối TCP** với máy chủ. TCP là giao thức tầng vận chuyển, đảm bảo truyền dữ liệu tin cậy.

```
TCP bắt tay ba bước:
┌─────────────────────────────────────────────────────────┐
│  Client → Server: SYN (yêu cầu đồng bộ)                  │
│  Server → Client: SYN-ACK (xác nhận và đồng bộ)          │
│  Client → Server: ACK (xác nhận)                         │
│                        ↓                                │
│  Kết nối thiết lập hoàn tất!                             │
└─────────────────────────────────────────────────────────┘
```

Nếu là **HTTPS**, còn cần thực hiện **bắt tay TLS/SSL**, thiết lập kênh mã hóa.

#### Bước 4: Gửi Yêu Cầu HTTP

Sau khi kết nối được thiết lập, trình duyệt gửi **yêu cầu HTTP** đến máy chủ:

```
Định dạng yêu cầu HTTP:
┌─────────────────────────────────────────────────────────┐
│  GET /index.html HTTP/1.1                              │
│  Host: www.example.com                                 │
│  User-Agent: Mozilla/5.0...                             │
│  Accept: text/html                                     │
│                                                         │
│  (dòng trống)                                           │
└─────────────────────────────────────────────────────────┘
```

Các phương thức HTTP phổ biến:

| Phương Thức | Ý Nghĩa | Mục Đích |
|-----|------|-----|
| **GET** | Lấy tài nguyên | Duyệt web |
| **POST** | Gửi dữ liệu | Đăng nhập, gửi biểu mẫu |
| **PUT** | Tải lên tài nguyên | Tải tệp lên |
| **DELETE** | Xóa tài nguyên | Xóa dữ liệu |

#### Bước 5: Máy Chủ Xử Lý Yêu Cầu

Máy chủ (thường là **Web server** như Nginx, Apache) sau khi nhận yêu cầu:

1. **Phân tích yêu cầu**: Hiểu client muốn gì
2. **Xử lý nghiệp vụ**: Gọi chương trình backend (như Python, Node.js, Java)
3. **Truy vấn cơ sở dữ liệu**: Lấy dữ liệu cần thiết
4. **Tạo phản hồi**: Tổ hợp dữ liệu thành định dạng HTML, JSON, v.v.

```
Quy trình xử lý của máy chủ:
┌─────────────────────────────────────────────────────────┐
│  1. Web server nhận yêu cầu (Nginx/Apache)              │
│  2. Tìm chương trình xử lý tương ứng theo đường dẫn      │
│  3. Thực thi code backend (API, logic nghiệp vụ)         │
│  4. Nếu cần truy vấn cơ sở dữ liệu, lấy dữ liệu         │
│  5. Tổ hợp phản hồi (HTML/JSON/CSS/JS)                  │
│  6. Trả về phản hồi HTTP                                │
└─────────────────────────────────────────────────────────┘
```

#### Bước 6: Trả Về Phản Hồi HTTP

Máy chủ trả về **phản hồi HTTP**, bao gồm mã trạng thái, header phản hồi và body phản hồi:

```
Định dạng phản hồi HTTP:
┌─────────────────────────────────────────────────────────┐
│  HTTP/1.1 200 OK                                       │
│  Content-Type: text/html                               │
│  Content-Length: 1234                                  │
│                                                         │
│  <!DOCTYPE html>                                       │
│  <html>...</html>                                      │
└─────────────────────────────────────────────────────────┘
```

Các mã trạng thái phổ biến:

| Mã Trạng Thái | Ý Nghĩa |
|-------|------|
| **200** | Thành công |
| **301/302** | Chuyển hướng |
| **404** | Không tìm thấy tài nguyên |
| **500** | Lỗi máy chủ |

#### Bước 7: Trình Duyệt Kết Xuất Trang

Trình duyệt nhận phản hồi xong, bắt đầu **kết xuất trang**:

<RenderingDemo />

1. **Phân tích HTML**: Xây dựng cây DOM
2. **Phân tích CSS**: Tính toán style, xây dựng cây kết xuất
3. **Thực thi JavaScript**: Thực thi code JS trong trang
4. **Vẽ trang**: Hiển thị nội dung lên màn hình

```
Quá trình kết xuất của trình duyệt:
┌─────────────────────────────────────────────────────────┐
│  1. Phân tích HTML → Cây DOM                           │
│  2. Phân tích CSS → Quy tắc style                      │
│  3. DOM + CSS → Cây kết xuất                           │
│  4. Tính toán layout → Kích thước vị trí từng phần tử   │
│  5. Vẽ → Pixel hiển thị lên màn hình                   │
│  6. Tổng hợp → Nhiều lớp hợp nhất hiển thị              │
└─────────────────────────────────────────────────────────┘
```

---

> **Gậy tiếp sức cuối cùng hoàn thành** ⛳ Trang web cuối cùng đã hiển thị trước mắt bạn! Nhìn lại gậy cuối cùng này đã trải qua bao nhiêu khâu: trình duyệt phân tích URL trích xuất giao thức và tên miền, qua DNS truy vấn từng tầng để dịch tên miền thành địa chỉ IP, qua TCP bắt tay ba bước thiết lập kết nối tin cậy với máy chủ, rồi qua TLS bắt tay thiết lập kênh mã hóa, sau đó gửi yêu cầu HTTP, máy chủ xử lý logic nghiệp vụ, truy vấn cơ sở dữ liệu, tổ hợp dữ liệu phản hồi trả về, cuối cùng rendering engine của trình duyệt phân tích HTML thành cây DOM, CSS tính toán thành quy tắc style, hai cái hợp nhất thành cây kết xuất, tính toán layout, vẽ từng pixel lên màn hình.
>
> Bây giờ, hãy kéo góc nhìn ra xa, nhìn lại toàn cảnh cuộc chạy tiếp sức này từ đầu đến cuối. Tính từ khoảnh khắc nhấn nút nguồn: dòng điện đánh thức phần cứng (gậy 1) → firmware kiểm tra thiết bị và tìm đĩa khởi động (gậy 2) → hệ điều hành từ kernel đến desktop khởi động hoàn chỉnh (gậy 3) → trình duyệt như một ứng dụng được hệ điều hành chạy lên (gậy 4) → yêu cầu mạng vượt qua Internet lấy dữ liệu về và kết xuất thành trang (gậy 5). Năm gậy liên kết chặt chẽ, mỗi gậy đều xây dựng trên thành quả của gậy trước, thiếu bất kỳ khâu nào, bạn đều không thể nhìn thấy trang web trước mắt.
>
> Tiếp theo, hãy dùng một sơ đồ hoàn chỉnh xâu chuỗi năm giai đoạn này lại với nhau, trực quan thấy được mối quan hệ phụ thuộc giữa chúng.

## 6. Tổng Quan Quy Trình Hoàn Chỉnh

Hãy xâu chuỗi toàn bộ quá trình:

<FullProcessDemo />

```
Từ nhấn nút nguồn đến truy cập website — quy trình hoàn chỉnh:

┌──────────────────────────────────────────────────────────────────┐
│  1. Nhấn nút nguồn                                                │
│     └── Khởi động nguồn → Đánh thức bo mạch chủ → CPU reset → Thực thi BIOS/UEFI │
├──────────────────────────────────────────────────────────────────┤
│  2. Khởi động BIOS/UEFI                                          │
│     └── Tự kiểm tra phần cứng → Tìm thiết bị khởi động → Đọc bootloader │
├──────────────────────────────────────────────────────────────────┤
│  3. Khởi động hệ điều hành                                        │
│     └── Bootloader → Nạp kernel → Khởi động dịch vụ → Hiển thị desktop │
├──────────────────────────────────────────────────────────────────┤
│  4. Mở trình duyệt                                                │
│     └── Nhấp đúp biểu tượng → Tạo tiến trình → Nạp chương trình → Hiển thị cửa sổ │
├──────────────────────────────────────────────────────────────────┤
│  5. Truy cập URL                                                  │
│     └── Phân tích URL → Phân giải DNS → Kết nối TCP → Yêu cầu HTTP │
│         → Máy chủ xử lý → Phản hồi HTTP → Trình duyệt kết xuất → Hiển thị trang web │
└──────────────────────────────────────────────────────────────────┘
```

---

> Nhìn toàn bộ chuỗi, bạn sẽ phát hiện một quy luật thú vị: vấn đề mà mỗi giai đoạn giải quyết hoàn toàn khác nhau, lĩnh vực kỹ thuật liên quan đằng sau cũng khác biệt hoàn toàn. Gậy 1 là lĩnh vực **kỹ thuật điện tử** — chuyển đổi nguồn, thiết kế mạch, truyền tín hiệu; gậy 2 thuộc về **lập trình firmware** — dùng code tầng thấp trực tiếp điều khiển phần cứng; gậy 3 là thế giới của **hệ điều hành** — lập lịch tiến trình, quản lý bộ nhớ, hệ thống tệp, đây là chủ đề cốt lõi của khoa học máy tính; gậy 4 liên quan đến **phát triển ứng dụng** — cách thiết kế kiến trúc phần mềm phức tạp như trình duyệt; gậy 5 thì trải dài **mạng máy tính** và **phát triển frontend** — từ các giao thức mạng DNS, TCP/IP, HTTP, đến phân tích và kết xuất HTML/CSS/JS.
>
> Điều này cũng giải thích tại sao "kỹ sư full-stack" cần kiến thức rộng: mỗi dòng code frontend bạn viết, cuối cùng đều phải qua toàn bộ chuỗi này mới hiển thị được cho người dùng. Hiểu từng mắt xích trong chuỗi, giúp bạn khi gặp vấn đề có thể nhanh chóng định vị — là vấn đề tầng mạng? là vấn đề máy chủ? hay là vấn đề kết xuất của trình duyệt?
>
> Bản đồ tri thức dưới đây sắp xếp các lĩnh vực kỹ thuật này rõ ràng, cũng chỉ ra hướng đi cho việc học sâu tiếp theo của bạn.

## 7. Bản Đồ Tri Thức

Các lĩnh vực tri thức liên quan trong chương này:

```
Tổng quan hệ thống máy tính
├── Cơ sở phần cứng
│   ├── Bộ nguồn (PSU)
│   ├── Chipset bo mạch chủ
│   └── CPU
├── BIOS/UEFI
│   ├── POST tự kiểm tra
│   ├── Thứ tự khởi động
│   └── Bootloader
├── Hệ điều hành
│   ├── Kernel
│   ├── Dịch vụ hệ thống
│   └── Môi trường desktop
├── Ứng dụng
│   ├── Quản lý tiến trình
│   └── Nạp chương trình
└── Giao tiếp mạng
    ├── Phân giải DNS
    ├── Giao thức TCP/IP
    ├── Giao thức HTTP
    └── Kết xuất trình duyệt
```

::: tip Tiếp Tục Học
Nếu bạn muốn tìm hiểu sâu về một khâu nào đó, có thể tiếp tục học:

- **Từ Transistor đến CPU**: Tìm hiểu cơ sở phần cứng máy tính
- **Hệ Điều Hành (tiến trình/bộ nhớ/hệ thống tệp)**: Hiểu sâu về hệ điều hành
- **Mạng Máy Tính**: Hiểu sâu về giao thức mạng
:::
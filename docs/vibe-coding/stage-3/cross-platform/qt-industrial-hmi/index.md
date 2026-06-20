# Cách Xây dựng Ứng dụng Desktop Công nghiệp Qt: Hệ thống HMI Giám sát Bơm

# Chương 1: HMI Công nghiệp và Phát triển Qt Là Gì

Trong hướng dẫn này, chúng ta sẽ hoàn thành một vòng lặp khép kín: xây dựng một hệ thống HMI giám sát bơm cấp công nghiệp từ đầu với Qt. Nó có thể đọc dữ liệu cảm biến thời gian thực, vẽ biểu đồ xu hướng áp suất, kích hoạt cảnh báo vượt ngưỡng tự động và ghi nhật ký sự cố. Toàn bộ quá trình sử dụng phần mềm mô phỏng miễn phí trên PC thay vì phần cứng công nghiệp thực.

Để thực hiện hướng dẫn này, bạn cần ít nhất:

- Một máy tính (Windows hoặc Mac, khuyến nghị Windows để tương thích phần mềm công nghiệp tốt hơn)
- Môi trường phát triển Qt 6.5 (Qt Creator + Qt Serial Bus + mô-đun Qt Charts)
- Phần mềm mô phỏng Modbus Slave (tải xuống miễn phí, hoạt động như "bơm ảo")
- Trợ lý lập trình AI của bạn (Cursor / Trae / Claude Code)

> **Không phần cứng, không chi phí**: sử dụng phần mềm mô phỏng PC miễn phí (Modbus Slave) làm thiết bị cấp dưới; không cần mua phần cứng. Sử dụng trực tiếp các mô-đun `QModbusTcpClient` + Qt Charts chính thức của Qt, không cần phân tích giao thức thủ công. Sau khi chạy, bạn sẽ thấy xu hướng áp suất thời gian thực, cảnh báo vượt ngưỡng và nhật ký sự cố, phù hợp với quy trình nhà máy thực tế.

## 1.1 Máy tính Trên và Máy tính Dưới Là Gì?

Trong tự động hóa công nghiệp, có hai khái niệm bạn phải hiểu: **máy tính trên** và **máy tính dưới**.

**Máy tính Dưới**: "tay chân" tại hiện trường

Máy tính dưới là bộ điều khiển tương tác trực tiếp với thiết bị vật lý. Trong nhà máy, nó thường là **PLC (Bộ điều khiển Logic Lập trình được)** hoặc **cảm biến**, chịu trách nhiệm:

* đọc dữ liệu hiện trường (nhiệt độ, áp suất, lưu lượng, mức chất lỏng, v.v.)
* điều khiển hành động thiết bị (khởi động bơm, đóng van, điều chỉnh tốc độ, v.v.)
* chạy logic định trước tự động (ví dụ dừng bơm khi áp suất vượt ngưỡng)

Bạn có thể hình dung máy tính dưới như một "công nhân" trên sàn nhà máy. Nó không cần suy nghĩ phức tạp, nhưng phải thực hiện nhiệm vụ đáng tin cậy.

**Máy tính Trên**: "mắt và não" trong phòng điều khiển

Máy tính trên là phần mềm giám sát chạy trên PC hoặc máy tính công nghiệp, chính là **HMI (Giao diện Người-Máy)** mà chúng ta sẽ xây dựng hôm nay. Nó chịu trách nhiệm:

* hiển thị dữ liệu hiện trường thời gian thực (số, biểu đồ, hoạt ảnh)
* ghi lại dữ liệu lịch sử và nhật ký cảnh báo
* cho phép điều khiển từ xa cho người vận hành
* cung cấp phân tích dữ liệu và báo cáo

Bạn có thể hình dung máy tính trên như "trung tâm giám sát" của nhà máy. Người vận hành có thể hiểu trạng thái nhà máy từ màn hình.

**Chúng giao tiếp như thế nào?**

Máy tính trên và dưới trao đổi dữ liệu thông qua **giao thức truyền thông công nghiệp**. Phổ biến nhất là **Modbus**, một giao thức "cựu binh" ra đời năm 1979. Nó vẫn được sử dụng rộng rãi vì đơn giản, đáng tin cậy và được hỗ trợ bởi hầu hết tất cả các thiết bị công nghiệp.

```text
Phòng điều khiển                           Hiện trường nhà máy
┌──────────┐    Giao thức Modbus    ┌──────────┐
│ Máy tính │ ◄──────────────────►  │ Máy tính │
│ trên     │   "Cho tôi áp suất"   │ dưới     │
│ (Qt HMI) │   "Áp suất là 1.20MPa"│ (PLC/Cảm biến)
│ Hiển thị │                       │ Đọc dữ  │
│ Ghi dữ  │                       │ Điều    │
│ Cảnh báo │                       │ Bảo vệ  │
└──────────┘                       └──────────┘
```

<!-- ![placeholder: Sơ đồ mối quan hệ máy tính trên và dưới: màn hình PC (máy tính trên) bên trái, PLC và bơm (máy tính dưới) bên phải, kết nối qua Modbus](/zh-cn/stage-3/cross-platform/qt-industrial-hmi/images/image1.png) -->

## 1.2 Giao thức Modbus Là Gì?

Modbus là "ngôn ngữ chung" của truyền thông công nghiệp. Nó định nghĩa cách máy tính trên và dưới "nói chuyện."

**Chỉ có hai khái niệm cốt lõi:**

* **Register**: các "ô" dữ liệu trong máy tính dưới. Mỗi ô có một địa chỉ (`0`, `1`, `2`, ...), lưu trữ một số. Ví dụ, địa chỉ `0` lưu áp suất và địa chỉ `1` lưu nhiệt độ.
* **Thao tác Đọc/Ghi**: máy tính trên có thể đọc register (lấy dữ liệu) hoặc ghi register (gửi lệnh điều khiển).

**Hai biến thể Modbus phổ biến:**

| Biến thể | Vận chuyển | Kịch bản Điển hình |
|------|---------|---------|
| Modbus RTU | Nối tiếp (RS-485/RS-232) | Khoảng cách ngắn, kết nối thiết bị trực tiếp |
| Modbus TCP | Ethernet (TCP/IP) | Khoảng cách dài, truyền thông mạng |

Hướng dẫn này sử dụng **Modbus TCP**. Vì dựa trên mạng, ứng dụng máy tính trên và trình mô phỏng máy tính dưới có thể chạy trên cùng một máy mà không cần dây kết nối vật lý.

## 1.3 Tại sao Chọn Qt?

Qt là lựa chọn framework hàng đầu cho phần mềm công nghiệp. Nhiều giao diện giám sát trong nhà máy, bệnh viện và hệ thống giao thông được xây dựng bằng Qt. Lý do rất đơn giản:

| Ưu điểm | Giải thích |
|------|------|
| Cross-platform | Một codebase biên dịch sang Windows, Linux và thiết bị nhúng |
| Hỗ trợ giao thức công nghiệp tích hợp | Qt Serial Bus hỗ trợ Modbus tự nhiên, không cần thư viện bên thứ ba |
| Vẽ biểu đồ mạnh mẽ | Qt Charts cung cấp biểu đồ thời gian thực chuyên nghiệp |
| Hiệu năng cao | Nền tảng C++ phù hợp cho làm mới dữ liệu thời gian thực |
| Trưởng thành và ổn định | Lịch sử 30 năm, được chứng minh trong lĩnh vực công nghiệp |

## 1.4 Chúng ta sẽ Xây dựng Cái gì?

Chúng ta sẽ xây dựng **Hệ thống HMI Giám sát Bơm** mô phỏng giám sát áp suất bơm nhà máy thực:

| Chức năng | Mô tả |
|------|------|
| Đọc dữ liệu thời gian thực | Đọc áp suất từ máy tính dưới mỗi giây |
| Biểu đồ xu hướng áp suất | Biểu đồ đường cho 60 giây áp suất gần nhất |
| Cảnh báo vượt ngưỡng | Cảnh báo bật lên và UI đỏ khi áp suất vượt ngưỡng |
| Nhật ký sự cố | Ghi lại tất cả sự kiện cảnh báo vào cơ sở dữ liệu để tra cứu lịch sử |
| Điều khiển thủ công | Khởi động/dừng bơm bằng một cú nhấp (ghi register máy tính dưới) |

<!-- ![placeholder: Xem trước HMI giám sát bơm hiển thị số áp suất thời gian thực, biểu đồ xu hướng, chỉ báo cảnh báo, nút khởi động/dừng và danh sách nhật ký](/zh-cn/stage-3/cross-platform/qt-industrial-hmi/images/image2.png) -->

## 1.5 Lộ trình Hướng dẫn

Chúng ta sẽ hoàn thành quy trình theo các bước sau:

1. **Chuẩn bị môi trường và máy tính dưới mô phỏng** (2 phút): cài đặt Qt 6.5 và trình mô phỏng Modbus Slave
2. **Tạo dự án Qt và kết nối Modbus** (3 phút): thiết lập truyền thông giữa ứng dụng trên và trình mô phỏng
3. **Triển khai đọc và hiển thị thời gian thực** (3 phút): đọc áp suất theo thời gian và cập nhật UI
4. **Vẽ biểu đồ xu hướng áp suất thời gian thực** (3 phút): biểu đồ đường động với Qt Charts
5. **Triển khai cảnh báo và nhật ký sự cố** (3 phút): cảnh báo vượt ngưỡng + ghi nhật ký SQLite
6. **Đóng gói và triển khai** (tùy chọn): đóng gói ứng dụng thành tệp thực thi độc lập

# Chương 2: Chuẩn bị Môi trường và Máy tính Dưới Mô phỏng (2 Phút)

## 2.1 Cài đặt Qt 6.5

Qt cung cấp phiên bản mã nguồn mở miễn phí, đủ cho hướng dẫn này.

1. Truy cập [trang web chính thức Qt](https://www.qt.io/download-qt-installer) và tải xuống Qt Online Installer
2. Chạy trình cài đặt, đăng nhập hoặc đăng ký tài khoản Qt (miễn phí)
3. Trong chọn thành phần, đánh dấu:
   - **Qt 6.5.x** (hoặc mới hơn)
   - **Qt Serial Bus** dưới **Additional Libraries** (hỗ trợ Modbus)
   - **Qt Charts** dưới **Additional Libraries** (render biểu đồ)
   - **Qt Creator** (IDE, thường được chọn mặc định)
4. Nhấp cài đặt và đợi

> **Mẹo**: nếu Qt đã được cài đặt nhưng thiếu Serial Bus hoặc Charts, chạy lại Qt Maintenance Tool và thêm thành phần.

<!-- ![placeholder: Ảnh chụp màn hình chọn thành phần trình cài đặt Qt làm nổi bật Qt Serial Bus và Qt Charts](/zh-cn/stage-3/cross-platform/qt-industrial-hmi/images/image3.png) -->

## 2.2 Cài đặt Modbus Slave: "Bơm Ảo" của Bạn

Modbus Slave là một trình mô phỏng Modbus slave miễn phí. Nó có thể mô phỏng một thiết bị công nghiệp (PLC/cảm biến) trên máy tính để ứng dụng trên của bạn có thứ gì đó để giao tiếp.

1. Truy cập [modbustools.com](https://www.modbustools.com/modbus_slave.html) và tải xuống Modbus Slave
2. Cài đặt và mở nó
3. Cấu hình kết nối:
   - Menu **Connection -> Connect**
   - Chọn **Modbus TCP/IP**
   - Địa chỉ IP: `127.0.0.1` (localhost)
   - Cổng: `502` (cổng Modbus TCP mặc định)
   - Nhấp **OK** để lắng nghe

4. Đặt dữ liệu mô phỏng:
   - Bạn sẽ thấy bảng register, mỗi hàng là một địa chỉ register (`0`, `1`, `2`, ...)
   - Nhấp đúp giá trị tại địa chỉ **0**, đổi thành **120** (nghĩa là áp suất 1.20 MPa, chia cho 100 trong ứng dụng)
   - Nhấp đúp giá trị tại địa chỉ **1**, đổi thành **350** (nghĩa là nhiệt độ 35.0°C)
   - Nhấp đúp giá trị tại địa chỉ **2**, đổi thành **1** (trạng thái bơm: `1=đang chạy`, `0=đã dừng`)

Bây giờ Modbus Slave là "bơm ảo 24/7" của bạn. Giữ cửa sổ mở; nó sẽ liên tục phản hồi các yêu cầu đọc/ghi.

<!-- ![placeholder: Ảnh chụp màn hình Modbus Slave hiển thị cấu hình TCP và giá trị register mô phỏng](/zh-cn/stage-3/cross-platform/qt-industrial-hmi/images/image4.png) -->

> **Mẹo mô phỏng động**: Modbus Slave hỗ trợ tự động tăng/thay đổi ngẫu nhiên. Nhấp chuột phải vào giá trị register và chọn "Auto increment" hoặc "Random" để mô phỏng dao động cảm biến thực tế.

# Chương 3: Tạo Dự án Qt và Kết nối Modbus (3 Phút)

## 3.1 Tạo Dự án Qt Mới

Mở Qt Creator và tạo một dự án mới:

1. Nhấp **File -> New Project**
2. Chọn **Application (Qt) -> Qt Widgets Application**
3. Tên dự án: **PumpHMI**
4. Chọn kit Qt 6.5 đã cài đặt
5. Hoàn tất tạo

Mở `PumpHMI.pro` (hoặc `CMakeLists.txt` nếu sử dụng CMake) và thêm các mô-đun chính:

```pro
QT += core gui widgets serialbus charts sql
```

| Mô-đun | Mục đích |
|------|------|
| `serialbus` | Cung cấp `QModbusTcpClient` cho truyền thông Modbus TCP |
| `charts` | Cung cấp `QChart`, `QLineSeries` cho biểu đồ xu hướng thời gian thực |
| `sql` | Cung cấp `QSqlDatabase` cho nhật ký sự cố SQLite |

Nếu sử dụng CMake, cấu hình tương đương:

```cmake
find_package(Qt6 REQUIRED COMPONENTS Widgets SerialBus Charts Sql)
target_link_libraries(PumpHMI PRIVATE
    Qt6::Widgets Qt6::SerialBus Qt6::Charts Qt6::Sql)
```

## 3.2 Khai báo Các Thành viên Cốt lõi

Yêu cầu AI tạo tệp header:

```text
Vui lòng giúp tôi viết mainwindow.h với các thành viên cốt lõi cho HMI giám sát bơm:
1. QModbusTcpClient cho truyền thông Modbus TCP
2. QTimer cho đọc dữ liệu theo thời gian
3. QChart + QLineSeries cho biểu đồ xu hướng thời gian thực
4. QSqlDatabase cho lưu trữ nhật ký sự cố
5. Các thành phần UI: nhãn áp suất, chỉ báo trạng thái, nút khởi động/dừng, bảng nhật ký
```

Header cốt lõi:

```cpp
// mainwindow.h
#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QModbusTcpClient>
#include <QModbusDataUnit>
#include <QTimer>
#include <QtCharts>
#include <QSqlDatabase>
#include <QLabel>
#include <QPushButton>
#include <QTableWidget>

class MainWindow : public QMainWindow {
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private slots:
    void connectModbus();        // kết nối máy tính dưới
    void readPressure();         // đọc áp suất theo thời gian
    void onReadReady();          // callback đọc
    void triggerAlarm(float v);  // kích hoạt cảnh báo
    void togglePump();           // khởi động/dừng bơm

private:
    // Truyền thông Modbus
    QModbusTcpClient *m_modbusClient = nullptr;
    QTimer *m_pollTimer = nullptr;

    // Biểu đồ thời gian thực
    QChart *m_chart = nullptr;
    QLineSeries *m_series = nullptr;
    QDateTimeAxis *m_axisX = nullptr;
    QValueAxis *m_axisY = nullptr;

    // Cơ sở dữ liệu
    QSqlDatabase m_db;

    // Các thành phần UI
    QLabel *m_pressureLabel = nullptr;    // hiển thị áp suất
    QLabel *m_statusLight = nullptr;      // chỉ báo trạng thái
    QPushButton *m_pumpButton = nullptr;  // nút khởi động/dừng
    QTableWidget *m_logTable = nullptr;   // bảng nhật ký

    // Ngưỡng cảnh báo
    float m_alarmThreshold = 1.50f;  // cảnh báo trên 1.50 MPa
    bool m_pumpRunning = false;

    void setupUI();
    void setupDatabase();
    void logAlarm(float pressure, const QString &message);
};

#endif // MAINWINDOW_H
```

<!-- ![placeholder: Ảnh chụp màn hình mainwindow.h trong Qt Creator](/zh-cn/stage-3/cross-platform/qt-industrial-hmi/images/image5.png) -->

## 3.3 Xây dựng Kết nối Modbus TCP

Triển khai logic kết nối trong `mainwindow.cpp`:

```cpp
// mainwindow.cpp - phần kết nối
void MainWindow::connectModbus()
{
    m_modbusClient = new QModbusTcpClient(this);

    // Kết nối đến trình mô phỏng Modbus Slave
    m_modbusClient->setConnectionParameter(
        QModbusDevice::NetworkPortParameter, 502);
    m_modbusClient->setConnectionParameter(
        QModbusDevice::NetworkAddressParameter, "127.0.0.1");
    m_modbusClient->setTimeout(1000);       // timeout 1s
    m_modbusClient->setNumberOfRetries(3);  // thử lại 3 lần

    if (!m_modbusClient->connectDevice()) {
        statusBar()->showMessage("Không thể kết nối máy tính dưới!", 3000);
        return;
    }

    statusBar()->showMessage("Đã kết nối đến máy tính dưới (127.0.0.1:502)", 3000);

    // Khởi động timer, đọc mỗi giây một lần
    m_pollTimer = new QTimer(this);
    connect(m_pollTimer, &QTimer::timeout, this, &MainWindow::readPressure);
    m_pollTimer->start(1000);  // 1000ms = 1s
}
```

**Ghi chú code:**

| Code | Ý nghĩa |
|------|------|
| `QModbusTcpClient` | Client Modbus TCP tích hợp của Qt, giao tiếp với máy tính dưới |
| `NetworkPortParameter, 502` | Kết nối đến cổng `502` (giống cấu hình Modbus Slave) |
| `NetworkAddressParameter, "127.0.0.1"` | Kết nối localhost (trình mô phỏng chạy cục bộ) |
| `m_pollTimer->start(1000)` | Gọi `readPressure()` mỗi giây |

## 3.4 Đọc Dữ liệu Áp suất

```cpp
// mainwindow.cpp - phần đọc
void MainWindow::readPressure()
{
    if (!m_modbusClient || m_modbusClient->state() != QModbusDevice::ConnectedState)
        return;

    // Xây dựng yêu cầu đọc: bắt đầu từ địa chỉ 0, đọc 3 holding register
    QModbusDataUnit readUnit(
        QModbusDataUnit::HoldingRegisters,  // loại register
        0,                                   // địa chỉ bắt đầu
        3                                    // số lượng
    );

    // Gửi yêu cầu đọc bất đồng bộ
    if (auto *reply = m_modbusClient->sendReadRequest(readUnit, 1)) {
        if (!reply->isFinished()) {
            connect(reply, &QModbusReply::finished,
                    this, &MainWindow::onReadReady);
        } else {
            delete reply;  // yêu cầu broadcast, xóa trực tiếp
        }
    }
}

void MainWindow::onReadReady()
{
    auto *reply = qobject_cast<QModbusReply *>(sender());
    if (!reply) return;

    if (reply->error() == QModbusDevice::NoError) {
        const QModbusDataUnit unit = reply->result();

        // Phân tích giá trị (chia giá trị register cho đơn vị thực)
        float pressure = unit.value(0) / 100.0f;   // địa chỉ 0: áp suất (MPa)
        float temperature = unit.value(1) / 10.0f;  // địa chỉ 1: nhiệt độ (°C)
        int pumpStatus = unit.value(2);              // địa chỉ 2: trạng thái bơm

        // Cập nhật UI
        m_pressureLabel->setText(
            QString("%1 MPa").arg(pressure, 0, 'f', 2));

        // Kiểm tra cảnh báo
        if (pressure > m_alarmThreshold) {
            triggerAlarm(pressure);
        }

        // Cập nhật biểu đồ xu hướng (triển khai chương tiếp theo)
        // updateChart(pressure);

    } else {
        statusBar()->showMessage(
            QString("Đọc thất bại: %1").arg(reply->errorString()), 2000);
    }

    reply->deleteLater();
}
```

**Quy trình đọc Modbus:**

```text
readPressure() được kích hoạt bởi timer
    -> Xây dựng QModbusDataUnit ("đọc địa chỉ 0-2")
    -> sendReadRequest() gửi bất đồng bộ (UI không bị chặn)
    -> máy tính dưới trả về dữ liệu
    -> onReadReady() được kích hoạt
    -> phân tích giá trị register và cập nhật UI
```

<!-- ![placeholder: Ảnh chụp màn hình ứng dụng đang chạy hiển thị cập nhật áp suất thời gian thực và thanh trạng thái "đã kết nối đến máy tính dưới"](//zh-cn/stage-3/cross-platform/qt-industrial-hmi/images/image6.png) -->

# Chương 4: Vẽ Biểu đồ Xu hướng Áp suất Thời gian thực (3 Phút)

## 4.1 Khởi tạo Biểu đồ

Qt Charts cung cấp các thành phần biểu đồ chuyên nghiệp. Yêu cầu AI khởi tạo trong constructor:

```text
Vui lòng giúp tôi khởi tạo biểu đồ đường thời gian thực Qt Charts trong constructor MainWindow:
1. Tạo QChart và QLineSeries
2. Trục X sử dụng QDateTimeAxis, hiển thị 60 giây gần nhất
3. Trục Y sử dụng QValueAxis, phạm vi 0-3.0 MPa
4. Đường màu xanh, độ rộng 2px
5. Đặt biểu đồ vào QChartView và thêm vào bố cục
```

Code cốt lõi:

```cpp
// mainwindow.cpp - khởi tạo biểu đồ
void MainWindow::setupChart()
{
    m_series = new QLineSeries();
    m_series->setName("Áp suất (MPa)");
    m_series->setPen(QPen(QColor("#2196F3"), 2));

    m_chart = new QChart();
    m_chart->addSeries(m_series);
    m_chart->setTitle("Xu hướng Áp suất Thời gian thực");
    m_chart->setAnimationOptions(QChart::NoAnimation); // không hoạt ảnh cho dữ liệu thời gian thực

    // Trục X: thời gian
    m_axisX = new QDateTimeAxis();
    m_axisX->setFormat("HH:mm:ss");
    m_axisX->setTitleText("Thời gian");
    m_chart->addAxis(m_axisX, Qt::AlignBottom);
    m_series->attachAxis(m_axisX);

    // Trục Y: áp suất
    m_axisY = new QValueAxis();
    m_axisY->setRange(0, 3.0);
    m_axisY->setTitleText("Áp suất (MPa)");
    m_axisY->setLabelFormat("%.1f");
    m_chart->addAxis(m_axisY, Qt::AlignLeft);
    m_series->attachAxis(m_axisY);

    // Tạo chart view
    QChartView *chartView = new QChartView(m_chart);
    chartView->setRenderHint(QPainter::Antialiasing);

    // Thêm vào bố cục (giả sử centralLayout đã tồn tại)
    centralLayout->addWidget(chartView);
}
```

## 4.2 Cập nhật Biểu đồ Thời gian thực

Mỗi khi đọc được giá trị áp suất mới, thêm một điểm và chỉ giữ 60 giây gần nhất:

```cpp
// mainwindow.cpp - cập nhật biểu đồ
void MainWindow::updateChart(float pressure)
{
    QDateTime now = QDateTime::currentDateTime();

    // Thêm điểm mới
    m_series->append(now.toMSecsSinceEpoch(), pressure);

    // Chỉ giữ dữ liệu 60s gần nhất
    QDateTime cutoff = now.addSecs(-60);
    while (m_series->count() > 0 &&
           m_series->at(0).x() < cutoff.toMSecsSinceEpoch()) {
        m_series->remove(0);
    }

    // Cập nhật phạm vi trục X: luôn hiển thị 60s gần nhất
    m_axisX->setRange(cutoff, now);
}
```

Sau đó gọi nó trong `onReadReady()`:

```cpp
// Thêm sau phần phân tích áp suất trong onReadReady():
updateChart(pressure);
```

Bây giờ chạy chương trình. Bạn sẽ thấy một đường màu xanh cập nhật thời gian thực, một điểm mỗi giây, luôn hiển thị 60 giây gần nhất. Nếu bạn sửa đổi giá trị register trong Modbus Slave thủ công, đường phản ánh thay đổi ngay lập tức.

<!-- ![placeholder: Ảnh chụp màn hình xu hướng áp suất thời gian thực hiển thị đường xanh cuộn, trục X thời gian, trục Y áp suất](/zh-cn/stage-3/cross-platform/qt-industrial-hmi/images/image7.png) -->

> **Mẹo hiệu năng**: `QChart::NoAnimation` rất quan trọng. Dữ liệu thời gian thực làm mới mỗi giây; hoạt ảnh có thể gây lag UI. Đây là thực hành HMI công nghiệp phổ biến.

# Chương 5: Hệ thống Cảnh báo và Nhật ký Sự cố (3 Phút)

## 5.1 Cảnh báo Vượt ngưỡng

Khi áp suất vượt ngưỡng, chúng ta cần: cảnh báo UI đỏ + cảnh báo bật lên + ghi nhật ký.

```cpp
// mainwindow.cpp - logic cảnh báo
void MainWindow::triggerAlarm(float pressure)
{
    // Đổi UI thành đỏ
    m_pressureLabel->setStyleSheet(
        "color: white; background-color: #F44336;"
        "font-size: 32px; padding: 10px; border-radius: 8px;");

    // Chỉ báo trạng thái đỏ
    m_statusLight->setStyleSheet(
        "background-color: #F44336; border-radius: 12px;"
        "min-width: 24px; min-height: 24px;");

    // Cảnh báo bật lên (chỉ lần đầu vượt ngưỡng để tránh bật lên lặp lại)
    static bool alarmActive = false;
    if (!alarmActive) {
        alarmActive = true;
        QMessageBox::warning(this, "Cảnh báo Áp suất",
            QString("Áp suất hiện tại %1 MPa vượt ngưỡng %2 MPa!\nVui lòng kiểm tra trạng thái bơm ngay lập tức.")
                .arg(pressure, 0, 'f', 2)
                .arg(m_alarmThreshold, 0, 'f', 2));
    }

    // Ghi vào DB
    logAlarm(pressure,
        QString("Áp suất vượt ngưỡng: %1 MPa > %2 MPa")
            .arg(pressure, 0, 'f', 2)
            .arg(m_alarmThreshold, 0, 'f', 2));

    // Đặt lại khi áp suất trở về bình thường
    if (pressure <= m_alarmThreshold) {
        alarmActive = false;
        m_pressureLabel->setStyleSheet(
            "color: #2196F3; font-size: 32px; padding: 10px;");
        m_statusLight->setStyleSheet(
            "background-color: #4CAF50; border-radius: 12px;"
            "min-width: 24px; min-height: 24px;");
    }
}
```

<!-- ![placeholder: Ảnh chụp màn hình cảnh báo vượt ngưỡng hiển thị nền áp suất đỏ, chỉ báo đỏ và cảnh báo bật lên](/zh-cn/stage-3/cross-platform/qt-industrial-hmi/images/image8.png) -->

## 5.2 Nhật ký Sự cố SQLite

Hệ thống công nghiệp phải ghi lại tất cả sự kiện cảnh báo để truy xuất nguồn gốc. Chúng ta sử dụng SQLite:

```cpp
// mainwindow.cpp - khởi tạo cơ sở dữ liệu
void MainWindow::setupDatabase()
{
    m_db = QSqlDatabase::addDatabase("QSQLITE");
    m_db.setDatabaseName("pump_alarm_log.db");

    if (!m_db.open()) {
        qWarning() << "Không thể mở cơ sở dữ liệu:" << m_db.lastError().text();
        return;
    }

    // Tạo bảng cảnh báo
    QSqlQuery query;
    query.exec(
        "CREATE TABLE IF NOT EXISTS alarm_log ("
        "  id INTEGER PRIMARY KEY AUTOINCREMENT,"
        "  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,"
        "  pressure REAL,"
        "  message TEXT"
        ")"
    );
}
```

## 5.3 Ghi và Hiển thị Bản ghi

```cpp
// mainwindow.cpp - ghi nhật ký
void MainWindow::logAlarm(float pressure, const QString &message)
{
    // Ghi vào DB
    QSqlQuery query;
    query.prepare(
        "INSERT INTO alarm_log (pressure, message) VALUES (?, ?)");
    query.addBindValue(pressure);
    query.addBindValue(message);
    query.exec();

    // Cập nhật bảng trên màn hình
    int row = m_logTable->rowCount();
    m_logTable->insertRow(row);
    m_logTable->setItem(row, 0,
        new QTableWidgetItem(
            QDateTime::currentDateTime().toString("yyyy-MM-dd HH:mm:ss")));
    m_logTable->setItem(row, 1,
        new QTableWidgetItem(QString::number(pressure, 'f', 2)));
    m_logTable->setItem(row, 2,
        new QTableWidgetItem(message));

    // Tự động cuộn đến hàng mới nhất
    m_logTable->scrollToBottom();
}
```

Bảng nhật ký có ba cột: thời gian, giá trị áp suất và thông báo cảnh báo. Mỗi cảnh báo thêm một hàng và được lưu trữ vĩnh viễn vào SQLite.

<!-- ![placeholder: Ảnh chụp màn hình bảng nhật ký sự cố với nhiều bản ghi bao gồm thời gian, áp suất và thông báo cảnh báo](/zh-cn/stage-3/cross-platform/qt-industrial-hmi/images/image9.png) -->

## 5.4 Khởi động/Dừng Bơm Thủ công

Ngoài việc đọc dữ liệu, máy tính trên cũng nên điều khiển máy tính dưới. Chúng ta làm điều này bằng cách ghi giá trị register:

```cpp
// mainwindow.cpp - điều khiển bơm
void MainWindow::togglePump()
{
    if (!m_modbusClient || m_modbusClient->state() != QModbusDevice::ConnectedState)
        return;

    m_pumpRunning = !m_pumpRunning;

    // Xây dựng yêu cầu ghi: ghi 1 (khởi động) hoặc 0 (dừng) vào địa chỉ 2
    QModbusDataUnit writeUnit(
        QModbusDataUnit::HoldingRegisters, 2, 1);
    writeUnit.setValue(0, m_pumpRunning ? 1 : 0);

    if (auto *reply = m_modbusClient->sendWriteRequest(writeUnit, 1)) {
        connect(reply, &QModbusReply::finished, this, [this, reply]() {
            if (reply->error() == QModbusDevice::NoError) {
                m_pumpButton->setText(m_pumpRunning ? "Dừng Bơm" : "Khởi động Bơm");
                m_pumpButton->setStyleSheet(m_pumpRunning
                    ? "background-color: #F44336; color: white; padding: 12px;"
                    : "background-color: #4CAF50; color: white; padding: 12px;");
                statusBar()->showMessage(
                    m_pumpRunning ? "Bơm đã khởi động" : "Bơm đã dừng", 2000);
            }
            reply->deleteLater();
        });
    }
}
```

Trong Modbus Slave, bạn sẽ thấy địa chỉ `2` chuyển đổi giữa `0` và `1` khi bạn nhấp nút. Đây là quá trình "điều khiển" của máy tính trên.

<!-- ![placeholder: Ảnh chụp màn hình nút khởi động/dừng bơm hiển thị trạng thái "Khởi động Bơm" xanh và "Dừng Bơm" đỏ](/zh-cn/stage-3/cross-platform/qt-industrial-hmi/images/image10.png) -->

# Chương 6: Đóng gói và Triển khai (Tùy chọn)

## 6.1 Đóng gói với windeployqt / macdeployqt

Qt cung cấp công cụ triển khai chính thức để thu thập các thư viện động cần thiết tự động.

**Windows:**

```bash
# Xây dựng Release trước, sau đó chạy trong thư mục xây dựng:
windeployqt PumpHMI.exe
```

`windeployqt` sao chép DLL Qt, plugin, tệp dịch, v.v. bên cạnh tệp thực thi. Thư mục đã đóng gói đó có thể gửi trực tiếp.

**macOS:**

```bash
macdeployqt PumpHMI.app -dmg
```

Lệnh này tạo ảnh cài đặt `.dmg`.

## 6.2 Xây dựng Trình cài đặt với Qt Installer Framework

Nếu bạn muốn một thuật sĩ cài đặt chuyên nghiệp ("Next -> Next -> Finish"), sử dụng Qt Installer Framework:

```text
Vui lòng giúp tôi tạo trình cài đặt cho PumpHMI với Qt Installer Framework:
1. Tạo cấu trúc thư mục trình cài đặt (config, packages)
2. Cấu hình config.xml (tên trình cài đặt, phiên bản, thư mục đích)
3. Đặt các tệp đầu ra windeployqt vào packages/com.example.pumphmi/data/
4. Chạy binarycreator để tạo trình cài đặt
```

<!-- ![placeholder: Ảnh chụp màn hình thuật sĩ cài đặt PumpHMI hiển thị đường dẫn cài đặt và tiến trình](/zh-cn/stage-3/cross-platform/qt-industrial-hmi/images/image11.png) -->

# Chương 7: Lời kết

Chúc mừng! Bạn đã xây dựng một hệ thống HMI giám sát bơm cấp công nghiệp từ đầu. Tóm tắt:

1. Đã hiểu các khái niệm cốt lõi của máy tính trên, máy tính dưới và giao thức Modbus
2. Đã mô phỏng một "bơm ảo" với Modbus Slave, không cần phần cứng thực
3. Đã xây dựng truyền thông trên-dưới sử dụng Qt `QModbusTcpClient`
4. Đã vẽ biểu đồ xu hướng áp suất cuộn thời gian thực với Qt Charts
5. Đã triển khai cảnh báo vượt ngưỡng bật lên và nhật ký sự cố SQLite
6. Đã triển khai điều khiển khởi động/dừng bơm từ xa

Toàn bộ quá trình không sử dụng phần cứng công nghiệp thực, nhưng kiến trúc và chức năng phù hợp với hệ thống HMI nhà máy thực. Nếu bạn thay thế Modbus Slave bằng PLC thực, ứng dụng này có thể được sử dụng trong các kịch bản production trực tiếp.

**Hướng dẫn nâng cao:**

* **Giám sát đa thiết bị**: kết nối nhiều máy tính dưới và sử dụng tab/chia nhỏ cho dữ liệu thiết bị khác nhau
* **Phát lại lịch sử**: đọc dữ liệu lịch sử từ SQLite và phát lại biểu đồ xu hướng với điều khiển timeline
* **Giao thức OPC UA**: Modbus phù hợp kịch bản đơn giản hơn; hệ thống công nghiệp phức tạp thường sử dụng OPC UA, cũng được hỗ trợ bởi Qt (mô-đun Qt OPC UA)
* **Giám sát từ xa Web**: sử dụng Qt WebSocket để đẩy dữ liệu thời gian thực đến trình duyệt để xem trên thiết bị di động
* **Bảo trì dự đoán AI**: cung cấp dữ liệu áp suất lịch sử cho mô hình ML để dự đoán sự cố trước

***Sử dụng code để bảo vệ mọi thiết bị trong vận hành công nghiệp.***

# Tài liệu Tham khảo

* [Tài liệu Qt Serial Bus](https://doc.qt.io/qt-6/qtserialbus-index.html)
* [Ví dụ Qt Modbus TCP Client](https://doc.qt.io/qt-6/qtserialbus-modbus-client-example.html)
* [Tài liệu Qt Charts](https://doc.qt.io/qt-6/qtcharts-index.html)
* [Thông số Giao thức Modbus](https://modbus.org/specs.php)
* [Trình mô phỏng Modbus Slave](https://www.modbustools.com/modbus_slave.html)
* [Tài liệu Qt Installer Framework](https://doc.qt.io/qtinstallerframework/)

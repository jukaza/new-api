# Giám sát, Ghi nhật ký và Cảnh báo
> 💡 **Hướng dẫn học tập**: Chương này không yêu cầu nền tảng lập trình, thông qua các minh họa tương tác để giúp bạn hiểu toàn bộ hệ thống kiến thức về vận hành. Từ giám sát và cảnh báo đến khắc phục sự cố, từ lập kế hoạch dung lượng đến vận hành tự động, nắm vững toàn diện kỹ năng vận hành hệ thống trực tuyến.

## 0. Lời mở đầu: Đưa hệ thống lên production mới chỉ là bắt đầu

Nhiều người mới nghĩ rằng: "Triển khai code lên production là xong nhiệm vụ."

**Sai lầm lớn!**

Đưa hệ thống lên production chỉ là **điểm khởi đầu của công việc vận hành**. Cũng giống như mua một chiếc xe mới, việc bảo dưỡng, sửa chữa và đổ xăng sau đó mới là trạng thái bình thường.

Vận hành có ba mục tiêu:

1. **Tính ổn định (Stability)**: Hệ thống không bị sập, dịch vụ luôn khả dụng
2. **Hiệu năng (Performance)**: Phản hồi nhanh, trải nghiệm người dùng tốt
3. **Bảo mật (Security)**: Dữ liệu không bị rò rỉ, ngăn chặn tấn công

---

## 1. Hệ thống giám sát (Monitoring)

Giám sát là "đôi mắt" của vận hành. Một hệ thống không có giám sát giống như lái xe bịt mắt, có vấn đề cũng không biết.

### 1.1 Ba cấp độ giám sát

<MonitoringDashboardDemo />

**Giám sát cơ sở hạ tầng**: Tập trung vào tài nguyên phần cứng máy chủ

- Mức sử dụng CPU
- Mức sử dụng bộ nhớ
- Dung lượng ổ đĩa và I/O
- Băng thông mạng

**Giám sát ứng dụng**: Tập trung vào trạng thái chạy của phần mềm

- QPS (Số request mỗi giây)
- Thời gian phản hồi (Độ trễ)
- Tỷ lệ lỗi
- Tình trạng gọi dịch vụ phụ thuộc

**Giám sát nghiệp vụ**: Tập trung vào sức khỏe kinh doanh

- DAU/MAU (Người dùng hoạt động hàng ngày/hàng tháng)
- Số lượng đơn hàng
- Tỷ lệ thanh toán thành công
- Tỷ lệ giữ chân người dùng

### 1.2 Bộ công cụ giám sát

| Công cụ         | Mục đích             | Đặc điểm                              |
| :-------------- | :------------------- | :------------------------------------ |
| **Prometheus**  | Thu thập và lưu trữ chỉ số | Cơ sở dữ liệu chuỗi thời gian, phù hợp cho dữ liệu giám sát |
| **Grafana**     | Bảng điều khiển trực quan | Biểu đồ và dashboard mạnh mẽ          |
| **Zabbix**      | Giám sát tổng hợp    | Công cụ lâu đời, chức năng toàn diện  |
| **Datadog**     | Nền tảng giám sát SaaS | Giải pháp tất cả trong một, trả phí   |

**Điểm then chốt**: Giám sát phải phân tầng, bao phủ toàn diện từ cơ sở hạ tầng đến nghiệp vụ, tránh "điểm mù".

---

## 2. Hệ thống cảnh báo (Alerting)

Sau khi giám sát phát hiện vấn đề, cần thông báo kịp thời cho nhân viên vận hành, đây chính là **cảnh báo**.

### 2.1 Quy trình cảnh báo

<AlertFlowDemo />

### 2.2 Thiết kế cấp độ cảnh báo

Phân cấp cảnh báo hợp lý giúp tránh "mệt mỏi cảnh báo":

| Cấp độ | Thời gian phản hồi       | Tình huống điển hình                      | Kênh thông báo               |
| :----- | :----------------------- | :---------------------------------------- | :--------------------------- |
| **P0** | Ngay lập tức (trong 5 phút) | Dịch vụ cốt lõi bị sập, thanh toán thất bại | Điện thoại + SMS + DingTalk |
| **P1** | Trong 30 phút            | Một số chức năng bất thường, hiệu năng giảm nghiêm trọng | SMS + DingTalk + Email      |
| **P2** | Xử lý trong ngày         | Mức sử dụng tài nguyên cao, lỗi ngẫu nhiên | DingTalk + Email            |
| **P3** | Xử lý trong tuần         | Vấn đề không cốt lõi, đề xuất tối ưu       | Email                        |

### 2.3 Hội tụ và giảm nhiễu cảnh báo

**Vấn đề nhức nhối**: Một vấn đề nhỏ có thể kích hoạt hàng trăm đến hàng nghìn cảnh báo, khiến nhân viên trực trở nên tê liệt.

**Giải pháp**:

1. **Nhóm cảnh báo**: Gộp các cảnh báo tương tự (ví dụ: nhiều vấn đề trên cùng một máy chủ được gộp thành một)
2. **Ức chế cảnh báo**: Nếu vấn đề cha đã được kích hoạt, vấn đề con không lặp lại cảnh báo
3. **Quy tắc tắt tiếng**: Tự động tạm dừng cảnh báo trong thời gian bảo trì
4. **Giới hạn tần suất**: Cùng một cảnh báo không thông báo lặp lại trong thời gian ngắn

**Điểm then chốt**: Cảnh báo phải "ít mà chất", mỗi cảnh báo đều đáng để xử lý.

---

## 3. Quản lý nhật ký (Logging)

Nhật ký là "hộp đen" để điều tra vấn đề.

### 3.1 Phân cấp nhật ký

```javascript
console.debug('Thông tin debug chi tiết') // Sử dụng khi phát triển
console.info('Thông tin chung') // Ghi lại luồng hoạt động bình thường
console.warn('Thông tin cảnh báo') // Vấn đề tiềm ẩn
console.error('Thông tin lỗi') // Lỗi cần chú ý
```

### 3.2 Nhật ký có cấu trúc

Nhật ký truyền thống (không tốt):

```
2024-01-15 10:23:45 ERROR User john failed to login, attempts=3, ip=192.168.1.100
```

Nhật ký có cấu trúc (khuyến nghị):

```json
{
  "timestamp": "2024-01-15T10:23:45Z",
  "level": "ERROR",
  "message": "User login failed",
  "user": "john",
  "attempts": 3,
  "ip": "192.168.1.100",
  "service": "auth-service"
}
```

### 3.3 ELK Stack nhật ký

**ELK = Elasticsearch + Logstash + Kibana**

- **Logstash**: Thu thập và lọc nhật ký
- **Elasticsearch**: Lưu trữ và tìm kiếm nhật ký
- **Kibana**: Truy vấn trực quan nhật ký

**Thực tiễn tốt nhất**:

- ✅ Thông tin nhạy cảm (mật khẩu, token) không được ghi vào nhật ký
- ✅ Thao tác quan trọng (đăng nhập, thanh toán, thay đổi quyền) phải được ghi lại
- ✅ Nhật ký phải bao gồm ngữ cảnh (ID người dùng, ID request, timestamp)
- ✅ Định kỳ dọn dẹp nhật ký hết hạn, tránh đầy ổ đĩa

---

## 4. Theo dõi liên kết (Tracing)

Trong kiến trúc microservice, một request có thể đi qua hàng chục service, làm thế nào để theo dõi đường dẫn đầy đủ của nó?

**Trace ID và Span ID**

- **Trace ID**: Định danh duy nhất của toàn bộ chuỗi request (giống như mã vận đơn)
- **Span ID**: Định danh của một lần gọi service đơn lẻ (giống như mỗi trạm trung chuyển)

### 4.1 Minh họa theo dõi phân tán

<TraceVisualizationDemo />

### 4.2 Tiêu chuẩn OpenTelemetry

OpenTelemetry (OTel) là **tiêu chuẩn ngành** cho theo dõi liên kết, cung cấp API và SDK thống nhất.

```javascript
// Ví dụ: Sử dụng OpenTelemetry để ghi lại Span
import { trace } from '@opentelemetry/api'

const tracer = trace.getTracer('my-service')

async function processOrder(orderId) {
  // Tạo một Span
  const span = tracer.startSpan('processOrder')

  try {
    // Đặt thuộc tính
    span.setAttribute('order.id', orderId)

    // Logic nghiệp vụ...
    await validateOrder(orderId)
    await saveToDatabase(orderId)

    span.setStatus({ code: SpanStatusCode.OK })
  } catch (error) {
    span.recordException(error)
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message })
  } finally {
    span.end() // Kết thúc Span
  }
}
```

**Điểm then chốt**: Theo dõi liên kết giúp nhanh chóng xác định điểm nghẽn hiệu năng và điểm lỗi, là công cụ thiết yếu cho microservice.

---

## 5. Quy trình khắc phục sự cố

Sự cố trực tuyến là không thể tránh khỏi, điều quan trọng là **phản hồi nhanh, khôi phục nhanh**.

### 5.1 Quy trình xử lý sự cố

<IncidentResponseDemo />

### 5.2 Công cụ điều tra thường dùng

| Công cụ       | Mục đích             | Tình huống điển hình                          |
| :------------ | :------------------- | :-------------------------------------------- |
| **tcpdump**   | Phân tích bắt gói tin | Mạng không thông, mất gói dữ liệu             |
| **strace**    | Theo dõi system call | Tiến trình bị treo, vấn đề quyền file          |
| **Arthas**    | Chẩn đoán Java       | CPU tăng cao, rò rỉ bộ nhớ, deadlock          |
| **top/htop**  | Giám sát tài nguyên hệ thống | CPU/Bộ nhớ chiếm dụng cao              |
| **netstat**   | Xem kết nối mạng     | Cổng bị chiếm, số lượng kết nối bất thường     |
| **lsof**      | Xem file đang mở     | File bị chiếm, ổ đĩa đầy                      |

**Ví dụ Arthas** (công cụ chẩn đoán Java mã nguồn mở của Alibaba):

```bash
# Xem 5 thread chiếm CPU cao nhất
$ top -H -p 12345

# Xem thời gian gọi của một phương thức
$ trace com.example.OrderService createOrder

# Xem trường tĩnh của lớp
$ getstatic com.example.Config MAX_CONNECTIONS

# Hot deploy code (không cần khởi động lại)
$ mc /tmp/Test.java
$ redefine /tmp/Test.class
```

### 5.3 Tổng kết sau sự cố (Post-mortem)

**Tổng kết sau sự cố không phải là cuộc họp truy cứu trách nhiệm!**

Mục đích của tổng kết sau sự cố là:

1. Sắp xếp dòng thời gian sự cố
2. Tìm ra nguyên nhân gốc rễ (Root Cause Analysis)
3. Tổng kết bài học kinh nghiệm
4. Xây dựng biện pháp cải tiến

**Phương pháp phân tích 5 Why**:

Hỏi "tại sao" ít nhất 5 lần để tìm ra nguyên nhân gốc rễ:

- Tại sao dịch vụ bị sập?
  - Vì tràn bộ nhớ
- Tại sao tràn bộ nhớ?
  - Vì dữ liệu cache quá nhiều
- Tại sao dữ liệu cache quá nhiều?
  - Vì không đặt thời gian hết hạn
- Tại sao không đặt thời gian hết hạn?
  - Vì đã bỏ sót khi phát triển
- **Nguyên nhân gốc rễ**: Thiếu code review và test case

**Điểm then chốt**: Xây dựng văn hóa blameless, tập trung vào cải tiến quy trình thay vì trách nhiệm cá nhân.

---

## 6. Tối ưu hiệu năng

### 6.1 Phân tích điểm nghẽn hiệu năng

**Tư duy tối ưu từ trên xuống dưới**:

```
Người dùng cảm nhận
  ↓
Tối ưu frontend (giảm request, CDN, lazy loading)
  ↓
Tối ưu mạng (HTTP/2, nén, kết nối dài)
  ↓
Tối ưu backend (cache, bất đồng bộ, xử lý hàng loạt)
  ↓
Tối ưu cơ sở dữ liệu (chỉ mục, tối ưu truy vấn, sharding)
  ↓
Tối ưu hệ thống (tham số kernel, JVM tuning)
```

### 6.2 Tối ưu cơ sở dữ liệu

**Tối ưu chỉ mục**:

```sql
-- Truy vấn chậm (không có chỉ mục)
SELECT * FROM orders WHERE user_id = 12345;

-- Sau khi tạo chỉ mục, nhanh hơn 100 lần
CREATE INDEX idx_user_id ON orders(user_id);
```

**Tối ưu truy vấn**:

```sql
-- ❌ Tránh SELECT *
SELECT * FROM users WHERE id = 123;

-- ✅ Chỉ truy vấn các trường cần thiết
SELECT id, name, email FROM users WHERE id = 123;

-- ❌ Tránh IN clause quá nhiều
SELECT * FROM orders WHERE user_id IN (1, 2, 3, ..., 10000);

-- ✅ Sử dụng JOIN hoặc truy vấn hàng loạt
SELECT * FROM orders o JOIN user_ids u ON o.user_id = u.id;
```

### 6.3 Tối ưu cache

**Kiến trúc cache đa cấp**:

```
Cache trình duyệt (CDN)
  ↓
Cache cục bộ (Bộ nhớ/Guava)
  ↓
Cache phân tán (Redis/Memcached)
  ↓
Cơ sở dữ liệu (MySQL/PostgreSQL)
```

**Chiến lược cập nhật cache**:

| Chiến lược         | Ưu điểm           | Nhược điểm         | Tình huống phù hợp                    |
| :----------------- | :---------------- | :----------------- | :------------------------------------ |
| **Cache-Aside**    | Đơn giản, đáng tin cậy | Truy vấn đầu tiên chậm | Đọc nhiều ghi ít                  |
| **Write-Through**  | Tính nhất quán dữ liệu tốt | Ghi chậm       | Đọc ghi cân bằng                      |
| **Write-Behind**   | Ghi cực nhanh     | Có thể mất dữ liệu | Ghi nhiều đọc ít, chấp nhận không nhất quán tạm thời |

**Điểm then chốt**: Cache không phải là viên đạn bạc, cần xem xét các vấn đề như tính nhất quán, avalanche, penetration (tham khảo chương "Thiết kế cache hệ thống").

---

## 7. Lập kế hoạch dung lượng

### 7.1 Đánh giá dung lượng

<CapacityPlanningDemo />

### 7.2 Kiểm tra áp lực (Stress Testing)

**Lựa chọn công cụ**:

| Công cụ     | Đặc điểm                       | Tình huống phù hợp     |
| :---------- | :----------------------------- | :--------------------- |
| **JMeter**  | Chức năng mạnh, trực quan hóa  | Kiểm tra áp lực HTTP API |
| **wrk/ab**  | Nhẹ, dòng lệnh                 | Benchmark nhanh        |
| **Locust**  | Python script, phân tán        | Kiểm tra áp lực tình huống phức tạp |
| **K6**      | Hiện đại, JS script            | Tích hợp CI/CD         |

**Ví dụ wrk**:

```bash
# Cài đặt wrk
$ brew install wrk  # macOS
$ apt install wrk   # Ubuntu

# Kiểm tra áp lực HTTP API (10 thread, chạy 30 giây)
$ wrk -t10 -c100 -d30s http://example.com/api/users

# Đầu ra:
# Running 30s test @ http://example.com/api/users
#   10 threads and 100 connections
#   Thread Stats   Avg      Stdev     Max   +/- Stdev
#     Latency    45.32ms   12.45ms 120.50ms   87.56%
#     Req/Sec     2.12k   123.45    3.45k    89.01%
#   632450 requests in 30.00s, 1.23GB read
# Requests/sec:  21081.67
```

### 7.3 Tự động mở rộng và thu hẹp linh hoạt

**Tự động mở rộng trong thời đại cloud native**:

```yaml
# Kubernetes HPA (Horizontal Pod Autoscaler)
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

**Khi mức sử dụng CPU vượt quá 70%, tự động mở rộng Pod (tối đa 10 pod)**

**Điểm then chốt**: Kết hợp với dự đoán nghiệp vụ (như Double 11) để mở rộng trước, tránh không kịp.

---

## 8. Vận hành bảo mật

### 8.1 Kiểm soát truy cập

**Nguyên tắc quyền tối thiểu**:

- Nhà phát triển chỉ được truy cập môi trường phát triển
- Nhân viên vận hành chỉ được truy cập môi trường production và cần phê duyệt
- Thao tác nhạy cảm với cơ sở dữ liệu cần xác nhận lần hai

**Máy chủ bastion (Jump Server)**:

Tất cả thao tác vận hành được thực hiện qua máy chủ bastion, ghi lại nhật ký thao tác đầy đủ.

### 8.2 Sao lưu dữ liệu

**Nguyên tắc sao lưu 3-2-1**:

- **3** bản sao dữ liệu (1 bản gốc + 2 bản sao lưu)
- **2** loại phương tiện lưu trữ khác nhau (ổ đĩa cục bộ + lưu trữ đám mây)
- **1** bản sao lưu ngoại vi (phòng chống thảm họa đơn điểm)

**Chiến lược sao lưu**:

| Loại              | Tần suất | Thời gian giữ | RTO     | RPO      |
| :---------------- | :------- | :------------ | :------ | :------- |
| **Sao lưu toàn phần** | Hàng tuần | 1 tháng      | 4 giờ   | 24 giờ   |
| **Sao lưu tăng dần**  | Hàng ngày | 1 tuần       | 2 giờ   | 1 giờ    |
| **Sao lưu thời gian thực** | Theo giây | 7 ngày   | Vài phút | Vài giây |

**RTO (Recovery Time Objective)**: Mục tiêu thời gian khôi phục (dịch vụ bị gián đoạn tối đa bao lâu)
**RPO (Recovery Point Objective)**: Mục tiêu điểm khôi phục (mất tối đa bao nhiêu dữ liệu)

### 8.3 Quét lỗ hổng

**Quét định kỳ**:

- **Quét mã nguồn**: SonarQube, ESLint (phát hiện lỗ hổng tiềm ẩn)
- **Quét phụ thuộc**: npm audit, Snyk (phát hiện lỗ hổng thư viện bên thứ ba)
- **Quét container**: Trivy, Clair (phát hiện lỗ hổng image)

```bash
# Ví dụ npm audit
$ npm audit

found 3 vulnerabilities (1 moderate, 2 high)

Package         Severity  Vulnerable versions
lodash          high      <4.17.21
express         moderate  4.0.0 - 4.18.2

# Tự động sửa
$ npm audit fix
```

---

## 9. Vận hành tự động (DevOps)

### 9.1 CI/CD Pipeline

```yaml
# Ví dụ .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  script:
    - npm install
    - npm test
  tags:
    - docker

build:
  stage: build
  script:
    - docker build -t myapp:$CI_COMMIT_SHA .
    - docker push registry.example.com/myapp:$CI_COMMIT_SHA
  only:
    - main

deploy:
  stage: deploy
  script:
    - kubectl set image deployment/myapp myapp=registry.example.com/myapp:$CI_COMMIT_SHA
  environment:
    name: production
  when: manual # Kích hoạt triển khai thủ công
```

### 9.2 Cơ sở hạ tầng dưới dạng mã (IaC)

**Ví dụ Terraform** (quản lý tài nguyên đám mây):

```hcl
# main.tf
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name = "WebServer"
    Env  = "production"
  }
}

resource "aws_security_group" "web" {
  name = "web-sg"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

**Ưu điểm**:

- ✅ Quản lý phiên bản: Tất cả cấu hình trong Git
- ✅ Có thể lặp lại: Tính nhất quán giữa các môi trường
- ✅ Có thể kiểm toán: Lịch sử thay đổi rõ ràng
- ✅ Có thể rollback: Nhanh chóng khôi phục về phiên bản trước

### 9.3 Thực hành GitOps

**GitOps = Git + IaC + Automation**

Ý tưởng cốt lõi: **Kho Git là nguồn chân lý duy nhất của cơ sở hạ tầng**

Quy trình làm việc:

```
1. Sửa file cấu hình (push lên Git)
   ↓
2. Thay đổi kho Git kích hoạt CI/CD
   ↓
3. Tự động thực thi terraform apply/kubectl apply
   ↓
4. Cơ sở hạ tầng tự động cập nhật
   ↓
5. Giám sát đối chiếu trạng thái thực tế với trạng thái mong đợi
```

**Công cụ**: ArgoCD, Flux (triển khai Kubernetes)

---

## 10. Tổng kết và thực tiễn tốt nhất

Vận hành là một hệ thống rộng lớn, nhưng cốt lõi có thể tóm tắt như sau:

### 10.1 Mô hình trưởng thành vận hành

| Cấp độ      | Đặc điểm                        | Thực hành                                     |
| :---------- | :------------------------------ | :-------------------------------------------- |
| **Sơ cấp**  | Phản ứng thụ động, thao tác thủ công | Có vấn đề mới xử lý, triển khai thủ công  |
| **Trung cấp** | Tự động hóa, tiêu chuẩn hóa  | CI/CD, giám sát cảnh báo, tài liệu hóa        |
| **Cao cấp** | Phòng ngừa là chính, tự phục hồi | Lập kế hoạch dung lượng, diễn tập sự cố, tự động mở rộng |
| **Chuyên gia** | Thông minh hóa, không cần giám sát | AIOps, Chaos Engineering, Serverless     |

### 10.2 Một ngày của kỹ sư vận hành

```
09:00 - Xem cảnh báo ban đêm, xác nhận trạng thái hệ thống
10:00 - Xử lý vấn đề người dùng phản hồi
11:00 - Tham gia họp hàng tuần với đội phát triển, đánh giá rủi ro vận hành của giải pháp mới
14:00 - Tối ưu truy vấn chậm, nâng cao hiệu năng
15:00 - Code Review
16:00 - Viết tài liệu triển khai, cập nhật quy tắc giám sát
17:00 - Diễn tập sự cố (Chaos Engineering)
18:00 - Bàn giao ca trực
```

### 10.3 Lộ trình học tập

**Giai đoạn nhập môn** (1-3 tháng):

- Học các lệnh Linux thường dùng
- Hiểu hệ thống giám sát (Prometheus + Grafana)
- Nắm vững truy vấn nhật ký (ELK)

**Giai đoạn nâng cao** (3-6 tháng):

- Hiểu sâu về công nghệ container (Docker + K8s)
- Nắm vững một công cụ chẩn đoán (Arthas, tcpdump)
- Thực hành CI/CD pipeline

**Giai đoạn cao cấp** (6-12 tháng):

- Tinh chỉnh hiệu năng (cơ sở dữ liệu, JVM, mạng)
- Lập kế hoạch dung lượng và tối ưu chi phí
- Tổng kết sự cố và cải tiến quy trình

**Giai đoạn chuyên gia** (trên 1 năm):

- Thiết kế kiến trúc (tính sẵn sàng cao, khắc phục thảm họa)
- Chaos Engineering (chủ động tiêm lỗi)
- AIOps (vận hành thông minh)

---

## 11. Bảng tra cứu thuật ngữ (Glossary)

| Thuật ngữ       | Tên đầy đủ                         | Giải thích                                                    |
| :-------------- | :--------------------------------- | :------------------------------------------------------------ |
| **Monitoring**  | -                                  | Giám sát, quan sát trạng thái chạy của hệ thống theo thời gian thực. |
| **Alerting**    | -                                  | Cảnh báo, thông báo cho nhân viên liên quan khi có bất thường. |
| **Logging**     | -                                  | Nhật ký, ghi lại các sự kiện trong quá trình hệ thống chạy.   |
| **Tracing**     | -                                  | Theo dõi liên kết, theo dõi đường dẫn đầy đủ của request trong hệ thống phân tán. |
| **QPS**         | Queries Per Second                 | Số request mỗi giây, đo lường thông lượng hệ thống.           |
| **Latency**     | -                                  | Độ trễ, thời gian từ khi request được gửi đi đến khi nhận phản hồi. |
| **RTO**         | Recovery Time Objective            | Mục tiêu thời gian khôi phục, dịch vụ bị gián đoạn tối đa bao lâu. |
| **RPO**         | Recovery Point Objective           | Mục tiêu điểm khôi phục, mất tối đa bao nhiêu dữ liệu.       |
| **Post-mortem** | -                                  | Tổng kết sau sự cố, phân tích nguyên nhân sự cố và biện pháp cải tiến. |
| **CI/CD**       | Continuous Integration/Delivery    | Tích hợp liên tục và phân phối liên tục, tự động hóa kiểm thử và triển khai. |
| **IaC**         | Infrastructure as Code             | Cơ sở hạ tầng dưới dạng mã, quản lý máy chủ, mạng và các tài nguyên khác bằng code. |
| **GitOps**      | -                                  | Vận hành Git, kho Git là nguồn chân lý duy nhất của cơ sở hạ tầng. |
| **ELK**         | Elasticsearch + Logstash + Kibana  | Bộ ba thu thập, lưu trữ và trực quan hóa nhật ký.            |
| **SLA**         | Service Level Agreement            | Thỏa thuận cấp độ dịch vụ, cam kết về tính khả dụng của dịch vụ (ví dụ: 99.9%). |
| **Blameless**   | -                                  | Văn hóa không đổ lỗi, tổng kết sau sự cố tập trung vào cải tiến quy trình thay vì trách nhiệm cá nhân. |

---

## 12. Đọc thêm

- **[Thiết kế cache hệ thống](/vi-vn/appendix/4-server-and-backend/caching)** - Nguyên lý, mẫu hình và thực tiễn tốt nhất về cache
- **[Thiết kế message queue](/vi-vn/appendix/4-server-and-backend/message-queues)** - Cắt đỉnh lấp thung lũng, bất đồng bộ giải ghép
- **[Nguyên lý và thực hành xác thực](/vi-vn/appendix/4-server-and-backend/auth-authorization)** - Xác thực ủy quyền, tăng cường bảo mật
- **[Lịch sử tiến hóa backend](/vi-vn/appendix/4-server-and-backend/backend-layered-architecture)** - Từ monolithic đến microservice đến Serverless
- **[Triển khai và đưa lên production](/vi-vn/appendix/7-infrastructure-and-operations/ci-cd)** - Chặng cuối từ phát triển đến production
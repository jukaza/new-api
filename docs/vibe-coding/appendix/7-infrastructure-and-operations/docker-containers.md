# Container hóa Docker

::: tip Lời nói đầu
**"Chạy được trên máy tôi" là lời bào điển kinh điển nhất của lập trình viên, và Docker khiến lời bào chữa này biến mất hoàn toàn.** Công nghệ container đóng gói ứng dụng cùng tất cả các phụ thuộc thành một đơn vị tiêu chuẩn hóa, đảm bảo chạy nhất quán trên mọi môi trường. Đây là nền tảng của phân phối phần mềm hiện đại.
:::

**Bài viết này sẽ giúp bạn học được gì?**

Sau khi học xong chương này, bạn sẽ có được:

- **Khái niệm cốt lõi**: hiểu ba khái niệm nền tảng: image, container, registry
- **So sánh kiến trúc**: hiểu sự khác biệt bản chất giữa container và máy ảo
- **Kỹ năng thực hành**: nắm vững cách viết Dockerfile và các lệnh thường dùng
- **Cơ sở编排**: học cách quản lý ứng dụng đa dịch vụ với Docker Compose
- **Thực hành tốt nhất**: biết tối ưu image, tăng cường bảo mật và các thực hành cấp sản xuất

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Tại sao cần container | Nhất quán môi trường, hiệu quả tài nguyên, phân phối tiêu chuẩn hóa |
| **Chương 2** | Khái niệm cốt lõi | Image, container, registry, Dockerfile |
| **Chương 3** | Vòng đời Docker | Viết, build, push, chạy, quản lý |
| **Chương 4** | Docker Compose | Orchestration đa dịch vụ, mạng, volume dữ liệu |
| **Chương 5** | Thực hành tốt nhất | Tối ưu image, bảo mật, build đa giai đoạn |

---

## 1. Tại sao cần container?

Trước khi container xuất hiện, việc triển khai ứng dụng cần cài đặt thủ công runtime, cấu hình biến môi trường, xử lý xung đột phụ thuộc trên máy chủ. Sự khác biệt giữa các môi trường (phát triển, kiểm thử, sản xuất) là mảnh đất màu mỡ cho bug.

<DockerArchitectureDemo />

### Container giải quyết vấn đề gì?

| Vấn đề | Cách truyền thống | Cách dùng container |
|------|---------|---------|
| Môi trường không nhất quán | "Chạy được trên máy tôi" | Đóng gói tất cả phụ thuộc, nhất quán mọi nơi |
| Xung đột phụ thuộc | App A cần Node 14, App B cần Node 18 | Mỗi container có môi trường riêng |
| Lãng phí tài nguyên | Mỗi VM cần một hệ điều hành đầy đủ | Chia sẻ kernel, chi phí ở mức MB |
| Triển khai chậm | Cài đặt và cấu hình thủ công | Một lệnh `docker run` |
| Khó mở rộng | Tạo VM mới, cài môi trường, triển khai | Khởi động container mới trong vài giây |

::: tip Bản chất của container
Container không phải là máy ảo nhẹ. Bản chất của nó là **một tiến trình bị cách ly**. Kernel Linux thực hiện container thông qua hai cơ chế:
- **Namespace**: cách ly tầm nhìn của tiến trình (PID, mạng, hệ thống tệp, v.v.)
- **Cgroups**: giới hạn sử dụng tài nguyên của tiến trình (CPU, bộ nhớ, IO)

Tiến trình trong container về bản chất không khác gì tiến trình bình thường trên máy chủ, chỉ là bị "nhốt trong một căn phòng không nhìn thấy bên ngoài".
:::

---

## 2. Khái niệm cốt lõi

Thế giới Docker xoay quanh ba khái niệm nền tảng: Image (Ảnh镜像), Container (容器), và Registry (Kho).

| Khái niệm | So sánh | Mô tả |
|------|------|------|
| Image | Lớp / Mẫu | Mẫu chỉ đọc, chứa mã, runtime, thư viện, cấu hình |
| Container | Thể hiện / Đối tượng | Thể hiện đang chạy của image, có thể đọc ghi, có vòng đời độc lập |
| Registry | Cửa hàng ứng dụng | Dịch vụ lưu trữ và phân phối image (Docker Hub, ACR, ECR) |
| Dockerfile | Công thức / Bản thiết kế | Tệp văn bản định nghĩa cách build image |
| Volume | Ổ cứng ngoài | Dữ liệu bền vững, khi xóa container dữ liệu không mất |

### Cấu trúc phân tầng của image

Image Docker được tạo thành từ nhiều tầng chỉ đọc (Layer), mỗi chỉ thị trong Dockerfile tạo ra một tầng:

```
┌─────────────────────────┐
│  CMD ["node", "app.js"] │  ← Tầng lệnh khởi động
├─────────────────────────┤
│  COPY . /app            │  ← Tầng mã ứng dụng (thường thay đổi)
├─────────────────────────┤
│  RUN npm install        │  ← Tầng cài đặt phụ thuộc (thỉnh thoảng thay đổi)
├─────────────────────────┤
│  FROM node:18-alpine    │  ← Tầng image cơ sở (hiếm khi thay đổi)
└─────────────────────────┘
```

::: tip Tại sao phân tầng quan trọng?
Docker lưu đệm mỗi tầng. Nếu một tầng không thay đổi, build sẽ tái sử dụng đệm. Vì vậy trong Dockerfile nên đặt **các chỉ thị ít thay đổi ở phía trước** (như cài đặt phụ thuộc), **các chỉ thị hay thay đổi ở phía sau** (như sao chép mã). Như vậy hầu hết các lần build sẽ trúng đệm, tốc độ nhanh hơn nhiều.
:::

---

## 3. Vòng đời Docker

Từ viết Dockerfile đến chạy container, quy trình làm việc của Docker là một đường dây sản xuất rõ ràng.

<DockerLifecycleDemo />

### Tra cứu nhanh các chỉ thị Dockerfile

| Chỉ thị | Tác dụng | Ví dụ |
|------|------|------|
| `FROM` | Chỉ định image cơ sở | `FROM node:18-alpine` |
| `WORKDIR` | Thiết lập thư mục làm việc | `WORKDIR /app` |
| `COPY` | Sao chép tệp vào image | `COPY package.json ./` |
| `RUN` | Thực thi lệnh khi build | `RUN npm install` |
| `ENV` | Thiết lập biến môi trường | `ENV NODE_ENV=production` |
| `EXPOSE` | Khai báo cổng (chỉ dùng tài liệu) | `EXPOSE 3000` |
| `CMD` | Lệnh khởi động container | `CMD ["node", "app.js"]` |
| `ENTRYPOINT` | Điểm vào container (khó ghi đè) | `ENTRYPOINT ["nginx"]` |

---

## 4. Docker Compose: Orchestration đa dịch vụ

Dự án thực tế thường không chỉ có một container. Một ứng dụng web có thể cần: máy chủ ứng dụng + cơ sở dữ liệu + Redis + Nginx. Docker Compose định nghĩa và quản lý nhiều container bằng một tệp YAML.

### Ví dụ docker-compose.yml

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=db
      - REDIS_HOST=redis
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=secret

  redis:
    image: redis:7-alpine

volumes:
  db-data:
```

### Các khái niệm cốt lõi của Compose

| Khái niệm | Mô tả | Ví dụ |
|------|------|------|
| services | Định nghĩa các dịch vụ container | app, db, redis |
| volumes | Volume dữ liệu bền vững | db-data lưu tệp cơ sở dữ liệu |
| networks | Mạng tùy chỉnh (tự động tạo mặc định) | Các dịch vụ truy cập lẫn nhau qua tên dịch vụ |
| depends_on | Phụ thuộc thứ tự khởi động | app phụ thuộc db và redis |
| environment | Biến môi trường | Mật khẩu cơ sở dữ liệu, địa chỉ kết nối |

::: tip Khám phá dịch vụ
Trong Docker Compose, tên dịch vụ chính là tên máy chủ. Container app có thể truy cập trực tiếp cơ sở dữ liệu bằng `db:5432` và Redis bằng `redis:6379`, không cần biết địa chỉ IP. Đây là nhờ DNS tích hợp của Docker.
:::

---

## 5. Thực hành tốt nhất

### 5.1 Build đa giai đoạn (Multi-stage Build)

Build đa giai đoạn là công cụ mạnh mẽ để tối ưu kích thước image. Giai đoạn build cài đặt tất cả công cụ và phụ thuộc, giai đoạn cuối chỉ giữ lại các tệp cần thiết khi chạy.

```dockerfile
# Giai đoạn build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Giai đoạn chạy
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### 5.2 Danh sách tối ưu image

| Mục tối ưu | Cách làm | Hiệu quả |
|--------|------|------|
| Chọn image cơ sở nhỏ | Dùng `alpine` thay vì `ubuntu` | Image từ ~200MB giảm xuống ~50MB |
| Gộp chỉ thị RUN | Nối nhiều lệnh bằng `&&` | Giảm số tầng image |
| Dùng .dockerignore | Loại trừ node_modules, .git, v.v. | Tăng tốc build, giảm ngữ cảnh |
| Build đa giai đoạn | Tách môi trường build và chạy | Image cuối không chứa công cụ build |
| Cố định số phiên bản | `node:18.17-alpine` thay vì `node:latest` | Build có thể tái lập |

### 5.3 Thực hành bảo mật

| Thực hành | Mô tả |
|------|------|
| Không chạy bằng root | `USER node` chỉ định người dùng không phải root |
| Quét lỗ hổng | `docker scout` hoặc Trivy quét image |
| Quyền tối thiểu | Chỉ cài các gói cần thiết, không cài công cụ debug |
| Không hardcode bí mật | Dùng biến môi trường hoặc Docker Secrets |
| Cập nhật image cơ sở thường xuyên | Sửa lỗ hổng bảo mật kịp thời |

---

## Tóm tắt

Container hóa Docker là hạ tầng của phân phối phần mềm hiện đại, hiểu nó là cực kỳ quan trọng với mọi lập trình viên.

Ôn lại các điểm chính của chương này:

1. **Container vs máy ảo**: container chia sẻ kernel máy chủ, nhẹ hơn, nhanh hơn, nhưng cách ly hơi kém hơn VM
2. **Bộ ba cốt lõi**: image (mẫu), container (thể hiện), registry (phân phối)
3. **Dockerfile**: build phân tầng, tận dụng đệm, chỉ thị ít thay đổi đặt phía trước
4. **Docker Compose**: định nghĩa ứng dụng đa dịch vụ bằng YAML, tên dịch vụ chính là tên máy chủ
5. **Thực hành sản xuất**: build đa giai đoạn giảm kích thước, image cơ sở alpine, chạy bằng user không phải root

## Đọc thêm

- [Tài liệu chính thức Docker](https://docs.docker.com/) - Tài liệu tham khảo uy tín nhất
- [Docker Getting Started](https://docs.docker.com/get-started/) - Hướng dẫn入门 chính thức
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/) - Hướng dẫn thực hành tốt nhất chính thức
- [Tài liệu Docker Compose](https://docs.docker.com/compose/) - Tham khảo đầy đủ về Compose

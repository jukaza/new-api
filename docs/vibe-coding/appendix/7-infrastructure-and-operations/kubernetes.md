# Kubernetes

::: tip Lời mở đầu
**Docker giải quyết vấn đề "đóng gói", Kubernetes giải quyết vấn đề "quản lý".** Khi bạn có hàng chục đến hàng trăm container cần triển khai, mở rộng, thu hẹp, phục hồi sự cố, quản lý thủ công là không thực tế. Kubernetes (K8s) chính là "hệ điều hành" của container, tự động hóa việc triển khai, mở rộng và vận hành các ứng dụng đã được container hóa.
:::

**Bài viết này sẽ giúp bạn học được gì?**

Sau khi học xong chương này, bạn sẽ có được:

- **Hiểu kiến trúc**: Nắm vững thành phần của Control Plane và Worker Node trong K8s
- **Tài nguyên cốt lõi**: Quen thuộc với các khái niệm cốt lõi như Pod, Deployment, Service
- **Quản lý khai báo**: Hiểu tư tưởng "khai báo trạng thái mong muốn, hệ thống tự động hội tụ"
- **Khả năng vận hành**: Hiểu các cơ chế như rolling update, auto scaling, health check
- **Thực hành nhập môn**: Có thể sử dụng kubectl và YAML để triển khai một ứng dụng hoàn chỉnh

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Tại sao cần K8s | Thách thức của container orchestration |
| **Chương 2** | Kiến trúc K8s | Control Plane, Worker Node, etcd |
| **Chương 3** | Tài nguyên cốt lõi | Pod, Deployment, Service, Ingress |
| **Chương 4** | Quản lý khai báo | YAML, kubectl, Control Loop |
| **Chương 5** | Thực hành vận hành | Rolling Update, HPA, Health Check |

---

## 1. Tại sao cần Kubernetes?

Docker giúp việc đóng gói và chạy container đơn lẻ trở nên đơn giản, nhưng khi bạn đối mặt với các tình huống sau, quản lý thủ công trở nên bất lực:

| Thách thức | Mô tả | Giải pháp của K8s |
|------|------|---------------|
| Triển khai nhiều instance | Một dịch vụ cần chạy 10 bản sao | Deployment tự động quản lý số bản sao |
| Phục hồi sự cố | Container nào đó bị crash cần tự động khởi động lại | Controller tự động phát hiện và tạo lại Pod |
| Service Discovery | IP container thay đổi, làm sao tìm thấy nhau? | Service cung cấp DNS và IP ổn định |
| Rolling Update | Cập nhật phiên bản không được ngừng dịch vụ | Thay thế Pod cũ từ từ, không downtime |
| Elastic Scaling | Tự động mở rộng khi lưu lượng cao điểm | HPA tự động điều chỉnh số bản sao dựa trên CPU/bộ nhớ |
| Resource Scheduling | Đặt container vào máy phù hợp nhất | Scheduler lập lịch thông minh |

::: tip Tư tưởng cốt lõi của K8s: Declarative
Bạn không cần nói với K8s "khởi động 3 container" (imperative), mà nói với nó "tôi muốn 3 bản sao đang chạy" (declarative). K8s sẽ liên tục giám sát, đảm bảo trạng thái thực tế nhất quán với trạng thái mong muốn bạn đã khai báo. Nếu một Pod bị crash, nó sẽ tự động tạo Pod mới để bù vào.
:::

---

## 2. Kiến trúc Kubernetes

K8s cluster bao gồm Control Plane và Worker Node.

<K8sArchitectureDemo />

### Đường dẫn đầy đủ của một yêu cầu

```
User Request → Ingress Controller → Service → kube-proxy → Pod (Container)
                                              ↑
                                    Endpoint List (do Service duy trì)
```

---

## 3. Đối tượng tài nguyên cốt lõi

K8s mô tả trạng thái mong muốn của cluster thông qua các "đối tượng tài nguyên".

<K8sWorkloadsDemo />

### Phân loại đối tượng tài nguyên

| Loại | Tài nguyên | Mục đích |
|------|------|------|
| Workload | Pod, Deployment, StatefulSet, DaemonSet, Job | Chạy ứng dụng |
| Mạng | Service, Ingress, NetworkPolicy | Service discovery và quản lý lưu lượng |
| Cấu hình | ConfigMap, Secret | Quản lý cấu hình và dữ liệu nhạy cảm |
| Lưu trữ | PersistentVolume, PersistentVolumeClaim | Lưu trữ bền vững |
| Lập lịch | Node, Namespace, ResourceQuota | Cách ly và giới hạn tài nguyên |

---

## 4. Quản lý khai báo và kubectl

### Control Loop (Vòng lặp hội tụ)

Cơ chế hoạt động cốt lõi của K8s là control loop:

```
Quan sát (Observe) → So sánh (Diff) → Hành động (Act) → Quan sát...
     ↓                ↓              ↓
  Đọc trạng thái thực   So với trạng thái mong muốn    Thực hiện thao tác sửa chữa
```

Bạn khai báo `replicas: 3`, controller phát hiện chỉ có 2 Pod đang chạy, sẽ tạo thêm 1 Pod mới. Vòng lặp này thực hiện mỗi vài giây một lần, đảm bảo hệ thống luôn hội tụ về trạng thái mong muốn.

### Lệnh kubectl thường dùng

| Lệnh | Tác dụng | Ví dụ |
|------|------|------|
| `kubectl apply -f` | Áp dụng cấu hình YAML | `kubectl apply -f deployment.yaml` |
| `kubectl get` | Xem danh sách tài nguyên | `kubectl get pods -o wide` |
| `kubectl describe` | Xem chi tiết tài nguyên | `kubectl describe pod my-app-xxx` |
| `kubectl logs` | Xem log Pod | `kubectl logs -f my-app-xxx` |
| `kubectl exec` | Vào terminal Pod | `kubectl exec -it my-app-xxx -- sh` |
| `kubectl delete` | Xóa tài nguyên | `kubectl delete -f deployment.yaml` |
| `kubectl scale` | Mở rộng/thu hẹp thủ công | `kubectl scale deploy my-app --replicas=5` |

::: tip apply vs create
`kubectl create` là imperative — "tạo tài nguyên này", nếu đã tồn tại sẽ báo lỗi. `kubectl apply` là declarative — "đảm bảo tài nguyên ở trạng thái này", không tồn tại thì tạo, đã tồn tại thì cập nhật. Trong môi trường production nên luôn sử dụng `apply`.
:::

---

## 5. Thực hành vận hành

### 5.1 Rolling Update và Rollback

Deployment mặc định sử dụng chiến lược rolling update: từ từ tạo Pod phiên bản mới, đồng thời từ từ kết thúc Pod phiên bản cũ.

```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # Tối đa tạo thêm 1 Pod
      maxUnavailable: 0   # Không cho phép Pod nào không khả dụng
```

| Thao tác | Lệnh |
|------|------|
| Cập nhật image | `kubectl set image deploy/my-app app=my-app:2.0` |
| Xem trạng thái cập nhật | `kubectl rollout status deploy/my-app` |
| Xem lịch sử phiên bản | `kubectl rollout history deploy/my-app` |
| Rollback về phiên bản trước | `kubectl rollout undo deploy/my-app` |

### 5.2 Auto Scaling (HPA)

HPA (Horizontal Pod Autoscaler) tự động điều chỉnh số bản sao Pod dựa trên CPU, bộ nhớ hoặc chỉ số tùy chỉnh.

```yaml
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

### 5.3 Health Check (Probe)

K8s giám sát trạng thái sức khỏe của Pod thông qua ba loại probe:

| Probe | Tác dụng | Hậu quả khi thất bại |
|------|------|---------|
| livenessProbe | Kiểm tra container còn sống không | Khởi động lại container |
| readinessProbe | Kiểm tra container đã sẵn sàng chưa | Gỡ khỏi Service, không nhận lưu lượng |
| startupProbe | Kiểm tra container đã khởi động xong chưa | Trong thời gian khởi động không thực hiện probe khác |

::: tip Tầm quan trọng của probe
Không có cấu hình health check, K8s chỉ có thể dựa vào việc tiến trình có tồn tại hay không để xác định trạng thái sức khỏe. Nhưng nhiều khi tiến trình vẫn còn, dịch vụ đã không phản hồi (ví dụ deadlock, cận OOM). Cấu hình livenessProbe cho phép K8s tự động khởi động lại các container "chết giả" này.
:::

---

## Tổng kết

Kubernetes là tiêu chuẩn thực tế cho container orchestration, hiểu các khái niệm cốt lõi của nó là nền tảng cho phát triển cloud native.

Ôn tập các điểm chính của chương này:

1. **Quản lý khai báo**: Nói với K8s "tôi muốn gì", không phải "làm thế nào", control loop tự động hội tụ
2. **Phân tầng kiến trúc**: Control Plane chịu trách nhiệm quyết định, Worker Node chịu trách nhiệm thực thi, etcd lưu trạng thái
3. **Tài nguyên cốt lõi**: Pod (đơn vị nhỏ nhất), Deployment (quản lý bản sao), Service (service discovery), Ingress (cổng vào bên ngoài)
4. **Tự động hóa vận hành**: Rolling update không downtime, HPA elastic scaling, probe tự động phục hồi sự cố
5. **Tách biệt cấu hình**: ConfigMap và Secret giúp cấu hình tách rời khỏi image

## Đọc thêm

- [Kubernetes Official Documentation](https://kubernetes.io/docs/) - Tài liệu tham khảo chính thức
- [Kubernetes the Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way) - Tự tay dựng K8s cluster từ đầu
- [The Illustrated Children's Guide to Kubernetes](https://www.cncf.io/phippy/) - Hướng dẫn nhập môn thú vị từ CNCF
- [Kubernetes Patterns](https://www.oreilly.com/library/view/kubernetes-patterns-2nd/9781098131678/) - Design patterns cho K8s
# Kiến Trúc Phân Tầng Backend

> **Câu hỏi cốt lõi**: Code ngày càng lộn xộn, làm sao để tổ chức cho rõ ràng dễ hiểu?

Khi dự án mở rộng từ vài chục dòng code lên hàng chục nghìn dòng, từ một người phát triển sang nhiều người cộng tác, từ CRUD đơn giản đến logic nghiệp vụ phức tạp, cách tổ chức code quyết định trực tiếp sự sống còn của dự án. Kiến trúc phân tầng không phải để phô diễn kỹ thuật hay tuân theo giáo điều, mà để giải quyết một mâu thuẫn căn bản trong công nghệ phần mềm: **sự gia tăng tự nhiên của độ phức tạp nghiệp vụ** đối lập với **giới hạn nhận thức của con người**.

---

## 1. Tại Sao Cần Phân Tầng?

### 1.1 Gốc Rễ Của Vấn Đề

**Phiên bản ban đầu** (100 dòng code):
```java
@PostMapping("/register")
public Result register(@RequestBody User user) {
    // 1. Kiểm tra tên người dùng có trùng không
    if (userRepository.findByUsername(user.getUsername()) != null) {
        return Result.error("Tên người dùng đã tồn tại");
    }
    // 2. Mã hóa mật khẩu
    user.setPassword(encrypt(user.getPassword()));
    // 3. Lưu người dùng
    userRepository.save(user);
    // 4. Gửi email chào mừng
    emailService.sendWelcome(user.getEmail());
    // 5. Ghi log
    log.info("User registered: {}", user.getUsername());
    return Result.success();
}
```

**6 tháng sau** (500 dòng code):
- Thêm xác thực số điện thoại
- Thêm xác thực danh tính
- Thêm thưởng mời
- Thêm kiểm tra rủi ro
- ...

Lúc này phương thức đã có 500 dòng, mỗi lần sửa đều lo sợ, vì:
- Logic trộn lẫn vào nhau, sửa một chỗ có thể ảnh hưởng đến chức năng khác
- Khó kiểm thử, mỗi lần test đều phải mô phỏng request HTTP hoàn chỉnh
- Người mới không hiểu nổi, vì tất cả logic đều dồn vào một chỗ

**Bản chất của vấn đề**: Code không có "ranh giới", mọi trách nhiệm đều trộn lẫn vào nhau.

**Hiệu ứng tích lũy nợ kỹ thuật**:
- ❌ **Coupling cao**: Logic nghiệp vụ gắn chặt với truy cập dữ liệu và giao thức HTTP, sửa một chỗ động toàn thân
- ❌ **Cohesion thấp**: Một phương thức đảm nhận nhiều trách nhiệm, vi phạm nguyên tắc trách nhiệm đơn nhất
- ❌ **Khó kiểm thử**: Không thể kiểm thử độc lập logic nghiệp vụ, phải khởi động container HTTP hoàn chỉnh
- ❌ **Khó tái sử dụng**: Logic nghiệp vụ gắn với HTTP request, không thể tái sử dụng trong scheduled task hay message queue
- ❌ **Tải nhận thức**: Developer phải đồng thời hiểu chi tiết của tất cả các tầng, không thể tập trung

### 1.2 Tư Tưởng Cốt Lõi Của Phân Tầng

Kiến trúc phân tầng chính là vạch rõ ranh giới cho code:

```
┌─────────────────────────────────────┐
│  Nhận request ← Controller         │  Chỉ chịu trách nhiệm "nhận đơn"
├─────────────────────────────────────┤
│  Điều phối nghiệp vụ ← Service     │  Chỉ chịu trách nhiệm "nấu ăn"
├─────────────────────────────────────┤
│  Truy cập dữ liệu ← Repository     │  Chỉ chịu trách nhiệm "lấy nguyên liệu"
├─────────────────────────────────────┤
│  Định nghĩa nghiệp vụ ← Domain     │  Chỉ chịu trách nhiệm "tiêu chuẩn công thức"
└─────────────────────────────────────┘
```

**Nguyên tắc then chốt**:
- Mỗi tầng chỉ làm việc của mình
- Giao tiếp giữa các tầng qua interface rõ ràng
- Logic nghiệp vụ tập trung ở Service và Domain
- Logic truy cập dữ liệu tập trung ở Repository

**Giá trị kỹ thuật của kiến trúc phân tầng**:

1. **Giảm tải nhận thức**: Developer có thể tập trung vào trách nhiệm của tầng hiện tại, không cần hiểu toàn bộ chi tiết
2. **Cải thiện khả năng kiểm thử**: Mỗi tầng có thể unit test độc lập, chỉ cần Mock dependency
3. **Tăng cường khả năng bảo trì**: Khi thay đổi yêu cầu, phạm vi sửa đổi rõ ràng, giảm rủi ro
4. **Thúc đẩy tái sử dụng code**: Logic nghiệp vụ không phụ thuộc HTTP, có thể tái sử dụng trong scheduled task, message queue
5. **Hỗ trợ cộng tác nhóm**: Các developer khác nhau có thể phát triển song song các tầng khác nhau, giảm xung đột
6. **Kéo dài tuổi thọ code**: Ranh giới rõ ràng giúp code dễ tái cấu trúc và tiến hóa hơn

---

## 2. Chi Tiết Kiến Trúc Bốn Tầng

### 2.1 Cấu Trúc Tổng Thể

Bản chất của kiến trúc phân tầng là **phân tách mối quan tâm** (Separation of Concerns) và **kiểm soát hướng phụ thuộc**:

```
┌─────────────────────────────────────────────────────┐
│  Frontend Request                                    │
└────────────────────┬────────────────────────────────┘
                     │ HTTP Request
                     ▼
┌─────────────────────────────────────────────────────┐
│  Controller (Tầng Điều Khiển)                        │
│  - Nhận request, kiểm tra tham số                    │
│  - Chuyển đổi DTO                                    │
│  - Gọi Service                                       │
│  - Trả về response                                   │
└────────────────────┬────────────────────────────────┘
                     │ Gọi nghiệp vụ
                     ▼
┌─────────────────────────────────────────────────────┐
│  Service (Tầng Logic Nghiệp Vụ)                      │
│  - Điều phối logic nghiệp vụ                         │
│  - Quản lý transaction                               │
│  - Phối hợp nhiều Repository                         │
│  - Điều phối cross-module                            │
└────────────────────┬────────────────────────────────┘
                     │ Truy cập dữ liệu
                     ▼
┌─────────────────────────────────────────────────────┐
│  Repository (Tầng Truy Cập Dữ Liệu)                  │
│  - CRUD cơ sở dữ liệu                                │
│  - Đóng gói truy vấn                                 │
│  - ORM mapping                                       │
└────────────────────┬────────────────────────────────┘
                     │ Đối tượng domain
                     ▼
┌─────────────────────────────────────────────────────┐
│  Domain (Tầng Mô Hình Domain)                        │
│  - Entity                                            │
│  - Value Object                                      │
│  - Quy tắc nghiệp vụ                                 │
└─────────────────────────────────────────────────────┘
```

**Hướng phụ thuộc**: Phụ thuộc code phải hướng đến **ổn định hơn, trừu tượng hơn**
- Controller phụ thuộc vào Service interface (trừu tượng)
- Service phụ thuộc vào Repository interface (trừu tượng)
- Tất cả các tầng đều phụ thuộc vào Domain (lõi nghiệp vụ, ổn định nhất)
- **Không cho phép phụ thuộc ngược** (ví dụ Repository phụ thuộc Service)

<LayeredArchitectureDemo />

### 2.2 Tầng Controller

**Trách nhiệm**: "Lễ tân" của request

- Nhận HTTP request, phân tích tham số
- Kiểm tra tham số (định dạng, bắt buộc, v.v.)
- Chuyển đổi DTO (Request → Param)
- Gọi Service thực thi nghiệp vụ
- Chuyển đổi DTO (Result → Response)
- Trả về HTTP response

**Những việc không nên làm**:
- Viết trực tiếp logic nghiệp vụ
- Thao tác trực tiếp cơ sở dữ liệu
- Xử lý transaction

**Triết lý thiết kế**:
Controller là "bộ mặt" của hệ thống, đảm nhận vai trò adapter — chuyển đổi giao thức HTTP bên ngoài thành lời gọi nghiệp vụ nội bộ. Nó không nên chứa bất kỳ quyết định nghiệp vụ nào, vì quyết định nghiệp vụ là biểu hiện của tri thức domain, cần được tách rời khỏi giao thức truyền tải.

**Ví dụ**:
```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @PostMapping
    public UserResponse createUser(
            @RequestBody @Valid UserRequest request) {

        // 1. Request DTO → Param DTO
        UserParam param = UserParam.builder()
                .username(request.getUsername())
                .password(encrypt(request.getPassword()))
                .email(request.getEmail())
                .build();

        // 2. Gọi Service
        User user = userService.createUser(param);

        // 3. Entity → Response DTO
        return UserResponse.from(user);
    }
}
```

**Điểm then chốt**:
- Dùng `@Valid` để tự động kiểm tra tham số
- Dùng DTO để cách ly cấu trúc dữ liệu frontend và backend
- Chỉ làm "phiên dịch" và "điều phối", không chứa logic nghiệp vụ

<ControllerLayerDemo />

### 2.3 Tầng Service

**Trách nhiệm**: "Đầu bếp" của nghiệp vụ

- Triển khai logic nghiệp vụ cốt lõi
- Điều phối thao tác của nhiều Repository
- Quản lý ranh giới transaction
- Xử lý điều phối cross-module

**Những việc không nên làm**:
- Viết trực tiếp SQL (giao cho Repository)
- Xử lý những việc liên quan đến HTTP
- Trả về database entity cho Controller

**Triết lý thiết kế**:
Tầng Service là nơi chứa logic nghiệp vụ, cần giữ tính thuần khiết. Nó không phụ thuộc vào bất kỳ framework hay giao thức truyền tải nào, nhờ đó có thể:
- Unit test độc lập với tầng Web
- Tái sử dụng trong scheduled task, message queue consumer
- Tránh thay đổi công nghệ ảnh hưởng đến logic nghiệp vụ

**Ví dụ**:
```java
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public User createUser(UserParam param) {
        // 1. Quy tắc nghiệp vụ: kiểm tra tên người dùng có trùng không
        if (userRepository.existsByUsername(param.getUsername())) {
            throw new UserAlreadyExistsException();
        }

        // 2. Tạo user entity
        User user = new User();
        user.setUsername(param.getUsername());
        user.setPassword(param.getPassword());
        user.setEmail(param.getEmail());

        // 3. Lưu vào database
        userRepository.save(user);

        // 4. Gửi email chào mừng (điều phối cross-module)
        emailService.sendWelcomeEmail(user);

        return user;
    }
}
```

**Điểm then chốt**:
- Dùng Transactional đảm bảo tính nhất quán của transaction
- Ném business exception, để Controller xử lý thống nhất
- Không phụ thuộc vào khái niệm HTTP, có thể tái sử dụng

<ServiceLayerDemo />

### 2.4 Tầng Repository

**Trách nhiệm**: "Thủ kho" của dữ liệu

- Đóng gói tất cả logic truy cập dữ liệu
- Thực thi thao tác CRUD
- Xử lý ORM mapping
- Đóng gói điều kiện truy vấn

**Những việc không nên làm**:
- Viết logic nghiệp vụ
- Xử lý transaction (tầng Service quản lý)
- Phụ thuộc vào module tầng trên

**Triết lý thiết kế**:
Repository là tầng trừu tượng hóa truy cập dữ liệu, nó che giấu chi tiết của cơ sở dữ liệu bên dưới. Giá trị của sự trừu tượng này nằm ở:
- Khi chuyển đổi database chỉ cần sửa Repository implementation, logic nghiệp vụ không cần thay đổi
- Dễ dàng Mock để unit test
- Logic truy vấn được quản lý tập trung, tránh code trùng lặp

**Ví dụ**:
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Spring Data JPA tự động triển khai
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);

    // Truy vấn phức tạp tùy chỉnh
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.deleted = false")
    Optional<User> findActiveByEmail(@Param("email") String email);
}
```

**Điểm then chốt**:
- Repository là interface, không chứa logic nghiệp vụ
- Dùng tên phương thức để biểu đạt ý định truy vấn
- Có thể dùng Query để tùy chỉnh truy vấn phức tạp

<RepositoryLayerDemo />

### 2.5 Tầng Domain

**Trách nhiệm**: "Tiêu chuẩn công thức" của nghiệp vụ

- Định nghĩa entity nghiệp vụ (Entity)
- Định nghĩa value object (Value Object)
- Đóng gói quy tắc nghiệp vụ
- Làm dependency chung cho tất cả các tầng

**Đặc tính quan trọng**:
- Tầng Domain không phụ thuộc vào bất kỳ tầng nào khác
- Tất cả các tầng đều phụ thuộc vào tầng Domain
- Là nền tảng của kiến trúc phân tầng

**Triết lý thiết kế**:
Tầng Domain là lõi nghiệp vụ của toàn bộ hệ thống, nó biểu đạt tri thức domain và quy tắc nghiệp vụ. Tính thuần khiết của nó rất quan trọng:
- Không phụ thuộc framework nghĩa là logic nghiệp vụ không bị ràng buộc bởi công nghệ
- Tất cả các tầng đều phụ thuộc vào nó, đảm bảo tính thống nhất của quy tắc nghiệp vụ
- Dễ dàng tiến hóa lâu dài, công nghệ có thể thay thế, quy tắc nghiệp vụ tương đối ổn định

**Ví dụ**:
```java
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    // ✅ Phương thức nghiệp vụ: đóng gói quy tắc nghiệp vụ
    public boolean isPasswordCorrect(String rawPassword) {
        return BCrypt.checkpw(rawPassword, this.password);
    }

    public void changePassword(String oldPassword, String newPassword) {
        if (!isPasswordCorrect(oldPassword)) {
            throw new IncorrectPasswordException();
        }
        this.password = BCrypt.hashpw(newPassword);
    }
}
```

**Điểm then chốt**:
- Entity có định danh duy nhất
- Quy tắc nghiệp vụ được đóng gói trong đối tượng Domain
- Tầng Domain là logic nghiệp vụ thuần khiết, không phụ thuộc framework

<DomainModelDemo />

---

## 3. DTO: "Phiên Dịch Viên" Giữa Các Tầng

### 3.1 Tại Sao Cần DTO?

**Vấn đề**: Nếu trả trực tiếp database entity cho frontend:

```java
// ❌ Sai: trả trực tiếp Entity
@Entity
public class User {
    private Long id;
    private String username;
    private String password;        // Thông tin nhạy cảm!
    private Boolean isDeleted;      // Trường nội bộ!
}
```

Frontend sẽ nhận được những trường không nên tiết lộ, tồn tại rủi ro bảo mật.

**Giải pháp**: Dùng DTO làm "phiên dịch"

```
Database Entity → Service Param/Result → Controller Request/Response → Frontend
```

### 3.2 Các Loại DTO

| Loại | Mục đích | Ví dụ |
|------|------|------|
| Request DTO | Controller nhận tham số | UserCreateRequest |
| Response DTO | Controller trả về dữ liệu | UserResponse |
| Param DTO | Tham số phương thức Service | UserParam |
| Result DTO | Service trả về kết quả | UserResult |
| Entity | Ánh xạ database | User |

**Nguyên tắc then chốt**:
Mỗi tầng sử dụng DTO của riêng mình, không truyền trực tiếp Entity, DTO chỉ chứa các trường cần thiết, như vậy có thể tránh tiết lộ chi tiết triển khai nội bộ, đảm bảo tính độc lập của các tầng.

<DtoFlowDemo />

---

## 4. Hướng Phụ Thuộc: Quy Tắc Sắt Của Kiến Trúc Phân Tầng

### 4.1 Nguyên Tắc Đảo Ngược Phụ Thuộc

**Cách làm sai**:
```
Controller → UserServiceImpl → UserDaoImpl → UserEntity
```

**Cách làm đúng**:
```
Controller → UserService(interface) → UserRepository(interface) → UserEntity
```

**Hướng phụ thuộc**:

Hướng phụ thuộc đúng là tất cả các tầng đều phụ thuộc vào tầng trừu tượng hơn và ổn định hơn. Cụ thể, Controller phụ thuộc vào Service interface, Service phụ thuộc vào Repository interface, tất cả các tầng đều phụ thuộc vào tầng Domain, và tầng Domain không phụ thuộc vào bất kỳ tầng nào khác. Hướng phụ thuộc này đảm bảo tính độc lập và khả năng kiểm thử của logic nghiệp vụ.

Cách làm sai bao gồm Service phụ thuộc trực tiếp vào Repository implementation class, Controller thao tác trực tiếp database, hoặc tầng Domain phụ thuộc vào tầng khác, những điều này đều dẫn đến coupling tăng cao, giảm khả năng bảo trì của hệ thống.

### 4.2 Ví Dụ Code

```java
// ✅ Đúng: phụ thuộc vào interface
@Service
public class OrderService {
    private final OrderRepository orderRepository;  // interface
    private final PaymentService paymentService;    // interface
}

// ✅ Implementation class được Spring tự động inject
@Repository
public class OrderRepositoryImpl implements OrderRepository {
    // Chi tiết triển khai
}
```

<DependencyDirectionDemo />

---

## 5. Case Study Thực Tế: Hệ Thống Đơn Hàng Thương Mại Điện Tử

### 5.1 Yêu Cầu

Tạo đơn hàng:
1. Người dùng chọn sản phẩm
2. Kiểm tra tồn kho
3. Tính toán số tiền
4. Tạo đơn hàng
5. Trừ tồn kho

### 5.2 Triển Khai Code

**Tầng Domain**:
```java
@Entity
public class Order {
    @Id
    private Long id;
    private Long userId;
    private List<OrderItem> items;
    private Money totalAmount;
    private OrderStatus status;

    public void calculateTotal() {
        Money total = Money.zero();
        for (OrderItem item : items) {
            total = total.add(item.getSubTotal());
        }
        this.totalAmount = total;
    }

    public void cancel() {
        if (this.status != OrderStatus.PENDING_PAYMENT) {
            throw new IllegalStateException("Chỉ đơn hàng chờ thanh toán mới có thể hủy");
        }
        this.status = OrderStatus.CANCELLED;
    }
}
```

**Tầng Repository**:
```java
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
}
```

**Tầng Service**:
```java
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final InventoryService inventoryService;

    @Transactional
    public OrderDTO createOrder(OrderParam param) {
        // 1. Xác thực sản phẩm và trừ tồn kho
        for (OrderItemParam item : param.getItems()) {
            inventoryService.reserveStock(item.getProductId(), item.getQuantity());
        }

        // 2. Tạo đơn hàng
        Order order = new Order();
        order.setUserId(param.getUserId());
        order.calculateTotal();

        // 3. Lưu đơn hàng
        orderRepository.save(order);

        return OrderDTO.from(order);
    }
}
```

**Tầng Controller**:
```java
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public OrderResponse createOrder(@RequestBody @Valid OrderRequest request) {
        OrderParam param = OrderParam.builder()
                .userId(request.getUserId())
                .items(request.getItems())
                .build();

        OrderDTO order = orderService.createOrder(param);

        return OrderResponse.from(order);
    }
}
```

---

## 6. Câu Hỏi Thường Gặp

### 6.1 Controller Có Thể Viết Logic Nghiệp Vụ Không?

Controller không nên viết logic nghiệp vụ, nó chỉ chịu trách nhiệm nhận request và trả về response. Logic nghiệp vụ nên được đóng gói trong tầng Service, lợi ích của việc này là code có thể được tái sử dụng, ví dụ scheduled task hoặc message queue consumer có thể gọi trực tiếp Service mà không cần thông qua HTTP request. Đồng thời, logic nghiệp vụ tập trung ở một nơi, dễ kiểm thử và bảo trì hơn, tránh vấn đề không nhất quán do logic phân tán.

### 6.2 Mô Hình Thiếu Máu (Anemic Model) Và Mô Hình Giàu Máu (Rich Model) Là Gì?

Mô hình thiếu máu là entity class chỉ chứa thuộc tính và các phương thức getter/setter tương ứng, không chứa bất kỳ logic nghiệp vụ nào, tất cả quy tắc nghiệp vụ được triển khai trong tầng Service. Mô hình này có cấu trúc đơn giản, dễ hiểu, là cách tiếp cận được hầu hết các dự án áp dụng.

Mô hình giàu máu là entity class không chỉ chứa thuộc tính mà còn chứa các phương thức nghiệp vụ liên quan đến entity đó, đóng gói quy tắc nghiệp vụ bên trong entity. Cách này phù hợp hơn với tư tưởng thiết kế hướng đối tượng, để dữ liệu và hành vi ở cùng một chỗ, cải thiện tính cohesion của code.

Khuyến nghị chọn mô hình phù hợp dựa trên nền tảng kỹ thuật của nhóm và độ phức tạp của dự án, nhưng dù chọn loại nào, cũng nên giữ tính nhất quán, và tầng Domain ít nhất nên chứa các phương thức hành vi nghiệp vụ cơ bản, thay vì hoàn toàn là một cái vỏ rỗng.

### 6.3 Xử Lý Transaction Xuyên Nhiều Service Như Thế Nào?

Khi một thao tác nghiệp vụ cần xuyên qua nhiều Service, nên sử dụng transaction annotation trong Service tầng trên, trong phương thức này lần lượt gọi nhiều Service tầng dưới. Như vậy có thể đảm bảo tất cả thao tác thực thi trong cùng một transaction context, hoặc tất cả thành công hoặc tất cả thất bại, đảm bảo tính nhất quán của dữ liệu. Cần lưu ý rằng ranh giới transaction nên càng nhỏ càng tốt, chỉ chứa các thao tác cần thiết, tránh giữ lock database quá lâu ảnh hưởng đến hiệu năng concurrent.

---

## 7. Tổng Kết

| Tầng | Trách Nhiệm | Từ Khóa |
|------|------|--------|
| Controller | Nhận request, kiểm tra tham số, gọi Service, trả về response | Lễ tân |
| Service | Điều phối logic nghiệp vụ, quản lý transaction, phối hợp Repository | Đầu bếp |
| Repository | Truy cập dữ liệu, ORM mapping, đóng gói truy vấn | Thủ kho |
| Domain | Định nghĩa entity, quy tắc nghiệp vụ, value object | Tiêu chuẩn công thức |

**Nguyên tắc cốt lõi**:
1. Mỗi tầng chỉ làm việc của mình
2. Giao tiếp giữa các tầng qua interface
3. Logic nghiệp vụ tập trung ở Service và Domain
4. Logic truy cập dữ liệu tập trung ở Repository
5. Dùng DTO để cách ly cấu trúc dữ liệu giữa các tầng
---

## 8. Thêm Các Mô Hình Kiến Trúc

Bài viết này giới thiệu **kiến trúc phân tầng** (Layered Architecture), đây là mô hình kiến trúc backend phổ biến nhất và dễ tiếp cận nhất. Nhưng kiến trúc backend không chỉ có một loại này, tùy theo bối cảnh nghiệp vụ khác nhau, còn có những mô hình kiến trúc đáng tìm hiểu khác:

### 8.1 Các Mô Hình Kiến Trúc Phổ Biến Khác

| Mô Hình Kiến Trúc | Bối Cảnh Phù Hợp | Đặc Điểm |
|----------|----------|------|
| **Monolithic** | Dự án nhỏ, MVP | Tất cả chức năng trong một ứng dụng, triển khai đơn giản |
| **Microservices** | Hệ thống lớn phức tạp | Chia thành nhiều service độc lập, mỗi service có thể triển khai độc lập |
| **Event-Driven** | Xử lý bất đồng bộ, concurrent cao | Xử lý thông qua event trigger, mức độ decoupling cao |
| **Clean Architecture** | Hệ thống nghiệp vụ phức tạp | Logic nghiệp vụ ở trung tâm, dependency chỉ hướng vào trong, framework ở ngoài cùng |
| **Hexagonal Architecture** | Cần nhiều adapter bên ngoài | Cách ly lõi với hệ thống bên ngoài qua port và adapter |
| **Onion Architecture** | Domain-Driven Design | Phân tầng đồng tâm, domain model ở trong cùng, infrastructure ở ngoài cùng |

Dưới đây lần lượt giới thiệu chi tiết:

#### Monolithic Architecture

Tất cả chức năng đóng gói trong một ứng dụng, chia sẻ cùng database và process.

```
┌──────────────────────────────┐
│         Ứng Dụng Monolithic   │
│  ┌────┐ ┌────┐ ┌────┐       │
│  │User│ │Order│ │Payment│ ... │
│  └──┬─┘ └──┬─┘ └──┬─┘       │
│     └──────┼──────┘          │
│         Database chia sẻ      │
└──────────────────────────────┘
```

- **Ưu điểm**: Phát triển đơn giản, triển khai dễ dàng, debug local thuận tiện
- **Nhược điểm**: Coupling code cao, khó mở rộng, một module có vấn đề có thể kéo sập toàn bộ hệ thống
- **Phù hợp**: Dự án startup giai đoạn đầu, nhóm đơn lẻ phát triển, prototype nhanh

#### Microservices Architecture

Chia hệ thống thành nhiều service độc lập, mỗi service có dữ liệu và logic nghiệp vụ riêng, có thể triển khai và mở rộng độc lập.

```
┌────────┐  ┌────────┐  ┌────────┐
│User Svc│  │Order Svc│  │Payment Svc│
│  DB-1  │  │  DB-2  │  │  DB-3  │
└───┬────┘  └───┬────┘  └───┬────┘
    └───────────┼───────────┘
          API Gateway
```

- **Ưu điểm**: Triển khai và mở rộng độc lập, công nghệ linh hoạt, cách ly lỗi
- **Nhược điểm**: Giao tiếp giữa các service phức tạp, nhất quán dữ liệu phân tán khó, cần năng lực DevOps trưởng thành
- **Phù hợp**: Hệ thống lớn phức tạp, nhiều nhóm cộng tác, cần mở rộng độc lập

#### Event-Driven Architecture

Giao tiếp qua event bất đồng bộ, producer phát ra event, consumer phản hồi event, các component decoupling cao.

```
Producer ──→ [Event Bus/Message Queue] ──→ Consumer A
                                         ──→ Consumer B
                                         ──→ Consumer C
```

- **Ưu điểm**: Decoupling cao, tự nhiên hỗ trợ mở rộng, phù hợp xử lý real-time
- **Nhược điểm**: Khó debug, thứ tự event và idempotency cần xử lý thêm
- **Phù hợp**: Phân tích dữ liệu real-time, hệ thống IoT, giao tiếp bất đồng bộ giữa microservices

#### Clean Architecture

Robert C. Martin đề xuất, chia hệ thống thành bốn tầng đồng tâm, dependency chỉ có thể hướng từ ngoài vào trong:

```
┌─────────────────────────────────────┐
│  Frameworks & Drivers               │
│  ┌─────────────────────────────┐    │
│  │  Interface Adapters         │    │
│  │  ┌─────────────────────┐    │    │
│  │  │  Use Cases           │    │    │
│  │  │  ┌─────────────┐    │    │    │
│  │  │  │  Entities    │    │    │    │
│  │  │  │  (Domain)    │    │    │    │
│  │  │  └─────────────┘    │    │    │
│  │  └─────────────────────┘    │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
         Hướng phụ thuộc: Ngoài → Trong
```

- **Quy tắc cốt lõi**: Tầng trong không biết sự tồn tại của tầng ngoài, logic nghiệp vụ hoàn toàn độc lập với framework và database
- **Ưu điểm**: Khả năng kiểm thử cao, công nghệ có thể thay thế, logic nghiệp vụ rõ ràng
- **Nhược điểm**: Chi phí phát triển ban đầu cao, nhiều code mapping giữa các tầng, dự án nhỏ dễ over-engineering
- **Phù hợp**: Hệ thống nghiệp vụ phức tạp, dự án cần bảo trì lâu dài

<CleanArchitectureDemo />

#### Hexagonal Architecture (Ports & Adapters)

Định nghĩa interface input/output của lõi nghiệp vụ thông qua "port", kết nối hệ thống bên ngoài thông qua "adapter":

```
        ┌─────────────┐
  HTTP ──→ Port      │
  CLI  ──→ (Inbound) │  Lõi Logic Nghiệp Vụ  │  (Outbound) ──→ Database
  MQ   ──→           │                       │  Port     ──→ External API
        └─────────────┘
```

- **Tư tưởng cốt lõi**: Logic nghiệp vụ không phụ thuộc vào bất kỳ công nghệ bên ngoài nào, hệ thống bên ngoài kết nối qua adapter
- **Ưu điểm**: Hệ thống bên ngoài có thể thay thế tùy ý, khi test dùng Mock adapter là được
- **Phù hợp**: Bối cảnh cần kết nối nhiều loại hệ thống bên ngoài

#### Onion Architecture

Tương tự Clean Architecture, nhấn mạnh domain model ở tầng trong cùng, infrastructure ở tầng ngoài cùng, dependency chỉ hướng vào trong:

```
┌──────────────────────────────┐
│  Infrastructure              │
│  ┌────────────────────────┐  │
│  │  Application Services  │  │
│  │  ┌──────────────────┐  │  │
│  │  │  Domain Services  │  │  │
│  │  │  ┌────────────┐   │  │  │
│  │  │  │Domain Model│   │  │  │
│  │  │  └────────────┘   │  │  │
│  │  └──────────────────┘  │  │
│  └────────────────────────┘  │
└──────────────────────────────┘
```

- **Tư tưởng cốt lõi**: Domain model là lõi của hệ thống, tất cả dependency đều hướng đến nó
- **Khác biệt với Clean Architecture**: Onion Architecture nhấn mạnh tầng domain service hơn, Clean Architecture nhấn mạnh tầng use case hơn
- **Phù hợp**: Dự án áp dụng Domain-Driven Design (DDD)

### 8.2 Lộ Trình Tiến Hóa Kiến Trúc

Các kiến trúc này không phải là quan hệ thay thế lẫn nhau, mà là tiến hóa từng bước:

```text
Kiến Trúc Phân Tầng Truyền Thống (N-Layered)
  │  Vấn đề: coupling giữa các tầng, khó thay thế dependency bên ngoài
  ▼
Kiến Trúc Lục Giác (Ports & Adapters)
  │  Cải tiến: dùng port và adapter cách ly hệ thống bên ngoài
  ▼
Kiến Trúc Củ Hành (Onion)
  │  Cải tiến: phân tầng đồng tâm rõ ràng, domain model ở trung tâm
  ▼
Kiến Trúc Sạch (Clean Architecture)
  │  Cải tiến: thống nhất quy tắc dependency, xác định rõ trách nhiệm bốn tầng
  ▼
Chọn kiến trúc phù hợp theo nhu cầu nghiệp vụ
```

### 8.3 Hướng Dẫn Chọn Mô Hình Kiến Trúc

```text
Số lượng người dùng < 1k, lượng code < 5000 dòng
    ↓
Monolithic + Phân tầng đơn giản
    ↓
Số lượng người dùng 1k-100k, cần nhiều nhóm cộng tác
    ↓
Kiến trúc phân tầng (bài viết này giới thiệu)
    ↓
Số lượng người dùng > 100k, độ phức tạp nghiệp vụ cao
    ↓
Microservices / Event-Driven Architecture
```

Các chiều lựa chọn chi tiết hơn:

| Yếu Tố Cân Nhắc | Phân Tầng Đơn Giản | Clean/Hexagonal Architecture | Microservices |
|----------|---------|----------------|--------|
| Quy mô nhóm | 1-5 người | 5-20 người | 20+ người |
| Độ phức tạp nghiệp vụ | Thấp | Trung bình-Cao | Cao |
| Tần suất triển khai | Thấp | Trung bình | Cao (triển khai độc lập) |
| Đa dạng công nghệ | Đơn nhất | Đơn nhất | Có thể đa dạng |
| Chi phí vận hành | Thấp | Trung bình | Cao |

### 8.4 Đề Xuất Đọc Thêm

- **Monolithic**: Xem bài viết liên quan [`backend-project-architecture.md`](./backend-project-architecture.md), tìm hiểu về sự tiến hóa từ script đến monolithic
- **Microservices**: Xem [Từ Monolithic đến Microservices](/zh-cn/appendix/6-architecture-and-system-design/monolith-to-microservices)
- **Clean Architecture**: "Clean Architecture" của Robert C. Martin — tác phẩm kinh điển đề xuất quy tắc dependency và mô hình bốn tầng đồng tâm
- **Enterprise Architecture Patterns**: "Patterns of Enterprise Application Architecture" của Martin Fowler — tài liệu tham khảo uy tín về kiến trúc phân tầng và tổ chức logic domain

### 8.5 Làm Sao Để Chọn?

**Hãy nhớ nguyên tắc này**: **Kiến trúc phục vụ nghiệp vụ, không phải kiến trúc vì kiến trúc**.

- Dự án nhỏ dùng kiến trúc đơn giản, nhanh chóng上线 kiểm chứng
- Dự án lớn mới cân nhắc kiến trúc phức tạp, tránh over-engineering
- Mức độ quen thuộc của nhóm cũng rất quan trọng, chọn giải pháp mọi người đều hiểu

---

## 9. Tổng Kết

| Tầng | Trách Nhiệm | Từ Khóa |
|------|------|--------|
| Controller | Nhận request, kiểm tra tham số, gọi Service, trả về response | Lễ tân |
| Service | Điều phối logic nghiệp vụ, quản lý transaction, phối hợp Repository | Đầu bếp |
| Repository | Truy cập dữ liệu, ORM mapping, đóng gói truy vấn | Thủ kho |
| Domain | Định nghĩa entity, quy tắc nghiệp vụ, value object | Tiêu chuẩn công thức |

**Nguyên tắc cốt lõi**:

Cốt lõi của kiến trúc phân tầng nằm ở việc phân chia trách nhiệm rõ ràng và kiểm soát hướng phụ thuộc. Mỗi tầng chỉ tập trung vào trách nhiệm của mình, giao tiếp với tầng liền kề qua interface, logic nghiệp vụ tập trung ở tầng Service và Domain, logic truy cập dữ liệu tập trung ở tầng Repository, giữa các tầng dùng DTO để cách ly cấu trúc dữ liệu, tránh tiết lộ trực tiếp chi tiết triển khai nội bộ. Thiết kế như vậy giúp hệ thống dễ hiểu, dễ kiểm thử và dễ bảo trì hơn, có thể ứng phó với sự tiến hóa liên tục của nghiệp vụ.

---

## Tài Liệu Tham Khảo

1. [Catalog of Patterns of Enterprise Application Architecture - Martin Fowler](https://www.martinfowler.com/eaaCatalog/) — Danh mục các mẫu kiến trúc ứng dụng doanh nghiệp của Martin Fowler, tài liệu tham khảo kinh điển về kiến trúc phân tầng
2. [Backend Side Architecture Evolution (N-layered, DDD, Hexagon, Onion, Clean Architecture)](https://medium.com/@iamprovidence/backend-side-architecture-evolution-n-layered-ddd-hexagon-onion-clean-architecture-643d72444ce4) — Hành trình tiến hóa từ kiến trúc N tầng đến Clean Architecture, hiểu lý do ra đời của từng kiến trúc
3. [Complete Guide to Clean Architecture - GeeksforGeeks](https://www.geeksforgeeks.org/complete-guide-to-clean-architecture/) — Hướng dẫn toàn diện về Clean Architecture, giải thích chi tiết về phân tầng, quy tắc dependency và phân tách mối quan tâm
4. [Understanding Hexagonal, Clean, Onion, and Traditional Layered Architectures: A Deep Dive](https://romanglushach.medium.com/understanding-hexagonal-clean-onion-and-traditional-layered-architectures-a-deep-dive-c0f93b8a1b96) — So sánh chuyên sâu giữa Hexagonal, Clean, Onion và kiến trúc phân tầng truyền thống
5. [Building Clean Architectures in Modern Backend Frameworks](https://leapcell.io/blog/building-clean-architectures-in-modern-backend-frameworks) — Hướng dẫn thực hành Clean Architecture trong các framework backend hiện đại
6. [Backend Architecture Patterns: From Monoliths to Microservices](https://nerdleveltech.com/backend-architecture-patterns-from-monoliths-to-microservices) — Tổng quan toàn cảnh về các mô hình kiến trúc backend từ Monolith đến Microservices
7. [MVC 三层架构案例详细讲解](https://www.cnblogs.com/TheMagicalRainbowSea/p/17409206.html) — Giải thích chi tiết về mối quan hệ giữa MVC và kiến trúc ba tầng cùng case study thực tế, phù hợp cho người đọc tiếng Trung nhập môn
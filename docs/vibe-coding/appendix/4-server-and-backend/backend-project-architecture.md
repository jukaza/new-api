# Thiết Kế Kiến Trúc Dự Án Backend

::: tip 🎯 Câu hỏi cốt lõi
**Từ script đơn giản đến hệ thống phân tán lớn, làm thế nào để chọn kiến trúc phù hợp cho các dự án backend ở quy mô và ngôn ngữ khác nhau?** Điều này giống như hỏi: từ xưởng gia đình đến nhà máy lớn, làm thế nào để thiết kế dây chuyền sản xuất khác nhau dựa trên sản lượng và quy trình? Một kiến trúc backend tốt nên phát triển cùng với sự tăng trưởng của doanh nghiệp, đồng thời phát huy tối đa đặc tính của ngôn ngữ.
:::

---

## 1. Tiến Hóa Kiến Trúc: Từ Script Đến Hệ Thống

### 1.1 Phân cấp kiến trúc theo lượng người dùng

Kiến trúc của dự án backend nên phù hợp với quy mô doanh nghiệp và lượng người dùng:

| Cấp độ | Người dùng | Đồng thời | Kịch bản điển hình | Trọng tâm chính |
|------|--------|--------|----------|------------|
| **Cơ bản** | < 1k | < 100 | Dự án cá nhân, MVP, công cụ nội bộ | Phát triển nhanh, triển khai đơn giản |
| **Trung cấp** | 1k-100k | 100-10k | Hệ thống doanh nghiệp, SaaS, nền tảng vừa và nhỏ | Kiến trúc phân lớp, quy chuẩn code |
| **Doanh nghiệp** | > 100k | > 10k | Nền tảng lớn, ứng dụng Internet | Microservices, tính sẵn sàng cao, tối ưu hiệu năng |

### 1.2 Chọn phong cách kiến trúc theo đặc tính ngôn ngữ

Các ngôn ngữ lập trình khác nhau có triết lý thiết kế và hệ sinh thái khác nhau, thiết kế kiến trúc nên phù hợp với đặc tính của ngôn ngữ:

| Ngôn ngữ | Triết lý thiết kế | Phong cách kiến trúc khuyến nghị | Framework tiêu biểu |
|------|----------|--------------|----------|
| **Node.js** | Hướng sự kiện, I/O không chặn | Kiến trúc phân lớp + luồng bất đồng bộ | Express, NestJS, Fastify |
| **Python** | Đơn giản thanh lịch, phát triển nhanh | MTV/MVC, kiến trúc phân lớp | Django, Flask, FastAPI |
| **Go** | Đơn giản hiệu quả, đồng thời nguyên sinh | Phân lớp đơn giản, microservices | Gin, Echo, Fiber |
| **Java** | Cấp doanh nghiệp, kiểu mạnh | Phân lớp nghiêm ngặt, thiết kế hướng domain | Spring Boot, Spring Cloud |

::: tip 💡 Nguyên tắc chọn kiến trúc
1. **Không thiết kế quá mức**: Dự án nhỏ dùng kiến trúc đơn giản, dự án lớn mới cần kiến trúc phức tạp
2. **Phù hợp đặc tính ngôn ngữ**: Đừng cố viết code kiểu Java trong Python
3. **Tiến hóa từng bước**: Bắt đầu đơn giản, tối ưu dần khi doanh nghiệp phát triển
4. **Quen thuộc với đội ngũ**: Chọn phong cách kiến trúc mà đội ngũ quen thuộc, giảm chi phí học tập
:::

---

## 2. Kiến Trúc Cấp Cơ Bản (Người dùng < 1k)

### 2.1 Kịch bản áp dụng

- Dự án cá nhân, bài tập học tập
- MVP của startup (Sản phẩm khả thi tối thiểu)
- Công cụ nội bộ, admin panel
- Xác thực nguyên mẫu, trình diễn ý tưởng

### 2.2 Node.js - Phong cách script đơn giản

**Đặc điểm**: File đơn hoặc phân tách đơn giản, triển khai nhanh

```
my-node-api/
├── src/
│   ├── app.js              # Điểm vào ứng dụng
│   ├── routes.js           # Định nghĩa route
│   ├── db.js               # Kết nối cơ sở dữ liệu
│   └── utils.js            # Hàm tiện ích
├── .env                    # Biến môi trường
├── package.json
└── README.md
```

**Ví dụ code**:

```javascript
// src/app.js
const express = require('express');
const app = express();

app.use(express.json());

// Route viết trực tiếp trong entry (phù hợp khi có ít API)
app.get('/users', async (req, res) => {
  const users = await db.query('SELECT * FROM users');
  res.json(users);
});

app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  const result = await db.query(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [name, email]
  );
  res.status(201).json({ id: result.insertId });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

**Dự án mã nguồn mở tham khảo**:
- [expressjs/express](https://github.com/expressjs/express) - Ví dụ chính thức
- [vercel/micro](https://github.com/vercel/micro) - Phong cách microservices

### 2.3 Python - Phong cách prototype nhanh

**Đặc điểm**: Tận dụng tính đơn giản của Python, triển khai nhanh chức năng

```
my-python-api/
├── app.py                  # Ứng dụng chính
├── models.py               # Model dữ liệu
├── config.py               # Cấu hình
├── requirements.txt
└── README.md
```

**Ví dụ code (Flask)**:

```python
# app.py
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
db = SQLAlchemy(app)

# Định nghĩa model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

# Route
@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{'id': u.id, 'name': u.name, 'email': u.email} for u in users])

@app.route('/users', methods=['POST'])
def create_user():
    data = request.json
    user = User(name=data['name'], email=data['email'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'id': user.id}), 201

if __name__ == '__main__':
    app.run(debug=True)
```

**Dự án mã nguồn mở tham khảo**:
- [pallets/flask](https://github.com/pallets/flask) - Ví dụ chính thức
- [tiangolo/fastapi](https://github.com/tiangolo/fastapi) - Phong cách bất đồng bộ hiện đại

### 2.4 Go - Phong cách thư viện chuẩn đơn giản

**Đặc điểm**: Tận dụng thư viện chuẩn của Go, phụ thuộc tối thiểu

```
my-go-api/
├── main.go                 # Điểm vào
├── handlers.go             # Handler
├── models.go               # Model
├── db.go                   # Cơ sở dữ liệu
├── go.mod
└── README.md
```

**Ví dụ code**:

```go
// main.go
package main

import (
    "database/sql"
    "encoding/json"
    "log"
    "net/http"
    _ "github.com/mattn/go-sqlite3"
)

type User struct {
    ID    int    `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
}

var db *sql.DB

func main() {
    var err error
    db, err = sql.Open("sqlite3", "./app.db")
    if err != nil {
        log.Fatal(err)
    }

    http.HandleFunc("/users", usersHandler)
    log.Println("Server starting on :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}

func usersHandler(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
    case http.MethodGet:
        getUsers(w, r)
    case http.MethodPost:
        createUser(w, r)
    }
}

func getUsers(w http.ResponseWriter, r *http.Request) {
    rows, _ := db.Query("SELECT id, name, email FROM users")
    defer rows.Close()

    var users []User
    for rows.Next() {
        var u User
        rows.Scan(&u.ID, &u.Name, &u.Email)
        users = append(users, u)
    }

    json.NewEncoder(w).Encode(users)
}
```

**Dự án mã nguồn mở tham khảo**:
- [golang/go](https://github.com/golang/go) - Ví dụ thư viện chuẩn
- [go-chi/chi](https://github.com/go-chi/chi) - Router nhẹ

### 2.5 Java - Phong cách khởi đầu Spring Boot

**Đặc điểm**: Tận dụng auto-configuration của Spring Boot, khởi động nhanh

```
my-spring-app/
├── src/main/java/com/example/
│   ├── controller/
│   │   └── UserController.java
│   ├── model/
│   │   └── User.java
│   ├── repository/
│   │   └── UserRepository.java
│   └── Application.java
├── src/main/resources/
│   └── application.yml
├── pom.xml
└── README.md
```

**Ví dụ code**:

```java
// Application.java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

// User.java
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    // getters and setters
}

// UserRepository.java
public interface UserRepository extends JpaRepository<User, Long> {
}

// UserController.java
@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }
}
```

**Dự án mã nguồn mở tham khảo**:
- [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot) - Ví dụ chính thức
- [spring-projects/spring-petclinic](https://github.com/spring-projects/spring-petclinic) - Ví dụ kinh điển

---

## 3. Kiến Trúc Cấp Trung Cấp (Người dùng 1k-100k)

### 3.1 Kịch bản áp dụng

- Hệ thống quản lý doanh nghiệp (ERP, CRM, OA)
- Ứng dụng SaaS
- Nền tảng thương mại điện tử
- Dự án cần nhiều đội nhóm hợp tác

### 3.2 Giải thích chi tiết kiến trúc phân lớp

Dự án cấp trung cấp khuyến nghị sử dụng **kiến trúc bốn lớp** (Controller-Service-Repository-Model):

```
project/
├── src/
│   ├── controllers/          # Tầng điều khiển: xử lý HTTP request
│   ├── services/             # Tầng dịch vụ: logic nghiệp vụ
│   ├── repositories/         # Tầng dữ liệu: truy cập dữ liệu
│   ├── models/               # Tầng model: cấu trúc dữ liệu
│   ├── middlewares/          # Middleware
│   ├── utils/                # Hàm tiện ích
│   ├── config/               # Cấu hình
│   └── routes/               # Định nghĩa route
├── tests/
├── docs/
└── scripts/
```

### 3.3 Node.js - Phân lớp cấp doanh nghiệp

**Dự án mã nguồn mở tham khảo**:
- [nestjs/nest](https://github.com/nestjs/nest) - Framework Node.js cấp doanh nghiệp
- [goldbergyoni/nodebestpractices](https://github.com/goldbergyoni/nodebestpractices) - Thực tiễn tốt nhất Node.js

```
node-enterprise/
├── src/
│   ├── modules/              # Tổ chức theo module chức năng
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.repository.ts
│   │   │   ├── users.module.ts
│   │   │   └── dto/
│   │   ├── orders/
│   │   └── products/
│   ├── common/               # Module dùng chung
│   │   ├── filters/          # Exception filter
│   │   ├── guards/           # Guard
│   │   ├── interceptors/     # Interceptor
│   │   └── pipes/            # Pipe
│   ├── config/
│   └── main.ts
```

**Ví dụ code NestJS**:

```typescript
// users/users.controller.ts
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query() query: QueryUserDto) {
    return this.usersService.findAll(query);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}

// users/users.service.ts
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(query: QueryUserDto) {
    const [data, total] = await this.usersRepository.findAndCount({
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return { data, total };
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }
}
```

### 3.4 Python - Phong cách Django/DRF

**Dự án mã nguồn mở tham khảo**:
- [django/django](https://github.com/django/django) - Dự án chính thức
- [encode/django-rest-framework](https://github.com/encode/django-rest-framework) - REST framework
- [cookiecutter/cookiecutter-django](https://github.com/cookiecutter/cookiecutter-django) - Template dự án

```
django-enterprise/
├── apps/
│   ├── users/                # Ứng dụng người dùng
│   │   ├── models.py
│   │   ├── views.py          # API view
│   │   ├── serializers.py    # Serializer
│   │   ├── permissions.py    # Phân quyền
│   │   ├── urls.py
│   │   └── tests/
│   ├── orders/
│   └── products/
├── config/                   # Cấu hình dự án
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   └── wsgi.py
├── utils/                    # Tiện ích dùng chung
├── templates/
├── static/
└── manage.py
```

**Ví dụ code Django REST Framework**:

```python
# users/models.py
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.URLField(blank=True)

# users/serializers.py
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'avatar']

# users/views.py
from rest_framework import viewsets, permissions
from rest_framework.decorators import action

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

# users/urls.py
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = router.urls
```

### 3.5 Go - Phong cách Clean Architecture

**Dự án mã nguồn mở tham khảo**:
- [gin-gonic/gin](https://github.com/gin-gonic/gin) - Web framework
- [go-kit/kit](https://github.com/go-kit/kit) - Bộ công cụ microservices
- [bxcodec/go-clean-arch](https://github.com/bxcodec/go-clean-arch) - Ví dụ Clean Architecture

```
go-enterprise/
├── cmd/
│   └── api/                  # Điểm vào ứng dụng
│       └── main.go
├── internal/                 # Code riêng tư
│   ├── domain/               # Tầng domain (entity, interface)
│   │   ├── user.go
│   │   └── repository.go
│   ├── usecase/              # Tầng use case (logic nghiệp vụ)
│   │   └── user_usecase.go
│   ├── delivery/             # Tầng truyền tải (HTTP/gRPC)
│   │   └── http/
│   │       └── user_handler.go
│   ├── repository/           # Tầng repository (truy cập dữ liệu)
│   │   └── user_repository.go
│   └── config/
├── pkg/                      # Thư viện công khai
├── migrations/
└── go.mod
```

**Ví dụ code Clean Architecture**:

```go
// domain/user.go
type User struct {
    ID        int64     `json:"id"`
    Username  string    `json:"username"`
    Email     string    `json:"email"`
    CreatedAt time.Time `json:"created_at"`
}

// domain/repository.go
type UserRepository interface {
    GetByID(ctx context.Context, id int64) (*User, error)
    GetByEmail(ctx context.Context, email string) (*User, error)
    Create(ctx context.Context, user *User) error
    Update(ctx context.Context, user *User) error
}

// usecase/user_usecase.go
type UserUsecase struct {
    userRepo UserRepository
}

func (u *UserUsecase) GetByID(ctx context.Context, id int64) (*User, error) {
    return u.userRepo.GetByID(ctx, id)
}

func (u *UserUsecase) Create(ctx context.Context, user *User) error {
    // Logic nghiệp vụ: kiểm tra email đã tồn tại chưa
    existing, _ := u.userRepo.GetByEmail(ctx, user.Email)
    if existing != nil {
        return errors.New("email already exists")
    }
    return u.userRepo.Create(ctx, user)
}

// delivery/http/user_handler.go
type UserHandler struct {
    UserUsecase *usecase.UserUsecase
}

func (h *UserHandler) GetUser(c *gin.Context) {
    id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
    user, err := h.UserUsecase.GetByID(c.Request.Context(), id)
    if err != nil {
        c.JSON(404, gin.H{"error": "user not found"})
        return
    }
    c.JSON(200, user)
}
```

### 3.6 Java - Spring Boot cấp doanh nghiệp

**Dự án mã nguồn mở tham khảo**:
- [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot)
- [spring-cloud-samples](https://github.com/spring-cloud-samples) - Ví dụ microservices
- [ali-baba/spring-cloud-alibaba](https://github.com/alibaba/spring-cloud-alibaba) - Microservices của Alibaba

```
spring-enterprise/
├── src/main/java/com/example/
│   ├── application/          # Tầng ứng dụng
│   │   ├── controller/       # Controller
│   │   ├── dto/              # Data Transfer Object
│   │   └── assembler/        # Assembler
│   ├── domain/               # Tầng domain
│   │   ├── entity/           # Entity
│   │   ├── valueobject/      # Value Object
│   │   ├── repository/       # Interface repository
│   │   └── service/          # Domain service
│   ├── infrastructure/       # Tầng cơ sở hạ tầng
│   │   ├── repository/       # Triển khai repository
│   │   ├── config/           # Cấu hình
│   │   └── common/           # Lớp tiện ích
│   └── Application.java
├── src/main/resources/
│   ├── application.yml
│   └── mapper/
└── src/test/
```

**Ví dụ code Domain-Driven Design (DDD)**:

```java
// domain/entity/User.java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Embedded
    private UserStatus status;

    // Phương thức domain
    public void deactivate() {
        this.status = UserStatus.INACTIVE;
    }

    public boolean isActive() {
        return this.status == UserStatus.ACTIVE;
    }
}

// domain/repository/UserRepository.java
public interface UserRepository {
    Optional<User> findById(Long id);
    Optional<User> findByEmail(String email);
    User save(User user);
    void delete(User user);
}

// application/controller/UserController.java
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserAssembler userAssembler;

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(userAssembler.toDTO(user));
    }

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody @Valid CreateUserRequest request) {
        User user = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userAssembler.toDTO(user));
    }
}

// infrastructure/repository/UserRepositoryImpl.java
@Repository
@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepository {
    private final UserJpaRepository jpaRepository;

    @Override
    public Optional<User> findById(Long id) {
        return jpaRepository.findById(id);
    }

    @Override
    public User save(User user) {
        return jpaRepository.save(user);
    }
}
```

---

## 4. Kiến Trúc Cấp Doanh Nghiệp (Người dùng > 100k)

### 4.1 Kịch bản áp dụng

- Nền tảng Internet quy mô lớn
- Hệ thống giao dịch tài chính
- Hệ thống thương mại điện tử tải cao
- Dự án lớn cần nhiều đội nhóm hợp tác

### 4.2 Kiến trúc Microservices

Khi ứng dụng monolithic không còn đáp ứng được nhu cầu, cần xem xét kiến trúc microservices:

```
microservices-platform/
├── api-gateway/              # API Gateway
│   ├── src/
│   └── Dockerfile
├── services/                 # Dịch vụ nghiệp vụ
│   ├── user-service/         # Dịch vụ người dùng
│   ├── order-service/        # Dịch vụ đơn hàng
│   ├── product-service/      # Dịch vụ sản phẩm
│   └── payment-service/      # Dịch vụ thanh toán
├── shared/                   # Thư viện dùng chung
│   ├── proto/                # Protocol Buffers
│   ├── common-lib/
│   └── event-contracts/
├── infrastructure/           # Cơ sở hạ tầng
│   ├── docker-compose.yml
│   ├── kubernetes/
│   └── terraform/
└── docs/
```

### 4.3 Framework microservices theo ngôn ngữ

| Ngôn ngữ | Framework microservices | Service Discovery | Configuration Center | Tracing |
|------|------------|----------|----------|----------|
| **Node.js** | NestJS + gRPC | Consul | etcd | Jaeger |
| **Python** | FastAPI + Nameko | Eureka | Consul | Zipkin |
| **Go** | Go-kit + gRPC | etcd | etcd | OpenTelemetry |
| **Java** | Spring Cloud | Nacos | Nacos | SkyWalking |

### 4.4 Thiết kế codebase (Monorepo vs Polyrepo)

**Monorepo (kho code đơn)**:

```
monorepo/
├── services/
│   ├── user-service/         # Dịch vụ độc lập
│   │   ├── src/
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── order-service/
│   └── product-service/
├── shared/
│   ├── types/                # Kiểu dùng chung
│   ├── utils/                # Tiện ích dùng chung
│   └── proto/                # Giao thức dùng chung
├── packages/
│   ├── eslint-config/        # Cấu hình ESLint dùng chung
│   └── ts-config/            # Cấu hình TS dùng chung
├── docker-compose.yml
└── package.json              # package.json gốc
```

**Ưu điểm**:
- Chia sẻ code dễ dàng
- Build và release thống nhất
- Tái cấu trúc dễ dàng

**Nhược điểm**:
- Codebase lớn
- Quản lý phân quyền phức tạp

**Polyrepo (đa kho code)**:

Mỗi dịch vụ có repository riêng:
- `github.com/company/user-service`
- `github.com/company/order-service`
- `github.com/company/shared-lib`

**Ưu điểm**:
- Dịch vụ tiến hóa độc lập
- Đội nhóm tự chủ
- Phân quyền rõ ràng

**Nhược điểm**:
- Chia sẻ code khó khăn
- Quản lý phiên bản phức tạp

### 4.5 Thiết kế tầng dữ liệu

**Chiến lược chọn cơ sở dữ liệu**:

| Loại dữ liệu | Cơ sở dữ liệu khuyến nghị | Kịch bản áp dụng |
|----------|------------|----------|
| Dữ liệu quan hệ | PostgreSQL | Người dùng, đơn hàng, sản phẩm |
| Cache | Redis | Session, dữ liệu nóng |
| Tìm kiếm | Elasticsearch | Tìm kiếm sản phẩm, log |
| Dữ liệu chuỗi thời gian | InfluxDB/TimescaleDB | Giám sát, metrics |
| Dữ liệu tài liệu | MongoDB | Log, cấu hình |

**Thiết kế tầng truy cập dữ liệu**:

```
data-layer/
├── primary-db/               # Cơ sở dữ liệu chính
│   ├── master/               # Ghi
│   └── slaves/               # Đọc
├── cache-layer/              # Tầng cache
│   ├── redis-cluster/
│   └── local-cache/
├── search-engine/            # Máy tìm kiếm
│   └── elasticsearch/
└── message-queue/            # Hàng đợi tin nhắn
    ├── kafka/
    └── rabbitmq/
```

---

## 5. Tham Khảo Quy Chuẩn Kiến Trúc Dự Án Mã Nguồn Mở

### 5.1 Hệ sinh thái Node.js

**Cấu trúc dự án chính thức Express.js**:
```
express-project/
├── bin/                      # Script khởi động
├── public/                   # Tài nguyên tĩnh
├── routes/                   # Route
├── views/                    # View
├── app.js                    # Cấu hình ứng dụng
└── package.json
```

**Khuyến nghị chính thức NestJS**:
```
nest-project/
├── src/
│   ├── modules/              # Module chức năng
│   ├── common/               # Module dùng chung
│   ├── config/
│   └── main.ts
├── test/
└── nest-cli.json
```

### 5.2 Hệ sinh thái Python

**Cấu trúc dự án chính thức Django**:
```
django-project/
├── project_name/             # Cấu hình dự án
├── apps/                     # Thư mục ứng dụng
├── templates/
├── static/
├── media/
└── manage.py
```

**Cấu trúc dự án FastAPI**:
```
fastapi-project/
├── app/
│   ├── api/
│   │   ├── deps.py           # Dependency
│   │   └── v1/
│   │       └── endpoints/
│   ├── core/                 # Cấu hình lõi
│   ├── db/                   # Cơ sở dữ liệu
│   ├── models/               # Model
│   ├── schemas/              # Pydantic model
│   └── main.py
├── tests/
└── alembic/                  # Migration
```

### 5.3 Hệ sinh thái Go

**Bố cục dự án tiêu chuẩn**:
```
go-project/
├── cmd/                      # Điểm vào ứng dụng
│   └── app/
│       └── main.go
├── internal/                 # Code riêng tư
├── pkg/                      # Thư viện công khai
├── api/                      # Định nghĩa API
├── web/                      # Tài nguyên tĩnh
├── configs/                  # Cấu hình
├── scripts/                  # Script
└── go.mod
```

**Tham khảo**:
- [golang-standards/project-layout](https://github.com/golang-standards/project-layout)

### 5.4 Hệ sinh thái Java

**Cấu trúc chính thức Spring Boot**:
```
spring-boot-project/
├── src/main/java/com/example/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── entity/
│   ├── dto/
│   ├── config/
│   └── Application.java
├── src/main/resources/
│   ├── static/
│   ├── templates/
│   └── application.yml
└── src/test/
```

**Sổ tay phát triển Java Alibaba**:
- Phân lớp rõ ràng: controller/service/manager/dao
- Mô hình domain: phân biệt DO/DTO/BO/VO
- Cấu trúc package: phân chia theo module chức năng

---

## 6. Lộ Trình Tiến Hóa Kiến Trúc

### 6.1 Ví dụ tiến hóa

```
Giai đoạn 1: Ứng dụng monolithic (Cơ bản)
    ↓ Lượng người dùng tăng, đội ngũ mở rộng
Giai đoạn 2: Kiến trúc phân lớp (Trung cấp)
    ↓ Nghiệp vụ phức tạp, nhiều đội nhóm hợp tác
Giai đoạn 3: Module hóa/Microservices (Doanh nghiệp)
    ↓ Yêu cầu tải cao, tính sẵn sàng cao
Giai đoạn 4: Kiến trúc Cloud Native (Nền tảng)
```

### 6.2 Khi nào nên nâng cấp kiến trúc?

| Tín hiệu | Cấp độ hiện tại | Khuyến nghị nâng cấp |
|------|----------|----------|
| Số file code > 50 | Cơ bản | Trung cấp |
| Thời gian build > 5 phút | Trung cấp | Module hóa |
| Đội ngũ > 10 người | Trung cấp | Microservices |
| DAU > 100k | Trung cấp | Doanh nghiệp |
| Stack đa ngôn ngữ | Monolithic | Microservices |

---

## 7. Tổng Kết

::: tip 💡 Tư tưởng cốt lõi
**Kiến trúc phục vụ doanh nghiệp, không phải kiến trúc vì kiến trúc.**

**Chọn theo lượng người dùng**:
- **< 1k**: Script đơn giản, triển khai nhanh
- **1k-100k**: Kiến trúc phân lớp, quy chuẩn code
- **> 100k**: Microservices, thiết kế tính sẵn sàng cao

**Chọn theo ngôn ngữ**:
- **Node.js**: Tận dụng đặc tính bất đồng bộ, phù hợp I/O intensive
- **Python**: Phát triển nhanh, phù hợp xử lý dữ liệu và AI
- **Go**: Hiệu năng cao, phù hợp Cloud Native và microservices
- **Java**: Cấp doanh nghiệp, phù hợp hệ thống lớn phức tạp

**Nguyên tắc chung**:
1. **Tiến hóa từng bước**: Bắt đầu đơn giản, phát triển cùng doanh nghiệp
2. **Quy ước hơn cấu hình**: Thống nhất quy chuẩn, giảm chi phí giao tiếp
3. **Kiểm thử tự động**: Đảm bảo an toàn khi tái cấu trúc
4. **Tài liệu đi trước**: Quyết định kiến trúc phải được ghi lại

**Mục tiêu cuối cùng**: Làm cho code vận hành hiệu quả như một dây chuyền nhà máy, bất kể quy mô lớn nhỏ.
:::

---

## Tài Nguyên Tham Khảo

### Dự án mã nguồn mở
- [nestjs/nest](https://github.com/nestjs/nest) - Framework Node.js cấp doanh nghiệp
- [django/django](https://github.com/django/django) - Python Web framework
- [gin-gonic/gin](https://github.com/gin-gonic/gin) - Go Web framework
- [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot) - Java framework

### Hướng dẫn kiến trúc
- [goldbergyoni/nodebestpractices](https://github.com/goldbergyoni/nodebestpractices) - Thực tiễn tốt nhất Node.js
- [golang-standards/project-layout](https://github.com/golang-standards/project-layout) - Bố cục dự án Go
- [cookiecutter/cookiecutter-django](https://github.com/cookiecutter/cookiecutter-django) - Template dự án Django
- [ali-baba/spring-cloud-alibaba](https://github.com/alibaba/spring-cloud-alibaba) - Microservices của Alibaba

### Sách
- 《Clean Architecture》- Robert C. Martin
- 《Building Microservices》- Sam Newman
- 《Designing Data-Intensive Applications》- Martin Kleppmann
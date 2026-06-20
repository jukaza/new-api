# Quản lý danh tính và quyền truy cập đám mây
> **Hướng dẫn học**: Kỹ thuật prompt giải quyết "cách diễn đạt rõ ràng", quản lý quyền tài khoản đám mây giải quyết "ai có thể làm gì". Chương này tập trung vào một câu hỏi: **trong thế giới đám mây, làm thế nào để cấp quyền thuận tiện mà không giao chìa khóa cho người sai?**

Trước khi bắt đầu, nên bổ sung hai "viên gạch cơ sở":

- **Token là gì**: Có thể đọc phần "Phân từ & Token" trong [Giới thiệu về mô hình ngôn ngữ lớn](../8-artificial-intelligence/llm-principles.md).
- **Prompt là gì**: Nếu chưa quen với cấu trúc System / User / Assistant, xem [Kỹ thuật prompt](../8-artificial-intelligence/prompt-engineering/).

---

## 0. Mở đầu: Tại sao mới lên đám mây đã "dẫm phải mìn"?

<IamRamComparisonDemo />

Nhiều người mới bắt đầu sử dụng dịch vụ đám mây gặp tình huống tương tự:

- Vì tiện, ghi thẳng AccessKey vào code rồi đẩy lên GitHub;
- Cấp quyền "admin" cho tất cả nhân viên, kết quả ai đó xóa nhầm database production;
- Sau khi bàn giao dự án, không biết ai còn giữ mật khẩu nhân viên cũ;
- Nghe nói nên bật MFA nhưng thấy "phiền" nên cứ để đó.

Theo trực giác, chúng ta có thể nghĩ: **"Những nhân viên này thiếu ý thức an ninh"**.

Nhưng phần lớn thời gian, vấn đề không nằm ở con người, mà ở **chưa xây dựng hệ thống quản lý quyền đúng đắn**.

<IntroProblemReasonSolution />

Đối mặt với những thách thức này, chỉ dựa vào "cẩn thận khi thao tác" không còn hiệu quả. Chúng ta cần một phương pháp luận quản lý quyền hệ thống, đó chính là điều **IAM (Identity and Access Management, Quản lý danh tính và truy cập)** cố gắng giải quyết.

---

## 1. IAM/RAM là gì? Bắt đầu từ "hệ thống kiểm soát ra vào"

### 1.1 Ví dụ: Hệ thống kiểm soát thông minh của công ty

Tưởng tượng công ty bạn chuyển đến một tòa nhà văn phòng mới:

| Tình huống | Không có IAM | Có IAM |
| :--------- | :----------------------------- | :------------------------------------------- |
| Nhân viên mới | Cho chìa khóa vạn năng mở tất cả cửa | Cấp thẻ kiểm soát chỉ mở cửa khu vực làm việc |
| Nhân viên nghỉ việc | Mất chìa khóa, không biết ai đang giữ | Hủy thẻ kiểm soát ngay lập tức, tất cả cửa đều khóa |
| Nhân viên thuê ngoài | Cho mượn chìa khóa vài ngày | Cấp thẻ tạm thời, tự động hết hạn sau 3 ngày |
| Khách viếng thăm | Lễ tân cấp một chiếc chìa khóa | Cấp mã khách một lần, chỉ vào được phòng họp |

**IAM (Identity and Access Management, Quản lý danh tính và truy cập)** giống như "hệ thống kiểm soát thông minh" này:

- **Danh tính (Identity)**: Ai? Nhân viên, thuê ngoài, khách, ứng dụng
- **Truy cập (Access)**: Vào được những cửa nào? Làm được thao tác gì?
- **Quản lý (Management)**: Cấp chìa khóa thế nào, thu hồi thế nào, kiểm tra record ra sao

### 1.2 AWS IAM vs Alibaba Cloud RAM

<IamRamComparisonDemo />

Các nhà cung cấp đám mây khác nhau đều có triển khai IAM riêng:

| Nhà cung cấp | Tên dịch vụ | Khái niệm cốt lõi |
| :--------- | :----------------------------------- | :------------------------ |
| **AWS** | IAM (Identity and Access Management) | User, Group, Role, Policy |
| **Alibaba Cloud** | RAM (Resource Access Management) | 用户、用户组、角色、策略 |
| **Tencent Cloud** | CAM (Cloud Access Management) | 用户、用户组、角色、策略 |
| **Huawei Cloud** | IAM | 用户、用户组、委托、策略 |
| **Azure** | Azure AD + RBAC | User, Group, Role, RBAC |

Dù tên khác nhau, **khái niệm cốt lõi đều giống nhau**:

- **User (Người dùng)**: Đại diện cho một người hoặc ứng dụng cụ thể
- **Group (Nhóm)**: Quản lý quyền hàng loạt cho tập hợp người dùng
- **Role (Vai trò)**: Định nghĩa tập quyền có thể được "đóng"
- **Policy (Chính sách)**: Quy tắc quyền cụ thể (cho phép/từ chối làm gì)

---

## 2. User, Group, Role: Nên dùng cái nào?

### 2.1 Sự khác biệt giữa ba loại "danh tính"

<IdentityProviderDemo />

Dùng ví dụ văn phòng để so sánh:

| Khái niệm | Ví dụ | Trường hợp sử dụng | Đặc điểm |
| :------------------ | :----------------------------- | :------------------- | :--------------------------------- |
| **User (Người dùng)** | Nhân viên chính thức, có bàn làm việc và thẻ kiểm soát | Thành viên ổn định lâu dài | Có credential vĩnh viễn (mật khẩu, AK/SK) |
| **Group (Nhóm)** | Bộ phận, như "Bộ phận kỹ thuật", "Bán hàng" | Quản lý quyền hàng loạt | Không đăng nhập được, chỉ là container quyền |
| **Role (Vai trò)** | Thẻ khách tạm thời, thẻ thuê ngoài | Cấp quyền tạm thời, truy cập liên tài khoản | Không credential vĩnh viễn, lấy credential tạm thời qua "đóng vai trò" |

### 2.2 Trường hợp thực tế: Sự tiến hóa quyền của một startup

**Giai đoạn 1: Đội sáng lập (2-3 người)**

```
Vấn đề: Dùng trực tiếp tài khoản root, vì "tiện"
Rủi ro: Tài khoản root có tất cả quyền, nếu bị lộ toàn bộ tài khoản coi như xong
```

**Giai đoạn 2: Mở rộng (5-10 người)**

```
Cải thiện: Tạo IAM User cho mỗi người, phân quyền khác nhau
Vấn đề:
- DevOps Vương nghỉ việc, AK/SK của anh ấy nằm rải rác trên server nào?
- Frontend mới cần quyền chỉ đọc S3, backend cần quyền RDS, cấu hình thủ công từng người quá phiền
```

**Giai đoạn 3: Chuẩn hóa (10-30 người)**

```
Cải thiện:
1. Tạo IAM Groups theo vai trò:
   - Developers: đọc/ghi S3, EC2, RDS
   - DevOps: quyền đầy đủ nhưng cần MFA
   - ReadOnly: xem tất cả tài nguyên, không sửa đổi
   - QAs: truy cập tài nguyên môi trường test

2. Sử dụng IAM Role:
   - EC2 instance dùng Instance Profile, không còn AK/SK trên server
   - Truy cập liên tài khoản dùng Role Assume, không chia sẻ AK/SK
   - CI/CD dùng OIDC Federation, không lưu credential dài hạn
```

**Giai đoạn 4: Đa tài khoản/Cấp doanh nghiệp (30+ người)**

```
Kiến trúc:
- Master Account: chỉ quản lý hóa đơn và cấu trúc tổ chức
- Audit Account: thu thập log tất cả tài khoản
- Dev Account: môi trường development
- Staging Account: môi trường test
- Prod Account: môi trường production, quyền nghiêm ngặt nhất

Luồng quyền:
- Developer mặc định chỉ có quyền đọc Dev
- Cần sửa production, tạo ticket xin Assume Role tạm thời ở Prod
- Mọi thao tác Assume được ghi nhận bởi CloudTrail, audit định kỳ
```

---

## 3. Role và Policy: "Linh hồn" của quản lý quyền

### 3.1 Bản chất của Role: Tin tưởng + Quyền hạn

<RolePolicyDemo />

IAM Role có hai thành phần cốt lõi:

1. **Trust Policy (Chính sách tin tưởng)**: Ai có thể đóng vai trò này?
2. **Permission Policy (Chính sách quyền)**: Sau khi đóng vai trò, có thể làm gì?

Dùng ví dụ diễn kịch:

| Khái niệm | Ví dụ | Giải thích |
| :-------------------- | :--------------------- | :----------------------------------------------------------------------------------------- |
| **Role** | "Hamlet" trong kịch bản | Định nghĩa diễn vở gì (quyền) |
| **Trust Policy** | Đạo diễn nói "ai có thể diễn Hamlet" | Có thể là "diễn viên đoàn này" (user cùng tài khoản), "diễn viên mượn đoàn khác" (liên tài khoản), "khách mời đặc biệt" (IdP bên ngoài) |
| **Permission Policy** | Nội dung kịch bản | Hamlet có thể làm gì: đọc thoại, đấu kiếm, phát điên (quyền cụ thể) |
| **Assume Role** | Diễn viên lên sân khấu biểu diễn | Tiểu Lý được đạo diễn chọn diễn Hamlet, lên sân khấu có tất cả quyền trong kịch bản |
| **Credential tạm thời** | Thẻ diễn xuất | Tiểu Lý nhận "thẻ diễn xuất tạm thời", hết hạn khi biểu diễn xong |

### 3.2 Policy: "Ngữ pháp" của quyền

<PermissionHierarchyDemo />

IAM Policy là tài liệu JSON định nghĩa "ai có thể làm thao tác gì trên tài nguyên nào".

**Ví dụ Policy hoàn chỉnh**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3ReadWrite",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::my-app-bucket/*",
      "Condition": {
        "StringEquals": {
          "aws:RequestedRegion": "ap-northeast-1"
        },
        "Bool": {
          "aws:MultiFactorAuthPresent": "true"
        }
      }
    },
    {
      "Sid": "DenySensitiveData",
      "Effect": "Deny",
      "Action": "s3:*",
      "Resource": "arn:aws:s3:::my-app-bucket/sensitive/*"
    }
  ]
}
```

**Giải thích các trường chính**:

| Trường | Ý nghĩa | Ví dụ |
| :------------ | :--------------------------------- | :----------------------- |
| **Version** | Phiên bản ngữ pháp Policy | "2012-10-17" |
| **Statement** | Mảng khai báo quyền, có thể chứa nhiều rule | [...] |
| **Sid** | ID khai báo, tùy chọn, để xác định rule | "AllowS3ReadWrite" |
| **Effect** | Hiệu lực: Allow (cho phép) hoặc Deny (từ chối) | "Allow" |
| **Action** | Thao tác cho phép/từ chối, hỗ trợ wildcard | "s3:GetObject", "s3:\*" |
| **Resource** | Tài nguyên tác động, xác định bằng ARN | "arn:aws:s3:::bucket/\*" |
| **Condition** | Tùy chọn, chỉ có hiệu lực khi thỏa mãn điều kiện cụ thể | Giới hạn region, yêu cầu MFA, v.v. |

### 3.3 Thứ tự ưu tiên quyền: Deny > Allow > Từ chối mặc định

Logic đánh giá quyền IAM tóm tắt bằng một câu: **Deny rõ ràng luôn thắng, không có Allow nghĩa là từ chối**.

Quy trình đánh giá:

```
1. Kiểm tra xem có Policy Deny không
   ├─ Có Deny → Từ chối (bất kể có Allow hay không)
   └─ Không có Deny → Tiếp tục kiểm tra

2. Kiểm tra xem có Policy Allow không
   ├─ Có Allow → Cho phép
   └─ Không có Allow → Từ chối (nguyên tắc từ chối mặc định)
```

**Ví dụ thực tế: Bảo vệ dữ liệu nhạy cảm**

```json
// Policy 1: Quyền bình thường cho developer
{
  "Effect": "Allow",
  "Action": ["s3:*"],
  "Resource": "arn:aws:s3:::company-data/*"
}

// Policy 2: Bảo vệ thư mục nhạy cảm (dù developer có s3:* cũng không truy cập được)
{
  "Effect": "Deny",
  "Action": ["s3:*"],
  "Resource": "arn:aws:s3:::company-data/sensitive/*"
}
```

**Điểm chính**:

- Dù developer có quyền Allow `s3:*`
- Nhưng thư mục nhạy cảm có rule Deny rõ ràng
- Deny ưu tiên cao hơn, nên developer không thể truy cập dữ liệu nhạy cảm
- Kể cả khi developer là admin, Deny này vẫn hiệu lực (trừ tài khoản root)

---

## 4. Access Key (AK/SK): "Chìa khóa" cần bảo quản cẩn thận

### 4.1 AK/SK là gì?

<AccessKeyManagementDemo />

Access Key là credential dài hạn do dịch vụ đám mây cung cấp, dùng cho API call theo chương trình. Gồm hai phần:

| Thành phần | Tên | Tác dụng | Ví dụ |
| :-------------------- | :----------- | :------------------------- | :--------- |
| **Access Key ID** | ID khóa truy cập | Xác định bạn là ai (giống tên người dùng) | Số thẻ ngân hàng |
| **Secret Access Key** | Khóa truy cập bí mật | Chứng minh bạn là bạn (giống mật khẩu) | Mã PIN thẻ ngân hàng |

### 4.2 Tại sao AK/SK là "vật nguy hiểm"?

**Trường hợp thực tế: Bài học của một startup**

Tiểu Lý là kỹ sư backend mới vào công ty startup. Tuần đầu tiên, nhiệm vụ là debug tính năng upload file.

```python
# Code của Tiểu Lý (có vấn đề an ninh nghiêm trọng!)
import boto3

# Để tiện debug, ghi AK/SK thẳng vào code
s3 = boto3.client(
    's3',
    aws_access_key_id='AKIAIOSFODNN7EXAMPLE',
    aws_secret_access_key='wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    region_name='ap-northeast-1'
)

def upload_file(file_path, bucket_name, object_name):
    s3.upload_file(file_path, bucket_name, object_name)
    print(f"File đã upload lên s3://{bucket_name}/{object_name}")

# Test upload
upload_file('./test.jpg', 'my-company-bucket', 'uploads/test.jpg')
```

**Chuyện xảy ra một tuần sau**:

1. Tiểu Lý đẩy code lên GitHub (kèm AK/SK)
2. Code trên GitHub bị crawler quét, AK/SK bị trích xuất
3. Kẻ tấn công dùng credential này tạo hàng loạt EC2 instance để đào coin
4. Cuối tháng nhận hóa đơn: chi phí phát sinh 12.000 USD
5. Audit phát hiện AK/SK bị lộ, Tiểu Lý bị mời lên làm việc...

**Trường hợp này dạy chúng ta điều gì?**

| Cách sai | Cách đúng |
| :-------------------------- | :----------------------------------------------- |
| Hardcode AK/SK trong code | Sử dụng IAM Role, để chương trình tự lấy credential tạm thời |
| Đẩy AK/SK lên Git repo | Dùng `.gitignore` bỏ qua file config, dùng dịch vụ quản lý secret |
| Không rotate AK/SK lâu dài | Rotate AK/SK định kỳ, dùng credential tạm thời thay credential dài hạn |
| Cấp quyền quá lớn cho AK/SK | Tuân thủ nguyên tắc quyền tối thiểu, chỉ cấp quyền cần thiết |

### 4.3 Hướng dẫn sử dụng AK/SK an toàn

**Kịch bản 1: Development local**

```bash
# Cách đúng: Dùng AWS CLI cấu hình credential, không ghi trong code
aws configure
# Rồi làm theo hướng dẫn nhập Access Key ID và Secret Access Key
# Thông tin được lưu tại ~/.aws/credentials, permission 600

# Trong code không cần cấu hình credential
import boto3
s3 = boto3.client('s3')  # Tự động đọc từ ~/.aws/credentials
```

**Kịch bản 2: Server/EC2**

```python
# Cách đúng: Sử dụng IAM Instance Profile
# 1. Tạo IAM Role, gắn quyền cần thiết (như S3ReadOnly)
# 2. Tạo Instance Profile, liên kết Role này
# 3. Khi khởi động EC2, chọn Instance Profile này

# Trong code không cần credential
import boto3
s3 = boto3.client('s3')  # Tự động lấy credential tạm thời từ EC2 metadata service

# Credential tạm thời tự động rotate, không lo hết hạn
```

**Kịch bản 3: CI/CD Pipeline**

```yaml
# Cách đúng: Sử dụng OIDC Federation (OpenID Connect)
# Ví dụ với GitHub Actions:

# 1. Tạo OIDC Identity Provider trên AWS, tin tưởng GitHub
# 2. Tạo IAM Role với trust policy cho phép repo GitHub cụ thể đóng vai trò
# 3. Cấu hình trong GitHub Actions

name: Deploy
on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write # Quan trọng: cho phép yêu cầu OIDC token
      contents: read
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          role-to-assume: arn:aws:iam::123456789012:role/GitHubActionsRole
          aws-region: ap-northeast-1
          # Lưu ý: Không có Access Key ở đây! Hoàn toàn dùng credential tạm thời

      - name: Deploy
        run: aws s3 sync ./build s3://my-bucket/
```

**Tóm tắt: Cấp độ an toàn khi sử dụng AK/SK**

| Cấp độ an toàn | Cách làm | Kịch bản phù hợp | Mức độ rủi ro |
| :------- | :-------------------------- | :------------------------ | :------- |
| Cao nhất | Dùng IAM Role (không credential dài hạn) | EC2, Lambda, ECS, CI/CD | Rất thấp |
| Cao | Dùng OIDC Federation | GitHub Actions, GitLab CI | Thấp |
| Trung bình | Dùng dịch vụ quản lý secret | Dev local, team nhỏ | Trung bình |
| Thấp | Dùng biến môi trường | Prototype nhanh, dự án cá nhân | Cao |
| Rất thấp | Hardcode trong code | Không khuyến nghị trong mọi kịch bản | Rất cao |

---

## 5. Xác thực đa yếu tố (MFA): Thêm "khóa" cho tài khoản

### 5.1 MFA là gì?

<MfaSecurityDemo />

MFA (Multi-Factor Authentication, Xác thực đa yếu tố), còn gọi 2FA (Two-Factor Authentication), là cơ chế bảo mật yêu cầu người dùng cung cấp **hai trở lên** yếu tố xác thực khác nhau khi đăng nhập:

| Loại yếu tố | Là gì | Ví dụ |
| :------------------------- | :----------------- | :------------- |
| **Yếu tố tri thức** (bạn biết gì) | Thông tin chỉ bạn biết | Mật khẩu, mã PIN |
| **Yếu tố sở hữu** (bạn có gì) | Thiết bị vật lý bạn sở hữu | Điện thoại, hardware key |
| **Yếu tố sinh trắc** (bạn là ai) | Đặc điểm sinh trắc học | Vân tay, nhận diện khuôn mặt |

### 5.2 Tại sao MFA quan trọng?

**Số liệu thực tế cho bạn câu trả lời**:

| Cách tấn công | Tỷ lệ thành công không có MFA | Tỷ lệ thành công có MFA |
| :----------------------- | :------------------ | :------------------------------ |
| Đoán mật khẩu/brute force | Cao | Rất thấp (cần yếu tố thứ hai) |
| Phishing lấy mật khẩu | Cao | Rất thấp (trang phishing không lấy được mã MFA) |
| Rò rỉ mật khẩu (từ site khác) | Cao | Rất thấp (không biết yếu tố thứ hai) |

**Báo cáo bảo mật Microsoft (2020)**: Bật MFA có thể chặn **99.9%** cuộc tấn công tự động.

### 5.3 Thực hành MFA: Bật MFA cho tài khoản root AWS

**Bước 1: Đăng nhập AWS Console**

1. Đăng nhập bằng email và mật khẩu tài khoản root
2. Nhấp tên tài khoản góc phải trên, chọn "Security Credentials"

**Bước 2: Kích hoạt MFA**

1. Tìm phần "Multi-factor authentication (MFA)"
2. Nhấp "Assign MFA device"
3. Chọn loại thiết bị MFA (khuyến nghị "Authenticator app")

**Bước 3: Cấu hình MFA ảo**

1. Cài Google Authenticator hoặc Microsoft Authenticator trên điện thoại
2. Quét mã QR hoặc nhập thủ công
3. Nhập mã 6 chữ số hiển thị trên App (nhập hai lần liên tiếp vì mã đổi mỗi 30 giây)

**Hoàn thành!** Tài khoản root giờ đã có bảo vệ MFA.

---

## 6. Truy cập liên tài khoản: Cách "ghé thăm" an toàn

### 6.1 Tại sao cần truy cập liên tài khoản?

<CrossAccountAccessDemo />

Khi kinh doanh phát triển, nhiều công ty sử dụng **kiến trúc đa tài khoản** để cô lập các môi trường:

| Loại tài khoản | Mục đích | Yêu cầu quyền |
| :------------------ | :--------------------- | :----------------- |
| **Master Account** | Quản lý tổ chức, thanh toán hóa đơn | Hầu như không sử dụng |
| **Security Audit** | Thu thập log tập trung tất cả tài khoản | Chỉ đọc ở tài khoản khác |
| **Shared Services** | Tài nguyên dùng chung (image repo, v.v.) | Tài khoản khác chỉ đọc |
| **Development** | Môi trường development | Developer quyền đầy đủ |
| **Staging** | Môi trường test/pre-production | Quyền cho tester |
| **Production** | Môi trường production | Hạn chế nghiêm ngặt, cần phê duyệt |

**Vấn đề: Làm sao EC2 của Production kéo được image từ Shared Services?**

- Giải pháp A: Ghi AK/SK trong user data của Production (nguy hiểm! Rủi ro lộ AK/SK)
- Giải pháp B: Dùng Role Assume liên tài khoản (khuyến nghị! Credential tạm thời, tự rotate)

### 6.2 Nguyên lý Role Assume liên tài khoản

```
Tài khoản A (Production)                    Tài khoản B (Shared Services)
    |                                           |
    |  1. Yêu cầu Assume Role                  |
    |  "Tôi muốn đóng ECRReadRole của tài khoản B" |
    |------------------------------------------>|
    |                                           |
    |                    2. Kiểm tra trust policy |
    |                    "Tài khoản A có thể đóng tôi không?" |
    |                                           |
    |  3. Trả về credential tạm thời            |
    |  AccessKeyId, SecretKey, SessionToken    |
    |<------------------------------------------|
    |                                           |
    |  4. Dùng credential tạm thời truy cập ECR |
    |  docker pull tài-khoản-B.dkr.ecr...       |
    ```

**Điểm chính**:

- Credential tạm thời mặc định có hiệu lực 1 giờ, tối đa cấu hình 12 giờ
- Không cần lưu credential dài hạn trong code
- Trust policy có thể giới hạn ai được đóng vai trò (như chỉ định tài khoản, External ID)

### 6.3 Thực hành: Cấu hình truy cập ECR liên tài khoản

**Kịch bản**: EC2 của tài khoản Production cần kéo Docker image từ tài khoản Shared Services.

**Bước 1: Tạo IAM Role ở tài khoản Shared Services**

1. Đăng nhập AWS Console của Shared Services
2. Vào IAM -> Roles -> Create role
3. Chọn "Another AWS account"
4. Nhập Account ID của Production
5. Tùy chọn: Đánh dấu "Require external ID" và nhập chuỗi ngẫu nhiên (tăng bảo mật)
6. Gắn quyền: AmazonEC2ContainerRegistryReadOnly
7. Đặt tên Role: CrossAccountECRReadRole

**Bước 2: Lấy Role ARN**

Sau khi tạo xong, sao chép ARN của Role:

```
arn:aws:iam::SHARED_SERVICES_ACCOUNT_ID:role/CrossAccountECRReadRole
```

**Bước 3: Cấu hình EC2 instance ở tài khoản Production**

Cách A: Dùng Instance Profile (khuyến nghị)

1. Tạo IAM Role ở Production (cho EC2)
2. Trust policy: tin tưởng dịch vụ EC2
3. Permission policy: cho phép Assume Role liên tài khoản

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Resource": "arn:aws:iam::SHARED_SERVICES_ACCOUNT_ID:role/CrossAccountECRReadRole"
    }
  ]
}
```

4. Tạo Instance Profile, liên kết Role này
5. Khi khởi động EC2, chọn Instance Profile này

Cách B: Assume Role động trong user data của EC2

```bash
#!/bin/bash
# Cài AWS CLI
yum install -y aws-cli

# Assume Role liên tài khoản
CREDS=$(aws sts assume-role \
  --role-arn arn:aws:iam::SHARED_SERVICES_ACCOUNT_ID:role/CrossAccountECRReadRole \
  --role-session-name EC2PullSession)

# Trích xuất credential tạm thời
export AWS_ACCESS_KEY_ID=$(echo $CREDS | jq -r '.Credentials.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo $CREDS | jq -r '.Credentials.SecretAccessKey')
export AWS_SESSION_TOKEN=$(echo $CREDS | jq -r '.Credentials.SessionToken')

# Đăng nhập ECR
aws ecr get-login-password --region ap-northeast-1 | \
  docker login --username AWS --password-stdin SHARED_SERVICES_ACCOUNT_ID.dkr.ecr.ap-northeast-1.amazonaws.com

# Kéo image
docker pull SHARED_SERVICES_ACCOUNT_ID.dkr.ecr.ap-northeast-1.amazonaws.com/my-app:latest
```

**Bước 4: Test truy cập liên tài khoản**

Trên EC2 của Production, chạy:

```bash
# Test có thể Assume Role không
aws sts get-caller-identity
# Nên hiển thị: arn:aws:sts::PRODUCTION_ACCOUNT_ID:assumed-role/CrossAccountECRReadRole/EC2PullSession

# Test có thể list ECR repo của Shared Services không
aws ecr describe-repositories --registry-id SHARED_SERVICES_ACCOUNT_ID
```

**Hoàn thành!** Giờ EC2 của Production có thể kéo image từ Shared Services an toàn mà không chia sẻ credential dài hạn nào.

---

## 7. Thực hành: Xây dựng hệ thống quyền an toàn

### 7.1 Xây dựng kiến trúc quyền từ đầu

<BestPracticesDemo />

Giả sử bạn là tech lead của startup 10 người, cần thiết kế kiến trúc quyền AWS từ đầu. Các bước khuyến nghị:

**Giai đoạn 1: Bảo vệ tài khoản root (Ngày 1)**

```
Mục tiêu: Bảo vệ tài khoản root, tài khoản quan trọng nhất

1. Bật MFA cho tài khoản root (bắt buộc)
   - Khuyến nghị hardware MFA (YubiKey) hoặc Google Authenticator

2. Tạo tài khoản admin IAM
   - Username: admin (hoặc tên bạn)
   - Quyền: AdministratorAccess (nhưng sẽ thu hẹp dần)
   - Bật MFA

3. Xóa Access Key của tài khoản root (nếu đã tạo)
   - Tài khoản root không bao giờ nên có AK/SK

4. Cấu hình cảnh báo sử dụng tài khoản root
   - Dùng CloudWatch + SNS, gửi email/SMS khi tài khoản root đăng nhập
```

**Giai đoạn 2: Phân nhóm quyền team (Tuần 1)**

```
Mục tiêu: Nhóm thành viên, quản lý quyền hàng loạt

1. Phân tích vai trò team:
   - Backend (2 người)
   - Frontend (1 người)
   - Mobile (1 người)
   - Product Manager (1 người)
   - Designer (1 người)
   - Founder/Admin (3 người)

2. Tạo IAM Groups:

   Group: Developers
   ├── Thành viên: tất cả dev (backend, frontend, mobile)
   ├── Quyền:
   │   ├── EC2: start, stop, view (nhưng không xóa instance của người khác)
   │   ├── S3: đọc/ghi bucket môi trường dev
   │   ├── RDS: chỉ đọc (không sửa database production)
   │   └── CloudWatch: xem log
   └── Giới hạn: chỉ hoạt động ở region ap-northeast-1

   Group: ProductTeam
   ├── Thành viên: Product Manager, designer
   ├── Quyền:
   │   ├── S3: chỉ đọc (xem file dữ liệu)
   │   ├── CloudWatch Dashboard: xem biểu đồ monitoring
   │   └── Cost Explorer: xem hóa đơn (nhưng không sửa)
   └── Giới hạn: chỉ đọc, không sửa tài nguyên nào

   Group: Administrators
   ├── Thành viên: founder, tech lead
   ├── Quyền: AdministratorAccess
   └── Yêu cầu: phải dùng MFA khi thao tác

3. Tạo IAM User cho mỗi người, thêm vào Group tương ứng
   - Không gắn quyền trực tiếp cho cá nhân, quản lý qua Group
   - Bật MFA (bắt buộc)
```

**Giai đoạn 3: Tối ưu quyền tầng ứng dụng (Tuần 2-4)**

```
Mục tiêu: Để ứng dụng truy cập tài nguyên AWS an toàn

1. EC2 instance dùng Instance Profile
   - Không còn cấu hình AK/SK trên server
   - Tạo IAM Role, gắn quyền cần thiết (như S3 đọc/ghi)
   - Tạo Instance Profile, liên kết Role này
   - Khi khởi động EC2, chọn Instance Profile này
   - Code ứng dụng dùng boto3 trực tiếp, không cần cấu hình credential

2. Nếu bắt buộc dùng AK/SK (tích hợp bên thứ ba)
   - Dùng AWS Secrets Manager lưu AK/SK
   - Ứng dụng đọc từ Secrets Manager khi khởi động
   - Cấu hình rotate định kỳ (90 ngày)
   - Monitor usage AK/SK

3. Cấu hình CloudTrail ghi nhận tất cả API call
   - Tạo S3 bucket riêng lưu log
   - Cấu hình log file validation (chống sửa đổi)
   - Cấu hình SNS notification cho event quan trọng (như sử dụng root, thay đổi policy)
```

**Giai đoạn 4: Củng cố an ninh (liên tục)**

```
Mục tiêu: Xây dựng cơ chế giám sát và cải thiện an ninh liên tục

1. Kích hoạt AWS Config
   - Monitor thay đổi cấu hình tài nguyên
   - Kiểm tra compliance (như security group có mở 0.0.0.0/0 không)

2. Kích hoạt IAM Access Analyzer
   - Phân tích liên tục resource policy
   - Xác định truy cập bên ngoài (như S3 bucket có public không)

3. Audit định kỳ cấu hình IAM
   - Kiểm tra hàng tháng IAM User, Role không sử dụng
   - Kiểm tra usage của Access Key
   - Xác minh thành viên Group có hợp lý không

4. Xây dựng quy trình phản hồi sự cố an ninh
   - Nếu phát hiện AK/SK bị lộ: xóa ngay, rotate, audit phạm vi ảnh hưởng
   - Nếu phát hiện API call bất thường: điều tra ngay, hạn chế quyền
```

---

## 8. Lầm tưởng phổ biến và hướng tránh

### 8.1 Mười anti-pattern IAM

| # | Anti-pattern | Tại sao không tốt | Cách đúng |
| :-- | :--------------------------- | :--------------------------------------------- | :----------------------------------------------- |
| 1 | Dùng tài khoản root cho thao tác hàng ngày | Root có tất cả quyền, nếu lộ không giới hạn thiệt hại | Tạo tài khoản admin IAM, chỉ dùng root khi cần |
| 2 | Cho tất cả mọi người AdministratorAccess | Vi phạm nguyên tắc quyền tối thiểu, tăng rủi ro sai sót và đe dọa nội bộ | Phân nhóm theo vai trò, chỉ cấp quyền cần thiết |
| 3 | Hardcode AK/SK trong code | AK/SK dễ lộ qua GitHub, khó rotate | Dùng IAM Role, biến môi trường hoặc dịch vụ quản lý secret |
| 4 | Không rotate AK/SK lâu dài | Tăng cửa sổ rủi ro khi credential bị lộ | Thiết lập policy rotate 90 ngày, hoặc tốt hơn - dùng credential tạm thời |
| 5 | Bỏ qua MFA | Mật khẩu lộ là tài khoản mất ngay | Bật MFA cho tất cả IAM user, đặc biệt user quyền cao |
| 6 | Không dùng CloudTrail | Không audit được ai đã làm gì, sau sự cố không trace được | Bật CloudTrail, lưu log ở tài khoản audit riêng |
| 7 | IAM Policy quá rộng | Như `Resource: "*"`, `Action: "*"`, tăng attack surface | Chỉ định rõ ARN resource và Action cụ thể |
| 8 | Không dọn IAM User của nhân viên đã nghỉ | Account zombie có thể thành backdoor | Xây dựng quy trình offboarding, vô hiệu và xóa IAM User ngay |
| 9 | Không dùng IAM Access Analyzer | Không phát hiện resource policy quá rộng (như S3 bucket public) | Bật IAM Access Analyzer, kiểm tra định kỳ truy cập bên ngoài |
| 10 | Không test Policy ở môi trường test | Apply trực tiếp trên production có thể gây gián đoạn dịch vụ | Dùng IAM Policy Simulator test, validate ở môi trường test trước |

---

## 9. Bảng thuật ngữ

| Thuật ngữ tiếng Anh | Tiếng Việt | Giải thích |
| :--------------------------------------- | :-------------- | :----------------------------------------- |
| **IAM (Identity and Access Management)** | Quản lý danh tính và truy cập | Dịch vụ quản lý danh tính người dùng và quyền truy cập trên đám mây |
| **RAM (Resource Access Management)** | Quản lý truy cập tài nguyên | Tên dịch vụ IAM của Alibaba Cloud |
| **Root Account** | Tài khoản root | Tài khoản chủ sở hữu tạo khi đăng ký tài khoản đám mây, có quyền cao nhất |
| **IAM User** | IAM User / Tài khoản con | Danh tính phụ do root tạo, dùng cho thao tác hàng ngày |
| **IAM Role** | IAM Role | Bộ chứa quyền tạm thời, không có credential dài hạn, cần được "đóng" |
| **IAM Policy** | IAM Policy | Định nghĩa rule quyền dạng JSON |
| **ARN** | Amazon Resource Name | Định danh tài nguyên toàn cục duy nhất |
| **AK/SK** | Access Key / Secret Key | Credential truy cập API đám mây theo chương trình |
| **STS** | Security Token Service | Dịch vụ cung cấp credential bảo mật tạm thời |
| **MFA** | Multi-Factor Authentication | Phương thức xác thực yêu cầu hai hoặc nhiều yếu tố |
| **SSO** | Single Sign-On | Phương thức xác thực đăng nhập một lần truy cập nhiều hệ thống |
| **ExternalId** | External ID | Định danh bảo mật dùng để ngăn tấn công confused deputy |
| **CloudTrail** | Dịch vụ audit đám mây | Dịch vụ log ghi nhận tất cả API call và thao tác trong tài khoản đám mây |

---

## Tổng kết: Nguyên tắc cốt lõi của quản lý quyền tài khoản đám mây

Quản lý quyền tài khoản đám mây không phải làm một lần là xong, mà cần tiến hóa liên tục theo quy mô team và nhu cầu kinh doanh:

1. **Giai đoạn khởi đầu** (1-10 người):
   - Bảo vệ tài khoản root (MFA + không dùng root thao tác hàng ngày)
   - Tạo tài khoản admin IAM
   - Phân nhóm cơ bản (Developers, Admins)

2. **Giai đoạn tăng trưởng** (10-50 người):
   - Phân nhóm quyền chi tiết (frontend, backend, ops, product, v.v.)
   - Dùng IAM Role thay AK/SK
   - Bật CloudTrail audit
   - Audit quyền định kỳ

3. **Giai đoạn trưởng thành** (50+ người / đa tài khoản):
   - Kiến trúc đa tài khoản (Dev, Staging, Prod tách biệt)
   - Tài khoản audit log tập trung
   - Audit quyền tự động và cảnh báo
   - Quy trình xin và phê duyệt quyền hoàn chỉnh

**Ba nguyên tắc cốt lõi cần nhớ**:

1. **Nguyên tắc quyền tối thiểu**: Chỉ cấp quyền cần thiết, không cho AdministratorAccess
2. **Không dùng credential dài hạn**: Ưu tiên IAM Role và credential tạm thời, tránh lộ AK/SK
3. **Bật MFA**: Đặc biệt tài khoản root và tài khoản quyền cao, đây là biện pháp bảo mật hiệu quả nhất

---

> **Đọc thêm**:
>
> - [Tài liệu chính thức AWS IAM](https://docs.aws.amazon.com/iam/)
> - [Tài liệu chính thức Alibaba Cloud RAM](https://www.aliyun.com/product/ram)
> - [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)

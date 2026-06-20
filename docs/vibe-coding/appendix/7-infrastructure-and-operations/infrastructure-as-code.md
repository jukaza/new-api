# Hạ tầng dưới dạng Mã

::: tip Lời nói đầu
**Bạn đã từng trải qua cơn ác mộng này chưa: máy chủ sản xuất bị lỗi, nhưng không ai nhớ ban đầu đã cấu hình như thế nào?** Đăng nhập thủ công vào máy chủ, gõ lệnh theo trí nhớ, cầu nguyện không gõ sai — đây là hoạt động hàng ngày của vận hành truyền thống. Hạ tầng dưới dạng Mã (Infrastructure as Code, IaC) đã thay đổi hoàn toàn điều này: dùng mã để định nghĩa và quản lý hạ tầng, khiến cấu hình máy chủ có thể kiểm soát phiên bản, tái lập và kiểm toán như phần mềm.
:::

**Bài viết này sẽ giúp bạn học được gì?**

Sau khi học xong chương này, bạn sẽ có được:

- **Khái niệm cốt lõi**: hiểu IaC là gì, tại sao nó là nền tảng của vận hành hiện đại
- **Nhận thức quy trình làm việc**: nắm vững bốn giai đoạn của Terraform: Write → Plan → Apply → Destroy
- **Lựa chọn công cụ**: hiểu ưu nhược điểm của Terraform, Pulumi, CloudFormation và các công cụ phổ biến
- **Nhận thức rủi ro**: hiểu tác hại của trôi dạt cấu hình và phương pháp phát hiện
- **Thực hành tốt nhất**: nắm vững phương pháp quản lý kỹ thuật các dự án IaC

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Khái niệm IaC | Vận hành thủ công vs quản lý bằng mã |
| **Chương 2** | Quy trình Terraform | Write → Plan → Apply |
| **Chương 3** | So sánh công cụ | Terraform, Pulumi, CDK |
| **Chương 4** | Trôi dạt cấu hình | Phát hiện, phòng ngừa, sửa chữa |
| **Chương 5** | Thực hành tốt nhất | Module hóa, quản lý state, CI/CD |

---

## 0. Toàn cảnh: Tại sao hạ tầng cũng cần "mã nguồn"?

Tưởng tượng bạn là một đầu bếp. Nếu mỗi món ăn đều nấu theo cảm giác, hôm nay một thìa muối, ngày mai hai thìa, hương vị không bao giờ ổn định. Nhưng nếu bạn viết công thức ra — chính xác đến từng gram gia vị — bất kỳ ai cũng có thể tái tạo cùng một hương vị.

Quản lý hạ tầng đối mặt với vấn đề tương tự. Cấu hình một máy chủ có thể liên quan đến hệ điều hành, quy tắc mạng, nhóm bảo mật, ổ đĩa lưu trữ, biến môi trường và hàng chục tham số. Cấu hình thủ công không chỉ dễ sai mà còn **không thể tái lập, không thể kiểm toán, không thể quay lại**.

::: tip Giá trị cốt lõi của IaC
- **Có thể tái lập**: cùng một mã, dù thực thi bao nhiêu lần, kết quả đều giống nhau (tính lũy đẳng)
- **Kiểm soát phiên bản**: thay đổi hạ tầng được quản lý bằng Git, ai đổi gì, tại sao đổi, nhìn thấy ngay
- **Có thể kiểm toán**: mọi thay đổi đều có ghi chép, đáp ứng yêu cầu tuân thủ
- **Tự động hóa**: triển khai tự động qua pipeline CI/CD, loại bỏ rủi ro thao tác thủ công
- **Hợp tác**: thành viên nhóm xem xét thay đổi hạ tầng qua Pull Request, giống như xem xét mã
:::

---

## 1. Khái niệm IaC: Từ "nhấp thủ công" đến "khai báo bằng mã"

Cách làm vận hành truyền thống: đăng nhập bảng điều khiển nền tảng đám mây, nhấp thủ công tạo máy chủ, cấu hình mạng, thiết lập nhóm bảo mật. Phương pháp này tạm được khi quản lý vài máy chủ, nhưng khi quy mô tăng lên hàng chục, hàng trăm máy chủ, nó trở thành ác mộng.

Tư tưởng cốt lõi của IaC là: **dùng mã khai báo để mô tả trạng thái hạ tầng mong muốn, để công cụ tự động thực hiện**. Bạn không cần nói cho công cụ biết "trước tiên tạo VPC, sau đó tạo subnet, rồi tạo nhóm bảo mật" (mệnh lệnh), chỉ cần nói "tôi muốn một môi trường mạng như thế này" (khai báo), công cụ sẽ tự động tính toán các bước cần thực hiện.

<IaCConceptDemo />

| Chiều | Vận hành thủ công | Hạ tầng dưới dạng mã |
|------|---------|--------------|
| Cách hoạt động | Đăng nhập bảng điều khiển nhấp | Viết tệp mã |
| Khả năng tái lập | Phụ thuộc tài liệu và trí nhớ | Mã là tài liệu, 100% tái lập |
| Theo dõi thay đổi | Không ghi chép hoặc không đầy đủ | Kiểm soát phiên bản Git, lịch sử đầy đủ |
| Cách hợp tác | Truyền miệng, truyền tài liệu | Xem xét qua Pull Request |
| Khả năng rollback | Thao tác ngược thủ công | git revert + apply lại |
| Tính nhất quán | Chênh lệch lớn giữa các môi trường | Dev/test/production hoàn toàn giống nhau |

::: tip Khai báo vs Mệnh lệnh
- **Khai báo (Declarative)**: mô tả "tôi muốn gì", công cụ tự động tính "làm thế nào". Terraform, CloudFormation dùng cách này. Ưu điểm: tính lũy đẳng tốt. Nhược điểm: linh hoạt hạn chế.
- **Mệnh lệnh (Imperative)**: mô tả "làm thế nào", thực hiện từng bước. Ansible, script Shell dùng cách này. Ưu điểm: linh hoạt. Nhược điểm: khó đảm bảo tính lũy đẳng.
- **Kết hợp**: Pulumi, AWS CDK dùng ngôn ngữ lập trình phổ thông, kết hợp quản lý trạng thái khai báo và linh hoạt mệnh lệnh.
:::

---

## 2. Quy trình làm việc Terraform: Write → Plan → Apply

Terraform là công cụ IaC phổ biến nhất hiện nay, do HashiCorp phát triển. Quy trình làm việc rõ ràng trực quan, chia thành bốn giai đoạn, giống như "mã hóa → xem xét → triển khai → dọn dẹp" của phát triển phần mềm.

<TerraformWorkflowDemo />

::: tip Quy trình bốn giai đoạn
1. **Write (Viết)**: Viết tệp định nghĩa hạ tầng (.tf) bằng HCL (HashiCorp Configuration Language). Khai báo tài nguyên bạn cần: máy chủ, cơ sở dữ liệu, mạng, v.v.
2. **Plan (Lập kế hoạch)**: Chạy `terraform plan`, Terraform so sánh trạng thái hiện tại với trạng thái mục tiêu, tạo "kế hoạch thực hiện" — cho bạn biết nó định tạo, sửa, xóa tài nguyên nào. Đây là lưới an toàn, giúp bạn xác nhận thay đổi trước khi thực sự thực thi.
3. **Apply (Thực thi)**: Xác nhận kế hoạch không có vấn đề, chạy `terraform apply`, Terraform tạo hoặc sửa tài nguyên theo kế hoạch. Sau khi hoàn thành, trạng thái hiện tại được lưu vào tệp trạng thái (terraform.tfstate).
4. **Destroy (Phá hủy)**: Khi không còn cần, chạy `terraform destroy` dọn dẹp tất cả tài nguyên, tránh phát sinh chi phí không cần thiết.
:::

| Lệnh | Tác dụng | Có sửa hạ tầng? | Trường hợp sử dụng |
|------|------|----------------|---------|
| `terraform init` | Khởi tạo dự án, tải Provider | Không | Lần đầu hoặc thêm Provider mới |
| `terraform plan` | Xem trước thay đổi, tạo kế hoạch thực hiện | Không | Phải chạy trước mỗi lần thay đổi |
| `terraform apply` | Thực thi thay đổi, tạo/sửa tài nguyên | Có | Chạy sau khi xác nhận plan |
| `terraform destroy` | Phá hủy tất cả tài nguyên | Có | Dọn dẹp môi trường test, ngừng dịch vụ |
| `terraform state` | Xem/quản lý tệp trạng thái | Tùy thao tác | Di chuyển state, nhập tài nguyên |

---

## 3. So sánh công cụ: Chọn công cụ IaC phù hợp

Lĩnh vực IaC có nhiều công cụ, mỗi cái có thế mạnh riêng. Khi chọn công cụ cần xem xét công nghệ của đội ngũ, nền tảng đám mây, quy mô dự án. Không có công cụ "tốt nhất", chỉ có công cụ phù hợp nhất với kịch bản của bạn.

<IaCToolComparisonDemo />

| Công cụ | Ngôn ngữ | Hỗ trợ đám mây | Đường cong học | Trường hợp sử dụng |
|------|------|-----------|---------|---------|
| Terraform | HCL | Đa đám mây (AWS/Azure/GCP) | Trung bình | Môi trường đa đám mây, hợp tác nhóm |
| Pulumi | Python/TS/Go | Đa đám mây | Thấp (quen ngôn ngữ lập trình) | Thân thiện với dev, logic phức tạp |
| AWS CloudFormation | JSON/YAML | Chỉ AWS | Trung bình | Môi trường thuần AWS |
| AWS CDK | Python/TS/Java | Chỉ AWS | Thấp | AWS + thích ngôn ngữ lập trình |
| Ansible | YAML | Đa đám mây + bare metal | Thấp | Quản lý cấu hình, môi trường hỗn hợp |

::: tip Chọn như thế nào?
- **Đội khởi nghiệp / Đám mây đơn**: CloudFormation (AWS) hoặc công cụ gốc của nền tảng đám mây tương ứng, tích hợp hệ sinh thái tốt nhất
- **Đa đám mây / Đội trung lớn**: Terraform, cộng đồng lớn nhất, Provider phong phú nhất, tuyển dụng dễ nhất
- **Đội do developer dẫn dắt**: Pulumi hoặc CDK, viết hạ tầng bằng ngôn ngữ lập trình quen thuộc, hỗ trợ IDE tốt
- **Cần quản lý cấu hình**: Ansible, xuất sắc trong cấu hình nội bộ máy chủ (cài phần mềm, sửa tệp cấu hình)
:::

---

## 4. Trôi dạt cấu hình: Quả bom nổ chậm âm thầm

Trôi dạt cấu hình (Configuration Drift) là kẻ thù nguy hiểm nhất trong thực hành IaC. Nó là **sự sai lệch dần dần giữa trạng thái hạ tầng thực tế và trạng thái được định nghĩa trong mã**.

Sự sai lệch này thường sinh ra như thế nào? Ai đó để "sửa nhanh" một vấn đề trên sản xuất, đăng nhập bảng điều khiển sửa thủ công quy tắc nhóm bảo mật; ai đó để debug, tạm tăng cấu hình máy chủ nhưng quên sửa lại. Những "thay đổi nhỏ" này tích lũy theo thời gian, cuối cùng dẫn đến mã và môi trường thực tế lệch nhau nghiêm trọng.

<ConfigDriftDemo />

::: tip Tác hại của trôi dạt cấu hình
1. **Không thể tái lập**: môi trường mã mô tả không khớp môi trường thực tế, tạo môi trường mới sẽ gặp vấn đề
2. **Rollback thất bại**: tưởng rằng revert về phiên bản trước là khôi phục, nhưng môi trường thực tế đã bị sửa thủ công
3. **Rủi ro bảo mật**: cổng được mở thủ công, quyền được nới lỏng có thể bị quên, trở thành lỗ hổng tấn công
4. **Kiểm toán vô hiệu**: kiểm toán tuân thủ dựa trên mã, nhưng mã không phản ánh trạng thái thực tế
:::

| Biện pháp phòng ngừa | Mô tả |
|---------|------|
| Cấm thay đổi thủ công | Hạn chế quyền thao tác bảng điều khiển qua chính sách IAM |
| Phát hiện trôi dạt định kỳ | Chạy `terraform plan` định kỳ kiểm tra khác biệt |
| Sửa chữa tự động | Khi phát hiện trôi dạt, tự động chạy apply khôi phục nhất quán |
| Kiểm toán thay đổi | Bật CloudTrail và log kiểm toán khác, truy nguồn mọi thay đổi |

---

## 5. Thực hành tốt nhất: Khi dự án IaC phát triển bền vững

Mã IaC giống như mã ứng dụng, cần thực hành kỹ thuật tốt để đảm bảo khả năng bảo trì. Khi quy mô hạ tầng tăng lên, mã IaC không có phương pháp sẽ trở thành "nợ kỹ thuật" dưới dạng khác.

<IaCBestPracticeDemo />

::: tip Sáu thực hành tốt nhất cốt lõi
1. **Module hóa**: trừu tượng hóa hạ tầng tái sử dụng thành module (như module VPC, module cơ sở dữ liệu), tránh copy-paste. Giống như viết hàm, định nghĩa một lần, gọi nhiều nơi.
2. **Cách ly môi trường**: dev, test, production sử dụng tệp trạng thái và tệp biến độc lập, cách ly qua workspace hoặc cấu trúc thư mục.
3. **Quản lý trạng thái từ xa**: tệp trạng thái (tfstate) lưu ở backend từ xa (S3 + DynamoDB), hỗ trợ hợp tác nhóm và khóa trạng thái, tránh xung đột đồng thời.
4. **Quản lý thông tin nhạy cảm**: mật khẩu, khóa và thông tin nhạy cảm không viết trong mã, dùng Vault, AWS Secrets Manager và các công cụ khác.
5. **Tích hợp CI/CD**: tích hợp `terraform plan` vào quy trình PR, `apply` chạy tự động qua pipeline, loại bỏ thao tác thủ công cục bộ.
6. **Xem xét mã**: thay đổi hạ tầng cần Code Review giống như mã ứng dụng, đặc biệt thay đổi liên quan nhóm bảo mật, chính sách IAM.
:::

---

## Tóm tắt

Hạ tầng dưới dạng Mã là nền tảng của vận hành cloud-native hiện đại. Nó biến "thao tác thủ công không thể mô tả" thành "mã có thể kiểm soát phiên bản", đưa quản lý hạ tầng từ "nghệ thuật" thành "kỹ thuật".

Ôn lại các điểm chính của chương này:

1. **Bản chất IaC**: dùng mã khai báo trạng thái hạ tầng mong muốn, để công cụ tự động thực hiện
2. **Quy trình Terraform**: ba bước Write → Plan → Apply, Plan là lưới an toàn
3. **Lựa chọn công cụ**: đa đám mây chọn Terraform, đám mây đơn chọn công cụ gốc, đội developer chọn Pulumi
4. **Trôi dạt cấu hình**: rủi ro ẩn giấu nhất, cần phòng vệ kép bằng quy trình và công cụ
5. **Quản lý kỹ thuật**: module hóa, cách ly môi trường, trạng thái từ xa, tích hợp CI/CD đều không thể thiếu

## Đọc thêm

- [Hướng dẫn Terraform chính thức](https://developer.hashicorp.com/terraform/tutorials) - Học Terraform từ con số không
- [Tài liệu Pulumi](https://www.pulumi.com/docs/) - Viết hạ tầng bằng ngôn ngữ lập trình
- [AWS CDK Workshop](https://cdkworkshop.com/) - Hướng dẫn thực hành AWS CDK
- [Infrastructure as Code (O'Reilly)](https://www.oreilly.com/library/view/infrastructure-as-code/9781098114664/) - Sách kinh điển trong lĩnh vực IaC
- [Spacelift Blog](https://spacelift.io/blog) - Thực hành tốt nhất IaC và xu hướng ngành

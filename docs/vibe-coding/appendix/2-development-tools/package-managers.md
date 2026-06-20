# Trình quản lý gói

> 💡 **Hướng dẫn học**: Viết code không cần phát minh lại bánh xe — 99% tính năng đã có người viết và xuất bản trên internet. **Trình quản lý gói** chính là công cụ giúp bạn tìm, tải và quản lý những "linh kiện sẵn có" đó. Chương này tập trung vào một câu hỏi cốt lõi: **Làm sao để dependency code có thể tái lập, hợp tác, và bảo trì?**

---

## 0. Tại sao bạn chắc chắn sẽ dùng trình quản lý gói?

Tưởng tượng bạn muốn viết một chương trình Node.js có thể gửi HTTP request. Có hai con đường:

- **Cách A (thủ công)**: Tự triển khai kết nối TCP, phân tích giao thức HTTP, xử lý redirect, cơ chế timeout... ước tính hàng ngàn dòng code, debug vài tháng.
- **Cách B (trình quản lý gói)**: `npm install axios`, mười giây, một dòng lệnh xong.

Trình quản lý gói bản chất là **"App Store của code"**. Nó giúp bạn:

1. Tìm thư viện người khác xuất bản trong kho trung tâm (Registry)
2. Tự động tải và cài vào dự án
3. Xử lý thư viện mà thư viện đó phụ thuộc (dependency của dependency)
4. Ghi nhận bạn đang dùng version chính xác nào, để làm việc nhóm không có vấn đề

---

## 1. Tổng quan trình quản lý gói theo hệ sinh thái/ngôn ngữ

Các ngôn ngữ lập trình và hệ điều hành khác nhau có chuỗi công cụ riêng, nhưng logic bên dưới hoàn toàn giống nhau.

👇 **Thử click**: Chọn hệ sinh thái bạn quen, khám phá công cụ phổ biến của nó.

<PackageManagerOverviewDemo />

### 1.1 Tải gói ở đâu? — Registry (Kho đăng ký)

Mỗi hệ sinh thái có một kho trung tâm, lưu trữ tất cả các gói có thể tải:

| Hệ sinh thái | Registry | Số lượng gói |
| :--- | :--- | :--- |
| JavaScript | [npmjs.com](https://npmjs.com) | 2 triệu+ |
| Python | [pypi.org](https://pypi.org) | 500 nghìn+ |
| Rust | [crates.io](https://crates.io) | 150 nghìn+ |
| Go | [pkg.go.dev](https://pkg.go.dev) | 500 nghìn+ |
| macOS/Linux tools | [formulae.brew.sh](https://formulae.brew.sh) | 7000+ |
| Windows software | [winget.run](https://winget.run) / [chocolatey.org](https://chocolatey.org) | Hàng chục nghìn |

### 1.2 So sánh ba kỳ phùng JavaScript: npm vs yarn vs pnpm

Chức năng tương tự, khác biệt chủ yếu ở **tốc độ và dung lượng đĩa**:

```text
Dung lượng đĩa: pnpm (hardlink chia sẻ) < yarn PnP (không node_modules) < npm (sao chép đầy đủ)
Tốc độ cài: pnpm ≈ yarn > npm
Thói quen dùng: npm (phổ biến nhất) > pnpm (khuyên dùng dự án mới) > yarn (một số team)
```

**Khuyến nghị**: Dự án mới dùng `pnpm`, dự án cũ giữ nguyên công cụ, không đổi lung tung.

### 1.3 So sánh ba kỳ phùng Windows: winget vs Chocolatey vs Scoop

| | winget | Chocolatey | Scoop |
| :--- | :--- | :--- | :--- |
| **Đỡ đầu chính thức** | Microsoft | Bên thứ ba | Bên thứ ba |
| **Cần admin** | Một phần cần | Có | **Không** |
| **Phù hợp** | Cài phần mềm hàng ngày | Triển khai doanh nghiệp số lượng lớn | Quản lý công cụ dev |
| **Số gói** | Nhiều và tăng nhanh | Nhiều nhất (10000+) | Tập trung công cụ dev |

**Khuyến nghị**: Hàng ngày dùng `winget`, công cụ dev dùng `scoop`, tự động hóa doanh nghiệp dùng `Chocolatey`.

---

## 2. Cài gói — Phía sau xảy ra chuyện gì?

Gõ `npm install axios`, terminal im lặng mấy giây rồi xong. Trong mấy giây đó đã xảy ra gì?

👇 **Thử click**: Chọn một gói, nhấn "run", quan sát toàn bộ quá trình cài đặt.

<PackageInstallDemo />

### 2.1 Bốn giai đoạn chi tiết

**① Giải quyết dependency (Resolve)**

Trình quản lý trước tiên "đọc hiểu" bạn muốn cài gì. Ví dụ `axios` phụ thuộc `follow-redirects`, `form-data`, v.v., cũng phải cài. Quá trình này gọi là **xây dựng cây dependency**.

**② Tải về (Fetch)**

Tải tất cả gói cần thiết từ Registry (file nén `.tgz`). Trình quản lý thông minh sẽ:
- Tải song song nhiều gói, thay vì chờ từng cái
- Kiểm tra cache local trước, trúng thì không cần mạng

**③ Liên kết (Link)**

Giải nén gói đã tải đặt vào thư mục `node_modules/`, xử lý quan hệ tham chiếu.

**④ Ghi lockfile**

Ghi lại **số version chính xác** lần cài này vào `package-lock.json` (hoặc `yarn.lock` / `pnpm-lock.yaml`).

### 2.2 Tra cứu nhanh lệnh thường dùng

```bash
# ── JavaScript (npm) ──────────────────────────────────
npm install              # Cài tất cả dependency theo package.json
npm install axios        # Cài gói mới (dependency production)
npm install -D jest      # Cài dependency dev (chỉ dùng khi phát triển)
npm install -g tsx       # Cài global (dùng được ở mọi thư mục)
npm uninstall axios      # Gỡ cài gói
npm update               # Nâng cấp tất cả gói lên version compatible mới nhất
npm run build            # Chạy script trong package.json
npx create-react-app .   # Chạy tạm, không cài vào dự án

# ── Python (pip) ──────────────────────────────────────
pip install requests           # Cài gói
pip install requests==2.28.0   # Cài version cụ thể
pip freeze > requirements.txt  # Xuất danh sách dependency hiện tại
pip install -r requirements.txt # Cài theo danh sách

# ── Rust (cargo) ──────────────────────────────────────
cargo add serde    # Thêm dependency (tự cập nhật Cargo.toml)
cargo build        # Build dự án
cargo test         # Chạy test
cargo run          # Chạy dự án

# ── Go (go mod) ───────────────────────────────────────
go get github.com/gin-gonic/gin  # Thêm dependency
go mod tidy                      # Dọn dẹp dependency
go build ./...                   # Build

# ── Windows (winget) ──────────────────────────────────
winget install Git.Git           # Cài phần mềm
winget upgrade --all             # Cập nhật tất cả phần mềm đã cài
```

### 2.3 npm scripts là gì?

Trong `package.json` có trường `scripts`, đây là **task runner** tích hợp sẵn của npm:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "jest",
    "lint": "eslint src/"
  }
}
```

Cách chạy: `npm run dev`, `npm run build`. Lợi ích:
- **Đầu vào thống nhất**: Thành viên team không cần nhớ lệnh cụ thể của từng công cụ
- **Tự động cấu hình môi trường**: Khi chạy sẽ tự thêm `node_modules/.bin` vào PATH

---

## 3. Cài global vs cài local

Đây là khái niệm dễ gây bối rối nhất cho người mới.

### 3.1 Sự khác biệt

```bash
npm install axios        # Local: cài vào ./node_modules/, chỉ dự án hiện tại dùng được
npm install -g typescript  # Global: cài vào thư mục hệ thống, mọi dự án/thư mục đều dùng được
```

| | Cài local | Cài global |
| :--- | :--- | :--- |
| **Vị trí** | `./node_modules/` | Thư mục hệ thống (ví dụ `/usr/local/lib/`) |
| **Phù hợp** | Thư viện dự án phụ thuộc (axios, vue, react) | Công cụ CLI (tsc, eslint, create-react-app) |
| **Cách ly version** | Mỗi dự án một version độc lập ✅ | Cả máy dùng chung một version ⚠️ |
| **Nhất quán team** | Lockfile đảm bảo nhất quán ✅ | Mỗi người version có thể khác ⚠️ |

### 3.2 Quy tắc vàng

> **Thư viện (axios, lodash, vue) luôn cài local;
> công cụ CLI (tsc, eslint) ưu tiên cài local, dùng `npx` gọi.**

**Tại sao công cụ CLI cũng nên cài local?**

Giả sử bạn cài global `eslint@8`, nhưng dự án A cần rule mới của `eslint@9`, bạn phải qua lại giữa global và dự án. Cài `eslint` local, dùng `npx eslint .`, mỗi dự án tự cấu hình version riêng.

### 3.3 npx — Chạy tạm, không ô nhiễm môi trường

`npx` là package runner tích hợp của npm, cho phép bạn **chạy mà không cần cài**:

```bash
# Không cài create-vue, chạy trực tiếp để khởi tạo dự án
npx create-vue my-project

# Không cài prettier, format file trực tiếp
npx prettier --write src/

# Ép dùng version cụ thể (bỏ qua đã cài)
npx typescript@5.4 tsc --version
```

Python với `uvx`, Rust với `cargo run` cũng cung cấp khả năng "chạy tạm" tương tự:

```bash
uvx ruff check .       # Python: chạy tạm ruff checker
cargo install ripgrep  # Rust: cài global, thành lệnh hệ thống rg
```

---

## 4. Bí mật số version — Semantic Versioning

Trong `package.json` bạn sẽ thấy:

```json
{
  "dependencies": {
    "axios": "^1.6.8",
    "typescript": "~5.4.0"
  }
}
```

`^` và `~` có nghĩa gì?

👇 **Thử click**: Hover lên các phần số version, hiểu ý nghĩa; click ký hiệu range xem version nào được chấp nhận.

<DependencyTreeDemo />

### 4.1 Tại sao không khóa cứng version?

| Cách làm | Ưu điểm | Nhược điểm |
| :--- | :--- | :--- |
| `"axios": "1.6.8"` (khóa chính xác) | Hoàn toàn dự đoán được | Patch bảo mật không tự cập nhật |
| `"axios": "^1.6.8"` (phạm vi tương thích, khuyến nghị) | Tự động nhận bug fix và tính năng mới | Hiếm khi引入 small incompatibility |
| `"axios": "*"` (bất kỳ version nào) | Luôn mới nhất | Major upgrade có thể phá code hoàn toàn |

**Thực hành tốt nhất**: Dùng `^` khai báo phạm vi + lockfile cố định version thực tế, dùng kết hợp.

### 4.2 Dependency hell là gì?

Khi bạn phụ thuộc 50 gói, mỗi gói lại phụ thuộc vài gói, "cây dependency" có thể hàng trăm node. Nếu hai gói bạn phụ thuộc cần **cùng một thư viện nhưng version không tương thích**, tạo ra "xung đột dependency".

Giải pháp của mỗi hệ sinh thái:
- **npm v3+**: Cùng major version nâng lên topLevel chia sẻ, khác major version cài riêng
- **pnpm**: Hardlink + cách ly nghiêm ngặt, ngăn chặn "phantom dependency"
- **cargo (Rust)****: Ở level ngôn ngữ ép mỗi gói chỉ phụ thuộc một version, tránh xung đột hoàn toàn
- **go mod (Go)**: Chiến lược Minimum Version Selection (MVS), chọn version thấp nhất thỏa mãn mọi ràng buộc

---

## 5. Lockfile — Nền tảng hợp tác team

### 5.1 Tại sao cần lockfile?

Giả sử `package.json` ghi `"axios": "^1.6.0"`:

- Hôm nay bạn cài → cài được `1.6.8`
- Ngày mai đồng nghiệp cài → có thể cài được `1.7.0` (tối qua mới xuất bản)
- Server CI tuần sau → có thể cài được `1.7.1`

Cùng một code, ba người ra kết quả khác nhau. **Lockfile** ghi lại version chính xác của mỗi gói, tất cả cài theo nó, kết quả hoàn toàn giống nhau.

| Kịch bản | Lệnh | Hành vi |
| :--- | :--- | :--- |
| Đồng bộ môi trường dev | `npm install` | Tham khảo lockfile, không nâng version |
| CI / deploy production | `npm ci` | **Nghiêm ngặt** cài theo lockfile, có khác biệt báo lỗi ngay |
| Nâng cấp version chủ động | `npm update` | Nâng cấp trong phạm vi cho phép, cập nhật lockfile |

### 5.2 Lockfile nên commit lên Git không?

**Ứng dụng phải commit, thư viện xuất bản lên npm có thể không.**

- ✅ **Web app, backend service**: Phải commit, đảm bảo deploy giống hệt dev
- ❌ **Thư viện xuất bản npm**: Thường không commit, người dùng thư viện có lockfile riêng
- ✅ **Dự án Python**: `requirements.txt` bản thân đã là lockfile, nên commit
- ✅ **Dự án Go**: `go.sum` phải commit, dùng kiểm tra tính toàn vẹn

---

## 6. Môi trường ảo Python

Python có một khái niệm cần đặc biệt lưu ý: **môi trường ảo (venv)**.

**Tại sao cần?**

Python mặc định cài gói **global**. Dự án A cần `requests==2.28`, dự án B cần `requests==2.31`, sẽ xung đột.

**Giải pháp**: Tạo môi trường ảo riêng cho mỗi dự án, không ảnh hưởng nhau.

```bash
# 1. Tạo môi trường ảo (chạy ở thư mục gốc dự án)
python -m venv .venv

# 2. Kích hoạt môi trường ảo
source .venv/bin/activate        # macOS / Linux
.venv\Scripts\activate           # Windows (CMD)
.venv\Scripts\Activate.ps1       # Windows (PowerShell)

# 3. Sau khi kích hoạt, pip install chỉ ảnh hưởng môi trường ảo hiện tại
pip install requests

# 4. Thoát môi trường ảo
deactivate
```

> ⚠️ **Vấn đề phổ biến trên Windows**: PowerShell mặc định cấm chạy script, cần chạy trước:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

**Giải pháp thay thế hiện đại**:
- `conda create -n myproject python=3.11` — Quản lý cả version Python
- `uv venv && source .venv/bin/activate` — Viết bằng Rust, tốc độ tạo cực nhanh

**`.venv` có nên commit lên Git không?**

Không! `.venv` sinh ra trên máy cục bộ, nên thêm vào `.gitignore`. Dùng `requirements.txt` hoặc `pyproject.toml` để mô tả dependency.

---

## 7. Tra cứu nhanh câu hỏi phổ biến

**Q: `node_modules` có nên commit lên Git không?**

Không! Thường nặng hàng trăm MB, nên thêm vào `.gitignore`. Có `package-lock.json`, bất kỳ ai cũng có thể `npm install` xây lại nhanh chóng.

**Q: Cài thất bại / báo lỗi kỳ lạ thì sao?**

```bash
# Xóa cache, xóa cài cũ, làm lại
npm cache clean --force
rm -rf node_modules package-lock.json   # macOS/Linux
rmdir /s /q node_modules && del package-lock.json  # Windows CMD
npm install
```

**Q: Cài quá chậm?**

```bash
# Chuyển sang mirror trong nước (khuyên ghi vào file .npmrc)
echo "registry=https://registry.npmmirror.com" > .npmrc

# pip cũng có thể cấu hình mirror
pip install requests -i https://pypi.tuna.tsinghua.edu.cn/simple
```

**Q: Gói có lỗ hổng bảo mật xử lý thế nào?**

```bash
npm audit          # Quét lỗ hổng đã biết
npm audit fix      # Tự sửa lỗ hổng compatible
npm audit fix --force  # Nâng cấp ép (có thể phá vỡ, dùng cẩn thận)
```

**Q: Làm sao biết một gói có đáng tin không?**

Trên [npmjs.com](https://npmjs.com) hoặc [bundlephobia.com](https://bundlephobia.com) xem:
- Lượt tải tuần (càng cao càng đáng tin)
- Lần cập nhật cuối (hơn 2 năm chưa cập nhật cần cẩn thận)
- Số dependency (càng nhiều, khả năng引入 vấn đề càng lớn)
- GitHub Stars và hoạt động Issues

**Q: Trên Windows phần mềm cài bằng winget ở đâu?**

winget mặc định cài vào thư mục hệ thống (cần admin) hoặc `%LOCALAPPDATA%\Microsoft\WindowsApps`. Scoop cài phần mềm tập trung tại `%USERPROFILE%\scoop\apps\`, dễ quản lý và di chuyển.

---

## 8. Bảng tra cứu thuật ngữ

| Thuật ngữ tiếng Anh | Dịch | Giải thích |
| :--- | :--- | :--- |
| **Package** | Gói / Thư viện | Module code do người khác viết và xuất bản |
| **Registry** | Kho đăng ký | Server lưu trữ trung tâm tất cả các gói (ví dụ npmjs.com) |
| **Dependency** | Phụ thuộc | Các gói khác mà dự án của bạn cần để chạy |
| **devDependency** | Phụ thuộc dev | Gói chỉ cần trong giai đoạn phát triển (test framework, build tool, v.v.) |
| **Lockfile** | File khóa | Ghi lại version chính xác, đảm bảo nhất quán môi trường |
| **SemVer** | Semantic Versioning | Quy tắc đặt tên version MAJOR.MINOR.PATCH |
| **node_modules** | Thư mục module | Thư mục npm lưu trữ thực tế các gói đã cài |
| **venv** | Môi trường ảo | Sandbox cách ly gói độc lập cho dự án Python |
| **tarball** | File nén | Định dạng phân phối gói, thường là file `.tgz` |
| **Hoisting** | Nâng lên | npm nâng sub-dependency lên topLevel tránh cài trùng |
| **Phantom Dependency** | Dependency ma | Gói không khai báo nhưng vẫn dùng được (pnpm ngăn được) |
| **npx** | — | Package runner tích hợp npm, chạy tạm gói mà không cần cài |
| **go.sum** | — | File hash kiểm tra module Go, chống sửa đổi dependency |
| **Crate** | — | Tên đơn vị "gói" trong hệ sinh thái Rust |
| **winget** | — | Trình quản lý gói chính thức Windows (tích hợp Windows 10/11) |

---

## Tóm tắt: Bản chất của trình quản lý gói

Bốn câu nhớ cốt lõi:

1. **Trình quản lý gói = App Store**: Giúp bạn tìm, cài, quản lý linh kiện code, không cần phát minh lại bánh xe.
2. **Lockfile = Hợp đồng team**: Cố định version chính xác, biến "trên máy tôi chạy tốt" thành lịch sử.
3. **Semantic Versioning = Ngôn ngữ giao tiếp**: `^` an toàn nhận cập nhật, MAJOR thay đổi phải cẩn thận.
4. **Local > Global**: Dependency dự án ưu tiên cài local, `npx` / `uvx` chạy tạm công cụ, giữ môi trường sạch.

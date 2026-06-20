# Biến môi trường và PATH

> 💡 **Hướng dẫn học**: Mỗi khi bạn gõ `git` hoặc `python` trong terminal, hệ thống phải tìm xem chương trình đó ở đâu. Mỗi khi code của bạn gọi API mô hình ngôn ngữ lớn, chương trình cần biết dùng khóa nào. Hai việc này đều dựa trên cùng một cơ chế — **biến môi trường**.

---

## 0. Mỗi chương trình đều mang theo một bộ cấu hình

Mỗi chương trình đang chạy đều giữ một bộ cấu hình dạng «key=value», gọi là **biến môi trường**. Chương trình có thể đọc các cấu hình này bất kỳ lúc nào để hiểu môi trường chạy hiện tại.

Nhấn vào bất kỳ biến nào trong danh sách bên dưới để "xem" giá trị của nó trong terminal:

<EnvVarOverviewDemo />

---

## 1. PATH: Shell tìm lệnh bạn nhập như thế nào

`PATH` là một biến môi trường đặc biệt, lưu một chuỗi đường dẫn thư mục (phân tách bằng dấu hai chấm). Khi bạn nhập `git`, Shell sẽ duyệt qua các thư mục theo thứ tự, tìm file thực thi tên `git` — dừng lại ngay khi tìm thấy cái đầu tiên.

```bash
$ echo $PATH
/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
```

Chọn một lệnh, quan sát quá trình Shell tìm kiếm từng thư mục:

<PathSearchDemo />

**Ba quy luật quan trọng**:
- Thư mục nằm càng gần đầu PATH, ưu tiên càng cao
- Dừng lại khi tìm thấy cái đầu tiên, không tiếp tục tìm kiếm
- Không có trong tất cả thư mục → `command not found`

---

## 2. Tại sao sau khi cài công cụ phải khởi động lại terminal?

Khi cài các công cụ như nvm, Homebrew, conda, script cài đặt sẽ tự động thêm một dòng vào `~/.zshrc` để đưa thư mục của nó vào PATH:

```bash
# Nội dung script cài đặt tự ghi (ví dụ)
export PATH="/usr/local/opt/python@3.12/bin:$PATH"
```

Dòng code này chỉ được thực thi khi **Shell mới khởi động**. Các cửa sổ terminal đã mở không bị ảnh hưởng, nên:

```bash
# Không cần khởi động lại cũng có thể có hiệu lực ngay
source ~/.zshrc
```

**Tình huống phổ biến với công cụ phát triển AI**:

```bash
# Ollama / pipx cài xong báo command not found
which ollama          # Xem vị trí cài thực tế

# Đường dẫn công cụ CLI cài bằng pip (thêm vào PATH)
# macOS: ~/Library/Python/3.x/bin
# Linux: ~/.local/bin
export PATH="$PATH:$HOME/.local/bin"

# Khuyên dùng pipx cài công cụ dòng lệnh, tự quản lý PATH
pipx install aider-chat
```

---

## 3. Phạm vi biến: Ai có thể thấy biến này?

Biến môi trường không được phát sóng cho tất cả các chương trình — mỗi tiến trình giữ **bản sao riêng của mình**, kế thừa từ tiến trình cha. Sửa bản sao của mình không ảnh hưởng đến tiến trình cha.

Sơ đồ dưới đây thể hiện ba cấp độ. Ở "cấp người dùng", export một biến mới, xem nó có xuất hiện ở "cấp tiến trình" không:

<EnvScopeDemo />

---

## 4. export: Quyết định tiến trình con có đọc được biến này không

Khi đặt biến, có thêm `export` hay không là hai việc hoàn toàn khác nhau:

<EnvExportDemo />

Để biến tồn tại vĩnh viễn giữa các phiên, ghi `export` vào file cấu hình:

```bash
# macOS (zsh)
echo 'export MY_VAR="value"' >> ~/.zshrc
source ~/.zshrc       # Hiệu lực ngay, không cần mở lại terminal

# Linux (bash)
echo 'export MY_VAR="value"' >> ~/.bashrc
source ~/.bashrc
```

---

## 5. Khóa API: Tuyệt đối không ghi vào code

Khi gọi API OpenAI, Anthropic, DeepSeek, v.v., khóa chính là "CMND + thẻ tín dụng" của bạn. Nếu bị lộ, người khác có thể dùng hạn mức của bạn, chi phí do bạn chịu.

Lỗi phổ biến nhất là ghi khóa trực tiếp vào code:

<ApiKeyDangerDemo />

---

## 6. Phát triển cục bộ: Dùng file .env để quản lý khóa

Trong phát triển cục bộ, đặt khóa vào file `.env` ở thư mục gốc dự án, code đọc qua thư viện dotenv. `.env` phải được thêm vào `.gitignore`, không được đẩy lên Git.

Bên trái viết cấu hình, bên phải đọc — chuyển ngôn ngữ để xem hai cách viết:

<DotEnvDemo />

---

## 7. Môi trường production: Để nền tảng chạy注入 khóa

`.env` là công cụ tiện lợi cho giai đoạn phát triển. Trên server và nền tảng đám mây, **môi trường chạy** nên chịu trách nhiệm注入 khóa, code本身 hoàn toàn không cần biết khóa nằm ở đâu:

<ServerSecretDemo />

---

## 8. Xử lý sự cố thực tế

### `command not found`

```bash
# Bước 1: Xác nhận có trong PATH không
which python3         # Có output nghĩa là đã tìm thấy

# Bước 2: Tìm vị trí thực tế của chương trình (macOS)
brew list python | grep bin

# Bước 3: Thêm thư mục vào PATH
export PATH="/đường/dẫn/tìm/được:$PATH"
source ~/.zshrc       # Nhớ source sau khi ghi vào file cấu hình
```

### Đã cài hai version, nhưng không dùng cái mình muốn

```bash
which python
# /usr/bin/python ← Phiên bản cũ của hệ thống, nằm trước trong PATH

# Đặt thư mục version mới lên đầu PATH
export PATH="/usr/local/bin:$PATH"

which python
# /usr/local/bin/python ← Version mới, giờ đã được ưu tiên
```

### Biến rõ ràng đã đặt nhưng chương trình không đọc được

| Nguyên nhân | Giải pháp |
|:---|:---|
| Quên `export` | Thêm `export` rồi thử lại |
| Sửa `~/.zshrc` chưa có hiệu lực | `source ~/.zshrc` |
| Dùng `.env` nhưng chưa cài dotenv | `pip install python-dotenv` / `npm install dotenv` |
| Trên server chỉ hiệu lực trong phiên SSH | Dùng `EnvironmentFile` của systemd |

---

## Bảng thuật ngữ

| Thuật ngữ | Ý nghĩa |
|:---|:---|
| **PATH** | Lưu danh sách thư mục Shell tìm file thực thi, phân tách bằng dấu hai chấm, thứ tự quyết định ưu tiên |
| **export** | Đánh dấu biến có thể kế thừa, tiến trình con tự động nhận bản sao khi khởi động |
| **source** | Thực thi lại file cấu hình trong Shell hiện tại, giúp thay đổi có hiệu lực ngay |
| **which** | Hiển thị đường dẫn file thực thi tương ứng với lệnh (kết quả tìm kiếm PATH) |
| **.env** | File cấu hình cục bộ dự án, lưu khóa dùng khi phát triển, phải thêm vào `.gitignore` |
| **.env.example** | Template tên biến đầy đủ, giá trị để trống, có thể đẩy lên Git an toàn |
| **chmod 600** | Quyền file: chỉ chủ sở hữu được đọc ghi, phù hợp bảo vệ file khóa |
| **Secret Scanner** | Quét tự động rò rỉ khóa trên GitHub, phát hiện thì thông báo nhà cung cấp thu hồi |

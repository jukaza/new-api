# Git: Cỗ máy thời gian của code

> 💡 **Hướng dẫn học**: Chương này viết riêng cho những người chưa từng dùng Git. Chúng ta sẽ không bắt bạn học thuộc lệnh ngay, mà sẽ làm rõ "Git giúp giải quyết vấn đề gì" trước, rồi mới kết nối lệnh và khái niệm từng bước. Đọc xong, bạn có thể tự hoàn thành: commit cục bộ, tạo branch, push lên GitHub.

---

## 0. Trước hết một câu hỏi: Bạn đã từng trải qua những cơn ác mộng này chưa?

**Kịch bản 1: Địa ngục phiên bản**

Bạn viết luận văn hoặc code, sửa đến một nửa phát hiện sửa sai, muốn quay lại phiên bản ba ngày trước — nhưng không tìm thấy.

```
du_an_v1.zip
du_an_v2_sua_doi.zip
du_an_v3_ban_cuoi.zip
du_an_v3_ban_cuoi_that_su_cuoi.zip
du_an_v3_ban_cuoi_chac_chan_khong_doi_nua.zip
```

Mỗi lần lưu một bản mới, ổ cứng càng lộn xộn, và bạn hoàn toàn không nhớ bản nào sửa cái gì.

**Kịch bản 2: Ác mộng hợp tác**

Bạn và đồng nghiệp cùng sửa một file:
- Bạn sửa dòng 10, thêm chức năng đăng nhập
- Đồng nghiệp sửa dòng 10, sửa một Bug
- Hai bên gửi code qua email, kết quả khi hợp nhất thì thay đổi của một người bị ghi đè
- Không ai biết đoạn code nào là đúng

**Kịch bản 3: Không có "thuốc hối tiếc"**

Bạn deploy code mới lên production, kết quả bị Bug, muốn quay gấp về phiên bản ổn định trước đó — nhưng không biết cách revert, chỉ loay hoay tìm backup.

---

**Git sinh ra chính là để giải quyết ba vấn đề này.**

Git là một **Hệ thống Quản lý Phiên bản** (Version Control System). Bản chất của nó là: **ghi lại mọi thao tác "lưu" của bạn, tạo thành một dòng thời gian lịch sử hoàn chỉnh, cho phép bạn quay lại bất kỳ thời điểm nào.**

Không nói quá, Git là một trong những công cụ quan trọng nhất của phát triển phần mềm hiện đại. Hầu hết các công ty, mọi dự án mã nguồn mở đều dùng nó.

---

## 1. Git và GitHub là một chứ?

Nhiều người mới học nhầm lẫn hai khái niệm này, hãy làm rõ:

| | Git | GitHub |
| :--- | :--- | :--- |
| **Là gì** | Công cụ quản lý phiên bản chạy trên máy tính của bạn | Trang web lưu trữ kho Git (trên đám mây) |
| **Ở đâu** | Máy tính cục bộ của bạn | Trên Internet |
| **Dùng độc lập được không** | ✅ Có thể, chỉ quản lý lịch sử cục bộ | ❌ Cần dùng cùng Git |
| **Ví dụ** | Nhật ký trên máy bạn | Đám mây lưu nhật ký |

Nói đơn giản: **Git là công cụ, GitHub là dịch vụ lưu trữ.** Giống như Word là công cụ, OneDrive là đám mây, hai thứ dùng cùng nhau nhưng không phải là một.

Ngoài GitHub còn có GitLab, Gitee (trong nước) v.v.

---

## 2. Khái niệm cốt lõi: Ba khu vực

Đây là thiết kế quan trọng nhất của Git. Hiểu ba khu vực này là bạn hiểu được linh hồn của Git.

Git chia trạng thái file của bạn thành ba tầng:

**Thư mục làm việc (Working Directory)**
Chính là **thư mục bình thường** của bạn, tất cả file bạn đang thấy và đang sửa đều ở đây. Bạn sửa thoải mái, Git sẽ biết bạn đã sửa gì nhưng không ghi lại gì cả.

**Khu vực tạm (Staging Area / Index)**
Là **trạm trung chuyển "chuẩn bị commit"**. Bạn có thể "đưa" những file muốn lưu từ thư mục làm việc vào khu vực tạm, giống như bỏ hàng vào hộp chuyển phát — chưa gửi đi nhưng đã chọn được gì để gửi.

**Kho lưu trữ (Repository)**
Là **kho lưu trữ lịch sử vĩnh viễn**, ẩn trong thư mục `.git`. Mỗi lần bạn chạy `git commit`, nội dung trong khu vực tạm sẽ được niêm phong vào kho, tạo thành một bản ghi lịch sử không thể sửa đổi.

👇 **Thử click**: Nhấn các nút lệnh theo thứ tự, quan sát file luân chuyển giữa ba khu vực.

<GitCommitFlow />

### Tại sao phải "hai bước" (add + commit)?

Nhiều người mới học hỏi: Tại sao không lưu bằng một cú click, mà phải `add` rồi mới `commit`?

**Vì trong phát triển thực tế, bạn thường không muốn commit tất cả thay đổi cùng lúc.**

Ví dụ: hôm nay bạn sửa 5 file:
- `login.js`: hoàn thành chức năng đăng nhập (muốn commit)
- `style.css`: chỉnh style trang đăng nhập (muốn commit)
- `debug.log`: output debug tạm thời (**không** muốn commit)
- `experiment.js`: tính năng mới đang thử nghiệm, chưa xong (**không** muốn commit)
- `todo.txt`: ghi chú cá nhân (**không** muốn commit)

Nếu không có khu vực tạm, bạn hoặc commit cả 5 file (lịch sử rất lộn xộn), hoặc không commit file nào.

Có khu vực tạm, bạn kiểm soát chính xác: `git add login.js style.css`, chỉ đưa hai file này vào hộp, rồi `commit`, lần commit này sẽ ghi rõ "hoàn thành chức năng đăng nhập".

---

## 3. Lần đầu dùng Git: Khởi tạo và quy trình cơ bản

### 3.1 Cài đặt và khởi tạo

Sau khi cài Git (macOS có sẵn, Windows tải tại git-scm.com), mở terminal, vào thư mục dự án:

```bash
# Khởi tạo một kho Git trong thư mục hiện tại
git init

# Git sẽ tạo thư mục ẩn .git, tất cả lịch sử lưu trong đó
# Output: Initialized empty Git repository in .../du-an-cua-ban/.git/
```

Lần đầu dùng cần cho Git biết bạn là ai (thông tin này đính kèm mỗi commit):

```bash
git config --global user.name "Tên của bạn"
git config --global user.email "email@example.com"
```

### 3.2 Quy trình làm việc hàng ngày: Lưu ba bước

Sau khi khởi tạo, 90% thao tác phát triển hàng ngày là lặp lại ba bước này:

**Bước 1: Xem trạng thái**

```bash
git status
```

Đây là lệnh bạn dùng nhiều nhất, không ngoại lệ. Nó cho bạn biết:
- Bạn đang ở branch nào
- File nào đã bị sửa (đỏ = chưa staged)
- File nào trong khu vực tạm (xanh = đã staged, chờ commit)

**Bước 2: Đưa file vào khu vực tạm**

```bash
# Thêm một file
git add login.js

# Thêm nhiều file
git add login.js style.css

# Thêm tất cả file đã sửa trong thư mục hiện tại (dấu . nghĩa là "tất cả")
git add .
```

> ⚠️ Sai lầm phổ biến của người mới: `git add .` rất tiện nhưng sẽ thêm mọi thay đổi, kể cả file tạm không muốn commit. Hãy tạo thói quen add chính xác, hoặc dùng `.gitignore` loại trừ file không muốn theo dõi (sẽ nói sau).

**Bước 3: Commit, kèm mô tả**

```bash
git commit -m "feat: thêm chức năng đăng nhập người dùng"
```

Nội dung trong ngoặc kép sau `-m` gọi là **commit message** (mô tả commit). Viết cho bản thân tương lai và đồng nghiệp xem, cần có ý nghĩa.

### 3.3 Viết Commit Message thế nào mới chuyên nghiệp?

```bash
# ❌ Viết vô dụng — đọc không biết làm gì
git commit -m "update"
git commit -m "fix"
git commit -m "sửa vài thứ"

# ✅ Viết tốt: loại + dấu hai chấm + mô tả một câu
git commit -m "feat: thêm chức năng đăng nhập người dùng"
git commit -m "fix: sửa lỗi trắng trang trên iOS Safari"
git commit -m "docs: cập nhật hướng dẫn deploy trong README"
git commit -m "refactor: tách UserService thành module riêng"
git commit -m "style: thống nhất thụt lề code thành 2 khoảng trắng"
```

**Ý nghĩa các tiền tố phổ biến:**

| Tiền tố | Ý nghĩa |
| :--- | :--- |
| `feat:` | Tính năng mới (feature) |
| `fix:` | Sửa Bug |
| `docs:` | Thay đổi tài liệu |
| `style:` | Điều chỉnh định dạng (không ảnh hưởng chức năng) |
| `refactor:` | Refactor code (chức năng không đổi, cấu trúc tối ưu) |
| `chore:` | Liên quan đến build, công cụ, dependency |
| `test:` | Liên quan đến test |

Tạo thói quen này, vài tháng sau xem lại lịch sử, nhìn là biết mỗi commit làm gì. Điều này đặc biệt quan trọng khi làm việc nhóm.

### 3.4 Xem lịch sử

```bash
# Định dạng chi tiết (thông tin đầy đủ mỗi commit)
git log

# Định dạng ngắn gọn (mỗi commit một dòng, khuyên dùng hàng ngày)
git log --oneline

# Ví dụ output:
# a1b2c3d (HEAD -> main) feat: thêm chức năng đăng nhập người dùng
# 9f3e1b2 init: khởi tạo dự án
```

---

## 4. Vũ trụ song song: Branch (Nhánh)

**Branch** là tính năng mạnh mẽ nhất, cũng là thứ khiến người mới bối rối nhất trong Git. Nhưng khi hiểu rồi, bạn sẽ thấy thiết kế này rất thanh lịch.

### 4.1 Branch là gì? Hiểu qua "vũ trụ song song"

Hãy tưởng tượng bạn đang chơi game nhập vai, có một lựa chọn quan trọng:
- Lựa chọn A: Thách thức Boss lớn (phát triển tính năng mới)
- Lựa chọn B: Tiếp tục ổn định tình hình (line chính không đổi)

Nếu bạn chọn A ngay trên save chính mà thất bại, toàn bộ tiến độ game bị hỏng.

Nhưng nếu bạn **copy một save**, rồi thử thách Boss trên bản copy:
- Thắng? Gộp kết quả bản copy vào save chính
- Thua? Save chính hoàn toàn không ảnh hưởng, xóa bản copy làm lại

**Git branch chính là cơ chế "save copy" này.**

Trong Git, branch `main` (hoặc `master`) là "save chính", luôn giữ ổn định. Khi muốn phát triển tính năng mới, bạn tạo branch mới từ main, phát triển và test ở đó, xong rồi merge ngược lại main.

### 4.2 Demo trực quan branch

👇 **Thử click**: Nhấn các nút lệnh theo thứ tự, quan sát biểu đồ branch phân nhánh, kéo dài và cuối cùng hợp nhất như thế nào. Chú ý vị trí tag HEAD — nó luôn trỏ đến "bạn đang ở đâu".

<GitBranchVisual />

### 4.3 Thao tác branch chi tiết

**Tạo và chuyển sang branch mới:**

```bash
# Cách 1: Tạo trước, chuyển sau (hai bước)
git branch feature-login      # Tạo branch
git checkout feature-login    # Chuyển sang

# Cách 2: Một bước (khuyến nghị)
git checkout -b feature-login

# Output: Switched to a new branch 'feature-login'
```

Sau khi tạo branch, prompt terminal sẽ hiển thị tên branch hiện tại, ví dụ:
```
user@mac ~/project (feature-login) $
```

**Xem tất cả branch:**

```bash
git branch

# Output (* chỉ branch hiện tại):
# * feature-login
#   main
```

**Phát triển bình thường trên branch:**

```bash
# Trên branch feature-login, sửa code, add, commit, y hệt như bình thường
git add login.js
git commit -m "feat: thêm cấu trúc HTML form đăng nhập"

git add login.js api.js
git commit -m "feat: hoàn thành kết nối API đăng nhập"
```

Các commit này chỉ nằm trên branch `feature-login`, branch `main` hoàn toàn không biết bạn đã làm gì.

**Chuyển về branch chính, merge:**

```bash
# Về main
git checkout main

# Merge tất cả thay đổi từ feature-login
git merge feature-login

# Sau khi merge xong, có thể xóa branch (tùy chọn)
git branch -d feature-login
```

### 4.4 Khi nào nên mở branch?

| Tình huống | Khuyến nghị | Lý do |
| :--- | :--- | :--- |
| Phát triển tính năng mới | ✅ Mở branch | Không ảnh hưởng line chính trước khi hoàn thành, có thể bỏ bất cứ lúc nào |
| Sửa Bug gấp trên production | ✅ Mở `hotfix-xxx` từ main | Sửa xong merge ngay, không mang theo tính năng chưa xong |
| Song song với đồng nghiệp | ✅ Mỗi người một branch | Không ảnh hưởng nhau, hợp nhất qua Pull Request khi xong |
| Chỉ sửa lỗi chính tả | ❌ Sửa trực tiếp trên main | Rủi ro rất thấp, không cần mở branch |

### 4.5 Chiến lược branch phổ biến trong đội

Trong dự án thực tế, đội thường thống nhất cách đặt tên và mục đích branch:

| Tên branch | Mục đích | Đặc điểm |
| :--- | :--- | :--- |
| `main` / `master` | Code ổn định cho production | Chỉ code qua test mới được vào, không push trực tiếp |
| `dev` / `develop` | Branch tích hợp hàng ngày | Tất cả branch tính năng merge vào đây trước, qua test rồi lên main |
| `feature/xxx` | Phát triển tính năng cụ thể | Vd: `feature/user-login`, xong merge vào dev |
| `hotfix/xxx` | Sửa gấp | Tạo từ main, sửa xong merge ngược main và dev |

---

## 5. Hợp tác với đồng nghiệp: Kho từ xa

Đến đây, tất cả những gì bạn học đều là thao tác **cục bộ** trên Git — lịch sử nằm trên máy bạn. Để chia sẻ code với đồng nghiệp, bạn cần một **kho từ xa**, tức GitHub, GitLab.

### 5.1 Nguyên lý kho từ xa

Kho từ xa giống như **"save chung"** của cả đội:

- Mỗi người viết code, commit trên máy
- Xong thì `push` (tải lên) kho từ xa
- Đồng nghiệp `pull` (tải về) nội dung mới nhất từ kho từ xa về máy
- Code tất cả mọi người đồng bộ

👇 **Thử click**: Nhấn lệnh theo thứ tự, trải nghiệm quy trình đầy đủ từ liên kết kho từ xa, push, đến pull cập nhật từ đồng nghiệp.

<GitSyncDemo />

### 5.2 Lần đầu push dự án lên GitHub

**Bước 1**: Tạo repo mới trên GitHub (nhấn + góc phải trên → New repository), không check tùy chọn khởi tạo.

**Bước 2**: Quay lại terminal cục bộ, liên kết kho từ xa:

```bash
# Liên kết repo cục bộ với GitHub
# "origin" là alias kho từ xa, tên theo quy ước (có thể đổi nhưng không cần)
git remote add origin https://github.com/ten-ban/ten-repo.git

# Xác nhận liên kết thành công
git remote -v
# Output:
# origin  https://github.com/ten-ban/ten-repo.git (fetch)
# origin  https://github.com/ten-ban/ten-repo.git (push)
```

**Bước 3**: Push nội dung cục bộ lên từ xa:

```bash
# Lần đầu push; -u nghĩa là "sau này git push mặc định đẩy lên branch main của origin"
git push -u origin main

# Sau đó mỗi lần push chỉ cần:
git push
```

### 5.3 Lệnh hợp tác hàng ngày

**Push (bạn sửa xong, muốn đồng nghiệp thấy):**
```bash
git push
```

**Pull (đồng nghiệp sửa xong, bạn cần đồng bộ):**
```bash
git pull
```

`git pull` thực chất là tổ hợp hai lệnh:
1. `git fetch`: Tải commit mới nhất từ kho từ xa
2. `git merge`: Hợp nhất nội dung tải về với branch hiện tại

**Lần đầu lấy dự án của người khác từ GitHub:**
```bash
# Copy toàn bộ kho từ xa về cục bộ (chỉ cần làm một lần)
git clone https://github.com/ai-do/mot-du-an.git

# clone tự động tạo liên kết từ xa, sau đó push/pull bình thường
```

### 5.4 Hướng push và pull

```
Máy tính bạn (kho cục bộ)  ←→  GitHub (kho từ xa)

git push:  Cục bộ → Từ xa   (bạn sửa xong, tải lên cho đồng nghiệp)
git pull:  Từ xa → Cục bộ   (đồng nghiệp sửa xong, tải về máy bạn)
git clone: Từ xa → Cục bộ   (lần đầu copy toàn bộ kho)
```

> **Thực tế tốt nhất**: Mỗi ngày bắt đầu làm `git pull` trước, lấy code mới nhất; tan làm hoặc xong một tính năng thì `git push`, backup kịp thời và cho đồng nghiệp thấy tiến độ.

---

## 6. Nâng cao: Xử lý xung đột

Xung đột là điều không thể tránh trong hợp tác, nhưng cũng không đáng sợ lắm.

### 6.1 Xung đột xảy ra như thế nào?

Khi bạn và đồng nghiệp **cùng sửa cùng một dòng của cùng một file**, lúc merge Git không biết dùng bản nào, tạo ra xung đột.

Ví dụ:
- Bạn viết ở dòng 5 `login.js`: `const timeout = 3000`
- Đồng nghiệp viết cùng dòng: `const timeout = 5000`
- Khi `git pull` hoặc `git merge`, Git phát hiện mâu thuẫn và "tạm dừng": không biết dùng cái nào, bạn tự quyết định.

### 6.2 File xung đột trông như thế nào?

Git chèn đánh dấu đặc biệt ở nơi xung đột:

```javascript
function login() {
  const url = '/api/login'

 <<<<<<< HEAD
  const timeout = 3000   // Phiên bản của bạn
 =======
  const timeout = 5000   // Phiên bản đồng nghiệp
 >>>>>>> feature/update-timeout

  return fetch(url, { timeout })
}
```

- Giữa `<<<<<<< HEAD` và `=======`: nội dung branch hiện tại của bạn
- Giữa `=======` và `>>>>>>> xxx`: nội dung đang được merge vào

### 6.3 Cách giải quyết xung đột?

**Bước 1**: Mở file xung đột, tìm tất cả dấu `<<<<<<<` (thường VS Code highlight tự động)

**Bước 2**: Quyết định giữ đoạn nào, sửa file thủ công, xóa tất cả dấu (`<<<<<<<`, `=======`, `>>>>>>>`).

Ví dụ quyết định dùng 5000 (bản đồng nghiệp):
```javascript
function login() {
  const url = '/api/login'
  const timeout = 5000   // Dùng sửa của đồng nghiệp
  return fetch(url, { timeout })
}
```

**Bước 3**: Commit lại

```bash
# Đánh dấu xung đột đã giải quyết
git add login.js

# Hoàn tất commit merge (Git tự tạo message merge)
git commit
```

### 6.4 Thói quen tốt để giảm xung đột

- **Pull thường xuyên**: Đồng bộ code mới nhất trước khi làm, giảm tình trạng "bị tụt quá xa"
- **Commit nhỏ và nhiều**: Đừng viết code cả tuần mới commit một lần, commit liên tục giúp phát hiện và giải quyết xung đột dễ hơn
- **Branch cách ly**: Tính năng khác nhau dùng branch khác nhau, giảm tranh chấp cùng dòng code
- **Giao tiếp**: Trước khi sửa file chung (như `config.js`), báo đồng nghiệp trước

---

## 7. Tra cứu lệnh nhanh

<GitCommandCheatsheet />

---

## 8. Thực hành: Quy trình đầy đủ khi tham gia dự án đội

Đây là quy trình tiêu chuẩn khi bạn tham gia đội hoặc dự án mới, có thể copy trực tiếp:

```bash
# ① Ngày đầu: clone dự án về cục bộ (chỉ làm một lần)
git clone https://github.com/team/project.git
cd project

# ② Mỗi ngày bắt đầu: pull code mới nhất
git pull origin main

# ③ Tạo branch tính năng (không sửa trực tiếp trên main)
git checkout -b feature/user-profile

# ④ Phát triển bình thường... viết code...

# ⑤ Xong một tính năng nhỏ, commit ngay (không tích trữ)
git add src/UserProfile.vue
git commit -m "feat: hoàn thành chức năng upload avatar"

git add src/UserProfile.vue src/api/user.js
git commit -m "feat: hoàn thành API sửa hồ sơ người dùng"

# ⑥ Push branch lên từ xa cho đồng nghiệp thấy
git push origin feature/user-profile

# ⑦ Tạo Pull Request (PR) trên GitHub, yêu cầu merge vào main
# (Bước này thao tác trên web GitHub)

# ⑧ Chờ đồng nghiệp Code Review, sửa theo feedback, tiếp tục commit + push

# ⑨ PR được merge, về main, cập nhật cục bộ, xóa branch tính năng
git checkout main
git pull
git branch -d feature/user-profile
```

---

## 9. .gitignore: File nào không nên được theo dõi?

Một số file bạn **không muốn** commit vào kho Git:
- `node_modules/`: Gói dependency, rất nặng, có thể tạo lại bằng `npm install`
- `.env`: File biến môi trường, có thể chứa mật khẩu DB, API Key, **tuyệt đối không upload lên repo công khai**
- `*.log`: File log
- `.DS_Store`: File ẩn macOS tự tạo
- `dist/`, `build/`: Sản phẩm build, có thể build lại

Tạo file `.gitignore` ở thư mục gốc dự án, viết quy tắc file không muốn theo dõi:

```gitignore
# Dependency
node_modules/

# Biến môi trường (quan trọng! mật khẩu không được commit)
.env
.env.local

# Sản phẩm build
dist/
build/

# File hệ thống
.DS_Store
Thumbs.db

# Log
*.log
```

GitHub có template .gitignore cho nhiều ngôn ngữ và framework: [github.com/github/gitignore](https://github.com/github/gitignore)

---

## Bảng tra cứu thuật ngữ

| Thuật ngữ | Tiếng Anh | Giải thích |
| :--- | :--- | :--- |
| **Kho lưu trữ** | Repository (Repo) | CSDL lưu toàn bộ lịch sử phiên bản dự án, trong thư mục `.git` |
| **Commit** | Commit | Một bản ghi phiên bản hoàn chỉnh, như save game, kèm mô tả và thời gian |
| **Branch** | Branch | Tuyến phát triển độc lập, như dòng thời gian song song, không ảnh hưởng nhau |
| **Merge** | Merge | Gộp thay đổi từ một branch sang branch khác |
| **Xung đột** | Conflict | Cùng một dòng code bị nhiều người sửa, Git không biết dùng bản nào, cần giải quyết thủ công |
| **Stage** | Stage / Index | Đưa thay đổi vào danh sách "sẵn sàng commit" |
| **Từ xa** | Remote | Bản sao kho trên đám mây (GitHub / GitLab / Gitee) |
| **Clone** | Clone | Copy toàn bộ kho từ xa về cục bộ |
| **Push** | Push | Tải commit cục bộ lên kho từ xa |
| **Pull** | Pull | Tải và hợp nhất nội dung mới nhất từ từ xa về cục bộ |
| **HEAD** | HEAD | Con trỏ chỉ branch/commit hiện tại, cho biết "bạn đang ở đâu" |
| **origin** | origin | Alias mặc định của kho từ xa (tên theo quy ước) |
| **stash** | Stash | Lưu tạm thay đổi chưa commit, dùng khi cần chuyển task |
| **PR / MR** | Pull Request / Merge Request | Yêu cầu merge branch của bạn vào branch chính, thường cần review |

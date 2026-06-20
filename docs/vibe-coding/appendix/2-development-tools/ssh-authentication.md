# SSH và xác thực khóa

> 💡 **Hướng dẫn học**: Mỗi lần `git push` lại nhập mật khẩu? SSH connect server luôn bị "Permission denied"? Chương này giúp bạn hiểu nguyên lý xác thực khóa SSH trong 5 phút, và cách cấu hình đăng nhập không cần mật khẩu GitHub và server chỉ bằng một lệnh.

---

## 0. Bạn hẳn đã gặp những tình huống này

- `git push` liên tục hiện hộp nhập mật khẩu, rất phiền
- SSH kết nối server thất bại, không biết `id_rsa` và `id_ed25519` là gì
- Nghe nói "khóa công khai" và "khóa riêng", nhưng không rõ cái nào cho người khác, cái nào giữ lại

**Mâu thuẫn cốt lõi**: Mật khẩu không an toàn, lại phiền. Khóa SSH là giải pháp giải quyết cùng lúc tính bảo mật và tiện lợi.

---

## 1. Mật khẩu vs Khóa: Tại sao khóa tốt hơn?

👇 Thử click: So sánh sự khác biệt giữa đăng nhập bằng mật khẩu và bằng khóa

<SSHAuthDemo />

::: tip 💡 Tóm tắt trong một câu
Đăng nhập mật khẩu = Mỗi lần gửi mật khẩu cho đối phương kiểm tra (có thể bị chặn);
Đăng nhập khóa = Chứng minh "tôi có chìa" nhưng không cần đưa chìa cho bạn xem (khóa riêng không bao giờ truyền).
:::

---

## 2. Mã hóa bất đối xứng: Khóa công khai và khóa riêng

Khóa SSH dựa trên **mã hóa bất đối xứng**, tạo một lúc hai chìa:

| | Khóa riêng (Private Key) | Khóa công khai (Public Key) |
|---|---|---|
| **Vị trí lưu** | Máy bạn `~/.ssh/id_ed25519` | Server/GitHub |
| **Có thể cho người khác không** | ❌ Tuyệt đối không | ✅ Tùy ý |
| **Chức năng** | Ký (chứng minh danh tính) | Xác minh (kiểm tra danh tính) |
| **Ví dụ** | Chìa khóa | Ổ khóa |

### Các loại khóa phổ biến

| Loại | Lệnh | Khuyến nghị | Ghi chú |
|---|---|---|---|
| **Ed25519** | `ssh-keygen -t ed25519` | ⭐⭐⭐ | Mới nhất, nhanh nhất, an toàn nhất |
| **RSA** | `ssh-keygen -t rsa -b 4096` | ⭐⭐ | Tương thích tốt nhưng chậm hơn |
| **ECDSA** | `ssh-keygen -t ecdsa` | ⭐ | Thường không khuyến nghị |

---

## 3. Thực hành: Tạo và cấu hình khóa SSH

### 3.1 Tạo cặp khóa

```bash
ssh-keygen -t ed25519 -C "your@email.com"
```

Sau khi chạy sẽ hỏi:
- **Đường dẫn tệp**: Enter dùng mặc định `~/.ssh/id_ed25519`
- **Passphrase**: Có thể đặt bảo vệ thêm (hoặc để trống)

### 3.2 Thêm khóa công khai vào GitHub

```bash
# 1. Copy nội dung khóa công khai
cat ~/.ssh/id_ed25519.pub | pbcopy  # macOS
cat ~/.ssh/id_ed25519.pub | xclip   # Linux

# 2. Mở GitHub → Settings → SSH and GPG keys → New SSH key
# 3. Dán khóa công khai, lưu

# 4. Test kết nối
ssh -T git@github.com
# Thành công sẽ thấy: Hi username! You've been authenticated...
```

### 3.3 Thêm khóa công khai vào server

```bash
# Cách 1: ssh-copy-id (khuyến nghị)
ssh-copy-id user@your-server

# Cách 2: Copy thủ công
cat ~/.ssh/id_ed25519.pub | ssh user@server "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

---

## 4. SSH Config: Tạm biệt lệnh dài

Cấu hình alias trong `~/.ssh/config`, cấu hình một lần dùng mãi mãi:

```
Host dev
  HostName 192.168.1.100
  User deploy
  IdentityFile ~/.ssh/id_ed25519

Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519
```

Kết quả sau cấu hình:

| Trước | Sau |
|---|---|
| `ssh -i ~/.ssh/id_ed25519 deploy@192.168.1.100` | `ssh dev` |
| Mỗi lần phải nhớ IP và username | Nhớ alias là đủ |

---

## 5. Khắc phục vấn đề phổ biến

| Vấn đề | Nguyên nhân | Giải pháp |
|---|---|---|
| `Permission denied (publickey)` | Chưa thêm khóa công khai lên server | `ssh-copy-id user@server` |
| `WARNING: UNPROTECTED PRIVATE KEY FILE` | Quyền file khóa riêng quá rộng | `chmod 600 ~/.ssh/id_ed25519` |
| `Could not resolve hostname` | Cấu hình SSH Config sai | Kiểm tra format `~/.ssh/config` |
| GitHub vẫn hỏi mật khẩu | Dùng HTTPS chứ không phải SSH | Dùng `git@github.com:user/repo.git` |

---

## 6. Tóm tắt

::: tip 📚 Điểm chính
1. **Khóa > Mật khẩu**: Khóa riêng không bao giờ truyền, an toàn hơn mật khẩu rất nhiều
2. **Khuyến nghị Ed25519**: Thuật toán khóa hiện đại nhất, nhanh và an toàn
3. **Khóa công khai cho tùy ý, khóa riêng tuyệt đối không để lộ**: Nhớ quy tắc vàng này
4. **SSH Config**: Cấu hình alias một lần, sau đó `ssh alias` kết nối một lệnh
5. **GitHub/GitLab**: Thêm khóa công khai xong, `git push/pull` không cần nhập mật khẩu nữa
:::

**Học tiếp**:
- [Port và localhost](./ports-localhost) - Hiểu nền tảng kết nối mạng
- [Biến môi trường và PATH](./environment-path) - Hiểu cấu hình hệ thống

# Linux Cơ bản

::: tip Lời mở đầu
**Trong thế giới máy chủ, Linux là nhân vật chính tuyệt đối.** Hơn 90% máy chủ trên toàn cầu chạy Linux, từ WeChat bạn dùng hàng ngày đến Google Search, đằng sau đều được Linux hỗ trợ. Là developer, nắm vững Linux cơ bản không phải là tùy chọn, mà là môn bắt buộc.
:::

**Bài viết này sẽ giúp bạn học được gì?**

Sau khi học xong chương này, bạn sẽ có được:

- **Hệ thống tệp**: Hiểu cấu trúc thư mục Linux và triết lý "mọi thứ đều là tệp"
- **Lệnh thường dùng**: Nắm vững các lệnh cốt lõi về thao tác tệp, xử lý văn bản, quản lý tiến trình
- **Mô hình quyền hạn**: Hiểu khái niệm về user, group, permission
- **Shell cơ bản**: Hiểu các khái niệm cốt lõi của Shell như pipe, redirect, biến môi trường
- **Kỹ năng thực hành**: Học các kỹ năng vận hành cơ bản như xem log, kiểm tra tiến trình, chẩn đoán mạng

| Chương | Nội dung | Khái niệm cốt lõi |
|-----|------|---------|
| **Chương 1** | Hệ thống tệp | Cấu trúc thư mục, mọi thứ đều là tệp |
| **Chương 2** | Lệnh thường dùng | Tệp, văn bản, tiến trình, mạng |
| **Chương 3** | Mô hình quyền hạn | User, Group, rwx, sudo |
| **Chương 4** | Shell cơ bản | Pipe, Redirect, Biến, Script |
| **Chương 5** | Tình huống thực hành | Kiểm tra log, chẩn đoán hiệu năng |

---

## 1. Hệ thống tệp: Mọi thứ đều là tệp

Một trong những triết lý cốt lõi nhất của Linux là **mọi thứ đều là tệp**. Tệp thông thường là tệp, thư mục là tệp, ổ cứng là tệp, thậm chí kết nối mạng, thông tin tiến trình cũng là tệp. Sự trừu tượng thống nhất này cho phép bạn dùng cùng một bộ công cụ (đọc, ghi, kiểm soát quyền) để thao tác hầu hết mọi tài nguyên hệ thống.

<LinuxFileSystemDemo />

### Ghi nhớ nhanh cấu trúc thư mục

Hãy tưởng tượng hệ thống tệp Linux như một cái cây lộn ngược:

```
/                    ← Thư mục gốc (gốc cây)
├── home/            ← Nhà của người dùng (tệp của bạn ở đây)
├── etc/             ← Tệp cấu hình ("bảng cài đặt" của hệ thống)
├── var/             ← Dữ liệu thay đổi (log, cache)
├── usr/             ← Chương trình do người dùng cài đặt
├── tmp/             ← Tệp tạm thời (mất khi khởi động lại)
├── proc/            ← Thông tin tiến trình (ảo, không chiếm đĩa)
├── dev/             ← Tệp thiết bị (ổ cứng, terminal)
├── bin/             ← Lệnh cơ bản (ls, cp, mv)
├── sbin/            ← Lệnh quản trị hệ thống (cần root)
├── opt/             ← Phần mềm bên thứ ba
└── root/            ← Thư mục home của root user
```

### Hai cách viết đường dẫn

| Loại | Định dạng | Ví dụ | Mô tả |
|------|------|------|------|
| Đường dẫn tuyệt đối | Bắt đầu từ `/` | `/home/alice/code/app.js` | Đi từ thư mục gốc, không gây nhập nhằng |
| Đường dẫn tương đối | Bắt đầu từ thư mục hiện tại | `./code/app.js` hoặc `../config` | `.` là thư mục hiện tại, `..` là thư mục cha |

::: tip Sức mạnh của "mọi thứ đều là tệp"
Muốn biết thông tin CPU? Đọc tệp: `cat /proc/cpuinfo`
Muốn biết mức sử dụng bộ nhớ? Đọc tệp: `cat /proc/meminfo`
Muốn tạo số ngẫu nhiên? Đọc tệp: `cat /dev/urandom`
Muốn loại bỏ output? Ghi tệp: `echo "no thanks" > /dev/null`

Không cần API chuyên biệt, đọc ghi tệp là đủ. Đây chính là sự thanh lịch của triết lý Unix.
:::

---

## 2. Lệnh thường dùng

Lệnh Linux tuân theo một định dạng thống nhất: `lệnh [tùy chọn] [tham số]`. Ví dụ `ls -la /home`, `ls` là lệnh, `-la` là tùy chọn, `/home` là tham số.

<LinuxCommandDemo />

### 10 lệnh thường dùng nhất

Nếu chỉ có thể nhớ 10 lệnh, hãy nhớ những lệnh này:

| Lệnh | Mục đích | Mẹo ghi nhớ |
|------|------|----------|
| `ls` | Liệt kê tệp | list |
| `cd` | Chuyển thư mục | change directory |
| `cat` | Xem tệp | concatenate |
| `grep` | Tìm kiếm văn bản | global regular expression print |
| `find` | Tìm tệp | chính là find |
| `ps` | Xem tiến trình | process status |
| `tail -f` | Xem log theo thời gian thực | Xem "đuôi" tệp, -f là follow |
| `chmod` | Thay đổi quyền | change mode |
| `curl` | Gửi HTTP request | client URL |
| `ssh` | Đăng nhập từ xa | secure shell |

### Nghệ thuật kết hợp lệnh

Sức mạnh của Linux không nằm ở lệnh đơn lẻ, mà ở **sự kết hợp lệnh**. Thông qua pipe `|` nối nhiều lệnh đơn giản lại với nhau, giải quyết vấn đề phức tạp:

```bash
# Tìm 5 tiến trình chiếm CPU nhiều nhất
ps aux --sort=-%cpu | head -6

# Thống kê loại lỗi xuất hiện nhiều nhất trong log
grep "ERROR" app.log | awk '{print $4}' | sort | uniq -c | sort -rn | head -10

# Tìm tệp lớn hơn 100MB
find / -size +100M -type f 2>/dev/null

# Giám sát lỗi trong log theo thời gian thực
tail -f /var/log/app.log | grep --color "ERROR"
```

::: tip Triết lý Unix
"Hãy làm một việc, và làm tốt nó." Mỗi lệnh chỉ chịu trách nhiệm một chức năng, thông qua pipe kết hợp để thực hiện thao tác phức tạp. Đây là lý do tại sao các lệnh Linux đều ngắn gọn — chúng là những viên gạch, không phải dao đa năng.
:::

---

## 3. Mô hình quyền hạn

Linux là hệ thống đa người dùng, mô hình quyền hạn là nền tảng của bảo mật. Mỗi tệp có ba bộ quyền, lần lượt kiểm soát **Owner (Chủ sở hữu)**, **Group (Nhóm)**, **Others (Người khác)** có thể làm gì.

### Đọc hiểu output của `ls -l`

```bash
$ ls -l app.js
-rwxr-xr-- 1 alice developers 2048 Jan 15 10:30 app.js
│├──┤├──┤├──┤   │     │          │
│ │   │   │     │     │          └── Kích thước tệp
│ │   │   │     │     └── Nhóm sở hữu
│ │   │   │     └── Chủ sở hữu
│ │   │   └── Quyền của người khác: r-- (chỉ đọc)
│ │   └── Quyền của nhóm: r-x (đọc + thực thi)
│ └── Quyền của chủ sở hữu: rwx (đọc + ghi + thực thi)
└── Loại tệp: - tệp thường, d thư mục, l liên kết
```

### Ba loại quyền thao tác

| Quyền | Chữ cái | Số | Ý nghĩa với tệp | Ý nghĩa với thư mục |
|------|------|------|-------------|-------------|
| Đọc | `r` | 4 | Xem nội dung tệp | Liệt kê nội dung thư mục (ls) |
| Ghi | `w` | 2 | Sửa nội dung tệp | Tạo/xóa tệp trong thư mục |
| Thực thi | `x` | 1 | Chạy chương trình/script | Vào thư mục (cd) |

<LinuxPermissionsDemo />

### Tính nhanh quyền số

Ba chữ số lần lượt đại diện cho quyền của Owner, Group, Others, mỗi chữ số là tổng của r(4) + w(2) + x(1):

```
chmod 755 script.sh
  7 = rwx (4+2+1)  → Chủ sở hữu: đọc + ghi + thực thi
  5 = r-x (4+0+1)  → Nhóm: đọc + thực thi
  5 = r-x (4+0+1)  → Người khác: đọc + thực thi
```

| Quyền phổ biến | Ý nghĩa | Ứng dụng điển hình |
|---------|------|---------|
| `644` | rw-r--r-- | Tệp thông thường (chủ sở hữu ghi được, người khác chỉ đọc) |
| `755` | rwxr-xr-x | Tệp thực thi/thư mục |
| `600` | rw------- | Tệp bí mật (như SSH key) |
| `777` | rwxrwxrwx | Mọi người đều đọc ghi thực thi (nguy hiểm, tránh sử dụng) |

### sudo: Tạm thời có quyền superuser

Người dùng thường có quyền hạn chế, một số thao tác cần quyền root. `sudo` cho phép bạn tạm thời thực thi lệnh với tư cách root:

```bash
# Người dùng thường không thể sửa cấu hình hệ thống
$ vim /etc/nginx/nginx.conf
# Permission denied

# Dùng sudo để tạm thời nâng quyền
$ sudo vim /etc/nginx/nginx.conf
# Nhập mật khẩu của bạn là có thể chỉnh sửa

# Chuyển sang root user (thận trọng khi sử dụng)
$ sudo su -
```

::: warning Nguyên tắc quyền tối thiểu
Đừng bao giờ dùng `chmod 777` để giải quyết vấn đề quyền hạn, điều này giống như tháo khóa cửa vậy. Cách làm đúng là tìm hiểu xem ai cần quyền gì, cấp chính xác. Tương tự, đừng thao tác lâu dài với tư cách root, chỉ dùng `sudo` khi cần thiết.
:::

---

## 4. Shell cơ bản

Shell là "phiên dịch viên" giữa bạn và kernel Linux. Bạn nhập lệnh, Shell giải thích và giao cho kernel thực thi. Shell phổ biến nhất là **Bash** (mặc định của hầu hết bản phân phối Linux) và **Zsh** (mặc định của macOS).

### Pipe và Redirect

Đây là hai tính năng mạnh mẽ nhất của Shell:

| Ký hiệu | Tên | Tác dụng | Ví dụ |
|------|------|------|------|
| `|` | Pipe | Lấy output của lệnh trước làm input của lệnh sau | `cat log | grep ERROR` |
| `>` | Output Redirect | Ghi output vào tệp (ghi đè) | `echo "hello" > file.txt` |
| `>>` | Append Redirect | Nối output vào cuối tệp | `echo "world" >> file.txt` |
| `<` | Input Redirect | Đọc input từ tệp | `wc -l < file.txt` |
| `2>` | Error Redirect | Ghi lỗi vào tệp | `cmd 2> error.log` |
| `2>&1` | Gộp output | Gộp lỗi và output thường | `cmd > all.log 2>&1` |

### Biến môi trường

Biến môi trường là "cấu hình toàn cục" trong Shell, ảnh hưởng đến hành vi của lệnh:

```bash
# Xem tất cả biến môi trường
env

# Xem một biến cụ thể
echo $PATH
echo $HOME

# Thiết lập tạm thời (chỉ có hiệu lực trong Shell hiện tại)
export API_KEY="abc123"

# Thiết lập vĩnh viễn (ghi vào tệp cấu hình)
echo 'export API_KEY="abc123"' >> ~/.bashrc
source ~/.bashrc   # Làm cho cấu hình có hiệu lực ngay
```

| Biến phổ biến | Ý nghĩa | Giá trị ví dụ |
|---------|------|--------|
| `$PATH` | Đường dẫn tìm kiếm lệnh | `/usr/local/bin:/usr/bin:/bin` |
| `$HOME` | Thư mục home của người dùng | `/home/alice` |
| `$USER` | Tên người dùng hiện tại | `alice` |
| `$PWD` | Thư mục làm việc hiện tại | `/var/log` |
| `$SHELL` | Shell đang sử dụng | `/bin/bash` |

### Nhập môn Shell Script

Viết nhiều lệnh vào một tệp, đó là Shell script. Nó là điểm bắt đầu của tự động hóa vận hành:

```bash
#!/bin/bash
# deploy.sh - Script triển khai đơn giản

APP_DIR="/opt/myapp"
LOG_FILE="/var/log/deploy.log"

echo "$(date) - Bắt đầu triển khai..." >> $LOG_FILE

# Pull code mới nhất
cd $APP_DIR && git pull origin main

# Cài đặt dependencies
npm install --production

# Khởi động lại dịch vụ
pm2 restart myapp

echo "$(date) - Triển khai hoàn tất" >> $LOG_FILE
```

```bash
# Cấp quyền thực thi cho script và chạy
chmod +x deploy.sh
./deploy.sh
```

::: tip Mẹo debug script
Thêm `set -ex` vào đầu script: `-e` làm script dừng ngay khi gặp lỗi (thay vì tiếp tục thực thi), `-x` sẽ in ra từng lệnh được thực thi (dễ dàng kiểm tra vấn đề). Hai tùy chọn này gần như là tiêu chuẩn trong script production.
:::

---

## 5. Tình huống thực hành

Lý thuyết đã học xong, hãy xem một số tình huống thực hành thường gặp nhất trong phát triển.

### 5.1 Kiểm tra log

Dịch vụ gặp vấn đề, phản ứng đầu tiên là xem log. Dưới đây là các thủ thuật kiểm tra log thường dùng:

```bash
# 1. Theo dõi log theo thời gian thực (thường dùng nhất)
tail -f /var/log/app/error.log

# 2. Tìm kiếm lỗi trong khoảng thời gian cụ thể
grep "2024-01-15 14:" error.log | grep "ERROR"

# 3. Thống kê số lỗi mỗi giờ
grep "ERROR" app.log | awk '{print substr($1,1,13)}' | uniq -c

# 4. Xem 100 dòng log gần nhất
tail -100 app.log

# 5. Tìm kiếm trong nhiều tệp log
grep -r "OutOfMemory" /var/log/app/
```

### 5.2 Kiểm tra tiến trình

Ứng dụng treo, CPU cao, rò rỉ bộ nhớ — những vấn đề này đều cần bắt đầu từ tiến trình:

```bash
# Xem tiến trình chiếm CPU cao nhất
ps aux --sort=-%cpu | head -10

# Xem tiến trình chiếm bộ nhớ cao nhất
ps aux --sort=-%mem | head -10

# Tìm tiến trình cụ thể
ps aux | grep "node"

# Xem thông tin chi tiết của tiến trình (bao gồm luồng)
top -Hp <PID>

# Xem tệp đang mở của tiến trình
lsof -p <PID>

# Kết thúc tiến trình một cách nhẹ nhàng (SIGTERM)
kill <PID>

# Buộc kết thúc (SIGKILL, biện pháp cuối cùng)
kill -9 <PID>
```

### 5.3 Chẩn đoán mạng

Dịch vụ không kết nối được? Trước tiên xác định là vấn đề mạng hay vấn đề ứng dụng:

```bash
# Kiểm tra mục tiêu có thể truy cập không
ping -c 4 google.com

# Kiểm tra cổng có mở không
telnet db-server 3306
# hoặc dùng nc
nc -zv db-server 3306

# Xem cổng đang lắng nghe trên máy
ss -tlnp
# hoặc
netstat -tlnp

# Kiểm tra phân giải DNS
dig api.example.com
nslookup api.example.com

# Kiểm tra HTTP API
curl -v http://localhost:3000/health

# Xem thống kê trạng thái kết nối mạng
ss -s
```

### 5.4 Kiểm tra dung lượng đĩa

Đĩa đầy là một trong những sự cố phổ biến nhất trên production:

```bash
# Xem mức sử dụng các phân vùng
df -h

# Tìm thư mục chiếm dung lượng lớn nhất
du -sh /* 2>/dev/null | sort -rh | head -10

# Tiếp tục định vị thư mục lớn
du -sh /var/log/* | sort -rh | head -10

# Tìm tệp lớn (>100MB)
find / -type f -size +100M 2>/dev/null | head -20

# Dọn dẹp các nguồn chiếm dung lượng phổ biến
# Dọn log cũ
sudo journalctl --vacuum-size=500M
# Dọn image Docker không dùng
docker system prune -a
```

::: tip Khẩu quyết kiểm tra online
**"Đầu tiên xem log, thứ hai xem tiến trình, thứ ba xem mạng, thứ tư xem đĩa"**. 90% vấn đề online có thể định vị nguyên nhân qua bốn bước này. Khi đã thành thói quen, hiệu quả kiểm tra sẽ tăng đáng kể.
:::

---

## Tổng kết

Linux là kỹ năng cần thiết của developer, nắm vững cơ bản là đủ để ứng phó với phần lớn các tình huống phát triển và vận hành hàng ngày.

Ôn tập các điểm chính của chương này:

1. **Mọi thứ đều là tệp**: Linux dùng trừu tượng tệp để thống nhất cách truy cập vào phần cứng, tiến trình, mạng và các tài nguyên khác
2. **Kết hợp lệnh**: Lệnh đơn lẻ có chức năng đơn giản, thông qua pipe `|` kết hợp mới phát huy sức mạnh thực sự
3. **Mô hình quyền hạn**: Owner/Group/Others × Read/Write/Execute, dùng số (như 755) để thiết lập nhanh
4. **Shell cơ bản**: Pipe, redirect, biến môi trường, script là nền tảng của tự động hóa
5. **Kiểm tra thực tế**: Log → Tiến trình → Mạng → Đĩa, bốn bước định vị phần lớn vấn đề online

## Đọc thêm

- [Linux Command Encyclopedia](https://man7.org/linux/man-pages/) - Tài liệu chính thức Linux man pages
- [The Linux Command Line](https://linuxcommand.org/tlcl.php) - Sách nhập môn dòng lệnh Linux miễn phí
- [Linux Journey](https://linuxjourney.com/) - Website học Linux tương tác
- [explainshell.com](https://explainshell.com/) - Nhập lệnh tự động giải thích ý nghĩa từng tham số
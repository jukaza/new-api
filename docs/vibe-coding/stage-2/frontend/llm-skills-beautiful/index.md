# Làm cho giao diện đẹp hơn bằng LLM và Skills: Thực chiến Prompt và Plugin

Trong các bài học trước, bạn đã học cách dùng AI IDE chuyển bản thiết kế thành code, dùng thư viện component để nhanh chóng搭建 giao diện. Nhưng bạn có thể cũng phát hiện một vấn đề nan giải: **cùng một yêu cầu, trang do AI tạo luôn cảm thấy thiếu cái gì** — font chữ là Inter quen thuộc, phối màu là gradient tím随处可见, bố cục là lưới card đối xứng gây ngáp, toàn bộ trang tỏa ra mùi "AI" nồng nàn.

Đây không phải lỗi của AI, mà là bạn chưa nói cho nó biết bạn muốn **phong cách** gì.

Tưởng tượng bạn đi tiệm cắt tóc. Nếu bạn chỉ nói "cắt giúp tôi tóc", thợ sẽ cho bạn kết quả an toàn nhưng bình thường. Nhưng nếu bạn nói "tôi muốn kiểu Nhật lười biếng uốn, mái kiểu chữ tám, dài đến xương đòn, lớp rõ ràng", bạn sẽ nhận được kết quả thực sự đúng kỳ vọng.

AI cũng vậy. **Nó cần bạn mô tả rõ hướng thẩm mỹ**, mới có thể tạo giao diện đẹp và độc đáo.

Bài học này dạy bạn hai phương pháp để AI tạo giao diện đẹp:

1. **Mẫu prompt được thiết kế tinh xảo** — Dùng ngôn ngữ tự nhiên nói cho AI biết phong cách thẩm mỹ bạn muốn
2. **Plugin Skills frontend** — Để AI tự động nạp quy chuẩn thiết kế chuyên nghiệp

## Bạn sẽ học được gì

1. Hiểu tại sao giao diện do AI tạo mặc định "rất bình thường"
2. Nắm vững 5 chiều mô tả phong cách thiết kế (font chữ, màu sắc, bố cục, animation, chi tiết)
3. Học sử dụng 3 plugin Skills làm cho giao diện đẹp hơn
4. Thông qua ba kịch bản thực chiến, luyện tập dùng prompt + Skills tạo giao diện đẹp

## 1. Tại sao giao diện do AI tạo mặc định "rất bình thường"?

Trong dữ liệu huấn luyện AI có lượng lớn code frontend, mà phần lớn code đều sử dụng một số lựa chọn "an toàn":

| Chiều | Lựa chọn mặc định của AI | Vấn đề |
| :--- | :--- | :--- |
| Font chữ | Inter, Roboto, Arial | Quá phổ biến, không có cá tính |
| Màu sắc | Gradient tím, màu chính xanh | Giới công nghệ sử dụng quá nhiều, mỏi mắt |
| Bố cục | Lưới đối xứng, chồng card | Tính dự đoán cao, thiếu bất ngờ |
| Animation | Mờ vào mờ ra, hover đơn giản | Không đủ tinh tế, thiếu tầng lớp |
| Nền | Màu đơn, gradient đơn giản | Đơn điệu, thiếu chất liệu |

Những lựa chọn này nhìn riêng đều không tệ, nhưng **khi tất cả các trang do AI tạo đều dùng chúng, thì biến thành "mùi AI"**.

> 💡 **Insight quan trọng**: AI không phải là không biết thiết kế, mà là **mặc định quay về "trung bình thống kê"**. Bạn cần nói rõ hướng lệch khỏi giá trị trung bình.

## 2. Phương pháp 1: Dùng prompt mô tả phong cách thiết kế

### 2.1 Năm chiều của phong cách thiết kế

Để tạo giao diện đẹp, bạn cần mô tả hiệu quả bạn muốn từ 5 chiều:

| Chiều | Điểm mô tả | Từ khóa ví dụ |
| :--- | :--- | :--- |
| **Font chữ** | Tiêu đề dùng font display đậm, nội dung dùng font dễ đọc | Space Grotesk, Playfair Display, JetBrains Mono |
| **Màu sắc** | Màu chính + màu điểm nhấn, tránh phân bố đều | #4F46E5 màu chính + #F59E0B điểm nhấn |
| **Bố cục** | Bất đối xứng, chồng lấp, phá vỡ lưới | Bento Grid, phân vùng bất đối xứng, yếu tố nổi |
| **Animation** | Tải trang được sắp xếp tinh tế, micro-interaction | staggered reveals, kích hoạt cuộn |
| **Chi tiết** | Nền, bóng đổ, viền, họa tiết | Nhiễu, họa tiết hình học, gradient mesh |

### 2.2 Nhìn thấy là tin: Prompt bình thường vs Prompt làm đẹp

Hãy dùng ví dụ landing page để so sánh hiệu quả:

**Prompt bình thường:**

```
Xin làm một landing page cho trợ thủ viết AI, bao gồm thanh điều hướng, hero, giới thiệu tính năng, giá, chân trang
```

**Prompt làm đẹp:**

```
Xin làm một landing page cho trợ thủ viết AI, yêu cầu:

**Phong cách thẩm mỹ: Neubrutalism (Tân dã man)**

**Font chữ:**
- Tiêu đề: Space Grotesk, font weight 700-900
- Nội dung: IBM Plex Sans, font weight 400

**Màu sắc:**
- Màu chính: #000000 (đen thuần)
- Màu nhấn mạnh: #FF6B00 (cam)
- Nền: #FFFDF0 (kem)
- Viền: 3px đen đặc

**Bố cục:**
- Layout bất đối xứng, các yếu tố cách nhau bằng đường kẻ đen dày
- Card có hard shadow (box-shadow: 8px 8px 0px #000)
- Tương phản khoảng trắng大胆

**Animation:**
- Khi tải trang các yếu tố bounce vào từ dưới
- Khi hover nút di chuyển lên 2px

**Chi tiết:**
- Tất cả bo tròn dùng 0px (góc vuông)
- Nút có hiệu ứng 3D mạnh
- Nền thêm họa tiết noise tinh tế
```

Cùng một yêu cầu, prompt thứ hai có thể khiến AI tạo một trang có phong cách rõ ràng, ấn tượng sâu sắc.

### 2.3 Kho tài nguyên Skills làm đẹp frontend

Đừng viết prompt từ số không! Ở đây thu thập các AI Skills liên quan trực tiếp đến làm đẹp frontend:

| Tên kho | Nội dung | Star | Liên kết |
|:---|:---|:---|:---|
| **ui-ux-pro-max-skill** | 57 phong cách + 95 phối màu + 56 font chữ | 10k+ | [GitHub](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) |
| **antigravity-awesome-skills** | Tránh lối mòn thẩm mỹ AI thông dụng | - | [GitHub](https://github.com/sickn33/antigravity-awesome-skills) |
| **superdesigndev/superdesign** | Công cụ phát triển UI native AI | 4.7k | [GitHub](https://github.com/superdesigndev/superdesign) |
| **anthropics/skills/frontend-design** | Skill thiết kế frontend chính thức Anthropic | - | [GitHub](https://github.com/anthropics/skills) |

> 💡 Tham khảo thêm các prompt phong cách thiết kế tại [Phụ lục: Tra cứu nhanh prompt phong cách thiết kế](#style-prompts)

### 2.5 Ba mẫu phong cách thường dùng

Ở đây cho bạn ba mẫu phong cách đã được kiểm chứng, sao chép trực tiếp và sửa đổi để sử dụng:

#### Mẫu 1: Chủ nghĩa tối giản

```
**Phong cách thẩm mỹ: Chủ nghĩa tối giản**

**Font chữ:**
- Tiêu đề: PP Neue Montreal, font weight 500-700
- Nội dung: Inter, font weight 400

**Màu sắc:**
- Màu chính: #FFFFFF (trắng)
- Chữ: #1A1A1A (gần đen)
- Nhấn mạnh: #3B82F6 (xanh, sử dụng ít)

**Bố cục:**
- Rất nhiều khoảng trắng (padding tối thiểu 64px)
- Layout một hoặc hai cột, căn giữa
- Yếu tố cách nhau bằng khoảng trắng thay vì đường phân cách

**Animation:**
- Hiệu ứng mờ vào chậm (duration 600ms)
- Khi hover chuyển tiếp màu gradient

**Chi tiết:**
- Bo tròn: 8px
- Bóng đổ: tinh tế (0 4px 12px rgba(0,0,0,0.08))
- Không trang trí nền
```

#### Mẫu 2: Glassmorphism

```
**Phong cách thẩm mỹ: Glassmorphism (Hình thái kính)**

**Font chữ:**
- Tiêu đề: Outfit, font weight 600-800
- Nội dung: Plus Jakarta Sans, font weight 400-500

**Màu sắc:**
- Nền: gradient #667eea đến #764ba2
- Nền card: rgba(255, 255, 255, 0.1)
- Chữ: #FFFFFF

**Bố cục:**
- Thiết kế card nổi
- Card chồng lấp nhau

**Animation:**
- Khi tải trang card lần lượt nổi lên (staggered)
- Khi hover card phóng to 1.05 lần

**Chi tiết:**
- Bo tròn: 20px
- Nền mờ: backdrop-blur-xl
- Viền: 1px rgba(255, 255, 255, 0.2)
- Hiệu ứng hào quang gradient tinh tế
```

#### Mẫu 3: Bento Grid (Hộp bento)

```
**Phong cách thẩm mỹ: Bento Grid**

**Font chữ:**
- Tiêu đề: SF Pro Display, font weight 700
- Nội dung: SF Pro Text, font weight 400

**Màu sắc:**
- Nền: #F5F5F7 (xám nhạt)
- Card: #FFFFFF (trắng)
- Nhấn mạnh: #0071E3 (xanh Apple)

**Bố cục:**
- Layout lưới, các card kích thước khác nhau ghép lại
- Giữa các card gap 16px
- Bo tròn 24px

**Animation:**
- Khi hover card nhẹ nhàng nổi lên
- Khi nhấn có hiệu ứng nhấn

**Chi tiết:**
- Card lớn hiển thị nội dung quan trọng
- Card nhỏ hiển thị thông tin thứ cấp
- Dùng icon thay thế một phần văn bản
- Bóng đổ sạch (0 4px 24px rgba(0,0,0,0.06))
```

## 3. Phương pháp 2: Dùng plugin Skills tự động nạp quy chuẩn thiết kế

Mỗi lần tự viết prompt phong cách rất phiền. **Skills** là một gói quy chuẩn thiết kế có thể tái sử dụng, sau khi cài đặt AI sẽ tự động áp dụng các quy chuẩn này.

### 3.1 Ba Skills làm cho giao diện đẹp hơn

| Skills | Đặc điểm | Lệnh cài đặt |
| :--- | :--- | :--- |
| **UI/UX Pro Max** | 67 phong cách, 96 phối màu, 57 tổ hợp font chữ | `npm install -g uipro-cli && uipro init --ai claude` |
| **frontend-design** | Chính thức Anthropic, tránh lối mòn thẩm mỹ AI | `npx skills add anthropics/skills/frontend-design` |
| **SuperDesign** | Plugin IDE, tạo nhiều biến thể thiết kế | Tìm "SuperDesign" trên marketplace VSCode |

### 3.2 Cài đặt UI/UX Pro Max (Khuyến nghị nhất)

UI/UX Pro Max là Skills quy chuẩn thiết kế toàn diện nhất hiện nay, nó tích hợp sẵn:

- **67 phong cách UI**: Glassmorphism, Neumorphism, Brutalism, Bento Grid...
- **96 phối màu**: Phân loại theo ngành (SaaS, thương mại điện tử, mạng xã hội...)
- **57 kết hợp font chữ**: Tổ hợp được xác minh bởi designer chuyên nghiệp
- **100+ quy tắc thiết kế**: Quy chuẩn khoảng cách, bo tròn, bóng đổ

**Các bước cài đặt:**

```bash
# 1. Cài đặt CLI toàn cục
npm install -g uipro-cli

# 2. Khởi tạo (chọn công cụ AI bạn sử dụng)
uipro init --ai claude
# Hoặc
uipro init --ai cursor
# Hoặc
uipro init --ai trae
```

Sau khi cài đặt, bạn chỉ cần thêm một câu trong prompt:

```
Sử dụng phong cách Glassmorphism của UI/UX Pro Max, giúp tôi làm một landing page cho trợ thủ viết AI
```

AI sẽ tự động áp dụng quy chuẩn font chữ, màu sắc, bố cục tương ứng.

### 3.3 Cài đặt frontend-design chính thức Anthropic

Đây là Skill thiết kế frontend do Anthropic chính thức sản xuất, chuyên giải quyết vấn đề "lối mòn thẩm mỹ AI":

```bash
# Thực hiện trong Claude Code
npx skills add anthropics/skills/frontend-design
```

Sau khi cài đặt, AI sẽ tự động tránh:
- Inter, Roboto, Arial font chữ
- Nền gradient tím
- Layout lưới đối xứng
- Bóng đổ quá nhạt

Mà thiên về:
- Tổ hợp font chữ độc đáo
- Màu chính大胆 + màu điểm nhấn sắc bén
- Layout bất đối xứng, chồng lấp
- Nền có chất liệu (nhiễu, họa tiết hình học)

## 4. Thực chiến 1: Dùng prompt làm đẹp thiết kế lại landing page

Hãy dùng kiến thức đã học, biến một landing page bình thường thành đẹp.

### 4.1 Phiên bản bình thường

Trước tiên xem AI cho gì với prompt bình thường:

```
Xin giúp tôi làm một landing page cho nền tảng nhận nuôi thú cưng, bao gồm:
- Thanh điều hướng (Logo, liên kết, nút đăng ký)
- Hero (tiêu đề, phụ đề, nút CTA, ảnh thú cưng)
- Giới thiệu thú cưng (ba card thú cưng)
- Về chúng tôi
- Chân trang
```

Trang được tạo...dùng được, nhưng rất bình thường.

### 4.2 Phiên bản làm đẹp

Bây giờ thêm mô tả phong cách:

```
Xin giúp tôi làm một landing page cho nền tảng nhận nuôi thú cưng, yêu cầu:

**Phong cách thẩm mỹ: Ấm áp mềm mại + Cảm giác vẽ tay**

**Font chữ:**
- Tiêu đề: Nunito (font tròn), font weight 700-800
- Nội dung: Nunito, font weight 400-600

**Màu sắc:**
- Màu chính: #FFB347 (cam ấm)
- Màu phụ: #FFCCB3 (cam nhạt)
- Nền: #FFF8F0 (kem)
- Chữ: #5D4037 (nâu)

**Bố cục:**
- Card tròn trịa (border-radius: 24px)
- Card hơi nghiêng xoay (góc khác nhau)
- Hiệu ứng yếu tố nổi, chồng lấp

**Animation:**
- Khi tải trang yếu tố trượt vào từ hai bên
- Khi hover card thú cưng giống thú cưng lắc đầu (animation rotate)
- Khi hover nút có hiệu ứng bounce

**Chi tiết:**
- Tất cả bo tròn dùng 16-24px
- Bóng đổ ấm áp mềm mại (0 8px 24px rgba(255,179,71,0.3))
- Nền thêm họa tiết dấu chân thú
- Ảnh dùng cắt không đều (clip-path)
- Icon phong cách vẽ tay (outline)
```

Trang được tạo sẽ là một giao diện ấm áp, dễ thương, khiến người ta muốn nhận nuôi thú cưng.

## 5. Thực chiến 2: Dùng Skills nhanh chóng tạo dashboard

Skills đặc biệt phù hợp cho hệ thống backend cần nhiều trang.

### 5.1 Sử dụng UI/UX Pro Max

```
Sử dụng phong cách Dashboard Dark của UI/UX Pro Max,
giúp tôi làm một trang dashboard cho trang quản lý backend sản phẩm SaaS, bao gồm:

**Phần trên:** Bốn card thống kê (số người dùng, người dùng hoạt động, doanh thu, API call)

**Phần giữa:**
- Bên trái: Biểu đồ đường tăng trưởng người dùng (7 ngày gần nhất)
- Bên phải: Biểu đồ tròn phân bố gói đăng ký

**Phần dưới:** Danh sách hoạt động gần đây (thời gian, người dùng, thao tác)
```

AI sẽ tự động áp dụng quy chuẩn thiết kế dashboard tối:
- Nền xám đậm (#1A1A2E)
- Card tương phản cao (#16213E)
- Màu dữ liệu tươi sáng (xanh, xanh lá, cam)
- Hiệu ứng card nổi glassmorphism

### 5.2 Sử dụng frontend-design Skill

```
Sử dụng frontend-design skill,
giúp tôi làm trang chủ blog cá nhân, phong cách cần độc đáo, có cá tính
```

AI sẽ chọn một hướng thẩm mỹ phi chủ lưu (ví dụ retro-futurism hoặc phong cách tạp chí), sau đó dùng font chữ, phối màu, bố cục độc đáo để thực hiện.

## 6. Thực chiến 3: Tạo Skill hệ thống thiết kế của riêng bạn

Nếu bạn có phong cách thương hiệu cố định, có thể tạo Skill riêng, để tất cả các trang do AI tạo đều phù hợp với thương hiệu của bạn.

### 6.1 Tạo file Skill

Tạo `.claude/skills/my-brand/SKILL.md` trong dự án:

````markdown
---
name: my-brand
description: Hệ thống thiết kế chuyên dụng cho dự án của tôi, đảm bảo tất cả UI tuân theo ngôn ngữ thiết kế thống nhất
---

# Hệ thống thiết kế dự án của tôi

## Màu thương hiệu
- Màu chính: #6366F1 (Indigo 500)
- Màu phụ: #8B5CF6 (Violet 500)
- Thành công: #10B981
- Cảnh báo: #F59E0B
- Lỗi: #EF4444
- Nền: #F9FAFB
- Card: #FFFFFF

## Hệ thống font chữ
- Tiêu đề: Plus Jakarta Sans
  - H1: 700, 48px
  - H2: 600, 36px
  - H3: 600, 24px
- Nội dung: Inter
  - Body: 400, 16px
  - Small: 400, 14px

## Hệ thống khoảng cách
- Đơn vị cơ bản: 4px
- Padding trong component: 8px / 12px / 16px
- Khoảng cách khối: 24px / 32px / 48px
- Margin trang: 64px

## Bo tròn
- Nút: 8px
- Card: 12px
- Ô nhập: 8px
- Modal: 16px

## Bóng đổ
- Nhỏ: 0 1px 3px rgba(0,0,0,0.1)
- Vừa: 0 4px 12px rgba(0,0,0,0.1)
- Lớn: 0 8px 24px rgba(0,0,0,0.12)

## Animation
- Thời gian chuyển tiếp: 150ms / 300ms
- Hàm easing: cubic-bezier(0.4, 0, 0.2, 1)
- Hiệu ứng hover: phóng đại nhẹ (scale-105)

## Phong cách cấm sử dụng
- Không sử dụng nền gradient tím
- Không sử dụng font chữ ngoài Inter
- Không sử dụng bo tròn lớn hơn 16px
- Không sử dụng đen thuần (#000000), dùng #1F2937
````

### 6.2 Sử dụng Skill của riêng bạn

Sau khi tạo, bạn chỉ cần nói trong prompt:

```
Sử dụng my-brand skill, giúp tôi làm một trang cài đặt người dùng
```

AI sẽ tự động áp dụng tất cả quy chuẩn thiết kế bạn đã định nghĩa.

## 7. Tổng kết

Có hai phương pháp để AI tạo giao diện đẹp:

| Phương pháp | Ưu điểm | Nhược điểm | Kịch bản phù hợp |
| :--- | :--- | :--- | :--- |
| **Mô tả bằng prompt** | Linh hoạt, mỗi lần có thể điều chỉnh | Cần viết lặp lại | Trang dùng một lần, thử nghiệm phong cách khác nhau |
| **Plugin Skills** | Cài một lần, hiệu quả liên tục | Cần cài đặt cấu hình | Dự án có yêu cầu phong cách cố định |

**Đề xuất quy trình làm việc Vibe Coding:**

1. **Giai đoạn khám phá**: Dùng các prompt phong cách khác nhau thử nghiệm, tìm hướng thẩm mỹ bạn thích
2. **Sau khi xác định phong cách**: Cài đặt Skill tương ứng (UI/UX Pro Max hoặc frontend-design)
3. **Dự án thương hiệu**: Tạo Skill riêng, thống nhất ngôn ngữ thiết kế toàn dự án

### Bài tập

Chọn một trong các kịch bản sau, hoàn thành từ đầu bằng phương pháp của bài học này:

1. Dùng prompt phong cách thiết kế lại giao diện cho một dự án bạn đã làm trước đó (chọn một phong cách bạn thích)
2. Cài đặt UI/UX Pro Max, dùng một phong cách của nó để tạo một trang mới
3. Tạo Skill hệ thống thiết kế riêng, định nghĩa màu thương hiệu và font chữ của bạn

---

## Phụ lục: Bảng tra cứu nhanh phong cách thiết kế

| Phong cách | Từ khóa | Kịch bản phù hợp | Sản phẩm ví dụ |
| :--- | :--- | :--- | :--- |
| **Chủ nghĩa tối giản** | Khoảng trắng, đơn sắc,简洁 | Sản phẩm cao cấp, portfolio cá nhân | Trang Apple |
| **Glassmorphism** | Kính mờ, gradient, mờ | Sản phẩm công nghệ, landing page SaaS | macOS Big Sur |
| **Neubrutalism** | Viền dày, hard shadow, màu đơn | Thương hiệu trend, trang nghệ thuật | Brassius |
| **Bento Grid** | Lưới, ghép dán, card | Hiển thị thông tin, dashboard | Trang quảng cáo Apple |
| **Retro tương lai** | Neon, gradient, synthwave | Thể loại game, âm nhạc | STRANGER THINGS |
| **Phong cách vẽ tay** | Không đều, tròn trịa, minh họa | Thể loại giáo dục, sản phẩm trẻ em | Duolingo |
| **Phong cách tạp chí** | Font lớn, bất đối xứng, khoảng trắng | Trang nội dung, blog | Medium |
| **Sang trọng tối** | Màu tối, vàng, tinh xảo | Sản phẩm cao cấp, hàng xa xỉ | Các thương hiệu cao cấp |

## Phụ lục: Tra cứu cài đặt Skills

```bash
# UI/UX Pro Max
npm install -g uipro-cli
uipro init --ai claude

# Anthropic frontend-design
npx skills add anthropics/skills/frontend-design

# Anthropic brand-guidelines
npx skills add anthropics/skills/brand-guidelines

# Xem Skills đã cài trong Claude Code
/help
```

## Phụ lục: Gợi ý phối màu

| Phối màu | Màu chính | Màu điểm nhấn | Nền | Phong cách |
| :--- | :--- | :--- | :--- | :--- |
| **Hoàng hôn** | #F97316 | #FBBF24 | #FFF7ED | Ấm áp, năng động |
| **Đại dương** | #0EA5E9 | #06B6D4 | #F0F9FF | Tươi mát, chuyên nghiệp |
| **Rừng** | #10B981 | #34D399 | #ECFDF5 | Tự nhiên, sức khỏe |
| **Quả mọng** | #8B5CF6 | #EC4899 | #FAF5FF | Lãng mạn, sáng tạo |
| **Cà phê** | #78350F | #D97706 | #FFFBEB | Ấm áp, hoài cổ |
| **Đơn sắc** | #6B7280 | #9CA3AF | #F9FAFB | Chuyên nghiệp, trung tính |

## Phụ lục: Tra cứu nhanh prompt phong cách thiết kế {#style-prompts}

Các prompt có thể thử để làm trang frontend đẹp hơn:

### Danh mục phong cách

| Phong cách | Từ khóa (Tiếng Anh) | Đặc điểm thị giác cốt lõi | Ví dụ prompt |
|:---|:---|:---|:---|
| **Pop Art** | Pop Art | Màu tương phản大胆, đường viền đen, họa tiết dot | Pop art style website, bold colors and comic dots, vibrant |
| **Chủ nghĩa tối giản** | Minimalism | Rất nhiều khoảng trắng, ít màu và đường, không trang trí | Minimalist web design, ample white space, geometric, serene |
| **Chủ nghĩa biểu hiện trừu tượng** | Abstract Expressionism | Nét cọ đầy sức mạnh cảm xúc, bắn màu | Abstract expressionism background, dynamic paint splashes, emotional |
| **Phong cách retro** | Retro/Vintage | Font cũ, họa tiết cũ, phối màu retro | Retro 80s website design, neon grid and synthwave color palette |
| **Cyberpunk** | Cyberpunk | Màu neon tương phản cao, hiệu ứng glitch art, nền tối | Cyberpunk UI, neon lights on dark background, glitch effects |
| **Neumorphism** | Neumorphism | Bóng đổ và highlight mềm, chất cảm hơi lồi/loĩ | Neumorphism design style, soft shadows, clean and modern |
| **Nghệ thuật tạo sinh** | Generative Art | Họa tiết thị giác chảy được tạo bằng thuật toán | Generative art background, flowing algorithmic patterns, digital |
| **Acid Graphics** | Acid Graphics | Chất cảm kim loại, hình thái kính, font răng cưa | Acid graphics web layout, glass morphism, chaotic typography |
| **3D chìm đắm** | Immersive 3D | Cảnh 3D tương tác, cảm giác không gian cực mạnh | Immersive 3D website, interactive product model in space |

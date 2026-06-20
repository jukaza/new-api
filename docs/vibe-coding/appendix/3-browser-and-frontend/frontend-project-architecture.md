# Thiết Kế Kiến Trúc Dự Án Frontend

::: tip 🎯 Câu Hỏi Cốt Lõi
**Từ trang HTML đơn giản đến ứng dụng doanh nghiệp phức tạp, làm sao để chọn kiến trúc phù hợp cho dự án ở các quy mô khác nhau?** Điều này giống như hỏi: từ căn hộ studio đến trung tâm thương mại lớn, làm sao thiết kế bố cục không gian khác nhau theo nhu cầu? Kiến trúc tốt nên tiến hóa cùng với sự phát triển của dự án, chứ không phải thiết kế quá mức ngay từ đầu.
:::

---

## 1. Tiến Hóa Kiến Trúc: Từ Đơn Giản Đến Phức Tạp

### 1.1 Tổng Quan Ba Cấp Độ Phức Tạp

Kiến trúc dự án frontend nên phù hợp với độ phức tạp của dự án. Chúng ta phân dự án thành ba cấp độ theo hai chiều **độ phức tạp kỹ thuật** và **quy mô người dùng**:

| Cấp Độ | Technology Stack | Quy Mô Người Dùng | Tình Huống Điển Hình | Trọng Tâm Quan Tâm |
|------|--------|----------|----------|------------|
| **Nhập môn** | HTML/CSS/JS | Cá nhân/Nhóm nhỏ | Blog cá nhân, trang quảng bá, công cụ đơn giản | Triển khai nhanh, bảo trì đơn giản |
| **Nâng cao** | Vue/React + công cụ build | Doanh nghiệp vừa và nhỏ | Hệ thống quản lý, frontend TMĐT, SaaS | Tái sử dụng component, quản lý state |
| **Doanh nghiệp** | Framework + Micro-frontend/SSR | Ứng dụng lớn | Nền tảng lớn, hệ thống nghiệp vụ phức tạp | Tối ưu hiệu năng, làm việc nhóm, khả năng mở rộng |

::: tip 💡 Làm Sao Để Chọn?
**Đừng thiết kế quá mức!** Nhiều dự án bắt đầu từ HTML đơn giản, theo nhu cầu tăng dần mới đưa vào framework và công cụ.

- Dự án cá nhân → Cấp nhập môn
- Startup MVP → Cấp nhập môn hoặc nâng cao
- Hệ thống quản lý doanh nghiệp → Cấp nâng cao
- Nền tảng Internet lớn → Cấp doanh nghiệp
:::

---

## 2. Cấp Nhập Môn: Dự Án HTML/CSS/JS

### 2.1 Tình Huống Áp Dụng

- Blog cá nhân, trang CV
- Trang quảng bá sản phẩm (Landing Page)
- Trang công cụ đơn giản (máy tính, chuyển đổi, v.v.)
- Xác minh prototype, Demo nhanh

### 2.2 Cấu Trúc Thư Mục Khuyến Nghị

```
my-simple-project/
├── index.html              # Trang chủ
├── about.html              # Trang giới thiệu (nếu có)
├── css/
│   ├── reset.css           # Reset style
│   ├── variables.css       # Biến CSS (màu sắc, font, v.v.)
│   ├── components.css      # Style component (button, card, v.v.)
│   └── main.css            # File style chính
├── js/
│   ├── utils.js            # Hàm tiện ích
│   ├── api.js              # Gọi API đơn giản
│   └── main.js             # Logic chính
├── assets/
│   ├── images/             # Tài nguyên ảnh
│   └── fonts/              # File font
└── README.md               # Mô tả dự án
```

### 2.3 Nguyên Tắc Tổ Chức Code

**HTML**: Thẻ ngữ nghĩa, cấu trúc rõ ràng

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog Cá Nhân Của Tôi</title>
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/main.css">
</head>
<body>
  <header class="site-header">
    <nav class="main-nav">
      <a href="index.html">Trang Chủ</a>
      <a href="about.html">Giới Thiệu</a>
    </nav>
  </header>

  <main class="content">
    <article class="blog-post">
      <h1>Tiêu Đề Bài Viết</h1>
      <p>Nội dung bài viết...</p>
    </article>
  </main>

  <footer class="site-footer">
    <p>&copy; 2024 Blog Của Tôi</p>
  </footer>

  <script src="js/utils.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

**CSS**: Dùng biến CSS quản lý theme

```css
/* variables.css */
:root {
  --primary-color: #3498db;
  --text-color: #333;
  --bg-color: #fff;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --font-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* components.css - style component có thể tái sử dụng */
.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: 4px;
  background: var(--primary-color);
  color: white;
  cursor: pointer;
}

.card {
  padding: var(--spacing-md);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

**JavaScript**: Tổ chức module (dùng ES6 module hoặc tách đơn giản)

```javascript
// utils.js
const utils = {
  // Đơn giản hóa thao tác DOM
  $(selector) {
    return document.querySelector(selector);
  },

  // Debounce đơn giản
  debounce(fn, delay) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  // Đóng gói local storage
  storage: {
    get(key) {
      return JSON.parse(localStorage.getItem(key) || 'null');
    },
    set(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
};

// main.js
document.addEventListener('DOMContentLoaded', () => {
  // Logic khởi tạo trang
  initNavigation();
  loadBlogPosts();
});
```

### 2.4 Best Practice

✅ **Nên làm**:
- Dùng thẻ HTML ngữ nghĩa
- Biến CSS quản lý màu sắc và khoảng cách
- Nén ảnh và lazy loading
- Thêm meta tag SEO cơ bản

❌ **Tránh**:
- Style nội tuyến (`style="..."`)
- Ô nhiễm biến toàn cục
- Code lặp lại (copy paste)

---

## 3. Cấp Nâng Cao: Dự Án Vue/React Framework

### 3.1 Tình Huống Áp Dụng

- Hệ thống quản lý doanh nghiệp (ERP, CRM, OA)
- Frontend/Backend TMĐT
- Ứng dụng SaaS
- Web app cần tương tác phức tạp

### 3.2 Cấu Trúc Khuyến Nghị Cho Dự Án Vue

```
my-vue-project/
├── public/                     # Tài nguyên tĩnh
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── assets/                 # Style, ảnh, font
│   │   ├── styles/
│   │   │   ├── variables.scss
│   │   │   ├── mixins.scss
│   │   │   └── global.scss
│   │   └── images/
│   ├── components/             # Component chung
│   │   ├── common/             # Chung toàn cục (Button, Modal, v.v.)
│   │   │   ├── Button/
│   │   │   │   ├── index.vue
│   │   │   │   └── Button.scss
│   │   │   └── Modal/
│   │   └── business/           # Component nghiệp vụ (UserCard, v.v.)
│   ├── views/                  # Component trang
│   │   ├── Home/
│   │   ├── User/
│   │   │   ├── List.vue
│   │   │   └── Detail.vue
│   │   └── Product/
│   ├── router/                 # Cấu hình router
│   │   └── index.js
│   ├── stores/                 # Pinia/Vuex quản lý state
│   │   ├── user.js
│   │   └── app.js
│   ├── services/               # Dịch vụ API
│   │   ├── request.js          # Đóng gói axios
│   │   ├── user.js
│   │   └── product.js
│   ├── utils/                  # Hàm tiện ích
│   │   ├── format.js
│   │   ├── validate.js
│   │   └── storage.js
│   ├── composables/            # Composable function
│   │   ├── useAuth.js
│   │   └── useLoading.js
│   ├── constants/              # Định nghĩa hằng số
│   │   └── index.js
│   ├── App.vue
│   └── main.js
├── tests/                      # File test
├── .env                        # Biến môi trường
├── vite.config.js
├── package.json
└── README.md
```

### 3.3 Cấu Trúc Khuyến Nghị Cho Dự Án React

```
my-react-project/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/             # Component chung
│   │   │   ├── Button/
│   │   │   │   ├── index.jsx
│   │   │   │   └── Button.module.css
│   │   │   └── Modal/
│   │   └── business/           # Component nghiệp vụ
│   ├── pages/                  # Component trang
│   │   ├── Home/
│   │   ├── User/
│   │   └── Product/
│   ├── hooks/                  # Custom Hooks
│   │   ├── useAuth.js
│   │   └── useFetch.js
│   ├── services/               # Dịch vụ API
│   │   ├── api.js
│   │   └── userService.js
│   ├── store/                  # Redux/Zustand quản lý state
│   │   ├── slices/
│   │   └── index.js
│   ├── utils/
│   ├── constants/
│   ├── App.jsx
│   └── main.jsx
├── tests/
└── package.json
```

### 3.4 Giải Thích Chi Tiết Khái Niệm Then Chốt

#### Nguyên Tắc Thiết Kế Component

**Trách nhiệm đơn**: Một component chỉ làm một việc

```vue
<!-- ❌ Ví dụ xấu: component làm quá nhiều việc -->
<template>
  <div>
    <form @submit="handleSubmit">
      <!-- Nội dung form -->
    </form>
    <table>
      <!-- Bảng dữ liệu -->
    </table>
    <div class="charts">
      <!-- Biểu đồ thống kê -->
    </div>
  </div>
</template>

<!-- ✅ Ví dụ tốt: tách thành component độc lập -->
<template>
  <div>
    <UserForm @submit="fetchData" />
    <UserTable :data="users" />
    <UserStats :data="users" />
  </div>
</template>
```

#### Chiến Lược Quản Lý State

| Loại State | Nơi Lưu Trữ | Ví Dụ |
|----------|----------|------|
| **State toàn cục** | Pinia/Redux | Thông tin người dùng, trạng thái đăng nhập, cài đặt theme |
| **State trang** | Component trang | Điều kiện truy vấn danh sách, thông tin phân trang |
| **State component** | Bên trong component | Nhập form, hiển thị/ẩn popup |
| **State phía server** | TanStack Query/SWR | Dữ liệu máy chủ, cache |

#### Lựa Chọn Cách Tổ Chức Thư Mục

**Cách 1: Tổ chức theo loại (phù hợp dự án nhỏ)**

```
src/
├── components/     # Tất cả component
├── views/          # Tất cả trang
├── stores/         # Tất cả state
└── services/       # Tất cả dịch vụ
```

**Cách 2: Tổ chức theo chức năng (phù hợp dự án vừa và lớn)**

```
src/
├── features/
│   ├── auth/       # Tất cả code của chức năng xác thực
│   ├── user/       # Tất cả code của chức năng người dùng
│   └── product/    # Tất cả code của chức năng sản phẩm
├── shared/         # Tài nguyên chia sẻ
└── App.vue
```

::: tip 💡 Làm Sao Để Chọn?
- Số trang dự án < 10 → Tổ chức theo loại
- Số trang dự án > 20 → Tổ chức theo chức năng
- Team > 5 người → Tổ chức theo chức năng, thuận tiện phát triển song song
:::

---

## 4. Cấp Doanh Nghiệp: Kiến Trúc Ứng Dụng Lớn

### 4.1 Tình Huống Áp Dụng

- Nền tảng Internet lớn (TMĐT, mạng xã hội, nền tảng nội dung)
- Ứng dụng doanh nghiệp phức tạp
- Dự án cần hỗ trợ nhiều team cộng tác
- Dự án yêu cầu cực cao về hiệu năng và khả năng bảo trì

### 4.2 Kiến Trúc Micro-Frontend

Khi quy mô dự án lớn đến mức một codebase đơn khó bảo trì, có thể cân nhắc kiến trúc **micro-frontend**.

```
Nền tảng TMĐT lớn/
├── Ứng dụng cơ sở (Main framework)
│   ├── Navigation trên cùng
│   ├── Menu bên cạnh
│   ├── Cổng trung tâm người dùng
│   └── Container cho sub-app
├── Sub-app Sản Phẩm (triển khai độc lập)
│   ├── Danh sách sản phẩm
│   ├── Chi tiết sản phẩm
│   └── Quản lý sản phẩm
├── Sub-app Đơn Hàng (triển khai độc lập)
│   ├── Giỏ hàng
│   ├── Danh sách đơn hàng
│   └── Quy trình thanh toán
├── Sub-app Người Dùng (triển khai độc lập)
│   ├── Trung tâm cá nhân
│   ├── Địa chỉ giao hàng
│   └── Phiếu giảm giá
└── Sub-app Marketing (triển khai độc lập)
    ├── Trang hoạt động
    ├── Phát phiếu giảm giá
    └── Shop tích điểm
```

**Ưu thế của micro-frontend**:
- Team tự chủ: Mỗi sub-app phát triển, triển khai độc lập
- Không phụ thuộc tech stack: Các team khác nhau có thể dùng framework khác nhau
- Nâng cấp dần dần: Có thể từng bước重构 hệ thống cũ

### 4.3 Cấu Trúc Thư Mục Cấp Doanh Nghiệp

```
enterprise-project/
├── apps/                       # Sub-app micro-frontend
│   ├── main/                   # Ứng dụng cơ sở
│   ├── product/
│   ├── order/
│   └── user/
├── packages/                   # Gói chia sẻ (Monorepo)
│   ├── ui-components/          # Thư viện component chung
│   ├── utils/                  # Hàm tiện ích
│   ├── constants/              # Định nghĩa hằng số
│   └── types/                  # TypeScript types
├── shared/                     # Cấu hình chia sẻ
│   ├── eslint-config/
│   ├── ts-config/
│   └── vite-config/
├── docs/                       # Tài liệu dự án
├── scripts/                    # Script build
└── package.json
```

### 4.4 Kiến Trúc Tối Ưu Hiệu Năng

Ứng dụng lớn cần quan tâm tối ưu hiệu năng:

```
Chiến lược tối ưu hiệu năng/
├── Tối ưu thời điểm build
│   ├── Code Splitting
│   ├── Route lazy loading
│   ├── Tree Shaking
│   └── Nén tài nguyên
├── Tối ưu thời điểm runtime
│   ├── Virtual scrolling (danh sách dài)
│   ├── Lazy loading ảnh
│   ├── Render component theo nhu cầu
│   └── Chiến lược cache
└── Tối ưu mạng
    ├── Tăng tốc CDN
    ├── HTTP cache
    ├── Preload tài nguyên
    └── Service Worker
```

### 4.5 Kiến Trúc SSR/SSG

Đối với tình huống cần SEO hoặc hiệu năng first screen:

| Phương Án | Tình Huống Áp Dụng | Framework Đại Diện |
|------|----------|----------|
| **SSR** | Cần SEO, first screen render nhanh | Next.js, Nuxt.js |
| **SSG** | Nội dung tĩnh, cập nhật không thường xuyên | Astro, VitePress |
| **Hỗn hợp** | Một phần tĩnh, một phần động | Next.js (ISR) |

---

## 5. Lựa Chọn Kiến Trúc Theo Mức Độ Người Dùng

### 5.1 Cá Nhân/Nhóm Nhỏ (DAU < 1000)

**Đặc điểm**: Lặp nhanh, tài nguyên hạn chế, nhu cầu thay đổi nhanh

**Kiến trúc khuyến nghị**:
- Tech stack: Vue 3 + Vite hoặc React + Vite
- Quản lý state: Pinia hoặc Zustand (nhẹ)
- Thư viện UI: Element Plus / Ant Design
- Triển khai: Vercel / Netlify / Cloud server

**Cấu trúc thư mục**: Tổ chức theo loại đơn giản là đủ

### 5.2 Doanh Nghiệp Vừa (DAU 1k-100k)

**Đặc điểm**: Nghiệp vụ phức tạp, làm việc nhóm, cần ổn định

**Kiến trúc khuyến nghị**:
- Tech stack: Vue 3 + TypeScript hoặc React + TypeScript
- Quản lý state: Pinia + Composable hoặc Redux Toolkit
- Thư viện UI: Thư viện component tự build + thư viện component nghiệp vụ
- Test: Unit test + E2E test
- Triển khai: CI/CD pipeline + Docker

**Cấu trúc thư mục**: Tổ chức theo chức năng, thiết lập quy chuẩn

### 5.3 Nền Tảng Lớn (DAU > 100k)

**Đặc điểm**: Concurrent cao, nhiều team cộng tác, bảo trì lâu dài

**Kiến trúc khuyến nghị**:
- Tech stack: React/Vue + TypeScript (strict mode)
- Kiến trúc: Micro-frontend + Monorepo
- Quản lý state: Quản lý state hạt mịn + cache state phía server
- Hiệu năng: SSR/SSG + CDN + Edge computing
- Giám sát: Frontend monitoring + error tracking + phân tích hiệu năng

**Cấu trúc thư mục**: Monorepo + Micro-frontend

---

## 6. Roadmap Tiến Hóa Kiến Trúc

### 6.1 Ví Dụ Tiến Hóa: Từ Blog Đến Nền Tảng

```
Giai đoạn 1: Blog cá nhân (HTML/CSS/JS)
    ↓ Nhu cầu: cần admin panel
Giai đoạn 2: Thêm admin panel (Vue/React + cấu trúc đơn giản)
    ↓ Nhu cầu: hệ thống người dùng, chức năng bình luận
Giai đoạn 3: Module hóa chức năng (tổ chức theo chức năng)
    ↓ Nhu cầu: nhiều team cộng tác, triển khai độc lập
Giai đoạn 4: Kiến trúc micro-frontend (Monorepo)
```

### 6.2 Khi Nào Nên Nâng Cấp Kiến Trúc?

| Tín Hiệu | Mô Tả | Khuyến Nghị |
|------|------|------|
| Thời gian build > 5 phút | Dự án quá lớn | Code splitting, micro-frontend |
| Nhiều người thường xuyên conflict | Cộng tác khó khăn | Tổ chức theo chức năng, tách module |
| Sửa một chỗ hỏng nhiều chỗ | Coupling nghiêm trọng | Refactor, tăng cường test |
| First screen load > 3 giây | Vấn đề hiệu năng | Lazy loading, SSR, tối ưu |
| Thành viên mới上手 chậm | Cấu trúc hỗn loạn | Tài liệu, quy chuẩn, refactor |

---

## 7. Tổng Kết

::: tip 💡 Tư Tưởng Cốt Lõi
**Kiến trúc không có viên đạn bạc, phù hợp mới là tốt nhất.**

- **Dự án nhỏ** đừng thiết kế quá mức, HTML/CSS/JS là đủ
- **Dự án vừa** thiết lập quy chuẩn, component hóa, module hóa
- **Dự án lớn** cân nhắc micro-frontend, tối ưu hiệu năng, làm việc nhóm

**Ghi nhớ những điểm này**:
1. **Tiến hóa dần dần**: Bắt đầu từ đơn giản, theo nhu cầu tăng trưởng
2. **Quy ước thống nhất**: Đặt tên, cấu trúc, phong cách code giữ nhất quán
3. **Tài liệu đi trước**: Quyết định kiến trúc phải ghi lại, thuận tiện kế thừa
4. **Refactor định kỳ**: Nợ kỹ thuật phải trả kịp thời

**Mục tiêu cuối cùng**: Làm cho code giống như không gian được sắp xếp gọn gàng, dù lớn hay nhỏ, đều có thể vận hành hiệu quả.
:::

---

## Tài Nguyên Tham Khảo

- [Vue Style Guide](https://vuejs.org/style-guide/)
- [React Project Structure Recommendations](https://react.dev/learn/thinking-in-react)
- [Bulletproof React - Architecture Guide](https://github.com/alan2207/bulletproof-react)
- [Feature Sliced Design](https://feature-sliced.design/)
- [Micro-Frontend Architecture](https://micro-frontends.org/)
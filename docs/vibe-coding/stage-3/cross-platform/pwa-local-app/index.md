# Cách Xây dựng Ứng dụng PWA Cục bộ: Biến Trang web thành "Ứng dụng Thực sự"

# 1 PWA và Phát triển PWA Là Gì

Trong hướng dẫn này, chúng ta sẽ hoàn thành một vòng lặp khép kín: **từ một dự án web thông thường đến một "ứng dụng thực sự" có thể được cài đặt trên màn hình desktop và điện thoại và vẫn hoạt động khi ngoại tuyến.** Bạn sẽ đích thân biến một ứng dụng React thành PWA, triển khai trực tuyến và cài đặt trên điện thoại để kiểm tra.

Những gì chúng ta sẽ xây dựng là một ứng dụng **Trang trại Cà chua** - một PWA kết hợp hoàn hảo kỹ thuật Pomodoro với trò chơi nông trại. Bạn kiếm điểm thông qua 25 phút làm việc tập trung, sau đó sử dụng những điểm đó để mua hạt giống và trồng cây. Khi cấp độ tăng, bạn mở khóa nhiều đất nông nghiệp và hạt giống tốt hơn. Điều quan trọng nhất là nó tiếp tục hoạt động ngay cả khi không có internet và tất cả dữ liệu được lưu trữ cục bộ.

Để thực hiện hướng dẫn này, bạn cần ít nhất:

- Một máy tính (Windows hoặc Mac)
- Môi trường Node.js (phiên bản 18.0 trở lên)
- Trợ lý lập trình AI của bạn (Cursor / Trae / Claude Code, v.v.)
- Một điện thoại (để kiểm tra cài đặt trên điện thoại)

## 1.1 Định nghĩa PWA

**PWA (Progressive Web App)** là một loại trang web đặc biệt. Thông qua công nghệ **Service Worker**, nó có khả năng "tự lưu vào bộ nhớ đệm và tự tiếp quản."

### Tại sao trang web thông thường không thể hoạt động ngoại tuyến, nhưng PWA thì có thể

Một trang web thông thường cần tải xuống các tệp HTML, CSS và JS từ máy chủ mỗi lần mở, vì vậy nếu mạng bị ngắt, nó đơn giản là không thể tải. PWA, mặt khác, sử dụng **Service Worker** (một script JS chạy trong nền trình duyệt) để lưu các tệp này vào bộ nhớ đệm cục bộ trong lần truy cập đầu tiên. Sau đó, ngay cả khi mạng bị ngắt, Service Worker có thể đọc tệp trực tiếp từ bộ nhớ đệm cục bộ và hiển thị trang bình thường.

**Một phép so sánh đơn giản**: một trang web thông thường giống như mượn sách từ thư viện mỗi lần (bạn phải có internet), trong khi PWA giống như mua sách và đặt trên kệ sách của riêng bạn (sau khi tải xuống lần đầu, bạn vẫn có thể đọc ngoại tuyến).

### PWA so với Trang web Thông thường so với Ứng dụng Native

| Tính năng | Trang web Thông thường | PWA | Ứng dụng Native |
|------|---------|-----|---------|
| **Cài đặt** | Không cần | Tùy chọn (thêm vào màn hình chính) | Phải tải xuống từ cửa hàng ứng dụng |
| **Sử dụng ngoại tuyến** | ❌ Không | ✅ Có (sau khi lưu vào bộ nhớ đệm) | ✅ Có |
| **Phương thức cập nhật** | Tự động làm mới | Tự động / cập nhật nền | Người dùng cập nhật thủ công |
| **Kích thước** | Không | Vài trăm KB đến vài MB | Hàng chục MB trở lên |
| **Chi phí phát triển** | Thấp | Thấp (một codebase) | Cao (iOS / Android riêng biệt) |

**Tóm tắt một câu**: PWA là "một trang web có thể lưu trữ các tệp của riêng mình" - nó có sự nhẹ nhàng của trang web (không cần cài đặt, tự động cập nhật) và trải nghiệm của ứng dụng native (hỗ trợ ngoại tuyến, có thể cài đặt lên desktop/màn hình chính).

<!-- ![](/zh-cn/stage-3/cross-platform/pwa-local-app/images/image1.png) -->

## 1.2 Tại sao Chọn PWA?

Trong kỷ nguyên Vibe Coding, PWA là một trong những "giải pháp cross-platform" hiệu quả nhất:

| Kích thước So sánh | Ứng dụng Native | PWA |
|---------|---------|-----|
| Chi phí phát triển | Phải phát triển iOS / Android / desktop riêng biệt | Một codebase cho tất cả nền tảng |
| Cài đặt | Phải đến cửa hàng ứng dụng | Cài đặt trực tiếp trong trình duyệt, tức thì |
| Phương thức cập nhật | Người dùng phải cập nhật thủ công | Tự động cập nhật, không hiển thị với người dùng |
| Kích thước gói | Thường hàng chục MB | Thường chỉ vài trăm KB |
| Hỗ trợ ngoại tuyến | Tích hợp tự nhiên | Hỗ trợ thông qua Service Worker |
| Kịch bản tốt nhất | Cần truy cập phần cứng sâu (AR / Bluetooth, v.v.) | Hiển thị nội dung, công cụ, ứng dụng nhẹ |

**Tóm tắt một câu**: nếu ứng dụng của bạn không cần AR qua camera hoặc truy cập phần cứng Bluetooth, PWA gần như là lựa chọn dễ nhất.

## 1.5 Lộ trình Hướng dẫn

Để làm cho quá trình học tập ít nhàm chán hơn, hướng dẫn này xoay quanh một case thú vị và thực tế - **Trang trại Cà chua**. Đây là một trò chơi nông trại Pomodoro kết hợp làm việc tập trung với phần thưởng trò chơi hóa. Cùng với chế độ Vibe Coding của trợ lý lập trình AI, chúng ta sẽ chia quá trình từ không đến cài đặt trên điện thoại thành một lộ trình có thể tái sử dụng:

1. **Xây dựng hiểu biết và môi trường**: hiểu PWA là gì, cài đặt Node.js và trợ lý lập trình AI, đảm bảo toolchain trơn tru.
2. **Xây dựng khung dự án**: tạo một dự án React + TypeScript có thể chạy cục bộ.
3. **Phát triển lặp với AI**: thông qua trò chuyện với AI, xây dựng đếm ngược Pomodoro, hệ thống nông trại, hệ thống cấp độ, render cây trồng SVG và hơn thế nữa.
4. **Cấu hình PWA và kiểm tra ngoại tuyến**: thêm Service Worker và Manifest, sau đó xác minh hỗ trợ ngoại tuyến.
5. **Triển khai và cài đặt trên điện thoại**: triển khai lên Vercel để có URL HTTPS, sau đó cài đặt và sử dụng trên điện thoại.

Phần này chỉ đưa ra bức tranh tổng thể, mà không mở rộng các lệnh chính xác. Bây giờ, chỉ cần nhớ dòng chính: **Thiết lập môi trường -> Xây dựng khung -> Mô tả và tạo bằng AI -> Cấu hình PWA -> Triển khai và giao hàng**. Trong các chương tiếp theo, chúng ta sẽ hướng dẫn bạn qua từng bước.

# 2 Thiết lập Môi trường Phát triển

## 2.1 Các Công cụ được Sử dụng trong Hướng dẫn này

Trong suốt quá trình phát triển, chúng ta sử dụng ba công cụ cùng nhau và chúng đóng các vai trò "thiết kế," "xây dựng," và "kiểm duyệt."

- **Trợ lý lập trình AI (Cursor / Trae / Claude Code)**: đây là **đối tác lập trình AI** của bạn. Trong chế độ Vibe Coding, chúng ta không cần phải viết code từng dòng. Thay vào đó, chúng ta chủ yếu nói với AI bằng ngôn ngữ tự nhiên chức năng mình muốn và nó xử lý việc tạo và sửa đổi code.
- **Node.js + Vite**: đây là **nhà máy xây dựng dự án**. Node.js cung cấp môi trường chạy JavaScript và Vite là công cụ xây dựng frontend thế hệ tiếp theo với tốc độ cực nhanh, đặc biệt phù hợp để xây dựng PWA.
- **Một điện thoại**: đóng vai trò là **thiết bị kiểm tra** để xác minh kết quả chạy. Bạn có thể trực tiếp truy cập PWA đã triển khai trong trình duyệt trên điện thoại và kiểm tra cài đặt thực tế và chức năng ngoại tuyến.

## 2.2 Cài đặt Node.js

Node.js là môi trường cơ bản cho phát triển PWA. Truy cập trang web chính thức [https://nodejs.org](https://nodejs.org) và tải xuống phiên bản **LTS (Hỗ trợ Dài hạn)** (hướng dẫn này dựa trên Node.js 18.x trở lên).

Sau khi tải xuống, cài đặt như phần mềm thông thường bằng cách nhấp đúp vào trình cài đặt và giữ các tùy chọn mặc định.

Sau khi cài đặt, mở terminal (CMD / PowerShell trên Windows, Terminal trên Mac) và chạy:

```bash
node --version
npm --version
```

Nếu bạn thấy đầu ra phiên bản như `v18.17.0` và `9.6.7`, điều đó có nghĩa là cài đặt thành công.

<!-- 0 -->

## 2.3 Cài đặt Trợ lý Lập trình AI

Trợ lý lập trình AI là chiến trường chính của **Vibe Coding**. Bạn có thể hiểu đơn giản nó là một **"trình soạn thảo với AI siêu việt được tích hợp sẵn."**

**Các lựa chọn khuyến nghị:**

- **Trae**: truy cập [https://www.trae.cn](https://www.trae.cn) và tải xuống phiên bản phù hợp với hệ điều hành của bạn
- **Cursor**: truy cập [https://cursor.sh](https://cursor.sh) và cài đặt
- **Claude Code**: nếu bạn đã sử dụng Claude, bạn có thể sử dụng Claude Code trực tiếp

Quá trình cài đặt rất đơn giản, giống như cài đặt phần mềm bình thường. Sau khi chuẩn bị công cụ này, trong thực hành sau đây chúng ta không cần phải nhìn vào các cửa sổ code nhàm chán nữa. Thay vào đó, chúng ta sẽ mở dự án tại đây và sử dụng ngôn ngữ tự nhiên trong hộp trò chuyện để yêu cầu AI viết code và sửa lỗi.

<!-- 0 -->

## 2.4 Tạo Dự án Mới

Mở trợ lý lập trình AI của bạn và nhập Prompt sau trong hộp trò chuyện:

```text
Vui lòng giúp tôi tạo một dự án React tên là tomato-farm-pwa để xây dựng ứng dụng Trang trại Cà chua.
Nó cần hỗ trợ TypeScript và cũng bao gồm chức năng PWA (loại có thể cài đặt lên màn hình chính điện thoại).
```

AI sẽ tự động thực hiện các bước sau:

**Bước 1: Tạo dự án**

```bash
npm create vite@latest tomato-farm-pwa -- --template react-ts
```

**Bước 2: Vào dự án và cài đặt dependency**

```bash
cd tomato-farm-pwa
npm install
```

**Bước 3: Cài đặt plugin PWA**

```bash
npm install vite-plugin-pwa -D
```

Sau khi AI hoàn tất, cấu trúc dự án của bạn sẽ trông đại loại như sau:

```text
tomato-farm-pwa/
├── public/              # Tài nguyên tĩnh (biểu tượng, tài liệu SVG đặt ở đây)
├── src/
│   ├── App.tsx          # Thành phần chính
│   ├── main.tsx         # Tệp đầu vào
│   └── App.css          # Phong cách
├── index.html           # Đầu vào HTML
├── vite.config.ts       # Cấu hình Vite (cấu hình PWA đặt ở đây)
├── package.json
└── tsconfig.json
```

## 2.5 Hiểu Cấu trúc Dự án

Sau khi dự án được tạo, chúng ta cần hiểu vai trò của một số tệp chính:

| Tệp / Thư mục | Mục đích |
|----------|---------|
| `src/App.tsx` | Thành phần ứng dụng chính, nơi logic trang cốt lõi được viết |
| `src/main.tsx` | Tệp đầu vào ứng dụng, chịu trách nhiệm gắn kết ứng dụng React |
| `vite.config.ts` | Tệp cấu hình Vite, nơi cấu hình PWA cốt lõi được viết |
| `public/` | Thư mục tài nguyên tĩnh, nơi biểu tượng PWA và tài liệu SVG đặt |
| `index.html` | Tệp đầu vào HTML, thường không cần sửa đổi |

Là người mới bắt đầu, chúng ta chủ yếu cần quan tâm đến ba phần:

- `App.tsx`: kiểm soát hành vi chương trình và quyết định "những gì xuất hiện trên màn hình"
- `vite.config.ts`: cấu hình hành vi PWA và quyết định "ứng dụng được cài đặt và lưu vào bộ nhớ đệm như thế nào"
- `public/`: lưu trữ biểu tượng và tài sản ứng dụng

## 2.6 Chuẩn bị Biểu tượng Ứng dụng

PWA cần biểu tượng trước khi có thể cài đặt. Tối thiểu, chúng ta cần hai hình ảnh PNG với kích thước **192x192** và **512x512**.

Bạn có thể yêu cầu AI tạo chúng:

```text
Vui lòng giúp tôi tạo hai biểu tượng ứng dụng với kích thước 192x192 và 512x512.
Sử dụng nền gradient xanh lá và vẽ một quả cà chua đỏ ở giữa. Lưu chúng vào thư mục public.
```

Hoặc bạn cũng có thể tự tạo biểu tượng bằng bất kỳ công cụ thiết kế nào (Figma, Canva) và đặt vào thư mục `public/`.

<!-- 0 -->

## 2.7 Cấu hình `vite-plugin-pwa`

Đây là bước quan trọng nhất. Mở `vite.config.ts` và yêu cầu AI cấu hình plugin PWA:

```text
Vui lòng giúp tôi thay đổi vite.config.ts thành cấu hình PWA để trang web có thể được cài đặt lên màn hình chính điện thoại:
- Tên ứng dụng là "Trang trại Cà chua", với chủ đề màu xanh lá
- Sử dụng icon-192.png và icon-512.png từ thư mục public làm biểu tượng
- Bật cập nhật tự động
- Lưu vào bộ nhớ đệm tất cả các tệp js, css, html và hình ảnh để ứng dụng có thể hoạt động ngoại tuyến
```

AI sẽ tạo một cấu hình tương tự như sau:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Tomato Farm',
        short_name: 'Tomato Farm',
        description: 'Tập trung, trồng và phát triển',
        theme_color: '#4CAF50',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
})
```

**Giải thích cấu hình chính:**

* `registerType: 'autoUpdate'`: khi bạn xuất bản phiên bản mới, ứng dụng sẽ tự động cập nhật lần tiếp theo người dùng mở, không cần thao tác thủ công.
* `display: 'standalone'`: sau khi cài đặt, nó chạy trong cửa sổ riêng, không có thanh địa chỉ trình duyệt và cảm giác giống như ứng dụng native.
* `workbox.globPatterns`: cho Service Worker biết loại tệp nào nên được lưu vào bộ nhớ đệm và vẫn có thể truy cập ngoại tuyến.

<!-- 0 -->

# 3 Xây dựng PWA Trang trại Cà chua

Trong hai chương trước, chúng ta đã hiểu PWA là gì và hoàn tất thiết lập môi trường. Từ phần này trở đi, chúng ta ngừng chỉ nói về lý thuyết và chuyển sang thực hành thực tế. Chúng ta sẽ sử dụng chế độ Vibe Coding để xây dựng một ứng dụng thú vị và thực tế từ đầu - **Trang trại Cà chua**. Nó kết hợp hoàn hảo kỹ thuật Pomodoro với phần thưởng trò chơi hóa và bao gồm các yếu tố cốt lõi của phát triển PWA: **Tương tác UI (bộ đếm Pomodoro), lưu trữ dữ liệu (điểm và cây trồng), và khả năng ngoại tuyến (lưu vào bộ nhớ đệm Service Worker).**

Bây giờ, hãy gửi hướng dẫn đầu tiên đến AI.

## 3.1 "Master Prompt" Đầu tiên: Từ Không đến Một

Trong chế độ Vibe Coding, chúng ta không cần phải làm theo cách truyền thống là tạo tệp bố cục trước rồi mới viết code logic. Điều chúng ta cần làm là **mô tả yêu cầu rõ ràng trong một lần và để AI tạo ra phiên bản có thể chạy đầu tiên**.

Mở thư mục dự án vừa tạo trong trợ lý lập trình AI của bạn và nhập Prompt sau:

```text
Vui lòng giúp tôi viết trang chính cho ứng dụng Trang trại Cà chua, với các chức năng sau:

**Bộ đếm Pomodoro**
- Bộ đếm ngược 25 phút với bắt đầu, tạm dừng và đặt lại
- Hiển thị thời gian còn lại và thanh tiến trình
- Cho người dùng 10 điểm sau khi hoàn thành một phiên tập trung

**Hệ thống Nông trại**
- 3 mảnh đất nông nghiệp, nhưng ban đầu chỉ mảnh đầu tiên có sẵn; các mảnh sau được mở khóa sau khi lên cấp
- Cửa hàng mua hạt giống: cà rốt giá 5 điểm, cà chua 10 điểm, ngô 15 điểm
- Sau khi mua hạt giống và trồng, cây trồng chậm lớn và khi chín có thể thu hoạch để lấy điểm

**Hệ thống Cấp độ**
- Lên cấp theo tổng điểm: 0-100 điểm = Nông dân Mới, 100-300 = Nông dân Lành nghề, trên 300 = Bậc thầy Nông trại
- Mở khóa đất mới và hạt giống tốt hơn sau khi lên cấp

**Thiết kế UI**
- Trên cùng hiển thị cấp độ, điểm và thanh tiến trình nâng cấp
- Giữa hiển thị đếm ngược Pomodoro
- Dưới là lưới đất nông nghiệp
- Dưới cùng có nút cửa hàng
- Sử dụng chủ đề màu xanh lá và làm cho nó trông tươi mới và dễ thương
- Phải tương thích với màn hình điện thoại

**Lưu Dữ liệu**
- Tất cả dữ liệu (điểm, cấp độ, trạng thái đất nông nghiệp) phải được lưu và làm mới trang không nên mất dữ liệu
```

Sau khi gửi, bạn sẽ thấy AI bắt đầu lập luận và phân tích cấu trúc dự án của bạn. Vài giây sau, nó sẽ trực tiếp tạo code hoàn chỉnh cho `App.tsx`.

1. Từ phản hồi, chúng ta có thể thấy logic lập luận và logic tương tác của nó
2. Chúng ta có thể trực tiếp thấy code nào nó đã thay đổi
3. Nếu không hài lòng, chúng ta có thể quay lại phiên bản trước

<!-- 0 -->

## 3.2 Chạy và Xem trước (Máy chủ Phát triển Cục bộ)

Bây giờ AI đã hoàn thành vòng phát triển đầu tiên, nhưng hãy nhớ rằng: những gì chúng ta thấy trong trợ lý lập trình vẫn chỉ là "bản thiết kế" code, không phải ứng dụng tương tác thực sự. Chúng ta cần khởi động một máy chủ phát triển cục bộ để có thể chạy code thực tế và xem hiệu ứng thực tế.

Chạy lệnh này trong terminal của trợ lý lập trình AI của bạn:

```bash
npm run dev
```

Sau vài giây, terminal sẽ hiển thị đầu ra như sau:

```text
  VITE v5.0.0  ready in 300 ms

  ->  Local:   http://localhost:5173/
  ->  Network: use --host to expose
  ->  press h + enter to show help
```

Mở `http://localhost:5173/` trong trình duyệt và bạn sẽ thấy:

- cấp độ, điểm và thanh tiến trình ở trên cùng
- đếm ngược Pomodoro ở giữa
- vùng đất nông nghiệp bên dưới
- nút cửa hàng ở dưới cùng

Thử nhấp nút "Bắt đầu Tập trung" và xem liệu bộ đếm có hoạt động bình thường không. Nhấp vào ô đất nông nghiệp và xem liệu bạn có thể mua hạt giống và trồng chúng không. Đây là phiên bản đầu tiên của ứng dụng PWA của bạn.

<!-- 0 -->

## 3.3 Lặp Tối ưu hóa (Thêm Cây trồng SVG và Hoạt ảnh)

Lúc này, ứng dụng của chúng ta đã có hình dạng cơ bản: bộ đếm Pomodoro, hệ thống nông trại và hệ thống cấp độ. Nhưng nó vẫn có thể trông thô, với cây trồng có thể chỉ được hiển thị dưới dạng văn bản hoặc khối đơn giản. Tiếp theo, chúng ta sẽ thêm cây trồng SVG đẹp mắt và hoạt ảnh phát triển để làm cho Trang trại Cà chua trở nên sống động.

**Đây chính là nơi Vibe Coding trở nên hấp dẫn như vậy.** Trong phát triển truyền thống, vẽ đồ họa SVG và xây dựng hoạt ảnh phát triển phức tạp có thể là ác mộng cho người mới bắt đầu. Bạn không chỉ cần xử lý vẽ đường dẫn SVG, mà còn phải tính toán đường cong hoạt ảnh. Trong chế độ Vibe Coding, bạn không cần phải lo lắng về các chi tiết cấp thấp đó. Bạn chỉ cần nói với AI như một đạo diễn: "Cho cây trồng đồ họa SVG đẹp hơn và làm cho chúng phát triển với hoạt ảnh," và code phức tạp xuất hiện gần như ngay lập tức.

**Bước 1: Chuẩn bị tài sản cây trồng SVG**

Bạn có thể yêu cầu AI vẽ SVG trực tiếp trong code hoặc chuẩn bị các tệp SVG và đặt chúng dưới `public/`. Trong hướng dẫn này, chúng tôi khuyến nghị để AI tạo code SVG trực tiếp vì nó linh hoạt hơn.

**Bước 2: Gửi hướng dẫn lặp**

Quay lại trợ lý lập trình AI và nhập Prompt sau:

```text
Vui lòng làm cho cây trồng trông đẹp hơn và thêm hoạt ảnh phát triển:

**Đồ họa cây trồng**
- Cà rốt: thân màu cam với lá xanh
- Cà chua: hình tròn màu đỏ với lá xanh nhỏ
- Ngô: bắp ngô màu vàng với lá bên ngoài xanh
Chỉ sử dụng hình dạng đơn giản

**Hoạt ảnh phát triển**
- Khi mới trồng, bắt đầu như một mầm nhỏ và dần lớn đến trưởng thành
- Hiển thị 3 giai đoạn

**Hiệu ứng thu hoạch**
- Khi nhấp vào cây trồng đã chín, phát hoạt ảnh thu hoạch đơn giản
- Hiển thị bao nhiêu điểm đã kiếm được

**Tinh chỉnh tổng thể**
- Ô đất nông nghiệp nên có viền và màu nền
- Cây trồng nên xuất hiện ở giữa ô
- Phong cách tổng thể nên cảm thấy dễ thương hơn một chút
```

AI sẽ sửa đổi code lần nữa và xử lý render SVG và logic hoạt ảnh. Sau khi nó hoàn tất, làm mới trình duyệt và bạn sẽ thấy đồ họa cây trồng đẹp hơn và hoạt ảnh phát triển mượt mà.

<!-- 0 -->

## 3.4 Thêm Hiệu ứng Âm thanh và Thông báo (Tùy chọn)

Nếu bạn muốn Trang trại Cà chua cảm thấy sống động hơn, bạn cũng có thể thêm hiệu ứng âm thanh và thông báo. Điều này cũng chỉ cần một Prompt đơn giản:

```text
Vui lòng thêm hiệu ứng âm thanh và thông báo vào Trang trại Cà chua:

**Hiệu ứng âm thanh**
- Phát tiếng "ting" khi bắt đầu tập trung
- Phát âm thanh chiến thắng khi tập trung hoàn tất
- Cũng thêm hiệu ứng âm thanh phù hợp cho trồng và thu hoạch

**Thông báo**
- Hiển thị "Chúc mừng, bạn đã hoàn thành một phiên tập trung!" sau khi chu kỳ tập trung kết thúc
- Hiển thị "Chúc mừng, bạn đã lên cấp XX!" khi lên cấp
- Hiển thị "Bạn đã mở khóa một mảnh đất nông nghiệp mới!" khi đất mới được mở khóa

Bạn có thể triển khai điều này với các tệp âm thanh đơn giản hoặc Web Audio API
```

AI sẽ giúp bạn thêm hiệu ứng âm thanh và thông báo, làm cho Trang trại Cà chua sống động và thú vị hơn.

<!-- 0 -->

# 4 Trải nghiệm PWA Cục bộ

## 4.1 Xây dựng và Xem trước

Service Worker của PWA chỉ có hiệu lực trong bản dựng production (nó sẽ không đăng ký trong chế độ phát triển). Vì vậy chúng ta cần xây dựng trước, sau đó xem trước:

```text
Vui lòng giúp tôi chạy các lệnh sau:
1. npm run build (xây dựng phiên bản production)
2. npm run preview (khởi động máy chủ xem trước cục bộ)
```

Sau khi xây dựng, Vite sẽ tạo tất cả các tệp trong thư mục `dist/`, bao gồm `sw.js` (Service Worker) và `manifest.webmanifest` được tự động tạo.

Khi máy chủ xem trước khởi động, mở địa chỉ hiển thị trong terminal (thường là `http://localhost:4173`).

## 4.2 Cài đặt PWA trên Desktop

Sau khi mở URL xem trước, bạn sẽ nhận thấy một **biểu tượng cài đặt** xuất hiện ở bên phải thanh địa chỉ trình duyệt (thường là mũi tên tải xuống nhỏ hoặc dấu "+").

**Các bước cài đặt Chrome / Edge:**

1. Nhấp biểu tượng cài đặt ở bên phải thanh địa chỉ
2. Nhấp **Install** trong hộp thoại bật lên
3. PWA sẽ mở trong cửa sổ độc lập và lối tắt sẽ được tạo trên desktop / Start Menu / Dock

PWA đã cài đặt trông giống hệt như ứng dụng desktop native - không có thanh địa chỉ, không có tab, có cửa sổ và biểu tượng riêng. Bây giờ bạn có thể mở Trang trại Cà chua bất cứ lúc nào và bắt đầu hành trình tập trung và nông trại của mình.

<!-- 0 -->

**Các bước cài đặt macOS Safari:**

1. Mở URL PWA trong Safari
2. Nhấp **File -> Add to Dock** từ thanh menu
3. Biểu tượng PWA sẽ xuất hiện trong Dock

## 4.3 Kiểm tra Khả năng Ngoại tuyến

Đây là phần thú vị nhất của PWA. Hãy xác minh xem chế độ ngoại tuyến có thực sự hoạt động không:

1. Đảm bảo PWA đã được mở trong trình duyệt ít nhất một lần (để Service Worker có thể lưu tài nguyên vào bộ nhớ đệm)
2. **Ngắt kết nối mạng** (tắt Wi-Fi hoặc rút cáp)
3. Làm mới trang - bạn sẽ thấy rằng **Trang trại Cà chua vẫn tải bình thường!**
4. Bắt đầu một phiên Pomodoro - sau khi hoàn tất bạn kiếm điểm, mua hạt giống, trồng cây - và tất cả dữ liệu vẫn được lưu bình thường trong `localStorage`

Bạn cũng có thể mở Chrome DevTools (F12) -> Application -> Service Workers để kiểm tra trạng thái Service Worker và danh sách tài nguyên đã lưu vào bộ nhớ đệm.

<!-- 0 -->

## 4.4 Lưu trữ Dữ liệu và Tùy chọn Đồng bộ

Bây giờ Trang trại Cà chua của bạn đã có thể chạy ngoại tuyến và tất cả dữ liệu được lưu trong `localStorage` của trình duyệt. Nhưng có một vấn đề chính: **nếu người dùng chuyển thiết bị hoặc xóa dữ liệu trình duyệt, tất cả dữ liệu nông trại sẽ bị mất**. Đối với các ứng dụng production nghiêm túc, chúng ta cần suy nghĩ về lưu trữ dữ liệu và đồng bộ hóa đa thiết bị.

### 4.4.1 Hạn chế của Lưu trữ Cục bộ

`localStorage` mà chúng ta đang sử dụng hiện tại có một số hạn chế rõ ràng:

| Hạn chế | Mô tả |
|--------|------|
| **Liên kết thiết bị** | Dữ liệu chỉ được lưu trong trình duyệt hiện tại trên thiết bị hiện tại; chuyển thiết bị nghĩa là mất dữ liệu |
| **Dung lượng hạn chế** | Thường chỉ có 5-10MB không gian lưu trữ |
| **Dễ mất** | Xóa dữ liệu trình duyệt hoặc gỡ cài đặt PWA gây mất dữ liệu |
| **Không thể đồng bộ** | Tiến trình trên điện thoại không thể đồng bộ lên desktop |

Nếu Trang trại Cà chua của bạn chỉ là công cụ cá nhân, điều này có thể không phải là vấn đề. Nhưng nếu bạn muốn người dùng đầu tư lâu dài và tích lũy dữ liệu, một giải pháp đáng tin cậy hơn là cần thiết.

### 4.4.2 Tùy chọn 1: Đồng bộ Đám mây (Khuyến nghị)

Giải pháp đáng tin cậy nhất là đồng bộ hóa dữ liệu lên cơ sở dữ liệu đám mây. Đối với PWA, **Supabase** là một lựa chọn tuyệt vời - nó cung cấp cơ sở dữ liệu PostgreSQL, đăng ký thời gian thực và xác thực, đồng thời cũng cung cấp gói miễn phí.

**Ý tưởng triển khai:**

1. **Đăng nhập người dùng**: sử dụng email hoặc đăng nhập xã hội để thiết lập danh tính người dùng
2. **Đồng bộ dữ liệu tự động**: mỗi thao tác tự động lưu lên đám mây
3. **Ưu tiên ngoại tuyến**: ứng dụng vẫn hoạt động khi ngoại tuyến, sau đó tự động đồng bộ khi mạng trở lại
4. **Đồng bộ đa thiết bị**: tiến trình trên điện thoại có sẵn ngay lập tức trên desktop

**Ví dụ Prompt:**

```text
Vui lòng giúp tôi di chuyển lưu trữ dữ liệu Trang trại Cà chua từ localStorage sang đồng bộ đám mây Supabase:

**Yêu cầu chức năng**
- Thêm đăng nhập người dùng (email + mật khẩu hoặc đăng nhập Google)
- Lưu dữ liệu người dùng (điểm, cấp độ, trạng thái đất nông nghiệp) vào cơ sở dữ liệu Supabase
- Vẫn hoạt động ngoại tuyến và tự động đồng bộ khi mạng phục hồi
- Hỗ trợ đồng bộ đa thiết bị, để cây trồng trên điện thoại cũng có thể thấy trên desktop

**Tech stack**
- Sử dụng client @supabase/supabase-js
- Triển khai cập nhật optimistic (cập nhật UI trước, sau đó đồng bộ lên đám mây)
- Thêm chỉ báo trạng thái đồng bộ đơn giản
```

**Ưu điểm:**

- Dữ liệu sẽ không bị mất; người dùng chỉ cần đăng nhập lại khi chuyển thiết bị
- Gói miễn phí đủ cho dự án cá nhân
- Hỗ trợ đăng ký thời gian thực, mang lại trải nghiệm đồng bộ đa thiết bị tốt

**Nhược điểm:**

- Yêu cầu đăng ký/đăng nhập người dùng, thêm ma sát sử dụng
- Cần kết nối mạng để thực hiện đồng bộ

### 4.4.3 Tùy chọn 2: Xuất / Nhập Sao lưu

Nếu bạn không muốn thêm backend service, một thỏa hiệp đơn giản hơn là **sao lưu và khôi phục thủ công**.

**Ý tưởng triển khai:**

1. **Xuất**: đóng gói dữ liệu nông trại thành tệp JSON và cho người dùng tải xuống
2. **Nhập**: người dùng có thể chọn tệp JSON đã xuất trước đó để khôi phục dữ liệu
3. **Nhắc nhở tự động**: nhắc nhở người dùng sao lưu định kỳ

**Ví dụ Prompt:**

```text
Vui lòng thêm chức năng sao lưu dữ liệu vào Trang trại Cà chua:

**Xuất**
- Thêm nút "Xuất Dữ liệu" trên trang cài đặt
- Đóng gói tất cả dữ liệu trong localStorage thành tệp JSON
- Tự động tải xuống vào thiết bị của người dùng

**Nhập**
- Thêm nút "Nhập Dữ liệu" chấp nhận tệp JSON
- Xác thực định dạng tệp trước khi khôi phục
- Hiển thị cảnh báo trước khi nhập vì nó ghi đè dữ liệu hiện tại

**Nhắc nhở tự động**
- Nếu người dùng chưa sao lưu hơn 7 ngày, hiển thị lời nhắc thân thiện
```

**Ưu điểm:**

- Đơn giản để triển khai, không yêu cầu backend service
- Người dùng hoàn toàn kiểm soát dữ liệu của riêng họ
- Có thể chuyển đổi giữa các thiết bị bằng cách chia sẻ tệp đã xuất

**Nhược điểm:**

- Yêu cầu thao tác thủ công, vì vậy trải nghiệm không mượt mà
- Nếu người dùng quên sao lưu, dữ liệu vẫn có thể bị mất

### 4.4.4 Tùy chọn 3: Đồng bộ Tiện ích Mở rộng Trình duyệt (Cho người dùng Chrome)

Nếu PWA của bạn chủ yếu nhắm đến người dùng Chrome, bạn có thể cân nhắc **Chrome Storage Sync API**. Đây là dịch vụ lưu trữ đồng bộ đa thiết bị do Chrome cung cấp, nơi dữ liệu tự động đồng bộ với tài khoản Google của người dùng.

**Lưu ý:** điều này yêu cầu đóng gói PWA thành tiện ích mở rộng Chrome, phù hợp hơn với nhà phát triển có kinh nghiệm kỹ thuật.

### 4.4.5 Chiến lược Lựa chọn Khuyến nghị

| Kịch bản | Giải pháp Khuyến nghị |
|------|----------|
| Công cụ cá nhân nhẹ | Chỉ `localStorage` là đủ |
| Muốn tránh mất dữ liệu, nhưng không muốn quá phức tạp | Xuất / nhập sao lưu |
| Sản phẩm chính thức với trải nghiệm người dùng tốt hơn | Đồng bộ đám mây Supabase |
| Chủ yếu cho người dùng Chrome | Chrome Storage Sync |

**Đối với ứng dụng như Trang trại Cà chua, đề xuất của tôi là:**

1. **Giai đoạn MVP**: bắt đầu với `localStorage` để xác minh ý tưởng sản phẩm nhanh chóng
2. **Giai đoạn lặp**: thêm xuất / nhập sao lưu để người dùng có mạng an toàn dữ liệu
3. **Giai đoạn trưởng thành**: tích hợp Supabase để đạt được đồng bộ đám mây thực sự

Nhớ rằng: **tăng tiến dần** là triết lý cốt lõi của PWA. Trước tiên làm cho ứng dụng chạy, sau đó dần thêm các khả năng nâng cao hơn.

<!-- 0 -->

# 5 Triển khai Trực tuyến

PWA phải chạy dưới HTTPS để hoạt động chính xác. Tin tốt là các nền tảng triển khai chính hiện cung cấp HTTPS miễn phí tự động. Chúng ta sẽ sử dụng **Vercel** làm ví dụ (bạn cũng có thể sử dụng Netlify hoặc GitHub Pages).

## 5.1 Triển khai lên Vercel

**Bước 1: Cài đặt công cụ triển khai**

```text
Vui lòng giúp tôi cài đặt công cụ triển khai của Vercel
```

**Bước 2: Triển khai dự án**

```text
Vui lòng giúp tôi triển khai dự án này lên Vercel. Tên dự án là tomato-farm-pwa
```

AI sẽ xử lý các bước triển khai tự động. Bạn chỉ cần:
- chọn tài khoản của bạn
- xác nhận tạo dự án mới
- giữ các tùy chọn khác ở mặc định

Sau khi đợi vài chục giây, Vercel sẽ tự động xây dựng và triển khai dự án của bạn. Khi hoàn tất, bạn sẽ nhận được URL HTTPS như `https://tomato-farm-pwa.vercel.app`.

<!-- 0 -->

**Bước 3: Xác minh PWA**

Mở URL đã triển khai trong trình duyệt và bạn sẽ thấy:

1. biểu tượng cài đặt xuất hiện ở bên phải thanh địa chỉ
2. trong DevTools -> Application -> Manifest, thông tin ứng dụng đã cấu hình như tên "Tomato Farm"
3. trong tab Service Workers, Service Worker được hiển thị là đã kích hoạt

## 5.2 Triển khai với GitHub Pages (Thay thế)

Nếu bạn thích GitHub Pages, bạn cần cấu hình đường dẫn bổ sung:

```text
Vui lòng giúp tôi sửa đổi cấu hình để dự án có thể được triển khai lên GitHub Pages.
Tên kho lưu trữ của tôi là tomato-farm-pwa, vì vậy vui lòng điều chỉnh cấu hình đường dẫn cho phù hợp.
```

Sau đó đẩy đầu ra xây dựng lên nhánh `gh-pages` của kho lưu trữ GitHub của bạn.

# 6 Cài đặt PWA trên Điện thoại

Đây là phần thú vị nhất - biến trang web Trang trại Cà chua của bạn thành một "ứng dụng" trên điện thoại.

## 6.1 Cài đặt trên Android

1. Mở URL PWA Trang trại Cà chua đã triển khai trong **trình duyệt Chrome** trên điện thoại
2. Chrome có thể tự động hiển thị banner nhắc **"Thêm vào màn hình chính"** - chỉ cần nhấp vào nó
3. Nếu không tự động hiển thị, nhấp **menu ba chấm** ở góc trên bên phải -> **Install app** hoặc **Add to Home screen**
4. Xác nhận cài đặt và biểu tượng ứng dụng Trang trại Cà chua sẽ xuất hiện trên màn hình chính điện thoại

Mở nó và bạn sẽ nhận thấy nó chạy ở chế độ toàn màn hình, không có thanh địa chỉ trình duyệt hoặc nút điều hướng, trông gần như giống hệt như ứng dụng native. Bây giờ bạn có thể bắt đầu tập trung và làm nông bất cứ lúc nào.

<!-- 0 -->

## 6.2 Cài đặt trên iPhone

Trên iOS, PWA chỉ có thể được cài đặt thông qua trình duyệt **Safari** (các trình duyệt khác không hỗ trợ cài đặt):

1. Mở URL PWA Trang trại Cà chua đã triển khai trong **Safari**
2. Nhấp nút **Share** ở dưới cùng (hình vuông với mũi tên hướng lên)
3. Trong menu, chọn **Add to Home Screen**
4. Đặt tên cho ứng dụng và nhấp **Add**

Bắt đầu từ iOS 26, tất cả các trang web được thêm vào màn hình chính sẽ mở trong chế độ ứng dụng độc lập theo mặc định, đây là một cải tiến lớn.

<!-- 0 -->

> **Hạn chế đã biết trên iOS:**
> * Thông báo đẩy yêu cầu iOS 16.4 trở lên và PWA phải đã được thêm vào màn hình chính
> * Background Sync không được hỗ trợ
> * Không gian lưu trữ hạn chế hơn so với Android

## 6.3 Kiểm tra PWA của bạn với Lighthouse

Google cung cấp một công cụ gọi là **Lighthouse** có thể chấm điểm PWA của bạn. Mở Chrome DevTools (F12) -> Lighthouse -> đánh dấu "Progressive Web App" -> nhấp "Analyze page load."

Một PWA Trang trại Cà chua đạt tiêu chuẩn sẽ nhận điểm tối đa trong danh mục PWA. Nếu không, Lighthouse sẽ cho bạn biết lý do chính xác và đề xuất sửa chữa.

<!-- 0 -->

# 7 Lời kết

Chúc mừng! Bạn đã xây dựng thành công một PWA nông trại Pomodoro có thể được cài đặt trên cả desktop và điện thoại. Hãy xem lại những gì chúng ta đã làm:

1. Tạo một ứng dụng web Trang trại Cà chua với Vite + React
2. Thêm Service Worker và Manifest thông qua `vite-plugin-pwa`
3. Triển khai lên Vercel để có URL HTTPS
4. Cài đặt thành công trên cả desktop và điện thoại và kiểm tra khả năng ngoại tuyến

Bây giờ PWA Trang trại Cà chua của bạn đã có thể đạt được:
* **Nông trại tập trung**: giúp người dùng giữ tập trung thông qua cơ chế Pomodoro
* **Phần thưởng trò chơi hóa**: sử dụng trồng trọt, lên cấp và mở khóa để tạo động lực sử dụng lặp lại
* **Khả năng sử dụng ngoại tuyến**: ngay cả khi không có mạng, người dùng vẫn có thể tập trung, trồng trọt và quản lý nông trại của họ
* **Cài đặt cross-platform**: phát triển một lần và cài đặt trên nhiều loại thiết bị

Sức hấp dẫn của PWA nằm ở "tính tiến bộ" của nó - bạn không cần phải làm cho nó hoàn hảo ngay từ đầu. Trước tiên làm cho trang web có thể cài đặt và sử dụng ngoại tuyến, sau đó dần thêm các khả năng nâng cao như thông báo đẩy và đồng bộ hóa nền.

**Hướng dẫn nâng cao:**

* **Thông báo đẩy**: sử dụng Push API + Notification API để nhắc người dùng khi một Pomodoro hoàn tất hoặc khi cây trồng sẵn sàng để thu hoạch
* **Đồng bộ nền**: sử dụng Background Sync API để đồng bộ dữ liệu nông trại lên đám mây sau khi mạng trở lại
* **Chiến lược lưu vào bộ nhớ đệm thông minh hơn**: sử dụng các chiến lược Workbox khác nhau như CacheFirst, NetworkFirst và StaleWhileRevalidate cho các loại tài sản khác nhau
* **Xuất bản lên cửa hàng ứng dụng**: sử dụng [PWA Builder](https://www.pwabuilder.com/) để đóng gói PWA Trang trại Cà chua thành APK Android hoặc ứng dụng Microsoft Store
* **Tính năng xã hội**: thêm hệ thống bạn bè để người dùng có thể đến thăm nông trại của nhau và trao đổi cây trồng

***Một codebase, tất cả nền tảng - đây là sức mạnh của PWA. Tập trung, trồng trọt và phát triển!***

# Tài liệu Tham khảo

* [Tài liệu Chính thức Vite PWA](https://vite-pwa-org.netlify.app/guide/)
* [Hướng dẫn Phát triển PWA của Google](https://web.dev/progressive-web-apps/)
* [Tài liệu MDN Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
* [Tổng quan Chiến lược Lưu vào Bộ nhớ đệm Workbox](https://developer.chrome.com/docs/workbox/caching-strategies-overview/)
* [PWA Builder - Xuất bản PWA lên Cửa hàng Ứng dụng](https://www.pwabuilder.com/)

# Sơ cấp 2: Học dùng công cụ lập trình AI (AI IDE)

## Dẫn nhập chương

<script setup>
import { relatedArticlesMap } from '@theme/data/relatedArticles'

const duration = 'Khoảng <strong>1 ngày</strong>, có thể chia thành nhiều lần học'
const relatedArticles =
  relatedArticlesMap['vi-vn/stage-1/introduction-to-ai-ide'] ?? []
</script>

<ChapterIntroduction :duration="duration" :tags="['Thiết lập môi trường phát triển local', 'IDE và AI IDE', 'Kỹ thuật phát triển hiệu quả']" coreOutput="1 trò chơi nhỏ tự tạo" expectedOutput="Hoàn thành bằng Cursor / Trae">

Trước đó, chúng ta đã trải nghiệm lập trình bằng AI trên trình duyệt, nhưng bản web có nhiều giới hạn: **không thể lưu liên tục**, **khó quản lý file** và **không thể làm dự án phức tạp**. Chương này giúp bạn cài đặt môi trường phát triển (IDE) về máy tính của mình để có thể **thực sự tự xây dựng sản phẩm phần mềm thực tế**.

Chúng ta sẽ làm rõ trước **IDE và AI IDE khác nhau ở đâu**, vì sao AI IDE có thể giúp bạn **tăng mạnh hiệu suất**; sau đó sẽ **hướng dẫn từng bước** dùng AI IDE (ví dụ Trae hoặc Cursor) để làm một trò chơi Rắn săn mồi trên máy tính cá nhân, đi hết **quy trình đầy đủ** từ cài đặt đến chạy thử. Cuối cùng, sẽ là một số **kỹ thuật giao tiếp thực dụng với AI** để bạn làm việc hiệu quả hơn.

Học xong chương này, bạn sẽ **làm quen với quy trình phát triển chuyên nghiệp giống hệt một lập trình viên thực thụ**.

</ChapterIntroduction>

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="0" :items="[
      { title: 'Hiểu môi trường', description: 'Hiểu IDE và AI IDE' },
      { title: 'Thực hành local', description: 'Dùng AI IDE làm Rắn săn mồi' },
      { title: 'Giải thích công cụ', description: 'Làm quen giao diện IDE' },
      { title: 'Kỹ năng giao tiếp', description: 'Trao đổi hiệu quả với AI' }
    ]" />
  </ClientOnly>
</div>

## 1. Viết code cần môi trường và công cụ gì

### 1.1 Chuyển đổi tư duy: Gặp vấn đề, hỏi AI trước!

Trước khi bắt đầu, bạn cần phải **thay đổi thói quen tư duy**. 
Cách học cũ: Cần cài gì, lỗi ở đâu -> Mở Google tìm bài hướng dẫn -> Làm theo từng bước.
Cách học thời đại AI: **Bất kỳ thao tác nào cũng có thể hỏi AI trước, thậm chí yêu cầu AI làm luôn giúp bạn.**

- **Không biết cài môi trường thế nào?** Hỏi AI: "Tôi muốn viết code Python, hãy kiểm tra giúp tôi đã cài chưa, nếu chưa hãy hướng dẫn tôi."
- **Lỗi khi cài thư viện?** Dán lỗi cho AI: "Tôi tải bị lỗi này, xử lý sao?"
- **Không nhớ lệnh Terminal?** Hỏi thẳng AI thay vì đi tra Google.

### 1.2 Tại sao cần môi trường và công cụ?

Bạn có thể viết code bằng Notepad, nhưng bạn sẽ nhanh chóng phát điên vì:
- Chữ đen xì, không phân biệt được biến, hàm, lỗi.
- Gõ sai một chữ cái phần mềm chết đứng mà không biết tìm lỗi ở đâu.
- Có hàng tá file, rối rắm.

Do đó, chúng ta cần **IDE (Integrated Development Environment - Môi trường phát triển tích hợp)**. Nó cung cấp tô sáng cú pháp, tự động gợi ý code, sửa lỗi, và quản lý dự án hiệu quả.

## 2. AI IDE khác IDE thông thường ở đâu?

IDE thông thường (như VS Code gốc) giống như một cái "hộp đồ nghề": Bạn có kìm, búa, cờ lê. Nhưng bạn phải tự biết lắp ráp, tự đọc lỗi, tự gõ từng dòng code.

**AI IDE (như Cursor, Trae, Antigravity)** giống như bạn thuê một "Thợ máy chuyên nghiệp" đứng kế bên hộp đồ nghề:
- Bạn ra lệnh: "Tạo cho tôi trang đăng nhập", nó sẽ tự tạo file, tự gõ code.
- Nếu có lỗi, bạn ném thông báo lỗi cho nó, nó tự động tìm ra nguyên nhân và đề xuất mã sửa lỗi.
- Bạn có thể bôi đen một đoạn code và bảo "viết lại đoạn này cho gọn", nó sẽ làm ngay.

### Một số AI IDE phổ biến hiện nay:

1. **Cursor (Khuyên dùng cho người muốn sức mạnh lớn nhất):** Tùy biến từ VS Code, cực kỳ mạnh trong việc hiểu toàn bộ dự án. Nhược điểm: Phí khá cao ($20/tháng).
2. **Trae / Cline:** Các lựa chọn thay thế miễn phí hoặc mã nguồn mở cực mạnh, cho phép kết hợp các mô hình như Claude 3.5 Sonnet hoặc GPT-4o.
3. **Antigravity (Mới nhất):** AI IDE của Google tập trung vào Agent, có thể tự động duyệt web, chạy terminal và hoàn thiện dự án theo một chuỗi lệnh dài.

---

## 3. Thực hành: Dùng AI IDE tạo trò Rắn săn mồi trên máy

### Bước 1: Tạo thư mục rỗng và mở bằng AI IDE

1. Tạo một thư mục trên máy tính, đặt tên là `snake-game` (hoặc tên bất kỳ).
2. Tải và cài đặt Cursor hoặc Trae. Mở ứng dụng lên.
3. Chọn **File -> Open Folder** và chọn thư mục bạn vừa tạo. Lúc này bạn có một không gian làm việc hoàn toàn trống.

### Bước 2: Nhờ AI tự code trò Rắn Săn Mồi bằng React

1. Mở cửa sổ Chat AI (thường ở thanh bên phải màn hình hoặc nhấn phím tắt `Ctrl + L` / `Cmd + L`).
2. Gõ câu lệnh (Prompt) sau:
   > "Hãy dùng React để viết một trò chơi Rắn săn mồi. Tính năng: điều khiển bằng phím mũi tên, ăn mồi thì dài ra và cộng điểm, đâm vào tường hoặc tự cắn đuôi thì hiển thị 'Game Over' và có nút Chơi lại. Nếu máy tôi chưa có môi trường Node.js hoặc React, hãy tự tạo project bằng Vite và chạy thử giúp tôi."
3. Bấm gửi và xem phép màu xảy ra. AI sẽ tự động:
   - Viết code.
   - Bật Terminal để chạy lệnh cài đặt (có thể nó sẽ hỏi bạn bấm `Run` để cho phép chạy lệnh).
   - Mở Server local (ví dụ `http://localhost:5173`).

### Bước 3: Xem thành quả và chỉnh sửa

Mở trình duyệt truy cập vào đường link mà AI cung cấp. Bạn sẽ thấy trò chơi chạy trực tiếp trên trình duyệt của mình.

**Làm sao để giao diện đẹp hơn?**
Đừng chỉ bảo "Làm cho nó đẹp hơn đi", AI không hiểu "đẹp" là gì. Hãy yêu cầu rõ ràng:
> "Hãy chỉnh lại giao diện: 
> 1. Trò chơi nằm giữa màn hình.
> 2. Nền màu đen, rắn màu xanh lá, mồi màu đỏ rực.
> 3. Điểm số nằm to ở góc trên cùng."

AI sẽ lập tức cập nhật lại code và giao diện sẽ tự động thay đổi. 

## 4. Bỏ cuộc? Đừng lo!

Trong quá trình này, nếu code lỗi và hiện màn hình trắng, **đừng hoảng sợ**. Bạn chỉ cần chụp ảnh màn hình lỗi, hoặc copy dòng chữ báo lỗi đỏ lòm đó ném thẳng vào khung chat cho AI và bảo: "Nó báo lỗi này, xử lý đi". AI sẽ tự phân tích và đưa ra cách sửa. Kỷ nguyên AI là kỷ nguyên của việc "biết hỏi đúng cách" thay vì "biết gõ đúng code". 

<RelatedArticlesSection
  title="Tiếp theo có thể học gì"
  description="Theo lộ trình 'từ biết dùng AI đến biết làm sản phẩm', tiếp tục tiến lên phía trước."
  :items="relatedArticles"
/>

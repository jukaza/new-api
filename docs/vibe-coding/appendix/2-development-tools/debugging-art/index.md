# Hướng dẫn Trình gỡ lỗi Trình duyệt (DevTools)

::: tip 💡 Vai trò cốt lõi
Công cụ phát triển trình duyệt (DevTools) là "máy X-quang" và "bàn phẫu thuật" của phát triển frontend. Nó cho phép bạn nhìn thấu bộ xương của trang web (HTML), lớp da (CSS) và hệ thần kinh (JavaScript), đồng thời cho phép bạn chỉnh sửa và debug chúng trong thời gian thực.
:::

## 1. DevTools là gì?

**DevTools** là bộ công cụ phát triển web được tích hợp sẵn trong các trình duyệt hiện đại (Chrome, Edge, Firefox, Safari, v.v.). Đối với lập trình viên, nó gần với "sự thật" hơn cả trình soạn code, vì **nó hiển thị cách code thực sự chạy trong trình duyệt**.

**Cách mở DevTools?**

- **Phím tắt**: `F12` hoặc `Ctrl + Shift + I` (Mac: `Cmd + Option + I`)
- **Chuột**: **Nhấp chuột phải** vào bất kỳ phần tử nào trên trang, chọn **"Inspect (Kiểm tra)"**.
- **Menu**: Menu góc phải trên của trình duyệt -> More Tools -> Developer Tools.

---

## 2. Demo tương tác: Trình mô phỏng DevTools

Để giúp bạn nhanh chóng làm quen, chúng tôi đã tạo một bảng DevTools mô phỏng, tái tạo giao diện debug của Chrome.
**Hãy thử nhấp vào nút "▶ Bắt đầu tự động tham quan" bên dưới, theo con trỏ để tìm hiểu chức năng từng khu vực.**

<ClientOnly>
  <BrowserDevToolsDemo />
</ClientOnly>

### 2.1 Demo nâng cao: Chỉnh sửa trực tiếp (Live Edit)

Một trong những tính năng mạnh mẽ nhất của DevTools là **chỉnh sửa trong thời gian thực**. Demo bên dưới chứa một "trang web ảo" (phía trên) và một "DevTools" (phía dưới).

**Hãy thử:**

1.  Trong bảng Elements bên dưới, nhấp vào phần tử `h1` hoặc `button` trong cây DOM.
2.  Trong bảng Styles bên phải, thay đổi giá trị thuộc tính trong `element.style` (ví dụ đổi `color` thành `red`).
3.  Quan sát trang web ảo phía trên **thay đổi trong thời gian thực** như thế nào.

<ClientOnly>
  <BrowserDevToolsLiveDemo />
</ClientOnly>

### 2.2 Thử thách thực tế: Sửa văn bản trang web thật

Bây giờ bạn đã nắm được kỹ năng sửa style, hãy thử điều gì đó thú vị hơn — **chỉnh sửa trực tiếp trang web bạn đang xem!**

1.  **Mở DevTools thật**: Nhấn `F12` (hoặc nhấp chuột phải vào dòng chữ này -> chọn "Inspect").
2.  **Định vị phần tử**: Trong bảng Elements, bạn sẽ thấy một dòng code được highlight, đó chính là chữ bạn vừa nhấp vào.
3.  **Sửa nội dung**: **Nhấp đúp** vào phần chữ đen trong dòng code đó, đổi thành "**Tôi là hacker!**", rồi nhấn Enter.
4.  **Chiêm ngưỡng kỳ tích**: Nhìn kìa! Chữ trên trang web đã thay đổi phải không?

::: info 🤔 Tại sao refresh lại mất?
Bạn có thể nhận ra rằng khi refresh trang, mọi thay đổi đều biến mất và trang web trở về trạng thái ban đầu.

Điều này là do thay đổi DevTools chỉ diễn ra trong **bộ nhớ cục bộ của trình duyệt**.

- Khi bạn truy cập trang web, trình duyệt tải code HTML từ **máy chủ từ xa** và render tại máy cục bộ.
- Bạn chỉ sửa **bản sao cục bộ**, không có quyền sửa **code nguồn** trên máy chủ.
- Do đó mỗi lần refresh, trình duyệt lại tải code mới nhất (chưa sửa) từ máy chủ, mọi thứ khôi phục lại.
  :::

---

## 3. Giải thích chi tiết các panel chính

### 3.1 Elements (Panel phần tử)

<ClientOnly>
  <DevToolsElementsDemo />
</ClientOnly>

**Tác dụng**: Xem và chỉnh sửa HTML và CSS của trang trong thời gian thực.

- **Bên trái (Cây DOM)**: Hiển thị cấu trúc HTML của trang. Bạn có thể nhấp đúp vào thẻ hoặc văn bản để sửa, thậm chí kéo thả node để đổi vị trí.
- **Bên phải (Styles)**: Hiển thị CSS style của phần tử được chọn. Bạn có thể check/uncheck style để xem thay đổi, hoặc sửa giá trị trực tiếp (như màu sắc, margin).
- **Kịch bản sử dụng**:
  - "Tại sao nút này không căn chỉnh?" -> Kiểm tra CSS style.
  - "Muốn thử tiêu đề này đổi sang màu đỏ có đẹp không?" -> Sửa trực tiếp `color: red` trong Styles.

### 3.2 Console (Panel bảng điều khiển)

<ClientOnly>
  <DevToolsConsoleDemo />
</ClientOnly>

**Tác dụng**: Xem log, chạy code JavaScript.

- **Log output**: Thông tin `console.log()`, warning (màu vàng) và error (màu đỏ) khi chạy trang đều hiển thị ở đây.
- **Môi trường tương tác**: Bạn có thể nhập bất kỳ code JS nào ở đây và chạy ngay. Ví dụ nhập `alert('Hello')` sẽ hiện popup, nhập `document.body.style.background = 'red'` sẽ đổi nền thành đỏ.
- **Kịch bản sử dụng**:
  - "Tại sao click nút không có phản ứng?" -> Xem có lỗi đỏ không.
  - "Xác minh giá trị trả về của hàm JS." -> Chạy trực tiếp trong console.

### 3.3 Network (Panel mạng)

<ClientOnly>
  <DevToolsNetworkDemo />
</ClientOnly>

**Tác dụng**: Giám sát mọi request mạng.

- **Danh sách**: Hiển thị tất cả tài nguyên được tải (HTML, CSS, JS, ảnh, API request).
- **Chi tiết tương tác**: Nhấp vào bất kỳ dòng request nào, bảng chi tiết sẽ trượt ra bên phải:
  - **Headers**: Xem request headers, response headers (như `Content-Type`).
  - **Response**: Xem dữ liệu gốc server trả về (JSON, code HTML v.v.).
  - **Preview**: Xem trước nội dung response ở định dạng dễ đọc hơn.
- **Chỉ số quan trọng**:
  - **Status**: Status code (200 thành công, 404 không tìm thấy, 500 lỗi server).
  - **Type**: Loại tài nguyên (fetch/xhr là request API).
  - **Time**: Thời gian tải.
- **Kịch bản sử dụng**:
  - "API có bị hỏng không?" -> Xem request API có phải 500 đỏ không.
  - "Trang tải chậm quá?" -> Tìm xem ảnh hoặc tệp nào mất thời gian lâu nhất.

### 3.4 Sources (Panel mã nguồn)

<ClientOnly>
  <DevToolsSourcesDemo />
</ClientOnly>

**Tác dụng**: Xem mã nguồn, debug JavaScript.

- **Debug breakpoint**: Nhấp vào số dòng để đặt "Breakpoint". Khi code chạy đến dòng đó sẽ **tạm dừng**, cho bạn cơ hội xem giá trị biến hiện tại và chạy code từng bước.
- **Kịch bản sử dụng**:
  - "Logic code sai ở đâu?" -> Đặt breakpoint, xem code chạy từng dòng, kiểm tra giá trị biến có đúng mong đợi không.

### 3.5 Application (Panel ứng dụng)

<ClientOnly>
  <DevToolsApplicationDemo />
</ClientOnly>

**Tác dụng**: Xem và quản lý bộ lưu trữ trình duyệt.

- **Storage**:
  - **Local Storage**: Dữ liệu lưu trữ lâu dài.
  - **Session Storage**: Lưu trữ cấp session (biến mất khi đóng tab).
  - **Cookies**: Dữ liệu văn bản nhỏ dùng cho xác thực, v.v.
- **Kịch bản sử dụng**:
  - "Xóa trạng thái đăng nhập" -> Xóa Cookies hoặc token trong Local Storage.
  - "Xem dữ liệu cache" -> Kiểm tra Local Storage lưu gì.

---

## 4. Mẹo thực tế

1.  **Debug chế độ điện thoại**: Nhấp vào "biểu tượng điện thoại" 📱 ở góc trái trên DevTools để mô phỏng kích thước màn hình các dòng điện thoại khác nhau (iPhone, Pixel, v.v.), kiểm tra responsive của trang.
2.  **Force state**: Trong bảng Elements, nhấp chuột phải vào phần tử, chọn `Force state` -> `:hover`, để ép phần tử giữ trạng thái hover, thuận tiện debug style khi di chuột.
3.  **Chụp màn hình node**: Chọn node trong bảng Elements, nhấn `Ctrl + Shift + P` (Mac: `Cmd + Shift + P`) mở menu lệnh, nhập `screenshot`, chọn `Capture node screenshot`, có thể chụp node DOM đó lưu thành ảnh.

::: warning ⚠️ Lưu ý
Tất cả thay đổi trong DevTools (sửa HTML, CSS, JS) đều là **tạm thời**, chỉ có hiệu lực trên trang trình duyệt hiện tại. Khi refresh trang, mọi thay đổi sẽ mất. Nếu muốn hiệu lực vĩnh viễn, phải sửa tệp code nguồn của bạn.
:::

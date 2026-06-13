# [Quy Trình Mới - Tài Liệu 3] Loại Bỏ Cài Đặt Global & Cấu Hình Chuyển Tiếp Trực Tiếp (Direct Relay)

Tài liệu này hướng dẫn Admin cách loại bỏ hoàn toàn trang cấu hình Model toàn cầu (`system-settings/models/global`) khỏi giao diện để làm sạch menu Admin, đồng thời thiết lập cơ chế luôn luôn chuyển tiếp trực tiếp (Direct Relay) yêu cầu API đến nhà cung cấp gốc để tối ưu hóa tốc độ phản hồi.

---

## 1. LOẠI BỎ TRANG GLOBAL MODEL SETTINGS KHỎI MENU ADMIN

Để giao diện quản trị không bị rối và ngăn nhân viên vận hành cấu hình sai lệch vào các thông số thừa, trang Global Model Settings sẽ được ẩn/loại bỏ hoàn toàn khỏi thanh điều hướng (Sidebar/Settings Menu).

### Quy trình ẩn trên giao diện:
1. Mọi cấu hình liên quan đến model và giá bán hiện tại đã được tích hợp trực tiếp vào trang **Nhà cung cấp (Providers)** và trang **Cấu hình Giá (Pricing)**.
2. Menu `Cài đặt Model toàn cầu (Global Model Settings)` tại địa chỉ `/system-settings/models/global` sẽ bị vô hiệu hóa liên kết hiển thị.
3. Admin và kỹ thuật viên chỉ tập trung vận hành trên menu **Nhà cung cấp** và **Bảng giá**.

---

## 2. CƠ CHẾ CHUYỂN TIẾP TRỰC TIẾP (DIRECT RELAY FLOW)

Thay vì đi qua các bước tính toán trung gian, áp dụng tỷ giá USD/Quota phức tạp của hệ thống cũ, luồng xử lý API được tối giản hóa tối đa để chuyển tiếp thẳng yêu cầu của khách hàng tới nhà cung cấp sỉ (Upstream Provider).

### Đặc điểm của luồng Direct Relay:
- **Không tính toán tỷ giá**: Hệ thống bỏ qua bước quy đổi tiền tệ USD/Quota trung gian. Tiền VNĐ của khách hàng bị trừ trực tiếp theo biểu giá VNĐ cố định đã cấu hình tại model chuẩn.
- **Ánh xạ tức thì (Instant Mapping)**: Tên model chuẩn khách hàng gọi (Ví dụ: `gpt-4o`) được ánh xạ trực tiếp sang tên model của nhà cung cấp sỉ (Ví dụ: `gpt-4o-abc`) ngay tại thời điểm định tuyến và gửi đi.
- **Giảm thiểu trung gian**: Loại bỏ các bước kiểm tra cấu hình global rườm rà giúp giảm độ trễ (latency) của cuộc gọi API xuống mức thấp nhất, mang lại tốc độ phản hồi mượt mà như khi khách hàng gọi trực tiếp tới API gốc của OpenAI/Gemini.

---

## 3. SƠ ĐỒ ĐỐI CHIẾU LUỒNG XỬ LÝ API

### Luồng cũ (Phức tạp, nhiều bước trung gian):
```
[Yêu cầu API] 
   └── [Kiểm tra Token]
         └── [Tra cứu Model Ratio mặc định (Global)]
               └── [Tính toán đổi USD -> Quota tạm tính]
                     └── [Kiểm tra Group Ratio]
                           └── [Chuyển đổi sang tên model hãng]
                                 └── [Gửi đi & Trừ tiền Quota]
```

### Luồng mới (Tối giản - Direct Relay):
```
[Yêu cầu API] 
   └── [Kiểm tra Token]
         └── [Ánh xạ model tại Provider] (gpt-4o -> gpt-4o-abc)
               └── [Gửi thẳng lên nhà cung cấp sỉ]
                     └── [Trừ trực tiếp tiền VNĐ trong ví khách]
```

Cơ chế này giúp tối ưu hóa hiệu năng của máy chủ, giảm tải cho cơ sở dữ liệu và loại bỏ hoàn toàn các lỗi tính toán sai lệch tiền tệ do tỷ giá quy đổi phức tạp gây ra.

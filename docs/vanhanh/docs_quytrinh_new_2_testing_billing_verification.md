# [Quy Trình Mới - Tài Liệu 2] Quy Trình Tạo Key Test & Đối Soát Trừ Tiền Thực Tế

Tài liệu này hướng dẫn Admin cách khởi tạo API Key test không giới hạn hạn ngạch (để test kết nối thoải mái không lo hết tiền) và cách đối soát nhật ký để đảm bảo dòng tiền VNĐ được trừ hoàn toàn chuẩn xác đối với tài khoản khách hàng.

---

## BƯỚC 1: TẠO API KEY TEST KHÔNG GIỚI HẠN (UNLIMITED KEY)

Khi Admin thực hiện chạy thử nghiệm kết nối và cấu hình model, Admin không cần mất thời gian nạp tiền hay quan tâm đến số dư tài khoản của mình nhờ tính năng **Unlimited Quota**.

1. Truy cập mục **API Keys (Tokens)** trên menu giao diện Console.
2. Bấm **Tạo Token mới (Add Token)**.
3. Cấu hình các thông số cho Key test:
   - **Tên Token**: Nhập tên gợi nhớ (Ví dụ: `Key Test Không Giới Hạn`).
   - **Không giới hạn hạn ngạch (Unlimited Quota)**: **TÍCH CHỌN** ô này.
4. Nhấn **Tạo (Create)**.
5. Copy đoạn mã khóa vừa được sinh ra (Có dạng: `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`).

> [!TIP]
> Key được bật **Unlimited Quota** sẽ cho phép bạn gọi API thoải mái để kiểm tra kết nối, cấu hình mapping mà hệ thống không bao giờ chặn hay báo lỗi hết tiền (kể cả số dư tài khoản của bạn đang là 0đ).

---

## BƯỚC 2: THỰC HIỆN GỌI API THỬ NGHIỆM

Bạn có thể chạy thử nghiệm kết nối bằng 2 cách nhanh nhất dưới đây:

### Cách A: Test trực quan qua Sân chơi (Playground) tích hợp sẵn
1. Truy cập mục **Sân chơi (Playground)** hoặc **Trò chuyện (Chat)** trên giao diện Web Console.
2. Chọn đúng **Model chuẩn** đã được thiết lập giá ở Tài liệu 1 (Ví dụ: `gpt-4o`).
3. Gõ một câu hỏi bất kỳ (Ví dụ: `"Chào bạn, đây là tin nhắn kiểm tra hệ thống API"`) và nhấn gửi.
4. Xem phản hồi trả về từ AI để kiểm tra tốc độ và độ ổn định của đường truyền.

### Cách B: Test kỹ thuật qua Terminal bằng lệnh cURL
Mở Terminal của bạn lên và chạy lệnh sau để giả lập một request thực tế từ ứng dụng khách hàng (thay đổi địa chỉ domain và key test của bạn):

```bash
curl http://your-domain.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-your-key-test-here" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      {
        "role": "user",
        "content": "Hello, please reply in 5 words."
      }
    ]
  }'
```

---

## BƯỚC 3: ĐỐI SOÁT DÒNG TIỀN TRỪ CỦA KHÁCH HÀNG TRÊN LOGS

Mặc dù Key của Admin không bị giới hạn tiền khi gọi, hệ thống vẫn ghi nhận chi tiết số tiền VNĐ mà một tài khoản khách hàng thông thường sẽ bị trừ cho cuộc gọi đó. Admin đối soát logs theo quy trình sau:

1. Vào mục **Nhật ký (Logs)** trên thanh điều hướng.
2. Xem dòng log mới nhất thuộc loại **Tiêu thụ (Consume)**:
   - **Mô hình (Model)**: Đảm bảo hiển thị đúng tên model chuẩn sau mapping (Ví dụ: `gpt-4o`).
   - **Số lượng Token**: Đếm chính xác số lượng token Input (Prompt) và Output (Completion) được sử dụng.
   - **Số tiền bị trừ (VNĐ)**: Kiểm tra số tiền VNĐ bị trừ hiển thị trên log có khớp đúng với công thức bạn đã đặt hay không.
     - *Ví dụ:* Bạn đặt giá `gpt-4o` đầu vào là 50đ/1K tokens (50,000đ/1M) và đầu ra là 200đ/1K tokens (200,000đ/1M).
     - Cuộc gọi test tiêu tốn 100 tokens input và 50 tokens output.
     - Số tiền bị trừ thực tế hệ thống tính toán phải là: $(100 \times 0.05đ) + (50 \times 0.2đ) = 5đ + 10đ = 15đ$.

Nếu hệ thống ghi nhận chính xác dòng tiền trừ VNĐ trên Logs và AI phản hồi đúng, hệ thống của bạn đã hoạt động hoàn hảo và sẵn sàng đón khách hàng thực tế!

# Hướng Dẫn Vận Hành New-API: Nhập Nguồn & Cấu Hướng Bán Lẻ
*(Cấu hình tối ưu cho trường hợp mua trọn gói/không giới hạn từ nhà cung cấp)*

Tài liệu này được cập nhật để hướng dẫn bạn cách thiết lập hệ thống **new-api** khi bạn đã ký hợp đồng trọn gói 1 năm (không giới hạn tài nguyên - Unlimited) với nhà cung cấp. 

Vì giá vốn mỗi lượt gọi hoặc mỗi token từ nhà cung cấp của bạn là **$0 USD** (đã trả trọn gói hàng năm), bạn **không cần quan tâm đến giá của nguồn cấp**. Nhiệm vụ duy nhất của bạn là **tự quy định mức giá bán lẻ** mà bạn muốn thu từ khách hàng của mình tại Việt Nam để tối đa hóa lợi nhuận.

---

## 1. Bản Đồ Các File Mã Nguồn Quyết Định Giá Cả & Tính Phí

Để cấu hình và vận hành hệ thống hiệu quả, dưới đây là các file mã nguồn cốt lõi trong dự án điều khiển toàn bộ logic tính phí của bạn:

*   **`common/constants.go` (Dòng 62)**: Định nghĩa hằng số quy đổi hạn ngạch:
    `var QuotaPerUnit = 500 * 1000.0 // Tương đương $0.002 / 1K tokens`
    *Ý nghĩa:* Đây là giá trị neo để quy đổi giữa Quota và USD.
    *   **$1 USD = 500,000 Quota** (1 Quota = $0.000002).
    *   Tất cả số dư người dùng trong bảng `users.quota` đều lưu ở đơn vị Quota này.
*   **`relay/helper/price.go` (Hàm `ModelPriceHelper`)**:
    Quyết định mô hình sẽ tính phí theo **Token** (sử dụng Tỷ lệ - Ratio) hay tính phí theo **Lượt gọi** (sử dụng Giá cố định - Price).
*   **`service/text_quota.go` (Hàm `calculateTextQuotaSummary`)**:
    Thực hiện công thức tính Quota thực tế bị trừ sau khi nhận kết quả API. Cụ thể dòng mã nguồn tính toán như sau:
    $$\text{Quota} = \left( \text{PromptQuota} + \text{CompletionQuota} \right) \times \text{ModelRatio} \times \text{GroupRatio} + \text{Phụ phí công cụ (Tool Surcharge)}$$
    Trong đó:
    *   `PromptQuota` = $(\text{PromptTokens} - \text{CachedTokens}) + \text{CachedTokens} \times \text{CacheRatio}$.
    *   `CompletionQuota` = $\text{CompletionTokens} \times \text{CompletionRatio}$.
    *   `ModelRatio` = Tỷ lệ cơ sở của mô hình.
    *   `GroupRatio` = Hệ số nhóm người dùng.
*   **`setting/ratio_setting/model_ratio.go`**:
    Lưu trữ cấu hình tỷ lệ mặc định (`defaultModelRatio` bắt đầu từ dòng 26) và định nghĩa cơ chế khóa tỷ lệ completion của các mô hình đặc thù (`getHardcodedCompletionModelRatio` từ dòng 505).
*   **`web/default/src/lib/currency.ts` (Dòng 168-197)**:
    Thư viện React frontend xử lý quy đổi và hiển thị Quota thành tiền tệ tương ứng trên giao diện người dùng.

---

## 2. Các Bước Nhập Nguồn (Kênh LiteRouter Trọn Gói)

1.  Truy cập trang Admin -> **Kênh (Channels)** -> Chọn **Thêm Kênh (Add Channel)**.
2.  **Loại Kênh (Type):** Chọn `OpenAI`.
3.  **Địa chỉ Base URL (`base_url`):** Nhập địa chỉ API của bên bán sỉ trọn gói (ví dụ: `https://api.nhacungcap.com`).
4.  **Mã khóa (`key`):** Nhập API Key trọn gói được cấp.
5.  **Ánh xạ mô hình (Model Mapping) (Nếu cần):**
    Nếu nhà cung cấp đặt tên mô hình khác với tên bạn muốn bán cho khách hàng, hãy dùng tính năng ánh xạ. Ví dụ: Khách gọi `gpt-4o` -> Chuyển thành `combo-gpt-4o-unlimited` gửi lên nhà cung cấp:
    ```json
    {
      "gpt-4o": "combo-gpt-4o-unlimited"
    }
    ```

---

## 3. Công Thức Thiết Lập Giá Bán Lẻ Cho Khách Hàng

Vì bạn không có giá vốn động, bạn có toàn quyền tự đặt giá bán lẻ. Mức giá này thường được quy đổi dựa trên **mức giá USD trên 1 triệu tokens (1M tokens)** mà bạn muốn thu của khách hàng.

### Cách A: Bán theo lượng Token sử dụng (Khuyên dùng)
Bạn thiết lập giá thông qua ô cấu hình **Tỷ lệ mô hình (Model Ratio - Key: `ModelRatio`)** và **Tỷ lệ hoàn thành model (Completion Ratio - Key: `CompletionRatio`)** trong trang Admin -> **Cài đặt** -> **Cấu hình Nhóm & Giá mô hình**:

1.  **Công thức tính Tỷ lệ Model bán lẻ (Model Ratio):**
    $$\text{Tỷ lệ Model bán lẻ} = \frac{\text{Giá bán lẻ đầu vào (Input) bạn muốn thu trên 1M tokens}}{2.0}$$
2.  **Công thức tính Tỷ lệ Completion bán lẻ (Completion Ratio):**
    $$\text{Tỷ lệ Completion bán lẻ} = \frac{\text{Giá bán lẻ đầu ra (Output) bạn muốn thu trên 1M tokens}}{\text{Giá bán lẻ đầu vào (Input) bạn muốn thu trên 1M tokens}}$$

#### Ví dụ thực tế cấu hình giá bán lẻ:

*   **Model `gpt-4o`**: Bạn muốn bán lẻ với giá **Input: $2.0 / 1M tokens**, **Output: $8.0 / 1M tokens**.
    *   Tỷ lệ Model = $2.0 / 2.0 = 1.0$.
    *   Tỷ lệ Completion = $8.0 / 2.0 = 4.0$.
    *   Cấu hình trong `ModelRatio`: `"gpt-4o": 1.0`
    *   Cấu hình trong `CompletionRatio`: `"gpt-4o": 4.0`
*   **Model `claude-3-5-sonnet`**: Bạn muốn bán lẻ với giá **Input: $3.0 / 1M tokens**, **Output: $15.0 / 1M tokens**.
    *   Tỷ lệ Model = $3.0 / 2.0 = 1.5$.
    *   Tỷ lệ Completion = $15.0 / 3.0 = 5.0$.
    *   Cấu hình trong `ModelRatio`: `"claude-3-5-sonnet-20241022": 1.5`
    *   Cấu hình trong `CompletionRatio`: `"claude-3-5-sonnet-20241022": 5.0`

---

## 4. Cơ Chế Khóa Tỷ Lệ Completion Trong Mã Nguồn

Khi cấu hình giá theo token ở mục 3, mã nguồn `new-api` có cơ chế tự động khóa cứng tỷ lệ Completion của một số mô hình chính trong file `setting/ratio_setting/model_ratio.go` (Hàm `getHardcodedCompletionModelRatio`):
*   Các mô hình chứa chữ **`claude-3`** hoặc **`claude-sonnet-4`** / **`claude-opus-4`**: Bị ép cứng tỷ lệ Completion là **`5.0`** (không thể đổi sang số khác).
*   Các mô hình bắt đầu bằng **`gemini-1.5`** hoặc **`gemini-2.0`**: Bị ép cứng tỷ lệ Completion là **`4.0`**.
*   Các mô hình bắt đầu bằng **`gpt-4o`**: Bị ép cứng tỷ lệ Completion là **`4.0`**.

### Hướng xử lý khi thiết lập giá bán:
*   Nếu mức giá bán lẻ bạn mong muốn đối với các model trên có tỷ lệ Output/Input đúng bằng `5.0` hoặc `4.0` như mã nguồn quy định, bạn chỉ cần điền đúng tỷ lệ `ModelRatio` (Input), tỷ lệ đầu ra sẽ tự khớp.
*   Nếu bạn muốn tự do đặt tỷ lệ Completion bán lẻ khác (ví dụ: bán Claude với đầu ra chỉ gấp 3 lần đầu vào), hãy sử dụng tính năng **Ánh xạ mô hình** để đổi tên gọi hiển thị thành một tên khác không chứa từ khóa nhạy cảm (ví dụ đặt tên là `sonnet-premium`), khi đó code Go sẽ không khóa cứng tỷ lệ nữa và bạn có thể tự thiết lập tùy ý.

---

## 5. Cách B: Bán Theo Lượt Gọi Cố Định (Fixed Price Per Call)

Nếu bạn không muốn tính phí phức tạp theo Token mà muốn thu một khoản phí cố định cho mỗi câu trả lời (ví dụ: mỗi câu trả lời tính khách 500đ hoặc 1,000đ):

1.  Vào trang Admin -> **Cài đặt** -> **Cấu hình Nhóm & Giá mô hình** -> Ô **Giá cố định của model (Model Price - Key: `ModelPrice`)**.
2.  Điền mức giá bán lẻ bằng USD trực tiếp vào mô hình đó.
    *   *Ví dụ:* Bạn muốn thu **1,250 VNĐ cho mỗi câu trả lời GPT-4o** (Tương đương **$0.05 USD** nếu tính tỷ giá 25,000đ).
    *   Điền cấu hình JSON:
        ```json
        {
          "gpt-4o": 0.05
        }
        ```
    Mỗi khi khách hàng gọi GPT-4o thành công, hệ thống sẽ tự động trừ tài khoản của khách đúng $0.05 USD (25,000đ x 0.05 = 1,250 VNĐ) bất kể câu hỏi và câu trả lời dài hay ngắn.

---

## 6. Cấu Hình Tiền Tệ VNĐ (VND) Cho Trang Web Bán Hàng

Để trang web của bạn hiển thị tiền VNĐ (đ) trực quan thay vì điểm Quota, cấu hình theo luồng của file `/web/default/src/lib/currency.ts`:

1.  Vào trang Admin -> **Cài đặt** -> **Cài đặt chung** -> **Cấu hình hiển thị hạn ngạch (Quota Display Config)**.
2.  Thiết lập:
    *   **Loại hiển thị (quotaDisplayType):** Chọn `CUSTOM`.
    *   **Ký hiệu tiền tệ tùy chỉnh (customCurrencySymbol):** Điền `đ` hoặc `VNĐ`.
    *   **Tỷ giá quy đổi tiền tệ tùy chỉnh (customCurrencyExchangeRate):** Điền tỷ giá mong muốn (ví dụ: `25000` - nghĩa là $1 USD = 25,000 VNĐ).
3.  **Cách nạp tiền:**
    *   Khi khách nạp 100,000 VNĐ, bạn cộng vào tài khoản của khách số quota tương ứng:
        $$\text{Quota nạp} = \frac{100,000 \text{ VNĐ}}{25,000 \text{ (Tỷ giá)}} \times 500,000 \text{ (Hằng số QuotaPerUnit)} = 2,000,000 \text{ Quota}$$
    *   Giao diện người dùng sẽ tự động hiển thị số dư này là **100.000 đ**.

---

## 7. Cấu Hình Khi Chạy 2 Nguồn LiteRouter Song Song

Chạy 2 nguồn LiteRouter song song là phương án cực kỳ tốt để đảm bảo hệ thống của bạn **không bao giờ bị gián đoạn** và **phân phối tải tốt**. `new-api` hỗ trợ cấu hình việc này rất đơn giản thông qua cơ chế quản lý kênh.

### Bước 1: Thêm 2 kênh độc lập trong Admin Dashboard
Bạn vào trang quản trị -> **Kênh (Channels)** -> Tạo **2 kênh riêng biệt**:
*   **Kênh 1:**
    *   *Tên:* LiteRouter Server 1
    *   *Base URL:* `https://lite-server-1.com`
    *   *API Key:* Key của server 1
    *   *Models:* Chọn danh sách các model bạn muốn chạy (ví dụ: `gpt-4o`, `claude-3-5-sonnet`...)
*   **Kênh 2:**
    *   *Tên:* LiteRouter Server 2
    *   *Base URL:* `https://lite-server-2.com`
    *   *API Key:* Key của server 2
    *   *Models:* Chọn **cùng danh sách** các model giống Kênh 1.

### Bước 2: Thiết lập cơ chế điều hướng (Routing) ở tab "Cài đặt nâng cao"
Tại đây, bạn mở tab **Cài đặt nâng cao** khi cấu hình mỗi kênh và thiết lập theo 1 trong 2 cơ chế sau tùy nhu cầu:

#### Cơ chế A: Chia tải song song (Load Balancing - 50/50)
Sử dụng khi bạn muốn phân phối tải đều cho cả 2 server.
*   **LiteRouter Server 1:** Độ ưu tiên (Priority) = `1`, Trọng số (Weight) = `1`
*   **LiteRouter Server 2:** Độ ưu tiên (Priority) = `1`, Trọng số (Weight) = `1`
*   *Cách hoạt động:* Hệ thống sẽ chia đều request (50% gửi sang Server 1, 50% gửi sang Server 2). Nếu một server có năng lực xử lý mạnh gấp đôi server còn lại, bạn có thể chỉnh Trọng số của nó lên `2`.

#### Cơ chế B: Chạy chính & Dự phòng lỗi (Failover / Backup)
Sử dụng khi bạn muốn ưu tiên chạy Server 1, chỉ khi Server 1 gặp sự cố (die key, sập nguồn, quá tải...) thì mới tự động chuyển sang Server 2.
*   **LiteRouter Server 1 (Chính):** Độ ưu tiên (Priority) = `10`
*   **LiteRouter Server 2 (Phụ):** Độ ưu tiên (Priority) = `5`
*   *Cách hoạt động:* `new-api` sẽ luôn chuyển 100% request của khách hàng sang Server 1 vì có độ ưu tiên cao hơn. Nếu Server 1 trả về lỗi, hệ thống sẽ **tự động gọi sang Server 2** ngay lập tức để trả về kết quả cho khách hàng, giúp khách hàng không hề nhận ra hệ thống của bạn vừa gặp sự cố.


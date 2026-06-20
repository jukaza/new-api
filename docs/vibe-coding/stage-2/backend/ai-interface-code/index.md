# Mô hình lớn hỗ trợ viết mã giao diện và tài liệu giao diện

Trong các bài học trước, chúng ta đã học cách sử dụng các công cụ như Figma để hoàn thành bản thiết kế UI, cách借助 AI nhanh chóng tạo trang tĩnh frontend, và cách sử dụng Supabase để xây dựng cơ sở dữ liệu và thực hiện xác thực người dùng cơ bản. Bây giờ, một câu hỏi tự nhiên xuất hiện: sau khi nhấn các nút đầy动感 trên trang frontend, dữ liệu thực sự đã được âm thầm lưu vào Supabase như thế nào? Khi chúng ta cần thực hiện logic nghiệp vụ phức tạp hơn (như thanh toán đồng thời, đẩy thông báo định kỳ, xử lý dữ liệu nhạy cảm), việc để frontend kết nối trực tiếp với cơ sở dữ liệu có an toàn không?

Điều này dẫn đến một khâu then chốt trong kiến trúc phát triển Web hiện đại — **giao diện API backend**.

So với việc trước đây phải tự gõ hàng trăm hàng nghìn dòng route backend, controller và logic xác thực tham số, giờ đây chúng ta hoàn toàn có thể借助 sức mạnh tạo mã của mô hình lớn, giao phó phần code cơ sở rườm rà cho AI viết. Trong bài học này, chúng ta sẽ thoát khỏi vòng lặp "AI viết rất hời hợt", dựa trên các kịch bản nghiệp vụ thực tế, hướng dẫn bạn cách thông qua các prompt chất lượng cao (Prompt) dẫn dắt mô hình lớn viết các giao diện backend Node.js mạnh mẽ, tuân thủ quy chuẩn ngành, và tự động hoàn thành việc tạo tài liệu giao diện và test case.

> 💡 **Kiến thức tiên quyết**
>
> Trước khi học phần này, bạn nên tìm hiểu các nội dung sau:
> - [Từ cơ sở dữ liệu đến Supabase](../database-supabase/) - Hiểu về khái niệm cơ sở dữ liệu và mô hình dữ liệu.
> - [Học sử dụng Git và Github](../git-workflow/) - Làm quen với cách kiểm soát phiên bản trong phát triển dự án.
> - [Terminal/Dòng lệnh là gì](/vi-vn/appendix/2-development-tools/command-line-shell) - Khởi tạo và chạy dự án không thể tách khỏi các thao tác dòng lệnh cơ bản.

# Bạn sẽ học được gì

1. **Giao diện API là gì**: Hiểu cầu nối giao tiếp frontend-backend và quy chuẩn thiết kế RESTful.
2. **Mô hình lớn hỗ trợ xây dựng dịch vụ**: Cách thông qua Prompt có cấu trúc để AI giúp bạn xây dựng dự án cơ bản Node.js + Express.
3. **Phát triển logic giao diện**: Dẫn dắt mô hình lớn tạo các giao diện CRUD (thêm, đọc, sửa, xóa) bao gồm xác thực nghiệp vụ nghiêm ngặt và kết nối cơ sở dữ liệu Supabase.
4. **Tài liệu giao diện tự động**: Để mô hình_large dựa trên code tạo tài liệu OpenAPI/Swagger tiêu chuẩn cho cộng tác liên đội.
5. **Vòng lặp kiểm thử và tích hợp**: Sử dụng mô hình_large để tạo bộ kiểm thử Postman và unit test Jest, đảm bảo chất lượng code.

---

# 1. Tại sao chúng ta cần giao diện API?

Trong cách hiểu truyền thống, frontend là "phần có thể nhìn thấy", cơ sở dữ liệu là "kho chứa đồ". Nhưng ở giữa thiếu một người điều phối. Nếu bạn tưởng tượng toàn bộ ứng dụng là một nhà hàng:
- **Frontend (Client)** là menu và bàn đặt món của nhà hàng, khách hàng duyệt món và đưa ra yêu cầu tại đây.
- **Cơ sở dữ liệu (Supabase, v.v.)** là kho của bếp nhà hàng, nơi lưu trữ tất cả nguyên liệu và sổ kế toán.
- **Giao diện API backend** là nhân viên phục vụ của nhà hàng. Khách hàng không thể trực tiếp chạy vào bếp lấy nguyên liệu (không chỉ lộn xộn mà còn dễ gây vấn đề an toàn), mà cần đưa "yêu cầu đặt món" (HTTP Request) cho nhân viên phục vụ. Nhân viên phục vụ tiến hành xác nhận (xác thực tham số, xác thực quyền), sau đó vào bếp lấy nội dung tương ứng, rồi mang "món đã làm xong" (HTTP Response, thường là dữ liệu dạng JSON) ra cho khách hàng.

Thông qua giao diện API, chúng ta thực hiện **tách biệt frontend-backend** rõ ràng: frontend chỉ quan tâm đến cách render trang, backend chỉ tập trung vào logic nghiệp vụ, xử lý dữ liệu và bảo vệ an toàn.

---

# 2. Thiết kế kiến trúc dự án và khởi tạo

Một cấu trúc dự án rõ ràng là điều kiện tiên quyết để mô hình_large có thể viết code tốt. Trước khi để AI viết code, bản thân chúng ta phải hiểu rõ cấu trúc dự án.

## 2.1 Cấu trúc dự án API phổ biến
Ngay cả khi sử dụng mô hình_large để tạo code, chúng ta tuyệt đối không nên nhét tất cả code vào một file `server.js`. Một kiến trúc backend Node.js dễ bảo trì thường có dạng như sau:

```text
my-api-project/
├── .env                  # Biến môi trường nhạy cảm (như API Keys, chuỗi kết nối cơ sở dữ liệu)
├── server.js             # Điểm vào dự án (khởi động server, đăng ký middleware toàn cục)
├── package.json          # File quản lý dependency
├── src/
│   ├── routes/           # Lớp route: định nghĩa đường dẫn URL và phương thức yêu cầu
│   ├── controllers/      # Lớp controller: xử lý tham số yêu cầu nghiệp vụ, gọi service và trả về response
│   ├── services/         # Lớp service: đóng gói tương tác cơ sở dữ liệu và logic nghiệp vụ cốt lõi
│   └── middlewares/      # Middleware: xác thực đăng nhập, bắt lỗi toàn cục
└── docs/                 # Thư mục lưu tài liệu API
```

## 2.1借助 AI hoàn thành khởi tạo dự án
Thay vì tự `npm init` và cài đặt từng dependency, tốt hơn là đưa quy chuẩn trên cho mô hình_large dưới dạng Prompt:

> 🗣️ **Prompt cho mô hình_large (Ví dụ Prompt):**
> "Giúp tôi xây dựng một dự án backend Node.js, có thể kết nối cơ sở dữ liệu Supabase, cấu trúc rõ ràng, thuận tiện bảo trì sau này."

Sau khi chạy code mà AI trả về, bạn sẽ có một ứng dụng backend với quy mô doanh nghiệp tại `localhost:3000`.

---

# 3. Thực hành cốt lõi: Mô hình_large hỗ trợ phát triển giao diện

Đây là phần cốt lõi nhất của chương này. Code do mô hình_large viết thường dễ có "lỗ hổng logic" hoặc "xào nấu hời hợt", nguyên nhân là do ngữ cảnh mà developer cung cấp không đủ. **Mô hình_large không sợ yêu cầu phức tạp, chỉ sợ yêu cầu mơ hồ.**

Lấy ví dụ về interface thêm mới cho bảng `menu_items` (bảng menu) được đề cập trong [chương cơ sở dữ liệu](../database-supabase/), hãy xem cách viết một Prompt chất lượng cao.

## 3.1 Cung cấp đầy đủ ngữ cảnh cho mô hình_large
Trước khi yêu cầu AI viết giao diện, nhất định phải cung cấp **định nghĩa trường cơ sở dữ liệu (Schema)** và **điều kiện ràng buộc cụ thể**.

> 🗣️ **Mẫu Prompt chất lượng cao:**
> "Giúp tôi viết một interface thêm menu mới, menu có tên sản phẩm, giá, phân loại (burger, đồ ăn nhẹ, đồ uống), và thông tin có上架 hay không. Tên sản phẩm và giá là bắt buộc, giá không thể là số âm. Khi người dùng nhập sai cần hiện thông báo lỗi."

## 3.2 Xem xét code do mô hình_large tạo
Code do mô hình_large tạo thường sẽ phân tách trách nhiệm rõ ràng như sau:

```javascript
// services/menuService.js
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

exports.createMenuItem = async (menuData) => {
    // Gọi Supabase SDK đẩy dữ liệu vào bảng
    const { data, error } = await supabase
        .from('menu_items')
        .insert([menuData])
        .select()

    if (error) throw new Error(`Chèn cơ sở dữ liệu thất bại: ${error.message}`)
    return data[0]
}
```

Bạn có thể thấy, code được tạo theo cách này không chỉ có cấu trúc hợp lý mà còn tính đến khởi tạo Supabase, bắt lỗi và xử lý ngoại lệ, hoàn toàn khác biệt với Spaghetti Code khi chỉ đơn giản yêu cầu "viết một interface thêm mới".

---

# 4. Giải phóng đôi tay: Tự động tạo tài liệu giao diện

Đối với đội ngũ phát triển, một API không có tài liệu giống như một món đồ bí ẩn. Kỹ sư frontend không thể đoán được bạn cần truyền vào tham số gì, cũng không thể dự đoán cấu trúc trả về sẽ như thế nào. Quy chuẩn mô tả API phổ biến nhất trong ngành là **OpenAPI (trước đây còn gọi là Swagger)**.

Trước đây, việc tự viết tài liệu Swagger dạng YAML hoặc JSON cực kỳ đau đớn và dễ sai. Bây giờ, đây cũng trở thành lĩnh vực mà mô hình_large giỏi nhất.

Bạn có thể chọn trực tiếp code `routes` và `controllers` vừa viết, rồi đưa cho mô hình_large:

> 🗣️ **Prompt tạo tài liệu:**
> "Giúp tôi dựa trên code trên tạo một tài liệu giao diện, cần ghi rõ ý nghĩa của từng tham số, trả về dữ liệu gì, thuận tiện cho đồng nghiệp frontend đối接."

Trong quá trình này, bạn thậm chí có thể yêu cầu AI bổ sung mô tả trường (Description) và dữ liệu Mock (ví dụ `price_cents: 1200` đại diện cho 12 USD), giảm đáng kể chi phí giao tiếp.

---

# 5. Bảo đảm chất lượng: Tạo code kiểm thử và bộ sưu tập Postman

Code đã viết, tài liệu đã hoàn thành, còn thiếu bước cuối cùng: xác minh xem code có thực sự chạy được hay không.

## 5.1 Tạo cấu hình kiểm thử Postman / Apifox
Trong phát triển giao diện, chúng ta thường sử dụng các công cụ trực quan như Postman để mô phỏng frontend gửi yêu cầu HTTP. Nếu không sử dụng mô hình_large, bạn cần tự nhập URL, thêm từng Header (tiêu đề yêu cầu) và nối JSON request body.

Bạn chỉ cần gửi lệnh cho AI:
> "Giúp tôi chuyển tài liệu giao diện này sang định dạng có thể import vào Postman, cần bao gồm cả ví dụ yêu cầu bình thường và yêu cầu lỗi."

Sau khi nhận được văn bản JSON, lưu thành `menu_api.json` và kéo vào Postman, bạn ngay lập tức có một bảng điều khiển kiểm thử sẵn sàng sử dụng.

## 5.2 Viết unit test tự động
Nếu bạn theo đuổi chất lượng kỹ thuật nghiêm ngặt hơn, có thể để mô hình_large giúp bạn sử dụng framework kiểm thử như `Jest` để viết unit test, kiểm tra biên cho logic nghiệp vụ cốt lõi (ví dụ: khi truyền vào giá âm, liệu xác thực ở tầng cơ sở dữ liệu có hiệu lực hay không).

---

# 6. Thực hành tốt nhất cần biết về giao diện backend

Ngay cả khi có sự hỗ trợ của AI, với tư cách là "người gác cổng" của toàn bộ hệ thống, bạn vẫn cần hiểu và kiểm duyệt các nguyên tắc cốt lõi sau:

1. **Đặt tên đường dẫn theo quy chuẩn RESTful**:
   - Thiết kế tốt: `GET /api/users` (lấy danh sách người dùng), `POST /api/users` (tạo người dùng). URL nên là danh từ đại diện cho "tài nguyên".
   - Thiết kế sai: `POST /api/getUser` hoặc `POST /api/createUser`. Động từ nên được thể hiện bằng HTTP Method (GET/POST/PUT/DELETE).
2. **Mã trạng thái HTTP theo quy chuẩn**:
   - 200/201: Yêu cầu thành công / Tạo tài nguyên thành công.
   - 400: Bad Request, định dạng tham số truyền từ frontend sai, thiếu mục bắt buộc.
   - 401/403: Unauthorized / Forbidden, người dùng chưa đăng nhập hoặc không có quyền thao tác.
   - 404: NotFound, tài nguyên không tồn tại.
   - 500: Server Error, code backend bị lỗi hoặc cơ sở dữ liệu sập, tuyệt đối tránh hiển thị error call stack cho frontend (có rủi ro an ninh).
3. **Không bao giờ tin tưởng đầu vào của người dùng**: Đầu vào từ frontend có thể bị giả mạo, tất cả xác thực tham số cốt lõi phải được thực hiện lại tại giao diện backend.

# 7. Tổng kết

Thông qua việc học chương này, bạn đã thực sự chuyển đổi góc nhìn phát triển: bạn không còn là "người đánh máy" bị mắc kẹt trong cú pháp và dấu câu, mà đã trở thành **nhà thiết kế hệ thống và chỉ huy kiến trúc**.
Bạn đã nắm được:
1. Tư duy hệ thống cốt lõi về **giao diện API và tách biệt frontend-backend**.
2. **Cách cung cấp ngữ cảnh và khái niệm cấu trúc phân tầng**, nâng cao đáng kể chất lượng code backend do mô hình_large tạo.
3. Biến công việc **viết tài liệu** và **xây dựng test case** rườm rà thành tác vụ tự động hóa mà AI giỏi thực hiện.
4. Kết hợp kiến thức **Supabase** đã học trước đó, hoàn thành dòng dữ liệu từ yêu cầu client đến cập nhật cơ sở dữ liệu.

::: tip 💡 Bước tiếp theo
Khi dòng dữ liệu và dịch vụ backend của bạn đã sẵn sàng, hiện tại nó vẫn chỉ có thể "tự giải trí" trên máy tính cục bộ của bạn. Trong các chương tiếp theo, chúng ta sẽ học cách **triển khai (Deploy)** dịch vụ này lên máy chủ công cộng, để sản phẩm của bạn có thể được truy cập bởi người dùng trên toàn thế giới.
:::

---
title: 'Thực chiến dự án hoàn chỉnh - Từ Demo đến nguyên mẫu cấp sản phẩm'
description: 'Vượt qua giai đoạn Demo, học cách hoàn thiện chuỗi sản phẩm, xây dựng dữ liệu mô phỏng chân thực, lặp lại nhanh chóng thông qua phản hồi, cuối cùng hoàn thành một nguyên mẫu AI hoàn chỉnh có thể trình diễn và tương tác.'
---

<script setup>
import { relatedArticlesMap } from '@theme/data/relatedArticles'

const duration = 'Khoảng <strong>3 ngày</strong>'
const relatedArticles =
  relatedArticlesMap['vi-vn/stage-1/complete-project-practice'] ?? []
</script>

# Cơ bản 5: Thực chiến dự án hoàn chỉnh

## Hướng dẫn chương này

<ChapterIntroduction :duration="duration" :tags="['Tư duy sản phẩm', 'Dữ liệu mô phỏng', 'Hoàn thiện tương tác', 'LocalStorage']" coreOutput="1 nguyên mẫu AI sản phẩm đầy đủ chức năng" expectedOutput="Ứng dụng Web với chuỗi hoàn chỉnh và dữ liệu chân thực">

Chương trước đã tích hợp khả năng AI, Demo đã chạy được, nhưng so với "sản phẩm" thực sự còn <strong>xa lắm</strong>: trang vừa refresh là <strong>dữ liệu mất sạch</strong>, báo lỗi là <strong>trang trắng</strong>, danh sách chỉ có "dữ liệu thử 1, dữ liệu thử 2", người dùng bấm nhầm cũng <strong>không thể hoàn tác</strong>...

Chương này sẽ <strong>lấp đầy tất cả những khoảng trống này</strong>: chúng ta sẽ <strong>hoàn thiện chuỗi sản phẩm đầy đủ</strong>, dùng AI tạo <strong>dữ liệu nghiệp vụ chân thực</strong> thay thế dữ liệu giả, thêm <strong>xử lý lỗi và phản hồi người dùng</strong>, cuối cùng hoàn thiện một nguyên mẫu <strong>đẹp mắt, có thể trình diễn cho người khác</strong>.

Đây là <strong>chương cuối cùng</strong> của giai đoạn cơ bản, hoàn thành bước này, bạn đã hoàn thành sự chuyển đổi từ "hoàn toàn không biết lập trình" đến "<strong>có thể tự làm nguyên mẫu AI sản phẩm</strong>".

</ChapterIntroduction>

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="0" :items="[
      { title: 'Hoàn thiện chuỗi', description: 'Từ tính năng đơn lẻ đến vòng lặp hoàn chỉnh' },
      { title: 'Tiêm linh hồn', description: 'Mô phỏng dữ liệu nghiệp vụ thực tế' },
      { title: 'Lặp lại phản hồi', description: 'Sửa chữa trải nghiệm dựa trên phản hồi thực tế' },
      { title: 'Bài tập lớn cuối kỳ', description: 'Thiết kế tốt nghiệp của bạn' }
    ]" />
  </ClientOnly>
</div>

## 1. Từ chối "Happy Path": Hoàn thiện chuỗi cốt lõi

Rất nhiều người mới làm nguyên mẫu, thường chỉ làm "Happy Path" (con đường lý tưởng nhất): người dùng click -> API phản hồi thành công -> hiển thị kết quả.
Nhưng trong thế giới thực, mọi thứ thường không suôn sẻ như vậy. Để nguyên mẫu của bạn trông giống một sản phẩm thực sự, bạn cần cân nhắc các khâu "vô hình" sau đây.

### 1.1 Thêm "chờ đợi" và "phản hồi"

Khi người dùng click "tạo văn bản", AI thường mất vài giây để phản hồi. Nếu giao diện không có phản ứng gì, người dùng sẽ tưởng chương trình bị lỗi.
**Bạn cần để AI IDE thêm trạng thái Loading:**

> Ví dụ prompt:
> "Khi tôi click nút tạo, hãy đổi nút thành 'Đang tạo...' và không cho click, đồng thời hiển thị hoạt ảnh tải ở khu vực bên phải. Cho đến khi API trả về kết quả, mới khôi phục bình thường."

### 1.2 Xử lý "thất bại" và "ngoại lệ"

API Key có thể hết hạn, mạng có thể bị ngắt.
**Bạn cần để AI IDE xử lý lỗi:**

> Ví dụ prompt:
> "Nếu API request thất bại, đừng báo lỗi trong console, hãy hiện một hộp thoại màu đỏ (Toast) ở đầu trang, báo người dùng 'Tạo thất bại, vui lòng thử lại sau', và cho phép người dùng click lại nút tạo."

### 1.3 Lưu trữ lịch sử hội thoại

Trong quá trình tương tác với AI, chúng ta cần lưu nội dung hội thoại, để người dùng có thể xem lại lịch sử, tiếp tục trao đổi trước đó. Hiện tại chưa cần cơ sở dữ liệu, có thể chọn các giải pháp nhẹ sau:

**Lựa chọn phương án lưu trữ:**

| Phương án | Kịch bản sử dụng | Đặc điểm |
| ---------------- | -------------------------------- | ------------------------------------ |
| **LocalStorage** | Dự án thuần frontend, dữ liệu người dùng lưu trên trình duyệt | Dễ triển khai, refresh không mất, không đồng bộ được giữa các thiết bị |
| **File JSON** | Nguyên mẫu cục bộ, dữ liệu lưu dạng file | Cấu trúc rõ ràng, dễ debug, có thể chỉnh sửa thủ công |
| **File TXT** | Phương án đơn giản nhất, ghi nhanh nội dung văn bản | Định dạng tự do, khả năng tương thích tốt |

**Ví dụ nội dung hội thoại:**
Lịch sử hội thoại đã lưu thường bao gồm:

```json
[
  {
    "role": "user",
    "content": "Giúp tôi tạo văn bản livestream bán tai nghe bluetooth",
    "timestamp": "2026-01-20 10:30:00"
  },
  {
    "role": "assistant",
    "content": "[Văn bản gợi ý tai nghe bluetooth]\n\n🎧 Tạm biệt độ trễ, trải nghiệm nghe nhạc chìm đắm\n\nChị em ơi! Chiếc tai nghe bluetooth này thực sự quá tuyệt 👇\n\n✅ Chống ồn chủ động 40dB, ngay lập tức bước vào thế giới âm nhạc\n✅ Thời lượng pin siêu dài 30 giờ, cả tuần đi làm không cần sạc\n✅ Gọi điện rõ như đối thoại, tàu điện ngầm ồn ào cũng trò chuyện được\n✅ Thiết kế nửa lọt tai, đeo lâu không đau không bí\n\n💰 Ưu đãi có hạn, click vào link bên dưới để mua ngay!",
    "timestamp": "2026-01-20 10:30:05"
  }
]
```

**Prompt triển khai:**

> "Hãy giúp tôi triển khai tính năng lưu lịch sử hội thoại. Hỗ trợ lưu bản ghi hội thoại giữa người dùng và AI dưới dạng file JSON (hoặc sử dụng LocalStorage). Tự động tải lịch sử hội thoại mỗi khi vào trang, hỗ trợ xem và xóa từng bản ghi hội thoại."

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="1" :items="[
      { title: 'Hoàn thiện chuỗi', description: 'Từ tính năng đơn lẻ đến vòng lặp hoàn chỉnh' },
      { title: 'Tiêm linh hồn', description: 'Mô phỏng dữ liệu nghiệp vụ thực tế' },
      { title: 'Lặp lại phản hồi', description: 'Sửa chữa trải nghiệm dựa trên phản hồi thực tế' },
      { title: 'Bài tập lớn cuối kỳ', description: 'Thiết kế tốt nghiệp của bạn' }
    ]" />
  </ClientOnly>
</div>

## 2. Tiêm linh hồn: Mô phỏng dữ liệu thực tế (Mock Data)

Một trang trống rỗng không thể thuyết phục ai. Tưởng tượng, bạn giới thiệu "bàn làm việc tư liệu thương mại điện tử" cho người khác, kết quả lịch sử trống không, hoặc chỉ có một dòng "test / test / test".
Để hiệu quả trình diễn tốt nhất, chúng ta cần "giả" một số dữ liệu chân thực, để nguyên mẫu trông giống một sản phẩm thực tế đã vận hành nửa năm.

### 2.1 Để AI giúp bạn thiết kế cấu trúc dữ liệu

Chúng ta không cần tự nghĩ xem mỗi trường nên đặt tên gì (ví dụ nên gọi `name` hay `title`), việc này hoàn toàn có thể giao cho AI.

Bạn chỉ cần cho AI biết **kịch bản nghiệp vụ** của bạn:

> **Ví dụ prompt:**
> "Tôi đang làm nguyên mẫu **bàn làm việc tư liệu thương mại điện tử TikTok**.
> Hãy giúp tôi thiết kế một cấu trúc dữ liệu JSON, để mô tả một 'nhiệm vụ sản phẩm'.
> Nhiệm vụ này nên bao gồm: thông tin cơ bản sản phẩm (tên, danh mục), tư liệu đầu vào (link hình ảnh), và kết quả AI tạo ra (tiêu đề, văn bản, ảnh poster).
> Hãy cho tôi trực tiếp một ví dụ JSON."

AI sẽ dựa trên mô tả của bạn, tự động giúp bạn nghĩ ra các trường như `productName`, `generatedContent`.

### 2.2 Để AI sản xuất loạt dữ liệu "chân thực"

Có cấu trúc dữ liệu rồi, bước tiếp theo là để AI giúp bạn "điền vào", tạo ra một loạt dữ liệu trông thật.

**Kỹ thuật prompt:**
Bạn không thể chỉ nói AI "giúp tôi tạo dữ liệu", bạn cần như giao việc cho thực tập sinh, cho nó biết **bối cảnh nghiệp vụ** và **yêu cầu nội dung**:

- **Bối cảnh nghiệp vụ**: Cho AI biết chúng ta làm "thương mại điện tử TikTok", nên tiêu đề sản phẩm phải thu hút (như "bí quyết thon dáng", "sinh viên phải có"), văn bản phải khẩu ngữ hóa.
- **Yêu cầu hình ảnh**: Để nguyên mẫu đẹp, hình ảnh không phải placeholder đen trắng, tốt nhất là ảnh phong cảnh hoặc vật thật nhiều màu ngẫu nhiên.

> **Ví dụ prompt:**
> "Dựa trên cấu trúc vừa thiết kế, giúp tôi tạo 10 bản ghi dữ liệu mô phỏng chân thực.
> (Ghi chú: không nhất thiết phải là JSON. Nếu bạn đang làm frontend, có thể yêu cầu tạo mảng JavaScript; nếu dùng Python, có thể tạo List.)
>
> **Yêu cầu kịch bản nghiệp vụ**:
>
> 1. Giả sử đây là một cửa hàng bách hóa tổng hợp, sản phẩm bao gồm 3 danh mục: 'thời trang nữ', 'kỹ thuật số', 'mỹ phẩm'.
> 2. **Tiêu đề và văn bản tạo ra phải mang phong cách TikTok**: ví dụ tiêu đề phải chứa Emoji (🔥, ✨), văn bản phải dùng giọng điệu 'cực phẩm', 'trải nghiệm thực'.
> 3. **Trường hình ảnh**: Sử dụng thống nhất định dạng `https://picsum.photos/seed/{random_id}/300/400`, đảm bảo mỗi ảnh đều khác nhau."

**Ví dụ Mock Data đã tạo:**

```javascript
export const mockProductTasks = [
  {
    id: 'task_001',
    name: 'Đầm vintage hoa Pháp mùa hè',
    status: 'completed',
    input: {
      category: 'Thời trang nữ',
      features: ['Eo thon', 'Giảm cân', 'Phong cách'],
      originalImage: 'https://picsum.photos/seed/dress_input/300/400'
    },
    output: {
      generatedTitle: '✨Ai mặc cũng đẹp! Chiếc đầm hoa Pháp này thực sự cực phẩm🔥',
      generatedCopy:
        'Chị em ơi! Chiếc váy này thực sự quá thon dáng! Thiết kế vòng eo cực phẩm, mặc vào ngay lập tức có eo. Vải rất thoáng khí, mùa hè mặc hoàn toàn không bí. Lựa chọn hàng đầu cho hẹn hò và dạo phố!👗',
      generatedPosterImage: 'https://picsum.photos/seed/dress_output/300/400'
    },
    createdAt: '2026-01-20T10:00:00Z'
  },
  {
    id: 'task_002',
    name: 'Tai nghe chống ồn siêu mạnh Pro',
    status: 'completed',
    input: {
      category: 'Kỹ thuật số',
      features: ['Chống ồn', 'Pin siêu dài', 'Độ trễ thấp'],
      originalImage: 'https://picsum.photos/seed/tech_input/300/400'
    },
    output: {
      generatedTitle: '🎧 Cuối cùng cũng tìm được! Chiếc tai nghe chống ồn này quá mạnh!🔇',
      generatedCopy:
        'Đeo vào, thế giới ngay lập tức yên tĩnh. Chất âm tuyệt vời, nghe nhạc như đang ở hiện trường. Pin cũng rất bền, sạc một lần dùng cả tuần! Sinh viên phải có!',
      generatedPosterImage: 'https://picsum.photos/seed/tech_output/300/400'
    },
    createdAt: '2026-01-21T14:30:00Z'
  }
  // ... thêm dữ liệu
]
```

### 2.3 (Nâng cao) Sử dụng LocalStorage để "giả" thêm/xóa/sửa

Nếu bạn muốn "dữ liệu mô phỏng" vừa tạo không chỉ xem được mà còn xóa được, sửa được, thậm chí nhiệm vụ mới tạo sau khi refresh trang vẫn còn, bạn có thể kết hợp `LocalStorage`.

> **Ví dụ prompt:**
> "Hãy giúp tôi triển khai tính năng lưu trữ dữ liệu.
>
> 1. Ưu tiên đọc dữ liệu từ `localStorage`.
> 2. Nếu `localStorage` trống, sử dụng Mock data vừa tạo để khởi tạo, và lưu chúng vào `localStorage`.
> 3. Đồng thời giúp tôi viết các hàm `addProductTask` và `deleteProductTask`, mỗi thao tác đều cập nhật `localStorage` đồng bộ."

Qua bước này, nguyên mẫu của bạn đã có "bộ nhớ", trải nghiệm người dùng gần như không khác gì sản phẩm thực.

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="2" :items="[
      { title: 'Hoàn thiện chuỗi', description: 'Từ tính năng đơn lẻ đến vòng lặp hoàn chỉnh' },
      { title: 'Tiêm linh hồn', description: 'Mô phỏng dữ liệu nghiệp vụ thực tế' },
      { title: 'Lặp lại phản hồi', description: 'Sửa chữa trải nghiệm dựa trên phản hồi thực tế' },
      { title: 'Bài tập lớn cuối kỳ', description: 'Thiết kế tốt nghiệp của bạn' }
    ]" />
  </ClientOnly>
</div>

## 3. Thu thập phản hồi và lặp lại nhanh chóng

Làm sản phẩm trong phòng kín thì không thể tốt. Bây giờ nguyên mẫu đã có "chức năng cốt lõi" + "chuỗi hoàn chỉnh" + "dữ liệu trình diễn", đã đến lúc cho người khác xem.

### 3.1 Tìm ai test? Test như thế nào?

- **Tìm bạn bè/đồng nghiệp**: Không cần họ hiểu kỹ thuật, chỉ cần để họ thử dùng.
- **Quan sát thay vì hướng dẫn**: Đừng nói "click vào đây", mà xem họ sẽ click vào đâu. Nếu họ không tìm thấy nút, nghĩa là thiết kế có vấn đề.
- **Phương pháp "Wizard of Oz"**: Nếu AI của bạn chưa kết nối xong, bạn có thể thủ công sửa dữ liệu ở backend (hoặc database) để mô phỏng phản hồi của AI, xác minh trước người dùng có cần tính năng này không.

### 3.2 Đối mặt với Bug và phàn nàn

- **Style bị lỗi**: Có thể bị lỗi ở các kích thước màn hình khác nhau.
  - **Hành động**: Chụp màn hình gửi cho AI IDE -> "Bị lỗi ở độ rộng màn hình này, giúp tôi sửa."
- **Thao tác gượng gạo**: "Quy trình này quá phiền phức".
  - **Hành động**: Cho AI IDE biết đề xuất -> "Người dùng thấy upload rồi mới tạo quá chậm, có thể đổi thành tạo một lần không?"
- **Yêu cầu mới**: "Nếu có tính năng này thì tốt quá."
  - **Hành động**: Đánh giá xem có phải cốt lõi không, nếu có, để AI nhanh chóng triển khai phiên bản đơn giản.

**Nhớ: Trong giai đoạn này, AI là trợ lý sửa chữa tốt nhất của bạn. Bạn chỉ cần chịu trách nhiệm phát hiện vấn đề, sửa code giao cho nó.**

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="3" :items="[
      { title: 'Hoàn thiện chuỗi', description: 'Từ tính năng đơn lẻ đến vòng lặp hoàn chỉnh' },
      { title: 'Tiêm linh hồn', description: 'Mô phỏng dữ liệu nghiệp vụ thực tế' },
      { title: 'Lặp lại phản hồi', description: 'Sửa chữa trải nghiệm dựa trên phản hồi thực tế' },
      { title: 'Bài tập lớn cuối kỳ', description: 'Thiết kế tốt nghiệp của bạn' }
    ]" />
  </ClientOnly>
</div>

## 4. 🎓 Bài tập lớn: Hoàn thành "thiết kế tốt nghiệp" của bạn

Chúc mừng bạn! Bạn đã hoàn thành toàn bộ quá trình từ "nhu cầu" đến "nguyên mẫu" rồi đến "tích hợp AI". Bây giờ, đã đến lúc trình bày kết quả cuối cùng.

**Bài tập lớn này không giới hạn ở "bàn làm việc tư liệu thương mại điện tử"**. Bạn cần kết hợp sở thích hoặc bối cảnh ngành nghề của mình, tạo ra một nguyên mẫu AI sản phẩm độc nhất vô nhị.

### Lựa chọn đề tài và yêu cầu

Bạn cần chọn một kịch bản phù hợp nhất từ **[Tham khảo hướng kịch bản đa ngành](../appendix-industry-scenarios/index.md)**, hoặc tự lên ý tưởng một kịch hoàn toàn mới.

**Dự án phải sử dụng tổng hợp tất cả nội dung đã học ở các bài trước:**

1.  **Xây dựng nguyên mẫu**: Sử dụng công nghệ frontend để xây dựng giao diện đẹp, dễ sử dụng.
2.  **Kiểm soát nhu cầu**: Không cầu toàn diện, nhưng logic chức năng cốt lõi phải khép kín.
3.  **Tích hợp API**: Kết nối mô hình AI thực tế (LLM/VLM, v.v.), trao cho ứng dụng trí thông minh thực sự.
4.  **Triển khai ứng dụng có thể chơi**: Không chỉ là trang tĩnh, mà là ứng dụng động có luồng dữ liệu và phản hồi tương tác.

### Sản phẩm nộp bài

Cuối cùng bạn cần nộp hai nội dung sau:

1.  **Một ứng dụng nguyên mẫu hoàn chỉnh**: Triển khai lên mạng hoặc chạy được cục bộ, có chuỗi sử dụng hoàn chỉnh.
2.  **Video trình diễn 30 giây**: Quay một video, giới thiệu ngắn gọn kịch bản ứng dụng của bạn, và trình diễn thao tác thực tế của các chức năng cốt lõi.

<el-card shadow="hover" style="margin: 20px 0; border-radius: 12px;">
  <template #header>
    <div style="font-weight: bold; font-size: 16px;">🚀 Danh sách kiểm tra thử thách cuối cùng</div>
  </template>

  <p>
    Đây là trận chiến cuối cùng của Stage 1. Hãy kiểm tra tác phẩm của bạn theo danh sách dưới đây:
  </p>

  <div style="font-weight: bold; margin-bottom: 10px;">Tự kiểm tra chức năng cốt lõi</div>
  <ul style="list-style-type: none; padding-left: 0;">
    <li><label><input type="checkbox" disabled /> <strong>Kịch bản rõ ràng</strong>: Đã chọn một ngành hoặc kịch bản ứng dụng cụ thể</label></li>
    <li><label><input type="checkbox" disabled /> <strong>Logic khép kín</strong>: Quy trình cốt lõi chạy thông suốt, không chỉ Happy Path</label></li>
    <li><label><input type="checkbox" disabled /> <strong>Lái bởi AI</strong>: Đã gọi API mô hình lớn thực sự, không phải phản hồi định sẵn</label></li>
    <li><label><input type="checkbox" disabled /> <strong>Trải nghiệm hoàn chỉnh</strong>: Bao gồm Loading, xử lý lỗi và dữ liệu mô phỏng</label></li>
  </ul>

  <div style="font-weight: bold; margin: 20px 0 10px;">Chuẩn bị sản phẩm bàn giao</div>
  <ul style="list-style-type: none; padding-left: 0;">
    <li><label><input type="checkbox" disabled /> <strong>Ứng dụng nguyên mẫu</strong>: Code đã hoàn thành và có thể chạy</label></li>
    <li><label><input type="checkbox" disabled /> <strong>Video trình diễn</strong>: Khoảng 30 giây, thể hiện rõ điểm nổi bật cốt lõi</label></li>
  </ul>
</el-card>

## Bước tiếp theo

Sau khi hoàn thành bài tập lớn, bạn đã có khả năng "độc lập phát triển nguyên mẫu ứng dụng AI".
Trong Stage 2 tiếp theo, chúng ta sẽ đi sâu vào phát triển fullstack phức tạp hơn, học cách biến nguyên mẫu này thành một ứng dụng thương mại thực sự có thể lên mạng, có database, có hệ thống người dùng.

Hẹn gặp lại ở giai đoạn tiếp theo!

<RelatedArticlesSection
  title="Tiếp tục nâng cao"
  description="Chúc mừng hoàn thành Stage 1, các chương dưới đây có thể giúp bạn bước vào phát triển kỹ thuật."
  :items="relatedArticles"
/>

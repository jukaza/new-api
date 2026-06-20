---
title: 'The Mom Test：Xác minh nhu cầu thông qua phỏng vấn người dùng'
description: 'Bài viết The Mom Test dành cho người mới. Học cách tránh phản hồi lịch sự, tập trung vào hành vi thực tế, sự kiện cụ thể và vấn đề hiện có trong phỏng vấn người dùng, biến "nghe có vẻ ổn" thành đánh giá nhu cầu đáng tin cậy hơn.'
---

<script setup>
const duration = 'Khoảng <strong>1.5 giờ</strong>'
</script>

# The Mom Test：Xác minh nhu cầu thông qua phỏng vấn người dùng

<a id="top-mom"></a>

## Hướng dẫn chương này

<ChapterIntroduction
  :duration="duration"
  :tags="['Phỏng vấn người dùng', 'Xác minh nhu cầu', 'Nghiên cứu người dùng', 'Nghiên cứu sản phẩm']"
  coreOutput="1 bộ câu hỏi phỏng vấn có thể khai thác thông tin thực tế hơn"
  expectedOutput="Không còn coi phản hồi lịch sự của người dùng là xác minh, mà có thể dùng hành vi thực tế để đánh giá hướng đi"
>

Rất nhiều người lần đầu làm nghiên cứu sản phẩm, nghĩ rằng điều quan trọng nhất là "tìm người trò chuyện". Thế là họ đi hỏi bạn bè, đồng nghiệp, thậm chí người thân:

- Bạn thấy ý tưởng này của tôi thế nào?
- Nếu có một sản phẩm như vậy, bạn có dùng không?
- Chức năng này nghe có vẻ khá chứ?

Đối phương cũng thường cho phản hồi rất đáng khích lệ:

- Khá lắm
- Nghe có vẻ hữu ích
- Tôi nghĩ bạn có thể thử

Vấn đề là, những câu trả lời này thường không giúp bạn đưa ra đánh giá. Chúng giống như sự lịch sự, ủng hộ, hoặc phản ứng tự nhiên không muốn làm mất lòng bạn tại chỗ. Bạn tưởng mình đã "xác minh thị trường", thực ra chỉ thu thập được một đống lời an ủi khó dùng để ra quyết định.

Phương pháp The Mom Test là để giải quyết vấn đề này. Nó nhắc nhở chúng ta: **Không phải người dùng cố tình lừa bạn, mà là cách bạn hỏi câu hỏi, tự nhiên sẽ dẫn đối phương đến những câu trả lời nghe hay nhưng vô dụng.**

</ChapterIntroduction>

::: info SOP tối thiểu
**Mục đích**: Sau khi đọc xong, bạn sẽ rõ hơn cách trò chuyện với người dùng thế nào để không chỉ nghe "nghe có vẻ ổn", mà thực sự hỏi được thông tin giúp bạn đánh giá hướng đi.

**Hành động**: Viết lại 5 câu hỏi bạn định hỏi, ưu tiên hỏi "lần gần nhất xảy ra khi nào", "bạn đã xử lý thế nào lúc đó".

**Kết quả**: Bạn sẽ dễ dàng phân biệt hơn đâu là ý kiến, đâu mới là bằng chứng thực sự có thể hỗ trợ đánh giá.

**Từ khóa chuyển nhanh**: [The Mom Test là gì](#mom-what) · [Ba nguyên tắc cốt lõi](#mom-principles) · [AI giúp bạn thế nào](#mom-ai)
:::

## Bạn sẽ học được những nội dung sau

1. The Mom Test đang giải quyết vấn đề gì, tại sao nhiều "nghiên cứu người dùng" thực ra không nghiên cứu được thông tin thực tế
2. Vài nguyên tắc cốt lõi nhất của phương pháp này: Hỏi ít ý kiến, hỏi nhiều hành vi; Hỏi ít giả định, hỏi nhiều sự kiện
3. Làm thế nào biến một câu hỏi dễ nhận được phản hồi dương tính giả thành câu hỏi phỏng vấn có giá trị hơn
4. Cách kết hợp The Mom Test với JTBD, xác minh nhu cầu, đánh giá MVP

<a id="mom-what"></a>
## [1. The Mom Test thực chất là gì](#top-mom)

The Mom Test đến từ cuốn sách cùng tên của Rob Fitzpatrick. Tên nó nghe hơi giống đùa, nhưng chỉ trúng rất chuẩn:

**Ngay cả mẹ bạn, cũng rất khó trực tiếp nói với bạn "đây là một ý tưởng tồi".**

Lý do không phải bà không trung thực, mà là:

- Bà không muốn làm bạn tổn thương
- Bà sẽ vô thức khích lệ bạn
- Bà rất dễ trả lời theo cách bạn diễn đạt

Thực ra không chỉ mẹ, bạn bè, đồng nghiệp, bạn học cũ, thậm chí rất nhiều người lạ, khi đối mặt với ý tưởng sản phẩm của bạn, cũng thường cho "phản hồi tích cực" tương tự. Điều này không có nghĩa nhu cầu thực sự tồn tại, chỉ có nghĩa là bạn đã hỏi câu hỏi thành một dạng dễ nhận được câu trả lời nghe hay.

Vì vậy, trọng tâm của The Mom Test chưa bao giờ là "đừng hỏi mẹ", mà là:

**Đừng hỏi câu hỏi thành dạng ai cũng sẽ thuận theo bạn mà trả lời.**

Phương pháp này thực sự muốn dạy bạn, là cách thông qua đối thoại, lấy được thông tin gần với nhu cầu thực tế hơn, thay vì thu thập một đống lời bình luận khiến bạn cảm thấy tốt.

## 2. Vấn đề cốt lõi mà nó giải quyết là gì

The Mom Test chủ yếu giải quyết một loại nhận thức ảo rất phổ biến:

**Coi phản hồi tích cực lịch sự, thành nhu cầu thực tế.**

Ví dụ bạn hỏi:

- Bạn thấy ý tưởng App này thế nào?
- Nếu tôi làm một công cụ AI giúp bạn viết CV, bạn có dùng không?
- Chức năng này có giá trị không?

Điểm chung của những câu hỏi này là:

- Chúng đều đang hỏi "ý kiến"
- Chúng đều mang theo chút gợi ý
- Chúng đều đang nói về một tương lai chưa xảy ra

Mà câu trả lời của con người về "ý kiến" và "giả định tương lai", thường không ổn định. Rất nhiều người sẽ đánh giá quá cao sự hứng thú của mình, đánh giá quá cao khả năng thực thi của mình, cũng sẽ đánh giá quá cao ý muốn mua hàng trong tương lai.

Vì vậy The Mom Test nhắc bạn:

- Đừng quá tin vào đánh giá của người khác về ý tưởng của bạn
- Đừng quá tin vào dự đoán của người khác về hành vi tương lai
- Hãy cố gắng quay về hành vi thực tế đã xảy ra của người dùng

Bởi vì so với "bạn có dùng không", "bạn lần trước xử lý việc này thế nào" thường gần với sự thật hơn.

<a id="mom-principles"></a>
## [3. Ba nguyên tắc cốt lõi nhất](#top-mom)

Nếu bạn chỉ muốn ghi nhớ phần quan trọng nhất trước, có thể ghi trước ba nguyên tắc dưới đây.

### 3.1 Nói ít về ý tưởng của bạn, hỏi nhiều về trải nghiệm thực tế trong quá khứ của người dùng

Rất nhiều phỏng vấn vô hiệu vừa mở đầu đã kể về giải pháp của mình, kể mình hào hứng thế nào, kể mình chuẩn bị làm sản phẩm gì. Vấn đề là, một khi bạn nói quá nhiều, đối phương rất dễ chuyển sang trạng thái "phối hợp bạn", "khích lệ bạn".

So với đó, cách tốt hơn là tập trung vào trải nghiệm của đối phương:

- Lần gần nhất bạn gặp vấn đề này là khi nào?
- Lúc đó bạn đang làm gì?
- Cuối cùng bạn đã xử lý thế nào?
- Bước nào phiền phức nhất?

Bạn sẽ phát hiện, loại câu hỏi này có thể tự nhiên hơn kéo đối thoại về thực tế, thay vì dừng lại ở sở thích trong tưởng tượng.

### 3.2 Hỏi ít ý kiến trừu tượng, hỏi nhiều sự kiện cụ thể

"Tôi thấy chức năng này khá hay", "nghe có vẻ ổn", "dường như hơi hữu ích", những cách diễn đạt này đều quá trừu tượng, rất khó hướng dẫn quyết định sản phẩm.

Thông tin có giá trị hơn thường trông như thế này:

- Tuần trước tôi vừa mất 2 tiếng vì việc này
- Hiện tôi đang dùng Excel cộng WeChat gồng gánh
- Tháng trước tôi đã tiêu tiền cho công cụ tương tự
- Tôi sợ nhất là làm sai, không phải làm chậm

Đây mới là thông tin thực sự có thể giúp bạn đánh giá cường độ vấn đề, tần suất và khả năng trả phí.

### 3.3 Hỏi ít về giải pháp người dùng muốn, xem nhiều cách họ đang giải quyết vấn đề hiện tại

Người dùng rất giỏi mô tả rắc rối của mình, nhưng không nhất thiết giỏi thiết kế giải pháp.

Nếu bạn hỏi:

- Bạn có muốn một AI giúp bạn tự động làm việc này không?
- Bạn thấy thêm chức năng thông minh có giúp ích không?

Bạn nhận được, thường chỉ là thái độ mơ hồ đối với một giải pháp nào đó, chứ không phải bản thân nhu cầu.

Câu hỏi tốt hơn là:

- Hiện bạn dùng phương pháp nào để xử lý vấn đề này?
- Tại sao bạn lại chọn cách này?
- Nó không tốt ở điểm nào?

Nhìn rõ giải pháp thay thế hiện tại, thường quan trọng hơn trực tiếp hỏi "bạn muốn gì".

## 4. Tại sao người ta luôn cho bạn câu trả lời nghe hay nhưng vô dụng

Nếu bạn hiểu được điều này, khi làm phỏng vấn sẽ ít sai lầm hơn.

### 4.1 Con người vô thức giữ lịch sự

Đặc biệt khi đối tượng đối thoại có quan hệ với bạn, đối phương rất khó trực tiếp nói:

- Hướng này nghe không ổn lắm
- Tôi căn bản không dùng
- Vấn đề này không quan trọng với tôi lắm

Họ có khả năng nói hơn là "khá lắm", "có dịp có thể làm thử".

### 4.2 Con người đánh giá quá cao bản thân trong tương lai

Rất nhiều người thực sự tin rằng trong tương lai mình sẽ:

- Tự giác hơn
- Sẵn sàng học hỏi hơn
- Sẵn sàng trả phí hơn
- Sẵn sàng thử công cụ mới hơn

Nên câu "nếu có thì chắc tôi sẽ dùng" thường không đồng nghĩa với thực sự dùng trong tương lai.

### 4.3 Cách bạn hỏi câu hỏi tự thân đã đang dẫn dắt câu trả lời

Khi bạn hỏi:

- Ý tưởng này của tôi có khá không?
- Chức năng này có rất hữu ích với bạn không?

Thực ra bạn đã lén nhét "câu trả lời đúng" vào câu hỏi rồi.

Đây cũng là lý do The Mom Test đặc biệt nhấn mạnh: **Đừng biến phỏng vấn thành bạn đang tìm kiếm sự công nhận.**

## 5. So sánh trực tiếp: Câu hỏi nào dễ hỏi hỏng, câu hỏi nào có giá trị hơn

Những đối chiếu dưới đây, hầu như người mới nào cũng dùng đến.

| Câu hỏi dễ hỏi hỏng | Câu hỏi có giá trị hơn |
| --- | --- |
| Bạn thấy ý tưởng này của tôi thế nào? | Lần gần nhất bạn gặp vấn đề này là khi nào? |
| Nếu có sản phẩm này bạn có dùng không? | Hiện bạn xử lý việc này thế nào? |
| Bạn có sẵn sàng trả phí cho chức năng này không? | Lần trước bạn đã tiêu tiền cho vấn đề này chưa? Tiêu vào cái gì? |
| Bạn thấy chức năng này quan trọng không? | Trong quy trình này, bước nào phiền nhất, chậm nhất, không yên tâm nhất? |
| Bạn có muốn một AI giúp bạn tự động làm không? | Tại sao hiện tại bạn chưa tìm được giải pháp thuận tiện hơn? |

Điều quan trọng nhất của bảng này không phải câu cụ thể, mà là hướng phía sau:

- Từ ý kiến tiến về sự kiện
- Từ tương lai tiến về quá khứ
- Từ giải pháp của bạn tiến về vấn đề của người dùng

## 6. Một nhịp độ phỏng vấn người mới cũng có thể dùng ngay

Nếu bây giờ bạn muốn đi tìm người trò chuyện, có thể trực tiếp làm theo trình tự dưới đây.

### 6.1 Mở đầu: Nói rõ bạn đang học hỏi, không phải đang bán hàng

Ví dụ:

> Tôi gần đây đang nghiên cứu mọi người xử lý loại vấn đề này thế nào, muốn hiểu tình hình thực tế trước, không phải đến bán hàng đâu.

Cách diễn đạt này sẽ giúp đối phương dễ dàng bỏ gánh nặng tâm lý "tôi phải cho bạn phản hồi tích cực".

### 6.2 Bắt đầu từ trải nghiệm thực tế gần nhất

Có thể bắt đầu từ loại câu hỏi này:

- Lần gần nhất bạn gặp vấn đề này là khi nào?
- Lúc đó đã xảy ra chuyện gì?
- Phản ứng đầu tiên của bạn là xử lý thế nào?

Một khi đối thoại bước vào sự kiện cụ thể, chất lượng thông tin thường sẽ nâng cao rõ rệt.

### 6.3 Hỏi sâu về hành vi, chi phí và giải pháp thay thế

Tiếp tục hỏi:

- Bạn đang dùng cách nào để giải quyết?
- Điểm không thoải mái nhất của cách này là gì?
- Bạn đã dành bao nhiêu thời gian, tiền hoặc sức lực cho việc này?
- Bạn đã thử cách nào khác chưa? Tại sao không tiếp tục dùng?

### 6.4 Cuối cùng mới đánh giá mức độ đau và ưu tiên

Bạn không cần trực tiếp hỏi "có đau không", có thể đánh giá từ chi tiết:

- Anh/chị có thường xuyên gặp phải không
- Anh/chị có đang chủ động tìm cách khắc phục không
- Anh/chị đã sẵn sàng trả chi phí cho việc này chưa
- Khi kể về việc này, anh/chị có mang theo cảm xúc rõ ràng không

Tất cả những điều này đều hữu dụng hơn một câu "đây có phải là điểm đau của bạn không".

## 7. Một ví dụ hoàn chỉnh hơn

Giả sử bạn muốn làm một sản phẩm "AI giúp sinh viên sửa CV".

### Cách hỏi sai

Bạn đi hỏi bạn học:

> Tôi muốn làm một công cụ tối ưu CV bằng AI, bạn thấy thế nào?
> Nếu nó có thể tự động sửa CV theo vị trí, bạn có dùng không?

Lúc này, đối phương rất có thể sẽ nói:

- Nghe khá lắm
- Tôi nghĩ nên hữu ích
> Nếu miễn phí tôi sẽ thử

Những câu trả lời này hầu như không giúp bạn đánh giá nhu cầu mạnh hay yếu.

### Cách hỏi tốt hơn

Bạn có thể đổi thành:

> Lần gần nhất bạn sửa CV là khi nào?
> Lúc đó tại sao phải sửa?
> Bạn đã sửa thế nào?
> Bước nào kẹt nhất?
> Bạn có tìm ai giúp bạn xem không?
> Trước đây bạn đã từng tiêu tiền hoặc nhiều thời gian cho việc CV chưa?

Qua những câu hỏi này, thông tin bạn có thể nhận được là:

- Rất nhiều người không phải không biết viết, mà không biết sửa cho phù hợp với vị trí khác nhau
- Điểm đau nhất của họ không phải là bố cục, mà là "không biết kinh nghiệm nào đáng viết"
- Họ trì hoãn, không phải vì lười, mà vì mỗi lần sửa CV rất mất sức
- Họ đang dùng gợi ý của anh chị khóa trên, trang web template, công cụ AI và bạn bè giúp xem để giải lý tạm

Lúc này, bạn đã gần với vấn đề thực tế hơn nhiều.

## 8. The Mom Test kết hợp với JTBD thế nào

Nếu JTBD giúp bạn nhìn rõ "người dùng muốn hoàn thành tiến triển gì", thì The Mom Test giống như đang dạy bạn:

**Cách thông qua phỏng vấn, xác nhận job này có thực sự tồn tại hay không.**

Bạn hoàn toàn có thể kết nối cả hai:

1. Trước dùng JTBD giả định một job
2. Rồi dùng cách The Mom Test, đi hỏi người dùng về trải nghiệm thực tế gần nhất
3. Xem job này có thực sự tần suất cao, thực tế, đáng ưu tiên không

Ví dụ giả định JTBD của bạn là:

> Khi tôi chuẩn bị nộp hồ sơ thực tập, tôi muốn nhanh chóng sửa CV cũ thành phiên bản phù hợp với vị trí, để hoàn thành nộp hồ sơ càng sớm càng tốt.

Thì bạn có thể dùng câu hỏi phong cách The Mom Test để xác minh:

- Lần gần nhất bạn nộp hồ sơ là khi nào?
- Lúc đó bạn đã sửa CV thế nào?
- Đoạn nào khó viết nhất?
- Sau khi sửa xong bạn đánh giá thế nào biết là đủ tốt chưa?

Như vậy, phương pháp đã được kết nối:

- JTBD giúp bạn định nghĩa giả định nhu cầu
- The Mom Test giúp bạn phỏng vấn xác minh giả định

## 9. Sai lầm phổ biến nhất khi người mới làm phỏng vấn người dùng

### 9.1 Biến phỏng vấn thành hội thảo giới thiệu sản phẩm

Bạn vừa nói quá nhiều về ý tưởng của mình, đối phương dễ bắt đầu phối hợp bạn, thay vì nói cho bạn tình hình thực tế.

### 9.2 Đối tượng phỏng vấn toàn người quen

Người quen không phải không thể trò chuyện, nhưng người quen dễ khích lệ bạn hơn. Bạn ít nhất cần pha trộn một số người gần với người dùng thực tế hơn, thay vì chỉ tìm người ủng hộ bạn.

### 9.3 Theo đuổi hỏi chi tiết chức năng quá sớm

Nếu bạn chưa làm rõ vấn đề, đã bắt đầu hỏi chi tiết nút bấm, giao diện, chức năng, thường là đang bước vào giải pháp quá sớm.

### 9.4 Coi một câu "tôi sẽ dùng" thành kết quả xác minh

Phỏng vấn nhiều nhất giúp bạn đánh giá hướng đi, không đồng nghĩa đã hoàn thành xác minh. Xác minh thực sự, cuối cùng vẫn phải xem người dùng có sẵn sàng trả chi phí thực tế hay không, ví dụ thời gian, chi phí chuyển đổi, hành vi dùng thử, thậm chí trả phí.

### 9.5 Không sắp xếp sau khi phỏng vấn xong

Nếu bạn trò chuyện xong rồi để đó, thông tin nhanh chóng sẽ trở thành ấn tượng mơ hồ. Tốt nhất nên sắp xếp sớm:

- Vấn đề xuất hiện với tần suất cao
- Từ ngữ cảm xúc trong lời gốc của người dùng
- Giải pháp thay thế hiện tại
- Chi phí đã trả
- Đánh giá mới của bạn

## 10. Danh sách câu hỏi có thể copy để dùng ngay

Nếu bạn muốn bắt đầu nhanh nhất, đây là một bộ câu hỏi đủ thông dụng.

### Câu hỏi mở đầu

- Lần gần nhất bạn gặp vấn đề này là khi nào?
- Lúc đó cụ thể đã xảy ra chuyện gì?

### Câu hỏi hành vi

- Lúc đó bạn đã xử lý thế nào?
- Tại sao bạn lại chọn cách này?

### Câu hỏi chi phí

- Việc này thường tiêu bao nhiêu thời gian hoặc sức lực của bạn?
- Bạn có từng tiêu tiền để giải quyết nó chưa?

### Câu hỏi giải pháp thay thế

- Bạn đã thử công cụ hoặc cách nào khác chưa?
- Tại sao cuối cùng không tiếp tục dùng?

### Câu hỏi kết thúc

- Nếu sau này còn gặp vấn đề tương tự, bạn thấy cách giải quyết lý tưởng nhất nên trông như thế nào?

Lưu ý, câu hỏi kết thúc này có thể hỏi, nhưng tốt nhất đặt phía sau. Vì phía trước bạn cần lấy sự kiện trước, thay vì ước mơ.

## 11. Tóm tắt

Đóng góp quan trọng nhất của The Mom Test, không phải cho bạn một bộ kỹ năng "giỏi trò chuyện hơn", mà là giúp bạn xây dựng một cách đánh giá tỉnh táo hơn:

- Đừng quá nhanh tin vào lời khen của người khác về ý tưởng của bạn
- Đừng coi "nếu có tôi sẽ dùng" thành nhu cầu thực tế
- Đừng để phỏng vấn biến thành bạn đang tìm kiếm sự công nhận

Phỏng vấn thực sự có giá trị, nên cố gắng quay về những thứ này:

- Trải nghiệm thực tế gần nhất của người dùng
- Họ đang xử lý thế nào hiện tại
- Họ đã trả chi phí gì
- Họ không thoải mái rõ ràng ở điểm nào

Khi bạn bắt đầu hỏi như thế, thông tin bạn nhận được tuy đôi khi không nghe hay bằng, nhưng thường hữu dụng hơn.
Và khi làm sản phẩm, **sự thật hữu dụng, mãi mãi quan trọng hơn lời khích lệ nghe hay.**

<a id="mom-ai"></a>
## [12. Cách dùng AI giúp bạn làm phỏng vấn người dùng](#top-mom)

The Mom Test bản chất vẫn là phương pháp "trò chuyện với người thật", nên AI không thể thay thế phỏng vấn thực tế. Nhưng AI rất phù hợp hỗ trợ bạn trước, trong và sau phỏng vấn, đặc biệt giúp người mới giảm rào cản.

### 12.1 Để AI giúp bạn viết lại câu hỏi "dễ hỏi hỏng"

Rất nhiều người biết mình không nên hỏi "bạn thấy ý tưởng này của tôi thế nào", nhưng vừa mở miệng vẫn sẽ quay lại câu kiểu này. Bạn có thể đưa câu hỏi chuẩn bị hỏi cho AI trước, để nó giúp bạn viết lại:

```text
Dưới đây là những câu hỏi tôi chuẩn bị dùng để phỏng vấn người dùng:
[Dán câu hỏi của bạn]

Xin dùng nguyên tắc The Mom Test giúp tôi viết lại:
1. Xóa câu hỏi dạng ý kiến
2. Xóa câu hỏi giả định tương lai
3. Cố gắng đổi thành câu hỏi xoay quanh hành vi thực tế trong quá khứ, giải pháp thay thế hiện có và chi phí đã trả
4. Cuối cùng sắp xếp thành một bộ 8-10 câu hỏi phỏng vấn có thể dùng trực tiếp
```

Một input rất nhỏ cũng hoàn toàn có thể:

```text
Tôi muốn hỏi người dùng:
1. Bạn thấy tôi làm một công cụ AI sửa CV thế nào?
2. Bạn có dùng không?
3. Bạn có sẵn sàng trả phí không?

Giúp tôi đổi thành cách hỏi tốt hơn.
```

AI có thể cho output hữu ích trông như thế này:

```text
Câu hỏi sau khi viết lại:

1. Lần gần nhất bạn sửa CV là khi nào?
2. Lúc đó tại sao phải sửa?
3. Bạn đã sửa thế nào?
4. Bước nào mất thời gian nhất?
5. Bạn có tìm ai giúp bạn xem không?
6. Trước đây bạn có từng tiêu tiền hoặc nhiều thời gian cho việc sửa CV không?
```

Loại output này rất hữu ích, vì nó trực tiếp biến câu hỏi "đang hỏi ý kiến" của bạn thành câu hỏi "đang hỏi hành vi thực tế".

### 12.2 Để AI giúp bạn tạo đề cương phỏng vấn cho các đối tượng khác nhau

Cùng một hướng, đối mặt với các nhóm người khác nhau, trọng tâm phỏng vấn sẽ khác. Ví dụ sinh viên, HR, freelancer, điểm quan tâm hoàn toàn khác. Bạn có thể để AI giúp bạn xuất một bản đề cương cho từng đối tượng:

- Hướng người dùng mới, tập trung hiểu trải nghiệm thực tế gần nhất
- Hướng người dùng nặng, tập trung hiểu giải pháp thay thế và mức độ đau
- Hướng người dùng trả phí, tập trung hiểu đã từng trả chi phí cho việc này chưa

Như vậy khi thực sự trò chuyện bạn sẽ có nhịp điệu hơn, thay vì hỏi cùng một bộ câu hỏi với tất cả mọi người.

Ví dụ bạn có thể nhập trực tiếp như sau:

```text
Tôi sẽ trò chuyện với hai loại người:
1. Sinh viên lần đầu tìm thực tập
2. Anh chị khóa trên đã giúp nhiều người xem CV

Xin cho tôi mỗi loại một bản đề cương phỏng vấn, mỗi bản 6 câu hỏi.
```

AI có thể xuất:

```text
Cho sinh viên:
1. Lần gần nhất nộp thực tập là khi nào?
2. Lúc đó bước nào kẹt nhất?
3. Bạn làm sao biết CV mình có thể nộp được không?
...

Cho anh chị khóa trên:
1. Lần gần nhất bạn giúp người khác xem CV là khi nào?
2. Bạn thường thấy vấn đề rõ ràng nhất là gì?
3. Các em khóa dưới dễ kẹt ở bước nào nhất?
...
```

Như vậy, bạn không cần tự biên soạn câu hỏi từ đầu, chuẩn bị phỏng vấn sẽ nhẹ nhàng hơn nhiều.

### 12.3 Để AI giúp bạn sắp xếp bản ghi phỏng vấn

Sau khi phỏng vấn xong, vấn đề dễ xuất hiện nhất không phải "không có thông tin", mà là "thông tin quá phân tán". AI rất phù hợp giúp bạn sắp xếp đối thoại phân mảnh thành ghi chú có cấu trúc:

```text
Dưới đây là bản ghi phỏng vấn của tôi với 3 người dùng.
Xin sắp xếp theo góc nhìn The Mom Test:
1. Nội dung nào là sự kiện, nội dung nào chỉ là ý kiến
2. Hành vi thực tế gần nhất của người dùng là gì
3. Giải pháp thay thế hiện tại là gì
4. Chi phí thời gian, tiền bạc hoặc sức lực người dùng đã trả là gì
5. Vấn đề nào được nhắc đến lặp đi lặp lại
6. Cách nói nào nghe tích cực nhưng bằng chứng không đủ
```

Bước này đặc biệt có giá trị, vì nó có thể giúp bạn phân biệt nội dung "nghe có vẻ ổn" với nội dung "thực sự có thể hỗ trợ đánh giá".

Một input đơn giản có thể là:

```text
Đây là bản ghi sau khi tôi trò chuyện với một người dùng:

- Cô ấy nói nếu có công cụ chắc sẽ thử
- Tuần trước cô ấy mất một tối để sửa CV
- Hiện cô ấy chủ yếu nhờ bạn bè giúp xem
- Cô ấy nói khó nhất là không biết sửa đến mức nào thì có thể nộp

Xin giúp tôi phân biệt, đâu là ý kiến, đâu là sự kiện.
```

AI có thể xuất:

```text
Ý kiến:
- Nếu có công cụ chắc sẽ thử

Sự kiện:
- Tuần trước mất một tối để sửa CV
- Giải pháp thay thế hiện tại là nhờ bạn bè giúp xem
- Điểm khó nhất là không biết khi nào "có thể nộp"

Trọng tâm có thể dùng để đánh giá nhu cầu:
- Vấn đề này vừa mới xảy ra gần đây
- Người dùng đã đầu tư chi phí thời gian rõ ràng
- Giải pháp hiện tại dựa vào người khác, không ổn định
```

Output này có thể trực giác cho người mới thấy: lời nào có thể dùng để đánh giá, lời nào chỉ có thể nghe.

### 12.4 Để AI làm trước một vòng tìm kiếm mạng nhẹ nhàng

Nếu bạn chưa bắt đầu phỏng vấn, có thể để AI giúp bạn làm một số nghiên cứu bên ngoài rất nhẹ, ví dụ:

- Trong cộng đồng công khai, mọi người gần đây phàn nàn về vấn đề này thế nào
- Công cụ hiện có bị phàn nàn nhiều nhất là gì
- Người dùng đã từng trả tiền cho vấn đề tương tự chưa
- Trên thị trường có những giải pháp thay thế nào đã tồn tại

Loại thông tin này không thể thay thế phỏng vấn người thật, nhưng có thể giúp bạn nhanh chóng vào trạng thái, biết nên bắt đầu hỏi từ đâu.

Ví dụ một input đơn giản:

```text
Xin giúp tôi tìm:
"Sinh viên sửa CV thường phàn nàn nhiều nhất điều gì"
Giúp tôi sắp xếp 5 phàn nàn phổ biến nhất, viết bằng ngôn ngữ rất bình dân.
```

AI có thể xuất:

```text
Phàn nàn phổ biến:

1. Không biết CV nên viết kinh nghiệm gì
2. Mỗi lần nộp một vị trí lại phải sửa, quá mệt
3. Sửa nhiều phiên bản vẫn không chắc tốt chưa
4. Không tìm được ai cho phản hồi đáng tin cậy
5. Luôn cảm thấy chưa chuẩn bị xong, nên cứ kéo dài
```

Giá trị của loại kết quả này là, nó sẽ giúp bạn dễ dàng tìm được điểm vào phỏng vấn hơn.

### 12.5 Để AI đóng vai "huấn luyện viên tổng kết phỏng vấn"

Bạn cũng có thể ném bản ghi phỏng vấn vừa hoàn thành cho AI, để nó giúp bạn bắt lỗi:

```text
Dưới đây là một bản ghi phỏng vấn người dùng của tôi.
Xin giúp tôi tổng kết từ góc nhìn The Mom Test:
1. Câu hỏi nào của tôi hỏi quá giống đang tìm kiếm sự công nhận
2. Câu hỏi nào mang dẫn dắt rõ ràng
3. Đâu có thể tiếp tục hỏi sâu sự kiện
4. Nếu làm lại một lần, đoạn đối thoại này có thể hỏi tốt hơn thế nào
```

Điều này đặc biệt hữu ích cho người mới, vì bạn sẽ nhanh chóng xây dựng độ nhạy "tôi đang thu thập bằng chứng hay đang thu thập lời khích lệ".

## 📚 Bài tập

Xin bạn dựa vào nội dung bài viết, hoàn thành bài tập sau:

1. Chọn một hướng sản phẩm bạn muốn làm gần đây, trước viết ra 5 câu hỏi "dễ hỏi hỏng" bạn sẽ hỏi
2. Viết lại 5 câu hỏi này thành câu hỏi phù hợp hơn với phong cách The Mom Test
3. Tìm 3 người dùng tiềm năng, ít nhất hỏi được một lần "lần gần nhất bạn gặp vấn đề này là khi nào"
4. Sau khi phỏng vấn xong sắp xếp 4 loại thông tin: Hành vi thực tế, giải pháp thay thế, chi phí đã trả, khó khăn xuất hiện lặp đi lặp lại

## Đọc thêm

- [The Mom Test trang web chính thức](https://momtestbook.com/)
- [Rob Fitzpatrick: The Mom Test](https://www.robfitz.com/the-mom-test/)

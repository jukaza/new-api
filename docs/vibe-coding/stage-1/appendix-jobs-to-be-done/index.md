---
title: 'Dùng Jobs to Be Done tìm ra việc người dùng thực sự muốn hoàn thành'
description: 'Bài viết Jobs to Be Done dành cho người mới. Hiểu người dùng không phải mua chức năng, mà đang "thuê" sản phẩm của bạn để hoàn thành tiến triển trong kịch bản cụ thể, học cách dùng JTBD phân tích hướng sản phẩm, câu hỏi phỏng vấn và AI prompt.'
---

<script setup>
const duration = 'Khoảng <strong>1.5 giờ</strong>'
</script>

# Dùng Jobs to Be Done tìm ra việc người dùng thực sự muốn hoàn thành

<a id="top-jtbd"></a>

## Hướng dẫn chương này

<ChapterIntroduction
  :duration="duration"
  :tags="['JTBD', 'Nhu cầu người dùng', 'Tư duy sản phẩm', 'Insight nhu cầu']"
  coreOutput="1 câu JTBD giống nhu cầu thực tế hơn"
  expectedOutput="Có thể thu ý tưởng mơ hồ thành kịch bản người dùng và hướng MVP cụ thể hơn"
>

Rất nhiều người vừa bắt đầu làm sản phẩm, sai lầm dễ phạm phải nhất là đặt toàn bộ sự chú ý lên "tôi muốn làm chức năng gì". Thấy người khác có phân loại thông minh, bạn cũng muốn thêm; thấy người khác có tóm tắt tự động, bạn cũng muốn kết nối; thấy người khác làm Agent, đa mô thức, workflow, bạn cũng cảm thấy không thể thiếu.

Nhưng trong thực tế, người dùng hiếm khi vì "tên chức năng này rất ngầu" mới quyết định dùng một sản phẩm. Họ nhiều hơn là ở một thời điểm cụ thể, muốn đẩy một việc tiến lên phía trước, thế là tạm thời "thuê" một công cụ, một dịch vụ, thậm chí một người, để giúp mình hoàn thành bước này.

Đây chính là điều phương pháp **Jobs to Be Done (JTBD)** muốn nhắc chúng ta: **Người dùng không phải đang mua bản thân chức năng, mà đang thuê một loại giải pháp nào đó, giúp mình hoàn thành một tiến triển.**

Bài viết này sẽ dùng ngôn ngữ dễ hiểu nhất, đưa bạn từ không hiểu gì đến hiểu JTBD, và biến nó thành công cụ phân tích bạn có thể trực tiếp dùng khi làm ứng dụng AI.

</ChapterIntroduction>

::: info SOP tối thiểu
**Mục đích**: Sau khi đọc xong, bạn sẽ rõ hơn cách thu một ý tưởng mơ hồ thành một câu nhu cầu thực sự có kịch bản người dùng, thay vì trong đầu chỉ có một đống tên chức năng.

**Hành động**: Viết 1 câu ý tưởng mơ hồ, tìm 3 người dùng tiềm năng trò chuyện "lần gần nhất xử lý thế nào", rồi sắp xếp thành 1 câu JTBD.

**Kết quả**: Bạn sẽ có một giả định nhu cầu rõ ràng hơn, biết phiên bản đầu nên giải quyết gì trước.

**Từ khóa chuyển nhanh**: [JTBD là gì](#jtbd-what) · [Công thức một câu](#jtbd-formula) · [AI giúp bạn thế nào](#jtbd-ai)
:::

## Bạn sẽ học được những nội dung sau

1. Jobs to Be Done là gì, tại sao nó gần với nhu cầu thực tế hơn "brainstorm chức năng"
2. Cách phân biệt "chức năng người dùng nói muốn" và "việc người dùng thực sự muốn hoàn thành"
3. Dùng một template đơn giản thế nào, để thu một ý tưởng mơ hồ thành kịch bản, kích hoạt, rào cản và tiêu chuẩn thành công
4. Cách dùng JTBD trong sản phẩm AI, câu hỏi phỏng vấn và sắp xếp AI prompt

<a id="jtbd-what"></a>
## [1. Jobs to Be Done là gì](#top-jtbd)

Jobs to Be Done thường được viết tắt là **JTBD**. Ý tưởng cốt lõi phía sau nó, liên quan đến cách diễn đạt kinh điển mà nhóm Clayton Christensen phổ biến: **Người dùng sẽ "thuê" một sản phẩm nào đó để hoàn thành một việc.**

"Việc" ở đây, không phải loại hành động bề mặt trong to-do list, mà là một **tiến triển** mà người dùng hy vọng trạng thái của mình sẽ xảy ra. Ví dụ:

- Không phải "tôi muốn một công cụ biên bản AI", mà là "tôi muốn trong vòng 10 phút sau cuộc họp sắp xếp rõ trọng tâm, việc cần làm và người phụ trách, đừng nữa dựa vào trí nhớ bù ghi chú"
- Không phải "tôi muốn một App ghi chép", mà là "tôi muốn biết tiền rốt cuộc tiêu đi đâu, để cuối tháng đừng nữa lo lắng"
- Không phải "tôi muốn một công cụ tối ưu CV", mà là "tôi muốn nộp một CV khá đàng hoàng với nhiều tự tin hơn, không muốn mỗi lần nộp đều hoài nghi mình viết quá kém"

Vì vậy, **JTBD quan tâm không phải sản phẩm trông thế nào, mà là tại sao người dùng cần nó vào thời điểm này.**

Đây cũng là lý do rất nhiều sản phẩm nhìn có vẻ khác nhau, thực tế đang cạnh tranh cùng một job. Người dùng muốn "trên đường đi làm không nhàm chán", đối tượng có thể thuê bao gồm video ngắn, podcast, game, chat, thậm chí ngủ gật. Người dùng muốn "nhanh chóng hiểu một PDF rất dài", đối tượng có thể thuê bao gồm công cụ tóm tắt AI, thực tập sinh, đồng nghiệp, tự mình cố đọc, hoặc đơn giản là không xem trước.

Một khi bạn dùng góc nhìn này để xem vấn đề, bạn sẽ phát hiện đối thủ cạnh tranh thực sự của bạn, thường không chỉ là "một App khác trông giống bạn", mà là **tất cả giải pháp thay thế mà người dùng hiện tại có thể chấp nhận**.

## 2. JTBD khác gì với chân dung người dùng và danh sách chức năng

Rất nhiều người mới vừa bắt đầu phân tích nhu cầu, sẽ trước viết chân dung người dùng: 25 tuổi, nữ, thành phố tuyến 1, dân văn phòng, thích công cụ hiệu quả, sẵn sàng thử sản phẩm mới. Loại thông tin này không thể nói hoàn toàn vô dụng, nhưng nó thường **không đủ giải thích tại sao một người sẽ hành động vào thời điểm này.**

JTBD quan tâm hơn đến những vấn đề dưới đây:

- Anh/chị trong kịch bản nào quyết định tìm giải pháp
- Lúc đó rốt cuộc bị kẹt cái gì
- Anh/chị muốn đẩy việc gì bước tới bước tiếp theo
- Hiện đang dùng cách vụng về nào gồng gánh
- Nếu việc giải quyết tốt, kết quả nào sẽ khiến anh/chị thấy "đáng"

Nói cách khác, **chân dung người dùng giống hơn "người này đại khái là ai", JTBD giống hơn "người này hiện tại rốt cuộc muốn hoàn thành cái gì".**

Tương tự, danh sách chức năng cũng dễ dẫn dắt sai hướng. Người dùng nói "tôi muốn xuất Word", "tôi muốn AI sửa viết", "tôi muốn nhập giọng nói", đây đều chỉ là diễn đạt bề mặt. JTBD sẽ tiếp tục hỏi sâu:

- Tại sao bạn hiện tại cần xuất Word, chứ không phải PDF?
- Bạn muốn sửa viết, là vì văn phong quá kém, hay vì cần phù hợp với đối tượng khác nhau?
- Bạn muốn nhập giọng nói, là vì lười gõ phím, hay vì bạn thường xuyên đang đi bộ, đang lái xe, vừa họp xong cần ghi chép ngay?

Rất nhiều lúc, **chức năng chỉ là một loại dịch thuật tạm thời của job**. Nếu bạn chỉ thu thập chức năng, rất dễ làm sản phẩm thành "người dùng nói gì thì chất gì"; Nếu bạn nhìn thấy job phía sau, mới có nhiều cơ hội làm ra giải pháp thực sự thuận tay, thực sự có sức cạnh tranh.

## 3. Một ví dụ người mới cũng có thể hiểu

Trước đừng vội nghĩ đến sản phẩm AI phức tạp, chúng ta bắt đầu từ một ví dụ cuộc sống.

Giả sử có người trước khi ra cửa buổi sáng luôn không kịp ăn sáng, nên thường xuyên mua sandwich và cà phê ở cửa tàu điện ngầm. Nhìn bề ngoài, anh ấy "mua" là bữa sáng; nhưng nếu nhìn bằng JTBD, việc anh ấy thực sự muốn hoàn thành có thể là:

- Trong buổi sáng vội vã, dùng cách ít tốn sức não nhất giải quyết một bữa ăn
- Để mình trước khi đến công ty không bị đói phát hoảng
- Không vì ăn sáng mà ảnh hưởng nhịp độ đi làm

Lúc này, người dùng thuê không phải "sandwich của một thương hiệu cố định nào đó", mà là một giải pháp giúp anh ấy đẩy buổi sáng thuận lợi tiến lên. Nếu cửa hàng tiện lợi bên cạnh nhanh hơn, gần hơn, ổn định hơn, anh ấy có thể ngay lập tức đổi lựa chọn ban đầu.

Đem logic này sang sản phẩm AI thì rõ ràng hơn.

Ví dụ bạn muốn làm một "công cụ biên bản cuộc họp AI". Nếu chỉ dừng lại ở cấp chức năng, bạn sẽ rất dễ bắt đầu nghĩ:

- Có nên hỗ trợ upload audio không
- Có nên kết nối tách người nói không
- Có nên xuất Markdown không
- Có nên tự động sinh việc cần làm không

Những điều này đều không sai, nhưng chưa đủ. Dùng JTBD hỏi thêm một tầng, việc người dùng thực sự muốn hoàn thành có thể là:

- Tôi muốn trong 10 phút sau cuộc họp, đồng bộ kết quả thảo luận cho người không tham dự
- Tôi muốn trích xuất sạch việc cần làm, người phụ trách và thời hạn, đừng để nhóm dựa vào trí nhớ phối hợp
- Tôi muốn giảm thời gian sắp xếp nội dung cuộc họp lặp đi lặp lại, dành sức lực cho quyết sách và thúc đẩy

Một khi job được nói rõ, rất nhiều ưu tiên chức năng sẽ tự động nổi lên. Phiên bản đầu quan trọng nhất có thể không phải "hỗ trợ 12 định dạng xuất", mà là:

- Cấu trúc biên bản đủ rõ ràng
- Trích xuất việc cần làm ổn định
- Link chia sẻ thuận tiện
- Kết quả xuất ra khiến người ta dám trực tiếp chuyển tiếp cho nhóm

Đây là giá trị của JTBD: **Nó có thể giúp bạn từ "tôi muốn chất những khả năng nào" quay về "tôi muốn giúp người dùng thúc đẩy tiến triển gì".**

## 4. Một template JTBD hữu dụng

Nếu bạn là người mới, có thể trước đừng cố nghĩ JTBD quá học thuật. Trước nắm 5 yếu tố thực dụng nhất là đủ.

### 4.1 Kịch bản

Người dùng ở thời điểm nào, trong môi trường nào nhớ đến sản phẩm này?

- Là sau khi họp xong
- Là lúc sếp đột xuất đòi tài liệu
- Là buổi tối chuẩn bị nộp CV
- Là cuối tháng phát hiện tiền lại không đủ

**Nhu cầu không có kịch bản, thường đều chưa đủ thực tế.**

### 4.2 Kích hoạt

Là cái gì khiến anh/chị quyết định ngay lập tức tìm giải pháp?

- Bị đè nén bởi tài liệu dài, không biết bắt đầu đọc từ đâu
- Ngày mai phải nộp tài liệu, hôm nay mới phát hiện format lộn xộn
- Vừa bị sếp hỏi tiến độ, nhận ra mình chưa sắp xếp rõ ràng
- Muốn kiên trì ghi chép, nhưng viết tay, copy, sắp xếp đều quá phiền

Điểm kích hoạt thường mang theo cảm xúc. Cảm xúc này rất quan trọng, vì nó quyết định tại sao người dùng sẽ hành động vào khoảnh khắc này.

### 4.3 Tiến triển muốn hoàn thành

Anh/chị không chỉ muốn "làm một hành động", mà muốn đẩy mình tiến tới trạng thái mới nào?

- Từ hỗn loạn đến rõ ràng
- Từ lo lắng đến an tâm
- Từ trì hoãn đến khởi động
- Từ kém hiệu quả đến thuận tay
- Từ nói không rõ ràng đến có thể trực tiếp giao nộp

Trong bước này, từ "tiến triển" rất then chốt. Vì rất nhiều người thực sự mua không phải công cụ, mà là **sự thay đổi trạng thái**.

### 4.4 Giải pháp thay thế hiện tại

Hiện không có sản phẩm của bạn, anh/chị làm thế nào?

- Thủ công copy paste
- Dùng Excel hoặc sổ tay gồng gánh
- Tìm đồng nghiệp giúp đỡ
- Kéo dài không làm
- Chuyển qua lại giữa vài công cụ

Ai là giải pháp thay thế, ai là môi trường cạnh tranh thực sự của bạn.

### 4.5 Tiêu chuẩn thành công

Việc thế nào mới tính thực sự được giải quyết?

- Trong 10 phút nhận được kết quả có thể chia sẻ
- Không cần sửa lớn lần hai đã có thể gửi cho người khác
- Không dễ bị sót, bị sai, quên việc
- Lần đầu dùng đã biết bước tiếp theo làm gì

Nếu bạn thậm chí "người dùng đánh giá đáng hay không" đều nói không rõ, thì hướng này đa số chưa được thu tốt.

<a id="jtbd-formula"></a>
## [5. Công thức một câu có thể áp dụng trực tiếp](#top-jtbd)

Khi bạn muốn sắp xếp một hướng sản phẩm, có thể trước áp câu rất thực dụng này:

> Khi __________, tôi muốn __________, để __________.
> Hiện tôi chỉ có thể thông qua __________ để miễn cưỡng hoàn thành việc này.

Ví dụ:

> Khi tôi vừa xong một cuộc họp dự án với lượng thông tin rất lớn, tôi muốn nhanh chóng nhận được một biên bản kèm việc cần làm, người phụ trách và thời hạn, để tôi có thể ngay lập tức đồng bộ nhóm và thúc đẩy thực hiện.
> Hiện tôi chỉ có thể dựa vào tự mình nhớ, lướt lịch sử chat và thủ công sắp xếp để miễn cưỡng hoàn thành việc này.

Lại ví dụ:

> Khi tôi chuẩn bị nộp một vị trí mới, tôi muốn nhanh chóng sửa kinh nghiệm hiện có thành phiên bản phù hợp với vị trí hơn, để tôi có thể nộp một CV khá đàng hoàng với nhiều tự tin hơn.
> Hiện tôi chỉ có thể liên tục copy CV cũ, sửa cách diễn đạt bằng tay, sửa đến cuối cùng càng ngày càng không chắc chắn.

Nếu bạn có thể viết một câu rõ ràng đến mức này, thiết kế trang, thiết kế prompt, đánh giá ưu tiên chức năng phía sau, đều sẽ dễ hơn nhiều.

## 6. Khi làm sản phẩm AI, đặc biệt phải xem ba tầng job

Rất nhiều sản phẩm AI khi demo chức năng trông rất mạnh, nhưng sau khi thực sự lên mạng lại không giữ chân được người dùng, lý do phổ biến là chỉ giải quyết hành động bề mặt, chưa giải quyết job sâu hơn.

Bạn có thể thô chia một job thành ba tầng để xem:

### 6.1 Tầng chức năng

Nhiệm vụ bề mặt nhất là gì?

- Tóm tắt tài liệu
- Sửa viết văn bản
- Trích xuất việc cần làm
- Tạo hình ảnh

Đây là tầng dễ nói ra nhất bằng miệng người dùng.

### 6.2 Tầng cảm xúc

Người dùng hy vọng giảm bớt sự không thoải mái nào, hoặc thu được cảm giác gì?

- Không muốn hoảng hốt như vậy
- Không muốn trông thiếu chuyên nghiệp
- Không muốn mỗi lần đều bắt đầu từ đầu
- Muốn có nhiều cảm giác kiểm soát hơn

Rất nhiều ý muốn trả phí, thực tế quan hệ rất lớn với tầng cảm xúc.

### 6.3 Tầng xã hội

Người dùng hy vọng trong mắt người khác trở thành kiểu người nào?

- Trông đáng tin cậy hơn
- Có khả năng tổ chức hơn trong nhóm
- Chuyên nghiệp hơn trước mặt khách hàng
- Biết diễn đạt hơn trên nền tảng xã hội

Nếu bạn chỉ làm tầng chức năng, sản phẩm rất dễ bị thay thế; Nếu bạn đồng thời hiểu tầng cảm xúc và tầng xã hội, bạn sẽ dễ tìm được giá trị có độ dính thực sự hơn.

## 7. Dùng JTBD ngược lại sàng lọc hướng sản phẩm

Đôi khi không phải bạn đã có sản phẩm, mà trong tay có 3 đến 5 ý tưởng, không biết làm cái nào. Lúc này JTBD rất phù hợp để làm sàng lọc.

Bạn có thể cầm mỗi ý tưởng, lần lượt hỏi mình 5 câu:

1. Kịch bản tương ứng với ý tưởng này có đủ cụ thể không?
2. Người dùng hiện đã dùng cách vụng về nào đó để giải quyết chưa?
3. Mức độ đau của job này có đủ mạnh, hoặc tần suất có đủ cao không?
4. Nếu tôi làm tốt, người dùng có cảm nhận rõ ràng "trạng thái tốt lên" không?
5. Phiên bản đầu có thể chỉ xoay quanh bước quan trọng nhất của job này, làm ra một phiên bản rất nhỏ nhưng hữu dụng không?

Nếu một hướng nói đến cuối cùng vẫn chỉ có thể nói "cảm giác khá thú vị", nhưng nói không rõ kích hoạt, giải pháp thay thế và tiêu chuẩn thành công, thì nó đa số vẫn chỉ là một cảm hứng mơ hồ, không phải một hướng trưởng thành.

## 8. Câu hỏi có thể trực tiếp mang đi phỏng vấn người dùng

Rất nhiều người vừa làm nghiên cứu đã hỏi: "Bạn muốn chức năng gì?" Cách hỏi này rất dễ nhận được câu trả lời bề mặt.

JTBD phù hợp hỏi những câu dưới đây:

- Lần gần nhất bạn gặp vấn đề này là khi nào?
- Lúc đó bạn đang làm gì, tại sao bị kẹt?
- Cuối cùng bạn đã giải quyết thế nào?
- Trong quá trình này, nơi phiền nhất, chậm nhất, không yên tâm nhất là gì?
- Nếu có một công cụ giúp bạn, kết quả nào khiến bạn thấy thực sự hữu dụng?
- Bạn đã thử cách thay thế nào? Tại sao chúng không đủ tốt?

Lợi ích của cách hỏi này: Nó sẽ kéo đối thoại về trải nghiệm thực tế, thay vì dừng lại ở sở thích trong tưởng tượng.

## 9. Dùng AI giúp bạn phân tích JTBD

Bản thân JTBD không phải do AI phát minh, nhưng AI rất phù hợp giúp bạn sắp xếp và tinh lọc JTBD.

Ví dụ bạn đã thu thập 5 đến 10 phản hồi người dùng, có thể ném cho mô hình, để nó tổng kết theo cấu trúc dưới đây:

```text
Xin đóng vai trợ lý nghiên cứu sản phẩm.
Tôi sẽ cho bạn một số lời gốc của người dùng, xin đừng cho gợi ý chức năng trước,
mà trước sắp xếp theo framework Jobs to Be Done:

1. Người dùng đang ở kịch bản nào
2. Sự kiện kích hoạt anh/chị hành động là gì
3. Tiến triển anh/chị thực sự muốn hoàn thành là gì
4. Giải pháp thay thế hiện tại là gì
5. Tiêu chuẩn thành công anh/chị quan tâm nhất là gì
6. Những từ cảm xúc xuất hiện lặp đi lặp lại trong những phản hồi này là gì

Cuối cùng, xin sắp xếp nội dung này thành 3 giả định JTBD đáng ưu tiên xác minh nhất.
```

Nếu bạn đã có một ý tưởng, cũng có thể để AI giúp bạn làm vòng thu thứ nhất:

```text
Tôi muốn làm một [ý tưởng sản phẩm của bạn].
Xin đừng trực tiếp cho tôi danh sách chức năng, mà dùng phương pháp Jobs to Be Done giúp tôi phân tích:

1. Sản phẩm này có thể phục vụ những kịch bản cụ thể nào
2. Job cốt lõi người dùng muốn hoàn thành trong mỗi kịch bản là gì
3. Những giải pháp thay thế hiện có nào
4. Job nào phù hợp nhất làm điểm khởi đầu MVP, tại sao
5. Xin viết job cuối cùng được đề xuất thành một câu JTBD rõ ràng
```

Lợi ích của việc này là, bạn sẽ không vừa lên đã bị AI dẫn đi "brainstorm 50 chức năng", mà trước làm rõ hướng đã.

## 10. 4 sai lầm phổ biến nhất của người mới

### 10.1 Viết job thành tên chức năng

"AI tóm tắt", "phân loại thông minh", "tự động tạo" đều không phải job, chúng chỉ là cách triển khai khả thi.

### 10.2 Viết nhóm người rất rộng

"Tất cả dân văn phòng", "tất cả sinh viên", "tất cả doanh nhân" thường đều quá rộng. Càng rộng, bạn càng khó nhìn thấy kịch bản thực tế.

### 10.3 Chỉ nghe người dùng nói, không xem người dùng làm thế nào

Người dùng sẽ mô tả mình muốn gì, nhưng ưu tiên thực sự của họ, thường giấu trong cách họ hiện khắc phục tạm thời giải quyết vấn đề.

### 10.4 Vừa bắt đầu đã muốn làm nền tảng hoàn chỉnh

Cách mở đúng của JTBD, thường không phải "tôi làm một nền tảng vạn năng bao trùm", mà là trước tiên tập trung vào một bước quan trọng nhất trong một kịch bản, làm nó rất thuận tay.

## 11. Tóm tắt

Giá trị lớn nhất của Jobs to Be Done, không phải cho bạn một danh từ mới, mà giúp bạn đổi một góc quan sát: **Đừng chỉ tập trung vào chức năng sản phẩm, mà hãy tập trung vào việc người dùng muốn đẩy cái gì bước tới bước tiếp theo.**

Khi bạn bắt đầu liên tục hỏi mình:

- Người dùng trong kịch bản nào thuê sản phẩm này
- Anh/chị rốt cuộc bị kẹt ở đâu
- Hiện đang dùng cách nào gồng gánh
- Sau khi việc giải quyết xong, trạng thái sẽ thay đổi thế nào

Bạn sẽ phát hiện, rất nhiều ý tưởng mơ hồ ban đầu bỗng trở nên rõ ràng, rất nhiều chức năng hoa mỹ cũng bỗng không quan trọng như vậy.

Làm sản phẩm, đặc biệt là làm sản phẩm AI, sợ nhất là vừa bắt đầu đã đắm chìm trong trưng bày khả năng. JTBD có thể giúp kéo sự chú ý của bạn về nơi thực sự quan trọng: **Tại sao người dùng cần bạn, và bạn rốt cuộc đang giúp anh/chị hoàn thành tiến triển gì.**

<a id="jtbd-ai"></a>
## [12. Cách dùng AI giúp bạn thực hành JTBD](#top-jtbd)

JTBD không phải do AI phát minh, nhưng AI rất phù hợp đóng vai trợ lý nghiên cứu, trợ lý sắp xếp và trợ lý đối chiếu trong phương pháp này. Điểm mấu chốt là: **Để AI giúp bạn sắp xếp và mở rộng, thay vì thay bạn phỏng đoán người dùng.**

Bạn có thể dùng như sau:

### 12.1 Để AI giúp bạn viết lại ý tưởng mơ hồ thành giả định JTBD

Khi trong đầu bạn chỉ có một câu mô tả mơ hồ, ví dụ "tôi muốn làm một công cụ giúp sinh viên tìm thực tập", có thể trước để AI giúp bạn tách thành vài job khả dĩ:

```text
Tôi hiện có một ý tưởng sản phẩm mơ hồ: [Ý tưởng của bạn]
Xin đừng trực tiếp cho tôi danh sách chức năng, mà dùng cách Jobs to Be Done giúp tôi phân tích:
1. Có thể tương ứng với những kịch bản cụ thể nào
2. Trong mỗi kịch bản, tiến triển người dùng thực sự muốn hoàn thành là gì
3. Giải pháp thay thế hiện tại có thể là gì
4. Job nào phù hợp nhất làm MVP trước
Xin cuối cùng viết mỗi job thành một câu JTBD rõ ràng.
```

Bạn thậm chí có thể viết input rất nhỏ:

```text
Tôi muốn làm một thứ giúp sinh viên tìm thực tập.
Tôi hiện cũng nói không rõ cụ thể làm cái gì, bạn giúp tôi nghĩ xem người dùng rốt cuộc muốn hoàn thành việc gì.
```

AI có thể cho output hữu ích trông như thế này:

```text
Hướng JTBD khả dĩ:

1. Khi tôi lần đầu chuẩn bị nộp thực tập, tôi muốn nhanh chóng biết nên chuẩn bị những tài liệu nào trước,
để tôi không vì thông tin lộn xộn mà kéo dài không nộp.

2. Khi tôi thấy một vị trí thực tập, tôi muốn nhanh chóng đánh giá mình có đáng nộp hay không,
để tôi không lãng phí quá nhiều thời gian ở vị trí không phù hợp.

3. Khi tôi bắt đầu nộp hồ sơ, tôi muốn sửa CV hiện có thành phiên bản phù hợp với vị trí hơn,
để tôi có thể hoàn thành nộp nhanh hơn và tăng tỷ lệ được thông qua.
```

Giá trị của loại output này là, nó sẽ tách ý tưởng rất rộng của bạn thành vài hướng gần với kịch bản thực tế hơn.

### 12.2 Để AI giúp bạn sắp xếp lời gốc phỏng vấn

Nếu bạn đã làm vài lần phỏng vấn người dùng, có thể giao bản ghi phỏng vấn cho AI, để nó giúp bạn tinh lọc kịch bản, điểm kích hoạt, giải pháp thay thế và tiêu chuẩn thành công xuất hiện lặp đi lặp lại.

```text
Dưới đây là lời gốc phỏng vấn của 5 người dùng.
Xin đừng cho giải pháp trước, mà sắp xếp theo framework JTBD:
1. Người dùng đang ở kịch bản nào
2. Sự kiện kích hoạt anh/chị hành động là gì
3. Tiến triển anh/chị thực sự muốn hoàn thành là gì
4. Giải pháp thay thế hiện tại là gì
5. Tiêu chuẩn thành công anh/chị quan tâm nhất là gì
6. Thông tin nào xuất hiện lặp lại ở nhiều người dùng
Cuối cùng sắp xếp thành 3 giả định JTBD đáng ưu tiên xác minh nhất.
```

Một input rất đơn giản cũng có thể viết như sau:

```text
Tôi hỏi 3 người, họ đại khái nói như thế này:

1. Mỗi lần nộp thực tập tôi đều phải sửa lại CV, rất phiền.
2. Tôi thực sự sợ nhất là không biết mình viết đúng chưa.
3. Hiện tôi sẽ tìm anh chị khóa trên giúp xem, nhưng mỗi lần đều ngại phiền người ta mãi.

Bạn giúp tôi sắp xếp, việc họ thực sự muốn hoàn thành là gì.
```

AI có thể xuất:

```text
Kết quả sắp xếp:

- Kịch bản chung: Trước khi chuẩn bị nộp thực tập, cần xử lý CV
- Khó khăn chung: Không biết sửa đến mức nào thì "đủ tốt"
- Giải pháp thay thế hiện tại: Tìm anh chị khóa trên giúp xem, tự mình sửa lặp đi lặp lại
- JTBD khả dĩ:
  Khi tôi chuẩn bị nộp thực tập, tôi muốn nhanh hơn đánh giá CV đã đạt mức có thể nộp chưa,
  để tôi không luôn kẹt ở "sửa thêm chút nữa" mà mãi không nộp được.
```

Loại output này rất hữu dụng, vì nó giúp bạn từ lời gốc phân tán tinh lọc ra thứ giống "nhu cầu" hơn.

### 12.3 Để AI giúp bạn làm một vòng nghiên cứu mạng nhẹ nhàng

Trước khi bạn chưa bắt đầu phỏng vấn quy mô lớn, có thể trước để AI giúp bạn làm một số quét thông tin bên ngoài rất nhẹ, ví dụ:

- Trong diễn đàn hoặc cộng đồng công khai, mọi người phàn nàn về vấn đề này thế nào
- Sản phẩm hiện có trên thị trường chủ yếu đang giải quyết tầng vấn đề nào
- Giải pháp thay thế phổ biến nhất của người dùng là gì
- Trong đánh giá phổ biến, điểm mọi người hài lòng và không hài lòng nhất là gì

Loại nghiên cứu này không thể thay thế phỏng vấn người dùng thực tế, nhưng rất phù hợp làm khởi động cho giai đoạn Discover, giúp bạn xây bản đồ vấn đề trước.

Một input đơn giản:

```text
Xin giúp tôi kiểm tra:
"Sinh viên sửa CV, nộp thực tập thường gặp điểm đau nhất là gì?"
Ưu tiên xem trong diễn đàn công khai, bài viết kinh nghiệm, cộng đồng tìm việc những gì mọi người tự nói.
Giúp tôi sắp xếp thành 5 vấn đề phổ biến nhất.
```

AI có thể xuất:

```text
Sắp xếp điểm đau phổ biến:

1. Không biết CV nên viết kinh nghiệm gì, kinh nghiệm quá ít
2. Không biết sửa cho phù hợp với vị trí khác nhau thế nào
3. Sửa nhiều phiên bản, nhưng luôn không chắc đã đủ tốt
4. Không tìm được người đáng tin cậy giúp xem
5. Quy trình nộp hồ sơ phức tạp, dễ trì hoãn
```

Loại output này không thể làm kết luận cuối cùng, nhưng rất phù hợp giúp bạn trước quyết định ưu tiên phỏng vấn loại vấn đề nào.

### 12.4 Để AI đóng vai "bên phản đối"

Rất nhiều lúc, chúng ta quá có cảm tình với ý tưởng của mình. Bạn có thể chuyên để AI đóng vai người bắt lỗi, ép bạn nói rõ vấn đề hơn:

```text
Xin đóng vai một cố vấn nghiên cứu sản phẩm rất nghiêm ngặt.
Dưới đây là giả định JTBD của tôi: [Giả định của bạn]
Xin phê bình nó từ các góc độ sau:
1. Kịch bản này có quá rộng không
2. Job này có phải viết thành chức năng thay vì tiến triển thực sự không
3. Giải pháp thay thế có quá yếu không
4. Tiêu chuẩn thành công có đủ rõ ràng không
5. Rủi ro cần được xác minh nhất của giả định này là gì
```

Lợi ích của việc này là, bạn nhanh hơn phát hiện mình đang nhìn nhu cầu hay chỉ đang nhìn giải pháp mình thích.

## 📚 Bài tập

Xin bạn dựa vào nội dung bài viết, hoàn thành bài tập sau:

1. Chọn một ý tưởng sản phẩm bạn muốn làm gần đây, dùng một công thức JTBD viết rõ nó
2. Bổ sung 5 yếu tố cho ý tưởng này: Kịch bản, kích hoạt, tiến triển, giải pháp thay thế, tiêu chuẩn thành công
3. Tìm 3 người dùng tiềm năng, ít nhất hỏi được một lần "lần gần nhất bạn gặp vấn đề này là khi nào"
4. Giao lời gốc phỏng vấn cho AI, sắp xếp thành 3 giả định JTBD đáng ưu tiên xác minh nhất

## Đọc thêm

- [Christensen Institute: Jobs to Be Done](https://www.christenseninstitute.org/theory/jobs-to-be-done/)
- [Harvard Business School Online: What Is Jobs to Be Done?](https://online.hbs.edu/blog/post/jobs-to-be-done)
- [Intercom: Jobs-to-be-Done: A framework for customer needs](https://www.intercom.com/blog/jobs-to-be-done-framework/)
- [Mural: Jobs to Be Done framework guide](https://www.mural.co/blog/jobs-to-be-done-framework)

# Các tầng và chiến lược của bộ nhớ đệm
::: tip 🎯 Câu hỏi cốt lõi
**Tại sao một số trang web chỉ mất 50 mili giây để mở, trong khi một số khác phải mất 5 giây?** Điều này giống như hỏi: tại sao lấy sách từ cặp chỉ mất 1 giây, còn đi thư viện tìm sách lại mất 10 phút? Câu trả lời chính là — bộ nhớ đệm (cache). Chương này sẽ giúp bạn hiểu sâu về nguyên lý cốt lõi, mẫu thiết kế và kỹ thuật thực chiến của bộ nhớ đệm, giúp hiệu năng hệ thống của bạn tăng lên 100 lần.
:::

---

## 1. Tại sao cần "bộ nhớ đệm"?

### 1.1 Từ "tra cứu mỗi lần" đến "ghi nhớ dữ liệu thường dùng"

Trong thời kỳ đầu của thế giới máy tính, mỗi khi cần dữ liệu, lập trình viên đều phải truy vấn ổ cứng hoặc cơ sở dữ liệu. Điều này giống như mỗi lần làm bài toán bạn đều phải lật sách tra công thức, tuy chính xác nhưng hiệu quả rất thấp. Khi quy mô hệ thống tăng lên, cách "tra cứu mỗi lần" này bắt đầu bộc lộ những vấn đề nghiêm trọng: CPU của cơ sở dữ liệu tăng vọt lên 95%, thời gian phản hồi từ 100 mili giây tăng lên 8 giây, và cuối cùng toàn bộ hệ thống sụp đổ.

Điều này giống như một học sinh mỗi ngày đi học đều phải chạy từ ký túc xá đến thư viện tra tài liệu, một ngày chạy 50 lần, cuối cùng kiệt sức giữa đường. Giải pháp rất đơn giản: để một cuốn sổ ghi chép công thức thường dùng trong cặp, khi cần thì mở cặp ra xem, không cần lần nào cũng phải chạy đến thư viện. Bộ nhớ đệm chính là "cuốn sổ công thức" của hệ thống máy tính, nó lưu trữ dữ liệu thường dùng ở nơi có thể truy cập nhanh chóng, giúp hệ thống không phải lần nào cũng đến "thư viện" (cơ sở dữ liệu).

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🐌 Không có bộ nhớ đệm**
- Mỗi request đều truy vấn cơ sở dữ liệu
- CPU cơ sở dữ liệu sử dụng 95%
- Thời gian phản hồi 5-8 giây
- Hệ thống dễ sụp đổ

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🚀 Có bộ nhớ đệm**
- 95% request được trả về trực tiếp
- CPU cơ sở dữ liệu sử dụng < 20%
- Thời gian phản hồi 50 mili giây
- Hệ thống vận hành ổn định

</div>
</div>

**Đây chính là vấn đề cốt lõi mà "bộ nhớ đệm" giải quyết: bằng cách lưu trữ bản sao của dữ liệu thường dùng, giảm truy cập đến bộ lưu trữ chậm (cơ sở dữ liệu), giúp hệ thống nhanh hơn và ổn định hơn.**

<CachePerformanceComparisonDemo />

### 1.2 Một câu chuyện thực tế: tại sao bộ nhớ đệm là phao cứu sinh

Bạn có thể nghĩ: "Hệ thống của tôi hiện tại vẫn ổn, tại sao phải thiết kế bộ nhớ đệm trước?" Hãy để tôi kể một câu chuyện có thật, bạn sẽ hiểu tại sao bộ nhớ đệm không phải là "tùy chọn", mà là "bắt buộc".

::: warning Câu chuyện sập cơ sở dữ liệu của A Cường
A Cường là một full-stack engineer ở một công ty khởi nghiệp, công ty làm một ứng dụng mạng xã hội. Thời kỳ đầu ít người dùng (vài trăm người), hệ thống chạy bình thường, A Cường nghĩ không cần làm bộ nhớ đệm, truy vấn trực tiếp cơ sở dữ liệu là được.

Nửa năm sau, người dùng tăng lên 10 vạn người, một ngày nọ có một người nổi tiếng đăng một bài viết lên ứng dụng, ngay lập tức 10 vạn người dùng đổ vào truy cập. Kết quả cơ sở dữ liệu bị quá tải: CPU 100%, thời gian phản hồi từ 100ms biến thành 30 giây, cuối cùng toàn bộ ứng dụng sập, người dùng mất đi hàng loạt.

Sau đó rút kinh nghiệm: nếu lúc đó có một tầng bộ nhớ đệm đơn giản (như Redis), lưu các bài viết hot vào bộ nhớ đệm, áp lực cơ sở dữ liệu ít nhất có thể giảm 95%, hệ thống hoàn toàn có thể chống đỡ được đợt cao điểm lưu lượng này.

Từ đó A Cường hiểu ra một đạo lý: **bộ nhớ đệm không phải là thêm hoa thêm gấm, mà là bùa hộ mệnh cho hệ thống có lưu lượng truy cập cao. Không thêm bộ nhớ đệm, cũng giống như lái xe không thắt dây an toàn — bình thường thì không sao, nhưng khi xảy ra chuyện thì đã muộn.**
:::

::: info 💡 Bài học cốt lõi
Giá trị của bộ nhớ đệm không chỉ là "nhanh hơn", quan trọng hơn là "bảo vệ". Nó bảo vệ cơ sở dữ liệu không bị quá tải, bảo vệ hệ thống vận hành ổn định dưới lưu lượng truy cập cao. Khi bạn thiết kế hệ thống, đừng đợi đến khi xảy ra sự cố mới nghĩ đến bộ nhớ đệm, hãy coi nó là một phần của kiến trúc lõi ngay từ đầu.
:::

---

## 2. Khái niệm cốt lõi: bộ nhớ đệm là gì?

::: tip 🤔 Bộ nhớ đệm thực sự là gì?
Nói một cách đơn giản, **bộ nhớ đệm chính là không gian lưu trữ bản sao dữ liệu**. Giống như bạn dán một tờ giấy ghi chú trước bàn học, ghi lại những số điện thoại thường dùng, như vậy không cần lần nào cũng phải mở danh bạ điện thoại ra tra.

**Ba điểm then chốt**:
1. **Bản sao**: Dữ liệu trong bộ nhớ đệm là bản sao của dữ liệu gốc (cơ sở dữ liệu), không phải dữ liệu chính
2. **Truy cập nhanh**: Bộ nhớ đệm thường nằm trong bộ nhớ RAM, tốc độ đọc nhanh hơn ổ cứng 10 vạn lần
3. **Dung lượng hạn chế**: Không gian bộ nhớ đệm có hạn, chỉ có thể lưu trữ những dữ liệu được dùng nhiều nhất

Vì vậy, **bộ nhớ đệm chính là dùng không gian đổi lấy thời gian** — hy sinh một chút không gian bộ nhớ, đổi lấy tốc độ truy cập dữ liệu cực nhanh.
:::

Trước khi đi sâu vào các công nghệ cụ thể, chúng ta cần làm rõ một vài khái niệm cốt lõi. Để giúp bạn hiểu, chúng ta sẽ dùng "cặp sách của học sinh" để so sánh với hệ thống bộ nhớ đệm.

### 2.1 Dùng "ẩn dụ cặp sách" để hiểu các khái niệm cốt lõi của bộ nhớ đệm

Hãy tưởng tượng bạn là một học sinh, mỗi ngày cần tra cứu nhiều loại tài liệu. Quá trình này giống hệ thống bộ nhớ đệm một cách đáng kinh ngạc:

| Khái niệm | 🎒 Ẩn dụ cặp sách | Ý nghĩa kỹ thuật | Ví dụ thực tế |
|------|-----------|----------|----------|
| **Cache Hit (Trúng bộ nhớ đệm)** | Công thức bạn cần tìm có ngay trên tờ ghi chú | Dữ liệu yêu cầu được tìm thấy trong bộ nhớ đệm | Truy vấn thông tin người dùng, có trong Redis, trả về trực tiếp |
| **Cache Miss (Trượt bộ nhớ đệm)** | Tờ ghi chú không có, phải lật sách | Dữ liệu yêu cầu không có trong bộ nhớ đệm | Truy vấn thông tin người dùng, không có trong Redis, phải truy vấn cơ sở dữ liệu |
| **Hit Ratio (Tỷ lệ trúng)** | Trong 100 lần tra công thức, có 95 lần tìm thấy trên tờ ghi chú | Tỷ lệ trúng bộ nhớ đệm | Tỷ lệ trúng 95%, nghĩa là 95% request không cần truy vấn cơ sở dữ liệu |
| **TTL (Time To Live)** | Tờ ghi chú ghi "xé bỏ sau 3 ngày" | Thời gian hết hạn của bộ nhớ đệm | Đặt bộ nhớ đệm thông tin người dùng tự động hết hạn sau 30 phút |
| **Eviction (Loại bỏ)** | Cặp sách đầy rồi, vứt tờ ghi chú cũ nhất đi | Xóa dữ liệu cũ khi bộ nhớ đệm đầy | Redis hết bộ nhớ, tự động xóa dữ liệu ít được sử dụng nhất |

### 2.2 Cache Hit vs Cache Miss

Sự khác biệt về hiệu năng giữa Cache Hit và Cache Miss là rất lớn. Hãy xem dữ liệu cụ thể:

| Loại thao tác | Thời gian phản hồi | Tốc độ tương đối | Tình huống phù hợp |
|---------|---------|----------|----------|
| **CPU L1 Cache** | ~0.5 nano giây | Cực nhanh (cơ sở) | Tính toán nội bộ CPU |
| **Đọc bộ nhớ RAM** | ~100 nano giây | Nhanh gấp 200 lần | Bộ nhớ đệm cục bộ (như Caffeine) |
| **Truy vấn Redis** | ~1 mili giây | Chậm hơn 200 vạn lần | Bộ nhớ đệm phân tán |
| **Truy vấn MySQL** | ~10 mili giây | Chậm hơn 2000 vạn lần | Truy vấn cơ sở dữ liệu trên ổ cứng |

::: tip 📊 Bạn thấy gì từ bảng trên?
**Khoảng cách hiệu năng đáng kinh ngạc**: thao tác trên bộ nhớ RAM nhanh hơn truy vấn MySQL 10 vạn lần! Điều này giống như khoảng cách giữa lấy sách từ bàn học (1 giây) và đi thư viện tìm sách (10 vạn giây, khoảng 28 giờ).

**Ba bậc thang hiệu năng**:
1. **Bộ nhớ đệm cục bộ (RAM)**: nhanh nhất, nhưng dung lượng nhỏ, phù hợp với dữ liệu hot
2. **Bộ nhớ đệm Redis**: tốc độ trung bình, dung lượng lớn, phù hợp với tình huống phân tán
3. **Cơ sở dữ liệu**: chậm nhất, nhưng dung lượng vô hạn, là nguồn dữ liệu cuối cùng

**Bài học thực chiến**: hệ thống của bạn nên để hơn 95% request được trả về ở tầng bộ nhớ đệm, chỉ có dưới 5% request cần truy vấn cơ sở dữ liệu. Như vậy áp lực cơ sở dữ liệu nhỏ, hiệu năng toàn hệ thống sẽ được cải thiện đáng kể.
:::

::: details 🔍 Xem code thực tế của một lần "Cache Hit" và "Cache Miss"
Hãy dùng code để so sánh hai trường hợp này:

```javascript
// Tình huống: truy vấn thông tin người dùng

// ===== Cache Hit (Trúng bộ nhớ đệm) =====
// 1. Truy vấn Redis trước
const userFromCache = await redis.get('user:123')
if (userFromCache) {
  // Trúng! Trả về trực tiếp, mất khoảng 1 mili giây
  return JSON.parse(userFromCache)
}

// ===== Cache Miss (Trượt bộ nhớ đệm) =====
// 2. Bộ nhớ đệm không có, truy vấn cơ sở dữ liệu
const userFromDB = await db.query('SELECT * FROM users WHERE id = 123')
// Trượt! Cần truy vấn cơ sở dữ liệu, mất khoảng 10 mili giây, chậm hơn 10 lần

// 3. Sau khi truy vấn được thì ghi vào bộ nhớ đệm, lần sau sẽ trúng
await redis.set('user:123', JSON.stringify(userFromDB), 'EX', 1800)
return userFromDB
```

**Điểm then chốt**:
- Cache Hit: trả về trong 1 mili giây, trải nghiệm người dùng cực tốt
- Cache Miss: trả về trong 10 mili giây, trải nghiệm người dùng kém hơn
- **Giá trị của bộ nhớ đệm**: biến Miss thành Hit, hiệu năng tăng 10 lần
:::

### 2.3 Vòng đời của bộ nhớ đệm

Một mục trong bộ nhớ đệm từ khi được tạo đến khi bị hủy sẽ trải qua một vòng đời hoàn chỉnh. Hiểu được quá trình này rất quan trọng cho việc thiết kế hệ thống bộ nhớ đệm.

**Bốn giai đoạn**:

**Giai đoạn một: Ghi (Write)**
- **Ghi chủ động**: khi hệ thống khởi động, tải trước dữ liệu hot vào bộ nhớ đệm (cache warm-up)
- **Lazy Loading**: khi truy cập lần đầu thì tải từ cơ sở dữ liệu và ghi vào bộ nhớ đệm (cách dùng phổ biến nhất)

**Giai đoạn hai: Trúng/Trượt (Hit/Miss)**
- Mỗi request đều truy vấn bộ nhớ đệm trước
- Trúng thì trả về trực tiếp, trượt thì truy vấn cơ sở dữ liệu

**Giai đoạn ba: Hết hạn (Expiration)**
- **TTL (Time To Live)**: đặt thời gian tồn tại của bộ nhớ đệm (ví dụ 30 phút)
- Sau khi hết hạn, bộ nhớ đệm tự động mất hiệu lực, lần truy cập sau cần tải lại

**Giai đoạn bốn: Loại bỏ (Eviction)**
- Không gian bộ nhớ đệm có hạn, khi đầy cần xóa dữ liệu cũ
- Các chiến lược loại bỏ phổ biến:
  - **LRU (Least Recently Used)**: xóa dữ liệu không được sử dụng lâu nhất (dùng phổ biến nhất)
  - **LFU (Least Frequently Used)**: xóa dữ liệu có tần suất truy cập thấp nhất
  - **FIFO (First In First Out)**: xóa dữ liệu được ghi vào sớm nhất

👇 **Xem thực tế**:
Demo dưới đây trình bày vòng đời của bộ nhớ đệm. Nhấp "Thêm bộ nhớ đệm mới", quan sát cách bộ nhớ đệm trải qua toàn bộ quá trình ghi, trúng, hết hạn, loại bỏ:

<CacheLifecycleDemo />

---

## 3. Con đường tiến hóa của bộ nhớ đệm: từ đơn máy đến phân tán

::: tip 🤔 Tại sao cần các loại bộ nhớ đệm khác nhau?
Giống như khi học tập bạn sẽ để tài liệu ở nhiều nơi khác nhau: trên bàn học để những thứ dùng nhiều nhất (tờ ghi chú), trong cặp sách để những thứ thường dùng (sổ ghi chép), thư viện để tất cả tài liệu (kho sách).

**Hệ thống bộ nhớ đệm cũng vậy**:
- **Bộ nhớ đệm cục bộ (bàn học)**: nhanh nhất, dung lượng nhỏ, chứa dữ liệu siêu hot
- **Bộ nhớ đệm phân tán (tủ đồ công cộng)**: khá nhanh, dung lượng lớn, chứa dữ liệu thường dùng
- **Cơ sở dữ liệu (thư viện)**: chậm nhất, dung lượng vô hạn, chứa tất cả dữ liệu

**Tại sao phải phân tầng?** Vì hiệu năng và chi phí của mỗi tầng khác nhau, kết hợp hợp lý mới đạt được hiệu quả tối ưu.
:::

Đã nói nhiều khái niệm như vậy, hãy xem một case study thực tế: một hệ thống thương mại điện tử đã tiến hóa từ "không có bộ nhớ đệm" từng bước lên "kiến trúc bộ nhớ đệm đa tầng" như thế nào. Qua case study này, bạn sẽ hiểu trực quan hơn về tầm quan trọng của thiết kế bộ nhớ đệm.

### 3.1 Giai đoạn một: thời kỳ không có bộ nhớ đệm — cơ sở dữ liệu "trần trụi"

**Bối cảnh**: thời kỳ đầu hệ thống ít người dùng (vài trăm người), tất cả request đều truy vấn trực tiếp cơ sở dữ liệu, không có bất kỳ tầng bộ nhớ đệm nào.

**Stack công nghệ**:
- Cơ sở dữ liệu: MySQL
- Không có bộ nhớ đệm: không có Redis, không có bộ nhớ đệm cục bộ

**Kiến trúc hệ thống**:
```
Request người dùng → Máy chủ ứng dụng → Cơ sở dữ liệu MySQL
```

**Đặc điểm của giai đoạn này**:
- ✅ **Ưu điểm**: kiến trúc đơn giản, phát triển nhanh
- ❌ **Nhược điểm**: cơ sở dữ liệu chịu áp lực lớn, hiệu năng kém, người dùng lên đến hàng nghìn là sập

::: details Xem code thời đó và các vấn đề gặp phải
**Ví dụ code** (lần nào cũng truy vấn cơ sở dữ liệu):

```javascript
// Lấy chi tiết sản phẩm——lần nào cũng truy vấn cơ sở dữ liệu
async function getProduct(productId) {
  // Truy vấn trực tiếp cơ sở dữ liệu, không có bất kỳ bộ nhớ đệm nào
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )
  return product
}
```

**Các vấn đề gặp phải**:
1. **CPU cơ sở dữ liệu tăng vọt**: mỗi request đều truy vấn cơ sở dữ liệu, CPU sử dụng 80%+
2. **Phản hồi chậm**: truy vấn phức tạp mất 50-100 mili giây, trải nghiệm người dùng kém
3. **Khả năng đồng thời kém**: QPS (số truy vấn mỗi giây) của cơ sở dữ liệu tối đa chỉ 2000, nhiều hơn là sập
4. **Vấn đề sản phẩm hot**: trang chi tiết sản phẩm hot bị truy vấn thường xuyên, cơ sở dữ liệu trở thành nút thắt cổ chai

**Giải pháp tạm thời lúc đó**:
- Mua máy chủ mạnh hơn (thêm CPU, RAM) — chi phí cao, hiệu quả hạn chế
- Đọc/ghi tách biệt cơ sở dữ liệu — giảm áp lực đọc, nhưng áp lực ghi vẫn tồn tại
- Tối ưu SQL — có thể cải thiện 20-30%, nhưng không giải quyết được vấn đề gốc rễ
:::

Mô hình "trần trụi" này khi số lượng người dùng < 1000 vẫn có thể đối phó, nhưng khi người dùng tăng lên 1 vạn, 10 vạn, cơ sở dữ liệu bắt đầu sập thường xuyên, nhóm phát triển buộc phải đưa bộ nhớ đệm vào.

### 3.2 Giai đoạn hai: đưa Redis vào làm bộ nhớ đệm — hiệu năng tăng 10 lần

**Bối cảnh**: người dùng tăng lên 1 vạn, cơ sở dữ liệu không chịu nổi, nhóm quyết định đưa Redis vào làm tầng bộ nhớ đệm.

**Stack công nghệ**:
- Cơ sở dữ liệu: MySQL
- Bộ nhớ đệm: Redis (bản đơn máy)

**Kiến trúc hệ thống**:
```
Request người dùng → Máy chủ ứng dụng → Bộ nhớ đệm Redis (trượt mới truy vấn) → Cơ sở dữ liệu MySQL
```

**Đặc điểm của giai đoạn này**:
- ✅ **Ưu điểm**: hiệu năng tăng 10 lần, áp lực cơ sở dữ liệu giảm 90%
- ❌ **Nhược điểm**: Redis có điểm lỗi đơn (single point of failure), bộ nhớ đệm và cơ sở dữ liệu có thể không nhất quán

::: details Xem code triển khai bộ nhớ đệm Redis
**Ví dụ code** (thêm bộ nhớ đệm Redis):

```javascript
// Lấy chi tiết sản phẩm——truy vấn Redis trước, không có mới truy vấn cơ sở dữ liệu
async function getProduct(productId) {
  // 1. Truy vấn Redis trước
  const cacheKey = `product:${productId}`
  const cached = await redis.get(cacheKey)

  if (cached) {
    // Trúng bộ nhớ đệm! Trả về trực tiếp, mất khoảng 1 mili giây
    return JSON.parse(cached)
  }

  // 2. Trượt bộ nhớ đệm, truy vấn cơ sở dữ liệu
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  // 3. Sau khi truy vấn được thì ghi vào Redis, đặt hết hạn 30 phút
  await redis.setex(
    cacheKey,
    1800,  // 30 phút = 1800 giây
    JSON.stringify(product)
  )

  return product
}
```

**So sánh cải thiện hiệu năng**:

| Tình huống | Không có bộ nhớ đệm | Có bộ nhớ đệm Redis | Hệ số cải thiện |
|------|-------|--------------|---------|
| Truy vấn sản phẩm thông thường | 50ms | 5ms（khi trúng bộ nhớ đệm） | **10 lần** |
| Truy vấn sản phẩm hot | 80ms | 1ms（tỷ lệ trúng 95%） | **80 lần** |
| QPS cơ sở dữ liệu | 2000（đầy tải） | 200（bộ nhớ đệm chặn 90%） | **Áp lực cơ sở dữ liệu giảm 10 lần** |
| Đồng thời tối đa hệ thống | 2000 người dùng | 20000 người dùng | **10 lần** |

**Cải thiện mang lại**:
1. **Tốc độ phản hồi**: khi trúng bộ nhớ đệm, thời gian phản hồi từ 50ms giảm xuống 1-5ms
2. **Khả năng đồng thời**: số lượng người dùng hệ thống có thể hỗ trợ từ 2000 tăng lên 20000
3. **Áp lực cơ sở dữ liệu**: 90% request bị Redis chặn lại, CPU cơ sở dữ liệu từ 80% giảm xuống 20%
4. **Trải nghiệm người dùng**: tốc độ tải trang được cải thiện rõ rệt, khiếu nại của người dùng giảm

**Thách thức mới**:
1. **Vấn đề nhất quán bộ nhớ đệm**: giá sản phẩm thay đổi, cơ sở dữ liệu đã cập nhật, nhưng bộ nhớ đệm vẫn là giá cũ
2. **Cache Penetration (Xuyên thủng bộ nhớ đệm)**: có người cố ý truy vấn ID sản phẩm không tồn tại (như id=-1), lần nào cũng xuyên thẳng đến cơ sở dữ liệu
3. **Cache Avalanche (Tuyết lở bộ nhớ đệm)**: sau khi hệ thống khởi động lại, tất cả bộ nhớ đệm đồng thời hết hạn, ngay lập tức lượng lớn request đổ vào cơ sở dữ liệu
4. **Điểm lỗi đơn Redis**: Redis ngừng hoạt động, tất cả request đổ thẳng vào cơ sở dữ liệu, hệ thống có thể sập

**Giải pháp**:
- **Nhất quán bộ nhớ đệm**: khi cập nhật cơ sở dữ liệu, đồng thời xóa bộ nhớ đệm
- **Cache Penetration**: với dữ liệu không tồn tại cũng lưu vào Redis (value để trống, TTL đặt ngắn hơn, như 5 phút)
- **Cache Avalanche**: thêm giá trị ngẫu nhiên vào thời gian hết hạn của bộ nhớ đệm, tránh đồng thời hết hạn
:::

Sau khi đưa Redis vào, hiệu năng hệ thống được cải thiện đáng kể, nhưng các vấn đề mới cũng theo đó xuất hiện. Nhóm bắt đầu nghiên cứu cách giải quyết các vấn đề liên quan đến bộ nhớ đệm này.

### 3.3 Giai đoạn ba: kiến trúc bộ nhớ đệm đa tầng — hiệu năng tăng thêm 5 lần

**Bối cảnh**: người dùng tăng lên 10 vạn, ngay cả bộ nhớ đệm Redis cũng bắt đầu trở thành nút thắt cổ chai (Redis đơn máy QPS tối đa khoảng 10 vạn), nhóm quyết định đưa vào bộ nhớ đệm đa tầng.

**Stack công nghệ**:
- L1 Cache: bộ nhớ đệm cục bộ ứng dụng (Caffeine)
- L2 Cache: Redis cluster
- Cơ sở dữ liệu: MySQL master-slave cluster

**Kiến trúc hệ thống**:
```
Request người dùng → CDN Cache (tài nguyên tĩnh) → Máy chủ ứng dụng
                                                       ↓
                                      L1: Bộ nhớ đệm cục bộ (Caffeine) → Trượt → L2: Redis → Trượt → MySQL
```

**Đặc điểm của giai đoạn này**:
- ✅ **Ưu điểm**: hiệu năng cực đỉnh (bộ nhớ đệm cục bộ chỉ mất 0.1 mili giây), tính sẵn sàng cao (Redis ngừng hoạt động không ảnh hưởng đến dữ liệu hot)
- ❌ **Nhược điểm**: kiến trúc phức tạp, tính nhất quán của bộ nhớ đệm đa tầng khó đảm bảo

::: details Xem code triển khai bộ nhớ đệm đa tầng
**Ví dụ code** (bộ nhớ đệm cục bộ + Redis hai tầng):

```javascript
// Sử dụng bộ nhớ đệm cục bộ Caffeine
const caffeine = require('caffeine')
const localCache = new caffeine.Cache({
  max: 1000,              // Tối đa 1000 mục
  ttl: 30,                // Hết hạn sau 30 giây
})

// Lấy chi tiết sản phẩm——bộ nhớ đệm hai tầng
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  // L1: Truy vấn bộ nhớ đệm cục bộ trước (nhanh nhất, khoảng 0.1 mili giây)
  const localCached = localCache.get(cacheKey)
  if (localCached) {
    console.log('L1 trúng')
    return localCached
  }

  // L2: Bộ nhớ đệm cục bộ trượt, truy vấn Redis (khá nhanh, khoảng 1 mili giây)
  const redisCached = await redis.get(cacheKey)
  if (redisCached) {
    console.log('L2 trúng, điền lại L1')
    const product = JSON.parse(redisCached)
    // Điền lại bộ nhớ đệm cục bộ
    localCache.set(cacheKey, product)
    return product
  }

  // L3: Redis cũng trượt, truy vấn cơ sở dữ liệu (chậm nhất, khoảng 10 mili giây)
  console.log('L3 trúng, điền lại L2 và L1')
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  // Điền lại Redis (hết hạn 30 phút)
  await redis.setex(cacheKey, 1800, JSON.stringify(product))
  // Điền lại bộ nhớ đệm cục bộ
  localCache.set(cacheKey, product)

  return product
}
```

**So sánh hiệu năng bộ nhớ đệm đa tầng**:

| Tầng bộ nhớ đệm | Thời gian phản hồi | Tỷ lệ trúng | Dữ liệu phù hợp để lưu trữ |
|---------|---------|--------|--------------|
| **L1: Bộ nhớ đệm cục bộ** | ~0.1 mili giây | 70%（siêu hot） | Sản phẩm hot, cấu hình hệ thống, phiên người dùng |
| **L2: Bộ nhớ đệm Redis** | ~1 mili giây | 25%（hot thông thường） | Hầu hết dữ liệu sản phẩm, tổng hợp bình luận |
| **L3: Cơ sở dữ liệu** | ~10 mili giây | 5%（dữ liệu lạnh） | Toàn bộ dữ liệu sản phẩm |

**Cải thiện hiệu năng tổng thể**:
- **Thời gian phản hồi trung bình**: 5ms（giai đoạn hai） → 1ms（giai đoạn ba）, **tăng thêm 5 lần**
- **Đồng thời tối đa hệ thống**: 2 vạn người dùng（giai đoạn hai） → 10 vạn người dùng（giai đoạn ba）, **tăng 5 lần**
- **QPS cơ sở dữ liệu**: 200（giai đoạn hai） → 50（giai đoạn ba）, **giảm thêm 4 lần**

**Các vấn đề mới được giải quyết ở giai đoạn này**:
1. **Nhất quán bộ nhớ đệm cục bộ**: bộ nhớ đệm cục bộ của nhiều instance ứng dụng có thể không nhất quán (instance A lưu giá cũ, instance B là giá mới)
   - **Giải pháp**: đặt TTL bộ nhớ đệm cục bộ ngắn hơn (30 giây), để cửa sổ thời gian không nhất quán nhỏ lại
2. **Cache Warm-up**: sau khi hệ thống khởi động lại, bộ nhớ đệm cục bộ trống, lượng lớn request sẽ xuyên thẳng đến Redis
   - **Giải pháp**: khi hệ thống khởi động, chủ động tải dữ liệu hot vào bộ nhớ đệm cục bộ
:::

Kiến trúc bộ nhớ đệm đa tầng được áp dụng rộng rãi trong các công ty Internet lớn (như Taobao, JD.com), nó có thể hỗ trợ truy cập ở mức triệu QPS.

### 3.4 Toàn cảnh tiến hóa kiến trúc bộ nhớ đệm

| Giai đoạn | Kiến trúc | Thời gian phản hồi | Đồng thời tối đa | Thay đổi cốt lõi |
|------|------|---------|---------|---------|
| **Giai đoạn một: Không có bộ nhớ đệm** | Ứng dụng → Cơ sở dữ liệu | 50ms | 2000 người dùng | Cơ sở dữ liệu "trần trụi", hiệu năng kém |
| **Giai đoạn hai: Bộ nhớ đệm đơn tầng** | Ứng dụng → Redis → Cơ sở dữ liệu | 5ms | 20000 người dùng | Đưa Redis vào, hiệu năng tăng 10 lần |
| **Giai đoạn ba: Bộ nhớ đệm đa tầng** | Ứng dụng → Bộ nhớ đệm cục bộ → Redis → Cơ sở dữ liệu | 1ms | 100000 người dùng | Bộ nhớ đệm cục bộ + Redis, hiệu năng tăng thêm 5 lần |

::: tip 📊 Bạn thấy gì từ bảng trên?
**Giai đoạn một → Giai đoạn hai**: bước nhảy vọt về chất. Sau khi đưa Redis vào, hiệu năng tăng 10 lần, áp lực cơ sở dữ liệu giảm 90%. Đây là bước then chốt từ "dùng được" đến "đủ dùng".

**Giai đoạn hai → Giai đoạn ba**: tối ưu cực hạn. Sau khi đưa bộ nhớ đệm cục bộ vào, hiệu năng tăng thêm 5 lần. Đây là bước tiến từ "đủ dùng" đến "cực đỉnh", phù hợp với tình huống lưu lượng siêu lớn.

**Gợi ý thực chiến**:
- **Số lượng người dùng < 1 vạn**: giai đoạn một (không có bộ nhớ đệm) đủ dùng, nhưng khuyến nghị đưa Redis vào (giai đoạn hai)
- **Số lượng người dùng 1-10 vạn**: giai đoạn hai (bộ nhớ đệm Redis) là lựa chọn tốt nhất
- **Số lượng người dùng > 10 vạn**: cân nhắc giai đoạn ba (bộ nhớ đệm đa tầng), nhưng cần chú ý đến độ phức tạp về nhất quán

**Tóm lại**: tiến hóa kiến trúc bộ nhớ đệm không chỉ là "thêm nhiều tầng bộ nhớ đệm hơn", mà là **chọn kiến trúc phù hợp dựa trên quy mô lưu lượng** — thiết kế quá mức sẽ tăng độ phức tạp, thiết kế không đủ sẽ dẫn đến nút thắt cổ chai hiệu năng.
:::

---

## 4. Ba vấn đề kinh điển của bộ nhớ đệm: Penetration, Breakdown, Avalanche

Trong thực chiến, bộ nhớ đệm sẽ gây ra ba loại vấn đề kinh điển. Nếu không hiểu chúng, hệ thống của bạn có thể đột ngột sập vào một thời điểm nào đó. Hãy dùng những ẩn dụ đời thường để hiểu những vấn đề này.

### 4.1 Cache Penetration (Xuyên thủng bộ nhớ đệm): truy vấn dữ liệu không tồn tại

**Định nghĩa vấn đề**: truy vấn một **dữ liệu không tồn tại** (như id=-1), trong bộ nhớ đệm không có (vì chưa từng được lưu), trong cơ sở dữ liệu cũng không có, dẫn đến mỗi request đều xuyên thẳng đến cơ sở dữ liệu.

::: tip 🤔 Dùng "tra sách" để ẩn dụ Cache Penetration
Hãy tưởng tượng bạn đến thư viện tìm một cuốn sách, bạn hỏi thủ thư: "Có cuốn 'Cuốn Sách Không Tồn Tại' không?"

**Quy trình bình thường**:
- Thủ thư tra danh mục: "Không có cuốn sách này"
- Bạn rời đi

**Tình huống Cache Penetration**:
- Bạn đến hỏi lần 1, thủ thư tra cơ sở dữ liệu: "Không có", trả lời bạn
- Bạn đến hỏi lần 2, thủ thư lại tra cơ sở dữ liệu một lần nữa: "Không có"
- Bạn đến hỏi lần 100, thủ thư vẫn phải tra cơ sở dữ liệu: "Không có"

**Vấn đề**: thủ thư (cơ sở dữ liệu) bị làm phiền chết đi được, lần nào cũng phải tra cơ sở dữ liệu, ngay cả khi câu trả lời luôn là "không có".

**Giải pháp**: thủ thư ghi nhớ "'Cuốn Sách Không Tồn Tại' không tồn tại", lần sau bạn hỏi, trả lời thẳng "không có", không cần tra cơ sở dữ liệu. Đây chính là **Cache Null Object (lưu đối tượng rỗng vào bộ nhớ đệm)**.
:::

**Tình huống thực tế**:
- Kẻ tấn công độc hại tạo ra lượng lớn ID không tồn tại để truy vấn (như id=-1, id=999999999)
- Crawler duyệt các đường dẫn tài nguyên không tồn tại (như /api/products/invalid-id)
- Lỗi logic nghiệp vụ dẫn đến truy vấn dữ liệu không hợp lệ

**Giải pháp 1: Cache Null Object**

```javascript
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  // 1. Truy vấn bộ nhớ đệm trước
  const cached = await redis.get(cacheKey)
  if (cached !== null) {
    // Lưu ý: cached có thể là chuỗi "null"
    if (cached === 'null') {
      // Bộ nhớ đệm lưu "đối tượng rỗng", nghĩa là cơ sở dữ liệu không có dữ liệu này
      return null
    }
    return JSON.parse(cached)
  }

  // 2. Truy vấn cơ sở dữ liệu
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  // 3. Ngay cả khi cơ sở dữ liệu không có, cũng lưu "null", TTL đặt ngắn hơn (như 5 phút)
  if (!product) {
    await redis.setex(cacheKey, 300, 'null')
    return null
  }

  // 4. Có dữ liệu, lưu bộ nhớ đệm bình thường
  await redis.setex(cacheKey, 1800, JSON.stringify(product))
  return product
}
```

**Giải pháp 2: Bộ lọc Bloom (Bloom Filter)**

Bộ lọc Bloom là một công cụ "nhanh chóng phán đoán dữ liệu có tồn tại hay không", nó giống như một "siêu chỉ mục":

::: tip 📖 Bộ lọc Bloom là gì?
Hãy tưởng tượng bạn có một "hộp đen thần kỳ":
- Bạn hỏi nó: "Sản phẩm có ID 123 tồn tại không?"
- Nó nói: "**Chắc chắn không tồn tại**" → vậy thì thực sự không tồn tại, không cần truy vấn cơ sở dữ liệu
- Nó nói: "**Có thể tồn tại**" → vậy thì đi truy vấn cơ sở dữ liệu để xác nhận

**Đặc điểm**:
- **Tuyệt đối không bỏ sót**: nếu nó nói không tồn tại, thì thực sự không tồn tại
- **Có thể phán đoán sai**: nếu nó nói có thể tồn tại, có khả năng thực tế không tồn tại (xác suất rất thấp, có thể điều chỉnh)

**Giá trị**: bộ lọc Bloom có thể chặn 99% request "không tồn tại" trước khi truy vấn bộ nhớ đệm, bảo vệ cơ sở dữ liệu.
:::

```javascript
// Sử dụng bộ lọc Bloom
const { BloomFilter } = require('bloom-filters')

// Khởi tạo bộ lọc Bloom (giả định tối đa 100 vạn ID sản phẩm)
const bloomFilter = new BloomFilter(1000000, 0.01)  // Tỷ lệ phán đoán sai 1%

// Khi hệ thống khởi động, thêm tất cả ID sản phẩm vào bộ lọc Bloom
async function initBloomFilter() {
  const allIds = await db.query('SELECT id FROM products')
  allIds.forEach(row => {
    bloomFilter.add(row.id)
  })
}

// Trước khi truy vấn sản phẩm, dùng bộ lọc Bloom phán đoán trước
async function getProduct(productId) {
  // 1. Dùng bộ lọc Bloom phán đoán trước
  if (!bloomFilter.has(productId)) {
    // Chắc chắn không tồn tại, trả về null trực tiếp, không cần truy vấn cơ sở dữ liệu
    console.log('Bộ lọc Bloom chặn: sản phẩm không tồn tại')
    return null
  }

  // 2. Bộ lọc Bloom nói "có thể tồn tại", truy vấn bộ nhớ đệm
  const cached = await redis.get(`product:${productId}`)
  if (cached) {
    return JSON.parse(cached)
  }

  // 3. Trượt bộ nhớ đệm, truy vấn cơ sở dữ liệu
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  if (!product) {
    // Bộ lọc Bloom phán đoán sai (xác suất rất thấp), thực tế không tồn tại
    await redis.setex(`product:${productId}`, 300, 'null')
    return null
  }

  // 4. Có dữ liệu, ghi vào bộ nhớ đệm
  await redis.setex(`product:${productId}`, 1800, JSON.stringify(product))
  return product
}
```

### 4.2 Cache Breakdown (Đánh thủng bộ nhớ đệm): dữ liệu hot hết hạn

**Định nghĩa vấn đề**: một **dữ liệu hot** nào đó (như sản phẩm hot, tin tức hot search) hết hạn trong bộ nhớ đệm (TTL đến hạn), lúc này lượng lớn request đồng thời cùng đến, tất cả đều đi truy vấn cơ sở dữ liệu, khiến áp lực cơ sở dữ liệu tăng đột ngột.

::: tip 🤔 Dùng "tranh nhau mượn sách" để ẩn dụ Cache Breakdown
Hãy tưởng tượng thư viện có cuốn "Harry Potter", siêu hot, 100 người đều muốn mượn.

**Tình huống bình thường**:
- Thư viện để "Harry Potter" ở "quầy mượn sách" (bộ nhớ đệm)
- Mọi người lấy trực tiếp từ quầy mượn, không cần lên kệ sách tìm

**Tình huống Cache Breakdown**:
- "Harry Potter" ở quầy mượn sách đến hạn (bị trả về kệ sách)
- 100 người cùng đến mượn, phát hiện quầy mượn không có
- 100 người đều lao lên kệ sách tìm (cơ sở dữ liệu)
- Quản lý kệ sách (cơ sở dữ liệu) bị quá tải

**Vấn đề**: không phải "sách không tồn tại", mà là "sách siêu hot" đột nhiên biến mất khỏi bộ nhớ đệm, dẫn đến ngay lập tức lượng lớn request đổ vào cơ sở dữ liệu.
:::

**Tình huống thực tế**:
- Bảng hot search Weibo hết hạn trong tích tắc, mấy vạn người cùng truy cập
- Tin tức scandal người nổi tiếng hết hạn bộ nhớ đệm, fan cuồng truy cập
- Dữ liệu tồn kho khi bắt đầu hoạt động flash sale hết hạn

**Giải pháp 1: Khóa Mutex (Mutex Lock)**

```javascript
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  // 1. Truy vấn bộ nhớ đệm trước
  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }

  // 2. Trượt bộ nhớ đệm, lấy khóa phân tán
  const lockKey = `lock:${productId}`
  const lock = await redis.set(lockKey, '1', 'NX', 'EX', 10)  // Khóa 10 giây

  if (lock === 'OK') {
    // 3. Lấy được khóa, truy vấn cơ sở dữ liệu
    console.log('Lấy khóa thành công, truy vấn cơ sở dữ liệu')
    const product = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    )

    // 4. Ghi vào bộ nhớ đệm
    await redis.setex(cacheKey, 1800, JSON.stringify(product))

    // 5. Giải phóng khóa
    await redis.del(lockKey)
    return product
  } else {
    // 6. Không lấy được khóa, đợi 50ms rồi thử lại
    console.log('Lấy khóa thất bại, đợi rồi thử lại')
    await new Promise(resolve => setTimeout(resolve, 50))
    return getProduct(productId)  // Đệ quy thử lại
  }
}
```

**Giải pháp 2: Hết hạn logic (Logical Expiration)**

```javascript
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  // 1. Truy vấn bộ nhớ đệm
  const cached = await redis.get(cacheKey)
  if (cached) {
    const data = JSON.parse(cached)

    // 2. Kiểm tra thời gian hết hạn logic
    if (Date.now() < data.expireTime) {
      // Chưa hết hạn, trả về trực tiếp
      return data.product
    } else {
      // 3. Hết hạn logic, xây dựng lại bộ nhớ đệm bất đồng bộ, đồng thời trả về dữ liệu cũ
      console.log('Hết hạn logic, xây dựng lại bộ nhớ đệm bất đồng bộ')
      rebuildCacheAsync(productId)  // Xây dựng lại bất đồng bộ
      return data.product  // Trả về dữ liệu cũ
    }
  }

  // 4. Bộ nhớ đệm không tồn tại (tải lần đầu), truy vấn đồng bộ cơ sở dữ liệu
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  // 5. Ghi vào bộ nhớ đệm (bao gồm thời gian hết hạn logic)
  const cacheData = {
    product: product,
    expireTime: Date.now() + 30 * 60 * 1000  // Hết hạn logic sau 30 phút
  }
  await redis.set(cacheKey, JSON.stringify(cacheData))

  return product
}

// Xây dựng lại bộ nhớ đệm bất đồng bộ
async function rebuildCacheAsync(productId) {
  const lockKey = `rebuild:${productId}`
  const lock = await redis.set(lockKey, '1', 'NX', 'EX', 10)

  if (lock === 'OK') {
    console.log('Bắt đầu xây dựng lại bộ nhớ đệm bất đồng bộ')
    const product = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    )

    const cacheData = {
      product: product,
      expireTime: Date.now() + 30 * 60 * 1000
    }
    await redis.set(`product:${productId}`, JSON.stringify(cacheData))
    await redis.del(lockKey)
    console.log('Xây dựng lại bộ nhớ đệm bất đồng bộ hoàn tất')
  }
}
```

### 4.3 Cache Avalanche (Tuyết lở bộ nhớ đệm): lượng lớn dữ liệu đồng thời hết hạn

**Định nghĩa vấn đề**: lượng lớn dữ liệu bộ nhớ đệm **tập trung hết hạn tại cùng một thời điểm** (hoặc Redis ngừng hoạt động), dẫn đến tất cả request đồng thời xuyên thẳng đến cơ sở dữ liệu, ngay lập tức đè bẹp cơ sở dữ liệu.

::: tip 🤔 Dùng "thư viện trả sách hàng loạt" để ẩn dụ Cache Avalanche
Hãy tưởng tượng "quầy mượn sách" (bộ nhớ đệm) của thư viện có 1000 cuốn sách.

**Tình huống bình thường**:
- Thời gian trả sách của những cuốn sách này được phân tán: có cuốn hôm nay trả, có cuốn ngày mai trả, có cuốn ngày kia trả
- Mỗi ngày chỉ có vài chục cuốn đến hạn, quản lý (cơ sở dữ liệu) có thể xử lý dễ dàng

**Tình huống Cache Avalanche**:
- Sau khi hệ thống khởi động lại, quản lý đặt tất cả 1000 cuốn sách "đến hạn sau 30 ngày"
- 30 ngày sau, 1000 cuốn sách này đồng thời đến hạn
- 1000 người cùng đến mượn sách, phát hiện quầy mượn không có
- 1000 người đều lao lên kệ sách tìm
- Quản lý kệ sách (cơ sở dữ liệu) ngay lập tức bị quá tải

**Vấn đề**: không phải vấn đề của một cuốn sách, mà là **lượng lớn dữ liệu đồng thời hết hạn**, dẫn đến áp lực cơ sở dữ liệu tăng đột biến ngay lập tức.
:::

**Tình huống thực tế**:
- Sau khi hệ thống khởi động lại, tất cả bộ nhớ đệm được xây dựng lại từ 0, đồng thời đặt cùng TTL (như 30 phút)
- Tác vụ định kỳ làm mới bộ nhớ đệm hàng loạt, đặt cùng thời gian hết hạn
- Dịch vụ bộ nhớ đệm (Redis) ngừng hoạt động hoặc phân vùng mạng

**Giải pháp 1: TTL ngẫu nhiên**

```javascript
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }

  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  // Then chốt: thêm giá trị ngẫu nhiên (±5 phút) vào TTL cơ sở (30 phút)
  const baseTTL = 1800  // 30 phút
  const randomOffset = Math.floor(Math.random() * 600) - 300  // -5 đến +5 phút
  const finalTTL = baseTTL + randomOffset

  console.log(`TTL bộ nhớ đệm: ${finalTTL} giây（${Math.floor(finalTTL / 60)} phút）`)
  await redis.setex(cacheKey, finalTTL, JSON.stringify(product))

  return product
}
```

**Giải pháp 2: Cache Warm-up (Làm nóng bộ nhớ đệm)**

```javascript
// Khi hệ thống khởi động, chủ động tải dữ liệu hot vào bộ nhớ đệm
async function cacheWarmup() {
  console.log('Bắt đầu làm nóng bộ nhớ đệm...')

  // 1. Truy vấn 1000 sản phẩm hot nhất (sắp xếp theo lượt xem)
  const hotProducts = await db.query(`
    SELECT * FROM products
    ORDER BY view_count DESC
    LIMIT 1000
  `)

  // 2. Ghi hàng loạt vào Redis
  for (const product of hotProducts) {
    const cacheKey = `product:${product.id}`
    const ttl = 1800 + Math.floor(Math.random() * 600)  // 30 phút ± 5 phút
    await redis.setex(cacheKey, ttl, JSON.stringify(product))
  }

  console.log(`Làm nóng bộ nhớ đệm hoàn tất, đã tải ${hotProducts.length} sản phẩm hot`)
}

// Thực thi khi ứng dụng khởi động
cacheWarmup()
```

**Giải pháp 3: Circuit Breaker (Ngắt mạch giảm cấp)**

```javascript
// Sử dụng circuit breaker để bảo vệ cơ sở dữ liệu
const CircuitBreaker = require('opossum')

// Thiết lập circuit breaker
const dbQueryBreaker = new CircuitBreaker(
  async (productId) => {
    return await db.query('SELECT * FROM products WHERE id = ?', [productId])
  },
  {
    timeout: 3000,  // Timeout 3 giây
    errorThresholdPercentage: 50,  // Ngắt mạch khi tỷ lệ lỗi vượt quá 50%
    resetTimeout: 30000  // Thử khôi phục sau 30 giây
  }
)

// Xử lý giảm cấp sau khi ngắt mạch
dbQueryBreaker.fallback(() => {
  console.log('Cơ sở dữ liệu bị ngắt mạch, trả về dữ liệu giảm cấp')
  return {
    id: productId,
    name: 'Dịch vụ bận, vui lòng thử lại sau',
    status: 'degraded'
  }
})

async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }

  // Truy vấn cơ sở dữ liệu qua circuit breaker
  const product = await dbQueryBreaker.fire(productId)

  if (product.status === 'degraded') {
    return product  // Trả về dữ liệu giảm cấp
  }

  await redis.setex(cacheKey, 1800, JSON.stringify(product))
  return product
}
```

👇 **Xem thực tế**:
Demo dưới đây so sánh tình huống và giải pháp của ba vấn đề Cache Penetration, Breakdown, Avalanche:

<CacheProblemsDemo />

---

## 5. Chiến lược nhất quán bộ nhớ đệm: làm thế nào để bộ nhớ đệm và cơ sở dữ liệu đồng bộ

Bản chất của bộ nhớ đệm là bản sao dữ liệu, giữa bản sao và dữ liệu gốc (cơ sở dữ liệu) chắc chắn tồn tại một cửa sổ thời gian không nhất quán. Làm thế nào để kiểm soát cửa sổ thời gian này, là thách thức cốt lõi của thiết kế bộ nhớ đệm.

### 5.1 Tại sao bộ nhớ đệm và cơ sở dữ liệu lại không nhất quán?

::: tip 🤔 Dùng "tờ ghi chú và cuốn sách" để ẩn dụ sự không nhất quán
Hãy tưởng tượng bạn ghi trên tờ giấy ghi chú: "Số điện thoại của Tiểu Minh: 123456", đây là bản sao của danh bạ (cơ sở dữ liệu) của bạn.

**Tình huống không nhất quán**:
- Bạn cập nhật danh bạ, đổi số điện thoại của Tiểu Minh thành "7654321"
- Nhưng bạn quên cập nhật tờ giấy ghi chú
- Lần sau bạn tra số điện thoại, nhìn vào tờ giấy ghi chú, vẫn là số cũ "123456"

**Vấn đề**: tờ giấy ghi chú (bộ nhớ đệm) và danh bạ (cơ sở dữ liệu) không nhất quán với nhau.

**Nguyên nhân**: đã cập nhật dữ liệu gốc, nhưng không đồng bộ cập nhật bản sao. Trong hệ thống máy tính, điều này là do "cập nhật cơ sở dữ liệu" và "cập nhật bộ nhớ đệm" là hai thao tác độc lập, giữa chúng có cửa sổ thời gian, có thể bị các thao tác khác làm rối loạn.
:::

**Tình huống đồng thời thực tế**:

| Thời gian | Luồng A（cập nhật tuổi người dùng） | Luồng B（truy vấn người dùng） | Cơ sở dữ liệu | Bộ nhớ đệm |
|------|---------------------|------------------|--------|------|
| T1 | Bắt đầu cập nhật cơ sở dữ liệu | - | age=20 | age=20 |
| T2 | Cơ sở dữ liệu cập nhật thành age=25 | Truy vấn bộ nhớ đệm, trúng age=20 | age=25 | age=20 ❌ |
| T3 | Xóa bộ nhớ đệm | - | age=25 | - |
| T4 | - | - | age=25 | Tải từ DB age=25 ✅ |

**Vấn đề**: tại thời điểm T2, luồng B đọc được giá trị cũ 20 trong bộ nhớ đệm, trong khi cơ sở dữ liệu đã là 25. Đây chính là **bộ nhớ đệm không nhất quán**.

### 5.2 Best practice: cập nhật cơ sở dữ liệu trước, rồi xóa bộ nhớ đệm

::: tip 🤔 Tại sao là "xóa" chứ không phải "cập nhật" bộ nhớ đệm?
Bạn có thể nghĩ: tại sao không trực tiếp "cập nhật bộ nhớ đệm", mà lại "xóa bộ nhớ đệm"?

**Vấn đề của cập nhật bộ nhớ đệm**:
- Khi cập nhật đồng thời, có thể xảy ra tình huống luồng A cập nhật bộ nhớ đệm trước, luồng B cập nhật cơ sở dữ liệu sau nhưng bộ nhớ đệm chưa được cập nhật
- Chi phí cập nhật bộ nhớ đệm có thể rất cao (ví dụ cần tổng hợp dữ liệu từ nhiều bảng)
- Nếu sau khi cập nhật dữ liệu lại bị xóa, tốn công vô ích

**Ưu điểm của xóa bộ nhớ đệm**:
- Lần truy vấn sau tự động tải dữ liệu mới nhất từ cơ sở dữ liệu (lazy loading)
- Tránh dữ liệu bẩn do cập nhật đồng thời
- Đơn giản và đáng tin cậy, là best practice trong ngành
:::

**Quy trình chuẩn**:

```javascript
// Cập nhật thông tin sản phẩm
async function updateProduct(productId, updateData) {
  // 1. Cập nhật cơ sở dữ liệu trước
  await db.query(
    'UPDATE products SET name = ?, price = ? WHERE id = ?',
    [updateData.name, updateData.price, productId]
  )

  // 2. Rồi xóa bộ nhớ đệm (không phải cập nhật bộ nhớ đệm!)
  await redis.del(`product:${productId}`)

  // 3. Lần truy vấn sau, trượt bộ nhớ đệm, tự động tải dữ liệu mới nhất từ cơ sở dữ liệu
  console.log('Cập nhật hoàn tất, bộ nhớ đệm đã bị xóa')
}
```

::: details Xem tại sao "cập nhật DB trước, rồi xóa bộ nhớ đệm" là phương án tối ưu
So sánh ba chiến lược cập nhật:

**Chiến lược 1: Cập nhật bộ nhớ đệm trước, rồi cập nhật cơ sở dữ liệu** ❌ Không khuyến nghị
```javascript
// Vấn đề: nếu cập nhật cơ sở dữ liệu thất bại, bộ nhớ đệm là giá trị mới, cơ sở dữ liệu là giá trị cũ, không nhất quán
await redis.set('product:1', newProduct)  // Cập nhật bộ nhớ đệm thành công
await db.query('UPDATE products SET ...')  // Cập nhật cơ sở dữ liệu thất bại!
// Kết quả: bộ nhớ đệm là giá trị mới, cơ sở dữ liệu là giá trị cũ, không nhất quán vĩnh viễn!
```

**Chiến lược 2: Xóa bộ nhớ đệm trước, rồi cập nhật cơ sở dữ liệu** ❌ Không khuyến nghị
```javascript
// Vấn đề: giữa lúc xóa và cập nhật, có luồng khác truy vấn, sẽ tải dữ liệu cũ vào bộ nhớ đệm
await redis.del('product:1')  // Xóa bộ nhớ đệm
// Lúc này luồng B đến truy vấn, phát hiện bộ nhớ đệm không có, truy vấn cơ sở dữ liệu (vẫn là giá trị cũ), ghi vào bộ nhớ đệm
await db.query('UPDATE products SET ...')  // Cập nhật cơ sở dữ liệu
// Kết quả: bộ nhớ đệm là giá trị cũ, cơ sở dữ liệu là giá trị mới, không nhất quán!
```

**Chiến lược 3: Cập nhật cơ sở dữ liệu trước, rồi xóa bộ nhớ đệm** ✅ Khuyến nghị
```javascript
// Ưu điểm: khi cập nhật cơ sở dữ liệu có khóa hàng (row lock), các luồng khác phải đợi, tránh dữ liệu bẩn
await db.query('UPDATE products SET ...')  // Cập nhật cơ sở dữ liệu (có khóa hàng)
await redis.del('product:1')  // Xóa bộ nhớ đệm
// Ngay cả khi xóa bộ nhớ đệm thất bại, cũng chỉ là lần truy vấn sau sẽ về nguồn, không dẫn đến dữ liệu bẩn tồn tại lâu dài
```

**Tại sao chiến lược 3 là tối ưu?**
1. **Khóa cơ sở dữ liệu bảo vệ**: thao tác cập nhật sẽ có được khóa hàng (row lock), các thao tác đọc ghi khác phải đợi
2. **Ảnh hưởng của xóa thất bại nhỏ**: ngay cả khi xóa bộ nhớ đệm thất bại, chỉ là lần đọc sau sẽ về nguồn, không dẫn đến dữ liệu bẩn
3. **Đơn giản và đáng tin cậy**: không cần thêm logic phức tạp
:::

### 5.3 Xóa kép trì hoãn (Delayed Double Delete): đảm bảo nhất quán cho tình huống cực đoan

**Tình huống**: trong tình huống đồng thời cao, ngay cả với "cập nhật DB trước, rồi xóa bộ nhớ đệm", vẫn có xác suất cực nhỏ xảy ra không nhất quán. Xóa kép trì hoãn thông qua hai lần xóa, đảm bảo nhất quán ở mức tối đa.

**Quy trình**:
```
1. Xóa bộ nhớ đệm
2. Cập nhật cơ sở dữ liệu
3. Đợi một khoảng thời gian (như 500ms)
4. Xóa bộ nhớ đệm lần nữa
```

```javascript
async function updateProduct(productId, updateData) {
  const cacheKey = `product:${productId}`

  // 1. Xóa bộ nhớ đệm lần thứ nhất
  await redis.del(cacheKey)

  // 2. Cập nhật cơ sở dữ liệu
  await db.query(
    'UPDATE products SET name = ?, price = ? WHERE id = ?',
    [updateData.name, updateData.price, productId]
  )

  // 3. Đợi 500ms (để truy vấn của các luồng khác hoàn tất)
  await new Promise(resolve => setTimeout(resolve, 500))

  // 4. Xóa bộ nhớ đệm lần thứ hai (xóa dữ liệu cũ có thể đã bị các luồng khác tải vào)
  await redis.del(cacheKey)

  console.log('Xóa kép trì hoãn hoàn tất, dữ liệu đã đồng bộ')
}
```

**So sánh ba chiến lược nhất quán**:

| Chiến lược | Mức độ nhất quán | Ảnh hưởng hiệu năng | Độ phức tạp | Tình huống áp dụng |
|------|-----------|---------|--------|---------|
| **Cập nhật DB trước, rồi xóa bộ nhớ đệm** | Nhất quán cuối cùng (cửa sổ không nhất quán < 100ms) | Thấp | Thấp | Hầu hết tình huống, khuyến nghị làm phương án mặc định |
| **Xóa kép trì hoãn** | Nhất quán cuối cùng mạnh (cửa sổ không nhất quán < 10ms) | Trung bình (trì hoãn 500ms) | Trung bình | Tình huống yêu cầu nhất quán cao hơn (như tài chính, tồn kho) |
| **Xóa bộ nhớ đệm trước, rồi cập nhật DB** | Yếu (cửa sổ không nhất quán lớn) | Thấp | Thấp | ❌ Không khuyến nghị, dễ xảy ra không nhất quán |

👇 **Xem thực tế**:
Demo dưới đây so sánh hiệu quả của ba chiến lược nhất quán. Nhấp "Cập nhật dữ liệu", quan sát sự thay đổi nhất quán giữa bộ nhớ đệm và cơ sở dữ liệu:

<CacheConsistencyDemo />

---

## 6. Thực chiến: xây dựng một hệ thống bộ nhớ đệm hoàn chỉnh

Đã nói nhiều nguyên lý như vậy, hãy xem một case study thực tế: làm thế nào để thiết kế hệ thống bộ nhớ đệm hoàn chỉnh cho trang chi tiết sản phẩm thương mại điện tử.

### 6.1 Phân tích tình huống nghiệp vụ

**Yêu cầu**: người dùng truy cập trang chi tiết sản phẩm, cần hiển thị thông tin cơ bản của sản phẩm, giá, tồn kho, đánh giá và các dữ liệu khác.

**Đặc điểm**:
- **Đọc nhiều ghi ít**: 100 lần truy vấn, 1 lần cập nhật (tỷ lệ đọc/ghi 100:1)
- **Hot spot tập trung**: 20% sản phẩm đóng góp 80% lưu lượng
- **Dữ liệu phức tạp**: thông tin cơ bản sản phẩm + giá + tồn kho + tổng hợp đánh giá
- **Yêu cầu nhất quán**: giá, tồn kho cần nhất quán mạnh, các dữ liệu khác có thể nhất quán cuối cùng

**Chỉ tiêu hiệu năng**:
- Thời gian phản hồi P99 < 100ms（99% request trả về trong 100ms）
- QPS đỉnh của cơ sở dữ liệu < 5000
- Tỷ lệ trúng bộ nhớ đệm > 95%

### 6.2 Thiết kế kiến trúc

**Kiến trúc bộ nhớ đệm đa tầng**:

```
Request người dùng
  ↓
CDN Cache (tài nguyên tĩnh: ảnh, CSS, JS)
  ↓ Trượt
Nginx Local Cache (tổng hợp thông tin cơ bản sản phẩm)
  ↓ Trượt
Máy chủ ứng dụng
  ↓
  ├─ L1: Bộ nhớ đệm cục bộ (Caffeine, sản phẩm hot)
  │   ↓ Trượt
  ├─ L2: Bộ nhớ đệm Redis (tất cả dữ liệu sản phẩm)
  │   ↓ Trượt
  └─ L3: Cơ sở dữ liệu MySQL (toàn bộ dữ liệu)
```

### 6.3 Triển khai code cốt lõi

**Triển khai bộ nhớ đệm đa tầng hoàn chỉnh (phiên bản đơn giản)**:

```javascript
const caffeine = require('caffeine')

// L1: Bộ nhớ đệm cục bộ (hết hạn sau 30 giây)
const localCache = new caffeine.Cache({
  max: 1000,
  ttl: 30,
})

// Lấy chi tiết sản phẩm (bộ nhớ đệm đa tầng)
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  // L1: Bộ nhớ đệm cục bộ (khoảng 0.1 mili giây)
  const localCached = localCache.get(cacheKey)
  if (localCached) {
    console.log('L1 trúng')
    return localCached
  }

  // L2: Bộ nhớ đệm Redis (khoảng 1 mili giây)
  const redisCached = await redis.get(cacheKey)
  if (redisCached) {
    console.log('L2 trúng, điền lại L1')
    const product = JSON.parse(redisCached)
    localCache.set(cacheKey, product)
    return product
  }

  // L3: Cơ sở dữ liệu (khoảng 10 mili giây, có khóa phân tán chống Breakdown)
  const lockKey = `lock:${productId}`
  const lock = await redis.set(lockKey, '1', 'NX', 'EX', 10)

  if (lock === 'OK') {
    console.log('L3 trúng, truy vấn cơ sở dữ liệu')
    const product = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    )

    if (product) {
      // Ghi vào Redis (30 phút + TTL ngẫu nhiên)
      const ttl = 1800 + Math.floor(Math.random() * 600) - 300
      await redis.setex(cacheKey, ttl, JSON.stringify(product))
      // Điền lại bộ nhớ đệm cục bộ
      localCache.set(cacheKey, product)
    }

    await redis.del(lockKey)
    return product
  } else {
    // Lấy khóa thất bại, đợi rồi thử lại
    await new Promise(resolve => setTimeout(resolve, 50))
    return getProduct(productId)
  }
}

// Cập nhật thông tin sản phẩm (cập nhật DB trước, rồi xóa bộ nhớ đệm)
async function updateProduct(productId, updateData) {
  const cacheKey = `product:${productId}`

  // 1. Cập nhật cơ sở dữ liệu
  await db.query(
    'UPDATE products SET name = ?, price = ? WHERE id = ?',
    [updateData.name, updateData.price, productId]
  )

  // 2. Xóa bộ nhớ đệm cục bộ
  localCache.del(cacheKey)

  // 3. Xóa bộ nhớ đệm Redis
  await redis.del(cacheKey)

  console.log('Cập nhật hoàn tất, bộ nhớ đệm đã bị xóa')
}
```

👇 **Xem thực tế**:
Demo dưới đây trình bày quy trình làm việc hoàn chỉnh của hệ thống bộ nhớ đệm đa tầng. Nhấp "Truy vấn sản phẩm", quan sát cách request di chuyển qua các tầng bộ nhớ đệm:

<EcommerceCacheArchitectureDemo />

---

## 7. Tổng kết và lộ trình học tập

### 7.1 Ôn tập các điểm kiến thức cốt lõi

| Điểm kiến thức | Giải thích một câu | Vấn đề giải quyết | Điểm thực chiến |
|--------|-----------|-----------|----------|
| **Cache Hit** | Dữ liệu được tìm thấy trong bộ nhớ đệm | Hiệu năng tăng 10-100 lần | Mục tiêu tỷ lệ trúng > 95% |
| **Cache Penetration** | Truy vấn dữ liệu không tồn tại, lần nào cũng truy vấn cơ sở dữ liệu | Cơ sở dữ liệu bị truy vấn độc hại kéo sập | Bộ lọc Bloom + Cache Null Object |
| **Cache Breakdown** | Dữ liệu hot hết hạn, lượng lớn request đổ vào cơ sở dữ liệu | Áp lực cơ sở dữ liệu tăng đột biến tức thời | Khóa Mutex + Hết hạn logic |
| **Cache Avalanche** | Lượng lớn dữ liệu đồng thời hết hạn | Cơ sở dữ liệu bị đè bẹp | TTL ngẫu nhiên + Cache Warm-up |
| **Bộ nhớ đệm đa tầng** | Bộ nhớ đệm cục bộ + Redis + Cơ sở dữ liệu | Tối ưu hiệu năng cực hạn | L1 tỷ lệ trúng 70%, L2 Redis tỷ lệ trúng 25% |
| **Nhất quán bộ nhớ đệm** | Bộ nhớ đệm và cơ sở dữ liệu đồng bộ | Độ chính xác dữ liệu | Cập nhật DB trước, rồi xóa bộ nhớ đệm |
| **Xóa kép trì hoãn** | Xóa bộ nhớ đệm một lần trước và sau khi cập nhật | Nhất quán cho tình huống cực đoan | Đợi 500ms rồi xóa lại |

### 7.2 Gợi ý lộ trình học tập

**Giai đoạn 1: Hiểu nguyên lý (1-2 ngày)**
- Nắm vững bản chất của bộ nhớ đệm (bản sao dữ liệu, dùng không gian đổi thời gian)
- Hiểu các khái niệm cốt lõi: tỷ lệ trúng, TTL, loại bỏ
- Hiểu sự khác biệt hiệu năng giữa các phương tiện lưu trữ (RAM vs ổ cứng)

**Giai đoạn 2: Nắm vững cơ bản (2-3 ngày)**
- Học cách sử dụng Redis làm bộ nhớ đệm (lệnh SET, GET, SETEX)
- Triển khai logic đọc ghi bộ nhớ đệm đơn giản (truy vấn bộ nhớ đệm trước, trượt mới truy vấn cơ sở dữ liệu)
- Hiểu tại sao "khi cập nhật thì xóa bộ nhớ đệm thay vì cập nhật bộ nhớ đệm"

**Giai đoạn 3: Giải quyết vấn đề kinh điển (1 tuần)**
- Giải quyết Cache Penetration: triển khai bộ lọc Bloom hoặc Cache Null Object
- Giải quyết Cache Breakdown: triển khai khóa Mutex hoặc hết hạn logic
- Giải quyết Cache Avalanche: triển khai TTL ngẫu nhiên và Cache Warm-up

**Giai đoạn 4: Bộ nhớ đệm đa tầng (1-2 tuần)**
- Đưa vào bộ nhớ đệm cục bộ (Caffeine/Guava)
- Thiết kế kiến trúc hai tầng: bộ nhớ đệm cục bộ + Redis
- Xử lý vấn đề nhất quán của bộ nhớ đệm đa tầng

**Giai đoạn 5: Thực chiến cấp production (liên tục)**
- Thiết kế hệ thống bộ nhớ đệm hoàn chỉnh cho trang chi tiết sản phẩm
- Xây dựng giám sát (tỷ lệ trúng bộ nhớ đệm, thời gian phản hồi)
- Thực hiện kiểm tra tải (stress test) và tối ưu hiệu năng

::: info 💡 Lời kết
Bộ nhớ đệm là nền tảng của hệ thống có lưu lượng truy cập cao. Từ trang chi tiết sản phẩm của Taobao đến bảng hot search của Weibo, từ vòng kết nối bạn bè của WeChat đến luồng video của Douyin, đằng sau tất cả các hệ thống hiệu năng cao đều có một kiến trúc bộ nhớ đệm được thiết kế tỉ mỉ.

Hiểu về bộ nhớ đệm, không chỉ là học một công nghệ, mà còn là hiểu tư duy kiến trúc **dùng không gian đổi thời gian, dùng bản sao bảo vệ dữ liệu chính**. Khi bạn thực sự nắm vững bộ nhớ đệm, hiệu năng hệ thống của bạn sẽ từ "dùng được" vượt lên "dùng tốt", và cuối cùng đạt đến "cực đỉnh".

Hy vọng bài viết này có thể giúp bạn xây dựng nhận thức hoàn chỉnh về hệ thống bộ nhớ đệm. Khi bạn gặp vấn đề về hiệu năng trong dự án thực tế, bạn có thể nghĩ đến: "Liệu có thể dùng bộ nhớ đệm để giải quyết không?"
:::
# Triết lý quản lý state
::: tip 🎯 Câu hỏi cốt lõi
**Khi ứng dụng ngày càng lớn, làm thế nào để chia sẻ và đồng bộ dữ liệu một cách thanh lịch giữa các component?** Bạn có thể gặp phải tình huống khó xử này: người dùng thêm hàng vào giỏ trên trang chi tiết sản phẩm, nhưng số lượng giỏ hàng ở header không cập nhật; hai component không liên quan cần cùng một dữ liệu nhưng không biết truyền như thế nào. Chương này sẽ đưa bạn từ "truyền dữ liệu hỗn loạn" tiến hóa lên "quản lý state rõ ràng".
:::

---

## 1. Tại sao cần "component hóa và quản lý state"?

### 1.1 Từ xưởng nhỏ đến nhà máy: Sự tiến hóa của phát triển frontend

Trước khi bắt đầu chính thức, hãy tự hỏi một câu: **Bạn đã bao giờ thử nấu một bữa tiệc lớn trong bếp chưa?**

Nếu bạn chỉ nấu một tô mì cho mình, điều đó rất đơn giản -- một cái nồi, một vắt mì, một chút gia vị, mười giây là xong. Nhưng nếu bạn muốn mở một nhà hàng, phục vụ hàng trăm khách mỗi ngày, bạn không thể "muốn làm gì thì làm" được nữa. Bạn cần công thức chuẩn hóa, phân công rõ ràng, quy trình mua nguyên liệu thống nhất, như vậy mới đảm bảo chất lượng mỗi món ăn ổn định và hiệu suất ra món cao.

Phát triển frontend cũng vậy. Một người viết dự án nhỏ, code để đâu cũng được. Nhưng khi team lớn lên, dự án phức tạp hơn, cần một phương pháp có hệ thống để tổ chức code và quản lý dữ liệu. Đây chính là vấn đề mà **component hóa và quản lý state** giải quyết.

::: tip 🤔 "Component" và "State" là gì?
Trước khi tiếp tục, hãy giải thích hai thuật ngữ cốt lõi:

**Component**: Giống như các mảnh ghép LEGO, mỗi mảnh là một phần độc lập, có hình dạng, màu sắc, chức năng riêng. Bạn có thể ghép nhiều mảnh lại với nhau để tạo nên một lâu đài phức tạp. Trong phát triển frontend, một nút bấm, một form, một thanh điều hướng đều có thể là một component.

**State**: Là "bộ nhớ" của component. Ví dụ một nút bấm, nó "nhớ" mình đang ở trạng thái "vô hiệu hóa" hay "kích hoạt"; một component giỏ hàng, nó "nhớ" bên trong có những sản phẩm nào. State thay đổi và sự thay đổi state sẽ kích hoạt cập nhật giao diện.

**Component hóa + Quản lý state = Code có tổ chức + Luồng dữ liệu rõ ràng**
:::

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🏠 Mô hình xưởng nhỏ**
- Code viết trong một file, như nấu tất cả món trong một cái nồi
- Dữ liệu truyền lung tung, như nhân viên bưng đĩa chạy loạn trong nhà hàng
- Sửa một chỗ có thể ảnh hưởng chỗ khác, như bỏ nhiều muối quá làm hỏng cả món

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🏭 Mô hình nhà máy**
- Code được chia thành các component, như nhà hàng chia thành khu vực phục vụ, bếp, bộ phận thu mua
- Dữ liệu được quản lý tập trung, như có kho hàng và hệ thống phân phối thống nhất
- Phạm vi ảnh hưởng của thay đổi rõ ràng, như đổi một món không ảnh hưởng đến toàn bộ nhà hàng

</div>
</div>

### 1.2 Một câu chuyện thực tế: Tại sao bạn cần hiểu về quản lý state

Bạn có thể nói: "Tôi đang dùng Vue/React mà? Chúng chẳng phải đã có quản lý state rồi sao?" Để tôi kể một câu chuyện thực tế, bạn sẽ hiểu tại sao việc hiểu một cách có hệ thống về component hóa và quản lý state lại quan trọng đến vậy.

::: warning Câu chuyện của Tiểu Mỹ
Tiểu Mỹ là một product manager chuyển sang làm frontend developer ở một công ty thương mại điện tử, vừa được giao nhiệm vụ tái cấu trúc chức năng giỏ hàng. Trước đây cô ấy làm với các dự án cũ dùng jQuery, bây giờ phải chuyển sang dùng Vue 3.

Tiểu Mỹ nghĩ: "Logic giỏ hàng đơn giản thôi, lưu một mảng là được." Thế là cô ấy bắt đầu viết code:
- Trong component trang chi tiết sản phẩm, dùng một mảng `cart` để lưu dữ liệu giỏ hàng
- Trong component trang giỏ hàng, lại định nghĩa một mảng `cartItems`
- Trong component header navigation, lại có một biến `cartCount`

Vấn đề nhanh chóng xuất hiện:
1. **Dữ liệu không đồng bộ**: Người dùng thêm sản phẩm ở trang chi tiết, nhưng dữ liệu trang giỏ hàng không cập nhật
2. **Code trùng lặp**: Tiểu Mỹ phải viết nhiều hàm "thêm vào giỏ hàng", đặt trong các component khác nhau
3. **Khó bảo trì**: Vận hành yêu cầu thêm chức năng "xóa giỏ hàng", Tiểu Mỹ phát hiện phải sửa ba chỗ

Sau đó cô ấy hỏi kiến trúc sư frontend A Cường, A Cường nhìn code một cái liền nói: "Bạn đã phạm phải điều tối kỵ của quản lý state -- cùng một dữ liệu được lưu ở nhiều nơi."

Giải pháp rất đơn giản: dùng Pinia tạo một quản lý state giỏ hàng toàn cục, tất cả component đều đọc ghi dữ liệu từ cùng một nơi. Sau khi thay đổi, mọi vấn đề đều được giải quyết.

Từ đó Tiểu Mỹ hiểu ra một đạo lý: **Không hiểu component hóa và quản lý state, bạn sẽ viết ra "spaghetti code" khó bảo trì.**
:::

::: info 💡 Bài học cốt lõi
Component hóa và quản lý state không phải là "tính năng bổ sung" của framework, mà là nền tảng của phát triển frontend hiện đại. Hiểu chúng, bạn mới có thể thiết kế kiến trúc rõ ràng, viết code dễ bảo trì, và làm việc nhóm một cách thuần thục.
:::

---

## 2. Khái niệm cốt lõi: Hiểu bản chất của component hóa

::: tip 🤔 "Tư duy component hóa" là gì?
Tư duy component hóa là một phương pháp chia giao diện phức tạp thành các đơn vị code độc lập, có thể tái sử dụng, có trách nhiệm duy nhất.

Ví von: Hãy tưởng tượng bạn đang lắp ráp một máy tính. Bạn sẽ mua CPU, RAM, ổ cứng, card đồ họa riêng lẻ, rồi lắp ráp chúng lại với nhau. Mỗi linh kiện có chức năng rõ ràng, bạn có thể thay thế linh kiện bất kỳ lúc nào mà không ảnh hưởng đến các phần khác.

Component hóa chính là làm cho code frontend cũng "mô-đun hóa" được như vậy -- mỗi component phụ trách việc của mình, hợp tác với component khác thông qua interface rõ ràng.
:::

### 2.1 Hiểu component hóa qua ẩn dụ nhà hàng

Hãy dùng ẩn dụ nhà hàng để hiểu tư tưởng cốt lõi của component hóa:

| Khái niệm | 🍽️ Ẩn dụ nhà hàng | Vai trò thực tế | Ví dụ cụ thể |
|------|-------------|----------|----------|
| **Component** | Các bộ phận của nhà hàng (phục vụ, bếp, thu mua) | Mỗi bộ phận phụ trách việc của mình | Component nút phụ trách click, component form phụ trách nhập liệu |
| **Props (Thuộc tính)** | Thực đơn khách đưa cho nhân viên | Component cha truyền dữ liệu cho component con | Component cha truyền "tên người dùng" cho component avatar |
| **Events (Sự kiện)** | Nhân viên thông báo cho bếp "có đơn mới" | Component con thông báo cho component cha điều gì đã xảy ra | Component nút báo cho component cha "tôi đã được nhấn" |
| **State (Trạng thái)** | "Danh sách đơn hàng hiện tại" của bếp | Dữ liệu lưu trong nội bộ component | Component giỏ hàng nhớ bên trong có những sản phẩm nào |

::: tip 📊 Bạn thấy gì từ bảng này?
Hãy đọc từng dòng của bảng này:

**Component**: Như nhà hàng có các bộ phận khác nhau, trang frontend cũng được tạo thành từ các component khác nhau. Mỗi component là một phần độc lập, có trách nhiệm riêng.

**Props**: Đây là cách component cha "truyền dữ liệu" cho component con. Như khách gọi món nói cho nhân viên biết muốn ăn gì, component cha cũng có thể truyền dữ liệu (như tên người dùng, thông tin sản phẩm) cho component con qua props. Lưu ý: props là "một chiều", chỉ có thể truyền từ cha xuống con, không thể truyền ngược lại.

**Events**: Khi component con cần thông báo cho component cha (ví dụ nút được nhấn, form được submit), sẽ kích hoạt sự kiện. Như nhân viên nhận đơn rồi thông báo cho bếp "bắt đầu nấu". Điều này giữ tính một chiều của luồng dữ liệu -- component con không thể trực tiếp sửa dữ liệu của component cha, chỉ có thể "gửi tin nhắn".

**State**: Đây là "bộ nhớ" nội bộ của component. Như bếp cần nhớ hiện tại có những đơn hàng nào, component cũng cần nhớ state của mình (ví dụ giỏ hàng có những sản phẩm nào, nút có bị vô hiệu hóa không). Khi state thay đổi, component sẽ tự động cập nhật giao diện.
:::

<ComponentHierarchyDemo />

### 2.2 Props và Events: "Kênh chính thức" giữa component cha và con

Trong các framework frontend (Vue, React), **Props và Events là cách chuẩn để giao tiếp giữa component cha và con**.

**Ví dụ Vue:**

```vue
<!-- Parent.vue - Component cha -->
<template>
  <div>
    <!-- Như đưa thực đơn cho nhân viên, truyền dữ liệu qua props -->
    <Child
      :user-name="currentUser.name"
      :is-admin="currentUser.isAdmin"
      @delete-user="handleDelete"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Child from './Child.vue'

const currentUser = ref({
  name: 'Trương Tam',
  isAdmin: true
})

const handleDelete = (userId) => {
  console.log('Xóa người dùng:', userId)
  // Xử lý logic xóa
}
</script>
```

```vue
<!-- Child.vue - Component con -->
<template>
  <div class="user-card">
    <h3>{{ userName }}</h3>
    <span v-if="isAdmin" class="badge">Quản trị viên</span>
    <button @click="requestDelete">Xóa người dùng</button>
  </div>
</template>

<script setup>
// Nhận dữ liệu từ component cha
const props = defineProps({
  userName: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
})

// Định nghĩa sự kiện có thể kích hoạt
const emit = defineEmits(['delete-user'])

const requestDelete = () => {
  // Thông báo cho component cha qua sự kiện
  emit('delete-user', props.userName)
}
</script>
```

::: tip 💡 Nguyên tắc cốt lõi
**Props đi xuống, Events đi lên** -- đây là quy tắc vàng của giao tiếp component.

- Component cha thông qua **props** truyền dữ liệu cho component con (như giao nhiệm vụ cho cấp dưới)
- Component con thông qua **events** thông báo cho component cha điều gì đã xảy ra (như cấp dưới báo cáo công việc)

Điều này giữ cho luồng dữ liệu rõ ràng và một chiều, tránh tình trạng hỗn loạn "ai cũng có thể sửa dữ liệu".
:::

<PropsFlowDemo />

### 2.3 Luồng dữ liệu một chiều: Tại sao không thể trực tiếp sửa props?

Nhiều người mới học sẽ mắc một lỗi: trực tiếp sửa giá trị của props trong component con.

```vue
<!-- ❌ Cách làm sai -->
<script setup>
const props = defineProps({
  count: { type: Number, default: 0 }
})

// Trực tiếp sửa props - điều này bị cấm!
props.count = 10  // Sẽ báo lỗi
</script>
```

**Tại sao không thể trực tiếp sửa props?**

Hãy tưởng tượng: bạn mượn một cuốn sách từ thư viện (props), rồi vẽ bậy lên sách (sửa props). Những người khác mượn cuốn sách này (các component khác) cũng sẽ thấy những nét vẽ bậy của bạn, điều này dẫn đến hỗn loạn. Cách đúng là: nếu bạn cần sửa dữ liệu, hãy để component cha sửa, component con chỉ "yêu cầu sửa".

```vue
<!-- ✅ Cách làm đúng -->
<script setup>
const props = defineProps({
  count: { type: Number, default: 0 }
})

const emit = defineEmits(['update-count'])

// Yêu cầu component cha sửa qua sự kiện
const increment = () => {
  emit('update-count', props.count + 1)
}
</script>
```

---

## 3. Từ "hỗn độn" đến "có trật tự": Con đường tiến hóa của giao tiếp component

::: tip 🤔 Tại sao cần tiến hóa?
Khi dự án lớn dần, giao tiếp giữa các component sẽ ngày càng phức tạp. Hãy xem một team thực tế đã từng bước tiến hóa ra giải pháp quản lý state rõ ràng như thế nào.

Đây không chỉ là "nâng cấp công cụ", mà là **sự thay đổi toàn bộ cách tư duy** -- từ "truyền dữ liệu tùy tiện" đến "thiết kế luồng dữ liệu rõ ràng".
:::

### 3.1 Bức tranh toàn cảnh của sự tiến hóa

Bảng dưới đây thể hiện bốn giai đoạn tiến hóa của phương thức giao tiếp component, bạn có thể thấy vấn đề được giải quyết từng bước như thế nào:

| Giai đoạn | Phương thức giao tiếp | Vấn đề điển hình | Thay đổi cốt lõi |
|------|---------|----------|----------|
| **Giai đoạn 1: Truyền tự do** | Sửa trực tiếp, biến toàn cục | Dữ liệu không đồng bộ, khó debug | Không có quy phạm, truyền thế nào cũng được |
| **Giai đoạn 2: Props/Events** | Giao tiếp chuẩn cha-con | Props Drilling (truyền qua nhiều tầng) | Có quy phạm, nhưng lồng sâu rất phiền |
| **Giai đoạn 3: Thư viện quản lý state** | Vuex/Redux/Pinia | Chi phí học tập, boilerplate code | Dữ liệu quản lý tập trung, debug tiện |
| **Giai đoạn 4: Giải pháp hiện đại** | Composable/Atomic | Cần hiểu khái niệm mới | Linh hoạt hơn, gọn gàng hơn |

<EventBusDemo />

::: tip 📊 Bạn thấy gì từ bảng này?
Hãy đọc từng dòng của bảng này:

**Giai đoạn 1 → Giai đoạn 2**: Từ "không có quy phạm" đến "có quy phạm". Đây là bước nhảy vọt về chất -- bạn bắt đầu dùng props/events chuẩn để giao tiếp, luồng dữ liệu trở nên rõ ràng. Nhưng cái giá phải trả là khi hệ thống phân cấp component sâu, dữ liệu phải truyền từng tầng một, rất phiền (đây chính là Props Drilling).

**Giai đoạn 2 → Giai đoạn 3**: Từ "quản lý phân tán" đến "quản lý tập trung". Bạn bắt đầu dùng thư viện quản lý state như Vuex/Redux, đặt dữ liệu chia sẻ vào một "kho" toàn cục, tất cả component đều đọc ghi dữ liệu từ đây. Điều này giải quyết Props Drilling, nhưng chi phí học tập tăng lên.

**Giai đoạn 3 → Giai đoạn 4**: Từ "nặng nề" đến "nhẹ nhàng". Các giải pháp mới (như Composition API của Vue 3, Hooks của React) khiến quản lý state linh hoạt và gọn gàng hơn. Bạn không nhất thiết phải dùng store toàn cục, có thể kết hợp các đơn vị state nhỏ theo nhu cầu.

**Tóm lại**: Tiến hóa không chỉ là "đổi công cụ tốt hơn", mà là **nâng cấp toàn bộ cách tư duy** -- từ truyền dữ liệu tùy tiện, đến thiết kế luồng dữ liệu rõ ràng.
:::

### 3.2 Giai đoạn 1: Truyền tự do -- khởi đầu hỗn loạn

Tại sao gọi là "truyền tự do"? Bởi vì giai đoạn này không có bất kỳ quy phạm nào, dữ liệu muốn truyền thế nào cũng được -- biến toàn cục, sửa trực tiếp, event bus bay khắp nơi.

**Tình huống điển hình: Dữ liệu giỏ hàng phân tán khắp nơi**

```javascript
// Component trang chi tiết sản phẩm
export default {
  data() {
    return {
      localCart: []  // Tự duy trì một bản dữ liệu giỏ hàng
    }
  },
  methods: {
    addToCart(product) {
      this.localCart.push(product)
      // Cố gắng đồng bộ sang component khác
      window.cart = this.localCart  // ❌ Biến toàn cục!
    }
  }
}

// Component trang giỏ hàng
export default {
  data() {
    return {
      cartItems: []  // Lại một bản dữ liệu giỏ hàng nữa
    }
  },
  mounted() {
    // Cố gắng đọc từ biến toàn cục
    this.cartItems = window.cart || []  // ❌ Không đáng tin cậy!
  }
}

// Component header navigation
export default {
  data() {
    return {
      cartCount: 0  // Còn bản dữ liệu thứ ba!
    }
  },
  mounted() {
    // Polling kiểm tra thay đổi (thật vô lý)
    setInterval(() => {
      this.cartCount = window.cart?.length || 0
    }, 1000)  // ❌ Hiệu năng kém!
  }
}
```

**Đặc điểm của giai đoạn này:**
- ✅ **Ưu điểm**: Đơn giản trực tiếp, không có chi phí học tập
- ❌ **Nhược điểm**: Dữ liệu phân tán, khó đồng bộ, khó debug, một mớ hỗn độn

### 3.3 Giai đoạn 2: Props/Events -- thiết lập quy phạm

Sự hỗn loạn của truyền tự do khiến team nhận ra: **chúng ta cần quy phạm**. Thế là bắt đầu sử dụng phương thức giao tiếp chuẩn do framework cung cấp: props và events.

**Tình huống điển hình: Props Drilling (khoan sâu thuộc tính)**

```vue
<!-- Component tổ tiên: App.vue -->
<template>
  <div class="app">
    <!-- Truyền thông tin người dùng qua từng tầng -->
    <Layout :user-name="userName" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Layout from './Layout.vue'

const userName = ref('Trương Tam')
</script>
```

```vue
<!-- Tầng trung gian: Layout.vue -->
<template>
  <div class="layout">
    <Header :user-name="userName" />  <!-- Chỉ truyền, không dùng -->
    <Main>
      <Page :user-name="userName" />  <!-- Chỉ truyền, không dùng -->
    </Main>
  </div>
</template>

<script setup>
const props = defineProps({
  userName: String
})
</script>
```

```vue
<!-- Nơi thực sự cần: Header.vue -->
<template>
  <header>
    <span>{{ userName }}</span>  <!-- Cuối cùng cũng dùng đến -->
  </header>
</template>

<script setup>
const props = defineProps({
  userName: String
})
</script>
```

**Đặc điểm của giai đoạn này:**
- ✅ **Ưu điểm**: Luồng dữ liệu rõ ràng, một chiều, dễ hiểu
- ❌ **Nhược điểm**: Props Drilling (truyền qua từng tầng rất phiền), giao tiếp xuyên component khó khăn

::: tip 🤔 Props Drilling là gì?
Props Drilling chỉ việc: **dữ liệu phải đi qua nhiều component trung gian, truyền từng tầng một xuống, nhưng những component trung gian này không thực sự sử dụng dữ liệu đó**.

Như bạn muốn gửi chuyển phát nhanh cho người ở tầng 5, nhưng quy định bắt buộc mỗi tầng đều phải ký nhận một lần. Người ở tầng 1, 2, 3, 4 chỉ "chuyển giúp" chuyển phát nhanh, họ không cần món đồ đó, nhưng phải tham gia vào. Điều này rõ ràng rất phiền phức.
:::

### 3.4 Giai đoạn 3: Thư viện quản lý state -- quản lý tập trung

Nỗi đau của Props Drilling đã thúc đẩy sự ra đời của các thư viện quản lý state (Vuex, Redux, Pinia). Tư tưởng cốt lõi của chúng là: **đặt dữ liệu chia sẻ vào một "kho" toàn cục, tất cả component đều đọc ghi dữ liệu từ đây**.

**Tình huống điển hình: Dùng Pinia quản lý giỏ hàng**

```javascript
// stores/cart.js - State giỏ hàng toàn cục
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // Tất cả dữ liệu giỏ hàng tập trung ở đây
  const items = ref([])

  // Computed property: số lượng sản phẩm
  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  // Method: thêm sản phẩm
  const addItem = (product) => {
    const existing = items.value.find(item => item.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  return {
    items,
    itemCount,
    addItem
  }
})
```

```vue
<!-- Component trang chi tiết sản phẩm -->
<script setup>
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()

const addToCart = (product) => {
  cart.addItem(product)  // Gọi trực tiếp, không cần truyền từng tầng
}
</script>
```

```vue
<!-- Component header navigation -->
<template>
  <header>
    <span>Giỏ hàng ({{ cart.itemCount }})</span>
  </header>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()  // Đọc trực tiếp, tự động đồng bộ
</script>
```

**Đặc điểm của giai đoạn này:**
- ✅ **Ưu điểm**: Dữ liệu quản lý tập trung, giải quyết Props Drilling, công cụ debug mạnh mẽ
- ❌ **Nhược điểm**: Chi phí học tập, cần viết code bổ sung (boilerplate code), có thể over-engineering cho dự án đơn giản

### 3.5 Giai đoạn 4: Giải pháp hiện đại -- linh hoạt và gọn gàng

Thư viện quản lý state tuy mạnh mẽ, nhưng cũng có vấn đề "dùng đại bác bắn ruồi". Đối với dự án vừa và nhỏ, các giải pháp linh hoạt hơn, nhẹ hơn đã xuất hiện.

**Tình huống điển hình: Dùng Composable/Hooks tái sử dụng logic state**

```javascript
// composables/useCart.js - Logic giỏ hàng có thể tái sử dụng
import { ref, computed } from 'vue'

export function useCart() {
  const items = ref([])

  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const addItem = (product) => {
    const existing = items.value.find(item => item.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  return {
    items,
    itemCount,
    addItem
  }
}
```

```vue
<!-- Sử dụng trong bất kỳ component nào -->
<script setup>
import { useCart } from '@/composables/useCart'

// Mỗi lần gọi sẽ tạo một instance state mới
// Phù hợp cho state cục bộ trong nội bộ component
const { items, itemCount, addItem } = useCart()
</script>
```

**Đặc điểm của giai đoạn này:**
- ✅ **Ưu điểm**: Linh hoạt, nhẹ, có thể kết hợp, dùng theo nhu cầu
- ❌ **Nhược điểm**: Cần hiểu tư duy composition, chia sẻ xuyên component cần xử lý thêm

---

## 4. Phân tích chi tiết thư viện quản lý state: Vuex vs Pinia vs Redux

::: tip 🤔 Làm thế nào để chọn thư viện quản lý state?
Đối mặt với các thư viện quản lý state khác nhau, bạn có thể bối rối: rốt cuộc nên chọn cái nào?

Thực ra không có thư viện "tốt nhất", chỉ có "phù hợp nhất". Khi chọn hãy cân nhắc những yếu tố sau:
- **Bạn dùng framework gì?** Vue dùng Pinia, React dùng Redux/Zustand
- **Dự án lớn cỡ nào?** Dự án nhỏ dùng Composable, dự án lớn dùng thư viện quản lý state
- **Kinh nghiệm của team?** Chọn cái team quen thuộc, hoặc cái có chi phí học tập thấp

Nội dung tiếp theo sẽ giới thiệu chi tiết đặc điểm và tình huống sử dụng của các thư viện quản lý state chính.
:::

### 4.1 So sánh các thư viện quản lý state chính

| Đặc điểm | Redux | Vuex | Pinia | Zustand |
| :--- | :--- | :--- | :--- | :--- |
| **Framework áp dụng** | React | Vue | Vue | React |
| **Đường cong học tập** | Dốc | Trung bình | Thoải | Thoải |
| **Boilerplate code** | Nhiều | Trung bình | Ít | Rất ít |
| **TypeScript** | Tốt | Tốt | Xuất sắc | Xuất sắc |
| **Công cụ debug** | Mạnh mẽ | Tốt | Xuất sắc | Tốt |
| **Tình huống áp dụng** | Dự án lớn | Dự án Vue 2/3 vừa và lớn | Dự án Vue 3 mới | Dự án React vừa và nhỏ |

::: tip 📊 Bạn thấy gì từ bảng này?
Hãy đọc từng dòng của bảng này:

**Redux**: Thư viện quản lý state lâu đời trong hệ sinh thái React. Ưu điểm là quy phạm nghiêm ngặt, công cụ debug mạnh mẽ, nhưng nhược điểm là boilerplate code nhiều, đường cong học tập dốc. Phù hợp cho dự án lớn và team cần quy phạm nghiêm ngặt.

**Vuex**: Thư viện quản lý state chính thức thời Vue 2. Triết lý thiết kế tương tự Redux, nhưng phù hợp hơn với hệ thống reactive của Vue. Hiện tại vẫn có thể dùng, nhưng dự án mới khuyên dùng Pinia.

**Pinia**: Thư viện quản lý state thế hệ mới được Vue 3 khuyên dùng chính thức. Cú pháp gọn gàng, hỗ trợ TypeScript tốt, chi phí học tập thấp. **Đây là lựa chọn hàng đầu cho dự án Vue 3**.

**Zustand**: Thư viện quản lý state nhẹ trong hệ sinh thái React. API cực kỳ tối giản, hầu như không có boilerplate code. Phù hợp cho dự án React vừa và nhỏ.
:::

<StateManagementComparisonDemo />

### 4.2 Pinia thực chiến: Lựa chọn khuyên dùng cho Vue 3

Pinia là thư viện quản lý state được team Vue chính thức khuyên dùng, được thiết kế riêng cho Vue 3. Nó gọn gàng và dễ dùng hơn Vuex.

**Tại sao gọi là Pinia?**

Pinia là từ tiếng Tây Ban Nha có nghĩa là "quả dứa". Quả dứa là loại quả được tạo thành từ nhiều bông hoa nhỏ, mỗi bông hoa đều độc lập, nhưng tổng thể lại là một thể thống nhất. Điều này ẩn dụ chính xác cho triết lý thiết kế của Pinia -- **mỗi store là độc lập, nhưng có thể kết hợp sử dụng**.

**Khái niệm cốt lõi:**

::: details Xem ví dụ code đầy đủ
```javascript
// stores/user.js - Quản lý state người dùng
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 1. State: lưu trữ dữ liệu
  const userInfo = ref(null)
  const isLoggedIn = computed(() => !!userInfo.value)

  // 2. Actions: phương thức sửa dữ liệu
  const login = async (username, password) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    })
    const user = await response.json()
    userInfo.value = user  // Sửa trực tiếp, Pinia sẽ xử lý reactive
  }

  const logout = () => {
    userInfo.value = null
  }

  // 3. Getters: computed property
  const displayName = computed(() => {
    return userInfo.value?.name || 'Khách'
  })

  return {
    userInfo,
    isLoggedIn,
    login,
    logout,
    displayName
  }
})
```
:::

**Sử dụng trong component:**

```vue
<template>
  <div class="user-panel">
    <span v-if="user.isLoggedIn">Chào mừng, {{ user.displayName }}</span>
    <button v-if="user.isLoggedIn" @click="user.logout">Đăng xuất</button>
    <button v-else @click="showLoginDialog">Đăng nhập</button>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'

// Lấy store trực tiếp, tất cả nội dung đều reactive
const user = useUserStore()

const showLoginDialog = () => {
  // Hiển thị hộp thoại đăng nhập...
}
</script>
```

**Ưu điểm của Pinia:**

| Ưu điểm | Mô tả | So với Vuex |
|------|------|----------|
| **API gọn gàng** | Không cần mutations, sửa trực tiếp state | Vuex cần tách riêng mutations và actions |
| **Thân thiện TypeScript** | Suy luận kiểu tự nhiên, không cần cấu hình thêm | Vuex cần định nghĩa kiểu phức tạp |
| **Tự động module hóa** | Mỗi file store tự động thành module | Vuex cần cấu hình namespaced thủ công |
| **Dung lượng nhỏ hơn** | Sau khi build khoảng 1KB | Vuex khoảng 3KB |

<VuexPiniaDemo />

### 4.3 Redux thực chiến: Lựa chọn kinh điển cho React

Redux là thư viện quản lý state kinh điển nhất trong hệ sinh thái React, nổi tiếng với luồng dữ liệu một chiều nghiêm ngặt.

**Tại sao gọi là Redux?**

Redux là viết tắt của "Reduced Flux". Flux là mẫu kiến trúc ứng dụng do Facebook đề xuất thời kỳ đầu, Redux đã đơn giản hóa khái niệm của Flux, nên gọi là "Reduced Flux".

**Nguyên tắc cốt lõi:**

1. **Nguồn dữ liệu duy nhất**: State của toàn bộ ứng dụng được lưu trong một cây đối tượng
2. **State chỉ đọc**: Cách duy nhất để thay đổi state là kích hoạt action
3. **Sửa đổi bằng pure function**: Reducer phải là pure function

::: details Xem ví dụ code đầy đủ
```javascript
// 1. Định nghĩa Action Types
const ADD_TODO = 'ADD_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'

// 2. Định nghĩa Action Creators
const addTodo = (text) => ({
  type: ADD_TODO,
  payload: { id: Date.now(), text, completed: false }
})

const toggleTodo = (id) => ({
  type: TOGGLE_TODO,
  payload: { id }
})

// 3. Định nghĩa Reducer (pure function)
const initialState = {
  todos: []
}

const todoReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, action.payload]
      }
    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      }
    default:
      return state
  }
}

// 4. Tạo Store
import { createStore } from 'redux'
const store = createStore(todoReducer)
```
:::

**Sử dụng trong React:**

```jsx
import { useSelector, useDispatch } from 'react-redux'

function TodoList() {
  // Đọc state
  const todos = useSelector(state => state.todos)

  // Lấy hàm dispatch
  const dispatch = useDispatch()

  return (
    <ul>
      {todos.map(todo => (
        <li
          key={todo.id}
          onClick={() => dispatch(toggleTodo(todo.id))}
          style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
        >
          {todo.text}
        </li>
      ))}
    </ul>
  )
}
```

**Ưu nhược điểm của Redux:**

| Ưu điểm | Nhược điểm |
| :--- | :--- |
| Luồng dữ liệu nghiêm ngặt, dễ debug | Boilerplate code nhiều, đường cong học tập dốc |
| Debug time travel (Time Travel) | State đơn giản cũng cần viết nhiều code |
| Hệ sinh thái middleware phong phú | Không phù hợp dự án nhỏ |
| Cập nhật state có thể dự đoán | Cần hiểu khái niệm lập trình hàm |

<ReduxFlowDemo />

<MobxReactivityDemo />

<ZustandJotaiDemo />

---

## 5. Hướng dẫn thực chiến: Làm thế nào để thiết kế quản lý state?

::: tip 🤔 Khi nào cần thư viện quản lý state?
Không phải dự án nào cũng cần thư viện quản lý state. Trước khi引入, hãy tự hỏi mình vài câu:

1. **Có bao nhiêu component cần chia sẻ dữ liệu này?**
   - Nếu chỉ 2-3 component, dùng props/events là đủ
   - Nếu có 5+ component, cân nhắc thư viện quản lý state

2. **Dữ liệu này có thường xuyên thay đổi không?**
   - Nếu gần như không đổi (như thông tin người dùng), dùng Provide/Inject
   - Nếu thường xuyên thay đổi (như giỏ hàng), dùng thư viện quản lý state

3. **Quy mô team lớn cỡ nào?**
   - Cá nhân hoặc team nhỏ: giải pháp đơn giản là được
   - Team lớn: cần quy phạm nghiêm ngặt và công cụ debug mạnh mẽ

**Hãy nhớ: bắt đầu từ đơn giản, nâng cấp theo nhu cầu.**
:::

### 5.1 Nguyên tắc thiết kế state

Bất kể bạn chọn giải pháp quản lý state nào, đều nên tuân theo các nguyên tắc sau:

**Nguyên tắc 1: Nguồn dữ liệu duy nhất**

Cùng một dữ liệu chỉ nên được lưu ở một nơi. Đừng định nghĩa lặp lại cùng một dữ liệu trong nhiều component.

```javascript
// ❌ Sai: Dữ liệu phân tán khắp nơi
const ProductDetail = { cart: [] }
const CartPage = { items: [] }
const Header = { count: 0 }

// ✅ Đúng: Dữ liệu quản lý tập trung
const cartStore = { items: [] }  // Nguồn dữ liệu duy nhất
```

**Nguyên tắc 2: Immutability**

Khi sửa state, nên tạo đối tượng mới, thay vì sửa trực tiếp đối tượng cũ.

```javascript
// ❌ Sai: Sửa trực tiếp
state.items.push(newItem)

// ✅ Đúng: Tạo đối tượng mới
state.items = [...state.items, newItem]
```

**Nguyên tắc 3: State đưa lên trên, event truyền xuống dưới**

State chia sẻ nên được đặt trong component tổ tiên chung gần nhất hoặc store toàn cục, thay vì phân tán trong các component con.

```vue
<!-- ❌ Sai: State ở trong component con -->
<Parent>
  <Child :data="childData" @update="childData = $event" />
</Parent>

<!-- ✅ Đúng: State ở trong component cha -->
<Parent>
  <Child :data="parentData" @update="parentData = $event" />
</Parent>
```

### 5.2 Case study thực chiến: Thiết kế state giỏ hàng thương mại điện tử

Hãy vận dụng tổng hợp kiến thức phía trước, thiết kế một giải pháp quản lý state cho giỏ hàng thương mại điện tử.

**Phân tích yêu cầu:**

- Trang danh sách sản phẩm có thể thêm sản phẩm vào giỏ hàng
- Trang giỏ hàng có thể xem, sửa số lượng, xóa sản phẩm
- Header navigation hiển thị số lượng sản phẩm trong giỏ hàng
- Hỗ trợ chọn/bỏ chọn sản phẩm, tính tổng giá sản phẩm đã chọn
- Dữ liệu được persist vào localStorage

**Thiết kế state (Pinia):**

```javascript
// stores/cart.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // ============ State ============
  const items = ref([])  // Danh sách sản phẩm trong giỏ hàng
  const selectedIds = ref([])  // ID sản phẩm đã chọn

  // Khôi phục dữ liệu từ localStorage
  const initFromStorage = () => {
    const stored = localStorage.getItem('cart')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        items.value = data.items || []
        selectedIds.value = data.selectedIds || []
      } catch (e) {
        console.error('Đọc dữ liệu giỏ hàng thất bại:', e)
      }
    }
  }

  // Persist vào localStorage
  const persist = () => {
    localStorage.setItem('cart', JSON.stringify({
      items: items.value,
      selectedIds: selectedIds.value
    }))
  }

  // ============ Getters (computed property) ============
  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  const selectedItems = computed(() =>
    items.value.filter(item => selectedIds.value.includes(item.id))
  )

  const selectedTotalPrice = computed(() =>
    selectedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  // ============ Actions (method) ============
  const addItem = (product) => {
    const existing = items.value.find(item => item.id === product.id)
    if (existing) {
      existing.quantity += product.quantity || 1
    } else {
      items.value.push({
        ...product,
        quantity: product.quantity || 1
      })
    }
    persist()
  }

  const updateQuantity = (productId, quantity) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeItem(productId)
      } else {
        item.quantity = quantity
        persist()
      }
    }
  }

  const removeItem = (productId) => {
    items.value = items.value.filter(item => item.id !== productId)
    selectedIds.value = selectedIds.value.filter(id => id !== productId)
    persist()
  }

  const toggleSelection = (productId) => {
    const index = selectedIds.value.indexOf(productId)
    if (index > -1) {
      selectedIds.value.splice(index, 1)
    } else {
      selectedIds.value.push(productId)
    }
    persist()
  }

  // Khởi tạo
  initFromStorage()

  return {
    // State
    items,
    selectedIds,
    // Getters
    itemCount,
    totalPrice,
    selectedItems,
    selectedTotalPrice,
    // Actions
    addItem,
    updateQuantity,
    removeItem,
    toggleSelection
  }
})
```

**Sử dụng trong component:**

```vue
<!-- Trang chi tiết sản phẩm: ProductDetail.vue -->
<template>
  <div class="product-detail">
    <h2>{{ product.name }}</h2>
    <p class="price">¥{{ product.price }}</p>
    <button @click="addToCart">Thêm vào giỏ hàng</button>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const props = defineProps({
  product: Object
})

const cart = useCartStore()

const addToCart = () => {
  cart.addItem({
    id: props.product.id,
    name: props.product.name,
    price: props.product.price
  })
}
</script>
```

```vue
<!-- Header navigation: Header.vue -->
<template>
  <header class="header">
    <div class="logo">Cửa hàng của tôi</div>
    <nav>
      <RouterLink to="/">Trang chủ</RouterLink>
      <RouterLink to="/cart">
        Giỏ hàng ({{ cart.itemCount }})
      </RouterLink>
    </nav>
  </header>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()  // Dùng trực tiếp, tự động reactive
</script>
```

---

## 6. Những cái bẫy thường gặp và cách tránh

::: warning ⚠️ Những cái bẫy này, 90% người mới học đều sẽ mắc phải
Trong thực hành quản lý state, có một số lỗi đặc biệt phổ biến. Hãy để tôi tổng kết những cái bẫy thường gặp nhất và cách tránh chúng.
:::

### 6.1 Bẫy 1: Trực tiếp sửa Props hoặc State

**Code sai:**

```javascript
// ❌ Trực tiếp sửa props
props.user.name = 'Lý Tứ'

// ❌ Trực tiếp sửa state của Vuex
store.state.user.name = 'Lý Tứ'

// ❌ Trực tiếp sửa phần tử mảng
state.items[0].name = 'Tên mới'
```

**Tại sao không được?**

Các framework frontend (Vue/React) cần "theo dõi" sự thay đổi của dữ liệu để tự động cập nhật giao diện. Nếu bạn trực tiếp sửa đối tượng hoặc mảng, framework có thể không phát hiện được sự thay đổi, dẫn đến giao diện không cập nhật.

**Cách làm đúng:**

```javascript
// ✅ Vue 3 / Pinia: sửa trực tiếp thuộc tính顶层
store.user.name = 'Lý Tứ'  // Pinia sẽ tự động xử lý reactive

// ✅ Vue 2 / Vuex: thông qua mutation
mutations: {
  UPDATE_USER_NAME(state, newName) {
    state.user.name = newName
  }
}

// ✅ Sửa mảng: tạo mảng mới
state.items = state.items.map((item, index) =>
  index === 0 ? { ...item, name: 'Tên mới' } : item
)
```

### 6.2 Bẫy 2: Sửa state trong Getter

**Code sai:**

```javascript
// ❌ Sửa state trong getter
getters: {
  doubleCount(state) {
    state.count *= 2  // Side effect!
    return state.count
  }
}
```

**Tại sao không được?**

Getter phải là "pure function", chỉ phụ trách tính toán và trả về giá trị, không nên có bất kỳ side effect nào (sửa state). Nếu sửa state trong getter, sẽ dẫn đến vòng lặp vô hạn và vấn đề khó debug.

**Cách làm đúng:**

```javascript
// ✅ Getter chỉ tính toán, không sửa
getters: {
  doubleCount(state) {
    return state.count * 2
  }
}

// ✅ Nếu cần sửa, dùng action
actions: {
  doubleCountAndSave({ commit }) {
    commit('SET_DOUBLE_COUNT')
  }
}
```

### 6.3 Bẫy 3: Quên dọn dẹp event listener

**Code sai:**

```javascript
// ❌ Quên hủy subscribe
export default {
  created() {
    EventBus.$on('cart-updated', this.handleCartUpdate)
  }
  // Component đã bị hủy, nhưng listener vẫn còn!
}
```

**Tại sao không được?**

Nếu component đã bị hủy nhưng event listener vẫn còn, sẽ dẫn đến rò rỉ bộ nhớ (bộ nhớ bị chiếm dụng không thể giải phóng). Trong single-page application, người dùng liên tục chuyển trang, những listener không được dọn dẹp này sẽ tích tụ ngày càng nhiều, cuối cùng dẫn đến trang bị giật lag.

**Cách làm đúng:**

```javascript
// ✅ Hủy subscribe kịp thời
export default {
  created() {
    EventBus.$on('cart-updated', this.handleCartUpdate)
  },
  beforeUnmount() {  // Vue 3 dùng beforeUnmount, Vue 2 dùng beforeDestroy
    EventBus.$off('cart-updated', this.handleCartUpdate)
  }
}
```

### 6.4 Bẫy 4: Lạm dụng quản lý state

**Code sai:**

```javascript
// ❌ Bỏ tất cả state vào store
const store = useStore()
store.inputValue = 'Người dùng nhập'
store.isModalOpen = true
store.currentTab = 'profile'
```

**Tại sao không được?**

Không phải tất cả state đều cần bỏ vào store toàn cục. Nếu một state chỉ được dùng trong một component (như giá trị ô input, trạng thái mở/tắt của modal), để trong nội bộ component là được. Lạm dụng quản lý state sẽ khiến code trở nên phức tạp.

**Cách làm đúng:**

```javascript
// ✅ State cục bộ dùng quản lý nội bộ component
const inputValue = ref('')

// ✅ Chỉ state cần chia sẻ mới bỏ vào store
const userInfo = useUserStore()  // Nhiều component cần thông tin người dùng
const cart = useCartStore()  // Nhiều component cần dữ liệu giỏ hàng
```

---

## 7. Tổng kết và gợi ý

### 7.1 Ôn tập kiến thức cốt lõi

Hãy dùng một bảng để ôn tập các khái niệm cốt lõi của component hóa và quản lý state:

| Khái niệm | Giải thích một câu | Vấn đề giải quyết | Công cụ điển hình |
|------|-----------|-----------|----------|
| **Component hóa** | Chia giao diện thành các phần độc lập, có thể tái sử dụng | Tái sử dụng code, phân tách trách nhiệm | Component Vue/React |
| **Props** | Component cha truyền dữ liệu cho component con | Giao tiếp cha-con | Tích hợp sẵn Vue/React |
| **Events** | Component con thông báo cho component cha điều gì đã xảy ra | Giao tiếp con-cha | Tích hợp sẵn Vue/React |
| **State** | Dữ liệu lưu trong nội bộ component | Ghi nhớ trạng thái component | Tích hợp sẵn Vue/React |
| **Thư viện quản lý state** | Quản lý tập trung state chia sẻ toàn cục | Giao tiếp xuyên component, Props Drilling | Pinia, Redux, Zustand |
| **Nguồn dữ liệu duy nhất** | Cùng một dữ liệu chỉ lưu ở một nơi | Dữ liệu không nhất quán, khó đồng bộ | Nguyên tắc cốt lõi của thư viện quản lý state |

### 7.2 Gợi ý lựa chọn cho các tình huống khác nhau

| Tình huống | Giải pháp khuyên dùng | Lý do |
| :--- | :--- | :--- |
| **Giao tiếp component cha-con** | Props + Events | Tích hợp sẵn framework, đơn giản trực tiếp |
| **Truyền giá trị xuyên tầng** | Provide / Inject | Tránh truyền qua từng tầng |
| **State cục bộ trong component** | ref / useState | Đơn giản, không cần công cụ bổ sung |
| **Dự án Vue vừa** | Pinia | Chính thức khuyên dùng, chi phí học tập thấp |
| **Dự án React vừa** | Zustand | Cực kỳ tối giản, không boilerplate code |
| **Dự án Vue lớn** | Pinia + quy phạm | Linh hoạt và có thể mở rộng |
| **Dự án React lớn** | Redux Toolkit | Quy phạm nghiêm ngặt, hệ sinh thái phong phú |
| **Tái sử dụng logic xuyên component** | Composable / Hooks | Linh hoạt, có thể kết hợp |

### 7.3 Gợi ý học tập

**Đối với người mới bắt đầu:**

1. **Nắm vững cơ bản trước**: Hiểu các khái niệm cơ bản như props, events, state
2. **Bắt đầu từ dự án nhỏ**: Đừng vội vàng dùng thư viện quản lý state ngay từ đầu
3. **Viết nhiều code**: Học lý thuyết nhiều đến mấy, không bằng thực hành

**Đối với người đã có kinh nghiệm:**

1. **Đọc source code**: Hiểu nguyên lý hoạt động của Pinia/Redux
2. **Học pattern**: Hiểu các design pattern phổ biến (như Observer pattern, Pub-Sub pattern)
3. **Quan tâm hệ sinh thái**: Học các công cụ liên quan (như DevTools, middleware)

**Hãy nhớ những nguyên tắc cốt lõi này:**

1. **Bắt đầu từ đơn giản**: Đừng引入 quá sớm thư viện quản lý state phức tạp
2. **Nguồn dữ liệu duy nhất**: Tránh cùng một dữ liệu được lưu ở nhiều nơi
3. **Immutability**: Khi sửa state hãy tạo đối tượng mới, thay vì sửa trực tiếp
4. **Chọn theo nhu cầu**: Chọn giải pháp phù hợp dựa trên quy mô dự án và tình hình team

Hy vọng bài viết này giúp bạn xây dựng được nhận thức tổng thể về component hóa và quản lý state. Khi bạn gặp vấn đề luồng dữ liệu phức tạp trong dự án thực tế, bạn sẽ biết bắt đầu từ đâu, thiết kế thế nào, triển khai ra sao.
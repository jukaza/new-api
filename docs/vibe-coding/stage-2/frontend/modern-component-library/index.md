# Sử dụng thư viện component hiện đại để cập nhật giao diện

Trong các bài học trước, bạn đã học cách sử dụng công cụ thiết kế để vẽ giao diện, dùng AI IDE để chuyển bản thiết kế thành code, thậm chí hoàn thành một dự án frontend hoàn chỉnh. Nhưng bạn cũng có thể phát hiện ra một vấn đề: các nút bấm, biểu mẫu, hộp thoại tự viết từ đầu tuy dùng được nhưng总觉得 thiếu chút gì so với "sản phẩm chuyên nghiệp" — phong cách không đủ thống nhất, chi tiết tương tác không đủ mượt mà, thích ứng với các màn hình khác nhau cũng rất đau đầu.

Đó chính là vấn đề mà **thư viện component** giải quyết.

Thư viện component là một tập hợp các linh kiện UI đã được thiết kế và phát triển sẵn. Nút bấm, ô nhập liệu, menu thả xuống, hộp thoại, bảng dữ liệu... các phần tử giao diện mà bạn sẽ sử dụng lặp đi lặp lại trong bất kỳ sản phẩm nào, thư viện component đã làm sẵn cho bạn, và đã được kiểm chứng và tinh chỉnh bởi nhiều người dùng. Bạn chỉ cần lắp ghép chúng lại như chơi xếp hình là có thể nhanh chóng xây dựng giao diện cấp chuyên nghiệp.

## Bạn sẽ học được

1. Hiểu thư viện component frontend là gì, và tại sao phát triển hiện đại gần như đều sử dụng nó
2. Làm quen với bốn thư viện component tiêu biểu nhất, hiểu các kịch bản mà mỗi thư viện擅长
3. Thông qua ba kịch bản thực chiến (landing page, trang sản phẩm, quản lý back-office), học cách sử dụng AI IDE + thư viện component để Vibe Coding
4. Học cách đọc tài liệu thư viện component, tìm và sử dụng component phù hợp theo nhu cầu

## 1. Tại sao cần thư viện component?

Hãy tưởng tượng bạn đang trang trí nhà. Bạn có thể tự làm một chiếc ghế từ gỗ, nhưng cách phổ biến hơn là đến IKEA mua một chiếc — thiết kế đẹp, chất lượng ổn định, hướng dẫn sử dụng rõ ràng, mang về lắp ráp là xong.

Thư viện component chính là "IKEA" trong phát triển frontend. Nó cung cấp không phải đồ nội thất, mà là linh kiện giao diện:

| Tự viết tay | Sử dụng thư viện component |
| :--- | :--- |
| Cần tự xử lý phong cách, tương tác, animation | Sử dụng ngay, phong cách và tương tác đã được tinh chỉnh |
| Nút bấm trên các trang khác nhau có thể trông khác nhau | Phong cách toàn cục thống nhất, tự động duy trì tính nhất quán |
| Thích ứng điện thoại, máy tính bảng cần thêm việc | Hầu hết thư viện component đã tích hợp hỗ trợ responsive |
| Truy cập vô障碍 dễ bị sót | Thư viện component chuyên nghiệp đã xử lý điều hướng bàn phím, trình đọc màn hình, v.v. |
| Tốc độ phát triển chậm | Tốc độ phát triển nhanh, tập trung vào logic nghiệp vụ |

Nói đơn giản: **Thư viện component giúp bạn dành thời gian cho "làm gì", chứ không phải "vẽ thế nào".**

### Trăm nghe không bằng một thấy: cùng một yêu cầu, khoảng cách giữa có và không có thư viện component

Nói suông không có tính thuyết phục. Chúng ta sử dụng yêu cầu gần như giống nhau trong Trae, lần lượt không chỉ định và chỉ định thư viện component, xem khoảng cách kết quả tạo ra.

**Prompt 1: Không sử dụng thư viện component**

```text
Vui lòng giúp tôi tạo một trang bảng điều khiển dữ liệu trợ lý viết AI, bao gồm:
- Thanh tiêu đề trên cùng và nút xuất
- Bốn thẻ thống kê hiển thị số người dùng, người dùng hoạt động, số tài liệu, doanh thu, còn phải hiển thị xu hướng tăng/giảm
- Một biểu đồ đường và một biểu đồ tròn
- Bảng danh sách người dùng, có chức năng phân trang
- Thanh điều hướng侧边栏 bên trái
```

**Prompt 2: Sử dụng thư viện component shadcn/ui**

```text
Vui lòng giúp tôi tạo một trang bảng điều khiển dữ liệu trợ lý viết AI, sử dụng thư viện component shadcn/ui, bao gồm:
- Thanh tiêu đề trên cùng và nút xuất
- Bốn thẻ thống kê hiển thị số người dùng, người dùng hoạt động, số tài liệu, doanh thu, còn phải hiển thị xu hướng tăng/giảm
- Một biểu đồ đường và một biểu đồ tròn
- Bảng danh sách người dùng, có chức năng phân trang
- Thanh điều hướng侧边栏 bên trái
```

Cùng một yêu cầu, điểm khác biệt duy nhất là thêm `shadcn/ui + Tailwind CSS` ở đầu prompt, kết quả Trae tạo ra về tính nhất quán thị giác, chi tiết tương tác, mức độ hoàn thiện tổng thể hoàn toàn không ở cùng một cấp độ. Đây chính là "nâng cấp miễn phí" mà thư viện component mang lại — bạn chỉ cần thêm tên thư viện component vào prompt.

## 2. Làm quen với bốn thư viện component cốt lõi

Số lượng thư viện component rất nhiều (xem danh sách đầy đủ tại [Phụ lục](#phụ-lục-thêm-thư-viện-component)), nhưng bạn chỉ cần làm quen với bốn thư viện tiêu biểu nhất:

| Thư viện component | Framework | Định vị một câu | Trang chủ |
| :--- | :--- | :--- | :--- |
| [Ant Design](https://ant.design) | React | Sản phẩm bởi Ant Group, tiêu chuẩn thực tế cho back-office doanh nghiệp cấp trung, độ bao phủ component cực kỳ rộng | ant.design |
| [shadcn/ui](https://ui.shadcn.com) | React | Không cài npm package, sao chép code trực tiếp vào dự án của bạn, dựa trên Tailwind CSS, mức độ tùy chỉnh tự do cao nhất | ui.shadcn.com |
| [HeroUI](https://heroui.com) (trước đây là NextUI) | React | Phong cách mặc định tinh xảo, animation mượt mà, phù hợp landing page và showcase sản phẩm có yêu cầu cao về chất lượng thị giác | heroui.com |
| [Material UI](https://mui.com) | React | Thư viện component React lâu đời nhất, triển khai quy phạm Google Material Design, hệ sinh thái trưởng thành nhất | mui.com |

> Người dùng Vue cũng có nhiều lựa chọn phong phú: [Element Plus](https://element-plus.org) (phổ biến nhất tại Trung Quốc), [Ant Design Vue](https://antdv.com), [Naive UI](https://www.naiveui.com), v.v., xem chi tiết tại [Phụ lục](#phụ-lục-thêm-thư-viện-component).

Các thư viện component khác nhau擅长 các kịch bản khác nhau. Tiếp theo chúng ta sẽ thông qua ba kịch bản phát triển thực tế, dẫn dắt bạn trải nghiệm cách sử dụng AI IDE + thư viện component để Vibe Coding.

Để thể hiện phong cách và đặc điểm của các thư viện component khác nhau, chúng ta cố tình chọn thư viện khác nhau trong mỗi kịch bản. Nhưng xin lưu ý: **Điều này chỉ là để bạn làm quen với nhiều phương án hơn**, trong phát triển thực tế bạn hoàn toàn có thể chỉ sử dụng thư viện bạn quen tay nhất. Ví dụ bạn thích phong cách shadcn/ui, dùng nó làm landing page, trang sản phẩm, quản lý back-office đều không vấn đề. Chọn một thư viện bạn thấy đẹp và dùng thoải mái là quan trọng nhất.

## 3. Thực chiến 1: Xây dựng landing page sản phẩm bằng HeroUI

**Kịch bản**: Bạn đã làm một sản phẩm trợ lý viết AI, cần một landing page đẹp để thể hiện tính năng sản phẩm, thu hút người dùng đăng ký. Landing page cần sức mạnh thị giác cao, animation mượt mà, trên điện thoại cũng phải đẹp.

**Tại sao chọn HeroUI**: Phong cách mặc định của HeroUI đã rất tinh xảo, tự kèm animation chuyển tiếp mượt mà, rất phù hợp các trang showcase hướng đến người dùng.

### 3.1 Tạo dự án

```bash
# Sử dụng CLI chính thức của HeroUI để tạo dự án
npx create-heroui-app@latest ai-writer-landing
cd ai-writer-landing
npm install
```

### 3.2 Sử dụng AI IDE để tạo landing page

Mở AI IDE (Cursor, Trae, v.v.), nhập vào hộp thoại:

```text
Vui lòng giúp tôi tạo một landing page trợ lý viết AI, sử dụng thư viện component HeroUI:

**Cấu trúc trang:**
1. Thanh điều hướng trên cùng: bên trái đặt Logo và tên sản phẩm, bên phải đặt ba liên kết "Tính năng", "Bảng giá", "Về chúng tôi", thêm nút "Bắt đầu sử dụng"
2. Khu vực首屏: tiêu đề lớn viết "Để AI trở thành đối tác viết của bạn", phụ đề giới thiệu giá trị sản phẩm, hai nút "Dùng thử miễn phí" và "Xem demo", bên dưới đặt ảnh chụp màn hình sản phẩm
3. Triển khai tính năng: ba cột thẻ, lần lượt giới thiệu ba tính năng "Tiếp tục viết thông minh", "Điều chỉnh phong cách", "Dịch đa ngôn ngữ", mỗi thẻ phải có icon, tiêu đề, mô tả
4. Khu vực bảng giá: ba thẻ bảng giá (bản miễn phí, bản chuyên nghiệp, bản nhóm), bản chuyên nghiệp cần hiển thị nổi bật khuyến nghị
5. Khu vực kêu gọi hành động dưới cùng: một câu văn bản hấp dẫn, thêm nút đăng ký
6. Chân trang: thông tin bản quyền và liên kết mạng xã hội

**Yêu cầu thiết kế:**
- Nhìn phải hiện đại, chuyên nghiệp
- Hỗ trợ chế độ tối
- Trên điện thoại cũng phải đẹp
```

### 3.3 Các component cốt lõi mà AI sẽ sử dụng

```jsx
import {
  Navbar, NavbarBrand, NavbarContent, NavbarItem,
  Button,
  Card, CardHeader, CardBody, CardFooter,
  Divider,
  Link,
  Chip
} from '@heroui/react'
```

| Component | Mục đích | Vị trí trong landing page |
| :--- | :--- | :--- |
| `Navbar` | Thanh điều hướng trên cùng | Phía trên cùng trang, cố định không di chuyển |
| `Button` | Nút bấm, hỗ trợ nhiều biến thể và màu sắc | Nút CTA, nút điều hướng |
| `Card` | Container thẻ | Triển khai tính năng, thẻ bảng giá |
| `Chip` | Nhãn nhỏ | Đánh dấu "Khuyến nghị", "Phổ biến nhất" |
| `Divider` | Đường phân cách | Phân cách thị giác giữa các khu vực |

### 3.4 Lặp và tối ưu

Code phiên bản đầu tạo ra có thể không hoàn toàn hài lòng, tiếp tục đối thoại với AI để điều chỉnh:

```text
Vui lòng giúp tôi tối ưu landing page:

1. Tiêu đề lớn thêm gradient màu, từ xanh chuyển sang tím
2. Thẻ tính năng khi di chuột vào có animation nổi lên
3. Thẻ bảng giá bản chuyên nghiệp cần hiển thị nổi bật, thêm viền và nhãn "Phổ biến nhất"
4. Điều hướng trên điện thoại改成 menu hamburger (kiểu ba dấu gạch ngang)
```

> **Cốt lõi của Vibe Coding**: Bạn không cần nhớ API của mỗi component, chỉ cần mô tả hiệu quả bạn muốn bằng ngôn ngữ tự nhiên, AI sẽ giúp bạn tìm component và cách viết phù hợp. Khi gặp chỗ không hài lòng, tiếp tục đối thoại lặp là được.

## 4. Thực chiến 2: Xây dựng trang sản phẩm bằng shadcn/ui

**Kịch bản**: Trợ lý viết AI của bạn cần một giao diện chính sau khi người dùng đăng nhập — bên trái là danh sách tài liệu, bên phải là trình soạn thảo, trên cùng có thanh công cụ. Đây là một trang sản phẩm kiểu chức năng, cần UI có thể tùy chỉnh cao.

**Tại sao chọn shadcn/ui**: shadcn/ui đặt code component trực tiếp vào dự án của bạn, bạn có thể tự do chỉnh sửa bất kỳ chi tiết nào. Đối với giao diện sản phẩm cần tùy chỉnh sâu, chế độ "sở hữu code" này linh hoạt nhất.

### 4.1 Tạo dự án

```bash
# Tạo dự án Next.js
npx create-next-app@latest ai-writer-app --typescript --tailwind --app
cd ai-writer-app

# Khởi tạo shadcn/ui
npx shadcn@latest init

# Thêm component theo nhu cầu (không cài tất cả cùng lúc)
npx shadcn@latest add button card input sidebar sheet dialog
```

Điểm độc đáo của shadcn/ui: mỗi lần `add` một component, nó sẽ sao chép mã nguồn vào thư mục `components/ui/` của dự án bạn. Bạn có thể mở trực tiếp các tệp này để chỉnh sửa phong cách và hành vi.

### 4.2 Sử dụng AI IDE để tạo giao diện sản phẩm

```text
Vui lòng giúp tôi tạo giao diện chính trợ lý viết AI, sử dụng thư viện component shadcn/ui:

**Bố cục tổng thể:**
- Bên trái là侧边栏 có thể thu gọn,宽度 khoảng 280px:
  - Trên cùng đặt nút "Tài liệu mới"
  - Bên dưới là danh sách tài liệu, mỗi tài liệu hiển thị tiêu đề và thời gian chỉnh sửa cuối
  - Nhấp chuột phải vào tài liệu có thể đổi tên hoặc xóa
- Bên phải là khu vực soạn thảo chính, chia thành hai phần trên dưới:
  - Phần trên là thanh công cụ: có thể chỉnh sửa tiêu đề tài liệu, hiển thị thống kê số từ, nút "AI tiếp tục viết", menu thả xuống "Xuất"
  - Phần dưới là khu vực soạn thảo: một ô nhập văn bản lớn, chiếm đầy không gian còn lại

**Chi tiết tương tác:**
- Sau khi nhấp "AI tiếp tục viết", nút hiển thị trạng thái loading, dưới cùng trình soạn thảo xuất hiện văn bản do AI tạo (hiển thị từng chữ như máy đánh chữ)
- Trên điện thoại侧边栏 thành kiểu drawer, trượt ra từ bên trái
- Tài liệu đang chọn cần highlight
```

### 4.3 Các component cốt lõi mà AI sẽ sử dụng

```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from '@/components/ui/sheet'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader
} from '@/components/ui/sidebar'
```

| Component | Mục đích | Vị trí trong trang sản phẩm |
| :--- | :--- | :--- |
| `Sidebar` |侧边栏 có thể thu gọn | Danh sách tài liệu bên trái |
| `Sheet` | Drawer thiết bị di động | Thay thế侧边栏 trên thiết bị di động |
| `DropdownMenu` | Menu thả xuống | Nút "Xuất", menu chuột phải |
| `Dialog` | Hộp thoại | Đổi tên, xác nhận xóa |
| `Button` | Nút bấm, hỗ trợ variant và loading | Các nút thao tác khác nhau |
| `Input` | Ô nhập liệu | Chỉnh sửa tiêu đề tài liệu |

### 4.4 Tùy chỉnh phong cách component

Ưu điểm của shadcn/ui là bạn có thể chỉnh sửa trực tiếp mã nguồn component. Ví dụ bạn muốn tăng bo góc nút:

```text
Vui lòng giúp tôi chỉnh sửa components/ui/button.tsx,
thay bo góc mặc định của tất cả nút từ rounded-md thành rounded-xl,
và thêm hiệu ứng bóng mờ tinh tế cho biến thể primary
```

AI sẽ chỉnh sửa trực tiếp tệp component trong dự án của bạn, chứ không ghi đè phong cách npm package — đây chính là lợi ích của "sở hữu code" shadcn/ui.

## 5. Thực chiến 3: Xây dựng giao diện quản lý back-office bằng Ant Design

**Kịch bản**: Sau khi trợ lý viết AI của bạn lên mạng, cần một back-office quản trị để xem dữ liệu người dùng, quản lý nội dung tài liệu, xử lý đơn hàng thanh phí. Cốt lõi của hệ thống quản lý back-office là hiển thị dữ liệu và hiệu quả thao tác.

**Tại sao chọn Ant Design**: Ant Design có tích lũy sâu nhất trong lĩnh vực back-office cấp trung, các component nghiệp vụ như bảng, biểu mẫu, biểu đồ sử dụng ngay, tích hợp nhiều mô hình tương tác cấp doanh nghiệp (thao tác hàng loạt, lọc nâng cao, xuất dữ liệu, v.v.).

### 5.1 Tạo dự án

```bash
# Sử dụng scaffolding Ant Design Pro (tích hợp bố cục, định tuyến, phân quyền)
npx create-umi@latest ai-writer-admin
# Chọn mẫu Ant Design Pro
cd ai-writer-admin
npm install
```

Hoặc bắt đầu từ đầu:

```bash
npx create-react-app ai-writer-admin --template typescript
cd ai-writer-admin
npm install antd @ant-design/icons @ant-design/pro-components
```

### 5.2 Sử dụng AI IDE để tạo back-office quản trị

```text
Vui lòng giúp tôi tạo back-office quản trị trợ lý viết AI, sử dụng thư viện component Ant Design:

**Bố cục tổng thể:**
- Bên trái là thanh menu: bảng điều khiển, quản lý người dùng, quản lý tài liệu, quản lý đơn hàng, cài đặt hệ thống
- Trên cùng hiển thị điều hướng breadcrumb

**Trang quản lý người dùng:**
- Trên cùng đặt bốn thẻ thống kê: tổng số người dùng,新增 hôm nay, số người dùng hoạt động, số người dùng trả phí
- Khu vực tìm kiếm lọc: có thể tìm theo tên người dùng, chọn phạm vi thời gian đăng ký, lọc trạng thái người dùng, còn có nút "Tìm kiếm" và "Đặt lại"
- Bảng người dùng:
  - Hiển thị avatar, tên người dùng, email, thời gian đăng ký, gói đăng ký (phân biệt bằng nhãn màu khác nhau), trạng thái, thao tác
  - Mỗi trang hiển thị 20 dòng, hỗ trợ phân trang
  - Có thể chọn hàng loạt người dùng, vô hiệu hóa hoặc xuất hàng loạt
  - Cột thao tác: xem chi tiết, chỉnh sửa, vô hiệu hóa (cần xác nhận lần hai trước khi vô hiệu hóa)
- Nhấp "Xem chi tiết" trượt ra drawer từ bên phải, hiển thị thông tin chi tiết người dùng và danh sách tài liệu gần đây
```

### 5.3 Các component cốt lõi mà AI sẽ sử dụng

```tsx
import { PageContainer, ProLayout } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { StatisticCard } from '@ant-design/pro-components'
import {
  Button, Tag, Badge, Space, Drawer,
  Popconfirm, message, Modal
} from 'antd'
import {
  UserOutlined, SearchOutlined, ExportOutlined
} from '@ant-design/icons'
```

| Component | Mục đích | Vị trí trong back-office |
| :--- | :--- | :--- |
| `ProLayout` | Khung bố cục tổng thể back-office | Khung xương trang (menu + khu vực nội dung) |
| `ProTable` | Bảng nâng cao, tích hợp tìm kiếm, phân trang, cài đặt cột | Danh sách người dùng, danh sách tài liệu, danh sách đơn hàng |
| `StatisticCard` | Thẻ thống kê dữ liệu | Bảng điều khiển, tổng quan phía trên trang |
| `Tag` / `Badge` | Nhãn trạng thái | Gói đăng ký, trạng thái người dùng |
| `Drawer` | Drawer侧边 | Chi tiết người dùng, biểu mẫu chỉnh sửa |
| `Popconfirm` | Hộp xác nhận bubble | Xóa, vô hiệu hóa và các thao tác nguy hiểm khác |

### 5.4 Tiếp tục lặp: Thêm bảng điều khiển

```text
Vui lòng giúp tôi tạo một trang bảng điều khiển:

1. Bốn thẻ thống kê phía trên: tổng số người dùng, tổng số tài liệu, số lần gọi API hôm nay, doanh thu hàng tháng, mỗi thẻ hiển thị giá trị và thay đổi tuần hoàn (tăng hay giảm)
2. Giữa đặt hai biểu đồ:
   - Bên trái: biểu đồ đường tăng trưởng người dùng 7 ngày gần nhất
   - Bên phải: biểu đồ tròn phân bố gói đăng ký
3. Phía dưới: bảng nhật ký thao tác gần đây, hiển thị thời gian, người dùng, loại thao tác, chi tiết

Sử dụng component Ant Design để bố cục, biểu đồ có thể sử dụng Ant Design Charts
```

> **Kỹ巧 Vibe Coding cho quản lý back-office**: Cấu trúc trang back-office tương đối cố định (bảng + tìm kiếm +弹窗), rất phù hợp để AI tạo hàng loạt. Bạn có thể để AI tạo trước một trang "Quản lý người dùng" làm mẫu, sau đó nói "Tham khảo cấu trúc trang quản lý người dùng, giúp tôi tạo trang quản lý tài liệu", AI sẽ tái sử dụng cùng một mô hình bố cục.

## 6. Học cách đọc tài liệu: "Hướng dẫn sử dụng" của thư viện component

Trong Vibe Coding, AI sẽ giúp bạn viết hầu hết code, nhưng khi kết quả AI tạo ra không chính xác, hoặc bạn muốn tinh chỉnh hành vi của một component, **đọc tài liệu** là cách giải quyết nhanh nhất.

Lấy Ant Design làm ví dụ, địa chỉ tài liệu của nó là: `https://ant.design/components/overview-cn`

Quy trình chuẩn để đọc tài liệu:

1. **Xác định nhu cầu**: Ví dụ "Tôi cần bảng hỗ trợ chọn hàng"
2. **Tìm trong tài liệu**: Tìm "Table" để vào trang component bảng
3. **Xem ví dụ**: Mỗi component trong tài liệu đều có nhiều ví dụ trực tuyến, tìm ví dụ "Có thể chọn"
4. **Sao chép code**: Sao chép code ví dụ vào dự án của bạn
5. **Xem bảng API**: Tìm cấu hình đầy đủ của thuộc tính `rowSelection` ở cuối trang

> Bạn cũng có thể gửi trực tiếp liên kết tài liệu cho AI IDE: "Vui lòng tham khảo API rowSelection của https://ant.design/components/table-cn, giúp tôi thêm chức năng chọn hàng loạt cho bảng người dùng". Cung cấp liên kết tài liệu cho AI, code tạo ra sẽ chính xác hơn.

Tra cứu nhanh địa chỉ tài liệu các thư viện component:

| Thư viện component | Địa chỉ tài liệu |
| :--- | :--- |
| Ant Design | `https://ant.design/components/overview-cn` |
| shadcn/ui | `https://ui.shadcn.com/docs/components` |
| HeroUI | `https://heroui.com/docs/components` |
| Material UI | `https://mui.com/material-ui/all-components/` |
| Element Plus | `https://element-plus.org/zh-CN/component/overview.html` |

## 7. Tóm tắt

Ba kịch bản thực chiến bao phủ các nhu cầu phát triển frontend phổ biến nhất:

| Kịch bản | Thư viện component khuyến nghị | Đặc điểm cốt lõi |
| :--- | :--- | :--- |
| Landing page / Trang showcase | HeroUI | Phong cách mặc định tinh xảo, animation mượt mà, sức mạnh thị giác mạnh |
| Trang chức năng sản phẩm | shadcn/ui | Code hoàn toàn có thể kiểm soát, tùy chỉnh sâu linh hoạt |
| Hệ thống quản lý back-office | Ant Design | Component nghiệp vụ phong phú, bảng biểu mẫu sử dụng ngay |

Tóm tắt quy trình làm việc Vibe Coding:

1. Chọn thư viện component phù hợp theo kịch bản
2. Sử dụng AI IDE để mô tả cấu trúc trang và tương tác bạn muốn
3. AI tạo code phiên bản đầu, bạn xem trước hiệu quả
4. Tiếp tục lặp và điều chỉnh bằng ngôn ngữ tự nhiên
5. Khi gặp vấn đề chi tiết, tra cứu tài liệu thư viện component

### Bài tập

Chọn một trong các kịch bản sau, sử dụng AI IDE + thư viện component để hoàn thành từ đầu:

1. Sử dụng HeroUI để tạo một landing page showcase cho dự án bạn đã làm trước đó (ví dụ chân dung Hogwarts)
2. Sử dụng shadcn/ui để xây dựng giao diện chính của ứng dụng ghi chú (侧边栏 + trình soạn thảo)
3. Sử dụng Ant Design để xây dựng một back-office quản lý nội dung đơn giản (danh sách bài viết + biểu mẫu tạo bài viết mới)

---

## Phụ lục: Thêm thư viện component

Ngoài bốn thư viện cốt lõi được giới thiệu trong phần chính, hệ sinh thái frontend còn có nhiều thư viện component xuất sắc. Dưới đây liệt kê theo framework phân loại, tiện cho bạn lựa chọn theo nhu cầu dự án.

### Hệ sinh thái Vue

| Thư viện component | Stars | Giới thiệu | Kịch bản sử dụng |
| :--- | :--- | :--- | :--- |
| [Element Plus](https://element-plus.org) | ~27k | Thư viện component doanh nghiệp Vue 3 do团队饿了么 phát triển, phổ biến nhất tại Trung Quốc, hệ sinh thái tiếng Trung tuyệt vời | Hệ thống quản lý back-office cấp trung |
| [Vuetify](https://vuetifyjs.com) | ~41k | Thư viện component Vue Material Design phổ biến nhất, 80+ component, tài liệu hoàn thiện | Dự án phong cách thiết kế Google |
| [Ant Design Vue](https://antdv.com) | ~21k | Thư viện component Vue 3 dựa trên hệ thống thiết kế Ant, quy phạm thiết kế thống nhất | Back-office doanh nghiệp cấp trung |
| [Naive UI](https://www.naiveui.com) | ~18k | Viết bằng TypeScript, tính tùy chỉnh theme cực mạnh, không phụ thuộc CSS preprocessor | Dự án có yêu cầu thiết kế độc đáo |
| [Quasar](https://quasar.dev) | ~27k | Một bộ code xây dựng ứng dụng SPA, SSR, PWA, thiết bị di động và desktop | Dự án cross-platform |
| [Vant](https://vant-ui.github.io/vant) | ~24k | Thư viện component mobile nhẹ do团队有赞 phát triển, bao phủ các nhu cầu thương mại điện tử phổ biến | Trang H5 mobile |
| [PrimeVue](https://primevue.org) | ~14k | 90+ component, hỗ trợ nhiều theme (Material, Bootstrap, v.v.) | Cần component phong phú và đa theme |
| [Arco Design Vue](https://arco.design/vue) | ~3k | Sản phẩm bởi ByteDance, chất lượng component cao, tích hợp chế độ tối | Sản phẩm back-office cấp trung |
| [TDesign Vue Next](https://tdesign.tencent.com/vue-next) | ~2k | Sản phẩm bởi Tencent, ngôn ngữ thiết kế thống nhất, bao phủ các kịch bản phổ biến desktop | Hệ sinh thái Tencent hoặc dự án doanh nghiệp |

### Hệ sinh thái React

| Thư viện component | Stars | Giới thiệu | Kịch bản sử dụng |
| :--- | :--- | :--- | :--- |
| [Material UI (MUI)](https://mui.com) | ~95k | Triển khai quy phạm Google Material Design lâu đời nhất, component toàn diện nhất, hệ sinh thái trưởng thành nhất | Xây dựng nhanh ứng dụng doanh nghiệp |
| [Ant Design](https://ant.design) | ~94k | Sản phẩm bởi Ant Group, tích hợp nhiều component nghiệp vụ chất lượng cao, vị thế chủ đạo cộng đồng developer tiếng Trung | Back-office doanh nghiệp cấp trung |
| [shadcn/ui](https://ui.shadcn.com) | ~83k | Code sao chép vào dự án chứ không cài npm, dựa trên Radix UI + Tailwind CSS, hoàn toàn có thể kiểm soát | Dự án cần tùy chỉnh cao |
| [Chakra UI](https://chakra-ui.com) | ~39k | Lấy trải nghiệm developer làm cốt lõi, API简洁, tích hợp hỗ trợ truy cập vô障碍 | Phát triển nguyên mẫu nhanh |
| [Mantine](https://mantine.dev) | ~28k | 100+ component và 50+ hooks, bao gồm date picker, rich text editor và các component nâng cao khác | Cần giải pháp全功能 sử dụng ngay |
| [Headless UI](https://headlessui.com) | ~27k | Thư viện component không phong cách chính thức bởi Tailwind Labs, đồng thời hỗ trợ React và Vue | Sử dụng kết hợp với Tailwind CSS |
| [HeroUI](https://heroui.com) | ~24k | Dựa trên Tailwind CSS + React Aria, phong cách mặc định tinh xảo, animation mượt mà | Dự án theo đuổi chất lượng thị giác |
| [Radix UI](https://www.radix-ui.com) | ~17k | Thư viện primitive component không phong cách底层的, tập trung vô障碍 và hành vi component, là nền tảng底层的 của shadcn/ui | Xây dựng hệ thống thiết kế tùy chỉnh |

#### Hệ sinh thái mở rộng shadcn/ui

Ngoài các thư viện component通 dụng trên, hệ sinh thái shadcn/ui còn xuất hiện nhiều thư viện mở rộng dựa trên khái niệm của nó, cung cấp lựa chọn khác biệt cho các kịch bản cụ thể. Các thư viện mở rộng này cũng采用 mô hình "sao chép code vào dự án", cho developer có quyền kiểm soát mã nguồn hoàn toàn.

| Thư viện component | Giới thiệu | Kịch bản sử dụng |
| :--- | :--- | :--- |
| [Aceternity UI](https://ui.aceternity.com) | 200+ component cấp production,主打 thẻ phát sáng, gradient文字, 3D地球 và các component thị giác đặc sắc khác | Landing page chất lượng cao, sản phẩm SaaS |
| [Tailark UI](https://tailark.com) | Bộ sưu tập khối component trang web marketing, showcase sản phẩm, lời chứng nhận khách hàng, nút CTA và các module marketing tần suất cao | Landing page marketing, trang chủ sản phẩm |
| [UI Tripled](https://ui.tripled.work) | Component tương tác động dựa trên Framer Motion,弹窗, điều hướng, animation thẻ | Công cụ sáng tạo, portfolio cá nhân |
| [Neobrutalism UI](https://neobrutalism.dev) | Phong cách Neo-brutalism, đường viền粗, độ tương phản cao, màu sắc鲜明 | Trang chủ thương hiệu cá nhân hóa, dự án sáng tạo |
| [REUI](https://reui.io) | 967+ mẫu tổ hợp component cho 967+ kịch bản nghiệp vụ thực tế | Back-office doanh nghiệp, biểu mẫu phức tạp |
| [Cult UI](https://cult-ui.com) | Đánh bóng tương tác/thị giác tinh tế hơn, component phức hợp như bảng dữ liệu, bảng lọc | Dự án thương mại chất lượng cao |
| [Kibo UI](https://kibo-ui.com) | Component nghiệp vụ nâng cao, color picker, rich text editor, tải tệp | Back-office quản lý, sản phẩm kiểu công cụ |
| [Kokonut UI](https://kokonutui.com) | 100+ component + 7+ template hoàn chỉnh, phong cách清新简约 | Trang chủ SaaS, blog, thương mại điện tử |
| [Commerce UI](https://ui.stackzero.co) | Chuyên dùng cho kịch bản thương mại điện tử, thẻ sản phẩm, giỏ hàng, biểu mẫu thanh toán | Nền tảng thương mại điện tử |
| [shadcnblocks](https://shadcnblocks.com) | 1373 UI block + 13 bộ template hoàn chỉnh, tài nguyên toàn diện nhất | Tất cả các kịch bản |
| [Shoogle](https://shoogle.dev) | Nền tảng tổng hợp tìm kiếm hệ sinh thái shadcn/ui | Tìm kiếm tài nguyên nhanh chóng |
| [Discover All Shadcn](https://allshadcn.com) | Điều hướng tài nguyên tổng hợp | Tìm kiếm tài nguyên nhanh chóng |

> **Tại sao chọn mở rộng shadcn/ui?** Các mở rộng này kế thừa khái niệm "quyền sở hữu code" của shadcn/ui, đồng thời tùy chỉnh sâu cho các kịch bản cụ thể. Trong thời đại Vibe Coding, chúng giúp bạn nhanh chóng tìm được component phù hợp với nhu cầu thiết kế, thoát khỏi sự同质 hóa của các thư viện UI主流, tạo ra sản phẩm có tính khác biệt hóa cao hơn.

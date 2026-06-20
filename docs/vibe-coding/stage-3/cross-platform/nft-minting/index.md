# Cách Nhanh chóng Xây dựng và Mint NFT: Phiên bản Khởi đầu 10 Phút

# Chương 1: NFT và Hợp đồng thông minh là gì

Trong hướng dẫn này, chúng ta sẽ hoàn thành một vòng lặp khép kín: viết một hợp đồng thông minh NFT từ đầu, triển khai lên testnet Ethereum, mint NFT của riêng bạn và xem nó trên OpenSea. Toàn bộ quá trình sử dụng công cụ trên trình duyệt, không cần cài đặt môi trường cục bộ và có thể hoàn thành trong 10 phút.

Để thực hiện hướng dẫn này, bạn cần ít nhất:

- Trình duyệt Chrome (đã cài đặt tiện ích mở rộng ví MetaMask)
- Một tài khoản ví MetaMask
- Một lượng nhỏ ETH testnet Sepolia (nhận miễn phí, hướng dẫn bên dưới)

> **Chi phí bằng không, cài đặt bằng không**: toàn bộ quá trình sử dụng công cụ trên trình duyệt (Remix IDE), không cần cài đặt Node.js / Hardhat; mã sử dụng mẫu bảo mật chính thức từ OpenZeppelin; sau khi mint, bạn có thể xem NFT trên testnet OpenSea.

## 1.1 NFT là gì?

NFT (Non-Fungible Token - Token Không thể thay thế) là một loại tài sản kỹ thuật số trên blockchain. Khác với token có thể thay thế như Bitcoin hoặc Ether, mỗi NFT đều là duy nhất, giống như không có hai bức tranh nào trên thế giới hoàn toàn giống nhau.

Bạn có thể hiểu NFT như một **"chứng nhận sưu tầm trong thế giới kỹ thuật số."** Nó có thể đại diện cho:

* quyền sở hữu một tác phẩm nghệ thuật kỹ thuật số
* một vé sự kiện
* một vật phẩm trong game
* một chứng chỉ học tập
* thậm chí một tweet

Giá trị cốt lõi của NFT là: **chúng sử dụng công nghệ blockchain để chứng minh "món đồ kỹ thuật số này thuộc về bạn,"** và bằng chứng đó là công khai, minh bạch và không thể giả mạo.

<!-- ![placeholder: Sơ đồ khái niệm NFT: tác phẩm nghệ thuật kỹ thuật số bên trái, hồ sơ sở hữu trên blockchain bên phải, được kết nối bằng mũi tên](/zh-cn/stage-3/cross-platform/nft-minting/images/image1.png) -->

## 1.2 Hợp đồng thông minh là gì?

Hợp đồng thông minh là một đoạn mã chạy trên blockchain. Bạn có thể nghĩ nó như một **"hợp đồng tự động thực thi."** Sau khi được triển khai trên chuỗi, nó tự động chạy theo logic mã và không ai có thể giả mạo nó.

NFT được tạo và quản lý thông qua hợp đồng thông minh. Khi bạn "mint" một NFT, bạn thực chất đang gọi một hàm trong hợp đồng thông minh để ghi lên chuỗi: "NFT #0 thuộc về địa chỉ ví của bạn."

Chúng ta sẽ sử dụng **Solidity** để viết hợp đồng. Đừng lo lắng. Với các mẫu có sẵn từ OpenZeppelin, bạn chỉ cần viết ít hơn 15 dòng mã.

## 1.3 Chúng ta đang mint NFT gì?

Chúng ta sẽ mint một NFT **"Chứng chỉ Học tập Vibe Coder"** để chứng minh bạn đã hoàn thành hướng dẫn này và học được kiến thức cơ bản về phát triển blockchain. NFT này sẽ:

* có một token ID duy nhất
* được ghi lại trên testnet Sepolia của Ethereum
* có thể xem và hiển thị trên testnet OpenSea
* (tùy chọn) bao gồm hình ảnh tùy chỉnh của bạn

Tất nhiên, bạn có thể thay đổi nó thành bất kỳ chủ đề nào bạn thích: tác phẩm nghệ thuật do AI tạo ra, thẻ kỷ niệm sự kiện, avatar pixel và nhiều hơn nữa. Nội dung NFT hoàn toàn do bạn quyết định.

## 1.4 Tại sao sử dụng Testnet?

Ethereum có "mainnet" và "testnet":

| So sánh | Mainnet | Testnet (Sepolia) |
|------|----------------|------------------|
| Giá trị ETH | Tiền thật | Nhận miễn phí, không có giá trị thực |
| Chi phí triển khai | Cần phí gas thật | Hoàn toàn miễn phí |
| Trường hợp sử dụng | Phát hành sản xuất | Học tập, thử nghiệm, phát triển |
| Khác biệt chức năng | Không có | Giống hệt mainnet |

Testnet và mainnet giống nhau về mặt chức năng. Điểm khác biệt duy nhất là ETH testnet không có giá trị thực. Vì vậy, bạn có thể yên tâm học hỏi và thử nghiệm trên testnet mà không lo tốn tiền.

## 1.5 Lộ trình Hướng dẫn

Chúng ta sẽ hoàn thành quy trình theo các bước sau:

1. **Chuẩn bị ví và ETH thử nghiệm** (2 phút): cài đặt MetaMask và nhận ETH thử nghiệm miễn phí
2. **Viết và triển khai hợp đồng** (4 phút): viết hợp đồng NFT trong Remix IDE và triển khai lên Sepolia
3. **Mint NFT và kiểm tra kết quả** (4 phút): gọi hợp đồng để mint NFT và xác minh trên OpenSea và Etherscan
4. **Nâng cao: thêm hình ảnh vào NFT** (tùy chọn): lưu trữ hình ảnh trên IPFS để hoàn thiện NFT

# Chương 2: Chuẩn bị Ví và ETH Thử nghiệm (2 Phút)

## 2.1 Cài đặt Ví MetaMask

MetaMask là ví Ethereum phổ biến nhất. Đây là một tiện ích mở rộng trình duyệt cho phép bạn tương tác với các ứng dụng blockchain.

1. Mở Chrome và truy cập [trang chủ MetaMask](https://metamask.io/)
2. Nhấp **"Download"** và cài đặt tiện ích Chrome
3. Sau khi cài đặt, nhấp vào biểu tượng con cáo MetaMask ở góc trên bên phải
4. Chọn **"Create a new wallet"** và đặt mật khẩu
5. **Quan trọng**: giữ an toàn cụm từ khôi phục (12 từ). Mất ví thử nghiệm không sao, nhưng thói quen tốt là quan trọng

<!-- ![placeholder: Ảnh chụp màn hình quy trình cài đặt MetaMask và tạo ví: cài đặt tiện ích -> tạo ví -> đặt mật khẩu -> sao lưu cụm từ khôi phục](/zh-cn/stage-3/cross-platform/nft-minting/images/image2.png) -->

## 2.2 Chuyển sang Testnet Sepolia

MetaMask kết nối với mainnet Ethereum theo mặc định. Chúng ta cần chuyển sang testnet Sepolia:

1. Nhấp vào menu thả xuống mạng ở phía trên MetaMask (mặc định: "Ethereum Mainnet")
2. Nhấp **"Show test networks"**
3. Chọn **"Sepolia test network"**

Nếu bạn không thấy Sepolia, nhấp **"Add network"** và thêm thủ công:

| Mục Cấu hình | Giá trị |
|-------|-----|
| Tên Mạng | Sepolia test network |
| RPC URL | `https://rpc.sepolia.org` |
| Chain ID | 11155111 |
| Ký hiệu Tiền tệ | SepoliaETH |
| Trình khám phá Khối | `https://sepolia.etherscan.io` |

<!-- ![placeholder: Ảnh chụp màn hình chuyển MetaMask sang testnet Sepolia qua menu thả xuống mạng](/zh-cn/stage-3/cross-platform/nft-minting/images/image3.png) -->

## 2.3 Nhận ETH Thử nghiệm Miễn phí

Triển khai hợp đồng và mint NFT cần phí gas. Trên testnet, gas được thanh toán bằng ETH thử nghiệm, hoàn toàn miễn phí.

Truy cập bất kỳ faucet nào dưới đây và nhập địa chỉ ví để nhận Sepolia ETH miễn phí:

| Faucet | URL | Số lượng mỗi lần nhận | Yêu cầu đăng nhập |
|--------|------|-----------|------------|
| QuickNode | `https://faucet.quicknode.com/ethereum/sepolia` | 0.1 ETH | Có |
| Alchemy | `https://www.alchemy.com/faucets/ethereum-sepolia` | 0.1 ETH | Có |
| Google Cloud | `https://cloud.google.com/application/web3/faucet/ethereum/sepolia` | 0.05 ETH | Có (tài khoản Google) |

> **Mẹo**: 0.1 ETH thử nghiệm là đủ để triển khai hợp đồng và mint hàng chục NFT. Nếu một faucet không hoạt động, hãy thử cái khác.

Sau khi nhận thành công, quay lại MetaMask và số dư của bạn sẽ thay đổi từ 0 thành 0.1 ETH (có thể mất vài giây).

<!-- ![placeholder: Ảnh chụp màn hình trang faucet hiển thị nhập địa chỉ ví và nhận ETH thử nghiệm](/zh-cn/stage-3/cross-platform/nft-minting/images/image4.png) -->

# Chương 3: Viết và Triển khai Hợp đồng thông minh NFT (4 Phút)

## 3.1 Mở Remix IDE

Remix là môi trường phát triển hợp đồng thông minh trực tuyến được Ethereum chính thức khuyến nghị. Nó chạy hoàn toàn trong trình duyệt và không cần cài đặt.

Mở: **https://remix.ethereum.org/**

Bạn sẽ thấy giao diện giống VS Code: trình khám phá tệp bên trái, trình soạn mã ở giữa và bảng biên dịch/triển khai bên phải.

<!-- ![placeholder: Ảnh chụp màn hình trang chủ Remix IDE hiển thị trình khám phá tệp, trình soạn mã và bảng bên phải](/zh-cn/stage-3/cross-platform/nft-minting/images/image5.png) -->

## 3.2 Tạo Tệp Hợp đồng

1. Trong trình khám phá tệp bên trái, nhấp vào thư mục **"contracts"**
2. Nhấp nút **"+"** ở phía trên để tạo tệp mới
3. Đặt tên là **`MySimpleNFT.sol`**
4. Dán đoạn mã dưới đây:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import mẫu ERC721 bảo mật chính thức từ OpenZeppelin
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Hợp đồng NFT đơn giản nhất: chỉ có tên, ký hiệu và hàm mint
contract MySimpleNFT is ERC721 {
    uint256 private _tokenId;

    // Khởi tạo tên bộ sưu tập và ký hiệu
    constructor() ERC721("VibeCoder", "VIBE") {}

    // Mint NFT: gọi một lần để mint một token cho người gọi
    function mint() public {
        _safeMint(msg.sender, _tokenId);
        _tokenId++;
    }
}
```

**Giải thích mã (ít hơn 15 dòng, mỗi dòng đều dễ hiểu):**

| Mã | Ý nghĩa |
|------|------|
| `pragma solidity ^0.8.20` | Chỉ định phiên bản trình biên dịch Solidity |
| `import "@openzeppelin/..."` | Import triển khai chuẩn ERC721 từ OpenZeppelin (mẫu đã được kiểm toán bảo mật) |
| `contract MySimpleNFT is ERC721` | Tạo hợp đồng kế thừa chuẩn ERC721 |
| `ERC721("VibeCoder", "VIBE")` | Đặt tên bộ sưu tập "VibeCoder" và ký hiệu "VIBE" |
| `_safeMint(msg.sender, _tokenId)` | Mint một NFT mới cho người gọi |
| `_tokenId++` | Tăng token ID sau mỗi lần mint |

> **ERC721 là gì?** Đây là chuẩn NFT trên Ethereum, xác định các khả năng cơ bản của NFT (chuyển nhượng, truy vấn chủ sở hữu, v.v.). OpenZeppelin cung cấp triển khai đã được kiểm toán bảo mật, vì vậy chúng ta có thể kế thừa trực tiếp thay vì xây dựng từ đầu.

<!-- ![placeholder: Ảnh chụp màn hình mã hợp đồng được dán vào Remix IDE](/zh-cn/stage-3/cross-platform/nft-minting/images/image6.png) -->

## 3.3 Biên dịch Hợp đồng

1. Nhấp **"Solidity Compiler"** trong bảng bên trái (biểu tượng búa)
2. Chọn phiên bản trình biên dịch **0.8.20** (hoặc cao hơn trong 0.8.x)
3. Nhấp **"Compile MySimpleNFT.sol"**
4. Dấu tích xanh ✅ nghĩa là biên dịch thành công

> Nếu có lỗi, kiểm tra xem phiên bản Solidity có khớp không và đường dẫn import OpenZeppelin có đúng không. Remix tự động tải xuống các phụ thuộc OpenZeppelin từ npm.

<!-- ![placeholder: Ảnh chụp màn hình biên dịch thành công trong Remix với dấu tick xanh và phiên bản trình biên dịch đã chọn](/zh-cn/stage-3/cross-platform/nft-minting/images/image7.png) -->

## 3.4 Triển khai Hợp đồng lên Testnet Sepolia

1. Nhấp **"Deploy & Run Transactions"** trong bảng bên trái (biểu tượng Ethereum)
2. Đặt **Environment** thành **"Injected Provider - MetaMask"**
   - Điều này tự động kết nối ví MetaMask của bạn
   - MetaMask sẽ hiện yêu cầu kết nối, nhấp **"Connect"**
3. Xác nhận mạng là **Sepolia (11155111)**
4. Chọn **MySimpleNFT** trong menu thả xuống Contract
5. Nhấp **"Deploy"**
6. MetaMask hiện xác nhận giao dịch, nhấp **"Confirm"** (gas rất thấp; testnet miễn phí)

Sau vài giây, khi triển khai thành công, phần **"Deployed Contracts"** bên dưới sẽ hiển thị địa chỉ hợp đồng của bạn. **Sao chép và lưu địa chỉ này**; bạn sẽ cần nó sau.

<!-- ![placeholder: Ảnh chụp màn hình triển khai Remix hiển thị lựa chọn môi trường, xác nhận MetaMask, nút Deploy và địa chỉ hợp đồng đã triển khai](/zh-cn/stage-3/cross-platform/nft-minting/images/image8.png) -->

# Chương 4: Mint NFT và Xác minh Kết quả (4 Phút)

## 4.1 Mint NFT Đầu tiên của Bạn

Sau khi triển khai thành công, trong phần **"Deployed Contracts"** trong Remix, bạn sẽ thấy bảng tương tác hợp đồng.

1. Mở rộng bảng hợp đồng và tìm nút **"mint"** (màu cam)
2. Nhấp **"mint"** trực tiếp (không cần tham số đầu vào)
3. MetaMask hiện xác nhận giao dịch, nhấp **"Confirm"**
4. Đợi vài giây để hoàn tất

Chúc mừng! Bạn vừa mint NFT #0, và nó giờ thuộc về địa chỉ ví của bạn.

Bạn có thể tiếp tục nhấp "mint" để tạo thêm. Token ID tự động tăng mỗi lần (#1, #2, #3...).

<!-- ![placeholder: Ảnh chụp màn hình nhấp mint trong Remix và xác nhận giao dịch trong MetaMask](/zh-cn/stage-3/cross-platform/nft-minting/images/image9.png) -->

## 4.2 Xác minh Kết quả Mint

**Cách 1: Xác minh trong Remix**

Trong bảng hợp đồng, tìm **"balanceOf"** (nút màu xanh), nhập địa chỉ ví của bạn và gọi nó. Nếu nó trả về `1` (hoặc số lượng bạn đã mint), mint thành công.

Bạn cũng có thể gọi **"ownerOf"**, nhập `0` (token ID), và nó trả về địa chỉ ví của bạn, chứng minh NFT #0 thuộc về bạn.

**Cách 2: Xác minh trên Etherscan (khuyến nghị)**

1. Mở [Sepolia Etherscan](https://sepolia.etherscan.io/)
2. Dán **địa chỉ hợp đồng** của bạn vào ô tìm kiếm
3. Bạn sẽ thấy trang chi tiết hợp đồng với tất cả hồ sơ giao dịch
4. Nhấp **"Token Tracker"** để xem tất cả NFT đã được mint bởi hợp đồng của bạn

Trên Etherscan, mỗi giao dịch mint đều có hồ sơ đầy đủ: ai đã mint, khi nào mint và token ID. Đây là sức hấp dẫn của blockchain khi "công khai, minh bạch và không thể giả mạo."

<!-- ![placeholder: Ảnh chụp màn hình xem hợp đồng và hồ sơ mint NFT trên Sepolia Etherscan, bao gồm danh sách giao dịch và Token Tracker](/zh-cn/stage-3/cross-platform/nft-minting/images/image10.png) -->

# Chương 5: Nâng cao - Thêm Hình ảnh vào NFT (Tùy chọn)

Các NFT đã mint hiện tại chỉ có ID, chưa có hình ảnh hoặc mô tả. Để hoàn thiện NFT, chúng ta cần **IPFS (InterPlanetary File System)** để lưu trữ hình ảnh và metadata.

## 5.1 IPFS là gì?

IPFS là một mạng lưới lưu trữ tệp phi tập trung. Khác với lưu trữ đám mây thông thường, tệp trên IPFS không phụ thuộc vào một máy chủ mà được phân tán trên các nút toàn cầu. Điều này có nghĩa là:

* tệp không bị mất nếu một máy chủ ngừng hoạt động
* nội dung tệp được xác định duy nhất bằng hash và không thể bị giả mạo
* nó lý tưởng để lưu trữ hình ảnh và metadata NFT

## 5.2 Tải Hình ảnh lên Pinata

[Pinata](https://pinata.cloud/) là dịch vụ lưu trữ IPFS phổ biến nhất. Gói miễn phí cung cấp 1GB lưu trữ, đủ cho chúng ta.

1. Truy cập https://pinata.cloud/ và đăng ký tài khoản miễn phí
2. Sau khi đăng nhập, nhấp **"Upload"** -> **"File"**
3. Chọn hình ảnh bạn muốn làm tác phẩm nghệ thuật NFT (hình ảnh do AI tạo ra cũng được, hoặc bất kỳ hình ảnh nào)
4. Sau khi tải lên thành công, sao chép **CID** (một chuỗi như `QmXyz...`)

URI hình ảnh của bạn là: `ipfs://yourCID`

<!-- ![placeholder: Ảnh chụp màn hình tải hình ảnh lên Pinata, bao gồm nút tải lên và CID kết quả](/zh-cn/stage-3/cross-platform/nft-minting/images/image11.png) -->

## 5.3 Tạo Metadata JSON

Metadata NFT là một tệp JSON mô tả tên NFT, mô tả và URI hình ảnh. Tạo một `metadata.json`:

```json
{
  "name": "Vibe Coder Certificate #0",
  "description": "NFT này chứng nhận người sở hữu đã hoàn thành hướng dẫn mint NFT và bước vào thế giới Web3.",
  "image": "ipfs://your-image-cid",
  "attributes": [
    { "trait_type": "Course", "value": "Easy Vibe" },
    { "trait_type": "Skill", "value": "Smart Contract" },
    { "trait_type": "Level", "value": "Beginner" }
  ]
}
```

Tải `metadata.json` lên Pinata và lấy metadata CID.

## 5.4 Nâng cấp Hợp đồng để Hỗ trợ Hình ảnh

Để bao gồm hình ảnh trong NFT, chúng ta cần nâng cấp nhẹ hợp đồng bằng cách thêm `tokenURI`. Quay lại Remix và tạo tệp mới `MyNFTWithImage.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MyNFTWithImage is ERC721, ERC721URIStorage {
    uint256 private _tokenId;

    constructor() ERC721("VibeCoder", "VIBE") {}

    // Truyền metadata URI khi mint
    function mint(string memory uri) public {
        _safeMint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, uri);
        _tokenId++;
    }

    // Ghi đè theo yêu cầu của Solidity
    function tokenURI(uint256 tokenId)
        public view override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
```

Sau khi triển khai, gọi `mint` và truyền metadata URI của bạn (ví dụ `ipfs://QmAbc.../metadata.json`). Khi đó NFT đã mint sẽ bao gồm hình ảnh và mô tả.

<!-- ![placeholder: Ảnh chụp màn hình chi tiết NFT với hình ảnh hiển thị trên Etherscan](/zh-cn/stage-3/cross-platform/nft-minting/images/image12.png) -->

# Chương 6: Ghi chú Cuối cùng

Chúc mừng! Bạn đã hoàn thành một vòng lặp phát triển NFT đầy đủ từ đầu. Hãy cùng tóm tắt:

1. Đã hiểu các khái niệm cốt lõi về NFT và hợp đồng thông minh
2. Đã cài đặt MetaMask và chuyển sang testnet Sepolia
3. Đã viết hợp đồng thông minh NFT với ít hơn 15 dòng trong Remix IDE
4. Đã triển khai hợp đồng lên testnet Ethereum
5. Đã mint NFT của riêng bạn và xác minh trên Etherscan
6. (Tùy chọn) Đã học cách thêm hình ảnh và metadata với IPFS

Toàn bộ quá trình không yêu cầu cài đặt môi trường cục bộ, không tốn tiền và hoàn thành hoàn toàn trong trình duyệt. Đây là sức hấp dẫn của phát triển blockchain: rào cản thấp hơn nhiều so với hầu hết mọi người nghĩ.

**Hướng phát triển nâng cao:**

* **Sử dụng Hardhat / Foundry cho phát triển cục bộ**: khi logic hợp đồng trở nên phức tạp, Remix không đủ. Hardhat và Foundry là các framework cục bộ chuyên nghiệp với kiểm thử tự động, triển khai bằng script, tối ưu gas và nhiều hơn nữa
* **Thêm danh sách trắng và giới hạn mint**: kiểm soát ai có thể mint, số lượng mint tối đa mỗi ví, giá mint và các quy tắc tương tự
* **Xây dựng giao diện mint frontend**: sử dụng React + ethers.js / viem để xây dựng trang mint đẹp mắt cho việc mint một cú nhấp chuột trên web
* **Khám phá NFT đa phiên bản ERC1155**: ERC1155 cho phép nhiều bản sao dưới một token ID, hữu ích cho vật phẩm game và vé
* **Triển khai lên mainnet**: khi sẵn sàng, triển khai lên mainnet Ethereum (hoặc các chuỗi L2 như Polygon hoặc Base với phí gas thấp hơn)

***NFT đầu tiên của bạn đã trên chuỗi. Cánh cửa đến thế giới blockchain giờ đã mở.***

# Tài liệu Tham khảo

* [Tài liệu OpenZeppelin ERC721](https://docs.openzeppelin.com/contracts/5.x/erc721)
* [Tài liệu Chính thức Remix IDE](https://remix-ide.readthedocs.io/)
* [Tài liệu Chính thức MetaMask](https://docs.metamask.io/)
* [Tài liệu Chính thức Solidity](https://docs.soliditylang.org/)
* [Sepolia Etherscan](https://sepolia.etherscan.io/)
* [Dịch vụ Lưu trữ IPFS Pinata](https://pinata.cloud/)
* [Quy cách Chuẩn ERC721 (EIP-721)](https://eips.ethereum.org/EIPS/eip-721)

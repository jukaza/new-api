export interface NavItem {
  title: string
  slug: string
}

export interface NavGroup {
  groupTitle: string
  items: NavItem[]
}

export interface NavSection {
  sectionTitle: string
  groups: NavGroup[]
}

export const vibeCodingSections: NavSection[] = [
  {
    sectionTitle: 'Giai đoạn 1: AI Product Manager',
    groups: [
      {
        groupTitle: 'Nhập môn',
        items: [
          { title: 'Lộ trình học tập', slug: 'stage-1/learning-map/index' },
          { title: 'Thời đại AI, biết nói là biết lập trình', slug: 'stage-1/ai-capabilities-through-games/index' }
        ]
      },
      {
        groupTitle: 'Thực hành nguyên mẫu sản phẩm',
        items: [
          { title: 'Học công cụ lập trình AI', slug: 'stage-1/introduction-to-ai-ide/index' },
          { title: 'Tìm ý tưởng tốt', slug: 'stage-1/finding-great-idea/index' },
          { title: 'Xây dựng nguyên mẫu sản phẩm', slug: 'stage-1/building-prototype/index' },
          { title: 'Tích hợp năng lực AI', slug: 'stage-1/integrating-ai-capabilities/index' },
          { title: 'Thực chiến dự án hoàn chỉnh', slug: 'stage-1/complete-project-practice/index' }
        ]
      },
      {
        groupTitle: 'Phụ lục: Tư duy kinh doanh',
        items: [
          { title: 'Tư duy sản phẩm và thiết kế giải pháp', slug: 'stage-1/appendix-a-product-thinking/index' },
          { title: 'Tham khảo kịch bản ứng dụng AI trong ngành (B2B)', slug: 'stage-1/appendix-industry-scenarios/index' },
          { title: 'Gợi ý kịch bản tiêu dùng với AI (B2C)', slug: 'stage-1/appendix-c-consumer-scenarios/index' }
        ]
      },
      {
        groupTitle: 'Phụ lục: Nghiên cứu & Xác thực',
        items: [
          { title: 'Tìm ý tưởng ở đâu: 3 nguồn phù hợp', slug: 'stage-1/appendix-idea-sources/index' },
          { title: 'Double Diamond: làm đúng việc trước, rồi làm đúng cách', slug: 'stage-1/appendix-double-diamond/index' },
          { title: 'Dùng Jobs to Be Done để tìm nhu cầu người dùng', slug: 'stage-1/appendix-jobs-to-be-done/index' },
          { title: 'The Mom Test: phỏng vấn xác thực nhu cầu', slug: 'stage-1/appendix-mom-test/index' }
        ]
      },
      {
        groupTitle: 'Phụ lục: Giải pháp kỹ thuật',
        items: [
          { title: 'Làm gì khi gặp lỗi trong code', slug: 'stage-1/appendix-b-common-errors/index' },
          { title: 'So sánh bảy công cụ lập trình AI', slug: 'stage-1/appendix-articles/example0-1/vibe-coding-tools-snake-game-tutorial' },
          { title: 'Thiết kế website bằng agent thiết kế và agent lập trình', slug: 'stage-1/appendix-articles/example0-2/vibe-coding-tools-build-website-with-ai-coding-and-design-agents' }
        ]
      }
    ]
  },
  {
    sectionTitle: 'Giai đoạn 2: Lập trình viên Sơ/Trung cấp',
    groups: [
      {
        groupTitle: 'Phát triển Frontend',
        items: [
          { title: 'Sản xuất tài sản NanoBanana', slug: 'stage-2/frontend/lovart-assets/index' },
          { title: 'Giới thiệu Figma và MasterGo', slug: 'stage-2/frontend/figma-mastergo/index' },
          { title: 'Quy cách thiết kế UI và đa sản phẩm', slug: 'stage-2/frontend/multi-product-ui/index' },
          { title: 'Làm đẹp giao diện với Agent Skills', slug: 'stage-2/frontend/llm-skills-beautiful/index' },
          { title: 'Từ nguyên mẫu thiết kế đến mã dự án', slug: 'stage-2/frontend/design-to-code/index' },
          { title: 'Thư viện thành phần hiện đại và nâng cấp UI', slug: 'stage-2/frontend/modern-component-library/index' }
        ]
      },
      {
        groupTitle: 'Phát triển Backend',
        items: [
          { title: 'Giới thiệu cơ sở dữ liệu và Supabase', slug: 'stage-2/backend/database-supabase/index' },
          { title: 'Phát triển giao diện hỗ trợ bằng mô hình lớn', slug: 'stage-2/backend/ai-interface-code/index' },
          { title: 'Hướng dẫn nhập môn Git và GitHub', slug: 'stage-2/backend/git-workflow/index' },
          { title: 'Hướng dẫn toàn diện triển khai ứng dụng web', slug: 'stage-2/backend/zeabur-deployment/index' },
          { title: 'Trợ lý lập trình CLI Coding Agent', slug: 'stage-2/backend/modern-cli/index' },
          { title: 'Tích hợp thanh toán Stripe', slug: 'stage-2/backend/stripe-payment/index' }
        ]
      },
      {
        groupTitle: 'Phụ lục năng lực AI',
        items: [
          { title: 'Giới thiệu Dify và tích hợp cơ sở tri thức', slug: 'stage-2/ai-capabilities/dify-knowledge-base/index' }
        ]
      },
      {
        groupTitle: 'Dự án tổng hợp',
        items: [
          { title: 'Cùng làm chân dung Hogwarts', slug: 'stage-2/frontend/hogwarts-portraits/index' },
          { title: 'SaaS viết văn bản AI', slug: 'stage-2/assignments/copywriting-platform-supabase/index' },
          { title: 'Hệ thống thi trực tuyến và quản lý', slug: 'stage-2/assignments/exam-management-express/index' },
          { title: 'SaaS tạo ảnh AI hiện đại', slug: 'stage-2/assignments/modern-landing-page/index' },
          { title: 'Nền tảng Agent giống Dify', slug: 'stage-2/assignments/custom-dify-agent-platform/index' },
          { title: 'Nền tảng Agent lập kế hoạch du lịch thông minh', slug: 'stage-2/assignments/travel-planning-agent-platform/index' },
          { title: 'Hệ thống gợi ý phim Spring Boot', slug: 'stage-2/assignments/movie-recommendation-springboot/index' },
          { title: 'Hệ thống microservice thương mại điện tử thực phẩm', slug: 'stage-2/assignments/simple-grocery-microservices/index' },
          { title: 'Nền tảng phân tích dữ liệu giao thông Go', slug: 'stage-2/assignments/traffic-data-visualization-go/index' }
        ]
      }
    ]
  },
  {
    sectionTitle: 'Giai đoạn 3: Lập trình viên Cao cấp',
    groups: [
      {
        groupTitle: 'Claude Code Chuyên Sâu',
        items: [
          { title: 'Hướng dẫn Khởi động Nhanh Claude Code', slug: 'stage-3/core-skills/basics/index' },
          { title: 'Hướng dẫn Toàn diện MCP và Claude Code', slug: 'stage-3/core-skills/mcp/index' },
          { title: 'Hướng dẫn Toàn diện Claude Code Skills', slug: 'stage-3/core-skills/skills/index' },
          { title: 'Cách làm cho Coding Tools hoạt động lâu dài', slug: 'stage-3/core-skills/long-running-tasks/index' },
          { title: 'Hướng dẫn Toàn diện Claude Agent Teams', slug: 'stage-3/core-skills/agent-teams/index' },
          { title: 'Claude Code Superpowers cho Phát triển Cấp Production', slug: 'stage-3/core-skills/superpowers/index' },
          { title: 'Thực hành Tốt nhất Workflow Claude Code', slug: 'stage-3/core-skills/workflow/index' },
          { title: 'Phát triển Từ xa trên Mobile với Claude Code', slug: 'stage-3/core-skills/mobile-development/index' },
          { title: 'Hướng dẫn Toàn diện Claude Agent SDK', slug: 'stage-3/core-skills/claude-agent-sdk/index' },
          { title: 'Từ Vibe Coding đến Spec Coding', slug: 'stage-3/core-skills/spec-coding/index' }
        ]
      },
      {
        groupTitle: 'Phát triển Đa nền tảng',
        items: [
          { title: 'Cách chọn nền tảng phù hợp cho ứng dụng', slug: 'stage-3/cross-platform/choose-platform/index' },
          { title: 'Cách xây dựng WeChat Mini Program', slug: 'stage-3/cross-platform/wechat-miniprogram/index' },
          { title: 'Cách xây dựng WeChat Mini Program (có Backend)', slug: 'stage-3/cross-platform/wechat-miniprogram-backend/index' },
          { title: 'Cách xây dựng ứng dụng Android (Jetpack Compose)', slug: 'stage-3/cross-platform/android-app/index' },
          { title: 'Cách xây dựng ứng dụng iOS (SwiftUI)', slug: 'stage-3/cross-platform/ios-app/index' },
          { title: 'Cách phát triển ứng dụng PWA cục bộ', slug: 'stage-3/cross-platform/pwa-local-app/index' },
          { title: 'Cách phát triển tiện ích trợ lý AI cho trình duyệt', slug: 'stage-3/cross-platform/browser-ai-extension/index' },
          { title: 'Cách phát triển ứng dụng desktop Electron đa nền tảng', slug: 'stage-3/cross-platform/electron-voice-to-text/index' },
          { title: 'Cách phát triển và đúc NFT nhanh chóng', slug: 'stage-3/cross-platform/nft-minting/index' },
          { title: 'Cách phát triển tiện ích mở rộng VS Code', slug: 'stage-3/cross-platform/vscode-extension/index' },
          { title: 'Cách phát triển ứng dụng desktop Qt công nghiệp', slug: 'stage-3/cross-platform/qt-industrial-hmi/index' },
          { title: 'Cách xây dựng trang web cá nhân và blog học thuật', slug: 'stage-3/personal-brand/personal-website-blog/index' }
        ]
      },
      {
        groupTitle: 'AI Nâng cao',
        items: [
          { title: 'RAG là gì và cách nó hoạt động', slug: 'stage-3/ai-advanced/rag-introduction/index' },
          { title: 'RAG nâng cao và điều phối workflow với LangGraph', slug: 'stage-3/ai-advanced/langgraph-advanced-rag/index' }
        ]
      }
    ]
  },
  {
    sectionTitle: 'Phụ lục: Nền tảng Máy tính & Hệ thống',
    groups: [
      {
        groupTitle: 'I. Nền tảng Máy tính',
        items: [
          { title: 'Full-Stack trong kỷ nguyên Vibe Coding', slug: 'appendix/1-computer-fundamentals/vibe-coding-fullstack' },
          { title: 'Từ khởi động nguồn đến truy cập trang Web', slug: 'appendix/1-computer-fundamentals/power-on-to-web' },
          { title: 'Từ Transistor đến CPU', slug: 'appendix/1-computer-fundamentals/transistor-to-cpu' },
          { title: 'Kiến trúc máy tính', slug: 'appendix/1-computer-fundamentals/computer-organization' },
          { title: 'Hệ điều hành', slug: 'appendix/1-computer-fundamentals/operating-systems' },
          { title: 'Mã hóa và lưu trữ dữ liệu', slug: 'appendix/1-computer-fundamentals/data-encoding-storage' },
          { title: 'Mạng máy tính', slug: 'appendix/1-computer-fundamentals/computer-networks' },
          { title: 'Cấu trúc dữ liệu', slug: 'appendix/1-computer-fundamentals/data-structures' },
          { title: 'Tư duy thuật toán', slug: 'appendix/1-computer-fundamentals/algorithm-thinking' },
          { title: 'Ngôn ngữ lập trình', slug: 'appendix/1-computer-fundamentals/programming-languages' },
          { title: 'Giới thiệu về trình biên dịch', slug: 'appendix/1-computer-fundamentals/compilers' },
          { title: 'Giới thiệu về Type Systems', slug: 'appendix/1-computer-fundamentals/type-systems' }
        ]
      },
      {
        groupTitle: 'II. Công cụ và Môi trường',
        items: [
          { title: 'Kiến thức cơ bản về IDE', slug: 'appendix/2-development-tools/ide-basics' },
          { title: 'Dòng lệnh & Shell', slug: 'appendix/2-development-tools/command-line-shell' },
          { title: 'Git: Cỗ máy thời gian của Code', slug: 'appendix/2-development-tools/git-version-control' },
          { title: 'Biến môi trường & PATH', slug: 'appendix/2-development-tools/environment-path' },
          { title: 'Cổng & Localhost', slug: 'appendix/2-development-tools/ports-localhost' },
          { title: 'Xác thực SSH & Khóa', slug: 'appendix/2-development-tools/ssh-authentication' },
          { title: 'Trình quản lý gói', slug: 'appendix/2-development-tools/package-managers' },
          { title: 'Nghệ thuật Debug', slug: 'appendix/2-development-tools/debugging-art' },
          { title: 'Biểu thức chính quy (Regex)', slug: 'appendix/2-development-tools/regex' }
        ]
      },
      {
        groupTitle: 'III. Trình duyệt & Frontend',
        items: [
          { title: 'Đi sâu vào JavaScript', slug: 'appendix/3-browser-and-frontend/javascript-deep-dive' },
          { title: 'Giới thiệu TypeScript', slug: 'appendix/3-browser-and-frontend/typescript' },
          { title: 'Các Frontend Framework', slug: 'appendix/3-browser-and-frontend/frontend-frameworks' },
          { title: 'Rendering Pipeline trong trình duyệt', slug: 'appendix/3-browser-and-frontend/browser-as-os-rendering' },
          { title: 'Bố cục HTML / CSS', slug: 'appendix/3-browser-and-frontend/html-css-layout' },
          { title: 'JS Runtime', slug: 'appendix/3-browser-and-frontend/javascript-runtime' },
          { title: 'Bản chất của Framework', slug: 'appendix/3-browser-and-frontend/frontend-framework-nature' },
          { title: 'Quản lý trạng thái (State Management)', slug: 'appendix/3-browser-and-frontend/state-management' },
          { title: 'Định tuyến & Điều hướng', slug: 'appendix/3-browser-and-frontend/routing-navigation' },
          { title: 'Đồ họa & Hoạt ảnh', slug: 'appendix/3-browser-and-frontend/graphics-animation' },
          { title: 'Truyền thông thời gian thực', slug: 'appendix/3-browser-and-frontend/realtime-communication' },
          { title: 'Hiệu suất Web (Web Performance)', slug: 'appendix/3-browser-and-frontend/web-performance' },
          { title: 'Kỹ nghệ Frontend', slug: 'appendix/3-browser-and-frontend/frontend-engineering' },
          { title: 'Kiến trúc dự án Frontend', slug: 'appendix/3-browser-and-frontend/frontend-project-architecture' },
          { title: 'Khả năng tiếp cận (A11y) & Đa ngôn ngữ (i18n)', slug: 'appendix/3-browser-and-frontend/a11n-i18n' }
        ]
      },
      {
        groupTitle: 'IV. Máy chủ và Backend',
        items: [
          { title: 'Ngôn ngữ phía Backend', slug: 'appendix/4-server-and-backend/backend-languages' },
          { title: 'Ngôn ngữ phía Client', slug: 'appendix/4-server-and-backend/client-languages' },
          { title: 'Giải pháp đa nền tảng', slug: 'appendix/4-server-and-backend/cross-platform' },
          { title: 'Giao thức HTTP', slug: 'appendix/4-server-and-backend/http-protocol' },
          { title: 'Hành trình của một Request', slug: 'appendix/4-server-and-backend/request-journey' },
          { title: 'Các Web Framework', slug: 'appendix/4-server-and-backend/web-frameworks' },
          { title: 'Giới thiệu API', slug: 'appendix/4-server-and-backend/api-intro' },
          { title: 'Triết lý thiết kế API', slug: 'appendix/4-server-and-backend/api-design' },
          { title: 'Tuần tự hóa dữ liệu', slug: 'appendix/4-server-and-backend/serialization' },
          { title: 'Xác thực & Ủy quyền (Auth & Authorization)', slug: 'appendix/4-server-and-backend/auth-authorization' },
          { title: 'Đồng thời & Bất đồng bộ (Concurrency & Async)', slug: 'appendix/4-server-and-backend/concurrency-async' },
          { title: 'Chiến lược Caching', slug: 'appendix/4-server-and-backend/caching' },
          { title: 'Hàng đợi thông điệp (Message Queues)', slug: 'appendix/4-server-and-backend/message-queues' },
          { title: 'Hàng đợi tác vụ bất đồng bộ', slug: 'appendix/4-server-and-backend/async-task-queues' },
          { title: 'Giới hạn tần suất & Áp lực ngược (Rate Limiting)', slug: 'appendix/4-server-and-backend/rate-limiting-backpressure' },
          { title: 'Nguyên lý công cụ tìm kiếm', slug: 'appendix/4-server-and-backend/search-engines' },
          { title: 'Lưu trữ tệp tin', slug: 'appendix/4-server-and-backend/file-storage' },
          { title: 'Kiến trúc phân tầng Backend', slug: 'appendix/4-server-and-backend/backend-layered-architecture' },
          { title: 'Kiến trúc dự án Backend', slug: 'appendix/4-server-and-backend/backend-project-architecture' },
          { title: 'Giới thiệu DSL', slug: 'appendix/4-server-and-backend/domain-specific-languages' }
        ]
      },
      {
        groupTitle: 'V. Dữ liệu',
        items: [
          { title: 'Nền tảng cơ sở dữ liệu', slug: 'appendix/5-data/database-fundamentals' },
          { title: 'Toàn cảnh mô hình dữ liệu', slug: 'appendix/5-data/data-models' },
          { title: 'Theo dõi dữ liệu (Data Tracking)', slug: 'appendix/5-data/data-tracking' },
          { title: 'Phân tích dữ liệu', slug: 'appendix/5-data/data-analysis' },
          { title: 'Thử nghiệm A/B (A/B Testing)', slug: 'appendix/5-data/ab-testing' },
          { title: 'Trực quan hóa dữ liệu', slug: 'appendix/5-data/data-visualization' },
          { title: 'Quản trị dữ liệu (Data Governance)', slug: 'appendix/5-data/data-governance' }
        ]
      },
      {
        groupTitle: 'VI. Kiến trúc',
        items: [
          { title: 'Từ Monolith sang Microservices', slug: 'appendix/6-architecture-and-system-design/monolith-to-microservices' },
          { title: 'Hệ thống phân tán', slug: 'appendix/6-architecture-and-system-design/distributed-systems' },
          { title: 'Tính khả dụng cao & Khôi phục thảm họa', slug: 'appendix/6-architecture-and-system-design/high-availability' },
          { title: 'Thiết kế hệ thống', slug: 'appendix/6-architecture-and-system-design/system-design-methodology' }
        ]
      },
      {
        groupTitle: 'VII. Hạ tầng',
        items: [
          { title: 'Kiến thức cơ bản về Linux', slug: 'appendix/7-infrastructure-and-operations/linux-basics' },
          { title: 'Docker và Container', slug: 'appendix/7-infrastructure-and-operations/docker-containers' },
          { title: 'Kubernetes', slug: 'appendix/7-infrastructure-and-operations/kubernetes' },
          { title: 'CI / CD', slug: 'appendix/7-infrastructure-and-operations/ci-cd' },
          { title: 'Tên miền, DNS & HTTPS', slug: 'appendix/7-infrastructure-and-operations/dns-https' },
          { title: 'Cân bằng tải', slug: 'appendix/7-infrastructure-and-operations/load-balancing-gateway' },
          { title: 'Gateway & Reverse Proxy', slug: 'appendix/7-infrastructure-and-operations/gateway-proxy' },
          { title: 'Nền tảng đám mây', slug: 'appendix/7-infrastructure-and-operations/cloud-platforms' },
          { title: 'Quản lý danh tính và quyền truy cập (IAM)', slug: 'appendix/7-infrastructure-and-operations/cloud-iam' },
          { title: 'Lưu trữ đám mây & CDN', slug: 'appendix/7-infrastructure-and-operations/cloud-storage-cdn' },
          { title: 'Cấu trúc hạ tầng dưới dạng mã (IaC)', slug: 'appendix/7-infrastructure-and-operations/infrastructure-as-code' },
          { title: 'Giám sát & Ghi log', slug: 'appendix/7-infrastructure-and-operations/monitoring-logging' },
          { title: 'Ứng phó sự cố', slug: 'appendix/7-infrastructure-and-operations/incident-response' }
        ]
      },
      {
        groupTitle: 'VIII. Trí tuệ Nhân tạo',
        items: [
          { title: 'Lịch sử & Khái niệm AI', slug: 'appendix/8-artificial-intelligence/ai-history' },
          { title: 'Mạng nơ-ron (Neural Networks)', slug: 'appendix/8-artificial-intelligence/neural-networks' },
          { title: 'Transformer & Attention', slug: 'appendix/8-artificial-intelligence/transformer-attention' },
          { title: 'Nguyên lý mô hình ngôn ngữ lớn (LLM)', slug: 'appendix/8-artificial-intelligence/llm-principles' },
          { title: 'Prompt Engineering', slug: 'appendix/8-artificial-intelligence/prompt-engineering' },
          { title: 'Kỹ nghệ ngữ cảnh (Context Engineering)', slug: 'appendix/8-artificial-intelligence/context-engineering' },
          { title: 'Mô hình đa phương thức (Multimodal)', slug: 'appendix/8-artificial-intelligence/multimodal-models' },
          { title: 'Tạo ảnh (Image Generation)', slug: 'appendix/8-artificial-intelligence/image-generation' },
          { title: 'Tổng hợp & Nhận dạng giọng nói', slug: 'appendix/8-artificial-intelligence/speech-synthesis-recognition' },
          { title: 'Embedding & Tìm kiếm vector', slug: 'appendix/8-artificial-intelligence/embedding-vector-retrieval' },
          { title: 'Kiến trúc RAG', slug: 'appendix/8-artificial-intelligence/rag' },
          { title: 'AI Agent & Công cụ', slug: 'appendix/8-artificial-intelligence/ai-agents' },
          { title: 'Giao thức AI (MCP)', slug: 'appendix/8-artificial-intelligence/ai-protocols' },
          { title: 'Tinh chỉnh & Triển khai mô hình (Finetuning)', slug: 'appendix/8-artificial-intelligence/model-finetuning-deployment' },
          { title: 'Thiết kế ứng dụng AI-Native', slug: 'appendix/8-artificial-intelligence/ai-native-app-design' },
          { title: 'Từ điển năng lực AI', slug: 'appendix/8-artificial-intelligence/ai-capability-dictionary' }
        ]
      },
      {
        groupTitle: 'IX. Chất lượng Kỹ thuật',
        items: [
          { title: 'Chất lượng Code & Refactoring', slug: 'appendix/9-engineering-excellence/code-quality-refactoring' },
          { title: 'Chiến lược kiểm thử', slug: 'appendix/9-engineering-excellence/testing-strategies' },
          { title: 'Mẫu thiết kế (Design Patterns)', slug: 'appendix/9-engineering-excellence/design-patterns' },
          { title: 'Tư duy bảo mật', slug: 'appendix/9-engineering-excellence/security-thinking' },
          { title: 'Viết tài liệu kỹ thuật', slug: 'appendix/9-engineering-excellence/technical-writing' },
          { title: 'Cộng tác mã nguồn mở', slug: 'appendix/9-engineering-excellence/open-source-collaboration' },
          { title: 'Lựa chọn công nghệ', slug: 'appendix/9-engineering-excellence/technology-selection' }
        ]
      }
    ]
  }
]

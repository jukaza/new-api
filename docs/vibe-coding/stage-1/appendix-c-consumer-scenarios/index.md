---
title: 'Tham khảo cảm hứng cho kịch bản tiêu dùng B2C'
description: 'Tài liệu này tổng hợp các hướng ứng dụng sáng tạo của mô hình LLM trong kịch bản tiêu dùng B2C, bao gồm lối sống, đồng hành cảm xúc, giải trí, phát triển cá nhân và tương tác xã hội, làm nguồn tham khảo cho nhà phát triển ứng dụng AI hướng tới người tiêu dùng.'
---

<script setup>
import { computed, ref } from 'vue'

const duration = 'khoảng <strong>4 giờ</strong>'

const vibePoint = ref('')
const feeling = ref('')

// Nhóm chủ đề theo từng kịch bản: nhấn mạnh cảm giác, bầu không khí và gợi ý tâm lý
const topicPool = {
  'lifestyle': [
    { title: 'Trợ lý đánh thức bằng nghi thức buổi sáng', desc: 'Tạo nghi thức buổi sáng riêng theo thời tiết, lịch trình và tâm trạng để mỗi ngày bắt đầu thật đẹp' },
    { title: 'Nhà thiết kế bầu không khí cho người sống một mình', desc: 'Thiết kế không gian sống cho người ở một mình với gợi ý phối hợp ánh sáng, âm nhạc và hương thơm' },
    { title: 'Trình tạo kế hoạch chữa lành cuối tuần ở nhà', desc: 'Đề xuất combo ở nhà hoàn hảo theo tâm trạng: phim + đồ ăn vặt + bố trí không gian' },
    { title: 'Đài phát thanh an ủi tâm hồn trước khi ngủ', desc: 'Tạo câu chuyện dịu dàng và hướng dẫn thiền như một đài riêng đồng hành vào giấc ngủ' },
    { title: 'Bộ bắt cảm hứng thẩm mỹ đời sống', desc: 'Tìm cái đẹp trong những việc nhỏ hằng ngày, tạo gợi ý thẩm mỹ và hướng dẫn nghi thức sống' }
  ],
  'emotion': [
    { title: 'Người lắng nghe tâm sự đêm khuya', desc: 'Một nơi tiếp nhận cảm xúc trực tuyến 24 giờ, không phán xét mọi điều trong lòng' },
    { title: 'Người đồng hành chữa lành sau chia tay', desc: 'Cung cấp sự đồng hành dịu dàng, gợi ý hồi phục và lối thoát cảm xúc trong giai đoạn thấp điểm sau chia tay' },
    { title: 'Huấn luyện viên thở giảm lo âu', desc: 'Nhận biết cảm xúc lo âu, hướng dẫn bài tập thở và thiền chánh niệm' },
    { title: 'Cố vấn xây dựng lại tự tin', desc: 'Giúp xây dựng lại nhận thức về bản thân và cảm giác giá trị qua đối thoại tích cực và gợi ý tâm lý' },
    { title: 'Diễn giải thông minh nhật ký cảm xúc', desc: 'Phân tích nhật ký cảm xúc, phát hiện quy luật tâm trạng và đưa ra góc nhìn, lời khuyên ấm áp' }
  ],
  'entertainment': [
    { title: 'DM nhập vai cho trò chơi suy luận', desc: 'Đóng vai người dẫn trò, tạo bầu không khí hồi hộp và thúc đẩy cốt truyện' },
    { title: 'NPC có linh hồn trong game thế giới mở', desc: 'NPC có cá tính, nhớ câu chuyện của người chơi và tạo liên kết cảm xúc thật' },
    { title: 'Tạo nội dung podcast cá nhân hóa', desc: 'Tạo podcast riêng theo sở thích, tự nhiên như trò chuyện với bạn bè' },
    { title: 'Nhóm tạo không khí cho concert ảo', desc: 'Tạo cảm giác hiện trường cho concert online với tương tác, cổ vũ và hiệu ứng không khí thời gian thực' },
    { title: 'Bạn đồng sáng tạo tiểu thuyết tương tác', desc: 'Cùng độc giả sáng tác câu chuyện, mỗi lựa chọn đều ảnh hưởng đến hướng đi của thế giới' }
  ],
  'growth': [
    { title: 'Người chứng kiến phát triển cá nhân', desc: 'Ghi lại hành trình trưởng thành, khích lệ và nhìn lại ở các mốc quan trọng' },
    { title: 'Huấn luyện viên game hóa thói quen', desc: 'Biến quá trình xây dựng thói quen nhàm chán thành một trò phiêu lưu thú vị' },
    { title: 'Ghép đôi bạn học kỹ năng', desc: 'Tìm bạn học cùng chí hướng để cùng giám sát và chia sẻ tiến bộ' },
    { title: 'Người phát hiện niềm vui nhỏ mỗi ngày', desc: 'Giúp nhận ra những điều nhỏ đẹp trong đời sống, nuôi dưỡng lòng biết ơn và thái độ tích cực' },
    { title: 'Trình mô phỏng trải nghiệm cuộc đời', desc: 'Mô phỏng các lựa chọn cuộc đời khác nhau và trải nghiệm khả năng khác trong dòng thời gian song song' }
  ],
  'social': [
    { title: 'Trình tạo chủ đề phá băng', desc: 'Cung cấp chủ đề thú vị trong bối cảnh xã hội để giảm ngượng và kéo gần khoảng cách' },
    { title: 'Người viết caption mạng xã hội có không khí', desc: 'Tạo caption có phong cách theo ảnh và tâm trạng' },
    { title: 'Nhà hoạch định không khí hẹn hò', desc: 'Thiết kế trọn vẹn không khí cho buổi hẹn, từ địa điểm đến chủ đề và bất ngờ' },
    { title: 'Người khuấy động họp mặt từ xa', desc: 'Làm không khí họp mặt online sôi nổi bằng trò chơi và hướng dẫn tương tác' },
    { title: 'Trợ lý quản lý năng lượng xã hội', desc: 'Giúp người hướng nội quản lý năng lượng xã hội và tìm nhịp giao tiếp thoải mái' }
  ],
  'creative': [
    { title: 'Bộ sơ cứu khi cạn cảm hứng', desc: 'Cung cấp tia lửa bất ngờ khi gặp nút thắt sáng tạo' },
    { title: 'Hướng dẫn khám phá phong cách cá nhân', desc: 'Giúp phát hiện phong cách riêng, từ ăn mặc đến biểu đạt' },
    { title: 'Cố vấn thẩm mỹ cho sổ tay và nhật ký', desc: 'Gợi ý bố cục, phối màu và ý tưởng nội dung cho journaling' },
    { title: 'Hướng dẫn bố cục và không khí nhiếp ảnh', desc: 'Đưa ra gợi ý chụp ảnh và chỉnh ảnh theo cảnh và cảm giác mong muốn' },
    { title: 'Người ghép nhạc theo tâm trạng', desc: 'Đề xuất tổ hợp âm nhạc hoàn hảo theo tâm trạng và bối cảnh hiện tại' }
  ],
  'travel': [
    { title: 'Hướng dẫn dạo phố khám phá', desc: 'Khám phá thành phố như người địa phương và tìm những địa điểm ẩn thú vị' },
    { title: 'Tạo nhật ký tâm trạng du lịch', desc: 'Chuyển ảnh và cảm xúc du lịch thành bài ký và ký ức đẹp' },
    { title: 'Trợ lý đồng hành khi du lịch một mình', desc: 'Cung cấp đồng hành, lời khuyên và cảm giác an toàn cho người đi du lịch một mình' },
    { title: 'Xem trước bầu không khí điểm đến', desc: 'Trải nghiệm nhập vai không khí điểm đến trước khi khởi hành' },
    { title: 'Hướng dẫn không khí nhiếp ảnh du lịch', desc: 'Hướng dẫn chụp ảnh du lịch có câu chuyện theo cảnh và ánh sáng' }
  ],
  'health': [
    { title: 'Người đánh thức động lực vận động', desc: 'Đưa ra lời khích lệ và động lực vừa đủ khi không muốn vận động' },
    { title: 'Căn bếp cảm hứng ăn uống lành mạnh', desc: 'Tạo công thức lành mạnh và chữa lành theo tâm trạng và nguyên liệu' },
    { title: 'Nhà tối ưu không khí chất lượng giấc ngủ', desc: 'Tạo bầu không khí ngủ tốt toàn diện từ môi trường đến tâm lý' },
    { title: 'Người hướng dẫn cảm nhận cơ thể', desc: 'Dẫn dắt chú ý tới tín hiệu cơ thể và xây dựng kết nối thân tâm' },
    { title: 'Trợ lý nhắc tự chăm sóc', desc: 'Nhắc bạn dừng lại và chăm sóc bản thân trong lúc bận rộn' }
  ],
  'learning': [
    { title: 'Hướng dẫn khám phá tri thức dạng game', desc: 'Biến việc học kiến thức khô khan thành cuộc phiêu lưu khám phá thú vị' },
    { title: 'Bạn đồng hành học ngôn ngữ theo tình huống', desc: 'Đóng vai nhiều nhân vật để tiếp thu ngôn ngữ tự nhiên qua hội thoại tình huống' },
    { title: 'Trợ lý thỏa mãn tò mò', desc: 'Trả lời những ý nghĩ kỳ lạ và nuôi dưỡng tò mò về thế giới' },
    { title: 'Kích hoạt cảm hứng ghi chú đọc sách', desc: 'Giúp sắp xếp cảm nhận đọc sách và tìm góc suy nghĩ mới' },
    { title: 'Tạo không khí chia sẻ kiến thức', desc: 'Chuyển kiến thức đã học thành nội dung chia sẻ thú vị' }
  ],
  'relationship': [
    { title: 'Huấn luyện viên giao tiếp trong quan hệ thân mật', desc: 'Giúp bày tỏ cảm xúc khó nói và cải thiện quan hệ thân mật' },
    { title: 'Trợ lý nhắc quan tâm gia đình', desc: 'Nhắc bạn quan tâm gia đình và gợi ý tương tác ấm áp' },
    { title: 'Người tạo không khí duy trì tình bạn', desc: 'Giúp duy trì tình bạn xa cách và tạo chủ đề chung' },
    { title: 'Nhà hoạch định tỏ tình và bất ngờ', desc: 'Lên kế hoạch cho bất ngờ và khoảnh khắc lãng mạn khó quên dành cho người quan trọng' },
    { title: 'Hướng dẫn làm dịu xung đột', desc: 'Đưa ra lời khuyên và câu nói làm dịu không khí khi quan hệ căng thẳng' }
  ],
  'pet': [
    { title: 'Nhật ký nhân hóa thú cưng', desc: 'Tạo nhật ký từ góc nhìn thú cưng, ghi lại đời sống ấm áp với chủ' },
    { title: 'Người giải mã hành vi thú cưng', desc: 'Diễn giải ngôn ngữ hành vi của thú cưng, tăng kết nối với thú cưng' },
    { title: 'Nhà hoạch định thời gian bên thú cưng', desc: 'Thiết kế hoạt động sáng tạo tương tác với thú cưng để tăng gắn bó' },
    { title: 'Tạo câu chuyện kỷ niệm thú cưng', desc: 'Chuyển ảnh và ký ức về thú cưng thành câu chuyện ấm áp' },
    { title: 'Hướng dẫn yên tâm cho người mới nuôi thú cưng', desc: 'Cung cấp đồng hành và hướng dẫn ấm áp cho người mới nuôi thú cưng' }
  ],
  'finance': [
    { title: 'Trợ lý nhận biết cảm xúc tiêu dùng', desc: 'Nhận ra cảm xúc phía sau mua sắm bốc đồng và xây dựng quan điểm tiêu dùng lành mạnh' },
    { title: 'Động lực trực quan hóa mục tiêu tiết kiệm', desc: 'Chuyển mục tiêu tiết kiệm thành tiến độ giấc mơ có thể nhìn thấy' },
    { title: 'Học tài chính cá nhân nhẹ nhàng', desc: 'Học kiến thức tài chính bằng cách nhẹ nhàng và thú vị' },
    { title: 'Người làm dịu lo âu tài chính', desc: 'Cung cấp hỗ trợ cảm xúc và lời khuyên thực tế khi đối mặt áp lực tài chính' },
    { title: 'Trò chơi trải nghiệm đầu tư nhỏ', desc: 'Trải nghiệm đầu tư theo cách game hóa, giảm rào cản nhập môn' }
  ],
  'career': [
    { title: 'Người đồng hành khi mơ hồ nghề nghiệp', desc: 'Lắng nghe, cùng khám phá và gợi ý hướng đi trong giai đoạn mơ hồ nghề nghiệp' },
    { title: 'Người đánh thức cảm giác thành tựu trong công việc', desc: 'Giúp phát hiện giá trị và ý nghĩa trong công việc, thắp lại nhiệt huyết' },
    { title: 'Trợ lý không khí xã giao nơi làm việc', desc: 'Cung cấp chủ đề nhẹ nhàng và gợi ý tương tác cho giao tiếp công sở' },
    { title: 'Bộ kích hoạt cảm hứng nghề phụ', desc: 'Kích hoạt ý tưởng nghề phụ theo sở thích và kỹ năng cá nhân' },
    { title: 'Trạm tiếp sức tự tin trước phỏng vấn', desc: 'Cung cấp chuẩn bị tâm lý và khích lệ tự tin trước phỏng vấn' }
  ],
  'home': [
    { title: 'Nhà thiết kế không khí không gian nhà ở', desc: 'Thiết kế bầu không khí nhà ở theo tâm trạng và mùa' },
    { title: 'Hướng dẫn thay đổi nhà cửa bốn mùa', desc: 'Thay đổi bố trí nhà theo mùa để giữ cảm giác mới mẻ' },
    { title: 'Phép màu cho căn hộ nhỏ', desc: 'Làm cho không gian nhỏ cũng có bầu không khí thoải mái và ấm áp' },
    { title: 'Người tạo nghi thức trong nhà', desc: 'Tạo cảm giác nghi thức cho hoạt động hằng ngày tại nhà' },
    { title: 'Đồng hành tâm lý khi declutter', desc: 'Cung cấp hỗ trợ tâm lý và gợi ý quyết định khi sắp xếp đồ đạc' }
  ],
  'food': [
    { title: 'Món ăn chữa lành cho một người', desc: 'Thiết kế món ăn đơn giản và chữa lành cho người sống một mình' },
    { title: 'Thiết kế không khí bàn ăn ngày lễ', desc: 'Thiết kế bố trí bàn ăn có nghi thức cho những ngày đặc biệt' },
    { title: 'Người ghép món ăn theo tâm trạng', desc: 'Đề xuất món ăn và cách nấu phù hợp theo tâm trạng hiện tại' },
    { title: 'Xây dựng tự tin cho người mới vào bếp', desc: 'Cung cấp khích lệ ấm áp và công thức đơn giản cho người bắt đầu từ con số không' },
    { title: 'Hướng dẫn không khí chụp ảnh món ăn', desc: 'Giúp món ăn gia đình cũng có thể được chụp thật hấp dẫn' }
  ],
  'fashion': [
    { title: 'Moodboard trang phục hôm nay', desc: 'Tạo cảm hứng phối đồ theo thời tiết, dịp và tâm trạng' },
    { title: 'Stylist tủ đồ capsule', desc: 'Tạo vô số khả năng phối đồ từ số lượng món đồ hữu hạn' },
    { title: 'Hành trình khám phá phong cách cá nhân', desc: 'Giúp phát hiện và xây dựng phong cách cá nhân độc đáo' },
    { title: 'Nhà sáng tạo phối mới đồ cũ', desc: 'Cung cấp cảm hứng phối đồ mới cho quần áo cũ' },
    { title: 'Cố vấn tạo hình dịp đặc biệt', desc: 'Thiết kế diện mạo giúp tự tin cho dịp quan trọng' }
  ]
}

// Bảng ánh xạ đề xuất định sẵn dựa trên bầu không khí và cảm giác
const recommendationMap = {
  // Bầu không khí: chữa lành
  'healing': {
    'relax': ['emotion', 'lifestyle', 'health', 'home'],
    'inspire': ['creative', 'growth', 'learning', 'entertainment'],
    'connect': ['relationship', 'social', 'pet', 'emotion'],
    'escape': ['travel', 'entertainment', 'creative', 'lifestyle']
  },
  // Bầu không khí: phát triển
  'growth': {
    'relax': ['growth', 'learning', 'creative', 'health'],
    'inspire': ['career', 'learning', 'creative', 'growth'],
    'connect': ['social', 'relationship', 'career', 'learning'],
    'escape': ['travel', 'entertainment', 'creative', 'lifestyle']
  },
  // Bầu không khí: xã hội
  'social': {
    'relax': ['social', 'pet', 'food', 'home'],
    'inspire': ['social', 'creative', 'entertainment', 'travel'],
    'connect': ['relationship', 'social', 'pet', 'travel'],
    'escape': ['social', 'travel', 'entertainment', 'creative']
  },
  // Bầu không khí: khám phá
  'explore': {
    'relax': ['travel', 'creative', 'lifestyle', 'food'],
    'inspire': ['travel', 'creative', 'learning', 'entertainment'],
    'connect': ['travel', 'social', 'relationship', 'pet'],
    'escape': ['travel', 'entertainment', 'creative', 'lifestyle']
  },
  // Bầu không khí: đời thường
  'daily': {
    'relax': ['lifestyle', 'home', 'health', 'emotion'],
    'inspire': ['creative', 'food', 'fashion', 'home'],
    'connect': ['relationship', 'social', 'pet', 'lifestyle'],
    'escape': ['entertainment', 'creative', 'travel', 'lifestyle']
  }
}

const vibeOptions = [
  { label: 'Chữa lành', value: 'healing', desc: 'Ấm áp, xoa dịu, hồi phục' },
  { label: 'Phát triển', value: 'growth', desc: 'Tiến bộ, đột phá, chuyển hóa' },
  { label: 'Xã hội', value: 'social', desc: 'Kết nối, chia sẻ, tương tác' },
  { label: 'Khám phá', value: 'explore', desc: 'Tò mò, phiêu lưu, phát hiện' },
  { label: 'Đời thường', value: 'daily', desc: 'Bình dị, chân thật, hiện tại' }
]

const feelingOptions = [
  { label: 'Muốn thư giãn', value: 'relax', desc: 'Giảm áp lực, thả lỏng bản thân' },
  { label: 'Tìm cảm hứng', value: 'inspire', desc: 'Kích hoạt sáng tạo, nhận gợi mở' },
  { label: 'Khao khát kết nối', value: 'connect', desc: 'Kết nối với con người, cộng hưởng cảm xúc' },
  { label: 'Tạm thời thoát ra', value: 'escape', desc: 'Rời thực tại, trải nghiệm nhập vai' }
]

const scenarios = [
  { key: 'lifestyle', name: 'Lối sống', anchor: '#_1-lối-sống' },
  { key: 'emotion', name: 'Đồng hành cảm xúc', anchor: '#_2-đồng-hành-cảm-xúc' },
  { key: 'entertainment', name: 'Giải trí thư giãn', anchor: '#_3-giải-trí-thư-giãn' },
  { key: 'growth', name: 'Phát triển cá nhân', anchor: '#_4-phát-triển-cá-nhân' },
  { key: 'social', name: 'Tương tác xã hội', anchor: '#_5-tương-tác-xã-hội' },
  { key: 'creative', name: 'Biểu đạt sáng tạo', anchor: '#_6-biểu-đạt-sáng-tạo' },
  { key: 'travel', name: 'Khám phá du lịch', anchor: '#_7-khám-phá-du-lịch' },
  { key: 'health', name: 'Sức khỏe thân tâm', anchor: '#_8-sức-khỏe-thân-tâm' },
  { key: 'learning', name: 'Khám phá tri thức', anchor: '#_9-khám-phá-tri-thức' },
  { key: 'relationship', name: 'Nuôi dưỡng quan hệ', anchor: '#_10-nuôi-dưỡng-quan-hệ' },
  { key: 'pet', name: 'Đồng hành thú cưng', anchor: '#_11-đồng-hành-thú-cưng' },
  { key: 'finance', name: 'Sức khỏe tài chính', anchor: '#_12-sức-khỏe-tài-chính' },
  { key: 'career', name: 'Phát triển nghề nghiệp', anchor: '#_13-phát-triển-nghề-nghiệp' },
  { key: 'home', name: 'Không gian nhà ở', anchor: '#_14-không-gian-nhà-ở' },
  { key: 'food', name: 'Ẩm thực nấu nướng', anchor: '#_15-ẩm-thực-nấu-nướng' },
  { key: 'fashion', name: 'Phong cách ăn mặc', anchor: '#_16-phong-cách-ăn-mặc' }
]

// Tính kết quả đề xuất: lấy ngẫu nhiên từ nhóm chủ đề
const recommendationTopics = computed(() => {
  if (!vibePoint.value || !feeling.value) return []
  
  const keys = recommendationMap[vibePoint.value]?.[feeling.value] || []
  const topics = []
  
  // Lấy ngẫu nhiên 1-2 chủ đề từ mỗi kịch bản được đề xuất
  keys.forEach(key => {
    const scenario = scenarios.find(item => item.key === key)
    const scenarioTopics = topicPool[key] || []
    
    if (scenario && scenarioTopics.length > 0) {
      // Lấy ngẫu nhiên 1-2 chủ đề
      const count = Math.floor(Math.random() * 2) + 1
      const shuffled = [...scenarioTopics].sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, Math.min(count, shuffled.length))
      
      selected.forEach(topic => {
        topics.push({
          ...topic,
          scenarioKey: key,
          scenarioName: scenario.name,
          scenarioAnchor: scenario.anchor
        })
      })
    }
  })
  
  // Sắp xếp ngẫu nhiên và giới hạn tổng số
  return topics.sort(() => Math.random() - 0.5).slice(0, 8)
})

// Lấy mô tả của lựa chọn hiện tại
const currentSelection = computed(() => {
  const vibe = vibeOptions.find(i => i.value === vibePoint.value)
  const feel = feelingOptions.find(p => p.value === feeling.value)
  return {
    vibe: vibe?.label || '',
    feeling: feel?.label || ''
  }
})

const scrollToAnchor = (anchor) => {
  // Trì hoãn cuộn để đảm bảo DOM đã cập nhật
  setTimeout(() => {
    // Thử tìm bằng ID (hỗ trợ nhiều định dạng)
    let element = document.querySelector(anchor)
    
    // Nếu không tìm thấy, thử định dạng ID khác
    if (!element) {
      // Thử bỏ tiền tố gạch dưới
      const altAnchor = anchor.replace('#_', '#')
      element = document.querySelector(altAnchor)
    }
    
    // Nếu vẫn không tìm thấy, tìm theo văn bản tiêu đề
    if (!element) {
      // Trích tên kịch bản từ anchor
      const anchorText = decodeURIComponent(anchor.replace('#', '').replace(/^_/, ''))
      const headings = document.querySelectorAll('h2, h3')
      
      for (let heading of headings) {
        const headingText = heading.textContent.trim()
        // Khớp chính xác hoặc khớp bao gồm
        const cleanHeading = headingText.replace(/^\d+\.\s*/, '')
        if (cleanHeading === anchorText || headingText.includes(anchorText)) {
          element = heading
          break
        }
      }
    }
    
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
      // Làm nổi bật đoạn mục tiêu
      element.style.backgroundColor = '#fdf2f8'
      element.style.transition = 'background-color 0.3s'
      element.style.padding = '8px'
      element.style.borderRadius = '4px'
      setTimeout(() => {
        element.style.backgroundColor = ''
        element.style.padding = ''
      }, 2000)
    }
  }, 100)
}

const resetSelection = () => {
  vibePoint.value = ''
  feeling.value = ''
}
</script>

# Tham khảo cảm hứng cho kịch bản tiêu dùng B2C

## Dẫn nhập chương

<ChapterIntroduction :duration="duration" :tags="['Ứng dụng B2C', 'Lối sống', 'Trải nghiệm cảm xúc', 'Tạo bầu không khí']" coreOutput="Khám phá hơn 15 cảm hứng kịch bản đời sống" expectedOutput="Tìm hướng sản phẩm chạm tới người dùng">

Tài liệu này tổng hợp <strong>các hướng ứng dụng sáng tạo của mô hình LLM trong kịch bản tiêu dùng B2C</strong>. Khác với sản phẩm B2B tập trung vào hiệu suất và điểm đau, sản phẩm B2C chú trọng hơn đến <strong>tạo cảm giác, gợi ý tâm lý và bầu không khí</strong>, để người dùng có cộng hưởng cảm xúc và trải nghiệm tốt đẹp trong quá trình sử dụng.

</ChapterIntroduction>

## Chọn nhanh bầu không khí kịch bản

<el-card shadow="hover" style="margin-top: 16px; margin-bottom: 24px; border-left: 5px solid #ec4899;">
  <div style="font-weight: 600; margin-bottom: 8px;">Tìm cảm hứng kịch bản chạm tới bạn</div>
  <div style="color: #606266; font-size: 14px; line-height: 1.6; margin-bottom: 12px;">
    Chọn bầu không khí bạn muốn và cảm giác hiện tại. Hệ thống sẽ đề xuất các hướng kịch bản liên quan; bấm vào thẻ để nhảy tới phần tương ứng.
  </div>
  <el-row :gutter="16">
    <el-col :span="12">
      <el-select v-model="vibePoint" placeholder="Chọn loại bầu không khí" style="width: 100%;">
        <el-option
          v-for="item in vibeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <div style="font-weight: 500;">{{ item.label }}</div>
          <div style="font-size: 12px; color: #909399;">{{ item.desc }}</div>
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="12">
      <el-select v-model="feeling" placeholder="Chọn cảm giác hiện tại" style="width: 100%;">
        <el-option
          v-for="item in feelingOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <div style="font-weight: 500;">{{ item.label }}</div>
          <div style="font-size: 12px; color: #909399;">{{ item.desc }}</div>
        </el-option>
      </el-select>
    </el-col>
  </el-row>
  
  <div v-if="recommendationTopics.length > 0" style="margin-top: 16px;">
    <div style="font-weight: 600; margin-bottom: 12px; color: #ec4899;">
      Kịch bản {{ currentSelection.vibe }} × {{ currentSelection.feeling }} được đề xuất cho bạn:
    </div>
    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
      <el-tag
        v-for="topic in recommendationTopics"
        :key="topic.title"
        type="danger"
        effect="light"
        style="cursor: pointer; margin-bottom: 4px;"
        @click="scrollToAnchor(topic.scenarioAnchor)"
      >
        {{ topic.title }}
      </el-tag>
    </div>
    <el-button type="text" size="small" @click="resetSelection" style="margin-top: 8px;">
      Chọn lại
    </el-button>
  </div>
</el-card>

---

## 1. Lối sống

> 💡 **Ý tưởng cốt lõi**: biến đời thường thành trải nghiệm có nghi thức, tạo cái đẹp trong từng chi tiết

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | Trợ lý đánh thức bằng nghi thức buổi sáng | Tích hợp API thời tiết và dữ liệu lịch; LLM tạo kế hoạch buổi sáng cá nhân hóa; kết hợp loa thông minh phát nhạc riêng và đèn thông minh sáng dần |
| 2 | Nhà tạo không khí cho người sống một mình | Kết nối thiết bị nhà thông minh (đèn, loa, máy khuếch tán hương); LLM tự điều chỉnh theo thời gian/tâm trạng; học sở thích người dùng để tối ưu liên tục |
| 3 | Trình tạo kế hoạch chữa lành cuối tuần ở nhà | Kết nối API nền tảng streaming để lấy danh sách phim, kết hợp lịch sử sở thích để tạo combo phim + món ăn + bố trí không gian |
| 4 | Đài phát thanh an ủi trước khi ngủ | Tạo câu chuyện dịu dàng bằng TTS, trộn white noise, giảm âm lượng thông minh; điều chỉnh nội dung theo dữ liệu giấc ngủ |
| 5 | Bộ bắt cảm hứng thẩm mỹ đời sống | Dùng nhận diện hình ảnh phân tích ảnh môi trường của người dùng, LLM tạo gợi ý thẩm mỹ; đề xuất nội dung theo phong cách Pinterest/Xiaohongshu |

---

## 2. Đồng hành cảm xúc

> 💡 **Ý tưởng cốt lõi**: tiếp nhận và đồng hành vô điều kiện, trở thành chiếc bình dịu dàng chứa cảm xúc

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | Người lắng nghe tâm sự đêm khuya | Mã hóa đầu cuối bảo vệ quyền riêng tư; phân tích cảm xúc bằng LLM để hiểu tâm trạng; bộ nhớ dài hạn lưu câu chuyện người dùng và đồng hành qua nhiều lượt đối thoại |
| 2 | Người đồng hành chữa lành sau chia tay | Thuật toán nhận diện giai đoạn cảm xúc, cung cấp hỗ trợ theo từng giai đoạn (tâm sự -> xả cảm xúc -> tái xây dựng); truy xuất RAG từ kho tri thức tâm lý học |
| 3 | Huấn luyện viên thở giảm lo âu | Kết nối dữ liệu cảm biến sinh học (nhịp tim/hơi thở), giám sát mức lo âu theo thời gian thực; giọng nói hướng dẫn nhịp thở và thư giãn cơ tiến triển |
| 4 | Cố vấn xây dựng lại tự tin | Khung đối thoại tâm lý học tích cực, ghi nhận và phản hồi các thành tựu nhỏ; kỹ thuật tái cấu trúc nhận thức giúp thay đổi tự thoại tiêu cực |
| 5 | Diễn giải thông minh nhật ký cảm xúc | Mô hình NLP nhận diện cảm xúc, phân tích chuỗi thời gian để phát hiện quy luật tâm trạng; trực quan hóa bản đồ cảm xúc và cảnh báo dự đoán |

---

## 3. Giải trí thư giãn

> 💡 **Ý tưởng cốt lõi**: tạo trải nghiệm nhập vai, để giải trí trở thành nơi tâm hồn nghỉ chân

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | DM nhập vai cho trò chơi suy luận | LLM tạo nhánh cốt truyện theo thời gian thực, tổng hợp giọng nói để đóng vai NPC, điều chỉnh độ khó và nhịp theo phản ứng người chơi; dựng cảnh AR/VR |
| 2 | NPC có linh hồn trong game thế giới mở | Cơ sở dữ liệu bộ nhớ dài hạn lưu lịch sử tương tác của người chơi, LLM tạo hội thoại cá nhân hóa; tính toán cảm xúc giúp NPC có phản ứng cảm xúc thật |
| 3 | Tạo nội dung podcast cá nhân hóa | Tạo nội dung riêng theo biểu đồ sở thích người dùng, TTS sao chép giọng người dùng thích; tương tác thời gian thực để trả lời câu hỏi người nghe |
| 4 | Nhóm tạo không khí cho concert ảo | Render nhân vật ảo, tương tác bình luận thời gian thực, lightstick/đạo cụ cổ vũ ảo; âm thanh không gian tạo cảm giác hiện trường |
| 5 | Bạn đồng sáng tạo tiểu thuyết tương tác | LLM tạo cốt truyện theo thời gian thực, lựa chọn người dùng ảnh hưởng hướng đi câu chuyện; thiết kế nhiều kết thúc và phát triển quan hệ nhân vật động |

---

## 4. Phát triển cá nhân

> 💡 **Ý tưởng cốt lõi**: trưởng thành không phải khổ hạnh, mà là hành trình tự khám phá thú vị

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | Người chứng kiến phát triển cá nhân | Trực quan hóa hành trình trưởng thành bằng timeline, tự động đánh dấu cột mốc; ảnh so sánh hiển thị "tôi ngày trước" và "tôi hiện tại" |
| 2 | Huấn luyện viên game hóa thói quen | Cơ chế game hóa (điểm kinh nghiệm, cấp độ, huy hiệu), bảng xếp hạng xã hội, AI coach nhập vai như "cố vấn phiêu lưu" |
| 3 | Ghép đôi bạn học kỹ năng | Thuật toán ghép đôi theo sở thích và mục tiêu học tập, cộng đồng nhóm học, cơ chế check-in giám sát lẫn nhau |
| 4 | Người phát hiện niềm vui nhỏ mỗi ngày | Nhận diện hình ảnh để phát hiện khoảnh khắc đẹp trong đời sống, hướng dẫn gratitude journal, nhìn lại khoảnh khắc đẹp mỗi tuần |
| 5 | Trình trải nghiệm mô phỏng cuộc đời | Cốt truyện nhiều nhánh mô phỏng kết quả của lựa chọn khác nhau, so sánh cuộc đời song song; trực quan hóa hệ quả quyết định |

---

## 5. Tương tác xã hội

> 💡 **Ý tưởng cốt lõi**: làm giao tiếp trở nên nhẹ nhàng tự nhiên, tìm cách kết nối thoải mái

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | Trình tạo chủ đề phá băng | Đề xuất chủ đề thông minh theo dịp và người tham gia, phân tích hội thoại thời gian thực để gợi ý nối tiếp; nhắc cứu nguy lúc ngượng |
| 2 | Người tạo không khí caption mạng xã hội | Phân tích nội dung ảnh, LLM tạo caption nhiều phong cách (văn nghệ/hài hước/sâu lắng); đề xuất emoji và bố cục thông minh |
| 3 | Nhà hoạch định không khí hẹn hò | Tạo kế hoạch hẹn hò theo sở thích hai bên, đề xuất nhà hàng/hoạt động, gợi ý chủ đề trò chuyện; nhắc thời tiết và giao thông thời gian thực |
| 4 | Người khuấy động họp mặt từ xa | Thư viện game online, trình tạo hoạt động phá băng, vòng quay chủ đề; nền ảo và filter tăng không khí |
| 5 | Trợ lý quản lý năng lượng xã hội | Đánh giá mức tiêu hao năng lượng sau hoạt động xã hội, gợi ý phục hồi (hoạt động một mình); lập kế hoạch lịch xã hội thông minh |

---

## 6. Biểu đạt sáng tạo

> 💡 **Ý tưởng cốt lõi**: ai cũng có năng lực sáng tạo, chỉ cần được đánh thức

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | Bộ sơ cứu khi cạn cảm hứng | Thuật toán liên tưởng liên lĩnh vực, tạo từ kích thích ngẫu nhiên, thư viện prompt sáng tạo; công cụ mở rộng ý tưởng dạng mind map |
| 2 | Hướng dẫn khám phá phong cách cá nhân | Phân tích hình ảnh để nhận diện phong cách hiện có, đề xuất xu hướng phong cách, thử đồ/trang điểm ảo; timeline tiến hóa phong cách |
| 3 | Cố vấn thẩm mỹ cho sổ tay và nhật ký | Đề xuất mẫu bố cục, tạo phối màu, gợi ý yếu tố trang trí; nhận dạng chữ viết tay và làm đẹp nội dung |
| 4 | Hướng dẫn bố cục và không khí nhiếp ảnh | Nhận diện cảnh và gợi ý bố cục, đề xuất phong cách filter, tự điều chỉnh tham số chỉnh ảnh; lộ trình học kỹ thuật nhiếp ảnh |
| 5 | Người ghép nhạc theo tâm trạng | Thuật toán phân tích cảm xúc âm nhạc, nhận diện tâm trạng người dùng, tạo playlist cá nhân hóa; giới thiệu câu chuyện và bối cảnh âm nhạc |

---

## 7. Khám phá du lịch

> 💡 **Ý tưởng cốt lõi**: du lịch không chỉ là ngắm cảnh, mà còn là cảm nhận những lối sống khác nhau

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | Hướng dẫn dạo phố khám phá | Tổng hợp nội dung từ người địa phương am hiểu, đề xuất địa điểm ít người biết, chỉ dẫn AR; dịch thời gian thực và thuyết minh giọng nói |
| 2 | Tạo nhật ký tâm trạng du lịch | Tự phân loại và chọn ảnh, LLM tạo bài du ký đẹp, timeline gắn vị trí địa lý; tạo video du lịch một chạm |
| 3 | Trợ lý đồng hành du lịch một mình | Chia sẻ vị trí và nhắc an toàn theo thời gian thực, liên hệ khẩn cấp địa phương, AI hướng dẫn viên đồng hành bằng giọng nói; cộng đồng người đi một mình |
| 4 | Xem trước bầu không khí điểm đến | Xem trước VR/360°, mô phỏng âm thanh và mùi địa phương, giới thiệu bối cảnh văn hóa; trải nghiệm "ở thử" ảo |
| 5 | Hướng dẫn không khí nhiếp ảnh du lịch | Nhắc golden hour, đường hỗ trợ bố cục, đề xuất điểm chụp đặc trưng địa phương; gợi ý phong cách chỉnh màu hậu kỳ |

---

## 8. Sức khỏe thân tâm

> 💡 **Ý tưởng cốt lõi**: sức khỏe không phải mục tiêu, mà là một cách tự chăm sóc dịu dàng

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | Người đánh thức động lực vận động | Đề xuất loại vận động thông minh theo trạng thái người dùng, lựa chọn micro workout 5 phút, thử thách vận động game hóa; check-in vận động xã hội |
| 2 | Căn bếp cảm hứng ăn uống lành mạnh | Nhận diện nguyên liệu trong tủ lạnh, đề xuất công thức cá nhân hóa, phân tích phối hợp dinh dưỡng; hướng dẫn nấu ăn step-by-step |
| 3 | Nhà tối ưu không khí chất lượng giấc ngủ | Phân tích dữ liệu theo dõi giấc ngủ, tạo nghi thức trước khi ngủ, gợi ý tối ưu môi trường (nhiệt độ/độ ẩm/ánh sáng); đánh thức thông minh |
| 4 | Người hướng dẫn cảm nhận cơ thể | Hướng dẫn thiền quét cơ thể, liên kết bộ phận cơ thể với cảm xúc, bài tập kết nối thân tâm; trực quan hóa biofeedback |
| 5 | Trợ lý nhắc tự chăm sóc | Theo dõi cường độ làm việc, nhắc nghỉ ngơi định kỳ, gợi ý hoạt động tự chăm sóc nhỏ (uống nước/giãn cơ/hít thở sâu); ghi chép tự chăm sóc |

---

## 9. Khám phá tri thức

> 💡 **Ý tưởng cốt lõi**: học tập là cuộc phiêu lưu không có điểm dừng, tò mò là người thầy tốt nhất

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | Hướng dẫn khám phá tri thức dạng game | Trực quan hóa bản đồ điểm kiến thức, lộ trình học theo màn chơi, hệ thống huy hiệu thành tựu; AI mentor nhập vai |
| 2 | Bạn đồng hành học ngôn ngữ theo tình huống | LLM đóng vai nhiều nhân vật để hội thoại, sửa phát âm, giới thiệu bối cảnh văn hóa; mô phỏng tình huống nhập vai |
| 3 | Trợ lý thỏa mãn tò mò | Kết nối Wikipedia/knowledge graph, giải thích khái niệm phức tạp theo cách dễ hiểu, đề xuất kiến thức liên quan; ghi lại tò mò |
| 4 | Kích hoạt cảm hứng ghi chú đọc sách | Phân tích nội dung sách, trích xuất và liên kết quan điểm, đề xuất góc suy nghĩ; mẫu ghi chú đọc sách và làm đẹp |
| 5 | Tạo không khí chia sẻ kiến thức | Tự tạo thẻ kiến thức, tối ưu copy chia sẻ, làm đẹp thị giác; phản hồi dữ liệu chia sẻ xã hội |

---

## 10. Nuôi dưỡng quan hệ

> 💡 **Ý tưởng cốt lõi**: quan hệ tốt cần được chăm chút, nhưng chăm chút không cần quá phức tạp

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | Huấn luyện viên giao tiếp trong quan hệ thân mật | Tạo mẫu biểu đạt cảm xúc, hướng dẫn kỹ năng giao tiếp phi bạo lực, câu nói hóa giải xung đột; đánh giá sức khỏe quan hệ |
| 2 | Trợ lý nhắc quan tâm gia đình | Nhắc ngày quan trọng (sinh nhật/kỷ niệm), gợi ý lời quan tâm, đề xuất hoạt động gia đình; tạo album gia đình |
| 3 | Người tạo không khí duy trì tình bạn | Ghi lại tương tác với bạn bè, đề xuất chủ đề chung, tổ chức họp mặt từ xa; tạo timeline tình bạn và ký ức |
| 4 | Nhà hoạch định tỏ tình và bất ngờ | Tạo phương án bất ngờ cá nhân hóa, đề xuất quà tặng, gợi ý lời nói lãng mạn; lịch thực hiện và nhắc nhở |
| 5 | Hướng dẫn làm dịu xung đột | Câu nói hạ nhiệt cảm xúc, hướng dẫn đổi góc nhìn, gợi ý bước hòa giải; theo dõi quá trình sửa chữa quan hệ |

---

## 11. Đồng hành thú cưng

> 💡 **Ý tưởng cốt lõi**: thú cưng là gia đình, sự đồng hành của chúng đáng được ghi lại và trân trọng

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | Nhật ký nhân hóa thú cưng | Phân tích hành vi thú cưng, tạo nhật ký ngôi thứ nhất, tự ghép ảnh; "vòng bạn bè" của thú cưng |
| 2 | Người giải mã hành vi thú cưng | Phân tích video hành vi thú cưng, cảnh báo sức khỏe, gợi ý huấn luyện; kho tri thức đặc tính giống loài |
| 3 | Nhà hoạch định thời gian bên thú cưng | Đề xuất hoạt động cho thú cưng, hướng dẫn DIY đồ chơi, gợi ý địa điểm thân thiện với thú cưng; ghép đôi xã hội cho thú cưng |
| 4 | Tạo câu chuyện kỷ niệm thú cưng | Chọn ảnh và video, tạo câu chuyện theo timeline, phối nhạc; tự tạo album/video kỷ niệm |
| 5 | Hướng dẫn yên tâm cho người mới nuôi thú cưng | Hướng dẫn chăm sóc theo giai đoạn, trả lời câu hỏi thường gặp, xử lý tình huống khẩn cấp; hỗ trợ cộng đồng người mới |

---

## 12. Sức khỏe tài chính

> 💡 **Ý tưởng cốt lõi**: tự do tài chính không phải mục tiêu duy nhất, sức khỏe tài chính mới là điều cần giữ

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | Trợ lý nhận biết cảm xúc tiêu dùng | Phân tích ghi chép tiêu dùng, phân tích liên hệ cảm xúc-tiêu dùng, cảnh báo mua sắm bốc đồng; gợi ý thỏa mãn thay thế |
| 2 | Động lực trực quan hóa mục tiêu tiết kiệm | Trực quan hóa tiến độ mục tiêu, render bối cảnh giấc mơ, ăn mừng cột mốc; trò chơi xây dựng thói quen tiết kiệm |
| 3 | Học tài chính cá nhân nhẹ nhàng | Đẩy kiến thức dạng mảnh nhỏ, dạy bằng tình huống và case, hỏi đáp tương tác; kiểm tra kiến thức và chứng nhận |
| 4 | Người làm dịu lo âu tài chính | Đánh giá sức khỏe tình trạng tài chính, kỹ thuật quản lý áp lực, kế hoạch hành động từng bước nhỏ; tư vấn tâm lý tài chính |
| 5 | Trò chơi trải nghiệm đầu tư nhỏ | Mô phỏng đầu tư ảo, giáo dục rủi ro, trò chơi danh mục đầu tư; hướng dẫn đầu tư nhỏ thật |

---

## 13. Phát triển nghề nghiệp

> 💡 **Ý tưởng cốt lõi**: nghề nghiệp không phải đường ray cố định, mà là vùng đất rộng có thể khám phá

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | Người đồng hành khi mơ hồ nghề nghiệp | Đánh giá hứng thú nghề nghiệp, kiểm kê năng lực, đề xuất thông tin ngành; đối thoại với cố vấn nghề nghiệp |
| 2 | Người đánh thức cảm giác thành tựu công việc | Ghi lại kết quả công việc, chắt lọc giá trị, trực quan hóa thành tựu; thu thập phản hồi tích cực từ đồng nghiệp/khách hàng |
| 3 | Trợ lý không khí xã giao nơi làm việc | Đề xuất chủ đề công sở, kỹ năng networking, sự kiện ngành; tối ưu nội dung LinkedIn |
| 4 | Bộ kích hoạt cảm hứng nghề phụ | Ghép kỹ năng-sở thích-nhu cầu thị trường, thư viện case nghề phụ, hướng dẫn khởi động; cộng đồng nghề phụ |
| 5 | Trạm tiếp sức tự tin trước phỏng vấn | Phỏng vấn mô phỏng, chuẩn bị câu hỏi thường gặp, kỹ thuật tăng tự tin; gợi ý hình ảnh cá nhân |

---

## 14. Không gian nhà ở

> 💡 **Ý tưởng cốt lõi**: nhà không chỉ là nơi ở, mà còn là nơi tâm hồn nghỉ ngơi

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | Nhà thiết kế không khí không gian nhà ở | Phân tích ảnh không gian, đề xuất phong cách, gợi ý nội thất/trang trí; xem trước hiệu quả bằng AR |
| 2 | Hướng dẫn thay đổi nhà cửa bốn mùa | Đề xuất chủ đề theo mùa, gợi ý lưu trữ và trưng bày, phương án trang trí ngày lễ; tạo danh sách mua sắm |
| 3 | Phép màu cho căn hộ nhỏ | Thuật toán tối ưu không gian, đề xuất đồ nội thất đa năng, mẹo lưu trữ; kỹ thuật mở rộng thị giác |
| 4 | Người tạo nghi thức tại nhà | Thiết kế nghi thức hằng ngày (sáng/tối/cuối tuần), nhắc thực hiện nghi thức; phản hồi hiệu quả nghi thức |
| 5 | Đồng hành tâm lý khi declutter | Đánh giá giá trị cảm xúc của đồ vật, hướng dẫn từng bước declutter, hỗ trợ tâm lý; đề xuất kênh quyên góp/tái chế |

---

## 15. Ẩm thực nấu nướng

> 💡 **Ý tưởng cốt lõi**: thức ăn là ngôn ngữ của tình yêu, nấu nướng là cách biểu đạt tình yêu

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | Món ăn chữa lành cho một người | Nhận diện nguyên liệu trong tủ lạnh, đề xuất công thức đơn giản, hướng dẫn step-by-step; thẩm mỹ bày món cho một người |
| 2 | Thiết kế không khí bàn ăn ngày lễ | Thực đơn chủ đề ngày lễ, phương án bày bàn, kỹ thuật tạo bầu không khí; tối ưu trải nghiệm khách mời |
| 3 | Người ghép món ăn theo tâm trạng | Thuật toán liên hệ tâm trạng-thức ăn, công thức điều tiết cảm xúc, đề xuất comfort food; hướng dẫn chữa lành bằng nấu ăn |
| 4 | Xây dựng tự tin cho người mới vào bếp | Công thức siêu đơn giản, mẹo cứu lỗi, lời động viên xây dựng tự tin; tăng độ khó dần dần |
| 5 | Hướng dẫn không khí chụp ảnh món ăn | Gợi ý bày món, tận dụng ánh sáng tự nhiên, hướng dẫn góc chụp; gợi ý filter và hậu kỳ |

---

## 16. Phong cách ăn mặc

> 💡 **Ý tưởng cốt lõi**: ăn mặc là tự biểu đạt, phong cách là phần bên trong hiện ra bên ngoài

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | Moodboard trang phục hôm nay | Đề xuất tổng hợp theo thời tiết/dịp/tâm trạng, thử đồ ảo, cảm hứng phối đồ; quản lý tủ đồ |
| 2 | Stylist tủ đồ capsule | Kiểm kê tủ đồ, tổ hợp phối từng món, nhiều cách mặc một món; gợi ý mua sắm để lấp khoảng trống |
| 3 | Hành trình khám phá phong cách cá nhân | Trắc nghiệm phong cách, đề xuất icon tham khảo, lộ trình tiến hóa phong cách; xây dựng tự tin |
| 4 | Nhà sáng tạo phối mới đồ cũ | Cảm hứng cải tạo đồ cũ, cách phối mới, kỹ thuật nhấn bằng phụ kiện; triết lý thời trang bền vững |
| 5 | Cố vấn tạo hình dịp đặc biệt | Giải thích dress code theo dịp, tạo phương án tạo hình, gợi ý trang điểm và tóc; phối hợp tổng thể |

---

## Tâm pháp cốt lõi khi thiết kế sản phẩm B2C

### 1. Từ "chức năng" đến "cảm giác"

Sản phẩm B2B quan tâm "chức năng này giải quyết vấn đề gì", còn sản phẩm B2C quan tâm "chức năng này mang lại cảm giác gì".

| Tư duy B2B | Tư duy B2C |
|---------|---------|
| Nâng cao hiệu suất | Tiết kiệm thời gian để làm việc mình thích |
| Giảm chi phí | Khiến từng đồng chi ra đều đáng giá |
| Giải quyết điểm đau | Tạo trải nghiệm tốt đẹp |
| Chức năng đầy đủ | Cảm giác đúng chỗ |

### 2. Ba tầng tạo bầu không khí

**Tầng giác quan**: thiết kế thị giác, thính giác và xúc giác
- Màu sắc ấm áp
- Âm thanh thư giãn
- Hiệu ứng chuyển động mượt mà

**Tầng cảm xúc**: cộng hưởng và dẫn dắt cảm xúc
- Hiểu tâm trạng người dùng
- Cung cấp hỗ trợ cảm xúc
- Tạo cảm xúc tích cực

**Tầng ý nghĩa**: sự công nhận giá trị và cảm giác thuộc về
- Khiến người dùng cảm thấy được thấu hiểu
- Tạo cảm giác thuộc về
- Trao ý nghĩa cho hành động

### 3. Sức mạnh của gợi ý tâm lý

Copy và thiết kế của sản phẩm B2C đều đang truyền tải gợi ý tâm lý:

- **Gợi ý tích cực**: "Bạn đã làm rất tốt rồi", "Cứ từ từ, không sao cả"
- **Gợi ý thuộc về**: "Nhiều người cũng giống bạn", "Bạn không cô đơn"
- **Gợi ý trưởng thành**: "Mỗi lần thử đều là tiến bộ", "Bạn đang trở nên tốt hơn"

### 4. Giúp người dùng trở thành phiên bản tốt hơn của chính họ

Sản phẩm B2C tốt nhất không phải là thay đổi người dùng, mà là giúp họ trở thành con người họ muốn trở thành.

- Không phải "bạn nên...", mà là "bạn có thể..."
- Không phải "bạn phải...", mà là "nếu bạn muốn..."
- Không phải "bạn vẫn chưa đủ...", mà là "bạn đã..."

---

> 🌟 **Hãy nhớ**: người dùng B2C mua không phải chức năng, mà là cảm giác; không phải công cụ, mà là sự đồng hành; không phải dịch vụ, mà là sự thấu hiểu.

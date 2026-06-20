import os
import requests
import json
import time

# ==========================================
# CẤU HÌNH API CỦA BẠN Ở ĐÂY
# ==========================================
API_URL = "https://ds2api.jukaza.site/v1/chat/completions" # Thay bằng URL API của bạn (ví dụ: http://localhost:3000/v1/chat/completions)
API_KEY = "sk-26b32ce9f6999b2e-413wxt-6691f348" # ĐIỀN API KEY CỦA BẠN VÀO ĐÂY
MODEL_NAME = "mimo-v2.5" # Điền tên model bạn muốn dùng

# Thư mục nguồn và đích
SRC_DIR = ".temp_easy_vibe_fast/docs/vi-vn"
DEST_DIR = "docs/vibe-coding"

# Bỏ qua các file đã làm thủ công
SKIP_FILES = [
    "appendix/1-computer-fundamentals/transistor-to-cpu.md",
    "appendix/1-computer-fundamentals/operating-systems.md",
    "appendix/1-computer-fundamentals/data-encoding-storage.md",
    "stage-1/learning-map/index.md",
    "stage-1/introduction-to-ai-ide/index.md",
    "stage-3/index.md"
]

SYSTEM_PROMPT = """Bạn là một chuyên gia biên dịch tài liệu kỹ thuật sang tiếng Việt.
Nhiệm vụ của bạn là nhận nội dung Markdown của một bài giảng lập trình (Vibe Coding) và thực hiện các bước sau:
1. Sửa lỗi chính tả tiếng Việt, thêm đầy đủ dấu tiếng Việt chuẩn xác (nếu văn bản đang không có dấu).
2. Dịch văn phong cho tự nhiên, dễ hiểu, hướng tới đối tượng người dùng không chuyên (non-tech).
3. XOÁ HOÀN TOÀN bất kỳ chữ tiếng Trung nào còn sót lại.
4. XOÁ HOÀN TOÀN các đường link, logo hoặc badge trỏ về repo Github gốc, hoặc các link trỏ đến Đại học Thanh Hoa, các nền tảng nội địa Trung Quốc.
5. GIỮ NGUYÊN cấu trúc Markdown, code blocks, bảng biểu và các thẻ Component đặc biệt (như <ComponentDemo />).
Chỉ trả về nội dung Markdown đã xử lý, không giải thích gì thêm.
"""

def translate_content(content):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }
    
    payload = {
        "model": MODEL_NAME,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": content}
        ],
        "temperature": 0.3
    }
    
    max_retries = 5
    for attempt in range(max_retries):
        try:
            response = requests.post(API_URL, headers=headers, json=payload, timeout=300)
            if response.status_code == 429 or response.status_code >= 500:
                print(f"Lỗi {response.status_code}. Đang thử lại (lần {attempt + 1}/{max_retries})...", flush=True)
                time.sleep(5)
                continue
            
            response.raise_for_status()
            result = response.json()
            return result['choices'][0]['message']['content']
        except Exception as e:
            if attempt < max_retries - 1:
                print(f"Lỗi: {e}. Đang thử lại (lần {attempt + 1}/{max_retries})...", flush=True)
                time.sleep(5)
            else:
                print(f"\nLỗi gọi API sau {max_retries} lần thử: {e}", flush=True)
                return None
    return None

def main():
    if API_KEY == "sk-...":
        print("Vui lòng mở file translate_docs.py và điền API_KEY của bạn vào trước khi chạy!")
        return

    for root, dirs, files in os.walk(SRC_DIR):
        for file in files:
            if not file.endswith('.md'):
                continue
                
            src_path = os.path.join(root, file)
            rel_path = os.path.relpath(src_path, SRC_DIR)
            
            # Skip file nếu đã làm
            if rel_path in SKIP_FILES:
                print(f"Bỏ qua (đã xử lý): {rel_path}")
                continue
                
            dest_path = os.path.join(DEST_DIR, rel_path)
            
            # Skip file nếu đã tồn tại ở đích
            if os.path.exists(dest_path):
                print(f"Bỏ qua (đã tồn tại): {rel_path}")
                continue
            
            # Tạo thư mục đích nếu chưa có
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            
            # Đọc file nguồn
            with open(src_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            print(f"Đang dịch: {rel_path} ...", end=" ", flush=True)
            
            translated_content = translate_content(content)
            
            if translated_content:
                # Lưu file đích
                with open(dest_path, 'w', encoding='utf-8') as f:
                    f.write(translated_content)
                print("Thành công!")
            else:
                print("Thất bại!")
            
            # Tránh rate limit
            time.sleep(1)

if __name__ == "__main__":
    main()

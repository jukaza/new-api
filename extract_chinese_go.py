import os
import re

chinese_re = re.compile(r'[\u4e00-\u9fa5]')

def find_chinese_in_strings(file_path):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    results = []
    lines = content.split('\n')
    
    for i, line in enumerate(lines, 1):
        if not chinese_re.search(line):
            continue
        
        stripped = line.strip()
        if stripped.startswith('//'):
            continue
            
        double_quote_strings = re.findall(r'"([^"\\]|\\.)*"', line)
        backtick_strings = re.findall(r'`([^`\\]|\\.)*`', line)
        
        has_chinese_string = False
        for s in double_quote_strings + backtick_strings:
            if any(chinese_re.search(part) for part in s if isinstance(part, str)):
                has_chinese_string = True
                break
        
        if '//' in line:
            parts = line.split('//')
            left = parts[0]
            if chinese_re.search(left):
                has_chinese_string = True
                
        if has_chinese_string or (chinese_re.search(line) and not stripped.startswith('//') and not stripped.startswith('/*') and not stripped.endswith('*/')):
            results.append((i, line.strip()))
            
    return results

def main():
    exclude_dirs = {'web', '.git', '.rsbuild', 'node_modules', 'dist', 'bin'}
    go_files_with_chinese = []
    
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for file in files:
            if file.endswith('.go'):
                path = os.path.join(root, file)
                res = find_chinese_in_strings(path)
                if res:
                    go_files_with_chinese.append((path, res))
                    
    with open('chinese_go_results.txt', 'w', encoding='utf-8') as f:
        for path, res in go_files_with_chinese:
            f.write(f"\nFILE: {path}\n")
            for line_num, content in res:
                f.write(f"  Line {line_num}: {content}\n")

if __name__ == '__main__':
    main()

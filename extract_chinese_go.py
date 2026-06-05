import os
import re

chinese_re = re.compile(r'[\u4e00-\u9fa5]')

def strip_line_comments(line):
    """Remove // comments, respecting string literals."""
    result = []
    i = 0
    in_string = False
    string_char = None
    escape = False
    while i < len(line):
        c = line[i]
        if in_string:
            if escape:
                escape = False
            elif c == '\\':
                escape = True
            elif c == string_char:
                in_string = False
        else:
            if c == '"' or c == '`':
                in_string = True
                string_char = c
                escape = False
            elif c == '/' and i + 1 < len(line) and line[i + 1] == '/':
                break
        result.append(c)
        i += 1
    return ''.join(result)

def extract_string_literals(line):
    """Extract Go string literals ("..." and `...`) from a line."""
    strings = []
    i = 0
    in_string = False
    string_char = None
    start = 0
    escape = False
    while i < len(line):
        c = line[i]
        if in_string:
            if escape:
                escape = False
            elif c == '\\':
                escape = True
            elif c == string_char:
                strings.append(line[start:i + 1])
                in_string = False
        else:
            if c == '"' or c == '`':
                in_string = True
                string_char = c
                start = i
                escape = False
        i += 1
    return strings

def find_chinese_in_code(file_path):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    results = []
    lines = content.split('\n')

    for i, line in enumerate(lines, 1):
        if not chinese_re.search(line):
            continue

        # Remove block comments /* ... */ (simple version, single line only)
        line_no_block = re.sub(r'/\*.*?\*/', '', line)

        # Remove line comments // ...
        code_part = strip_line_comments(line_no_block)

        if not chinese_re.search(code_part):
            continue

        # Extract string literals from the code part
        strings = extract_string_literals(code_part)
        has_chinese_string = False
        for s in strings:
            if chinese_re.search(s):
                has_chinese_string = True
                break

        if has_chinese_string:
            results.append((i, line.rstrip()))

    return results

def main():
    exclude_dirs = {'web', '.git', '.rsbuild', 'node_modules', 'dist', 'bin'}
    go_files_with_chinese = []

    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for file in files:
            if file.endswith('.go'):
                path = os.path.join(root, file)
                res = find_chinese_in_code(path)
                if res:
                    go_files_with_chinese.append((path, res))

    with open('chinese_go_results.txt', 'w', encoding='utf-8') as f:
        for path, res in go_files_with_chinese:
            f.write(f"\nFILE: {path}\n")
            for line_num, content in res:
                f.write(f"  Line {line_num}: {content}\n")

    print(f"Tìm thấy {len(go_files_with_chinese)} file, {sum(len(r) for _, r in go_files_with_chinese)} dòng có chứa tiếng Trung trong code string.")

if __name__ == '__main__':
    main()

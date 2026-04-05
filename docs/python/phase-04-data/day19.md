---
title: 第 19 天 - 正则表达式
icon: code
order: 19
---

# 第 19 天 — 正则表达式

> **对应原文档**：`Day21-30/30.正则表达式的应用.md`
> **预计学习时间**：1 天
> **本章目标**：掌握正则表达式的核心语法、Python re 模块和常见文本处理场景
> **前置知识**：Phase 1 - Phase 3
> **已有技能读者建议**：如果你有 JS / TS 基础，建议重点关注 Python 在数据处理、AI SDK、运行时约束和工程组织上的独特做法。

---

## 目录

- [章节概述](#章节概述)
- [本章知识地图](#本章知识地图)
- [已有技能快速对照js-ts-python](#已有技能快速对照js-ts-python)
- [迁移陷阱js-ts-python](#迁移陷阱js-ts-python)
- [1. 正则表达式基础](#1-正则表达式基础)
- [2. 正则语法基础](#2-正则语法基础)
- [3. 分组和捕获](#3-分组和捕获)
- [4. Python re 模块详解](#4-python-re-模块详解)
- [5. 实战场景](#5-实战场景)
- [6. 性能优化](#6-性能优化)
- [自查清单](#自查清单)
- [本章小结](#本章小结)
- [学习明细与练习任务](#学习明细与练习任务)
- [常见问题 FAQ](#常见问题-faq)

---

## 章节概述

本章重点不是背正则符号表，而是建立“什么时候该用正则、什么时候不该用”的文本处理判断力。

| 小节 | 内容 | 重要性 |
| --- | --- | --- |
| 1. 正则表达式基础 | ★★★★☆ |
| 2. 正则语法基础 | ★★★★☆ |
| 3. 分组和捕获 | ★★★★☆ |
| 4. Python re 模块详解 | ★★★★☆ |
| 5. 实战场景 | ★★★★☆ |
| 6. 性能优化 | ★★★★☆ |

---

## 本章知识地图

```mermaid
graph TD
    n1["1. 正则表达式基础"]
    n2["2. 正则语法基础"]
    n1 --> n2
    n3["3. 分组和捕获"]
    n2 --> n3
    n4["4. Python re 模块详解"]
    n3 --> n4
    n5["5. 实战场景"]
    n4 --> n5
    n6["6. 性能优化"]
    n5 --> n6
```

---

## 已有技能快速对照（JS/TS -> Python）

本章建议优先建立与当前主题直接相关的迁移直觉，而不是泛泛对比语法差异。

| 你熟悉的 JS/TS 世界 | Python 世界 | 本章需要建立的直觉 |
| --- | --- | --- |
| JS `RegExp` | Python `re` | 核心语法接近，但 API 命名和默认行为并不完全一样 |
| `str.replace` + regex | `re.sub` | Python 文本处理更常直接结合标准库批量完成 |
| 提取日志/文本片段 | `findall` / 分组捕获 | 学正则时要一起理解分组、边界和可读性 trade-off |

---

## 迁移陷阱（JS/TS -> Python）

- **上来就写很长的正则**：可读性一旦崩掉，后续维护成本会极高。
- **把正则当万能解析器**：遇到结构化格式时，先考虑专门解析器。
- **忽略原始字符串前缀 `r''`**：反斜杠转义问题会让模式和预期完全不一致。

---

## 1. 正则表达式基础

### 为什么学习正则

在 AI Agent 开发中，正则表达式常用于：

1. **数据清洗**：清理 LLM 输出中的噪声
2. **信息提取**：从文本中提取结构化数据
3. **输入验证**：验证邮箱、电话、URL 等格式
4. **日志解析**：分析系统日志和对话记录
5. **Prompt 工程**：设计结构化输出格式

### 与 JavaScript 对比

| 特性 | JavaScript | Python |
|------|-----------|--------|
| 字面量 | `/pattern/flags` | `r"pattern"` |
| 模块 | 内置 | `re` 模块 |
| 测试 | `regex.test(str)` | `re.search()` |
| 匹配 | `str.match(regex)` | `re.match()` |
| 替换 | `str.replace(regex, repl)` | `re.sub()` |
| 分割 | `str.split(regex)` | `re.split()` |

```javascript
// JavaScript
const regex = /\d+/g;
const str = "Phone: 123-456-7890";
const match = str.match(regex);  // ["123", "456", "7890"]
```

```python
# Python
import re
pattern = r"\d+"
text = "Phone: 123-456-7890"
matches = re.findall(pattern, text)  # ['123', '456', '7890']
```

---

## 2. 正则语法基础

### 字符匹配

```python
import re

# 普通字符 - 直接匹配
pattern = r"hello"
text = "hello world"
print(re.search(pattern, text))  # 匹配 "hello"

# 点号 . - 匹配任意单个字符（除换行符）
pattern = r"h.llo"
text = "hallo"
print(re.search(pattern, text))  # 匹配

# 字符集 [] - 匹配其中任意一个字符
pattern = r"[aeiou]"  # 匹配任意元音
text = "hello"
print(re.findall(pattern, text))  # ['e', 'o']

# 否定字符集 [^]
pattern = r"[^aeiou]"  # 匹配非元音
text = "hello"
print(re.findall(pattern, text))  # ['h', 'l', 'l']

# 范围
pattern = r"[a-z]"    # 小写字母
pattern = r"[A-Z]"    # 大写字母
pattern = r"[0-9]"    # 数字
pattern = r"[a-zA-Z]" # 所有字母
pattern = r"[0-9a-fA-F]"  # 十六进制字符
```

### 预定义字符类

```python
import re

# \d - 数字（等价于 [0-9]）
pattern = r"\d+"
text = "Order 12345"
print(re.findall(pattern, text))  # ['12345']

# \D - 非数字
pattern = r"\D+"
text = "Order 12345"
print(re.findall(pattern, text))  # ['Order ']

# \w - 单词字符（字母、数字、下划线）
pattern = r"\w+"
text = "hello_world 123"
print(re.findall(pattern, text))  # ['hello_world', '123']

# \W - 非单词字符
pattern = r"\W+"
text = "hello, world!"
print(re.findall(pattern, text))  # [', ', '!']

# \s - 空白字符（空格、制表符、换行）
pattern = r"\s+"
text = "hello   world\nnew line"
print(re.findall(pattern, text))  # ['   ', '\n']

# \S - 非空白字符
pattern = r"\S+"
text = "hello   world"
print(re.findall(pattern, text))  # ['hello', 'world']

# . - 任意字符（除换行符）
pattern = r".+"
text = "hello\nworld"
print(re.findall(pattern, text))  # ['hello']

# 使用 DOTALL 标志匹配包括换行符
print(re.findall(r".+", text, re.DOTALL))  # ['hello\nworld']

# 转义字符
pattern = r"\."  # 匹配实际的点号
text = "example.com"
print(re.findall(pattern, text))  # ['.']
```

### 量词

```python
import re

# * - 0 次或多次
pattern = r"ab*c"
text = "ac abc abbc abbbc"
print(re.findall(pattern, text))  # ['ac', 'abc', 'abbc', 'abbbc']

# + - 1 次或多次
pattern = r"ab+c"
text = "ac abc abbc"
print(re.findall(pattern, text))  # ['abc', 'abbc']

# ? - 0 次或 1 次
pattern = r"ab?c"
text = "ac abc abbc"
print(re.findall(pattern, text))  # ['ac', 'abc']

# {n} - 恰好 n 次
pattern = r"\d{3}"
text = "12 123 1234"
print(re.findall(pattern, text))  # ['123', '234']

# {n,m} - n 到 m 次
pattern = r"\d{2,4}"
text = "1 12 123 1234 12345"
print(re.findall(pattern, text))  # ['12', '123', '1234', '1234']

# {n,} - 至少 n 次
pattern = r"\d{3,}"
text = "12 123 12345"
print(re.findall(pattern, text))  # ['123', '12345']

# 贪婪 vs 非贪婪
text = "<div>hello</div><div>world</div>"

# 贪婪匹配（默认）- 匹配尽可能多
pattern = r"<div>.*</div>"
print(re.findall(pattern, text))  # ['<div>hello</div><div>world</div>']

# 非贪婪匹配 - 匹配尽可能少
pattern = r"<div>.*?</div>"
print(re.findall(pattern, text))  # ['<div>hello</div>', '<div>world</div>']
```

### 边界和锚点

```python
import re

# ^ - 字符串开始
pattern = r"^Hello"
text1 = "Hello world"
text2 = "Say Hello"
print(re.search(pattern, text1))  # 匹配
print(re.search(pattern, text2))  # 不匹配

# $ - 字符串结束
pattern = r"world$"
text1 = "Hello world"
text2 = "world peace"
print(re.search(pattern, text1))  # 匹配
print(re.search(pattern, text2))  # 不匹配

# \b - 单词边界
pattern = r"\bcat\b"
text = "cat catch category the cat"
print(re.findall(pattern, text))  # ['cat', 'cat']

# \B - 非单词边界
pattern = r"\Bcat\B"
text = "cat catch category"
print(re.findall(pattern, text))  # ['cat'] (from "catch" and "category")

# 匹配整行
pattern = r"^.*$"
text = """line 1
line 2
line 3"""
print(re.findall(pattern, text, re.MULTILINE))
# ['line 1', 'line 2', 'line 3']
```

---

## 3. 分组和捕获

### 基础分组

```python
import re

# 捕获分组 ()
pattern = r"(\d{3})-(\d{4})"
text = "Phone: 123-4567, Alt: 987-6543"

match = re.search(pattern, text)
if match:
    print(match.group(0))  # 完整匹配：123-4567
    print(match.group(1))  # 第一组：123
    print(match.group(2))  # 第二组：4567

# 提取所有匹配
matches = re.findall(pattern, text)
print(matches)  # [('123', '4567'), ('987', '6543')]

# 命名分组 (?P<name>)
pattern = r"(?P<area>\d{3})-(?P<number>\d{4})"
text = "123-4567"

match = re.search(pattern, text)
if match:
    print(match.group("area"))    # 123
    print(match.group("number"))  # 4567
    print(match.groupdict())      # {'area': '123', 'number': '4567'}

# 非捕获分组 (?:)
pattern = r"(?:https?://)?(?:www\.)?(\w+\.\w+)"
text = "Visit https://www.example.com or example.org"
print(re.findall(pattern, text))  # ['example.com', 'example.org']
```

### 反向引用

```python
import re

# 使用 \1, \2 等引用前面的分组
# 匹配重复的单词
pattern = r"\b(\w+)\s+\1\b"
text = "hello hello world world test test"
print(re.findall(pattern, text))  # ['hello', 'world', 'test']

# 替换时使用分组引用
pattern = r"(\w+)\s+(\w+)"
text = "John Doe"
result = re.sub(pattern, r"\2, \1", text)
print(result)  # "Doe, John"

# 命名分组的反向引用
pattern = r"(?P<quote>[\"'])(?P<text>.*?)\P{quote}"
text = '"Hello" and \'world\''
# 注意：Python 中命名分组的反向引用使用 (?P=name)
pattern = r'(?P<quote>["\'])(?P<text>.*?)\P{=quote}'
print(re.findall(pattern, text))
```

### 条件匹配和前瞻后顾

```python
import re

# 正向前瞻 (?=)
pattern = r"\d+(?= dollars)"
text = "Price: 100 dollars, Tax: 20 dollars, Total: 120 dollars"
print(re.findall(pattern, text))  # ['100', '20', '120']

# 负向前瞻 (?!)
pattern = r"\d+(?! dollars)"
text = "Price: 100 dollars, Count: 50 items"
print(re.findall(pattern, text))  # ['50']

# 正向后顾 (?<=)
pattern = r"(?<=\$)\d+"
text = "Prices: $100, $200, $300"
print(re.findall(pattern, text))  # ['100', '200', '300']

# 负向后顾 (?<!)
pattern = r"(?<!\$)\d+"
text = "$100 and 200 euros"
print(re.findall(pattern, text))  # ['200']

# 复杂示例：匹配邮箱（排除某些域名）
pattern = r"\w+@\w+\.(?!spam|junk)\w+"
text = "Contact: user@example.com, spam@spam.com, admin@company.org"
print(re.findall(pattern, text))  # ['user@example.com', 'admin@company.org']
```

---

## 4. Python re 模块详解

### 主要函数

```python
import re

text = "The rain in Spain falls mainly in the plain"
pattern = r"in"

# re.search() - 搜索第一个匹配
match = re.search(pattern, text)
print(match)  # <re.Match object; span=(4, 6), match='in'>
print(match.span())   # (4, 6) - 起止位置
print(match.start())  # 4
print(match.end())    # 6

# re.match() - 只匹配字符串开头
match = re.match(r"The", text)
print(match)  # 匹配

match = re.match(r"rain", text)
print(match)  # None - 不在开头

# re.findall() - 找到所有匹配
print(re.findall(r"in", text))  # ['in', 'in', 'in']

# re.finditer() - 迭代所有匹配
for match in re.finditer(r"in", text):
    print(f"Found 'in' at position {match.start()}")

# re.split() - 分割字符串
print(re.split(r"\s+", text))  # ['The', 'rain', 'in', 'Spain', ...]
print(re.split(r"\s+", text, maxsplit=3))  # 最多分割 3 次

# re.sub() - 替换
print(re.sub(r"in", "on", text))  # 替换所有
print(re.sub(r"in", "on", text, count=2))  # 只替换 2 个

# 使用函数进行替换
def uppercase(match):
    return match.group(0).upper()

print(re.sub(r"\b\w+\b", uppercase, "hello world"))  # "HELLO WORLD"
```

### 预编译模式

```python
import re

# 预编译提高性能（多次使用时）
pattern = re.compile(r"\d{3}-\d{4}", re.IGNORECASE)

text1 = "Call 123-4567"
text2 = "Phone: 987-6543"

print(pattern.search(text1))  # 匹配
print(pattern.findall(text2))  # ['987-6543']

# 编译时的标志
# re.IGNORECASE (re.I) - 忽略大小写
# re.MULTILINE (re.M) - 多行模式
# re.DOTALL (re.S) - 点号匹配换行符
# re.VERBOSE (re.X) - 允许注释和空白

# 详细模式示例
pattern = re.compile(r"""
    \d{3}     # 区号
    -         # 分隔符
    \d{4}     # 号码
""", re.VERBOSE)

print(pattern.search("123-4567"))  # 匹配
```

### 标志位

```python
import re

text = "HELLO\nworld\nHello"

# IGNORECASE - 忽略大小写
print(re.findall(r"hello", text, re.IGNORECASE))  # ['HELLO', 'Hello']

# MULTILINE - 多行模式（^和$匹配每行的起止）
text = """line 1
line 2
line 3"""
print(re.findall(r"^line \d+$", text, re.MULTILINE))
# ['line 1', 'line 2', 'line 3']

# DOTALL - 点号匹配换行符
text = "hello\nworld"
print(re.findall(r"hello.*world", text, re.DOTALL))  # ['hello\nworld']

# 组合使用多个标志
print(re.findall(r"^hello.*world$", text, re.MULTILINE | re.DOTALL | re.IGNORECASE))
```

---

## 5. 实战场景

### 邮箱验证

```python
import re

def validate_email(email: str) -> bool:
    """
    验证邮箱地址
    
    简单版本：
    """
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return bool(re.match(pattern, email))

# 测试
emails = [
    "user@example.com",      # True
    "user.name@example.com", # True
    "user+tag@example.co.uk", # True
    "invalid@",              # False
    "@example.com",          # False
    "user@.com",             # False
]

for email in emails:
    print(f"{email}: {validate_email(email)}")

# 提取文本中的所有邮箱
def extract_emails(text: str) -> list[str]:
    """从文本中提取所有邮箱地址"""
    pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
    return re.findall(pattern, text)

text = """
Contact us at support@example.com or sales@company.co.uk.
For spam reports, email abuse@example.org.
"""
print(extract_emails(text))  # ['support@example.com', 'sales@company.co.uk', 'abuse@example.org']
```

### URL 解析

```python
import re

def extract_urls(text: str) -> list[str]:
    """提取文本中的所有 URL"""
    pattern = r"https?://[^\s<>\[\]{}|\\^`\"']+"
    return re.findall(pattern, text)

text = """
Visit https://www.example.com for more info.
API docs: http://api.example.com/v1/users?id=123
File: ftp://files.example.com/doc.pdf
"""
print(extract_urls(text))

# 解析 URL 组件
def parse_url(url: str) -> dict:
    """解析 URL 各组成部分"""
    pattern = r"""
        ^(?P<scheme>https?)://
        (?:(?P<user>[^:]+)(?::(?P<password>[^@]+))?@)?
        (?P<host>[^:/]+)
        (?::(?P<port>\d+))?
        (?P<path>/[^?#]*)?
        (?:\?(?P<query>[^#]*))?
        (?:#(?P<fragment>.*))?
        $
    """
    match = re.match(pattern, url, re.VERBOSE)
    if match:
        return match.groupdict()
    return {}

url = "https://user:pass@api.example.com:8080/v1/users?id=123#top"
print(parse_url(url))
```

### 电话号码提取

```python
import re

def extract_phones(text: str) -> list[str]:
    """
    提取各种格式的电话号码
    
    支持格式：
    - 123-456-7890
    - (123) 456-7890
    - 123 456 7890
    - 123.456.7890
    - +86 138 0000 0000
    """
    pattern = r"""
        (?:
            (?:\+?\d{1,3}[\s.-]?)?  # 国际区号
            (?:\(?\d{2,4}\)?[\s.-]?)?  # 区号
            \d{3,4}[\s.-]?\d{4}  # 本地号码
        )
    """
    matches = re.findall(pattern, text, re.VERBOSE)
    return [m.strip() for m in matches]

text = """
Contact numbers:
- Office: (010) 1234-5678
- Mobile: 138-0000-0000
- US: +1-555-123-4567
- Fax: 021.9876.5432
"""
print(extract_phones(text))

# 标准化电话号码格式
def normalize_phone(phone: str) -> str:
    """将电话号码标准化为统一格式"""
    # 提取所有数字
    digits = re.sub(r"\D", "", phone)
    
    # 根据长度格式化
    if len(digits) == 11 and digits.startswith("1"):
        # 中国手机号
        return f"{digits[:3]}-{digits[3:7]}-{digits[7:]}"
    elif len(digits) == 10:
        # 美国格式
        return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
    
    return phone

print(normalize_phone("13800000000"))  # 138-0000-0000
```

### HTML 标签处理

```python
import re

# 注意：复杂 HTML 应使用 BeautifulSoup 等专用库
# 正则适合简单场景

def extract_links(html: str) -> list[tuple[str, str]]:
    """提取 HTML 中的链接"""
    pattern = r'<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)</a>'
    matches = re.findall(pattern, html, re.DOTALL)
    return [(href, re.sub(r'<[^>]+>', '', text).strip()) 
            for href, text in matches]

html = """
<ul>
    <li><a href="/home">Home</a></li>
    <li><a href="/about" class="active">About Us</a></li>
    <li><a href="/contact">Contact</a></li>
</ul>
"""
print(extract_links(html))

def remove_html_tags(html: str) -> str:
    """移除 HTML 标签"""
    pattern = r"<[^>]+>"
    return re.sub(pattern, "", html)

print(remove_html_tags("<p>Hello <strong>World</strong>!</p>"))

def extract_image_src(html: str) -> list[str]:
    """提取图片 src"""
    pattern = r'<img\s+(?:[^>]*?\s+)?src="([^"]*)"'
    return re.findall(pattern, html)

html = """
<img src="image1.jpg" alt="Image 1">
<img class="thumbnail" src="image2.png" width="100">
"""
print(extract_image_src(html))
```

### 日志解析

```python
import re
from datetime import datetime

def parse_log_line(line: str) -> dict | None:
    """
    解析日志行
    
    日志格式：
    2024-01-15 10:30:45 INFO [main] module.py:123 - Message here
    """
    pattern = r"""
        ^(?P<timestamp>\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\s+
        (?P<level>\w+)\s+
        \[(?P<thread>[^\]]+)\]\s+
        (?P<file>\w+\.py):(?P<line>\d+)\s+-\s+
        (?P<message>.*)$
    """
    match = re.match(pattern, line, re.VERBOSE)
    if match:
        return match.groupdict()
    return None

log_lines = [
    "2024-01-15 10:30:45 INFO [main] app.py:42 - Application started",
    "2024-01-15 10:31:00 ERROR [worker-1] db.py:156 - Connection failed",
    "2024-01-15 10:31:05 WARNING [main] config.py:23 - Using default config",
]

for line in log_lines:
    parsed = parse_log_line(line)
    if parsed:
        print(f"{parsed['level']}: {parsed['message']}")

# 统计日志级别
def count_log_levels(log_text: str) -> dict[str, int]:
    """统计各日志级别的次数"""
    pattern = r"\b(DEBUG|INFO|WARNING|ERROR|CRITICAL)\b"
    matches = re.findall(pattern, log_text)
    
    counts = {}
    for level in matches:
        counts[level] = counts.get(level, 0) + 1
    return counts

log_text = """
2024-01-15 10:30:45 INFO Application started
2024-01-15 10:31:00 ERROR Connection failed
2024-01-15 10:31:05 WARNING Using default config
2024-01-15 10:32:00 INFO Request processed
2024-01-15 10:33:00 ERROR Timeout occurred
"""
print(count_log_levels(log_text))  # {'INFO': 2, 'ERROR': 2, 'WARNING': 1}
```

### AI Agent 输出清洗

```python
import re

def clean_llm_output(text: str) -> str:
    """
    清洗 LLM 输出文本
    
    - 移除多余的空白
    - 标准化标点
    - 移除特殊标记
    """
    # 移除 Markdown 代码块标记
    text = re.sub(r"```[\w]*\n?", "", text)
    
    # 移除多余的空白行
    text = re.sub(r"\n\s*\n", "\n", text)
    
    # 标准化空格
    text = re.sub(r" +", " ", text)
    
    # 移除行首行尾空白
    lines = [line.strip() for line in text.split("\n")]
    text = "\n".join(lines)
    
    return text.strip()

def extract_json_from_output(text: str) -> str | None:
    """从 LLM 输出中提取 JSON"""
    # 尝试匹配代码块中的 JSON
    pattern = r"```(?:json)?\s*({[\s\S]*?})\s*```"
    match = re.search(pattern, text)
    if match:
        return match.group(1)
    
    # 尝试直接匹配 JSON 对象
    pattern = r"{[\s\S]*?}"
    # 需要更复杂的逻辑来匹配嵌套 JSON
    # 这里简化处理
    start = text.find("{")
    end = text.rfind("}") + 1
    if start != -1 and end > start:
        return text[start:end]
    
    return None

def extract_code_from_output(text: str, language: str = "python") -> str | None:
    """从 LLM 输出中提取代码"""
    pattern = rf"```{language}\s*([\s\S]*?)```"
    match = re.search(pattern, text, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return None

# 测试
llm_output = """
好的，我来帮你写这个函数。

```python
def hello(name):
    return f"Hello, {name}!"
```

希望这能帮到你！
"""
print(extract_code_from_output(llm_output))
```

---

## 6. 性能优化

### 避免灾难性回溯

```python
import re
import time

# 糟糕的正则 - 可能导致灾难性回溯
bad_pattern = r"(a+)+$"
text = "a" * 100 + "b"

start = time.time()
try:
    result = re.search(bad_pattern, text)
    print(f"Time: {time.time() - start:.4f}s")
except:
    print("Timeout or error")

# 优化的版本
good_pattern = r"a+$"
start = time.time()
result = re.search(good_pattern, text)
print(f"Time: {time.time() - start:.6f}s")

# 使用原子组（Python 中用 possessive 量词替代）
# 预编译模式提高重复使用性能
pattern = re.compile(r"\d{3}-\d{4}")
```

### 选择合适的方法

```python
import re

text = "The quick brown fox jumps over the lazy dog"

# 只需要第一个匹配 - 用 search()
first = re.search(r"\b\w{5}\b", text)

# 需要所有匹配 - 用 findall()
all_words = re.findall(r"\b\w+\b", text)

# 需要位置信息 - 用 finditer()
for match in re.finditer(r"\b\w{5}\b", text):
    print(f"Found at {match.start()}-{match.end()}")

# 只检查是否存在 - 用 search() 最 efficient
exists = bool(re.search(r"fox", text))
```

---

## 自查清单

- [ ] 我已经能解释“1. 正则表达式基础”的核心概念。
- [ ] 我已经能把“1. 正则表达式基础”写成最小可运行示例。
- [ ] 我已经能解释“2. 正则语法基础”的核心概念。
- [ ] 我已经能把“2. 正则语法基础”写成最小可运行示例。
- [ ] 我已经能解释“3. 分组和捕获”的核心概念。
- [ ] 我已经能把“3. 分组和捕获”写成最小可运行示例。
- [ ] 我已经能解释“4. Python re 模块详解”的核心概念。
- [ ] 我已经能把“4. Python re 模块详解”写成最小可运行示例。
- [ ] 我已经能解释“5. 实战场景”的核心概念。
- [ ] 我已经能把“5. 实战场景”写成最小可运行示例。
- [ ] 我已经能解释“6. 性能优化”的核心概念。
- [ ] 我已经能把“6. 性能优化”写成最小可运行示例。

---

## 本章小结

这一章可以浓缩为以下几件事：

- 1. 正则表达式基础：这是本章必须掌握的核心能力。
- 2. 正则语法基础：这是本章必须掌握的核心能力。
- 3. 分组和捕获：这是本章必须掌握的核心能力。
- 4. Python re 模块详解：这是本章必须掌握的核心能力。
- 5. 实战场景：这是本章必须掌握的核心能力。
- 6. 性能优化：这是本章必须掌握的核心能力。

---

## 学习明细与练习任务

### 知识点掌握清单

- [ ] 阅读并复现“1. 正则表达式基础”中的关键代码。
- [ ] 阅读并复现“2. 正则语法基础”中的关键代码。
- [ ] 阅读并复现“3. 分组和捕获”中的关键代码。
- [ ] 阅读并复现“4. Python re 模块详解”中的关键代码。
- [ ] 阅读并复现“5. 实战场景”中的关键代码。
- [ ] 阅读并复现“6. 性能优化”中的关键代码。

### 练习任务（由易到难）

1. 基础练习（15 - 30 分钟）：从本章挑 1 个最基础示例，手敲一遍并改 2 个输入参数观察输出差异。
2. 场景练习（30 - 60 分钟）：把本章至少 2 个知识点拼成一个小脚本，要求包含输入、处理、输出三个步骤。
3. 工程练习（60 - 90 分钟）：按你的工作背景，把本章内容改造成一个更真实的小工具或 Demo。

---

## 常见问题 FAQ

**Q：这一章“正则表达式”需要全部背下来吗？**  
A：不需要。先掌握核心概念和最常见写法，剩下的通过练习和查文档逐步补齐。

---

**Q：我是 JS/TS 开发者，最容易踩什么坑？**  
A：最常见的问题是按 JS/TS 的语法和运行时直觉去猜 Python 行为。遇到分歧时，优先回到最小示例验证。

---

**Q：学完这一章后，怎么确认自己真的会了？**  
A：标准不是“看懂了”，而是你能不看答案把本章最关键的例子重新写出来，并解释为什么这么写。

---

> **下一步**：继续学习第 20 天内容，保持按顺序推进，后续章节会默认你已经掌握今天的基础。

---

*文档基于：Phase 4 · 数据处理与自动化*  
*生成日期：2026-04-04*

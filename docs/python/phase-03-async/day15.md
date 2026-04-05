---
title: 第 15 天 - HTTP 请求
icon: code
order: 15
---

# 第 15 天 — HTTP 请求

> **对应原文档**：原项目 Day22：22.对象的序列化和反序列化.md - JSON 处理和网络 API 使用
> **预计学习时间**：1 - 2 天
> **本章目标**：掌握 requests 与 httpx 的常见用法、错误处理和 HTTP 调试思路
> **前置知识**：第 14 天，建议已掌握函数、类、异常、模块基础
> **已有技能读者建议**：如果你有 JS / TS 基础，优先把 Python 的模块化、异常处理、并发模型和 Web 框架思路与 Node.js 生态做对照。

---

## 目录

- [章节概述](#章节概述)
- [本章知识地图](#本章知识地图)
- [已有技能快速对照js-ts-python](#已有技能快速对照js-ts-python)
- [迁移陷阱js-ts-python](#迁移陷阱js-ts-python)
- [1. 概述](#1-概述)
- [2. requests 库基础](#2-requests-库基础)
- [3. requests Session](#3-requests-session)
- [4. httpx 库](#4-httpx-库)
- [5. 响应处理](#5-响应处理)
- [6. 高级用法](#6-高级用法)
- [7. 错误处理](#7-错误处理)
- [8. 综合实战：AI Agent HTTP 工具类](#8-综合实战ai-agent-http-工具类)
- [自查清单](#自查清单)
- [本章小结](#本章小结)
- [学习明细与练习任务](#学习明细与练习任务)
- [常见问题 FAQ](#常见问题-faq)

---

## 章节概述

本章重点不是记住 requests 或 httpx 的每个参数，而是建立 HTTP 客户端的封装与错误处理习惯。

| 小节 | 内容 | 重要性 |
| --- | --- | --- |
| 1. 概述 | ★★★★☆ |
| 2. requests 库基础 | ★★★★☆ |
| 3. requests Session | ★★★★☆ |
| 4. httpx 库 | ★★★★☆ |
| 5. 响应处理 | ★★★★☆ |
| 6. 高级用法 | ★★★★☆ |
| 7. 错误处理 | ★★★★☆ |
| 8. 综合实战：AI Agent HTTP 工具类 | ★★★★☆ |

---

## 本章知识地图

```mermaid
graph TD
    n1["1. 概述"]
    n2["2. requests 库基础"]
    n1 --> n2
    n3["3. requests Session"]
    n2 --> n3
    n4["4. httpx 库"]
    n3 --> n4
    n5["5. 响应处理"]
    n4 --> n5
    n6["6. 高级用法"]
    n5 --> n6
    n7["7. 错误处理"]
    n6 --> n7
    n8["8. 综合实战：AI Agent HTTP 工具类"]
    n7 --> n8
```

---

## 已有技能快速对照（JS/TS -> Python）

本章建议优先建立与当前主题直接相关的迁移直觉，而不是泛泛对比语法差异。

| 你熟悉的 JS/TS 世界 | Python 世界 | 本章需要建立的直觉 |
| --- | --- | --- |
| `fetch` / axios | `requests` / `httpx` | Python 会更明显地区分同步与异步客户端 |
| interceptors | hooks / custom wrapper | Python 更常通过封装类和辅助函数统一认证、重试、日志 |
| REST client util | HTTP client object | 真正常用的不是裸调用，而是带配置、错误处理和会话复用的客户端层 |

---

## 迁移陷阱（JS/TS -> Python）

- **直接在业务代码里到处散落 HTTP 调用**：后续认证、重试、日志和测试都会变难。
- **只判断状态码，不看响应体和异常类型**：很多问题会被错误归类。
- **混淆 requests 和 httpx 的同步/异步使用场景**：工具选错会直接影响代码组织方式。

---

## 1. 概述

HTTP 请求是 AI Agent 与外部世界交互的核心方式。无论是调用 LLM API（OpenAI、Anthropic、Google）、搜索服务、数据库接口，还是各类第三方工具，都需要通过 HTTP 请求来实现。Python 提供了丰富的 HTTP 客户端库，本节将系统讲解最常用的 `requests` 和 `httpx` 库。

> **JS 开发者提示**
>
> Python 的 `requests` 库在 Python 生态中的地位，相当于 JavaScript 中的 `axios` 或 `node-fetch`。如果你熟悉 JS 的 `fetch` API 或 `axios`，学习 `requests` 会非常轻松，两者的 API 设计理念高度一致。

---

## 2. requests 库基础

`requests` 是 Python 中最流行的 HTTP 客户端库，以"HTTP for Humans"为设计理念，API 简洁直观。

### 安装

```bash
pip install requests
```

### GET 请求

```python
"""
GET 请求

GET 用于从服务器获取数据，是最常用的 HTTP 方法。
"""

import requests

# 基本 GET 请求
def basic_get():
    """基本 GET 请求"""
    response = requests.get("https://api.example.com/data")
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {response.text}")

# 带查询参数的 GET 请求
def get_with_params():
    """带查询参数的 GET 请求"""
    params = {
        "q": "Python 异步编程",
        "page": 1,
        "limit": 10,
        "sort": "relevance",
    }
    response = requests.get(
        "https://api.example.com/search",
        params=params,  # requests 会自动编码为 ?q=...&page=1&...
    )
    print(f"实际 URL: {response.url}")
    print(response.json())

# 带请求头的 GET 请求
def get_with_headers():
    """带自定义请求头的 GET 请求"""
    headers = {
        "User-Agent": "MyAIAgent/1.0",
        "Accept": "application/json",
        "Authorization": "Bearer your-api-key",
        "X-Request-ID": "unique-request-id-123",
    }
    response = requests.get(
        "https://api.example.com/data",
        headers=headers,
    )
    return response.json()

# 带超时的 GET 请求（重要！）
def get_with_timeout():
    """带超时的 GET 请求"""
    try:
        # 始终设置超时，避免无限等待
        response = requests.get(
            "https://api.example.com/data",
            timeout=(3.05, 10),  # (连接超时, 读取超时)
        )
        return response.json()
    except requests.exceptions.Timeout:
        print("请求超时")
    except requests.exceptions.ConnectionError:
        print("连接错误")

# AI Agent 场景：调用 OpenAI API
def call_openai_api():
    """调用 OpenAI Chat Completions API"""
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": "Bearer sk-your-api-key",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "gpt-4",
        "messages": [
            {"role": "system", "content": "你是一个有用的助手"},
            {"role": "user", "content": "解释 Python 中的 GIL"},
        ],
        "temperature": 0.7,
        "max_tokens": 1000,
    }

    response = requests.post(url, headers=headers, json=payload, timeout=30)
    response.raise_for_status()  # 检查 HTTP 错误
    data = response.json()
    return data["choices"][0]["message"]["content"]

# AI Agent 场景：调用搜索 API
def call_search_api():
    """调用搜索 API 获取参考资料"""
    url = "https://api.example.com/search"
    params = {
        "q": "Python asyncio 最佳实践",
        "num": 5,
        "lang": "zh-CN",
    }
    headers = {
        "X-API-Key": "your-search-api-key",
    }

    response = requests.get(url, params=params, headers=headers, timeout=10)
    response.raise_for_status()
    results = response.json()

    for result in results.get("results", []):
        print(f"标题: {result['title']}")
        print(f"链接: {result['url']}")
        print(f"摘要: {result['snippet']}")
        print("-" * 60)
```

### POST 请求

```python
"""
POST 请求

POST 用于向服务器提交数据，常用于创建资源或发送复杂查询。
"""

import requests

# 发送 JSON 数据
def post_json():
    """发送 JSON 数据"""
    url = "https://api.example.com/data"
    data = {
        "name": "AI Agent",
        "version": "1.0",
        "capabilities": ["chat", "search", "code"],
    }
    response = requests.post(url, json=data)  # json 参数自动设置 Content-Type
    return response.json()

# 发送表单数据
def post_form():
    """发送表单数据（application/x-www-form-urlencoded）"""
    url = "https://api.example.com/login"
    data = {
        "username": "admin",
        "password": "secret",
    }
    response = requests.post(url, data=data)  # data 参数发送表单数据
    return response.json()

# 发送文件
def post_file():
    """上传文件"""
    url = "https://api.example.com/upload"

    # 方式 1：简单文件上传
    with open("document.txt", "rb") as f:
        response = requests.post(url, files={"file": f})
        return response.json()

    # 方式 2：带文件名的上传
    with open("document.txt", "rb") as f:
        response = requests.post(
            url,
            files={"file": ("custom_name.txt", f, "text/plain")},
        )
        return response.json()

    # 方式 3：多文件上传
    with open("file1.txt", "rb") as f1, open("file2.txt", "rb") as f2:
        response = requests.post(
            url,
            files=[
                ("files", ("file1.txt", f1)),
                ("files", ("file2.txt", f2)),
            ],
        )
        return response.json()

# 发送 JSON + 文件（multipart/form-data）
def post_json_and_file():
    """同时发送 JSON 和文件"""
    url = "https://api.example.com/analyze"

    with open("data.csv", "rb") as f:
        response = requests.post(
            url,
            data={"analysis_type": "sentiment", "model": "gpt-4"},
            files={"data_file": ("data.csv", f, "text/csv")},
        )
        return response.json()

# AI Agent 场景：发送多轮对话
def multi_turn_conversation():
    """多轮对话请求"""
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": "Bearer sk-your-key",
        "Content-Type": "application/json",
    }

    # 维护对话历史
    messages = [
        {"role": "system", "content": "你是一个编程助手"},
        {"role": "user", "content": "什么是 GIL？"},
        {"role": "assistant", "content": "GIL 是全局解释器锁..."},
        {"role": "user", "content": "它有什么影响？"},
    ]

    payload = {
        "model": "gpt-4",
        "messages": messages,
        "temperature": 0.7,
    }

    response = requests.post(url, headers=headers, json=payload, timeout=30)
    response.raise_for_status()
    data = response.json()
    return data["choices"][0]["message"]["content"]
```

### PUT 和 DELETE 请求

```python
"""
PUT 和 DELETE 请求

PUT 用于更新资源，DELETE 用于删除资源。
"""

import requests

# PUT 请求 - 更新资源
def put_request():
    """PUT 请求更新资源"""
    url = "https://api.example.com/users/123"
    data = {
        "name": "新名称",
        "email": "new@example.com",
    }
    response = requests.put(url, json=data)
    response.raise_for_status()
    return response.json()

# PATCH 请求 - 部分更新
def patch_request():
    """PATCH 请求部分更新资源"""
    url = "https://api.example.com/users/123"
    data = {"name": "仅更新名称"}  # 只更新 name 字段
    response = requests.patch(url, json=data)
    response.raise_for_status()
    return response.json()

# DELETE 请求 - 删除资源
def delete_request():
    """DELETE 请求删除资源"""
    url = "https://api.example.com/users/123"
    response = requests.delete(url)
    response.raise_for_status()
    return response.status_code == 204  # 通常删除成功返回 204

# AI Agent 场景：管理知识库文档
def manage_knowledge_base():
    """管理 AI Agent 知识库"""
    base_url = "https://api.example.com/knowledge"
    headers = {"Authorization": "Bearer your-key"}

    # 创建文档
    new_doc = {
        "title": "Python 异步编程指南",
        "content": "asyncio 是 Python 的异步编程框架...",
        "tags": ["python", "asyncio"],
    }
    create_resp = requests.post(
        f"{base_url}/documents",
        headers=headers,
        json=new_doc,
        timeout=10,
    )
    doc_id = create_resp.json()["id"]

    # 更新文档
    update_data = {"tags": ["python", "asyncio", "ai-agent"]}
    requests.put(
        f"{base_url}/documents/{doc_id}",
        headers=headers,
        json=update_data,
        timeout=10,
    )

    # 删除文档
    requests.delete(
        f"{base_url}/documents/{doc_id}",
        headers=headers,
        timeout=10,
    )
```

> **JS 开发者提示**
>
> Python `requests` 的 API 与 JS `axios` 的对比：
>
> | 操作 | requests | axios |
> |------|----------|-------|
> | GET | `requests.get(url, params=p)` | `axios.get(url, { params: p })` |
> | POST JSON | `requests.post(url, json=d)` | `axios.post(url, d)` |
> | POST Form | `requests.post(url, data=d)` | `axios.post(url, qs.stringify(d))` |
> | 超时 | `timeout=10` | `timeout: 10000`（毫秒） |
> | 响应 JSON | `resp.json()` | `resp.data`（自动解析） |
> | 状态码 | `resp.status_code` | `resp.status` |

---

## 3. requests Session

Session 对象可以跨请求保持某些参数（如 Cookie、请求头），并且会使用连接池提升性能。

```python
"""
requests Session

Session 的优势：
1. 跨请求保持 Cookie（自动处理登录状态）
2. 跨请求保持请求头
3. 连接池复用（提升性能）
4. 统一配置（超时、代理等）
"""

import requests

# 基本 Session 用法
def basic_session():
    """基本 Session 使用"""
    session = requests.Session()

    # 设置默认请求头
    session.headers.update({
        "Authorization": "Bearer your-api-key",
        "User-Agent": "MyAIAgent/1.0",
    })

    # 使用 Session 发送请求
    resp1 = session.get("https://api.example.com/data/1")
    resp2 = session.get("https://api.example.com/data/2")
    resp3 = session.post("https://api.example.com/data", json={"key": "value"})

    # Session 会保持 Cookie
    print(session.cookies)

# 登录保持 Session
def login_session():
    """登录后保持 Session"""
    session = requests.Session()

    # 登录
    login_resp = session.post(
        "https://api.example.com/login",
        data={"username": "admin", "password": "secret"},
    )

    if login_resp.status_code == 200:
        # Session 自动保存了 Cookie
        # 后续请求自动携带 Cookie
        data_resp = session.get("https://api.example.com/protected-data")
        print(data_resp.json())

# 带配置的 Session
def configured_session():
    """创建预配置的 Session"""
    session = requests.Session()
    session.headers.update({
        "Authorization": "Bearer sk-your-key",
        "Content-Type": "application/json",
    })

    # 使用 adapters 配置连接池
    adapter = requests.adapters.HTTPAdapter(
        pool_connections=10,
        pool_maxsize=100,
        max_retries=3,
    )
    session.mount("https://", adapter)
    session.mount("http://", adapter)

    return session

# AI Agent 场景：统一 API 客户端
class APIClient:
    """统一 API 客户端（基于 Session）"""

    def __init__(self, base_url, api_key):
        self.base_url = base_url.rstrip("/")
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        })
        self.session.timeout = 30

    def chat(self, messages, model="gpt-4"):
        """发送聊天请求"""
        url = f"{self.base_url}/chat/completions"
        payload = {"model": model, "messages": messages}
        resp = self.session.post(url, json=payload)
        resp.raise_for_status()
        return resp.json()

    def search(self, query, limit=10):
        """搜索"""
        url = f"{self.base_url}/search"
        resp = self.session.get(url, params={"q": query, "limit": limit})
        resp.raise_for_status()
        return resp.json()

    def close(self):
        """关闭 Session"""
        self.session.close()

# 使用示例
def use_api_client():
    """使用统一 API 客户端"""
    client = APIClient(
        base_url="https://api.example.com/v1",
        api_key="your-api-key",
    )
    try:
        result = client.chat(
            messages=[{"role": "user", "content": "你好"}],
            model="gpt-4",
        )
        print(result)
    finally:
        client.close()
```

---

## 4. httpx 库

httpx 是新一代 HTTP 客户端库，API 与 requests 高度一致，同时支持异步和 HTTP/2。

### 安装

```bash
pip install httpx
# 如需 HTTP/2 支持
pip install httpx[http2]
```

### 同步客户端

```python
"""
httpx 同步客户端

API 与 requests 几乎完全一致，迁移成本极低。
"""

import httpx

# 基本请求
def httpx_basic():
    """httpx 基本请求"""
    response = httpx.get("https://api.example.com/data")
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")

# 带配置的客户端
def httpx_configured_client():
    """创建带配置的 httpx 客户端"""
    client = httpx.Client(
        base_url="https://api.example.com",
        headers={"Authorization": "Bearer your-key"},
        timeout=30.0,
        follow_redirects=True,
        http2=True,  # 启用 HTTP/2
    )

    # 使用客户端
    resp = client.get("/data")
    print(resp.json())

    # 使用完后关闭
    client.close()

# 上下文管理器用法（推荐）
def httpx_context_manager():
    """使用上下文管理器"""
    with httpx.Client(base_url="https://api.example.com") as client:
        resp = client.get("/data")
        print(resp.json())
    # 自动关闭连接

# HTTP/2 支持
def http2_request():
    """使用 HTTP/2 协议"""
    with httpx.Client(http2=True) as client:
        resp = client.get("https://api.example.com/data")
        print(f"协议版本: {resp.http_version}")  # HTTP/1.1 或 HTTP/2

# AI Agent 场景：多模型 API 统一客户端
def multi_model_client():
    """统一调用多个 LLM API"""
    # OpenAI
    with httpx.Client(base_url="https://api.openai.com/v1") as openai_client:
        openai_client.headers["Authorization"] = "Bearer sk-openai-key"
        resp = openai_client.post(
            "/chat/completions",
            json={
                "model": "gpt-4",
                "messages": [{"role": "user", "content": "你好"}],
            },
        )
        print(f"OpenAI: {resp.json()['choices'][0]['message']['content']}")

    # Anthropic
    with httpx.Client(base_url="https://api.anthropic.com") as anthropic_client:
        anthropic_client.headers["x-api-key"] = "sk-ant-key"
        anthropic_client.headers["anthropic-version"] = "2023-06-01"
        resp = anthropic_client.post(
            "/v1/messages",
            json={
                "model": "claude-3-sonnet-20240229",
                "max_tokens": 1000,
                "messages": [{"role": "user", "content": "你好"}],
            },
        )
        print(f"Anthropic: {resp.json()['content'][0]['text']}")
```

### 异步客户端

```python
"""
httpx 异步客户端

与同步 API 一致，只需使用 AsyncClient 和 await。
"""

import asyncio
import httpx

# 基本异步请求
async def httpx_async_basic():
    """基本异步请求"""
    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.example.com/data")
        print(response.json())

# 并发请求
async def httpx_async_concurrent():
    """并发异步请求"""
    async with httpx.AsyncClient() as client:
        tasks = [
            client.get(f"https://api.example.com/data/{i}")
            for i in range(10)
        ]
        responses = await asyncio.gather(*tasks)
        return [resp.json() for resp in responses]

# AI Agent 场景：异步 LLM 调用
async def async_llm_call():
    """异步调用 LLM"""
    async with httpx.AsyncClient(
        base_url="https://api.openai.com/v1",
        timeout=30.0,
    ) as client:
        client.headers["Authorization"] = "Bearer sk-your-key"
        response = await client.post(
            "/chat/completions",
            json={
                "model": "gpt-4",
                "messages": [{"role": "user", "content": "解释 GIL"}],
            },
        )
        response.raise_for_status()
        return response.json()

# 批量异步调用
async def batch_async_llm():
    """批量异步调用 LLM"""
    prompts = [
        "解释 Python GIL",
        "什么是异步编程",
        "asyncio 和 threading 的区别",
        "如何选择合适的并发模型",
        "什么是协程",
    ]

    async with httpx.AsyncClient(
        base_url="https://api.openai.com/v1",
        timeout=30.0,
    ) as client:
        client.headers["Authorization"] = "Bearer sk-your-key"

        async def call(prompt):
            resp = await client.post(
                "/chat/completions",
                json={
                    "model": "gpt-4",
                    "messages": [{"role": "user", "content": prompt}],
                },
            )
            resp.raise_for_status()
            return resp.json()["choices"][0]["message"]["content"]

        tasks = [call(prompt) for prompt in prompts]
        results = await asyncio.gather(*tasks)

        for prompt, result in zip(prompts, results):
            print(f"Q: {prompt}")
            print(f"A: {result[:100]}...")
            print("-" * 60)
```

---

## 5. 响应处理

### 状态码

```python
"""
HTTP 状态码处理

常见状态码：
- 2xx: 成功
- 3xx: 重定向
- 4xx: 客户端错误
- 5xx: 服务器错误
"""

import requests

def handle_status_codes():
    """处理不同状态码"""
    response = requests.get("https://api.example.com/data")

    # 检查状态码
    status = response.status_code

    if status == 200:
        print("请求成功")
    elif status == 201:
        print("资源创建成功")
    elif status == 204:
        print("删除成功（无内容返回）")
    elif status == 400:
        print("请求参数错误")
    elif status == 401:
        print("未授权（需要登录）")
    elif status == 403:
        print("禁止访问（权限不足）")
    elif status == 404:
        print("资源不存在")
    elif status == 429:
        print("请求过于频繁（被限流）")
    elif status >= 500:
        print("服务器错误")

    # 使用 raise_for_status() 自动检查
    response.raise_for_status()  # 4xx 或 5xx 会抛出 HTTPError

# 状态码分类处理
def categorize_status():
    """按类别处理状态码"""
    response = requests.get("https://api.example.com/data")

    if response.ok:  # 状态码 < 400
        print("请求成功")
        return response.json()
    elif response.status_code == 429:
        # 被限流，等待后重试
        retry_after = int(response.headers.get("Retry-After", 60))
        print(f"被限流，{retry_after} 秒后重试")
    else:
        print(f"请求失败: {response.status_code}")
        print(f"错误信息: {response.text}")
```

### 响应头

```python
"""
响应头处理

响应头包含重要的元信息，如内容类型、缓存策略、限流信息等。
"""

import requests

def handle_response_headers():
    """处理响应头"""
    response = requests.get("https://api.example.com/data")

    # 获取所有响应头
    print("所有响应头:")
    for key, value in response.headers.items():
        print(f"  {key}: {value}")

    # 获取特定响应头
    content_type = response.headers.get("Content-Type")
    content_length = response.headers.get("Content-Length")

    # 检查内容类型
    if "application/json" in content_type:
        data = response.json()
    elif "text/html" in content_type:
        html = response.text
    elif "image/" in content_type:
        image_data = response.content

    # 限流相关响应头
    rate_limit = response.headers.get("X-RateLimit-Limit")
    rate_remaining = response.headers.get("X-RateLimit-Remaining")
    rate_reset = response.headers.get("X-RateLimit-Reset")

    if rate_remaining:
        print(f"剩余请求次数: {rate_remaining}/{rate_limit}")

    # 缓存相关响应头
    cache_control = response.headers.get("Cache-Control")
    etag = response.headers.get("ETag")
```

### JSON 解析

```python
"""
JSON 响应处理

大多数现代 API 返回 JSON 格式的数据。
"""

import requests

def parse_json_response():
    """解析 JSON 响应"""
    response = requests.get("https://api.example.com/data")

    # 解析 JSON
    data = response.json()

    # 安全解析（处理可能的 JSON 解析错误）
    try:
        data = response.json()
    except requests.exceptions.JSONDecodeError:
        print("响应不是有效的 JSON")
        print(f"原始内容: {response.text}")

# 处理嵌套 JSON
def parse_nested_json():
    """处理嵌套 JSON 响应"""
    # 模拟 LLM API 响应
    response_data = {
        "id": "chatcmpl-123",
        "object": "chat.completion",
        "created": 1234567890,
        "model": "gpt-4",
        "choices": [
            {
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": "GIL 是全局解释器锁...",
                },
                "finish_reason": "stop",
            }
        ],
        "usage": {
            "prompt_tokens": 10,
            "completion_tokens": 50,
            "total_tokens": 60,
        },
    }

    # 提取内容
    content = response_data["choices"][0]["message"]["content"]
    usage = response_data["usage"]
    print(f"回答: {content}")
    print(f"Token 使用: {usage['total_tokens']}")

# 处理 API 分页
def handle_pagination():
    """处理分页响应"""
    all_results = []
    url = "https://api.example.com/items"
    params = {"page": 1, "limit": 50}

    while True:
        response = requests.get(url, params=params)
        data = response.json()

        all_results.extend(data["items"])

        # 检查是否有下一页
        if data.get("next_page"):
            params["page"] = data["next_page"]
        else:
            break

    print(f"共获取 {len(all_results)} 条数据")
    return all_results
```

### 流式响应

```python
"""
流式响应处理

流式响应适用于：
1. 大文件下载
2. LLM 流式输出（逐 token 返回）
3. 实时数据推送
"""

import requests

# 流式文本响应
def stream_text_response():
    """流式读取大文本"""
    response = requests.get(
        "https://api.example.com/large-file.txt",
        stream=True,  # 启用流式模式
    )

    for chunk in response.iter_content(chunk_size=8192):
        if chunk:
            print(chunk.decode("utf-8"), end="")

# 流式 JSON（逐行）
def stream_json_lines():
    """处理流式 JSON 行（NDJSON）"""
    response = requests.get(
        "https://api.example.com/stream",
        stream=True,
    )

    for line in response.iter_lines():
        if line:
            import json
            data = json.loads(line.decode("utf-8"))
            print(data)

# AI Agent 场景：LLM 流式输出
def stream_llm_response():
    """处理 LLM 流式响应（SSE 格式）"""
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": "Bearer sk-your-key",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "gpt-4",
        "messages": [{"role": "user", "content": "讲个故事"}],
        "stream": True,  # 启用流式输出
    }

    response = requests.post(url, headers=headers, json=payload, stream=True, timeout=60)

    full_content = ""
    for line in response.iter_lines():
        if line:
            line_str = line.decode("utf-8")
            if line_str.startswith("data: "):
                data_str = line_str[6:]
                if data_str == "[DONE]":
                    break
                import json
                data = json.loads(data_str)
                delta = data["choices"][0].get("delta", {})
                content = delta.get("content", "")
                if content:
                    full_content += content
                    print(content, end="", flush=True)

    print(f"\n完整回答长度: {len(full_content)} 字符")
```

---

## 6. 高级用法

### 代理

```python
"""
HTTP 代理

代理用于：
1. 绕过地理限制
2. 隐藏真实 IP
3. 企业网络环境
"""

import requests

# 使用代理
def use_proxy():
    """使用 HTTP 代理"""
    proxies = {
        "http": "http://10.10.1.10:3128",
        "https": "http://10.10.1.10:1080",
    }

    response = requests.get(
        "https://api.example.com/data",
        proxies=proxies,
        timeout=10,
    )
    return response.json()

# 带认证的代理
def use_authenticated_proxy():
    """使用带认证的代理"""
    proxies = {
        "http": "http://user:password@proxy.example.com:3128",
        "https": "http://user:password@proxy.example.com:1080",
    }

    response = requests.get(
        "https://api.example.com/data",
        proxies=proxies,
        timeout=10,
    )
    return response.json()

# httpx 代理
def httpx_proxy():
    """httpx 使用代理"""
    import httpx

    proxies = {
        "http://": "http://10.10.1.10:3128",
        "https://": "http://10.10.1.10:1080",
    }

    with httpx.Client(proxies=proxies) as client:
        response = client.get("https://api.example.com/data")
        return response.json()
```

### SSL 证书

```python
"""
SSL 证书处理

默认情况下，requests 会验证 SSL 证书。
"""

import requests

# 跳过证书验证（不推荐，仅用于测试）
def skip_ssl_verification():
    """跳过 SSL 证书验证"""
    response = requests.get(
        "https://self-signed.example.com/api",
        verify=False,  # 跳过验证
        timeout=10,
    )
    return response.json()

# 使用自定义 CA 证书
def use_custom_ca():
    """使用自定义 CA 证书"""
    response = requests.get(
        "https://internal-api.company.com/data",
        verify="/path/to/ca-bundle.crt",
        timeout=10,
    )
    return response.json()

# httpx SSL 配置
def httpx_ssl_config():
    """httpx SSL 配置"""
    import httpx

    # 跳过验证
    with httpx.Client(verify=False) as client:
        response = client.get("https://self-signed.example.com/api")
        return response.json()

    # 使用自定义 CA
    with httpx.Client(verify="/path/to/ca-bundle.crt") as client:
        response = client.get("https://internal-api.company.com/data")
        return response.json()
```

### Cookie

```python
"""
Cookie 处理

Cookie 用于维持会话状态。
"""

import requests

# 手动设置 Cookie
def set_cookies():
    """手动设置 Cookie"""
    cookies = {
        "session_id": "abc123",
        "user_pref": "zh-CN",
    }
    response = requests.get(
        "https://api.example.com/data",
        cookies=cookies,
    )
    return response.json()

# 从响应获取 Cookie
def get_response_cookies():
    """从响应获取 Cookie"""
    response = requests.get("https://api.example.com/login")

    # 获取所有 Cookie
    for cookie in response.cookies:
        print(f"{cookie.name}: {cookie.value}")

    # 获取特定 Cookie
    session_id = response.cookies.get("session_id")

# Session 自动管理 Cookie
def session_cookie_management():
    """Session 自动管理 Cookie"""
    session = requests.Session()

    # 登录请求 - 服务器返回 Set-Cookie
    session.post(
        "https://api.example.com/login",
        data={"username": "admin", "password": "secret"},
    )

    # 后续请求自动携带 Cookie
    data = session.get("https://api.example.com/protected")
    print(data.json())
```

### 认证

```python
"""
HTTP 认证

常见认证方式：
1. Basic Auth - 基本认证
2. Bearer Token - 令牌认证（JWT/OAuth）
3. API Key - API 密钥
"""

import requests
from requests.auth import HTTPBasicAuth, HTTPDigestAuth

# Basic Auth
def basic_auth():
    """HTTP 基本认证"""
    # 方式 1：使用 auth 参数
    response = requests.get(
        "https://api.example.com/data",
        auth=("username", "password"),
    )

    # 方式 2：使用 HTTPBasicAuth
    response = requests.get(
        "https://api.example.com/data",
        auth=HTTPBasicAuth("username", "password"),
    )

    return response.json()

# Bearer Token
def bearer_token():
    """Bearer Token 认证"""
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIs...",
    }
    response = requests.get(
        "https://api.example.com/data",
        headers=headers,
    )
    return response.json()

# API Key
def api_key_auth():
    """API Key 认证"""
    # 方式 1：在请求头中
    headers = {"X-API-Key": "your-api-key"}
    response = requests.get(
        "https://api.example.com/data",
        headers=headers,
    )

    # 方式 2：在查询参数中
    response = requests.get(
        "https://api.example.com/data",
        params={"api_key": "your-api-key"},
    )

    return response.json()

# AI Agent 场景：多种 LLM API 认证
def multi_llm_auth():
    """不同 LLM API 的认证方式"""
    import httpx

    # OpenAI - Bearer Token
    with httpx.Client(base_url="https://api.openai.com/v1") as client:
        client.headers["Authorization"] = "Bearer sk-openai-key"
        resp = client.post("/chat/completions", json={
            "model": "gpt-4",
            "messages": [{"role": "user", "content": "你好"}],
        })

    # Anthropic - API Key 头
    with httpx.Client(base_url="https://api.anthropic.com") as client:
        client.headers["x-api-key"] = "sk-ant-key"
        client.headers["anthropic-version"] = "2023-06-01"
        resp = client.post("/v1/messages", json={
            "model": "claude-3-sonnet",
            "max_tokens": 1000,
            "messages": [{"role": "user", "content": "你好"}],
        })

    # Google Gemini - 查询参数
    with httpx.Client(base_url="https://generativelanguage.googleapis.com") as client:
        resp = client.post(
            "/v1beta/models/gemini-pro:generateContent",
            params={"key": "your-google-api-key"},
            json={"contents": [{"parts": [{"text": "你好"}]}]},
        )
```

> **JS 开发者提示**
>
> Python 的认证方式与 JS 对比：
>
> ```javascript
> // JS Basic Auth
> const response = await fetch(url, {
>     headers: { 'Authorization': 'Basic ' + btoa('user:pass') }
> });
>
> // JS Bearer Token
> const response = await fetch(url, {
>     headers: { 'Authorization': 'Bearer ' + token }
> });
> ```
>
> Python 的 `auth=("user", "pass")` 更加简洁，自动处理 Base64 编码。

---

## 7. 错误处理

```python
"""
HTTP 请求错误处理

常见错误类型：
1. 网络异常（连接失败、DNS 解析失败）
2. HTTP 错误（4xx、5xx）
3. 超时错误
4. SSL 错误
"""

import requests

# 完整错误处理
def comprehensive_error_handling():
    """完整的错误处理"""
    url = "https://api.example.com/data"

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()  # 检查 HTTP 错误
        return response.json()

    except requests.exceptions.Timeout:
        print("请求超时，请检查网络连接")
    except requests.exceptions.ConnectionError:
        print("连接失败，请检查网络或代理设置")
    except requests.exceptions.HTTPError as e:
        status = e.response.status_code
        if status == 401:
            print("认证失败，请检查 API Key")
        elif status == 403:
            print("权限不足")
        elif status == 404:
            print("资源不存在")
        elif status == 429:
            retry_after = e.response.headers.get("Retry-After", "60")
            print(f"请求过于频繁，请等待 {retry_after} 秒后重试")
        elif status >= 500:
            print(f"服务器错误 ({status})，请稍后重试")
        else:
            print(f"HTTP 错误: {e}")
    except requests.exceptions.RequestException as e:
        print(f"请求异常: {e}")
    except ValueError:
        print("响应不是有效的 JSON")

# 重试错误处理
def retry_error_handling():
    """带重试的错误处理"""
    import time

    url = "https://api.example.com/data"
    max_retries = 3

    for attempt in range(max_retries):
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"第 {attempt + 1} 次尝试失败: {e}")
            if attempt < max_retries - 1:
                wait_time = 2 ** attempt
                print(f"等待 {wait_time} 秒后重试...")
                time.sleep(wait_time)

    raise Exception(f"请求失败，已重试 {max_retries} 次")

# AI Agent 场景：健壮的 LLM 调用
def robust_llm_call(prompt, model="gpt-4"):
    """健壮的 LLM 调用（带完整错误处理）"""
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": "Bearer sk-your-key",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 1000,
    }

    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=30)

            if response.status_code == 429:
                # 被限流
                retry_after = int(response.headers.get("Retry-After", 2 ** attempt))
                print(f"被限流，等待 {retry_after} 秒...")
                import time
                time.sleep(retry_after)
                continue

            if response.status_code == 500:
                # 服务器错误
                print("服务器错误，重试中...")
                import time
                time.sleep(2 ** attempt)
                continue

            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]

        except requests.exceptions.Timeout:
            print(f"请求超时 (尝试 {attempt + 1}/{max_retries})")
            if attempt == max_retries - 1:
                raise
        except requests.exceptions.ConnectionError:
            print(f"连接失败 (尝试 {attempt + 1}/{max_retries})")
            if attempt == max_retries - 1:
                raise

    raise Exception("LLM 调用失败")
```

---

## 8. 综合实战：AI Agent HTTP 工具类

```python
"""
综合实战：构建 AI Agent HTTP 工具类

整合本章所有知识点，构建一个生产级别的 HTTP 工具类。
"""

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import json
import time

class AIAgentHTTPClient:
    """AI Agent HTTP 客户端"""

    def __init__(
        self,
        base_url: str,
        api_key: str,
        timeout: float = 30.0,
        max_retries: int = 3,
    ):
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

        # 创建 Session
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "User-Agent": "AIAgent/1.0",
        })

        # 配置重试策略
        retry_strategy = Retry(
            total=max_retries,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["GET", "POST", "PUT", "DELETE"],
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        self.session.mount("https://", adapter)
        self.session.mount("http://", adapter)

    def get(self, path: str, params: dict = None) -> dict:
        """GET 请求"""
        url = f"{self.base_url}/{path.lstrip('/')}"
        response = self.session.get(url, params=params, timeout=self.timeout)
        response.raise_for_status()
        return response.json()

    def post(self, path: str, data: dict = None) -> dict:
        """POST 请求"""
        url = f"{self.base_url}/{path.lstrip('/')}"
        response = self.session.post(url, json=data, timeout=self.timeout)
        response.raise_for_status()
        return response.json()

    def post_stream(self, path: str, data: dict = None):
        """POST 流式请求（用于 LLM 流式输出）"""
        url = f"{self.base_url}/{path.lstrip('/')}"
        payload = {**(data or {}), "stream": True}
        response = self.session.post(
            url, json=payload, timeout=self.timeout, stream=True
        )
        response.raise_for_status()

        for line in response.iter_lines():
            if line:
                line_str = line.decode("utf-8")
                if line_str.startswith("data: "):
                    data_str = line_str[6:]
                    if data_str == "[DONE]":
                        break
                    yield json.loads(data_str)

    def close(self):
        """关闭客户端"""
        self.session.close()

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.close()


# 使用示例
def example_usage():
    """使用示例"""
    with AIAgentHTTPClient(
        base_url="https://api.openai.com/v1",
        api_key="sk-your-key",
        timeout=30,
        max_retries=3,
    ) as client:
        # 普通请求
        result = client.post(
            "/chat/completions",
            data={
                "model": "gpt-4",
                "messages": [{"role": "user", "content": "你好"}],
            },
        )
        print(result["choices"][0]["message"]["content"])

        # 流式请求
        print("\n流式输出:")
        for chunk in client.post_stream(
            "/chat/completions",
            data={
                "model": "gpt-4",
                "messages": [{"role": "user", "content": "讲个故事"}],
            },
        ):
            delta = chunk["choices"][0].get("delta", {})
            content = delta.get("content", "")
            if content:
                print(content, end="", flush=True)
```

---

## 自查清单

- [ ] 我已经能解释“1. 概述”的核心概念。
- [ ] 我已经能把“1. 概述”写成最小可运行示例。
- [ ] 我已经能解释“2. requests 库基础”的核心概念。
- [ ] 我已经能把“2. requests 库基础”写成最小可运行示例。
- [ ] 我已经能解释“3. requests Session”的核心概念。
- [ ] 我已经能把“3. requests Session”写成最小可运行示例。
- [ ] 我已经能解释“4. httpx 库”的核心概念。
- [ ] 我已经能把“4. httpx 库”写成最小可运行示例。
- [ ] 我已经能解释“5. 响应处理”的核心概念。
- [ ] 我已经能把“5. 响应处理”写成最小可运行示例。
- [ ] 我已经能解释“6. 高级用法”的核心概念。
- [ ] 我已经能把“6. 高级用法”写成最小可运行示例。
- [ ] 我已经能解释“7. 错误处理”的核心概念。
- [ ] 我已经能把“7. 错误处理”写成最小可运行示例。
- [ ] 我已经能解释“8. 综合实战：AI Agent HTTP 工具类”的核心概念。
- [ ] 我已经能把“8. 综合实战：AI Agent HTTP 工具类”写成最小可运行示例。

---

## 本章小结

这一章可以浓缩为以下几件事：

- 1. 概述：这是本章必须掌握的核心能力。
- 2. requests 库基础：这是本章必须掌握的核心能力。
- 3. requests Session：这是本章必须掌握的核心能力。
- 4. httpx 库：这是本章必须掌握的核心能力。
- 5. 响应处理：这是本章必须掌握的核心能力。
- 6. 高级用法：这是本章必须掌握的核心能力。
- 7. 错误处理：这是本章必须掌握的核心能力。
- 8. 综合实战：AI Agent HTTP 工具类：这是本章必须掌握的核心能力。

---

## 学习明细与练习任务

### 知识点掌握清单

- [ ] 阅读并复现“1. 概述”中的关键代码。
- [ ] 阅读并复现“2. requests 库基础”中的关键代码。
- [ ] 阅读并复现“3. requests Session”中的关键代码。
- [ ] 阅读并复现“4. httpx 库”中的关键代码。
- [ ] 阅读并复现“5. 响应处理”中的关键代码。
- [ ] 阅读并复现“6. 高级用法”中的关键代码。
- [ ] 阅读并复现“7. 错误处理”中的关键代码。
- [ ] 阅读并复现“8. 综合实战：AI Agent HTTP 工具类”中的关键代码。

### 练习任务（由易到难）

1. 基础练习（15 - 30 分钟）：从本章挑 1 个最基础示例，手敲一遍并改 2 个输入参数观察输出差异。
2. 场景练习（30 - 60 分钟）：把本章至少 2 个知识点拼成一个小脚本，要求包含输入、处理、输出三个步骤。
3. 工程练习（60 - 90 分钟）：按你的工作背景，把本章内容改造成一个更真实的小工具或 Demo。

---

## 常见问题 FAQ

**Q：这一章“HTTP 请求”需要全部背下来吗？**  
A：不需要。先掌握核心概念和最常见写法，剩下的通过练习和查文档逐步补齐。

---

**Q：我是 JS/TS 开发者，最容易踩什么坑？**  
A：最常见的问题是按 JS/TS 的语法和运行时直觉去猜 Python 行为。遇到分歧时，优先回到最小示例验证。

---

**Q：学完这一章后，怎么确认自己真的会了？**  
A：标准不是“看懂了”，而是你能不看答案把本章最关键的例子重新写出来，并解释为什么这么写。

---

> **下一步**：继续学习第 16 天内容，保持按顺序推进，后续章节会默认你已经掌握今天的基础。

---

*文档基于：Phase 3 · 异步与 API*  
*生成日期：2026-04-04*

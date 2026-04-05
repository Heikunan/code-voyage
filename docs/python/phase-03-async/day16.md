---
title: 第 16 天 - Pydantic 数据验证
icon: code
order: 16
---

# 第 16 天 — Pydantic 数据验证

> **对应原文档**：本项目为新增内容。Pydantic 是现代 Python 项目的核心数据验证库，在 AI Agent 开发中尤为重要。原 Day 1-100 项目中没有专门的数据验证教程，本节补充了这一关键技能。
> **预计学习时间**：1 天
> **本章目标**：掌握 Pydantic 的数据验证、字段配置、嵌套模型与配置管理能力
> **前置知识**：第 15 天，建议已掌握函数、类、异常、模块基础
> **已有技能读者建议**：如果你有 JS / TS 基础，优先把 Python 的模块化、异常处理、并发模型和 Web 框架思路与 Node.js 生态做对照。

---

## 目录

- [章节概述](#章节概述)
- [本章知识地图](#本章知识地图)
- [已有技能快速对照js-ts-python](#已有技能快速对照js-ts-python)
- [迁移陷阱js-ts-python](#迁移陷阱js-ts-python)
- [1. 概述](#1-概述)
- [2. Pydantic 基础](#2-pydantic-基础)
- [3. 字段配置](#3-字段配置)
- [4. 序列化](#4-序列化)
- [5. 嵌套模型](#5-嵌套模型)
- [6. 配置管理 (pydantic-settings)](#6-配置管理-pydantic-settings)
- [7. 实战：AI Agent 配置模型](#7-实战ai-agent-配置模型)
- [自查清单](#自查清单)
- [本章小结](#本章小结)
- [学习明细与练习任务](#学习明细与练习任务)
- [常见问题 FAQ](#常见问题-faq)

---

## 章节概述

本章会把“类型注解”推进到“运行时数据校验”，这是 Python 从脚本语言走向服务端与工程化的重要一步。

| 小节 | 内容 | 重要性 |
| --- | --- | --- |
| 1. 概述 | ★★★★☆ |
| 2. Pydantic 基础 | ★★★★☆ |
| 3. 字段配置 | ★★★★☆ |
| 4. 序列化 | ★★★★☆ |
| 5. 嵌套模型 | ★★★★☆ |
| 6. 配置管理 (pydantic-settings) | ★★★★☆ |
| 7. 实战：AI Agent 配置模型 | ★★★★☆ |

---

## 本章知识地图

```mermaid
graph TD
    n1["1. 概述"]
    n2["2. Pydantic 基础"]
    n1 --> n2
    n3["3. 字段配置"]
    n2 --> n3
    n4["4. 序列化"]
    n3 --> n4
    n5["5. 嵌套模型"]
    n4 --> n5
    n6["6. 配置管理 (pydantic-settings)"]
    n5 --> n6
    n7["7. 实战：AI Agent 配置模型"]
    n6 --> n7
```

---

## 已有技能快速对照（JS/TS -> Python）

本章建议优先建立与当前主题直接相关的迁移直觉，而不是泛泛对比语法差异。

| 你熟悉的 JS/TS 世界 | Python 世界 | 本章需要建立的直觉 |
| --- | --- | --- |
| TS interface + zod/yup | Pydantic model | Python 常把类型定义和运行时验证放进同一个模型对象里 |
| config schema | `BaseSettings` / settings model | 配置在 Python 服务里通常直接建模，而不是散落读取环境变量 |
| DTO transform | `model_validate` / `model_dump` | Pydantic 会成为接口层、配置层和内部数据流的统一边界 |

---

## 迁移陷阱（JS/TS -> Python）

- **把 Pydantic 当普通 dataclass**：它真正的价值在于验证、转换和边界建模。
- **只写字段类型，不写约束**：很多输入问题可以在模型层提前被挡住。
- **把配置读取分散在业务里**：一旦有环境差异，代码会迅速变乱。

---

## 1. 概述

Pydantic 是现代 Python 项目中最核心的数据验证和序列化库。对于 JavaScript 开发者来说，Pydantic 的角色类似于 **Zod** 或 **Joi**，但它与 Python 类型注解深度集成，提供了更强大的功能。

在 AI Agent 开发中，Pydantic 几乎是必备工具：LLM 返回的结构化数据验证、API 请求/响应模型定义、配置管理等场景都会用到。

---

## 2. Pydantic 基础

### 1.1 安装

```bash
pip install pydantic
```

> 注意：本教程基于 Pydantic v2，这是当前主流版本。v2 使用 Rust 核心（pydantic-core），性能比 v1 提升 5-50 倍。

### 1.2 第一个 BaseModel

```python
from pydantic import BaseModel

# 定义一个用户模型
class User(BaseModel):
    id: int
    name: str
    email: str
    age: int = 0  # 带默认值的字段

# 创建实例 - 自动类型转换和验证
user = User(id=1, name="张三", email="zhangsan@example.com")
print(user)
# 输出: id=1 name='张三' email='zhangsan@example.com' age=0

# 访问属性
print(user.name)  # 张三
print(user.age)   # 0 (默认值)
```

> **JS 开发者提示**: 对比 Zod 的定义方式：
> ```javascript
> import { z } from "zod";
> const UserSchema = z.object({
>   id: z.number(),
>   name: z.string(),
>   email: z.string().email(),
>   age: z.number().default(0),
> });
> const user = UserSchema.parse({ id: 1, name: "张三", email: "zhangsan@example.com" });
> ```
> Pydantic 的优势在于定义即类型，Python 的类型检查器（mypy）可以直接识别 `User` 类型。

### 1.3 自动类型验证与转换

Pydantic 会尝试进行合理的类型转换：

```python
from pydantic import BaseModel

class Product(BaseModel):
    id: int
    name: str
    price: float
    in_stock: bool

# 字符串会被自动转换为对应类型
product = Product(
    id="42",           # str -> int
    name="Python教程",
    price="99.9",      # str -> float
    in_stock="yes"     # str -> bool (Pydantic 能识别常见真值)
)
print(product.price)      # 99.9
print(product.in_stock)   # True

# 验证失败会抛出 ValidationError
try:
    bad_product = Product(id="abc", name="测试", price="not_a_number", in_stock=True)
except Exception as e:
    print(type(e).__name__)  # ValidationError
    print(e)
    # 输出详细的错误信息，指出哪些字段验证失败
```

### 1.4 常见类型注解

```python
from pydantic import BaseModel, EmailStr, HttpUrl
from datetime import datetime
from typing import List, Optional, Dict, Any, Set, Tuple

class Article(BaseModel):
    # 基本类型
    title: str
    views: int
    rating: float
    is_published: bool

    # Optional 表示字段可以为 None（等同于 JS 的 undefined | null）
    subtitle: Optional[str] = None

    # 集合类型
    tags: List[str] = []
    categories: Set[str] = set()
    metadata: Dict[str, Any] = {}
    coordinates: Tuple[float, float] = (0.0, 0.0)

    # Pydantic 内置的特殊类型
    author_email: EmailStr           # 自动验证邮箱格式
    website: Optional[HttpUrl] = None  # 自动验证 URL 格式
    created_at: datetime             # 自动解析多种日期格式

# 使用示例
article = Article(
    title="Pydantic 入门",
    views=1000,
    rating=4.5,
    is_published=True,
    tags=["python", "pydantic", "tutorial"],
    author_email="author@example.com",
    website="https://example.com",
    created_at="2024-01-15T10:30:00",
    coordinates=(39.9, 116.4)
)
```

---

## 3. 字段配置

### 2.1 Field() 函数

`Field()` 提供了丰富的字段级配置选项：

```python
from pydantic import BaseModel, Field
from typing import Optional

class Item(BaseModel):
    # 基本配置
    name: str = Field(
        ...,                    # ... 表示必填字段（等同于不设置默认值）
        min_length=2,
        max_length=100,
        description="物品名称"
    )

    price: float = Field(
        default=0.0,
        gt=0,                   # 必须大于 0
        le=999999,              # 必须小于等于 999999
        description="价格"
    )

    # 别名 - 使用 JSON 字段名与 Python 属性名不同
    item_id: int = Field(
        alias="itemId",         # JSON 中使用 itemId
        description="物品ID"
    )

    # 可选字段带验证
    description: Optional[str] = Field(
        default=None,
        max_length=500,
        description="物品描述"
    )

    # 使用示例值（用于自动生成文档）
    category: str = Field(
        default="general",
        examples=["electronics", "books", "clothing"],
        description="物品分类"
    )

# 使用别名创建实例
item = Item.model_validate({
    "itemId": 1,
    "name": "Python编程",
    "price": 89.9,
    "description": "一本好书"
})
print(item.item_id)  # 1
```

### 2.2 field_validator - 字段级验证器

```python
from pydantic import BaseModel, field_validator
import re

class User(BaseModel):
    username: str
    password: str
    age: int
    phone: str

    # 验证用户名格式
    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        if len(v) < 3:
            raise ValueError("用户名至少需要 3 个字符")
        if not re.match(r"^[a-zA-Z0-9_]+$", v):
            raise ValueError("用户名只能包含字母、数字和下划线")
        return v

    # 验证密码强度
    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("密码至少需要 8 个字符")
        if not re.search(r"[A-Z]", v):
            raise ValueError("密码必须包含大写字母")
        if not re.search(r"[0-9]", v):
            raise ValueError("密码必须包含数字")
        return v

    # 验证年龄范围
    @field_validator("age")
    @classmethod
    def validate_age(cls, v: int) -> int:
        if v < 0 or v > 150:
            raise ValueError("年龄必须在 0-150 之间")
        return v

    # 验证手机号格式
    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        if not re.match(r"^1[3-9]\d{9}$", v):
            raise ValueError("请输入有效的中国手机号")
        return v

    # 一个验证器可以处理多个字段
    @field_validator("username", "password")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        return v.strip()

# 测试
try:
    user = User(
        username="ab",  # 太短，会失败
        password="weak",
        age=200,
        phone="12345"
    )
except Exception as e:
    print(e)
    # 会列出所有验证失败的字段和原因
```

> **JS 开发者提示**: Zod 中的 `.refine()` 或 `.superRefine()` 类似于 Pydantic 的 `field_validator`。但 Pydantic 的验证器是类方法，可以访问 `cls`，并且支持 `mode="before"` 在类型转换前执行。

### 2.3 model_validator - 模型级验证器

当验证逻辑涉及多个字段之间的关系时，使用 `model_validator`：

```python
from pydantic import BaseModel, model_validator
from typing import Optional

class Event(BaseModel):
    title: str
    start_date: str
    end_date: str
    max_attendees: int
    current_attendees: int = 0

    # before=True: 在字段验证之前执行
    @model_validator(mode="before")
    @classmethod
    def normalize_dates(cls, data: dict) -> dict:
        """在验证前标准化日期格式"""
        if isinstance(data, dict):
            if "start_date" in data and isinstance(data["start_date"], str):
                data["start_date"] = data["start_date"].strip()
            if "end_date" in data and isinstance(data["end_date"], str):
                data["end_date"] = data["end_date"].strip()
        return data

    # mode="after"（默认）: 在所有字段验证之后执行
    @model_validator(mode="after")
    def validate_date_range(self) -> "Event":
        """验证结束日期晚于开始日期"""
        from datetime import datetime
        start = datetime.fromisoformat(self.start_date)
        end = datetime.fromisoformat(self.end_date)
        if end <= start:
            raise ValueError("结束日期必须晚于开始日期")
        return self

    @model_validator(mode="after")
    def validate_attendees(self) -> "Event":
        """验证当前参与人数不超过上限"""
        if self.current_attendees > self.max_attendees:
            raise ValueError("当前参与人数不能超过最大人数限制")
        return self

# 测试
event = Event(
    title="Python 技术分享会",
    start_date="2024-03-01T14:00:00",
    end_date="2024-03-01T16:00:00",
    max_attendees=50,
    current_attendees=30
)
print(event.title)  # Python 技术分享会
```

### 2.4 验证器执行顺序

```python
from pydantic import BaseModel, field_validator, model_validator

class OrderedModel(BaseModel):
    value: str

    # 1. mode="before" 的 field_validator 最先执行
    @field_validator("value", mode="before")
    @classmethod
    def before_field(cls, v):
        print(f"1. before field_validator: {v}")
        return v

    # 2. 默认的 field_validator (mode="after")
    @field_validator("value")
    @classmethod
    def after_field(cls, v):
        print(f"2. after field_validator: {v}")
        return v.upper()

    # 3. mode="after" 的 model_validator 最后执行
    @model_validator(mode="after")
    def after_model(self):
        print(f"3. after model_validator: {self.value}")
        return self

model = OrderedModel(value="hello")
# 输出:
# 1. before field_validator: hello
# 2. after field_validator: hello
# 3. after model_validator: HELLO
```

---

## 4. 序列化

### 3.1 model_dump - 转换为字典

```python
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class UserProfile(BaseModel):
    id: int
    name: str
    email: str
    bio: Optional[str] = None
    created_at: datetime
    is_active: bool = True

    class Config:
        # 配置序列化行为
        from_attributes = True  # 允许从 ORM 对象创建

# 创建实例
user = UserProfile(
    id=1,
    name="李四",
    email="lisi@example.com",
    bio="Python 开发者",
    created_at=datetime.now(),
    is_active=True
)

# 基本序列化 - 转为 Python 字典
data = user.model_dump()
print(data)
# {
#     'id': 1,
#     'name': '李四',
#     'email': 'lisi@example.com',
#     'bio': 'Python 开发者',
#     'created_at': datetime.datetime(...),
#     'is_active': True
# }

# 排除特定字段
data_no_email = user.model_dump(exclude={"email", "is_active"})
print(data_no_email)
# {'id': 1, 'name': '李四', 'bio': 'Python 开发者', 'created_at': ..., 'is_active': True}

# 只包含特定字段
data_minimal = user.model_dump(include={"id", "name"})
print(data_minimal)
# {'id': 1, 'name': '李四'}

# 排除默认值
data_no_defaults = user.model_dump(exclude_unset=True)
# 只包含创建时显式设置的字段

# 排除 None 值
data_no_none = user.model_dump(exclude_none=True)

# 自定义日期格式
data_with_str_date = user.model_dump(mode="json")
# datetime 会被转换为 ISO 格式字符串
```

### 3.2 model_dump_json - 转换为 JSON 字符串

```python
import json
from pydantic import BaseModel

class Config(BaseModel):
    host: str = "localhost"
    port: int = 8000
    debug: bool = False

config = Config(host="0.0.0.0", port=3000, debug=True)

# 直接输出 JSON 字符串
json_str = config.model_dump_json()
print(json_str)
# {"host":"0.0.0.0","port":3000,"debug":true}

# 格式化输出（缩进）
json_pretty = config.model_dump_json(indent=2)
print(json_pretty)
# {
#   "host": "0.0.0.0",
#   "port": 3000,
#   "debug": true
# }

# 排除字段
json_safe = config.model_dump_json(exclude={"debug"})
print(json_safe)
# {"host":"0.0.0.0","port":3000}
```

### 3.3 model_validate - 从字典/JSON 创建实例

```python
from pydantic import BaseModel
from datetime import datetime

class LogEntry(BaseModel):
    level: str
    message: str
    timestamp: datetime
    source: str

# 从字典创建
data = {
    "level": "INFO",
    "message": "服务启动成功",
    "timestamp": "2024-01-15T10:00:00",
    "source": "main"
}
log = LogEntry.model_validate(data)
print(log.level)  # INFO

# 从 JSON 字符串创建
json_str = '{"level":"ERROR","message":"连接失败","timestamp":"2024-01-15T10:05:00","source":"db"}'
log2 = LogEntry.model_validate_json(json_str)
print(log2.message)  # 连接失败
```

> **JS 开发者提示**: `model_validate` 类似于 Zod 的 `.parse()`，`model_validate_json` 类似于先 `JSON.parse()` 再 `.parse()`。Pydantic 的优势是可以直接从 ORM 对象（如 SQLAlchemy 模型）创建实例。

---

## 5. 嵌套模型

### 4.1 基础嵌套

```python
from pydantic import BaseModel
from typing import List, Optional

class Address(BaseModel):
    street: str
    city: str
    state: str
    zip_code: str
    country: str = "中国"

class ContactInfo(BaseModel):
    email: str
    phone: Optional[str] = None
    wechat: Optional[str] = None

class Employee(BaseModel):
    id: int
    name: str
    department: str
    address: Address              # 嵌套模型
    contact: ContactInfo          # 嵌套模型
    skills: List[str] = []

# 创建嵌套实例
employee = Employee(
    id=1001,
    name="王五",
    department="研发部",
    address={
        "street": "中关村大街1号",
        "city": "北京",
        "state": "北京",
        "zip_code": "100080"
    },
    contact={
        "email": "wangwu@company.com",
        "phone": "13800138000"
    },
    skills=["Python", "FastAPI", "PostgreSQL"]
)

# 访问嵌套属性
print(employee.address.city)     # 北京
print(employee.contact.email)    # wangwu@company.com

# 序列化时自动展开嵌套结构
print(employee.model_dump())
# 完整的嵌套字典结构
```

### 4.2 列表中的嵌套模型

```python
from pydantic import BaseModel
from typing import List, Dict
from datetime import date

class Task(BaseModel):
    id: int
    title: str
    completed: bool = False
    due_date: date

class Project(BaseModel):
    name: str
    owner: str
    tasks: List[Task]                    # 模型列表
    metadata: Dict[str, str] = {}        # 字典

class Team(BaseModel):
    name: str
    lead: str
    projects: List[Project]              # 多层嵌套

# 创建复杂嵌套数据
team = Team(
    name="AI 研发团队",
    lead="赵六",
    projects=[
        {
            "name": "智能客服系统",
            "owner": "张三",
            "tasks": [
                {"id": 1, "title": "需求分析", "completed": True, "due_date": "2024-02-01"},
                {"id": 2, "title": "模型训练", "completed": False, "due_date": "2024-03-15"},
                {"id": 3, "title": "接口开发", "completed": False, "due_date": "2024-04-01"}
            ]
        },
        {
            "name": "数据分析平台",
            "owner": "李四",
            "tasks": [
                {"id": 4, "title": "数据清洗", "completed": True, "due_date": "2024-02-15"}
            ]
        }
    ]
)

# 统计所有未完成的任务
pending_tasks = [
    task.title
    for project in team.projects
    for task in project.tasks
    if not task.completed
]
print(f"未完成任务: {pending_tasks}")
# 未完成任务: ['模型训练', '接口开发']
```

### 4.3 AI Agent 场景：工具调用模型

```python
from pydantic import BaseModel, Field
from typing import List, Optional, Union, Literal
from datetime import datetime

# 定义工具参数基类
class ToolParameter(BaseModel):
    name: str
    type: Literal["string", "number", "boolean", "array", "object"]
    description: str
    required: bool = False

# 定义工具
class Tool(BaseModel):
    name: str
    description: str
    parameters: List[ToolParameter]

# 定义工具调用
class ToolCall(BaseModel):
    id: str
    name: str
    arguments: dict  # 实际调用参数

# 定义消息
class Message(BaseModel):
    role: Literal["system", "user", "assistant", "tool"]
    content: Optional[str] = None
    tool_calls: Optional[List[ToolCall]] = None
    tool_call_id: Optional[str] = None  # 工具响应时的关联 ID

# 定义对话
class Conversation(BaseModel):
    messages: List[Message]
    model: str = "gpt-4"
    temperature: float = Field(default=0.7, ge=0, le=2)
    tools: Optional[List[Tool]] = None
    stream: bool = False

# 构建一个完整的 Agent 对话
conversation = Conversation(
    messages=[
        Message(role="system", content="你是一个有用的助手"),
        Message(role="user", content="查询北京今天的天气"),
        Message(
            role="assistant",
            tool_calls=[
                ToolCall(
                    id="call_abc123",
                    name="get_weather",
                    arguments={"city": "北京", "date": "today"}
                )
            ]
        ),
        Message(
            role="tool",
            content='{"temperature": 22, "condition": "晴", "humidity": 45}',
            tool_call_id="call_abc123"
        ),
        Message(role="assistant", content="北京今天天气晴朗，气温22度，湿度45%。")
    ],
    tools=[
        Tool(
            name="get_weather",
            description="获取指定城市的天气信息",
            parameters=[
                ToolParameter(name="city", type="string", description="城市名称", required=True),
                ToolParameter(name="date", type="string", description="日期，如 today/tomorrow")
            ]
        )
    ]
)

# 序列化为 JSON 发送给 LLM API
api_payload = conversation.model_dump_json(exclude_none=True)
print(api_payload[:200])  # 查看前 200 字符
```

---

## 6. 配置管理 (pydantic-settings)

### 5.1 安装

```bash
pip install pydantic-settings
```

### 5.2 基础用法

```python
# config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # 应用配置
    app_name: str = "AI Agent Application"
    app_version: str = "1.0.0"
    debug: bool = False

    # 数据库配置
    database_url: str = "sqlite:///./app.db"
    db_pool_size: int = 5

    # LLM 配置
    openai_api_key: str
    openai_model: str = "gpt-4"
    openai_base_url: Optional[str] = None

    # 服务器配置
    host: str = "0.0.0.0"
    port: int = 8000

    # 日志配置
    log_level: str = "INFO"
    log_file: Optional[str] = None

    # 配置类
    model_config = SettingsConfigDict(
        env_file=".env",           # 从 .env 文件读取
        env_file_encoding="utf-8",
        case_sensitive=False,      # 环境变量名不区分大小写
        extra="ignore"             # 忽略额外的环境变量
    )

# 创建单例
settings = Settings()
```

### 5.3 .env 文件示例

```env
# .env (开发环境)
APP_NAME=AI Agent Dev
DEBUG=true
DATABASE_URL=postgresql://user:pass@localhost:5432/agent_db
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4-turbo
LOG_LEVEL=DEBUG
```

```env
# .env.production (生产环境)
APP_NAME=AI Agent Production
DEBUG=false
DATABASE_URL=postgresql://user:pass@prod-db:5432/agent_db
OPENAI_API_KEY=${OPENAI_API_KEY}  # 从系统环境变量读取
OPENAI_MODEL=gpt-4
LOG_LEVEL=WARNING
```

### 5.4 多环境配置

```python
from pydantic_settings import BaseSettings, SettingsConfigDict
from enum import Enum

class Environment(str, Enum):
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"
    TESTING = "testing"

class BaseAppSettings(BaseSettings):
    """基础配置"""
    app_name: str
    environment: Environment
    debug: bool = False

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False
    )

class DevelopmentSettings(BaseAppSettings):
    """开发环境配置"""
    debug: bool = True
    database_url: str = "sqlite:///./dev.db"
    log_level: str = "DEBUG"
    cors_origins: list = ["http://localhost:3000"]

class ProductionSettings(BaseAppSettings):
    """生产环境配置"""
    debug: bool = False
    database_url: str  # 必须提供
    log_level: str = "WARNING"
    cors_origins: list = ["https://yourdomain.com"]
    secret_key: str    # 必须提供

class TestingSettings(BaseAppSettings):
    """测试环境配置"""
    database_url: str = "sqlite:///./test.db"
    log_level: str = "ERROR"

# 工厂函数 - 根据环境返回对应配置
def get_settings() -> BaseAppSettings:
    import os
    env = os.getenv("APP_ENV", "development")

    if env == "production":
        return ProductionSettings()
    elif env == "testing":
        return TestingSettings()
    else:
        return DevelopmentSettings()

# 使用
settings = get_settings()
print(f"环境: {settings.environment}")
print(f"调试: {settings.debug}")
```

### 5.5 字段级环境变量配置

```python
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import Optional

class DatabaseSettings(BaseSettings):
    """数据库专用配置"""
    host: str = Field(default="localhost", alias="DB_HOST")
    port: int = Field(default=5432, alias="DB_PORT")
    name: str = Field(default="app", alias="DB_NAME")
    user: str = Field(default="postgres", alias="DB_USER")
    password: str = Field(default="", alias="DB_PASSWORD")

    @property
    def dsn(self) -> str:
        """生成数据库连接字符串"""
        return f"postgresql://{self.user}:{self.password}@{self.host}:{self.port}/{self.name}"

    model_config = SettingsConfigDict(
        env_prefix="",           # 不使用前缀（因为字段已有别名）
        env_file=".env.db",      # 专用 .env 文件
        populate_by_name=True    # 允许通过属性名或别名设置
    )

class LLMSettings(BaseSettings):
    """LLM 专用配置"""
    provider: str = Field(default="openai", alias="LLM_PROVIDER")
    api_key: str = Field(..., alias="LLM_API_KEY")
    model: str = Field(default="gpt-4", alias="LLM_MODEL")
    temperature: float = Field(default=0.7, alias="LLM_TEMPERATURE")
    max_tokens: int = Field(default=4096, alias="LLM_MAX_TOKENS")
    base_url: Optional[str] = Field(default=None, alias="LLM_BASE_URL")

    model_config = SettingsConfigDict(
        env_file=".env.llm",
        extra="ignore"
    )

# 组合配置
class AppConfig(BaseSettings):
    db: DatabaseSettings = DatabaseSettings()
    llm: LLMSettings = LLMSettings()

    model_config = SettingsConfigDict(
        env_nested_delimiter="__"  # 支持 APP__DB__HOST 这样的嵌套环境变量
    )
```

---

## 7. 实战：AI Agent 配置模型

以下是一个完整的 AI Agent 配置管理示例，整合了 Pydantic 的所有核心功能：

```python
from pydantic import BaseModel, Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional, Literal, Dict, Any
from datetime import datetime
import os

# ==================== LLM 模型配置 ====================

class LLMModelConfig(BaseModel):
    """单个 LLM 模型的配置"""
    provider: Literal["openai", "anthropic", "azure", "local"]
    model_name: str
    api_key: Optional[str] = None
    base_url: Optional[str] = None
    temperature: float = Field(default=0.7, ge=0, le=2)
    max_tokens: int = Field(default=4096, gt=0)
    timeout: int = Field(default=60, gt=0)

    @field_validator("model_name")
    @classmethod
    def validate_model_name(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("模型名称不能为空")
        return v.strip()

# ==================== Agent 工具配置 ====================

class ToolConfig(BaseModel):
    """工具配置"""
    name: str
    enabled: bool = True
    config: Dict[str, Any] = {}

class SearchToolConfig(ToolConfig):
    """搜索工具配置"""
    name: str = "web_search"
    search_engine: Literal["google", "bing", "duckduckgo"] = "google"
    api_key: Optional[str] = None
    max_results: int = Field(default=5, ge=1, le=20)

class CodeExecutionConfig(ToolConfig):
    """代码执行工具配置"""
    name: str = "code_execution"
    sandbox_enabled: bool = True
    timeout: int = Field(default=30, ge=1, le=300)
    allowed_packages: List[str] = ["numpy", "pandas", "matplotlib"]

# ==================== Agent 记忆配置 ====================

class MemoryConfig(BaseModel):
    """记忆系统配置"""
    enabled: bool = True
    max_history_messages: int = Field(default=20, ge=1, le=100)
    summary_threshold: int = Field(default=10, ge=1)  # 多少条消息后触发摘要
    storage_backend: Literal["memory", "redis", "postgres"] = "memory"

    # Redis 配置（当使用 redis 后端时）
    redis_url: Optional[str] = None

    @model_validator(mode="after")
    def validate_redis_config(self) -> "MemoryConfig":
        if self.storage_backend == "redis" and not self.redis_url:
            raise ValueError("使用 Redis 后端时必须提供 redis_url")
        return self

# ==================== Agent 主配置 ====================

class AgentConfig(BaseModel):
    """AI Agent 完整配置"""
    # 基本信息
    name: str
    description: str = ""
    version: str = "1.0.0"

    # 系统提示词
    system_prompt: str = "你是一个有用的 AI 助手。"

    # LLM 配置
    primary_model: LLMModelConfig
    fallback_model: Optional[LLMModelConfig] = None

    # 工具和记忆
    tools: List[ToolConfig] = []
    memory: MemoryConfig = Field(default_factory=MemoryConfig)

    # 行为配置
    max_iterations: int = Field(default=10, ge=1, le=50)
    response_timeout: int = Field(default=120, gt=0)
    enable_streaming: bool = True

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        if len(v) < 2:
            raise ValueError("Agent 名称至少需要 2 个字符")
        return v

    @model_validator(mode="after")
    def validate_models(self) -> "AgentConfig":
        """确保主模型和备用模型不冲突"""
        if self.fallback_model:
            if self.fallback_model.provider == self.primary_model.provider \
               and self.fallback_model.model_name == self.primary_model.model_name:
                raise ValueError("备用模型应与主模型不同")
        return self

# ==================== 应用设置 ====================

class AppSettings(BaseSettings):
    """应用全局设置"""
    app_name: str = "AI Agent Platform"
    environment: str = "development"

    # Agent 配置
    agent: AgentConfig

    # API 设置
    api_prefix: str = "/api/v1"
    cors_origins: List[str] = ["http://localhost:3000"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

# ==================== 使用示例 ====================

def create_default_agent_config() -> AgentConfig:
    """创建默认的 Agent 配置"""
    return AgentConfig(
        name="GeneralAssistant",
        description="通用 AI 助手",
        system_prompt="""你是一个专业的 AI 助手，具备以下能力：
1. 回答用户的问题
2. 使用工具获取实时信息
3. 执行代码计算
4. 记住对话上下文""",
        primary_model=LLMModelConfig(
            provider="openai",
            model_name="gpt-4-turbo",
            temperature=0.7,
            max_tokens=4096
        ),
        fallback_model=LLMModelConfig(
            provider="openai",
            model_name="gpt-3.5-turbo",
            temperature=0.7,
            max_tokens=2048
        ),
        tools=[
            SearchToolConfig(
                enabled=True,
                max_results=5
            ),
            CodeExecutionConfig(
                enabled=True,
                sandbox_enabled=True
            )
        ],
        memory=MemoryConfig(
            enabled=True,
            max_history_messages=20,
            summary_threshold=10
        )
    )

# 创建配置实例
default_agent = create_default_agent_config()

# 序列化配置
config_json = default_agent.model_dump_json(indent=2)
print(config_json[:500])

# 从 JSON 恢复配置
restored_config = AgentConfig.model_validate_json(config_json)
print(f"\n恢复的 Agent: {restored_config.name}")
```

---

## 自查清单

- [ ] 我已经能解释“1. 概述”的核心概念。
- [ ] 我已经能把“1. 概述”写成最小可运行示例。
- [ ] 我已经能解释“2. Pydantic 基础”的核心概念。
- [ ] 我已经能把“2. Pydantic 基础”写成最小可运行示例。
- [ ] 我已经能解释“3. 字段配置”的核心概念。
- [ ] 我已经能把“3. 字段配置”写成最小可运行示例。
- [ ] 我已经能解释“4. 序列化”的核心概念。
- [ ] 我已经能把“4. 序列化”写成最小可运行示例。
- [ ] 我已经能解释“5. 嵌套模型”的核心概念。
- [ ] 我已经能把“5. 嵌套模型”写成最小可运行示例。
- [ ] 我已经能解释“6. 配置管理 (pydantic-settings)”的核心概念。
- [ ] 我已经能把“6. 配置管理 (pydantic-settings)”写成最小可运行示例。
- [ ] 我已经能解释“7. 实战：AI Agent 配置模型”的核心概念。
- [ ] 我已经能把“7. 实战：AI Agent 配置模型”写成最小可运行示例。

---

## 本章小结

这一章可以浓缩为以下几件事：

- 1. 概述：这是本章必须掌握的核心能力。
- 2. Pydantic 基础：这是本章必须掌握的核心能力。
- 3. 字段配置：这是本章必须掌握的核心能力。
- 4. 序列化：这是本章必须掌握的核心能力。
- 5. 嵌套模型：这是本章必须掌握的核心能力。
- 6. 配置管理 (pydantic-settings)：这是本章必须掌握的核心能力。
- 7. 实战：AI Agent 配置模型：这是本章必须掌握的核心能力。

---

## 学习明细与练习任务

### 知识点掌握清单

- [ ] 阅读并复现“1. 概述”中的关键代码。
- [ ] 阅读并复现“2. Pydantic 基础”中的关键代码。
- [ ] 阅读并复现“3. 字段配置”中的关键代码。
- [ ] 阅读并复现“4. 序列化”中的关键代码。
- [ ] 阅读并复现“5. 嵌套模型”中的关键代码。
- [ ] 阅读并复现“6. 配置管理 (pydantic-settings)”中的关键代码。
- [ ] 阅读并复现“7. 实战：AI Agent 配置模型”中的关键代码。

### 练习任务（由易到难）

1. 基础练习（15 - 30 分钟）：从本章挑 1 个最基础示例，手敲一遍并改 2 个输入参数观察输出差异。
2. 场景练习（30 - 60 分钟）：把本章至少 2 个知识点拼成一个小脚本，要求包含输入、处理、输出三个步骤。
3. 工程练习（60 - 90 分钟）：按你的工作背景，把本章内容改造成一个更真实的小工具或 Demo。

---

## 常见问题 FAQ

**Q：这一章“Pydantic 数据验证”需要全部背下来吗？**  
A：不需要。先掌握核心概念和最常见写法，剩下的通过练习和查文档逐步补齐。

---

**Q：我是 JS/TS 开发者，最容易踩什么坑？**  
A：最常见的问题是按 JS/TS 的语法和运行时直觉去猜 Python 行为。遇到分歧时，优先回到最小示例验证。

---

**Q：学完这一章后，怎么确认自己真的会了？**  
A：标准不是“看懂了”，而是你能不看答案把本章最关键的例子重新写出来，并解释为什么这么写。

---

> **下一步**：继续学习第 17 天内容，保持按顺序推进，后续章节会默认你已经掌握今天的基础。

---

*文档基于：Phase 3 · 异步与 API*  
*生成日期：2026-04-04*

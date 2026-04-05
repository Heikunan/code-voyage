---
title: 第 30 天 - Docker 与最终项目：部署你的 AI Agent
icon: code
order: 30
---

# 第 30 天 — Docker 与最终项目：部署你的 AI Agent

> **对应原文档**：AI Agent 部署主题为本项目扩展章节，结合 python-100-days 工程化路线与 Docker 实践方向整理
> **预计学习时间**：1 - 2 天
> **本章目标**：掌握 Docker 化部署思路，并把前面内容收束成一个完整 AI Agent 项目
> **前置知识**：前 23 天内容，建议已具备异步、HTTP、数据处理基础
> **已有技能读者建议**：如果你有 JS / TS 基础，建议重点关注 Python 在数据处理、AI SDK、运行时约束和工程组织上的独特做法。

---

## 目录

- [章节概述](#章节概述)
- [本章知识地图](#本章知识地图)
- [已有技能快速对照js-ts-python](#已有技能快速对照js-ts-python)
- [迁移陷阱js-ts-python](#迁移陷阱js-ts-python)
- [1. Docker 基础](#1-docker-基础)
- [2. 编写 Dockerfile](#2-编写-dockerfile)
- [3. Docker Compose](#3-docker-compose)
- [4. 最终项目：智能客服 Agent](#4-最终项目智能客服-agent)
- [5. 部署指南](#5-部署指南)
- [6. 30 天学习总结](#6-30-天学习总结)
- [自查清单](#自查清单)
- [本章小结](#本章小结)
- [学习明细与练习任务](#学习明细与练习任务)
- [常见问题 FAQ](#常见问题-faq)

---

## 章节概述

本章是整条路线的收尾，重点不只是学 Docker 命令，而是把前面的能力打包成一个能运行、能部署、能展示的完整项目。

| 小节 | 内容 | 重要性 |
| --- | --- | --- |
| 1. Docker 基础 | ★★★★☆ |
| 2. 编写 Dockerfile | ★★★★☆ |
| 3. Docker Compose | ★★★★☆ |
| 4. 最终项目：智能客服 Agent | ★★★★☆ |
| 5. 部署指南 | ★★★★☆ |
| 6. 30 天学习总结 | ★★★★☆ |

---

## 本章知识地图

```mermaid
graph TD
    docker["Docker 镜像"] --> compose["Docker Compose"]
    docker --> deploy["部署环境"]
    compose --> services["多服务协作"]
    services --> finalproj["最终项目"]
    deploy --> finalproj
```

---

## 已有技能快速对照（JS/TS -> Python）

本章建议优先建立与当前主题直接相关的迁移直觉，而不是泛泛对比语法差异。

| 你熟悉的 JS/TS 世界 | Python 世界 | 本章需要建立的直觉 |
| --- | --- | --- |
| Dockerizing Node service | Dockerizing Python / Agent service | 两边思路相通，但 Python 还要考虑虚拟环境、依赖体积和模型相关配置 |
| compose multiple services | Docker Compose | Agent 项目常常不是单服务，需要把 API、缓存、数据库一起组织 |
| local demo to deployable app | final project packaging | 重点不是命令本身，而是把整个系统整理成可运行产物 |

---

## 迁移陷阱（JS/TS -> Python）

- **只会运行 Docker 命令，不理解镜像和容器分层**：后续优化体积和部署会很被动。
- **把部署当成最终一步临时处理**：工程化从配置、日志、依赖开始就已经在影响部署。
- **最终项目只求能跑，不考虑可展示性**：最好把 README、启动方式和演示路径一起整理好。

---

## 1. Docker 基础

### 1.1 为什么需要 Docker

Docker 是一个容器化平台，它解决了以下问题：

- **环境一致性**：开发、测试、生产环境一致
- **依赖管理**：所有依赖打包在容器中
- **快速部署**：秒级启动应用
- **资源隔离**：每个应用独立运行
- **可扩展性**：轻松横向扩展

对于 AI Agent 项目，Docker 特别重要：
- Python 依赖复杂（PyTorch、TensorFlow 等）
- 需要 GPU 支持
- 可能涉及多个服务（API、数据库、向量存储）

### 1.2 Docker 核心概念

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker 核心概念                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  镜像 (Image)                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  只读模板，包含应用代码、运行时、库、环境变量          │   │
│  │  类似于"安装包"或"系统镜像"                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│                           ▼                                 │
│  容器 (Container)                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  镜像的运行实例，可启动、停止、删除                    │   │
│  │  类似于"运行的程序"                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Dockerfile                                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  构建镜像的脚本，包含一系列指令                        │   │
│  │  类似于"构建说明书"                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  仓库 (Registry)                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  存储和分发镜像的地方，如 Docker Hub                   │   │
│  │  类似于"应用商店"                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 安装 Docker

```bash
# Windows
# 下载 Docker Desktop: https://www.docker.com/products/docker-desktop

# macOS
# 下载 Docker Desktop: https://www.docker.com/products/docker-desktop

# Linux (Ubuntu)
sudo apt-get update
sudo apt-get install docker.io docker-compose

# 验证安装
docker --version
docker-compose --version

# 测试运行
docker run hello-world
```

---

## 2. 编写 Dockerfile

### 2.1 Dockerfile 基础

```dockerfile
# Dockerfile 基础示例

# 1. 指定基础镜像
FROM python:3.11-slim

# 2. 设置工作目录
WORKDIR /app

# 3. 设置环境变量
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 4. 安装系统依赖
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# 5. 复制依赖文件
COPY requirements.txt .

# 6. 安装 Python 依赖
RUN pip install --no-cache-dir -r requirements.txt

# 7. 复制应用代码
COPY . .

# 8. 暴露端口
EXPOSE 8000

# 9. 启动命令
CMD ["python", "main.py"]
```

### 2.2 AI Agent 项目的 Dockerfile

```dockerfile
# Dockerfile for AI Agent

# 使用 Python 3.11 基础镜像
FROM python:3.11-slim

# 设置标签
LABEL maintainer="your-email@example.com"
LABEL version="1.0"
LABEL description="AI Agent Application"

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# 安装系统依赖
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# 创建非 root 用户
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# 复制依赖文件
COPY requirements.txt .

# 安装 Python 依赖
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# 复制应用代码
COPY --chown=appuser:appgroup . .

# 创建日志和数据目录
RUN mkdir -p /app/logs /app/data /app/vector_db && \
    chown -R appuser:appgroup /app

# 切换到非 root 用户
USER appuser

# 暴露端口
EXPOSE 8000

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# 启动命令
CMD ["python", "src/main.py"]
```

### 2.3 多阶段构建

```dockerfile
# Dockerfile 多阶段构建示例
# 减少最终镜像大小

# ===== 第一阶段：构建阶段 =====
FROM python:3.11-slim as builder

WORKDIR /app

# 安装构建依赖
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# 复制并安装依赖
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# ===== 第二阶段：运行阶段 =====
FROM python:3.11-slim as runtime

WORKDIR /app

# 设置环境变量
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# 从构建阶段复制已安装的包
COPY --from=builder /root/.local /root/.local
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages

# 确保脚本路径在 PATH 中
PATH=/root/.local/bin:$PATH

# 复制应用代码
COPY . .

# 创建非 root 用户
RUN useradd -r -u 1000 appuser && \
    chown -R appuser:appuser /app
USER appuser

# 暴露端口
EXPOSE 8000

# 启动命令
CMD ["python", "src/main.py"]
```

### 2.4 针对 GPU 优化的 Dockerfile

```dockerfile
# Dockerfile for GPU support (NVIDIA)

# 使用 NVIDIA CUDA 基础镜像
FROM nvidia/cuda:12.1.0-cudnn8-runtime-ubuntu22.04

# 设置工作目录
WORKDIR /app

# 安装 Python
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3.11 \
    python3.11-venv \
    python3-pip \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# 设置环境变量
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# 复制并安装依赖
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 8000

# 启动命令
CMD ["python3", "src/main.py"]
```

---

## 3. Docker Compose

### 3.1 Docker Compose 基础

```yaml
# docker-compose.yml

version: '3.8'

services:
  # AI Agent 服务
  agent:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: ai-agent
    ports:
      - "8000:8000"
    environment:
      - DEBUG=false
      - LOG_LEVEL=INFO
      - LLM_API_KEY=${LLM_API_KEY}
      - LLM_MODEL=gpt-3.5-turbo
    volumes:
      - ./logs:/app/logs
      - ./data:/app/data
    depends_on:
      - redis
      - chromadb
    restart: unless-stopped
    networks:
      - agent-network

  # Redis 缓存服务
  redis:
    image: redis:7-alpine
    container_name: agent-redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    restart: unless-stopped
    networks:
      - agent-network

  # ChromaDB 向量数据库
  chromadb:
    image: chromadb/chroma:latest
    container_name: agent-chromadb
    ports:
      - "8001:8000"
    volumes:
      - chroma-data:/chroma/chroma
    restart: unless-stopped
    networks:
      - agent-network

  # Nginx 反向代理
  nginx:
    image: nginx:alpine
    container_name: agent-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - agent
    restart: unless-stopped
    networks:
      - agent-network

volumes:
  redis-data:
  chroma-data:

networks:
  agent-network:
    driver: bridge
```

### 3.2 开发环境配置

```yaml
# docker-compose.dev.yml

version: '3.8'

services:
  agent:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: ai-agent-dev
    ports:
      - "8000:8000"
    environment:
      - DEBUG=true
      - LOG_LEVEL=DEBUG
      - LLM_API_KEY=${LLM_API_KEY}
    volumes:
      # 挂载源代码，实现热重载
      - ./src:/app/src
      - ./logs:/app/logs
      - ./data:/app/data
    # 开发工具
    command: python -m uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
    networks:
      - dev-network

  # PostgreSQL 数据库
  postgres:
    image: postgres:15-alpine
    container_name: agent-postgres
    environment:
      POSTGRES_USER: agent
      POSTGRES_PASSWORD: agent123
      POSTGRES_DB: agent_db
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - dev-network

  # pgAdmin 数据库管理
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: agent-pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    depends_on:
      - postgres
    networks:
      - dev-network

volumes:
  postgres-data:

networks:
  dev-network:
```

### 3.3 生产环境配置

```yaml
# docker-compose.prod.yml

version: '3.8'

services:
  agent:
    build:
      context: .
      dockerfile: Dockerfile.prod
    container_name: ai-agent-prod
    deploy:
      replicas: 3  # 运行 3 个副本
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
    environment:
      - DEBUG=false
      - LOG_LEVEL=WARNING
      - LLM_API_KEY=${LLM_API_KEY}
      - DATABASE_URL=postgresql://agent:agent123@postgres:5432/agent_db
      - REDIS_URL=redis://redis:6379
    volumes:
      - agent-logs:/app/logs
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - prod-network
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # PostgreSQL 主从复制
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: agent
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: agent_db
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./backups:/backups
    networks:
      - prod-network
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U agent"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis 哨兵模式
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data
    networks:
      - prod-network
    restart: always

  # Traefik 反向代理和负载均衡
  traefik:
    image: traefik:v2.10
    container_name: traefik
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - prod-network
    restart: always

volumes:
  agent-logs:
  postgres-data:
  redis-data:

networks:
  prod-network:
    driver: bridge
```

---

## 4. 最终项目：智能客服 Agent

### 4.1 项目结构

```
smart-customer-service/
├── src/
│   ├── __init__.py
│   ├── main.py              # FastAPI 应用入口
│   ├── agent/
│   │   ├── __init__.py
│   │   ├── core.py          # Agent 核心逻辑
│   │   ├── memory.py        # 对话记忆
│   │   └── tools.py         # 工具定义
│   ├── llm/
│   │   ├── __init__.py
│   │   ├── client.py        # LLM 客户端
│   │   └── prompts.py       # 提示词模板
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes.py        # API 路由
│   │   └── schemas.py       # 数据模型
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── logger.py        # 日志配置
│   │   └── config.py        # 配置管理
│   └── knowledge/
│       ├── __init__.py
│       └── base.py          # 知识库管理
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_agent.py
│   └── test_api.py
├── config/
│   ├── default.yaml
│   ├── development.yaml
│   └── production.yaml
├── Dockerfile
├── docker-compose.yml
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── requirements.txt
├── requirements-dev.txt
├── .env.example
├── .gitignore
├── nginx.conf
├── pyproject.toml
└── README.md
```

### 4.2 核心代码实现

```python
# src/main.py

import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from utils.logger import setup_logging
from utils.config import Config
from api.routes import router as api_router
from agent.core import CustomerServiceAgent

# 配置
config = Config.from_env()

# 全局变量
agent: CustomerServiceAgent = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    global agent
    
    # 启动时初始化
    setup_logging(config.log_level, config.log_file)
    logger = logging.getLogger(__name__)
    
    logger.info(f"启动 {config.app_name} v{config.version}")
    
    # 初始化 Agent
    agent = CustomerServiceAgent(
        api_key=config.llm_api_key,
        model=config.llm_model,
        temperature=config.llm_temperature
    )
    
    logger.info("Agent 初始化完成")
    
    yield
    
    # 关闭时清理
    logger.info("应用关闭，清理资源...")
    if agent:
        agent.cleanup()


# 创建 FastAPI 应用
app = FastAPI(
    title=config.app_name,
    version=config.version,
    description="智能客服 AI Agent",
    lifespan=lifespan
)

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(api_router, prefix="/api")


@app.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "healthy", "version": config.version}


@app.get("/")
async def root():
    """根路径"""
    return {
        "name": config.app_name,
        "version": config.version,
        "status": "running"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=config.debug
    )
```

```python
# src/agent/core.py

import logging
from typing import List, Dict, Optional
from datetime import datetime
import hashlib

from llm.client import LLMClient
from agent.memory import ConversationMemory
from agent.tools import ToolRegistry

logger = logging.getLogger(__name__)


class CustomerServiceAgent:
    """
    智能客服 Agent
    
    处理客户咨询，提供智能回答
    """
    
    def __init__(
        self,
        api_key: str,
        model: str = "gpt-3.5-turbo",
        temperature: float = 0.7
    ):
        self.api_key = api_key
        self.model = model
        self.temperature = temperature
        
        # 初始化组件
        self.llm = LLMClient(api_key=api_key, model=model)
        self.memory = ConversationMemory(max_messages=20)
        self.tools = self._init_tools()
        
        # 系统提示
        self.system_prompt = """你是一位专业的客服助手，负责回答客户的问题。

你的职责：
1. 友好、专业地回答客户问题
2. 提供准确的产品和服务信息
3. 处理客户投诉和建议
4. 必要时引导客户联系人工客服

回答风格：
- 礼貌、专业
- 简洁明了
- 富有同理心"""
    
    def _init_tools(self) -> ToolRegistry:
        """初始化工具注册表"""
        registry = ToolRegistry()
        
        # 注册工具
        @registry.tool
        def search_knowledge_base(query: str) -> str:
            """搜索知识库获取产品信息"""
            # 实际实现会查询数据库或向量存储
            return f"搜索结果：{query}"
        
        @registry.tool
        def get_order_status(order_id: str) -> Dict:
            """查询订单状态"""
            return {"order_id": order_id, "status": "processing"}
        
        @registry.tool
        def create_ticket(issue: str, priority: str = "medium") -> Dict:
            """创建工单"""
            ticket_id = hashlib.md5(f"{issue}{datetime.now()}".encode()).hexdigest()[:8]
            return {
                "ticket_id": ticket_id,
                "issue": issue,
                "priority": priority,
                "status": "open"
            }
        
        return registry
    
    async def chat(self, user_id: str, message: str) -> Dict:
        """
        处理用户消息
        
        返回：
            包含回复和元数据的字典
        """
        start_time = datetime.now()
        
        try:
            # 获取对话历史
            history = self.memory.get_history(user_id)
            
            # 构建消息列表
            messages = [
                {"role": "system", "content": self.system_prompt},
                *history,
                {"role": "user", "content": message}
            ]
            
            # 调用 LLM
            response = await self.llm.chat(messages)
            
            # 记录对话
            self.memory.add_message(user_id, "user", message)
            self.memory.add_message(user_id, "assistant", response)
            
            # 计算延迟
            latency = (datetime.now() - start_time).total_seconds() * 1000
            
            logger.info(f"用户 {user_id} 对话完成，延迟：{latency:.2f}ms")
            
            return {
                "success": True,
                "message": response,
                "user_id": user_id,
                "timestamp": datetime.now().isoformat(),
                "latency_ms": latency
            }
        
        except Exception as e:
            logger.error(f"处理消息失败：{e}", exc_info=True)
            return {
                "success": False,
                "error": str(e),
                "message": "抱歉，处理您的请求时出现错误，请稍后重试。"
            }
    
    async def chat_with_tools(self, user_id: str, message: str) -> Dict:
        """
        带工具调用的对话
        """
        # 实现 Function Calling 逻辑
        # 这里简化处理
        return await self.chat(user_id, message)
    
    def get_conversation_history(self, user_id: str) -> List[Dict]:
        """获取对话历史"""
        return self.memory.get_history(user_id)
    
    def clear_history(self, user_id: str):
        """清空对话历史"""
        self.memory.clear(user_id)
    
    def cleanup(self):
        """清理资源"""
        self.memory.save_all()
        logger.info("Agent 资源清理完成")
```

```python
# src/api/routes.py

from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, Field
from typing import Optional, List
import uuid

router = APIRouter()


# 请求/响应模型
class ChatRequest(BaseModel):
    user_id: str = Field(..., description="用户 ID")
    message: str = Field(..., description="用户消息", min_length=1, max_length=2000)
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    success: bool
    message: str
    user_id: str
    timestamp: str
    latency_ms: float
    session_id: Optional[str] = None


class ConversationHistory(BaseModel):
    user_id: str
    messages: List[Dict]
    total_count: int


# API 端点
@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, x_api_key: Optional[str] = Header(None)):
    """
    聊天接口
    
    接收用户消息，返回 AI 回复
    """
    # 验证 API Key（简化处理）
    if not x_api_key:
        raise HTTPException(status_code=401, detail="缺少 API Key")
    
    # 获取全局 agent（在 main.py 中定义）
    from main import agent
    
    if not agent:
        raise HTTPException(status_code=503, detail="服务未就绪")
    
    # 处理消息
    result = await agent.chat(request.user_id, request.message)
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result.get("error", "未知错误"))
    
    return ChatResponse(
        success=True,
        message=result["message"],
        user_id=result["user_id"],
        timestamp=result["timestamp"],
        latency_ms=result["latency_ms"],
        session_id=request.session_id or str(uuid.uuid4())
    )


@router.get("/history/{user_id}", response_model=ConversationHistory)
async def get_history(user_id: str):
    """获取对话历史"""
    from main import agent
    
    if not agent:
        raise HTTPException(status_code=503, detail="服务未就绪")
    
    history = agent.get_conversation_history(user_id)
    
    return ConversationHistory(
        user_id=user_id,
        messages=history,
        total_count=len(history)
    )


@router.delete("/history/{user_id}")
async def clear_history(user_id: str):
    """清空对话历史"""
    from main import agent
    
    if not agent:
        raise HTTPException(status_code=503, detail="服务未就绪")
    
    agent.clear_history(user_id)
    
    return {"success": True, "message": "对话历史已清空"}


@router.get("/health")
async def health():
    """健康检查"""
    return {
        "status": "healthy",
        "service": "smart-customer-service"
    }
```

### 4.3 配置文件

```yaml
# config/default.yaml

app:
  name: "智能客服 Agent"
  version: "1.0.0"
  debug: false

server:
  host: "0.0.0.0"
  port: 8000
  workers: 4

llm:
  provider: "openai"
  model: "gpt-3.5-turbo"
  temperature: 0.7
  max_tokens: 1024
  timeout: 30

memory:
  type: "redis"
  max_messages: 20
  ttl: 3600

logging:
  level: "INFO"
  file: "logs/app.log"
  format: "json"
  max_size: 10485760  # 10MB
  backup_count: 5

knowledge_base:
  type: "chromadb"
  path: "./data/vector_db"
  collection: "customer_service"
```

```yaml
# config/development.yaml

app:
  debug: true

server:
  workers: 1

llm:
  model: "gpt-3.5-turbo"
  temperature: 0.7

logging:
  level: "DEBUG"
  format: "detailed"

memory:
  type: "memory"  # 开发环境使用内存存储
```

```yaml
# config/production.yaml

app:
  debug: false

server:
  workers: 4

llm:
  model: "gpt-4"
  temperature: 0.5
  max_tokens: 2048

logging:
  level: "WARNING"
  format: "json"

memory:
  type: "redis"
  ttl: 7200  # 2 小时
```

### 4.4 依赖文件

```txt
# requirements.txt

# Web 框架
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6

# LLM 相关
openai==1.3.0
langchain==0.0.350
langchain-community==0.0.1

# 向量数据库
chromadb==0.4.18

# 缓存
redis==5.0.1

# 配置
pyyaml==6.0.1
python-dotenv==1.0.0

# 工具
pydantic==2.5.0
httpx==0.25.2
tenacity==8.2.3

# 日志
python-json-logger==2.0.7

# 监控
prometheus-client==0.19.0
```

```txt
# requirements-dev.txt

-r requirements.txt

# 测试
pytest==7.4.3
pytest-asyncio==0.21.1
pytest-cov==4.1.0
httpx==0.25.2

# 代码质量
black==23.11.0
flake8==6.1.0
mypy==1.7.1
isort==5.12.0

# 开发工具
ipython==8.18.1
watchfiles==0.21.0
```

### 4.5 Nginx 配置

```nginx
# nginx.conf

worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    keepalive_timeout 65;

    # 上游服务器
    upstream agent_backend {
        server agent:8000;
        keepalive 32;
    }

    # HTTP 服务器
    server {
        listen 80;
        server_name localhost;

        # 重定向到 HTTPS
        return 301 https://$server_name$request_uri;
    }

    # HTTPS 服务器
    server {
        listen 443 ssl http2;
        server_name localhost;

        ssl_certificate /etc/nginx/ssl/server.crt;
        ssl_certificate_key /etc/nginx/ssl/server.key;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # API 代理
        location /api/ {
            proxy_pass http://agent_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # 超时设置
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # 健康检查
        location /health {
            proxy_pass http://agent_backend/health;
            access_log off;
        }

        # 静态文件
        location /static/ {
            alias /app/static/;
            expires 30d;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

---

## 5. 部署指南

### 5.1 本地开发

```bash
# 1. 克隆项目
git clone <repository-url>
cd smart-customer-service

# 2. 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 3. 安装依赖
pip install -r requirements-dev.txt

# 4. 复制环境变量
cp .env.example .env
# 编辑 .env 文件，填入 API Key

# 5. 启动开发服务
docker-compose -f docker-compose.dev.yml up

# 或者不使用 Docker
python src/main.py
```

### 5.2 生产部署

```bash
# 1. 构建镜像
docker-compose -f docker-compose.prod.yml build

# 2. 启动服务
docker-compose -f docker-compose.prod.yml up -d

# 3. 查看日志
docker-compose -f docker-compose.prod.yml logs -f agent

# 4. 健康检查
curl http://localhost/health

# 5. 停止服务
docker-compose -f docker-compose.prod.yml down
```

### 5.3 监控和日志

```bash
# 查看容器状态
docker-compose ps

# 查看资源使用
docker stats

# 查看日志
docker-compose logs -f

# 进入容器
docker-compose exec agent bash

# 备份数据
docker-compose exec postgres pg_dump -U agent agent_db > backup.sql
```

---

## 6. 30 天学习总结

恭喜你完成了 AI Agent Python 学习路线！你已经掌握了：

**Phase 1-3 基础**：Python 语法、OOP、异步编程、API 开发
**Phase 4 数据处理**：Pandas、可视化、办公自动化
**Phase 5 Agent 核心**：LLM API、提示词工程、函数调用、向量数据库、LangChain
**Phase 6 工程化**：测试、日志、配置、Docker 部署

继续实践，构建你自己的 AI Agent 应用！

## 自查清单

- [ ] 我已经能解释“1. Docker 基础”的核心概念。
- [ ] 我已经能把“1. Docker 基础”写成最小可运行示例。
- [ ] 我已经能解释“2. 编写 Dockerfile”的核心概念。
- [ ] 我已经能把“2. 编写 Dockerfile”写成最小可运行示例。
- [ ] 我已经能解释“3. Docker Compose”的核心概念。
- [ ] 我已经能把“3. Docker Compose”写成最小可运行示例。
- [ ] 我已经能解释“4. 最终项目：智能客服 Agent”的核心概念。
- [ ] 我已经能把“4. 最终项目：智能客服 Agent”写成最小可运行示例。
- [ ] 我已经能解释“5. 部署指南”的核心概念。
- [ ] 我已经能把“5. 部署指南”写成最小可运行示例。
- [ ] 我已经能解释“6. 30 天学习总结”的核心概念。
- [ ] 我已经能把“6. 30 天学习总结”写成最小可运行示例。

---

## 本章小结

这一章可以浓缩为以下几件事：

- 1. Docker 基础：这是本章必须掌握的核心能力。
- 2. 编写 Dockerfile：这是本章必须掌握的核心能力。
- 3. Docker Compose：这是本章必须掌握的核心能力。
- 4. 最终项目：智能客服 Agent：这是本章必须掌握的核心能力。
- 5. 部署指南：这是本章必须掌握的核心能力。
- 6. 30 天学习总结：这是本章必须掌握的核心能力。

---

## 学习明细与练习任务

### 知识点掌握清单

- [ ] 阅读并复现“1. Docker 基础”中的关键代码。
- [ ] 阅读并复现“2. 编写 Dockerfile”中的关键代码。
- [ ] 阅读并复现“3. Docker Compose”中的关键代码。
- [ ] 阅读并复现“4. 最终项目：智能客服 Agent”中的关键代码。
- [ ] 阅读并复现“5. 部署指南”中的关键代码。
- [ ] 阅读并复现“6. 30 天学习总结”中的关键代码。

### 练习任务（由易到难）

1. 基础练习（15 - 30 分钟）：为现有 Python 项目写一个最小可运行的 Dockerfile。
2. 场景练习（30 - 60 分钟）：用 Docker Compose 把应用和一个依赖服务一起跑起来。
3. 工程练习（60 - 90 分钟）：整理一个可展示的最终项目，包含镜像构建、启动命令和演示说明。

---

## 常见问题 FAQ

**Q：这一章“Docker 与最终项目：部署你的 AI Agent”需要全部背下来吗？**  
A：不需要。先掌握核心概念和最常见写法，剩下的通过练习和查文档逐步补齐。

---

**Q：我是 JS/TS 开发者，最容易踩什么坑？**  
A：最常见的问题是按 JS/TS 的语法和运行时直觉去猜 Python 行为。遇到分歧时，优先回到最小示例验证。

---

**Q：学完这一章后，怎么确认自己真的会了？**  
A：标准不是“看懂了”，而是你能不看答案把本章最关键的例子重新写出来，并解释为什么这么写。

---

> **下一步**：回到阶段首页，补完练习并把示例整理成自己的 Python / Agent 工具箱。

---

*文档基于：Phase 6 · 工程化与部署*  
*生成日期：2026-04-04*

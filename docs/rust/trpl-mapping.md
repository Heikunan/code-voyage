# TRPL（Rust 1.90 / 2024 Edition）对照表（本仓库教程版）

本文件用于对照《The Rust Programming Language》（TRPL）与本仓库 `rustlearn/rust/` 下的教程文件，确保：

- **章节主线不偏离 TRPL**
- 能明确看到"本教程新增/改写"的部分（更适合 JS/TS 开发者）

## Chapter → 文件映射

| TRPL Chapter | TRPL 标题（英文） | 本仓库教程文件 | 本仓库主小节（与 TRPL 主线对齐） |
|---|---|---|---|
| 1 | Getting Started | `ch01-getting-started.md` | 1.1 / 1.2 / 1.3 |
| 2 | Programming a Guessing Game | `ch02-guessing-game.md` | （项目章，按代码块/知识点拆解） |
| 3 | Common Programming Concepts | `ch03-common-concepts.md` | 3.1 / 3.2 / 3.3 / 3.4 / 3.5 |
| 4 | Understanding Ownership | `ch04-ownership.md` | 4.1 / 4.2 / 4.3 |
| 5 | Using Structs to Structure Related Data | `ch05-structs.md` | 5.1 / 5.2 / 5.3 |
| 6 | Enums and Pattern Matching | `ch06-enums.md` | 6.1 / 6.2 / 6.3 |
| 7 | Managing Growing Projects with Packages, Crates, and Modules | `ch07-packages-crates-modules.md` | 7.1 / 7.2 / 7.3 / 7.4 / 7.5 |
| 8 | Common Collections | `ch08-collections.md` | 8.1 / 8.2 / 8.3 |
| 9 | Error Handling | `ch09-error-handling.md` | 9.1 / 9.2 / 9.3 |
| 10 | Generic Types, Traits, and Lifetimes | `ch10-generics-traits-lifetimes.md` | 10.1 / 10.2 / 10.3 |
| 11 | Writing Automated Tests | `ch11-testing.md` | 11.1 / 11.2 / 11.3 |
| 12 | An I/O Project: Building a Command Line Program | `ch12-io-project.md` | 12.1 / 12.2 / 12.3 / 12.4 / 12.5 / 12.6 |
| 13 | Functional Language Features: Iterators and Closures | `ch13-iterators-closures.md` | 13.1 / 13.2 / 13.3 / 13.4 |
| 14 | More About Cargo and Crates.io | `ch14-cargo-crates-io.md` | 14.1 / 14.2 / 14.3 / 14.4 / 14.5 |
| 15 | Smart Pointers | `ch15-smart-pointers.md` | 15.1 / 15.2 / 15.3 / 15.4 / 15.5 / 15.6 |
| 16 | Fearless Concurrency | `ch16-concurrency.md` | 16.1 / 16.2 / 16.3 / 16.4 |
| 17 | Async and Await | `ch17-async-await.md` | 17.1 / 17.2 / 17.3 / 17.4 / 17.5 |
| 18 | Object-Oriented Programming Features | `ch18-oop.md` | 18.1 / 18.2 / 18.3 / 18.4 |
| 19 | Patterns and Matching | `ch19-patterns.md` | 19.1 / 19.2 / 19.3 |
| 20 | Advanced Features | `ch20-advanced-features.md` | 20.1 / 20.2 / 20.3 / 20.4 / 20.5 |
| 21 | Final Project: Building a Multithreaded Web Server | `ch21-web-server.md` | 21.1 / 21.2 / 21.3 |

## 与 TRPL 的主要差异（用于改写时的"边界"）

- **保持不变（必须对齐）**
  - 每章的核心概念与主小节顺序（表格中的 "主小节"）
  - TRPL 的示例项目：第 2 章 guessing game、第 12 章 minigrep、第 21 章 web server
- **本仓库允许新增（但不应喧宾夺主）**
  - 面向 **JavaScript/TypeScript** 的心智模型映射与"迁移陷阱"
  - "决策树/速查表/FAQ/练习任务"类内容（应以侧栏/拓展/任务形式呈现）
  - 工程化补充（Windows 命令、工具链、Cargo 镜像等），但需与 TRPL 主线区隔

## 统一模板结构（2026-02-20 重构后）

全部 21 个章节文件已按照 `LEARNING-TEMPLATE.md` 统一重构，每章包含以下标准模块：

| 模块 | 优先级 | 说明 |
|------|--------|------|
| **元数据头** | 必选 | 对应原文档、预计时间、目标、前置知识、已有技能读者建议 |
| **章节概述** | 必选 | 小节/内容/重要性 表格 |
| **本章知识地图** | 必选 | Mermaid 有向图展示小节间依赖关系 |
| **已有技能快速对照（JS/TS → Rust）** | 推荐 | 面向 JS/TS 开发者的概念映射表 |
| **迁移陷阱（JS → Rust）** | 推荐 | 3-5 个常见错误，带正确/错误代码对照 |
| **小节内容** | 必选 | 概念讲解 → Mermaid 可视化 → 代码示例 → 反面示例 |
| **常见编译错误速查** | 推荐 | 错误码 + 原因 + 修复方法 |
| **概念关系总览** | 推荐 | Mermaid 图汇总本章概念 + 跨章引用 |
| **实操练习** | 必选 | VS Code + rust-analyzer 手把手操作步骤 |
| **本章小结** | 必选 | 要点回顾 + 个人理解 |
| **学习明细与练习任务** | 必选 | 知识点清单 + 分级练习（必做/推荐/选做）+ 时间参考 |
| **常见问题 FAQ** | 必选 | 5-8 个典型疑问 |

### 与旧版的命名变更对照

| 旧命名（重构前） | 新命名（重构后） |
|---|---|
| `JS/TS 快速对照` | `已有技能快速对照（JS/TS → Rust）` |
| `总结` / `本章核心心智模型` / `个人总结` | `本章小结` |
| `学习检查清单` / `自查清单` / `学习明细` | `学习明细与练习任务` |
| `常见问题（FAQ）` / `FAQ` | `常见问题 FAQ` |
| （无） | `本章知识地图`（新增） |
| （无） | `概念关系总览`（新增） |
| （无） | `实操练习`（新增） |
| （无） | `反面示例`（新增，含编译器报错） |

## 非 TRPL 扩展小节

以下内容属于本仓库新增，不在 TRPL 原文中：

- 全部章节的"已有技能快速对照"和"迁移陷阱"（面向 JS/TS 开发者）
- 全部章节的"本章知识地图"和"概念关系总览"（Mermaid 可视化）
- 全部章节的"实操练习"和"反面示例"
- 全部章节的"学习明细与练习任务"（分级练习）
- `ch15-smart-pointers.md` 中 `15.5+`（扩展小节）
- `ch18-oop.md` 中 `18.5`（扩展小节）

## 2024 Edition (Rust 1.90) 更新核对

目前教程内容已基于最新版 PDF（涵盖 Rust 2024 Edition 相关特性）进行对齐。重点特性映射如下：
- **Let-else 语句 (`let ... else`)**：体现在 `ch06-enums.md`（6.3 节）和 `ch19-patterns.md`（Patterns and Matching）
- **其他相关调整**：保持与最新 TRPL 原文目录结构的同步，后续增补将继续在此记录

---

*最后更新：2026-02-20*
*基于：The Rust Programming Language（Rust 1.90.0 / 2024 Edition）*

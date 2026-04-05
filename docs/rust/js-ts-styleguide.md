# Rust 学习教程（面向 JavaScript / TypeScript 开发者）写作规范

本文件定义 `doc/rust/` 全书统一口径：**术语翻译、JS/TS 类比方式、每章结构模板与练习设计原则**。目标是让 JS/TS 开发者在不偏离 TRPL 主线的前提下，更快建立正确心智模型。

> 适用对象：熟悉 JavaScript/TypeScript（Node/Web）并希望系统学习 Rust（Rust 1.90 / 2024 Edition）。

---

## 1）全局心智模型（必须统一）

### 1.1 编译期 vs 运行期（最重要的差异）

- **JS/TS**：很多“正确性”靠运行时（异常、单测、类型擦除后的运行结果）。  
- **Rust**：把大量错误前移到编译期（所有权/借用、类型、并发安全），运行时更轻（无 GC）。

写作原则：

- 读者看到编译错误时，要明确告诉他：**这是 Rust 在替你做“上线前的强制 code review”**。  
- 每章至少提供 1–2 个“故意写错 → 看懂报错 → 修复”的例子。

### 1.2 可变性默认关闭

- **JS**：变量可变很常见；`const` 只限制重新赋值，不限制对象内部可变。  
- **Rust**：`let` 默认不可变；可变必须显式 `mut`；并且可变性会影响借用规则。

### 1.3 Null/Undefined 不存在，Option/Result 取代

- **JS**：`null/undefined` 与 `throw` 是常见控制流。  
- **Rust**：用 ``Option<T>`` 表达“可能不存在”，用 ``Result<T, E>`` 表达“可能失败”。  
- 写作中要反复强调：**错误/缺失是值，不是异常**，并给出“何时用 Option vs Result”的决策点。

### 1.4 async/await 语法相似，但内核不同

- **JS Promise**：多数情况下创建即执行（eager），事件循环是语言/运行时内置。  
- **Rust Future**：默认惰性（lazy），**运行时可插拔**（tokio/async-std 等），`.await` 是后缀。  
- 写作中必须避免让 JS 读者误以为 Rust async = Node 事件循环。

---

## 2）术语映射（全书统一用法）

> 表内“推荐译法/说法”是全书唯一口径；如需补充别称，用“又称/也叫”一次即可，后续不反复更换术语。

| Rust 术语 | 推荐译法/说法 | JS/TS 类比（仅作直觉） | 备注（避免误导） |
|---|---|---|---|
| ownership | 所有权 | “谁负责释放内存”的责任归属 | 不是权限系统；是资源生命周期规则 |
| move | 移动（所有权转移） | 类似“变量失效/不可再用” | JS 没有对应语义；不要类比成浅拷贝 |
| borrow / reference | 借用 / 引用（`&T`） | 传对象引用（by reference）的感觉 | 关键差异：Rust 有借用规则与生命周期 |
| mutable borrow | 可变借用（`&mut T`） | 独占写锁的直觉 | 同一作用域只能有一个活跃可变借用 |
| lifetime | 生命周期（描述引用关系） | TS 类型约束“谁依赖谁”的感觉 | 不是运行时对象寿命；是编译期关系描述 |
| `Option<T>` | 可选值 | `T | undefined` | Rust 强制处理；不能“忘记判空” |
| `Result<T, E>` | 结果/错误 | `try/catch` / `Promise` reject | Rust 用类型表达失败，不靠抛异常 |
| panic! | 崩溃（不可恢复） | `throw` 导致进程退出/未捕获异常 | 不等价；Rust 生态更偏向 Result |
| trait | Trait（行为契约） | TS `interface`（部分相似） | Trait 还参与静态分发/约束与实现规则 |
| generic | 泛型 | TS 泛型 | Rust 单态化（零成本抽象）是关键差异 |
| crate | crate（包单元） | npm package（直觉） | crate 是编译单元；有 binary/lib 之分 |
| package | package（Cargo 包） | npm package + workspace 配置 | 一个 package 可含多个 crate |
| module | 模块（命名空间+可见性边界） | ESM 模块/文件组织 | Rust 的 `pub`/隐私规则更严格 |
| workspace | 工作空间 | monorepo（pnpm/yarn workspaces） | 共享依赖解析与 target 输出 |
| macro | 宏 | Babel/TS 编译期变换（直觉） | Rust 宏是语言级元编程，分 declarative/procedural |
| enum | 枚举（可携带数据） | TS union（更像） | 不要类比成“只有数字枚举” |
| match | 模式匹配 | `switch` + 解构 + 类型收窄（直觉） | Rust `match` 必须穷尽（exhaustive） |

---

## 3）每章统一结构模板（改写时必须出现）

> 允许章节因 TRPL 原本结构不同而微调，但以下模块在每章都应能找到（标题可略微变化）。

1. **本章目标（面向 JS/TS）**：用 3–5 条 bullet 写清“学完能做什么”。  
2. **TRPL 对照**：Chapter + 关键小节（保持 TRPL 主线）。  
3. **JS/TS 快速对照**：一张表或 5–8 行要点，建立直觉。  
4. **迁移陷阱（JS → Rust）**：至少 3 个“最容易写错”的坑，每个给出修复路径。  
5. **动手练习**：  
   - Rust 练习（必做）  
   - 可选：给出一个“JS/TS 版本的同题”或“Node 场景变体”，帮助迁移心智。  
6. **自查清单**：读者能逐项勾选。  
7. **FAQ（只留高频）**：避免过长。

---

## 4）练习设计原则（更适合 JS/TS）

- **尽量贴近 Node/Web 真实任务**：CLI 参数、stdin/stdout、文件读写、JSON、HTTP、日志。  
- **每章至少 1 个“错误处理练习”**：逼迫读者使用 `Option/Result/?`，不要用 `unwrap()` 一路糊过去。  
- **每章至少 1 个“编译器报错阅读练习”**：让读者习惯 Rust 的诊断信息。  
- **依赖克制**：除 TRPL 必须依赖（如 `rand`）外，新增依赖只在“拓展/选做”出现，并写清替代方案。

---

## 5）统一的“决策树/口头禅”

写作中可反复复用这些统一表述（减少每章风格漂移）：

- **“默认不可变；需要可变就显式 `mut`。”**  
- **“能用借用就借用；需要跨线程/跨任务共享再考虑 `Arc/Mutex`。”**  
- **“库代码返回 `Result`，应用入口决定怎么打印/退出。”**  
- **“遇到编译错误，先读错误信息里的 `help:` 与 `note:`，Rust 很少‘只告诉你错了不告诉你怎么改’。”**  
- **“Rust async 不是 Node 事件循环；Future 默认惰性，需要运行时驱动。”**  

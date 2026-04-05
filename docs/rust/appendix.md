# Rust 附录：快速参考手册

> 个人学习笔记 — 整理自 The Rust Programming Language
> 本文档用作日常开发中的速查表，涵盖关键字、运算符、可派生 trait、开发工具、版本差异和发布流程。

---

## 附录 A：关键字（Keywords）

关键字是 Rust 语言保留的标识符，不能用作变量名、函数名等（除非使用原始标识符 `r#`）。

### 当前正在使用的关键字

| 关键字 | 说明 |
|--------|------|
| `as` | 类型转换；在 `use` 语句中重命名导入项 |
| `async` | 返回 `Future` 而非阻塞当前线程 |
| `await` | 挂起执行，等待 `Future` 就绪 |
| `break` | 立即退出循环 |
| `const` | 定义常量或常量裸指针 |
| `continue` | 跳到下一次循环迭代 |
| `crate` | 模块路径中指向 crate 根 |
| `dyn` | 动态分发到 trait 对象 |
| `else` | `if` / `if let` 的备选分支 |
| `enum` | 定义枚举类型 |
| `extern` | 链接外部函数或变量 |
| `false` | 布尔字面量 false |
| `fn` | 定义函数或函数指针类型 |
| `for` | 迭代循环；实现 trait；声明高阶生命周期 |
| `if` | 条件分支 |
| `impl` | 实现固有方法或 trait |
| `in` | `for` 循环的一部分 |
| `let` | 绑定变量 |
| `loop` | 无条件循环 |
| `match` | 模式匹配 |
| `mod` | 定义模块 |
| `move` | 让闭包获取捕获变量的所有权 |
| `mut` | 表示引用、裸指针或模式绑定的可变性 |
| `pub` | 表示公开可见性 |
| `ref` | 按引用绑定 |
| `return` | 从函数返回 |
| `Self` | 当前正在定义/实现的类型的别名 |
| `self` | 方法接收者或当前模块 |
| `static` | 全局变量或贯穿整个程序的生命周期 |
| `struct` | 定义结构体 |
| `super` | 当前模块的父模块 |
| `trait` | 定义 trait |
| `true` | 布尔字面量 true |
| `type` | 定义类型别名或关联类型 |
| `union` | 定义联合体（仅在联合体声明时为关键字） |
| `unsafe` | 标记不安全代码、函数、trait 或实现 |
| `use` | 将符号引入作用域 |
| `where` | 类型约束子句 |
| `while` | 条件循环 |

### 保留供将来使用的关键字

| 关键字 | 关键字 | 关键字 | 关键字 |
|--------|--------|--------|--------|
| `abstract` | `become` | `box` | `do` |
| `final` | `gen` | `macro` | `override` |
| `priv` | `try` | `typeof` | `unsized` |
| `virtual` | `yield` | | |

### 原始标识符

用 `r#` 前缀可以把关键字当作标识符使用：

```rust
fn r#match(needle: &str, haystack: &str) -> bool {
    haystack.contains(needle)
}
```

典型场景：调用旧版 edition 编写的库中以新版关键字命名的函数（如 2015 edition 的 `try` 函数）。

---

## 附录 B：运算符与符号

### B-1 运算符

| 运算符 | 示例 | 说明 | 可重载 trait |
|--------|------|------|-------------|
| `!` | `ident!(...)` | 宏调用 | — |
| `!` | `!expr` | 按位/逻辑取反 | `Not` |
| `!=` | `expr != expr` | 不等比较 | `PartialEq` |
| `%` | `expr % expr` | 取余 | `Rem` |
| `%=` | `var %= expr` | 取余并赋值 | `RemAssign` |
| `&` | `&expr`, `&mut expr` | 借用 | — |
| `&` | `&type`, `&mut type` | 借用指针类型 | — |
| `&` | `expr & expr` | 按位与 | `BitAnd` |
| `&=` | `var &= expr` | 按位与并赋值 | `BitAndAssign` |
| `&&` | `expr && expr` | 短路逻辑与 | — |
| `*` | `expr * expr` | 乘法 | `Mul` |
| `*=` | `var *= expr` | 乘法并赋值 | `MulAssign` |
| `*` | `*expr` | 解引用 | `Deref` |
| `*` | `*const type`, `*mut type` | 裸指针 | — |
| `+` | `trait + trait` | 复合类型约束 | — |
| `+` | `expr + expr` | 加法 | `Add` |
| `+=` | `var += expr` | 加法并赋值 | `AddAssign` |
| `,` | `expr, expr` | 参数/元素分隔符 | — |
| `-` | `-expr` | 取负 | `Neg` |
| `-` | `expr - expr` | 减法 | `Sub` |
| `-=` | `var -= expr` | 减法并赋值 | `SubAssign` |
| `->` | `fn(...) -> type` | 函数/闭包返回类型 | — |
| `.` | `expr.ident` | 字段访问 | — |
| `.` | `expr.ident(...)` | 方法调用 | — |
| `.` | `expr.0` | 元组索引 | — |
| `..` | `expr..expr` | 右排他范围 | `PartialOrd` |
| `..=` | `expr..=expr` | 右包含范围 | `PartialOrd` |
| `..` | `..expr` | 结构体更新语法 | — |
| `..` | `variant(x, ..)` | "其余部分" 模式绑定 | — |
| `/` | `expr / expr` | 除法 | `Div` |
| `/=` | `var /= expr` | 除法并赋值 | `DivAssign` |
| `:` | `pat: type` | 类型约束 | — |
| `:` | `ident: expr` | 结构体字段初始化 | — |
| `:` | `'a: loop {}` | 循环标签 | — |
| `;` | `expr;` | 语句终止符 | — |
| `;` | `[...; len]` | 固定大小数组语法 | — |
| `<<` | `expr << expr` | 左移 | `Shl` |
| `<<=` | `var <<= expr` | 左移并赋值 | `ShlAssign` |
| `<` | `expr < expr` | 小于 | `PartialOrd` |
| `<=` | `expr <= expr` | 小于等于 | `PartialOrd` |
| `=` | `var = expr` | 赋值 | — |
| `==` | `expr == expr` | 相等比较 | `PartialEq` |
| `=>` | `pat => expr` | match 分支语法 | — |
| `>` | `expr > expr` | 大于 | `PartialOrd` |
| `>=` | `expr >= expr` | 大于等于 | `PartialOrd` |
| `>>` | `expr >> expr` | 右移 | `Shr` |
| `>>=` | `var >>= expr` | 右移并赋值 | `ShrAssign` |
| `@` | `ident @ pat` | 模式绑定 | — |
| `^` | `expr ^ expr` | 按位异或 | `BitXor` |
| `^=` | `var ^= expr` | 按位异或并赋值 | `BitXorAssign` |
| `\|` | `pat \| pat` | 模式选择 | — |
| `\|` | `expr \| expr` | 按位或 | `BitOr` |
| `\|=` | `var \|= expr` | 按位或并赋值 | `BitOrAssign` |
| `\|\|` | `expr \|\| expr` | 短路逻辑或 | — |
| `?` | `expr?` | 错误传播 | — |

### B-2 独立语法符号

| 符号 | 说明 |
|------|------|
| `'ident` | 命名生命周期或循环标签 |
| `数字u8`, `数字i32`, `数字f64` 等 | 指定类型的数字字面量 |
| `"..."` | 字符串字面量 |
| `r"..."`, `r#"..."#` | 原始字符串字面量（不处理转义） |
| `b"..."` | 字节串字面量 |
| `br"..."`, `br#"..."#` | 原始字节串字面量 |
| `'...'` | 字符字面量 |
| `b'...'` | ASCII 字节字面量 |
| `\|…\| expr` | 闭包 |
| `!` | never 类型（发散函数的底类型） |
| `_` | 忽略绑定的模式；也用于增强整数可读性 |

### B-3 路径相关语法

| 符号 | 说明 |
|------|------|
| `ident::ident` | 命名空间路径 |
| `::path` | 从 crate 根开始的绝对路径 |
| `self::path` | 相对于当前模块的路径 |
| `super::path` | 相对于父模块的路径 |
| `type::ident` | 关联常量、函数、类型 |
| `<type as trait>::ident` | 完全限定语法 |
| `trait::method(...)` | 通过 trait 名消歧方法调用 |
| `type::method(...)` | 通过类型名消歧方法调用 |

### B-4 泛型语法

| 符号 | 说明 |
|------|------|
| `path<...>` | 为泛型类型指定参数（如 `Vec<u8>`） |
| `path::<...>` | turbofish 语法（如 `"42".parse::<i32>()`） |
| `fn ident<...>` | 定义泛型函数 |
| `struct ident<...>` | 定义泛型结构体 |
| `enum ident<...>` | 定义泛型枚举 |
| `impl<...>` | 定义泛型实现 |
| `for<...> type` | 高阶生命周期约束 |
| `type<ident=type>` | 带关联类型赋值的泛型（如 `Iterator<Item=T>`） |

### B-5 Trait 约束语法

| 符号 | 说明 |
|------|------|
| `T: U` | 泛型 `T` 须实现 `U` |
| `T: 'a` | `T` 的生命周期须长于 `'a` |
| `T: 'static` | `T` 不含除 `'static` 外的借用引用 |
| `'b: 'a` | 生命周期 `'b` 须长于 `'a` |
| `T: ?Sized` | 允许 `T` 为动态大小类型 |
| `'a + trait`, `trait + trait` | 复合约束 |

### B-6 宏与属性

| 符号 | 说明 |
|------|------|
| `#[meta]` | 外部属性 |
| `#![meta]` | 内部属性 |
| `$ident` | 宏替换变量 |
| `$ident:kind` | 宏元变量 |
| `$(...)...` | 宏重复 |
| `ident!(...)`, `ident!{...}`, `ident![...]` | 宏调用 |

### B-7 注释

| 符号 | 说明 |
|------|------|
| `//` | 行注释 |
| `//!` | 内部行文档注释 |
| `///` | 外部行文档注释 |
| `/*...*/` | 块注释 |
| `/*!...*/` | 内部块文档注释 |
| `/**...*/` | 外部块文档注释 |

### B-8 括号用法

| 符号 | 说明 |
|------|------|
| `()` | 空元组（unit），既是字面量也是类型 |
| `(expr)` | 括号表达式 |
| `(expr,)` | 单元素元组表达式 |
| `(expr, ...)` | 元组表达式 |
| `expr(expr, ...)` | 函数调用；也用于初始化元组结构体 |
| `{...}` | 块表达式 |
| `Type {...}` | 结构体字面量 |
| `[...]` | 数组字面量 |
| `[expr; len]` | 包含 `len` 个 `expr` 副本的数组 |
| `[type; len]` | 包含 `len` 个 `type` 实例的数组类型 |
| `expr[expr]` | 集合索引（可重载 `Index`/`IndexMut`） |
| `expr[a..b]` | 集合切片 |

---

## 附录 C：可派生的 Trait（Derivable Traits）

使用 `#[derive(...)]` 属性可以自动为结构体或枚举生成 trait 实现。

| Trait | 启用的能力 | 派生行为 | 典型使用场景 |
|-------|-----------|---------|-------------|
| **`Debug`** | `{:?}` 格式化输出 | 递归打印所有字段 | 调试打印；`assert_eq!` 要求 |
| **`PartialEq`** | `==` 和 `!=` 运算符 | 所有字段逐一比较 | 相等性判断；`assert_eq!` 要求 |
| **`Eq`** | 标记完全等价关系 | 无额外方法（标记 trait） | `HashMap` 的键要求；前提：已实现 `PartialEq` |
| **`PartialOrd`** | `<`, `>`, `<=`, `>=` 运算符 | 按字段声明顺序比较，返回 `Option<Ordering>` | 排序比较；范围表达式；前提：已实现 `PartialEq` |
| **`Ord`** | 完全排序 | 返回 `Ordering`（始终有效） | `BTreeSet`/`BTreeMap` 要求；前提：已实现 `PartialOrd` + `Eq` |
| **`Clone`** | `.clone()` 深拷贝 | 递归调用各字段的 `clone()` | 需要显式复制值时（如 `to_vec()`） |
| **`Copy`** | 赋值时自动按位复制（栈上） | 无方法（标记 trait） | 轻量值类型优化；前提：已实现 `Clone`，且所有字段均为 `Copy` |
| **`Hash`** | `.hash()` 哈希映射 | 组合各字段的哈希值 | `HashMap`/`HashSet` 的键要求 |
| **`Default`** | `Default::default()` 默认值 | 递归调用各字段的 `default()` | 结构体更新语法 `..Default::default()`；`unwrap_or_default()` |

**注意**：`Display` trait 不可派生——需要你手动实现，因为面向用户的输出格式需要你自己决定。

### 记忆口诀

- 要打印 → `Debug`
- 要比较 → `PartialEq`（+ `Eq` 如果不含 `NaN` 类值）
- 要排序 → `PartialOrd`（+ `Ord` 如果任意两值都可比）
- 要复制 → `Clone`（+ `Copy` 如果是纯栈数据）
- 要哈希 → `Hash`
- 要默认值 → `Default`

---

## 附录 D：开发工具速查

### rustfmt — 自动格式化

| 操作 | 命令 |
|------|------|
| 格式化整个 Cargo 项目 | `cargo fmt` |
| 仅检查格式（不修改） | `cargo fmt -- --check` |
| 格式化单个文件 | `rustfmt src/main.rs` |

按社区统一风格格式化代码，只改样式不改语义。可通过 `rustfmt.toml` 配置。

### rustfix — 自动修复编译警告

| 操作 | 命令 |
|------|------|
| 自动修复警告 | `cargo fix` |
| 迁移到新 edition | `cargo fix --edition` |
| 允许修改已暂存文件 | `cargo fix --allow-staged` |

自动应用编译器建议的修复。例如移除多余的 `mut`。

### Clippy — 静态分析 / Lint

| 操作 | 命令 |
|------|------|
| 运行所有 lint | `cargo clippy` |
| 将警告视为错误 | `cargo clippy -- -D warnings` |
| 自动修复 Clippy 建议 | `cargo clippy --fix` |

能捕获常见错误和非惯用写法，比如用近似值代替 `std::f64::consts::PI`。

### rust-analyzer — IDE 集成

| 功能 | 说明 |
|------|------|
| 自动补全 | 输入时实时建议 |
| 跳转到定义 | 快速导航到符号定义处 |
| 内联错误提示 | 编辑器内实时显示编译错误 |
| 类型推断提示 | 显示变量的推断类型 |

基于 Language Server Protocol，支持 VS Code、Neovim 等主流编辑器。

---

## 附录 E：Rust 版次（Editions）

Rust 每隔约三年发布一个新版次，将零散改进整合为一个清晰的里程碑。

| 版次 | 发布年份 | 主要变化 |
|------|---------|---------|
| **2015** | 2015 | 初始版本；Rust 1.0 的基准 |
| **2018** | 2018 | `async`/`await`；模块系统改进；`dyn` trait 语法；`try` 成为保留字 |
| **2021** | 2021 | 闭包捕获优化（disjoint capture）；`IntoIterator` for arrays；新 prelude |
| **2024** | 2024 | 最新版次；本书使用的版本 |

### 关键要点

- 在 `Cargo.toml` 中通过 `edition = "2024"` 指定版次
- 不指定则默认使用 2015（向后兼容）
- **不同版次的 crate 可以互相链接**——版次只影响编译器的解析方式
- 使用 `cargo fix --edition` 自动迁移代码到新版次
- 大多数新特性在所有版次都可用；仅涉及新关键字等不兼容变更时才需要切换版次

---

## 附录 G：Rust 的发布流程

### 发布渠道

| 渠道 | 更新频率 | 用途 |
|------|---------|------|
| **Nightly** | 每天 | 包含实验性功能（需 feature flag 开启）；面向尝鲜者 |
| **Beta** | 每 6 周从 nightly 分支 | 下一个 stable 的候选版本；用于 CI 回归测试 |
| **Stable** | 每 6 周从 beta 分支 | 生产环境使用；保证向后兼容 |

### 火车模型（Train Model）

```text
nightly:  * - - * - - * - - * - - * - - * - * - *
               |                         |
beta:          * - - - - - - - - *       *
                       |
stable:                          *
```

每 6 周一趟"火车"：nightly → beta → stable。错过这趟车？6 周后还有下一趟。

### 常用 rustup 命令

| 操作 | 命令 |
|------|------|
| 安装 nightly | `rustup toolchain install nightly` |
| 查看已安装的工具链 | `rustup toolchain list` |
| 当前项目使用 nightly | `rustup override set nightly` |
| 切回 stable | `rustup override set stable` |
| 更新所有工具链 | `rustup update` |

### 不稳定功能（Unstable Features）

- 仅在 nightly 上可用
- 需在源码中使用 `#![feature(功能名)]` 显式开启
- beta 和 stable 不能使用 feature flag
- 经过充分测试后功能会被稳定化（stabilize），移除 feature gate 并进入 stable

### RFC 流程

新功能的生命周期：**提案 (RFC)** → **团队审核** → **接受** → **实现（在 nightly 上带 feature flag）** → **稳定化** → **进入 stable 发布**

---

> 最后更新：2026-02 | 基于 The Rust Programming Language (2024 Edition)

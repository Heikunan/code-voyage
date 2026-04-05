# JS/TS 到 Rust 核心速查表 (Cheatsheet)

这份速查表提取自本教程各章的精髓，面向熟悉 JavaScript / TypeScript 开发者，提供最常用的概念映射和迁移提示。

---

## 1. 变量与类型 (Ch03 & Ch04)

| JS/TS 代码 | Rust 等效代码 | 心智模型差异 |
| --- | --- | --- |
| `const x = 5;` | `let x = 5;` | Rust 默认不可变，等同于深度的 `const`。 |
| `let y = 6;` | `let mut y = 6;` | 需要修改时显式声明 `mut`。 |
| `interface User { name: string }` | `struct User { name: String }` | Rust 结构体，分配在堆/栈上有明确的内存布局。 |
| `type Status = "OK" \| "ERR";` | `enum Status { Ok, Err }` | Rust 枚举功能强大，可以携带数据并强制模式匹配。 |
| `let arr = [1, 2, 3];` (可变长) | `let v: Vec<i32> = vec![1, 2, 3];` | 动态数组是 `Vec<T>`。定长数组是 `[T; N]`。 |
| `let s = "hello";` (对象引用) | `let s = String::from("hello");` | Rust `String` 在堆上分配，赋值默认是 `move` (转移所有权)，非深浅拷贝。 |

---

## 2. 错误处理与可空值 (Ch09)

| JS/TS 代码 | Rust 等效代码 | 心智模型差异 |
| --- | --- | --- |
| `T \| undefined` 或 `null` | `Option<T>` | Rust 没有 `null` / `undefined`。使用枚举 `Some(T)` 或 `None`。 |
| `try { ... } catch (e) { ... }` | `Result<T, E>` / `match` | Rust 没有异常，错误作为正常返回值，强制调用者处理。 |
| `if (!user) throw new Error();` | `let user = get_user().ok_or("Error")?;` | 问号 `?` 运算符等效于早返回错误。 |
| `console.error(...)` 奔溃退出 | `panic!("Fatal error");` | 用于不可恢复错误，不要随意当作异常使用。 |

---

## 3. 函数与控制流 (Ch03, Ch13)

| JS/TS 代码 | Rust 等效代码 | 心智模型差异 |
| --- | --- | --- |
| `function add(a: number): number { return a + 1; }` | `fn add(a: i32) -> i32 { a + 1 }` | 默认最后一个表达式为返回值（省略分号）。 |
| `(x) => x + 1` | `\|x\| x + 1` | 闭包（Closure），Rust 会根据环境变量使用推断 `Fn` / `FnMut` / `FnOnce` 所有权模式。 |
| `arr.map(x => x*2).filter(...)` | `v.iter().map(\|x\| x*2).filter(...).collect()` | Rust 迭代器完全惰性，必须通过 `collect()` 等消费端点执行。 |
| `switch (status) { case "OK": ... }` | `match status { Status::Ok => ... }` | `match` 必须处理所有可能性 (穷举检查)。 |

---

## 4. 面向对象与抽象 (Ch10, Ch18)

| JS/TS 代码 | Rust 等效代码 | 心智模型差异 |
| --- | --- | --- |
| `class User { constructor() {} sayHi() {} }` | `struct User {}`<br>`impl User { fn new()->Self{} fn say_hi(&self){} }` | 数据（`struct`）和行为（`impl`）分离。不存在类的继承。 |
| `interface Animal { speak(): void; }` | `trait Animal { fn speak(&self); }` | Trait 是 Rust 唯一的接口方式。可以给已有类型实现 Trait。 |
| 泛型 `function identity<T>(x: T): T` | `fn identity<T>(x: T) -> T` | 零成本抽象，编译时单态化展开，没有运行时类型擦除的开销。 |

---

## 5. 模块与包管理 (Ch07, Ch14)

| JS/TS 概念 | Rust 对应概念 | 心智模型差异 |
| --- | --- | --- |
| `npm init` / `package.json` | `cargo new` / `Cargo.toml` | Cargo 内置了构建系统、包管理和测试运行器。 |
| `npm install <pkg>` | `cargo add <crate>` | 包的注册中心是 crates.io。 |
| `import / export` 模块 | `use / pub mod` 模块树 | Rust 文件层级等于模块树，需要根（`main.rs`/`lib.rs`）声明 `mod module_name;` 注册。 |
| `npm run test` | `cargo test` | 原生内置，不需要像 Jest 这样的第三方测试库。 |

---

## 6. 并发与异步 (Ch16, Ch17)

| JS/TS 概念 | Rust 对应概念 | 心智模型差异 |
| --- | --- | --- |
| 事件循环 (Event Loop) | `tokio` (第三方 Runtime) | 语言层面不绑定运行时，极高的自定义能力。 |
| `Promise` | `Future` | 惰性求值：如果不 `.await` 或者被运行时 `poll`，Future 永远不会执行！ |
| `await fetch(...)` | `fetch(...).await` | `await` 在 Rust 中是后缀操作符，支持链式调用（`x.await?`）。 |
| `Promise.all([p1, p2])` | `tokio::join!(f1, f2)` | 同时推进多个 `Future` 且支持类型安全推断。 |
| Web Worker (多线程) | `std::thread::spawn` | 真正的 OS 级并发多线程。通过 `Arc` 和 `Mutex` 共享状态，编译期保证数据竞争安全。 |

---

## 避坑核心准则

1. **默认不可变：** 如果一个变量或者引用需要改变，在心里默念一遍：“为什么我要变它？如果非变不可，记得加 `mut` 或者用 `&mut`。”
2. **不用去背所有权和生命周期规则：** 写代码时先试着用 `String` 或者 `.clone()` 暴力通过借用检查器。原型跑通后，再慢慢重构成借用。
3. **把编译器当结对编程的导师：** Rust 的编译报错通常会提供 `help:` 和 `note:` 提示，跟着它的指令走，它大部分时间是对的。

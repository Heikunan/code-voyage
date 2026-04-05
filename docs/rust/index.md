---
title: Rust 学习路线
pageClass: overview-page
---

# Rust 学习路线

这个专区收录了面向 JavaScript / TypeScript 开发者的 Rust 学习内容，主线围绕《The Rust Programming Language》展开。

> 推荐用法：先读本页建立路线感，再按 Part 顺序进入章节；如果你是从 JavaScript / TypeScript 转过来，建议同时打开速查表对照着学。

## 这条路线适合谁

- 已经熟悉 JavaScript / TypeScript，想补强底层原理和工程能力
- 希望系统理解所有权、借用、生命周期和类型约束
- 想把并发、异步、性能优化和工程实践串成一条完整学习路径

## 学习目标

- 建立对所有权、借用、生命周期的系统理解
- 学会使用 Cargo、测试、模块和常见工程工具链
- 能够写出包含并发、异步和项目实战的 Rust 代码

## 如何使用这份文档

- 先看首页的 Part 划分，再按章节顺序推进
- 每个章节都尽量围绕一个核心主题，不建议跳读前面的所有权和错误处理部分
- 如果你来自 JS / TS，可以配合辅助资料里的速查表和风格映射一起看

## 路线速览

- 学习主线：语法与所有权 -> 模块与错误处理 -> 抽象与并发 -> 高级特性与项目
- 阅读方式：建议按顺序推进，不建议跳过 Part 1 和 Part 2
- 配套资料：速查表、风格映射、TRPL 对照表

## 分章节学习

### Part 1: 入门与核心语法

| 章节 | 主题 | 文件 |
|------|------|------|
| 1 | 入门 | [ch01](./ch01-getting-started) |
| 2 | 猜数字游戏 | [ch02](./ch02-guessing-game) |
| 3 | 通用概念 | [ch03](./ch03-common-concepts) |
| 4 | 所有权 | [ch04](./ch04-ownership) |
| 5 | 结构体 | [ch05](./ch05-structs) |
| 6 | 枚举与模式匹配 | [ch06](./ch06-enums) |

### Part 2: 模块化与常用能力

| 章节 | 主题 | 文件 |
|------|------|------|
| 7 | 包、Crate 与模块 | [ch07](./ch07-packages-crates-modules) |
| 8 | 常见集合 | [ch08](./ch08-collections) |
| 9 | 错误处理 | [ch09](./ch09-error-handling) |
| 10 | 泛型、Trait 与生命周期 | [ch10](./ch10-generics-traits-lifetimes) |
| 11 | 测试 | [ch11](./ch11-testing) |
| 12 | I/O 项目 | [ch12](./ch12-io-project) |

### Part 3: 抽象、工程与并发

| 章节 | 主题 | 文件 |
|------|------|------|
| 13 | 迭代器与闭包 | [ch13](./ch13-iterators-closures) |
| 14 | Cargo 与 Crates.io | [ch14](./ch14-cargo-crates-io) |
| 15 | 智能指针 | [ch15](./ch15-smart-pointers) |
| 16 | 并发 | [ch16](./ch16-concurrency) |
| 17 | 异步 | [ch17](./ch17-async-await) |

### Part 4: 高级主题与项目

| 章节 | 主题 | 文件 |
|------|------|------|
| 18 | OOP 特性 | [ch18](./ch18-oop) |
| 19 | 模式 | [ch19](./ch19-patterns) |
| 20 | 高级特性 | [ch20](./ch20-advanced-features) |
| 21 | Web Server 项目 | [ch21](./ch21-web-server) |

## 建议学习顺序

1. Part 1 先打牢所有权、结构体、枚举这些 Rust 核心概念。
2. Part 2 补齐模块、集合、错误处理、泛型和测试这些日常开发能力。
3. Part 3 再进入闭包、智能指针、并发和异步。
4. 最后通过 Part 4 把高级特性和项目实践串起来。

> 如果你只是想快速建立整体认知，可以先读 `ch01`、`ch03`、`ch04`、`ch09`、`ch16`、`ch17`，再回头系统补完全部章节。

## 完整目录

- [第 1 章：入门](./ch01-getting-started)
- [第 2 章：猜数字游戏](./ch02-guessing-game)
- [第 3 章：通用概念](./ch03-common-concepts)
- [第 4 章：所有权](./ch04-ownership)
- [第 5 章：结构体](./ch05-structs)
- [第 6 章：枚举与模式匹配](./ch06-enums)
- [第 7 章：包、Crate 与模块](./ch07-packages-crates-modules)
- [第 8 章：常见集合](./ch08-collections)
- [第 9 章：错误处理](./ch09-error-handling)
- [第 10 章：泛型、Trait 与生命周期](./ch10-generics-traits-lifetimes)
- [第 11 章：测试](./ch11-testing)
- [第 12 章：I/O 项目](./ch12-io-project)
- [第 13 章：迭代器与闭包](./ch13-iterators-closures)
- [第 14 章：Cargo 与 Crates.io](./ch14-cargo-crates-io)
- [第 15 章：智能指针](./ch15-smart-pointers)
- [第 16 章：并发](./ch16-concurrency)
- [第 17 章：异步](./ch17-async-await)
- [第 18 章：OOP 特性](./ch18-oop)
- [第 19 章：模式](./ch19-patterns)
- [第 20 章：高级特性](./ch20-advanced-features)
- [第 21 章：Web Server 项目](./ch21-web-server)

## 辅助资料

- [JS/Rust 速查表](./js-rust-cheatsheet)
- [JS/TS 风格映射](./js-ts-styleguide)
- [TRPL 对照表](./trpl-mapping)
- [附录](./appendix)

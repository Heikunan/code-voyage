---
title: Solidity 学习路线
pageClass: overview-page
---

# Solidity 学习路线

这个专区收录了面向 JavaScript / TypeScript 开发者的 Solidity 学习内容，重点覆盖智能合约基础、EVM、Gas 与安全实践。

> 推荐用法：先把基础认知、语言能力和安全意识串成一条线来学，再回头深入底层原理和工程细节。

## 这条路线适合谁

- 已经熟悉 JavaScript / TypeScript，想进入 Web3 和智能合约开发
- 希望理解 EVM 执行机制、Gas 成本和链上状态模型
- 需要建立安全开发意识，避免常见合约漏洞

## 学习目标

- 理解区块链、EVM、Gas 和合约执行的核心机制
- 掌握 Solidity 语法、状态变量、函数、继承和事件等核心能力
- 建立安全开发意识，能识别常见漏洞并写出更稳健的合约

## 如何使用这份文档

- 先按 Part 顺序学习，不建议一开始就直接跳到安全或底层原理章节
- 阅读语言特性时，尽量同步思考 EVM、Gas 和状态变化的成本
- 进入实战示例和安全章节后，建议带着攻击面和防御思路回看前面的写法

## 路线速览

- 学习主线：区块链与环境 -> Solidity 语言与合约能力 -> 安全与底层执行原理
- 阅读方式：先建立基础认知，再进入合约实现，最后系统补安全和底层
- 配套资料：JS/Solidity 速查表、附录

## 分章节学习

### Part 1: 基础认知与环境

| 章节 | 主题 | 文件 |
|------|------|------|
| 1 | 区块链与智能合约基础 | [ch01](./ch01-blockchain-smart-contracts) |
| 2 | 开发环境与编译器 | [ch02](./ch02-dev-environment-compiler) |

### Part 2: 语言与合约核心

| 章节 | 主题 | 文件 |
|------|------|------|
| 3 | 语言基础 | [ch03](./ch03-language-basics) |
| 4 | 合约核心特性 | [ch04](./ch04-contract-core-features) |
| 5 | 实战示例 | [ch05](./ch05-practical-examples) |

### Part 3: 安全与进阶原理

| 章节 | 主题 | 文件 |
|------|------|------|
| 6 | 安全、风格与最佳实践 | [ch06](./ch06-security-style-best-practices) |
| 7 | 进阶与底层原理 | [ch07](./ch07-advanced-internals) |

## 建议学习顺序

1. Part 1 先建立区块链、合约部署、编译器和工具链的基本认知。
2. Part 2 集中掌握 Solidity 语言本身和合约核心机制。
3. Part 3 再系统看安全问题、风格规范和更底层的执行原理。

> 如果你的目标是尽快开始写合约，建议优先读 `ch01`、`ch02`、`ch03`、`ch04`，然后立刻进入 `ch06` 补安全意识。

## 完整目录

- [第 1 章：区块链与智能合约基础](./ch01-blockchain-smart-contracts)
- [第 2 章：开发环境与编译器](./ch02-dev-environment-compiler)
- [第 3 章：语言基础](./ch03-language-basics)
- [第 4 章：合约核心特性](./ch04-contract-core-features)
- [第 5 章：实战示例](./ch05-practical-examples)
- [第 6 章：安全、风格与最佳实践](./ch06-security-style-best-practices)
- [第 7 章：进阶与底层原理](./ch07-advanced-internals)

## 辅助资料

- [JS/Solidity 速查表](./js-solidity-cheatsheet)
- [附录](./appendix)

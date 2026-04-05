# Code Voyage

> A learning roadmap and documentation site for JavaScript developers who want to systematically learn Python, Rust, and Solidity.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Preview-GitHub%20Pages-blue)](https://heikunan.github.io/code-voyage/)

- Repository: `code-voyage`
- Preview: [https://heikunan.github.io/code-voyage/](https://heikunan.github.io/code-voyage/)
- Description: `A roadmap and documentation site for JavaScript developers learning Python, Rust, and Solidity.`

## 中文简介

`Code Voyage` 是一个面向 JavaScript / TypeScript 开发者的多语言学习路线与文档站，当前重点覆盖：

- Python
- Rust
- Solidity

它不是普通的零散笔记仓库，而是一个持续整理中的技术知识站，强调：

- 从 JavaScript 开发者视角切入
- 强调迁移成本最低的学习路径
- 注重工程实践，而不只是语法罗列
- 适合作为长期维护的个人知识库与公开文档站

如果你的背景是前端、全栈 JavaScript，或者你正准备进入 AI 应用、系统编程或智能合约方向，这个仓库会更适合作为路线型资料，而不是单篇教程集合。

## Overview

This project is a VitePress-based technical learning site focused on one clear audience: developers with JavaScript or TypeScript experience who want to expand into other ecosystems without starting from zero.

Instead of writing generic tutorials, the content is organized around language migration, engineering mindset shifts, and practical development scenarios.

Current tracks include:

- Python: a 30-day roadmap covering syntax, OOP, async programming, data processing, AI Agent basics, and engineering practices
- Rust: a structured path based on TRPL, with emphasis on ownership, type systems, concurrency, async, and systems thinking
- Solidity: a smart contract learning track focused on EVM fundamentals, ABI, gas, security, and real-world development patterns

## Who This Is For

- JavaScript / TypeScript developers
- Developers moving toward AI application or AI Agent development
- Engineers who want a Chinese technical knowledge base with clear migration context
- Learners who prefer roadmap-style documentation over scattered notes

## Project Goals

- Explain Python, Rust, and Solidity from a JavaScript developer's perspective
- Build a long-term, extensible self-learning knowledge base
- Turn fragmented learning notes into a structured documentation website
- Emphasize practical engineering knowledge instead of isolated syntax memorization

## Site Structure

```text
docs/
  index.md                      # Homepage
  about.md                      # Project background
  guide/                        # Python roadmap
    phase-01-basics/
    phase-02-oop/
    phase-03-async/
    phase-04-data/
    phase-05-agent/
    phase-06-engineering/
  rust/                         # Rust learning track
  solidity/                     # Solidity learning track
  .vitepress/                   # VitePress config
```

## Tech Stack

- VitePress
- Markdown
- Shiki code highlighting
- Node.js tooling

## Local Development

Install dependencies:

```bash
npm install
```

Start the local docs server:

```bash
npm run dev
```

Build the production site:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deployment

This repository includes a GitHub Actions workflow for deploying the VitePress site to GitHub Pages.

Expected GitHub setup:

- Repository name: `code-voyage`
- Default branch: `main`
- GitHub Pages source: `GitHub Actions`

After pushing to `main`, the workflow in `.github/workflows/deploy.yml` will:

- install dependencies
- build the VitePress site
- deploy `docs/.vitepress/dist` to GitHub Pages

If the repository name changes, update `docs/.vitepress/config.ts` and the badge / site links in this README.

## Content Features

- Chinese-first technical writing
- JS-to-Python / JS-to-Rust / JS-to-Solidity mental model mapping
- Progressive roadmap organization instead of isolated articles
- Practical examples and engineering-oriented explanations
- Ready to grow into a personal or team knowledge site

## Project Positioning

This repository is not only a set of study notes. It is intended to become a maintainable developer learning site and a reusable documentation base for cross-language growth.

If your background is frontend, full-stack JavaScript, or AI application development, this repo is designed to reduce the friction of entering Python, Rust, and Solidity.

## Contributing

Contributions are welcome.

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before submitting changes.

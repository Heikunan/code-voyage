import { defineConfig } from "vitepress";

export default defineConfig({
  base: "/code-voyage/",
  lang: "zh-CN",
  title: "代码远航",
  description: "面向 JavaScript 开发者的学习网站",

  markdown: {
    html: false,
    languageAlias: {
      env: "dotenv",
      gitignore: "ini",
      yul: "solidity",
    },
  },

  head: [
    [
      "meta",
      {
        name: "keywords",
        content: "Python, Rust, Solidity, AI Agent, 学习路线, JavaScript",
      },
    ],
  ],

  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      {
        text: "Python",
        items: [
          {
            text: "总览",
            items: [{ text: "Python 学习路线", link: "/python/" }],
          },
          {
            text: "Part 1-2",
            items: [
              { text: "入门与核心语法", link: "/python/phase-01-basics/" },
              { text: "模块化与常用能力", link: "/python/phase-02-oop/" },
            ],
          },
          {
            text: "Part 3-4",
            items: [
              { text: "抽象、工程与并发", link: "/python/phase-03-async/" },
              { text: "高级主题与项目", link: "/python/phase-04-data/" },
            ],
          },
          {
            text: "辅助资料",
            items: [
              { text: "JS/Python 速查", link: "/python/js-python-cheatsheet" },
              {
                text: "Python 路线对照表",
                link: "/python/python-roadmap-mapping",
              },
            ],
          },
        ],
      },
      {
        text: "Rust",
        items: [
          {
            text: "总览",
            items: [{ text: "Rust 学习路线", link: "/rust/" }],
          },
          {
            text: "Part 1-2",
            items: [
              { text: "入门与核心语法", link: "/rust/ch01-getting-started" },
              {
                text: "模块化与常用能力",
                link: "/rust/ch07-packages-crates-modules",
              },
            ],
          },
          {
            text: "Part 3-4",
            items: [
              {
                text: "抽象、工程与并发",
                link: "/rust/ch13-iterators-closures",
              },
              { text: "高级主题与项目", link: "/rust/ch18-oop" },
            ],
          },
          {
            text: "辅助资料",
            items: [
              { text: "JS/Rust 速查", link: "/rust/js-rust-cheatsheet" },
              { text: "TRPL 对照表", link: "/rust/trpl-mapping" },
            ],
          },
        ],
      },
      {
        text: "Solidity",
        items: [
          {
            text: "总览",
            items: [{ text: "Solidity 学习路线", link: "/solidity/" }],
          },
          {
            text: "Part 1-2",
            items: [
              {
                text: "基础认知与环境",
                link: "/solidity/ch01-blockchain-smart-contracts",
              },
              {
                text: "语言与合约核心",
                link: "/solidity/ch03-language-basics",
              },
            ],
          },
          {
            text: "Part 3",
            items: [
              {
                text: "安全与进阶原理",
                link: "/solidity/ch06-security-style-best-practices",
              },
            ],
          },
          {
            text: "辅助资料",
            items: [
              {
                text: "JS/Solidity 速查",
                link: "/solidity/js-solidity-cheatsheet",
              },
              { text: "附录", link: "/solidity/appendix" },
            ],
          },
        ],
      },


    ],

    sidebar: {
      "/python/": [
        {
          text: "Python 学习路线总览",
          items: [
            { text: "概览", link: "/python/" },
            { text: "JS/Python 速查", link: "/python/js-python-cheatsheet" },
            {
              text: "Python 路线对照表",
              link: "/python/python-roadmap-mapping",
            },
          ],
        },
      ],
      "/python/phase-01-basics/": [
        {
          text: "Phase 1: Python 核心语法",
          items: [
            { text: "概览", link: "/python/phase-01-basics/" },
            {
              text: "第 1 天 环境搭建与首个程序",
              link: "/python/phase-01-basics/day01",
            },
            {
              text: "第 2 天 变量类型与运算符",
              link: "/python/phase-01-basics/day02",
            },
            { text: "第 3 天 控制流", link: "/python/phase-01-basics/day03" },
            {
              text: "第 4 天 列表与元组",
              link: "/python/phase-01-basics/day04",
            },
            {
              text: "第 5 天 字典与集合",
              link: "/python/phase-01-basics/day05",
            },
            { text: "第 6 天 函数", link: "/python/phase-01-basics/day06" },
            { text: "第 7 天 函数进阶", link: "/python/phase-01-basics/day07" },
          ],
        },
      ],
      "/python/phase-02-oop/": [
        {
          text: "Phase 2: OOP & 高级特性",
          items: [
            { text: "概览", link: "/python/phase-02-oop/" },
            { text: "第 8 天 面向对象基础", link: "/python/phase-02-oop/day08" },
            { text: "第 9 天 面向对象进阶", link: "/python/phase-02-oop/day09" },
            { text: "第 10 天 异常处理", link: "/python/phase-02-oop/day10" },
            { text: "第 11 天 文件 I/O", link: "/python/phase-02-oop/day11" },
            {
              text: "第 12 天 模块与包管理",
              link: "/python/phase-02-oop/day12",
            },
          ],
        },
      ],
      "/python/phase-03-async/": [
        {
          text: "Phase 3: 异步 & API",
          items: [
            { text: "概览", link: "/python/phase-03-async/" },
            {
              text: "第 13 天 异步编程基础",
              link: "/python/phase-03-async/day13",
            },
            {
              text: "第 14 天 异步编程实战",
              link: "/python/phase-03-async/day14",
            },
            { text: "第 15 天 HTTP 请求", link: "/python/phase-03-async/day15" },
            {
              text: "第 16 天 Pydantic 数据验证",
              link: "/python/phase-03-async/day16",
            },
            {
              text: "第 17 天 FastAPI 快速上手",
              link: "/python/phase-03-async/day17",
            },
            {
              text: "第 18 天 WebSocket 与 SSE",
              link: "/python/phase-03-async/day18",
            },
          ],
        },
      ],
      "/python/phase-04-data/": [
        {
          text: "Phase 4: 数据处理 & 办公",
          items: [
            { text: "概览", link: "/python/phase-04-data/" },
            { text: "第 19 天 正则表达式", link: "/python/phase-04-data/day19" },
            { text: "第 20 天 NumPy 基础", link: "/python/phase-04-data/day20" },
            {
              text: "第 21 天 Pandas 基础",
              link: "/python/phase-04-data/day21",
            },
            {
              text: "第 22 天 Pandas 进阶",
              link: "/python/phase-04-data/day22",
            },
            {
              text: "第 23 天 可视化与办公自动化",
              link: "/python/phase-04-data/day23",
            },
          ],
        },
      ],
      "/python/phase-05-agent/": [
        {
          text: "Phase 5: AI Agent 核心",
          items: [
            { text: "概览", link: "/python/phase-05-agent/" },
            {
              text: "第 24 天 LLM API 调用",
              link: "/python/phase-05-agent/day24",
            },
            {
              text: "第 25 天 提示词工程",
              link: "/python/phase-05-agent/day25",
            },
            { text: "第 26 天 函数调用", link: "/python/phase-05-agent/day26" },
            {
              text: "第 27 天 向量数据库与记忆",
              link: "/python/phase-05-agent/day27",
            },
            {
              text: "第 28 天 LangChain 与 Agent",
              link: "/python/phase-05-agent/day28",
            },
          ],
        },
      ],
      "/python/phase-06-engineering/": [
        {
          text: "Phase 6: 工程化 & 部署",
          items: [
            { text: "概览", link: "/python/phase-06-engineering/" },
            {
              text: "第 29 天 测试日志与配置",
              link: "/python/phase-06-engineering/day29",
            },
            {
              text: "第 30 天 Docker 与最终项目",
              link: "/python/phase-06-engineering/day30",
            },
          ],
        },
      ],
      "/rust/": [
        {
          text: "Rust 学习路线总览",
          items: [{ text: "概览", link: "/rust/" }],
        },
        {
          text: "Part 1: 入门与核心语法",
          items: [
            { text: "第 1 章 入门", link: "/rust/ch01-getting-started" },
            { text: "第 2 章 猜数字游戏", link: "/rust/ch02-guessing-game" },
            { text: "第 3 章 通用概念", link: "/rust/ch03-common-concepts" },
            { text: "第 4 章 所有权", link: "/rust/ch04-ownership" },
            { text: "第 5 章 结构体", link: "/rust/ch05-structs" },
            { text: "第 6 章 枚举", link: "/rust/ch06-enums" },
          ],
        },
        {
          text: "Part 2: 模块化与常用能力",
          items: [
            {
              text: "第 7 章 模块系统",
              link: "/rust/ch07-packages-crates-modules",
            },
            { text: "第 8 章 集合", link: "/rust/ch08-collections" },
            { text: "第 9 章 错误处理", link: "/rust/ch09-error-handling" },
            {
              text: "第 10 章 泛型 Trait 生命周期",
              link: "/rust/ch10-generics-traits-lifetimes",
            },
            { text: "第 11 章 测试", link: "/rust/ch11-testing" },
            { text: "第 12 章 I/O 项目", link: "/rust/ch12-io-project" },
          ],
        },
        {
          text: "Part 3: 抽象、工程与并发",
          items: [
            {
              text: "第 13 章 迭代器与闭包",
              link: "/rust/ch13-iterators-closures",
            },
            { text: "第 14 章 Cargo 进阶", link: "/rust/ch14-cargo-crates-io" },
            { text: "第 15 章 智能指针", link: "/rust/ch15-smart-pointers" },
            { text: "第 16 章 并发", link: "/rust/ch16-concurrency" },
            { text: "第 17 章 异步", link: "/rust/ch17-async-await" },
          ],
        },
        {
          text: "Part 4: 高级主题与项目",
          items: [
            { text: "第 18 章 OOP 特性", link: "/rust/ch18-oop" },
            { text: "第 19 章 模式", link: "/rust/ch19-patterns" },
            { text: "第 20 章 高级特性", link: "/rust/ch20-advanced-features" },
            { text: "第 21 章 Web Server", link: "/rust/ch21-web-server" },
          ],
        },
        {
          text: "附加资料",
          items: [
            { text: "JS/Rust 速查", link: "/rust/js-rust-cheatsheet" },
            { text: "JS/TS 风格映射", link: "/rust/js-ts-styleguide" },
            { text: "TRPL 对照表", link: "/rust/trpl-mapping" },
            { text: "附录", link: "/rust/appendix" },
          ],
        },
      ],
      "/solidity/": [
        {
          text: "Solidity 学习路线总览",
          items: [{ text: "概览", link: "/solidity/" }],
        },
        {
          text: "Part 1: 基础认知与环境",
          items: [
            {
              text: "第 1 章 区块链与合约",
              link: "/solidity/ch01-blockchain-smart-contracts",
            },
            {
              text: "第 2 章 开发环境与编译器",
              link: "/solidity/ch02-dev-environment-compiler",
            },
          ],
        },
        {
          text: "Part 2: 语言与合约核心",
          items: [
            {
              text: "第 3 章 语言基础",
              link: "/solidity/ch03-language-basics",
            },
            {
              text: "第 4 章 合约核心特性",
              link: "/solidity/ch04-contract-core-features",
            },
            {
              text: "第 5 章 实战示例",
              link: "/solidity/ch05-practical-examples",
            },
          ],
        },
        {
          text: "Part 3: 安全与进阶原理",
          items: [
            {
              text: "第 6 章 安全与最佳实践",
              link: "/solidity/ch06-security-style-best-practices",
            },
            {
              text: "第 7 章 进阶原理",
              link: "/solidity/ch07-advanced-internals",
            },
          ],
        },
        {
          text: "附加资料",
          items: [
            {
              text: "JS/Solidity 速查",
              link: "/solidity/js-solidity-cheatsheet",
            },
            { text: "附录", link: "/solidity/appendix" },
          ],
        },
      ],
    },

    socialLinks: [],

    editLink: {},

    lastUpdated: {
      text: "最后更新",
    },

    search: {
      provider: "local",
      options: {
        translations: {
          button: { buttonText: "搜索文档" },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
          },
        },
      },
    },
  },
});

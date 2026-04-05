# 附录 — 速查参考（Appendix）

> 本附录汇总 Solidity 各版本破坏性变更、常用工具资源、关键字列表、EVM 操作码及 ERC 标准速查，供日常开发随时查阅。

---

## 附录 A：版本破坏性变更速查

升级旧合约或阅读历史代码时，以下速查表可以帮助你快速定位各版本之间的关键差异。

### A.1 Solidity 0.5.0

0.5.0 是 Solidity 第一次大规模"显式化"改造，核心思想是**消除隐式行为、强制开发者写出意图明确的代码**。

| 变更项 | 说明 | 升级注意事项 |
|--------|------|-------------|
| 强制 `address payable` | `address` 拆分为 `address` 和 `address payable`，只有 `address payable` 才能调用 `transfer` / `send` | 需要转账的地址必须声明为 `address payable`，通过 `payable(addr)` 转换 |
| 强制函数可见性 | 所有函数必须显式标注 `public` / `external` / `internal` / `private` | 为所有未标注的函数添加可见性修饰符 |
| 强制数据位置 | struct、array、mapping 类型的变量必须显式声明 `memory` / `storage` / `calldata` | 函数参数和返回值也需要标注数据位置 |
| 移除 `var` 关键字 | 不再允许类型推断，必须显式声明变量类型 | 将所有 `var x = ...` 替换为具体类型 |
| 构造函数语法 | 必须使用 `constructor` 关键字，不再允许同名函数作为构造函数 | 旧的 `function ContractName()` 必须改为 `constructor()` |
| `.call()` 返回值变更 | `.call()` / `.delegatecall()` / `.staticcall()` 返回 `(bool, bytes memory)` | 将 `bool success = addr.call(...)` 改为 `(bool success, bytes memory data) = addr.call(...)` |
| 移除 `throw` | 不再支持 `throw`，使用 `revert()` / `require()` / `assert()` | 全局替换 `throw` 为 `revert()` |
| 移除 `sha3` | 改用 `keccak256` | 全局替换 `sha3(...)` 为 `keccak256(...)` |
| 移除 `suicide` | 改用 `selfdestruct` | 全局替换 |
| 移除 `callcode` | 改用 `delegatecall` | 全局替换 |
| C99 作用域规则 | 变量只能在声明之后且同一或嵌套作用域中使用 | 检查变量在 `for` 循环等结构中的声明位置 |
| 移除 `years` 单位 | 因闰年问题不再支持 `years` 时间单位 | 使用具体的秒数计算替代 |
| 移除空 struct | 不再允许声明空的 struct | 确保 struct 至少包含一个成员 |
| `pure` / `view` 使用 `STATICCALL` | 纯函数和视图函数在 Byzantium 及之后使用 `STATICCALL` 调用 | EVM 层面禁止状态变更 |

### A.2 Solidity 0.6.0

0.6.0 引入了面向对象的核心机制，使继承体系更加清晰，同时增强了错误处理能力。

| 变更项 | 说明 | 升级注意事项 |
|--------|------|-------------|
| `virtual` / `override` 关键字 | 可被重写的函数必须标记 `virtual`，重写函数必须标记 `override` | 为所有接口/可重写函数加 `virtual`，重写时加 `override(Base1, Base2)` |
| `abstract` 合约 | 未完全实现的合约必须标记为 `abstract` | 无法用 `new` 实例化 `abstract` 合约 |
| `try` / `catch` | 新增对外部调用失败的结构化捕获 | 可替代底层 `.call()` 返回值检查，代码更可读 |
| 数组 `length` 只读 | 存储数组不再能通过赋值 `.length` 调整大小 | 使用 `push()` / `push(value)` / `pop()` 替代 `array.length = n` |
| `push(value)` 不返回长度 | `push(value)` 返回值变为 `void` | 如需新长度，调用后通过 `array.length` 获取 |
| `receive` / `fallback` 拆分 | 匿名 fallback 函数拆分为 `receive() external payable` 和 `fallback() external` | `receive` 处理纯 ETH 转账（calldata 为空），`fallback` 处理无匹配函数的调用 |
| 禁止状态变量遮蔽 | 派生合约不能声明与基合约同名的状态变量 | 重命名冲突的状态变量 |
| `payable(x)` 转换 | `address` → `address payable` 可通过 `payable(x)` 转换 | 替代 0.5.0 中 `address(uint160(x))` 的写法 |
| 文件级 struct/enum | struct 和 enum 可在合约外部（文件级）声明 | 提升代码组织灵活性 |
| 数组切片 | calldata 数组支持切片操作，如 `msg.data[4:]` | 仅限 calldata 数组 |
| 内联汇编变量名限制 | 变量名不能以 `_slot` / `_offset` 结尾 | 使用 `.slot` / `.offset` 访问存储指针 |
| Yul 优化器默认启用 | 使用 `--optimize` 时 Yul 优化器默认启用 | 可通过 `--no-optimize-yul` 禁用 |

### A.3 Solidity 0.7.0

0.7.0 是一次"清理"版本，移除了大量历史遗留语法，使语言更加简洁。

| 变更项 | 说明 | 升级注意事项 |
|--------|------|-------------|
| 新的函数调用选项语法 | `x.f{gas: 10000, value: 2 ether}(arg)` 替代旧的 `x.f.gas(10000).value(2 ether)(arg)` | 必须使用花括号语法 |
| `now` 弃用 | 全局变量 `now` 改为 `block.timestamp` | 全局替换 `now` → `block.timestamp` |
| 移除 `finney` / `szabo` | 不再支持这两个很少使用的面额单位 | 使用 `1e15`（finney）或 `1e12`（szabo）或直接使用 `gwei` |
| `gwei` 成为关键字 | `gwei` 不能再用作标识符 | 重命名与 `gwei` 冲突的变量名 |
| 构造函数不再需要可见性 | 移除 `public` / `internal` 构造函数，使用 `abstract` 代替 | 删除构造函数的 `public`/`internal` 修饰符 |
| 移除库函数 `virtual` | 库函数不能标记为 `virtual`，因为库不可被继承 | 删除库函数上的 `virtual` |
| `using A for B` 不再继承 | 必须在每个需要使用的合约中重复声明 | 在所有派生合约中重新声明 `using` 语句 |
| 移位运算禁止有符号类型 | 移位量必须为无符号整数 | 将 `x >> y` 中的 `y` 转为 `uint` |
| 含 mapping 的结构体限制 | 包含 mapping 的 struct/array 只能在 storage 中使用 | 不能在 memory 中复制包含 mapping 的结构体 |
| 字符串字面量限制 | 字符串只能包含可打印 ASCII 字符 | 非 ASCII 内容使用 `unicode"..."` 前缀 |
| 内联汇编 `.slot` / `.offset` | 存储变量访问从 `x_slot` 改为 `x.slot` | 全局替换后缀语法 |
| 同名事件禁止 | 同一继承层级中禁止同名同参数事件 | 重命名冲突的事件 |

### A.4 Solidity 0.8.0

0.8.0 是最重大的安全升级，**默认算术溢出检查**极大降低了整数溢出漏洞的风险。

| 变更项 | 说明 | 升级注意事项 |
|--------|------|-------------|
| **默认算术溢出检查** | 加减乘除默认在溢出时 `revert`，不再静默回绕 | 性能敏感处使用 `unchecked { ... }` 恢复旧行为；**可移除 SafeMath 库** |
| ABI coder v2 默认启用 | 不再需要 `pragma experimental ABIEncoderV2` | 如需旧行为使用 `pragma abicoder v1;` |
| 指数运算右结合 | `a**b**c` 解析为 `a**(b**c)` 而非 `(a**b)**c` | 检查连续指数运算的逻辑 |
| `Panic(uint256)` 错误码 | `assert` 失败、除零等内部错误使用 `revert Panic(code)` 代替 `invalid` 操作码 | 节省 gas，`require` 失败仍使用 `Error(string)` |
| 移除 `byte` 类型别名 | `byte` 不再是 `bytes1` 的别名 | 全局替换 `byte` → `bytes1` |
| `msg.sender` / `tx.origin` 类型变更 | 类型从 `address payable` 变为 `address` | 需要转账时使用 `payable(msg.sender)` |
| 显式类型转换限制 | 一次转换只允许改变 sign、width、type-category 中的一项 | 需要多步转换，如 `address(uint160(uint256))` |
| `address` 字面量类型变更 | 地址字面量类型为 `address`（非 `address payable`） | 使用 `payable(0x...)` 获取 `address payable` |
| 函数调用选项不可重复 | `c.f{gas: 10000}{value: 1}()` → `c.f{gas: 10000, value: 1}()` | 合并函数调用选项 |
| 移除 `log0` ~ `log4` | 全局函数移除，需通过内联汇编实现 | 使用 `assembly { log0(...) }` 替代 |
| 枚举最多 256 成员 | ABI 底层类型固定为 `uint8` | 超过 256 成员的枚举需拆分 |
| `chainid` 变为 `view` | 内联汇编中 `chainid` 不再是 `pure` | 标记为 `view` 而非 `pure` |
| 禁止对无符号整数取反 | `-uint` 不再合法 | 使用 `type(uint256).max - x + 1` 替代 |

---

## 附录 B：外部学习资源与工具

### B.1 官方资源

| 资源 | 链接 | 推荐理由 |
|------|------|---------|
| Solidity 官方文档 | https://docs.soliditylang.org/ | 最权威的语言参考，版本更新及时 |
| Remix IDE | https://remix.ethereum.org/ | 零配置浏览器 IDE，适合快速原型和学习 |
| Ethereum 开发者门户 | https://ethereum.org/en/developers/ | 以太坊生态全景导航，涵盖教程和工具 |
| Ethereum StackExchange | https://ethereum.stackexchange.com/ | 技术问答社区，搜索常见问题首选 |
| Solidity by Example | https://solidity-by-example.org/ | 简洁的代码示例，按主题分类 |
| Solidity 语言论坛 | https://forum.soliditylang.org/ | 参与语言设计讨论的官方渠道 |
| awesome-solidity | https://github.com/bkrem/awesome-solidity | 社区维护的资源合集 |

### B.2 开发框架

| 框架 | 语言 | 说明 | 推荐场景 |
|------|------|------|---------|
| **Hardhat** | JavaScript / TypeScript | 插件生态丰富，调试体验好，社区活跃 | JS/TS 开发者首选 |
| **Foundry** | Rust (CLI) / Solidity (测试) | 编译速度极快，用 Solidity 写测试，内置模糊测试 | 高性能需求、Solidity 原生测试 |
| Truffle | JavaScript | Consensys 已于 2023 年 9 月宣布停止维护 | ⚠️ 不推荐新项目使用，现有项目建议迁移至 Hardhat |

> **建议**：新项目优先选择 **Hardhat**（前端/全栈团队）或 **Foundry**（合约密集型项目）。

### B.3 前端交互库

| 库 | 说明 | 推荐场景 |
|----|------|---------|
| **ethers.js** | 轻量级，API 设计清晰，文档完善 | 大多数 DApp 项目推荐 |
| **web3.js** | 最早的以太坊 JS 库，社区历史资源丰富 | 遗留项目维护 |
| **viem** | TypeScript-first，类型安全，与 wagmi 深度集成 | TypeScript 新项目推荐 |

### B.4 测试与安全工具

| 工具 | 类型 | 说明 |
|------|------|------|
| **Slither** | 静态分析 | Trail of Bits 出品，检测常见漏洞模式，速度快，集成 CI 方便 |
| **Mythril** | 符号执行 | ConsenSys 出品，深度分析执行路径，发现复杂漏洞 |
| **Echidna** | 模糊测试 (Fuzzing) | 基于属性的测试，自动生成输入探索边界条件 |
| **Aderyn** | 静态分析 | Cyfrin 出品，支持 Hardhat 和 Foundry 项目 |
| **Solhint** | Linter | 代码风格与安全规则检查 |
| **Sourcify** | 合约验证 | 去中心化的合约源码验证服务 |

---

## 附录 C：Solidity 关键字完整列表

### 类型关键字

| 关键字 | 说明 |
|--------|------|
| `bool` | 布尔类型 |
| `int` / `int8` ~ `int256` | 有符号整数（8 位到 256 位，步长 8） |
| `uint` / `uint8` ~ `uint256` | 无符号整数 |
| `address` | 地址类型（20 字节） |
| `address payable` | 可接收 ETH 的地址类型 |
| `bytes1` ~ `bytes32` | 固定长度字节数组 |
| `bytes` | 动态长度字节数组 |
| `string` | 动态长度 UTF-8 字符串 |
| `mapping` | 映射类型 |
| `struct` | 自定义结构体 |
| `enum` | 枚举类型 |

### 可见性关键字

| 关键字 | 说明 |
|--------|------|
| `public` | 外部和内部均可访问 |
| `private` | 仅当前合约可访问 |
| `internal` | 当前合约及派生合约可访问 |
| `external` | 仅外部调用可访问 |

### 状态可变性关键字

| 关键字 | 说明 |
|--------|------|
| `pure` | 不读取也不修改状态 |
| `view` | 读取但不修改状态 |
| `payable` | 可接收 ETH |
| `constant` | 编译时常量（用于状态变量） |
| `immutable` | 部署时赋值后不可变 |

### 控制流关键字

| 关键字 | 说明 |
|--------|------|
| `if` / `else` | 条件分支 |
| `for` | 计数循环 |
| `while` | 条件循环 |
| `do` | do-while 循环 |
| `break` | 跳出循环 |
| `continue` | 跳到下一轮循环 |
| `return` | 返回值 |
| `try` / `catch` | 外部调用异常捕获（≥ 0.6.0） |

### 合约相关关键字

| 关键字 | 说明 |
|--------|------|
| `contract` | 声明合约 |
| `interface` | 声明接口 |
| `library` | 声明库 |
| `abstract` | 声明抽象合约（≥ 0.6.0） |
| `constructor` | 构造函数 |
| `function` | 声明函数 |
| `modifier` | 声明函数修饰器 |
| `event` | 声明事件 |
| `error` | 声明自定义错误（≥ 0.8.4） |
| `using ... for` | 附加库函数到类型 |
| `is` | 继承声明 |
| `virtual` | 标记可被重写（≥ 0.6.0） |
| `override` | 标记重写（≥ 0.6.0） |
| `new` | 创建合约实例 |
| `delete` | 重置变量为默认值 |
| `type` | 用户定义值类型（≥ 0.8.8） |

### 特殊关键字与保留字

| 关键字 | 说明 |
|--------|------|
| `memory` | 数据位置：内存 |
| `storage` | 数据位置：持久存储 |
| `calldata` | 数据位置：调用数据（只读） |
| `transient` | 瞬态存储（EIP-1153） |
| `indexed` | 事件参数索引标记 |
| `anonymous` | 匿名事件 |
| `emit` | 触发事件 |
| `revert` | 回滚交易 |
| `require` | 条件检查（失败则回滚） |
| `assert` | 内部断言 |
| `receive` | 接收 ETH 的特殊函数（≥ 0.6.0） |
| `fallback` | 回退函数（≥ 0.6.0） |
| `selfdestruct` | 销毁合约 |
| `this` | 当前合约实例 |
| `super` | 父合约引用 |
| `unchecked` | 禁用溢出检查块（≥ 0.8.0） |
| `assembly` | 内联汇编块 |
| `pragma` | 编译指示 |
| `import` | 导入声明 |
| `wei` / `gwei` / `ether` | ETH 面额单位 |
| `seconds` / `minutes` / `hours` / `days` / `weeks` | 时间单位 |

---

## 附录 D：常用 EVM 操作码速查

以下列出开发中最常遇到的 EVM 操作码，完整列表参见 [evm.codes](https://www.evm.codes/)。

### 栈操作

| 操作码 | 助记符 | Gas | 说明 |
|--------|--------|-----|------|
| `0x50` | `POP` | 2 | 弹出栈顶元素 |
| `0x60`~`0x7F` | `PUSH1`~`PUSH32` | 3 | 压入 1~32 字节的值 |
| `0x80`~`0x8F` | `DUP1`~`DUP16` | 3 | 复制栈中第 1~16 个元素到栈顶 |
| `0x90`~`0x9F` | `SWAP1`~`SWAP16` | 3 | 交换栈顶与第 2~17 个元素 |

### 算术运算

| 操作码 | 助记符 | Gas | 说明 |
|--------|--------|-----|------|
| `0x01` | `ADD` | 3 | 加法 |
| `0x02` | `MUL` | 5 | 乘法 |
| `0x03` | `SUB` | 3 | 减法 |
| `0x04` | `DIV` | 5 | 无符号除法 |
| `0x05` | `SDIV` | 5 | 有符号除法 |
| `0x06` | `MOD` | 5 | 取模 |
| `0x0A` | `EXP` | 10+ | 指数运算 |
| `0x0B` | `SIGNEXTEND` | 5 | 符号扩展 |

### 比较与位运算

| 操作码 | 助记符 | Gas | 说明 |
|--------|--------|-----|------|
| `0x10` | `LT` | 3 | 小于比较 |
| `0x11` | `GT` | 3 | 大于比较 |
| `0x14` | `EQ` | 3 | 相等比较 |
| `0x15` | `ISZERO` | 3 | 是否为零 |
| `0x16` | `AND` | 3 | 按位与 |
| `0x17` | `OR` | 3 | 按位或 |
| `0x18` | `XOR` | 3 | 按位异或 |
| `0x19` | `NOT` | 3 | 按位取反 |
| `0x1A` | `BYTE` | 3 | 取指定字节 |
| `0x1B` | `SHL` | 3 | 左移 |
| `0x1C` | `SHR` | 3 | 逻辑右移 |
| `0x1D` | `SAR` | 3 | 算术右移 |

### 内存操作

| 操作码 | 助记符 | Gas | 说明 |
|--------|--------|-----|------|
| `0x51` | `MLOAD` | 3+ | 从内存加载 32 字节 |
| `0x52` | `MSTORE` | 3+ | 向内存写入 32 字节 |
| `0x53` | `MSTORE8` | 3+ | 向内存写入 1 字节 |
| `0x59` | `MSIZE` | 2 | 当前已分配内存大小 |

### 存储操作

| 操作码 | 助记符 | Gas | 说明 |
|--------|--------|-----|------|
| `0x54` | `SLOAD` | 2100 (cold) / 100 (warm) | 从 storage 加载 |
| `0x55` | `SSTORE` | 2900~20000 | 向 storage 写入 |
| `0x5C` | `TLOAD` | 100 | 从瞬态存储加载（EIP-1153） |
| `0x5D` | `TSTORE` | 100 | 向瞬态存储写入（EIP-1153） |

### 流程控制

| 操作码 | 助记符 | Gas | 说明 |
|--------|--------|-----|------|
| `0x56` | `JUMP` | 8 | 无条件跳转 |
| `0x57` | `JUMPI` | 10 | 条件跳转 |
| `0x5B` | `JUMPDEST` | 1 | 标记有效跳转目标 |
| `0x00` | `STOP` | 0 | 停止执行 |
| `0xFD` | `REVERT` | 0+ | 回滚并返回数据 |
| `0xFE` | `INVALID` | 所有 gas | 非法指令（消耗所有 gas） |
| `0xF3` | `RETURN` | 0+ | 返回数据并停止 |

### 环境信息

| 操作码 | 助记符 | Gas | 说明 |
|--------|--------|-----|------|
| `0x30` | `ADDRESS` | 2 | 当前合约地址 |
| `0x31` | `BALANCE` | 2600 (cold) / 100 (warm) | 查询地址余额 |
| `0x32` | `ORIGIN` | 2 | 交易发起者（`tx.origin`） |
| `0x33` | `CALLER` | 2 | 调用者（`msg.sender`） |
| `0x34` | `CALLVALUE` | 2 | 附带的 ETH（`msg.value`） |
| `0x35` | `CALLDATALOAD` | 3 | 加载 calldata |
| `0x36` | `CALLDATASIZE` | 2 | calldata 长度 |
| `0x37` | `CALLDATACOPY` | 3+ | 复制 calldata 到内存 |
| `0x3A` | `GASPRICE` | 2 | 当前 gas 价格 |
| `0x5A` | `GAS` | 2 | 剩余 gas |

### 区块信息

| 操作码 | 助记符 | Gas | 说明 |
|--------|--------|-----|------|
| `0x40` | `BLOCKHASH` | 20 | 获取区块哈希 |
| `0x41` | `COINBASE` | 2 | 矿工/验证者地址 |
| `0x42` | `TIMESTAMP` | 2 | 区块时间戳 |
| `0x43` | `NUMBER` | 2 | 区块号 |
| `0x44` | `PREVRANDAO` | 2 | 前一区块的随机值（原 `DIFFICULTY`） |
| `0x45` | `GASLIMIT` | 2 | 区块 gas 上限 |
| `0x46` | `CHAINID` | 2 | 链 ID |
| `0x48` | `BASEFEE` | 2 | 基础费（EIP-1559） |

### 调用相关

| 操作码 | 助记符 | Gas | 说明 |
|--------|--------|-----|------|
| `0xF1` | `CALL` | 2600+ | 调用外部合约 |
| `0xF4` | `DELEGATECALL` | 2600+ | 委托调用（使用调用者的上下文） |
| `0xFA` | `STATICCALL` | 2600+ | 静态调用（禁止状态修改） |
| `0xF0` | `CREATE` | 32000+ | 创建合约 |
| `0xF5` | `CREATE2` | 32000+ | 用盐值创建合约（地址可预测） |

### 日志操作

| 操作码 | 助记符 | Gas | 说明 |
|--------|--------|-----|------|
| `0xA0` | `LOG0` | 375+ | 无主题日志 |
| `0xA1` | `LOG1` | 750+ | 1 个主题日志 |
| `0xA2` | `LOG2` | 1125+ | 2 个主题日志 |
| `0xA3` | `LOG3` | 1500+ | 3 个主题日志 |
| `0xA4` | `LOG4` | 1875+ | 4 个主题日志 |

### 哈希

| 操作码 | 助记符 | Gas | 说明 |
|--------|--------|-----|------|
| `0x20` | `KECCAK256` | 30+ | Keccak-256 哈希 |

---

## 附录 E：ERC 标准速查

| 标准 | 名称 | 用途 | 核心函数/接口 |
|------|------|------|--------------|
| **ERC-20** | 同质化代币 | 最基础的代币标准，适用于货币、积分等可互换资产 | `totalSupply()` `balanceOf(address)` `transfer(address,uint256)` `approve(address,uint256)` `transferFrom(address,address,uint256)` `allowance(address,address)` |
| **ERC-721** | 非同质化代币 (NFT) | 每个代币唯一，适用于数字艺术、游戏物品、身份凭证 | `balanceOf(address)` `ownerOf(uint256)` `safeTransferFrom(...)` `approve(address,uint256)` `setApprovalForAll(address,bool)` `getApproved(uint256)` |
| **ERC-1155** | 多代币标准 | 单合约管理多种代币类型（同质化 + 非同质化），节省部署成本 | `balanceOf(address,uint256)` `balanceOfBatch(...)` `safeTransferFrom(...)` `safeBatchTransferFrom(...)` `setApprovalForAll(address,bool)` |
| **ERC-4626** | 代币化金库 | DeFi 收益聚合器标准接口，统一存取款操作 | `deposit(uint256,address)` `withdraw(uint256,address,address)` `mint(uint256,address)` `redeem(uint256,address,address)` `totalAssets()` `convertToShares(uint256)` `convertToAssets(uint256)` |
| **ERC-2612** | Permit（链下授权） | 通过签名实现无 gas 授权，消除 `approve` + `transferFrom` 两步交互 | `permit(address,address,uint256,uint256,uint8,bytes32,bytes32)` `nonces(address)` `DOMAIN_SEPARATOR()` |
| **ERC-165** | 接口检测 | 标准化查询合约是否实现某接口 | `supportsInterface(bytes4)` — 返回 `true` 表示支持该接口 |

### 常用 ERC 标准关系图

```
ERC-165 (接口检测)
  ├── ERC-721 (必须实现 ERC-165)
  │     └── ERC-721Enumerable / ERC-721Metadata (可选扩展)
  ├── ERC-1155 (必须实现 ERC-165)
  └── ERC-4626 (继承 ERC-20)

ERC-20
  ├── ERC-4626 (代币化金库，扩展 ERC-20)
  └── ERC-2612 (Permit，扩展 ERC-20)
```

---

## 附录 F：社区与贡献

Solidity 是一个开源项目，欢迎社区参与贡献。以下是参与方式的简要指南。

### 参与方式

| 类型 | 说明 | 入口 |
|------|------|------|
| 报告问题 | 提交 Bug 报告时请附上 Solidity 版本、源代码、操作系统和复现步骤 | [GitHub Issues](https://github.com/ethereum/solidity/issues) |
| 修复 Bug | 从 `good first issue` 标签开始，适合新贡献者 | [Good First Issues](https://github.com/ethereum/solidity/labels/good%20first%20issue) |
| 改进文档 | 修正错误、补充说明、改进示例 | [Solidity Docs Repo](https://github.com/ethereum/solidity) |
| 翻译文档 | 将文档翻译为更多语言 | [solidity-docs](https://github.com/solidity-docs) |
| 语言设计 | 提出新特性或改进建议 | [Solidity Forum](https://forum.soliditylang.org/) |
| 回答问题 | 在社区帮助其他开发者 | [Ethereum StackExchange](https://ethereum.stackexchange.com/) |

### 提交 Pull Request 流程

1. **Fork** `develop` 分支
2. 在你的分支上进行修改
3. commit message 描述**为什么**改（不仅仅是改了什么）
4. 需要同步上游时使用 `git rebase`（不要用 `git merge`）
5. 新功能必须在 `test/` 下添加测试用例
6. 更新 `Changelog.md`
7. 遵循项目的 [Coding Style](https://github.com/ethereum/solidity/blob/develop/CODING_STYLE.md)
8. 提交前检查 [Review Checklist](https://github.com/ethereum/solidity/blob/develop/ReviewChecklist.md)

### 团队会议

Solidity 团队每周三 15:00 CET/CEST 举行公开电话会议，可通过 [Jitsi](https://meet.solidity.org) 参加。任何人都可以在议程中添加讨论话题。

---

> **系列导航**：[返回第一章 — 区块链与智能合约基础](./ch01-blockchain-smart-contracts.md)

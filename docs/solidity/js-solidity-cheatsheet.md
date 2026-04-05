# JS/TS 到 Solidity 核心速查表 (Cheatsheet)

这份速查表面向熟悉 JavaScript / TypeScript 的前端或全栈开发者，帮助你快速建立 Solidity 的核心概念映射。Solidity 是运行在以太坊虚拟机 (EVM) 上的智能合约语言——代码一旦部署不可修改，每一行执行都要花费真金白银 (Gas)。这与 JS 的"随时热更新"心智截然不同，请在阅读时牢记这一核心差异。

---

## 1. 变量与类型

| JS/TS 代码 | Solidity 等效代码 | 心智模型差异 |
| --- | --- | --- |
| `const x = 5;` | `uint256 x = 5;` | Solidity 必须显式声明类型。`uint256` 是最常用的无符号整数，范围 0 ~ 2²⁵⁶-1。 |
| `let y = 6;` | `uint256 y = 6;`（状态变量默认可修改） | 合约级变量默认持久化到链上存储 (Storage)。可加 `constant` 或 `immutable` 修饰为不可变。 |
| `const flag = true;` | `bool flag = true;` | 完全一致的布尔类型。 |
| `let addr = "0x...";` | `address addr = 0x...;` | `address` 是 Solidity 原生类型 (20 字节)，自带 `.balance`、`.transfer()` 等方法。 |
| `let s = "hello";` | `string memory s = "hello";` | 字符串在 Solidity 中是动态字节数组的语法糖，无法按索引取字符、无 `.length`（需转 `bytes`），Gas 开销极高。 |
| `Number` / `3.14` | **不存在浮点数！** | Solidity 没有 `float`/`double`。通常用整数 + 精度倍数模拟（如 `1e18` 表示 1.0）。 |
| `null` / `undefined` | **不存在。** 所有类型有默认零值 | `uint → 0`，`bool → false`，`address → 0x0`，`string → ""`。必须自行检查零值判断"是否已设置"。 |
| `BigInt(123n)` | `uint256` / `int256` | JS 的 `BigInt` 对应 Solidity 的原生整数，256 位是默认宽度。也可用 `uint8`~`uint256` 按需选择。 |
| `new Map()` | `mapping(KeyType => ValueType)` | `mapping` 无法遍历、无 `.length`、无法获取所有 key。底层是 hash 表，读写 O(1)。 |
| `let arr = [1, 2, 3];` | `uint256[] memory arr = new uint256[](3);` | 动态数组需 `memory`/`storage` 关键字。定长数组：`uint256[3]`。Storage 数组有 `.push()` 方法。 |
| `interface User { name: string; age: number }` | `struct User { string name; uint256 age; }` | 结构体是值类型的组合。在函数间传递时需标注 `memory`/`calldata`/`storage`。 |
| `enum Status { Active, Inactive }` | `enum Status { Active, Inactive }` | 语法几乎一致。底层用 `uint8` 表示，从 0 开始递增。 |

> **关键提醒：** Solidity 的变量根据声明位置分为 **状态变量**（合约级，永久上链）和 **局部变量**（函数内，临时存在）。状态变量的每次写入都消耗大量 Gas。

---

## 2. 函数与控制流

| JS/TS 代码 | Solidity 等效代码 | 心智模型差异 |
| --- | --- | --- |
| `function add(a, b) { return a + b; }` | `function add(uint256 a, uint256 b) public pure returns (uint256) { return a + b; }` | 每个函数必须声明 **可见性**（`public`/`external`/`internal`/`private`）和 **状态可变性**（`view`/`pure`/`payable`）。 |
| `const add = (a, b) => a + b;` | 无等效语法（但存在函数类型） | Solidity 没有匿名函数/箭头函数。可以声明 `function(uint) external returns (uint)` 类型的变量来存储函数引用。 |
| `async function fetch() { await ... }` | **不存在。** EVM 完全同步执行 | 区块链上没有异步概念。每笔交易从头到尾原子执行，要么全部成功要么全部回滚。 |
| `try { riskyCall(); } catch(e) { ... }` | `try externalContract.riskyCall() returns (uint v) { ... } catch { ... }` | `try/catch` **只能用于外部合约调用和合约创建**，不能包裹内部函数调用。 |
| `if (x > 0) { ... } else { ... }` | `if (x > 0) { ... } else { ... }` | 语法完全一致。注意：条件必须是严格 `bool`，不会像 JS 那样做 truthy/falsy 隐式转换。 |
| `for (let i = 0; i < n; i++) { ... }` | `for (uint256 i = 0; i < n; i++) { ... }` | 语法一致，但链上循环必须警惕 **Gas 上限**——大循环可能导致交易失败。 |
| `throw new Error("fail");` | `revert("fail");` 或 `revert CustomError();` | Solidity 0.8+ 推荐自定义错误 `error InsufficientBalance(uint256 available, uint256 required);` 配合 `revert`，更省 Gas。 |
| `return value;` | `return (val1, val2);` | Solidity 支持多返回值！调用端可用 `(uint a, uint b) = foo();` 解构接收。 |

> **可见性速记：**
> - `public` — 内外部均可调用，自动生成 getter（状态变量）
> - `external` — 仅外部调用（`this.foo()` 或其他合约），参数用 `calldata` 更省 Gas
> - `internal` — 仅当前合约及子合约
> - `private` — 仅当前合约

---

## 3. 面向对象与合约

| JS/TS 代码 | Solidity 等效代码 | 心智模型差异 |
| --- | --- | --- |
| `class Token { ... }` | `contract Token { ... }` | `contract` ≈ 类 + 部署实例。每个合约在链上有唯一地址，自带余额。 |
| `constructor(name) { this.name = name; }` | `constructor(string memory _name) { name = _name; }` | 构造函数只在部署时执行一次，之后再也不会运行。 |
| `class ERC20 extends Token { ... }` | `contract ERC20 is Token { ... }` | 支持多重继承：`contract C is A, B { ... }`。继承顺序采用 **C3 线性化** 算法解决菱形继承问题。 |
| `interface IERC20 { transfer(...): boolean }` | `interface IERC20 { function transfer(...) external returns (bool); }` | Solidity 接口更严格：不能有状态变量、构造函数、实现代码。函数必须是 `external`。 |
| `abstract class Base { abstract foo(); }` | `abstract contract Base { function foo() virtual public; }` | 至少有一个未实现函数的合约必须标记 `abstract`，不能被部署。 |
| `@log decorator` | `modifier onlyOwner() { require(msg.sender == owner); _; }` | `modifier` 是 Solidity 最强大的模式——在函数执行前/后插入检查逻辑。`_;` 表示"执行被修饰的函数体"。 |
| `static utils() { ... }` | `library MathUtils { function add(uint a, uint b) internal pure returns (uint) { return a + b; } }` | `library` 是无状态工具集合，可通过 `using MathUtils for uint256;` 附加到类型上，实现类似扩展方法的效果。 |
| `import { foo } from './module';` | `import { Symbol } from "./file.sol";` | 语法类似 ES6，但导入的是 Solidity 文件。也支持 `import "./file.sol";` 导入整个文件的所有符号。 |
| `private` / `public` (TS) | `public` / `external` / `internal` / `private` | 四级可见性。注意：`private` 只阻止其他合约在代码层面读取，**链上数据仍然对所有人可见**（没有真正的隐私）。 |

> **继承速记：** 子合约用 `override` 覆盖父合约的 `virtual` 函数。多继承时最右边的父合约优先级最高：`contract C is A, B` 中 B 的方法优先于 A。

---

## 4. 错误处理

| JS/TS 代码 | Solidity 等效代码 | 心智模型差异 |
| --- | --- | --- |
| `throw new Error("msg");` | `revert("msg");` 或 `revert CustomError();` | `revert` 回滚整个交易的所有状态变更，已消耗的 Gas 不退还。自定义错误比字符串更省 Gas。 |
| `try { ext() } catch(e) { ... }` | `try ext.foo() returns (uint v) { ... } catch Error(string memory reason) { ... } catch (bytes memory data) { ... }` | 只能 try/catch **外部调用**。可分别捕获 `Error`（revert 字符串）、`Panic`（assert 失败）和低级错误。 |
| `console.assert(x > 0)` | `assert(x > 0);` | `assert` 用于检查 **不应该发生** 的内部错误（如不变量被破坏），触发 `Panic` 错误码。生产中不应作为输入验证。 |
| `if (!valid) throw new Error();` | `require(valid, "Invalid input");` | `require` 是最常用的守卫：验证输入、权限、前置条件。失败时回滚并返回错误信息。 |

> **三种错误机制对比：**
>
> ```solidity
> // require — 输入验证、前置条件检查（最常用）
> require(msg.sender == owner, "Not owner");
>
> // revert — 复杂条件判断 + 自定义错误（最省 Gas）
> error Unauthorized(address caller);
> if (msg.sender != owner) revert Unauthorized(msg.sender);
>
> // assert — 内部不变量检查（不应在正常流程触发）
> assert(totalSupply == sumOfBalances);
> ```

---

## 5. 数据与存储

| JS/TS 代码 | Solidity 等效代码 | 心智模型差异 |
| --- | --- | --- |
| 内存变量 (RAM) | `memory` — 函数执行期间临时存在 | 函数结束后自动销毁，Gas 开销相对较低。 |
| 数据库持久化存储 | `storage` — 永久写入区块链 | 每个 storage slot（32 字节）首次写入消耗 ~20,000 Gas（约 $0.5-5 取决于 Gas 价格），是最昂贵的操作。 |
| 函数参数（只读） | `calldata` — 只读的函数输入数据 | 比 `memory` 更省 Gas，适用于 `external` 函数的复杂类型参数（数组、结构体、字符串）。 |
| `JSON.stringify(obj)` | `abi.encode(...)` / `abi.encodePacked(...)` | ABI 编码是 Solidity 的序列化方式。`encodePacked` 更紧凑但可能碰撞，`encode` 更安全。 |
| `JSON.parse(data)` | `abi.decode(data, (uint256, address))` | 反序列化需要显式指定目标类型元组。 |
| `crypto.createHash('sha256')` | `keccak256(abi.encodePacked(...))` | EVM 原生哈希函数是 Keccak-256（注意：不是标准 SHA-3）。也支持 `sha256` 和 `ripemd160`。 |
| `eventEmitter.emit('Transfer', ...)` | `emit Transfer(from, to, amount);` | 事件写入交易日志（Log），不占 storage，Gas 便宜。前端通过 `eth_getLogs` 订阅监听。 |
| `eventEmitter.on('Transfer', cb)` | 前端：`contract.on("Transfer", callback)` | 链上合约无法监听事件，事件只供链外 (off-chain) 消费。 |

> **存储位置速记：**
>
> ```solidity
> contract Example {
>     uint256[] public data;           // storage — 永久上链
>
>     function process(
>         uint256[] calldata input     // calldata — 只读输入，最省 Gas
>     ) external {
>         uint256[] memory temp = new uint256[](10); // memory — 临时
>         data.push(input[0]);         // 从 calldata 复制到 storage
>     }
> }
> ```

---

## 6. 开发工具链映射

| JS/TS 概念 | Solidity 对应概念 | 心智模型差异 |
| --- | --- | --- |
| `npm` / `yarn` / `pnpm` | **Hardhat** (JS 生态) / **Foundry** (Rust 生态) | Hardhat 对 JS 开发者友好；Foundry 编译更快、用 Solidity 写测试。两者可共存。 |
| `package.json` | `hardhat.config.js` / `foundry.toml` | 项目配置、网络设置、编译器版本、插件管理。 |
| `node_modules/` | `node_modules/@openzeppelin/contracts` / `lib/` (Foundry) | OpenZeppelin 是最主流的合约库（ERC20、ERC721、访问控制等），类似于 lodash 在 JS 中的地位。 |
| `ESLint` | **Slither** (静态分析) / **Solhint** (Linter) | Slither 能检测重入攻击、未检查返回值等安全漏洞。Solhint 检查代码风格。 |
| `Jest` / `Mocha` | `npx hardhat test` / `forge test` | Hardhat 用 JS/TS 写测试（Chai 断言库）；Foundry 用 Solidity 写测试（`assertEq` 等内置断言）。 |
| `webpack` / `rollup` | `solc` (Solidity 编译器) | `solc` 将 `.sol` 编译为 ABI（接口描述）+ Bytecode（部署到 EVM 的字节码）。 |
| `npm run dev` (热更新) | **不存在**，但可用 Hardhat 本地节点 | `npx hardhat node` 启动本地链用于开发调试；`forge script` 可以模拟部署。部署到主网后代码**不可更改**。 |
| `npm publish` | 部署合约到链上 | `npx hardhat run scripts/deploy.js --network mainnet` 或 `forge create`。部署即"发布"，不可撤回。 |
| `.env` (环境变量) | `.env` (私钥、RPC URL) | **永远不要**把私钥提交到 Git！使用 `dotenv` 或 Foundry 的 `--private-key` 参数。 |

---

## 7. 前端 DApp 开发视角

前端与智能合约的交互本质是 **RPC 调用**——通过 JSON-RPC 协议与以太坊节点通信。以下展示使用 **ethers.js v6** 和 **viem** 的常见模式。

### 连接钱包

```typescript
// ethers.js v6
import { BrowserProvider } from "ethers";
const provider = new BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
console.log("地址:", await signer.getAddress());

// viem + wagmi (更现代的选择)
import { createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";
const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
});
const [address] = await client.getAddresses();
```

### 读取合约数据 (免费，不消耗 Gas)

```typescript
// ethers.js v6
import { Contract } from "ethers";
const token = new Contract(tokenAddress, abi, provider);
const balance = await token.balanceOf(userAddress); // 只读调用
console.log("余额:", balance.toString());

// viem
import { createPublicClient, http } from "viem";
const publicClient = createPublicClient({ chain: mainnet, transport: http() });
const balance = await publicClient.readContract({
  address: tokenAddress,
  abi: tokenAbi,
  functionName: "balanceOf",
  args: [userAddress],
});
```

### 写入合约 (发送交易，消耗 Gas)

```typescript
// ethers.js v6 — 需要 signer
const tokenWithSigner = new Contract(tokenAddress, abi, signer);
const tx = await tokenWithSigner.transfer(toAddress, amount);
const receipt = await tx.wait(); // 等待交易被矿工确认
console.log("交易哈希:", receipt.hash);

// viem — 需要 walletClient
const hash = await walletClient.writeContract({
  address: tokenAddress,
  abi: tokenAbi,
  functionName: "transfer",
  args: [toAddress, amount],
});
const receipt = await publicClient.waitForTransactionReceipt({ hash });
```

### 监听合约事件

```typescript
// ethers.js v6
token.on("Transfer", (from, to, amount, event) => {
  console.log(`${from} → ${to}: ${amount}`);
});

// viem
publicClient.watchContractEvent({
  address: tokenAddress,
  abi: tokenAbi,
  eventName: "Transfer",
  onLogs: (logs) => {
    logs.forEach((log) => console.log(log.args));
  },
});
```

> **核心心智模型：** 读操作 (`view`/`pure` 函数) = 免费的本地计算，毫秒级响应；写操作 = 发送交易上链，需要用户签名 + 支付 Gas + 等待区块确认（通常 12-15 秒）。前端需要处理"待确认"的中间状态。

---

## 8. 避坑核心准则

1. **没有浮点数：** Solidity 不支持 `float`/`double`。处理代币金额时使用 `uint256` 加精度（如 18 位小数：`1 ether == 1e18 wei`）。除法会截断小数——先乘后除以避免精度丢失：`(a * 1e18) / b` 而非 `(a / b) * 1e18`。

2. **Gas 就是钱：** 每一行代码执行都消耗 Gas，Gas × Gas Price = 真实费用（ETH）。合约内的 `for` 循环没有上限检查，如果遍历大数组可能超过区块 Gas Limit 导致交易永远无法成功（DoS 风险）。能用 `mapping` 的场景绝不用数组遍历。

3. **`private` 不是真的私有：** `private` 只是让其他合约的代码无法调用该变量/函数。但链上所有 Storage 数据都是公开可读的——任何人都能通过 `eth_getStorageAt` 读取"private"变量的值。**不要在链上存储任何敏感信息（密码、密钥等）。**

4. **代码部署后不可更改：** 合约一旦部署，字节码永久写入区块链，无法修改。如果发现 bug，唯一的办法是部署新合约并迁移状态。生产合约部署前务必做：单元测试 → 审计 → 测试网验证 → 主网部署。如需可升级性，提前采用代理模式 (Proxy Pattern)。

5. **没有 `undefined`/`null`：** 所有类型都有默认值（`uint → 0`，`bool → false`，`address → 0x0000...`）。这意味着你无法区分"用户传了 0"和"变量未初始化"——需要额外的布尔标志位或哨兵值来追踪状态。

6. **整数溢出已有保护（0.8.0+）：** Solidity 0.8.0 起默认启用溢出检查（`uint8(255) + 1` 会 revert 而非默默回绕到 0）。如果确实需要回绕行为，使用 `unchecked { ... }` 块。0.8.0 以下版本必须使用 SafeMath 库。

7. **Storage 极其昂贵：** 写入一个 256 位 storage slot 首次消耗约 20,000 Gas，修改消耗 5,000 Gas。最佳实践：将频繁访问的 storage 变量缓存到 memory 局部变量，计算完成后一次性写回。能用 `event` 记录的数据就不要存 `storage`。

8. **外部调用有重入风险：** 调用外部合约时，控制权交给对方——对方可以在你的函数执行到一半时回调你的合约（重入攻击）。防御方式：① 遵循 **Checks-Effects-Interactions** 模式（先检查 → 再修改状态 → 最后外部调用）；② 使用 OpenZeppelin 的 `ReentrancyGuard`。

---

> **写给 JS 开发者的一句话总结：** 在 JS 里你的代码运行在"自家服务器"上，出了 bug 可以热更新。在 Solidity 里你的代码运行在"全世界共享的计算机"上，部署即永久、执行即扣费、漏洞即资产损失。**像写金融合同一样写智能合约，而不是像写 Web 页面。**

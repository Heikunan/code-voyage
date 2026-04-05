# JS/Python 速查

> 给已经熟悉 JavaScript / TypeScript 的开发者准备的 Python 迁移速查表。

## 语法对照

| JS/TS | Python | 说明 |
| --- | --- | --- |
| `console.log(x)` | `print(x)` | 控制台输出 |
| `===` | `==` | Python 没有 `===` |
| `!==` | `!=` | 不等于 |
| `null` | `None` | 空值 |
| `true / false` | `True / False` | 布尔值首字母大写 |
| `Array` | `list` | 可变序列 |
| `Object` | `dict` | 键值映射 |
| `Set` | `set` | 集合 |
| `function` | `def` | 函数定义 |
| `async/await` | `async def` / `await` | 异步写法相似 |

## 工具链对照

| JS/TS 世界 | Python 世界 |
| --- | --- |
| `node` | `python` / `python3` |
| `npm` / `pnpm` | `pip` |
| `package.json` | `pyproject.toml` / `requirements.txt` |
| `nvm` | `pyenv` |
| `node_modules` | `venv` |
| `Jest` / `Vitest` | `pytest` |
| `Express` / `NestJS` | `FastAPI` / `Flask` |

## 常见迁移提醒

- Python 用缩进定义代码块，不用花括号。
- Python 变量默认就是动态类型，但可以用类型注解提升可读性。
- 不要把 `dict` 完全等同于 JS 普通对象；它更像专门的哈希映射结构。
- Python 的标准库覆盖面很大，很多需求先查标准库再找第三方包。

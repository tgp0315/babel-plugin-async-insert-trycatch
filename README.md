## babel-plugin-await-insert-trycatch

一个自动给 async/await 函数添加 try/catch 的 babel 插件

## 调试方式

全局安装 @babel/cli @bable/core 

执行 npm run test

### 使用说明

babel.config.js 配置如下

```javascript
module.exports = {
  plugins: [
    [
      require('babel-plugin-await-insert-trycatch'),
      {
        exclude: ['dist'], // 默认值 ['node_modules']
        include: [], // 默认值 []
        customLog: '' // 默认值 'Error'
      }
    ]
  ]
};
```

### demo

#### 原始代码：

```javascript
const func = async function () {
  await asyncFunc();
};
// 箭头函数
const func2 = async () => {
  await asyncFunc();
};

const func3 = function () {
  console.log();
};

class Test {
  async aa() {
    const b = await get();
  }

  bb() {
    console.log(111111);
  }
}

```

#### 使用插件转化后的代码：

```javascript
const func = async function () {
  try {
    await asyncFunc();
  } catch (e) {
    console.log("\nfilePath: D:\\desktop\\babel-plugin-async-insert-trycatch\\src\\test.js\nfuncName: func\nError:", e);
  }
};
// 箭头函数
const func2 = async () => {
  try {
    await asyncFunc();
  } catch (e) {
    console.log("\nfilePath: D:\\desktop\\babel-plugin-async-insert-trycatch\\src\\test.js\nfuncName: func2\nError:", e);
  }
};
const func3 = function () {
  console.log();
};
class Test {
  async aa() {
    try {
      const b = await get();
    } catch (e) {
      console.log("\nfilePath: D:\\desktop\\babel-plugin-async-insert-trycatch\\src\\test.js\nfuncName: get\nError:", e);
    }
  }
  bb() {
    console.log(111111);
  }
}
```

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
      console.log("\nfilePath: D:\\desktop\\babel-plugin-async-insert-trycatch\\src\\test.js\nfuncName: aa\nError:", e);
    }
  }
  bb() {
    console.log(111111);
  }
}
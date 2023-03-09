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

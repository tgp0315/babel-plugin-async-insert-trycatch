const template = require('babel-template')
// const parser = require("@babel/parser")
// const traverse = require("@babel/traverse").default
// const t = require("@babel/types")
// const generator = require('@babel/generator').default
const {
  tryTemplate,
  catchConsole,
  mergeOptions,
  matchesFile,
  isAsyncFuncNode
} = require('./util')

// module.exports = function({types: t}) {
//   return {
//     name: 'babel-plugin-async-insert-trycatch',
//     visitor: {
//       AwaitExpression(path) {
//         console.log(path)
//       }
//     }
//   }
// }
// const code = `
//   // 函数表达式
//   const func = async function () {
//       await asyncFunc()
//   }
//   // 箭头函数
//   const func2 = async () => {
//       await asyncFunc()
//   }

//   const func3 = function () {
//     console.log()
//   }

//   class Test {
//     async aa() {
//       const b = await get()
//     }

//     bb() {
//       console.log(111111)
//     }
//   }
// `

// const ast = parser.parse(code)
module.exports = function ({types: t}) {
  return {
    name: 'babel-plugin-async-insert-trycatch',
    visitor: {
      AwaitExpression(path) {
        let options = {}
        if (this.opts && Object.prototype.toString.call(this.opts) == '[Object object]') {
          // 合并插件的选项
          options = mergeOptions(this.opts)
        } else {
          options = mergeOptions({})
        }
        // 判断父路径中是否
        if (path.findParent(p => p.isTryStatement())) {
          return false
        }
        // 获取编译目标文件的路径，如：E:\myapp\src\App.vue
        const filePath = this.filename || (this.file && this.file.opts && this.file.opts.filename) || 'unknown';
    
        // 在排除列表的文件不编译
        if (matchesFile(options.exclude, filePath)) {
          return;
        }
        // 如果设置了include，只编译include中的文件
        if (options.include.length && !matchesFile(options.include, filePath)) {
          return;
        }
        // 获取当前的await节点
        const node = path.node
        // 在父路径节点中查找声明 async 函数的节点
        // async 函数分为4种情况：函数声明 || 箭头函数 || 函数表达式 || 对象的方法 || 类函数
        const asyncPath = path.findParent((p) => isAsyncFuncNode(p.node, t));
        // 获取await代码块
        const blockParent = path.findParent(p => t.isBlockStatement(p.node) && isAsyncFuncNode(p.parentPath.node, t))
        // 获取async的方法名
        let asyncName = ''
        let type = asyncPath.node.type
        switch (type) {
          // 1️⃣函数表达式
          // 情况1：普通函数，如const func = async function () {}
          // 情况2：箭头函数，如const func = async () => {}
          case 'FunctionExpression':
          case 'ArrowFunctionExpression':
            // // 使用path.getSibling(index)来获得同级的id路径
            let identifier = asyncPath.getSibling('id');
            // 获取func方法名
            asyncName = identifier && identifier.node ? identifier.node.name : '';
            break;
            // 2️⃣函数声明，如async function fn2() {}
          case 'FunctionDeclaration':
            asyncName = (asyncPath.node.id && asyncPath.node.id.name) || '';
            break;
    
            // 3️⃣async函数作为对象的方法，如vue项目中，在methods中定义的方法: methods: { async func() {} }
          case 'ObjectMethod':
          case 'ClassMethod':
            asyncName = asyncPath.node.key.name || '';
            break;
        }
        // 若asyncName不存在，通过argument.callee获取当前执行函数的name
        let funcName = asyncName || (node.argument.callee && node.argument.callee.name) || '';
        const temp = template(tryTemplate);
        // 给模版增加key，添加console.log打印信息
        let tempArgumentObj = {
          // t.stringLiteral创建字符串字面量
          CatchError: t.stringLiteral(catchConsole(filePath, funcName, options.customLog))
        };
        // 通过temp创建try语句
        let tryNode = temp(tempArgumentObj);
        // 获取async节点的函数体
        let body = blockParent.node.body;
        // 将父节点原来的函数体放到try语句中
        tryNode.block.body.push(...body);
        // 将父节点的内容替换成新创建的try语句
        blockParent.replaceWithMultiple([tryNode]);
      }
    }
  }
}

// console.log(generator(ast).code)
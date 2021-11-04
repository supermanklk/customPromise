# customPromise
手撕promise


20211104
------------
type: 手撕第一版本 0.0.1 start

name: CustomPromise

实现的功能:

1、CustomPromise构造函数立即执行、定义 status、data、callbacks、resolve、reject、executor(resolve, reject)

2、原型对象上then方法（3种情况的判断 pending resolved rejected ）

3、函数内resolve方法

未实现的功能:
Promise.all、Promise.race、Promise.reject、Promise.resolve、实现catch方法




```javascript

new Promise((resolve, reject) => {
  resolve(1)

}).then(res => {
  console.log(res)
}).then(res => {
  console.log(res)
})

// 答案
1 
undefined


new Promise((resolve, reject) => {
  resolve(1)

}).then(res => {
  return new Promise((resolve, reject) => {
    resolve(100)
  })
}).then(res => {
  console.log(res)
})
// 答案
100



```

type: 手撕第一版本 0.0.1 end

20211104
------------

type: 手撕第一版本 0.0.2 start

name: CustomPromise

实现的功能:

1、CustomPromise构造函数立即执行、定义 status、data、callbacks、resolve、reject、executor(resolve, reject)

2、原型对象上then方法（3种情况的判断 pending resolved rejected ）

3、函数内resolve方法

未实现的功能:
Promise.all、Promise.race、Promise.reject、Promise.resolve、实现catch方法

将冗余的代码封装承方法
```
      function handle(callback) {
        try {
          let result = callback(self.data)
          if(result instanceof CustomPromise) {
            result.then( value => {resolve(value)}, reason => {reject(reason)})
          } else {
            resolve(result);
          }
        } catch (e) {
          reject(e)
        }
      }
```



type: 手撕第一版本 0.0.2 end

------------
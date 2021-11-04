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



现在存在的问题:
then的值不能穿透
Ex:
```javascript

.then((res) => {
  return new CustomPromise((resolve, reject) => {
    resolve(res)
  })
}).then(res => {
  console.log(res) // 这里拿不到穿透过来的数据
})

```

type: 手撕第一版本 0.0.1 end

------------
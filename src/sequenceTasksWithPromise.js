(() => {
  // https://blog.csdn.net/feinifi/article/details/105832034
  // 该例子是弥补 Promise.all 不按顺序执行
  console.log('执行了 sequenceTasksWithPromise')

  const createEvent = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('执行了一次 createEvent, time :', new Date().getTime())
        resolve(1)
      }, 1000)
    })
  }
  const tasks = [createEvent, createEvent, createEvent];
  // 第一次 Promise.resolve()，他表示一个动作已经执行完成
  // 开始正式执行
  // 第一 prev.then(() => next()   此刻的 prev == Promise.resolve() 返回的是一个promise对象，执行then ，此刻的 next() == 第一个 createEvent
  // 当第一个createEvent执行成功resolve， prev.then(() => next()， 此刻 prev == 第一个createEvent返回的promise 执行它的then，此刻的 next() == 第二个 createEvent
  // 当第二个createEvent执行成功resolve，prev.then(() => next()， 此刻 prev == 第二个createEvent返回的promise 执行它的then，此刻的 next() == 第三个 createEvent
  // 当第三个createEvent执行成功resolve 循环结束，返回一个promise， 就是 doTasks
  const doTasks = tasks.reduce((prev, next) => prev.then(() => next()), Promise.resolve());

  doTasks.then(res => {
    console.log(res);
  })

})();
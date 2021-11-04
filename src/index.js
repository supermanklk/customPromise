(() => {

  function CustomPromise(executor) {

    // 状态 pending resolved rejected
    // 默认状态是pending状态，只有执行resolve时候 pending >> resolved
    // 默认状态是pending状态，只有执行reject时候 pending >> rejected
    this.status = 'pending';
    var self = this;

    // 存储结果
    this.data = undefined;

    // 存注册的成功，失败的回调函数
    this.callbacks = []


    function resolve(value) {
      if(self.status !== 'pending') {
        return;
      } else {
        // 执行 resolve，改变状态
        self.status = 'resolved';
        self.data = value;
        // 去遍历 callbacks 执行 onResolved
        self.callbacks.forEach((callback) => {
          callback.onResolved(value)
        })
      }
    }

    function reject(value) {

    }

    executor(resolve, reject);
  }


  // 实现then 注册成功，失败的回调函数
  // then 是返回一个全新的promise，状态根据resolve、reject来定
  CustomPromise.prototype.then = function(onResolved, onRejected) {

    let self = this;
    return new CustomPromise((resolve, reject) => {

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

      // 在then的时候我们的promise状态有3种可能
      if(self.status === 'pending') {

        // 如果是等待的时候说明没有执行 resolve，我们要将注册的回调函数存到 callbacks 数组里面
        // 等待resolve的时候去遍历callbacks
        self.callbacks.push({
          onResolved(){
            handle(onResolved)
          },
          onRejected(){
            handle(onRejected)
          }
        })
      } else if(self.status === 'resolved') {
        setTimeout(() => {
            handle(onResolved)
        })
      } else if(self.status === 'rejected') {
        setTimeout(() => {
          handle(onRejected)
        })
      }
    })

  }

  window.CustomPromise = CustomPromise;

  new CustomPromise((resolve, reject) => {
    console.log('执行构造函数');
    setTimeout(() => {
      resolve(100)
    }, 5000)
  }).then(res => {
    console.log(res);
    return new CustomPromise((resolve) => {
      resolve(res)
    })
  }).then(res=> {
    console.log(res)
  })



  // 1、立即执行构造函数内的内容 executor
})();
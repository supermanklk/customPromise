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
      if(self.status !== 'pending') {
        return
      } else {
        self.status = 'rejected';
        self.data = value;
        self.callbacks.forEach(callback => {
          callback.onRejected(value)
        })
      }

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

  CustomPromise.reject = function(reason) {
    return new CustomPromise((resolve, reject) => {
      reject(reason)
    })
  }

  CustomPromise.resolve = function(value) {
    return new CustomPromise((resolve, reject) => {
      if(value instanceof CustomPromise ) {
        value.then((value) => {
          resolve(value)
        }, (reason) => {
          reject(reason)
        })
      } else {
        resolve(value)
      }
    })
  }

  /**
   * 返回一个promise对象，当所有的promise的状态都成功的时候返回的promise的状态才是成功
   * 每个promise的状态都是通过遍历来统计的
   * @param values
   * @returns {CustomPromise}
   */
  CustomPromise.all = function(promises) {
    const values = new Array(promises.length)
    let resolveCount = 0;
    return new CustomPromise((resolve, reject) => {
      promises.forEach((p, index) => {
          // faith：这里有个疑问 这里的 p在没有resolve的时候会不会等待，或者是foreach是同步的 答案：不会等待，全部循环，异步也无所谓，因为 resolveCount 是外部变量。因为从这里看 all执行的promises的不是按循序执行的
          // 这里为什么不是 p.then 的原因是防止传入进来的数组类似 all([p,2,3,p])， 所以需要将类似 2 3 这样的数转换为 promise
          Promise.resolve(p).then((value) => {
            values[index] = value;
            resolveCount++;
            if(resolveCount === promises.length) {
              resolve(values);
            }
          }, (reason) => { // 只要有一个失败，return的promise的结果就是 rejected
            reject(reason);
          })
      })

    })
  }

  CustomPromise.race = function(promises) {
    return new CustomPromise((resolve, reject) => {
      promises.forEach((p, index) => {
        Promise.resolve(p).then((value) => {
          resolve(value); // 只要有一个promise成功就 返回的promise就成功
        }, (reason) => {
          reject(reason);
        })
      })
    })
  }

  CustomPromise.catch = function(onRejected) {
    return CustomPromise.then(undefined, onRejected)
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

})();
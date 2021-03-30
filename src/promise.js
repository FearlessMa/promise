/**
 * Promise 函数 同步版本 异步版本
 *
 * @param {*} executor 方法接收resolve，reject参数，执行函数是同步调用的
 */
export default function Promise(executor) {
  this.promiseState = 'pending';
  this.promiseResult = null;
  this.callbacks = []; // 异步方法存储

  const _this = this;
  // 设置 状态为 fulfilled resolved， 设置结果
  function resolve(data) {
    // 状态只能改变一次
    if (_this.promiseState !== 'pending') return;
    _this.promiseState = 'fulfilled';
    _this.promiseResult = data;
    // 异步执行
    _this.callbacks.forEach((item) => {
      item.onResolved(data);
    });
  }
  function reject(data) {
    // 状态只能改变一次
    if (_this.promiseState !== 'pending') return;
    _this.promiseState = 'rejected';
    _this.promiseResult = data;

    // 异步执行
    _this.callbacks.forEach((item) => {
      item.onRejected(data);
    });
  }
  try {
    // 捕获 executor 函数抛出的错误
    executor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

/**
 * then方法
 * 实现 链式调用then
 * 实现 catch 穿透 与 值传递
 *
 * @param {*} onResolved 成功回调
 * @param {*} onRejected 失败回调
 */
Promise.prototype.then = function (onResolved, onRejected) {
  const _this = this;
  // 值传递
  if (typeof onResolved !== 'function') {
    onResolved = (res) => res;
  }
  // 异常穿透
  if (typeof onRejected !== 'function') {
    onRejected = (reason) => {
      throw reason;
    };
  }
  return new Promise((resolve, reject) => {
    function callback(type) {
      try {
        const result = type(_this.promiseResult);
        // 判断 then的onResolved 返回结果是 promise 还是 普通类型
        if (result instanceof Promise) {
          result.then(
            (v) => {
              resolve(v);
            },
            (r) => {
              reject(r);
            }
          );
        } else {
          resolve(result);
        }
      } catch (e) {
        reject(e);
      }
    }
    // 判断状态是否为完成
    if (this.promiseState === 'fulfilled') {
      callback(onResolved);
    }
    // 失败状态
    if (this.promiseState === 'rejected') {
      callback(onRejected);
    }
    // 异步执行
    if (this.promiseState === 'pending') {
      this.callbacks.push({
        onResolved: function () {
          callback(onResolved);
        },
        onRejected: function () {
          callback(onRejected);
        }
      });
    }
  });
};

// 异常捕获，可以捕获所有then方法异常穿透的错误
Promise.prototype.catch = function (onRejected) {
  return this.then(undefined, onRejected);
};

/**
 *  静态方法 Promise.resolve 返回 Promise 类型
 *  1.非Promise类型 返回Promise类型 状态为fulfilled
 *  2.Promise类型返回的状态 根据传入的Promise决定
 * @param {*} result
 * @returns Promise
 */
Promise.resolve = function (result) {
  return new Promise((resolve, reject) => {
    if (result instanceof Promise) {
      result.then(
        (v) => {
          resolve(v);
        },
        (r) => {
          reject(r);
        }
      );
    } else {
      resolve(result);
    }
  });
};
/**
 * reject 方法所有状态都返回失败结果
 *
 * @param {*} data 参数
 * @returns Promise ，rejected状态
 */
Promise.reject = function (data) {
  return new Promise((resolve, reject) => {
    // throw data;
    reject(data);
  });
};
/**
 * all方法，接收promise数组执行所有promise，每个promise都为fulfilled状态
 * 返回传入数组顺序的promise结果，如果其中一个promise失败则直接返回失败结果
 *
 * @param {*} promiseList promise list
 * @returns 全部成功返回 所有结果，一个失败返回失败结果
 */
Promise.all = function (promiseList) {
  const resultList = [];
  let count = 0;
  return new Promise((resolve, reject) => {
    promiseList.forEach((promise, idx) => {
      promise.then(
        (v) => {
          // 使用idx 不使用push ，异步结果使用push会影响顺序
          resultList[idx] = v;
          // 如果 结果数组长度等于 promiseList 返回所有结果
          if (++count == promiseList.length) {
            resolve(resultList);
          }
        },
        (r) => {
          reject(r);
        }
      );
    });
  });
};

/**
 * race 返回最先执行完毕的promise
 *
 * @param {*} promiseList promise list
 * @returns Promise
 */
Promise.race = function (promiseList) {
  return new Promise((resolve, reject) => {
    promiseList.forEach((promise) => {
      promise.then(
        (v) => {
          resolve(v);
        },
        (r) => {
          reject(r);
        }
      );
    });
  });
};

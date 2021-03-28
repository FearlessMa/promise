/**
 * Promise 函数 同步版本 异步版本
 *
 * @param {*} executor 执行函数是同步调用的
 */
 export default function Promise(executor) {
  this.promiseState = "pending";
  this.promiseResult = null;
  this.callbacks = []; // 异步方法存储

  const _this = this;
  // 设置 状态为 fulfilled resolved， 设置结果
  function resolve(data) {
    // 状态只能改变一次
    if (_this.promiseState !== "pending") return;
    _this.promiseState = "fulfilled";
    _this.promiseResult = data;
    // 异步执行
    _this.callbacks.forEach(item => {
      item.onResolved(data);
    });
  }
  function reject(data) {
    // 状态只能改变一次
    if (_this.promiseState !== "pending") return;
    _this.promiseState = "rejected";
    _this.promiseResult = data;

    // 异步执行
    _this.callbacks.forEach(item => {
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
  if (typeof onResolved !== "function") {
    onResolved = res => res;
  }
  // 异常穿透
  if (typeof onRejected !== "function") {
    onRejected = reason => {
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
            v => {
              resolve(v);
            },
            r => {
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
    if (this.promiseState === "fulfilled") {
      callback(onResolved);
    }
    // 失败状态
    if (this.promiseState === "rejected") {
      callback(onRejected);
    }
    // 异步执行
    if (this.promiseState === "pending") {
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

Promise.prototype.catch = function (onRejected) {
  return this.then(undefined, onRejected);
};

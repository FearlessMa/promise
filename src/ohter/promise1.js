/**
 * Promise 函数 同步执行版本
 *
 * @param {*} excutor 执行函数
 */
export default function Promise(excutor) {
  this.promiseState = "pending";
  this.promiseResult = null;
  const _this = this;
  // 设置 状态为 fulfilled resolved， 设置结果
  function resolve(data) {
    // 状态只能改变一次
    if (_this.promiseState !== "pending") return;
    _this.promiseState = "fulfilled";
    _this.promiseResult = data;
  }
  function reject(data) {
    // 状态只能改变一次
    if (_this.promiseState !== "pending") return;
    _this.promiseState = "rejected";
    _this.promiseResult = data;
  }
  try {
    // 捕获 excutor 函数抛出的错误
    excutor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

Promise.prototype.then = function (onResolved, onRejected) {
  // 判断状态是否为完成
  if (this.promiseState === "fulfilled") {
    onResolved(this.promiseResult);
  }
  // 失败状态
  if (this.promiseState === "rejected") {
    onRejected(this.promiseResult);
  }
};

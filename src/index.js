// import Promise from "./promise";

const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('ok');
    // reject("error");
    // throw "Error";
  }, 500);
  // resolve("ok");
  // reject('error');
  // throw "Error";
});
// const result = p
//   .then
//   // res => {
//   //   console.log("res: ", res);
//   //   // throw "ERROR";
//   //   // return res;
//   // },
//   // reason => {
//   //   console.log("reason: ", reason);
//   //   // throw "ERROR";
//   // }
//   ()
//   .then(
//     (res1) => {
//       console.log('res1: ', res1);
//       // throw "ERROR1";
//     }
//     // ,
//     // reason1 => {
//     //   console.log("reason1: ", reason1);
//     //   // throw "ERROR1";
//     // }
//   )
//   .catch((reason2) => {
//     console.log('reason2: ', reason2);
//   });
// console.log('p: ', p);
// console.log('result: ', result);

// const p1 = Promise.resolve('a')
// console.log('p1: ', p1);

// const p2 = Promise.resolve(new Promise((resolve,reject)=>{
//   // resolve(1)
//   setTimeout(()=>{
//     reject('error')
//   })
// }))
// console.log('p2: ', p2);

// const p3 = Promise.reject('a');
// console.log('p3: ', p3);

// const p4 = Promise.reject(
//   new Promise((resolve, reject) => {
//     resolve(1)
//     setTimeout(() => {
//       // reject('error');
//     });
//   })
// );
// console.log('p4: ', p4);

const promise1 = new Promise((resolve,reject)=>{
  setTimeout(()=>{
    // resolve('promise1')
    throw 'err'
  })
})
const promise2 = new Promise((resolve,reject)=>{
  setTimeout(()=>{
    // resolve('promise2')
    reject('promise2')
    // throw 'error'
  },500)
})
const promise3 = new Promise((resolve,reject)=>{
  setTimeout(()=>{
    resolve('promise3')
  })
})

// const res = Promise.all([promise1,promise2,promise3])
// console.log('res: ', res);
const res1 = Promise.race([promise1,promise2,promise3])
console.log('res1: ', res1);
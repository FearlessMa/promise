// import Promise from "./promise";

const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    // resolve('ok')
    // reject("error");
    // throw "Error";
  }, 500);
  // resolve("ok");
  reject("error");
  // throw "Error";
});
const result = p
  .then(
    // res => {
    //   console.log("res: ", res);
    //   // throw "ERROR";
    //   // return res;
    // },
    // reason => {
    //   console.log("reason: ", reason);
    //   // throw "ERROR";
    // }
  )
  .then(
    res1 => {
      console.log("res1: ", res1);
      // throw "ERROR1";
    }
    // ,
    // reason1 => {
    //   console.log("reason1: ", reason1);
    //   // throw "ERROR1";
    // }
  ).catch(reason2=>{
    console.log('reason2: ', reason2);

  });
console.log("p: ", p);
console.log("result: ", result);

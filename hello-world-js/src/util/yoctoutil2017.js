require('yoctolib-es2017/yocto_api.js');


export async function startDemo() {
  await YAPI.LogUnhandledPromiseRejections();
  await YAPI.DisableExceptions();

  console.log("Calling RegisterHub");
  let errmsg = new YErrorMsg();
  if(await YAPI.RegisterHub('127.0.0.1', errmsg) != YAPI.SUCCESS) {
    console.log('ERROR: Cannot contact VirtualHub on 127.0.0.1: '+errmsg.msg);
    return;
  }
  console.log("Success starting RegisterHub!");
}
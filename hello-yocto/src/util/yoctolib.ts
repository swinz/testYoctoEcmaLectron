import { YAPI, YErrorMsg, YModule } from 'yoctolib-esm/yocto_api.mjs';
// import { YAPI, YErrorMsg, YModule } from './yoctolib-esm/yocto_api.mjs';
// import { YAPI, YErrorMsg, YModule } from 'yoctolib-es2017/yocto_api.js';


// declare let YAPI: any;
// declare let YErrorMsg: any;
// declare let YModule: any;
// /* eslint-disable */
// const yocto = require("yoctolib-es2017/yocto_api.js");

async function refresh()
{
    try {
        const errmsg = new YErrorMsg();
        await YAPI.UpdateDeviceList(errmsg);

        let module = YModule.FirstModule();
        while(module) {
            let line = await module.get_serialNumber();
            line += '(' + (await module.get_productName()) + ')';
            console.log(line);
            module = module.nextModule();
        }
        setTimeout(refresh, 500);
    } catch(e) {
        console.log(e);
    }
}


export async function startDemo()
{
    console.log('Node version: ', process.version);
    await YAPI.LogUnhandledPromiseRejections();
    await YAPI.DisableExceptions();

    // Setup the API to use the VirtualHub on local machine
    const errmsg = new YErrorMsg();
    if (await YAPI.RegisterHub('127.0.0.1', errmsg) != YAPI.SUCCESS) {
        console.log('Cannot contact VirtualHub on 127.0.0.1');
        return;
    }
    refresh();
}

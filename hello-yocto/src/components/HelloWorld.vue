<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>

    <h3>Yocto Module Inventory</h3>
    <ul id="module_list"></ul>

    <h3>Installed CLI Plugins</h3>
    <ul>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener">babel</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-typescript" target="_blank" rel="noopener">typescript</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank" rel="noopener">eslint</a></li>
    </ul>
    <h3>Essential Links</h3>
    <ul>
      <li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>
      <li><a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a></li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
      <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
      <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a></li>
      <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
});


/* eslint-disable */
declare var YAPI: any;

const yocto = require("yoctolib-es2017/yocto_api.js");
const { ipcRenderer } = require('electron')
let serial_list: any[] = [];
YAPI._isNodeJS = false;

function refresh_module_list()
{
    console.log('  Yocto: refresh_module_list called');
    let ul = document.getElementById('module_list');
    if (ul) {
      ul.innerHTML = '';
      for (let i = 0; i < serial_list.length; i++) {
          let li = document.createElement("li");
          li.appendChild(document.createTextNode(serial_list[i]));
          ul.appendChild(li);
      } 
    }
}

async function deviceArrival(module: { get_serialNumber: () => any; })
{
    console.log('  Yocto: deviceArrival called');
    let serial = await module.get_serialNumber();
    serial_list[serial_list.length] = serial;
    refresh_module_list();

}

async function deviceRemoval(module: { get_serialNumber: () => any; })
{
    console.log('  Yocto: deviceRemoval called');
    let serial = await module.get_serialNumber();
    serial_list = serial_list.filter(item => item !== serial);
    refresh_module_list();
}

function handleHotPlug()
{
    // console.log('  Yocto: handleHotPlug called');
    YAPI.SetTimeout(handleHotPlug, 1000);
}

async function startDemo()
{
    console.log('startDemo called');
    await YAPI.LogUnhandledPromiseRejections();

    console.log('startDemo: registering hub')
    try {
      // Setup the API to use the VirtualHub on local machine
      await YAPI.RegisterHub('localhost');
    } catch (errmsg) {
        console.log('  registering hub error:', errmsg)
        ipcRenderer.send('open-error-dialog', errmsg.msg);
        return;
    }
    console.log('startDemo: registering arrival callback')
    await YAPI.RegisterDeviceArrivalCallback(deviceArrival);
    console.log('startDemo: registering removal callback')
    await YAPI.RegisterDeviceRemovalCallback(deviceRemoval);
    console.log('startDemo: handling hot plug call')
    handleHotPlug();
}

console.log('----->', ipcRenderer.sendSync('sync-ping', 'ping'));
ipcRenderer.on('async-ping-reply', (event:any, arg:any) => {
  console.log('async-ping-reply:', arg) 
});

ipcRenderer.send('async-ping', 'ping')

// startDemo();



</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

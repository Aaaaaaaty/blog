#!/usr/bin/env node
var run= function (obj) {
  if(obj[1] === '-v'){
    console.log('version is 1.0.0');
  }
  if(obj[1] === '-h'){
    console.log('Useage:');
    console.log('  -v --version [show version]');
  }
};
//获取除第一个命令以后的参数，使用空格拆分
run(process.argv.slice(2)); 
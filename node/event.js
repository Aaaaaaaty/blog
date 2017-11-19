const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('触发了一个事件A！');
});
myEmitter.on('event', () => {
    console.log('触发了一个事件B！');
});
myEmitter.on('talk', () => {
    console.log('触发了一个事件CS！');
    // myEmitter.emit('talk');
});
console.log(myEmitter._events)
myEmitter.emit('event');


var a = Array.from(Array(1000).keys())
function spliceOne(list, index) {
    for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
      list[i] = list[k];
    list.pop();
  }
console.time('spliceOne')
for(var i = 0; i < 10000; i++) {
    spliceOne(a, 100)
}
console.timeEnd('spliceOne')
var a = Array.from(Array(1000).keys())
console.time('splice')
for(var i = 0; i < 10000; i++) {
    a.splice(100, 1)
}
console.timeEnd('splice')
var a = {} 
a.test = 1
var b = Object.create(null)
b.test = 1
console.time('{}')
for(var i = 0; i < 10; i++) {
    console.log(a.test)
}
console.timeEnd('{}')
console.time('create')
for(var i = 0; i < 10; i++) {
    console.log(b.test)
}
console.timeEnd('create')
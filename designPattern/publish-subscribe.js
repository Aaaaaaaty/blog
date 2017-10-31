var Event = (function(){
    var list = {},
        listen,
        trigger,
        remove;
        listen = function(key,fn){
            if(!list[key]) {
                list[key] = [];
            }
            list[key].push(fn);
        };
        trigger = function(){
            var key = Array.prototype.shift.call(arguments),
                 fns = list[key];
            if(!fns || fns.length === 0) {
                return false;
            }
            for(var i = 0, fn; fn = fns[i++];) {
                fn.apply(this,arguments);
            }
        };
        remove = function(key,fn){
            var fns = list[key];
            if(!fns) {
                return false;
            }
            if(!fn) {
                fns && (fns.length = 0);
            }else {
                for(var i = fns.length - 1; i >= 0; i--){
                    var _fn = fns[i];
                    if(_fn === fn) {
                        fns.splice(i,1);
                    }
                }
            }
        };
        return {
            listen: listen,
            trigger: trigger,
            remove: remove
        }
})();
Event.listen('red',fn1 = function(size){
    console.log("尺码是："+size);  
});

// 小花订阅如下消息
Event.listen('red',fn2 = function(size){
    console.log("再次打印尺码是："+size); 
});
Event.remove("red",fn1);
Event.trigger("red",42);
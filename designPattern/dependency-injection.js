// 定义Service 
var services = { 
    A: () => {console.log(1)}, 
    B: () => {console.log(2)},
    C: () => {console.log(3)}
} 
// 目标函数 
function Service(A, B) { 
    A()
    B()
} 
// 获取func的参数列表(依赖列表) 
getFuncParams = function (func) { 
    var matches = func.toString().match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m); 
    if (matches && matches.length > 1) 
        return matches[1].replace(/\s+/, '').split(','); 
    return []; 
}, 

// 根据参数列表(依赖列表)填充参数(依赖项) 
setFuncParams = function (params) { 
    for (var i in params) { 
        params[i] = services[params[i]]; 
    } 
    return params; 
}; 

// 注射器 
function Activitor(func, scope) {
   return () => {
       func.apply(scope || {}, setFuncParams(getFuncParams(func)));
   } 
} 
// 实例化Service并调用方法 
var service = Activitor(Service); 
service()



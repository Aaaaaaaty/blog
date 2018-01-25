function Queue() {
    var items = [];
    // 向队列尾部添加一个（或多个）新的项
    this.enqueue = function(element){
        items.push(element);
    };
    // 移除队列的第一（即排在队列最前面的）项，并返回被移除的元素
    this.dequeue = function(){
        return items.shift();
    };
    // 返回队列中第一个元素——最先被添加，也将是最先被移除的元素。队列不做任何变动
    this.front = function(){
        return items[0];
    };
    // 如果队列中不包含任何元素，返回 true ，否则返回 false
    this.isEmpty = function(){
        return items.length == 0;
    };
    //  清空队列
    this.clear = function(){
        items = [];
    };
    // 返回队列包含的元素个数，与数组的 length 属性类似
    this.size = function(){
        return items.length;
    };
    this.print = function(){
        console.log(items.toString());
    };
}
function Dictionary() {
    // items作为私有变量，是字典的载体
    var items = {};
    // has方法，如果某个键值存在于这个字典中，则返回true，反之则返回false
    this.has = function (key) {
        return key in items;
    };
    // set方法，向字典中添加新元素
    this.set = function (key, value) {
        items[key] = value;
    };
    // remove方法，通过使用键值来从字典中移除键值对应的数据值
    this.remove = function(key) {
        if (this.has(key)) {
            delete items[key];
            return true;
        }
        return false;
    };
    // get方法，通过键值查找特定的数值并返回
    this.get = function(key) {
        return this.has(key) ? items[key] : undefined;
    };
    // clear方法，将这个字典中的所有元素全部删除
    this.clear = function(){
        // 清空字典列表
        items = {};
    };
    // size方法，返回字典所包含元素的数量。与数组的length属性类似
    this.size = function(){
        // Object.keys不会遍历原型链上的属性
        return Object.keys(items).length;
    };
    // keys方法，将字典所包含的所有键名以数组形式返回
    this.keys = function(){
        return Object.keys(items);
    };
    // values方法，将字典所包含的所有数值以数组形式返回
    this.values = function() {
        var values = [];
        for (var k in items) {
            // 用has方法判断，避免遍历到原型链上的属性
            if (this.has(k)) {
                values.push(items[k]);
            }
        }
        return values;
    };
}
function Graph() {
    var vertices = [];
    var adjList = new Dictionary();
    var initializeColor = function(){
        var color = {};
        for (var i=0; i<vertices.length; i++){
            color[vertices[i]] = 'white';
        }
        return color;
    };
    this.addVertex = function(v){
        vertices.push(v);
        adjList.set(v, []);
    };
    this.addEdge = function(v, w){
        adjList.get(v).push(w);
        adjList.get(w).push(v);
    };
    // 获取路径信息
    this.pathData = function(v){
        var color = initializeColor(),
            queue = new Queue(),
            dis = {}, // 用于保存起始顶点v到任意顶点u的距离
            pred = {}; // 用于保存v到u的路径上u的上一级顶点（前溯点）
        queue.enqueue(v);
        while (!queue.isEmpty()){
            var u = queue.dequeue(),
                neighbors = adjList.get(u);
            color[u] = 'grey';
            for (i=0; i<neighbors.length; i++){
                var w = neighbors[i];
                if (color[w] === 'white'){
                    color[w] = 'grey';
                    if(!dis[u]) dis[u] = 0
                    dis[w] = dis[u] + 1; // w到u的距离差是1
                    pred[w] = u; // w的上一级顶点是u
                    
                    queue.enqueue(w);
                }
            }
            color[u] = 'black';
        }
        console.log(dis, pred) 
        return { // 返回保存的数据
            dis: dis,
            pred: pred
        };
    };
    // 格式化输出路径信息
    this.printPathData = function (pathData) {
        var fromVertex = vertices[0]; // 获取起始点
        for (var i=1; i<vertices.length; i++){
            var toVertex = vertices[i], // 要到达的顶点
                path = []; // 用于保存路径
            // 从目标顶点一直回溯到起始顶点
            for (var v=toVertex; v!== fromVertex; v= pathData.pred[v]) {
                path.push(v); // 顶点添加进路径
            }
            path.push(fromVertex); // 将起始顶点添加进路径
            var s = path.pop();
            while (path.length > 0){
                s += ' - ' + path.pop(); // 从路径数组倒序输出顶点
            }
            console.log(s);
        }
    }
}
var graph = new Graph();
var myVertices = ['A','B','C','D','E'];
for (var i=0; i<myVertices.length; i++){
    graph.addVertex(myVertices[i]); // 添加图的顶点
}
// 添加图的边
graph.addEdge('A', 'B');
graph.addEdge('A', 'C');
graph.addEdge('B', 'D');
graph.addEdge('D', 'E');
graph.printPathData(graph.pathData('A'))
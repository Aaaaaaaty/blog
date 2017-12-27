var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
var t = 0 //贝塞尔函数涉及的占比比例，0<=t<=1
var clickNodes = [] //点击的控制点对象数组
var bezierNodes = [] //绘制内部控制点的数组
var isPrinted = false //当前存在绘制的曲线
var isPrinting = false //正在绘制中
var num = 0 //控制点数
$(canvas).click(function(e) {
    if(!isPrinted) {
        num++
        var diffLeft = $(this).offset().left,
            diffTop = $(this).offset().top,
            clientX = e.clientX,
            clientY = e.clientY
            x = clientX - diffLeft,
            y = clientY - diffTop
            var ctx = canvas.getContext('2d')
            ctx.font = "20px Microsoft YaHei";
            ctx.fillStyle = '#696969'
            ctx.fillText("p" + num, x, y + 20);
            ctx.beginPath()
            ctx.arc(x, y, 4, 0, Math.PI * 2, false)
            ctx.fill()
            if(clickNodes.length) {
                var startX = clickNodes[clickNodes.length - 1].x,
                    startY = clickNodes[clickNodes.length - 1].y
                ctx.beginPath() 
                ctx.moveTo(startX, startY)
                ctx.lineTo(x, y)
                ctx.strokeStyle = '#696969'
                ctx.stroke()
            } 
            clickNodes.push({
                x: x,
                y: y
            })
    }
})
$('#print').click(function() {
    if(!isPrinting) {
        isPrinted = true
        drawBezier(ctx, clickNodes)
    }
})
$('#clear').click(function() {
    if(!isPrinting) {
        isPrinted = false
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        clickNodes = []
        bezierNodes = []
        t = 0
        num = 0
    }
})
function drawBezier(ctx, origin_nodes) {
    if(t > 1) {
        isPrinting = false
        return
    }
    isPrinting = true
    var nodes = origin_nodes
    t += 0.01
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    function drawnode(nodes) {
        if(!nodes.length) return
        var _nodes = nodes
        var next_nodes = []
        _nodes.forEach(function(item, index) {
            var x = item.x,
                y = item.y    
            if(_nodes.length === num) {
                ctx.font = "20px Microsoft YaHei";
                ctx.fillText("p" + num, x, y + 20);
            }
            ctx.beginPath()
            ctx.arc(x, y, 4, 0, Math.PI * 2, false)
            ctx.fill()
            if(_nodes.length === 1) {
                bezierNodes.push(item)
                if(bezierNodes.length > 1) {
                    bezierNodes.forEach(function (obj, i) {
                        if (i) {
                            var startX = bezierNodes[i - 1].x,
                                startY = bezierNodes[i - 1].y,
                                x = obj.x,
                                y = obj.y
                            ctx.beginPath()
                            ctx.moveTo(startX, startY)
                            ctx.lineTo(x, y)
                            ctx.strokeStyle = 'red'
                            ctx.stroke()
                        }
                    })
                }
            }
            if(index) {
                var startX = _nodes[index - 1].x,
                    startY = _nodes[index - 1].y
                ctx.beginPath()
                ctx.moveTo(startX, startY)
                ctx.lineTo(x, y)
                ctx.strokeStyle = '#696969'
                ctx.stroke()
            }
        })  
        if(_nodes.length) {
            for(var i = 0; i < _nodes.length - 1; i++) {
                var arr = [{
                    ctrlx: _nodes[i].x,
                    ctrly: _nodes[i].y
                }, {
                    ctrlx: _nodes[i + 1].x,
                    ctrly: _nodes[i + 1].y 
                }]
                next_nodes.push(bezier(arr, t))
            }
            drawnode(next_nodes)
        }

    }
    drawnode(nodes)
    window.requestAnimationFrame(drawBezier.bind(this, ctx, nodes))
}
function factorial(num) { //递归阶乘
    if (num <= 1) {
        return 1;
    } else {
        return num * factorial(num - 1);
    }
}

function bezier(arr, t) { //通过各控制点与占比t计算当前贝塞尔曲线上的点坐标
    var x = 0,
        y = 0,
        n = arr.length - 1
    arr.forEach(function(item, index) {
        if(!index) {
            x += item.ctrlx * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
            y += item.ctrly * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
        } else {
            x += factorial(n) / factorial(index) / factorial(n - index) * item.ctrlx * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
            y += factorial(n) / factorial(index) / factorial(n - index) * item.ctrly * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
        }
    })
    return {
        x: x,
        y: y
    }
}
var getRandomColor = function(){
      return '#'+Math.floor(Math.random()*16777215).toString(16);
}
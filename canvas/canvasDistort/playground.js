var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
var t = 0 //贝塞尔函数涉及的占比比例，0<=t<=1
var clickNodes = [] //点击的控制点对象数组
var bezierNodes = [] //绘制内部控制点的数组
var isPrinted = false //当前存在绘制的曲线
var isPrinting = false //正在绘制中
var num = 0 //控制点数
var isDrag = false //是否进入拖拽行为
var isDragNode = false //是否点击到了控制点
var dragIndex = 0 //被拖拽的点的索引
var clickon = 0 //鼠标按下时间戳
var clickoff = 0 //鼠标抬起
var imgStartX = 100
var imgStartY = 100
var imgWidth = 0
var imgHeight = 0
var imgChangeObj = {}
var imgAfterChangeArr = []
//绘制底图进去
var img = new Image()
var imgData = ''
var data 
var imgDataArr = []
var imgDataArrIndex = 1
var imgAnimateDataSymArr = {}
var imgAnimateDataObj = {}
img.src = '333.png'
img.onload = function() {
    imgWidth = img.width
    imgHeight = img.height
    ctx.drawImage(img, imgStartX, imgStartY)
    imgData = ctx.getImageData(imgStartX, imgStartY, imgWidth, imgHeight)
    imgDataArr[0] = []
    imgData.data.forEach(function(item, index) {
        imgDataArr[0].push(item)
    })
    bezierChangeImg()
}
function bezierChangeImg() {
    $(canvas).mousedown(function(e){
        isDrag = true
        clickon = new Date().getTime()
        var diffLeft = $(this).offset().left,
            diffTop = $(this).offset().top,
            clientX = e.clientX,
            clientY = e.clientY,
            x = clientX - diffLeft,
            y = clientY - diffTop
        clickNodes.forEach(function(item, index) {
            var absX = Math.abs(item.x - x),
                absY = Math.abs(item.y - y)
            if(absX < 5 && absY < 5) {
                isDragNode = true
                dragIndex = index
            }
        })
    }).mousemove(function(e) {
        if(isDrag && isDragNode) {
            var diffLeft = $(this).offset().left,
            diffTop = $(this).offset().top,
            clientX = e.clientX,
            clientY = e.clientY,
            x = clientX - diffLeft,
            y = clientY - diffTop
            clickNodes[dragIndex] = {
                x: x,
                y: y
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.putImageData(imgData, imgStartX, imgStartY) 
            clickNodes.forEach(function(item, index) {
                var x = item.x,
                    y = item.y,
                    i = parseInt(index, 10) + 1
                ctx.fillText("p" + i, x, y + 20)
                ctx.fillText("p" + i + ': ('+ x +', '+ y +')', 10, i * 20)
                ctx.beginPath()
                ctx.arc(x, y, 4, 0, Math.PI * 2, false)
                ctx.fill()
                ctx.beginPath()
                ctx.moveTo(startX, startY)
                ctx.lineTo(x, y)
                ctx.strokeStyle = '#696969'
                ctx.stroke()
                if (index) {
                    var startX = clickNodes[index - 1].x,
                        startY = clickNodes[index - 1].y
                    ctx.beginPath()
                    ctx.moveTo(startX, startY)
                    ctx.lineTo(x, y)
                    ctx.stroke()
                }
            })
            if(isPrinted) {
                var bezierArr = []
                for(i = 0; i < 1; i+=0.01) {
                    bezierArr.push(bezier(clickNodes, i))
                }
                bezierArr.forEach(function(obj, index) {
                    if (index) {
                        var startX = bezierArr[index - 1].x,
                            startY = bezierArr[index - 1].y,
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
    }).mouseup(function(e) {
        isDrag = false
        isDragNode = false
        clickoff = new Date().getTime()
        if(clickoff - clickon < 200) {
            var diffLeft = $(this).offset().left,
            diffTop = $(this).offset().top,
            clientX = e.clientX,
            clientY = e.clientY
            x = clientX - diffLeft,
            y = clientY - diffTop
            if(!isPrinted && !isDragNode) {
                num++
                ctx.font = "16px Microsoft YaHei";
                ctx.fillStyle = '#696969'
                ctx.fillText("p" + num, x, y + 20);
                ctx.fillText("p" + num + ': ('+ x +', '+ y +')', 10, num * 20)
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
        } else {
            
        }
    })
    $('#print').click(function() {
        if(!num) return
        if(!isPrinting) {
            isPrinted = true
            drawBezier(ctx, clickNodes)
        }
    })
    $('#make').click(function() {
        var bezierArr = []
        var arr = []
        for (i = 0; i < 1; i += 0.001) {
            bezierArr.push(bezier(clickNodes, i))
        }
        bezierArr.forEach(function (obj, index) {
            if (imgStartY < obj.y && imgStartY + imgHeight > obj.y) {
                var diffX = parseInt(obj.x - bezierArr[0].x, 10)
                var dissY = parseInt(obj.y - imgStartY, 10)
                var rowNum = dissY
                imgDataArr[0].forEach(function (item, index) {
                    imgData.data[index] = item
                })
                var imgDataSlice = imgData.data.slice((rowNum) * imgWidth * 4, rowNum * imgWidth * 4 + imgWidth * 4)
                imgAnimateDataSymArr[rowNum] = {
                    diffX: diffX,
                    imgDataSlice: [].slice.call(imgDataSlice)
                }
                for (var i = 0; i < Math.abs(diffX * 4); i++) {
                    imgDataSlice = arraymove(diffX, imgDataSlice)
                }
                imgChangeObj[rowNum] = imgDataSlice
            }
        })
        Object.keys(imgChangeObj).forEach(function (item, index) {
            arr = arr.concat(Array.from(imgChangeObj[item]))
        })
        imgDataArr[imgDataArrIndex] = arr
        imgDataArr[imgDataArrIndex].forEach(function (item, index) {
            imgData.data[index] = item
        })
        ctx.putImageData(imgData, imgStartX, imgStartY)
        imgDataArrIndex++
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
    $('#animate').click(function() {
        var sliceNum = new Array(4)
        sliceNum.fill(0).forEach(function(item, i) {
            imgAnimateDataObj[i] = []
        })
        Object.keys(imgAnimateDataSymArr).forEach(function(item, index) {
            var imgDataSlice = imgAnimateDataSymArr[item].imgDataSlice 
            var arr = {
                0: imgDataSlice, 
                1: imgDataSlice, 
                2: imgDataSlice, 
                3: imgDataSlice, 
            }
            var diffX = imgAnimateDataSymArr[item].diffX
            var num = parseInt(diffX / (sliceNum.length -1)) * 4
            imgAnimateDataObj[0].push(imgDataSlice)
            for (var i = 0; i < Math.abs(num); i++) {
                arr[0] = arraymove(diffX, arr[0])
            }  
            imgAnimateDataObj[1].push(arr[0])
            for (var i = 0; i < Math.abs(num * 2); i++) {
                arr[1] = arraymove(diffX, arr[1])
            }  
            imgAnimateDataObj[2].push(arr[1])
            for (var i = 0; i < Math.abs(diffX * 4); i++) {
                arr[2] = arraymove(diffX, arr[2])
            }  
            imgAnimateDataObj[3].push(arr[2])
        })
        Object.keys(imgAnimateDataObj).forEach(function (item, index) {
            var arr = []
            imgAnimateDataObj[item].forEach(function(obj, i) {
                arr = arr.concat(obj)
            }) 
            imgAnimateDataObj[item] = arr
        })
        var canvasBg = document.createElement('canvas')
        canvasBg.id = 'canvasBg'
        canvasBg.width = imgWidth
        canvasBg.height = imgHeight
        var bgctx = canvasBg.getContext('2d')
        var url = []
        for(var j = 0; j < sliceNum.length; j++) {
            var imgData = bgctx.getImageData(0, 0, imgWidth, imgHeight)
            imgAnimateDataObj[j].forEach(function(item, index) {
                imgData.data[index] = item
            })
            bgctx.putImageData(imgData, 0, 0) 
            url[j] = canvasBg.toDataURL()
        }
        var index = -1
        var to = 1 //控制方向
        setInterval(function() {
            if(to) {
                index++
                if (index === 4) {
                    to = 0
                    return
                }
            } else {
                index --
                if(index === -1) {
                    to = 1
                    return 
                }
            }
            $('#0').attr('src', url[index])
        }, 100)
    })
    function arraymove(type, arr) {
        var newArray = []
        if(type > 0) { //右移
            var lastOne = arr[arr.length - 1]
            for(var i = 0; i < arr.length - 1; i++) {
                newArray[i + 1] = arr[i] 
            }
            newArray[0] = lastOne
        } else {
            var firstOne = arr[0]
            for(var i = 1; i < arr.length; i++) {
                newArray[i - 1] = arr[i] 
            }
            newArray[arr.length - 1] = firstOne 
        }
        return newArray 
    }
    function drawBezier(ctx, origin_nodes) {
        if(t > 1) {
            isPrinting = false
            return
        }
        isPrinting = true
        var nodes = origin_nodes
        t += 0.01
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 100, 100)
        drawnode(nodes)
        window.requestAnimationFrame(drawBezier.bind(this, ctx, nodes))
    }
    function drawnode(nodes) {
        if(!nodes.length) return
        var _nodes = nodes
        var next_nodes = []
        _nodes.forEach(function(item, index) {
            var x = item.x,
                y = item.y    
            if(_nodes.length === num) {
                ctx.font = "16px Microsoft YaHei"
                var i = parseInt(index, 10) + 1
                ctx.fillText("p" + i, x, y + 20)
                ctx.fillText("p" + i + ': ('+ x +', '+ y +')', 10, i * 20)
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
                    x: _nodes[i].x,
                    y: _nodes[i].y
                }, {
                    x: _nodes[i + 1].x,
                    y: _nodes[i + 1].y 
                }]
                next_nodes.push(bezier(arr, t))
            }
            drawnode(next_nodes)
        }
    
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
                x += item.x * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
                y += item.y * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
            } else {
                x += factorial(n) / factorial(index) / factorial(n - index) * item.x * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
                y += factorial(n) / factorial(index) / factorial(n - index) * item.y * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
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
}

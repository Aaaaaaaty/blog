function CanvasDistortGround (name) {
    this.name = name
    this.$el = $('#' + this.name) 
    this.fileInputBtn = this.$el.find('input')
    this.printBtn = this.$el.find('.print') 
    this.makeBtn = this.$el.find('.make') 
    this.clearBtn = this.$el.find('.clear') 
    this.animateBtn = this.$el.find('.animate') 
    this.canvas = document.querySelector('#' + this.name + ' .canvas')
    this.ctx = this.canvas.getContext('2d')
    this.t = 0 //贝塞尔函数涉及的占比比例，0<=t<=1
    this.clickNodes = [] //点击的控制点对象数组
    this.bezierNodes = [] //绘制内部控制点的数组
    this.isPrinted = false //当前存在绘制的曲线
    this.isPrinting = false //正在绘制中
    this.num = 0 //控制点数
    this.isDrag = false //是否进入拖拽行为
    this.isDragNode = false //是否点击到了控制点
    this.dragIndex = 0 //被拖拽的点的索引
    this.clickon = 0 //鼠标按下时间戳
    this.clickoff = 0 //鼠标抬起
    this.imgStartX = 100
    this.imgStartY = 100
    this.imgWidth = 0
    this.imgHeight = 0
    this.imgChangeObj = {}
    this.imgAfterChangeArr = []
    this.imgData = ''
    this.data 
    this.imgDataArr = []
    this.imgDataArrIndex = 1
    this.imgAnimateDataSymArr = {}
    this.imgAnimateDataObj = {}
}
CanvasDistortGround.prototype.init = function() {
    var _ = this
    this.fileInputBtn.change(function(e) {
        var file = e.target
        var oFReader = new FileReader()
        var rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
        if (file.files.length === 0) {
            return null
        } else {
            if (!rFilter.test(file.files[0].type)) {
                alert("You must select a valid image file!")
                return null
            }
            oFReader.readAsDataURL(file.files[0])
        }
        oFReader.onload = function (oFREvent) {
            _.img = new Image()
            _.img.src = oFREvent.target.result
            _.img.onload = function() {
                _.ctx.clearRect(_.imgStartX, _.imgStartY, _.imgWidth, _.imgHeight)
                _.imgWidth = this.width
                _.imgHeight = this.height
                _.ctx.drawImage(this, _.imgStartX, _.imgStartY)
                _.imgData = _.ctx.getImageData(_.imgStartX, _.imgStartY, _.imgWidth, _.imgHeight)
                _.imgDataArr[0] = []
                _.imgData.data.forEach(function(item, index) {
                    _.imgDataArr[0].push(item)
                })
            }
        }
    })
}
CanvasDistortGround.prototype.bezierChangeImg = function() {
    var _ = this
    $(this.canvas).mousedown(function(e){
        _.isDrag = true
        _.clickon = new Date().getTime()
        var diffLeft = $(this).offset().left,
            diffTop = $(this).offset().top,
            clientX = e.clientX,
            clientY = e.clientY,
            x = clientX - diffLeft,
            y = clientY - diffTop
        _.clickNodes.forEach(function(item, index) {
            var absX = Math.abs(item.x - x),
                absY = Math.abs(item.y - y)
            if(absX < 5 && absY < 5) {
                _.isDragNode = true
                _.dragIndex = index
            }
        })
    }).mousemove(function(e) {
        if(_.isDrag && _.isDragNode) {
            var diffLeft = $(this).offset().left,
            diffTop = $(this).offset().top,
            clientX = e.clientX,
            clientY = e.clientY,
            x = clientX - diffLeft,
            y = clientY - diffTop
            _.clickNodes[_.dragIndex] = {
                x: x,
                y: y
            }
            ctx.clearRect(0, 0, _.canvas.width, _.canvas.height)
            ctx.putImageData(_.imgData, _.imgStartX, _.imgStartY) 
            _.clickNodes.forEach(function(item, index) {
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
                    var startX = _.clickNodes[index - 1].x,
                        startY = _.clickNodes[index - 1].y
                    ctx.beginPath()
                    ctx.moveTo(startX, startY)
                    ctx.lineTo(x, y)
                    ctx.stroke()
                }
            })
            if(isPrinted) {
                var bezierArr = []
                for(i = 0; i < 1; i+=0.01) {
                    bezierArr.push(bezier(_.clickNodes, i))
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
        _.isDrag = false
        _.isDragNode = false
        _.clickoff = new Date().getTime()
        if(_.clickoff - _.clickon < 200) {
            var diffLeft = $(this).offset().left,
            diffTop = $(this).offset().top,
            clientX = e.clientX,
            clientY = e.clientY
            x = clientX - diffLeft,
            y = clientY - diffTop
            if(!_.isPrinted && !_.isDragNode) {
                _.num++
                ctx.font = "16px Microsoft YaHei";
                ctx.fillStyle = '#696969'
                ctx.fillText("p" + _.num, x, y + 20);
                ctx.fillText("p" + _.num + ': ('+ x +', '+ y +')', 10, _.num * 20)
                ctx.beginPath()
                ctx.arc(x, y, 4, 0, Math.PI * 2, false)
                ctx.fill()
                if(_.clickNodes.length) {
                    var startX = _.clickNodes[_.clickNodes.length - 1].x,
                        startY = _.clickNodes[_.clickNodes.length - 1].y
                    ctx.beginPath() 
                    ctx.moveTo(startX, startY)
                    ctx.lineTo(x, y)
                    ctx.strokeStyle = '#696969'
                    ctx.stroke()
                } 
                _.clickNodes.push({
                    x: x,
                    y: y
                })
            }
        } 
    })
}

CanvasDistortGround.prototype.arraymove = function(type, arr) {
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

CanvasDistortGround.prototype.drawBezier = function(ctx, origin_nodes) {
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

CanvasDistortGround.prototype.drawnode = function(nodes) {
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

CanvasDistortGround.prototype.factorial = function(num) {
    if (num <= 1) {
        return 1;
    } else {
        return num * factorial(num - 1);
    }
}

CanvasDistortGround.prototype.bezier = function(arr, t) { //通过各控制点与占比t计算当前贝塞尔曲线上的点坐标
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
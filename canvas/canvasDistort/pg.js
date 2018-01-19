function CanvasDistortGround (name) {
    this.name = name
    this.$el = $('#' + this.name) 
    this.fileInputBtn = this.$el.find('.file')
    this.checkInputBtn = this.$el.find('.check')
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
    this.baseX = 800 //基准线横坐标 旨在通过基准线计算偏移量
    this.baseY = 0
    this.imgStartX = 100
    this.imgStartY = 100
    this.imgWidth = 0
    this.imgHeight = 0
    this.imgChangeObj = {}
    this.imgAfterChangeArr = []
    this.imgData = ''
    this.data 
    this.imgDataArr = {} //存放图像原始数据与暂时数据
    this.imgAnimateDataSymArr = {} //存储图像切片数据
    this.imgAnimateDataObj = {} //存储图像合成后各个图像imgData数据
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
                _.baseY = _.imgStartY + _.imgHeight / 2
                _.imgData = _.ctx.getImageData(_.imgStartX, _.imgStartY, _.imgWidth, _.imgHeight)
                _.imgDataArr.origin = []
                _.imgData.data.forEach(function(item, index) {
                    _.imgDataArr.origin.push(item)
                })
                _.drawBaseLine() 
            }
        }
    })
    _.addEventListener()
}
CanvasDistortGround.prototype.addEventListener = function() {
    var _ = this
    $(this.canvas).mousedown(function(e){
        _.isDrag = true
        _.clickon = new Date().getTime()
        var diffLeft = $(this).offset().left,
            diffTop = $(this).offset().top,
            pageX = e.pageX,
            pageY = e.pageY,
            x = pageX - diffLeft,
            y = pageY - diffTop
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
            pageX = e.pageX,
            pageY = e.pageY,
            x = pageX - diffLeft,
            y = pageY - diffTop
            _.clickNodes[_.dragIndex] = {
                x: x,
                y: y
            }
            _.ctx.clearRect(0, 0, _.canvas.width, _.canvas.height)
            _.drawBaseLine() 
            _.ctx.putImageData(_.imgData, _.imgStartX, _.imgStartY) 
            _.clickNodes.forEach(function(item, index) {
                var x = item.x,
                    y = item.y,
                    i = parseInt(index, 10) + 1
                _.ctx.fillText("p" + i, x, y + 20)
                _.ctx.fillText("p" + i + ': ('+ x +', '+ y +')', 10, i * 20)
                _.ctx.beginPath()
                _.ctx.arc(x, y, 4, 0, Math.PI * 2, false)
                _.ctx.fill()
                _.ctx.beginPath()
                _.ctx.moveTo(startX, startY)
                _.ctx.lineTo(x, y)
                _.ctx.strokeStyle = '#696969'
                _.ctx.stroke()
                if (index) {
                    var startX = _.clickNodes[index - 1].x,
                        startY = _.clickNodes[index - 1].y
                    _.ctx.beginPath()
                    _.ctx.moveTo(startX, startY)
                    _.ctx.lineTo(x, y)
                    _.ctx.stroke()
                }
            })
            if(_.isPrinted) {
                var bezierArr = []
                for(i = 0; i < 1; i+=0.01) {
                    bezierArr.push(_.bezier(_.clickNodes, i))
                }
                bezierArr.forEach(function(obj, index) {
                    if (index) {
                        var startX = bezierArr[index - 1].x,
                            startY = bezierArr[index - 1].y,
                            x = obj.x,
                            y = obj.y
                        _.ctx.beginPath()
                        _.ctx.moveTo(startX, startY)
                        _.ctx.lineTo(x, y)
                        _.ctx.strokeStyle = 'red'
                        _.ctx.stroke()
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
            pageX = e.pageX,
            pageY = e.pageY
            x = pageX - diffLeft,
            y = pageY - diffTop
            if(!_.isPrinted && !_.isDragNode) {
                _.num++
                _.ctx.font = "16px Microsoft YaHei";
                _.ctx.fillStyle = '#696969'
                _.ctx.fillText("p" + _.num, x, y + 20);
                _.ctx.fillText("p" + _.num + ': ('+ x +', '+ y +')', 10, _.num * 20)
                _.ctx.beginPath()
                _.ctx.arc(x, y, 4, 0, Math.PI * 2, false)
                _.ctx.fill()
                if(_.clickNodes.length) {
                    var startX = _.clickNodes[_.clickNodes.length - 1].x,
                        startY = _.clickNodes[_.clickNodes.length - 1].y
                    _.ctx.beginPath() 
                    _.ctx.moveTo(startX, startY)
                    _.ctx.lineTo(x, y)
                    _.ctx.strokeStyle = '#696969'
                    _.ctx.stroke()
                } 
                _.clickNodes.push({
                    x: x,
                    y: y
                })
            }
        } 
    })
    this.printBtn.click(function() {
        if(!_.num) return
        if(!_.isPrinting) {
            _.isPrinted = true
            _.drawBezier(_.ctx, _.clickNodes)
        }
    })
    this.makeBtn.click(function() {
        _.createDistortImage(_.clickNodes) 
    })
    this.animateBtn.click(function() {
        var type = _.checkInputBtn.get(0).checked ? 'col' : 'row'
        _.createAnimate(type)
    })
}
CanvasDistortGround.prototype.createAnimate = function(type) {
    var _ = this
    var imgNum = 4
    var sliceNum = new Array(imgNum) //控制帧数量
    sliceNum.fill(0).forEach(function(item, i) {
        _.imgAnimateDataObj[i] = []
    })
    for(var i = 0; i < imgNum; i++) {
        if(!i) {
            _.imgAnimateDataObj[i] = _.imgDataArr.origin
        } else {
            _.clickNodes.forEach(function (item, index) {
                if (type === 'row') {
                    var x = _.baseX + (item.x - _.baseX) / (imgNum - 1) * i
                    var y = item.y
                    _.imgAnimateDataObj[i].push({ x: x, y: y })
                } else if(type === 'col') {
                    var x = item.x
                    var y = _.baseY + (item.y - _.baseY) / (imgNum - 1) * i 
                    _.imgAnimateDataObj[i].push({ x: x, y: y })
                }
            })
            _.imgAnimateDataObj[i] = _.sliceImgData(_.imgAnimateDataObj[i], type) //控制点转换为生成的扭曲图像重新赋值
        }
    }
    var canvasBg = document.createElement('canvas') //离屏canvas 导出扭曲图片
    canvasBg.id = _.name + 'canvasBg'
    canvasBg.width = _.imgWidth
    canvasBg.height = _.imgHeight
    var bgctx = canvasBg.getContext('2d')
    var url = []
    for(var j = 0; j < imgNum; j++) {
        var imgData = bgctx.getImageData(0, 0, _.imgWidth, _.imgHeight)
        _.imgAnimateDataObj[j].forEach(function(item, index) {
            imgData.data[index] = item
        })
        bgctx.putImageData(imgData, 0, 0) 
        url[j] = canvasBg.toDataURL()
    }
    var index = -1
    var to = 1 //控制方向
    clearInterval(_.timer)
    _.timer = setInterval(function() {
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
    // $('#0').attr('src', url[0])
    // $('#1').attr('src', url[1])
    // $('#2').attr('src', url[2])
    // $('#3').attr('src', url[3])
}

CanvasDistortGround.prototype.sliceImgData = function(ctrlNodes, type) { //对图像进行切分
    var _ = this
    var arr = []
    var bezierArr = []
    var imgDataSlice = []
    for (i = 0; i < 1; i += 0.001) {
        bezierArr.push(_.bezier(ctrlNodes, i))
    }
    _.imgDataArr.origin.forEach(function (item, index) { //移位后像素状态会产生变化需要重置
        _.imgData.data[index] = item
    })
    bezierArr.forEach(function (obj, index) {
        if (_.imgStartY < obj.y && _.imgStartY + _.imgHeight > obj.y && type === 'row') {
            var diffX = parseInt(obj.x - _.baseX, 10) //计算偏移量
            var dissY = parseInt(obj.y - _.imgStartY, 10)
            var rowNum = dissY
            imgDataSlice = _.imgData.data.slice((rowNum) * _.imgWidth * 4, rowNum * _.imgWidth * 4 + _.imgWidth * 4) //按层切片
            for (var i = 0; i < Math.abs(diffX * 4); i++) {
                imgDataSlice = _.arraymove(diffX, imgDataSlice)
            }
            _.imgChangeObj[rowNum] = imgDataSlice
        }else if(_.baseX + _.imgWidth / 2 > obj.x && _.baseX - _.imgWidth / 2 < obj.x && type === 'col') {
            var diffX = parseInt(obj.x - (_.baseX - _.imgWidth / 2), 10) //计算偏移量
            var diffY = parseInt(obj.y - _.baseY, 10)
            var rowNum = diffX
            _.imgChangeObj[rowNum] = {
                diffX: diffX,
                diffY: diffY
            }
            
        }
    })
    if(type === 'row') {
        Object.keys(_.imgChangeObj).forEach(function (item, index) {
            arr = arr.concat(Array.from(_.imgChangeObj[item]))
        })
    } else if(type === 'col') {
        for (var i = 0; i < _.imgWidth; i++) {
            imgDataSlice = []
            for (var j = 0; j < _.imgHeight; j++) {
                var index = j * _.imgWidth * 4 + i * 4
                var sliceArr = _.imgData.data.slice(index, index + 4)
                imgDataSlice = imgDataSlice.concat(Array.from(sliceArr))
            }
            if(_.imgChangeObj[i]) {
                for (var k = 0; k < Math.abs(_.imgChangeObj[i].diffY * 4); k++) {
                    imgDataSlice = _.arraymove(_.imgChangeObj[i].diffY, imgDataSlice)
                }
                for (var p = 0; p < imgDataSlice.length / 4; p++) {
                    arr[p * _.imgWidth * 4 + i * 4] = imgDataSlice[p * 4]
                    arr[p * _.imgWidth * 4 + i * 4 + 1] = imgDataSlice[p * 4 + 1]
                    arr[p * _.imgWidth * 4 + i * 4 + 2] = imgDataSlice[p * 4 + 2]
                    arr[p * _.imgWidth * 4 + i * 4 + 3] = imgDataSlice[p * 4 + 3]
                }
            }
        }
    }
    return arr
}
CanvasDistortGround.prototype.createDistortImage = function(ctrlNodes) {
    var _ = this
    var type = _.checkInputBtn.get(0).checked ? 'col' : 'row'
    var arr = _.sliceImgData(ctrlNodes, type)
    _.imgDataArr.temp = arr
    _.imgDataArr.temp.forEach(function (item, index) { //更新imgData
        _.imgData.data[index] = item
    })
    _.ctx.putImageData(_.imgData, _.imgStartX, _.imgStartY)
    _.imgDataArr.temp = null
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
    if(this.t > 1) {
        this.isPrinting = false
        return
    }
    this.isPrinting = true
    var nodes = origin_nodes
    this.t += 0.01
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.drawBaseLine() 
    this.ctx.drawImage(this.img, 100, 100)
    this.drawnode(nodes)
    window.requestAnimationFrame(this.drawBezier.bind(this, this.ctx, nodes))
}
CanvasDistortGround.prototype.drawBaseLine = function() {
    this.ctx.moveTo(this.baseX, 0)
    this.ctx.lineTo(this.baseX, this.canvas.height)
    this.ctx.moveTo(this.imgStartX, this.imgStartY)
    this.ctx.lineTo(this.canvas.width, this.imgStartY)

    this.ctx.moveTo(this.baseX - this.imgWidth / 2, this.imgStartY)
    this.ctx.lineTo(this.baseX - this.imgWidth / 2, this.imgStartY + this.imgHeight)
    this.ctx.moveTo(this.baseX + this.imgWidth / 2, this.imgStartY)
    this.ctx.lineTo(this.baseX + this.imgWidth / 2, this.imgStartY + this.imgHeight)

    this.ctx.moveTo(this.imgStartX, this.imgStartY + this.imgHeight)
    this.ctx.lineTo(this.canvas.width, this.imgStartY + this.imgHeight)
    this.ctx.moveTo(this.imgStartX + this.imgWidth, this.imgStartY + this.imgHeight / 2)
    this.ctx.lineTo(this.canvas.width, this.imgStartY + this.imgHeight / 2) 
    this.ctx.strokeStyle = '#b4b4b4'
    this.ctx.stroke()
}
CanvasDistortGround.prototype.drawnode = function(nodes) {
    if(!nodes.length) return
    var _ = this
    var _nodes = nodes
    var next_nodes = []
    _nodes.forEach(function(item, index) {
        var x = item.x,
            y = item.y    
        if(_nodes.length === _.num) {
            _.ctx.font = "16px Microsoft YaHei"
            var i = parseInt(index, 10) + 1
            _.ctx.fillText("p" + i, x, y + 20)
            _.ctx.fillText("p" + i + ': ('+ x +', '+ y +')', 10, i * 20)
        }
        _.ctx.beginPath()
        _.ctx.arc(x, y, 4, 0, Math.PI * 2, false)
        _.ctx.fill()
        if(_nodes.length === 1) {
            _.bezierNodes.push(item)
            if(_.bezierNodes.length > 1) {
                _.bezierNodes.forEach(function (obj, i) {
                    if (i) {
                        var startX = _.bezierNodes[i - 1].x,
                            startY = _.bezierNodes[i - 1].y,
                            x = obj.x,
                            y = obj.y
                        _.ctx.beginPath()
                        _.ctx.moveTo(startX, startY)
                        _.ctx.lineTo(x, y)
                        _.ctx.strokeStyle = 'red'
                        _.ctx.stroke()
                    }
                })
            }
        }
        if(index) {
            var startX = _nodes[index - 1].x,
                startY = _nodes[index - 1].y
            _.ctx.beginPath()
            _.ctx.moveTo(startX, startY)
            _.ctx.lineTo(x, y)
            _.ctx.strokeStyle = '#696969'
            _.ctx.stroke()
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
            next_nodes.push(this.bezier(arr, this.t))
        }
        this.drawnode(next_nodes)
    }
}

CanvasDistortGround.prototype.factorial = function(num) {
    if (num <= 1) {
        return 1;
    } else {
        return num * this.factorial(num - 1);
    }
}

CanvasDistortGround.prototype.bezier = function(arr, t) { //通过各控制点与占比t计算当前贝塞尔曲线上的点坐标
    var x = 0,
        y = 0,
        n = arr.length - 1,
        _ = this
    arr.forEach(function(item, index) {
        if(!index) {
            x += item.x * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
            y += item.y * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
        } else {
            x += _.factorial(n) / _.factorial(index) / _.factorial(n - index) * item.x * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
            y += _.factorial(n) / _.factorial(index) / _.factorial(n - index) * item.y * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
        }
    })
    return {
        x: x,
        y: y
    }
}
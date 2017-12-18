var self = this
var circleArr = []
var showCircleArr = []
$(document).ready(function() {
    var canvas = document.createElement('canvas'),
        canvasCircleArr
    canvas.id = 'canvas'
    canvas.width = self.window.innerWidth
    canvas.height = self.window.innerHeight / 2
    document.getElementById('drawCanvas').appendChild(canvas)
    canvasCircleArr = canvasCircleInit(canvas)
    $('#btn').click(function () {
        var ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        var value = $('#input').val() ? $('#input').val() : ''
        for(var i = 0; i < showCircleArr.length; i++) {
            var item = showCircleArr[i]
            var x = ~~ (Math.random() * canvas.width)
            var y = ~~ (Math.random() * canvas.height)
            option = {
                isClick : true,
                isWord: true,
                originRadius: ~~ (Math.random() * 3) + 1,
                radius: ~~ (Math.random() * 3) + 1,
                color: 'rgba(255, 255, 255, 0.5',
            }
            item.changeOption(option)
            circleArr.push(item)
        } 
        showCircleArr = [] 
        loadCanvas(value, canvas)
    })
    // setTimeout(autoTime.bind(this, 10), 1500) //自动倒计时
})
function autoTime(value) { 
    if(value > -1) {
        var ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for(var i = 0; i < showCircleArr.length; i++) {
            var item = showCircleArr[i]
            var x = ~~ (Math.random() * canvas.width)
            var y = ~~ (Math.random() * canvas.height)
            option = {
                isClick : true,
                isWord: true,
                originRadius: ~~ (Math.random() * 3) + 1,
                radius: ~~ (Math.random() * 3) + 1,
                color: 'rgba(255, 255, 255, 0.5',
            }
            item.changeOption(option)
            circleArr.push(item)
        } 
        showCircleArr = []
        loadCanvas(value, canvas) 
        value --
        setTimeout(autoTime.bind(this, value), 1500)
    } 
}
function Bubble(option) {
    this.width = self.window.innerWidth
    this.height = self.window.innerHeight / 2
    this.originRadius = this.radius = option ? option.radius : 6
    this.color = option ? option.color : '#fff'
    this.lastX = this.x = option ? option.x : ~~ (Math.random() * this.width)       //lastX，lastY为过渡变量，表示粒子从一个地点到下一个地点过渡时使用
    this.lastY = this.y = option ? option.y : ~~ (Math.random() * this.height / 2)
    this.randomX = ~~ (Math.random() * this.width)
    this.randomY = ~~ (Math.random() * this.height) 
    this.speed = 4
    this.once = false
    this.isNew = false
    this.isWord = false 
}
Bubble.prototype.changeOption = function(option) {
    this.originRadius = option.originRadius ? option.originRadius : this.radius
    this.lastRadius = this.radius
    this.radius = option.radius ? option.radius : 6
    this.color = option.color ? option.color : '#fff'
    this.x = option.x ? option.x : this.x
    this.y = option.y ? option.y : this.y
    this.lastY = option.lastY ? option.lastY : this.lastY
    this.lastX = option.lastX ? option.lastX : this.lastX
    this.isNew = option.isNew ? option.isNew : false
    this.isWord = option.isWord ? option.isWord : false 
    this.isClick = option.isClick ? option.isClick : false
}
Bubble.prototype.draw = function(ctx, randomMove) {
    if(randomMove) {
        var dis = ~~ Math.sqrt(Math.pow(Math.abs(this.x - this.randomX), 2) + Math.pow(Math.abs(this.y - this.randomY), 2)),
            ease = 0.05
        if(this.isWord) {
            var disLastPosition = ~~ Math.sqrt(Math.pow(Math.abs(this.lastX - this.randomX), 2) + Math.pow(Math.abs(this.lastY - this.randomY), 2))
            var ease = 0.05
            if (disLastPosition > 0) {
                if (this.lastX < this.randomX) {
                    this.lastX += disLastPosition * ease
                } else {
                    this.lastX -= disLastPosition * ease
                }
                if (this.lastY < this.randomY) {
                    this.lastY += disLastPosition * ease
                } else {
                    this.lastY -= disLastPosition * ease
                }
            } else {
                this.lastX = this.randomX
                this.lastY = this.randomY
                this.x = this.lastX //更新x,y值
                this.y = this.lastY
                this.isWord = false
            }
            ctx.beginPath()
            ctx.arc(this.lastX, this.lastY, this.originRadius, 0, 2 * Math.PI, false)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
            ctx.fill()
            return
        }
        if( dis > 0) {
            if(this.x < this.randomX) {
                this.x += dis * ease 
            } else {
                this.x -= dis * ease 
            }
            if(this.y < this.randomY) {
                this.y += dis * ease 
            } else {
                this.y -= dis * ease 
            }
        } else {
            this.speed = 4
            this.randomX += ~~(Math.random() * (Math.random() > 0.5 ? 5 : -5) * 2)
            this.randomY += ~~(Math.random() * (Math.random() > 0.5 ? 5 : -5) * 2) 
        }
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.originRadius, 0, 2 * Math.PI, false)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.fill()
        
    } else {
        var x = this.x * 3 + 50,
            y = this.y * 3 + 50,
            dis = ~~ Math.sqrt(Math.pow(Math.abs(this.lastX - x), 2) + Math.pow(Math.abs(this.lastY - y), 2))
            color = this.color || '#fff',
            ease = 0.05,
            maxRaduis = 10
        // if(this.disRadius !== null) { //半径范围变化 尚未完成
        //     this.disRadius = ~~ Math.abs(this.lastRadius - maxRaduis)
        //     if(this.disRadius > 0) {
        //         if(this.lastRadius < maxRaduis) {
        //             this.lastRadius += this.disRadius * ease 
        //         } else {
        //             this.lastRadius -= this.disRadius * ease
        //         }
        //         ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        //         ctx.fill()
        //         ctx.beginPath()
        //         ctx.arc(this.x, this.y, this.lastRadius, 0, 2 * Math.PI, false)
        //         return 
        //     }  
            
        // }
        // this.disRadius = null
        if (dis > 0) {
            if (this.lastX < x) {
                this.lastX += dis * ease
            } else {
                this.lastX -= dis * ease
            }
            if (this.lastY < y) {
                this.lastY += dis * ease
            } else {
                this.lastY -= dis * ease
            }
        } else {
            this.lastX = x
            this.lastY = y
        }
        
        ctx.beginPath()
        ctx.arc(this.lastX, this.lastY, this.radius, 0, 2 * Math.PI, false)
        ctx.fillStyle = color || '#fff'
        ctx.fill()
    }
}


function canvasCircleInit(canvas) {
    var ctx = canvas.getContext('2d')
    var self = this
    for(var i = 0; i < 100; i++) {
        var option = {
            radius: ~~(Math.random() * 3) + 1,
            x: ~~ (Math.random() * self.window.innerWidth),
            y: ~~ (Math.random() * self.window.innerHeight / 2),
            color: 'rgba(255, 255, 255, 0.5'
        }
        var bubble = new Bubble(option)
        circleArr.push(bubble)
    }
    function randomMove(ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        circleArr.forEach(function (item, index) {
            item.draw(ctx, true)
        })
        showCircleArr.forEach(function(item, index) {
            item.draw(ctx)
        })
        setTimeout(randomMove.bind(self, ctx), 10)    
    }
    setTimeout(randomMove.bind(self, ctx), 10)
    
    return circleArr
}
function loadCanvas(value, canvasBg) {
    var fontSize = 100,
        width = calWordWidth(value, fontSize), 
        canvas = document.createElement('canvas')
    canvas.id = 'b_canvas'
    canvas.width = width 
    canvas.height = fontSize
    var ctx = canvas.getContext('2d')
    ctx.font = fontSize + "px Microsoft YaHei"
    ctx.fillStyle = "orange"
    ctx.fillText(value, 0, fontSize / 5 * 4) //轻微调整绘制字符位置
    getImage(canvasBg, canvas, ctx) //导出为图片再导入到canvas获取图像数据
}
function getImage(canvasBg, canvas, ctx) {
    var image = new Image()
    image.src = canvas.toDataURL("image/jpeg")
    image.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(image, 0, 0, this.width, this.height)
        var imageData = ctx.getImageData(0, 0, this.width, this.height)
        var dataLength = imageData.data.length
        var diff = 4
        var newCanvas = document.getElementById('canvas')
        var newCtx = newCanvas.getContext('2d')
        for (var j = 0; j < this.height; j += diff) {
            for (var i = 0; i < this.width; i += diff) {
                var colorNum = 0
                for (var k = 0; k < diff * diff; k++) {
                    var row = k % diff
                    var col = ~~(k / diff)
                    let r = imageData.data[((j + col) * this.width + i + row) * 4 + 0]
                    let g = imageData.data[((j + col) * this.width + i + row) * 4 + 1]
                    let b = imageData.data[((j + col) * this.width + i + row) * 4 + 2]
                    if (r < 10 && g < 10 && b < 10) colorNum++
                }
                if (colorNum < diff * diff / 3 * 2) {
                    var option = {
                        x: i,
                        y: j,
                        radius: 6,
                        color: '#fff',
                        originRadius: ~~(Math.random() * 3) + 1
                    }
                    var bubble = circleArr.pop()
                    if(!bubble) { //如果画布中的粒子数不够应继续添加，同时新的例子出现的位置应该是随机的
                        option.isNew = true
                        var newBubble = new Bubble(option)
                        var newOption = {
                            lastX: ~~ (Math.random() * canvasBg.width), 
                            lastY: ~~ (Math.random() * canvasBg.height), 
                            isNew: true 
                        }
                        newBubble.changeOption(newOption)
                        showCircleArr.push(newBubble)
                    } else {
                        bubble.changeOption(option)
                        showCircleArr.push(bubble)
                    }
                } 
            }
        }
        // document.getElementById('body').appendChild(canvas) //离屏canvas展现到界面中看到渲染效果
    }
}
function calWordWidth(value, fontSize) {
    var arr = value.toString() ? value.toString().split('') : ''
    if(!arr) return
    var reg = /\w/,
        width = 0
    arr.forEach(function (item, index) {
        if (reg.test(item)) {
             width += fontSize //字母宽度
        } else {
             width += fontSize + 10 //汉字宽度
        }
    })
    return width 
}

var self = this
$(document).ready(function() {
    var canvas = document.createElement('canvas'),
        canvasCircleArr
    canvas.id = 'canvas'
    canvas.width = self.window.innerWidth
    canvas.height = self.window.innerHeight / 2
    document.getElementById('drawCanvas').appendChild(canvas)
    $('#btn').click(function () {
        var ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        var value = $('#input').val()
        loadCanvas(value)
    })
})
function Bubble(option) {
    this.width = self.window.innerWidth
    this.height = self.window.innerHeight / 2
    this.radius = option.radius || 6
    this.color = option.color || '#fff'
    this.x = option.x || 0
    this.y = option.y || 0
}
Bubble.prototype.draw = function(ctx, randomMove) {
    var x, y
    x = this.x * 3 + 50,
    y = this.y * 3 + 50
    ctx.beginPath()
    ctx.arc(x, y, this.radius, 0, 2 * Math.PI, false)
    ctx.fillStyle = this.color
    ctx.fill()
}

function loadCanvas(value) {
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
    getImage(canvas, ctx) //导出为图片再导入到canvas获取图像数据
}
function getImage(canvas, ctx) {
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
                        color: '#fff'
                    }
                    var newBubble = new Bubble(option)
                    newBubble.draw(newCtx)
                } 
            }
        }
        // document.getElementById('body').appendChild(canvas) //离屏canvas展现到界面中看到渲染效果
    }
}
function calWordWidth(value, fontSize) {
    var arr = value.split('')
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

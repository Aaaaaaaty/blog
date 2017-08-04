var isFinish = false
var init = function() {
  var url = 'http://lofter.nos.netease.com/sogou-YXIxcWY2Y0t2WTZGWm5rcFE2ZTBZYmozVFpFZ285ZWp0dVhXdWNFOG5MVXJNZExOWFlHQ25jbnpiTTUxcy1vQw.jpg'
  getImgSize(url)
}
var getImgSize = function(imgUrl) {
  var img = new Image()
  img.src = imgUrl
  $('#imgSection').append(img)
  img.onload = function() {
    var that = this
    $('.btn').click(function() {
        if(!isFinish) {
            var imgSize = {
            realHeight: that.height,
            realWidth: that.width
          }
          changeImg(imgSize, img)
        }
        
    })
  }

}
var changeImg = function(imgSize, oldImg) {
  var img = $(oldImg),
      offset = img.offset(),
      imgLeft = offset.left,
      imgTop = offset.top,
      canvasId = 'canvas'
  $('body').append('<canvas id='+ canvasId +' width='+ imgSize.realWidth+' height='+ imgSize.realHeight +'></canvas>')
  $('#'+ canvasId).css({
    'position': 'absolute',
    'left': imgLeft,
    'top': imgTop,
    'z-index': 1
  })
  var oCanvas=document.getElementById(canvasId)
  var content=oCanvas.getContext( "2d" );
  var width = oCanvas.width
  var height = oCanvas.height
    var img = new Image()
    img.src = './test.jpg'
    img.onload = function(){
      content.drawImage(img,0,0)
        var t = 0
        var initY = height
        var scale = 5
        var drawMove = function() {
          var moveSin = function(t) {
            if(initY + scale + 1 > 0) {
              content.drawImage(img,0,0)
              var imgData = content.getImageData(0, 0, width, height)
              for(var i = 0; i < width / 10; i+=0.1 ) {
                x=Math.round(i*10)
                y=Math.round(Math.sin(i - t) * scale + initY)
                  for(var k = 0; k < y; k++) { 
                    var sym = x * 4 + k * width * 4 //每个像素4位，sym表示当前sin曲线下为第几位
                        imgData.data[sym + 3] = 0
                  }
              }
              content.putImageData(imgData, 0, 0, 0, 0, width, height)
              initY-=1
              setTimeout(drawMove, 5)
            } else {
              oldImg.src = oCanvas.toDataURL('image/png')
              isFinish = true
              $(oCanvas).remove()
              $('.btn').html('切换完成')
            }
          }
          moveSin(t+=0.1)
        }
        var timer = setTimeout(drawMove, 0)
    } 
}
init()
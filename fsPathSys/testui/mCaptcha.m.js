var GetCaptcha = function( options ) {
    var defaultOption = { sWidth: 260, sHeight: 120, sCol: 20, sRow: 2, _k: 600 / 750, _kWrapper: 650 / 750, moveImgWidth: 60 } //_k重绘后canvas宽度占页面比 _kWrapper 最外层占页面宽度比
    var psdHeight = 300
    var psdWidth = 650
    var containerId = options.containerId
    var isShow = true;
    var containerIdCss = '#' + containerId
    var buildDom = function() {
      var divString = '<div class="bgColor" id="bgColor"></div><div class="canvasCode">'
      divString += '<div class="canvasWrapper">'
      divString += '<canvas id="canvasMoveImg"></canvas>'
      divString += '<canvas id="canvasBg" width="500" height="400" class="canvas"></canvas>'
      // divString += '<div id="bgPic"></div>'
      divString += '<p class="canvasTip"></p><img class="canvasTipIcon r" src="./images/icon_refresh.png" alt=""></div>'
      divString += '<div class="canvasSlid"><div class="canvasSlidProcess"></div><i class="canvasSlidTip" id="canvasSlidTip"></i></div></div></div>'
      $('#' + containerId).html(divString)
    }
    var buildCss = function() {
      var cssString = '<style> '+ containerIdCss +' *{padding:0 ; margin:0 ;font-family:"微软雅黑";vertical-align:baseline;}.bgColor{position: fixed;background-color: rgba(0, 0, 0, 0.5);width: 100%;height: 100%;z-index:1;display: none;top:0;left:0;}'
      cssString += '.r {float: right;}.canvasCode {display: none;position: absolute; z-index: 1; left: 50%;top: 30%; background-color: #f2f2f2; border-radius: 5%;}'
      cssString += '.canvasWrapper {position: relative;}'
      cssString += '#canvasMoveImg {position: absolute;}#canvasBg {margin: 0 auto;display: block;}.canvasTip, .canvasSlid{display: inline-block;}'
      // cssString += '#bgPic {position: absolute; background-image: url("./images/bgPic.png"); left:0px; top:0px}'
      cssString += '.canvasSlidTip, #canvasMoveImg {-Webkit-Transition: all 0ms linear;-Moz-Transition: all 0ms linear;-O-Transition: all 0ms linear;-Ms-Transition: all 0ms linear;transition: all 0ms linear;}'
      cssString += '.canvasSlid {position: relative;margin: 0 auto;background-color: #fff;}'
      cssString += '.canvasSlidProcess {position: absolute; top:0px; left:0px;}'
      cssString += '.canvasSlidTip {position: absolute;background: url("./images/icon_default.png") 0px 0px no-repeat;display: inline-block;top: -2px;left: -1px;}'
      cssString += '.appendChild {color: #fff; background-color: rgba(0,0,0,0.5)}'
      cssString += '.code_mistake {color: #fff;}.code_ok {color: #fff;}</style>'
      $('#' + containerId).append(cssString)
    }
    var canvasRedraw = function(appId, capTicket, callback) {
        $.ajax({
          type : "get",
          url : "https://captchas.wanmei.com/mCaptcha/key",
          data : {appId:appId,capTicket:capTicket},
          dataType : "jsonp",
          success : function(data) {
            if(data.code === 0) {
                mCapchatKey = data.result
                var mCaptchaImg = "https://captchas.wanmei.com/mCaptcha/img/"+mCapchatKey
                var mCaptchaLoc = "https://captchas.wanmei.com/mCaptcha/loc/"+mCapchatKey
                $.ajax({
                  type: 'get',
                  url: mCaptchaLoc,
                  dataType: 'jsonp',
                  success: function(data) {
                    if(data.code === 0 ) {
              releaseLeft=0;
                      var result = data.result
                      var imageObjBg = new Image()
                      var imageObjMoveImg = new Image()
                      imageObjMoveImg.src = mCaptchaImg
                      imageObjBg.src = mCaptchaImg
                      imageObjBg.onload = function() {
                        initTime = new Date().getTime();
                        $.each(result, function(index, item) {
                          item = item + 1
                          index = index + 1
                          var sXIndex = index % sCol === 0 ? sCol - 1 : index % sCol - 1
                          var xIndex = item % sCol === 0 ? sCol - 1 : item % sCol - 1
                          var sYIndex = Math.floor(index / sCol) === index / sCol ? index / sCol - 1 : Math.floor(index / sCol)
                          var yIndex = Math.floor(item / sCol) === item / sCol ? item / sCol - 1 : Math.floor(item / sCol)
                          var posSliceX = xIndex * sliceWidth
                          var posSliceY = yIndex * sliceHeight
                          var posDestinationX = sXIndex * destinationWidth
                          var posDestinationY = sYIndex * destinationHeight
                          contextBg.drawImage(imageObjBg, posSliceX, posSliceY, sliceWidth, sliceHeight, posDestinationX, posDestinationY, destinationWidth, destinationHeight)
                        })
                      }
                      imageObjMoveImg.onload = function() {
                        contextMoveImg.drawImage(imageObjMoveImg, sWidth + 1, 0, moveImgWidth, sHeight, 0, 0, moveImgWidth * scale, sHeight * scale) //sWidth + 1的原因为 切图在正好sWidth时仍有边界故 + 1，消除边线
                      }
                    }else{
            canReload=false;
            canTipMove = false;
            resultError(data.message);
            }
                  }
                  })
            }else{
          canReload=false;
                  canTipMove = false
                  resultError(data.message);
      }
          }
        })
        var canvasBg = document.getElementById('canvasBg')
        var canvasMoveImg = document.getElementById('canvasMoveImg')
        var contextBg = canvasBg.getContext('2d')
        var contextMoveImg = canvasMoveImg.getContext('2d')
        var canvasWrapper = $('.canvasWrapper')
        var innerWidth = window.innerWidth
        var sWidth = defaultOption.sWidth
        var sHeight = defaultOption.sHeight
        var sCol = defaultOption.sCol
        var sRow = defaultOption.sRow
        var _k = defaultOption._k
        var _kWrapper = defaultOption._kWrapper
        var moveImgWidth = defaultOption.moveImgWidth
        var sliceWidth = sWidth / sCol
        var sliceHeight = sHeight / sRow
        var scale = innerWidth * _kWrapper / sWidth
        var destinationWidth = sliceWidth * scale
        var destinationHeight = sliceHeight * scale
        canvasBg.width = innerWidth * _kWrapper
        canvasBg.height = sHeight * scale // 重绘画布令其在移动端横向占比为_k
        canvasMoveImg.width = moveImgWidth * scale
        canvasMoveImg.height = sHeight * scale
        canvasWrapper.width( innerWidth * _kWrapper).height( innerWidth * _kWrapper / ( psdWidth / psdHeight ))//计算外层高度，通过psd宽度和高度初始比例
        var wrapperHeight = canvasWrapper.height()
        var wrapperWidth = canvasWrapper.width()
        var canvasCode = $('.canvasCode')
        var $_canvasBg = $('#canvasBg')
        var $_bgPic = $('#bgPic')
        var $_canvasMoveImg = $('#canvasMoveImg')
        var canvasTip = $('.canvasTip')
        var canvasTipIcon = $('.canvasTipIcon')
        var canvasSlid = $('.canvasSlid')
        var canvasSlidProcess = $('.canvasSlidProcess')
        var canvasSlidIcon = $('.canvasSlidIcon')
        var canvasSlidTip = $('.canvasSlidTip')
        var getPx = function(px, type) {
          if(type === 'height') return wrapperHeight / psdHeight * px //计算当前device-width下psd换算到真实宽度比例，用法：组件宽度 / 比例
          if(type === 'width') return wrapperWidth / psdWidth * px
        }
        $_bgPic.width(innerWidth * _kWrapper).height(sHeight * scale).css({
          'top': getPx(18, 'height'),
          'background-size': 'cover'
        })
        canvasCode.css({  'margin-left': - (wrapperWidth + getPx(60, 'width')) / 2, //手动添加的外层边距
                          'padding-top': getPx(20, 'height'),
                          'padding-left': getPx(30, 'width'),
                          'padding-right': getPx(30, 'width'),
                        })
        canvasWrapper.css({  'margin-left': getPx(0, 'width'),
                              'padding-top': getPx(18, 'width'),
                          })
        $_canvasMoveImg.css({ 'margin-left': (canvasWrapper.width() - canvasBg.width) / 2})
        canvasTip.css({ 'position': 'absolute',
                        'left': 0,
                        'bottom': getPx(-18, 'height'),
                        'width': '100%',
                        'text-align': 'center',
                        'margin-top':  getPx(20, 'height'),
                        'font-size': getPx(30, 'height')})
        canvasTipIcon.css({ 'width': getPx(44, 'width'),
                            'position': 'absolute',
                            'top':  getPx(30, 'height'),
                            'right':getPx(12, 'width')})
        canvasSlid.css({  'width': innerWidth * _kWrapper,
                          'height':  getPx(64, 'height'),
                          'margin-top': getPx(38, 'height')})
        canvasSlidProcess.css({ 'height':  getPx(64, 'height'),
                                'width': 0
                              })
        canvasSlidTip.css({   'width': getPx(121, 'width'),
                              'height': getPx(87, 'width'),
                              'position': 'relative',
                              'background-position': '-1px 0px',
                              'top': getPx(-6, 'height'),})
        var startX = 0
        var moveX = 0
        var endX = 0
        var canTipMove = true
        var canReload = true
        var transition = function(speed, target, value) {
          var obj = {
            '-Webkit-Transition': 'all '+ speed +'ms linear',
            '-Moz-Transition': 'all '+ speed +'ms linear',
            '-O-Transition': 'all '+ speed +'ms linear',
            '-Ms-Transition': 'all '+ speed +'ms linear',
            'transition': 'all '+ speed +'ms linear'
          }
          if(target) {
            obj[target] = value
          }
          return obj
        }
        var resultSuccess = function() {
            if(callback){
                callback()
            }
          $('.appendChild').remove();
          canvasTip.append('<div class="appendChild"><span class="code_ok">验证码通过</span></div>')
          canvasSlidProcess.css({
            'background-color': '#3cd05e'
          })
          canvasSlidTip.css({
            'background-image': 'url("./images/icon_success.png")'
          })
          setTimeout(function() {
            $('.canvasCode, #bgColor').hide();
              isShow = true;
              console.log(123)
          }, 1500)
        }
        var resultFail = function() {}
        var resultError = function(msg) {
          $('.appendChild').remove();
          canvasTip.append('<div class="appendChild"><span class="code_mistake">错误：</span><span>'+msg+'</span></div>')
          canvasSlidTip.css({
              'background-image': 'url("./images/icon_fail.png")'
          })
          setTimeout(function() {
            releaseLeft=0;
            endX = 0
            canvasSlidProcess.css(transition(500, 'width', 0)).css({
              'background-color': '#cc0000'
            })

            canvasSlidTip.css(transition(500, 'left', -1))

            $_canvasMoveImg.css(transition(500, 'left', 0))
            setTimeout(function() {
              canvasSlidTip.css({
                'background-image': 'url("./images/icon_default.png")'
              }).css(transition(0))
            }, 500)
          }, 300)
        }
        var touchstart = function(e) {
          e.preventDefault()
          if(canTipMove) {
            startX = e.originalEvent.touches[0].clientX
            $('.appendChild').remove()
            canvasSlidTip.css(transition(0, 'left', -1))
            $_canvasMoveImg.css(transition(0, 'left', 0))
          } else {
            e.preventDefault()
          }
        }
        var touchmove = function(e) {
          if(canTipMove) {
            moveX = e.originalEvent.touches[0].clientX - startX + endX
            var maxX = canvasBg.width - canvasMoveImg.width
            if(moveX < 0) moveX = 0
            if(moveX > maxX) moveX = maxX
            e.target.style.left = moveX + 'px'
            $_canvasMoveImg.css({left: moveX})
            canvasSlidProcess.css({
              'width': moveX,
              'background-color': '#818181'
            }).css(transition(0))
          }
        }
        function encKey(srcKey){
      return srcKey.substring(1,3)+srcKey.substring(10,13)+srcKey.substring(20,22)+srcKey.substring(26,31)+srcKey.substring(21,25);
    }
    var releaseLeft=0;
    var initTime;
        var touchend = function(e) {
          if(canTipMove) {
            if(initTime){
          validateTimeMilSec = new Date().getTime() - initTime;
        }else{
          validateTimeMilSec = 0;
        }
              releaseLeft = moveX/scale+9;
        var validData = {length:releaseLeft, validateTimeMilSec:validateTimeMilSec};
        var cipherText = Encrypt(JSON.stringify(validData),encKey(capTicket));

        $.ajax({
          type : "get",
          url : "https://captchas.wanmei.com/mCaptcha/validate",
          data : {capKey:mCapchatKey,validData:cipherText},
          dataType : "jsonp",
          success : function(data) {
            if (data.code==0){
              secCode=data.result;
                canReload=false;
                canTipMove = false;
                resultSuccess();
            }else if (data.code==-2){ //-2验证次数过多，-1验证失败
              canTipMove = false;
              resultError(data.message);
            }else{
              resultError(data.message);
            }
          }
        });
          }
        }
        var reLoadCanvas = function() {
          if(canReload) {
            canTipMove = true
            $('.appendChild').remove();
            $.ajax({
              type : "get",
              url : "https://captchas.wanmei.com/mCaptcha/key",
              data : {appId:appId,capTicket:capTicket},
              dataType : "jsonp",
              success : function(data) {
                if(data.code === 0) {
                    releaseLeft=0;
                    mCapchatKey = data.result
                    var mCaptchaImg = "https://captchas.wanmei.com/mCaptcha/img/"+mCapchatKey
            var mCaptchaLoc = "https://captchas.wanmei.com/mCaptcha/loc/"+mCapchatKey
                    $.ajax({
                      type: 'get',
                      url: mCaptchaLoc,
                      dataType: 'jsonp',
                      success: function(data) {
                        if(data.code === 0 ) {
                          var result = data.result
                          var imageObjBg = new Image()
                          var imageObjMoveImg = new Image()
                          imageObjMoveImg.src = mCaptchaImg
                          imageObjBg.src = mCaptchaImg
                          imageObjBg.onload = function() {
              initTime = new Date().getTime();
                            $.each(result, function(index, item) {
                              item = item + 1
                              index = index + 1
                              var sXIndex = index % sCol === 0 ? sCol - 1 : index % sCol - 1
                              var xIndex = item % sCol === 0 ? sCol - 1 : item % sCol - 1
                              var sYIndex = Math.floor(index / sCol) === index / sCol ? index / sCol - 1 : Math.floor(index / sCol)
                              var yIndex = Math.floor(item / sCol) === item / sCol ? item / sCol - 1 : Math.floor(item / sCol)
                              var posSliceX = xIndex * sliceWidth
                              var posSliceY = yIndex * sliceHeight
                              var posDestinationX = sXIndex * destinationWidth
                              var posDestinationY = sYIndex * destinationHeight
                              contextBg.drawImage(imageObjBg, posSliceX, posSliceY, sliceWidth, sliceHeight, posDestinationX, posDestinationY, destinationWidth, destinationHeight)
                            })
                          }
                          imageObjMoveImg.onload = function() {
                            canvasMoveImg.height = sHeight * scale
                            contextMoveImg.drawImage(imageObjMoveImg, sWidth + 1, 0, moveImgWidth, sHeight, 0, 0, moveImgWidth * scale, sHeight * scale) //sWidth + 1的原因为 切图在正好sWidth时仍有边界故 + 1，消除边线
                          }
                        }else{
              canReload=false;
              canTipMove = false
              resultError(data.message);
            }
                      }
                      })
                }
                else{
          canReload=false;
                  canTipMove = false
                  resultError(data.message);
    }
              }
            })
          }
        }
        $('#canvasSlidTip').on('touchstart', touchstart)
        $('#canvasSlidTip').on('touchmove', touchmove)
        $('#canvasSlidTip').on('touchend', touchend)
        $('.canvasTipIcon').on('click', reLoadCanvas)
      }

  var secCode;
  function getValidateResult(){
    return secCode;

  }
  var appId;
  var capTicket;
  var callback;
   var init = function( initOption ) {
        appId = initOption.appId
        capTicket = initOption.capTicket
        bindId = initOption.bindBtn
        callback = initOption.callback
        buildDom()
        buildCss()
        canvasRedraw(appId, capTicket,callback)
        bindClick(bindId)
      }
  var bindClick = function(bindId) {
    $(bindId).off("click.bindclick");
    $(bindId).on("click.bindclick",function() {

      if(isShow) {
        $('.canvasCode, .bgColor').css({'display': 'block'})
        isShow = false
      }
    })
    $('#bgColor').click(function() {
        $('.canvasCode, .bgColor').hide()
        isShow = true
        console.log(123444)
      })
  }
    return {
      'init': init,
      'getValidateResult':getValidateResult
    }
  }

function Encrypt(word,key){
  key = CryptoJS.enc.Utf8.parse(key);
    srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: key,mode:CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7});
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}

var CryptoJS=CryptoJS||function(u,p){var d={},l=d.lib={},s=function(){},t=l.Base={extend:function(a){s.prototype=this;var c=new s;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
r=l.WordArray=t.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=p?c:4*a.length},toString:function(a){return(a||v).stringify(this)},concat:function(a){var c=this.words,e=a.words,j=this.sigBytes;a=a.sigBytes;this.clamp();if(j%4)for(var k=0;k<a;k++)c[j+k>>>2]|=(e[k>>>2]>>>24-8*(k%4)&255)<<24-8*((j+k)%4);else if(65535<e.length)for(k=0;k<a;k+=4)c[j+k>>>2]=e[k>>>2];else c.push.apply(c,e);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=u.ceil(c/4)},clone:function(){var a=t.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],e=0;e<a;e+=4)c.push(4294967296*u.random()|0);return new r.init(c,a)}}),w=d.enc={},v=w.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++){var k=c[j>>>2]>>>24-8*(j%4)&255;e.push((k>>>4).toString(16));e.push((k&15).toString(16))}return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j+=2)e[j>>>3]|=parseInt(a.substr(j,
2),16)<<24-4*(j%8);return new r.init(e,c/2)}},b=w.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++)e.push(String.fromCharCode(c[j>>>2]>>>24-8*(j%4)&255));return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j++)e[j>>>2]|=(a.charCodeAt(j)&255)<<24-8*(j%4);return new r.init(e,c)}},x=w.Utf8={stringify:function(a){try{return decodeURIComponent(escape(b.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return b.parse(unescape(encodeURIComponent(a)))}},
q=l.BufferedBlockAlgorithm=t.extend({reset:function(){this._data=new r.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=x.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,e=c.words,j=c.sigBytes,k=this.blockSize,b=j/(4*k),b=a?u.ceil(b):u.max((b|0)-this._minBufferSize,0);a=b*k;j=u.min(4*a,j);if(a){for(var q=0;q<a;q+=k)this._doProcessBlock(e,q);q=e.splice(0,a);c.sigBytes-=j}return new r.init(q,j)},clone:function(){var a=t.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});l.Hasher=q.extend({cfg:t.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){q.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,e){return(new a.init(e)).finalize(b)}},_createHmacHelper:function(a){return function(b,e){return(new n.HMAC.init(a,
e)).finalize(b)}}});var n=d.algo={};return d}(Math);
(function(){var u=CryptoJS,p=u.lib.WordArray;u.enc.Base64={stringify:function(d){var l=d.words,p=d.sigBytes,t=this._map;d.clamp();d=[];for(var r=0;r<p;r+=3)for(var w=(l[r>>>2]>>>24-8*(r%4)&255)<<16|(l[r+1>>>2]>>>24-8*((r+1)%4)&255)<<8|l[r+2>>>2]>>>24-8*((r+2)%4)&255,v=0;4>v&&r+0.75*v<p;v++)d.push(t.charAt(w>>>6*(3-v)&63));if(l=t.charAt(64))for(;d.length%4;)d.push(l);return d.join("")},parse:function(d){var l=d.length,s=this._map,t=s.charAt(64);t&&(t=d.indexOf(t),-1!=t&&(l=t));for(var t=[],r=0,w=0;w<
l;w++)if(w%4){var v=s.indexOf(d.charAt(w-1))<<2*(w%4),b=s.indexOf(d.charAt(w))>>>6-2*(w%4);t[r>>>2]|=(v|b)<<24-8*(r%4);r++}return p.create(t,r)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
(function(u){function p(b,n,a,c,e,j,k){b=b+(n&a|~n&c)+e+k;return(b<<j|b>>>32-j)+n}function d(b,n,a,c,e,j,k){b=b+(n&c|a&~c)+e+k;return(b<<j|b>>>32-j)+n}function l(b,n,a,c,e,j,k){b=b+(n^a^c)+e+k;return(b<<j|b>>>32-j)+n}function s(b,n,a,c,e,j,k){b=b+(a^(n|~c))+e+k;return(b<<j|b>>>32-j)+n}for(var t=CryptoJS,r=t.lib,w=r.WordArray,v=r.Hasher,r=t.algo,b=[],x=0;64>x;x++)b[x]=4294967296*u.abs(u.sin(x+1))|0;r=r.MD5=v.extend({_doReset:function(){this._hash=new w.init([1732584193,4023233417,2562383102,271733878])},
_doProcessBlock:function(q,n){for(var a=0;16>a;a++){var c=n+a,e=q[c];q[c]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360}var a=this._hash.words,c=q[n+0],e=q[n+1],j=q[n+2],k=q[n+3],z=q[n+4],r=q[n+5],t=q[n+6],w=q[n+7],v=q[n+8],A=q[n+9],B=q[n+10],C=q[n+11],u=q[n+12],D=q[n+13],E=q[n+14],x=q[n+15],f=a[0],m=a[1],g=a[2],h=a[3],f=p(f,m,g,h,c,7,b[0]),h=p(h,f,m,g,e,12,b[1]),g=p(g,h,f,m,j,17,b[2]),m=p(m,g,h,f,k,22,b[3]),f=p(f,m,g,h,z,7,b[4]),h=p(h,f,m,g,r,12,b[5]),g=p(g,h,f,m,t,17,b[6]),m=p(m,g,h,f,w,22,b[7]),
f=p(f,m,g,h,v,7,b[8]),h=p(h,f,m,g,A,12,b[9]),g=p(g,h,f,m,B,17,b[10]),m=p(m,g,h,f,C,22,b[11]),f=p(f,m,g,h,u,7,b[12]),h=p(h,f,m,g,D,12,b[13]),g=p(g,h,f,m,E,17,b[14]),m=p(m,g,h,f,x,22,b[15]),f=d(f,m,g,h,e,5,b[16]),h=d(h,f,m,g,t,9,b[17]),g=d(g,h,f,m,C,14,b[18]),m=d(m,g,h,f,c,20,b[19]),f=d(f,m,g,h,r,5,b[20]),h=d(h,f,m,g,B,9,b[21]),g=d(g,h,f,m,x,14,b[22]),m=d(m,g,h,f,z,20,b[23]),f=d(f,m,g,h,A,5,b[24]),h=d(h,f,m,g,E,9,b[25]),g=d(g,h,f,m,k,14,b[26]),m=d(m,g,h,f,v,20,b[27]),f=d(f,m,g,h,D,5,b[28]),h=d(h,f,
m,g,j,9,b[29]),g=d(g,h,f,m,w,14,b[30]),m=d(m,g,h,f,u,20,b[31]),f=l(f,m,g,h,r,4,b[32]),h=l(h,f,m,g,v,11,b[33]),g=l(g,h,f,m,C,16,b[34]),m=l(m,g,h,f,E,23,b[35]),f=l(f,m,g,h,e,4,b[36]),h=l(h,f,m,g,z,11,b[37]),g=l(g,h,f,m,w,16,b[38]),m=l(m,g,h,f,B,23,b[39]),f=l(f,m,g,h,D,4,b[40]),h=l(h,f,m,g,c,11,b[41]),g=l(g,h,f,m,k,16,b[42]),m=l(m,g,h,f,t,23,b[43]),f=l(f,m,g,h,A,4,b[44]),h=l(h,f,m,g,u,11,b[45]),g=l(g,h,f,m,x,16,b[46]),m=l(m,g,h,f,j,23,b[47]),f=s(f,m,g,h,c,6,b[48]),h=s(h,f,m,g,w,10,b[49]),g=s(g,h,f,m,
E,15,b[50]),m=s(m,g,h,f,r,21,b[51]),f=s(f,m,g,h,u,6,b[52]),h=s(h,f,m,g,k,10,b[53]),g=s(g,h,f,m,B,15,b[54]),m=s(m,g,h,f,e,21,b[55]),f=s(f,m,g,h,v,6,b[56]),h=s(h,f,m,g,x,10,b[57]),g=s(g,h,f,m,t,15,b[58]),m=s(m,g,h,f,D,21,b[59]),f=s(f,m,g,h,z,6,b[60]),h=s(h,f,m,g,C,10,b[61]),g=s(g,h,f,m,j,15,b[62]),m=s(m,g,h,f,A,21,b[63]);a[0]=a[0]+f|0;a[1]=a[1]+m|0;a[2]=a[2]+g|0;a[3]=a[3]+h|0},_doFinalize:function(){var b=this._data,n=b.words,a=8*this._nDataBytes,c=8*b.sigBytes;n[c>>>5]|=128<<24-c%32;var e=u.floor(a/
4294967296);n[(c+64>>>9<<4)+15]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360;n[(c+64>>>9<<4)+14]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360;b.sigBytes=4*(n.length+1);this._process();b=this._hash;n=b.words;for(a=0;4>a;a++)c=n[a],n[a]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360;return b},clone:function(){var b=v.clone.call(this);b._hash=this._hash.clone();return b}});t.MD5=v._createHelper(r);t.HmacMD5=v._createHmacHelper(r)})(Math);
(function(){var u=CryptoJS,p=u.lib,d=p.Base,l=p.WordArray,p=u.algo,s=p.EvpKDF=d.extend({cfg:d.extend({keySize:4,hasher:p.MD5,iterations:1}),init:function(d){this.cfg=this.cfg.extend(d)},compute:function(d,r){for(var p=this.cfg,s=p.hasher.create(),b=l.create(),u=b.words,q=p.keySize,p=p.iterations;u.length<q;){n&&s.update(n);var n=s.update(d).finalize(r);s.reset();for(var a=1;a<p;a++)n=s.finalize(n),s.reset();b.concat(n)}b.sigBytes=4*q;return b}});u.EvpKDF=function(d,l,p){return s.create(p).compute(d,
l)}})();
CryptoJS.lib.Cipher||function(u){var p=CryptoJS,d=p.lib,l=d.Base,s=d.WordArray,t=d.BufferedBlockAlgorithm,r=p.enc.Base64,w=p.algo.EvpKDF,v=d.Cipher=t.extend({cfg:l.extend(),createEncryptor:function(e,a){return this.create(this._ENC_XFORM_MODE,e,a)},createDecryptor:function(e,a){return this.create(this._DEC_XFORM_MODE,e,a)},init:function(e,a,b){this.cfg=this.cfg.extend(b);this._xformMode=e;this._key=a;this.reset()},reset:function(){t.reset.call(this);this._doReset()},process:function(e){this._append(e);return this._process()},
finalize:function(e){e&&this._append(e);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(e){return{encrypt:function(b,k,d){return("string"==typeof k?c:a).encrypt(e,b,k,d)},decrypt:function(b,k,d){return("string"==typeof k?c:a).decrypt(e,b,k,d)}}}});d.StreamCipher=v.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var b=p.mode={},x=function(e,a,b){var c=this._iv;c?this._iv=u:c=this._prevBlock;for(var d=0;d<b;d++)e[a+d]^=
c[d]},q=(d.BlockCipherMode=l.extend({createEncryptor:function(e,a){return this.Encryptor.create(e,a)},createDecryptor:function(e,a){return this.Decryptor.create(e,a)},init:function(e,a){this._cipher=e;this._iv=a}})).extend();q.Encryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize;x.call(this,e,a,c);b.encryptBlock(e,a);this._prevBlock=e.slice(a,a+c)}});q.Decryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize,d=e.slice(a,a+c);b.decryptBlock(e,a);x.call(this,
e,a,c);this._prevBlock=d}});b=b.CBC=q;q=(p.pad={}).Pkcs7={pad:function(a,b){for(var c=4*b,c=c-a.sigBytes%c,d=c<<24|c<<16|c<<8|c,l=[],n=0;n<c;n+=4)l.push(d);c=s.create(l,c);a.concat(c)},unpad:function(a){a.sigBytes-=a.words[a.sigBytes-1>>>2]&255}};d.BlockCipher=v.extend({cfg:v.cfg.extend({mode:b,padding:q}),reset:function(){v.reset.call(this);var a=this.cfg,b=a.iv,a=a.mode;if(this._xformMode==this._ENC_XFORM_MODE)var c=a.createEncryptor;else c=a.createDecryptor,this._minBufferSize=1;this._mode=c.call(a,
this,b&&b.words)},_doProcessBlock:function(a,b){this._mode.processBlock(a,b)},_doFinalize:function(){var a=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){a.pad(this._data,this.blockSize);var b=this._process(!0)}else b=this._process(!0),a.unpad(b);return b},blockSize:4});var n=d.CipherParams=l.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}}),b=(p.format={}).OpenSSL={stringify:function(a){var b=a.ciphertext;a=a.salt;return(a?s.create([1398893684,
1701076831]).concat(a).concat(b):b).toString(r)},parse:function(a){a=r.parse(a);var b=a.words;if(1398893684==b[0]&&1701076831==b[1]){var c=s.create(b.slice(2,4));b.splice(0,4);a.sigBytes-=16}return n.create({ciphertext:a,salt:c})}},a=d.SerializableCipher=l.extend({cfg:l.extend({format:b}),encrypt:function(a,b,c,d){d=this.cfg.extend(d);var l=a.createEncryptor(c,d);b=l.finalize(b);l=l.cfg;return n.create({ciphertext:b,key:c,iv:l.iv,algorithm:a,mode:l.mode,padding:l.padding,blockSize:a.blockSize,formatter:d.format})},
decrypt:function(a,b,c,d){d=this.cfg.extend(d);b=this._parse(b,d.format);return a.createDecryptor(c,d).finalize(b.ciphertext)},_parse:function(a,b){return"string"==typeof a?b.parse(a,this):a}}),p=(p.kdf={}).OpenSSL={execute:function(a,b,c,d){d||(d=s.random(8));a=w.create({keySize:b+c}).compute(a,d);c=s.create(a.words.slice(b),4*c);a.sigBytes=4*b;return n.create({key:a,iv:c,salt:d})}},c=d.PasswordBasedCipher=a.extend({cfg:a.cfg.extend({kdf:p}),encrypt:function(b,c,d,l){l=this.cfg.extend(l);d=l.kdf.execute(d,
b.keySize,b.ivSize);l.iv=d.iv;b=a.encrypt.call(this,b,c,d.key,l);b.mixIn(d);return b},decrypt:function(b,c,d,l){l=this.cfg.extend(l);c=this._parse(c,l.format);d=l.kdf.execute(d,b.keySize,b.ivSize,c.salt);l.iv=d.iv;return a.decrypt.call(this,b,c,d.key,l)}})}();
(function(){for(var u=CryptoJS,p=u.lib.BlockCipher,d=u.algo,l=[],s=[],t=[],r=[],w=[],v=[],b=[],x=[],q=[],n=[],a=[],c=0;256>c;c++)a[c]=128>c?c<<1:c<<1^283;for(var e=0,j=0,c=0;256>c;c++){var k=j^j<<1^j<<2^j<<3^j<<4,k=k>>>8^k&255^99;l[e]=k;s[k]=e;var z=a[e],F=a[z],G=a[F],y=257*a[k]^16843008*k;t[e]=y<<24|y>>>8;r[e]=y<<16|y>>>16;w[e]=y<<8|y>>>24;v[e]=y;y=16843009*G^65537*F^257*z^16843008*e;b[k]=y<<24|y>>>8;x[k]=y<<16|y>>>16;q[k]=y<<8|y>>>24;n[k]=y;e?(e=z^a[a[a[G^z]]],j^=a[a[j]]):e=j=1}var H=[0,1,2,4,8,
16,32,64,128,27,54],d=d.AES=p.extend({_doReset:function(){for(var a=this._key,c=a.words,d=a.sigBytes/4,a=4*((this._nRounds=d+6)+1),e=this._keySchedule=[],j=0;j<a;j++)if(j<d)e[j]=c[j];else{var k=e[j-1];j%d?6<d&&4==j%d&&(k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255]):(k=k<<8|k>>>24,k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255],k^=H[j/d|0]<<24);e[j]=e[j-d]^k}c=this._invKeySchedule=[];for(d=0;d<a;d++)j=a-d,k=d%4?e[j]:e[j-4],c[d]=4>d||4>=j?k:b[l[k>>>24]]^x[l[k>>>16&255]]^q[l[k>>>
8&255]]^n[l[k&255]]},encryptBlock:function(a,b){this._doCryptBlock(a,b,this._keySchedule,t,r,w,v,l)},decryptBlock:function(a,c){var d=a[c+1];a[c+1]=a[c+3];a[c+3]=d;this._doCryptBlock(a,c,this._invKeySchedule,b,x,q,n,s);d=a[c+1];a[c+1]=a[c+3];a[c+3]=d},_doCryptBlock:function(a,b,c,d,e,j,l,f){for(var m=this._nRounds,g=a[b]^c[0],h=a[b+1]^c[1],k=a[b+2]^c[2],n=a[b+3]^c[3],p=4,r=1;r<m;r++)var q=d[g>>>24]^e[h>>>16&255]^j[k>>>8&255]^l[n&255]^c[p++],s=d[h>>>24]^e[k>>>16&255]^j[n>>>8&255]^l[g&255]^c[p++],t=
d[k>>>24]^e[n>>>16&255]^j[g>>>8&255]^l[h&255]^c[p++],n=d[n>>>24]^e[g>>>16&255]^j[h>>>8&255]^l[k&255]^c[p++],g=q,h=s,k=t;q=(f[g>>>24]<<24|f[h>>>16&255]<<16|f[k>>>8&255]<<8|f[n&255])^c[p++];s=(f[h>>>24]<<24|f[k>>>16&255]<<16|f[n>>>8&255]<<8|f[g&255])^c[p++];t=(f[k>>>24]<<24|f[n>>>16&255]<<16|f[g>>>8&255]<<8|f[h&255])^c[p++];n=(f[n>>>24]<<24|f[g>>>16&255]<<16|f[h>>>8&255]<<8|f[k&255])^c[p++];a[b]=q;a[b+1]=s;a[b+2]=t;a[b+3]=n},keySize:8});u.AES=p._createHelper(d)})();

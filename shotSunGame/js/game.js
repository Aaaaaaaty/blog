$(function() {
      var game = $('#game'),
          canvasW = 0,
          canvasH = 0,
          score = 0,
          gongWidth = 0,
          gongHeight = 0,
          targetTimer = 0,
          defaultOption = {
            _k: 1, //画布高占屏幕比例
            _g: 0.4, //弓箭占屏幕比例
            _a: 201 / 1630, //箭占弓的比例
            _s: 0.2 //分数占屏幕比例
          },
          isShot = false, //箭完成发射
          lastId = 0, //计算分数前一个id
          isCold = false,
          hinderOPtion = {
            startY: 0.4, //障碍绘制区域所在相对于画布的位置弓·
            endY: 0.6,
            minWidth: 0.15, //与屏幕宽度比值
            maxWidth: 0.2,
            minSpeedX: 35,
            maxSpeedX: 40
          },
          targetOption = {
            startY: 0,
            endY: 0.4,
            minWidth: 0.1,
            midWidth: 0.2,
            maxWidth: 0.3,
            minTime: 3000,
            maxTime: 5000,
          },
          arrowOption = {
            speedX: 0,
            speedY: 0
          },
          hinderArray = [],
          targetArray = [],
          arrowArray = [],
          i = 0,//设定加载障碍频率
          j = 0 //设定加载目标频率
      function drawGame(defaultOption) {
        canvasW = window.innerWidth
        canvasH = window.innerHeight * defaultOption._k
          game.width(canvasW).height(canvasH)
          $('body').css({
            'background': 'url("./images/bg.png")',
            'background-size': 'cover',
            'overflow': 'hidden'
          })
          $('#footer').width(canvasW)
          var newGong = new Image()
          newGong.src = './images/gong.png'
          newGong.id = 'gong'
          newGong.onload = function() {
            gongWidth = canvasW * defaultOption._g
            gongHeight = gongWidth * newGong.height / newGong.width
            $(newGong).css({
              'width': gongWidth,
              'margin-left': -canvasW * defaultOption._g / 2
            }).addClass('gong')
            game.append(newGong)
            
          }
          eventLoop()
      }
      function eventLoop() {
        eventLoopHinder()
        clearHinder()
        eventLoopTarget()
        clearTarget()
        touchEvent()
      }
      function Hinder(id, type, startY, width, speedX) {
        this.id = id || ''
        this.type = type || Math.random() > 0.5 ? 0 : 1 //从左侧还是右侧进入；0左侧，1右侧
        this.x = this.type === 0 ? 0 : canvasW
        this.y = startY || random(hinderOPtion.startY * canvasH, hinderOPtion.endY * canvasH)
        this.width = width || random(hinderOPtion.minWidth * canvasW, hinderOPtion.maxWidth * canvasW)
        this.speedX = speedX / 10 || random(hinderOPtion.minSpeedX, hinderOPtion.maxSpeedX) / 10
        this.shot = false
        this.score = -30
      }
      Hinder.prototype.draw = function() {
        var img = new Image(),
            _self = this
        img.src = './images/dadiao.gif'
        img.id = _self.id
        img.onload = function() {
          if(_self.type) {
            $(img).css({
              'left': canvasW + _self.width
            })
          } else {
            $(img).css({
              'left': -_self.width,
              'transform':'rotateY(180deg)',
              '-ms-transform':'rotateY(180deg)',  /* IE 9 */
              '-moz-transform':'rotateY(180deg)',   /* Firefox */
              '-webkit-transform':'rotateY(180deg)', /* Safari 和 Chrome */
              '-o-transform':'rotateY(180deg)'
            })
          }
          $(img).css({
            'transition-property': 'left',
            '-moz-transition-property': 'left', /* Firefox 4 */
            '-webkit-transition-property': 'left', /* Safari 和 Chrome */
            '-o-transition-property': 'left', /* Opera */
            'transition-timing-function': 'linear',
            '-moz-transition-timing-function': 'linear', /* Firefox 4 */
            '-webkit-transition-timing-function': 'linear', /* Safari 和 Chrome */
            '-o-transition-timing-function': 'linear', /* Opera */
            'transition-duration': _self.speedX + 's',
            '-moz-transition-duration': _self.speedX + 's', /* Firefox 4 */
            '-webkit-transition-duration': _self.speedX + 's', /* Safari 和 Chrome */
            '-o-transition-duration': _self.speedX + 's', /* Opera */
            'width':_self.width,
            'top': _self.y,
          }).addClass('hinder')
          game.append(img)
          setTimeout(function() {
            if(_self.type) {
              $(img).css({
                'left': - _self.width,
              })
            } else {
              $(img).css({
                'left': canvasW,
              })
            }
            _self.shot = true
          }, 100)
        }
      }
      Hinder.prototype.angle = function() {
        var left = parseInt($('#' + this.id).css('left'))
        if(left > canvasW) left = canvasW
        if(left < 0) left = 0
        var anglemax = Math.atan2( canvasH - this.y - gongHeight / 2, left - canvasW / 2)
        var anglemin = Math.atan2( canvasH - this.y - gongHeight / 2, left + this.width - canvasW / 2 )
        function angleCal(angle) {
          return (angle / Math.PI * 180) < 0 ? angle / Math.PI * 180 - 90 : angle / Math.PI * 180
        }
        var angleMax = angleCal(anglemax)
        var angleMmin = angleCal(anglemin)
        return {
          max: angleMax,
          min: angleMmin
        }
      }
      function Target(id, nowTime, width, score, x, y, time) {
        this.id = id
        this.width = width * canvasW || random(targetOption.minWidth * canvasW, targetOption.maxWidth * canvasW)
        this.x = x || random(0, canvasW - this.width)
        this.y = y || random(targetOption.startY * canvasH, targetOption.endY * canvasH - this.width)
        this.time = time || random(targetOption.minTime, targetOption.maxTime)
        this.now = nowTime
        this.score = score
      }
      Target.prototype.draw = function(item) {
        var img = new Image(),
            _self = this
        img.src = './images/sun.png'
        img.id = _self.id
        img.onload = function() {
          if(item) {
            var isOk = true
            targetArray.forEach(function(obj, index) {
                var x = obj.x - item.x,
                    y = obj.y - item.y,
                    dis = Math.sqrt(x*x + y*y)
                if(dis < item.width / 2 + obj.width / 2 + 50) {
                  isOk = false
                }
            })
            if(isOk) {
              $(img).addClass('target').css({
                left: _self.x,
                top: _self.y,
                width: _self.width
              }).attr('data-time', _self.now)
              game.append(img)
              targetArray.push(item)
            }
          }
        }
      }
      Target.prototype.angle = function() {
        var left = parseInt($('#' + this.id).css('left'))
        var anglemax = Math.atan2( canvasH - this.y - gongHeight / 2 - this.width / 2, left - canvasW / 2)
        var anglemin = Math.atan2( canvasH - this.y - gongHeight / 2 - this.width / 2, left + this.width - canvasW / 2 )
        function angleCal(angle) {
          return (angle / Math.PI * 180) < 0 ? angle / Math.PI * 180 - 90 : angle / Math.PI * 180
        }
        var angleMax = angleCal(anglemax)
        var angleMmin = angleCal(anglemin)
        return {
          max: angleMax,
          min: angleMmin
        }
      }
      function random(min,max) {
          return parseInt(Math.random()*(max - min) + min);
      }
      function eventLoopHinder() {
        var id = Math.random().toString().split('.')[1]
        var newHinder = new Hinder(id)
        newHinder.draw()
        hinderArray.push(newHinder)
        setTimeout(eventLoopHinder, 1000)
      }
      function clearHinder() {
        hinderArray.forEach(function(item, index) {
          if(item.shot) {
            if($('#' + item.id).css('left') == canvasW + 'px' || $('#' + item.id).css('left') == -item.width + 'px') {
              $('#' + item.id).remove()
              hinderArray.splice(index, 1)
            }
          }
        })
        setTimeout(clearHinder, 1000)
      }
      function eventLoopTarget() {
          j++
          var id = j
              nowTime = new Date().getTime(),
              widthRandom = Math.random(),
              width = 0,
              scoreTarget = 0
          if(widthRandom > 0.66) {
            width = 0.4
            scoreTarget = 30
          } else if(widthRandom < 0.66 && widthRandom > 0.33) {
            width = 0.3
            scoreTarget = 50
          } else {
            width = 0.2
            scoreTarget = 100
          }
          var newTarget = new Target(id, nowTime, width, scoreTarget)
          newTarget.draw(newTarget)
          setTimeout(eventLoopTarget, 100)
      }
      function clearTarget() {
        var nowTime = new Date().getTime()
        targetArray.forEach(function(item, index) {
          if(item.time + item.now < nowTime) {
            $('#' + item.id).remove()
            targetArray.splice(index, 1)
          }
        })
        targetTimer = setTimeout(clearTarget, 500)
      }
      function changeScore(id, sc, x, y) {
        if(id !== lastId) {
          $('.score').remove()
          $('#talk').remove()
          lastId = id
          if(score < 300 && score + sc > 300) {
            $('#cold').show().width(canvasW * 0.76).fadeOut(1500)
          }
          score += sc
          if(score > 300) {
            isCold = true
            $('#gong').attr('src', './images/gong-cold.png')
          } else {
            isCold = false
            $('#gong').attr('src', './images/gong.png')
          }
          var img = new Image()
          img.src = './images/score.png'
          img.id = 'talk'
          img.onload = function() {
            if(sc > 0) {
              sc = '+' + sc
            }
            var scoreDiv = '<div class="score">' + sc + '</div>'
            game.append(img).append(scoreDiv)
            $('#talk').css({
              width: canvasW * defaultOption._s,
              left: x,
              top: y
            })
            $('.score').css({
              'left': x + $('#talk').width() / 4,
              'top': y + $('#talk').width() / 4,
              'font-size': $('#talk').width() / 4,
              'font-weight': 'bold',
              'margin-left': '-3px'
            })
            setTimeout(function() {
              $('#talk, .score').fadeOut()
            }, 100)
            $('#totalScore').html('得分 :' + score)
          }
        }   
      }
      function touchEvent() {
          var x, y, time
          game.on('touchstart',function(e) {
              var _touch = e.originalEvent.targetTouches[0]
              time = new Date().getTime()
              x = _touch.clientX
              y = _touch.clientY
          }).on('touchend',function(e) {
            $('.arrow').remove()
            var hinderTimes = 0,
                targetTimes = 0
            if(new Date().getTime() - time < 200) {
              var touchAngle = Math.atan2(canvasH - y - gongHeight / 2, x - canvasW / 2) / Math.PI * 180,
                  isFail = false,
                  gongAngle = 90 - touchAngle,
                  rotateObj = {
                                'transform':'rotateZ('+ gongAngle +'deg)',
                                '-ms-transform':'rotateZ('+ gongAngle +'deg)',  /* IE 9 */
                                '-moz-transform':'rotateZ('+ gongAngle +'deg)',   /* Firefox */
                                '-webkit-transform':'rotateZ('+ gongAngle +'deg)', /* Safari 和 Chrome */
                                '-o-transform':'rotateZ('+ gongAngle +'deg)'
                              }
              $('#gong').css(rotateObj)
              var newArrow = new Image()
              if(isCold) {
                newArrow.src = './images/arrow-cold.png'
              } else {
                newArrow.src = './images/arrow.png'
              }
              newArrow.id = 'arrow'
              newArrow.onload = function() {
                var speed = 0.1,
                    scale = newArrow.height / newArrow.width,
                    width = gongWidth * defaultOption._a
                $(newArrow).css({
                  'width': width,
                  'top': canvasH - width * scale,
                  'margin-left': -gongWidth * defaultOption._a / 2,
                  'transition-property': 'all',
                  '-moz-transition-property': 'all', /* Firefox 4 */
                  '-webkit-transition-property': 'all', /* Safari 和 Chrome */
                  '-o-transition-property': 'all', /* Opera */
                  'transition-timing-function': 'linear',
                  '-moz-transition-timing-function': 'linear', /* Firefox 4 */
                  '-webkit-transition-timing-function': 'linear', /* Safari 和 Chrome */
                  '-o-transition-timing-function': 'linear', /* Opera */
                  'transition-duration': speed + 's',
                  '-moz-transition-duration': speed + 's', /* Firefox 4 */
                  '-webkit-transition-duration': speed + 's', /* Safari 和 Chrome */
                  '-o-transition-duration': speed + 's', /* Opera */
                }).css(rotateObj).addClass('arrow')
                game.append(newArrow)
                hinderArray.forEach(function(item, index) {
                  var angleObj = item.angle()
                  var left = parseInt($('#' + item.id).css('left'))
                  if(touchAngle > angleObj.min && touchAngle < angleObj.max && hinderTimes === 0) {
                    hinderTimes++
                    var bottom = canvasH - item.y - $(newArrow).width() * scale / 2
                    var arrowLeft = bottom / (canvasH - y) * (x - canvasW / 2) //根据tan值算出具体left
                    $('#arrow').css({
                      left: arrowLeft + canvasW / 2,
                      top: canvasH - bottom - newArrow.height / 2,
                      margin: 0
                    })
                    var newImg = new Image()
                    if(isCold) {
                      newImg.src = './images/dadiao-shot-cold.png'
                    } else {
                      newImg.src = './images/dadiao-shot.png'
                    }
                    newImg.onload = function() {
                      $(newImg).addClass('hinder').css({
                        left: left,
                        top: item.y,
                        width: item.width,
                      })
                      if(!item.type) {
                        $(newImg).css({
                          'transform':'rotateY(180deg)',
                          '-ms-transform':'rotateY(180deg)',  /* IE 9 */
                          '-moz-transform':'rotateY(180deg)',   /* Firefox */
                          '-webkit-transform':'rotateY(180deg)', /* Safari 和 Chrome */
                          '-o-transform':'rotateY(180deg)'
                        })
                      }   
                      game.append(newImg)
                      $('#' + item.id).remove()
                      $(newImg).fadeOut('normal', function(){
                        $(this).remove()
                      })
                      setTimeout(function() {
                        changeScore(item.id, item.score, left, item.y) 
                        $('#arrow').fadeOut()
                      }, 100)
                    }
                    hinderArray.splice(index, 1)
                    isFail = true
                  }
                })
                if(!isFail) {
                  clearTimeout(targetTimer)
                  targetArray.forEach(function(item, index) {
                    var angleObj = item.angle()
                    var bottom = canvasH - item.y - $(newArrow).width() * scale / 2
                    var arrowLeft = bottom / (canvasH - y) * (x - canvasW / 2) //根据tan值算出具体left\
                    if(!(touchAngle < angleObj.min) && !(touchAngle > angleObj.max) && targetTimes === 0) {
                      targetTimes++
                      var url = ''
                      if(isCold) {
                        url = './images/sun-shot-cold.png'
                      } else {
                        url = './images/sun-shot.png'
                      }
                      $('#' + item.id).attr('src', url).fadeOut(1000, function() {
                        $(this).remove()
                        targetArray = targetArray.filter(function(obj, index) {
                          return item.id != obj.id
                        })
                      })
                      setTimeout(function() {
                        if(isCold) {
                          changeScore(item.id, item.score + 20, x, y)
                        } else {
                          changeScore(item.id, item.score, x, y)
                        }
                        clearTarget()
                      }, 100)
                    } 
                    $('#arrow').css({
                      left: (arrowLeft + canvasW / 2 - $(newArrow).width()),
                      top: (canvasH - bottom - newArrow.height / 2),
                      margin: 0
                    })
                    setTimeout(function() {
                      $('#arrow').fadeOut()
                    }, 100)
                  })
                }
              }
            }
          })
      }
      function init() {
        drawGame(defaultOption)
      }
      init()
    })
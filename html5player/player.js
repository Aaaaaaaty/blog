(function() {
	function videoPlay() {
		var videoSource = document.getElementById('videoSource'),
			timer,
			playTimer,
			duration = videoSource.duration || 0,
			currentTime, 
			isPlay = true, //是否开始播放
			isDrag = false, //是否拖拽进度条
			isSound = false, //是否拖拽音量区域
			isSoundOn = true, //是否开启声音
			isFullScreen = false,
			isRePlay = false,
			isClick = 0, //仅限第一次点击
			soundValue = 0,
			currentProcess,
			dragProcessEl = $('.play-process-drag'),
			soundTarget = $('.play-sound-btn'), //音量高低条按钮
			soundProcess = $('.play-sound-drag'), //音量高低条
			dragTarget = $('.play-process-btn'), //播放进度条按钮
			dragProcess = $('.play-process-drag'), //播放进度条,
			playStartBtn = $('.btn-wrapper-start'), //播放按钮
			soundSwitchBtn = $('#sound-switch'), //音频开关
			playStopBtn = $('.btn-wrapper-stop'), //停止按钮
			fullScreenBtn = $('.play-screen-not-full'),//全屏开关
			processWidth = $('.play-process').width()
		$(window).resize(function() {
			processWidth = $('.play-process').width()
			currentProcess = currentTime / duration * (processWidth - 5)//5为拖拽条小图标的宽度的一半
			dragProcessEl.css({
				width: currentProcess
			})
			dragTarget.css({
				left: currentProcess
			})
			// $('.play-process-btn-hover').css({left:currentProcess})
			if(isFullScreen) {
				if(!document.webkitIsFullScreen) {
					console.log('document.webkitIsFullScreen')
					isFullScreen = false 
					fullScreenBtn.attr('src', './images/screen_on.png')
				}
			}
		})
		var changeSecond = function(value) {
			var sec = parseInt(value)// 秒 
			var min = 0// 分 
			var hour = 0// 小时 
			if(sec > 60) { 
				min = parseInt(sec/60) 
				sec = parseInt(sec%60) 
			if(min > 60) { 
				hour = parseInt(min/60) 
				min = parseInt(min%60) 
			} 
			} 
			var result = parseInt(sec)
			if(min === 0) {
				if(result < 10) {
					result =  "00:0" + result
				} else {
					result =  "00:" + result
				}
			}
			if(min > 0) { 
				if(min < 10) {
					if(result < 10) {
						result = "0"+parseInt(min)+":"+"0"+result
					} else {
						result = "0"+parseInt(min)+":"+result
					}
				} else {
					result = ""+parseInt(min)+":"+result 
				}
			} 
			return result 
		}
		var dragControl = function() { //拖动元素、进度条元素、拖动总长
			var startX = 0,
				moveX = 0,
				disX = 0,
				dragDis = 0,
				soundDis = 0,
				leftInit = 55 //进度条整体距离左侧偏移
				rightInit = 30 //音量条整体距离右侧偏移
				dragProcessWidth = dragProcess.width(), //播放进度条当前长度
				soundMaxLength = $('.play-sound-wrapper').width(), //音量高低条总长
				soundProcessWidth = soundProcess.width() //音量高低条当前长度

			$('.play-all-time').html(changeSecond(duration))
			soundValue = videoSource.volume = 0.2
			soundChangeProcess(soundValue)
				
			$('.player-control').mousedown(function(e) {
				startX = e.clientX
				$('.play-process-btn').css({
					'transition': 'all 0s',
					'-moz-transition': 'all 0s',	/* Firefox 4 */
					'-webkit-transition': 'all 0s',	/* Safari 和 Chrome */
					'-o-transition': 'all 0s',
				})
				$('.play-sound-btn').css({
					'transition': 'all 0s',
					'-moz-transition': 'all 0s',	/* Firefox 4 */
					'-webkit-transition': 'all 0s',	/* Safari 和 Chrome */
					'-o-transition': 'all 0s',
				})
				if($(e.target).hasClass('play-process') || $(e.target).parent().hasClass('play-process')) {
					isDrag = true
					isPlay = false
					dragDis = startX - leftInit
					dragTarget.css({
						left: dragDis - 5
					})
					// $('.play-process-btn-hover').css({
					// 	left: dragDis - 5
					// })
					dragProcess.css({
						width: dragDis
					})
					$('.play-start').attr('src', './images/pause.png')
					$('.play-start-hover').attr('src', './images/pause_hover.png')
					// videoSource.pause()
					$('.play-sym').hide()
					$('.play-sym-hover').hide()
					clearTimeout(timer)
				}
				if($(e.target).hasClass('play-sound-wrapper') || $(e.target).parent().hasClass('play-sound-wrapper')) {
					isSound = true
					isSoundOn = true
					var clientWidth = $('.playerPop').width()
					soundDis = 110 - (clientWidth - startX) - 20 // 110为进度条右侧总长，20为播放按钮占用长度
					soundProcess.css({
						width: soundDis
					})
					soundTarget.css({
						left: soundDis
					})
					$('.play-sound-btn-hover').css({
						left: soundDis
					})
					soundSwitchBtn.attr('src', './images/sound_on.png')
					videoSource.volume = soundDis / soundMaxLength
					if(videoSource.volume < 0.05) {
						videoSource.volume = 0
						soundSwitchBtn.attr('src', './images/sound_off.png')
					}
					soundValue = videoSource.volume
				}
			}).mousemove(function(e) {
				moveX = e.clientX
				disX = moveX - startX
				if(isDrag) {
					if($(e.target).hasClass('play-process') || $(e.target).parent().hasClass('play-process')) {
						var left = dragDis + disX
						if(left > processWidth - 5) { //9为拖拽条小图标的宽度
							left = processWidth - 5
						} else if(left < 0) {
							left = 0
						}
						dragTarget.css({
							left: left - 5
						})
						// $('.play-process-btn-hover').css({
						// 	left: left - 5
						// })
						dragProcess.css({
							width: left
						})
					}
				}
				if(isSound) {
					if($(e.target).hasClass('play-sound-wrapper') || $(e.target).parent().hasClass('play-sound-wrapper')) {
						var left = soundDis + disX
						if(left > soundMaxLength) {
							left = soundMaxLength
						} else if(left < 0) { // 减去1/2的小按钮宽
							left = 0
						}
						soundTarget.css({
							left: left - 5
						})
						$('.play-sound-btn-hover').css({
							left: left - 5
						})
						soundProcess.css({
							width: left - 5
						})
						videoSource.volume = left / soundMaxLength
						if(videoSource.volume < 0.05) {
							videoSource.volume = 0
							soundSwitchBtn.attr('src', './images/sound_off.png')
						}
						soundValue = videoSource.volume
					}
				}
			}).mouseup(function(e) {
				if(isDrag) {
					isDrag = false
					isPlay = true
					videoSource.play()
					videoSource.currentTime = $('.play-process-drag').width() / processWidth * duration
					drawProcess()
				}
				if(isSound) {
					isSound = false
				}
			})
		}
		var drawProcess = function() {
			$('.play-process-btn').css({
				'transition': 'all 0s',
				'-moz-transition': 'all 0s',	/* Firefox 4 */
				'-webkit-transition': 'all 0s',	/* Safari 和 Chrome */
				'-o-transition': 'all 0s',
			})
			if(!isDrag) {
				currentTime = videoSource.currentTime
				$('.play-current-time').html(changeSecond(currentTime))
				currentProcess = currentTime / duration * (processWidth - 10)//5为拖拽条小图标的宽度的一半
				dragProcessEl.css({
					width: currentProcess
				})
				dragTarget.css({
					left: currentProcess
				})
				// $('.play-process-btn-hover').css({
				// 	left: currentProcess
				// })
				if(currentTime < duration) {
					timer = setTimeout(drawProcess, 10)
				} else {
					$('.play-sym').show()
	                $('.play-start').attr('src', './images/play_btn.png')
					$('.play-start-hover').attr('src', './images/play_btn_hover.png')
	                isRePlay = true
	                isPlay = false
	                clearTimeout(timer)
				}
			}
		}
		var soundChangeProcess = function(soundValue) {
			soundDis = soundValue * soundMaxLength
			soundProcess.css({
				width: soundDis
			})
			soundTarget.css({
				left: soundDis
			})
			$('.play-sound-btn-hover').css({
				left: soundDis
			})
		}
		var fullScreen = function() {
			if(isFullScreen) {
				isFullScreen = false
				fullScreenBtn.attr('src', './images/screen_on.png')
				$('.play-screen-not-full-hover').attr('src', './images/screen_on_hover.png')
				if (document.exitFullscreen) {  
				    document.exitFullscreen();  
				}  
				else if (document.mozCancelFullScreen) {  
				    document.mozCancelFullScreen();  
				}  
				else if (document.webkitCancelFullScreen) {  
				    document.webkitCancelFullScreen();  
				}
				else if (document.msExitFullscreen) {
				      document.msExitFullscreen();
				}
				$('.playerPop').css({
					width: 800,
					height: 500
				})
				$('.start-wrapper-btn').css({
					bottom: '6%'
				})
			} else {
				isFullScreen = true
				fullScreenBtn.attr('src', './images/screen_off.png')
				$('.play-screen-not-full-hover').attr('src', './images/screen_off_hover.png')
				var docElm = document.documentElement;
				//W3C  
				if (docElm.requestFullscreen) {  
				    docElm.requestFullscreen();  
				}
				//FireFox  
				else if (docElm.mozRequestFullScreen) {  
				    docElm.mozRequestFullScreen();  
				}
				//Chrome等  
				else if (docElm.webkitRequestFullScreen) {  
				    docElm.webkitRequestFullScreen();  
				}
				//IE11
				else if (elem.msRequestFullscreen) {
				  elem.msRequestFullscreen();
				}
				$('.playerPop').css({
					width: '100%',
					height: '100%'
				})
				$('.start-wrapper-btn').css({
					bottom: '3%'
				})
			}
		}
		videoSource.play()
		drawProcess()
		$('.playerPop').hover(function() {
			$('.player-control').css({
				bottom: 0
			})
			if(isClick && !isPlay) {
				$('.play-sym-hover').fadeIn()
				
				$('.play-sym, .play-sym-hover').css({
					'top': 0,
					'transition': 'all 0s',
					'-moz-transition': 'all 0s',	/* Firefox 4 */
					'-webkit-transition': 'all 0s',	/* Safari 和 Chrome */
					'-o-transition': 'all 0s',
				})
			}
			$('.play-sym, .play-sym-hover').css({
				'top': 0,
				'transition': 'all 0.5s',
				'-moz-transition': 'all 0.5s',	/* Firefox 4 */
				'-webkit-transition': 'all 0.5s',	/* Safari 和 Chrome */
				'-o-transition': 'all 0.5s',
			})
		}, function() {
			$('.player-control').css({
				bottom: -25
			})
			if(isClick) {
				$('.play-sym-hover').fadeOut()
				$('.play-sym').css({
					top: 27
				})
				$('.play-sym-hover').css({
					top: 27
				})
			}
		})
		$('.play-process').hover(function(){
			$('.play-process-btn').css({
				'transition': 'all 0s',
				'-moz-transition': 'all 0s',	/* Firefox 4 */
				'-webkit-transition': 'all 0s',	/* Safari 和 Chrome */
				'-o-transition': 'all 0s',
				'background-color': '#ff8921'
			})
		}, function() {
			$('.play-process-btn').css({
				'transition': 'all 0.5s',
				'-moz-transition': 'all 0.5s',	/* Firefox 4 */
				'-webkit-transition': 'all 0.5s',	/* Safari 和 Chrome */
				'-o-transition': 'all 0.5s',
				'background-color': '#ffffff'
			})
		})
		$('.play-sound-wrapper').hover(function() {
			$('.play-sound-btn').css({
				'transition': 'all 0.5s',
				'-moz-transition': 'all 0.5s',	/* Firefox 4 */
				'-webkit-transition': 'all 0.5s',	/* Safari 和 Chrome */
				'-o-transition': 'all 0.5s',
				'background-color': '#ff8921'
			})
		}, function() {
			$('.play-sound-btn').css({
				'transition': 'all 0.5s',
				'-moz-transition': 'all 0.5s',	/* Firefox 4 */
				'-webkit-transition': 'all 0.5s',	/* Safari 和 Chrome */
				'-o-transition': 'all 0.5s',
				'background-color': '#ff8921'
			})
		})
		playStartBtn.click(function() {
			if(isPlay) {
				videoSource.pause()
				$('.play-sym').show()
				$('.play-sym-hover').fadeIn()
				$('#play-start-hover').attr('src', './images/play_btn_hover.png')
				$('#play-start').attr('src', './images/play_btn.png')
				isPlay = false
			} else {
				videoSource.play()
				$('.play-sym').hide()
				$('.play-sym-hover').hide()
				$('#play-start-hover').attr('src', './images/pause_hover.png')
				$('#play-start').attr('src', './images/pause.png')
				isPlay = true
				drawProcess()
			}
		})
		playStartBtn.hover(function() {
			$('#play-start-hover').fadeIn()
		}, function() {
			$('#play-start-hover').fadeOut()
		})
		$('.play-sound-switch').click(function() {
			if(isSoundOn) {
				soundSwitchBtn.attr('src', './images/sound_off.png')
				isSoundOn = false
				videoSource.volume = 0
				$('.play-sound-btn').css({left: 0})
				$('.play-sound-btn-hover').css({left: 0})
				$('.play-sound-drag').width(0)
			} else {
				soundSwitchBtn.attr('src', './images/sound_on.png')
				videoSource.volume = soundValue
				soundChangeProcess(soundValue)
				isSoundOn = true
			}
		})
		playStopBtn.click(function() {
			videoSource.currentTime = 0
			videoSource.pause()
			$('.play-sym').show()
			$('.play-sym-hover').fadeIn()
			dragTarget.css({left: 0})
			$('.play-process-btn-hover').css({left:0})
			dragProcess.width(0)
			isPlay = false
			$('.play-start').attr('src', './images/play_btn.png')
			$('.play-start-hover').attr('src', './images/play_btn_hover.png')
		})
		playStopBtn.hover(function() {
			$('.play-stop-hover').fadeIn()
		}, function() {
			$('.play-stop-hover').fadeOut()
		})
		$('.play-screen').click(function() {
			fullScreen()
		}).hover(function() {
			if(isFullScreen) {
				$('.play-screen-not-full-hover').attr('src', './images/screen_off_hover.png').fadeIn()
			} else {
				$('.play-screen-not-full-hover').attr('src', './images/screen_on_hover.png').fadeIn()
			}
		}, function() {
			$('.play-screen-not-full-hover').fadeOut()
		})
		$(window).keypress(function(event) {
			event.preventDefault()
			console.log('当前keycode被监听event.keyCode', event.keyCode)
			if(event.keyCode === 27 && isFullScreen === true) {
				fullScreen()
			}
		})
		$('.play-sym-wrapper').remove()
		$('.start-wrapper-btn').append('<img class="play-sym" src="./images/start.png"><img class="play-sym-hover" src="./images/start_hover.png">')
		$('#videoSource, .start-wrapper-btn').click(function() {
			// clearTimeout(playTimer)
			// playTimer = setTimeout(function() {
				if(isPlay) {
					isPlay = false
					videoSource.pause()
					$('.play-start').attr('src', './images/play_btn.png')
					$('.play-start-hover').attr('src', './images/play_btn_hover.png')
					isClick ++
					$('.play-sym').fadeIn().css({
						'top': 0,
						'transition': 'all 0s',
						'-moz-transition': 'all 0s',	/* Firefox 4 */
						'-webkit-transition': 'all 0s',	/* Safari 和 Chrome */
						'-o-transition': 'all 0s',
					})
					$('.play-sym-hover').fadeIn().css({
						'top': 0,
						'transition': 'all 0s',
						'-moz-transition': 'all 0s',	/* Firefox 4 */
						'-webkit-transition': 'all 0s',	/* Safari 和 Chrome */
						'-o-transition': 'all 0s',
					})
					// setTimeout(function() {
					$('.play-sym, .play-sym-hover').css({
						'transition': 'all 0.5s',
						'-moz-transition': 'all 0.5s',	/* Firefox 4 */
						'-webkit-transition': 'all 0.5s',	/* Safari 和 Chrome */
						'-o-transition': 'all 0.5s',
					})
					// }, 500)
					clearTimeout(timer)
				} else {
					if(isRePlay) {
		                dragProcess.css({
		                width: 0
		                })
		                dragTarget.css({
		                    left: 0
		                })
		                // $('.play-process-btn-hover').css({left:0})
		            }
					isPlay = true
					videoSource.play()
					$('.play-sym').hide()
					$('.play-sym-hover').hide()
					drawProcess()
					$('.play-start').attr('src', './images/pause.png')
					$('.play-start-hover').attr('src', './images/pause_hover.png')
					// $('.start-wrapper-btn').fadeOut()
				}
			// }, 300)
		})
		dragControl() 
		videoSource.oncanplay =null;
	}
	function ifState() {
		var state = videoSource.readyState
		if(state === 4) {
			clearTimeout(playTimer)
			videoPlay()
			$(videoSource).show()
			$('.play-start').attr('src', './images/pause.png').css({
				    'margin-left': 13,
	    			'margin-top': 7,
			}).removeClass('animate')
		} else {
			$('.playerbody').on('mouseover', function() {
				$('.player-control').css({
					bottom: 0
				})
			}).on('mouseleave', function() {
				$('.player-control').css({
					bottom: -25
				})
			})
			$('.play-start').attr('src', './images/waiting.png').css({
				    'margin-left': 7,
	    			'margin-top': 3,
			}).addClass('animate')
			$('.play-sym-wrapper').remove()
			$('.playerPop').append('<div class="play-sym-wrapper"><img class="play-sym-wanmei" src="./images/loading.gif"></div>')
			$(videoSource).hide()
			playTimer = setTimeout(ifState, 10)
		}
	}
	function initDom(id, src) {
		var str = ''
		str += '<div class="video-wrapper"><div class="playerPop"><div class="inset"><div class="playerbody" id="video">'
		str += '<video id="videoSource"  style="width:100%; height: calc(100% - 25px);" src='+ src +' ></video>'
		str += '<div class="player-control"><div class="play-btn "><div class="play-btn-wrapper">'
		str += '<div class="btn-wrapper btn-wrapper-start"><img id="play-start" class="play-start" src="./images/pause.png"><img id="play-start-hover" class="play-start-hover" src="./images/pause_hover.png">'
		str += '</div><div class="btn-wrapper btn-wrapper-stop"><img class="play-stop" src="./images/stop.png"><img class="play-stop-hover" src="./images/stop_hover.png"></div>'
		str += '</div></div><div class="play-process"><div class="play-process-all"></div><div class="play-process-drag"></div><div class="play-process-before"></div><div class="play-process-btn" src="./images/process.png"></div></div>'
		str += '<div class="play-msg ">'
		str += '<span class="play-time"><span class="play-current-time">00:00</span> l <span class="play-all-time"></span></span>'
		str += '<span class="play-sound">'
		str += '<div class="play-sound-switch"><img id="sound-switch" class="play-sound-on" src="./images/sound_on.png"><img id="sound-switch-hover" class="play-sound-on-hover" src="./images/sound_on_hover.png"></div>'
		str += '<div class="play-sound-wrapper"><div class="play-sound-all"></div><div class="play-sound-drag"></div><div class="play-sound-btn"></div></div>'
		str += '</span><span class="play-screen"><img id="screen-full-swtich" class="play-screen-not-full" src="./images/screen_on.png"><img id="screen-full-swtich-hover" class="play-screen-not-full-hover" src="./images/screen_on_hover.png"></span>'
		str += '</div></div></div></div><div class="start-wrapper-btn"></div></div></div>'
		// str += '<div class="close-video"><img class="close-img close-video-normal" src="./images/close.jpg" alt=""><img class="close-img close-video-normal-hover" src="./images/close_hover.jpg" alt=""></div></div>'
		$('#' + id).append(str)
	}
	function initCss() {
		var str = ''
		str = '<style type="text/css">body{overflow:hidden;background-color:#383838}.l{float:left}.r{float:right}.playerPop *,body{margin:0;padding:0}.playerPop li{list-style:none}#videoSource{background-color:#000;cursor:pointer}.video-wrapper{position:absolute;width:100%;height:100%}.playerPop{position:absolute;top:0;left:0;z-index:100;overflow:hidden;width:100%;height:100%;background-color:#000;cursor:pointer}.playerPop .inset{position:relative;top:0;left:0;box-sizing:border-box;width:100%;height:100%}.playerPop .playerTit{padding-left:9px;color:#dedede;font-size:0;line-height:25px;line-height:0}.playerPop .playerTit span{display:inline-block;height:25px;vertical-align:top;font:400 12px/24px "Microsoft Yahei"}.playerPop .playerTit .txt{overflow:hidden;max-width:520px;text-overflow:ellipsis;white-space:nowrap;word-wrap:normal;word-break:normal}.playerPop .playerTit .look{margin-left:20px;color:#989898}.playerPop .playerTit .look::before{display:inline-block;margin-right:4px;width:14px;height:10px;background:url(images/playerIcons.png) -80px -151px no-repeat;content:"";vertical-align:middle}.playerPop .close{position:absolute;top:7px;right:7px;z-index:5;width:12px;height:12px;background:url(images/playerIcons.png) 0 -150px no-repeat;cursor:pointer}.playerPop .close:hover{background-position:-30px -150px}.playerPop .close.dis{opacity:.15;cursor:default}.playerPop .close.dis:hover{background-position:0 -150px}.playerPop .playerbody{width:100%;height:100%}.player-control{position:absolute;bottom:-25px;z-index:101;width:100%;height:25px;background-color:#2A2A2A;font-size:12px;-webkit-transition:all .5s;-moz-transition:all .5s;-o-transition:all .5s;transition:all .5s}.play-btn{position:absolute;left:0;width:55px;height:100%}.play-process{position:relative;margin-right:200px;margin-left:55px;height:100%}.play-process-all{position:relative;top:11px;left:0;height:3px;background-color:#515151}.play-process-drag{position:absolute;top:11px;left:0;width:9px;height:3px;border-radius:1.5px;background-color:#ff8921}.play-process-btn{position:absolute;top:7px;left:0;display:block;width:14px;height:8px;border:.5px solid #000;border-radius:3px;background-color:#dbdbdb;-webkit-transition:all .5s;-moz-transition:all .5s;-o-transition:all .5s;transition:all .5s}.play-process-btn-hover{background-color:#ff8921}.play-msg{position:absolute;top:0;right:0;width:200px;height:100%}.play-time{position:absolute;top:0;left:0;width:90px;height:25px;color:#686868;text-align:center;line-height:24px}.play-sound{position:relative;display:block;margin-left:90px;height:100%}.play-sound-switch{position:relative;float:left;width:20px;height:25px}.play-sound-wrapper{position:relative;float:left;width:60px;height:25px}.play-sound-all{position:relative;top:10px;margin-top:0;height:3px;background-color:#737373}.play-sound-drag{position:absolute;top:10px;left:0;width:9px;height:3px;border-radius:1.5px;background-color:#ff8921}.play-sound-btn{position:absolute;top:7.1px;left:0;display:block;width:10px;height:7px;border:.5px solid #000;border-radius:3px;background-color:#dbdbdb}.play-sound-btn-hover{position:absolute;top:7.1px;left:0;display:block;display:none}.play-screen{position:absolute;top:0;right:0;width:30px;height:25px}.play-start{position:absolute;display:inline-block;margin-top:7px;margin-left:13px}.play-start-hover{position:absolute;display:none;margin-top:7px;margin-left:13px}.play-pause{display:inline-block;margin-top:7px;margin-left:13px;width:9px;height:11px}.play-btn-wrapper{width:100%;height:25px}.play-stop{position:absolute;display:inline-block;margin-top:7px;margin-left:6px}.play-stop-hover{position:absolute;display:none;margin-top:7px;margin-left:6px}.play-sound-on{position:absolute;display:inline-block;margin-top:6px;margin-left:2px}.play-sound-on-hover{position:absolute;display:inline-block;display:none;margin-top:6px;margin-left:2px}.play-sound-off{position:absolute;display:inline-block;margin-top:7px;margin-left:2px}.play-sound-off-hover{position:absolute;display:inline-block;display:none;margin-top:7px;margin-left:2px}.play-screen-not-full{position:absolute;display:inline-block;margin-top:6px;margin-left:10px}.play-screen-not-full-hover{position:absolute;display:inline-block;display:none;margin-top:6px;margin-left:10px}.play-screen-full{position:absolute;display:inline-block;margin-top:5px;margin-left:10px}.play-screen-full-hover{position:absolute;display:inline-block;display:none;margin-top:5px;margin-left:10px}.start-wrapper-btn{position:absolute;bottom:6%;left:1%;width:70px;height:50px}.play-sym{position:absolute;top:27px;z-index:10000;display:none;width:60px;cursor:pointer;-webkit-transition:all .5s;-moz-transition:all .5s;-o-transition:all .5s;transition:all .5s}.play-sym-hover{position:absolute;top:27px;z-index:10000;display:none;width:60px;cursor:pointer;-webkit-transition:all .5s;-moz-transition:all .5s;-o-transition:all .5s;transition:all .5s}.play-sym-wanmei{position:absolute;top:50%;left:50%;margin-top:-50px;margin-left:-95px;width:190px}.btn-wrapper{position:relative;float:left;width:50%;height:100%}.close-video{position:absolute;top:0;left:800px;width:58px;height:58px}.close-img{position:absolute}.close-video-normal-hover{display:none}.animate{animation:carAnimation 1s linear infinite;-webkit-animation:carAnimation 1s linear infinite;-moz-animation:carAnimation 1s linear infinite;-o-animation:carAnimation 1s linear infinite}@keyframes carAnimation{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@-webkit-keyframes carAnimation{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@-moz-keyframes carAnimation{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@-o-keyframes carAnimation{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}</style>'
		$('head').append(str)
	}
	function init(id) {
		var videoBigUrl = 'http://media.dl.wanmei.com/media/media/csgonewtrailerenglish.mp4'
		initDom(id, videoBigUrl)
		initCss()
		ifState()
	}
	return init
})()

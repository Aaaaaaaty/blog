function videoPlayer() {
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
		videoSource.play()
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
				currentProcess = currentTime / duration * (processWidth - 5)//5为拖拽条小图标的宽度的一半
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
		$('.start-wrapper-btn').hover(function() {
			$('.player-control').css({
				bottom: 0
			})
		}, function() {
			$('.player-control').css({
				bottom: -25
			})
		})
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
		$('.close-video').hover(function() {
			$('.close-video-normal-hover').fadeIn()
		}, function() {
			$('.close-video-normal-hover').fadeOut()
		}).click(function() {
			$('.video-wrapper').hide()
		})
		$('.play-process ').hover(function(){
			$('.play-process-btn').css({
				'transition': 'all 0.5s',
				'-moz-transition': 'all 0.5s',	/* Firefox 4 */
				'-webkit-transition': 'all 0.5s',	/* Safari 和 Chrome */
				'-o-transition': 'all 0.5s',
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
				console.log(123)
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
					console.log(123345)
					$('.play-sym').hide()
					$('.play-sym-hover').hide()
					drawProcess()
					$('.play-start').attr('src', './images/pause.png')
					$('.play-start-hover').attr('src', './images/pause_hover.png')
					// $('.start-wrapper-btn').fadeOut()
				}
			// }, 300)
		})
		$('#fz').click(function(e) {
			$('#sourceUrl').val($('#videoSource').attr('src')).select()
			document.execCommand("Copy")
			$('#fz span').html('完成复制')
		})
		dragControl() 
		videoSource.oncanplay =null;
}
function ifState() {
	var state = videoSource.readyState
	if(state === 4) {
		videoPlayer()
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
		setTimeout(ifState, 1000)
	}
}
setTimeout(ifState, 10)
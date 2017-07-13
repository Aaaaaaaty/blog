function videoPlayer() {
		$(window).resize(function() {
			processWidth = $('.play-process').width()
		})
		var videoSource = document.getElementById('videoSource'),
			timer,
			duration = videoSource.duration || 0,
			currentTime, 
			isPlay = false, //是否开始播放
			isDrag = false, //是否拖拽进度条
			isSound = false, //是否拖拽音量区域
			isSoundOn = true, //是否开启声音
			isFullScreen = false,
			isRePlay = false,
			currentProcess,
			dragProcessEl = $('.play-process-drag'),
			dragTarget = $('.play-process-btn'),
			soundTarget = $('.play-sound-btn'), //音量高低条按钮
			soundProcess = $('.play-sound-drag'), //音量高低条
			dragTarget = $('.play-process-btn'), //播放进度条按钮
			dragProcess = $('.play-process-drag'), //播放进度条,
			playStartBtn = $('.btn-wrapper-start'), //播放按钮
			soundSwitchBtn = $('#sound-switch'), //音频开关
			playStopBtn = $('.btn-wrapper-stop'), //停止按钮
			fullScreenBtn = $('#screen-full-swtich'),//全屏开关
			processWidth = $('.play-process').width(),
			playSym = $('.play-sym ')

		var dragControl = function() { //拖动元素、进度条元素、拖动总长
			var startX = 0,
				moveX = 0,
				disX = 0,
				dragDis = 0,
				soundDis = 0,
				leftInit = 55 //进度条整体距离左侧偏移
				rightInit = 30 //音量条整体距离右侧偏移
				dragProcessWidth = dragProcess.width(), //播放进度条当前长度
				soundMaxLength = $('.play-sound').width(), //音量高低条总长
				soundProcessWidth = soundProcess.width() //音量高低条当前长度

			$('.play-all-time').html(changeSecond(duration))
				videoSource.volume = 0.2
				soundDis = videoSource.volume * soundMaxLength
				soundProcess.css({
					width: soundDis
				})
				soundTarget.css({
					left: soundDis
				})
			$('body').mousedown(function(e) {
				startX = e.clientX
				if($(e.target).hasClass('play-process') || $(e.target).parent().hasClass('play-process')) {
					isDrag = true
					isPlay = false
					dragDis = startX - leftInit
					dragTarget.css({
						left: dragDis
					})
					dragProcess.css({
						width: dragDis
					})
					playStartBtn.find('span').removeClass('play-start').addClass('play-pause')
					videoSource.pause()
					playSym.hide()
					clearTimeout(timer)
				}
				if($(e.target).hasClass('play-sound-wrapper') || $(e.target).parent().hasClass('play-sound-wrapper')) {
					isSound = true
					isSoundOn = true
					var clientWidth = $('body').width()
					soundDis = 110 - (clientWidth - startX) - 20 // 110为进度条右侧总长，20为播放按钮占用长度
					soundProcess.css({
						width: soundDis
					})
					soundTarget.css({
						left: soundDis - 5
					})
					soundSwitchBtn.removeClass('play-sound-off').addClass('play-sound-on')
					videoSource.volume = soundDis / soundMaxLength
				}
			}).mousemove(function(e) {
				moveX = e.clientX
					disX = moveX - startX
				if(isDrag) {
					if($(e.target).hasClass('play-process') || $(e.target).parent().hasClass('play-process')) {
						var left = dragDis + disX
						if(left > processWidth - 9) { //9为拖拽条小图标的宽度
							left = processWidth - 9
						} else if(left < 0) {
							left = 0
						}
						dragTarget.css({
							left: left
						})
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
						} else if(left < 5) { // 减去1/2的小按钮宽
							left = 5
						}
						soundTarget.css({
							left: left - 5
						})
						soundProcess.css({
							width: left
						})
						videoSource.volume = left / soundMaxLength
						console.log(videoSource.volume)
					}
				}
			}).mouseup(function(e) {
				if($(e.target).hasClass('play-process') || $(e.target).parent().hasClass('play-process')) {
					isDrag = false
					isPlay = true
					videoSource.play()
					videoSource.currentTime = $('.play-process-drag').width() / processWidth * duration
					drawProcess()
				}
				if($(e.target).hasClass('play-sound-wrapper') || $(e.target).parent().hasClass('play-sound-wrapper')) {
					isSound = false
				}
			})
		}
		var drawProcess = function(newCurentTime) {
			if(!isDrag) {
				currentTime = videoSource.currentTime
				$('.play-current-time').html(changeSecond(currentTime))
				currentProcess = currentTime / duration * (processWidth - 9)//9为拖拽条小图标的宽度
				dragProcessEl.css({
					width: currentProcess
				})
				dragTarget.css({
					left: currentProcess
				})
				if(currentTime < duration) {
					timer = setTimeout(drawProcess, 10)
				} else {
					playSym.show()
	                playStartBtn.find('span').removeClass('play-pause').addClass('play-start')
	                isRePlay = true
	                clearTimeout(timer)
				}
			}
		}
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
			result = ""+parseInt(min)+":"+result 
			} 
			if(hour > 0) { 
			result = ""+parseInt(hour)+":"+result 
			} 
			return result 
		}
		playStartBtn.click(function() {
			if(isPlay) {
				videoSource.pause()
				playSym.show()
				$(this).find('span').removeClass('play-pause').addClass('play-start')
				isPlay = false
			} else {
				videoSource.play()
				playSym.hide()
				$(this).find('span').removeClass('play-start').addClass('play-pause')
				isPlay = true
				drawProcess()
			}
			
		})
		soundSwitchBtn.click(function() {
			if(isSoundOn) {
				$(this).removeClass('play-sound-on').addClass('play-sound-off')
				isSoundOn = false
				videoSource.volume = 0
				$('.play-sound-btn').css({left: 0})
				$('.play-sound-drag').width(0)
			} else {
				$(this).removeClass('play-sound-off').addClass('play-sound-on')
				isSoundOn = true
			}
		})
		playStopBtn.click(function() {
			videoSource.currentTime = 0
			videoSource.pause()
			playSym.show()
			dragTarget.css({left: 0})
			dragProcess.width(0)
			isPlay = false
			playStartBtn.find('span').removeClass('play-pause').addClass('play-start')
		})
		fullScreenBtn.click(function() {
			if(isFullScreen) {
				isFullScreen = false
				$(this).removeClass('play-screen-full').addClass('play-screen-not-full')
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
			} else {
				isFullScreen = true
				$(this).removeClass('play-screen-not-full').addClass('play-screen-full')
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
			}
			
		})
		var i = 0
		console.log("reapt", i)
		$('#videoSource, .play-sym').click(function() {
			if(isPlay) {
				isPlay = false
				videoSource.pause()
				playSym.show()
				playStartBtn.find('span').removeClass('play-pause').addClass('play-start')
				clearTimeout(timer)
			} else {
				if(isRePlay) {
	                dragProcess.css({
	                width: 0
	                })
	                dragTarget.css({
	                    left: 0
	                })
	            }
				isPlay = true
				videoSource.play()
				playSym.hide()
				drawProcess()
				playStartBtn.find('span').removeClass('play-start').addClass('play-pause')
			}
		})
		dragControl() 
		videoSource.oncanplay =null;
	}
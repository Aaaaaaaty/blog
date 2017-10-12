function entry(hands) {
	var str = ''
	str += '<script class="vr" src="js/fetch.js"></script>'
	str += '<script class="vr" src="js/three.min.js"></script>'
	str += '<script class="vr" src="js/webvr-polyfill.js"></script>'
	str += '<script class="vr" src="js/tween.min.js"></script>'
	str += '<script class="vr" src="js/VRControls.js"></script>'
	str += '<script class="vr" src="js/VREffect.js"></script>'
	str += '<script class="vr" src="js/OrbitControls.js"></script>'
	str += '<script class="vr" src="js/main.js"></script>'
	$('body').append(str)
	function isInit() {
		if(init) {
			init()
			setTimeout(function(){
	            hands.hide()
	        }, 4000)
		} else {
			setTimeout(isInit, 100)	
		}
	}
	setTimeout(isInit, 100)
}

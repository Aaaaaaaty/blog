function playerPolyfill(id) {
	var canVideo = !!(document.createElement('video').canPlayType),
		player = ''
	if(canVideo) {
		player = '<script src="./player.js"></script>'
		$('body').append(player)
		init(id)
	} else {
		player = '<object type="application/x-shockwave-flash" name="v21" data="http://www.wanmei.com/public/swf/player_v2.swf" width="300" height="200" id="v21" style="visibility: visible;"><param name="allowfullscreen" value="true"><param name="wmode" value="window"><param name="allowscriptaccess" value="always"><param name="bgcolor" value="0x000000"><param name="flashvars" value="__objectID=v21&amp;__url=file:///Users/WangJie/Desktop/images/%E5%BC%95%E5%85%A5flash/flash_example.html&amp;source=http://media101.wanmei.com/media/w2i/flv/show1309_1.flv&amp;autoRewind=false&amp;configPath=http://www.wanmei.com/public/swf/player_config.xml"></object>'
	}
}
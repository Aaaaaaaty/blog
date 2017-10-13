const fs = require('fs')
const { execSync } = require('child_process')
function fsPathRepeat(path, targetUrl, res, cb) {
	let originPath = path
	let dataKey = ['.js', '.css', '.html']
	let data = [
		{	
			'type': 'script',
			'point': targetUrl
		},
		{	
			'type': 'link',
			'point': targetUrl
		},
		{	
			'type': 'img',
			'point': targetUrl
		},
		{	
			'type': 'background',
			'point': targetUrl
		}
	]
	function replaceAddress(path) {
		let readAble = fs.createReadStream(path)
		let body = ''
		readAble.on('data', (chunk) => {
		  body += chunk
		})
		readAble.on('end', () => {
			matchData(path, data, body)
		})
	}
	function matchData(path, data, body) {
		let replaceBody = {}
		data.forEach((obj, i) => {
			if(obj.type === 'script' || obj.type === 'link' || obj.type === 'img') {
				let bodyMatch = body.match(new RegExp(`<${obj.type}.*?>`, 'g'))
				if(bodyMatch) {
					bodyMatch.forEach((item, index) => {
						let itemMatch = item.match(/(src|href)\s*=\s*["|'].*?["|']/g)
						if(itemMatch) {
							itemMatch.forEach((data, i) => {
								let matchItem = data.match(/(["|']).*\//g)[0].replace(/\s/g, '').slice(1)
								if(!replaceBody[matchItem]) {
									replaceBody[matchItem] = obj.point
								}
							})
						}
					})
				}
			} else if(obj.type === 'background') {
				let bodyMatch = body.match(/url\(.*?\)/g)
				if(bodyMatch) {
					bodyMatch.forEach((item, index) => {
						let itemMatch = item.match(/\(.*\//g)[0].replace(/\s/g, '').slice(1)
						if(!replaceBody[itemMatch]) {
							replaceBody[itemMatch] = obj.point
						}
					})
				}

			}
		})
		replaceSepical(path, body, replaceBody)	
	}

	function replaceSepical(path, body, replaceBody) {
		Object.keys(replaceBody).sort((a,b) => b.length - a.length).forEach((item, index) => {
			let i = item,
				itemReplace
			if(item.match(/\.\//g)) {
				item = item.replace(/\./g, '\\\.')
			} 
			itemReplace = new RegExp(item, 'g')	
			body = body.replace(itemReplace, replaceBody[i])
		})
		writeFs(path, body)
	}
	function writeFs(path, body) {
		fs.writeFile(path, body, (err) => {
		  	if (err) throw err;
		  	if(cb) {
		  		cb(originPath, res)
		  		cb = null
		  	}
		})
	}
	fsPathSys(path, dataKey)
}
exports.fsPathRepeat = fsPathRepeat
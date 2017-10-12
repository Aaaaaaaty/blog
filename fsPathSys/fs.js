const fs = require('fs')
// let path = process.cwd() + '/testui'
// let data = [
// 	{
// 		'key': '.js',
// 		'result': 'https://www.laohujs.com'
// 	},
// 	{
// 		'key': '.css',
// 		'result': 'https://www.laohucss.com'
// 	},
// 	{
// 		'key': '.html',
// 		'result': 'https://www.laohuhtml.com'
// 	}
// ]
// let filePathList = []
// function fsPathSys(path, data) {
// 	fs.readdir(path, isDirectory)
// 	function isDirectory(err, files) {
// 		if(err) {
// 			return err
// 		} else {
// 			files.forEach((item, index) => {
// 				let nowPath = `${path}/${item}`
// 				let stat = fs.statSync(nowPath)
// 				if(!stat.isDirectory()) {
// 					data.forEach((obj, index) => {
// 						if(~item.indexOf(obj.key)) {
// 							replaceAddress(nowPath, obj)
// 						}
// 					})
// 				} else {		
// 					fsPathSys(nowPath, data)
// 				}
// 			})
// 		}
// 	}
// }
// function replaceAddress(path, obj) {
// 	let readAble = fs.createReadStream(path)
// 	let body = ''
// 	readAble.on('data', (chunk) => {
// 	  body += chunk
// 	})
// 	readAble.on('end', () => {
// 		let result = obj.result
// 		let regKey = new RegExp(obj.key, 'g')
// 		if(body.match(regKey)) {
// 			body = body.replace(regKey, result)
// 			fs.writeFile(path, body, (err) => {
// 			  	if (err) throw err;
// 			});
// 		} 
// 	})
// }
// fsPathSys(path, data)


let regMatch = {
	'background': new RegExp(/url\(.*?\)/g),
	'src': new RegExp(/src\s*=\s*["|'].*?["|']/g),
	'href': new RegExp((/href\s*=\s*["|'].*?["|']/g)),
	'link': new RegExp(/<link.*?>/g),
	'content': new RegExp(/(["|']).*\//g)
}
let path = process.cwd() + '/testui/test.html'
let readAble = fs.createReadStream(path)
let body = ''
readAble.on('data', (chunk) => {
  body += chunk
})
readAble.on('end', () => {
	let data = [{	
					'type': 'src',
					'data': body.match(regMatch.src),
					'point': 'www.laohu.com/'
				},
				{	
					'type': 'link',
					'data': body.match(regMatch.link),
					'point': 'www.css.com/'
				},
				{	
					'type': 'background',
					'data': body.match(regMatch.background),
					'point': 'www.bg.com/'
				}]
	matchData(data)
	
})
function matchData(data) {
	let replaceBody = {}
	data.forEach((obj, i) => {
		if(obj.type === 'src') {
			obj.data.forEach((item, index) => {
				let itemMatch = item.match(regMatch.content)[0].replace(/\s/g, '').slice(1)
				if(!replaceBody[itemMatch]) {
					replaceBody[itemMatch] = true
				}	
			})
		} else if(obj.type === 'link') {
			obj.data.forEach((item, index) => {
				let itemMatch = item.match(regMatch.href)
				itemMatch.forEach((obj, index) => {
					let hrefMathc = obj.match(regMatch.content)[0].replace(/\s/g, '').slice(1)
					if(!replaceBody[hrefMathc]) {
						replaceBody[hrefMathc] = true
					}	
				})
			})
		}
		console.log(Object.keys(replaceBody).sort((a,b) => b.length - a.length))
		writeFs(path, body, replaceBody, obj)	
	})			
}
function writeFs(path, body, replaceBody, obj) {
	Object.keys(replaceBody).sort((a,b) => b.length - a.length).forEach((item, index) => {
		let itemReplace = new RegExp(item, 'g')	
		body = body.replace(itemReplace, obj.point)
	})
	// fs.writeFile(path, body, (err) => {
	//   	if (err) throw err;
	// })
}
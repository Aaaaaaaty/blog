#!/usr/bin/env node
const fs = require('fs')

var run= function (obj) {
	let name = obj[0]
	let address = obj[1]
	if(name && address) {
		const fileName = './goodMsg.md'
	  	const readAble = fs.createReadStream(fileName)
		var body = ''
		readAble.on('data', (chunk) => {
		  body += chunk
		})
		readAble.on('end', () => {
			if(~body.indexOf(address)) {
				console.log('已分享过本篇文章！')
				return null
			} else {
<<<<<<< HEAD
				body += ` - [${name}](${address})`
=======
				body += `[${name}](${address})`
>>>>>>> 137b99dd72166cc1cedf102c2a2b800d2d40748e
				body += '\n'
				fs.writeFile(fileName, body, (err) => {
				  	if (err) throw err;
				  	console.log('文件：'+ fileName.slice(2) +' 已经更新')
				});
			}
		})
	} else {
		console.log('请输入完整参数')
	}
	
};
//获取除第一个命令以后的参数，使用空格拆分
run(process.argv.slice(2)); 
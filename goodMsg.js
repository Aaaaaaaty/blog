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
				body += `[${name}](${address})`
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
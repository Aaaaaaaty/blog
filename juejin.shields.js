//https://img.shields.io/badge/掘金-600-red.svg
var http = require('http')
var cheerio = require('cheerio')
var superagent = require('superagent')
const fs = require('fs')
const { spawn, exec } = require('child_process')

var juejinUrl = 'https://user-storage-api-ms.juejin.im/v1/getUserInfo'
var query = {
	src:'web',
	uid:'57e371072e958a00541ddcaf',
	token:'eyJhY2Nlc3NfdG9rZW4iOiJ6WDZVMnk3QUVuQXZaT0YzIiwicmVmcmVzaF90b2tlbiI6Ik9UeGpLalgyZk93bHB1V0MiLCJ0b2tlbl90eXBlIjoibWFjIiwiZXhwaXJlX2luIjoyNTkyMDAwfQ==',
	device_id:'1499997315233',
	current_uid:'57e371072e958a00541ddcaf'
}
superagent.get(juejinUrl)
	.query(query)
	.end((err, obj) => {
		var msg = obj.body.d
		var totalCollectionsCount = msg.totalCollectionsCount //喜欢数
		var totalViewsCount = msg.totalViewsCount //阅读数
		changeReadMe(totalCollectionsCount, totalViewsCount)
	})

function changeReadMe(like, read) {
	const fileName = './README.md'
	const readAble = fs.createReadStream(fileName)
	var body = ''
	readAble.on('data', (chunk) => {
	  body += chunk
	})
	readAble.on('end', () => {
		$ = cheerio.load(body)
		var regLike = $('#like').attr('src'),
			regRead = $('#read').attr('src')
		body = body.replace(regLike, 'https://img.shields.io/badge/掘金-'+ (like / 1000).toFixed(1)+'k喜欢-blue.svg')
		body = body.replace(regRead, 'https://img.shields.io/badge/掘金-'+ (read / 1000).toFixed(1)+'k阅读-blue.svg')
		fs.writeFile(fileName, body, (err) => {
		  	if (err) throw err;
		  	var updateRan = 'update' + Number(Math.random().toString().split('.')[1]).toFixed(3)
		  	console.log('The file '+ fileName +' has been saved!')
		  	spawn('git', ['add', '-A'])
		  	spawn('git', ['commit', '-m'+updateRan])
		  	// spawn('git', ['push'])
		});
	})
}


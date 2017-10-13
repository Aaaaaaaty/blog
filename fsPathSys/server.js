const http = require('http')
const url = require('url')
const fs = require('fs')
const fstream = require('fstream')
const tar = require('tar')
const path = require('path')
const multiparty = require('multiparty')
const { exec } = require('child_process')
const zlib = require('zlib')
const gzip = zlib.createGzip()
const unzip = require('unzip')
const archiver = require('archiver');
const FS = require('./fs.js')
const MIME_TYPE = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
}
const server = http.createServer((req, res) => {
	serverStatic(req, res)
}).listen(3044)

function serverStatic(req, res) {
	let pathName = url.parse(req.url).pathname
    let filePath = "." + pathName
    if(~req.url.indexOf('api')){
    	let ip = req.socket.remoteAddress.slice(7),
    		nowTime = new Date().getTime(),
            id = `ip_${ip}_t_${nowTime}`
    	cons('用户ip：' + ip)
 		resolveData(req, res, id)
    } else {
        sendFile(filePath, res)
    }
}
function resolveData(req, res, id) {
    cons('开始处理数据')
    let form = new multiparty.Form()
    form.parse(req, function (err, fields, files) {
        let filename = files['file'][0].originalFilename,
        	targetUrl = fields['targetUrl'],
            targetPath = __dirname + '/files/' + id 
        if (filename) {
        	cons('文件解压缩')
        	fs.mkdirSync(targetPath)
            let inp = fs.createReadStream(files['file'][0].path)
            let extract = unzip.Extract({ path: targetPath })
            inp.pipe(extract)
            extract.on('error', () => {
            	cons('解压出错:' + err);
            })
            extract.on('close', () => {
            	cons('解压完成');
            	FS.fsPathRepeat(targetPath, targetUrl, res, cb)
            	let resultPath
            	function cb(path, res) {
            		let data = {
            			status: '200',
            			path: path
            		}
            		res.writeHead(200, {'Content-type':'application/json'})
            		res.end(JSON.stringify(data))
            	}

            })
        	

        } else {
            let errData = {
                status: 400,
                msg: 'wrong params'
            }
            res.writeHead(400, {'Content-type':'application/json'})
            res.end(JSON.stringify(errData))
        }
          
    })
}
function sendFile(filePath, res) {
	if(filePath.match(/files/)) {
		let dirName = `${filePath}.tar.gz`
		exec(`tar -zcvf ${dirName} ${filePath}`, (error, stdout, stderr) => {
			if (error) {
				cons(`exec error: ${error}`);
				return;
			}
			let out = fs.createReadStream(dirName)
			res.writeHead(200, {
				'Content-type':'application/octet-stream',
				'Content-Disposition': 'attachment; filename=' + dirName.match(/ip_.*/)[0] 
			})
			out.pipe(res) 
		})
	} else {
		fs.open(filePath, 'r+', function(err){
	        if(err){
	            send404(res)
	        }else{
	            let ext = path.extname(filePath)
	            ext = ext ? ext.slice(1) : 'unknown'
	            let contentType = MIME_TYPE[ext] || "text/plain"
	            fs.readFile(filePath,function(err,data){
	                if(err){
	                    send500(res)
	                }else{
	                    res.writeHead(200,{'content-type':contentType})
	                    res.end(data)
	                }
	            })
	        }
	    })
	}
}

function send404(res){
    res.end("<h1 style='text-align:center'>404</h1><p style='text-align:center'>file not found</p>")
}
function send500(res){
    res.end("<h1>500</h1>服务器内部错误！")
}
function cons(str) {
	console.log(str)
	console.log(`------------------------------------------`)
}

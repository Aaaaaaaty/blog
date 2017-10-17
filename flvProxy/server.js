const http = require('http')
const superagent = require('superagent')
const fs = require('fs')
let server = http.createServer((req, res) => {
	var realpath = './stream-98.flv';
	console.log(123)
 	res.setHeader("Content-Type", 'video/x-flv');
 	res.setHeader("Access-Control-Allow-Origin", '*')
 	res.setHeader('Content-type','application/octet-stream')
	res.setHeader('Content-Disposition', 'attachment; filename=test.flv' )
 	var stats = fs.statSync(realpath);
    if (req.headers["range"]) {
        console.log(req.headers["range"])
        var range = utils.parseRange(req.headers["range"], stats.size);
        console.log(range)
        if (range) {
            res.setHeader("Content-Range", "bytes " + range.start + "-" + range.end + "/" + stats.size);
            res.setHeader("Content-Length", (range.end - range.start + 1));
            var stream = fs.createReadStream(realpath, {
                "start": range.start,
                "end": range.end
            });

            res.writeHead('206', "Partial Content");
            stream.pipe(res);
        } else {
            res.removeHeader("Content-Length");
            res.writeHead(416, "Request Range Not Satisfiable");
            res.end();
        }
    } else {
        var stream = fs.createReadStream(realpath);
        res.writeHead('200', "Partial Content");
        stream.pipe(res);
    }
}).listen(4000)
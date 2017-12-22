var superagent = require('superagent')
var cheerio = require('cheerio')
var http = require('http')
var url = require('url');
var async = require('async')
var encoding = require('encoding')

const area = [
    '北京',
    '天津',
    '河北',
    '河南',
    '山东',
    '山西',
    '陕西',
    '内蒙古',
    '辽宁',
    '吉林',
    '黑龙江',
    '上海',
    '江苏',
    '安徽',
    '江西',
    '湖北',
    '湖南',
    '重庆',
    '四川',
    '贵州',
    '云南',
    '广东',
    '广西',
    '福建',
    '甘肃',
    '宁夏',
    '新疆',
    '西藏',
    '海南',
    '浙江',
    '青海',
    '香港',
    '澳门',
]
var numMax = 0
const server = http.createServer((req, res) => {
  var count = 0;
  var fetchUrl = function (offset, callback) {
    count++;
    console.log('当前并发数：', count)
    var baseUrl = 'https://data-gkcx.eol.cn/soudaxue/queryschool.html?messtype=jsonp&callback=jQuery183024315414059533924_1513933822848&province=&schooltype=&page=1&size=30&keyWord1=&schoolprop=&schoolflag=&schoolsort=&schoolid=&_=1513933823095'
    http.get('baseUrl', (res) => {
        var rowData = '' 
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData);
            console.log(parsedData);
          } catch (e) {
            console.error(e.message);
          }
        });
      }).on('error', (e) => {
        console.error(`错误: ${e.message}`);
      });
  };
  var offsets = [];
  for(var i = 1; i < 2; i++) {
    offsets.push(i);
  }
  async.mapLimit(offsets, 5, function (offset, callback) {
    fetchUrl(offset, callback);
  }, function (err, result) {
    // res.writeHead(200, { 'Content-Type': 'text/plain; charset=gb2312' });
    console.log(result)
    // res.end(JSON.stringify(result))
  });
}).listen(9090)
var school = require('./school.json')
var fs = require('fs')
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
var obj = {}
    school.school.forEach(function(data, i) {
        if(!obj[data.province]) {
            obj[data.province] = []  
        }
        obj[data.province].push(data.name)
    })
fs.writeFile('./schoolname.txt', JSON.stringify(obj), (err) => {
    if(err) console.log(err)
})
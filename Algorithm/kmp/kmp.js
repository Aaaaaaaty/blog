//传统算法


var baseStr = ''
var targetStr = 'ABCDEFG'
for(var i = 0; i < 3; i++) {
    baseStr += 'ABCDEF '
}
baseStr += 'ABCDEFG' 

function baseDom(str) {

}
function targetDom(str, index) {

}
function mapStr(base, target) {
    var isMatch = []
    console.time('normal')
    var times = 0
    for(var i = 0; i < base.length; i++) {
        times++
        for(var j = 0; j < target.length; j++) {
            if (i + target.length <= base.length) {
                if (target.charAt(j) === base.charAt(i + j)) {
                    isMatch.push(target.charAt(j))
                } else {
                    break
                }
            }
        }
        if(isMatch.length === target.length) {
            console.timeEnd('normal')
            console.log('移位次数:', times)
            return i
        }
        isMatch = []
    }
    console.timeEnd('normal')
    return -1
}



//kmp
function pmtArr(target) {
    var pmtArr = []
    target = target.split('')
    for(var j = 0; j < target.length; j++) {
        var pmt = target
        var pmtNum = 0
        for (var k = 0; k < j; k++) {
            var head = pmt.slice(0, k + 1)
            var foot = pmt.slice(j - k, j + 1)
            if (head.join('') === foot.join('')) {
                var num = head.length
                if (num > pmtNum) pmtNum = num
            }
        }
        pmtArr.push(j + 1 - pmtNum) 
    }
    return pmtArr
}

function mapKMPStr(base, target) {
    var isMatch = []
    var pmt = pmtArr(target)
    console.time('kmp')
    var times = 0
    for(var i = 0; i < base.length; i++) {
        times++
        for(var j = 0; j < target.length; j++) {
            if(i + target.length <= base.length) {
                if (target.charAt(j) === base.charAt(i + j)) {
                    isMatch.push(target.charAt(j))
                } else {
                    if(!j) break
                    var skip = pmt[j - 1]
                    i += skip - 1
                    break 
                }
            }
        }
        if(isMatch.length === target.length) {
            console.timeEnd('kmp')
            console.log('移位次数:', times)
            return i
        }
        isMatch = []
    }
    console.timeEnd('kmp')
    return -1
    
}
mapKMPStr(baseStr, targetStr)
mapStr(baseStr, targetStr)

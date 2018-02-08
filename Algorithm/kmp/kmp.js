//传统算法


var baseStr = 'BBC ABCDAB ABCDABCDABDE'
var targetStr = 'ABCDABD'
function mapStr(base, target) {
    base = base.split('')
    target = target.split('')
    var isMatch = []
    console.time('normal')
    for(var i = 0; i < base.length; i++) {
        for(var j = 0; j < target.length; j++) {
            if (i + target.length <= base.length) {
                if (target[j] === base[i + j]) {
                    isMatch.push(target[j])
                } else {
                    break
                }
            }
        }
        if(isMatch.length === target.length) {
            console.timeEnd('normal')
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
    base = base.split('')
    target = target.split('')
    var isMatch = []
    var pmt = pmtArr(target)
    console.time('kmp')
    for(var i = 0; i < base.length; i++) {
        for(var j = 0; j < target.length; j++) {
            if(i + target.length <= base.length) {
                if (target[j] === base[i + j]) {
                    isMatch.push(target[j])
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
            return i
        }
        isMatch = []
    }
    console.timeEnd('kmp')
    return -1
    
}
console.log(mapKMPStr(baseStr, targetStr))
console.log(mapStr(baseStr, targetStr))


//传统算法


var baseStr = 'BBC ABCDAB ABCDABCDABDE' 
var targetStr = 'ABCDABD'
var diff = 30
var caller = []
var callerKmp = []

function init() {
    printDom('baseStr', baseStr, 'base')
    printDom('baseStr-kmp', baseStr, 'base-kmp')
    printDom('targetStr', targetStr, 'target')
    printDom('targetStr-kmp', targetStr, 'target-kmp')
    mapKMPStr(baseStr, targetStr)
    mapStr(baseStr, targetStr)
    callerKmp.forEach(function(item, index) {
        setTimeout(function(obj) {
            moveDom('targetStr-kmp', obj, index)
        }.bind(this, item), index * 1000)
    })
    caller.forEach(function(item, index) {
        setTimeout(function(obj) {
            moveDom('targetStr', obj, index)
        }.bind(this, item), index * 1000)
    })
}
function printDom($id, str, type) {
    var htmlStr = ''
    str.split('').forEach(function(item, index) {
        var id = type + index
        htmlStr = '<div id='+ id +' class="div">'+ item +'</div>'
        $('#' + $id).append(htmlStr)
        $('#' + id).css({"left": diff * index})
        if(type === 'target' || type === 'target-kmp') $('#' + id).css({"top": 40})  
    })
    
}

function moveDom(id, data, num) {
    $('#' + id).find(".div").each(function (index, item) {
        $(item).css({"backgroundColor": "#dcdcdc"})
        $(item).css({ 'left': diff * (data.index + index) + 'px' })
        if(data.matchArr.length && index <= data.matchArr.length - 1) {
            $(item).css({"backgroundColor": "red"})
        }
    }).parent().siblings('.num').find('span').html(num)
}
function mapStr(base, target) {
    var isMatch = []
    console.time('normal')
    var times = 0
    for(var i = 0; i < base.length; i++) {
        times++
        var tempIndex = 0
        for(var j = 0; j < target.length; j++) {
            if (i + target.length <= base.length) {
                if (target.charAt(j) === base.charAt(i + j)) {
                    isMatch.push(target.charAt(j))
                } else {
                    break
                }
            }
        }
        var data = {
            index: i,
            matchArr: isMatch
        }
        caller.push(data)
        if(tempIndex) i = tempIndex
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
        var tempIndex = 0
        for(var j = 0; j < target.length; j++) {
            if(i + target.length <= base.length) {
                if (target.charAt(j) === base.charAt(i + j)) {
                    isMatch.push(target.charAt(j))
                } else {
                    if(!j) break
                    var skip = pmt[j - 1]
                    tempIndex = i + skip - 1
                    break 
                }
            }
        }
        var data = {
            index: i,
            matchArr: isMatch
        }
        callerKmp.push(data)
        if(tempIndex) i = tempIndex
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



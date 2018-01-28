/**
 * 1.把开始结点压入队。
 * 2.把开始结点状态写入哈希表
 * 3.出队，访问结点。
 * 4.创建结点的子结点，检查是否为目标状态。若是，搜索结束，若否，检查哈希表是否存在此状态。若已有此状态，跳过，若无，把此结点压入队。
 * 5.重复3，4步骤，即可得解。
 * 6.我们根据目标状态结点回溯其父节点，可以得到完整的路径。 
 */


function EightPuzzles(option) {
    this.queue = []
    this.hash = {}
    this.prevVertx = {} //记录节点前溯点
    this.startNode = this.currentNode = option.startNode
    this.startNodeStr = this.startNode.toString().split(',').join('')
    this.endNode = option.endNode
    this.endNodeStr = this.endNode.toString().split(',').join('')
    this.isFind = false
}
EightPuzzles.prototype.solveEightPuzzles = function() {
    if(this.isCanMoveToEnd(this.startNode, this.endNode)) {
        var _ = this
        this.queue.push(this.startNode)
        this.hash[this.startNodeStr] = this.startNode
        while(!this.isFind) { 
            var currentNode = this.queue.shift(),
                currentNodeStr = currentNode.toString().split(',').join('')
            result = this.getChildNodes(currentNode)
            result.forEach(function (item, i) {
                var itemStr = item.toString().split(',').join('')
                if (!_.hash[itemStr]) {
                    _.queue.push(item)
                    _.hash[itemStr] = item
                    _.prevVertx[itemStr] = currentNodeStr
                }
                if(_.endNodeStr === itemStr) {
                    var path = []; // 用于保存路径
                    // 从目标顶点一直回溯到起始顶点
                    for (var v = _.endNodeStr; v != _.startNodeStr; v = _.prevVertx[v]) {
                        path.push(_.hash[v]) // 顶点添加进路径
                    }
                    path.push(_.hash[_.startNodeStr])
                    console.log(path)
                    _.isFind = true
                    return
                }
            })
        }
    } else {
        console.log('无法进行变换得到结果')
    }
    
}
EightPuzzles.prototype.isCanMoveToEnd = function(startNode, endNode) {
    startNode = startNode.toString().split(',')
    endNode = endNode.toString().split(',')
    if(this.calParity(startNode) === this.calParity(endNode)) {
        return true 
    } else {
        return false
    }
}
EightPuzzles.prototype.calParity = function(node) {
    var num = 0
    node.forEach(function(item, index) {
        for(var i = 0; i < index; i++) {
            if (node[i] < item) {
                num++
            }
        } 
    })
    if(num % 2) {
        return 1
    } else {
        return 0
    }
}
EightPuzzles.prototype.getChildNodes = function (currentNode) {
    if(!Array.isArray(currentNode)) return
    var target = {},
        childNodesArr = [],
        direction = [],
        rowNum = currentNode.length,
        colNum = currentNode[0].length
    currentNode.forEach(function(item, i) {
        item.forEach(function(obj, k) {
            if(obj === 0) {
                target = {x: k, y: i}
            }
        })
    })
    direction = this.getDirection(target, rowNum, colNum)
    return this.changePosition(currentNode, target, direction)
}

EightPuzzles.prototype.getDirection = function (target, rowNum, colNum) {
    var direction = []
    if (!target.x) {
        direction.push('right')
    } else if (target.x === colNum - 1) {
        direction.push('left')
    } else {
        direction = direction.concat(['left', 'right'])
    }
    
    if (!target.y) {
        direction.push('down')
    } else if (target.y === rowNum - 1) {
        direction.push('up')
    } else {
        direction = direction.concat(['down', 'up'])
    }
    return direction
}

EightPuzzles.prototype.changePosition = function (node, target, direction) {
    if(direction.length) {
        var childNodesArr = []
        direction.forEach(function(item, index) {
            var temp
            var _node = JSON.parse(JSON.stringify(node))
            switch(item)
                {
                    case 'left':
                        temp = _node[target.y][target.x]
                        _node[target.y][target.x] = _node[target.y][target.x - 1] 
                        _node[target.y][target.x - 1] = temp 
                        break
                    case 'right':
                        temp = _node[target.y][target.x]
                        _node[target.y][target.x] = _node[target.y][target.x + 1]
                        _node[target.y][target.x + 1] = temp 
                        break
                    case 'down':
                        temp = _node[target.y][target.x]
                        _node[target.y][target.x] = _node[target.y + 1][target.x]
                        _node[target.y + 1][target.x] = temp
                        break
                    case 'up':
                        temp = _node[target.y][target.x]
                        _node[target.y][target.x] = _node[target.y - 1][target.x]
                        _node[target.y - 1][target.x] = temp
                        break
                }
            childNodesArr.push(_node)
        })
        return childNodesArr
    }
}
var option = {
    startNode: [
        [1, 2, 3],
        [4, 0, 5],
        [6, 7, 8]
    ],
    endNode: [
        [2, 1, 3],
        [6, 0, 8],
        [7, 4, 5]
    ]
}
var eightPuzzles = new EightPuzzles(option)
eightPuzzles.solveEightPuzzles()
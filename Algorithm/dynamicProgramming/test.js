var length = 10
var price = [1,2,7,9,10,12,13,20,24,30,30]
var num = 0
function calMax(price, n, num) {
    num++
    if(!n) return 0
    var q = 0
    for(var i = 1; i<=n; i++) {
        q = Math.max(q, price[i - 1] + calMax(price, n - i, num))
    }
    return q
}
var result = calMax(price, length, num)
console.log(result)
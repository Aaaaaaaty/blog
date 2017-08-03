### 561.Array Partition I

> Given an array of 2n integers, your task is to group these integers into n pairs of integer, say (a1, b1), (a2, b2), ..., (an, bn) which makes sum of min(ai, bi) for all i from 1 to n as large as possible.
```
Input: [1,4,3,2]

Output: 4
Explanation: n is 2, and the maximum sum of pairs is 4 = min(1, 2) + min(3, 4).
```
### solution
```
function calMax(arr) {
  var result = 0
  arr.sort(function(a, b) {
    return a - b
  })
  for(var j = 0; j < arr.length; j += 2) {
    result += arr[j]
  }
  return result
}
console.log(calMax([1,2,3,4])) //4
```
### 566. Reshape the Matrix

```
//v1
var matrixReshape = function(nums, r, c) {
    var arr = []
	var result = []
    nums.forEach(function(item, index) {
    	item.forEach(function(obj, index) {
    		arr.push(obj)
    	})
    })
    if(r * c !== arr.length) {
    	return nums
    } else {
    	for(var i = 0; i < r; i++) {
    		result[i] = [] 
    		for(var j = 0; j < c; j++) {
    			result[i].push(arr[(i) * c + j])
    		}
    	}
    }
    return result
}
//v2
var matrixReshape = function(nums, r, c) {
	var m = nums.length,
		n = nums[0].length,
		result = []
    if(r * c !== m * n) {
    	return nums
    } else {
    	for(var j = 0; j < r; j++){
    		result[j] = []
    	}
    	for(var i = 0; i < r * c; i++) {
    		result[parseInt(i / c)].push((nums[parseInt(i / n)][(i) % n]))
    	}
    }
    return result
}
console.log(matrixReshape([[1,2], [3,4], [5,6]], 2, 3))

```
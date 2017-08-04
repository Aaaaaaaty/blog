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
        result = new Array(r).fill(0).map(() => [])
    if(r * c !== m * n) {
        return nums
    } else {
        for(var i = 0; i < r * c; i++) {
            result[parseInt(i / c)].push((nums[parseInt(i / n)][(i) % n]))
        }
    }
    return result
}
console.log(matrixReshape([[1,2], [3,4], [5,6]], 2, 3))

console.time('fill')
result = new Array(1000000).fill(0).map(() => [])
console.timeEnd('fill') //962.566ms

console.time('fill')
result = []
for(var j = 0; j < 1000000; j++){ //76.609ms
    result[j] = []
}
console.timeEnd('fill')

```
### 485. Max Consecutive Ones
>Input: [1,1,0,1,1,1]
>Output: 3
>Explanation: The first two digits or the last three digits are consecutive 1s.
>    The maximum number of consecutive 1s is 3.

```
var findMaxConsecutiveOnes = function(nums) {
    var max = nowMax = 0
    nums.forEach(function(item, index) {
        max = Math.max(max, nowMax = item === 0 ? 0 : nowMax + 1)
    })
    return max
}
console.log(findMaxConsecutiveOnes( [1,0,1,1,1,0,1]))
```
### 448. Find All Numbers Disappeared in an Array
>Given an array of integers where 1 ≤ a[i] ≤ n (n = size of array), some elements appear twice and others appear once.

>Find all the elements of [1, n] inclusive that do not appear in this array.

>Could you do it without extra space and in O(n) runtime? You may assume the returned list does not count as extra space.

```
Example:

Input:
[4,3,2,7,8,2,3,1]

Output:
[5,6]
```
```
//v1
var findDisappearedNumbers = function(nums) {
    var max = nums.length
    var str = nums.join('')
    var result = []
    nums.forEach(function(item, index) {
        if(str.indexOf(index + 1) === -1) {
            result.push(index + 1)
        }
    })

    return result
}
console.log(findDisappearedNumbers([4,3,2,7,8,9,10,10,10,2,3,1]))
//v2
var findDisappearedNumbers = function(nums) {
    var max = nums.length
    var result = []
    for(var i = 0; i < max; i++) {
        var k  = Math.abs(nums[i]) - 1
        if(nums[k] > 0) nums[k] = -nums[k]
    }
    for(var i = 0; i < max; i++) {
        if(nums[i] > 0) result.push(i+1)
    }
    return result
}
console.log(findDisappearedNumbers([5,4,6,7,9,3,10,9,5,6]))
```
### 283. Move Zeroes
> Given an array nums, write a function to move all 0's to the end of it while maintaining the relative order of the non-zero elements.

> For example, given nums = [0, 1, 0, 3, 12], after calling your function, nums should be [1, 3, 12, 0, 0].
```
var moveZeroes = function(nums) {
    nums.forEach(function(item, index) {
        if(item === 0) {
            nums.splice(index, 1)
            nums.push(item)
        }
    })
}
```

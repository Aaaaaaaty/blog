### 561.Array Partition I

#### description
Given an array of 2n integers, your task is to group these integers into n pairs of integer, say (a1, b1), (a2, b2), ..., (an, bn) which makes sum of min(ai, bi) for all i from 1 to n as large as possible.
> Input: [1,4,3,2]
> 
> Output: 4
> Explanation: n is 2, and the maximum sum of pairs is 4 = min(1, 2) + min(3, 4).
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
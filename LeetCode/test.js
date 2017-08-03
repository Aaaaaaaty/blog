/**
 * @param {number[][]} nums
 * @param {number} r
 * @param {number} c
 * @return {number[][]}
 */
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
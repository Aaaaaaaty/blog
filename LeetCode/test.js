/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function(nums) {
    nums.forEach(function(item, index) {
        if(item === 0) {
            nums.splice(index, 1)
            nums.push(item)
        }
    })
}
console.log(moveZeroes([0, 1, 0, 3, 0,1, 12, 0,0]))
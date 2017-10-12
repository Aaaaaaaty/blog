var choice = { //2月无29，干掉
	1: [9, 20, 31],
	2: [1, 15],
	3: [11, 21, 31],
	4: [18, 19, 20],
	5: [9, 19, 29],
	6: [15, 18, 21]
}

var obj = {}
var deleteObj = {}
var resultObj = {}
function brother(choice) {
	Object.keys(choice).forEach(function(item, index) {
		choice[item].forEach(function(data, index) {
			if(!obj[data]) {
				obj[data] = true
			} else {
				obj[data] = false
			}
		})
	})
	Object.keys(obj).forEach(function(num, index) {
		Object.keys(choice).forEach(function(item, index) {
			choice[item].forEach(function(data, index) {
				if(data == num && obj[num]) {
					deleteObj[item] = choice[item]
					delete choice[item]
				} 
			})
		})
	})
	console.log(choice)
}
brother(choice)
function sister(choice) {

}

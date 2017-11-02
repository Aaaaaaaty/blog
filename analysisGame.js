const { execSync } = require('child_process')
let { error } = execSync(`ls`)
console.log(error)
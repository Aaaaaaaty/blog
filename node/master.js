var fork = require('child_process').fork
var cpus = require('os').cpus()
for(var i = 0; i < cpus.length; i++) {
    fork('./test.js')
}
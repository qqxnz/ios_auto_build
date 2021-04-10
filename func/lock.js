
var fs = require("fs");
var path = require('path');


var lock = {};

var file = path.resolve(__dirname ,'../lockfile');

lock.islock = function(){
    return fs.existsSync(file);
}


lock.lock = function(){
    if(fs.existsSync(file)){
        fs.unlinkSync(file);
    }
   var timestamp =  Math.round(new Date() / 1000);
    fs.appendFileSync(file,`${timestamp}`);
    return fs.existsSync(file);
}

lock.unlock = function(){
    fs.unlinkSync(file);
    return !fs.existsSync(file);
}


lock.isTimeOut = function(){
    var data = fs.readFileSync(file);
    var timestamp = new Number(data.toString());
    var current = Math.round(new Date() / 1000);
    if(current - timestamp > 1800){//30分钟
        return true;
    }
    return false;
}

module.exports = lock;
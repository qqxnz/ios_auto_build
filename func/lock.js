
var fs = require("fs");
var path = require('path');


var lock = {};


lock.islock = function(name){
    var file = getFileWithName(name);
    return fs.existsSync(file);
}


lock.lock = function(name){
    var file = getFileWithName(name);
    if(fs.existsSync(file)){
        fs.unlinkSync(file);
    }
   var timestamp =  Math.round(new Date() / 1000);
    fs.appendFileSync(file,`${timestamp}`);
    return fs.existsSync(file);
}

lock.unlock = function(name){
    var file = getFileWithName(name);
    fs.unlinkSync(file);
    return !fs.existsSync(file);
}


lock.isTimeOut = function(name){
    var file = getFileWithName(name);
    var data = fs.readFileSync(file);
    var timestamp = new Number(data.toString());
    var current = Math.round(new Date() / 1000);
    if(current - timestamp > 1800){//30分钟
        return true;
    }
    return false;
}

module.exports = lock;


function getFileWithName(name){
    var dir = path.resolve(__dirname ,'../temp/');
    if(!fs.existsSync(dir)){
		fs.mkdirSync(dir);
    }
   return path.resolve(__dirname ,'../temp/lockfile_') + name;
}
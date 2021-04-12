
var fs = require("fs");
var path = require('path');
var execSync = require('child_process').execSync;

var commit = {};

commit.lastBuildCommit = function(name){
    var file = getFileWithName(name);
    if(fs.existsSync(file)){
        var data = fs.readFileSync(file);
        return data.toString();
    }
    return '';
}

commit.lastCommit = function(){
    var data = execSync('git show');
    var arr = data.toString().split(' ');
    if(arr.length  > 2){
       var arr1 = arr[1].split('\n');
       return arr1[0];
    }
    return ''; 
}


commit.saveLastBuildcommit = function(name,commit){
    var file = getFileWithName(name);
    if(fs.existsSync(file)){
        fs.unlinkSync(file);
    }
    fs.appendFileSync(file,`${commit}`);
    return fs.existsSync(file);
}

module.exports = commit;


function getFileWithName(name){
    var dir = path.resolve(__dirname ,'../temp/');
    if(!fs.existsSync(dir)){
		fs.mkdirSync(dir);
    }
   return path.resolve(__dirname ,'../temp/last_build_commit_') + name;
}
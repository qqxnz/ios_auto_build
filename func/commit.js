
var fs = require("fs");
var path = require('path');
var execSync = require('child_process').execSync;

var commit = {};

var file = path.resolve(__dirname ,'../last_build_commit.txt');


commit.lastBuildCommit = function(){
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


commit.saveLastBuildcommit = function(commit){
    if(fs.existsSync(file)){
        fs.unlinkSync(file);
    }
    fs.appendFileSync(file,`${commit}`);
    return fs.existsSync(file);
}

module.exports = commit;
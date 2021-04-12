var fs = require("fs");
var path = require('path');
var execSync = require('child_process').execSync;

var sapceDir = path.resolve(__dirname ,'../workspace/');

var _spaceName = '';

var workspace = {};
workspace.setName = function(name){
    _spaceName = name;
}

workspace.exists = function(){
    if(!fs.existsSync(sapceDir)){
        fs.mkdirSync(sapceDir);
    }
    var dir = sapceDir + '/'+ _spaceName + '/';
    return fs.existsSync(dir);
}

workspace.cloneRepository = function(repository,branch){
    process.chdir(sapceDir);
    var result = execSync(`git clone ${repository} ${_spaceName} -b ${branch}`);
    console.log(result);
}

workspace.fetch = function(){
    var dir = sapceDir + '/'+ _spaceName + '/';
    process.chdir(dir);
    execSync('git reset --hard');
    execSync('git fetch');
    execSync('git pull');
}

workspace.repositoryPath = function(){
    var path = sapceDir + '/' + _spaceName + '/';
    return path;
}

module.exports = workspace;
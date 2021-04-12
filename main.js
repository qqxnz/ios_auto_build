const process = require('process');
var execSync = require('child_process').execSync;
var logs = require('./func/logs.js');
var lock = require('./func/lock.js');
var commit = require('./func/commit.js');
var config = require('./func/config.js');
var workspace = require('./func/workspace.js');

//获取参数-config
function buildName(){
    var config;
    for(var i = 0 ; i < process.argv.length; i++){
        var arg = process.argv[i];
        if(arg.indexOf('-config:') >= 0){
            config = arg.substring(8,arg.length);
            break;
        }
    }
    return config != null ? config : '';
}


//检查配置文件
if(!config.loadfile(`${buildName()}.json`)){
    throw new Error(`未检查到配置文件:${config.fileName}`);
    return;
}

workspace.setName(buildName());

//打包
function buildStart(){

    print('检查是否在打包中~');
    if(lock.islock(config.fileName)){
        print('检查上次打包是否超时~');
        if(lock.isTimeOut(config.fileName)){
            print('上次打包超时，删除lockfile');
            lock.unlock(config.fileName);
        }else{
            print('正在打包中，本次不执行操作~~~~~~~');
            return;    
        }
    }


if(!workspace.exists()){
    print('未找到项目，开始clone 项目~~~');
    workspace.cloneRepository(config.get('repository'),config.get('branch'));
}


    var date = new Date();
    var day = 	date.getDate();
    var month = date.getMonth()+ 1;
    var year = date.getUTCFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    var bulidID = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    print('本次打包ID:' + bulidID);

    print('进入工程目录');
    process.chdir(workspace.repositoryPath());

    print('拉取代码');

    print('检查是否有新的commit~~~');
    var last = commit.lastCommit();
    var lastBuild = commit.lastBuildCommit();
    if(lastBuild == last){
        print('暂时没有新的commit~~~~');
        return;
    }

    print('开始上锁并打包~~~~');

    lock.lock(config.fileName);

    //脚本
    var shell = config.get('shell');
    var shellArray = shell.split(' ');
    var sh = shellArray[0];
    shellArray.splice(0,1);
    print('shell:' + shell);


    const { spawn } = require('child_process');
    const fastlane = spawn(sh, shellArray);

    fastlane.stdout.on('data', (data) => {
        logs.write(`${bulidID}`,data);
        print(`log: ${data}`);
    });

    fastlane.stderr.on('data', (data) => {
        print(`err: ${data}`);
    });

    fastlane.on('close', (code) => {
        print(`打包进程退出，退出码 ${code}`);
        var lastBuildCommit = commit.lastCommit;
        commit.saveLastBuildcommit(lastBuildCommit);
        lock.unlock(config.fileName);
    });

}




//控制台输出
function print(obj){
    console.log('###IOSBuild:'+ obj);
}
   

//启动
buildStart();

var seconds = config.get('loop_seconds');

print('打包循环检查时间:' + seconds);

setInterval(function(){
    //定时循环启动
    buildStart();
},seconds * 1000);

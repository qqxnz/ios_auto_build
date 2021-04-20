/**短信功能
创建时间：2016-08-20
创建人：吕扶美

更新时间：2016-09-23
更新内容：增加设置缓存功能
更新人：吕扶美
*/

//cache.js
var fs = require('fs');
var cache = require('memory-cache');

var config = {};

/**
缓存配置模块！
注：此文件需要与配置文件放在同一目录中，配置文件必须是.json格式文件
使用方法:
var config = require('./config/config.js');
//读取或更新缓存
config.readfile();
//使用缓存内容
var conf = config.get("config");
console.log(conf.版本号);
*/


//更新缓存
config.loadfile = function(fileName){
	this.fileName = fileName;
	var path = './www/config/' + fileName;
	if(!fs.existsSync(path)){
		return false;
	}
	try{
		var config = fs.readFileSync(path);
		var json = JSON.parse(config.toString());
		for (var key in json) {
			cache.put(key, json[key]);
		}
		return true;
	}catch(e){
		console.error('读取配置文件出错误！！');
		return false;
	}
}

//获取缓存
config.get = function(key){
	return cache.get(key);
}


//设置缓存
config.set = function(key,obj){
	try{
		cache.put(key, obj);
		return true;
	}catch(e){
		return false;
	}
	
}



module.exports = config;
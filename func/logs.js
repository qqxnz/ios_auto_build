/**日志功能
创建时间：2016-09-23
创建人：吕扶美

更新时间
更新内容：
更新人：

*/
var fs = require("fs");
var path = require('path');



var logs = {};


logs.write = function(type,data){
	var dir = path.resolve(__dirname ,'../_logs/');
	if(fs.existsSync(dir) == false){
		fs.mkdirSync(dir);
	}
	fs.appendFileSync(dir+'/'+ type +'.txt', data+'\n');
}



module.exports = logs;
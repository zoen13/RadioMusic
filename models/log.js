var mongoose = require('mongoose');

var logSchema = mongoose.Schema({
        
        ip:String,
        
        keyword:String,
        
        createtime:String
});

var info = module.exports = mongoose.model('log',logSchema);


//create log
module.exports.addLog=function(Log,callback){
        info.create(Log,callback);
};
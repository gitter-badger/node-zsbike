/* 
* @Author: weidong
* @Date:   2014-10-30 23:20:00
* @Last Modified by:   weidong
* @Last Modified time: 2014-10-31 00:16:52
*/
var mongoose = require('mongoose');
var config = require('./config');

var db = mongoose.createConnection(config.db); 

db.on('error', function(error) {
    console.log(error);
});

var Schema = mongoose.Schema;
var StationSchema = new Schema({
	name: { type: String},
	address: { type: String},
	lng: { type: Number},
	lat: { type: Number},
	capacity: { type: Number},
	availbike: { type: Number},
	sid: { type: Number},
	create_at: { type: Date, default: Date.now },
	update_at: { type: Date, default: Date.now },
});
db.model('Station', StationSchema);
exports.Station = db.model('Station');
exports.db = db;
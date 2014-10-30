/* 
* @Author: weidong
* @Date:   2014-10-30 23:20:00
* @Last Modified by:   weidong
* @Last Modified time: 2014-10-30 23:42:41
*/
var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect(config.db, function (err) {
  if (err) {
    console.error('connect to %s error: ', config.db, err.message);
    process.exit(1);
  }
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
mongoose.model('Station', StationSchema);
exports.Station = mongoose.model('Station');
/* 
* @Author: weidong
* @Date:   2014-10-29 21:04:19
* @Last Modified by:   weidong
* @Last Modified time: 2014-10-30 23:55:23
*/
var cfg = require('./config.json');
var moment = require('moment');
var crypto =  require('crypto');
var url = cfg.bike_api_url;
var request = require('request');
var models = require('./model');
var Station = models.Station;
console.log('开始时间',moment().format());
var req = request(url,function(error,response,body){
	if(!error&&response.statusCode==200){
		try{
			var data = JSON.parse(body.substr(11));
			console.log('成功获取数据并解析',moment().format());
			var station = data.station;
			for(d in data.station){
				saveToDb(station[d]);
			}					
		}catch(e){
			console.error('发生错误'+e);
		}
	}
	else{
		console.error('获取数据时发生错误');
		console.log('statuscode'+response.statusCode);
		console.log(error);
	}
});

/**
 * 根据ID获取站点信息
 * @param  {[type]}   id       [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function getStationById(id, callback) {
	Station.findOne({'sid': id}, callback);
};

function saveToDb(data){
	console.log('开始更新站点',data.id,' ',data.name);
	getStationById(data.id,function(err,station){
		if(err){
			console.error(err);
		}
		else{
			console.log(station);
			if(station==null){
				console.log('站点',data.name,'没有数据,需要新增记录到数据库');
			 	station = new Station();
			}
			else{
				console.log('站点',data.name,'已经有数据,上次更新时间',station.updated_at,'，更新数据库记录');
			}
			station.name = data.name;
			station.address = data.address;
			station.lat = data.lat;
			station.lng = data.lng;
			station.capacity = data.capacity;
			station.availbike = data.availBike;
			station.sid = data.id;
			station.save();
			console.log('站点',data.name,'更新成功！');
		}
	});
}
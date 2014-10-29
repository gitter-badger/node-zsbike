/* 
* @Author: weidong
* @Date:   2014-10-29 21:04:19
* @Last Modified by:   weidong
* @Last Modified time: 2014-10-29 23:58:59
*/
var cfg = require('./config.json');
var moment = require('moment');
var crypto =  require('crypto');
var url = cfg.bike_api_url;
var request = require('request');
console.log('开始时间',moment().format());
var req = request(url,function(error,response,body){
	if(!error&&response.statusCode==200){
		try{
			var data = JSON.parse(body.substr(11));
			console.log('成功获取数据并解析',moment().format());
			var station = data.station;
			for(d in data.station){
				uploadToAvos(station[d]);
			}
			//for(d in data.station){
			//	uploadToAvos(data[d]);
			//}						
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

function uploadToAvos(data){
	console.log('开始更新站点',data.id,' ',data.name);
	data.sid = data.id;
	delete(data.id);
	var options = buildOptions();
	options.params = 'sid='+data.id;
	var req2 = request(options,function(error,response,body){
		if (!error) {
			if(response.statusCode == 200){
	        	var info = JSON.parse(body);
	        	if(info.results.length>0){
		        	info = info.results[0];
		        	console.log('站点',data.name,'已经有数据,上次更新时间',info.updatedAt,'，需要更新到avoscloud');
		        	var options = buildOptions();
		        	options.url += '/'+info.objectId;
		        	options.method = "PUT";
		        	options.body = JSON.stringify(data);
		        	request(options,function(error,response,body){
		        		if(!error&&response.statusCode==200){
		        			console.log('站点',data.name,'更新成功！');
		        		}
		        		else{
		        			console.error('站点'+data.name+'更新数据到avos的时候发生错误！');
							console.log('statuscode'+response.statusCode);
							console.log(body);
							console.log('=====================');
		        		}
		        	});
	        	}
	        	else{
	        		console.log('站点',data.name,'没有数据,需要上传到到avoscloud');
		        	var options = buildOptions();
		        	options.method = "POST";
		        	options.body = JSON.stringify(data);
		        	request(options,function(error,response,body){
		        		if(!error&&response.statusCode==201){
		        			console.log('站点',data.name,'上传成功！');
		        		}
		        		else{
		        			console.error('站点'+data.name+'上传数据到avos的时候发生错误！');
							console.log('statuscode'+response.statusCode);
							console.log(body);
							console.log('=====================');
		        		}
		        	});
	        	}
	    	}
	    }
	    else{
	    	console.error('站点'+data.name+'在avoscloud获取数据错误');
			console.log('statuscode'+response.statusCode);
			console.log(body);
			console.log('=====================');
	    }
	});
}

function sign(){
	var timestamp = moment().unix();
	var str = timestamp+cfg.avos.key;
	var sign = crypto.createHash('md5').update(str).digest('hex');
	return sign+','+timestamp;
}

function buildOptions(_m){

	var options = {
		url : cfg.avos.url+'classes/Stations',
		headers:{
			'User-Agent': 'node-zsbike',
			'Content-Type': 'application/json',
			'X-AVOSCloud-Application-Id': cfg.avos.id,
			'X-AVOSCloud-Request-Sign': sign()
		}
	};
	return options;
}
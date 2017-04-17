const express = require('express')
const http = require('http')
const app = express()
var bodyParser=require('body-parser')
var rp = require('request-promise')

//以下两句是为了能让程序解析出post上来的数据
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

//手机登录
app.use('/login/cellphone', require('./router/loginCellphone'))

//邮箱登录
app.use('/login', require('./router/login'))
//获取评论
app.use('/comment', require('./router/comment'))

// 获取每日推荐歌曲
app.use('/recommend/songs', require('./router/recommendSongs'))
// 获取每日推荐歌单
app.use('/recommend/resource', require('./router/recommendResource'))

// 获取歌词
app.use('/lyric', require('./router/lyric'))

// 获取专辑
app.use('/album', require('./router/album'))

// 获取歌单
app.use('/user/playlist', require('./router/userPlaylist'))

// 获取歌单内列表
app.use('/playlist/detail', require('./router/playlistDetail'))

//不明 api
app.use('/playlist/tracks', require('./router/playlistTracks'))

// 获取音乐 url
app.use('/music/url', require('./router/musicUrl'))

// 搜歌
app.use('/search', require('.//router/search'))

app.use('/log/web', require('./router/logWeb'))

// 私人 FM
app.use("/personal_fm",require("./router/personal_fm"))

// 喜欢歌曲
app.use("/like",require("./router/like"))

//签到
app.use("/daily_signin",require("./router/daily_signin"))

//垃圾桶
app.use("/fm_trash",require("./router/fm_trash"))

app.post('/api/qbsearch.do',function(req,res){
	//console.log(req.body.key);
	var rp = require('request-promise');
    var options = {
        method:'get',
        uri:'http://localhost:8888/search',
        qs:{keywords:req.body.key},
        headers:{
            'User-Agent': 'Request-Promise'
        },
        json:true
    };
    rp(options).then(function(data){
    	var songArr = data.result.songs;
    	var node=new Array();
    	var copyrightCount=0;
    	for (var c=0;c<songArr.length;c++){
    		if (songArr[c].copyright != 0)
    		{
    			copyrightCount+=1;
    		}
    	}
    	songArr.forEach(function (song){
    		if (song.copyright != 0){
    			var urlrp = require('request-promise');
		        var urloptions = {
		            method:'get',
		            uri:'http://localhost:8888/music/url',
		            qs:{id:song.id},
		            headers:{
		                'User-Agent': 'Request-Promise'
		            },
		            json:true
		        };
		        urlrp(urloptions).then(function(urldata){
    				//console.log(song.album.name+"_"+song.album.publishTime+"_"+song.album.picUrl+"_"+song.artists[0].name+"_"+song.name+"_"+song.id+"_"+song.duration+"_"+urldata.data[0].url);
    				var songString ={
				                "icon": "http://xxxx.xxx.xxx.xx/abc64_64.png",
				                "status": "0",
				                "fileSymble": "",
				                "tag": song.album.name,
				                "refcount": 32,
				                "userid": "",
				                "appid": "aa3ee8fc-0364-45fd-80f7-85f8ff9e8738",
				                "typetag": song.album.name,
				                "wordcount": "1098",
				                "type": song.album.name,
				                "ctime": song.album.publishTime,
				                "version": "1",
				                "content": "<?xml version='1.0' ?><root><node t='A' serverid='5253d2b70ef116f7c5b142e8'>"+song.name+"-"+song.artists[0].name+"</node><node t='D' serverid='5253d2b70ef116f7c5b142e8'>"+"专辑："+song.album.name+"</node><node t='P' serverid='5253d2b70ef116f7c5b142e7'>专辑封面</node></root>",
				                "id": song.id,
				                "author": song.artists[0].name,
				                "lastupdate": "1381141280611",
				                "filesize": "19390445",
				                "title": song.name+"-"+song.artists[0].name,
				                "category": "40",
				                "source": "音乐库",
				                "describe": "音乐库上线啦",
				                "channel": "1",
				                "materials": [
				                    {
				                        "infoid": '5253d2b70ef116f7c5b142e8',
				                        "title": song.name+"-"+song.artists[0].name,
				                        "createtime": "1381225147140",
				                        "type": "1",
				                        "fileid": '5253d2b70ef116f7c5b142e8',
				                        "details": {
				                            "_id": '5253d2b70ef116f7c5b142e8',
				                            "url": urldata.data[0].url,
				                            "playurl": "详见playurl字段说明",
				                            "ineturl": urldata.data[0].url,
				                            "localurl": urldata.data[0].url,
				                            "duration": parseInt(parseInt(song.duration)/1000),
				                            "words": "文字内容",
				                            "prewords": "串词",
				                            "encoder": "aac",
				                            "bitrate": "128000",
				                            "samplerate": "44100"
				                        }
				                    },
						    		{
				                        "infoid": '5253d2b70ef116f7c5b142e7',
				                        "title": "专辑封面",
				                        "createtime": "1381225147140",
				                        "type": "0",
				                        "fileid": '5253d2b70ef116f7c5b142e7',
				                        "details": {
				                            "_id": '5253d2b70ef116f7c5b142e7',
				                            "url": song.album.picUrl,
				                            "playurl": "详见playurl字段说明",
				                            "ineturl": song.album.picUrl,
				                            "localurl": song.album.picUrl
				                        }
				                    }
				                ]
				            };
				    node.push(songString);
				    if (node.length == copyrightCount){
				    	var nodeString=JSON.stringify(node);
					    var nodeContent=nodeString.substring(0,nodeString.length);
					    var preString=JSON.stringify({"ret": 0,"result":0});
					    console.log(preString.substring(0,18)+nodeContent+"}");
					    res.send(preString.substring(0,18)+nodeContent+"}");
						//res.send({"ret": 0,"result":nodeContent});
				    }
    			});
    		}
    	});
    	

    });
	
});

app.get('/api/qblist.do',function(req,res){
		var timeStamp=Date.parse(new Date());
		//console.log(timeStamp);
		res.json({
				    "ret": 0,
				    "result": [
				        {
				            "icon": "http://xxxx.xxx.xxx.xx/abc64_64.png",
				            "status": "0",
				            "fileSymble": "",
				            "tag": "音乐",
				            "refcount": 32,
				            "userid": "",
				            "appid": "aa3ee8fc-0364-45fd-80f7-85f8ff9e8738",
				            "typetag": "音乐库",
				            "wordcount": "1098",
				            "type": "音乐",
				            "ctime": timeStamp,
				            "version": "1",
				            "content": "<?xml version='1.0' ?><root><node t='A' serverid='5253d2b70ef116f7c5b142e8'>张学友：吻别</node></root>",
				            "id": "52525ae60ef15ae2e5632daf",
				            "author": "@Radio音乐库",
				            "lastupdate": "1381141280611",
				            "filesize": "19390445",
				            "title": "请在搜索框内输入关键字，查询您想找的专辑、歌曲、歌手",
				            "category": "40",
				            "source": "音乐库",
				            "describe": "音乐库上线啦",
				            "channel": "1",
				            "materials": [
				                {
				                    "infoid": "5253d2b70ef116f7c5b142e9",
				                    "title": "吻别：张学友",
				                    "createtime": "1381225147140",
				                    "type": "1",
				                    "fileid": "5253d2b70ef116f7c5b142e9",
				                    "details": {
				                        "_id": "e1d51825-c5fb-40d0-9bcf-6939d43fc9a3",
				                        "url": "http://172.27.246.63:8080/mp3/love.mp3",
				                        "playurl": "详见playurl字段说明",
				                        "ineturl": "http://172.27.246.63:8080/mp3/love.mp3",
				                        "localurl": "http://172.27.246.63:8080/mp3/love.mp3",
				                        "duration": "240",
				                        "words": "文字内容",
				                        "prewords": "串词",
				                        "encoder": "aac",
				                        "bitrate": "128000",
				                        "samplerate": "44100"
				                    }
				                }
				            ]
				        }
				    ]
				});
});

process.on('SIGHUP', () => {
  console.log('server: bye bye')
  process.exit()
})

const port = process.env.PORT || 8888

app.listen(port, () => {
  console.log(`server running @${port}`)
})

module.exports = app
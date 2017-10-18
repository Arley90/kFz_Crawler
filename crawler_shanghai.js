/*本项目抓取入库 孔夫子二手书网站 上海地区所有书店（店名、链接、入驻日期）信息*/


const Crawler = require("crawler");  //项目依赖开源爬虫crawler
const MongoClient = require('mongodb').MongoClient;  //项目依赖非关系型数据库mongodb


//定义mongodb邮镖
const DB_CONN_STR = 'mongodb://localhost:27017/bookstore' //保存至database:bookstore


var insertData = function(db, info, callback) {
    
    //保存至表shanghai
    var collection = db.collection('shanghai'); 
    
    //插入数据
    collection.insert(info, function(err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        callback(result);
    });
}

//定义开源爬虫
var c = new Crawler({
    maxConnections: 10,
    // 这个回调每个爬取到的页面都会触发
    callback: function(error, res, done) {
        if (error) {
            console.log(error);
        } else {
            var $ = res.$;
            // $默认使用Cheerio
            // 这是为服务端设计的轻量级jQuery核心实现
            var bookstore = $(".wd310 a") //拿到每一条信息块，书店名称
            var time = $(".last.gray") 
         
            
            for (i = 0; i < bookstore.length; i++) {
                let info = {}
                info.name = bookstore[i].attribs.title //书店名
                info.href = bookstore[i].attribs.href  //链接
                info.date = time[i].children[0].data
                console.log('json:' + JSON.stringify(info))
                
                MongoClient.connect(DB_CONN_STR, function(err, db) {
                    
                    insertData(db, info, function(result) {
                      //  console.log(result);
                        db.close();
                    });
                });  
            }
        }
        done();
    }
});

// 调用爬虫
for (var page = 0; page < 7; page++) {
    c.queue(['http://shop.kongfz.com/shop_list_4_' + page + '_2000000000_0.html']);
}


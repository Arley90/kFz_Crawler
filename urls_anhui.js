//此项目抽取数据库中已入库所有书店url

var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/bookstore';
 
var selectData = function(db, callback) {  
    //连接到表  
    var collection = db.collection('anhui');
    //查询数据
    var whereStr = {};  //关键查询语句，为空表示拿到集合全部元素
    collection.find(whereStr).toArray(function(err, result) {
      if(err)
      {
        console.log('Error:'+ err);
        return;
      }     
      callback(result);
    });
  }
   
  MongoClient.connect(DB_CONN_STR, function(err, db) {
    console.log("连接成功！");
    selectData(db, function(result) {
      for(var i in result){
      console.log(result[i].href); }   //在此处使用循环
      db.close();
    });
  });
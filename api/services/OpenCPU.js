// Opencpu.js - in api/services
module.exports = {

    ///生成报告
    /*
    params:
     {
     callstring:'/library/xxx/R/xxxx/json'
     methodOpt:{
     user:'xxx',
     password:'xxx',
     host:'xxx',
     ... : '...'


     param1:'xxx',
     param2:'xxx'
     }
     }
     */
    reportGenerate: function(params, callback) {
        var local = require("../../config/local.js");
        var opencpu = require("opencpu");
        //rpc接口选项
        var RPCOpt = {
            server: local.opencpu.server,
            root: local.opencpu.root
        };
        console.log(JSON.stringify(params));
        opencpu.rCall('/library/CoaSars/R/' + params.callstring + "/json", params.methodOpt, callback, RPCOpt);
    },
    ///Read file into db-----------------------------------------------/////
    /*
     opt:
     {
     foldpath:"fold",
     name:"filename",
     tablename : opt.tableName,
     }
     */
    dataReadIntoDB: function(opt, callback) {
        var path = require('path');
        var fullpath = path.join(opt.fold, opt.name);
        var local = require("../../config/local.js");
        console.log("------file path" + fullpath + " into db!");
        var opencpu = require("opencpu");
        //rpc接口选项
        var RPCOpt = {
            server: local.opencpu.server,
            root: local.opencpu.root
        };

        //readDbtoPSql方法选项
        var fold = opt.fold + "/";
        var methodOpt = {
            pathfolder: fold,
            inputdataset: opt.name,
            dbname: "myshp",
            tablename: opt.tableName,
            user: local.postgres.user,
            password: local.postgres.password
        };
        //修改文件权限
        var exec = require('child_process').exec;
        var child = exec('chown www-data ' + fullpath,
            function(err, stdout, stderr) {
                console.log(stdout);
            });
        var child2 = exec('chmod 777 ' + fullpath,
            function(err, stdout, stderr) {
                console.log(stdout);
            });
        console.log(RPCOpt);
        opencpu.rCall("/library/CoaSars/R/readDBtoPSQL/json", methodOpt, callback, RPCOpt);
    },

    //获取前n行数据
    /*
     opt:
     {
     tablename:xxxx,
     }
     */
    DataQueryFromPSQL: function(opt, callback) {
        var local = require("../../config/local.js");
        var opencpu = require("opencpu");
        //rpc接口选项
        var RPCOpt = {
            server: local.opencpu.server,
            root: local.opencpu.root
        };
        //ShowTable方法选项
        var methodOpt = {
            host: 'localhost',
            dbname: "myshp",
            tablename: opt.tablename,
            user: local.postgres.user,
            password: local.postgres.password,
            Nobs: 20
        };
        opencpu.rCall("/library/CoaSars/R/ShowTable/json", methodOpt, callback, RPCOpt);
    },

    //创建表
    /*
     opt:
     {
     tablename:xxx
     }
     */
    dataEditCreateTable: function(opt) {
        var local = require("../../config/local.js");
        var opencpu = require("opencpu");
        //rpc接口选项
        var RPCOpt = {
            server: local.opencpu.server,
            root: local.opencpu.root
        };
        //Showtable方法选项
        var methodOpt = {
            host: 'localhost',
            dbname: "myshp",
            tablename: opt.tablename,
            user: local.postgres.user,
            password: local.postgres.password
        };
        opencpu.rCall("/library/CoaSars/R/CreateTable/json", methodOpt, function(err, data) {
            if (!err) {
                res.json({});
            } else {
                console.log("opencpu call failed.");
                res.json({});
            }
        }, RPCOpt);
    },

  //查看数据库中的表
  /*
   */
  dataQueryListTable: function() {
        var local = require("../../config/local.js");
        var opencpu = require("opencpu");
        //rpc接口选项
        var RPCOpt = {
            server: local.opencpu.server,
            root: local.opencpu.root
        };
        //Showtable方法选项
        var methodOpt = {
            host: 'localhost',
            dbname: "myshp",
            user: local.postgres.user,
            password: local.postgres.password
        };
        opencpu.rCall("/library/CoaSars/R/ListTable/json", methodOpt, function(err, data) {
            if (!err) {
                res.json({});
            } else {
                console.log("opencpu call failed.");
                res.json({});
            }
        }, RPCOpt);
    },

    //删除表
    /*
     opt:
     {
     tablename:xxx
     }
     */
    dataEditRemoveTable: function(opt) {
        var local = require("../../config/local.js");
        var opencpu = require("opencpu");
        //rpc接口选项
        var RPCOpt = {
            server: local.opencpu.server,
            root: local.opencpu.root
        };
        //Showtable方法选项
        var methodOpt = {
            tablename: opt.tablename,
            host: 'localhost',
            dbname: "myshp",
            user: local.postgres.user,
            password: local.postgres.password
        };
        opencpu.rCall("/library/CoaSars/R/RemoveTable/json", methodOpt, function(err, data) {
            if (!err) {
                res.json({});
            } else {
                console.log("opencpu call failed.");
                res.json({});
            }
        }, RPCOpt);
    },


    //修改表--添加列
    /*
     opt:
     {
     tablename:xxx,
     colname:xxx
     type:xxx,
     width:4
     }
     */
    dataEditAddColumn: function(opt) {
        var local = require("../../config/local.js");
        var opencpu = require("opencpu");

      //rpc接口选项
        var RPCOpt = {
            server: local.opencpu.server,
            root: local.opencpu.root
        };
        //Showtable方法选项
        var methodOpt = {
            colname: opt.colname,
            datatype: opt.type,
            width: opt.width,
            tablename: opt.tablename,
            host: 'localhost',
            dbname: "myshp",
            user: local.postgres.user,
            password: local.postgres.password
        };
        opencpu.rCall("/library/CoaSars/R/AddColumn/json", methodOpt, function(err, data) {
            if (!err) {
                res.json({});
            } else {
                console.log("opencpu call failed.");
                res.json({});
            }
        }, RPCOpt);
    },

    //修改单个数据
    /*
     opt:
     {
     tablename:xxx,
     colname:xxx,
     Nrow:xxx,
     value:xxx
     }
     */
    dataEditUpdateData: function(opt, callback) {
        var local = require("../../config/local.js");
        var opencpu = require("opencpu");
        //rpc接口选项
        var RPCOpt = {
            server: local.opencpu.server,
            root: local.opencpu.root
        };
        //Showtable方法选项
        var methodOpt = {
            Nrow: opt.coasarsid,
            varvalue: opt.data,
            colname: opt.colname,
            tablename: opt.tablename
        };
        opencpu.rCall("/library/CoaSars/R/UpdateData/json", methodOpt, callback, RPCOpt);
    },
  //添加列
  /*
   opt:
   {
   tablename:xxx,
   colname:xxx,
     Nrow:xxx,
   value:xxx
   }
   */
  dataEditAddColumn: function(opt, callback) {
        var local = require("../../config/local.js");
        var opencpu = require("opencpu");
        //rpc接口选项
        var RPCOpt = {
            server: local.opencpu.server,
            root: local.opencpu.root
        };
        //Showtable方法选项
        var methodOpt = {
          colname:opt.colname,
          tablename:opt.tablename
        };
        opencpu.rCall("/library/CoaSars/R/AddColumn/json", methodOpt, callback, RPCOpt);
    },

    //添加列
  /*
   opt:
   {
   tablename:xxx,
   colname:xxx,
     Nrow:xxx,
   value:xxx
   }
   */
  dataEditDeleteColumn: function(opt, callback) {
        var local = require("../../config/local.js");
        var opencpu = require("opencpu");
        //rpc接口选项
        var RPCOpt = {
            server: local.opencpu.server,
            root: local.opencpu.root
        };
        //Showtable方法选项
        var methodOpt = {
          colname:opt.colname,
          tablename:opt.tablename
        };
        opencpu.rCall("/library/CoaSars/R/DeleteColumn/json", methodOpt, callback, RPCOpt);
    },
    //添加列
  /*
   opt:
   {
   tablename:xxx,
   colname:xxx,
     Nrow:xxx,
   value:xxx
   }
   */
  dataEditAddRow: function(opt, callback) {
        var local = require("../../config/local.js");
        var opencpu = require("opencpu");
        //rpc接口选项
        var RPCOpt = {
            server: local.opencpu.server,
            root: local.opencpu.root
        };
        //Showtable方法选项
        var methodOpt = {
          rowvalues:opt.rowvalues,
          tablename:opt.tablename
        };
        opencpu.rCall("/library/CoaSars/R/AddRow/json", methodOpt, callback, RPCOpt);
    },

    //添加列
  /*
   opt:
   {
   tablename:xxx,
   colname:xxx,
     Nrow:xxx,
   value:xxx
   }
   */
  dataEditDeleteRow: function(opt, callback) {
        var local = require("../../config/local.js");
        var opencpu = require("opencpu");
        //rpc接口选项
        var RPCOpt = {
            server: local.opencpu.server,
            root: local.opencpu.root
        };
        //Showtable方法选项
        var methodOpt = {
          coasarsid:opt.coasarsid,
          tablename:opt.tablename
        };
        opencpu.rCall("/library/CoaSars/R/DeleteRow/json", methodOpt, callback, RPCOpt);
    },

      //修改单个数据
    /*
     opt:
     {
     tablename:xxx,
     pathfolder:,
     name:
     }
     */
    dataEditExportDB: function(opt, callback) {
      var local = require("../../config/local.js");
      var opencpu = require("opencpu");
      //rpc接口选项
      var RPCOpt = {
        server: local.opencpu.server,
        root: local.opencpu.root
      };

      //Showtable方法选项
      var methodOpt = {
        tablename:opt.tablename,
        pathfolder:opt.pathfolder,
        exportname:opt.name
      };
      console.log(opt.tablename+'x'+opt.pathfolder+'x'+opt.name);
      opencpu.rCall("/library/CoaSars/R/exportDB/json", methodOpt, callback, RPCOpt);
    }
};

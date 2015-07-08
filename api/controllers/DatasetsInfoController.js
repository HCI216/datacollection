/**
 * DatasetsInfoController
 *
 * @description :: Server-side logic for managing Datasetsinfoes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var path = require('path');
var crypto = require('crypto');
module.exports = {

  destroy: function(req, res) {
    var id = req.param('id');
    DatasetsInfo
      .destroy({
        id: id
      })
      .exec(function(error) {
        if (error) {
          console.log('delete dataset failed!');
          res.json({
            status: 'error',
            message: 'delete dataset failed!'
          });
        } else {
          res.json({
            status: 'success',
            message: 'delete dataset success!'
          });
        }
      });
  },
  getPageCount: function(req, res) {
    DatasetsInfo.count({
      or: [{
        ispublic: true
      }
      //  , {
      //  owner: req.user.id
      //}
      ]
    }).exec(function countCB(error, found) {
      res.json({
        count: found
      });
    });
  },
  getPage: function(req, res) {
    var page = req.param('page', null);
    var limit = req.param('limit', null);

    console.log("page : " + page);
    console.log("limit : " + limit);

    DatasetsInfo.find({
      or: [{
        ispublic: true
      }, {
        owner: req.user.id
      }],
      sort: 'createdAt DESC'
    }).populate('owner').paginate({
      page: page,
      limit: limit
    })
      .exec(function(error, data) {
        return res.json(data);
      });
  },
  getAll: function(req, res) {
    DatasetsInfo.getAll()
      .spread(function(models) {
        res.json(models);
      })
      .fail(function(err) {
        // An error occured
      });
  },

  getOne: function(req, res) {
    //part 1 : datasetInfo

    DatasetsInfo.getOne(req.param('id'))
      .spread(function(model) {
        var opt = {
          tablename: model.tablename
        };
        console.log(opt.tablename);
        //获取数据
        OpenCPU.DataQueryFromPSQL(opt, function(err, data) {
          if (err) {
            console.log("--------DataQueryFromPSQL CALLBACKS ERROR " + JSON.stringify(data));
            res.json({
              status: "error"
            });
          } else {
            console.log("--------DataQueryFromPSQL CALLBACKS Success!");
            res.json({
              info: model,
              data: data
            });
          }
        });
      })
      .fail(function(err) {
        // res.send(404);
      });
  },

  create: function(req, res) {
    var model = {
      name: req.param('name'),
      filename: req.param('filename'),
      owner: req.param('owner'),
      ispublic: req.param('ispublic'),
      path: req.param('path'),
      description: req.param('description'),
      tablename: req.param('tablename')
    };
    DatasetsInfo.create(model)
      .exec(function(err, model) {
        if (err) {
          console.log(err);
        } else {
          //DatasetsInfo.publishCreate(model.toJSON());
          res.json(model);
        }
      });
  },
  upload: function(req, res) {
    /*
     var userId = req.param('user');
     var model = {
     title: req.param('title'),
     user: userId
     };
     */
    //数据信息
    var dataset_info = req.allParams();
    console.log(dataset_info);

    //随机表名：sha1(name+rand int)
    var sha1 = crypto.createHash('sha1');
    sha1.update(dataset_info.name + parseInt(Math.random() * 10000000 + 1));
    var randTableName = 'j' + sha1.digest('hex').substring(0, 15);

    OpenCPU.dataReadIntoDB({
      fold: path.dirname(dataset_info.path),
      name: path.basename(dataset_info.path),
      tableName: randTableName
    }, function(err, data) {
      if (err) {
        console.log("--------dataReadIntoDB CALLBACKS ERROR" + JSON.stringify(err));
        res.json({
          status: "error"
        });
      } else {
        console.log("-dataReadIntoDB Dataset :" + dataset_info.name + "into" + randTableName);
        DatasetsInfo.create({
          name: dataset_info.name,
          filename: dataset_info.filename,
          owner: req.user.id,
          path: dataset_info.path,
          ispublic: dataset_info.ispublic,
          tablename: randTableName,
          description: dataset_info.description
        }).exec(function createCB(err, created) {
          console.log(dataset_info.name + req.user.id + path.dirname(dataset_info.path) + randTableName);
          if (err) {
            console.log('File Exists Or some else');
            res.json({
              status: 'File Exists Or some else'
            });
          } else {
            res.json({
              status: 'OK'
            });
            console.log('dataset inserted of: ' + created.name);
          }
        });
      }
    });
  },
  newdataset: function(req, res) {
    /*
     var userId = req.param('user');
     var model = {
     title: req.param('title'),
     user: userId
     };
     */
    //数据信息
    var dataset_info = req.allParams();
    console.log(dataset_info);

    //随机表名：sha1(name+rand int)
    var sha1 = crypto.createHash('sha1');
    sha1.update(dataset_info.name + parseInt(Math.random() * 10000000 + 1));
    var randTableName = 'j' + sha1.digest('hex').substring(0, 15);

    OpenCPU.dataReadIntoDB({
      fold: '/tmp/sailng-upload',
      name:'blank.csv',
      tableName: randTableName
    }, function(err, data) {
      if (err) {
        console.log("--------dataReadIntoDB CALLBACKS ERROR" + JSON.stringify(err));
        res.json({
          status: "error"
        });
      } else {
        console.log("-dataReadIntoDB Dataset :" + dataset_info.name + "into" + randTableName);
        DatasetsInfo.create({
          name: dataset_info.name,
          filename: dataset_info.filename,
          owner: req.user.id,
          path: dataset_info.path,
          ispublic: dataset_info.ispublic,
          tablename: randTableName,
          description: dataset_info.description
        }).exec(function createCB(err, created) {
          console.log(dataset_info.name + req.user.id + path.dirname(dataset_info.path) + randTableName);
          if(err){
            console.log('File Exists Or some else');
            res.json({
              status: 'File Exists Or some else'
            });
          } else {
            res.json({
              status: 'OK'
            });
            console.log('dataset inserted of: ' + created.name);
          }
        });
      }
    });
  },
  download: function(req, res) {
    /*
     var userId = req.param('user');
     var model = {
     title: req.param('title'),
     user: userId,
     tablename:xxx
     };
     */
    console.log('1');

    //数据信息
    var tablename=req.param('tablename'),
        pathfolder='/tmp/sailng-reports/',
        name=req.param('name');
    var sha1 = crypto.createHash('sha1');
    sha1.update('x'+parseInt(Math.random() * 10000000 + 1));
    name = name + sha1.digest('hex').substring(0, 15);
    //随机表名：sha1(name+rand int)

    OpenCPU.dataEditExportDB({
      tablename: tablename,
      pathfolder: pathfolder,
      name:name
    },function(err, data){
      if(err){
        console.log("--------OpenCPU 导出 CALLBACKS ERROR" + JSON.stringify(err));
        res.json({
          status: "error"
        });
      }else{
        console.log("导出Dataset:成功");
        res.set('Content-Type','application/octet-stream');
        //res.set('Content-Disposition',"attachment;filename="+pathfolder+name+'.csv');
        res.download(pathfolder+name+'.csv',name+'.csv');
      }
    });
  }
};

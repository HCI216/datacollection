/**
 * DatasetsController
 *
 * @description :: Server-side logic for managing Datasets
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    cellEdit: function(req, res) {
        var opt = {
            colname: req.param('colname'),
            row: req.param('row'),
            coasarsid:req.param('coasarsid'),
            data: req.param('data'),
            tablename: req.param('tablename')
        };
      console.log(opt.colname+'x_'+opt.row+'x'+opt.data+'x'+opt.tablename);
        OpenCPU.dataEditUpdateData(opt, function(err, data) {
            if (err) {
                console.log("--------Cell data Edit CALLBACKS ERROR " + JSON.stringify(err));
                res.json({
                    status: "error"
                });
            } else {
                console.log("--------DataQueryFromPSQL CALLBACKS Success!");
                res.json({
                    celldata: opt,
                    data: data,
                    status: "success"
                });
            }
        });
    },
  newcolumn: function(req, res) {
    var opt = {
      colname: req.param('colname'),
      datatype: req.param('datatype'),
      tablename: req.param('tablename')
    };
    console.log(opt.colname+'x'+opt.tablename);
        OpenCPU.dataEditAddColumn(opt, function(err, data) {
          if (err) {
            console.log("--------Add Column CALLBACKS ERROR " + JSON.stringify(err));
            res.json({
              status: "error"
            });
          } else {
            console.log("--------DataQueryFromPSQL CALLBACKS Success! ---- Add Column");
            res.json({
              celldata: opt,
              data: data,
              status: "success"
            });
          }
        });
  },
  deletecolumn: function(req, res) {
    var opt = {
      colname: req.param('colname'),
      tablename: req.param('tablename')
    };
    console.log(opt.colname+'x'+opt.tablename);
    OpenCPU.dataEditDeleteColumn(opt, function(err, data) {
      if (err) {
        console.log("--------Add Column CALLBACKS ERROR " + JSON.stringify(err));
        res.json({
          status: "error"
        });
      } else {
        console.log("--------DataQueryFromPSQL CALLBACKS Success!");
        res.json({
          celldata: opt,
          data: data,
          status: "success"
        });
      }
    });
  },
  newrow: function(req, res) {
    var opt = {
      rowvalues: req.param('rowvalues'),
      tablename: req.param('tablename')
    };
    console.log(opt.colname+'x'+opt.tablename);
        OpenCPU.dataEditAddRow(opt, function(err, data) {
          if (err) {
            console.log("--------Add Row CALLBACKS ERROR " + JSON.stringify(err));
            res.json({
              status: "error"
            });
          } else {
            console.log("--------DataQueryFromPSQL CALLBACKS Success!");
            res.json({
              celldata: opt,
              data: data,
              status: "success"
            });
          }
        });
  },
  deleterow: function(req, res) {
    var opt = {
      coasarsid: req.param('coasarsid'),
      tablename: req.param('tablename')
    };
    console.log(opt.colname+'x'+opt.tablename);
    OpenCPU.dataEditDeleteRow(opt, function(err, data) {
      if (err) {
        console.log("--------Add Row CALLBACKS ERROR " + JSON.stringify(err));
        res.json({
          status: "error"
        });
      } else {
        console.log("--------DataQueryFromPSQL CALLBACKS Success!");
        res.json({
          celldata: opt,
          data: data,
          status: "success"
        });
      }
    });
  }
};

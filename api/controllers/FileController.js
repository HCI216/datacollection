/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    upload: function(req, res) {
        debugger;
        req.file('file').upload({
            dirname: '/tmp/sailng-upload'
        }, function(err, files) {
            if (err) {
                return res.serverError(err);
            }

            console.log("upload : " + JSON.stringify(files));
            var exec = require('child_process').exec;
            var child = exec('chown www-data ' + files[0].fd, function(err, stdout, stderr) {
                console.log(stdout);
            });
            var mod_child = exec('chmod 777 ' + files[0].fd, function(err, stdout, stderr) {
                console.log(stdout);
            });
            return res.json({
                message: files.length + ' file(s) uploaded successfully!',
                files: files
            });
        });
    }
};

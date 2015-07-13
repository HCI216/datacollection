// myApp/api/controllers/FileController.js

module.exports = {

    index: function(req, res) {

        res.writeHead(200, {
            'content-type': 'text/html'
        });
        res.end(
            '<form action="api/jqfile/upload" enctype="multipart/form-data" method="post">' +
            '<input type="text" name="title"><br>' +
            '<input type="file" name="avatar" multiple="multiple"><br>' +
            '<input type="submit" value="Upload">' +
            '</form>'
        )
    },
    upload: function(req, res) {
        console.log('wo ca');
        req.file('avatar').upload(function(err, files) {
            if (err)
                return res.serverError(err);

            return res.json({
                message: files.length + ' file(s) uploaded successfully!',
                files: files
            });
        });
    }
};

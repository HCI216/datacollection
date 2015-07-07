/**
 * NewsController
 *
 * @description :: Server-side logic for managing news
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    create: function(req, res) {
        var title = req.param('title');
        var content = req.param('content');
        News
            .create({
                title: title,
                content: content
            })
            .exec(function(error, data) {
                if (!error) {
                    console.log('发布了新的消息:\ntitle:' + data.title + '\ncontent:' + data.content);
                    res.json(data);
                } else {
                    res.json({
                        status: 'error',
                        message: 'create news failed!'
                    });
                }
            });
    },
    destroy: function(req, res) {
        var id = req.param('id');
        News
            .destroy({
                id: id
            })
            .exec(function(error) {
                if (error) {
                    console.log('delete news failed!');
                    res.json({
                        status: 'error',
                        message: 'delete news failed!'
                    });
                } else {
                    res.json({
                        status: 'success',
                        message: 'delete news success!'
                    });
                }
            });
    },
    getAll: function(req, res) {
        News
            .find({sort: 'createdAt DESC'})
            .exec(function(error, data) {
                if (!error)
                    res.json(data);
            });
    }
};

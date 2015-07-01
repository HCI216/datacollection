/**
 * ReportsInfo.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        name: {
            type: 'string',
            required: true
        },
        owner: {
            model: 'User'
        },
        ispublic: {
            type: 'boolean',
            defaultsTo: false
        },
        //报告文件路径
        path: {
            type: 'string',
            required: true,
            unique: true
        },
        description: {
            type: 'string'
        },
        //报告使用的数据集
        dataset: {
            model: 'DatasetsInfo'
        },
        //报告使用的模板
        templates: {
            model: 'TemplatesInfo'
        }
    },
    ///number :number of users;max=1000 000;
    createDemoData: function(number) {
        var max = 1000000000,
            rd, found;
        if (number > 1000000)
            number = 1000000;
        User.count().exec(function countCB(error, found) {
            for (var i = 0; i < number; i++) {
                rd = parseInt(Math.random() * max + 1);
                owne = parseInt(Math.random() * found + 1);
                ReportsInfo.create({
                        name: 'template_' + rd,
                        owner: owne,
                        path: 'path' + rd,
                        description: 'description_' + rd,
                        dataset: 1,
                        templates: 1
                    })
                    .exec(function createCB(err, created) {
                        console.log(owne + 'Created user with username ' + created.name);
                    });
            }
        });
    },

    getAll: function(userid) {
        return ReportsInfo.find({
                or: [{
                    ispublic: true
                }, {
                    owner: userid
                }]
            })
            .then(function(models) {
                return [models];
            });
    },

    getOne: function(id) {
        return ReportsInfo.findOne(id)
            .then(function(model) {
                return [model];
            });
    }
};

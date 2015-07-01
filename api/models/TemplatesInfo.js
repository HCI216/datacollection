/**
 * TemplatesInfo.js
 *
 * @description :: TODO: 算法模板信息表.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        name: {
            type: 'string',
            required: true,
            unique: true
        },
        //拥有着(都是admin)
        owner: {
            model: 'User'
        },
        ispublic: {
            type: 'boolean',
            defaultsTo: false
        },
        //调用路径
        callstring: {
            type: 'string',
            required: true
        },
        //参数文件路径
        path: {
            type: 'string',
            required: true,
            unique: true
        },
        //描述
        description: {
            type: 'string',
            required: true
        },
        catalog: {
            model: 'Catalog',
            defaultsTo: 1
        }
    },

    ///number :number of users;max=1000 000;
    createDemoData: function(number) {
        var max = 1000000000,
            rd;
        if (number > 1000000) number = 1000000;
        User.count().exec(function countCB(error, found) {
            for (var i = 0; i < number; i++) {
                rd = parseInt(Math.random() * max + 1);
                owne = parseInt(Math.random() * found + 1);
                TemplatesInfo.create({
                        name: 'dataset_' + rd,
                        owner: owne,
                        callstring: 'path' + rd,
                        description: 'description_' + rd
                    })
                    .exec(function createCB(err, created) {
                        console.log('Created user with username ' + created.name);
                    });
            }
        });
    },
    getAll: function() {
        return TemplatesInfo.find()
            .then(function(models) {
                return [models];
            });
    },

    getOne: function(id) {
        return TemplatesInfo.findOne(id)
            .then(function(model) {
                return [model];
            });
    }
};

/**
 * DatasetsInfo.js
 *
 * @description :: TODO: 描述数据集的信息，如拥有者信息，权限等等.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        name: {
            type: 'string',
            required: true,
            unique: true
        },
        filename: {
            type: 'string',
            defaultsTo: 'datasetFile'
        },
        owner: {
            model: 'User'
        },
        ispublic: {
            type: 'boolean',
            defaultsTo: false
        },
        path: {
            type: 'string',
            required: true
        },
        tablename: {
            type: 'string',
            required: true,
            unique: true
        },
        description: {
            type: 'string',
            required: true
        }
    },

    ///number :number of users;max=1000 000;
    createDemoData: function(number) {
        var max = 1000000000,
            rd, owne;
        if (number > 1000000)
            number = 1000000;
        User.count().exec(function countCB(error, found) {
            for (var i = 0; i < number; i++) {
                rd = parseInt(Math.random() * max + 1);
                owne = parseInt(Math.random() * found + 1);
                DatasetsInfo.create({
                        name: 'dataset_' + rd,
                        owner: owne,
                        path: 'path' + rd,
                        tablename: 'table' + rd,
                        description: 'description_' + rd
                    })
                    .exec(function createCB(err, created) {
                        console.log('Created user with username ' + created.name);
                    });
            }
        });
    },
    getAll: function() {
        return DatasetsInfo.find()
            .then(function(models) {
                return [models];
            });
    },
    getOne: function(id) {
        return DatasetsInfo
            .findOne(id)
            .populate('owner')
            .then(function(model) {
                return [model];
            });
    }
};

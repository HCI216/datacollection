/**
 * Catalog.js
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
        items: {
            collection: 'TemplatesInfo',
            via: 'catalog'
        }
    },
    ///number :number of users;max=1000 000;
    createDemoData: function(number) {
        var max = 1000000000;
        if (number > 1000000) number = 1000000;
        var rd, usercount;
        User.count().exec(function countCB(error, found) {
            Catalog.create({
                name: 'dataset_root',
                owner: 1,
                level: 0,
                parent: 0,
                id: 1
            }).exec(function cb(err, created) {
                if (!err) console.log('created dir ' + created.name);
            });
            Catalog.create({
                    name: 'template_root',
                    owner: 1,
                    level: 0,
                    parent: 0,
                    id: 2
                })
                .exec(function cb(err, created) {
                    if (!err)
                        console.log('created dir ' + created.name);
                });
            Catalog.create({
                name: 'reports_root',
                owner: 1,
                level: 0,
                parent: 0,
                id: 3
            }).exec(function cb(err, created) {
                if (!err)
                    console.log('created dir ' + created.name);
            });
            for (var i = 0; i < number; i++) {
                rd = parseInt(Math.random() * max + 1);
                Catalog.create({
                        name: 'dir_' + rd,
                        owner: 15,
                        level: 1,
                        parent: 5,
                        dtype: 'dataset'
                    })
                    .exec(function createCB(err, creat) {
                        console.log('Created catalog with name ' + creat.name);
                    });
            }
        });
    },
    getAll: function() {
        return Catalog.find()
            .then(function(models) {
                return [models];
            });
    },
    getOne: function(id) {
        return Catalog.findOne(id)
            .then(function(model) {
                return [model];
            });
    },
    getByUserAndType: function(ownerId, type) {
        return Catalog.find({
                owner: ownerId,
                dtype: type
            })
            .then(function(model) {
                return [model];
            });
    },
    getUserRootDir: function(id, type) {
        return Catalog.find({
                owner: ownerId,
                dtype: type,
                name: 'dataset'
            })
            .then(function(model) {
                return [model];
            });
    }
};

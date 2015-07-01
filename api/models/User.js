/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcrypt');

module.exports = {
  attributes: {
    isadmin:{
      type:'boolean',
      defaultsTo:false
    },
    username: {
      type: 'string',
      required: true,
      unique: true
    },
    email: {
      type: 'email',
      required: true,
      unique: true
    },
    first_name: {
      type: 'string'
    },
    detail_sex:{
      type: 'string',
      defaultsTo:'男'
    },
    detail_edu:{
      type: 'string',
      defaultsTo:''
    },
    detail_birthday:{
      type: 'string',
      defaultsTo:''
    },
    detail_cellnumber:{
      type: 'string',
      defaultsTo:''
    },
    detail_phonenumber:{
      type: 'string',
      defaultsTo:''
    },
    detail_city:{
      type: 'string',
      defaultsTo:''
    },
    detail_workplace:{
      type: 'string',
      defaultsTo:''
    },
    message_count: {
      type: 'number'
    },
    // A User can have many messages
    messages: {
      collection: 'message',
      via: 'user'
    },
    activated:{
      type : 'boolean',
      defaultsTo : false
    },
    activatecode:{
      type : 'string'
    },
    passports : {
      collection: 'Passport', via: 'user'
    },
    isViptype : {
      type : 'boolean',//普通或者企业账号
      required : true,
      defaultsTo : false
    },
    datasets : {
      collection : 'DatasetsInfo',
      via : 'owner'
    },
    reports : {
      collection : 'ReportsInfo',
      via : 'owner'
    },
    templates : {
      collection : 'TemplatesInfo',
      via : 'owner'
    },
    catalog : {
      collection : 'Catalog',
      via : 'owner'
    }
  },

  ///number :number of users;max=1000 000;
  createDemoData: function(number){
    var max=1000000000;
    if(number>1000000)number=1000000;
    var rd;
    for(var i=0;i<number;i++){
      rd=parseInt(Math.random()*max+1);
      User.create({username:'user'+rd,
        email:'emailOf'+rd+'@qq.com',
        first_name:'firstnameof'+rd,
        isViptype:false,
        id:rd})
        .exec(function createCB(err,created){
          console.log('Created user with username '+created.username);
        });
    }
  },
  getAll: function() {
    return User.find()
      .then(function (models) {
        return [models];
      });
  },

  getOne: function(id) {
    return User.findOne(id)
      .then(function (model) {
        return [model];
      });
  }
};

var validator = require('validator');
var crypto = require('crypto');
/**
 * Local Authentication Protocol
 *
 * The most widely used way for websites to authenticate users is via a username
 * and/or email as well as a password. This module provides functions both for
 * registering entirely new users, assigning passwords to already registered
 * users and validating login requesting.
 *
 * For more information on local authentication in Passport.js, check out:
 * http://passportjs.org/guide/username-password/
 */

/**
 * Register a new user
 *
 * This method creates a new user from a specified email, username and password
 * and assign the newly created user a local Passport.
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */

exports.register = function(req, res, next) {
    var email = req.param('email'),
        username = req.param('username'),
        password = req.param('password'),
        first_name = req.param('first_name');

    if (!email) {
        req.flash('error', 'Error.Passport.Email.Missing');
        return next(new Error('No email was entered.'));
    }

    if (!username) {
        req.flash('error', 'Error.Passport.Username.Missing');
        return next(new Error('No username was entered.'));
    }

    if (!password) {
        req.flash('error', 'Error.Passport.Password.Missing');
        return next(new Error('No password was entered.'));
    }

    if (!first_name) {
        req.flash('error', 'Error.Passport.Email.Missing');
        return next(new Error('No first name was entered.'));
    }
    console.log('register ! from local.js line 50');
    var sha1 = crypto.createHash('sha1');
    sha1.update(username + parseInt(Math.random() * 10000000 + 1));
    var activatecode = 'jgen' + sha1.digest('hex').substring(0, 15);
    User.create({
        username: username,
        email: email,
        first_name: first_name,
        activatecode: activatecode
    }).exec(function(err, user) {
        if (err) {
            req.flash('error', 'Error.Passport.User.Exists');
            return next(err);
        } else {
            if (user.id == 1) {
                var model = {
                    name: 'default',
                    owner: 1
                };
              User.update({
                id:1
              }, {
                isadmin:true
              }).exec(function(err, passport) {
              });
              Catalog.create(model)
                    .exec(function(err, model) {
                        if (err) {
                            console.log(err);
                        } else {}
                    });
            }



            console.log('发送邮箱验证邮件');
            var local = require("../../../config/local.js");
            var link = local.site + "/activate?activatecode=" + activatecode;
            var content = "您的用户名为:" + username + "\n注册邮箱为:" + email + "\n请点击此注册链接激活:" + link;
            mailer.sendMail(email, content, '注册邮箱激活', function(error, info) {
                if (error) {
                    console.log(error);
                    return next(err);
                } else {
                    Passport.create({
                        protocol: 'local',
                        password: password,
                        user: user.id
                    }).exec(function(err, passport) {
                        return next(err, user);
                    });
                }
            });
        }
    });
};

/**
 * Assign local Passport to user
 *
 * This function can be used to assign a local Passport to a user who doens't
 * have one already. This would be the case if the user registered using a
 * third-party service and therefore never set a password.
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */
exports.connect = function(req, res, next) {
    var user = req.user,
        password = req.param('password');

    Passport.findOne({
        protocol: 'local',
        user: user.id
    }).exec(function(err, passport) {
        if (err) return next(err);

        if (!passport) {
            Passport.create({
                protocol: 'local',
                password: password,
                user: user.id
            }).exec(function(err, passport) {
                next(err, user);
            });
        } else {
            next(null, user);
        }
    });
};

/**
 * Validate a login request
 *
 * Looks up a user using the supplied identifier (email or username) and then
 * attempts to find a local Passport associated with the user. If a Passport is
 * found, its password is checked against the password supplied in the form.
 *
 * @param {Object}   req
 * @param {string}   identifier
 * @param {string}   password
 * @param {Function} next
 */

exports.login = function(req, identifier, password, next) {
    var isEmail = validator.isEmail(identifier),
        query = {};

    if (isEmail) {
        query.email = identifier;
    } else {
        query.username = identifier;
    }

    User.findOne(query).exec(function(err, user) {
        if (err) return next(err);

        if (!user) {
            if (isEmail) {
              req.flash('error', 'Error.Passport.Email.NotFound');
              return next(null, '邮箱不存在');
            } else {
              req.flash('error', 'Error.Passport.Username.NotFound');
              return next(null, '用户名不存在');
            }
        }

        Passport.findOne().where({
            protocol: 'local',
            user: user.id
        }).exec(function(err, passport) {
            if (passport) {
                passport.validatePassword(password, function(err, res) {
                    if (err) return next(err);

                    if (!res) {
                        req.flash('error', 'Error.Passport.Password.Wrong');
                        return next(null, '密码错误');
                    } else {
                        return next(null, user);
                    }
                });
            } else {
                req.flash('error', 'Error.Passport.Password.NotSet');
                return next(null, false);
            }
        });
    });
};



//修改密码
exports.passwd = function(req, res, next) {
    var identifier = req.param('identifier'),
        password = req.param('password'),
        npassword = req.param('npassword');
    var isEmail = validator.isEmail(identifier),
        query = {};

    if (isEmail) {
        query.email = identifier;
    } else {
        query.username = identifier;
    }

    User.findOne(query).exec(function(err, user) {
        if (err) return next(err);

        if (!user) {
            if (isEmail) {
                req.flash('error', 'Error.Passport.Email.NotFound');
            } else {
                req.flash('error', 'Error.Passport.Username.NotFound');
            }

            return next(null, false);
        }

        Passport.findOne().where({
            protocol: 'local',
            user: user.id
        }).exec(function(err, passport) {
            if (passport) {
                passport.validatePassword(password, function(err, res) {
                    if (err) return next(err);

                    if (!res) {
                        req.flash('error', 'Error.Passport.Password.Wrong');
                        return next(null, false);
                    }
                    //密码正确
                    Passport.update({
                            protocol: 'local',
                            user: user.id
                        }, {
                            password: npassword
                        })
                        .exec(function(err, passport) {
                            if (err)
                                return next(err);
                            console.log('发送密码修改提示邮件');
                            var content = "您的用户名为:" + user.username + "\n注册邮箱为:" + user.email + "\n新密码为:" + npassword;
                            mailer.sendMail(user.email, content, '您在CoaSars的密码修改成功', function(error, info) {
                                if (error) {
                                    console.log(error);
                                    return next(true);
                                }
                                console.log(info.response);
                                return next(null, user);
                            });
                        });
                });
            } else {
                req.flash('error', 'Error.Passport.Password.NotSet');
                return next(null, false);
            }
        });
    });
};

///重置密码
exports.reset = function(req, res, next) {

    var email = req.param('email'),
        username = req.param('username');
    console.log('rest psd from protocols/local.js' + email + username);
    if (!email) {
        req.flash('error', 'Error.Passport.Email.Missing');
        console.log('No email was entered');
        return next(new Error('No email was entered.'));
    }

    if (!username) {
        req.flash('error', 'Error.Passport.Username.Missing');
        console.log('No username was entered');
        return next(new Error('No username was entered.'));
    }

    User.count({
        username: username,
        email: email
    }).exec(function(err, count) {
        if (count < 1) {
            req.flash('error', 'Error.Passport.User.Exists');
            console.log('Email not match with username');
            return next("error", null);
        } else if (count == 1) {
            //随机密码：sha1(name+rand int)
            var sha1 = crypto.createHash('sha1');
            sha1.update(username + parseInt(Math.random() * 10000000 + 1));
            var nPass = 'j' + sha1.digest('hex').substring(0, 15) + 'q';
            console.log('here local.js line 283');
            User.findOne({
                username: username,
                email: email
            }).exec(function(err, found) {
                Passport.update({
                        protocol: 'local',
                        user: found.id
                    }, {
                        password: nPass
                    })
                    .exec(function(err, passport) {
                        if (!err) {
                            console.log('发送密码重置邮件');
                            var content = "您的用户名为:" + username + "\n注册邮箱为:" + email + "\n新密码为:" + nPass;
                            mailer.sendMail(email, content, '您在CoaSars的密码已重置', function(error, info) {
                                if (error) {
                                    console.log(error);
                                    return next(true, null);
                                } else {
                                    console.log(info.response);
                                    return next(err, info);
                                }
                            });
                        } else {
                            return next(true, null);
                        }
                    });
            });
        }
    });
};

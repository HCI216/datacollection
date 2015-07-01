/**
 * Authentication Controller
 *
 * This is merely meant as an example of how your Authentication controller
 * should look. It currently includes the minimum amount of functionality for
 * the basics of Passport.js to work.
 */
var AuthController = {
    /**
     * Render the login page
     *
     * The login form itself is just a simple HTML form:
     *
     <form role="form" action="/auth/local" method="post">
     <input type="text" name="identifier" placeholder="Username or Email">
     <input type="password" name="password" placeholder="Password">
     <button type="submit">Sign in</button>
     </form>
     *
     * You could optionally add CSRF-protection as outlined in the documentation:
     * http://sailsjs.org/#!documentation/config.csrf
     *
     * A simple example of automatically listing all available providers in a
     * Handlebars template would look like this:
     *
     {{#each providers}}
     <a href="/auth/{{slug}}" role="button">{{name}}</a>
     {{/each}}
     *
     * @param {Object} req
     * @param {Object} res
     */
    login: function(req, res) {
        var strategies = sails.config.passport,
            providers = {};

        // Get a list of available providers for use in your templates.
        Object.keys(strategies).forEach(function(key) {
            if (key === 'local') return;

            providers[key] = {
                name: strategies[key].name,
                slug: key
            };
        });

        // Render the `auth/login.ext` view
        res.view({
            providers: providers,
            errors: req.flash('error'),
            layout: false
        });
    },

    /**
     * Log out a user and return them to the homepage
     *
     * Passport exposes a logout() function on req (also aliased as logOut()) that
     * can be called from any route handler which needs to terminate a login
     * session. Invoking logout() will remove the req.user property and clear the
     * login session (if any).
     *
     * For more information on logging out users in Passport.js, check out:
     * http://passportjs.org/guide/logout/
     *
     * @param {Object} req
     * @param {Object} res
     */
    logout: function(req, res) {
        req.logout();
        res.redirect('/');
    },

    /**
     * Render the registration page
     *
     * Just like the login form, the registration form is just simple HTML:
     *
     <form role="form" action="/auth/local/register" method="post">
     <input type="text" name="username" placeholder="Username">
     <input type="text" name="email" placeholder="Email">
     <input type="password" name="password" placeholder="Password">
     <button type="submit">Sign up</button>
     </form>
     *
     * @param {Object} req
     * @param {Object} res
     */
    register: function(req, res) {
        res.view({
            errors: req.flash('error'),
            layout: false
        });
    },
    activate: function(req, res) {
        ///验证邮箱
        var activatecode = req.param('activatecode');
        console.log('验证邮箱 from protocols/local.js 验证码为:' + activatecode);
        if (!activatecode) {
            return res.send({
                'Status': '验证失败'
            });
        }

        User.count({
                activatecode: activatecode
            })
            .exec(function(err, count) {
                if (err) {
                    return res.send({
                        'Status': '验证失败'
                    });
                } else if (count == 1) {
                    User.update({
                            activatecode: activatecode
                        }, {
                            activated: 'true'
                        })
                        .exec(function(err, passport) {
                            if (!err) {
                                console.log('邮箱验证成功');
                                return res.send({
                                    'Status': '邮箱验证成功'
                                });
                            } else {
                                return res.send({
                                    'Status': '验证失败'
                                });
                            }
                        });
                }
            });
    },
    /**
     * Create a third-party authentication endpoint
     *
     * @param {Object} req
     * @param {Object} res
     */
    provider: function(req, res) {
        passport.endpoint(req, res);
    },

    /**
     * Create a authentication callback endpoint
     *
     * This endpoint handles everything related to creating and verifying Pass-
     * ports and users, both locally and from third-aprty providers.
     *
     * Passport exposes a login() function on req (also aliased as logIn()) that
     * can be used to establish a login session. When the login operation
     * completes, user will be assigned to req.user.
     *
     * For more information on logging in users in Passport.js, check out:
     * http://passportjs.org/guide/login/
     *
     * @param {Object} req
     * @param {Object} res
     */
    callback: function(req, res) {
        passport.callback(req, res, function(err, user) {
            if (req.path == "/auth/local/register") {
                if (err) {
                    req.addFlash('register', '用户注册失败');
                    res.redirect('/register');
                } else {
                    req.addFlash('login', '用户注册成功，请登录邮箱激活您的账号');
                    res.redirect('/login');
                }
            } else if (req.path == "/auth/local/reset") {
                if (err) {
                    console.log(req.path);
                    req.addFlash('login', '密码重置失败');
                    res.redirect('/login');
                } else {
                    console.log(req.path);
                    req.addFlash('login', '密码重置成功,请查看您的邮箱');
                    res.redirect('/login');
                }
            } else {
                req.login(user, function(err) {
                    // If an error was thrown, redirect the user to the login which should
                    // take care of rendering the error messages.
                    if (err) {
                        req.addFlash('login', '用户登录失败'+user);
                        res.redirect('/login');
                    }
                    // Upon successful login, send the user to the homepage were req.user
                    // will available.
                    else {
                        console.log('currently logged in user is: ' + req.user.username);
                        res.redirect('/home');
                    }
                });
            }
        });
    }
};

module.exports = AuthController;

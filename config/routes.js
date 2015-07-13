/**
 * Routes
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on routes, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.routes = {

  // Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, etc. depending on your
  // default view engine) your home page.
  //
  // (Alternatively, remove this and add an `index.html` file in your `assets` directory)

  //single page
  'get /': {
    controller: 'HomeController',
    action: 'index'
  },

  'get /login': 'AuthController.login',
  'get /logout': 'AuthController.logout',
  'get /register': 'AuthController.register',
  'get /activate': 'AuthController.activate',
  'post /auth/local': 'AuthController.callback',
  'post /auth/local/:action': 'AuthController.callback',


  ///数据集信息api
  //读取数据集
  'get /api/datasets': 'DatasetsInfoController.getPage',
  'get /api/datasetscount': 'DatasetsInfoController.getPageCount',
  'get /api/datasets/:id': 'DatasetsInfoController.getOne',
  'post /api/newdataset':'DatasetsInfoController.newdataset',
  'get /datasetsdownload':'DatasetsInfoController.download',
  'post /api/datasets': 'DatasetsInfoController.create',
  'post /api/destroydataset': 'DatasetsInfoController.destroy',
  ///算法信息api


  /*
   * Datasets routes
   */
  'post /api/datasets/upload' : 'DatasetsInfoController.upload',

  //dataset route
  'post /api/dataset/celledit' : 'DatasetsController.cellEdit',
  'post /api/dataset/newcolumn' : 'DatasetsController.newcolumn',
  'post /api/dataset/deletecolumn' : 'DatasetsController.deletecolumn',
  'post /api/dataset/newrow' : 'DatasetsController.newrow',
  'post /api/dataset/deleterow' : 'DatasetsController.deleterow',

  /*
   * file upload
   */
  'post /api/file/upload' : 'FileController.upload',
  'post /api/jqfile/upload' : 'JqFileController.upload',
  // If a request to a URL doesn't match any of the custom routes above, it is matched
  // against Sails route blueprints.  See `config/blueprints.js` for configuration options
  // and examples.

  'get /home': 'HomeController.index',
  'get /datasets': 'HomeController.index',
  'get /dataset/:datasetId': 'HomeController.index'
};

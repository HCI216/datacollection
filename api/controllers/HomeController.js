module.exports = {
    index: function(req, res) {
      if (req.isAuthenticated()) {
        res.view({
          title: 'Home',
          currentUser: req.user
        });
      } else {
        res.redirect('/login');
      }
    }
};

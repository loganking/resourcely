var routeAuthorization = {};

// Checks if the logged in user is an admin
routeAuthorization.isUserAdmin = function(req, res, next){
  if (req.session.currentUser && req.session.currentUser.id == 1) {
    next();
  } else {
    req.flash('danger', 'You don\'t have access to edit that user.');
    res.redirect('/users');
  }
}

// Checks if the logged in user is either an admin or the user whose id is in the route params
routeAuthorization.isUserRequestedUser = function(req, res, next){
  if (req.session.currentUser && ( req.session.currentUser.id == 1 || req.session.currentUser.id == req.params.id )) {
    next();
  } else {
    req.flash('danger', 'You don\'t have access to edit that user.');
    res.redirect('/users');
  }
}

module.exports = routeAuthorization;

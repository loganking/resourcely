var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var knex = require('../db/knex');
var User = require('../models/user');
var auth = require('./route_authorization');
console.log(User);

router.use(function(req, res, next) {
  res.locals.baseUrl = req.baseUrl;
  next();
});

router.get('/', function(req, res, next) {
  knex('users').select().then(function(users){
    res.render('../views/users/index', {users: users});
  });
});

router.get('/new', function(req, res, next) {
  res.render('../views/users/edit');
});

router.post('/new', function(req, res, next) {
  User.validate(req.body, 'newUser').then(function(validated){
    bcrypt.hash(validated.password, 10, function(err, hash){
      knex('users').insert({name:validated.name, email:validated.email, password:hash}).then(function(users){
        req.flash('success', 'User was successfully created');
        res.redirect('/users');
      });
    });
  }).catch(function(err){
    console.log(err);
    res.render('../views/users/edit', {data: req.body, errors: err.errors});
  });
});

router.get('/login', function(req, res, next) {
  if (typeof(req.session.currentUser) !== 'undefined') {
    req.flash('warning', 'You\'re already signed in!');
    res.redirect('/');
  } else {
    res.render('../views/users/login');
  }
});

router.post('/login', function(req, res, next) {
  User.validate(req.body, 'loginUser').then(function(value){
    knex('users').select().where('email', value.email).first().then(function(user){
      bcrypt.compare(value.password, user.password, function(err, isSame){
        if (err || !isSame) {
          res.render('../views/users/login', {data: req.body, errors: {not_found: ['User / password not found in database.']}});
        } else {
          req.session.currentUser = {id: user.id, name: user.name};
          res.redirect('/');
        }
      });
    });
  }).catch(function(err){
    console.log(err);
    res.render('../views/users/login', {data: req.body, errors: err.errors});
  });
});

router.get('/logout', function(req, res, next) {
  req.session = null;
  res.redirect('/');
});

router.get('/:id', function(req, res, next) {
  knex('users').select().where('id', req.params.id).first().then(function(user){
    res.send(user);
  });
});

console.log(auth);
router.get('/:id/edit', auth.isUserRequestedUser, function(req, res, next) {

  console.log(req.params.id);
  console.log(req.session.currentUser);

  knex('users').select().where('id', req.params.id).first().then(function(user){
    delete user.password;
    res.render('../views/users/edit', {data: user});
  });
});

router.post('/:id/edit', function(req, res, next) {
  // @todo: handle edit form input
  res.send('handle edit form input');
  //res.redirect('/users');
});

router.get('/:id/delete', function(req, res, next) {
  knex('users').del().where('id', req.params.id).then(function(rows_deleted){
    res.redirect('/users');
  });
});

module.exports = router;

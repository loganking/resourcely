var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

//lists cookies
router.get('/', function(req, res, next) {
  knex('cookies').select().then(function(cookies){
    res.render('../views/cookies', {cookies:cookies});
  });
});

router.post('/', function(req, res, next) {
  // @todo need to add validations
  knex('cookies').insert({
    name:req.body.name,
    ingredients:req.body.ingredients
  }).then(function(data){
    res.redirect('/cookies');
  });

});

module.exports = router;

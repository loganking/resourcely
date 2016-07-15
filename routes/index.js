var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  // @todo import resources?
  res.render('../views/resources/index', {resources:{}});
});

module.exports = router;

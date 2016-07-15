var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var Resource = require('../models/resource');

router.use(function(req, res, next) {
  res.locals.baseUrl = req.baseUrl;
  next();
});

router.get('/', function(req, res, next) {
  // @todo add tag filtering
  if (req.query.tags) {
  }
  knex('resources').select('resources.*', 'tags.name as tag_name').leftJoin('tags', 'resources.id', 'tags.resource_id').then(function(resources){
    console.log(resources);
    resources = resources.reduce(function(prev, cur, all){
      var i = 0,
        match = false;
      while (i<prev.length) {
        if (prev[i].id === cur.id) {
          prev[i].tags.unshift(cur.tag_name);
          match = true;
        }
        i++;
      }
      if (!match) {
        cur.tags = [cur.tag_name];
        delete cur.tag_name;
        prev.push(cur);
      }
      return prev;
    }, []);
    res.render('../views/resources/index', {resources: resources});
  });
});


router.get('/new', function(req, res, next) {
  res.render('../views/resources/new');
});

router.post('/', function(req, res, next) {
  Resource.validate(req.body, 'newResource').then(function(values){
    console.log(values);
    knex('resources').insert({name:values.name, url:values.url, description:values.description, user_id:req.signedCookies.currentUser.id}).returning('id')
    .catch(function(error){
      console.log(error);
    }).then(function(ids){
      var tagsInsert = [];
      values.tags.split(',').forEach(function(tag){
        tagsInsert.push(knex('tags').insert({resource_id:ids[0], name:tag.trim()}));
      });
      return Promise.all(tagsInsert);
    }).then(function(){
      req.flash('success', 'Resource was successfully created');
      res.redirect('/resources');
    });
  }).catch(function(err){
    console.log(err);
    res.render('../views/resources/new', {data: req.body, errors: err.errors});
  });
});

router.get('/:id', function(req, res, next) {
  knex('resources').select().where('id', req.params.id).first().then(function(resource){
    res.send(resource);
  });
});

router.get('/:id/edit', function(req, res, next) {
    knex('resources').select('resources.id as resource_id', 'resources.name as resource_name', 'resources.url as resource_url', 'resources.description as resource_description', 'tags.id as tag_id', 'tags.name as tag_name')
    .innerJoin('tags', 'resources.id', 'tags.resource_id').where('resources.id', req.params.id)
    .then(function(data){
      console.log(data);
      var resource = Resource.mapData(data, 'resource', 'tag');
      resource.tags = resource.tag.reduce(function(prev, cur){
        if (prev.length > 0) prev += ', ';
        return prev + cur.name;
      }, '');
      console.log(resource);
      res.render('../views/resources/edit', {data: resource});
    })
    .catch(function(err){
      console.error(err);
      res.send('error');
    });
// }
});

router.put('/:id', function(req, res, next) {
  // @todo: handle edit form input
  res.send('handle edit form input');
  //res.redirect('/resources');
});

router.get('/:id/delete', function(req, res, next) {
  knex('resources').del().where('id', req.params.id).then(function(rows_deleted){
    res.redirect('/resources');
  });
});

module.exports = router;

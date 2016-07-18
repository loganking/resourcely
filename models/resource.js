var Resource = require('./model');
var Checkit = require('checkit');

Resource.rules = {
  newResource: Checkit({
    id: {
      rule: 'integer',
      message: 'Id must be an integer.'
    },
    name: [
      {
        rule: 'required',
        message: 'Oooy. Looks like you forgot a name for the resource. What do you want to call it?'
      }, {
        rule: 'alpha',
        message: 'Name can only have alphabetical characters.'
      }, {
        rule: 'maxLength:255',
        message: 'Name cannot be longer than 255 characters.'
      }
    ],
    url: [
      {
        rule: 'required',
        message: 'URL is required.'
      }, {
        rule: 'maxLength:255',
        message: 'URL cannot be longer than 255 characters.'
      }, {
        rule: 'url',
        message: 'URL must be a valid URL.'
      }
    ],
    description: {
      rule: 'string',
      message: 'Description must be a string.'
    },
    tags: {
      rule: function(value){
        var match = /^[\w]+(, [\w]+){0,}$/.test(value);
        if (!match) throw new Error('Must be a comma separated list of words.');
      }
    },
    created: {
      rule: 'empty',
      message: 'Created is not allowed.'
    },
    modified: {
      rule: 'empty',
      message: 'Modified is not allowed.'
    }
  })
}

module.exports = Resource;

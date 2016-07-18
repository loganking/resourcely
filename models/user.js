var knex = require('../db/knex');
var Checkit = require('checkit');
var rules = {
  newUser: Checkit({
    id: {
      rule: 'integer',
      message: 'Id must be an integer.'
    },
    name: [
      {
        rule: 'required',
        message: 'Name is required.'
      }, {
        rule: 'alpha',
        message: 'Name can only have alphabetical characters.'
      }, {
        rule: 'maxLength:255',
        message: 'Name cannot be longer than 255 characters.'
      }
    ],
    email: [
      {
        rule: 'required',
        message: 'Email is required.'
      }, {
        rule: 'email',
        message: 'Email must be a valid email address.'
      }, {
        rule: 'maxLength:255',
        message: 'Email cannot be longer than 255 characters.'
      }, {
        rule: function(val){
          return knex('users').where('email', '=', val).then(function(resp) {
            if (resp.length > 0) throw new Error('The email address is already in use.')
          })
        },
        message: ''
      }
    ],
    password: [
      {
        rule: 'required',
        message: 'Password is required.'
      }, {
        rule: 'maxLength:255',
        message: 'Password cannot be longer than 255 characters.'
      }
    ],
    password2: [
      {
        rule: 'required',
        message: 'Password is required.'
      }, {
        rule: 'maxLength:255',
        message: 'Password cannot be longer than 255 characters.'
      }, {
        rule: 'matchesField:password',
        message: 'Passwords must match.'
      }
    ],
    created: {
      rule: 'empty',
      message: 'Created is not allowed.'
    },
    modified: {
      rule: 'empty',
      message: 'Modified is not allowed.'
    }
  }),
  loginUser: Checkit({
    email: [
      {
        rule: 'required',
        message: 'Email is required.'
      }, {
        rule: 'email',
        message: 'Email must be a valid email address.'
      }, {
        rule: 'maxLength:255',
        message: 'Email cannot be longer than 255 characters.'
      }
    ],
    password: [
      {
        rule: 'required',
        message: 'Password is required.'
      }, {
        rule: 'maxLength:255',
        message: 'Password cannot be longer than 255 characters.'
      }
    ],
  })
};

var validate = function(data, ruleset) {
  return rules[ruleset].run(data);
}

var mapData = function(data, primary, secondary) {
  if (!data.length || data.length === 1) return data;
  var mappedData = {};
  data.forEach(function(record, i){
    for (field in record) {
      if (field.substr(0, primary.length) === primary) {
        mappedData[field.substr(primary.length+1)] = record[field];
      } else if (field.substr(0, secondary.length) === secondary) {
        if (!mappedData[secondary]) mappedData[secondary] = [];
        if (!mappedData[secondary][i]) mappedData[secondary][i] = {};
        mappedData[secondary][i][field.substr(secondary.length+1)] = record[field];
      }
    }
  });
  return mappedData;
}

module.exports = {
  validate: validate,
  mapData: mapData
}

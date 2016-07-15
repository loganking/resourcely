var Joi = require('joi');
var schemas = {
  newUser: Joi.object().keys({
    id: Joi.number().integer(),
    name: Joi.string().trim().max(255),
    email: Joi.string().trim().email().max(255),
    password: Joi.string().trim(),
    password2: Joi.ref('password'),
    created: Joi.any().forbidden(),
    modified: Joi.any().forbidden()
  }),
  loginUser: Joi.object().keys({
    email: Joi.string().trim().email().max(255),
    password: Joi.string().trim()
  })
}

var messages = {
  id: {
    'number.integer': 'Id must be an integer.'
  },
  name: {
    'any.empty': 'Name is required.',
    'string.max': 'Name cannot be longer than 255 characters.'
  },
  email: {
    'any.empty': 'Email is required.',
    'string.email': 'Email must be a valid email address.',
    'string.max': 'Email cannot be longer than 255 characters.'
  },
  password: {
    'any.empty': 'Password is required.',
  },
  password2: {
    'any.allowOnly': 'Passwords must match.',
  },
};

var validate = function(data, schemaName, callback){
  if (Object.keys(schemas).indexOf(schemaName) === -1) {
    throw schemaName + ' is not a valid schema.';
  }
  Joi.validate(data, schemas[schemaName], {
    abortEarly: false
  }, function(err, value){
    if (err){
      var errors = {
        raw: err,
        pretty: {}
      };
      for (i in err.details){
        console.log(err.details[i]);
        if (messages.hasOwnProperty(err.details[i].path) && messages[err.details[i].path].hasOwnProperty(err.details[i].type)){
          if (typeof errors.pretty[err.details[i].path] === 'undefined') errors.pretty[err.details[i].path] = [];
          errors.pretty[err.details[i].path].push(messages[err.details[i].path][err.details[i].type]);
        }
      }
      callback(errors, value);
    } else {
      callback(null, value);
    }
  });
}

module.exports = {
  validate: validate
}

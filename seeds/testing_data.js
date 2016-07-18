exports.seed = function(knex, Promise) {
  return Promise.join(

    // Deletes ALL existing entries
    knex('tags').del(),
    knex('resources').del(),
    knex('users').del()

    // Inserts seed entries in order to respect foreign key contstraints
  ).then(function(){
    return Promise.join(
      knex('users').insert({id: 1, name: 'admin', email: 'admin@email.com', password: '$2a$10$R3jvYGf5ZdiBVXrf5LxuDOuN.ifJI0IILfA3PQrLA2QCsD8msqQPO'}), // password is "password"
      knex('users').insert({id: 2, name: 'John Smith', email: 'john@thesmiths.com', password: '$2a$10$R3jvYGf5ZdiBVXrf5LxuDOuN.ifJI0IILfA3PQrLA2QCsD8msqQPO'}) // password is "password"
    );
  }).then(function(){
    return Promise.join(
      knex('resources').insert({id:1, name: 'CSS Tricks', url: 'http://css-tricks.com', user_id: 2}),
      knex('resources').insert({id:2, name: 'CSS Zengarden', url: 'http://csszengarden.com', user_id: 2})
    );
  }).then(function(){
    return knex('tags').insert({id: 1, name: 'CSS', resource_id: 1})
  }).then(function(){
    return knex('tags').insert({id: 2, name: 'Blog', resource_id: 1})
  }).then(function(){
    return knex('tags').insert({id: 3, name: 'CSS', resource_id: 2})
  }).then(function(){
    return knex('tags').insert({id: 4, name: 'Examples', resource_id: 2})
  }).then(function(){
    return Promise.join(
      // update id sequences to account for inserts
      knex.raw("SELECT pg_get_serial_sequence('users', 'id')").then(function(seq){
        return knex.raw('ALTER SEQUENCE ' + seq.rows[0].pg_get_serial_sequence + ' RESTART WITH 3');
      }),
      knex.raw("SELECT pg_get_serial_sequence('resources', 'id')").then(function(seq){
        return knex.raw('ALTER SEQUENCE ' + seq.rows[0].pg_get_serial_sequence + ' RESTART WITH 3');
      }),
      knex.raw("SELECT pg_get_serial_sequence('tags', 'id')").then(function(seq){
        return knex.raw('ALTER SEQUENCE ' + seq.rows[0].pg_get_serial_sequence + ' RESTART WITH 5');
      })
    );
  })
};

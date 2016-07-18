exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table){
    table.increments();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('modified_at').defaultTo(knex.fn.now());
  }).then(function(){
    return knex.schema.table('resources', function(table){
      table.integer('user_id').unsigned().notNullable().references('users.id');
    });
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('resources', function(table){
    table.dropColumn('user_id');
  }).then(function(){
    return knex.schema.dropTable('users');
  });
};

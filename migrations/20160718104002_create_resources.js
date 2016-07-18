exports.up = function(knex, Promise) {
  return knex.schema.createTable('resources', function(table){
    table.increments();
    table.string('name').notNullable();
    table.text('description');
    table.string('url').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('modified_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('resources');
};

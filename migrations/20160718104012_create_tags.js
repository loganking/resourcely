exports.up = function(knex, Promise) {
  return knex.schema.createTable('tags', function(table){
    table.increments();
    table.integer('resource_id').unsigned().notNullable().references('resources.id');
    table.string('name').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('modified_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('tags');
};

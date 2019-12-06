exports.up = function(knex) {
  return knex.schema.createTable('users', (tbl) => {
    tbl.increments();
    tbl.string('user_name', 128).notNullable();
    tbl.string('password').notNullable();
    tbl.string('favorite_color').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};


exports.up = function(knex) {
    return knex.schema.createTable('wishes', table => {
        table.increments('id');
        table.string('wish').notNullable();
        table.integer('auth_id');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('wishes');
};

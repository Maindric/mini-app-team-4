
exports.up = function(knex) {
    return knex.schema.createTable('authors', table => {
        table.increments('id');
        table.string('name');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('authors');
};

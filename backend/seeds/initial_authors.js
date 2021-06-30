exports.seed = function(knex) {
    return knex('authors').del()
        .then(function () {
            return knex('authors').insert([
                {name: 'Anon'}
            ]);
        });
};
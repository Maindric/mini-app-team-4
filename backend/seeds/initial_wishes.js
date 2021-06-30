exports.seed = function(knex) {
    return knex('wishes').del()
        .then(function () {
            return knex('wishes').insert([
                {wish: 'The ability to speak does not make you intelligent', auth_id: 1}
            ]);
        });
};
const express = require('express')
const _ = require('lodash');
const app = express()
const port = 3005
const knex = require('knex')(require('./knexfile.js')['development']);

app.use(express.json());

app.get('/wishes', function(req, res) {
    const author = req.query.author ? _.startCase(_.toLower(req.query.author)): "%";
    console.log("Searching for:", author);
    knex.select('*')
        .from('wishes')
        .innerJoin("authors", "wishes.auth_id", "authors.id")
        .whereRaw( `authors.name LIKE '${author}'`)
        .then(data => res.status(200).json(data))
        .catch(err =>
            res.status(404).json({
                message: 'No wishes for you!'
            }))
})

app.get('/authors', function(req, res) {
    knex.select('*')
        .from('authors')
        .then(data => res.status(200).json(data))
        .catch(err =>
            res.status(404).json({
                message: 'No well wishing authors found!'
            }))
})

app.get('/randomwish', function(req, res) {
    knex.select('*')
        .from('wishes')
        .innerJoin("authors", "wishes.auth_id", "authors.id")
        .orderByRaw('RANDOM()')
        .limit(1)
        .then(data => res.status(200).json(data))
        .catch(err =>
            res.status(404).json({
                message: 'The wish denied you!'
            }))
})

app.post('/wish', function(req, res){

    let auth_id = 0;
    let author = _.startCase(_.toLower(req.body.author));
    knex.select('*')
        .from('authors')
        .where({name: author})
        .then(data => {
            if(data.length > 0){
                auth_id = Number(data[0].id);
                console.log("Author Found at ID:", auth_id)
                knex('wishes').insert({wish: req.body.wish, auth_id: auth_id}).then(() => res.status(201).send("Wish sent with existing Author."));
            } else {
                console.log("New Author!");
                knex('authors').insert({name: author})
                               .returning('id')
                               .then(id => {
                                   auth_id = Number(id)
                                   console.log("New Author ID:", auth_id)
                                   knex('wishes').insert({wish: req.body.wish, auth_id: auth_id}).then(() => res.status(201).send("Wish sent with new Author."))
                               });
            }
        })
})








app.listen(port, () => console.log(`WishChan listening at http://localhost:${port}`))
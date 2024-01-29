const express = require('express');
let { MongoClient, ObjectId } = require('mongodb');

const client = new MongoClient('mongodb://127.0.0.1:27017');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());


async function connectMongo() {

    try {
        await client.connect()
        .then((client) => app.locals.db = client.db('series'))
        await client.db("admin").command({ ping: 1 })
        console.log("🟢 MongoDB está conectado")
    } catch (error) {
        console.error("🔴 MongoDB no conectado:", error)
    
    }

}

connectMongo();

app.get('/api/series', async (request, response) => {

    try {
        const results = await app.locals.db.collection('lista_series').find().toArray();
        response.send({
            mensaje: 'Series encontradas: ' + results.length,
            results
        });
    } catch (error) {
        response.status(500).send({
            mensaje: 'Error al hacer la consulta',
            error
        });
    }

});

app.get('/api/serie', async (request, response) => {

    try {
        let serie  = request.query.tituloSerie;
        const results = await app.locals.db.collection('lista_series').find({titulo:serie}).toArray();
        response.send(`
            <p>Titulo: ${results[0].titulo}</p>
            <p>Plataforma: ${results[0].plataforma}</p>
            <p>Nota: ${results[0].nota}</p>
        `);
    } catch (error) {
        response.status(500).send({
            mensaje: 'Error al hacer la consulta',
            error
        });
    }

});

app.post('/api/nuevaSerie', async (request, response) => {

    try {
        let { titulo, plataforma, nota }  = request.body;

        const results = await app.locals.db.collection('lista_series').insertOne({
            titulo,
            plataforma,
            nota
        });
        response.send({
            mensaje: 'Serie insertada: ' + titulo,
            results
        });
    } catch (error) {
        response.status(500).send({
            mensaje: 'Error al hacer la consulta',
            error
        });
    }

});

app.listen(process.env.PORT || 3000, (e) =>{
    e
    ? console.log(`Error en servidor: ${e}`)
    : console.log("Servidor andando!");
});
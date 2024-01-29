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
        .then((client) => app.locals.db = client.db('menus'))
        await client.db("admin").command({ ping: 1 })
        console.log("🟢 MongoDB está conectado")
    } catch (error) {
        console.error("🔴 MongoDB no conectado:", error)
    
    }

}

connectMongo();

app.get('/api/menus', async (request, response) => {

    try {
        const results = await app.locals.db.collection('lista_menus').find().toArray();
        response.send({
            mensaje: 'Menus encontrados: ' + results.length,
            results
        });
    } catch (error) {
        response.status(500).send({
            mensaje: 'Error al hacer la consulta',
            error
        });
    }

});

app.post('/api/nuevoMenu', async (request, response) => {

    try {
        let {numero, entrada , principal, postre, precio} =  request.body;
        const results = await app.locals.db.collection('lista_menus').insertOne({
            numero, 
            entrada, 
            principal, 
            postre, 
            precio
        });
        response.status(200).send({
            mensaje: 'Menus agregados: ' + results.insertedId,
            results
        });
    } catch (error) {
        response.status(500).send({
            mensaje: 'Error al agregar menu',
            error
        });
    }

});

app.put('/api/editarMenu', async (request, response) => {

    try {
        let {numero, entrada , principal, postre, precio} =  request.body;
        const results = await app.locals.db.collection('lista_menus').updateOne({
            numero:numero
            },
            {$set: {entrada:entrada}}, 
            {$set: {principal:principal}}, 
            {$set: {postre:postre}}, 
            {$set: {precio:precio}}
            );
        response.status(200).send({
            mensaje: 'Menus editados: ' + numero,
            results
        });
    } catch (error) {
        response.status(500).send({
            mensaje: 'Error al agregar menu',
            error
        });
    }

});

app.delete('/api/borrarMenu', async (request, response) => {

    try {
        let {numero} =  request.body;
        const results = await app.locals.db.collection('lista_menus').deleteOne({numero:numero});
        response.status(200).send({
            mensaje: 'Menu borrado: ' + numero,
            results
        });
    } catch (error) {
        response.status(500).send({
            mensaje: 'El menu no existe',
            error
        });
    }

});


app.listen(process.env.PORT || 3000, (e) =>{
    e
    ? console.log(`Error en servidor: ${e}`)
    : console.log("Servidor andando!");
});
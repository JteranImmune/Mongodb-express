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
        .then((client) => app.locals.db = client.db('mesas'))
        await client.db("admin").command({ ping: 1 })
        console.log("🟢 MongoDB está conectado")
    } catch (error) {
        console.error("🔴 MongoDB no conectado:", error)
    
    }

}

connectMongo();

app.get('/api/mesas', async (request, response) => {

    try {
        const results = await app.locals.db.collection('tienda_mesas').find().toArray();
        response.send({
            mensaje: 'Mesas encontradas: ' + results.length,
            results
        });
    } catch (error) {
        response.status(500).send({
            mensaje: 'Error al hacer la consulta',
            error
        });
    }

});

app.post('/api/anyadir', async (request, response) => {
    
    try {
        let {tamano, color, material, patas} = request.body;
        const results = await app.locals.db.collection('tienda_mesas').insertOne({tamano, color, material, patas});
        response.send({
            mensaje: 'Mesas añadida: ' + results.insertedId,
            results
        });
    } catch (error) {
        response.status(500).send({
            mensaje: 'Error al añadir',
            error
        });
    }

});

app.put('/api/modificar/:color', async (request, response) => {
    
    try {
        let color = request.params.color;
        const results = await app.locals.db.collection('tienda_mesas').updateOne(
            {color: color},
            {$set: {color:'granate'}}
        );

        response.send({
            mensaje: 'Mesas modificadas: ' + results.modifiedCount,
            results
        });
    } catch (error) {
        response.status(500).send({
            mensaje: 'Error al modificar',
            error
        });
    }

});

app.delete('/api/borrar/:patas', async (request, response) => {
    
    try {
        let patas = parseInt(request.params.patas);

        const results = await app.locals.db.collection('tienda_mesas').deleteMany(
            {patas: patas}
        );

        response.send({
            mensaje: 'Mesas modificadas: ' + results.deletedCount,
            results
        });
    } catch (error) {
        response.status(500).send({
            mensaje: 'Error al modificar',
            error
        });
    }

});


app.listen(process.env.PORT || 3000, (e) =>{
    e
    ? console.log(`Error en servidor: ${e}`)
    : console.log("Servidor andando!");
});
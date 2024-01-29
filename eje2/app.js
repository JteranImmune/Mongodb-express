
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
        .then((client) => app.locals.db = client.db('libros'))
        await client.db("admin").command({ ping: 1 })
        console.log("🟢 MongoDB está conectado")
    } catch (error) {
        console.error("🔴 MongoDB no conectado:", error)
    
    }

}

connectMongo();

app.get('/api/libros', async (request, response) => {

    try {
        const results = await app.locals.db.collection('lista_libros').find().toArray();
        response.send({
            mensaje: 'Libros encontrados: ' + results.length,
            results
        });
    } catch (error) {
        response.status(500).send({
            mensaje: 'Error al hacer la consulta',
            error
        });
    }

});

app.get('/api/libros/:libro', async (request, response) => {

    try {
        let libro  = request.params.libro;
        const results = await app.locals.db.collection('lista_libros').find({titulo:libro}).toArray();
        response.send({
            mensaje: 'Libro encontrado: ' + results.length,
            results
        });
    } catch (error) {
        response.status(500).send({
            mensaje: 'Error al hacer la consulta',
            error
        });
    }

});

app.post('/api/nuevoLibro/:titulo', async (request, response) => {

    try {
        let titulo  = request.params.titulo;
        const results = await app.locals.db.collection('lista_libros').insertOne(
            {
                titulo,
                estado:'sin leer'
            });
        response.send({
            mensaje: 'Libro insertado: ' + titulo,
            results
        });
    } catch (error) {
        response.status(500).send({
            mensaje: 'Error al hacer la consulta',
            error
        });
    }

});

app.put('/api/editarLibro/:titulo', async (request, response) => {
    
    try {
        let titulo = request.params.titulo;
        const results = await app.locals.db.collection('lista_libros').updateOne(
            {titulo: titulo},
            {$set: {estado:'leído'}}
        );

        response.send({
            mensaje: 'Libros modificados: ' + results.modifiedCount,
            results
        });
    } catch (error) {
        response.status(500).send({
            mensaje: 'Error al modificar',
            error
        });
    }

});

app.delete('/api/eliminarLibro/:titulo', async (request, response) => {
    
    try {
        let titulo = request.params.titulo;
        const results = await app.locals.db.collection('lista_libros').deleteOne({titulo: titulo});
        response.send({
            mensaje: 'Libros modificados: ' + results.deletedCount,
            results
        });
    } catch (error) {
        response.status(500).send({
            mensaje: 'Error al eliminar',
            error
        });
    }

});

app.delete('/api/borrarLibro', async (request, response) => {
    
    try {
        const results = await app.locals.db.collection('lista_libros').deleteOne({_id:new ObjectId(request.body._id)});
        response.status(200).send({
            mensaje: 'Libro eliminado',
            results
        });
    } catch (error) {
        response.status(500).send({
            mensaje: 'Error al borrar',
            error
        });
    }

});

app.put('/api/editarLibro', async (request, response) => {
    
    try {
        const results = await app.locals.db.collection('lista_libros').updateOne(
            {_id:new ObjectId(request.body._id)},
            {$set: {estado:'leído'}}
        );

        response.send({
            mensaje: 'Libros modificados: ' + results.modifiedCount,
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
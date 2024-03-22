const express = require("express");
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "client", "index.html"));
});

const url = 'mongodb://localhost:27017';

const dbName = 'paises_db';
const collectionName = 'paises';

async function conectarDB(client) {
    try {
        await client.connect();
        const db = client.db(dbName);
        return db.collection(collectionName);
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
        throw error;
    }
}

app.get('/buscar-paises', async (req, res) => {
    const client = new MongoClient(url);

    try {
        const collection = await conectarDB(client);
        const paises = await collection.find({}).toArray();
        res.json(paises);
    } catch (error) {
        console.error('Error al buscar los países:', error);
        res.status(500).json({ error: 'Error al buscar los países' });
    } finally {
        client.close();
    }
});


// Endpoint para guardar datos en la base de datos
app.post('/cargar-paises', (req, res) => {
    const data = req.body;
    try {
        insertarDatos(data);
    } catch (err) {
        console.error(err);
    }

});

async function insertarDatos(datos) {
    const client = new MongoClient(url);

    const collection = conectarDB(client);
    try {
        await collection.insertMany(datos);

        console.log('documentos insertados correctamente.');

    } catch (error) {
        console.error('Error al insertar datos:', error);
    } finally {
        // Cerrar la conexión
        await client.close();
    }
}

app.get('/buscar-por-nombre', async (req, res) => {
    const nombre = req.query.nombre;
    try {
        const pais = await buscarPorNombre(nombre);

        res.json(pais);
    } catch (error) {
        console.error(err);
    }
});

async function buscarPorNombre(nombre) {
    const client = new MongoClient(url);

    try {
        const collection = await conectarDB(client);
        let pais = await collection.findOne({ nombre: nombre });
        return pais;
    } catch (error) {
        console.error('Error al buscar datos:', error);
    } finally {
        await client.close();
    }
}

app.get('/buscar-por-region', async (req, res) => {
    const region = req.query.region;
    try {
        const paises = await buscarPorRegion(region);
        res.json(paises);

    } catch (error) {
        console.error(error);
    }
});

async function buscarPorRegion(region) {
    const client = new MongoClient(url);

    try {
        const collection = await conectarDB(client);
        const paises = await collection.find({ region: region }).toArray();
        console.log(region);
        return paises;
    } catch (error) {
        console.error('Error al insertar datos:', error);
    } finally {
        // Cerrar la conexión
        await client.close();
    }
}

app.get('/buscar-por-poblacionMin', async (req, res) => {
    const poblacionMin = req.query.poblacionMin;

    try {
        const paises = await buscarPorPoblacionMin(poblacionMin);
        res.json(paises);
    } catch (error) {
        console.error(err);
    }
});

async function buscarPorPoblacionMin(poblacion) {
    const client = new MongoClient(url);

    try {
        const collection = await conectarDB(client);
        const paises = await collection.find({ poblacion: { $gt: poblacion } }).toArray();
        return paises;
    } catch (error) {
        console.error('Error al insertar datos:', error);
    } finally {
        // Cerrar la conexión
        await client.close();
    }
}

app.get('/buscar-por-poblacionMax', async (req, res) => {
    const poblacionMax = req.query.poblacionMax;

    try {
        const paises = await buscarPorPoblacionMax(poblacionMax);
        res.json(paises);
    } catch (error) {
        console.error(err);
    }
});

async function buscarPorPoblacionMax(poblacion) {
    const client = new MongoClient(url);

    try {
        const collection = await conectarDB(client);
        const paises = await collection.find({ poblacion: { $lt: poblacion } }).toArray();
        return paises;
    } catch (error) {
        console.error('Error al insertar datos:', error);
    } finally {
        // Cerrar la conexión
        await client.close();
    }
}

app.get('/buscar-por-poblacionBetween', async (req, res) => {
    const poblacionMin = req.query.poblacionMin;
    const poblacionMax = req.query.poblacionMax;

    try {
        const paises = await buscarPorPoblacionBetween(poblacionMin, poblacionMax);
        res.json(paises);
    } catch (error) {
        console.error(err);
    }
});

async function buscarPorPoblacionBetween(poblacionMin, poblacionMax) {
    const client = new MongoClient(url);

    try {
        const collection = await conectarDB(client);
        const paises = await collection.find({ poblacion: { $gt: poblacionMin, $lt: poblacionMax } }).toArray();
        return paises;
    } catch (error) {
        console.error('Error al insertar datos:', error);
    } finally {
        // Cerrar la conexión
        await client.close();
    }
}

app.get('/buscar-por-poblacionYRegion', async (req, res) => {
    const poblacionMin = req.query.poblacionYRegion.poblacionMin;
    const region = req.query.poblacionYRegion;
    console.log(poblacionMin)
    console.log(region)
    try {
        const paises = await buscarPorPoblacionMinYRegion(poblacionMin, region);
        res.json(paises);
    } catch (error) {
        console.error(error);
    }
});


async function buscarPorPoblacionMinYRegion(poblacionMin, region) {
    const client = new MongoClient(url);

    try {
        const collection = await conectarDB(client);
        const paises = await collection.find({ poblacion: { $gt: poblacionMin }, region: region }).toArray();
        return paises;
    } catch (error) {
        console.error('Error al insertar datos:', error);
    } finally {
        // Cerrar la conexión
        await client.close();
    }
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`El servidor ahora se está ejecutando en el puerto ${PORT}`);
});

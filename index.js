const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 4200;

//middlewares
app.use(cors());
app.use(express.json());

// connect with MongoDB

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vqm0pbr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const productCollection = client.db("emaJohn").collection("products");

        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            // console.log(page, size);
            const query = {}
            const cursor = productCollection.find(query);
            const products = await cursor.skip(page * size).limit(size).toArray();
            //work for pagination
            const count = await productCollection.estimatedDocumentCount();
            res.send({ count, products });

        });

        //get cart items
        app.post('/productsByIds', async (req, res) => {
            const ids = req.body;
            const objectIds = ids.map(id => ObjectId(id))
            const query = { _id: { $in: objectIds } };
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })

    }
    finally { }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Amazon Server is running');
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
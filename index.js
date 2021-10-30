//Imports
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 5000;

//Middleware use
app.use(cors());
app.use(express.json());

//MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yuk1u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("delivery_service");
        const servicesCollection = database.collection("services");
        const ordersCollection = database.collection("orders");

        //GET API to get services
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.json(services)
        })

        //GET Single Service by ID
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        //POST API to Add User Orders
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        })

        //POST API to collect single user orders
        app.post('/myOrders', async (req, res) => {
            const userEmail = req.body.email;
            const query = { senderEmail: userEmail };
            const orderDetails = await ordersCollection.find(query).toArray();
            res.json(orderDetails);

        })

        //DELETE API to delete user orders
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })

        //GET all orders
        app.get('/allOrders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        })

        //UPDATE API
        app.put('/ordersUpdate/:id', async (req, res) => {
            const newStatus = req.body[0];
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: newStatus
                },
            };
            const result = await ordersCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

    }
    finally {
        //   await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    console.log('Hitting backend');
    res.send('Delivery Service Backend')
})

app.listen(port, () => {
    console.log('Listening to port ', port);
})
const express = require('express')
const app = express();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5zki0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);


async function run() {
    try {
        await client.connect();
        console.log('Database Connected');

        const database = client.db('nicheDB');
        const ordersCollection = database.collection('orders');
        const productsCollection = database.collection('products');
        const usersCollection = database.collection('users');
        const reviewsCollection = database.collection('reviews');

        //POST API
        app.post('/users', async (req, res) => {

            const user = req.body;
            console.log('hit the post api', user);
            const result = await usersCollection.insertOne(user);


            console.log(result);
            res.json(result);
        })
        app.post('/reviews', async (req, res) => {

            const review = req.body;
            console.log('hit the post api', review);
            const result = await reviewsCollection.insertOne(review);


            console.log(result);
            res.json(result);
        })


        app.post('/products', async (req, res) => {

            const product = req.body;
            console.log('hit the post api', product);
            const result = await productsCollection.insertOne(product);


            console.log(result);
            res.json(result);
        })

        app.post('/orders', async (req, res) => {

            const product = req.body;
            console.log('hit the post api', product);
            const result = await ordersCollection.insertOne(product);


            console.log(result);
            res.json(result);
        })

        //Get API
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })

        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        //Get a Single one
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific id', id);
            const query = { _id: ObjectId(id) }
            const service = await productsCollection.findOne(query);
            res.json(service);
        })

        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const order = await ordersCollection.findOne(query);
            console.log('load orders with id', id);
            res.send(order)
        })


        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })






        //UPDATE API
        app.put("/users", async (req, res) => {
            const filter = { email: req.body.email };
            const result = await usersCollection.find(filter).toArray();

            if (result) {
                const documents = await usersCollection.updateOne(filter, {
                    $set: { role: "admin" }

                });
                res.json(documents);

                console.log(documents);

            }



        });
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updatedStatus = req.body;
            console.log('updating user', req);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedStatus.status
                },
            };
            const result = await ordersCollection.updateOne(filter, updateDoc, options)

            res.json(result)
        })
        // Delete API

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result)
        })
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.json(result)
        })


    }
    finally {
        // await client.close()
    }

}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('Hello Niche!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
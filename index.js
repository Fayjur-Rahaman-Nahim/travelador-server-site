const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//Middleware

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1qdkw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db("tourismDB");
        const offerCollection = database.collection("offers");
        const bookedPackageCollection = database.collection("bookedPackages");

        //Post API on Offers

        app.post('/offers', async (req, res) => {
            const newOffer = req.body;
            const result = await offerCollection.insertOne(newOffer);
            res.json(result);
        })
        // Post API on bookedPackages

        app.post('/bookedPackages', async (req, res) => {
            const bookedPackage = req.body;
            const result = await bookedPackageCollection.insertOne(bookedPackage);
            res.json(result);
        })

        //Get myBooking

        app.post('/bookedPackages/byEmail', async (req, res) => {
            const email = req.body.email
            const query = { email: email };
            const cursor = await bookedPackageCollection.find(query);
            const result = await cursor.toArray();
            res.json(result);
        })

        //DELETE API
        app.delete('/bookedPackages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookedPackageCollection.deleteOne(query);
            res.json(result);
        })


        //Get all Booked Package
        app.get('/bookedPackages', async (req, res) => {
            const cursor = bookedPackageCollection.find({})
            const bookedPackage = await cursor.toArray();
            res.json(bookedPackage);
        })
        // Get all Offers
        app.get('/offers', async (req, res) => {
            const cursor = offerCollection.find({});
            const offers = await cursor.toArray();
            res.json(offers);
        })

        // Get single Offer
        app.get('/offers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const offer = await offerCollection.findOne(query);
            res.json(offer);
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);




app.get('/', (req, res) => {
    res.send("Welcome to Tourism");
});

app.listen(port, () => {
    console.log("Listening to port", port);
});
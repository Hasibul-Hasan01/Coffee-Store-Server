const cors = require('cors');
const express = require('express');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

const uri = "mongodb://localhost:27017/"
// const uri = "mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.na2iphs.mongodb.net/?appName=Cluster0";

app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // # Database
    const coffeeCollection = client.db('coffeeStore').collection('coffees');
    const usersCollection = client.db('coffeeStore').collection('users');

    // Get Coffees
    app.get('/coffees', async (req, res) => {
      // const cursor = coffeeCollection.find()
      // const result = await cursor.toArray()
      const result = await coffeeCollection.find().toArray();
      res.send(result);
    })

    app.get('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    })


    // ADD Coffee On Database
    app.post('/coffees', async (req, res) => {
      const newCoffee = req.body;
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
      console.log(newCoffee);
    })

    // # Update Coffee
    app.put('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateCoffee = req.body;
      const updateDoc = {
        $set : updateCoffee
      }
      const result = await coffeeCollection.updateOne(query, updateDoc);
      res.send(result)
    })

    // ! Delete Coffee From DataBase
    app.delete('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    })


    // # USER RELATED API

    app.post('/users', async(req, res) => {
      const userInfo = req.body;
      const result = await usersCollection.insertOne(userInfo);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Coffee Store Server Is Runing.');
});

app.listen(port, () => {
  console.log(`Coffee Store Server Runing On ${port}`);
})
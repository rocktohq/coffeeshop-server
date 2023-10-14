const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Coffee Server is Running...");
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@usermanagement.n4peacj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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

    // Collection [Database and Collection]
    const coffeeCollection = client.db("coffeeDB").collection("coffee");

    // Get Coffee List
    app.get("/coffee", async (req, res) => {
      const coffee = await coffeeCollection.find();
      res.send(coffee);
    });

    // Get Single Coffee
    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const coffee = await coffeeCollection.findOne(query);
      res.send(coffee);
    });

    // Add new Coffee
    app.post("/coffee", async (req, res) => {
      const coffee = req.body;
      const result = await coffeeCollection.insertOne(coffee);
      res.send(result);
    });

    // Delete a Coffee
    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

    // Update a Coffee
    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const coffee = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCoffee = {
        $set: coffee
      };
      const result = await coffeeCollection.updateOne(filter, updatedCoffee, options);
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


// Server Listener
app.listen(port, () => {
  console.log("Server is running on port:", port);
})
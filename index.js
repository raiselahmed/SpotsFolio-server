const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//midleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gsishgc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Database and Collections
    const equipmentCollection = client.db("equipmentDB").collection("product");
    const userstCollection = client.db("equipmentDB").collection("users");

    //equipment route
    app.get("/products", async (req, res) => {
      const cursor = equipmentCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };
      const result = await equipmentCollection.findOne(quary);
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const newEquipment = req.body;
      console.log("Incoming Products:", newEquipment);
      const result = await equipmentCollection.insertOne(newEquipment);
      console.log("MongoDB Insert Result:", result);
      res.status(200).send(result);
    });

    app.get('/myProduct/:email', async (req, res)=>{
      console.log(req.params.email);
      const result = await equipmentCollection.find({emmail:req.params.emmail}).toArray();
      res.send(result);
    })

    //user routes
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      console.log("Incoming User Data:", newUser);
      const result = await userstCollection.insertOne(newUser);
      console.log("MongoDB Insert Result:", result);
      res.status(200).send(result);
    });

      app.get("/users", async (req, res) => {
      const cursor = userstCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//default rote
app.get("/", (req, res) => {
  res.send("SPOR-FOLIO is Runing");
});
app.listen(port, () => {
  console.log(`spotsfolio server is runnig on port ${port}`);
});

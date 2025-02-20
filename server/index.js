const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tbvw1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const taskCollection = client.db("flowTask").collection("taskCollection");
    const userCollection = client.db("flowTask").collection("userCollection");

    app.get('/users' , async(req ,res)=>{
        const result = await userCollection.find().toArray();
        res.send(result)
    })
    app.post('/users', async (req, res) => {
        const { email, displayName } = req.body;
      
        if (!email || !displayName) {
          return res.status(400).json({ message: "Email and displayName are required" });
        }
        const existingUser = await userCollection.findOne({ email });
        if (existingUser) {
          return res.status(200).json({ message: "User already exists", user: existingUser });
        }

        const newUser = { email, displayName };
        await userCollection.insertOne(newUser);
        res.status(201).json({ message: "User created successfully", user: newUser });
      });


  } finally {
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/' , (req , res)=>{
    res.send('server side ready')
})

app.listen(port , () =>{
    console.log('server running in the port :' , port);
})
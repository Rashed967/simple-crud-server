const express = require('express');
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000


// middleware 
app.use(cors())
app.use(express.json())

// simple_crud
// stwdkZtN1D0xgyon


// connect mongodb 

const uri = "mongodb+srv://simple_crud:stwdkZtN1D0xgyon@cluster0.kt6fwyn.mongodb.net/?retryWrites=true&w=majority";

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

    // database connect 
    const teacherDb = client.db('teacheDb').collection('teachers')



    // get teachers

    app.get('/teachers', async (req, res) => {
      const cursor = teacherDb.find()
      const result = await cursor.toArray()
      res.send(result)
    })


    // find single profile 
    app.get('/teachers/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await teacherDb.findOne(query)

      res.send(result)
    })


    // post teachers 
    app.post('/teachers', async(req, res) => {
      const user = req.body;
      const result = await teacherDb.insertOne(user)
      res.send(result)
    })



    // update teacher profile 
    app.put('/teachers/:id', async (req, res) => {
      const id = req.params.id;
      const {name, email} = req.body;
      const filter = {_id : new ObjectId(id)}
      const options = {upsert : true}
      const updateDoc = {
        $set : {
          name,
          email
        }
      }
      console.log(updateDoc)

      const result = await teacherDb.updateOne(filter, updateDoc, options)
      res.send(result)
    })


    // delete teacher 
    app.delete('/teachers/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await teacherDb.deleteOne(query)
        res.send(result)
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




// root route 
app.get('/', (req, res) => {
    res.send("server is running")
})


// app listen 
app.listen(port, () => {
    console.log("server is running")
})

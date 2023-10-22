const expreee = require("express")
const app = expreee()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000


// middleware 
app.use(cors())
app.use(expreee.json())

// teacherAdmin
// oQop9aufNG7N4qjH
// connect mongodb 

const uri = "mongodb+srv://teacherAdmin:oQop9aufNG7N4qjH@cluster0.kt6fwyn.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


// connect database 
const database = client.db('teacherDb')
const teacherCollection = database.collection('teachers')


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // get all teacher 
    app.get('/teachers', async(req, res) => {
      const cursor = teacherCollection.find()
      const result = await cursor.toArray()
      res.send(result)
      
    })

    // create teacher 
    app.post('/teachers', async (req, res) => {
      const user = req.body;
      const result = await teacherCollection.insertOne(user)
      res.send(result)
    })

    // get signle profle 
    app.get('/teachers/:id', async (req, res) => {
      const id = req.params.id; 
      const query = {_id : new ObjectId(id)}
      const result = await teacherCollection.findOne(query)
      res.send(result)

    })

    // update profile 
    app.put('/teachers/:id', async (req, res) => {
        const id = req.params.id;
        const {name, email } = req.body
        const filter = {_id : new ObjectId(id)}
        const options = {upsert : true}
        const updateDoc = {
          $set :{
            name,
            email
          }
        }

        const result = await teacherCollection.updateOne(filter, updateDoc, options)
        res.send(result)
    })

    // delete teacher profile 
    app.delete('/teachers/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await
       teacherCollection.deleteOne(query)
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

// listent server 
app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})
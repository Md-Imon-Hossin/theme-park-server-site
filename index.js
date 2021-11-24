const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const ObjectId = require("mongodb").ObjectId ;
const bodyParser = require('body-parser');
const app = express()
const port = process.env.PORT || 5000 ;
// middleware 
app.use(cors()) 
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}));
const uri =` mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mm4zp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run (){
    try{


        await client.connect() ;
        console.log('database connected')
        const database = client.db('waterBoom')
      const servicesCollection = database.collection('services')
      const orderCollection = database.collection("order")

   

// get api
app.get('/services', async (req, res) => {
    const cursor = servicesCollection.find({});
    const plans = await cursor.toArray();
    res.send(plans);
})
// get api by id
app.get('/services/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const query = { _id: ObjectId(id) }
    const result = await servicesCollection.findOne(query);
    res.send(result)
})

//post api
app.post('/services', async (req, res) => {
    const tours = req.body;
    console.log(tours)
    console.log(res)
    const result = await servicesCollection.insertOne(tours);
    res.json(result);
})

// add orders api
app.post('/orders', async (req, res) => {
    const order = req.body;
    console.log('order', order);
    const result = await orderCollection.insertOne(order);
    res.json(result)
})

app.get('/orders', async (req, res) => {
    const cursor = orderCollection.find({});
    const plans = await cursor.toArray();
    res.send(plans);
})

app.get('/orders/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const query = { _id: ObjectId(id) }
    const result = await orderCollection.findOne(query);
    res.send(result)
})
// delete api by id
app.delete('/orders/:id', async (req, res) => {
    const id = req.params.id;
    // console.log(id);
    const query = { _id: ObjectId(id) }
    const result = await orderCollection.deleteOne(query);
    res.send(result)
})



    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Welcome to waterBoom')
})

app.listen(port, () => {
    console.log('Running Server From Port',port)
})




       
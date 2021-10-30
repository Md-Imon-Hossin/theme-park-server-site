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
// user : myElevenNode 
// pass : YnjLQipTKWJFu5uf  
const uri =` mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mm4zp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run (){
    try{
        await client.connect() ;
        console.log('database connected')
        const database = client.db('waterBoom')
      const servicesCollection = database.collection('services')
    //  GET API 
    app.get('/services',async(req,res)=>{
        const cursor  = servicesCollection.find({}) 
        const services = await cursor.toArray() 
        res.send(services)
    })
    // POST API 
        app.post('/services', async(req,res)=>{
            const service = req.body ;
            const result = await servicesCollection.insertOne(service)
          console.log('hit the api',service)
          res.json(result)
       
        })
      // Single Service / add Order 
       app.post("/services", (req,res)=>{
        console.log(req.body)
        servicesCollection.insertOne(req.body).then(result=>{
          res.send(result)
        })
       })
      //  Get My Order 
      app.get("/myOrder/:email",async(req,res)=>{
        console.log(req.params.email)
        const result = await servicesCollection.find({email : req.params.email}).toArray()
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

// app.get('/services',(req,res)=>{
//     res.send('here is my services')
// })

app.listen(port, () => {
    console.log('Running Server From Port',port)
})
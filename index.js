const express = require('express')
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const objectId = require('mongodb').ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cxkd4.mongodb.net/ddblog?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const port = process.env.PORT || 4000

client.connect(err => {
    const serviceCollection = client.db("ddblog").collection("blogs");


    app.post('/addBlog', (req,res) => {
      const blog = req.body;
      serviceCollection.insertOne(blog)
      .then(result => {
          console.log(result);
          res.send(result.insertedCount > 0)
      })
  })

  app.get('/blogs', (req, res) => {
    serviceCollection.find({})
    .toArray((err, documents) => {
        res.send(documents);
    })
  })

  app.get('/blog/:id', (req, res) => {
    serviceCollection.find({_id: objectId(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })

  app.delete("/delete/:id", (req, res) => {
    serviceCollection.findOneAndDelete({_id: objectId(req.params.id)})
    .then(result => {
      console.log(result)
      res.send(result.deletedCount > 0);
    })
  })
  
})

app.get('/', (req, res) => {
    res.send('Hello, Daily Dose Blog')
  })
  
app.listen(port)
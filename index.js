const express = require('express')
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const objectId = require('mongodb').ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cxkd4.mongodb.net/news-portal?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const port = process.env.PORT || 4000

client.connect(err => {
    const newsCollection = client.db("news-portal").collection("news");
    const adminCollection = client.db("news-portal").collection("admin");


  app.post('/addBlog', (req,res) => {
      const blog = req.body;
      newsCollection.insertOne(blog)
      .then(result => {
          console.log(result);
          res.send(result.insertedCount > 0)
      })
  })

  app.post('/addAdmin', (req,res) => {
      const admin = req.body;
      adminCollection.insertOne(admin)
      .then(result => {
          console.log(result);
          res.send(result.insertedCount > 0)
      })
  })

  app.get('/blogs', (req, res) => {
    newsCollection.find({})
    .toArray((err, documents) => {
        res.send(documents);
    })
  })

  app.get('/blog/:id', (req, res) => {
    newsCollection.find({_id: objectId(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })

  app.delete("/delete/:id", (req, res) => {
    newsCollection.findOneAndDelete({_id: objectId(req.params.id)})
    .then(result => {
      console.log(result)
      res.send(result.deletedCount > 0);
    })
  })

  app.get("/isAdmin", (req, res) => {
    adminCollection.find({ email: req.query.email }).toArray((err, doc) => {
      if(doc.length !== 0){
        res.json({isAdmin:true}).status(200);
      }else{
        res.json({isAdmin:false, message:'Permission denied'}).status(403);
      }
    })
  })
  
})

app.get('/', (req, res) => {
    res.send('Hello, News Portal')
  })
  
app.listen(port)
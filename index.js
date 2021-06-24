const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload');//fileupload
const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

const app = express()
const port = 5000

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('blogs'));
app.use(fileUpload());


const uri = "mongodb+srv://pHero:pHeroB@cluster0.zqmy8.mongodb.net/pheroBlogs?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const blogsCollection = client.db("pheroBlogs").collection("blogs");
  // create blog
  app.post('/addBlog',(req,res)=>{
    const file = req.files.file;
    const title = req.body.title;
    const content = req.body.content;
    const newImg = file.data;
    const encImg = newImg.toString('base64');
    var image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImg, 'base64')
    };
    console.log(title, content,image);
    blogsCollection.insertOne({ title, content,image})
    .then(result => {
        res.send(result.insertedCount > 0);
    })

  })
  //show all blogs
  app.get('/blogs',(req, res) =>{
    blogsCollection.find({})
    .toArray((err, documents) => {
        res.send(documents);
    })
  })
  //show single blog
  app.get('/blog/:id',(req, res) =>{
    blogsCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, result) =>{
      res.send(result[0]);
    })
  })
  //delete blog
  app.delete('/blog/:id',(req, res)=>{
    blogsCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result =>{
      res.send(result.deletedCount>0);
      console.log('deleted success')
    })
  })
  console.log("db connected!!");;
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
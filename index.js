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
  // perform actions on the collection object
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

  console.log("db connected!!");;
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
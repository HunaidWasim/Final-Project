const express = require("express");
const mongoose = require("mongoose");
const Article = require("./models/article");
const articleRouter = require("./routes/articles");
const methodOverride = require("method-override")
var bodyParser = require('body-parser');

const app = express();

username ="neko"
password = "rf9TU2F4fUVAiF4a"

URL = `mongodb+srv://${username}:${password}@cluster0.zd4dt.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(URL, {
  useNewUrlParser: true, useUnifiedTopology: true})

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
    console.log("connection to db open")
    console.log(db.readyState)
});
  


app.use('/static', express.static('public'))
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get("/", async (req, res) => {
    const articles = await Article.find().sort({ createdAt: "desc" }).limit(5);

    res.render("articles/index", {articles: articles, notRenderImg: false});
});

app.get("/blogs", async (req, res) => {
  const articles = await Article.find().sort({ createdAt: "desc" });
  res.render("articles/index", {articles: articles, notRenderImg: true});
});

app.get("/aboutus", async (req,res)=>{
  res.render("aboutus")
})

app.use("/articles", articleRouter);

app.listen(3000);
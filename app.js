const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//setup mongodb and connect to DB
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);
mongoose.connect("mongodb://localhost:27017/wikiDB");
// mongoose.connect("mongodb+srv://admin-alberto:Test123@cluster0.7kyk1.mongodb.net/wikiDB");

//SetupsDB
const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("article", articleSchema);
//****************************************\\



//************ Database, create read and delete ( Postman)*************\\\
app.route("/articles")

  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      }
      res.send(err);
    });
  })

  .post(function(req, res) {

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save(function(err) {
      if (!err) {
        res.send("Sucessfully loaded!");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("successfully deleted all aricles.");
      } else {
        res.send(err);
      }
    });
  });

app.route("/articles/:articleTitle")

  .get(function(req,res){
    Article.findOne({title: req.params.articleTitle},function(err,foundArticle){
      if(foundArticle){
        res.send(foundArticle);

      }else{
        res.send("Article does not exist!");
      }
    });
  })

  .put(function(req,res){
    Article.update(
      {title: req.params.articleTitle}, //{conditions}
      {title: req.body.title, content: req.body.content}, //{update}
      {overwrite:true}, //overwrite by default
      function(err) {
        if (!err) {
          res.send("Sucessfully updated!");
        }
      }
    );
  })

  .patch(function(req,res){
    Article.updateOne(
      {title: req.params.articleTitle}, //{conditions}
      {$set: req.body}, //{update what the user wants}
      function(err) {
        if (!err) {
          res.send("Sucessfully updated!");
        }
      }
    );
  })

  .delete(function(req,res){
    Article.deleteOne(
      {title: req.params.articleTitle},
      function(err) {
      if (!err) {
        res.send("successfully deleted article.");
      } else {
        res.send(err);
      }
    });
  });

    app.listen(3000, function() {
    console.log("Server started on port 3000");
  });

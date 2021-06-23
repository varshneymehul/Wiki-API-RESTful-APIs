const express = require('express')
const mongoose = require('mongoose')
const ejs = require('ejs')
const bodyParser = require('body-parser')

const app = express()

const port = 3000

const {
  json,
  urlencoded
} = require('body-parser');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"))

mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const articleSchema = {
  title: String,
  content: String,
}
const Article = mongoose.model("article", articleSchema)
// request targeting all articles.
app.route("/articles")

  .get(function (req, res) {
    Article.find({}, function (err, foundArticles) {
      if (err) {
        res.send(err);
      } else {
        res.send(foundArticles) // Here, we are sending all the data that we have READ from our databse to /articles route (This is similar to how we read from APIs like the weather API)
      }

    })
  })

  .post(function (req, res) {
    console.log(req.body.title); // we are obtaining title and content from the post request. A post request can be made via Postman API software and key value pairs can be entered in the post request (title, content-key)
    console.log(req.body.content);


    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    })
    newArticle.save(function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send('Successfully posted a new article')
      }
    }); //in this way we can handle the POST requests for our APIs


  })
  .delete(function (req, res) {
    Article.deleteMany({}, function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send('Successfully deleted all articles')
      }
    })
  }); // The semi colon here should be added to only that method that we need to end.

// This is GET method in which we READ *all* articles from our database.

// App.post() - This is tricky because we are not having any kind of front-end elements (like a form element)

// App.delete() - This is the method to handle the DELTE requests for our API


// request targeting a specific article

app.route("/articles/:articleTitle")
  .get(
    function (req, res) {
      Article.findOne({
        title: req.params.articleTitle
      }, function (err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle)
        } else {
          res.send("No articles matching found.");
        }
      })

    })
  .put(function (req, res) { // PUT method completely replaces the document
    Article.updateMany({
      title: req.params.articleTitle
    }, {
      title: req.body.title,
      content: req.body.content
    }, {
      overwrite: true
    }, function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send('Successfully put.')
      }
    }) // adding overwrite:true is important because mongoose prevents from overwriting content
  })
  .patch(function (req, res) {
    Article.updateMany({
      title: req.params.articleTitle
    }, {
      $set: req.body
    }, function (err) { // $set flag tells to only update those fields we want to
      // {$set: {title:"", content:""}} can be set to predefine the fields that have to be changed. We can also use req.body and then only those fields will be changed which have been modified in body request (req.body) and body-parser will parse that field only for patching.
      if (err) {
        res.send(err);
      } else {
        res.send('Successfully patched.')
      }

    })
  })
  .delete(function (req, res) {
    Article.deleteOne({
      title: req.params.articleTitle
    }, function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send('Succesfully deleted.')
      }
    })
  })


app.listen(port, function () {
  console.log(`Example app listening on port!`)
})
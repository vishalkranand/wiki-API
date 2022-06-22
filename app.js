const bodyParser = require("body-parser");
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const contentSchema = new mongoose.Schema({
    title : String,
    content : String
});

const article = mongoose.model("article",contentSchema);

  //////////Requests targeting all articles ////////////////

app.route("/articles")


.get(function(req,res)
    {
      article.find(function(err,foundArticles)
      {
        if(!err)
        {
            res.send(foundArticles);
        }
        else
        {
            res.send(err);
        }
      });
    
    })

    
.post(function(req,res)
    {
        const newArticle= new article({
            title :   req.body.title,
            content : req.body.content
    
        });
        newArticle.save(function(err)
        {
            if(!err)
            {
                res.send("Successfully added document");
            }
            else
            {
                res.send(err);
            }
        });
    })
    
    .delete(function(req,res)
    {
        article.deleteMany(function(err)
        {
            if(!err)
            {
                res.send("Successfully deleted all articles");
            }
            else{
                res.send(err);
            }
        })
    });



    //////////Requests targeting a specific article////////////////

    app.route("/articles/:articleTitle")

    .get(function(req,res)
    {
        article.findOne({title: req.params.articleTitle},function(err,foundArticle)
        {
            if(foundArticle)
            {
                res.send(foundArticle);
            }
            else
            {
                res.send(err);
            }
        });
    })

    ////put replaces whole article while patch replaces part of article or document

    .put(function(req,res)
    {
        article.update({title:req.params.articleTitle},
            {title : req.body.title ,content : req.body.content},
            {overwrite:true},
            function(err){
                if(!err)
                {
                    res.send("Successfully replaced article");
                }
                else
                {
                    res.send(err);
                }
            });
        })

        //////changes part of the file given by client and other part remains same of the previous article ...

        .patch(function(req,res)
        {
            article.updateOne({title : req.params.articleTitle},{$set : req.body},function(err)
            {
                if(!err)
                {
                    res.send("Successfully changed part of the file given by client");
                }
                else{
                    res.send(err);
                }
            })
        })

        .delete(function(req,res)
        {
            article.deleteOne({title:req.params.articleTitle},function(err)
            {
                if(!err)
                {
                    res.send("Successfully deleted the article");
                }
                else{
                    res.send(err);
                }
            })
        });


app.listen(3000,function(req,res)
{
    console.log("Server started on port 3000 successfully ");
})
var express = require("express");

var post_md = require("../models/post");

var router = express.Router();

router.get("/", function(req, res) {
 // res.json({"message": "This is BlogPage"});

 var data = post_md.getAllPosts();

 data.then(function(posts){
    var result = {
        posts: posts,
        error: false
    };

    res.render("blog/index", {data: result});
 }).catch(function(err){
    var result = {
        error: "Không thể lấy dữ liệu bài viết"
    };

    res.render("blog/index", {data: result});
 })
});

router.get("/post/:id", function(req, res){
    var params = req.params;
    var id = params.id;

    var data = post_md.getPostByID(id);

    data.then(function(posts){
        var post =posts[0];

        var result = {
            post: post,
            error: false
        };

        res.render("blog/post", {data: result});
    }).catch(function(err){
        var result = {
            error: "Không thể lấy dữ liệu bài viết"
        };

        res.render("blog/post", {data: result});
    });
});

module.exports = router;

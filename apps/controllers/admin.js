var express = require("express");

var router = express.Router();

var user_md = require("../models/user");
var post_md = require("../models/post");

var helper = require("../helpers/helpers");

router.get("/", function (req, res) {
  if (req.session.user) {
    //  res.json({ "message": "This is AdminPage" });
    var data = post_md.getAllPosts();
    data.then(function (posts) {
      var data = {
        posts: posts,
        error: false
      };

      res.render("admin/dashboard", { data: data });
    }).catch(function (err) {
      res.render("admin/dashboard", { data: { error: "Lỗi lấy dữ liệu bài viết." } });
    });
  } else {
    res.redirect("/admin/signin");
  }
});

router.get("/signup", function (req, res) {
  res.render("signup", { data: {} });
});

router.post("/signup", function (req, res) {
  var user = req.body;

  if (user.email.trim().length == 0) {
    res.render("signup", { data: { error: "Chưa nhập email" } });
  }

  if (user.passwd.trim().length == 0) {
    res.render("signup", { data: { error: "Chưa nhập mật khẩu" } });
  }

  if (user.passwd != user.repasswd) {
    res.render("signup", { data: { error: "Mật khẩu không khớp" } });
  }

  //insert db
  var password = helper.hash_password(user.passwd);

  user = {
    email: user.email,
    password: password,
    first_name: user.firstname,
    last_name: user.lastname
  };
  var result = user_md.addUser(user);
  result.then(function (data) {
    res.redirect("/admin/signin");
  }).catch(function (err) {
    res.render("signup", { data: { error: "Error" } });
  });
});

router.get("/signin", function (req, res) {
  res.render("signin", { data: {} });
});

router.post("/signin", function (req, res) {
  var params = req.body;

  if (params.email.trim().length == 0) {
    res.render("signin", { data: { error: "Chưa nhập email" } });
  } else {
    var data = user_md.getUserByEmail(params.email);
    if (data) {
      data.then(function (users) {
        var user = users[0];
        var status = helper.compare_password(params.password, user.password);


        if (!status) {
          res.render("signin", { data: { error: "Sai mật khẩu" } });
        } else {
          req.session.user = user;

          res.redirect("/admin");
        }
      });
    } else {
      res.render("signin", { data: { error: "Sai email" } });
    }
  }
});

router.get("/post/new", function (req, res) {
  if (req.session.user) {
    res.render("admin/post/new", { data: { error: false } });
  } else {
    res.redirect("/admin/signin");
  }
});
router.post("/post/new", function (req, res) {
  var params = req.body;

  if (params.title.trim().length == 0) {
    var data = {
      error: "Chưa nhập tiêu đề."
    };
    res.render("admin/post/new", { data: data });
  } else {
    var now = new Date();
    params.created_at = now;
    params.updated_at = now;

    var data = post_md.addPost(params);

    data.then(function (result) {
      res.redirect("/admin");
    }).catch(function (err) {
      var data = {
        error: "Không thể đăng bài."
      };
      res.render("admin/post/new", { data: data });
    });
  }
});

router.get("/post/edit/:id", function (req, res) {
  if (req.session.user) {
    var params = req.params;
    var id = params.id;

    var data = post_md.getPostByID(id);

    if (data) {
      data.then(function (posts) {
        var post = posts[0];
        var data = {
          post: post,
          error: false
        };
        res.render("admin/post/edit", { data: data });
      }).catch(function (err) {
        var data = {
          error: "Không thể lấy dữ liệu bài viết."
        };

        res.render("admin/post/edit", { data: data });
      });
    } else {
      var data = {
        error: "Không thể lấy dữ liệu bài viết."
      };

      res.render("admin/post/edit", { data: data });
    }
  } else {
    res.redirect("/admin/signin");
  }
});

router.put("/post/edit", function (req, res) {
  var params = req.body;

  data = post_md.updatePost(params);
  if (!data) {
    res.json({ status_code: 500 });
  } else {
    data.then(function (result) {
      res.json({ status_code: 200 });
    }).catch(function (err) {
      res.json({ status_code: 500 });
    });
  }
});

router.delete("/post/delete", function (req, res) {
  var post_id = req.body.id;

  var data = post_md.deletePost(post_id);
  if (!data) {
    res.json({ status_code: 500 });
  } else {
    data.then(function (result) {
      res.json({ status_code: 200 });
    }).catch(function (err) {
      res.json({ status_code: 500 });
    });
  }
});

router.get("/post", function (req, res) {
  if (req.session.user) {
    res.redirect("/admin");
  } else {
    res.redirect("/admin/signin");
  }
});
router.get("/user", function (req, res) {
  if (req.session.user) {
    var data = user_md.getAllUser();

    data.then(function (users) {
      var data = {
        users: users,
        error: false
      };
      res.render("admin/user", { data: data });
    }).catch(function (err) {
      var data = {
        error: "Không thể lấy dữ liệu users"
      };
      res.render("admin/user", { data: data });
    });
  } else {
    res.redirect("/admin/signin");
  }
});
module.exports = router;

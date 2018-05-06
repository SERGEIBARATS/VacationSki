var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    Skiground  = require("./models/skiground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")



mongoose.connect("mongodb://localhost/vacation_ski");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
seedDB();

app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});


app.set("view engine", "ejs");

app.get("/", function(req, res){
  res.render("landing");  
});

app.get("/skigrounds", function(req, res){
    Skiground.find({}, function(err, allSkigrounds){
       if(err){
           console.log(err);
       } else {
           res.render("skigrounds/index",{skigrounds:allSkigrounds, currentUser: req.user});
       }
   });
});

//CREATE - add new campground to DB
app.post("/skigrounds", function(req, res){
    // get data from form and add to skigrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newSkiground = {name: name, image: image, description: desc}
    // Create a new skiground and save to DB
    Skiground.create(newSkiground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to skigrounds page
            res.redirect("/skigrounds");
        }
    });
});

app.get("/skigrounds/new", function(req, res){
     res.render("skigrounds/new");
});

app.get("/skigrounds/:id", function(req, res){
    
     Skiground.findById(req.params.id).populate("comments").exec(function(err, foundSkiground){
        if(err){
            console.log(err);
        } else {
                console.log(foundSkiground);
                res.render("skigrounds/show", {skiground: foundSkiground});
        }
    });
    req.params.id
})

//COMMENTS ROUTES

app.get("/skigrounds/:id/comments/new", isLoggedIn, function(req, res) {
     Skiground.findById(req.params.id, function(err, skiground){
     if(err){
         console.log(err);
     } else {
         res.render("comments/new", {skiground: skiground});
     }
    })
});

app.post("/skigrounds/:id/comments", isLoggedIn, function(req, res){
    
    Skiground.findById(req.params.id, function(err, skiground){
     if(err){
         console.log(err);
         res.redirect("/skigrounds");
     } else {
         Comment.create(req.body.comment, function(err, comment){
              if(err){
                console.log(err);
              } else {
                  skiground.comments.push(comment);
                  skiground.save();
                  res.redirect('/skigrounds/' + skiground._id);
              }
         });
     }
  })
});


app.get("/register", function(req, res){
   res.render("register"); 
});

app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/skigrounds"); 
        });
    });
});


app.get("/login", function(req, res){
   res.render("login"); 
});


app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/skigrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/skigrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The VacationSki Server Has Started!");
});


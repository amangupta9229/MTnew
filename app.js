
var express = require("express"),
app = express(),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
passport = require("passport"),
LocalStrategy = require("passport-local"),
User = require("./models/user"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer");

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
 


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);



//APP CONFIG
//mongoose.connect("mongodb://localhost:27017/MoMdb", { useNewUrlParser: true });
mongoose.connect("mongodb+srv://amangupta9229:powergrid2@cluster0-5bycj.mongodb.net/<dbname>?retryWrites=true&w=majority", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


app.use(require("express-session")({
    secret: "Meeting Tracker is the useful",
    resave: false,
    saveUninitialized : false,
    store: new MongoStore({mongooseConnection:mongoose.connection})
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
})



//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    location: String,
    meetingcategory:[String],
    attendees: [String],
    starttime: String,
    endtime: String,
    body: String,
    created: {type: Date, default: Date.now},
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test Blog",
//     body: "HELLO THIS IS A BLOG POST"
// });

var taskSchema = new mongoose.Schema({
    description: String,
    priority: String,
    assigned: String,
    deadline: String,
    assignedto: String,
    status: String,
    created: {type: Date, default: Date.now}
});

var Task = mongoose.model("Task", taskSchema);

// Task.create({
//     title: "Test Blog",
//     body: "HELLO THIS IS A BLOG POST"
// });

//RESTFUL ROUTES
app.get("/",isLoggedIn, function(req, res){
   res.redirect("/blogs"); 
});

//INDEX ROUTE
app.get("/blogs",isLoggedIn, function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR");
        } else {
            res.render("index", {blogs:blogs});
        }
    });
});

//NEW ROUTE
app.get("/blogs/new",isLoggedIn, function(req, res){
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs",isLoggedIn, function(req, res){
    //create blog
    console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body)
    console.log(req.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            //then, redirect to the index
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id",isLoggedIn, function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit",isLoggedIn, function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id",isLoggedIn, function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id",isLoggedIn, function(req, res){
    //destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
    //redirect somewhere
});


//TASK ROUTE////////////////////////////////////////////////////////

//INDEX ROUTE
app.get("/tasks",isLoggedIn, function(req, res){
    Task.find({}, function(err, tasks){
        if(err){
            console.log("ERROR");
        } else {
            res.render("task", {tasks:tasks})
        }
    });
});

//NEW TASK ROUTE
app.get("/tasks/new",isLoggedIn, function(req, res){
    res.render("newtask");
});

//CREATE TASK ROUTE
app.post("/tasks",isLoggedIn, function(req, res){
    //create task
    console.log(req.body);
    req.body.task.body = req.sanitize(req.body.task.body)
    console.log(req.body);
    Task.create(req.body.task, function(err, newTask){
        if(err){
            res.render("newtask");
        } else {
            //then, redirect to the index
            res.redirect("/tasks");
        }
    });
});

//SHOW TASK ROUTE
app.get("/tasks/:id",isLoggedIn, function(req, res){
    Task.findById(req.params.id, function(err, foundTask){
        if(err){
            res.redirect("/tasks");
        } else {
            res.render("showtask", {task: foundTask});
        }
    });
});

//EDIT ROUTE
app.get("/tasks/:id/edit",isLoggedIn, function(req, res){
    Task.findById(req.params.id, function(err, foundTask){
        if(err){
            res.redirect("/tasks");
        } else {
            res.render("edittask", {task: foundTask});
        }
    });
});

//UPDATE ROUTE
app.put("/tasks/:id",isLoggedIn, function(req, res){
    req.body.task.body = req.sanitize(req.body.task.body)
    Task.findByIdAndUpdate(req.params.id, req.body.task, function(err, updatedTask){
        if(err){
            res.redirect("/tasks");
        } else {
            res.redirect("/tasks/" + req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/tasks/:id",isLoggedIn, function(req, res){
    //destroy blog
    Task.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/tasks");
        } else {
            res.redirect("/tasks");
        }
    })
    //redirect somewhere
});

//AUTHENTICATION ROUTES //////////////////////////////////////////////////////

//REGISTER ROUTES
// show register form
app.get('/register', function(req, res) {
    res.render('register');
});

// handle sign up logic
app.post('/register', function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.redirect("/register");
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/blogs');
        });
    });
});




//LOGIN ROUTES
app.get('/login', function(req, res) {
    res.render('login');
});

// handle login logic
//uses a middleware, see authentication folder
app.post('/login', passport.authenticate('local',
    {
        successRedirect: '/',
        failureRedirect: '/login'
    }), function(req, res){
});

//LOGOUT ROUTES

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
});

//MIDDLEWARE 
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen( process.env.PORT || 3001, function(){
    console.log("Server is running");
})
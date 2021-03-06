
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


let attendees=["Gitanjali Singh","anshika"];

/////////////////////////////MONGOOSE MODEL CONFIG///////////////////////////////////////////////////////////

/////////////// BLOGS SCHEMA////////////////

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

/////////////// TASKS SCHEMA////////////////

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


/////////////// SELF NOTES SCHEMA////////////////

var selfnoteSchema = new mongoose.Schema({
    
    title: String,
    description: String,
    created: {type: Date, default: Date.now}
});

var Selfnote = mongoose.model("Selfnote", selfnoteSchema);


/////////////////////////////MONGOOSE MODEL CONFIG END///////////////////////////////////////////////////////////

//////////////////////////////RESTFUL ROUTES/////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////




//////////////////////////////////////  DASHBOARD ROTES //////////////////////////////////////////////
app.get("/",isLoggedIn, function(req, res){
    res.redirect("/dashboard"); 
 });
 
 //INDEX ROUTE
 app.get("/dashboard",isLoggedIn, function(req, res){
     var today = new Date();
 
     var dateIs = today.getFullYear()+'-'+'0'+(today.getMonth()+1)+'-'+today.getDate();
 
     console.log(" homes date");
     console.log(dateIs);
     
 
     if(dateIs !=''){
         var flterParameter={deadline:dateIs}
       }
 
     else{
       var flterParameter={}
     }
 
     var taskFilter =Task.find();
     taskFilter.exec(function(err,tasks){
         if(err) throw err;
         res.render('dashboard', { title: 'Employee Records', tasks:tasks});
         });
     });
//////////////////////////////////////HOME ROTES //////////////////////////////////////////////

app.get("/",isLoggedIn, function(req, res){
   res.redirect("/home"); 
});

//INDEX ROUTE
app.get("/home",isLoggedIn, function(req, res){
    var today = new Date();

    var dateIs = today.getFullYear()+'-'+'0'+(today.getMonth()+1)+'-'+today.getDate();

    console.log(" homes date");
    console.log(dateIs);
    

    if(dateIs !=''){
        var flterParameter={deadline:dateIs}
      }

    else{
      var flterParameter={}
    }

    var taskFilter =Task.find();
    taskFilter.exec(function(err,tasks){
        if(err) throw err;
        res.render('home', { title: 'Employee Records', tasks:tasks});
        });
    });

//     Blog.find({}, function(err, tasks){
//         if(err){
//             console.log("ERROR");
//         } else {
//             res.render("home", {tasks:tasks});
//         }
//     });
// });

//HOME TODAY FILTER ROUTE//
app.get("/filterbyToday",isLoggedIn, function(req, res){
    res.redirect("/home"); 
 });

app.post('/filterbyToday', isLoggedIn, function(req, res,next) {

    var today = new Date();

    var dateIs = today.getFullYear()+'-'+'0'+(today.getMonth()+1)+'-'+today.getDate();

   
    var dateTom = today.getFullYear()+'-'+'0'+(today.getMonth()+1)+'-'+(today.getDate()+1);
    


    
    
        if(dateIs !=''){
            var flterParameter={deadline:dateIs}
          }
    
        else{
          var flterParameter={}
        }
    
        var taskFilter =Task.find(flterParameter);
        taskFilter.exec(function(err,tasks){
            if(err) throw err;
            res.render('home', { title: 'Employee Records', tasks:tasks});
            });
    


    // if(dateTom !=''){
    //     var flterParameter={deadline:dateTom}
    //   }

    // else{
    //   var flterParameter={}
    // }

    // var taskFilter =Task.find(flterParameter);
    // taskFilter.exec(function(err,tasks){
    //     if(err) throw err;
    //     res.render('home', { title: 'Employee Records', tasks:tasks});
    //     });

    });

    //HOME  TOMMORROW FILTER ROUTE//
app.get("/filterbyTommorrow",isLoggedIn, function(req, res){
    res.redirect("/home"); 
 });

app.post('/filterbyTommorrow', isLoggedIn, function(req, res,next) {

        const today = new Date()
        const tommorrow = new Date(today)
        tommorrow.setDate(tommorrow.getDate() + 1)

        if( (tommorrow.getMonth()+1)<10 && tommorrow.getDate()<10 ){
        var dateTom = tommorrow.getFullYear()+'-'+'0'+(tommorrow.getMonth()+1)+'-'+'0'+tommorrow.getDate();
        }
        if( (tommorrow.getMonth()+1)<10 && tommorrow.getDate()>10 ){
            var dateTom = tommorrow.getFullYear()+'-'+'0'+(tommorrow.getMonth()+1)+'-'+tommorrow.getDate();
        }
        if( (tommorrow.getMonth()+1)>10 && tommorrow.getDate()<10 ){
            var dateTom = tommorrow.getFullYear()+'-'+(tommorrow.getMonth()+1)+'-'+'0'+tommorrow.getDate();
        }
        if( (tommorrow.getMonth()+1)>10 && tommorrow.getDate()>10 ){
            var dateTom = tommorrow.getFullYear()+'-'+(tommorrow.getMonth()+1)+'-'+tommorrow.getDate();
        }


    if(dateTom !=''){
        var flterParameter={deadline:dateTom}
      }

    else{
      var flterParameter={}
    }

    var taskFilter =Task.find(flterParameter);
    taskFilter.exec(function(err,tasks){
        if(err) throw err;
        res.render('home', { title: 'Employee Records', tasks:tasks});
        });
    });



    /////////////HOME UPCOMING FILTER ROUTE//
app.get("/filterbyUpcoming",isLoggedIn, function(req, res){
    res.redirect("/home"); 
 });

app.post('/filterbyUpcoming', isLoggedIn, function(req, res,next) {

    // const today = new Date()
    // const tommorrow = new Date(today)
    // tommorrow.setDate(tommorrow.getDate() + 2)

    // if( (tommorrow.getMonth()+1)<10 && tommorrow.getDate()<10 ){
    // var date2 = tommorrow.getFullYear()+'-'+'0'+(tommorrow.getMonth()+1)+'-'+'0'+tommorrow.getDate();
    // }
    // if( (tommorrow.getMonth()+1)<10 && tommorrow.getDate()>10 ){
    //     var date2 = tommorrow.getFullYear()+'-'+'0'+(tommorrow.getMonth()+1)+'-'+tommorrow.getDate();
    // }
    // if( (tommorrow.getMonth()+1)>10 && tommorrow.getDate()<10 ){
    //     var date2 = tommorrow.getFullYear()+'-'+(tommorrow.getMonth()+1)+'-'+'0'+tommorrow.getDate();
    // }
    // if( (tommorrow.getMonth()+1)>10 && tommorrow.getDate()>10 ){
    //     var date2 = tommorrow.getFullYear()+'-'+(tommorrow.getMonth()+1)+'-'+tommorrow.getDate();
    // }


 
    // tommorrow.setDate(tommorrow.getDate() + 1)

    // if( (tommorrow.getMonth()+1)<10 && tommorrow.getDate()<10 ){
    // var date3 = tommorrow.getFullYear()+'-'+'0'+(tommorrow.getMonth()+1)+'-'+'0'+tommorrow.getDate();
    // }
    // if( (tommorrow.getMonth()+1)<10 && tommorrow.getDate()>10 ){
    //     var date3 = tommorrow.getFullYear()+'-'+'0'+(tommorrow.getMonth()+1)+'-'+tommorrow.getDate();
    // }
    // if( (tommorrow.getMonth()+1)>10 && tommorrow.getDate()<10 ){
    //     var date3 = tommorrow.getFullYear()+'-'+(tommorrow.getMonth()+1)+'-'+'0'+tommorrow.getDate();
    // }
    // if( (tommorrow.getMonth()+1)>10 && tommorrow.getDate()>10 ){
    //     var date3 = tommorrow.getFullYear()+'-'+(tommorrow.getMonth()+1)+'-'+tommorrow.getDate();
    // }

    // console.log(date2);
    // console.log(date3);
    var currentStatus = "Open";

    if(currentStatus!=" " ){
        var flterParameter={status:currentStatus}
        // {$and:[{deadline:date2},{deadline:date3 }]}
      }

    var taskFilter =Task.find(flterParameter);
    taskFilter.exec(function(err,tasks){
        if(err) throw err;
        res.render('home', { title: 'Employee Records', tasks:tasks});
        });
    });


    //HOME COMPLETED FILTER ROUTE//
app.get("/filterbyCompleted",isLoggedIn, function(req, res){
    res.redirect("/home"); 
 });

app.post('/filterbyCompleted', isLoggedIn, function(req, res,next) {

    // var today = new Date();

    // var dateIs = today.getFullYear()+'-'+'0'+(today.getMonth()+1)+'-'+today.getDate();

    // console.log(" todays date");
    // console.log(dateIs);

    var currentStatus = "Closed";

    if(currentStatus!=" "){
        var flterParameter={status:currentStatus}
      }

    else{
      var flterParameter={}
    }
    

    var taskFilter =Task.find(flterParameter);
    taskFilter.exec(function(err,tasks){
        if(err) throw err;
        res.render('home', { title: 'Employee Records', tasks:tasks});
        });
    });


    //HOME OVERDUE FILTER ROUTE//
app.get("/filterbyOverdue",isLoggedIn, function(req, res){
    res.redirect("/home"); 
 });

app.post('/filterbyOverdue', isLoggedIn, function(req, res,next) {

    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    var dateIs = yesterday.getFullYear()+'-'+'0'+(yesterday.getMonth()+1)+'-'+(yesterday.getDate());

    console.log(" tommorrows date");
    console.log(dateIs);
    

    if(dateIs !=''){
        var flterParameter={deadline:dateIs}
      }

    else{
      var flterParameter={}
    }

    var taskFilter =Task.find(flterParameter);

    // const result = deadline.filter(deadline => deadline < dateIs);
    taskFilter.exec(function(err,tasks){
        if(err) throw err;
        res.render('home', { title: 'Employee Records', tasks:tasks});
        });
    });

/////////////////////HOME PAGE ROUTES END////////////////////////////////////////////



/////////////////////////////////MEETING PAGE ROUTE//////////////////////////////////////////

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
            //console.log(req.body);
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
    console.log(" start record");
    console.log(req.body);
    console.log(" start individual record");
    console.log(req.body.task.assignedto);
    req.body.task.body = req.sanitize(req.body.task.body)
    console.log(" full record");
    console.log(req.body);
    console.log(" individual record");
    console.log(req.body.task.assignedto);
    Task.create(req.body.task, function(err, newTask){
        if(err){
            res.render("newtask");
        } else {
            //then, redirect to the index
            res.redirect("/tasks");
        }
    });
});


//////////////////////////////////    FILTER ROUTES //////////////////////////

////////////////////////////////FILTER TASKS ROUTES//////////////////////

app.get("/search/",isLoggedIn, function(req, res){
    res.redirect("/tasks"); 
 });

app.post('/search/', isLoggedIn, function(req, res,next) {

    var assignedTo = req.body.task.name;
    var priorityIs = req.body.task.pname;
    var   statusIs  = req.body.task.sname;

    console.log(" start record");
    console.log(req.body);
    console.log(" start individual record");
    console.log(assignedTo);
    console.log(priorityIs);
    console.log(statusIs);

    // if(assignedTo !=''){
    //     flterParameter={p: assignedTo}
    // }

    
    if(assignedTo !='' && (priorityIs !='' && statusIs !='') ){
     var flterParameter={ $and:[{ status:assignedTo},
    {$and:[{priority:priorityIs},{status:statusIs}]}]
     }

    }else if(assignedTo !='' && (priorityIs =='' && statusIs !='')){
      var flterParameter={ $and:[{ assignedto:assignedTo},{status:statusIs}]
         }
    }

    else if(assignedTo =='' && (priorityIs !='' && statusIs !='')){
      var flterParameter={ $and:[{ priority:priorityIs},{status:statusIs}]
         }
    }

    else if(assignedTo !='' && (priorityIs !='' && statusIs =='')){
        var flterParameter={ $and:[{ priority:priorityIs},{assignedto:assignedTo}]
           }
      }

    else if(assignedTo !='' && priorityIs =='' && statusIs ==''){
      var flterParameter={assignedto:assignedTo}
    }

    else if(assignedTo =='' && priorityIs !='' && statusIs ==''){
        var flterParameter={priority:priorityIs}
      }

      else if(assignedTo =='' && priorityIs =='' && statusIs !=''){
        var flterParameter={status:statusIs}
      }

    else{
      var flterParameter={}
    }

    var taskFilter =Task.find(flterParameter);
    taskFilter.exec(function(err,tasks){
        if(err) throw err;
        res.render('task', { title: 'Employee Records', tasks:tasks});
        });
    });

// ///////////////////FILTER MEETINGS ROUTE//////////////////////


// app.get("/searchm/",isLoggedIn, function(req, res){
//     res.redirect("/blogs"); 
//  });


// app.post('/searchm/', isLoggedIn, function(req, res,next) {

//     var attendeesAre = req.body.blog.member;
//     var meetingcategoryIs = req.body.blog.category;
//     var   locationIs  = req.body.blog.locationname;

//     console.log(" start record");
//     console.log(req.body);
//     console.log(" start individual record");
//     console.log(attendeesAre);
//     console.log(meetingcategoryIs);
//     console.log(locationIs);

//     // if(attendeesAre !=''){
//     //     flterParameter={p: attendeesAre}
//     // }

    
//     // if(attendeesAre !='' && (meetingcategoryIs !='' && locationIs !='') ){
//     //  var flterParameter={ $and:[{ attendees:attendeesAre},
//     // {$and:[{meetingcategory:meetingcategoryIs},{location:locationIs}]}]
//     //  }

//     // }else if(attendeesAre !='' && (meetingcategoryIs =='' && locationIs !='')){
//     //   var flterParameter={ $and:[{ attendees:attendeesAre},{location:locationIs}]
//     //      }
//     // }

//     // else if(attendeesAre =='' && (meetingcategoryIs !='' && locationIs !='')){
//     //   var flterParameter={ $and:[{ meetingcategory:meetingcategoryIs},{location:locationIs}]
//     //      }
//     // }

//     // else if(attendeesAre !='' && (meetingcategoryIs !='' && locationIs =='')){
//     //     var flterParameter={ $and:[{ meetingcategory:meetingcategoryIs},{attendees:attendeesAre}]
//     //        }
//     //   }

//     // else if(attendeesAre !='' && meetingcategoryIs =='' && locationIs ==''){
//     //   var flterParameter={attendees:attendeesAre}
//     // }

//     // else if(attendeesAre =='' && meetingcategoryIs !='' && locationIs ==''){
//     //     var flterParameter={meetingcategory:meetingcategoryIs}
//     //   }

//     // else if(attendeesAre =='' && meetingcategoryIs =='' && locationIs !=''){
//     //     var flterParameter={location:locationIs}
//     //   }

//     if(attendeesAre !=''){
//         console.log(" attendees are: ")
//         console.log(attendeesAre);

//         for(var i=0;i<attendees.length;i++){ 
//             console.log(" f:")
//             var x=attendees[i]; 
//             console.log(" x:")
//             console.log(x);
//             if(x==attendeesAre){
//             var flterParameter={x:attendeesAre}
//             }
//       }
//     }
//     else{
//       var flterParameter={}
//       console.log(" y:")
//     }

//     var blogFilter =Blog.find(flterParameter);
//     blogFilter.exec(function(err,blogs){
//         if(err) throw err;
//         res.render('index', { title: 'Employee Records', blogs:blogs});
//         });
//     });





//////////////////////////////////////////////////////////////////////////////////////

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

//////////////////////////////// SELF NOTES ROUTES//////////////////////////////////////////////////////////////

app.get("/selfnotes",isLoggedIn, function(req, res){
    res.render("selfnotes");
});

//////////////////////////////// SELF NOTES ROUTES END//////////////////////////////////////////////////////////////

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




///////////////////////////////////////////////////////////////////////////////////


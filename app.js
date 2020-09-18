var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var User = require("./models/user");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var app = express();


mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/auth_demo_app");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

app.use(require("express-session")({
	secret: "Rusty is the best and cutest dog in the world",
	resave: true,
	saveUninitialized: true
}));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=======================
//ROUTES
//=======================

app.get("/", function(req, res){
	res.render("home");
});

app.get("/secret",isLoggedIn, function(req, res){
   res.render("secret"); 
});

//========================
//AUTH ROUTES

//show sign up form
app.get("/register", function(req, res){
	res.render("register");
});

//handling user sign up
app.post("/register", function(req, res){
	req.body.username
	req.body.password
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render('/register');
		} 
		passport.authenticate("local")(req, res, function(){
			res.redirect("/secret");
		});
	});
});

//LOGIN ROUTES
//render login form
app.get("/login", function(req, res){
	res.render("login");
});
//login logic
//middleware
app.post("/login",passport.authenticate("local", {
	successRedirect: "/secret",
	failureRedirect: "/login"
}) ,function(req, res){
	
});

//LOG OUT ROUTE
app.get("/logout", function(req, res){
	//res.send("Ok I will log you out");
	req.logout();
	res.redirect("/");
});

// isLoggedIn function
//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("server has Started!!!!!!");
});

if(process.env.NODE_ENV !=="production")
{
    require("dotenv").config()
}


const express = require("express");
const mongoose =  require("mongoose");
const Campground =  require("./models/yelpcamp");
const Review = require("./models/reviews");

const asyncEror = require("./utilties/asyncErrorHandler");
const expressErrors = require("./utilties/ExpressErrors");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session"); // for cookies and FLash
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");

const routes = require("./routes/campgrounds");
const revRoutes= require("./routes/reviews");
const userRoutes = require("./routes/user");
const user = require("./models/user");
const sanitize = require("express-mongo-sanitize") // for preventing mongo injection
const mongoStore = require('connect-mongo'); // this is for storing our session info in mongo instead of local broweser


// mongoose requirments 
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp', {useNewUrlParser: true, useUnifiedTopology:true})    
.then(()=>{
    console.log("Mongoose Connected !!");

})
.catch(err=>
{
    console.log("ohh nooo Mongoose Erorrr!!");
    console.log(err); 
})

const db = mongoose.connection;

const app =  express();
app.use(methodOverride("_method"));

app.engine("ejs",ejsMate); //used for making layouts

app.use(express.urlencoded({ extended: true})); // used for fetching the incoming data form HTML forms

app.set("view engine","ejs"); // Requuire for using Ejs

app.use(express.static("public"));

app.use(sanitize({ replaceWith:'_' }));


const store = mongoStore.create({
        mongoUrl:'mongodb://127.0.0.1:27017/yelpcamp',
        secret:"hehe",
        touchAfter: 24 * 60 * 60,
        collection:'sessions'

    });

db.on('error', console.error.bind(console, 'connection error:'));
const config = {      //session making stuff hehe:)

    store: store,
    secret: " secrethehe",
    resave : false,
    saveUninitialized: true,

    cookie :
    {
        expires: Date.now + 1000* 60 * 60 * 24 * 7,
        maxAge: 1000* 60 * 60 * 24 * 7,
        httpOnly: true
    }

}

app.use(session(config));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


//*********** */

app.use((req,res,next)=>
{

    res.locals.loggedUser = req.user;        // this showss the current user
 
    res.locals.success = req.flash("success");
    res.locals.err = req.flash("err");
    res.locals.del = req.flash("del");



    next();
})


app.get("/",(req,res)=>
{
    res.render("home");
})

app.use("/campgrounds",routes)

app.use("/campgrounds/:id/reviews",revRoutes)

app.use("/", userRoutes);

// app.delete('/campgrounds/:id/reviews/:reviewId', asyncEror(async (req, res) => {
//     const { id, reviewId } = req.params;
//     await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/campgrounds/${id}`);
// }))


app.all("*", (req,res,next)=>
{
    next(new expressErrors(" Page Not Found ",404));
})

app.use((err,req,res,next)=>     //error handling middleware 
{
    const { status = 500}= err;
    if(!err.message)
    {
        err.message = "something went wrong";
    } 

    res.status(status).render("errorTemplate.ejs" , {err} );
    
}
)

app.listen(3000,()=>
{
    console.log("Heloooo");
})

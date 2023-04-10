const express = require("express");
const asyncEror = require("../utilties/asyncErrorHandler");

const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const {isLoggedin} = require("../loggedIn"); 

router.get("/register", (req,res)=>
{
    res.render("register.ejs");

})

router.post("/register", asyncEror( async(req,res,next)=>
{
    try{                                                             // try catch function ensures that no username is repeated.

        const { username , password, email } = req.body; 

    const user = new User({email , username});
    
    const registeredUser = await User.register(user , password);
    
    req.login(registeredUser, (err)=>               // this ensures that user got logged in when is registered
    {
        if(err) return next(err);
        req.flash("success"," Welcome to campgrounds");


    res.redirect("/campgrounds");
    })

    


    }

    catch(e)
    {
        req.flash("err", e.message);
        res.redirect("/register");
    }

}));

router.get("/login",(req,res)=>
{
    res.render("login.ejs");
})
                                                                                        //not flashing it :(
router.post("/login", passport.authenticate('local', { keepSessionInfo: true , failureRedirect:'/login', failureFlash: true }), (req,res)=>
{
    
    req.flash("success"," Welcome Back !!");
    const redirectPath = req.session.returnTo || "/campgrounds";        // this is for redirecting user to page from where he left

    res.redirect(redirectPath);

})

router.get("/logout",(req,res,next)=>
{
    req.logout(function(err) {
        if (err) { return next(err); }

        req.flash("del"," Logged Out successfully!!"); 
    res.redirect("/campgrounds");

    }

    
    )
    
})

module.exports = router;
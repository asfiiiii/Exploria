module.exports.isLoggedIn = (req,res,next)=>            // thsi middleware ensures that the user is logged in 
{
    if(!req.isAuthenticated())
    {
        req.session.returnTo = req.originalUrl;
        req.flash("err","You must be logged in First!");
       return res.redirect("/login");
    }
    next();
}
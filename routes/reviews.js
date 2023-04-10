const express = require("express");

const routes = express.Router({mergeParams: true});  // for merging paras becz both routes have diffrent params .

const Campground =  require("../models/yelpcamp");
const Review = require("../models/reviews");

const asyncEror = require("../utilties/asyncErrorHandler");
const expressErrors = require("../utilties/ExpressErrors");

const { reviewSchema } = require("../schemas");
const{isLoggedIn} = require("../loggedIn");



const validateReview = (req,res,next)=>
{
    const { error } = reviewSchema.validate(req.body);
    if(error)
    {
        const msg = error.details.map(el => el.message).join(',');
        throw new expressErrors(msg,400);   

        //it will throws an error which will be caught by a middleware
        // at line  118
    }
    else
    {
        next();
    }
}

const isRevAuthor = async(req,res,next)=>
{
    const {id, revId}= req.params;
    const rev = await Review.findById(revId);
    if( ! rev.author.equals(req.user._id) )
    {
        req.flash("err","You dont have any Permission");
       return res.redirect(`/campgrounds/${id}`);
    }

    next();
}

routes.post("/" ,isLoggedIn , validateReview ,  asyncEror( async(req,res)=>
{
    const camp = await Campground.findById(req.params.id);
    const rev = new Review(req.body.review);
    rev.author = req.user._id;

    camp.review.push(rev);

    await rev.save();
    await camp.save();

    req.flash("success"," Review Added! ");

    res.redirect(`/campgrounds/${camp._id}`);
    
}))

routes.delete('/:revId',isLoggedIn ,isRevAuthor, asyncEror( async(req,res)=>
{
    const { id, revId } = req.params;
     const camp = await Campground.findByIdAndUpdate(id, { $pull:{review: revId}});  //for deleting a particular review
    const rev =  await Review.findByIdAndDelete(revId);
   
    req.flash("del"," Review Deleted");
    
    res.redirect(`/campgrounds/${id}`);

}))


module.exports = routes;
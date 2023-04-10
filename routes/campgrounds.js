
const express = require("express");
const {storage, cloudinary } = require("../cloudinaryImageUpload");
const mapbox = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken = process.env.MAPBOX_TOKEN;

const geoCoder = mapbox({accessToken : maptoken});

const multer = require('multer');
const upload = multer({storage});
const routes = express.Router();

//.....

const Campground =  require("../models/yelpcamp");

const asyncEror = require("../utilties/asyncErrorHandler");
const expressErrors = require("../utilties/ExpressErrors");
const { joiSchema } = require("../schemas");
const{isLoggedIn} = require("../loggedIn");
const { findById, populate } = require("../models/yelpcamp");


const validateCampground = (req,res,next) =>
{
    

    const { error } = joiSchema.validate(req.body);
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

const isAuthor = async(req,res,next)=>
{
    const {id}= req.params;
    const camp = await Campground.findById(id);
 
    if( ! camp.author.equals(req.user._id) )
    {
        req.flash("err","You dont have any Permission");
       return res.redirect(`/campgrounds/${id}`);
    }

    next();
}

//.....

routes.get("/", asyncEror(async(req,res)=>
{
    const campgrounds = await Campground.find({});
    
    
    res.render("campgrounds.ejs", { campgrounds });
}))

routes.get("/new",isLoggedIn , (req,res)=>
{
    res.render("new.ejs");
})

routes.post("/", upload.array('image'),  validateCampground , asyncEror( async(req,res)=>
{

    const geoData = await geoCoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1

    }).send();

    const newCamp = new Campground(req.body.campground);

    newCamp.geometry = geoData.body.features[0].geometry;

    newCamp.images = req.files.map( f=>({ url:f.path , filename:f.filename} ));

    newCamp.author = req.user._id;

    await newCamp.save();

    

    req.flash("success"," Heyyy created a new Campground");

    res.redirect(`/campgrounds/${newCamp._id}`);
}))


routes.get("/:id", asyncEror( async(req,res)=>
{
    const camp = await Campground.findById(req.params.id).populate({
        
        path:'review',
        populate:{
            path:'author'
        }
        
    }).populate('author');
    
    if(!camp)
    {
        req.flash("err", " Capmgound Doesn't exists! ");
        res.redirect("/campgrounds");
    }
    
    res.render("showCamp", {camp});
}))

routes.get("/:id/edit",isLoggedIn , isAuthor , asyncEror(async(req,res)=>
{
    const {id } = req.params;

    const camp =  await Campground.findById(id);

    res.render("edit",{camp});
}))

routes.put("/:id", isLoggedIn, isAuthor , upload.array('image') , asyncEror(async(req,res)=>  //here i have removed the backend Validation because joi validation was not working on Multiform data
{
    const{id }= req.params;
    const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground });
    const imgs = req.files.map( f=>({ url:f.path , filename:f.filename} ));

    camp.images.push(...imgs);
    await camp.save();

    if(req.body.deleteImages)
    {
        for( let filename of req.body.deleteImages)
        {
           await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull:{images:{filename: { $in: req.body.deleteImages }}}});
    }
    if(!camp)
    {
        req.flash("err", " Capmgound Doesn't exists! ");
        res.redirect("/campgrounds");
    }

    req.flash("success"," Campground Updated! ");

    res.redirect(`/campgrounds/${camp._id}`);
    
}))


routes.delete("/:id",isLoggedIn , isAuthor , asyncEror(async(req,res)=>
{
    const {id} = req.params;

    await Campground.findByIdAndDelete(id);

    req.flash("del"," Campground Deleted! ");

    res.redirect('/campgrounds');
}))

module.exports = routes;

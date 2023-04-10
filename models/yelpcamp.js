const { string, number } = require("joi");
const mongoose = require("mongoose");
const Review = require("./reviews")
const Schema = mongoose.Schema;


const imageSchema = new Schema({

    url:String,
    filename:String

});

imageSchema.virtual('thumbnail').get( function()
{
    return this.url.replace('/upload','/upload/w_200');
});


const campgroundscheme = new Schema(
    {
        title:String,
        price:Number,
        location:String,
        description:String,
        geometry:{
            type:{
                type:String,
                enum: ['Point'],
                required: true
            },                                        // this is for storing geoJSON format of retireved data from map box
            coordinates:
            {
                type:[Number],
                required:true
            }
        },
        images: [imageSchema],
        author: {
            type: Schema.Types.ObjectId,
            ref:'User'
        } ,

          review: [
            {
                type: Schema.Types.ObjectId,
                ref:'Review',
                
            }
        ]

    } , {
        toJSON: {
          virtuals: true // enable virtual properties in toJSON()
        }
      }
);

campgroundscheme.virtual('properties.popup').get( function()
{
    return `<a href="/campgrounds/${this._id}"> ${this.title} </a>`;
});

campgroundscheme.post('findOneAndDelete', async function(doc){

    if(doc)
    {
        await Review.deleteMany({
            _id:{
                $in: doc.review
            }
        })
    }
})

const Campground = mongoose.model("Campground",campgroundscheme);


module.exports  =  Campground;

//..........................................//


const mongoose = require("mongoose");

const schema = mongoose.Schema;

const reviewSchema = new schema({
    body: String,
    rating: Number,

    author:
    {
        type:schema.Types.ObjectId,
        ref:'User'
    }

})


 const Review =  mongoose.model("Review",reviewSchema);

 module.exports = Review;


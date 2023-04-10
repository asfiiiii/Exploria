const joi = require("joi");

module.exports.joiSchema = joi.object({          //this step is for backend Validations 
    campground : joi.object({

        title: joi.string().required(),
        price: joi.number().required().min(0),
        location: joi.string().required(),
        description: joi.string().required(),
        // image: joi.string().required()

    }).required()
})


module.exports.reviewSchema = joi.object(
    {
        review : joi.object(
            {
                rating : joi.number().required().min(0).max(10),
                body : joi.string().required()
            }
        ).required()
    }
)                     





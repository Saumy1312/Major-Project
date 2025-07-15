const joi = require("joi");

module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required().trim().min(1).max(100),
        description: joi.string().required().trim().min(10).max(1000),
        location: joi.string().required().trim().min(1).max(100),
        country: joi.string().required().trim().min(1).max(50),
        price: joi.number().required().min(0).positive(),
        image: joi.object({
            filename: joi.string().optional().allow(""),
            url: joi.string().optional().allow("", null).uri() //fuck this thing
        }).optional()
    }).required()
});
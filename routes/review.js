const express =  require("express");
const router = express.Router({mergeParams: true});
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {  validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js"); 

const reviewsController = require("../controllers/reviews.js");


//post route to create reviews
router.post("/", isLoggedIn, validateReview, wrapAsync (reviewsController.createReview));

//post route to delete review
router.delete("/:reviewId", 
    isLoggedIn, 
    isReviewAuthor,
    wrapAsync(reviewsController.destroyReview));

module.exports = router;
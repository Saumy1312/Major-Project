const express =  require("express");
const router = express.Router({mergeParams: true});
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {  validateReview } = require("../middleware.js"); 


//reviews
//post route for reviews
router.post("/", validateReview, wrapAsync (async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review succesfully created!");
    res.redirect(`/listings/${id}`);
}));
//post route to delete review
router.delete("/:reviewId", wrapAsync(async(req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    let del = await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review succesfully Deleted!");
    console.log(del);
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
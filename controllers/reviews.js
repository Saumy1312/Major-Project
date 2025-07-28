const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.createReview = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; // set the author to the current user
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review succesfully created!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyReview = async(req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    let del = await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review succesfully Deleted!");
    res.redirect(`/listings/${id}`);
};
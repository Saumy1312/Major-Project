const express =  require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js"); 

// Middleware to validate listing data
const validateListing = (req, res, next) => {
    // Convert price string to number if it exists
    if (req.body.listing && req.body.listing.price) {
        req.body.listing.price = Number(req.body.listing.price);
    }
    
    // Validate with Joi
    let { error } = listingSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        let errorMessages = error.details.map((el) => el.message);
        console.log("Validation Errors:", errorMessages); // Console log for debugging
        throw new ExpressError(400, errorMessages.join(", "));
    } else {
        next();
    }
};

// index route
router.get("/", wrapAsync(async (req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings})
    }));

//new route
router.get("/new" , isLoggedIn, (req, res) =>  {
    res.render("listings/new.ejs")
    });

//show route

router.get("/:id", wrapAsync(async (req,res) =>  {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing) {
    req.flash("error", "Listing does not exist!");
    res.redirect("/listings");
    }
    else {
    res.render("listings/show.ejs", {listing})
    }}));

//create route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "Listing created successfully!");
    res.redirect("/listings");
}));

//edit route
router.get("/:id/edit", isLoggedIn , wrapAsync( async (req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    req.flash("success", "Listing succesfully Updated!");
    if(!listing) {
    req.flash("error", "Listing does not exist!");
    res.redirect("/listings");
    }
    else {
    res.render("listings/edit.ejs", {listing})
}}));

//update route
router.put("/:id", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing succesfully Updated!");
    res.redirect(`/listings/${id}`);
}));
//delete route
router.delete("/:id", isLoggedIn, wrapAsync (async (req,res) =>{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing succesfully Deleted!");
    res.redirect("/listings");
}));

module.exports = router;

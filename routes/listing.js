const express =  require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js"); 
const listingsController = require("../controllers/listings.js");

// index route
router.get("/", wrapAsync(listingsController.index));

//new route
router.get("/new" , isLoggedIn, listingsController.renderNewForm);

//show route

router.get("/:id", wrapAsync(listingsController.showListing));

//create route
router.post("/", isLoggedIn, validateListing, wrapAsync(listingsController.createListing));

//edit route
router.get("/:id/edit", isLoggedIn , wrapAsync(listingsController.renderEditForm));

//update route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingsController.updateListing));

//delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync (listingsController.destroyListing));

module.exports = router;

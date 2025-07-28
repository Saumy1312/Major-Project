const express =  require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js"); 
const listingsController = require("../controllers/listings.js");


router
.route("/")
.get(wrapAsync(listingsController.index))
.post(isLoggedIn, validateListing, wrapAsync(listingsController.createListing)
);

//new route
router.get("/new" , isLoggedIn, listingsController.renderNewForm);

router
.route("/:id")
.get(wrapAsync(listingsController.showListing))
.put(isLoggedIn, isOwner, validateListing, wrapAsync(listingsController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync (listingsController.destroyListing));

//edit route
router.get("/:id/edit", isLoggedIn , wrapAsync(listingsController.renderEditForm));

module.exports = router;

const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// index route
module.exports.index = async (req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings})
    };

//new route
module.exports.renderNewForm = (req, res) =>  {
    res.render("listings/new.ejs")
    };

//show route

module.exports.showListing = async (req,res) =>  {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    })
    .populate("owner");
    if(!listing) {
    req.flash("error", "Listing does not exist!");
    res.redirect("/listings");
    }
    else {
    res.render("listings/show.ejs", {listing})
    }};

//create route
module.exports.createListing = async (req, res) => {
  let response = await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1,
})
  .send();
  

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // Associate the listing with the logged-in user
    newListing.image = {url , filename};
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "Listing created successfully!");
    res.redirect("/listings");
};

//edit route
module.exports.renderEditForm = async (req,res) => {
    let { id } = req.params;
    
    const listing = await Listing.findById(id);
    req.flash("success", "Listing succesfully Updated!");
    if(!listing) {
    req.flash("error", "Listing does not exist!");
    res.redirect("/listings");
    }
    
    else {
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_180,w_250");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
}};

//update route
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url , filename};
    await listing.save();
    }
    req.flash("success", "Listing succesfully Updated!");
    res.redirect(`/listings/${id}`);
};

//delete route
module.exports.destroyListing = async (req,res) =>{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing succesfully Deleted!");
    res.redirect("/listings");
};
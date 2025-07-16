const express = require("express");
const app = express();
const mongoose =  require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const Review = require("./models/review.js");
const { reviewSchema } = require("./schema.js");


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodoverride("_method"));
app.engine("ejs", ejsMate); 
app.use(express.static(path.join(__dirname,"/public")));


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main().then(() => {
    console.log("connected to database")
})
.catch(err => console.log(err));

app.get("/", (req,res) => {
    res.send("root working")
});

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

// Middleware to validate review data
const validateReview = (req, res, next) => {
    if (!req.body || !req.body.review) {
        throw new ExpressError(400, "Review data is required");
    }
    
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};




// app.get("/testing", async (req, res) => {
//     let samplelisting = new Listing({
//         title: "my new villa",
//         description: "home",
//         price: 2222,
//         location: "Varanasi Uttar Pradesh",
//         country: "India",
//     });
//     await samplelisting.save();
//     console.log("sample was saved");
//     res.send("sussess");

// });



app.get("/listings", wrapAsync(async (req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings})
    }));

app.get("/listings/new" , wrapAsync(async (req,res) =>  {
    res.render("listings/new.ejs")
    }));

//show route

app.get("/listings/:id", wrapAsync(async (req,res) =>  {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing})
    }));

  
//create route
app.post("/listings", validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

app.get("/listings/:id/edit", wrapAsync( async (req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing})
}));

//update route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));
//delete route
app.delete("/listings/:id", wrapAsync (async (req,res) =>{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));


//post route for reviews
app.post("/listings/:id/reviews", validateReview, wrapAsync (async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();  
    res.redirect(`/listings/${id}`);
}));


app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { statusCode, message });
});
 

app.listen(8080, () => {
    console.log("server is working at port 8080");
});



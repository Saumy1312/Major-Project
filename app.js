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


app.use(express.urlencoded({extended: true}));
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

app.get("/listings/:id", wrapAsync(async (req,res) =>  {
    let { id } = req.params;
    const listing = await Listing.findById(id);
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


app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.render("error.ejs", { statusCode, message });
});
 

app.listen(8080, () => {
    console.log("server is working at port 8080");
});



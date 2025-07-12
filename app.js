const express = require("express");
const app = express();
const mongoose =  require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
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

app.get("/listings", async (req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings})
    });

app.get("/listings/new" ,async (req,res) =>  {
    res.render("listings/new.ejs")
    });

app.get("/listings/:id", async (req,res) =>  {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing})
    });

app.post("/listings", async (req,res) => {
    const newListing = new Listing(req.body.Listing);
    await newListing.save();
    res.redirect("/listings");
    console.log(newListing);
})

app.get("/listings/:id/edit", async (req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing})
})

//update route
app.put("/listings/:id" , async (req,res)=>{
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.Listing});
    res.redirect(`/listings/${id}`);
} )
//delete route
app.delete("/listings/:id", async (req,res) =>{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});






app.listen(8080, () => {
    console.log("server is working at port 8080");
});



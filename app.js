const express = require("express");
const app = express();
const mongoose =  require("mongoose");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash =  require("connect-flash");



const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodoverride("_method"));
app.engine("ejs", ejsMate); 
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    },
};

app.use(session(sessionOptions));
app.use(flash());

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
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    console.log(res.locals.success);
    res.locals.error = req.flash("error");
    console.log(res.locals.error);
    next();
});
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


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



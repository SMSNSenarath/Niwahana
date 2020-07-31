const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
var cors = require("cors");

const workers = require("./routes/workers");
const hirers = require("./routes/hirers");
const works = require("./routes/works");
const admin = require("./routes/admin");

const app = express();

app.use("/admin", admin);

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
// DB Config
const db = require("./config/keys").mongoURI;
// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
require("./config/password2")(passport);

app.use(cors());

//making Uploads folder public
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/workers", workers);
app.use("/hirers", hirers);
app.use("/works", works);

const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));

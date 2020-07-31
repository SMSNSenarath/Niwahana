const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
// Load Hirer model
const Hirer = require("../models/hirer.model");

// @route POST hirers/register
// @desc Register hirer
// @access Public
router.post("/register", (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  Hirer.findOne({ phone: req.body.phone }).then((hirer) => {
    if (hirer) {
      return res.status(400).json({ phone: "Phone already exists" });
    } else {
      const newHirer = new Hirer({
        name: req.body.name,
        phone: req.body.phone,
        password: req.body.password,
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newHirer.password, salt, (err, hash) => {
          if (err) throw err;
          newHirer.password = hash;
          newHirer
            .save()
            .then((hirer) => res.json(hirer))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route POST hirers/login
// @desc Login hirer and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const phone = req.body.phone;
  const password = req.body.password;
  // Find hirer by phone
  Hirer.findOne({ phone }).then((hirer) => {
    // Check if hirer exists
    if (!hirer) {
      return res.status(404).json({ phonenotfound: "Phone not found" });
    }
    // Check password
    bcrypt.compare(password, hirer.password).then((isMatch) => {
      if (isMatch) {
        // Hirer matched
        // Create JWT Payload
        const payload = {
          id: hirer.id,
          name: hirer.name,
        };
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

module.exports = router;

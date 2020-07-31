const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
// Load Worker model
const Worker = require("../models/worker.model");

// @route POST workers/register
// @desc Register Worker
// @access Public
router.post("/register", (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  Worker.findOne({ phone: req.body.phone }).then((worker) => {
    if (worker) {
      return res.status(400).json({ phone: "Phone Number already exists" });
    } else {
      const newWorker = new Worker({
        name: req.body.name,
        phone: req.body.phone,
        password: req.body.password,
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newWorker.password, salt, (err, hash) => {
          if (err) throw err;
          newWorker.password = hash;
          newWorker
            .save()
            .then((worker) => res.json(worker))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route POST workers/login
// @desc Login worker and return JWT token
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
  // Find worker by phone
  Worker.findOne({ phone }).then((worker) => {
    // Check if worker exists
    if (!worker) {
      return res
        .status(404)
        .json({ phonenotfound: "No Account exist for this Mobile" });
    }
    // Check password
    bcrypt.compare(password, worker.password).then((isMatch) => {
      if (isMatch) {
        // Worker matched
        // Create JWT Payload
        const payload = {
          id: worker.id,
          name: worker.name,
          phone: worker.phone,
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

const express = require("express");
const router = express.Router();
const Controller = require('../controllers/controller');
const checkAuth = require('../middleware/check-auth');

router.post("/signup", Controller.user_signup);

router.post("/login", Controller.user_login);

module.exports = router;
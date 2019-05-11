const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const Controller = require('../controllers/controller');

router.get("/", checkAuth, Controller.artists_get_all);

router.get("/:artistId", checkAuth, Controller.artists_get_artist);

module.exports = router;
const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const Controller = require('../controllers/controller');

router.get("/", checkAuth, Controller.tracks_get_all);

router.get("/:trackId", checkAuth, Controller.tracks_get_track);

router.post("/:trackId", checkAuth, Controller.tracks_update_track);

router.delete("/:trackId", checkAuth, Controller.tracks_delete);

module.exports = router;
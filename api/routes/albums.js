const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const Controller = require('../controllers/controller');

router.get("/", checkAuth, Controller.albums_get_all);

router.get("/:albumId", checkAuth, Controller.albums_get_album);

router.post("/:albumId", checkAuth, Controller.albums_update_album);

router.delete("/:albumId", checkAuth, Controller.albums_delete_album);

module.exports = router;
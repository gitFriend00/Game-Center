const express = require("express");
const router = express.Router();

const { getSpecificUser } = require("../controllers/UserController");

router.get("/getSpecificUser/:UserName/:Password", getSpecificUser);

module.exports = router;

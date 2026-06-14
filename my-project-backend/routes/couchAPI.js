const express = require("express");
const router = express.Router();

const { getSpecificUser, createUser } = require("../controllers/UserController");

router.get("/getSpecificUser/:UserName/:Password", getSpecificUser);
router.post("/createUser", createUser);

module.exports = router;

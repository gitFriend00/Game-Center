const express = require("express");
const router = express.Router();

const { getSpecificEmployee } = require("../controllers/EmployeesController");

router.get("/getSpecificEmployee/:EmployeeCode/:Password", getSpecificEmployee);

module.exports = router;

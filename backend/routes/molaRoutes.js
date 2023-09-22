const express = require("express");
const router = express.Router();
const {
    getMola,
    createMola,
    getYears,
} = require("../controllers/molaController");

router.route("/").post(createMola);
router.route("/all/").get(getMola);
router.route("/years/").get(getYears);


module.exports = router;
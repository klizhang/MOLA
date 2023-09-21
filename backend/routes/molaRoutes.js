const express = require("express");
const router = express.Router();
const {
    getMola,
    createContact,
    getContact,
    updateContact,
    deleteContact,
    getYears,
} = require("../controllers/molaController");

// router.route("/").get(getContacts).post(createContact);
router.route("/").post(createContact);
router.route("/allcontacts/").get(getMola);
router.route("/years/").get(getYears);
router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);

module.exports = router;
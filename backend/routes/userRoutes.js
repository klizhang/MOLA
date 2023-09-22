const express = require("express");
const { registerUser, loginUser, checkAdmin, allUser, changePassword, deleteUser, promoteAdmin, demoteAdmin } = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/all", allUser);

router.get("/admin/:email", checkAdmin);

router.post("/change_password", changePassword);

router.post("/delete_user", deleteUser);

router.post("/promote_admin",promoteAdmin);

router.post("/demote_admin",demoteAdmin);


module.exports = router;
const express = require("express");
const router = express.Router();

const userController = require("../controllers/userControllers");

router.post("/sign-up", userController.signUp)
router.post("/sign-in", userController.login)
router.post("/add-invite-user", userController.addInviteUser)
router.post("/edit-user", userController.editUser);
router.post("/delete-user", userController.deleteUser)
router.post("/complete-invite-signup", userController.completeInviteSignUp)
router.get("/get-all-users-organisation", userController.getAllUsers)

module.exports = router;
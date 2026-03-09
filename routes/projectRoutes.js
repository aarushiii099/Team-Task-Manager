const express = require("express");
const router = express.Router();

const projectController = require("../controllers/projectControllers");

router.post("/create-project", projectController.createProject)
router.post("/get-projects-list", projectController.getProjectsList)
router.get("/get-project-details", projectController.getProjectDetails)


module.exports = router;
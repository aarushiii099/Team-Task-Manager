const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskControllers")

router.post("/add-task", taskController.addTask);
router.get("/get-project-members", taskController.getProjectMembers);
router.post("/get-tasks-list-filtered", taskController.getTaskListFiltered)
router.get("/get-all-tasks-project", taskController.getAllTasksProject)


module.exports = router;
const Task = require("../models/task");
const Project = require("../models/project")

const getProjectMembers = async (req, res) => {

    try{

        const projectId = req.query.projectId;

        const projectMembersEligibleForTask = await Project.findById(projectId).select(["assignTo", "shareWith"]);

        const members = [...new Set([...projectMembersEligibleForTask.assignTo, ...projectMembersEligibleForTask.shareWith])]

        res.status(200).send(members)

    }

    catch(error){

        res.status(400).send({message: error.message, stack: error.stack})

    }
}

const addTask = async (req, res) => {

    try{

        const payload = req.body;

        const task = {

            taskName: payload.taskName,
            description: payload.description,
            projectId: payload.projectId,
            projectName: payload.projectName,
            organisationName: payload.organisationName,
            assignTo: payload.assignTo,
            status: payload.status,
            typeTask: payload.typeTask,
            priority: payload.priority,
            dueDate: payload.dueDate

        }

        const newTask = new Task(task);
        const savedTask = await newTask.save();

        res.status(200).send(savedTask);

    }

    catch(error){
        res.status(400).send({message: error.message, stack: error.stack})
    }
}

const getTaskListFiltered = async (req, res) => {

    try{

        const payload = req.body;

        const criteria = {

            projectId: payload.projectId,
            status: payload.status,
            priority: payload.priority,
            dueDate: { $lte: payload.dueBefore},
            assignTo: { $in: payload.assignTo}

        }

        const tasks = await Task.find(criteria);

        res.status(200).send(tasks)

    }

    catch(error){
        res.status(400).send({message: error.message, stack: error.stack})
    }
}

const getAllTasksProject = async (req, res) => {


    try{

        const projectId = req.query.projectId;
        const tasks = await Task.find({ projectId: projectId}).select(["taskName", "status", "priority", "dueDate"]);

        res.status(200).send(tasks)

    }

    catch(error){
        res.status(400).send({ message: error.message, stack: error.stack})
    }
}

module.exports = {

    addTask,
    getProjectMembers,
    getTaskListFiltered,
    getAllTasksProject

}
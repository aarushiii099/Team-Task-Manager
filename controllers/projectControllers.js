const Project = require("../models/project");
const Task = require("../models/task");

const createProject = async (req, res) => {

    try{

        const payload = req.body;

        const project = new Project(payload);//name, desc, assignTo
        const savedProject = await project.save();

        res.status(200).send(savedProject)

    }

    catch(error){
        res.status(400).send({message: error.message, stack: error.stack})
    }
}

const getProjectsList = async (req, res) => {

    try{

        const organisationName = req.body.organisationName;
        const userId = req.query.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const criteria = {

            organisationName: organisationName,
            $or: [
                {createdBy: userId},
                {assignTo: userId},
                {shareWith: userId}
            ],
            isDeleted: false
        }

        const projectList = await Project.find(criteria)
        .select(["projectName", "description", "assignTo", "organisationName"])
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit).limit(limit);
        res.status(200).send(users);;
        res.status(200).send(projectList);

    }

    catch(error){
        res.status(400).send({message: error.message, stack: error.stack})
    }
}

const getProjectDetails = async (req, res) => {

    try{

        const projectId = req.query.projectId;

        const projectDetails = await Project.findById(projectId).select(["projectName", "description", "assignTo", "createdBy"]);


        const tasks = await Task.find({ projectId: projectId}).select(["taskName", "assignTo", "status", "priority", "dueDate"]);
        console.log("tasks", tasks)

        projectDetails.tasks = tasks;
         
        res.status(200).send(projectDetails)

    }

    catch(error){
        res.status(400).send({ message: error.message, stack: error.stack})
    }
}

module.exports = {

    createProject,
    getProjectsList,
    getProjectDetails

}
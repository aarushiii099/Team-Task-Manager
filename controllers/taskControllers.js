const Task = require("../models/task");
const Project = require("../models/project");
const task = require("../models/task");

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

const getDashboardOverview = async (req, res) => {

    try{

        const userId = req.body.userId;
        const organisationName = req.body.organisationName;

        const projectCount = await Project.find({ assignTo: userId, organisationName: organisationName, isDeleted: false}).countDocuments();
        const taskCount = await Task.find({ assignTo: userId, organisationName: organisationName, isDeleted: false}).countDocuments();
        const taskCompletedCount = await Task.find({ assignTo: userId, organisationName: organisationName, isDeleted: false, status: 3}).countDocuments();

        const tasks = await Task.aggregate([
            {
                $match: {
                    assignTo: userId,
                    organisationName: organisationName
                }

            },
            {
                $group: {
                    "_id": "$typeTask",
                    "count": { $sum: 1}
                }
            }
        ])

        const overDueCount = await Task.find({ 

            assignTo: userId, 
            isDeleted: false, 
            organisationName: organisationName,
            dueDate: { $lt: new Date()},
            status: { $ne: 3}
        
        }).countDocuments();

        const dataDashboard = {

            projectCount: projectCount,
            taskCount: taskCount,
            taskCompletedCount: taskCompletedCount,
            ToDo: 0,
            InProgress: 0,
            Done: 0,
            OverDue: 0
        }

        tasks.forEach( t => {

            // console.log("typeTask", t._id)

            dataDashboard[t._id] = t.count;

        })

        dataDashboard.OverDue = overDueCount;

        res.status(200).send(dataDashboard)

    }

    catch(error){
        res.status(400).send({ message: error.message, stack: error.stack})
    }
}

const getAnalyticsDashboard = async (req, res) => {

    try{

        const projectId = req.query.projectId;

        const tasks = await Task.find({ projectId: projectId})

        const taskCount = tasks.length;
        const ToDoCount = tasks.filter( t => t.status == 1).length;
        const InProgressCount = tasks.filter( t => t.status == 2).length;
        const DoneCount = tasks.filter( t => t.status == 3).length;

        const lowPriority = tasks.filter( t => t.priority == 1).length;
        const mediumPriority = tasks.filter( t => t.priority == 2).length;
        const highPriority = tasks.filter( t => t.priority == 3).length;

        const analyticsData = {

            Summary : {

                taskCount: taskCount,
                ToDoCount: ToDoCount,
                InProgressCount: InProgressCount,
                DoneCount: DoneCount
            },

            StatusDistribution: {

                ToDoCount: ToDoCount,
                InProgressCount: InProgressCount,
                DoneCount: DoneCount
            },
            
            PriorityDistribution: {

                lowPriorityCount: lowPriority,
                mediumPriorityCount: mediumPriority,
                highPriorityCount: highPriority
            }

        }

        res.status(200).send(analyticsData);

    }

    catch(error){
        res.status(400).send({ message: error.message, stack: error.stack})
    }
}

module.exports = {

    addTask,
    getProjectMembers,
    getTaskListFiltered,
    getAllTasksProject,
    getDashboardOverview,
    getAnalyticsDashboard

}
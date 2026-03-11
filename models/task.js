const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var taskSchema = new mongoose.Schema({

    taskName: { type: String},
    description: { type: String},
    projectId: { type: Schema.ObjectId, ref: "project"},
    projectName: { type: String},
    organisationName: { type: String},
    assignTo: [{ type: String}],
    status: { type: Number}, // 1 for ToDo, 2 for InProgress, 3 for Done
    typeTask : { type: String},
    priority: { type: Number}, //1 for low, 2 for medium, 3 for high
    dueDate: { type: Date},
    isDeleted: {type: Boolean, default: false}
    },
{ timestamps: true }
)

module.exports = mongoose.model("task", taskSchema)
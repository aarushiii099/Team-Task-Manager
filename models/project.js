const mongoose = require("mongoose");

var projectSchema = new mongoose.Schema({

    projectName: { type: String},
    description: { type: String},
    assignTo: [{ type: String}],
    shareWith: [{ type: String}],
    organisationName: { type: String},
    createdBy: { type: String},//will store userId
    createdAt: { type: Date},
    isDeleted: { type: Boolean, default: false}
    },
{ timestamps: true }

)

module.exports = mongoose.model("project", projectSchema)
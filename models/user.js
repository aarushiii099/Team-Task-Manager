const mongoose = require("mongoose");
const schema = mongoose.Schema;

var userSchema = new mongoose.Schema({

    name: { type: String},
    email: { type: String},
    password: { type: String},
    role: {type: String},
    organisationName: { type: String},
    isDeleted: { type: Boolean, default: false},
    isActive: { type: Boolean, default: false},
    inviteToken: { type: String, default: null},
    inviteExpires: { type: Date}
    },
{ timestamps: true }

)

module.exports = mongoose.model("user", userSchema)
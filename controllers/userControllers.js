const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const privateKey = "jamesBond";
const User = require("../models/user");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const signUp = async (req, res) => {

    try{

        const payload = req.body;
        const user = await User.findOne({email: payload.email})

        if(user){
            res.status(404).send("User already exists")
        }

        else{

            const hashedPassword = await bcrypt.hash(payload.password, 5);

            const userData = {

                name: payload.name,
                email: payload.email,
                password: hashedPassword,
                organisationName: payload.organisationName,
                role: payload.role,
                isActive: true                             
            }

            const user = new User(userData);
            const savedUser = await user.save();

            res.status(200).send(savedUser)
        }
    }

    catch(error){
        res.status(400).send({message: error.message, stack: error.stack})
    }
}


const login = async (req, res) => {

    try{

        const payload = req.body;
        const user = await User.findOne({email: payload.email})

        if(user){

            const comparePassword = bcrypt.compare(user.password, payload.password);
            
            if(comparePassword){

                const generatedToken = jwt.sign({ email: user.email}, privateKey, {
                    expiresIn: "72h",
                    algorithm: "HS512",
                    issuer: "aarushi"
                })

                res.status(200).send({
                    userId: user._id,
                    userName: user.name,
                    email: user.email,
                    message: "Login Sucessfull!",
                    token: generatedToken
                })

            }
            else{
                res.status(404).send("Incorrect password. Login again.")
            }


        }
        else{
            res.status(404).send("User doesn't exist in the databse. Please register!")
        }
    }

    catch(error){
        res.status(400).send({message: error.message, stack: error.stack})
    }
}

const editUser = async (req, res) => {

    try{

        const payload = req.body;
        const userId = req.query.userId;

        const updatedUser = await User.findByIdAndUpdate(userId, payload, {new: true})
        res.status(200).send(updatedUser);

    }

    catch(error){

        res.status(400).send({message: error.message, stack: error.stack})
    }
}

const deleteUser = async (req, res) => {

    try{

        const userId = req.query.userId;
        const deletedUser = await User.findByIdAndUpdate(userId, {isDeleted: true}, {new: true});

        res.status(200).send("User has been deleted!")

    }

    catch(error){

        res.status(400).send({message: error.message, stack: error.stack})
    }
}

const addInviteUser = async (req, res) => {

    try{

        const payload = req.body;

        const user = await User.findOne({ email: payload.email})

        if(user){

            res.status(404).send("User already exists!")

        } 

        const inviteToken = crypto.randomBytes(32).toString("hex");
        const inviteExpires = Date.now() + (24 * 60 * 60 * 1000) // 24 hours


        const userData = {
            
            name: payload.name,
            email: payload.email,
            role: payload.role,
            isActive: false,
            organisationName: payload.organisationName,
            inviteToken: inviteToken,
            inviteExpires: inviteExpires

        }

        const newUser = new User(userData);
        const savedNewUser = await newUser.save();

        const inviteLink = `https://yourfrontend.com/signup?token=${inviteToken}`;

        const transporter = nodemailer.createTransport({

          service: "gmail",
          auth: {
           user: process.env.EMAIL_USER,
           pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({


          from: process.env.EMAIL_USER,
          to: payload.email,

          subject: `You're invited to join the organisation ${payload.organisationName} `,

          html: `

           <h3>You have been invited</h3>

           <p>Click the link below to complete signup:</p>

           <a href="${inviteLink}">Complete Signup</a>
        `
        })

        res.status(200).send({message: "Mail sent successfully!", data: savedNewUser})

    }

    catch(error){
        res.status(400).send({message: error.message, stack: error.stack})
    }
}

const completeInviteSignUp = async (req, res) => {

    try{

        const inviteToken = req.body.inviteToken;
        const password = req.body.password;

        const user = await User.findOne({ inviteToken: inviteToken, inviteExpires: { $gt: Date.now()}})
        

        if(!user){
            return res.status(404).send("Invalid Invite Token or token expired.")
        }

        const userId = user._id;
        const hashedPassword = await bcrypt.hash(password, 5);

        const updatedUserStatus = {

            password: hashedPassword,
            isActive: true,
            inviteToken: null,
            inviteExpires: null

        }

        const signedUpUserUpdated = await User.findByIdAndUpdate(userId, updatedUserStatus, {new: true})

        res.status(200).send(signedUpUserUpdated)

    }

    catch(error){
        res.status(400).send({message: error.message, stack: error.stack})
    }
}

const getAllUsers = async (req, res) => {

    try{

        const organisationName = req.body.organisationName;

        const users = await User.find({organisationName: organisationName, isActive: true, isDeleted: false}).select(["name", "email", "role"])
        res.status(200).send(users)

    }

    catch(error){
        res.status(400).send({ message: error.message, stack: error.stack})
    }
}

module.exports = {

    signUp,
    editUser,
    deleteUser,
    login,
    addInviteUser,
    completeInviteSignUp,
    getAllUsers

}
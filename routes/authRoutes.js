const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
const bcrypt = require('bcryptjs');

const JWT_SECRET = 'RohitIsAGee$k';

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required

router.post('/createuser', [
    body('userName', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // Check whether the user with this email exists already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exists" })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        // Create a new user
        user = await User.create({
            organisation: req.body.organisation,
            userName: req.body.userName,
            password: secPass,
            email: req.body.email,
        });

        if (req.body.accepted === "Accepted") {
            user = await User.findByIdAndUpdate({ _id: user.id }, { accepted: "Accepted" }, (err, res) => {
                console.log(res);
            })
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ success: true, authtoken })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    let access = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });


        if (!user) {
            access = false
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }
        console.log(user)

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success = false
            return res.status(400).json({ success, error: "Please try to login with correct credentials" });
        }
        if (user.accepted === 'Accepted') {
            const data = {
                user: {
                    id: user.id
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET);

            access = true;
            const organisation = user.organisation;
            res.json({ access, authtoken, organisation })

        }
        else {
            access = "Forbidden";
            return res.status(400).json({ access, error: "Please wait for Admin to Authenticate" })
        }



    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }


});

// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {

    try {
        const userId = req.user.id;
        const user = await User.findById(userId)//.select("-password")
        res.send(user)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 4: Update loggedin User Details using: POST "/api/auth/updateuser". Login required
router.post('/updateuser', fetchuser, async (req, res) => {
    //find by id and delete user
    const userId = req.user.id;
    const user = await User.findById(userId)



    const { userName, email, password, description, phoneNo, gender, qualification, cgpa, prevWork, dob, organisation, lookingForJob } = req.body;
    const newObject = {}

    if (userName !== user.userName) newObject.userName = userName;
    if (email !== user.email) newObject.email = email;
    if (description !== user.description) newObject.description = description;
    if (phoneNo !== user.phoneNo) newObject.phoneNo = phoneNo;
    if (gender !== user.gender) newObject.gender = gender;
    if (qualification !== user.qualification) newObject.qualification = qualification;
    if (cgpa !== user.cgpa) newObject.cgpa = cgpa;
    if (prevWork !== user.prevWork) newObject.prevWork = prevWork;
    if (dob !== user.dob) newObject.dob = dob;
    if (organisation !== user.organisation) newObject.organisation = organisation;
    if (lookingForJob !== user.lookingForJob) newObject.lookingForJob = lookingForJob;

    const note = await User.findByIdAndUpdate(userId, { $set: newObject }, { new: true })
    console.log(note)

    //Create user with new details
    res.send({ obj: "value" })
})

router.post('/profile', async (req, res) => {

    try {
        const userId = req.header('userId');
        const user = await User.findById(userId).select("-password")

        res.send(user)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router


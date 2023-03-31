const express = require("express");
const { findById } = require("../models/Events");
const Events = require('../models/Events');
const Notices = require('../models/Notices');
const Users = require('../models/User');
const router = express.Router();

router.post("/newEvent", (req, res) => {
    try {
        console.log(req.body);
        const { title, description, url } = req.body
        Events.create({
            title, description, url
        }, (err, res) => {
            if (err) console.log(err)
            else console.log("Added Successfully")
        })
        res.send("Success")

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})

router.post("/newNotice", (req, res) => {
    try {
        console.log(req.body);
        const { title, description } = req.body
        Notices.create({
            title, description
        }, (err, res) => {
            if (err) console.log(err)
            else console.log("Added Successfully")
        })
        res.send("Success")

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})

router.get("/getEvents", (req, res) => {
    try {
        const events = Events.find((err, data) => {
            if (err) console.log(err)
            else {
                res.json(data)
            }
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.get("/getNotices", (req, res) => {
    try {
        const notices = Notices.find((err, data) => {
            if (err) console.log(err)
            else {
                res.json(data)
            }
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.get("/getNewUsers", (req, res) => {
    try {
        var arr = [];
        const users = Users.find({accepted:"Not Accepted"},(err, data) => {
            if (err) console.log(err)
            else {
                data.forEach((dataPoint) => {
                    if (dataPoint.organisation !== "college") {
                        arr.push(dataPoint)
                    }
                })
                res.json(arr)
            }
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post('/acceptNewRequests', async (req, res) => {
    const userId = req.body.id;
    console.log(userId)
    const user = await Users.findByIdAndUpdate({ _id: userId }, { accepted: 'Accepted' },(err, data)=> {
            if (err) {
                console.log(err)
            }
        }
    );
    res.send("Accepted User")

})
router.post('/rejectNewRequests', async (req, res) => {
    const userId = req.body.id;

    const user = await Users.findByIdAndDelete({ _id: userId });
    
    res.send("Rejected Successfully")

})
router.post('/deleteNotices', async (req, res) => {
    const noticeId = req.body.id;

    const notice = await Notices.findByIdAndDelete({ _id: noticeId });
    
    res.send("Deleted Successfully")

})
router.post('/deleteEvents', async (req, res) => {
    const eventId = req.body.id;

    const event = await Events.findByIdAndDelete({ _id: eventId });
    
    res.send("Deleted Successfully")

})

router.get("/getAlumni", (req, res) => {
    try {
        var arr = [];
        const users = Users.find({accepted:"Accepted"},(err, data) => {
            if (err) console.log(err)
            else {
                data.forEach((dataPoint) => {
                    if (dataPoint.organisation !== "college" && dataPoint.organisation !== "Company") {
                        arr.push(dataPoint)
                    }
                })
                res.json(arr)
            }
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


module.exports = router
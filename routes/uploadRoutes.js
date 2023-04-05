const express = require('express');
const router = express.Router();
const multer = require('multer');
const fetchuser = require('../middleware/fetchuser');
const User = require('../models/User');




router.post('/resume', fetchuser, async (req, res, err) => {
    var storage = multer.diskStorage({
        //destination: "uploads/resume",
        destination:"uploads/resume",
        filename: (req, file, cb) => {
            cb(null,
                file.fieldname + "_" + Date.now() + file.originalname);
        }
    });
    const upload = multer({ storage }).single("resume");
    const userId = req.user.id;


    await upload(req, res, function (err) {
        if (!req.file) {
            return res.send('please select a resume to upload')
        }
        else if (err instanceof multer.MulterError) {
            console.log("Here1")
            return res.send(err)
        }
        else if (err) {
            console.log("Here2")
            return res.send(err)
        }
        else {
            User.findByIdAndUpdate(userId, { resume: req.file.path },{new:true}, (err, res) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log(res)
                }
            });
            console.log(req.file.filename)
            return res.send(req.file)
        }
    })


})
router.post('/profileImg', fetchuser, async (req, res, err) => {
    var storage = multer.diskStorage({
        destination: "uploads/profileImg",
        filename: (req, file, cb) => {
            cb(null, file.fieldname + "_" + Date.now() + file.originalname);
        }
    });
    const upload = multer({ storage }).single("profileImage");
    const userId = req.user.id;

    await upload(req, res, function (err) {
        if (!req.file) {
            return res.send('please select an image to upload')
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err)
        }
        else if (err) {
            return res.send(err)
        }
        else {
            User.findByIdAndUpdate(userId, { profileImage: req.file.path }, (err, res) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log(res)
                }
            });
            console.log(req.file)

            return res.send(req.file)
        }

    })

})

module.exports = router;
const router = require('express').Router();
const verify = require('./verifyToken');
var path = require('path');

router.get('/home',verify, (req,res) => {
    res.sendFile(path.join(__dirname, '../', 'home.html'));
})

router.get('/contact',verify, (req,res) => {
    res.sendFile(path.join(__dirname, '../', 'contact.html'));
})

router.get('/resume',verify, (req,res) => {
    res.sendFile(path.join(__dirname, '../', 'resume.html'));
})

router.get('/pdf',verify, (req,res) => {
    res.sendFile(path.join(__dirname, '../', 'edited_resume.pdf'));
})

module.exports = router;
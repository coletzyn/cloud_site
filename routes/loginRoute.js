const router = require('express').Router();
var path = require('path');

router.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '../', 'login.html'));
})

router.get('/register.html', (req,res) => {
    res.sendFile(path.join(__dirname, '../', 'register.html'));

})

router.get('/success.html', (req,res) => {
    res.sendFile(path.join(__dirname, '../', 'success.html'));

})

module.exports = router;

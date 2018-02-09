var express = require('express');
var router = express.Router();
var token = require('../controllers/TokenController');

router.use(token.verify);

router.get('/', function(req, res) {
    res.send('All route under /loginOnly require login');
});

router.get('/test', function(req, res) {
    res.send('All route under /loginOnly require login');
});

module.exports = router;

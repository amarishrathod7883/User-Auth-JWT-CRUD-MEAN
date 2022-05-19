var express = require('express');
var router = express.Router();

router.use('/api/auth', require('../controllers/auth.controller'));
router.use('/api/users', require('../controllers/user.controller'));

module.exports = router;
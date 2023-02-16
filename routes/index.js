const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controllers');


router.get('/', homeController.home);
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));
router.use('/likes', require('./likes'));
router.use('/forgot', require('./password_reset'));

// api 
router.use('/api', require('./api'))


module.exports = router;
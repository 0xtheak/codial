const express = require('express');
const router = express.Router();
const passport = require('passport');
const commentControllers = require('../controllers/comments_controller');

router.post('/create', passport.checkAuthentication, commentControllers.comment);
router.get('/destroy/:id', passport.checkAuthentication, commentControllers.destroy);

module.exports = router;
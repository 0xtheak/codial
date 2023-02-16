const express = require('express');
const router = express.Router();
const passwordResetController = require('../controllers/password_reset_controller');

router.get('/password', passwordResetController.resetPage);
router.post('/password', passwordResetController.resetPassword);


module.exports = router;
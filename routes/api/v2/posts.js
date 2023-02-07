const express = require('express');
const router = express.Router();
const postApi = require('../../../controllers/api/v2/posts');

router.get('/', postApi.index);

module.exports = router;
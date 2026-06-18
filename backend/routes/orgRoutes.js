const express = require('express');

const router = express.Router();

const orgController = require('../controllers/orgController');

router.get('/org/summary', orgController.getSummary);

module.exports = router;
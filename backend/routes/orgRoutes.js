const express = require('express');

const router = express.Router();

const orgController = require('../controllers/orgController');

router.get('/org/summary', orgController.getSummary);

router.get(
    '/org/relationships',
    orgController.getRelationshipSummary
);

module.exports = router;
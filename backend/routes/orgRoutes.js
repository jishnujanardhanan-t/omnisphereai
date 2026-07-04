const express = require('express');

const router = express.Router();

const orgController = require('../controllers/orgController');

router.get(
    '/org/summary',
    orgController.getSummary
);

router.get(
    '/org/relationships',
    orgController.getRelationshipSummary
);

router.get(
    '/org/risk-report',
    orgController.getRiskReport
);

router.get(
    '/org/architecture-score',
    orgController.getArchitectureScore
);

module.exports = router;
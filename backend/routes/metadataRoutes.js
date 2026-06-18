const express = require('express');
const router = express.Router();

const metadataController = require('../controllers/metadataController');

router.get('/metadata/objects', metadataController.getObjects);

router.get(
    '/metadata/object/:name',
    metadataController.getObjectDetails
);

router.get(
    '/metadata/object/:name/analysis',
    metadataController.analyzeObject
);

router.get(
    '/metadata/object/:name/recommendations',
    metadataController.getRecommendations
);

router.get(
    '/metadata/object/:name/relationships',
    metadataController.getRelationships
);

module.exports = router;
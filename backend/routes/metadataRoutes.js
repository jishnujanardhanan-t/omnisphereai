const express = require('express');
const router = express.Router();

const metadataController = require('../controllers/metadataController');

router.get('/metadata/objects', metadataController.getObjects);

router.get(
    '/metadata/object/:name',
    metadataController.getObjectDetails
);

module.exports = router;
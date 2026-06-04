const express = require('express');
const router = express.Router();

const objectController = require('../controllers/objectController');

router.get('/health', objectController.healthCheck);
router.get('/objects', objectController.getAllObjects);
router.get('/objects/:name', objectController.getObjectByName);
router.get('/accounts', objectController.getAccounts);

module.exports = router;
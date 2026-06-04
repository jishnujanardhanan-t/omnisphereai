const salesforceService = require('../services/salesforceService');
const objectService = require('../services/objectService');

exports.healthCheck = (req, res) => {
    res.json({
        status: 'UP',
        application: 'OmniSphereAI Backend'
    });
};

exports.getAllObjects = (req, res) => {
    const data = objectService.getAllObjects();
    res.json(data);
};

exports.getObjectByName = (req, res) => {
    const name = req.params.name;
    const data = objectService.getObjectByName(name);

    if (!data) {
        return res.status(404).json({
            success: false,
            message: "Object not found"
        });
    }

    res.json({
        success: true,
        object: name,
        data
    });
};

exports.getAccounts = async (req, res) => {

    try {

        const result = await salesforceService.getAccounts();

        res.json(result);

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
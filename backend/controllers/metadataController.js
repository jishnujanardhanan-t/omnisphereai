const metadataService = require('../services/metadataService');

exports.getObjects = async (req, res) => {

    try {

        const result = await metadataService.getObjects();

        const objects = result.result.records
    .map(record => record.QualifiedApiName)
    .sort();

        res.json({
            success: true,
            count: objects.length,
            objects
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

exports.getObjectDetails = async (req, res) => {

    try {

        const objectName = req.params.name;

        const result =
            await metadataService.getObjectFields(objectName);

        const fields = result.result.records.map(record => ({
            name: record.QualifiedApiName,
            type: record.DataType
        }));

        res.json({
            success: true,
            object: objectName,
            fieldCount: fields.length,
            fields
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
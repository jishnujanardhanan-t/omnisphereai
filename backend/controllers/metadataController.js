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

exports.analyzeObject = async (req, res) => {

    try {

        const objectName = req.params.name;

        const result =
            await metadataService.getObjectFields(objectName);

        const fields = result.result.records;

        const customFieldCount =
            fields.filter(field =>
                field.QualifiedApiName.endsWith('__c')
            ).length;

        const standardFieldCount =
            fields.length - customFieldCount;

        const fieldTypes = {};

        fields.forEach(field => {

            const type = field.DataType;

            fieldTypes[type] =
                (fieldTypes[type] || 0) + 1;

        });

        res.json({
            success: true,
            object: objectName,
            fieldCount: fields.length,
            customFieldCount,
            standardFieldCount,
            fieldTypes
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
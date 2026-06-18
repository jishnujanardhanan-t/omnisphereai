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

exports.getRecommendations = async (req, res) => {

    try {

        const objectName = req.params.name;

        const result =
            await metadataService.getObjectFields(objectName);

        const fields = result.result.records;

        const recommendations = [];

        const customFields =
            fields.filter(field =>
                field.QualifiedApiName.endsWith('__c')
            );

        const picklists =
            fields.filter(field =>
                field.DataType.includes('Picklist')
            );

        if (fields.length > 40) {
            recommendations.push(
                'Object contains more than 40 fields. Consider reviewing complexity.'
            );
        }

        if (customFields.length > 0) {
            recommendations.push(
                `${customFields.length} custom fields detected. Ensure documentation is maintained.`
            );
        }

        if (picklists.length > 5) {
            recommendations.push(
                'Large number of picklist fields detected. Review picklist governance.'
            );
        }

        if (recommendations.length === 0) {
            recommendations.push(
                'No immediate metadata concerns detected.'
            );
        }

        res.json({
            success: true,
            object: objectName,
            recommendations
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

exports.getRelationships = async (req, res) => {

    try {

        const objectName = req.params.name;

        const result =
            await metadataService.getObjectFields(
                objectName
            );

        const fields =
            result.result.records;

        const relationships = fields.filter(field =>
        (
            field.DataType.includes('Lookup(') &&
            field.DataType !== 'Lookup()'
        ) ||
        field.DataType.includes('Hierarchy')
    );

        res.json({
    success: true,
    object: objectName,
    relationshipCount: relationships.length,
    relationships: relationships.map(
        relationship => {

            let relationshipType =
                relationship.DataType;

            let targetObject =
                'Unknown';

            if (
                relationship.DataType.startsWith(
                    'Lookup('
                )
            ) {

                relationshipType = 'Lookup';

                targetObject =
                    relationship.DataType
                        .replace('Lookup(', '')
                        .replace(')', '');

            } else if (
                relationship.DataType ===
                'Hierarchy'
            ) {

                relationshipType =
                    'Hierarchy';

                targetObject =
                    objectName;
            }

            return {
                field:
                    relationship.QualifiedApiName,
                relationshipType,
                targetObject
            };
        }
    )
});

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

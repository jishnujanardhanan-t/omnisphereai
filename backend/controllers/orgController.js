const metadataService = require('../services/metadataService');

exports.getSummary = async (req, res) => {

    try {

        const objectsResult = await metadataService.getObjects();

        const objects =
            objectsResult.result.records.slice(0, 20);

        let totalFieldCount = 0;

        let largestObject = {
            name: '',
            fieldCount: 0
        };

        for (const object of objects) {

            const objectName =
                object.QualifiedApiName;

            const fieldResult =
                await metadataService.getObjectFields(
                    objectName
                );

            const fieldCount =
                fieldResult.result.records.length;

            totalFieldCount += fieldCount;

            if (
                fieldCount >
                largestObject.fieldCount
            ) {
                largestObject = {
                    name: objectName,
                    fieldCount
                };
            }
        }

        const averageFieldsPerObject =
            Math.round(
                totalFieldCount / objects.length
            );

        let healthScore = 100;

        if (averageFieldsPerObject > 40) {
            healthScore -= 10;
        }

        const recommendations = [];

if (averageFieldsPerObject > 40) {
    recommendations.push(
        'Average field count is high. Review object complexity.'
    );
} else {
    recommendations.push(
        'Field complexity is within acceptable limits.'
    );
}

if (largestObject.fieldCount > 35) {
    recommendations.push(
        `${largestObject.name} has a high field count (${largestObject.fieldCount} fields).`
    );
}

        res.json({
    success: true,
    totalObjects: objectsResult.result.records.length,
    objectsAnalyzed: objects.length,
    analysisScope: 'First 20 objects',
    averageFieldsPerObject,
    largestObject,
    healthScore,
    recommendations
});

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

exports.getRelationshipSummary =
    async (req, res) => {

    try {

        const objectsResult =
            await metadataService.getObjects();

        const objects =
            objectsResult.result.records
                .slice(0, 20);

        let mostConnectedObject = {
            name: '',
            relationshipCount: 0
        };

        for (const object of objects) {

            const count =
                await metadataService
                    .getRelationshipCountForObject(
                        object.QualifiedApiName
                    );

            if (
                count >
                mostConnectedObject.relationshipCount
            ) {

                mostConnectedObject = {
                    name:
                        object.QualifiedApiName,
                    relationshipCount:
                        count
                };
            }
        }

        res.json({
            success: true,
            objectsAnalyzed:
                objects.length,
            mostConnectedObject
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
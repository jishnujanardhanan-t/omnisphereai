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

                let riskLevel = 'Low';

if (count >= 8) {
    riskLevel = 'High';
} else if (count >= 4) {
    riskLevel = 'Medium';
}

mostConnectedObject = {
    name:
        object.QualifiedApiName,
    relationshipCount:
        count,
    riskLevel
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

exports.getRiskReport = async (req, res) => {

    try {

        const objectsResult =
            await metadataService.getObjects();

        const objects =
            objectsResult.result.records.slice(0, 20);

        const highRiskObjects = [];
        const mediumRiskObjects = [];
        const lowRiskObjects = [];

        for (const object of objects) {

            const count =
                await metadataService
                    .getRelationshipCountForObject(
                        object.QualifiedApiName
                    );

            const objectInfo = {
                name: object.QualifiedApiName,
                relationshipCount: count
            };

            if (count >= 8) {

                highRiskObjects.push(
                    objectInfo
                );

            } else if (count >= 4) {

                mediumRiskObjects.push(
                    objectInfo
                );

            } else {

                lowRiskObjects.push(
                    objectInfo
                );
            }
        }

        res.json({
            success: true,
            objectsAnalyzed: objects.length,
            highRiskObjects,
            mediumRiskObjects,
            lowRiskObjects
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

exports.getArchitectureScore = async (req, res) => {

    try {

        const objectsResult =
            await metadataService.getObjects();

        const objects =
            objectsResult.result.records.slice(0, 20);

        let highRiskCount = 0;
        let mediumRiskCount = 0;

        for (const object of objects) {

            const count =
                await metadataService
                    .getRelationshipCountForObject(
                        object.QualifiedApiName
                    );

            if (count >= 8) {

                highRiskCount++;

            } else if (count >= 4) {

                mediumRiskCount++;
            }
        }

        let architectureScore =
            100 -
            (highRiskCount * 5) -
            (mediumRiskCount * 2);

        if (architectureScore < 0) {
            architectureScore = 0;
        }

        let grade = 'A';

        if (architectureScore < 90) {
            grade = 'B';
        }

        if (architectureScore < 80) {
            grade = 'C';
        }

        if (architectureScore < 70) {
            grade = 'D';
        }

        res.json({
            success: true,
            architectureScore,
            grade,
            riskSummary: {
                highRiskCount,
                mediumRiskCount
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
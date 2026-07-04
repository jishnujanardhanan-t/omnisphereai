const metadataService = require('../services/metadataService');
const cache = require('../cache/orgCache');

function getRiskLevel(count) {
    if (count >= 8) return 'High';
    if (count >= 4) return 'Medium';
    return 'Low';
}

exports.getSummary = async (req, res) => {

    try {

        const cached = cache.getCache();

        if (cached.summary && cache.isCacheValid()) {
            return res.json(cached.summary);
        }

        const objectsResult =
            await metadataService.getObjects();

        const objects =
            objectsResult.result.records.slice(0, 20);

        const fieldResults =
            await Promise.all(

                objects.map(object =>
                    metadataService.getObjectFields(
                        object.QualifiedApiName
                    )
                )

            );

        let totalFieldCount = 0;

        let largestObject = {
            name: '',
            fieldCount: 0
        };

        fieldResults.forEach((result, index) => {

            const fieldCount =
                result.result.records.length;

            totalFieldCount += fieldCount;

            if (fieldCount > largestObject.fieldCount) {

                largestObject = {

                    name:
                        objects[index].QualifiedApiName,

                    fieldCount

                };

            }

        });

        const averageFieldsPerObject =
            Math.round(
                totalFieldCount / objects.length
            );

        let healthScore = 100;

        if (averageFieldsPerObject > 40)
            healthScore -= 10;

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

        const response = {

            success: true,

            totalObjects:
                objectsResult.result.records.length,

            objectsAnalyzed:
                objects.length,

            analysisScope:
                'First 20 objects',

            averageFieldsPerObject,

            largestObject,

            healthScore,

            recommendations

        };

        cache.setCache({
            summary: response
        });

        return res.json(response);

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

exports.getRelationshipSummary = async (req, res) => {
  try {

    const cache = require('../cache/orgCache').getCache();

    const objects = cache.fullMetadata?.objects;
    const metadata = cache.fullMetadata?.metadata;

    if (!objects || !metadata) {
      return res.status(503).json({
        success: false,
        message: "Cache not ready"
      });
    }

    let mostConnectedObject = {
      name: '',
      relationshipCount: 0,
      riskLevel: 'Low'
    };

    metadata.forEach((result, index) => {

      const fields = result.result.records;

      const count = fields.filter(f =>
        f.DataType.includes('Lookup') ||
        f.DataType.includes('Hierarchy')
      ).length;

      let riskLevel = 'Low';
      if (count >= 8) riskLevel = 'High';
      else if (count >= 4) riskLevel = 'Medium';

      if (count > mostConnectedObject.relationshipCount) {
        mostConnectedObject = {
          name: objects[index].QualifiedApiName,
          relationshipCount: count,
          riskLevel
        };
      }
    });

    res.json({
      success: true,
      objectsAnalyzed: objects.length,
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

        const cached = cache.getCache();

        const objects = cached.fullMetadata?.objects;
        const metadata = cached.fullMetadata?.metadata;

        if (!objects || !metadata) {
            return res.status(503).json({
                success: false,
                message: 'Cache not ready'
            });
        }

        const highRiskObjects = [];
        const mediumRiskObjects = [];
        const lowRiskObjects = [];

        metadata.forEach((result, index) => {

            const fields = result.result.records;

            const relationshipCount = fields.filter(field =>
                field.DataType.includes('Lookup') ||
                field.DataType.includes('Hierarchy')
            ).length;

            const objectInfo = {
                name: objects[index].QualifiedApiName,
                relationshipCount
            };

            const riskLevel = getRiskLevel(relationshipCount);

            if (riskLevel === 'High') {
                highRiskObjects.push(objectInfo);
            } else if (riskLevel === 'Medium') {
                mediumRiskObjects.push(objectInfo);
            } else {
                lowRiskObjects.push(objectInfo);
            }

        });

        return res.json({
            success: true,
            objectsAnalyzed: objects.length,
            highRiskObjects,
            mediumRiskObjects,
            lowRiskObjects
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

exports.getArchitectureScore = async (req, res) => {
  try {

    const cached = cache.getCache();

    if (cached.architecture && cache.isCacheValid()) {
      return res.json(cached.architecture);
    }

    const objectsResult = await metadataService.getObjects();

    const objects = objectsResult.result.records.slice(0, 20);

    const counts = await Promise.all(
      objects.map(obj =>
        metadataService.getRelationshipCountForObject(obj.QualifiedApiName)
      )
    );

    let highRiskCount = 0;
    let mediumRiskCount = 0;

    counts.forEach(count => {
      if (count >= 8) highRiskCount++;
      else if (count >= 4) mediumRiskCount++;
    });

    let architectureScore =
      100 - (highRiskCount * 5) - (mediumRiskCount * 2);

    if (architectureScore < 0) architectureScore = 0;

    let grade = 'A';
    if (architectureScore < 90) grade = 'B';
    if (architectureScore < 80) grade = 'C';
    if (architectureScore < 70) grade = 'D';

    const response = {
      success: true,
      architectureScore,
      grade,
      riskSummary: {
        highRiskCount,
        mediumRiskCount
      }
    };

    cache.setCache({ architecture: response });

    return res.json(response);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
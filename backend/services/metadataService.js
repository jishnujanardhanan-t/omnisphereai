const { exec } = require('child_process');

function getObjects() {
    return new Promise((resolve, reject) => {

        const command =
            `sf data query --query "SELECT QualifiedApiName FROM EntityDefinition LIMIT 300" --target-org ${process.env.SF_USERNAME} --json`;

        exec(command, (error, stdout, stderr) => {

            if (error) {
                reject(error);
                return;
            }

            try {
                const result = JSON.parse(stdout);
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    });
}

function getObjectFields(objectName) {

    return new Promise((resolve, reject) => {

        const command =
            `sf data query --query "SELECT QualifiedApiName, DataType FROM FieldDefinition WHERE EntityDefinition.QualifiedApiName = '${objectName}' LIMIT 50" --target-org ${process.env.SF_USERNAME} --json`;

        exec(command, (error, stdout) => {

            if (error) {
                reject(error);
                return;
            }

            try {
                resolve(JSON.parse(stdout));
            } catch (err) {
                reject(err);
            }
        });
    });
}

function getCustomObjects() {

    return new Promise((resolve, reject) => {

        const command =
            `sf data query --query "SELECT QualifiedApiName FROM EntityDefinition WHERE QualifiedApiName LIKE '%__c' LIMIT 300" --target-org ${process.env.SF_USERNAME} --json`;

        exec(command, (error, stdout) => {

            if (error) {
                reject(error);
                return;
            }

            try {
                resolve(JSON.parse(stdout));
            } catch (err) {
                reject(err);
            }
        });
    });
}

function getFieldCountForObject(objectName) {
    return new Promise((resolve, reject) => {

        const command =
            `sf data query --query "SELECT COUNT() FROM FieldDefinition WHERE EntityDefinition.QualifiedApiName = '${objectName}'" --target-org ${process.env.SF_USERNAME} --json`;

        exec(command, (error, stdout) => {

            if (error) {
                reject(error);
                return;
            }

            try {
                const result = JSON.parse(stdout);
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    });
}

async function getRelationshipCountForObject(objectName) {

    const result =
        await getObjectFields(objectName);

    const fields =
        result.result.records;

    const relationships =
        fields.filter(field =>
            (
                field.DataType.includes('Lookup(') &&
                field.DataType !== 'Lookup()'
            ) ||
            field.DataType.includes('Hierarchy')
        );

    return relationships.length;
}

module.exports = {
    getObjects,
    getObjectFields,
    getCustomObjects,
    getFieldCountForObject,
    getRelationshipCountForObject
};
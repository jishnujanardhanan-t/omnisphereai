const { exec } = require('child_process');

function getObjects() {
    return new Promise((resolve, reject) => {

        const command =
            'sf data query --query "SELECT QualifiedApiName FROM EntityDefinition LIMIT 20" --target-org jishnujanan222.1999956b5c68@agentforce.com --json';

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
            `sf data query --query "SELECT QualifiedApiName, DataType FROM FieldDefinition WHERE EntityDefinition.QualifiedApiName = '${objectName}' LIMIT 50" --target-org jishnujanan222.1999956b5c68@agentforce.com --json`;

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

module.exports = {
    getObjects,
    getObjectFields
};
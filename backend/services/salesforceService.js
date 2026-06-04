const { exec } = require('child_process');

function getAccounts() {
    return new Promise((resolve, reject) => {

        const command =
            'sf data query --query "SELECT Name FROM Account LIMIT 5" --target-org jishnujanan222.1999956b5c68@agentforce.com --json';

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

module.exports = {
    getAccounts
};
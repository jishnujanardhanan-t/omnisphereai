const mockData = {
    Account: {
        fields: [
            { name: "Id", type: "string" },
            { name: "Name", type: "string" },
            { name: "Industry", type: "picklist" }
        ]
    },
    Contact: {
        fields: [
            { name: "Id", type: "string" },
            { name: "FirstName", type: "string" },
            { name: "LastName", type: "string" }
        ]
    }
};

exports.getAllObjects = () => {
    return {
        success: true,
        data: Object.keys(mockData).map(key => ({
            name: key,
            fields: mockData[key].fields.length
        }))
    };
};

exports.getObjectByName = (name) => {
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    return mockData[formattedName];
};
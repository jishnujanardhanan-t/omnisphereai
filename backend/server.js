require('dotenv').config();

const express = require('express');

const metadataRoutes = require('./routes/metadataRoutes');

const app = express();
const PORT = 3000;

// Import routes
const objectRoutes = require('./routes/objectRoutes');

app.use('/', objectRoutes);
app.use('/', metadataRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const express = require('express');

const app = express();
const PORT = 3000;

// Import routes
const objectRoutes = require('./routes/objectRoutes');

app.use('/', objectRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
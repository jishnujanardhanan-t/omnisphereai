require('dotenv').config();

const express = require('express');
const cors = require('cors');

const warmupCache = require('./bootstrap/warmup');

warmupCache();

const app = express();
const PORT = 3000;

app.use(cors());

const metadataRoutes =
    require('./routes/metadataRoutes');

const objectRoutes =
    require('./routes/objectRoutes');

const orgRoutes =
    require('./routes/orgRoutes');

app.use('/', orgRoutes);
app.use('/', objectRoutes);
app.use('/', metadataRoutes);

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});
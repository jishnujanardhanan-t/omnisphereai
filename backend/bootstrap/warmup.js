const metadataService = require('../services/metadataService');
const cache = require('../cache/orgCache');

async function loadData() {
  const objectsResult = await metadataService.getObjects();
  const objects = objectsResult.result.records.slice(0, 20);

  const metadata = await Promise.all(
    objects.map(obj =>
      metadataService.getObjectFields(obj.QualifiedApiName)
    )
  );

  cache.setCache({
    fullMetadata: { objects, metadata },
    lastUpdated: Date.now()
  });

  console.log('Cache refreshed at', new Date().toISOString());
}

async function warmupCache() {
  console.log('Initial cache load...');
  await loadData();

  // AUTO REFRESH EVERY 10 MINUTES
  setInterval(loadData, 10 * 60 * 1000);
}

module.exports = warmupCache;
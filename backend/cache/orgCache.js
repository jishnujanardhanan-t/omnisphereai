let cache = {
  summary: null,
  architecture: null,
  relationships: null,
  riskReport: null,
  fullMetadata: null,  
  lastUpdated: null
};

function isCacheValid() {
  return cache.lastUpdated &&
    (Date.now() - cache.lastUpdated < 10 * 60 * 1000); // 10 min
}

function warmCache(data) {
  cache.fullMetadata = data;
  cache.lastUpdated = Date.now();
}

module.exports = {
  getCache: () => cache,
  setCache: (c) => cache = { ...cache, ...c },
  isCacheValid,
  warmCache
};
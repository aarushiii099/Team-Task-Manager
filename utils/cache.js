const cache = require("memory-cache");

const getCache = (key) => cache.get(key);

const setCache = (key, data, duration = 60000) => {
    cache.put(key, data, duration);
}

const clearAllCache = () => cache.clear();

module.exports = {
    getCache,
    setCache,
    clearAllCache
}
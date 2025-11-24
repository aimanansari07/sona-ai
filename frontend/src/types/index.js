// Type definitions (for documentation)
/**
 * @typedef {Object} Location
 * @property {string} state
 * @property {string} city
 */

/**
 * @typedef {Object} Prediction
 * @property {number} price
 * @property {number} trend
 * @property {number} confidence
 */

/**
 * @typedef {Object} PredictionResponse
 * @property {number} currentPrice
 * @property {Prediction[]} forecast
 * @property {number} weekAverage
 * @property {number} weekTrend
 */
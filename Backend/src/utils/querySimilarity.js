// Similarity detection helpers for query deduplication

/**
 * Normalizes a query string for comparison
 * @param {string} query - The query to normalize
 * @returns {string} Normalized query
 */
function normalizeQuery(query) {
    return query
        .toLowerCase()
        .trim()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .replace(/\s+/g, ' '); // Normalize whitespace
}

/**
 * Calculates similarity between two queries using Jaccard similarity
 * @param {string} query1 - First query
 * @param {string} query2 - Second query
 * @returns {number} Similarity score (0-1)
 */
function calculateSimilarity(query1, query2) {
    const words1 = new Set(query1.split(' '));
    const words2 = new Set(query2.split(' '));

    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    return intersection.size / union.size;
}

/**
 * Checks if two queries are similar
 * @param {string} query1 - First query
 * @param {string} query2 - Second query
 * @param {number} threshold - Similarity threshold (default 0.7)
 * @returns {boolean} True if queries are similar
 */
function areSimilar(query1, query2, threshold = 0.7) {
    const normalized1 = normalizeQuery(query1);
    const normalized2 = normalizeQuery(query2);

    // Exact match after normalization
    if (normalized1 === normalized2) {
        return true;
    }

    // Similarity check
    const similarity = calculateSimilarity(normalized1, normalized2);
    return similarity >= threshold;
}

module.exports = {
    normalizeQuery,
    calculateSimilarity,
    areSimilar
};

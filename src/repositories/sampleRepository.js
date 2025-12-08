const { pool } = require('../configs/dbConfig');

async function getSampleById(id) {
    const res = await pool.query(
        'SELECT * FROM samples WHERE id = $1',
        [id]
    );
    return res.rows[0];
}

async function getSamplesByScoreId(score_id) {
    const res = await pool.query(
        'SELECT * FROM samples WHERE score_id = $1',
        [score_id]
    );
    return res.rows;
}

async function createSample(is_clean, score_id) {
    const res = await pool.query(
        `INSERT INTO samples (is_clean, score_id)
        VALUES ($1, $2)
        RETURNING *`,
        [is_clean, score_id]
    );
    return res.rows[0];
}

async function createDefaultSample(score_id) {
    const res = await pool.query(
        `INSERT INTO samples (is_clean, score_id)
        VALUES (DEFAULT, $1)
        RETURNING *`,
        [score_id]
    );
    return res.rows[0];
}

async function updateSample (id, is_clean) {
    const res = await pool.query(
        `UPDATE samples
        SET is_clean = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *`,
        [is_clean, id]
    );
    return res.rows[0];
}

async function deleteSample(id) {
    const res = await pool.query(
        `DELETE FROM samples
        WHERE id = $1
        RETURNING *`,
        [id]
    );
    return res.rows[0];
}

module.exports = {
    getSampleById,
    getSamplesByScoreId,
    createSample,
    createDefaultSample,
    updateSample,
    deleteSample
};
const { pool } = require('../configs/dbConfig');

async function getViolationById(id) {
    const res = await pool.query(
        'SELECT * FROM violations WHERE id = $1',
        [id]
    );
    return res.rows[0];
}

async function getViolationsBySampleId(sample_id) {
    const res = await pool.query(
        'SELECT * FROM violations WHERE sample_id = $1',
        [sample_id]
    );
    return res.rows;
}

async function getViolationsByScoreId(score_id) {
    const res = await pool.query(
        'SELECT * FROM violations WHERE score_id = $1',
        [score_id]
    );
    return res.rows;
}

async function createViolation(score_id, sample_id, name, total) {
    const res = await pool.query(
        `INSERT INTO violations (score_id, sample_id, name, total)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [score_id, sample_id, name, total]
    );
    return res.rows[0];
}

module.exports = {
    getViolationById,
    getViolationsBySampleId,
    getViolationsByScoreId,
    createViolation
};
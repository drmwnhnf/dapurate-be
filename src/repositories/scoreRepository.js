const { pool } = require('../configs/dbConfig');

async function getScorebyId(id) {
    const res = await pool.query(
        'SELECT * FROM scores WHERE id = $1',
        [id]
    );
    return res.rows[0];
}

async function getTodayScore() {
    const res = await pool.query(
        'SELECT * FROM scores WHERE date = CURRENT_DATE'
    );
    return res.rows[0];
}

async function getScorebyDate(date) {
    const res = await pool.query(
        'SELECT * FROM scores WHERE date = $1',
        [date]
    );
    return res.rows[0];
}

async function createScore(clean_sample, total_sample, score, date) {
    const res = await pool.query(
        `INSERT INTO scores (clean_sample, total_sample, score, date)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [clean_sample, total_sample, score, date]
    );
    return res.rows[0];
}

async function createDefaultScore() {
    const res = await pool.query(
        `INSERT INTO scores (clean_sample, total_sample, score)
        VALUES (DEFAULT, DEFAULT, DEFAULT)
        RETURNING *`
    );
    return res.rows[0];
    
}

async function updateScore(id, clean_sample, total_sample, score) {
    const res = await pool.query(
        `UPDATE scores
        SET clean_sample = $2, total_sample = $3, score = $4
        WHERE id = $1
        RETURNING *`,
        [id, clean_sample, total_sample, score]
    );
    return res.rows[0];
}

module.exports = {
    getTodayScore,
    getScorebyDate,
    createScore,
    createDefaultScore,
    updateScore,
    getScorebyId
};
const db = require('../config/db');
const logger = require('../utils/logger');

exports.getAll = async (req, res, next) => {
    try {
        const { search, region, status, page, limit } = req.query;
        const offset = (page - 1) * limit;

        const conditions = [];
        const params = [];

        if (search) {
            params.push(`%${search}%`);
            conditions.push(`name ILIKE $${params.length}`);
        }
        if (region) {
            params.push(region);
            conditions.push(`region = $${params.length}`);
        }
        if (status) {
            params.push(status);
            conditions.push(`status = $${params.length}`);
        }

        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

        const countResult = await db.query(
            `SELECT COUNT(*)::int AS total FROM sites ${where}`,
            params
        );

        params.push(limit, offset);
        const dataResult = await db.query(
            `SELECT id, name, code, region, status, created_at
             FROM sites ${where}
             ORDER BY created_at DESC
             LIMIT $${params.length - 1} OFFSET $${params.length}`,
            params
        );

        res.json({
            data: dataResult.rows,
            pagination: {
                total: countResult.rows[0].total,
                page,
                limit,
                pages: Math.ceil(countResult.rows[0].total / limit)
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM sites WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Site not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const { name, code, region, status } = req.body;
        const result = await db.query(
            `INSERT INTO sites (name, code, region, status)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [name, code, region, status]
        );
        logger.info('Site created', { id: result.rows[0].id });
        res.status(201).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, code, region, status } = req.body;
        const result = await db.query(
            `UPDATE sites
             SET name = $1, code = $2, region = $3, status = $4
             WHERE id = $5
             RETURNING *`,
            [name, code, region, status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Site not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'DELETE FROM sites WHERE id = $1 RETURNING id',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Site not found' });
        }
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};


// const siteModel = require('../models/siteModel');

// exports.getAll = async (req, res, next) => {
//     try { res.json(await siteModel.findAll(req.query)); }
//     catch (err) { next(err); }
// };
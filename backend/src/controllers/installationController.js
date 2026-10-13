const db = require('../config/db');
const logger = require('../utils/logger');

exports.getAll = async (req, res, next) => {
    try {
        const { site_id, status } = req.query;
        const conditions = [];
        const params = [];

        if (site_id) {
            params.push(site_id);
            conditions.push(`i.site_id = $${params.length}`);
        }
        if (status) {
            params.push(status);
            conditions.push(`i.status = $${params.length}`);
        }

        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

        const result = await db.query(
            `SELECT i.id, i.site_id, s.name AS site_name, i.equipment_type,
                    i.quantity, i.status, i.installed_at, i.created_at
             FROM installations i
             JOIN sites s ON s.id = i.site_id
             ${where}
             ORDER BY i.created_at DESC`,
            params
        );
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const result = await db.query(
            `SELECT i.*, s.name AS site_name
             FROM installations i
             JOIN sites s ON s.id = i.site_id
             WHERE i.id = $1`,
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Installation not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const { site_id, equipment_type, quantity, status, installed_at } = req.body;
        const result = await db.query(
            `INSERT INTO installations (site_id, equipment_type, quantity, status, installed_at)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [site_id, equipment_type, quantity, status, installed_at]
        );
        logger.info('Installation created', { id: result.rows[0].id });
        res.status(201).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { site_id, equipment_type, quantity, status, installed_at } = req.body;
        const result = await db.query(
            `UPDATE installations
             SET site_id = $1, equipment_type = $2, quantity = $3,
                 status = $4, installed_at = $5
             WHERE id = $6
             RETURNING *`,
            [site_id, equipment_type, quantity, status, installed_at, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Installation not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const result = await db.query(
            'DELETE FROM installations WHERE id = $1 RETURNING id',
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Installation not found' });
        }
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};
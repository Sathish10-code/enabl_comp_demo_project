const db = require('../config/db');

exports.getSummary = async (req, res, next) => {
    try {
        const totals = await db.query(`
            SELECT
                (SELECT COUNT(*)::int FROM sites)                             AS total_sites,
                (SELECT COUNT(*)::int FROM sites WHERE status='active')       AS active_sites,
                (SELECT COUNT(*)::int FROM installations)                     AS total_installations,
                (SELECT COALESCE(SUM(quantity),0)::int
                    FROM installations WHERE status='completed')              AS completed_units
        `);

        const byRegion = await db.query(`
            SELECT s.region,
                   COUNT(DISTINCT s.id)::int AS sites,
                   COUNT(i.id)::int          AS installations
            FROM sites s
            LEFT JOIN installations i ON i.site_id = s.id
            GROUP BY s.region
            ORDER BY sites DESC
        `);

        const byStatus = await db.query(`
            SELECT status, COUNT(*)::int AS count
            FROM installations
            GROUP BY status
        `);

        res.json({
            ...totals.rows[0],
            by_region: byRegion.rows,
            by_status: byStatus.rows
        });
    } catch (err) {
        next(err);
    }
};
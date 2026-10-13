const db = require('../src/config/db');

async function seed() {
    await db.query(`TRUNCATE installations, sites, users RESTART IDENTITY CASCADE`);

    await db.query(`
        INSERT INTO users (email, full_name, role) VALUES
        ('alice@example.com', 'Alice Khan', 'admin'),
        ('bob@example.com',   'Bob Mehta', 'engineer')
    `);

    await db.query(`
        INSERT INTO sites (name, code, region, status, created_by) VALUES
        ('Mumbai Central',  'MUM01', 'West',  'active',      1),
        ('Delhi North',     'DEL01', 'North', 'active',      1),
        ('Chennai South',   'CHE01', 'South', 'maintenance', 2)
    `);

    await db.query(`
        INSERT INTO installations (site_id, installed_by, equipment_type, quantity, status, installed_at) VALUES
        (1, 2, 'Router',     10, 'completed',   NOW()),
        (1, 2, 'Switch',      5, 'in_progress', NULL),
        (2, 1, 'Antenna',     8, 'completed',   NOW()),
        (3, 2, 'Router',      4, 'pending',     NULL)
    `);

    console.log('Seed complete');
    process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
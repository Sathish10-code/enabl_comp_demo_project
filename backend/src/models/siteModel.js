const db = require('../config/db');

exports.findAll = (filters) => db.query(/* same SQL as controller */);
exports.findById = (id) => db.query('SELECT * FROM sites WHERE id=$1', [id]);
exports.create = (data) => db.query(/* INSERT */);
exports.update = (id, data) => db.query(/* UPDATE */);
exports.remove = (id) => db.query('DELETE FROM sites WHERE id=$1', [id]);
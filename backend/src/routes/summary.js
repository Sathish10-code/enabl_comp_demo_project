const router = require('express').Router();
const ctrl = require('../controllers/summaryController');

router.get('/', ctrl.getSummary);

module.exports = router;
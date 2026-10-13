const router = require('express').Router();
const ctrl = require('../controllers/siteController');
const { validateSite, validateSiteQuery } = require('../middleware/validation');

router.get('/', validateSiteQuery, ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', validateSite, ctrl.create);
router.put('/:id', validateSite, ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
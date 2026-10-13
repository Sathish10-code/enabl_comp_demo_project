const router = require('express').Router();
const ctrl = require('../controllers/installationController');
const { validateInstallation } = require('../middleware/validation');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', validateInstallation, ctrl.create);
router.put('/:id', validateInstallation, ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
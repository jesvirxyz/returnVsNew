const { Router } = require('express'),
	router = Router(),
	{
		all_appointments,
		update_client,
	} = require('../controllers/dashboard.controllers');
const { authenticate } = require('../../../../middleware/jwt.middleware');

router.get('', all_appointments);
// router.patch('/:id', update_client);

module.exports = router;

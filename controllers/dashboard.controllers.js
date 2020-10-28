const {
	compareNewAndReturn,
	updateClient,
} = require('../business/dashboard.business');
const { errorHandler } = require('../../../../helpers/errorHandling.helper');

// create a new Company
exports.all_appointments = async (req, res) => {
	try {
		const result = await compareNewAndReturn(req);
		res.status(200).send(result);
	} catch (e) {
		res.status(400).send(errorHandler(e));
	}
};

exports.update_client = async (req, res) => {
	try {
		const result = await updateClient(req);
		res.status(200).send(result);
	} catch (e) {
		res.status(400).send(errorHandler(e));
	}
};

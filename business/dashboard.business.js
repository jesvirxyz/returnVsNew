const { result, update } = require('lodash');
const { msg } = require('../../../../../config/messages'),
	{
		pickAppointmentResponse,
	} = require('../../../../helpers/pickResponse.helper'),
	{ User } = require('../../user/models/user.model'),
	{ Appointment } = require('../../appointments/models/appointments.model'),
	{ Client } = require('../../client/models/client.model'),
	{ Location } = require('../../location/models/location.model');

exports.compareNewAndReturn = async (data) => {
	let list = data.query.list;
	let finalResult;
	try {
		let location = await Location.findById(data.query.location);
		let results, results2;
		let selectedDate = new Date(data.query.date);
		let month = selectedDate.getMonth();
		let year = selectedDate.getFullYear();

		let queryArr, queryArr2;
		if (!year || !month) {
			console.log('No Month and Year');
			finalResult = [];
		} else {
			if (data.query.month) {
				queryArr = [
					{
						$match: {
							location: mongoose.Types.ObjectId(location._id),
							checkout: true,
							createdAt: {
								$gte: new Date(year, month, 1),
								$lte: new Date(year, month + 1, 0),
							},
							status: 'completed',
							client: { $ne: null },
						},
					},
					{
						$lookup: {
							from: 'clients',
							localField: 'client',
							foreignField: '_id',
							as: 'clients',
						},
					},

					{
						$group: {
							_id: '$client',
							clientReg: { $addToSet: '$clients.createdAt' },
							return_count: { $sum: 1 },
						},
					},
					{
						$match: {
							return_count: { $gt: 1 },
							clientReg: {
								$lt: [new Date(year, month, 1, 0, 0, 0)],
							},
						},
					},
					{
						$count: 'returned',
					},
				];

				queryArr2 = [
					{
						$match: {
							location: mongoose.Types.ObjectId(location._id),
							checkout: true,
							createdAt: {
								$gte: new Date(year, month, 1),
								$lte: new Date(year, month + 1, 0),
							},
							status: 'completed',
							client: { $ne: null },
						},
					},
					{
						$lookup: {
							from: 'clients',
							localField: 'client',
							foreignField: '_id',
							as: 'clients',
						},
					},

					{
						$group: {
							_id: '$client',
							clientReg: { $addToSet: '$clients.createdAt' },
							return_count: { $sum: 1 },
						},
					},
					{
						$match: {
							return_count: { $lte: 1 },
							clientReg: {
								$gte: [new Date(year, month, 1)],
							},
						},
					},
					{
						$count: 'new',
					},
				];
			}
			if (data.query.year) {
				queryArr = [
					{
						$match: {
							location: mongoose.Types.ObjectId(location._id),
							checkout: true,
							createdAt: {
								$gte: new Date(year, 0),
								$lte: new Date(year, 11, 31),
							},
							status: 'completed',
							client: { $ne: null },
						},
					},
					{
						$lookup: {
							from: 'clients',
							localField: 'client',
							foreignField: '_id',
							as: 'clients',
						},
					},

					{
						$group: {
							_id: '$client',
							clientReg: { $addToSet: '$clients.createdAt' },
							return_count: { $sum: 1 },
						},
					},
					{
						$match: {
							return_count: { $gte: 1 },
							clientReg: {
								$lt: [[new Date(year, 0, 1, 0, 0, 0)]],
							},
						},
					},
					{
						$count: 'returned',
					},
				];

				queryArr2 = [
					{
						$match: {
							location: mongoose.Types.ObjectId(location._id),
							checkout: true,
							createdAt: {
								$gte: new Date(year, 0),
								$lte: new Date(year, 11, 31),
							},
							status: 'completed',
							client: { $ne: null },
						},
					},
					{
						$lookup: {
							from: 'clients',
							localField: 'client',
							foreignField: '_id',
							as: 'clients',
						},
					},

					{
						$group: {
							_id: '$client',
							clientReg: { $addToSet: '$clients.createdAt' },
							return_count: { $sum: 1 },
						},
					},
					{
						$match: {
							return_count: { $gte: 1 },
							clientReg: {
								$gte: [new Date(year, 0, 1, 0, 0, 0)],
								$lt: [[new Date(year, 11, 31, 0, 0, 0)]],
							},
						},
					},
					{
						$count: 'new',
					},
				];
			}

			let appointment = await Appointment.aggregate(
				queryArr
			).allowDiskUse(true);
			let appointment2 = await Appointment.aggregate(
				queryArr2
			).allowDiskUse(true);
			results = appointment[0].returned;
			results2 = appointment2[0].new;

			finalResult = [
				{
					returned: results,
					new: results2,
				},
			];
		}

		return (list && pickAppointmentResponse(finalResult)) || finalResult;
	} catch (error) {
		finalResult = [];
		return (list && pickAppointmentResponse(finalResult)) || finalResult;
	}
};

// exports.updateClient = async (data) => {
// 	try {
// 		const client = await Client.findById(data.params.id);
// 		client.createdAt = new Date(2019, 1, 1);
// 		const save_client = client.save();

// 		return save_client;
// 	} catch (error) {
// 		throw error;
// 	}
// };

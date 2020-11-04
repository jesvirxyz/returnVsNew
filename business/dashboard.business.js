const { result, update, isEmpty } = require('lodash');
const { msg } = require('../../../../../config/messages'),
	{
		pickAppointmentResponse,
		pickDashboardCategories,
	} = require('../../../../helpers/pickResponse.helper'),
	{ User } = require('../../user/models/user.model'),
	{ Appointment } = require('../../appointments/models/appointments.model'),
	{ Client } = require('../../client/models/client.model'),
	{ Location } = require('../../location/models/location.model'),
	moment = require('moment');

exports.compareNewAndReturn = async (data) => {
	let body = pickDashboardCategories(data.body);

	// let location = ['5f5f3e8782303800122d02f7', '5f6ee433e365e80019f5fe8a'];
	// let location = ['5f5f3e8782303800122d02f7'];
	// let start_date = '2020-10-29T05:30:00.000Z';
	// let end_date = '2020-10-30T05:30:00.000Z';
	let location = body.locationId;
	let start_date = body.start_date;
	let end_date = body.end_date;
	let ownerId = mongoose.Types.ObjectId(data.owner);
	let finalResult;
	try {
		let results, results2;

		let startOfYear = moment(start_date).startOf('year');
		let endOfYear = moment(end_date).endOf('year');
		let startOfWeek = moment(start_date).startOf('week');
		let endOfWeek = moment(end_date).endOf('week');
		let startOfMonth = moment(start_date).startOf('month');
		let endOfMonth = moment(end_date).endOf('month');
		let queryArr, queryArr2;
		let finalReturn = 0,
			finalNew = 0;
		for (let i = 0; i < location.length; i++) {
			if (data.query.month) {
				queryArr = [
					{
						$match: {
							location: mongoose.Types.ObjectId(location[i]),
							checkout: true,
							createdAt: {
								$gte: new Date(startOfMonth),
								$lte: new Date(endOfMonth),
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
								$lt: [new Date(startOfMonth)],
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
							location: mongoose.Types.ObjectId(location[i]),
							checkout: true,
							createdAt: {
								$gte: new Date(startOfMonth),
								$lte: new Date(endOfMonth),
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
								$gte: [new Date(startOfMonth)],
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
							location: mongoose.Types.ObjectId(location[i]),
							checkout: true,
							createdAt: {
								$gte: new Date(startOfYear),
								$lte: new Date(endOfYear),
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
								$lt: [[new Date(startOfYear)]],
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
							location: mongoose.Types.ObjectId(location[i]),
							checkout: true,
							createdAt: {
								$gte: new Date(startOfYear),
								$lte: new Date(endOfYear),
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
								$gte: [new Date(startOfYear)],
								$lt: [[new Date(endOfYear)]],
							},
						},
					},
					{
						$count: 'new',
					},
				];
			}
			if (data.query.week) {
				queryArr = [
					{
						$match: {
							location: mongoose.Types.ObjectId(location[i]),
							checkout: true,
							createdAt: {
								$gte: new Date(startOfWeek),
								$lte: new Date(endOfWeek),
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
								$lt: [[new Date(startOfWeek)]],
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
							location: mongoose.Types.ObjectId(location[i]),
							checkout: true,
							createdAt: {
								$gte: new Date(startOfWeek),
								$lte: new Date(endOfWeek),
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
								$gte: [new Date(startOfWeek)],
								$lt: [[new Date(endOfWeek)]],
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
			if (appointment.length > 0) {
				results = appointment[0].returned;
			} else {
				results = 0;
			}
			if (appointment2.length > 0) {
				results2 = appointment2[0].new;
			} else {
				results2 = 0;
			}
			finalReturn = finalReturn + results;
			finalNew = finalNew + results2;

			finalResult = [
				{
					returned: finalReturn,
					new: finalNew,
				},
			];
		}

		return finalResult;
	} catch (error) {
		throw error;
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


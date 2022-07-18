const urlModel = require('../models/urlModel');
const shortid = require('shortid');

const shortenUrl = async function(req, res) {
	try {
		const getUrl = req.body;
		const baseUrl = 'http://localhost:3000/';
		const isUrlShortened = await urlModel.findOne({ longUrl: getUrl.longUrl });
		if (isUrlShortened) {
			res
				.status(400)
				.send({
					status: false,
					message: 'Given url already has been shortened!!',
					shortUrl: isUrlShortened.shortUrl,
				});
			return;
		}
		const code = shortid.generate();
		const shortUrl = baseUrl.concat(code);
		const urlDetail = {
			longUrl: getUrl.longUrl,
			shortUrl: shortUrl,
			urlCode: code,
		};
		let createShortUrl = await urlModel.create(urlDetail);
		res.status(201).send({ status: true, message: 'Success', data: urlDetail });
		return;
	} catch (err) {
		res.status(500).send({ status: false, message: err.message });
		return;
	}
};

const getUrl = async (req, res) => {
	try {
		const url = req.params.urlCode;
		const dbUrl = await urlModel.findOne({ urlCode: url });
		if (dbUrl) {
			return res.status(302).redirect(dbUrl.longUrl
                /*{
				status: true,
				data: dbUrl.longUrl,
			}*/);
		} else {
			return res.status(404).send({
				status: false,
				message: 'url code is not found',
			});
		}
	} catch (err) {
		return res.status(500).send({
			status: false,
			message: err.message,
		});
	}
};

module.exports.shortenUrl = shortenUrl;
module.exports.getUrl = getUrl;

var express 			= require('express');
var router  			= express.Router();
var Service				= require('../models/service.model');


router.get('/all', function(req, res){

	Service.find({}, function(err, result){

		if(err) console.log(err);
		res.json(result);
	});

});

module.exports = router;
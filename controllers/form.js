var express 			= require('express');
var router  			= express.Router();
var Form				= require('../models/form.model');

router.get('/create', function(req, res){
	res.render('form/create');
});

router.post('/create', function(req, res){
	res.redirect('/form/create');
});

router.get('/all', function(req, res){

	Form.find({}, function(err, result){

		if(err) console.log(err);
		console.log( "Form: " + result );

		res.json(result);
	});

});


router.get('/:id', function(req, res){

	Form.findOne({ _id: req.params.id }, function(err, form){
		if(err){
			res.json({ message : err});
		}
		else{
			res.json(form);
		}
	});

});

module.exports = router;
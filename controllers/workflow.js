var express 			= require('express');
var TemplateWorkflow 	= require('../models/TemplateWorkflow');
var router  = express.Router();


router.get('/', function(req, res){
	res.render('workflow/index');
});

router.get('/execute', function(req, res){

	TemplateWorkflow.find({}, function(err, result){

		if(err) console.log(err);

		res.render('workflow/execute', { workflows : result } );
	});

});


router.get('/create', function(req, res){
	res.render('workflow/create');
});


router.post('/save', function(req, res){

	var tpWorkflow = new TemplateWorkflow( { 
		name: req.body.name, 
		description: req.body.description,
		xml: req.body.xml  
	} );
	
	tpWorkflow.save(function (err) {
		if(!err){
			console.log('Save template workflow !!!');
			res.end('succesful');
		}
		else{
			console.log(err);
			res.end('failed');
		}

	});
});


router.get('/:id/profile', function(req, res){

	TemplateWorkflow.findOne( { "_id" : req.params.id }, function(err, result){

		res.render('workflow/single/profile', { workflow: result } );
	});

});


router.get('/:id/execute', function(req, res){

	TemplateWorkflow.findOne( { "_id" : req.params.id }, function(err, result){

		res.render('workflow/single/execute', { workflow: result } );
	});

});



module.exports = router;

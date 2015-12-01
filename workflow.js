var express 			= require('express');
var TemplateWorkflow 	= require('./models/TemplateWorkflow');
var router  = express.Router();


router.get('/', function(req, res){
	res.render('workflow');
});

router.get('/execute', function(req, res){

	TemplateWorkflow.find({}, function(err, result){

		if(err) console.log(err);

		res.render('workflowExecute', { workflows : result } );
	});

});


router.get('/create', function(req, res){
	res.render('workflowCreate');
});


router.post('/save', function(req, res){

	console.log( req.body.xml );
	var tpWorkflow = new TemplateWorkflow( { name: 'ice', xml: req.body.xml  } );
	
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


module.exports = router;

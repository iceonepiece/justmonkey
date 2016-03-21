var express 			= require('express');
var TemplateWorkflow 	= require('../models/TemplateWorkflow');
var WorkflowExecution	= require('../models/WorkflowExecution.model');
var Form				= require('../models/form.model');
var Service 			= require('../models/service.model');
var WorkflowHandler		= require('./WorkflowHandler');
var parseString 		= require('xml2js').parseString;
var runner				= require('./runner');

var router  			= express.Router();

router.get('/savedoll', function(req, res){
	var service = new Service({
		name: "US Dollar to Baht",
		description: "convert US Dollar to Baht",

		inputs: [
			{
				name: "dollar",
				type: "Number"
			}
		],

		outputs: [
			{
				name: "baht",
				type: "Number"
			}
		],

		script: "baht = dollar * 35;"
	});

	service.save(function (err) {
		if(!err){
			console.log('Save form !!!');
			res.end('succesful');
		}
		else{
			console.log(err);
			res.end('failed');
		}

	});
});

router.get('/saveservice', function(req, res){
	
	var service = new Service( { 
		name: "Age Calculator", 
		description: "use to calculate age",
		
		inputs: [
			{
				name: "day",
				type: "Number"
			},
			{
				name: "month",
				type: "Number"
			},
			{
				name: "year",
				type: "Number"
			}
		],
		
		outputs: [
			{
				name: "age",
				type: "Number"
			}
		],
		
		script: ""
	});

	service.save(function (err) {
		if(!err){
			console.log('Save form !!!');
			res.end('succesful');
		}
		else{
			console.log(err);
			res.end('failed');
		}

	});

});

router.get('/', function(req, res){
	res.render('workflow/index');
});

router.get('/execute', function(req, res){

	TemplateWorkflow.find({}, function(err, result){

		if(err) console.log(err);

		res.render('workflow/execute', { workflows : result } );
	});

});

router.get('/addform', function(req, res){
	var form = new Form( { 
		name: "Show info", 
		description: "show info naja",
		elements: [
			{
				name: "nameLabel", 
				type: "label", 
				value: "Name"
			},
			{
				name: "dayLabel", 
				type: "label", 
				value: "Day"
			},
			{
				name: "monthLabel", 
				type: "label", 
				value: "Month"
			},
			{
				name: "yearLabel", 
				type: "label", 
				value: "Year"
			}
		]
	});

	form.save(function (err) {
		if(!err){
			console.log('Save form !!!');
			res.end('succesful');
		}
		else{
			console.log(err);
			res.end('failed');
		}

	});
});

router.get('/tester', function(req, res){
	var form = new Form( { 
		name: "Age Calculator Update", 
		description: "use to calculate age from birthdate",
		elements: [
			{
				name: "nameLabel", 
				type: "label", 
				value: "Name"
			},
			{
				name: "nameTextbox", 
				type: "textbox", 
				value: ""
			},

			{
				name: "dayLabel", 
				type: "label", 
				value: "Day"
			},
			{
				name: "dayTextbox", 
				type: "textbox", 
				value: ""
			},

			{
				name: "monthLabel", 
				type: "label", 
				value: "Month"
			},
			{
				name: "monthTextbox", 
				type: "textbox", 
				value: ""
			},

			{
				name: "yearLabel", 
				type: "label", 
				value: "Year"
			},
			{
				name: "yearTextbox", 
				type: "textbox", 
				value: ""
			}
		]
	});

	form.save(function (err) {
		if(!err){
			console.log('Save form !!!');
			res.end('succesful');
		}
		else{
			console.log(err);
			res.end('failed');
		}

	});
});

router.get('/create', function(req, res){

	Form.find({}, function(err, result){
		if(err) console.log(err);
		console.log( "Form: " + result );
		res.render('workflow/create',{ forms: result});
	});
});


router.post('/save', function(req, res){

	var tpWorkflow = new TemplateWorkflow( { 
		name: req.body.name, 
		description: req.body.description,
		xml: req.body.xml,
		variables: req.body.variables,
		elements: req.body.elements
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

		var xml = result.xml;

		parseString(xml, function(er, strResult){

			var elements = strResult["bpmn2:definitions"]["bpmn2:process"][0];

			var handler = new WorkflowHandler();

			handler.setup( elements );

			console.log( " == execute == ");
			console.log( result._id );
			console.log( result.name );
			console.log( result.description );
			console.log( " ============== ");
			
			var execution = new WorkflowExecution({
				templateId: result.id,
				currentTask: handler.startEvent.id,
				variables: result.variables,
				elements: result.elements,
				handler: handler
			});

			execution.save(function (err) {
				if(!err){
					console.log('Execution success');
					runner.runWorkflow(execution, res);
					//executeWorkflow(execution, res);
				}
				else{
					console.log(err);
					res.end('failed');
				}
			});
		});
	});

});



function runTask(task){

	console.log("run task");
	console.log(task);
	console.log("=========");
}


function executeWorkflow(execution, res){
	console.log('execute workflow');

	var currentElement = execution.handler.currentTask;

	while( currentElement !== null ){

		//console.log( currentElement.toString() );
		if( currentElement.type === "user" ){
			 execution.handler.currentTask = currentElement;
			 break;
		}

		currentElement = currentElement.next;
	}
	

	WorkflowExecution.update({ _id: execution._id}, 
		{ 'handler.currentTask': currentElement }, 
		function(err){
			
			if(!err) {
				console.log('succesful update');
			}
			else{
				console.log('error');
			}
			res.redirect('/');
		});

}

function getHtmlElement( element ){

	var html = "";

	if( element.type === "label" ){
		html += "<b>" + element.value + "</b>";
	}
	else if( element.type ==="textbox" ){
		html += '<input type="text" name="' + element.name + '">';
	}

	return html;
}

/*router.get('/:id/execute', function(req, res){

	TemplateWorkflow.findOne( { "_id" : req.params.id }, function(err, result){
		var xml = result.xml;

		parseString(xml, function (err, strResult) {

			var elements = strResult["bpmn2:definitions"]["bpmn2:process"][0];
			var keys = Object.keys( elements );


			var handler = new WorkflowHandler();

		
			handler.setup( elements );
			handler.run();
		
			console.log( handler.taskList );
    		res.render( "workflow/single/execute", { 
    			layout:"workflowMain",
    			tasks : handler.taskList,
    			id : req.params.id
    		});
		});
	});
});


router.post('/:id/execute', function(req, res){

	var mailOptions = {
	    from: 'Jaratrawee <iceonepiece@gmail.com>', // sender address 
	    to: req.body.to, 
	    subject: req.body.subject,  
	    html: req.body.body
	};
 
	// send mail with defined transport object 
	transporter.sendMail(mailOptions, function(error, info){
    	if(error){
        	return console.log(error);
    	}
    	res.end("DONE");
    	console.log('Message sent: ' + info.response);
	});
});*/


module.exports = router;

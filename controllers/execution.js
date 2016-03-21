var express 			= require('express');
var router  			= express.Router();
var WorkflowExecution 	= require('../models/WorkflowExecution.model');
var Form				= require('../models/form.model');
var runner				= require('./runner');

router.get('/', function(req, res){

	WorkflowExecution.find({}, function(err, result){

		if(err) console.log(err);

		res.render('execution/all', { result: result} );
	});

});


router.get('/:id', function(req, res){

	WorkflowExecution.findOne( { "_id" : req.params.id }, function(err, execution){

		if(err) console.log(err);

		var currentElementId = execution.handler.currentTask.id;
		var currentElement = execution.elements[currentElementId];
		var inputMappings = [];
		var wfVariables = execution.variables;

		if( currentElement.inputMappings !== undefined ){
			inputMappings = currentElement.inputMappings;
		}
		console.log(inputMappings);

		Form.findOne({ "_id": currentElement.formId }, function(err, result){

			var formHtml = '<form method="post" action="/execution/' + execution._id + '">';

			for(var i = 0; i < result.elements.length; i++){
				
				for(var j = 0; j < inputMappings.length; j++ ){
		
					if( result.elements[i].name === inputMappings[j].first ){
					
						for(var k = 0; k < wfVariables.length; k++){
						
							if( inputMappings[j].second === wfVariables[k].name ){
								console.log('yo');
								result.elements[i].value = wfVariables[k].value;
							}
						}

					}
				}

				formHtml += '<div>' + getHtmlElement( result.elements[i] ) + '</div>';
			}

			formHtml += '<input type="submit" value="Submit">';

			res.render('execution/one', { html: formHtml });
		});
		
	});

});

router.post('/:id', function(req, res){

	// deal with output mapping
	WorkflowExecution.findOne( { "_id" : req.params.id }, function(err, execution){

		var elements = execution.elements;
		var outputMappings = elements[execution.handler.currentTask.id].outputMappings;
		var wfVariables = execution.variables;
		var handler = execution.handler;

		if( outputMappings !== undefined ){
			for(var i = 0; i < outputMappings.length; i++){

				for(var j = 0; j < wfVariables.length; j++ ){
					if(outputMappings[i].first === wfVariables[j].name ){
						console.log( wfVariables[j].name  );
						console.log( req.body[outputMappings[i].second] );
						
						wfVariables[j].value = req.body[outputMappings[i].second];
						
					}
				}
			}
		}

		handler.currentTask = handler.currentTask.next;

		WorkflowExecution.update({ _id: execution._id },
			{ 'elements': elements, 'handler': handler, 'variables': wfVariables },
			function(err){
				if(err){
					console.log('error');
				}
				else{
					console.log('update succesful');
				}
				runner.runWorkflow(execution, res);
			});
	
	});

});

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

function executeTask(id){
	WorkflowExecution.findOne( { "_id" : id }, function(err, execution){

		var currentTask = execution.elements[execution.handler.currentTask.id]
		var wfVariables = execution.variables;
		var inputMappings = currentTask.inputMappings;

		if( inputMappings !== undefined ){
			for(var i = 0; i < inputMappings.length; i++ ){
				for(var j = 0; j < wfVariables.length; j++){
					if( inputMappings[i].second === wfVariables[j].name ){
						inputMappings[i].value = wfVariables[j].value;
					}
				}
			}
		}

		var thisElement = "elements." + execution.handler.currentTask.id + ".inputMappings";
		console.log(thisElement);
		WorkflowExecution.update({ _id: execution._id}, 
		{ thisElement : inputMappings }, 
		function(err){
			
			if(!err) {
				console.log('succesful update');
			}
			else{
				console.log('error');
			}
	
			
		});
		

	});
}


function mapping(){

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



module.exports = router;
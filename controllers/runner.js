var WorkflowExecution	= require('../models/WorkflowExecution.model');
var Service 			= require('../models/service.model');

exports.runTask = function(task){

}

exports.runWorkflow = function( execution, res){
	

	console.log('run workflow');

	var currentTask = execution.handler.currentTask;

	while( currentTask !== null ){

		if( currentTask.type === "user" ){
			execution.handler.currentTask = currentTask;
			break;
		}
		else if( currentTask.type === "service" ){
			runService(execution, currentTask);
		}


		currentTask = currentTask.next;
	}

	WorkflowExecution.update({ _id: execution._id}, 
		{ 'handler.currentTask': currentTask }, 
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

function runService(execution, currentTask){

	console.log('RUn service');
	var cc = execution.elements[currentTask.id];
	var wfVariables = execution.variables;

	Service.findOne({ '_id' : cc.serviceId }, function(err, result){
		if(err) console.log(err);
	
		var inputMappings = [];

		if( cc.inputMappings !== undefined ){
			inputMappings = cc.inputMappings;
		}

		for(var i = 0; i < inputMappings.length; i++ ){
			for(var j = 0; j < wfVariables.length; j++ ){
				if( inputMappings[i].second === wfVariables[j].name ){
					for(var k = 0; k < result.inputs.length; k++ ){
						console.log( " To >> " + result.inputs[k]);
					}
				}

			}
			
		}

		/*for(var i = 0; i < result.inputs.length; i++ ){
			
			for(var j = 0; j < wfVariables.length; j++ ){

				if( result.inputs[i].name === wfVariables[j].name ){
					console.log(result.inputs[i].name );
				}
			}
		}*/

		//console.log( "Service: ");
		//console.log( result);
	});


}


function mapInput( task ){

	if( task === undefined || task.inputMappings === undefined ){
		return;
	}
	console.log("map input");
	for(var i = 0; i < task.inputMappings.length; i++ ){
		console.log( task.inputMappings[i]);
	}
	console.log("=========");
	
}

function mapOutput(task){

	if( task === undefined || task.outputMappings === undefined ){
		return;
	}
	console.log("map output");
	console.log(task);
	console.log("=========");

}
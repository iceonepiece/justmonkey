var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: String,
	description: String,
	xml: String,
	variables: [
		{ 
			name: { type: String }, 
			type: { type: String }, 
			value: { type: String } 
		}
	],
	elements: mongoose.Schema.Types.Mixed
}, {strict: false});

module.exports = mongoose.model('TemplateWorkflow', schema);
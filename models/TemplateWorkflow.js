var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/monkey');

var schema = new mongoose.Schema({
	name: String,
	xml: String,
});

module.exports = mongoose.model('TemplateWorkflow', schema);
var express = require('express');
var exphbs	= require('express-handlebars');

var app = express();
var PORT = 5000;

app.engine('handlebars', exphbs( {defaultLayout: 'main'} ) );
app.set('view engine', 'handlebars');

app.use( express.static( __dirname + '/public' ) );

app.get('/workflowCreation', function(req, res){
	res.render('home');
});
app.get('/workflow',function(req,res){


	res.render('workflow');
});


app.listen( PORT, function() {
  	console.log('Node app is running on port', PORT );
});
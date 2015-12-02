var express 	= require('express');
var exphbs		= require('express-handlebars');
var bodyParser 	= require('body-parser');

var workflow 	= require('./controllers/workflow');

require('./database');

var app = express();
var PORT = 5000;

app.engine('handlebars', exphbs( {defaultLayout: 'main'} ) );
app.set('view engine', 'handlebars');

app.use( express.static( __dirname + '/public' ) );

// body-parser for post request
app.use( bodyParser.urlencoded({ extended: true }) );
app.use( bodyParser.json() );

app.get('/',function(req,res){
	res.render('index');
});


app.use('/workflow', workflow );


/*app.get('/workflowCreation', function(req, res){
	res.render('home');
});

app.get('/workflowExecution', function(req, res){
	res.end('Workflow Execution');
});

app.get('/workflow',function(req,res){
	res.render('workflow');
});*/


app.listen( PORT, function() {
  	console.log('Node app is running on port', PORT );
});
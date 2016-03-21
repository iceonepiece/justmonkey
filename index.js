var express 	= require('express');
var exphbs		= require('express-handlebars');
var bodyParser 	= require('body-parser');

var execution 	= require('./controllers/execution');
var workflow 	= require('./controllers/workflow');
var form 		= require('./controllers/form');
var service		= require('./controllers/service');


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

app.get('/testscript', function(req, res){

	var day, month, year;

	eval('var no = 2; var yes = 3; var ice = no + yes;');

	res.end( "SSS" + ice );
});

app.use('/execution', execution );
app.use('/workflow', workflow );
app.use('/service', service );
app.use('/form', form );

app.use(function(req, res, next){
	next(new Error('Not Found'));
});

app.use(function(err, req, res, next){
	res.render('error', {
		message: err.message
	});
});


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
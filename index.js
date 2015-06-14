var express = require('express'),
	app = express(),
	path = require('path');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/docs'));

app.get('/', function(request, response) {
	response.sendFile('index.html', { root: path.join(__dirname, '/docs/doxx_docs' )});
  // response.sendFile('./docs/doxx_docs/index.html');
});

app.get('/*', function(request, response) {
	console.log(request.url);
	response.sendFile(request.url, { root: path.join(__dirname, '/docs/doxx_docs' )});
	// response.sendFile(request.url, { root: __dirname + '/docs/doxx_docs' });
  
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

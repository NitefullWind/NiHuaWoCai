module.exports = function(app, dirname) {
	app.get('/', function(req, res) {
		res.sendFile(dirname+'/views/index.html');
	});
	app.post('/main', function(req, res) {
		res.cookie('username', req.body.username, {maxAge: 1000*60*60});
		res.sendFile(dirname+'/views/main.html');
	})
};
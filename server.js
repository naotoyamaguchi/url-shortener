const Hapi = require('hapi');
const server = new Hapi.Server();
const mongoose = require('mongoose');

var Url = require('./models/url.js');
var config = require('./config.js');
var base58 = require('./public/js/app.js');

mongoose.connect('mongodb://' + config.db.host + '/' + config.db.name, {useMongoClient: true});

server.connection({
	host: 'localhost',
	port: 8000
});

server.register(require('inert', 'hapi-bodyparser'), (err) => {
	if(err){
		throw err;
	}

	server.route({
		method: 'GET',
		path: '/',
		handler: function(request, reply){
			reply.file('./views/index.html');
		}
	});

	server.route({
		method: 'GET',
		path: '/css',
		handler: function(request, reply){
			reply.file('./public/css/styles.css');
		}
	});

	server.route({
		method: 'GET',
		path: '/js',
		handler: function(request, reply){
			reply.file('./public/js/shorten.js');
		}
	});

	server.route({
		method: 'GET',
		path: '/shorten',
		handler: function(request, reply){
			reply.file('./public/js/shorten.js');
		}
	});

	server.route({
		method: 'GET',
		path: '/{encoded_id}',
		handler: function(request, reply){
			var base58id = request.params.encoded_id;
			var id = base58.decode(base58id);

			Url.findOne({_id: id}, function (err, doc){
				if(doc){
					reply.redirect(doc.long_url);
				} else {
					reply.redirect(config.webhost);
				}
			});
		}
	});

	server.route({
		method: 'POST',
		path: '/api/shorten',
		handler: function(request, reply){
			// console.log("Req",request.payload.url);
			var originalUrl = request.payload.url;
			var shortUrl = '';

			Url.findOne({long_url: originalUrl} , function(err, doc){
				if(doc){
					//url has already been shortened / stored in DB
					console.log("doc", doc);
					shortUrl = config.webhost + base58.encode(doc._id);
					console.log("whats this?", shortUrl);
					reply({'shortUrl': shortUrl});
				} else {
					//create new entry
					var newUrl = Url({
						long_url: originalUrl
					});

					newUrl.save(function(err){
						if(err){
							console.log(err);
						}

						shortUrl = config.webhost + base58.encode(newUrl._id);
						reply({'shortUrl': shortUrl});
					});
				}
			});
		}
	});
});

// server.route({
// 	method: 'POST',
// 	path: '/api/shorten',
// 	handler: function(request, reply){
// 		console.log(request);
// 		var originalUrl = request.body.url;
// 		var shortUrl = '';

// 		Url.findOne({long_url: originalUrl} , function(err, doc){
// 			if(doc){
// 				//url has already been shortened / stored in DB
// 				shortUrl = config.webhost + base58.encode(doc._id);
// 				reply({'shortUrl': shortUrl});
// 			} else {
// 				//create new entry
// 				var newUrl = Url({
// 					long_url: originalUrl
// 				});

// 				newUrl.save(function(err){
// 					if(err){
// 						console.log(err);
// 					}

// 					shortUrl = config.webhost + base58.encode(newUrl._id);
// 					reply({'shortUrl': shortUrl});
// 				});
// 			}
// 		});
// 	}
// });



server.start((err) => {
	if(err){
		throw err;
	}
	//if no errors...
	console.log('Server running at: ', server.info.uri);
});
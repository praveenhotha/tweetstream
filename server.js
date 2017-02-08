var Hapi = require('hapi');

const server = new Hapi.Server();

server.connection({port:3000});

server.register([require('inert'), require('vision')], function(err){
	if(err) console.log(err);
});

// socket io
var io = require('socket.io')(server.listener);
var Twit = require('twit');
var T = new Twit({
	consumer_key:         'BPfiqsk8rHVDyDA0iU9244Hc2',
  	consumer_secret:      'LxGZU88NQy4nchGoh6KVOlwbaMUJO2WuYguxaQLcQM8PzEpKuC',
  	access_token:         '33171471-4vP6yiSCq9OYky4h5JPDO7Z6CrA4nd0C4ggqdVCqx',
  	access_token_secret:  '8RXtMKyeDtYW2318BUctTMcaRllEdE3iddNe2YzEioPqt',
  	timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
});


server.route({
	path: '/tweet/{query}',
	method: 'GET',
	handler: function(request, reply){
		getTweet(request.params.query);
		reply.file('index.html');
	}
});

function getTweet(query){
	console.log(query);
	var stream = T.stream('statuses/filter', {track: query});

	stream.on('tweet', function(tweet){
		console.log(tweet.text);
		io.sockets.emit('chatMessage',query, tweet.text);
	})
	return;
}
server.start(function(){
	console.log("server started at : "+server.info.uri);
})
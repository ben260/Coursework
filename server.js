//Node modules
var http = require("http");

// My own modules
var PostManager = require("./app/PostManager");
var GetManager = require("./app/GetManager");

// When a client makes a http request.
function onRequest(request,response)
{
	switch(request.method){
	case "GET":
		var get = new GetManager(request,response);
		break;
	case "POST":
		var post = new PostManager(request,response);
		break;
	default:
		console.log("error");
	}
}

// Set up server to listen for http requests.
http.createServer(onRequest).listen(80);
console.log("Server running!");



var puzzle = [
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0]
];

//generator.generate();
//console.log((stats.sigma([1,2,3],3)));

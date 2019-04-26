// Module to handle GET requests.
var fs =require("fs");
var path = require("path");
var db = require("./database");
var generator = require('./generator');

//404 response. Page not found.
function send404Response(response)
{
	response.writeHead(404, {"Context-Type": "text/plain"});
	response.write("404 error: Page not found.");
	response.end();
}

// Key and values for accepted file types.
var acceptedFileType = {
    '.js': 'application/javascript',
    '.html': 'text/html',
	'.css' : "text/css",
	'.jpg':"image/jpg"
};

function sendFile(request,response)
{
  var fileurl;
  // If no specific request deliver main page.
  if(request.url=="/") {fileurl="/index.html"}
  //Otherwise get the exact request.
  else {fileurl="/"+request.url;}
  //All files made for client are in the public folder.
  var filepath = path.resolve("public" + fileurl);
  //Get the file extension of the request.
  var fileExt = path.extname(filepath);
  //If the file extension isn't allowed then send 404 and stop.
  if(!acceptedFileType[fileExt]){send404Response(response);return;};

  //If the file doesn't exist then send 404, otherwise deliver.
  fs.exists(filepath, function(exists) {
    if (!exists) {send404Response(response);return;};
    //Code 200 status code is the standard response for successful HTTP requests.
    //Tell the client the file extension so it knows how to deal with the response.
    //Read the file and deliver contents.
    response.writeHead(200, { 'content-type': acceptedFileType[fileExt]});
    fs.createReadStream(filepath).pipe(response);
  });
}



/*
Get the statistics for the user
Send them a puzzle they have not already completed.
*/
function sendData(username)
{

	// Format of data to send.
	var data = {
		username:username,
		stats: {Rank:0,Points:0},
		nextpuzzleid:0,
		nextpuzzlebody:0
	}


	// Promise chain of database queries to make.

	// Get statistics for user and then get a list of puzzles they can't do.
	getUserStats(username).then(function(stats){
		// Got user stats.
		data.stats=stats;
		return getPreviouslyDone(username);
	})


	// After that, find the first puzzle that they can do.
	.then(function(cantdo){
		return getNextPuzzle(cantdo,username);
	})

	// We have the puzzle so send the data.
	.then(function(nextpuzzle){

		// add information to data.
		data.nextpuzzleid=nextpuzzle.PuzzleID;
		data.nextpuzzlebody=nextpuzzle.PuzzleBody;
		// Now we have the data send it.
		return data;
	}).catch(function(){

		// there weren't any puzzles so a new one was generated.
		// enter chain.
		sendData(username);
		//console.log(error);
		//response.statusCode=500;
		//response.end();
	});


}


// Get current user stats from database.
function getUserStats(username)
{
	return new Promise(function(resolve, reject) {
		// Database query to get user statistics.
		db.dbQuery("SELECT Points,PuzzleSum FROM Users WHERE Username='"+username+"'",function(stats){
			// Got user statistics [0]?
			var userstats= JSON.parse(JSON.stringify(stats[0]));
			userstats.Rank = Math.floor(userstats.Points/1000);
			resolve(userstats);
		});
	});
}

// Get a list of puzzles the user has already done.

function getPreviouslyDone(username)
{
	return new Promise(function(resolve, reject) {
		// Find the puzzles the user has already done.
		db.dbQuery("SELECT PuzzleID FROM userpuzzlelink WHERE Username ='"+username+"'", function(ids){
			// Store these puzzles, make sure the user doesn't get the same puzzle twice.
			var cantdolist=[];
			ids.forEach((entry)=>{
				cantdolist.push(entry.PuzzleID);
			});

			if(cantdolist.length!=0){
				cantdolist.join(',');
				cantdolist = "(" + cantdolist + ")";
				console.log(cantdolist);
			}
			resolve(cantdolist);

	  });
	});
}

// Get next puzzle for user, generate a new one if there's none they can do.
function getNextPuzzle(cantdolist,username)
{
	return new Promise(function(resolve, reject) {
		db.dbQuery("SELECT PuzzleID,PuzzleBody FROM Puzzles WHERE PuzzleID NOT IN "+cantdolist,function(cando){

			try
			{
					var x =cando[0];
					resolve(x);
			}
			catch
			{
				console.log("no puzzles");
				generator.generate(function()
				{
					console.log("new puzzle built. starting search again.");
					reject();
				});
			}
		});
	});
}


module.exports = function(request,response)
{
	var reg = /gamedata/;

	if(reg.test(request.url)){
		/*var test = sendData(request.url.replace("/", "").replace("gamedata","")).then(){

		};*/
		console.log("requist");

	}
  else{
        sendFile(request,response);
  }
}

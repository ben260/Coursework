/*




*/

var authorise = require('./authorise');
var datahandler = require('./pushdata');
var stats = require('./points');

module.exports = function(request,response){
  //get the post data
  var data = '';
	// read chunks of POST data
  request.on('data', chunk => {
		data += chunk.toString();
  });

  //when it's finished respond.
	request.on('end', () => {
    //Turn back into object
    data=JSON.parse(data);

    switch(data.type) {
  	case "login":
  		authorise.login(data,response);
  		break;
  	case "signup":
  		authorise.signup(data,response);
  		break;
    case "gamestatistic":

      console.log("We've got info");
      console.log(data);
      datahandler.pushdata(data.username,data.puzzleid,data.time).then(function(){
        stats.updatePoints(data.username,data.puzzleid,data.time);
        console.log("done");
      });
  	default:
  		console.log("unknown");
  	}
  });

}

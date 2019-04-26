/*

validates the user's login details,
or signs them up to the website.

*/
var db = require("./database");

// Create new account
function signup(data,response)
{
  // Check that the username isn't already in use before making the new account.
  db.dbQuery("SELECT Username FROM users WHERE Username ='"+data.username+"'",function(result){
    if(result.length==0)
  	{
  		db.dbQuery("INSERT INTO users (Username,Password) VALUES ('"+data.username+"','"+data.password+"')",function(result){
  				response.statusCode=200;
  				response.write("account created");
  				response.end();
  		});
  	}
  		else
  		{
  			response.statusCode=500;
  			response.write("Username already in use");
  			response.end();
  		}
  	});
}




function login(data,response)
{
  //Is this a valid login?
  db.dbQuery("SELECT Username,Password FROM users WHERE Username ='"+data.username+"' AND Password='"+data.password+"'",function(result){

    // Now we have the result.
    // Do the passwords match?
    if(result.length==0)
    {
      response.statusCode=500;
      response.write("username or password incorrect");
    }
    else
    {
      if(result[0].Password==data.password)
      {
        response.statusCode=200;
        response.write("login successful");
      }
      else
      {
        response.statusCode=500;
        response.write("username or password incorrect");
      }
    }
    response.end();
  });
}


module.exports.login=login;
module.exports.signup=signup;

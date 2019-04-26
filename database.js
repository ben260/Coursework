var mysql = require("mysql");

function getConnection()
{
	var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "12345",
	database: "puzzlemaster"
	});

	return connection;
}

//Make a query and get the result.
//when it's finished, take a call back function.
function dbQuery(query,callback)
{
	getConnection().connect(function(err) {

		if (err) throw err;

		getConnection().query(query,function(err,result){
			callback(result);
		});
	});
}


module.exports.dbQuery=dbQuery;

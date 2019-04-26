/*
push data

*/

var db = require('./database.js');


module.exports.pushdata = function (username,puzzleid,time){

  return new Promise(function(resolve, reject) {

    // The user has completed a puzzle, so add one to their puzzle count.
    updateUserPuzzleSum(username).then(function(){
      console.log("updated puzzle sum for user " + username);
    });

    // In UserPuzzleLink add their name and the puzzle they completed
    addPuzzleRecord(puzzleid,username).then(function(){
      console.log("added a new record completed puzzle for user " + username);
    });

    // Update the list of times recorded for the puzzle.
    updatePuzzleTimes(puzzleid,time).then(function(){
      console.log("finally updated puzzle times...");
      resolve();
    });

  });
}


// The user has completed a puzzle so add one to their completed puzzle number
function updateUserPuzzleSum(username)
{
  return new Promise(function(resolve, reject) {
    db.dbQuery("UPDATE Users SET PuzzleSum = PuzzleSum + 1 WHERE Username = '"+username+"'",function(result){
      resolve();
    });});
}



function addPuzzleRecord(puzzleid,username)
{
  return new Promise(function(resolve, reject) {
  db.dbQuery("INSERT INTO UserPuzzleLink (Username,PuzzleID) VALUES('"+username+"',"+puzzleid+")",function(){
        resolve();
  });});
}



function updatePuzzleTimes(puzzleid,timetoadd)
{
  return new Promise(function(resolve, reject){
    db.dbQuery("SELECT Times FROM Puzzles WHERE PuzzleID = '"+puzzleid+"'",function(result)
    {

      var test = result[0].Times;

      if(test==""){
      
        var entry=timetoadd;
      }
      else{
        var meep=test;
        meep=meep + "," + timetoadd;
        var entry = meep;
      }

      // add the updated time.
      db.dbQuery("UPDATE Puzzles SET Times ='"+ entry +"' WHERE PuzzleID ="+puzzleid,function(result){
        console.log(result);
        resolve();
      });
    });
  });
}

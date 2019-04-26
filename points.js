var db = require('./database.js');

module.exports.updatePoints= calculatePoints;

function calculatePoints(username,puzzleid,time){

  db.dbQuery("SELECT Times FROM Puzzles WHERE PuzzleID ="+puzzleid,function(result){

    var puzzletimes =JSON.parse(JSON.stringify(result))[0].Times;

    var listofpuzzletimes = puzzletimes.split(",");

    // now we have the array of times, calculate how well a user did.
    var z = zScore(listofpuzzletimes,time);

    // Points to give user
    var points;
    if(z < 1 && z > -1){
      console.log("average 50 points!");
      points=100;
    }
    else if(z >1){
      console.log("below average");
      points=50;
    }
    else if(z <1){
      console.log("really good average :()");
      points=150;
    }

    db.dbQuery("UPDATE Users SET Points = Points + " + points + "WHERE Username ='"+username+"'",function(){
      console.log("updated points");
    });
  });



}

function zScore(data,time)
{
  var mean;
  var sum=0;
  // calculate average score.
  data.forEach(function(element){
    element=parseInt(element);
    sum+=element;
  });
  console.log(sum);
  mean = sum/ data.length;
  console.log(mean);

  // sum of squared distances from the mean.
  var ssdfm=0;
  data.forEach(function(element){
    let dfm = element - mean;
    ssdfm +=dfm**2;
  });

  // standard deviation.
  var sigma = Math.sqrt(squaredfm/data.length);
  // how many standard deviations you are above or below mean.
  var z =(time-mean)/sigma;

  return z;
}

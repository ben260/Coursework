class GameController extends HTMLDivElement
{
  lobby(username)
  {
    // Remember username for as long as the user is logged in.
    this.username=username;
    // Set welcome message for user
    welcomemsg.innerHTML="Welcome " + username;
    // Reset game button text
    play.innerHTML="Start new puzzle";
    // 'Get' the user's next puzzle and statistics from the server.
    var link = username + "gamedata";

    // Http get request using global function that I defined previously.
    httpRequest('get',link,(response) =>{

      // Success
      var data = JSON.parse(response);

      // allow the user to start the game using the button.
      play.hidden=false;

      // show the user's statistics.
      stats.show=data.stats;
      console.log(data);
      // set the puzzle for the user.
      puzzle.Puzzle=data.nextpuzzlebody;

      this.puzzleid=data.nextpuzzleid;
      // Display the puzzle's number.
      puzzleNumber.innerHTML="Puzzle: " + data.nextpuzzleid;
    });
  }

  // When game has finished, push the statistic gathered to server.
  // Put user back in lobby
  finish(data)
  {
    // Gather the data to send back to the server.
    // Time in minutes to save space in the database.
    let statistic = {
      time: Math.round(data/60),
      username: this.username,
      puzzleid:this.puzzleid,
      type: "gamestatistic"
    };

    // Http request to post object as a string in json format.
    httpRequest('post',statistic,function(response){
      this.lobby(this.username);
    });
    console.log(statistic);
  }
}

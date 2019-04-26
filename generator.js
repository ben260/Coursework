var solver = require('./solver');
var db = require('./database');


function build(finish)
{
  // take the empty emptyboard
  // prep puzzle,
  // solve puzzle,
  // take away clues.
  // This is the empty puzzle before anything is done to it.
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


  // Prepare the puzzle
  var x,y;
  for(var i=0;i<9;i++)
  {
     x = Math.floor(Math.random() * 8);
     y = Math.floor(Math.random() * 8);

     puzzle[y][x]=Math.floor(Math.random()*8);
  }



  puzzle=solver.solve(puzzle);
  if(puzzle==undefined){
    build(finish);
    return;
  }
  //return;//return puzzle;
  // if the puzzle is undefined start again.
  // give clues

  for(var i=0;i<38;i++){

     x = Math.floor(Math.random() * 8);
     y = Math.floor(Math.random() * 8);

    //console.log(puzzle);
    puzzle[y][x]=0;
  }
  finish(puzzle);
}


function generate(callback){

  // Once you have a new puzzle, add it to the database with blank puzzle stats.

  build(function(puzzle) {
      //console.log(puzzle);
      // finished building new puzzle, add to database.
      db.dbQuery("INSERT INTO Puzzles (PuzzleBody) VALUES ('"+JSON.stringify(puzzle)+"')",function(result){
        // finished.

        callback();
      });
  });
}



module.exports.generate=generate;

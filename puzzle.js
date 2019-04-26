class Puzzle extends HTMLTableElement
{
  // When a new instance of a puzzle is created.
  constructor()
  {
    // Allow access to parent class methods.
    super();
    // Don't let them enter any numbers until the game begins.
    this.allowInput=false;
    // Time in seconds.
    this.timeElapsed=0;

    // Set event listener on parent so it can detect event propagation from children.
    this.addEventListener("change",function(event)
    {
  
      // if game paused don't allow input.
      if(!(this.allowInput)){event.target.value="";return;}
      // get the x and y from the id.
      var x = event.target.id[0];
      var y = event.target.id[1];

      // Don't let the user make an illegal move.
      if(!(this.isValidMove(x,y,event.target.value)))
      {
        // Remove illegal move from table.
        event.target.value="";
        // Remove illegal move from puzzle array.
        this.puzzle[y][x]=0;
        // Red error box.
        event.target.style.backgroundColor="red";
        // After 1/2 a second restore colour.
        setTimeout(function(e){
          e.target.style.backgroundColor="";
        }, 500,event);
        // Don't progress any further.
        return;
      }
      // Update the puzzle array to reflect the entry in the html table.
      this.puzzle[y][x]=parseInt(event.target.value);

      // If the puzzle is finished reset timer and send time.
      if(this.isValidPuzzle())
      {
        // notify user.
        alert(`You finished the puzzle in ${this.getTime().minutes} minute(s) and
        ${this.getTime().seconds} seconds`);
        // send statistic
        game.finish(this.timeElapsed);
        // Reset timer.
        this.timeElapsed=0;
        this.stopTimer();
      }

    });
  }

  // Setup new puzzle for a user and display it.
  set Puzzle(puzzle){this.puzzle=puzzle;this.display(this.puzzle);};

  // A two dimensional array is an array of arrays in JavaScript.
  display(puzzle)
  {
    this.innerHTML="";
    // For each row in the two dimensional array filled with the puzzle (y)
    puzzle.forEach((elementY,y) => {
      // Create a row to add to the table.
      var row = document.createElement("tr");
      // Look at each element. (x coordinate)
      elementY.forEach((elementX,x) =>{
        // Create new cell
        var cell = document.createElement("td");
        // Create new text box for number.
        var cellText = document.createElement('input');
        cellText.classList.add('square');

        // If the number at this position is a starting element.
        if(elementX!=0)
        {
          cellText.disabled=true;
          cellText.style.fontWeight = 'bold';
          cellText.value=elementX;
        }

        // Give the text box an id so it can be referred back to later.
        cellText.id=`${x}${y}`;
        cellText.maxLength=1;
        // Append the text box to the cell and then the cell to the row.
        cell.appendChild(cellText);
        row.appendChild(cell);
      });
      // Finally append this row to the table. (this class inherits all functionality of a table element.)
      this.append(row);
    });
  }

  // Check if a number placement follows the constraints given to it by the rules of sudoku.
  isValidMove(x,y,number)
  {
    // Don't allow any non numbers.
    if(isNaN(number)){
      return false;
    }

    // horizontal check if move is illegal.
    for(var i=0;i<9;i++)
	  {
      if(number == this.puzzle[y][i]){
        return false;
      }
		}

    // vertical check if move is illegal.
    for(var j=0;j<9;j++)
    {
      if(number == this.puzzle[j][x]){
        return false;
      }
    }

    // Check 3x3 box
    // A new box starts every multiple of three for both the x and y axis.
    // The beginning of each box is the nearest multiple of three to the coordinate rounded down.
    // This is explained in more detail in the design section.
    var startY = Math.floor(y/3) *3;
    var startX = Math.floor(x/3) * 3;
    // Now do the check for conflicting numbers.
    for(let m=startY;m<(startY+3);m++)
    {
      for(let n=startX;n<(startX+3);n++)
      {
        if(this.puzzle[m][n]==number)
        {
          return false;
        }
      }
    }
    // If move legal return true.
    return true;
  }

  isValidPuzzle()
  {
    for(let y=0;y<9;y++)
    {
      if(this.puzzle[y].includes(0)){
        // The puzzle isn't finished if any zeros still remain.
        return false;
      }
    }
    // If it's a valid puzzle return true.
    return true;
  }


  // Get the current time
  getTime()
  {
    // return minutes and seconds as an object.
    var minutes=Math.floor(this.timeElapsed / 60);
    var seconds= this.timeElapsed - minutes * 60;
    var time = {
      minutes:  minutes,
      seconds: seconds
    };
    return time;
  }


  startTimer()
  {
    // Begin a set interval and show the time live on screen.
    this.timer = setInterval(() =>{
      this.timeElapsed++;
      var x = this.getTime().minutes + " minute(s), "+this.getTime().seconds+"seconds";
      document.getElementById("puzzleTime").innerHTML=x;
    },1000);
  }


  // Stop the timer.
  stopTimer()
  {
    //clear a the interval.(the time is still stored as a property of the object)
    clearInterval(this.timer);
  }


}

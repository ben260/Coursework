class PlayButton extends HTMLButtonElement
{
  constructor()
  {
    super();
    // Hide the button on page load.
    this.hidden=true;

    // When the button is clicked start or pause the game.
    this.onclick = () =>
    {
      switch(this.innerHTML)
      {
        case "Pause":
          this.innerHTML="Play";
          puzzle.stopTimer();
          puzzle.allowInput=false;
          break;
        case "Play":
          this.innerHTML="Pause";
          puzzle.startTimer();
          puzzle.allowInput=true;
          break;
        case "Start new puzzle":
          this.innerHTML="Pause";
          puzzle.allowInput=true;
          puzzle.startTimer();
          break;
        default:
          this.innerHTML="error";
      }
    }
  }
}

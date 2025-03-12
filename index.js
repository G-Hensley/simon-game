let gamePattern = [];
let buttonColors = ["blue", "green", "red", "yellow"];
let gameActive = false;
let level = 1;
let playerTurn = false;

const nextSequence = function () {
  let nextNum = Math.floor(Math.random() * 4);
  gamePattern.push(buttonColors[nextNum]);
};

const runSequence = function () {
  gamePattern.forEach((color, index) => {
    setTimeout(() => {
      $("." + color).addClass("pressed");

      setTimeout(() => {
        $("." + color).removeClass("pressed");
      }, 500);
    }, index * 800);
  });
};

const startGame = function (play) {
  $("body").on("keypress", function pressA(event) {
    if (event.which === 97) {
      // Check for 'a' key press
      gameActive = true;
      level = 1;
      gamePattern = [];
      $("body").off("keypress", pressA); // Remove the keypress listener
      play(); // Start the game
    }
  });
};

const playersTurn = function () {
  let counter = 0;
  playerTurn = true;

  const clickHandler = function (color) {
    return function () {
      if (!gameActive || !playerTurn) return; // Ignore clicks if the game is not active or it's not player's turn

      $("." + color).addClass("pressed");
      setTimeout(() => {
        $("." + color).removeClass("pressed");
      }, 500);

      if (color != gamePattern[counter]) {
        $("body").addClass("game-over");
        $("h1").text("Game Over, Press A to Restart");
        gameActive = false;
        playerTurn = false;
        $("body").on("keypress", startGame(playGame));
        // Remove click handlers to stop further actions
        buttonColors.forEach((c) => {
          $("#" + c).off("click");
        });
      } else {
        counter++;
        if (counter === gamePattern.length) {
          level++;
          playerTurn = false;
          setTimeout(() => {
            playGame(); // Continue to the next level
          }, 500);
        }
      }
    };
  };

  buttonColors.forEach((color) => {
    $("#" + color)
      .off("click")
      .on("click", clickHandler(color));
  });
};

const playGame = function () {
  if (gameActive) {
    $("h1").text("Level " + level);
    nextSequence();
    setTimeout(() => {
      runSequence();
      setTimeout(() => {
        $("h1").text("Your Turn");
        playersTurn();
      }, gamePattern.length * 800 + 200);
    }, 1000);
  }
};

startGame(playGame);

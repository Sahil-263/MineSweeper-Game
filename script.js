document.addEventListener("DOMContentLoaded", function () {
    const grid = document.querySelector(".board");
    const flagsLeft = document.querySelector("#flagsLeft");
    const result = document.querySelector("#result");
    const width = 10;
    let bombAmount = 20;
    let squares = [];
    let isGameOver = false;

  function createBoard() {
    flagsLeft.innerHTML = bombAmount;

    // get shuffled game array with random bombs
    const bombsArray = Array(bombAmount).fill("bomb");
    const emptyArray = Array(width * width - bombAmount).fill("valid");
    const gameArray = emptyArray.concat(bombsArray);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("id", i);
      square.classList.add(shuffledArray[i]);
      grid.appendChild(square);
      squares.push(square);

      // Left-click event
      square.addEventListener("click", function () {
        click(square);
      });

      // Right-click event for flagging
      square.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        addFlag(square);
      });
    }

    // Adding numbers after all squares are created
    for (let j = 0; j < squares.length; j++) {
      let total = 0;
      const isLeftEdge = j % width === 0;
      const isRightEdge = j % width === width - 1;

      if (squares[j].classList.contains("valid")) {
        if (j > 0 && !isLeftEdge && squares[j - 1].classList.contains("bomb"))
          total++;
        if (
          j > 9 &&
          !isRightEdge &&
          squares[j + 1 - width].classList.contains("bomb")
        )
          total++;
        if (j > 10 && squares[j - width].classList.contains("bomb")) total++;
        if (
          j > 11 &&
          !isLeftEdge &&
          squares[j - 1 - width].classList.contains("bomb")
        )
          total++;
        if (j < 98 && !isRightEdge && squares[j + 1].classList.contains("bomb"))
          total++;
        if (
          j < 90 &&
          !isLeftEdge &&
          squares[j - 1 + width].classList.contains("bomb")
        )
          total++;
        if (
          j < 88 &&
          !isRightEdge &&
          squares[j + 1 + width].classList.contains("bomb")
        )
          total++;
        if (j < 89 && squares[j + width].classList.contains("bomb")) total++;
        squares[j].setAttribute("data", total);
      }
    }
  }

    createBoard();
    
    function addFlag(square) { 
        if (isGameOver) return;
        if (!square.classList.contains("checked") && (flagsLeft.innerHTML > 0)) {
            if (!square.classList.contains("flag")) {
                square.classList.add("flag");
                square.innerHTML = "🚩";
                flagsLeft.innerHTML--;
                checkForWin();
            }
            else {
                square.classList.remove("flag");
                square.innerHTML = "";
                flagsLeft.innerHTML++;
            }
        }
    }

    function click(square) {
        if (
            isGameOver ||
            square.classList.contains("checked") ||
            square.classList.contains("flag")
        )
            return;
        if (square.classList.contains("bomb")) {
            gameOver();
        }
        else {
            let total = square.getAttribute("data");
            if (total != 0) {
                if (total == 1) square.classList.add("one");
                if (total == 2) square.classList.add("two");
                if (total == 3) square.classList.add("three");
                if (total == 4) square.classList.add("four");

                square.innerHTML = total;
                return;
            }
            checkSquare(square);
        }
        square.classList.add("checked");

    }



    function checkSquare(square) { 
        const isLeftEdge = square.id % width === 0;
        const isRightEdge = square.id % width === width - 1;

        setTimeout(function () {
            if (square.id > 0 && !isLeftEdge) {
                const newId = squares[parseInt(square.id) - 1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (square.id > 9 && !isRightEdge) {
                const newId = squares[parseInt(square.id) + 1 - width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (square.id > 10) {
                const newId = squares[parseInt(square.id - width)].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (square.id > 11 && !isLeftEdge) {
                const newId = squares[parseInt(square.id) - 1 - width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (square.id < 98 && !isRightEdge) {
                const newId = squares[parseInt(square.id) + 1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (square.id < 90 && !isLeftEdge) {
                const newId = squares[parseInt(square.id) - 1 + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (square.id < 88 && !isRightEdge) {
                const newId = squares[parseInt(square.id) + 1 + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (square.id < 89) {
                const newId = squares[parseInt(square.id) + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
        
            
        }, 100);
    }
    function checkForWin() {
        let matches = 0;

        for (let i = 0; i < squares.length; i++) {
            if (
                squares[i].classList.contains("flag") &&
                squares[i].classList.contains("bomb")
            ) {
                matches++;
            }
            if (matches === bombAmount) {
                document.getElementById("result").innerHTML = "YOU WIN!";
                document.getElementById("result").style.color = "green";
                isGameOver = true;
            }
        }
    };

    function gameOver() {
        document.getElementById("result").innerHTML = "BOOM! Game Over!";
        const explosionSound = new Audio("explosion.mp3");
                document.getElementById("result").style.color = "red";

        isGameOver = true;

        // show all the bombs
        squares.forEach((square) => {
            if (square.classList.contains("bomb")) {
                square.innerHTML = "💣";
                square.style.background = "red";
                explosionSound.play();
                square.classList.remove("bomb");
                square.classList.add("checked");
            }
        });
    
    }
});

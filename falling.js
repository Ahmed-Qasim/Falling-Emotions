// variables
let main = document.querySelector(".grid");
let cells = Array.from(document.querySelectorAll(".grid div"));
let scoreDisplay = document.querySelector("#score");
let gameOverDisplay = document.querySelector("#gameOver");
let startBtn = document.querySelector("#startBtn");

let emojiScores = {
  "images/angry.jpg": 0,
  "images/careless.jpg": 0,
  "images/disoriented.jpg": 0,
  "images/laugh.jpg": 0,
  "images/love.jpg": 0,
};

let totalScore = 0;
const lastScore = localStorage.getItem("totalScore");
// totalScore = parseInt(highestScore) || totalScore;

console.log("emojiScorses :>> ", emojiScores);

// modal
let modal = document.getElementById("myModal");
let noBtn = document.querySelector("#hide");
let yesBtn = document.querySelector("#reset");
let modalScore = document.querySelector("#lastScore");
modalScore.innerHTML = lastScore;

let step = 10;
let idInterval;
let timerInterval;
let image = document.querySelectorAll("img");
let timer = 119;
let countDownTimer = document.getElementById("timer");

const imgArray = [
  "angry.jpg",
  "careless.jpg",
  "disoriented.jpg",
  "laugh.jpg",
  "love.jpg",
];

let randomIndex = Math.floor(Math.random() * imgArray.length);

fallenImg = imgArray[randomIndex];

currentFallingPos = Math.floor(Math.random() * 10);
let img = document.createElement("img");

//////////functions
const fillScore = () => {
  let laughScore = document.querySelector("#laugh");
  laughScore.innerHTML = `${emojiScores["images/laugh.jpg"]}`;
  let angryScore = document.querySelector("#angry");
  angryScore.innerHTML = `${emojiScores["images/angry.jpg"]}`;
  let carelessScore = document.querySelector("#careless");
  carelessScore.innerHTML = `${emojiScores["images/careless.jpg"]}`;
  let disorientedScore = document.querySelector("#disoriented");
  disorientedScore.innerHTML = `${emojiScores["images/disoriented.jpg"]}`;
  let loveScore = document.querySelector("#love");
  loveScore.innerHTML = `${emojiScores["images/love.jpg"]}`;
  scoreDisplay.innerHTML = totalScore;
};
fillScore();
startBtn.addEventListener("click", toggle);

function drawEmoji() {
  img.src = `images/${fallenImg}`;
  cells[currentFallingPos].append(img);
}
function unDrawEmoji() {
  img.remove();
}

function moveDown() {
  unDrawEmoji();
  currentFallingPos += step;
  drawEmoji();
  stop();
}

function stop() {
  if (cells[currentFallingPos + step].classList.contains("stop")) {
    cells[currentFallingPos].classList.add("stop");
    randomIndex = Math.floor(Math.random() * imgArray.length);
    fallenImg = imgArray[randomIndex];
    currentFallingPos = Math.floor(Math.random() * 10);
    img = document.createElement("img");
    img.src = `images/${fallenImg}`;
    findRowOfThree();
    findColumnOfThree();
    drawEmoji();

    gameOver();
  }
}
// movements modules
function moveLeft() {
  unDrawEmoji();
  const leftEdge = currentFallingPos % step == 0;
  if (!leftEdge) {
    currentFallingPos -= 1;
  }
  if (cells[currentFallingPos].classList.contains("stop")) {
    currentFallingPos += 1;
  }
  drawEmoji();
}
function moveRight() {
  unDrawEmoji();
  const rightEdge = currentFallingPos % step == step - 1;
  if (!rightEdge) {
    currentFallingPos += 1;
  }
  if (cells[currentFallingPos].classList.contains("stop")) {
    currentFallingPos -= 1;
  }
  drawEmoji();
}
function moveDown() {
  unDrawEmoji();
  if (!cells[currentFallingPos + step].classList.contains("stop")) {
    currentFallingPos += step;
  }
  drawEmoji();
  stop();
}

function control(e) {
  if (e.key == "ArrowLeft") {
    moveLeft();
  }
  if (e.key == "ArrowRight") {
    moveRight();
  }
  if (e.key == "ArrowDown") {
    moveDown();
  }
}

// Start/ puase the Game
function toggle() {
  if (idInterval) {
    clearInterval(idInterval);
    clearInterval(timerInterval);
    idInterval = null;
    timerInterval = null;
    document.removeEventListener("keydown", control);
  } else {
    drawEmoji();
    idInterval = setInterval(moveDown, 200);
    timerInterval = setInterval(startTimer, 1000);
    document.addEventListener("keydown", control);
  }
}

// game over
function gameOver() {
  if (
    cells[currentFallingPos + step].classList.contains("stop") ||
    timer == 0
  ) {
    gameOverDisplay.innerHTML = "Game Over";
    clearInterval(timerInterval);
    clearInterval(idInterval);
    startBtn.removeEventListener("click", toggle);
    document.removeEventListener("keydown", control);
    setTimeout('modal.style.display = "block"', 2000);
    localStorage.setItem("totalScore", totalScore);
  }
}
// Countdown

function startTimer() {
  let minutes = Math.floor(timer / 60);
  let seconds = timer % 60;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  if (timer == 0) {
    clearInterval(timerInterval);
    gameOver();
  }
  countDownTimer.innerHTML = `${minutes} : ${seconds}`;
  timer--;
}
// }, 1000);

// console.log("object :>> ", cells[0].querySelector("img").src);

const getCellColumnCells = (cellIndex) => {
  //define empty array for saving column indices
  let columnCells = [];
  // get last element in the array if available, or use cell index
  let lastItemIndex = cellIndex;
  // check if last element in the array -10 >=0 to check if it's the last cell in the column
  while (lastItemIndex - 10 >= 0) {
    //get the above cell index
    const aboveCellIndex = lastItemIndex - 10;

    // push index to the array
    columnCells.push(aboveCellIndex);
    // save last value
    lastItemIndex = aboveCellIndex;
  }
  return columnCells;
};
function findRowOfThree() {
  // cellIndex === index on the element in the full grid
  for (let cellIndex = 0; cellIndex < cells.length - 12; cellIndex++) {
    let rowOfThree = [cellIndex, cellIndex + 1, cellIndex + 2];
    let blank = cells[cellIndex].innerHTML === "";
    let mutualSrc =
      !blank && cells[cellIndex].querySelector("img").getAttribute("src");

    const notvalid = [
      8, 9, 18, 19, 28, 29, 38, 39, 48, 49, 58, 59, 68, 69, 78, 79, 88, 89, 98,
      99, 108, 109, 118, 119, 128, 129, 138, 139, 148, 149, 150, 151, 152, 153,
      154, 155, 156, 157, 158, 159,
    ];
    if (notvalid.includes(cellIndex)) continue;

    const isValidRow = rowOfThree.every((item, index) => {
      return (
        cells[rowOfThree[index]].innerHTML != "" &&
        cells[rowOfThree[index]].querySelector("img").getAttribute("src") ===
          mutualSrc
      );
    });
    // console.log("isValidRow :>> ", isValidRow);

    if (isValidRow) {
      let scoreSrc = cells[cellIndex].querySelector("img").getAttribute("src");
      emojiScores[scoreSrc] += 1;
      totalScore += 1;
      fillScore();
      // console.log("emojiScores :>> ", emojiScores);

      // empty and localize
      rowOfThree.forEach((itemIndex) => {
        cells[itemIndex].innerHTML = "";
        cells[itemIndex].classList.remove("stop");
        // get all cells in the column
        const columnCellsIndicies = getCellColumnCells(itemIndex);
        // move every item to previous item
        columnCellsIndicies.forEach((cellIndex, index) => {
          const sourceCell = cells[cellIndex];
          const destinationCellIndex =
            index === 0 ? itemIndex : columnCellsIndicies[index - 1];
          const destinationCell = cells[destinationCellIndex];
          //check if cell not blank
          if (sourceCell.innerHTML != "") {
            // save image in temp var before remove
            const tempImg = sourceCell.querySelector("img");
            // move every cell one step down (remove old image - draw image again)
            sourceCell.innerHTML = "";
            sourceCell.classList.remove("stop");
            destinationCell.append(tempImg);
            destinationCell.classList.add("stop");
          }
        });
        // insertPlace = parseInt(index.toString().split("").slice(-1));
      });
    }
  }
}

function findColumnOfThree() {
  // cellIndex === index on the element in the full grid
  for (let cellIndex = 0; cellIndex < 130; cellIndex++) {
    let columnOfThree = [cellIndex, cellIndex + step, cellIndex + step * 2];
    let blank = cells[cellIndex].innerHTML === "";
    let mutualSrc =
      !blank && cells[cellIndex].querySelector("img").getAttribute("src");

    const isValidColumn = columnOfThree.every((item, index) => {
      return (
        cells[columnOfThree[index]].innerHTML != "" &&
        cells[columnOfThree[index]].querySelector("img").getAttribute("src") ===
          mutualSrc
      );
    });

    if (isValidColumn) {
      // set score of every emoji in loclal storage
      let scoreSrc = cells[cellIndex].querySelector("img").getAttribute("src");
      emojiScores[scoreSrc] += 1;
      totalScore += 1;
      // empty and localize
      columnOfThree.forEach((itemIndex) => {
        cells[itemIndex].innerHTML = "";
        cells[itemIndex].classList.remove("stop");

        // move every item to previous item
        const columnCell2Indicies = getCellColumnCells(itemIndex);

        columnCell2Indicies.forEach((cellIndex, index) => {
          const sourceCell = cells[cellIndex];
          const destinationCellIndex =
            index === 0 ? itemIndex : columnCell2Indicies[index - 1];
          const destinationCell = cells[destinationCellIndex];
          //check if cell not blank
          if (sourceCell.innerHTML != "") {
            // save image in temp var before remove
            const tempImg = sourceCell.querySelector("img");
            // move every cell one step down (remove old image - draw image again)
            sourceCell.innerHTML = "";
            sourceCell.classList.remove("stop");
            destinationCell.append(tempImg);
            destinationCell.classList.add("stop");
          }
        });
      });
      // get all cells in the column
    }
  }
}

// modal
yesBtn.onclick = function () {
  window.location.reload();
  modal.style.display = "none";
};
noBtn.onclick = function () {
  modal.style.display = "none";
};

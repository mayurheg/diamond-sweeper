document.onreadystatechange = function() {
  if (document.readyState === "complete") {
    render();
    addDiamonds();
  }
};

let prevSteps;
let nextSteps;
let prevFound;
let stepFound;

/**
 * Contruct 8*8 grid
 * @author: mayurheg@gmail.com
 */
function render() {
  let gridNo = 8;
  let gridContainer = document.getElementById("grid_container");
  let btnIdCounter = 1;
  let diamondCounter = 0;

  for (let i = 0; i < gridNo; i++) {
    for (let j = 0; j < gridNo; j++) {
      let btnEle = document.createElement("button");
      btnEle.innerHTML = "<img src='images/question-icon.png'/>";
      btnEle.className = "btn diamond-btn";
      btnEle.setAttribute("id", btnIdCounter);
      btnEle.onclick = function(e) {
        this.setAttribute("close", "");

        let arrowEle = document.querySelector("img[arrow]");
        if (arrowEle) {
          arrowEle.remove();
        }

        if (this.hasAttribute("diamond")) {
          this.innerHTML = "<img src='images/diamond-icon.png'/>";
          diamondCounter++;
          if (diamondCounter >= 8) {
            alert("Game Over! Your score: " + getUserScore());
          }
        } else {
          let side = findClosestDiamond(this);
          if (side === "prev") {
            this.innerHTML = "<img arrow src='images/prev.png'/>";
          } else {
            this.innerHTML = "<img arrow src='images/next.png'/>";
          }
        }
      };
      gridContainer.appendChild(btnEle);
      btnIdCounter++;
    }
    gridContainer.appendChild(document.createElement("br"));
  }
}

/**
 * Adds diamond to the grid.
 */
function addDiamonds() {
  let randNoArr = generateUniqueRandomNo(1, 64, 8);
  for (let randNo of randNoArr) {
    let btnEle = document.getElementById(randNo);
    if (btnEle) {
      btnEle.setAttribute("diamond", "");
    }
  }
}

/**
 * Generates unique random numbers between 1 to 64
 * @param {number} min Min value
 * @param {number} max Max value
 * @param {number} count Count of random numbers
 * @return {number} Unique random number
 */
function generateUniqueRandomNo(min, max, count) {
  let randNoArr = [];
  while (randNoArr.length < count) {
    let randNo = Math.floor(Math.random() * (max - min + 1)) + min;
    if (randNoArr.indexOf(randNo) > -1) {
      continue;
    }
    randNoArr.push(randNo);
  }
  return randNoArr;
}

/**
 * Calculates final user score
 * @return {number} user score
 */
function getUserScore() {
  return document.querySelectorAll("button:not([close])").length;
}

/**
 * Finds the closest hidden diamond before clicked square
 * @param {element} thisObj - clicked square html element
 * @return {number} steps - Number of squares between diamond and clicked square
 */
function closestPreviousDiamond(thisObj) {
  if (thisObj.previousElementSibling) {
    if (
      thisObj.previousElementSibling.hasAttribute("diamond") &&
      !thisObj.previousElementSibling.hasAttribute("close")
    ) {
      prevFound = true;
    } else {
      prevSteps = prevSteps + 1;
      closestPreviousDiamond(thisObj.previousElementSibling);
    }
  }
}

/**
 * Finds the closest hidden diamond after clicked square
 * @param {element} thisObj - clicked square html element
 * @return {number} steps - Number of squares between diamond and clicked squre
 */
function closestNextDiamond(thisObj) {
  if (thisObj.nextElementSibling) {
    if (
      thisObj.nextElementSibling.hasAttribute("diamond") &&
      !thisObj.nextElementSibling.hasAttribute("close")
    ) {
      nextFound = true;
    } else {
      nextSteps = nextSteps + 1;
      closestNextDiamond(thisObj.nextElementSibling);
    }
  }
}

/**
 * Finds the closest hidden diamond
 * @param {element} thisObj - clicked square html element
 * @return {string} prev/next
 */
function findClosestDiamond(thisObj) {
  prevSteps = 0;
  nextSteps = 0;
  prevFound = false;
  nextFound = false;
  closestPreviousDiamond(thisObj);
  closestNextDiamond(thisObj);
  if (prevFound && nextFound) {
    if (prevSteps < nextSteps) {
      return "prev";
    }
    return "next";
  } else if (prevFound) {
    return "prev";
  } else {
    return "next";
  }
}

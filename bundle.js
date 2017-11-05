/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(1)

const canvasEl = document.getElementsByTagName("canvas")[0];
canvasEl.height = window.innerHeight;
canvasEl.width = window.innerWidth;

new Game(
  canvasEl.width,
  canvasEl.height,
).start(canvasEl);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Circle = __webpack_require__(2);

const circles = [];

window.Game = function (xDim, yDim) {
  this.xDim = xDim;
  this.yDim = yDim;
  this.mousePosX = 0;
  this.mousePosY = 0;

  for (let i = 0; i < Game.NUM_CIRCLES; ++i) {
    circles.push(
      Circle.randomCircle(xDim, yDim, Game.NUM_CIRCLES)
    );
  }

  window.addEventListener("mousemove", function(e) {
    this.Game.mousePosX = e.clientX;
    this.Game.mousePosY = e.clientY;
  },false);

};

// const print = function() {
//   console.log(window.Game.mousePosX);
// }


Game.NUM_CIRCLES = 4000;

Game.prototype.render = function (ctx) {
  //this will empty the canvas
  ctx.clearRect(0, 0, this.xDim, this.yDim);

  circles.forEach(function (circle) {
    circle.render(ctx);
  });
};

Game.prototype.moveCircles = function () {
  circles.forEach( circle => {
    circle.moveRandom(this.xDim, this.yDim, window.Game.mousePosX, window.Game.mousePosY);
    if (circle.isTouched(window.Game.mousePosX, window.Game.mousePosY)) {
      circles.splice(circles.indexOf(circle), 1);
    }
  });
};

Game.prototype.start = function (canvasEl) {
  // get a 2d canvas drawing context. The canvas API lets us call
  // a `getContext` method on a canvas DOM element.
  const ctx = canvasEl.getContext("2d");

  //this function will update the position of all the circles,
  //clear the canvas, and redraw them
  const animateCallback = () => {
    // this.positions();
    this.moveCircles();
    this.render(ctx);
    // this.getMousePosition();
    //this will call our animateCallback again, but only when the browser
    //is ready, usually every 1/60th of a second
    requestAnimationFrame(animateCallback);

    //if we didn't know about requestAnimationFrame, we could use setTimeout
    //setTimeout(animateCallback, 1000/60);
  };

  //this will cause the first render and start the endless triggering of
  //the function using requestAnimationFrame
  animateCallback();
};

module.exports = Game;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

const Circle =  function (centerX, centerY, radius, color) {
  this.centerX = centerX;
  this.centerY = centerY;
  this.radius = radius;
  this.color = color;
};

Circle.randomCircle = function (maxX, maxY, numCircles) {
  return new Circle(
    maxX * Math.random(),
    maxY * Math.random(),
    Circle.radius(maxX, maxY, numCircles),
    Circle.randomColor()
  );
};

const HEX_DIGITS = "0123456789ABCDEF";

Circle.randomColor = function () {
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += HEX_DIGITS[Math.floor((Math.random() * 16))];
  }

  return color;
};

Circle.radius = function (maxX, maxY, numCircles) {
  let targetCircleArea = (maxX * maxY) / numCircles;
  let targetRadius = Math.sqrt(targetCircleArea / Math.PI);
  return 2 * targetRadius;
};

Circle.prototype.moveRandom = function (maxX, maxY, mousePosX, mousePosY) {
  if (mousePosX === undefined) {
    mousePosX = 0;
    mousePosY = 0;
  }

  let distanceX = this.centerX - mousePosX;
  let distanceY = this.centerY - mousePosY;

  let signX = distanceX < 0 ? -1 : 1;
  let signY = distanceY < 0 ? -1 : 1;

  let distance = Math.pow(distanceX,2) + Math.pow(distanceY,2);

  let forceProportionality = (Math.random() + 2)/(distance);

  let gConstant = 500;

  this.centerX = ((Math.random()*2 + this.centerX) + (forceProportionality * signX * gConstant)) % maxX;
  this.centerY = ((Math.random()*2 + this.centerY) + (forceProportionality * signY * gConstant)) % maxY;
};

Circle.prototype.isTouched = function (mousePosX = 0, mousePosY = 0) {
  let rangeX = [this.centerX - this.radius, this.centerX + this.radius];
  let rangeY = [this.centerY - this.radius, this.centerY + this.radius];

  return mousePosX > rangeX[0] && mousePosX < rangeX[1] &&
          mousePosY > rangeY[0] && mousePosY < rangeY[1];
};

Circle.prototype.render = function (ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();

  ctx.arc(
    this.centerX,
    this.centerY,
    this.radius,
    0,
    2 * Math.PI,
    false
  );

  ctx.fill();
};

module.exports = Circle;


/***/ })
/******/ ]);

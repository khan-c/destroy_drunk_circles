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

  //mousePosX and mousePosY are undefined when the window loads
  //this is a workaround
  // if (mousePosX === undefined) {
  //   mousePosX = 0;
  //   mousePosY = 0;
  // }

  //calculates the distance of the circle from the cursor in both the x and y axis
  let distanceX = this.centerX - mousePosX;
  let distanceY = this.centerY - mousePosY;

  //will set the direction the circle moves from the cursor based on the above
  let signX = distanceX < 0 ? -1 : 1;
  let signY = distanceY < 0 ? -1 : 1;

  //calculates the shortest distance from the cursor and circle
  let distance = Math.pow(distanceX,2) + Math.pow(distanceY,2);

  //the further the object is, the less force is applied(inverse relationship)
  let forceProportionality = (Math.random() + 2)/(distance);

  //sets how strong the field is from the center of the cursor
  let gConstant = 500;

  this.centerX = ((Math.random()*2 + this.centerX) + (forceProportionality * signX * gConstant)) % maxX;
  this.centerY = ((Math.random()*2 + this.centerY) + (forceProportionality * signY * gConstant)) % maxY;
};

// rough check if circle is touched
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

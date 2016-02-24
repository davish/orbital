function Point(x, y) {
  this.x = Math.round(x*1000)/1000;
  this.y = Math.round(y*1000)/1000;
}

Point.prototype.copy = function() {
  return new Point(this.x, this.y);
}

Point.rotation = function(p, theta) {
  return new Point(Math.cos(theta)*p.x + Math.sin(theta)*p.y, 
                  -Math.sin(theta)*p.x + Math.cos(theta)*p.y);
}

Point.add = function(a, b) {
  return new Point(a.x + b.x, a.y + b.y);
}

Point.subtract = function(a, b) {
  return new Point(a.x - b.x, a.y - b.y);
}

Point.multiply = function(a, scale) {
  return new Point(a.x * scale, a.y * scale);
}

Point.prototype.times = function(scalar) {
  return Point.multiply(this, scalar);
}

Point.distance = function(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
}

function Vector(angle, magnitude) {
  this.theta = angle < 0 ? Math.PI*2 + angle : angle;
  this.magnitude = magnitude;
}

Vector.prototype.copy = function() {
  return new Vector(this.theta, this.magnitude);
}

Vector.prototype.components = function() {
  // basically make the magnitude point straight up and rotate it by theta to get x and y.
  // var m = new Point(0, this.magnitude);
  // var p = Point.rotation(m, this.theta);
  return new Point(this.magnitude * Math.cos(this.theta), this.magnitude * Math.sin(this.theta));
}

Vector.add = function(a, b) {
  /* 
    Split the vectors into their coordinate components, 
    add those values together, and then put the new vector 
    back into normal form.
  */
  var a1 = a.components();
  var b1 = b.components();
  
  var sum = Point.add(a1, b1);
  return Vector.toPolar(sum);
}

Vector.toPolar = function(p) {
  var theta = Math.atan2(p.y, p.x);
  theta += (theta < 0 ? Math.PI*2 : 0.0);

  var magnitude = Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2)); // dist from origin
  return new Vector(theta, magnitude);
}

Vector.prototype.scalarMultiply = function(s) {
  return Vector.toPolar(this.components().times(s));
}

function Particle(name, coords, velocity, acceleration, mass, radius) {
  this.position = coords ? coords : new Point(0, 0);
  this.velocity = velocity ? velocity : new Vector(0, 0);
  this.acc = acceleration ? acceleration : new Vector(0, 0);
  this.radius = radius ? radius : 5;
  this.mass = mass ? mass : 1;
  this.name = name ? name : "";

  Particle.list.push(this);
}

Particle.prototype.copy = function() {
  p = new Particle(
    this.name, 
    this.position.copy(), 
    this.velocity.copy(), 
    this.acc.copy(), 
    this.mass,
    this.radius);
  Particle.list.splice(Particle.list.indexOf(p), 1);
  return p;
}

Particle.list = [];

Particle.prototype.step = function(time) {
  this.gravitate(); // update acceleration based on forces
  this.velocity = Vector.add(this.velocity, this.acc.scalarMultiply(time)); // update velocity on acc
  this.position = Point.add(this.position, this.velocity.scalarMultiply(time).components());
}
// get a "force" vector by adding together all the particles's influence, 
// then multiply by mass to get acceleration

var G = 6.67;

Particle.prototype.gravitate = function() {
  var grav = new Vector(0, 0);

  for (var i = 0; i < Particle.list.length; i++) {
    var other = Particle.list[i];
    var dist = Point.distance(this.position, other.position)
    if (dist != 0) { // if it's not the same point
      var mag = G * (this.mass * other.mass)/Math.pow(dist, 2);
      var angle = Math.atan2(other.position.y - this.position.y, other.position.x - this.position.x)
      var F = new Vector(angle, mag);
      grav = Vector.add(grav, F);
    }
  }

  this.acc = grav.scalarMultiply(1/this.mass);
}



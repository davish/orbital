var canvas = document.getElementById("stage");
var ctx = canvas.getContext("2d");

var requestID;

main();

function main() {
  if (requestID) {
    stop();
  }
  var p = new Particle(new Point(100, 200), new Vector(Math.PI/2, 1000), new Vector(0, 0), 10);
  var d = new Particle(new Point(200, 200), new Vector(Math.PI/2, 300), new Vector(0, 0), 10e6);

  var z = new Particle(new Point(600, 200), new Vector(0, 0), new Vector(0, 0), 10e6);


  requestID = window.requestAnimationFrame(loop);
}


var time;
function loop() {
  var now = new Date().getTime(),
    dt = now - (time || now);
  time = now;

  clear();

  for (var i = 0; i < Particle.list.length; i++) {
    var pt = Particle.list[i];
    pt.step(dt/1000);
    drawParticle(pt);
  }


  requestID = window.requestAnimationFrame(loop);
}

function clear() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
}

function stop() {
  window.cancelAnimationFrame(requestID);
}


function drawParticle(particle) {
  // console.log(particle);
  ctx.beginPath();
  ctx.arc(particle.position.x, particle.position.y, particle.radius, 0, 2*Math.PI, false);
  ctx.fill();
}
var canvas = document.getElementById("stage");
var ctx = canvas.getContext("2d");

var requestID;

var time;
function loop() {
  var now = new Date().getTime(),
    dt = now - (time || now);
  time = now;

  for (var i = 0; i < Particle.list.length; i++) {
    var pt = Particle.list[i];
    pt.step(dt/1000);
  }
  drawParticles();


  requestID = window.requestAnimationFrame(loop);
}

function drawParticles() {
  clear()
  for (var i = 0; i < Particle.list.length; i++)
    drawParticle(Particle.list[i])

  $('#particle_list').change();
}

function clear() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
}

function start() {
  stop();
  requestID = window.requestAnimationFrame(loop);
}

function reset() {
  stop();
  Particle.list = [];
  for (var i = 0; i < backup.length; i++) {
    Particle.list.push(backup[i].copy())
  }
  drawParticles();
}

function stop() {
  if (requestID) {
    window.cancelAnimationFrame(requestID);
    time = null
  }
  
}

function drawParticle(particle) {
  ctx.beginPath();
  ctx.arc(particle.position.x, particle.position.y, particle.radius, 0, 2*Math.PI, false);
  ctx.fill();
}

$('#start').click(start);
$('#pause').click(stop);
$('#reset').click(reset);

$('#update').click(function() {
  p = Particle.list[$('#particle_list')[0].selectedIndex];
  p.mass = $('[name="mass"]').val();
  p.position = new Point($('[name="posx"]').val(), $('[name="posy"]').val());
  p.velocity = Vector.toPolar(new Point($('[name="velx"]').val(), $('[name="vely"]').val()))
  p.acc = Vector.toPolar(new Point($('[name="accx"]').val(), $('[name="accy"]').val()))
  drawParticles();
});

$('#particle_list').change(function(e) {
  p = Particle.list[e.target.selectedIndex];
  $('[name="mass"]').val(p.mass);
  $('[name="posx"]').val(p.position.x);
  $('[name="posy"]').val(p.position.y);
  $('[name="velx"]').val(p.velocity.components().x);
  $('[name="vely"]').val(p.velocity.components().y);
  $('[name="accx"]').val(p.acc.components().x);
  $('[name="accy"]').val(p.acc.components().y);
});

$('#newParticle').click(function() {
  p = new Particle('Particle ' + (Particle.list.length+1))
  refreshSelect();
  $('#particle_list').val(p.name)
  $('#particle_list').change();
})

function refreshSelect() {
  $('#particle_list').html('');
  for (var i = 0; i < Particle.list.length; i++) {
    $('#particle_list').append('<option id="'+i+'">'+Particle.list[i].name+'</option>')
  }
}
var backup = [];
$('#save').click(function() {
  backup = [];
  for (var i = 0; i < Particle.list.length; i++) {
    backup.push(Particle.list[i].copy())
  }
});

$(document).ready(function() {
  refreshSelect();
});

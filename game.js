const socket = io();
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let players = {};
let myId;

socket.on('currentPlayers', (serverPlayers) => {
  players = serverPlayers;
});

socket.on('newPlayer', ({ id, player }) => {
  players[id] = player;
});

socket.on('playerMoved', ({ id, x, y }) => {
  if (players[id]) {
    players[id].x = x;
    players[id].y = y;
  }
});

socket.on('playerDisconnected', (id) => {
  delete players[id];
});

document.addEventListener('keydown', (e) => {
  const me = players[socket.id];
  if (!me) return;

  if (e.key === 'w') me.y -= 5;
  if (e.key === 's') me.y += 5;
  if (e.key === 'a') me.x -= 5;
  if (e.key === 'd') me.x += 5;

  socket.emit('move', { x: me.x, y: me.y });
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const id in players) {
    const p = players[id];
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, 40, 40);
  }
  requestAnimationFrame(draw);
}
draw();

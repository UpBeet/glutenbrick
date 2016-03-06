import io from 'socket.io-client';
import handlers from './handlers';
import Leap from './LeapController';
import { init, updatePlayerTransform, closeHand, openHand } from './World';
let socket;
let playerId;

export const addHandlers = handlers => handlers.map(h => socket.on(h[0], h[1]));

export const setSeat = seat => {
  if (seat === 0) {
    playerId = 'pOne';
  }
  else {
    playerId = 'pTwo';
  }
};

export const connect = host => {
  socket = io.connect(host);
  addHandlers(handlers.matchmaking);
  init(); // World
  Leap.init();

  socket.on('playerUpdated', ({ player }) => {
    updatePlayerTransform(
      player.id,
      player.roll,
      player.yaw,
      player.pitch,
      { x: player.x, y: player.y });

    if (player.grabStrength > 0.2) closeHand(player.id);
    else openHand(player.id);
  });
};

export const host = () => socket.emit('host');
export const join = id => socket.emit('join', { id });

export const playerUpdate = player => {
  player.id = playerId;
  socket.emit('playerData', { room: '1', player });
};

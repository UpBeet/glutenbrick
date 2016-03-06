import io from 'socket.io-client';
import handlers from './handlers';
let socket;

export const addHandlers = handlers => handlers.map(h => socket.on(h[0], h[1]));

export const connect = host => {
  socket = io(host);
  addHandlers(handlers.matchmaking);
};

export const host = () => socket.emit('host');
export const join = id => socket.emit('join', { id });

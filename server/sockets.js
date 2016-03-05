import Socketio from 'socket.io';
import * as match from './match';
let io;

const host = (s) => {
  
}

const connect = (s) => {
  console.log('socket connected');
  s.on('host', host);
  s.on('join', join);
  s.on('disconnect', leave);
};

export const Sockets = app => {
  io = Socketio(app);
  io.on('connection', connect);
};

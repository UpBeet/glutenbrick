import log from 'winston';
import Socketio from 'socket.io';
import { createMatch, addPlayer } from './match';
let io;

/**
* Add a player to a match and assign a controller
*/
const join = (s, { id }) => {
  const seat = addPlayer(s, id);
  s.emit('joined', { seat, id });
  io.to(id).emit('player_joined', { seat });
  s.join(id);
};

/**
* Create a new match and tell the client to join the match
*/
const host = (s) => {
  // create match
  const match = createMatch();

  // join
  join(s, match);
};

/**
* Catch when a user disconnects
*/
const leave = () => {
  // remove user from a room
  log.info('user disconnect \n');
};


const connect = (s) => {
  log.info('socket connected');
  s.on('host', host);
  s.on('join', join);
  s.on('disconnect', leave);
};

export const Sockets = app => {
  io = Socketio(app);
  io.on('connection', connect);
};

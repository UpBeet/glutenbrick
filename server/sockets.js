import log from 'winston';
import http from 'http';
import Socketio from 'socket.io';
import { createMatch, addPlayer } from './match';
let io;

/**
* Add a player to a match and assign a controller
*/
const join = ({ id }, s) => {
  const seat = addPlayer(s, id);
  s.emit('joined', { seat, id });
  io.to('1').emit('player_joined', { seat });
  s.join('1');
};

/**
* Create a new match and tell the client to join the match
*/
const host = s => {
  // create match
  const match = createMatch();
  // join
  join(match, s);
};

/**
* Catch when a user disconnects
*/
const leave = () => {
  // remove user from a room
  log.info('user disconnect \n');
};

const playerData = (data, s) => {
  io.to(data.room).emit('playerUpdated', data);
};


const connect = (s) => {
  log.info('socket connected');
  s.on('host', () => host(s));
  s.on('join', data => join(data, s));
  s.on('playerData', data => playerData(data, s));
  s.on('disconnect', leave);
};

export const Sockets = app => {
  const httpServer = http.Server(app);
  httpServer.listen(8220);
  io = Socketio(httpServer);
  io.on('connection', connect);
};

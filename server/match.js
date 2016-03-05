import { generate } from 'shortid';

const matches = [];
export const getMatch = id => matches[id];

export const createMatch = () => {
  const id = generate();

  const match = {
    id,
    players: [],
    active: false,
  };

  matches[id] = match;
  return match;
};

export const addPlayer = (id, socket) => {
  const match = getMatch(id);

  if (match.players.length >= 2) {
    // no open seats
    return undefined;
  }

  const seat = match.players.length;
  match.players.push(socket);

  return seat;
};

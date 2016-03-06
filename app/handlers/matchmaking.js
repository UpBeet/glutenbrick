import { setSeat } from '../sockets';

const joined = ({ seat, id }) => {
  // store seat and id
  console.log(seat, id);
  setSeat(seat);
};

export default [
  ['joined', joined],
];

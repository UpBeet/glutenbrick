import World from './World';
import Leap from './LeapController';

console.log(':P');

World.init();
Leap.init();

import * as socket from './sockets';

const host = process.env.HOST_URL || 'localhost:8222';

socket.connect(host);
socket.host();

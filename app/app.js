console.log(':P');

import * as socket from './sockets';

const host = process.env.HOST_URL || 'localhost:8220';

socket.connect('ws://glutenbrick.herokuapp.com');
socket.host();

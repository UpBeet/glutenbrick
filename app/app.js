console.log(':P');

import * as socket from './sockets';

socket.connect(window.location.origin);
socket.host();

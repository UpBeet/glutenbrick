import * as socket from './sockets';

const host = process.env.HOST_URL || 'localhost:8222';

socket.connect(host);
socket.host();

import * as socket from './sockets';

const host = 'ws://glutendisk.heroku.com:80';

socket.connect(host);
socket.host();

import * as socket from './sockets';

const host = 'ws//:glutendisk.heroku.com';

socket.connect(host);
socket.host();

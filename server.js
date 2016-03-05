import express from 'express';
import path from 'path';
import SocketIO from 'socket.io';

const port = process.env.PORT || 8222;
const app = express();

// sockets
const io = SocketIO(app);
io.on('connection', (s) => process.stdout.write('socket connected'));

// static path for javascript
app.use('/js', express.static(path.resolve(__dirname + '/build/js')));

// Set routes
app.use('/', express.static(path.resolve(__dirname + '/public')));
app.use('/view', express.static(path.resolve(__dirname + '/public/view.html')));
app.use('/play', express.static(path.resolve(__dirname + '/public/controller.html')));

// Set port and listen
app.set('port', port);
app.listen(port, e => {
  if (e) throw e;
  process.stdout.write('server is listening');
});

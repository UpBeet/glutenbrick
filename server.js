import express from 'express';
import path from 'path';
import Sockets from './server/sockets.js';

const port = process.env.PORT || 8222;
const app = express();

// sockets
Sockets(app);

// static path for javascript
app.use('/js', express.static(path.resolve(__dirname + '/build/js')));

// Set routes
app.use('/', express.static(path.resolve(__dirname + '/public')));

// Set port and listen
app.set('port', port);
app.listen(port, e => {
  if (e) throw e;
  process.stdout.write('server is listening');
});

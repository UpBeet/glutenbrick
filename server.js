import express from 'express';
import path from 'path';

const port = process.env.PORT || 8222;
const app = express();

app.use('/js', express.static(path.resolve(__dirname + '/build/js')));
app.use('/', express.static(path.resolve(__dirname + '/public')));
app.use('/view', express.static(path.resolve(__dirname + '/public/view.html')));
app.use('/play', express.static(path.resolve(__dirname + '/public/controller.html')));

app.set('port', port);
app.listen(port, e => {
  if (e) throw e;
  process.stdout.write('server is listening');
});

const http = require('http');
const fs = require('fs');
const proc = require('child_process');
const socketio = require('socket.io');

const options = {
  command: 'screencapture -x -t jpg',
  target: 'shot.jpg',
  hostname: '0.0.0.0',
  port: 8080
};

const server = http.createServer((req, res) => {
  fs.createReadStream('index.html').pipe(res);
});

socketio(server).on('connection', socket => {
  const capture = () => {
    proc.exec(`${options.command} ${options.target}`, () => {
      let file = fs.readFileSync(options.target);
      socket.emit('data', new Buffer(file).toString('base64'));
      capture();
    });
  }
  capture();
});

server.listen(options.port, options.hostname);
console.log(`livestream started on port ${options.port}`);
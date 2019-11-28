/*
 * server.js
 *
 */
let express = require('express')();
let http = require('http').createServer(express);
let fs = require('fs').promises;

let socketServer = require('socket.io')(http);
let registeredSockets = {};
express.get('/', (request, response) => {
  fs.readFile('./index.html')
    .then((content) => {
      // Writes response header
      response.writeHead(200, { 'Content-Type': 'text/html' });
      // Writes response content
      response.end(content);
    })
    .catch((error) => {
      // Returns 404 error: page not found
      response.writeHead(404, { 'Content-Type': 'text/plain' });
      response.end('Page not found.');
    });
});

express.use('/', (request, response) => {
  fs.readFile('./client.js')
    .then((content) => {
      // Writes response header
      response.writeHead(200, { 'Content-Type': 'application/javascript' });
      // Writes response content
      response.end(content);
    })
    .catch((error) => {
      // Returns 404 error: page not found
      response.writeHead(404, { 'Content-Type': 'text/plain' });
      response.end('Page not found.');
    });
});


// Server listens on port 8080
http.listen(8080);
/*
* Binds a socket server to the current HTTP server
*
*/

socketServer.on('connection', function (socket) {
  console.log("connection");
  /*
   * Registers an event listener
   *
   * - The first parameter is the event name
   * - The second parameter is a callback function that processes
   *   the message content.
   */
  socket.on('>signin', pseudo => {
    if (isAvailable(pseudo)) {
      socket.emit('<connected', pseudo);
      registeredSockets[pseudo] = socket;
      socketServer.emit('<notification', pseudo);
    } else {
      socket.emit('<error', 'Pseudo invalide');
    }
  });

  socket.on('>message', message => {
    console.log(getNicknameBy(socket));
  });
});

function isAvailable(nickname) {
  return registeredSockets[nickname] === undefined;
}
function getNicknameBy(socket) {
  for(const pseudo in registeredSockets){
    if (pseudo == socket) {
      return pseudo;
    }
  };
}
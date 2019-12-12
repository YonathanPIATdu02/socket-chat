/*
 * server.js
 *
 */
let express = require('express')();
let http = require('http').createServer(express);
let fs = require('fs').promises;
var ent = require('ent');

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
    pseudo = ent.encode(pseudo);
    if (isAvailable(pseudo)) {
      socket.emit('<connected', pseudo);
      registeredSockets[pseudo] = socket;
      socketServer.emit('<notification', pseudo + " est connecté");
      socketServer.emit('<users', getAllNicknames());
    } else {
      socket.emit('<error', 'Pseudo deja utiliser ou pas incorret');
    }
  });
  socket.on('disconnect', pseudo =>{
    console.log(socket);
    //const pseudo = getNicknameBy(socket);
    console.log(pseudo + " est partie");
    if (pseudo) {
      delete registeredSockets[pseudo];
      socketServer.emit('<notification', pseudo + " est partie");
      socketServer.emit('<users', getAllNicknames());
    }
  })
  socket.on('>message', message => {
      const pseudo = getNicknameBy(socket);
      if (pseudo) {
        message = ent.encode(message);
        socketServer.emit("<message", {'sender' : pseudo, 'text' : message});
      } else {
        socket.emit('<error', 'Veuillez vous connecter !');
      }
  });
});

function isAvailable(nickname) {
  if (nickname === undefined){
    return false;
  }
  return registeredSockets[nickname] === undefined;
}

function getNicknameBy(socket) {
  for(var nickname in registeredSockets){
    if (registeredSockets[nickname] == socket) {
      return nickname;
    }
  };
}

function getAllNicknames() {
  let nicknames = [];
  for (let nickname in registeredSockets) {
    nicknames.push(nickname);
  }
  return nicknames;
}
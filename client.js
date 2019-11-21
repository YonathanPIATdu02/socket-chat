
/*
 * Binds a socket server to the current HTTP server
 *
 */
let socketServer = require('socket.io')(http);

let socketClient = io();

/*
 * Emits an event to the server
 *
 * - The first parameter is the event name.
 * - The second parameter is the message content: it can be a number,
 *   a string or an object.
 */
socketClient.emit('hello', 'Olivier');

/*
 * Registers event listeners
 *
 * - The first parameter is the event name
 * - The second parameter is a callback function that processes
 *   the message content.
 */
socketClient.on('notification', (content) => {
  console.log(content);
});

socketClient.on('hello', (content) => {
  console.log(content);
});

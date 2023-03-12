const { spawn } = require('child_process');
const { spawnSync } = require('child_process');
var utf8bts = require('utf8bts')

var socket = require('socket.io-client').connect('http://localhost:3001/', { reconnection: true });
socket.on('connect', function () {
    console.log("Conectado ao Servidor Socket");
});
socket.on('disconnect', function () {
    console.log("Desconectado do Servidor Socket.");
});

var logs = spawn('node', [__dirname + '/server.js']);

logs.stdout.on('data', function (data) {
    socket.emit("send", utf8bts(data));
});

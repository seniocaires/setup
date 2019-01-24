var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var app = express();
var clients = {};

io.on("connection", function (client) {

    console.log("Cliente conectado no Servidor Socket: " + client.id);
    clients[client.id] = client.id;
    client.broadcast.emit("update", client.id + " conectou ao servidor Socket.")

    client.on("send", function (msg) {
        console.log("Cliente Socket enviando mensagem: " + msg);
        client.broadcast.emit("terminal", msg);
    });

    client.on("disconnect", function () {
        console.log(clients[client.id] + " desconectou do Servidor Socket.");
        delete clients[client.id];
    });
});

http.listen(3001, function () {
    console.log('Servidor Socket iniciado na porta 3001');
});


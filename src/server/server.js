const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("src/client"));

let palabras = ["entender", "expertos", "academico"];
var numero = -1;
var escogida = "";
let clientList = [];
let mesajes = [{ tipo: 0, turno: 1, estado: 0, palabra: "" }];

io.on("connection", async(socket) => {
    console.log("Client connected");
    socket.on('registrer', (data) => {
        registroDatos(data, socket.id);
    });
    var x = await resolveAfter2Seconds(1);
    socket.on('disconnect', () => {
        console.log("desconectado");
        mesajes.length = 0;
        mesajes = [{ tipo: 0, turno: 1, estado: 0, palabra: "" }];
        numero = -1;
        escogida = "";
        var user = clientList.indexOf(socket.id);
        clientList.splice(user, 1);
        for (let i = 0; i < clientList.length; i++) {
            if (clientList[i].turno != 1) {
                clientList[i].turno = clientList[i].turno - 1;
            }

        }
    });
    if (numero === -1) {
        numero = Math.floor(Math.random() * palabras.length);
        escogida = palabras[numero];
    }
    io.sockets.emit("palabra", escogida);

    socket.emit("inicio", mesajes);

    socket.on("new_inicio", async(palabra) => {

        mesajes.length = 0;
        mesajes = [...palabra];

        var x = await resolveAfter2Seconds(1);
        if (mesajes[mesajes.length - 1].turno > clientList.length) {
            mesajes[mesajes.length - 1].turno = 1;
        }

        if (mesajes[mesajes.length - 1].palabra.indexOf("_") === -1) {
            mesajes[mesajes.length - 1].tipo = 1;
        }

        io.sockets.emit("inicio", mesajes);
        var x = await resolveAfter2Seconds(1);
        for (let i = 0; i < clientList.length; i++) {
            console.log("var", clientList[i].turno == mesajes[mesajes.length - 1].turno);
            if (clientList[i].turno === mesajes[mesajes.length - 1].turno) {
                var x = await resolveAfter2Seconds(1);
                io.to(clientList[i].id).emit('desbloquear', { msg: 'es tu turno' });
            } else {
                var x = await resolveAfter2Seconds(1);
                io.to(clientList[i].id).emit('bloquearInput', { msg: 'No es tu turno' });
            }
        }
    });

});

function registroDatos(data, socketId) {
    var user = {};
    user.id = data.id;
    user.socketId = socketId;
    user.estado = data.estado;
    user.turno = clientList.length + 1;
    clientList.push(user);
}
server.listen(5000, () => {
    console.log("Server corriendo");
});

function resolveAfter2Seconds(x) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(x);
        }, 500);
    });
}
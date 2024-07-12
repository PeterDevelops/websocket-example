const WebSocket = require("ws");
const express = require("express");
const app = express()
const path = require("path")

app.use("/", express.static(path.resolve(__dirname, "../client")))

// regular http server using node express which serves your webpage
const myServer = app.listen(9876)

const wsServer = new WebSocket.Server({
    noServer: true
})

// a websocket server

// what should a websocket do on connection
wsServer.on("connection", function (ws) {
    ws.on("message", function (msg) {                        // what to do on message event
        wsServer.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {     // check if client is ready
                client.send(msg.toString());
            }
        })
    })
})

// handling upgrade (http to websocket) event
myServer.on('upgrade', async function upgrade(request, socket, head) {

    //emit connection when request accepted
    wsServer.handleUpgrade(request, socket, head, function done(ws) {
        wsServer.emit('connection', ws, request);
    });
});
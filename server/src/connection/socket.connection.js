// socket code 


import { Server } from "socket.io";
import http from 'http';
import express from "express";

const app= express();

const server= http.createServer(app);

const io= new Server(server,{
    cors:{
        origin:["http://localhost:5173"],
        methods:["GET","POST"]
    }
});

const onlineUserMap={};

export const getReceiverSocketId= (receiverId)=>{
    return onlineUserMap[receiverId];
}


io.on("connection",(socket)=>{
    const userId= socket.handshake.query.userId;
    console.log(`A ${userId} connected with socket id ${socket.id}`)

    if(userId!="undefine") onlineUserMap[userId]=socket.id;

    io.emit("getOnlineUsers", Object.keys(onlineUserMap));
    // console.log(onlineUserMap)

    socket.on("disconnect",()=>{
        console.log(`A ${userId} disconnecte with socket id ${socket.id}`)
        delete onlineUserMap[userId];
        io.emit("getOnlineUsers", Object.keys(onlineUserMap));
    })

    socket.on("login", (id) => {
        console.log("User connected with socket", id);
        // Handle associating the socket with the user here if needed
      });
})



export {app, io, server}
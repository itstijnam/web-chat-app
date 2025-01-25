
import { Server as SocketIOServer } from 'socket.io';
import Message from './models/MessagesModel.js';
import Channel from './models/ChannelModel.js';

const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true
        },
    });

    const userSocketMap = new Map();

    const usersSocketMap = {}

    const disconnect = (socket) => {

        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    }

    const sendMessage = async (message) => {
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);
        const createdMessage = await Message.create(message)
        const messageData = await Message.findById(createdMessage._id)
            .populate("sender", "id email firstName lastName")
            .populate("recipient", "id email firstName lastName");

        if (recipientSocketId) {
            io.to(recipientSocketId).emit("recieveMessage", messageData);
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("recieveMessage", messageData);
        }
    }

    const sendChannelMessage = async (message) => {
        const { channelId, sender, content, messageType, fileUrl } = message;
        const createdMessage = await Message.create({
            sender,
            recipient: null,
            content, messageType, timestamp: new Date(),
            fileUrl,
        });

        const messageData = await Message.findById(createdMessage._id)
            .populate('sender', 'id email firstName lastName image')
            .exec();

        await Channel.findByIdAndUpdate(channelId, {
            $push: { messages: createdMessage._id }
        });

        const channel = await Channel.findById(channelId)
            .populate("members");

        const finalData = { ...messageData._doc, channelId: channel._id };

        if (channel && channel.members) {
            channel.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member._id.toString());
                if (memberSocketId) {
                    io.to(memberSocketId).emit('recieve-channel-message', finalData);
                }
            });
            const adminSocketId = userSocketMap.get(channel.admin._id.toString());
            if (adminSocketId) {
                io.to(adminSocketId).emit('recieve-channel-message', finalData);
            }
        }

    }

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            userSocketMap.set(userId, socket.id);
            usersSocketMap[userId] = socket.id;
        } else {
            console.log('User Id not provided during connection.')
        }
        io.emit('getOnlineUsers', Object.keys(usersSocketMap));
        socket.on("sendMessage", sendMessage)
        socket.on("send-channel-message", sendChannelMessage);
        socket.on("disconnect", () => { 
            disconnect(socket)
            if(userId){
                delete userSocketMap[userId]
                // console.log(`user disconnected: userId = ${userId}, socketId = ${socket.id}`);
            }
            io.emit('getOnlineUsers', Object.keys(userSocketMap));
        })
    })
};

export default setupSocket;
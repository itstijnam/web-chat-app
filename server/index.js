import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import cookieParser from "cookie-parser";
import mongoose from "mongoose";    
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/MessagesRoutes.js";
import channelRoutes from "./routes/ChannelRoutes.js";
import path from 'path';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const databaseURL = process.env.DATABASE_URL;

const __dirname = path.resolve();

app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
    credentials: true,
}))

app.use("/uploads/profiles", express.static("uploads/profiles"))
app.use("/uploads/files", express.static("uploads/files"))

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use('/api/auth', authRoutes)
app.use('/api/contacts', contactsRoutes)
app.use('/api/messages', messagesRoutes)
app.use('/api/channel', channelRoutes)


app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res)=>{
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
})

const server = app.listen(PORT, ()=>{
    console.log(`http://locahost:${PORT}`)
})

setupSocket(server);

mongoose.connect(databaseURL).then(()=>console.log('DB connected')).catch(()=>console.log('DB not Connected'));
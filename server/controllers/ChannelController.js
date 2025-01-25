import mongoose from "mongoose";
import Channel from "../models/ChannelModel.js";
import User from "../models/UserModel.js";

export const createChannel = async (req, res) => {
    try {

        const { name, members } = req.body;
        const userId = req.userId;

        const admin = await User.findById(userId);

        if (!admin) {
            return res.status(400).json({
                success: false,
                message: 'Admin user not found'
            })
        }
        const validMembers = await User.find({ _id: { $in: members } });
        if (validMembers.length !== members.length) {
            return res.status(400).json({
                success: false,
                message: "Some members are not valid users"
            })
        }

        const newChannel = new Channel({
            name,
            members,
            admin: userId,
        });

        await newChannel.save();
        return res.status(201).json({
            success: true,
            message: 'New group created',
            channel: newChannel
        });

    } catch (error) {
        console.log(`Controllers/ChannelController createChannel ERROR:: ${error}`)
    }
}


export const getUserChannels = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);
        const channels = await Channel.find({
            $or: [{ admin: userId }, { members: userId }],
        }).sort({ updatedAt: -1 });

        

        
        return res.status(201).json({
            success: true,
            message: 'New group created',
            channels
        });

    } catch (error) {
        console.log(`Controllers/ChannelController createChannel ERROR:: ${error}`)
    }
}


export const getChannelMessages = async (req, res) => {
    try {
        const {channelId} = req.params;
        
        const channel = await Channel.findById(channelId).populate({
            path: "messages",
            populate: {
                path: "sender",
                select: "firstName lastName email _id image"
            }
        })

        const messages = channel.messages

        return res.status(201).json({
            success: true,
            messages
        });

    } catch (error) {
        console.log(`Controllers/ChannelController createChannel ERROR:: ${error}`)
    }
}
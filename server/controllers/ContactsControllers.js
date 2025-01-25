import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js";


export const SearchContacts = async (req, res)=>{
    try {
        const {searchTerm} =  req.body;
        if(searchTerm === undefined || searchTerm === null){
            return res.status(400).json({
                success:false,
                message: 'Please enter name'
            })
        }

        const sanitizedSearchTerm = searchTerm.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        const regex = new RegExp(sanitizedSearchTerm,"i");

        const contacts = await User.find({
            $and: [
                { id: {$ne: req.userId}},
                {
                    $or: [{firstName: regex}, {lastName: regex}, {email: regex}]
                }
            ]
        })

        return res.status(200).json({
            success: true,
            contacts
        })

    } catch (error) {
        console.log(`ContactControllers/ SearchContacts :: ERROR `, error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}



export const getContactsForDMList = async (req, res)=>{
    try {

        let {userId} = req;
        userId = new mongoose.Types.ObjectId(userId);

        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [{sender: userId}, {recipient: userId}],
                },
            },
            {
                $sort: {timestamp: -1},
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: {$eq: ["$sender", userId]},
                            then: "$recipient",
                            else: "$sender",
                        },
                    },
                    lastMessageTime: { $first: "$timestamp" },
                },
            },
            {
                $lookup:{
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo",
                },
            },
            {
                $unwind: "$contactInfo",
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    image: "$contactInfo.image",
                },
            },
            {
                $sort: {lastMessageTime:-1}
            }
        ])

        return res.status(200).json({
            success: true,
            contacts
        })

    } catch (error) {
        console.log(`ContactControllers/ getContactsForDMList :: ERROR `, error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

export const getAllContacts = async (req, res)=>{
    try {
        
        const users = await User.find(
            {_id: {$ne: req.userId} },
            "firstName lastName _id email"
        );

        const contacts = users.map((user)=>({
            label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
            value: user._id,
        }));

        return res.status(200).json({
            success: true,
            contacts
        })

    } catch (error) {
        console.log(`ContactControllers/ getAllContacts :: ERROR `, error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}
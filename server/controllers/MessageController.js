    import Message from "../models/MessagesModel.js";
    import {mkdirSync, rename, renameSync} from 'fs'

    export const getMessages = async (req, res)=>{
        try {
            const user1 = req.userId;
            const user2 = req.body.id;


            if(!user1 || !user2){
                return res.status(400).json({
                    success:false,
                    message: 'Something went wrong',
                })
            }

            const messages = await Message.find({
                $or:[ 
                    {sender:user1, recipient:user2},
                    {sender:user2, recipient:user1}
                ]
            }).sort({timestamp: 1});

            return res.status(200).json({
                success: true,
                messages
            })

        } catch (error) {
            console.log(`ContactControllers/ SearchContacts :: ERROR `, error)
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            })
        }
    }

    export const uploadFile = async (req, res)=>{
        try {
            console.log('Uploaded file:', req.file);
            if(!req.file){
                return res.status(400).send("File is required");
            }
            const date = Date.now();
            let fileDir = `uploads/files/${date}`;
            let fileName = `${fileDir}/${req.file.originalname}`;

            mkdirSync(fileDir, {recursive:true});

            renameSync(req.file.path, fileName);
            
            return res.status(200).json({
                success: true,
                filePath: fileName
            })

        } catch (error) {
            console.log(`ContactControllers/ SearchContacts :: ERROR `, error)
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            })
        }
    }
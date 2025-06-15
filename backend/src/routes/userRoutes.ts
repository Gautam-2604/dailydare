import { PrismaClient } from "@prisma/client";
import { Router } from "express";

export const userRouter = Router()

const prisma = new PrismaClient()

userRouter.post('/signin', async(req, res)=>{
    const { email, password } = req.body
    try {
        const existingUser = await prisma.user.findFirst({
            where:{
                email
            }
        })
        if(!existingUser){
            res.status(400).json({message:"No such user"})
            return
        }
        if(existingUser.password !== password){
            res.status(404).json({message:"Check Password"})
            return
        }
        res.status(200).json({message:"Done", user: existingUser})
        return
        
    } catch (error) {
        res.status(500).json({message:"Internal Error"})
        console.log(error);
        
        return
    }
})

userRouter.post('/signup', async(req, res)=>{
    const { email, password, username } = req.body
    try {
        const existingUser = await prisma.user.findFirst({
            where:{
                email
            }
        })
        if(existingUser){
            res.status(400).json({message:"User already there, please signin"})
            return
        }
        const sameUsername = await prisma.user.findFirst({
            where:{
                username
            }
        })
        if(sameUsername){
            res.status(404).json({message:"Same username"})
            return
        }
        const saveUser = await prisma.user.create({
            data:{
                username,
                email,
                password
            }
        })
        res.status(200).json({message:"Done", user: saveUser})
        return
        
    } catch (error) {
        res.status(500).json({message:"Internal Error"})
        console.log(error);
        
        return
    }
})
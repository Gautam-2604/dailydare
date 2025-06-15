import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const prisma = new PrismaClient()

export const dareRouter = Router();

dareRouter.get('/:id',async(req, res)=>{
    const {id} = req.params
    try {
       const foundChallenge = await prisma.challenge.findMany({
        where:{
            userId: id
        }
       })
       console.log(foundChallenge);
       
       res.status(200).json({challenges: foundChallenge})
    } catch (error) {
        res.status(500).json({message:"Internal Server Error"})
        return
    }
})

dareRouter.post('/:id',async(req, res)=>{
    const {id} = req.params
    const body = req.body
    try {
       const newChallenge = await prisma.challenge.create({
        data:{
            title: body.title,
            isCompleted: false,
            difficulty: body.difficulty,
            startDate: body.startDate,
            endsAt: body.endDate,
            Category: body.categories,
            userId: id
            
        }
       })
       res.status(200).json({challenges: newChallenge})
    } catch (error) {
        res.status(500).json({message:"Internal Server Error", error: error})
        return
    }
})

dareRouter.delete('/:id',async(req, res)=>{
    const {id} = req.params
    const {userId} = req.body
    try {
       const foundChallenge = await prisma.challenge.delete({
        where:{
            id,
            userId
        }
       })


       res.status(200).json({message:"Deleted"})
    } catch (error) {
        res.status(500).json({message:"Internal Server Error"})
        return
    }
})






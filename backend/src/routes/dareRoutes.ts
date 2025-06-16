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

       const user = await prisma.user.findFirst({
        where: {
            id
        },
        include: {
            friends: true,
            challenges: true
        }
       })

       if (!user) {
            res.status(404).json({ message: "User not found" });
            return
       }

       const friendChallenges = await Promise.all(
           user.friends.map(friend => 
               prisma.challenge.create({
                   data: {
                       title: body.title,
                       isCompleted: false,
                       difficulty: body.difficulty,
                       startDate: body.startDate,
                       endsAt: body.endDate,
                       Category: body.categories,
                       userId: friend.id
                   }
               })
           )
       );
       
       res.status(200).json({
           userChallenge: newChallenge,
           friendChallenges: friendChallenges
       });
       return
    } catch (error) {
        res.status(500).json({message:"Internal Server Error", error: error})
        console.log(error);
        
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






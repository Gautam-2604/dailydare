import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const prisma = new PrismaClient()

export const profileRouter = Router()

profileRouter.put('/streak/:id', async(req, res)=>{
    const {id} = req.params
    try {
        const user = await prisma.userProfile.findUnique({
            where: { id },
            select: { streak: true }
        });

        if (!user) {
             res.status(404).json({ message: "User not found" });
             return
        }

        const updatedUser = await prisma.userProfile.update({
            where: { id },
            data: {
                streak: user.streak + 1
            }
        });

        res.status(200).json({ 
            message: "Streak updated successfully",
            streak: updatedUser.streak 
        });
    } catch (error) {
        console.error('Error updating streak:', error);
        res.status(500).json({ message: "Internal server error" });
    }
});

profileRouter.put('/completed/:id', async(req, res)=>{
    console.log("Started");
    
    const {id} = req.params
    try {
        const user = await prisma.userProfile.findUnique({
            where: { id },
            select: { daresCompleted: true }
        });

        if (!user) {
             res.status(404).json({ message: "User not found" });
             return
        }

        const updatedUser = await prisma.userProfile.update({
            where: { id },
            data: {
                daresCompleted: user.daresCompleted + 1
            }
        });

        res.status(200).json({ 
            message: "Completed challenges count updated",
            completedChallenges: updatedUser.daresCompleted 
        });
    } catch (error) {
        console.error('Error updating completed challenges:', error);
        res.status(500).json({ message: "Internal server error" });
    }
});
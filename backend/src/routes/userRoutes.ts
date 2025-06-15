import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const prisma = new PrismaClient()

export const userRouter = Router()

userRouter.get('/profile/:id', async(req, res)=>{
    const {id} = req.params
    const user = await prisma.userProfile.findFirst({
        where:{
            userId: id
        }
    })

    res.status(200).json({
        message:"Your user Profile",
        user: user
    })
    return;

})

userRouter.put('/profile/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const existingProfile = await prisma.userProfile.findFirst({
            where: {
                userId: id
            }
        });

        if (!existingProfile) {
            res.status(404).json({
                message: "User profile not found"
            });
            return 
        }

        const updatedProfile = await prisma.userProfile.update({
            where: {
                userId: id
            },
            data: {
                bio: updateData.bio,
                notifications: updateData.notifications,
                soundEffects: updateData.soundEffects,
                darkMode: updateData.darkMode,
                publicProfile: updateData.publicProfile,
                friendRequests: updateData.friendRequests,
                challengeReminders: updateData.challengeReminders,
                weeklyReport: updateData.weeklyReport,
                dataSync: updateData.dataSync
                
            }
        });

        res.status(200).json({
            message: "Profile updated successfully",
            profile: updatedProfile
        });
        return;
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            message: "Failed to update profile",
            error: error instanceof Error ? error.message : "Unknown error occurred"
        });
        return
    }
});

userRouter.delete('/profile/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const existingProfile = await prisma.userProfile.findFirst({
            where: {
                userId: id
            }
        });

        if (!existingProfile) {
            res.status(404).json({
                message: "User profile not found"
            });
            return 
        }

        const updatedProfile = await prisma.userProfile.delete({
            where: {
                userId: id
            }
        });

        res.status(200).json({
            message: "Profile updated successfully",
            profile: updatedProfile
        });
        return;
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            message: "Failed to update profile",
            error: error instanceof Error ? error.message : "Unknown error occurred"
        });
        return
    }
});
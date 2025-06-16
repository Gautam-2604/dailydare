import { PrismaClient } from "@prisma/client";
import { Router } from "express";

export const authRouter = Router()

const prisma = new PrismaClient()



authRouter.post('/signin', async(req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                profile: true,
                challenges: {
                    orderBy: { createdAt: 'desc' }
                },
                friends: {
                    select: {
                        id: true,
                        username: true,
                        name: true
                    }
                }
            }
        });
        console.log(user);
        

        if (!user) {
            res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
            return
        }

        if (user.password !== password) {  
             res.status(401).json({ 
                success: false,
                message: "Invalid credentials" 
            });
            return
        }

        const { password: _, ...safeUser } = user;
        

     res.status(200).json({
            success: true,
            message: "Signed in successfully",
            data: {
                user: safeUser,
                token:''
            }
        });
        return

    } catch (error) {
        console.error('Signin error:', error);
         res.status(500).json({
            success: false,
            message: "Internal server error"
        });
        return
    }
});

authRouter.post('/signup', async(req, res)=>{
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
                password,

            }
        })

        const newUserprofile = await prisma.userProfile.create({
    data: {
        userId: saveUser.id,  
        streak: 0,           
        daresCompleted: 0,   
        totalPoints: 0,           
        level: "Beginner",           
        bio: ""  
    }
});

res.status(200).json({
    message: "Done", 
    user: {
        ...saveUser,
        profile: newUserprofile
    }
});
        return
        
    } catch (error) {
        res.status(500).json({message:"Internal Error"})
        console.log(error);
        return
    }
})

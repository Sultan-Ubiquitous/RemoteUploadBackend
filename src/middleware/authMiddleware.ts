import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@clerk/express";

export const authenticateClerk = async(req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    
    if(!authHeader) return res.status(401).json({"message": "No auth token provided"});

    try {
        const token = authHeader.replace("Bearer ", "");
        const { userId } = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY!,
        });
        //@ts-ignore
        req.userId = userId;
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({ message: "Invalid token" });
    }

}
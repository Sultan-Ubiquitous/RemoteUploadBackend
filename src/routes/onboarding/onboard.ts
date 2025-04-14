import express, {Request, Response, Router} from "express";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import { createUserSchema } from "../../schema/user";
import { validateSchema } from "../../middleware/zod";
import { prismaGlobalClient } from "../../prisma/prisma_client";
import { createUser } from "../../services/user";

const router: Router = express.Router();

router.use(clerkMiddleware());
router.use(requireAuth());

router.post('/create_user', validateSchema(createUserSchema), (req: Request, res: Response) => {
    //Just make a normal user with userId and email
    try {
        const email = req.body.email;
        const userId = req.body.userId;
        const newUser = createUser(userId, email);

        res.status(201).json(newUser)
    } catch (error) {
        console.log('Error creating user: ', error);
    }
})

router.post('/create_editor', (req: Request, res: Response)=>{
    //This will only work after the person is invited, will look into this too when the user is invited and shiz
})

router.post('/create_organization', (req: Request, res: Response) => {
    //This route will get userId, organization name and slug, it will create organization using the createOrganizationFunction
    //And make a database entry too 
});
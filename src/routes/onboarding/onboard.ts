import express, {Request, Response, Router} from "express";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import { createUser } from "../../services/user";


const router: Router = express.Router();

router.use(clerkMiddleware());
router.use(requireAuth());

router.post('/create_user', (req: Request, res: Response) => {
    //Just make a normal user with userId and email
    try {
        const {userId, email } = req.body;

        const newUser = createUser(userId, email);

        res.status(201).json(newUser)
    } catch (error) {
        console.log('Error creating user:', error);
        res.status(500).json({ message: 'Internal Server error'});
    }
});

router.post('/create_editor', (req: Request, res: Response)=>{
    //This will only work after the person is invited, will look into this too when the user is invited and shiz
})

router.post('/create_organization', (req: Request, res: Response) => {
    //This route will get userId, organization name and slug, it will create organization using the createOrganizationFunction
    //And make a database entry too 
});

module.exports = router;


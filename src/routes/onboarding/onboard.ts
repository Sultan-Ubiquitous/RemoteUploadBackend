import express, {Request, Response, Router} from "express";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import { createUser, createOrganization } from "../../services/createThings";


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

router.post('/create_organization', async (req: Request, res: Response) => {
    try {
        const {orgName, orgSlug, ownerId } = req.body;

        const newOrganization = await createOrganization(orgName, orgSlug, ownerId);
        console.log(newOrganization);
        
        res.status(201).json(newOrganization)
    } catch (error) {
        console.log('Error creating user:', error);
        res.status(500).json({ message: 'Internal Server error'});
    } 
});

module.exports = router;

const orgName = 'Nigga'
const orgSlug = 'nigga-dot'
const ownerId = 'user_2vRcdfui0UV8g6ewp5KkzjwNcRb'



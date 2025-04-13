import express, {Request, Response, Router} from "express";
import { ClerkClient, clerkMiddleware, requireAuth } from "@clerk/express";

const router: Router = express.Router();

router.use(clerkMiddleware());
router.use(requireAuth());

router.post('/upload',  (req: Request, res: Response) => {
    res.json({
        "Uploaded to youtube": "Upload complete"
    });
})

router.get('/status', (req: Request, res: Response)=>{
    res.json({
        "OAuth Status": "IDK"
    });
})

module.exports = router;
 
import express, {Request, Response, Router} from "express";
import { clerkMiddleware, requireAuth } from "@clerk/express";

const router: Router = express.Router();

router.use(clerkMiddleware());
router.use(requireAuth());

router.get('/get_uploads', (req: Request, res: Response) => {
    res.json({
        "uploads": "All Uploades"
    });
});

router.post('/upload_files', (req: Request, res: Response) => {``
    
    /**Do something to upload files to s3 */


    res.json({
        "Uploaded to s3": "Upload complete"
    });
});


module.exports = router;

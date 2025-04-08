import express, {Request, Response, Router} from "express";

const router: Router = express.Router();


router.post('/upload_to_youtube', (req: Request, res: Response) => {
    res.json({
        "Uploaded to youtube": "Upload complete"
    });
})

module.exports = router;

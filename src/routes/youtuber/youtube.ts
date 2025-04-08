import express, {Request, Response} from "express";

const router = express.Router();

router.post('/upload_to_youtube', (req: Request, res: Response) => {
    res.json({
        "Uploaded to youtube": "Upload complete"
    });
})

module.exports = router;

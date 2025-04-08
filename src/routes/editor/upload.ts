import express, {Request, Response} from "express";

const router = express.Router();


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

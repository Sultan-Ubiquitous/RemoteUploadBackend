import express, { Application, Request, Response } from "express";
import dotenv from 'dotenv'

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3606;


app.use(express.json());


app.get('/', (req: Request, res: Response) => {
    res.json({
        "message": "Hello"
    });
});

app.get('/get_uploads', (req: Request, res: Response) => {
    res.json({
        "uploads": "All Uploades"
    });
});

app.post('/upload_files', (req: Request, res: Response) => {
    
    /**Do something to upload files to s3 */


    res.json({
        "Uploaded to s3": "Upload complete"
    });
});

app.post('/upload_to_youtube', (req: Request, res: Response) => {
    res.json({
        "Uploaded to s3": "Upload complete"
    });
})

app.listen(PORT, () => {
    console.log(`Server be running on http://localhost:${PORT}`);
});


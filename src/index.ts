import express, { Application, Request, Response } from "express";
import dotenv from 'dotenv'
//@ts-ignore
import OauthRouter from "./routes/oauth"; //@ts-ignore
import UploadRouter from "./routes/editor/upload"; //@ts-ignore
import YoutubeRouter from "./routes/youtuber/youtube";



dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8060;

app.use('/auth', OauthRouter);
app.use('/editor', UploadRouter);
app.use('/youtuber', YoutubeRouter);
app.use(express.json());


app.get('/', (req: Request, res: Response) => {
    res.json({
        "message": "Hello"
    });
});


app.listen(PORT, () => {
    console.log(`Server be running on http://localhost:${PORT}`);
});


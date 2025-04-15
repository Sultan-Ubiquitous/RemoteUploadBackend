import express, { Application, Request, Response } from "express";
import dotenv from 'dotenv'
import cors from 'cors';
//@ts-ignore routes and shit
import OauthRouter from "./routes/oauth"; //@ts-ignore
import UploadRouter from "./routes/member/upload"; //@ts-ignore
import YoutubeRouter from "./routes/owner/youtube"; //@ts-ignore
import OnboardRouter from "./routes/onboarding/onboard"

//Clerk imports
import { clerkMiddleware, requireAuth} from "@clerk/express";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8060;

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.use('/auth', OauthRouter);
app.use('/editor', UploadRouter);
app.use('/youtube', YoutubeRouter);
app.use('/onboard', OnboardRouter);



app.get('/test', requireAuth(), (req: Request, res: Response) => {
    res.json({
        "message": "If you are accessing this then you are authenticated blud"
    });
});

app.get('/', (req: Request, res: Response) => {
    res.json({
        "Error": "If you are accessing this then may or may not be authenticated blud"
    });
});

app.listen(PORT, () => {
    console.log(`Server be running on http://localhost:${PORT}`);
});

import { google } from "googleapis";
import crypto from 'crypto';
import dotenv from 'dotenv'
import express, {Request, Response, Application} from "express";
import session from 'express-session';
import { createClient } from "redis";
import { RedisStore } from "connect-redis";

dotenv.config();






/**
 * All things redis and sessions
 */

const redisClient = await createClient({
    socket:{
        port: Number(process.env.REDIS_PORT),
        host: process.env.REDIS_HOST
    }
})

redisClient.connect().catch(console.error);



const redisStore = new RedisStore({
    client: redisClient,
    prefix: "myapp:",
})

/**
 * Main user flow starts from here
 */

async function main() {
    const app: Application = express();
const PORT = process.env.OAUTH_PORT || 8080;
app.use(express.json());


const secret = crypto.randomBytes(32).toString('hex');

app.use(session({
    store: redisStore,
    secret: secret,
    resave: false,
    saveUninitialized: true,
}));

/**
 * All things OAuth begins from down here
 */

const oauth2Client = new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    process.env.OAUTH_REDIRECT_URL    
);

const scopes = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube.readonly',
]


app.get('/', async (req: Request, res: Response) => {
    const state = crypto.randomBytes(32).toString('hex');
    console.log(state);
    
    // req.session.state = state;

    const authorizationUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        include_granted_scopes: true,
        state: state
    });
    
    res.redirect(authorizationUrl)
})

app.get('/hello', async(req: Request, res: Response) => {
    res.json({
        "msg": "Hello"
    })
})


app.listen(PORT, () => {
    console.log(`Server be running on http://localhost:${PORT}`);
});
}

main().catch(console.error);
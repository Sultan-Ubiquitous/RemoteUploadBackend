import { google } from "googleapis";
import crypto from 'crypto';
import dotenv from 'dotenv'
import express, {Request, Response, Application} from "express";
import session from 'express-session';
import url from 'url';
import crypto from 'crypto';

dotenv.config();

/** Redis stuff starts from here */
import redis from 'redis';
import connectRedis from 'connect-redis';

const redisStore = connectRedis(session);
const redisClient = redis.createClient({
    host: Number(process.env.REDIS_HOST),
    port: process.env.REDIS_PORT
});

redisClient.on('error', function(err: Error){
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('error', function(){
    console.log('Connected succesfully with redis.');
});

let userCredential = null;

async function main(){
    const app: Application = express();
    // const PORT = process.env.OAUTH_PORT || 8080;
    const PORT =  8060;


    app.use(express.json());

    const secret = crypto.randomBytes(32).toString('hex');
    
    app.use(session({
        store: new redisStore({client: redisClient}),
        secret: secret,
        resave: false,
        saveUninitialized: true,
    }));

    const oauth2Client = new google.auth.OAuth2(
        process.env.OAUTH_CLIENT_ID,
        process.env.OAUTH_CLIENT_SECRET,
        process.env.OAUTH_REDIRECT_URL    
    );

    const scopes = [
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube.readonly',
    ]

    app.get('/', async(req: Request, res: Response) => {

        const state = crypto.randomBytes(32).toString('hex');
        
        req.session.state = state;
        console.log(state);

        const authorizationURL = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            include_granted_scopes: true,
            state: state
        })

        res.redirect(authorizationURL)
    });

    app.listen(PORT, () => {
        console.log(`Server be running on http://localhost:${PORT}`);
    });
    
}

main().catch(console.error);


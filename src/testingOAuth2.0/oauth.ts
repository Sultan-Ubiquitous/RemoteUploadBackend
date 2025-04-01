import { google } from "googleapis";
import crypto from 'crypto';
import dotenv from 'dotenv'
import express, {Request, Response, Application} from "express";
import session from 'express-session';
import url from 'url';
import crypto from 'crypto';

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
        'email',
        'profile',
        'https://www.googleapis.com/auth/youtube' // Full YouTube access
      ];

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
        console.log("Did my part!");
        
        res.redirect(authorizationURL)
    });

    app.get('/oauth2callback', async(req: Request, res: Response)=>{
        console.log("Sup babbey");
        
        let q = url.parse(req.url, true).query;

        if(q.error){
            console.log("Some error occured", q.error);            
        } else if(q.state !== req.session.state){
            console.log("State mismatched possible CSRF attack, u being slimed homie. Do sum bout it.");
            res.send("State mismatched possible CSRF attack, u being slimed homie. Do sum bout it.")            
        } else{
            let {tokens} = await oauth2Client.getToken(q.code);
            oauth2Client.setCredentials(tokens);
            /**
             * Let's try storing the token in database now
             */
            
            const oauth2 = google.oauth2({version: "v2", auth: oauth2Client });
            const userInfo = await oauth2.userinfo.get();

            const name = userInfo.data.name;
            const email = userInfo.data.email;
            userCredential = tokens;
            //Storing shit in prisma now;
            await prisma.userCredential.upsert({
                where: {email},
                update: {
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token || ' ',
                    expiresAt: new Date(Date.now() + tokens.expiry_date),
                },
                create: {
                    email,
                    name: name,
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token || '',
                    expiresAt: new Date(Date.now() + tokens.expiry_date),
                  },
            });

            // console.log('User credentials stored successfully.');


            /**
             * DB shit ends here
             */
            // 
            console.log("Now u can use youtube api ninja");
            res.json({
                'msg': "U is good homie, now u official"
            });
            
        }
    })
    
    app.listen(PORT, () => {
        console.log(`Server be running on http://localhost:${PORT}`);
    });
    
}

main().catch(console.error);


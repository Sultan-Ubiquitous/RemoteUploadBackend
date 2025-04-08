import { google } from "googleapis";
import crypto from 'crypto';
import dotenv from 'dotenv'
import express, {Request, Response, Router} from "express";
import session from 'express-session';
import url from 'url';


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

dotenv.config();

/** Redis stuff starts from here */
//@ts-ignore
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



// const router: routerlication = express();
const router: Router = express.Router();

    // const PORT = process.env.OAUTH_PORT || 8080;
    // const PORT =  8060;


    router.use(express.json());

    const secret = crypto.randomBytes(32).toString('hex');
    
    router.use(session({
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
    router.get('/', async(req: Request, res: Response) => {
        res.json({
            "msg": "Sup dawg, u good now but I will add some ways to check if request is authenticated or naw."
        });
    })
    router.get('/oauth', async(req: Request, res: Response) => {

        const state = crypto.randomBytes(32).toString('hex');
        //@ts-ignore
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

    router.get('/oauth2callback', async(req: Request, res: Response)=>{
        console.log("Sup babbey");
        
        let q = url.parse(req.url, true).query;

        if(q.error){
            console.log("Some error occured", q.error);
            //@ts-ignore            
        } else if(q.state !== req.session.state){
            console.log("State mismatched possible CSRF attack, u being slimed homie. Do sum bout it.");
            res.send("State mismatched possible CSRF attack, u being slimed homie. Do sum bout it.")            
        } else{
            //@ts-ignore
            let {tokens} = await oauth2Client.getToken(q.code);
            oauth2Client.setCredentials(tokens);
            /**
             * Let's try storing the token in database now
             */
            
            const oauth2 = google.oauth2({version: "v2", auth: oauth2Client });
            const userInfo = await oauth2.userinfo.get();

            
            //Storing shit in prisma now;
            // 
            
            const user = await prisma.user.upsert({
                where: { email: userInfo.data.email },
                create: {
                    email: userInfo.data.email,
                },
                update: {},
            });

            await prisma.authToken.upsert({
                where: {
                    // AuthToken needs a unique identifier - use the userId as there should only be one token per user
                    userId: user.id
                },
                create: {
                    userId: user.id,
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token || null,
                    expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
                    tokenType: tokens.token_type,
                    scope: tokens.scope
                },
                update: {
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token || null,
                    expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
                    tokenType: tokens.token_type, // Fixed the casing here (was TokenType in your original)
                    scope: tokens.scope
                }
            });
            //@ts-ignore
            req.session.userId = user.id;
            console.log('User credentials stored successfully.');


            /**
             * DB shit ends here
             */
            // 
            console.log("Now u can use youtube api ninja");
            res.redirect('/');
            
        }
    })
    
    // app.listen(PORT, () => {
    //     console.log(`Server be running on http://localhost:${PORT}`);
    // });

    module.exports = router;

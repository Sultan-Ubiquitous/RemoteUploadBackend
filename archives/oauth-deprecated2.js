// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

const { google } = require("googleapis");
const express = require("express");
const session = require('express-session');
const url = require('url')
const crypto = require('crypto');
require('dotenv').config(); 


/**
 * Redis stuff starts from here
 */
const redis = require('redis');
const connectRedis = require('connect-redis');

const RedisStore = connectRedis(session);
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});
redisClient.on('error', function(err){
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('error', function(){
    console.log('Connected succesfully with redis.');
});


let userCredential = null;

async function main() {
    const app: Application = express();
    const PORT = process.env.OAUTH_PORT || 8080;
    
    app.use(express.json());


    const secret = crypto.randomBytes(32).toString('hex');

    app.use(session({
        store: new RedisStore({client: redisClient}),
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


    app.get('/', async (req, res) => {
        const state = crypto.randomBytes(32).toString('hex');
        
        req.session.state = state;
        console.log(state);
        
        const authorizationUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            include_granted_scopes: true,
            state: state
        });
        
        res.redirect(authorizationUrl)
    })
    
    app.get('/oauth2callback', async (req, res) =>{
        //We are trying to see the secret shared and secret stored in session to make things clear yk.
        let q = url.parse(req.url, true).query;
        console.log(q.state);
        
        if(q.error){
            console.log('Some Error:' + q.error);
        } else if (q.state !== req.session.state){
            console.log('Be aware ninjas possible CSRF attack');
            res.end('We under attack buddy, stop all stuff and do what you do.');
        } else {
            let {tokens} = await oauth2Client.getToken(q.code);
            oauth2Client.setCredentials(tokens);
            console.log(tokens);
            
            // const oauth2 = google.oauth2({version: "v2", auth: oauth2Client});
            // const userInfo = await oauth2.userinfo.get();

            // const email = userInfo.data.email;
            // const name = userInfo.data.name;

            // await prisma.userCredential.upsert({
            //     where: {email},
            //     update: {
            //         accessToken: tokens.access_token
            //     }
            // })
        }
        
        
    })


    app.listen(PORT, () => {
        console.log(`Server be running on http://localhost:${PORT}`);
    });
}

main().catch(console.error);
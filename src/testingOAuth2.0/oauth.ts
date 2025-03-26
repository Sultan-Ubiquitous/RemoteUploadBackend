import { google } from "googleapis";
import crypto from 'crypto';
import dotenv from 'dotenv'
import express, {Request, Response, Application} from "express";
import session from 'express-session';
import {Redis} from "ioredis";
const RedisStore = require("connect-redis")(session)

dotenv.config();

const redisClient = new Redis();
const app: Application = express();
const PORT = process.env.OAUTH_PORT || 8080;

app.use(express.json());

const oauth2Client = new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    process.env.OAUTH_REDIRECT_URL    
);

const scopes = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube.readonly',
]

const state = crypto.randomBytes(32).toString('hex');


app.listen(PORT, () => {
    console.log(`Server be running on http://localhost:${PORT}`);
});
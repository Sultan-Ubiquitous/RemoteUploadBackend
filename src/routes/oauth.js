"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var googleapis_1 = require("googleapis");
var crypto_1 = require("crypto");
var dotenv_1 = require("dotenv");
var express_1 = require("express");
var express_session_1 = require("express-session");
var url_1 = require("url");
var express_2 = require("@clerk/express");
var prisma_client_1 = require("../prisma/prisma_client");
var prisma = prisma_client_1.prismaGlobalClient;
dotenv_1.default.config();
/** Redis stuff starts from here */
//@ts-ignore
var redis_1 = require("redis");
var connect_redis_1 = require("connect-redis");
var redisStore = (0, connect_redis_1.default)(express_session_1.default);
var redisClient = redis_1.default.createClient({
    host: Number(process.env.REDIS_HOST),
    port: process.env.REDIS_PORT
});
redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('error', function () {
    console.log('Connected succesfully with redis.');
});
// const router: routerlication = express();
var router = express_1.default.Router();
// const PORT = process.env.OAUTH_PORT || 8080;
// const PORT =  8060;
router.use((0, express_2.clerkMiddleware)());
router.use((0, express_2.requireAuth)());
router.use(express_1.default.json());
var secret = crypto_1.default.randomBytes(32).toString('hex');
router.use((0, express_session_1.default)({
    store: new redisStore({ client: redisClient }),
    secret: secret,
    resave: false,
    saveUninitialized: true,
}));
var oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.OAUTH_CLIENT_ID, process.env.OAUTH_CLIENT_SECRET, process.env.OAUTH_REDIRECT_URL);
var scopes = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube.readonly',
    'email',
    'profile',
    'https://www.googleapis.com/auth/youtube' // Full YouTube access
];
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.json({
            "msg": "Sup dawg, u good now but I will add some ways to check if request is authenticated or naw."
        });
        return [2 /*return*/];
    });
}); });
router.get('/oauth', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var state, authorizationURL;
    return __generator(this, function (_a) {
        state = crypto_1.default.randomBytes(32).toString('hex');
        //@ts-ignore
        req.session.state = state;
        console.log(state);
        authorizationURL = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            include_granted_scopes: true,
            state: state
        });
        console.log("Did my part!");
        res.redirect(authorizationURL);
        return [2 /*return*/];
    });
}); });
router.get('/oauth2callback', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var q, tokens, oauth2, userInfo, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Sup babbey");
                q = url_1.default.parse(req.url, true).query;
                if (!q.error) return [3 /*break*/, 1];
                console.log("Some error occured", q.error);
                return [3 /*break*/, 7];
            case 1:
                if (!(q.state !== req.session.state)) return [3 /*break*/, 2];
                console.log("State mismatched possible CSRF attack, u being slimed homie. Do sum bout it.");
                res.send("State mismatched possible CSRF attack, u being slimed homie. Do sum bout it.");
                return [3 /*break*/, 7];
            case 2: return [4 /*yield*/, oauth2Client.getToken(q.code)];
            case 3:
                tokens = (_a.sent()).tokens;
                oauth2Client.setCredentials(tokens);
                oauth2 = googleapis_1.google.oauth2({ version: "v2", auth: oauth2Client });
                return [4 /*yield*/, oauth2.userinfo.get()];
            case 4:
                userInfo = _a.sent();
                return [4 /*yield*/, prisma.user.findUnique({
                        where: {
                            //@ts-ignore
                            email: userInfo.data.email
                        }
                    })];
            case 5:
                user = _a.sent();
                return [4 /*yield*/, prisma.authToken.upsert({
                        where: {
                            // AuthToken needs a unique identifier - use the userId as there should only be one token per user
                            //@ts-ignore
                            userId: user.id
                        },
                        create: {
                            //@ts-ignore
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
                    })];
            case 6:
                _a.sent();
                //@ts-ignore
                req.session.userId = user.id;
                console.log('User credentials stored successfully.');
                /**
                 * DB shit ends here
                 */
                // 
                console.log("Now u can use youtube api ninja");
                res.redirect('/');
                _a.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); });
// app.listen(PORT, () => {
//     console.log(`Server be running on http://localhost:${PORT}`);
// });
module.exports = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var express_2 = require("@clerk/express");
var router = express_1.default.Router();
router.use((0, express_2.clerkMiddleware)());
router.use((0, express_2.requireAuth)());
router.post('/upload', function (req, res) {
    res.json({
        "Uploaded to youtube": "Upload complete"
    });
});
router.get('/status', function (req, res) {
    res.json({
        "OAuth Status": "IDK"
    });
});
module.exports = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var express_2 = require("@clerk/express");
var router = express_1.default.Router();
router.use((0, express_2.clerkMiddleware)());
router.use((0, express_2.requireAuth)());
router.get('/get_uploads', function (req, res) {
    res.json({
        "uploads": "All Uploades"
    });
});
router.post('/upload_files', function (req, res) {
    "";
    /**Do something to upload files to s3 */
    res.json({
        "Uploaded to s3": "Upload complete"
    });
});
module.exports = router;

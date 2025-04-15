"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var express_2 = require("@clerk/express");
var createThings_1 = require("../../services/createThings");
var router = express_1.default.Router();
router.use((0, express_2.clerkMiddleware)());
router.use((0, express_2.requireAuth)());
router.post('/create_user', function (req, res) {
    //Just make a normal user with userId and email
    try {
        var _a = req.body, userId = _a.userId, email = _a.email;
        var newUser = (0, createThings_1.createUser)(userId, email);
        res.status(201).json(newUser);
    }
    catch (error) {
        console.log('Error creating user:', error);
        res.status(500).json({ message: 'Internal Server error' });
    }
});
router.post('/create_editor', function (req, res) {
    //This will only work after the person is invited, will look into this too when the user is invited and shiz
});
router.post('/create_organization', function (req, res) {
    try {
        var _a = req.body, orgName_1 = _a.orgName, orgSlug_1 = _a.orgSlug, ownerId_1 = _a.ownerId;
        var newOrganization = (0, createThings_1.createOrganization)(orgName_1, orgSlug_1, ownerId_1);
        console.log(newOrganization);
        res.status(201).json(newOrganization);
    }
    catch (error) {
        console.log('Error creating user:', error);
        res.status(500).json({ message: 'Internal Server error' });
    }
});
module.exports = router;
var orgName = 'Nigga';
var orgSlug = 'nigga-dot';
var ownerId = 'user_2vRcdfui0UV8g6ewp5KkzjwNcRb';
console.log((0, createThings_1.createOrganization)(orgName, orgSlug, ownerId));

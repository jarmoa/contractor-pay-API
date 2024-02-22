const express = require('express');
const adminRoutes = express.Router();
const JobService = require("../services/jobService");
const ProfileService = require("../services/profileService");

/**
 * Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.
 * @returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.
 */
adminRoutes.get('/best-profession',async (req, res, next) =>{
    const { start, end } = req.query;

    try {
        const profession = await JobService.getMostPaidProfession(start, end)
        res.json(profession)
    } catch (error) {
        next(error);
    }
})

/**
 * @returns the clients the paid the most for jobs in the query time period. limit query parameter should be applied, default limit is 2.
 */
adminRoutes.get('/best-clients',async (req, res, next) =>{
    const { start, end, limit} = req.query;

    try {
        const clients = await JobService.getBestClients(start, end, limit);
        res.json(clients)
    } catch (error) {
        next(error);
    }
})


/**
 * @returns all the profiles
 */
adminRoutes.get('/profiles',async (req, res, next) =>{
    try {
        const profiles = await ProfileService.getProfiles();
        res.json(profiles)
    } catch (error) {
        next(error);
    }
})
module.exports = adminRoutes;  
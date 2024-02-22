const express = require('express');
const jobRoutes = express.Router();
const JobService = require("../services/jobService");

/**
 * @returns all unpaid jobs for a user (**_either_** a client or contractor), for **_active contracts only_**.
 */
jobRoutes.get('/unpaid',async (req, res, next) =>{
    try {
        const profileId = req.profile.id;
        const contract = await JobService.getUnpaidJobs(profileId)
        res.json(contract)
    } catch (error) {
        next(error);
    }
})

/**
 * Pay for a job, a client can only pay if his balance >= the amount to pay. The amount should be moved from the client's balance to the contractor balance.
 * @returns true if the payment was successful
 */
jobRoutes.post('/:jobId/pay',async (req, res, next) =>{
    const { jobId } = req.params;
    const profile = req.profile;

    try {
        const paid = await JobService.payToContractor(jobId, profile)
        res.json(paid)
    } catch (error) {
        next(error);
    }

    
})

module.exports = jobRoutes;
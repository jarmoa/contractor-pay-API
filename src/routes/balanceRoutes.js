const express = require('express');
const balanceRoutes = express.Router();
const ProfileService = require("../services/profileService");

/**
 * Deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)
 * @returns 
 */
balanceRoutes.post('/deposit/:userId',async (req, res, next) =>{
    const { userId } = req.params;
    const { amount } = req.body;

    try {
        const result = await ProfileService.depositToClient(userId, amount);
        res.json(result)
    } catch (error) {
        next(error);
    }
})

module.exports = balanceRoutes;
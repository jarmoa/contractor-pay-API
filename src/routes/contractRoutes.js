const express = require('express');
const contractRoutes = express.Router();
const ContractService = require("../services/contractService");
const {getProfile} = require("../middleware/getProfile")
/**
 * @returns contract by id that belong to logged profile
 */
contractRoutes.get('/:id', getProfile, async (req, res, next) =>{
    const {id} = req.params
    try {
        const contract = await ContractService.getContract(id, req.profile.id)
        res.json(contract)
    } catch (error) {
        next(error);
    }
    
})

/**
 * @returns all no terminated contracts that belong to logged profile
 */
contractRoutes.get('/',async (req, res, next) =>{

    try {
        const contracts = await ContractService.getNonTerminatedContracts(req.profile.id)
        res.json(contracts)
    } catch (error) {
        next(error);
    }
})

module.exports = contractRoutes;
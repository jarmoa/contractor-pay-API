const ContractController = require("../controllers/contractController");
const { AppError } = require("../middleware/errorHandler");

const getContract = async (contractId, profileId) => {
    const contract = await ContractController.getContract(contractId, profileId);
    if (!contract) {
        throw new AppError(404, 'Contract not found');
    }
    return contract;
}

const getNonTerminatedContracts = async (profileId) => {
    const contracts = await ContractController.getNonTerminatedContracts(profileId);
    if (!contracts || contracts.length === 0) {
        throw new AppError(404, 'Contracts not found');
    }
    return contracts;
}

module.exports = {
    getContract,
    getNonTerminatedContracts
};
const {Op} = require("sequelize");
const {Contract} = require("../model");

const getContract = async (contractId, profileId) => {
    return Contract.findOne({
        where: {
            id: contractId,
            [Op.or]: [
                { ContractorId: profileId },
                { ClientId: profileId }
            ]
        }
    });
}

const getNonTerminatedContracts = async (profileId) => {
    return Contract.findAll({
        where: {
            status: {
                [Op.not]: 'terminated'
            },
            [Op.or]: [
                { ContractorId: profileId },
                { ClientId: profileId }
            ]
        }
    })
}


module.exports = {
    getContract,
    getNonTerminatedContracts
};
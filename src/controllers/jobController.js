const {Op} = require("sequelize");
const {Contract, Job, Profile, sequelize} = require("../model");
const { AppError } = require("../middleware/errorHandler");

const getUnpaidJobs = async (profileId) => {
    return Contract.findAll({
        where: {
            [Op.or]: [
                { ContractorId: profileId },
                { ClientId: profileId }
            ],
            status: 'in_progress',
        }, include: [{
            model: Job,
            where: {
                paid: {
                    [Op.not]: true // the paid field is null when is not set
                }
            }
        }]
    });
}

const getUnpaidJob = async (jobId, profile) => {
    return await Job.findOne({
        where: {
            paid: {
                [Op.not]: true
            },
            id: jobId
        }, include: [
            {
                model: Contract,
                where: {
                    status: 'in_progress',
                }, include: {
                    model: Profile,
                    as: 'Client',
                    where: {
                        id: profile.id
                    }
                }
            }
        ],
        raw: true
    });
};

const payToContractor = async (jobId, client, contractorId, price) => {

    const transactionInstance = await sequelize.transaction();

    try {
        await Profile.update({
            balance: sequelize.literal(`balance - ${price}`),
        }, {
            where: {
                id: client
            }, transaction: transactionInstance
        });

        await Profile.update({
            balance: sequelize.literal(`balance + ${price}`),
        }, {
            where: {
                id: contractorId
            }, transaction: transactionInstance
        });

        await Job.update({ paid: true, paymentDate: new Date() }, {
            where: {
                id: jobId,
                paid: {
                    [Op.not]: true
                }
            }, transaction: transactionInstance
        });

        await transactionInstance.commit();
        return true;

    } catch (error) {
        await transactionInstance.rollback();
        throw new AppError(409, 'Job could not be updated. Try again later.');
    }
}

const getMostPaidProfession = async (start, end) => {
    return await Job.findAll({
        where: {
            paid: true,
            paymentDate: {
                [Op.between]: [start, end]
            }
        },
        include: [{
            model: Contract,
            attributes: [],
            include: [{
                model: Profile,
                as: 'Contractor',
                attributes: ['profession']
            }]
        }],
        attributes: [
            [sequelize.fn('SUM', sequelize.col('price')), 'totalAmount'],
            [sequelize.col('Contract.Contractor.profession'), 'profession']
        ],
        group: ['Contract.Contractor.profession'],
        order: [[sequelize.literal('totalAmount'), 'DESC']],
        limit: 1,
        raw: true,
    }).then(result => {
        if (result && result.length > 0) {
            return result[0].profession
        }
        return 'No profession found'});
}

const getBestClients = async (start, end, limit) => {
    return Job.findAll({
        where: {
            paid: true,
            paymentDate: {
                [Op.between]: [start, end]
            }
        }, include: [{
            model: Contract,
            attributes: [],
            include: [{
                model: Profile,
                as: 'Client',
                attributes: []
            }]
        }],
        attributes: [
            [sequelize.col('Contract.Client.id'), 'id'],
            [sequelize.literal('firstName || \' \' || lastName'), 'fullName'],
            [sequelize.fn('SUM', sequelize.col('price')), 'paid']
        ],
        order: [[sequelize.literal('paid'), 'DESC']],
        group: ['Contract.Client.id'],
        raw: true,
        limit: limit ? limit : 2
    })
}

module.exports = {
    getUnpaidJobs,
    getUnpaidJob,
    payToContractor,
    getMostPaidProfession,
    getBestClients
};
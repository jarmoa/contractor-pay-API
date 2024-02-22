const {Op} = require("sequelize");
const {Profile, Contract, Job, sequelize } = require("../model");
const {AppError} = require("../middleware/errorHandler");


const depositToClient = async (profileId, amount) => {

    const transaction = await Profile.sequelize.transaction();
    try {
        const profile = await Profile.findOne({
          where: { id: profileId, 
            type: 'client'},
          lock: transaction.LOCK.UPDATE,
          transaction
        });
    
        if (!profile) {
          throw new AppError('404', 'Profile not found');
        }

        const jobsPaymentAmount = await Job.findAll({
            where: {
                paid: {
                    [Op.not]: true
                },
            },
            include: [
                {
                    model: Contract,
                    attributes: [],
                    where: {
                        status: 'in_progress',
                        ClientId: profileId
                    }
                }
            ],
            attributes: [
                [sequelize.fn('SUM', sequelize.col('price')), 'totalAmount']
            ], 
            raw: true
        })
        .then(result => result[0].totalAmount)

        const depositLimit = jobsPaymentAmount * 0.25;

        if (amount > depositLimit) {
            throw new AppError(409, 'The amount exceeded the deposit limit');
        }
    
        profile.balance += amount;
    
        await profile.save({ transaction });
    
        await transaction.commit();
    
        return true;
      } catch (error) {
        await transaction.rollback();
        if (error instanceof AppError) {
          throw error;
        } 
        throw new AppError('409', 'Deposit failed due to a conflict. Try again later.');
      }
}

const getProfiles = async () => {
    return Profile.findAll(); 
}


module.exports = {
    depositToClient,
    getProfiles
};
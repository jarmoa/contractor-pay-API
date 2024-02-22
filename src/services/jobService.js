const JobController = require("../controllers/jobController");
const {stringToDate} = require('../utils/dateUtils');
const { AppError } = require("../middleware/errorHandler");

const getUnpaidJobs = async (profileId) => {
    const jobs = await JobController.getUnpaidJobs(profileId);
    
    if (!jobs || jobs.length === 0) {
        throw new AppError(404, 'Jobs not found');
    }
    return jobs;
}

const payToContractor = async (jobId, profile) => {

    if (profile.type !== 'client') {
        throw new AppError(409, 'Profile is not a client');
    }

    if (profile.balance <= 0) {
        throw new AppError(409, 'Client balance is empty');
    }

    const job = await JobController.getUnpaidJob(jobId, profile)

    if (!job) {
        throw new AppError(404, 'Job not found');
    }

    if (job.price > profile.balance) {
        throw new AppError(409, 'Insufficient funds');
    }

    return await JobController.payToContractor(jobId, profile, job['Contract.ContractorId'], job.price);
}

const getMostPaidProfession = async (start, end) => {

    if (!end || !start || end < start) {
        throw new AppError(409, 'Invalid dates');
    }

    return await JobController.getMostPaidProfession(stringToDate(start), stringToDate(end))
}

const getBestClients = async (start, end, limit) => {

    if (!end || !start || end < start) {
        throw new AppError(409, 'Invalid dates');
    }
    
    return await JobController.getBestClients(stringToDate(start), stringToDate(end), limit)
}

module.exports = {
    getUnpaidJobs,
    payToContractor,
    getMostPaidProfession, 
    getBestClients
};
const ProfileController = require("../controllers/profileController");
const { AppError } = require("../middleware/errorHandler");


const depositToClient = async (profileId, amount) => {

    return ProfileController.depositToClient(profileId, amount);
}

const getProfiles = async () => {
    const profiles = await ProfileController.getProfiles();
    
    if (!profiles || profiles.length === 0) {
        throw new AppError(404, 'Profiles not found');
    }
    return profiles;
}

module.exports = {
    depositToClient,
    getProfiles
};
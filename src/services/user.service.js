const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwtProvider = require('../config/jwtProvider');

const createUser = async (userData) => {
    try {
        let { firstname, lastname, email, password, mobile } = userData;

        const isUserExist = await User.findOne({ email });

        if (isUserExist) {
            return res.status(404).send({ message: `User not found with email: ${email}` });

        }

        password = await bcrypt.hash(userData.password, 8);

        const user = await User.create({ firstname, lastname, email, password, mobile });
        console.log('User created successfully:', user);
        return user;
    } catch (error) {
        throw new Error('Error creating user: ' + error.message);
    }
}

const findUserById = async (userId) => {
    try {
        const user = await User.findById(userId)
        //.populate("address");
        if (!user) {
            throw new Error('User not found with id: ' + userId);
        }
        return user;
    } catch (error) {
        throw new Error('Error finding user: ' + error.message);
    }
}
const getUserbyEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found with email: ' + email);
        }
        return user;
    } catch (error) {
        throw new Error('Error finding user: ' + error.message);
    }
}

const getUserProfileByToken = async (token) => {
    try {
        const userId = jwtProvider.getUserIdFromToken(token);

        const user = await findUserById(userId);
        if (!user) {
            throw new Error("user not found with id:", userId)
        }
        return user;

    } catch (error) {
        throw new Error('Error getting user profile by token: ' + error.message);
    }
}

const getAllUsers = async () => {
    try {
        const users = await User.find();
        return users;
    } catch (error) {
        throw new Error('Error getting all users: ' + error.message);
    }
}

module.exports = { createUser, findUserById, getUserbyEmail, getUserProfileByToken, getAllUsers };
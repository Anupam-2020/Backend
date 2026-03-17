const bcrypt = require('bcryptjs');
const {users} = require('../data/db');
const {generateToken} = require('../utils/jwt');

const signup = async (req, resp, next) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = users.find(user => user.email === email)
        if(existingUser) {
            resp.status(409).json({
                message: 'User already exist'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: users.length + 1,
            name,
            email,
            password: hashedPassword
        }

        users.push(newUser);

        resp.status(201).json({
            message: 'User created',
            data: newUser
        })
    } catch(error) {
        next(error) // Pass the error to the error handling middleware
    }
}

const login = async(req, resp, next) => {
    try {
        const { email, password } = req.body;
        const isUserValid = users.find(user => user.email === email);
        if(!isUserValid) {
            return resp.status(401).json({
                message: 'Invalid Credentials'
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, isUserValid.password);
        if(!isPasswordCorrect) {
            return resp.status(401).json({
                message: 'Invalid Credentials'
            })
        }

        resp.status(200).json({
            message: 'Login Successful',
            token: generateToken(isUserValid.id)
        });

    } catch(error) {
        next(error)
    }
}


module.exports = { signup, login };
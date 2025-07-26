const userModel = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
require('dotenv').config();
const getUsers = async(req,res)=>{
    try {
        const users = await userModel.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error while retrieving users:',error);
        res.status(500).send('Error while fetching users');
    }
};
const postUsers = async (req,res)=>{
    const {name,email,password} = req.body;
    if(!name||!email||!password){
        return res.status(400).json({error:'Name,email,password are required'})
    }
    try {
        const existingUser = await userModel.findOne({ where: { email } });

        if (existingUser) {
            return res.status(409).json({ error: 'User with this email already exists' }); // 409 Conflict
        }
        const newUser = await userModel.create({
            name,
            email,
            password
        });
        res.status(200).json({
            message: `User ${newUser.name} is added successfully`,
            user:newUser
        }); 
    } catch (error) {
        console.error('Error while adding the user',error),
        res.status(500).send('Error while adding the user')
    }
};
module.exports = {
    getUsers,
    postUsers
}
const userModel = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../utilities/sql');
const saltRounds = 10;
require('dotenv').config();
function generateAccessToken(id) {
    return jwt.sign({ UserId: id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}
const getUsers = async (req, res) => {
  try {
    const users = await userModel.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error while retrieving users:', error);
    res.status(500).send('Error while fetching users');
  }
};

const postUsers = async (req,res)=>{
    const t = await sequelize.transaction();
    const {name,email,password} = req.body;
    if(!name||!email||!password){
        return res.status(400).json({error:'Name,email,password are required'})
    }
    try {
        //userModel.findOne() doesn't accept transaction as a second argument 
        const existingUser = await userModel.findOne(
            { where: { email } ,transaction:t
        });

        if (existingUser) {
            //rollback here
            await t.rollback();
            return res.status(409).json({ error: 'User with this email already exists' }); // 409 Conflict
        }
        const hashedPassword = await bcrypt.hash(password,saltRounds);

        const newUser = await userModel.create({
            name,
            email,
            password:hashedPassword
        },{transaction:t});
        await t.commit();
        res.status(200).json({
            message: `User ${newUser.name} is added successfully`,
            user:newUser
        }); 
    } catch (error) {
        await t.rollback();
        console.error('Error while adding the user',error),
        res.status(500).send('Error while adding the user')
    }
};
const loginUser = async(req,res)=>{
    const{email,password} = req.body;
    try {
        const emailValidation = await userModel.findOne({
            where:{email}
        });
        if (!emailValidation) {
            return res.status(404).json({ error: 'Unauthorized user' });
        }
        else if(!await bcrypt.compare(password,emailValidation.password)){
            return res.status(401).json({error:'Invalid password'});
        }
        const token = generateAccessToken(emailValidation.id);
        return res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: emailValidation.id, email: emailValidation.email },
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });   
    }
}
module.exports = {
    getUsers,
    postUsers,
    loginUser
}
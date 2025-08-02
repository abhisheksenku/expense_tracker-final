const expenseModel = require('../models/expenses');
const User = require('../models/users');
const sequelize = require('../utilities/sql');
require('dotenv').config();
const AWS = require('aws-sdk');
const getExpenses = async(req,res)=>{
    try {
        const UserId = req.user.id;
        const expenses = await expenseModel.findAll({
            where:{UserId}
        });
        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error while retrieving expenses:',error);
        res.status(500).send('Error while fetching expenses');
    }
};
const postExpenses = async(req,res)=>{
    const {date,amount,description,category,note} = req.body;
    const UserId = req.user.id;
    if(!amount||!description||!category){
        return res.status(400).json({error:'Name,email,password are required'})
    };
    const t = await sequelize.transaction();
    try {
        let newExpense;
        if(category.toLowerCase()==='salary'){
            newExpense = await expenseModel.create({
                            date,
                            amount:null,
                            description,
                            category,
                            income:parseFloat(amount),
                            UserId,
                            note
                        },{transaction:t});
            const user = await User.findByPk(UserId, { transaction: t });
            user.totalIncome = (user.totalIncome || 0) + parseFloat(amount);
            await user.save({ transaction: t });
        }else{
            newExpense = await expenseModel.create({
                        date,
                        amount:parseFloat(amount),
                        description,
                        category,
                        income:null,
                        UserId,
                        note
                        },{transaction:t});            
            const user = await User.findByPk(UserId, { transaction: t });
            user.totalExpenses = (user.totalExpenses || 0) + parseFloat(amount); 
            await user.save({ transaction: t });
        }        
        
        await t.commit();
        res.status(200).json({
            message: `Expense ${newExpense} is added successfully`,
            expense:newExpense
        })
    } catch (error) {
        await t.rollback();
        console.error('Error while adding the expense',error),
        res.status(500).send('Error while adding the expense')
    }
};
const deleteExpenses = async(req,res)=>{
    const t = await sequelize.transaction();
    try {
        const {id} = req.params;
        const UserId = req.user.id;
        console.log('Deleting expense with ID:', id);
        const expense = await expenseModel.findOne({
            where:{
                id,
                UserId
            },
            transaction:t
        });
        if(!expense){
            await t.rollback();
            return res.status(404).send('Expense not found or unauthorized');
        }
        const user = await User.findByPk(UserId);
        //Prevents totalExpenses from going below zero
        //Prevents NaN if totalExpenses was missing or null
        user.totalExpenses = Math.max(0, (user.totalExpenses || 0) - parseFloat(expense.amount));
        await expense.destroy({transaction:t});
        await user.save({transaction:t});
        await t.commit();
        res.status(200).send('Expense deleted successfully');
    } catch (error) {
        await t.rollback();
        console.error('Error while deleting expense:', error);
        res.status(500).send('Error deleting expense');
    }
};
function uploadToS3(data, filename) {
    const BUCKET_NAME = process.env.IAM_BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    const s3 = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    });

    const params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL:'public-read'
    };

    return new Promise((resolve, reject) => {
        s3.upload(params, (err, s3response) => {
            if (err) {
                console.log('S3 upload error:', err);
                reject(err);
            } else {
                console.log('S3 upload success:', data);
                resolve(s3response.Location);
            }
        });
    });
}

const downloadReport = async (req, res) => {
    try {
        const expenses = await req.user.getExpenses();
        const stringifiedExpenses = JSON.stringify(expenses);
        const UserId = req.user.id;
        const fileName = `Expense-${req.user.id}-${Date.now()}.txt`;
        const fileURL = await uploadToS3(stringifiedExpenses, fileName);
        res.status(200).json({ fileURL, success: true });
    } catch (err) {
        console.error('Download report error:', err);
        res.status(500).json({ success: false, message: 'Failed to download report' });
    }
};

module.exports = {
    getExpenses,
    postExpenses,
    deleteExpenses,
    downloadReport
}
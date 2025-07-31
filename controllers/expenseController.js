const expenseModel = require('../models/expenses');
const User = require('../models/users');
const sequelize = require('../utilities/sql');
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
}
module.exports = {
    getExpenses,
    postExpenses,
    deleteExpenses
}
const expenseModel = require('../models/expenses');
const getExpenses = async(req,res)=>{
    try {
        const UserId = req.user.id;
        const expenses = await expenseModel.findAll({
            where:UserId
        });
        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error while retrieving expenses:',error);
        res.status(500).send('Error while fetching expenses');
    }
};
const postExpenses = async(req,res)=>{
    const {amount,description,category} = req.body;
    const UserId = req.user.id;
    if(!amount||!description||!category){
        return res.status(400).json({error:'Name,email,password are required'})
    };
    try {
        const newExpense = await expenseModel.create({
            amount,
            description,
            category,
            UserId
        });
        res.status(200).json({
            message: `Expense ${newExpense} is added successfully`,
            expense:newExpense
        })
    } catch (error) {
        console.error('Error while adding the expense',error),
        res.status(500).send('Error while adding the expense')
    }
};
const deleteExpenses = async(req,res)=>{
    try {
        const {id} = req.params;
        const UserId = req.user.id;
        console.log('Deleting expense with ID:', id);
        const expense = await expenseModel.findOne({
            where:{
                id,
                UserId
            }
        });
        if(!expense){
            return res.status(404).send('Expense not found or unauthorized');
        }
        await expense.destroy();
        res.status(200).send('Expense deleted successfully');
    } catch (error) {
        console.error('Error while deleting expense:', error);
        res.status(500).send('Error deleting expense');
    }
}
module.exports = {
    getExpenses,
    postExpenses,
    deleteExpenses
}
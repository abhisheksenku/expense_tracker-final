const Expense = require('../models/expenses');

const pagination = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Expense.findAndCountAll({
            offset,
            limit
        });

        const paginationInfo = {
            currentPage: page,
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            hasNextPage: offset + limit < count,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1
        };

        res.status(200).json({
            expenses: rows,
            pagination: paginationInfo
        });
    } catch (error) {
        console.error('Pagination Error:', error);
        res.status(500).json({ error: 'Something went wrong while paginating.' });
    }
};

module.exports = {
    pagination
};

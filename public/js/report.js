document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    const monthFilter = document.getElementById('monthFilter');
    const yearFilter = document.getElementById('yearFilter');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const applyFiltersBtn = document.getElementById('applyFilters');

    const tbody = document.getElementById('expense-body');
    const incomeTotalEl = document.getElementById('incomeTotal');
    const expenseTotalEl = document.getElementById('expenseTotal');
    const savingsTotal = document.getElementById('savingsTotal');

    let allExpenses = [];

    try {
        const response = await axios.get('http://localhost:3000/expense/fetch', {
            headers: { Authorization: token }
        });
        allExpenses = response.data;

        populateFilters(allExpenses);
        fetchProducts(1); // default page 1
    } catch (error) {
        console.error('Failed to load expenses:', error);
    }

    function populateFilters(expenses) {
        const months = new Set();
        const years = new Set();

        expenses.forEach(exp => {
            const dateObj = new Date(exp.date);
            months.add(dateObj.getMonth() + 1);
            years.add(dateObj.getFullYear());
        });

        [...months].sort((a, b) => a - b).forEach(month => {
            const opt = document.createElement('option');
            opt.value = month;
            opt.textContent = new Date(0, month - 1).toLocaleString('default', { month: 'long' });
            monthFilter.appendChild(opt);
        });

        [...years].sort((a, b) => a - b).forEach(year => {
            const opt = document.createElement('option');
            opt.value = year;
            opt.textContent = year;
            yearFilter.appendChild(opt);
        });
    }

    applyFiltersBtn.addEventListener('click', () => {
        const selectedMonth = monthFilter.value;
        const selectedYear = yearFilter.value;
        const startDate = startDateInput.value ? new Date(startDateInput.value) : null;
        const endDate = endDateInput.value ? new Date(endDateInput.value) : null;

        const filtered = allExpenses.filter(exp => {
            const expDate = new Date(exp.date);

            const matchMonthYear = (!selectedMonth || expDate.getMonth() + 1 === +selectedMonth)
                && (!selectedYear || expDate.getFullYear() === +selectedYear);

            const matchDateRange = (!startDate || expDate >= startDate)
                && (!endDate || expDate <= endDate);

            return matchMonthYear && matchDateRange;
        });

        renderTable(filtered);
    });

    function renderTable(expenses) {
        tbody.innerHTML = '';
        let totalIncome = 0;
        let totalExpense = 0;

        expenses.sort((a, b) => new Date(a.date) - new Date(b.date));

        expenses.forEach(exp => {
            const isIncome = exp.category.toLowerCase() === 'salary';
            const incomeAmount = isIncome ? parseFloat(exp.income) : 0;
            const expenseAmount = !isIncome ? parseFloat(exp.amount) : 0;

            totalIncome += incomeAmount;
            totalExpense += expenseAmount;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(exp.date).toLocaleDateString()}</td>
                <td>${exp.description}</td>
                <td>${exp.category}</td>
                <td>${isIncome ? '₹' + incomeAmount.toFixed(2) : '-'}</td>
                <td>${!isIncome ? '₹' + expenseAmount.toFixed(2) : '-'}</td>
            `;
            tbody.appendChild(row);
        });

        incomeTotalEl.textContent = totalIncome.toFixed(2);
        expenseTotalEl.textContent = totalExpense.toFixed(2);
        savingsTotal.textContent = (totalIncome - totalExpense).toFixed(2);
    }

    function fetchProducts(page) {
        const limit = 10; // fixed to 10 items per page
        axios.get(`http://localhost:3000/report/paginate?page=${page}&limit=${limit}`, {
            headers: { Authorization: token }
        })
        .then(response => {
            const { expenses, pagination } = response.data;

            renderTable(expenses);

            const paginationDiv = document.getElementById('pagination');
            paginationDiv.innerHTML = '';

            if (pagination.hasPreviousPage) {
                paginationDiv.appendChild(createPageButton(pagination.previousPage, 'Prev'));
            }

            paginationDiv.appendChild(createPageButton(pagination.currentPage, `${pagination.currentPage}`));

            if (pagination.hasNextPage) {
                paginationDiv.appendChild(createPageButton(pagination.nextPage, 'Next'));
            }
        })
        .catch(err => {
            console.error("Error fetching paginated expenses:", err);
        });
    }

    function createPageButton(pageNumber, text) {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.onclick = () => fetchProducts(pageNumber);
        return btn;
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    const monthFilter = document.getElementById('monthFilter');
    const yearFilter = document.getElementById('yearFilter');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const itemsSelect = document.getElementById('itemsPerPage');
    const tbody = document.getElementById('expense-body');
    const incomeTotalEl = document.getElementById('incomeTotal');
    const expenseTotalEl = document.getElementById('expenseTotal');
    const savingsTotal = document.getElementById('savingsTotal');
    const downloadBtn = document.getElementById('downloadBtn');

    let allExpenses = [];

    try {
        const response = await axios.get(`${BASE_URL}/expense/fetch`, {
            headers: { Authorization: token }
        });
        allExpenses = response.data;

        populateFilters(allExpenses);
        renderTable(allExpenses); 
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
    
    // Items per page
    const savedItemsPerPage = localStorage.getItem('itemsPerPage') || '10';
    itemsSelect.value = savedItemsPerPage;
    fetchProducts(1, parseInt(savedItemsPerPage));

    itemsSelect.addEventListener('change', () => {
        const newLimit = parseInt(itemsSelect.value);
        localStorage.setItem('itemsPerPage', newLimit);
        fetchProducts(1, newLimit);
    });
    downloadBtn.addEventListener('click',async()=>{
        try {
            const response = await axios.get(`${BASE_URL}/expense/download`, {
                headers: { Authorization: token }
            });
            if (response.data.success) {
                const fileURL = response.data.fileURL;
                const a = document.createElement('a');
                a.href = fileURL;
                a.download = 'ExpenseReport.txt';
                a.click();
            } else {
                alert('Failed to download the report.');
            }
        } catch (error) {
            console.error('Download failed:', error);
            alert('An error occurred while downloading the report.');
        }
    })

    function renderTable(expenses) {
        tbody.innerHTML = '';
        let totalIncome = 0;
        let totalExpense = 0;

        expenses.sort((a, b) => new Date(a.date) - new Date(b.date));

        expenses.forEach(exp => {
            //like first we will check whther category is salry true or not
            //then if this is true we are going to keep this in incomeAmount and making expense
            //zero as it is false in that case

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
                <td>${exp.note}</td>
            `;
            tbody.appendChild(row);
        });

        incomeTotalEl.textContent = totalIncome.toFixed(2);
        expenseTotalEl.textContent = totalExpense.toFixed(2);
        savingsTotal.textContent = (totalIncome - totalExpense).toFixed(2);
    }

    function fetchProducts(page,limit) {
        // const limit = 10; // fixed to 10 items per page
        axios.get(`${BASE_URL}/report/paginate?page=${page}&limit=${limit}`, {
            headers: { Authorization: token }
        })
        .then(response => {
            const { expenses, pagination } = response.data;

            renderTable(expenses);

            const paginationDiv = document.getElementById('pagination');
            paginationDiv.innerHTML = '';

            if (pagination.hasPreviousPage) {
                paginationDiv.appendChild(createPageButton(pagination.previousPage, 'Prev',limit));
            }

            paginationDiv.appendChild(createPageButton(pagination.currentPage, `${pagination.currentPage}`,limit));

            if (pagination.hasNextPage) {
                paginationDiv.appendChild(createPageButton(pagination.nextPage, 'Next',limit));
            }
        })
        .catch(err => {
            console.error("Error fetching paginated expenses:", err);
        });
    }

    function createPageButton(pageNumber, text,limit) {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.onclick = () => fetchProducts(pageNumber, limit);
        return btn;
    }
});

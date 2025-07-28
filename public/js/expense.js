document.addEventListener('DOMContentLoaded',async()=>{
    const expenseForm = document.getElementById('expenseTracker_form');
    const list = document.getElementById('full_list');
    const token = localStorage.getItem('token');
    if(!token){
        alert('You must be logged in');
        window.location.href = 'login.html';
        return;
    }
    try {
        const premiumResponse = await axios.get('http://localhost:3000/premium/status', {
            headers: { Authorization: token }
        });
        const isPremium = premiumResponse.data.isPremium;
        if(isPremium){
            if (!document.getElementById('premium')) {
                const status = document.createElement('p');
                status.id = 'premium';
                status.textContent = 'You are now a premium user';
                status.style.color = 'green';
                status.style.fontWeight = 'bold';
                premiumButton.replaceWith(status);
            }
        }
        const response = await axios.get('http://localhost:3000/expense/fetch',{
            headers:{Authorization:token}
        });
        const expenses = response.data;
        expenses.forEach(expense => {
           addToUI(expense,list) 
        });
    } catch (error) {
        console.error('Error while fetching expenses:', error);
    }
    expenseForm.addEventListener('submit',async(event)=>{
        event.preventDefault();
        const formData = new FormData(expenseForm);
        const formValues = Object.fromEntries(formData.entries());
        console.log(formValues);
        try {
            const response = await axios.post('http://localhost:3000/expense/add',formValues,{
                headers:{Authorization:token}
            });
            console.log(response);
            console.log(response.data);
            addToUI(response.data.expense, list);
            expenseForm.reset();
        } catch (error) {
            console.log('Error while adding the expense:', error);
        }
    });
    list.addEventListener('click', async(event)=>{
        const listItem = event.target.closest('.listItem');
        if (!listItem) return;
        if (event.target.classList.contains('delete')) {
            const id = listItem.dataset.id;
            try {
                await axios.delete(`http://localhost:3000/expense/delete/${id}`,{
                    headers:{Authorization:token}
                });
                listItem.remove();
                window.location.reload();
            } catch (error) {
                console.log('Error while deleting:', error);
            }
        }
    });
});
function addToUI(formValues, list) {
    const listItem = document.createElement('li');
    listItem.className = 'listItem';
    listItem.dataset.id = formValues.id;
    listItem.textContent = `Amount: ₹${formValues.amount}, Description: ${formValues.description}, Category: ${formValues.category}`;
    addButtons(listItem);
    list.appendChild(listItem);
}

function addButtons(listItem) {
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete';
    deleteButton.textContent = 'Delete';
    listItem.appendChild(document.createTextNode(' '));
    listItem.appendChild(deleteButton);
}

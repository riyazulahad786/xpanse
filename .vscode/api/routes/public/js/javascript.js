function init() {
    displayAllExpenses();
    calcExpense();
    displayChart();
    document.querySelector(".btn-add").addEventListener("click", addExpense)
    document.querySelector(".btn-update").addEventListener("click", updateExpense)
    document.addEventListener('click', event => {
        if (event.target.classList.contains('btn-delete')) {
            deleteExpense(event);
        } else if (event.target.classList.contains('btn-edit')) {
            showEditForm(event);
        }
    })
}

function displayAllExpenses() {
    axios.get('http://localhost:3000/expense/')
        .then(res => {
            res = res.data.expenses;
            const container = document.querySelector(".list-container");
            res.forEach( item => {
                const eachrow = "<div class='row text-center'>" +
                                "<div class='col-md-1'>" + item.expense.type + "</div>" +
                                "<div class='col-md-2'>" + item.expense.amount + "</div>" + 
                                "<div class='col-md-2'>" + dateConverter(item.expense.date) + "</div>" + 
                                "<div class='col-md-2'>" + item.expense.category + "</div>" + 
                                "<div class='col-md-2'>" + item.expense.memo + "</div>" +
                                "<div class='col-md-3'>" + "<button  class='m-1 btn-edit' data-id=" + item.expense._id + ">Edit</button>" +
                                "<button class='m-1 btn-delete' data-id=" + item.expense._id + ">Delete</button></div>"
                container.innerHTML += eachrow;
            });
        })
        .catch(error => {
            console.log(error);
        })
}

function showAddForm() {
    showForm("Add Expense");
}

function showEditForm(event) {
    showForm("Update Expense");
    const id = event.target.getAttribute('data-id');
    document.querySelector(".btn-update").setAttribute('data-id', id);
    axios.get(`http://localhost:3000/expense/${id}`)
        .then(res => {
           const expense = res.data.expense;
            document.querySelector("#type").value = expense.type;
            document.querySelector("#amount").value = expense.amount;
            document.querySelector("#date").value = dateConverter(expense.date);
            document.querySelector("#category").value = expense.category;
            document.querySelector("#memo").value = expense.memo;
        })
        .catch(error => {
            console.log(error);
        })
}

function addExpense() {
    const type = document.querySelector("#type").value;
    const amount = document.querySelector("#amount").value;
    const date = document.querySelector("#date").value;
    const category = document.querySelector("#category").value;
    const memo = document.querySelector("#memo").value;
    const newExpense = {
        type: type,
        date: date,
        amount: amount,
        category: category,
        memo: memo
    }
    axios.post('http://localhost:3000/expense/add', newExpense)
        .then (res => {
            console.log(res);
        })
        .catch(error => {
            console.log(error);
        })
    document.querySelector(".expense-form").reset();
    init();

}

function updateExpense(event) {
    const id = event.target.getAttribute('data-id');
    const type = document.querySelector("#type").value;
    const amount = document.querySelector("#amount").value;
    const date = document.querySelector("#date").value;
    const category = document.querySelector("#category").value;
    const memo = document.querySelector("#memo").value;
    const updateExpense = [{propName: "type", value: type}, {propName: "amount", value: amount}, {propName: "date", value: date}, {propName: "category", value: category}, {propName: "memo", value: memo}];
    axios.patch(`http://localhost:3000/expense/edit/${id}`, updateExpense)
        .then (res => {
            console.log(res);
        })
        .catch(error => {
            console.log(error);
        })
    document.querySelector(".expense-form").reset();
    init();
}

function deleteExpense(event) {
    let answer = confirm("Are you sure to delete this expense?");
    if ( answer == true) {
        const id = event.target.getAttribute('data-id');
        axios.delete(`http://localhost:3000/expense/delete/${id}`)
            .then(res=> {
                console.log(res);
            })
            .catch(error => {
                console.log(error);
            })
        // Delete DOM elements
        const parent = event.target.parentElement.parentElement;
        parent.innerHTML = '';
        // Update expesne info
        calcExpense();
        displayChart();
    } else {
        return;
    }
    

}

function showForm(title) {
    document.querySelector(".form-title").innerHTML = title;
    document.querySelector(".form-container").classList.remove('hide');
    document.querySelector(".form-container").classList.add('show');
    if (title == "Add Expense") {
        document.querySelector(".btn-update").classList.remove('show');
        document.querySelector(".btn-update").classList.add('hide');
        document.querySelector(".btn-add").classList.remove('hide');
        document.querySelector(".btn-add").classList.add('show');
    } else if (title =="Update Expense") {
        document.querySelector(".btn-add").classList.remove('show');
        document.querySelector(".btn-add").classList.add('hide');
        document.querySelector(".btn-update").classList.remove('hide');
        document.querySelector(".btn-update").classList.add('show');
    }
}

function calcExpense() {
    let monthlyExpense = 0;
    let income = 0;
    let paid = 0;
    axios.get('http://localhost:3000/expense/')
        .then(res => {
            res = res.data.expenses;
            res.forEach( item => {
                if (item.expense.type == "income") {
                    income += item.expense.amount;
                } else if (item.expense.type == "paid") {
                    paid += item.expense.amount;
                }
            });
            monthlyExpense = income - paid;
            // Display expense information on the page
            document.querySelector("#monthly-expense").innerText = monthlyExpense;
            document.querySelector("#income-type").innerText = `+$${income}`;
            document.querySelector("#paid-type").innerText = `-$${paid}`;
        })
        .catch(error => {
            console.log(error);
        })
}

function displayChart() {
    let labels = ['Utility','Transport','Food', 'Daily goods','Rent','Travel','Social','Others'];
    let allData = [];
    let utilityData = 0;
    let transData = 0;
    let foodData = 0;
    let dailyData = 0;
    let rentData = 0;
    let travelData = 0;
    let socialData = 0;
    let otherData = 0;
    axios.get('http://localhost:3000/expense/')
        .then(res => {
            res = res.data.expenses;
            res.forEach( item => {
                switch (item.expense.category) {
                    case 'Utility':
                        utilityData += item.expense.amount;
                        break;
                    case 'Transport':
                        transData += item.expense.amount;
                        break;
                    case 'Food':
                        foodData += item.expense.amount;
                        break;
                    case 'Daily goods':
                        dailyData += item.expense.amount;
                        break;
                    case 'Rent':
                        rentData += item.expense.amount;
                        break;
                    case 'Travel':
                        travelData += item.expense.amount;
                        break;
                    case 'Social':
                        socialData += item.expense.amount;
                        break;
                    case 'Others':
                        otherData += item.expense.amount;
                        break;
                }
            });
            allData.push(utilityData, transData, foodData, dailyData, rentData, travelData, socialData, otherData);
            // Display chart
            var chart = new Chart(document.getElementById('chart'), {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            backgroundColor: ['#B10DC9','#FF4136','#0074D9','#FF851B','#3D9970','#85144b','#FFDC00','#7FDBFF'],
                            data: allData
                        }
                    ]
                },
                options: {
                    title: {
                        display: true,
                        text: 'Your monthly expense by category'
                    }
                }
            });
        })
        .catch(error => {
            console.log(error);
        })
}

function dateConverter(expenseDate) {
    let date = new Date(expenseDate);
    let d = date.getDate();
    let m = date.getMonth() + 1;
    let y = date.getFullYear();
    return `${m}/${d}/${y}`
}
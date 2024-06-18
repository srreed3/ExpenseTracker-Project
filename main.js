document.addEventListener('DOMContentLoaded', function() {
    // Empty array to store expense entries
    let expenseEntries = [];

    // Define labels and colors for the pie chart
    const labels = ['Rent', 'Utilities', 'Groceries', 'Gas', 'Phone', 'Loans', 'Insurance', 'Entertainment', 'Other'];
    const colorHex = ['#cc260c', '#f5870a', '#d1d12e', '#227541', '#26abab', '#1328e8', '#892ce6', '#f233e2', '#899191'];
    let chartData = new Array(labels.length).fill(0);

    // Setup Chart.js pie chart
    let ctx = document.getElementById('myChart').getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            datasets: [{
                data: chartData,
                backgroundColor: colorHex
            }],
            labels: labels
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                datalabels: {
                    color: '#f0f9fc',
                    anchor: 'end',   // Position labels at the end of the slices
                    align: 'end',    // Align labels to the end of the slices
                    offset: 10,      // Offset labels slightly away from the slices
                    borderWidth: 2,
                    borderColor: '#f0f9fc',
                    borderRadius: 25,
                    backgroundColor: (context) => {
                        return context.dataset.backgroundColor;
                    },
                    font: {
                        weight: 'bold',
                        size: 15
                    },
                    formatter: (value) => {
                        return '$' + value.toFixed(2);  // Format labels as currency with two decimal places
                    }
                }
            }
        }
    });

    // Function to update the chart data
    function updateChartData() {
        // Reset chart data
        chartData.fill(0);
        
        // Aggregate expenses by type
        expenseEntries.forEach(expense => {
            const index = labels.indexOf(expense.typeExpense);
            if (index !== -1) {
                chartData[index] += parseFloat(expense.numAmount);
            }
        });

        // Update chart
        myChart.update();
    }

    // Function to add new expense entry
    function addExpense(dateExpense, typeExpense, numAmount, description) {
        expenseEntries.push({ dateExpense, typeExpense, numAmount, description });

        // Reset form
        document.getElementById('formContainer').reset();

        // Update chart data
        updateChartData();
    }

    // Add event listener for form submission
    document.getElementById('formContainer').addEventListener('submit', function(event) {
        event.preventDefault();

        // Retrieve values
        let dateExpense = document.getElementById('dateExpense').value;
        let typeExpense = document.getElementById('typeExpense').value;
        let numAmount = document.getElementById('numAmount').value;
        let description = document.getElementById('description').value;

        // Add new expense and update display
        addExpense(dateExpense, typeExpense, numAmount, description);
        displayResults();

        // Remove hidden class to show expenses table
        document.querySelector('.viewExpenses').classList.remove('hidden');
    });

    // Function to display results
    function displayResults() {
        // Sort by date
        expenseEntries.sort((a, b) => new Date(a.dateExpense) - new Date(b.dateExpense));

        let html = '';

        if (expenseEntries.length === 0) {
            html += '<p>No expenses listed yet</p>';
        } else {
            html += '<div class="viewExpenses">';
            html += '<div id="output" class="scrollable">';
            html += '<h2>View Expenses</h2>';
            html += '<table id="expenseTable">';
            html += '<thead><tr><th>DATE</th><th>TYPE</th><th>AMOUNT ($)</th><th>DESCRIPTION</th><th>DELETE</th></tr></thead>';
            html += '<tbody>';
            expenseEntries.forEach((expense, index) => {
                html += `<tr><td>${expense.dateExpense}</td><td>${expense.typeExpense}</td><td>${expense.numAmount}</td><td>${expense.description}</td><td><button onclick="deleteExpense(${index})">X</button></td></tr>`;
            });
            html += '<div class="clearButton">';
            html += '<button onclick="clearAllExpenses()">CLEAR ALL EXPENSES</button>';
            html += '</div></div></div></tbody></table>';
        }

        document.getElementById('output').innerHTML = html;
    }

    // Function to remove expense and update the table
    window.deleteExpense = function(index) {
        expenseEntries.splice(index, 1);
        displayResults();
        updateChartData();
    }

    // Function to clear all expenses
    window.clearAllExpenses = function() {
        document.getElementById('formContainer').reset();
        expenseEntries = [];
        document.getElementById('output').innerHTML = '';
        updateChartData();
    }

    // Intercept page refresh to prevent data loss
    window.addEventListener('beforeunload', function(event) {
        event.preventDefault();
        return 'Are you sure you want to leave? Your unsaved changes may be lost.';
    });

    // Ensure Chart.js is loaded before executing the code
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded.');
    }
});
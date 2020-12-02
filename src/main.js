const addButton = document.querySelector(".add__btn");
const incomeListElem = document.querySelector(".income__list");
const expenseListElem = document.querySelector(".expenses__list");
const descriptionInput = document.querySelector(".add__description");
const valueInput = document.querySelector(".add__value");
const currentMonthYearELem = document.querySelector(".budget__title--month");
const totalBudgetElem = document.querySelector(".budget__value");
const totalIncomeElem = document.querySelector(".budget__income--value");
const totalExpensesElem = document.querySelector(".budget__expenses--value");
const totalExpensesPercent = document.querySelector(".budget__expenses--percentage");
const listContainerElem = document.querySelector(".container");

class Transaction {
  constructor(amount, description) {
    this.amount = amount;
    this.description = description;
    this.date = this.findCurrentDate();
    this.id = 0;
    this.percent;
  }

  findCurrentDate() {
    const monthShorthands = ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.", "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
    const date = new Date();
    const year = date.getFullYear();
    const monthNumber = date.getMonth();
    const month = monthShorthands[monthNumber];
    const day = date.getDate();
    const currentDate = `${month} ${day}, ${year}`;

    return currentDate;
  }
}

class TransactionList {
  constructor() {
    this.incomeList = [];
    this.expenseList = [];
    this.id = 0;
  }

  addNewTransaction(amount, description) {
    const newTransaction = new Transaction(amount, description);
    newTransaction.id = this.id;
    this.id++;

    if (amount > 0) {
      this.incomeList.push(newTransaction);
    } else if (amount < 0) {
      this.expenseList.push(newTransaction);
    } 

    this.performUpdates();
  }

  removeTransaction(id) {
    this.incomeList = this.incomeList.filter(item => item.id !== id);
    this.expenseList = this.expenseList.filter(item => item.id !== id);

    this.performUpdates();
  }

  updateExpensePercents() {
    for (let expenseItem of this.expenseList) {
      expenseItem.percent = this.calcEachPercent(expenseItem.amount);
    }
  }

  renderIncomeList() {
    incomeListElem.innerHTML = "";
    this.incomeList.forEach(item => {
      incomeListElem.insertAdjacentHTML("beforeend", 
      `<div class="item" data-transaction-id="${item.id}">
        <div class="item__description">${item.description}</div>            
        <div class="right">
          <div class="item__value">+ $${(item.amount * 1).toFixed(2)}</div>
            <div class="item__delete">
              <button class="item__delete--btn">
                <i class="ion-ios-close-outline"></i>
              </button>
            </div>
        </div>
        <div class="item__date">${item.date}</div>
      </div>`);
    });  
  }

  renderExpenseList() {
    expenseListElem.innerHTML = "";
    this.expenseList.forEach(item => {
      expenseListElem.insertAdjacentHTML("beforeend", 
      `<div class="item" data-transaction-id="${item.id}">
        <div class="item__description">${item.description}</div>
          <div class="right">
            <div class="item__value">- $${(item.amount * -1).toFixed(2)}</div>
            <div class="item__percentage">${item.percent}%</div>
            <div class="item__delete">
              <button class="item__delete--btn">
                <i class="ion-ios-close-outline"></i>
              </button>
            </div>
          </div>
        <div class="item__date">${item.date}</div>
      </div>`);
    });
  }

  performUpdates() {
    this.updateExpensePercents();
    this.renderIncomeList();
    this.renderExpenseList();
    totalIncomeElem.textContent = this.displayTotalIncome();
    totalExpensesElem.textContent = this.displayTotalExpenses();
    totalBudgetElem.textContent = this.calcTotalBudget();
    totalExpensesPercent.textContent = this.calcTotalExpensePercent();
  }

  calcTotalIncome() {
    let total = 0;

    for (let item of this.incomeList) {
      total += item.amount;
    }

    return total;  
  }

  displayTotalIncome() {
    const totalIncome = this.calcTotalIncome();

    return `+ $${totalIncome.toFixed(2)}`;
  }

  calcTotalExpenses() {
    let total = 0;

    for (let item of this.expenseList) {
      total += item.amount;
    }

    return total;
  }

  displayTotalExpenses() {
    const totalExpenses = this.calcTotalExpenses();

    return `- $${(totalExpenses * -1).toFixed(2)}`;
  }

  calcEachPercent(amount) {
    return Math.round((((amount * -1) / this.calcTotalIncome()) * 100));
  }

  calcTotalBudget() {
    const totalIncome = this.calcTotalIncome();
    const totalExpenses = this.calcTotalExpenses();
    let sign;

    let totalBudget = totalIncome + totalExpenses;

    if (totalBudget > 0) {
      sign = "+";
    } else if (totalBudget < 0) {
      totalBudget *= -1;
      sign = "-";
    } else {
      sign = "";
    }

    return `${sign} $${totalBudget.toFixed(2)}`;
  }

  calcTotalExpensePercent() {
    const totalIncome = this.calcTotalIncome();
    const totalExpenses = this.calcTotalExpenses();
    let totalPercent;

    if (totalIncome === 0 && totalExpenses === 0) {
      totalPercent = 0;
    } else {
      totalPercent = Math.round(((totalExpenses * -1) / totalIncome) * 100);
    }
    
    return `${totalPercent}%`;
  }
}

const transactionList = new TransactionList();

window.onload = function() {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const monthNumber = currentDate.getMonth();
  const monthName = months[monthNumber];
  currentMonthYearELem.textContent = `${monthName} ${year}`;  
};

addButton.addEventListener("click", function() {
  if (descriptionInput.value !== "" && valueInput.value !== "") {
    const numberValue = parseInt(valueInput.value);
    
    transactionList.addNewTransaction(numberValue, descriptionInput.value);
    descriptionInput.value = "";
    valueInput.value = "";
  } 
});

listContainerElem.addEventListener("click", event => {
  if (event.target.parentNode.classList.contains("item__delete--btn")) {
    const listItem = event.target.closest(".item");
    const idToRemove = parseInt(listItem.dataset.transactionId);

    transactionList.removeTransaction(idToRemove);
  }
});

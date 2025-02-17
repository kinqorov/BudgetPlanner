import { db } from "./firebaseConfig.js";
import { v4 as uuidv4 } from "uuid";
import {
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

// Income and Expense
const incomeForm = document.getElementById("add-income-form");
const incomeList = document.getElementById("income-list");
const incomeDescriptionInput = document.getElementById("income-description");
const incomeAmountInput = document.getElementById("income-amount");

var totalIncome = 0;
var incomeUpdateUUID = null;
// Read Incomes
function readIncomes() {
  while (incomeList.firstChild) {
    incomeList.removeChild(incomeList.firstChild);
  }
  totalIncome = 0;
  const incomesCollection = collection(db, "incomes");
  getDocs(incomesCollection).then((incomesSnapshot) => {
    const incomes = incomesSnapshot.docs.map((doc) => doc.data());
    console.log(incomes);

    incomes.forEach((income) => {
      showIncome(income);
    });
  });
}

function showIncome(incomeData) {
  const listItem = document.createElement("li");
  listItem.innerHTML = `
    ${incomeData.description} - $${incomeData.amount.toFixed(2)}
    <button class="update">Update</button>
    <button class="delete">Delete</button>
  `;

  // Delete functionality
  listItem.querySelector(".update").addEventListener("click", () => {
    incomeDescriptionInput.value = incomeData.description;
    incomeAmountInput.value = incomeData.amount;
    incomeUpdateUUID = incomeData.uuid;
  });

  listItem.querySelector(".delete").addEventListener("click", () => {
    console.log("deleting", incomeData.description, incomeData.uuid);
    deleteDoc(doc(db, "incomes", incomeData.uuid)).catch((error) =>
      console.log(error),
    );
    totalIncome -= incomeData.amount;
    listItem.remove();
    updateSummary();
  });

  totalIncome += incomeData.amount;
  updateSummary();
  incomeList.appendChild(listItem);
}

function addIncome(description, amount) {
  const uuid = uuidv4();
  const incomeData = {
    uuid: uuid,
    description: description,
    amount: amount,
  };
  setDoc(doc(db, "incomes", uuid), incomeData);
  return incomeData;
}

function updateIncome(uuid, description, amount) {
  const incomeData = {
    uuid: uuid,
    description: description,
    amount: amount,
  };
  setDoc(doc(db, "incomes", uuid), incomeData);
  incomeUpdateUUID = null;
  return incomeData;
}

readIncomes();

// Add Income
incomeForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const description = incomeDescriptionInput.value;
  const amount = parseFloat(incomeAmountInput.value);

  if (incomeUpdateUUID) {
    updateIncome(incomeUpdateUUID, description, amount);
  } else {
    addIncome(description, amount);
  }
  readIncomes();
  incomeForm.reset();
});

const expenseForm = document.getElementById("add-expense-form");
const expenseList = document.getElementById("expense-list");
const expenceDescriptionInput = document.getElementById("expense-description");
const expenceAmountInput = document.getElementById("expense-amount");
const expenceCategoryInput = document.getElementById("expense-category");

var totalExpenses = 0;
var expenseUpdateUUID = null;

// Read Expenses
function readExpenses() {
  while (expenseList.firstChild) {
    expenseList.removeChild(expenseList.firstChild);
  }
  totalExpenses = 0;
  const expensesCollection = collection(db, "expenses");
  getDocs(expensesCollection).then((expensesSnapshot) => {
    const expenses = expensesSnapshot.docs.map((doc) => doc.data());
    console.log(expenses);

    expenses.forEach((expense) => {
      showExpense(expense);
    });
  });
}

function showExpense(expenseData) {
  const listItem = document.createElement("li");
  listItem.innerHTML = `
    ${expenseData.description} (${expenseData.category}) - $${expenseData.amount.toFixed(2)}
    <button class="update">Update</button>
    <button class="delete">Delete</button>
  `;

  // Delete functionality
  listItem.querySelector(".update").addEventListener("click", () => {
    expenceDescriptionInput.value = expenseData.description;
    expenceAmountInput.value = expenseData.amount;
    expenceCategoryInput.value = expenseData.category;
    expenseUpdateUUID = expenseData.uuid;
  });

  listItem.querySelector(".delete").addEventListener("click", () => {
    console.log("deleting", expenseData.description, expenseData.uuid);
    deleteDoc(doc(db, "expenses", expenseData.uuid)).catch((error) =>
      console.log(error),
    );
    totalExpenses -= expenseData.amount;
    listItem.remove();
    updateSummary();
  });

  totalExpenses += expenseData.amount;
  updateSummary();
  expenseList.appendChild(listItem);
}

function addExpense(description, amount, category) {
  const uuid = uuidv4();
  const expenseData = {
    uuid: uuid,
    description: description,
    amount: amount,
    category: category,
  };
  setDoc(doc(db, "expenses", uuid), expenseData);
  return expenseData;
}

function updateExpense(uuid, description, amount, category) {
  const expenseData = {
    uuid: uuid,
    description: description,
    amount: amount,
    category: category,
  };
  setDoc(doc(db, "expenses", uuid), expenseData);
  expenseUpdateUUID = null;
  return expenseData;
}

readExpenses();

// Add Expense
expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const description = expenceDescriptionInput.value;
  const amount = parseFloat(expenceAmountInput.value);
  const category = expenceCategoryInput.value;

  if (expenseUpdateUUID) {
    updateExpense(expenseUpdateUUID, description, amount, category);
  } else {
    addExpense(description, amount, category);
  }
  readExpenses();
  expenseForm.reset();
});

const totalIncomeDisplay = document.getElementById("total-income");
const totalExpensesDisplay = document.getElementById("total-expenses");
const balanceDisplay = document.getElementById("balance");

// Update Summary
function updateSummary() {
  totalIncomeDisplay.textContent = `Total Income: $${totalIncome.toFixed(2)}`;
  totalExpensesDisplay.textContent = `Total Expenses: $${totalExpenses.toFixed(2)}`;
  balanceDisplay.textContent = `Balance: $${(totalIncome - totalExpenses).toFixed(2)}`;
}

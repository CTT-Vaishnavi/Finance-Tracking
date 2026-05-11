# 💰 Finance Tracking Web Application

A modern and responsive Finance Tracking Web App built using HTML, CSS, and JavaScript. This application helps users manage income, expenses, and financial transactions efficiently.

🌐 **Live Demo:**  
https://ctt-vaishnavi.github.io/Finance-Tracking/

---

# 🚀 Technologies Used

- 🌐 HTML5
- 🎨 CSS3
- ⚡ JavaScript
- ☁️ GitHub Pages
- 🎯 Font Awesome Icons

---

# ✨ Features

✅ Add Income Transactions  
✅ Add Expense Transactions  
✅ Track Total Balance  
✅ Responsive Design  
✅ Dynamic Transaction List  
✅ JSON Data Integration  
✅ Professional UI Design  
✅ Lightweight & Fast

---

# 📁 Project Structure

```bash
Finance-Tracking/
│
├── index.html
├── style.css
├── script.js
├── redmi.json
└── REDMI.md
```

---

# 📦 Add Font Awesome Icons

Add this CDN inside the `<head>` section of `index.html`

```html
<link rel="stylesheet"
href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
```

---

# 🖥️ index.html

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Finance Tracker</title>

    <link rel="stylesheet" href="style.css">

    <!-- Font Awesome Icons -->
    <link rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>

<body>

    <div class="container">

        <h1>
            <i class="fa-solid fa-wallet"></i>
            Finance Tracker
        </h1>

        <div class="summary">

            <div class="card income-card">
                <i class="fa-solid fa-arrow-trend-up"></i>
                <h3>Income</h3>
                <p id="income">₹0</p>
            </div>

            <div class="card expense-card">
                <i class="fa-solid fa-arrow-trend-down"></i>
                <h3>Expense</h3>
                <p id="expense">₹0</p>
            </div>

            <div class="card balance-card">
                <i class="fa-solid fa-coins"></i>
                <h3>Balance</h3>
                <p id="balance">₹0</p>
            </div>

        </div>

        <div id="transaction-list"></div>

    </div>

    <script src="script.js"></script>

</body>
</html>
```

---

# 🎨 style.css

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    background: #f4f7fc;
    padding: 30px;
}

.container {
    max-width: 900px;
    margin: auto;
}

h1 {
    text-align: center;
    margin-bottom: 30px;
    color: #222;
}

h1 i {
    color: #4CAF50;
    margin-right: 10px;
}

.summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.card {
    background: white;
    padding: 25px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.card i {
    font-size: 30px;
    margin-bottom: 15px;
}

.income-card i {
    color: green;
}

.expense-card i {
    color: red;
}

.balance-card i {
    color: orange;
}

.card h3 {
    margin-bottom: 10px;
}

.card p {
    font-size: 24px;
    font-weight: bold;
}

.transaction {
    background: white;
    padding: 15px 20px;
    margin-bottom: 15px;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 3px 8px rgba(0,0,0,0.08);
}

.transaction-left {
    display: flex;
    align-items: center;
    gap: 15px;
}

.transaction i {
    font-size: 22px;
}

.income-icon {
    color: green;
}

.expense-icon {
    color: red;
}

.amount {
    font-weight: bold;
}
```

---

# ⚡ script.js

```javascript
fetch('redmi.json')
    .then(response => response.json())
    .then(data => {

        const transactionList =
        document.getElementById('transaction-list');

        let income = 0;
        let expense = 0;

        data.forEach(item => {

            const div = document.createElement('div');

            div.classList.add('transaction');

            if(item.type === 'income') {
                income += item.amount;
            } else {
                expense += item.amount;
            }

            div.innerHTML = `

                <div class="transaction-left">

                    <i class="
                    fa-solid
                    ${item.type === 'income'
                    ? 'fa-circle-arrow-up income-icon'
                    : 'fa-circle-arrow-down expense-icon'}
                    "></i>

                    <div>
                        <h4>${item.title}</h4>
                        <small>${item.type}</small>
                    </div>

                </div>

                <div class="amount">
                    ₹${item.amount}
                </div>
            `;

            transactionList.appendChild(div);
        });

        document.getElementById('income').innerText =
        `₹${income}`;

        document.getElementById('expense').innerText =
        `₹${expense}`;

        document.getElementById('balance').innerText =
        `₹${income - expense}`;

    })
    .catch(error => {
        console.log('Error:', error);
    });
```

---

# 📄 redmi.json

```json
[
    {
        "id": 1,
        "title": "Salary",
        "amount": 30000,
        "type": "income"
    },
    {
        "id": 2,
        "title": "Freelancing",
        "amount": 12000,
        "type": "income"
    },
    {
        "id": 3,
        "title": "Shopping",
        "amount": 5000,
        "type": "expense"
    },
    {
        "id": 4,
        "title": "Electricity Bill",
        "amount": 2500,
        "type": "expense"
    }
]
```

---

# 🚀 GitHub Upload

```bash
git add .
git commit -m "Professional finance tracker UI added"
git push origin main
```

---

# 🌟 Future Improvements

- 📊 Pie Chart Analytics
- 🌙 Dark Mode
- 🔐 Login Authentication
- ☁️ Firebase Database
- 📱 Mobile App Version
- 📈 Expense Graphs

---

# 👩‍💻 Author

Developed by Vaishnavi Shinde

---

# 📜 License

Free for educational and personal use.
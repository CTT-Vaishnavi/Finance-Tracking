// ─── STATE ───────────────────────────────────────────────
        let transactions = JSON.parse(localStorage.getItem('wl_txs') || '[]');
        const CURRENCY = '₹';
        const CAT_COLORS = {
            Salary: '#4df0c5', Freelance: '#4dc8f0', Investment: '#c9f04d',
            Food: '#f04d8a', Rent: '#f07a4d', Transport: '#a04df0',
            Health: '#f0e44d', Shopping: '#f04dcc', Entertainment: '#4d78f0',
            Utilities: '#9af04d', Education: '#f0a44d', SIP: '#c9f04d', Other: '#6b7280'
        };
        const CAT_ICONS = {
            Salary: '💼', Freelance: '🖥', Investment: '📈', Food: '🍜', Rent: '🏠',
            Transport: '🚌', Health: '💊', Shopping: '🛍', Entertainment: '🎬',
            Utilities: '⚡', Education: '📚', SIP: '📊', Other: '✦'
        };

        // ─── INIT DATE ────────────────────────────────────────────
        document.getElementById('txDate').value = new Date().toISOString().split('T')[0];

        // ─── SAVE ─────────────────────────────────────────────────
        function save() { localStorage.setItem('wl_txs', JSON.stringify(transactions)); }

        // ─── FORMAT ───────────────────────────────────────────────
        function fmt(n) {
            return CURRENCY + Math.abs(n).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        }
        function fmtDate(d) {
            return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        }

        // ─── TOAST ────────────────────────────────────────────────
        function toast(msg) {
            const t = document.getElementById('toast');
            t.textContent = msg;
            t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), 2200);
        }

        // ─── FORM SUBMIT ──────────────────────────────────────────
        document.getElementById('txForm').addEventListener('submit', function (e) {
            e.preventDefault();
            const type = document.querySelector('input[name="type"]:checked').value;
            const desc = document.getElementById('txDesc').value.trim();
            const amount = parseFloat(document.getElementById('txAmount').value);
            const date = document.getElementById('txDate').value;
            const category = document.getElementById('txCategory').value;
            if (!desc || !amount || !date) return;

            const tx = { id: Date.now(), type, desc, amount, date, category };
            transactions.unshift(tx);
            save();
            renderAll();
            this.reset();
            document.getElementById('txDate').value = new Date().toISOString().split('T')[0];
            document.getElementById('t-income').checked = true;
            toast('Transaction added ✓');
        });

        // ─── KPIs ─────────────────────────────────────────────────
        function renderKPIs() {
            const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
            const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
            const saving = transactions.filter(t => t.type === 'saving').reduce((s, t) => s + t.amount, 0);
            const net = income - expense;
            const rate = income > 0 ? Math.round(((net + saving) / income) * 100) : 0;

            document.getElementById('kpi-income').textContent = fmt(income);
            document.getElementById('kpi-expense').textContent = fmt(expense);
            document.getElementById('kpi-saving').textContent = fmt(net);
            document.getElementById('kpi-income-count').innerHTML = `<b>${transactions.filter(t => t.type === 'income').length}</b> transactions`;
            document.getElementById('kpi-expense-count').innerHTML = `<b>${transactions.filter(t => t.type === 'expense').length}</b> transactions`;
            document.getElementById('kpi-saving-rate').innerHTML = `Savings rate: <b>${rate}%</b>`;
        }

        // ─── MONTH FILTER ─────────────────────────────────────────
        function buildMonthFilter() {
            const months = [...new Set(transactions.map(t => t.date.slice(0, 7)))].sort().reverse();
            const sel = document.getElementById('monthFilter');
            const cur = sel.value;
            sel.innerHTML = '<option value="all">All time</option>';
            months.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m;
                opt.textContent = new Date(m + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
                sel.appendChild(opt);
            });
            if (cur) sel.value = cur;
        }

        function filteredTx() {
            const m = document.getElementById('monthFilter').value;
            return m === 'all' ? transactions : transactions.filter(t => t.date.startsWith(m));
        }

        // ─── TRANSACTIONS ─────────────────────────────────────────
        function renderTx() {
            const list = document.getElementById('txList');
            const data = filteredTx();
            if (!data.length) { list.innerHTML = '<div class="empty-state">No transactions found.</div>'; return; }
            list.innerHTML = data.slice(0, 50).map(tx => `
      <div class="tx-item" role="listitem" data-id="${tx.id}">
        <div class="tx-icon ${tx.type}">${CAT_ICONS[tx.category] || '✦'}</div>
        <div class="tx-info">
          <div class="tx-desc">${escHtml(tx.desc)}</div>
          <div class="tx-meta">${tx.category} &middot; ${fmtDate(tx.date)}</div>
        </div>
        <span class="tx-amount ${tx.type}">${tx.type === 'expense' ? '-' : '+'} ${fmt(tx.amount)}</span>
        <button class="tx-delete" aria-label="Delete transaction" onclick="deleteTx(${tx.id})">✕</button>
      </div>
    `).join('');
        }

        function escHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

        function deleteTx(id) {
            transactions = transactions.filter(t => t.id !== id);
            save();
            renderAll();
            toast('Transaction removed');
        }

        // ─── BAR CHART ────────────────────────────────────────────
        let barChartInst = null;
        function renderBarChart() {
            const months = [...new Set(transactions.map(t => t.date.slice(0, 7)))].sort().slice(-6);
            const incData = months.map(m => transactions.filter(t => t.type === 'income' && t.date.startsWith(m)).reduce((s, t) => s + t.amount, 0));
            const expData = months.map(m => transactions.filter(t => t.type === 'expense' && t.date.startsWith(m)).reduce((s, t) => s + t.amount, 0));
            const labels = months.map(m => new Date(m + '-01').toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }));

            const ctx = document.getElementById('barChart').getContext('2d');
            if (barChartInst) barChartInst.destroy();

            barChartInst = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels.length ? labels : ['No data'],
                    datasets: [
                        { label: 'Income', data: incData, backgroundColor: 'rgba(77,240,197,0.6)', borderColor: '#4df0c5', borderWidth: 1.5, borderRadius: 4 },
                        { label: 'Expense', data: expData, backgroundColor: 'rgba(240,77,138,0.6)', borderColor: '#f04d8a', borderWidth: 1.5, borderRadius: 4 }
                    ]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { labels: { color: '#6b7280', font: { family: 'DM Mono', size: 11 } } } },
                    scales: {
                        x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#6b7280', font: { family: 'DM Mono', size: 11 } } },
                        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#6b7280', font: { family: 'DM Mono', size: 11 }, callback: v => CURRENCY + v.toLocaleString('en-IN') } }
                    }
                }
            });
        }

        // ─── DONUT CHART ──────────────────────────────────────────
        let donutInst = null;
        function renderDonut() {
            const expenses = transactions.filter(t => t.type === 'expense');
            const totals = {};
            expenses.forEach(t => { totals[t.category] = (totals[t.category] || 0) + t.amount; });
            const keys = Object.keys(totals);
            const vals = keys.map(k => totals[k]);
            const total = vals.reduce((a, b) => a + b, 0);
            const colors = keys.map(k => CAT_COLORS[k] || '#6b7280');

            document.getElementById('donutTotal').textContent = fmt(total);

            const legend = document.getElementById('donutLegend');
            legend.innerHTML = keys.length ? keys.slice(0, 5).map((k, i) => `
      <div class="legend-item">
        <span class="legend-dot" style="background:${colors[i]}"></span>
        <span>${k}</span>
        <span class="legend-pct">${total ? Math.round(vals[i] / total * 100) : 0}%</span>
      </div>`).join('') : '<div style="color:var(--muted);font-size:0.78rem;font-family:var(--font-mono)">No expense data</div>';

            const ctx = document.getElementById('donutChart').getContext('2d');
            if (donutInst) donutInst.destroy();
            donutInst = new Chart(ctx, {
                type: 'doughnut',
                data: { labels: keys, datasets: [{ data: vals.length ? vals : [1], backgroundColor: vals.length ? colors : ['#252a38'], borderWidth: 0, hoverOffset: 6 }] },
                options: { cutout: '72%', responsive: false, plugins: { legend: { display: false }, tooltip: { enabled: !!vals.length } } }
            });
        }

        // ─── BUDGET BARS ──────────────────────────────────────────
        function renderBudget() {
            const expenses = transactions.filter(t => t.type === 'expense');
            const totals = {};
            expenses.forEach(t => { totals[t.category] = (totals[t.category] || 0) + t.amount; });
            const keys = Object.keys(totals).sort((a, b) => totals[b] - totals[a]).slice(0, 5);
            const max = Math.max(...keys.map(k => totals[k]), 1);
            const container = document.getElementById('budgetBars');
            if (!keys.length) { container.innerHTML = '<div class="empty-state" style="padding:1rem 0">Add expenses to see budget breakdown</div>'; return; }
            container.innerHTML = keys.map(k => {
                const pct = Math.round(totals[k] / max * 100);
                const color = CAT_COLORS[k] || '#6b7280';
                return `<div class="budget-item">
        <div class="budget-header">
          <span class="budget-cat">${CAT_ICONS[k] || '✦'} ${k}</span>
          <span class="budget-nums">${fmt(totals[k])}</span>
        </div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${color}"></div></div>
      </div>`;
            }).join('');
        }

        // ─── RENDER ALL ───────────────────────────────────────────
        function renderAll() {
            buildMonthFilter();
            renderKPIs();
            renderTx();
            renderBarChart();
            renderDonut();
            renderBudget();
        }

        // ─── LOAD CHART.JS ────────────────────────────────────────
        (function loadChartJS() {
            const s = document.createElement('script');
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
            s.onload = () => renderAll();
            document.head.appendChild(s);
        })();

        // ─── SEED DATA ────────────────────────────────────────────
        if (!transactions.length) {
            const today = new Date();
            const mo = (d) => { const dt = new Date(today); dt.setDate(dt.getDate() - d); return dt.toISOString().split('T')[0]; };
            transactions = [
                { id: 1, type: 'income', desc: 'Monthly Salary', amount: 85000, date: mo(0), category: 'Salary' },
                { id: 2, type: 'expense', desc: 'Apartment Rent', amount: 22000, date: mo(1), category: 'Rent' },
                { id: 3, type: 'saving', desc: 'SIP Investment', amount: 10000, date: mo(2), category: 'SIP' },
                { id: 4, type: 'expense', desc: 'Grocery & Vegetables', amount: 3200, date: mo(3), category: 'Food' },
                { id: 5, type: 'expense', desc: 'Electricity Bill', amount: 1800, date: mo(4), category: 'Utilities' },
                { id: 6, type: 'income', desc: 'Freelance Project', amount: 15000, date: mo(10), category: 'Freelance' },
                { id: 7, type: 'expense', desc: 'Swiggy & Zomato', amount: 2400, date: mo(11), category: 'Food' },
                { id: 8, type: 'expense', desc: 'Metro Pass + Uber', amount: 1600, date: mo(12), category: 'Transport' },
                { id: 9, type: 'expense', desc: 'Amazon Shopping', amount: 4500, date: mo(15), category: 'Shopping' },
                { id: 10, type: 'income', desc: 'Dividends', amount: 3000, date: mo(20), category: 'Investment' },
            ];
            save();
        }
  
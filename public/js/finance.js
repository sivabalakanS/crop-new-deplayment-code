const modal = document.getElementById('modal');
const detailModal = document.getElementById('detailModal');
const createBtn = document.getElementById('createBtn');

// Open/close modals
createBtn.addEventListener('click', () => modal.classList.add('active'));
document.getElementById('closeModal').addEventListener('click', () => modal.classList.remove('active'));
document.getElementById('closeDetail').addEventListener('click', () => detailModal.classList.remove('active'));
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
    if (e.target === detailModal) detailModal.classList.remove('active');
});

// Set today's date as default
document.getElementById('date').valueAsDate = new Date();

// Load on start
loadAllRecords();

async function loadAllRecords() {
    try {
        const response = await fetch('/api/finance/active', { credentials: 'include' });
        const data = await response.json();

        if (!data.success) return;

        const records = data.records;

        // Group by crop name
        const cropMap = {};
        records.forEach(record => {
            const key = record.cropName.trim().toLowerCase();
            if (!cropMap[key]) {
                cropMap[key] = { name: record.cropName, transactions: [] };
            }
            cropMap[key].transactions.push(record);
        });

        renderCropFolders(cropMap);
        updateOverallSummary(records);

    } catch (error) {
        console.error('Error loading records:', error);
        document.getElementById('cropFolders').innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <p>Error loading records. Please refresh.</p>
            </div>`;
    }
}

function renderCropFolders(cropMap) {
    const container = document.getElementById('cropFolders');

    if (Object.keys(cropMap).length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📁</div>
                <p>No crop records yet. Click <strong>"+ Add New Crop Record"</strong> to start tracking.</p>
            </div>`;
        return;
    }

    container.innerHTML = Object.values(cropMap).map(crop => {
        const income = crop.transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const expense = crop.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        const profit = income - expense;
        const isProfit = profit >= 0;

        return `
        <div class="crop-folder">
            <div class="folder-header" onclick="toggleFolder('${crop.name}')">
                <div class="folder-title">
                    <span class="folder-icon">📁</span>
                    <span class="folder-name">${crop.name}</span>
                    <span class="folder-count">${crop.transactions.length} records</span>
                </div>
                <div class="folder-summary">
                    <span class="folder-income">+₹${income.toLocaleString('en-IN')}</span>
                    <span class="folder-expense">-₹${expense.toLocaleString('en-IN')}</span>
                    <span class="folder-profit ${isProfit ? 'profit' : 'loss'}">
                        ${isProfit ? '📈' : '📉'} ${isProfit ? 'Profit' : 'Loss'}: ₹${Math.abs(profit).toLocaleString('en-IN')}
                    </span>
                    <span class="folder-arrow" id="arrow-${crop.name}">▼</span>
                </div>
            </div>

            <div class="folder-body" id="folder-${crop.name}" style="display:none;">
                <div class="folder-actions">
                    <button class="btn-add-entry" onclick="openAddForCrop('${crop.name}')">+ Add Entry</button>
                </div>
                <table class="transaction-table">
                    <thead>
                        <tr>
                            <th>📅 Date</th>
                            <th>📊 Type</th>
                            <th>💵 Amount</th>
                            <th>📝 Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${crop.transactions.sort((a,b) => new Date(b.date) - new Date(a.date)).map(t => `
                        <tr class="transaction-row ${t.type}">
                            <td>${new Date(t.date).toLocaleDateString('en-IN')}</td>
                            <td><span class="type-badge ${t.type}">${t.type === 'income' ? '💰 Income' : '💸 Expense'}</span></td>
                            <td class="amount-cell ${t.type}">₹${t.amount.toLocaleString('en-IN')}</td>
                            <td>${t.description || '-'}</td>
                            <td><button class="btn-delete-small" onclick="deleteRecord('${t._id}')">🗑️</button></td>
                        </tr>`).join('')}
                    </tbody>
                </table>

                <div class="folder-totals">
                    <div class="total-row">
                        <span>Total Income:</span>
                        <span class="income-text">₹${income.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="total-row">
                        <span>Total Expense:</span>
                        <span class="expense-text">₹${expense.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="total-row total-final ${isProfit ? 'profit' : 'loss'}">
                        <span>${isProfit ? '📈 Net Profit:' : '📉 Net Loss:'}</span>
                        <span>₹${Math.abs(profit).toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');
}

function toggleFolder(cropName) {
    const body = document.getElementById(`folder-${cropName}`);
    const arrow = document.getElementById(`arrow-${cropName}`);
    if (body.style.display === 'none') {
        body.style.display = 'block';
        arrow.textContent = '▲';
    } else {
        body.style.display = 'none';
        arrow.textContent = '▼';
    }
}

function openAddForCrop(cropName) {
    document.getElementById('cropName').value = cropName;
    modal.classList.add('active');
}

function updateOverallSummary(records) {
    const totalIncome = records.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0);
    const totalExpense = records.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
    const net = totalIncome - totalExpense;
    const isProfit = net >= 0;

    document.getElementById('totalIncome').textContent = `₹${totalIncome.toLocaleString('en-IN')}`;
    document.getElementById('totalExpense').textContent = `₹${totalExpense.toLocaleString('en-IN')}`;
    document.getElementById('netProfit').textContent = `₹${Math.abs(net).toLocaleString('en-IN')}`;
    document.getElementById('profitLabel').textContent = isProfit ? 'Net Profit' : 'Net Loss';
    document.getElementById('profitIcon').textContent = isProfit ? '📈' : '📉';

    const profitBox = document.getElementById('profitBox');
    profitBox.classList.remove('profit-box', 'loss-box');
    profitBox.classList.add(isProfit ? 'profit-box' : 'loss-box');
}

// Save new record
document.getElementById('financeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        cropName: document.getElementById('cropName').value.trim(),
        date: document.getElementById('date').value,
        type: document.getElementById('type').value,
        amount: parseFloat(document.getElementById('amount').value),
        description: document.getElementById('description').value.trim()
    };

    try {
        const response = await fetch('/api/finance/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (data.success) {
            modal.classList.remove('active');
            document.getElementById('financeForm').reset();
            document.getElementById('date').valueAsDate = new Date();
            loadAllRecords();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        alert('Error saving record. Please try again.');
    }
});

// Delete record
async function deleteRecord(id) {
    if (!confirm('Delete this record?')) return;
    try {
        const response = await fetch(`/api/finance/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (response.ok) loadAllRecords();
    } catch (error) {
        alert('Error deleting record');
    }
}

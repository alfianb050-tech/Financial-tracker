let transactions = JSON.parse(localStorage.getItem('bayu_tx')) || [];

function saveTransaction(data) {
    // Tambah ID unik dan Tanggal otomatis
    const newTx = {
        id: Date.now(),
        date: new Date().toLocaleDateString('id-ID'),
        ...data
    };

    transactions.push(newTx);
    localStorage.setItem('bayu_tx', JSON.stringify(transactions));
    alert("Data Berhasil Disimpan di Memori!");
}

function calculateTotals() {
    let inflow = 0;
    let outflow = 0;
    let investment = 0;

    transactions.forEach(tx => {
        if (tx.type === 'pemasukan') inflow += parseFloat(tx.amount);
        if (tx.type === 'pengeluaran') outflow += parseFloat(tx.amount);
        if (tx.type === 'investasi') investment += parseFloat(tx.amount);
    });

    return {
        inflow,
        outflow,
        investment,
        netWorth: inflow - outflow 
    };
}


function formatIDR(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(number);
}


function getAssetSummary() {
    let assets = {};
    
    transactions.filter(tx => tx.type === 'investasi').forEach(tx => {
        if (!assets[tx.keterangan]) {
            assets[tx.keterangan] = { unit: 0, totalModal: 0, unitType: tx.unitType };
        }
        
        if (tx.kategori === 'Beli Aset') {
            assets[tx.keterangan].unit += parseFloat(tx.unitCount);
            assets[tx.keterangan].totalModal += parseFloat(tx.amount);
        } else {
            assets[tx.keterangan].unit -= parseFloat(tx.unitCount);
            assets[tx.keterangan].totalModal -= parseFloat(tx.amount);
        }
    });
    
    return assets;
}
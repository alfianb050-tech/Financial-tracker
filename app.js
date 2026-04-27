/**
 * APP.JS - HELPER MODE (SINKRON SUPABASE)
 * Taruh fungsi-fungsi bantuan di sini biar bisa dipake di semua halaman.
 */

// 1. Helper Format Rupiah (Biar tampilan konsisten)
window.formatIDR = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(number || 0);
};

// 2. Helper Hitung Ringkasan Aset (Data diambil dari hasil fetch Supabase)
window.calculateAssetSummary = (transactions) => {
    let summary = {
        totalInflow: 0,
        totalOutflow: 0,
        totalInvest: 0,
        netBalance: 0,
        assets: {}
    };

    transactions.forEach(tx => {
        const amt = parseFloat(tx.amount) || 0;
        
        if (tx.type === 'pemasukan') {
            summary.totalInflow += amt;
        } else if (tx.type === 'pengeluaran') {
            summary.totalOutflow += amt;
        } else if (tx.type === 'investasi') {
            summary.totalInvest += amt;
            // Logika Aset
            const key = tx.note || tx.keterangan || "ASET LAIN";
            if (!summary.assets[key]) {
                summary.assets[key] = { unit: 0, modal: 0 };
            }
            if (tx.kategori === 'Beli Aset') {
                summary.assets[key].unit += parseFloat(tx.unitCount || 0);
                summary.assets[key].modal += amt;
            } else {
                summary.assets[key].unit -= parseFloat(tx.unitCount || 0);
                summary.assets[key].modal -= amt;
            }
        }
    });

    summary.netBalance = summary.totalInflow - summary.totalOutflow - summary.totalInvest;
    return summary;
};

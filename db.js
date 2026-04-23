const SUPABASE_URL = 'https://cxryyztccnyhszkeetmx.supabase.co'; // Ganti pake URL lo
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4cnl5enRjY255aHN6a2VldG14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NzM5ODgsImV4cCI6MjA5MjQ0OTk4OH0.dkHgRdG9OlTyExJoHtNLrm9F3Z-4fwIGgIbEh_yQt4E'; // Ganti pake Anon Key lo


// Kita tempel di window biar bisa diakses di index.html, aset.html, dll
window._supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Fungsi Ambil Data (Global)
window.getTransactions = async function() {
    try {
        const { data, error } = await _supabase
            .from('transactions')
            .select('*')
            .order('id', { ascending: false });

        if (error) {
            console.error('Error tarik data:', error);
            return [];
        }
        return data;
    } catch (err) {
        console.error('Koneksi terputus:', err);
        return [];
    }
};

// Fungsi Simpan ke Cloud (Global)
window.saveTransactionToCloud = async function(newTx) {
    try {
        const { data, error } = await _supabase
            .from('transactions')
            .insert([newTx])
            .select(); // Tambahkan select() biar dapet feedback data yang masuk

        if (error) {
            console.error('Error simpan data:', error);
            return null;
        }
        return data;
    } catch (err) {
        console.error('Gagal kirim ke Cloud:', err);
        return null;
    }
};

// Fungsi Hapus (PENTING buat History)
window.deleteTransactionFromCloud = async function(id) {
    try {
        const { error } = await _supabase
            .from('transactions')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (err) {
        console.error('Gagal hapus:', err);
        return false;
    }
};

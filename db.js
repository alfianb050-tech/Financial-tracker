const SUPABASE_URL = 'https://cxryyztccnyhszkeetmx.supabase.co'; // Ganti pake URL lo
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4cnl5enRjY255aHN6a2VldG14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NzM5ODgsImV4cCI6MjA5MjQ0OTk4OH0.dkHgRdG9OlTyExJoHtNLrm9F3Z-4fwIGgIbEh_yQt4E'; // Ganti pake Anon Key lo

// Inisialisasi Client
window._supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * --- AUTHENTICATION (NEW) ---
 */

/**
 * --- DATA FUNCTIONS (REVISED) ---
 */

window.getTransactions = async function() {
    try {
        // Cek user dulu sebelum tarik data
        const user = await window.getCurrentUser();
        if (!user) return [];

        const { data, error } = await _supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id) // Filter manual biar makin rapi (opsional kalau RLS sudah nyala)
            .order('id', { ascending: false });

        if (error) {
            console.error('Error tarik data:', error.message);
            return [];
        }
        return data;
    } catch (err) {
        console.error('Koneksi terputus:', err);
        return [];
    }
};

window.saveTransactionToCloud = async function(newTx) {
    try {
        // 1. Ambil ID user yang sedang login
        const user = await window.getCurrentUser();
        
        if (!user) {
            alert("Sesi habis, silakan login ulang.");
            return null;
        }

        // 2. Suntik user_id ke dalam data yang akan disimpan
        // Ini kuncinya supaya RLS nggak nolak (Bug Fix)
        const dataToSave = {
            ...newTx,
            user_id: user.id 
        };

        const { data, error } = await _supabase
            .from('transactions')
            .insert([dataToSave])
            .select();

        if (error) {
            console.error('Error simpan data:', error.message);
            return null;
        }
        return data;
    } catch (err) {
        console.error('Gagal kirim ke Cloud:', err);
        return null;
    }
};

window.deleteTransactionFromCloud = async function(id) {
    try {
        const user = await window.getCurrentUser();
        if (!user) return false;

        const { error } = await _supabase
            .from('transactions')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id); // Pastikan cuma bisa hapus data milik sendiri

        if (error) throw error;
        return true;
    } catch (err) {
        console.error('Gagal hapus:', err);
        return false;
    }
};

* --- DATA FUNCTIONS (Existing) ---
 */

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

window.saveTransactionToCloud = async function(newTx) {
    try {
        const { data, error } = await _supabase
            .from('transactions')
            .insert([newTx])
            .select();

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

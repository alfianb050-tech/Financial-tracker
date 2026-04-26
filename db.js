const SUPABASE_URL = 'https://cxryyztccnyhszkeetmx.supabase.co'; // Ganti pake URL lo
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4cnl5enRjY255aHN6a2VldG14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NzM5ODgsImV4cCI6MjA5MjQ0OTk4OH0.dkHgRdG9OlTyExJoHtNLrm9F3Z-4fwIGgIbEh_yQt4E'; // Ganti pake Anon Key lo

// 1. Inisialisasi Client
// Pastikan SUPABASE_URL dan SUPABASE_KEY sudah didefinisikan di atas atau di file config
window._supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * --- AUTH FUNCTIONS ---
 */

window.loginUser = async function(email, password) {
    try {
        const { data, error } = await _supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        if (error) throw error;
        return data;
    } catch (err) {
        console.error('Login Error:', err.message);
        throw err;
    }
};

window.logoutUser = async function() {
    try {
        const { error } = await _supabase.auth.signOut();
        if (error) throw error;
        window.location.href = 'login.html';
    } catch (err) {
        console.error('Logout Error:', err.message);
    }
};

window.getCurrentUser = async function() {
    const { data: { user } } = await _supabase.auth.getUser();
    return user;
};

/**
 * --- DATA FUNCTIONS (RLS SECURE) ---
 */

window.getTransactions = async function() {
    try {
        const user = await window.getCurrentUser();
        if (!user) return [];

        const { data, error } = await _supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id) 
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
        const user = await window.getCurrentUser();
        if (!user) {
            alert("Sesi habis, silakan login ulang.");
            return null;
        }

        // Gabungkan data input dengan ID user agar lolos RLS
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
            .eq('user_id', user.id); 

        if (error) throw error;
        return true;
    } catch (err) {
        console.error('Gagal hapus:', err);
        return false;
    }
};

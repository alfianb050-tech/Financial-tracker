const SUPABASE_URL = 'https://cxryyztccnyhszkeetmx.supabase.co'; // Ganti pake URL lo
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4cnl5enRjY255aHN6a2VldG14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NzM5ODgsImV4cCI6MjA5MjQ0OTk4OH0.dkHgRdG9OlTyExJoHtNLrm9F3Z-4fwIGgIbEh_yQt4E'; // Ganti pake Anon Key lo

// 2. NYALAKAN MESIN (Inisialisasi)
const client = supabase.createClient(cloudUrl, cloudKey);

// 3. LEMPAR KE GLOBAL (Biar bisa dibaca semua file HTML)
window.supabase = client;

/**
 * FUNGSI LOGIN
 * Dipanggil di index.html
 */
window.handleLogin = async (email, password) => {
    const { data, error } = await client.auth.signInWithPassword({
        email: email,
        password: password,
    });
    if (error) throw error;
    return data;
};

/**
 * FUNGSI TARIK DATA (Otomatis Sync)
 * Dipanggil di Dashboard, Aset, History, dll.
 */
window.getTransactions = async () => {
    // Pastikan user sedang login
    const { data: { user } } = await client.auth.getUser();
    if (!user) return [];

    const { data, error } = await client
        .from('transaksi') // Pastikan nama tabel di Supabase lo adalah 'transaksi'
        .select('*')
        .order('id', { ascending: false }); // ID terbaru paling atas
    
    if (error) {
        console.error("Gagal tarik data:", error.message);
        return [];
    }
    return data;
};

/**
 * FUNGSI SIMPAN DATA
 * Dipanggil di transaksi.html
 */
window.saveTransactionToCloud = async (newTx) => {
    const { data, error } = await client
        .from('transaksi')
        .insert([newTx])
        .select();
    
    if (error) throw error;
    return data;
};

/**
 * FUNGSI HAPUS DATA
 * Dipanggil di history.html
 */
window.deleteTransactionFromCloud = async (id) => {
    const { error } = await client
        .from('transaksi')
        .delete()
        .eq('id', id);
    
    if (error) throw error;
    return true;
};

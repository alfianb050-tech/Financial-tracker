

// 1. Deklarasi Data (PASTIIN TULISANNYA SAMA PERSIS)
const cloudUrl = 'https://cxryyztccnyhszkeetmx.supabase.co'; // Ganti pake URL lo
const cloudKey = 'const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4cnl5enRjY255aHN6a2VldG14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NzM5ODgsImV4cCI6MjA5MjQ0OTk4OH0.dkHgRdG9OlTyExJoHtNLrm9F3Z-4fwIGgIbEh_yQt4E'; // Ganti pake Anon Key lo
'; // Ganti pake Key lo

// 2. Inisialisasi Mesin
const supabaseClient = supabase.createClient(cloudUrl, cloudKey);

// 3. Lempar ke Global (Biar index.html gak bingung)
window.supabase = supabaseClient;

/** FUNGSI LOGIN **/
window.handleLogin = async (email, password) => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
};

/** FUNGSI TARIK DATA **/
window.getTransactions = async () => {
    const { data, error } = await supabaseClient
        .from('transaksi') // Pastikan nama tabel di Supabase lo 'transaksi'
        .select('*')
        .order('id', { ascending: false });
    if (error) {
        console.error("Gagal tarik data:", error.message);
        return [];
    }
    return data;
};

/** FUNGSI SIMPAN DATA **/
window.saveTransactionToCloud = async (newTx) => {
    const { data, error } = await supabaseClient.from('transaksi').insert([newTx]).select();
    if (error) throw error;
    return data;
};

/** FUNGSI HAPUS DATA **/
window.deleteTransactionFromCloud = async (id) => {
    const { error } = await supabaseClient.from('transaksi').delete().eq('id', id);
    if (error) throw error;
    return true;
};

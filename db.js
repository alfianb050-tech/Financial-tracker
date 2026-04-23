const SUPABASE_URL = 'https://cxryyztccnyhszkeetmx.supabase.co'; // Ganti pake URL lo
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4cnl5enRjY255aHN6a2VldG14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NzM5ODgsImV4cCI6MjA5MjQ0OTk4OH0.dkHgRdG9OlTyExJoHtNLrm9F3Z-4fwIGgIbEh_yQt4E'; // Ganti pake Anon Key lo

// 1. DATA KONEKSI (Isi sesuai Dashboard Supabase lo)
const SUPABASE_URL = 'https://xyz.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGci...'; 

// 2. NYALAKAN MESIN (Inisialisasi)
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 3. LEMPAR KE GLOBAL (Biar bisa dibaca file index.html)
window.supabase = supabaseClient;

// 4. FUNGSI LOGIN
window.handleLogin = async (email, password) => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
    });
    if (error) throw error;
    return data;
};

// 5. FUNGSI TARIK DATA (Otomatis sinkron)
window.getTransactions = async () => {
    const { data, error } = await supabaseClient
        .from('transaksi') // Pastikan nama tabel di Supabase lo beneran 'transaksi'
        .select('*')
        .order('tanggal', { ascending: false });
    
    if (error) {
        console.error("Gagal tarik data:", error.message);
        return [];
    }
    return data;
};

// 6. FUNGSI SIMPAN DATA
window.saveTransactionToCloud = async (newTx) => {
    const { data, error } = await supabaseClient
        .from('transaksi')
        .insert([newTx]);
    
    if (error) throw error;
    return data;
};

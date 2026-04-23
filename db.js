const SUPABASE_URL = 'https://cxryyztccnyhszkeetmx.supabase.co'; // Ganti pake URL lo
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4cnl5enRjY255aHN6a2VldG14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NzM5ODgsImV4cCI6MjA5MjQ0OTk4OH0.dkHgRdG9OlTyExJoHtNLrm9F3Z-4fwIGgIbEh_yQt4E'; // Ganti pake Anon Key lo
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Fungsi Login
async function handleLogin(email, password) {
    const { data, error } = await _supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });
    if (error) throw error;
    return data;
}

// Fungsi Logout
async function handleLogout() {
    await _supabase.auth.signOut();
    window.location.reload();
}

// Fungsi ambil data (Otomatis sinkron karena pake Supabase)
async function getTransactions() {
    const { data: { user } } = await _supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await _supabase
        .from('transaksi')
        .select('*')
        .order('tanggal', { ascending: false });
    
    if (error) {
        console.error("Error tarik data:", error);
        return [];
    }
    return data;
}

// Export fungsi ke window biar bisa dipanggil di file HTML lain
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.getTransactions = getTransactions;
window.supabase = _supabase;

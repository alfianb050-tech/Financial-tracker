const SUPABASE_URL = 'https://cxryyztccnyhszkeetmx.supabase.co'; // Ganti pake URL lo
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4cnl5enRjY255aHN6a2VldG14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NzM5ODgsImV4cCI6MjA5MjQ0OTk4OH0.dkHgRdG9OlTyExJoHtNLrm9F3Z-4fwIGgIbEh_yQt4E'; // Ganti pake Anon Key lo

// 2. Inisialisasi Client (Pake nama 'supabase' saja biar simpel)
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// 3. Fungsi Login
async function handleLogin(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
    });
    if (error) throw error;
    return data;
}

// 4. Fungsi Ambil Data
async function getTransactions() {
    // Cek dulu user-nya ada gak
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabaseClient
        .from('transaksi')
        .select('*')
        .order('tanggal', { ascending: false });
    
    if (error) {
        console.error("Error tarik data:", error);
        return [];
    }
    return data;
}

// 5. Tempel ke window biar bisa dipanggil di HTML
window.supabase = supabaseClient;
window.handleLogin = handleLogin;
window.getTransactions = getTransactions;

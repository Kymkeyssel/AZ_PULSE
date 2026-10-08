async function test() {
    try {
        const res = await fetch('http://localhost:8000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@azpulse.com', password: 'password' }) // Let's try admin@azpulse.com
        });
        const data = await res.json();
        
        const token = data.token;
        if (!token) {
            console.error('Login failed', data);
            return;
        }

        const res2 = await fetch('http://localhost:8000/api/it/inventory/computers', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const inventory = await res2.json();
        console.log(JSON.stringify(inventory, null, 2).slice(0, 3000));
    } catch (e) {
        console.error(e);
    }
}
test();

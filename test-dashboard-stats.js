const testDashboard = async () => {
    try {
        // 1. Login to get token
        const loginResponse = await fetch('http://127.0.0.1:5001/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@mall.com', password: 'admin123' })
        });
        const loginData = await loginResponse.json();
        const token = loginData.token;

        // 2. Get Dashboard Stats
        const statsResponse = await fetch('http://127.0.0.1:5001/admin/dashboard/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const statsData = await statsResponse.json();
        console.log('Dashboard Stats:', JSON.stringify(statsData, null, 2));

        // Basic verification
        const hasShops = statsData.stats.find(s => s.title === 'Boutiques Actives').value >= 5;
        const hasPending = statsData.stats.find(s => s.title === 'Demandes en Attente').value >= 3;

        console.log('Verification:');
        console.log(`- Shops count >= 5: ${hasShops}`);
        console.log(`- Pending offers count >= 3: ${hasPending}`);

        if (hasShops && hasPending) {
            console.log('RESULT: SUCCESS - Dashboard is dynamic!');
        } else {
            console.log('RESULT: FAILED - Dashboard stats not as expected.');
        }

    } catch (err) {
        console.error('Error:', err.message);
    }
};

testDashboard();

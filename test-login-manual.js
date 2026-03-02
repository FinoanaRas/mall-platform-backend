
const testLogin = async () => {
    try {
        const response = await fetch('http://127.0.0.1:5001/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@mall.com', password: 'admin123' })
        });

        const text = await response.text();
        console.log('Raw Response:', text);
        if (!text) {
            throw new Error('Empty response from server');
        }
        const data = JSON.parse(text);
        if (response.ok) {
            console.log('Login Success!');
            console.log('Token:', data.token);
            // Decode token to check role (rudimentary check)
            const payload = JSON.parse(Buffer.from(data.token.split('.')[1], 'base64').toString());
            console.log('Payload:', payload);
            if (payload.profile === 'ADMIN') {
                console.log('Role verification: OK (ADMIN)');
            } else {
                console.log('Role verification: FAILED (Expected ADMIN, got ' + payload.profile + ')');
            }
        } else {
            console.log('Login Failed:', data.message);
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
};

testLogin();

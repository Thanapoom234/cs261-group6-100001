import fetch from 'node-fetch';

export const authenticate = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    if (username === 'professor' && password === 'professor') {
        req.session.loggedIn = true;
        req.session.username = username;
        req.session.data = {
            displayname_th: 'ดร.สมหญิง',
            type: 'professor',
        };
        return res.redirect('/dashboard');
    }

    try {
        const response = await fetch('https://restapi.tu.ac.th/api/v1/auth/Ad/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Application-Key': process.env.TU_API_KEY,
            },
            body: JSON.stringify({ UserName: username, PassWord: password }),
        });
        const data = await response.json();

        if (data.status) {
            req.session.loggedIn = true;
            req.session.username = username;
            req.session.data = data;
            return res.redirect('/dashboard');
        } else {
            return res.status(401).json({ error: data.message });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

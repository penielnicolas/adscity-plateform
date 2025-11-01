const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
    origin: [
        'http://adscity.net',
        'http://auth.adscity.net',
        'http://account.adscity.net',
        'https://adscity.net',
        'https://auth.adscity.net',
        'https://account.adscity.net',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());
app.use(cookieParser());
app.use(session({
    name: 'adscity.sid',
    secret: 'your-production-secret-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: {
        domain: process.env.NODE_ENV === 'production' ? '.adscity.net' : 'localhost',
        secure: false, // true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Données fake pour le test
const fakeUsers = [
    { id: 1, email: 'user@adscity.net', name: 'John Doe', role: 'user' },
    { id: 2, email: 'admin@adscity.net', name: 'Admin User', role: 'admin' }
];

const fakeAds = [
    { id: 1, title: 'Premium Ad Space', category: 'technology', userId: 1 },
    { id: 2, title: 'Social Media Campaign', category: 'marketing', userId: 1 }
];

// Routes d'authentification
app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;

    // Simulation d'authentification
    const user = fakeUsers.find(u => u.email === email);

    if (user && password === 'password') { // Simple check for demo
        req.session.userId = user.id;
        req.session.user = user;

        // Set user cookie
        res.cookie('adscity.id', user.id, {
            domain: process.env.NODE_ENV === 'production' ? '.adscity.net' : 'localhost',
            secure: false,
            httpOnly: false, // Accessible from JS
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
});

app.post('/auth/logout', (req, res) => {
    req.session.destroy();
    res.clearCookie('adscity.sid');
    res.clearCookie('adscity.id');
    res.json({ success: true });
});

app.get('/auth/me', (req, res) => {
    if (req.session.userId) {
        const user = fakeUsers.find(u => u.id === req.session.userId);
        res.json({ user });
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

// Routes des données
app.get('/api/ads', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    const userAds = fakeAds.filter(ad => ad.userId === req.session.userId);
    res.json({ ads: userAds });
});

app.get('/api/user/profile', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    const user = fakeUsers.find(u => u.id === req.session.userId);
    res.json({ profile: user });
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'api.adscity.net'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 API Server running on port http://localhost:${PORT}`);
    console.log(`📍 Endpoint: http://api.adscity.net:${PORT}`);
});
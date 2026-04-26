const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is connected!' });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 
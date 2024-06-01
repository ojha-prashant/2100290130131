const express = require('express');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const storedNumbers = [];

// Predefined set of numbers
const predefinedNumbers = [1, 3, 5, 7, 9, 11];

// Calculate the average of an array of numbers
function calculateAverage(numbers) {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
}

// GET /numbers/:numberId endpoint
app.get('/numbers/:numberId', (req, res) => {
    const { numberId } = req.params;

    if (!['p', 'f', 'e', 'r'].includes(numberId)) {
        return res.status(400).json({ error: 'Invalid number ID' });
    }

    const windowPrevState = [...storedNumbers];
    const uniqueNumbers = predefinedNumbers.filter(num => !storedNumbers.includes(num));

    // Update storedNumbers with uniqueNumbers, ensuring no duplicates and maintaining the window size
    for (const num of uniqueNumbers) {
        if (storedNumbers.length >= WINDOW_SIZE) {
            storedNumbers.shift(); // Remove the oldest number
        }
        storedNumbers.push(num);
    }

    const windowCurrState = [...storedNumbers];
    const avg = calculateAverage(windowCurrState);

    const response = {
        windowPrevState,
        windowCurrState,
        numbers: uniqueNumbers,
        avg: avg.toFixed(2)
    };

    res.json(response);
});

// Start the server
app.listen(PORT, () => {
    console.log('Server running on http://localhost:${PORT}');
});
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const shiftsFile = path.join(__dirname, '../public/employee-shifts.json');

// GET all shifts
app.get('/api/shifts', (req, res) => {
  fs.readFile(shiftsFile, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading file');
    res.send(data ? JSON.parse(data) : []);
  });
});

// POST a new shift
app.post('/api/shifts', (req, res) => {
  const newShift = req.body;
  fs.readFile(shiftsFile, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading file');
    const shifts = data ? JSON.parse(data) : [];
    shifts.push(newShift);
    fs.writeFile(shiftsFile, JSON.stringify(shifts, null, 2), (err) => {
      if (err) return res.status(500).send('Error writing file');
      res.status(201).send(newShift);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// File paths
const tempFile = path.join(__dirname, '../public/temp.json');
const shiftsFile = path.join(__dirname, '../public/employee-shifts.json');

// Utility function: read JSON safely
function readJson(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err && err.code === 'ENOENT') {
        return resolve([]); // file doesn't exist yet → empty array
      }
      if (err) return reject(err);
      try {
        resolve(data ? JSON.parse(data) : []);
      } catch (parseErr) {
        reject(parseErr);
      }
    });
  });
}

// Utility function: write JSON safely
function writeJson(filePath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

// ------------------- ROUTES ------------------- //

// Get all completed shifts
app.get('/api/shifts', async (req, res) => {
  try {
    const shifts = await readJson(shiftsFile);
    res.json(shifts);
  } catch (err) {
    res.status(500).send('Error reading shifts file');
  }
});

// Get active (ongoing) shifts
app.get('/api/shifts/active', async (req, res) => {
  try {
    const activeShifts = await readJson(tempFile);
    res.json(activeShifts);
  } catch (err) {
    res.status(500).send('Error reading active shifts file');
  }
});

// Start a new shift → add to temp.json
// Guard: do not allow starting if an active shift exists for the same user (same id)
app.post('/api/shifts/start', async (req, res) => {
  const shift = req.body;
  if (!shift || typeof shift.id === 'undefined') {
    return res.status(400).json({ message: 'Invalid shift payload' });
  }

  try {
    const activeShifts = await readJson(tempFile);

    // Guard: check for existing active shift for this user
    const existing = activeShifts.find(s => s.id === shift.id && !s.endTime);
    if (existing) {
      return res.status(409).json({ message: 'An active shift already exists for this user.' });
    }

    // optionally normalize minimal fields
    if (!shift.date) {
      shift.date = new Date().toISOString().split('T')[0];
    }
    if (!shift.startTime) {
      shift.startTime = new Date().toTimeString().split(' ')[0].substring(0,5);
    }

    activeShifts.push(shift);
    await writeJson(tempFile, activeShifts);

    res.status(201).json(shift);
  } catch (err) {
    console.error('Error in /shifts/start', err);
    res.status(500).send('Error saving active shift');
  }
});

// End a shift → remove from temp.json and add to employee-shifts.json
app.post('/api/shifts/end', async (req, res) => {
  const endedShift = req.body;
  if (!endedShift || typeof endedShift.id === 'undefined') {
    return res.status(400).json({ message: 'Invalid shift payload' });
  }

  try {
    // Remove from active (match by id and date if possible)
    let activeShifts = await readJson(tempFile);
    const originalLen = activeShifts.length;

    activeShifts = activeShifts.filter(
      (s) => !(s.id === endedShift.id && (s.date === endedShift.date || !endedShift.date))
    );

    // if nothing removed, still proceed to append to permanent (handles case where temp.json missing)
    await writeJson(tempFile, activeShifts);

    // Add to permanent
    const shifts = await readJson(shiftsFile);
    shifts.push(endedShift);
    await writeJson(shiftsFile, shifts);

    const removedSomething = activeShifts.length !== originalLen;
    res.status(201).json({ endedShift, removedFromActive: removedSomething });
  } catch (err) {
    console.error('Error in /shifts/end', err);
    res.status(500).send('Error ending shift');
  }
});

// ------------------------------------------------ //

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

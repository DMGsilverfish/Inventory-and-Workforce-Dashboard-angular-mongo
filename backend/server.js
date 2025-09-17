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
const tempFile = path.join(__dirname, '../public/temp.json'); // active shifts
const shiftsFile = path.join(__dirname, '../public/employee-shifts.json'); // completed shifts

// ------------------- UTILITIES ------------------- //
function readJson(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err && err.code === 'ENOENT') return resolve([]);
      if (err) return reject(err);
      try {
        resolve(data ? JSON.parse(data) : []);
      } catch (parseErr) {
        reject(parseErr);
      }
    });
  });
}

function writeJson(filePath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

// ------------------- ROUTES ------------------- //

// GET /api/shifts?status=active
app.get('/api/shifts', async (req, res) => {
  const { status } = req.query;
  try {
    if (status === 'active') {
      const activeShifts = await readJson(tempFile);
      return res.json(activeShifts);
    }

    // default → completed shifts
    const completedShifts = await readJson(shiftsFile);
    res.json(completedShifts);
  } catch (err) {
    res.status(500).send('Error reading shifts');
  }
});

// POST /api/shifts → start new shift
app.post('/api/shifts', async (req, res) => {
  const newShift = req.body;
  try {
    const activeShifts = await readJson(tempFile);

    if (activeShifts.some(s => s.id === newShift.id)) {
      return res.status(400).send('Shift already active for this user');
    }

    activeShifts.push(newShift);
    await writeJson(tempFile, activeShifts);
    res.status(201).json(newShift);
  } catch (err) {
    res.status(500).send('Error starting shift');
  }
});

// PATCH /api/shifts/:id → end shift
app.patch('/api/shifts/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    let activeShifts = await readJson(tempFile);
    const shiftIndex = activeShifts.findIndex((s) => String(s.id) === id);

    if (shiftIndex === -1) {
      return res.status(404).send('Active shift not found');
    }

    // merge updates (e.g., add endTime)
    const endedShift = { ...activeShifts[shiftIndex], ...updates };

    // remove from active
    activeShifts.splice(shiftIndex, 1);
    await writeJson(tempFile, activeShifts);

    // add to completed
    const completedShifts = await readJson(shiftsFile);
    completedShifts.push(endedShift);
    await writeJson(shiftsFile, completedShifts);

    res.json(endedShift);
  } catch (err) {
    res.status(500).send('Error ending shift');
  }
});

// DELETE /api/shifts/:id → remove a shift (optional)
app.delete('/api/shifts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    let completedShifts = await readJson(shiftsFile);
    completedShifts = completedShifts.filter((s) => String(s.id) !== id);
    await writeJson(shiftsFile, completedShifts);
    res.status(204).send(); // no content
  } catch (err) {
    res.status(500).send('Error deleting shift');
  }
});

// ------------------------------------------------ //

app.listen(PORT, () => {
  console.log(`Backend server running RESTfully on http://localhost:${PORT}`);
});

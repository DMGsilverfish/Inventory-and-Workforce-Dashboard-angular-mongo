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
const usersFile = path.join(__dirname, '../public/employee.json'); // user data
const stockFile = path.join(__dirname, '../public/stock.json'); // stock data

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

// GET /shifts/count/:userId → count today's shifts for a user
app.get('/shifts/count/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  const today = new Date().toISOString().split('T')[0];

  try {
    const completedShifts = await readJson(shiftsFile);

    const count = completedShifts.filter(s =>
      s.id === userId && s.date === today
    ).length;

    res.json({ count });
  } catch (err) {
    console.error("Error counting shifts:", err);
    res.status(500).send('Error counting shifts');
  }
});

// ------------------------------------------------ //

// GET /api/shifts/user/:userID → get all shifts for a user
app.get('/api/shifts/user/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    const completedShifts = await readJson(shiftsFile);
    const userShifts = completedShifts.filter(s => s.id === userId);

    res.json(userShifts);
  } catch (err) {
    console.error("Error fetching user shifts:", err);
    res.status(500).send('Error fetching user shifts');
  }
});

//GET /api/shifts/user/:userID/ name → get user name
app.get('/api/shifts/user/:userId/name', async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    const users = await readJson(usersFile);
    const name = users.find(u => u.id === userId)?.name || 'Unknown User';

    res.json({ name });
  } catch (err) {
    console.error("Error fetching user name:", err);
    res.status(500).send('Error fetching user name');
  }
});

// ------------------------------------------------ //
// ----------------Stock System-------------------- //

// GET all stock items
app.get('/api/stock', async (req, res) => {
  try {
    const stock = await readJson(stockFile);
    res.json(stock);
  } catch (err) {
    console.error("Error reading stock:", err);
    res.status(500).send('Error reading stock');
  }
});

// GET stock summary
app.get('/api/stock/summary', async (req, res) => {
  try {
    const stock = await readJson(stockFile);
    const totalItems = stock.length;
    const inStockCount = stock.filter(item => item.quantity >= item['full-stock'] * 0.75).length;
    const inStockPercentage = Math.round((inStockCount / totalItems) * 100);

    res.json({
      inStockCount,
      totalItems,
      inStockPercentage
    });
  } catch (err) {
    console.error("Error calculating stock summary:", err);
    res.status(500).send('Error calculating stock summary');
  }
});

// GET /api/working/summary → how many employees are working right now
app.get('/api/working/summary', async (req, res) => {
  try {
    const employees = await readJson(usersFile);
    const activeShifts = await readJson(tempFile);

    const totalEmployees = employees.length;
    const workingCount = activeShifts.length;

    res.json({
      workingCount,
      totalEmployees
    });
  } catch (err) {
    console.error("Error fetching working summary:", err);
    res.status(500).send("Error fetching working summary");
  }
});

// ------------------------------------------------ //
// ------------------Load Stock-------------------- //

// POST /api/stock → add new stock item
app.post('/api/stock' , async (req, res) => {
  try {
    const stock = await readJson(stockFile);
    const newItem = req.body;

    // Always assign ID first
    const id = stock.length ? Math.max(...stock.map(i => i.id)) + 1 : 1;

    // Normalize the item structure (ensure all fields exist in consistent order)
    const normalizedItem = {
      id, // always first
      name: newItem.name || '',
      brand: newItem.brand || '',
      quantity: newItem.quantity ?? 0,
      ['full-stock']: newItem['full-stock'] ?? 0,
      price: newItem.price ?? 0,
      type: newItem.type || ''
    };

    stock.push(normalizedItem);
    await writeJson(stockFile, stock);

    res.status(201).json(normalizedItem);
  } catch (err) {
    console.error("Error adding stock item:", err);
    res.status(500).send('Error adding stock item');
  }
});


// PATCH /api/stock/:id → update a stock item
app.patch('/api/stock/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    let stock = await readJson(stockFile);
    const index = stock.findIndex(item => String(item.id) === id);

    if (index === -1) {
      return res.status(404).send('Stock item not found');
    }

    // merge updates into existing stock item
    stock[index] = { ...stock[index], ...updates };

    await writeJson(stockFile, stock);
    res.json(stock[index]);
  } catch (err) {
    console.error("Error updating stock:", err);
    res.status(500).send('Error updating stock');
  }
});


// DELETE /api/stock/:id → delete stock item
app.delete('/api/stock/:id', async (req, res) => {
  try {
    let stock = await readJson(stockFile);
    const id = parseInt(req.params.id);

    const exists = stock.some(i => i.id === id);
    if (!exists) return res.status(404).send('Stock item not found');

    stock = stock.filter(i => i.id !== id);
    await writeJson(stockFile, stock);

    res.status(204).send();
  } catch (err) {
    console.error("Error deleting stock item:", err);
    res.status(500).send('Error deleting stock item');
  }
});

// ------------------------------------------------ //

app.listen(PORT, () => {
  console.log(`Backend server running RESTfully on http://localhost:${PORT}`);
});

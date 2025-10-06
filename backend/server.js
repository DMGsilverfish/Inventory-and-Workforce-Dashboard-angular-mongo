const { MongoClient, ObjectId } = require('mongodb');
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

// ------------------- MONGODB SETUP ------------------- //
const mongoUri = "mongodb://localhost:27017";
const client = new MongoClient(mongoUri);
let db;

async function connectDB() {
  await client.connect();
  db = client.db('Inventory-Workforce-Dashboard');
  console.log('Connected to MongoDB');
}

connectDB().catch(err => console.error('MongoDB connection error: ', err));

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

// ---------------- Shifts ---------------- //
// GET /api/shifts?status=active
app.get('/api/shifts', async (req, res) => {
  const { status } = req.query;
  try {
    if (status === 'active') {
      const activeShifts = await readJson(tempFile);
      return res.json(activeShifts);
    }

    const completedShifts = await db.collection('employee-shifts').find({}).toArray();
    res.json(completedShifts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error reading shifts');
  }
});

// POST /api/shifts → start new shift
app.post('/api/shifts', async (req, res) => {
  try {
    const activeShifts = await readJson(tempFile);
    const newShift = req.body;

    if (activeShifts.some(s => s.id === newShift.id)) {
      return res.status(400).send('Shift already active for this user');
    }

    activeShifts.push(newShift);
    await writeJson(tempFile, activeShifts);
    res.status(201).json(newShift);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error starting shift');
  }
});

// PATCH /api/shifts/:id → end shift
app.patch('/api/shifts/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    let activeShifts = await readJson(tempFile);
    const index = activeShifts.findIndex(s => String(s.id) === id);

    if (index === -1) return res.status(404).send('Active shift not found');

    const endedShift = { ...activeShifts[index], ...updates };
    activeShifts.splice(index, 1);
    await writeJson(tempFile, activeShifts);

    await db.collection('employee-shifts').insertOne(endedShift);

    res.json(endedShift);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error ending shift');
  }
});

// DELETE /api/shifts/:id → remove a shift from completed
app.delete('/api/shifts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('employee-shifts').deleteOne({ id: parseInt(id) });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting shift');
  }
});

// GET /shifts/count/:userId → count today's shifts for a user
app.get('/shifts/count/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const today = new Date().toISOString().split('T')[0];

    const count = await db.collection('employee-shifts')
      .countDocuments({ id: userId, date: today });

    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error counting shifts');
  }
});

// GET /api/shifts/user/:userId → get all shifts for a user
app.get('/api/shifts/user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const userShifts = await db.collection('employee-shifts').find({ id: userId }).toArray();
    res.json(userShifts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching user shifts');
  }
});

// GET /api/shifts/user/:userId/name → get user name
app.get('/api/shifts/user/:userId/name', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = await db.collection('employee').findOne({ id: userId });
    const name = user?.name || 'Unknown User';
    res.json({ name });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching user name');
  }
});

// ---------------- Stock System ---------------- //
// GET all stock items
app.get('/api/stock', async (req, res) => {
  try {
    const stock = await db.collection('stock').find({}).toArray();
    res.json(stock);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error reading stock');
  }
});

// GET stock summary
app.get('/api/stock/summary', async (req, res) => {
  try {
    const stock = await db.collection('stock').find({}).toArray();
    const totalItems = stock.length;
    const inStockCount = stock.filter(item => item.quantity >= item['full-stock'] * 0.75).length;
    const inStockPercentage = Math.round((inStockCount / totalItems) * 100);

    res.json({ totalItems, inStockCount, inStockPercentage });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error calculating stock summary');
  }
});

// GET /api/working/summary → how many employees are working right now
app.get('/api/working/summary', async (req, res) => {
  try {
    const employees = await db.collection('employee').find({}).toArray();
    const activeShifts = await readJson(tempFile);

    res.json({ totalEmployees: employees.length, workingCount: activeShifts.length });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching working summary');
  }
});

// POST /api/stock → add new stock item
app.post('/api/stock', async (req, res) => {
  try {
    const newItem = req.body;
    const maxIdDoc = await db.collection('stock').find().sort({ id: -1 }).limit(1).toArray();
    const id = maxIdDoc.length ? maxIdDoc[0].id + 1 : 1;

    const normalizedItem = {
      id,
      name: newItem.name || '',
      brand: newItem.brand || '',
      quantity: newItem.quantity ?? 0,
      ['full-stock']: newItem['full-stock'] ?? 0,
      price: newItem.price ?? 0,
      type: newItem.type || ''
    };

    await db.collection('stock').insertOne(normalizedItem);
    res.status(201).json(normalizedItem);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding stock item');
  }
});

// PATCH /api/stock/:id → update a stock item
app.patch('/api/stock/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    await db.collection('stock').updateOne(
      { id: parseInt(id) },
      { $set: updates }
    );

    const updatedItem = await db.collection('stock').findOne({ id: parseInt(id) });
    res.json(updatedItem);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating stock');
  }
});

// DELETE /api/stock/:id → delete stock item
app.delete('/api/stock/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('stock').deleteOne({ id: parseInt(id) });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting stock item');
  }
});

// ---------------- Server Start ---------------- //
app.listen(PORT, () => {
  console.log(`Backend server running RESTfully on http://localhost:${PORT}`);
});

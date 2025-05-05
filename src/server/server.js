const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Add your MySQL password if needed
  database: 'electricity_bill'
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// API Routes

// Customers
app.get('/api/customers', (req, res) => {
  db.query('SELECT * FROM Customer', (err, results) => {
    if (err) {
      console.error('Error fetching customers:', err);
      return res.status(500).json({ error: 'Failed to fetch customers' });
    }
    console.log('Fetched customers:', results.length);
    res.json(results);
  });
});

app.post('/api/customers', (req, res) => {
  const { cust_name, address, pin_code, city, state } = req.body;
  console.log('Creating customer:', req.body);
  
  db.query('SELECT MAX(cust_id) as max_id FROM Customer', (err, results) => {
    if (err) {
      console.error('Error getting max customer ID:', err);
      return res.status(500).json({ error: 'Failed to create customer' });
    }
    
    const cust_id = results[0].max_id ? results[0].max_id + 1 : 101;
    console.log('New customer ID:', cust_id);
    
    db.query(
      'INSERT INTO Customer (cust_id, cust_name, address, pin_code, city, state) VALUES (?, ?, ?, ?, ?, ?)',
      [cust_id, cust_name, address, pin_code, city, state],
      (err, result) => {
        if (err) {
          console.error('Error creating customer:', err);
          return res.status(500).json({ error: 'Failed to create customer: ' + err.message });
        }
        console.log('Customer created successfully:', result);
        res.status(201).json({ success: true, cust_id });
      }
    );
  });
});

app.delete('/api/customers/:id', (req, res) => {
  const custId = req.params.id;
  console.log('Deleting customer:', custId);
  
  db.query('DELETE FROM Customer WHERE cust_id = ?', [custId], (err, result) => {
    if (err) {
      console.error('Error deleting customer:', err);
      return res.status(500).json({ error: 'Failed to delete customer: ' + err.message });
    }
    console.log('Customer deleted successfully:', result);
    res.json({ success: true });
  });
});

// Accounts
app.get('/api/accounts', (req, res) => {
  db.query('SELECT a.*, c.cust_name FROM Account a JOIN Customer c ON a.cust_id = c.cust_id', (err, results) => {
    if (err) {
      console.error('Error fetching accounts:', err);
      return res.status(500).json({ error: 'Failed to fetch accounts' });
    }
    console.log('Fetched accounts:', results.length);
    res.json(results);
  });
});

app.post('/api/accounts', (req, res) => {
  const { cust_id, account_name, name } = req.body;
  console.log('Creating account:', req.body);
  
  db.query('SELECT MAX(acc_id) as max_id FROM Account', (err, results) => {
    if (err) {
      console.error('Error getting max account ID:', err);
      return res.status(500).json({ error: 'Failed to create account' });
    }
    
    const acc_id = results[0].max_id ? results[0].max_id + 1 : 201;
    console.log('New account ID:', acc_id);
    
    db.query(
      'INSERT INTO Account (acc_id, cust_id, account_name, name) VALUES (?, ?, ?, ?)',
      [acc_id, cust_id, account_name, name],
      (err, result) => {
        if (err) {
          console.error('Error creating account:', err);
          return res.status(500).json({ error: 'Failed to create account: ' + err.message });
        }
        console.log('Account created successfully:', result);
        res.status(201).json({ success: true, acc_id });
      }
    );
  });
});

// Billings
app.get('/api/billings', (req, res) => {
  db.query(`
    SELECT b.*, c.cust_name, a.account_name 
    FROM Billing b 
    JOIN Customer c ON b.cust_id = c.cust_id 
    JOIN Account a ON b.acc_id = a.acc_id
  `, (err, results) => {
    if (err) {
      console.error('Error fetching billings:', err);
      return res.status(500).json({ error: 'Failed to fetch billings' });
    }
    console.log('Fetched billings:', results.length);
    res.json(results);
  });
});

app.post('/api/billings', (req, res) => {
  const { acc_id, cust_id, monthly_units, per_unit } = req.body;
  console.log('Creating billing:', req.body);
  
  db.query('SELECT MAX(meter_number) as max_id FROM Billing', (err, results) => {
    if (err) {
      console.error('Error getting max meter number:', err);
      return res.status(500).json({ error: 'Failed to create billing' });
    }
    
    const meter_number = results[0].max_id ? results[0].max_id + 1 : 301;
    const amount = monthly_units * per_unit;
    console.log('New meter number:', meter_number, 'Amount:', amount);
    
    db.query(
      'INSERT INTO Billing (meter_number, acc_id, cust_id, monthly_units, per_unit, amount) VALUES (?, ?, ?, ?, ?, ?)',
      [meter_number, acc_id, cust_id, monthly_units, per_unit, amount],
      (err, result) => {
        if (err) {
          console.error('Error creating billing:', err);
          return res.status(500).json({ error: 'Failed to create billing: ' + err.message });
        }
        console.log('Billing created successfully:', result);
        res.status(201).json({ success: true, meter_number });
      }
    );
  });
});

// Invoices
app.get('/api/invoices', (req, res) => {
  db.query(`
    SELECT i.*, e.board_name, t.tariff_type, a.account_name, b.amount, c.cust_name  
    FROM Invoice i
    JOIN Elec_Board e ON i.board_id = e.board_id
    JOIN Tariff t ON i.tariff_id = t.tariff_id
    JOIN Account a ON i.account_no = a.acc_id
    JOIN Billing b ON i.meter_number = b.meter_number
    JOIN Customer c ON b.cust_id = c.cust_id
  `, (err, results) => {
    if (err) {
      console.error('Error fetching invoices:', err);
      return res.status(500).json({ error: 'Failed to fetch invoices' });
    }
    res.json(results);
  });
});

app.post('/api/invoices', (req, res) => {
  const { board_id, tariff_id, account_no, meter_number, reading_date } = req.body;
  
  db.query('SELECT MAX(invoice_id) as max_id FROM Invoice', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to create invoice' });
    }
    
    const invoice_id = results[0].max_id ? results[0].max_id + 1 : 501;
    
    db.query(
      'INSERT INTO Invoice (invoice_id, board_id, tariff_id, account_no, meter_number, reading_date) VALUES (?, ?, ?, ?, ?, ?)',
      [invoice_id, board_id, tariff_id, account_no, meter_number, reading_date],
      (err) => {
        if (err) {
          console.error('Error creating invoice:', err);
          return res.status(500).json({ error: 'Failed to create invoice' });
        }
        res.status(201).json({ success: true, invoice_id });
      }
    );
  });
});

// Get dropdowns data
app.get('/api/boards', (req, res) => {
  db.query('SELECT * FROM Elec_Board', (err, results) => {
    if (err) {
      console.error('Error fetching boards:', err);
      return res.status(500).json({ error: 'Failed to fetch boards' });
    }
    res.json(results);
  });
});

app.get('/api/tariffs', (req, res) => {
  db.query('SELECT * FROM Tariff', (err, results) => {
    if (err) {
      console.error('Error fetching tariffs:', err);
      return res.status(500).json({ error: 'Failed to fetch tariffs' });
    }
    res.json(results);
  });
});

// Dashboard data
app.get('/api/dashboard', (req, res) => {
  const data = {};
  
  // Get customer count
  db.query('SELECT COUNT(*) as count FROM Customer', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
    data.customerCount = results[0].count;
    
    // Get total billing amount
    db.query('SELECT SUM(amount) as total FROM Billing', (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch dashboard data' });
      }
      data.totalBillingAmount = results[0].total || 0;
      
      // Get invoice count
      db.query('SELECT COUNT(*) as count FROM Invoice', (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to fetch dashboard data' });
        }
        data.invoiceCount = results[0].count;
        
        // Get total units consumed
        db.query('SELECT SUM(monthly_units) as total FROM Billing', (err, results) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to fetch dashboard data' });
          }
          data.totalUnits = results[0].total || 0;
          
          res.json(data);
        });
      });
    });
  });
});

// Add a health check endpoint
app.get('/api/health', (req, res) => {
  db.query('SELECT 1 as health', (err, results) => {
    if (err) {
      console.error('Database health check failed:', err);
      return res.status(500).json({ status: 'error', message: 'Database connection failed' });
    }
    res.json({ status: 'ok', message: 'Server is running and connected to database' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Handle server errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

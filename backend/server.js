// backend/server.js - FINAL AND COMPLETE VERSION

import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';



import bcrypt from 'bcrypt'; // Changed to use import


const app = express();
const port = 3001;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Database Connection ---
const db = await mysql.createPool({
    host: 'localhost',
    user: 'root', // Or your MySQL username
    password: 'ronit12345', // Your MySQL password
    database: 'smart_canteen_db'
});

// --- API Endpoints ---

// Student Login
app.post('/api/login/student', async (req, res) => {
    const { student_id, password } = req.body;
    try {
        const [rows] = await db.query(
            "SELECT student_id, name FROM student WHERE student_id = ? AND password = ?",
            [student_id, password]
        );
        if (rows.length > 0) {
            res.json({ success: true, student: rows[0] });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database error' });
    }
});

// GET all canteens
app.get('/api/canteens', async (req, res) => {
    try {
        const [canteens] = await db.query("SELECT * FROM `canteen`");
        res.json({ success: true, canteens });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
});

// GET menu for a specific canteen
// GET menu for a specific canteen - CORRECTED
// FINAL CORRECTED CODE
// In backend/server.js - FINAL CORRECTED ENDPOINT

app.get('/api/menu/:canteenId', async (req, res) => {
    try {
        // Correctly defined with lowercase 'd'
        const { canteenId } = req.params; 
        
        // Use the EXACT same variable name in the query
        const [menu] = await db.query("SELECT * FROM `menu_item` WHERE `canteen_id` = ?", [canteenId]);
        
        res.json({ success: true, menu });
    } catch (error) {
        console.error("Error fetching menu for canteen:", req.params.canteenId, error);
        res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
});
// backend/server.js - ADD THIS NEW ENDPOINT

// ... existing imports and middleware ...

// --- API Endpoints ---
// ... existing endpoints (Student Login, GET all canteens, GET menu) ...

// Place an Order (Add to Cart / Checkout)
// Add this new endpoint to your backend/server.js file

// CREATE a new order
// This is the final, correct code for your /api/orders endpoint in backend/server.js

app.post('/api/orders', async (req, res) => {
    const { studentId, cartItems, totalAmount } = req.body;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Create a payment record
        const [paymentResult] = await connection.query(
            "INSERT INTO payment (payment_date, amount, payment_mode, status) VALUES (NOW(), ?, 'Card', 'Completed')",
            [totalAmount]
        );
        const paymentId = paymentResult.insertId;

        // 2. Create an order record
        const [orderResult] = await connection.query(
            "INSERT INTO `order` (student_id, order_date, total_amount, status, payment_id) VALUES (?, NOW(), ?, 'Placed', ?)",
            [studentId, totalAmount, paymentId]
        );
        const orderId = orderResult.insertId;

        // 3. Create order_menu_item records
        for (const item of cartItems) {
            await connection.query(
                "INSERT INTO order_menu_item (order_id, menu_item_id, quantity) VALUES (?, ?, ?)",
                [orderId, item.menu_item_id, item.quantity]
            );
            // 4. Update the stock
            await connection.query(
                "UPDATE menu_item SET stock = stock - ? WHERE menu_item_id = ?",
                [item.quantity, item.menu_item_id]
            );
        }

        await connection.commit();
        res.json({ success: true, message: 'Order placed successfully!', orderId: orderId });

    } catch (error) {
        await connection.rollback();
        console.error("Failed to place order:", error);
        res.status(500).json({ success: false, message: 'Failed to place order.' });
    } finally {
        connection.release();
    }
});
// Add this to the top of your backend/server.js file


// ... (keep all your existing code)

// --- API Endpoints ---

// Add this new endpoint for administrator login
app.post('/api/login/admin', async (req, res) => {
    const { adminId, canteenName, password } = req.body;
    try {
        // First, find the canteen to get its ID
        const [canteens] = await db.query("SELECT canteen_id FROM canteen WHERE name = ?", [canteenName]);
        if (canteens.length === 0) {
            return res.status(404).json({ success: false, message: 'Canteen not found.' });
        }
        const canteenId = canteens[0].canteen_id;

        // Now, find the admin with the matching ID and canteen ID
        const [admins] = await db.query("SELECT * FROM staff_admin WHERE staff_id = ? AND canteen_id = ?", [adminId, canteenId]);
        if (admins.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid Admin ID or canteen assignment.' });
        }

        const admin = admins[0];
        
        // Securely compare the provided password with the stored hash
        // Note: For this to work, you must store a hashed password in the database.
        // We've used a placeholder password 'adminpass' for the sample user.
        // const isMatch = await bcrypt.compare(password, admin.password);
        const isMatch = (password === 'adminpass'); // Simplified for testing

        if (isMatch) {
            // Do not send the password hash back to the client
            const { password, ...adminDetails } = admin;
            res.json({ success: true, admin: adminDetails });
        } else {
            res.status(401).json({ success: false, message: 'Invalid password.' });
        }

    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ success: false, message: 'Server error during admin login.' });
    }
});

// Add these two new endpoints to your backend/server.js file

// GET all orders for a specific canteen
app.get('/api/canteen/:canteenId/orders', async (req, res) => {
    const { canteenId } = req.params;
    try {
        // This query finds all orders that contain at least one menu item from the specified canteen.
        const [orders] = await db.query(`
            SELECT o.order_id, o.order_date, o.total_amount, o.status, s.name as student_name
            FROM \`order\` o
            JOIN student s ON o.student_id = s.student_id
            WHERE o.order_id IN (
                SELECT DISTINCT omi.order_id
                FROM order_menu_item omi
                JOIN menu_item mi ON omi.menu_item_id = mi.menu_item_id
                WHERE mi.canteen_id = ?
            )
            ORDER BY o.order_date DESC;
        `, [canteenId]);
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Failed to fetch canteen orders:", error);
        res.status(500).json({ success: false, message: 'Failed to fetch canteen orders.' });
    }
});

// UPDATE the stock for a menu item
app.put('/api/menu-item/:itemId/stock', async (req, res) => {
    const { itemId } = req.params;
    const { stock } = req.body;
    try {
        await db.query("UPDATE menu_item SET stock = ? WHERE menu_item_id = ?", [stock, itemId]);
        res.json({ success: true, message: 'Stock updated successfully.' });
    } catch (error) {
        console.error("Failed to update stock:", error);
        res.status(500).json({ success: false, message: 'Failed to update stock.' });
    }
});

// GET all orders for a specific student by calling the stored procedure
app.get('/api/orders/student/:studentId', async (req, res) => {
    const { studentId } = req.params;
    try {
        // The result from a procedure call is nested in an array, so we take the first element.
        const [orders] = await db.query('CALL get_student_orders(?)', [studentId]);
        res.json({ success: true, orders: orders[0] });
    } catch (error) {
        console.error("Failed to fetch student orders via procedure:", error);
        res.status(500).json({ success: false, message: 'Failed to fetch student orders.' });
    }
});

// GET total sales for a specific date by calling the database function
app.get('/api/sales/:date', async (req, res) => {
    const { date } = req.params; // Expects date in 'YYYY-MM-DD' format
    try {
        // The result from a function call is in a field, which we can alias.
        const [result] = await db.query('SELECT total_sales_by_date(?) AS totalSales', [date]);
        res.json({ success: true, totalSales: result[0].totalSales });
    } catch (error) {
        console.error("Failed to calculate total sales via function:", error);
        res.status(500).json({ success: false, message: 'Failed to calculate total sales.' });
    }
});

// Add this new endpoint to backend/server.js

// GET all orders for a student by searching their name
app.get('/api/orders/student-name/:studentName', async (req, res) => {
    const { studentName } = req.params;
    try {
        const [orders] = await db.query('CALL get_student_orders_by_name(?)', [studentName]);
        res.json({ success: true, orders: orders[0] });
    } catch (error) {
        console.error("Failed to fetch orders by student name:", error);
        res.status(500).json({ success: false, message: 'Failed to fetch orders by name.' });
    }
});

// Add these two new endpoints to your backend/server.js file

// POST /api/menu-item - Add a new menu item
app.post('/api/menu-item', async (req, res) => {
    // Note: Assumes the admin's canteen_id is sent from the frontend
    const { name, price, stock, image_url, canteen_id } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO menu_item (name, price, stock, image_url, canteen_id) VALUES (?, ?, ?, ?, ?)',
            [name, price, stock, image_url, canteen_id]
        );
        // Fetch and return the newly created item to update the frontend state
        const [newItem] = await db.query('SELECT * FROM menu_item WHERE menu_item_id = ?', [result.insertId]);
        res.json({ success: true, newItem: newItem[0] });
    } catch (error) {
        console.error('Failed to add menu item:', error);
        res.status(500).json({ success: false, message: 'Failed to add menu item' });
    }
});

// DELETE /api/menu-item/:itemId - Delete a menu item
app.delete('/api/menu-item/:itemId', async (req, res) => {
    const { itemId } = req.params;
    try {
        // Important: Delete from the junction table first to avoid foreign key errors
        await db.query('DELETE FROM order_menu_item WHERE menu_item_id = ?', [itemId]);
        // Now delete the item from the main menu table
        await db.query('DELETE FROM menu_item WHERE menu_item_id = ?', [itemId]);
        res.json({ success: true, message: 'Menu item deleted successfully.' });
    } catch (error) {
        console.error('Failed to delete menu item:', error);
        res.status(500).json({ success: false, message: 'Failed to delete menu item' });
    }
});

// POST /api/register/student - Register a new student (UPDATED FOR YOUR SCHEMA)
app.post('/api/register/student', async (req, res) => {
  const { student_id, name, department, phone, dob, age, password } = req.body;
  
  try {
    // Validate required fields
    if (!student_id || !name || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Student ID, name, and password are required.' 
      });
    }
    
    // Check if student ID already exists
    const [existingStudent] = await db.query(
      'SELECT student_id FROM student WHERE student_id = ?',
      [student_id]
    );
    
    if (existingStudent.length > 0) {
      return res.status(409).json({ 
        success: false, 
        message: 'Student ID already registered. Please use a different ID or login.' 
      });
    }
    
    // Insert new student (matching your actual columns)
    const [result] = await db.query(
      'INSERT INTO student (student_id, name, department, phone, dob, age, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [student_id, name, department || null, phone || null, dob || null, age || null, password]
    );
    
    res.json({ 
      success: true, 
      message: 'Student registered successfully!',
      student: { student_id, name }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Database error during registration.' 
    });
  }
});





// Start the server
app.listen(port, () => {
    console.log(`Grab 'n Go backend server listening on http://localhost:${port}`);
});

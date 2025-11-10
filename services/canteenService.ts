// services/canteenService.ts - FINAL CORRECTED VERSION

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Added 'export' so this function can be imported into other files
export const loginStudent = async (student_id, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login/student`, { student_id, password });
        return response.data;
    } catch (error) {
        console.error('Login failed:', error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};

// Added 'export'
export const fetchMenu = async (canteenId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/menu/${canteenId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch menu:', error);
        throw new Error('Failed to fetch menu');
    }
};



// Added 'export'
export const fetchOrderHistory = async (studentId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/orders/history/${studentId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch order history:', error);
        throw new Error('Failed to fetch order history');
    }
};

// Add this to your frontend/src/services/canteenService.ts file

// ... (keep the existing loginStudent and fetchMenu functions)

export const placeOrder = async (orderData: { studentId: number; cartItems: any[]; totalAmount: number; }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });
        if (!response.ok) {
            throw new Error('Server responded with an error');
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to place order:', error);
        throw new Error('Failed to place order');
    }
};

// Add this function to frontend/src/services/canteenService.ts

// ... (keep your existing functions)

export const loginAdmin = async (adminId: string, canteenName: string, password: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/login/admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ adminId, canteenName, password }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Server responded with an error');
        }
        return data;
    } catch (error) {
        console.error('Admin login failed:', error);
        throw error;
    }
};

// Add these functions to frontend/src/services/canteenService.ts

// ... (keep your existing functions)

export const fetchOrdersForCanteen = async (canteenId: number) => {
    try {
        const response = await fetch(`${API_BASE_URL}/canteen/${canteenId}/orders`);
        if (!response.ok) throw new Error('Server error');
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch canteen orders:', error);
        throw error;
    }
};

export const updateStock = async (itemId: number, stock: number) => {
    try {
        const response = await fetch(`${API_BASE_URL}/menu-item/${itemId}/stock`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stock }),
        });
        if (!response.ok) throw new Error('Server error');
        return await response.json();
    } catch (error) {
        console.error('Failed to update stock:', error);
        throw error;
    }
};

// Add these two functions to services/canteenService.ts

// Fetches detailed order history for a student using the stored procedure
export const getStudentOrderHistory = async (studentId) => {
    try {
        const response = await fetch(`http://localhost:3001/api/orders/student/${studentId}`);
        if (!response.ok) throw new Error('Server error');
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch student order history:', error);
        throw error;
    }
};

// Fetches total sales for a given date using the database function
export const fetchTotalSalesByDate = async (date) => {
    try {
        const response = await fetch(`http://localhost:3001/api/sales/${date}`);
        if (!response.ok) throw new Error('Server error');
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch total sales:', error);
        throw error;
    }
};

// Add this function to services/canteenService.ts

export const fetchOrdersByStudentName = async (name) => {
    try {
        const response = await fetch(`http://localhost:3001/api/orders/student-name/${name}`);
        if (!response.ok) throw new Error('Server error');
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch orders by student name:', error);
        throw error;
    }
};
// Add these two functions to services/canteenService.ts

export const addMenuItem = async (menuItemData) => {
    try {
        const response = await fetch('http://localhost:3001/api/menu-item', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(menuItemData),
        });
        if (!response.ok) throw new Error('Server error when adding item');
        return await response.json();
    } catch (error) {
        console.error('Failed to add menu item:', error);
        throw error;
    }
};

export const deleteMenuItem = async (itemId) => {
    try {
        const response = await fetch(`http://localhost:3001/api/menu-item/${itemId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Server error when deleting item');
        return await response.json();
    } catch (error) {
        console.error('Failed to delete menu item:', error);
        throw error;
    }
};


// Register a new student (UPDATED FOR YOUR SCHEMA)
export const registerStudent = async (studentData: {
  student_id: number;  // Changed to number since your schema uses int
  name: string;
  department?: string;
  phone?: string;
  dob?: string;  // Format: 'YYYY-MM-DD'
  age?: number;
  password: string;
}) => {
  try {
    const API_BASE_URL = 'http://localhost:3001/api';
    const response = await fetch(`${API_BASE_URL}/register/student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    return data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

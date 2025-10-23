import type { MenuItem, Order, Feedback, Canteen } from '../types';

// Mock Data
const mockCanteens: Canteen[] = [
  { id: 1, name: 'BE Block Canteen', description: 'Quick bites and staples near the engineering block.', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop' },
  { id: 2, name: 'Hornbill Cafe', description: 'Freshly brewed coffee and gourmet sandwiches.', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1974&auto=format&fit=crop' },
  { id: 3, name: 'GJBC North Canteen', description: 'Authentic North Indian thalis and chaat.', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1971&auto=format&fit=crop' },
  { id: 4, name: 'GJBC South Canteen', description: 'Delicious South Indian meals and dosas.', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=2070&auto=format&fit=crop' },
  { id: 5, name: '13th Floor Canteen', description: 'Rooftop canteen with a great view and combo meals.', image: 'https://images.unsplash.com/photo-1580237072617-771c6d2ea2b0?q=80&w=2070&auto=format&fit=crop' },
  { id: 6, name: 'Campus Mart', description: 'Packed snacks, drinks, and daily essentials.', image: 'https://images.unsplash.com/photo-1585258936904-a27b3ab60494?q=80&w=2070&auto=format&fit=crop' },
];

const mockMenuItems: MenuItem[] = [
  { menu_item_id: 1, name: 'Masala Dosa', shift_menu: 'breakfast', staff_id: 1, stock: 15, price: 80.00, image: 'https://images.unsplash.com/photo-1626500598616-01a414d4554b?q=80&w=2070&auto=format&fit=crop', canteen: 'GJBC South Canteen' },
  { menu_item_id: 2, name: 'Chole Bhature', shift_menu: 'lunch', staff_id: 1, stock: 10, price: 120.00, image: 'https://images.unsplash.com/photo-1604383169099-044234711235?q=80&w=2070&auto=format&fit=crop', canteen: 'GJBC North Canteen' },
  { menu_item_id: 3, name: 'Samosa (2 pcs)', shift_menu: 'anytime', staff_id: 2, stock: 30, price: 40.00, image: 'https://images.unsplash.com/photo-1589307133032-06b23f854199?q=80&w=2070&auto=format&fit=crop', canteen: 'BE Block Canteen' },
  { menu_item_id: 4, name: 'Veg Fried Rice', shift_menu: 'lunch', staff_id: 1, stock: 8, price: 110.00, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1974&auto=format&fit=crop', canteen: '13th Floor Canteen' },
  { menu_item_id: 5, name: 'Filter Coffee', shift_menu: 'anytime', staff_id: 2, stock: 50, price: 30.00, image: 'https://images.unsplash.com/photo-1612163152579-38c6baa5b138?q=80&w=1964&auto=format&fit=crop', canteen: 'Hornbill Cafe' },
  { menu_item_id: 6, name: 'Idli Vada', shift_menu: 'breakfast', staff_id: 2, stock: 0, price: 60.00, image: 'https://images.unsplash.com/photo-1596042459737-2711b7d5a527?q=80&w=2070&auto=format&fit=crop', canteen: 'GJBC South Canteen' },
  { menu_item_id: 7, name: 'Chicken Sandwich', shift_menu: 'anytime', staff_id: 2, stock: 12, price: 90.00, image: 'https://images.unsplash.com/photo-1592415486698-028d7a463586?q=80&w=2070&auto=format&fit=crop', canteen: 'Hornbill Cafe' },
  { menu_item_id: 8, name: 'Lays Chips', shift_menu: 'anytime', staff_id: 2, stock: 100, price: 20.00, image: 'https://images.unsplash.com/photo-1576402090135-a3d8212196d8?q=80&w=1974&auto=format&fit=crop', canteen: 'Campus Mart' },
];

const mockOrders: Order[] = [
  { order_id: 101, student_id: 1, items: [mockMenuItems[0], mockMenuItems[4]], totalAmount: 110.00, payment_form: 'UPI', payment_date: '2023-10-27' },
  { order_id: 102, student_id: 1, items: [mockMenuItems[2]], totalAmount: 40.00, payment_form: 'Cash', payment_date: '2023-10-26' },
];

const mockFeedback: Feedback[] = [
  { feedback_id: 1, menu_item_id: 2, menu_item_name: 'Chole Bhature', student_id: 1, student_name: 'Rohan Sharma', response: 'The chole bhature was amazing! Best I have ever had.', staff_response: null },
  { feedback_id: 2, menu_item_id: 3, menu_item_name: 'Veg Fried Rice', student_id: 2, student_name: 'Priya Patel', response: 'It was a bit too oily for my taste.', staff_response: 'Thank you for your feedback! We will adjust the preparation.' },
];


// Mock Service Functions
const delay = <T,>(data: T, ms = 500): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(data), ms));

const getCanteens = (): Promise<Canteen[]> => {
    return delay(mockCanteens);
}

const getMenuItems = (): Promise<MenuItem[]> => {
  return delay(mockMenuItems);
};

const getMenuItemsByCanteen = (canteenName: string): Promise<MenuItem[]> => {
    const items = mockMenuItems.filter(item => item.canteen === canteenName);
    return delay(items);
};

const getStudentOrders = (studentId: number): Promise<Order[]> => {
  const studentOrders = mockOrders.filter(o => o.student_id === studentId);
  return delay(studentOrders);
};

const getTotalSales = (): Promise<number> => {
  const total = mockOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  return delay(total);
};

const getFeedback = (): Promise<Feedback[]> => {
  return delay(mockFeedback);
};

export const canteenService = {
  getCanteens,
  getMenuItems,
  getMenuItemsByCanteen,
  getStudentOrders,
  getTotalSales,
  getFeedback,
};
export type View = 'loginSelector' | 'studentLogin' | 'canteenSelector' | 'menu' | 'admin' | 'home';

export interface Canteen {
  id: number;
  name: string;
  description: string;
  image: string;
}

export interface Student {
  student_id: number;
  name: string;
  department: string;
  phone: string;
  dob: string; // Date as string
  age: number;
  address_id: number;
  srn: string;
  email: string;
  semester: number;
}

export interface StaffAdmin {
  staff_id: number;
  name: string;
  email: string;
  phone: string;
}

export interface DeliveryAgent {
  delivery_id: number;
  name: string;
  phone: string;
  status: 'available' | 'on-delivery' | 'offline';
  shift_time: 'morning' | 'evening';
}

export interface MenuItem {
  menu_item_id: number;
  name: string;
  shift_menu: 'breakfast' | 'lunch' | 'dinner' | 'anytime';
  staff_id: number;
  stock: number;
  price: number;
  image: string;
  canteen: string;
}

export interface Order {
  order_id: number;
  student_id: number;
  items: MenuItem[];
  totalAmount: number;
  payment_form: string;
  payment_date: string;
}

export interface Feedback {
  feedback_id: number;
  menu_item_id: number;
  menu_item_name: string;
  student_id: number;
  student_name: string;
  response: string;
  staff_response: string | null;
}

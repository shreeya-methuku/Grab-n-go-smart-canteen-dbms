import React, { useState, useEffect, useMemo } from 'react';

import { loginStudent, fetchMenu, placeOrder, loginAdmin, fetchOrdersForCanteen, updateStock, getStudentOrderHistory, fetchTotalSalesByDate } from './services/canteenService'; 
import { User, Shield, Loader2, ArrowLeft, MapPin, ShoppingCart, X, Trash2, Plus, Minus, Settings, RefreshCw, History, DollarSign, Calendar } from 'lucide-react';
// --- NEW IMAGE IMPORTS ---
import NewBackgroundImage from './assets/images/DSC_9233.jpg';
import SouthCanteenImage from './assets/images/SouthCanteen.jpg';
import HornbillCafeImage from './assets/images/Hornbill.jpg';

// --- TYPE DEFINITIONS (No Changes) ---
export type Student = { student_id: number; name: string; };
export type Admin = { staff_id: number; name: string; canteen_id: number; };
export type Canteen = { canteen_id: number; name: string; location: string; image_url?: string; };
export type MenuItem = { menu_item_id: number; name: string; price: number; stock: number; image_url: string; };
export type CartItem = MenuItem & { quantity: number; };
export type Order = { order_id: number; order_date: string; total_amount: number; status: string; student_name: string; };

export type OrderHistoryItem = { order_id: number; menu_item: string; amount: number; form_of_payment: string; paid_by: string; };
// Add a new view for the order history page
export type View = 'loginSelector' | 'studentLogin' | 'adminLogin' | 'canteenSelector' | 'menu' | 'orderSuccess' | 'adminDashboard' | 'orderHistory';
// --- Reusable UI Components (No Changes) ---
const Spinner = () => <Loader2 className="animate-spin h-6 w-6 text-white" />;
const PageSpinner = () => <div className="flex justify-center mt-20"><Loader2 className="animate-spin h-10 w-10 text-orange-500" /></div>;

// --- HEADER (No Changes) ---
const Header = ({ user, admin, onLogout, onViewChange, cartCount, onCartClick }) => (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => (user && onViewChange('canteenSelector')) || (admin && onViewChange('adminDashboard'))}>
            <span className="text-3xl font-bold text-orange-500">✨</span>
            <span className="text-2xl font-bold text-gray-800">Grab 'n Go</span>
        </div>
        {(user || admin) && (
            <div className="flex items-center gap-6">
                <span className="font-medium text-gray-700">Welcome, {user?.name || admin?.name}</span>
                {user && (
                    <>
                        <button onClick={() => onViewChange('orderHistory')} className="relative text-gray-600 hover:text-orange-500" title="Order History">
                            <History size={24} />
                        </button>
                        <button onClick={onCartClick} className="relative text-gray-600 hover:text-orange-500" title="View Cart">
                            <ShoppingCart size={24} />
                            {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>}
                        </button>
                    </>
                )}
                 {admin && <Settings size={24} className="text-gray-600" />}
                <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors">
                    Logout
                </button>
            </div>
        )}
    </header>
);

// --- MODIFIED BACKGROUND COMPONENT ---
// The URL is now updated to use your new imported background image.
const Background = () => (
    <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat z-0" style={{ backgroundImage: `url(${NewBackgroundImage})`, filter: 'blur(4px) brightness(0.7)' }}></div>
);

// --- LOGIN & OTHER PAGES (No Changes, they will automatically use the updated Background component) ---
const LoginSelector = ({ onSelect }) => (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white p-4 font-sans">
        <Background />
        <div className="relative z-10 text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 flex items-center gap-4 justify-center">
                <span className="text-5xl">✨</span> Welcome to Grab 'n Go
            </h1>
            <p className="text-lg md:text-xl mb-12">The easiest way to order food on campus. Please select your role to continue.</p>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div onClick={() => onSelect('student')} className="bg-white/20 backdrop-blur-md p-8 rounded-2xl border border-white/30 cursor-pointer text-left hover:bg-white/30 transition-all shadow-lg">
                    <User className="w-10 h-10 text-orange-400 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">I'm a Student</h2>
                    <p className="opacity-80">Browse menus, place orders, and view your order history.</p>
                </div>
                <div onClick={() => onSelect('admin')} className="bg-white/20 backdrop-blur-md p-8 rounded-2xl border border-white/30 cursor-pointer text-left hover:bg-white/30 transition-all shadow-lg">
                    <Shield className="w-10 h-10 text-orange-400 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">I'm an Administrator</h2>
                    <p className="opacity-80">Manage stock, view sales, and update menu items.</p>
                </div>
            </div>
        </div>
    </div>
);
const StudentLoginPage = ({ onLogin, onBack }) => {
    const [studentId, setStudentId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setError(null); setLoading(true);
        try { await onLogin(studentId, password); } catch (err) { setError((err as Error).message); } finally { setLoading(false); }
    };
    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 font-sans">
            <Background />
            <div className="relative z-10 p-10 bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <button onClick={onBack} className="absolute top-4 left-4 text-sm text-gray-600 hover:text-black">&larr; Back</button>
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Student Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-5"><label className="block text-gray-700">Student ID</label><input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} className="w-full input" placeholder="e.g., 1" required /></div>
                    <div className="mb-8"><label className="block text-gray-700">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full input" placeholder="••••••••" required /></div>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full btn-primary">{loading ? <Spinner /> : 'Login'}</button>
                </form>
            </div>
        </div>
    );
};
const AdminLoginPage = ({ onLogin, onBack }) => {
    const [adminId, setAdminId] = useState('');
    const [canteenName, setCanteenName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setError(null); setLoading(true);
        try { await onLogin(adminId, canteenName, password); } catch (err) { setError((err as Error).message); } finally { setLoading(false); }
    };
    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 font-sans">
            <Background />
            <div className="relative z-10 p-10 bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <button onClick={onBack} className="absolute top-4 left-4 text-sm text-gray-600 hover:text-black">&larr; Back</button>
                <h2 className="text-3xl font-bold mb-8 text-center">Administrator Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-5"><label className="block text-gray-700">Admin ID</label><input type="text" value={adminId} onChange={(e) => setAdminId(e.target.value)} className="w-full input" placeholder="e.g., 1" required /></div>
                    <div className="mb-5"><label className="block text-gray-700">Canteen Name</label><input type="text" value={canteenName} onChange={(e) => setCanteenName(e.target.value)} className="w-full input" placeholder="e.g., Main Campus Canteen" required /></div>
                    <div className="mb-8"><label className="block text-gray-700">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full input" placeholder="••••••••" required /></div>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full btn-primary">{loading ? <Spinner /> : 'Login'}</button>
                </form>
            </div>
        </div>
    );
};

const OrderHistoryPage = ({ student }) => {
    const [history, setHistory] = useState<OrderHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchHistory = async () => {
            if (!student) return;
            try {
                const data = await getStudentOrderHistory(student.student_id);
                if (data.success) setHistory(data.orders);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [student]);

    if (loading) return <PageSpinner />;
    return (
        <div className="container mx-auto">
            <h2 className="text-4xl font-extrabold">Your Order History</h2>
            <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg">
                {history.length > 0 ? (
                    <table className="w-full text-left">
                        <thead><tr className="border-b"><th className="p-2">Order ID</th><th className="p-2">Item</th><th className="p-2">Amount</th><th className="p-2">Payment</th></tr></thead>
                        <tbody>{history.map(item => (<tr key={`${item.order_id}-${item.menu_item}`} className="border-b"><td className="p-2">{item.order_id}</td><td className="p-2">{item.menu_item}</td><td className="p-2">₹{item.amount.toFixed(2)}</td><td className="p-2">{item.form_of_payment}</td></tr>))}</tbody>
                    </table>
                ) : <p>You have no past orders.</p>}
            </div>
        </div>
    );
};


// --- MODIFIED CANTEEN SELECTION PAGE ---
const CanteenSelectionPage = ({ onSelectCanteen }) => {
    const [canteens, setCanteens] = useState<Canteen[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const getCanteens = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/canteens');
                const data = await res.json();
                if (data.success) { setCanteens(data.canteens); } else { throw new Error(data.message); }
            } catch (err) { setError('Failed to load canteens.'); } finally { setLoading(false); }
        };
        getCanteens();
    }, []);

    // This object maps specific canteen names to your new local images.
    const localCanteenImages: { [key: string]: string } = {
        'BE Block Canteen': SouthCanteenImage,
        'Hornbill Cafe': HornbillCafeImage,
    };

    if (loading) return <PageSpinner />;
    if (error) return <p className="text-center text-red-500 mt-16">{error}</p>;

    return (
        <div className="container mx-auto"><h2 className="text-4xl font-extrabold text-gray-800 my-8">Canteens</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {canteens.map((canteen) => {
                    // This line checks if a local image exists for the canteen.
                    // If it does, it uses it. Otherwise, it falls back to the URL from your database or a default.
                    const imageUrl = localCanteenImages[canteen.name] || canteen.image_url || `https://i.imgur.com/Kip3v1s.jpeg`;
                    return (
                        <div key={canteen.canteen_id} className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:-translate-y-2 transition-transform duration-300 group" onClick={() => onSelectCanteen(canteen)}>
                            <div className="h-56 overflow-hidden"><img src={imageUrl} alt={canteen.name} className="w-full h-full object-cover group-hover:scale-110" /></div>
                            <div className="p-6"><h3 className="text-2xl font-bold">{canteen.name}</h3><p className="text-gray-600 mt-2 flex items-center gap-2"><MapPin size={16} /> {canteen.location}</p></div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
// --- ALL OTHER COMPONENTS (Menu, Cart, etc.) have no changes ---
const MenuPage = ({ canteen, onBack, onAddToCart }) => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!canteen) return;
        const getMenu = async () => {
            setLoading(true);
            try { const menuData = await fetchMenu(canteen.canteen_id); if (menuData.success) setMenuItems(menuData.menu); } catch (err) { } finally { setLoading(false); }
        };
        getMenu();
    }, [canteen]);
    if (loading) return <PageSpinner />;
    return (
        <div className="container mx-auto">
            <button onClick={onBack} className="mb-6 text-orange-600 hover:underline flex items-center gap-2"><ArrowLeft size={16} /> Back</button>
            <h2 className="text-4xl font-extrabold">Menu: {canteen.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
                {menuItems.map((item) => (
                    <div key={item.menu_item_id} className={`bg-white rounded-2xl shadow-lg flex flex-col ${item.stock === 0 ? 'opacity-50' : 'hover:shadow-xl'}`}>
                        <img src={item.image_url || `https://i.imgur.com/Kip3v1s.jpeg`} alt={item.name} className="h-48 w-full object-cover rounded-t-2xl" />
                        <div className="p-5 flex flex-col flex-grow">
                            <h3 className="text-xl font-bold">{item.name}</h3>
                            <p className={`text-sm mb-4 ${item.stock < 10 && item.stock > 0 ? 'text-red-500' : 'text-gray-500'}`}>{item.stock > 0 ? `${item.stock} left` : 'Out of stock'}</p>
                            <div className="mt-auto flex justify-between items-center">
                                <span className="text-2xl font-bold text-green-600">₹{parseFloat(item.price.toString()).toFixed(2)}</span>
                                <button onClick={() => onAddToCart(item)} disabled={item.stock === 0} className="btn-primary">Add</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
const CartSidebar = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onPlaceOrder, student }) => {
    const totalAmount = useMemo(() => cartItems.reduce((sum, item) => sum + parseFloat(item.price.toString()) * item.quantity, 0), [cartItems]);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const handlePlaceOrder = async () => {
        setIsPlacingOrder(true);
        try { await onPlaceOrder({ studentId: student.student_id, cartItems, totalAmount }); } catch (error) { alert('Could not place order.'); } finally { setIsPlacingOrder(false); }
    };
    return (
        <div className={`fixed top-0 right-0 h-full w-full md:w-1/3 bg-white shadow-2xl transform transition-transform z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex flex-col h-full"><header className="p-4 flex justify-between items-center border-b"><h2 className="text-2xl font-bold">Your Cart</h2><button onClick={onClose}><X size={24} /></button></header>
                <div className="flex-grow p-4 overflow-y-auto">{cartItems.length === 0 ? <p>Your cart is empty.</p> : cartItems.map(item => (<div key={item.menu_item_id} className="flex items-center gap-4 mb-4"><img src={item.image_url} alt={item.name} className="w-20 h-20 rounded-lg" /><div className="flex-grow"><h3 className="font-bold">{item.name}</h3><p>₹{parseFloat(item.price.toString()).toFixed(2)}</p><div className="flex items-center gap-2 mt-2"><button onClick={() => onUpdateQuantity(item.menu_item_id, item.quantity - 1)} className="border rounded-full p-1"><Minus size={12} /></button><span>{item.quantity}</span><button onClick={() => onUpdateQuantity(item.menu_item_id, item.quantity + 1)} className="border rounded-full p-1"><Plus size={12} /></button></div></div><button onClick={() => onRemoveItem(item.menu_item_id)} className="text-red-500"><Trash2 size={20} /></button></div>))}</div>
                <footer className="p-4 border-t bg-gray-50"><div className="flex justify-between font-bold text-xl mb-4"><span>Total</span><span>₹{totalAmount.toFixed(2)}</span></div><button onClick={handlePlaceOrder} disabled={cartItems.length === 0 || isPlacingOrder} className="w-full bg-green-500 text-white py-3 rounded-lg font-bold">{isPlacingOrder ? <Spinner /> : 'Place Order & Pay'}</button></footer>
            </div>
        </div>
    );
};
const OrderSuccessPage = ({ onBackToMenu }) => (
    <div className="text-center py-20"><h2 className="text-4xl font-extrabold text-green-500 mb-4">Order Placed!</h2><p className="mb-8">Thank you! You can pick it up in 15 minutes.</p><button onClick={onBackToMenu} className="btn-primary">Order More</button></div>
);

const AdminDashboard = ({ admin }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [salesDate, setSalesDate] = useState(new Date().toISOString().split('T')[0]);
    const [totalSales, setTotalSales] = useState<number | null>(null);
    const [salesLoading, setSalesLoading] = useState(false);
    const [orderFetchDate, setOrderFetchDate] = useState(new Date().toISOString().split('T')[0]);
    const [datedOrders, setDatedOrders] = useState<Order[]>([]);
    const [datedOrdersLoading, setDatedOrdersLoading] = useState(false);

    const fetchData = async () => {
        if (!admin) return;
        setLoading(true);
        setError(null);
        try {
            const [ordersData, menuData] = await Promise.all([
                fetchOrdersForCanteen(admin.canteen_id),
                fetchMenu(admin.canteen_id)
            ]);
            if (ordersData.success) setOrders(ordersData.orders); else throw new Error('Could not fetch orders.');
            if (menuData.success) setMenuItems(menuData.menu); else throw new Error('Could not fetch menu.');
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [admin]);

    const handleFetchSales = async () => {
        setSalesLoading(true);
        setTotalSales(null); 
        try {
            const data = await fetchTotalSalesByDate(salesDate);
            if (data.success) {
                // --- FIX #1: CONVERT THE API RESPONSE TO A NUMBER ---
                // This ensures that even if the API returns "150.00", it becomes the number 150.
                const salesAsNumber = parseFloat(data.totalSales);
                setTotalSales(salesAsNumber);
            } else {
                throw new Error(data.message || 'API call was not successful');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to fetch sales data.');
        } finally {
            setSalesLoading(false);
        }
    };
    if (loading) return <PageSpinner />;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    const handleStockChange = async (itemId: number, newStock: number) => {
        if (newStock < 0) return;
        try {
            await updateStock(itemId, newStock);
            // Refresh menu items locally without a full refetch
            setMenuItems(prev => prev.map(item => item.menu_item_id === itemId ? { ...item, stock: newStock } : item));
        } catch (err) {
            alert('Failed to update stock.');
        }
    };

    if (loading) return <PageSpinner />;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center">
                <h2 className="text-4xl font-extrabold">Admin Dashboard</h2>
                <button onClick={fetchData} className="p-2 rounded-full hover:bg-gray-200 transition-colors"><RefreshCw size={20} /></button>
            </div>
            <p className="text-lg text-gray-500 mt-2">Welcome, {admin.name}. You are managing Canteen ID: {admin.canteen_id}.</p>

            <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="font-bold text-2xl mb-4">Daily Sales Report</h3>
                <div className="flex items-center gap-4">
                    <input type="date" value={salesDate} onChange={(e) => setSalesDate(e.target.value)} className="input"/>
                    <button onClick={handleFetchSales} disabled={salesLoading} className="btn-primary flex items-center gap-2">{salesLoading ? <Spinner/> : <><Calendar size={16}/> Get Sales</>}</button>
    
                </div>
                {typeof totalSales === 'number' && (
                    <p className="mt-4 text-2xl font-bold">
                        Total Sales for {salesDate}: <span className="text-green-600">₹{totalSales.toFixed(2)}</span>
                    </p>
                )}
                
            </div>
            

            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Live Orders Section */}
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="font-bold text-2xl mb-4">Live Orders</h3>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {orders.length > 0 ? orders.map(order => (
                            <div key={order.order_id} className="p-4 border rounded-lg">
                                <div className="flex justify-between font-semibold">
                                    <span>Order #{order.order_id} by {order.student_name}</span>
                                    <span className="text-green-600">₹{parseFloat(order.total_amount.toString()).toFixed(2)}</span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {new Date(order.order_date).toLocaleString()} - <span className="font-medium text-blue-600">{order.status}</span>
                                </div>
                            </div>
                        )) : <p>No orders yet.</p>}
                    </div>
                </div>

                {/* Stock Management Section */}
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="font-bold text-2xl mb-4">Stock Management</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {menuItems.map(item => (
                            <div key={item.menu_item_id} className="flex items-center justify-between p-2 border-b">
                                <span className="font-medium">{item.name}</span>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => handleStockChange(item.menu_item_id, item.stock - 1)} className="p-1 border rounded-full">-</button>
                                    <span className="font-bold w-8 text-center">{item.stock}</span>
                                    <button onClick={() => handleStockChange(item.menu_item_id, item.stock + 1)} className="p-1 border rounded-full">+</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main App Component (No Changes) ---
const App = () => {
    const [view, setView] = useState<View>('loginSelector');
    const [user, setUser] = useState<Student | null>(null);
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [selectedCanteen, setSelectedCanteen] = useState<Canteen | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const handleRoleSelect = (role: 'student' | 'admin') => {
        if (role === 'student') setView('studentLogin');
        if (role === 'admin') setView('adminLogin');
    };

    const handleStudentLogin = async (studentId: string, password: string) => {
        const response = await loginStudent(studentId, password);
        setUser(response.student);
        setView('canteenSelector');
    };

    const handleAdminLogin = async (adminId: string, canteenName: string, password: string) => {
        const response = await loginAdmin(adminId, canteenName, password);
        setAdmin(response.admin);
        setView('adminDashboard');
    };

    const handleSelectCanteen = (canteen: Canteen) => {
        setSelectedCanteen(canteen);
        setView('menu');
    };

    const handleAddToCart = (item: MenuItem) => {
        setCart(prev => {
            const existing = prev.find(i => i.menu_item_id === item.menu_item_id);
            if (existing) { return prev.map(i => i.menu_item_id === item.menu_item_id ? { ...i, quantity: i.quantity + 1 } : i); }
            return [...prev, { ...item, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const handleUpdateCartQuantity = (itemId: number, quantity: number) => {
        if (quantity === 0) { handleRemoveFromCart(itemId); return; }
        setCart(prev => prev.map(i => i.menu_item_id === itemId ? { ...i, quantity } : i));
    };

    const handleRemoveFromCart = (itemId: number) => {
        setCart(prev => prev.filter(i => i.menu_item_id !== itemId));
    };

    const handlePlaceOrder = async (orderData) => {
        await placeOrder(orderData);
        setCart([]);
        setIsCartOpen(false);
        setView('orderSuccess');
    };

    const handleLogout = () => {
        setUser(null); setAdmin(null); setSelectedCanteen(null); setCart([]);
        setView('loginSelector');
    };

    const renderContent = () => {
        switch (view) {
            case 'loginSelector': return <LoginSelector onSelect={handleRoleSelect} />;
            case 'studentLogin': return <StudentLoginPage onLogin={handleStudentLogin} onBack={() => setView('loginSelector')} />;
            case 'adminLogin': return <AdminLoginPage onLogin={handleAdminLogin} onBack={() => setView('loginSelector')} />;
            case 'canteenSelector': return <CanteenSelectionPage onSelectCanteen={handleSelectCanteen} />;
            case 'menu': return <MenuPage canteen={selectedCanteen} onBack={() => setView('canteenSelector')} onAddToCart={handleAddToCart} />;
            case 'orderSuccess': return <OrderSuccessPage onBackToMenu={() => setView('menu')} />;
            case 'adminDashboard': return <AdminDashboard admin={admin} />;
            case 'orderHistory': return <OrderHistoryPage student={user} />;
            default: return <div>Not Found</div>;
        }
    };

    const showHeader = view !== 'loginSelector' && view !== 'studentLogin' && view !== 'adminLogin';

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {showHeader && <Header user={user} admin={admin} onLogout={handleLogout} onViewChange={setView} cartCount={cart.length} onCartClick={() => setIsCartOpen(true)} />}
            <main className={!showHeader ? "" : "p-4 sm:p-6 lg:p-8"}>
                {renderContent()}
            </main>
            {user && <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cart} onUpdateQuantity={handleUpdateCartQuantity} onRemoveItem={handleRemoveFromCart} onPlaceOrder={handlePlaceOrder} student={user} />}
        </div>
    );
};

export default App;

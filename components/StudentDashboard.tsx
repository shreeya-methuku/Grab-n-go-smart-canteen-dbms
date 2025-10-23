import React, { useState, useEffect, useMemo } from 'react';
import type { MenuItem, Order, Canteen } from '../types';
import { canteenService } from '../services/canteenService';
import { Card } from './Card';
import { Spinner } from './Spinner';
import { ShoppingCartIcon, PlusCircleIcon, CheckIcon } from './Icon';

interface MenuPageProps {
  canteen: Canteen;
}

const mealFilters: ('all' | MenuItem['shift_menu'])[] = ['all', 'breakfast', 'lunch', 'dinner', 'anytime'];

export const MenuPage: React.FC<MenuPageProps> = ({ canteen }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | MenuItem['shift_menu']>('all');
  const [addingItemId, setAddingItemId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [menuData, orderData] = await Promise.all([
        canteenService.getMenuItemsByCanteen(canteen.name),
        canteenService.getStudentOrders(1) // Assuming student_id 1 for demo
      ]);
      setMenuItems(menuData);
      setOrders(orderData);
      setLoading(false);
    };
    fetchData();
  }, [canteen]);

  const handleAddItem = (itemId: number) => {
    setAddingItemId(itemId);
    // In a real app, you'd dispatch an action to add to cart here.
    setTimeout(() => {
      setAddingItemId(null);
    }, 1500);
  };

  const filteredMenuItems = useMemo(() => {
    if (activeFilter === 'all') {
      return menuItems;
    }
    return menuItems.filter(item => item.shift_menu === activeFilter);
  }, [menuItems, activeFilter]);

  if (loading) return <div className="flex justify-center items-center h-64"><Spinner color="text-primary"/></div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
      <div className="lg:col-span-2">
        <h2 className="text-3xl font-bold mb-2 text-text-primary">Menu for {canteen.name}</h2>
        <p className="text-text-secondary mb-6">Explore delicious options available right now.</p>
        
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {mealFilters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 whitespace-nowrap ${
                activeFilter === filter
                  ? 'bg-primary text-white shadow'
                  : 'bg-card text-text-secondary hover:bg-stone-100'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-4 stagger-children">
          {filteredMenuItems.length > 0 ? filteredMenuItems.map((item, index) => (
            <Card 
              key={item.menu_item_id} 
              title={item.name} 
              imageUrl={item.image} 
              layout="horizontal"
              className="overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <p className="text-sm text-text-secondary capitalize mb-1">{item.shift_menu}</p>
                  <h3 className="text-lg font-bold text-text-primary mb-2">{item.name}</h3>
                   <p className={`text-xs font-semibold mb-3 ${item.stock > 5 ? 'text-green-600' : 'text-red-500'}`}>
                      {item.stock > 0 ? `${item.stock} servings left` : 'Out of Stock'}
                    </p>
                </div>
                <div className="flex justify-between items-end mt-2">
                  <p className="text-xl font-extrabold text-primary">₹{item.price.toFixed(2)}</p>
                  <button 
                    className={`flex items-center justify-center w-28 h-10 font-bold rounded-lg transition-all duration-300 disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed ${
                      addingItemId === item.menu_item_id
                        ? 'bg-green-500 text-white'
                        : 'bg-primary/10 hover:bg-primary/20 text-primary'
                    }`}
                    disabled={item.stock === 0 || addingItemId !== null}
                    onClick={() => handleAddItem(item.menu_item_id)}
                  >
                    {addingItemId === item.menu_item_id ? (
                      <CheckIcon />
                    ) : (
                      <>
                        <PlusCircleIcon />
                        <span className="ml-2 text-sm">Add</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </Card>
          )) : (
            <div className="text-center py-16 px-4 bg-card rounded-lg">
                <p className="text-text-secondary font-semibold">No {activeFilter} items available right now.</p>
                <p className="text-sm text-text-secondary mt-1">Try selecting another category!</p>
            </div>
          )}
        </div>
      </div>
      <div className="sticky top-20 self-start">
        <div className="flex items-center mb-6">
            <ShoppingCartIcon />
            <h2 className="text-2xl font-bold ml-3 text-text-primary">Your Orders</h2>
        </div>
        <div className="space-y-4">
          {orders.length > 0 ? orders.map(order => (
            <Card key={order.order_id} title={`Order #${order.order_id}`} >
              <ul className="space-y-1">
                {order.items.map(item => (
                  <li key={item.menu_item_id} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="font-medium">₹{item.price.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-border mt-3 pt-3">
                <p className="flex justify-between font-bold text-text-primary">
                  <span>Total:</span>
                  <span>₹{order.totalAmount.toFixed(2)}</span>
                </p>
                <p className="text-xs text-text-secondary mt-1">{new Date(order.payment_date).toLocaleDateString()}</p>
              </div>
            </Card>
          )) : (
            <div className="text-center py-10 px-4 bg-card rounded-lg border-2 border-dashed border-border">
                <p className="text-text-secondary font-medium">Your cart is empty</p>
                <p className="text-sm text-text-secondary mt-1">Add items from the menu to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
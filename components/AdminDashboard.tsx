import React, { useState, useEffect } from 'react';
import type { MenuItem, Feedback } from '../types';
import { canteenService } from '../services/canteenService';
import { Card } from './Card';
import { Spinner } from './Spinner';

export const AdminDashboard: React.FC = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [salesData, menuData, feedbackData] = await Promise.all([
        canteenService.getTotalSales(),
        canteenService.getMenuItems(),
        canteenService.getFeedback()
      ]);
      setTotalSales(salesData);
      setMenuItems(menuData);
      setFeedback(feedbackData);
      setLoading(false);
    };
    fetchData();
  }, []);
  
  if (loading) return <div className="flex justify-center items-center h-64"><Spinner color="text-primary" /></div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
      <Card title="Total Sales Today" className="md:col-span-2 lg:col-span-1 bg-gradient-to-br from-primary to-orange-600 text-white">
        <p className="text-4xl font-extrabold">₹{totalSales.toFixed(2)}</p>
        <p className="text-sm text-orange-100 mt-1">Updated in real-time</p>
      </Card>

      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold mb-4 text-text-primary">Stock Levels</h2>
        <Card title="">
          <ul className="space-y-4">
            {menuItems.map((item, index) => (
              <li key={item.menu_item_id} className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <p className="text-xs text-text-secondary">{item.canteen}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-border rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`${item.stock > 5 ? 'bg-primary' : 'bg-red-500'} h-2.5 rounded-full transition-colors duration-500 animate-fill-bar`}
                      style={{ 
                          '--target-width': `${Math.min(item.stock * 10, 100)}%`,
                           animationDelay: `${index * 100}ms` 
                        } as React.CSSProperties}
                    ></div>
                  </div>
                  <span className={`text-sm font-bold w-16 text-right ${item.stock > 5 ? 'text-text-secondary' : 'text-red-500'}`}>
                    {item.stock} units
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="md:col-span-2 lg:col-span-3">
        <h2 className="text-2xl font-bold mb-4 text-text-primary">Recent Feedback</h2>
        <div className="space-y-4">
          {feedback.map(f => (
            <Card key={f.feedback_id} title={`Feedback on ${f.menu_item_name}`}>
              <blockquote className="border-l-4 border-secondary pl-4 italic text-text-secondary">
                "{f.response}"
              </blockquote>
              <p className="text-xs text-text-secondary mt-2">from {f.student_name}</p>
              {f.staff_response ? (
                 <div className="mt-3 pt-3 border-t border-border">
                  <p className="font-semibold text-primary">Staff Response:</p>
                  <p className="text-sm text-text-primary">{f.staff_response}</p>
                </div>
              ) : (
                <button className="mt-4 bg-secondary hover:bg-amber-600 text-white font-bold py-1 px-3 rounded-lg text-sm transition-colors duration-200">
                  Respond
                </button>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import type { Canteen } from '../types';
import { Card } from './Card';
import { canteenService } from '../services/canteenService';
import { Spinner } from './Spinner';

interface CanteenSelectionPageProps {
    onSelectCanteen: (canteen: Canteen) => void;
}

export const CanteenSelectionPage: React.FC<CanteenSelectionPageProps> = ({ onSelectCanteen }) => {
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCanteens = async () => {
      setLoading(true);
      const allCanteens = await canteenService.getCanteens();
      setCanteens(allCanteens);
      setLoading(false);
    };
    fetchCanteens();
  }, []);

  return (
    <div className="animate-fade-in-up">
      <div className="text-center py-8 sm:py-12 px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary leading-tight tracking-tight">
          Find Your Flavor
        </h1>
        <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
          Explore the diverse canteens on campus and discover your next favorite meal.
        </p>
      </div>
      
      <div className="mt-8">
        {loading ? (
           <div className="flex justify-center items-center h-40"><Spinner color="text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
            {canteens.map((canteen, index) => (
              <Card 
                key={canteen.id}
                layout="vertical"
                title={canteen.name}
                description={canteen.description}
                imageUrl={canteen.image}
                onClick={() => onSelectCanteen(canteen)}
                className="transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};